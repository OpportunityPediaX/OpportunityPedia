import { PageHero } from '@/marketing/components/sections/PageHero';
import { Section } from '@/marketing/components/layout/Section';
import { Container } from '@/marketing/components/layout/Container';
import { SectionLabel } from '@/marketing/components/common/SectionLabel';
import { EditorialHeading } from '@/marketing/components/common/EditorialHeading';
import { LinkButton } from '@/marketing/components/common/Button';
import { Reveal } from '@/marketing/components/common/Reveal';
import { SignalBadge } from '@/marketing/components/common/SignalBadge';
import { SignalIndex } from '@/marketing/components/brand/SignalIndex';
import { OpportunityXMark } from '@/shared/brand/Logo';
import { ProductInteractionPreview } from '@/marketing/components/visuals/ProductInteractionPreview';
import { TeamCoordination } from '@/marketing/components/sections/TeamCoordination';
import { HowItWorks } from '@/marketing/components/sections/HowItWorks';
import { BenefitGrid } from '@/marketing/components/sections/BenefitGrid';
import { SignalCategories } from '@/marketing/components/sections/SignalCategories';
import { FinalCta } from '@/marketing/components/sections/FinalCta';
import { temperatureDefinitions } from '@/marketing/data/content';
import { useSeo } from '@/marketing/hooks/useSeo';
import { track } from '@/marketing/lib/analytics';

export default function OpportunityXPage() {
  useSeo({
    title: 'OpportunityX — Opportunity intelligence platform',
    description:
      'OpportunityX brings vendors, RFPs, leadership signals, hiring activity and other business opportunities into one coordinated workflow. The flagship product from OpportunityPedia.',
    path: '/products/opportunityx',
  });

  return (
    <>
      <PageHero
        surface="navy"
        eyebrow="OPPORTUNITYX"
        headline="Find the opportunity before everyone finds the listing."
        lead="Bring vendors, RFPs, leadership signals, hiring activity and other business opportunities into one coordinated workflow."
        actions={
          <>
            <LinkButton
              to="/contact"
              size="lg"
              className="bg-teal text-navy-deep hover:bg-teal-deep"
              onClick={() => track('cta_talk_to_us_click', { surface: 'opportunityx_hero' })}
            >
              Request access
            </LinkButton>
            <LinkButton to="#how-it-works" variant="inverse-outline" size="lg">
              See how it works
            </LinkButton>
          </>
        }
        index={[
          { key: 'Product', value: 'OpportunityX' },
          { key: 'By', value: 'OpportunityPedia' },
          { key: 'Status', value: 'Flagship' },
        ]}
      />

      {/* Product stage */}
      <section className="op-stage border-t border-white/10 bg-navy-deep py-14 md:py-20">
        <Container width="wide">
          <Reveal>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <OpportunityXMark className="[&>span]:text-[1.125rem]" />
                <span aria-hidden="true" className="text-white/20">
                  /
                </span>
                <p className="label-meta text-white/45">Product walkthrough</p>
              </div>
              <SignalIndex tone="inverse" entries={[{ key: 'Data', value: 'Illustrative' }]} />
            </div>
            <ProductInteractionPreview />
          </Reveal>
        </Container>
      </section>

      {/* Temperature classes */}
      <Section id="temperature" divider surface="paper" aria-labelledby="temperature-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel>PRIORITIZATION</SectionLabel>
              <EditorialHeading
                id="temperature-heading"
                size="display"
                className="mt-6 max-w-[18ch]"
              >
                Not everything is urgent.
              </EditorialHeading>
              <p className="mt-6 max-w-[32rem] text-lead text-graphite">
                Opportunities are classified into four bands so a queue can be worked in a sensible
                order. Most signals do not belong in Very Hot, and treating them as if they did is
                how teams stop trusting a system.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <dl className="border-t border-mist">
              {temperatureDefinitions.map((definition, i) => (
                <Reveal
                  key={definition.temperature}
                  delay={i * 80}
                  className="border-b border-mist py-6 md:grid md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8"
                >
                  <dt className="pt-0.5">
                    <SignalBadge temperature={definition.temperature} />
                  </dt>
                  <dd className="mt-4 md:mt-0">
                    <p className="text-[1.0625rem] leading-relaxed text-ink">
                      {definition.summary}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5">
                      {definition.examples.map((example, index) => (
                        <li key={example} className="text-sm text-graphite">
                          {example}
                          {index < definition.examples.length - 1 ? (
                            <span aria-hidden="true" className="ml-2 text-mist">
                              ·
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <TeamCoordination />

      <div id="how-it-works">
        <HowItWorks />
      </div>

      <BenefitGrid />
      <SignalCategories />

      {/* Access */}
      <Section divider surface="paper" aria-labelledby="access-heading">
        <div className="max-w-[42rem]">
          <Reveal>
            <SectionLabel>ACCESS</SectionLabel>
            <EditorialHeading id="access-heading" size="display" className="mt-6">
              Talk to us about early access.
            </EditorialHeading>
            <p className="mt-6 text-lead text-graphite">
              OpportunityX is being built with a small number of teams. There is no self-serve
              signup and no free trial today — tell us how your team finds opportunities now and we
              will follow up directly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <LinkButton to="/contact" size="lg">
                Request access
              </LinkButton>
              <LinkButton to="/company" variant="secondary" size="lg">
                About OpportunityPedia
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
