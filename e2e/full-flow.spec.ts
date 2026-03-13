import { expect, test } from "@playwright/test";

test("metro flow completes quiz and shows results", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");
  await page.getByRole("button", { name: "Start the quiz" }).click();

  const progressLabel = page.getByTestId("progress-label");
  await expect(progressLabel).toBeVisible();
  const labelText = await progressLabel.textContent();
  const total = Number.parseInt(labelText?.match(/of (\d+)/)?.[1] ?? "0");
  expect(total).toBeGreaterThan(0);

  for (let index = 1; index <= total; index += 1) {
    const neutralOption = page.getByRole("radio", {
      name: "Neutral",
      exact: true,
    });
    await expect(neutralOption).toBeEnabled();
    await neutralOption.click();

    if (index < total) {
      await expect(progressLabel).toContainText(`Question ${index + 1} of ${total}`);
    }
  }

  await expect(
    page.getByRole("heading", { name: "Your matches" })
  ).toBeVisible();
});
