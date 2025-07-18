import { SocrataClientBase } from 'src/lib/clients/socrata/socrata-base-client';
import { city311ApiEndpointContract } from '../../../lib/clients/socrata/socrata-api-contract';
import type { City311ExternalModel } from './city-311-report-schema';

import { CheckpointTableClient } from 'src/lib/clients/infrastructure/table/base/table-client';
import {
  ConfigTableUseCases,
  constructConfigKey,
} from 'src/lib/clients/infrastructure/table/checkpoint/table-utils';
import { DataSource } from 'src/lib/clients/socrata/socrata-constants';
import type { City311DataRequestNeeds } from 'src/lib/types/behaviors/ingestion';
import type {
  ConfigTableExpectedShape,
  City311PaginationCursor,
  BatchResult,
} from 'src/lib/types/behaviors/pagination';

export class City311ApiClient
  extends SocrataClientBase
  implements City311DataRequestNeeds
{
  private readonly BATCH_SIZE = 40_000;
  private checkpointTableClient: CheckpointTableClient;

  constructor() {
    super(city311ApiEndpointContract);
    this.checkpointTableClient = new CheckpointTableClient();
  }
  public async *detectNewRecordsAndUpdatedRecordsSinceLastCheck(): AsyncGenerator<
    BatchResult<City311ExternalModel>,
    void,
    unknown
  > {
    yield* this.getNewAndUpdatedRecordsSinceLastCheck(null, false);
  }

  public async *getSnapshotBatches(
    lastCheck: City311PaginationCursor | null,
  ): AsyncGenerator<BatchResult<City311ExternalModel>, void, unknown> {
    yield* this.getHistoricalBatchIterator(false, lastCheck);
  }

  public async *getBackfillBatches(
    lastCheck: City311PaginationCursor | null,
  ): AsyncGenerator<BatchResult<City311ExternalModel>, void, unknown> {
    yield* this.getHistoricalBatchIterator(true, lastCheck);
  }

  private async *getHistoricalBatchIterator(
    checkpointProgress: boolean,
    lastCheck: City311PaginationCursor | null,
  ): AsyncGenerator<BatchResult<City311ExternalModel>, void, unknown> {
    let cursor: City311PaginationCursor | null = lastCheck;

    yield* this.processCursor(cursor, checkpointProgress, QueryType.NewRecords);

    const record = await this.checkpointTableClient.getBatchedProcessRecord();
    cursor = record === null ? record : record.data;

    if (cursor === null || checkpointProgress === false) return;

    const payload: ConfigTableExpectedShape<City311PaginationCursor> = {
      config_key: constructConfigKey(
        ConfigTableUseCases.IntakeBackfillCompleted,
        DataSource.Requests311,
      ),
      data: cursor,
    };
    await this.checkpointTableClient.save([payload]);
  }

  public async *getNewAndUpdatedRecordsSinceLastCheck(
    lastCheck: BatchResult<City311ExternalModel> | null,
    checkpointProgress: boolean,
  ): AsyncGenerator<BatchResult<City311ExternalModel>, void, unknown> {
    let cursor: City311PaginationCursor | null = null;
    if (lastCheck) {
      cursor = lastCheck.cursor;
    } else {
      let response: ConfigTableExpectedShape<City311PaginationCursor> | null =
        await this.checkpointTableClient.getLastUpdateRecord();
      if (response === null)
        response = await this.checkpointTableClient.getBackfillRecord();

      cursor = response?.data ?? null;
    }

    yield* this.processCursor(
      cursor,
      checkpointProgress,
      QueryType.NewAndUpdatedRecordsSinceLastCheck,
    );
    if (cursor === null || checkpointProgress === false) return;

    const payload: ConfigTableExpectedShape<City311PaginationCursor> = {
      config_key: constructConfigKey(
        ConfigTableUseCases.ChangeDetectionLayer,
        DataSource.Requests311,
      ),
      data: cursor,
    };
    await this.checkpointTableClient.save([payload]);
  }
  private constructNewRecordWhereClause(cursor: City311PaginationCursor) {
    if (cursor) {
      return `createddate > '${cursor.createddate}' OR (createddate = '${cursor.createddate}' AND srnumber > '${cursor.srnumber}')`;
    }
    return undefined;
  }

  private async *processCursor(
    cursor: City311PaginationCursor | null,
    checkpointProgress: boolean,
    queryType: QueryType,
  ) {
    let hasMoreRecords = true;
    let batchNumber = 0;
    let totalRecordsProcessed = 0;

    while (hasMoreRecords) {
      let whereClause: string | undefined;
      if (cursor) {
        if (queryType === QueryType.NewRecords)
          whereClause = this.constructNewRecordWhereClause(cursor);
        else if (queryType === QueryType.NewAndUpdatedRecordsSinceLastCheck)
          whereClause = `${this.constructNewRecordWhereClause(cursor)} OR updateddate > '${cursor.createddate}'`;
      }

      const response = await this.getBatchOfReports({
        limit: this.BATCH_SIZE,
        cursor,
        orderBy: 'createddate ASC, srnumber ASC',
        where: whereClause,
      });
      if (response == null || response == undefined) {
        console.log('Bad response from the API');
        return;
      }

      if (response.length === 0) {
        hasMoreRecords = false;
        return;
      }

      if (response.length < this.BATCH_SIZE) {
        hasMoreRecords = false;
      }
      totalRecordsProcessed += response.length;

      const batchResult: BatchResult<City311ExternalModel> = {
        cursor,
        data: response,
        hasMore: hasMoreRecords,
        batchNumber,
        totalRecordsProcessed,
      };

      if (checkpointProgress && cursor) {
        const payload: ConfigTableExpectedShape<City311PaginationCursor> = {
          config_key: constructConfigKey(
            ConfigTableUseCases.IntakeBatchingProgressCheckpoints,
            DataSource.Requests311,
          ),
          data: cursor,
        };
        await this.checkpointTableClient.save([payload]);
      }

      yield batchResult;
      batchNumber++;
      const lastRecord = response[response.length - 1];
      cursor = {
        createddate: lastRecord.createddate,
        srnumber: lastRecord.srnumber,
      };
    }
  }

  private async getBatchOfReports(params: {
    limit?: number;
    cursor?: City311PaginationCursor | null;
    orderBy?: string;
    where?: string;
    requestType?: string;
    status?: string;
  }): Promise<Array<City311ExternalModel>> {
    const query = {
      $limit: params.limit,
      $order: params.orderBy,
      $where: params.where,
      requesttype: params.requestType,
      status: params.status,
    };

    const response = await this.client.getResources({ query });
    return this.normalizeResponse(response.body).data;
  }
}

enum QueryType {
  NewAndUpdatedRecordsSinceLastCheck = 1,
  NewRecords = 2,
}
