import { useState } from "react"
import { useRouter } from "next/router"
import { cms } from "@/lib/data"
import { formsLive, sendContact, sendEmail } from "@/lib/forms"
import s from "@/styles/site.module.css"

export function FormError({ show }) {
  const { mail } = cms.footer.contact
  if (!show) return null
  return (
    <p className={s.orderError} role="alert">
      {formsLive ? "We couldn’t send that. Please try again, or email us at " : "This form isn’t connected on this preview yet. Please email us at "}
      <a href={`mailto:${mail}`}>{mail}</a>.
    </p>
  )
}

// Holds a form's values, and sends it on to the thank-you page like the old site did.
export function useForm(initial, send) {
  const router = useRouter()
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setFailed(false)
    if (!formsLive) {
      setFailed(true)
      return
    }
    setBusy(true)
    try {
      await send(form)
      router.push("/success")
    } catch {
      setFailed(true)
      setBusy(false)
    }
  }

  return { form, busy, failed, submit, set: (key) => (e) => setForm({ ...form, [key]: e.target.value }) }
}

export function ContactForm() {
  const { form, busy, failed, submit, set } = useForm({ name: "", contact: "", email: "", message: "" }, sendContact)
  return (
    <form className={s.contactForm} onSubmit={submit}>
      <div className={s.fieldPair}>
        <label className={s.field}>
          Your name
          <input value={form.name} onChange={set("name")} autoComplete="name" required />
        </label>
        <label className={s.field}>
          Email address
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" required />
        </label>
      </div>
      <label className={s.field}>
        Telegram or phone
        <input value={form.contact} onChange={set("contact")} required />
      </label>
      <label className={s.field}>
        What are you announcing?
        <textarea value={form.message} onChange={set("message")} required />
      </label>
      <button type="submit" className={s.btnLarge} disabled={busy}>
        {busy ? "Sending…" : "Send message"}
      </button>
      <FormError show={failed} />
    </form>
  )
}

export function LeadForm() {
  const { form, busy, failed, submit, set } = useForm({ sender_name: "", sender_email: "", sender_link: "", message: "" }, sendEmail)
  return (
    <form className={s.contactForm} onSubmit={submit}>
      <div className={s.fieldPair}>
        <label className={s.field}>
          Full name
          <input value={form.sender_name} onChange={set("sender_name")} autoComplete="name" required />
        </label>
        <label className={s.field}>
          Email
          <input type="email" value={form.sender_email} onChange={set("sender_email")} autoComplete="email" required />
        </label>
      </div>
      <label className={s.field}>
        Telegram or WhatsApp
        <input value={form.sender_link} onChange={set("sender_link")} required />
      </label>
      <label className={s.field}>
        Tell us about your requirements
        <textarea value={form.message} onChange={set("message")} placeholder="How can we help?" required />
      </label>
      <button type="submit" className={s.btnLarge} disabled={busy}>
        {busy ? "Sending…" : "Start your press release"}
      </button>
      <FormError show={failed} />
    </form>
  )
}
