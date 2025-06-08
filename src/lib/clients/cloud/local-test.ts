import TableStorageClient from './table-client';
import { getEnvVar } from 'src/lib/config/env-loader';
import { City311ApiClient } from 'src/ingestion/city-311/clients/socrata-311-api-client';
import City311Extractor from 'src/ingestion/city-311/extractor';
import { MyLA311ServiceRequest } from 'src/lib/types/models/city-311-report';

const city311Client = new City311ApiClient();
const inTakeTableStorageCLient: TableStorageClient<MyLA311ServiceRequest> =
  new TableStorageClient(getEnvVar('DAILY_SNAPSHOT_BUCKET'));
const extractor: City311Extractor = new City311Extractor(city311Client);

for await (const chunk of extractor.backfill()) {
  inTakeTableStorageCLient.storeData(chunk);
}
