import { PostList } from "@/components/Posts"
import { listProps, pagePaths } from "@/lib/content"

export default function NewsroomPage(props) {
  return <PostList kind="newsroom" {...props} />
}

export const getStaticPaths = () => ({ paths: pagePaths("newsroom"), fallback: false })
export const getStaticProps = ({ params }) => ({ props: listProps("newsroom", Number(params.n)) })
