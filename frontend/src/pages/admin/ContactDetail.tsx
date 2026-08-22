import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { fetchCsrfToken } from "@/lib/auth"
import {
  type Contact,
  type ContactStatus,
  STATUS_LABELS,
  deleteContact,
  getContact,
  updateContactStatus,
} from "@/lib/contacts"

const STATUS_ACTIONS: { status: ContactStatus; label: string }[] = [
  { status: "lead", label: "Mark as Lead" },
  { status: "in_contact", label: "Mark In Contact" },
  { status: "archived", label: "Archive" },
]

export function ContactDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [contact, setContact] = useState<Contact | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const load = () => {
    if (!id) return
    getContact(id)
      .then(setContact)
      .catch(() => setError("Failed to load this submission."))
  }

  useEffect(load, [id])

  const applyStatus = async (status: ContactStatus) => {
    if (!id) return
    setBusy(true)
    try {
      const csrfToken = await fetchCsrfToken()
      await updateContactStatus(id, status, csrfToken)
      load()
    } catch {
      setError("Failed to update status.")
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!id) return
    if (!window.confirm("Permanently delete this submission? This cannot be undone.")) {
      return
    }
    setBusy(true)
    try {
      const csrfToken = await fetchCsrfToken()
      await deleteContact(id, csrfToken)
      navigate("/admin")
    } catch {
      setError("Failed to delete this submission.")
      setBusy(false)
    }
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-2xl px-6 py-12">
        <p className="text-sm text-destructive">{error}</p>
        <Link to="/admin" className="text-sm underline">
          Back to submissions
        </Link>
      </section>
    )
  }

  if (!contact) {
    return (
      <section className="mx-auto w-full max-w-2xl px-6 py-12 text-sm text-muted-foreground">
        Loading…
      </section>
    )
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-12">
      <Link to="/admin" className="text-sm text-muted-foreground hover:underline">
        ← Back to submissions
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{contact.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{contact.email}</p>
          </div>
          <Badge>{STATUS_LABELS[contact.status]}</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {contact.message}
          </p>
          <p className="text-xs text-muted-foreground">
            Submitted {new Date(contact.created_at).toLocaleString()}
          </p>

          <div className="flex flex-wrap gap-2">
            {STATUS_ACTIONS.filter((action) => action.status !== contact.status).map(
              (action) => (
                <Button
                  key={action.status}
                  variant="secondary"
                  size="sm"
                  disabled={busy}
                  onClick={() => applyStatus(action.status)}
                >
                  {action.label}
                </Button>
              ),
            )}
            <Button
              variant="destructive"
              size="sm"
              disabled={busy}
              onClick={remove}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
