import { expect, test } from "@playwright/test";

test("opens a station detail page from search results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox", { name: "Search" }).fill("Fuji");
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByRole("link", { name: "Michi-no-Eki Fuji" }).click();
  await expect(page.getByRole("heading", { name: "Michi-no-Eki Fuji" })).toBeVisible();
  await expect(page.getByText("669-1 Gokanjima, Fuji, Shizuoka")).toBeVisible();
});
