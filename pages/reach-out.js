import { Page, PageHead } from "@/components/Site"
import { Cta } from "@/components/Sections"
import { pages } from "@/lib/content"
import s from "@/styles/site.module.css"

export default function ReachOut({ page }) {
  return (
    <Page fullTitle="Contact MediaX Agency | Get in Touch for PR & Marketing" description="Reach out to MediaX today. Connect with our expert team for top-tier PR, media distribution, and growth strategies tailored for your brand." noindex>
      <PageHead title={page.title || "Reach out to MediaX Agency"} intro={page.subtitle} />
      <section className={s.pageBody}>
        <div className={s.bento}>
          <article className={`${s.bentoCard} ${s.tButter}`}>
            <h2 className={s.bentoTitle}>{page.servicesTitle}</h2>
            <ul className={s.pointList}>
              {page.services.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
          <article className={`${s.bentoCard} ${s.tMint}`}>
            <h2 className={s.bentoTitle}>{page.whyTitle}</h2>
            <p>{page.whySubtitle}</p>
            <ul className={s.pointList}>
              {page.why.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
      <Cta title={page.bookTitle} text={page.bookText} button="Contact us" href="/contact" />
    </Page>
  )
}

export const getStaticProps = () => ({ props: { page: pages.reachOut } })
