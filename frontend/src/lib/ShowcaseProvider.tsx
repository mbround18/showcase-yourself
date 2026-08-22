import { createContext, useContext, useEffect, useState } from "react"
import { fetchShowcase, type ShowcaseData } from "@/lib/showcase"

const ShowcaseContext = createContext<ShowcaseData | null>(null)

export function ShowcaseProvider({ children }: { children: React.ReactNode }) {
  const [showcase, setShowcase] = useState<ShowcaseData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchShowcase()
      .then(setShowcase)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
  }, [])

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6 text-center text-sm text-destructive">
        Failed to load site content: {error}
      </div>
    )
  }

  if (!showcase) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6 text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

  return (
    <ShowcaseContext.Provider value={showcase}>
      {children}
    </ShowcaseContext.Provider>
  )
}

export function useShowcase(): ShowcaseData {
  const showcase = useContext(ShowcaseContext)
  if (!showcase) {
    throw new Error("useShowcase must be used within a ShowcaseProvider (and after it has loaded)")
  }
  return showcase
}
