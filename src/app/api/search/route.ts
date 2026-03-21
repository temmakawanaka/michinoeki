import { searchStations } from "@/lib/stations/search-stations";
import { stationQuerySchema } from "@/lib/stations/station-query-schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = stationQuerySchema.parse({
    q: searchParams.get("q") ?? "",
    prefecture: searchParams.get("prefecture") ?? undefined,
  });

  return Response.json(await searchStations(query));
}
