import Link from "next/link"
import { ServicePage } from "@/components/Posts"
import { GROUPS, serviceProps, slugPaths } from "@/lib/content"
import s from "@/styles/site.module.css"

const RELATED = [
  ["Bitget case study", "/case-study/bitget"],
  ["KuCoin case study", "/case-study/kucoin"],
  ["XT Exchange case study", "/case-study/xt-exchange"],
]

export default function PrService({ page, others }) {
  return (
    <ServicePage base="/pr" label="PR services" page={page} others={others}>
      {page.slug === "crypto-exchange-pr" && (
        <div className={s.related}>
          <h2 className={s.orderHead}>Related case studies</h2>
          <div className={s.pillLinks}>
            {RELATED.map(([label, href]) => (
              <Link key={href} href={href} className={s.btnLight}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </ServicePage>
  )
}

export const getStaticPaths = () => ({ paths: slugPaths(GROUPS.pr), fallback: false })
export const getStaticProps = ({ params }) => ({ props: serviceProps("pr", params.slug) })
