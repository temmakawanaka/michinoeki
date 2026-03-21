import { getSourceMetadata } from "./source-priority";
import type { RawStationRecord } from "./station-import-schema";

export type ConfidenceLevel = "high" | "medium" | "low";

export type NormalizedStationRecord = {
  sourceName: string;
  sourceType: "official" | "secondary";
  sourceUrl: string | null;
  observedAt: Date;
  trustScore: number;
  slug: string;
  name: string;
  prefecture: string;
  address: string;
  openingHours: string | null;
  closingDays: string | null;
  websiteUrl: string | null;
  parking: {
    regularCars: number | null;
    accessibleCars: number | null;
    largeVehicles: number | null;
  };
  facilities: {
    hasShop: boolean | null;
    hasWifi: boolean | null;
  };
  rawPayload: RawStationRecord;
};

function firstNonEmpty(...values: Array<string | undefined>) {
  return values.find((value) => value && value.length > 0) ?? null;
}

function firstNumber(...values: Array<number | undefined>) {
  return values.find((value) => typeof value === "number") ?? null;
}

function firstBoolean(...values: Array<boolean | undefined>) {
  return values.find((value) => typeof value === "boolean") ?? null;
}

export function slugifyStationName(name: string) {
  const slug = name
    .normalize("NFKD")
    .split("")
    .filter((character) => character.charCodeAt(0) <= 0x7f)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "station";
}

export function normalizeStationRecord(input: RawStationRecord): NormalizedStationRecord {
  const source = getSourceMetadata(input.sourceName);
  const name = firstNonEmpty(input.station_name, input.name);
  const prefecture = firstNonEmpty(input.prefecture_name, input.prefecture);
  const address = firstNonEmpty(input.address_line, input.address);

  if (!name || !prefecture || !address) {
    throw new Error(`Station record from ${input.sourceName} is missing required fields.`);
  }

  return {
    sourceName: input.sourceName,
    sourceType: source.type,
    sourceUrl: input.sourceUrl ?? null,
    observedAt: input.observedAt ? new Date(input.observedAt) : new Date(),
    trustScore: source.trustScore,
    slug: input.slug ?? slugifyStationName(name),
    name,
    prefecture,
    address,
    openingHours: firstNonEmpty(input.opening_hours, input.openingHours),
    closingDays: firstNonEmpty(input.closing_days, input.closingDays),
    websiteUrl: firstNonEmpty(input.website_url, input.websiteUrl),
    parking: {
      regularCars: firstNumber(input.parking_regular, input.parkingRegular),
      accessibleCars: firstNumber(input.parking_accessible, input.parkingAccessible),
      largeVehicles: firstNumber(input.parking_large, input.parkingLarge),
    },
    facilities: {
      hasShop: firstBoolean(input.has_shop, input.hasShop),
      hasWifi: firstBoolean(input.has_wifi, input.hasWifi),
    },
    rawPayload: input,
  };
}