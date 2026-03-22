import { render, screen } from "@testing-library/react";

import { FeaturedStationsSection } from "./featured-stations-section";

test("shows featured station cards with practical details", () => {
  render(
    <FeaturedStationsSection
      items={[
        {
          slug: "michinoeki-fuji",
          name: "道の駅 富士",
          prefecture: "静岡県",
          regionLabel: "富士川沿いでひと息つける実在スポット",
          highlight: "海と富士山の気配を感じながら、移動の合間に立ち寄りやすい一駅です。",
          detail: "営業時間や駐車場情報も確認できるので、東名周辺の休憩地点を探す入口として実用的に使えます。",
          tags: ["実在ページへ移動できる", "静岡ドライブの途中向き"],
        },
      ]}
    />,
  );

  expect(screen.getByText("おすすめ")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "今週のおすすめ道の駅" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "道の駅 富士" })).toBeInTheDocument();
  expect(screen.getByText("静岡県")).toBeInTheDocument();
  expect(screen.getByText("富士川沿いでひと息つける実在スポット")).toBeInTheDocument();
  expect(screen.getByText("海と富士山の気配を感じながら、移動の合間に立ち寄りやすい一駅です。")).toBeInTheDocument();
  expect(screen.getByText("実在ページへ移動できる")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /道の駅 富士/ })).toHaveAttribute("href", "/stations/michinoeki-fuji");
});
