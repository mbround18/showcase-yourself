import { useCallback, useEffect, useState } from "react"
import { fetchMe, type AuthState } from "@/lib/auth"

const INITIAL: AuthState = { authenticated: false, email: null, role: null }

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(INITIAL)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const state = await fetchMe()
    setAuth(state)
    setLoading(false)
    return state
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { auth, loading, refresh }
}
