import { expect, test } from "@playwright/test"

test("anonymous visitor can submit the contact form", async ({ page }) => {
  page.once("dialog", (dialog) => dialog.accept())

  await page.goto("/contact")
  await page.getByLabel("Name").fill("Playwright Visitor")
  await page.getByLabel("Email").fill("playwright@example.com")
  await page.getByLabel("Your message").fill("Automated end-to-end test message.")
  await page.getByRole("button", { name: "Send" }).click()

  await expect(page.getByLabel("Name")).toHaveValue("")
})
