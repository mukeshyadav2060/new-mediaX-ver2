import { useState } from "react"
import Link from "next/link"
import { Page, PageHead } from "@/components/Site"
import { cms } from "@/lib/data"
import { formsLive, verifyTeamMember } from "@/lib/forms"
import s from "@/styles/site.module.css"

export default function VerifyTeam() {
  const { mail } = cms.footer.contact
  const [term, setTerm] = useState("")
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  async function check(e) {
    e.preventDefault()
    const searched = term.trim()
    if (!formsLive) {
      setResult({ state: "error", searched })
      return
    }
    setBusy(true)
    try {
      setResult({ state: (await verifyTeamMember(searched)) ? "yes" : "no", searched })
    } catch {
      setResult({ state: "error", searched })
    }
    setBusy(false)
  }

  return (
    <Page title="Verify team members" description="Verify an official MediaX team member before sharing information or making a payment, and contact us if you need confirmation.">
      <PageHead title="Verify team" intro="Please use MediaX Verify to check whether a source officially represents MediaX: an email address, WhatsApp number or Telegram ID." />
      <section className={s.contact}>
        <form className={s.contactForm} onSubmit={check}>
          <label className={s.field}>
            ID, email or number
            <input value={term} onChange={(e) => setTerm(e.target.value)} required />
          </label>
          <button type="submit" className={s.btnLarge} disabled={busy}>
            {busy ? "Checking…" : "Verify"}
          </button>
          {result?.state === "yes" && (
            <p className={s.verifyYes} role="status">
              <strong>Verified official source.</strong> {result.searched} is a verified MediaX official source.
            </p>
          )}
          {result?.state === "no" && (
            <p className={s.orderError} role="alert">
              <strong>Unverified source.</strong> {result.searched} is NOT a verified MediaX official source.
            </p>
          )}
          {result?.state === "error" && (
            <p className={s.orderError} role="alert">
              We couldn’t check that right now, so please don’t treat this as confirmed. Email us at <a href={`mailto:${mail}`}>{mail}</a> to confirm.
            </p>
          )}
        </form>
        <p className={s.lead}>
          Please do not contact any unofficial or unverified sources, or reveal your order details to them. For further queries, please <Link href="/contact">contact support</Link>.
        </p>
      </section>
    </Page>
  )
}
