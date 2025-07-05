import handler from 'src/ingestion/city-311/handlers/backfill';
import { backfillContext } from 'tests/data/city-311/lambda-context';
import { eventBridgeLambdaEvent } from 'tests/data/city-311/timed-trigger-event';

describe('Historical Backfill Workflow', () => {
  it('should handle large-scale historical data backfill', async () => {
    console.log('📚 Starting historical backfill workflow test...');

    const limitedBackfillEvent = {
      ...eventBridgeLambdaEvent,
      detail: {
        testMode: true,
        maxRecords: 1000,
      },
    };

    const result = await handler(limitedBackfillEvent, backfillContext);

    expect(result.statusCode).toBe(200);

    console.log('Backfill workflow completed successfully');
  }, 600_000);
});
