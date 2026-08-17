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
import showcase from "../showcase.json"

type Repo = {
  name: string
  description: string
  url: string
  stars: number
  forks: number
  language: string
}

function RepoCard({ repo }: { repo: Repo }) {
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

function RepoGrid({ repos }: { repos: Repo[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5">
      {repos.map((repo) => (
        <RepoCard key={repo.name} repo={repo} />
      ))}
    </div>
  )
}

export function Projects() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 sm:py-16 3xl:max-w-[1800px] 4xl:max-w-[2200px]">
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Pinned Repositories</h2>
        <p className="text-muted-foreground">
          A few projects I've pinned on GitHub.
        </p>
      </div>
      <RepoGrid repos={showcase.pinned_repositories} />

      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Top Repositories</h2>
        <p className="text-muted-foreground">
          Ranked by stars across my GitHub profile.
        </p>
      </div>
      <RepoGrid repos={showcase.top_repositories} />
    </section>
  )
}
