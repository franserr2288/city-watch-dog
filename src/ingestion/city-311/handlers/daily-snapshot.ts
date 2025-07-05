import { City311ApiClient } from '../clients/socrata-311-api-client';
import { DataSource } from 'src/lib/clients/socrata/socrata-constants';
import BlobStorageClient from 'src/lib/clients/infrastructure/blob/blob-client';
import { ServiceRequest } from 'src/lib/logs/types/models/service-request';
import City311Extractor from '../extractor';
import { getEnvVar } from 'src/lib/config/env';
import {
  GenerateSuccessMessage,
  type LambdaTimeTriggerEventResponse,
} from 'src/lib/logs/types/responses/time-trigger-lambda-response';

export default async function handler(
  event,
  context,
): Promise<LambdaTimeTriggerEventResponse> {
  try {
    console.log(`EVENT DATA ${event}`);
    console.log(`EXCECUTION CONTEXT ${context}`);

    const dataSourceApiClient = new City311ApiClient();
    const blobStorageClient = new BlobStorageClient<ServiceRequest>(
      getEnvVar('DAILY_SNAPSHOT_BUCKET'),
    );
    const dataExtractor: City311Extractor = new City311Extractor(
      dataSourceApiClient,
    );

    await blobStorageClient.streamData(DataSource.Requests311, {
      dataGenerator: dataExtractor.snapshot(),
      compress: true,
    });
    return GenerateSuccessMessage('daily-snapshot');
  } catch (error) {
    console.error('Error occurred in scheduled Lambda:', error);
    throw error;
  }
}
