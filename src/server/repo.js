import 'server-only';
import { query, getSql, hasDatabase } from '@/lib/db';
import { mediaSrc, mediaSrcs } from '@/lib/media';
import { readCrop } from '@/lib/frame';
import { menu as seedMenu } from '@/data/menu';
import { gallery as seedGallery } from '@/data/gallery';
import { faqs as seedFaqs, story, values, franchise, quickFacts } from '@/data/content';
import { placementFallbacks } from '@/data/placements';

/**
 * The only module that talks to Postgres.
 *
 * Every reader returns exactly the shape `src/data/*` already exports, so a
 * component cannot tell whether it was served from Neon or from the seed —
 * which is what makes the fallback safe.
 *
 * One difference between the row and what a component sees: image paths leave
 * here as opaque `/m/…` tokens. Both the Neon rows and the seed go through
 * `mediaSrc`, so the real path never reaches the browser by either route.
 */

/* ───────────────────────────────────────────────────────────── menu ──── */

/** Rebuild section -> group -> item nesting from one flat join. */
function nestMenu(rows) {
  const sections = new Map();

  for (const row of rows) {
    if (!sections.has(row.section_slug)) {
      sections.set(row.section_slug, {
        id: row.section_slug,
        title: row.section_title,
        kicker: row.section_kicker,
        blurb: row.section_blurb,
        image: mediaSrc(row.section_image),
        groups: new Map(),
      });
    }
    const section = sections.get(row.section_slug);

    if (row.group_slug && !section.groups.has(row.group_slug)) {
      section.groups.set(row.group_slug, {
        id: row.group_slug,
        title: row.group_title,
        note: row.group_note,
        family: row.group_family ?? 'ink',
        items: [],
      });
    }

    if (row.item_name) {
      section.groups.get(row.group_slug).items.push({
        slug: row.item_slug,
        name: row.item_name,
        price: Number(row.item_price),
        ...(row.item_compare_price ? { comparePrice: Number(row.item_compare_price) } : {}),
        ...(row.item_star ? { star: true } : {}),
        ...(row.item_new ? { isNew: true } : {}),
        ...(row.item_description ? { description: row.item_description } : {}),
        ...(row.item_note ? { note: row.item_note } : {}),
        ...(row.item_image ? { image: mediaSrc(row.item_image) } : {}),
        available: row.item_available !== false,
      });
    }
  }

  return [...sections.values()].map((section) => ({
    ...section,
    groups: [...section.groups.values()],
  }));
}

/** The seed carries real paths; the browser only ever gets tokens. */
function maskMenu(sections) {
  return sections.map((section) => ({
    ...section,
    ...(section.image ? { image: mediaSrc(section.image) } : {}),
    groups: section.groups.map((group) => ({
      ...group,
      ...(group.image ? { image: mediaSrc(group.image) } : {}),
      items: mediaSrcs(group.items),
    })),
  }));
}

export async function getMenu() {
  const { rows, source } = await query(
    (sql) => sql`
      select
        s.slug       as section_slug,
        s.title      as section_title,
        s.kicker     as section_kicker,
        s.blurb      as section_blurb,
        sm.path      as section_image,
        g.slug       as group_slug,
        g.title      as group_title,
        g.note       as group_note,
        g.family     as group_family,
        i.slug          as item_slug,
        i.name          as item_name,
        i.description   as item_description,
        i.price         as item_price,
        i.compare_price as item_compare_price,
        i.is_star       as item_star,
        i.is_new        as item_new,
        i.is_available  as item_available,
        i.note          as item_note,
        im.path         as item_image
      from menu_sections s
      left join media sm       on sm.slug = s.media_slug and sm.deleted_at is null
      left join menu_groups g  on g.section_id = s.id and g.is_active and g.deleted_at is null
      left join menu_items i   on i.group_id = g.id and i.is_active and i.deleted_at is null
      left join media im       on im.slug = i.media_slug and im.deleted_at is null
      where s.is_active and s.deleted_at is null
      order by s.position, g.position, i.position
    `,
    null
  );

  if (source === 'seed' || !rows?.length) return maskMenu(seedMenu);
  return nestMenu(rows);
}

export async function getMenuMeta() {
  const menu = await getMenu();
  const items = menu.flatMap((s) => s.groups.flatMap((g) => g.items));
  return {
    menu,
    items,
    count: items.length,
    groupCount: menu.reduce((n, s) => n + s.groups.length, 0),
    cheapest: Math.min(...items.map((i) => i.price)),
    dearest: Math.max(...items.map((i) => i.price)),
  };
}

/* ────────────────────────────────────────────────────────── gallery ──── */

export async function getGallery() {
  const { rows, source } = await query(
    (sql) => sql`
      select path as src, width as w, height as h, alt, tags
      from media
      where in_gallery and deleted_at is null
      order by position, created_at
    `,
    null
  );

  if (source === 'seed' || !rows?.length) return mediaSrcs(seedGallery);
  return rows.map((r) => ({
    ...r,
    src: mediaSrc(r.src),
    w: Number(r.w),
    h: Number(r.h),
    tags: r.tags ?? [],
  }));
}

/* ───────────────────────────────────────────────────────────── faqs ──── */

export async function getFaqs() {
  const { rows, source } = await query(
    (sql) => sql`
      select question as q, answer as a
      from faqs
      where is_active and deleted_at is null
      order by position
    `,
    null
  );

  if (source === 'seed' || !rows?.length) return seedFaqs;
  return rows;
}

/* ────────────────────────────────────────────────────────── content ──── */

const SEED_CONTENT = { story, values, franchise, quickFacts };

export async function getContent(key) {
  const { rows, source } = await query(
    (sql) => sql`select value from content_blocks where key = ${key} limit 1`,
    null
  );

  if (source === 'seed' || !rows?.length) return SEED_CONTENT[key] ?? null;
  return rows[0].value;
}

/* ─────────────────────────────────────────────────────── placements ──── */

/**
 * Every photograph slot on the site, resolved to a path and its dimensions.
 *
 * A slot the admin has not filled — or a site running with no database — falls
 * back to the path in `src/data/placements.js`, so a page can never render a
 * hole. Callers get a plain map keyed by slot.
 */
export async function getPlacements() {
  const { rows, source } = await query(
    (sql) => sql`
      select p.key, p.crop, m.path, m.width, m.height, m.alt
      from media_placements p
      left join media m on m.slug = p.media_slug and m.deleted_at is null
    `,
    null
  );

  const resolved = {};

  if (source !== 'seed' && rows?.length) {
    for (const row of rows) {
      if (!row.path) continue;
      resolved[row.key] = {
        src: mediaSrc(row.path),
        w: Number(row.width),
        h: Number(row.height),
        alt: row.alt ?? '',
        // How the café framed it. `frameStyle` in src/lib/frame.js turns this
        // into the object-position and zoom the page renders with.
        crop: readCrop(row.crop),
      };
    }
  }

  // Anything the database did not answer for keeps its built-in photograph.
  for (const [key, src] of Object.entries(placementFallbacks)) {
    if (!resolved[key]) {
      resolved[key] = { src: mediaSrc(src), w: 1600, h: 2000, alt: '', crop: null };
    }
  }

  return resolved;
}

/** One slot. Convenience for a component that only needs a single photograph. */
export async function getPlacement(key) {
  const all = await getPlacements();
  return all[key] ?? { src: mediaSrc(placementFallbacks[key]), w: 1600, h: 2000, alt: '' };
}

/* ─────────────────────────────────────────────────────────── offers ──── */

/**
 * Whatever should be showing right now: a discount, a combo, a happy hour or
 * a plain announcement. Returns [] when nothing is live, which is the normal
 * state — the site must read fine with no offers at all.
 */
export async function getLiveOffers(placement) {
  const { rows, source } = await query(
    (sql) => sql`
      select slug, kind, title, subtitle, body, code, value_type, value,
             applies_to, placement, starts_at, ends_at
      from live_offers
    `,
    []
  );

  if (source === 'seed' || !rows?.length) return [];
  if (!placement) return rows;
  return rows.filter((offer) => offer.placement?.[placement]);
}

/* ──────────────────────────────────────────────────────── enquiries ──── */

export async function createEnquiry(enquiry) {
  if (!hasDatabase) {
    console.info('[binileaf] enquiry (no database configured)', JSON.stringify(enquiry));
    return { stored: false };
  }

  const sql = getSql();
  const [row] = await sql`
    insert into enquiries (kind, name, email, phone, city, has_property, topic, message, user_agent)
    values (
      ${enquiry.kind}, ${enquiry.name}, ${enquiry.email}, ${enquiry.phone || null},
      ${enquiry.city || null}, ${enquiry.hasProperty || null}, ${enquiry.topic || null},
      ${enquiry.message || null}, ${enquiry.userAgent || null}
    )
    returning id, created_at
  `;
  return { stored: true, id: row.id, createdAt: row.created_at };
}
