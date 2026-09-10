import { z } from "zod";

export const eventQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
  type: z.string().trim().optional(),
  stationSlug: z.string().trim().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

export type EventQueryInput = z.input<typeof eventQuerySchema>;
