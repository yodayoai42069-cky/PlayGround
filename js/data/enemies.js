/* Enemies, encounters, acts, and charms. */

export const ACTS = {
  1: {
    name: "The Lower Halls",
    roman: "I",
    subtitle: "Chalk dust, bad lighting, worse intentions.",
    boss: "The Hall Monitor",
    tint: "#b9a98e",
  },
  2: {
    name: "The Gilded Archive",
    roman: "II",
    subtitle: "Everything worth knowing is locked away.",
    boss: "The Curator",
    tint: "#9fb3a3",
  },
  3: {
    name: "The Headmistress's Wing",
    roman: "III",
    subtitle: "The last door. The final bell.",
    boss: "The Headmistress",
    tint: "#c9a2a2",
  },
};

export const ENEMIES = {
  /* ---------- ACT I ---------- */
  ink_blot: {
    name: "Ink Blot", hp: 24, act: 1, crest: "I", tags: ["Bleeder"], color: "#82618b",
    flavor: "A spill with a grudge.",
    pattern: [0, 1, 0, 2],
    moves: [
      { name: "Spatter", dmg: 5 },
      { name: "Ink Stain", status: { type: "bleed", amount: 2 } },
      { name: "Smear", dmg: 7 },
    ],
  },
  page_mite: {
    name: "Page Mite", hp: 16, act: 1, crest: "II", tags: ["Swarm"], color: "#9a875e",
    flavor: "It has eaten three footnotes and a bookmark.",
    pattern: [0, 1, 0],
    moves: [
      { name: "Nibble", dmg: 3, hits: 2 },
      { name: "Paper Cut", dmg: 2, status: { type: "bleed", amount: 1 } },
    ],
  },
  chalk_hound: {
    name: "Chalk Hound", hp: 28, act: 1, crest: "III", tags: ["Buffer"], color: "#b0a48a",
    flavor: "Its bark writes detentions in the air.",
    pattern: [0, 1, 2],
    moves: [
      { name: "Pack Tactics", strengthAll: 1 },
      { name: "Scratch", dmg: 6 },
      { name: "White Dust", block: 7 },
    ],
  },
  detention_wisp: {
    name: "Detention Wisp", hp: 22, act: 1, crest: "IV", tags: ["Debuffer"], color: "#7a9a96",
    flavor: "A small, patient bad grade.",
    pattern: [0, 1, 2],
    moves: [
      { name: "Tsk Tsk", status: { type: "weak", amount: 2 } },
      { name: "Late Pass", dmg: 6 },
      { name: "Disappointment", status: { type: "vulnerable", amount: 1 } },
    ],
  },
  prefect: {
    name: "The Prefect", hp: 64, act: 1, elite: true, crest: "V", tags: ["Taunt", "Buffer"], color: "#ad6d58",
    flavor: "She has never once been late. It is the only thing she has.",
    pattern: [0, 2, 1, 3],
    moves: [
      { name: "Stand Still", taunt: true, block: 10 },
      { name: "Hall Sweep", dmg: 9 },
      { name: "Corrective Action", strengthAll: 2 },
      { name: "Write-Up", dmg: 10, status: { type: "bleed", amount: 1 } },
    ],
  },
  ink_tyrant: {
    name: "Ink Tyrant", hp: 70, act: 1, elite: true, crest: "VI", tags: ["Summoner", "Bleeder"], color: "#6f557b",
    flavor: "A blot that learned to sign its name.",
    pattern: [0, 1, 2, 1],
    moves: [
      { name: "Copy Room", summon: "page_mite" },
      { name: "Tendril", dmg: 7, status: { type: "bleed", amount: 2 } },
      { name: "Hardened Ink", block: 8, strength: 1 },
    ],
  },
  hall_pass: {
    name: "Hall Pass", hp: 14, act: 1, minion: true, crest: "·", tags: ["Minion"], color: "#9f9478",
    flavor: "Forged. Obviously.",
    pattern: [0, 1],
    moves: [
      { name: "Permission Slip", dmg: 3 },
      { name: "Laminated", block: 4 },
    ],
  },

  /* ---------- ACT II ---------- */
  gilded_sentinel: {
    name: "Gilded Sentinel", hp: 55, act: 2, crest: "I", tags: ["Shielded"], color: "#b29b62", block: 12,
    flavor: "Polished to a mirror shine. It reflects only wealth.",
    pattern: [0, 1, 2],
    moves: [
      { name: "Gilt Guard", block: 10, dmg: 5 },
      { name: "Golden Rule", dmg: 9 },
      { name: "Restoration", block: 15 },
    ],
  },
  whisper_choir: {
    name: "Whisper Choir", hp: 42, act: 2, crest: "II", tags: ["Buffer"], color: "#8495a9",
    flavor: "A hundred voices, all agreeing with the wrong person.",
    pattern: [0, 1, 0],
    moves: [
      { name: "Hymn", strengthAll: 1, healAll: 3 },
      { name: "Dissonance", dmg: 4, aoe: true },
    ],
  },
  harpy_prefect: {
    name: "Harpy Prefect", hp: 48, act: 2, crest: "III", tags: ["Bleeder"], color: "#a66e7c",
    flavor: "She takes attendance with her talons.",
    pattern: [0, 1, 2],
    moves: [
      { name: "Talon Roll", dmg: 5, hits: 2, status: { type: "bleed", amount: 1 } },
      { name: "Shriek", status: { type: "bleed", amount: 3 } },
      { name: "Dive", dmg: 10 },
    ],
  },
  book_wyrm: {
    name: "Book Wyrm", hp: 60, act: 2, crest: "IV", tags: ["Summoner"], color: "#5f8068",
    flavor: "It only eats first editions. And prefects.",
    pattern: [0, 1, 0, 2],
    moves: [
      { name: "Spine Split", summon: "margin_mite" },
      { name: "Paper Breath", dmg: 8 },
      { name: "Bindery", block: 10 },
    ],
  },
  margin_mite: {
    name: "Margin Mite", hp: 15, act: 2, minion: true, crest: "·", tags: ["Minion", "Bleeder"], color: "#7c8e70",
    flavor: "A footnote with teeth.",
    pattern: [0],
    moves: [
      { name: "Bite the Footnote", dmg: 3, status: { type: "bleed", amount: 1 } },
    ],
  },
  mirror_page: {
    name: "Mirror Page", hp: 38, act: 2, crest: "V", tags: ["Debuffer", "Shielded"], color: "#8a9bb4",
    flavor: "It shows you the grade you deserved.",
    pattern: [0, 1, 2],
    moves: [
      { name: "Reflect", block: 8, status: { type: "vulnerable", amount: 1 } },
      { name: "Glass Cut", dmg: 6 },
      { name: "Self-Doubt", status: { type: "weak", amount: 2 } },
    ],
  },
  head_librarian: {
    name: "The Head Librarian", hp: 100, act: 2, elite: true, crest: "VI", tags: ["Shielded", "Buffer"], color: "#7b7d68", block: 15,
    flavor: "Her silence has a due date.",
    pattern: [0, 1, 2, 3],
    moves: [
      { name: "Read-Only", block: 18, strength: 1 },
      { name: "Due Process", dmg: 10, hits: 2 },
      { name: "Staff Meeting", strengthAll: 2 },
      { name: "Red Ink", dmg: 6, status: { type: "bleed", amount: 2 } },
    ],
  },
  ink_chorus: {
    name: "Ink Chorus", hp: 88, act: 2, elite: true, crest: "VII", tags: ["Summoner", "Bleeder"], color: "#745d81",
    flavor: "Every page it touches starts screaming.",
    pattern: [0, 1, 2, 1],
    moves: [
      { name: "Print Run", summon: "margin_mite" },
      { name: "Splash", dmg: 7, aoe: true, status: { type: "bleed", amount: 1 } },
      { name: "Black Choir", strengthAll: 2 },
    ],
  },
  filing_wisp: {
    name: "Filing Wisp", hp: 18, act: 2, minion: true, crest: "·", tags: ["Minion", "Debuffer"], color: "#8d947e",
    flavor: "Filed under: your problem now.",
    pattern: [0, 1],
    moves: [
      { name: "Misfile", status: { type: "vulnerable", amount: 1 } },
      { name: "Paper Trail", dmg: 4 },
    ],
  },

  /* ---------- ACT III ---------- */
  censor: {
    name: "The Censor", hp: 62, act: 3, crest: "I", tags: ["Debuffer", "Shielded"], color: "#8f7f87", block: 10,
    flavor: "She has blacked out better people than you.",
    pattern: [0, 1, 2, 0],
    moves: [
      { name: "Redact", status: { type: "weak", amount: 2 }, status2: { type: "vulnerable", amount: 1 } },
      { name: "Black Bar", block: 12 },
      { name: "Errata", dmg: 8 },
    ],
  },
  clockwork_governess: {
    name: "Clockwork Governess", hp: 75, act: 3, crest: "II", tags: ["Taunt", "Shielded"], color: "#a39272", block: 10,
    flavor: "Her patience is wound tight enough to break.",
    pattern: [0, 1, 2, 0],
    moves: [
      { name: "Ring the Bell", taunt: true, block: 12 },
      { name: "Metronome", dmg: 9, hits: 2 },
      { name: "Wind Up", strengthAll: 2 },
    ],
  },
  red_monitor: {
    name: "Crimson Monitor", hp: 68, act: 3, crest: "III", tags: ["Bleeder"], color: "#a45d60",
    flavor: "She marks in red because it is the only color she sees.",
    pattern: [0, 1, 2],
    moves: [
      { name: "Red Pen", dmg: 7, hits: 2, status: { type: "bleed", amount: 2 } },
      { name: "Marginal", status: { type: "bleed", amount: 4 } },
      { name: "Final Grade", dmg: 13 },
    ],
  },
  detention_angel: {
    name: "Detention Angel", hp: 70, act: 3, crest: "IV", tags: ["Buffer", "Healer"], color: "#a8a28f",
    flavor: "She keeps the worst students alive so they can suffer longer.",
    pattern: [0, 1, 2],
    moves: [
      { name: "Mercy", healAll: 8, strengthAll: 1 },
      { name: "Choir of Hours", dmg: 9, aoe: true },
      { name: "Halo", block: 10, status: { type: "weak", amount: 1 } },
    ],
  },
  index_hydra: {
    name: "Index Hydra", hp: 82, act: 3, crest: "V", tags: ["Summoner"], color: "#617c6d",
    flavor: "Cut off one citation. Three more appear.",
    pattern: [0, 1, 2],
    moves: [
      { name: "Cross-Index", summon: "index_wisp" },
      { name: "Two Heads", dmg: 8, hits: 2 },
      { name: "Authority File", strengthAll: 2 },
    ],
  },
  index_wisp: {
    name: "Index Wisp", hp: 16, act: 3, minion: true, crest: "·", tags: ["Minion"], color: "#7f927c",
    flavor: "See also: bad news.",
    pattern: [0, 1],
    moves: [
      { name: "See Also", dmg: 4 },
      { name: "Footnote", block: 5 },
    ],
  },

  /* ---------- BOSSES ---------- */
  hall_monitor: {
    name: "The Hall Monitor", hp: 150, act: 1, boss: true, crest: "♛", tags: ["Taunt", "Summoner", "Buffer"], color: "#d0a56e", block: 8,
    flavor: "The first rule is that there are no rules. She wrote that one herself.",
    pattern: [0, 1, 2, 3, 4],
    moves: [
      { name: "Lights Out", taunt: true, block: 10 },
      { name: "Tardy Slip", dmg: 9, status: { type: "bleed", amount: 1 } },
      { name: "Raise Your Hand", summon: "hall_pass" },
      { name: "Correction", strengthAll: 2, block: 8 },
      { name: "Final Bell", dmg: 7, hits: 2 },
    ],
  },
  curator: {
    name: "The Curator", hp: 230, act: 2, boss: true, crest: "♛", tags: ["Shielded", "Summoner", "Buffer"], color: "#c4ad76", block: 20,
    flavor: "Everything in this archive belongs to her. Including you, eventually.",
    pattern: [0, 1, 2, 3, 4],
    moves: [
      { name: "Preservation", block: 15, heal: 5 },
      { name: "Acquisitions", summon: "filing_wisp" },
      { name: "Gilded Edge", dmg: 10, hits: 2 },
      { name: "Collection", strengthAll: 3 },
      { name: "Deaccession", dmg: 18, status: { type: "bleed", amount: 2 } },
    ],
  },
  headmistress: {
    name: "The Headmistress", hp: 340, act: 3, boss: true, crest: "♛", tags: ["Taunt", "Shielded", "Summoner", "Bleeder", "Buffer"], color: "#d79b9b", block: 25,
    flavor: "She has been playing this game since before you were a line on a form.",
    pattern: [0, 1, 2, 3, 4, 5],
    moves: [
      { name: "Pop Quiz", dmg: 8, hits: 2 },
      { name: "Detention", summon: "hall_pass", status: { type: "bleed", amount: 2 } },
      { name: "Silence", status: { type: "weak", amount: 2 }, status2: { type: "vulnerable", amount: 2 } },
      { name: "Correction", strengthAll: 3, block: 20 },
      { name: "Expulsion", dmg: 24 },
      { name: "The Bell Curve", healAll: 10, block: 15 },
    ],
  },
};

export const NORMAL_ENCOUNTERS = {
  1: [
    ["ink_blot", "page_mite"],
    ["chalk_hound", "detention_wisp"],
    ["ink_blot", "ink_blot"],
    ["page_mite", "chalk_hound"],
  ],
  2: [
    ["gilded_sentinel", "whisper_choir"],
    ["harpy_prefect", "mirror_page"],
    ["book_wyrm", "whisper_choir"],
    ["gilded_sentinel", "gilded_sentinel"],
  ],
  3: [
    ["censor", "clockwork_governess"],
    ["red_monitor", "detention_angel"],
    ["index_hydra", "mirror_page"],
    ["censor", "red_monitor", "index_wisp"],
  ],
};

export const ELITE_ENCOUNTERS = {
  1: [["prefect", "page_mite"], ["ink_tyrant", "ink_blot"]],
  2: [["head_librarian", "whisper_choir"], ["ink_chorus", "gilded_sentinel"]],
  3: [["head_librarian", "clockwork_governess"], ["ink_chorus", "censor", "detention_angel"]],
};

export const BOSS_ENCOUNTERS = {
  1: ["hall_monitor", "hall_pass"],
  2: ["curator", "filing_wisp"],
  3: ["headmistress"],
};

export const STATUS_INFO = {
  bleed: { name: "Bleed", sigil: "✚", color: "#d46e6e", desc: "Takes damage equal to stacks at the start of its turn, then loses 1 stack." },
  book: { name: "Book", sigil: "▤", color: "#9bb58b", desc: "At 10 stacks, consume 10 and take 15% of max HP as damage." },
  weak: { name: "Weak", sigil: "↓", color: "#94a3b8", desc: "Deals 25% less damage. Loses 1 stack each turn." },
  vulnerable: { name: "Vulnerable", sigil: "✧", color: "#d8a35d", desc: "Takes 50% more damage. Loses 1 stack each turn." },
  strength: { name: "Strength", sigil: "↑", color: "#e0a267", desc: "Adds damage to each attack hit." },
};

export function moveIntent(move, enemy) {
  const parts = [];
  if (move.dmg) parts.push(`${move.dmg}${move.hits > 1 ? `×${move.hits}` : ""} DMG${move.aoe ? " ALL" : ""}`);
  if (move.block) parts.push(`${move.block} BLOCK`);
  if (move.taunt) parts.push("TAUNT");
  if (move.summon) parts.push("SUMMON");
  if (move.strength) parts.push(`+${move.strength} STR`);
  if (move.strengthAll) parts.push(`+${move.strengthAll} STR ALL`);
  if (move.heal) parts.push(`HEAL ${move.heal}`);
  if (move.healAll) parts.push(`HEAL ALL ${move.healAll}`);
  if (move.status) parts.push(`${move.status.amount} ${move.status.type.toUpperCase()}`);
  if (move.status2) parts.push(`${move.status2.amount} ${move.status2.type.toUpperCase()}`);
  return parts.join(" · ") || "WAIT";
}

export const CHARMS = {
  iron_ribbon: {
    name: "Iron Ribbon", sigil: "✦", desc: "Begin each combat with +1 Strength.",
    combatStart: ({ combat }) => { combat.player.strength += 1; },
  },
  pocket_watch: {
    name: "Pocket Watch", sigil: "◷", desc: "Draw 1 extra card on the first turn of each combat.",
    combatStart: ({ combat }) => { combat.firstTurnDraw += 1; },
  },
  red_thread: {
    name: "Red Thread", sigil: "◈", desc: "Gain +8% Critical chance.",
    combatStart: ({ combat }) => { combat.player.crit = Math.min(0.9, combat.player.crit + 0.08); },
  },
  silver_thimble: {
    name: "Silver Thimble", sigil: "◉", desc: "Begin each combat with 8 Overshield.",
    combatStart: ({ combat }) => { combat.player.overshield += 8; },
  },
  ink_bottle: {
    name: "Ink Bottle", sigil: "▤", desc: "Begin each combat by applying 2 Book to all enemies.",
    combatStart: ({ game }) => { game.combat.enemies.forEach((enemy) => game.addBook(enemy, 2, true)); },
  },
  dog_whistle: {
    name: "Dog Whistle", sigil: "♢", desc: "Taco gains +4 max HP and +2 bite damage.",
    combatStart: ({ combat }) => {
      if (combat.taco) {
        combat.taco.maxHp += 4;
        combat.taco.hp += 4;
        combat.taco.attack += 2;
      }
    },
  },
  matchbook: {
    name: "Matchbook", sigil: "▲", desc: "Gain +1 Stamina on the first turn of each combat.",
    combatStart: ({ combat }) => { combat.firstTurnStamina += 1; },
  },
  coin_purse: {
    name: "Coin Purse", sigil: "¤", desc: "Gain an extra 8 gold after every battle.",
    afterBattle: ({ run }) => { run.gold += 8; },
  },
  vital_tea: {
    name: "Vital Tea", sigil: "♨", desc: "Heal 8 HP after every battle.",
    afterBattle: ({ run }) => { run.hp = Math.min(run.maxHp, run.hp + 8); },
  },
  thorn_pin: {
    name: "Thorn Pin", sigil: "✶", desc: "When an enemy hits you, it takes 2 damage.",
    combatStart: ({ combat }) => { combat.thorns += 2; },
  },
  blue_flower: {
    name: "Blue Flower", sigil: "✿", desc: "Gain +10 max HP and heal 10 when acquired.",
    onAcquire: ({ run }) => { run.maxHp += 10; run.hp += 10; },
  },
};
