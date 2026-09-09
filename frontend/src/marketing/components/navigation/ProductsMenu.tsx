import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { OpportunityXMark } from '@/shared/brand/Logo';
import { SignalIndex } from '@/marketing/components/brand/SignalIndex';
import { track } from '@/marketing/lib/analytics';

type ProductsMenuProps = {
  id: string;
  onDismiss: () => void;
};

/**
 * Products mega menu. Only the one real product is listed — future products
 * are acknowledged as in development rather than invented.
 */
export function ProductsMenu({ id, onDismiss }: ProductsMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onDismiss]);

  return (
    <div
      id={id}
      ref={panelRef}
      className="absolute top-full left-0 w-[min(38rem,calc(100vw-3rem))] pt-3"
    >
      <div className="border border-mist bg-white shadow-[0_16px_40px_-28px_rgba(17,24,39,0.28)]">
        <Link
          to="/products/opportunityx"
          onClick={() => {
            track('nav_product_click', { product: 'opportunityx' });
            onDismiss();
          }}
          className="group block border-b border-mist p-6 transition-colors hover:bg-paper focus-visible:bg-paper"
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <OpportunityXMark tone="default" className="[&>span]:text-[1.25rem]" />
              <p className="mt-2.5 max-w-sm text-[0.9375rem] leading-relaxed text-graphite">
                Opportunity intelligence for teams that move first.
              </p>
            </div>
            <span className="label-meta shrink-0 border border-forest/25 bg-forest/[0.06] px-2 py-1 text-forest">
              Flagship
            </span>
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-forest">
            Explore OpportunityX
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-paper px-6 py-4">
          <p className="text-sm text-graphite">
            More products from OpportunityPedia are in development.
          </p>
          <SignalIndex entries={[{ key: 'Status', value: 'Research' }]} />
        </div>
      </div>
    </div>
  );
}
