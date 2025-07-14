import { getEnvVar } from 'src/lib/config/env';
import { ServiceRequest } from 'src/lib/types/models/service-request';
import TableStorageClient from '../base/table-client';

export class ServiceRequestTableClient extends TableStorageClient<ServiceRequest> {
  constructor() {
    super(getEnvVar('INTAKE_TABLE'));
  }
  public async getCity311Data(
    dataKeys: string[],
  ): Promise<Array<ServiceRequest>> {
    const items = await this.get(this.constructTableKeys(dataKeys));
    return items.map((i) => ServiceRequest.fromAPIJSON(i));
  }

  private constructTableKeys(dataKeys: string[], sortKey?: string) {
    if (sortKey) {
      return dataKeys.map((pk) => ({
        sr_number: pk,
        sk: sortKey,
      }));
    }
    return dataKeys.map((pk) => ({ sr_number: pk }));
  }
}
