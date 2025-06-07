import { getEnvVar } from 'src/lib/config/env-loader';
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
import { chunkArray } from './table-utils';
import { MyLA311ServiceRequest } from 'src/lib/types/models/city-311-report';

export default class TableStorageClient<TDataType> {
  private dynamodb: DynamoDBDocumentClient;
  constructor(
    private tableName: string,
    private region: string = getEnvVar('INFRA_REGION'),
    ddbClient?: DynamoDB,
  ) {
    const client = ddbClient ?? new DynamoDB({ region: this.region });
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

  public async getCity311Data(
    dataKeys: string[],
  ): Promise<Array<MyLA311ServiceRequest>> {
    const items = await this.getData(dataKeys, 'SRNumber');
    return items.map((i) => MyLA311ServiceRequest.fromAPIJSON(i));
  }

  private async getData(dataKeys: string[], hashKeyName: string) {
    const input: BatchGetCommandInput = {
      RequestItems: {
        [this.tableName]: {
          Keys: dataKeys.map((i) => ({ [hashKeyName]: i })),
        },
      },
    };
    const command = new BatchGetCommand(input);
    const response: BatchGetCommandOutput = await this.dynamodb.send(command);
    const items = response.Responses?.[this.tableName] || [];
    return items;
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
