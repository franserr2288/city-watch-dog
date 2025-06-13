import { DataSource } from 'src/lib/clients/socrata/socrata-constants';
import type BlobStorageClient from 'src/lib/clients/infrastructure/blob/blob-client';
import type TableStorageClient from 'src/lib/clients/infrastructure/table/table-client';

interface IIntakeStorageStrategy<T> {
  storeSnapshot(data: T[]): Promise<void>;
  storeBackfill(data: T[]): Promise<void>;
  storeChanges(data: T[]): Promise<void>;
}

export class IntakePersistence<T> implements IIntakeStorageStrategy<T> {
  constructor(
    private blobStorageClient: BlobStorageClient<T>,
    private tableStorageClient: TableStorageClient<T>,
  ) {}

  public async storeSnapshot(data: T[]): Promise<void> {
    await this.blobStorageClient.storeSmallDataSet(
      DataSource.Requests311,
      data,
    );
  }
  public async storeBackfill(data: T[]): Promise<void> {
    await this.tableStorageClient.storeData(data);
  }
  public async storeChanges(data: T[]): Promise<void> {
    await this.tableStorageClient.storeData(data);
  }
}
