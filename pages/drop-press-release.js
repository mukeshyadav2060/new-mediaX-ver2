import Link from "next/link"
import { FormError, useForm } from "@/components/Forms"
import { Page, PageHead } from "@/components/Site"
import { PLANS, money } from "@/lib/data"
import { sendEmail } from "@/lib/forms"
import s from "@/styles/site.module.css"

const label = (p) => `${p.name} Package - ${money(p.price)}`

export default function DropPressRelease() {
  const { form, busy, failed, submit, set } = useForm({ sender_title: "", sender_date: "", sender_name: "", sender_email: "", selectValue: label(PLANS[0]), message: "" }, sendEmail)
  return (
    <Page title="Drop your press release" description="Drop your information to submit a press release to MediaX and get published on top crypto media outlets.">
      <PageHead title="Drop your press release" intro="Drop your information for submitting a press release and we’ll take it from there." />
      <section className={s.contact}>
        <form className={s.contactForm} onSubmit={submit}>
          <div className={s.fieldPair}>
            <label className={s.field}>
              Title
              <input value={form.sender_title} onChange={set("sender_title")} required />
            </label>
            <label className={s.field}>
              Targeted release date
              <input type="date" value={form.sender_date} onChange={set("sender_date")} required />
            </label>
            <label className={s.field}>
              Contact name
              <input value={form.sender_name} onChange={set("sender_name")} autoComplete="name" required />
            </label>
            <label className={s.field}>
              Contact email
              <input type="email" value={form.sender_email} onChange={set("sender_email")} autoComplete="email" required />
            </label>
          </div>
          <label className={s.field}>
            Package
            <select value={form.selectValue} onChange={set("selectValue")}>
              {PLANS.map((p) => (
                <option key={p.id}>{label(p)}</option>
              ))}
            </select>
          </label>
          <label className={s.field}>
            Press release
            <textarea value={form.message} onChange={set("message")} required />
            <span className={s.fieldHint}>Paste the text here, or a link to it in Google Docs.</span>
          </label>
          <p className={s.fieldHint}>
            By filling out this form, you agree to our <Link href="/terms-condition">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <button type="submit" className={s.btnLarge} disabled={busy}>
            {busy ? "Sending…" : "Send message"}
          </button>
          <FormError show={failed} />
        </form>
      </section>
    </Page>
  )
}
