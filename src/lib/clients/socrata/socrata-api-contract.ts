import { initContract } from '@ts-rest/core';
import City311ReportSchema from 'src/ingestion/city-311/validation/city-311-report-schema';
import { SOCRATA_SOURCES } from 'src/lib/constants/socrata-constants';
import { z } from 'zod';

export function createCityApiContract(
  resourceId: string,
  schema: z.ZodType<object>,
) {
  const c = initContract();
  const ErrorResponse = z.object({ error: z.string() });

  return c.router({
    getResources: {
      method: 'GET',
      path: `/resource/${resourceId}.json`,

      query: z.object({
        $limit: z.number().optional(),
        $offset: z.number().optional(),
        $order: z.string().optional(),
        $where: z.string().optional(),
        requesttype: z.string().optional(),
        status: z.string().optional(),
        createddate: z.string().optional(),
      }),
      responses: {
        200: z.array(schema),
        400: ErrorResponse,
        401: ErrorResponse,
        500: ErrorResponse,
      },
    },

    getResourceById: {
      method: 'GET',
      path: `/resource/${resourceId}.json`,
      query: z.object({
        srnumber: z.string(),
      }),
      responses: {
        200: z.array(schema).length(1),
        400: ErrorResponse,
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
  });
}

export type GenericSocrataApiContract = ReturnType<
  typeof createCityApiContract
>;

export const city311ApiEndpointContract = createCityApiContract(
  SOCRATA_SOURCES.LA_CITY.DATASETS.CITY_311.CURRENT_YEAR.RESOURCE_ID,
  City311ReportSchema,
);

export type City311SocrataApiContract = typeof city311ApiEndpointContract;
