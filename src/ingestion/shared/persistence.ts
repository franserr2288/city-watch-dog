import { DataSource } from 'src/lib/constants/socrata-constants';
import type WatchdogBlobStorageClient from 'src/lib/clients/cloud/blob-client';
import type WatchdogTableStorageClient from 'src/lib/clients/cloud/table-client';

interface IIntakeStorageStrategy<T> {
  storeSnapshot(data: T[]): Promise<void>;
  storeBackfill(data: T[]): Promise<void>;
  storeChanges(data: T[]): Promise<void>;
}

export class IntakePersistence<T> implements IIntakeStorageStrategy<T> {
  constructor(
    private blobStorageClient: WatchdogBlobStorageClient<T>,
    private tableStorageClient: WatchdogTableStorageClient<T>,
  ) {}

  public async storeSnapshot(data: T[]): Promise<void> {
    await this.blobStorageClient.storeData(DataSource.Requests311, data);
  }
  public async storeBackfill(data: T[]): Promise<void> {
    await this.tableStorageClient.storeData(DataSource.Requests311, data);
  }
  public async storeChanges(data: T[]): Promise<void> {
    await this.tableStorageClient.storeData(DataSource.Requests311, data);
  }
}
