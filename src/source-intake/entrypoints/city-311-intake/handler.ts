import type { Context, ScheduledEvent } from 'aws-lambda';
import City311Extractor from '../../modules/city-311/extractor.js';
import { City311ApiClient } from '../../modules/city-311/api/client.js';
import { SOCRATA_SOURCES } from '../../../shared/api/socrata/data-source-constants.js';
import { getEnvVar } from '../../../shared/config/env-loader.js';
import S3StorageClient from '../../../shared/data/s3-client.js';
import { BUCKET_REGION } from '../../../shared/data/constants.js';
import { City311ReportSchema } from '../../modules/city-311/api/schema.js';
import type { ExtradedDataStorageClientInterface } from '../../../shared/interfaces/extracted-data-storage-interfaces.js';


export default async function handler(event: ScheduledEvent, context: Context) {
    try {
        const city311client: City311ApiClient = new City311ApiClient(
            getEnvVar('SOCRATA_API_KEY_SECRET'), 
            SOCRATA_SOURCES.LA_CITY.DATASETS.CITY_311.CURRENT_YEAR.RESOURCE_ID,
            SOCRATA_SOURCES.LA_CITY.DATASETS.CITY_311.CURRENT_YEAR.YEAR
        );

        const storageClient: ExtradedDataStorageClientInterface<typeof City311ReportSchema> = new S3StorageClient (
            getEnvVar('S3_BUCKET_NAME'),
            BUCKET_REGION
        );
    
        const extractor: City311Extractor = new City311Extractor(
            city311client, storageClient
        );

        await extractor.extract()

        return {
            statusCode: 200,
            body: 'Scheduled task completed successfully'
        };
    } catch (error) {
        console.error('Error occurred in scheduled Lambda:', error);
        return {
            statusCode: 400,
            body: 'Scheduled task not completed'
        };
    }
    
};