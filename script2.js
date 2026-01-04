const carousel = document.querySelector('.carousel');
const cards = [...document.querySelectorAll('.card')];

const infoIndex = document.querySelector('.info-index');
const infoName  = document.querySelector('.info-name');
const infoDesc  = document.querySelector('.info-desc');

let currentVelocity = 0;
let targetVelocity = 0;
const easing = 0.08;
const maxSpeed = 10;

let isMouseInCardZone = false;
let snapTimeout = null;

let activeCard = null;
let lastActiveCard = null;

/* =========================
   SNAP TO CENTER
========================= */
function snapToCenter() {
  const rect = carousel.getBoundingClientRect();
  const center = rect.left + rect.width / 2;

  let closest = null;
  let minDistance = Infinity;

  cards.forEach(card => {
    const r = card.getBoundingClientRect();
    const cardCenter = r.left + r.width / 2;
    const distance = Math.abs(center - cardCenter);

    if (distance < minDistance) {
      minDistance = distance;
      closest = card;
    }
  });

  if (closest) {
    const cardRect = closest.getBoundingClientRect();
    const offset =
      cardRect.left -
      rect.left -
      rect.width / 2 +
      cardRect.width / 2;

    carousel.scrollLeft += offset;
  }
}

/* =========================
   INFO PANEL
========================= */
function updateInfo(card) {
  if (!card) return;

  infoIndex.textContent = card.dataset.index || '';
  infoName.textContent  = card.dataset.name  || '';
  infoDesc.textContent  = card.dataset.desc  || '';
}

/* =========================
   MOUSE MOVE
========================= */
carousel.addEventListener('mousemove', (e) => {
  const carouselRect = carousel.getBoundingClientRect();

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const topLimit = carouselRect.top;
  const bottomLimit = carouselRect.bottom;

  isMouseInCardZone = mouseY >= topLimit && mouseY <= bottomLimit;

  if (!isMouseInCardZone) {
    targetVelocity = 0;

    clearTimeout(snapTimeout);
    snapTimeout = setTimeout(snapToCenter, 200);
    return;
  }

  const x = mouseX - carouselRect.left;
  const center = carouselRect.width / 2;

  const distance = x - center;
  const normalized = distance / center;

  targetVelocity = normalized * maxSpeed;
});

carousel.addEventListener('mouseleave', () => {
  targetVelocity = 0;
});

/* =========================
   LOOP
========================= */
function animate() {
  currentVelocity += (targetVelocity - currentVelocity) * easing;
  carousel.scrollLeft += currentVelocity;

  updateActiveCard();
  requestAnimationFrame(animate);
}

animate();

/* =========================
   ACTIVE CARD
========================= */
function updateActiveCard() {
  const rect = carousel.getBoundingClientRect();
  const center = rect.left + rect.width / 2;

  let closest = null;
  let minDistance = Infinity;

  cards.forEach(card => {
    const r = card.getBoundingClientRect();
    const cardCenter = r.left + r.width / 2;
    const distance = Math.abs(center - cardCenter);

    if (distance < minDistance) {
      minDistance = distance;
      closest = card;
    }
  });

  if (closest !== activeCard) {
    activeCard = closest;

    cards.forEach(c => c.classList.remove('active'));
    activeCard.classList.add('active');

    updateInfo(activeCard);
  }
}

/* =========================
   INIT CENTER
========================= */
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    const mid = Math.floor(cards.length / 2);
    const card = cards[mid];

    const cRect = carousel.getBoundingClientRect();
    const r = card.getBoundingClientRect();

    carousel.scrollLeft +=
      r.left - cRect.left - cRect.width / 2 + r.width / 2;
  });
});

window.addEventListener('resize', snapToCenter);
