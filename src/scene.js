// Hero 3D object: a glossy ink ribbon shaped as an infinity loop, with signal-orange arrows
// gliding along it. It animates on its own clock (nothing is tied to scroll position except a
// gentle tilt as the hero leaves). Loaded lazily by main.js.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Group, Mesh, PlaneGeometry, Shape, ExtrudeGeometry,
  InstancedMesh, BufferGeometry, Float32BufferAttribute, Vector3, Matrix4, Quaternion, MathUtils,
  MeshPhysicalMaterial, MeshStandardMaterial, ShadowMaterial, SRGBColorSpace, NeutralToneMapping,
  PMREMGenerator, PCFSoftShadowMap, AmbientLight, DirectionalLight,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const SIGNAL = '#ff4f12', GROUND = '#e4e6e8';
let reduce = false;

export function initScene(opts) {
  reduce = !!(opts && opts.reduce);
  buildScene();
}

/* The loop: a lemniscate laid flat, one strand lifted where the two cross. */
const SAMPLES = 360, A = 2.6, W = 0.34, H = 0.075;
function loopPoint(u, out = new Vector3()) {
  const t = u * Math.PI * 2;
  const d = 1 + Math.sin(t) ** 2;
  return out.set(A * Math.cos(t) / d, 0.28 * Math.sin(t), A * Math.sin(t) * Math.cos(t) / d);
}
// frame at u: tangent, a side vector and an up vector that stays close to world up (no twisting)
function frameAt(u, c, tan, side, up) {
  const e = 1 / SAMPLES;
  loopPoint(u, c);
  loopPoint((u + e) % 1, tan).sub(loopPoint((u - e + 1) % 1, new Vector3())).normalize();
  side.crossVectors(tan, new Vector3(0, 1, 0)).normalize();
  up.crossVectors(side, tan).normalize();
}

// A ribbon with a rectangular section; 8 vertices per ring so the edges stay crisp.
function ribbonGeometry() {
  const pos = [], nor = [], idx = [];
  const c = new Vector3(), tan = new Vector3(), side = new Vector3(), up = new Vector3();
  const corners = [[1, 1], [-1, 1], [-1, -1], [1, -1]];      // (side, up) signs, going round the section
  for (let i = 0; i <= SAMPLES; i++) {
    frameAt((i % SAMPLES) / SAMPLES, c, tan, side, up);
    for (let f = 0; f < 4; f++) {                          // four faces, two vertices each
      const a = corners[f], b = corners[(f + 1) % 4];
      const n = new Vector3().addScaledVector(side, (a[0] + b[0]) / 2).addScaledVector(up, (a[1] + b[1]) / 2).normalize();
      for (const k of [a, b]) {
        const p = c.clone().addScaledVector(side, k[0] * W).addScaledVector(up, k[1] * H);
        pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z);
      }
    }
  }
  for (let i = 0; i < SAMPLES; i++) {
    for (let f = 0; f < 4; f++) {
      const a = i * 8 + f * 2, b = a + 1, c2 = a + 8, d = b + 8;
      idx.push(a, c2, b, b, c2, d);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  return g;
}

function chevronGeometry() {
  const sh = new Shape();
  sh.moveTo(-0.5, -0.32); sh.lineTo(0, 0.18); sh.lineTo(0.5, -0.32);
  sh.lineTo(0.5, -0.04); sh.lineTo(0, 0.46); sh.lineTo(-0.5, -0.04); sh.closePath();
  const g = new ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: false });
  g.rotateX(-Math.PI / 2);          // lie flat, pointing towards -z
  g.scale(0.42, 1, 0.42);
  return g;
}

function buildScene() {
  const hero = document.querySelector('.hero');
  const canvas = document.getElementById('scene');
  if (!hero || !canvas) return;
  const lowPower = window.matchMedia('(max-width: 900px)').matches || (navigator.hardwareConcurrency || 8) <= 4;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: lowPower ? 'low-power' : 'high-performance' });
  } catch (e) { return; }
  // Software WebGL can't draw this smoothly; keep the poster. ?webgl=force overrides for screenshot tests.
  const gl = renderer.getContext();
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  if (/swiftshader|llvmpipe|software|basic render/i.test(gpu) && !/[?&]webgl=force/.test(location.search)) {
    renderer.dispose();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
  renderer.toneMapping = NeutralToneMapping;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setClearColor(new Color(GROUND), 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environmentIntensity = 0.9;
  scene.add(new AmbientLight(0xffffff, 0.35));
  const key = new DirectionalLight(0xffffff, 2.4);
  key.position.set(3, 8, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(lowPower ? 1024 : 2048, lowPower ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 20 });
  key.shadow.radius = 8; key.shadow.bias = -0.0005;
  scene.add(key);

  const camera = new PerspectiveCamera(32, 1, 0.1, 60);
  camera.position.set(0, 2.6, 9.2);
  camera.lookAt(0, 0, 0);

  const object = new Group();
  scene.add(object);

  const ribbon = new Mesh(ribbonGeometry(), new MeshPhysicalMaterial({
    color: '#111214', metalness: 0.55, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.08,
  }));
  ribbon.castShadow = true;
  object.add(ribbon);

  const N = 22;
  const arrows = new InstancedMesh(chevronGeometry(), new MeshStandardMaterial({
    color: SIGNAL, emissive: new Color(SIGNAL), emissiveIntensity: 0.35, roughness: 0.35, metalness: 0.1,
  }), N);
  arrows.castShadow = true;
  object.add(arrows);

  const shadow = new Mesh(new PlaneGeometry(14, 14), new ShadowMaterial({ opacity: 0.14 }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.9;
  shadow.receiveShadow = true;
  scene.add(shadow);

  const c = new Vector3(), tan = new Vector3(), side = new Vector3(), up = new Vector3();
  const m = new Matrix4(), q = new Quaternion(), s = new Vector3(1, 1, 1), x = new Vector3(), back = new Vector3();
  function placeArrows(time) {
    for (let i = 0; i < N; i++) {
      const u = (i / N + time * 0.035) % 1;
      frameAt(u, c, tan, side, up);
      back.copy(tan).negate();                       // chevron points along -z, so -z = direction of travel
      x.crossVectors(up, back).normalize();
      m.makeBasis(x, up, back);
      q.setFromRotationMatrix(m);
      c.addScaledVector(up, H + 0.012);
      m.compose(c, q, s);
      arrows.setMatrixAt(i, m);
    }
    arrows.instanceMatrix.needsUpdate = true;
  }

  let px = 0, py = 0, pxs = 0, pys = 0, leave = 0, visible = true, running = false;
  if (!reduce) {
    window.addEventListener('pointermove', (e) => {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // desktop: the loop sits in the right half, clear of the text; phones: centred above it
    if (w > 900) camera.setViewOffset(w, h, -w * 0.23, -h * 0.08, w, h);
    else camera.clearViewOffset();
    camera.position.set(0, w > 900 ? 2.8 : 3, w > 900 ? 12 : 9.6);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let last = 0;
  function render(time) {
    const dt = Math.min(0.05, Math.max(0, time - last)); last = time;
    pxs += (px - pxs) * (1 - Math.exp(-dt * 3));
    pys += (py - pys) * (1 - Math.exp(-dt * 3));
    leave = MathUtils.clamp(window.scrollY / Math.max(1, hero.offsetHeight), 0, 1);
    object.rotation.set(
      0.32 + pys * 0.18 + leave * 0.35,
      (reduce ? 0 : Math.sin(time * 0.22) * 0.38) + pxs * 0.5 - leave * 0.4,
      (reduce ? 0 : Math.sin(time * 0.17) * 0.04),
    );
    object.position.y = (reduce ? 0 : Math.sin(time * 0.9) * 0.06) + leave * 0.6;
    placeArrows(reduce ? 0.2 : time);
    renderer.render(scene, camera);
  }

  function loop(t) {
    if (!visible || document.hidden) { running = false; return; }
    render(t / 1000);
    requestAnimationFrame(loop);
  }
  function start() { if (!running && !reduce) { running = true; requestAnimationFrame(loop); } }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) start(); }).observe(hero);
  }
  document.addEventListener('visibilitychange', start);

  render(0);
  hero.classList.add('is-live');
  start();
}
