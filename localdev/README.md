docker-compose -f docker-compose.yml up -d  
docker-compose -f docker-compose.yml down --remove-orphans

localstack logs

docker-compose --profile test run --rm integration-tests
