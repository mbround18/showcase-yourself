import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { loginUrl } from "@/lib/auth"

export function Login() {
  return (
    <section className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Sign in to pre-fill your contact details, or as the site owner to
            manage submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <a href={loginUrl()}>Continue</a>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
