import handler from 'src/ingestion/city-311/handlers/change-detection';
import { changedDetectionContext } from 'tests/data/city-311/lambda-context';
import { eventBridgeLambdaEvent } from 'tests/data/city-311/timed-trigger-event';

describe('Daily Data Sync Workflow', () => {
  it('should complete end-to-end change detection workflow', async () => {
    console.log('Starting daily data sync workflow test...');

    const result = await handler(
      eventBridgeLambdaEvent,
      changedDetectionContext,
    );

    // Verify the workflow completed successfully
    expect(result).toMatchObject({
      statusCode: 200,
      body: expect.stringContaining('success'),
    });

    //TODO: add dynamodb + s3 checks later

    console.log('Change detection workflow completed successfully');
    console.log(`Result: ${JSON.stringify(result, null, 2)}`);
  }, 120000);
});
