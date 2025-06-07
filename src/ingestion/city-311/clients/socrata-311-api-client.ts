import { SocrataClientBase } from 'src/lib/clients/socrata/socrata-base-client';
import type { City311DataRequestNeeds } from 'src/lib/types/behaviors/ingestion';
import { city311ApiEndpointContract } from '../../../lib/clients/socrata/socrata-api-contract';
import type { City311Report } from '../validation/city-311-report-schema';
import type {
  BatchResult,
  City311PaginationCursor,
  ConfigTableExpectedShape,
} from 'src/lib/types/behaviors/pagination';
import TableStorageClient from 'src/lib/clients/cloud/table-client';
import { getEnvVar } from 'src/lib/config/env-loader';
import {
  ConfigTableUseCases,
  constructConfigKey,
} from 'src/lib/clients/cloud/table-utils';
import { DataSource } from 'src/lib/constants/socrata-constants';
import { BatchResult } from '../../../lib/types/behaviors/pagination';
import { City311Report } from '../validation/city-311-report-schema';

export class City311ApiClient
  extends SocrataClientBase
  implements City311DataRequestNeeds
{
  private readonly BATCH_SIZE = 40_000;
  private checkpointTableClient: TableStorageClient<
    ConfigTableExpectedShape<City311PaginationCursor>
  >;

  constructor() {
    super(city311ApiEndpointContract);
    this.checkpointTableClient = new TableStorageClient(
      getEnvVar('CONFIG_TABLE'),
    );
  }

  public async *getSnapshotBatches(): AsyncGenerator<
    BatchResult<City311Report>,
    void,
    unknown
  > {
    yield* this.getHistoricalBatchIterator(false);
  }

  public async *getBackfillBatches(): AsyncGenerator<
    BatchResult<City311Report>,
    void,
    unknown
  > {
    yield* this.getHistoricalBatchIterator(true);
  }

  public async *detectNewRecordBatchesSinceLastChange(): AsyncGenerator<
    BatchResult<City311Report>,
    void,
    unknown
  > {
    yield* this.getNewRecordsSinceLastCheck();
  }
  public async *detectUpdatedRecordBatchesSinceLastChange(): AsyncGenerator<
    BatchResult<City311Report>,
    void,
    unknown
  > {
    yield* this.getNewRecordsSinceLastCheck();
  }

  private async *getHistoricalBatchIterator(
    checkpointProgress: boolean,
  ): AsyncGenerator<BatchResult<City311Report>, void, unknown> {
    const cursor: City311PaginationCursor | null = null;
    const hasMoreRecords = true;
    const batchNumber = 0;
    const totalRecordsProcessed = 0;

    while (hasMoreRecords) {
      this.processCursor(
        cursor,
        hasMoreRecords,
        totalRecordsProcessed,
        batchNumber,
        checkpointProgress,
      );
    }
    if (cursor === null || checkpointProgress === false) return;

    const payload: ConfigTableExpectedShape<City311PaginationCursor> = {
      config_key: constructConfigKey(
        ConfigTableUseCases.Backfilled,
        DataSource.Requests311,
      ),
      data: cursor,
    };
    await this.checkpointTableClient.storeData([payload]);
  }

  private async processCursor(
    cursor: City311PaginationCursor | null,
    hasMoreRecords: boolean,
    totalRecordsProcessed: number,
    batchNumber: number,
    checkpointProgress: boolean,
  ) {
    let whereClause: string | undefined;
    if (cursor) {
      whereClause = `createddate > '${cursor.createddate}' OR (createddate = '${cursor.createddate}' AND srnumber > '${cursor.srnumber}')`;
    }
    const response = await this.getBatchOfReports({
      limit: this.BATCH_SIZE,
      cursor,
      orderBy: 'createddate ASC, srnumber ASC',
      where: whereClause,
    });

    if (response.length === 0) {
      hasMoreRecords = false;
      break;
    }

    if (response.length < this.BATCH_SIZE) {
      hasMoreRecords = false;
    }
    totalRecordsProcessed += response.length;

    const batchResult: BatchResult<City311Report> = {
      cursor,
      data: response,
      hasMore: hasMoreRecords,
      batchNumber,
      totalRecordsProcessed,
    };

    if (checkpointProgress && cursor) {
      const payload: ConfigTableExpectedShape<City311PaginationCursor> = {
        config_key: constructConfigKey(
          ConfigTableUseCases.Batching,
          DataSource.Requests311,
        ),
        data: cursor,
      };
      await this.checkpointTableClient.storeData([payload]);
    }

    yield batchResult;
    batchNumber++;
    const lastRecord = response[response.length - 1];
    cursor = {
      createddate: lastRecord.createddate,
      srnumber: lastRecord.srnumber,
    };
  }
  private async *getNewRecordsSinceLastCheck(
    lastCheck: BatchResult<City311Report> | null,
  ): AsyncGenerator<BatchResult<City311Report>, void, unknown> {
    let cursor: City311PaginationCursor | null = null;
    if (lastCheck) {
      cursor = lastCheck.cursor;
    } else {

      this.checkpointTableClient.
    }
  }
  private async *getUpdatedRecordsSinceLastCheck(): AsyncGenerator<
    BatchResult<City311Report>,
    void,
    unknown
  > {}

  private async getBatchOfReports(params: {
    limit?: number;
    cursor?: City311PaginationCursor | null;
    orderBy?: string;
    where?: string;
    requestType?: string;
    status?: string;
  }): Promise<Array<City311Report>> {
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
