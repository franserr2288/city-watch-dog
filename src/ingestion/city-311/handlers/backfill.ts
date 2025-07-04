import TableStorageClient from 'src/lib/clients/infrastructure/table/table-client';
import { getEnvVar } from 'src/lib/config/internal/env-loader';
import { City311ApiClient } from '../clients/socrata-311-api-client';
import City311Extractor from '../extractor';
import { MyLA311ServiceRequest } from 'src/lib/types/models/city-311-report';

export default async function handler(event, context): Promise<void> {
  try {
    console.log(`EVENT DATA ${event}`);
    console.log(`EXCECUTION CONTEXT ${context}`);

    const dataSourceApiClient = new City311ApiClient();
    const inTakeTableStorageCLient: TableStorageClient<MyLA311ServiceRequest> =
      new TableStorageClient(getEnvVar('DAILY_SNAPSHOT_BUCKET'));
    const dataExtractor: City311Extractor = new City311Extractor(
      dataSourceApiClient,
    );

    for await (const chunk of dataExtractor.backfill()) {
      await inTakeTableStorageCLient.storeData(chunk);
    }
  } catch (error) {
    console.error('Error occurred in scheduled Lambda:', error);
    throw error;
  }
}
