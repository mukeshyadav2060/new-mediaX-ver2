import { API } from "./data"

// Every form stays off until the CMS address is set, so a local preview can't send anything real.
export const formsLive = Boolean(API)

// The old site's EmailJS account, used by its lead forms.
const EMAILJS = { service_id: "Mediax", template_id: "template_dlbhr4l", user_id: "YUikTYa0ag61Er5Gj" }

export async function sendEmail(template_params) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...EMAILJS, template_params }),
  })
  if (!res.ok) throw new Error("The message was not sent")
}

export async function sendContact(data) {
  const res = await fetch(`${API}/api/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  })
  if (!res.ok || !(await res.json()).data) throw new Error("The message was not sent")
}

// True or false from the CMS. Anything else throws, because "couldn't check" must never read as "not official".
export async function verifyTeamMember(term) {
  const res = await fetch(`${API}/api/team/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: term }),
  })
  if (res.ok) return true
  if (res.status >= 400 && res.status < 500 && res.status !== 429) return false
  throw new Error("The check did not finish")
}
