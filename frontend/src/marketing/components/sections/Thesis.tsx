import { Section } from '@/marketing/components/layout/Section';
import { SectionLabel } from '@/marketing/components/common/SectionLabel';
import { EditorialHeading, SerifAccent } from '@/marketing/components/common/EditorialHeading';
import { Reveal } from '@/marketing/components/common/Reveal';

/**
 * Editorial break after the hero. Deliberately close to a printed page:
 * one index marker, one statement, two paragraphs, a lot of air.
 */
export function Thesis() {
  return (
    <Section divider surface="paper" aria-labelledby="thesis-heading">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <Reveal>
            <SectionLabel index="01">WHY WE EXIST</SectionLabel>
          </Reveal>
        </div>

        <div className="lg:col-span-9 lg:pr-12">
          <Reveal>
            <EditorialHeading id="thesis-heading" size="display" className="max-w-[26ch]">
              There is more information than ever.{' '}
              <span className="text-graphite/80">
                Finding what <SerifAccent>matters</SerifAccent> has only become harder.
              </span>
            </EditorialHeading>
          </Reveal>

          <div className="mt-10 grid gap-8 border-t border-mist pt-8 md:grid-cols-2 md:gap-12 lg:mt-14 lg:pt-10">
            <Reveal delay={80}>
              <p className="text-lead text-graphite">
                Businesses search through dozens of websites, portals and information sources every
                day trying to identify their next customer, vendor, partnership, RFP or market
                opportunity.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-lead text-graphite">
                OpportunityPedia is building the intelligence layer that connects those signals —
                so the work of finding what matters stops being manual.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
