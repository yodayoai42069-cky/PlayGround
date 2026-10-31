/* Title, character select, briefing, archive, wardrobe, tips, prestige. */

import {
  CHARACTERS, CHARACTER_IDS, META_UPGRADES, metaUpgradeCost, PRESTIGE_STYLES,
} from "../data/characters.js";
import { CARDS } from "../data/cards.js";
import { TIPS } from "../data/events.js";
import {
  cardMarkup, charStyle, metaBuffChips, metaSummary, outfitOf, portrait,
  portraitByFile, prestigePips,
} from "./shared.js";

function pageMeta(game) {
  return `<div class="page-header-meta">${metaSummary(game)}</div>`;
}

function header(game, backAction, backLabel) {
  return `<header class="page-header">
    <button type="button" class="back-link" data-action="${backAction}">${backLabel}</button>
    <div class="brand-line"><span class="brand-mark">CB</span><span>THE CHECKERBOARD</span></div>
    ${pageMeta(game)}
  </header>`;
}

export function renderTitle(game) {
  const meta = game.meta;
  const cards = CHARACTER_IDS.map((id, index) => {
    const char = CHARACTERS[id];
    const outfit = outfitOf(game, id);
    const lock = meta.unlocks[id] || 0;
    return `<button type="button" class="title-card" style="${charStyle(id)};--rot:${[-7, -2.5, 2.4, 7][index]}deg" data-action="selectChar" data-char="${id}" aria-label="Choose ${char.name}">
      ${portraitByFile(outfit.file, `${char.name} — ${outfit.name}`, "title-card-img")}
      <span class="title-card-top">${char.number} / ${String(index + 1).padStart(2, "0")}</span>
      <span class="title-card-info">
        <strong>${char.name}</strong>
        <span>${char.epithet}</span>
        <em>${char.style}</em>
      </span>
    </button>`;
  }).join("");

  const prestige = meta.prestige > 0
    ? `<span>PRESTIGE <strong>${meta.prestige}/3</strong></span>`
    : `<span>NO PRESTIGE</span>`;

  return `<main class="title-screen">
    <header class="title-header">
      <div class="brand-line"><span class="brand-mark">CB</span><span>AN ENDLESS SCHOOL · A STACKED DECK</span></div>
      <div class="title-meta">
        <span><strong>${meta.ash}</strong> ASH</span>
        ${prestige}
      </div>
    </header>

    <section class="title-hero">
      <div class="title-copy">
        <div class="eyebrow title-kicker">A DECK-BUILDING ROGUELIKE</div>
        <h1 class="game-title"><span>THE</span><em>CHECKERBOARD</em></h1>
        <p class="title-lede">Four girls. One impossible staircase. <strong>Spend your Stamina, stack your deck,</strong> and climb until the Headmistress runs out of moves.</p>
        <div class="title-actions">
          <button type="button" class="btn btn-primary" data-action="choose">Begin the climb</button>
          <button type="button" class="btn" data-action="archive">The archive</button>
          <button type="button" class="btn btn-ghost" data-action="wardrobe">Wardrobe</button>
          <button type="button" class="btn btn-ghost" data-action="openTips">How to play</button>
        </div>
        <div class="title-badges">
          <span>4 routes</span>
          <span>3-card start</span>
          <span>3 climbs per run</span>
          <span>3 prestiges</span>
          <span>Permanent ash</span>
        </div>
      </div>
      <div class="title-art" aria-label="The four playable characters">
        ${cards}
      </div>
    </section>

    <footer class="title-footer">
      <span>AI-generated anime portraits · text-based battles · no mercy</span>
      <span>${meta.runs} runs attempted · ${meta.clears} completions · best act ${meta.bestAct || "—"}</span>
    </footer>
  </main>`;
}

export function renderSelect(game) {
  const tiles = CHARACTER_IDS.map((id, index) => {
    const c = CHARACTERS[id];
    const outfit = outfitOf(game, id);
    const unlocked = game.meta.unlocks[id] || 0;
    return `<button type="button" class="char-tile" style="${charStyle(id)};--delay:${index * 80}ms" data-action="selectChar" data-char="${id}">
      ${portraitByFile(outfit.file, `${c.name} — ${outfit.name}`, "char-tile-img")}
      <span class="char-tile-top"><span>${c.number}</span><span>${c.difficulty}</span></span>
      <span class="char-tile-content">
        <span class="char-tile-name">${c.name} <em>${c.epithet}</em></span>
        <span class="char-tile-epithet">${outfit.name}</span>
        <span class="char-tile-style">${c.style}<span>${c.passive.name}</span></span>
        ${unlocked > 0 ? `<span class="char-tile-lock">${unlocked} alternate look${unlocked > 1 ? "s" : ""} unlocked</span>` : ""}
      </span>
    </button>`;
  }).join("");

  return `<main class="page-shell select-screen">
    ${header(game, "backTitle", "The title")}
    <section class="page-heading">
      <div>
        <div class="eyebrow">THE FOUR ROUTES</div>
        <h1>Choose your <em>climb.</em></h1>
      </div>
      <p>Each girl has her own way of hurting the board. Pick a deck. Pick a look. The staircase does the rest.</p>
    </section>
    <div class="char-grid">${tiles}</div>
    <div class="select-hint">
      <span>Click a girl to inspect her passive, starter deck, and wardrobe.</span>
      <span>${game.meta.prestige > 0 ? `Prestige ${game.meta.prestige} wardrobe active` : "Prestige unlocks alternate outfits"}</span>
    </div>
  </main>`;
}

export function renderBriefing(game) {
  const brief = game.briefing;
  if (!brief) return renderSelect(game);
  const c = CHARACTERS[brief.charId];
  const outfit = c.outfits[brief.outfit];
  const unlocked = game.meta.unlocks[c.id] || 0;
  const metaBuff = metaBuffChips(game);
  const deck = c.starter.map((key) => {
    const card = { key, uid: key, upgraded: false };
    const def = CARDS[key];
    return `<span class="starter-card"><b>${def.cost}</b>${def.name}</span>`;
  }).join("");

  const outfits = c.outfits.map((o, index) => {
    const locked = index > unlocked;
    return `<button type="button" class="outfit-chip ${brief.outfit === index ? "active" : ""} ${locked ? "locked" : ""}" data-action="briefOutfit" data-tier="${index}" ${locked ? "disabled" : ""}>
      <strong>${locked ? "Locked look" : o.name}</strong>
      <span>${locked ? `Prestige ${index}` : brief.outfit === index ? "Wearing" : "Equip"}</span>
    </button>`;
  }).join("");

  return `<main class="page-shell briefing-screen">
    ${header(game, "backSelect", "Choose another")}
    <section class="briefing-grid">
      <div class="briefing-art" style="${charStyle(c.id)}">
        ${portraitByFile(outfit.file, `${c.name} — ${outfit.name}`, "briefing-portrait")}
        <div class="briefing-art-info"><strong>${c.name}</strong><span>${c.epithet}</span></div>
      </div>
      <div class="briefing-copy" style="${charStyle(c.id)}">
        <div class="briefing-title">
          <div class="eyebrow">ROUTE ${c.number} · ${c.difficulty}</div>
          <h1>${c.name} <em>${c.epithet}</em></h1>
        </div>
        <p class="briefing-bio">${c.bio}</p>
        <div class="briefing-stats">
          <div class="briefing-stat"><span>Max HP</span><strong>${c.hp + (game.meta.upgrades.vitality || 0) * 5}</strong><small>${game.meta.upgrades.vitality ? `+${game.meta.upgrades.vitality * 5} vitality` : "base"}</small></div>
          <div class="briefing-stat"><span>Stamina</span><strong>${c.stamina + (game.meta.upgrades.endurance || 0)}</strong><small>per turn</small></div>
          <div class="briefing-stat"><span>Draw</span><strong>${c.draw + (game.meta.upgrades.insight || 0)}</strong><small>cards per turn</small></div>
          <div class="briefing-stat"><span>Crit</span><strong>${Math.round((c.crit + (game.meta.upgrades.instinct || 0) * 0.04) * 100)}%</strong><small>${Math.round(c.critDamage * 100)}% damage</small></div>
        </div>
        <div class="passive-box">
          <h3>Passive · <span>${c.passive.name}</span></h3>
          <p>${c.passive.text}</p>
        </div>
        <div class="outfit-select">
          <div class="outfit-select-head"><span>Wardrobe</span><span>${unlocked}/3 prestige looks unlocked</span></div>
          <div class="outfit-options">${outfits}</div>
        </div>
        <div class="briefing-meta-buffs">${metaBuff}</div>
        <div>
          <div class="starter-deck-head"><span>Starter deck · ${c.starter.length} cards</span><span>Draft 1–3 after fights</span></div>
          <div class="starter-deck">${deck}</div>
          <p class="empty-note" style="margin-top:8px">Win a battle to add 1 card, an elite to add 2, and a boss to add 3. Your deck is the run.</p>
        </div>
        <div class="btn-row">
          <button type="button" class="btn btn-primary" data-action="beginRun">Enter the staircase</button>
          <button type="button" class="btn btn-ghost" data-action="backSelect">Back</button>
        </div>
      </div>
    </section>
  </main>`;
}

export function renderArchive(game) {
  const meta = game.meta;
  const upgrades = META_UPGRADES.map((up) => {
    const level = meta.upgrades[up.id] || 0;
    const maxed = level >= up.max;
    const cost = metaUpgradeCost(up, level);
    const canBuy = !maxed && meta.ash >= cost;
    const pips = Array.from({ length: up.max }, (_, i) => `<span class="rank-pip ${i < level ? "on" : ""}"></span>`).join("");
    return `<article class="upgrade-card" style="--char:${level ? "var(--gold)" : "var(--line)"}">
      <div class="upgrade-sigil">${up.sigil}</div>
      <div class="upgrade-copy">
        <h3>${up.name} <span class="muted">${level}/${up.max}</span></h3>
        <p>${up.desc}</p>
        <div class="upgrade-ranks">${pips}</div>
      </div>
      <div class="upgrade-buy">
        <span>${maxed ? "MAX" : `${cost} ash`}</span>
        <button type="button" class="btn btn-small" data-action="buyUpgrade" data-upgrade="${up.id}" ${!canBuy ? "disabled" : ""}>${maxed ? "Full" : "Restore"}</button>
      </div>
    </article>`;
  }).join("");

  const can = game.canPrestige();
  const nextStyle = PRESTIGE_STYLES[meta.prestige] || null;
  const prestigeText = meta.prestige >= 3
    ? "Every look is yours. The staircase has nothing left to offer but itself."
    : `Reset all permanent upgrades and Ash. In return, unlock <strong>${nextStyle?.name || "the next look"}</strong> for all four girls.`;

  return `<main class="page-shell archive-screen">
    ${header(game, "backTitle", "The title")}
    <section class="page-heading">
      <div>
        <div class="eyebrow">PERMANENT PROGRESS</div>
        <h1>The <em>Archive.</em></h1>
      </div>
      <p>Ash survives death. Spend it here to make the next climb less impossible. Prestige resets it all for a new wardrobe.</p>
    </section>

    <div class="archive-summary">
      <div class="ash-display"><strong>${meta.ash}</strong><span>Ash to spend</span></div>
      <div class="archive-stats">
        <div class="archive-stat"><span>Runs</span><strong>${meta.runs}</strong></div>
        <div class="archive-stat"><span>Clears</span><strong>${meta.clears}</strong></div>
        <div class="archive-stat"><span>Best act</span><strong>${meta.bestAct || "—"}</strong></div>
        <div class="archive-stat"><span>Prestige</span><strong>${meta.prestige}/3</strong></div>
      </div>
    </div>

    <div class="upgrade-grid">${upgrades}</div>

    <section class="prestige-panel">
      <div>
        <div class="eyebrow">THE BEAUTIFUL RESET</div>
        <h2>Prestige ${meta.prestige} <span class="muted">/ 3</span></h2>
        <p>${prestigeText}</p>
        ${prestigePips(meta.prestige)}
      </div>
      <div>
        <button type="button" class="btn btn-primary" data-action="prestigeAsk" ${!can ? "disabled" : ""}>${meta.prestige >= 3 ? "Fully prestiged" : "Prestige"}</button>
      </div>
    </section>

    <p class="empty-note" style="margin-top:18px">${can ? "Prestige is permanent. The archive will be wiped. Outfits, lifetime runs, and prestige rank remain." : meta.prestige >= 3 ? "Three outfits per girl. All three prestiges complete." : "Finish a run (win or lose) after your last prestige to unlock the next one."}</p>
  </main>`;
}

export function renderWardrobe(game) {
  const groups = CHARACTER_IDS.map((id) => {
    const c = CHARACTERS[id];
    const unlocked = game.meta.unlocks[id] || 0;
    const current = game.meta.outfit[id] || 0;
    const cards = c.outfits.map((o, index) => {
      const locked = index > unlocked;
      return `<button type="button" class="outfit-card ${locked ? "locked" : ""} ${current === index ? "equipped" : ""}" style="${charStyle(id)}" data-action="equipOutfit" data-char="${id}" data-tier="${index}" data-tier-label="${index}" ${locked ? "disabled" : ""}>
        ${portraitByFile(o.file, `${c.name} — ${o.name}`, "outfit-card-img")}
        <span class="outfit-card-info"><strong>${o.name}</strong><span>${locked ? `Prestige ${index} unlock` : o.note}</span></span>
      </button>`;
    }).join("");
    return `<section class="wardrobe-group" style="${charStyle(id)}">
      <div class="wardrobe-group-head">
        <h2><span>${c.number}</span>${c.name}</h2>
        <p>${unlocked}/3 prestige looks · ${c.epithet}</p>
      </div>
      <div class="outfit-grid">${cards}</div>
    </section>`;
  }).join("");

  return `<main class="page-shell wardrobe-screen">
    ${header(game, "backTitle", "The title")}
    <section class="page-heading">
      <div>
        <div class="eyebrow">THE COLLECTION</div>
        <h1>The <em>Wardrobe.</em></h1>
      </div>
      <p>Three prestiges. Four girls. Twelve ways to make the same mistake look intentional.</p>
    </section>
    ${groups}
    ${game.meta.prestige >= 3 ? `<p class="empty-note">All prestige looks collected. The archive has nothing left to hide.</p>` : `<p class="empty-note">Prestige in the Archive to unlock the next set of outfits for every girl.</p>`}
  </main>`;
}

export function renderTips(game) {
  const tips = TIPS.map((tip, i) => `<article class="tip-card">
    <div class="tip-number">0${i + 1} / FIELD NOTE</div>
    <h2>${tip.title}</h2>
    <p>${tip.body}</p>
  </article>`).join("");
  return `<main class="page-shell tips-screen">
    ${header(game, "backFromTips", "Back")}
    <section class="page-heading">
      <div>
        <div class="eyebrow">READ THIS BEFORE THE FIRST BELL</div>
        <h1>How to <em>survive.</em></h1>
      </div>
      <p>It is a deck builder. It is a roguelike. It is mostly about spending Stamina before the board spends you.</p>
    </section>
    <div class="tips-grid">${tips}</div>
  </main>`;
}

export function renderPrestige(game) {
  const tier = game.pending?.prestige || game.meta.prestige;
  const style = PRESTIGE_STYLES[tier - 1];
  const outfits = CHARACTER_IDS.map((id) => {
    const c = CHARACTERS[id];
    const outfit = c.outfits[Math.min(tier, 3)];
    return `<div class="prestige-outfit" style="${charStyle(id)}">
      ${portraitByFile(outfit.file, `${c.name} — ${outfit.name}`, "")}
      <div><strong>${c.name}</strong><span>${outfit.name}</span></div>
    </div>`;
  }).join("");
  return `<main class="prestige-screen">
    <div class="prestige-wrap">
      <div class="eyebrow no-line" style="justify-content:center">PRESTIGE ${tier} / 3</div>
      <h1>${style?.name || "New look"} <em>achieved.</em></h1>
      <p>Your upgrades and Ash are gone. The wardrobe is not. Every girl has a new look, and the staircase is waiting to be climbed from the bottom again.</p>
      <div class="prestige-outfits">${outfits}</div>
      <div class="prestige-actions">
        <button type="button" class="btn btn-primary" data-action="openWardrobeFromPrestige">Visit the wardrobe</button>
        <button type="button" class="btn" data-action="prestigeDone">Return to title</button>
      </div>
    </div>
  </main>`;
}
