import { render, screen } from "@testing-library/react";

import { SiteHeader } from "./site-header";

test("renders the Japanese site header tone without a page-level heading", () => {
  render(<SiteHeader />);

  expect(screen.getByText("全国の道の駅をめぐる入口")).toBeInTheDocument();
  expect(screen.getByText("道の駅ガイド")).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "道の駅ガイド" })).not.toBeInTheDocument();
});
