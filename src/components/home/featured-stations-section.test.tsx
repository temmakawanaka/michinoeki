import { render, screen } from "@testing-library/react";

import { FeaturedStationsSection } from "./featured-stations-section";

test("shows featured station cards with practical details", () => {
  render(
    <FeaturedStationsSection
      items={[
        {
          slug: "michinoeki-fujiyoshida",
          name: "道の駅 富士吉田",
          prefecture: "山梨県",
          regionLabel: "富士山の玄関口",
          highlight: "朝の富士山を眺めながら地元うどんでひと休み。",
          detail: "富士山レーダードーム館や湧水スポットにも立ち寄りやすい週末向けの一駅です。",
          tags: ["景色が気持ちいい", "朝ドライブ向き"],
        },
      ]}
    />,
  );

  expect(screen.getByText("おすすめ")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "今週のおすすめ道の駅" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "道の駅 富士吉田" })).toBeInTheDocument();
  expect(screen.getByText("山梨県")).toBeInTheDocument();
  expect(screen.getByText("富士山の玄関口")).toBeInTheDocument();
  expect(screen.getByText("朝の富士山を眺めながら地元うどんでひと休み。")).toBeInTheDocument();
  expect(screen.getByText("景色が気持ちいい")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /道の駅 富士吉田/ })).toHaveAttribute(
    "href",
    "/stations/michinoeki-fujiyoshida",
  );
});
