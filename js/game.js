/* ============================================================
   game.js — state, economy, relationships, marriage, offspring, perks
   ============================================================ */
(function (global) {
  'use strict';
  const D = global.GameData;
  const T = global.Traits;
  const SAVE_KEY = 'aughts-townsisters-save-v1';
  const ri = T.ri, pick = T.rnd;

  let S = null;                 // live game state
  let listeners = [];

  // ---------------- state ----------------
  function newState() {
    const girls = {};
    D.GIRLS.forEach((g) => {
      girls[g.id] = { met: false, affection: 0, married: false, talks: 0, dates: 0, giftsGiven: 0 };
    });
    return {
      started: false,
      day: 1,
      ap: 4,
      money: 10000,
      location: 'Home',
      player: { name: 'You', gender: 'male', look: T.defaultLook('male') },
      perks: {},
      girls,
      children: [],
      inventory: { rings: 0 },
      log: [],
      weddings: 0,
      goalShown: false,
      lifetimeIncome: 10000,
      editLook: null,
    };
  }

  function get() { return S; }
  function init() {
    S = load() || newState();
    return S;
  }
  function onChange(fn) { listeners.push(fn); }
  function emit() { listeners.forEach((f) => f(S)); save(); }

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* private mode */ }
  }
  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.player) return null;
      data.editLook = null;
      return data;
    } catch (e) { return null; }
  }
  function reset() { S = newState(); save(); }

  // ---------------- helpers ----------------
  const perkLvl = (id) => S.perks[id] || 0;
  const giftMult = () => 1 - 0.09 * perkLvl('savvyShopper');
  const priceOf = (n) => Math.round(n * giftMult());
  const maxAp = () => 4 + (perkLvl('bigFamily') >= 3 ? 1 : 0);
  const wifeIds = () => D.GIRLS.filter((g) => S.girls[g.id].married).map((g) => g.id);
  const girlsHere = () => D.GIRLS.filter((g) => g.spots[((S.day - 1) % g.spots.length)] === S.location);

  function canSpend(n) {
    if (S.money < n) return false;
    return true;
  }
  function spend(n) { S.money = Math.max(0, S.money - n); }
  function earn(n) { S.money += Math.round(n); S.lifetimeIncome += Math.round(n); }
  function useAp(n) { S.ap = Math.max(0, S.ap - (n || 1)); }
  function say(msg) { S.log.unshift({ day: S.day, msg }); S.log = S.log.slice(0, 60); }

  function affectionTier(a) {
    if (a >= 100) return { t: 'Fiancée ♥', c: '#ff5f8f' };
    if (a >= 85) return { t: 'Devoted', c: '#ff7fae' };
    if (a >= 65) return { t: 'Sweetheart', c: '#e07ab0' };
    if (a >= 45) return { t: 'Close Friend', c: '#9a7fd0' };
    if (a >= 25) return { t: 'Friend', c: '#6fa8d0' };
    if (a > 0) return { t: 'Acquaintance', c: '#8a97a8' };
    return { t: 'Stranger', c: '#8a97a8' };
  }
  const clampAff = (v) => Math.max(0, Math.min(100, v));

  // ---------------- income projections ----------------
  function shiftPay() {
    return Math.round((320 + Math.min(S.day * 6, 220)) * (1 + 0.18 * perkLvl('goldenTouch')) * (1 + 0.05 * wifeIds().length));
  }
  function childPay(c) {
    return Math.round((15 + c.spark * 12) * (1 + 0.3 * perkLvl('familyBusiness')));
  }
  function dailyIncome() {
    const kids = S.children.reduce((s, c) => s + childPay(c), 0);
    const wives = wifeIds().reduce((s, id) => s + D.girlById(id).income, 0);
    return { kids, wives, total: kids + wives };
  }

  // ---------------- world actions ----------------
  function travel(locId) {
    if (locId === S.location) return { ok: false, msg: "You're already here." };
    if (S.ap < 1) return { ok: false, msg: 'No energy left — end the day.' };
    useAp(1);
    S.location = locId;
    const loc = D.locById(locId);
    say(`You head to ${loc.name}.`);
    emit();
    return { ok: true, msg: `You arrive at ${loc.name}. ${loc.blurb}` };
  }

  function talk(girlId) {
    const gs = S.girls[girlId], girl = D.girlById(girlId);
    if (S.ap < 1) return { ok: false, msg: 'No energy left — end the day.' };
    if (!gs.met) { gs.met = true; say(`You meet ${girl.name}. "${girl.meet}"`); }
    useAp(1);
    gs.talks += 1;
    const gain = Math.round(ri(3, 6) * (1 + 0.1 * perkLvl('silverTongue')));
    gs.affection = clampAff(gs.affection + gain);
    const line = pick(girl.talk);
    say(`You chat with ${girl.name} (+${gain}). "${line}"`);
    emit();
    return { ok: true, msg: `${girl.name}: "${line}"  (+${gain} affection)` };
  }

  function gift(girlId, giftId) {
    const gs = S.girls[girlId], girl = D.girlById(girlId);
    const g = D.giftById(giftId);
    const cost = priceOf(g.price);
    if (S.ap < 1) return { ok: false, msg: 'No energy left — end the day.' };
    if (!canSpend(cost)) return { ok: false, msg: `You need $${cost}. Clock a shift at Aozora Corp.` };
    if (g.ring) return { ok: false, msg: 'Rings are for proposals, not gifts — see Propose.' };
    spend(cost);
    useAp(1);
    gs.giftsGiven += 1;
    if (!gs.met) { gs.met = true; say(`You meet ${girl.name}. "${girl.meet}"`); }
    let mult = 1, mood = 'likes';
    if (girl.love.includes(giftId)) { mult = 2.2; mood = 'loves'; }
    else if (girl.like.includes(giftId)) { mult = 1.5; mood = 'likes'; }
    else if (Math.random() < 0.18) { mult = 0.35; mood = "isn't sure about"; }
    const gain = Math.max(1, Math.round((g.power * mult) * (1 + 0.1 * perkLvl('silverTongue'))));
    gs.affection = clampAff(gs.affection + gain);
    say(`You give ${girl.name} ${g.name} for $${cost}. She ${mood} it! (+${gain})`);
    emit();
    return { ok: true, msg: `${girl.name} ${mood} your ${g.name}!  (+${gain} affection, -$${cost})` };
  }

  function buyRing() {
    const cost = priceOf(D.GIFTS.find((x) => x.ring).price);
    if (!canSpend(cost)) return { ok: false, msg: `You need $${cost} for a ring.` };
    spend(cost);
    S.inventory.rings += 1;
    say(`You buy an engagement ring for $${cost}. It sparkles with intent.`);
    emit();
    return { ok: true, msg: `💍 Ring acquired for $${cost}. Propose when the time is right.` };
  }

  function date(girlId, dateId) {
    const gs = S.girls[girlId], girl = D.girlById(girlId);
    const dt = D.DATES.find((d) => d.id === dateId);
    if (S.ap < 1) return { ok: false, msg: 'No energy left — end the day.' };
    if (S.location !== dt.venue) return { ok: false, msg: `You must be at ${dt.venue} for that date.` };
    const cost = priceOf(dt.cost);
    if (!canSpend(cost)) return { ok: false, msg: `That date costs $${cost}. Work a shift first.` };
    if (gs.affection < 15) return { ok: false, msg: `${girl.name} doesn't know you well enough for a date yet. (Need 15 affection)` };
    spend(cost);
    useAp(1);
    gs.dates += 1;
    if (!gs.met) gs.met = true;
    const chem = 0.9 + Math.random() * 0.35;
    const gain = Math.max(1, Math.round(dt.power * chem * (1 + 0.14 * perkLvl('socialStar'))));
    gs.affection = clampAff(gs.affection + gain);
    const line = pick(girl.date);
    say(`${dt.icon} ${dt.name} with ${girl.name} (-$${cost}). "${line}" (+${gain})`);
    emit();
    return { ok: true, msg: `${dt.icon} ${dt.name}! ${girl.name}: "${line}"  (+${gain} affection, -$${cost})` };
  }

  function propose(girlId) {
    const gs = S.girls[girlId], girl = D.girlById(girlId);
    if (gs.married) return { ok: false, msg: `You're already married to ${girl.name}!` };
    if (gs.affection < 100) return { ok: false, msg: `${girl.name} isn't ready for forever yet. (Need 100 affection)` };
    const ringCost = S.inventory.rings > 0 ? 0 : priceOf(D.GIFTS.find((x) => x.ring).price);
    const total = ringCost + D.WEDDING_FEE;
    if (!canSpend(total)) return { ok: false, msg: `A wedding needs $${total} total (ring + chapel fee).` };
    if (ringCost > 0) spend(ringCost); else S.inventory.rings -= 1;
    spend(D.WEDDING_FEE);
    gs.married = true;
    gs.affection = 100;
    S.weddings += 1;
    say(`💒 You and ${girl.name} marry at Starlight Chapel! "${girl.loveLine}"`);
    emit();
    return { ok: true, msg: `💒 ${girl.loveLine}`, wedding: true, girlId };
  }

  function tryForBaby(wifeId) {
    if (S.location !== 'Home') return { ok: false, msg: 'Start a family at your apartment.' };
    if (S.ap < 1) return { ok: false, msg: 'No energy left — end the day.' };
    const gs = S.girls[wifeId], wife = D.girlById(wifeId);
    if (!gs.married) return { ok: false, msg: `Marry ${wife.name} first.` };
    const cost = 250;
    if (!canSpend(cost)) return { ok: false, msg: `Baby expenses cost $${cost}.` };
    spend(cost);
    useAp(1);
    const chance = Math.min(0.95, 0.38 + 0.18 * perkLvl('blessedUnion'));
    if (Math.random() < chance) {
      const born = [makeChild(wife)];
      if (Math.random() < 0.12 * perkLvl('bigFamily')) born.push(makeChild(wife));
      born.forEach((c) => { S.children.push(c); say(`👶 ${c.name} is born! A perfect blend of you and ${wife.name} (Spark ${c.spark}).`); });
      emit();
      return {
        ok: true,
        wedding: false,
        msg: `👶 ${born.map((c) => `${c.name} (${c.gender === 'female' ? 'Girl' : 'Boy'}, Spark ${c.spark})`).join(' & ')} joins the family!`,
        children: born,
      };
    }
    say(`You and ${wife.name} hope for the best... not this month. (-$${cost})`);
    emit();
    return { ok: true, msg: `No luck this month — but the trying is the fun part. (-$${cost})` };
  }

  const lookKeys = ['skin', 'hairStyle', 'hairColor', 'eyeColor', 'faceShape', 'bodyType', 'outfit', 'accessory'];

  function makeChild(wife) {
    // offspring = random combination of mother's and father's traits
    const mLook = {
      skin: wife.skin, hairStyle: wife.hairStyle, hairColor: wife.hairColor, eyeColor: wife.eyeColor,
      faceShape: wife.faceShape, bodyType: wife.bodyType, outfit: wife.outfit, accessory: wife.accessory,
      blush: 1, freckles: 0,
    };
    const look = T.mixLooks(S.player.look, mLook);
    const gender = Math.random() < 0.5 ? 'female' : 'male';
    if (gender === 'female' && ['buzz', 'shortSpiky', 'pixie', 'wolf'].includes(look.hairStyle) && Math.random() < 0.6) {
      look.hairStyle = pick(['longStraight', 'twinTails', 'bob', 'ponytail', 'braids', 'hime']);
    }
    const last = wife.name.split(' ').pop();
    const first = gender === 'female' ? pick(D.FIRST_NAMES_F) : pick(D.FIRST_NAMES_M);
    const spark = Math.max(1, Math.min(10, ri(3, 8) + perkLvl('blessedUnion') - 2 + (S.children.length > 5 ? 1 : 0)));
    return {
      id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: `${first} ${last}`,
      gender, look, spark,
      motherId: wife.id, bornDay: S.day,
    };
  }

  function workShift() {
    if (S.location !== 'Office') return { ok: false, msg: 'Clock in at Aozora Corp.' };
    if (S.ap < 1) return { ok: false, msg: 'No energy left — end the day.' };
    useAp(1);
    const pay = shiftPay();
    earn(pay);
    say(`You grind through a shift at Aozora Corp. (+$${pay})`);
    emit();
    return { ok: true, msg: `💼 Shift complete! +$${pay}` };
  }

  function familyHustle() {
    if (S.location !== 'Home') return { ok: false, msg: 'The family hustle happens at your apartment.' };
    if (S.ap < 1) return { ok: false, msg: 'No energy left — end the day.' };
    if (S.children.length === 0) return { ok: false, msg: 'No children to help with the family business yet.' };
    useAp(1);
    const pay = S.children.reduce((s, c) => s + c.spark, 0) * 14 * (1 + 0.3 * perkLvl('familyBusiness'));
    earn(Math.round(pay));
    say(`The whole crew runs the family side-hustle. (+$${Math.round(pay)})`);
    emit();
    return { ok: true, msg: `🏦 Family hustle pays out! +$${Math.round(pay)}` };
  }

  function endDay() {
    const inc = dailyIncome();
    earn(inc.total);
    S.day += 1;
    S.ap = maxAp();
    let bonus = '';
    const roll = Math.random();
    if (roll < 0.18 && S.girls && D.GIRLS.length) {
      const g = pick(D.GIRLS.filter((x) => S.girls[x.id].met && !S.girls[x.id].married));
      if (g) { const a = S.girls[g.id]; a.affection = clampAff(a.affection + 2); bonus = ` ${g.name} waves hello from down the street. (+2)`; }
    } else if (roll < 0.26) {
      earn(80); bonus = ' You find $80 in an old college jacket.';
    }
    say(`Day ${S.day} begins. Family income: +$${inc.total} (kids $${inc.kids}, wives $${inc.wives}).${bonus}`);
    emit();
    return { ok: true, msg: `☀️ Day ${S.day}. Passive income +$${inc.total}.${bonus}` };
  }

  function buyPerk(perkId) {
    const p = D.perkById(perkId);
    const lvl = perkLvl(perkId);
    if (lvl >= p.max) return { ok: false, msg: `${p.name} is already maxed.` };
    const cost = Math.round(p.base * (lvl + 1));
    if (!canSpend(cost)) return { ok: false, msg: `You need $${cost} for ${p.name} Lv.${lvl + 1}.` };
    spend(cost);
    S.perks[perkId] = lvl + 1;
    if (perkId === 'bigFamily' && S.perks[perkId] >= 3) S.ap = maxAp();
    say(`You invest in ${p.name} Lv.${lvl + 1} (-$${cost}).`);
    emit();
    return { ok: true, msg: `✨ ${p.name} Lv.${lvl + 1} unlocked!` };
  }

  function makeoverCost() { return priceOf(D.MAKEOVER_FEE); }

  function startEditLook() { S.editLook = { ...S.player.look }; }
  function cancelEditLook() { S.editLook = null; }
  function commitEditLook() {
    const cost = makeoverCost();
    if (!canSpend(cost)) return { ok: false, msg: `A makeover costs $${cost}.` };
    spend(cost);
    S.player.look = { ...S.editLook };
    S.editLook = null;
    say(`Makeover complete at Bishoujo Salon for $${cost}. New you!`);
    emit();
    return { ok: true, msg: `💇 Makeover complete! New look locked in. (-$${cost})` };
  }

  function startGame(name, gender) {
    const fresh = newState();
    fresh.started = true;
    fresh.player.name = (name || 'You').slice(0, 14);
    fresh.player.gender = gender === 'female' ? 'female' : 'male';
    fresh.player.look = T.defaultLook(fresh.player.gender);
    S = fresh;
    say(`You just graduated college with $10,000 and a heart full of hope. Welcome to a town of wonderful women, ${S.player.name}!`);
    emit();
  }

  function goalProgress() {
    const wives = wifeIds().length;
    const kids = S.children.length;
    return {
      wives, kids,
      wifeGoal: 5, kidGoal: 8,
      done: wives >= 5 && kids >= 8,
      pct: Math.min(100, Math.round(((wives / 5) + (kids / 8)) * 50)),
    };
  }

  global.Game = {
    init, get, save, load, reset, onChange, emit,
    newState, startGame, travel, talk, gift, buyRing, date, propose, tryForBaby,
    workShift, familyHustle, endDay, buyPerk, startEditLook, cancelEditLook, commitEditLook,
    girlsHere, wifeIds, affectionTier, shiftPay, childPay, dailyIncome, makeoverCost, goalProgress,
    perkLvl, priceOf, maxAp, canSpend, girlsPresentGirls: girlsHere, lookKeys,
  };
})(window);
