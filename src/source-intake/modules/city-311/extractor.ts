import  { ExtractedDataWriterInterface } from '../../../shared/interfaces/extracted-data-storage-interfaces';
import { DataSource } from '../../config/sources';
import { City311ApiClient } from './api/client';
import { City311ReportSchema } from './api/schema';

export default class City311Extractor extends BaseExtractor {

    private datasetApiClient: City311ApiClient;
    private storageClient: ExtractedDataWriterInterface<typeof City311ReportSchema>; 

    constructor(
        datasetApiClient: City311ApiClient,
        storageClient: ExtractedDataWriterInterface<typeof City311ReportSchema>
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
        return await this.storageClient.storeData(DataSource.Requests311, data);
    } 
}