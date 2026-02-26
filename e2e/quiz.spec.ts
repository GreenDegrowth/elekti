import { expect, test } from "@playwright/test";

test("start quiz and answer first question", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start the quiz" }).click();

  await expect(page).toHaveURL(/\/quiz/);
  await expect(page.getByRole("heading", { level: 2 })).toBeVisible();

  await page.getByRole("radio", { name: "Strongly agree" }).click();
  await expect(page.getByTitle("Next")).toBeEnabled();
});

test("quiz navigation requires an answer and supports back", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start the quiz" }).click();

  await expect(page.getByTitle("Next")).toBeDisabled();
  await page.getByRole("radio", { name: "Neutral" }).click();
  await expect(page.getByText("Question 2 of 55")).toBeVisible();

  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByText("Question 1 of 55")).toBeVisible();
});

test("progress bar updates as quiz advances", async ({ page }) => {
  await page.goto("/");
  await page.locator("label[role=radio]", { hasText: "Quick (12)" }).click();
  await page.getByRole("button", { name: "Start the quiz" }).click();

  const progressBar = page.locator('[role="progressbar"]');
  await expect(progressBar).toHaveAttribute("aria-valuenow", "0");

  await page.getByRole("radio", { name: "Neutral" }).click();
  await expect(progressBar).toHaveAttribute("aria-valuenow", /[89]|10/);
});

test("changing answer updates selection before advancing", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start the quiz" }).click();

  const agreeOption = page.getByRole("radio", { name: "Agree", exact: true });
  await expect(agreeOption).toBeEnabled();
  await agreeOption.click();
  await expect(agreeOption).toBeChecked();

  const disagreeOption = page.getByRole("radio", {
    name: "Strongly disagree",
    exact: true,
  });
  await expect(disagreeOption).toBeEnabled();
  await disagreeOption.click();
  await expect(disagreeOption).toBeChecked();
  await expect(agreeOption).not.toBeChecked();
});

test("quiz preserves answer when navigating back and forward", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start the quiz" }).click();

  const progressLabel = page.locator(".progress-bar__label");
  await expect(progressLabel).toContainText("Question 1 of 55");

  const stronglyAgree = page.getByRole("radio", {
    name: "Strongly agree",
    exact: true,
  });
  await stronglyAgree.click();
  await expect(stronglyAgree).toBeChecked();

  await expect(progressLabel).toContainText("Question 2 of 55");

  await page.getByRole("button", { name: "Back" }).click();
  await expect(progressLabel).toContainText("Question 1 of 55");

  await expect(stronglyAgree).toBeChecked();
});

test("quiz language switch updates questions", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start the quiz" }).click();

  const languageButton = page.locator(".language-selector__button");
  await languageButton.click();
  await page.getByRole("option", { name: "Afrikaans" }).click();

  const progressLabel = page.locator(".progress-bar__label");
  await expect(progressLabel).toContainText("Vraag 1 van 55");
});

test("all answer options are visible and selectable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start the quiz" }).click();

  const options = [
    "Strongly agree",
    "Agree",
    "Neutral",
    "Disagree",
    "Strongly disagree",
  ];

  for (const option of options) {
    const radio = page.getByRole("radio", { name: option, exact: true });
    await expect(radio).toBeVisible();
    await expect(radio).toBeEnabled();
    await radio.click();
    await expect(radio).toBeChecked();
  }
});

test("logo during quiz returns to landing and resets", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start the quiz" }).click();

  await page.getByRole("radio", { name: "Neutral" }).click();
  await expect(page.getByText("Question 2 of 55")).toBeVisible();

  await page.getByRole("link", { name: /Elekti South African/i }).click();
  await expect(page).toHaveURL("/");

  await page.getByRole("button", { name: "Start the quiz" }).click();
  await expect(page.getByText("Question 1 of 55")).toBeVisible();
});
