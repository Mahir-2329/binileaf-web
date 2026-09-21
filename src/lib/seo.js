import { site, contact, address, hours, socials, founders, amenities } from '@/data/site';
import { menu, allMenuItems } from '@/data/menu';
import { faqs } from '@/data/content';
import { mediaSrc } from '@/lib/media';

const abs = (path = '/') => new URL(path, site.url).toString();

const ID = {
  business: abs('/#cafe'),
  org: abs('/#organization'),
  website: abs('/#website'),
  menu: abs('/menu#menu'),
};

/** ISO 8601 opening-hours spec. The café closes at 00:30 the next day. */
const openingHours = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: hours.days,
  opens: hours.opens,
  closes: hours.closes,
};

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: `${address.street}, ${address.locality}`,
  addressLocality: address.city,
  addressRegion: address.region,
  postalCode: address.postalCode,
  addressCountry: address.country,
};

export function cafeSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['CafeOrCoffeeShop', 'Restaurant'],
    '@id': ID.business,
    name: site.name,
    alternateName: [site.shortName, site.legalName, 'BINILEAF'],
    url: site.url,
    description: site.description,
    slogan: site.tagline,
    image: [
      abs(mediaSrc('/media/exterior/storefront-facade.webp')),
      abs(mediaSrc('/media/drinks/tote-mocktail.webp')),
    ],
    logo: abs(mediaSrc('/media/brand/mark-navy.webp')),
    telephone: contact.phone,
    email: contact.email,
    priceRange: site.priceRange,
    currenciesAccepted: site.currency,
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card',
    servesCuisine: site.servesCuisine,
    address: postalAddress,
    geo: { '@type': 'GeoCoordinates', latitude: address.geo.lat, longitude: address.geo.lng },
    hasMap: address.mapsUrl,
    openingHoursSpecification: [openingHours],
    sameAs: socials.map((s) => s.href),
    founder: founders.map((f) => ({ '@type': 'Person', name: f.name })),
    foundingDate: site.founded,
    foundingLocation: { '@type': 'Place', name: `${address.city}, ${address.region}, India` },
    hasMenu: { '@id': ID.menu },
    amenityFeature: amenities.map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
    areaServed: { '@type': 'City', name: address.city },
    isAcceptingReservations: false,
    publicAccess: true,
    smokingAllowed: false,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': ID.website,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: 'en-IN',
    publisher: { '@id': ID.business },
  };
}

export function menuSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': ID.menu,
    name: `${site.name} Menu`,
    inLanguage: 'en-IN',
    url: abs('/menu'),
    description: `The full ${site.name} menu — ${allMenuItems.length} items across coffee, tea, cold beverages, barista specials and food.`,
    hasMenuSection: menu.map((section) => ({
      '@type': 'MenuSection',
      name: section.title,
      description: section.blurb,
      hasMenuSection: section.groups.map((group) => ({
        '@type': 'MenuSection',
        name: group.title,
        hasMenuItem: group.items.map((item) => ({
          '@type': 'MenuItem',
          name: item.name,
          ...(item.note ? { description: item.note } : {}),
          offers: {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: site.currency,
            availability: 'https://schema.org/InStock',
          },
          suitableForDiet: 'https://schema.org/VegetarianDiet',
        })),
      })),
    })),
  };
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbSchema(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', href: '/' }, ...trail].map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: abs(crumb.href),
    })),
  };
}

export function imageGallerySchema(images) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `${site.name} — photographs`,
    about: { '@id': ID.business },
    associatedMedia: images.map((image) => ({
      '@type': 'ImageObject',
      contentUrl: abs(image.src),
      caption: image.alt,
      width: image.w,
      height: image.h,
    })),
  };
}

/**
 * Page metadata helper. Keeps titles, canonicals and OG tags consistent
 * without repeating the boilerplate on every route.
 */
export function pageMeta({ title, description, path = '/', image = '/opengraph-image' }) {
  const url = abs(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: site.name,
      title,
      description,
      locale: 'en_IN',
      images: [{ url: abs(image), width: 1200, height: 630, alt: `${site.name} — ${title}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [abs(image)],
    },
  };
}
