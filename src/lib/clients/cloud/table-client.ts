import { getEnvVar } from 'src/lib/config/env-loader';
import {
  BatchWriteItemCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import type { DataSource } from 'src/lib/constants/socrata-constants';

export default class WatchdogTableStorageClient<T> {
  constructor(
    private tableName: string = getEnvVar('INTAKE_TABLE'),
    private region: string = getEnvVar('INFRA_REGION'),
    private dynamodb: DynamoDBClient,
  ) {
    this.dynamodb = dynamodb ?? new DynamoDBClient({ region });
  }

  public async storeData(dataSource: DataSource, data: T[]): Promise<void> {
    const chunks = this.chunkArray(data, 25);

    for (const chunk of chunks) {
      const putRequests = chunk.map((report) => ({
        PutRequest: {
          Item: marshall(report),
        },
      }));

      const command = new BatchWriteItemCommand({
        RequestItems: {
          [this.tableName]: putRequests,
        },
      });

      await this.dynamodb.send(command);
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
