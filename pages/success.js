import Link from "next/link"
import { Page, PageHead } from "@/components/Site"
import s from "@/styles/site.module.css"

export default function Success() {
  return (
    <Page title="Message sent" description="Your submission was received successfully. The MediaX team will review the information and contact you with the next steps." noindex>
      <PageHead title="Message successfully sent" intro="We have received your message and will reach out to you as soon as possible. We look forward to our journey together.">
        <Link href="/" className={s.btnLarge}>
          Back to home
        </Link>
      </PageHead>
    </Page>
  )
}
