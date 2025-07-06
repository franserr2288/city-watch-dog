import type { City311ExternalModel } from 'src/ingestion/city-311/clients/city-311-report-schema';
import type { BatchResult } from './pagination';

export interface City311DataRequestNeeds {
  getSnapshotBatches(): AsyncGenerator<
    BatchResult<City311ExternalModel>,
    void,
    unknown
  >;
  getBackfillBatches(): AsyncGenerator<
    BatchResult<City311ExternalModel>,
    void,
    unknown
  >;
  detectNewRecordsAndUpdatedRecordsSinceLastCheck(): AsyncGenerator<
    BatchResult<City311ExternalModel>,
    void,
    unknown
  >;
}
