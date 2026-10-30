import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Page, PageHead, Slip, SlipRow, SlipTotal } from "@/components/Site"
import { money } from "@/lib/data"
import { fetchOrder, ordersConnected } from "@/lib/orders"
import s from "@/styles/site.module.css"

const longDate = (iso) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

// Addresses look like /order/123. A static host serves this one file for all of them (see public/_redirects).
export default function Order() {
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    const id = router.query.id || window.location.pathname.match(/^\/order\/([^/]+)/)?.[1]
    if (!id || !ordersConnected) {
      setMissing(true)
      return
    }
    fetchOrder(decodeURIComponent(id))
      .then(setOrder)
      .catch(() => setMissing(true))
  }, [router.isReady, router.query.id])

  const head = order ? `Order #${order.orderId || order.id}` : missing ? "Order not found" : "Checking your order…"
  return (
    <Page title="Track your order" description="Track the status of your MediaX press release order." noindex>
      <PageHead title={head} intro={order ? `${longDate(order.updatedAt)} · ${order.orderStatus}` : undefined}>
        {missing && (
          <Link href="/contact" className={s.btnLarge}>
            Contact us
          </Link>
        )}
      </PageHead>
      {order && (
        <section className={s.order}>
          <Slip className={s.orderSlip}>
            <p className={s.orderHead}>Order details</p>
            <SlipRow left="Package" right={order.packageName} />
            <SlipRow left="Title" right={order.title} />
            <SlipRow left="Publishing date" right={longDate(order.publishingDate)} />
            <SlipTotal left="Total" right={money(order.packagePrice / 100)} />
          </Slip>
          <Slip className={s.orderSlip}>
            <p className={s.orderHead}>Media contact</p>
            <SlipRow left="Name" right={order.mediaContact?.contactPersonName} />
            <SlipRow left="Email" right={order.mediaContact?.businessEmail} />
            <SlipRow left="Location" right={`${order.mediaContact?.city}, ${order.mediaContact?.country}`} />
          </Slip>
          <Slip className={s.orderSlip}>
            <p className={s.orderHead}>Customer and payment</p>
            <SlipRow left="Name" right={order.userContact?.fullName} />
            <SlipRow left="Email" right={order.userContact?.email} />
            <SlipRow left="Payment ID" right={order.paymentId} />
            <SlipRow left="Payment status" right={order.paymentStatus} />
          </Slip>
          <p className={s.lead}>
            Questions about your order? <Link href="/contact">Contact support</Link>.
          </p>
        </section>
      )}
    </Page>
  )
}
