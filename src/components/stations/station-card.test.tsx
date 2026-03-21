import { render, screen } from "@testing-library/react";

import { StationCard } from "./station-card";

test("shows basic station summary", () => {
  render(
    <StationCard
      station={{
        slug: "michinoeki-fuji",
        name: "Michi-no-Eki Fuji",
        prefecture: "Shizuoka",
        address: "669-1 Gokanjima, Fuji, Shizuoka",
      }}
    />,
  );

  expect(screen.getByText("Michi-no-Eki Fuji")).toBeInTheDocument();
  expect(screen.getByText("Shizuoka")).toBeInTheDocument();
});
