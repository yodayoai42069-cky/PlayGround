/* Shared view helpers and small components. */

import {
  CHARACTERS, CHARACTER_IDS, META_UPGRADES, characterOutfit,
} from "../data/characters.js";
import { CARDS, RARITY, describeCard } from "../data/cards.js";
import { CHARMS, ACTS, STATUS_INFO, moveIntent } from "../data/enemies.js";
import { PRESTIGE_STYLES } from "../data/characters.js";

export const NODE_TYPES = {
  battle: { icon: "⚔", label: "Battle", color: "#d8cdb6" },
  elite: { icon: "☠", label: "Elite", color: "#e96545" },
  shop: { icon: "¤", label: "Shop", color: "#d8b16c" },
  event: { icon: "?", label: "Event", color: "#9cb98b" },
  special: { icon: "✦", label: "Offering", color: "#f0a1b2" },
  rest: { icon: "☾", label: "Rest", color: "#b7c5df" },
  treasure: { icon: "◈", label: "Treasure", color: "#e8c982" },
  boss: { icon: "♛", label: "Boss", color: "#e96545" },
  start: { icon: "●", label: "Start", color: "#958c7d" },
};

export function charStyle(id) {
  const def = CHARACTERS[id];
  return `--char:${def.color};--char-soft:${def.colorSoft};--char-ink:${def.ink};`;
}

export function outfitOf(game, charId, tier = null) {
  const t = tier == null ? game.meta.outfit[charId] || 0 : tier;
  return characterOutfit(charId, t);
}

export function portrait(game, charId, tier = null, className = "portrait") {
  const outfit = outfitOf(game, charId, tier);
  return `<img class="${className}" src="${outfit.file}" alt="${CHARACTERS[charId].name} — ${outfit.name}" loading="lazy" onerror="this.classList.add('missing')" />`;
}

export function portraitByFile(file, alt, className = "portrait") {
  return `<img class="${className}" src="${file}" alt="${alt}" loading="lazy" onerror="this.classList.add('missing')" />`;
}

export function hpBar(current, max, cls = "") {
  const pct = Math.max(0, Math.min(100, (current / Math.max(1, max)) * 100));
  return `<div class="hp-bar ${cls}"><i style="width:${pct}%"></i></div>`;
}

export function staminaPips(current, max) {
  let html = "";
  for (let i = 0; i < max; i += 1) {
    html += `<span class="stamina-pip ${i < current ? "on" : ""}"></span>`;
  }
  return `<div class="stamina-pips" aria-label="${current} of ${max} stamina">${html}</div>`;
}

export function statusChips(statuses, options = {}) {
  const parts = [];
  if (statuses.strength) {
    parts.push(`<span class="status-chip" data-sigil="↑" style="--status-color:#e0a267">${statuses.strength} STR</span>`);
  }
  if (statuses.bleed) {
    parts.push(`<span class="status-chip" data-sigil="✚" style="--status-color:#d46e6e">${statuses.bleed} BLEED</span>`);
  }
  if (statuses.book) {
    parts.push(`<span class="status-chip" data-sigil="▤" style="--status-color:#9bb58b">${statuses.book}/10 BOOK</span>`);
  }
  if (statuses.weak) {
    parts.push(`<span class="status-chip" data-sigil="↓" style="--status-color:#94a3b8">${statuses.weak} WEAK</span>`);
  }
  if (statuses.vulnerable) {
    parts.push(`<span class="status-chip" data-sigil="✧" style="--status-color:#d8a35d">${statuses.vulnerable} VULN</span>`);
  }
  if (options.crit) {
    parts.push(`<span class="status-chip" data-sigil="◈" style="--status-color:#e4b86c">+${options.crit}% CRIT</span>`);
  }
  if (options.extra) {
    options.extra.forEach((text) => {
      parts.push(`<span class="status-chip" data-sigil="·">${text}</span>`);
    });
  }
  return parts.length ? `<div class="status-row">${parts.join("")}</div>` : "";
}

export function cardMarkup(card, options = {}) {
  const def = CARDS[card.key];
  if (!def) return "";
  const rarity = RARITY[def.rarity] || RARITY.common;
  const char = CHARACTERS[def.char];
  const interact = !!options.action;
  const tag = interact ? "button" : "article";
  const attrs = interact
    ? `type="button" data-action="${options.action}" data-uid="${card.uid || ""}" data-index="${options.index ?? ""}" ${options.disabled ? "disabled" : ""}`
    : "";
  const classes = [
    "game-card",
    `rarity-${def.rarity}`,
    options.selected ? "selected" : "",
    options.unplayable ? "unplayable" : "",
    options.taken ? "taken" : "",
    options.className || "",
    card.upgraded ? "upgraded" : "",
  ].filter(Boolean).join(" ");
  const typeLabel = { attack: "ATTACK", skill: "SKILL", power: "POWER" }[def.type] || "CARD";
  return `<${tag} class="${classes}" style="${charStyle(def.char)}" ${attrs}>
    <span class="cost">${def.cost}</span>
    <span class="card-type">${typeLabel}${def.exhaust ? " · EXHAUST" : ""}</span>
    <span class="card-glyph" aria-hidden="true">${char.name[0]}</span>
    <span class="card-name">${def.name}${card.upgraded ? ' <i>+</i>' : ""}</span>
    <span class="card-divider"></span>
    <span class="card-text">${describeCard(card)}</span>
    <span class="card-foot"><span>${def.rarity === "starter" ? "STARTER" : rarity.label.toUpperCase()}</span><span>${char.name.toUpperCase()}</span></span>
    ${options.taken ? '<span class="card-taken">TAKEN</span>' : ""}
  </${tag}>`;
}

export function deckEntry(card) {
  const def = CARDS[card.key];
  return `<div class="deck-entry ${card.upgraded ? "upgraded" : ""}">
    <div class="deck-entry-top"><strong>${def.name}${card.upgraded ? " +" : ""}</strong><span>${def.cost}</span></div>
    <p>${describeCard(card)}</p>
  </div>`;
}

export function renderRunBar(game, { combat = false } = {}) {
  if (!game.run) return "";
  const run = game.run;
  const char = CHARACTERS[run.char];
  const outfit = outfitOf(game, run.char);
  const act = ACTS[run.act];
  const hp = combat && game.combat ? game.combat.player.hp : run.hp;
  const maxHp = combat && game.combat ? game.combat.player.maxHp : run.maxHp;
  const hpPct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  if (combat) {
    const c = game.combat;
    return `<header class="run-bar combat-bar" style="${charStyle(run.char)}">
      <div class="run-identity">
        ${portraitByFile(outfit.file, char.name, "run-identity-img")}
        <div class="run-identity-copy"><span>${char.name} · ${act.roman}</span><strong>${char.epithet}</strong></div>
      </div>
      <div class="combat-turn">TURN <strong>${c?.turn ?? 1}</strong> · ${c?.phase === "enemy" ? "ENEMY" : c?.ended ? "END" : "YOU"}</div>
      <div class="run-vitals">
        <div class="run-vital"><span>HP</span><strong class="hp">${hp} / ${maxHp}</strong><div class="run-hp-bar"><i style="width:${hpPct}%"></i></div></div>
        <div class="run-vital"><span>Gold</span><strong class="gold">${run.gold}g</strong></div>
        <div class="run-vital"><span>Act</span><strong>${act.roman} / III</strong></div>
      </div>
      <div class="run-actions">
        <button type="button" class="run-action" data-action="showDeck" title="View deck (D)">D</button>
        <button type="button" class="run-action" data-action="showCharms" title="Charms and boons (C)">C</button>
        <button type="button" class="run-action log-toggle" data-action="toggleLog" title="Combat log (L)">L</button>
        <button type="button" class="run-action" data-action="openTips" title="How to play (?)">?</button>
      </div>
    </header>`;
  }
  return `<header class="run-bar" style="${charStyle(run.char)}">
    <div class="run-brand"><span class="brand-mark">CB</span><span>CHECKERBOARD</span></div>
    <div class="run-identity">
      ${portraitByFile(outfit.file, char.name, "run-identity-img")}
      <div class="run-identity-copy"><span>${char.name} · act ${act.roman}</span><strong>${char.epithet}</strong></div>
    </div>
    <div class="run-vitals">
      <div class="run-vital"><span>HP</span><strong class="hp">${run.hp} / ${run.maxHp}</strong><div class="run-hp-bar"><i style="width:${hpPct}%"></i></div></div>
      <div class="run-vital"><span>Gold</span><strong class="gold">${run.gold}g</strong></div>
      <div class="run-vital"><span>Act</span><strong>${act.roman} / III</strong></div>
    </div>
    <div class="run-actions">
      <button type="button" class="run-action" data-action="showDeck" title="View deck (D)">D</button>
      <button type="button" class="run-action" data-action="showCharms" title="Charms and boons (C)">C</button>
      <button type="button" class="run-action" data-action="openTips" title="How to play (?)">?</button>
    </div>
  </header>`;
}

export function metaSummary(game) {
  const m = game.meta;
  const parts = [`<span><strong>${m.ash}</strong> ASH</span>`];
  if (m.prestige > 0) parts.push(`<span>PRESTIGE <strong>${m.prestige}</strong></span>`);
  parts.push(`<span>${m.runs} RUNS</span>`);
  return parts.join("");
}

export function metaBuffChips(game) {
  const chips = [];
  for (const up of META_UPGRADES) {
    const level = game.meta.upgrades[up.id] || 0;
    if (level > 0) chips.push(`<span class="meta-buff">${up.name} ${level}</span>`);
  }
  return chips.join("") || `<span class="empty-note">No permanent upgrades yet. Ash makes them permanent.</span>`;
}

export function prestigePips(level) {
  let html = "";
  for (let i = 0; i < 3; i += 1) {
    html += `<span class="prestige-pip ${i < level ? "on" : ""}"></span>`;
  }
  return `<div class="prestige-pips">${html}</div>`;
}

export function statusLabel(status) {
  return STATUS_INFO[status]?.name || status;
}

export function intentText(enemy) {
  if (!enemy) return "";
  const move = enemy.moves[enemy.pattern[enemy.moveIndex % enemy.pattern.length]];
  return { move, text: moveIntent(move, enemy) };
}

export function charmEntry(key) {
  const charm = CHARMS[key];
  return `<div class="charm-entry"><strong>${charm.name}</strong><span>${charm.desc}</span></div>`;
}

export function lastLogs(game, count = 12) {
  const log = game.combat?.log || [];
  return log.slice(-count).map((entry) => {
    const turn = entry.tone === "turn" ? "" : `<span class="log-turn">${entry.turn}</span>`;
    return `<div class="log-entry ${entry.tone || ""}">${turn}${entry.text}</div>`;
  }).join("");
}

export function nodeType(type) {
  return NODE_TYPES[type] || NODE_TYPES.battle;
}

export function prestigeStyle(game) {
  return PRESTIGE_STYLES[game.meta.prestige - 1] || null;
}
