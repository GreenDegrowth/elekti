import { expect, test } from "@playwright/test";

test("about page loads with all sections", async ({ page }) => {
  await page.goto("/about");
  await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("heading", { name: "About Elekti", level: 1 })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /How this tool is built/i, level: 2 })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /What you answer/i, level: 3 })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /How we score/i, level: 3 })
  ).toBeVisible();
});

test("privacy section is visible on about page", async ({ page }) => {
  await page.goto("/about");

  await page.getByRole("link", { name: "Privacy" }).click();
  await expect(page.getByRole("heading", { name: "Privacy" })).toBeVisible();
});

test("about page language switch updates content", async ({ page }) => {
  await page.goto("/about");

  await expect(
    page.getByRole("heading", { name: "About Elekti" })
  ).toBeVisible();

  await page
    .getByRole("button", { name: /Change language|Verander taal/ })
    .click();
  await page.getByRole("option", { name: "Afrikaans" }).click();

  await expect(page.getByRole("heading", { name: "Oor Elekti" })).toBeVisible();
});

test("external GPL license link works", async ({ page }) => {
  await page.goto("/about");

  const licenseLink = page.getByRole("link", { name: "GNU GPL v3" });
  await expect(licenseLink).toHaveAttribute("target", "_blank");
  await expect(licenseLink).toHaveAttribute(
    "href",
    "https://opensource.org/license/gpl-3-0-only"
  );
});

test("about page accessible from landing via footer", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL("/about");
  await expect(
    page.getByRole("heading", { name: "About Elekti" })
  ).toBeVisible();
});

test("navigation back to home from about works", async ({ page }) => {
  await page.goto("/about");

  await page.getByRole("link", { name: /Elekti South African/i }).click();
  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("heading", { name: "Match your vote to South Africa" })
  ).toBeVisible();
});
