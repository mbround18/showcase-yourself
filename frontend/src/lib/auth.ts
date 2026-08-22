export type Role = "owner" | "visitor"

export interface AuthState {
  authenticated: boolean
  email: string | null
  role: Role | null
}

export async function fetchMe(): Promise<AuthState> {
  const response = await fetch("/api/auth/me", { credentials: "include" })
  if (!response.ok) {
    return { authenticated: false, email: null, role: null }
  }
  return response.json()
}

export async function fetchCsrfToken(): Promise<string> {
  const response = await fetch("/api/csrf", { credentials: "include" })
  return response.json()
}

export async function logout(csrfToken: string): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: { "X-CSRF-Token": csrfToken },
  })
}

export function loginUrl(): string {
  return "/api/auth/login"
}
