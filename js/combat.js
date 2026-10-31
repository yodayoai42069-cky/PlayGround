/* Combat: stamina, cards, intents, summons, statuses, and the turn loop. */

import { CHARACTERS } from "./data/characters.js";
import { CARDS, getEffects } from "./data/cards.js";
import {
  ENEMIES, NORMAL_ENCOUNTERS, ELITE_ENCOUNTERS, BOSS_ENCOUNTERS,
  CHARMS, ACTS, STATUS_INFO,
} from "./data/enemies.js";
import { pick, shuffle, clamp, rand } from "./util.js";

const TACO_BASE_HP = 12;
const TACO_BASE_ATTACK = 3;

function emptyStatuses() {
  return { bleed: 0, book: 0, weak: 0, vulnerable: 0 };
}

export const combatMethods = {
  startBattle(node) {
    let keys = [];
    if (node.type === "boss") keys = BOSS_ENCOUNTERS[this.run.act];
    else if (node.type === "elite") keys = pick(ELITE_ENCOUNTERS[this.run.act]);
    else keys = pick(NORMAL_ENCOUNTERS[this.run.act]);
    this.beginCombat(node, keys);
  },

  beginCombat(node, keys) {
    const run = this.run;
    const def = CHARACTERS[run.char];
    const player = {
      hp: run.hp,
      maxHp: run.maxHp,
      block: 0,
      overshield: run.char === "elizabeth" ? 5 : 0,
      strength: run.strength,
      crit: clamp(run.crit, 0, 0.9),
      critDamage: run.critDamage,
      weak: 0,
      vulnerable: 0,
      bleed: 0,
    };
    const combat = {
      node,
      type: node.type,
      player,
      enemies: [],
      drawPile: shuffle(run.deck.map((card) => ({ ...card }))),
      hand: [],
      discardPile: [],
      exhaustPile: [],
      stamina: 0,
      maxStamina: run.staminaMax,
      drawCount: run.drawCount,
      turn: 1,
      phase: "player",
      ended: false,
      pendingCard: null,
      log: [],
      firstTurnDraw: 0,
      firstTurnStamina: 0,
      critBonus: 0,
      thorns: 0,
      taco: null,
      startedAt: Date.now(),
    };
    if (run.char === "brittany") {
      const maxHp = TACO_BASE_HP + run.tacoMax;
      combat.taco = {
        name: "Taco",
        alive: true,
        hp: maxHp,
        maxHp,
        block: 0,
        attack: TACO_BASE_ATTACK + run.tacoAttack,
      };
    }
    this.combat = combat;
    combat.enemies = keys.map((key) => this.createEnemy(key));
    for (const charmKey of run.charms) {
      const charm = CHARMS[charmKey];
      if (charm?.combatStart) charm.combatStart({ combat, run, game: this });
    }
    this.log(`${ACTS[run.act].name} · ${node.type === "boss" ? "The boss is waiting." : "The board shifts."}`, "system");
    this.log(combat.enemies.map((e) => e.name).join("  ·  "), "muted");
    if (combat.taco) {
      this.log(`Taco is here. ${combat.taco.hp} HP. He will take the hits.`, "good");
    }
    if (run.char === "elizabeth") {
      this.log("Gilded Guard: Overshield persists between turns.", "good");
    }
    combat.stamina = combat.maxStamina + combat.firstTurnStamina;
    this.drawCards(combat.drawCount + combat.firstTurnDraw);
    this.log(`Turn 1 — spend ${combat.stamina} Stamina.`, "turn");
    this.screen = "combat";
    this.emit();
  },

  createEnemy(key) {
    const def = ENEMIES[key];
    return {
      key,
      uid: `e${this.uid++}`,
      name: def.name,
      hp: def.hp,
      maxHp: def.hp,
      block: def.block || 0,
      strength: 0,
      statuses: emptyStatuses(),
      taunt: false,
      enraged: false,
      alive: true,
      moveIndex: 0,
      pattern: [...def.pattern],
      moves: def.moves,
      tags: def.tags,
      crest: def.crest,
      color: def.color,
      flavor: def.flavor,
      boss: !!def.boss,
      minion: !!def.minion,
    };
  },

  log(text, tone = "") {
    if (!this.combat) return;
    this.combat.log.push({ text, tone, turn: this.combat.turn });
    if (this.combat.log.length > 90) this.combat.log.shift();
  },

  aliveEnemies() {
    return this.combat?.enemies.filter((e) => e.alive) || [];
  },

  tauntingEnemies() {
    return this.aliveEnemies().filter((e) => e.taunt);
  },

  drawCards(amount) {
    const combat = this.combat;
    if (!combat) return;
    for (let i = 0; i < amount; i += 1) {
      if (!combat.drawPile.length) {
        if (!combat.discardPile.length) break;
        combat.drawPile = shuffle(combat.discardPile);
        combat.discardPile = [];
      }
      const card = combat.drawPile.pop();
      if (card) combat.hand.push(card);
    }
  },

  selectCard(uid) {
    const combat = this.combat;
    if (!combat || combat.ended || combat.phase !== "player") return;
    if (combat.pendingCard === uid) {
      combat.pendingCard = null;
      this.emit();
      return;
    }
    const card = combat.hand.find((c) => c.uid === uid);
    if (!card) return;
    const def = CARDS[card.key];
    const cost = def.cost;
    if (combat.stamina < cost) {
      this.log("Not enough Stamina.", "bad");
      this.emit();
      return;
    }
    if (def.target === "enemy") {
      const taunts = this.tauntingEnemies();
      if (taunts.length) {
        this.playCard(uid, taunts[0].uid);
        return;
      }
      const alive = this.aliveEnemies();
      if (alive.length === 1) {
        this.playCard(uid, alive[0].uid);
        return;
      }
      combat.pendingCard = uid;
      this.emit();
      return;
    }
    this.playCard(uid);
  },

  cancelPending() {
    if (!this.combat) return;
    this.combat.pendingCard = null;
    this.emit();
  },

  playSelected(enemyUid) {
    const combat = this.combat;
    if (!combat?.pendingCard) return;
    const enemy = combat.enemies.find((e) => e.uid === enemyUid && e.alive);
    if (!enemy) return;
    const taunts = this.tauntingEnemies();
    if (taunts.length && !enemy.taunt) {
      this.log("The taunt holds your attention. Strike the one who demands it.", "bad");
      this.emit();
      return;
    }
    this.playCard(combat.pendingCard, enemyUid);
  },

  playCard(uid, targetUid) {
    const combat = this.combat;
    if (!combat || combat.ended || combat.phase !== "player") return;
    const index = combat.hand.findIndex((c) => c.uid === uid);
    if (index < 0) return;
    const card = combat.hand[index];
    const def = CARDS[card.key];
    if (combat.stamina < def.cost) {
      this.log("Not enough Stamina.", "bad");
      this.emit();
      return;
    }
    let target = null;
    if (def.target === "enemy") {
      const alive = this.aliveEnemies();
      if (!alive.length) return;
      target = combat.enemies.find((e) => e.uid === targetUid && e.alive) || alive[0];
    }

    combat.stamina -= def.cost;
    combat.hand.splice(index, 1);
    combat.pendingCard = null;
    this.log(`▸ ${def.name}${card.upgraded ? " +" : ""}`, "card");

    const effects = getEffects(card);
    for (const effect of effects) {
      this.resolveCardEffect(card, def, effect, target);
      if (!this.aliveEnemies().length) break;
      if (combat.player.hp <= 0) break;
    }

    if (def.exhaust) combat.exhaustPile.push(card);
    else combat.discardPile.push(card);

    if (!this.aliveEnemies().length) {
      this.finishVictory();
      return;
    }
    if (combat.player.hp <= 0) {
      this.playerDefeated();
      return;
    }
    this.emit();
  },

  resolveCardEffect(card, def, effect, target) {
    const combat = this.combat;
    const player = combat.player;
    const allTargets = def.target === "all";

    switch (effect.kind) {
      case "damage": {
        const targets = allTargets ? this.aliveEnemies() : target ? [target] : [];
        for (const enemy of targets) {
          if (!enemy.alive) continue;
          this.strikeEnemy(enemy, effect.amount, effect.hits || 1, { crit: true });
        }
        break;
      }
      case "damageIfBleed": {
        if (target?.alive && target.statuses.bleed > 0) {
          this.strikeEnemy(target, effect.amount, 1, { crit: true });
          this.log(`Bleeding target: +${effect.amount} bonus damage.`, "muted");
        }
        break;
      }
      case "block":
        player.block += effect.amount;
        this.log(`Gain ${effect.amount} Block.`, "good");
        break;
      case "overshield":
        player.overshield += effect.amount;
        this.log(`Gain ${effect.amount} Overshield.`, "good");
        break;
      case "status": {
        if (effect.target === "self") {
          if (effect.status === "crit") {
            combat.critBonus += effect.amount / 100;
            this.log(`+${effect.amount}% Crit this turn.`, "good");
          }
          break;
        }
        const targets = effect.target === "allEnemies" || allTargets ? this.aliveEnemies() : target ? [target] : [];
        for (const enemy of targets) {
          this.applyEnemyStatus(enemy, effect.status, effect.amount);
        }
        break;
      }
      case "multiplyStatus": {
        if (!target?.alive) break;
        if (effect.status === "book") {
          const stacks = target.statuses.book;
          if (stacks > 0) this.addBook(target, stacks);
        } else if (effect.status === "bleed") {
          target.statuses.bleed *= 2;
          this.log(`Bleed on ${target.name} doubles to ${target.statuses.bleed}.`, "good");
        }
        break;
      }
      case "draw":
        this.drawCards(effect.amount);
        this.log(`Draw ${effect.amount}.`, "muted");
        break;
      case "energy":
        combat.stamina += effect.amount;
        this.log(`Gain ${effect.amount} Stamina.`, "good");
        break;
      case "heal":
        player.hp = Math.min(player.maxHp, player.hp + effect.amount);
        this.log(`Heal ${effect.amount} HP.`, "good");
        break;
      case "loseHp":
        player.hp = Math.max(0, player.hp - effect.amount);
        this.log(`Lose ${effect.amount} HP.`, "bad");
        break;
      case "strength":
        player.strength += effect.amount;
        this.log(`Gain ${effect.amount} Strength.`, "good");
        break;
      case "summonMaxHp": {
        const taco = combat.taco;
        if (!taco) break;
        taco.maxHp += effect.amount;
        if (taco.alive) taco.hp += effect.amount;
        this.log(`Taco grows tougher. ${taco.hp}/${taco.maxHp} HP.`, "good");
        break;
      }
      case "summonHeal": {
        const taco = combat.taco;
        if (!taco || !taco.alive) {
          this.log("Taco is not here to heal.", "muted");
          break;
        }
        const before = taco.hp;
        taco.hp = Math.min(taco.maxHp, taco.hp + effect.amount);
        this.log(`Taco heals ${taco.hp - before} HP. ${taco.hp}/${taco.maxHp}.`, "good");
        break;
      }
      case "tacoBlock": {
        const taco = combat.taco;
        if (!taco || !taco.alive) break;
        taco.block += effect.amount;
        this.log(`Taco gains ${effect.amount} Block.`, "good");
        break;
      }
      case "tacoAttack": {
        const taco = combat.taco;
        if (!taco || !taco.alive) {
          this.log("Taco is not here. The card does nothing.", "muted");
          break;
        }
        if (target?.alive) this.tacoBite(target, effect.amount + taco.attack);
        break;
      }
      case "reviveTaco": {
        const taco = combat.taco;
        if (!taco) break;
        if (!taco.alive) {
          taco.alive = true;
          taco.hp = Math.min(taco.maxHp, effect.amount);
          taco.block = 0;
          taco.deathLogged = false;
          this.log(`Taco returns! ${taco.hp}/${taco.maxHp} HP.`, "good");
        } else {
          const before = taco.hp;
          taco.hp = Math.min(taco.maxHp, taco.hp + effect.heal);
          this.log(`Taco heals ${taco.hp - before} HP.`, "good");
        }
        break;
      }
      default:
        break;
    }
  },

  strikeEnemy(enemy, amount, hits = 1, { crit = false, ignoreBlock = false, useStrength = true, label = null } = {}) {
    if (!enemy?.alive) return 0;
    const combat = this.combat;
    const player = combat.player;
    let total = 0;
    let critCount = 0;
    for (let i = 0; i < hits; i += 1) {
      if (!enemy.alive) break;
      let damage = amount + (useStrength ? player.strength : 0);
      let didCrit = false;
      if (crit) {
        const critChance = clamp(player.crit + combat.critBonus, 0, 0.95);
        if (Math.random() < critChance) {
          damage *= player.critDamage;
          didCrit = true;
          critCount += 1;
          if (this.run.char === "roxy") {
            combat.critBonus += 0.08;
            this.log("Hot Streak: +8% Crit this turn.", "good");
          }
        }
      }
      if (enemy.statuses.vulnerable > 0) damage *= 1.5;
      if (player.weak > 0) damage *= 0.75;
      damage = Math.max(1, Math.round(damage));
      if (ignoreBlock) {
        enemy.hp -= damage;
        total += damage;
      } else {
        const absorbed = Math.min(enemy.block, damage);
        enemy.block -= absorbed;
        const through = damage - absorbed;
        enemy.hp -= through;
        total += through;
      }
      if (enemy.hp <= 0) {
        enemy.hp = 0;
        enemy.alive = false;
      }
    }
    const critText = critCount ? ` · ${critCount} CRIT` : "";
    this.log(`${label || CHARACTERS[this.run.char].name} hits ${enemy.name} for ${total}${hits > 1 ? ` (${hits} hits${critText})` : critText}.`, critCount ? "good" : "damage");
    this.afterEnemyDamaged(enemy);
    return total;
  },

  tacoBite(enemy, amount) {
    if (!enemy?.alive) return;
    const combat = this.combat;
    const taco = combat.taco;
    if (!taco?.alive) return;
    const damage = Math.max(1, amount);
    const absorbed = Math.min(enemy.block, damage);
    enemy.block -= absorbed;
    const through = damage - absorbed;
    enemy.hp -= through;
    if (enemy.hp <= 0) {
      enemy.hp = 0;
      enemy.alive = false;
    }
    this.log(`Taco bites ${enemy.name} for ${through}.`, "good");
    this.afterEnemyDamaged(enemy);
  },

  afterEnemyDamaged(enemy) {
    if (!enemy) return;
    if (enemy.hp <= 0 && enemy.alive) {
      enemy.hp = 0;
      enemy.alive = false;
    }
    if (!enemy.alive) {
      if (!enemy.defeatLogged) {
        enemy.defeatLogged = true;
        this.log(`${enemy.name} is defeated.`, "good");
      }
      return;
    }
    if (enemy.boss && !enemy.enraged && enemy.hp <= enemy.maxHp * 0.5) {
      enemy.enraged = true;
      enemy.strength += 3;
      enemy.block += 10;
      this.log(`${enemy.name} stops pretending. Second phase.`, "boss");
    }
  },

  addBook(enemy, amount, silent = false) {
    if (!enemy?.alive || amount <= 0) return;
    enemy.statuses.book += amount;
    if (!silent) this.log(`${enemy.name} gains ${amount} Book (${enemy.statuses.book}/10).`, "book");
    let guard = 0;
    while (enemy.statuses.book >= 10 && enemy.alive && guard < 20) {
      guard += 1;
      enemy.statuses.book -= 10;
      const damage = Math.ceil(enemy.maxHp * 0.15);
      enemy.hp -= damage;
      this.log(`OVERDUE! ${enemy.name} takes ${damage} damage — 15% max HP.`, "book");
      this.afterEnemyDamaged(enemy);
    }
  },

  applyEnemyStatus(enemy, status, amount) {
    if (!enemy?.alive) return;
    if (status === "book") {
      this.addBook(enemy, amount);
      return;
    }
    if (status in enemy.statuses) {
      enemy.statuses[status] += amount;
      this.log(`${enemy.name} gains ${amount} ${STATUS_INFO[status]?.name || status}.`, status === "bleed" ? "bleed" : "muted");
    }
  },

  applyPlayerStatus(status, amount) {
    const player = this.combat.player;
    if (status in player) {
      player[status] += amount;
      this.log(`You gain ${amount} ${STATUS_INFO[status]?.name || status}.`, "bad");
    }
  },

  finishVictory() {
    const combat = this.combat;
    if (!combat || combat.ended) return;
    combat.ended = true;
    combat.phase = "victory";
    this.log("The board clears.", "system");
    this.handleVictory(combat.node);
  },

  playerDefeated() {
    const combat = this.combat;
    if (!combat || combat.ended) return;
    combat.ended = true;
    combat.phase = "defeat";
    combat.player.hp = 0;
    this.run.hp = 0;
    this.log("The checkmate is yours to wear.", "bad");
    this.endRun("dead");
  },

  endTurn() {
    const combat = this.combat;
    if (!combat || combat.ended || combat.phase !== "player") return;
    this.combat.hand.forEach((card) => this.combat.discardPile.push(card));
    this.combat.hand = [];
    this.combat.pendingCard = null;
    this.combat.critBonus = 0;
    combat.player.weak = Math.max(0, combat.player.weak - 1);
    combat.player.vulnerable = Math.max(0, combat.player.vulnerable - 1);
    this.log("You end your turn.", "turn");
    combat.phase = "enemy";
    this.runEnemyTurn();
  },

  runEnemyTurn() {
    const combat = this.combat;
    const actors = [...combat.enemies];
    for (const enemy of combat.enemies) enemy.taunt = false;
    for (const enemy of actors) {
      if (combat.ended) return;
      if (!enemy.alive) continue;
      enemy.block = 0;
      if (enemy.statuses.bleed > 0) {
        const bleed = enemy.statuses.bleed;
        enemy.hp -= bleed;
        this.log(`${enemy.name} bleeds for ${bleed}.`, "bleed");
        enemy.statuses.bleed = Math.max(0, enemy.statuses.bleed - 1);
        this.afterEnemyDamaged(enemy);
        if (!enemy.alive) continue;
      }
      const move = enemy.moves[enemy.pattern[enemy.moveIndex % enemy.pattern.length]];
      this.log(`${enemy.name}: ${move.name}.`, "enemy");
      this.executeEnemyMove(enemy, move);
      enemy.moveIndex += 1;
      enemy.statuses.weak = Math.max(0, enemy.statuses.weak - 1);
      enemy.statuses.vulnerable = Math.max(0, enemy.statuses.vulnerable - 1);
      if (combat.player.hp <= 0) {
        this.playerDefeated();
        return;
      }
      if (!this.aliveEnemies().length) {
        this.finishVictory();
        return;
      }
    }
    if (!this.aliveEnemies().length) {
      this.finishVictory();
      return;
    }
    if (combat.player.hp <= 0) {
      this.playerDefeated();
      return;
    }
    this.startPlayerTurn();
  },

  executeEnemyMove(enemy, move) {
    const combat = this.combat;
    if (move.block) {
      enemy.block += move.block;
      this.log(`${enemy.name} gains ${move.block} Block.`, "muted");
    }
    if (move.taunt) {
      enemy.taunt = true;
      this.log(`${enemy.name} taunts. Strike them or waste the turn.`, "bad");
    }
    if (move.strength) {
      enemy.strength += move.strength;
      this.log(`${enemy.name} gains ${move.strength} Strength.`, "bad");
    }
    if (move.strengthAll) {
      for (const ally of this.aliveEnemies()) ally.strength += move.strengthAll;
      this.log(`All enemies gain ${move.strengthAll} Strength.`, "bad");
    }
    if (move.heal) {
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + move.heal);
      this.log(`${enemy.name} heals ${move.heal}.`, "bad");
    }
    if (move.healAll) {
      for (const ally of this.aliveEnemies()) ally.hp = Math.min(ally.maxHp, ally.hp + move.healAll);
      this.log(`All enemies heal ${move.healAll}.`, "bad");
    }
    if (move.summon) {
      if (combat.enemies.length >= 5) {
        enemy.block += 8;
        this.log("The room is too full. The summon becomes 8 Block.", "muted");
      } else {
        const summoned = this.createEnemy(move.summon);
        summoned.summoned = true;
        combat.enemies.push(summoned);
        this.log(`${enemy.name} summons ${summoned.name}.`, "bad");
      }
    }
    if (move.status) this.applyPlayerStatus(move.status.type, move.status.amount);
    if (move.status2) this.applyPlayerStatus(move.status2.type, move.status2.amount);

    if (move.dmg) {
      const hits = move.hits || 1;
      let totalToPlayer = 0;
      let totalToTaco = 0;
      let blocked = 0;
      for (let i = 0; i < hits; i += 1) {
        let raw = move.dmg + enemy.strength;
        if (enemy.statuses.weak > 0) raw *= 0.75;
        raw = Math.round(raw);
        if (move.aoe) {
          if (combat.taco?.alive) {
            const result = this.damageTaco(raw);
            totalToTaco += result.through;
            blocked += result.blocked;
          }
          if (combat.player.hp > 0) {
            const result = this.damagePlayer(raw);
            totalToPlayer += result.through;
            blocked += result.blocked;
          }
        } else if (combat.taco?.alive) {
          const result = this.damageTaco(raw);
          totalToTaco += result.through;
          blocked += result.blocked;
        } else {
          const result = this.damagePlayer(raw);
          totalToPlayer += result.through;
          blocked += result.blocked;
        }
        if (combat.player.hp <= 0) break;
      }
      const pieces = [];
      if (totalToTaco) pieces.push(`${totalToTaco} to Taco`);
      if (totalToPlayer) pieces.push(`${totalToPlayer} to you`);
      if (blocked) pieces.push(`${blocked} blocked`);
      if (!pieces.length) pieces.push("no damage through");
      this.log(`${move.name}: ${pieces.join(", ")}.`, totalToPlayer || totalToTaco ? "damage-in" : "muted");
      if (!combat.taco?.alive && combat.taco && !combat.taco.deathLogged) {
        combat.taco.deathLogged = true;
        this.log("Taco is down. You are on your own.", "bad");
      }
    }
    if (move.dmg && combat.thorns > 0 && (!combat.taco || !combat.taco.alive || move.aoe)) {
      enemy.hp -= combat.thorns;
      this.log(`Thorn Pin pricks ${enemy.name} for ${combat.thorns}.`, "good");
      this.afterEnemyDamaged(enemy);
    }
  },

  damagePlayer(raw) {
    const player = this.combat.player;
    let damage = raw;
    if (player.vulnerable > 0) damage = Math.round(damage * 1.5);
    const blocked = Math.min(player.block, damage);
    player.block -= blocked;
    let remaining = damage - blocked;
    const shielded = Math.min(player.overshield, remaining);
    player.overshield -= shielded;
    remaining -= shielded;
    player.hp = Math.max(0, player.hp - remaining);
    return { blocked, through: remaining };
  },

  damageTaco(raw) {
    const taco = this.combat.taco;
    let damage = raw;
    const blocked = Math.min(taco.block, damage);
    taco.block -= blocked;
    let remaining = damage - blocked;
    taco.hp = Math.max(0, taco.hp - remaining);
    if (taco.hp <= 0) {
      taco.alive = false;
      taco.hp = 0;
    }
    return { blocked, through: remaining };
  },

  startPlayerTurn() {
    const combat = this.combat;
    if (combat.ended) return;
    combat.turn += 1;
    combat.phase = "player";
    combat.player.block = 0;
    combat.critBonus = 0;
    if (combat.taco) combat.taco.block = 0;

    if (combat.player.bleed > 0) {
      const bleed = combat.player.bleed;
      combat.player.hp = Math.max(0, combat.player.hp - bleed);
      combat.player.bleed = Math.max(0, combat.player.bleed - 1);
      this.log(`You bleed for ${bleed}.`, "bleed");
      if (combat.player.hp <= 0) {
        this.playerDefeated();
        return;
      }
    }

    if (combat.taco?.alive) {
      const targets = this.aliveEnemies();
      if (targets.length) {
        const victim = pick(targets);
        this.tacoBite(victim, combat.taco.attack);
        if (!this.aliveEnemies().length) {
          this.finishVictory();
          return;
        }
      }
    }

    combat.stamina = combat.maxStamina;
    this.drawCards(combat.drawCount);
    this.log(`Turn ${combat.turn} — ${combat.stamina} Stamina. Ten seconds. Go.`, "turn");
    this.emit();
  },

  statusLine() {
    if (!this.combat) return "";
    const parts = [];
    const p = this.combat.player;
    if (p.strength) parts.push(`${p.strength} STR`);
    if (this.combat.critBonus) parts.push(`+${Math.round(this.combat.critBonus * 100)}% CRIT`);
    if (p.weak) parts.push(`${p.weak} WEAK`);
    if (p.vulnerable) parts.push(`${p.vulnerable} VULN`);
    if (p.bleed) parts.push(`${p.bleed} BLEED`);
    return parts.join(" · ");
  },

  enemyIntent(enemy) {
    if (!enemy?.alive) return null;
    return enemy.moves[enemy.pattern[enemy.moveIndex % enemy.pattern.length]];
  },

  canPlayCard(card) {
    if (!this.combat || this.combat.phase !== "player") return false;
    return this.combat.stamina >= CARDS[card.key].cost;
  },
};
