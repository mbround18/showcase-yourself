import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fetchCsrfToken, loginUrl, logout } from "@/lib/auth"
import { useAuth } from "@/hooks/useAuth"
import showcase from "../showcase.json"

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/contact", label: "Contact" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const { auth, refresh } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const initials = showcase.name
    .split(" ")
    .map((part) => part[0])
    .join("")

  const handleSignOut = async () => {
    const csrfToken = await fetchCsrfToken()
    await logout(csrfToken)
    await refresh()
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 3xl:h-20 3xl:max-w-[1800px] 4xl:max-w-[2200px]">
        <Link to="/" className="flex items-center gap-3 text-left">
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
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              asChild
            >
              <Link to={item.path}>{item.label}</Link>
            </Button>
          ))}
          {auth.role === "owner" && (
            <Button
              variant={location.pathname.startsWith("/admin") ? "secondary" : "ghost"}
              asChild
            >
              <Link to="/admin">Admin</Link>
            </Button>
          )}
          {auth.authenticated ? (
            <Button variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <a href={loginUrl()}>Sign in</a>
            </Button>
          )}
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
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className="justify-start"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to={item.path}>{item.label}</Link>
            </Button>
          ))}
          {auth.role === "owner" && (
            <Button
              variant={location.pathname.startsWith("/admin") ? "secondary" : "ghost"}
              className="justify-start"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to="/admin">Admin</Link>
            </Button>
          )}
          {auth.authenticated ? (
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                setOpen(false)
                handleSignOut()
              }}
            >
              Sign out
            </Button>
          ) : (
            <Button variant="ghost" className="justify-start" asChild>
              <a href={loginUrl()}>Sign in</a>
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}
