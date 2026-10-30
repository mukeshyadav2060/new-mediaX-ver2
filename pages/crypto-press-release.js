import Link from "next/link"
import { LeadForm } from "@/components/Forms"
import { Page, PageHead } from "@/components/Site"
import { Clients, Cta, Faq, OutletBand } from "@/components/Sections"
import s from "@/styles/site.module.css"

const POINTS = ["Join 1,400+ Web3 marketers leveraging top-tier exposure.", "Guaranteed placement on leading crypto and blockchain news sites.", "Featured on hundreds of top crypto media outlets."]

const FEATURES = [
  {
    title: "Strategic media planning & buying made easy",
    text: "Choose from curated media packages or tailor custom campaigns to maximize your reach and impact.",
    button: ["Choose a package", "/pricing"],
    image: ["/media/feature-p1.webp", 954, 767],
    quote: "Understanding a project’s core is crucial in the Web3 space, and MediaX excels at it. Every article is crafted with precision, and the team’s dedication consistently exceeds expectations.",
    by: "Erik, UXLINK",
  },
  {
    title: "Unlock PR advertising insights & benchmark performance",
    text: "Leverage our powerful analytics suite to track, measure, and optimize your key performance indicators with precision.",
    button: ["Book a demo", "/contact"],
    image: ["/media/feature-p2.webp", 574, 661],
    quote: "What truly sets this platform apart is its outstanding customer support. This excellence has solidified its position as a leading press release distribution service in the crypto space.",
    by: "Bella, XT Exchange",
  },
  {
    title: "Expand your reach, instantly",
    text: "Accelerate your launch with same-day press release distribution for maximum impact.",
    button: ["Submit a press release", "/submit-press-release"],
    image: ["/media/feature-p3.webp", 598, 511],
    quote: "MediaX stands out with its strong reputation, competitive pricing, and extensive distribution network. We highly recommend it for publishing crypto press releases.",
    by: "Igor, Rivalz Network",
  },
]

const QUESTIONS = [
  ["What types of securities can we list on an exchange?", "One can list common types of securities, including stocks, bonds, ETFs, and other financial instruments on an exchange."],
  ["What is the process for listing on an exchange?", "The exchange listing process can vary depending on the exchange and the type of security being listed. Generally, the process involves submitting an application to the exchange, providing disclosure documents, and submitting it to a review and approval process. Once the company is approved, it can list its securities on the exchange."],
  ["What are the costs associated with an Exchange Listing Service?", "The cost of an Exchange Listing Service depends on the listing type and size. Fees can include legal and accounting costs, as well as exchange fees and other associated costs."],
]

export default function CryptoPressRelease() {
  return (
    <Page fullTitle="Crypto PR Agency | Blockchain, Defi, NFT, Metaverse & More" description="MediaX Agency, based in Dubai and serving clients globally, specializes in PR and marketing for crypto, NFT, DeFi, Metaverse, fintech startups, and IDOs.">
      <PageHead title="Distribute crypto press releases" intro="Ever heard of a crypto-focused PR newswire? With MediaX, your press releases get published on premium crypto-focused media outlets.">
        <ul className={s.pointList}>
          {POINTS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </PageHead>
      <section className={s.contact}>
        <LeadForm />
      </section>
      <Clients />
      <section className={s.section} id="service">
        <div className={s.sectionHead}>
          <h2 className={s.h2} data-axis="">
            Designed for more powerful crypto PR advertising
          </h2>
          <p className={s.lead}>Power your Web3 growth with smart press release coverage. Launch data-driven Web3 campaigns, expand your audience, and build lasting brand trust, all in one platform.</p>
        </div>
        <div className={s.featureStack}>
          {FEATURES.map((f) => (
            <article key={f.title} className={s.step}>
              <img className={s.featureArt} src={f.image[0]} width={f.image[1]} height={f.image[2]} alt="" loading="lazy" />
              <h3 className={s.stepTitle}>{f.title}</h3>
              <p>{f.text}</p>
              <Link href={f.button[1]} className={s.btnLarge}>
                {f.button[0]}
              </Link>
              <figure className={s.featureQuote}>
                <blockquote>“{f.quote}”</blockquote>
                <figcaption>{f.by}</figcaption>
              </figure>
            </article>
          ))}
        </div>
      </section>
      <OutletBand title="A massive Web3 publisher network" />
      <div className={s.gap} />
      <Faq title="Frequently asked questions" items={QUESTIONS} />
      <Cta />
    </Page>
  )
}
