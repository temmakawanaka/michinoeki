import { render, screen } from "@testing-library/react";

import { SectionHeading } from "../ui/section-heading";

function FeaturedStationsSectionTestHarness() {
  return <SectionHeading eyebrow="おすすめ" title="注目の道の駅" />;
}

test("shows Japanese eyebrow and title", () => {
  render(<FeaturedStationsSectionTestHarness />);

  expect(screen.getByText("おすすめ")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "注目の道の駅" })).toBeInTheDocument();
});
