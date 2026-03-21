import { searchStations } from "./search-stations";

test("filters by keyword and prefecture", async () => {
  const result = await searchStations({ q: "Fuji", prefecture: "Shizuoka" });

  expect(result.total).toBe(1);
  expect(result.items[0]?.slug).toBe("michinoeki-fuji");
  expect(result.items[0]?.name).toBe("Michi-no-Eki Fuji");
});
