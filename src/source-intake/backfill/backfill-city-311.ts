import { SOCRATA_SOURCES } from "../../shared/api/socrata/data-source-constants";
import { getEnvVar } from "../../shared/config/env-loader";
import { bucket_region } from "../../shared/data/constants";
import S3StorageClient from "../../shared/data/s3-client";
import { DataSource } from "../config/sources";
import City311Extractor from "../modules/city-311/extractor";

const FLATTEN = process.argv.includes("--flatten");
const bucketName: string = getEnvVar('S3_BUCKET_NAME');
const region: string = bucket_region;

const url: string = "";
const tableName: string = "";
const storage = new S3StorageClient(bucketName, region);

(async () => {
  const allData = [];

  for (const past_311_data of SOCRATA_SOURCES.LA_CITY.DATASETS.CITY_311.PAST_YEARS) {
    
    
  }



})();