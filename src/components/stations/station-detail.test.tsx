import { render, screen } from "@testing-library/react";

import { StationDetail } from "./station-detail";

test("shows station detail fields", () => {
  render(
    <StationDetail
      station={{
        slug: "michinoeki-fuji",
        name: "道の駅 富士",
        prefecture: "静岡県",
        address: "静岡県富士市五貫島669-1",
        openingHours: "09:00-18:00",
        closingDays: "年中無休",
        dataConfidence: "high",
        parking: { regularCars: 52, accessibleCars: 2, largeVehicles: 12 },
        facilities: { hasShop: true, hasWifi: true },
        sourceRecords: [{ id: "src1", sourceName: "mlit", sourceType: "official", trustScore: 100 }],
      }}
    />,
  );

  expect(screen.getByRole("heading", { name: "道の駅 富士" })).toBeInTheDocument();
  expect(screen.getByText("静岡県富士市五貫島669-1")).toBeInTheDocument();
  expect(screen.getByText(/09:00-18:00/)).toBeInTheDocument();
  expect(screen.getByText(/高/)).toBeInTheDocument();
});

test("shows unknown when facility data is missing", () => {
  render(
    <StationDetail
      station={{
        slug: "michinoeki-fuji",
        name: "道の駅 富士",
        prefecture: "静岡県",
        address: "静岡県富士市五貫島669-1",
        sourceRecords: [{ id: "src1", sourceName: "mlit", sourceType: "official", trustScore: 100 }],
        facilities: null,
      }}
    />,
  );

  expect(screen.getByText("売店: 未確認")).toBeInTheDocument();
  expect(screen.getByText("Wi-Fi: 未確認")).toBeInTheDocument();
});
