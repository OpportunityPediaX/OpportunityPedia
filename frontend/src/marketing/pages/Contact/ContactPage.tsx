import { Section } from '@/marketing/components/layout/Section';
import { Container } from '@/marketing/components/layout/Container';
import { SectionLabel } from '@/marketing/components/common/SectionLabel';
import { EditorialHeading } from '@/marketing/components/common/EditorialHeading';
import { ContactForm } from '@/marketing/components/common/ContactForm';
import { Reveal } from '@/marketing/components/common/Reveal';
import { SignalIndex } from '@/marketing/components/brand/SignalIndex';
import { useSeo } from '@/marketing/hooks/useSeo';

const routes = [
  { title: 'Product inquiry', body: 'You want to use OpportunityX or see it properly.' },
  { title: 'Partnership', body: 'You build something adjacent and see an overlap.' },
  { title: 'Data partnership', body: 'You hold a source that belongs in an opportunity index.' },
  { title: 'Press', body: 'You are writing about the category or the company.' },
  { title: 'Careers', body: 'You want to work on this. Tell us what you would build.' },
] as const;

export default function ContactPage() {
  useSeo({
    title: 'Contact',
    description:
      'Talk to OpportunityPedia about OpportunityX, partnerships, data partnerships, press or careers.',
    path: '/contact',
  });

  return (
    <>
      <section className="relative overflow-hidden bg-paper">
        <div
          aria-hidden="true"
          className="field-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        <Container width="wide" className="relative">
          <div className="grid gap-12 pt-12 pb-16 md:pt-16 md:pb-20 lg:grid-cols-12 lg:gap-10 lg:pt-20">
            <div className="lg:col-span-5">
              <SectionLabel>CONTACT</SectionLabel>
              <EditorialHeading as="h1" size="hero" className="mt-6 md:mt-7">
                Let&rsquo;s talk about opportunity.
              </EditorialHeading>
              <p className="mt-6 max-w-[34rem] text-lead text-graphite md:mt-7">
                Tell us what you are trying to find and how your team looks for it today. That is
                usually the most useful place to start.
              </p>

              <dl className="mt-10 border-t border-mist">
                {routes.map((route) => (
                  <div
                    key={route.title}
                    className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-4 border-b border-mist py-4"
                  >
                    <dt className="text-[0.9375rem] font-medium text-ink">{route.title}</dt>
                    <dd className="text-sm leading-relaxed text-graphite">{route.body}</dd>
                  </div>
                ))}
              </dl>

              <SignalIndex
                className="mt-8"
                layout="stack"
                entries={[
                  { key: 'Response', value: 'Every message is read' },
                  { key: 'Company', value: 'OpportunityPedia' },
                ]}
              />
            </div>

            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      <Section divider surface="white" spacing="tight" aria-labelledby="contact-note-heading">
        <div className="max-w-[46rem]">
          <Reveal>
            <h2 id="contact-note-heading" className="text-title font-semibold">
              What happens to this message
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-graphite">
              This form is not yet connected to a backend. Submissions are validated in the browser
              and acknowledged locally so the flow can be reviewed end to end — nothing is stored or
              emailed until the endpoint is wired up.
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
