// 3D "flow" scene: a ticket rides a stream of arrows through nine delivery phases.
// Loaded lazily by main.js, which publishes the journey position as window.__journeyF
// (-0.8 while the hero is on screen, then 0..8, one unit per phase).
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, Mesh, PlaneGeometry, Shape, ExtrudeGeometry,
  InstancedMesh, Object3D, CatmullRomCurve3, Vector3, TubeGeometry, ConeGeometry, QuadraticBezierCurve3,
  MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, CanvasTexture, SRGBColorSpace,
  NeutralToneMapping, PMREMGenerator, PCFSoftShadowMap, AmbientLight, DirectionalLight, MathUtils,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const INK = '#0e0f10', GROUND = '#e4e6e8', SIGNAL = '#ff4f12', MUTED = '#4a4f55';
const HUMAN = new Set([2, 7]);
const STAMPS = ['Brainstormed', 'Planned', 'Plan frozen', 'Built', 'Review pass', 'Evidence attached', 'PR open', 'Merged', 'Shipped'];
let reduce = false;

export function initScene(opts) {
  reduce = !!(opts && opts.reduce);
  return document.fonts.load('800 80px Archivo').catch(() => {}).then(() => buildScene());
}

/* The route: one smooth curve on the floor; phase k sits at s = k. Control points run from
   s = -2 to s = 10 so the curve is defined a little beyond both ends. */
const S0 = -2, S1 = 10;
const ctrl = [];
for (let k = S0; k <= S1; k++) ctrl.push(new Vector3(Math.sin(k * 0.9) * 2.4, 0, -k * 5));
const route = new CatmullRomCurve3(ctrl, false, 'centripetal');
const at = (s, v = new Vector3()) => route.getPoint(MathUtils.clamp((s - S0) / (S1 - S0), 0, 1), v);
const tangentAt = (s, v = new Vector3()) => route.getTangent(MathUtils.clamp((s - S0) / (S1 - S0), 0, 1), v);

// A flat chevron pointing "forward" (-z once laid on the floor).
function chevronGeometry(depth) {
  const sh = new Shape();
  sh.moveTo(-0.5, -0.32); sh.lineTo(0, 0.18); sh.lineTo(0.5, -0.32);
  sh.lineTo(0.5, -0.04); sh.lineTo(0, 0.46); sh.lineTo(-0.5, -0.04); sh.closePath();
  const g = new ExtrudeGeometry(sh, { depth, bevelEnabled: false });
  g.rotateX(-Math.PI / 2);
  return g;
}
const yawAt = (s) => { const t = tangentAt(s); return Math.atan2(-t.x, -t.z); };

function buildScene() {
  const lowPower = window.matchMedia('(max-width: 900px)').matches || (navigator.hardwareConcurrency || 8) <= 4;
  const stage = document.getElementById('stage');
  const canvas = document.getElementById('scene');
  if (!stage || !canvas) return;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !lowPower || window.devicePixelRatio < 2, powerPreference: lowPower ? 'low-power' : 'high-performance' });
  } catch (e) { return; }
  // Software WebGL (SwiftShader, llvmpipe) can't draw this smoothly and would block the main
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
  scene.fog = new Fog(GROUND, 16, 46);
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  scene.add(new AmbientLight(0xffffff, 0.55));
  const key = new DirectionalLight(0xffffff, 2.1);
  key.castShadow = true;
  key.shadow.mapSize.set(lowPower ? 1024 : 2048, lowPower ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 34 });
  key.shadow.radius = 6; key.shadow.bias = -0.0004;
  scene.add(key, key.target);

  const camera = new PerspectiveCamera(34, 1, 0.1, 140);

  const floor = new Mesh(new PlaneGeometry(80, 160), new MeshStandardMaterial({ color: '#d9dcdf', roughness: 1 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -40);
  floor.receiveShadow = true;
  scene.add(floor);

  const DONE = new Color('#2a2d31'), AHEAD = new Color('#b4b9bf'), CURRENT = new Color(INK), HOT = new Color(SIGNAL);
  const dummy = new Object3D(), v = new Vector3();

  /* the stream: small chevrons flowing forward along the route */
  const STREAM_N = 110, SPAN = [-1.8, 8.9], GAP = (SPAN[1] - SPAN[0]) / STREAM_N;
  const stream = new InstancedMesh(chevronGeometry(0.05), new MeshStandardMaterial({ roughness: 0.5, metalness: 0.1 }), STREAM_N);
  stream.receiveShadow = true;
  scene.add(stream);

  /* phase markers: a big chevron per phase, doubled for the two human gates */
  const markerGeo = chevronGeometry(0.22);
  const markers = [];
  for (let k = 0; k < 9; k++) {
    const parts = [];
    const copies = HUMAN.has(k) ? 2 : 1;
    for (let c = 0; c < copies; c++) {
      const m = new Mesh(markerGeo, new MeshStandardMaterial({ color: AHEAD.clone(), roughness: 0.35, metalness: 0.2, emissive: new Color(SIGNAL), emissiveIntensity: 0 }));
      m.castShadow = true; m.receiveShadow = true;
      scene.add(m);
      parts.push({ mesh: m, ahead: c * 0.12 });
    }
    markers.push({ k, parts, lift: 0 });
  }

  /* the review U-turn: an orange arrow that curls from Review back to Build */
  const r4 = at(4), r3 = at(3.08), side4 = tangentAt(4).cross(new Vector3(0, 1, 0)).normalize();
  const uCurve = new QuadraticBezierCurve3(
    r4.clone().add(new Vector3(0, 0.12, 0)),
    at(3.55).add(side4.clone().multiplyScalar(4.2)).add(new Vector3(0, 0.12, 0)),
    r3.clone().add(new Vector3(0, 0.12, 0)),
  );
  const uMat = new MeshStandardMaterial({ color: SIGNAL, emissive: new Color(SIGNAL), emissiveIntensity: 0.6, roughness: 0.4 });
  const uTube = new Mesh(new TubeGeometry(uCurve, 64, 0.11, 10, false), uMat);
  const uHead = new Mesh(new ConeGeometry(0.32, 0.7, 18), uMat);
  uTube.castShadow = true; uHead.castShadow = true;
  scene.add(uTube, uHead);
  const uIndexCount = uTube.geometry.index.count;

  /* the ticket */
  const tc = document.createElement('canvas'); tc.width = 1024; tc.height = 650;
  const tx = tc.getContext('2d');
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
    for (let i = 0; i < 9; i++) { tx.fillStyle = i < passed ? INK : '#d8dbde'; tx.fillRect(64 + i * 62, 360, 50, 50); }
    tx.font = '800 64px Archivo, Arial Narrow, sans-serif';
    const w = tx.measureText(stamp).width + 56;
    tx.fillStyle = hot ? SIGNAL : INK; tx.fillRect(64, 470, w, 104);
    tx.fillStyle = hot ? INK : '#ffffff'; tx.fillText(stamp, 92, 492);
    ticketTex.needsUpdate = true;
  }
  const side = new MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  const face = new MeshPhysicalMaterial({ map: ticketTex, emissiveMap: ticketTex, emissive: new Color('#ffffff'), emissiveIntensity: 0.6, roughness: 0.45, clearcoat: 0.5 });
  const ticket = new Mesh(new RoundedBoxGeometry(1.6, 1.02, 0.07, 4, 0.04), [side, side, side, side, face, side]);
  ticket.castShadow = true;
  scene.add(ticket);
  const shell = new Mesh(
    new RoundedBoxGeometry(1.82, 1.24, 0.28, 5, 0.12),
    new MeshPhysicalMaterial({ color: '#ffffff', transmission: 1, roughness: 0.06, thickness: 0.35, ior: 1.35, transparent: true, opacity: 0.95 }),
  );
  scene.add(shell);
  const scan = new Mesh(new PlaneGeometry(2.1, 0.035), new MeshBasicMaterial({ color: SIGNAL }));
  scene.add(scan);

  /* state */
  let f = -0.8, px = 0, py = 0, pxs = 0, pys = 0, visible = true, running = false, narrow = false;
  let detour = -1;            // seconds into the Review kick-back, -1 when idle
  let detourDone = false;
  if (!reduce) {
    window.addEventListener('pointermove', (e) => {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }
  const target = () => (typeof window.__journeyF === 'number' ? window.__journeyF : -0.8);

  function resize() {
    const vp = stage.querySelector('.stage__viewport');
    const w = vp.clientWidth, h = vp.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    narrow = w <= 900;
    if (!narrow) camera.setViewOffset(w, h, -w * 0.2, 0, w, h);
    else camera.setViewOffset(w, h, 0, h * 0.22, w, h);
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const ticketPos = new Vector3(), look = new Vector3(), camPos = new Vector3();
  let lastT = 0, flow = 0;
  function frameAt(time) {
    const dt = Math.min(0.1, Math.max(0, time - lastT)); lastT = time;
    const goal = target();
    const prevF = f;
    f += (goal - f) * (1 - Math.exp(-dt * 4.2));
    const speed = Math.abs(f - prevF) / Math.max(dt, 1e-3);
    pxs += (px - pxs) * (1 - Math.exp(-dt * 3)); pys += (py - pys) * (1 - Math.exp(-dt * 3));

    // Review kick-back: plays once each time the journey settles on Review
    if (Math.abs(f - 4) < 0.08 && !detourDone && detour < 0) detour = 0;
    if (Math.abs(goal - 4) > 0.6) { detour = -1; detourDone = false; }
    if (detour >= 0) { detour += dt; if (detour > 3.2) { detour = -1; detourDone = true; } }
    const d = detour < 0 ? -1 : detour / 3.2;          // 0..1 through the kick-back
    const hot = d >= 0 && d < 0.62;

    // where the ticket is
    if (d >= 0.12 && d < 0.5) {                        // riding the U-turn back to Build
      uCurve.getPoint(MathUtils.smootherstep(d, 0.12, 0.5), ticketPos);
    } else if (d >= 0.5 && d < 0.9) {                  // and forward again to Review
      at(MathUtils.lerp(3.08, 4 - 0.32, MathUtils.smootherstep(d, 0.5, 0.9)), ticketPos);
    } else {
      at(f - 0.32, ticketPos);
    }
    const bob = reduce ? 0 : Math.sin(time * 1.5) * 0.06;
    ticket.position.set(ticketPos.x, 0.95 + bob, ticketPos.z);
    ticket.rotation.set(-0.95 + pys * 0.2, yawAt(Math.max(f, -1)) + 0.25 + pxs * 0.4, Math.sin(time * 0.9) * 0.03);
    shell.position.copy(ticket.position); shell.rotation.copy(ticket.rotation);
    const freeze = MathUtils.smoothstep(f, 1.7, 2.05);
    shell.scale.setScalar(Math.max(0.001, freeze)); shell.visible = freeze > 0.01;

    // QA scan sweeps while the journey rests on QA
    const qa = 1 - MathUtils.smoothstep(Math.abs(f - 5), 0.15, 0.4);
    scan.visible = qa > 0.05;
    if (scan.visible) {
      const sweep = (time * 0.7) % 1;
      scan.position.copy(ticket.position); scan.rotation.copy(ticket.rotation);
      scan.translateY(0.55 - sweep * 1.1); scan.translateZ(0.06);
    }

    // stream: chevrons flow forward, faster while moving between phases
    flow = (flow + dt * (0.35 + Math.min(speed, 6) * 0.9)) % 1;
    for (let i = 0; i < STREAM_N; i++) {
      const s = SPAN[0] + (i + flow) * GAP;
      at(s, v);
      dummy.position.set(v.x, 0.015, v.z);
      dummy.rotation.set(0, yawAt(s), 0);
      const edge = Math.min(1, (s - SPAN[0]) / 0.6, (SPAN[1] - s) / 0.6);
      const nearMarker = Math.abs(s - Math.round(s) - 0.24) < 0.32 ? 0 : 1;   // leave room around big markers
      dummy.scale.setScalar(Math.max(0.0001, 0.55 * edge * nearMarker));
      dummy.updateMatrix();
      stream.setMatrixAt(i, dummy.matrix);
      stream.setColorAt(i, s < f ? DONE : AHEAD);
    }
    stream.instanceMatrix.needsUpdate = true;
    if (stream.instanceColor) stream.instanceColor.needsUpdate = true;

    // markers: done = ink, current = lifted ink, ahead = light; Review glows while hot
    for (const mk of markers) {
      const isCurrent = Math.abs(f - mk.k) < 0.5;
      mk.lift += ((isCurrent ? 1 : 0) - mk.lift) * (1 - Math.exp(-dt * 6));
      for (const part of mk.parts) {
        const s = mk.k + 0.2 + part.ahead;
        at(s, v);
        part.mesh.position.set(v.x, 0.02 + mk.lift * (0.18 + Math.sin(time * 3) * 0.04), v.z);
        part.mesh.rotation.set(0, yawAt(s), 0);
        part.mesh.scale.setScalar(2 + mk.lift * 0.35);
        const c = mk.k === 4 && hot ? HOT : isCurrent ? CURRENT : mk.k < f ? DONE : AHEAD;
        part.mesh.material.color.lerp(c, 1 - Math.exp(-dt * 8));
        part.mesh.material.emissiveIntensity = mk.k === 4 && hot ? 0.6 + Math.sin(time * 12) * 0.25 : 0;
      }
    }

    // U-turn grows in while hot, then fades back out
    const uShow = d < 0 ? 0 : d < 0.12 ? d / 0.12 : d < 0.62 ? 1 : Math.max(0, 1 - (d - 0.62) / 0.2);
    uTube.visible = uHead.visible = uShow > 0.01;
    if (uTube.visible) {
      uTube.geometry.setDrawRange(0, Math.floor(uIndexCount * uShow / 6) * 6);
      uCurve.getPoint(Math.max(0.02, uShow), v); uHead.position.copy(v);
      const tan = uCurve.getTangent(Math.max(0.02, uShow));
      uHead.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), tan);
    }

    // ticket face
    const k = Math.round(MathUtils.clamp(f, 0, 8));
    let stamp = f < -0.3 ? 'New' : STAMPS[k];
    if (hot) stamp = 'Concerns';
    else if (k === 4 && !detourDone && d < 0) stamp = 'In review';
    drawTicket(stamp, f < -0.3 ? 0 : Math.min(9, Math.floor(f + 0.5) + 1), hot);

    // camera: high three-quarter view that follows the ticket, so the arrows read from above
    const near = MathUtils.clamp(-f / 0.8, 0, 1);      // a little closer while the hero is on screen
    const inDetour = d >= 0 ? Math.sin(Math.PI * Math.min(1, d)) : 0;
    at(Math.max(f, -1.4) - (narrow ? 2.1 : 1.6), camPos);
    const lateral = (narrow ? 0.7 : 3.4) - near * (narrow ? 0 : 0.8) + inDetour * 1.6;
    const height = (narrow ? 10.5 : 7.6) - near * 1.6 + inDetour * 2.2;
    camera.position.set(camPos.x + lateral + pxs * 1.1, height - pys * 0.6, camPos.z + 2);
    at(Math.max(f, -1.4) + (narrow ? 0.1 : 0.7), look);
    look.lerp(ticket.position, narrow ? 0.75 : 0.35 + inDetour * 0.5);
    camera.lookAt(look.x, 0.4, look.z);

    key.position.set(ticket.position.x + 5, 11, ticket.position.z + 5);
    key.target.position.copy(ticket.position);
    renderer.render(scene, camera);
    return speed > 0.01 || Math.abs(goal - f) > 0.001 || detour >= 0;
  }

  // Render every frame while anything moves; otherwise ~24 fps for the idle stream and float.
  let lastDraw = 0, moving = true;
  function loop(t) {
    if (!visible || document.hidden) { running = false; return; }
    if (moving || Math.abs(px - pxs) > 0.002 || t - lastDraw > 42) { moving = frameAt(t / 1000); lastDraw = t; }
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
