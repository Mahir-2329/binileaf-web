import { site } from '@/data/site';

const ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/menu', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/gallery', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/franchise', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
];

export default function sitemap() {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: new URL(path, site.url).toString(),
    lastModified,
    changeFrequency,
    priority,
  }));
}
