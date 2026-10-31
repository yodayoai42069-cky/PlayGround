/* Cards, effect values, and text rendering. */

export const CARD_TYPE_LABEL = { attack: "Attack", skill: "Skill", power: "Power" };

export const CARDS = {
  /* ---------------- ROXY ---------------- */
  jab: {
    name: "Jab", char: "roxy", cost: 1, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 3, hits: 2 }],
  },
  one_two: {
    name: "One-Two", char: "roxy", cost: 1, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 4, hits: 1 }, { kind: "damage", amount: 2, hits: 1 }],
  },
  hook: {
    name: "Hook", char: "roxy", cost: 1, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 5, hits: 1 }, { kind: "status", status: "vulnerable", amount: 1, target: "enemy" }],
  },
  cheap_shot: {
    name: "Cheap Shot", char: "roxy", cost: 0, type: "attack", rarity: "starter", target: "enemy", exhaust: true,
    effects: [{ kind: "damage", amount: 3, hits: 1 }, { kind: "status", status: "crit", amount: 10, target: "self" }],
  },
  knuckle_up: {
    name: "Knuckle Up", char: "roxy", cost: 1, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 2, hits: 3 }, { kind: "status", status: "crit", amount: 6, target: "self" }],
  },
  flurry: {
    name: "Flurry", char: "roxy", cost: 2, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 3, hits: 3 }],
  },
  haymaker: {
    name: "Haymaker", char: "roxy", cost: 2, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 13, hits: 1 }],
  },
  redline: {
    name: "Redline", char: "roxy", cost: 2, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "status", status: "crit", amount: 10, target: "self" }, { kind: "damage", amount: 6, hits: 2 }],
  },
  brace: {
    name: "Brace", char: "roxy", cost: 1, type: "skill", rarity: "starter", target: "self",
    effects: [{ kind: "block", amount: 6 }],
  },
  cross: {
    name: "Cross", char: "roxy", cost: 1, type: "attack", rarity: "common", target: "enemy",
    effects: [{ kind: "damage", amount: 4, hits: 1 }, { kind: "draw", amount: 1 }],
  },
  split_lip: {
    name: "Split Lip", char: "roxy", cost: 1, type: "attack", rarity: "common", target: "enemy",
    effects: [{ kind: "damage", amount: 7, hits: 1 }, { kind: "status", status: "vulnerable", amount: 1, target: "enemy" }],
  },
  showboat: {
    name: "Showboat", char: "roxy", cost: 1, type: "skill", rarity: "common", target: "self",
    effects: [{ kind: "block", amount: 6 }, { kind: "draw", amount: 1 }],
  },
  heat_check: {
    name: "Heat Check", char: "roxy", cost: 1, type: "attack", rarity: "common", target: "enemy",
    effects: [{ kind: "damage", amount: 8, hits: 1 }, { kind: "status", status: "crit", amount: 8, target: "self" }],
  },
  lucky_break: {
    name: "Lucky Break", char: "roxy", cost: 0, type: "skill", rarity: "common", target: "self", exhaust: true,
    effects: [{ kind: "status", status: "crit", amount: 12, target: "self" }, { kind: "draw", amount: 1 }],
  },
  backhand: {
    name: "Backhand", char: "roxy", cost: 1, type: "attack", rarity: "uncommon", target: "enemy",
    effects: [{ kind: "damage", amount: 3, hits: 2 }, { kind: "status", status: "weak", amount: 1, target: "enemy" }],
  },
  war_cry: {
    name: "War Cry", char: "roxy", cost: 1, type: "skill", rarity: "uncommon", target: "self", exhaust: true,
    effects: [{ kind: "strength", amount: 2 }],
  },
  finisher: {
    name: "Finisher", char: "roxy", cost: 2, type: "attack", rarity: "uncommon", target: "enemy",
    effects: [{ kind: "damage", amount: 16, hits: 1 }],
  },
  overdrive: {
    name: "Overdrive", char: "roxy", cost: 3, type: "attack", rarity: "rare", target: "enemy",
    effects: [{ kind: "status", status: "crit", amount: 20, target: "self" }, { kind: "damage", amount: 4, hits: 3 }],
  },
  encore: {
    name: "Encore", char: "roxy", cost: 2, type: "attack", rarity: "rare", target: "enemy",
    effects: [{ kind: "damage", amount: 5, hits: 2 }, { kind: "draw", amount: 2 }],
  },

  /* ---------------- MARRON ---------------- */
  read: {
    name: "Read", char: "marron", cost: 1, type: "skill", rarity: "starter", target: "enemy",
    effects: [{ kind: "status", status: "book", amount: 2, target: "enemy" }, { kind: "draw", amount: 1 }],
  },
  marginalia: {
    name: "Marginalia", char: "marron", cost: 1, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 3, hits: 1 }, { kind: "status", status: "book", amount: 2, target: "enemy" }],
  },
  shush: {
    name: "Shush", char: "marron", cost: 1, type: "skill", rarity: "starter", target: "enemy",
    effects: [{ kind: "status", status: "weak", amount: 2, target: "enemy" }, { kind: "status", status: "book", amount: 1, target: "enemy" }],
  },
  due_date: {
    name: "Due Date", char: "marron", cost: 2, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 7, hits: 1 }, { kind: "status", status: "book", amount: 3, target: "enemy" }],
  },
  bookmark: {
    name: "Bookmark", char: "marron", cost: 1, type: "skill", rarity: "starter", target: "enemy",
    effects: [{ kind: "block", amount: 6 }, { kind: "status", status: "book", amount: 1, target: "enemy" }],
  },
  index: {
    name: "Index", char: "marron", cost: 0, type: "skill", rarity: "starter", target: "self", exhaust: true,
    effects: [{ kind: "draw", amount: 2 }],
  },
  cite_sources: {
    name: "Cite Sources", char: "marron", cost: 2, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 5, hits: 1 }, { kind: "status", status: "book", amount: 4, target: "enemy" }],
  },
  whisper: {
    name: "Whisper", char: "marron", cost: 1, type: "attack", rarity: "starter", target: "all",
    effects: [{ kind: "damage", amount: 3, hits: 1 }, { kind: "status", status: "book", amount: 1, target: "allEnemies" }],
  },
  rubber_stamp: {
    name: "Rubber Stamp", char: "marron", cost: 1, type: "attack", rarity: "common", target: "enemy",
    effects: [{ kind: "damage", amount: 6, hits: 1 }, { kind: "status", status: "book", amount: 2, target: "enemy" }],
  },
  annotate: {
    name: "Annotate", char: "marron", cost: 1, type: "skill", rarity: "common", target: "enemy",
    effects: [{ kind: "status", status: "book", amount: 2, target: "enemy" }, { kind: "block", amount: 4 }],
  },
  return_sender: {
    name: "Return to Sender", char: "marron", cost: 2, type: "attack", rarity: "common", target: "enemy",
    effects: [{ kind: "damage", amount: 8, hits: 1 }, { kind: "status", status: "book", amount: 3, target: "enemy" }],
  },
  catalogue: {
    name: "Card Catalogue", char: "marron", cost: 2, type: "skill", rarity: "uncommon", target: "enemy",
    effects: [{ kind: "status", status: "book", amount: 3, target: "enemy" }, { kind: "draw", amount: 3 }],
  },
  silence: {
    name: "Silence", char: "marron", cost: 2, type: "skill", rarity: "uncommon", target: "all",
    effects: [{ kind: "status", status: "weak", amount: 3, target: "allEnemies" }],
  },
  overdue_notice: {
    name: "Overdue Notice", char: "marron", cost: 2, type: "skill", rarity: "uncommon", target: "enemy",
    effects: [{ kind: "status", status: "book", amount: 4, target: "enemy" }, { kind: "status", status: "vulnerable", amount: 2, target: "enemy" }],
  },
  fact_check: {
    name: "Fact Check", char: "marron", cost: 1, type: "attack", rarity: "uncommon", target: "enemy",
    effects: [{ kind: "damage", amount: 8, hits: 1 }, { kind: "status", status: "book", amount: 1, target: "enemy" }],
  },
  cross_reference: {
    name: "Cross-Reference", char: "marron", cost: 1, type: "skill", rarity: "rare", target: "enemy",
    effects: [{ kind: "multiplyStatus", status: "book" }, { kind: "draw", amount: 1 }],
  },
  encyclopedia: {
    name: "Encyclopedia", char: "marron", cost: 3, type: "attack", rarity: "rare", target: "all",
    effects: [{ kind: "damage", amount: 10, hits: 1 }, { kind: "status", status: "book", amount: 2, target: "allEnemies" }],
  },
  library_card: {
    name: "Library Card", char: "marron", cost: 0, type: "skill", rarity: "rare", target: "self", exhaust: true,
    effects: [{ kind: "energy", amount: 1 }, { kind: "draw", amount: 2 }],
  },
  quiet_stacks: {
    name: "Quiet Stacks", char: "marron", cost: 2, type: "skill", rarity: "rare", target: "enemy",
    effects: [{ kind: "block", amount: 10 }, { kind: "status", status: "book", amount: 5, target: "enemy" }],
  },

  /* ---------------- ELIZABETH ---------------- */
  cut: {
    name: "Cut", char: "elizabeth", cost: 1, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 5, hits: 1 }, { kind: "status", status: "bleed", amount: 1, target: "enemy" }],
  },
  parry: {
    name: "Parry", char: "elizabeth", cost: 1, type: "skill", rarity: "starter", target: "self",
    effects: [{ kind: "overshield", amount: 6 }, { kind: "block", amount: 2 }],
  },
  noble_guard: {
    name: "Noble Guard", char: "elizabeth", cost: 1, type: "skill", rarity: "starter", target: "self",
    effects: [{ kind: "overshield", amount: 8 }],
  },
  riposte: {
    name: "Riposte", char: "elizabeth", cost: 2, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 7, hits: 1 }, { kind: "overshield", amount: 5 }],
  },
  lunge: {
    name: "Lunge", char: "elizabeth", cost: 2, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 11, hits: 1 }, { kind: "status", status: "bleed", amount: 2, target: "enemy" }],
  },
  white_glove: {
    name: "White Glove", char: "elizabeth", cost: 0, type: "skill", rarity: "starter", target: "self", exhaust: true,
    effects: [{ kind: "overshield", amount: 4 }],
  },
  thousand_cuts: {
    name: "Thousand Cuts", char: "elizabeth", cost: 2, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 3, hits: 3 }, { kind: "status", status: "bleed", amount: 1, target: "enemy" }],
  },
  regal_bearing: {
    name: "Regal Bearing", char: "elizabeth", cost: 1, type: "skill", rarity: "starter", target: "self",
    effects: [{ kind: "strength", amount: 1 }, { kind: "overshield", amount: 3 }],
  },
  duel: {
    name: "Duel", char: "elizabeth", cost: 3, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 17, hits: 1 }, { kind: "status", status: "bleed", amount: 3, target: "enemy" }],
  },
  silver_bullet: {
    name: "Silver Bullet", char: "elizabeth", cost: 2, type: "attack", rarity: "common", target: "enemy",
    effects: [{ kind: "damage", amount: 10, hits: 1 }, { kind: "status", status: "bleed", amount: 2, target: "enemy" }],
  },
  razor_fan: {
    name: "Razor Fan", char: "elizabeth", cost: 1, type: "attack", rarity: "common", target: "enemy",
    effects: [{ kind: "damage", amount: 2, hits: 3 }, { kind: "status", status: "bleed", amount: 1, target: "enemy" }],
  },
  cold_courtesy: {
    name: "Cold Courtesy", char: "elizabeth", cost: 1, type: "skill", rarity: "common", target: "enemy",
    effects: [{ kind: "overshield", amount: 8 }, { kind: "status", status: "weak", amount: 1, target: "enemy" }],
  },
  pressure_point: {
    name: "Pressure Point", char: "elizabeth", cost: 1, type: "attack", rarity: "uncommon", target: "enemy",
    effects: [{ kind: "damage", amount: 4, hits: 1 }, { kind: "status", status: "bleed", amount: 2, target: "enemy" }],
  },
  crimson_waltz: {
    name: "Crimson Waltz", char: "elizabeth", cost: 2, type: "attack", rarity: "uncommon", target: "enemy",
    effects: [{ kind: "damage", amount: 4, hits: 2 }, { kind: "status", status: "bleed", amount: 2, target: "enemy" }],
  },
  grand_entrance: {
    name: "Grand Entrance", char: "elizabeth", cost: 2, type: "skill", rarity: "uncommon", target: "self",
    effects: [{ kind: "strength", amount: 2 }, { kind: "overshield", amount: 5 }],
  },
  blue_blood: {
    name: "Blue Blood", char: "elizabeth", cost: 1, type: "skill", rarity: "uncommon", target: "self",
    effects: [{ kind: "heal", amount: 4 }, { kind: "overshield", amount: 5 }],
  },
  mirror_guard: {
    name: "Mirror Guard", char: "elizabeth", cost: 1, type: "skill", rarity: "uncommon", target: "all",
    effects: [{ kind: "overshield", amount: 6 }, { kind: "status", status: "bleed", amount: 2, target: "allEnemies" }],
  },
  hemorrhage: {
    name: "Hemorrhage", char: "elizabeth", cost: 2, type: "skill", rarity: "rare", target: "enemy",
    effects: [{ kind: "multiplyStatus", status: "bleed" }, { kind: "status", status: "bleed", amount: 1, target: "enemy" }],
  },
  guillotine: {
    name: "Guillotine", char: "elizabeth", cost: 3, type: "attack", rarity: "rare", target: "enemy",
    effects: [{ kind: "damage", amount: 18, hits: 1 }, { kind: "damageIfBleed", amount: 10 }],
  },
  afterimage: {
    name: "Afterimage", char: "elizabeth", cost: 2, type: "skill", rarity: "rare", target: "self",
    effects: [{ kind: "overshield", amount: 10 }, { kind: "draw", amount: 1 }],
  },
  last_dance: {
    name: "Last Dance", char: "elizabeth", cost: 3, type: "attack", rarity: "rare", target: "enemy",
    effects: [{ kind: "damage", amount: 6, hits: 3 }, { kind: "status", status: "bleed", amount: 2, target: "enemy" }],
  },

  /* ---------------- BRITTANY ---------------- */
  fetch: {
    name: "Fetch!", char: "brittany", cost: 1, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 5, hits: 1 }, { kind: "summonMaxHp", amount: 2 }],
  },
  good_boy: {
    name: "Good Boy", char: "brittany", cost: 1, type: "skill", rarity: "starter", target: "self",
    effects: [{ kind: "summonHeal", amount: 5 }, { kind: "block", amount: 4 }],
  },
  big_bark: {
    name: "Big Bark", char: "brittany", cost: 2, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 8, hits: 1 }, { kind: "summonMaxHp", amount: 4 }],
  },
  zoomies: {
    name: "Zoomies", char: "brittany", cost: 2, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 3, hits: 3 }, { kind: "summonMaxHp", amount: 2 }],
  },
  taco_tuesday: {
    name: "Taco Tuesday", char: "brittany", cost: 3, type: "attack", rarity: "starter", target: "enemy",
    effects: [{ kind: "damage", amount: 14, hits: 1 }, { kind: "summonMaxHp", amount: 8 }],
  },
  guard_dog: {
    name: "Guard Dog", char: "brittany", cost: 1, type: "skill", rarity: "starter", target: "self",
    effects: [{ kind: "block", amount: 7 }, { kind: "summonHeal", amount: 3 }],
  },
  puppy_power: {
    name: "Puppy Power", char: "brittany", cost: 0, type: "attack", rarity: "starter", target: "enemy", exhaust: true,
    effects: [{ kind: "tacoAttack", amount: 4 }],
  },
  beg: {
    name: "Beg", char: "brittany", cost: 1, type: "skill", rarity: "starter", target: "enemy",
    effects: [{ kind: "status", status: "weak", amount: 2, target: "enemy" }, { kind: "draw", amount: 1 }],
  },
  taco_returns: {
    name: "Taco Returns", char: "brittany", cost: 2, type: "skill", rarity: "starter", target: "self",
    effects: [{ kind: "reviveTaco", amount: 12, heal: 6 }],
  },
  sunshine_state: {
    name: "Sunshine State", char: "brittany", cost: 2, type: "skill", rarity: "starter", target: "self",
    effects: [{ kind: "strength", amount: 1 }, { kind: "summonMaxHp", amount: 5 }],
  },
  pup_cup: {
    name: "Pup Cup", char: "brittany", cost: 1, type: "skill", rarity: "common", target: "self",
    effects: [{ kind: "summonHeal", amount: 8 }, { kind: "draw", amount: 1 }],
  },
  hair_of_dog: {
    name: "Hair of the Dog", char: "brittany", cost: 1, type: "skill", rarity: "common", target: "self",
    effects: [{ kind: "heal", amount: 5 }, { kind: "summonHeal", amount: 5 }],
  },
  belly_rub: {
    name: "Belly Rub", char: "brittany", cost: 0, type: "skill", rarity: "common", target: "self", exhaust: true,
    effects: [{ kind: "summonHeal", amount: 4 }, { kind: "draw", amount: 1 }],
  },
  california_roll: {
    name: "California Roll", char: "brittany", cost: 2, type: "attack", rarity: "common", target: "enemy",
    effects: [{ kind: "damage", amount: 7, hits: 1 }, { kind: "draw", amount: 1 }],
  },
  protect_boy: {
    name: "Protect the Boy", char: "brittany", cost: 1, type: "skill", rarity: "uncommon", target: "self",
    effects: [{ kind: "tacoBlock", amount: 10 }],
  },
  chihuahua_charge: {
    name: "Chihuahua Charge", char: "brittany", cost: 2, type: "attack", rarity: "uncommon", target: "all",
    effects: [{ kind: "damage", amount: 5, hits: 1 }, { kind: "summonMaxHp", amount: 3 }],
  },
  sit_stay: {
    name: "Sit. Stay.", char: "brittany", cost: 1, type: "skill", rarity: "uncommon", target: "self",
    effects: [{ kind: "block", amount: 8 }, { kind: "tacoBlock", amount: 5 }],
  },
  fetch_quest: {
    name: "Fetch Quest", char: "brittany", cost: 2, type: "attack", rarity: "uncommon", target: "enemy",
    effects: [{ kind: "damage", amount: 9, hits: 1 }, { kind: "summonMaxHp", amount: 3 }, { kind: "draw", amount: 1 }],
  },
  best_friend: {
    name: "Best Friend", char: "brittany", cost: 2, type: "skill", rarity: "rare", target: "self",
    effects: [{ kind: "strength", amount: 2 }, { kind: "summonMaxHp", amount: 6 }, { kind: "summonHeal", amount: 6 }],
  },
  taco_storm: {
    name: "Taco Storm", char: "brittany", cost: 3, type: "attack", rarity: "rare", target: "enemy",
    effects: [{ kind: "damage", amount: 4, hits: 4 }, { kind: "summonMaxHp", amount: 3 }],
  },
  tiny_terror: {
    name: "Tiny Terror", char: "brittany", cost: 2, type: "attack", rarity: "rare", target: "enemy",
    effects: [{ kind: "tacoAttack", amount: 9 }, { kind: "summonMaxHp", amount: 4 }],
  },
  big_dog_energy: {
    name: "Big Dog Energy", char: "brittany", cost: 3, type: "skill", rarity: "rare", target: "self",
    effects: [{ kind: "summonMaxHp", amount: 12 }, { kind: "summonHeal", amount: 12 }],
  },
};

export const RARITY = {
  starter: { label: "Starter", rank: 0, color: "#8d887c" },
  common: { label: "Common", rank: 1, color: "#b9b19e" },
  uncommon: { label: "Uncommon", rank: 2, color: "#83b7a2" },
  rare: { label: "Rare", rank: 3, color: "#e4b86c" },
};

const STATUS_TEXT = {
  bleed: "Bleed",
  book: "Book",
  weak: "Weak",
  vulnerable: "Vulnerable",
  taunt: "Taunt",
};

export function getEffects(card) {
  const def = CARDS[card.key];
  if (!def) return [];
  return def.effects.map((effect) => {
    if (!card.upgraded) return { ...effect };
    const out = { ...effect };
    switch (effect.kind) {
      case "damage":
        out.amount += effect.hits > 1 ? 1 : Math.max(2, Math.ceil(effect.amount * 0.25));
        break;
      case "damageIfBleed":
        out.amount += 3;
        break;
      case "block":
      case "overshield":
      case "tacoBlock":
        out.amount += Math.max(2, Math.ceil(effect.amount * 0.3));
        break;
      case "status":
        out.amount += 1;
        break;
      case "draw":
        out.amount += 1;
        break;
      case "heal":
      case "summonHeal":
        out.amount += 2;
        break;
      case "summonMaxHp":
        out.amount += 2;
        break;
      case "tacoAttack":
        out.amount += 2;
        break;
      case "strength":
        out.amount += 1;
        break;
      case "reviveTaco":
        out.amount += 4;
        out.heal += 2;
        break;
      default:
        break;
    }
    return out;
  });
}

export function describeCard(card) {
  const effects = getEffects(card);
  const def = CARDS[card.key];
  if (!def) return "";
  return effects.map((e) => {
    switch (e.kind) {
      case "damage":
        return `Deal ${e.amount}${e.hits > 1 ? `×${e.hits}` : ""} damage${def.target === "all" ? " to ALL enemies" : ""}.`;
      case "damageIfBleed":
        return `If the target is Bleeding, deal ${e.amount} more.`;
      case "block":
        return `Gain ${e.amount} Block.`;
      case "overshield":
        return `Gain ${e.amount} Overshield.`;
      case "status": {
        if (e.status === "crit") return `Gain +${e.amount}% Crit this turn.`;
        const suffix = e.target === "allEnemies" ? " to ALL enemies" : "";
        return `Apply ${e.amount} ${STATUS_TEXT[e.status] || e.status}${suffix}.`;
      }
      case "multiplyStatus":
        return `Double the target's ${STATUS_TEXT[e.status] || e.status}.`;
      case "draw":
        return `Draw ${e.amount}.`;
      case "energy":
        return `Gain ${e.amount} Stamina.`;
      case "heal":
        return `Heal ${e.amount} HP.`;
      case "loseHp":
        return `Lose ${e.amount} HP.`;
      case "strength":
        return `Gain ${e.amount} Strength.`;
      case "summonMaxHp":
        return `Taco gains ${e.amount} max HP.`;
      case "summonHeal":
        return `Heal Taco ${e.amount} HP.`;
      case "tacoBlock":
        return `Taco gains ${e.amount} Block.`;
      case "tacoAttack":
        return `Taco deals ${e.amount} damage now.`;
      case "reviveTaco":
        return `Revive Taco at ${e.amount} HP, or heal him ${e.heal} HP if alive.`;
      default:
        return "";
    }
  }).filter(Boolean).join(" ");
}

export function cardPool(charId, rarities = ["common", "uncommon", "rare"]) {
  return Object.entries(CARDS)
    .filter(([, def]) => def.char === charId && rarities.includes(def.rarity))
    .map(([key]) => key);
}
