import handler from 'src/ingestion/city-311/handlers/daily-snapshot';
import { snapshotContext } from 'tests/data/city-311/lambda-context';
import { eventBridgeLambdaEvent } from 'tests/data/city-311/timed-trigger-event';

describe('Daily Snapshot Generation workflow test', () => {
  it('should handle daily snapshot generation workflow', async () => {
    console.log('Starting snapshot generation workflow test...');

    const result = await handler(eventBridgeLambdaEvent, snapshotContext);

    expect(result).toMatchObject({
      statusCode: 200,
    });

    //TODO: verify snapshot was created in S3

    console.log('✅ Snapshot generation completed successfully');
  }, 180_000); // 3 minutes for snapshot
});
