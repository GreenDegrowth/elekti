import { expect, test } from "@playwright/test";

test("quick flow completes quiz and shows results", async ({ page }) => {
  await page.goto("/");
  await page.locator("label[role=radio]", { hasText: "Quick (12)" }).click();
  await page.getByRole("button", { name: "Start the quiz" }).click();

  await expect(page.getByText("Question 1 of 12")).toBeVisible();

  for (let index = 1; index <= 12; index += 1) {
    const neutralOption = page.getByRole("radio", {
      name: "Neutral",
      exact: true,
    });
    await expect(neutralOption).toBeEnabled();
    await neutralOption.click();

    if (index < 12) {
      await expect(page.getByText(`Question ${index + 1} of 12`)).toBeVisible();
    }
  }

  await expect(
    page.getByRole("heading", { name: "Your matches" })
  ).toBeVisible();
});
