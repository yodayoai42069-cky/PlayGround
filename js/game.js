/* The main game shell: meta progression, runs, maps, and shared helpers. */

import {
  CHARACTERS, CHARACTER_IDS, META_UPGRADES, SAVE_KEY, mergeMeta,
  metaUpgradeCost, PRESTIGE_STYLES,
} from "./data/characters.js";
import { CARDS, cardPool } from "./data/cards.js";
import { CHARMS } from "./data/enemies.js";
import { EVENTS, SPECIALS } from "./data/events.js";
import { rand, pick, shuffle, weightedPick, clamp } from "./util.js";
import { worldMethods } from "./world.js";
import { combatMethods } from "./combat.js";

export class Game {
  constructor(meta) {
    this.meta = mergeMeta(meta);
    this.screen = "title";
    this.run = null;
    this.combat = null;
    this.pending = null;
    this.briefing = null;
    this.notice = null;
    this.onChange = () => {};
    this.uid = 1;
  }

  emit() {
    this.onChange();
  }

  saveMeta() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.meta));
    } catch {
      /* local storage is a luxury, not a requirement */
    }
  }

  setScreen(screen) {
    this.screen = screen;
    this.notice = null;
    this.emit();
  }

  goTitle() {
    this.pending = null;
    this.combat = null;
    this.run = null;
    this.setScreen("title");
  }

  openSelect() {
    this.setScreen("select");
  }

  openBriefing(charId) {
    const unlocked = this.meta.unlocks[charId] || 0;
    this.briefing = { charId, outfit: Math.min(this.meta.outfit[charId] || 0, unlocked) };
    this.setScreen("briefing");
  }

  selectBriefingOutfit(tier) {
    if (!this.briefing) return;
    if (tier > (this.meta.unlocks[this.briefing.charId] || 0)) return;
    this.briefing.outfit = tier;
    this.emit();
  }

  openArchive() {
    this.setScreen("archive");
  }

  openWardrobe() {
    this.setScreen("wardrobe");
  }

  openTips() {
    this.setScreen("tips");
  }

  equipOutfit(charId, tier) {
    if (tier > (this.meta.unlocks[charId] || 0)) return;
    this.meta.outfit[charId] = tier;
    this.saveMeta();
    this.notice = { text: `Outfit equipped: ${CHARACTERS[charId].outfits[tier].name}.`, tone: "good" };
    this.emit();
  }

  upgradeCost(upgradeId) {
    const up = META_UPGRADES.find((u) => u.id === upgradeId);
    if (!up) return 0;
    return metaUpgradeCost(up, this.meta.upgrades[upgradeId] || 0);
  }

  buyUpgrade(upgradeId) {
    const up = META_UPGRADES.find((u) => u.id === upgradeId);
    const level = this.meta.upgrades[upgradeId] || 0;
    if (!up || level >= up.max) return;
    const cost = metaUpgradeCost(up, level);
    if (this.meta.ash < cost) {
      this.notice = { text: "Not enough Ash.", tone: "bad" };
      this.emit();
      return;
    }
    this.meta.ash -= cost;
    this.meta.upgrades[upgradeId] = level + 1;
    this.saveMeta();
    this.notice = { text: `${up.name} restored to rank ${level + 1}.`, tone: "good" };
    this.emit();
  }

  canPrestige() {
    return this.meta.prestige < 3 && this.meta.sincePrestige > 0;
  }

  prestige() {
    if (!this.canPrestige()) return;
    const next = this.meta.prestige + 1;
    for (const id of CHARACTER_IDS) {
      this.meta.unlocks[id] = Math.max(this.meta.unlocks[id] || 0, next);
      this.meta.outfit[id] = next;
    }
    this.meta.prestige = next;
    this.meta.ash = 0;
    this.meta.upgrades = { vitality: 0, edge: 0, fortune: 0, instinct: 0, endurance: 0, insight: 0 };
    this.meta.sincePrestige = 0;
    this.run = null;
    this.combat = null;
    this.pending = { prestige: next };
    this.saveMeta();
    this.screen = "prestige";
    this.emit();
  }

  beginRun() {
    if (!this.briefing) return;
    const charId = this.briefing.charId;
    const def = CHARACTERS[charId];
    const tier = Math.min(this.briefing.outfit, this.meta.unlocks[charId] || 0);
    this.meta.outfit[charId] = tier;
    this.saveMeta();

    const hp = def.hp + (this.meta.upgrades.vitality || 0) * 5;
    const map = this.generateMap(1);
    const startNode = map.nodes.find((n) => n.type === "start");
    this.run = {
      char: charId,
      outfit: tier,
      act: 1,
      hp,
      maxHp: hp,
      gold: 20 + (this.meta.upgrades.fortune || 0) * 15,
      strength: this.meta.upgrades.edge || 0,
      crit: def.crit + (this.meta.upgrades.instinct || 0) * 0.04,
      critDamage: def.critDamage,
      staminaMax: def.stamina + (this.meta.upgrades.endurance || 0),
      drawCount: def.draw + (this.meta.upgrades.insight || 0),
      tacoMax: 0,
      tacoAttack: 0,
      deck: def.starter.map((key) => this.makeCard(key)),
      charms: [],
      boons: [],
      seenEvents: [],
      roomsCleared: 0,
      battlesWon: 0,
      map,
      currentNode: startNode.id,
      currentRow: 0,
      available: this.availableFrom(startNode, map).map((n) => n.id),
    };
    this.combat = null;
    this.pending = null;
    this.screen = "map";
    this.emit();
  }

  /* ---------------- cards ---------------- */

  makeCard(key, upgraded = false) {
    return { key, uid: `c${this.uid++}`, upgraded };
  }

  addCard(key, upgraded = false) {
    if (!this.run) return null;
    const card = this.makeCard(key, upgraded);
    this.run.deck.push(card);
    return card;
  }

  removeCard(uid) {
    if (!this.run) return false;
    const index = this.run.deck.findIndex((c) => c.uid === uid);
    if (index < 0) return false;
    this.run.deck.splice(index, 1);
    return true;
  }

  upgradeCard(uid) {
    const card = this.run?.deck.find((c) => c.uid === uid);
    if (!card || card.upgraded) return false;
    card.upgraded = true;
    return true;
  }

  randomCardKey(rarity = "common") {
    if (!this.run) return null;
    let pool = cardPool(this.run.char, [rarity]);
    if (!pool.length) pool = cardPool(this.run.char);
    return pick(pool);
  }

  awardCharm(key) {
    if (!this.run || !key) return null;
    if (this.run.charms.includes(key)) return null;
    this.run.charms.push(key);
    const charm = CHARMS[key];
    if (charm?.onAcquire) charm.onAcquire({ run: this.run, game: this });
    return charm;
  }

  randomAvailableCharm() {
    const pool = Object.keys(CHARMS).filter((key) => !this.run.charms.includes(key));
    return pool.length ? pick(pool) : null;
  }

  applySpec(spec = {}) {
    const run = this.run;
    const lines = [];
    if (!run) return lines;

    if (spec.gold) {
      run.gold = Math.max(0, run.gold + spec.gold);
      lines.push(`${spec.gold > 0 ? "Gain" : "Lose"} ${Math.abs(spec.gold)} gold.`);
    }
    if (spec.hp) {
      run.hp = Math.max(1, Math.min(run.maxHp, run.hp + spec.hp));
      lines.push(`${spec.hp > 0 ? "Heal" : "Lose"} ${Math.abs(spec.hp)} HP.`);
    }
    if (spec.heal) {
      run.hp = Math.min(run.maxHp, run.hp + spec.heal);
      lines.push(`Heal ${spec.heal} HP.`);
    }
    if (spec.healPct) {
      const amount = Math.ceil(run.maxHp * spec.healPct);
      run.hp = Math.min(run.maxHp, run.hp + amount);
      lines.push(`Heal ${amount} HP.`);
    }
    if (spec.maxHp) {
      run.maxHp = Math.max(10, run.maxHp + spec.maxHp);
      run.hp = Math.min(run.hp, run.maxHp);
      lines.push(`${spec.maxHp > 0 ? "Gain" : "Lose"} ${Math.abs(spec.maxHp)} max HP.`);
    }
    if (spec.strength) {
      run.strength = Math.max(0, run.strength + spec.strength);
      lines.push(`${spec.strength > 0 ? "Gain" : "Lose"} ${Math.abs(spec.strength)} Strength.`);
    }
    if (spec.crit) {
      run.crit = clamp(run.crit + spec.crit, 0, 0.75);
      lines.push(`Gain ${Math.round(spec.crit * 100)}% Crit.`);
    }
    if (spec.drawBonus) {
      run.drawCount += spec.drawBonus;
      lines.push(`Draw +${spec.drawBonus} card each turn.`);
    }
    if (spec.staminaBonus) {
      run.staminaMax += spec.staminaBonus;
      lines.push(`Gain +${spec.staminaBonus} max Stamina.`);
    }
    if (spec.tacoMax) {
      run.tacoMax += spec.tacoMax;
      lines.push(`Taco gains +${spec.tacoMax} max HP.`);
    }
    if (spec.tacoAttack) {
      run.tacoAttack += spec.tacoAttack;
      lines.push(`Taco gains +${spec.tacoAttack} bite damage.`);
    }
    if (spec.randomCard) {
      const key = this.randomCardKey(spec.randomCard);
      if (key) {
        this.addCard(key);
        lines.push(`Gained ${CARDS[key].name} (${spec.randomCard}).`);
      }
    }
    if (spec.randomCard2) {
      const key = this.randomCardKey(spec.randomCard2);
      if (key) {
        this.addCard(key);
        lines.push(`Gained ${CARDS[key].name} (${spec.randomCard2}).`);
      }
    }
    if (spec.randomUpgrade) {
      const candidates = run.deck.filter((c) => !c.upgraded);
      shuffle(candidates);
      const chosen = candidates.slice(0, spec.randomUpgrade);
      for (const card of chosen) {
        card.upgraded = true;
        lines.push(`Upgraded ${CARDS[card.key].name}.`);
      }
      if (!chosen.length) lines.push("Nothing left to upgrade.");
    }
    if (spec.randomCharm) {
      const key = this.randomAvailableCharm();
      if (key) {
        this.awardCharm(key);
        lines.push(`Gained charm: ${CHARMS[key].name}.`);
      } else {
        run.gold += 50;
        lines.push("All charms collected. Gained 50 gold instead.");
      }
    }
    if (spec.removeRandomCards) {
      const removable = [...run.deck];
      shuffle(removable);
      const removed = removable.slice(0, Math.min(spec.removeRandomCards, Math.max(0, run.deck.length - 3)));
      for (const card of removed) {
        this.removeCard(card.uid);
        lines.push(`Removed ${CARDS[card.key].name}.`);
      }
    }
    return lines;
  }

  /* ---------------- map ---------------- */

  generateMap(act) {
    const shape = [[2], [1, 3], [0, 2, 4], [1, 3], [0, 2, 4], [1, 3], [0, 2, 4], [2]];
    const nodes = [];
    shape.forEach((cols, row) => {
      cols.forEach((col) => {
        let type = "battle";
        if (row === 0) type = "start";
        else if (row === 7) type = "boss";
        else type = this.rollNodeType(act, row);
        nodes.push({ id: `r${row}c${col}`, row, col, type, done: false });
      });
    });
    for (const required of ["shop", "event", "special"]) {
      if (!nodes.some((n) => n.type === required)) {
        const candidates = nodes.filter((n) => n.row >= 2 && n.row <= 6 && n.type !== "boss");
        if (candidates.length) pick(candidates).type = required;
      }
    }
    const map = { act, nodes };
    nodes.forEach((node) => {
      if (node.row === 7) {
        node.conn = [];
      } else if (node.row === 6) {
        node.conn = nodes.filter((n) => n.row === 7).map((n) => n.id);
      } else {
        node.conn = nodes
          .filter((n) => n.row === node.row + 1 && Math.abs(n.col - node.col) <= 1)
          .map((n) => n.id);
      }
    });
    return map;
  }

  rollNodeType(act, row) {
    if (row === 1) return "battle";
    const entries = [
      { value: "battle", weight: 34 },
      { value: "event", weight: 16 },
      { value: "shop", weight: 11 },
      { value: "special", weight: 10 },
      { value: "elite", weight: act === 3 ? 14 : 10 },
      { value: "rest", weight: 10 },
      { value: "treasure", weight: 7 },
    ];
    return weightedPick(entries);
  }

  getNode(id) {
    return this.run?.map.nodes.find((n) => n.id === id) || null;
  }

  availableFrom(node, map = this.run?.map) {
    if (!node || !map) return [];
    if (node.row >= 7) return [];
    if (node.row === 6) return map.nodes.filter((n) => n.row === 7);
    return map.nodes.filter((n) => n.row === node.row + 1 && Math.abs(n.col - node.col) <= 1);
  }

  enterNode(nodeId) {
    if (!this.run) return;
    if (!this.run.available.includes(nodeId)) return;
    const node = this.getNode(nodeId);
    if (!node || node.done) return;
    if (["battle", "elite", "boss"].includes(node.type)) {
      this.startBattle(node);
      return;
    }
    if (node.type === "shop") {
      this.openShop(node);
      return;
    }
    if (node.type === "event") {
      this.openEvent(node);
      return;
    }
    if (node.type === "special") {
      this.openSpecial(node);
      return;
    }
    if (node.type === "rest") {
      this.openRest(node);
      return;
    }
    if (node.type === "treasure") {
      this.openTreasure(node);
    }
  }

  endRun(kind) {
    if (!this.run || this.run.ended) return;
    this.run.ended = true;
    const run = this.run;
    const wasClear = kind === "clear";
    const ash = wasClear
      ? Math.floor(100 + run.roomsCleared * 2 + run.gold * 0.05 + this.meta.prestige * 15)
      : Math.max(12, Math.floor(10 + run.roomsCleared * 4 + (run.act - 1) * 16 + run.battlesWon * 3 + run.gold * 0.08));

    this.meta.ash += ash;
    this.meta.totalAsh += ash;
    this.meta.runs += 1;
    this.meta.sincePrestige += 1;
    this.meta.bestAct = Math.max(this.meta.bestAct, run.act);
    if (wasClear) {
      this.meta.clears += 1;
      this.meta.bossKills += 1;
    }
    this.saveMeta();
    this.combat = null;
    this.pending = {
      runSummary: {
        kind,
        ash,
        char: run.char,
        act: run.act,
        rooms: run.roomsCleared,
        gold: run.gold,
        deckSize: run.deck.length,
        charms: run.charms.length,
      },
    };
    this.screen = wasClear ? "runclear" : "gameover";
    this.emit();
  }

  returnFromRun() {
    this.run = null;
    this.combat = null;
    this.pending = null;
    this.setScreen("title");
  }

  prestigeLabel() {
    return PRESTIGE_STYLES[this.meta.prestige - 1] || null;
  }
}

Object.assign(Game.prototype, worldMethods, combatMethods);
