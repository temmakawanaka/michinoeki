import { expect, test } from "@playwright/test";

test("opens a station detail page from search results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox", { name: "道の駅検索" }).fill("富士");
  await page.getByRole("button", { name: "検索する" }).click();
  await page.getByRole("link", { name: "道の駅 富士" }).click();
  await expect(page.getByRole("heading", { name: "道の駅 富士" })).toBeVisible();
  await expect(page.getByText("静岡県富士市五貫島669-1")).toBeVisible();
});