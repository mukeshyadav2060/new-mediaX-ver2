import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { Page, PageHead } from "./Site"
import { fetchOrder, ordersConnected } from "@/lib/orders"
import s from "@/styles/site.module.css"

// Both payment pages read the order from the CMS, and send it to the other page if its status belongs there.
export default function PaymentResult({ title, intro, seoTitle, paid, otherPage, children }) {
  const router = useRouter()
  const [state, setState] = useState({ order: null, missing: false })
  const { orderId } = router.query

  useEffect(() => {
    if (!router.isReady) return
    if (!orderId || !ordersConnected) {
      setState({ order: null, missing: true })
      return
    }
    fetchOrder(orderId)
      .then((order) => {
        if ((order?.paymentStatus === "paid") !== paid) router.replace(`${otherPage}?orderId=${encodeURIComponent(orderId)}`)
        else setState({ order, missing: false })
      })
      .catch(() => setState({ order: null, missing: true }))
  }, [router, orderId, paid, otherPage])

  return (
    <Page title={seoTitle} description="Your MediaX order.">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {state.order ? (
        <>
          <PageHead title={title} intro={intro} />
          <section className={s.order}>{children(state.order)}</section>
        </>
      ) : (
        <PageHead title={state.missing ? "Order not found" : "Checking your order…"} intro={state.missing ? "We couldn’t find this order. Get in touch and we’ll sort it out." : undefined}>
          {state.missing && (
            <Link href="/contact/" className={s.btnLarge}>
              Contact us
            </Link>
          )}
        </PageHead>
      )}
    </Page>
  )
}
