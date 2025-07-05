export function GenerateSuccessMessage(
  functionName: string,
): LambdaTimeTriggerEventResponse {
  return {
    statusCode: 200,
    message: `${functionName} completed successfully`,
  };
}
export type LambdaTimeTriggerEventResponse = {
  statusCode: number;
  message: string;
};
