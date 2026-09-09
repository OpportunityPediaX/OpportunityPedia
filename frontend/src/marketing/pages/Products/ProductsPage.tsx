import { PageHero } from '@/marketing/components/sections/PageHero';
import { Section } from '@/marketing/components/layout/Section';
import { SectionLabel } from '@/marketing/components/common/SectionLabel';
import { EditorialHeading } from '@/marketing/components/common/EditorialHeading';
import { LinkButton } from '@/marketing/components/common/Button';
import { Reveal } from '@/marketing/components/common/Reveal';
import { ProductCard } from '@/marketing/components/common/ProductCard';
import { OpportunityXMark } from '@/shared/brand/Logo';
import { OpportunityXUI } from '@/marketing/components/visuals/OpportunityXUI';
import { HowItWorks } from '@/marketing/components/sections/HowItWorks';
import { FinalCta } from '@/marketing/components/sections/FinalCta';
import { site } from '@/marketing/data/site';
import { useSeo } from '@/marketing/hooks/useSeo';
import { track } from '@/marketing/lib/analytics';

export default function ProductsPage() {
  useSeo({
    title: 'Products',
    description:
      'Products built around opportunity. OpportunityX is the flagship opportunity intelligence platform from OpportunityPedia, with further intelligence products in development.',
    path: '/products',
  });

  return (
    <>
      <PageHero
        eyebrow="03 / OUR PRODUCTS"
        headline="Products built around opportunity."
        lead="OpportunityPedia builds intelligence products that turn fragmented market signals into structured, actionable opportunity. OpportunityX is the first."
        index={[
          { key: 'Active', value: '1 product' },
          { key: 'In development', value: 'Unannounced' },
        ]}
      />

      {/* Flagship product */}
      <Section divider surface="white" aria-labelledby="flagship-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="label-meta inline-block border border-forest/25 bg-paper px-2.5 py-1.5 text-forest">
                Flagship product
              </p>
              <div className="mt-5">
                <OpportunityXMark tone="default" className="[&>span]:text-[1.75rem]" />
              </div>
              <EditorialHeading id="flagship-heading" size="display" className="mt-6">
                Opportunity intelligence for teams that move first.
              </EditorialHeading>
              <p className="mt-6 max-w-[34rem] text-lead text-graphite">
                Bring vendors, RFPs, leadership signals, hiring activity and other business
                opportunities into one coordinated workflow — discovered, prioritized, owned and
                tracked in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <LinkButton
                  to="/products/opportunityx"
                  size="lg"
                  onClick={() => track('nav_product_click', { surface: 'products_page' })}
                >
                  Explore OpportunityX
                </LinkButton>
                <LinkButton to="/contact" variant="secondary" size="lg">
                  Request access
                </LinkButton>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={100}>
              <div className="bg-navy-deep p-3 md:p-4">
                <OpportunityXUI />
              </div>
              <p className="mt-3 text-xs text-graphite">
                Illustrative interface. Content shown is representative, not live data.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <HowItWorks />

      {/* What's next — no invented products */}
      <Section divider surface="paper" aria-labelledby="whats-next-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionLabel>WHAT&rsquo;S NEXT</SectionLabel>
              <EditorialHeading id="whats-next-heading" size="display" className="mt-6 max-w-[16ch]">
                The roadmap is deliberately unnamed.
              </EditorialHeading>
              <p className="mt-6 max-w-[32rem] text-lead text-graphite">
                We are researching further products in the opportunity intelligence space. We will
                name them when there is something real to use.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="grid gap-px bg-mist sm:grid-cols-2">
              <Reveal className="sm:col-span-2">
                <ProductCard
                  status="Active · Flagship"
                  wordmark={<OpportunityXMark />}
                  description="Opportunity intelligence for teams that move first."
                  action={
                    <LinkButton
                      to={site.opportunityXAppUrl}
                      variant="inverse"
                      arrow="right"
                      className="bg-teal text-navy-deep hover:bg-teal-deep"
                    >
                      Explore
                    </LinkButton>
                  }
                />
              </Reveal>
              {[1, 2].map((slot) => (
                <Reveal key={slot} delay={slot * 80} className="flex">
                  <ProductCard
                    tone="placeholder"
                    status={`Slot ${String(slot).padStart(2, '0')}`}
                    wordmark={
                      <p className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink/40">
                        Future intelligence product
                      </p>
                    }
                    description="In development. Not yet announced."
                    className="w-full"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
