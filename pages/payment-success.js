import Link from "next/link"
import PaymentResult from "@/components/PaymentResult"
import { Slip, SlipRow, SlipTotal } from "@/components/Site"
import { money } from "@/lib/data"
import s from "@/styles/site.module.css"

const longDate = (iso) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

export default function PaymentSuccess() {
  return (
    <PaymentResult title="Payment successful" intro="Thank you. Your payment has gone through, and our team will reach out to you shortly." seoTitle="Payment successful" paid otherPage="/payment-cancel/">
      {(order) => (
        <>
          <Slip className={s.orderSlip}>
            <SlipRow left="Order ID" right={`#${order.orderId}`} />
            <SlipRow left="Package" right={order.packageName} />
            <SlipRow left="Payment ID" right={order.paymentId} />
            <SlipRow left="Date" right={longDate(order.updatedAt)} />
            <SlipRow left="Email" right={order.userContact?.email} />
            <SlipTotal left="Amount" right={money(order.packagePrice / 100)} />
          </Slip>
          <p className={s.lead}>
            A confirmation email has been sent to {order.userContact?.email}. Need help? <Link href="/contact/">Contact us</Link>.
          </p>
        </>
      )}
    </PaymentResult>
  )
}
