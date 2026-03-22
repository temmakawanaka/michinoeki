import { act, createElement } from "react";
import { render, screen } from "@testing-library/react";

import HomePage from "@/app/page";
import { featuredStations, prefectureEntries } from "@/lib/content/home-highlights";
import { getStationBySlug } from "@/lib/stations/get-station-by-slug";
import { searchStations } from "@/lib/stations/search-stations";

const featuredStationRecord = {
  slug: "michinoeki-fuji",
  name: "道の駅 富士",
  prefecture: "静岡県",
  address: "静岡県富士市",
  openingHours: null,
  closingDays: null,
  websiteUrl: null,
  dataConfidence: "high",
  sourceRecords: [{ id: "source-record-1" }],
  parking: {
    regularCars: 52,
    accessibleCars: null,
    largeVehicles: null,
  },
  facilities: {
    hasShop: true,
    hasWifi: true,
  },
};

const searchStationRecord = {
  slug: "michinoeki-fuji",
  name: "道の駅 富士",
  prefecture: "静岡県",
  address: "静岡県富士市",
  openingHours: null,
  closingDays: null,
  websiteUrl: null,
  dataConfidence: "high",
  facilities: {
    hasShop: true,
    hasWifi: true,
  },
  parking: {
    regularCars: 52,
    accessibleCars: null,
    largeVehicles: null,
  },
};

const { findUniqueMock, findManyMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(async ({ where }: { where: { slug: string } }) => {
    if (where.slug === featuredStationRecord.slug) {
      return featuredStationRecord;
    }

    return null;
  }),
  findManyMock: vi.fn(async ({ where }: { where: { AND: Array<{ prefecture?: string }> } }) => {
    const prefectureFilter = where.AND.find((clause) => clause.prefecture);

    if (prefectureFilter?.prefecture === featuredStationRecord.prefecture) {
      return [searchStationRecord];
    }

    return [];
  }),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    station: {
      findUnique: findUniqueMock,
      findMany: findManyMock,
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

async function renderHomePage() {
  await act(async () => {
    render(createElement(HomePage));
  });
}

function getLinkByHref(href: string) {
  const link = screen.getAllByRole("link").find((candidate) => candidate.getAttribute("href") === href);

  expect(link).toBeDefined();
  return link as HTMLElement;
}

test("homepage featured station links resolve to real station detail pages", async () => {
  await renderHomePage();

  expect(featuredStations.length).toBeGreaterThan(0);

  for (const station of featuredStations) {
    const href = `/stations/${station.slug}`;
    const link = getLinkByHref(href);

    expect(link).toHaveAttribute("href", href);

    const stationRecord = await getStationBySlug(station.slug);
    expect(stationRecord?.slug).toBe(station.slug);
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { slug: station.slug },
      include: {
        facilities: true,
        parking: true,
        sourceRecords: true,
      },
    });
  }
});

test("homepage prefecture entry links resolve to searchable results", async () => {
  await renderHomePage();

  expect(prefectureEntries.length).toBeGreaterThan(0);

  for (const entry of prefectureEntries) {
    const href = `/search?prefecture=${encodeURIComponent(entry.prefecture)}`;
    const link = getLinkByHref(href);

    expect(link).toHaveAttribute("href", href);

    const url = new URL(href, "http://localhost");
    const result = await searchStations({ prefecture: url.searchParams.get("prefecture") ?? undefined });

    expect(result.total).toBeGreaterThan(0);
    expect(result.items[0]?.slug).toBe(searchStationRecord.slug);
    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([expect.objectContaining({ prefecture: entry.prefecture })]),
        }),
        orderBy: { name: "asc" },
      }),
    );
  }
});

