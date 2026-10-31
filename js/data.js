// Maple Hollow — game content, procedural townsfolk, and progression math.
// All artwork is original inline SVG so the game stays fully self-contained.

export const SAVE_KEY = 'mapleHollow.save.v1';
export const GAME_VERSION = 1;

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
export const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const SKIN_TONES = [
  { id: 'porcelain', name: 'Porcelain', base: '#ffe4d2', shade: '#f3c2aa', blush: '#f7a8a0', line: '#b96f62' },
  { id: 'peach', name: 'Peach', base: '#ffd8bb', shade: '#eeb392', blush: '#ee9a8f', line: '#a85f4d' },
  { id: 'honey', name: 'Honey', base: '#efbf91', shade: '#d69a6b', blush: '#d97f73', line: '#8e5439' },
  { id: 'caramel', name: 'Caramel', base: '#d59868', shade: '#b87549', blush: '#bd6459', line: '#70412c' },
  { id: 'chestnut', name: 'Chestnut', base: '#b8754e', shade: '#915232', blush: '#a84f4c', line: '#5a3222' },
  { id: 'cocoa', name: 'Cocoa', base: '#8c543b', shade: '#673b29', blush: '#8f3b3b', line: '#42251b' },
  { id: 'umber', name: 'Umber', base: '#693c2d', shade: '#4a281e', blush: '#71302f', line: '#301a14' },
  { id: 'rosewood', name: 'Rosewood', base: '#563228', shade: '#3b211b', blush: '#612b2c', line: '#281610' }
];

export const HAIR_COLORS = [
  { id: 'ink', name: 'Ink Black', base: '#242033', shade: '#12101d', light: '#555073' },
  { id: 'espresso', name: 'Espresso', base: '#4a3028', shade: '#2c1b18', light: '#7a5543' },
  { id: 'chestnutHair', name: 'Chestnut', base: '#7a4b32', shade: '#4d2c1e', light: '#b0764b' },
  { id: 'auburn', name: 'Auburn', base: '#9b472f', shade: '#642b21', light: '#d5784e' },
  { id: 'honeyHair', name: 'Honey Blonde', base: '#d7a74d', shade: '#a87728', light: '#f6d785' },
  { id: 'platinum', name: 'Platinum', base: '#e8dfce', shade: '#bbae95', light: '#fffaf0' },
  { id: 'cottonCandy', name: 'Cotton Candy', base: '#f18fb8', shade: '#c55f8c', light: '#ffc3da' },
  { id: 'cherry', name: 'Cherry Red', base: '#c63d55', shade: '#8e223b', light: '#ef7787' },
  { id: 'mermaid', name: 'Mermaid Blue', base: '#4f9ac3', shade: '#2f678d', light: '#8bd2ea' },
  { id: 'mint', name: 'Mint Soda', base: '#7fc9ad', shade: '#4a9279', light: '#b9f0da' },
  { id: 'lavender', name: 'Lavender', base: '#a28bd0', shade: '#7059a1', light: '#d5c7f6' },
  { id: 'tangerine', name: 'Tangerine', base: '#e8873e', shade: '#b45b20', light: '#ffbe79' }
];

export const EYE_COLORS = [
  { id: 'cocoaEye', name: 'Cocoa', base: '#6b3f2a', light: '#b97d4e' },
  { id: 'amber', name: 'Amber', base: '#b56b22', light: '#efae55' },
  { id: 'jade', name: 'Jade', base: '#277f64', light: '#68c6a6' },
  { id: 'ocean', name: 'Ocean', base: '#276a9c', light: '#71bce4' },
  { id: 'violet', name: 'Violet', base: '#7354a9', light: '#b69ae1' },
  { id: 'rose', name: 'Rose', base: '#b6456c', light: '#ef89a7' },
  { id: 'gold', name: 'Gold', base: '#b18a25', light: '#f2d56d' },
  { id: 'storm', name: 'Storm', base: '#596173', light: '#aab3c6' }
];

export const HAIR_STYLES = [
  { id: 'long', name: 'Long Layers' },
  { id: 'bob', name: 'Sugar Bob' },
  { id: 'twin', name: 'Twin Tails' },
  { id: 'pony', name: 'High Pony' },
  { id: 'pixie', name: 'Pixie Cut' },
  { id: 'hime', name: 'Hime Cut' },
  { id: 'wavy', name: 'Beach Waves' },
  { id: 'spiky', name: 'Anime Spikes' },
  { id: 'curly', name: 'Cloud Curls' },
  { id: 'braids', name: 'Twin Braids' },
  { id: 'buns', name: 'Space Buns' },
  { id: 'wolf', name: 'Wolf Cut' },
  { id: 'undercut', name: 'Side Undercut' },
  { id: 'buzz', name: 'Soft Buzz' }
];

export const BODY_TYPES = [
  { id: 'petite', name: 'Petite' },
  { id: 'slim', name: 'Slim' },
  { id: 'curvy', name: 'Curvy' },
  { id: 'athletic', name: 'Athletic' },
  { id: 'broad', name: 'Broad' },
  { id: 'soft', name: 'Soft' }
];

export const EYE_SHAPES = [
  { id: 'round', name: 'Round' },
  { id: 'almond', name: 'Almond' },
  { id: 'sharp', name: 'Sharp' },
  { id: 'dreamy', name: 'Dreamy' },
  { id: 'wide', name: 'Wide' }
];

export const MOUTHS = [
  { id: 'smile', name: 'Soft Smile' },
  { id: 'grin', name: 'Bright Grin' },
  { id: 'pout', name: 'Pout' },
  { id: 'smirk', name: 'Smirk' },
  { id: 'open', name: 'Little Laugh' },
  { id: 'cat', name: 'Cat Smile' }
];

export const OUTFITS = [
  { id: 'tee', name: 'Vintage Tee', palette: ['#ef6f8b', '#fff3ef', '#8a3651'] },
  { id: 'hoodie', name: 'Oversized Hoodie', palette: ['#7fb7a9', '#fdfcf4', '#3d756d'] },
  { id: 'sailor', name: 'Sailor Uniform', palette: ['#f7f1e4', '#365b8c', '#d94f63'] },
  { id: 'sundress', name: 'Sunny Sundress', palette: ['#f5c34f', '#fff4c9', '#d17a37'] },
  { id: 'blazer', name: 'Smart Blazer', palette: ['#455a7e', '#f8efe3', '#c15a74'] },
  { id: 'y2k', name: 'Y2K Baby Tee', palette: ['#c9a7e8', '#f8f6ed', '#7951a8'] },
  { id: 'goth', name: 'Velvet Goth', palette: ['#2b2736', '#8e284b', '#b7a8c9'] },
  { id: 'beach', name: 'Beach Day', palette: ['#42b9c1', '#fff3d7', '#f48c63'] },
  { id: 'elf', name: 'Elven Finery', palette: ['#56895d', '#d7b45b', '#f0e6c8'] },
  { id: 'cat', name: "Cat's Meow", palette: ['#242331', '#d75d84', '#f0d7e2'] },
  { id: 'spring', name: 'Bloom Dress', palette: ['#f4a6bd', '#fff7e8', '#83ad72'] },
  { id: 'festival', name: 'Festival Yukata', palette: ['#445a9e', '#f8ecda', '#e75d75'] },
  { id: 'cozy', name: 'Cozy Knit', palette: ['#ba7760', '#f9ead9', '#6f4435'] },
  { id: 'overalls', name: 'Art Club Overalls', palette: ['#5f88a3', '#f4e7cd', '#e3a53f'] },
  { id: 'formal', name: 'Moonlight Formal', palette: ['#5b3b77', '#f6d67a', '#c9a1d8'] },
  { id: 'cardigan', name: 'Library Cardigan', palette: ['#c8945d', '#f8eee2', '#76513c'] }
];

export const ACCESSORIES = [
  { id: 'none', name: 'None' },
  { id: 'glasses', name: 'Glasses' },
  { id: 'freckles', name: 'Freckles' },
  { id: 'earrings', name: 'Earrings' },
  { id: 'headband', name: 'Headband' },
  { id: 'beauty', name: 'Beauty Mark' },
  { id: 'blush', name: 'Extra Blush' }
];

export const SPECIES = [
  { id: 'Human', label: 'Human', plural: 'Humans' },
  { id: 'Cat demi-human', label: 'Cat demi-human', plural: 'Cat demi-humans' },
  { id: 'Bunny demi-human', label: 'Bunny demi-human', plural: 'Bunny demi-humans' },
  { id: 'Elf', label: 'Elf', plural: 'Elves' },
  { id: 'Fox demi-human', label: 'Fox demi-human', plural: 'Fox demi-humans' },
  { id: 'Pearlfin', label: 'Pearlfin', plural: 'Pearlfin' },
  { id: 'Deer demi-human', label: 'Deer demi-human', plural: 'Deer demi-humans' },
  { id: 'Cupid', label: 'Cupid', plural: 'Cupids' }
];

export const OCCUPATIONS = [
  'Barista', 'Florist', 'Record Shop Clerk', 'Arcade Champion', 'Librarian',
  'Lifeguard', 'Pastry Chef', 'Tattoo Artist', 'Vet Tech', 'Photographer',
  'Music Teacher', 'Beachcomber', 'Ceramicist', 'Bookbinder', 'Radio Host',
  'Costume Designer', 'Botanist', 'Dance Instructor', 'Toy Maker', 'Screenwriter'
];

export const LOCATIONS = [
  { id: 'home', name: 'Rosewood Cottage', short: 'Home', icon: 'home', blurb: 'Your little house at the end of Petal Lane.', x: 18, y: 66, color: '#f3a0aa', accent: '#c85b72', actions: ['sleep', 'family'] },
  { id: 'cafe', name: 'Bean There Café', short: 'Café', icon: 'cup', blurb: 'Fresh coffee, warm scones, and the best gossip in town.', x: 39, y: 43, color: '#e9b36b', accent: '#9c5d35', actions: ['work'] },
  { id: 'park', name: 'Clover Park', short: 'Park', icon: 'leaf', blurb: 'A ribbon of green with a wishing fountain at its heart.', x: 59, y: 29, color: '#82b98a', accent: '#3f7352', actions: ['walk'] },
  { id: 'plaza', name: 'Star Plaza', short: 'Plaza', icon: 'star', blurb: 'The neon heart of town. Something is always happening here.', x: 63, y: 58, color: '#de87a3', accent: '#8e3c62', actions: ['work'] },
  { id: 'arcade', name: 'Pixel Palace', short: 'Arcade', icon: 'game', blurb: 'Dance pads, claw machines, and a very competitive high-score board.', x: 82, y: 40, color: '#7f9bd8', accent: '#3e5499', actions: ['work'] },
  { id: 'boutique', name: 'Ribbon & Rouge', short: 'Boutique', icon: 'bow', blurb: 'Gifts, ribbons, and dangerously cute impulse buys.', x: 34, y: 78, color: '#d993c3', accent: '#8e4a83', actions: ['gifts'] },
  { id: 'beach', name: 'Pearl Shore', short: 'Beach', icon: 'shell', blurb: 'Sea glass, salt air, and a boardwalk that glows at dusk.', x: 83, y: 78, color: '#6fc3cf', accent: '#2d7d8c', actions: ['walk'] }
];
export const LOCATION_BY_ID = Object.fromEntries(LOCATIONS.map(l => [l.id, l]));

export const PERSONALITIES = [
  { id: 'sunshine', name: 'Sunshine', icon: 'sun', blurb: 'Warm, loud, and impossible not to smile around.', likes: ['flowers', 'mixtape', 'plush'] },
  { id: 'tsundere', name: 'Tsundere', icon: 'spark', blurb: 'Sharp edges, soft center. Do not tell anyone.', likes: ['coffee', 'necklace', 'record'] },
  { id: 'shy', name: 'Shy', icon: 'cloud', blurb: 'Quiet at first, wonderfully weird once comfortable.', likes: ['book', 'plush', 'flowers'] },
  { id: 'flirty', name: 'Flirty', icon: 'heart', blurb: 'Knows exactly what they are doing. Probably.', likes: ['necklace', 'perfume', 'record'] },
  { id: 'bookworm', name: 'Bookworm', icon: 'book', blurb: 'Has a favorite font and will defend it.', likes: ['book', 'coffee', 'bookmark'] },
  { id: 'sporty', name: 'Sporty', icon: 'bolt', blurb: 'Always halfway out the door to practice.', likes: ['smoothie', 'mixtape', 'shell'] },
  { id: 'goth', name: 'Night Owl', icon: 'moon', blurb: 'Black coffee, silver rings, secret soft heart.', likes: ['record', 'necklace', 'bookmark'] },
  { id: 'artsy', name: 'Artsy', icon: 'brush', blurb: 'Sees the world in color swatches.', likes: ['sketchbook', 'flowers', 'bookmark'] },
  { id: 'motherly', name: 'Warm', icon: 'teacup', blurb: 'Remembers your order and your bad days.', likes: ['coffee', 'flowers', 'plush'] },
  { id: 'mischief', name: 'Mischief', icon: 'star', blurb: 'Chaos with excellent eyeliner.', likes: ['record', 'mixtape', 'perfume'] },
  { id: 'elegant', name: 'Elegant', icon: 'crown', blurb: 'Makes every room feel a little more cinematic.', likes: ['perfume', 'necklace', 'flowers'] },
  { id: 'tomboy', name: 'Tomboy', icon: 'bolt', blurb: 'Competitive, casual, and quietly devoted.', likes: ['smoothie', 'record', 'shell'] }
];

export const GIFTS = [
  { id: 'coffee', name: 'Fancy Latte', price: 8, hearts: 4, icon: 'cup', color: '#bd7a4d', desc: 'A tiny paper cup of courage.' },
  { id: 'flowers', name: 'Flower Bouquet', price: 20, hearts: 9, icon: 'flower', color: '#e37b9b', desc: 'Wrapped in ribbon and hope.' },
  { id: 'mixtape', name: 'Handmade Mixtape', price: 30, hearts: 13, icon: 'tape', color: '#6f89cb', desc: 'Track 3 is definitely a confession.' },
  { id: 'plush', name: 'Bubblegum Plush', price: 55, hearts: 18, icon: 'plush', color: '#e9a2c2', desc: 'Extremely huggable. No notes.' },
  { id: 'necklace', name: 'Star Charm Necklace', price: 120, hearts: 28, icon: 'necklace', color: '#d6ab4b', desc: 'A little sparkle at the collarbone.' },
  { id: 'record', name: 'Rare Vinyl Record', price: 145, hearts: 33, icon: 'record', color: '#5f5b98', desc: 'The B-side is their favorite song.' },
  { id: 'perfume', name: 'Peach Blossom Perfume', price: 180, hearts: 38, icon: 'perfume', color: '#e58b94', desc: 'Sweet, but not cloying.' },
  { id: 'bookmark', name: 'Gold Bookmark', price: 65, hearts: 21, icon: 'bookmark', color: '#c59a48', desc: 'For someone who dog-ears pages.' },
  { id: 'smoothie', name: 'Sunrise Smoothie', price: 14, hearts: 7, icon: 'smoothie', color: '#ef9f54', desc: 'Mango, peach, and a tiny paper umbrella.' },
  { id: 'sketchbook', name: 'Linen Sketchbook', price: 42, hearts: 16, icon: 'book', color: '#8ba6a2', desc: 'Blank pages feel like possibility.' },
  { id: 'shell', name: 'Sea Glass Jar', price: 36, hearts: 15, icon: 'shell', color: '#64b8bf', desc: 'Blue glass worn smooth by the tide.' }
];
export const GIFT_BY_ID = Object.fromEntries(GIFTS.map(g => [g.id, g]));

export const HOLIDAYS = [
  {
    id: 'summer', name: 'Summer Splash', short: 'Beach Week', months: [5], start: 14, end: 20,
    icon: 'shell', color: '#39b7c4', blush: '#ffe8b5',
    desc: 'Beach fits, sea-glass gifts, and Pearlfin visitors from the coast.',
    species: 'Pearlfin', outfit: 'beach',
    names: { female: ['Marina', 'Coral', 'Pearl', 'Waverly'], male: ['Tide', 'Kai', 'Reef', 'Caspian'] },
    greeting: 'Salt air suits you.'
  },
  {
    id: 'starfall', name: 'Starfall Nights', short: 'Starfall', months: [7], start: 8, end: 14,
    icon: 'star', color: '#7a6bd0', blush: '#ffe1a8',
    desc: 'The sky falls in slow, golden streaks. Fox spirits follow it into town.',
    species: 'Fox demi-human', outfit: 'festival',
    names: { female: ['Aster', 'Ember', 'Kit', 'Saffron'], male: ['Ren', 'Sorrel', 'Jinx', 'August'] },
    greeting: 'Did you wish on one yet?'
  },
  {
    id: 'halloween', name: 'Moonlit Masquerade', short: 'Halloween', months: [9], start: 21, end: 27,
    icon: 'moon', color: '#6b4c93', blush: '#f2b35d',
    desc: 'Cat-raced visitors slip into town for a week of masks and mischief.',
    species: 'Cat demi-human', outfit: 'cat',
    names: { female: ['Nyx', 'Salem', 'Vesper', 'Mina'], male: ['Bram', 'Marlow', 'Binx', 'Onyx'] },
    greeting: 'Nice mask. Mine is my face.'
  },
  {
    id: 'winter', name: 'Winterlight Week', short: 'Winterlight', months: [11], start: 20, end: 26,
    icon: 'snow', color: '#4e9fc0', blush: '#fbe5d8',
    desc: 'Lanterns, cocoa, and elegant Elven visitors from the north woods.',
    species: 'Elf', outfit: 'elf',
    names: { female: ['Noelle', 'Elara', 'Sable', 'Ivy'], male: ['Fenn', 'Lior', 'Ewan', 'Hollis'] },
    greeting: 'The lanterns are prettier with company.'
  },
  {
    id: 'spring', name: 'Bloom Festival', short: 'Bloom Fest', months: [2], start: 18, end: 24,
    icon: 'flower', color: '#e77da4', blush: '#fff0b0',
    desc: 'Petal parades, picnic blankets, and sweet Bunny demi-human newcomers.',
    species: 'Bunny demi-human', outfit: 'spring',
    names: { female: ['Clover', 'Juniper', 'Blossom', 'Posey'], male: ['Basil', 'Pip', 'Wren', 'Sorrel'] },
    greeting: 'I brought enough picnic for two.'
  },
  {
    id: 'harvest', name: 'Harvest Moon', short: 'Harvest', months: [10], start: 10, end: 16,
    icon: 'leaf', color: '#c77f3f', blush: '#ffe0a0',
    desc: 'Pumpkin lights, cider, and gentle Deer demi-humans down from the hills.',
    species: 'Deer demi-human', outfit: 'cozy',
    names: { female: ['Maple', 'Fawn', 'Hazel', 'Rowan'], male: ['Buck', 'Cedar', 'Oren', 'Rook'] },
    greeting: 'The cider is better than the festival games. Almost.'
  },
  {
    id: 'valentine', name: 'Sweetheart Week', short: 'Sweethearts', months: [1], start: 10, end: 16,
    icon: 'heart', color: '#d85f86', blush: '#ffd1dd',
    desc: 'Cupid visitors, paper hearts, and a town-wide confession booth.',
    species: 'Cupid', outfit: 'formal',
    names: { female: ['Amora', 'Cherry', 'Cupid', 'Vale'], male: ['Eros', 'Lark', 'Ames', 'Hart'] },
    greeting: 'I promise I did not shoot anyone with an arrow. Today.'
  }
];

export const PERK_DEFS = {
  money: {
    id: 'money', name: 'Hustle Heart', subtitle: 'Turn charm into cash',
    icon: 'coins', color: '#d89b3c', soft: '#fff0d2',
    baseCost: 150,
    effect: (rank, prestige) => `+$${Math.round((6 + (rank - 1) * 9) * (1 + prestige * 0.7))}/day`
  },
  family: {
    id: 'family', name: 'Nesting Instinct', subtitle: 'A fuller house, faster',
    icon: 'nest', color: '#c86f91', soft: '#ffe3ec',
    baseCost: 185,
    effect: (rank, prestige) => `+${Math.round(rank * 2.2 + prestige * 8)}% conception · +${Math.round((rank - 1) * 6 + prestige * 15)}% child income`
  },
  charm: {
    id: 'charm', name: 'Silver Tongue', subtitle: 'Make every hello count',
    icon: 'sparkle', color: '#7f7bc5', soft: '#eeecff',
    baseCost: 165,
    effect: (rank, prestige) => `+${(rank * 0.55 + prestige * 2).toFixed(1)} flirt · +${Math.round(rank * 1.2 + prestige * 4)}% date hearts`
  }
};

export const DIALOGUE = {
  greeting: {
    sunshine: ['Oh! Hi, hi! I was hoping I would run into you.', 'Perfect timing. I just found the sunniest bench in town.', 'You have exactly the face of someone who needs a snack.'],
    tsundere: ['I was not waiting for you. I just happen to be here. Constantly.', 'Do not read into this, but I saved you a seat.', 'You are late. Not that I was counting.'],
    shy: ['Oh — um. Hello. I like your... everything. Sorry.', 'I practiced saying hi. It went better in my head.', 'Would you maybe want to look at this book with me?'],
    flirty: ['There you are. The scenery just got better.', 'I had a whole line prepared, but you distracted me.', 'Come closer. I only bite on weekends.'],
    bookworm: ['I have three books and no self-control. Sit with me?', 'This chapter is excellent. You are a close second.', 'Please tell me you are also emotionally invested in footnotes.'],
    sporty: ['Hey! I just beat my lap time. Want to celebrate with a smoothie?', 'You look like you could use a walk and a very one-sided pep talk.', 'Race you to the fountain. Loser buys snacks.'],
    goth: ['The moon is doing something interesting tonight. You should see it.', 'I do not usually do small talk. You can have the big talk.', 'You look like you have excellent taste in melancholy.'],
    artsy: ['Hold still — the light is doing something gorgeous on your face.', 'I made you a tiny sketch. It is not weird. Probably.', 'Tell me your favorite color. I need it for a project.'],
    motherly: ['Have you eaten? Do not lie to me.', 'There you are. I kept your usual warm.', 'Come in from the cold, sweetheart.'],
    mischief: ['I have a plan. It is mostly legal and entirely your fault.', 'Do not look now, but I am about to make this afternoon interesting.', 'I stole a sugar packet. Want to be my accomplice?'],
    elegant: ['I was beginning to think this evening lacked a protagonist.', 'You have a way of making ordinary moments feel deliberate.', 'Shall we take a turn around the plaza? I adore an audience.'],
    tomboy: ['Oh good, someone who will not make me talk about feelings.', 'I found a new arcade high score. It is mine. For now.', 'You are fun. Do not tell anyone I said that.']
  },
  flirt: {
    sunshine: ['You just made my whole day. Maybe my week. Definitely my week.', 'Careful! If you keep that up I will start planning a picnic.', 'Eep! My heart did a little cartwheel.'],
    tsundere: ['I-i-it is not like I liked that or anything. Do it again.', 'You are impossible. Fine. I am smiling. Once.', 'That was... acceptable. Very acceptable.'],
    shy: ['Oh no. Oh no, that was nice. I am normal about this.', 'I forgot every word in the language just now.', 'I am going to think about that later. A lot.'],
    flirty: ['Careful, sweetheart. I flirt back harder.', 'Oh, you are dangerous. I like it.', 'Keep looking at me like that and I will get ideas.'],
    bookworm: ['That was better than a first edition with uncut pages.', 'I am going to annotate this memory.', 'My heart just skipped a page.'],
    sporty: ['Okay, wow. New personal best for making me blush.', 'I am usually better at cardio than at feelings.', 'You are going to make me lose focus. I do not hate it.'],
    goth: ['That almost made me smile. Almost. Okay, it did.', 'Dangerous. You might actually get me to be happy.', 'I will allow one more compliment. For research.'],
    artsy: ['That belongs in a museum. I am blushing in four colors.', 'You are my new favorite muse.', 'I need to paint this exact feeling.'],
    motherly: ['Oh, stop. You are going to spoil me.', 'That is the sweetest thing I have heard all season.', 'Come here, you charmer.'],
    mischief: ['Flirting with me? Bold. I love a co-conspirator.', 'You are trouble. I am taking notes.', 'Wait until I tell everyone you made me blush.'],
    elegant: ['Oh, you are good. I shall pretend to be unmoved.', 'What a lovely little scandal you are making.', 'That earned you a dance, at minimum.'],
    tomboy: ['Yeah, okay. That was smooth. I am mad about it.', 'Do not make this weird. Too late. It is weird.', 'You are lucky you are cute.']
  },
  date: [
    'The date was simple and perfect: a little food, a long walk, and an excuse to keep talking.',
    'Somewhere between the second story and the third laugh, the rest of the town faded out.',
    'They walked you home slowly, taking the long way twice.'
  ],
  tired: [
    'You look exhausted. Are you taking care of yourself? I worry.',
    'Hey. When did you last sleep? You are allowed to rest, you know.',
    'You are doing that brave, sleepy blink. Sit down. I will get you some water.',
    'I would say you look dreamy, but you also look literally asleep. Sit with me?'
  ],
  lowAffection: [
    'They smile politely, but their attention is somewhere else.',
    'A pleasant moment — not quite a spark yet.',
    'They seem happy to see you, in a friendly, not-yet-heart-racing way.'
  ],
  reject: [
    'They look genuinely surprised — and gently shake their head. Not yet.',
    'They need more time. The ring stays in your pocket.',
    'There is a soft no in their eyes, wrapped in kindness.'
  ],
  accept: [
    'Yes. A hundred times yes. Do not make me regret saying it so fast.',
    'They laugh, cry, and say yes all at once.',
    'Yes — but you are carrying me over the threshold.'
  ]
};

export const BIRTH_NAMES = {
  female: ['Lily', 'Rose', 'Ivy', 'Daisy', 'Ruby', 'Sage', 'June', 'Wren', 'Mabel', 'Tilly', 'Nora', 'Clementine', 'Juniper', 'Faye', 'Opal', 'Birdie'],
  male: ['Finn', 'August', 'Henry', 'Ollie', 'Theo', 'Milo', 'Elias', 'Rory', 'Sam', 'Jack', 'Arlo', 'Ezra', 'Hugo', 'Levi', 'Nico', 'Charlie']
};

export const MARRIAGE_VOWS = [
  'I promise the good snacks and the last slice.',
  'I promise to be your home base, no matter where we are.',
  'I promise to keep choosing you on the ordinary Tuesdays.',
  'I promise to love you loudly and listen better.',
  'I promise to always make room for you at the table.'
];

export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export const uid = (() => { let n = Math.random() * 1000 | 0; return () => `mh${++n}`; })();

export function weightedPick(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}

function uniqueName(names, used) {
  const available = names.filter(n => !used.has(n));
  const name = available.length ? pick(available) : `${pick(names)} ${pick(['Mae', 'Lou', 'Rue', 'Jo', 'Vee'])}`;
  used.add(name);
  return name;
}

export function defaultProfile(gender = 'female', overrides = {}) {
  const base = gender === 'male'
    ? { hair: 'spiky', outfit: 'tee', body: 'athletic', mouth: 'smirk' }
    : { hair: 'long', outfit: 'sundress', body: 'slim', mouth: 'smile' };
  return {
    gender,
    skin: pick(SKIN_TONES).id,
    hair: base.hair,
    hairColor: pick(HAIR_COLORS).id,
    eye: pick(EYE_SHAPES).id,
    eyeColor: pick(EYE_COLORS).id,
    mouth: base.mouth,
    outfit: base.outfit,
    body: base.body,
    accessory: 'none',
    species: 'Human',
    hairX: 0, hairY: 0, hairScale: 1,
    eyeX: 0, eyeY: 0, eyeScale: 1,
    mouthX: 0, mouthY: 0, mouthScale: 1,
    bodyScale: 1,
    ...overrides
  };
}

export function randomProfile(gender = 'female', overrides = {}) {
  return defaultProfile(gender, {
    skin: pick(SKIN_TONES).id,
    hair: pick(HAIR_STYLES).id,
    hairColor: pick(HAIR_COLORS).id,
    eye: pick(EYE_SHAPES).id,
    eyeColor: pick(EYE_COLORS).id,
    mouth: pick(MOUTHS).id,
    outfit: pick(OUTFITS).id,
    body: pick(BODY_TYPES).id,
    accessory: pick(ACCESSORIES).id,
    species: weightedPick(['Human', 'Cat demi-human', 'Bunny demi-human', 'Elf'], [8, 1, 1, 1]),
    ...overrides
  });
}

export function makeSuitor(state, options = {}) {
  const gender = options.gender || (Math.random() < 0.75 ? 'female' : 'male');
  const used = new Set([...(state?.suitors || []), ...(state?.spouses || [])].map(s => s.name));
  const pool = gender === 'female' ? FEMALE_NAMES : MALE_NAMES;
  const name = options.name || uniqueName(pool, used);
  const personality = options.personality || pick(PERSONALITIES);
  const species = options.species || (options.holidayId ? pick(HOLIDAYS).species : weightedPick(['Human', 'Cat demi-human', 'Bunny demi-human', 'Elf'], [9, 1, 1, 1]));
  const outfit = options.outfit || (options.holidayId ? getHolidayById(options.holidayId)?.outfit : pick(OUTFITS).id);
  const profile = options.profile || randomProfile(gender, {
    species,
    outfit: outfit || 'tee',
    body: options.body || pick(BODY_TYPES).id
  });
  const location = options.location || pick(LOCATIONS.filter(l => l.id !== 'home')).id;
  const occupation = options.occupation || pick(OCCUPATIONS);
  const idNum = state ? state.nextId++ : 1000;
  return {
    id: `s${idNum}`,
    name,
    gender,
    age: options.age || rand(21, 30),
    species,
    occupation: occupation,
    personality: personality.id,
    personalityName: personality.name,
    profile: { ...profile, gender, species },
    affection: options.affection ?? rand(0, 5),
    met: false,
    joinedSerial: state?.daySerial || 0,
    ignored: 0,
    location,
    holidayId: options.holidayId || null,
    temporary: Boolean(options.holidayId),
    flirtCount: 0,
    giftCount: 0,
    dateCount: 0,
    moveIn: options.moveIn || false,
    bio: options.bio || buildBio(name, gender, species, personality, occupation),
    lastLine: ''
  };
}

const FEMALE_NAMES = [
  'Aiko', 'Mina', 'Rina', 'Sora', 'Yuki', 'Hana', 'Mei', 'Kira', 'Lola', 'Tessa',
  'Ruby', 'Cleo', 'Naomi', 'Poppy', 'Estelle', 'Faye', 'Nova', 'Seraphina', 'Bree', 'Sadie',
  'Camille', 'Daphne', 'Elena', 'Frankie', 'Gia', 'Hazel', 'Iris', 'Jolene', 'Kaia', 'Lena',
  'Maeve', 'Nicolette', 'Odette', 'Piper', 'Quinn', 'Remy', 'Stella', 'Tatum', 'Una', 'Vera',
  'Willa', 'Ximena', 'Yara', 'Zoe', 'Amber', 'Bianca', 'Coco', 'Della', 'Esme', 'Flora'
];
const MALE_NAMES = [
  'Ren', 'Kaito', 'Julian', 'Milo', 'Theo', 'Felix', 'Rowan', 'Ash', 'Dante', 'Noah',
  'Elliot', 'Graham', 'Hugo', 'Isaac', 'Jonah', 'Nico', 'Owen', 'Silas', 'Toby', 'Wes',
  'Adrian', 'Beckett', 'Casper', 'Dorian', 'Emil', 'Finn', 'Gideon', 'Haru', 'Ilya', 'Jasper',
  'Kellan', 'Lucien', 'Matteo', 'Nolan', 'Orion', 'Pax', 'Reid', 'Soren', 'Tristan', 'Vale'
];

function buildBio(name, gender, species, personality, occupation) {
  const pronoun = gender === 'female' ? 'She' : 'He';
  const speciesLine = species === 'Human' ? '' : ` ${species === 'Elf' ? 'Elven' : species.replace(' demi-human', '')} ears, endless charm.`;
  const bios = [
    `${pronoun} makes a mean cup of coffee and an even better mixtape.`,
    `${pronoun} came to Maple Hollow for the quiet, then discovered the arcade.`,
    `${pronoun} has a laugh you can hear from the other side of the plaza.`,
    `${pronoun} is convinced every plant has a personality.`,
    `${pronoun} is one part ${occupation.toLowerCase()}, two parts romantic disaster.`,
    `${pronoun} writes lists and loses them, but never loses a friend.`,
    `${pronoun} can name every constellation and most of the diner menu.`,
    `${pronoun} moved here for a fresh start and is secretly thrilled you noticed.`
  ];
  return `${pick(bios)}${speciesLine}`;
}

export function makeMC(gender = 'female', name = 'Avery', profile = null) {
  return {
    name,
    gender,
    profile: profile || defaultProfile(gender),
    joined: null
  };
}

export function dateToSerial(date) {
  return Math.floor(Date.UTC(date.year, date.month, date.day) / 86400000);
}

export function serialToDate(serial) {
  const d = new Date(serial * 86400000);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth(), day: d.getUTCDate() };
}

export function addDays(date, n) {
  return serialToDate(dateToSerial(date) + n);
}

export function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

export function weekdayOf(date) {
  const d = new Date(Date.UTC(date.year, date.month, date.day));
  return WEEKDAYS[d.getUTCDay()];
}

export function dateLabel(date) {
  return `${WEEKDAYS[new Date(Date.UTC(date.year, date.month, date.day)).getUTCDay()]}, ${MONTHS[date.month]} ${date.day}, ${date.year}`;
}

export function shortDate(date) {
  return `${MONTHS_SHORT[date.month]} ${String(date.day).padStart(2, '0')}`;
}

export function getHoliday(date) {
  return HOLIDAYS.find(h => h.months.includes(date.month) && date.day >= h.start && date.day <= h.end) || null;
}

export function getHolidayById(id) {
  return HOLIDAYS.find(h => h.id === id) || null;
}

export function holidayDaysLeft(date, holiday = getHoliday(date)) {
  if (!holiday) return 0;
  return holiday.end - date.day + 1;
}

export function nextHolidayLabel(date) {
  const serial = dateToSerial(date);
  for (let i = 1; i < 400; i++) {
    const d = serialToDate(serial + i);
    const h = getHoliday(d);
    if (h) return { holiday: h, inDays: i };
  }
  return null;
}

export function createInitialState() {
  const date = { year: 2003, month: 5, day: 14 };
  const state = {
    version: GAME_VERSION,
    mc: makeMC('female', 'Avery'),
    funds: 500,
    date,
    minute: 9 * 60,
    daySerial: dateToSerial(date),
    sleep: 100,
    sleepDebt: 0,
    location: 'cafe',
    screen: 'map',
    suitors: [],
    spouses: [],
    children: [],
    perks: {
      money: { rank: 1, prestige: 0 },
      family: { rank: 1, prestige: 0 },
      charm: { rank: 1, prestige: 0 }
    },
    nextId: 1000,
    activeHoliday: null,
    holidaySpawned: [],
    stories: [],
    notifications: [],
    ending: false,
    introSeen: false,
    lastIncomeSerial: dateToSerial(date),
    lastMorningIncome: 0,
    nightPromptedSerial: 0,
    moonlightSerial: 0,
    napsToday: 0,
    activeId: null,
    filter: 'all',
    lastSaved: Date.now(),
    stats: {
      flirts: 0, gifts: 0, dates: 0, proposals: 0, weddings: 0, children: 0, incomeEarned: 0
    }
  };
  // Base town population: exactly six women and two men (3:1).
  for (let i = 0; i < 6; i++) state.suitors.push(makeSuitor(state, { gender: 'female' }));
  for (let i = 0; i < 2; i++) state.suitors.push(makeSuitor(state, { gender: 'male' }));
  // Stagger arrivals so the moving-out system feels alive from day one.
  state.suitors.forEach((s, i) => {
    s.joinedSerial -= i % 5;
    s.location = LOCATIONS.filter(l => l.id !== 'home')[(i + 1) % 6].id;
  });
  // Make the first crush a guaranteed cat demi-human for immediate visual variety.
  state.suitors[0].species = 'Cat demi-human';
  state.suitors[0].profile.species = 'Cat demi-human';
  state.suitors[0].profile.outfit = 'y2k';
  state.suitors[0].name = 'Mina';
  state.suitors[0].affection = 16;
  state.suitors[1].species = 'Elf';
  state.suitors[1].profile.species = 'Elf';
  state.suitors[1].profile.outfit = 'cardigan';
  state.suitors[1].name = 'Elara';
  state.suitors[0].met = true;
  const startingHoliday = getHoliday(date);
  state.activeHoliday = startingHoliday ? `${startingHoliday.id}-${date.year}` : null;
  if (startingHoliday) spawnHolidaySuitors(state, startingHoliday);
  state.introSeen = false;
  return state;
}

export function spawnHolidaySuitors(state, holiday) {
  const holidayKey = `${holiday.id}-${state.date.year}`;
  if (!holiday || state.holidaySpawned.includes(holidayKey)) return [];
  const newbies = [];
  // Three women and one man keeps the town's 3:1 ratio intact.
  const genders = ['female', 'female', 'female', 'male'];
  genders.forEach((gender, i) => {
    const name = holiday.names[gender][i % holiday.names[gender].length];
    const suitor = makeSuitor(state, {
      gender,
      name,
      holidayId: holiday.id,
      species: holiday.species,
      outfit: holiday.outfit,
      location: pick(['plaza', 'beach', 'cafe', 'park']),
      affection: i === 0 ? 6 : 0
    });
    suitor.profile.species = holiday.species;
    suitor.profile.outfit = holiday.outfit;
    suitor.bio = `In town for ${holiday.short}. ${holiday.greeting}`;
    state.suitors.push(suitor);
    newbies.push(suitor);
  });
  state.holidaySpawned.push(holidayKey);
  return newbies;
}

export function ensureBasePopulation(state) {
  const base = state.suitors.filter(s => !s.holidayId);
  const female = base.filter(s => s.gender === 'female').length;
  const male = base.filter(s => s.gender === 'male').length;
  const added = [];
  for (let i = female; i < 6; i++) {
    const s = makeSuitor(state, { gender: 'female' });
    s.location = pick(LOCATIONS.filter(l => l.id !== 'home')).id;
    state.suitors.push(s);
    added.push(s);
  }
  for (let i = male; i < 2; i++) {
    const s = makeSuitor(state, { gender: 'male' });
    s.location = pick(LOCATIONS.filter(l => l.id !== 'home')).id;
    state.suitors.push(s);
    added.push(s);
  }
  return added;
}

export function relationshipStage(affection) {
  if (affection >= 90) return { name: 'Soulmates', tone: 'soul', hearts: 5 };
  if (affection >= 72) return { name: 'Smitten', tone: 'smitten', hearts: 4 };
  if (affection >= 50) return { name: 'Crushing', tone: 'crush', hearts: 3 };
  if (affection >= 28) return { name: 'Flirty', tone: 'flirty', hearts: 2 };
  if (affection >= 12) return { name: 'Curious', tone: 'curious', hearts: 1 };
  return { name: 'Just Met', tone: 'new', hearts: 0 };
}

export function affectionBar(affection) {
  return clamp(Math.round(affection), 0, 100);
}

export function relationLabel(suitor) {
  if (suitor.married) return 'Spouse';
  return relationshipStage(suitor.affection).name;
}

export function giftDiscount(state) {
  return 0;
}

export function makeChild(state, spouse) {
  const p1 = state.mc.profile;
  const p2 = spouse.profile;
  const gender = Math.random() < 0.5 ? 'female' : 'male';
  const inherited = (key) => Math.random() < 0.5 ? p1[key] : p2[key];
  const blendColor = (a, b) => Math.random() < 0.5 ? a : b;
  const profile = {
    ...defaultProfile(gender),
    skin: blendColor(p1.skin, p2.skin),
    hair: inherited('hair'),
    hairColor: inherited('hairColor'),
    eye: inherited('eye'),
    eyeColor: inherited('eyeColor'),
    mouth: inherited('mouth'),
    body: 'petite',
    outfit: gender === 'female' ? 'sundress' : 'tee',
    species: Math.random() < 0.5 ? p1.species : p2.species,
    accessory: 'none',
    child: true
  };
  const namePool = BIRTH_NAMES[gender];
  const used = new Set(state.children.map(c => c.name));
  const name = namePool.find(n => !used.has(n)) || pick(namePool);
  return {
    id: `c${state.nextId++}`,
    name,
    gender,
    profile,
    ageYears: 0,
    monthsOld: 0,
    parents: [state.mc.name, spouse.name],
    motherId: spouse.gender === 'female' ? spouse.id : null,
    fatherName: state.mc.name,
    spouseName: spouse.name,
    bornSerial: state.daySerial,
    movedOut: false,
    marriedTo: null,
    trait: pick([
      `${spouse.name}'s laugh`,
      `${state.mc.name}'s eyes`,
      `${spouse.name}'s stubborn streak`,
      `${state.mc.name}'s sweet tooth`,
      `a brand-new constellation of freckles`
    ])
  };
}

export function childIncome(state, child) {
  if (child.movedOut) return 50;
  if (child.ageYears >= 13) return 24;
  if (child.ageYears >= 7) return 15;
  if (child.ageYears >= 3) return 10;
  return 5;
}

export function dailyIncome(state) {
  const moneyRank = state.perks.money.rank;
  const moneyPrestige = state.perks.money.prestige;
  const hustle = Math.round((6 + (moneyRank - 1) * 9) * (1 + moneyPrestige * 0.7));
  const spouseIncome = state.spouses.length * 22;
  const childBase = state.children.reduce((sum, c) => sum + childIncome(state, c), 0);
  const familyRank = state.perks.family.rank;
  const familyPrestige = state.perks.family.prestige;
  const childBonus = 1 + ((familyRank - 1) * 0.06) + familyPrestige * 0.15;
  return Math.round(hustle + spouseIncome + childBase * childBonus);
}

export function incomeBreakdown(state) {
  const moneyRank = state.perks.money.rank;
  const moneyPrestige = state.perks.money.prestige;
  const hustle = Math.round((6 + (moneyRank - 1) * 9) * (1 + moneyPrestige * 0.7));
  const spouses = state.spouses.length * 22;
  const childRaw = state.children.reduce((sum, c) => sum + childIncome(state, c), 0);
  const familyRank = state.perks.family.rank;
  const familyPrestige = state.perks.family.prestige;
  const childBonus = 1 + ((familyRank - 1) * 0.06) + familyPrestige * 0.15;
  const children = Math.round(childRaw * childBonus);
  return [
    { label: 'Hustle Heart', value: hustle },
    { label: `${state.spouses.length} spouse${state.spouses.length === 1 ? '' : 's'}`, value: spouses },
    { label: `${state.children.length} child${state.children.length === 1 ? '' : 'ren'}`, value: children }
  ];
}

export function perkUpgradeCost(state, key) {
  const def = PERK_DEFS[key];
  const p = state.perks[key];
  const rank = p.rank;
  const exponent = 1.58;
  const base = def.baseCost * Math.pow(rank, exponent);
  return Math.round(base * (1 + p.prestige * 0.85) / 5) * 5;
}

export function prestigeReward(state, key) {
  const p = state.perks[key];
  if (p.rank < 20 || p.prestige >= 3) return 0;
  return Math.round(14000 * (1 + p.prestige * 0.9) * (1 + p.rank / 20));
}

export function conceptionChance(state, spouse) {
  const fam = state.perks.family;
  const base = 0.48 + state.children.length * -0.015;
  const bonus = fam.rank * 0.018 + fam.prestige * 0.06;
  const energyPenalty = state.sleep < 45 ? 0.1 : 0;
  return clamp(base + bonus - energyPenalty, 0.2, 0.94);
}

export function dateCost(state, suitor) {
  return 40 + Math.min(30, Math.floor(suitor.affection / 5) * 2);
}

export function ringCost() { return 250; }

export function holidayStatus(state) {
  const holiday = getHoliday(state.date);
  if (!holiday) return null;
  return { ...holiday, daysLeft: holidayDaysLeft(state.date, holiday) };
}

export function monthLabel(date) { return `${MONTHS[date.month]} ${date.year}`; }

export function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

export function formatMoney(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export function timeLabel(minute) {
  const h24 = Math.floor(minute / 60) % 24;
  const m = minute % 60;
  const h = h24 % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${h24 >= 12 ? 'PM' : 'AM'}`;
}

export function dayPhase(minute) {
  if (minute >= 5 * 60 && minute < 10 * 60) return { id: 'morning', label: 'Morning', icon: 'sunrise' };
  if (minute >= 10 * 60 && minute < 17 * 60) return { id: 'day', label: 'Afternoon', icon: 'sun' };
  if (minute >= 17 * 60 && minute < 21 * 60) return { id: 'evening', label: 'Evening', icon: 'sunset' };
  return { id: 'night', label: 'Night', icon: 'moon' };
}

export function pushStory(state, text, icon = 'heart', tone = 'default') {
  state.stories.unshift({ id: `story${Date.now()}${Math.random()}`, text, icon, tone, date: `${shortDate(state.date)} · ${timeLabel(state.minute)}` });
  state.stories = state.stories.slice(0, 40);
}

export function activeDaughters(state) {
  return state.children.filter(c => c.gender === 'female' && !c.movedOut);
}
