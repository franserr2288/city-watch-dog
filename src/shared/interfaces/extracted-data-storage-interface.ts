import { DataSource } from "../../source-intake/config/sources";

export default interface ExtradedDataStorageClientInterface{
    storeData(dataSource: DataSource, data: any): Promise<{ currentKey: string; snapshotKey: string }>;
    getCurrentData(dataSource: DataSource): Promise<any> ;
    getDataByDate(dataSource: DataSource, date:string): Promise<any> ;
}