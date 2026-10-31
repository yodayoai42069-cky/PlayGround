/* Reward and shop screens. */

import { CARDS, RARITY } from "../data/cards.js";
import { CHARMS, ACTS } from "../data/enemies.js";
import { cardMarkup, charStyle, renderRunBar } from "./shared.js";

export function renderReward(game) {
  const reward = game.pending?.reward;
  if (!reward) return "";
  const char = game.run.char;
  const takes = reward.takes || 1;
  const picked = reward.picked || 0;
  const remaining = Math.max(0, takes - picked);
  const heading = reward.boss ? "The act is <em>closed.</em>" : reward.elite ? "The elite is <em>done.</em>" : "The board is <em>clear.</em>";
  const kicker = reward.boss ? "BOSS DEFEATED" : reward.elite ? "ELITE DEFEATED" : "BATTLE WON";
  const cards = reward.cards.map((card, index) => cardMarkup(card, {
    action: "chooseReward",
    index,
    className: "reward-card",
    disabled: card.taken,
    taken: card.taken,
  })).join("");
  const dense = reward.cards.length > 4 ? " dense" : "";
  const charm = reward.charm
    ? `<div class="reward-charm">Charm acquired · <strong>${reward.charm.name}</strong> — ${reward.charm.desc}</div>`
    : "";
  const act = ACTS[game.run.act];
  const draftLine = remaining > 0
    ? `Draft ${remaining} more card${remaining === 1 ? "" : "s"} — click a card to add it.`
    : "Draft complete.";

  return `<main class="reward-screen" style="${charStyle(char)}">
    ${renderRunBar(game)}
    <div class="reward-wrap">
      <header class="reward-head">
        <div class="eyebrow no-line" style="justify-content:center">${kicker} · ACT ${act.roman}</div>
        <h1>${heading}</h1>
        <p class="reward-draft-line">${draftLine}</p>
        <div class="reward-summary">
          <span>Gold <strong>+${reward.gold}</strong></span>
          <span>Deck <strong>${game.run.deck.length}</strong></span>
          <span>HP <strong>${game.run.hp}/${game.run.maxHp}</strong></span>
          <span>Draft <strong>${picked}/${takes}</strong></span>
          ${reward.boss ? "<span>Next act <strong>imminent</strong></span>" : ""}
        </div>
        ${charm}
      </header>
      <div class="reward-cards${dense}">${cards}</div>
      <div class="reward-actions">
        <button type="button" class="btn btn-ghost" data-action="skipReward">${picked ? "Take no more cards" : "Take no card"}</button>
      </div>
    </div>
  </main>`;
}

function shopCard(item, index) {
  const def = CARDS[item.key];
  const rarity = RARITY[def.rarity];
  return `<div class="shop-item ${item.sold ? "sold" : ""}" style="--rarity:${rarity.color}">
    ${cardMarkup({ key: item.key, uid: `shop-${index}`, upgraded: false })}
    <div class="shop-price"><span>${item.sold ? "SOLD" : rarity.label}</span><button type="button" class="btn btn-small" data-action="buyShopCard" data-index="${index}">${item.sold ? "Sold" : `${item.price}g`}</button></div>
  </div>`;
}

export function renderShop(game) {
  const shop = game.pending?.shop;
  if (!shop) return "";
  const mode = shop.mode;
  const cards = shop.cards.map(shopCard).join("");
  const charm = shop.charm
    ? `<div class="shop-charm">
        <div class="shop-charm-head"><span>Charm</span><strong>${CHARMS[shop.charm.key].name}</strong></div>
        <p>${CHARMS[shop.charm.key].desc}</p>
        <button type="button" class="btn btn-small" data-action="buyShopCharm" ${shop.charm.sold ? "disabled" : ""}>${shop.charm.sold ? "Sold" : `${shop.charm.price}g · take it`}</button>
      </div>`
    : "";

  const pickList = game.run.deck.map((card) => {
    const def = CARDS[card.key];
    const isUpgrade = mode === "upgrade";
    const disabled = isUpgrade
      ? card.upgraded || game.run.gold < shop.upgradeCost
      : game.run.deck.length <= 3 || game.run.gold < shop.removeCost;
    return `<button type="button" class="deck-pick" data-action="${isUpgrade ? "shopUpgrade" : "shopRemove"}" data-uid="${card.uid}" ${disabled ? "disabled" : ""}>
      <span><strong>${def.name}${card.upgraded ? " +" : ""}</strong></span><span>${isUpgrade ? (card.upgraded ? "honing max" : `${shop.upgradeCost}g`) : `${shop.removeCost}g`}</span>
    </button>`;
  }).join("");

  return `<main class="location-screen shop-screen" style="${charStyle(game.run.char)}">
    ${renderRunBar(game)}
    <div class="location-wrap">
      <header class="location-head">
        <div>
          <div class="eyebrow">OPTIONAL · BUT TEMPTING</div>
          <h1>The <em>Tuck Shop.</em></h1>
          <p>Cards, cures, and one deeply suspicious charm. The shopkeeper does not look up from her crossword.</p>
        </div>
        <div class="location-gold"><strong>${game.run.gold}</strong><span>gold</span></div>
      </header>

      <div class="shop-layout">
        <section>
          <div class="shop-section-head"><span>CARDS FOR SALE</span><span>${shop.cards.filter((c) => !c.sold).length} remaining</span></div>
          <div class="shop-cards">${cards}</div>
          ${charm}
          ${mode ? `<div class="deck-picker">
            <div class="deck-picker-head"><span>${mode === "upgrade" ? "Choose a card to hone · 55g" : "Choose a card to forget · 45g"}</span><button type="button" class="btn btn-small" data-action="shopMode" data-mode="${mode}">Cancel</button></div>
            <div class="deck-picker-list">${pickList}</div>
          </div>` : ""}
        </section>

        <aside class="shop-services">
          <div class="shop-section-head"><span>SERVICES</span><span>THE SMALL PRINT</span></div>
          <button type="button" class="service-card" data-action="shopHeal" ${shop.healUsed || game.run.gold < shop.healCost ? "disabled" : ""}>
            <span class="service-copy"><strong>Patch Up</strong><span>${shop.healUsed ? "Already used in this shop." : "Heal 35% of max HP."}</span></span>
            <span class="service-price">${shop.healUsed ? "USED" : `${shop.healCost}g`}</span>
          </button>
          <button type="button" class="service-card ${mode === "upgrade" ? "active" : ""}" data-action="shopMode" data-mode="upgrade" ${game.run.gold < shop.upgradeCost ? "disabled" : ""}>
            <span class="service-copy"><strong>Hone a Card</strong><span>Permanently upgrade one card for this run.</span></span>
            <span class="service-price">${shop.upgradeCost}g</span>
          </button>
          <button type="button" class="service-card ${mode === "remove" ? "active" : ""}" data-action="shopMode" data-mode="remove" ${game.run.deck.length <= 3 || game.run.gold < shop.removeCost ? "disabled" : ""}>
            <span class="service-copy"><strong>Forget a Card</strong><span>Remove a card from your deck for this run.</span></span>
            <span class="service-price">${shop.removeCost}g</span>
          </button>
          <button type="button" class="service-card" data-action="leaveShop">
            <span class="service-copy"><strong>Leave the shop</strong><span>Climb on. The staircase is not getting shorter.</span></span>
            <span class="service-price">→</span>
          </button>
        </aside>
      </div>
    </div>
  </main>`;
}
