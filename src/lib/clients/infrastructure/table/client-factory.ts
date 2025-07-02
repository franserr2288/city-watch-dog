import {
  DynamoDBClient,
  type DynamoDBClientConfig,
} from '@aws-sdk/client-dynamodb';
import { EnvironmentDetector } from 'src/lib/config/internal/environment-detector';
import { getLocalStackEndpoints } from '../../../config/endpoint-resolver';

export const createDynamoClient = (region: string): DynamoDBClient => {
  const config: DynamoDBClientConfig = {
    region,
  };

  // use local stack
  if (EnvironmentDetector.willTargetLocalstackEndpoints()) {
    config.endpoint = getLocalStackEndpoints();
    config.credentials = {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    };
  }

  return new DynamoDBClient(config);
};
