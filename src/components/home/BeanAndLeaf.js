import { GhostLink } from '@/components/ui/Button';
import { CoffeeSack, HandWithCup } from '@/components/art/Illustrations';
import Reveal from '@/components/ui/Reveal';
import { cx } from '@/lib/utils';

/**
 * The one symmetric section on the site, and it is symmetric on purpose: the
 * founding argument, settled by serving both sides equally. A single vertical
 * rule runs past the content at both ends on desktop; on a phone it turns 90°
 * into a full-bleed horizontal rule between the halves, and the two halves
 * mirror each other across it.
 *
 * No prices here. The card is where prices live; this is the argument.
 */

function Half({ eyebrow, eyebrowTone, title, body, mark, markSide, href, linkLabel }) {
  return (
    <div>
      <p className={cx('t-label', eyebrowTone)}>{eyebrow}</p>
      <h3 className="t-h2 letterpress mt-5">{title}</h3>

      <p className="t-body mt-6 max-w-[38ch] text-pencil">{body}</p>

      <div className={cx('mt-10', markSide === 'right' && 'flex justify-end md:justify-start')}>
        {mark}
      </div>

      <GhostLink href={href} className="mt-10">
        {linkLabel}
      </GhostLink>
    </div>
  );
}

export default function BeanAndLeaf() {
  return (
    <section className="section shell overflow-x-clip">
      <Reveal className="relative">
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-x-[clamp(2rem,6vw,5rem)]">
          <Half
            eyebrow="The bean"
            eyebrowTone="text-brass"
            title="Pulled, not rushed."
            body="Beans bought direct and roasted for us, ground when you order and pulled while you wait. Espresso through to a frappe that takes its time."
            mark={<CoffeeSack size={96} className="text-brass" />}
            markSide="right"
            href="/menu#hot-coffee"
            linkLabel="All coffee"
          />

          {/* The desktop centre rule, turned 90° — same gesture, one column. */}
          <span className="bleed my-14 block h-px bg-ink md:hidden" aria-hidden="true" />

          <Half
            eyebrow="The leaf"
            eyebrowTone="text-leaf"
            title="Poured, not hurried."
            body="Masala chai made the way it is made at home, adrak and mint when the evening calls for it, and lemonades shaken to order."
            mark={<HandWithCup size={96} className="text-leaf" />}
            markSide="left"
            href="/menu#tea"
            linkLabel="All tea"
          />
        </div>

        {/* Extended 40px past the content at both ends, as a rule on a card is. */}
        <span
          className="pointer-events-none absolute left-1/2 hidden w-px bg-ink md:block"
          style={{ top: -40, bottom: -40 }}
          aria-hidden="true"
        />
      </Reveal>
    </section>
  );
}
