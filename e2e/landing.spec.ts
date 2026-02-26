import { expect, test } from "@playwright/test";

test("landing loads and mode selection works", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Match your vote to South Africa" })
  ).toBeVisible();

  const balancedMode = page.locator("label[role=radio]", {
    hasText: "Balanced (24)",
  });
  await balancedMode.click();
  await expect(balancedMode).toHaveAttribute("aria-checked", "true");
});

test("mode selection sets quiz length", async ({ page }) => {
  await page.goto("/");
  await page.locator("label[role=radio]", { hasText: "Quick (12)" }).click();
  await page.getByRole("button", { name: "Start the quiz" }).click();
  await expect(page.getByText("Question 1 of 12")).toBeVisible();

  await page.goto("/");
  await page.locator("label[role=radio]", { hasText: "Balanced (24)" }).click();
  await page.getByRole("button", { name: "Start the quiz" }).click();
  await expect(page.getByText("Question 1 of 24")).toBeVisible();

  await page.goto("/");
  await page.locator("label[role=radio]", { hasText: "Full (55)" }).click();
  await page.getByRole("button", { name: "Start the quiz" }).click();
  await expect(page.getByText("Question 1 of 55")).toBeVisible();
});

test("language switch updates landing copy", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("button", { name: /Change language|Verander taal/ })
    .click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.getByRole("option", { name: "Afrikaans" }).click();
  await expect(
    page.getByRole("heading", { name: "Pas jou stem by Suid-Afrika" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Verander taal" }).click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.getByRole("option", { name: "Engels" }).click();
  await expect(
    page.getByRole("heading", { name: "Match your vote to South Africa" })
  ).toBeVisible();
});

test("about and privacy links reach about page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "About" }).click();
  await expect(
    page.getByRole("heading", { name: "About Elekti" })
  ).toBeVisible();

  await page.getByRole("link", { name: "Privacy" }).click();
  await expect(page.getByRole("heading", { name: "Privacy" })).toBeVisible();
});

test("dev shortcuts navigate to results with correct modes", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: /DEV: Quick.*Results/i }).click();
  await expect(page).toHaveURL(/\/results.*m=quick/);
  await expect(
    page.getByRole("heading", { name: "Your matches" })
  ).toBeVisible();

  await page.goto("/");
  await page.getByRole("button", { name: /DEV: Balanced.*Results/i }).click();
  await expect(page).toHaveURL(/\/results.*m=balanced/);

  await page.goto("/");
  await page.getByRole("button", { name: /DEV: Full.*Results/i }).click();
  await expect(page).toHaveURL(/\/results.*m=full/);
});

test("logo link returns to landing page", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("link", { name: /Elekti South African/i }).click();
  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("heading", { name: "Match your vote to South Africa" })
  ).toBeVisible();
});

test("survey mode persists when navigating away and back", async ({ page }) => {
  await page.goto("/");
  await page.locator("label[role=radio]", { hasText: "Full (55)" }).click();
  await page.getByRole("link", { name: "About" }).click();
  await page.getByRole("link", { name: /Elekti South African/i }).click();
  await expect(
    page.locator("label[role=radio]", { hasText: "Full (55)" })
  ).toHaveAttribute("aria-checked", "true");
});

test("language persists across page navigation", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: /Change language|Verander taal/ })
    .click();
  await page.getByRole("option", { name: "Afrikaans" }).click();
  await expect(
    page.getByRole("heading", { name: "Pas jou stem by Suid-Afrika" })
  ).toBeVisible();

  await page.getByRole("link", { name: "Oor" }).click();
  await expect(page.getByRole("heading", { name: "Oor Elekti" })).toBeVisible();

  await page.getByRole("link", { name: /Elekti Suid-Afrikaanse/i }).click();
  await expect(
    page.getByRole("heading", { name: "Pas jou stem by Suid-Afrika" })
  ).toBeVisible();
});
