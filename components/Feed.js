import { outlet } from "@/lib/data"
import s from "@/styles/site.module.css"

// Each outlet row turns to "Published" in turn.
const IDS = ["cointelegraph", "benzinga", "the-block", "apnews", "business-insider"]

export default function Feed() {
  return (
    <div className={s.feed} role="img" aria-label="A press release published on Cointelegraph, Benzinga, The Block, AP News and Business Insider">
      <ul className={s.feedList}>
        {IDS.map((id, i) => {
          const o = outlet(id)
          return (
            <li key={id} style={{ "--i": i }}>
              <span className={s.feedLogo}>
                <img src={o.logo.src} width={o.logo.width} height={o.logo.height} alt="" />
              </span>
              <strong>{o.name}</strong>
              <span className={s.feedDone}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 7.5 6 10.5 11 4" />
                </svg>
                Published
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
