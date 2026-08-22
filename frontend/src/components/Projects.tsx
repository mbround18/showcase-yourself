import { ExternalLink, GitFork, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useShowcase } from "@/lib/ShowcaseProvider"
import type { Experience, Repository } from "@/lib/showcase"

function RepoCard({ repo }: { repo: Repository }) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:underline"
          >
            {repo.name}
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </a>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {repo.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          {repo.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-4 w-4" />
          {repo.forks}
        </span>
      </CardContent>
      <CardFooter>
        <Badge variant="outline">{repo.language}</Badge>
      </CardFooter>
    </Card>
  )
}

function RepoGrid({ repos }: { repos: Repository[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5">
      {repos.map((repo) => (
        <RepoCard key={repo.name} repo={repo} />
      ))}
    </div>
  )
}

function ExperienceCard({ entry }: { entry: Experience }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-baseline justify-between gap-2">
          <span>
            {entry.title} · {entry.company}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {entry.start_date} — {entry.end_date ?? "Present"}
          </span>
        </CardTitle>
        {entry.location && (
          <CardDescription>{entry.location}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          {entry.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function Projects() {
  const showcase = useShowcase()
  const pinned = showcase.pinned_repositories ?? []
  const top = showcase.top_repositories ?? []
  const experience = showcase.experience ?? []

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 sm:py-16 3xl:max-w-[1800px] 4xl:max-w-[2200px]">
      {pinned.length > 0 && (
        <>
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Pinned Repositories</h2>
            <p className="text-muted-foreground">
              A few projects I've pinned on GitHub.
            </p>
          </div>
          <RepoGrid repos={pinned} />
        </>
      )}

      {top.length > 0 && (
        <>
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Top Repositories</h2>
            <p className="text-muted-foreground">
              Ranked by stars across my GitHub profile.
            </p>
          </div>
          <RepoGrid repos={top} />
        </>
      )}

      {experience.length > 0 && (
        <>
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
            <p className="text-muted-foreground">Where I've worked.</p>
          </div>
          <div className="flex flex-col gap-4">
            {experience.map((entry) => (
              <ExperienceCard key={`${entry.company}-${entry.title}`} entry={entry} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
