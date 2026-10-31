/* Random events and special offering spaces. */

export const EVENTS = [
  {
    id: "vending",
    title: "The Vending Machine That Shouldn't",
    kicker: "A soft hum. No plug.",
    body: "It sits between two trophy cases that were not there yesterday. The display reads: DRINK ME. The coin slot is warm. Something inside is breathing in sync with you.",
    choices: [
      { label: "Buy the mystery drink", detail: "Heal 35% max HP and gain 10 gold.", tone: "good", effect: { healPct: 0.35, gold: 10 } },
      { label: "Kick the machine", detail: "Gain 35 gold. Lose 8 HP.", tone: "pact", effect: { gold: 35, hp: -8 } },
      { label: "Leave it alone", detail: "Nothing happens. Probably.", tone: "quiet", effect: {} },
    ],
  },
  {
    id: "lost_found",
    title: "The Lost & Found",
    kicker: "Everything is labeled with your name.",
    body: "A cardboard box sits on a stool. Inside: a single glove, a house key, and a charm that has no business being warm. The lid says LOST. The side says YOURS NOW.",
    choices: [
      { label: "Take a charm", detail: "Gain a random charm.", tone: "good", effect: { randomCharm: 1 } },
      { label: "Take the expensive thing", detail: "Gain a random rare card. Lose 6 max HP.", tone: "pact", effect: { randomCard: "rare", maxHp: -6 } },
      { label: "Close the box", detail: "Gain 12 gold left under the lid.", tone: "quiet", effect: { gold: 12 } },
    ],
  },
  {
    id: "after_door",
    title: "A Door Marked AFTER",
    kicker: "The handle is on the wrong side.",
    body: "You can hear pages turning on the other side. A voice — yours, but older — says, 'Take the shortcut. I did.' The door exhales. It smells like rain and clean paper.",
    choices: [
      { label: "Open it", detail: "Draw +1 card each turn for the rest of the run.", tone: "good", effect: { drawBonus: 1 } },
      { label: "Reach through", detail: "Gain a random rare card. Lose 10 max HP.", tone: "pact", effect: { randomCard: "rare", maxHp: -10 } },
      { label: "Knock politely", detail: "Heal 15 HP.", tone: "quiet", effect: { heal: 15 } },
    ],
  },
  {
    id: "mirror_round",
    title: "The Mirror Round",
    kicker: "It is not your reflection. It is your outline.",
    body: "The mirror has been rubbed clean in the shape of a girl. When you breathe, it draws in. When you step closer, it does not.",
    choices: [
      { label: "Touch the glass", detail: "Gain +8 max HP.", tone: "good", effect: { maxHp: 8, heal: 8 } },
      { label: "Let it sharpen you", detail: "Gain +2 Strength. Lose 10 max HP.", tone: "pact", effect: { strength: 2, maxHp: -10 } },
      { label: "Cover the mirror", detail: "Gain 18 gold from the frame.", tone: "quiet", effect: { gold: 18 } },
    ],
  },
  {
    id: "study_group",
    title: "Study Group",
    kicker: "Three chairs. Four shadows.",
    body: "A circle of desks has been arranged around a candle. Notes are stacked in a neat spiral. The handwriting is yours, but the answers are better.",
    choices: [
      { label: "Study hard", detail: "Upgrade a random card permanently for this run.", tone: "good", effect: { randomUpgrade: 1 } },
      { label: "Copy the answers", detail: "Upgrade 2 random cards. Lose 8 HP.", tone: "pact", effect: { randomUpgrade: 2, hp: -8 } },
      { label: "Take the candle", detail: "Gain 20 gold.", tone: "quiet", effect: { gold: 20 } },
    ],
  },
  {
    id: "offering_bowl",
    title: "The Offering Bowl",
    kicker: "A small brass bowl. A very large appetite.",
    body: "Coins go in. They do not clink. The bowl looks at you the way a dog looks at a plate. There is a card inside, folded once, already warm.",
    choices: [
      { label: "Offer 15 gold", detail: "Gain a random uncommon card.", tone: "good", effect: { gold: -15, randomCard: "uncommon" } },
      { label: "Offer blood", detail: "Gain +12% Crit. Lose 6 max HP.", tone: "pact", effect: { crit: 0.12, maxHp: -6 } },
      { label: "Take the card", detail: "Gain a random common card.", tone: "quiet", effect: { randomCard: "common" } },
    ],
  },
  {
    id: "dog_wall",
    title: "The Dog in the Wall",
    kicker: "A tiny bark from inside the plaster.",
    body: "You knock twice. Something knocks back. A chihuahua-shaped hole appears in the wallpaper, and a pair of eyes begs you to make better choices. You are going to make a worse one.",
    choices: [
      { label: "Free the dog", detail: "Gain a random charm and heal 8 HP.", tone: "good", effect: { randomCharm: 1, heal: 8 } },
      { label: "Follow it", detail: "Gain +2 Strength. Lose 5 HP.", tone: "pact", effect: { strength: 2, hp: -5 } },
      { label: "Pet the wall", detail: "Gain 10 gold from the collar.", tone: "quiet", effect: { gold: 10 } },
    ],
  },
  {
    id: "snack_machine",
    title: "The Snack Machine",
    kicker: "Row C, slot 6. It says 'HOMEMADE'.",
    body: "The machine is stocked with tiny sandwiches wrapped in wax paper. Each one is labeled with a name you almost recognize. The coin return is full of teeth. Normal school stuff.",
    choices: [
      { label: "Eat a sandwich", detail: "Heal 30% max HP and gain 10 gold.", tone: "good", effect: { healPct: 0.3, gold: 10 } },
      { label: "Empty the coin return", detail: "Gain 45 gold. Lose 6 HP.", tone: "pact", effect: { gold: 45, hp: -6 } },
      { label: "Buy a drink", detail: "Heal 12 HP.", tone: "quiet", effect: { heal: 12 } },
    ],
  },
  {
    id: "torn_page",
    title: "A Page Torn From Tomorrow",
    kicker: "The ink is still wet.",
    body: "It describes this room. It describes your hand on the page. It describes you reading this sentence, and then it describes what you do next. The last line has been crossed out so hard the paper tore.",
    choices: [
      { label: "Read it anyway", detail: "Gain a random rare card.", tone: "good", effect: { randomCard: "rare" } },
      { label: "Read ahead", detail: "Gain 2 random rare cards. Lose 15 max HP.", tone: "pact", effect: { randomCard: "rare", randomCard2: "rare", maxHp: -15 } },
      { label: "Burn the page", detail: "Heal 20 HP.", tone: "quiet", effect: { heal: 20 } },
    ],
  },
  {
    id: "quiet_hour",
    title: "The Quiet Hour",
    kicker: "For sixty seconds, the school forgets you.",
    body: "No bells. No footsteps. Even the dust hangs still. In the silence you can hear the shape of your own deck: every card you regret, every card you have not earned yet.",
    choices: [
      { label: "Forget a card", detail: "Remove a random card from your deck. Heal 6 HP.", tone: "good", effect: { removeRandomCards: 1, heal: 6 } },
      { label: "Steal an hour", detail: "Gain +1 max Stamina. Lose 15 gold.", tone: "pact", effect: { staminaBonus: 1, gold: -15 } },
      { label: "Rest", detail: "Heal 14 HP.", tone: "quiet", effect: { heal: 14 } },
    ],
  },
  {
    id: "little_god",
    title: "The Little God of Hallways",
    kicker: "It is made of a mop, a tie, and bad posture.",
    body: "It offers you a deal in the voice of every teacher who ever said 'I'm not angry, I'm disappointed.' There is no contract. There is only a mop handle, held out like a pen.",
    choices: [
      { label: "Accept its blessing", detail: "Gain +10 max HP and heal 10.", tone: "good", effect: { maxHp: 10, heal: 10 } },
      { label: "Accept its correction", detail: "Gain +3 Strength. Lose 15 max HP.", tone: "pact", effect: { strength: 3, maxHp: -15 } },
      { label: "Decline", detail: "Gain 16 gold from its donation jar.", tone: "quiet", effect: { gold: 16 } },
    ],
  },
];

export const SPECIALS = {
  title: "The Offering Stone",
  kicker: "It only takes what you can survive. Usually.",
  body: "A black stone, waist-high, polished by a thousand nervous hands. Words appear when you touch it: GIVE SOMETHING THAT MATTERS. The stone does not specify a refund policy.",
  offerings: [
    {
      id: "iron",
      name: "Blood for Iron",
      offer: "4 max HP",
      boon: "+2 Strength",
      desc: "The stone drinks a little of your future. Your hands remember how to hurt.",
      pay: { maxHp: -4 },
      gain: { strength: 2 },
      requires: (run) => run.maxHp > 8,
      cannot: "Not enough max HP.",
    },
    {
      id: "speed",
      name: "Pride for Speed",
      offer: "1 Strength",
      boon: "+1 max Stamina",
      desc: "You give up a little certainty. In exchange, the turn lasts longer.",
      pay: { strength: -1 },
      gain: { staminaBonus: 1 },
      requires: (run) => run.strength >= 1,
      cannot: "Requires at least 1 Strength.",
    },
    {
      id: "fate",
      name: "Coin for Fate",
      offer: "30 gold",
      boon: "+12% Crit",
      desc: "The stone spits your coins back as sparks. Luck is just a different kind of debt.",
      pay: { gold: -30 },
      gain: { crit: 0.12 },
      requires: (run) => run.gold >= 30,
      cannot: "Requires 30 gold.",
    },
    {
      id: "memory",
      name: "Memory for Power",
      offer: "2 random cards",
      boon: "+1 draw each turn",
      desc: "Two memories are erased. The empty space is immediately filled with a better idea.",
      pay: { removeRandomCards: 2 },
      gain: { drawBonus: 1 },
      requires: (run) => run.deck.length > 4,
      cannot: "Deck is too small.",
    },
    {
      id: "taco",
      name: "Vitality for the Boy",
      offer: "5 max HP",
      boon: "Taco +10 max HP, +3 bite",
      desc: "Taco licks the stone. The stone takes a little of you instead. He seems pleased.",
      pay: { maxHp: -5 },
      gain: { tacoMax: 10, tacoAttack: 3 },
      requires: (run) => run.char === "brittany" && run.maxHp > 8,
      cannot: "Brittany only. Taco does not answer to strangers.",
    },
  ],
};

export const TIPS = [
  {
    title: "Stamina is the clock",
    body: "Every card costs Stamina. You refill at the start of each turn. Spend it all, or save a little for a perfect follow-up — the board does not wait.",
  },
  {
    title: "The map is a checkerboard",
    body: "Climb one row at a time. Your next steps are the diagonal or straight-up tiles. Shops, events, offerings, and elite fights are all optional in the short term. The boss is not.",
  },
  {
    title: "Three runarounds",
    body: "Each run climbs three acts. Clear the Hall Monitor, the Curator, and finally the Headmistress. Die and the board resets — but Ash and permanent upgrades remain.",
  },
  {
    title: "Book, Bleed, Bite",
    body: "Marron's Book triggers at 10 stacks for 15% max HP. Elizabeth's Bleed ticks at the start of the enemy turn. Brittany's Taco intercepts attacks, so keep him alive.",
  },
  {
    title: "Prestige is a beautiful reset",
    body: "Reset all permanent upgrades to earn a new outfit for every girl. Three prestiges, three looks. The staircase remembers everything else.",
  },
];
