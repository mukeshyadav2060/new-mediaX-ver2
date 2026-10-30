import Head from "next/head"
import Link from "next/link"
import { BOOKING, cms } from "@/lib/data"
import { Mark } from "./Mark"
import s from "@/styles/site.module.css"

export { Mark }

// Three links either side of the logo, so the header mirrors around its centre.
const NAV_LEFT = [
  ["Pricing", "/pricing/"],
  ["Publications", "/publications/"],
  ["Blog", "/blog/"],
]
const NAV_RIGHT = [
  ["About", "/about/"],
  ["Contact", "/contact/"],
  ["Submit PR", "/submit-press-release/"],
]
export const NAV = [...NAV_LEFT, ...NAV_RIGHT.slice(0, 2)]

export function Seo({ title, description }) {
  const full = title ? `${title} | MediaX` : "Crypto PR & Web3 Press Release Distribution | MediaX"
  return (
    <Head>
      <title>{full}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
    </Head>
  )
}

export function Nav() {
  return (
    <header className={s.nav}>
      <nav className={s.navSide} aria-label="Main">
        {NAV_LEFT.map(([label, href]) => (
          <Link key={href} href={href} className={s.navLink}>
            {label}
          </Link>
        ))}
      </nav>
      <details className={s.menu}>
        <summary aria-label="Menu">
          <i />
          <i />
        </summary>
        <nav className={s.menuPanel} aria-label="Menu">
          {[...NAV_LEFT, ...NAV_RIGHT].map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </details>
      <Link href="/" className={s.brand} data-axis="">
        <Mark size={28} className={s.brandMark} />
        MediaX
      </Link>
      <nav className={`${s.navSide} ${s.navRight}`} aria-label="More">
        {NAV_RIGHT.map(([label, href]) => (
          <Link key={href} href={href} className={s.navLink}>
            {label}
          </Link>
        ))}
      </nav>
      <Link href="/submit-press-release/" className={s.navPhone}>
        Submit PR
      </Link>
    </header>
  )
}

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
        <div>
          <p className={s.footHead}>Explore</p>
          {NAV.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <p className={s.footHead}>Get started</p>
          <Link href="/submit-press-release/">Submit a press release</Link>
          <a href={BOOKING} rel="noopener">
            Book a call
          </a>
        </div>
        <div>
          <p className={s.footHead}>Get in touch</p>
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
      </div>
      <div className={s.legal}>
        <span>{contact.location}</span>
        <span>© 2026 MediaX Agency. All rights reserved.</span>
        <span className={s.legalLinks}>
          <Link href="/terms/">Terms</Link>
          <Link href="/privacy/">Privacy</Link>
        </span>
      </div>
    </footer>
  )
}

export function Page({ title, description, children }) {
  return (
    <>
      <Seo title={title} description={description} />
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
