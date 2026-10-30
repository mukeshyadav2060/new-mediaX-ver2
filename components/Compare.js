import Link from "next/link"
import { PLANS, money, outlet } from "@/lib/data"
import s from "@/styles/site.module.css"

const INCLUDES = [...new Set(PLANS.flatMap((p) => p.includes))]

// Outlets with the same plans sit together, widest coverage first, so the ticks read as blocks.
const pattern = (id) => PLANS.map((p) => Number(p.publishers.includes(id))).join("")
const OUTLETS = [...new Set(PLANS.flatMap((p) => p.publishers))].sort((a, b) => pattern(b).localeCompare(pattern(a)))

// The label names the plan so each cell still makes sense read aloud, on phones where the columns stack.
function Mark({ plan, on }) {
  return (
    <td>
      {on ? (
        <svg className={s.compareYes} viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label={`${plan.name}: included`}>
          <path d="M3 8.5 6.5 12 13 4.5" />
        </svg>
      ) : (
        <span className={s.compareNo} role="img" aria-label={`${plan.name}: not included`}>
          –
        </span>
      )}
    </td>
  )
}

function Group({ title }) {
  return (
    <tr className={s.compareGroup}>
      <th colSpan={PLANS.length + 1} scope="rowgroup">
        {title}
      </th>
    </tr>
  )
}

function Row({ label, children }) {
  return (
    <tr>
      <th scope="row">{label}</th>
      {children}
    </tr>
  )
}

export default function Compare() {
  return (
    <div className={s.compare}>
      <table className={s.compareTable}>
        <thead>
          <tr>
            <td />
            {PLANS.map((p) => (
              <th key={p.id} scope="col">
                <span>{p.name}</span>
                <strong className="num">{money(p.price)}</strong>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <Row label="Guaranteed publications">
            {PLANS.map((p) => (
              <td key={p.id} className={`${s.compareFigure} num`}>
                {p.publications.replace(" Guaranteed Publications", "")}
              </td>
            ))}
          </Row>
          <Row label="Featured outlets">
            {PLANS.map((p) => (
              <td key={p.id} className={`${s.compareFigure} num`}>
                {p.publishers.length}
              </td>
            ))}
          </Row>
          <Group title="What’s included" />
          {INCLUDES.map((line) => (
            <Row key={line} label={line}>
              {PLANS.map((p) => (
                <Mark key={p.id} plan={p} on={p.includes.includes(line)} />
              ))}
            </Row>
          ))}
          <Group title="Featured outlets" />
          {OUTLETS.map((id) => (
            <Row key={id} label={outlet(id).name}>
              {PLANS.map((p) => (
                <Mark key={p.id} plan={p} on={p.publishers.includes(id)} />
              ))}
            </Row>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td />
            {PLANS.map((p) => (
              <td key={p.id}>
                <Link href={`/submit-press-release?package=${p.id}`} className={s.btnLarge} aria-label={`Choose ${p.name}`}>
                  Choose
                </Link>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
