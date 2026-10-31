/* Run endings: defeat and full clear. */

import { CHARACTERS, characterOutfit } from "../data/characters.js";
import { charStyle, portraitByFile } from "./shared.js";

function outfitFor(game, summary) {
  const charId = summary?.char || game.run?.char || "roxy";
  const tier = game.run?.outfit ?? game.meta.outfit[charId] ?? 0;
  return characterOutfit(charId, tier);
}

export function renderEnding(game) {
  const summary = game.pending?.runSummary;
  if (!summary) return "";
  const isClear = summary.kind === "clear";
  const char = CHARACTERS[summary.char];
  const outfit = outfitFor(game, summary);
  const word = isClear ? "CLIMBED" : "CHECKMATE";

  const stats = [
    ["Rooms", summary.rooms],
    ["Gold", summary.gold],
    ["Deck", summary.deckSize],
    ["Charms", summary.charms],
  ].map(([label, value]) => `<div class="end-stat"><span>${label}</span><strong>${value}</strong></div>`).join("");

  return `<main class="end-screen ${isClear ? "clear" : "dead"}" data-word="${word}" style="${charStyle(summary.char)}">
    <div class="end-wrap">
      <div class="end-art">
        ${portraitByFile(outfit.file, `${char.name} — ${outfit.name}`, "")}
        <span class="end-art-label">${char.name} · ${outfit.name} · ACT ${summary.act}</span>
      </div>
      <div class="end-copy">
        <div class="eyebrow">${isClear ? "THREE ACTS · ONE ASCENT" : "THE STAIRCASE KEEPS ITS OWN"}</div>
        <h1>${isClear ? "You made it" : "The board"}<br /><em>${isClear ? "to the top." : "closes."}</em></h1>
        <p class="end-lede">${isClear
          ? `${char.name} climbs past the Headmistress and out of the school. The staircase folds itself away behind her, already waiting for the next girl who thinks she can win.`
          : `${char.name} runs out of Stamina in act ${summary.act}. The tiles go quiet. Somewhere above, a bell rings once, politely, and the board resets.`}</p>
        <div class="end-ash"><strong>+${summary.ash}</strong><span>Ash earned · permanent</span></div>
        <div class="end-stats">${stats}</div>
        <div class="end-actions">
          <button type="button" class="btn btn-primary" data-action="returnToTitle">Return to the title</button>
          <button type="button" class="btn" data-action="showDeck">Review the deck</button>
          <button type="button" class="btn btn-ghost" data-action="archive">The archive</button>
        </div>
      </div>
    </div>
  </main>`;
}
