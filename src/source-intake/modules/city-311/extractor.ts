import ExtradedDataStorageClientInterface from '../../../shared/interfaces/extracted-data-storage-interface';
import { DataSource } from '../../config/sources';
import { City311ApiClient } from './api/client';

export default class City311Extractor extends BaseExtractor {

    private datasetApiClient: City311ApiClient;
    private storageClient: ExtradedDataStorageClientInterface; 

    constructor(
        datasetApiClient: City311ApiClient,
        storageClient: ExtradedDataStorageClientInterface
    ) {
        super();
        this.datasetApiClient = datasetApiClient;
        this.storageClient = storageClient;
    }
    async extract(): Promise<any> {
        const reports = this.datasetApiClient.getReports({});
        await this.store(reports)
    }
    async store(data:any): Promise<any> {
        this.storageClient.storeData(DataSource.Requests311, data);
    } 
}