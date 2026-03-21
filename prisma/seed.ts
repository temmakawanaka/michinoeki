import path from "node:path";

import { prisma } from "../src/lib/db";
import { importStationsFromFiles } from "../src/lib/importers/import-stations";

async function main() {
  await prisma.stationSourceRecord.deleteMany();
  await prisma.parkingCapacity.deleteMany();
  await prisma.stationFacilities.deleteMany();
  await prisma.station.deleteMany();

  await importStationsFromFiles([
    path.join("data", "sources", "sample-source-a.json"),
    path.join("data", "sources", "sample-source-b.json"),
    path.join("data", "sources", "sample-source-c.json"),
  ]);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });