import { Page, PageHead } from "@/components/Site"
import { OLD_SITE, cms } from "@/lib/data"
import s from "@/styles/site.module.css"

export default function Blog() {
  return (
    <Page title="Blog" description="Guides on crypto PR, press release distribution and Web3 marketing from the MediaX team.">
      <PageHead title="Crypto PR, explained" intro="Guides on press release distribution, KOL marketing and getting your Web3 project noticed." />
      <section className={s.pageBody}>
        <div className={s.blogList}>
          {cms.blogs.map((b) => (
            <a key={b.slug} href={`${OLD_SITE}/blogs/${b.slug}`} rel="noopener" className={s.blogCard}>
              {b.image && <img src={b.image.src} width={b.image.width} height={b.image.height} alt="" loading="lazy" />}
              <h2>{b.title}</h2>
              <p>{b.excerpt}</p>
            </a>
          ))}
        </div>
      </section>
    </Page>
  )
}
