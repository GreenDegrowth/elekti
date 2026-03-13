import { expect, test } from "@playwright/test";

test("metro flow completes quiz and shows results", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");
  await page.getByRole("button", { name: "Start the quiz" }).click();

  await expect(page.getByText("Question 1 of 30")).toBeVisible();

  for (let index = 1; index <= 30; index += 1) {
    const neutralOption = page.getByRole("radio", {
      name: "Neutral",
      exact: true,
    });
    await expect(neutralOption).toBeEnabled();
    await neutralOption.click();

    if (index < 30) {
      await expect(page.getByText(`Question ${index + 1} of 30`)).toBeVisible();
    }
  }

  await expect(
    page.getByRole("heading", { name: "Your matches" })
  ).toBeVisible();
});
