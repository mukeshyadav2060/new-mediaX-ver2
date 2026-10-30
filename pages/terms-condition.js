import { Page, PageHead } from "@/components/Site"
import Md from "@/components/Md"
import { cms } from "@/lib/data"
import s from "@/styles/site.module.css"

export default function Terms() {
  return (
    <Page title="Terms and conditions" description="Terms and conditions for using MediaX.">
      <PageHead title="Terms and conditions" />
      <section className={s.pageBody}>
        <Md legal>{cms.legal.terms.content}</Md>
      </section>
    </Page>
  )
}
