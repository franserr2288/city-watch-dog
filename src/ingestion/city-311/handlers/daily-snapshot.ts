import S3StorageClient from 'src/lib/clients/cloud/blob-client';
import { getEnvVar } from 'src/lib/config/env-loader';
import { City311ApiClient } from '../clients/socrata-311-api-client';
import City311Extractor from '../extractor';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';


export default async function handler(event, context): Promise<void> {
  try {
    console.log(`EVENT DATA ${event}`);
    console.log(`EXCECUTION CONTEXT ${context}`);

    const city311client = new City311ApiClient();
    const blobStorageClient = new S3StorageClient(getEnvVar('S3_BUCKET_NAME'));
    const tableStorageClient = new 
    const extractor: City311Extractor = new City311Extractor(
      city311client,
      blobStorageClient,
    );

    await extractor.extract();
  } catch (error) {
    console.error('Error occurred in scheduled Lambda:', error);
    throw error;
  }
}
