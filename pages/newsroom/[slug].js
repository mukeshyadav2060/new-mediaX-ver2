import { Article } from "@/components/Posts"
import { LISTS, articleProps, slugPaths } from "@/lib/content"

export default function NewsroomArticle(props) {
  return <Article kind="newsroom" {...props} />
}

export const getStaticPaths = () => ({ paths: slugPaths(LISTS.newsroom), fallback: false })
export const getStaticProps = ({ params }) => ({ props: articleProps("newsroom", params.slug) })
