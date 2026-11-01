// Site motion + 3D "dispatch" scene. Bundled by tools/ (esbuild) into assets/site.min.js.
// Spec: design/storybook/DESIGN.md
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, Group, Mesh, BoxGeometry, PlaneGeometry,
  MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, CanvasTexture, SRGBColorSpace,
  NeutralToneMapping, PMREMGenerator, PCFSoftShadowMap, Vector3, AmbientLight, DirectionalLight, MathUtils,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

window.__siteReady = true;
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const INK = '#0e0f10', GROUND = '#e4e6e8', SIGNAL = '#ff4f12', MUTED = '#4a4f55';
const GATES = ['Brainstorm', 'Plan', 'Approve', 'Build', 'Review', 'QA', 'Ship', 'Human review', 'Retro'];
const HUMAN = new Set([2, 7]);

initHeader();
if (!reduce) initMotion();
document.fonts.load('800 80px Archivo').catch(() => {}).finally(() => initScene());

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
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.hero .line > span', { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.3, stagger: 0.09 })
    .fromTo('.hero__foot', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1 }, 0.55);

  gsap.utils.toArray('.reveal-lines').forEach((h) => {
    gsap.fromTo(h.querySelectorAll('.line > span'), { yPercent: 110 }, {
      yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.09,
      scrollTrigger: { trigger: h, start: 'top 85%' },
    });
  });

  gsap.utils.toArray('.gate-step').forEach((step) => {
    gsap.fromTo(step.children, { x: -70, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: step, start: 'top 62%', end: 'bottom 38%', toggleActions: 'play reverse play reverse' },
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
    const flip = c.classList.contains('case--flip');
    gsap.fromTo(c.querySelector('.case__num'), { xPercent: flip ? 28 : -28, scale: 0.72 }, {
      xPercent: 0, scale: 1, ease: 'none',
      scrollTrigger: { trigger: c, start: 'top bottom', end: 'center 55%', scrub: 0.8 },
    });
    gsap.fromTo(c.querySelectorAll('.case__text > *'), { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.07,
      scrollTrigger: { trigger: c, start: 'top 70%' },
    });
  });

  gsap.utils.toArray('.marquee__line').forEach((line) => {
    const dir = Number(line.dataset.dir) || 1;
    gsap.fromTo(line, { xPercent: dir > 0 ? -32 : 0 }, {
      xPercent: dir > 0 ? 0 : -32, ease: 'none',
      scrollTrigger: { trigger: '.modules', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
  });
  gsap.fromTo('.modules__cols > *', { y: 50, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1,
    scrollTrigger: { trigger: '.modules__cols', start: 'top 85%' },
  });

  gsap.utils.toArray('.list').forEach((list) => {
    gsap.fromTo(list.querySelectorAll('li'), { x: 60, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08,
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

/* ---------------- 3D scene ---------------- */
function textCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}
// Path the ticket travels: gate k sits at s = k.
const pathX = (s) => Math.sin(s * 0.85) * 1.1;
const pathZ = (s) => -s * 6;

// Scroll progress p (0..1 over the journey) → position s along the gates, with the Review kick-back.
const WAY = [[0, -0.75], [1 / 9, 0], [2 / 9, 1], [3 / 9, 2], [4 / 9, 3], [4.8 / 9, 4], [5.08 / 9, 3.15], [5.4 / 9, 4.05], [6 / 9, 5], [7 / 9, 6], [8 / 9, 7], [1, 8]];
function sAt(p) {
  for (let i = 1; i < WAY.length; i++) {
    if (p <= WAY[i][0]) {
      const [p0, s0] = WAY[i - 1], [p1, s1] = WAY[i];
      const t = (p - p0) / (p1 - p0);
      return s0 + (s1 - s0) * (t * t * (3 - 2 * t));
    }
  }
  return WAY[WAY.length - 1][1];
}
const inConcerns = (p) => p > 4.82 / 9 && p < 5.32 / 9;

function initScene() {
  const stage = document.getElementById('stage');
  const canvas = document.getElementById('scene');
  if (!stage || !canvas) return;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  scene.background = new Color(GROUND);
  scene.fog = new Fog(GROUND, 10, 34);
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  scene.add(new AmbientLight(0xffffff, 0.5));
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(5, 9, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -8; key.shadow.camera.right = 8; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  key.shadow.camera.near = 1; key.shadow.camera.far = 30;
  key.shadow.radius = 6; key.shadow.bias = -0.0004;
  scene.add(key, key.target);

  const camera = new PerspectiveCamera(40, 1, 0.1, 80);
  const labels = [];

  // floor: a slightly darker tone step so the gates stand on something
  const floor = new Mesh(new PlaneGeometry(60, 140), new MeshStandardMaterial({ color: '#d6d9dc', roughness: 1 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -1.02, -40);
  floor.receiveShadow = true;
  scene.add(floor);

  /* gates */
  const inkMat = new MeshStandardMaterial({ color: '#17191b', roughness: 0.42, metalness: 0.35 });
  const whiteMat = new MeshStandardMaterial({ color: '#fbfbfb', roughness: 0.3, metalness: 0.05 });
  const reviewMat = new MeshStandardMaterial({ color: '#17191b', roughness: 0.42, metalness: 0.35, emissive: new Color(SIGNAL), emissiveIntensity: 0 });
  const W = 3.4, H = 2.4, T = 0.16, D = 0.36, CY = 0.2;
  function frame(mat) {
    const g = new Group();
    const top = new Mesh(new BoxGeometry(W, T, D), mat); top.position.y = H / 2;
    const bot = new Mesh(new BoxGeometry(W, T * 0.5, D), mat); bot.position.y = -H / 2 + T * 0.25;
    const l = new Mesh(new BoxGeometry(T, H, D), mat); l.position.x = -W / 2;
    const r = new Mesh(new BoxGeometry(T, H, D), mat); r.position.x = W / 2;
    [top, bot, l, r].forEach((m) => { m.castShadow = true; m.receiveShadow = true; });
    g.add(top, bot, l, r);
    return g;
  }
  function label(text, i) {
    const [c, x] = textCanvas(1024, 220);
    x.fillStyle = HUMAN.has(i) ? INK : 'rgba(0,0,0,0)';
    if (HUMAN.has(i)) x.fillRect(0, 0, 1024, 220);
    x.fillStyle = HUMAN.has(i) ? '#fbfbfb' : INK;
    x.font = '800 150px Archivo, Arial Narrow, sans-serif';
    x.fontStretch = 'condensed';
    x.textBaseline = 'middle';
    x.textAlign = 'center';
    x.fillText(text, 512, 118, 980);
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    const LW = W * 0.62;
    const m = new Mesh(new PlaneGeometry(LW, LW * 220 / 1024), new MeshBasicMaterial({ map: tex, transparent: true }));
    m.position.y = H / 2 + 0.42;
    return m;
  }
  GATES.forEach((name, i) => {
    const g = new Group();
    const main = frame(i === 4 ? reviewMat : HUMAN.has(i) ? whiteMat : inkMat);
    g.add(main);
    if (HUMAN.has(i)) { const second = frame(whiteMat); second.position.z = -0.7; g.add(second); }
    const lab = label(name, i);
    g.add(lab);
    labels.push(lab);
    g.position.set(pathX(i), CY, pathZ(i));
    g.rotation.y = -Math.atan2(Math.cos(i * 0.85) * 0.94, 6);
    scene.add(g);
  });

  /* ticket */
  const [tc, tx] = textCanvas(1024, 650);
  const ticketTex = new CanvasTexture(tc);
  ticketTex.colorSpace = SRGBColorSpace;
  ticketTex.anisotropy = 8;
  let drawn = '';
  function drawTicket(stamp, passed, hot) {
    const keyStr = stamp + passed + hot;
    if (keyStr === drawn) return;
    drawn = keyStr;
    tx.fillStyle = '#ffffff'; tx.fillRect(0, 0, 1024, 650);
    tx.fillStyle = MUTED; tx.font = '600 40px Archivo, Arial, sans-serif'; tx.textBaseline = 'top';
    tx.fillText('Ticket, US HR SaaS platform', 64, 56);
    tx.fillStyle = INK; tx.font = '800 92px Archivo, Arial Narrow, sans-serif';
    tx.fillText('Admins can’t see', 64, 120, 900);
    tx.fillText('in-flight forms', 64, 214, 900);
    for (let i = 0; i < 9; i++) {           // nine gate squares, filled as they are passed
      tx.fillStyle = i < passed ? INK : '#d8dbde';
      tx.fillRect(64 + i * 62, 360, 50, 50);
    }
    tx.save();
    tx.translate(64, 470);
    tx.font = '800 64px Archivo, Arial Narrow, sans-serif';
    const w = tx.measureText(stamp).width + 56;
    tx.fillStyle = hot ? SIGNAL : INK;
    tx.fillRect(0, 0, w, 104);
    tx.fillStyle = hot ? INK : '#ffffff';
    tx.fillText(stamp, 28, 22);
    tx.restore();
    ticketTex.needsUpdate = true;
  }
  const side = new MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  const face = new MeshPhysicalMaterial({ map: ticketTex, emissiveMap: ticketTex, emissive: new Color('#ffffff'), emissiveIntensity: 0.62, roughness: 0.45, clearcoat: 0.5 });
  const ticket = new Mesh(new RoundedBoxGeometry(1.6, 1.02, 0.07, 4, 0.04), [side, side, side, side, face, side]);
  ticket.castShadow = true;
  scene.add(ticket);

  const shell = new Mesh(
    new RoundedBoxGeometry(1.82, 1.24, 0.28, 5, 0.12),
    new MeshPhysicalMaterial({ color: '#ffffff', transmission: 1, roughness: 0.06, thickness: 0.35, ior: 1.35, transparent: true, opacity: 0.95 }),
  );
  shell.scale.setScalar(0.001);
  scene.add(shell);

  const scan = new Mesh(new PlaneGeometry(2.2, 0.035), new MeshBasicMaterial({ color: SIGNAL }));
  scan.visible = false;
  scene.add(scan);

  /* state */
  const tmp = new Vector3();
  let target = 0, p = 0, px = 0, py = 0, pxs = 0, pys = 0, visible = true, running = false, narrow = false;
  if (!reduce) {
    ScrollTrigger.create({
      trigger: '.journey', start: 'top bottom', end: 'bottom bottom',
      onUpdate: (self) => { target = self.progress; },
    });
    window.addEventListener('pointermove', (e) => {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }

  function resize() {
    const w = stage.querySelector('.stage__viewport').clientWidth;
    const h = stage.querySelector('.stage__viewport').clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    narrow = w <= 900;
    if (!narrow) camera.setViewOffset(w, h, -w * 0.3, 0, w, h);
    else camera.setViewOffset(w, h, 0, h * 0.3, w, h);
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let lastT = 0;
  function frameAt(time) {
    const dt = Math.min(0.25, Math.max(0, time - lastT)); lastT = time;
    const k = 1 - Math.exp(-dt * 5.5), kp = 1 - Math.exp(-dt * 3);
    p += (target - p) * k;
    pxs += (px - pxs) * kp; pys += (py - pys) * kp;
    const s = sAt(p);
    const hot = inConcerns(p);
    const bob = reduce ? 0 : Math.sin(time * 1.4) * 0.05;

    ticket.position.set(pathX(s), bob, pathZ(s));
    const heading = -Math.atan2(Math.cos(s * 0.85) * 0.94, 6);
    ticket.rotation.set(-0.08 + pys * 0.25, heading + 0.9 + pxs * 0.5 + (s < 0 ? Math.sin(time * 0.6) * 0.12 : 0), Math.sin(time * 0.9) * 0.035);
    shell.position.copy(ticket.position);
    shell.rotation.copy(ticket.rotation);
    const freeze = MathUtils.smoothstep(s, 1.75, 2.15);
    shell.scale.setScalar(Math.max(0.001, freeze));
    shell.visible = freeze > 0.01;

    reviewMat.emissiveIntensity = hot ? 1.6 + Math.sin(time * 14) * 0.6 : Math.max(0, reviewMat.emissiveIntensity - 0.05);

    const scanT = MathUtils.clamp((s - 4.6) / 0.8, 0, 1);
    scan.visible = scanT > 0 && scanT < 1;
    if (scan.visible) {
      scan.position.set(ticket.position.x, ticket.position.y + 0.62 - scanT * 1.24, ticket.position.z + 0.2);
      scan.rotation.copy(ticket.rotation);
    }

    const passed = Math.max(0, Math.min(9, Math.floor(s + 0.05) + 1));
    let stamp = 'New';
    if (s >= 0.6) stamp = 'Planned';
    if (s >= 1.9) stamp = 'Plan frozen';
    if (s >= 2.9) stamp = 'Built';
    if (hot) stamp = 'Concerns';
    else if (s >= 3.95 && p > 5.3 / 9) stamp = 'Review pass';
    if (s >= 4.9) stamp = 'Evidence attached';
    if (s >= 5.9) stamp = 'PR open';
    if (s >= 6.9) stamp = 'Merged';
    if (s >= 7.9) stamp = 'Shipped';
    drawTicket(stamp, s < -0.2 ? 0 : passed, hot);

    const near = MathUtils.clamp(-s / 0.75, 0, 1);           // closer framing while the hero is on screen
    const side = narrow ? 3.6 : 5.4 - near * 1.7;
    const ahead = narrow ? 0 : 0.3 - near * 0.2;
    camera.position.set(pathX(s - 0.6) + side + pxs * 0.9, (narrow ? 1.7 : 2.3 - near * 0.6) - pys * 0.5, pathZ(s - 0.6) + (narrow ? 1.6 : 0));
    camera.lookAt(pathX(s + ahead) + (narrow ? 0 : 0.3), -0.15, pathZ(s + ahead));
    for (const lab of labels) { lab.lookAt(camera.position.x, lab.getWorldPosition(tmp).y, camera.position.z); }
    key.position.set(ticket.position.x + 5, 9, ticket.position.z + 4);
    key.target.position.copy(ticket.position);
    renderer.render(scene, camera);
  }

  function loop(t) {
    if (!visible || document.hidden) { running = false; return; }
    frameAt(t / 1000);
    requestAnimationFrame(loop);
  }
  function start() { if (!running && !reduce) { running = true; requestAnimationFrame(loop); } }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) start(); }).observe(stage);
  }
  document.addEventListener('visibilitychange', start);

  frameAt(0);
  stage.classList.add('is-live');
  start();
}
