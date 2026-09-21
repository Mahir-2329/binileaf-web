import { cx } from '@/lib/utils';

/**
 * The house-special mark — the cat-and-cup from the printed card, used exactly
 * as the card uses it: a small glyph beside the item, explained once by a
 * legend at the foot of the page.
 *
 * The artwork is a white-on-transparent PNG, so it is used as a CSS mask and
 * filled with `currentColor`; one file serves every ink. The file itself comes
 * from `--mask-mark`, set on `<html>`, because media URLs are opaque tokens
 * minted on the server.
 *
 * `size` is the glyph's **height**, because that is what has to agree with the
 * text it sits next to — the width follows from the artwork.
 */

const ASPECT = 405 / 588; // width ÷ height of the trimmed artwork

export default function SpecialMark({ size = 14, className, title = 'Binileaf Special' }) {
  return (
    <span
      role="img"
      aria-label={title}
      className={cx('inline-block shrink-0 bg-current align-[-0.12em]', className)}
      style={{
        height: size,
        width: Math.round(size * ASPECT),
        WebkitMaskImage: 'var(--mask-mark)',
        maskImage: 'var(--mask-mark)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  );
}

/** The line that explains the glyph. One per page, at the foot. */
export function SpecialLegend({ className, tone = 'ink' }) {
  return (
    <p
      className={cx(
        't-label flex items-center gap-2',
        tone === 'paper' ? 'text-paper-dim' : 'text-pencil',
        className
      )}
    >
      <SpecialMark size={18} className={tone === 'paper' ? 'text-brass' : 'text-stamp'} />
      = Binileaf Special · Must try
    </p>
  );
}
