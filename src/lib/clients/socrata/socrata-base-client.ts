import { SOCRATA_SOURCES } from 'src/lib/clients/socrata/socrata-constants';
import type { GenericSocrataApiContract } from './socrata-api-contract';
import { initClient } from '@ts-rest/core';
import { getEnvVar } from 'src/lib/config/env';

interface SocrataClientConfig {
  baseUrl: string;
  appToken?: string;
}
export abstract class SocrataClientBase {
  protected client;
  constructor(private contract: GenericSocrataApiContract) {
    const config: SocrataClientConfig = {
      baseUrl: SOCRATA_SOURCES.LA_CITY.BASE_URL,
      appToken: getEnvVar('SOCRATA_APP_TOKEN'),
    };
    const client = initClient(contract, {
      baseUrl: config.baseUrl,
      baseHeaders: {
        'Content-Type': 'application/json',
        ...(config.appToken ? { 'X-App-Token': config.appToken } : {}),
      },
    });
    this.client = client;
  }

  protected normalizeResponse(response): {
    data;
    metadata?;
  } {
    if (Array.isArray(response)) {
      return { data: response };
    }
    return {
      data: response?.data || [],
      metadata: response?.metadata,
    };
  }
}
