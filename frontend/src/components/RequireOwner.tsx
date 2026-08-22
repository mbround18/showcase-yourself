import { useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export function RequireOwner({ children }: { children: React.ReactNode }) {
  const { auth, loading, refresh } = useAuth()
  const location = useLocation()

  // Re-verify against the backend on every route entry, not just on mount --
  // the backend is the source of truth for access, never cached client state.
  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-sm text-muted-foreground">
        Checking access…
      </div>
    )
  }

  if (auth.role !== "owner") {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
