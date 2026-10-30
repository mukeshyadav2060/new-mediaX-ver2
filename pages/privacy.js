import { Page, PageHead } from "@/components/Site"
import Md from "@/components/Md"
import { cms } from "@/lib/data"
import s from "@/styles/site.module.css"

export default function Privacy() {
  return (
    <Page title="Privacy policy" description="How MediaX handles your information.">
      <PageHead title="Privacy policy" />
      <section className={s.pageBody}>
        <Md legal>{cms.legal.privacy.content}</Md>
      </section>
    </Page>
  )
}
