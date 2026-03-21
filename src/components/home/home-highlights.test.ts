import fs from "node:fs";
import path from "node:path";

import { featuredStations, prefectureEntries } from "@/lib/content/home-highlights";

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

test("every featured station slug exists in seeded sample data", () => {
  const sampleRecords = loadSampleRecords();
  const slugs = new Set(sampleRecords.flatMap((record) => (record.slug ? [record.slug] : [])));

  expect(featuredStations.length).toBeGreaterThan(0);
  for (const station of featuredStations) {
    expect(slugs.has(station.slug)).toBe(true);
  }
});

test("every prefecture entry exists in seeded searchable sample data", () => {
  const sampleRecords = loadSampleRecords();
  const prefectures = new Set(
    sampleRecords.flatMap((record) => {
      const prefecture = record.prefecture ?? record.prefecture_name;
      return prefecture ? [prefecture] : [];
    }),
  );

  expect(prefectureEntries.length).toBeGreaterThan(0);
  for (const entry of prefectureEntries) {
    expect(prefectures.has(entry.prefecture)).toBe(true);
  }
});
