import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';
import { EnvironmentDetector } from 'src/lib/config/internal/environment-detector';
import { getLocalStackEndpoints } from '../../../config/endpoint-resolver';

export const createS3Client = (region: string): S3Client => {
  const config: S3ClientConfig = {
    region,
  };
  // use local stack
  if (EnvironmentDetector.willTargetLocalstackEndpoints()) {
    config.endpoint = getLocalStackEndpoints();
    config.forcePathStyle = true; // Required for LocalStack S3
    config.credentials = {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    };
  }

  return new S3Client(config);
};
