import type { City311ApiClient } from './clients/socrata-311-api-client.ts';
import type { City311Report } from './validation/city-311-report-schema.ts';

interface IIntakeExtractor<T> {
  backfill(): Promise<T[]>;
  snapshot(): Promise<T[]>;
  detectChanges(): Promise<T[]>;
}

export default class City311Extractor
  implements IIntakeExtractor<City311Report>
{
  constructor(private socrataApiClient: City311ApiClient) {}

  public async backfill(): Promise<City311Report[]> {
    const reports = await this.socrataApiClient.getAllBackfillReports();
    return reports;
  }
  public async snapshot(): Promise<City311Report[]> {
    const reports = await this.socrataApiClient.getSnapshotOfReports();
    return reports;
  }

  public async detectChanges(): Promise<City311Report[]> {
    const updatedAndNewRecords = await this.socrataApiClient.detectChanges();
    return updatedAndNewRecords;
  }
}
