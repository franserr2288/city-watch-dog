import { SOCRATA_SOURCES } from '#shared/clients/socrata/data-source-constants.ts';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import City311ReportSchema from './schema.ts';

const { CITY_311 } = SOCRATA_SOURCES.LA_CITY.DATASETS;
const c = initContract();

export const City311ApiContract = c.router({
  getReports: {
    method: 'GET',
    path: `/resource/${CITY_311}.json`,

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
      200: z.array(City311ReportSchema),
      400: z.object({ error: z.string() }),
      401: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },

  getReportById: {
    method: 'GET',
    path: `/resource/${CITY_311}.json`,
    query: z.object({
      srnumber: z.string(),
    }),
    responses: {
      200: z.array(City311ReportSchema).length(1),
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },
});

export type City311ApiContract = typeof City311ApiContract;
