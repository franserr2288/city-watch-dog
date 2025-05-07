import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";

import { Readable } from "stream";
import { sdkStreamMixin } from "@aws-sdk/util-stream-node";
import { DataSource } from "../../source-intake/config/sources";
import ExtradedDataStorageClientInterface from "../interfaces/extracted-data-storage-interface";



const BUCKET_NAME = process.env.S3_BUCKET_NAME || "city-data";
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

export default class S3StorageClient implements ExtradedDataStorageClientInterface{
    private s3: S3Client;
    private bucketName: string; 

    constructor(bucketName:string = BUCKET_NAME, region: string = AWS_REGION) {
        this.s3 = new S3Client({region});
        this.bucketName = bucketName;
    }

    async storeData(dataSource: DataSource, data: any): Promise<{ currentKey: string; snapshotKey: string }> { 
        const key = `${dataSource}-current.json`;
        const jsonData = JSON.stringify(data, null, 2); 
        
        const currentKey = `${dataSource}-current.json`;
        const currentCommand = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: currentKey,
            Body: jsonData,
            ContentType: "application/json",
        });

        const timestamp: string = new Date().toISOString().split("T")[0];
        const snapshotKey: string = `${dataSource}/${timestamp}.json`;
        const snapshotCommand: PutObjectCommand = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: snapshotKey,
            Body: jsonData,
            ContentType: "application/json",
        });

        try {
            await this.s3.send(currentCommand);
            await this.s3.send(snapshotCommand);
            return { currentKey, snapshotKey };
        } catch (error) {
        console.error(`Error storing ${dataSource} data:`, error);
        throw error;
        }
    }

    async getCurrentData(source: DataSource): Promise<any> {
        const key = `${source}-current.json`;
        return this.getJsonFromS3(key);
    }
    
    async getDataByDate(source: DataSource, date: string): Promise<any> {
        const key = `${source}/${date}.json`;
        return this.getJsonFromS3(key);
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