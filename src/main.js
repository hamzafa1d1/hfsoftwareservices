// Page motion (GSAP) and the lazy loader for the 3D scene. Bundled by tools/ into assets/js/main.js.
// Spec: design/storybook/DESIGN.md
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initHeader();
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

  gsap.utils.toArray('.gate-step').forEach((step, i, all) => {
    const card = step.querySelector('.gate-card');
    const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: i === 0 ? 'top top' : 'top bottom', end: 'bottom top', scrub: 0.4 } });
    // in by 38%, hold, gone by 72% of the step's pass, so two cards never share the screen
    if (i > 0) tl.fromTo(card, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.38 });
    else tl.to(card, { opacity: 1, duration: 0.38 });
    tl.to(card, { opacity: 1, duration: 0.12 });
    if (i < all.length - 1) tl.to(card, { opacity: 0, y: -50, ease: 'power2.in', duration: 0.22 }).to(card, { opacity: 0, duration: 0.28 });
    else tl.to(card, { opacity: 1, duration: 0.5 });
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

