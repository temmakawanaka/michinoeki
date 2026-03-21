import { prisma } from "@/lib/db";

import { stationQuerySchema, type StationQuery } from "./station-query-schema";
import { mapStationSummary } from "./station-mappers";

export async function searchStations(input: StationQuery) {
  const query = stationQuerySchema.parse(input);

  const where = {
    AND: [
      query.prefecture ? { prefecture: query.prefecture } : {},
      query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" as const } },
              { prefecture: { contains: query.q, mode: "insensitive" as const } },
              { address: { contains: query.q, mode: "insensitive" as const } },
            ],
          }
        : {},
    ],
  };

  const stations = await prisma.station.findMany({
    where,
    include: {
      facilities: true,
      parking: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    total: stations.length,
    items: stations.map(mapStationSummary),
  };
}
