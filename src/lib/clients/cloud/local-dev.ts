import {
  DynamoDBClient,
  type DynamoDBClientConfig,
} from '@aws-sdk/client-dynamodb';
import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';

export const createS3Client = (region: string): S3Client => {
  const config: S3ClientConfig = {
    region,
  };
  // use local stack
  if (EnvironmentDetector.isRunningLocally()) {
    config.endpoint = 'http://localhost:4566';
    config.forcePathStyle = true; // Required for LocalStack S3
    config.credentials = {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    };
  }

  return new S3Client(config);
};
export const createDynamoClient = (region: string): DynamoDBClient => {
  const config: DynamoDBClientConfig = {
    region,
  };

  // use local stack
  if (EnvironmentDetector.isRunningLocally()) {
    config.endpoint = 'http://localhost:4566';
    config.credentials = {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    };
  }

  return new DynamoDBClient(config);
};

export class EnvironmentDetector {
  static isRunningInLambda(): boolean {
    return !!process.env.AWS_LAMBDA_FUNCTION_NAME;
  }
  static isRunningLocally(): boolean {
    return !this.isRunningInLambda();
  }

  static getEnvironmentContext(): {
    isLambda: boolean;
    isLocal: boolean;
    functionName?: string;
    region?: string;
  } {
    const isLambda = this.isRunningInLambda();

    return {
      isLambda,
      isLocal: !isLambda,
      functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
      region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
    };
  }
}
