import { prisma } from "@/lib/db";

import { eventQuerySchema, type EventQueryInput } from "./event-query-schema";

export async function searchEvents(input: EventQueryInput) {
  const query = eventQuerySchema.parse(input);

  const items = await prisma.stationEvent.findMany({
    where: {
      AND: [
        query.type ? { type: query.type } : {},
        query.stationSlug ? { station: { slug: query.stationSlug } } : {},
        query.q
          ? {
              OR: [
                { title: { contains: query.q, mode: "insensitive" as const } },
                { summary: { contains: query.q, mode: "insensitive" as const } },
              ],
            }
          : {},
        query.from ? { OR: [{ endsAt: { gte: query.from } }, { endsAt: null, startsAt: { gte: query.from } }] } : {},
        query.to ? { OR: [{ startsAt: { lte: query.to } }, { startsAt: null }] } : {},
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
    orderBy: [{ priority: "desc" }, { startsAt: "asc" }, { observedAt: "desc" }],
    take: query.limit,
  });

  return {
    total: items.length,
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      type: item.type,
      startsAt: item.startsAt?.toISOString() ?? null,
      endsAt: item.endsAt?.toISOString() ?? null,
      priority: item.priority,
      imageUrl: item.imageUrl,
      officialUrl: item.officialUrl,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      trustScore: item.trustScore,
      observedAt: item.observedAt.toISOString(),
      station: item.station,
    })),
  };
}
