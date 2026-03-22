import fs from "node:fs";
import path from "node:path";

import { act, createElement } from "react";
import { render, screen } from "@testing-library/react";

import HomePage from "@/app/page";
import { featuredStations, prefectureEntries } from "@/lib/content/home-highlights";
import { getStationBySlug } from "@/lib/stations/get-station-by-slug";
import { searchStations } from "@/lib/stations/search-stations";

type SampleRecord = {
  slug?: string;
  prefecture?: string;
  prefecture_name?: string;
};

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

function loadSampleRecords() {
  const sourceDir = path.join(process.cwd(), "data", "sources");
  const filenames = ["sample-source-a.json", "sample-source-b.json", "sample-source-c.json"];

  return filenames.flatMap((filename) => {
    const raw = fs.readFileSync(path.join(sourceDir, filename), "utf8");
    return JSON.parse(raw) as SampleRecord[];
  });
}

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

test("homepage featured station links stay aligned with sample data and detail routing", async () => {
  const sampleRecords = loadSampleRecords();
  const slugs = new Set(sampleRecords.flatMap((record) => (record.slug ? [record.slug] : [])));

  await renderHomePage();

  expect(featuredStations.length).toBeGreaterThan(0);

  for (const station of featuredStations) {
    const href = `/stations/${station.slug}`;

    expect(slugs.has(station.slug)).toBe(true);
    expect(getLinkByHref(href)).toHaveAttribute("href", href);

    const stationRecord = await getStationBySlug(station.slug);
    expect(stationRecord?.slug).toBe(station.slug);
  }
});

test("homepage prefecture entry links stay aligned with sample data and searchable paths", async () => {
  const sampleRecords = loadSampleRecords();
  const prefectures = new Set(
    sampleRecords.flatMap((record) => {
      const prefecture = record.prefecture ?? record.prefecture_name;
      return prefecture ? [prefecture] : [];
    }),
  );

  await renderHomePage();

  expect(prefectureEntries.length).toBeGreaterThan(0);

  for (const entry of prefectureEntries) {
    const href = `/search?prefecture=${encodeURIComponent(entry.prefecture)}`;

    expect(prefectures.has(entry.prefecture)).toBe(true);
    expect(getLinkByHref(href)).toHaveAttribute("href", href);

    const result = await searchStations({ prefecture: entry.prefecture });
    expect(result.total).toBeGreaterThan(0);
  }
});
