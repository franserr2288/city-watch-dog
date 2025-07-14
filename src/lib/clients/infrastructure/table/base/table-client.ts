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
import { getEnvVar } from 'src/lib/config/env';
import { createDynamoClient } from './client-factory';
import { chunkArray } from '../checkpoint/table-utils';

export default abstract class TableStorageClient<TDataType> {
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

  public async save(data: TDataType[]): Promise<void> {
    if (!data.length) {
      return;
    }

    const putRequests = data.map((i) => ({
      PutRequest: { Item: i },
    }));
    const chunkedPutRequests = chunkArray(putRequests, 25);
    for (const chunkPutRequests of chunkedPutRequests) {
      await this.batchWrite(chunkPutRequests);
    }
  }

  protected async get(tableKeys: Record<string, string | number>[]) {
    const input: BatchGetCommandInput = {
      RequestItems: {
        [this.tableName]: {
          Keys: tableKeys,
        },
      },
    };
    const command = new BatchGetCommand(input);
    const response: BatchGetCommandOutput = await this.dynamodb.send(command);
    return response.Responses?.[this.tableName] || [];
  }

  private async batchWrite(writeRequests, maxRetries = 5): Promise<void> {
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
