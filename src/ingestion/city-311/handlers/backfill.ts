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
    const blobStorageClient: TableStorageClient<MyLA311ServiceRequest> =
      new TableStorageClient(getEnvVar('S3_BUCKET_NAME'));
    const extractor: City311Extractor = new City311Extractor(city311Client);

    for await (const chunk of extractor.backfill()) {
      const modelInstances = chunk.data.map((i) =>
        MyLA311ServiceRequest.fromAPIJSON(i),
      );
      blobStorageClient.storeData(modelInstances);
    }
  } catch (error) {
    console.error('Error occurred in scheduled Lambda:', error);
    throw error;
  }
}
