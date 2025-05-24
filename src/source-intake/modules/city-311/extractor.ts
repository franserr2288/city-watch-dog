import type { ExtractedDataWriterInterface } from '#shared/types/extracted-data-storage-interfaces.ts';
import { DataSource } from '#source-intake/config/sources.ts';
import type { BaseExtractor } from '../common/extractor-base.ts';
import type { City311ApiClient } from './api/client.ts';
import type City311ReportSchema from './api/schema.ts';

export default class City311Extractor
  implements BaseExtractor<typeof City311ReportSchema>
{
  private socrataApiClient: City311ApiClient;
  private storageClient: ExtractedDataWriterInterface<
    typeof City311ReportSchema
  >;

  constructor(
    datasetApiClient: City311ApiClient,
    storageClient: ExtractedDataWriterInterface<typeof City311ReportSchema>,
  ) {
    this.socrataApiClient = datasetApiClient;
    this.storageClient = storageClient;
  }

  async extract(): Promise<Array<typeof City311ReportSchema>> {
    const reports = this.socrataApiClient.getReports({});
    await this.store(reports);
    return reports;
  }

  async store(data: Promise<Array<typeof City311ReportSchema>>): Promise<void> {
    await this.storageClient.storeData(DataSource.Requests311, data);
  }
}
