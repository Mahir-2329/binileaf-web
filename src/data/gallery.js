/**
 * Curated photo set. Every entry carries real intrinsic dimensions so
 * next/image can reserve space and never shift the layout.
 */

const img = (src, w, h, alt, tags) => ({ src, w, h, alt, tags });

export const galleryCategories = [
  { id: 'all', label: 'Everything' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'food', label: 'Food' },
  { id: 'space', label: 'The Space' },
  { id: 'street', label: 'Outside' },
];

export const gallery = [
  // ——— outside ———
  img('/media/exterior/storefront-facade.webp', 1600, 2133, 'The Binileaf shopfront at dusk, neon wordmark over a bamboo screen', ['street']),
  img('/media/exterior/storefront-day.webp', 1600, 2133, 'Binileaf signboard above the entrance on a bright Ahmedabad afternoon', ['street']),
  img('/media/exterior/storefront-night.webp', 1600, 1200, 'Scooters parked outside Binileaf after dark, lights on inside', ['street']),
  img('/media/exterior/storefront-greenery.webp', 1600, 2133, 'Creepers spilling over the Binileaf sign at night', ['street']),
  img('/media/exterior/sign-mark-night.webp', 1600, 2133, 'The Binileaf cat-and-cup mark glowing on the bamboo facade', ['street']),
  img('/media/exterior/entrance.webp', 1444, 2560, 'A guest standing in the doorway under the Binileaf mark', ['street']),
  img('/media/exterior/storefront-night-wide.webp', 1600, 903, 'Wide view of the café frontage lit up at night', ['street']),

  // ——— the space ———
  img('/media/interior/seating-gallery-wall.webp', 1600, 2133, 'Wire chairs and wooden tables below a wall of framed prints', ['space']),
  img('/media/interior/seating-window.webp', 1600, 2133, 'Corner seating beside the window inside Binileaf', ['space']),
  img('/media/interior/frames-corridor.webp', 1600, 2133, 'Framed posters running the length of the café wall', ['space']),
  img('/media/interior/floral-wall.webp', 1600, 2133, 'A table set against the pink floral feature wall', ['space']),
  img('/media/interior/shelf-toys.webp', 1600, 903, 'Collectible figurines lined up along a shelf', ['space']),
  img('/media/interior/dreamcatcher.webp', 1444, 2560, 'A blue dreamcatcher and potted plants above the counter', ['space']),
  img('/media/interior/stairs.webp', 1444, 2560, 'The staircase up to the first-floor seating', ['space']),
  img('/media/interior/guests-table.webp', 1444, 2560, 'Guests talking over a plate of sandwiches', ['space']),
  img('/media/interior/blinds-room.webp', 1600, 2133, 'Bamboo blinds filtering afternoon light across the tables', ['space']),
  img('/media/interior/counter-drinks.webp', 1600, 903, 'Drinks lined up on the counter ready to go out', ['space']),
  img('/media/interior/shelf-corner.webp', 1600, 2133, 'The shelf corner with prints, plants and a bicycle', ['space']),

  // ——— drinks ———
  img('/media/drinks/tote-mocktail.webp', 1206, 2075, 'The Tote Mocktail — a layered fruit cooler served in a clear tote bag', ['drinks']),
  img('/media/drinks/tote-mocktail-hand.webp', 1444, 2560, 'A hand lifting the Tote Mocktail off the table', ['drinks']),
  img('/media/drinks/matcha-tall.webp', 1444, 2560, 'Coconut matcha layered over a red base in a ribbed glass', ['drinks']),
  img('/media/drinks/matcha-rose.webp', 1444, 2560, 'Iced matcha with a rose-coloured base on a cork coaster', ['drinks']),
  img('/media/drinks/iced-coffee-layered.webp', 1444, 2560, 'Layered iced coffee melting into milk', ['drinks']),
  img('/media/drinks/cafe-latte.webp', 1444, 2560, 'A cafe latte in a tall glass on a dark wooden table', ['drinks']),
  img('/media/drinks/vietnamese-iced-coffee.webp', 768, 1344, 'Vietnamese iced coffee with condensed milk and an espresso shot alongside', ['drinks']),
  img('/media/drinks/mint-mojito.webp', 1600, 2133, 'Mint mojito, heavy on the mint, in a tall glass', ['drinks']),
  img('/media/drinks/green-apple-cooler.webp', 1600, 2133, 'Green apple cooler catching the window light', ['drinks']),
  img('/media/drinks/long-black-iced.webp', 1444, 2560, 'Long black iced coffee in a ribbed glass', ['drinks']),
  img('/media/drinks/strawberry-cooler.webp', 1600, 2133, 'Strawberry cooler on a hand-painted table top', ['drinks']),
  img('/media/drinks/green-apple-tall.webp', 1600, 2133, 'Green apple slush in a tall ribbed glass', ['drinks']),
  img('/media/drinks/golden-drift.webp', 1600, 2133, 'Golden Drift, the barista special, over a wooden table', ['drinks']),
  img('/media/drinks/barrelage-brew.webp', 1444, 2560, 'Barrelage Brew poured into a ribbed tumbler', ['drinks']),
  img('/media/drinks/orange-mint-lemonade.webp', 1600, 1600, 'Orange mint lemonade with fresh orange slices and mint', ['drinks']),
  img('/media/drinks/green-cooler-shelf.webp', 1600, 2133, 'A green cooler flanked by two doll figurines on the shelf', ['drinks']),

  // ——— food ———
  img('/media/food/sandwich-platter.webp', 1444, 2560, 'Grilled sandwich quarters on a blue floral plate with two dips', ['food']),
  img('/media/food/avocado-sandwich.webp', 1444, 2560, 'The avocado sandwich, halved, with guacamole and tomato salsa', ['food']),
  img('/media/food/chilly-cheese-sandwich.webp', 1444, 2560, 'Chilly cheese sandwich cut into quarters around a bowl of ketchup', ['food']),
  img('/media/food/sandwich-croissant.webp', 1444, 2560, 'Sandwich croissant plated with a dip', ['food']),
  img('/media/food/alfredo-pasta.webp', 1600, 2133, 'A bowl of alfredo pasta', ['food']),
  img('/media/food/crispy-bites.webp', 1600, 1131, 'Fries, wedges and cheese balls with ketchup', ['food']),
  img('/media/food/food-spread.webp', 1600, 1131, 'A spread of pizza, fries, nachos and dips shot from above', ['food']),
  img('/media/drinks/tea-and-cookies.webp', 1600, 1131, 'A cup of masala chai with cookies on the saucer', ['food']),
];

export const galleryByCategory = (id) =>
  id === 'all' ? gallery : gallery.filter((g) => g.tags.includes(id));
