import type { City311Report } from 'src/ingestion/city-311/validation/city-311-report-schema';

export interface City311DataRequestNeeds {
  getSnapshotOfReports(): Promise<City311Report[]>;
  getAllBackfillReports(): Promise<City311Report[]>;
  detectChanges(): Promise<City311Report[]>;
}
