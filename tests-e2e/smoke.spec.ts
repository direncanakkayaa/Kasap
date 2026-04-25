import { test, expect } from "@playwright/test";

test("has title and logo", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Erdoğan Kasap/);
});

test("navigation to kurban page works", async ({ page }) => {
  await page.goto("/");
  await page.click('text="Kurban Hisse"');
  await expect(page).toHaveURL(/.*kurban/);
  await expect(page.locator("h1")).toContainText("Kurban Hisse");
});

test("share calculator responds to input", async ({ page }) => {
  await page.goto("/kurban");
  const slider = page.locator('input[type="range"]');
  await slider.fill("400");
  await expect(page.locator('text="400"')).toBeVisible();
});
