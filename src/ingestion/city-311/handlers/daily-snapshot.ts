import { getEnvVar } from 'src/lib/config/env-loader';
import { City311ApiClient } from '../clients/socrata-311-api-client';
import { DataSource } from 'src/lib/constants/socrata-constants';
import BlobStorageClient from 'src/lib/clients/cloud/blob-client';
import { MyLA311ServiceRequest } from 'src/lib/types/models/city-311-report';
import City311Extractor from '../extractor';

export default async function handler(event, context): Promise<void> {
  try {
    console.log(`EVENT DATA ${event}`);
    console.log(`EXCECUTION CONTEXT ${context}`);

    const dataSourceApiClient = new City311ApiClient();
    const blobStorageClient = new BlobStorageClient<MyLA311ServiceRequest>(
      getEnvVar('DAILY_SNAPSHOT_BUCKET'),
    );
    const dataExtractor: City311Extractor = new City311Extractor(
      dataSourceApiClient,
    );

    await blobStorageClient.streamData(DataSource.Requests311, {
      dataGenerator: dataExtractor.snapshot(),
      compress: true,
    });
  } catch (error) {
    console.error('Error occurred in scheduled Lambda:', error);
    throw error;
  }
}
