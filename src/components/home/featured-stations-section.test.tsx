import { render, screen } from "@testing-library/react";

import { FeaturedStationsSection } from "./featured-stations-section";

test("shows the featured stations section heading", () => {
  render(<FeaturedStationsSection />);

  expect(screen.getByText("おすすめ")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "注目の道の駅" })).toBeInTheDocument();
});