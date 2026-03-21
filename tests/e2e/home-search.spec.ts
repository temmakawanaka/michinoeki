import { expect, test } from "@playwright/test";

test("searches from the homepage", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search by station, prefecture, or address").fill("Shizuoka");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/search\?q=Shizuoka/);
  await expect(page.getByRole("heading", { name: /stations found/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Michi-no-Eki Fuji" })).toBeVisible();
});