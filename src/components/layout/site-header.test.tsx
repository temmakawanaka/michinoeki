import { render, screen } from "@testing-library/react";

import { SiteHeader } from "./site-header";

test("renders the Japanese site header tone", () => {
  render(<SiteHeader />);

  expect(screen.getByText("全国の道の駅をめぐる入口")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "道の駅ガイド" })).toBeInTheDocument();
});
