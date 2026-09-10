import { z } from "zod";

export const nearbyStationQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().positive().max(300).default(50),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type NearbyStationQuery = z.infer<typeof nearbyStationQuerySchema>;
export type NearbyStationQueryInput = z.input<typeof nearbyStationQuerySchema>;
