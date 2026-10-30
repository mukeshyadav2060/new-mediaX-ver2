import Link from "next/link"
import Arcade from "@/components/Arcade"
import { ContactForm } from "@/components/Forms"
import { PostCard } from "@/components/Posts"
import { Faq, Cta, Features, OutletBand, Packages, Steps } from "@/components/Sections"
import { Footer, Nav, Seo } from "@/components/Site"
import { cms } from "@/lib/data"
import { topPosts } from "@/lib/content"
import s from "@/styles/site.module.css"

export default function BestAgency({ news }) {
  return (
    <>
      <Seo fullTitle="Best Crypto PR Agency for Web3 Brands | MediaX" description="Work with MediaX, a crypto PR agency helping Web3 brands secure leading media coverage, build authority and reach investors worldwide." />
      <Nav />
      <section className={s.hero}>
        <p className={s.heroTag}>Crypto PR agency</p>
        <h1 className={s.heroTitle} data-axis="">
          Best crypto PR agency
          <br />
          for Web3 brands
        </h1>
        <p className={s.heroSub}>{cms.landing.subtitle}</p>
        <div className={s.actions}>
          <Link href="/submit-press-release" className={s.btnLarge}>
            Get started
          </Link>
          <a href="#how" className={s.btnLight}>
            How it works
          </a>
        </div>
        <p className={s.trustLine}>Trusted by over 1,400 crypto and Web3 projects</p>
        <Arcade />
      </section>
      <main>
        <OutletBand />
        <Steps />
        <Features />
        <section className={s.section}>
          <div className={s.sectionHead}>
            <h2 className={s.h2} data-axis="">
              From the newsroom
            </h2>
          </div>
          <div className={s.blogGrid}>
            {news.map((p) => (
              <PostCard key={p.slug} base="/newsroom" post={p} />
            ))}
          </div>
        </section>
        <Packages />
        <section className={s.contact}>
          <div className={s.sectionHead}>
            <h2 className={s.h2} data-axis="">
              Contact us
            </h2>
            <p className={s.lead}>Join forces with crypto marketing enthusiasts today.</p>
          </div>
          <ContactForm />
        </section>
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  )
}

export const getStaticProps = () => ({ props: { news: topPosts("newsroom") } })
