import handler from './handler.ts';
import { fileURLToPath } from 'url';

const mockScheduledEvent = {
  version: '0',
  id: 'mock-event-id',
  'detail-type': 'Scheduled Event',
  source: 'aws.events',
  account: '123456789012',
  time: new Date().toISOString(),
  region: 'us-east-1',
  resources: ['arn:aws:events:us-east-1:123456789012:rule/my-schedule'],
  detail: {},
};

const mockContext = {
  callbackWaitsForEmptyEventLoop: true,
  functionName: 'local-city-311-extractor',
  functionVersion: 'LOCAL',
  invokedFunctionArn:
    'arn:aws:lambda:local:123456789012:function:local-function',
  memoryLimitInMB: '128',
  awsRequestId: 'mock-request-' + Date.now(),
  logGroupName: '/aws/lambda/local-city-311-extractor',
  logStreamName: '2025/05/21/[$LATEST]mock',
  getRemainingTimeInMillis: () => 60000,
  done: () => console.log('Context done'),
  fail: (error: Error) => console.error('Context fail', error),
  succeed: (message: string) => console.log('Context succeed', message),
};

async function runLocalTest() {
  console.log('Starting local test of Lambda handler');

  try {
    process.env.S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'mock-bucket';
    process.env.BUCKET_REGION = process.env.BUCKET_REGION || 'us-east-1';

    await handler(mockScheduledEvent, mockContext);
    console.log('Local test completed successfully');
  } catch (error) {
    console.error('Local test failed:', error);
  }
}

const isRunningDirectly = process.argv[1] === fileURLToPath(import.meta.url);

if (isRunningDirectly) {
  runLocalTest();
}
