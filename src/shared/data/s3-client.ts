import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";

import { Readable } from "stream";
import { sdkStreamMixin } from "@aws-sdk/util-stream-node";
import { DataSource } from "../../source-intake/config/sources";
import ExtradedDataStorageClientInterface, { RetrieveDataResponse, StoreDataResponse } from "../interfaces/extracted-data-storage-interface";
import { getEnvVar } from "../config/env-loader";
import { BUCKET_REGION } from "./constants";
import { time, timeStamp } from "console";



const BUCKET_NAME = getEnvVar('S3_BUCKET_NAME');
export default class S3StorageClient<T> implements ExtradedDataStorageClientInterface<T>{
    private s3: S3Client;
    private bucketName: string; 

    constructor(bucketName:string = BUCKET_NAME, region: string = BUCKET_REGION, s3Client?: S3Client) {
        this.s3 = s3Client ?? new S3Client({ region });
        this.bucketName = bucketName;

    }

    getTimestamps(): { iso: string; safeTimestamp: string } {
        const iso = new Date().toISOString();
        const safeTimestamp = iso.replace(/[:.]/g, "-");
        return { iso, safeTimestamp };
    }


    async storeData(dataSource: DataSource, data: T[]): Promise<StoreDataResponse> {
        const { iso, safeTimestamp } = this.getTimestamps();
        const payload = {
          metadata: {
            dataSource: dataSource,
            fileName: safeTimestamp,
            time:iso,
            recordCount: data.length,
          },
          data: data,
        };
      
        const jsonData = JSON.stringify(payload, null, 2);
      
        const currentKey = this.getCurrentKey(dataSource);
        const snapshotKey = this.getDatedSnapshotKey(dataSource, safeTimestamp);
      
        const currentCommand = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: currentKey,
          Body: jsonData,
          ContentType: "application/json",
        });
      
        const snapshotCommand = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: snapshotKey,
          Body: jsonData,
          ContentType: "application/json",
        });
      
        try {
            await Promise.all([
                this.s3.send(currentCommand),
                this.s3.send(snapshotCommand),
            ]);
            return { success: true, currentKey, snapshotKey };
        } catch (error) {
            console.error(`Error storing ${dataSource} data:`, error);
            return {
                success: false,
                errorMessage: `An error occurred when storing the dataset ${dataSource}`,
            };
        }
      }
      

    async getCurrentData(dataSource: DataSource): Promise<RetrieveDataResponse<T>> {
        try {
            const key = this.getCurrentKey(dataSource);
            const fullPayload = await this.getJsonFromS3(key);
            const metadata = fullPayload.metadata;
            const data: T[] = fullPayload.data;
            return {success:true, data, metadata}
        } catch(error) { 
            return {success: false, errorMessage: `An error occured when retrieving the dataset ${dataSource} `};
        }
    }

    getCurrentKey(dataSource:DataSource): string{
        return `${dataSource}/current.json`;
    }
    getDatedSnapshotKey(dataSource:DataSource, timestamp:string): string{
        return `${dataSource}/archive/${timestamp}.json`;
    }
    
    async getDataByDate(dataSource: DataSource, date: string): Promise<RetrieveDataResponse<T>> {
        try {
            const key = this.getDatedSnapshotKey(dataSource, date);
            const fullPayload = await this.getJsonFromS3(key);
            const metadata = fullPayload.metadata;
            const data: T[] = fullPayload.data;
            return {success:true, data, metadata}
        } catch(error) { 
            return {success: false, errorMessage: `An error occured when retrieving the dataset ${dataSource} `};
        }
    }
    
    private async getJsonFromS3(key: string): Promise<any> {
        const command = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });
    
        try {
          const response = await this.s3.send(command);
          if (!response.Body) throw new Error(`Empty response for ${key}`);
    
          const sdkStream = sdkStreamMixin(response.Body as Readable);
          const bodyString = await sdkStream.transformToString();
          return JSON.parse(bodyString);
        } catch (error) {
          console.error(`Error retrieving ${key}:`, error);
          throw error;
        }
      }
}