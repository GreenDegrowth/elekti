import { expect, test } from "@playwright/test";

test("landing loads with title and start button", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Match your vote to your metro" })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Start the quiz" })
  ).toBeVisible();
});

test("start button navigates to quiz with 30 questions", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start the quiz" }).click();
  await expect(page).toHaveURL(/\/quiz/);
  await expect(page.getByText("Question 1 of 30")).toBeVisible();
});

test("language switch updates landing copy", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("button", { name: /Change language|Verander taal/ })
    .click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.getByRole("option", { name: "Afrikaans" }).click();
  await expect(
    page.getByRole("heading", { name: /Pas jou stem/i })
  ).toBeVisible();

  await page.getByRole("button", { name: "Verander taal" }).click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.getByRole("option", { name: "Engels" }).click();
  await expect(
    page.getByRole("heading", { name: "Match your vote to your metro" })
  ).toBeVisible();
});

test("about link reaches about page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "About" }).click();
  await expect(
    page.getByRole("heading", { name: "About Elekti" })
  ).toBeVisible();
});

test("dev shortcut navigates to results", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /DEV: Metro/i }).click();
  await expect(page).toHaveURL(/\/results/);
  await expect(
    page.getByRole("heading", { name: "Your matches" })
  ).toBeVisible();
});

test("logo link returns to landing page", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("link", { name: /Elekti South African/i }).click();
  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("heading", { name: "Match your vote to your metro" })
  ).toBeVisible();
});

test("language persists across page navigation", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: /Change language|Verander taal/ })
    .click();
  await page.getByRole("option", { name: "Afrikaans" }).click();
  await expect(
    page.getByRole("heading", { name: /Pas jou stem/i })
  ).toBeVisible();

  await page.getByRole("link", { name: "Oor" }).click();
  await expect(page.getByRole("heading", { name: "Oor Elekti" })).toBeVisible();

  await page.getByRole("link", { name: /Elekti Suid-Afrikaanse/i }).click();
  await expect(
    page.getByRole("heading", { name: /Pas jou stem/i })
  ).toBeVisible();
});
