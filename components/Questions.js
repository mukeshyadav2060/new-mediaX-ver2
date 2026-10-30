import s from "@/styles/site.module.css"

// Native <details>, so the answers open without any script.
export default function Questions({ items }) {
  return (
    <div className={s.questions} data-r="2">
      {items.map(([q, a], i) => (
        <details key={q} className={s.question} open={i === 0}>
          <summary>
            <i aria-hidden="true" />
            <span>{q}</span>
            <i aria-hidden="true" />
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  )
}
