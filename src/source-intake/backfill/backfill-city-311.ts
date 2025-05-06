import S3StorageClient from "../../shared/data/s3-client";
import { DataSource } from "../config/sources";
import City311Extractor from "../modules/city-311/extractor";

const YEARS = [2018, 2019, 2020, 2021, 2022];
const FLATTEN = process.argv.includes("--flatten");
const storage = new S3StorageClient();

(async () => {
  const allData = [];

  for (const year of YEARS) {
    const extractor = new City311Extractor(year);
    const data = await extractor.extract();

    if (!FLATTEN) {
      await storage.storeData(DataSource.Requests311, data);
    } else {
      allData.push(...data);
    }
  }

  if (FLATTEN) {
    await storage.storeData(DataSource.Requests311, allData);
  }
})();