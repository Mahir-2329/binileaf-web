import 'server-only';
import { createCipheriv, createDecipheriv, createHash, createHmac } from 'node:crypto';

/**
 * Opaque media URLs.
 *
 * Nothing the browser asks for should spell out where a file lives. A frame in
 * the gallery is requested as `/m/8Qc…` rather than
 * `/media/exterior/storefront-night.webp`, so the network log gives away no
 * folder names, no file names and no sense of how much there is.
 *
 * The token is the path itself, encrypted — not a lookup key. That keeps this
 * stateless: no table to keep in step, no cache to invalidate, and a photograph
 * uploaded from the admin a minute ago resolves like any other. The nonce is
 * derived from the path rather than drawn at random, so one file always has one
 * URL and stays cacheable across builds.
 *
 * `MEDIA_KEY` must be the same at build time and at run time — the tokens are
 * baked into the statically rendered pages.
 */

const PREFIX = '/media/';
const IV_BYTES = 12;
const TAG_BYTES = 8; // GCM truncated: 64 bits is plenty to stop token fiddling

const KEY = createHash('sha256')
  .update(process.env.MEDIA_KEY || 'binileaf/media/v1')
  .digest();

/** One path, one nonce — deterministic, so the URL never moves. */
function nonce(plain) {
  return createHmac('sha256', KEY).update(`nonce:${plain}`).digest().subarray(0, IV_BYTES);
}

/** `/media/drinks/matcha-tall.webp` -> `/m/<token>`. Anything else passes through. */
export function mediaSrc(path) {
  if (typeof path !== 'string' || !path.startsWith(PREFIX)) return path;

  const plain = path.slice(PREFIX.length);
  const iv = nonce(plain);
  const cipher = createCipheriv('aes-256-gcm', KEY, iv, { authTagLength: TAG_BYTES });
  const body = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);

  return `/m/${Buffer.concat([iv, body, cipher.getAuthTag()]).toString('base64url')}`;
}

/** The reverse. Returns null for anything tampered with or malformed. */
export function readMediaToken(token) {
  try {
    const raw = Buffer.from(String(token), 'base64url');
    if (raw.length <= IV_BYTES + TAG_BYTES) return null;

    const iv = raw.subarray(0, IV_BYTES);
    const body = raw.subarray(IV_BYTES, raw.length - TAG_BYTES);
    const tag = raw.subarray(raw.length - TAG_BYTES);

    const decipher = createDecipheriv('aes-256-gcm', KEY, iv, { authTagLength: TAG_BYTES });
    decipher.setAuthTag(tag);
    const plain = decipher.update(body, undefined, 'utf8') + decipher.final('utf8');

    // A path that would climb out of the media store is a forged token.
    if (plain.includes('..') || plain.startsWith('/')) return null;

    return PREFIX + plain;
  } catch {
    return null;
  }
}

/** Map `.src` / `.image` on a list of records through {@link mediaSrc}. */
export function mediaSrcs(records) {
  return records.map((record) => ({
    ...record,
    ...(record.src ? { src: mediaSrc(record.src) } : {}),
    ...(record.image ? { image: mediaSrc(record.image) } : {}),
  }));
}
