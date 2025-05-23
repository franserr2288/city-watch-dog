import { ClientInferRequest } from '@ts-rest/core';
import { City311ApiContract } from './contract';
import { City311ReportSchema } from './schema';
import { SocrataApiClient } from '../../../../shared/api/socrata/client';
import { SOCRATA_SOURCES } from '../../../../shared/api/socrata/data-source-constants';
import { getEnvVar } from '../../../../shared/config/env-loader';

export class City311ApiClient extends SocrataApiClient<typeof City311ReportSchema> {
  constructor(appToken?:string, resourceId?:string, year?:string) {
    super(
      {
        baseUrl: SOCRATA_SOURCES.LA_CITY.BASE_URL,
        appToken: appToken ?? getEnvVar('SOCRATA_APP_TOKEN')
      },
      City311ApiContract,
      resourceId ?? SOCRATA_SOURCES.LA_CITY.DATASETS.CITY_311.CURRENT_YEAR.RESOURCE_ID,
      year ?? SOCRATA_SOURCES.LA_CITY.DATASETS.CITY_311.CURRENT_YEAR.YEAR,

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