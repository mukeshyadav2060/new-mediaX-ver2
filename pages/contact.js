import { ContactForm } from "@/components/Forms"
import { Page, PageHead } from "@/components/Site"
import { BOOKING, cms } from "@/lib/data"
import s from "@/styles/site.module.css"

export default function Contact() {
  const { contact, social } = cms.footer
  return (
    <Page title="Contact" description="Talk to the MediaX crypto PR team. We reply within 24 hours.">
      <PageHead title="Let’s talk" intro="Tell us what you’re announcing and we’ll help you choose the right outlets. We get back to you within 24 hours." />
      <section className={s.contact}>
        <ContactForm />
        <div className={s.contactSide}>
          <div>
            <strong>Email</strong>
            <p>
              <a href={`mailto:${contact.mail}`}>{contact.mail}</a>
            </p>
          </div>
          <div>
            <strong>Telegram</strong>
            <p>
              <a href={social.telegram} rel="noopener">
                @MediaxPR
              </a>
            </p>
          </div>
          <div>
            <strong>Prefer to talk?</strong>
            <p>
              <a href={BOOKING} rel="noopener">
                Book a 30-minute call
              </a>
            </p>
          </div>
          <div>
            <strong>Office</strong>
            <p>{contact.location}</p>
          </div>
        </div>
      </section>
    </Page>
  )
}
