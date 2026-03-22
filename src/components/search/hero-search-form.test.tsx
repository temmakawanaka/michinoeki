import { render, screen } from "@testing-library/react";

import { HeroSearchForm } from "./hero-search-form";

test("uses the visible search label as the accessible name", () => {
  render(<HeroSearchForm />);

  expect(screen.getByRole("searchbox", { name: "駅名・地名・住所から検索" })).toBeInTheDocument();
});
