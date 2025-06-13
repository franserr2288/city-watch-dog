import TableStorageClient from 'src/lib/clients/infrastructure/table/table-client';
import { getEnvVar } from 'src/lib/config/internal/env-loader';
import { City311ApiClient } from '../clients/socrata-311-api-client';
import City311Extractor from '../extractor';
import { MyLA311ServiceRequest } from 'src/lib/types/models/city-311-report';
import type { CustomLogDescriptor } from 'src/lib/logs/base-log-shape';
import logger, {
  buildBaseLogContext,
  buildErrorLog,
} from 'src/lib/logs/logger';

export default async function handler(event, context): Promise<void> {
  const baseLogContext: Partial<CustomLogDescriptor> = buildBaseLogContext(
    context,
    'change-detection',
  );

  logger.info(
    {
      ...baseLogContext,
      event: typeof event === 'object' ? event : { raw: event },
    },
    'Lambda execution started',
  );

  try {
    logger.debug(baseLogContext, 'Initializing clients and extractor');

    const dataSourceApiClient = new City311ApiClient();
    const inTakeTableStorageCLient: TableStorageClient<MyLA311ServiceRequest> =
      new TableStorageClient(getEnvVar('DAILY_SNAPSHOT_BUCKET'));
    const dataExtractor: City311Extractor = new City311Extractor(
      dataSourceApiClient,
    );
    for await (const chunk of dataExtractor.detectChanges()) {
      await inTakeTableStorageCLient.storeData(chunk);
      logger.debug(baseLogContext, `Processing chunk`);
    }
    logger.info(baseLogContext, 'Lambda execution completed successfully');
  } catch (error) {
    const errorInfo: Partial<CustomLogDescriptor> = buildErrorLog(
      error,
      baseLogContext,
    );
    logger.error(errorInfo, 'Error occurred in scheduled Lambda');
    throw error;
  }
}
