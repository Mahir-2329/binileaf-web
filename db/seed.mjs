/**
 * Applies db/schema.sql to Neon, then loads every image (bytes included),
 * menu item, FAQ and content block from src/data into it.
 *
 *   npm run db:push     # schema + seed
 *   npm run db:schema   # schema only
 *   npm run db:seed     # seed only
 *
 * Idempotent: re-running replaces content rows and leaves enquiries alone.
 */

import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

/** Source images. They are read from here and stored in Postgres, not served. */
const MEDIA_ROOT = path.join(root, 'assets', 'media');

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  console.error('\n  DATABASE_URL is not set.\n  Put your Neon connection string in .env — see .env.example.\n');
  process.exit(1);
}

const sql = neon(connectionString);
const load = (rel) => import(pathToFileURL(path.join(root, 'src', 'data', rel)).href);
const log = (...a) => console.log('  ', ...a);

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/* ──────────────────────────────────────────────────────────── schema ──── */

/**
 * Split SQL on top-level semicolons only. Dollar-quoted function bodies
 * ($$ … $$) and line comments contain semicolons of their own, so a naive
 * `split(';')` would cut them in half.
 */
function splitStatements(ddl) {
  const statements = [];
  let current = '';
  let inDollar = false;
  let inLineComment = false;

  for (let i = 0; i < ddl.length; i++) {
    const char = ddl[i];
    const pair = ddl.slice(i, i + 2);

    if (inLineComment) {
      current += char;
      if (char === '\n') inLineComment = false;
      continue;
    }
    if (pair === '--') {
      inLineComment = true;
      current += char;
      continue;
    }
    if (pair === '$$') {
      inDollar = !inDollar;
      current += pair;
      i++;
      continue;
    }
    if (char === ';' && !inDollar) {
      statements.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  if (current.trim()) statements.push(current.trim());

  return statements.filter((statement) =>
    statement.split('\n').some((line) => line.trim() && !line.trim().startsWith('--'))
  );
}

async function pushSchema() {
  const ddl = await readFile(path.join(here, 'schema.sql'), 'utf8');
  const statements = splitStatements(ddl);

  for (const statement of statements) {
    try {
      await sql.query(statement);
    } catch (error) {
      console.error('\n  Failed statement:\n', statement.slice(0, 220), '\n');
      throw error;
    }
  }
  log(`schema applied (${statements.length} statements)`);
}

/* ───────────────────────────────────────────────────────────── media ──── */

const MIME = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.avif': 'image/avif',
};

async function walk(dir, base = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...(await walk(path.join(dir, entry.name), rel)));
    else if (/\.(webp|png|jpg|jpeg|avif)$/i.test(entry.name)) files.push(rel);
  }
  return files;
}

/** Minimal WebP/PNG header reader — keeps sharp out of the seed path. */
async function dimensions(buf) {
  if (buf.slice(0, 4).toString('latin1') === 'RIFF' && buf.slice(8, 12).toString('latin1') === 'WEBP') {
    const format = buf.slice(12, 16).toString('latin1');
    if (format === 'VP8X') {
      return {
        width: (buf.readUIntLE(24, 3) & 0xffffff) + 1,
        height: (buf.readUIntLE(27, 3) & 0xffffff) + 1,
      };
    }
    if (format === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (format === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
  }

  if (buf.slice(1, 4).toString('latin1') === 'PNG') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  return { width: 1, height: 1 };
}

/**
 * The bytes live in Postgres, not on disk. The Neon HTTP driver takes bytea as
 * a `\x…` hex literal going in, and hands it back the same way.
 */
async function seedMedia() {
  const { gallery } = await load('gallery.js');
  const curatedByPath = new Map(gallery.map((g, i) => [g.src, { ...g, position: i }]));

  const files = await walk(MEDIA_ROOT);
  let count = 0;
  let totalBytes = 0;

  for (const rel of files) {
    const publicPath = `/media/${rel}`;
    const slug = rel.replace(/\.[a-z]+$/i, '');
    const abs = path.join(MEDIA_ROOT, rel);

    const [buffer, info] = await Promise.all([readFile(abs), stat(abs)]);
    const { width, height } = await dimensions(buffer);

    const curated = curatedByPath.get(publicPath);
    const hex = '\\x' + buffer.toString('hex');
    const checksum = createHash('sha256').update(buffer).digest('hex').slice(0, 32);
    const contentType = MIME[path.extname(rel).toLowerCase()] ?? 'application/octet-stream';

    await sql`
      insert into media (
        slug, path, width, height, alt, category, tags, has_alpha,
        bytes, content_type, data, checksum, in_gallery, position
      )
      values (
        ${slug}, ${publicPath},
        ${curated?.w ?? width}, ${curated?.h ?? height},
        ${curated?.alt ?? ''}, ${slug.split('/')[0]}, ${curated?.tags ?? []},
        ${/\.png$/i.test(rel)},
        ${info.size}, ${contentType}, ${hex}, ${checksum},
        ${Boolean(curated)}, ${curated?.position ?? 999}
      )
      on conflict (slug) do update set
        path = excluded.path, width = excluded.width, height = excluded.height,
        alt = excluded.alt, category = excluded.category, tags = excluded.tags,
        has_alpha = excluded.has_alpha, bytes = excluded.bytes,
        content_type = excluded.content_type, data = excluded.data,
        checksum = excluded.checksum,
        in_gallery = excluded.in_gallery, position = excluded.position
    `;

    count++;
    totalBytes += info.size;
    if (count % 10 === 0) process.stdout.write('.');
  }

  console.log('');
  log(
    `media: ${count} images, ${(totalBytes / 1024 / 1024).toFixed(1)} MB stored in Postgres ` +
      `(${gallery.length} flagged for the gallery)`
  );
}

/* ────────────────────────────────────────────────────────────── menu ──── */

/** Which rule colour a category carries: the bean side or the leaf side. */
const FAMILY = {
  'hot-coffee': 'bean',
  'cold-coffee': 'bean',
  'iced-coffee': 'bean',
  'hot-chocolate': 'bean',
  tea: 'leaf',
  'ice-tea': 'leaf',
  lemonade: 'leaf',
  mocktails: 'leaf',
};

async function seedMenu() {
  const { menu } = await load('menu.js');

  await sql`delete from menu_sections`; // cascades to groups, items and variants

  let sectionPos = 0;
  let items = 0;

  for (const section of menu) {
    const mediaSlug = section.image?.replace('/media/', '').replace(/\.\w+$/, '') ?? null;
    const [{ id: sectionId }] = await sql`
      insert into menu_sections (slug, title, kicker, blurb, media_slug, position)
      values (${section.id}, ${section.title}, ${section.kicker ?? null},
              ${section.blurb ?? null}, ${mediaSlug}, ${sectionPos++})
      returning id
    `;

    let groupPos = 0;
    for (const group of section.groups) {
      const [{ id: groupId }] = await sql`
        insert into menu_groups (section_id, slug, title, note, family, position)
        values (${sectionId}, ${group.id}, ${group.title}, ${group.note ?? null},
                ${FAMILY[group.id] ?? 'ink'}, ${groupPos++})
        returning id
      `;

      let itemPos = 0;
      for (const item of group.items) {
        await sql`
          insert into menu_items (group_id, slug, name, price, is_star, note, position)
          values (${groupId}, ${`${group.id}-${slugify(item.name)}`}, ${item.name},
                  ${item.price}, ${Boolean(item.star)}, ${item.note ?? null}, ${itemPos++})
          on conflict (slug) do update set
            name = excluded.name, price = excluded.price,
            is_star = excluded.is_star, note = excluded.note, position = excluded.position
        `;
        items++;
      }
    }
  }

  log(`menu: ${menu.length} sections, ${items} items`);
}

/* ─────────────────────────────────────────────────────── placements ──── */

async function seedPlacements() {
  const { placements } = await load('placements.js');

  let position = 0;
  for (const slot of placements) {
    const mediaSlug = slot.fallback.replace('/media/', '').replace(/\.\w+$/, '');
    await sql`
      insert into media_placements (key, label, page, hint, aspect, media_slug, position)
      values (${slot.key}, ${slot.label}, ${slot.page}, ${slot.hint ?? null},
              ${slot.aspect ?? null}, ${mediaSlug}, ${position++})
      on conflict (key) do update set
        label = excluded.label, page = excluded.page,
        hint = excluded.hint, aspect = excluded.aspect, position = excluded.position
    `;
  }

  log(`placements: ${placements.length} slots`);
}

/* ────────────────────────────────────────────────── faqs, copy, config ──── */

async function seedContent() {
  const { faqs, story, values, franchise, quickFacts } = await load('content.js');

  await sql`delete from faqs`;
  let position = 0;
  for (const faq of faqs) {
    const topic = /franchise/i.test(faq.q)
      ? 'franchise'
      : /hour|where|contact|located/i.test(faq.q)
        ? 'visiting'
        : 'general';
    await sql`
      insert into faqs (question, answer, topic, position)
      values (${faq.q}, ${faq.a}, ${topic}, ${position++})
    `;
  }

  const blocks = { story, values, franchise, quickFacts };
  for (const [key, value] of Object.entries(blocks)) {
    await sql`
      insert into content_blocks (key, label, value, updated_at)
      values (${key}, ${key}, ${JSON.stringify(value)}::jsonb, now())
      on conflict (key) do update set value = excluded.value, updated_at = now()
    `;
  }

  const settings = {
    hours: { opens: '10:30', closes: '00:30', days: 'Monday to Sunday' },
    banner: { enabled: false, text: '' },
    ordering: { online: false, provider: null },
  };
  for (const [key, value] of Object.entries(settings)) {
    await sql`
      insert into settings (key, value) values (${key}, ${JSON.stringify(value)}::jsonb)
      on conflict (key) do nothing
    `;
  }

  log(
    `faqs: ${faqs.length} · content blocks: ${Object.keys(blocks).length} · ` +
      `settings: ${Object.keys(settings).length}`
  );
}

/* ────────────────────────────────────────────────────────────── main ──── */

const run = async () => {
  const schemaOnly = process.argv.includes('--schema-only');
  const skipSchema = process.argv.includes('--seed-only');

  console.log('\n  Binileaf — seeding Neon\n');
  if (!skipSchema) await pushSchema();
  if (!schemaOnly) {
    await seedMedia();
    await seedMenu();
    await seedContent();
    await seedPlacements();
  }
  console.log('\n  Done.\n');
};

run().catch((error) => {
  console.error('\n  Seed failed:', error.message, '\n');
  process.exit(1);
});
