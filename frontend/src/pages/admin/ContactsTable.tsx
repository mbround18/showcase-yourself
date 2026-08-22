import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  type Contact,
  type ContactStatus,
  STATUS_LABELS,
  listContacts,
} from "@/lib/contacts"

const STATUS_VARIANT: Record<ContactStatus, "default" | "secondary" | "outline"> = {
  new: "default",
  lead: "secondary",
  in_contact: "secondary",
  archived: "outline",
}

export function ContactsTable() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    listContacts(statusFilter === "all" ? undefined : statusFilter)
      .then(setContacts)
      .catch(() => setError("Failed to load contact submissions."))
      .finally(() => setLoading(false))
  }, [statusFilter])

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact submissions</h1>
          <p className="text-sm text-muted-foreground">
            Everyone who has reached out through the contact form.
          </p>
        </div>
        <select
          className="h-9 w-44 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as ContactStatus | "all")
          }
        >
          <option value="all">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!error && !loading && contacts.length === 0 && (
        <p className="text-sm text-muted-foreground">No submissions yet.</p>
      )}

      {!error && contacts.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact._id} className="cursor-pointer">
                <TableCell>
                  <Link
                    to={`/admin/contacts/${contact._id}`}
                    className="block font-medium hover:underline"
                  >
                    {contact.name}
                  </Link>
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[contact.status]}>
                    {STATUS_LABELS[contact.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(contact.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
