import { ExternalLink, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import showcase from "../showcase.json"

export function Home({ setPage }: { setPage: (page: string) => void }) {
  const initials = showcase.name
    .split(" ")
    .map((part) => part[0])
    .join("")

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-6 py-16 text-center sm:py-20 3xl:max-w-5xl 3xl:py-28">
      <Avatar className="h-28 w-28 border-4 border-background shadow-lg sm:h-36 sm:w-36 3xl:h-44 3xl:w-44">
        <AvatarImage
          src={`https://github.com/${showcase.github_username}.png`}
          alt={showcase.name}
        />
        <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl 3xl:text-6xl">
          {showcase.name}
        </h1>
        {showcase.profile.location && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {showcase.profile.location}
          </span>
        )}
        <Badge variant={showcase.profile.actively_looking ? "default" : "secondary"}>
          {showcase.profile.actively_looking
            ? "Open to opportunities"
            : "Not currently looking"}
        </Badge>
      </div>

      <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl 3xl:max-w-3xl">
        {showcase.profile.tag_line}
      </p>
      <p className="max-w-2xl text-balance text-base leading-relaxed text-muted-foreground 3xl:max-w-3xl">
        {showcase.profile.summary}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" onClick={() => setPage("projects")}>
          View Projects
        </Button>
        <Button size="lg" variant="outline" onClick={() => setPage("contact")}>
          Get in Touch
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {showcase.links.map((link) => (
          <Button key={link.name} variant="ghost" size="sm" asChild>
            <a href={link.url} target="_blank" rel="noreferrer">
              {link.name}
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        ))}
        {showcase.profile.blog && (
          <Button variant="ghost" size="sm" asChild>
            <a href={showcase.profile.blog} target="_blank" rel="noreferrer">
              Blog
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        )}
      </div>
    </section>
  )
}
