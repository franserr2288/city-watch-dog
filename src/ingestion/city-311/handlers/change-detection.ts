import TableStorageClient from 'src/lib/clients/cloud/table-client';
import { getEnvVar } from 'src/lib/config/env-loader';
import { City311ApiClient } from '../clients/socrata-311-api-client';
import City311Extractor from '../extractor';
import { MyLA311ServiceRequest } from 'src/lib/types/models/city-311-report';

export default async function handler(event, context): Promise<void> {
  try {
    console.log(`EVENT DATA ${event}`);
    console.log(`EXCECUTION CONTEXT ${context}`);

    const city311Client = new City311ApiClient();
    const inTakeTableStorageCLient: TableStorageClient<MyLA311ServiceRequest> =
      new TableStorageClient(getEnvVar('DAILY_SNAPSHOT_BUCKET'));
    const extractor: City311Extractor = new City311Extractor(city311Client);

    for await (const chunk of extractor.detectChanges()) {
      inTakeTableStorageCLient.storeData(chunk);
    }
  } catch (error) {
    console.error('Error occurred in scheduled Lambda:', error);
    throw error;
  }
}
