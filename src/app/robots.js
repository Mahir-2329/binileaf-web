import { site } from '@/data/site';

/**
 * Open to everyone, answer engines included. The café has nothing to hide and
 * a lot to gain from being quotable.
 */
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: new URL('/sitemap.xml', site.url).toString(),
    host: site.url,
  };
}
