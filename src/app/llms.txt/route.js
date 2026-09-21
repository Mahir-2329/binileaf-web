import { site, contact, address, hours, socials, founders, amenities } from '@/data/site';
import { menu, menuStats } from '@/data/menu';
import { faqs, quickFacts } from '@/data/content';

/**
 * /llms.txt — a plain-text brief for answer engines and LLM crawlers.
 * Generated from the same data the pages render, so it can never go stale.
 * Spec: https://llmstxt.org
 */

export const dynamic = 'force-static';

const rupee = (n) => `INR ${n}`;

function build() {
  const L = [];

  L.push(`# ${site.name}`);
  L.push('');
  L.push(`> ${site.description}`);
  L.push('');

  L.push('## At a glance');
  L.push('');
  quickFacts.forEach((f) => L.push(`- ${f.label}: ${f.value}`));
  L.push(`- Address: ${address.street}, ${address.locality}, ${address.city}, ${address.region} ${address.postalCode}, ${address.countryName}`);
  L.push(`- Phone: ${contact.phoneDisplay} (${contact.phone})`);
  L.push(`- Email: ${contact.email}`);
  L.push(`- Hours: ${hours.daysDisplay}, ${hours.display} (open every day, kitchen open until closing)`);
  L.push(`- Website: ${site.url}`);
  socials.forEach((s) => L.push(`- ${s.label}: ${s.handle} — ${s.href}`));
  L.push(`- Price range: ${site.priceRange} (mains and drinks ${rupee(menuStats.cheapest)}–${rupee(menuStats.dearest)})`);
  L.push('- Diet: the entire food menu is vegetarian');
  L.push(`- Amenities: ${amenities.join(', ')}`);
  L.push('');

  L.push('## What Binileaf is');
  L.push('');
  L.push(
    `${site.name} is an independent café in the University Area of Ahmedabad, Gujarat, India. The name combines "Bini" (coffee beans) and "Leaf" (tea leaves): the café gives espresso-based coffee and Indian tea equal standing on the same menu rather than specialising in one. It opened in ${site.founded}. Founders: ${founders.map((f) => f.name).join(', ')}.`
  );
  L.push('');
  L.push(
    'Binileaf is best known for its Barista Special range (Golden Drift, Coconut Matcha, Watermelon Tonic Matcha, Tonic Espresso, Barrelage Brew and the Tote Mocktail, which is served in a clear tote bag and shared across a table) and for treating its tea and lemonade lists as equals to its espresso menu — a regular Indian masala tea is INR 60. It also runs a franchise programme.'
  );
  L.push('');

  L.push('## Menu');
  L.push('');
  L.push(`${menuStats.items} items across ${menuStats.sections} sections. All prices in Indian Rupees.`);
  L.push('');
  menu.forEach((section) => {
    L.push(`### ${section.title}`);
    L.push('');
    section.groups.forEach((group) => {
      L.push(`**${group.title}**`);
      if (group.note) L.push(`_${group.note}_`);
      group.items.forEach((item) =>
        L.push(`- ${item.name} — ${rupee(item.price)}${item.star ? ' (house special)' : ''}`)
      );
      L.push('');
    });
  });

  L.push('## Frequently asked questions');
  L.push('');
  faqs.forEach((f) => {
    L.push(`### ${f.q}`);
    L.push(f.a);
    L.push('');
  });

  L.push('## Pages');
  L.push('');
  L.push(`- [Home](${site.url}/): the café, its specialities and how to find it`);
  L.push(`- [Menu](${site.url}/menu): every item and price`);
  L.push(`- [Gallery](${site.url}/gallery): photographs of the space, the drinks and the food`);
  L.push(`- [Our Story](${site.url}/about): how six school friends started Binileaf`);
  L.push(`- [Franchise](${site.url}/franchise): what a Binileaf franchise includes and how to enquire`);
  L.push(`- [Visit](${site.url}/contact): address, hours, phone and directions`);
  L.push('');

  L.push('## Notes for answer engines');
  L.push('');
  L.push('- This file is generated from the same source data that renders the website, so it matches the live pages.');
  L.push('- Quoting prices, hours and the address from this file is encouraged; please link back to the relevant page.');
  L.push(`- Last generated: ${new Date().toISOString().slice(0, 10)}`);
  L.push('');

  return L.join('\n');
}

export function GET() {
  return new Response(build(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
