import { ServiceRequestTableClient } from 'src/lib/clients/infrastructure/table/table-client';
import { City311ApiClient } from '../clients/socrata-311-api-client';
import City311Extractor from '../extractor';
import type { CustomLogDescriptor } from 'src/lib/logs/base-log-shape';
import logger, {
  buildBaseLogContext,
  buildErrorLog,
} from 'src/lib/logs/logger';
import { getEnvVar } from 'src/lib/config/env';
import {
  GenerateSuccessMessage,
  type LambdaTimeTriggerEventResponse,
} from 'src/lib/types/responses/time-trigger-lambda-response';

export default async function handler(
  event,
  context,
): Promise<LambdaTimeTriggerEventResponse> {
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
    const inTakeTableStorageCLient: ServiceRequestTableClient =
      new ServiceRequestTableClient(getEnvVar('DAILY_SNAPSHOT_BUCKET'));
    const dataExtractor: City311Extractor = new City311Extractor(
      dataSourceApiClient,
    );
    for await (const chunk of dataExtractor.detectChanges()) {
      await inTakeTableStorageCLient.storeData(chunk);
      logger.debug(baseLogContext, `Processing chunk`);
    }
    logger.info(baseLogContext, 'Lambda execution completed successfully');
    return GenerateSuccessMessage('change-detection');
  } catch (error) {
    const errorInfo: Partial<CustomLogDescriptor> = buildErrorLog(
      error,
      baseLogContext,
    );
    logger.error(errorInfo, 'Error occurred in scheduled Lambda');
    throw error;
  }
}
