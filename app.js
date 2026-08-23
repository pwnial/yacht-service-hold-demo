const KEY = "ys-holds";
const PIN = "2267";
const SEED = [
  { boat: "Sea Note", place: "Slip 12", length: 28, at: "4:12 pm" },
  { boat: "Lucky Day", place: "Trailer lot A", length: 22, at: "5:03 pm" },
  { boat: "Miss Amity", place: "Slip 7", length: 34, at: "6:41 pm" }
];

function loadHolds() {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(KEY, JSON.stringify(SEED));
  return SEED.slice();
}

function saveHolds(rows) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

function nowStamp() {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit"
  });
}

const form = document.getElementById("hold-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const rows = loadHolds();
    rows.unshift({
      boat: String(data.get("boat")).trim(),
      place: String(data.get("place")).trim(),
      length: Number(data.get("length")),
      at: nowStamp()
    });
    saveHolds(rows);
    form.hidden = true;
    document.getElementById("success").hidden = false;
  });
}

const pinForm = document.getElementById("pin-form");
if (pinForm) {
  pinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pin = new FormData(pinForm).get("pin");
    if (String(pin) !== PIN) {
      alert("Wrong PIN.");
      return;
    }
    pinForm.hidden = true;
    const wrap = document.getElementById("list-wrap");
    const list = document.getElementById("holds");
    const rows = loadHolds();
    document.getElementById("count").textContent =
      rows.length + " boats on Todd’s list (this browser).";
    list.innerHTML = rows
      .map(
        (r) =>
          `<li><strong>${escapeHtml(r.boat)}</strong> · ${escapeHtml(r.place)} · ${r.length} ft · ${escapeHtml(r.at)}</li>`
      )
      .join("");
    wrap.hidden = false;
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
