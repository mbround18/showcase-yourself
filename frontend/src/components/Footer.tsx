import { useShowcase } from "@/lib/ShowcaseProvider"

export function Footer() {
  const showcase = useShowcase()

  return (
    <footer className="border-t py-8 text-center text-sm text-muted-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-6">
        <p>
          Made with{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>{" "}
          by {showcase.name}
        </p>
        <p>&copy; {new Date().getFullYear()} {showcase.name}</p>
      </div>
    </footer>
  )
}
