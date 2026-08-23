const KEY = "ys-holds";
const PIN = "2267";
const SEED = [
  { boat: "Sea Note", place: "Slip 12", length: 28, amount: 200, at: "4:12 pm" },
  { boat: "Lucky Day", place: "Trailer lot A", length: 22, amount: 200, at: "5:03 pm" },
  { boat: "Miss Amity", place: "Slip 7", length: 34, amount: 200, at: "6:41 pm" }
];
function loadHolds() {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(KEY, JSON.stringify(SEED));
  return SEED.slice();
}
function saveHolds(rows) { localStorage.setItem(KEY, JSON.stringify(rows)); }
function nowStamp() {
  return new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" });
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
const form = document.getElementById("hold-form");
if (form) {
  const boat = form.elements.boat, place = form.elements.place, length = form.elements.length;
  form.addEventListener("input", () => {
    document.getElementById("sum-boat").textContent = boat.value || "-";
    document.getElementById("sum-place").textContent = place.value || "-";
    document.getElementById("sum-length").textContent = length.value ? length.value + " ft" : "-";
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const row = { boat: boat.value.trim(), place: place.value.trim(), length: Number(length.value), amount: 200, at: nowStamp(), id: "YS-" + Math.floor(1000 + Math.random() * 9000) };
    const rows = loadHolds(); rows.unshift(row); saveHolds(rows);
    document.getElementById("checkout").hidden = true;
    document.querySelector(".hero").hidden = true;
    document.querySelector(".sticky-bar").hidden = true;
    document.getElementById("thanks").hidden = false;
    document.getElementById("hold-id").textContent = row.id;
    document.getElementById("t-boat").textContent = row.boat;
    document.getElementById("t-place").textContent = row.place;
  });
}
const pinForm = document.getElementById("pin-form");
if (pinForm) {
  pinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (String(new FormData(pinForm).get("pin")) !== PIN) { alert("Wrong PIN."); return; }
    pinForm.hidden = true;
    const rows = loadHolds();
    document.getElementById("count").textContent = rows.length + " holds";
    document.getElementById("rows").innerHTML = rows.map((r) =>
      `<tr><td><strong>${esc(r.boat)}</strong></td><td>${esc(r.place)}</td><td>$${(r.amount||200)}</td><td>${esc(r.at)}</td><td class="held">HELD</td></tr>`
    ).join("");
    document.getElementById("board").hidden = false;
  });
}
