/* ============================================================
   ui.js — map, scenes, side-scroll menu, customization, modals
   ============================================================ */
(function (global) {
  'use strict';
  const D = global.GameData, T = global.Traits, P = global.Portrait;
  const $ = (s) => document.querySelector(s);
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let mode = 'play';           // 'play' | 'customize'
  let menuStack = [];
  let selIdx = 0;
  let toastTimer = null;

  /* ============================ boot ============================ */
  function boot() {
    const S = Game.init();
    buildMap();
    wireRail();
    if (!S.started || !S.player.name) showIntro(true);
    else { resetMenu(); refresh(); }
  }

  function refresh() {
    const S = Game.get();
    renderHUD(S);
    renderMap(S);
    renderScene(S);
    renderLog(S);
    renderMenu();
  }

  /* ============================ HUD ============================ */
  function renderHUD(S) {
    $('#statMoney').textContent = money(S.money);
    $('#statDay').textContent = '📅 Day ' + S.day;
    $('#statAp').textContent = `⚡ ${S.ap}/${Game.maxAp()}`;
    const fam = Game.wifeIds().length + S.children.length;
    $('#statFamily').innerHTML = `👨‍👩‍👧‍👦 ${fam}`;
    const pLv = Object.values(S.perks).reduce((a, b) => a + b, 0);
    $('#statPerks').textContent = `✨ Lv.${pLv}`;
    const g = Game.goalProgress();
    $('#goalFill').style.width = g.pct + '%';
    $('#goalText').textContent = `Happy Life: ${g.wives}/${g.wifeGoal} wives · ${g.kids}/${g.kidGoal} kids`;
    if (g.done && !S.goalShown) { S.goalShown = true; Game.save(); showGoalModal(g); }
  }

  /* ============================ MAP ============================ */
  function buildMap() {
    const svg = $('#map');
    const nodes = D.LOCATIONS.map((l) => `
      <g class="loc" data-id="${l.id}" transform="translate(${l.x},${l.y})">
        <rect x="-42" y="-19" width="84" height="38" rx="13" fill="#fff8fd" stroke="#ff9ec4" stroke-width="2.5"/>
        <text x="0" y="-2" text-anchor="middle" font-size="17">${l.icon}</text>
        <text x="0" y="12" text-anchor="middle" font-size="9.5" font-weight="700" fill="#a2578a" font-family="Fredoka, sans-serif">${l.name}</text>
      </g>`).join('');
    svg.innerHTML = `
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#bfe9ff"/><stop offset="100%" stop-color="#ffe9f6"/>
        </linearGradient>
        <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7fd0f0"/><stop offset="100%" stop-color="#3f9fd0"/>
        </linearGradient>
      </defs>
      <rect width="600" height="300" fill="url(#skyG)"/>
      <circle cx="530" cy="40" r="24" fill="#ffe07a" opacity=".9"/>
      <g fill="#ffffff" opacity=".85">
        <ellipse cx="90" cy="42" rx="26" ry="12"/><ellipse cx="112" cy="36" rx="18" ry="10"/>
        <ellipse cx="430" cy="28" rx="22" ry="10"/><ellipse cx="452" cy="24" rx="14" ry="8"/>
      </g>
      <path d="M0,236 Q150,206 300,238 Q450,266 600,232 L600,300 L0,300 Z" fill="#a8e0a0"/>
      <path d="M392,262 Q480,238 600,258 L600,300 L380,300 Z" fill="url(#seaG)"/>
      <path d="M380,292 q14,-8 28,0 q14,8 28,0" stroke="#eafaff" stroke-width="2.5" fill="none" opacity=".8"/>
      <g stroke="#f6d9b0" stroke-width="7" stroke-linecap="round" fill="none" opacity=".95">
        <path d="M80,44 Q140,26 200,36 Q265,46 330,44 Q400,42 470,60"/>
        <path d="M150,116 Q225,92 300,106 Q360,118 420,152"/>
        <path d="M280,172 Q212,150 150,116"/>
        <path d="M280,172 Q292,132 300,106"/>
        <path d="M280,172 Q352,158 420,152"/>
        <path d="M280,172 Q192,186 110,196"/>
        <path d="M280,172 Q252,212 215,246"/>
        <path d="M215,246 Q322,264 430,246"/>
        <path d="M420,152 Q438,200 430,246"/>
        <path d="M110,196 Q88,120 80,44"/>
      </g>
      <g fill="#ffb7d5" opacity=".9">
        <circle cx="60" cy="238" r="15"/><circle cx="84" cy="246" r="12"/><circle cx="40" cy="246" r="10"/>
        <rect x="68" y="246" width="5" height="22" fill="#b98a63"/>
      </g>
      <g fill="#8fd3f4" opacity=".55"><circle cx="566" cy="230" r="4"/><circle cx="548" cy="244" r="3"/><circle cx="580" cy="246" r="3"/></g>
      <g font-family="Fredoka, sans-serif">${nodes}</g>
      <g id="marker">
        <ellipse cx="0" cy="6" rx="12" ry="4" fill="#000" opacity=".18"/>
        <path d="M0,-44 c-11,0 -20,9 -20,20 c0,14 20,30 20,30 s20,-16 20,-30 c0,-11 -9,-20 -20,-20 Z" fill="#ff6fae" stroke="#fff" stroke-width="3"/>
        <text id="markerTxt" x="0" y="-22" text-anchor="middle" font-size="16">♂</text>
      </g>`;
    svg.addEventListener('click', (e) => {
      const g = e.target.closest('.loc');
      if (g) travelTo(g.dataset.id);
    });
  }

  function renderMap(S) {
    document.querySelectorAll('.loc').forEach((n) => n.classList.toggle('here', n.dataset.id === S.location));
    const l = D.locById(S.location);
    const m = $('#marker');
    if (m) m.setAttribute('transform', `translate(${l.x},${l.y - 36})`);
    const t = $('#markerTxt');
    if (t) t.textContent = S.player.gender === 'female' ? '♀' : '♂';
  }

  function travelTo(id) {
    const r = Game.travel(id);
    toast(r.msg);
    refresh();
  }

  /* ============================ SCENE ============================ */
  function portraitOf(char) { return P.portrait(char, { bg: true }); }

  function affBar(S, girlId) {
    const a = S.girls[girlId].affection;
    const tier = Game.affectionTier(a);
    return `<div class="affbar"><i style="width:${a}%"></i></div>
      <div class="aff-txt" style="color:${tier.c}">${a}/100 · ${tier.t}</div>`;
  }

  function renderScene(S) {
    const scene = $('#scene');
    if (mode === 'customize') return renderPreview(S, scene);
    const loc = D.locById(S.location);
    let html = `<div class="loc-head"><span class="ic">${loc.icon}</span>
      <div><h2>${loc.name}</h2><p>${loc.blurb}</p></div></div>`;

    const here = Game.girlsHere();
    html += `<div class="sect"><h3>Women Here Today</h3>`;
    if (here.length === 0) {
      html += `<p style="font-size:13px;color:#9a7c8c">Nobody's around right now — check another spot on the map (▲▼ in the menu to browse actions).</p>`;
    } else {
      html += `<div class="cards">` + here.map((g) => {
        const gs = S.girls[g.id];
        return `<div class="card">
          ${portraitOf({ gender: 'female', look: g })}
          <div class="nm">${esc(g.name)} ${gs.married ? '<span class="badge wifey">WIFE</span>' : ''}</div>
          <div class="job">${g.job} · ${g.age}</div>
          ${affBar(S, g.id)}
        </div>`;
      }).join('') + `</div>`;
    }
    html += `</div>`;

    if (S.location === 'Home') {
      html += `<div class="sect"><h3>Your Family</h3>`;
      html += `<div class="cards">
        <div class="card">${portraitOf(S.player)}
          <div class="nm">${esc(S.player.name)} <span class="badge ${S.player.gender === 'female' ? 'girl' : 'boy'}">${S.player.gender === 'female' ? 'FEMALE' : 'MALE'}</span></div>
          <div class="job">Fresh grad · ${T.MAP.BODY_TYPES[S.player.look.bodyType].name}</div>
          <div class="meta">💍 ${S.inventory.rings} ring(s) in drawer</div>
        </div>`;
      const wives = Game.wifeIds();
      wives.forEach((id) => {
        const g = D.girlById(id);
        html += `<div class="card wife">${portraitOf({ gender: 'female', look: g })}
          <div class="nm">${esc(g.name)} <span class="badge wifey">WIFE</span></div>
          <div class="job">${g.job}</div><div class="meta">Brings +$${g.income}/day</div></div>`;
      });
      S.children.forEach((c) => {
        html += `<div class="card kid">${portraitOf({ gender: c.gender, look: c.look })}
          <div class="nm">${esc(c.name)} <span class="badge ${c.gender === 'female' ? 'girl' : 'boy'}">${c.gender === 'female' ? 'GIRL' : 'BOY'}</span></div>
          <div class="job">Spark ${'★'.repeat(c.spark)}${'☆'.repeat(10 - c.spark)}</div>
          <div class="meta">Earns +$${Game.childPay(c)}/day</div></div>`;
      });
      if (wives.length === 0 && S.children.length === 0) {
        html += `<p style="font-size:13px;color:#9a7c8c">Just you for now. Meet someone, marry her at 100 ♥, then start the family.</p>`;
      }
      html += `</div>`;

      const inc = Game.dailyIncome();
      html += `<div class="sect"><h3>Family Ledger</h3><div class="chips">
        <span class="chip">Daily passive: +$${inc.total}</span>
        <span class="chip">Shift pay: $${Game.shiftPay()}</span>
        <span class="chip">Perks: ${Object.values(S.perks).reduce((a, b) => a + b, 0)} levels</span>
        <span class="chip">Lifetime: ${money(S.lifetimeIncome)}</span>
      </div></div>`;
    }
    scene.innerHTML = html;
  }

  function renderPreview(S, scene) {
    const look = S.editLook || S.player.look;
    const g = (k, list) => (T.MAP[list] && T.MAP[list][look[k]] ? T.MAP[list][look[k]].name : look[k]);
    const outfit = T.MAP.OUTFITS[look.outfit];
    scene.innerHTML = `
      <div class="loc-head"><span class="ic">💇</span><div><h2>Bishoujo Salon — Makeover Session</h2>
      <p>Completely change your look any time for a fee of <b>${money(Game.makeoverCost())}</b>. Use ▲▼ to browse, Enter to pick.</p></div></div>
      <div class="preview-wrap">
        <div class="pv">${portraitOf({ gender: S.player.gender, look })}</div>
        <div class="pv-facts">
          <table>
            <tr><td>Gender</td><td><b>${S.player.gender === 'female' ? '♀ Female' : '♂ Male'}</b></td></tr>
            <tr><td>Body Type</td><td>${g('bodyType', 'BODY_TYPES')}</td></tr>
            <tr><td>Skin</td><td>${g('skin', 'SKINS')}</td></tr>
            <tr><td>Face</td><td>${g('faceShape', 'FACE_SHAPES')}</td></tr>
            <tr><td>Hair</td><td>${g('hairStyle', 'HAIR_STYLES')} · ${g('hairColor', 'HAIR_COLORS')}</td></tr>
            <tr><td>Eyes</td><td>${g('eyeColor', 'EYE_COLORS')}</td></tr>
            <tr><td>Outfit</td><td>${outfit ? outfit.name : '—'} <span class="chip">${outfit ? outfit.tag : ''}</span></td></tr>
            <tr><td>Accessory</td><td>${g('accessory', 'ACCESSORIES')}</td></tr>
            <tr><td>Blush / Freckles</td><td>${look.blush ? 'On' : 'Off'} / ${look.freckles ? 'On' : 'Off'}</td></tr>
          </table>
        </div>
      </div>`;
  }

  /* ============================ LOG + TOAST ============================ */
  function renderLog(S) {
    $('#log').innerHTML = S.log.slice(0, 14).map((l) => `<li><b>D${l.day}</b> ${esc(l.msg)}</li>`).join('');
  }
  function toast(msg) {
    const t = $('#toast');
    t.innerHTML = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3600);
  }

  /* ============================ MENU SYSTEM ============================ */
  function setMenu(m) { menuStack = [m]; selIdx = 0; renderMenu(); scrollSel(); }
  function pushMenu(m) { menuStack.push(m); selIdx = 0; renderMenu(); scrollSel(); }
  function popMenu() { if (menuStack.length > 1) { menuStack.pop(); selIdx = 0; renderMenu(); scrollSel(); } }
  function resetMenu() { setMenu({ title: 'Town Actions', build: mainMenu }); }
  function cur() { return menuStack[menuStack.length - 1]; }
  function items() { const m = cur(); return m ? m.build() : []; }

  function item(o) { return Object.assign({ label: '', sub: '', icon: '•', tag: '', tagClass: '', dis: false, act: null, back: false }, o); }

  function mainMenu() {
    const S = Game.get();
    const out = [];
    const here = Game.girlsHere();

    here.forEach((g) => {
      const gs = S.girls[g.id];
      const tier = Game.affectionTier(gs.affection);
      out.push(item({
        icon: gs.married ? '💗' : '💕', label: `${g.name}${gs.married ? ' (Wife)' : ''}`,
        sub: `${g.job} · ${tier.t}`, tag: `${gs.affection}♥`, tagClass: 'heart',
        act: () => pushMenu({ title: g.name, build: () => girlMenu(g) }),
      }));
    });

    if (S.location === 'Office') {
      out.push(item({ icon: '💼', label: 'Clock a Shift', sub: 'Aozora Corp · earn money for gifts & dates', tag: `+$${Game.shiftPay()}`, act: () => { toast(Game.workShift().msg); refresh(); } }));
    }
    if (S.location === 'Salon' || S.location === 'Home') {
      out.push(item({ icon: '💇', label: 'Change My Looks', sub: 'Full makeover — hair, body, outfit, everything', tag: money(Game.makeoverCost()), act: () => { Game.startEditLook(); mode = 'customize'; setMenu({ title: '💇 Makeover Categories', build: customCatMenu }); refresh(); } }));
      out.push(item({ icon: '✨', label: 'Perk Shop', sub: 'Boost money, affection & offspring', act: () => pushMenu({ title: '✨ Perk Shop', build: perkMenu }) }));
    }
    if (S.location === 'Home') {
      const wives = Game.wifeIds();
      if (wives.length) {
        out.push(item({ icon: '🍼', label: 'Try for a Baby', sub: 'Spend the evening with a wife', tag: '$250', act: () => pushMenu({ title: '🍼 Choose Your Wife', build: () => wifePickMenu() }) }));
        out.push(item({ icon: '🏦', label: 'Family Hustle', sub: 'The kids help earn funds', act: () => { toast(Game.familyHustle().msg); refresh(); } }));
      }
    }
    if (S.location === 'Chapel') {
      const ready = D.GIRLS.filter((g) => S.girls[g.id].affection >= 100 && !S.girls[g.id].married);
      out.push(item({
        icon: '💒', label: 'Wedding Bells', sub: ready.length ? ready.map((g) => g.name).join(', ') + ' is ready!' : 'Find a sweetheart at 100♥ first',
        tag: money(D.WEDDING_FEE), dis: ready.length === 0,
        act: () => pushMenu({ title: '💒 Who Says I Do?', build: () => ready.map((g) => ({
          ...item({ icon: '💍', label: g.name, sub: g.loveLine, tag: '100♥', tagClass: 'heart', act: () => { const r = Game.propose(g.id); toast(r.msg); if (r.wedding) { confetti(); showWeddingModal(g); resetMenu(); } refresh(); } }),
        })) }),
      }));
    }

    out.push(item({ icon: '🛍️', label: 'Give a Gift', sub: here.length ? 'They will love it!' : 'No one is here right now', dis: here.length === 0, act: () => pushMenu({ title: '🛍️ Who is it for?', build: () => girlPick('gift') }) }));
    out.push(item({ icon: '💞', label: 'Ask on a Date', sub: `Dates available at ${S.location}`, dis: here.length === 0, act: () => pushMenu({ title: '💞 Ask out...', build: () => girlPick('date') }) }));
    out.push(item({ icon: '💍', label: 'Propose Marriage', sub: 'Needs 100♥ · ring + chapel fee', act: () => pushMenu({ title: '💍 Propose to...', build: () => girlPick('propose') }) }));
    out.push(item({ icon: '💍', label: 'Buy an Engagement Ring', sub: 'For that special proposal', tag: money(Game.priceOf(2500)), act: () => { toast(Game.buyRing().msg); refresh(); } }));

    out.push(item({ icon: '🛏️', label: 'End the Day', sub: 'Collect family income & recover energy', act: () => { const r = Game.endDay(); toast(r.msg); resetMenu(); refresh(); } }));
    out.push(item({ icon: '💾', label: 'Save Game', sub: 'Progress saves automatically too', act: () => { Game.save(); toast('💾 Game saved!'); } }));
    out.push(item({ icon: '🔄', label: 'New Game', sub: 'Start over from graduation day', act: () => confirmNewGame() }));
    return out;
  }

  function girlPick(kind) {
    const S = Game.get();
    const here = Game.girlsHere();
    const pool = kind === 'propose' ? D.GIRLS.filter((g) => S.girls[g.id].met) : here;
    if (!pool.length) return [item({ icon: '💤', label: 'Nobody around...', sub: 'Try another map location', back: true, act: popMenu })];
    return pool.map((g) => {
      const gs = S.girls[g.id];
      const tier = Game.affectionTier(gs.affection);
      const dis = kind === 'propose' ? (gs.affection < 100 || gs.married) : false;
      const sub = kind === 'propose'
        ? (gs.married ? 'Already your wife!' : gs.affection < 100 ? `Needs 100♥ (now ${gs.affection})` : g.loveLine)
        : `${tier.t} · ${g.job}`;
      return item({
        icon: gs.married ? '💗' : '💕', label: g.name, sub, tag: `${gs.affection}♥`, tagClass: 'heart', dis,
        act: () => {
          if (kind === 'gift') pushMenu({ title: `🎁 Gift for ${g.name}`, build: () => giftMenu(g) });
          else if (kind === 'date') pushMenu({ title: `💞 Date with ${g.name}`, build: () => dateMenu(g) });
          else { const r = Game.propose(g.id); toast(r.msg); if (r.wedding) { confetti(); showWeddingModal(g); resetMenu(); } refresh(); }
        },
      });
    }).concat([item({ icon: '⬅', label: 'Back', back: true, act: popMenu })]);
  }

  function girlMenu(g) {
    const S = Game.get();
    const out = [];
    const gs = S.girls[g.id];
    out.push(item({ icon: '💬', label: 'Talk', sub: 'A little chat goes a long way', tag: '+3~6♥', tagClass: 'heart', act: () => { toast(Game.talk(g.id).msg); refresh(); } }));
    out.push(item({ icon: '🎁', label: 'Give a Gift', sub: 'Pick something from the mall', act: () => pushMenu({ title: `🎁 Gift for ${g.name}`, build: () => giftMenu(g) }) }));
    out.push(item({ icon: '💞', label: 'Ask on a Date', sub: `Now at: ${S.location}`, act: () => pushMenu({ title: `💞 Date with ${g.name}`, build: () => dateMenu(g) }) }));
    out.push(item({
      icon: '💍', label: gs.married ? 'Married!' : 'Propose', tag: gs.married ? '💍' : money(Game.priceOf(2500) + D.WEDDING_FEE),
      dis: gs.married || gs.affection < 100,
      sub: gs.married ? `Your wife, ${g.age}` : gs.affection < 100 ? `Needs 100♥ (now ${gs.affection})` : g.loveLine,
      act: () => { const r = Game.propose(g.id); toast(r.msg); if (r.wedding) { confetti(); showWeddingModal(g); resetMenu(); } refresh(); },
    }));
    out.push(item({ icon: '🏷️', label: 'Her Taste', sub: `Loves: ${g.love.map((id) => D.giftById(id).icon).join(' ')} · Likes: ${g.like.map((id) => D.giftById(id).icon).join(' ')}`, dis: true }));
    out.push(item({ icon: '⬅', label: 'Back', back: true, act: popMenu }));
    return out;
  }

  function giftMenu(g) {
    const S = Game.get();
    const st = Game.perkLvl('silverTongue');
    const rows = D.GIFTS.filter((x) => !x.ring).map((x) => {
      const cost = Game.priceOf(x.price);
      let mult = 1, taste = '';
      if (g.love.includes(x.id)) { mult = 2.2; taste = '❤ She LOVES this'; }
      else if (g.like.includes(x.id)) { mult = 1.5; taste = '♡ She likes this'; }
      else taste = 'neutral...';
      const gain = Math.max(1, Math.round(x.power * mult * (1 + 0.1 * st)));
      return item({
        icon: x.icon, label: x.name, sub: `${taste} · +${gain}♥`, tag: money(cost),
        dis: !Game.canSpend(cost) || S.ap < 1,
        act: () => { toast(Game.gift(g.id, x.id).msg); refresh(); },
      });
    });
    const ringCost = Game.priceOf(2500);
    rows.push(item({ icon: '💍', label: 'Engagement Ring', sub: 'For proposals, not gifts', tag: money(ringCost), dis: !Game.canSpend(ringCost), act: () => { toast(Game.buyRing().msg); refresh(); } }));
    rows.push(item({ icon: '⬅', label: 'Back', back: true, act: popMenu }));
    return rows;
  }

  function dateMenu(g) {
    const S = Game.get();
    const here = D.DATES.filter((d) => d.venue === S.location);
    const rows = here.length ? here.map((d) => {
      const cost = Game.priceOf(d.cost);
      const gain = Math.round(d.power * 1.05 * (1 + 0.14 * Game.perkLvl('socialStar')));
      const dis = !Game.canSpend(cost) || S.ap < 1 || S.girls[g.id].affection < 15;
      const why = S.girls[g.id].affection < 15 ? 'She doesn\'t know you well yet' : `+${gain}♥ · ${d.venue}`;
      return item({ icon: d.icon, label: d.name, sub: why, tag: cost ? money(cost) : 'Free', dis, act: () => { toast(Game.date(g.id, d.id).msg); refresh(); } });
    }) : [item({ icon: '💤', label: `No date spots in ${S.location}`, sub: 'Head to the Cafe, Park, Beach, Mall, Shrine or Salon', back: true, act: popMenu })];
    rows.push(item({ icon: '⬅', label: 'Back', back: true, act: popMenu }));
    return rows;
  }

  function wifePickMenu() {
    const S = Game.get();
    const wives = Game.wifeIds();
    return wives.map((id) => {
      const g = D.girlById(id);
      return item({
        icon: '💗', label: g.name, sub: `${g.job} · ${g.loveLine}`, tag: `$250`,
        dis: !Game.canSpend(250) || S.ap < 1,
        act: () => {
          const r = Game.tryForBaby(id);
          toast(r.msg);
          if (r.children) showBabyModal(r.children);
          refresh();
        },
      });
    }).concat([item({ icon: '⬅', label: 'Back', back: true, act: popMenu })]);
  }

  function perkMenu() {
    return D.PERKS.map((p) => {
      const S = Game.get();
      const lvl = Game.perkLvl(p.id);
      const cost = Math.round(p.base * (lvl + 1));
      return item({
        icon: p.icon, label: p.name, sub: `${p.blurb} — Lv.${lvl}/${p.max}`,
        tag: lvl >= p.max ? 'MAX' : money(cost), tagClass: 'lv',
        dis: lvl >= p.max || !Game.canSpend(cost),
        act: () => { toast(Game.buyPerk(p.id).msg); refresh(); },
      });
    }).concat([item({ icon: '⬅', label: 'Back', back: true, act: popMenu })]);
  }

  /* -------- customization menus -------- */
  const CATS = [
    { id: 'gender', label: 'Gender', icon: '🚻', note: 'Male or Female only', list: () => [{ id: 'male', name: '♂ Male' }, { id: 'female', name: '♀ Female' }] },
    { id: 'bodyType', label: 'Body Type', icon: '🧍', list: () => T.BODY_TYPES },
    { id: 'skin', label: 'Skin Tone', icon: '🖐️', list: () => T.SKINS },
    { id: 'faceShape', label: 'Face Shape', icon: '🙂', list: () => T.FACE_SHAPES },
    { id: 'hairStyle', label: 'Hair Style', icon: '💇‍♀️', list: () => T.HAIR_STYLES },
    { id: 'hairColor', label: 'Hair Color', icon: '🎨', list: () => T.HAIR_COLORS },
    { id: 'eyeColor', label: 'Eye Color', icon: '👁️', list: () => T.EYE_COLORS },
    { id: 'outfit', label: 'Outfit', icon: '👗', list: () => T.OUTFITS },
    { id: 'accessory', label: 'Accessory', icon: '🎀', list: () => T.ACCESSORIES },
    { id: 'blush', label: 'Blush', icon: '🌸', list: () => [{ id: 1, name: 'On' }, { id: 0, name: 'Off' }] },
    { id: 'freckles', label: 'Freckles', icon: '✨', list: () => [{ id: 1, name: 'On' }, { id: 0, name: 'Off' }] },
  ];

  function customCatMenu() {
    const S = Game.get();
    const cur = S.editLook || S.player.look;
    const out = CATS.map((c) => {
      let val;
      if (c.id === 'gender') val = S.player.gender === 'female' ? '♀ Female' : '♂ Male';
      else if (c.id === 'blush' || c.id === 'freckles') val = cur[c.id] ? 'On' : 'Off';
      else { const m = T.MAP[catMap(c.id)]; val = m && m[cur[c.id]] ? m[cur[c.id]].name : String(cur[c.id]); }
      return item({
        icon: c.icon, label: c.label, sub: `Current: ${val}${c.note ? ' · ' + c.note : ''}`,
        act: () => pushMenu({ title: `${c.icon} ${c.label}`, build: () => customItemMenu(c) }),
      });
    });
    out.push(item({ icon: '✔', label: `Confirm New Look`, sub: 'Pay and lock it in', tag: money(Game.makeoverCost()), act: () => { const r = Game.commitEditLook(); toast(r.msg); if (r.ok) { mode = 'play'; resetMenu(); } refresh(); } }));
    out.push(item({ icon: '✖', label: 'Cancel Makeover', sub: 'Keep the current look', back: true, act: () => { Game.cancelEditLook(); mode = 'play'; resetMenu(); refresh(); } }));
    return out;
  }

  function catMap(id) {
    return ({ bodyType: 'BODY_TYPES', skin: 'SKINS', faceShape: 'FACE_SHAPES', hairStyle: 'HAIR_STYLES', hairColor: 'HAIR_COLORS', eyeColor: 'EYE_COLORS', outfit: 'OUTFITS', accessory: 'ACCESSORIES' })[id];
  }

  function customItemMenu(cat) {
    const S = Game.get();
    const list = cat.list();
    const rows = list.map((t) => {
      const cur = cat.id === 'gender' ? S.player.gender : (S.editLook || S.player.look)[cat.id];
      const active = String(cur) === String(t.id);
      const label = t.name + (t.hex ? '' : '');
      const swatch = t.hex ? `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${t.hex};border:1px solid #4a3540;margin-right:5px"></span>` : '';
      return item({
        icon: active ? '✅' : '⚪', label: swatch + label,
        sub: cat.id === 'outfit' ? `${t.tag} · ${money(t.price)}` : (active ? 'Selected' : 'Tap to preview'),
        act: () => {
          if (cat.id === 'gender') {
            S.player.gender = t.id;
            S.editLook = Object.assign({}, S.editLook || S.player.look, T.defaultLook(t.id), { hairColor: (S.editLook || S.player.look).hairColor });
          } else {
            S.editLook[cat.id] = t.id;
          }
          popMenu(); renderScene(S); renderMenu();
        },
        onHover: () => {
          if (cat.id !== 'gender') { S.editLook[cat.id] = t.id; renderScene(S); }
        },
      });
    });
    rows.push(item({ icon: '⬅', label: 'Back', back: true, act: popMenu }));
    return rows;
  }

  /* -------- rendering the rail -------- */
  function renderMenu() {
    const m = cur();
    if (!m) return;
    $('#menuTitle').textContent = m.title;
    const list = $('#menuList');
    const its = items();
    if (selIdx >= its.length) selIdx = Math.max(0, its.length - 1);
    list.innerHTML = '';
    its.forEach((it, i) => {
      const b = el('button', 'mi' + (i === selIdx ? ' sel' : '') + (it.dis ? ' dis' : '') + (it.back ? ' back' : ''));
      b.innerHTML = `<span class="ic">${it.icon}</span>
        <span class="lb">${it.label}${it.sub ? `<small>${it.sub}</small>` : ''}</span>
        ${it.tag ? `<span class="tag ${it.tagClass || ''}">${it.tag}</span>` : '<span></span>'}`;
      b.addEventListener('click', () => { selIdx = i; activate(it); });
      b.addEventListener('mouseenter', () => { if (it.onHover) it.onHover(); });
      list.appendChild(b);
    });
    $('#menuHint').textContent = mode === 'customize'
      ? 'Makeover mode · ▲▼ scroll & preview · Enter to pick'
      : 'Use ▲ ▼ to scroll & select · Enter / click to choose';
  }

  function activate(it) {
    if (it.dis) { toast('Not right now — ' + (it.sub || ' unavailable') + '.'); return; }
    if (it.act) it.act(); else renderMenu();
    scrollSel();
  }

  function moveSel(d) {
    const its = items();
    if (!its.length) return;
    selIdx = Math.max(0, Math.min(its.length - 1, selIdx + d));
    const it = its[selIdx];
    if (it && it.onHover) it.onHover();
    document.querySelectorAll('#menuList .mi').forEach((n, i) => n.classList.toggle('sel', i === selIdx));
    scrollSel();
  }
  function scrollSel() {
    const node = document.querySelectorAll('#menuList .mi')[selIdx];
    if (node) node.scrollIntoView({ block: 'nearest' });
  }
  function scrollBy(px) { $('#menuList').scrollTop += px; }

  function wireRail() {
    $('#btnUp').addEventListener('click', () => { moveSel(-1); scrollBy(-90); });
    $('#btnDown').addEventListener('click', () => { moveSel(1); scrollBy(90); });
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const it = items()[selIdx]; if (it) activate(it); }
      else if (e.key === 'Backspace' || e.key === 'Escape') { e.preventDefault(); if (mode === 'customize') { Game.cancelEditLook(); mode = 'play'; resetMenu(); refresh(); } else popMenu(); }
    });
  }

  /* ============================ MODALS ============================ */
  function showModal(html) {
    const m = $('#modal');
    m.classList.remove('hidden');
    m.innerHTML = html;
    return m;
  }
  function closeModal() { const m = $('#modal'); m.classList.add('hidden'); m.innerHTML = ''; }

  function showIntro(fresh) {
    let gender = 'male';
    const m = showModal(`
      <div class="sheet">
        <h1>🌸 Petal Town Hearts 🌸</h1>
        <h2>~ an early-aughts anime dating sim ~</h2>
        <p>You just graduated college with <b>$10,000</b> and a head full of dreams.<br/>
        Petal Town is home to <b>wonderful women only</b> — fall in love, date, marry, and build a big happy family.<br/>
        Your children will help fund even more dates, gifts and weddings. Live your best life!</p>
        <div class="field">
          <label>YOUR NAME</label>
          <input id="nameIn" maxlength="14" placeholder="Enter your name" value="Haru" />
        </div>
        <div class="field">
          <label>YOUR GENDER <span style="color:#c07a9c">(Male or Female — only two options in Petal Town)</span></label>
          <div class="genders">
            <button class="gbtn m on" data-g="male">♂ MALE<small>Classic protagonist</small></button>
            <button class="gbtn f" data-g="female">♀ FEMALE<small>Same story, your rules</small></button>
          </div>
        </div>
        <button class="big-btn" id="startBtn">💖 Start My New Life</button>
        ${fresh ? '' : '<p style="font-size:11px;margin-top:10px">Starting over erases your current save.</p>'}
      </div>`);
    m.querySelectorAll('.gbtn').forEach((b) => b.addEventListener('click', () => {
      gender = b.dataset.g;
      m.querySelectorAll('.gbtn').forEach((x) => x.classList.toggle('on', x === b));
    }));
    m.querySelector('#startBtn').addEventListener('click', () => {
      const name = (m.querySelector('#nameIn').value || 'You').trim();
      Game.startGame(name, gender);
      closeModal();
      mode = 'play';
      resetMenu();
      refresh();
      toast(`Welcome to Petal Town, ${Game.get().player.name}! You have $10,000 and 4 energy today.`);
    });
  }

  function confirmNewGame() {
    const m = showModal(`
      <div class="sheet">
        <h2>Start a brand new life?</h2>
        <p>This erases your current family, money and memories.</p>
        <button class="big-btn" id="yes">Yes, restart</button>
        <button class="big-btn alt" id="no">No, keep playing</button>
      </div>`);
    m.querySelector('#yes').addEventListener('click', () => { Game.reset(); Game.startGame('Haru', 'male'); closeModal(); mode = 'play'; resetMenu(); refresh(); toast('A new chapter begins!'); });
    m.querySelector('#no').addEventListener('click', closeModal);
  }

  function showWeddingModal(g) {
    const m = showModal(`
      <div class="sheet">
        <h1>💒 Wedding Bells! 💒</h1>
        <div style="display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap">
          <div style="width:170px;background:#fff;border-radius:16px;border:3px solid #ff9ec4;padding:5px">${portraitOf({ gender: 'female', look: g })}</div>
          <div style="max-width:300px;text-align:left">
            <h2>${esc(g.name)}, your wife!</h2>
            <p style="margin:4px 0">"${esc(g.loveLine)}"</p>
            <p style="font-size:12px">${esc(g.job)} · brings +$${g.income}/day to the family · try for a baby at Home 🍼</p>
          </div>
        </div>
        <button class="big-btn" id="close">Onwards! 💞</button>
      </div>`);
    confetti();
    m.querySelector('#close').addEventListener('click', () => { closeModal(); refresh(); });
  }

  function showBabyModal(children) {
    const cards = children.map((c) => `
      <div class="baby">${portraitOf({ gender: c.gender, look: c.look })}
        <div class="nm">${esc(c.name)}</div>
        <div class="badge ${c.gender === 'female' ? 'girl' : 'boy'}">${c.gender === 'female' ? '♀ GIRL' : '♂ BOY'}</div>
        <div style="font-size:11px;margin-top:3px">Spark ${'★'.repeat(c.spark)}${'☆'.repeat(10 - c.spark)}<br/>+$${Game.childPay(c)}/day</div>
      </div>`).join('');
    const m = showModal(`
      <div class="sheet">
        <h1>👶 A New Generation! 👶</h1>
        <p>A random blend of you and their mother — every trait picked from either parent.</p>
        <div class="baby-row">${cards}</div>
        <button class="big-btn" id="close">So cute! 💕</button>
      </div>`);
    confetti();
    m.querySelector('#close').addEventListener('click', () => { closeModal(); refresh(); });
  }

  function showGoalModal(g) {
    const m = showModal(`
      <div class="sheet">
        <h1>🌟 Happily Ever After! 🌟</h1>
        <p>You came to Petal Town with $10,000 and a dream.<br/>
        Now you have <b>${g.wives} wives</b>, <b>${g.kids} children</b>, and a family that funds itself.<br/>
        The town throws a festival in your name. Keep playing — the heart wants what it wants!</p>
        <button class="big-btn" id="close">Keep living the dream 💖</button>
      </div>`);
    confetti(80);
    m.querySelector('#close').addEventListener('click', () => { closeModal(); refresh(); });
  }

  function confetti(n) {
    const c = el('div', 'confetti');
    const colors = ['#ff8fc2', '#ffd76e', '#c9a8f0', '#8fd3f4', '#7ed6a8', '#ff5f8f'];
    for (let i = 0; i < (n || 40); i++) {
      const p = el('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 2 + Math.random() * 2 + 's';
      p.style.animationDelay = Math.random() * 0.8 + 's';
      c.appendChild(p);
    }
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5200);
  }

  /* ============================ go ============================ */
  document.addEventListener('DOMContentLoaded', boot);
})(window);
