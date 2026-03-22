import { prisma } from "@/lib/db";

export async function listStationPrefectures() {
  const stations = await prisma.station.findMany({
    distinct: ["prefecture"],
    orderBy: {
      prefecture: "asc",
    },
    select: {
      prefecture: true,
    },
  });

  return stations.map((station) => station.prefecture).filter((prefecture) => prefecture.length > 0);
}
