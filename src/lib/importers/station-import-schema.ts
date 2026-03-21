import { z } from "zod";

const optionalString = z.string().trim().min(1).optional();
const optionalUrl = z.string().url().optional();
const optionalNumber = z.number().int().nonnegative().optional();
const optionalBoolean = z.boolean().optional();

export const rawStationRecordSchema = z
  .object({
    sourceName: z.string().trim().min(1),
    sourceUrl: optionalUrl,
    observedAt: z.string().datetime().optional(),
    slug: optionalString,
    station_name: optionalString,
    name: optionalString,
    prefecture_name: optionalString,
    prefecture: optionalString,
    address_line: optionalString,
    address: optionalString,
    opening_hours: optionalString,
    openingHours: optionalString,
    closing_days: optionalString,
    closingDays: optionalString,
    website_url: optionalUrl,
    websiteUrl: optionalUrl,
    parking_regular: optionalNumber,
    parkingRegular: optionalNumber,
    parking_accessible: optionalNumber,
    parkingAccessible: optionalNumber,
    parking_large: optionalNumber,
    parkingLarge: optionalNumber,
    has_shop: optionalBoolean,
    hasShop: optionalBoolean,
    has_wifi: optionalBoolean,
    hasWifi: optionalBoolean,
  })
  .passthrough();

export const sourceFileSchema = z.union([
  z.array(rawStationRecordSchema),
  z.object({
    records: z.array(rawStationRecordSchema),
  }),
]);

export type RawStationRecord = z.infer<typeof rawStationRecordSchema>;