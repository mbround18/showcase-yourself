import { expect, test } from "@playwright/test"
import { loginAs } from "./helpers"

test.describe.serial("auth and admin portal", () => {

  test("unauthenticated direct navigation to /admin is redirected away", async ({ page }) => {
    await page.goto("/admin")
    await expect(page).toHaveURL("/")
  })

  test("direct API call to /api/admin/contacts without a session is denied", async ({
    request,
  }) => {
    const res = await request.get("/api/admin/contacts")
    expect(res.status()).toBe(403)
  })

  test("owner can log in, see submissions, change status, and delete", async ({ page }) => {
    // Seed a submission to manage.
    page.once("dialog", (dialog) => dialog.accept())
    await page.goto("/contact")
    await page.getByLabel("Name").fill("Admin Flow Contact")
    await page.getByLabel("Email").fill("admin-flow@example.com")
    await page.getByLabel("Your message").fill("Message for the admin flow test.")
    await page.getByRole("button", { name: "Send" }).click()
    await expect(page.getByLabel("Name")).toHaveValue("")

    await loginAs(page, "owner", "owner-password")
    await expect(page).toHaveURL(/\/admin$/)

    const row = page.getByRole("row", { name: /Admin Flow Contact/ }).first()
    await expect(row).toBeVisible()
    await row.getByRole("link", { name: "Admin Flow Contact" }).click()

    await expect(page.getByText("Message for the admin flow test.")).toBeVisible()
    await page.getByRole("button", { name: "Mark as Lead" }).click()
    await expect(page.getByText("Lead", { exact: true })).toBeVisible()

    page.once("dialog", (dialog) => dialog.accept())
    await page.getByRole("button", { name: "Delete" }).click()
    await expect(page).toHaveURL(/\/admin$/)
    await expect(page.getByText("Admin Flow Contact")).toHaveCount(0)
  })

  test("non-owner sign-in cannot reach the admin portal", async ({ page }) => {
    await loginAs(page, "visitor", "visitor-password")
    await page.goto("/admin")
    await expect(page).toHaveURL("/")
  })
})
