import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

import { fetchSourceRecords } from "./fetch-source-records";
import { mergeStationSources } from "./merge-station-sources";
import { normalizeStationRecord } from "./normalize-station-record";

function groupBySlug<T extends { slug: string }>(records: T[]) {
  const groups = new Map<string, T[]>();

  for (const record of records) {
    const current = groups.get(record.slug) ?? [];
    current.push(record);
    groups.set(record.slug, current);
  }

  return groups;
}

function hasParkingData(merged: ReturnType<typeof mergeStationSources>) {
  return [merged.parking.regularCars.value, merged.parking.accessibleCars.value, merged.parking.largeVehicles.value].some(
    (value) => value !== null,
  );
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function importStationsFromFiles(filePaths: string[]) {
  const rawRecords = await fetchSourceRecords(filePaths);
  const normalizedRecords = rawRecords.map(normalizeStationRecord);
  const groupedRecords = groupBySlug(normalizedRecords);

  for (const records of groupedRecords.values()) {
    const merged = mergeStationSources(records);

    const station = await prisma.station.upsert({
      where: {
        slug: merged.slug,
      },
      update: {
        name: merged.name.value ?? "Unknown station",
        prefecture: merged.prefecture.value ?? "Unknown prefecture",
        address: merged.address.value ?? "Unknown address",
        openingHours: merged.openingHours.value,
        closingDays: merged.closingDays.value,
        websiteUrl: merged.websiteUrl.value,
        dataConfidence: merged.dataConfidence,
      },
      create: {
        slug: merged.slug,
        name: merged.name.value ?? "Unknown station",
        prefecture: merged.prefecture.value ?? "Unknown prefecture",
        address: merged.address.value ?? "Unknown address",
        openingHours: merged.openingHours.value,
        closingDays: merged.closingDays.value,
        websiteUrl: merged.websiteUrl.value,
        dataConfidence: merged.dataConfidence,
      },
    });

    await prisma.stationSourceRecord.deleteMany({
      where: {
        stationId: station.id,
      },
    });

    await prisma.stationSourceRecord.createMany({
      data: records.map((record) => ({
        stationId: station.id,
        sourceName: record.sourceName,
        sourceType: record.sourceType,
        sourceUrl: record.sourceUrl,
        rawPayload: toInputJsonValue(record.rawPayload),
        extractedName: record.name,
        extractedValue: toInputJsonValue({
          prefecture: record.prefecture,
          address: record.address,
          openingHours: record.openingHours,
          closingDays: record.closingDays,
          websiteUrl: record.websiteUrl,
          parking: record.parking,
          facilities: record.facilities,
        }),
        trustScore: record.trustScore,
        observedAt: record.observedAt,
      })),
    });

    if (hasParkingData(merged)) {
      await prisma.parkingCapacity.upsert({
        where: {
          stationId: station.id,
        },
        update: {
          regularCars: merged.parking.regularCars.value,
          accessibleCars: merged.parking.accessibleCars.value,
          largeVehicles: merged.parking.largeVehicles.value,
        },
        create: {
          stationId: station.id,
          regularCars: merged.parking.regularCars.value,
          accessibleCars: merged.parking.accessibleCars.value,
          largeVehicles: merged.parking.largeVehicles.value,
        },
      });
    } else {
      await prisma.parkingCapacity.deleteMany({
        where: {
          stationId: station.id,
        },
      });
    }

    await prisma.stationFacilities.upsert({
      where: {
        stationId: station.id,
      },
      update: {
        hasShop: merged.facilities.hasShop.value ?? false,
        hasWifi: merged.facilities.hasWifi.value ?? false,
      },
      create: {
        stationId: station.id,
        hasShop: merged.facilities.hasShop.value ?? false,
        hasWifi: merged.facilities.hasWifi.value ?? false,
      },
    });
  }

  return {
    importedStations: groupedRecords.size,
    importedSourceRecords: normalizedRecords.length,
  };
}