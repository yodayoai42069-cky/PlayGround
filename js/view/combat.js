/* Combat screen. */

import { CHARACTERS } from "../data/characters.js";
import { CARDS } from "../data/cards.js";
import { ACTS, moveIntent, STATUS_INFO } from "../data/enemies.js";
import {
  cardMarkup, charStyle, hpBar, lastLogs, renderRunBar, staminaPips, statusChips,
} from "./shared.js";

function enemyCard(enemy, combat, pendingDef) {
  const taunts = combat.enemies.filter((e) => e.alive && e.taunt);
  const targetable = !!pendingDef
    && pendingDef.target === "enemy"
    && enemy.alive
    && combat.phase === "player"
    && !combat.ended
    && (!taunts.length || enemy.taunt);
  const move = enemy.alive ? enemy.moves[enemy.pattern[enemy.moveIndex % enemy.pattern.length]] : null;
  const intent = move ? moveIntent(move, enemy) : "";
  const hostile = move && (move.dmg || move.status || move.status2 || move.strength || move.strengthAll || move.summon || move.taunt);
  const status = statusChips({
    strength: enemy.strength,
    bleed: enemy.statuses.bleed,
    book: enemy.statuses.book,
    weak: enemy.statuses.weak,
    vulnerable: enemy.statuses.vulnerable,
  });
  const blockChip = enemy.block > 0 ? `<div class="shield-row"><span class="shield-chip">${enemy.block} Block</span></div>` : "";
  const tags = [
    ...enemy.tags,
    enemy.taunt ? "Taunting" : "",
    enemy.enraged ? "Phase II" : "",
    enemy.summoned ? "Summoned" : "",
  ].filter(Boolean).map((tag) => `<span class="enemy-tag">${tag}</span>`).join("");

  const inner = `
    ${enemy.boss ? `<div class="boss-ribbon">FINAL OBSTACLE</div>` : ""}
    <div class="enemy-top">
      <span class="enemy-crest" style="--enemy:${enemy.color}">${enemy.crest}</span>
      <div class="enemy-title">
        <h3>${enemy.name}</h3>
        <p>${enemy.boss ? "BOSS" : enemy.minion ? "MINION" : "ENEMY"} · ${enemy.hp} / ${enemy.maxHp} HP</p>
      </div>
      <div class="intent-chip ${hostile ? "hostile" : ""}">
        <span>${enemy.alive ? "INTENT" : "OUT"}</span>
        <strong>${enemy.alive ? intent : "—"}</strong>
      </div>
    </div>
    <div class="enemy-hp">
      ${hpBar(enemy.hp, enemy.maxHp, "enemy")}
    </div>
    ${blockChip}
    <div class="enemy-statuses">${status}</div>
    <div class="enemy-tags">${tags}</div>
    <p class="enemy-flavor">${enemy.flavor}</p>`;

  if (!enemy.alive) {
    return `<article class="enemy-card dead" style="--enemy:${enemy.color}">
      <div class="enemy-title"><h3>${enemy.name}</h3><p>DEFEATED</p></div>
    </article>`;
  }

  if (targetable) {
    return `<button type="button" class="enemy-card targetable ${enemy.taunt ? "taunting" : ""} ${enemy.boss ? "boss" : ""}" style="--enemy:${enemy.color}" data-action="targetEnemy" data-uid="${enemy.uid}">
      ${inner}
    </button>`;
  }
  return `<article class="enemy-card ${enemy.taunt ? "taunting" : ""} ${enemy.boss ? "boss" : ""}" style="--enemy:${enemy.color}">
    ${inner}
  </article>`;
}

export function renderCombat(game, ui) {
  const combat = game.combat;
  if (!combat) return "";
  const run = game.run;
  const char = CHARACTERS[run.char];
  const player = combat.player;
  const act = ACTS[run.act];
  const pendingCard = combat.pendingCard
    ? combat.hand.find((c) => c.uid === combat.pendingCard)
    : null;
  const pendingDef = pendingCard ? CARDS[pendingCard.key] : null;
  const taunts = combat.enemies.filter((e) => e.alive && e.taunt);
  const canAct = combat.phase === "player" && !combat.ended;
  const playedStatuses = {
    strength: player.strength,
    weak: player.weak,
    vulnerable: player.vulnerable,
    bleed: player.bleed,
  };

  const enemies = combat.enemies.map((enemy) => enemyCard(enemy, combat, pendingDef)).join("");

  const taco = combat.taco
    ? `<div class="taco-card ${combat.taco.alive ? "" : "down"}">
        <div class="taco-head"><span>TACO · ${combat.taco.alive ? "SUMMON" : "DOWN"}</span><strong>${combat.taco.hp} / ${combat.taco.maxHp}</strong></div>
        ${hpBar(combat.taco.hp, combat.taco.maxHp, "taco")}
        <div class="taco-meta"><span>${combat.taco.block ? `${combat.taco.block} BLOCK` : "INTERCEPTS HITS"}</span><span>BITE ${combat.taco.attack}</span></div>
      </div>`
    : "";

  const hand = combat.hand.map((card) => {
    const def = CARDS[card.key];
    const unplayable = !canAct || combat.stamina < def.cost;
    return cardMarkup(card, {
      action: "card",
      selected: combat.pendingCard === card.uid,
      unplayable,
      disabled: false,
    });
  }).join("");

  const drawCount = combat.drawPile.length;
  const discardCount = combat.discardPile.length;
  const exhaustCount = combat.exhaustPile.length;

  const targetPrompt = pendingDef
    ? `<div class="target-prompt"><span>Choose a target for ${pendingDef.name}</span><button type="button" data-action="cancelTarget">Cancel</button></div>`
    : "";

  const enemyHint = taunts.length && canAct ? "TAUNT ACTIVE" : "CHOOSE TARGET";
  const logToggle = ui.logOpen ? "active" : "";

  return `<main class="combat-screen" style="${charStyle(run.char)}">
    ${renderRunBar(game, { combat: true })}
    <div class="battlefield ${ui.logOpen ? "with-log" : ""}">
      <section class="player-column">
        <div class="combat-player">
          <div class="combat-player-art">
            ${portraitForCombat(game)}
            <div class="combat-player-name"><h2>${char.name}</h2><span>${player.hp} HP</span></div>
          </div>
          <div class="combat-player-body">
            <div class="hp-line"><span>VITALITY</span><strong>${player.hp} <em>/ ${player.maxHp}</em></strong></div>
            ${hpBar(player.hp, player.maxHp, "player")}
            <div class="shield-row">
              ${player.block ? `<span class="shield-chip">${player.block} BLOCK</span>` : ""}
              ${player.overshield ? `<span class="shield-chip">${player.overshield} OVERSHIELD</span>` : ""}
            </div>
            <div class="stamina-block">
              <div class="stamina-label"><span>STAMINA</span><strong>${combat.stamina} / ${combat.maxStamina}</strong></div>
              ${staminaPips(combat.stamina, combat.maxStamina)}
            </div>
            <div class="player-stats">
              <div class="player-stat"><span>STR</span><strong>${player.strength}</strong></div>
              <div class="player-stat"><span>CRIT</span><strong>${Math.round((player.crit + combat.critBonus) * 100)}%</strong></div>
              <div class="player-stat"><span>CRIT DMG</span><strong>${Math.round(player.critDamage * 100)}%</strong></div>
              <div class="player-stat"><span>DRAW</span><strong>${combat.drawCount}</strong></div>
            </div>
            ${statusChips(playedStatuses, { crit: Math.round(combat.critBonus * 100) })}
          </div>
        </div>
        <div class="passive-strip"><strong>${char.passive.name}</strong><p>${char.passive.text}</p></div>
        ${taco}
      </section>

      <section class="enemy-column">
        <div class="combat-location"><span>${act.name} · ROOM ${run.roomsCleared + 1}</span><span>${combat.ended ? "BOARD CLEAR" : canAct ? "YOUR TURN" : "ENEMY TURN"}</span></div>
        <div class="enemy-grid">${enemies}</div>
      </section>

      <aside class="combat-side">
        <div class="combat-side-head"><span>THE BOARD REMEMBERS</span><strong>${combat.ended ? "END" : "LIVE"}</strong></div>
        <div class="combat-log" data-combat-log>${lastLogs(game, 28)}</div>
        <div class="side-summary">
          <div class="side-summary-row"><span>Draw pile</span><strong>${drawCount}</strong></div>
          <div class="side-summary-row"><span>Discard</span><strong>${discardCount}</strong></div>
          <div class="side-summary-row"><span>Exhausted</span><strong>${exhaustCount}</strong></div>
          <div class="side-summary-row"><span>Enemies left</span><strong>${combat.enemies.filter((e) => e.alive).length}</strong></div>
        </div>
      </aside>
    </div>

    <section class="hand-zone">
      <div class="hand-top">
        <div class="hand-meta"><span>STAMINA <strong>${combat.stamina}/${combat.maxStamina}</strong></span><span>HAND <strong>${combat.hand.length}</strong></span><span>${taunts.length ? "TAUNT" : "TURN " + combat.turn}</span></div>
        ${targetPrompt || (canAct ? `<span class="muted" style="font-family:var(--mono);font-size:7px;letter-spacing:.08em;text-transform:uppercase">${enemyHint}</span>` : "")}
      </div>
      <div class="hand-layout">
        <div class="hand-scroll">${hand || `<span class="empty-note">No cards in hand. End the turn.</span>`}</div>
        <div class="end-turn-wrap">
          <button type="button" class="end-turn" data-action="endTurn" ${!canAct ? "disabled" : ""}>End turn<small>E</small></button>
          <span class="end-turn-meta">${canAct ? "pay the board" : "wait"}</span>
        </div>
      </div>
    </section>
  </main>`;
}

function portraitForCombat(game) {
  const run = game.run;
  const outfit = CHARACTERS[run.char].outfits[run.outfit] || CHARACTERS[run.char].outfits[0];
  return `<img class="portrait" src="${outfit.file}" alt="${CHARACTERS[run.char].name}" onerror="this.classList.add('missing')" />`;
}
