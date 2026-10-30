import { useState } from "react"
import { Page, PageHead } from "@/components/Site"
import { OUTLETS, PLANS, plansWith } from "@/lib/data"
import s from "@/styles/site.module.css"

export default function Publications() {
  const [filter, setFilter] = useState("All")
  const rows = filter === "All" ? OUTLETS : OUTLETS.filter((o) => plansWith(o.id).includes(filter))

  return (
    <Page title="Publications" description="The crypto and mainstream outlets MediaX publishes to, and the packages that include them.">
      <PageHead title="Where your news runs" intro="Our featured crypto and mainstream outlets, and the packages that include them. Every package also covers hundreds more guaranteed publications." />
      <section className={s.pageBody}>
        <div className={s.filters} role="group" aria-label="Filter by package">
          {["All", ...PLANS.map((p) => p.name)].map((name) => (
            <button key={name} type="button" aria-pressed={filter === name} className={filter === name ? s.pillOn : s.pill} onClick={() => setFilter(name)}>
              {name}
            </button>
          ))}
        </div>
        <p className={s.count} role="status">
          {rows.length} featured outlets
        </p>
        <div className={s.outletGrid}>
          {rows.map((o) => (
            <div key={o.id} className={s.outletCard}>
              <div className={s.outletLogo}>
                <img src={o.logo.src} width={o.logo.width} height={o.logo.height} alt="" loading="lazy" />
              </div>
              <strong>{o.name}</strong>
            </div>
          ))}
        </div>
      </section>
    </Page>
  )
}
