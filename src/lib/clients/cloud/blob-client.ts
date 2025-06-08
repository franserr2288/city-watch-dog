import { getEnvVar } from 'src/lib/config/env-loader';
import type { DataSource } from 'src/lib/clients/socrata/socrata-constants';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { PassThrough, Readable } from 'stream';
import * as zlib from 'zlib';
import JSONStream from 'JSONStream';
import { createS3Client } from './local-dev';
const BUCKET_REGION = getEnvVar('INFRA_REGION');
const BUCKET_NAME = getEnvVar('DAILY_SNAPSHOT_BUCKET');

interface StreamingStorageOptions<T> {
  dataGenerator: AsyncGenerator<T[], void, unknown>;
  compress?: boolean;
  batchSize?: number;
}
interface SnapshotPayload<T> {
  metadata: {
    dataSource: string;
    fileName: string;
    time: string;
    recordCount: string;
  };
  data: T[];
}
// interface SnapshotPayload<T> extends SnapshotMetadata {
//   data: T[];
// }

export default class BlobStorageClient<T> {
  private s3: S3Client;
  private bucketName: string;

  constructor(
    bucketName: string = BUCKET_NAME,
    region: string = BUCKET_REGION,
    s3Client?: S3Client,
  ) {
    this.s3 = s3Client ?? createS3Client(region);
    this.bucketName = bucketName;
  }

  public async storeSmallDataSet(
    dataSource: DataSource,
    data: T[],
  ): Promise<object> {
    const { date, iso, safeTimestamp } = this.getTimestamps();
    const payload = {
      metadata: {
        dataSource: dataSource,
        fileName: safeTimestamp,
        time: iso,
        recordCount: data.length,
      },
      data: data,
    };

    const jsonData = JSON.stringify(payload, null, 2);

    const currentKey = this.getCurrentKey(dataSource);
    const snapshotKey = this.getDatedSnapshotKey(dataSource, date);

    const currentCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: currentKey,
      Body: jsonData,
      ContentType: 'application/json',
    });

    const snapshotCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: snapshotKey,
      Body: jsonData,
      ContentType: 'application/json',
    });

    try {
      await Promise.all([
        this.s3.send(currentCommand),
        this.s3.send(snapshotCommand),
      ]);
      return { success: true, currentKey, snapshotKey };
    } catch (error) {
      console.error(`Error storing ${dataSource} data:`, error);
      return {
        success: false,
        errorMessage: `An error occurred when storing the dataset ${dataSource}`,
      };
    }
  }

  async streamData(
    dataSource: DataSource,
    options: StreamingStorageOptions<T>,
  ): Promise<object> {
    const { dataGenerator, compress = true } = options;
    const { date, iso, safeTimestamp } = this.getTimestamps();

    const currentKey = this.getCurrentKey(dataSource);
    const snapshotKey = this.getDatedSnapshotKey(dataSource, date);

    try {
      const [currentResult] = await Promise.all([
        this.streamToS3(
          currentKey,
          dataSource,
          dataGenerator,
          compress,
          iso,
          safeTimestamp,
        ),
        this.streamToS3(
          snapshotKey,
          dataSource,
          dataGenerator,
          compress,
          iso,
          safeTimestamp,
        ),
      ]);

      return {
        success: true,
        currentKey,
        snapshotKey,
        recordCount: currentResult.recordCount,
      };
    } catch (error) {
      console.error(`Error streaming ${dataSource} data:`, error);
      return {
        success: false,
        errorMessage: `An error occurred when streaming the dataset ${dataSource}`,
      };
    }
  }

  private async streamToS3(
    key: string,
    dataSource: DataSource,
    dataGenerator: AsyncGenerator<T[], void, unknown>,
    compress: boolean,
    iso: string,
    safeTimestamp: string,
  ): Promise<{ recordCount: number }> {
    const stream = new PassThrough();
    let recordCount = 0;
    let isFirstBatch = true;

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: compress ? stream.pipe(zlib.createGzip()) : stream,
        ContentType: compress ? 'application/gzip' : 'application/json',
        ContentEncoding: compress ? 'gzip' : undefined,
      },
    });

    const uploadPromise = upload.done();

    stream.write('{\n');
    stream.write('  "metadata": {\n');
    stream.write(`    "dataSource": "${dataSource}",\n`);
    stream.write(`    "fileName": "${safeTimestamp}",\n`);
    stream.write(`    "time": "${iso}",\n`);
    stream.write('    "recordCount": 0\n');
    stream.write('  },\n');
    stream.write('  "data": [\n');

    try {
      for await (const batch of dataGenerator) {
        if (!isFirstBatch) {
          stream.write(',\n');
        }

        const batchJson = JSON.stringify(batch).slice(1, -1);
        if (batchJson.length > 0) {
          stream.write(batchJson);
          recordCount += batch.length;
        }

        isFirstBatch = false;
      }

      stream.write('\n  ]\n}');
      stream.end();

      await uploadPromise;
      return { recordCount };
    } catch (error) {
      stream.destroy();
      throw error;
    }
  }

  public async *streamDataFromS3(
    dataSource: DataSource,
    options: { batchSize?: number; compressed?: boolean } = {},
  ): AsyncGenerator<T[], void, undefined> {
    const { batchSize = 1000, compressed = false } = options;

    try {
      const key = this.getCurrentKey(dataSource);
      const stream = await this.getS3Stream(key, compressed);
      const jsonStream = stream.pipe(JSONStream.parse('data.*'));

      let batch: T[] = [];

      for await (const item of jsonStream) {
        batch.push(item);

        if (batch.length >= batchSize) {
          yield batch;
          batch = [];
        }
      }

      if (batch.length > 0) {
        yield batch;
      }
    } catch (error) {
      console.error(`Error streaming ${dataSource} data:`, error);
      throw error;
    }
  }

  public async getMetadata(
    dataSource: DataSource,
  ): Promise<SnapshotPayload<T>['metadata'] | null> {
    const key = this.getCurrentKey(dataSource);
    const stream = await this.getS3Stream(key);

    return new Promise((resolve, reject) => {
      const metadataStream = stream.pipe(JSONStream.parse('metadata'));

      metadataStream.on('data', (metadata) => {
        resolve(metadata);
      });

      metadataStream.on('error', reject);
      metadataStream.on('end', () => resolve(null));
    });
  }
  private async getS3Stream(
    key: string,
    compressed: boolean = false,
  ): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const response = await this.s3.send(command);
      if (!response.Body) {
        throw new Error(`Empty response for ${key}`);
      }

      let stream = response.Body as Readable;
      if (compressed) {
        stream = stream.pipe(zlib.createGunzip());
      }

      return stream;
    } catch (error) {
      console.error(`Error getting S3 stream for ${key}:`, error);
      throw error;
    }
  }

  private getTimestamps(dateTimeStamp?: Date): {
    date: Date;
    iso: string;
    safeTimestamp: string;
  } {
    const date = dateTimeStamp ?? new Date();
    const iso = date.toISOString();
    const safeTimestamp = iso.replace(/[:.]/g, '-');
    return { date, iso, safeTimestamp };
  }

  private getCurrentKey(dataSource: DataSource): string {
    return `${dataSource}/current.json`;
  }

  private getDatedSnapshotKey(dataSource: DataSource, timestamp: Date): string {
    const { safeTimestamp } = this.getTimestamps(timestamp);
    return `${dataSource}/archive/${safeTimestamp}.json`;
  }
}
