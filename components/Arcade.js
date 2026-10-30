import { Mark } from "./Mark"
import { outlet } from "@/lib/data"
import s from "@/styles/site.module.css"

// Seven arches mirrored around the middle one: height, colour and timing all match in pairs.
const ARCHES = [
  ["coinmarketcap", s.aButter],
  ["benzinga", s.aCoral],
  ["cointelegraph", s.aMint],
  [null, s.aCentre],
  ["the-block", s.aMint],
  ["apnews", s.aCoral],
  ["business-insider", s.aButter],
]

export default function Arcade() {
  return (
    <div className={s.arcade} aria-label="Outlets including CoinMarketCap, Benzinga, Cointelegraph, The Block, AP News and Business Insider" role="img">
      {ARCHES.map(([id, tone], i) => (
        <div key={id || "centre"} className={`${s.arch} ${tone}`} style={{ "--step": Math.abs(i - 3) }}>
          <span className={s.archFace}>
            {id ? <img src={outlet(id).logo.src} width={outlet(id).logo.width} height={outlet(id).logo.height} alt="" /> : <Mark size={64} />}
          </span>
        </div>
      ))}
    </div>
  )
}
