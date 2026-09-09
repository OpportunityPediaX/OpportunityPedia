import { Link } from 'react-router-dom';
import { cn } from '@/shared/cn';
import markDark from '@/shared/brand/mark.png';
import markLight from '@/shared/brand/mark-light.png';

/** Intrinsic size of the generated artwork, used to reserve layout space. */
const MARK_W = 160;
const MARK_H = 192;

/**
 * BrandMark — the official OpportunityPedia mark.
 *
 * The source artwork shipped as opaque RGB on a white field; `scripts/logo-build.mjs`
 * keys out that white, trims to the artwork and writes the two tones used here.
 * Re-run it if the source file is ever replaced.
 *
 * The mark is taller than it is wide, so it is sized by height and left to
 * find its own width — never forced into a square box.
 */
export function BrandMark({
  className,
  tone = 'default',
  alt = '',
}: {
  className?: string;
  /** `inverse` swaps the navy for paper so the mark survives dark surfaces. */
  tone?: 'default' | 'inverse';
  /** Leave empty when an ancestor already names the logo. */
  alt?: string;
}) {
  return (
    <img
      src={tone === 'inverse' ? markLight : markDark}
      width={MARK_W}
      height={MARK_H}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      className={cn('h-7 w-auto shrink-0 select-none', className)}
    />
  );
}

type LogoProps = {
  className?: string;
  tone?: 'default' | 'inverse';
  /** `mark` hides the wordmark for tight spaces. */
  variant?: 'full' | 'mark';
  /** Renders as a home link with an accessible name. */
  asLink?: boolean;
};

/**
 * Logo lockup: mark + wordmark over the OpportunityX endorsement line.
 *
 * The sizes are tuned to measured metrics, so change them together: with
 * leading collapsed the 17px wordmark, 3px gap and 10px endorsement stack to
 * exactly the mark's 30px, and the endorsement's glyph run lands at ~88% of
 * the wordmark's so the block tapers. Widths within a few pixels of each
 * other are worse than either extreme — they read as a missed alignment
 * rather than a deliberate one. The mark then overshoots cap-height slightly
 * more at the top than the baseline does at the bottom, which is what keeps
 * it visually level with the heavier first line.
 */
export function Logo({ className, tone = 'default', variant = 'full', asLink = true }: LogoProps) {
  const inverse = tone === 'inverse';

  const inner = (
    <span className={cn('inline-flex items-center gap-[0.5625rem]', className)}>
      <BrandMark tone={tone} className="h-[1.875rem]" />
      {variant === 'full' ? (
        <span className="flex flex-col justify-center gap-[0.1875rem]">
          <span
            className={cn(
              'text-[1.0625rem] leading-none font-semibold tracking-[-0.022em] whitespace-nowrap',
              inverse ? 'text-white' : 'text-ink',
            )}
          >
            OpportunityPedia
          </span>
          <span
            className={cn(
              'text-[0.625rem] leading-none tracking-[-0.005em] whitespace-nowrap',
              inverse ? 'text-white/55' : 'text-graphite',
            )}
          >
            Powered by{' '}
            <span className={cn('font-medium', inverse ? 'text-white/80' : 'text-ink/75')}>
              Opportunity<span className={inverse ? 'text-teal' : 'text-teal-ink'}>X</span>
            </span>
          </span>
        </span>
      ) : null}
    </span>
  );

  if (!asLink) return inner;

  return (
    <Link
      to="/"
      aria-label="OpportunityPedia — home"
      className="inline-flex rounded-sm"
    >
      {inner}
    </Link>
  );
}

/**
 * OpportunityX product wordmark. The product carries navy + teal, distinct
 * from the parent company's forest identity.
 */
export function OpportunityXMark({
  className,
  tone = 'inverse',
}: {
  className?: string;
  tone?: 'default' | 'inverse';
}) {
  return (
    <span className={cn('inline-flex items-baseline gap-[1px]', className)}>
      <span
        className={cn(
          'text-[1.375rem] leading-none font-semibold tracking-[-0.03em]',
          tone === 'inverse' ? 'text-white' : 'text-navy',
        )}
      >
        Opportunity
      </span>
      <span
        className={cn(
          'text-[1.375rem] leading-none font-semibold tracking-[-0.03em]',
          tone === 'inverse' ? 'text-teal' : 'text-teal-ink',
        )}
      >
        X
      </span>
    </span>
  );
}
