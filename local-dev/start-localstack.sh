# docker-compose -f docker-compose.localstack.yml up -d
# curl http://localhost:4566/health

#!/bin/bash

set -e

echo "🚀 Starting LocalStack..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running"
    exit 1
fi

# Stop existing container
if docker ps -a | grep -q "localstack-main"; then
    docker-compose -f local-dev/docker-compose.yml down
fi
# Clean up volumes (optional but helps with persistent issues)
echo "🧹 Cleaning up Docker volumes..."
docker volume prune -f >/dev/null 2>&1 || true

# Clean up local data directory if it exists and recreate
if [ -d "local-dev/localstack-data" ]; then
    echo "🧹 Cleaning up local data directory..."
    rm -rf local-dev/localstack-data
fi

# Create fresh local data directory
echo "📁 Creating fresh data directory..."
mkdir -p local-dev/localstack-data

# Start LocalStack
docker-compose -f local-dev/docker-compose.yml up -d

# Wait for LocalStack
echo "⏳ Waiting for LocalStack..."
max_attempts=20
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:4566/health >/dev/null 2>&1; then
        echo "✅ LocalStack ready"
        break
    fi
    attempt=$((attempt + 1))
    printf "."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ LocalStack failed to start"
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "did not find .env"
    exit
fi

# Create resources
echo "🏗️  Creating resources..."

aws --endpoint-url=http://localhost:4566 s3 mb s3://${DATA_BUCKET_NAME} 2>/dev/null || true

aws --endpoint-url=http://localhost:4566 dynamodb create-table \
    --table-name ${CITY_311_TABLE_NAME} \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=created_date,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
        AttributeName=created_date,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --region ${AWS_DEFAULT_REGION} 2>/dev/null || true

echo "✅ Setup complete!"
echo "Test: node -r tsx/esm src/ingestion/city-311/handlers/daily-snapshot.ts"