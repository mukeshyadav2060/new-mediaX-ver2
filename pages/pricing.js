import { Page, PageHead } from "@/components/Site"
import Plans from "@/components/Plans"
import Compare from "@/components/Compare"
import Questions from "@/components/Questions"
import { BOOKING, cms } from "@/lib/data"
import s from "@/styles/site.module.css"

const PRICE_FAQS = cms.faqs.filter(([q]) => /cost|guarantee|choose|write|global|go live/i.test(q))

export default function Pricing() {
  return (
    <Page title="Pricing" description="Crypto press release packages from $600, with guaranteed publications on every plan.">
      <PageHead title={cms.pricing.title} intro="Every package includes guaranteed publications, editorial assistance, SEO optimization and a metrics report." />
      <section className={s.pageBody}>
        <Plans />
      </section>
      <section className={s.pageBody} id="compare">
        <div className={s.sectionHead}>
          <h2 className={s.h2} data-axis="">
            Compare every package
          </h2>
          <p className={s.lead}>See what each package costs, how many publications it guarantees and which outlets it features.</p>
        </div>
        <Compare />
      </section>
      <section className={s.faq}>
        <div className={s.sectionHead}>
          <h2 className={s.h2} data-axis="">
            Before you buy
          </h2>
          <p className={s.lead}>
            Need something custom? <a href={BOOKING} rel="noopener">Book a call</a> and we’ll put a quote together.
          </p>
        </div>
        <Questions items={PRICE_FAQS} />
      </section>
    </Page>
  )
}
