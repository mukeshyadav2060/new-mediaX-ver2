import { API } from "./data"

export const ordersConnected = Boolean(API)

// Same request the old site's order form sent. Prices go in cents, as strings.
export async function createOrder({ contact, release, media, plan, message }) {
  const res = await fetch(`${API}/api/orders/custom-create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: release.title,
      publishingDate: release.date,
      pressReleaseContent: release.content,
      packageName: `${plan.name} Package`,
      packagePrice: String(plan.price * 100),
      packageDescription: plan.publications,
      message,
      dateAndTime: release.date,
      userContact: { fullName: contact.name, email: contact.email, contactNumber: contact.telegram },
      mediaContact: { contactPersonName: media.name, businessEmail: media.email, country: media.country, city: media.city },
    }),
  })
  const data = await res.json()
  if (!res.ok || !/^https?:\/\//.test(data?.checkoutUrl || "")) throw new Error("The order was not created")
  return data.checkoutUrl
}

export async function fetchOrder(id) {
  const res = await fetch(`${API}/api/orders/${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error("Order not found")
  return (await res.json()).data
}
