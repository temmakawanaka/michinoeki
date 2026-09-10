import { ZodError } from "zod";

import { findNearbyStations } from "@/lib/stations/find-nearby-stations";
import { getStationBySlug } from "@/lib/stations/get-station-by-slug";
import { listStationPrefectures } from "@/lib/stations/list-station-prefectures";
import { mapStationDetail } from "@/lib/stations/station-mappers";
import { stationQuerySchema } from "@/lib/stations/station-query-schema";
import { searchStations } from "@/lib/stations/search-stations";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
};

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...init.headers,
    },
  });
}

function normalizePath(pathname: string) {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : "/";
}

function pathSegments(pathname: string) {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));
}

async function handleStationSearch(url: URL) {
  const query = stationQuerySchema.parse({
    q: url.searchParams.get("q") ?? "",
    prefecture: url.searchParams.get("prefecture") ?? undefined,
  });

  return jsonResponse(await searchStations(query));
}

async function handleNearbyStationSearch(url: URL) {
  return jsonResponse(
    await findNearbyStations({
      lat: url.searchParams.get("lat"),
      lng: url.searchParams.get("lng"),
      radiusKm: url.searchParams.get("radiusKm") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    }),
  );
}

async function handleStationDetail(stationSlug: string) {
  const station = await getStationBySlug(stationSlug);

  if (!station) {
    return jsonResponse(
      {
        error: "Station not found",
      },
      {
        status: 404,
      },
    );
  }

  return jsonResponse(mapStationDetail(station));
}

export async function handleApiRequest(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return jsonResponse(
      {
        error: "Method not allowed",
      },
      {
        status: 405,
        headers: {
          allow: "GET",
        },
      },
    );
  }

  try {
    const url = new URL(request.url);
    const path = normalizePath(url.pathname);
    const segments = pathSegments(path);

    if (path === "/api/health") {
      return jsonResponse({
        status: "ok",
      });
    }

    if (path === "/api/stations" || path === "/api/search") {
      return handleStationSearch(url);
    }

    if (path === "/api/stations/nearby") {
      return handleNearbyStationSearch(url);
    }

    if (path === "/api/prefectures") {
      return jsonResponse({
        items: await listStationPrefectures(),
      });
    }

    if (segments.length === 3 && segments[0] === "api" && segments[1] === "stations") {
      return handleStationDetail(segments[2]);
    }

    return jsonResponse(
      {
        error: "Not found",
      },
      {
        status: 404,
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonResponse(
        {
          error: "Invalid query",
          issues: error.issues,
        },
        {
          status: 400,
        },
      );
    }

    console.error(error);

    return jsonResponse(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
