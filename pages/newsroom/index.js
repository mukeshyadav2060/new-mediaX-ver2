import { PostList } from "@/components/Posts"
import { listProps } from "@/lib/content"

export default function Newsroom(props) {
  return <PostList kind="newsroom" {...props} />
}

export const getStaticProps = () => ({ props: listProps("newsroom", 1) })
