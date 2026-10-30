import Head from "next/head"
import Questions from "@/components/Questions"
import { Page, PageHead } from "@/components/Site"
import { Cta } from "@/components/Sections"
import { cms } from "@/lib/data"
import s from "@/styles/site.module.css"

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: cms.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
}

export default function Faq() {
  return (
    <Page title="Frequently asked questions" description="Find answers to your crypto PR and press release distribution questions in the MediaX FAQ.">
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      </Head>
      <PageHead title="Helpful queries" intro="Frequently asked questions about working with MediaX." />
      <section className={s.faq}>
        <Questions items={cms.faqs} />
      </section>
      <Cta />
    </Page>
  )
}
