import Link from "next/link"
import Plans from "./Plans"
import Questions from "./Questions"
import { BOOKING, OUTLETS, cms, outlet } from "@/lib/data"
import s from "@/styles/site.module.css"

const half = Math.ceil(OUTLETS.length / 2)
const ROW_A = OUTLETS.slice(0, half)
const ROW_B = OUTLETS.slice(half)

// Each card shows three logos, the outer two tilted equally in opposite directions.
const logos = (...ids) => ids.map((id) => outlet(id).logo)
const FEATURE_ART = [
  logos("cointelegraph", "apnews", "the-block"),
  logos("decrypt", "business-insider", "marketwatch"),
  cms.clients.slice(0, 3),
  logos("benzinga", "coinmarketcap", "be-in-crypto"),
]

export function Marquee({ items, reverse }) {
  return (
    <div className={s.marquee}>
      <div className={`${s.marqueeTrack} ${reverse ? s.marqueeBack : ""}`}>
        {[0, 1].map((copy) => (
          <div key={copy} className={s.marqueeSet} aria-hidden={copy === 1 ? "true" : undefined}>
            {items.map((o) => (
              <span key={o.id} className={s.marqueeTile}>
                <img src={o.logo.src} width={o.logo.width} height={o.logo.height} alt={copy === 0 ? o.name : ""} loading="lazy" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function OutletBand({ title = "Guaranteed placements on the outlets your audience reads" }) {
  return (
    <section className={s.logos}>
      <h2 className={s.h2} data-r="" data-axis="">
        {title}
      </h2>
      <Marquee items={ROW_A} />
      <Marquee items={ROW_B} reverse />
    </section>
  )
}

export function Features() {
  return (
    <section className={s.section}>
      <div className={s.sectionHead}>
        <h2 className={s.h2} data-r="" data-axis="">
          {cms.featuresTitle}
        </h2>
        <p className={s.lead} data-r="2">
          We combine expert storytelling, targeted outreach and strong media relationships to amplify your crypto brand.
        </p>
      </div>
      <div className={s.bento}>
        {cms.features.map((f, i) => (
          <article key={f.title} className={s.bentoCard} data-r={(i % 2) + 1}>
            <div className={s.stack} aria-hidden="true">
              {FEATURE_ART[i].map((img) => (
                <span key={img.src} className={s.stackTile}>
                  <img src={img.src} width={img.width} height={img.height} alt="" loading="lazy" />
                </span>
              ))}
            </div>
            <p className={s.bentoKicker}>{f.title}</p>
            <h3 className={s.bentoTitle}>{f.tagline}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Steps() {
  return (
    <section className={s.how} id="how">
      <div className={s.sectionHead}>
        <h2 className={s.h2} data-r="" data-axis="">
          One relationship.
          <br />
          Countless publications.
        </h2>
        <p className={s.howLead} data-r="2">
          Pick a package, send your story and watch the coverage roll in. Releases go live within 24 to 48 hours of your approval.
        </p>
      </div>
      <ol className={s.steps}>
        {cms.steps.map((step, i) => (
          <li key={step.title} className={s.step} data-r={(i % 2) + 1}>
            <span className={s.stepNum}>{i + 1}</span>
            <h3 className={s.stepTitle}>{step.title === "Get Published Instantly" ? "Get published fast" : step.title}</h3>
            <p>{step.title === "Get Published Instantly" ? "Your release goes out to top Web3 media outlets within 24 to 48 hours of your approval, expanding your reach." : step.text}</p>
            {step.image && (
              <div className={s.stepArt}>
                <img src={step.image.src} width={step.image.width} height={step.image.height} alt="" loading="lazy" />
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Packages() {
  return (
    <section className={s.section} id="pricing">
      <div className={s.sectionHead}>
        <h2 className={s.h2} data-r="" data-axis="">
          {cms.pricing.title}
        </h2>
        <p className={s.lead} data-r="2">
          Tap a package to see which outlets it covers. Not sure which one fits? We’ll help you choose.
        </p>
      </div>
      <Plans />
    </section>
  )
}

export function Voices() {
  return (
    <section className={s.voices}>
      <div className={s.sectionHead}>
        <h2 className={s.h2} data-r="" data-axis="">
          {cms.testimonialsTitle}
        </h2>
        <p className={s.lead} data-r="2">
          {cms.testimonialsSubtitle}
        </p>
      </div>
      <div className={s.voiceGrid}>
        {cms.testimonials.map((t) => (
          <figure key={t.name} className={s.voice} data-r="">
            {t.logo && <img src={t.logo.src} width={t.logo.width} height={t.logo.height} alt="" loading="lazy" />}
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              <strong>{t.name}</strong>
              <small>{t.role}</small>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export function Clients() {
  return (
    <section className={s.clients}>
      <h2 className={s.h2} data-r="" data-axis="">
        {cms.trusted.title}
      </h2>
      <ul className={s.clientWall} data-r="2">
        {cms.clients.map((c) => (
          <li key={c.src}>
            <img src={c.src} width={c.width} height={c.height} alt="Client logo" loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Faq({ title = "Questions, answered", items = cms.faqs }) {
  return (
    <section className={s.faq}>
      <div className={s.sectionHead}>
        <h2 className={s.h2} data-r="" data-axis="">
          {title}
        </h2>
        <p className={s.lead} data-r="2">
          Still curious? <a href={BOOKING} rel="noopener">Book a 30-minute call</a> with our team.
        </p>
      </div>
      <Questions items={items} />
    </section>
  )
}

export function Cta({ title = "Ready to get featured?", text = "Get in touch with our crypto PR team and get your project up and running. We’ll get back to you within 24 hours.", button = "Get started", href = "/submit-press-release" }) {
  return (
    <section className={s.ctaWrap}>
      <div className={s.cta}>
        <h2 className={s.ctaHead} data-r="" data-axis="">
          {title}
        </h2>
        <p className={s.ctaText} data-r="2">
          {text}
        </p>
        <div className={s.actions} data-r="3">
          <Link href={href} className={s.btnSoft}>
            {button}
          </Link>
          {href === "/submit-press-release" && (
            <a href={BOOKING} rel="noopener" className={s.btnGhost}>
              Book a call
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
