import type {
  ParkingCapacity,
  Station,
  StationFacilities,
  StationSourceRecord,
  StationSpecialty,
} from "@prisma/client";

type StationWithRelations = Station & {
  facilities: StationFacilities | null;
  parking: ParkingCapacity | null;
};

type StationDetailWithRelations = StationWithRelations & {
  sourceRecords: StationSourceRecord[];
  specialties: StationSpecialty[];
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

export function mapStationSpecialty(specialty: StationSpecialty) {
  return {
    id: specialty.id,
    name: specialty.name,
    description: specialty.description,
    category: specialty.category,
    imageUrl: specialty.imageUrl,
    priceLabel: specialty.priceLabel,
    salesPlace: specialty.salesPlace,
    season: specialty.season,
    officialUrl: specialty.officialUrl,
    sourceName: specialty.sourceName,
    sourceUrl: specialty.sourceUrl,
    trustScore: specialty.trustScore,
    observedAt: specialty.observedAt.toISOString(),
  };
}

export function mapStationDetail(station: StationDetailWithRelations) {
  return {
    ...mapStationSummary(station),
    latitude: station.latitude,
    longitude: station.longitude,
    parking: station.parking
      ? {
          regularCars: station.parking.regularCars,
          accessibleCars: station.parking.accessibleCars,
          largeVehicles: station.parking.largeVehicles,
        }
      : null,
    specialties: station.specialties.map(mapStationSpecialty),
    sourceRecords: station.sourceRecords.map((sourceRecord) => ({
      sourceName: sourceRecord.sourceName,
      sourceType: sourceRecord.sourceType,
      sourceUrl: sourceRecord.sourceUrl,
      trustScore: sourceRecord.trustScore,
      observedAt: sourceRecord.observedAt.toISOString(),
      extractedName: sourceRecord.extractedName,
      extractedValue: sourceRecord.extractedValue,
    })),
  };
}
