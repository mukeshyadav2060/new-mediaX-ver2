import { Page, PageHead } from "@/components/Site"
import { Cta } from "@/components/Sections"
import { cms } from "@/lib/data"
import { pages } from "@/lib/content"
import s from "@/styles/site.module.css"

export default function Team({ members }) {
  return (
    <Page fullTitle="Meet the MediaX Crypto PR & Web3 Team" description="Meet the MediaX crypto PR and Web3 marketing team helping blockchain brands earn trusted coverage, build authority and reach global audiences.">
      <PageHead title={cms.team.title} intro={cms.team.subtitle} />
      <section className={s.pageBody}>
        <div className={s.team}>
          {members.map((m) => {
            const Tag = m.linkedin ? "a" : "div"
            return (
              <Tag key={m.name} className={s.member} {...(m.linkedin ? { href: m.linkedin, rel: "noopener" } : {})}>
                {m.image && <img className={s.memberPhoto} src={m.image.src} width={m.image.width} height={m.image.height} alt="" loading="lazy" />}
                <strong>{m.name}</strong>
                <span>{m.role}</span>
              </Tag>
            )
          })}
        </div>
      </section>
      <Cta />
    </Page>
  )
}

export const getStaticProps = () => ({ props: { members: pages.team } })
