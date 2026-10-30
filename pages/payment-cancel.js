import Link from "next/link"
import PaymentResult from "@/components/PaymentResult"
import { Slip, SlipRow, SlipTotal } from "@/components/Site"
import { money } from "@/lib/data"
import s from "@/styles/site.module.css"

export default function PaymentCancel() {
  return (
    <PaymentResult title="Payment cancelled" intro="Your payment was not processed, and no charges have been made." seoTitle="Payment cancelled" paid={false} otherPage="/payment-success/">
      {(order) => (
        <>
          <Slip className={s.orderSlip}>
            <SlipRow left="Package" right={order.packageName} />
            <SlipRow left="Status" right={order.paymentStatus} />
            <SlipTotal left="Amount" right={money(order.packagePrice / 100)} />
          </Slip>
          <div className={s.actions}>
            <Link href="/pricing/" className={s.btnLarge}>
              Back to plans
            </Link>
            <Link href="/contact/" className={s.btnLight}>
              Contact us
            </Link>
          </div>
        </>
      )}
    </PaymentResult>
  )
}
