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
  tbmpage: z.string().optional(),
  tbmcolumn: z.string().optional(),
  tbmrow: z.string().optional(),
  apc: z.string().optional(),
  cd: z.string().optional(),
  cdmember: z.string().optional(),
  nc: z.string().optional(),
  ncname: z.string().optional(),
  policeprecinct: z.string().optional(),
  requestsource: z.string().optional(),
  createdbyuserorganization: z.string().optional(),
  mobileos: z.string().optional(),
  anonymous: z.string().optional(),
  assignto: z.string().optional(),
  servicedate: z.string().optional(),
  closeddate: z.string().optional(),
  addressverified: z.string().optional(),
  approximateaddress: z.string().optional(),
  address: z.string().optional(),
  housenumber: z.string().optional(),
  direction: z.string().optional(),
  streetname: z.string().optional(),
  suffix: z.string().optional(),
  zipcode: z.string().optional(),
});

export default City311ReportSchema;

export type City311ExternalModel = z.infer<typeof City311ReportSchema>;

export type City311Reports = Array<City311ExternalModel>;
