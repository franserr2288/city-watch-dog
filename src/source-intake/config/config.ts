import { getEnvVar } from '#shared/config/env-loader.ts';

export const SocrataConfig = {
  baseUrl: getEnvVar('SOCRATA_URL'),
  datasets: {
    city311: getEnvVar('CITY_311_DATASET'),
  },
};
