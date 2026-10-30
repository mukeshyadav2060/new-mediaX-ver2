import { ServicePage } from "@/components/Posts"
import { GROUPS, serviceProps, slugPaths } from "@/lib/content"

export default function Sector({ page, others }) {
  return (
    <ServicePage base="/sc" label="sectors" page={page} others={others}>
    </ServicePage>
  )
}

export const getStaticPaths = () => ({ paths: slugPaths(GROUPS.sc), fallback: false })
export const getStaticProps = ({ params }) => ({ props: serviceProps("sc", params.slug) })
