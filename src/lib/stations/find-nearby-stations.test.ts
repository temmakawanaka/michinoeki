import { expect, test } from "vitest";

import { calculateDistanceKm } from "./find-nearby-stations";

test("calculateDistanceKm returns roughly the distance between Hamamatsu and Iwata", () => {
  const distanceKm = calculateDistanceKm(
    { latitude: 34.7108, longitude: 137.7261 },
    { latitude: 34.7179, longitude: 137.8515 },
  );

  expect(distanceKm).toBeGreaterThan(10);
  expect(distanceKm).toBeLessThan(13);
});

test("calculateDistanceKm returns zero for the same coordinates", () => {
  expect(
    calculateDistanceKm(
      { latitude: 35, longitude: 138 },
      { latitude: 35, longitude: 138 },
    ),
  ).toBe(0);
});
