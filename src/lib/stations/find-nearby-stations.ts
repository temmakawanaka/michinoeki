import { prisma } from "@/lib/db";

import { nearbyStationQuerySchema, type NearbyStationQuery } from "./nearby-station-query-schema";
import { mapStationSummary } from "./station-mappers";

const EARTH_RADIUS_KM = 6371.0088;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function calculateDistanceKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
) {
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLng = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function findNearbyStations(input: NearbyStationQuery) {
  const query = nearbyStationQuerySchema.parse(input);

  const latitudeDelta = query.radiusKm / 111;
  const longitudeScale = Math.max(Math.cos(toRadians(query.lat)), 0.01);
  const longitudeDelta = query.radiusKm / (111 * longitudeScale);

  const stations = await prisma.station.findMany({
    where: {
      latitude: {
        not: null,
        gte: query.lat - latitudeDelta,
        lte: query.lat + latitudeDelta,
      },
      longitude: {
        not: null,
        gte: query.lng - longitudeDelta,
        lte: query.lng + longitudeDelta,
      },
    },
    include: {
      facilities: true,
      parking: true,
    },
  });

  const items = stations
    .flatMap((station) => {
      if (station.latitude == null || station.longitude == null) {
        return [];
      }

      const distanceKm = calculateDistanceKm(
        { latitude: query.lat, longitude: query.lng },
        { latitude: station.latitude, longitude: station.longitude },
      );

      if (distanceKm > query.radiusKm) {
        return [];
      }

      return [
        {
          ...mapStationSummary(station),
          latitude: station.latitude,
          longitude: station.longitude,
          distanceKm: Math.round(distanceKm * 10) / 10,
        },
      ];
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, query.limit);

  return {
    origin: {
      latitude: query.lat,
      longitude: query.lng,
    },
    radiusKm: query.radiusKm,
    total: items.length,
    items,
  };
}
