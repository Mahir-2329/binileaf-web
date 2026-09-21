import Hero from '@/components/home/Hero';
import BeanAndLeaf from '@/components/home/BeanAndLeaf';
import Signature from '@/components/home/Signature';
import TheRoom from '@/components/home/TheRoom';
import Imprint from '@/components/home/Imprint';
import OfferBand from '@/components/home/OfferBand';
import JsonLd from '@/components/seo/JsonLd';

import { getLiveOffers, getPlacements } from '@/server/repo';
import { pageMeta, faqSchema } from '@/lib/seo';
import { site } from '@/data/site';

/**
 * Rebuilt on demand when the admin writes (see /api/revalidate); this window
 * is only the safety net for a ping that never arrived.
 */
export const revalidate = 300;

export const metadata = pageMeta({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  path: '/',
});

/**
 * Five plates, in this order and no more:
 *
 *   Hero         navy   — what this place is, in three lines
 *   Bean & Leaf  paper  — the argument the name makes
 *   Signature    navy   — the six things you cannot get anywhere else
 *   The Room     paper  — what it looks like
 *   Imprint      shade  — where, when, and how to reach us
 *
 * No two adjacent sections share a ground, and nothing here repeats what the
 * menu card already does better. Prices live on the card, not here.
 *
 * A running offer inserts one stamp-red band after the signature drinks — the
 * only thing on this page that is not always there.
 */
export default async function HomePage() {
  const [placements, offers] = await Promise.all([
    getPlacements(),
    getLiveOffers('home_band'),
  ]);

  return (
    <>
      <JsonLd id="ld-home-faq" data={faqSchema()} />

      <Hero placements={placements} />
      <BeanAndLeaf />
      <Signature placements={placements} />
      {offers[0] ? <OfferBand offer={offers[0]} /> : null}
      <TheRoom placements={placements} />
      <Imprint placements={placements} />
    </>
  );
}
