/* Map locations: shops, events, offerings, rest, treasure, and rewards. */

import { CARDS, RARITY } from "./data/cards.js";
import { CHARMS, ACTS } from "./data/enemies.js";
import { EVENTS, SPECIALS } from "./data/events.js";
import { pick, shuffle, rand } from "./util.js";

function cardPrice(rarity) {
  const base = { common: 46, uncommon: 70, rare: 105 }[rarity] || 45;
  return base + rand(9) - 4;
}

function rewardRarity(roll) {
  if (roll < 10) return "rare";
  if (roll < 40) return "uncommon";
  return "common";
}

export const worldMethods = {
  /* ---------------- shops ---------------- */

  openShop(node) {
    const shop = {
      node,
      cards: [],
      charm: null,
      healCost: 30,
      healUsed: false,
      upgradeCost: 55,
      removeCost: 45,
      mode: null,
    };
    const used = new Set();
    let guard = 0;
    while (shop.cards.length < 4 && guard < 80) {
      guard += 1;
      const rarity = rewardRarity(Math.random() * 100);
      const pool = Object.keys(CARDS).filter((key) => CARDS[key].char === this.run.char && CARDS[key].rarity === rarity && !used.has(key));
      if (!pool.length) continue;
      const key = pick(pool);
      used.add(key);
      shop.cards.push({ key, price: cardPrice(rarity), sold: false });
    }
    const charmKey = this.randomAvailableCharm();
    if (charmKey) shop.charm = { key: charmKey, price: 85 + rand(11), sold: false };
    this.pending = { shop };
    this.screen = "shop";
    this.emit();
  },

  buyShopCard(index) {
    const shop = this.pending?.shop;
    const item = shop?.cards[index];
    if (!item || item.sold) return;
    if (this.run.gold < item.price) {
      this.notice = { text: "Not enough gold.", tone: "bad" };
      this.emit();
      return;
    }
    this.run.gold -= item.price;
    item.sold = true;
    this.addCard(item.key);
    this.notice = { text: `${CARDS[item.key].name} added to your deck.`, tone: "good" };
    this.emit();
  },

  buyShopCharm() {
    const shop = this.pending?.shop;
    if (!shop?.charm || shop.charm.sold) return;
    if (this.run.gold < shop.charm.price) {
      this.notice = { text: "Not enough gold.", tone: "bad" };
      this.emit();
      return;
    }
    this.run.gold -= shop.charm.price;
    shop.charm.sold = true;
    this.awardCharm(shop.charm.key);
    this.notice = { text: `Charm acquired: ${CHARMS[shop.charm.key].name}.`, tone: "good" };
    this.emit();
  },

  shopHeal() {
    const shop = this.pending?.shop;
    if (!shop || shop.healUsed) return;
    if (this.run.gold < shop.healCost) {
      this.notice = { text: "Not enough gold.", tone: "bad" };
      this.emit();
      return;
    }
    this.run.gold -= shop.healCost;
    const healed = Math.min(this.run.maxHp - this.run.hp, Math.ceil(this.run.maxHp * 0.35));
    this.run.hp += healed;
    shop.healUsed = true;
    this.notice = { text: `Patched up ${healed} HP.`, tone: "good" };
    this.emit();
  },

  setShopMode(mode) {
    if (!this.pending?.shop) return;
    this.pending.shop.mode = this.pending.shop.mode === mode ? null : mode;
    this.emit();
  },

  shopUpgrade(uid) {
    const shop = this.pending?.shop;
    const card = this.run.deck.find((c) => c.uid === uid);
    if (!shop || !card || card.upgraded) return;
    if (this.run.gold < shop.upgradeCost) {
      this.notice = { text: "Not enough gold.", tone: "bad" };
      this.emit();
      return;
    }
    this.run.gold -= shop.upgradeCost;
    card.upgraded = true;
    shop.mode = null;
    this.notice = { text: `${CARDS[card.key].name} honed for the rest of the run.`, tone: "good" };
    this.emit();
  },

  shopRemove(uid) {
    const shop = this.pending?.shop;
    if (!shop || this.run.deck.length <= 3) {
      this.notice = { text: "The deck is too small to cut.", tone: "bad" };
      this.emit();
      return;
    }
    const card = this.run.deck.find((c) => c.uid === uid);
    if (!card) return;
    if (this.run.gold < shop.removeCost) {
      this.notice = { text: "Not enough gold.", tone: "bad" };
      this.emit();
      return;
    }
    this.run.gold -= shop.removeCost;
    this.removeCard(uid);
    shop.mode = null;
    this.notice = { text: `${CARDS[card.key].name} forgotten.`, tone: "good" };
    this.emit();
  },

  leaveShop() {
    const shop = this.pending?.shop;
    if (!shop) return;
    this.completeNodeAndAdvance(shop.node);
  },

  /* ---------------- events ---------------- */

  openEvent(node) {
    let pool = EVENTS.filter((ev) => !this.run.seenEvents.includes(ev.id));
    if (!pool.length) {
      this.run.seenEvents = [];
      pool = EVENTS;
    }
    const event = pick(pool);
    this.run.seenEvents.push(event.id);
    this.pending = { event: { node, event, result: null } };
    this.screen = "event";
    this.emit();
  },

  chooseEvent(index) {
    const pending = this.pending?.event;
    if (!pending || pending.result) return;
    const choice = pending.event.choices[index];
    if (!choice) return;
    const lines = this.applySpec(choice.effect);
    pending.result = { choice, lines };
    this.screen = "event_result";
    this.emit();
  },

  leaveEvent() {
    const pending = this.pending?.event;
    if (!pending) return;
    this.completeNodeAndAdvance(pending.node);
  },

  /* ---------------- offering stones ---------------- */

  openSpecial(node) {
    this.pending = { special: { node, result: null } };
    this.screen = "special";
    this.emit();
  },

  takeOffering(id) {
    const pending = this.pending?.special;
    if (!pending || pending.result) return;
    const offering = SPECIALS.offerings.find((o) => o.id === id);
    if (!offering || !offering.requires(this.run)) return;
    const lines = [];
    const payLines = this.applySpec(offering.pay);
    lines.push(...payLines);
    const gainLines = this.applySpec(offering.gain);
    lines.push(...gainLines);
    this.run.boons.push({ name: offering.name, offer: offering.offer, boon: offering.boon });
    pending.result = { offering, lines };
    this.screen = "special_result";
    this.emit();
  },

  leaveSpecial() {
    const pending = this.pending?.special;
    if (!pending) return;
    this.completeNodeAndAdvance(pending.node);
  },

  /* ---------------- rest ---------------- */

  openRest(node) {
    this.pending = { rest: { node, mode: null, done: false, lines: [] } };
    this.screen = "rest";
    this.emit();
  },

  restHeal() {
    const rest = this.pending?.rest;
    if (!rest || rest.done) return;
    const healed = Math.min(this.run.maxHp - this.run.hp, Math.ceil(this.run.maxHp * 0.35));
    this.run.hp += healed;
    rest.done = true;
    rest.lines = [`Slept badly. Woke up ${healed} HP healthier.`];
    this.emit();
  },

  restUpgradeMode() {
    const rest = this.pending?.rest;
    if (!rest || rest.done) return;
    rest.mode = rest.mode === "upgrade" ? null : "upgrade";
    this.emit();
  },

  restUpgrade(uid) {
    const rest = this.pending?.rest;
    if (!rest || rest.done) return;
    const card = this.run.deck.find((c) => c.uid === uid);
    if (!card || card.upgraded) return;
    card.upgraded = true;
    rest.done = true;
    rest.mode = null;
    rest.lines = [`Sharpened ${CARDS[card.key].name}. It will not dull again this run.`];
    this.emit();
  },

  leaveRest() {
    const rest = this.pending?.rest;
    if (!rest) return;
    this.completeNodeAndAdvance(rest.node);
  },

  /* ---------------- treasure ---------------- */

  openTreasure(node) {
    const charmKey = this.randomAvailableCharm();
    const gold = 20 + this.run.act * 6 + rand(10);
    const lines = [];
    if (charmKey) {
      this.awardCharm(charmKey);
      lines.push(`Charm: ${CHARMS[charmKey].name}.`);
    } else {
      this.run.gold += 40;
      lines.push("The chest is full of charms you already own. You take 40 gold instead.");
    }
    this.run.gold += gold;
    lines.push(`Gold: ${gold}.`);
    this.pending = { treasure: { node, charmKey, gold, lines } };
    this.screen = "treasure";
    this.emit();
  },

  leaveTreasure() {
    const pending = this.pending?.treasure;
    if (!pending) return;
    this.completeNodeAndAdvance(pending.node);
  },

  /* ---------------- rewards ---------------- */

  buildRewardCards(mode = "normal") {
    const wanted = this.rewardTakes(mode) + 2;
    const cards = [];
    const used = new Set();
    let guard = 0;
    while (cards.length < wanted && guard < 120) {
      guard += 1;
      let rarity;
      if (mode === "boss") rarity = cards.length < 3 ? "rare" : "uncommon";
      else if (mode === "elite") rarity = rewardRarity(Math.random() * 100 - 12);
      else rarity = rewardRarity(Math.random() * 100);
      let pool = Object.keys(CARDS).filter((key) => {
        const def = CARDS[key];
        return def.char === this.run.char && def.rarity === rarity && !used.has(key);
      });
      if (!pool.length) {
        pool = Object.keys(CARDS).filter((key) => {
          const def = CARDS[key];
          return def.char === this.run.char && def.rarity !== "starter" && !used.has(key);
        });
      }
      if (!pool.length) break;
      const key = pick(pool);
      used.add(key);
      cards.push({ key, upgraded: false, taken: false });
    }
    return cards;
  },

  rewardTakes(mode = "normal") {
    if (mode === "boss") return 3;
    if (mode === "elite") return 2;
    return 1;
  },

  handleVictory(node) {
    if (!this.run || !this.combat) return;
    const run = this.run;
    run.hp = Math.max(1, this.combat.player.hp);
    run.battlesWon += 1;
    const isElite = node.type === "elite";
    const isBoss = node.type === "boss";
    const mode = isBoss ? "boss" : isElite ? "elite" : "normal";
    let gold = 14 + run.act * 5 + rand(9);
    if (isElite) gold += 24;
    if (isBoss) gold += 38;
    run.gold += gold;
    let charmInfo = null;
    if (isElite || isBoss) {
      const key = this.randomAvailableCharm();
      if (key) {
        this.awardCharm(key);
        charmInfo = { key, ...CHARMS[key] };
      } else {
        run.gold += 30;
      }
    }
    for (const key of run.charms) {
      const charm = CHARMS[key];
      if (charm?.afterBattle) charm.afterBattle({ run, game: this });
    }
    this.pending = {
      reward: {
        node,
        gold,
        mode,
        takes: this.rewardTakes(mode),
        picked: 0,
        done: false,
        cards: this.buildRewardCards(mode),
        charm: charmInfo,
        elite: isElite,
        boss: isBoss,
      },
    };
    this.screen = "reward";
    this.emit();
  },

  chooseReward(index) {
    const reward = this.pending?.reward;
    if (!reward || reward.done) return;
    const choice = reward.cards[index];
    if (!choice || choice.taken) return;
    choice.taken = true;
    this.addCard(choice.key);
    reward.picked += 1;
    this.notice = {
      text: `${CARDS[choice.key].name} added to your deck (${reward.picked}/${reward.takes}).`,
      tone: "good",
    };
    if (reward.picked >= reward.takes || reward.cards.every((card) => card.taken)) {
      this.finishReward();
      return;
    }
    this.emit();
  },

  finishReward() {
    const reward = this.pending?.reward;
    if (!reward || reward.done) return;
    reward.done = true;
    this.completeNodeAndAdvance(reward.node);
  },

  skipReward() {
    const reward = this.pending?.reward;
    if (!reward || reward.done) return;
    reward.done = true;
    this.notice = {
      text: reward.picked ? "You leave the rest where they lie." : "You leave the cards where they lie.",
      tone: "",
    };
    this.completeNodeAndAdvance(reward.node);
  },

  continueReward() {
    this.finishReward();
  },

  completeNodeAndAdvance(node) {
    if (!node) return;
    node.done = true;
    const run = this.run;
    run.currentRow = node.row;
    run.currentNode = node.id;
    run.roomsCleared += 1;

    if (node.type === "boss") {
      this.combat = null;
      if (run.act < 3) {
        run.act += 1;
        const healed = Math.min(run.maxHp - run.hp, Math.ceil(run.maxHp * 0.25));
        run.hp += healed;
        run.map = this.generateMap(run.act);
        const start = run.map.nodes.find((n) => n.type === "start");
        run.currentNode = start.id;
        run.currentRow = 0;
        run.available = this.availableFrom(start, run.map).map((n) => n.id);
        this.pending = { actIntro: { act: run.act, healed } };
        this.screen = "act_intro";
        this.emit();
      } else {
        this.endRun("clear");
      }
      return;
    }

    run.available = this.availableFrom(node, run.map).map((n) => n.id);
    this.pending = null;
    this.combat = null;
    this.screen = "map";
    this.emit();
  },

  continueActIntro() {
    this.pending = null;
    this.screen = "map";
    this.emit();
  },

  /* ---------------- small helpers for UI ---------------- */

  currentAct() {
    return ACTS[this.run?.act || 1];
  },

  cardName(key) {
    return CARDS[key]?.name || key;
  },

  rarityOf(key) {
    return RARITY[CARDS[key]?.rarity] || RARITY.common;
  },
};
