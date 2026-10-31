/* UI shell: screen routing, modals, notices, input, and keyboard shortcuts. */

import { CHARACTERS, PRESTIGE_STYLES } from "./data/characters.js";
import { CARDS } from "./data/cards.js";
import { CHARMS } from "./data/enemies.js";
import { renderTitle, renderSelect, renderBriefing, renderArchive, renderWardrobe, renderTips, renderPrestige } from "./view/lobby.js";
import { renderMap } from "./view/map.js";
import { renderCombat } from "./view/combat.js";
import { renderReward, renderShop } from "./view/reward.js";
import { renderEvent, renderSpecial, renderRest, renderTreasure, renderActIntro } from "./view/encounters.js";
import { renderEnding } from "./view/endings.js";
import { deckEntry, charmEntry, charStyle } from "./view/shared.js";

const RUN_SCREENS = new Set([
  "map", "combat", "reward", "shop", "event", "event_result", "special",
  "special_result", "rest", "treasure", "act_intro",
]);

function escapeHtml(text) {
  return String(text ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));
}

export class UI {
  constructor(game, root = document.getElementById("app")) {
    this.game = game;
    this.root = root;
    this.logOpen = false;
    this.modal = null;
    this.lastScreen = null;
    this.tipsReturn = "title";
    this.noticeTimer = null;

    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  mount() {
    if (!this.root) return;
    this.root.addEventListener("click", this.onClick);
    document.addEventListener("keydown", this.onKeyDown);
    this.render();
  }

  render() {
    const game = this.game;
    if (!this.root) return;
    const changedScreen = game.screen !== this.lastScreen;
    if (changedScreen) {
      this.modal = null;
      this.lastScreen = game.screen;
    }

    let screen = "";
    switch (game.screen) {
      case "title": screen = renderTitle(game); break;
      case "select": screen = renderSelect(game); break;
      case "briefing": screen = renderBriefing(game); break;
      case "archive": screen = renderArchive(game); break;
      case "wardrobe": screen = renderWardrobe(game); break;
      case "tips": screen = renderTips(game); break;
      case "map": screen = renderMap(game); break;
      case "combat": screen = renderCombat(game, this); break;
      case "reward": screen = renderReward(game); break;
      case "shop": screen = renderShop(game); break;
      case "event":
      case "event_result": screen = renderEvent(game); break;
      case "special":
      case "special_result": screen = renderSpecial(game); break;
      case "rest": screen = renderRest(game); break;
      case "treasure": screen = renderTreasure(game); break;
      case "act_intro": screen = renderActIntro(game); break;
      case "gameover":
      case "runclear": screen = renderEnding(game); break;
      case "prestige": screen = renderPrestige(game); break;
      default: screen = renderTitle(game); break;
    }

    const toast = game.notice
      ? `<div class="notice-toast ${game.notice.tone || ""}" role="status">${escapeHtml(game.notice.text)}</div>`
      : "";

    this.root.innerHTML = `${screen}${this.renderModal()}${toast}`;
    if (changedScreen) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    this.scrollLog();
    this.scheduleNoticeClear();
  }

  renderModal() {
    if (!this.modal) return "";
    const game = this.game;

    if (this.modal === "prestige") {
      const next = Math.min(3, game.meta.prestige + 1);
      const style = PRESTIGE_STYLES[next - 1];
      return `<div class="modal-scrim" data-action="closeModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="prestige-title">
          <div class="modal-head">
            <div><div class="eyebrow no-line">THE BEAUTIFUL RESET</div><h2 id="prestige-title">Prestige ${next} <span class="muted">/ 3</span></h2></div>
            <button type="button" class="modal-close" data-action="closeModal" aria-label="Close">×</button>
          </div>
          <div class="modal-body">
            <div class="modal-copy">
              <p><strong>${style?.name || "A new look."}</strong> — ${style?.line || ""}</p>
              <p>Every permanent upgrade and every point of Ash will be erased. All four girls unlock their next outfit, and the staircase starts from the bottom.</p>
              <p class="muted">Run counters, clears, and prestige rank are kept. The wardrobe is permanent.</p>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-primary" data-action="confirmPrestige">Erase the archive</button>
              <button type="button" class="btn btn-ghost" data-action="closeModal">Not yet</button>
            </div>
          </div>
        </div>
      </div>`;
    }

    const run = game.run;
    if (!run) return "";

    if (this.modal === "deck") {
      const upgraded = run.deck.filter((card) => card.upgraded).length;
      return `<div class="modal-scrim" data-action="closeModal">
        <div class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="deck-title">
          <div class="modal-head">
            <div><div class="eyebrow no-line">${CHARACTERS[run.char].name} · ${run.deck.length} CARDS</div><h2 id="deck-title">The deck.</h2></div>
            <button type="button" class="modal-close" data-action="closeModal" aria-label="Close">×</button>
          </div>
          <div class="modal-body">
            <p class="modal-copy">${upgraded} upgraded · ${run.deck.length - upgraded} base. Hover or tap a card to read it. The draw pile is shuffled; the discard pile comes back.</p>
            <div class="deck-grid">${run.deck.map((card) => deckEntry(card)).join("")}</div>
            <div class="modal-actions"><button type="button" class="btn" data-action="closeModal">Back to the climb</button></div>
          </div>
        </div>
      </div>`;
    }

    if (this.modal === "charms") {
      const charms = run.charms.length
        ? run.charms.map((key) => charmEntry(key)).join("")
        : `<p class="empty-note">No charms collected. Elite fights and treasure chests are where they live.</p>`;
      const boons = run.boons.length
        ? run.boons.map((boon) => `<div class="charm-entry"><strong>${escapeHtml(boon.name)}</strong><span>${escapeHtml(boon.boon)}</span></div>`).join("")
        : `<p class="empty-note">No offerings made. The stone is patient.</p>`;
      return `<div class="modal-scrim" data-action="closeModal">
        <div class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="charms-title">
          <div class="modal-head">
            <div><div class="eyebrow no-line">PERMANENT FOR THIS RUN</div><h2 id="charms-title">Charms &amp; boons.</h2></div>
            <button type="button" class="modal-close" data-action="closeModal" aria-label="Close">×</button>
          </div>
          <div class="modal-body">
            <div class="modal-copy"><p><strong>${run.charms.length}</strong> charms · <strong>${run.boons.length}</strong> offerings. Charms work automatically. Offerings are the stone's idea of a fair trade.</p></div>
            <div class="charm-list-modal">${charms}${boons}</div>
            <div class="modal-actions"><button type="button" class="btn" data-action="closeModal">Back to the climb</button></div>
          </div>
        </div>
      </div>`;
    }

    return "";
  }

  scrollLog() {
    const log = this.root?.querySelector("[data-combat-log]");
    if (log) log.scrollTop = log.scrollHeight;
  }

  scheduleNoticeClear() {
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
    if (!this.game.notice) return;
    this.noticeTimer = setTimeout(() => {
      this.game.notice = null;
      const toast = this.root?.querySelector(".notice-toast");
      if (toast) toast.remove();
    }, 3000);
  }

  onClick(event) {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    if (!action || action === "noop") return;

    if (action === "closeModal" && actionEl.classList.contains("modal-scrim") && event.target.closest(".modal")) {
      return;
    }

    const game = this.game;
    const data = actionEl.dataset;

    switch (action) {
      /* title / lobby */
      case "choose": game.openSelect(); break;
      case "selectChar": if (data.char) game.openBriefing(data.char); break;
      case "backTitle": game.goTitle(); break;
      case "backSelect": game.openSelect(); break;
      case "briefOutfit": game.selectBriefingOutfit(Number(data.tier)); break;
      case "beginRun": game.beginRun(); break;
      case "archive": game.openArchive(); break;
      case "wardrobe": game.openWardrobe(); break;
      case "openTips":
        if (game.screen !== "tips") this.tipsReturn = RUN_SCREENS.has(game.screen) ? game.screen : "title";
        this.modal = null;
        game.openTips();
        break;
      case "backFromTips":
        if (RUN_SCREENS.has(this.tipsReturn) && game.run) game.setScreen(this.tipsReturn);
        else game.setScreen("title");
        break;
      case "buyUpgrade": game.buyUpgrade(data.upgrade); break;
      case "prestigeAsk": this.modal = "prestige"; this.render(); break;
      case "confirmPrestige": this.modal = null; game.prestige(); break;
      case "equipOutfit": game.equipOutfit(data.char, Number(data.tier)); break;
      case "openWardrobeFromPrestige": this.modal = null; game.openWardrobe(); break;
      case "prestigeDone": this.modal = null; game.goTitle(); break;

      /* map */
      case "enterNode": if (data.node) game.enterNode(data.node); break;

      /* combat */
      case "card": if (data.uid) game.selectCard(data.uid); break;
      case "targetEnemy": if (data.uid) game.playSelected(data.uid); break;
      case "cancelTarget": game.cancelPending(); break;
      case "endTurn": game.endTurn(); break;
      case "toggleLog": this.logOpen = !this.logOpen; this.render(); break;
      case "showDeck": this.modal = "deck"; this.render(); break;
      case "showCharms": this.modal = "charms"; this.render(); break;
      case "closeModal": this.modal = null; this.render(); break;

      /* rewards & shop */
      case "chooseReward": game.chooseReward(Number(data.index)); break;
      case "skipReward": game.skipReward(); break;
      case "buyShopCard": game.buyShopCard(Number(data.index)); break;
      case "buyShopCharm": game.buyShopCharm(); break;
      case "shopHeal": game.shopHeal(); break;
      case "shopMode": game.setShopMode(data.mode); break;
      case "shopUpgrade": game.shopUpgrade(data.uid); break;
      case "shopRemove": game.shopRemove(data.uid); break;
      case "leaveShop": game.leaveShop(); break;

      /* events / offerings / rest / treasure / acts */
      case "eventChoice": game.chooseEvent(Number(data.index)); break;
      case "leaveEvent": game.leaveEvent(); break;
      case "takeOffering": game.takeOffering(data.offering); break;
      case "leaveSpecial": game.leaveSpecial(); break;
      case "restHeal": game.restHeal(); break;
      case "restUpgradeMode": game.restUpgradeMode(); break;
      case "restUpgrade": game.restUpgrade(data.uid); break;
      case "leaveRest": game.leaveRest(); break;
      case "leaveTreasure": game.leaveTreasure(); break;
      case "continueActIntro": game.continueActIntro(); break;

      /* endings */
      case "returnToTitle": game.returnFromRun(); break;

      default: break;
    }
  }

  onKeyDown(event) {
    const game = this.game;
    if (event.target.closest?.("input, textarea, select, [contenteditable='true']")) return;

    if (event.key === "Escape") {
      if (this.modal) {
        this.modal = null;
        this.render();
        return;
      }
      if (game.combat?.pendingCard) {
        game.cancelPending();
        return;
      }
      return;
    }

    if (this.modal || game.screen !== "combat" || !game.combat) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const key = event.key.toLowerCase();
    if (key === "e") {
      event.preventDefault();
      if (!event.repeat) game.endTurn();
      return;
    }
    if (key === "d") {
      event.preventDefault();
      if (!event.repeat) { this.modal = "deck"; this.render(); }
      return;
    }
    if (key === "c") {
      event.preventDefault();
      if (!event.repeat) { this.modal = "charms"; this.render(); }
      return;
    }
    if (key === "l") {
      event.preventDefault();
      if (!event.repeat) { this.logOpen = !this.logOpen; this.render(); }
      return;
    }
    if (/^[1-9]$/.test(event.key) && game.combat.phase === "player" && !game.combat.ended) {
      const card = game.combat.hand[Number(event.key) - 1];
      if (card) {
        event.preventDefault();
        game.selectCard(card.uid);
      }
    }
  }
}
