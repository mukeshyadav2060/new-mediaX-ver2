import { useState } from "react"
import { Page, PageHead } from "@/components/Site"
import { BOOKING, cms } from "@/lib/data"
import s from "@/styles/site.module.css"

export default function Contact() {
  const { contact, social } = cms.footer
  const [form, setForm] = useState({ name: "", message: "" })
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const href = `mailto:${contact.mail}?subject=${encodeURIComponent(`Press release enquiry from ${form.name || "a new client"}`)}&body=${encodeURIComponent(form.message)}`

  return (
    <Page title="Contact" description="Talk to the MediaX crypto PR team. We reply within 24 hours.">
      <PageHead title="Let’s talk" intro="Tell us what you’re announcing and we’ll help you choose the right outlets. We get back to you within 24 hours." />
      <section className={s.contact}>
        <div className={s.contactForm}>
          <label className={s.field}>
            Your name
            <input value={form.name} onChange={set("name")} autoComplete="name" />
          </label>
          <label className={s.field}>
            What are you announcing?
            <textarea value={form.message} onChange={set("message")} />
          </label>
          <div>
            <a className={s.btnLarge} href={href} style={{ width: "100%" }}>
              Send us an email
            </a>
          </div>
        </div>
        <div className={s.contactSide}>
          <div>
            <strong>Email</strong>
            <p>
              <a href={`mailto:${contact.mail}`}>{contact.mail}</a>
            </p>
          </div>
          <div>
            <strong>Telegram</strong>
            <p>
              <a href={social.telegram} rel="noopener">
                @MediaxPR
              </a>
            </p>
          </div>
          <div>
            <strong>Prefer to talk?</strong>
            <p>
              <a href={BOOKING} rel="noopener">
                Book a 30-minute call
              </a>
            </p>
          </div>
          <div>
            <strong>Office</strong>
            <p>{contact.location}</p>
          </div>
        </div>
      </section>
    </Page>
  )
}
