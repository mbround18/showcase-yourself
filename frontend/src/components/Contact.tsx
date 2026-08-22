import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { fetchCsrfToken, fetchMe } from "@/lib/auth"

export function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [csrfToken, setCsrfToken] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCsrfToken().then(setCsrfToken)
    fetchMe().then((auth) => {
      if (auth.email) setEmail(auth.email)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (honeypot) {
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ name, email, message }),
      })
      if (response.ok) {
        alert("Message sent successfully!")
        setName("")
        setEmail("")
        setMessage("")
      } else {
        alert("Failed to send message.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl justify-center px-6 py-12 sm:py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Contact Me</CardTitle>
          <CardDescription>
            Have a question or want to work together? Send me a message.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input type="hidden" name="csrf-token" value={csrfToken} />
            <div className="hidden">
              <Label htmlFor="honeypot">Leave this field blank</Label>
              <Input
                type="text"
                id="honeypot"
                value={honeypot}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setHoneypot(e.target.value)
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Your Name"
                value={name}
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Your Email"
                value={email}
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="message">Your message</Label>
              <Textarea
                placeholder="Type your message here."
                id="message"
                rows={5}
                value={message}
                required
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMessage(e.target.value)
                }
              />
            </div>
            <Button type="submit" disabled={submitting} className="mt-2">
              {submitting ? "Sending..." : "Send"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
