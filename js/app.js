// Maple Hollow — game runtime, time loop, relationships, family, and UI wiring.
import {
  SAVE_KEY, GAME_VERSION, LOCATIONS, LOCATION_BY_ID, GIFTS, GIFT_BY_ID,
  OUTFITS, HAIR_STYLES, HAIR_COLORS, SKIN_TONES, EYE_SHAPES, EYE_COLORS,
  MOUTHS, BODY_TYPES, ACCESSORIES, SPECIES, PERSONALITIES, HOLIDAYS,
  MARRIAGE_VOWS, DIALOGUE, WEEKDAYS, MONTHS_SHORT,
  createInitialState, makeMC, makeSuitor, makeChild, defaultProfile, randomProfile,
  spawnHolidaySuitors, ensureBasePopulation, dailyIncome, childIncome,
  perkUpgradeCost, prestigeReward, dateCost, ringCost, conceptionChance,
  addDays, serialToDate, dateToSerial, getHoliday, holidayDaysLeft,
  nextHolidayLabel, formatMoney, timeLabel, dayPhase, pushStory,
  clamp, rand, pick, monthLabel, dateLabel, shortDate
} from './data.js';
import { renderAvatar } from './avatar.js';
import { icon } from './icons.js';
import {
  renderMapView, renderSuitorsView, renderProfileView, renderFamilyView,
  renderPerksView, renderMirrorView, renderNav, renderSidebarMe,
  renderSidebarEvent, renderRail, renderHolidayModalPeople, esc
} from './render.js';

/* ------------------------------------------------------------------ */
/* Elements and small UI state                                         */
/* ------------------------------------------------------------------ */
const els = {
  splash: document.getElementById('splash'),
  game: document.getElementById('game'),
  view: document.getElementById('view'),
  mainScroll: document.getElementById('mainScroll'),
  overlay: document.getElementById('overlayRoot'),
  toasts: document.getElementById('toastRoot'),
  confetti: document.getElementById('confettiRoot'),
  navList: document.getElementById('navList'),
  mobileNav: document.getElementById('mobileNav'),
  sidebarMe: document.getElementById('sidebarMe'),
  sidebarEvent: document.getElementById('sidebarEvent'),
  rightRail: document.getElementById('rightRail'),
  heroCast: document.getElementById('heroCast'),
  startBtn: document.getElementById('startBtn'),
  continueBtn: document.getElementById('continueBtn'),
  funds: document.getElementById('hudFunds'),
  hudDate: document.getElementById('hudDate'),
  hudTime: document.getElementById('hudTime'),
  hudPhaseIcon: document.getElementById('hudPhaseIcon'),
  energyBar: document.getElementById('hudEnergyBar'),
  energyText: document.getElementById('hudEnergy'),
  saveIcon: document.getElementById('saveIcon'),
  soundIcon: document.getElementById('soundIcon'),
  fullIcon: document.getElementById('fullIcon')
};

const ui = {
  filter: 'all',
  activeId: null,
  creator: null,
  sound: localStorage.getItem('mapleHollow.sound') !== 'off',
  pendingNightPrompt: false,
  modal: { dismissible: true, kind: '' }
};

let state = null;
let audioCtx = null;
let toastId = 0;

const MAKEOVER_FEE = 75;
const SOUND_KEY = 'mapleHollow.sound';
const FEMALE_MARRIED_NAMES = ['Juniper', 'Rowan', 'Sage', 'Wren', 'Aster', 'Marlow', 'Clover', 'Elio'];
const MALE_MARRIED_NAMES = ['Juniper', 'Rowan', 'Sage', 'Wren', 'Aster', 'Marlow', 'Clover', 'Elio'];
const DATE_OPTIONS = [
  { id: 'coffee', name: 'Coffee & a long walk', desc: 'A café table, a winding lane, and nowhere else to be.', icon: 'cup', extra: 0, time: 90, energy: 7, min: 8, max: 13, soft: '#ffe8ef', ink: '#b9476d' },
  { id: 'arcade', name: 'Pixel Palace showdown', desc: 'Loser buys slushies. Winner gets bragging rights and a blush.', icon: 'game', extra: 15, time: 120, energy: 9, min: 11, max: 16, soft: '#e8ecff', ink: '#5164a8' },
  { id: 'beach', name: 'Sea-glass picnic', desc: 'Salt air, a blanket, and the kind of quiet that feels enormous.', icon: 'shell', extra: 30, time: 180, energy: 11, min: 14, max: 20, soft: '#e2f6f7', ink: '#2d7d8c' },
  { id: 'dinner', name: 'Moonlight dinner', desc: 'Star Plaza after dark, tiny candles, and one very brave question.', icon: 'star', extra: 55, time: 210, energy: 13, min: 18, max: 24, soft: '#fff0cf', ink: '#a26c1c' }
];

/* ------------------------------------------------------------------ */
/* Small utilities                                                     */
/* ------------------------------------------------------------------ */
const isNightTime = (minute = state?.minute ?? 0) => minute >= 23 * 60 || minute < 5 * 60;
const atNight = () => isNightTime();
const money = n => formatMoney(n);
const personById = id => state ? (state.suitors.find(s => s.id === id) || state.spouses.find(s => s.id === id) || null) : null;
const personalityOf = s => PERSONALITIES.find(p => p.id === s.personality) || PERSONALITIES[0];
const firstName = name => String(name || 'Avery').trim().split(/\s+/)[0] || 'Avery';
const pronoun = gender => gender === 'female' ? 'she' : 'he';
const pronounObj = gender => gender === 'female' ? 'her' : 'him';
const possessive = gender => gender === 'female' ? 'her' : 'his';
const hasModal = () => Boolean(els.overlay.querySelector('.modal-wrap'));

/* ------------------------------------------------------------------ */
/* Sound                                                               */
/* ------------------------------------------------------------------ */
function updateSoundIcon() {
  els.soundIcon.innerHTML = icon(ui.sound ? 'sound' : 'mute', 18);
  document.querySelector('[data-action="toggle-sound"]')?.classList.toggle('muted', !ui.sound);
}

function playTone(kind = 'tap') {
  if (!ui.sound) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioCtx = audioCtx || new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const notes = kind === 'wed' ? [523.25, 659.25, 783.99, 1046.5]
      : kind === 'prestige' ? [392, 523.25, 659.25, 880]
        : kind === 'baby' ? [659.25, 783.99, 987.77]
          : kind === 'bad' ? [220, 185]
            : kind === 'date' ? [523.25, 659.25]
              : [660];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const t = audioCtx.currentTime + i * (kind === 'tap' ? 0 : 0.075);
      osc.type = kind === 'bad' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.035, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  } catch { /* Sound is a bonus, never a blocker. */ }
}

/* ------------------------------------------------------------------ */
/* Toasts, confetti, modals                                            */
/* ------------------------------------------------------------------ */
function toast(title, text = '', tone = '', iconName = 'heart') {
  const el = document.createElement('div');
  el.className = `toast ${tone}`;
  el.style.animationDelay = '0s, 3.55s';
  el.dataset.toast = String(++toastId);
  el.innerHTML = `<span class="toast-icon">${icon(iconName, 16)}</span><span><b>${esc(title)}</b><span>${esc(text)}</span></span>`;
  els.toasts.appendChild(el);
  while (els.toasts.children.length > 4) els.toasts.firstElementChild.remove();
  window.setTimeout(() => el.remove(), 4100);
}

function burstConfetti(count = 90) {
  if (!els.confetti) return;
  const colors = ['#f28aa8', '#f6cf70', '#86c9b7', '#9280ce', '#ffb49e', '#ffffff', '#e56b92'];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('i');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = pick(colors);
    piece.style.setProperty('--drift', `${rand(-90, 90)}px`);
    piece.style.setProperty('--rot', `${rand(-60, 60)}deg`);
    piece.style.setProperty('--dur', `${(2.1 + Math.random() * 1.7).toFixed(2)}s`);
    piece.style.animationDelay = `${(Math.random() * 0.45).toFixed(2)}s`;
    frag.appendChild(piece);
  }
  els.confetti.appendChild(frag);
  window.setTimeout(() => { if (els.confetti) els.confetti.innerHTML = ''; }, 4200);
}

function openModal({
  title = '', subtitle = '', body = '', footer = '', size = '', className = '',
  topHTML = '', dismissible = true, kind = ''
} = {}) {
  const closeBtn = dismissible ? `<button class="modal-close" data-action="close-modal" aria-label="Close">${icon('close', 17)}</button>` : '';
  const top = topHTML || `<div class="modal-top"><div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div>${closeBtn}</div>`;
  els.overlay.innerHTML = `
    <div class="modal-wrap">
      <div class="modal ${size} ${className}" role="dialog" aria-modal="true" aria-label="${esc(title || 'Maple Hollow')}">
        <div class="ribbon"></div>
        ${top}
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    </div>`;
  ui.modal = { dismissible, kind };
  document.body.classList.add('locked');
  const focusable = els.overlay.querySelector('.modal-footer .btn, .modal-footer button, .modal-close');
  if (focusable) window.setTimeout(() => focusable.focus({ preventScroll: true }), 30);
}

function clearOverlay() {
  if (els.overlay) els.overlay.innerHTML = '';
  ui.modal = { dismissible: true, kind: '' };
  if (!ui.creator) document.body.classList.remove('locked');
}

function closeModal({ quiet = false } = {}) {
  const wasWelcome = hasModal() && state && !state.introSeen;
  clearOverlay();
  if (wasWelcome) {
    state.introSeen = true;
    persist();
  }
  if (!quiet) maybeShowNightPrompt();
}

function maybeShowNightPrompt() {
  if (!ui.pendingNightPrompt || !state || ui.creator || hasModal()) return;
  ui.pendingNightPrompt = false;
  openNightPrompt();
}

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */
function persist(showFeedback = false) {
  if (!state) return false;
  try {
    state.activeId = ui.activeId;
    state.filter = ui.filter;
    state.lastSaved = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    if (showFeedback) toast('Saved', 'Your little life is safe in this browser.', 'mint', 'save');
    return true;
  } catch {
    if (showFeedback) toast('Could not save', 'Browser storage is unavailable right now.', 'night', 'alert');
    return false;
  }
}

function rawSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function hydrate(raw) {
  if (!raw || !raw.mc || !Array.isArray(raw.suitors) || !raw.date) return null;
  const s = raw;
  s.version = s.version || GAME_VERSION;
  s.date = {
    year: Number(s.date.year) || 2003,
    month: Number(s.date.month) || 0,
    day: Number(s.date.day) || 1
  };
  s.daySerial = Number.isFinite(s.daySerial) ? s.daySerial : dateToSerial(s.date);
  s.minute = Number.isFinite(s.minute) ? s.minute : 9 * 60;
  s.funds = Number.isFinite(s.funds) ? s.funds : 500;
  s.sleep = Number.isFinite(s.sleep) ? clamp(s.sleep, 0, 100) : 100;
  s.sleepDebt = Number.isFinite(s.sleepDebt) ? s.sleepDebt : 0;
  s.location = LOCATION_BY_ID[s.location] ? s.location : 'cafe';
  s.screen = ['map', 'suitors', 'family', 'perks', 'mirror', 'profile'].includes(s.screen) ? s.screen : 'map';
  s.stories = Array.isArray(s.stories) ? s.stories : [];
  s.notifications = Array.isArray(s.notifications) ? s.notifications : [];
  s.holidaySpawned = Array.isArray(s.holidaySpawned) ? s.holidaySpawned : [];
  s.suitors = s.suitors.filter(x => x && x.id);
  s.spouses = Array.isArray(s.spouses) ? s.spouses.filter(x => x && x.id) : [];
  s.children = Array.isArray(s.children) ? s.children.filter(x => x && x.id) : [];
  s.nextId = Number.isFinite(s.nextId) ? s.nextId : 1000;
  s.stats = { flirts: 0, gifts: 0, dates: 0, proposals: 0, weddings: 0, children: 0, incomeEarned: 0, ...(s.stats || {}) };
  s.perks = {
    money: { rank: 1, prestige: 0, ...(s.perks?.money || {}) },
    family: { rank: 1, prestige: 0, ...(s.perks?.family || {}) },
    charm: { rank: 1, prestige: 0, ...(s.perks?.charm || {}) }
  };
  Object.values(s.perks).forEach(p => {
    p.rank = clamp(Number(p.rank) || 1, 1, 20);
    p.prestige = clamp(Number(p.prestige) || 0, 0, 3);
  });
  s.mc = s.mc || makeMC('female', 'Avery');
  s.mc.gender = s.mc.gender === 'male' ? 'male' : 'female';
  s.mc.profile = { ...defaultProfile(s.mc.gender), ...(s.mc.profile || {}), gender: s.mc.gender };
  s.suitors.forEach(su => {
    su.gender = su.gender === 'male' ? 'male' : 'female';
    su.profile = { ...defaultProfile(su.gender), ...(su.profile || {}), gender: su.gender };
    su.affection = clamp(Number(su.affection) || 0, 0, 100);
    su.age = Number(su.age) || 24;
    su.personality = su.personality || pick(PERSONALITIES).id;
    su.personalityName = PERSONALITIES.find(p => p.id === su.personality)?.name || 'Sunshine';
    su.met = Boolean(su.met);
    su.ignored = Number(su.ignored) || 0;
    su.flirtCount = Number(su.flirtCount) || 0;
    su.giftCount = Number(su.giftCount) || 0;
    su.dateCount = Number(su.dateCount) || 0;
    su.location = LOCATION_BY_ID[su.location] ? su.location : 'cafe';
    su.holidayId = su.holidayId || null;
    su.temporary = Boolean(su.temporary || su.holidayId);
    su.married = false;
    su.lastLine = su.lastLine || '';
    su.bio = su.bio || '';
    su.species = su.species || su.profile.species || 'Human';
  });
  s.spouses.forEach(sp => {
    sp.gender = sp.gender === 'male' ? 'male' : 'female';
    sp.profile = { ...defaultProfile(sp.gender), ...(sp.profile || {}), gender: sp.gender };
    sp.affection = clamp(Number(sp.affection) || 0, 0, 100);
    sp.married = true;
    sp.holidayId = null;
    sp.ignored = 0;
    sp.met = true;
    sp.personality = sp.personality || pick(PERSONALITIES).id;
    sp.personalityName = PERSONALITIES.find(p => p.id === sp.personality)?.name || 'Sunshine';
    sp.lastLine = sp.lastLine || '';
  });
  s.children.forEach(c => {
    c.profile = { ...defaultProfile(c.gender === 'male' ? 'male' : 'female'), ...(c.profile || {}) };
    c.ageYears = Number(c.ageYears) || 0;
    c.monthsOld = Number(c.monthsOld) || 0;
    c.movedOut = Boolean(c.movedOut);
    c.marriedTo = c.marriedTo || null;
    c.parents = Array.isArray(c.parents) ? c.parents : [];
  });
  s.lastIncomeSerial = Number.isFinite(s.lastIncomeSerial) ? s.lastIncomeSerial : s.daySerial;
  s.lastMorningIncome = Number(s.lastMorningIncome) || 0;
  s.nightPromptedSerial = Number(s.nightPromptedSerial) || 0;
  s.moonlightSerial = Number(s.moonlightSerial) || 0;
  s.napsToday = Number(s.napsToday) || 0;
  s.activeId = s.activeId || null;
  s.filter = ['all', 'women', 'men', 'holiday', 'met'].includes(s.filter) ? s.filter : 'all';
  if (s.screen === 'profile' && !s.suitors.concat(s.spouses).some(x => x.id === s.activeId)) s.screen = 'suitors';
  return s;
}

function loadGame() {
  return hydrate(rawSave());
}

/* ------------------------------------------------------------------ */
/* Splash                                                              */
/* ------------------------------------------------------------------ */
function heroProfiles() {
  const saved = rawSave();
  if (saved?.mc?.profile) {
    const women = (saved.suitors || []).filter(s => s.gender === 'female');
    const men = (saved.suitors || []).filter(s => s.gender === 'male');
    const cast = [women[1] || women[0], saved.mc, women[0] || women[1], men[0] || women[2]];
    return cast.filter(Boolean).slice(0, 4).map((p, i) => {
      if (i === 1 && p === saved.mc) return { name: saved.mc.name || 'You', role: 'the new neighbor', profile: saved.mc.profile };
      return { name: p.name || 'Someone lovely', role: p.species ? `${p.species.replace(' demi-human', '')} · ${p.occupation || 'townsfolk'}` : 'townsfolk', profile: p.profile };
    });
  }
  return [
    {
      name: 'Elara', role: 'elf · florist',
      profile: defaultProfile('female', { skin: 'honey', hair: 'wavy', hairColor: 'auburn', eye: 'dreamy', eyeColor: 'jade', mouth: 'smile', outfit: 'cardigan', species: 'Elf', accessory: 'earrings' })
    },
    {
      name: 'Avery', role: 'you, maybe',
      profile: defaultProfile('female', { skin: 'peach', hair: 'long', hairColor: 'cottonCandy', eye: 'round', eyeColor: 'rose', mouth: 'grin', outfit: 'y2k', species: 'Human', accessory: 'headband' })
    },
    {
      name: 'Mina', role: 'cat · barista',
      profile: defaultProfile('female', { skin: 'caramel', hair: 'twin', hairColor: 'ink', eye: 'sharp', eyeColor: 'gold', mouth: 'cat', outfit: 'y2k', species: 'Cat demi-human', accessory: 'beauty' })
    },
    {
      name: 'Ren', role: 'record shop clerk',
      profile: defaultProfile('male', { skin: 'porcelain', hair: 'wolf', hairColor: 'espresso', eye: 'almond', eyeColor: 'ocean', mouth: 'smirk', outfit: 'hoodie', species: 'Human', accessory: 'none' })
    }
  ];
}

function renderHeroCast() {
  if (!els.heroCast) return;
  els.heroCast.innerHTML = heroProfiles().map(p => `
    <div class="hero-person">
      <div class="hero-portrait">${renderAvatar(p.profile, { alt: p.name })}</div>
      <span class="name-tag">${esc(p.name)} <small>${esc(p.role)}</small></span>
    </div>`).join('');
}

function refreshContinue() {
  const saved = rawSave();
  els.continueBtn.hidden = !saved;
  els.continueBtn.disabled = !saved;
}

function showSplash() {
  clearOverlay();
  if (ui.creator) {
    ui.creator = null;
  }
  document.body.classList.remove('locked');
  els.splash.hidden = false;
  els.game.hidden = true;
  renderHeroCast();
  refreshContinue();
}

/* ------------------------------------------------------------------ */
/* Character creator                                                   */
/* ------------------------------------------------------------------ */
function openCreator(mode = 'new') {
  const base = mode === 'makeover' && state ? state.mc.profile : randomProfile('female');
  const gender = mode === 'makeover' && state ? state.mc.gender : base.gender || 'female';
  ui.creator = {
    mode,
    tab: 'basics',
    draft: {
      ...defaultProfile(gender),
      ...base,
      gender,
      hairX: Number(base.hairX) || 0,
      hairY: Number(base.hairY) || 0,
      hairScale: Number(base.hairScale) || 1,
      eyeX: Number(base.eyeX) || 0,
      eyeY: Number(base.eyeY) || 0,
      eyeScale: Number(base.eyeScale) || 1,
      mouthX: Number(base.mouthX) || 0,
      mouthY: Number(base.mouthY) || 0,
      mouthScale: Number(base.mouthScale) || 1,
      bodyScale: Number(base.bodyScale) || 1,
      name: mode === 'makeover' && state ? state.mc.name : 'Avery'
    }
  };
  if (mode === 'new') {
    els.splash.hidden = true;
    els.game.hidden = true;
  }
  clearOverlay();
  document.body.classList.add('locked');
  renderCreator();
}

function closeCreator() {
  if (!ui.creator) return;
  const wasNew = ui.creator.mode === 'new';
  ui.creator = null;
  clearOverlay();
  document.body.classList.remove('locked');
  if (wasNew) {
    showSplash();
  } else if (state) {
    renderAll();
  }
}

function updateCreatorPreview() {
  if (!ui.creator) return;
  const d = ui.creator.draft;
  const preview = els.overlay.querySelector('.creator-preview');
  if (preview) preview.innerHTML = renderAvatar(d, { alt: d.name || 'Your new look' });
  const name = els.overlay.querySelector('.creator-nameplate b');
  const meta = els.overlay.querySelector('.creator-nameplate small');
  if (name) name.textContent = d.name || 'Avery';
  if (meta) meta.textContent = `${d.gender === 'female' ? 'she/her' : 'he/him'} · ${speciesLabel(d.species)}`;
}

function speciesLabel(id) {
  return (SPECIES.find(s => s.id === id) || SPECIES[0]).label;
}

function formatRangeValue(key, value) {
  const n = Number(value);
  if (key.endsWith('Scale')) return `${n.toFixed(2)}×`;
  return `${n > 0 ? '+' : ''}${Math.round(n)}`;
}

function sliderMarkup(key, label, min, max, step, value) {
  return `<div class="creator-slider">
    <div class="slider-label"><span>${label}</span><b data-slider-value="${key}">${formatRangeValue(key, value)}</b></div>
    <input type="range" data-range="${key}" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${label}" />
  </div>`;
}

function tunerMarkup(title, iconName, sliders) {
  return `<div class="part-tuner">
    <div class="part-tuner-title">${icon(iconName, 13)} ${title}</div>
    ${sliders}
  </div>`;
}

function creatorTabMarkup() {
  const d = ui.creator.draft;
  const hairColor = HAIR_COLORS.find(c => c.id === d.hairColor) || HAIR_COLORS[0];
  const tab = ui.creator.tab;

  if (tab === 'basics') {
    return `
      <div class="creator-group">
        <div class="creator-group-title"><label>Gender</label><em>male or female</em></div>
        <div class="creator-gender-grid">
          <button type="button" class="gender-card ${d.gender === 'female' ? 'active' : ''}" data-action="creator-gender" data-gender="female">
            <span class="gender-symbol">♀</span><span><b>Female</b><small>she / her</small></span><span class="check-dot"></span>
          </button>
          <button type="button" class="gender-card male ${d.gender === 'male' ? 'active' : ''}" data-action="creator-gender" data-gender="male">
            <span class="gender-symbol">♂</span><span><b>Male</b><small>he / him</small></span><span class="check-dot"></span>
          </button>
        </div>
      </div>
      <div class="creator-group">
        <div class="creator-group-title"><label>Name</label><em>free to change later</em></div>
        <div class="creator-name-row">
          <input id="creatorName" class="input creator-name-input" type="text" maxlength="24" value="${esc(d.name)}" placeholder="Avery" autocomplete="given-name" aria-label="Your name" />
          <button type="button" class="randomize-btn" data-action="creator-random">${icon('sparkle', 14)} Random look</button>
        </div>
      </div>
      <div class="creator-group">
        <div class="creator-group-title"><label>Skin tone</label><em>eight shades</em></div>
        <div class="swatch-grid">${SKIN_TONES.map(t => `<button type="button" class="swatch skin ${d.skin === t.id ? 'active' : ''}" data-action="creator-pick" data-key="skin" data-value="${t.id}" style="background:linear-gradient(145deg, ${t.base}, ${t.shade});" title="${esc(t.name)}" aria-label="${esc(t.name)}"></button>`).join('')}</div>
      </div>
      <div class="creator-group">
        <div class="creator-group-title"><label>Heritage</label><em>cosmetic, always welcome</em></div>
        <div class="option-grid">${SPECIES.map(sp => `<button type="button" class="option-btn ${d.species === sp.id ? 'active' : ''}" data-action="creator-pick" data-key="species" data-value="${sp.id}">${esc(sp.label)}</button>`).join('')}</div>
      </div>
      <div class="creator-tip">${icon('heart', 14)} <span><b>Everything is for every gender.</b> Hair, outfits, bodies, and all the little face parts are open to you — mix them however you like.</span></div>`;
  }

  if (tab === 'face') {
    return `
      <div class="creator-group">
        <div class="creator-group-title"><label>Eye shape</label><em>${EYE_SHAPES.length} shapes</em></div>
        <div class="option-grid">${EYE_SHAPES.map(e => `<button type="button" class="option-btn ${d.eye === e.id ? 'active' : ''}" data-action="creator-pick" data-key="eye" data-value="${e.id}">${esc(e.name)}</button>`).join('')}</div>
      </div>
      <div class="creator-group">
        <div class="creator-group-title"><label>Eye color</label><em>bright &amp; early-2000s</em></div>
        <div class="swatch-grid">${EYE_COLORS.map(c => `<button type="button" class="swatch ${d.eyeColor === c.id ? 'active' : ''}" data-action="creator-pick" data-key="eyeColor" data-value="${c.id}" style="background:linear-gradient(145deg, ${c.light}, ${c.base});" title="${esc(c.name)}" aria-label="${esc(c.name)}"></button>`).join('')}</div>
      </div>
      <div class="creator-group">
        <div class="creator-group-title"><label>Mouth</label><em>pick your default expression</em></div>
        <div class="option-grid">${MOUTHS.map(m => `<button type="button" class="option-btn ${d.mouth === m.id ? 'active' : ''}" data-action="creator-pick" data-key="mouth" data-value="${m.id}">${esc(m.name)}</button>`).join('')}</div>
      </div>
      <div class="creator-group">
        <div class="creator-group-title"><label>Little extras</label><em>accessories</em></div>
        <div class="option-grid">${ACCESSORIES.map(a => `<button type="button" class="option-btn ${d.accessory === a.id ? 'active' : ''}" data-action="creator-pick" data-key="accessory" data-value="${a.id}">${esc(a.name)}</button>`).join('')}</div>
      </div>
      <div class="creator-tip">${icon('eye', 14)} <span>Want a lopsided smile or eyes a little wider apart? The <b>Fine-tune</b> tab moves and resizes every feature.</span></div>`;
  }

  if (tab === 'hair') {
    return `
      <div class="creator-group">
        <div class="creator-group-title"><label>Hair style</label><em>${HAIR_STYLES.length} looks</em></div>
        <div class="hair-grid">${HAIR_STYLES.map(h => `<button type="button" class="hair-btn ${d.hair === h.id ? 'active' : ''}" data-action="creator-pick" data-key="hair" data-value="${h.id}" style="--hair:${hairColor.base};--mini:${hairColor.light}"><span class="hair-mini"></span><span>${esc(h.name)}</span></button>`).join('')}</div>
      </div>
      <div class="creator-group">
        <div class="creator-group-title"><label>Hair color</label><em>dye it any color</em></div>
        <div class="swatch-grid">${HAIR_COLORS.map(c => `<button type="button" class="swatch ${d.hairColor === c.id ? 'active' : ''}" data-action="creator-pick" data-key="hairColor" data-value="${c.id}" style="background:linear-gradient(145deg, ${c.light}, ${c.base} 55%, ${c.shade});" title="${esc(c.name)}" aria-label="${esc(c.name)}"></button>`).join('')}</div>
      </div>
      <div class="creator-tip">${icon('sparkle', 14)} <span><b>Hair can be moved, too.</b> Use Fine-tune to shift the whole hairstyle up, down, left, right, or resize it.</span></div>`;
  }

  if (tab === 'style') {
    return `
      <div class="creator-group">
        <div class="creator-group-title"><label>Body type</label><em>all available to everyone</em></div>
        <div class="option-grid">${BODY_TYPES.map(b => `<button type="button" class="option-btn ${d.body === b.id ? 'active' : ''}" data-action="creator-pick" data-key="body" data-value="${b.id}">${esc(b.name)}</button>`).join('')}</div>
      </div>
      <div class="creator-group">
        <div class="creator-group-title"><label>Outfit</label><em>${OUTFITS.length} pieces</em></div>
        <div class="option-grid">${OUTFITS.map(o => `<button type="button" class="option-btn ${d.outfit === o.id ? 'active' : ''}" data-action="creator-pick" data-key="outfit" data-value="${o.id}"><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${o.palette[0]};margin-right:4px"></i>${esc(o.name)}</button>`).join('')}</div>
      </div>
      <div class="creator-group">
        <div class="creator-tip">${icon('hanger', 14)} <span>Outfits are just for the portrait — your story stays yours. Change your whole wardrobe anytime at the mirror for <b>$${MAKEOVER_FEE}</b>.</span></div>
      </div>`;
  }

  return `
    <div class="creator-group">
      <div class="creator-group-title"><label>Fine-tune features</label><em>move &amp; resize</em></div>
      ${tunerMarkup('Hair', 'sparkle', [
        sliderMarkup('hairX', 'Hair sideways', -20, 20, 1, d.hairX),
        sliderMarkup('hairY', 'Hair up / down', -20, 20, 1, d.hairY),
        sliderMarkup('hairScale', 'Hair size', 0.8, 1.25, 0.01, d.hairScale)
      ])}
      ${tunerMarkup('Eyes', 'eye', [
        sliderMarkup('eyeX', 'Eyes sideways', -14, 14, 1, d.eyeX),
        sliderMarkup('eyeY', 'Eyes up / down', -14, 14, 1, d.eyeY),
        sliderMarkup('eyeScale', 'Eye size', 0.8, 1.3, 0.01, d.eyeScale)
      ])}
      ${tunerMarkup('Mouth', 'chat', [
        sliderMarkup('mouthX', 'Mouth sideways', -14, 14, 1, d.mouthX),
        sliderMarkup('mouthY', 'Mouth up / down', -14, 14, 1, d.mouthY),
        sliderMarkup('mouthScale', 'Mouth size', 0.75, 1.35, 0.01, d.mouthScale)
      ])}
      ${tunerMarkup('Body', 'hanger', [
        sliderMarkup('bodyScale', 'Body width', 0.88, 1.14, 0.01, d.bodyScale)
      ])}
      <button type="button" class="btn btn-ghost btn-sm btn-block" data-action="creator-reset-tune">${icon('sparkle', 13)} Reset all fine-tuning</button>
    </div>
    <div class="creator-tip">${icon('alert', 14)} <span>Sliders only affect your portrait. You can come back and change any of it later.</span></div>`;
}

function creatorHTML() {
  const c = ui.creator;
  const d = c.draft;
  const isMakeover = c.mode === 'makeover';
  const canAfford = !isMakeover || (state && state.funds >= MAKEOVER_FEE);
  const feeChip = isMakeover
    ? `<span class="creator-fee-chip">${icon('coins', 12)} Makeover · ${money(MAKEOVER_FEE)} — ${money(state?.funds || 0)} on hand</span>`
    : `<span class="creator-fee-chip">${icon('sparkle', 12)} New life · free</span>`;
  const tabs = [
    ['basics', 'Basics'], ['face', 'Face'], ['hair', 'Hair'], ['style', 'Style'], ['tune', 'Fine-tune']
  ];

  return `<div class="creator-overlay" role="dialog" aria-modal="true" aria-label="Character creator">
    <header class="creator-top">
      <div class="creator-top-left">
        <span class="brand-mark"><span class="brand-heart">♥</span></span>
        <div class="creator-title"><small>${isMakeover ? 'THE DRESSING ROOM' : 'A SECOND-SPRING STORY'}</small><b>${isMakeover ? 'Change your look' : 'Make yourself at home'}</b></div>
      </div>
      <div class="creator-top-right">
        ${feeChip}
        <button type="button" class="creator-close" data-action="creator-close" aria-label="${isMakeover ? 'Cancel makeover' : 'Back to title'}">${icon('close', 17)}</button>
      </div>
    </header>

    <div class="creator-shell">
      <div class="creator-stage">
        <div class="creator-halo" aria-hidden="true"></div>
        <div class="creator-preview">${renderAvatar(d, { alt: d.name || 'Your new look' })}</div>
        <div class="creator-stage-card">
          <div class="creator-nameplate"><small>${d.gender === 'female' ? 'she / her' : 'he / him'} · ${esc(speciesLabel(d.species))}</small><b>${esc(d.name || 'Avery')}</b></div>
          <span class="creator-ring-note">${icon('heart', 11)} portrait, not a promise</span>
        </div>
      </div>

      <section class="creator-panel">
        <div class="creator-panel-top">
          <div class="eyebrow pink">${isMakeover ? 'MIRROR, MIRROR' : 'FRESH OUT OF COLLEGE'}</div>
          <h2>${isMakeover ? 'Same you. New sparkle.' : `Hello, ${esc(firstName(d.name))}.`}</h2>
          <p>${isMakeover ? 'Every part of your look can change. The fee is charged when you apply it.' : 'Pick a name, a face, a favorite outfit — then step into a town full of people who might just be your future.'}</p>
        </div>
        <div class="creator-tabs">
          ${tabs.map(([id, label]) => `<button type="button" class="creator-tab ${c.tab === id ? 'active' : ''}" data-action="creator-tab" data-tab="${id}">${label}</button>`).join('')}
        </div>
        <div class="creator-controls">${creatorTabMarkup()}</div>
        <div class="creator-panel-foot">
          <div class="creator-foot-note"><b>${isMakeover ? `${money(MAKEOVER_FEE)} from your funds` : 'Starts with $500'}</b><br>${isMakeover ? 'Names are free. Every body is beautiful.' : 'Autosaves after you begin.'}</div>
          <button type="button" class="btn btn-primary" data-action="creator-finish" ${canAfford ? '' : 'disabled'}>${icon(isMakeover ? 'hanger' : 'heart', 16)} ${isMakeover ? `Apply makeover · ${money(MAKEOVER_FEE)}` : 'Begin my life'}</button>
        </div>
      </section>
    </div>
  </div>`;
}

function renderCreator({ scroll = null } = {}) {
  if (!ui.creator) return;
  const oldControls = els.overlay.querySelector('.creator-controls');
  const keepScroll = oldControls ? oldControls.scrollTop : 0;
  els.overlay.innerHTML = creatorHTML();
  document.body.classList.add('locked');
  const controls = els.overlay.querySelector('.creator-controls');
  if (controls) controls.scrollTop = scroll === 0 ? 0 : keepScroll;
}

function handleCreatorAction(action, el) {
  const c = ui.creator;
  if (!c) return;
  if (action === 'creator-close') {
    closeCreator();
    return;
  }
  if (action === 'creator-tab') {
    c.tab = el.dataset.tab || 'basics';
    renderCreator({ scroll: 0 });
    return;
  }
  if (action === 'creator-gender') {
    const gender = el.dataset.gender === 'male' ? 'male' : 'female';
    c.draft.gender = gender;
    c.draft.hair = c.draft.hair || (gender === 'female' ? 'long' : 'spiky');
    renderCreator();
    return;
  }
  if (action === 'creator-pick') {
    const key = el.dataset.key;
    if (key) {
      c.draft[key] = el.dataset.value;
      renderCreator();
    }
    return;
  }
  if (action === 'creator-random') {
    const gender = c.draft.gender;
    const fresh = randomProfile(gender);
    c.draft = {
      ...c.draft,
      ...fresh,
      gender,
      name: c.draft.name,
      hairX: 0, hairY: 0, hairScale: 1,
      eyeX: 0, eyeY: 0, eyeScale: 1,
      mouthX: 0, mouthY: 0, mouthScale: 1,
      bodyScale: 1
    };
    renderCreator();
    playTone('tap');
    return;
  }
  if (action === 'creator-reset-tune') {
    Object.assign(c.draft, { hairX: 0, hairY: 0, hairScale: 1, eyeX: 0, eyeY: 0, eyeScale: 1, mouthX: 0, mouthY: 0, mouthScale: 1, bodyScale: 1 });
    renderCreator();
    return;
  }
  if (action === 'creator-finish') {
    finishCreator();
  }
}

function finishCreator() {
  const c = ui.creator;
  if (!c) return;
  const d = c.draft;
  const name = String(d.name || '').trim().slice(0, 24) || 'Avery';
  const profile = {
    ...d,
    name: undefined,
    gender: d.gender === 'male' ? 'male' : 'female',
    hairX: Number(d.hairX) || 0,
    hairY: Number(d.hairY) || 0,
    hairScale: Number(d.hairScale) || 1,
    eyeX: Number(d.eyeX) || 0,
    eyeY: Number(d.eyeY) || 0,
    eyeScale: Number(d.eyeScale) || 1,
    mouthX: Number(d.mouthX) || 0,
    mouthY: Number(d.mouthY) || 0,
    mouthScale: Number(d.mouthScale) || 1,
    bodyScale: Number(d.bodyScale) || 1
  };
  delete profile.name;

  if (c.mode === 'new') {
    state = createInitialState();
    state.mc = makeMC(profile.gender, name, profile);
    state.mc.joined = Date.now();
    state.introSeen = false;
    state.lastIncomeSerial = state.daySerial;
    ui.activeId = null;
    ui.filter = 'all';
    ui.creator = null;
    clearOverlay();
    document.body.classList.remove('locked');
    persist();
    enterGame();
    openWelcome();
    return;
  }

  if (!state) return;
  if (state.funds < MAKEOVER_FEE) {
    toast('Not quite enough', `The mirror needs ${money(MAKEOVER_FEE - state.funds)} more.`, 'night', 'coins');
    return;
  }
  state.funds -= MAKEOVER_FEE;
  const oldName = state.mc.name;
  state.mc.name = name;
  state.mc.gender = profile.gender;
  state.mc.profile = profile;
  pushStory(state, `${oldName === name ? name : `${oldName} became ${name}`} stepped out of the dressing room looking brand new.`, 'hanger', 'mint');
  ui.creator = null;
  clearOverlay();
  document.body.classList.remove('locked');
  persist();
  renderAll({ scroll: 'keep' });
  playTone('tap');
  toast('A fresh reflection', `Makeover complete for ${money(MAKEOVER_FEE)}.`, 'mint', 'sparkle');
}

/* ------------------------------------------------------------------ */
/* Game shell and rendering                                            */
/* ------------------------------------------------------------------ */
function enterGame() {
  els.splash.hidden = true;
  els.game.hidden = false;
  document.body.classList.remove('locked');
  ui.activeId = state.activeId || null;
  ui.filter = state.filter || 'all';
  if (state.screen === 'profile' && !personById(ui.activeId)) state.screen = 'suitors';
  renderAll();
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (!state.introSeen) openWelcome();
}

function viewHTML() {
  if (!state) return '';
  if (state.screen === 'profile') {
    const s = personById(ui.activeId);
    if (s) return renderProfileView(state, s);
    state.screen = 'suitors';
  }
  if (state.screen === 'suitors') return renderSuitorsView(state, ui.filter);
  if (state.screen === 'family') return renderFamilyView(state);
  if (state.screen === 'perks') return renderPerksView(state);
  if (state.screen === 'mirror') return renderMirrorView(state);
  return renderMapView(state);
}

function renderAll({ scroll = 'keep' } = {}) {
  if (!state) return;
  const oldTop = els.mainScroll.scrollTop;
  const oldMap = els.view.querySelector('#mapScroll');
  const mapPos = oldMap ? { left: oldMap.scrollLeft, top: oldMap.scrollTop } : null;
  const phase = dayPhase(state.minute);
  els.game.dataset.phase = phase.id;

  els.funds.textContent = money(state.funds);
  const weekday = WEEKDAYS[new Date(Date.UTC(state.date.year, state.date.month, state.date.day)).getUTCDay()];
  els.hudDate.textContent = `${weekday.slice(0, 3).toUpperCase()} · ${MONTHS_SHORT[state.date.month]} ${state.date.day}`;
  els.hudTime.textContent = timeLabel(state.minute);
  els.hudPhaseIcon.innerHTML = icon(phase.icon, 16);
  els.energyBar.style.width = `${clamp(state.sleep, 0, 100)}%`;
  els.energyText.textContent = String(Math.round(state.sleep));
  document.querySelector('.energy-pill')?.classList.toggle('low', state.sleep < 35);
  document.querySelector('.hud-pill.energy-pill')?.setAttribute('title', `Energy ${Math.round(state.sleep)} · sleep debt ${state.sleepDebt || 0}`);

  els.view.innerHTML = viewHTML();
  els.navList.innerHTML = renderNav(state, false);
  els.mobileNav.innerHTML = renderNav(state, true);
  els.sidebarMe.innerHTML = renderSidebarMe(state);
  els.sidebarEvent.innerHTML = renderSidebarEvent(state);
  els.rightRail.innerHTML = renderRail(state);
  document.title = `Maple Hollow — ${state.mc.name} · ${shortDate(state.date)}`;

  if (state.screen === 'map') {
    const freshMap = els.view.querySelector('#mapScroll');
    if (freshMap && mapPos) {
      freshMap.scrollLeft = mapPos.left;
      freshMap.scrollTop = mapPos.top;
    }
  }
  els.mainScroll.scrollTop = scroll === 'top' ? 0 : oldTop;
}

function commit({ scroll = 'keep', save = true } = {}) {
  if (save) persist();
  renderAll({ scroll });
  maybeShowNightPrompt();
}

/* ------------------------------------------------------------------ */
/* Time, energy, days, holidays                                        */
/* ------------------------------------------------------------------ */
function spendEnergy(amount) {
  if (!amount) return;
  state.sleep = clamp(state.sleep - amount, 0, 100);
}

function collectIncome() {
  if (!state) return 0;
  if (state.lastIncomeSerial === state.daySerial) return 0;
  state.lastIncomeSerial = state.daySerial;
  const amount = dailyIncome(state);
  state.lastMorningIncome = amount;
  if (amount > 0) {
    state.funds += amount;
    state.stats.incomeEarned = (state.stats.incomeEarned || 0) + amount;
    pushStory(state, `The household ledger came to ${money(amount)} this morning.`, 'coins', 'mint');
  }
  return amount;
}

function maybeCollectIncome() {
  if (state.minute >= 8 * 60) collectIncome();
}

function advanceTime(minutes, { energy = 0 } = {}) {
  if (!state) return 0;
  const prevSerial = state.daySerial;
  const prevMinute = state.minute;
  spendEnergy(energy);
  state.minute += Math.max(0, Math.round(minutes));
  let rolled = 0;
  while (state.minute >= 1440) {
    state.minute -= 1440;
    advanceCalendarDay();
    rolled++;
  }
  maybeCollectIncome();
  if (rolled > 0) {
    ui.pendingNightPrompt = false;
  } else if (prevMinute < 23 * 60 && state.minute >= 23 * 60 && state.minute < 1440) {
    if (state.nightPromptedSerial !== state.daySerial) {
      state.nightPromptedSerial = state.daySerial;
      ui.pendingNightPrompt = true;
    }
  }
  if (prevSerial !== state.daySerial && state.minute >= 8 * 60) collectIncome();
  return rolled;
}

function addStory(text, iconName = 'heart', tone = 'default') {
  pushStory(state, text, iconName, tone);
}

function advanceCalendarDay() {
  const oldDate = state.date;
  state.date = addDays(state.date, 1);
  state.daySerial = dateToSerial(state.date);
  if (state.date.month !== oldDate.month) ageChildren();
  handleHolidayTransition(oldDate, state.date);
  dailySuitorTick();
  state.napsToday = 0;
}

function handleHolidayTransition(oldDate, newDate) {
  const oldHoliday = getHoliday(oldDate);
  const newHoliday = getHoliday(newDate);
  if (oldHoliday && (!newHoliday || newHoliday.id !== oldHoliday.id)) endHoliday(oldHoliday);
  if (newHoliday && (!oldHoliday || newHoliday.id !== oldHoliday.id)) startHoliday(newHoliday);
}

function startHoliday(holiday) {
  const key = `${holiday.id}-${state.date.year}`;
  if (state.activeHoliday === key && state.holidaySpawned.includes(key)) return;
  const newbies = spawnHolidaySuitors(state, holiday);
  state.activeHoliday = key;
  addStory(`${holiday.name} has begun. ${newbies.length} visitors drifted into town for the week.`, holiday.icon, 'pink');
}

function endHoliday(holiday) {
  const staying = [];
  const leaving = [];
  state.suitors = state.suitors.filter(s => {
    if (s.holidayId !== holiday.id) return true;
    if (s.affection >= 28) {
      s.holidayId = null;
      s.temporary = false;
      s.moveIn = true;
      s.met = true;
      s.ignored = 0;
      s.bio = `${s.bio} They liked Maple Hollow enough to stay.`;
      staying.push(s);
      return true;
    }
    leaving.push(s);
    return false;
  });
  if (staying.length) addStory(`${staying.map(s => s.name).join(', ')} decided to stay in Maple Hollow after ${holiday.short}.`, 'heart', 'pink');
  if (leaving.length) addStory(`${leaving.map(s => s.name).join(', ')} left with the ${holiday.short} crowd.`, 'clock', 'night');
  state.activeHoliday = null;
  rebalanceTown();
}

function dailySuitorTick() {
  state.suitors.forEach(s => {
    if (!s.met) s.ignored = (s.ignored || 0) + 1;
    else s.ignored = 0;
  });
  const leaving = state.suitors.filter(s => !s.met && !s.holidayId && (s.ignored || 0) >= 7);
  if (leaving.length) {
    const ids = new Set(leaving.map(s => s.id));
    state.suitors = state.suitors.filter(s => !ids.has(s.id));
    leaving.forEach(s => addStory(`${s.name} quietly moved away without ever meeting you. A new face will arrive soon.`, 'clock', 'night'));
  }
  rebalanceTown();
}

function rebalanceTown() {
  const added = ensureBasePopulation(state);
  let women = state.suitors.filter(s => !s.holidayId && s.gender === 'female').length;
  let men = state.suitors.filter(s => !s.holidayId && s.gender === 'male').length;
  let newFaces = added.length;
  let guard = 0;
  while (women > men * 3 && guard < 12) {
    const s = makeSuitor(state, { gender: 'male' });
    s.location = pick(LOCATIONS.filter(l => l.id !== 'home')).id;
    state.suitors.push(s);
    men++;
    newFaces++;
    guard++;
  }
  while (women < men * 3 && guard < 12) {
    const s = makeSuitor(state, { gender: 'female' });
    s.location = pick(LOCATIONS.filter(l => l.id !== 'home')).id;
    state.suitors.push(s);
    women++;
    newFaces++;
    guard++;
  }
  if (newFaces > 0) addStory(`${newFaces} new face${newFaces === 1 ? '' : 's'} arrived on Petal Lane. The town keeps its three-to-one rhythm.`, 'heart', 'mint');
  return newFaces;
}

function ageChildren() {
  state.children.forEach(c => {
    if (c.movedOut) return;
    c.monthsOld = (c.monthsOld || 0) + 1;
    c.ageYears = (c.ageYears || 0) + 1;
    if (c.ageYears >= 18) {
      c.movedOut = true;
      c.marriedTo = c.marriedTo || pick(c.gender === 'female' ? FEMALE_MARRIED_NAMES : MALE_MARRIED_NAMES);
      addStory(`${c.name} turned eighteen, moved out, and married ${c.marriedTo}. They still send money home.`, 'family', 'pink');
    }
  });
}

/* ------------------------------------------------------------------ */
/* Night and sleep                                                     */
/* ------------------------------------------------------------------ */
function nightPay() {
  return Math.round((30 + (state.perks.money.rank - 1) * 3) * (1 + state.perks.money.prestige * 0.5));
}

function openNightPrompt() {
  if (!state) return;
  const alreadyShifted = state.moonlightSerial === state.daySerial;
  openModal({
    size: 'slim',
    dismissible: false,
    kind: 'night',
    title: 'The town is turning in.',
    subtitle: `It is ${timeLabel(state.minute)}. The shops are dark, the suitors have gone home, and tomorrow is already waiting.`,
    body: `
      <div class="sleep-report">
        <div class="sleep-stat-row"><span class="ssr-label">${icon('clock', 15)} Clock</span><b>${timeLabel(state.minute)}</b></div>
        <div class="sleep-stat-row"><span class="ssr-label">${icon('bolt', 15)} Energy</span><b>${Math.round(state.sleep)} / 100</b></div>
        <div class="sleep-stat-row"><span class="ssr-label">${icon('moon', 15)} Sleep debt</span><b>${state.sleepDebt || 0} night${state.sleepDebt === 1 ? '' : 's'}</b></div>
      </div>
      <div class="day-report" style="margin-top:10px">
        <h3>${icon('moon', 13)} Staying up has a cost</h3>
        <p>You can keep the lights on, but your energy will dip — and some of the women in town are far too observant to miss it tomorrow.</p>
      </div>`,
    footer: `
      <button type="button" class="btn btn-ghost btn-sm" data-action="stay-up">${icon('moon', 13)} Stay up</button>
      <button type="button" class="btn btn-cream btn-sm" data-action="moonlight-shift" ${alreadyShifted ? 'disabled' : ''}>${icon('coins', 13)} Moonlight shift · ${money(nightPay())}</button>
      <button type="button" class="btn btn-primary btn-sm" data-action="sleep-until-morning">${icon('home', 13)} Go home &amp; sleep</button>`
  });
}

function sleepUntilMorning() {
  if (!state) return;
  ui.pendingNightPrompt = false;
  const startAbs = state.daySerial * 1440 + state.minute;
  let targetAbs;
  if (state.minute < 8 * 60) targetAbs = state.daySerial * 1440 + 8 * 60;
  else targetAbs = (state.daySerial + 1) * 1440 + 8 * 60;
  const days = Math.max(0, Math.floor((targetAbs - startAbs) / 1440));
  for (let i = 0; i < days; i++) advanceCalendarDay();
  state.date = serialToDate(Math.floor(targetAbs / 1440));
  state.daySerial = dateToSerial(state.date);
  state.minute = 8 * 60;
  const hours = clamp((targetAbs - startAbs) / 60, 1, 26);
  const oldDebt = state.sleepDebt || 0;
  let restored = clamp(Math.round(35 + hours * 8), 35, 100);
  restored -= Math.min(35, oldDebt * 6);
  state.sleep = clamp(restored, 25, 100);
  if (hours >= 7) state.sleepDebt = Math.max(0, oldDebt - 1);
  else if (hours < 5) state.sleepDebt = Math.max(0, oldDebt + 1);
  else state.sleepDebt = oldDebt;
  state.napsToday = 0;
  const earned = collectIncome();
  addStory(`You slept ${Math.round(hours)} hours. Morning found you at ${Math.round(state.sleep)} energy.`, 'moon', 'night');
  clearOverlay();
  renderAll({ scroll: 'keep' });
  persist();
  openMorningReport(earned, hours);
}

function openMorningReport(earned, hours) {
  const active = getHoliday(state.date);
  const next = nextHolidayLabel(state.date);
  const stories = state.stories.slice(0, 3);
  openModal({
    size: 'slim',
    title: `Good morning, ${firstName(state.mc.name)}.`,
    subtitle: dateLabel(state.date),
    body: `
      <div class="day-report">
        <h3>${icon('sunrise', 13)} A new day on Petal Lane</h3>
        <p>You slept about ${Math.round(hours)} hours. The kettle is warm and the town is already awake.</p>
        <div class="payday"><b>+${money(earned || state.lastMorningIncome || 0)}</b><small>household income collected</small></div>
      </div>
      <div class="sleep-report" style="margin-top:10px">
        <div class="sleep-stat-row"><span class="ssr-label">${icon('bolt', 15)} Energy</span><b>${Math.round(state.sleep)} / 100</b></div>
        <div class="sleep-stat-row"><span class="ssr-label">${icon('moon', 15)} Sleep debt</span><b>${state.sleepDebt || 0} night${state.sleepDebt === 1 ? '' : 's'}</b></div>
        <div class="sleep-stat-row"><span class="ssr-label">${icon('calendar', 15)} ${active ? 'Festival' : 'Next festival'}</span><b>${active ? `${esc(active.name)} · ${holidayDaysLeft(state.date, active)}d left` : next ? `${esc(next.holiday.name)} in ${next.inDays}d` : 'quiet season'}</b></div>
      </div>
      ${stories.length ? `<div class="mt-12"><div class="eyebrow">OVERNIGHT NOTES</div>${stories.map(st => `<div class="whisper"><span class="w-dot"></span><span>${esc(st.text)}<br><small style="font-size:8px;color:var(--ink-faint)">${esc(st.date)}</small></span></div>`).join('')}</div>` : ''}`,
    footer: `<button type="button" class="btn btn-primary btn-sm" data-action="close-modal">${icon('sun', 13)} Start the day</button>`
  });
}

function powerNap() {
  if (!state) return;
  if ((state.napsToday || 0) >= 1) {
    toast('Already napped', 'One power nap a day is plenty. Try a full night at home.', 'night', 'moon');
    return;
  }
  advanceTime(90, { energy: -22 });
  state.sleep = clamp(state.sleep, 0, 100);
  state.napsToday = (state.napsToday || 0) + 1;
  addStory('You stole a ninety-minute power nap. It helped a little.', 'moon', 'night');
  clearOverlay();
  commit();
  playTone('tap');
  toast('Power nap', 'Ninety minutes, one blanket, slightly fewer yawns.', 'mint', 'moon');
}

/* ------------------------------------------------------------------ */
/* Relationship actions                                                */
/* ------------------------------------------------------------------ */
function flirtWith(id, { quick = false } = {}) {
  if (!state) return;
  const s = personById(id);
  if (!s) return;
  if (atNight()) {
    toast('Everyone is home', 'Flirting can wait until morning. Head to Rosewood Cottage to sleep.', 'night', 'moon');
    return;
  }
  if (state.sleep < 6) {
    toast('Too exhausted to sparkle', 'You need sleep before you can charm anyone.', 'night', 'bolt');
    return;
  }
  const wasMet = s.met;
  const low = state.sleep < 35 || (state.sleepDebt || 0) > 0;
  const charm = state.perks.charm.rank * 0.55 + state.perks.charm.prestige * 2;
  let gain = rand(2, 10) + Math.round(charm * 0.6);
  if (low) gain = Math.max(1, Math.round(gain * 0.65));
  s.affection = clamp(s.affection + gain, 0, 100);
  s.met = true;
  s.ignored = 0;
  s.flirtCount = (s.flirtCount || 0) + 1;
  s.lastLine = pick(DIALOGUE.flirt[s.personality] || DIALOGUE.flirt.sunshine);
  state.stats.flirts = (state.stats.flirts || 0) + 1;
  advanceTime(12, { energy: 4 });

  if (!wasMet) addStory(`You finally said hello to ${s.name}. Something in the air shifted.`, 'chat', 'pink');
  if (low) {
    addStory(`${s.name} noticed you were running on empty and told you to take care of yourself.`, 'moon', 'night');
  }
  addStory(`You flirted with ${s.name}. +${gain}% affection.`, 'heart', 'pink');
  commit();
  playTone('tap');
  const extra = low ? ` ${s.name} also noticed you are running on fumes.` : '';
  toast(`+${gain}% with ${s.name}`, `“${s.lastLine}”${extra}`, low ? 'night' : '', low ? 'moon' : 'heart');
  if (!quick && s.affection >= 72 && s.affection - gain < 72) {
    toast('A ring-sized feeling', `${s.name} is ready for a proposal.`, 'butter', 'ring');
  }
}

function buyGift(id, giftId) {
  if (!state) return;
  const s = personById(id);
  const gift = GIFT_BY_ID[giftId];
  if (!s || !gift) return;
  if (atNight()) {
    toast('The boutique is closed', 'Gifts can wait until morning.', 'night', 'moon');
    return;
  }
  if (state.funds < gift.price) {
    toast('Not enough funds', `${gift.name} costs ${money(gift.price)}.`, 'night', 'coins');
    return;
  }
  const likes = personalityOf(s).likes || [];
  const liked = likes.includes(gift.id);
  const wasMet = s.met;
  const gain = Math.round(gift.hearts * (liked ? 1.5 : 1));
  state.funds -= gift.price;
  s.affection = clamp(s.affection + gain, 0, 100);
  s.met = true;
  s.ignored = 0;
  s.giftCount = (s.giftCount || 0) + 1;
  s.lastLine = liked
    ? pick([`You remembered. ${gift.name} is exactly my favorite.`, 'Oh — you actually noticed what I like. That is dangerously sweet.', 'I am keeping this forever. Do not make it weird. Too late.'])
    : pick(DIALOGUE.flirt[s.personality] || DIALOGUE.flirt.sunshine);
  state.stats.gifts = (state.stats.gifts || 0) + 1;
  advanceTime(8, { energy: 2 });
  if (!wasMet) addStory(`You introduced yourself to ${s.name} with a ${gift.name}.`, 'gift', 'pink');
  addStory(`You gave ${s.name} a ${gift.name}. +${gain}% affection${liked ? ' — a favorite!' : ''}.`, 'gift', 'pink');
  clearOverlay();
  commit();
  playTone('tap');
  toast(`${gift.name} for ${s.name}`, `+${gain}% affection${liked ? ' · a perfect favorite' : ''}.`, liked ? 'butter' : '', liked ? 'star' : 'gift');
}

function goOnDate(id, optionId) {
  if (!state) return;
  const s = personById(id);
  const option = DATE_OPTIONS.find(o => o.id === optionId);
  if (!s || !option) return;
  if (atNight()) {
    toast('Too late for a date', 'Everyone has gone home. Tomorrow is another chance.', 'night', 'moon');
    return;
  }
  if (s.affection < 28) {
    toast('Not quite yet', `${s.name} needs 28% affection before a date.`, 'night', 'heart');
    return;
  }
  const base = dateCost(state, s);
  const cost = base + option.extra;
  if (state.funds < cost) {
    toast('Not enough funds', `That date costs ${money(cost)}.`, 'night', 'coins');
    return;
  }
  state.funds -= cost;
  const low = state.sleep < 35 || (state.sleepDebt || 0) > 0;
  const dateBoost = 1 + (state.perks.charm.rank * 1.2 + state.perks.charm.prestige * 4) / 100;
  let gain = Math.round(rand(option.min, option.max) * dateBoost * (low ? 0.72 : 1));
  gain = Math.max(1, gain);
  s.affection = clamp(s.affection + gain, 0, 100);
  s.met = true;
  s.ignored = 0;
  s.dateCount = (s.dateCount || 0) + 1;
  s.lastLine = pick(DIALOGUE.date);
  state.stats.dates = (state.stats.dates || 0) + 1;
  advanceTime(option.time, { energy: option.energy });
  addStory(`You took ${s.name} on a ${option.name.toLowerCase()} date. +${gain}% affection.`, option.icon, 'pink');
  if (low) addStory(`${s.name} noticed how tired you were and made you sit down halfway through.`, 'moon', 'night');
  clearOverlay();
  commit();
  playTone('date');
  openDateResult(s, option, gain, cost);
}

function proposeTo(id) {
  if (!state) return;
  const s = findInSuitors(id);
  if (!s) return;
  if (atNight()) {
    toast('Not at this hour', 'Proposals deserve daylight and a clear head.', 'night', 'ring');
    return;
  }
  if (s.affection < 72) {
    toast('Not yet', `${s.name} needs 72% affection. You are at ${Math.round(s.affection)}%.`, 'night', 'ring');
    return;
  }
  if (state.funds < ringCost()) {
    toast('The ring is out of reach', `You need ${money(ringCost())} for the ring.`, 'night', 'coins');
    return;
  }
  state.funds -= ringCost();
  state.stats.proposals = (state.stats.proposals || 0) + 1;
  advanceTime(30, { energy: 5 });
  s.married = true;
  s.met = true;
  s.ignored = 0;
  s.holidayId = null;
  s.temporary = false;
  s.moveIn = true;
  s.affection = Math.max(s.affection, 75);
  s.lastLine = pick(DIALOGUE.accept);
  s.vow = pick(MARRIAGE_VOWS);
  state.suitors = state.suitors.filter(x => x.id !== s.id);
  state.spouses.push(s);
  state.stats.weddings = (state.stats.weddings || 0) + 1;
  addStory(`${s.name} said yes. The household grew by one very happy spouse.`, 'ring', 'pink');
  rebalanceTown();
  ui.activeId = s.id;
  state.screen = 'profile';
  commit({ scroll: 'top' });
  playTone('wed');
  burstConfetti();
  openWeddingModal(s);
}

function tryForBaby(id) {
  if (!state) return;
  const s = personById(id);
  if (!s || !s.married) return;
  if (atNight()) {
    toast('Everyone is asleep', 'Family plans can wait until morning.', 'night', 'moon');
    return;
  }
  if (state.sleep < 8) {
    toast('Too tired tonight', 'Rest first, then think about growing the family.', 'night', 'bolt');
    return;
  }
  advanceTime(90, { energy: 8 });
  const chance = conceptionChance(state, s);
  if (Math.random() < chance) {
    const child = makeChild(state, s);
    state.children.push(child);
    state.stats.children = (state.stats.children || 0) + 1;
    addStory(`${child.name} was born to ${state.mc.name} and ${s.name}. The house got a little louder and a lot warmer.`, 'baby', 'pink');
    commit();
    burstConfetti(70);
    playTone('baby');
    openBirthModal(child, s);
  } else {
    addStory(`You and ${s.name} talked about a child. Not this month — but the idea is still glowing.`, 'baby', 'default');
    commit();
    playTone('tap');
    toast('Not this month', `${s.name} held your hand. There is always next month.`, 'night', 'baby');
  }
}

function findInSuitors(id) {
  return state ? state.suitors.find(s => s.id === id) || null : null;
}

/* ------------------------------------------------------------------ */
/* Perks, work, mirror, navigation                                     */
/* ------------------------------------------------------------------ */
function upgradePerk(key) {
  if (!state || !state.perks[key]) return;
  const p = state.perks[key];
  if (p.rank >= 20) return;
  const cost = perkUpgradeCost(state, key);
  if (state.funds < cost) {
    toast('Not enough funds', `That rank costs ${money(cost)}.`, 'night', 'coins');
    return;
  }
  state.funds -= cost;
  p.rank += 1;
  const name = { money: 'Hustle Heart', family: 'Nesting Instinct', charm: 'Silver Tongue' }[key];
  addStory(`${name} reached Rank ${p.rank}.`, 'sparkle', 'mint');
  commit();
  playTone('tap');
  toast(`${name} · Rank ${p.rank}`, p.rank === 20 ? 'Maximum rank reached. Prestige is waiting.' : `Upgraded for ${money(cost)}.`, 'mint', 'sparkle');
}

function prestigePerk(key) {
  if (!state || !state.perks[key]) return;
  const p = state.perks[key];
  const reward = prestigeReward(state, key);
  if (!reward || p.rank < 20 || p.prestige >= 3) return;
  state.funds += reward;
  p.prestige += 1;
  p.rank = 1;
  const name = { money: 'Hustle Heart', family: 'Nesting Instinct', charm: 'Silver Tongue' }[key];
  addStory(`${name} prestiged to ${p.prestige}/3. The windfall was ${money(reward)}.`, 'crown', 'pink');
  commit();
  playTone('prestige');
  burstConfetti(120);
  openPrestigeModal(key, reward);
}

function workShift() {
  if (!state) return;
  const loc = LOCATION_BY_ID[state.location];
  if (!loc || !loc.actions.includes('work')) {
    toast('No shift here', 'Try the café, the plaza, or the arcade.', 'night', 'cup');
    return;
  }
  if (atNight()) {
    toast('Closed for the night', 'The shops are shuttered. Sleep, then pick up a shift in the morning.', 'night', 'moon');
    return;
  }
  if (state.sleep < 10) {
    toast('Running on empty', 'You need sleep before a shift.', 'night', 'bolt');
    return;
  }
  const pay = Math.round((20 + (state.perks.money.rank - 1) * 4) * (1 + state.perks.money.prestige * 0.5));
  state.funds += pay;
  state.stats.incomeEarned = (state.stats.incomeEarned || 0) + pay;
  advanceTime(120, { energy: 16 });
  addStory(`You picked up a shift at ${loc.name} and earned ${money(pay)}.`, 'coins', 'mint');
  commit();
  playTone('tap');
  toast(`Shift complete · +${money(pay)}`, `Two hours at ${loc.name}. Your feet have opinions.`, 'mint', 'coins');
}

function selectLocation(id) {
  if (!state || !LOCATION_BY_ID[id]) return;
  state.location = id;
  state.screen = 'map';
  ui.activeId = null;
  advanceTime(10);
  commit({ scroll: 'keep' });
}

/* ------------------------------------------------------------------ */
/* Modals                                                              */
/* ------------------------------------------------------------------ */
function openWelcome() {
  if (!state) return;
  const active = getHoliday(state.date);
  const next = nextHolidayLabel(state.date);
  openModal({
    size: 'slim',
    title: `Welcome home, ${firstName(state.mc.name)}.`,
    subtitle: 'Fresh out of college. Five hundred dollars. A whole town of possibilities.',
    body: `
      <div class="welcome-card">
        <div style="width:104px;height:128px;margin:0 auto 8px;border-radius:22px;overflow:hidden;background:linear-gradient(160deg,#ffd8df,#ffeed9);border:1.5px solid rgba(81,59,81,.16)">${renderAvatar(state.mc.profile, { alt: state.mc.name })}</div>
        <p>Maple Hollow does not believe in a one-spouse limit. Date, marry, build a family, and let the household grow as big as your heart can hold.</p>
      </div>
      <div class="welcome-tips">
        <div class="welcome-tip">${icon('heart', 16)} <span><b>Start with a hello.</b> Flirt for random affection, or give a gift for a guaranteed boost.</span></div>
        <div class="welcome-tip">${icon('cup', 16)} <span><b>Dates unlock at 28%.</b> Proposals unlock at 72%. The ring costs ${money(ringCost())}.</span></div>
        <div class="welcome-tip">${icon('family', 16)} <span><b>Married spouses can have children.</b> Each new month ages them one year; at 18 they move out and send money home.</span></div>
        <div class="welcome-tip">${icon('clock', 16)} <span><b>The clock keeps moving.</b> Suitors go home at 11 PM. You can stay up, but sleep debt is noticed.</span></div>
        ${active
          ? `<div class="welcome-tip">${icon(active.icon, 16)} <span><b>${esc(active.name)}</b> is on now — ${holidayDaysLeft(state.date, active)} day${holidayDaysLeft(state.date, active) === 1 ? '' : 's'} left. Festival visitors can become permanent residents.</span></div>`
          : next ? `<div class="welcome-tip">${icon(next.holiday.icon, 16)} <span><b>${esc(next.holiday.name)}</b> starts in ${next.inDays} day${next.inDays === 1 ? '' : 's'} — festival visitors can become permanent residents.</span></div>` : ''}
      </div>`,
    footer: `<button type="button" class="btn btn-primary btn-sm" data-action="close-modal">${icon('heart', 13)} Step into town</button>`
  });
}

function openGiftModal(id) {
  if (!state) return;
  const s = personById(id);
  if (!s) return;
  if (atNight()) {
    toast('Everyone is home', 'Gifts can wait until morning.', 'night', 'moon');
    return;
  }
  const likes = personalityOf(s).likes || [];
  const cards = GIFTS.slice().sort((a, b) => a.price - b.price).map(g => {
    const liked = likes.includes(g.id);
    const afford = state.funds >= g.price;
    const gain = Math.round(g.hearts * (liked ? 1.5 : 1));
    return `<button type="button" class="gift-card" data-action="buy-gift" data-id="${s.id}" data-gift="${g.id}" style="--gift:${g.color}" ${afford ? '' : 'disabled'}>
      <span class="gift-top"><span class="gift-art">${icon(g.icon, 20)}</span><span class="gift-price">${money(g.price)}</span></span>
      <b>${esc(g.name)}</b>
      <small>${esc(g.desc)}</small>
      <span class="gift-hearts">${icon('heartFill', 10)} +${gain}%${liked ? ` <span class="gift-liked">${icon('star', 9)} favorite</span>` : ''}</span>
    </button>`;
  }).join('');
  openModal({
    title: `A gift for ${s.name}`,
    subtitle: `${Math.round(s.affection)}% affection · ${personalityOf(s).name} energy`,
    body: `
      <div class="flex items-center justify-between wrap mb-12">
        <p class="tiny muted" style="max-width:330px">Gifts always raise affection. A favorite raises it by half again.</p>
        <span class="gift-wallet">${icon('coins', 14)} ${money(state.funds)}</span>
      </div>
      <div class="gift-grid">${cards}</div>
      <div class="gift-hint">${icon('heart', 11)} ${esc(s.name)} especially likes ${likes.map(l => GIFT_BY_ID[l]?.name).filter(Boolean).join(', ') || 'thoughtful little things'}. Gifts count as speaking to someone, so new faces will not drift away.</div>`,
    footer: `<button type="button" class="btn btn-ghost btn-sm" data-action="close-modal">Maybe later</button>`
  });
}

function openDateModal(id) {
  if (!state) return;
  const s = personById(id);
  if (!s) return;
  if (atNight()) {
    toast('Everyone is home', 'Try again tomorrow.', 'night', 'moon');
    return;
  }
  const base = dateCost(state, s);
  const options = DATE_OPTIONS.map(o => {
    const cost = base + o.extra;
    const disabled = state.funds < cost;
    return `<button type="button" class="date-option" data-action="go-date" data-id="${s.id}" data-date="${o.id}" ${disabled ? 'disabled' : ''}>
      <span class="date-icon" style="--date-soft:${o.soft};--date-ink:${o.ink}">${icon(o.icon, 19)}</span>
      <span class="date-copy"><b>${esc(o.name)}</b><small>${esc(o.desc)} · about ${Math.round(o.time / 60 * 10) / 10}h</small></span>
      <span class="date-cost">${money(cost)}</span>
    </button>`;
  }).join('');
  openModal({
    title: `A date with ${s.name}`,
    subtitle: `${Math.round(s.affection)}% affection · dates start at ${money(base)}. Pick the shape of the afternoon.`,
    body: `<div class="date-grid">${options}</div>
      <div class="gift-hint">${icon('heart', 11)} Dates raise affection generously and count as time passing. If a date pushes past 11 PM, everyone heads home.</div>`,
    footer: `<button type="button" class="btn btn-ghost btn-sm" data-action="close-modal">Not today</button>`
  });
}

function openDateResult(s, option, gain, cost) {
  const ready = s.affection >= 72 && !s.married;
  openModal({
    size: 'slim',
    title: pick(['A very good afternoon.', 'The town went quiet.', 'One of those days.']),
    subtitle: `${option.name} · ${money(cost)}`,
    body: `
      <div style="display:flex;gap:13px;align-items:center">
        <div style="width:92px;height:112px;border-radius:20px;overflow:hidden;background:linear-gradient(160deg,#ffdfe5,#fff0d5);border:1.5px solid rgba(81,59,81,.15);flex:0 0 auto">${renderAvatar(s.profile, { alt: s.name })}</div>
        <div style="min-width:0">
          <div class="eyebrow pink">${esc(s.name)} · ${esc(option.name)}</div>
          <p style="font-size:13px;line-height:1.45;margin-top:5px">“${esc(s.lastLine)}”</p>
          <div class="flex gap-6 wrap mt-8"><span class="chip pink">${icon('heart', 11)} +${gain}% affection</span><span class="chip">${Math.round(s.affection)}% now</span></div>
        </div>
      </div>
      ${ready ? `<div class="day-report" style="margin-top:12px"><h3>${icon('ring', 13)} The ring is waiting</h3><p>${esc(s.name)} is at 72% or higher. A proposal costs ${money(ringCost())}.</p></div>` : ''}`,
    footer: `<button type="button" class="btn btn-primary btn-sm" data-action="close-modal">${icon('heart', 13)} Keep the memory</button>`
  });
}

function openWeddingModal(s) {
  const vow = s.vow || pick(MARRIAGE_VOWS);
  openModal({
    size: 'slim',
    title: `${s.gender === 'female' ? 'She' : 'He'} said yes.`,
    subtitle: 'Maple Hollow does not believe in a one-spouse limit. Your household just got bigger.',
    body: `
      <div style="display:flex;gap:8px;justify-content:center;align-items:flex-end;margin-bottom:12px">
        <div style="width:92px;height:112px;border-radius:18px;overflow:hidden;background:#ffeadf;border:1.5px solid rgba(81,59,81,.15)">${renderAvatar(state.mc.profile, { alt: state.mc.name })}</div>
        <span style="font-size:25px;color:var(--pink-deep);padding-bottom:35px">♥</span>
        <div style="width:92px;height:112px;border-radius:18px;overflow:hidden;background:#ffeadf;border:1.5px solid rgba(81,59,81,.15)">${renderAvatar(s.profile, { alt: s.name })}</div>
      </div>
      <div class="day-report">
        <h3>${icon('ring', 13)} ${esc(s.name)} &amp; ${esc(state.mc.name)}</h3>
        <p>“${esc(vow)}”</p>
        <div class="flex gap-6 wrap mt-8"><span class="chip mint">${icon('family', 11)} ${state.spouses.length} spouse${state.spouses.length === 1 ? '' : 's'}</span><span class="chip violet">${icon('baby', 11)} ${state.children.length} child${state.children.length === 1 ? '' : 'ren'}</span><span class="chip butter">${icon('coins', 11)} +${money(state.spouses.length * 22)}/day</span></div>
      </div>
      <p class="tiny muted" style="margin-top:10px">Ask ${pronounObj(s.gender)} about a child from the profile page whenever you are ready.</p>`,
    footer: `
      <button type="button" class="btn btn-ghost btn-sm" data-action="go-screen" data-screen="suitors">${icon('heart', 13)} Keep mingling</button>
      <button type="button" class="btn btn-primary btn-sm" data-action="go-screen" data-screen="family">${icon('family', 13)} See the household</button>`
  });
}

function openBirthModal(child, spouse) {
  openModal({
    size: 'slim',
    title: `${child.name} arrived.`,
    subtitle: `${spouse.name} and ${state.mc.name} have a brand-new little one.`,
    body: `
      <div style="display:flex;gap:13px;align-items:center">
        <div style="width:100px;height:122px;border-radius:20px;overflow:hidden;background:linear-gradient(160deg,#ffe3ea,#fff1d7);border:1.5px solid rgba(81,59,81,.15);flex:0 0 auto">${renderAvatar(child.profile, { alt: child.name })}</div>
        <div>
          <div class="eyebrow pink">${child.gender === 'female' ? 'A daughter' : 'A son'} · ${esc(child.trait)}</div>
          <p style="font-size:12px;line-height:1.45;margin-top:5px">A perfect little mix of both of you. The whole house smells like baby shampoo and new beginnings.</p>
          <div class="flex gap-6 wrap mt-8"><span class="chip mint">${icon('baby', 11)} newborn</span><span class="chip">${icon('coins', 11)} ${money(childIncome(state, child))}/day</span></div>
        </div>
      </div>
      <div class="day-report" style="margin-top:12px"><h3>${icon('calendar', 13)} Growing up</h3><p>Each new month adds one year. At eighteen, ${child.name} will move out, marry, and send a little money home every day.</p></div>`,
    footer: `
      <button type="button" class="btn btn-ghost btn-sm" data-action="close-modal">${icon('heart', 13)} Stay close</button>
      <button type="button" class="btn btn-primary btn-sm" data-action="go-screen" data-screen="family">${icon('family', 13)} Meet the family</button>`
  });
}

function openPrestigeModal(key, reward) {
  const p = state.perks[key];
  const def = { money: 'Hustle Heart', family: 'Nesting Instinct', charm: 'Silver Tongue' }[key];
  openModal({
    size: 'slim',
    title: 'Prestige.',
    subtitle: `${def} has been reborn at Rank 1 — stronger, pricier, and glowing.`,
    body: `
      <div class="day-report" style="text-align:center">
        <div class="eyebrow" style="color:#8a5b1c">INSTANT WINDFALL</div>
        <div class="payday" style="justify-content:center"><b>${money(reward)}</b><small>added to your funds</small></div>
        <p style="margin-top:6px">Prestige ${p.prestige}/3. Upgrade costs are now 85% higher, but every rank grants a stronger benefit.</p>
      </div>
      <div class="sleep-report" style="margin-top:10px">
        <div class="sleep-stat-row"><span class="ssr-label">${icon('crown', 15)} Prestige level</span><b>${p.prestige} / 3</b></div>
        <div class="sleep-stat-row"><span class="ssr-label">${icon('sparkle', 15)} Current rank</span><b>1 / 20</b></div>
      </div>`,
    footer: `<button type="button" class="btn btn-violet btn-sm" data-action="close-modal">${icon('crown', 13)} Back to the climb</button>`
  });
}

function openCalendarModal() {
  if (!state) return;
  const rows = Array.from({ length: 8 }, (_, i) => {
    const d = addDays(state.date, i);
    const holiday = getHoliday(d);
    const weekday = WEEKDAYS[new Date(Date.UTC(d.year, d.month, d.day)).getUTCDay()].slice(0, 3);
    return `<div class="sleep-stat-row">
      <span class="ssr-label">${icon(holiday?.icon || 'calendar', 15)} ${weekday} · ${shortDate(d)}${i === 0 ? ' · today' : ''}</span>
      <b>${holiday ? esc(holiday.short) : '—'}</b>
    </div>`;
  }).join('');
  const active = getHoliday(state.date);
  const next = nextHolidayLabel(state.date);
  openModal({
    title: monthLabel(state.date),
    subtitle: 'A week at a glance. Holidays bring three women and one man to town for seven days.',
    body: `
      <div class="sleep-report">${rows}</div>
      <div class="day-report" style="margin-top:11px">
        <h3>${icon('clock', 13)} The rhythm of a day</h3>
        <p>Interactions nudge the clock forward. Suitors head home at 11 PM. Sleep restores energy; staying up builds sleep debt, and some women will notice.</p>
        ${active
          ? `<p style="margin-top:5px"><b>${esc(active.name)} is on now:</b> ${holidayDaysLeft(state.date, active)} day${holidayDaysLeft(state.date, active) === 1 ? '' : 's'} left.${next ? ` Next up: ${esc(next.holiday.name)} in ${next.inDays} day${next.inDays === 1 ? '' : 's'}.` : ''}</p>`
          : next ? `<p style="margin-top:5px"><b>Next festival:</b> ${esc(next.holiday.name)} in ${next.inDays} day${next.inDays === 1 ? '' : 's'}.</p>` : ''}
      </div>`,
    footer: `<button type="button" class="btn btn-primary btn-sm" data-action="close-modal">${icon('calendar', 13)} Got it</button>`
  });
}

function openBoutiqueModal() {
  if (!state) return;
  const people = state.suitors.slice().sort((a, b) => b.affection - a.affection);
  const list = people.length ? people.map(s => `<button type="button" class="holiday-person" data-action="open-gifts" data-id="${s.id}" style="text-align:left">
      <span class="hp-face">${renderAvatar(s.profile, { alt: s.name })}</span>
      <span><b>${esc(s.name)}</b><small>${esc(s.personalityName)} · ${Math.round(s.affection)}% affection</small></span>
    </button>`).join('') : `<p class="tiny muted">No hearts in town right now. New faces arrive soon.</p>`;
  openModal({
    title: 'Ribbon & Rouge',
    subtitle: 'Pick a heart, then pick a gift. Wrapping is free; the ribbon is doing a lot of emotional work.',
    body: `
      <div class="flex items-center justify-between wrap mb-12">
        <div class="eyebrow pink">WHO IS IT FOR?</div>
        <span class="gift-wallet">${icon('coins', 14)} ${money(state.funds)}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">${list}</div>`,
    footer: `
      <button type="button" class="btn btn-ghost btn-sm" data-action="close-modal">Just browsing</button>
      <button type="button" class="btn btn-primary btn-sm" data-action="go-screen" data-screen="suitors">${icon('heart', 13)} See all hearts</button>`
  });
}

function openHolidayModal() {
  if (!state) return;
  const h = getHoliday(state.date);
  if (!h) {
    toast('No festival this week', 'The town is between celebrations.', 'night', 'calendar');
    return;
  }
  if (!state.suitors.some(s => s.holidayId === h.id)) spawnHolidaySuitors(state, h);
  const left = holidayDaysLeft(state.date, h);
  openModal({
    className: 'holiday-modal',
    title: h.name,
    subtitle: `${left} days left · ${holidayDaysLeft(state.date, h) === 1 ? 'last day' : 'visitors are still in town'}`,
    topHTML: `<div class="modal-top"><div class="holiday-banner"><div class="holiday-emblem" style="--holiday:${h.color}">${icon(h.icon, 30)}</div><div><h2>${esc(h.name)}</h2><p>${esc(h.desc)}</p></div></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon('close', 17)}</button></div>`,
    body: `
      <div class="eyebrow pink">IN TOWN FOR THE FESTIVAL</div>
      <div class="holiday-newbies">${renderHolidayModalPeople(state) || '<p class="tiny muted">The visitors have already paired off or moved on.</p>'}</div>
      <div class="creator-tip" style="margin-top:12px">${icon(h.icon, 14)} <span><b>Romance keeps them here.</b> Reach 28% affection before the week ends and this visitor moves into Maple Hollow permanently. ${left} day${left === 1 ? '' : 's'} left.</span></div>`,
    footer: `
      <button type="button" class="btn btn-ghost btn-sm" data-action="close-modal">${icon('calendar', 13)} Later</button>
      <button type="button" class="btn btn-primary btn-sm" data-action="go-screen" data-screen="suitors">${icon('heart', 13)} Meet the visitors</button>`
  });
}

function openSleepMenu() {
  if (!state) return;
  const amount = dailyIncome(state);
  const active = getHoliday(state.date);
  const next = nextHolidayLabel(state.date);
  openModal({
    size: 'slim',
    title: isNightTime() ? 'A long day is done.' : 'Turn in early?',
    subtitle: isNightTime() ? 'The cottage is warm and the town has gone quiet.' : 'Sleep is free. Tomorrow will still be there.',
    body: `
      <div class="sleep-report">
        <div class="sleep-stat-row"><span class="ssr-label">${icon('clock', 15)} Now</span><b>${timeLabel(state.minute)}</b></div>
        <div class="sleep-stat-row"><span class="ssr-label">${icon('bolt', 15)} Energy</span><b>${Math.round(state.sleep)} / 100</b></div>
        <div class="sleep-stat-row"><span class="ssr-label">${icon('moon', 15)} Sleep debt</span><b>${state.sleepDebt || 0} night${state.sleepDebt === 1 ? '' : 's'}</b></div>
        <div class="sleep-stat-row"><span class="ssr-label">${icon('coins', 15)} Morning income</span><b>${money(amount)}</b></div>
        <div class="sleep-stat-row"><span class="ssr-label">${icon('calendar', 15)} ${active ? 'Festival' : 'Next festival'}</span><b>${active ? `${esc(active.short)} · ${holidayDaysLeft(state.date, active)}d left` : next ? `${esc(next.holiday.short)} in ${next.inDays}d` : 'quiet season'}</b></div>
      </div>
      <div class="day-report" style="margin-top:10px">
        <h3>${icon('heart', 13)} ${state.spouses.length ? 'The house is full' : 'The house is quiet'}</h3>
        <p>Sleeping restores energy. A full night also works off a little sleep debt. A power nap helps, once per day.</p>
      </div>`,
    footer: `
      <button type="button" class="btn btn-ghost btn-sm" data-action="close-modal">Not yet</button>
      <button type="button" class="btn btn-cream btn-sm" data-action="power-nap" ${(state.napsToday || 0) >= 1 ? 'disabled' : ''}>${icon('moon', 13)} Power nap · 90m</button>
      <button type="button" class="btn btn-primary btn-sm" data-action="sleep-until-morning">${icon('home', 13)} Sleep until morning</button>`
  });
}

function openHelpModal() {
  openModal({
    size: 'slim',
    title: 'How to play',
    subtitle: 'A cozy dating sim with a very big definition of family.',
    body: `
      <div class="welcome-tips">
        <div class="welcome-tip">${icon('heart', 16)} <span><b>Flirt or gift.</b> Flirting raises affection by a random amount; gifts always raise it. Hover a favorite for a bonus.</span></div>
        <div class="welcome-tip">${icon('cup', 16)} <span><b>Date at 28%.</b> Dates cost money but build affection fast. Propose at 72% with a ${money(ringCost())} ring.</span></div>
        <div class="welcome-tip">${icon('ring', 16)} <span><b>Marry as often as you like.</b> Every spouse is a full partner. Polygamy is completely accepted here.</span></div>
        <div class="welcome-tip">${icon('baby', 16)} <span><b>Grow the family.</b> Ask a spouse about a child. Each new month ages children one year; at 18 they move out and become marriable in town.</span></div>
        <div class="welcome-tip">${icon('coins', 16)} <span><b>Money makes the town go round.</b> Shifts pay now; perks pay every morning. At Rank 20, prestige for a windfall.</span></div>
        <div class="welcome-tip">${icon('clock', 16)} <span><b>Time moves when you do.</b> Suitors leave at 11 PM, unmet newcomers move out after 7 days, and festivals bring special visitors.</span></div>
        <div class="welcome-tip">${icon('hanger', 16)} <span><b>Change your look anytime</b> at the mirror for ${money(MAKEOVER_FEE)}. Hair, eyes, mouth, body, and outfit are all adjustable.</span></div>
      </div>`,
    footer: `<button type="button" class="btn btn-primary btn-sm" data-action="close-modal">${icon('heart', 13)} Back to the town</button>`
  });
}

function openNewGameConfirm() {
  openModal({
    size: 'slim',
    title: 'Start a new life?',
    subtitle: 'Your current save will be erased. Maple Hollow will remember none of it.',
    body: `<div class="day-report"><h3>${icon('alert', 13)} This cannot be undone</h3><p>Funds, spouses, children, perks, and every little story will be reset. The town will welcome a brand-new face.</p></div>`,
    footer: `
      <button type="button" class="btn btn-ghost btn-sm" data-action="close-modal">Keep playing</button>
      <button type="button" class="btn btn-danger btn-sm" data-action="confirm-new-game">${icon('close', 13)} Erase &amp; start over</button>`
  });
}

/* ------------------------------------------------------------------ */
/* Action router                                                       */
/* ------------------------------------------------------------------ */
function handleAction(action, el) {
  if (action.startsWith('creator-')) {
    handleCreatorAction(action, el);
    return;
  }
  if (!state) return;

  switch (action) {
    case 'close-modal':
      closeModal();
      break;
    case 'go-screen': {
      const screen = el.dataset.screen || 'map';
      clearOverlay();
      state.screen = screen;
      if (screen !== 'profile') ui.activeId = null;
      commit({ scroll: 'top' });
      break;
    }
    case 'select-location':
      selectLocation(el.dataset.location);
      break;
    case 'open-suitor': {
      const s = personById(el.dataset.id);
      if (!s) break;
      clearOverlay();
      ui.activeId = s.id;
      state.screen = 'profile';
      commit({ scroll: 'top' });
      break;
    }
    case 'filter-suitors':
      ui.filter = el.dataset.filter || 'all';
      state.filter = ui.filter;
      renderAll({ scroll: 'keep' });
      break;
    case 'quick-flirt':
    case 'flirt':
      flirtWith(el.dataset.id, { quick: action === 'quick-flirt' });
      break;
    case 'open-gifts':
      openGiftModal(el.dataset.id);
      break;
    case 'open-date':
      openDateModal(el.dataset.id);
      break;
    case 'buy-gift':
      buyGift(el.dataset.id, el.dataset.gift);
      break;
    case 'go-date':
      goOnDate(el.dataset.id, el.dataset.date);
      break;
    case 'propose':
      proposeTo(el.dataset.id);
      break;
    case 'try-baby':
      tryForBaby(el.dataset.id);
      break;
    case 'upgrade-perk':
      upgradePerk(el.dataset.perk);
      break;
    case 'prestige-perk':
      prestigePerk(el.dataset.perk);
      break;
    case 'open-creator':
      if (state.funds < MAKEOVER_FEE) {
        toast('Not quite enough', `The mirror needs ${money(MAKEOVER_FEE)}.`, 'night', 'coins');
      } else {
        clearOverlay();
        openCreator('makeover');
      }
      break;
    case 'open-boutique':
      openBoutiqueModal();
      break;
    case 'open-calendar':
      openCalendarModal();
      break;
    case 'open-holiday':
      openHolidayModal();
      break;
    case 'sleep-menu':
      openSleepMenu();
      break;
    case 'sleep-until-morning':
      sleepUntilMorning();
      break;
    case 'power-nap':
      powerNap();
      break;
    case 'stay-up':
      stayUp();
      break;
    case 'moonlight-shift':
      moonlightShift();
      break;
    case 'work':
      workShift();
      break;
    case 'save':
      persist(true);
      break;
    case 'toggle-sound': {
      ui.sound = !ui.sound;
      localStorage.setItem(SOUND_KEY, ui.sound ? 'on' : 'off');
      updateSoundIcon();
      if (ui.sound) playTone('tap');
      toast(ui.sound ? 'Sound on' : 'Sound off', ui.sound ? 'Tiny chimes for tiny milestones.' : 'A quieter Maple Hollow.', 'mint', ui.sound ? 'sound' : 'mute');
      break;
    }
    case 'toggle-fullscreen':
      toggleFullscreen();
      break;
    case 'new-game':
      openNewGameConfirm();
      break;
    case 'confirm-new-game':
      confirmNewGame();
      break;
    case 'open-help':
      openHelpModal();
      break;
    case 'welcome-done':
      closeModal();
      break;
    default:
      break;
  }
}

function stayUp() {
  state.nightPromptedSerial = state.daySerial;
  state.sleepDebt = (state.sleepDebt || 0) + 1;
  spendEnergy(8);
  advanceTime(30);
  addStory('You decided to stay up. The town is asleep, but your mind is not.', 'moon', 'night');
  clearOverlay();
  commit();
  playTone('bad');
  toast('Staying up', 'Sleep debt +1. Some women will notice those tired eyes tomorrow.', 'night', 'moon');
}

function moonlightShift() {
  if (state.moonlightSerial === state.daySerial) {
    toast('Already worked late', 'One moonlight shift a night is enough.', 'night', 'moon');
    return;
  }
  const pay = nightPay();
  state.moonlightSerial = state.daySerial;
  state.funds += pay;
  state.stats.incomeEarned = (state.stats.incomeEarned || 0) + pay;
  state.sleepDebt = (state.sleepDebt || 0) + 1;
  advanceTime(120, { energy: 18 });
  addStory(`You took a moonlight shift and earned ${money(pay)}. Tomorrow will feel it.`, 'coins', 'night');
  clearOverlay();
  commit();
  playTone('tap');
  toast(`Moonlight shift · +${money(pay)}`, 'Sleep debt +1. The town looks different at this hour.', 'night', 'coins');
}

function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      if (!document.documentElement.requestFullscreen) throw new Error('unsupported');
      document.documentElement.requestFullscreen().catch(() => {
        toast('Fullscreen unavailable', 'This browser does not allow fullscreen.', 'night', 'alert');
      });
    } else {
      document.exitFullscreen();
    }
  } catch {
    toast('Fullscreen unavailable', 'This browser does not allow fullscreen.', 'night', 'alert');
  }
}

function confirmNewGame() {
  clearOverlay();
  try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
  state = null;
  ui.activeId = null;
  ui.filter = 'all';
  ui.pendingNightPrompt = false;
  showSplash();
  openCreator('new');
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */
document.addEventListener('click', e => {
  const wrap = e.target.closest('.modal-wrap');
  if (wrap && e.target === wrap && !e.target.closest('.modal')) {
    if (ui.modal.dismissible) closeModal();
    return;
  }
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (!action) return;
  if (target.tagName === 'BUTTON' && target.disabled) return;
  handleAction(action, target);
});

document.addEventListener('input', e => {
  const c = ui.creator;
  if (!c) return;
  if (e.target.id === 'creatorName') {
    c.draft.name = e.target.value;
    const plate = els.overlay.querySelector('.creator-nameplate b');
    const note = els.overlay.querySelector('.creator-nameplate small');
    if (plate) plate.textContent = c.draft.name || 'Avery';
    if (note) note.textContent = `${c.draft.gender === 'female' ? 'she/her' : 'he/him'} · ${speciesLabel(c.draft.species)}`;
    return;
  }
  const key = e.target.dataset.range;
  if (!key) return;
  const value = Number(e.target.value);
  c.draft[key] = value;
  const label = els.overlay.querySelector(`[data-slider-value="${key}"]`);
  if (label) label.textContent = formatRangeValue(key, value);
  updateCreatorPreview();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (ui.creator) {
      closeCreator();
    } else if (hasModal() && ui.modal.dismissible) {
      closeModal();
    }
    return;
  }
  if (e.key === 'Enter' && e.target.id === 'creatorName' && ui.creator) {
    e.preventDefault();
    finishCreator();
  }
});

window.addEventListener('beforeunload', () => {
  if (state) persist();
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && state) persist();
});

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */
function bindSplash() {
  els.startBtn.addEventListener('click', () => {
    playTone('tap');
    const saved = rawSave();
    if (saved) {
      // Start always begins a fresh life; the old save remains until the new one is completed.
      state = null;
      ui.activeId = null;
    }
    els.splash.hidden = true;
    els.game.hidden = true;
    openCreator('new');
  });

  els.continueBtn.addEventListener('click', () => {
    playTone('tap');
    const loaded = loadGame();
    if (!loaded) {
      toast('Could not load that life', 'The save file looks unreadable. Try starting fresh.', 'night', 'alert');
      refreshContinue();
      return;
    }
    state = loaded;
    enterGame();
  });
}

function boot() {
  els.saveIcon.innerHTML = icon('save', 18);
  updateSoundIcon();
  els.fullIcon.innerHTML = icon('fullscreen', 18);
  bindSplash();
  renderHeroCast();
  refreshContinue();
  showSplash();
}

boot();
