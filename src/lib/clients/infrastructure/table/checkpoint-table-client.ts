import { DataSource } from 'src/lib/clients/socrata/socrata-constants';
import { getEnvVar } from 'src/lib/config/env';
import type {
  ConfigTableExpectedShape,
  City311PaginationCursor,
} from 'src/lib/types/behaviors/pagination';
import TableStorageClient from './base/table-client';

export default class CheckpointTableClient extends TableStorageClient<
  ConfigTableExpectedShape<City311PaginationCursor>
> {
  private constructTableKeys(dataKey) {
    return [{ config_key: dataKey }];
  }
  constructor() {
    super(getEnvVar('CONFIG_TABLE'));
  }
  public async isBackfillFinished() {
    const record = await this.getBackfillRecord();
    return record !== null;
  }
  public async hasBackfillStarted(): Promise<boolean> {
    const record = await this.getBatchedProcessRecord();
    return record !== null;
  }
  public async getBackfillRecord(): Promise<ConfigTableExpectedShape<City311PaginationCursor> | null> {
    const dataKey: string = constructConfigKey(
      ConfigTableUseCases.IntakeBackfillCompleted,
      DataSource.Requests311,
    );
    const tableKeys = this.constructTableKeys(dataKey);
    const response = await this.get(tableKeys);
    if (response.length == 0) return null;
    return response.at(0) as ConfigTableExpectedShape<City311PaginationCursor>;
  }
  public async getBatchedProcessRecord() {
    const dataKey: string = constructConfigKey(
      ConfigTableUseCases.IntakeBatchingProgressCheckpoints,
      DataSource.Requests311,
    );
    const tableKeys = this.constructTableKeys(dataKey);
    const response = await this.get(tableKeys);
    if (response.length == 0) return null;
    return response.at(0) as ConfigTableExpectedShape<City311PaginationCursor>;
  }
  public async getLastUpdateRecord() {
    const dataKey: string = constructConfigKey(
      ConfigTableUseCases.ChangeDetectionLayer,
      DataSource.Requests311,
    );
    const tableKeys = this.constructTableKeys(dataKey);
    const response = await this.get(tableKeys);
    if (response.length == 0) return null;
    return response.at(0) as ConfigTableExpectedShape<City311PaginationCursor>;
  }
}

export function constructConfigKey(
  useCase: ConfigTableUseCases,
  dataSource: DataSource,
) {
  return `${useCase.toString()}#${dataSource.toString()}`;
}
export enum ConfigTableUseCases {
  IntakeBatchingProgressCheckpoints = 'batch',
  IntakeBackfillCompleted = 'backfilled',
  ChangeDetectionLayer = 'updated',
}
