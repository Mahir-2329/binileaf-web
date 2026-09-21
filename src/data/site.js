/**
 * Single source of truth for everything the café is: name, address, phone,
 * hours, socials. Used by the UI, by the JSON-LD emitters and by the
 * sitemap/llms.txt generators, so NAP data can never drift between them.
 */

export const site = {
  name: 'Binileaf Café',
  shortName: 'Binileaf',
  legalName: 'Binileaf Café Inn',
  url: 'https://binileaf.com',
  tagline: 'Coffee and chai, in equal measure',
  description:
    'Binileaf is an independent café in the University Area of Ahmedabad. "Bini" is the coffee bean, "Leaf" is the tea leaf — espresso and masala chai get equal billing. Matcha, thick shakes, mocktails, pizza, sandwiches and pasta, served from 10:30 AM to 12:30 AM every day.',
  founded: '2025',
  priceRange: '₹₹',
  currency: 'INR',
  servesCuisine: ['Coffee & Tea', 'Cafe', 'Italian', 'Beverages'],
};

export const contact = {
  phone: '+918758685932',
  phoneDisplay: '87586 85932',
  whatsapp: '918758685932',
  email: 'hello@binileaf.com',
};

export const address = {
  street: 'Ground Floor, Kruti Apartment, Block-A',
  locality: 'University Area',
  city: 'Ahmedabad',
  region: 'Gujarat',
  postalCode: '380015',
  country: 'IN',
  countryName: 'India',
  /** Centre of the University Area, Ahmedabad — used for the map link only. */
  geo: { lat: 23.0368, lng: 72.5487 },
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Binileaf+Cafe+Kruti+Apartment+University+Area+Ahmedabad',
};

export const hours = {
  /** Every day, same hours. Closes after midnight. */
  opens: '10:30',
  closes: '00:30',
  display: '10:30 AM — 12:30 AM',
  daysDisplay: 'Monday to Sunday',
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
};

export const socials = [
  { label: 'Instagram', handle: '@binileafofficial', href: 'https://www.instagram.com/binileafofficial/' },
];

export const founders = [
  { name: 'Vandan Patel' },
  { name: 'Apurva Patel' },
  { name: 'Akash Rajput' },
  { name: 'Amit Rathod' },
  { name: 'Bhavesh Hingu' },
  { name: 'Purva Gohel' },
];

/** Primary navigation. Franchise is deliberately not here — it sits in the
 *  footer, where people who are looking for it will look. */
export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Our Story', href: '/about' },
  { label: 'Visit', href: '/contact' },
];

/** Everything the footer lists, primary nav plus the quieter pages. */
export const footerNav = [...nav, { label: 'Franchise', href: '/franchise' }];

export const amenities = [
  'Free Wi-Fi',
  'Dine-in seating',
  'Air conditioned',
  'Vegetarian friendly',
  'Open till 12:30 AM',
  'Card & UPI accepted',
];
