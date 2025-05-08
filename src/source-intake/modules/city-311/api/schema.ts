import { z } from "zod";

export const City311ReportSchema = z.object({
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