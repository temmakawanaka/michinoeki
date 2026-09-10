import { beforeEach, expect, test, vi } from "vitest";

import { getStationBySlug } from "@/lib/stations/get-station-by-slug";
import { listStationPrefectures } from "@/lib/stations/list-station-prefectures";
import { searchSpecialties } from "@/lib/stations/search-specialties";
import { searchStations } from "@/lib/stations/search-stations";

import { handleApiRequest } from "./app";

vi.mock("@/lib/stations/get-station-by-slug", () => ({
  getStationBySlug: vi.fn(),
}));

vi.mock("@/lib/stations/list-station-prefectures", () => ({
  listStationPrefectures: vi.fn(),
}));

vi.mock("@/lib/stations/search-specialties", () => ({
  searchSpecialties: vi.fn(),
}));

vi.mock("@/lib/stations/search-stations", () => ({
  searchStations: vi.fn(),
}));

const mockedGetStationBySlug = vi.mocked(getStationBySlug);
const mockedListStationPrefectures = vi.mocked(listStationPrefectures);
const mockedSearchSpecialties = vi.mocked(searchSpecialties);
const mockedSearchStations = vi.mocked(searchStations);

beforeEach(() => {
  vi.resetAllMocks();
});

test("GET /api/health returns a lightweight health response", async () => {
  const response = await handleApiRequest(new Request("http://localhost:3000/api/health"));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: "ok" });
});

test("GET /api/stations searches stations with query parameters", async () => {
  mockedSearchStations.mockResolvedValue({
    total: 1,
    items: [{
      slug: "michinoeki-fuji",
      name: "道の駅 富士",
      prefecture: "静岡県",
      address: "静岡県富士市五貫島669-1",
      openingHours: "09:00-18:00",
      closingDays: "年中無休",
      websiteUrl: "https://example.com/fuji",
      dataConfidence: "high",
      hasShop: true,
      hasWifi: true,
    }],
  });

  const response = await handleApiRequest(new Request("http://localhost:3000/api/stations?q=富士&prefecture=静岡県"));
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ total: 1, items: [{ slug: "michinoeki-fuji" }] });
});

test("GET /api/search keeps the old search endpoint available", async () => {
  mockedSearchStations.mockResolvedValue({ total: 0, items: [] });
  const response = await handleApiRequest(new Request("http://localhost:3000/api/search"));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ total: 0, items: [] });
});

test("GET /api/specialties searches specialties across stations", async () => {
  mockedSearchSpecialties.mockResolvedValue({
    total: 1,
    items: [{
      id: "specialty-1",
      name: "しらす丼",
      description: "地元のしらすを使った名物",
      category: "グルメ",
      imageUrl: null,
      priceLabel: "1,000円前後",
      salesPlace: "食堂",
      season: null,
      officialUrl: "https://example.com/shirasu",
      sourceName: "official",
      sourceUrl: "https://example.com/station",
      trustScore: 100,
      observedAt: "2026-09-10T00:00:00.000Z",
      station: { slug: "michinoeki-fuji", name: "道の駅 富士", prefecture: "静岡県" },
    }],
  });

  const response = await handleApiRequest(new Request("http://localhost:3000/api/specialties?q=しらす&category=グルメ"));
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ total: 1, items: [{ name: "しらす丼" }] });
  expect(mockedSearchSpecialties).toHaveBeenCalledWith({ q: "しらす", category: "グルメ", stationSlug: undefined });
});

test("GET /api/prefectures lists available prefectures", async () => {
  mockedListStationPrefectures.mockResolvedValue(["北海道", "静岡県"]);
  const response = await handleApiRequest(new Request("http://localhost:3000/api/prefectures"));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ items: ["北海道", "静岡県"] });
});

test("GET /api/stations/:slug returns a station detail", async () => {
  mockedGetStationBySlug.mockResolvedValue({
    id: "station-1",
    slug: "michinoeki-fuji",
    name: "道の駅 富士",
    prefecture: "静岡県",
    address: "静岡県富士市五貫島669-1",
    latitude: 35.142,
    longitude: 138.65,
    openingHours: "09:00-18:00",
    closingDays: "年中無休",
    websiteUrl: "https://example.com/fuji",
    dataConfidence: "high",
    parking: { id: "parking-1", stationId: "station-1", regularCars: 52, accessibleCars: 2, largeVehicles: 12 },
    facilities: { id: "facilities-1", stationId: "station-1", hasShop: true, hasWifi: true },
    events: [],
    specialties: [],
    sourceRecords: [{
      id: "source-1",
      stationId: "station-1",
      sourceName: "mlit",
      sourceType: "official",
      sourceUrl: "https://example.com/mlit/fuji",
      rawPayload: { name: "道の駅 富士" },
      extractedName: "道の駅 富士",
      extractedValue: { prefecture: "静岡県" },
      trustScore: 100,
      observedAt: new Date("2026-01-01T00:00:00.000Z"),
    }],
  });

  const response = await handleApiRequest(new Request("http://localhost:3000/api/stations/michinoeki-fuji"));
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({
    slug: "michinoeki-fuji",
    parking: { regularCars: 52 },
    events: [],
    specialties: [],
    sourceRecords: [{ sourceName: "mlit", observedAt: "2026-01-01T00:00:00.000Z" }],
  });
});

test("GET /api/stations/:slug returns 404 when missing", async () => {
  mockedGetStationBySlug.mockResolvedValue(null);
  const response = await handleApiRequest(new Request("http://localhost:3000/api/stations/not-found"));
  expect(response.status).toBe(404);
  expect(await response.json()).toEqual({ error: "Station not found" });
});

test("non-GET methods are rejected", async () => {
  const response = await handleApiRequest(new Request("http://localhost:3000/api/health", { method: "POST" }));
  expect(response.status).toBe(405);
  expect(response.headers.get("allow")).toBe("GET");
  expect(await response.json()).toEqual({ error: "Method not allowed" });
});