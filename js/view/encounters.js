/* Events, offering stones, rest, treasure, and act transitions. */

import { CARDS } from "../data/cards.js";
import { ACTS, CHARMS } from "../data/enemies.js";
import { SPECIALS } from "../data/events.js";
import { charStyle, renderRunBar } from "./shared.js";

function resultLines(lines) {
  return lines.map((line) => `<div class="result-line">${line}</div>`).join("");
}

export function renderEvent(game) {
  const pending = game.pending?.event;
  if (!pending) return "";
  const { event, node } = pending;
  const isResult = !!pending.result;
  const choices = isResult
    ? `<div class="result-box">
        <h2>THE BOARD TURNS</h2>
        <div class="result-lines">${resultLines(pending.result.lines.length ? pending.result.lines : ["Nothing changes. The room remembers you anyway."])}</div>
        <div class="modal-actions"><button type="button" class="btn btn-primary" data-action="leaveEvent">Continue the climb</button></div>
      </div>`
    : `<div class="choice-list">
        ${event.choices.map((choice, index) => `<button type="button" class="choice ${choice.tone}" data-action="eventChoice" data-index="${index}">
          <span class="choice-mark">${choice.tone === "good" ? "✦" : choice.tone === "pact" ? "☠" : "·"}</span>
          <span class="choice-copy"><strong>${choice.label}</strong><span>${choice.detail}</span></span>
          <span class="choice-tag">${choice.tone === "good" ? "BOON" : choice.tone === "pact" ? "PACT" : "SMALL"}</span>
        </button>`).join("")}
      </div>`;

  return `<main class="event-screen" data-glyph="?" style="${charStyle(game.run.char)}">
    ${renderRunBar(game)}
    <div class="event-stage">
      <div class="event-kicker">RANDOM EVENT · ${isResult ? "CONSEQUENCE" : "A ROOM OFF THE BOARD"}</div>
      <h1 class="event-title">${event.title}</h1>
      <p class="event-body">${isResult ? `${pending.result.choice.label}. The room makes a sound like a page turning.` : event.body}</p>
      ${choices}
    </div>
  </main>`;
}

export function renderSpecial(game) {
  const pending = game.pending?.special;
  if (!pending) return "";
  const isResult = !!pending.result;
  const offerings = SPECIALS.offerings.map((offering) => {
    const can = offering.requires(game.run) && !isResult;
    return `<button type="button" class="offering" data-action="${can ? "takeOffering" : "noop"}" data-offering="${offering.id}" ${can ? "" : "disabled"}>
      <h3>${offering.name}</h3>
      <p>${offering.desc}</p>
      <div class="offering-exchange"><b>OFFER: ${offering.offer}</b><i>→</i><span>${offering.boon}</span></div>
      ${offering.requires(game.run) ? "" : `<div class="offering-locked">${offering.cannot}</div>`}
    </button>`;
  }).join("");

  return `<main class="special-screen" data-glyph="✦" style="${charStyle(game.run.char)}">
    ${renderRunBar(game)}
    <div class="special-stage">
      <div class="event-kicker">SPECIAL SPACE · THE OFFERING STONE</div>
      <h1 class="special-title">${SPECIALS.title}</h1>
      <p class="special-lede">${SPECIALS.body}</p>
      ${isResult
        ? `<div class="result-box">
            <h2>THE STONE ACCEPTS</h2>
            <div class="result-lines">${resultLines(pending.result.lines)}</div>
            <div class="modal-actions"><button type="button" class="btn btn-primary" data-action="leaveSpecial">Carry the boon onward</button></div>
          </div>`
        : `<div class="offerings">${offerings}</div>
           <div class="modal-actions"><button type="button" class="btn btn-ghost" data-action="leaveSpecial">Walk away untouched</button></div>`}
    </div>
  </main>`;
}

export function renderRest(game) {
  const rest = game.pending?.rest;
  if (!rest) return "";
  const deckPicker = rest.mode === "upgrade"
    ? `<div class="deck-picker" style="max-width:720px;margin:22px auto 0;text-align:left">
        <div class="deck-picker-head"><span>Choose a card to sharpen</span><button type="button" class="btn btn-small" data-action="restUpgradeMode">Cancel</button></div>
        <div class="deck-picker-list">
          ${game.run.deck.map((card) => {
            const def = CARDS[card.key];
            return `<button type="button" class="deck-pick" data-action="restUpgrade" data-uid="${card.uid}" ${card.upgraded ? "disabled" : ""}>
              <span><strong>${def.name}${card.upgraded ? " +" : ""}</strong></span><span>${card.upgraded ? "MAX" : "SHARPEN"}</span>
            </button>`;
          }).join("")}
        </div>
      </div>`
    : "";

  const body = rest.done
    ? `<div class="result-box" style="max-width:640px;margin:26px auto 0;text-align:left">
        <h2>YOU REST</h2>
        <div class="result-lines">${resultLines(rest.lines)}</div>
        <div class="modal-actions"><button type="button" class="btn btn-primary" data-action="leaveRest">Continue the climb</button></div>
      </div>`
    : `<div class="rest-actions">
        <button type="button" class="rest-choice" data-action="restHeal">
          <strong>Sleep badly</strong>
          <span>Heal 35% of your max HP. Dream of the staircase.</span>
        </button>
        <button type="button" class="rest-choice" data-action="restUpgradeMode">
          <strong>Sharpen a card</strong>
          <span>Permanently upgrade one card for the rest of this run.</span>
        </button>
      </div>
      <div class="btn-row" style="justify-content:center;margin-top:22px"><button type="button" class="btn btn-ghost" data-action="leaveRest">Leave the room</button></div>`;

  return `<main class="rest-screen" style="${charStyle(game.run.char)}">
    ${renderRunBar(game)}
    <div class="rest-wrap">
      <div class="rest-glyph">☾</div>
      <h1>The <em>Quiet Room.</em></h1>
      <p>No bells. No ink. Just a cot, a candle, and enough time for one terrible idea.</p>
      ${deckPicker}
      ${body}
    </div>
  </main>`;
}

export function renderTreasure(game) {
  const treasure = game.pending?.treasure;
  if (!treasure) return "";
  return `<main class="treasure-screen" style="${charStyle(game.run.char)}">
    ${renderRunBar(game)}
    <div class="treasure-wrap">
      <div class="treasure-glyph">◈</div>
      <h1>A <em>small fortune.</em></h1>
      <p>The chest is not locked. It has never been locked. That is somehow worse.</p>
      <div class="treasure-reveal">
        <div class="result-lines">${treasure.lines.map((line) => `<div class="result-line">${line}</div>`).join("")}</div>
        ${treasure.charmKey ? `<div class="result-line" style="margin-top:9px;color:var(--green)">${CHARMS[treasure.charmKey].name} — ${CHARMS[treasure.charmKey].desc}</div>` : ""}
      </div>
      <div class="treasure-actions"><button type="button" class="btn btn-primary" data-action="leaveTreasure">Take it all and climb</button></div>
    </div>
  </main>`;
}

export function renderActIntro(game) {
  const intro = game.pending?.actIntro;
  if (!intro) return "";
  const act = ACTS[game.run.act];
  return `<main class="act-intro-screen" data-roman="${act.roman}" style="${charStyle(game.run.char)}">
    <div class="act-intro-card">
      <div class="eyebrow no-line" style="justify-content:center">ACT ${act.roman} OF III</div>
      <h1>${act.name.replace(/^The /, "The ").replace(/^(.*)$/, "$1")}<br /><em>${act.roman}.</em></h1>
      <p>${act.subtitle}</p>
      <div class="act-intro-boss">Next boss · ${act.boss}</div>
      ${intro.healed ? `<div class="act-intro-heal">Between acts, you recover ${intro.healed} HP.</div>` : ""}
      <div class="modal-actions" style="justify-content:center"><button type="button" class="btn btn-primary" data-action="continueActIntro">Climb higher</button></div>
    </div>
  </main>`;
}
