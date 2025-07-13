import {
  CheckpointTableClient,
  ServiceRequestTableClient,
} from 'src/lib/clients/infrastructure/table/table-client';
import { City311ApiClient } from '../clients/socrata-311-api-client';
import City311Extractor from '../extractor';

import {
  GenerateSuccessMessage,
  type LambdaTimeTriggerEventResponse,
} from 'src/lib/types/responses/time-trigger-lambda-response';
import type {
  City311PaginationCursor,
  ConfigTableExpectedShape,
} from 'src/lib/types/behaviors/pagination';

export default async function handler(
  event,
  context,
): Promise<LambdaTimeTriggerEventResponse> {
  try {
    console.log(`EVENT DATA ${event}`);
    console.log(`EXCECUTION CONTEXT ${context}`);

    const dataSourceApiClient = new City311ApiClient();
    const inTakeTableStorageCLient: ServiceRequestTableClient =
      new ServiceRequestTableClient();
    const dataExtractor: City311Extractor = new City311Extractor(
      dataSourceApiClient,
    );
    const checkpointClient = new CheckpointTableClient();
    if (await checkpointClient.isBackfillFinished()) {
      return GenerateSuccessMessage('backfill');
    }
    const lastCheckResponse: ConfigTableExpectedShape<City311PaginationCursor> | null =
      await checkpointClient.getBatchedProcessRecord();
    const lastCheck: City311PaginationCursor | null =
      lastCheckResponse === null ? lastCheckResponse : lastCheckResponse.data;

    for await (const chunk of dataExtractor.backfill(lastCheck)) {
      await inTakeTableStorageCLient.storeData(chunk);
    }
    return GenerateSuccessMessage('backfill');
  } catch (error) {
    console.error('Error occurred in scheduled Lambda:', error);
    throw error;
  }
}
