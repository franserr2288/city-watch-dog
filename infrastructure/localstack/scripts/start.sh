#!/bin/bash

set -euo pipefail

cleanup() {
  echo
  echo "Interrupted—cleaning up LocalStack…"
  docker-compose -f "$LOCALSTACK_DIR/docker/docker-compose.yml" down --remove-orphans --volumes || true
  rm -rf "$LOCALSTACK_DIR/docker/data" || true
  exit 1
}
trap cleanup INT TERM

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCALSTACK_DIR="$(dirname "$SCRIPT_DIR")"

# 3 levels up from scripts/
if command -v realpath >/dev/null; then
  PROJECT_ROOT="$(realpath "$SCRIPT_DIR/../../..")"
else
  PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
fi
ENV_FILE="$PROJECT_ROOT/local.env"

# check it exists before loading
if [ ! -f "$ENV_FILE" ]; then
    echo "Expected .env file not found: $ENV_FILE"
    echo ""
    echo "   This script assumes the following structure:"
    echo "   project/"
    echo "   ├── .env                    # ← Expected here"
    echo "   └── infrastructure/"
    echo "       └── localstack/"
    echo "           └── scripts/"
    echo "               └── start.sh    # ← We are supposed to be here"
    echo ""
    echo "   Current script location: $0"
    echo "   Looking for .env at: $ENV_FILE"
    exit 1
fi

echo "Loading environment from: $ENV_FILE"
set -a
source "$ENV_FILE"
set +a

cd "$LOCALSTACK_DIR/docker"

echo "Starting LocalStack..."

# check if docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Docker is not running"
    exit 1
fi

# tear down any existing LocalStack containers and volumes
docker-compose -f docker-compose.yml down --remove-orphans --volumes

echo "Cleaning up Docker volumes..."
docker volume prune -f >/dev/null 2>&1 || true

# clean up local data stores if they exist
if [ -d "data" ]; then
    echo "Cleaning up local data directory..."
    rm -rf data
fi

# fresh data store set up
echo "📁 Creating fresh data directory..."
mkdir -p data

# start local stack
docker-compose -f docker-compose.yml up -d

# wait + do health checks
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
    echo "LocalStack failed to start"
    exit 1
fi



echo "Test: node -r tsx/esm src/ingestion/city-311/handlers/daily-snapshot.ts"