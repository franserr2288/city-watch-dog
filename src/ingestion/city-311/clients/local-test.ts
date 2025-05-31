import { City311ApiClient } from './socrata-311-api-client';

const client = new City311ApiClient();
const reports = await client.getSnapshotOfReports();
console.log(reports);
