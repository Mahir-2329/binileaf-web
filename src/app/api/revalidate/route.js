import { revalidatePath } from 'next/cache';

/**
 * On-demand revalidation, called by the admin after it writes.
 *
 * The content pages are statically rendered and carry a `revalidate` window as
 * a safety net, but a café owner who has just corrected a price expects to see
 * it now, not in five minutes. The admin pings this and the affected paths are
 * rebuilt on the next request.
 *
 * Authorised by a shared secret in `REVALIDATE_SECRET`, sent as
 * `x-revalidate-secret`. With no secret configured the endpoint refuses
 * everything rather than defaulting to open.
 */

/** Which pages an entity actually shows on. Revalidating the rest is waste. */
const PATHS = {
  menu: ['/', '/menu', '/llms.txt', '/sitemap.xml'],
  offer: ['/', '/menu'],
  media: ['/', '/menu', '/gallery', '/about', '/franchise', '/contact'],
  placement: ['/', '/about', '/franchise', '/contact'],
  content: ['/about', '/franchise', '/llms.txt'],
  faq: ['/', '/franchise', '/contact', '/llms.txt'],
  settings: ['/', '/menu', '/contact', '/llms.txt'],
};

const EVERYTHING = ['/', '/menu', '/gallery', '/about', '/franchise', '/contact', '/llms.txt'];

export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return Response.json({ ok: false, error: 'Revalidation is not configured.' }, { status: 503 });
  }

  if (request.headers.get('x-revalidate-secret') !== secret) {
    return Response.json({ ok: false, error: 'Not authorised.' }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // An empty body means "everything" — that is a reasonable default here.
  }

  const paths = PATHS[body.entity] ?? EVERYTHING;
  paths.forEach((path) => revalidatePath(path));

  return Response.json({ ok: true, revalidated: paths });
}
