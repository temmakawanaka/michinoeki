import { render, screen } from "@testing-library/react";

import { StationCard } from "./station-card";

test("shows basic station summary", () => {
  render(
    <StationCard
      station={{
        slug: "michinoeki-fuji",
        name: "道の駅 富士",
        prefecture: "静岡県",
        address: "静岡県富士市五貫島669-1",
      }}
    />,
  );

  expect(screen.getByText("道の駅 富士")).toBeInTheDocument();
  expect(screen.getByText("静岡県")).toBeInTheDocument();
});
