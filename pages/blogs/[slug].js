import { Article } from "@/components/Posts"
import { LISTS, articleProps, slugPaths } from "@/lib/content"

export default function BlogsArticle(props) {
  return <Article kind="blogs" {...props} />
}

export const getStaticPaths = () => ({ paths: slugPaths(LISTS.blogs), fallback: false })
export const getStaticProps = ({ params }) => ({ props: articleProps("blogs", params.slug) })
