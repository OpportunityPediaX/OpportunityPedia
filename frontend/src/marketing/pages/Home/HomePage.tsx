import { Hero } from '@/marketing/components/sections/Hero';
import { Thesis } from '@/marketing/components/sections/Thesis';
import { Problem } from '@/marketing/components/sections/Problem';
import { Transformation } from '@/marketing/components/sections/Transformation';
import { Approach } from '@/marketing/components/sections/Approach';
import { IntelligenceEngine } from '@/marketing/components/sections/IntelligenceEngine';
import { SignalCategories } from '@/marketing/components/sections/SignalCategories';
import { ProductShowcase } from '@/marketing/components/sections/ProductShowcase';
import { HowItWorks } from '@/marketing/components/sections/HowItWorks';
import { BenefitGrid } from '@/marketing/components/sections/BenefitGrid';
import { WhoWeBuildFor } from '@/marketing/components/sections/WhoWeBuildFor';
import { Philosophy } from '@/marketing/components/sections/Philosophy';
import { Credibility } from '@/marketing/components/sections/Credibility';
import { FutureEcosystem } from '@/marketing/components/sections/FutureEcosystem';
import { DataResponsibility } from '@/marketing/components/sections/DataResponsibility';
import { CompanyNote } from '@/marketing/components/sections/CompanyNote';
import { FinalCta } from '@/marketing/components/sections/FinalCta';
import { useSeo } from '@/marketing/hooks/useSeo';

/**
 * Homepage story arc:
 *
 *   fragmented opportunity → manual research is inefficient → Opportunity
 *   Pedia organizes it → OpportunityX is the first product → here is how it
 *   works → here is how we think → here is where the company is going.
 */
export function HomePage() {
  useSeo({
    title: 'OpportunityPedia — Opportunity Intelligence Products',
    description:
      'OpportunityPedia builds intelligence products that turn fragmented market signals into clear opportunities for action. Meet OpportunityX, our flagship opportunity intelligence platform.',
    path: '/',
  });

  return (
    <>
      <Hero />
      <Thesis />
      <Problem />
      <Transformation />
      <Approach />
      <IntelligenceEngine />
      <ProductShowcase />
      <HowItWorks />
      <BenefitGrid />
      <SignalCategories />
      <WhoWeBuildFor />
      <Philosophy />
      <Credibility />
      <FutureEcosystem />
      <DataResponsibility />
      <CompanyNote />
      <FinalCta />
    </>
  );
}
