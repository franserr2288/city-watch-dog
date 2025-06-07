import type { City311Report } from 'src/ingestion/city-311/validation/city-311-report-schema';
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
  detectNewRecordBatchesSinceLastChange(): AsyncGenerator<
    BatchResult<City311Report>,
    void,
    unknown
  >;
  detectUpdatedRecordBatchesSinceLastChange(): AsyncGenerator<
    BatchResult<City311Report>,
    void,
    unknown
  >;
}
