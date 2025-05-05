import { initClient, ClientInferRequest } from '@ts-rest/core';
import { City311ApiContract } from '../api-contracts/city311-api-contract';

export const city311Client = initClient(City311ApiContract, {
  baseUrl: 'https://data.lacity.org',
  baseHeaders: {
    'Content-Type': 'application/json',
    // 'X-App-Token': process.env.SOCRATA_APP_TOKEN,
  },
});

export class City311ApiClient {
  constructor(private appToken?: string) {}
  
  private getHeaders() {
    return this.appToken ? { 'X-App-Token': this.appToken } : {};
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
    
    return city311Client.getReports({
      query,
      // headers: this.getHeaders(),
    });
  }
  
  async getReportById(srnumber: string) {
    return city311Client.getReportById({
      query: { srnumber },
      // headers: this.getHeaders(),
    });
  }
}