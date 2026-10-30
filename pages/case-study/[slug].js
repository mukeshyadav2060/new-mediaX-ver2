import Link from "next/link"
import { Page, Slip, SlipRow } from "@/components/Site"
import { Body } from "@/components/Posts"
import { Cta } from "@/components/Sections"
import { caseStudies, slugPaths } from "@/lib/content"
import s from "@/styles/site.module.css"

export default function CaseStudy({ study }) {
  return (
    <Page fullTitle={study.seo.title} description={study.seo.description} image={study.cover?.src} type="article">
      <article className={s.articleWrap}>
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <Link href="/case-study">Case studies</Link>
        </nav>
        {study.logo && <img className={s.caseLogo} src={study.logo.src} width={study.logo.width} height={study.logo.height} alt="" />}
        <h1 className={s.articleTitle} data-axis="">
          {study.h1 || study.title}
        </h1>
        <Body html={study.intro} />
        {study.cover && <img className={s.articleCover} src={study.cover.src} width={study.cover.width} height={study.cover.height} alt={study.title} fetchPriority="high" />}
        <Slip className={s.orderSlip}>
          {study.industry && <SlipRow left="Industry" right={study.industry} />}
          {study.location && <SlipRow left="Location" right={study.location} />}
        </Slip>
        {study.info && (
          <section className={s.caseBlock}>
            <h2 className={s.orderHead}>Info</h2>
            <Body html={study.info} />
          </section>
        )}
        {study.study.map((block) => (
          <section key={block.title} className={s.caseBlock}>
            <h2 className={s.orderHead}>{block.title}</h2>
            <Body html={block.html} />
          </section>
        ))}
      </article>
      <Cta />
    </Page>
  )
}

export const getStaticPaths = () => ({ paths: slugPaths(caseStudies), fallback: false })
export const getStaticProps = ({ params }) => ({ props: { study: caseStudies.find((c) => c.slug === params.slug) } })
