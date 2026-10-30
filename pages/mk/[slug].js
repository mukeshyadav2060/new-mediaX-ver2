import { ServicePage } from "@/components/Posts"
import { GROUPS, serviceProps, slugPaths } from "@/lib/content"

export default function MarketingService({ page, others }) {
  return (
    <ServicePage base="/mk" label="marketing services" page={page} others={others}>
    </ServicePage>
  )
}

export const getStaticPaths = () => ({ paths: slugPaths(GROUPS.mk), fallback: false })
export const getStaticProps = ({ params }) => ({ props: serviceProps("mk", params.slug) })
