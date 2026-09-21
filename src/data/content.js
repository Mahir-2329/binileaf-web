/**
 * Long-form copy: the story, the values, the franchise pitch and the FAQ.
 * Kept out of the components so the same text can feed both the page and the
 * JSON-LD / llms.txt that answer engines read.
 */

export const story = {
  kicker: 'Est. 2025 · University Area, Ahmedabad',
  heading: 'Six friends, one "what if?", and a lot of chai',
  lede:
    'Binileaf did not begin as a business plan. It began as a conversation that ran too long, the way conversations between old school friends do.',
  paragraphs: [
    'The name is the whole idea in two syllables. **Bini** is the coffee bean. **Leaf** is the tea leaf. Every café in India quietly picks a side — Binileaf refused to. You can order a single-origin espresso and the person across the table can order a regular masala chai, and neither of you has settled for anything.',
    'Six of us went to school together. Years later, over a completely ordinary evening, someone said *what if we just opened a place*. Nobody said no. We were not entrepreneurs; we were six people who liked sitting together and thought other people might like a room built for exactly that.',
    'So we built one. Wire chairs, wooden tables, a wall of prints we argued about for weeks, bamboo screens outside, and far too many plants. A kitchen that stays open till closing because the best conversations start after 10 PM.',
    'Every drink is made to order. Fresh beans, real leaves, nothing sitting in a jug waiting for you. It takes an extra minute. That minute is the point.',
  ],
  quote: {
    text:
      'Binileaf was born from the dream of creating a place where people could slow down, sip mindfully, and connect with what truly matters — good coffee and good company.',
    attribution: 'The six of us',
  },
};

export const values = [
  {
    id: 'brewed-fresh',
    title: 'Brewed to order, never in advance',
    body:
      'Beans come from growers we buy from directly and get roasted for us. Nothing is pre-batched. If it takes ninety seconds longer, it takes ninety seconds longer.',
  },
  {
    id: 'both-halves',
    title: 'Coffee and chai, equally',
    body:
      'The espresso list and the tea list get the same attention. A regular masala chai is sixty rupees and gets made with the same care as a three-hundred-rupee matcha. That is half the reason we opened.',
  },
  {
    id: 'sustainable',
    title: 'Lighter on the planet',
    body:
      'Biodegradable cups, plant-based straws, and a kitchen run to minimise waste. Not a marketing line — just the version of the café we wanted to run.',
  },
  {
    id: 'built-to-sit-in',
    title: 'Built for staying, not for turnover',
    body:
      'Free Wi-Fi, seating you can work from, air conditioning, and nobody hovering to clear your table. Read, work, argue, do nothing.',
  },
];

export const franchise = {
  kicker: 'Franchise',
  heading: 'Open a Binileaf where you are',
  lede:
    'We are opening the model to people who want to run a café the way we run ours — small, particular, and genuinely liked by the people who live around it.',
  reasons: [
    {
      title: 'A concept nobody else runs',
      body: 'Serious coffee and serious chai under one roof, in one room, on one card. It reaches a far wider table than a coffee-only café does.',
    },
    {
      title: 'A story that is actually true',
      body: 'Six school friends, one spontaneous idea. Customers repeat it because it is real, which is the only kind of story that travels.',
    },
    {
      title: 'An operation that already works',
      body: 'A tested layout, a costed menu, a kitchen flow built for a small team and long hours.',
    },
    {
      title: 'Training that does not stop at handover',
      body: 'Setup, staff training, every recipe, and marketing — we stay on the phone long after you open.',
    },
    {
      title: 'An honest investment',
      body: 'A transparent fee structure with no buried line items, and room to scale at your own pace.',
    },
  ],
  included: [
    'Complete interior design & branding package',
    'Full menu training and product sourcing',
    'POS and day-to-day management tooling',
    'Marketing and social media support',
    'Access to our exclusive coffee & tea blends',
  ],
};

/**
 * Written as direct question/answer pairs — this is the shape both search
 * engines and answer engines quote from, so it is worth keeping literal.
 */
export const faqs = [
  {
    q: 'Where is Binileaf Café located?',
    a: 'Binileaf Café is on the ground floor of Kruti Apartment, Block-A, University Area, Ahmedabad, Gujarat 380015 — a short walk from Gujarat University.',
  },
  {
    q: 'What are Binileaf Café’s opening hours?',
    a: 'Binileaf is open every day of the week, Monday to Sunday, from 10:30 AM until 12:30 AM. The kitchen stays open until closing.',
  },
  {
    q: 'What does the name "Binileaf" mean?',
    a: '"Bini" stands for coffee beans and "Leaf" for tea leaves. The name reflects the café’s founding idea — giving coffee and tea equal standing on the same menu instead of choosing between them.',
  },
  {
    q: 'Who started Binileaf Café?',
    a: 'Binileaf was started in 2025 by six school friends — Vandan Patel, Apurva Patel, Akash Rajput, Amit Rathod, Bhavesh Hingu and Purva Gohel — from a spontaneous idea during a casual conversation.',
  },
  {
    q: 'What is Binileaf Café known for?',
    a: 'Binileaf is known for its Barista Special range — Golden Drift (₹290), Coconut Matcha (₹350), Watermelon Tonic Matcha (₹360) and the Tote Mocktail (₹450), which is served in a clear tote bag and shared across a table — and for giving Indian masala tea and lemonades the same billing as its espresso menu.',
  },
  {
    q: 'Is Binileaf Café vegetarian?',
    a: 'Yes. The entire Binileaf food menu — pizza, sandwiches, pasta, crispy bites and desserts — is vegetarian.',
  },
  {
    q: 'How much does a coffee cost at Binileaf?',
    a: 'Hot coffee at Binileaf starts at ₹120 for an espresso, with a cappuccino at ₹160 and a cafe latte at ₹170. A regular Indian masala tea is ₹60. Most cold coffees and thick shakes sit between ₹160 and ₹290.',
  },
  {
    q: 'Does Binileaf Café have Wi-Fi and seating to work from?',
    a: 'Yes. Binileaf has free Wi-Fi, air conditioning and seating designed for long stays, including a first-floor section. It is a common spot for students and remote workers in the University Area.',
  },
  {
    q: 'Can I open a Binileaf franchise?',
    a: 'Yes. Binileaf runs a franchise programme covering interior design and branding, menu training, product sourcing, POS tooling, marketing support and access to its exclusive blends. Enquiries go through the franchise form on binileaf.com or by phone on 87586 85932.',
  },
  {
    q: 'How do I contact Binileaf Café?',
    a: 'Call 87586 85932, email hello@binileaf.com, or message @binileafofficial on Instagram. Walk-ins are welcome any day between 10:30 AM and 12:30 AM.',
  },
];

/** Short factual lines used in the "at a glance" strip and by llms.txt. */
export const quickFacts = [
  { label: 'Opened', value: '2025' },
  { label: 'Founders', value: 'Six school friends' },
  { label: 'Open', value: '10:30 AM – 12:30 AM, daily' },
  { label: 'Neighbourhood', value: 'University Area, Ahmedabad' },
];
