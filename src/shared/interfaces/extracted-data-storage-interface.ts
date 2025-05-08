import { DataSource } from "../../source-intake/config/sources";

export default interface ExtradedDataStorageClientInterface<T>{
    storeData(dataSource: DataSource, data: T[]): Promise<StoreDataResponse>;
    getCurrentData(dataSource: DataSource): Promise<RetrieveDataResponse<T>> ;
    getDataByDate(dataSource: DataSource, date:string): Promise<RetrieveDataResponse<T>>;
}

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

