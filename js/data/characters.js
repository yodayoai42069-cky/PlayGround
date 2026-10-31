/* THE CHECKERBOARD — characters, outfits, meta progression */

export const SAVE_KEY = "checkerboard-save-v2";
export const CHARACTER_IDS = ["roxy", "marron", "elizabeth", "brittany"];

export const CHARACTERS = {
  roxy: {
    id: "roxy",
    name: "Roxy",
    epithet: "The Red-Handed",
    number: "01",
    color: "#e96545",
    colorSoft: "#7e2f22",
    ink: "#ffd9c9",
    bio: "Tan, loud, and allergic to losing. Roxy hits fast, hits twice, and lives for the crack of a critical hit.",
    style: "Critical damage · Multi-hit",
    difficulty: "Aggressive",
    hp: 74,
    stamina: 3,
    draw: 5,
    crit: 0.15,
    critDamage: 1.8,
    passive: {
      name: "Hot Streak",
      text: "Every critical hit grants +8% Crit for the rest of the turn. Critical hits deal 180% damage.",
    },
    starter: ["jab", "jab", "one_two", "hook", "cheap_shot", "knuckle_up", "flurry", "haymaker", "redline", "brace"],
    outfits: [
      { name: "Wifebeater & Torn Denim", file: "assets/img/roxy.jpg", tier: 0, note: "The original bad idea." },
      { name: "Hellcat Leather", file: "assets/img/roxy_1102.jpg", tier: 1, note: "Borrowed jacket. Never returned." },
      { name: "Knockout Red", file: "assets/img/roxy_1103.jpg", tier: 2, note: "Wraps on. World off." },
      { name: "Crimson Suit", file: "assets/img/roxy_1104.jpg", tier: 3, note: "She cleans up. Somebody doesn't." },
    ],
  },
  marron: {
    id: "marron",
    name: "Marron",
    epithet: "The Marginalia",
    number: "02",
    color: "#9cb98b",
    colorSoft: "#3b4e35",
    ink: "#e9f2df",
    bio: "A nervous librarian with a memory like a bear trap. Every fact she files is another nail in your coffin.",
    style: "Book stacks · Percentage damage",
    difficulty: "Methodical",
    hp: 70,
    stamina: 3,
    draw: 5,
    crit: 0.05,
    critDamage: 1.5,
    passive: {
      name: "Overdue",
      text: "When an enemy reaches 10 Book, consume 10 and deal damage equal to 15% of that enemy's max HP.",
    },
    starter: ["read", "read", "marginalia", "shush", "due_date", "bookmark", "bookmark", "index", "cite_sources", "whisper"],
    outfits: [
      { name: "Knit Sweater & Slacks", file: "assets/img/marron.jpg", tier: 0, note: "Soft, sensible, entirely underestimated." },
      { name: "Fern Cardigan", file: "assets/img/marron_2203.jpg", tier: 1, note: "The cardigan has pockets. So does she." },
      { name: "Dark Academia", file: "assets/img/marron_2204.jpg", tier: 2, note: "A tartan warning shot." },
      { name: "Midnight Archive", file: "assets/img/marron_2205.jpg", tier: 3, note: "The library dresses for revenge." },
    ],
  },
  elizabeth: {
    id: "elizabeth",
    name: "Elizabeth",
    epithet: "The White Queen",
    number: "03",
    color: "#b7c5df",
    colorSoft: "#4e5d7d",
    ink: "#eef4ff",
    bio: "Knows the rules better than the people who wrote them. Bleeds opponents dry behind a wall of polished overshield.",
    style: "Bleed · Overshield",
    difficulty: "Controlled",
    hp: 78,
    stamina: 3,
    draw: 5,
    crit: 0.05,
    critDamage: 1.5,
    passive: {
      name: "Gilded Guard",
      text: "Overshield persists between turns. Begin each combat with 5 Overshield.",
    },
    starter: ["cut", "cut", "parry", "noble_guard", "riposte", "lunge", "white_glove", "thousand_cuts", "regal_bearing", "duel"],
    outfits: [
      { name: "White Dress", file: "assets/img/elizabeth.jpg", tier: 0, note: "Immaculate. Intimidating. Obviously." },
      { name: "Navy Rider", file: "assets/img/elizabeth_3304.jpg", tier: 1, note: "Dressage, but with a saber." },
      { name: "Silver Duelist", file: "assets/img/elizabeth_3305.jpg", tier: 2, note: "At midnight, everyone is beneath her." },
      { name: "Gold Sovereign", file: "assets/img/elizabeth_3306.jpg", tier: 3, note: "The board bows when she enters." },
    ],
  },
  brittany: {
    id: "brittany",
    name: "Brittany",
    epithet: "The Sunshine State",
    number: "04",
    color: "#f0a1b2",
    colorSoft: "#8e4d5e",
    ink: "#ffe9ef",
    bio: "Not the sharpest knife in the drawer, but she brought a dog. Taco takes the hits so she doesn't have to.",
    style: "Summon · Scaling pet",
    difficulty: "Protective",
    hp: 82,
    stamina: 3,
    draw: 5,
    crit: 0.05,
    critDamage: 1.5,
    passive: {
      name: "Ride or Die",
      text: "Taco intercepts single-target attacks while alive. He bites for 3 at the start of each turn and grows with high-cost cards.",
    },
    starter: ["fetch", "fetch", "good_boy", "big_bark", "zoomies", "taco_tuesday", "guard_dog", "puppy_power", "beg", "taco_returns"],
    outfits: [
      { name: "Pink Blouse & Khakis", file: "assets/img/brittany.jpg", tier: 0, note: "California casual, zero survival instinct." },
      { name: "Varsity Pink", file: "assets/img/brittany_4405.jpg", tier: 1, note: "Letterman jacket, emotional support dog." },
      { name: "Sunset Pier", file: "assets/img/brittany_4406.jpg", tier: 2, note: "Golden hour, sharper teeth." },
      { name: "Rose Gold", file: "assets/img/brittany_4407.jpg", tier: 3, note: "Taco has a bow tie. It's serious now." },
    ],
  },
};

export const META_UPGRADES = [
  { id: "vitality", name: "Vitality", sigil: "♥", max: 5, base: 30, step: 25, desc: "+5 max HP per rank." },
  { id: "edge", name: "Edge", sigil: "✦", max: 5, base: 35, step: 30, desc: "+1 damage per attack hit, per rank." },
  { id: "fortune", name: "Fortune", sigil: "¤", max: 5, base: 25, step: 20, desc: "+15 starting gold per rank." },
  { id: "instinct", name: "Instinct", sigil: "◈", max: 4, base: 40, step: 35, desc: "+4% critical chance per rank." },
  { id: "endurance", name: "Endurance", sigil: "◉", max: 1, base: 110, step: 0, desc: "+1 max Stamina. A rare luxury." },
  { id: "insight", name: "Insight", sigil: "☰", max: 2, base: 120, step: 90, desc: "+1 card drawn each turn." },
];

export const DEFAULT_META = {
  ash: 0,
  totalAsh: 0,
  prestige: 0,
  upgrades: { vitality: 0, edge: 0, fortune: 0, instinct: 0, endurance: 0, insight: 0 },
  unlocks: { roxy: 0, marron: 0, elizabeth: 0, brittany: 0 },
  outfit: { roxy: 0, marron: 0, elizabeth: 0, brittany: 0 },
  runs: 0,
  clears: 0,
  bestAct: 0,
  bossKills: 0,
  sincePrestige: 0,
  seenIntro: false,
};

export function mergeMeta(saved) {
  const base = JSON.parse(JSON.stringify(DEFAULT_META));
  if (!saved || typeof saved !== "object") return base;
  for (const key of Object.keys(base)) {
    if (key === "upgrades" || key === "unlocks" || key === "outfit") {
      if (saved[key] && typeof saved[key] === "object") Object.assign(base[key], saved[key]);
    } else if (typeof saved[key] === typeof base[key]) {
      base[key] = saved[key];
    }
  }
  base.prestige = Math.max(0, Math.min(3, Number(base.prestige) || 0));
  if (saved.sincePrestige == null) base.sincePrestige = base.prestige ? 0 : base.runs;
  base.sincePrestige = Math.max(0, Number(base.sincePrestige) || 0);
  for (const id of CHARACTER_IDS) {
    base.unlocks[id] = Math.max(0, Math.min(3, Number(base.unlocks[id]) || 0));
    base.outfit[id] = Math.max(0, Math.min(3, Number(base.outfit[id]) || 0));
  }
  return base;
}

export function metaUpgradeCost(upgrade, level) {
  return upgrade.base + upgrade.step * level;
}

export function characterOutfit(id, tier = 0) {
  const list = CHARACTERS[id].outfits;
  return list[Math.min(tier, list.length - 1)] || list[0];
}

export const PRESTIGE_STYLES = [
  { tier: 1, name: "After Hours", line: "The second look. Earned by starting over." },
  { tier: 2, name: "No Holds Barred", line: "The third look. The staircase remembers." },
  { tier: 3, name: "Crown of Ash", line: "The final look. Nothing left to prove." },
];
