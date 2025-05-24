import { SOCRATA_SOURCES } from '#shared/clients/gov-data/data-source-constants.ts';
import { BUCKET_REGION } from '#shared/clients/storage/constants.ts';
import S3StorageClient from '#shared/clients/storage/blob-client.ts';
import { getEnvVar } from '#shared/config/env-loader.ts';
import type { ExtradedDataStorageClientInterface } from '#shared/types/extracted-data-storage-interfaces.ts';
import { City311ApiClient } from '#source-intake/modules/city-311/api/client.ts';
import type City311ReportSchema from '#source-intake/modules/city-311/api/schema.ts';
import City311Extractor from '#source-intake/modules/city-311/extractor.ts';

export default async function handler(event, context): Promise<void> {
  try {
    console.log(`EVENT DATA ${event}`);
    console.log(`EXCECUTION CONTEXT ${context}`);

    const city311client: City311ApiClient = new City311ApiClient(
      getEnvVar('SOCRATA_APP_TOKEN'),
      SOCRATA_SOURCES.LA_CITY.DATASETS.CITY_311.CURRENT_YEAR.RESOURCE_ID,
      SOCRATA_SOURCES.LA_CITY.DATASETS.CITY_311.CURRENT_YEAR.YEAR,
    );

    const storageClient: ExtradedDataStorageClientInterface<
      typeof City311ReportSchema
    > = new S3StorageClient(getEnvVar('S3_BUCKET_NAME'), BUCKET_REGION);

    const extractor: City311Extractor = new City311Extractor(
      city311client,
      storageClient,
    );

    await extractor.extract();
  } catch (error) {
    console.error('Error occurred in scheduled Lambda:', error);
    throw error;
  }
}
