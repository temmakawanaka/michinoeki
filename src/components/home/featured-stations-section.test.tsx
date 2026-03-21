import { render, screen } from "@testing-library/react";

import { FeaturedStationsSection } from "./featured-stations-section";

test("shows the featured stations section heading", () => {
  render(<FeaturedStationsSection />);

  expect(screen.getByText("\u304A\u3059\u3059\u3081")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "\u6CE8\u76EE\u306E\u9053\u306E\u99C5" })).toBeInTheDocument();
});
