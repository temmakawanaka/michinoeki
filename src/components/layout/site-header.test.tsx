import { render, screen } from "@testing-library/react";

import { SiteHeader } from "./site-header";

test("renders site title", () => {
  render(<SiteHeader />);
  expect(screen.getByText("道の駅ガイド")).toBeInTheDocument();
});