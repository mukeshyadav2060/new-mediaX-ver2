import { useState } from "react"
import Link from "next/link"
import { BOOKING, PLANS, money, outlet } from "@/lib/data"
import s from "@/styles/site.module.css"

// The page's one live thing: pick a plan and see exactly which outlets it covers.
// It opens on Gold, the middle of the five, so the row starts out balanced.
export default function Plans({ start = "gold" }) {
  const [id, setId] = useState(start)
  const p = PLANS.find((x) => x.id === id)

  return (
    <div className={s.plans} data-r="2">
      <div className={s.planTabs} role="tablist" aria-label="Plans">
        {PLANS.map((x) => (
          <button key={x.id} type="button" role="tab" aria-selected={x.id === id} className={x.id === id ? s.planTabOn : s.planTab} onClick={() => setId(x.id)}>
            <span>{x.name}</span>
            <strong className="num">{money(x.price)}</strong>
          </button>
        ))}
      </div>
      <div className={s.planPanel} key={p.id}>
        <h3 className={s.planName}>{p.name} package</h3>
        <p className={`${s.planPrice} num`} data-axis="">
          {money(p.price)}
        </p>
        <p className={s.planPubs}>{p.publications}</p>
        <ul className={s.planIncludes}>
          {p.includes.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <div className={s.actions}>
          <Link href={`/submit-press-release?package=${p.id}`} className={s.btnLarge}>
            Choose {p.name}
          </Link>
          <a href={BOOKING} rel="noopener" className={s.btnLight}>
            Custom quote
          </a>
        </div>
        <p className={s.planLogosHead}>Featured outlets in {p.name}</p>
        <ul className={s.logoGrid}>
          {p.publishers.map((pid, i) => {
            const o = outlet(pid)
            return (
              <li key={pid} className={s.logoTile} style={{ animationDelay: `${i * 18}ms` }} title={o.name}>
                <img src={o.logo.src} width={o.logo.width} height={o.logo.height} alt={o.name} loading="lazy" />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
