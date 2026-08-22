import type { Page } from "@playwright/test"

export async function loginAs(page: Page, username: string, password: string) {
  await page.goto("/api/auth/login")
  await page.getByLabel("Username or email").fill(username)
  await page.getByLabel("Password", { exact: true }).fill(password)
  await page.getByRole("button", { name: "Sign In" }).click()
  await page.waitForURL(
    (url) => url.port === "5173" && !url.pathname.startsWith("/api/"),
  )
}
