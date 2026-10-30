import Link from "next/link"
import { Page, PageHead } from "@/components/Site"
import { Body } from "@/components/Posts"
import Questions from "@/components/Questions"
import { Cta } from "@/components/Sections"
import { slugPaths, usefulLinks } from "@/lib/content"
import s from "@/styles/site.module.css"

export default function UsefulLink({ page }) {
  return (
    <Page fullTitle={page.seo.title} description={page.seo.description} image={page.image?.src}>
      <PageHead title={page.title}>
        <Body html={page.intro} />
        {page.button && (
          <Link href="/contact" className={s.btnLarge}>
            {page.button}
          </Link>
        )}
      </PageHead>
      <section className={s.pageBody}>
        {page.image && <img className={s.articleCover} src={page.image.src} width={page.image.width} height={page.image.height} alt="" fetchPriority="high" />}
        {page.blocks.map((b) => (
          <div key={b.title} className={s.caseBlock}>
            <h2 className={s.orderHead}>{b.title}</h2>
            {b.image && <img className={s.articleCover} src={b.image.src} width={b.image.width} height={b.image.height} alt="" loading="lazy" />}
            <Body html={b.html} />
          </div>
        ))}
      </section>
      {page.faqs.length > 0 && (
        <section className={s.faq}>
          <div className={s.sectionHead}>
            <h2 className={s.h2} data-axis="">
              {page.faqTitle}
            </h2>
          </div>
          <Questions items={page.faqs} />
        </section>
      )}
      <Cta title={page.ctaTitle} text={page.ctaText} button={page.ctaButton} href="/contact" />
    </Page>
  )
}

export const getStaticPaths = () => ({ paths: slugPaths(usefulLinks), fallback: false })
export const getStaticProps = ({ params }) => ({ props: { page: usefulLinks.find((p) => p.slug === params.slug) } })
