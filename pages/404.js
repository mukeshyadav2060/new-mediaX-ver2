import Link from "next/link"
import { Page, PageHead } from "@/components/Site"
import s from "@/styles/site.module.css"

export default function NotFound() {
  return (
    <Page title="Page not found" description="This page does not exist.">
      <PageHead title="Nothing here" intro="The link may be old. Let’s get you back on track.">
        <Link href="/" className={s.btnLarge}>
          Go home
        </Link>
      </PageHead>
    </Page>
  )
}
