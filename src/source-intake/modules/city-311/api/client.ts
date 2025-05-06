import { ClientInferRequest } from '@ts-rest/core';
import { City311ApiContract } from './contract';
import { Report311Schema } from './schema';
import { SocrataApiClient } from '../../../../shared/api/socrata/client';
import { SOCRATA_SOURCES } from '../../../../shared/api/socrata/constants';

export class City311ApiClient extends SocrataApiClient<typeof Report311Schema> {
  constructor(appToken?: string) {
    super(
      {
        baseUrl: SOCRATA_SOURCES.LA_CITY.BASE_URL,
        appToken
      },
      City311ApiContract,
      SOCRATA_SOURCES.LA_CITY.DATASETS.CITY_311
    );
  }

  async getReports(params: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    where?: string;
    requestType?: string;
    status?: string;
  }) {
    const query: ClientInferRequest<typeof City311ApiContract.getReports>['query'] = {
      $limit: params.limit,
      $offset: params.offset,
      $order: params.orderBy,
      $where: params.where,
      requesttype: params.requestType,
      status: params.status,
    };
    
    const response = await this.client.getReports({ query });
    return this.normalizeResponse(response.body);
  }

  async getReportById(srnumber: string) {
    const response = await this.client.getReportById({
      query: { srnumber }
    });
    
    return this.normalizeResponse(response.body);
  }
}