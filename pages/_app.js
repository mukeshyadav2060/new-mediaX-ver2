import { useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { Figtree, Unbounded } from "next/font/google"
import "@/styles/globals.css"

const display = Unbounded({ subsets: ["latin"], variable: "--font-display", display: "swap" })
const sans = Figtree({ subsets: ["latin"], variable: "--font-sans", display: "swap" })

export default function App({ Component, pageProps }) {
  const router = useRouter()

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
      </Head>
      <Component {...pageProps} />
    </div>
  )
}
