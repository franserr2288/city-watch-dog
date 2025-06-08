import type { City311Report } from 'src/ingestion/city-311/clients/city-311-report-schema';
import type { BatchResult } from './pagination';

export interface City311DataRequestNeeds {
  getSnapshotBatches(): AsyncGenerator<
    BatchResult<City311Report>,
    void,
    unknown
  >;
  getBackfillBatches(): AsyncGenerator<
    BatchResult<City311Report>,
    void,
    unknown
  >;
  detectNewRecordsAndUpdatedRecordsSinceLastCheck(): AsyncGenerator<
    BatchResult<City311Report>,
    void,
    unknown
  >;
}
