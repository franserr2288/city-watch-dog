import { Context, ScheduledEvent } from 'aws-lambda';
import City311Extractor from '../../modules/city-311/extractor';
import { City311ApiClient } from '../../modules/city-311/api/client';
import { SOCRATA_SOURCES } from '../../../shared/api/socrata/data-source-constants';
import { getEnvVar } from '../../../shared/config/env-loader';
import ExtradedDataStorageClientInterface from '../../../shared/interfaces/extracted-data-storage-interface';
import S3StorageClient from '../../../shared/data/s3-client';
import { BUCKET_REGION } from '../../../shared/data/constants';
import { City311ReportSchema } from '../../modules/city-311/api/schema';


export const handler = async (event: ScheduledEvent, context: Context) => {
    
    const city311client: City311ApiClient = new City311ApiClient(
        getEnvVar('SOCRATA_APP_TOKEN'), 
        SOCRATA_SOURCES.LA_CITY.DATASETS.CITY_311.CURRENT_YEAR.RESOURCE_ID,
        SOCRATA_SOURCES.LA_CITY.DATASETS.CITY_311.CURRENT_YEAR.YEAR
    );

    const storageClient: ExtradedDataStorageClientInterface<typeof City311ReportSchema> = new S3StorageClient (
        getEnvVar('S3_STORAGE_BUCKET_NAME'),
        BUCKET_REGION
    );
    
    const extractor: City311Extractor = new City311Extractor(
        city311client, storageClient
    );

    extractor.extract()

    return {
        statusCode: 200,
        body: 'Scheduled task completed successfully'
    };
    
};