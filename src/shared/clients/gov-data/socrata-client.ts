import { initClient } from '@ts-rest/core';
import { z } from 'zod';

export interface SocrataClientConfig {
  baseUrl: string;
  appToken?: string;
}

export class SocrataApiClient<T extends z.ZodType> {
  protected client: any;
  constructor(
    private config: SocrataClientConfig,
    private contract: any,
    private datasetId: string,
    private year: string,
  ) {
    console.log(config.baseUrl);
    console.log(datasetId);

    this.client = initClient(contract, {
      baseUrl: config.baseUrl,
      baseHeaders: {
        'Content-Type': 'application/json',
        ...(config.appToken ? { 'X-App-Token': config.appToken } : {}),
      },
    });
  }

  protected getResourcePath(resourceId: string = this.datasetId): string {
    return `/resource/${resourceId}.json`;
  }

  protected normalizeResponse<R>(response: any): {
    data: z.infer<T>[];
    metadata?: {
      hasMore?: boolean;
      total?: number;
    };
  } {
    if (Array.isArray(response)) {
      return { data: response };
    }
    console.log(response);

    return {
      data: response.data || [],
      metadata: response.metadata,
    };
  }
}
