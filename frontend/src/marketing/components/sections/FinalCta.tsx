import { Container } from '@/marketing/components/layout/Container';
import { EditorialHeading } from '@/marketing/components/common/EditorialHeading';
import { LinkButton } from '@/marketing/components/common/Button';
import { Reveal } from '@/marketing/components/common/Reveal';
import { SignalIndex } from '@/marketing/components/brand/SignalIndex';
import { site } from '@/marketing/data/site';
import { track } from '@/marketing/lib/analytics';

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-heading" className="relative overflow-hidden bg-forest">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <Container className="relative py-section">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <Reveal>
              <EditorialHeading
                id="final-cta-heading"
                size="display"
                className="max-w-[20ch] text-white"
              >
                Opportunity is already out there.{' '}
                <span className="text-white/55">We help make it visible.</span>
              </EditorialHeading>
              <p className="mt-7 max-w-[34rem] text-lead text-white/65">
                Explore the first product from OpportunityPedia.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal delay={100}>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                <LinkButton
                  to={site.opportunityXAppUrl}
                  variant="inverse"
                  size="lg"
                  onClick={() => track('nav_product_click', { surface: 'final_cta' })}
                >
                  Explore OpportunityX
                </LinkButton>
                <LinkButton
                  to="/contact"
                  variant="inverse-outline"
                  size="lg"
                  onClick={() => track('cta_talk_to_us_click', { surface: 'final_cta' })}
                >
                  Talk to us
                </LinkButton>
              </div>
              <SignalIndex
                tone="inverse"
                layout="stack"
                className="mt-8 border-t border-white/15 pt-5"
                entries={[
                  { key: 'Company', value: 'OpportunityPedia' },
                  { key: 'Flagship', value: 'OpportunityX' },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
