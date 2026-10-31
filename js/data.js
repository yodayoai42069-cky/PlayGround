/* ============================================================
   data.js — town content: locations, gifts, dates, perks, bachelorettes
   ============================================================ */
(function (global) {
  'use strict';

  const LOCATIONS = [
    { id: 'Home', name: 'Your Apartment', icon: '🏠', x: 280, y: 172, blurb: 'Your humble start-up apartment. Customize your look, buy perks, grow the family.' },
    { id: 'Cafe', name: 'Aroma Cafe', icon: '☕', x: 150, y: 116, blurb: 'Fresh pastry and stronger feelings. A classic first-date spot.' },
    { id: 'Park', name: 'Sakura Park', icon: '🌸', x: 110, y: 196, blurb: 'Petals everywhere. Free to visit, easy on the heart.' },
    { id: 'Mall', name: 'Star Mall', icon: '🛍️', x: 300, y: 106, blurb: 'Gifts, movies, and a food court that never judges you.' },
    { id: 'Beach', name: 'Azure Beach', icon: '🏖️', x: 430, y: 246, blurb: 'Sun, salt, and surf instructors with killer smiles.' },
    { id: 'Shrine', name: 'Hoshimi Shrine', icon: '⛩️', x: 80, y: 44, blurb: 'Where couples pray for a future together.' },
    { id: 'Gym', name: 'Iron Bloom Gym', icon: '💪', x: 470, y: 60, blurb: 'Sweat now, glow later. Trainers here do both.' },
    { id: 'Library', name: 'Whisper Library', icon: '📚', x: 215, y: 246, blurb: 'Quiet love stories, mostly between pages.' },
    { id: 'Office', name: 'Aozora Corp', icon: '🏢', x: 330, y: 44, blurb: 'Your fresh-grad job. Clock a shift to fund the romance.' },
    { id: 'Salon', name: 'Bishoujo Salon', icon: '💇', x: 420, y: 152, blurb: 'Complete makeover for a fee. New you, same heart.' },
    { id: 'Chapel', name: 'Starlight Chapel', icon: '⛪', x: 200, y: 36, blurb: 'Where "I do" becomes "forever".' },
  ];

  // affection given per gift ≈ round(price/22 * power * multipliers)
  const GIFTS = [
    { id: 'candy', name: 'Bag of Sweets', price: 60, power: 3, icon: '🍬' },
    { id: 'flowers', name: 'Rose Bouquet', price: 110, power: 5, icon: '💐' },
    { id: 'plushie', name: 'Stuffed Animal', price: 160, power: 6, icon: '🧸' },
    { id: 'choco', name: 'Heart Chocolates', price: 190, power: 7, icon: '🍫' },
    { id: 'book', name: 'First-Edition Novel', price: 260, power: 8, icon: '📖' },
    { id: 'perfume', name: 'Perfume Set', price: 420, power: 11, icon: '🌸' },
    { id: 'gadget', name: 'Latest Gadget', price: 620, power: 13, icon: '📱' },
    { id: 'necklace', name: 'Silver Necklace', price: 850, power: 16, icon: '📿' },
    { id: 'earrings', name: 'Diamond Earrings', price: 1400, power: 20, icon: '💎' },
    { id: 'ring', name: 'Engagement Ring', price: 2500, power: 0, ring: true, icon: '💍' },
  ];

  const DATES = [
    { id: 'stroll', name: 'Park Stroll', venue: 'Park', cost: 0, power: 6, icon: '🚶' },
    { id: 'cafe', name: 'Cafe Date', venue: 'Cafe', cost: 150, power: 10, icon: '☕' },
    { id: 'cinema', name: 'Movie Night', venue: 'Mall', cost: 260, power: 13, icon: '🎬' },
    { id: 'beach', name: 'Beach Day', venue: 'Beach', cost: 300, power: 14, icon: '🏖️' },
    { id: 'dinner', name: 'Fancy Dinner', venue: 'Cafe', cost: 520, power: 18, icon: '🍝' },
    { id: 'festival', name: 'Shrine Festival', venue: 'Shrine', cost: 240, power: 14, icon: '🎆' },
    { id: 'spa', name: 'Spa Afternoon', venue: 'Salon', cost: 640, power: 20, icon: '🛁' },
    { id: 'concert', name: 'Live Concert', venue: 'Mall', cost: 900, power: 26, icon: '🎤' },
    { id: 'yacht', name: 'Yacht Cruise', venue: 'Beach', cost: 1600, power: 36, icon: '🛥️' },
  ];

  const WEDDING_FEE = 2000;
  const MAKEOVER_FEE = 500;

  // Perks: levelled, bought with money. Directly boost money + offspring.
  const PERKS = [
    { id: 'goldenTouch', name: 'Golden Touch', icon: '💰', base: 1200, max: 5, blurb: '+18% pay per shift, per level.' },
    { id: 'silverTongue', name: 'Silver Tongue', icon: '💬', base: 1000, max: 5, blurb: '+10% affection from every talk & gift.' },
    { id: 'socialStar', name: 'Town Sweetheart', icon: '✨', base: 1400, max: 5, blurb: '+14% affection from every date.' },
    { id: 'savvyShopper', name: 'Savvy Shopper', icon: '🏷️', base: 900, max: 5, blurb: 'Gifts & makeovers 9% cheaper per level.' },
    { id: 'blessedUnion', name: 'Blessed Union', icon: '🍼', base: 1500, max: 5, blurb: '+18% chance of a baby per level, brighter kids.' },
    { id: 'familyBusiness', name: 'Family Business', icon: '🏦', base: 1800, max: 5, blurb: 'Children earn +30% funds per level.' },
    { id: 'bigFamily', name: 'Big Family', icon: '👨‍👩‍👧‍👦', base: 2600, max: 3, blurb: 'Chance of twins, +1 action point per day at level 3.' },
  ];

  // Bachelorettes — the whole town is women. Each has gift taste + hangouts.
  const GIRLS = [
    {
      id: 'hikari', name: 'Hikari Aoyama', age: 22, job: 'Barista', home: 'Cafe',
      spots: ['Cafe', 'Mall'], income: 70, chemistry: 'Cheerful',
      hairStyle: 'twinTails', hairColor: 'honey', eyeColor: 'amber', skin: 'fair', faceShape: 'round', bodyType: 'petite', outfit: 'apron', accessory: 'ribbon',
      love: ['choco', 'plushie', 'candy'], like: ['flowers', 'book', 'perfume'],
      meet: "Eep— a new regular! Welcome to Aroma! First drink's on the house, okay?",
      talk: ["I saved you the corner seat today~", "The foam on your latte looked like a heart. Coincidence? Probably.", "You keep showing up... my coworkers noticed, hehe."],
      date: ["This is the happiest I've been all month!", "Hold on a sec— let's get a photo together!", "You're easy to talk to. That's rare."],
      loveLine: "I don't want a regular order anymore. I want you. Every day. Please?",
    },
    {
      id: 'yuki', name: 'Yuki Mizuno', age: 24, job: 'Librarian', home: 'Library',
      spots: ['Library', 'Cafe'], income: 85, chemistry: 'Quiet',
      hairStyle: 'bob', hairColor: 'jet', eyeColor: 'sapphire', skin: 'porcelain', faceShape: 'oval', bodyType: 'slim', outfit: 'turtleneck', accessory: 'glasses',
      love: ['book', 'perfume', 'necklace'], like: ['choco', 'gadget', 'flowers'],
      meet: "...Shh. But— welcome. Most people never come back here. You're different.",
      talk: ["I set aside a book I thought you'd like.", "You listen. Most people just wait to talk.", "The library is quiet... your voice isn't. I like that."],
      date: ["I read a passage about this exact feeling.", "You make the world less loud.", "I'd share my silence with you, always."],
      loveLine: "I've marked a page in my heart with your name. Marry me?",
    },
    {
      id: 'saki', name: 'Saki Honda', age: 23, job: 'Surf Instructor', home: 'Beach',
      spots: ['Beach', 'Gym'], income: 95, chemistry: 'Energetic',
      hairStyle: 'wavyLong', hairColor: 'caramel', eyeColor: 'emerald', skin: 'honey', faceShape: 'heart', bodyType: 'athletic', outfit: 'gym', accessory: 'starclip',
      love: ['gadget', 'plushie', 'earrings'], like: ['candy', 'choco', 'flowers'],
      meet: "Yo! New face! Bet you can't catch me on the waves. ...Kidding. Wanna try?",
      talk: ["Race you to the pier!", "You're braver than you look. I dig it.", "Sunset's better when somebody's watching it with you."],
      date: ["HA! Best. Day. EVER!", "You're not bad at all, city person.", "Come back tomorrow. And the day after."],
      loveLine: "Hey. I don't do half-measures. All in— forever. You and me?",
    },
    {
      id: 'rina', name: 'Rina Aoyama', age: 26, job: 'Office Worker', home: 'Office',
      spots: ['Office', 'Mall'], income: 150, chemistry: 'Driven',
      hairStyle: 'halfUp', hairColor: 'choco', eyeColor: 'brown', skin: 'ivory', faceShape: 'sharp', bodyType: 'tall', outfit: 'blazer', accessory: 'earrings',
      love: ['necklace', 'earrings', 'perfume'], like: ['book', 'gadget', 'flowers'],
      meet: "Fresh grad, right? Work hard here and— ...oh. You're kind of cute. Forget I said that.",
      talk: ["Corner office one day. You'll need a good view too.", "You actually finish your reports. Marry material.", "Late night at the office again... coffee's on me."],
      date: ["I cleared my whole schedule. That's a first.", "You make ambition feel like a team sport.", "Let's take the world. Together."],
      loveLine: "I don't negotiate on the things that matter. And you matter. Marry me.",
    },
    {
      id: 'meiko', name: 'Meiko Shirase', age: 25, job: 'Gym Trainer', home: 'Gym',
      spots: ['Gym', 'Beach'], income: 110, chemistry: 'Fierce',
      hairStyle: 'ponytail', hairColor: 'crimson', eyeColor: 'ruby', skin: 'tan', faceShape: 'soft', bodyType: 'statuesque', outfit: 'jersey', accessory: 'bandana',
      love: ['gadget', 'perfume', 'earrings'], like: ['candy', 'plushie', 'book'],
      meet: "You're soft. Fixable. I respect a project. One session— free.",
      talk: ["DoN't SkIp LeG dAy. ...Sorry, force of habit.", "You kept up today. I'm impressed, honestly.", "Spot me? I trust you with my heavy stuff."],
      date: ["Okay— you're officially fun.", "My heart rate's up and it's not the cardio.", "Next time I pick the place. No arguments."],
      loveLine: "I only commit hard. So: will you commit hard with me?",
    },
    {
      id: 'nana', name: 'Nana Kosaka', age: 21, job: 'Idol in Training', home: 'Mall',
      spots: ['Mall', 'Park'], income: 130, chemistry: 'Bubbly',
      hairStyle: 'spaceBuns', hairColor: 'bubblegum', eyeColor: 'rose', skin: 'porcelain', faceShape: 'round', bodyType: 'petite', outfit: 'party', accessory: 'starclip',
      love: ['plushie', 'gadget', 'choco'], like: ['flowers', 'candy', 'perfume'],
      meet: "Ehhhh~?! A fan?! Here?! In the wild?! Sign... wait, you're not a fan yet. YOU WILL BE.",
      talk: ["I wrote a song. It's about someone. No hints!", "Applause is nice but YOUR applause is different.", "Buy my merch? I'll throw in a smile. Just for you."],
      date: ["Best.date.ever!! I'm putting it in a song!", "When I'm on stage I'll look for you. Every time.", "Encore? Encore!"],
      loveLine: "My biggest hit hasn't happened yet— it's our wedding song. Say yes?",
    },
    {
      id: 'sakura', name: 'Sakura Ito', age: 24, job: 'Shrine Maiden', home: 'Shrine',
      spots: ['Shrine', 'Park'], income: 90, chemistry: 'Gentle',
      hairStyle: 'longStraight', hairColor: 'jet', eyeColor: 'forest', skin: 'fair', faceShape: 'heart', bodyType: 'slim', outfit: 'kimono', accessory: 'flower',
      love: ['flowers', 'perfume', 'necklace'], like: ['book', 'choco', 'candy'],
      meet: "Welcome to Hoshimi. The petals told me someone kind would come today.",
      talk: ["I prayed for the town's happiness today. And yours.", "The wind chimes sound different when you're near.", "Would you like a charm? I made two. One for each of us."],
      date: ["The gods seem to approve of us.", "This omamori keeps love safe. I'll keep ours safe too.", "I'd like every festival to be with you."],
      loveLine: "I asked the shrine. The answer was your name. Shall we marry?",
    },
    {
      id: 'emi', name: 'Emi Takamori', age: 27, job: 'Painter', home: 'Park',
      spots: ['Park', 'Library'], income: 80, chemistry: 'Dreamy',
      hairStyle: 'curlyPuff', hairColor: 'ginger', eyeColor: 'violet', skin: 'caramel', faceShape: 'round', bodyType: 'soft', outfit: 'sundress', accessory: 'beret',
      love: ['book', 'flowers', 'perfume'], like: ['choco', 'gadget', 'plushie'],
      meet: "Hold still— don't move! The light on your face... perfect. One portrait, please?",
      talk: ["My newest canvas is mostly your colors.", "Petals landed in your hair. I left them there on purpose.", "Art is just feelings with better posture. You're my favorite feeling."],
      date: ["I'll paint this day a hundred times.", "You're my favorite subject. And my favorite person.", "Stay until the light goes? Please?"],
      loveLine: "Every painting I start ends up being about us. Make us official?",
    },
    {
      id: 'chika', name: 'Chika Mori', age: 28, job: 'Chef', home: 'Cafe',
      spots: ['Cafe', 'Home'], income: 140, chemistry: 'Warm',
      hairStyle: 'bun', hairColor: 'chestnut', eyeColor: 'hazel', skin: 'honey', faceShape: 'oval', bodyType: 'curvy', outfit: 'maid', accessory: 'none',
      love: ['perfume', 'necklace', 'choco'], like: ['book', 'flowers', 'gadget'],
      meet: "Hungry? Everyone's hungry. Sit. Ten minutes and you'll forget your own name.",
      talk: ["A taste test. Open wide— don't be shy.", "Feeding people I like is my whole love language.", "I made too much dinner again. That's twice this week. Draw your own conclusions."],
      date: ["You ate everything. MARRY— okay, focus, Chika.", "Cooking for two is the point, isn't it?", "I want to feed you for a hundred years."],
      loveLine: "I've set the table for two every night for a year. Set the table for life?",
    },
    {
      id: 'akane', name: 'Akane Himura', age: 25, job: 'Musician', home: 'Park',
      spots: ['Park', 'Mall'], income: 120, chemistry: 'Rebel',
      hairStyle: 'wolf', hairColor: 'lavender', eyeColor: 'ice', skin: 'fair', faceShape: 'sharp', bodyType: 'athletic', outfit: 'varsity', accessory: 'phones',
      love: ['gadget', 'earrings', 'necklace'], like: ['book', 'candy', 'plushie'],
      meet: "Hey. You look like someone who actually listens. Rare. Sit— I'll play you something.",
      talk: ["New riff. It's got your name in the chords somewhere.", "Most people hear noise. You hear me.", "Catch? ...The pick. It's yours now. Don't lose it."],
      date: ["This beat's stuck in my head. So are you.", "I wrote our song already. You'll hear it at the venue.", "Encore, then breakfast. Non-negotiable."],
      loveLine: "This is the last song I'll write alone. Be in every one after?",
    },
  ];

  const FIRST_NAMES_F = ['Yui', 'Hana', 'Mei', 'Aoi', 'Rin', 'Mio', 'Sora', 'Koharu', 'Nanami', 'Hina', 'Yuna', 'Sakura', 'Ichika', 'Riko', 'Mai', 'Airi', 'Kanon', 'Tsumugi', 'Rei', 'Kaede'];
  const FIRST_NAMES_M = ['Haruto', 'Sota', 'Ren', 'Yuma', 'Kaito', 'Riku', 'Itsuki', 'Daiki', 'Sora', 'Shota', 'Kazuki', 'Hinata', 'Takumi', 'Naoki', 'Yuto', 'Aoto', 'Minato', 'Ryo', 'Suguru', 'Masato'];

  global.GameData = {
    LOCATIONS, GIFTS, DATES, PERKS, GIRLS, WEDDING_FEE, MAKEOVER_FEE,
    FIRST_NAMES_F, FIRST_NAMES_M,
    locById: (id) => LOCATIONS.find((l) => l.id === id),
    giftById: (id) => GIFTS.find((g) => g.id === id),
    girlById: (id) => GIRLS.find((g) => g.id === id),
    perkById: (id) => PERKS.find((p) => p.id === id),
  };
})(window);
