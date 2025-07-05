export const backfillContext = {
  awsRequestId: 'test-request-id-xyz',
  functionName: 'backfill',
  functionVersion: '$LATEST',
  invokedFunctionArn: 'arn:aws:lambda:us-west-1:123456789012:function:backfill',
  memoryLimitInMB: '128',
  getRemainingTimeInMillis: () => 300000,
  callbackWaitsForEmptyEventLoop: true,
  done: () => {},
  fail: () => {},
  succeed: () => {},
  identity: null,
  clientContext: null,
};

export const snapshotContext = {
  awsRequestId: 'test-request-id-xyz',
  functionName: 'snapshot',
  functionVersion: '$LATEST',
  invokedFunctionArn: 'arn:aws:lambda:us-west-1:123456789012:function:snapshot',
  memoryLimitInMB: '128',
  getRemainingTimeInMillis: () => 300000,
  callbackWaitsForEmptyEventLoop: true,
  done: () => {},
  fail: () => {},
  succeed: () => {},
  identity: null,
  clientContext: null,
};

export const changedDetectionContext = {
  awsRequestId: 'test-request-id-xyz',
  functionName: 'changeDetection',
  functionVersion: '$LATEST',
  invokedFunctionArn:
    'arn:aws:lambda:us-west-1:123456789012:function:changeDetection',
  memoryLimitInMB: '128',
  getRemainingTimeInMillis: () => 300000,
  callbackWaitsForEmptyEventLoop: true,
  done: () => {},
  fail: () => {},
  succeed: () => {},
  identity: null,
  clientContext: null,
};
