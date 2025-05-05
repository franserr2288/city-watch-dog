import { Context, ScheduledEvent } from 'aws-lambda';

export const handler = async (event: ScheduledEvent, context: Context) => {

    return {
        statusCode: 200,
        body: 'Scheduled task completed successfully'
    };
    
};