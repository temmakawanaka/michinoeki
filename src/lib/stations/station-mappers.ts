import type {
  ParkingCapacity,
  Station,
  StationEvent,
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
  events?: StationEvent[];
  specialties?: StationSpecialty[];
};

function formatEventDate(event: StationEvent) {
  const format = (value: Date) => new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" }).format(value);

  if (event.startsAt && event.endsAt) {
    return `${format(event.startsAt)}〜${format(event.endsAt)}`;
  }
  if (event.startsAt) return format(event.startsAt);
  return "日程は公式情報を確認";
}

function eventCategory(type: string) {
  switch (type) {
    case "TEMPORARY_CLOSURE":
      return "臨時休業";
    case "HOURS_CHANGE":
      return "営業時間変更";
    case "SEASONAL":
      return "季節情報";
    case "NOTICE":
      return "お知らせ";
    default:
      return "イベント";
  }
}

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
    specialties: (station.specialties ?? []).map(mapStationSpecialty),
    events: (station.events ?? []).map((event) => ({
      id: event.id,
      title: event.title,
      summary: event.summary ?? "",
      dateLabel: formatEventDate(event),
      category: eventCategory(event.type),
      important: event.priority > 0 || event.type === "TEMPORARY_CLOSURE" || event.type === "HOURS_CHANGE",
      officialUrl: event.officialUrl,
      isDemo: false,
    })),
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
