import { cx } from '@/lib/utils';

/**
 * A running offer, printed as the second ink.
 *
 * Same band the add-on interruption uses, because it is the same gesture: one
 * full-bleed plate of stamp red that breaks the paper rhythm exactly once. It
 * renders only when the admin has an offer live, so an ordinary week shows
 * nothing at all — which is the point of a second plate.
 */

/** "20% off", "₹50 off", or nothing when the offer is just an announcement. */
function valueLabel(offer) {
  if (offer.value_type === 'percent' && offer.value) return `${offer.value}% off`;
  if (offer.value_type === 'flat' && offer.value) return `₹${offer.value} off`;
  return null;
}

export default function OfferBand({ offer, compact = false }) {
  if (!offer) return null;

  const value = valueLabel(offer);

  return (
    <section
      className={cx(
        'bg-stamp text-paper',
        compact ? 'py-[clamp(1.75rem,3.5vw,2.75rem)]' : 'py-[clamp(2.5rem,5vw,4rem)]'
      )}
      aria-label="Current offer"
    >
      <div className="shell">
        <div className="grid-page items-end gap-y-6">
          <div className="col-span-full lg:col-span-6">
            {value ? <p className="t-label text-paper/75">{value}</p> : null}
            <h2 className={cx('mt-3', compact ? 't-h3' : 't-h2')}>{offer.title}</h2>
            {offer.subtitle ? (
              <p className="t-label mt-4 text-paper/75">{offer.subtitle}</p>
            ) : null}
          </div>

          <div className="col-span-full lg:col-span-5 lg:col-start-8">
            {offer.body ? (
              <p className="t-body italic text-paper/85">{offer.body}</p>
            ) : null}

            {offer.code ? (
              <p className="t-label mt-5 inline-block border border-paper/45 px-3 py-2">
                Mention “{offer.code}”
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
