import { readFile } from "node:fs/promises";
import path from "node:path";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(process.cwd(), "data", "stations", "sample-stations.json");
  const stations = JSON.parse(await readFile(filePath, "utf8")) as Array<{
    slug: string;
    name: string;
    prefecture: string;
    address: string;
    openingHours?: string;
    closingDays?: string;
    websiteUrl?: string;
    dataConfidence?: string;
    parking?: { regularCars?: number; accessibleCars?: number; largeVehicles?: number };
    facilities?: { hasShop?: boolean; hasWifi?: boolean };
    sourceRecords?: Array<{ sourceName: string; sourceType: string; sourceUrl?: string; trustScore: number; rawPayload: object }>;
  }>;

  await prisma.stationSourceRecord.deleteMany();
  await prisma.parkingCapacity.deleteMany();
  await prisma.stationFacilities.deleteMany();
  await prisma.station.deleteMany();

  for (const station of stations) {
    await prisma.station.create({
      data: {
        slug: station.slug,
        name: station.name,
        prefecture: station.prefecture,
        address: station.address,
        openingHours: station.openingHours,
        closingDays: station.closingDays,
        websiteUrl: station.websiteUrl,
        dataConfidence: station.dataConfidence,
        parking: station.parking ? { create: station.parking } : undefined,
        facilities: station.facilities ? { create: station.facilities } : undefined,
        sourceRecords: station.sourceRecords
          ? {
              create: station.sourceRecords.map((record) => ({
                ...record,
                extractedName: station.name,
                extractedValue: {
                  address: station.address,
                  openingHours: station.openingHours,
                },
              })),
            }
          : undefined,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
