// Page motion (GSAP) and the lazy loader for the hero's 3D object. Bundled by tools/ into assets/js/main.js.
// Spec: design/storybook/DESIGN.md. Motion is deliberately quiet: one reveal style, nothing scroll-pinned.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initHeader();
if (!reduce) initMotion();

// three.js is ~140 KB gzipped: fetch it only after load, when the browser is idle,
// and skip it for Save-Data users (the poster image stays).
const saveData = navigator.connection && navigator.connection.saveData;
function idle(fn) { 'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 400); }
function loadScene() { import('./scene.js').then((m) => m.initScene({ reduce })).catch(() => {}); }
if (!saveData) {
  if (document.readyState === 'complete') idle(loadScene);
  else window.addEventListener('load', () => idle(loadScene), { once: true });
}

/* header hides on scroll down, returns on scroll up */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  let last = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('is-hidden', y > last && y > 240);
    last = y;
  }, { passive: true });
}

function initMotion() {
  // one reveal style everywhere: a short rise and fade, staggered within each group
  const groups = new Map();
  gsap.utils.toArray('.reveal').forEach((el) => {
    const key = el.parentElement;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  });
  groups.forEach((els, parent) => {
    gsap.fromTo(els, { y: 28, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: parent, start: 'top 82%' },
    });
  });

  // section titles slide up out of their line mask
  gsap.utils.toArray('.section h2').forEach((h) => {
    if (h.querySelector('.line')) return;
    gsap.fromTo(h, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
  });
  gsap.utils.toArray('.reveal-lines').forEach((h) => {
    gsap.fromTo(h.querySelectorAll('.line > span'), { y: 0, yPercent: 105 }, {
      y: 0, yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: h, start: 'top 85%' },
    });
  });

  // the flow: the line draws through the four steps, each step lights up as the line reaches it
  const steps = document.querySelector('.flow-steps');
  if (steps) {
    const items = steps.querySelectorAll('.flow-step');
    const tl = gsap.timeline({ scrollTrigger: { trigger: steps, start: 'top 75%' } });
    tl.fromTo(steps, { '--draw': 0 }, { '--draw': 1, duration: 1.6, ease: 'power2.inOut' }, 0);
    items.forEach((it, i) => {
      tl.fromTo(it, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.15 + i * 0.36);
      tl.fromTo(it.querySelector('.flow-step__dot'), { scale: 0.4 }, { scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, 0.15 + i * 0.36);
    });
  }

  gsap.fromTo('.about__photo img', { scale: 1.12 }, {
    scale: 1, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}
