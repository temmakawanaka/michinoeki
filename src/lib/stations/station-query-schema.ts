import { z } from "zod";

export const stationQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
  prefecture: z.string().trim().optional(),
});

export type StationQuery = z.infer<typeof stationQuerySchema>;
