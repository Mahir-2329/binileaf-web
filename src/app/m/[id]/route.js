import { getSql, hasDatabase } from '@/lib/db';
import { readMediaToken } from '@/lib/media';

/**
 * Serves every image from Postgres.
 *
 * The browser asks for `/m/<token>`; the token decrypts to the row's `path`,
 * which is the only place the real layout of the media store is spelled out.
 * Nothing sits in `public/` — the bytes come out of the `media` table, which is
 * what lets the café replace a photograph from an admin screen without a
 * deploy.
 *
 * Responses are immutable-cached and carry the row's checksum as an ETag, so a
 * replaced image invalidates itself and an unchanged one costs a 304.
 */

export const dynamic = 'force-dynamic';

/** The Neon HTTP driver returns bytea as a `\\x…` hex string. */
function toBuffer(value) {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (typeof value === 'string' && value.startsWith('\\x')) {
    return Buffer.from(value.slice(2), 'hex');
  }
  return null;
}

export async function GET(request, { params }) {
  if (!hasDatabase) {
    return new Response('Media store is not configured.', { status: 503 });
  }

  const { id } = await params;
  const publicPath = readMediaToken(id);

  if (!publicPath) {
    return new Response('Not found', { status: 404 });
  }

  const sql = getSql();
  let rows;

  try {
    rows = await sql`
      select data, content_type, bytes, checksum
      from media
      where path = ${publicPath} and is_active and deleted_at is null
      limit 1
    `;
  } catch (error) {
    console.error('[binileaf] media lookup failed:', error.message);
    return new Response('Media is temporarily unavailable.', { status: 503 });
  }

  const row = rows?.[0];
  const body = row && toBuffer(row.data);

  if (!body) {
    return new Response('Not found', { status: 404 });
  }

  const etag = `"${row.checksum ?? row.bytes}"`;
  if (request.headers.get('if-none-match') === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  return new Response(body, {
    headers: {
      'Content-Type': row.content_type ?? 'application/octet-stream',
      'Content-Length': String(body.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: etag,
    },
  });
}
