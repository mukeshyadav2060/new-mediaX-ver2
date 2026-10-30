import Link from "next/link"
import { Page, PageHead } from "@/components/Site"
import { Cta, Voices } from "@/components/Sections"
import { caseStudies, pages } from "@/lib/content"
import s from "@/styles/site.module.css"

export default function CaseStudies({ head, studies }) {
  return (
    <Page fullTitle={head.seo.title} description={head.seo.description}>
      <PageHead title={head.title} intro={head.subtitle} />
      <section className={s.pageBody}>
        <div className={s.caseGrid}>
          {studies.map((c) => (
            <Link key={c.slug} href={`/case-study/${c.slug}`} prefetch={false} className={s.blogCard}>
              {c.thumb && <img src={c.thumb.src} width={c.thumb.width} height={c.thumb.height} alt="" loading="lazy" />}
              {c.industry && <span className={s.cardMeta}>{c.industry}</span>}
              <h2>{c.title}</h2>
              <p>{c.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
      <Voices />
      <Cta />
    </Page>
  )
}

export const getStaticProps = () => ({
  props: { head: pages.caseStudies, studies: caseStudies.map(({ slug, title, excerpt, industry, thumb }) => ({ slug, title, excerpt, industry, thumb })) },
})
