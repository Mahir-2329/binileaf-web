import { cx, rupees } from '@/lib/utils';
import SpecialMark from './SpecialMark';

/* ─────────────────────────────────────────────────────────── the price ──── */

/**
 * The rupee sign is set in the UI face at 0.72em in pencil; the numeral is
 * Fraunces in full ink with tabular figures. It is a signature detail, so it
 * gets a component rather than being retyped.
 */
export function Rupee({ amount, tone, className }) {
  return (
    <span className={cx('price', tone === 'brass' && 'price--brass', className)}>
      <span className="price__sign" aria-hidden="true">
        ₹
      </span>
      <span className="price__value">{rupees(amount)}</span>
      <span className="sr-only">rupees</span>
    </span>
  );
}

/** The FSSAI vegetarian mark. Every item on this menu is vegetarian. */
export function VegMark({ className }) {
  return <span className={cx('veg-mark', className)} role="img" aria-label="Vegetarian" />;
}

/**
 * One line of a menu: mark, name, leader dots, price. The most-used component
 * in the build — everything else is arranged around it.
 */
export function PriceRow({ name, price, description, flag, star, tone, className }) {
  return (
    <li className={cx('price-row', className)}>
      <VegMark />

      <div>
        <div className="price-row__line">
          <span className="price-row__name">{name}</span>
          {star ? (
            <SpecialMark
              size={14}
              className={cx('ml-[6px]', tone === 'navy' ? 'text-brass' : 'text-stamp')}
            />
          ) : null}
          {flag ? <span className="flag">{flag}</span> : null}

          {price == null ? null : (
            <>
              <span className="leaders" aria-hidden="true" />
              <Rupee amount={price} tone={tone === 'navy' ? 'brass' : undefined} />
            </>
          )}
        </div>
        {description ? <p className="price-row__desc">{description}</p> : null}
      </div>
    </li>
  );
}

/* ─────────────────────────────────────────────────────────────── marks ──── */

/** Four L-shaped registration ticks. Wrap anything with `.crop`. */
export function CropMarks({ tone }) {
  return (
    <>
      <span className={cx('crop__mark crop__mark--tl', tone === 'brass' && 'crop--brass')} aria-hidden="true" />
      <span className={cx('crop__mark crop__mark--tr', tone === 'brass' && 'crop--brass')} aria-hidden="true" />
      <span className={cx('crop__mark crop__mark--bl', tone === 'brass' && 'crop--brass')} aria-hidden="true" />
      <span className={cx('crop__mark crop__mark--br', tone === 'brass' && 'crop--brass')} aria-hidden="true" />
    </>
  );
}

/** A circular rubber stamp with dry-ink breakup. Max three per page. */
export function Stamp({ lines, tone, size = 'md', className, style }) {
  return (
    <span
      className={cx(
        'stamp-badge',
        tone === 'brass' && 'stamp-badge--brass',
        tone === 'paper' && 'stamp-badge--paper',
        size === 'sm' && 'stamp-badge--sm',
        className
      )}
      style={style}
    >
      <span>
        {lines.map((line, i) => (
          <span key={line} className="block">
            {line}
            {i < lines.length - 1 ? null : null}
          </span>
        ))}
      </span>
    </span>
  );
}

/* ──────────────────────────────────────────────────── section headers ──── */

/**
 * Every section on the site opens with this: a stamp-red number, a rule that
 * draws itself left-to-right on reveal, optional right-aligned meta, then the
 * heading with its deck baseline-aligned beside it.
 */
export function SectionHeader({
  number,
  title,
  deck,
  meta,
  action,
  id,
  className,
  headingClassName,
}) {
  return (
    <header className={cx('grid-page', className)} id={id}>
      <div className="col-span-full flex items-center gap-4">
        {number ? <span className="sec-num">{number}</span> : null}
        <span className="sec-rule" />
        {meta ? <span className="sec-meta">{meta}</span> : null}
      </div>

      <h2
        className={cx('t-h2 letterpress col-span-full mt-7 lg:col-span-6', headingClassName)}
      >
        {title}
      </h2>

      {deck ? (
        <div className="col-span-full mt-4 max-w-[46ch] lg:col-span-5 lg:col-start-8 lg:mt-7 lg:self-end">
          <p className="sec-deck t-lede italic">{deck}</p>
          {action ? <div className="mt-6">{action}</div> : null}
        </div>
      ) : null}
    </header>
  );
}

/* ───────────────────────────────────────────────────────────── labels ──── */

export function Eyebrow({ children, tone = 'stamp', className }) {
  const tones = {
    stamp: 'text-stamp',
    brass: 'text-brass',
    leaf: 'text-leaf',
    pencil: 'text-pencil',
    dim: 'text-paper-dim',
  };
  return <p className={cx('t-label', tones[tone], className)}>{children}</p>;
}
