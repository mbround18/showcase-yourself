export type ContactStatus = "new" | "lead" | "in_contact" | "archived"

export interface Contact {
  _id: string
  name: string
  email: string
  message: string
  status: ContactStatus
  submitted_by?: string
  created_at: string
  updated_at: string
}

export const STATUS_LABELS: Record<ContactStatus, string> = {
  new: "New",
  lead: "Lead",
  in_contact: "In Contact",
  archived: "Archived",
}

export async function listContacts(status?: ContactStatus): Promise<Contact[]> {
  const query = status ? `?status=${status}` : ""
  const response = await fetch(`/api/admin/contacts${query}`, {
    credentials: "include",
  })
  if (!response.ok) throw new Error("Failed to load contacts")
  return response.json()
}

export async function getContact(id: string): Promise<Contact> {
  const response = await fetch(`/api/admin/contacts/${id}`, {
    credentials: "include",
  })
  if (!response.ok) throw new Error("Failed to load contact")
  return response.json()
}

export async function updateContactStatus(
  id: string,
  status: ContactStatus,
  csrfToken: string,
): Promise<void> {
  const response = await fetch(`/api/admin/contacts/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) throw new Error("Failed to update contact")
}

export async function deleteContact(id: string, csrfToken: string): Promise<void> {
  const response = await fetch(`/api/admin/contacts/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "X-CSRF-Token": csrfToken },
  })
  if (!response.ok) throw new Error("Failed to delete contact")
}
