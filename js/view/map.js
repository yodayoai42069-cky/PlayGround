/* The checkerboard map. */

import { CHARACTERS } from "../data/characters.js";
import { ACTS, CHARMS } from "../data/enemies.js";
import {
  charStyle, metaSummary, nodeType, NODE_TYPES, portrait, renderRunBar,
} from "./shared.js";

function nodeClass(node, run, available) {
  const isCurrent = node.id === run.currentNode;
  const canEnter = available.has(node.id);
  const classes = ["map-node"];
  if (node.type === "boss") classes.push("boss");
  if (node.type === "start") classes.push("start");
  if (isCurrent) classes.push("current");
  else if (canEnter) classes.push("available");
  else if (node.done) classes.push("done");
  else classes.push("locked");
  if (node.done) classes.push("done");
  return classes.join(" ");
}

export function renderMap(game) {
  const run = game.run;
  if (!run) return "";
  const char = CHARACTERS[run.char];
  const act = ACTS[run.act];
  const available = new Set(run.available);
  const current = run.map.nodes.find((n) => n.id === run.currentNode);
  const nodesById = Object.fromEntries(run.map.nodes.map((n) => [n.id, n]));

  const tiles = [];
  for (let row = 7; row >= 0; row -= 1) {
    for (let col = 0; col < 5; col += 1) {
      const dark = (row + col) % 2 === 0;
      tiles.push(`<span class="map-tile ${dark ? "dark" : "light"}"></span>`);
    }
  }

  const lines = [];
  for (const node of run.map.nodes) {
    for (const targetId of node.conn || []) {
      const target = nodesById[targetId];
      if (!target) continue;
      const x1 = (node.col + 0.5) * 100;
      const y1 = (7 - node.row + 0.5) * 100;
      const x2 = (target.col + 0.5) * 100;
      const y2 = (7 - target.row + 0.5) * 100;
      let lineClass = "map-line";
      if (node.id === run.currentNode) lineClass += " active";
      else if (node.done) lineClass += " done";
      lines.push(`<line class="${lineClass}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`);
    }
  }

  const nodeMarkup = run.map.nodes.map((node) => {
    const info = nodeType(node.type);
    const isAvailable = available.has(node.id);
    const isCurrent = node.id === run.currentNode;
    const cls = nodeClass(node, run, available);
    const disabled = !isAvailable;
    const label = isAvailable || isCurrent || node.type === "boss" ? `<span class="node-label">${info.label}</span>` : "";
    const aria = `${info.label}${isAvailable ? ". Available" : isCurrent ? ". Current" : node.done ? ". Cleared" : ". Locked"}`;
    return `<button type="button" class="${cls}" data-type="${node.type}" style="left:${(node.col + 0.5) * 20}%;top:${(7 - node.row + 0.5) * 12.5}%" data-action="${isAvailable ? "enterNode" : "noop"}" data-node="${node.id}" title="${info.label}" aria-label="${aria}" ${disabled ? "disabled" : ""}>
      <span class="node-icon">${info.icon}</span>
      ${label}
    </button>`;
  }).join("");

  const boons = run.boons.length
    ? run.boons.map((b) => `<div class="boon-item"><span><strong>${b.name}</strong> — ${b.boon}</span></div>`).join("")
    : `<p class="empty-note">No offerings made. The stone is patient.</p>`;

  const charms = run.charms.length
    ? run.charms.map((key) => `<div class="charm-item"><span><strong>${CHARMS[key].name}</strong> — ${CHARMS[key].desc}</span></div>`).join("")
    : `<p class="empty-note">No charms collected yet.</p>`;

  const legend = ["battle", "elite", "shop", "event", "special", "rest", "treasure", "boss"].map((type) => {
    const info = NODE_TYPES[type];
    return `<div class="legend-item"><span class="legend-icon" style="--legend:${info.color}">${info.icon}</span>${info.label}</div>`;
  }).join("");

  const next = run.available.map((id) => nodesById[id]).filter(Boolean);
  const nextLine = next.length
    ? next.map((n) => nodeType(n.type).label).filter((v, i, a) => a.indexOf(v) === i).join(" · ")
    : "The boss waits.";

  return `<main class="map-screen" style="${charStyle(run.char)}">
    ${renderRunBar(game)}
    <div class="map-page">
      <aside class="map-aside left">
        <div class="run-portrait-card">
          ${portrait(game, run.char, run.outfit)}
          <div class="run-portrait-copy">
            <h2>${char.name}</h2>
            <span>${char.epithet}</span>
            <small>${char.passive.name}<br />${char.style}</small>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><span>THE CLIMB</span><strong>${act.roman} / III</strong></div>
          <div class="panel-body">
            <div class="stat-row"><span>Health</span><strong>${run.hp} / ${run.maxHp}</strong></div>
            <div class="stat-row"><span>Gold</span><strong class="gold">${run.gold}g</strong></div>
            <div class="stat-row"><span>Deck</span><strong>${run.deck.length} cards</strong></div>
            <div class="stat-row"><span>Charms</span><strong>${run.charms.length}</strong></div>
            <div class="stat-row"><span>Rooms cleared</span><strong>${run.roomsCleared}</strong></div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><span>OFFERINGS</span><strong>${run.boons.length}</strong></div>
          <div class="panel-body"><div class="boon-list">${boons}</div></div>
        </div>
        <div class="panel">
          <div class="panel-head"><span>CHARMS</span><strong>${run.charms.length}</strong></div>
          <div class="panel-body"><div class="charm-list">${charms}</div></div>
        </div>
      </aside>

      <section class="map-main">
        <div class="map-heading">
          <div class="eyebrow no-line" style="justify-content:center">ACT ${act.roman} · THE ${String(act.name).replace(/^The /, "").toUpperCase()}</div>
          <h1>The <em>${act.name.replace(/^The /, "")}</em></h1>
          <p>${act.subtitle}</p>
        </div>
        <div class="map-board-wrap">
          <div class="map-board">
            <div class="map-grid">${tiles.join("")}</div>
            <svg class="map-lines" viewBox="0 0 500 800" preserveAspectRatio="none" aria-hidden="true">${lines.join("")}</svg>
            ${nodeMarkup}
          </div>
        </div>
        <div class="board-caption">
          <span>${nextLine}</span>
          <span>${run.currentRow} / 7 rooms climbed</span>
        </div>
      </section>

      <aside class="map-aside right">
        <div class="act-panel" data-roman="${act.roman}">
          <div class="eyebrow no-line">CURRENT ACT</div>
          <h3>${act.name}</h3>
          <p>${act.subtitle}</p>
          <div class="act-boss">${act.boss}</div>
        </div>
        <div class="panel">
          <div class="panel-head"><span>THE BOARD</span><strong>READ THE TILES</strong></div>
          <div class="panel-body">
            <div class="legend-list">${legend}</div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><span>YOUR MOVE</span><strong>${next.length} OPEN</strong></div>
          <div class="panel-body">
            <p class="empty-note">Pick a lit tile one row above you. The board only lets you climb on the diagonal or straight up. Every choice is a room you will not see again.</p>
          </div>
        </div>
      </aside>
    </div>
  </main>`;
}
