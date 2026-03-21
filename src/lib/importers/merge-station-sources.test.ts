import { mergeStationSources } from "./merge-station-sources";
import { normalizeStationRecord } from "./normalize-station-record";

test("prefers official source unless multiple trusted sources agree on another value", () => {
  const merged = mergeStationSources([
    normalizeStationRecord({
      sourceName: "mlit",
      station_name: "Michi-no-Eki Fuji",
      prefecture_name: "Shizuoka",
      address_line: "669-1 Gokanjima, Fuji, Shizuoka",
      opening_hours: "09:00-17:00",
    }),
    normalizeStationRecord({
      sourceName: "aggregatorA",
      name: "Michi-no-Eki Fuji",
      prefecture: "Shizuoka",
      address: "669-1 Gokanjima, Fuji, Shizuoka",
      openingHours: "09:00-18:00",
    }),
    normalizeStationRecord({
      sourceName: "aggregatorB",
      name: "Michi-no-Eki Fuji",
      prefecture: "Shizuoka",
      address: "669-1 Gokanjima, Fuji, Shizuoka",
      openingHours: "09:00-18:00",
    }),
  ]);

  expect(merged.name.value).toBe("Michi-no-Eki Fuji");
  expect(merged.openingHours.value).toBe("09:00-18:00");
  expect(merged.openingHours.confidence).toBe("high");
  expect(merged.dataConfidence).toBe("high");
});