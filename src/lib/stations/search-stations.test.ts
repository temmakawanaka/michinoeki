import { searchStations } from "./search-stations";

test("filters by keyword and prefecture", async () => {
  const result = await searchStations({ q: "富士", prefecture: "静岡県" });

  expect(result.total).toBe(1);
  expect(result.items[0]?.slug).toBe("michinoeki-fuji");
  expect(result.items[0]?.name).toBe("道の駅 富士");
});