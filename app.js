/* Yacht Service Ltd — Fall 2026.
   Everything here is mock: the money, the texts, the yard. */

/* ------------------------------------------------------------------ state */
const KEY = 'ysl.fall2026.v1';

function freshState() {
  const boats = {};
  BOATS.forEach(b => {
    boats[b.slug] = {
      status: b.status,
      week: b.week,
      deposit: b.deposit || 0,
      method: b.depositMethod || 'card',
      links: b.linksSent || 1,
      called: false
    };
  });
  const weeks = {};
  WEEKS.forEach(w => { weeks[w.id] = { booked: w.booked }; });
  return { boats, weeks, card: '4242', declineMode: false, declinedOnce: false };
}

let S = (() => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.boats && p.weeks && Object.keys(p.boats).length === BOATS.length) return p;
    }
  } catch (e) { /* private mode, first run — start clean */ }
  return freshState();
})();

function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function resetAll() { S = freshState(); save(); }

const st = slug => S.boats[slug];
const wk = id => S.weeks[id];
const isHeld = s => HELD_STATES.indexOf(s) >= 0;
const left = id => Math.max(0, WEEK_BY_ID[id].cap - wk(id).booked);

function tally() {
  let held = 0, down = 0, waiting = 0, calls = 0;
  BOATS.forEach(b => {
    const s = st(b.slug);
    if (isHeld(s.status)) { held++; down += s.deposit || 0; }
    else if (s.status === 'callme') calls++;
    else waiting++;
  });
  return { held, down, waiting, calls, total: BOATS.length };
}

/* ------------------------------------------------------------------ words */
const money = n => '$' + n.toLocaleString('en-US');
const money2 = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function leftLabel(id) {
  const n = left(id);
  if (n <= 0) return 'Full';
  if (n === 1) return '1 spot left';
  if (n <= 3) return 'Filling · ' + n + ' left';
  if (n <= 5) return n + ' spots left';
  return 'Open · ' + n + ' spots';
}

const CHIP = {
  sent:   { t: 'Waiting',      c: 'chip--wait' },
  chase:  { t: 'No reply ×2',  c: 'chip--heat' },
  callme: { t: 'Said call me', c: 'chip--solid' },
  held:   { t: 'Held',         c: 'chip--held' },
  hauled: { t: 'Hauled',       c: 'chip--held' },
  stored: { t: 'Wrapped',      c: 'chip--wrapped' }
};
const chip = s => `<span class="chip ${CHIP[s].c}"><span class="dot"></span>${CHIP[s].t}</span>`;

const ORDER = { callme: 0, chase: 1, sent: 2, held: 3, hauled: 4, stored: 5 };

function variantFor(slug) {
  const s = st(slug).status;
  if (s === 'stored') return 'wrapped';
  if (s === 'hauled') return 'hauled';
  return 'afloat';
}

function sceneFor(b) {
  const v = variantFor(b.slug);
  return Art.scene(b, { variant: v, unstepped: v !== 'afloat' && b.rig === 'sail' });
}

/* ------------------------------------------------------------------ icons */
const I = {
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19 8 12l7-7"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 9.5 17.5 19.5 6.5"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6.6 3.5h-2A1.6 1.6 0 0 0 3 5.1C3 13.9 10.1 21 18.9 21a1.6 1.6 0 0 0 1.6-1.6v-2a1.1 1.1 0 0 0-.85-1.07l-3.1-.7a1.1 1.1 0 0 0-1.13.45l-1 1.4a13.2 13.2 0 0 1-5.9-5.9l1.4-1a1.1 1.1 0 0 0 .45-1.13l-.7-3.1A1.1 1.1 0 0 0 6.6 3.5Z"/></svg>`,
  msg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.4c0 4.2-3.8 7.6-8.5 7.6a9.7 9.7 0 0 1-2.6-.35L4.5 20.2l1.3-3.2a7.2 7.2 0 0 1-2.3-5.2c0-4.2 3.8-7.6 8.5-7.6s8.5 3.4 8.5 7.6Z"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z"/></svg>`,
  cal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="5" width="17.6" height="16" rx="3"/><path d="M3.2 10h17.6M8 3v4M16 3v4"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.3 1.3"/><path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.3-1.3"/></svg>`,
  night: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z"/></svg>`,
  board: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="4.6" height="16" rx="1.4"/><rect x="9.7" y="4" width="4.6" height="11" rx="1.4"/><rect x="16.4" y="4" width="4.6" height="14" rx="1.4"/></svg>`,
  warn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 7v6.5M12 17.2v.2"/><circle cx="12" cy="12" r="9"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  face: `<svg class="faceid" viewBox="0 0 24 24"><g class="brk"><path d="M3 8.4V5.6A2.6 2.6 0 0 1 5.6 3h2.8"/><path d="M21 8.4V5.6A2.6 2.6 0 0 0 18.4 3h-2.8"/><path d="M3 15.6v2.8A2.6 2.6 0 0 0 5.6 21h2.8"/><path d="M21 15.6v2.8A2.6 2.6 0 0 1 18.4 21h-2.8"/></g><g class="ft" style="--len:34"><path d="M8.6 9.4v1.9M15.4 9.4v1.9M12 9.6v3.6h-1.1"/><path d="M9 16.1c1.7 1.2 4.3 1.2 6 0"/></g></svg>`
};

/* --------------------------------------------------------------- toasts */
function toast(title, body) {
  const wrap = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${Art.mark(24)}<div><div class="tt">${esc(title)}</div>${body ? `<div class="tb">${esc(body)}</div>` : ''}</div>`;
  wrap.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 260);
  }, 2700);
}

/* ---------------------------------------------------------------- sheets */
let sheetOpen = false;
function openSheet(inner, opts) {
  opts = opts || {};
  const root = document.getElementById('modal');
  root.classList.add('on');
  root.innerHTML = `<div class="scrim" data-act="closesheet"></div>
    <div class="sheet ${opts.dark ? 'sheet--dark' : ''}"><div class="grabber"></div>${inner}</div>`;
  sheetOpen = true;
  if (opts.mount) opts.mount(root);
}
function closeSheet() {
  if (!sheetOpen) return;
  const root = document.getElementById('modal');
  const sh = root.querySelector('.sheet'), sc = root.querySelector('.scrim');
  if (sh) sh.classList.add('out');
  if (sc) sc.classList.add('out');
  sheetOpen = false;
  setTimeout(() => { root.classList.remove('on'); root.innerHTML = ''; }, 260);
}

function callSheet(slug) {
  const b = BOAT_BY_SLUG[slug];
  openSheet(`
    <div style="padding:26px 24px 20px;text-align:center">
      <div class="tag quiet">Calling</div>
      <div class="t1" style="margin-top:9px">${esc(b.owner)}</div>
      <div class="num" style="margin-top:6px;font-size:17px;color:var(--mute)">${b.phone}</div>
      <div class="meta" style="margin-top:16px">${esc(b.name)} · ${esc(b.berth)}</div>
      <div style="display:flex;gap:11px;margin-top:24px">
        <button class="btn btn--ghost btn--sm" data-act="closesheet">Cancel</button>
        <button class="btn btn--primary btn--sm" data-act="ringing" data-slug="${slug}">${I.phone} Call</button>
      </div>
    </div>`, { dark: true });
}

function textSheet(slug, from) {
  const b = BOAT_BY_SLUG[slug];
  const s = st(slug);
  const w = WEEK_BY_ID[s.week];
  const msg = from === 'todd'
    ? `Hi ${b.first} — Todd at Yacht Service. ${b.name} is down for the ${w.full.replace('Week','week')}. Send back a yes and I'll lock it in.`
    : `Hey Todd — it's ${b.first}. ${b.name} is all set for the ${w.label} week. Thanks.`;
  openSheet(`
    <div class="pay-head">
      ${Art.mark(30)}
      <div class="who"><div class="nm">${from === 'todd' ? esc(b.first) + ' ' + esc(b.owner.split(' ').slice(-1)[0]) : 'Todd Brice'}</div>
        <div class="meta">${from === 'todd' ? b.phone : YARD.phone}</div></div>
      <button class="iconbtn" data-act="closesheet" aria-label="Close">${I.x}</button>
    </div>
    <div style="padding:16px 20px 4px"><div class="msg">${esc(msg)}</div></div>
    <div class="compose"><div class="fld quiet">Text Message</div>
      <button class="iconbtn" style="background:var(--buoy);color:var(--wrap);width:38px;height:38px;border-radius:50%"
        data-act="sendtext" data-slug="${slug}" data-from="${from}" aria-label="Send">${I.send}</button></div>
    <div class="pay-legal">Nothing actually sends. It's a demo.</div>`);
}

/* ---------------------------------------------------------------- router */
const ROUTES = [
  [/^\/$/,                        'switchboard', 0, 'switch'],
  [/^\/b\/([a-z-]+)$/,            'boat',        1, 'cust'],
  [/^\/b\/([a-z-]+)\/week$/,      'week',        2, 'cust'],
  [/^\/b\/([a-z-]+)\/pay$/,       'pay',         3, 'cust'],
  [/^\/b\/([a-z-]+)\/confirmed$/, 'confirmed',   4, 'cust'],
  [/^\/b\/([a-z-]+)\/status$/,    'status',      2, 'cust'],
  [/^\/todd$/,                    'tonight',     1, 'todd'],
  [/^\/todd\/season$/,            'season',      2, 'todd'],
  [/^\/todd\/boat\/([a-z-]+)$/,   'toddboat',    2, 'todd']
];

let cur = { depth: -1, group: '' };
let filter = 'chase';

function resolve(path) {
  for (const [re, name, depth, group] of ROUTES) {
    const m = path.match(re);
    if (m) return { name, depth, group, arg: m[1] };
  }
  return { name: 'lost', depth: 0, group: 'switch', arg: null };
}

function go(hash, replace) {
  if (replace) location.replace(location.pathname + location.search + hash);
  else location.hash = hash;
}

function navigate() {
  const path = (location.hash || '#/').slice(1) || '/';
  const r = resolve(path);
  if (r.arg && !BOAT_BY_SLUG[r.arg]) r.name = 'lost';

  closeSheet();
  const view = SCREENS[r.name](r.arg);
  const stage = document.getElementById('app');
  const prev = stage.querySelector('.screen:not(.exit)');

  let dir = 'nav-push';
  if (cur.depth < 0) dir = '';
  else if (r.group !== cur.group) dir = 'nav-flip';
  else if (r.depth < cur.depth) dir = 'nav-pop';

  const next = document.createElement('section');
  next.className = 'screen' + (dir ? ' enter' : '') + (view.cls ? ' ' + view.cls : '');
  next.dataset.world = view.world;
  next.innerHTML = view.html;

  stage.className = 'stage ' + dir;
  if (prev && dir) {
    prev.classList.add('exit');
    prev.classList.remove('enter');
    setTimeout(() => prev.remove(), 400);
  } else if (prev) prev.remove();

  stage.appendChild(next);
  cur = { depth: r.depth, group: r.group };

  const dev = document.getElementById('device');
  dev.style.setProperty('--sb-fg', view.world === 'paper' ? 'var(--ink-dark)' : 'var(--ink)');
  dev.style.background = view.world === 'paper' ? 'var(--paper)' : 'var(--night)';
  document.querySelector('meta[name=theme-color]').setAttribute('content', view.world === 'paper' ? '#E6DDCC' : '#0E1512');

  if (view.mount) view.mount(next);
  next.scrollTop = 0;
}

/* --------------------------------------------------------------- partials */
function topbar(opts) {
  const back = opts.back
    ? `<button class="iconbtn" data-act="go" data-to="${opts.back}" aria-label="Back">${I.back}</button>`
    : `<button class="iconbtn" data-act="go" data-to="#/" aria-label="Yacht Service Ltd">${Art.mark(26)}</button>`;
  const right = opts.right || '<span class="spacer38"></span>';
  return `<div class="topbar">${back}<div class="wordmark">${esc(opts.title || YARD.name)}</div>${right}</div>`;
}

function knob(state) {
  if (state === 'done') return `<span class="knob">${I.check}</span>`;
  if (state === 'now') return `<span class="knob"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/></svg></span>`;
  return `<span class="knob"></span>`;
}

function stepState(i, done, status) {
  if (i < done) return 'done';
  if (i !== done) return 'todo';
  if (status === 'hauled') return 'now';
  return isHeld(status) ? 'next' : 'todo';
}

function timeline(b) {
  const s = st(b.slug);
  const done = b.done || 0;
  return `<div class="line">${b.steps.map((step, i) => {
    const state = stepState(i, done, s.status);
    return `<div class="step ${state}">${knob(state)}
      <div class="lbl">${esc(step.label)}</div>
      <div class="sub">${esc(step.detail)}</div>
    </div>`;
  }).join('')}</div>`;
}

function yardNote(b) {
  return `<div class="note">
    <div class="hand">${esc(b.note)}</div>
    ${b.early ? `<div class="hand" style="margin-top:6px">${esc(b.early)}</div>` : ''}
    <svg class="scribble" viewBox="0 0 74 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M2 5c9-4 16 1 25-2s16 3 26-1"/></svg>
    <div class="who">Yard note · ${esc(YARD.owner)}</div>
  </div>`;
}

function tabs(active) {
  const t = (id, href, label, icon) =>
    `<button class="tab" data-act="go" data-to="${href}" ${active === id ? 'aria-current="page"' : ''}>${icon}<span>${label}</span></button>`;
  return `<nav class="tabs">
    ${t('tonight', '#/todd', 'Tonight', I.night)}
    ${t('season', '#/todd/season', 'The season', I.board)}
  </nav>`;
}

function boatCard(b, extra) {
  const s = st(b.slug);
  return `<div class="boatcard">
    ${sceneFor(b)}
    <div class="corner">${extra || ''}</div>
    <div class="plate">
      <div class="t2">${esc(b.name)}</div>
      <div class="meta" style="color:rgba(232,228,216,.72);margin-top:3px">
        ${esc(b.make)}<br>${esc(b.berth)} · with us since ${b.since}
      </div>
    </div>
  </div>`;
}

function ticks(id) {
  const w = WEEK_BY_ID[id], booked = wk(id).booked;
  return `<span class="ticks">${Array.from({ length: w.cap },
    (_, i) => `<i class="${i < booked ? 'on' : ''}"></i>`).join('')}</span>`;
}

/* ---------------------------------------------------------------- screens */
const SCREENS = {};

/* the yard at dusk — travel lift, a boat in the slings, the far shore */
const SB_ART = `<svg viewBox="0 0 390 208" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="sbsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#070C0A"/><stop offset=".46" stop-color="#121E19"/>
      <stop offset=".86" stop-color="#2C3E35"/><stop offset="1" stop-color="#40564A"/>
    </linearGradient>
    <linearGradient id="sbwtr" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3B4F45"/><stop offset=".3" stop-color="#1B2622"/>
      <stop offset="1" stop-color="#0B120F"/>
    </linearGradient>
    <radialGradient id="sbmoon" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#E6DDCC" stop-opacity=".3"/>
      <stop offset=".45" stop-color="#C4A46A" stop-opacity=".1"/>
      <stop offset="1" stop-color="#C4A46A" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="390" height="168" fill="url(#sbsky)"/>
  <circle cx="72" cy="42" r="34" fill="url(#sbmoon)"/>
  <circle cx="72" cy="42" r="7" fill="#E6DDCC" opacity=".62"/>
  <rect y="168" width="390" height="40" fill="url(#sbwtr)"/>

  <g fill="#060A09" opacity=".82">
    <path d="M0,158 L 24,158 L 30,150 L 58,150 L 64,158 L 118,158 L 124,148 L 148,148 L 152,158 L 390,158 L 390,169 L 0,169 Z"/>
  </g>
  <path d="M166,158 L 166,132 M177,158 L 177,139" stroke="#060A09" stroke-width="3" opacity=".82"/>

  <g fill="#070C0A">
    <rect x="196" y="40" width="170" height="14" rx="4"/>
    <rect x="356" y="25" width="20" height="16" rx="3"/>
    <rect x="204" y="54" width="12" height="108" rx="2"/>
    <rect x="344" y="54" width="12" height="108" rx="2"/>
    <rect x="196" y="158" width="30" height="13" rx="6"/>
    <rect x="336" y="158" width="30" height="13" rx="6"/>
  </g>
  <g stroke="#C4A46A" opacity=".26" stroke-width="1.4">
    <path d="M197,40.7 H365"/><path d="M205,55 v104"/><path d="M345,55 v104"/>
  </g>
  <g stroke="#070C0A" stroke-width="5" fill="none" stroke-linecap="round">
    <path d="M246,54 L 245,114"/><path d="M318,54 L 319,114"/>
  </g>
  <g fill="#070C0A">
    <path d="M230,106 C 258,109 300,110 340,108 L 334,130 C 300,138 262,137 238,129 Z"/>
    <path d="M256,106 L 264,88 L 300,88 L 300,106 Z"/>
  </g>
  <g stroke="#C4A46A" opacity=".3" stroke-width="1.3" fill="none">
    <path d="M231,106.5 C 258,109.5 300,110.5 339,108.5"/><path d="M256,106 L 264,88.6 H300"/>
  </g>
  <path d="M304,88 L 306,68" stroke="#070C0A" stroke-width="2.4"/>
  <g stroke="#070C0A" stroke-width="5" fill="none" stroke-linecap="round">
    <path d="M246,124 C 249,135 257,141 268,143"/><path d="M318,125 C 315,136 307,142 296,144"/>
  </g>

  <g fill="#070C0A">
    <rect x="24" y="128" width="8" height="44" rx="2"/>
    <rect x="43" y="136" width="8" height="36" rx="2"/>
    <rect x="62" y="122" width="8" height="50" rx="2"/>
    <rect x="0" y="150" width="86" height="7" rx="2"/>
  </g>
  <circle cx="66" cy="118" r="2.6" fill="#C4A46A"/>
  <circle cx="66" cy="118" r="9" fill="#C4A46A" opacity=".2"/>

  <g stroke="#DCE6E0" stroke-linecap="round" fill="none">
    <path d="M16,176 h104" stroke-width="1.5" opacity=".22"/>
    <path d="M152,183 h176" stroke-width="1.5" opacity=".15"/>
    <path d="M36,192 h140" stroke-width="1.5" opacity=".11"/>
    <path d="M226,199 h120" stroke-width="1.5" opacity=".08"/>
  </g>
  <g stroke="#C4A46A" stroke-width="2" opacity=".14">
    <path d="M210,169 v34 M350,169 v34"/>
  </g>
  <g stroke="#E6DDCC" stroke-width="1.6" opacity=".1"><path d="M72,169 v26"/></g>
</svg>`;



/* 1 — switchboard ---------------------------------------------------- */
SCREENS.switchboard = () => {
  const chase = BOATS.filter(b => !isHeld(st(b.slug).status));

  const phone = (to, world, title, sub, inner) => `
    <div class="phone" role="link" tabindex="0" data-act="go" data-to="${to}"
         aria-label="${title.replace(/&rsquo;/g, "'")} — ${sub}">
      <div class="glass"><div class="notch"></div><div class="inner">
        <div class="mock" data-world="${world}">${inner}</div>
      </div></div>
      <div class="cap"><div class="nm">${title}</div><div class="sb">${sub}</div></div>
    </div>`;

  return {
    world: 'night',
    html: `
    <div class="sb-art">
      ${SB_ART}
    </div>

    <div class="pad sb-copy">
      <div class="brasstag">${YARD.name}</div>
      <h1 class="d1" style="margin-top:15px">Fall 2026</h1>
      <p class="lede quiet" style="margin-top:10px;max-width:20em">
        Haul-out, winterize, wrap, store. Two phones — the one Sal gets, and the one Todd checks at eight.</p>
      <p class="meta num" style="margin-top:13px;color:var(--brass);opacity:.85">
        ${YARD.street} · ${YARD.town}</p>
    </div>

    <div class="phones">
      ${phone('#/b/reel-therapy', 'paper', 'Sal&rsquo;s phone', 'The link Todd texted him',
              SCREENS.boat('reel-therapy').html)}
      ${phone('#/todd', 'night', 'Todd&rsquo;s phone', 'Tonight — who said yes, who to chase',
              SCREENS.tonight().html)}
    </div>

    <div class="sect"><span class="tag">Demo controls</span><span class="rule"></span></div>
    <div class="stack">
      <div class="kv" style="border:0;padding-top:0">
        <span class="k">Card on file</span>
        <span style="display:flex;gap:7px">
          <button class="filter" data-act="declinemode" data-v="0" aria-pressed="${!S.declineMode}">Works</button>
          <button class="filter" data-act="declinemode" data-v="1" aria-pressed="${S.declineMode}">Declines once</button>
        </span>
      </div>
      <div class="kv" style="border:0;padding:2px 0 0">
        <span class="k">Everything you tap</span>
        <button class="textlink textlink--sm" data-act="reset">Put it back</button>
      </div>
    </div>
    <p class="footline" style="padding-top:14px">${chase.length} ${chase.length === 1 ? 'boat' : 'boats'} still owe Todd an answer.<br>
      Fake money, fake texts, real yard.</p>`,
    mount: fitMocks
  };
};

function fitMocks() {
  document.querySelectorAll('.mock').forEach(m => {
    const w = m.parentNode.clientWidth;
    if (w) m.style.setProperty('--s', (w / 390).toFixed(4));
  });
}
addEventListener('resize', fitMocks, { passive: true });

/* 2 — your boat ------------------------------------------------------ */
SCREENS.boat = (slug) => {
  const b = BOAT_BY_SLUG[slug], s = st(slug), w = WEEK_BY_ID[s.week];
  const held = isHeld(s.status);
  const balance = b.price - (s.deposit || HOLD);

  return {
    world: 'paper',
    html: `
    ${topbar({ right: `<button class="iconbtn" data-act="callyard" aria-label="Call the yard">${I.phone}</button>` })}
    <div class="pad" style="padding-top:22px">
      <div class="tag quiet">${esc(w.full)} · ${esc(b.berthShort)}</div>
      <h1 class="t1" style="margin-top:8px">Hi ${esc(b.first)}.</h1>
      <p class="lede" style="margin-top:6px;color:var(--soft)">
        ${held ? 'She’s on the list. Here’s the plan.' : 'Here’s her plan for the fall.'}</p>
    </div>

    <div class="pad" style="margin-top:16px">
      ${boatCard(b, held ? `<span class="brasstag">Held · ${esc(w.label)}</span>` : '')}
    </div>

    <div class="pad" style="margin-top:22px">
      <p class="body" style="font-family:var(--serif);font-size:19px;line-height:28px;
         font-variation-settings:'opsz' 40,'SOFT' 60,'WONK' 1">
        &ldquo;${esc(b.plan)}&rdquo;</p>
      <p class="tag" style="margin-top:12px;color:var(--brass)">— ${esc(YARD.owner)}</p>
    </div>

    <div class="sect"><span class="tag">What that is</span><span class="rule"></span></div>
    <ul class="plan pad">
      ${b.line.map(x => `<li><span class="bul"></span><span class="txt">${esc(x)}</span></li>`).join('')}
    </ul>

    <div class="pad" style="margin-top:24px">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px">
        <span class="d2 num">${money(b.price)}</span>
        <span class="meta">all in, for the winter</span>
      </div>
      <p class="meta" style="margin-top:8px">
        ${held
          ? `${money(s.deposit || HOLD)} is down. ${money(balance)} when we haul her.`
          : `${money(HOLD)} holds your week. The other ${money(balance)} when we haul her.`}
      </p>
    </div>

    <div style="margin-top:20px">
      ${held
        ? `<button class="btn btn--dark btn--wide" data-act="go" data-to="#/b/${slug}/status">
             ${I.check} You&rsquo;re all set — week of ${esc(w.label)}</button>
           <button class="textlink" data-act="text" data-slug="${slug}" data-from="cust">Text Todd</button>`
        : `<button class="btn btn--primary btn--wide" data-act="go" data-to="#/b/${slug}/pay">
             Hold my week <span class="price">— ${money(HOLD)}</span></button>
           <button class="textlink" data-act="go" data-to="#/b/${slug}/week">Need a different week?</button>`}
    </div>

    <p class="footline">${YARD.name} · ${YARD.street}, ${YARD.town}<br>
      <span class="num">${YARD.phone}</span></p>`
  };
};

/* 3 — pick a week ---------------------------------------------------- */
SCREENS.week = (slug) => {
  const b = BOAT_BY_SLUG[slug], s = st(slug);
  const cards = WEEKS.map(w => {
    const n = left(w.id);
    const blocked = (w.sailOnly && b.rig !== 'sail') || n <= 0;
    const why = w.sailOnly && b.rig !== 'sail' ? 'Sail only — masts and moorings' : (n <= 0 ? 'Full' : '');
    const sel = s.week === w.id && !blocked;
    return `<button class="week" data-act="week" data-slug="${slug}" data-week="${w.id}"
        aria-pressed="${sel}" data-full="${blocked}">
      <div class="week-head">
        <span class="week-name">${esc(w.full)}</span>
        ${w.toddsPick ? `<span class="chip chip--held">Todd&rsquo;s pick</span>` : ''}
      </div>
      <div class="week-days">${esc(w.days)}</div>
      <div class="week-foot">
        ${ticks(w.id)}
        <span style="display:flex;align-items:center;gap:10px">
          <span class="week-left ${n <= 2 ? 'heat' : 'quiet'}">${esc(why || leftLabel(w.id))}</span>
          <span class="week-check">${I.check}</span>
        </span>
      </div>
    </button>`;
  }).join('');

  const w = WEEK_BY_ID[s.week];
  return {
    world: 'paper',
    html: `
    ${topbar({ back: `#/b/${slug}` })}
    <div class="pad" style="padding-top:22px">
      <h1 class="t1">Which week works?</h1>
      <p class="lede" style="margin-top:7px;color:var(--soft)">
        Pick one and I&rsquo;ll put ${esc(b.name)} on the list. Twelve boats a week on the lift — that&rsquo;s the whole trick.</p>
    </div>
    <div class="pad weeks" style="margin-top:20px">${cards}</div>
    <div style="margin-top:24px">
      <button class="btn btn--primary btn--wide" data-act="go" data-to="#/b/${slug}/pay">
        Hold ${esc(w.label)} <span class="price">— ${money(HOLD)}</span></button>
      <button class="textlink" data-act="callyard">None of these? Call the yard.</button>
    </div>`
  };
};

/* 4 — pay ------------------------------------------------------------ */
SCREENS.pay = (slug) => {
  const b = BOAT_BY_SLUG[slug], s = st(slug), w = WEEK_BY_ID[s.week];
  const behind = SCREENS.boat(slug).html;

  const sheet = `
    <div class="scrim" data-act="go" data-to="#/b/${slug}"></div>
    <div class="sheet" id="paysheet">
      <div class="grabber"></div>
      <div class="pay-head">
        ${Art.mark(32)}
        <div class="who"><div class="nm">${esc(YARD.name)}</div>
          <div class="meta">${YARD.street}, ${YARD.town}</div></div>
        <button class="iconbtn" data-act="go" data-to="#/b/${slug}" aria-label="Cancel">${I.x}</button>
      </div>
      <div id="payBody">${payBody(b, s, w)}</div>
    </div>`;

  return {
    world: 'paper',
    cls: 'screen--modal',
    html: `<div class="behind">${behind}</div>${sheet}`,
    mount: (root) => armPay(root, slug)
  };
};

function payBody(b, s, w) {
  return `
    <div class="pay-row">
      <div><div class="k">Hold · ${esc(w.full)}</div>
        <div class="meta" style="margin-top:2px">${esc(b.name)} · fall haul &amp; store</div></div>
      <div class="v">${money2(HOLD)}</div>
    </div>
    <div class="pay-row">
      <div class="k">Balance at haul-out</div>
      <div class="v quiet">${money2(b.price - HOLD)}</div>
    </div>
    <button class="pay-card" data-act="card">
      <span class="mini-card"></span>
      <span style="flex:1;text-align:left">
        <span id="cardNum" style="display:block;font-weight:600;font-size:15px">Visa &nbsp;····&nbsp;${S.card}</span>
        <span class="meta" style="display:block">Card on file since ${b.since}</span>
      </span>
      <span class="tag quiet">Change</span>
    </button>
    <div class="pay-confirm">
      <button class="holdbtn" id="holdbtn">
        <span class="fill" id="holdfill"></span>
        <span class="lab">${I.face}<span id="holdlab">Hold to pay ${money2(HOLD)}</span></span>
      </button>
      <p class="meta" style="margin-top:11px">Press and hold to confirm</p>
    </div>
    <div class="pay-legal">This is a demo of Todd&rsquo;s fall booking. No card is charged, nothing is sent.</div>`;
}

function declinedBody(b) {
  return `
    <div class="declined">
      <div class="ic">${I.warn}</div>
      <div class="t2">Card declined</div>
      <p class="body quiet" style="margin-top:8px;padding:0 8px">
        The bank didn&rsquo;t say why. Nothing was charged. Try it again, or use another card —
        or just call the yard and Todd will write you down.</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:22px">
        <button class="btn btn--dark" data-act="retry" data-slug="${b.slug}">Try again</button>
        <button class="btn btn--ghost" data-act="othercard" data-slug="${b.slug}">Use a different card</button>
      </div>
    </div>
    <div class="pay-legal">Demo decline. Real life is rarely this polite.</div>`;
}

function armPay(root, slug) {
  const btn = root.querySelector('#holdbtn');
  if (!btn) return;
  const fill = root.querySelector('#holdfill');
  const lab = root.querySelector('#holdlab');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPAN = reduce ? 120 : 900;
  let raf = 0, t0 = 0, done = false;

  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const reset = () => { stop(); fill.style.width = '0%'; };

  const tick = () => {
    const p = Math.min(1, (performance.now() - t0) / SPAN);
    fill.style.width = (p * 100) + '%';
    if (p < 1) raf = requestAnimationFrame(tick);
    else { raf = 0; finish(); }
  };

  const finish = () => {
    if (done) return;
    done = true;
    const declines = (S.declineMode && !S.declinedOnce) || (!S.declineMode && Math.random() < 0.1 && !S.declinedOnce);
    if (declines) {
      S.declinedOnce = true; save();
      btn.classList.add('nudge');
      setTimeout(() => {
        root.querySelector('#payBody').innerHTML = declinedBody(BOAT_BY_SLUG[slug]);
      }, 420);
      return;
    }
    btn.classList.add('paid');
    lab.textContent = 'Done';
    fill.style.width = '100%';
    holdWeek(slug);
    setTimeout(() => go('#/b/' + slug + '/confirmed', true), 620);
  };

  const start = () => { if (done || raf) return; t0 = performance.now(); raf = requestAnimationFrame(tick); };
  const cancel = () => {
    if (done || !raf) return;
    reset();
    btn.classList.add('nudge');
    setTimeout(() => btn.classList.remove('nudge'), 440);
    lab.textContent = 'Keep holding';
    setTimeout(() => { if (!done) lab.textContent = 'Hold to pay ' + money2(HOLD); }, 1400);
  };

  btn.addEventListener('pointerdown', e => { e.preventDefault(); btn.setPointerCapture(e.pointerId); start(); });
  btn.addEventListener('pointerup', cancel);
  btn.addEventListener('pointercancel', cancel);
  btn.addEventListener('pointerleave', cancel);
  btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t0 = performance.now() - SPAN; finish(); } });
}

function holdWeek(slug) {
  const s = st(slug);
  if (!isHeld(s.status)) {
    s.status = 'held';
    s.deposit = HOLD;
    s.method = 'card';
    wk(s.week).booked = Math.min(WEEK_BY_ID[s.week].cap, wk(s.week).booked + 1);
    save();
  }
}

/* 5 — you're in ------------------------------------------------------ */
SCREENS.confirmed = (slug) => {
  const b = BOAT_BY_SLUG[slug], s = st(slug), w = WEEK_BY_ID[s.week];
  return {
    world: 'paper',
    html: `
    ${topbar({ title: 'Held' })}
    <div class="pad" style="padding-top:14px">
      ${Art.cleat()}
      <div class="riseup" style="animation-delay:1.5s;text-align:center;margin-top:10px">
        <h1 class="t1">You&rsquo;re in, ${esc(b.first)}.</h1>
        <p class="lede" style="margin-top:8px;color:var(--soft)">
          ${esc(w.full)}. We&rsquo;ll text you the morning we haul her.</p>
        <div style="margin-top:16px"><span class="brasstag">${money(HOLD)} held · ${esc(b.name)}</span></div>
      </div>
    </div>

    <div class="riseup" style="animation-delay:1.75s">
      <div class="sect"><span class="tag">What happens next</span><span class="rule"></span></div>
      <div class="pad">${timeline(b)}</div>

      <div class="pad" style="margin-top:26px;display:flex;gap:11px">
        <button class="btn btn--ghost btn--sm" data-act="cal" data-slug="${slug}">${I.cal} Add to calendar</button>
        <button class="btn btn--dark btn--sm" data-act="text" data-slug="${slug}" data-from="cust">${I.msg} Text Todd</button>
      </div>
      <button class="textlink" data-act="go" data-to="#/b/${slug}/status">Check on her anytime</button>
      <p class="footline">Balance of ${money(b.price - HOLD)} when we haul her.<br>
        No paperwork. We know the boat.</p>
    </div>`,
    mount: (root) => {
      root.querySelectorAll('.rope').forEach(p => {
        const len = Math.ceil(p.getTotalLength() + 2);
        p.style.setProperty('--l', len);
      });
    }
  };
};

/* 6 — how's she doing ------------------------------------------------ */
SCREENS.status = (slug) => {
  const b = BOAT_BY_SLUG[slug], s = st(slug), w = WEEK_BY_ID[s.week];
  const head = {
    stored: ['She&rsquo;s tucked in.', `Wrapped and blocked on ${esc(b.lot)}. See you in April, ${esc(b.first)}.`],
    hauled: ['She&rsquo;s out of the water.', `${esc(b.steps[0].detail)} — wrap goes on Friday.`],
    held:   ['She&rsquo;s on the list.', `${esc(w.full)}. Nothing for you to do.`],
    callme: ['Todd wants a word.', 'Give the yard a call and we&rsquo;ll sort the week out.'],
    sent:   ['Not booked yet.', `${esc(w.full)} is penciled in — it isn&rsquo;t held until the ${money(HOLD)} is down.`],
    chase:  ['Not booked yet.', `${esc(w.full)} is penciled in — it isn&rsquo;t held until the ${money(HOLD)} is down.`]
  }[s.status];

  return {
    world: 'paper',
    html: `
    ${topbar({ back: `#/b/${slug}`, title: esc(b.name) })}
    <div class="pad" style="padding-top:20px">
      ${boatCard(b, isHeld(s.status) ? `<span class="brasstag">${chipWord(s.status)}</span>` : '')}
    </div>
    <div class="pad" style="margin-top:20px">
      <h1 class="t1">${head[0]}</h1>
      <p class="lede" style="margin-top:7px;color:var(--soft)">${head[1]}</p>
    </div>
    <div class="sect"><span class="tag">${s.status === 'stored' ? 'How she went away' : 'The plan'}</span><span class="rule"></span></div>
    <div class="pad">${timeline(b)}</div>
    ${isHeld(s.status) ? `<div class="pad" style="margin-top:24px">
      <div class="kv"><span class="k">Held</span><span class="v num">${money(s.deposit || HOLD)}${s.method === 'cash' ? ' cash' : ''}</span></div>
      <div class="kv"><span class="k">Balance</span><span class="v num">${money(b.price - (s.deposit || 0))}</span></div>
      <div class="kv"><span class="k">Winter home</span><span class="v">${esc(b.lot)}</span></div>
    </div>` : ''}
    <div class="pad" style="margin-top:24px;display:flex;gap:11px">
      <button class="btn btn--ghost btn--sm" data-act="callyard">${I.phone} Call the yard</button>
      <button class="btn btn--dark btn--sm" data-act="text" data-slug="${slug}" data-from="cust">${I.msg} Text Todd</button>
    </div>
    ${!isHeld(s.status) ? `<div style="margin-top:14px">
      <button class="btn btn--primary btn--wide" data-act="go" data-to="#/b/${slug}/pay">
        Hold my week <span class="price">— ${money(HOLD)}</span></button></div>` : ''}
    <p class="footline">${YARD.name} · <span class="num">${YARD.phone}</span></p>`
  };
};

function chipWord(status) {
  return status === 'stored' ? 'Wrapped · stored' : status === 'hauled' ? 'Hauled' : 'Held · ' + money(HOLD);
}

/* 7 — Todd's tonight -------------------------------------------------- */
SCREENS.tonight = () => {
  const t = tally();
  const all = BOATS.slice().sort((a, b) => {
    const d = ORDER[st(a.slug).status] - ORDER[st(b.slug).status];
    return d || a.name.localeCompare(b.name);
  });
  const chaseList = all.filter(b => !isHeld(st(b.slug).status));
  const heldList = all.filter(b => isHeld(st(b.slug).status));
  const list = filter === 'chase' ? chaseList : filter === 'held' ? heldList : all;

  const pencilled = id => BOATS.filter(b => st(b.slug).week === id && !isHeld(st(b.slug).status)).length;
  const hot = WEEKS.filter(w => left(w.id) > 0 && !w.sailOnly)
    .sort((a, b) => (pencilled(b.id) - pencilled(a.id)) || (left(a.id) - left(b.id)))[0];

  const row = b => {
    const s = st(b.slug), w = WEEK_BY_ID[s.week], held = isHeld(s.status);
    return `<div class="row">
      <button class="row-top" style="width:100%;text-align:left" data-act="go" data-to="#/todd/boat/${b.slug}">
        <span class="row-glyph">${Art.glyph(b)}</span>
        <span class="row-main">
          <span class="row-name" style="display:block">${esc(b.name)}</span>
          <span class="row-meta" style="display:block">${esc(b.first)} · ${esc(w.label)} · ${esc(b.berthShort)}${s.called ? ' · called tonight' : ''}</span>
        </span>
        <span>${chip(s.status)}</span>
      </button>
      <div class="row-actions">
        ${held
          ? `<button class="act" data-act="text" data-slug="${b.slug}" data-from="todd">${I.msg} Text ${esc(b.first)}</button>`
          : `<button class="act act--brass" data-act="resend" data-slug="${b.slug}">${I.link} Resend link</button>`}
        <button class="act" data-act="call" data-slug="${b.slug}">${I.phone} Call</button>
      </div>
    </div>`;
  };

  const empty = `<div class="empty">
    <svg class="art" viewBox="0 0 120 84" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 64h100M18 64V40l22-14 22 14v24"/><path d="M30 64V50h18v14"/>
      <rect x="70" y="46" width="30" height="18" rx="2"/><path d="M70 46l15-9 15 9"/>
      <circle cx="39" cy="54" r="2.4" fill="currentColor" stroke="none"/>
      <path d="M96 22c0 3-2 5-5 5 4 1 5 3 5 6 0-3 2-5 5-6-3 0-5-2-5-5Z" fill="currentColor" stroke="none" opacity=".7"/>
    </svg>
    <div class="t1">All quiet.</div>
    <p class="lede quiet" style="margin-top:8px">${t.held} of ${t.total} held. Go to bed, Todd.</p>
  </div>`;

  return {
    world: 'night',
    html: `
    <div class="pad" style="padding-top:26px">
      <div class="tag brass">Tonight</div>
      <h1 class="d1" style="margin-top:8px">${YARD.tonight}</h1>
      <p class="meta" style="margin-top:6px">${YARD.clock}pm · ${YARD.street}</p>
    </div>

    <div class="pad" style="margin-top:22px">
      <div class="tally">
        <div class="cell"><div class="n">${t.held}</div><div class="l">held</div></div>
        <div class="cell cell--money"><div class="n">${money(t.down)}</div><div class="l">down</div></div>
        <div class="cell"><div class="n">${t.waiting}</div><div class="l">waiting</div></div>
        <div class="cell cell--heat"><div class="n">${t.calls}</div><div class="l">said call</div></div>
      </div>
    </div>

    <div class="sect" style="padding-bottom:12px"><span class="tag">${filter === 'held' ? 'Squared away' : filter === 'all' ? 'The whole list' : 'Chase these first'}</span><span class="rule"></span></div>
    <div class="filters">
      <button class="filter" data-act="filter" data-f="chase" aria-pressed="${filter === 'chase'}">Chase · ${chaseList.length}</button>
      <button class="filter" data-act="filter" data-f="held" aria-pressed="${filter === 'held'}">Held · ${heldList.length}</button>
      <button class="filter" data-act="filter" data-f="all" aria-pressed="${filter === 'all'}">All · ${all.length}</button>
    </div>

    <div class="rows" style="margin-top:16px">${list.length ? list.map(row).join('') : empty}</div>

    <p class="footline">${hot ? `${esc(hot.label)} is filling — <span class="heat num">${left(hot.id)} ${left(hot.id) === 1 ? 'spot' : 'spots'} left</span>.` : 'Every week is full. Nice work.'}<br>
      Nobody has to type their boat name. You already know it.</p>
    ${tabs('tonight')}`
  };
};

/* 8 — Todd's boat detail ---------------------------------------------- */
SCREENS.toddboat = (slug) => {
  const b = BOAT_BY_SLUG[slug], s = st(slug), w = WEEK_BY_ID[s.week];
  const held = isHeld(s.status);
  return {
    world: 'night',
    html: `
    ${topbar({ back: '#/todd', title: esc(b.berth) })}
    <div class="pad" style="padding-top:18px">${boatCard(b, chip(s.status))}</div>

    <div class="pad" style="margin-top:20px">
      <h1 class="t1">${esc(b.name)}</h1>
      <p class="meta" style="margin-top:5px">${esc(b.make)} · ${esc(b.engines)}</p>
    </div>

    <div class="pad" style="margin-top:16px">
      <div class="kv"><span class="k">Owner</span><span class="v">${esc(b.owner)}</span></div>
      <div class="kv"><span class="k">Phone</span><span class="v num">${b.phone}</span></div>
      <div class="kv"><span class="k">Berth</span><span class="v num">${esc(b.berth)}</span></div>
      <div class="kv"><span class="k">This fall</span><span class="v">${esc(w.full)}</span></div>
      <div class="kv"><span class="k">Package</span><span class="v num">${money(b.price)}</span></div>
      <div class="kv"><span class="k">Down</span><span class="v num ${held ? 'brass' : 'quiet'}">${held ? money(s.deposit || HOLD) + (s.method === 'cash' ? ' cash' : '') : 'nothing yet'}</span></div>
      <div class="kv"><span class="k">Winter home</span><span class="v">${esc(b.lot)}</span></div>
      <div class="kv"><span class="k">Links sent</span><span class="v num">${s.links}</span></div>
    </div>

    <div class="sect"><span class="tag">Yard notes</span><span class="rule"></span></div>
    ${yardNote(b)}

    <div class="sect"><span class="tag">Where she is</span><span class="rule"></span></div>
    <div class="pad">${timeline(b)}</div>

    <div class="sect"><span class="tag">Do something</span><span class="rule"></span></div>
    <div class="stack">
      <div style="display:flex;gap:10px">
        <button class="act act--brass" data-act="resend" data-slug="${slug}">${I.link} Resend link</button>
        <button class="act" data-act="call" data-slug="${slug}">${I.phone} Call</button>
      </div>
      <div style="display:flex;gap:10px">
        <button class="act" data-act="markheld" data-slug="${slug}" ${held ? 'disabled style="opacity:.4"' : ''}>${I.check} Mark held</button>
        <button class="act" data-act="markcalled" data-slug="${slug}">${I.msg} Mark called</button>
      </div>
      <button class="textlink" data-act="go" data-to="#/b/${slug}/status">See what ${esc(b.first)} sees</button>
    </div>

    <p class="footline">Stored with us ${b.since}–2025. This is her ${ord(2026 - b.since + 1)} fall on the hard.</p>
    ${tabs('')}`
  };
};

function ord(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/* 9 — the season board ------------------------------------------------ */
SCREENS.season = () => {
  const totalCap = WEEKS.reduce((a, w) => a + w.cap, 0);
  const totalBooked = WEEKS.reduce((a, w) => a + wk(w.id).booked, 0);

  const col = w => {
    const booked = wk(w.id).booked, n = left(w.id);
    const mine = BOATS.filter(b => st(b.slug).week === w.id);
    const others = Math.max(0, booked - mine.filter(b => isHeld(st(b.slug).status)).length);
    const dot = s => isHeld(s) ? 'var(--brass)' : (s === 'sent' ? 'var(--mute)' : 'var(--buoy)');
    return `<div class="col">
      <div class="col-head">
        <span class="col-name">${esc(w.full)}</span>
        <span class="col-count">${booked} of ${w.cap}</span>
      </div>
      <div class="meta" style="margin-top:3px">${esc(w.days)}${w.sailOnly ? ' · sail only' : ''}</div>
      <div class="bar ${n <= 2 ? 'hot' : ''}"><i style="width:${Math.round(booked / w.cap * 100)}%"></i></div>
      <div class="pills">
        ${mine.map(b => `<button class="pill" data-act="go" data-to="#/todd/boat/${b.slug}">
            <span class="glyph-wrap" style="display:flex">${Art.glyph(b)}</span>
            <span>${esc(b.name)}</span>
            <span class="dot" style="background:${dot(st(b.slug).status)}"></span>
          </button>`).join('')}
        ${others ? `<span class="pill pill--other">+${others} more of the yard</span>` : ''}
      </div>
      <div class="meta" style="margin-top:11px">${n > 0 ? `<span class="${n <= 2 ? 'heat' : ''}">${esc(leftLabel(w.id))}</span>` : 'Full — no more room on the lift'}</div>
    </div>`;
  };

  return {
    world: 'night',
    html: `
    <div class="pad" style="padding-top:26px">
      <div class="tag brass">The season</div>
      <h1 class="d1" style="margin-top:8px">Five weeks</h1>
      <p class="lede quiet" style="margin-top:9px">
        <span class="num">${totalBooked}</span> of <span class="num">${totalCap}</span> spots spoken for.
        Twelve boats a week is all the lift will do.</p>
    </div>
    <div class="board" style="margin-top:24px">${WEEKS.map(col).join('')}</div>
    <p class="footline">Tap a boat to see her card.<br>Brass means the money&rsquo;s down.</p>
    ${tabs('season')}`
  };
};

/* lost ---------------------------------------------------------------- */
SCREENS.lost = () => ({
  world: 'night',
  html: `<div class="empty" style="padding-top:90px">
    <div class="brasstag">Wrong slip</div>
    <h1 class="t1" style="margin-top:18px">Nothing tied up here.</h1>
    <p class="lede quiet" style="margin-top:9px">That link doesn&rsquo;t match a boat in the yard.</p>
    <div style="margin-top:26px"><button class="btn btn--primary" data-act="go" data-to="#/">Back to the dock</button></div>
  </div>`
});

/* ------------------------------------------------------------------ acts */
const ACTS = {
  go: (el) => go(el.dataset.to),

  closesheet: () => closeSheet(),

  callyard: () => toast('Calling the yard', YARD.name + ' · ' + YARD.phone),

  week: (el) => {
    const s = st(el.dataset.slug);
    s.week = el.dataset.week;
    save();
    navigate();
  },

  card: (el) => {
    const n = (ACTS._taps = (ACTS._taps || 0) + 1);
    if (n >= 3) {
      ACTS._taps = 0;
      S.declineMode = true; S.declinedOnce = false; save();
      toast('Decline armed', 'The next hold will bounce once.');
    } else {
      S.card = S.card === '4242' ? '1841' : '4242'; save();
      el.querySelector('#cardNum').innerHTML = 'Visa &nbsp;····&nbsp;' + S.card;
    }
  },

  retry: (el) => {
    const b = BOAT_BY_SLUG[el.dataset.slug], s = st(b.slug);
    document.getElementById('payBody').innerHTML = payBody(b, s, WEEK_BY_ID[s.week]);
    armPay(document.querySelector('.screen:not(.exit)'), b.slug);
  },

  othercard: (el) => {
    S.card = '1841'; save();
    ACTS.retry(el);
    toast('Card swapped', 'Visa ···· 1841');
  },

  filter: (el) => { filter = el.dataset.f; navigate(); },

  resend: (el) => {
    const b = BOAT_BY_SLUG[el.dataset.slug], s = st(b.slug);
    s.links += 1;
    if (s.status === 'sent' && s.links >= 2) s.status = 'chase';
    save();
    toast('Link sent to ' + b.first, b.phone + ' · ' + b.name);
    navigate();
  },

  call: (el) => callSheet(el.dataset.slug),

  ringing: (el) => {
    const b = BOAT_BY_SLUG[el.dataset.slug], s = st(b.slug);
    s.called = true;
    if (s.status === 'callme') s.status = 'sent';
    save();
    closeSheet();
    setTimeout(() => { toast('Marked — you called ' + b.first, YARD.clock + 'pm · ' + b.phone); navigate(); }, 280);
  },

  text: (el) => textSheet(el.dataset.slug, el.dataset.from),

  sendtext: (el) => {
    const b = BOAT_BY_SLUG[el.dataset.slug];
    closeSheet();
    setTimeout(() => toast('Sent', el.dataset.from === 'todd' ? 'To ' + b.first + ' · ' + b.phone : 'To Todd · ' + YARD.phone), 260);
  },

  cal: (el) => {
    const s = st(el.dataset.slug), w = WEEK_BY_ID[s.week];
    toast('Added to your calendar', 'Haul-out · ' + w.days.split(' – ')[0] + ', 7:30am');
  },

  markheld: (el) => {
    const b = BOAT_BY_SLUG[el.dataset.slug];
    holdWeek(b.slug);
    toast(b.name + ' marked held', money(HOLD) + ' down · ' + WEEK_BY_ID[st(b.slug).week].full);
    navigate();
  },

  markcalled: (el) => {
    const b = BOAT_BY_SLUG[el.dataset.slug], s = st(b.slug);
    s.called = true;
    if (s.status === 'callme') s.status = 'sent';
    save();
    toast('Noted', 'You called ' + b.first + ' at ' + YARD.clock + 'pm');
    navigate();
  },

  declinemode: (el) => {
    S.declineMode = el.dataset.v === '1';
    S.declinedOnce = false;
    save();
    navigate();
  },

  reset: () => {
    resetAll();
    filter = 'chase';
    toast('Back to Thursday night', 'Ten boats, four still owe an answer.');
    navigate();
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = e.target.closest('[data-act][tabindex]');
  if (!el) return;
  e.preventDefault();
  el.click();
});

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACTS[el.dataset.act];
  if (!fn) return;
  e.preventDefault();
  fn(el);
});

/* ------------------------------------------------------------------ boot */
document.getElementById('sbTime').textContent = YARD.clock;
addEventListener('hashchange', navigate);
if (!location.hash) location.replace('#/');
navigate();
