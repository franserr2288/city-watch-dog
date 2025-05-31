import { SocrataClientBase } from 'src/lib/clients/socrata/socrata-base-client';
import type { City311DataRequestNeeds } from 'src/lib/types/behaviors/ingestion';
import { city311ApiEndpointContract } from '../../../lib/clients/socrata/socrata-api-contract';
import type {
  City311Report,
  City311Reports,
} from '../validation/city-311-report-schema';

interface PaginationCursor {
  createddate: string;
  srnumber: string;
}

export class City311ApiClient
  extends SocrataClientBase
  implements City311DataRequestNeeds
{
  constructor() {
    super(city311ApiEndpointContract);
  }
  public async getSnapshotOfReports(): Promise<City311Reports> {
    return this.getAllHistoricalRecords();
  }
  public async getAllBackfillReports(): Promise<City311Reports> {
    return this.getAllHistoricalRecords();
  }
  public async detectChanges(): Promise<City311Reports> {
    const newRecords = await this.getNewRecordsSinceLastCheck();
    const updatedRecords = await this.getUpdatedRecordsSinceLastCheck();
    return [...newRecords, ...updatedRecords];
  }

  private async getNewRecordsSinceLastCheck(): Promise<City311Reports> {
    // filter on creation date using something from param store
    return [];
  }
  private async getUpdatedRecordsSinceLastCheck(): Promise<City311Reports> {
    // filter on updated records, using last check from param store
    return [];
  }
  private async getAllHistoricalRecords(): Promise<City311Reports> {
    const allRecords: City311Report[] = [];
    let cursor: PaginationCursor | null = null;
    let hasMoreRecords = true;

    while (hasMoreRecords) {
      const response = await this.getBactchOfReports({
        limit: 1000,
        cursor: cursor,
        orderBy: 'createddate ASC, srnumber ASC',
      });

      if (response.length === 0) {
        hasMoreRecords = false;
        break;
      }
      allRecords.push(response);
      const lastRecord = response[response.length - 1];
      console.log(lastRecord);
      cursor = {
        createddate: lastRecord.createddate,
        srnumber: lastRecord.srnumber,
      };
      if (response.length < 1000) {
        hasMoreRecords = false;
      }
    }
    console.log(allRecords.length);
    return allRecords;
  }

  private async getBactchOfReports(params: {
    limit?: number;
    cursor?: PaginationCursor | null;
    orderBy?: string;
    where?: string;
    requestType?: string;
    status?: string;
  }): Promise<City311Report[]> {
    const query = {
      $limit: params.limit,
      $order: params.orderBy,
      $where: params.where,
      requesttype: params.requestType,
      status: params.status,
    };

    const response = await this.client.getResources({ query });
    console.log(response);
    return response;
    // return this.normalizeResponse(response.body);
  }
}
