import path from "node:path";

import { prisma } from "../src/lib/db";
import { importStationsFromFiles } from "../src/lib/importers/import-stations";

async function main() {
  await prisma.stationSpecialty.deleteMany();
  await prisma.stationSourceRecord.deleteMany();
  await prisma.parkingCapacity.deleteMany();
  await prisma.stationFacilities.deleteMany();
  await prisma.station.deleteMany();

  await importStationsFromFiles([
    path.join("data", "sources", "sample-source-a.json"),
    path.join("data", "sources", "sample-source-b.json"),
    path.join("data", "sources", "sample-source-c.json"),
  ]);

  const fuji = await prisma.station.findUnique({
    where: { slug: "michinoeki-fuji" },
  });

  if (fuji) {
    await prisma.stationSpecialty.createMany({
      data: [
        {
          stationId: fuji.id,
          name: "しらす丼",
          description: "地元のしらすを楽しめる道の駅グルメのサンプルデータです。",
          category: "グルメ",
          priceLabel: "1,000円前後",
          salesPlace: "食堂",
          officialUrl: "https://example.com/fuji/shirasu",
          sourceName: "station-official",
          sourceUrl: "https://example.com/fuji",
          trustScore: 100,
        },
        {
          stationId: fuji.id,
          name: "静岡茶",
          description: "静岡県らしい特産品のサンプルデータです。",
          category: "特産品",
          salesPlace: "売店",
          officialUrl: "https://example.com/fuji/tea",
          sourceName: "station-official",
          sourceUrl: "https://example.com/fuji",
          trustScore: 100,
        },
      ],
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
