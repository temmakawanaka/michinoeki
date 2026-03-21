import { render, screen } from "@testing-library/react";

import { SectionHeading } from "../ui/section-heading";

function renderFeaturedStationsHeading() {
  render(<SectionHeading eyebrow="Ç®Ç∑Ç∑Çﬂ" title="íçñ⁄ÇÃìπÇÃâw" level={3} />);
}

test("shows the shared section heading with an explicit level", () => {
  renderFeaturedStationsHeading();

  expect(screen.getByText("Ç®Ç∑Ç∑Çﬂ")).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 3, name: "íçñ⁄ÇÃìπÇÃâw" })).toBeInTheDocument();
});