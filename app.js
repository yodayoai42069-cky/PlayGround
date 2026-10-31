import {
  ACCESSORIES,
  CHARACTERS,
  CHILD_NAMES,
  EYE_COLORS,
  GIFTS,
  HAIR_COLORS,
  HAIR_STYLES,
  LOCATIONS,
  OUTFIT_COLORS,
  REL_STAGES,
  SKIN_TONES,
  STAGE_COSTS,
  STAGES,
  BODY_TYPES,
  characterById,
} from './assets/data.js';
import {
  icon,
  renderChildPortrait,
  renderPlayerPortrait,
  renderPortrait,
  sceneArt,
  titlePortraits,
} from './assets/art.js';

const SAVE_KEY = 'hanami-hearts-save-v1';
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const GOALS = { marriages: 6, grown: 3, earned: 5000 };
const PHASES = ['Morning', 'Afternoon', 'Evening'];

const game = {
  data: null,
  ui: {
    view: 'town',
    soundOn: true,
    creator: {
      name: '',
      pronoun: 'she',
      skinId: 'peach',
      hairStyle: 'wavy',
      hairColorId: 'chestnut',
      eyeId: 'violet',
      outfitId: 'rose',
      accessory: 'earrings',
      bodyType: 'soft',
    },
    modal: null,
  },
};

let audioContext = null;
let petalTimer = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function plural(value, singular, pluralWord = `${singular}s`) {
  return `${value} ${value === 1 ? singular : pluralWord}`;
}

function findById(list, id) {
  return list.find((entry) => entry.id === id) || list[0];
}

function getPronouns(player) {
  const map = {
    she: { subject: 'she', object: 'her', possessive: 'her', label: 'she / her' },
    he: { subject: 'he', object: 'him', possessive: 'his', label: 'he / him' },
  };
  return map[player?.pronoun] || map.she;
}

function phaseFor(actions) {
  if (actions < 3) return PHASES[0];
  if (actions < 6) return PHASES[1];
  return PHASES[2];
}

function dayName(day) {
  return WEEKDAYS[(Math.max(1, day) - 1) % WEEKDAYS.length];
}

function relationStage(affection) {
  return [...REL_STAGES].reverse().find((stage) => affection >= stage.min) || REL_STAGES[0];
}

function relationStatus(rel) {
  if (rel.status === 'married') return 'Married';
  if (rel.status === 'engaged') return 'Engaged';
  if (rel.status === 'dating') return 'Dating';
  if (rel.affection >= 70) return 'Devoted';
  return 'Single';
}

function statusClass(rel) {
  if (rel.status === 'married') return 'married';
  if (rel.status === 'engaged') return 'engaged';
  if (rel.status === 'dating') return 'dating';
  return '';
}

function getSpouses() {
  return CHARACTERS.filter((character) => game.data?.rels[character.id]?.status === 'married');
}

function getGrownChildren() {
  return game.data?.children.filter((child) => child.stage === 3) || [];
}

function getWorkingChildren() {
  return game.data?.children.filter((child) => child.stage === 3 && child.working) || [];
}

function incomeBreakdown() {
  const spouses = getSpouses().length;
  const workers = getWorkingChildren().length;
  return {
    base: 10,
    spouse: spouses * 20,
    child: workers * 45,
    total: 10 + spouses * 20 + workers * 45,
    spouses,
    workers,
  };
}

function totalMarriages() {
  return getSpouses().length;
}

function setScreen(name) {
  $('#screen-title').hidden = name !== 'title';
  $('#screen-creator').hidden = name !== 'creator';
  $('#screen-game').hidden = name !== 'game';
}

function stopPetals() {
  if (petalTimer) {
    clearInterval(petalTimer);
    petalTimer = null;
  }
}

function startPetals() {
  const layer = $('#petal-layer');
  layer.innerHTML = '';
  const makePetal = () => {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${9 + Math.random() * 12}s`;
    petal.style.animationDelay = `${-Math.random() * 14}s`;
    petal.style.opacity = `${0.32 + Math.random() * 0.5}`;
    petal.style.transform = `scale(${0.55 + Math.random() * 0.8})`;
    layer.appendChild(petal);
    setTimeout(() => petal.remove(), 23000);
  };
  for (let index = 0; index < 15; index += 1) makePetal();
  petalTimer = setInterval(makePetal, 2100);
}

/* ------------------------------------------------------------------ Audio */
function ensureAudio() {
  if (audioContext) return audioContext;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  audioContext = new AudioCtor();
  return audioContext;
}

function playSound(kind = 'tap') {
  if (!game.ui.soundOn) return;
  const context = ensureAudio();
  if (!context) return;
  if (context.state === 'suspended') context.resume().catch(() => {});
  const now = context.currentTime;
  const make = (frequency, start, duration, type = 'sine', volume = 0.022) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now + start);
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(volume, now + start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now + start);
    oscillator.stop(now + start + duration + 0.03);
  };
  if (kind === 'heart') {
    make(587, 0, 0.16, 'sine', 0.02);
    make(784, 0.07, 0.24, 'sine', 0.018);
    make(1046, 0.16, 0.3, 'sine', 0.012);
  } else if (kind === 'coin') {
    make(880, 0, 0.07, 'triangle', 0.018);
    make(1175, 0.06, 0.14, 'triangle', 0.014);
  } else if (kind === 'ceremony') {
    [523, 659, 784, 1046].forEach((frequency, index) => make(frequency, index * 0.1, 0.65, 'sine', 0.018));
  } else if (kind === 'soft') {
    make(420, 0, 0.09, 'sine', 0.012);
  } else {
    make(540, 0, 0.06, 'sine', 0.013);
  }
}

/* --------------------------------------------------------------- Persistence */
function saveGame() {
  if (!game.data) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(game.data));
  } catch (error) {
    console.warn('Could not save the story.', error);
  }
}

function readSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.player || !parsed.rels) return null;
    return normalizeSave(parsed);
  } catch (error) {
    console.warn('Could not read the saved story.', error);
    return null;
  }
}

function normalizeSave(data) {
  data.version = 1;
  data.player = data.player || {};
  data.player.name = data.player.name || 'Haru';
  data.player.pronoun = ['she', 'he'].includes(data.player.pronoun) ? data.player.pronoun : 'she';
  data.energy = Number.isFinite(data.energy) ? data.energy : 100;
  data.maxEnergy = 100;
  data.coins = Number.isFinite(data.coins) ? data.coins : 180;
  data.day = Number.isFinite(data.day) ? data.day : 1;
  data.actionsToday = Number.isFinite(data.actionsToday) ? data.actionsToday : 0;
  data.rels = data.rels || {};
  data.children = Array.isArray(data.children) ? data.children : [];
  data.log = Array.isArray(data.log) ? data.log : [];
  data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
  data.stats = data.stats || {};
  data.stats.gifts = data.stats.gifts || 0;
  data.stats.dates = data.stats.dates || 0;
  data.stats.shifts = data.stats.shifts || 0;
  data.totalEarned = Number.isFinite(data.totalEarned) ? data.totalEarned : 0;
  data.settings = data.settings || { sound: true };
  data.settings.sound = data.settings.sound !== false;
  data.perks = Array.isArray(data.perks) ? data.perks : [];
  data.perkPoints = Number.isFinite(data.perkPoints) ? data.perkPoints : 0;
  CHARACTERS.forEach((character) => {
    data.rels[character.id] = {
      affection: 0,
      status: 'single',
      dates: 0,
      gifts: 0,
      lastLine: 0,
      metDay: data.day,
      ...(data.rels[character.id] || {}),
    };
  });
  return data;
}

function updateContinueButton() {
  const saved = readSave();
  const button = $('#continue-button');
  const label = $('#continue-label');
  if (!button || !label) return;
  button.disabled = !saved;
  if (saved) {
    label.textContent = `Day ${saved.day} · ${totalMarriagesForData(saved)} hearts`;
  } else {
    label.textContent = 'No story yet';
  }
}

function totalMarriagesForData(data) {
  return CHARACTERS.filter((character) => data.rels?.[character.id]?.status === 'married').length;
}

/* --------------------------------------------------------------- State setup */
function createInitialState(player) {
  const rels = {};
  CHARACTERS.forEach((character) => {
    rels[character.id] = {
      affection: 0,
      status: 'single',
      dates: 0,
      gifts: 0,
      lastLine: 0,
      metDay: 1,
    };
  });
  return {
    version: 1,
    player,
    day: 1,
    phaseActions: 0,
    actionsToday: 0,
    energy: 100,
    maxEnergy: 100,
    coins: 10000,
    rels,
    children: [],
    log: [],
    achievements: [],
    stats: { gifts: 0, dates: 0, shifts: 0 },
    perks: [],
    perkPoints: 0,
    totalEarned: 0,
    completed: false,
    seenIntro: false,
    settings: { sound: game.ui.soundOn },
    createdAt: Date.now(),
  };
}

function playerFromCreator() {
  const creator = game.ui.creator;
  return {
    name: creator.name.trim(),
    pronoun: creator.pronoun,
    skin: findById(SKIN_TONES, creator.skinId),
    hairStyle: creator.hairStyle,
    hairColor: findById(HAIR_COLORS, creator.hairColorId),
    eyeColor: findById(EYE_COLORS, creator.eyeId).color,
    outfitColor: findById(OUTFIT_COLORS, creator.outfitId),
    accessory: creator.accessory,
    body: creator.bodyType || 'soft',
  };
}

/* -------------------------------------------------------------- Title setup */
function renderTitle() {
  $('#title-art').innerHTML = titlePortraits();
  updateContinueButton();
}

/* ------------------------------------------------------------ Creator setup */
function renderCreator() {
  const creator = game.ui.creator;
  $('#creator-form').innerHTML = `
    <div class="creator-form">
      <div class="form-split">
        <div class="form-block">
          <label for="player-name">Your name <small>up to 18 characters</small></label>
          <input id="player-name" class="name-input" maxlength="18" autocomplete="off" placeholder="e.g. Haru" value="${escapeHtml(creator.name)}" />
        </div>
        <div class="form-block">
          <label for="player-pronoun">Gender</label>
          <select id="player-pronoun" class="select-input">
            <option value="she" ${creator.pronoun === 'she' ? 'selected' : ''}>Female · she / her</option>
            <option value="he" ${creator.pronoun === 'he' ? 'selected' : ''}>Male · he / him</option>
          </select>
        </div>
      </div>
      <div class="form-block">
        <div class="form-label">Skin tone <small>six beautiful shades</small></div>
        <div class="swatch-row">
          ${SKIN_TONES.map((tone) => `
            <button class="skin-swatch ${creator.skinId === tone.id ? 'selected' : ''}" style="background:${tone.color}" data-action="creator-skin" data-id="${tone.id}" aria-label="Skin tone ${tone.id}"></button>
          `).join('')}
        </div>
      </div>
      <div class="form-block">
        <div class="form-label">Hair style</div>
        <div class="hair-style-grid">
          ${HAIR_STYLES.map((style) => `
            <button class="style-chip ${creator.hairStyle === style.id ? 'selected' : ''}" data-action="creator-hair-style" data-id="${style.id}">${style.label}</button>
          `).join('')}
        </div>
      </div>
      <div class="form-block">
        <div class="form-label">Hair colour</div>
        <div class="swatch-row">
          ${HAIR_COLORS.map((color) => `
            <button class="skin-swatch ${creator.hairColorId === color.id ? 'selected' : ''}" style="background:${color.color}" data-action="creator-hair-color" data-id="${color.id}" aria-label="Hair colour ${color.id}"></button>
          `).join('')}
        </div>
      </div>
      <div class="form-split">
        <div class="form-block">
          <div class="form-label">Eye colour</div>
          <div class="swatch-row">
            ${EYE_COLORS.map((color) => `
              <button class="skin-swatch ${creator.eyeId === color.id ? 'selected' : ''}" style="background:${color.color}" data-action="creator-eye" data-id="${color.id}" aria-label="Eye colour ${color.id}"></button>
            `).join('')}
          </div>
        </div>
        <div class="form-block">
          <div class="form-label">Signature colour</div>
          <div class="swatch-row">
            ${OUTFIT_COLORS.map((color) => `
              <button class="skin-swatch ${creator.outfitId === color.id ? 'selected' : ''}" style="background:${color.color}" data-action="creator-outfit" data-id="${color.id}" aria-label="Outfit colour ${color.id}"></button>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="form-block">
        <div class="form-label">A little detail</div>
        <div class="accessory-grid">
          ${ACCESSORIES.map((accessory) => `
            <button class="accessory-chip ${creator.accessory === accessory.id ? 'selected' : ''}" data-action="creator-accessory" data-id="${accessory.id}">${accessory.label}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  updateCreatorPreview();
}

function updateCreatorPreview() {
  const player = playerFromCreator();
  const previewName = player.name || 'A new neighbour';
  const preview = $('#creator-preview');
  if (preview) preview.innerHTML = renderPlayerPortrait({ ...player, name: previewName }, { mode: 'full' });
  const namePreview = $('#creator-name-preview');
  if (namePreview) namePreview.textContent = previewName;
  const summary = $('#creator-summary');
  if (summary) {
    summary.innerHTML = `<b>${escapeHtml(previewName)}</b> · ${getPronouns(player).label}<br />${HAIR_STYLES.find((style) => style.id === player.hairStyle)?.label || 'Soft waves'} · ${ACCESSORIES.find((item) => item.id === player.accessory)?.label || 'No accessory'}`;
  }
  $$('[data-action="creator-skin"]').forEach((button) => button.classList.toggle('selected', button.dataset.id === game.ui.creator.skinId));
  $$('[data-action="creator-hair-color"]').forEach((button) => button.classList.toggle('selected', button.dataset.id === game.ui.creator.hairColorId));
  $$('[data-action="creator-eye"]').forEach((button) => button.classList.toggle('selected', button.dataset.id === game.ui.creator.eyeId));
  $$('[data-action="creator-outfit"]').forEach((button) => button.classList.toggle('selected', button.dataset.id === game.ui.creator.outfitId));
  $$('[data-action="creator-hair-style"]').forEach((button) => button.classList.toggle('selected', button.dataset.id === game.ui.creator.hairStyle));
  $$('[data-action="creator-accessory"]').forEach((button) => button.classList.toggle('selected', button.dataset.id === game.ui.creator.accessory));
}

function beginNewStory() {
  const name = game.ui.creator.name.trim();
  if (!name) {
    showToast('Give your character a name first.', 'sparkle');
    $('#player-name')?.focus();
    return;
  }
  const player = playerFromCreator();
  game.data = createInitialState(player);
  game.ui.view = 'town';
  game.ui.soundOn = true;
  saveGame();
  enterGame();
}

function enterGame() {
  if (!game.data) return;
  game.ui.soundOn = game.data.settings.sound !== false;
  setScreen('game');
  renderAll();
  if (!game.data.seenIntro) {
    game.data.seenIntro = true;
    saveGame();
    openModal('intro');
  }
}

/* ------------------------------------------------------------------ Render */
function renderAll() {
  if (!game.data) return;
  renderRail();
  renderTopbar();
  renderView();
  updateSoundButton();
}

function renderRail() {
  const player = game.data.player;
  const pronouns = getPronouns(player);
  const spouses = getSpouses();
  const children = game.data.children.length;
  $('#rail-player').innerHTML = `
    <div class="rail-player-top">
      <div class="rail-avatar">${renderPlayerPortrait(player, { mode: 'face' })}</div>
      <div class="rail-player-name">
        <b>${escapeHtml(player.name)}</b>
        <span>${pronouns.label} · ${totalMarriages()} married</span>
      </div>
    </div>
    <div class="rail-player-stats">
      <span class="rail-stat">${icon('coin')}<b>${game.data.coins}</b> coins</span>
      <span class="rail-stat">${icon('heart')}<b>${spouses.length}/6</b> hearts</span>
    </div>
  `;
  const phase = phaseFor(game.data.actionsToday);
  $('#rail-day').innerHTML = `
    <div class="day-number"><span>Day ${game.data.day}</span><span>${dayName(game.data.day)}</span></div>
    <div class="day-number" style="margin-top:4px;font-size:.8rem"><span>${phase}</span><span>${game.data.energy}⚡</span></div>
    <p>${spouses.length ? `${plural(spouses.length, 'partner')} at home` : 'The house is quiet — for now.'}${children ? ` · ${plural(children, 'offspring', 'offspring')}` : ''}</p>
  `;
  $('#nav-hearts-count').textContent = `${totalMarriages()}/6`;
  $('#nav-family-count').textContent = children ? plural(children, 'offspring', 'offspring') : 'Empty';
  $$('.rail-nav-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === game.ui.view);
  });
}

function renderTopbar() {
  const phase = phaseFor(game.data.actionsToday);
  const hearts = totalMarriages();
  const viewCopy = {
    town: { kicker: `Hanami Hollow · Day ${game.data.day} · ${phase}`, title: 'A warm welcome' },
    hearts: { kicker: `Hearts · ${hearts} of 6 marriages`, title: 'Six stories, one heart' },
    home: { kicker: `Home · ${plural(game.data.children.length, 'offspring', 'offspring')}`, title: 'The life you are building' },
    ledger: { kicker: `Ledger · ${game.data.totalEarned} coins earned`, title: 'Your story so far' },
  };
  const copy = viewCopy[game.ui.view] || viewCopy.town;
  $('#top-kicker').textContent = copy.kicker;
  $('#top-title').textContent = copy.title;
  $('#resource-bar').innerHTML = `
    <span class="resource-pill gold">${icon('coin')}<span class="resource-label">Coins</span><b>${game.data.coins}</b></span>
    <span class="resource-pill energy">${icon('energy')}<span class="resource-label">Energy</span><b>${game.data.energy}</b><span class="energy-track"><i style="width:${(game.data.energy / game.data.maxEnergy) * 100}%"></i></span></span>
    <span class="resource-pill">${icon('heart')}<span class="resource-label">Hearts</span><b>${hearts}/6</b></span>
    <span class="resource-pill">${icon('sparkle')}<span class="resource-label">Household</span><b>${game.data.children.length}</b></span>
  `;
}

function renderView() {
  const root = $('#view-root');
  if (!root) return;
  if (game.ui.view === 'town') root.innerHTML = townView();
  else if (game.ui.view === 'hearts') root.innerHTML = heartsView();
  else if (game.ui.view === 'home') root.innerHTML = homeView();
  else root.innerHTML = ledgerView();
}

function townView() {
  const data = game.data;
  const phase = phaseFor(data.actionsToday);
  const greeting = phase === 'Morning' ? 'Good morning' : phase === 'Afternoon' ? 'Good afternoon' : 'Good evening';
  const spouses = getSpouses();
  const daily = incomeBreakdown();
  const quoteCharacter = CHARACTERS[data.day % CHARACTERS.length];
  const quote = quoteCharacter.quote;
  const householdPortraits = spouses.slice(0, 3).map((character) => `<span>${renderPortrait(character, { mode: 'face' })}</span>`).join('');

  return `
    <section class="town-hero">
      <div class="town-hero-copy">
        <div class="hero-date">Day ${data.day}<i></i>${dayName(data.day)}<i></i>${phase}</div>
        <h3>${greeting}, <em>${escapeHtml(data.player.name)}</em>.<br />The town is blooming.</h3>
        <p>Six women, six very different stories. Follow your heart, build a home, and let the family grow — one small, brave choice at a time.</p>
        <div class="hero-actions">
          <button class="hero-button" data-action="work-shift">${icon('work')} Work a shift <span>+coins</span></button>
          <button class="hero-button subtle" data-action="go-view" data-view="home">${icon('home')} Go home</button>
          <button class="hero-button subtle" data-action="end-day">${icon('moon')} End day</button>
        </div>
      </div>
      <aside class="hero-note">
        <div>
          <div class="hero-note-label">Today's little thought</div>
          <blockquote>“${escapeHtml(quote)}”<cite>— ${quoteCharacter.name}</cite></blockquote>
        </div>
        <div class="hero-mini-stats">
          <span><b>${spouses.length}/6</b>hearts won</span>
          <span><b>${data.children.length}</b>offspring</span>
          <span><b>+${daily.total}</b>daily income</span>
        </div>
      </aside>
    </section>

    <div class="town-layout">
      <div>
        <div class="section-heading">
          <div><h3>Where the day takes you</h3><p>Every woman has a place in town — and a story waiting.</p></div>
          <button class="text-button" data-action="go-view" data-view="hearts">See all hearts ${icon('arrow')}</button>
        </div>
        <div class="location-grid">
          ${Object.entries(LOCATIONS).map(([key, location]) => {
            const character = characterById(location.char);
            const rel = data.rels[character.id];
            return `<button class="location-card" data-action="open-character" data-char="${character.id}" style="--loc-a:${location.colors[0]};--loc-b:${location.colors[1]}" aria-label="Visit ${escapeHtml(character.name)} at ${escapeHtml(location.name)}">
              <div class="location-scene">${sceneArt(location.scene)}</div>
              <div class="location-portrait">${renderPortrait(character, { mode: 'card' })}</div>
              <div class="location-content">
                <span class="location-kicker">${icon('pin')} ${escapeHtml(location.name)}</span>
                <h4>${escapeHtml(character.name)} <span style="font-family:var(--font-body);font-size:.62rem;color:var(--ink-faint);font-weight:600">· ${character.age}</span></h4>
                <span class="location-character"><span class="mini-heart">${icon('heart')}</span>${escapeHtml(character.role)} · ${rel.affection}%</span>
                <span class="location-visit">Spend time ${icon('arrow')}</span>
              </div>
            </button>`;
          }).join('')}
        </div>
      </div>

      <aside class="town-side">
        <div class="side-card">
          <h4>Today's plan</h4>
          <p>${phase === 'Evening' ? 'The light is gold. One more conversation, then home.' : 'Small steps make a whole life. Choose what matters.'}</p>
          <div class="today-list">
            <div class="today-row">${icon('energy')} Energy <b>${data.energy}/${data.maxEnergy}</b></div>
            <div class="today-row">${icon('work')} Shift pay <b>55–85 coins</b></div>
            <div class="today-row">${icon('heart')} Open hearts <b>${totalMarriages()}/6</b></div>
          </div>
          <div class="today-actions">
            <button class="primary-button" data-action="work-shift">Work a shift</button>
            <button class="ghost-button" data-action="end-day">Rest</button>
          </div>
        </div>

        <div class="side-card">
          <h4>Dream board</h4>
          <p>A life big enough to hold everyone you love.</p>
          <div class="dream-list">
            ${dreamItem('Marry all six women', totalMarriages(), GOALS.marriages)}
            ${dreamItem('Raise grown offspring', getGrownChildren().length, GOALS.grown)}
            ${dreamItem('Earn a family fortune', game.data.totalEarned, GOALS.earned, 'coins')}
          </div>
        </div>

        <div class="side-card">
          <h4>Your household</h4>
          <p>${spouses.length ? 'The porch light is on for the people you chose.' : 'A home is waiting to be filled with stories.'}</p>
          <div class="household-mini">
            <div class="avatar-stack">
              <span>${renderPlayerPortrait(game.data.player, { mode: 'face' })}</span>
              ${householdPortraits || '<span class="empty-avatar">+</span>'}
            </div>
            <div class="household-copy"><b>${spouses.length ? plural(spouses.length, 'partner') : 'Just you'}</b><br />${plural(game.data.children.length, 'offspring', 'offspring')} · ${plural(getGrownChildren().length, 'grown offspring', 'grown offspring')}</div>
          </div>
        </div>
      </aside>
    </div>
  `;
}

function dreamItem(label, value, goal, type = '') {
  const percent = clamp((value / goal) * 100, 0, 100);
  const shown = type === 'coins' ? `${value.toLocaleString()} / ${goal.toLocaleString()}` : `${value} / ${goal}`;
  return `<div class="dream-item"><span>${label}</span><b>${shown}</b><div class="dream-track"><i style="width:${percent}%"></i></div></div>`;
}

function heartsView() {
  return `
    <div class="view-heading">
      <div>
        <p class="eyebrow"><span></span> Six hearts, all adults</p>
        <h3>The women of <em>Hanami Hollow</em></h3>
        <p>Every relationship is consensual and grows at its own pace. Show up, listen, and let affection become something deeper.</p>
      </div>
      <span class="heading-note">${totalMarriages()} of 6 married · ${game.data.children.length} offspring</span>
    </div>
    <div class="hearts-grid">
      ${CHARACTERS.map((character) => {
        const rel = game.data.rels[character.id];
        const stage = relationStage(rel.affection);
        const favorite = GIFTS.find((gift) => gift.id === character.favoriteGift);
        return `<button class="heart-card" data-action="open-character" data-char="${character.id}" aria-label="Open ${escapeHtml(character.name)}'s heart card">
          <div class="heart-portrait">${renderPortrait(character, { mode: 'card' })}</div>
          <div class="heart-card-body">
            <span class="heart-status ${statusClass(rel)}">${statusClass(rel) === 'married' ? icon('heart') : ''}${relationStatus(rel)}</span>
            <h4>${escapeHtml(character.name)}</h4>
            <span class="heart-role">${character.age} · ${escapeHtml(character.role)}</span>
            <p class="heart-quote">“${escapeHtml(character.tagline)}”</p>
            <div class="heart-affection">
              <div class="heart-affection-label"><span>${stage.label}</span><b>${rel.affection}%</b></div>
              <div class="affection-track"><i style="width:${rel.affection}%"></i></div>
            </div>
            <div class="heart-card-foot">
              <span class="heart-likes">${icon('gift')} Loves ${escapeHtml(favorite?.name || 'kindness')}</span>
              <span class="heart-arrow">${icon('arrow')}</span>
            </div>
          </div>
        </button>`;
      }).join('')}
    </div>
  `;
}

function homeView() {
  const spouses = getSpouses();
  const children = game.data.children;
  const income = incomeBreakdown();
  const grown = getGrownChildren().length;
  return `
    <section class="home-hero">
      <div>
        <div class="hero-date">Your home<i></i>${spouses.length ? plural(spouses.length, 'heart') : 'A quiet beginning'}<i></i>${plural(children.length, 'offspring', 'offspring')}</div>
        <h3>${spouses.length ? `Welcome home, <em>${escapeHtml(game.data.player.name)}</em>.` : `This house is ready for <em>your story</em>.`}</h3>
        <p>${spouses.length ? 'The kitchen is warm, the table is full, and someone has left the porch light on for you.' : 'Love is not a race. Visit the town, make a friend, and let the house fill up when the time is right.'}</p>
      </div>
      <div class="home-hero-side">
        <div class="home-stat"><b>${spouses.length}</b><span>partners</span></div>
        <div class="home-stat"><b>${children.length}</b><span>offspring</span></div>
        <div class="home-stat"><b>${grown}</b><span>grown</span></div>
      </div>
    </section>

    <div class="home-layout">
      <div class="home-main-col">
        <section class="panel">
          <div class="panel-head">
            <div><h4>The people at your table</h4><p>${spouses.length ? 'A household built on affection and consent.' : 'Visit someone in town and see where the story goes.'}</p></div>
            ${spouses.length ? `<button class="text-button" data-action="family-modal">${icon('family')} Start a family</button>` : ''}
          </div>
          <div class="spouse-grid">
            ${spouses.length ? spouses.map((character) => `
              <div class="spouse-card">
                <div class="spouse-portrait">${renderPortrait(character, { mode: 'card' })}</div>
                <div class="spouse-card-label"><b>${escapeHtml(character.name)}</b><span>Married · ${character.age} · ${escapeHtml(character.role)}</span></div>
              </div>
            `).join('') : `<div class="spouse-empty" style="grid-column:1/-1">The chairs are waiting.<br />There is no rush — the right person is worth the walk into town.</div>`}
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div><h4>Offspring &amp; family business</h4><p>Offspring are raised with care. When grown, they choose their own path.</p></div>
            ${spouses.length ? `<button class="mini-button gold" data-action="family-modal">${icon('family')} Welcome an offspring · 200</button>` : ''}
          </div>
          ${children.length ? `<div class="children-list">${children.map(childView).join('')}</div>` : `<div class="empty-family"><b>No little footsteps yet.</b><p>${spouses.length ? 'When you are ready, start a family. Every offspring is welcomed, raised, and free to choose their own future.' : 'Marry someone first, then the two of you can decide when the house is ready for an offspring.'}</p></div>`}
          <div class="house-note">${icon('check')} <span>Offspring are dependents, not employees. In time, when they are grown, they may choose to join the family business and contribute to the household.</span></div>
        </section>
      </div>

      <aside class="home-side-col">
        <section class="panel">
          <div class="panel-head"><div><h4>Tomorrow's income</h4><p>Paid when you rest for the night.</p></div></div>
          <div class="income-list">
            <div class="income-row"><span>${icon('home')} Base household</span><b>+${income.base}</b></div>
            <div class="income-row"><span>${icon('heart')} Partners (${income.spouses})</span><b>+${income.spouse}</b></div>
            <div class="income-row"><span>${icon('work')} Grown offspring (${income.workers})</span><b>+${income.child}</b></div>
          </div>
          <div class="income-total"><span>Next morning</span><b>+${income.total}</b></div>
          <div class="home-action-stack">
            <button class="primary-button" data-action="end-day">Rest &amp; begin next day</button>
            <button class="ghost-button" data-action="go-view" data-view="town">Back to town</button>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head"><div><h4>Daily rituals</h4><p>Small things that make a house a home.</p></div></div>
          <div class="today-list">
            <div class="today-row">${icon('music')} Evening tea <b>+energy</b></div>
            <div class="today-row">${icon('family')} Family dinner <b>+love</b></div>
            <div class="today-row">${icon('coin')} Business ledger <b>+${income.total}/day</b></div>
          </div>
          <div class="house-note">${icon('sparkle')} <span>Marriage adds a partner's contribution to the household. Grown offspring who join the business add more. Every coin can become a gift, a gesture, a new beginning.</span></div>
        </section>
      </aside>
    </div>
  `;
}

function childView(child) {
  const parent = characterById(child.parentId);
  const nextCost = STAGE_COSTS[child.stage + 1];
  const canRaise = child.stage < 3 && game.data.coins >= nextCost;
  const stageLabel = child.stage === 3 ? (child.working ? 'Grown · family business' : 'Grown · choosing their path') : STAGES[child.stage];
  return `<div class="child-row">
    <div class="child-avatar">${renderChildPortrait(child, child.stage, { mode: 'face' })}</div>
    <div class="child-info">
      <b>${escapeHtml(child.name)}</b>
      <span>${stageLabel} · ${escapeHtml(parent?.name || 'family')}'s offspring</span>
    </div>
    <div class="child-actions">
      ${child.stage < 3
        ? `<button class="mini-button" data-action="raise-child" data-child="${child.id}" ${canRaise ? '' : 'disabled'}>${icon('sparkle')} Raise · ${nextCost}</button>`
        : `<button class="mini-button ${child.working ? 'gold' : 'soft'}" data-action="toggle-child-work" data-child="${child.id}">${icon('work')} ${child.working ? 'Working' : 'Join business'}</button>`}
    </div>
  </div>`;
}

function ledgerView() {
  const data = game.data;
  const grown = getGrownChildren().length;
  const achievements = achievementDefinitions();
  const logs = data.log.slice(0, 12);
  return `
    <div class="view-heading">
      <div>
        <p class="eyebrow"><span></span> A life, in small moments</p>
        <h3>Your story <em>so far</em></h3>
        <p>Every conversation, gift, promise, and ordinary morning is part of the family you are making.</p>
      </div>
      <span class="heading-note">Saved locally · Day ${data.day}</span>
    </div>

    <div class="ledger-grid">
      <div class="stat-card">${icon('heart')}<b>${totalMarriages()}</b><span>marriages</span></div>
      <div class="stat-card">${icon('family')}<b>${data.children.length}</b><span>offspring</span></div>
      <div class="stat-card">${icon('work')}<b>${grown}</b><span>grown offspring</span></div>
      <div class="stat-card">${icon('coin')}<b>${data.totalEarned.toLocaleString()}</b><span>coins earned</span></div>
    </div>

    <div class="ledger-layout">
      <section class="panel">
        <div class="panel-head"><div><h4>Recent chapters</h4><p>The little things that became your life.</p></div></div>
        <div class="log-list">
          ${logs.length ? logs.map((entry) => `<div class="log-entry">
            <span class="log-dot">${icon(entry.icon || 'sparkle')}</span>
            <div class="log-copy"><p>${escapeHtml(entry.text)}</p></div>
            <span class="log-day">Day ${entry.day}</span>
          </div>`).join('') : `<div class="empty-family"><b>The first page is blank.</b><p>Visit someone in town. The story starts with a hello.</p></div>`}
        </div>
      </section>

      <aside class="home-side-col">
        <section class="panel">
          <div class="panel-head"><div><h4>Keepsakes</h4><p>${achievements.filter((item) => data.achievements.includes(item.id)).length} of ${achievements.length} collected.</p></div></div>
          <div class="achievement-grid">
            ${achievements.map((item) => {
              const unlocked = data.achievements.includes(item.id);
              return `<div class="achievement ${unlocked ? 'unlocked' : ''}"><span class="badge-icon">${icon(unlocked ? item.icon : 'lock')}</span><span>${item.label}</span></div>`;
            }).join('')}
          </div>
          <div class="ledger-tip">“Build a life you would want to come home to.”</div>
        </section>
      </aside>
    </div>
  `;
}

function achievementDefinitions() {
  return [
    { id: 'first-hello', label: 'A first hello', icon: 'sparkle', check: () => CHARACTERS.some((character) => game.data.rels[character.id].affection > 0) },
    { id: 'first-date', label: 'A first date', icon: 'heart', check: () => game.data.stats.dates > 0 },
    { id: 'first-marriage', label: 'A promise made', icon: 'ring', check: () => totalMarriages() > 0 },
    { id: 'first-child', label: 'A new chapter', icon: 'family', check: () => game.data.children.length > 0 },
    { id: 'first-grown', label: 'Wings of their own', icon: 'sparkle', check: () => getGrownChildren().length > 0 },
    { id: 'family-business', label: 'The family business', icon: 'work', check: () => getWorkingChildren().length > 0 },
    { id: 'full-house', label: 'A full house', icon: 'home', check: () => totalMarriages() === 6 },
    { id: 'three-grown', label: 'A growing legacy', icon: 'family', check: () => getGrownChildren().length >= 3 },
    { id: 'fortune', label: 'A family fortune', icon: 'coin', check: () => game.data.totalEarned >= 1000 },
    { id: 'legacy', label: 'Happily ever after', icon: 'star', check: () => game.data.completed },
  ];
}

/* ------------------------------------------------------------------ Modals */
function openModal(type, data = {}) {
  game.ui.modal = { type, ...data };
  renderModal();
}

function closeModal() {
  game.ui.modal = null;
  const root = $('#modal-root');
  root.classList.remove('has-modal');
  root.innerHTML = '';
}

function closeButton() {
  return `<button class="modal-close" data-action="close-modal" aria-label="Close">${icon('close')}</button>`;
}

function modalShell(content, panelClass = 'modal-panel medium', label = 'Dialog') {
  return `${closeButton()}<div class="${panelClass}" role="dialog" aria-modal="true" aria-label="${escapeHtml(label)}">${content}</div>`;
}

function renderModal() {
  const root = $('#modal-root');
  const modal = game.ui.modal;
  if (!modal) {
    closeModal();
    return;
  }
  let content = '';
  if (modal.type === 'character') {
    content = characterModal(modal);
    root.innerHTML = `<button class="modal-backdrop" data-action="close-modal" aria-label="Close dialog"></button><section class="modal-panel character-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(characterById(modal.charId).name)}">${content}</section>`;
  } else if (modal.type === 'about') {
    content = aboutModal();
    root.innerHTML = `<button class="modal-backdrop" data-action="close-modal" aria-label="Close dialog"></button>${modalShell(content, 'modal-panel medium', 'About Hanami Hearts')}`;
  } else if (modal.type === 'guide') {
    content = guideModal();
    root.innerHTML = `<button class="modal-backdrop" data-action="close-modal" aria-label="Close dialog"></button>${modalShell(content, 'modal-panel medium', 'How to play')}`;
  } else if (modal.type === 'menu') {
    content = menuModal();
    root.innerHTML = `<button class="modal-backdrop" data-action="close-modal" aria-label="Close dialog"></button>${modalShell(content, 'modal-panel small', 'Menu')}`;
  } else if (modal.type === 'rename') {
    content = renameModal();
    root.innerHTML = `<button class="modal-backdrop" data-action="close-modal" aria-label="Close dialog"></button>${modalShell(content, 'modal-panel small', 'Rename character')}`;
  } else if (modal.type === 'summary') {
    content = summaryModal(modal);
    root.innerHTML = `<button class="modal-backdrop" data-action="close-modal" aria-label="Close dialog"></button>${modalShell(content, 'modal-panel small', 'A new day')}`;
  } else if (modal.type === 'family') {
    content = familyModal();
    root.innerHTML = `<button class="modal-backdrop" data-action="close-modal" aria-label="Close dialog"></button>${modalShell(content, 'modal-panel medium', 'Start a family')}`;
  } else if (modal.type === 'ceremony') {
    content = ceremonyModal(modal);
    root.innerHTML = `<button class="modal-backdrop" data-action="close-ceremony" aria-label="Close dialog"></button>${modalShell(content, 'modal-panel medium', 'A ceremony')}`;
  } else if (modal.type === 'intro') {
    content = introModal();
    root.innerHTML = `<button class="modal-backdrop" data-action="close-modal" aria-label="Close dialog"></button>${modalShell(content, 'modal-panel medium', 'Welcome to Hanami Hollow')}`;
  } else if (modal.type === 'confirm-reset') {
    content = confirmResetModal();
    root.innerHTML = `<button class="modal-backdrop" data-action="close-modal" aria-label="Close dialog"></button>${modalShell(content, 'modal-panel small', 'Start over')}`;
  } else if (modal.type === 'legacy') {
    content = legacyModal();
    root.innerHTML = `<button class="modal-backdrop" data-action="close-modal" aria-label="Close dialog"></button>${modalShell(content, 'modal-panel medium', 'A full house')}`;
  }
  root.classList.add('has-modal');
  if (modal.type === 'rename') {
    setTimeout(() => $('#rename-input')?.focus(), 60);
  }
}

function characterModal(modal) {
  const character = characterById(modal.charId);
  const rel = game.data.rels[character.id];
  const mode = modal.mode || 'default';
  const feedback = modal.feedback;
  const location = LOCATIONS[character.location];
  const gradient = `--character-gradient:linear-gradient(160deg,${character.outfit} 0%,${character.accent} 100%)`;
  const favorite = GIFTS.find((gift) => gift.id === character.favoriteGift);
  const dialogue = feedback
    ? `<div class="dialogue-box ${feedback.feeling ? 'feeling' : ''}"><p>${escapeHtml(feedback.text)}</p><span class="dialogue-sign">${escapeHtml(feedback.sign || character.name)}</span></div>`
    : `<div class="dialogue-box"><p>${escapeHtml(character.quote)}</p><span class="dialogue-sign">${escapeHtml(character.name)}</span></div>`;

  let mainPane = '';
  if (mode === 'gifts') {
    mainPane = giftPane(character, favorite);
  } else if (mode === 'date') {
    mainPane = datePane(character);
  } else if (mode === 'date-result') {
    mainPane = dateResultPane(character, modal);
  } else {
    mainPane = `${dialogue}${actionPane(character, rel)}`;
  }

  return `
    <button class="modal-close" data-action="close-modal" aria-label="Close">${icon('close')}</button>
    <div class="character-art" style="${gradient}">
      <div class="character-art-glow"></div>
      <div class="character-art-stats">
        <span class="art-pill">${icon('heart')} ${rel.affection}%</span>
        <span class="art-pill">${icon('pin')} ${escapeHtml(location.name)}</span>
      </div>
      ${renderPortrait(character, { mode: 'full' })}
      <div class="character-art-label">
        <span>${character.age} · ${escapeHtml(character.role)}</span>
        <h3>${escapeHtml(character.name)}</h3>
        <p>${escapeHtml(character.tagline)}</p>
      </div>
    </div>
    <div class="character-content">
      <div class="character-topline">
        <span class="character-role">${escapeHtml(character.schedule)}</span>
        <span class="relation-chip">${icon('heart')} ${relationStatus(rel)}</span>
      </div>
      <h2>${escapeHtml(character.name)}</h2>
      <p class="character-tagline">${escapeHtml(character.tagline)}</p>
      <div class="affection-block">
        <div class="affection-block-top"><span>${relationStage(rel.affection).label}</span><b>${rel.affection}% affection</b></div>
        <div class="affection-track"><i style="width:${rel.affection}%"></i></div>
        <div class="affection-block-foot"><span>${rel.dates} ${rel.dates === 1 ? 'date' : 'dates'} · ${rel.gifts} ${rel.gifts === 1 ? 'gift' : 'gifts'}</span><span>Loves ${escapeHtml(favorite?.name || 'kindness')}</span></div>
      </div>
      ${mainPane}
    </div>
  `;
}

function actionPane(character, rel) {
  const affection = rel.affection;
  const status = rel.status;
  const chatDisabled = game.data.energy < 10;
  const flirtDisabled = game.data.energy < 15 || affection < 20;
  const dateDisabled = game.data.energy < 25 || affection < 30;
  const proposeDisabled = status !== 'dating' || affection < 80 || game.data.coins < 250 || game.data.energy < 15;
  const marryDisabled = status !== 'engaged' || game.data.coins < 150;
  return `
    <div class="action-grid">
      ${actionButton('interact', character.id, 'heart', 'Chat', chatDisabled ? 'Not enough energy' : '10 energy · +7 affection', '', chatDisabled, 'chat')}
      ${actionButton('interact', character.id, 'sparkle', 'Flirt', flirtDisabled ? (affection < 20 ? 'Reach 20% affection' : 'Not enough energy') : '15 energy · +10 affection', 'romantic', flirtDisabled, 'flirt')}
      ${actionButton('gift-mode', character.id, 'gift', 'Give a gift', 'Coins · up to +22 affection', '', false, '')}
      ${actionButton('date-mode', character.id, 'moon', 'Ask on a date', dateDisabled ? (affection < 30 ? 'Reach 30% affection' : 'Not enough energy') : '25 energy · a little scene', 'romantic', dateDisabled, '')}
      ${actionButton('propose', character.id, 'ring', status === 'married' ? 'Already married' : status === 'engaged' ? 'Already engaged' : 'Propose', proposeDisabled ? (status !== 'dating' ? 'Date first, then propose' : affection < 80 ? 'Reach 80% affection' : 'Need 250 coins') : '250 coins · 15 energy', 'gold', proposeDisabled, '')}
      ${actionButton('marry', character.id, 'family', status === 'married' ? 'Happily married' : 'Wedding', marryDisabled ? (status !== 'engaged' ? 'Accept a proposal first' : 'Need 150 coins') : '150 coins · make it official', 'gold', marryDisabled, '')}
    </div>
    <div class="action-footer">
      <span>${icon('clock')} Met day <b>${rel.metDay}</b></span>
      <span>${icon('heart')} ${relationStatus(rel)}</span>
    </div>
  `;
}

function actionButton(action, charId, iconName, title, subtitle, className = '', disabled = false, kind = '') {
  return `<button class="action-button ${className}" data-action="${action}" data-char="${charId}" ${kind ? `data-kind="${kind}"` : ''} ${disabled ? 'disabled' : ''}>
    <span class="action-icon">${icon(iconName)}</span>
    <span class="action-text"><b>${escapeHtml(title)}</b><span>${escapeHtml(subtitle)}</span></span>
  </button>`;
}

function giftPane(character, favorite) {
  return `
    <div class="gift-head">
      <button class="back-button" data-action="back-to-character" data-char="${character.id}">${icon('back')} Back</button>
      <span class="gift-title">Gifts for ${escapeHtml(character.name)}</span>
    </div>
    <p class="gift-intro">${escapeHtml(character.name)}'s favourite is <b>${escapeHtml(favorite?.name || 'kindness')}</b>. A favourite gift adds +22 affection; a liked gift adds +14.</p>
    <div class="gift-grid">
      ${GIFTS.map((gift) => {
        const isFavorite = character.favoriteGift === gift.id;
        const isLiked = character.likedGifts.includes(gift.id);
        const bonus = isFavorite ? 22 : isLiked ? 14 : 7;
        const disabled = game.data.coins < gift.cost;
        return `<button class="gift-card" data-action="give-gift" data-char="${character.id}" data-gift="${gift.id}" ${disabled ? 'disabled' : ''}>
          <span class="gift-icon" style="${isFavorite ? 'background:#f2d6b2;color:#8d6129' : ''}">${icon(gift.icon)}</span>
          <b>${escapeHtml(gift.name)}</b>
          <span class="gift-bonus">${isFavorite ? 'Favourite · ' : isLiked ? 'Liked · ' : ''}+${bonus} affection</span>
          <span class="gift-cost">${icon('coin')} ${gift.cost}</span>
        </button>`;
      }).join('')}
    </div>
  `;
}

function datePane(character) {
  return `
    <div class="date-scene">
      <span class="date-location">${icon('pin')} ${escapeHtml(LOCATIONS[character.location].name)} · date</span>
      <h3>A little time, just for two</h3>
      <p class="date-intro">${escapeHtml(character.date.intro)}</p>
      <p class="date-question">“${escapeHtml(character.date.question)}”</p>
      <div class="date-options">
        ${character.date.options.map((option, index) => `<button class="date-option" data-action="date-choice" data-char="${character.id}" data-index="${index}">${escapeHtml(option.text)}</button>`).join('')}
      </div>
      <div class="action-footer"><span>${icon('energy')} 25 energy</span><button class="back-button" data-action="back-to-character" data-char="${character.id}">${icon('back')} Not now</button></div>
    </div>
  `;
}

function dateResultPane(character, modal) {
  const chosen = modal.chosenOption ?? 0;
  const option = character.date.options[chosen];
  return `
    <div class="date-scene">
      <span class="date-location">${icon('heart')} Date with ${escapeHtml(character.name)}</span>
      <h3>${chosen === correctDateOption(character) ? 'A perfect note' : 'A lovely evening'}</h3>
      <div class="date-result">
        <p>${escapeHtml(option.reply)}</p>
        <span class="date-score">${icon('heart')} +${option.bonus} affection</span>
      </div>
      <div class="action-footer">
        <span>${icon('sparkle')} ${relationStage(game.data.rels[character.id].affection).label}</span>
        <button class="back-button" data-action="back-to-character" data-char="${character.id}">${icon('back')} Back to ${escapeHtml(character.name)}</button>
      </div>
    </div>
  `;
}

function correctDateOption(character) {
  return character.date.options.reduce((best, option, index, list) => (option.bonus > list[best].bonus ? index : best), 0);
}

function summaryModal(modal) {
  const income = modal.income || incomeBreakdown();
  return `
    <div class="summary-hero">
      <div class="summary-moon">${icon('moon')}</div>
      <h3>Day ${game.data.day} begins</h3>
      <p>${dayName(game.data.day)} · ${game.data.energy} energy restored</p>
    </div>
    <div class="summary-rows">
      <div class="summary-row"><span>${icon('home')} Base household</span><b>+${income.base}</b></div>
      <div class="summary-row"><span>${icon('heart')} Partners at home</span><b>+${income.spouse}</b></div>
      <div class="summary-row"><span>${icon('work')} Grown offspring in business</span><b>+${income.child}</b></div>
      <div class="summary-row total"><span>${icon('coin')} Morning income</span><b>+${income.total}</b></div>
    </div>
    <div class="summary-actions"><button class="primary-button" data-action="close-modal">Step into the day</button></div>
  `;
}

function familyModal() {
  const spouses = getSpouses();
  return `
    <div class="modal-head"><h3>Start a family</h3><p>Welcome an offspring into a home built on love, care, and consent. Welcoming an offspring costs 200 coins.</p></div>
    <div class="modal-body">
      ${spouses.length ? `
        <p>Who would you like to start a family with?</p>
        <div class="menu-list" style="margin-top:13px">
          ${spouses.map((character) => `<button class="menu-row" data-action="have-child" data-char="${character.id}" ${game.data.coins < 200 ? 'disabled' : ''}>
            <span class="child-avatar" style="width:35px;height:35px;flex:0 0 auto">${renderPortrait(character, { mode: 'face' })}</span>
            <span>${escapeHtml(character.name)}<br /><small style="color:var(--ink-faint);font-weight:600">${plural(character.age, 'year')} · ${escapeHtml(character.role)}</small></span>
            <span class="menu-arrow">${game.data.coins < 200 ? 'Need 200 coins' : '200 coins'}</span>
          </button>`).join('')}
        </div>
        <div class="house-note" style="margin-top:15px">${icon('check')} <span>Offspring are welcomed as dependents and raised with care. They do not work. When they are grown, they may choose to join the family business.</span></div>
      ` : `<div class="empty-family"><b>The house is not ready yet.</b><p>Marry someone first, then you can decide together when to welcome an offspring.</p></div>`}
    </div>
  `;
}

function ceremonyModal(modal) {
  const type = modal.ceremony;
  if (type === 'baby') {
    const child = game.data.children.find((entry) => entry.id === modal.childId);
    if (!child) return '';
    const parent = characterById(child.parentId);
    return `
      <div class="ceremony">
        <div class="ceremony-rings">${icon('family')}</div>
        <h3>A new chapter</h3>
        <div class="portrait-pair" style="height:210px">
          <span style="width:170px;height:205px">${renderChildPortrait(child, 0)}</span>
        </div>
        <p>${escapeHtml(child.name)} has joined the family. ${escapeHtml(parent?.name || 'Your partner')} is glowing, the house smells like warm bread, and the future feels a little bigger.</p>
        <div class="ceremony-actions">
          <button class="primary-button" data-action="close-ceremony">Welcome home</button>
        </div>
      </div>`;
  }
  if (type === 'legacy') {
    return `
      <div class="ceremony">
        <div class="ceremony-rings">${icon('star')}</div>
        <h3>Your full house</h3>
        <p>Six hearts chose you. Three offspring grew up and chose the family business. The little house on the lane became a home with too many chairs, too much laughter, and a porch light that never goes out.</p>
        <div class="portrait-pair" style="height:180px">
          <span style="width:210px;height:180px">${renderPlayerPortrait(game.data.player, { mode: 'bust' })}</span>
          <span style="width:210px;height:180px">${renderPortrait(getSpouses()[0] || CHARACTERS[0], { mode: 'bust' })}</span>
        </div>
        <p style="margin-top:12px"><b>${game.data.totalEarned.toLocaleString()} coins earned · ${game.data.children.length} offspring · ${totalMarriages()} marriages</b></p>
        <div class="ceremony-actions">
          <button class="primary-button" data-action="close-modal">Keep living the story</button>
        </div>
      </div>`;
  }
  const character = characterById(modal.charId);
  const isWedding = type === 'wedding';
  return `
    <div class="ceremony">
      <div class="ceremony-rings">${icon(isWedding ? 'ring' : 'heart')}</div>
      <h3>${isWedding ? 'Just married' : 'She said yes'}</h3>
      <div class="portrait-pair">
        <span>${renderPlayerPortrait(game.data.player, { mode: 'bust' })}</span>
        <span>${renderPortrait(character, { mode: 'bust' })}</span>
      </div>
      <p>${isWedding
        ? `The town gathers, the petals fall, and ${escapeHtml(character.name)} takes your hand. This is not an ending — it is a door opening onto a whole life.`
        : `${escapeHtml(character.name)} looks at the ring, then at you. Her smile is the answer before she even speaks. “Yes. A thousand times, yes.”`}</p>
      <div class="ceremony-actions">
        <button class="primary-button" data-action="return-to-character" data-char="${character.id}">${isWedding ? 'Back to your partner' : 'Take her hand'}</button>
        <button class="ghost-button" data-action="close-ceremony">Close</button>
      </div>
    </div>
  `;
}

function menuModal() {
  const player = game.data.player;
  const soundLabel = game.ui.soundOn ? 'Sound is on' : 'Sound is off';
  return `
    <div class="modal-head">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="rail-avatar" style="width:54px;height:54px">${renderPlayerPortrait(player, { mode: 'face' })}</div>
        <div><h3 style="font-size:1.3rem">${escapeHtml(player.name)}</h3><p>${getPronouns(player).label} · Day ${game.data.day} · ${totalMarriages()} hearts</p></div>
      </div>
    </div>
    <div class="modal-body">
      <div class="menu-list">
        <button class="menu-row" data-action="save-now">${icon('check')} Save this moment <span class="menu-arrow">${icon('arrow')}</span></button>
        <button class="menu-row" data-action="rename-open">${icon('sparkle')} Change your name <span class="menu-arrow">${icon('arrow')}</span></button>
        <button class="menu-row" data-action="open-guide">${icon('book')} How to play <span class="menu-arrow">${icon('arrow')}</span></button>
        <button class="menu-row" data-action="open-about">${icon('heart')} About the game <span class="menu-arrow">${icon('arrow')}</span></button>
        <button class="menu-row" data-action="toggle-sound">${icon(game.ui.soundOn ? 'sound' : 'mute')} ${soundLabel} <span class="menu-arrow">${icon('arrow')}</span></button>
        <button class="menu-row" data-action="load-save">${icon('clock')} Load last save <span class="menu-arrow">${icon('arrow')}</span></button>
        <button class="menu-row danger" data-action="confirm-reset">${icon('lock')} Start over <span class="menu-arrow">${icon('arrow')}</span></button>
      </div>
    </div>
  `;
}

function renameModal() {
  return `
    <div class="modal-head"><h3>A new name</h3><p>Names hold a lot of story. Choose one that feels like you.</p></div>
    <div class="modal-body">
      <input id="rename-input" class="name-input" maxlength="18" value="${escapeHtml(game.data.player.name)}" autocomplete="off" />
      <div class="modal-actions">
        <button class="primary-button" data-action="rename-save">Save name</button>
        <button class="ghost-button" data-action="open-menu">Cancel</button>
      </div>
    </div>
  `;
}

function aboutModal() {
  return `
    <div class="modal-head"><h3>Hanami Hearts</h3><p>A cozy anime-inspired romance and family legacy sim, made for slow mornings and second chances.</p></div>
    <div class="modal-body">
      <div class="about-list">
        <div class="about-item">${icon('heart')}<div><b>Six adult romances</b><span>Aiko, Mei, Rin, Yuna, Hana, and Sora are all adults aged 24–31. Every relationship is consensual and grows through affection, dates, and honest choices.</span></div></div>
        <div class="about-item">${icon('home')}<div><b>Build a household</b><span>Marry the women you love, welcome offspring into a caring home, and watch the family grow. Marriage is optional; the story always moves at your pace.</span></div></div>
        <div class="about-item">${icon('family')}<div><b>Offspring are cared for, not employed</b><span>Offspring are dependents. They never work. Once grown, they may choose to join the family business and contribute to the household.</span></div></div>
        <div class="about-item">${icon('sparkle')}<div><b>Non-explicit by design</b><span>This is a romantic, non-explicit game. The art is tasteful and the focus is on affection, companionship, family, and the everyday magic of a small town.</span></div></div>
        <div class="about-item">${icon('check')}<div><b>Autosaves locally</b><span>Your story is stored in your browser. The menu can save, load, rename your character, or start over.</span></div></div>
      </div>
      <div class="modal-actions"><button class="primary-button" data-action="close-modal">Back to the story</button></div>
    </div>
  `;
}

function guideModal() {
  return `
    <div class="modal-head"><h3>How to play</h3><p>There is no wrong way to build a life — only your way.</p></div>
    <div class="modal-body">
      <div class="about-list">
        <div class="about-item">${icon('heart')}<div><b>1. Spend time with someone</b><span>Visit a location in town. Chat and flirt to raise affection, or bring a gift that matches her taste. Energy limits how much you can do before resting.</span></div></div>
        <div class="about-item">${icon('moon')}<div><b>2. Date, propose, marry</b><span>At 30% affection you can ask her on a date. At 80% — and while dating — you can propose. A wedding makes it official and brings a partner into your household.</span></div></div>
        <div class="about-item">${icon('work')}<div><b>3. Work and grow</b><span>Work a shift for coins. Rest to start a new day, restore energy, and collect household income. Partners and grown offspring contribute each morning.</span></div></div>
        <div class="about-item">${icon('family')}<div><b>4. Raise a family</b><span>Once married, welcome an offspring for 200 coins. Raise them as they grow. Offspring do not work. Once grown, they can choose to join the family business.</span></div></div>
        <div class="about-item">${icon('star')}<div><b>Dream board</b><span>Marry all six women, raise three grown offspring, and earn 5,000 coins to complete the family legacy. You can keep playing after the ending.</span></div></div>
      </div>
      <div class="modal-actions"><button class="primary-button" data-action="close-modal">Got it</button></div>
    </div>
  `;
}

function introModal() {
  const pronouns = getPronouns(game.data.player);
  return `
    <div class="summary-hero">
      <div class="summary-moon">${icon('sparkle')}</div>
      <h3>Welcome to Hanami Hollow</h3>
      <p>Day 1 · ${dayName(1)} · a town with room for you</p>
    </div>
    <div class="modal-body">
      <p>The train leaves you at the edge of town with one suitcase, a key to a little house on Camellia Lane, and the feeling that something important is about to begin.</p>
      <p style="margin-top:9px">The women of Hanami Hollow are not prizes to collect. They are people with work they love, friends who tease them, and hearts that open when someone shows up with patience and care. You will decide what kind of life you want to build.</p>
      <div class="about-list" style="margin-top:14px">
        <div class="about-item">${icon('heart')}<div><b>Meet all six</b><span>Each woman is an adult with her own favourite things, schedule, and idea of a perfect date.</span></div></div>
        <div class="about-item">${icon('home')}<div><b>Make a home</b><span>Marry, welcome offspring, and raise them with care. Grown offspring may choose the family business.</span></div></div>
        <div class="about-item">${icon('sparkle')}<div><b>No rush</b><span>Autosaves locally. The story can wait for you.</span></div></div>
      </div>
      <div class="modal-actions"><button class="primary-button" data-action="close-modal">Step into town</button></div>
    </div>
  `;
}

function confirmResetModal() {
  return `
    <div class="modal-head"><h3>Start over?</h3><p>This will erase your current story, household, and all local save data. It cannot be undone.</p></div>
    <div class="modal-body">
      <div class="modal-actions">
        <button class="primary-button" data-action="reset-game" style="background:#a74b5d">Yes, start over</button>
        <button class="ghost-button" data-action="open-menu">Keep my story</button>
      </div>
    </div>
  `;
}

function legacyModal() {
  return ceremonyModal({ ceremony: 'legacy' });
}

/* ------------------------------------------------------------------ Actions */
function showToast(message, iconName = 'sparkle') {
  const root = $('#toast-root');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `${icon(iconName)}<span>${escapeHtml(message)}</span>`;
  root.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 260);
  }, 2500);
}

function floatHearts(element, count = 3) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = index % 2 ? '♡' : '♥';
    heart.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 48}px`;
    heart.style.top = `${rect.top + 8 + Math.random() * 16}px`;
    heart.style.fontSize = `${12 + Math.random() * 8}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  }
}

function setView(view) {
  game.ui.view = view;
  renderAll();
}

function addLog(text, iconName = 'sparkle') {
  game.data.log.unshift({ text, icon: iconName, day: game.data.day });
  game.data.log = game.data.log.slice(0, 50);
}

function useEnergy(amount) {
  if (game.data.energy < amount) {
    showToast('Not enough energy. Rest for the night to restore it.', 'moon');
    return false;
  }
  game.data.energy -= amount;
  game.data.actionsToday += 1;
  return true;
}

function addAffection(character, amount) {
  const rel = game.data.rels[character.id];
  rel.affection = clamp(rel.affection + amount, 0, 100);
  return rel;
}

function nextLine(character, rel, lines) {
  if (!lines.length) return '';
  const index = rel.lastLine % lines.length;
  rel.lastLine += 1;
  return lines[index];
}

function interact(characterId, kind, element) {
  const character = characterById(characterId);
  const rel = game.data.rels[character.id];
  const isFlirt = kind === 'flirt';
  const cost = isFlirt ? 15 : 10;
  const amount = isFlirt ? 10 : 7;
  if (isFlirt && rel.affection < 20) {
    showToast('She is not ready for flirting yet. Build a little more affection first.', 'heart');
    return;
  }
  if (!useEnergy(cost)) return;
  const line = nextLine(character, rel, isFlirt ? character.flirt : character.chat);
  addAffection(character, amount);
  rel.metDay = rel.metDay || game.data.day;
  const stage = relationStage(rel.affection);
  const feedback = {
    text: line,
    sign: character.name,
    feeling: isFlirt || rel.affection >= 45,
  };
  addLog(`${isFlirt ? 'Flirted with' : 'Spent time with'} ${character.name} (+${amount} affection).`, isFlirt ? 'heart' : 'sparkle');
  game.ui.modal = { type: 'character', charId: character.id, mode: 'default', feedback };
  saveGame();
  renderAll();
  renderModal();
  floatHearts(element || $('.character-content'), isFlirt ? 4 : 2);
  playSound(isFlirt ? 'heart' : 'tap');
  showToast(`${character.name} · ${stage.label}`, isFlirt ? 'heart' : 'sparkle');
  checkAchievements();
}

function openCharacter(characterId) {
  game.ui.modal = { type: 'character', charId: characterId, mode: 'default', feedback: null };
  renderModal();
  playSound('soft');
}

function openGiftMode(characterId) {
  game.ui.modal = { type: 'character', charId: characterId, mode: 'gifts', feedback: null };
  renderModal();
}

function openDateMode(characterId) {
  const rel = game.data.rels[characterId];
  if (rel.affection < 30) {
    showToast('A date needs at least 30% affection. Keep spending time together.', 'heart');
    return;
  }
  if (game.data.energy < 25) {
    showToast('Not enough energy for a date. Rest first.', 'moon');
    return;
  }
  game.ui.modal = { type: 'character', charId: characterId, mode: 'date', feedback: null };
  renderModal();
}

function chooseDate(characterId, index) {
  const character = characterById(characterId);
  const rel = game.data.rels[characterId];
  if (rel.affection < 30) {
    showToast('A date needs at least 30% affection.', 'heart');
    return;
  }
  if (!useEnergy(25)) return;
  const option = character.date.options[index] || character.date.options[0];
  addAffection(character, option.bonus);
  rel.dates += 1;
  game.data.stats.dates += 1;
  addLog(`Went on a date with ${character.name} at ${LOCATIONS[character.location].name} (+${option.bonus} affection).`, 'heart');
  game.ui.modal = { type: 'character', charId: character.id, mode: 'date-result', chosenOption: index, feedback: null };
  saveGame();
  renderAll();
  renderModal();
  playSound('heart');
  showToast(`${character.name} · +${option.bonus} affection`, 'heart');
  checkAchievements();
}

function giveGift(characterId, giftId) {
  const character = characterById(characterId);
  const gift = GIFTS.find((entry) => entry.id === giftId);
  if (!gift) return;
  if (game.data.coins < gift.cost) {
    showToast('Not enough coins for that gift. Work a shift or rest for income.', 'coin');
    return;
  }
  game.data.coins -= gift.cost;
  game.data.stats.gifts += 1;
  game.data.rels[characterId].gifts += 1;
  const isFavorite = character.favoriteGift === gift.id;
  const isLiked = character.likedGifts.includes(gift.id);
  const affection = isFavorite ? 22 : isLiked ? 14 : 7;
  addAffection(character, affection);
  let line;
  if (isFavorite) {
    line = `“${gift.name}. You remembered.” ${character.name} holds it carefully, as if it were something far more precious than it is. “This is my favourite. How did you know?”`;
  } else if (isLiked) {
    line = `“Oh — this is lovely.” ${character.name} turns the ${gift.name.toLowerCase()} over in her hands, smiling. “I really like it. Thank you.”`;
  } else {
    line = `“That's thoughtful of you.” ${character.name} gives you a warm, surprised smile. “I didn't expect that. Thank you.”`;
  }
  const feedback = { text: line, sign: character.name, feeling: isFavorite || isLiked };
  addLog(`Gave ${character.name} a ${gift.name} (+${affection} affection).`, 'gift');
  game.ui.modal = { type: 'character', charId: character.id, mode: 'default', feedback };
  saveGame();
  renderAll();
  renderModal();
  floatHearts($('.character-content'), isFavorite ? 5 : 3);
  playSound(isFavorite ? 'heart' : 'coin');
  showToast(`${gift.name} · +${affection} affection`, isFavorite ? 'heart' : 'gift');
  checkAchievements();
}

function propose(characterId) {
  const character = characterById(characterId);
  const rel = game.data.rels[characterId];
  if (rel.status !== 'dating') {
    showToast('Take her on a date and build your relationship first.', 'ring');
    return;
  }
  if (rel.affection < 80) {
    showToast('A proposal needs at least 80% affection.', 'heart');
    return;
  }
  if (game.data.coins < 250) {
    showToast('A ring costs 250 coins. Work a shift or rest for income.', 'coin');
    return;
  }
  if (!useEnergy(15)) return;
  game.data.coins -= 250;
  rel.status = 'engaged';
  addLog(`Proposed to ${character.name} — she said yes.`, 'ring');
  game.ui.modal = { type: 'ceremony', ceremony: 'proposal', charId: character.id };
  saveGame();
  renderAll();
  renderModal();
  playSound('ceremony');
  checkAchievements();
}

function marry(characterId) {
  const character = characterById(characterId);
  const rel = game.data.rels[characterId];
  if (rel.status !== 'engaged') {
    showToast('First, propose and let her say yes.', 'ring');
    return;
  }
  if (game.data.coins < 150) {
    showToast('The wedding costs 150 coins. Work a shift first.', 'coin');
    return;
  }
  game.data.coins -= 150;
  rel.status = 'married';
  addLog(`Married ${character.name}. The house grew warmer.`, 'heart');
  game.ui.modal = { type: 'ceremony', ceremony: 'wedding', charId: character.id };
  saveGame();
  renderAll();
  renderModal();
  playSound('ceremony');
  showToast(`${character.name} is now your partner.`, 'heart');
  checkAchievements();
}

function startFamily(characterId) {
  const character = characterById(characterId);
  if (game.data.coins < 200) {
    showToast('Welcoming an offspring costs 200 coins. Work a shift first.', 'coin');
    return;
  }
  game.data.coins -= 200;
  const usedNames = new Set(game.data.children.map((child) => child.name));
  const name = CHILD_NAMES.find((entry) => !usedNames.has(entry)) || `${pick(CHILD_NAMES)} ${game.data.children.length + 1}`;
  const child = {
    id: `child-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    name,
    parentId: character.id,
    stage: 0,
    working: false,
    bornDay: game.data.day,
    skin: character.skin,
    hair: character.hair,
    hairStyle: character.hairStyle,
    eye: character.eye,
    accent: character.accent,
    outfit: pick(['#e7b6a5', '#a8c0b0', '#a8bfd0', '#d8c1e0', '#e6c88e']),
  };
  game.data.children.push(child);
  addLog(`Welcomed ${child.name} into the family with ${character.name}.`, 'family');
  game.ui.modal = { type: 'ceremony', ceremony: 'baby', childId: child.id };
  saveGame();
  renderAll();
  renderModal();
  playSound('ceremony');
  showToast(`${child.name} joined the family.`, 'family');
  checkAchievements();
}

function raiseChild(childId) {
  const child = game.data.children.find((entry) => entry.id === childId);
  if (!child || child.stage >= 3) return;
  const cost = STAGE_COSTS[child.stage + 1];
  if (game.data.coins < cost) {
    showToast(`Raising ${child.name} to the next stage costs ${cost} coins.`, 'coin');
    return;
  }
  game.data.coins -= cost;
  child.stage += 1;
  const stageLabel = STAGES[child.stage];
  addLog(`${child.name} grew into a ${stageLabel.toLowerCase()}.`, 'sparkle');
  saveGame();
  renderAll();
  playSound(child.stage === 3 ? 'heart' : 'soft');
  showToast(child.stage === 3 ? `${child.name} is grown. They can choose to join the family business.` : `${child.name} is now a ${stageLabel.toLowerCase()}.`, 'family');
  checkAchievements();
}

function toggleChildWork(childId) {
  const child = game.data.children.find((entry) => entry.id === childId);
  if (!child || child.stage !== 3) return;
  child.working = !child.working;
  addLog(`${child.name} ${child.working ? 'chose to join' : 'stepped back from'} the family business.`, 'work');
  saveGame();
  renderAll();
  playSound('coin');
  showToast(`${child.name} ${child.working ? 'joins the family business' : 'is taking some time for themselves'}.`, 'work');
  checkAchievements();
}

function workShift(element) {
  if (!useEnergy(25)) return;
  const base = 55 + Math.floor(Math.random() * 31);
  const bonus = totalMarriages() * 4;
  const earned = base + bonus;
  game.data.coins += earned;
  game.data.totalEarned += earned;
  game.data.stats.shifts += 1;
  addLog(`Worked a shift at the inn and earned ${earned} coins.`, 'work');
  saveGame();
  renderAll();
  playSound('coin');
  floatHearts(element || $('#resource-bar'), 2);
  showToast(`Shift complete · +${earned} coins`, 'coin');
}

function endDay() {
  const income = incomeBreakdown();
  game.data.coins += income.total;
  game.data.totalEarned += income.total;
  game.data.day += 1;
  game.data.actionsToday = 0;
  game.data.energy = game.data.maxEnergy;
  addLog(`Rested at home. Morning brought ${income.total} coins from the household.`, 'moon');
  saveGame();
  renderAll();
  game.ui.modal = { type: 'summary', income };
  renderModal();
  playSound('soft');
  checkEndgame();
}

function checkAchievements() {
  if (!game.data) return;
  const definitions = achievementDefinitions();
  definitions.forEach((definition) => {
    if (!game.data.achievements.includes(definition.id) && definition.check()) {
      game.data.achievements.push(definition.id);
      addLog(`Keepsake unlocked: ${definition.label}.`, definition.icon);
      showToast(`Keepsake unlocked · ${definition.label}`, definition.icon);
    }
  });
  saveGame();
}

function checkEndgame() {
  if (!game.data || game.data.completed) return false;
  const grown = getGrownChildren().length;
  if (totalMarriages() === GOALS.marriages && grown >= GOALS.grown && game.data.totalEarned >= GOALS.earned) {
    game.data.completed = true;
    addLog('The dream board is complete: a full house and a family legacy.', 'star');
    checkAchievements();
    saveGame();
    setTimeout(() => {
      game.ui.modal = { type: 'legacy' };
      renderModal();
      playSound('ceremony');
    }, 500);
    return true;
  }
  return false;
}

/* --------------------------------------------------------------- Interaction */
function handleDocumentClick(event) {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  const charId = target.dataset.char;
  const childId = target.dataset.child;
  playSound('tap');

  if (action === 'creator-skin') {
    game.ui.creator.skinId = target.dataset.id;
    updateCreatorPreview();
    return;
  }
  if (action === 'creator-hair-style') {
    game.ui.creator.hairStyle = target.dataset.id;
    updateCreatorPreview();
    return;
  }
  if (action === 'creator-hair-color') {
    game.ui.creator.hairColorId = target.dataset.id;
    updateCreatorPreview();
    return;
  }
  if (action === 'creator-eye') {
    game.ui.creator.eyeId = target.dataset.id;
    updateCreatorPreview();
    return;
  }
  if (action === 'creator-outfit') {
    game.ui.creator.outfitId = target.dataset.id;
    updateCreatorPreview();
    return;
  }
  if (action === 'creator-accessory') {
    game.ui.creator.accessory = target.dataset.id;
    updateCreatorPreview();
    return;
  }
  if (action === 'back-to-title') {
    setScreen('title');
    updateContinueButton();
    return;
  }
  if (action === 'new-game') {
    setScreen('creator');
    renderCreator();
    return;
  }
  if (action === 'start-story') {
    beginNewStory();
    return;
  }
  if (action === 'continue-game') {
    const saved = readSave();
    if (!saved) {
      showToast('No saved story yet. Begin a new one.', 'sparkle');
      return;
    }
    game.data = saved;
    enterGame();
    return;
  }
  if (action === 'go-view') {
    if (game.data) setView(target.dataset.view);
    return;
  }
  if (action === 'work-shift') {
    workShift(target);
    return;
  }
  if (action === 'end-day') {
    endDay();
    return;
  }
  if (action === 'open-character') {
    openCharacter(charId);
    return;
  }
  if (action === 'interact') {
    interact(charId, target.dataset.kind, target);
    return;
  }
  if (action === 'gift-mode') {
    openGiftMode(charId);
    return;
  }
  if (action === 'back-to-character') {
    game.ui.modal = { type: 'character', charId, mode: 'default', feedback: null };
    renderModal();
    return;
  }
  if (action === 'give-gift') {
    giveGift(charId, target.dataset.gift);
    return;
  }
  if (action === 'date-mode') {
    openDateMode(charId);
    return;
  }
  if (action === 'date-choice') {
    chooseDate(charId, Number(target.dataset.index));
    return;
  }
  if (action === 'propose') {
    propose(charId);
    return;
  }
  if (action === 'marry') {
    marry(charId);
    return;
  }
  if (action === 'return-to-character') {
    game.ui.modal = { type: 'character', charId, mode: 'default', feedback: null };
    renderModal();
    return;
  }
  if (action === 'family-modal') {
    openModal('family');
    return;
  }
  if (action === 'have-child') {
    startFamily(charId);
    return;
  }
  if (action === 'raise-child') {
    raiseChild(childId);
    return;
  }
  if (action === 'toggle-child-work') {
    toggleChildWork(childId);
    return;
  }
  if (action === 'close-modal' || action === 'close-ceremony') {
    closeModal();
    return;
  }
  if (action === 'open-menu') {
    openModal('menu');
    return;
  }
  if (action === 'open-about') {
    openModal('about');
    return;
  }
  if (action === 'open-guide') {
    openModal('guide');
    return;
  }
  if (action === 'rename-open') {
    openModal('rename');
    return;
  }
  if (action === 'rename-save') {
    const input = $('#rename-input');
    const name = input?.value.trim();
    if (!name) {
      showToast('A name cannot be empty.', 'sparkle');
      input?.focus();
      return;
    }
    game.data.player.name = name.slice(0, 18);
    addLog(`Chose a new name: ${game.data.player.name}.`, 'sparkle');
    saveGame();
    renderAll();
    closeModal();
    showToast(`You are now ${game.data.player.name}.`, 'sparkle');
    return;
  }
  if (action === 'save-now') {
    saveGame();
    showToast('Story saved.', 'check');
    closeModal();
    return;
  }
  if (action === 'load-save') {
    const saved = readSave();
    if (!saved) {
      showToast('There is no earlier save to load.', 'sparkle');
      return;
    }
    game.data = saved;
    game.ui.soundOn = saved.settings.sound !== false;
    closeModal();
    renderAll();
    showToast('Loaded your last save.', 'check');
    return;
  }
  if (action === 'toggle-sound') {
    game.ui.soundOn = !game.ui.soundOn;
    if (game.data) {
      game.data.settings.sound = game.ui.soundOn;
      saveGame();
    }
    updateSoundButton();
    if (game.ui.modal?.type === 'menu') renderModal();
    showToast(game.ui.soundOn ? 'Sound on' : 'Sound off', game.ui.soundOn ? 'sound' : 'mute');
    return;
  }
  if (action === 'confirm-reset') {
    openModal('confirm-reset');
    return;
  }
  if (action === 'reset-game') {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
    return;
  }
}

function handleInput(event) {
  if (event.target.id === 'player-name') {
    game.ui.creator.name = event.target.value;
    updateCreatorPreview();
  }
  if (event.target.id === 'player-pronoun') {
    game.ui.creator.pronoun = event.target.value;
    updateCreatorPreview();
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape' && game.ui.modal) {
    if (game.ui.modal.type === 'character') closeModal();
    else closeModal();
  }
  if (event.key === 'Enter' && game.ui.modal?.type === 'rename') {
    const input = $('#rename-input');
    if (input && document.activeElement === input) {
      $('[data-action="rename-save"]')?.click();
    }
  }
}

function updateSoundButton() {
  const button = $('#sound-button');
  if (button) button.innerHTML = icon(game.ui.soundOn ? 'sound' : 'mute');
}

function init() {
  renderTitle();
  startPetals();
  $('#icon-town').innerHTML = icon('town');
  $('#icon-hearts').innerHTML = icon('heart');
  $('#icon-home').innerHTML = icon('home');
  $('#icon-ledger').innerHTML = icon('ledger');
  $('#icon-menu').innerHTML = icon('menu');
  updateSoundButton();
  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('input', handleInput);
  document.addEventListener('change', handleInput);
  document.addEventListener('keydown', handleKeydown);
  const saved = readSave();
  if (saved) {
    game.ui.soundOn = saved.settings.sound !== false;
    updateSoundButton();
  }
}

init();
