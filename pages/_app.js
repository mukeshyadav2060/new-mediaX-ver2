import { useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { Figtree, Unbounded } from "next/font/google"
import "@/styles/globals.css"

const display = Unbounded({ subsets: ["latin"], variable: "--font-display", display: "swap" })
const sans = Figtree({ subsets: ["latin"], variable: "--font-sans", display: "swap" })

const ORGANIZATION = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MediaX Agency",
  url: "https://mediax.agency/",
  email: "contact@mediax.agency",
  sameAs: ["https://www.facebook.com/mediax.agency/", "https://twitter.com/AgencyMediax", "https://t.me/MediaxPR", "https://www.linkedin.com/company/mediax-agencyy/"],
})

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    if (window.location.hostname !== "mediax.agency") return
    const events = ["scroll", "keydown", "mousemove", "touchstart", "pointerdown", "click"]
    const load = () => {
      clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, load))
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" })
      const script = document.createElement("script")
      script.async = true
      script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-N2PF7P8R"
      document.head.appendChild(script)
    }
    const timer = setTimeout(load, 6000)
    events.forEach((e) => window.addEventListener(e, load, { passive: true }))
    return () => {
      clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, load))
    }
  }, [])

  useEffect(() => {
    const scan = () => window.__reveal?.()
    scan()
    router.events.on("routeChangeComplete", scan)
    return () => router.events.off("routeChangeComplete", scan)
  }, [router.events])

  return (
    <div className={`fonts ${display.variable} ${sans.variable}`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORGANIZATION }} />
      </Head>
      <Component {...pageProps} />
    </div>
  )
}
