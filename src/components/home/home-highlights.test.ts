import fs from "node:fs";
import path from "node:path";

import { act, createElement } from "react";
import { render, screen } from "@testing-library/react";

import HomePage from "@/app/page";
import { featuredStations, prefectureEntries } from "@/lib/content/home-highlights";

process.env.DATABASE_URL ??= "postgresql://michinoeki:michinoeki@localhost:5432/michinoeki?schema=public";

type SampleRecord = {
  slug?: string;
  prefecture?: string;
  prefecture_name?: string;
};

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

test("homepage featured station links stay aligned with sample data and detail pages", async () => {
  const sampleRecords = loadSampleRecords();
  const slugs = new Set(sampleRecords.flatMap((record) => (record.slug ? [record.slug] : [])));
  const { getStationBySlug } = await import("@/lib/stations/get-station-by-slug");

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

test("homepage prefecture entry links stay aligned with sample data and search results", async () => {
  const sampleRecords = loadSampleRecords();
  const prefectures = new Set(
    sampleRecords.flatMap((record) => {
      const prefecture = record.prefecture ?? record.prefecture_name;
      return prefecture ? [prefecture] : [];
    }),
  );
  const { searchStations } = await import("@/lib/stations/search-stations");

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
