import cms from "./cms.json"

// Marketing content comes from the old site's CMS (lib/cms.json, from scripts/snapshot-cms.cjs).

export { cms }

// The CMS holds a few outlets twice or under awkward names.
const SAME = { cryptowisser: "crypto-wisser" }
const NAMES = {
  apnews: "AP News",
  "be-in-crypto": "BeInCrypto",
  "news-bitcoin-com": "Bitcoin.com News",
  fox8news: "Fox 8 News",
  themanillatimes: "The Manila Times",
  coinedition: "Coin Edition",
  hackernoon: "HackerNoon",
  morningstar: "Morningstar",
  "crypto-wisser": "Cryptowisser",
  thenewscrypto: "The News Crypto",
  "mpost-io": "Mpost",
  coincu: "Coincu",
  coinjournal: "CoinJournal",
  invezz: "Invezz",
}
const canon = (id) => SAME[id] || id

export const OUTLETS = cms.publishers.filter((p) => !SAME[p.id] && p.logo).map((p) => ({ ...p, name: NAMES[p.id] || p.name }))
export const outlet = (id) => OUTLETS.find((o) => o.id === canon(id))
export const money = (n) => `$${n.toLocaleString("en-US")}`

export const PLANS = cms.plans.map((p) => ({ ...p, publishers: [...new Set(p.publishers.map(canon))].filter(outlet) }))
export const plan = (id) => PLANS.find((p) => p.id === id)
export const plansWith = (id) => PLANS.filter((p) => p.publishers.includes(id)).map((p) => p.name)

export const BOOKING = "https://calendly.com/mediaxagency/30min"
export const OLD_SITE = "https://mediax.agency"

// Orders go to the same CMS as the old site. Unset, the order form says it isn't connected.
export const API = process.env.NEXT_PUBLIC_STRAPI_API_URL
