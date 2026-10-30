import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Page, PageHead } from "./Site"
import { Cta } from "./Sections"
import s from "@/styles/site.module.css"

const SECTION = { blogs: { name: "Blogs", base: "/blogs" }, newsroom: { name: "Newsroom", base: "/newsroom" } }

export const niceDate = (iso) =>
  iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : ""

// Body text was sanitised when it was copied from the CMS (scripts/snapshot-content.cjs).
export function Body({ html, className = "" }) {
  return <div className={`${s.article} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}

// Article data is big, so cards only fetch it when someone actually opens one.
export function PostCard({ base, post }) {
  return (
    <Link href={`${base}/${post.slug}`} prefetch={false} className={s.blogCard}>
      {post.thumb && <img src={post.thumb.src} width={post.thumb.width} height={post.thumb.height} alt="" loading="lazy" />}
      <span className={s.cardMeta}>{niceDate(post.date)}</span>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
    </Link>
  )
}

function Pager({ base, page, pages }) {
  const to = (n) => (n === 1 ? base : `${base}/page/${n}`)
  return (
    <nav className={s.pager} aria-label="Pages">
      <span>
        {page > 1 && (
          <Link href={to(page - 1)} className={s.btnLight}>
            Previous
          </Link>
        )}
      </span>
      <span className={`${s.pagerCount} num`} data-axis="">
        Page {page} of {pages}
      </span>
      <span>
        {page < pages && (
          <Link href={to(page + 1)} className={s.btnLight}>
            Next
          </Link>
        )}
      </span>
    </nav>
  )
}

export function PostList({ kind, head, posts, page, pages }) {
  const { base } = SECTION[kind]
  const router = useRouter()

  // The old newsroom paged with ?page=N, so those links land on the right page here.
  useEffect(() => {
    const asked = Number(router.query.page)
    if (asked > 1 && asked <= pages) router.replace(`${base}/page/${asked}`)
  }, [router, router.query.page, base, pages])

  return (
    <Page fullTitle={page > 1 ? `${head.title} - page ${page} | MediaX` : head.seo.title} description={head.seo.description}>
      <PageHead title={head.title} intro={head.subtitle} />
      <section className={s.pageBody}>
        <div className={s.blogList}>
          {posts.map((p) => (
            <PostCard key={p.slug} base={base} post={p} />
          ))}
        </div>
        <Pager base={base} page={page} pages={pages} />
      </section>
    </Page>
  )
}

export function Article({ kind, post, more }) {
  const { name, base } = SECTION[kind]
  return (
    <Page fullTitle={post.seo.title} description={post.seo.description} image={post.image?.src} type="article">
      <article className={s.articleWrap}>
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <Link href={base}>{name}</Link>
        </nav>
        <h1 className={s.articleTitle} data-axis="">
          {post.h1 || post.title}
        </h1>
        <p className={s.articleMeta}>
          {niceDate(post.date)}
          {post.minutes ? ` · ${post.minutes} min read` : ""}
        </p>
        {post.image && <img className={s.articleCover} src={post.image.src} width={post.image.width} height={post.image.height} alt={post.alt} fetchPriority="high" />}
        <Body html={post.html} />
      </article>
      <section className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.h2} data-axis="">
            Most read
          </h2>
        </div>
        <div className={s.blogGrid}>
          {more.map((p) => (
            <PostCard key={p.slug} base={base} post={p} />
          ))}
        </div>
      </section>
      <Cta />
    </Page>
  )
}

// A PR service, marketing service or sector page.
export function ServicePage({ base, label, page, others, children }) {
  return (
    <Page fullTitle={page.seo.title} description={page.seo.description} image={page.image?.src}>
      <article className={s.articleWrap}>
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
        </nav>
        <h1 className={s.articleTitle} data-axis="">
          {page.h1 || page.title}
        </h1>
        {page.image && <img className={s.articleCover} src={page.image.src} width={page.image.width} height={page.image.height} alt={page.name} fetchPriority="high" />}
        <Body html={page.html} />
        {children}
      </article>
      <section className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.h2} data-axis="">
            More {label}
          </h2>
        </div>
        <div className={s.pillLinks}>
          {others.map((o) => (
            <Link key={o.slug} href={`${base}/${o.slug}`} prefetch={false} className={s.btnLight}>
              {o.name}
            </Link>
          ))}
        </div>
      </section>
      <Cta />
    </Page>
  )
}
