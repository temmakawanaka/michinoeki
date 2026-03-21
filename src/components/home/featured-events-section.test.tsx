import { render, screen } from "@testing-library/react";

import { FeaturedEventsSection } from "./featured-events-section";

test("shows featured event items for discovery", () => {
  render(
    <FeaturedEventsSection
      items={[
        {
          title: "春のいちごフェア",
          stationName: "道の駅 みのりの郷東金",
          prefecture: "千葉県",
          dateLabel: "3月下旬の週末",
          summary: "直売所の朝採れいちごと限定スイーツを楽しめる季節イベントです。",
          tags: ["旬の味覚", "家族で立ち寄りたい"],
        },
      ]}
    />,
  );

  expect(screen.getByText("イベント")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "今気になるイベント" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "春のいちごフェア" })).toBeInTheDocument();
  expect(screen.getByText("3月下旬の週末")).toBeInTheDocument();
  expect(screen.getByText("道の駅 みのりの郷東金")).toBeInTheDocument();
  expect(screen.getByText("千葉県")).toBeInTheDocument();
  expect(screen.getByText("旬の味覚")).toBeInTheDocument();
});
