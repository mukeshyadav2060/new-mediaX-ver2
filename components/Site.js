import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { BOOKING, cms } from "@/lib/data"
import { Mark } from "./Mark"
import s from "@/styles/site.module.css"

export { Mark }

const SITE = "https://mediax.agency"

const NAV = [
  ["Pricing", "/pricing"],
  ["Newsroom", "/newsroom"],
  ["Blogs", "/blogs"],
  ["Industry", "/industry"],
  ["Contact", "/contact"],
]

const FOOT_COMPANY = [
  ["About", "/about"],
  ["Services", "/services"],
  ["Team", "/team"],
  ["Case studies", "/case-study"],
  ["Publications", "/publications"],
  ["Blogs", "/blogs"],
  ["Newsroom", "/newsroom"],
  ["Verify team", "/verify-team"],
]
const FOOT_START = [
  ["Pricing", "/pricing"],
  ["Submit a press release", "/submit-press-release"],
  ["Drop a press release", "/drop-press-release"],
  ["Crypto press release", "/crypto-press-release"],
  ["Best crypto PR agency", "/best-crypto-pr-agency"],
  ["Industry", "/industry"],
  ["FAQ", "/faq"],
]

export function Seo({ title, fullTitle, description, image, type, noindex }) {
  const router = useRouter()
  const full = fullTitle || (title ? `${title} | MediaX` : "Crypto PR & Web3 Press Release Distribution | MediaX")
  const path = router.asPath.split(/[?#]/)[0]
  return (
    <Head>
      <title>{full}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      {type && <meta property="og:type" content={type} />}
      {image && <meta property="og:image" content={`${SITE}${image}`} />}
      {image && <meta name="twitter:image" content={`${SITE}${image}`} />}
      {noindex ? <meta name="robots" content="noindex, follow" /> : <link rel="canonical" href={`${SITE}${path === "/" ? "" : path}`} />}
    </Head>
  )
}

export function Nav() {
  return (
    <header className={s.nav}>
      <Link href="/" className={s.brand}>
        <Mark size={28} className={s.brandMark} />
        MediaX
      </Link>
      <nav className={s.navSide} aria-label="Main">
        {NAV.map(([label, href]) => (
          <Link key={href} href={href} className={s.navLink}>
            {label}
          </Link>
        ))}
      </nav>
      <Link href="/submit-press-release" className={`${s.btnLarge} ${s.navCta}`}>
        Submit PR
      </Link>
      <details className={s.menu}>
        <summary aria-label="Menu">
          <i />
          <i />
        </summary>
        <nav className={s.menuPanel} aria-label="Menu">
          {[...NAV, ["Services", "/services"], ["About", "/about"]].map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  )
}

function FootLinks({ title, links }) {
  return (
    <div>
      <p className={s.footHead}>{title}</p>
      {links.map(([label, href]) => (
        <Link key={href} href={href} prefetch={false}>
          {label}
        </Link>
      ))}
    </div>
  )
}
const toLinks = (base, list) => list.map(({ slug, name }) => [name, `/${base}/${slug}`])

export function Footer() {
  const { contact, social, summary } = cms.footer
  return (
    <footer className={s.footer}>
      <Link href="/" className={s.footWord} data-axis="">
        <Mark size={36} />
        MediaX
      </Link>
      <p className={s.footSummary}>{summary}</p>
      <div className={s.footCols}>
        <FootLinks title="Company" links={FOOT_COMPANY} />
        <FootLinks title="Get started" links={FOOT_START} />
        <div>
          <p className={s.footHead}>Get in touch</p>
          <Link href="/contact" prefetch={false}>
            Contact us
          </Link>
          <a href={BOOKING} rel="noopener">
            Book a call
          </a>
          <a href={`mailto:${contact.mail}`}>{contact.mail}</a>
          <a href={social.telegram} rel="noopener">
            Telegram
          </a>
          <a href={social.twitter} rel="noopener">
            X
          </a>
          <a href={social.linkedin} rel="noopener">
            LinkedIn
          </a>
        </div>
        <FootLinks title="PR services" links={toLinks("pr", cms.footerLinks.pr)} />
        <FootLinks title="Marketing services" links={toLinks("mk", cms.footerLinks.mk)} />
        <FootLinks title="Sectors" links={toLinks("sc", cms.footerLinks.sc)} />
      </div>
      <div className={s.legal}>
        <span>{contact.location}</span>
        <span>© 2026 MediaX Agency. All rights reserved.</span>
        <span className={s.legalLinks}>
          <Link href="/terms-condition">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </span>
      </div>
    </footer>
  )
}

export function Page({ title, fullTitle, description, image, type, noindex, children }) {
  return (
    <>
      <Seo title={title} fullTitle={fullTitle} description={description} image={image} type={type} noindex={noindex} />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export function PageHead({ title, intro, children }) {
  return (
    <div className={s.pageHead}>
      <h1 className={s.pageTitle} data-axis="">
        {title}
      </h1>
      {intro && <p className={s.pageIntro}>{intro}</p>}
      {children}
    </div>
  )
}

// The summary card on the order and payment pages.
export function Slip({ children, className = "" }) {
  return (
    <div className={`${s.slip} ${className}`} data-ui="">
      {children}
    </div>
  )
}

export function SlipRow({ left, right }) {
  return (
    <div className={s.slipRow}>
      <span>{left}</span>
      <span className="num">{right}</span>
    </div>
  )
}

export function SlipTotal({ left, right }) {
  return (
    <div className={s.slipTotal}>
      <span>{left}</span>
      <strong className="num">{right}</strong>
    </div>
  )
}
