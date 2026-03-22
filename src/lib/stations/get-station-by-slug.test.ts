import { getStationBySlug } from "./get-station-by-slug";

test("returns a station by slug", async () => {
  const station = await getStationBySlug("michinoeki-fuji");

  expect(station?.name).toBe("道の駅 富士");
  expect(station?.sourceRecords.length).toBeGreaterThan(0);
  expect(station?.parking?.regularCars).toBe(52);
  expect(station?.facilities?.hasWifi).toBe(true);
});
