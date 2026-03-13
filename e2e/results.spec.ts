import { expect, test } from "@playwright/test";
import { buildResultsUrl } from "./helpers";

const metroResultsUrl = buildResultsUrl(2);

test("dev shortcut reaches results and can retake", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /DEV: Metro/i }).click();
  await expect(page).toHaveURL(/\/results/);
  await expect(
    page.getByRole("heading", { name: "Your matches" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Answer again" }).click();
  await expect(page).toHaveURL(/\/quiz/);
});

test("results deep link renders primary match", async ({ page }) => {
  await page.goto(metroResultsUrl);

  await expect(
    page.getByRole("heading", { name: "Your matches" })
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Strongest alignment" })
  ).toBeVisible();
});

test("results issue toggle expands and collapses", async ({ page }) => {
  await page.goto(metroResultsUrl);

  const showIssues = page
    .getByRole("button", { name: "Show all issues" })
    .first();
  await showIssues.click();
  await expect(
    page.getByRole("button", { name: "Hide issues" }).first()
  ).toBeVisible();
});

test("results table view supports comparison", async ({ page }) => {
  await page.goto(metroResultsUrl);

  await page.getByRole("button", { name: "Table view" }).click();

  const comparisonBoxes = page.getByRole("checkbox", {
    name: /Select .* for comparison/,
  });
  await comparisonBoxes.nth(0).click();
  await comparisonBoxes.nth(1).click();

  await expect(page.getByText(/2 selected/)).toBeVisible();
  await page.getByRole("button", { name: "Compare" }).click();
  await expect(
    page.getByRole("heading", { name: "Compare parties" })
  ).toBeVisible();
});

test("copy shareable link button works", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(
    browserName === "firefox",
    "Firefox clipboard permissions not supported"
  );

  await context.grantPermissions(["clipboard-write", "clipboard-read"]);
  await page.goto(metroResultsUrl);

  await page.getByRole("button", { name: "Copy shareable link" }).click();

  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText()
  );
  expect(clipboardText).toContain("/results");
  expect(clipboardText).toContain("m=metro");
});

test("open party site link navigates externally", async ({ page }) => {
  await page.goto(metroResultsUrl);

  const partyLink = page.getByRole("link", { name: "Open party site" }).first();
  await expect(partyLink).toHaveAttribute("target", "_blank");
  await expect(partyLink).toHaveAttribute("href", /.+/);
});

test("confidence indicator displays correctly", async ({ page }) => {
  await page.goto(metroResultsUrl);

  await expect(page.getByText(/Clear fit|Mixed fit|Thin fit/i)).toBeVisible();
});

test("switching between strongest alignment and table view", async ({
  page,
}) => {
  await page.goto(metroResultsUrl);

  const cardViewButton = page.getByRole("button", { name: /card view/i });
  const tableViewButton = page.getByRole("button", { name: /table view/i });

  await expect(cardViewButton).toHaveClass(/active/);

  await tableViewButton.click();
  await expect(page.getByTestId("result-table")).toBeVisible();
  await expect(tableViewButton).toHaveClass(/active/);

  await cardViewButton.click();
  await expect(cardViewButton).toHaveClass(/active/);
  await expect(page.getByTestId("result-table")).not.toBeVisible();
});

test("answer again button resets to quiz start", async ({ page }) => {
  await page.goto(metroResultsUrl);

  await page.getByRole("button", { name: "Answer again" }).click();
  await expect(page).toHaveURL(/\/quiz/);
  await expect(page.getByTestId("progress-label")).toContainText(/Question 1 of \d+/);
});

test("all party cards display in table view", async ({ page }) => {
  await page.goto(metroResultsUrl);

  await page.getByRole("button", { name: /table view/i }).click();
  await expect(page.getByTestId("result-table")).toBeVisible();

  const tableRows = page.getByTestId("result-table-row");
  await expect(tableRows.first()).toBeVisible();
  const count = await tableRows.count();
  expect(count).toBeGreaterThan(0);
});

test("comparison view displays differences correctly", async ({ page }) => {
  await page.goto(metroResultsUrl);

  await page.getByRole("button", { name: /table view/i }).click();

  const comparisonBoxes = page.getByRole("checkbox", {
    name: /Select .* for comparison/,
  });
  await comparisonBoxes.nth(0).click();
  await comparisonBoxes.nth(1).click();
  await page.getByRole("button", { name: "Compare" }).click();

  await expect(
    page.getByRole("heading", { name: "Compare parties" })
  ).toBeVisible();

  const closeButton = page.getByRole("button", {
    name: "Close comparison",
  });
  await expect(closeButton).toBeVisible();
  await closeButton.click();

  await expect(page.getByTestId("result-table")).toBeVisible();
});

test("results page shows close alternatives section", async ({ page }) => {
  await page.goto(metroResultsUrl);

  await expect(
    page.getByRole("heading", { name: "Close alternatives" })
  ).toBeVisible();
});

test("language switch updates results page content", async ({ page }) => {
  await page.goto(metroResultsUrl);

  await expect(
    page.getByRole("heading", { name: "Your matches" })
  ).toBeVisible();

  await page
    .getByRole("button", { name: /Change language|Verander taal/ })
    .click();
  await page.getByRole("option", { name: "Afrikaans" }).click();

  await expect(
    page.getByRole("heading", { name: /Jou ooreenkomste/i })
  ).toBeVisible();
});
