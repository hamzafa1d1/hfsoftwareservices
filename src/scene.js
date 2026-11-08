// 3D "dispatch" scene: a ticket travels through nine gates as you scroll. Loaded lazily by main.js.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, Group, Mesh, BoxGeometry, PlaneGeometry,
  MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, CanvasTexture, SRGBColorSpace,
  NeutralToneMapping, PMREMGenerator, PCFSoftShadowMap, AmbientLight, DirectionalLight, MathUtils,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const INK = '#0e0f10', GROUND = '#e4e6e8', SIGNAL = '#ff4f12', MUTED = '#4a4f55';
const GATES = ['Brainstorm', 'Plan', 'Approve', 'Build', 'Review', 'QA', 'Ship', 'Human review', 'Retro'];
const HUMAN = new Set([2, 7]);
let reduce = false;

export function initScene(opts) {
  reduce = !!(opts && opts.reduce);
  return document.fonts.load('800 80px Archivo').catch(() => {}).then(() => buildScene());
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
// Built from the real step positions (see measureWay), so the ticket reaches gate k
// exactly when step k's card is centred, whatever the step heights are.
let WAY = [[0, -0.75], [1, 8]];
let CONCERNS = [0.5, 0.55];
function measureWay() {
  const j = document.querySelector('.journey');
  const steps = [...j.querySelectorAll('.gate-step')];
  const vh = window.innerHeight, len = j.offsetHeight, start = j.offsetTop - vh;
  const pk = steps.map((st) => Math.min(1, Math.max(0, (st.offsetTop + j.offsetTop + st.offsetHeight / 2 - vh / 2 - start) / len)));
  const d = pk[5] - pk[4];
  WAY = [[0, -0.75]];
  for (let k = 0; k <= 3; k++) WAY.push([pk[k], k]);
  WAY.push([pk[4] - 0.3 * d, 4], [pk[4] + 0.02 * d, 3.15], [pk[4] + 0.3 * d, 4.05]);
  for (let k = 5; k <= 8; k++) WAY.push([pk[k], k]);
  WAY.push([1, 8]);
  CONCERNS = [pk[4] - 0.27 * d, pk[4] + 0.27 * d];
}
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
const inConcerns = (p) => p > CONCERNS[0] && p < CONCERNS[1];

function buildScene() {
  const lowPower = window.matchMedia('(max-width: 900px)').matches || (navigator.hardwareConcurrency || 8) <= 4;
  const stage = document.getElementById('stage');
  const canvas = document.getElementById('scene');
  if (!stage || !canvas) return;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !lowPower || window.devicePixelRatio < 2, powerPreference: lowPower ? 'low-power' : 'high-performance' });
  } catch (e) { return; }
  // Software WebGL (SwiftShader, llvmpipe) can't draw this scene smoothly and would block the main
  // thread; keep the poster instead. ?webgl=force overrides this for screenshot tests.
  const gl = renderer.getContext();
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  if (/swiftshader|llvmpipe|software|basic render/i.test(gpu) && !/[?&]webgl=force/.test(location.search)) {
    renderer.dispose();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 1.75));
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  scene.background = new Color(GROUND);
  scene.fog = new Fog(GROUND, 14, 44);
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  scene.add(new AmbientLight(0xffffff, 0.5));
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(5, 9, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(lowPower ? 1024 : 2048, lowPower ? 1024 : 2048);
  key.shadow.camera.left = -8; key.shadow.camera.right = 8; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  key.shadow.camera.near = 1; key.shadow.camera.far = 30;
  key.shadow.radius = 6; key.shadow.bias = -0.0004;
  scene.add(key, key.target);

  const camera = new PerspectiveCamera(30, 1, 0.1, 120);

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
  GATES.forEach((name, i) => {
    const g = new Group();
    const main = frame(i === 4 ? reviewMat : HUMAN.has(i) ? whiteMat : inkMat);
    g.add(main);
    if (HUMAN.has(i)) { const second = frame(whiteMat); second.position.z = -0.7; g.add(second); }

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
    else camera.setViewOffset(w, h, 0, h * 0.27, w, h);
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', () => { resize(); measureWay(); });
  resize();
  measureWay();

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
    else if (s >= 3.95 && p > CONCERNS[1]) stamp = 'Review pass';
    if (s >= 4.9) stamp = 'Evidence attached';
    if (s >= 5.9) stamp = 'PR open';
    if (s >= 6.9) stamp = 'Merged';
    if (s >= 7.9) stamp = 'Shipped';
    drawTicket(stamp, s < -0.2 ? 0 : passed, hot);

    const near = MathUtils.clamp(-s / 0.75, 0, 1);           // closer framing while the hero is on screen
    const side = narrow ? 9.5 : 9 - near * 2.6;
    const ahead = narrow ? 0 : 0.3 - near * 0.2;
    camera.position.set(pathX(s - 0.35) + side + pxs * 0.9, (narrow ? 3.4 : 3.6 - near * 1.1) - pys * 0.5, pathZ(s - 0.35) + (narrow ? 2.4 : 1.4));
    camera.lookAt(pathX(s + ahead) + (narrow ? 0 : 0.3), -0.15, pathZ(s + ahead));
    key.position.set(ticket.position.x + 5, 9, ticket.position.z + 4);
    key.target.position.copy(ticket.position);
    renderer.render(scene, camera);
  }

  // Render on demand: every frame while the ticket, camera or pointer is moving, otherwise
  // ~20 fps for the idle float. Nothing renders while the stage is off-screen or the tab is hidden.
  let lastDraw = 0;
  function busy() {
    return Math.abs(target - p) > 0.0004 || Math.abs(px - pxs) > 0.002 || Math.abs(py - pys) > 0.002 || inConcerns(p);
  }
  function loop(t) {
    if (!visible || document.hidden) { running = false; return; }
    if (busy() || t - lastDraw > 50) { frameAt(t / 1000); lastDraw = t; }
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
