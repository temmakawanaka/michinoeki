import { render, screen } from "@testing-library/react";

import { StationDetail } from "./station-detail";

test("shows station detail fields", () => {
  render(
    <StationDetail
      station={{
        slug: "michinoeki-fuji",
        name: "Michi-no-Eki Fuji",
        prefecture: "Shizuoka",
        address: "669-1 Gokanjima, Fuji, Shizuoka",
        openingHours: "09:00-18:00",
        closingDays: "Open daily",
        dataConfidence: "high",
        parking: { regularCars: 52, accessibleCars: 2, largeVehicles: 12 },
        facilities: { hasShop: true, hasWifi: true },
        sourceRecords: [{ id: "src1", sourceName: "mlit", sourceType: "official", trustScore: 100 }],
      }}
    />,
  );

  expect(screen.getByRole("heading", { name: "Michi-no-Eki Fuji" })).toBeInTheDocument();
  expect(screen.getByText("669-1 Gokanjima, Fuji, Shizuoka")).toBeInTheDocument();
  expect(screen.getByText(/09:00-18:00/)).toBeInTheDocument();
  expect(screen.getByText(/high/i)).toBeInTheDocument();
});
