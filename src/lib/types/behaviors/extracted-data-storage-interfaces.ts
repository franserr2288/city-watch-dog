import { DataSource } from '../../constants/socrata-constants';

// BLOB STORAGE INTERFACES

// interface exposed to the analysis layer
export interface ExtractedDataReaderInterface<T> {
  getCurrentData(dataSource: DataSource): Promise<RetrieveDataResponse<T>>;
  getDataByDate(
    dataSource: DataSource,
    date: Date,
  ): Promise<RetrieveDataResponse<T>>;
}
// interface exposed to the source-intake layer
export interface ExtractedDataWriterInterface<T> {
  storeData(dataSource: DataSource, data: T[]): Promise<StoreDataResponse>;
}
// the actual storage client implementation just needs to implement this singular interface
export type ExtradedDataStorageClientInterface<T> =
  ExtractedDataReaderInterface<T> & ExtractedDataWriterInterface<T>;

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
type StoreDataResponseFailure = BaseResponseFailure;
export type StoreDataResponse =
  | StoreDataResponseFailure
  | StoreDataResponseSuccess;

export interface RetrieveDataResponseSuccess<T> extends BaseResponseSuccess {
  data: T[];
  metadata: {
    dataSource: DataSource;
    time: string;
    fileName: string;
    recordCount: number;
  };
}
export type RetrieveDataResponseFailure = BaseResponseFailure;
export type RetrieveDataResponse<T> =
  | RetrieveDataResponseFailure
  | RetrieveDataResponseSuccess<T>;

// NOSQL STORAGE INTERFACES
