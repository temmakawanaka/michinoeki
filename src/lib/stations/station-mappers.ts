import type { Station, StationFacilities, ParkingCapacity } from "@prisma/client";

type StationWithRelations = Station & {
  facilities: StationFacilities | null;
  parking: ParkingCapacity | null;
};

export function mapStationSummary(station: StationWithRelations) {
  return {
    slug: station.slug,
    name: station.name,
    prefecture: station.prefecture,
    address: station.address,
    openingHours: station.openingHours,
    closingDays: station.closingDays,
    websiteUrl: station.websiteUrl,
    dataConfidence: station.dataConfidence,
    hasShop: station.facilities?.hasShop ?? false,
    hasWifi: station.facilities?.hasWifi ?? false,
  };
}
