// All screen markup. Pure functions of game state keep the app easy to reason about.
import {
  LOCATIONS, LOCATION_BY_ID, PERSONALITIES, GIFTS, GIFT_BY_ID, PERK_DEFS,
  OUTFITS, SKIN_TONES, HAIR_COLORS, HAIR_STYLES, EYE_SHAPES, EYE_COLORS, MOUTHS,
  BODY_TYPES, ACCESSORIES, SPECIES, HOLIDAYS, DIALOGUE, MARRIAGE_VOWS,
  dateLabel, shortDate, weekdayOf, getHoliday, holidayDaysLeft, nextHolidayLabel,
  relationshipStage, affectionBar, dailyIncome, incomeBreakdown, childIncome,
  perkUpgradeCost, prestigeReward, dateCost, ringCost, conceptionChance,
  dailyIncome as dailyIncomeFn, monthLabel, formatMoney, timeLabel, dayPhase,
  addDays, MONTHS, MONTHS_SHORT, WEEKDAYS, rand, pick
} from './data.js';
import { renderAvatar } from './avatar.js';
import { icon, heartRow } from './icons.js';
import { mapArtSVG } from './map-art.js';

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const money = formatMoney;
const pct = n => `${Math.max(0, Math.min(100, Math.round(n)))}%`;

const PORTRAIT_PALETTES = [
  ['#ffd7df', '#ffeed4'], ['#d8e8fa', '#f7e4ee'], ['#e2f2d6', '#fff0c9'],
  ['#f1ddf7', '#ffe8d6'], ['#ffe3c0', '#ffd9e2'], ['#d9f0eb', '#ffe8d8'],
  ['#f4d9d0', '#f2e6c8'], ['#e2e1fb', '#ffdce6']
];

export function portraitPalette(seed = '') {
  let n = 0;
  for (const ch of String(seed)) n = (n * 31 + ch.charCodeAt(0)) % 997;
  return PORTRAIT_PALETTES[n % PORTRAIT_PALETTES.length];
}

function speciesIcon(species) {
  if (!species || species === 'Human') return 'heart';
  if (species.includes('Cat') || species.includes('Fox')) return 'paw';
  if (species.includes('Bunny')) return 'leaf';
  if (species === 'Elf') return 'sparkle';
  if (species === 'Pearlfin') return 'shell';
  if (species === 'Deer') return 'leaf';
  if (species === 'Cupid') return 'heart';
  return 'sparkle';
}

function pronoun(gender) {
  return gender === 'female' ? 'she' : 'he';
}
function pronounObj(gender) {
  return gender === 'female' ? 'her' : 'him';
}
function possessive(gender) {
  return gender === 'female' ? 'her' : 'his';
}

function faceHTML(profile, alt, extraClass = '') {
  return `<div class="avatar-bust ${extraClass}">${renderAvatar(profile, { alt })}</div>`;
}

function personHoliday(s) {
  if (!s.holidayId) return null;
  return HOLIDAYS.find(h => h.id === s.holidayId);
}

export function stageFor(s) {
  return relationshipStage(s.affection || 0);
}

/* ------------------------------------------------------------------ */
/* Map                                                                 */
/* ------------------------------------------------------------------ */
export function renderMapView(state) {
  const h = getHoliday(state.date);
  const holiday = h ? { ...h, left: holidayDaysLeft(state.date, h) } : null;
  const next = nextHolidayLabel(state.date);
  const local = state.suitors.filter(s => s.location === state.location);
  const loc = LOCATION_BY_ID[state.location] || LOCATIONS[0];
  const pal = portraitPalette(loc.id);
  const atNight = state.minute >= 23 * 60 || state.minute < 5 * 60;
  const hourPhase = dayPhase(state.minute);
  const counts = Object.fromEntries(LOCATIONS.map(l => [l.id, state.suitors.filter(s => s.location === l.id).length]));
  const female = state.suitors.filter(s => s.gender === 'female').length;
  const male = state.suitors.filter(s => s.gender === 'male').length;

  const nodes = LOCATIONS.map(l => {
    const active = state.location === l.id;
    return `
      <button class="map-node ${active ? 'active' : ''}" style="left:${l.x}%;top:${l.y}%;--loc-bg:${l.color};--loc-ink:${l.accent}" data-action="select-location" data-location="${l.id}" aria-label="Go to ${esc(l.name)}">
        <span class="node-pin">${icon(l.icon, 20)}</span>
        <span class="node-label">${esc(l.short)} ${counts[l.id] ? `<span class="count">${counts[l.id]}</span>` : ''}</span>
      </button>`;
  }).join('');

  const you = `<div class="you-marker" style="left:${loc.x}%;top:${loc.y}%;margin-top:-51px">
    <span class="you-bubble">YOU</span>
    <span class="you-head">${renderAvatar(state.mc.profile, { alt: state.mc.name })}</span>
  </div>`;

  const localPeople = atNight
    ? `<div class="family-empty" style="margin-top:10px"><p>Lights are out and doors are locked. Even the café cat has gone to bed.</p></div>`
    : local.length
      ? local.map(s => {
        const stage = stageFor(s);
        return `<button class="local-person" data-action="open-suitor" data-id="${s.id}">
          <span class="lp-face">${renderAvatar(s.profile, { alt: s.name })}</span>
          <span class="lp-copy"><b>${esc(s.name)}</b><small>${esc(s.personalityName)} · ${stage.name}</small></span>
          <span class="lp-heart">${Math.round(s.affection)}%</span>
        </button>`;
      }).join('')
      : `<div class="family-empty" style="margin-top:10px"><p>It is quiet here right now. Try another spot on the map.</p></div>`;

  const actions = [];
  if (loc.actions.includes('work') && !atNight) actions.push(`<button class="btn btn-cream btn-sm" data-action="work" data-location="${loc.id}">${icon('coins', 14)} Pick up a shift</button>`);
  if (loc.actions.includes('gifts')) actions.push(`<button class="btn btn-cream btn-sm" data-action="open-boutique">${icon('gift', 14)} Browse gifts</button>`);
  if (loc.id === 'home') actions.push(`<button class="btn btn-violet btn-sm" data-action="sleep-menu">${atNight ? 'Go to bed' : 'Turn in early'}</button>`);
  if (loc.id === 'park' || loc.id === 'beach') actions.push(`<button class="btn btn-ghost btn-sm" data-action="go-screen" data-screen="suitors">${icon('heart', 14)} Meet someone</button>`);
  if (!actions.length) actions.push(`<button class="btn btn-ghost btn-sm" data-action="go-screen" data-screen="suitors">${icon('heart', 14)} Find a face</button>`);

  return `
    <div class="view-head">
      <div class="heading-copy">
        <div class="eyebrow pink">${WEEKDAYS[new Date(Date.UTC(state.date.year, state.date.month, state.date.day)).getUTCDay()]} · ${MONTHS[state.date.month]} ${state.date.day}, ${state.date.year}</div>
        <h1>${hourPhase.id === 'morning' ? 'Good morning' : hourPhase.id === 'day' ? 'Good afternoon' : hourPhase.id === 'evening' ? 'Good evening' : 'Up late'}, <span class="script">${esc(state.mc.name)}</span>.</h1>
        <p class="sub">${atNight ? 'The town is sleeping. Head home, or stay up and risk tomorrow’s yawns.' : 'Seven little corners of town, and every one of them could change your life.'}</p>
      </div>
      <div class="head-actions">
        ${holiday ? `<span class="chip hot">${icon(holiday.icon, 12)} ${esc(holiday.name)} · ${holiday.left}d left</span>` : `<span class="chip mint">${icon('sun', 12)} ${esc(next?.holiday.name || 'Quiet season')} in ${next?.inDays ?? '—'}d</span>`}
        <span class="chip">${icon('heart', 12)} ${female}F · ${male}M</span>
        <button class="btn btn-ghost btn-sm" data-action="open-calendar">${icon('calendar', 14)} Calendar</button>
      </div>
    </div>

    <div class="map-layout">
      <div class="map-frame">
        <div class="map-topbar">
          <div class="map-title">${icon('map', 15)} Maple Hollow · Town Map</div>
          <div class="map-hint">${icon('pin', 12)} ${esc(loc.short)} selected</div>
        </div>
        <div class="map-scroll" id="mapScroll">
          <div class="map-canvas">
            ${mapArtSVG()}
            <div class="map-compass"><span>N</span></div>
            ${nodes}
            ${you}
            <div class="map-weather">${icon(hourPhase.icon, 14)} ${hourPhase.label} · ${atNight ? 'quiet' : 'mild'}</div>
            <div class="map-legend"><i></i> ${state.suitors.length} hearts in town</div>
          </div>
        </div>
        <div class="map-scroll-foot">
          <span>${icon('pin', 12)} ${esc(loc.name)}</span>
          <span class="map-pan-note">Scroll or drag to pan →</span>
        </div>
      </div>

      <aside class="map-side">
        <section class="local-card" style="--loc-bg:${loc.color};--loc-ink:${loc.accent}">
          <div class="loc-badge">${icon(loc.icon, 18)}</div>
          <div class="eyebrow" style="color:${loc.accent}">LOCATION</div>
          <h3>${esc(loc.name)}</h3>
          <p>${esc(loc.blurb)}</p>
          <div class="local-actions">${actions.join('')}</div>
          <div class="local-people">
            ${localPeople}
          </div>
        </section>

        ${holiday ? `
          <section class="local-card" style="border-color:${holiday.color};background:linear-gradient(150deg,#fff8e7,${holiday.blush})">
            <div class="eyebrow" style="color:${holiday.color}">THIS WEEK</div>
            <h3 style="margin-top:2px">${esc(holiday.name)}</h3>
            <p>${esc(holiday.desc)}</p>
            <div class="flex items-center justify-between mt-8">
              <span class="chip" style="border-color:${holiday.color}">${icon(holiday.icon, 12)} ${holiday.left} days left</span>
              <button class="text-btn" data-action="open-holiday">Meet the visitors</button>
            </div>
          </section>` : `
          <section class="local-card">
            <div class="eyebrow">UP NEXT</div>
            <h3 style="margin-top:2px">${esc(next?.holiday.name || 'A quiet season')}</h3>
            <p>${next ? `${esc(next.holiday.desc)} Starts in ${next.inDays} day${next.inDays === 1 ? '' : 's'}.` : 'Winterlight is over. The town is settling in.'}</p>
            <div class="mt-8"><span class="chip violet">${icon('calendar', 12)} ${next ? `in ${next.inDays}d` : 'no event'}</span></div>
          </section>`}

        <div class="map-tip">
          <b>${icon('sparkle', 14)} Local wisdom</b>
          <p>${atNight ? 'Staying up has a price: your energy drops and a few sharp-eyed sweethearts will notice. Sleep is free. Flirting while exhausted is not.' : 'Any conversation nudges the clock forward. If you stay out past 11 PM, everyone heads home — but you can choose to stay up.'}</p>
        </div>
      </aside>
    </div>`;
}

/* ------------------------------------------------------------------ */
/* Suitor roster                                                       */
/* ------------------------------------------------------------------ */
export function renderSuitorsView(state, filter = 'all') {
  const base = state.suitors;
  const filters = [
    ['all', 'Everyone', base.length],
    ['women', 'Women', base.filter(s => s.gender === 'female').length],
    ['men', 'Men', base.filter(s => s.gender === 'male').length],
    ['holiday', 'Special visitors', base.filter(s => s.holidayId).length],
    ['met', 'Met', base.filter(s => s.met).length]
  ];
  let list = base.slice();
  if (filter === 'women') list = list.filter(s => s.gender === 'female');
  if (filter === 'men') list = list.filter(s => s.gender === 'male');
  if (filter === 'holiday') list = list.filter(s => s.holidayId);
  if (filter === 'met') list = list.filter(s => s.met);
  list.sort((a, b) => {
    if (Boolean(b.holidayId) !== Boolean(a.holidayId)) return b.holidayId ? 1 : -1;
    return b.affection - a.affection;
  });

  const female = state.suitors.filter(s => s.gender === 'female').length;
  const male = state.suitors.filter(s => s.gender === 'male').length;
  const atNight = state.minute >= 23 * 60 || state.minute < 5 * 60;

  return `
    <div class="view-head">
      <div class="heading-copy">
        <div class="eyebrow pink">THE HEARTS OF MAPLE HOLLOW</div>
        <h1>Meet your <span class="script">maybe-forevers</span>.</h1>
        <p class="sub">Every relationship begins somewhere. Browse the town, say hello, and see who makes your heart do the early-2000s rom-com thing.</p>
      </div>
      <div class="head-actions">
        <span class="chip mint">${icon('heart', 12)} ${female} women</span>
        <span class="chip violet">${icon('heart', 12)} ${male} men</span>
        <span class="chip">3 : 1 town ratio</span>
      </div>
    </div>

    <div class="filter-row mb-12">
      ${filters.map(([id, label, count]) => `<button class="filter-chip ${filter === id ? 'active' : ''}" data-action="filter-suitors" data-filter="${id}">${label} <span style="opacity:.6">${count}</span></button>`).join('')}
    </div>

    ${list.length ? `<div class="suitor-grid">${list.map(s => suitorCard(state, s, atNight)).join('')}</div>` : `
      <div class="panel empty-state">
        <div class="empty-icon">${icon('heart', 26)}</div>
        <h3>No hearts in this filter</h3>
        <p>Try “Everyone” — Maple Hollow is full of people who have not met you yet.</p>
      </div>`}
  `;
}

function suitorCard(state, s, atNight) {
  const stage = stageFor(s);
  const [a, b] = portraitPalette(s.name + s.personality);
  const holiday = personHoliday(s);
  const daysLeft = Math.max(0, 7 - (s.ignored || 0));
  const leaving = !s.met && s.ignored >= 3;
  return `
    <article class="suitor-card">
      <div class="suitor-portrait" style="--port-a:${a};--port-b:${b}">
        <div class="portrait-badges">
          <span class="chip">${icon(speciesIcon(s.species), 11)} ${esc(s.species.replace(' demi-human', ''))}</span>
          ${holiday ? `<span class="chip hot">${icon(holiday.icon, 11)} ${esc(holiday.short)}</span>` : (s.met ? `<span class="chip mint">${icon('check', 11)} met</span>` : `<span class="chip">new face</span>`)}
        </div>
        ${s.met ? `<div class="relationship-ribbon">${stage.name.toUpperCase()}</div>` : ''}
        ${renderAvatar(s.profile, { alt: s.name })}
        <div class="suitor-heart-badge">${icon('heartFill', 12)} ${Math.round(s.affection)}%</div>
      </div>
      <div class="suitor-info">
        <div class="suitor-name-row">
          <div>
            <h3>${esc(s.name)}</h3>
            <div class="age">${s.age} · ${esc(s.occupation)}</div>
          </div>
          ${heartRow(stage.hearts, 5)}
        </div>
        <p class="suitor-sub">${esc(s.personalityName)} energy. ${esc(s.bio.split('.')[0])}.</p>
        <div class="affection-line">
          <div class="meter"><i style="width:${affectionBar(s.affection)}%"></i></div>
          <b>${Math.round(s.affection)}%</b>
        </div>
        ${leaving ? `<div class="suitor-leaving">${icon('clock', 11)} Hasn’t met you yet · leaves in ${daysLeft}d</div>` : ''}
        <div class="suitor-card-actions">
          <button class="btn btn-ghost btn-sm" data-action="open-suitor" data-id="${s.id}">${icon('eye', 13)} Visit</button>
          <button class="btn btn-primary btn-sm" data-action="quick-flirt" data-id="${s.id}" ${atNight ? 'disabled' : ''}>${icon('heart', 13)} Flirt</button>
        </div>
      </div>
    </article>`;
}

/* ------------------------------------------------------------------ */
/* Relationship profile                                                */
/* ------------------------------------------------------------------ */
export function renderProfileView(state, s) {
  const stage = stageFor(s);
  const [a, b] = portraitPalette(s.name + s.personality);
  const h = getHoliday(state.date);
  const atNight = state.minute >= 23 * 60 || state.minute < 5 * 60;
  const married = Boolean(s.married);
  const canDate = s.affection >= 28 && state.funds >= dateCost(state, s) && !atNight;
  const canPropose = s.affection >= 72 && state.funds >= ringCost() && !married && !atNight;
  const lowEnergy = state.sleep < 35 || state.sleepDebt > 0;
  const personality = PERSONALITIES.find(p => p.id === s.personality) || PERSONALITIES[0];
  const holiday = personHoliday(s);
  const dateBase = dateCost(state, s);
  const dateTip = s.affection < 28 ? `Unlocks at 28% affection (${28 - Math.round(s.affection)}% to go).` : atNight ? 'Everyone has gone home for the night.' : state.funds < dateBase ? `You need at least ${money(dateBase)} for a date.` : 'Pick a place and make a memory.';
  const quote = s.lastLine || (DIALOGUE.greeting[s.personality]?.[0] || DIALOGUE.greeting.sunshine[0]);
  const likes = (personality.likes || []).map(id => GIFT_BY_ID[id]).filter(Boolean);

  return `
    <div class="profile-view">
      <div class="profile-breadcrumb">
        <button class="back-btn" data-action="go-screen" data-screen="suitors">${icon('back', 16)} All hearts</button>
        <div class="flex gap-6 items-center wrap">
          ${holiday ? `<span class="chip hot">${icon(holiday.icon, 11)} ${esc(holiday.name)}</span>` : ''}
          ${married ? `<span class="chip mint">${icon('ring', 11)} Married</span>` : `<span class="chip ${stage.tone === 'soul' ? 'hot' : ''}">${icon('heart', 11)} ${esc(stage.name)}</span>`}
        </div>
      </div>

      <div class="profile-hero">
        <div class="portrait-stage" style="--stage-a:${a};--stage-b:${b}">
          <div class="stage-heart">${icon('heartFill', 14)} ${Math.round(s.affection)}</div>
          <div class="stage-sticker"><b>${esc(s.name)}</b> · ${s.age} · ${esc(s.species)}</div>
          ${renderAvatar(s.profile, { alt: s.name, mood: lowEnergy ? 'tired' : '' })}
        </div>

        <div class="profile-panel">
          <div class="profile-title-card">
            <div class="profile-title-top">
              <div>
                <h1>${esc(s.name)}</h1>
                <small>${esc(s.occupation)} · ${esc(s.personalityName)} · ${esc(s.species)}</small>
              </div>
              <div class="profile-title-right">
                ${heartRow(stage.hearts, 5, 'big-hearts')}
                <span class="chip ${married ? 'mint' : 'pink'}">${married ? 'Your spouse' : stage.name}</span>
              </div>
            </div>
            <div class="profile-tags">
              <span class="tag">${icon(personality.icon, 11)} ${esc(personality.name)}</span>
              <span class="tag butter">${icon('sparkle', 11)} ${esc(personality.blurb.split('.')[0])}</span>
              ${s.holidayId ? `<span class="tag violet">${icon('calendar', 11)} In town for the festival</span>` : ''}
              ${!s.met && !married ? `<span class="tag" style="background:#fff1d7;color:#9b6e25">${icon('clock', 11)} ${Math.max(0, 7 - (s.ignored || 0))}d until they move on</span>` : ''}
            </div>
            <div class="profile-affection">
              <div class="affection-line">
                <span class="tiny" style="font-weight:900;color:var(--ink-soft)">AFFECTION</span>
                <div class="meter"><i style="width:${affectionBar(s.affection)}%"></i></div>
                <b>${Math.round(s.affection)}%</b>
              </div>
              <div class="relationship-track">
                ${['Just Met', 'Curious', 'Flirty', 'Crushing', 'Smitten', 'Soulmates'].map((label, i) => `<span class="${i <= stage.hearts ? 'on' : ''}" title="${label}"></span>`).join('')}
              </div>
            </div>
          </div>

          <div class="dialogue-card">
            <div class="q-label">${icon('chat', 12)} ${lowEnergy ? 'They notice you’re tired' : `A little something ${esc(s.name)} said`}</div>
            <p>“${esc(lowEnergy && s.gender === 'female' ? pick(DIALOGUE.tired) : quote)}”</p>
            <div class="q-meta">${labelForTalk(s)} · ${s.met ? 'You have spoken' : 'You have not really spoken yet'}</div>
          </div>

          ${atNight ? `<div class="day-report" style="background:#eee9f8;border-color:#cbbde8"><h3 style="color:#594984">Everyone is home for the night</h3><p style="color:#756795">You can still look at your memories, but there is no one to flirt with until morning. Head to Rosewood Cottage to sleep.</p></div>` : ''}

          <div class="action-grid">
            <button class="btn" data-action="flirt" data-id="${s.id}" ${atNight ? 'disabled' : ''}>${icon('heart', 18)} Flirt <small style="font-size:7px;opacity:.7">+random</small></button>
            <button class="btn" data-action="open-gifts" data-id="${s.id}" ${atNight ? 'disabled' : ''}>${icon('gift', 18)} Gift <small style="font-size:7px;opacity:.7">from $8</small></button>
            <button class="btn btn-mint" data-action="open-date" data-id="${s.id}" ${!canDate ? 'disabled' : ''}>${icon('cup', 18)} Date <small style="font-size:7px;opacity:.7">from ${money(dateBase)}</small></button>
            ${married
              ? `<button class="btn btn-violet" data-action="try-baby" data-id="${s.id}" ${atNight ? 'disabled' : ''}>${icon('baby', 18)} Try for a child</button>`
              : `<button class="btn btn-violet" data-action="propose" data-id="${s.id}" ${!canPropose ? 'disabled' : ''}>${icon('ring', 18)} Propose <small style="font-size:7px;opacity:.7">$250 ring</small></button>`}
          </div>
          <div class="action-note">${married ? 'You are already married. The town thinks that is lovely. Your family can grow whenever you are ready.' : dateTip}</div>
          ${!married && s.affection >= 60 ? `<div class="action-note" style="color:var(--pink-deep);font-weight:800">Proposal ready at 72% affection. ${s.affection >= 72 ? 'The ring is waiting.' : `${Math.ceil(72 - s.affection)}% to go.`}</div>` : ''}
          ${lowEnergy ? `<div class="action-note" style="color:#b85e45;font-weight:800">You are running on fumes. Flirting may land softer, and some people will notice.</div>` : ''}
        </div>
      </div>

      <div class="profile-lower">
        <section class="about-card">
          <h3>${icon('book', 14)} About ${esc(s.name)}</h3>
          <p>${esc(s.bio)}</p>
          <div class="likes-list">
            ${likes.map(g => `<span class="like">${icon(g.icon, 12)} ${esc(g.name)}</span>`).join('')}
          </div>
        </section>
        <section class="about-card ${married ? 'married-card' : ''}">
          <h3>${icon(married ? 'ring' : 'heart', 14)} ${married ? 'Your household' : 'The road to “I do”'}</h3>
          ${married ? `
            <p>${esc(s.name)} said yes. In Maple Hollow, love only gets bigger. Try for a child whenever you are both ready.</p>
            <div class="flex gap-6 items-center mt-8">
              <span class="chip mint">${icon('family', 11)} ${state.children.filter(c => c.parents?.includes(s.name)).length} children together</span>
            </div>
            <button class="btn btn-primary btn-sm btn-block" data-action="try-baby" data-id="${s.id}" ${atNight ? 'disabled' : ''}>${icon('baby', 13)} Ask about a child</button>
          ` : `
            <p>Flirt or give gifts to raise affection. Dates unlock at 28%. You can propose at 72% — and this town has no rules against more than one spouse.</p>
            <div class="flex gap-6 mt-8">
              <span class="stat-pill">${icon('chat', 12)} Flirt +2–10</span>
              <span class="stat-pill">${icon('gift', 12)} Gifts +4–38</span>
            </div>
          `}
        </section>
      </div>
    </div>`;
}

function labelForTalk(s) {
  if (s.met) return `${s.giftCount} gift${s.giftCount === 1 ? '' : 's'} · ${s.dateCount} date${s.dateCount === 1 ? '' : 's'}`;
  return 'A first impression';
}

/* ------------------------------------------------------------------ */
/* Family                                                              */
/* ------------------------------------------------------------------ */
export function renderFamilyView(state) {
  const income = dailyIncome(state);
  const breakdown = incomeBreakdown(state);
  const adults = state.children.filter(c => c.ageYears >= 18 || c.movedOut);
  const kids = state.children.filter(c => c.ageYears < 18 && !c.movedOut);
  const prestige = Object.values(state.perks).reduce((sum, p) => sum + p.prestige, 0);

  return `
    <div class="view-head">
      <div class="heading-copy">
        <div class="eyebrow pink">YOUR GROWING HOUSEHOLD</div>
        <h1>Love, <span class="script">multiplied</span>.</h1>
        <p class="sub">Maple Hollow has never thought love was a pie. Every spouse, every little one, every grown-up postcard adds a little more to the table.</p>
      </div>
      <div class="head-actions">
        <span class="chip mint">${icon('family', 12)} ${state.spouses.length} spouse${state.spouses.length === 1 ? '' : 's'}</span>
        <span class="chip violet">${icon('baby', 12)} ${state.children.length} child${state.children.length === 1 ? '' : 'ren'}</span>
        <button class="btn btn-primary btn-sm" data-action="go-screen" data-screen="suitors">${icon('heart', 14)} Find another</button>
      </div>
    </div>

    <div class="family-summary">
      <div class="summary-stat">
        <div class="sum-icon">${icon('ring', 16)}</div>
        <small>SPOUSES</small><b>${state.spouses.length}</b><span>all under one roof</span>
      </div>
      <div class="summary-stat mint">
        <div class="sum-icon">${icon('baby', 16)}</div>
        <small>CHILDREN</small><b>${state.children.length}</b><span>${kids.length} at home · ${adults.length} grown</span>
      </div>
      <div class="summary-stat butter">
        <div class="sum-icon">${icon('coins', 16)}</div>
        <small>DAILY INCOME</small><b>${money(income)}</b><span>collected each morning</span>
      </div>
      <div class="summary-stat violet">
        <div class="sum-icon">${icon('crown', 16)}</div>
        <small>LEGACY</small><b>${prestige}<span style="display:inline;font-size:10px;color:var(--ink-faint)">/9</span></b><span>prestige stars earned</span>
      </div>
    </div>

    <div class="family-layout">
      <div>
        <div class="family-section-title">
          <h2>${icon('ring', 17)} Your spouses</h2>
          <span class="tiny muted">${state.spouses.length ? 'Click a face to visit' : 'A full house starts with one brave question'}</span>
        </div>
        ${state.spouses.length ? `<div class="spouse-list">${state.spouses.map(sp => spouseCard(sp, state)).join('')}</div>` : `
          <div class="family-empty">
            <div class="empty-icon" style="margin:0 auto 7px">${icon('ring', 24)}</div>
            <b style="font-family:var(--font-display);font-size:13px">No spouses yet</b>
            <p>Build affection to 72%, buy a ring, and ask. Maple Hollow will cheer either way — and nobody will ask you to stop at one.</p>
            <button class="btn btn-primary btn-sm" style="margin-top:9px" data-action="go-screen" data-screen="suitors">${icon('heart', 13)} Meet your first love</button>
          </div>`}

        <div class="family-section-title" style="margin-top:17px">
          <h2>${icon('baby', 17)} The next generation</h2>
          <span class="tiny muted">${state.children.length ? 'Each birthday arrives with the new month' : 'Try for a child with a spouse'}</span>
        </div>
        ${state.children.length ? `<div class="child-list">${state.children.map(c => childCard(c, state)).join('')}</div>` : `
          <div class="family-empty">
            <p>Your family album is waiting for its first tiny portrait. Married spouses can be asked to start a family from their profile.</p>
          </div>`}
      </div>

      <aside style="display:grid;gap:11px">
        <section class="about-card income-card">
          <h3>${icon('coins', 14)} Household ledger</h3>
          ${breakdown.map(row => `<div class="income-row"><span>${esc(row.label)}</span><b>+${money(row.value)}</b></div>`).join('')}
          <div class="income-row" style="border-top:1.5px solid rgba(81,59,81,.14);margin-top:3px;padding-top:7px"><b style="font-family:var(--font-display);color:var(--ink)">Total / day</b><b>${money(income)}</b></div>
          <p class="tiny muted" style="margin-top:7px">Income is added automatically each new day. Prestige perks at Max Rank give instant windfalls.</p>
        </section>

        <section class="legacy-banner">
          <div class="legacy-icon">${icon('crown', 20)}</div>
          <div>
            <h3>${state.children.some(c => c.movedOut) ? 'The family tree is branching' : 'Legacy in progress'}</h3>
            <p>${state.children.some(c => c.movedOut) ? 'Grown children move out, find love of their own, and send a little something home each day.' : 'Raise children, let the months turn, and they will eventually leave the nest — married, happy, and still yours.'}</p>
          </div>
        </section>

        <section class="about-card">
          <h3>${icon('sparkle', 14)} How children grow</h3>
          <p>Each new month adds one year. At 18 they move out and start their own marriage story. Their portraits are a random mix of you and your spouse — hair, eyes, smile, and all.</p>
        </section>
      </aside>
    </div>`;
}

function spouseCard(sp, state) {
  const stage = stageFor(sp);
  const kids = state.children.filter(c => c.parents?.includes(sp.name)).length;
  return `<article class="spouse-card">
    <div class="spouse-face">${renderAvatar(sp.profile, { alt: sp.name })}</div>
    <div class="spouse-copy">
      <h3>${esc(sp.name)}</h3>
      <small>${esc(sp.occupation)} · ${kids} child${kids === 1 ? '' : 'ren'}</small>
      <div class="affection-line"><div class="meter mint"><i style="width:${affectionBar(sp.affection)}%"></i></div><b>${Math.round(sp.affection)}%</b></div>
      <div class="flex gap-6 mt-8">
        <button class="btn btn-ghost btn-xs" data-action="open-suitor" data-id="${sp.id}">${icon('eye', 11)} Visit</button>
        <button class="btn btn-primary btn-xs" data-action="try-baby" data-id="${sp.id}">${icon('baby', 11)} Child</button>
      </div>
    </div>
  </article>`;
}

function childCard(c, state) {
  const ageText = c.movedOut
    ? `Grown · married ${c.marriedTo || 'happily'}`
    : c.ageYears < 1 ? 'Newborn' : `${c.ageYears} year${c.ageYears === 1 ? '' : 's'} old`;
  const growth = c.movedOut ? 100 : Math.min(100, (c.ageYears / 18) * 100);
  const income = childIncome(state, c);
  return `<article class="child-card">
    <div class="child-face">${renderAvatar(c.profile, { alt: c.name })}</div>
    <div class="child-copy">
      <h3>${esc(c.name)} <span class="chip ${c.movedOut ? 'mint' : 'butter'}">${c.movedOut ? 'moved out' : c.gender}</span></h3>
      <small>${ageText} · ${esc(c.trait)}</small>
      ${c.movedOut ? `<div class="child-income">${icon('coins', 10)} sends home ${money(income)}/day</div>` : `<div class="child-income">${icon('coins', 10)} family stipend ${money(income)}/day</div>`}
    </div>
    <div class="child-status">
      <span>${c.movedOut ? 'Marriable' : 'At home'}</span>
      <div class="grow-meter"><i style="width:${growth}%"></i></div>
    </div>
  </article>`;
}

/* ------------------------------------------------------------------ */
/* Perks                                                               */
/* ------------------------------------------------------------------ */
export function renderPerksView(state) {
  const cards = Object.keys(PERK_DEFS).map(key => {
    const def = PERK_DEFS[key];
    const p = state.perks[key];
    const cost = perkUpgradeCost(state, key);
    const maxed = p.rank >= 20;
    const reward = prestigeReward(state, key);
    const canUpgrade = state.funds >= cost && !maxed;
    const canPrestige = maxed && p.prestige < 3;
    const effect = def.effect(p.rank, p.prestige);
    const nextEffect = def.effect(Math.min(20, p.rank + 1), p.prestige);
    return `<article class="perk-card" style="--perk:${def.color};--perk-soft:${def.soft}">
      <div class="perk-icon">${icon(def.icon, 21)}</div>
      <h3>${esc(def.name)}</h3>
      <div class="perk-sub">${esc(def.subtitle)}</div>
      <div class="perk-rank-row"><b>${p.rank}<small>/20</small></b><span class="prestige-tag">${icon('crown', 9)} Prestige ${p.prestige}/3</span></div>
      <div class="pips" aria-label="Rank ${p.rank} of 20">${Array.from({ length: 20 }, (_, i) => `<i class="${i < p.rank ? 'on' : ''}"></i>`).join('')}</div>
      <div class="perk-effect">${esc(effect)}</div>
      <div class="perk-next">${maxed ? 'Maximum rank reached. Prestige is available.' : `Next: ${esc(nextEffect)}`}</div>
      ${maxed
        ? `<button class="btn btn-violet btn-sm prestige-btn" data-action="prestige-perk" data-perk="${key}" ${!canPrestige ? 'disabled' : ''}>${icon('crown', 13)} ${p.prestige >= 3 ? 'Prestige maxed' : `Prestige for ${money(reward)}`}</button>`
        : `<button class="btn btn-cream btn-sm" data-action="upgrade-perk" data-perk="${key}" ${!canUpgrade ? 'disabled' : ''}>${icon('plus', 13)} Rank up · ${money(cost)}</button>`}
      ${maxed ? `<div class="perk-locked">${p.prestige >= 3 ? 'This perk has reached its final form.' : 'Prestige resets rank to 1, raises costs, and boosts benefits.'}</div>` : ''}
    </article>`;
  }).join('');

  return `
    <div class="view-head">
      <div class="heading-copy">
        <div class="eyebrow pink">THE LONG GAME</div>
        <h1>Perks for your <span class="script">happy ending</span>.</h1>
        <p class="sub">Twenty tiers of money-making, family-growing, heart-winning upgrades. The climb is expensive. The prestige is worth it.</p>
      </div>
      <div class="head-actions">
        <span class="chip butter">${icon('coins', 12)} ${money(state.funds)} available</span>
        <span class="chip violet">${icon('crown', 12)} prestige max 3</span>
      </div>
    </div>

    <div class="perks-hero">
      <div class="perk-hero-icon">${icon('sparkle', 24)}</div>
      <div>
        <h2>The slow, delicious climb to a very full house.</h2>
        <p>Every rank costs more than the last. Reach Rank 20 to prestige: an instant cash payout, a reset to Rank 1, higher future costs, and permanently better benefits. Three prestiges per perk.</p>
      </div>
    </div>

    <div class="perk-grid">${cards}</div>

    <div class="prestige-rules">
      <div class="pr-icon">${icon('crown', 21)}</div>
      <div>
        <h3>Prestige, explained like a friend would</h3>
        <p>At Rank 20, “Prestige” pays out a lump sum, resets that perk to Rank 1, increases its upgrade costs by 85%, and makes every rank stronger. You can do this three times per perk. There is no downside except having to climb again — and the climb is where the money is.</p>
        <div class="prestige-slots">${[0, 1, 2].map(i => `<i class="${i < Object.values(state.perks).reduce((m, p) => Math.max(m, p.prestige), 0) ? 'on' : ''}"></i>`).join('')}</div>
      </div>
    </div>`;
}

/* ------------------------------------------------------------------ */
/* Mirror / wardrobe                                                   */
/* ------------------------------------------------------------------ */
export function renderMirrorView(state) {
  const p = state.mc.profile;
  const outfit = OUTFITS.find(o => o.id === p.outfit) || OUTFITS[0];
  const hair = HAIR_STYLES.find(h => h.id === p.hair) || HAIR_STYLES[0];
  const body = BODY_TYPES.find(b => b.id === p.body) || BODY_TYPES[0];
  const eye = EYE_SHAPES.find(e => e.id === p.eye) || EYE_SHAPES[0];
  const skins = SKIN_TONES.find(s => s.id === p.skin) || SKIN_TONES[0];
  const fee = 75;
  const canChange = state.funds >= fee;
  return `
    <div class="view-head">
      <div class="heading-copy">
        <div class="eyebrow pink">THE DRESSING ROOM</div>
        <h1>Be anyone. <span class="script">Again</span>.</h1>
        <p class="sub">Hair, eyes, body, outfit, the exact tilt of a smile — change it all whenever you like. The mirror only asks for a small fee.</p>
      </div>
      <div class="head-actions">
        <span class="chip butter">${icon('coins', 12)} Makeover fee ${money(fee)}</span>
        <span class="chip mint">${icon('check', 12)} you / ${esc(state.mc.gender)}</span>
      </div>
    </div>

    <div class="mirror-layout">
      <div class="mirror-stage">
        <div class="mirror-sticker"><span class="chip">${icon('sparkle', 11)} FULLY CUSTOMIZABLE</span></div>
        ${renderAvatar(p, { alt: state.mc.name })}
      </div>
      <div class="mirror-side">
        <section class="about-card mirror-summary">
          <div class="eyebrow">YOUR REFLECTION</div>
          <h2>${esc(state.mc.name)}</h2>
          <p>${state.mc.gender === 'female' ? 'She' : 'He'} built this life from scratch. The hair can change; the ambition stays.</p>
          <div class="mirror-details">
            <div class="mirror-detail"><small>GENDER</small><b>${esc(state.mc.gender === 'female' ? 'Female' : 'Male')}</b></div>
            <div class="mirror-detail"><small>BODY</small><b>${esc(body.name)}</b></div>
            <div class="mirror-detail"><small>HAIR</small><b>${esc(hair.name)}</b></div>
            <div class="mirror-detail"><small>EYES</small><b>${esc(eye.name)}</b></div>
            <div class="mirror-detail"><small>SKIN</small><b>${esc(skins.name)}</b></div>
            <div class="mirror-detail"><small>OUTFIT</small><b>${esc(outfit.name)}</b></div>
          </div>
          <div class="outfit-shelf">
            ${[outfit, ...OUTFITS.filter(o => o.id !== outfit.id).slice(0, 3)].map(o => `<div class="shelf-item"><b style="--swatch:${o.palette[0]}"></b>${esc(o.name.split(' ')[0])}</div>`).join('')}
          </div>
        </section>

        <div class="mirror-actions">
          <button class="btn btn-primary btn-lg btn-block" data-action="open-creator" ${canChange ? '' : 'disabled'}>${icon('hanger', 17)} Open wardrobe · ${money(fee)}</button>
          <div class="change-fee">${canChange ? 'You can change every part of your look. Name changes are free.' : `You need ${money(fee - state.funds)} more for a makeover.`}</div>
        </div>

        <div class="dressing-note">
          <b>Mix, match, resize.</b> Every hairstyle, eye shape, mouth, body type, and outfit is available to every gender. Fine-tune controls let you move and resize hair, eyes, and mouth until the reflection feels like you.
        </div>
      </div>
    </div>`;
}

/* ------------------------------------------------------------------ */
/* Navigation and persistent chrome                                    */
/* ------------------------------------------------------------------ */
export function renderNav(state, mobile = false) {
  const active = state.screen === 'profile' ? 'suitors' : state.screen;
  const nav = [
    { screen: 'map', icon: 'map', label: 'Town Map', sub: '7 little places' },
    { screen: 'suitors', icon: 'heart', label: 'Hearts', sub: `${state.suitors.length} in town`, badge: state.suitors.filter(s => s.affection >= 50).length || '' },
    { screen: 'family', icon: 'family', label: 'Family', sub: `${state.spouses.length} spouses · ${state.children.length} kids`, badge: state.children.length || '' },
    { screen: 'perks', icon: 'sparkle', label: 'Perks', sub: '20 tiers each', badge: Object.values(state.perks).reduce((a, p) => a + p.prestige, 0) || '' },
    { screen: 'mirror', icon: 'hanger', label: 'Mirror', sub: 'Wardrobe & looks' }
  ];
  return nav.map(item => `
    <button class="nav-item ${active === item.screen ? 'active' : ''}" data-action="go-screen" data-screen="${item.screen}" aria-label="${item.label}">
      <span class="nav-icon">${icon(item.icon, mobile ? 21 : 17)}</span>
      <span class="nav-copy"><b>${item.label}</b><small>${item.sub}</small></span>
      ${item.badge ? `<em class="nav-badge ${item.screen === 'perks' ? 'soft' : ''}">${item.badge}</em>` : ''}
    </button>`).join('');
}

export function renderSidebarMe(state) {
  return `<div class="me-card">
    <div class="me-portrait">${renderAvatar(state.mc.profile, { alt: state.mc.name })}</div>
    <div class="me-copy">
      <small>MY LIFE</small>
      <b>${esc(state.mc.name)}</b>
      <span>${state.mc.gender === 'female' ? 'she/her' : 'he/him'} · ${state.spouses.length} spouse${state.spouses.length === 1 ? '' : 's'}</span>
    </div>
    <button class="me-edit" data-action="go-screen" data-screen="mirror" aria-label="Change appearance">${icon('hanger', 11)}</button>
  </div>`;
}

export function renderSidebarEvent(state) {
  const h = getHoliday(state.date);
  if (h) {
    return `<div class="event-mini">
      <div class="event-top"><span class="event-icon">${icon(h.icon, 15)}</span><span><b>${esc(h.name)}</b><small>${holidayDaysLeft(state.date, h)} days left</small></span></div>
      <p>${esc(h.desc)}</p>
    </div>`;
  }
  const next = nextHolidayLabel(state.date);
  return `<div class="event-mini" style="background:linear-gradient(145deg,#e9f5ee,#dcecec)">
    <div class="event-top"><span class="event-icon" style="background:#e4f4ec;color:#4d8a75">${icon(next?.holiday.icon || 'calendar', 15)}</span><span><b>${esc(next?.holiday.name || 'Quiet season')}</b><small>${next ? `in ${next.inDays} days` : 'no event scheduled'}</small></span></div>
    <p>${next ? esc(next.holiday.desc) : 'A good time to focus on the family you have.'}</p>
  </div>`;
}

/* ------------------------------------------------------------------ */
/* Right rail                                                          */
/* ------------------------------------------------------------------ */
export function renderRail(state) {
  const h = getHoliday(state.date);
  const income = dailyIncome(state);
  const dateSerial = Math.floor(Date.UTC(state.date.year, state.date.month, state.date.day) / 86400000);
  const week = Array.from({ length: 7 }, (_, i) => addDays(state.date, i - 2));
  const weekdayShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const familyAvatars = [state.mc, ...state.spouses].slice(0, 4);
  const whispers = state.stories.slice(0, 3);
  const newFaces = state.suitors.filter(s => !s.met).slice(0, 1)[0];
  const holidaySuitor = state.suitors.find(s => s.holidayId);
  const next = nextHolidayLabel(state.date);

  return `
    <section class="rail-card rail-cal">
      <div class="cal-top"><span>${MONTHS[state.date.month]} ${state.date.year}</span><span>${WEEKDAYS[new Date(Date.UTC(state.date.year, state.date.month, state.date.day)).getUTCDay()]}</span></div>
      <div class="cal-body">
        <div class="cal-day">${state.date.day}</div>
        <div class="cal-info"><b>${h ? esc(h.name) : 'A day in Maple Hollow'}</b><small>${h ? `${holidayDaysLeft(state.date, h)} days of festival left` : next ? `Next: ${esc(next.holiday.name)} in ${next.inDays}d` : 'Quiet, cozy, yours.'}</small></div>
      </div>
      <div class="cal-week">
        ${week.map(d => {
          const serial = Math.floor(Date.UTC(d.year, d.month, d.day) / 86400000);
          const isToday = serial === dateSerial;
          const event = getHoliday(d);
          return `<span>${weekdayShort[new Date(Date.UTC(d.year, d.month, d.day)).getUTCDay()]}<i class="${isToday ? 'today' : ''} ${event ? 'event' : ''}">${d.day}</i></span>`;
        }).join('')}
      </div>
    </section>

    <section class="rail-card">
      <div class="rail-head"><h3>${icon('family', 15)} Household</h3><small>${state.spouses.length + state.children.length} people</small></div>
      <div class="household-mini">
        ${familyAvatars.map(m => `<div class="mini-avatar">${renderAvatar(m.profile, { alt: m.name })}</div>`).join('')}
        ${state.spouses.length + state.children.length > 4 ? `<div class="mini-more">+${state.spouses.length + state.children.length - 4}</div>` : ''}
      </div>
      <div class="household-line"><span>Daily income</span><b>${money(income)}</b></div>
      <div class="household-line"><span>Spouses</span><b>${state.spouses.length}</b></div>
      <div class="household-line"><span>Children</span><b>${state.children.length}</b></div>
      <div class="household-line"><span>Energy</span><b>${Math.round(state.sleep)} / 100</b></div>
    </section>

    <section class="rail-card">
      <div class="rail-head"><h3>${icon('chat', 15)} Town whispers</h3><small>today</small></div>
      ${whispers.length ? whispers.map(story => `<div class="whisper"><span class="w-dot"></span><span>${esc(story.text)}<br><small style="font-size:7.5px;color:var(--ink-faint)">${esc(story.date)}</small></span></div>`).join('') : `
        <div class="whisper"><span class="w-dot"></span><span><b>It’s your first day.</b> Everyone is curious about the new face on Petal Lane.</span></div>
        <div class="whisper"><span class="w-dot"></span><span><b>Tip:</b> Flirt or give a gift to count as “spoken to.” Otherwise a new face can drift away.</span></div>
      `}
      ${newFaces ? `<button class="text-btn" style="margin-top:5px" data-action="open-suitor" data-id="${newFaces.id}">Meet ${esc(newFaces.name)} →</button>` : ''}
    </section>

    ${h ? `
      <section class="rail-card" style="background:linear-gradient(150deg,#fff8e6,${h.blush});border-color:${h.color}55">
        <div class="rail-head"><h3>${icon(h.icon, 15)} ${esc(h.name)}</h3><small>${holidayDaysLeft(state.date, h)}d</small></div>
        <p>${esc(h.desc)}</p>
        ${holidaySuitor ? `<div class="household-line" style="margin-top:5px"><span>Special visitor</span><b>${esc(holidaySuitor.name)}</b></div>` : ''}
        <button class="btn btn-cream btn-sm btn-block" style="margin-top:8px" data-action="open-holiday">${icon('calendar', 13)} Festival details</button>
      </section>
    ` : `
      <section class="rail-card rail-adventure">
        <div class="rail-head"><h3>${icon('sun', 15)} A little nudge</h3><small>free advice</small></div>
        <p>Dates unlock at 28% affection. Proposals at 72%. Flirting is random — gifts are a guarantee.</p>
        <button class="btn btn-mint btn-sm btn-block" data-action="go-screen" data-screen="suitors">${icon('heart', 13)} Visit the hearts</button>
      </section>
    `}

    <section class="rail-card">
      <div class="rail-head"><h3>${icon('coins', 15)} Money moves</h3><small>${money(state.funds)}</small></div>
      <p>Perks pay out every morning. Spouses and children add to the pot. A café shift earns quick cash.</p>
      <button class="btn btn-ghost btn-sm btn-block" style="margin-top:7px" data-action="go-screen" data-screen="perks">${icon('sparkle', 13)} Grow your perks</button>
    </section>
  `;
}

export function renderHolidayModalPeople(state) {
  const h = getHoliday(state.date);
  if (!h) return '';
  return state.suitors.filter(s => s.holidayId === h.id).map(s => `
    <button class="holiday-person" data-action="open-suitor" data-id="${s.id}" style="text-align:left">
      <span class="hp-face">${renderAvatar(s.profile, { alt: s.name })}</span>
      <span><b>${esc(s.name)}</b><small>${esc(s.species)} · ${esc(s.personalityName)}</small></span>
    </button>`).join('');
}
