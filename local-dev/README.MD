# Local Development Environment

Everything you need to run a local dev environment is in this directory

## Why

Uses **LocalStack + Terraform** instead of manual AWS CLI commands to avoid drift between live environments (dev in AWS) and local dev environments

## Recall

```bash
# Start everything
./start-localstack.sh

# Test pipeline
node -r tsx/esm src/ingestion/city-311/handlers/daily-snapshot.ts
```

## Walkthrough

The startup script:

1. **Spins up LocalStack** - Fake AWS services on your machine
2. **Runs Terraform** - Creates all the tables, buckets, etc.
3. **Confirms it worked** - Health checks pass

Script tries to catch errors, but if things break check:
docker-compose -f local-dev/docker-compose.yml logs

## Files

- `docker-compose.yml` - LocalStack container configuration
- `start-localstack.sh` - Automated setup script
- `localstack-data/` - Persistent data storage (auto-created)

## Environment Variables

Make sure you have a `.env` file in the project root with these keys:

```bash
DAILY_SNAPSHOT_BUCKET=
INFRA_REGION=
INTAKE_TABLE=
CONFIG_TABLE=
LOCAL_DEV=
```

## Endpoints

When LocalStack is running:

- **All AWS services**: `http://localhost:4566`
- **Health check**: `http://localhost:4566/health`
- **Web UI**: `http://localhost:4566/_localstack/health`

## If Things Break

### LocalStack won't start

```bash
# get more info
docker info
# if all else fails
docker-compose down
docker volume prune -f
./start-localstack.sh
```

### Resources missing

```bash
# manual run
cd ../infrastructure/environments/local
terraform apply
```

### App can't connect

- Check `LOCAL_DEV=true` in your .env
- Make sure port 4566 isn't blocked
- Resource names might not match between Terraform and app

*
