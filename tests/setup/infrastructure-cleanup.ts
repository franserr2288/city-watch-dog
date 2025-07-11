// import { DeleteItemCommand, DynamoDB } from '@aws-sdk/client-dynamodb';
// import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
// import { createDynamoClient } from 'src/lib/clients/infrastructure/table/client-factory';
// import { getEnvVar } from 'src/lib/config/env';

const resetLocalStackInfra = async () => {
  //   const client = createDynamoClient(getEnvVar('INFRA_REGION'));
  //   const docClient = DynamoDBDocumentClient.from(client, {
  //     marshallOptions: {
  //       convertClassInstanceToMap: true,
  //       convertEmptyValues: false,
  //       removeUndefinedValues: true,
  //     },
  //   });
};

export const setupInfraCleanup = () => {
  beforeEach(async () => {
    await resetLocalStackInfra();
  });
};
