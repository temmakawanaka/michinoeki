import { prisma } from "@/lib/db";

export async function getStationBySlug(slug: string) {
  return prisma.station.findUnique({
    where: { slug },
    include: {
      facilities: true,
      parking: true,
      sourceRecords: true,
      events: {
        orderBy: [{ priority: "desc" }, { startsAt: "asc" }, { observedAt: "desc" }],
      },
      specialties: {
        orderBy: [{ category: "asc" }, { name: "asc" }],
      },
    },
  });
}
