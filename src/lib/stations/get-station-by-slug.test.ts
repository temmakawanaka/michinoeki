import { getStationBySlug } from "./get-station-by-slug";

test("returns a station by slug", async () => {
  const station = await getStationBySlug("michinoeki-fuji");

  expect(station?.name).toBe("Michi-no-Eki Fuji");
  expect(station?.sourceRecords.length).toBeGreaterThan(0);
});
