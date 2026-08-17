import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import showcase from "../showcase.json"

export function About() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:py-16 3xl:max-w-6xl">
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 className="text-3xl font-bold tracking-tight">About</h2>
        <p className="max-w-2xl text-muted-foreground sm:text-lg">
          {showcase.profile.summary}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills &amp; Tools</CardTitle>
          <CardDescription>
            Technologies I work with regularly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {showcase.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
