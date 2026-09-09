import { PageHero } from '@/marketing/components/sections/PageHero';
import { Section } from '@/marketing/components/layout/Section';
import { SectionLabel } from '@/marketing/components/common/SectionLabel';
import { EditorialHeading, SerifAccent } from '@/marketing/components/common/EditorialHeading';
import { LinkButton } from '@/marketing/components/common/Button';
import { Reveal } from '@/marketing/components/common/Reveal';
import { Philosophy } from '@/marketing/components/sections/Philosophy';
import { DataResponsibility } from '@/marketing/components/sections/DataResponsibility';
import { FutureEcosystem } from '@/marketing/components/sections/FutureEcosystem';
import { FinalCta } from '@/marketing/components/sections/FinalCta';
import { useSeo } from '@/marketing/hooks/useSeo';

export default function CompanyPage() {
  useSeo({
    title: 'Company',
    description:
      'OpportunityPedia is an opportunity intelligence company. Our thesis, how we think, and what we are building around discovering and acting on business opportunity.',
    path: '/company',
  });

  return (
    <>
      <PageHero
        eyebrow="COMPANY"
        headline="We believe the next opportunity should be easier to find."
        lead="OpportunityPedia builds intelligence products that transform fragmented market signals into clear opportunities for action."
        index={[
          { key: 'Category', value: 'Opportunity Intelligence' },
          { key: 'Flagship', value: 'OpportunityX' },
          { key: 'Stage', value: 'Building' },
        ]}
      />

      {/* Our thesis */}
      <Section divider surface="white" aria-labelledby="thesis-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <Reveal>
              <SectionLabel index="01">OUR THESIS</SectionLabel>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <Reveal>
              <EditorialHeading id="thesis-heading" size="display" className="max-w-[24ch]">
                The problem was never a shortage of{' '}
                <SerifAccent>information</SerifAccent>.
              </EditorialHeading>

              <div className="mt-10 grid max-w-[56rem] gap-8 border-t border-mist pt-8 md:grid-cols-2 md:gap-12">
                <p className="text-lead text-graphite">
                  Almost every commercial signal a team needs is already public. Procurement
                  portals, career pages, announcements, filings and industry resources publish it
                  continuously.
                </p>
                <p className="text-lead text-graphite">
                  What is missing is structure. The signals are fragmented across systems that were
                  never designed to be read together, which turns a research problem into a
                  coordination problem.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Why OpportunityPedia */}
      <Section divider surface="paper" aria-labelledby="why-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <Reveal>
              <SectionLabel index="02">WHY OPPORTUNITYPEDIA</SectionLabel>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <Reveal>
              <EditorialHeading id="why-heading" size="display" className="max-w-[22ch]">
                A reference layer, not another feed.
              </EditorialHeading>
              <div className="mt-10 grid max-w-[56rem] gap-8 border-t border-mist pt-8 md:grid-cols-2 md:gap-12">
                <p className="text-lead text-graphite">
                  &ldquo;Pedia&rdquo; is the deliberate half of the name. The work is indexing,
                  organizing and making information referenceable — the same discipline behind any
                  serious reference system.
                </p>
                <p className="text-lead text-graphite">
                  &ldquo;Opportunity&rdquo; is the other half: movement, timing and potential. The
                  company exists at the point where a well-organized index turns into a decision
                  someone can act on today.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Philosophy />

      {/* What we're building */}
      <Section divider surface="white" aria-labelledby="building-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <Reveal>
              <SectionLabel index="05">WHAT WE&rsquo;RE BUILDING</SectionLabel>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <Reveal>
              <EditorialHeading id="building-heading" size="display" className="max-w-[22ch]">
                Building an opportunity intelligence company.
              </EditorialHeading>
              <div className="mt-10 grid max-w-[56rem] gap-8 border-t border-mist pt-8 md:grid-cols-2 md:gap-12">
                <p className="text-lead text-graphite">
                  OpportunityPedia was created around a simple observation: teams spend enormous
                  amounts of time searching for information that already exists.
                </p>
                <p className="text-lead text-graphite">
                  Our goal is to organize that information into products that help people
                  understand what matters, when it matters, and what to do next.
                </p>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <LinkButton to="/products/opportunityx" size="lg">
                  Explore OpportunityX
                </LinkButton>
                <LinkButton to="/careers" variant="secondary" size="lg">
                  Join the team
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <FutureEcosystem />
      <DataResponsibility />

      {/* Team — extensible, no invented people */}
      <Section divider surface="white" aria-labelledby="team-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <Reveal>
              <SectionLabel>TEAM</SectionLabel>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <Reveal>
              <EditorialHeading id="team-heading" size="title">
                The team page is coming.
              </EditorialHeading>
              <p className="mt-5 max-w-[42rem] text-[1.0625rem] leading-relaxed text-graphite">
                We would rather leave this blank than fill it with stock portraits. Real profiles
                will appear here as the team grows.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <LinkButton to="/careers" variant="secondary">
                  Open roles
                </LinkButton>
                <LinkButton to="/contact" variant="tertiary" arrow="right">
                  Contact us
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
