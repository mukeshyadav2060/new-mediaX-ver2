import { PostList } from "@/components/Posts"
import { listProps } from "@/lib/content"

export default function Blogs(props) {
  return <PostList kind="blogs" {...props} />
}

export const getStaticProps = () => ({ props: listProps("blogs", 1) })
