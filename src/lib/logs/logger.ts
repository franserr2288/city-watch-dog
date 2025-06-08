import pino, { type LoggerOptions } from 'pino';
import type { CustomLogDescriptor } from './base-log-shape';

const BASE_LOG_PROPS: Partial<CustomLogDescriptor> = {
  service: 'city311',
  environment: process.env.NODE_ENV || 'development',
  region: process.env.AWS_REGION,
  functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
};

const loggerOptions: LoggerOptions = {
  formatters: {
    level(label: string) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: BASE_LOG_PROPS,
  level: process.env.LOG_LEVEL || 'info',
  enabled: process.env.LOG_LEVEL !== 'silent',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined, // No transport in production, let CloudWatch handle it
};

const logger = pino(loggerOptions);

export const typedLogger = logger as pino.Logger & {
  info: (obj: Partial<CustomLogDescriptor>, msg?: string) => void;
  error: (obj: Partial<CustomLogDescriptor>, msg?: string) => void;
  warn: (obj: Partial<CustomLogDescriptor>, msg?: string) => void;
  debug: (obj: Partial<CustomLogDescriptor>, msg?: string) => void;
  trace: (obj: Partial<CustomLogDescriptor>, msg?: string) => void;
  fatal: (obj: Partial<CustomLogDescriptor>, msg?: string) => void;
};

export function buildBaseLogContext(context, componentName) {
  const baseLogContext: Partial<CustomLogDescriptor> = {
    component: componentName,
    functionName: context.functionName,
    awsRequestId: context.awsRequestId,
    memoryLimitInMB: context.memoryLimitInMB.toString(),
    invokedFunctionArn: context.invokedFunctionArn,
  };
  return baseLogContext;
}
export function buildErrorLog(error, baseLogContext) {
  const errorInfo: Partial<CustomLogDescriptor> = {
    ...baseLogContext,
    errorName: error instanceof Error ? error.name : 'UnknownError',
    errorMessage: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  };
  return errorInfo;
}

export { logger };
export default logger;
