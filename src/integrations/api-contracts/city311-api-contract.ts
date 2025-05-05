import { initContract } from '@ts-rest/core';
import { z } from 'zod'; 
import { Report311Schema } from '../api-schemas/city311-schema';



const c = initContract();

export const City311ApiContract = c.router({
  getReports: {
    method: 'GET',
    path: '/resource/h73f-gn57.json',

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
      200: z.array(Report311Schema),
      400: z.object({ error: z.string() }),
      401: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },
  
  getReportById: {
    method: 'GET',
    path: '/resource/h73f-gn57.json',
    query: z.object({
      srnumber: z.string(),
    }),
    responses: {
      200: z.array(Report311Schema).length(1),
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },
});

export type City311ApiContract = typeof City311ApiContract;