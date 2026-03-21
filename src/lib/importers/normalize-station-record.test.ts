import { normalizeStationRecord } from "./normalize-station-record";

test("normalizes raw source records into comparable station fields", () => {
  const normalized = normalizeStationRecord({
    sourceName: "mlit",
    sourceUrl: "https://example.com/mlit/fuji",
    station_name: "Michi-no-Eki Fuji",
    prefecture_name: "Shizuoka",
    address_line: "669-1 Gokanjima, Fuji, Shizuoka",
    opening_hours: "09:00-18:00",
    parking_regular: 52,
    has_wifi: true,
  });

  expect(normalized.name).toBe("Michi-no-Eki Fuji");
  expect(normalized.prefecture).toBe("Shizuoka");
  expect(normalized.address).toBe("669-1 Gokanjima, Fuji, Shizuoka");
  expect(normalized.openingHours).toBe("09:00-18:00");
  expect(normalized.parking.regularCars).toBe(52);
  expect(normalized.facilities.hasWifi).toBe(true);
  expect(normalized.trustScore).toBe(100);
  expect(normalized.sourceType).toBe("official");
  expect(normalized.slug).toBe("michi-no-eki-fuji");
});