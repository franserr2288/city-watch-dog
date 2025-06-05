import { getEnvVar } from 'src/lib/config/env-loader';
import {
  DynamoDB,
  type BatchWriteItemCommandOutput,
} from '@aws-sdk/client-dynamodb';

import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  type BatchWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';

export default class WatchdogTableStorageClient<TDataType> {
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

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
