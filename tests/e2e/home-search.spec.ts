import { expect, test } from "@playwright/test";

test("searches from the homepage", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("駅名・都道府県・住所で検索").fill("静岡");
  await page.getByRole("button", { name: "検索する" }).click();
  await expect(page).toHaveURL(/\/search\?q=%E9%9D%99%E5%B2%A1/);
  await expect(page.getByRole("heading", { name: /件の道の駅が見つかりました/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "道の駅 富士" })).toBeVisible();
});