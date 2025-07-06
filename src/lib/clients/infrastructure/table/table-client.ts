import {
  DynamoDB,
  type BatchWriteItemCommandOutput,
} from '@aws-sdk/client-dynamodb';

import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  type BatchGetCommandInput,
  BatchGetCommand,
  type BatchWriteCommandInput,
  type BatchGetCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import {
  chunkArray,
  ConfigTableUseCases,
  constructConfigKey,
} from './table-utils';
import { DataSource } from 'src/lib/clients/socrata/socrata-constants';

import { getEnvVar } from 'src/lib/config/env';
import { createDynamoClient } from './client-factory';
import type {
  ConfigTableExpectedShape,
  City311PaginationCursor,
} from 'src/lib/types/behaviors/pagination';
import { ServiceRequest } from 'src/lib/types/models/service-request';

class TableStorageClient<TDataType> {
  private dynamodb: DynamoDBDocumentClient;
  constructor(
    private tableName: string,
    private region: string = getEnvVar('INFRA_REGION'),
    ddbClient?: DynamoDB,
  ) {
    const client = ddbClient ?? createDynamoClient(region);
    const docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        convertClassInstanceToMap: true,
        convertEmptyValues: false,
        removeUndefinedValues: true,
      },
    });
    this.dynamodb = docClient;
  }

  public async storeData(data: TDataType[]): Promise<void> {
    if (!data.length) {
      return;
    }

    const putRequests = data.map((i) => ({
      PutRequest: { Item: i },
    }));
    const chunkedPutRequests = chunkArray(putRequests, 25);
    for (const chunkPutRequests of chunkedPutRequests) {
      await this.batchWriteWithRetry(chunkPutRequests);
    }
  }

  protected async getData(dataKeys: string[], hashKeyName: string) {
    const input: BatchGetCommandInput = {
      RequestItems: {
        [this.tableName]: {
          Keys: dataKeys.map((i) => ({ [hashKeyName]: i })),
        },
      },
    };
    const command = new BatchGetCommand(input);
    const response: BatchGetCommandOutput = await this.dynamodb.send(command);
    return response.Responses?.[this.tableName] || [];
  }

  private async batchWriteWithRetry(
    writeRequests,
    maxRetries = 5,
  ): Promise<void> {
    let attempts = 0;
    let unprocessed: BatchWriteItemCommandOutput['UnprocessedItems'] = {};
    let currentRequests = writeRequests;

    while (currentRequests.length > 0) {
      const params: BatchWriteCommandInput = {
        RequestItems: {
          [this.tableName]: currentRequests,
        },
      };

      const response = await this.dynamodb.send(new BatchWriteCommand(params));
      unprocessed = response.UnprocessedItems || {};
      const hasUnprocessed = (unprocessed[this.tableName]?.length ?? 0) > 0;

      if (!hasUnprocessed) return;

      attempts++;
      if (attempts > maxRetries) {
        throw new Error(
          `Exceeded maxRetries (${maxRetries}); ${unprocessed[this.tableName].length} item(s) remain unprocessed.`,
        );
      }
      currentRequests = unprocessed[this.tableName]!;
    }
  }
}
export class ServiceRequestTableClient extends TableStorageClient<ServiceRequest> {
  public async getCity311Data(
    dataKeys: string[],
  ): Promise<Array<ServiceRequest>> {
    const items = await this.getData(dataKeys, 'sr_number');
    return items.map((i) => ServiceRequest.fromAPIJSON(i));
  }
}
export class CheckpointTableClient extends TableStorageClient<
  ConfigTableExpectedShape<City311PaginationCursor>
> {
  public async getBackfillRecord(): Promise<
    ConfigTableExpectedShape<City311PaginationCursor> | undefined
  > {
    const dataKey: string = constructConfigKey(
      ConfigTableUseCases.IntakeBackfillCompleted,
      DataSource.Requests311,
    );
    const response = await this.getData([dataKey], 'config_key');
    return response.at(0) as ConfigTableExpectedShape<City311PaginationCursor>;
  }
  public async getBatchedProcessRecord() {
    const dataKey: string = constructConfigKey(
      ConfigTableUseCases.IntakeBatchingProgressCheckpoints,
      DataSource.Requests311,
    );
    const response = await this.getData([dataKey], 'config_key');
    return response.at(0) as ConfigTableExpectedShape<City311PaginationCursor>;
  }
  public async getLastUpdateRecord() {
    const dataKey: string = constructConfigKey(
      ConfigTableUseCases.ChangeDetectionLayer,
      DataSource.Requests311,
    );
    const response = await this.getData([dataKey], 'config_key');
    return response.at(0) as ConfigTableExpectedShape<City311PaginationCursor>;
  }
}
