import type { City311ExternalModel } from 'src/ingestion/city-311/clients/city-311-report-schema';
import type { BatchResult, City311PaginationCursor } from './pagination';

export interface City311DataRequestNeeds {
  getSnapshotBatches(
    lastCheck: City311PaginationCursor | null,
  ): AsyncGenerator<BatchResult<City311ExternalModel>, void, unknown>;
  getBackfillBatches(
    lastCheck: City311PaginationCursor | null,
  ): AsyncGenerator<BatchResult<City311ExternalModel>, void, unknown>;
  detectNewRecordsAndUpdatedRecordsSinceLastCheck(): AsyncGenerator<
    BatchResult<City311ExternalModel>,
    void,
    unknown
  >;
}
