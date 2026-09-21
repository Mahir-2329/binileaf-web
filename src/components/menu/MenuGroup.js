import Reveal from '@/components/ui/Reveal';
import { PriceRow } from '@/components/ui/Primitives';
import { cx } from '@/lib/utils';

/**
 * One category block on the menu card: a rule, the name, an item count, an
 * optional note, then the price rows.
 *
 * Coffee-family groups are ruled in brass, tea-family in leaf, food in plain
 * ink — the bean/leaf split carried through by rule colour alone.
 *
 * `tone` sets the ground: `shade` for a tinted field, `navy` for the one block
 * that is inverted on the card — the Barista Special range, printed as if it
 * were a second plate.
 */

const FAMILY_RULE = {
  bean: 'border-brass',
  leaf: 'border-leaf',
  ink: 'border-ink',
};

export default function MenuGroup({ group, family = 'ink', tone = 'paper' }) {
  // `navy` paints its own ground; `plainNavy` sits on one that is already navy.
  const navy = tone === 'navy';
  const onNavy = navy || tone === 'plainNavy';
  const shade = tone === 'shade';

  return (
    <Reveal
      as="section"
      id={group.id}
      className={cx(
        'scroll-mt-[calc(var(--header-h)+var(--rail-h)+16px)]',
        shade && 'relative',
        navy && 'on-navy grain-dark bg-ink-deep px-5 pb-6 pt-5 text-paper'
      )}
    >
      {shade ? (
        <span
          className="absolute -inset-x-[var(--spacing-gutter)] -inset-y-6 -z-10 bg-paper-shade md:-inset-x-6 md:-inset-y-8"
          aria-hidden="true"
        />
      ) : null}

      <div className={cx('border-t pt-4', onNavy ? 'border-brass' : FAMILY_RULE[family])}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className={cx('t-h3', !onNavy && 'letterpress')}>{group.title}</h2>
          <span className="sec-meta">
            {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {group.note ? (
          <p
            className={cx(
              't-small mt-3 max-w-[54ch] italic',
              onNavy ? 'text-paper-dim' : 'text-pencil'
            )}
          >
            {group.note}
          </p>
        ) : null}
      </div>

      <ul className="mt-3">
        {group.items.map((item) => (
          <PriceRow
            key={item.name}
            name={item.name}
            price={item.price}
            description={item.note}
            star={item.star}
            tone={onNavy ? 'navy' : undefined}
          />
        ))}
      </ul>
    </Reveal>
  );
}
