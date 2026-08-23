const KEY = "ys-card-v1";
const PIN = "2267";
const PHOTO = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Boatyard_at_Universal_Marina%2C_River_Hamble_-_geograph.org.uk_-_449100.jpg/1280px-Boatyard_at_Universal_Marina%2C_River_Hamble_-_geograph.org.uk_-_449100.jpg";

const FLEET = [
  { id: "mike", owner: "Mike", boat: "Sea Horse", slip: "B-14", service: "Winterize", week: "Week of Oct 13", phone: true, color: "#3d4a38", photo: PHOTO },
  { id: "lisa", owner: "Lisa", boat: "Lucky Day", slip: "A-6", service: "Winterize", week: "Week of Oct 6", phone: true, color: "#4a3a2a", photo: PHOTO },
  { id: "tom", owner: "Tom", boat: "Miss Amity", slip: "C-2", service: "Winterize", week: "Week of Oct 20", phone: true, color: "#2c3d4a", photo: PHOTO },
  { id: "pat", owner: "Pat", boat: "Bay Runner", slip: "Trailer", service: "Winterize", week: "Week of Oct 13", phone: false, color: "#5a4030", photo: "" },
  { id: "kim", owner: "Kim", boat: "Cedar Beach", slip: "D-9", service: "Winterize", week: "Week of Oct 6", phone: false, color: "#3a4038", photo: "" }
];

const SEED = { mike: "open", lisa: "open", tom: "open", pat: "haul", kim: "done" };
const WORDS = { open: "Need a yes", held: "Held", haul: "Haul set", done: "Done", pass: "Not this year" };

function load() {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(KEY, JSON.stringify(SEED));
  return { ...SEED };
}
function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
function boatById(id) { return FLEET.find((b) => b.id === id) || FLEET[0]; }
function phoneId() {
  const q = new URLSearchParams(location.search).get("p");
  if (q && FLEET.some((b) => b.id === q && b.phone)) return q;
  return "mike";
}
function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function renderPhone() {
  const id = phoneId();
  const b = boatById(id);
  const st = load()[id] || "open";
  document.title = b.boat + " \u2014 Yacht Service Ltd";
  const app = document.getElementById("app");
  const cheat = `<p class="cheat">Closer \u00b7 switch whose phone \u2014 <a href="?p=mike">Mike Sea Horse</a> \u00b7 <a href="?p=lisa">Lisa Lucky Day</a> \u00b7 <a href="?p=tom">Tom Miss Amity</a></p>`;

  if (st === "held" || st === "haul" || st === "done") {
    app.innerHTML = `<article class="card status">
      <img class="hero" src="${PHOTO}" alt="Boat on stands in a working yard" />
      <div class="pad">
        <p class="meta">${esc(b.boat)} \u00b7 slip ${esc(b.slip)}</p>
        <h1 class="quiet">You\u2019re on Todd\u2019s list.</h1>
        <p class="meta">He\u2019ll set the haul day. $200 hold is on the winterize.</p>
      </div>
    </article>${cheat}`;
    return;
  }

  if (st === "pass") {
    app.innerHTML = `<article class="card status">
      <img class="hero" src="${PHOTO}" alt="Boat on stands in a working yard" />
      <div class="pad">
        <p class="meta">${esc(b.boat)}</p>
        <h1 class="quiet">Not this year.</h1>
        <p class="meta">Todd won\u2019t hold a haul week for her.</p>
      </div>
    </article>${cheat}`;
    return;
  }

  app.innerHTML = `<article class="card">
    <img class="hero" src="${PHOTO}" alt="Boat on stands in a working yard" />
    <div class="pad">
      <h1 class="boat">${esc(b.boat)}</h1>
      <p class="meta">Slip ${esc(b.slip)} \u00b7 ${esc(b.week)}</p>
      <p class="hold"><b>$200</b> hold, applied to winterize.</p>
      <div class="act">
        <button class="fat" id="hold" type="button">Hold my spot</button>
        <button class="fat-sec" id="pass" type="button">Not this year</button>
      </div>
      <p class="credit">Working yard photo \u00b7 Geograph / Peter Pomey</p>
    </div>
  </article>${cheat}`;

  document.getElementById("hold").onclick = () => {
    const s = load();
    s[id] = "held";
    save(s);
    renderPhone();
  };
  document.getElementById("pass").onclick = () => {
    const s = load();
    s[id] = "pass";
    save(s);
    renderPhone();
  };
}

function wordClass(st) {
  if (st === "held") return "held";
  if (st === "haul") return "haul";
  if (st === "done") return "done";
  if (st === "pass") return "pass";
  return "";
}

function renderYard() {
  const el = document.getElementById("ops");
  if (sessionStorage.getItem("ys-card-pin") !== "1") {
    el.innerHTML = `<form class="card pad pin" id="pin">
      <h1 class="boat">Saturday.</h1>
      <p class="meta">PIN 2267 in this build.</p>
      <input name="pin" inputmode="numeric" autocomplete="off" required />
      <button class="fat" type="submit">Open the yard</button>
    </form>`;
    document.getElementById("pin").onsubmit = (e) => {
      e.preventDefault();
      if (new FormData(e.target).get("pin") !== PIN) { alert("Wrong PIN."); return; }
      sessionStorage.setItem("ys-card-pin", "1");
      renderYard();
    };
    return;
  }

  const s = load();
  const need = FLEET.filter((b) => (s[b.id] || "open") === "open").length;
  el.innerHTML = `<p class="need">${need} still need a yes.</p>
    <div id="stack">${FLEET.map((b) => card(b, s[b.id] || "open")).join("")}</div>
    <div id="sheet"></div>`;
  el.querySelectorAll("[data-id]").forEach((btn) => {
    btn.onclick = () => openSheet(btn.dataset.id);
  });
}

function card(b, st) {
  const bg = b.photo ? `background-image:url(${b.photo})` : `background:${b.color}`;
  return `<button type="button" class="boat-card" data-id="${esc(b.id)}">
    <div class="thumb" style="${bg}"></div>
    <div class="who"><strong>${esc(b.boat)}</strong><span class="word ${wordClass(st)}">${esc(WORDS[st] || WORDS.open)}</span></div>
  </button>`;
}

function openSheet(id) {
  const b = boatById(id);
  const s = load();
  const st = s[id] || "open";
  const paid = st === "held" || st === "haul" || st === "done";
  const box = document.getElementById("sheet");
  box.innerHTML = `<div class="sheet">
    <h2>${esc(b.boat)}</h2>
    <p>${esc(b.owner)} \u00b7 slip ${esc(b.slip)}</p>
    <p>${esc(b.week)}</p>
    <p>${paid ? "Hold paid" : "Hold not paid"}</p>
    <div class="fats">
      <button class="fat" data-st="held" type="button">Held</button>
      <button class="fat" data-st="haul" type="button" style="background:#2a4a62">Haul set</button>
      <button class="fat" data-st="done" type="button" style="background:#2f6b3a">Done</button>
      <button class="fat-sec" id="close" type="button">Close</button>
    </div>
  </div>`;
  box.querySelectorAll("[data-st]").forEach((btn) => {
    btn.onclick = () => {
      const next = load();
      next[id] = btn.dataset.st;
      save(next);
      renderYard();
    };
  });
  document.getElementById("close").onclick = () => { box.innerHTML = ""; };
}

if (document.getElementById("app")) renderPhone();
if (document.getElementById("ops")) renderYard();
