import { getEnvVar } from 'src/lib/config/env-loader';
import { City311ApiClient } from '../clients/socrata-311-api-client';
import { DataSource } from 'src/lib/constants/socrata-constants';
import BlobStorageClient from 'src/lib/clients/cloud/blob-client';
import { MyLA311ServiceRequest } from 'src/lib/types/models/city-311-report';
import { mapToStorageLayerModels } from 'src/ingestion/shared/maps';

export default async function handler(event, context): Promise<void> {
  try {
    console.log(`EVENT DATA ${event}`);
    console.log(`EXCECUTION CONTEXT ${context}`);

    const client = new City311ApiClient();
    const storageClient = new BlobStorageClient<MyLA311ServiceRequest>(
      getEnvVar('DAILY_SNAPSHOT_BUCKET'),
    );

    storageClient.streamData(DataSource.Requests311, {
      dataGenerator: mapToStorageLayerModels(client.getSnapshotBatches()),
      compress: true,
    });
  } catch (error) {
    console.error('Error occurred in scheduled Lambda:', error);
    throw error;
  }
}
