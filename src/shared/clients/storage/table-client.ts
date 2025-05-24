import { getEnvVar } from '#shared/config/env-loader.ts';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BUCKET_REGION } from './constants.ts';

const TABLE_NAME = getEnvVar('INTAKE_TABLE_NAME');
export default class DynamoDbStorageClient {
  private dynamodb: DynamoDBClient;
  private tableName: string;

  constructor(
    tableName: string = TABLE_NAME,
    region: string = BUCKET_REGION,
    dynamoDbClient?: DynamoDBClient,
  ) {
    this.dynamodb = dynamoDbClient ?? new DynamoDBClient({ region });
    this.tableName = tableName;
  }

  // need methods for the config stuff 
  // also need methods for the regular table storage 
  
}

// rename to table client, and s3 client into blob storage client 
