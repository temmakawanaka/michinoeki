import { render, screen } from "@testing-library/react";

import { PrefectureFilter } from "./prefecture-filter";

test("renders only supported prefecture links and preserves the current query", () => {
  render(<PrefectureFilter prefectures={["静岡県"]} selected="静岡県" query="富士" />);

  expect(screen.queryByRole("link", { name: "東京都" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "静岡県" })).toHaveAttribute("href", "/search?q=%E5%AF%8C%E5%A3%AB&prefecture=%E9%9D%99%E5%B2%A1%E7%9C%8C");
  expect(screen.getByRole("link", { name: "静岡県" })).toHaveAttribute("aria-current", "page");
});

test("renders a clear filter link that keeps the current query", () => {
  render(<PrefectureFilter prefectures={["静岡県"]} selected="静岡県" query="富士" />);

  expect(screen.getByRole("link", { name: "都道府県を解除" })).toHaveAttribute("href", "/search?q=%E5%AF%8C%E5%A3%AB");
});
