import { Page, PageHead } from "@/components/Site"
import Md from "@/components/Md"
import { cms } from "@/lib/data"
import s from "@/styles/site.module.css"

export default function About() {
  return (
    <Page title="About" description={cms.about.subtitle}>
      <PageHead title={cms.about.title} intro={cms.about.subtitle} />
      <section className={s.pageBody}>
        <Md>{cms.about.body}</Md>
        <div className={s.teamHead}>
          <h2 className={s.h2}>{cms.team.title}</h2>
          <p>{cms.team.subtitle}</p>
        </div>
        <div className={s.team}>
          {cms.team.members.map((m) => {
            const Tag = m.linkedin ? "a" : "div"
            return (
              <Tag key={m.name} className={s.member} {...(m.linkedin ? { href: m.linkedin, rel: "noopener" } : {})}>
                <strong>{m.name}</strong>
                <span>{m.role}</span>
              </Tag>
            )
          })}
        </div>
      </section>
    </Page>
  )
}
