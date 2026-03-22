import { render, screen } from "@testing-library/react";

import { PrefectureFilter } from "./prefecture-filter";

test("renders prefecture links that preserve the current query", () => {
  render(<PrefectureFilter selected="静岡県" query="富士" />);

  expect(screen.getByRole("link", { name: "東京都" })).toHaveAttribute("href", "/search?q=%E5%AF%8C%E5%A3%AB&prefecture=%E6%9D%B1%E4%BA%AC%E9%83%BD");
  expect(screen.getByRole("link", { name: "静岡県" })).toHaveAttribute("href", "/search?q=%E5%AF%8C%E5%A3%AB&prefecture=%E9%9D%99%E5%B2%A1%E7%9C%8C");
  expect(screen.getByRole("link", { name: "静岡県" })).toHaveAttribute("aria-current", "page");
});
