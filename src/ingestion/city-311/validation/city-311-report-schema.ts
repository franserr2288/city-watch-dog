import { z } from 'zod';

const City311ReportSchema = z.object({
  srnumber: z.string(),
  createddate: z.string(),
  updateddate: z.string().optional(),
  actiontaken: z.string().optional(),
  owner: z.string().optional(),
  requesttype: z.string(),
  status: z.string(),
  councildistrict: z.string().optional(),
  areaname: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export default City311ReportSchema;

export type City311Report = z.infer<typeof City311ReportSchema>;

export type City311Reports = Array<City311Report>;
