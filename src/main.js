// Page motion (GSAP) and the lazy loader for the 3D scene. Bundled by tools/ into assets/js/main.js.
// Spec: design/storybook/DESIGN.md
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initHeader();
initJourney();
if (!reduce) initMotion();

// three.js is ~150 KB gzipped: fetch it only after the page has loaded and the browser is idle,
// and skip it entirely for Save-Data users (the poster image stays).
const saveData = navigator.connection && navigator.connection.saveData;
function idle(fn) { 'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 400); }
function loadScene() { import('./scene.js').then((m) => m.initScene({ reduce })).catch(() => {}); }
if (!saveData) {
  if (document.readyState === 'complete') idle(loadScene);
  else window.addEventListener('load', () => idle(loadScene), { once: true });
}

/* ---------------- header: hide on scroll down ---------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  let last = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('is-hidden', y > last && y > 200);
    last = y;
  }, { passive: true });
}

/* ---------------- page motion ---------------- */
function initMotion() {
  gsap.utils.toArray('.reveal-lines').forEach((h) => {
    gsap.fromTo(h.querySelectorAll('.line > span'), { yPercent: 110 }, {
      yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.09,
      scrollTrigger: { trigger: h, start: 'top 85%' },
    });
  });

  gsap.fromTo('.kit__body > *', { y: 36, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.09,
    scrollTrigger: { trigger: '.kit__body', start: 'top 80%' },
  });

  gsap.fromTo('.doc > *', { clipPath: 'inset(0 0 100% 0)', y: 24 }, {
    clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.11,
    scrollTrigger: { trigger: '.doc', start: 'top 75%' },
  });
  gsap.fromTo('.doc__checks li', { x: -30, opacity: 0 }, {
    x: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.18,
    scrollTrigger: { trigger: '.doc__checks', start: 'top 85%' },
  });

  gsap.utils.toArray('.case').forEach((c) => {
    const num = c.querySelector('.case__num');
    num.style.transformOrigin = c.classList.contains('case--flip') ? '100% 100%' : '0% 100%';
    gsap.fromTo(num, { scale: 0.8, opacity: 0.6 }, {
      scale: 1, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: c, start: 'top bottom', end: 'center 55%', scrub: 0.8 },
    });
    gsap.fromTo(c.querySelectorAll('.case__text > *'), { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.07,
      scrollTrigger: { trigger: c, start: 'top 70%' },
    });
  });

  gsap.utils.toArray('.module-row').forEach((row) => {
    gsap.fromTo(row.querySelector('.module-row__name'), { xPercent: 10, opacity: 0 }, {
      xPercent: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: row, start: 'top bottom', end: 'top 55%', scrub: 0.5 },
    });
    gsap.fromTo(row.querySelector('.module-row__body'), { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 75%' },
    });
  });

  gsap.utils.toArray('.list').forEach((list) => {
    gsap.fromTo(list.querySelectorAll('li'), { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: list, start: 'top 75%' },
    });
  });

  gsap.fromTo('.about__photo img', { scale: 1.22 }, {
    scale: 1, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.fromTo('.quote', { y: 40, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.quote', start: 'top 85%' },
  });
  gsap.fromTo('.contact__row > *', { y: 30, opacity: 0 }, {
    y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1,
    scrollTrigger: { trigger: '.contact__row', start: 'top 90%' },
  });
}


/* ---------------- journey: pinned phases, one flick per phase ---------------- */
// Without JS or with reduced motion the nine phases stay a plain readable list.
// Otherwise the journey holds still while scrolling moves through the phases, each scroll
// settles on the nearest phase, and the phase buttons jump straight to one.
function initJourney() {
  const j = document.querySelector('.journey');
  if (!j) return;
  window.__journeyF = -0.8;
  if (reduce) return;
  const steps = [...j.querySelectorAll('.gate-step')];
  const nav = j.querySelector('.phase-nav');
  const btns = [...j.querySelectorAll('[data-phase]')];
  const prev = j.querySelector('[data-go="prev"]'), next = j.querySelector('[data-go="next"]');
  const last = steps.length - 1;
  j.classList.add('is-pinned');
  if (nav) nav.hidden = false;

  let active = -1;
  function setActive(i) {
    if (i === active) return;
    active = i;
    steps.forEach((st, k) => st.classList.toggle('is-active', k === i));
    btns.forEach((b, k) => b.setAttribute('aria-current', k === i ? 'step' : 'false'));
    if (prev) prev.disabled = i <= 0;
    if (next) next.disabled = i >= last;
  }
  setActive(0);

  // snapping lives on this trigger; the position itself is computed straight from scrollY,
  // so it is right even when a scroll lands exactly on a boundary
  const pin = ScrollTrigger.create({
    trigger: j, start: 'top top', end: 'bottom bottom',
    snap: { snapTo: 1 / last, duration: { min: 0.25, max: 0.6 }, delay: 0.06, ease: 'power2.inOut' },
  });
  function update() {
    const y = window.scrollY, vh = window.innerHeight;
    let f;
    if (y < pin.start) f = -0.8 + 0.8 * Math.max(0, Math.min(1, (y - (pin.start - vh)) / vh));   // ticket rolls in under the hero
    else f = Math.max(0, Math.min(1, (y - pin.start) / Math.max(1, pin.end - pin.start))) * last;
    window.__journeyF = f;
    setActive(Math.max(0, Math.round(f)));
  }
  window.addEventListener('scroll', update, { passive: true });
  ScrollTrigger.addEventListener('refresh', update);
  update();
  const goTo = (i) => window.scrollTo({ top: pin.start + (pin.end - pin.start) * (Math.max(0, Math.min(last, i)) / last), behavior: 'smooth' });
  btns.forEach((b) => b.addEventListener('click', () => goTo(Number(b.dataset.phase))));
  if (prev) prev.addEventListener('click', () => goTo(active - 1));
  if (next) next.addEventListener('click', () => goTo(active + 1));
}
