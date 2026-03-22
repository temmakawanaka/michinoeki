import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import SearchPage from "./page";

vi.mock("@/lib/stations/search-stations", () => ({
  searchStations: vi.fn().mockResolvedValue({
    total: 0,
    items: [],
  }),
}));

vi.mock("@/lib/stations/list-station-prefectures", () => ({
  listStationPrefectures: vi.fn().mockResolvedValue(["北海道", "静岡県"]),
}));

test("keeps prefecture choices visible even when the current filter yields no results", async () => {
  render(
    await SearchPage({
      searchParams: Promise.resolve({
        q: "富士",
        prefecture: "北海道",
      }),
    }),
  );

  expect(screen.getByRole("link", { name: "北海道" })).toHaveAttribute(
    "href",
    "/search?q=%E5%AF%8C%E5%A3%AB&prefecture=%E5%8C%97%E6%B5%B7%E9%81%93",
  );
  expect(screen.getByRole("link", { name: "静岡県" })).toHaveAttribute(
    "href",
    "/search?q=%E5%AF%8C%E5%A3%AB&prefecture=%E9%9D%99%E5%B2%A1%E7%9C%8C",
  );
  expect(screen.getByRole("link", { name: "都道府県を解除" })).toHaveAttribute(
    "href",
    "/search?q=%E5%AF%8C%E5%A3%AB",
  );
});
