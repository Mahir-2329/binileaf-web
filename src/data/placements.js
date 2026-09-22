/**
 * Every photograph slot on the site, by name.
 *
 * The pages read a slot instead of hard-coding a path, so swapping the hero
 * shot is an edit in the admin rather than a deploy. This file is the registry
 * — the seed writes it into `media_placements`, the admin lists it, and the
 * site resolves it. A slot missing from the database falls back to `fallback`,
 * so the site can never render a hole.
 */

export const placements = [
  // ── home ──────────────────────────────────────────────────────────────
  {
    key: 'home.hero.background',
    page: 'Home',
    label: 'Hero background',
    hint: 'The full-bleed plate behind the headline. Wide, and it takes a heavy navy scrim.',
    aspect: '16/9',
    fallback: '/media/interior/seating-gallery-wall.webp',
  },
  {
    key: 'home.signature.1',
    page: 'Home',
    label: 'Signature 1 — Golden Drift',
    aspect: '4/5',
    fallback: '/media/drinks/golden-drift.webp',
  },
  {
    key: 'home.signature.2',
    page: 'Home',
    label: 'Signature 2 — Coconut Matcha',
    aspect: '4/5',
    fallback: '/media/drinks/matcha-tall.webp',
  },
  {
    key: 'home.signature.3',
    page: 'Home',
    label: 'Signature 3 — Watermelon Tonic Matcha',
    aspect: '4/5',
    fallback: '/media/drinks/matcha-rose.webp',
  },
  {
    key: 'home.signature.4',
    page: 'Home',
    label: 'Signature 4 — Tonic Espresso',
    aspect: '4/5',
    fallback: '/media/drinks/tonic-espresso.webp',
  },
  {
    key: 'home.signature.5',
    page: 'Home',
    label: 'Signature 5 — Barrelage Brew',
    aspect: '4/5',
    fallback: '/media/drinks/barrelage-brew.webp',
  },
  {
    key: 'home.signature.6',
    page: 'Home',
    label: 'Signature 6 — Tote Mocktail',
    aspect: '4/5',
    fallback: '/media/drinks/tote-mocktail.webp',
  },
  { key: 'home.room.1', page: 'Home', label: 'The Room — frame 1', aspect: '4/5', fallback: '/media/interior/seating-gallery-wall.webp' },
  { key: 'home.room.2', page: 'Home', label: 'The Room — frame 2', aspect: '4/5', fallback: '/media/interior/frames-corridor.webp' },
  { key: 'home.room.3', page: 'Home', label: 'The Room — frame 3', aspect: '4/5', fallback: '/media/interior/floral-wall.webp' },
  { key: 'home.room.4', page: 'Home', label: 'The Room — frame 4', aspect: '4/5', fallback: '/media/interior/dreamcatcher.webp' },
  { key: 'home.room.5', page: 'Home', label: 'The Room — frame 5', aspect: '4/5', fallback: '/media/interior/stairs.webp' },
  { key: 'home.room.6', page: 'Home', label: 'The Room — frame 6', aspect: '4/5', fallback: '/media/exterior/storefront-facade.webp' },
  {
    key: 'home.imprint.photo',
    page: 'Home',
    label: 'Visit — the shopfront',
    hint: 'What somebody should look for from the road.',
    aspect: '4/5',
    fallback: '/media/exterior/storefront-facade.webp',
  },

  // ── about ─────────────────────────────────────────────────────────────
  {
    key: 'about.hero',
    page: 'Our Story',
    label: 'Wide photograph under the title',
    aspect: '16/9',
    fallback: '/media/interior/seating-gallery-wall.webp',
  },
  {
    key: 'about.pasted',
    page: 'Our Story',
    label: 'Pasted print beside the story',
    aspect: '4/5',
    fallback: '/media/exterior/storefront-day.webp',
  },
  { key: 'about.strip.1', page: 'Our Story', label: 'Strip — frame 1', aspect: '4/5', fallback: '/media/interior/seating-window.webp' },
  { key: 'about.strip.2', page: 'Our Story', label: 'Strip — frame 2', aspect: '4/5', fallback: '/media/interior/shelf-corner.webp' },
  { key: 'about.strip.3', page: 'Our Story', label: 'Strip — frame 3', aspect: '4/5', fallback: '/media/interior/guests-table.webp' },
  { key: 'about.strip.4', page: 'Our Story', label: 'Strip — frame 4', aspect: '4/5', fallback: '/media/exterior/sign-mark-night.webp' },

  // ── franchise ─────────────────────────────────────────────────────────
  {
    key: 'franchise.hero',
    page: 'Franchise',
    label: 'Hero photograph',
    aspect: '4/5',
    fallback: '/media/interior/seating-window.webp',
  },

  // ── contact ───────────────────────────────────────────────────────────
  { key: 'contact.strip.1', page: 'Visit', label: 'Instagram strip — 1', aspect: '1/1', fallback: '/media/drinks/tote-mocktail.webp' },
  { key: 'contact.strip.2', page: 'Visit', label: 'Instagram strip — 2', aspect: '1/1', fallback: '/media/drinks/matcha-tall.webp' },
  { key: 'contact.strip.3', page: 'Visit', label: 'Instagram strip — 3', aspect: '1/1', fallback: '/media/food/avocado-sandwich.webp' },
  { key: 'contact.strip.4', page: 'Visit', label: 'Instagram strip — 4', aspect: '1/1', fallback: '/media/drinks/mint-mojito.webp' },
  { key: 'contact.strip.5', page: 'Visit', label: 'Instagram strip — 5', aspect: '1/1', fallback: '/media/interior/floral-wall.webp' },
  { key: 'contact.strip.6', page: 'Visit', label: 'Instagram strip — 6', aspect: '1/1', fallback: '/media/exterior/storefront-facade.webp' },
];

/** Slot key → fallback path, for the site's no-database path. */
export const placementFallbacks = Object.fromEntries(
  placements.map((slot) => [slot.key, slot.fallback])
);

/** Ordered list of the pages that own slots, for the admin's grouping. */
export const placementPages = [...new Set(placements.map((slot) => slot.page))];
