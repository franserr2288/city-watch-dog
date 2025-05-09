import { DataSource } from "../../source-intake/config/sources";


// BLOB STORAGE INTERFACES

// interface exposed to the analysis layer
export interface ExtractedDataReaderInterface<T> { 
    getCurrentData(dataSource: DataSource): Promise<RetrieveDataResponse<T>> ;
    getDataByDate(dataSource: DataSource, date:Date): Promise<RetrieveDataResponse<T>>;
    getNearestDataByDate(dataSource: DataSource, date:Date): Promise<RetrieveDataResponse<T>>;
    getDataInDateRange(dataSource: DataSource, startDate:Date, endDate:Date): Promise<RetrieveDataResponse<T>>;
    getXNextDayDataFiles(dataSource: DataSource, date:Date, x:number): Promise<RetrieveDataResponse<T>>;
}
// interface exposed to the source-intake layer
export interface ExtractedDataWriterInterface<T> { 
    storeData(dataSource: DataSource, data: T[]): Promise<StoreDataResponse>;
}
// the actual storage client implementation just needs to implement this singular interface
export type ExtradedDataStorageClientInterface<T> = ExtractedDataReaderInterface<T> & ExtractedDataWriterInterface<T>;

interface BaseResponseSuccess {
    success: true;
}

interface BaseResponseFailure {
    success: false;
    errorMessage: string;
}
interface StoreDataResponseSuccess extends BaseResponseSuccess {
    currentKey: string;
    snapshotKey: string;
}
interface StoreDataResponseFailure extends BaseResponseFailure{}
export type StoreDataResponse = StoreDataResponseFailure | StoreDataResponseSuccess;

interface RetrieveDataResponseSuccess<T> extends BaseResponseSuccess {
    data:T[]
    metadata: {
        dataSource: DataSource,
        time:string,
        fileName: string,
        recordCount: number,
    }
}
interface RetrieveDataResponseFailure extends BaseResponseFailure{}
export type RetrieveDataResponse<T> = RetrieveDataResponseFailure | RetrieveDataResponseSuccess<T>;

// NOSQL STORAGE INTERFACES 