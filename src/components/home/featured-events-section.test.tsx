import { render, screen } from "@testing-library/react";

import { FeaturedEventsSection } from "./featured-events-section";

test("shows featured event items for discovery", () => {
  render(
    <FeaturedEventsSection
      items={[
        {
          title: "富士川寄り道プラン",
          stationName: "道の駅 富士",
          prefecture: "静岡県",
          dateLabel: "今週のおすすめ",
          summary: "海沿いドライブの途中で立ち寄りやすく、営業時間や設備もそのまま確認できます。",
          tags: ["実在ページへ移動できる", "景色を楽しむ"],
          href: "/stations/michinoeki-fuji",
        },
      ]}
    />,
  );

  expect(screen.getAllByText("話題").length).toBeGreaterThan(0);
  expect(screen.getByRole("heading", { name: "今週の話題" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "富士川寄り道プラン" })).toBeInTheDocument();
  expect(screen.getByText("今週のおすすめ")).toBeInTheDocument();
  expect(screen.getByText("道の駅 富士")).toBeInTheDocument();
  expect(screen.getByText("静岡県")).toBeInTheDocument();
  expect(screen.getByText("実在ページへ移動できる")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "駅の詳細を見る" })).toHaveAttribute("href", "/stations/michinoeki-fuji");
});
