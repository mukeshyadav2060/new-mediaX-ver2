import { Page, PageHead } from "@/components/Site"
import { Clients, Cta, OutletBand, Voices } from "@/components/Sections"
import Link from "next/link"
import { cms } from "@/lib/data"
import { pages } from "@/lib/content"
import s from "@/styles/site.module.css"

const GROUPS = [
  ["PR services", "pr", cms.footerLinks.pr],
  ["Marketing services", "mk", cms.footerLinks.mk],
  ["Sectors", "sc", cms.footerLinks.sc],
]

export default function Services({ head }) {
  return (
    <Page fullTitle={head.seo.title} description={head.seo.description}>
      <PageHead title={head.title} intro={head.subtitle} />
      <section className={s.pageBody}>
        <div className={s.tileGrid}>
          {head.items.map((item) => (
            <article key={item.title} className={s.tile}>
              {item.image && <img src={item.image.src} width={item.image.width} height={item.image.height} alt="" loading="lazy" />}
              <h2 className={s.tileTitle}>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={s.pageBody}>
        <div className={s.tileGrid}>
          {GROUPS.map(([title, base, links]) => (
            <div key={base} className={s.tile}>
              <h2 className={s.tileTitle}>{title}</h2>
              <div className={s.tileLinks}>
                {links.map((l) => (
                  <Link key={l.slug} href={`/${base}/${l.slug}`} prefetch={false}>
                    {l.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Voices />
      <OutletBand />
      <Clients />
      <div className={s.gap} />
      <Cta />
    </Page>
  )
}

export const getStaticProps = () => ({ props: { head: pages.services } })
