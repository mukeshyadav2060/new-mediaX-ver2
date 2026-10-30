import { PostList } from "@/components/Posts"
import { listProps, pagePaths } from "@/lib/content"

export default function BlogsPage(props) {
  return <PostList kind="blogs" {...props} />
}

export const getStaticPaths = () => ({ paths: pagePaths("blogs"), fallback: false })
export const getStaticProps = ({ params }) => ({ props: listProps("blogs", Number(params.n)) })
