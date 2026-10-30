// Copies every article and detail page from the old site's CMS into content/*.json, with their
// images in public/media/c/, and writes the redirects, sitemap and robots.txt that go with them.
// Run from this folder, after snapshot-cms.cjs: node scripts/snapshot-content.cjs
// Reads only. Run it again and rebuild to publish new CMS content.
const crypto = require("crypto")
const fs = require("fs")
const { marked } = require("marked")
const sanitizeHtml = require("sanitize-html")
const sharp = require("sharp")

const env = fs.readFileSync("../.env", "utf8")
const API = env.match(/NEXT_PUBLIC_STRAPI_API_URL\s*=\s*"?([^"\r\n]+)/)[1]
const SITE = "https://mediax.agency"
const MEDIA = "public/media/c"
fs.mkdirSync(MEDIA, { recursive: true })
fs.mkdirSync("content", { recursive: true })

const get = async (p) => {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`${API}/api${p}`, { signal: AbortSignal.timeout(60000) })
      if (!res.ok) throw new Error(`${res.status} ${p}`)
      return await res.json()
    } catch (e) {
      if (attempt === 3) throw e
    }
  }
}
const single = async (p) => (await get(p)).data?.attributes

async function all(endpoint, populate = "populate=*") {
  const out = []
  for (let page = 1; ; page++) {
    const { data, meta } = await get(`/${endpoint}?${populate}&pagination[page]=${page}&pagination[pageSize]=100`)
    out.push(...data)
    if (page >= meta.pagination.pageCount) return out
  }
}

async function pool(items, size, work) {
  let next = 0
  await Promise.all(Array.from({ length: size }, async () => {
    while (next < items.length) await work(items[next++])
  }))
}

const clean = (s) => String(s || "").replace(/[​-‍﻿]/g, "").trim()
const oneLine = (s) => clean(s).replace(/\s+/g, " ")
const one = (rel) => rel?.data?.attributes || (Array.isArray(rel?.data) ? rel.data[0]?.attributes : null)
const words = (text, max) => {
  const str = oneLine(text)
  if (str.length <= max) return str
  const cut = str.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(" ")).trim() + "…"
}
const plain = (md) => clean(md)
  .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
  .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
  .replace(/<[^>]+>/g, " ")
  .replace(/[#>*_`~|]/g, "")

// Images: one file per source URL and width, so a second run downloads only what is new.
const stats = { images: 0, failed: [] }
const seen = new Map()
function image(url, width = 1100) {
  if (!url) return Promise.resolve(null)
  const key = `${width}:${url}`
  if (!seen.has(key)) seen.set(key, load(url, width))
  return seen.get(key)
}
async function load(url, width) {
  const file = `${MEDIA}/${crypto.createHash("md5").update(url).digest("hex").slice(0, 12)}-${width}.webp`
  try {
    if (!fs.existsSync(file)) {
      let buf
      for (let attempt = 1; ; attempt++) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(60000) })
          if (!res.ok) throw new Error(String(res.status))
          buf = Buffer.from(await res.arrayBuffer())
          break
        } catch (e) {
          if (attempt === 3) throw e
        }
      }
      await sharp(buf, { animated: false, density: 200 }).resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(file)
    }
    const meta = await sharp(fs.readFileSync(file)).metadata()
    stats.images++
    return { src: `/${file.replace("public/", "")}`, width: meta.width, height: meta.height }
  } catch (e) {
    stats.failed.push(`${url} (${e.message})`)
    return null
  }
}

// The old site's permanent redirects, from its own config.
const redirects = new Map()
{
  const config = fs.readFileSync("../next.config.js", "utf8")
  for (const m of config.matchAll(/source:\s*"([^"]+)",\s*destination:\s*"([^"]+)"/g)) {
    if (m[1].includes(":path")) continue
    redirects.set(decodeURIComponent(m[1].replace(/\\:/g, ":")), m[2])
  }
  const legacy = fs.readFileSync("../lib/legacyRedirects.js", "utf8")
  for (const m of legacy.matchAll(/^\s*"(\/[^"]+)":\s*"(\/[^"]+)",?\s*$/gm)) redirects.set(m[1], m[2])
}
const follow = (path) => {
  let at = path
  for (let i = 0; i < 8 && redirects.has(at); i++) at = redirects.get(at)
  return at
}

// A slug the old site served directly can hold characters a static file can't, such as ":".
const safeSlug = (s) => String(s).toLowerCase().replace(/[^a-z0-9._~-]+/g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "")

// Where each item lives, and what must redirect to it. Items the old site redirected to a different page stay gone.
function place(base, items) {
  const used = new Map()
  const kept = []
  for (const item of items) {
    const a = item.attributes
    const own = `/${base}/${a.slug}`
    const wanted = a.customSlug ? `/${base}/${a.customSlug}` : own
    const target = follow(own)
    const hidden = redirects.has(own) && !a.customSlug && !target.endsWith(`/${safeSlug(a.slug)}`) && items.some((o) => o !== item && (`/${base}/${o.attributes.customSlug || o.attributes.slug}` === target))
    if (hidden) continue
    const end = redirects.has(own) ? target : wanted
    const slug = safeSlug(end.split("/").pop())
    if (used.has(slug)) {
      console.log(`duplicate address /${base}/${slug}: "${a.title}" and "${used.get(slug)}". Keeping the newer one.`)
      if (own !== `/${base}/${slug}`) redirects.set(own, `/${base}/${slug}`)
      continue
    }
    used.set(slug, a.title)
    const url = `/${base}/${slug}`
    if (own !== url) redirects.set(own, url)
    if (a.customSlug && wanted !== url) redirects.set(wanted, url)
    kept.push({ ...item, url, slug })
  }
  return kept
}

// Body headings start at h2 without skipping a level, because the page owns the h1.
function renumber(tokens) {
  const stack = []
  const walk = (list) => {
    for (const t of list) {
      if (t.type === "heading") {
        while (stack.length && stack.at(-1).from >= t.depth) stack.pop()
        const depth = stack.length ? Math.min(6, stack.at(-1).to + 1) : 2
        stack.push({ from: t.depth, to: depth })
        t.depth = depth
      }
      if (t.tokens) walk(t.tokens)
    }
  }
  walk(tokens)
}
const dropped = { iframes: 0 }
const SAFE = {
  allowedTags: ["h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "a", "strong", "b", "em", "i", "u", "s", "del", "ul", "ol", "li", "blockquote", "code", "pre", "table", "thead", "tbody", "tr", "th", "td", "img", "figure", "figcaption", "iframe", "span", "div", "sub", "sup"],
  allowedAttributes: { a: ["href", "rel", "target"], img: ["src", "alt", "title"], iframe: ["src", "title", "allowfullscreen"], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedIframeHostnames: ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
  transformTags: {
    h1: "h2",
    a: (tag, attribs) => {
      let href = (attribs.href || "").trim()
      const local = href.match(/^https?:\/\/(?:www\.)?mediax\.agency(\/[^#?]*)?([#?].*)?$/i)
      if (local) href = `${(local[1] || "/").replace(/(.)\/$/, "$1")}${local[2] || ""}`
      if (href.startsWith("/")) {
        const [path, rest = ""] = href.split(/(?=[#?])/)
        let decoded = path
        try { decoded = decodeURIComponent(path) } catch {}
        return { tagName: tag, attribs: { href: `${follow(decoded)}${rest}` } }
      }
      return { tagName: tag, attribs: { href, ...(/^https?:/i.test(href) ? { target: "_blank", rel: "noopener" } : {}) } }
    },
  },
}
function sanitize(html) {
  return sanitizeHtml(clean(html), SAFE)
}
async function localImages(html) {
  const urls = [...new Set([...html.matchAll(/<img[^>]*\ssrc="(https?:[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")))]
  const found = new Map(await Promise.all(urls.map(async (u) => [u, await image(u, 1000)])))
  // The old site's EmailOff wrapper did this too: it stops Cloudflare rewriting addresses in article text.
  return `<!--email_off-->${html.replace(/<img([^>]*)\ssrc="(https?:[^"]+)"([^>]*)>/g, (all, before, src, after) => {
    const got = found.get(src.replace(/&amp;/g, "&"))
    return got ? `<img${before} src="${got.src}" width="${got.width}" height="${got.height}" loading="lazy"${after}>` : `<img${before} src="${src}" loading="lazy"${after}>`
  })}<!--/email_off-->`
}
const fromMarkdown = (md) => {
  const tokens = marked.lexer(clean(md), { gfm: true })
  renumber(tokens)
  return localImages(sanitize(marked.parser(tokens)))
}
const fromHtml = (html) => localImages(sanitize(html))

const seoOf = (a, fallbackText) => ({
  title: oneLine(a.seo?.title) || `${oneLine(a.title)} | MediaX Agency`,
  description: words(a.seo?.metaDescription || plain(fallbackText), 155),
})

;(async () => {
  console.log("fetching collections")
  const [rawBlogs, rawNews, rawPr, rawMk, rawSc, rawProjects, rawLinks] = await Promise.all([
    all("blogs"),
    all("news-rooms"),
    all("pr-services"),
    all("marketing-services"),
    all("sectors"),
    all("projects", "populate[0]=logo&populate[1]=coverImage&populate[2]=Study&populate[3]=seo"),
    all("useful-links", "populate[banner_image]=*&populate[content][populate]=*&populate[faq]=*&populate[seo]=*"),
  ])
  const newest = (list) => [...list].sort((a, b) => b.id - a.id)

  async function articles(base, raw, file) {
    const placed = place(base, newest(raw))
    const out = []
    await pool(placed, 12, async (item) => {
      const a = item.attributes
      const cover = one(a.image)
      out.push({
        id: item.id,
        slug: item.slug,
        title: oneLine(a.title),
        h1: oneLine(a.h1) || null,
        minutes: a.minutes_to_read || null,
        date: (a.createdAt || "").slice(0, 10),
        updated: (a.updatedAt || "").slice(0, 10),
        views: a.views || 0,
        featured: !!a.is_featured,
        excerpt: words(plain(a.body), 150),
        image: await image(cover?.url, 1100),
        thumb: await image(cover?.url, 640),
        alt: oneLine(cover?.alternativeText) || oneLine(a.title),
        seo: seoOf(a, a.body),
        html: await fromMarkdown(a.body),
      })
    })
    out.sort((x, y) => y.id - x.id)
    fs.writeFileSync(`content/${file}.json`, JSON.stringify(out))
    console.log(`${file}: ${raw.length} in the CMS, ${out.length} pages`)
    return out
  }

  async function services(base, raw, file, imageField) {
    const out = []
    await pool(place(base, raw), 6, async (item) => {
      const a = item.attributes
      out.push({
        slug: item.slug,
        title: oneLine(a.title),
        h1: oneLine(a.h1) || null,
        name: oneLine(a.pageName) || oneLine(a.title),
        updated: (a.updatedAt || "").slice(0, 10),
        image: await image(one(a[imageField])?.url, 1100),
        seo: seoOf(a, a.content),
        html: await fromMarkdown(a.content),
      })
    })
    out.sort((x, y) => x.name.localeCompare(y.name))
    fs.writeFileSync(`content/${file}.json`, JSON.stringify(out))
    console.log(`${file}: ${out.length} pages`)
    return out
  }

  const blogs = await articles("blogs", rawBlogs, "blogs")
  const news = await articles("newsroom", rawNews, "newsroom")
  const pr = await services("pr", rawPr, "pr", "bannerImage")
  const mk = await services("mk", rawMk, "mk", "image")
  const sc = await services("sc", rawSc, "sc", "image")

  const projects = []
  for (const item of rawProjects) {
    const a = item.attributes
    projects.push({
      slug: safeSlug(a.customSlug || a.slug),
      title: oneLine(a.title),
      h1: oneLine(a.h1) || null,
      industry: Array.isArray(a.Industry) ? a.Industry.join(", ") : oneLine(a.Industry),
      location: oneLine(a.location),
      link: a.link || null,
      excerpt: words(plain(a.subtitle), 150),
      logo: await image(one(a.logo)?.url, 320),
      cover: await image(one(a.coverImage)?.url, 1100),
      thumb: await image(one(a.coverImage)?.url, 640),
      intro: await fromMarkdown(a.subtitle),
      info: await fromHtml(a.Info),
      study: await Promise.all((a.Study || []).map(async (s) => ({ title: oneLine(s.title), html: await fromHtml(s.subtitle) }))),
      updated: (a.updatedAt || "").slice(0, 10),
      seo: seoOf(a, a.subtitle),
    })
  }
  fs.writeFileSync("content/case-studies.json", JSON.stringify(projects))

  const links = []
  for (const item of rawLinks) {
    const a = item.attributes
    links.push({
      slug: safeSlug(a.slug),
      title: oneLine(a.banner_title).replace(/[*_]/g, ""),
      intro: await fromMarkdown(a.banner_subtitle),
      button: oneLine(a.banner_button_text),
      image: await image(one(a.banner_image)?.url, 1100),
      blocks: await Promise.all((a.content || []).map(async (c) => ({
        title: oneLine(c.content_title),
        html: await fromMarkdown(`${c.content_subtitle || ""}\n\n${c.content_list || ""}`),
        image: await image(one(c.content_image)?.url, 1000),
      }))),
      faqTitle: oneLine(a.faq_title),
      faqs: (a.faq || []).map((f) => [oneLine(f.question), oneLine(f.answer)]),
      ctaTitle: oneLine(a.cta_title),
      ctaText: oneLine(a.cta_subtitle),
      ctaButton: oneLine(a.cta_button_text),
      updated: (a.updatedAt || "").slice(0, 10),
      seo: { title: oneLine(a.seo?.title) || oneLine(a.page_title), description: words(a.seo?.metaDescription || a.banner_subtitle, 155) },
    })
  }
  fs.writeFileSync("content/useful-links.json", JSON.stringify(links))

  const [servicesPage, newsPage, blogPage, casePage, reach, team] = await Promise.all([
    single("/services-page?populate[seo]=*&populate[service][populate]=*"),
    single("/news-room-page?populate=*"),
    single("/blog-page?populate=*"),
    single("/case-study?populate=*"),
    single("/reach-out?populate[banner][populate]=*&populate[services]=*&populate[why_us]=*&populate[services_image]=*&populate[why_us_image]=*&populate[seo]=*"),
    single("/team?populate[members][populate]=*"),
  ])
  const head = (a) => ({ title: oneLine(a.title), subtitle: oneLine(a.subtitle), seo: seoOf(a, a.subtitle) })
  const pages = {
    services: {
      ...head(servicesPage),
      items: await Promise.all(servicesPage.service.map(async (x) => ({ title: oneLine(x.title), text: oneLine(x.subtitle), image: await image(one(x.image)?.url, 640) }))),
    },
    newsroom: head(newsPage),
    blogs: head(blogPage),
    caseStudies: head(casePage),
    reachOut: {
      title: oneLine(reach.banner?.title),
      subtitle: oneLine(reach.banner?.subtitle),
      servicesTitle: oneLine(reach.servicesTitle),
      services: (reach.services || []).map((x) => oneLine(x.feature)),
      whyTitle: oneLine(reach.why_us_title),
      whySubtitle: oneLine(reach.why_us_subtitle),
      why: (reach.why_us || []).map((x) => oneLine(x.feature)),
      bookTitle: oneLine(reach.Book_CTA_title),
      bookText: oneLine(reach.Book_CTA_subtitle),
    },
    team: await Promise.all(team.members.map(async (m) => ({ name: oneLine(m.name), role: oneLine(m.designation), linkedin: m.linkedin_link || null, image: await image(one(m.image)?.url, 480) }))),
  }
  fs.writeFileSync("content/pages.json", JSON.stringify(pages))

  // The small part every page needs: footer links, and the latest posts for the home page.
  const cms = JSON.parse(fs.readFileSync("lib/cms.json", "utf8"))
  const link = ({ slug, name }) => ({ slug, name })
  cms.footerLinks = { pr: pr.map(link), mk: mk.map(link), sc: sc.map(link) }
  cms.blogs = blogs.slice(0, 3).map((b) => ({ slug: b.slug, title: b.title, image: b.thumb }))
  fs.writeFileSync("lib/cms.json", JSON.stringify(cms, null, 1))

  // Redirects: only the ones this site still needs, each going straight to its final page.
  const pages404 = new Set()
  const flat = [...redirects.keys()].sort().flatMap((from) => {
    const to = follow(from)
    if (to === from) return []
    const external = /^https?:/.test(to)
    if (!external && !/^\/(about|pr|mk|sc|blogs|newsroom|useful-links|case-study)(\/|$)/.test(to)) pages404.add(to)
    return [{ from, to }]
  })
  const known = new Set([
    "/about",
    ...blogs.map((x) => `/blogs/${x.slug}`),
    ...news.map((x) => `/newsroom/${x.slug}`),
    ...pr.map((x) => `/pr/${x.slug}`),
    ...mk.map((x) => `/mk/${x.slug}`),
    ...sc.map((x) => `/sc/${x.slug}`),
    ...projects.map((x) => `/case-study/${x.slug}`),
    ...links.map((x) => `/useful-links/${x.slug}`),
  ])
  const nowhere = flat.filter((r) => !/^https?:/.test(r.to) && !known.has(r.to))
  const useful = flat.filter((r) => !known.has(r.from) && !nowhere.includes(r))
  fs.writeFileSync("redirects.json", JSON.stringify(useful, null, 1))
  const encode = (p) => p.split("/").map((part) => encodeURIComponent(part).replace(/%3A/g, ":")).join("/")
  fs.writeFileSync("public/_redirects", [
    "# Netlify and Cloudflare Pages format. redirects.json holds the same list for any other host.",
    "/order/* /order 200",
    ...useful.map((r) => `${encode(r.from)} ${r.to} 301`),
    "",
  ].join("\n"))

  const today = new Date().toISOString().slice(0, 10)
  const TOP = ["", "/about", "/best-crypto-pr-agency", "/blogs", "/case-study", "/contact", "/crypto-press-release", "/drop-press-release", "/faq", "/industry", "/newsroom", "/payment", "/pricing", "/privacy", "/publications", "/services", "/submit-press-release", "/team", "/terms-condition", "/verify-team"]
  const entries = [
    ...TOP.map((p) => [p, today]),
    ...blogs.map((x) => [`/blogs/${x.slug}`, x.updated]),
    ...news.map((x) => [`/newsroom/${x.slug}`, x.updated]),
    ...pr.map((x) => [`/pr/${x.slug}`, x.updated]),
    ...mk.map((x) => [`/mk/${x.slug}`, x.updated]),
    ...sc.map((x) => [`/sc/${x.slug}`, x.updated]),
    ...projects.map((x) => [`/case-study/${x.slug}`, x.updated]),
    ...links.map((x) => [`/useful-links/${x.slug}`, x.updated]),
  ]
  fs.writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(([p, d]) => `<url><loc>${SITE}${p}</loc><lastmod>${d}</lastmod></url>`).join("\n")}\n</urlset>\n`)
  fs.writeFileSync("public/robots.txt", `User-agent: *\nAllow: /\nDisallow: /order/\nDisallow: /payment-success\nDisallow: /payment-cancel\n\nSitemap: ${SITE}/sitemap.xml\n`)

  console.log(`images: ${stats.images} ready, ${stats.failed.length} failed`)
  stats.failed.slice(0, 20).forEach((f) => console.log("  ", f))
  console.log(`redirects: ${useful.length} kept. Pointing nowhere and dropped: ${nowhere.length}`)
  nowhere.forEach((r) => console.log("  ", r.from, "->", r.to))
  console.log(`sitemap: ${entries.length} addresses`)
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
