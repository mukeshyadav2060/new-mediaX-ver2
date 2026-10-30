import { Page, PageHead } from "@/components/Site"
import { Cta, OutletBand, Voices } from "@/components/Sections"
import s from "@/styles/site.module.css"

const INDUSTRIES = [
  ["Blockchain & Web3", "sr1", "MediaX PR Agency specializes in strategic communication and media placement for Blockchain and Web3 projects. We leverage our deep understanding of these cutting-edge technologies to craft compelling narratives that resonate with target audiences and media outlets. Through our expertise in the industry, we help blockchain and Web3 ventures build credibility, gain visibility, and drive adoption in this rapidly evolving landscape."],
  ["Technology and Innovation", "sr2", "In this rapidly evolving sector, companies need to communicate their breakthroughs, product launches, and industry advancements effectively. We help tech companies build and maintain their brand reputation, engage with their target audience, and handle crisis communication when necessary."],
  ["Healthcare and Pharmaceuticals", "sr3", "The healthcare industry demands clear and concise communication to convey complex medical information to various stakeholders, including patients, healthcare professionals, and regulatory bodies. We work with healthcare providers, pharmaceutical companies, and medical device manufacturers to develop targeted PR campaigns and navigate sensitive issues."],
  ["Consumer Goods and Retail", "sr4", "For consumer brands, maintaining a positive public image is crucial for staying competitive in the market. Our PR agency assists consumer goods and retail companies in crafting impactful messaging, conducting media outreach, and managing product launches and PR events."],
  ["Financial Services", "sr5", "Trust and reputation are paramount in the financial industry. We help banks, investment firms, insurance companies, and fintech startups manage their public relations by highlighting their expertise, promoting financial literacy, and handling communications during economic shifts and market challenges."],
  ["Travel and Hospitality", "sr6", "In the travel and hospitality sector, customer perception and reviews significantly impact business success. Our agency works with hotels, airlines, travel agencies, and tourism boards to create compelling stories, manage online reputation, and deal with crisis communications in times of travel disruptions or other related issues."],
  ["Energy and Sustainability", "sr7", "As the world focuses on sustainability and environmental impact, energy and sustainability companies need effective communication to convey their commitment to responsible practices. We assist these organizations in crafting PR strategies that showcase their green initiatives, community involvement, and innovation in sustainable technologies."],
  ["Automotive", "sr8", "Achieve your marketing goals with our motorsport & automotive PR expertise. Leverage our auto PR specialization to promote your car dealership, luxury vehicle distribution agency, or classic car events. From organizing media events to crafting press releases and creating engaging content, PR agencies ensure that new vehicle models and features receive maximum media coverage and exposure."],
  ["Entertainment and Media", "sr9", "We support movie studios, TV networks, and entertainment companies in promoting new releases, managing celebrity reputations, and handling crisis situations. Our team works diligently to create positive narratives, manage crisis situations, and build lasting relationships between clients and the media, contributing to your overall success and popularity in the entertainment world."],
]

export default function Industry() {
  return (
    <Page fullTitle="MediaX PR Agency: Elevating Brands Across Diverse Industries" description="Explore our strategic communication and media placement services for blockchain, tech, healthcare, retail, finance, travel, energy, and more.">
      <PageHead title="Dominate all spheres of the PR industry" intro="We work with companies, non-profit organizations, and individuals across industries, helping them navigate the complex landscape of public relations to achieve their communication objectives and establish strong connections with their stakeholders." />
      <section className={s.pageBody}>
        <div className={s.tileGrid}>
          {INDUSTRIES.map(([title, icon, text]) => (
            <article key={title} className={s.tile}>
              <span className={s.tileIcon}>
                <img src={`/images/service/${icon}.svg`} width="56" height="56" alt="" loading="lazy" />
              </span>
              <h2 className={s.tileTitle}>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <Voices />
      <OutletBand />
      <div className={s.gap} />
      <Cta />
    </Page>
  )
}
