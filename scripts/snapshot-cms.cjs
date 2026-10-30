// Copies the old site's public CMS content into this app, so the design shows real content
// without needing a backend yet: text to lib/cms.json, images to public/media/.
// Run from this folder: node scripts/snapshot-cms.cjs
// Reads only. When the backend is connected, replace lib/cms.json with live calls.
const fs = require("fs")
const sharp = require("sharp")

const env = fs.readFileSync("../.env", "utf8")
const API = env.match(/NEXT_PUBLIC_STRAPI_API_URL\s*=\s*"?([^"\r\n]+)/)[1]
const get = async (p) => (await (await fetch(`${API}/api${p}`, { signal: AbortSignal.timeout(30000) })).json()).data

const MEDIA = "public/media"
fs.mkdirSync(MEDIA, { recursive: true })
const slug = (s) => String(s).toLowerCase().replace(/\.(png|webp|jpe?g|svg|gif|avif)$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
const seen = new Map()

// Downloads once, shrinks, and returns the local path, or null if the image can't be read.
async function image(url, name, opts = {}) {
  if (!url) return null
  if (seen.has(url)) return seen.get(url)
  const file = `${slug(name)}.webp`
  try {
    const buf = Buffer.from(await (await fetch(url, { signal: AbortSignal.timeout(30000) })).arrayBuffer())
    let img = sharp(buf, { animated: false, density: 300 })
    img = opts.height ? img.resize({ height: opts.height, withoutEnlargement: true }) : img.resize({ width: opts.width || 900, withoutEnlargement: true })
    const out = await img.webp({ quality: opts.quality || 74 }).toFile(`${MEDIA}/${file}`)
    const result = { src: `/media/${file}`, width: out.width, height: out.height }
    seen.set(url, result)
    return result
  } catch (e) {
    console.log("skip image", name, e.message)
    seen.set(url, null)
    return null
  }
}

const one = (rel) => rel?.data?.attributes || (Array.isArray(rel?.data) ? rel.data[0]?.attributes : null)
const clean = (s) => String(s || "").replace(/‍/g, "").replace(/\s+/g, " ").trim()
const stripMd = (s) => clean(String(s || "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[#*_>`]/g, ""))

;(async () => {
  const landing = await get("/homepage?populate[landing][populate]=*&populate[trustedBy][populate]=*&populate[pricingHeader][populate]=*")
  const how = await get("/homepage?populate[oneRelationshipHeader][populate][oneRelationshipContent][populate][image]=*")
  const testi = await get("/homepage?populate[testimonial][populate][testimonial][populate][image]=*")
  const feat = await get("/homepage?populate[MarketingFeatures][populate][features][populate]=image")
  const pricing = await get("/homepage?populate[pricingPlans][populate][publishers][populate]=publisherImage&populate[pricingPlans][populate]=pricingPackageDescription")
  const footer = await get("/footer?populate=*")
  const faqs = await get("/faqs?populate=*")
  const about = await get("/about?populate=*")
  const team = await get("/team?populate=*")
  const blogs = await get("/blogs?populate=*&sort=createdAt:desc&pagination[pageSize]=6")
  const terms = await get("/terms-and-condition?populate=*")
  const privacy = await get("/privacy-policy?populate=*")

  const publishers = new Map()
  const plans = []
  for (const p of pricing.attributes.pricingPlans) {
    const ids = []
    for (const q of p.publishers) {
      const name = clean(q.publishersName) || slug(one(q.publisherImage)?.name || "outlet")
      const id = slug(name)
      if (!publishers.has(id)) {
        const logo = await image(one(q.publisherImage)?.url, `outlet-${id}`, { height: 96 })
        publishers.set(id, { id, name, logo })
      }
      if (!ids.includes(id)) ids.push(id)
    }
    plans.push({
      id: slug(p.packageName.replace(/package/i, "")),
      name: clean(p.packageName.replace(/package/i, "")),
      price: Number(String(p.price).replace(/[^0-9]/g, "")),
      publications: clean(p.description),
      includes: p.pricingPackageDescription.map((d) => clean(d.description)),
      publishers: ids,
    })
  }

  const clients = []
  for (const c of landing.attributes.trustedBy.image.data) {
    if (clients.length >= 36) break
    const a = c.attributes
    const logo = await image(a.url, `client-${clients.length}-${a.name}`, { height: 72 })
    if (!logo) continue
    // Read into memory first: on Windows sharp keeps a file open, which would block the delete below.
    const st = await sharp(fs.readFileSync(`public${logo.src}`)).flatten({ background: "#ffffff" }).stats()
    const mean = st.channels.slice(0, 3).reduce((n, c) => n + c.mean, 0) / 3
    const dev = st.channels.slice(0, 3).reduce((n, c) => n + c.stdev, 0) / 3
    if (mean > 232 && dev < 30) {
      fs.rmSync(`public${logo.src}`)
      continue
    }
    clients.push(logo)
  }

  const features = []
  for (const f of feat.attributes.MarketingFeatures.features) {
    const [tagline, ...rest] = String(f.subtitle).split("!!")
    features.push({ title: clean(f.title), tagline: clean(tagline), text: clean(rest.join(" ")), image: await image(one(f.image)?.url, `feature-${f.title}`, { width: 640 }) })
  }

  const steps = []
  for (const s of how.attributes.oneRelationshipHeader.oneRelationshipContent) {
    steps.push({ title: clean(s.title).replace(/^Step \d+:\s*/, ""), text: clean(s.description).replace("Monitor your press release performance with our advanced analytics dashboard, providing real-time insights into", "Measure your press release performance with our metric reports, giving you clear insights into"), image: await image(one(s.image)?.url, `step-${s.title}`, { width: 900 }) })
  }

  const testimonials = []
  for (const t of testi.attributes.testimonial.testimonial) {
    const [name, ...role] = clean(t.title).split(",")
    testimonials.push({ name: name.trim(), role: role.join(",").trim(), quote: clean(t.subtitle), logo: await image(one(t.image)?.url, `testimonial-${name}`, { height: 96 }) })
  }

  const blogItems = []
  for (const b of blogs) {
    const a = b.attributes
    blogItems.push({ title: clean(a.title), slug: a.slug, minutes: a.minutes_to_read || null, date: a.publishedAt?.slice(0, 10) || null, excerpt: stripMd(a.body).slice(0, 170).replace(/\s\S*$/, "") + "…", image: await image(one(a.image)?.url, `blog-${a.slug}`, { width: 800 }) })
  }

  const cms = {
    source: "Snapshot of the old site's CMS",
    landing: { title: clean(landing.attributes.landing.title), subtitle: clean(landing.attributes.landing.subtitle) },
    trusted: { title: clean(landing.attributes.trustedBy.title) },
    pricing: { title: clean(landing.attributes.pricingHeader.title), subtitle: clean(landing.attributes.pricingHeader.subtitle) },
    howTitle: clean(how.attributes.oneRelationshipHeader.title),
    steps,
    featuresTitle: clean(feat.attributes.MarketingFeatures.title),
    featuresSubtitle: clean(feat.attributes.MarketingFeatures.subtitle),
    features,
    testimonialsTitle: clean(testi.attributes.testimonial.title),
    testimonialsSubtitle: clean(testi.attributes.testimonial.subtitle),
    testimonials,
    plans,
    publishers: [...publishers.values()],
    clients,
    faqs: faqs[0].attributes.faqContents.map((f) => [clean(f.question), clean(f.answer)]),
    about: { title: clean(about.attributes.title), subtitle: clean(about.attributes.subtitle), body: about.attributes.about },
    team: { title: clean(team.attributes.title), subtitle: clean(team.attributes.subtitle), members: team.attributes.members.map((m) => ({ name: clean(m.name), role: clean(m.designation), linkedin: m.linkedin_link || null })) },
    blogs: blogItems,
    footer: { summary: stripMd(footer.attributes.summary), contact: footer.attributes.contact, social: footer.attributes.social },
    legal: { terms: terms?.attributes || null, privacy: privacy?.attributes || null },
  }
  fs.writeFileSync("lib/cms.json", JSON.stringify(cms, null, 1))
  console.log("plans", plans.map((p) => `${p.name} $${p.price} (${p.publishers.length})`).join(", "))
  console.log("publishers", cms.publishers.map((p) => p.name + (p.logo ? "" : " [no logo]")).join(", "))
  console.log("clients", clients.length, "blogs", blogItems.length, "members", cms.team.members.length)
  console.log("legal keys", Object.keys(cms.legal.terms || {}).join(","), "|", Object.keys(cms.legal.privacy || {}).join(","))
})()
