import { z } from "zod";

export const specialtyQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
  category: z.string().trim().optional(),
  stationSlug: z.string().trim().optional(),
});

export type SpecialtyQuery = z.infer<typeof specialtyQuerySchema>;
