import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import { CropMarks, SectionHeader } from '@/components/ui/Primitives';
import { GhostLink } from '@/components/ui/Button';
import DrinksCarousel from './DrinksCarousel';
import { frameStyle } from '@/lib/frame';

/**
 * The visual peak of the home page: the six drinks that exist nowhere else,
 * inverted onto navy so the page has one dark plate between the hero and the
 * end. An even three-across grid on desktop, the coverflow carousel on a
 * phone — the same treatment the menu page gives them, so the two agree.
 *
 * The food line at the foot is deliberate: the kitchen deserves a mention, not
 * a section of its own on a page this short.
 *
 * The photographs come from `media_placements` — slots `home.signature.1..6` —
 * so they are swappable from the admin.
 */
const ITEMS = [
  {
    name: 'Golden Drift',
    note: 'The one the baristas put their name on.',
  },
  {
    name: 'Coconut Matcha',
    note: 'Matcha over coconut, layered and not stirred.',
  },
  {
    name: 'Watermelon Tonic Matcha',
    note: 'Matcha, tonic and watermelon. It should not work.',
  },
  {
    name: 'Tonic Espresso',
    note: 'A double shot dropped into cold tonic.',
  },
  {
    name: 'Barrelage Brew',
    note: 'Slow, dark and served in a ribbed tumbler.',
  },
  {
    name: 'Tote Mocktail',
    note: 'Arrives in a clear tote bag. Built for a table.',
  },
];

export default function Signature({ placements }) {
  return (
    <section className="on-navy grain-dark bg-ink-deep text-paper">
      <div className="shell section">
        <Reveal>
          <SectionHeader
            title="Six drinks, built here."
            deck="Not on any other menu in the city. If you order one thing off the card, order from this list."
            meta="Barista Special"
            action={
              <GhostLink href="/menu#barista-special" tone="paper">
                See all six
              </GhostLink>
            }
          />
        </Reveal>

        <div className="mt-12 md:hidden">
          <DrinksCarousel
            items={ITEMS.map((item, i) => ({
              ...item,
              image: placements[`home.signature.${i + 1}`].src,
            }))}
            tone="navy"
          />
        </div>

        <ul className="mt-16 hidden gap-x-[var(--spacing-grid)] gap-y-14 md:grid md:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <Reveal as="li" key={item.name} delay={(i % 3) * 70}>
              <Link href="/menu#barista-special" className="group flex h-full flex-col">
                <div className="crop crop--brass relative">
                  <div className="photo aspect-[4/5]">
                    <Image
                      src={placements[`home.signature.${i + 1}`].src}
                      alt={`${item.name} at Binileaf Café`}
                      width={1444}
                      height={1805}
                      sizes="(max-width: 1024px) 46vw, 30vw"
                      style={frameStyle(placements[`home.signature.${i + 1}`])}
                    />
                  </div>
                  <CropMarks tone="brass" />
                </div>

                <h3 className="t-h3 mt-6 border-t border-brass pt-5">{item.name}</h3>
                <p className="t-small mt-2 italic text-paper-dim">{item.note}</p>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-16 border-t border-ink-wash pt-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
            <p className="t-body max-w-[52ch] italic text-paper-dim">
              There is a kitchen too — pizza, loaded sandwiches, pasta and the fries people keep
              coming back for. All of it vegetarian, all of it until closing.
            </p>
            <GhostLink href="/menu#pizza" tone="paper">
              The food
            </GhostLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
