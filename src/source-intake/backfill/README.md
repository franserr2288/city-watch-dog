# Backfill

This folder contains one-off or infrequent ingestion scripts for pulling historical or non-daily data from public datasets. They use the same extractors defined in `/modules/` but are not run as part of the deployed pipeline.

npm install -D ts-node typescript

npx ts-node src/source-intake/backfill/backfill-city-311.ts --flatten
npx ts-node src/source-intake/backfill/backfill-city-311.ts
