import { DataSource } from "../../contexts/source-intake/common/sources";

export default interface ExtradedDataStorageClient{
    storeData(dataSource: DataSource, data: any): Promise<{ currentKey: string; snapshotKey: string }>;
    getCurrentData(dataSource: DataSource): Promise<any> ;
    getDataByDate(dataSource: DataSource, date:string): Promise<any> ;
}