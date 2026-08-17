import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import showcase from "../showcase.json"

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
]

export function Header({
  page,
  setPage,
}: {
  page: string
  setPage: (page: string) => void
}) {
  const [open, setOpen] = useState(false)

  const initials = showcase.name
    .split(" ")
    .map((part) => part[0])
    .join("")

  const navigate = (id: string) => {
    setPage(id)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 3xl:h-20 3xl:max-w-[1800px] 4xl:max-w-[2200px]">
        <button
          className="flex items-center gap-3 text-left"
          onClick={() => navigate("home")}
        >
          <Avatar className="h-9 w-9 3xl:h-11 3xl:w-11">
            <AvatarImage
              src={`https://github.com/${showcase.github_username}.png`}
              alt={showcase.name}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-base font-semibold tracking-tight 3xl:text-lg">
            {showcase.name}
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.id}
              variant={page === item.id ? "secondary" : "ghost"}
              onClick={() => navigate(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <nav
        className={cn(
          "grid gap-1 overflow-hidden border-t px-4 transition-[grid-template-rows,padding] duration-200 md:hidden",
          open
            ? "grid-rows-[1fr] py-2"
            : "grid-rows-[0fr] border-t-0 py-0",
        )}
      >
        <div className="flex min-h-0 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.id}
              variant={page === item.id ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => navigate(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </nav>
    </header>
  )
}
