import { useState } from "react"
import { Page, PageHead } from "@/components/Site"
import s from "@/styles/site.module.css"

// The old site's NOWPayments invoices. Each link charges the amount shown, set on NOWPayments.
const LINKS = [
  ["Offer Package - $799", "https://nowpayments.io/payment/?iid=5392483841"],
  ["Starter - $1,800", "https://nowpayments.io/payment/?iid=5216767744"],
  ["Growth - $2,990", "https://nowpayments.io/payment/?iid=4778206650"],
  ["Pro - $5,690", "https://nowpayments.io/payment/?iid=5907659761"],
  ["Scale - $7,490", "https://nowpayments.io/payment/?iid=6058728396"],
  ["Premium - $13,600", "https://nowpayments.io/payment/?iid=6408490144"],
]

export default function Payment() {
  const [chosen, setChosen] = useState("")
  const link = LINKS.find(([name]) => name === chosen)?.[1]
  return (
    <Page title="Pay for your package" description="Select your MediaX package and pay securely with crypto through NOWPayments.">
      <PageHead title="Select your package" intro="Choose your package, then pay with crypto." />
      <section className={s.contact}>
        <div className={s.contactForm}>
          <label className={s.field}>
            Package
            <select value={chosen} onChange={(e) => setChosen(e.target.value)}>
              <option value="" disabled>
                Select package
              </option>
              {LINKS.map(([name]) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          {link && (
            <a href={link} target="_blank" rel="noreferrer noopener" className={s.btnLarge}>
              Pay with crypto
            </a>
          )}
          {link && <p className={s.fieldHint}>Secure checkout powered by NOWPayments.</p>}
        </div>
      </section>
    </Page>
  )
}
