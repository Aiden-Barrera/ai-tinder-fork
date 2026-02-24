// app.js
// Plain global JS, no modules.

// -------------------
// Data generator
// -------------------
const TAGS = [
  "Coffee","Hiking","Movies","Live Music","Board Games","Cats","Dogs","Traveler",
  "Foodie","Tech","Art","Runner","Climbing","Books","Yoga","Photography"
];
const FIRST_NAMES = [
  "Alex","Sam","Jordan","Taylor","Casey","Avery","Riley","Morgan","Quinn","Cameron",
  "Jamie","Drew","Parker","Reese","Emerson","Rowan","Shawn","Harper","Skyler","Devon"
];
const CITIES = [
  "Brooklyn","Manhattan","Queens","Jersey City","Hoboken","Astoria",
  "Williamsburg","Bushwick","Harlem","Lower East Side"
];
const JOBS = [
  "Product Designer","Software Engineer","Data Analyst","Barista","Teacher",
  "Photographer","Architect","Chef","Nurse","Marketing Manager","UX Researcher"
];
const BIOS = [
  "Weekend hikes and weekday lattes.",
  "Dog parent. Amateur chef. Karaoke enthusiast.",
  "Trying every taco in the city — for science.",
  "Bookstore browser and movie quote machine.",
  "Gym sometimes, Netflix always.",
  "Looking for the best slice in town.",
  "Will beat you at Mario Kart.",
  "Currently planning the next trip."
];

const UNSPLASH_SEEDS = [
  "1515462277126-2b47b9fa09e6",
  "1520975916090-3105956dac38",
  "1519340241574-2cec6aef0c01",
  "1554151228-14d9def656e4",
  "1548142813-c348350df52b",
  "1517841905240-472988babdf9",
  "1535713875002-d1d0cf377fde",
  "1545996124-0501ebae84d0",
  "1524504388940-b1c1722653e1",
  "1531123897727-8f129e1688ce",
];

function sample(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickTags() { return Array.from(new Set(Array.from({length:4}, ()=>sample(TAGS)))); }
function imgFor(seed) {
  return `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=1200&q=80`;
}

function generateProfiles(count = 12) {
  const profiles = [];
  for (let i = 0; i < count; i++) {
    profiles.push({
      id: `p_${i}_${Date.now().toString(36)}`,
      name: sample(FIRST_NAMES),
      age: 18 + Math.floor(Math.random() * 22),
      city: sample(CITIES),
      title: sample(JOBS),
      bio: sample(BIOS),
      tags: pickTags(),
      img: imgFor(sample(UNSPLASH_SEEDS)),
    });
  }
  return profiles;
}

// -------------------
// UI references
// -------------------
const deckEl = document.getElementById("deck");
const shuffleBtn = document.getElementById("shuffleBtn");
const likeBtn = document.getElementById("likeBtn");
const nopeBtn = document.getElementById("nopeBtn");
const superLikeBtn = document.getElementById("superLikeBtn");

let profiles = [];

// -------------------
// Render
// -------------------
function renderDeck() {
  deckEl.setAttribute("aria-busy", "true");
  deckEl.innerHTML = "";

  profiles.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    // Store bio for double-tap overlay
    card.dataset.bio = p.bio;

    const img = document.createElement("img");
    img.className = "card__media";
    img.src = p.img;
    img.alt = `${p.name} — profile photo`;

    const body = document.createElement("div");
    body.className = "card__body";

    const titleRow = document.createElement("div");
    titleRow.className = "title-row";
    titleRow.innerHTML = `
      <h2 class="card__title">${p.name}</h2>
      <span class="card__age">${p.age}</span>
    `;

    const meta = document.createElement("div");
    meta.className = "card__meta";
    meta.textContent = `${p.title} • ${p.city}`;

    const chips = document.createElement("div");
    chips.className = "card__chips";
    p.tags.forEach((t) => {
      const c = document.createElement("span");
      c.className = "chip";
      c.textContent = t;
      chips.appendChild(c);
    });

    // Swipe stamp labels (hidden by default, revealed during drag)
    const likeStamp = document.createElement("div");
    likeStamp.className = "stamp stamp--like";
    likeStamp.textContent = "LIKE";

    const nopeStamp = document.createElement("div");
    nopeStamp.className = "stamp stamp--nope";
    nopeStamp.textContent = "NOPE";

    const superStamp = document.createElement("div");
    superStamp.className = "stamp stamp--super";
    superStamp.textContent = "SUPER";

    body.appendChild(titleRow);
    body.appendChild(meta);
    body.appendChild(chips);

    card.appendChild(img);
    card.appendChild(likeStamp);
    card.appendChild(nopeStamp);
    card.appendChild(superStamp);
    card.appendChild(body);

    deckEl.appendChild(card);
  });

  deckEl.removeAttribute("aria-busy");
}

function resetDeck() {
  profiles = generateProfiles(12);
  renderDeck();
}

// -------------------
// Card dismissal
// -------------------
const SWIPE_THRESHOLD = 80;   // px before a release counts as a swipe
const ROTATION_FACTOR = 0.1;  // degrees of tilt per px of horizontal drag

function getTopCard() {
  return deckEl.firstElementChild;
}

function dismissCard(card, direction) {
  let tx = "0vw", ty = "0vh", rotate = 0;
  if (direction === "like")      { tx = "130vw";  rotate = 20; }
  else if (direction === "nope") { tx = "-130vw"; rotate = -20; }
  else if (direction === "superlike") { ty = "-130vh"; }

  card.style.transition = "transform 450ms ease, opacity 450ms ease";
  card.style.transform  = `translate(${tx}, ${ty}) rotate(${rotate}deg)`;
  card.style.opacity    = "0";
  card.style.pointerEvents = "none";

  card.addEventListener("transitionend", () => card.remove(), { once: true });
}

function handleAction(direction) {
  const top = getTopCard();
  if (!top) return;
  dismissCard(top, direction);
}

// -------------------
// Button handlers
// -------------------
likeBtn.addEventListener("click",      () => handleAction("like"));
nopeBtn.addEventListener("click",      () => handleAction("nope"));
superLikeBtn.addEventListener("click", () => handleAction("superlike"));
shuffleBtn.addEventListener("click", resetDeck);

// -------------------
// Swipe / drag gesture
// -------------------
let startX = 0, startY = 0;
let isDragging = false;
let activeCard  = null;
let didDrag     = false;  // true if pointer moved enough to count as a drag vs. tap

deckEl.addEventListener("pointerdown", (e) => {
  const card = e.target.closest(".card");
  if (!card || card !== getTopCard()) return;

  isDragging = true;
  didDrag    = false;
  activeCard = card;
  startX = e.clientX;
  startY = e.clientY;

  card.setPointerCapture(e.pointerId);
  card.style.transition  = "none";
  card.style.userSelect  = "none";
});

deckEl.addEventListener("pointermove", (e) => {
  if (!isDragging || !activeCard) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) didDrag = true;

  const rotate = dx * ROTATION_FACTOR;
  activeCard.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`;

  // Fade stamps in/out based on drag direction
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  const likeStamp  = activeCard.querySelector(".stamp--like");
  const nopeStamp  = activeCard.querySelector(".stamp--nope");
  const superStamp = activeCard.querySelector(".stamp--super");

  likeStamp.style.opacity  = dx > 20 ? Math.min((dx - 20) / 60, 1) : 0;
  nopeStamp.style.opacity  = dx < -20 ? Math.min((-dx - 20) / 60, 1) : 0;
  superStamp.style.opacity = (dy < -20 && absDy > absDx) ? Math.min((-dy - 20) / 60, 1) : 0;
});

function finishDrag(endX, endY) {
  if (!isDragging || !activeCard) return;
  isDragging = false;

  const dx   = endX - startX;
  const dy   = endY - startY;
  const card = activeCard;
  activeCard = null;

  card.querySelectorAll(".stamp").forEach((s) => { s.style.opacity = "0"; });

  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (dy < -SWIPE_THRESHOLD && absDy > absDx) {
    dismissCard(card, "superlike");
  } else if (dx > SWIPE_THRESHOLD) {
    dismissCard(card, "like");
  } else if (dx < -SWIPE_THRESHOLD) {
    dismissCard(card, "nope");
  } else {
    // Not far enough — snap back
    card.style.transition = "transform 300ms ease";
    card.style.transform  = "";
    card.style.userSelect = "";
  }
}

deckEl.addEventListener("pointerup",     (e) => finishDrag(e.clientX, e.clientY));
deckEl.addEventListener("pointercancel", () => {
  if (!activeCard) return;
  activeCard.style.transition = "transform 300ms ease";
  activeCard.style.transform  = "";
  activeCard.style.userSelect = "";
  activeCard.querySelectorAll(".stamp").forEach((s) => { s.style.opacity = "0"; });
  isDragging = false;
  activeCard = null;
});

// -------------------
// Double-tap → bio overlay
// -------------------
let lastTapTime = 0;
let lastTapCard = null;

deckEl.addEventListener("click", (e) => {
  // Ignore releases that ended a drag
  if (didDrag) return;

  const card = e.target.closest(".card");
  if (!card || card !== getTopCard()) return;

  const now = Date.now();
  if (now - lastTapTime < 350 && lastTapCard === card) {
    toggleBioOverlay(card);
    lastTapTime = 0;
    lastTapCard = null;
  } else {
    lastTapTime = now;
    lastTapCard = card;
  }
});

function toggleBioOverlay(card) {
  const existing = card.querySelector(".bio-overlay");
  if (existing) {
    existing.remove();
    return;
  }
  const overlay = document.createElement("div");
  overlay.className = "bio-overlay";
  overlay.innerHTML = `<p class="bio-overlay__text">${card.dataset.bio}</p>`;
  // Tap overlay itself to dismiss
  overlay.addEventListener("click", (e) => {
    e.stopPropagation();
    overlay.remove();
  });
  card.appendChild(overlay);
}

// Boot
resetDeck();
