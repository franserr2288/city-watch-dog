export interface CustomLogDescriptor {
  service: string;
  environment: string;
  region?: string;
  accountId?: string;
  version?: string;
  sessionId?: string;
  component?: string;

  functionName?: string;
  awsRequestId?: string;
  memoryLimitInMB?: string;
  invokedFunctionArn?: string;

  errorName?: string;
  errorMessage?: string;
  stack?: string;
  errorCode?: string;

  [key: string]: object | string | number | null | undefined;
}
