import type { City311ExternalModel } from 'src/ingestion/city-311/clients/city-311-report-schema';
import { City311ApiClient } from 'src/ingestion/city-311/clients/socrata-311-api-client';
import type {
  BatchResult,
  City311PaginationCursor,
} from 'src/lib/types/behaviors/pagination';

describe('City311ApiClient Live API Workflows', () => {
  let apiClient: City311ApiClient;

  beforeAll(() => {
    apiClient = new City311ApiClient();
  });

  describe('Live API Connectivity', () => {
    it('should successfully fetch a small batch of real 311 data', async () => {
      const batches: BatchResult<City311ExternalModel>[] = [];
      let recordCount = 0;

      // first batch only
      for await (const batch of apiClient.getSnapshotBatches()) {
        batches.push(batch);
        recordCount += batch.data.length;

        break;
      }

      expect(batches).toHaveLength(1);
      expect(recordCount).toBeGreaterThan(0);

      const firstRecord = batches[0].data[0];
      expect(firstRecord).toMatchObject({
        srnumber: expect.any(String),
        createddate: expect.any(String),
        requesttype: expect.any(String),
        status: expect.any(String),
      });
      console.log(
        `Live API test: Retrieved ${recordCount} records from Socrata API`,
      );
      console.log(
        `Sample record: SR# ${firstRecord.srnumber}, Type: ${firstRecord.requesttype}`,
      );
    }, 30_000);
  });

  describe('Change Detection Workflow', () => {
    it.only('should detect recent changes from live API', async () => {
      const batches: BatchResult<City311ExternalModel>[] = [];
      let totalRecords = 0;

      for await (const batch of apiClient.detectNewRecordsAndUpdatedRecordsSinceLastCheck()) {
        batches.push(batch);
        totalRecords += batch.data.length;

        if (totalRecords >= 100 || batches.length >= 3) {
          break;
        }
      }

      expect(batches.length).toBeGreaterThan(0);
      expect(totalRecords).toBeGreaterThan(0);

      // verify records are sorted by creation date
      const allRecords = batches.flatMap((batch) => batch.data);
      for (let i = 1; i < allRecords.length; i++) {
        const prevDate = new Date(allRecords[i - 1].createddate);
        const currDate = new Date(allRecords[i].createddate);
        expect(currDate.getTime()).toBeGreaterThanOrEqual(prevDate.getTime());
      }

      console.log(`Change detection: Found ${totalRecords} recent records`);
      console.log(`Processed ${batches.length} batches successfully`);
    }, 45_000);
  });

  describe('Pagination Workflow', () => {
    it('should handle pagination cursors correctly with live data', async () => {
      const batches: BatchResult<City311ExternalModel>[] = [];
      let previousCursor: City311PaginationCursor | null = null;

      // get multiple small batches
      for await (const batch of apiClient.getSnapshotBatches()) {
        batches.push(batch);

        // check if cursor is moving forward
        if (previousCursor && batch.cursor) {
          // cursor should change between batches
          expect(batch.cursor).not.toEqual(previousCursor);
        }

        previousCursor = batch.cursor;

        if (batches.length >= 3) {
          break;
        }
      }

      expect(batches.length).toBeGreaterThan(0);

      // verify no duplicate records across batches
      const allSRNumbers = batches.flatMap((batch) =>
        batch.data.map((record) => record.srnumber),
      );
      const uniqueSRNumbers = new Set(allSRNumbers);
      expect(uniqueSRNumbers.size).toBe(allSRNumbers.length);

      console.log(
        `Pagination test: ${batches.length} batches, ${allSRNumbers.length} unique records`,
      );
    }, 60_000);
  });
});
