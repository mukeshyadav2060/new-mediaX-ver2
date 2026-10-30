import blogs from "@/content/blogs.json"
import caseStudies from "@/content/case-studies.json"
import mk from "@/content/mk.json"
import newsroom from "@/content/newsroom.json"
import pages from "@/content/pages.json"
import pr from "@/content/pr.json"
import sc from "@/content/sc.json"
import usefulLinks from "@/content/useful-links.json"

// Only for getStaticProps and getStaticPaths, so these big files stay out of the browser bundle.
export const LISTS = { blogs, newsroom }
export const GROUPS = { pr, mk, sc }
export { caseStudies, pages, usefulLinks }

const PER_PAGE = 12
const card = ({ slug, title, excerpt, date, minutes, thumb }) => ({ slug, title, excerpt, date, minutes, thumb })

export const slugPaths = (list) => list.map(({ slug }) => ({ params: { slug } }))
export const pageCount = (kind) => Math.ceil(LISTS[kind].length / PER_PAGE)
export const pagePaths = (kind) => Array.from({ length: pageCount(kind) - 1 }, (_, i) => ({ params: { n: String(i + 2) } }))

export function listProps(kind, page) {
  const start = (page - 1) * PER_PAGE
  return { head: pages[kind], posts: LISTS[kind].slice(start, start + PER_PAGE).map(card), page, pages: pageCount(kind) }
}

// The old site's sidebar showed the most viewed posts, so this does too.
const mostViewed = (list, skip) =>
  [...list]
    .filter((p) => p.slug !== skip)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3)
    .map(card)

export function articleProps(kind, slug) {
  const { html, title, h1, date, minutes, image, alt, seo } = LISTS[kind].find((p) => p.slug === slug)
  return { post: { html, title, h1, date, minutes, image, alt, seo }, more: mostViewed(LISTS[kind], slug) }
}

export function topPosts(kind) {
  return mostViewed(LISTS[kind])
}

export function serviceProps(group, slug) {
  const list = GROUPS[group]
  return { page: list.find((p) => p.slug === slug), others: list.filter((p) => p.slug !== slug).map(({ slug, name }) => ({ slug, name })) }
}
