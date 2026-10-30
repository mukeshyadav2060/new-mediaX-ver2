import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Page, PageHead, Slip, SlipRow, SlipTotal } from "@/components/Site"
import { PLANS, cms, money, plan as findPlan } from "@/lib/data"
import { createOrder, ordersConnected } from "@/lib/orders"
import s from "@/styles/site.module.css"

const EMPTY = { name: "", email: "", telegram: "", title: "", date: "", content: "", mediaName: "", mediaEmail: "", country: "", city: "", message: "" }

// The old form's rich-text editor sent HTML, so plain paragraphs go over in the same shape.
const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const toHtml = (text) =>
  text
    .trim()
    .split(/\n{2,}/)
    .map((p) => `<p>${escape(p).replace(/\n/g, "<br>")}</p>`)
    .join("")

export default function SubmitPressRelease() {
  const router = useRouter()
  const { mail } = cms.footer.contact
  const [form, setForm] = useState(EMPTY)
  const [planId, setPlanId] = useState(PLANS[0].id)
  const [minDate, setMinDate] = useState()
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const chosen = findPlan(planId)

  useEffect(() => {
    const asked = findPlan(String(router.query.package || "").toLowerCase())
    if (asked) setPlanId(asked.id)
  }, [router.query.package])

  useEffect(() => {
    const now = new Date()
    setMinDate(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16))
  }, [])

  async function submit(e) {
    e.preventDefault()
    setFailed(false)
    if (!ordersConnected) {
      setFailed(true)
      return
    }
    setBusy(true)
    try {
      window.location.assign(
        await createOrder({
          contact: { name: form.name, email: form.email, telegram: form.telegram },
          release: { title: form.title, date: new Date(form.date).toISOString(), content: toHtml(form.content) },
          media: { name: form.mediaName, email: form.mediaEmail, country: form.country, city: form.city },
          plan: chosen,
          message: form.message,
        })
      )
    } catch {
      setFailed(true)
      setBusy(false)
    }
  }

  return (
    <Page title="Submit your press release" description="Send MediaX your crypto press release, choose a package and go to checkout. No account needed.">
      <PageHead title="Submit your press release" intro="Send us your release, choose a package and go straight to checkout. No account needed." />
      <form className={s.order} onSubmit={submit}>
        <section className={s.contactForm}>
          <h2 className={s.orderHead}>Contact information</h2>
          <div className={s.fieldPair}>
            <label className={s.field}>
              Full name
              <input value={form.name} onChange={set("name")} autoComplete="name" required />
            </label>
            <label className={s.field}>
              Email address
              <input type="email" value={form.email} onChange={set("email")} autoComplete="email" required />
            </label>
          </div>
          <label className={s.field}>
            Telegram ID
            <input value={form.telegram} onChange={set("telegram")} required />
          </label>
        </section>

        <section className={s.contactForm}>
          <h2 className={s.orderHead}>Press release</h2>
          <div className={s.fieldPair}>
            <label className={s.field}>
              Title
              <input value={form.title} onChange={set("title")} required />
            </label>
            <label className={s.field}>
              Publishing date
              <input type="datetime-local" value={form.date} min={minDate} onChange={set("date")} required />
            </label>
          </div>
          <label className={s.field}>
            Press release content
            <textarea value={form.content} onChange={set("content")} required />
            <span className={s.fieldHint}>Paste the text here, or a link to it in Google Docs.</span>
          </label>
        </section>

        <section className={s.contactForm}>
          <h2 className={s.orderHead}>Media contact</h2>
          <div className={s.fieldPair}>
            <label className={s.field}>
              Contact person name
              <input value={form.mediaName} onChange={set("mediaName")} required />
            </label>
            <label className={s.field}>
              Business email
              <input type="email" value={form.mediaEmail} onChange={set("mediaEmail")} required />
            </label>
            <label className={s.field}>
              Country
              <input value={form.country} onChange={set("country")} autoComplete="country-name" required />
            </label>
            <label className={s.field}>
              City
              <input value={form.city} onChange={set("city")} required />
            </label>
          </div>
        </section>

        <section className={s.contactForm}>
          <h2 className={s.orderHead}>Your package</h2>
          <label className={s.field}>
            Package
            <select value={planId} onChange={(e) => setPlanId(e.target.value)}>
              {PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {money(p.price)}
                </option>
              ))}
            </select>
          </label>
          <label className={s.field}>
            Message (optional)
            <textarea value={form.message} onChange={set("message")} placeholder="How can we help you?" />
          </label>
          <label className={s.agree}>
            <input type="checkbox" required />
            <span>
              I agree to the{" "}
              <Link href="/terms/" target="_blank" rel="noopener">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy/" target="_blank" rel="noopener">
                Privacy policy
              </Link>
            </span>
          </label>
        </section>

        <Slip className={s.orderSlip}>
          <SlipRow left="Package" right={chosen.name} />
          <SlipRow left="Publications" right={chosen.publications.replace(" Guaranteed Publications", "")} />
          <SlipTotal left="Total" right={money(chosen.price)} />
          <button type="submit" className={s.btnLarge} disabled={busy}>
            {busy ? "Sending…" : "Submit and go to checkout"}
          </button>
        </Slip>

        {failed && (
          <p className={s.orderError} role="alert">
            {ordersConnected ? "We couldn’t send your order. Please try again, or email us at " : "Online orders aren’t connected on this preview yet. Please email us at "}
            <a href={`mailto:${mail}`}>{mail}</a>.
          </p>
        )}
      </form>
    </Page>
  )
}
