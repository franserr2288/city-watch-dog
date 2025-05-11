# Local Development Environment with LocalStack

Contains config and scripts to set up a local development environment using LocalStack (AWS emulator)

## Prerequisites

- Docker and Docker Compose
- AWS CLI
- jq (for parsing JSON responses)

## Getting Started

1. Set up the environment variables (optional):

   ```
   # Edit configs/localstack.env if needed
   ```

2. Start the LocalStack environment:

   ```
   ./scripts/local-dev.sh start
   ```

3. Check the status of LocalStack services:

   ```
   ./scripts/local-dev.sh status
   ```

4. Run test commands to verify the setup:

   ```
   ./scripts/local-dev.sh test
   ```

5. View logs from LocalStack:

   ```
   ./scripts/local-dev.sh logs
   ```

6. Stop the LocalStack environment:
   ```
   ./scripts/local-dev.sh stop
   ```

## AWS Services Emulated

- S3: Object storage
- Lambda: Serverless functions
- CloudWatch Events: Scheduled triggers
- IAM: Identity and access management
- DynamoDB: NoSQL database

## Working with LocalStack

### Using AWS CLI with LocalStack

Add `--endpoint-url=http://localhost:4566` to your AWS CLI commands:

```bash
# List S3 buckets
aws --endpoint-url=http://localhost:4566 s3 ls

# Invoke Lambda function
aws --endpoint-url=http://localhost:4566 lambda invoke \
  --function-name los-angeles-data-dev-city-311-source-intake \
  --payload '{"test": "event"}' \
  output.json
```

### Environment Variables

You can customize the environment by modifying `configs/localstack.env`:

- `PROJECT`: Project name (default: "los-angeles-data")
- `ENVIRONMENT`: Environment name (default: "dev")
- `DEBUG`: Enable debug mode (0=off, 1=on)

### Using with Your Application Code

When developing locally, your code should be environment-aware rather than hardcoding endpoints. Here's how to configure your AWS clients dynamically:

```typescript
const isLocalDev =
  process.env.NODE_ENV === "local" || process.env.USE_LOCALSTACK === "true";

const s3ClientOptions = {
  region: process.env.AWS_REGION || "us-west-1",
  ...(isLocalDev && {
    endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
    credentials: {
      accessKeyId: "test",
      secretAccessKey: "test",
    },
    forcePathStyle: true,
  }),
};
const s3Client = new S3Client(s3ClientOptions);
```

## Troubleshooting

- If services don't initialize properly, check the logs:

  ```
  ./local-dev.sh logs
  ```

- If you need to reset the environment:

  ```
  ./local-dev.sh stop
  docker volume prune # Optional: remove volumes
  ./local-dev.sh start
  ```

- If your Lambda function isn't working, you may need to rebuild it:
  ```
  # Modify the init-scripts/setup-lambda.sh and restart
  ./local-dev.sh stop
  ./local-dev.sh start
  ```
