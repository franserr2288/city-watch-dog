import { samplePayload } from '../../data/lib/clients/sample-object';
import { DataSource } from 'src/lib/clients/socrata/socrata-constants';
import BlobStorageClient from 'src/lib/clients/infrastructure/blob/blob-client';
import { MyLA311ServiceRequest } from 'src/lib/types/models/city-311-report';
import { getEnvVar } from 'src/lib/config/env';

describe('BlobStorageClient Lifecycle', () => {
  let blobClient: BlobStorageClient<MyLA311ServiceRequest>;
  const testDataSource = DataSource.Requests311;

  beforeEach(() => {
    blobClient = new BlobStorageClient(getEnvVar('DAILY_SNAPSHOT_BUCKET'));
  });

  describe('Small Dataset Lifecycle', () => {
    it('should store small dataset and retrieve metadata', async () => {
      const testData = [
        samplePayload,
        { ...samplePayload, sr_number: 'SR2024-456' } as MyLA311ServiceRequest,
      ];

      const storeResult = await blobClient.storeSmallDataSet(
        testDataSource,
        testData,
      );

      expect(storeResult).toMatchObject({
        success: true,
        currentKey: expect.stringContaining('test-311-data/current.json'),
        snapshotKey: expect.stringContaining('test-311-data/archive/'),
      });

      const metadata = await blobClient.getMetadata(testDataSource);

      expect(metadata).toMatchObject({
        dataSource: testDataSource,
        recordCount: 2,
        fileName: expect.any(String),
        time: expect.any(String),
      });
    });

    it('should handle empty dataset storage', async () => {
      const emptyData: MyLA311ServiceRequest[] = [];

      const storeResult = await blobClient.storeSmallDataSet(
        testDataSource,
        emptyData,
      );

      expect(storeResult).toMatchObject({
        success: true,
      });

      const metadata = await blobClient.getMetadata(testDataSource);
      expect(metadata?.recordCount).toBe(0);
    });
  });

  describe('Streaming Data Lifecycle', () => {
    it('should stream data and retrieve it back in batches', async () => {
      const testBatches = [
        [samplePayload],
        [
          {
            ...samplePayload,
            sr_number: 'SR2024-456',
          } as MyLA311ServiceRequest,
        ],
        [
          {
            ...samplePayload,
            sr_number: 'SR2024-789',
          } as MyLA311ServiceRequest,
        ],
      ];

      async function* testDataGenerator() {
        for (const batch of testBatches) {
          yield batch;
        }
      }

      const streamResult = await blobClient.streamData(testDataSource, {
        dataGenerator: testDataGenerator(),
        compress: false,
        batchSize: 1,
      });

      expect(streamResult).toMatchObject({
        success: true,
        recordCount: 3,
      });

      const retrievedBatches: MyLA311ServiceRequest[][] = [];

      for await (const batch of blobClient.streamDataFromS3(testDataSource, {
        batchSize: 2,
        compressed: false,
      })) {
        retrievedBatches.push(batch);
      }

      const allRetrievedData = retrievedBatches.flat();
      expect(allRetrievedData).toHaveLength(3);

      const srNumbers = allRetrievedData.map((item) => item.sr_number);
      expect(srNumbers).toContain(samplePayload.sr_number);
      expect(srNumbers).toContain('SR2024-456');
      expect(srNumbers).toContain('SR2024-789');
    });

    it('should handle compressed streaming lifecycle', async () => {
      const testData = [
        samplePayload,
        {
          ...samplePayload,
          sr_number: 'SR2024-COMPRESSED',
        } as MyLA311ServiceRequest,
      ];

      async function* compressedDataGenerator() {
        yield testData;
      }

      const streamResult = await blobClient.streamData(testDataSource, {
        dataGenerator: compressedDataGenerator(),
        compress: true,
      });

      expect(streamResult).toMatchObject({
        success: true,
        recordCount: 2,
      });

      const retrievedBatches: MyLA311ServiceRequest[][] = [];

      for await (const batch of blobClient.streamDataFromS3(testDataSource, {
        compressed: true,
        batchSize: 10,
      })) {
        retrievedBatches.push(batch);
      }

      const allRetrievedData = retrievedBatches.flat();
      expect(allRetrievedData).toHaveLength(2);
      expect(allRetrievedData[1].sr_number).toBe('SR2024-COMPRESSED');
    });
  });

  describe('Mixed Operations Lifecycle', () => {
    it('should handle store then stream operations on same data source', async () => {
      const initialData = [samplePayload];
      await blobClient.storeSmallDataSet(testDataSource, initialData);

      let metadata = await blobClient.getMetadata(testDataSource);
      expect(metadata?.recordCount).toBe(1);

      async function* additionalDataGenerator() {
        yield [
          {
            ...samplePayload,
            sr_number: 'SR2024-STREAM1',
          } as MyLA311ServiceRequest,
        ];
        yield [
          {
            ...samplePayload,
            sr_number: 'SR2024-STREAM2',
          } as MyLA311ServiceRequest,
        ];
      }

      const streamResult = await blobClient.streamData(testDataSource, {
        dataGenerator: additionalDataGenerator(),
        compress: false,
      });

      expect(streamResult).toMatchObject({
        success: true,
        recordCount: 2,
      });

      // Verify metadata updated
      metadata = await blobClient.getMetadata(testDataSource);
      expect(metadata?.recordCount).toBe(2);

      // Verify we can retrieve the streamed data
      const retrievedBatches: MyLA311ServiceRequest[][] = [];

      for await (const batch of blobClient.streamDataFromS3(testDataSource)) {
        retrievedBatches.push(batch);
      }

      const allData = retrievedBatches.flat();
      expect(allData).toHaveLength(2);
      expect(allData.map((d) => d.sr_number)).toEqual([
        'SR2024-STREAM1',
        'SR2024-STREAM2',
      ]);
    });
  });

  //   describe('Error Scenarios', () => {
  //     it('should handle retrieval from non-existent data source', async () => {
  //       const nonExistentSource = 'non-existent-source' as any;

  //       // Should handle gracefully when no data exists
  //       await expect(async () => {
  //         const batches = [];
  //         for await (const batch of blobClient.streamDataFromS3(
  //           nonExistentSource,
  //         )) {
  //           batches.push(batch);
  //         }
  //       }).rejects.toThrow();

  //       // Metadata should return null for non-existent source
  //       const metadata = await blobClient.getMetadata(nonExistentSource);
  //       expect(metadata).toBeNull();
  //     });
  //   });
});
