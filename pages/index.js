import Link from "next/link"
import { Footer, Nav, Seo } from "@/components/Site"
import Arcade from "@/components/Arcade"
import Plans from "@/components/Plans"
import Questions from "@/components/Questions"
import { Marquee } from "@/components/Sections"
import { BOOKING, OUTLETS, PLANS, cms, money } from "@/lib/data"
import s from "@/styles/site.module.css"

const FROM = money(PLANS[0].price)
const QUOTE = cms.testimonials[0]
const QUESTIONS = cms.faqs.filter(([q]) => /cost|guarantee|go live|write/i.test(q))

const STEPS = [
  ["Pick a package", "Choose the reach and outlets that fit your budget."],
  ["Send your story", "Share your release, with editorial help included."],
  ["Go live in 24 to 48 hours", "Get published after your approval, then get your metrics report."],
]

export default function Home() {
  return (
    <>
      <Seo description="Boost your crypto brand with MediaX. Guaranteed press release distribution to outlets like Cointelegraph and Yahoo Finance. Trusted by 1,400+ Web3 projects." />
      <Nav />
      <section className={s.homeHero}>
        <div className={s.homeHeroCopy}>
          <h1 className={s.homeTitle}>
            Get featured in
            <br />
            top-tier media
          </h1>
          <p className={s.homeText}>Guaranteed press release distribution for crypto and Web3 projects, from {FROM}.</p>
          <div className={s.homeActions}>
            <Link href="/submit-press-release" className={s.btnLarge}>
              Get started
            </Link>
            <a href="#packages" className={s.btnSoft}>
              See packages
            </a>
          </div>
        </div>
        <Arcade />
      </section>

      <main>
        <section className={`${s.homeBand} ${s.homeBandLogos}`}>
          <div className={s.homeCentred}>
            <h2 className={s.homeHeading} data-r="">
              On the outlets your audience reads
            </h2>
          </div>
          <Marquee items={OUTLETS} />
        </section>

        <section className={s.homeSection} id="packages">
          <div className={s.homeCentred}>
            <h2 className={s.homeHeading} data-r="">
              Choose your package
            </h2>
            <p className={s.homeText} data-r="2">
              Tap a package to see exactly which outlets it covers.
            </p>
          </div>
          <Plans />
          <div className={s.centerAction}>
            <Link href="/pricing#compare" className={s.btnSoft}>
              Compare every package
            </Link>
          </div>
        </section>

        <section className={`${s.homeBand} ${s.homeBandSteps}`}>
          <div className={s.homeCentred}>
            <h2 className={s.homeHeading} data-r="">
              How it works
            </h2>
          </div>
          <ol className={s.homeSteps}>
            {STEPS.map(([title, text], i) => (
              <li key={title} data-r={i + 1}>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${s.homeSection} ${s.homeSplit}`}>
          <h2 className={s.homeHeading} data-r="">
            Trusted by 1,400+ crypto and Web3 projects
          </h2>
          <figure className={s.homeQuote} data-r="2">
            <blockquote>{QUOTE.quote}</blockquote>
            <figcaption>
              {QUOTE.logo && <img src={QUOTE.logo.src} width={QUOTE.logo.width} height={QUOTE.logo.height} alt="" loading="lazy" />}
              <span>
                <strong>{QUOTE.name}</strong>
                <small>{QUOTE.role}</small>
              </span>
            </figcaption>
          </figure>
        </section>

        <section className={`${s.homeSection} ${s.homeSectionJoined} ${s.homeSplit}`}>
          <div className={s.homeSplitHead}>
            <h2 className={s.homeHeading} data-r="">
              Questions before you buy?
            </h2>
            <p className={s.homeText} data-r="2">
              Book a 30-minute call and we’ll help you choose, or <Link href="/faq">read every answer</Link>.
            </p>
            <a href={BOOKING} rel="noopener" className={s.btnSoft}>
              Book a call
            </a>
          </div>
          <Questions items={QUESTIONS} />
        </section>

        <section className={`${s.homeBand} ${s.homeBandEnd}`}>
          <div className={s.homeEnd}>
            <div>
              <h2 className={s.homeHeading} data-r="">
                Ready to get featured?
              </h2>
              <Link href="/submit-press-release" className={s.btnLarge}>
                Get started
              </Link>
            </div>
            <dl className={s.homeFacts}>
              <div>
                <dt className="num">{FROM}</dt>
                <dd>Starting price</dd>
              </div>
              <div>
                <dt className="num">500+</dt>
                <dd>Guaranteed publications on every package</dd>
              </div>
              <div>
                <dt className="num">24–48 hours</dt>
                <dd>To go live after your approval</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
