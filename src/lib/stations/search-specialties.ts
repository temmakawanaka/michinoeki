import { prisma } from "@/lib/db";

import { mapStationSpecialty } from "./station-mappers";
import { specialtyQuerySchema, type SpecialtyQuery } from "./specialty-query-schema";

export async function searchSpecialties(input: SpecialtyQuery) {
  const query = specialtyQuerySchema.parse(input);

  const items = await prisma.stationSpecialty.findMany({
    where: {
      AND: [
        query.category ? { category: query.category } : {},
        query.stationSlug ? { station: { slug: query.stationSlug } } : {},
        query.q
          ? {
              OR: [
                { name: { contains: query.q, mode: "insensitive" as const } },
                { description: { contains: query.q, mode: "insensitive" as const } },
                { category: { contains: query.q, mode: "insensitive" as const } },
                { salesPlace: { contains: query.q, mode: "insensitive" as const } },
              ],
            }
          : {},
      ],
    },
    include: {
      station: {
        select: {
          slug: true,
          name: true,
          prefecture: true,
        },
      },
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return {
    total: items.length,
    items: items.map((item) => ({
      ...mapStationSpecialty(item),
      station: item.station,
    })),
  };
}
