import { Container } from '@/marketing/components/layout/Container';
import { LinkButton } from '@/marketing/components/common/Button';
import { SectionLabel } from '@/marketing/components/common/SectionLabel';
import { EditorialHeading } from '@/marketing/components/common/EditorialHeading';
import { SignalIndex } from '@/marketing/components/brand/SignalIndex';
import { OpportunityAtlas } from '@/marketing/components/visuals/OpportunityAtlas';
import { site } from '@/marketing/data/site';
import { track } from '@/marketing/lib/analytics';

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* Structured field rather than a gradient wash */}
      <div
        aria-hidden="true"
        className="field-grid pointer-events-none absolute inset-0 opacity-[0.55] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"
      />

      <Container width="wide" className="relative">
        <div className="grid items-center gap-12 pt-12 pb-16 md:pt-16 md:pb-20 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-14 lg:pt-20 lg:pb-24">
          <div className="max-w-[36rem]">
            <SectionLabel>OPPORTUNITY INTELLIGENCE COMPANY</SectionLabel>

            <EditorialHeading
              as="h1"
              size="hero"
              id="hero-heading"
              className="mt-6 text-balance md:mt-7"
            >
              We make opportunity easier to see.
            </EditorialHeading>

            <p className="mt-6 max-w-[34rem] text-lead text-graphite md:mt-7">
              {site.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-9">
              <LinkButton
                to={site.opportunityXAppUrl}
                size="lg"
                onClick={() => track('hero_opportunityx_click')}
              >
                Explore OpportunityX
              </LinkButton>
              <LinkButton to="/#approach" variant="secondary" size="lg">
                Our approach
              </LinkButton>
            </div>

            <p className="label-meta mt-6 text-graphite/70">Discover. Understand. Act.</p>

            <p className="mt-8 max-w-[28rem] border-t border-mist pt-5 text-sm text-graphite">
              Built for teams that need to move before the opportunity disappears.
            </p>
          </div>

          <div className="lg:pl-4">
            <OpportunityAtlas />
            <SignalIndex
              className="mt-5 justify-between border-t border-mist pt-4"
              entries={[
                { key: 'View', value: 'Clarity at work' },
                { key: 'Scene', value: '01' },
                { key: 'Mode', value: 'Illustrative' },
              ]}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
