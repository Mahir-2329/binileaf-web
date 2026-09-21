import AddOnBand from '@/components/home/AddOnBand';
import OfferBand from '@/components/home/OfferBand';
import MenuBrowser from '@/components/menu/MenuBrowser';
import Reveal from '@/components/ui/Reveal';
import { GhostLink } from '@/components/ui/Button';
import JsonLd from '@/components/seo/JsonLd';
import { CoffeeSack } from '@/components/art/Illustrations';

import { getLiveOffers, getMenuMeta } from '@/server/repo';
import { pageMeta, menuSchema, breadcrumbSchema } from '@/lib/seo';
import { contact } from '@/data/site';

/**
 * Rebuilt on demand when the admin writes (see /api/revalidate); this window
 * is only the safety net for a ping that never arrived.
 */
export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Menu',
  description:
    'The full Binileaf Café menu with prices — hot coffee from ₹120, masala chai from ₹60, lemonades, cold coffee, ice teas, thick shakes, mocktails, the Barista Special range, pizza, sandwiches, pasta and dessert.',
  path: '/menu',
});

export default async function MenuPage() {
  const [{ menu }, offers] = await Promise.all([getMenuMeta(), getLiveOffers('menu_top')]);

  const columns = menu.filter((section) => section.id !== 'barista');
  const barista = menu.find((section) => section.id === 'barista') ?? null;

  const railGroups = menu
    .flatMap((section) => section.groups)
    .filter((group) => group.id !== 'add-ons')
    .map(({ id, title }) => ({ id, title }));

  return (
    <>
      <JsonLd id="ld-menu" data={menuSchema()} />
      <JsonLd id="ld-menu-crumbs" data={breadcrumbSchema([{ name: 'Menu', href: '/menu' }])} />

      {/* ── masthead ─────────────────────────────────────────────────── */}
      <div className="shell pt-[calc(var(--header-h)+clamp(2rem,4vw,3.5rem))]">
        <Reveal>
          <div className="deco-rule" />
          <div className="mt-6 flex items-end justify-between gap-8">
            <h1 className="t-h1 letterpress">Menu</h1>
            <CoffeeSack size={88} className="hidden shrink-0 text-paper-shade lg:block" />
          </div>
          <div className="rule-full mt-6" />
        </Reveal>
      </div>

      {/* A running offer sits above the card, where somebody reading prices
          will actually meet it. */}
      {offers[0] ? <OfferBand offer={offers[0]} compact /> : null}

      <MenuBrowser columns={columns} barista={barista} railGroups={railGroups} />

      <AddOnBand compact />

      {/* ── footnote ─────────────────────────────────────────────────── */}
      <div className="shell section--tight section">
        <Reveal className="grid-page">
          <div className="col-span-full lg:col-span-7">
            <p className="t-small italic text-pencil">
              Sugar, milk and ice can be adjusted on almost everything — just say so when you
              order. If you have an allergy, tell the counter and we will tell you exactly what
              is in the glass.
            </p>
            <GhostLink href={`tel:${contact.phone}`} className="mt-7">
              Call to order · {contact.phoneDisplay}
            </GhostLink>
          </div>
        </Reveal>
      </div>
    </>
  );
}
