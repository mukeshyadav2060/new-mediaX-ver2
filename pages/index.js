import Link from "next/link"
import { Footer, Nav, Seo } from "@/components/Site"
import Arcade from "@/components/Arcade"
import { Clients, Cta, Faq, Features, OutletBand, Packages, Steps, Voices } from "@/components/Sections"
import { cms } from "@/lib/data"
import s from "@/styles/site.module.css"

export default function Home() {
  return (
    <>
      <Seo description="Boost your crypto brand with MediaX. Guaranteed press release distribution to outlets like Cointelegraph and Yahoo Finance. Trusted by 1,400+ Web3 projects." />
      <Nav />
      <section className={s.hero}>
        <p className={s.heroTag}>Crypto press release distribution</p>
        <h1 className={s.heroTitle} data-axis="">
          Get featured in
          <br />
          top-tier media
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
        <Features />
        <Steps />
        <Packages />
        <Voices />
        <Clients />

        <section className={s.section}>
          <div className={s.sectionHead}>
            <h2 className={s.h2} data-r="" data-axis="">
              Latest from the blog
            </h2>
          </div>
          <div className={s.blogGrid}>
            {cms.blogs.map((b, i) => (
              <Link key={b.slug} href={`/blogs/${b.slug}`} prefetch={false} className={s.blogCard} data-r={i + 1}>
                {b.image && <img src={b.image.src} width={b.image.width} height={b.image.height} alt="" loading="lazy" />}
                <h3>{b.title}</h3>
              </Link>
            ))}
          </div>
          <div className={s.centerAction}>
            <Link href="/blogs" className={s.btnLight}>
              See all posts
            </Link>
          </div>
        </section>

        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
