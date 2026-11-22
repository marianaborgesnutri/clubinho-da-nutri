// Sala 3D do Clubinho da Nutri (three.js)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const CORES = {
  salvia: 0x93AE9A, rose: 0xE3B8AC, lilas: 0xB9A9DC, ceu: 0xA6C8E0, menta: 0xA3DAC2, pessego: 0xF0C3A2,
  manteiga: 0xEFDB92, prata: 0xD5DAD7, coral: 0xEEA79B, musgo: 0x7D9585
};
const CABELO = {
  preto: 0x1E1A19, castanho_escuro: 0x3B2A22, castanho: 0x6A4632, castanho_claro: 0x9A6E4C,
  loiro: 0xD8B56A, loiro_claro: 0xEAD39A, ruivo: 0xA8482C, grisalho: 0xB9B4AE, rosa: 0xE59AB0
};
const TILE = 5.2;
const POS_HAB = { alimentacao: [-0.95, 0.95], agua: [0.95, 0.95], exercicio: [-0.95, -0.95], fruta: [0.95, -0.95] };

const matCache = new Map();
function mat(cor, o = {}) {
  const k = cor + JSON.stringify(o);
  if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial(Object.assign({ color: cor, roughness: .55, metalness: .08 }, o)));
  return matCache.get(k);
}
const geo = {
  head: new RoundedBoxGeometry(1.15, .92, .92, 4, .26),
  body: new RoundedBoxGeometry(.9, .78, .62, 4, .22),
  visor: new RoundedBoxGeometry(.86, .5, .1, 3, .12),
  eye: new THREE.SphereGeometry(.085, 16, 12),
  limb: new THREE.CapsuleGeometry(.11, .42, 4, 10),
  leg: new THREE.CapsuleGeometry(.13, .3, 4, 10),
  foot: new RoundedBoxGeometry(.26, .12, .34, 2, .05),
  ear: new THREE.CylinderGeometry(.12, .12, .1, 16),
  ball: new THREE.SphereGeometry(1, 18, 14),
  heart: new RoundedBoxGeometry(.24, .2, .06, 2, .05),
  skirt: new THREE.CylinderGeometry(.42, .58, .26, 20, 1, true),
  rug: new THREE.CircleGeometry(1.45, 40),
  plate: new THREE.CylinderGeometry(.34, .26, .07, 24),
  bottle: new THREE.CylinderGeometry(.12, .12, .5, 16),
  cap: new THREE.CylinderGeometry(.08, .08, .08, 12),
  bar: new THREE.CylinderGeometry(.035, .035, .56, 8),
  plateW: new THREE.CylinderGeometry(.13, .13, .08, 14),
  box: new THREE.BoxGeometry(1, 1, 1),
  rbox: new RoundedBoxGeometry(1, 1, 1, 3, .18),
  torus: new THREE.TorusGeometry(.13, .025, 8, 20),
  band: new THREE.TorusGeometry(.6, .06, 8, 32)
};

function texCanvas(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const halo = texCanvas(128, 128, (g, w) => {
  const r = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,226,160,.95)'); r.addColorStop(.45, 'rgba(240,200,170,.45)'); r.addColorStop(1, 'rgba(240,200,170,0)');
  g.fillStyle = r; g.fillRect(0, 0, w, w);
});
const sombra = texCanvas(64, 64, (g) => {
  const r = g.createRadialGradient(32, 32, 2, 32, 32, 32); r.addColorStop(0, 'rgba(0,0,0,.35)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64);
});
function textoSprite(txt, cor = '#8DA394', px = 64) {
  const t = texCanvas(px, px, (g) => { g.font = `900 ${px * .78}px Montserrat, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = px * .14; g.strokeStyle = '#ffffff'; g.strokeText(txt, px / 2, px / 2 + 2); g.fillStyle = cor; g.fillText(txt, px / 2, px / 2 + 2); });
  return new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
}

// ---------- itens ----------
function item(k) {
  const g = new THREE.Group();
  if (k === 'alimentacao') {
    g.add(new THREE.Mesh(geo.plate, mat(0xffffff)));
    const fo = new THREE.Mesh(geo.ball, mat(0x7FB069)); fo.scale.set(.13, .08, .13); fo.position.set(-.08, .07, 0); g.add(fo);
    const ce = new THREE.Mesh(geo.ball, mat(0xE6A15A)); ce.scale.set(.1, .07, .1); ce.position.set(.1, .07, .06); g.add(ce);
    const ar = new THREE.Mesh(geo.ball, mat(0xF4EEE2)); ar.scale.set(.11, .06, .11); ar.position.set(.04, .07, -.12); g.add(ar);
  }
  if (k === 'agua') {
    const b = new THREE.Mesh(geo.bottle, mat(0x8FC7E8, { transparent: true, opacity: .75, roughness: .1 })); b.position.y = .25; g.add(b);
    const c = new THREE.Mesh(geo.cap, mat(0x55675B)); c.position.y = .54; g.add(c);
  }
  if (k === 'exercicio') {
    const bar = new THREE.Mesh(geo.bar, mat(0x6B6B6B, { metalness: .6 })); bar.rotation.z = Math.PI / 2; bar.position.y = .13; g.add(bar);
    [-.24, .24].forEach(x => { const p = new THREE.Mesh(geo.plateW, mat(0x3F4D44)); p.rotation.z = Math.PI / 2; p.position.set(x, .13, 0); g.add(p); });
  }
  if (k === 'fruta') {
    const a = new THREE.Mesh(geo.ball, mat(0xD9443A, { roughness: .35 })); a.scale.setScalar(.16); a.position.y = .16; g.add(a);
    const f = new THREE.Mesh(geo.ball, mat(0x6FA35A)); f.scale.set(.07, .02, .04); f.position.set(.05, .33, 0); f.rotation.z = .5; g.add(f);
  }
  return g;
}
function prop(k) { // objeto que o robô segura
  const g = item(k);
  if (k === 'alimentacao') g.scale.setScalar(.55);
  if (k === 'agua') g.scale.setScalar(.6);
  if (k === 'fruta') g.scale.setScalar(.8);
  if (k === 'exercicio') g.scale.setScalar(.55);
  return g;
}

// ---------- robô ----------
function robo(r) {
  r = r || {};
  const cor = CORES[r.cor] || CORES.salvia;
  const corEsc = new THREE.Color(cor).multiplyScalar(.78).getHex();
  const hc = CABELO[r.corCabelo] || CABELO.castanho_escuro;
  const st = r.cabelo || 'liso';
  const R = new THREE.Group(); const rig = new THREE.Group(); R.add(rig);
  const parts = {};
  const mCorpo = mat(cor), mEsc = mat(corEsc), mHair = mat(hc, { roughness: .8 });

  // pernas
  [-.2, .2].forEach((x, i) => {
    const leg = new THREE.Group(); leg.position.set(x, .45, 0);
    const l = new THREE.Mesh(geo.leg, mEsc); l.position.y = -.2; leg.add(l);
    const f = new THREE.Mesh(geo.foot, mat(0x3F4D44)); f.position.set(0, -.42, .05); leg.add(f);
    rig.add(leg); parts[i ? 'legR' : 'legL'] = leg;
  });
  const body = new THREE.Mesh(geo.body, mCorpo); body.position.y = .82; rig.add(body); parts.body = body;
  const heart = new THREE.Mesh(geo.heart, mat(0xE7A1A9, { emissive: 0xE7A1A9, emissiveIntensity: .25 })); heart.position.set(0, .86, .32); rig.add(heart);
  if (r.genero !== 'm') { const sk = new THREE.Mesh(geo.skirt, mat(corEsc, { side: THREE.DoubleSide })); sk.position.y = .5; rig.add(sk); }
  // braços
  [-1, 1].forEach(s => {
    const arm = new THREE.Group(); arm.position.set(.56 * s, 1.08, 0);
    const a = new THREE.Mesh(geo.limb, mEsc); a.position.y = -.28; arm.add(a);
    const h = new THREE.Mesh(geo.ball, mCorpo); h.scale.setScalar(.14); h.position.y = -.56; arm.add(h);
    const hold = new THREE.Group(); hold.position.set(0, -.62, .08); arm.add(hold);
    rig.add(arm); parts[s > 0 ? 'armR' : 'armL'] = arm; parts[s > 0 ? 'holdR' : 'holdL'] = hold;
  });
  // cabeça
  const head = new THREE.Group(); head.position.y = 1.62; rig.add(head); parts.head = head;
  head.add(new THREE.Mesh(geo.head, mCorpo));
  [-1, 1].forEach(s => { const e = new THREE.Mesh(geo.ear, mEsc); e.rotation.z = Math.PI / 2; e.position.set(.6 * s, 0, 0); head.add(e); });
  const visor = new THREE.Mesh(geo.visor, mat(0x1F2A24, { roughness: .25 })); visor.position.set(0, -.02, .43); head.add(visor);
  const mEye = mat(0xB8F5D8, { emissive: 0x7FE8B8, emissiveIntensity: .9 });
  parts.eyes = [-1, 1].map(s => { const e = new THREE.Mesh(geo.eye, mEye); e.position.set(.17 * s, .02, .49); e.scale.set(1, 1.25, .6); head.add(e); return e; });
  [-1, 1].forEach(s => { const c = new THREE.Mesh(geo.ball, mat(0xF2A7B0)); c.scale.set(.06, .04, .02); c.position.set(.36 * s, -.2, .47); head.add(c); });
  const ant = new THREE.Mesh(geo.ball, mat(0xD7B5AB, { emissive: 0xD7B5AB, emissiveIntensity: .6 })); ant.scale.setScalar(.09);
  const ax = st === 'coque' ? -.3 : 0;
  const stick = new THREE.Mesh(geo.bar, mEsc); stick.scale.set(1, .45, 1); stick.position.set(ax, .58, 0); head.add(stick);
  ant.position.set(ax, .74, 0); head.add(ant); parts.ant = ant;

  // cabelo
  const add = (g, x, y, z, sx, sy, sz, m = mHair) => { const k = new THREE.Mesh(g, m); k.position.set(x, y, z); k.scale.set(sx, sy, sz); head.add(k); return k; };
  if (st !== 'cacheado') add(geo.rbox, 0, .4, -.04, 1.2, .22, .98); // topo
  if (st !== 'curto' && st !== 'cacheado') add(geo.rbox, -.18, .28, .44, .7, .14, .08); // franja
  if (st === 'curto') { add(geo.rbox, 0, .38, .06, 1.16, .2, .86); }
  if (st === 'liso') { add(geo.rbox, 0, -.25, -.42, 1.24, 1.25, .2); [-1, 1].forEach(s => add(geo.rbox, .6 * s, -.25, -.05, .1, 1.05, .6)); }
  if (st === 'ondulado') { add(geo.rbox, 0, -.2, -.42, 1.28, 1.15, .22); [-1, 1].forEach(s => { add(geo.ball, .62 * s, -.62, -.1, .14, .2, .3); add(geo.rbox, .62 * s, -.12, -.08, .1, .85, .55); }); }
  if (st === 'chanel') { add(geo.rbox, 0, 0, -.42, 1.24, .8, .2); [-1, 1].forEach(s => add(geo.rbox, .6 * s, -.02, -.05, .1, .62, .6)); }
  if (st === 'cacheado') {
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; add(geo.ball, Math.cos(a) * .62, .2 + Math.sin(a) * .45, -.15, .2, .2, .2); }
    for (let i = 0; i < 6; i++) add(geo.ball, -.45 + i * .18, .5, .05, .17, .17, .17);
  }
  if (st === 'coque') { add(geo.ball, 0, .66, -.12, .24, .22, .24); add(geo.rbox, 0, -.02, -.42, 1.2, .55, .18); }
  if (st === 'rabo') { const rb = add(geo.limb, 0, -.25, -.62, 1.3, 1.4, 1.3); rb.rotation.x = .35; add(geo.ball, 0, .25, -.5, .14, .14, .14); }

  // acessórios
  const ac = r.acessorio || 'nenhum';
  if (ac === 'oculos') { [-1, 1].forEach(s => { const t = new THREE.Mesh(geo.torus, mat(0x2B2B2B)); t.position.set(.17 * s, .02, .52); head.add(t); }); }
  if (ac === 'laco') { [-1, 1].forEach(s => { const b = add(geo.ball, .38 + .12 * s, .52, .18, .13, .09, .05, mat(0xE58FA3)); b.rotation.z = .4 * s; }); add(geo.ball, .38, .52, .2, .05, .05, .05, mat(0xD06A82)); }
  if (ac === 'flor') { for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; add(geo.ball, -.4 + Math.cos(a) * .08, .5 + Math.sin(a) * .08, .2, .06, .06, .04, mat(0xF4B6C2)); } add(geo.ball, -.4, .5, .22, .045, .045, .04, mat(0xF3D27A)); }
  if (ac === 'bone') { add(geo.rbox, 0, .52, 0, 1.2, .22, 1.0, mat(0x55675B)); add(geo.rbox, 0, .44, .62, .9, .05, .4, mat(0x3F4D44)); }
  if (ac === 'brinco') { [-1, 1].forEach(s => add(geo.ball, .66 * s, -.2, .05, .05, .05, .05, mat(0xE9C46A, { metalness: .7, roughness: .3 }))); }
  // faixa de aquecimento
  const band = new THREE.Mesh(geo.band, mat(0xD7B5AB)); band.rotation.x = Math.PI / 2; band.scale.set(1, 1.05, 1); band.position.y = .3; band.visible = false; head.add(band); parts.band = band;

  // sombra
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), new THREE.MeshBasicMaterial({ map: sombra, transparent: true, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.y = .02; R.add(sh);
  R.userData.parts = parts; R.userData.rig = rig;
  R.scale.setScalar(1.2);
  return R;
}

// ---------- robô da Mari (anfitriã) ----------
function estrela(r1, r2, n = 5) {
  const sh = new THREE.Shape();
  for (let i = 0; i <= n * 2; i++) { const a = i / (n * 2) * Math.PI * 2 + Math.PI / 2, r = i % 2 ? r2 : r1; const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? sh.lineTo(x, y) : sh.moveTo(x, y); }
  const g = new THREE.ExtrudeGeometry(sh, { depth: .05, bevelEnabled: true, bevelThickness: .02, bevelSize: .02, bevelSegments: 2 }); g.center(); return g;
}
function roboMari() {
  const R = robo({ cor: 'rose', cabelo: 'ondulado', corCabelo: 'castanho_escuro', acessorio: 'brinco' });
  const P = R.userData.parts, rig = R.userData.rig, head = P.head;
  const ouro = mat(0xE2B65A, { metalness: .75, roughness: .25, emissive: 0x6B4A12, emissiveIntensity: .25 });
  const verde = mat(0x55675B), salvia = mat(0x8DA394);
  // cabelo mais volumoso e comprido
  [[-.66, -.55], [.66, -.55], [-.6, -.9], [.6, -.9], [0, -.85]].forEach(([x, y]) => { const c = new THREE.Mesh(geo.ball, mat(0x3B2A22, { roughness: .8 })); c.scale.set(.2, .26, .24); c.position.set(x, y, x ? -.12 : -.42); head.add(c); });
  // tiara dourada com pedrinhas
  const tiara = new THREE.Mesh(new THREE.TorusGeometry(.5, .035, 8, 32, Math.PI), ouro); tiara.position.set(0, .48, .05); tiara.rotation.x = -.35; head.add(tiara);
  [-.3, 0, .3].forEach((x, i) => { const g = new THREE.Mesh(geo.ball, mat(i === 1 ? 0x8DA394 : 0xF4B6C2, { roughness: .2, emissive: i === 1 ? 0x55675B : 0xE58FA3, emissiveIntensity: .3 })); g.scale.setScalar(i === 1 ? .09 : .06); g.position.set(x, .5 + (i === 1 ? .2 : .14), .12); head.add(g); });
  // flor no cabelo
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const f = new THREE.Mesh(geo.ball, mat(0xF4B6C2)); f.scale.set(.08, .08, .04); f.position.set(.46 + Math.cos(a) * .1, .3 + Math.sin(a) * .1, .3); head.add(f); }
  const mio = new THREE.Mesh(geo.ball, ouro); mio.scale.setScalar(.055); mio.position.set(.46, .3, .33); head.add(mio);
  // antena vira estrela dourada
  P.ant.visible = false;
  const est = new THREE.Mesh(estrela(.2, .09), mat(0xF0C35A, { metalness: .5, roughness: .3, emissive: 0xF0C35A, emissiveIntensity: .5 })); est.position.set(0, .8, 0); head.add(est); P.estrela = est;
  // faixa transversal verde com borda dourada
  const faixa = new THREE.Group(); faixa.position.set(0, .85, 0); faixa.rotation.z = -.62; rig.add(faixa);
  const fx = new THREE.Mesh(new THREE.BoxGeometry(.2, 1.1, .7), salvia); faixa.add(fx);
  const fxb = new THREE.Mesh(new THREE.BoxGeometry(.24, 1.1, .66), ouro); fxb.scale.set(1, .98, .98); faixa.add(fxb); fx.scale.z = 1.04;
  // broche dourado no lugar do coração
  rig.children.forEach(o => { if (o.geometry === geo.heart) o.material = ouro; });
  // saia em camadas
  const saia = new THREE.Mesh(new THREE.CylinderGeometry(.4, .66, .26, 24, 1, true), mat(0x55675B, { side: THREE.DoubleSide })); saia.position.y = .44; rig.add(saia);
  const babado = new THREE.Mesh(new THREE.TorusGeometry(.64, .04, 8, 32), ouro); babado.rotation.x = Math.PI / 2; babado.position.y = .32; rig.add(babado);
  // mãozinhas douradas
  [P.armL, P.armR].forEach(a => a.children.forEach(o => { if (o.geometry === geo.ball) o.material = salvia; }));
  return R;
}
function palco() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.85, .22, 48), mat(0xD7B5AB)); base.position.y = .11; g.add(base);
  const topo = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, .04, 48), mat(0xF3E3DC)); topo.position.y = .24; g.add(topo);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(1.72, .05, 8, 64), mat(0xE2B65A, { metalness: .7, roughness: .3 })); aro.rotation.x = Math.PI / 2; aro.position.y = .22; g.add(aro);
  const hs = new THREE.Sprite(new THREE.SpriteMaterial({ map: halo, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .55 }));
  hs.scale.setScalar(4.2); hs.position.y = 1.6; g.add(hs);
  return g;
}

// ---------- cena ----------
const S = { ok: false };
function iniciar(container) {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  r.outputColorSpace = THREE.SRGBColorSpace;
  container.append(r.domElement);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(34, 1, .1, 400);
  scene.add(new THREE.HemisphereLight(0xFFF8F0, 0xB59A86, 1.25));
  const dl = new THREE.DirectionalLight(0xffffff, 1.6); dl.position.set(8, 18, 10); scene.add(dl);
  const fill = new THREE.DirectionalLight(0xFFE4D6, .5); fill.position.set(-10, 6, -4); scene.add(fill);
  const ctl = new OrbitControls(cam, r.domElement);
  ctl.enableDamping = true; ctl.dampingFactor = .08; ctl.enablePan = false;
  ctl.minPolarAngle = .35; ctl.maxPolarAngle = 1.15; ctl.minAzimuthAngle = -.4; ctl.maxAzimuthAngle = 1.2;
  const labels = document.createElement('div'); labels.className = 's3-labels'; container.append(labels);
  Object.assign(S, { ok: true, r, scene, cam, ctl, container, labels, room: null, bots: [], clock: new THREE.Clock(), focus: null });
  const ro = new ResizeObserver(() => redimensionar()); ro.observe(container);
  r.domElement.addEventListener('pointerdown', e => { S.down = [e.clientX, e.clientY]; });
  r.domElement.addEventListener('pointerup', e => { if (S.down && Math.hypot(e.clientX - S.down[0], e.clientY - S.down[1]) < 6) tocar(e); });
  r.setAnimationLoop(loop);
}

function calendario() {
  const C = window.CLUBE || {};
  const hoje = C.hojeSP ? C.hojeSP() : new Date().toISOString().slice(0, 10);
  const [y, m, d] = hoje.split('-').map(Number);
  const MESES = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  const SEM = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const total = C.dias ? C.dias().length : 21;
  const n = C.numDia ? C.numDia(hoje) : 1;
  return texCanvas(512, 640, (g, w, h) => {
    g.fillStyle = 'rgba(0,0,0,.12)'; g.beginPath(); g.roundRect(14, 22, w - 20, h - 26, 36); g.fill();
    g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(6, 12, w - 20, h - 26, 36); g.fill();
    g.fillStyle = '#D7B5AB'; g.beginPath(); g.roundRect(6, 12, w - 20, 108, [36, 36, 0, 0]); g.fill();
    g.fillStyle = '#55675B'; [130, w - 154].forEach(x => { g.beginPath(); g.roundRect(x, 0, 18, 44, 9); g.fill(); });
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#fff'; g.font = '800 44px Montserrat, sans-serif'; g.fillText(MESES[m - 1] + ' ' + y, w / 2 - 7, 76);
    g.fillStyle = '#3F4D44'; g.font = '900 190px Montserrat, sans-serif'; g.fillText(String(d), w / 2 - 7, 232);
    g.fillStyle = '#8A8F8B'; g.font = '700 38px Montserrat, sans-serif'; g.fillText(SEM[wd], w / 2 - 7, 344);
    // 21 bolinhas: dias que já foram, hoje e os que faltam
    const r = 13, gap = 46, x0 = w / 2 - 7 - gap * 3;
    for (let i = 0; i < total; i++) {
      const cx = x0 + (i % 7) * gap, cy = 400 + Math.floor(i / 7) * 40;
      g.beginPath(); g.arc(cx, cy, i + 1 === n ? r + 4 : r, 0, Math.PI * 2);
      g.fillStyle = i + 1 < n ? '#8DA394' : i + 1 === n ? '#D7B5AB' : '#ECE6E1'; g.fill();
      if (i + 1 === n) { g.lineWidth = 4; g.strokeStyle = '#55675B'; g.stroke(); }
    }
    let txt;
    if (n < 1) { const f = 1 - n; txt = f === 1 ? 'Começa amanhã!' : 'Faltam ' + f + ' dias'; }
    else if (n > total) txt = 'Desafio concluído!';
    else txt = 'Dia ' + n + ' de ' + total;
    g.fillStyle = '#55675B'; g.beginPath(); g.roundRect(56, 528, w - 132, 74, 37); g.fill();
    g.fillStyle = '#fff'; g.font = '800 40px Montserrat, sans-serif'; g.fillText(txt, w / 2 - 7, 566);
  });
}

function montarSala(cols, rows) {
  if (S.room) S.scene.remove(S.room);
  const room = new THREE.Group(); S.room = room;
  const W = cols * TILE + 1.6, D = rows * TILE + 1.6;
  // piso de madeira
  const tex = texCanvas(512, 512, (g, w, h) => {
    const cores = ['#C9A27E', '#C49A75', '#CFA985', '#BF956F'];
    for (let i = 0; i < 8; i++) { g.fillStyle = cores[i % 4]; g.fillRect(0, i * 64, w, 64); g.fillStyle = 'rgba(90,60,40,.25)'; g.fillRect(0, i * 64 + 62, w, 2); g.fillRect(((i * 197) % w), i * 64, 2, 64); }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(W / 6, D / 6);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: tex, roughness: .8 }));
  floor.rotation.x = -Math.PI / 2; room.add(floor);
  const base = new THREE.Mesh(new THREE.BoxGeometry(W, .4, D), mat(0x8A6A52)); base.position.y = -.21; room.add(base);
  // paredes
  const wallM = new THREE.MeshStandardMaterial({ color: 0xE9E1DA, roughness: .9 });
  const back = new THREE.Mesh(new THREE.BoxGeometry(W, 4.2, .25), wallM); back.position.set(0, 2.1, -D / 2 - .12); room.add(back);
  const left = new THREE.Mesh(new THREE.BoxGeometry(.25, 4.2, D), wallM); left.position.set(-W / 2 - .12, 2.1, 0); room.add(left);
  const rodape = new THREE.Mesh(new THREE.BoxGeometry(W, .35, .3), mat(0xB98E82)); rodape.position.set(0, .17, -D / 2 - .05); room.add(rodape);
  // placa
  const placa = texCanvas(1024, 220, (g, w, h) => {
    g.fillStyle = '#55675B'; g.beginPath(); g.roundRect(0, 0, w, h, 40); g.fill();
    g.fillStyle = '#fff'; g.font = '800 92px Montserrat, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CLUBINHO DA NUTRI', w / 2, h / 2 - 18);
    g.fillStyle = '#D7B5AB'; g.font = '700 46px Montserrat, sans-serif'; g.fillText('Desafio 21 dias', w / 2, h / 2 + 58);
  });
  const pw = Math.min(W * .6, 9);
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(pw, pw * 220 / 1024), new THREE.MeshBasicMaterial({ map: placa, transparent: true }));
  pl.position.set(0, 2.7, -D / 2 + .02); room.add(pl);
  // calendário na parede: dia de hoje e em que dia do desafio estamos
  { const cal = calendario(); const cw = 2.6, ch = cw * 640 / 512;
    const cm = new THREE.Mesh(new THREE.PlaneGeometry(cw, ch), new THREE.MeshBasicMaterial({ map: cal, transparent: true }));
    cm.position.set(-Math.min(pw / 2 + cw / 2 + .4, W / 2 - cw / 2 - .3), 2.15, -D / 2 + .03); room.add(cm); }
  // luzinhas
  S.luzes = [];
  const cores = [0xE3C27A, 0xE58FA3, 0x9FE3C2];
  for (let x = -W / 2 + .4, i = 0; x < W / 2; x += .7, i++) {
    const m = new THREE.MeshStandardMaterial({ color: cores[i % 3], emissive: cores[i % 3], emissiveIntensity: 1 });
    const b = new THREE.Mesh(geo.ball, m); b.scale.setScalar(.09); b.position.set(x, 3.95 - Math.abs(Math.sin(i * .9)) * .25, -D / 2 + .05); room.add(b); S.luzes.push(m);
  }
  // relógio e quadrinho
  const rel = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, .08, 32), mat(0xffffff)); rel.rotation.x = Math.PI / 2; rel.position.set(W / 2 - 1.4, 2.8, -D / 2 + .05); room.add(rel);
  const plant = new THREE.Group(); plant.position.set(-W / 2 + .7, 0, -D / 2 + .7);
  const vaso = new THREE.Mesh(new THREE.CylinderGeometry(.3, .24, .5, 16), mat(0xB98E82)); vaso.position.y = .25; plant.add(vaso);
  for (let i = 0; i < 7; i++) { const f = new THREE.Mesh(geo.ball, mat(0x6F9A73)); f.scale.set(.18, .45, .08); f.position.set(Math.cos(i) * .12, .8, Math.sin(i) * .12); f.rotation.set(Math.sin(i) * .5, i, Math.cos(i) * .5); plant.add(f); }
  room.add(plant);
  S.scene.add(room);
  S.W = W; S.D = D;
}

function colunas() {
  const w = S.container.clientWidth, h = S.container.clientHeight || 1;
  const n = S.dados ? S.dados.length : 30;
  const a = w / h;
  let c = a < .6 ? 3 : a < .85 ? 4 : a < 1.25 ? 6 : a < 1.7 ? 7 : 8;
  return Math.min(c, Math.max(2, Math.ceil(Math.sqrt(n * a))));
}

function enquadrar() {
  const { cam, ctl } = S;
  ctl.target.set(0, .6, .3);
  const asp = S.container.clientWidth / Math.max(1, S.container.clientHeight);
  const dir = (asp < .85 ? new THREE.Vector3(.1, 1.75, 1) : new THREE.Vector3(.28, 1.2, 1)).normalize();
  const cantos = [];
  for (const x of [-S.W / 2, S.W / 2]) for (const z of [-S.D / 2, S.D / 2]) for (const y of [0, 1.8]) cantos.push(new THREE.Vector3(x * .96, y, z * .96));
  let lo = 4, hi = 300;
  for (let k = 0; k < 30; k++) {
    const mid = (lo + hi) / 2;
    cam.position.copy(ctl.target).addScaledVector(dir, mid); cam.lookAt(ctl.target); cam.updateMatrixWorld();
    const ok = cantos.every(c => { const v = c.clone().project(cam); return Math.abs(v.x) < .98 && Math.abs(v.y) < .9; });
    if (ok) hi = mid; else lo = mid;
  }
  cam.position.copy(ctl.target).addScaledVector(dir, hi); cam.lookAt(ctl.target); cam.updateMatrixWorld();
  // centraliza a sala na tela
  let mnx = 9, mxx = -9, mny = 9, mxy = -9;
  cantos.forEach(c => { const v = c.clone().project(cam); mnx = Math.min(mnx, v.x); mxx = Math.max(mxx, v.x); mny = Math.min(mny, v.y); mxy = Math.max(mxy, v.y); });
  const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * hi, halfW = halfH * cam.aspect;
  const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
  const shift = right.multiplyScalar((mnx + mxx) / 2 * halfW).add(up.multiplyScalar((mny + mxy) / 2 * halfH));
  ctl.target.add(shift); cam.position.add(shift);
  ctl.minDistance = 4; ctl.maxDistance = hi * 1.3;
  ctl.update();
  S.home = { pos: cam.position.clone(), target: ctl.target.clone() };
  S.distHome = hi;
}

function redimensionar() {
  const w = S.container.clientWidth, h = S.container.clientHeight;
  if (!w || !h) return;
  S.r.setSize(w, h); S.cam.aspect = w / h; S.cam.updateProjectionMatrix();
  const c = colunas();
  if (!S.dados) return;
  if (c !== S.cols) { S.cols = c; posicionar(); } else if (!S.anim) enquadrar();
}

function posicionar() {
  const n = S.dados.length; const cols = S.cols; const rows = n ? Math.ceil(n / cols) : 0;
  const rt = rows + 1; // +1 fileira na frente para o palco da Mari
  montarSala(cols, rt);
  S.bots.forEach((b, i) => {
    let cx = (i % cols - (cols - 1) / 2) * TILE, cz = (Math.floor(i / cols) - (rt - 1) / 2) * TILE;
    if (b.mari) { cx = 0; cz = (rows - (rt - 1) / 2) * TILE; }
    b.base.set(cx, 0, cz); b.g.position.set(cx, 0, cz); b.cur.set(0, 0); b.alvo.set(0, 0);
    b.tile.position.set(cx, .015, cz);
  });
  enquadrar();
}

const ACAO_VERBO = { alimentacao: 'comendo bem', exercicio: 'treinando', agua: 'bebendo água', fruta: 'comendo fruta' };
const ACAO_IC = { alimentacao: '🥗', exercicio: '🏋️‍♀️', agua: '💧', fruta: '🍎' };

function limparBots() {
  S.bots.forEach(b => { S.scene.remove(b.g); S.scene.remove(b.tile); b.label.remove(); });
  S.bots = [];
}

function atualizar(sala, aquecendo) {
  if (!S.ok) return;
  S.dados = sala; limparBots();
  // quem dormiu vai para o fundo da sala; quem fez mais fica na frente
  const ord = sala.map(s => ({ s, n: (s.hab || []).filter(h => POS_HAB[h]).length }));
  if (!aquecendo) ord.sort((a, b) => a.n - b.n);
  ord.forEach(({ s }, i) => {
    const habs = (s.hab || []).filter(h => POS_HAB[h]);
    const estado = aquecendo ? 'aquecendo' : habs.length ? 'ativo' : 'dormindo';
    const R = robo(s.robo);
    const g = new THREE.Group(); g.add(R); S.scene.add(g);
    const tile = new THREE.Group();
    const rug = new THREE.Mesh(geo.rug, new THREE.MeshStandardMaterial({ color: estado === 'dormindo' ? 0xCDBFB6 : 0xECDFD9, roughness: 1, transparent: true, opacity: .55 }));
    rug.rotation.x = -Math.PI / 2; tile.add(rug);
    const its = {};
    habs.forEach(h => { const it = item(h); it.position.set(POS_HAB[h][0], .02, POS_HAB[h][1]); tile.add(it); its[h] = it; });
    if (habs.length) {
      const hs = new THREE.Sprite(new THREE.SpriteMaterial({ map: halo, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .25 + habs.length * .17 }));
      hs.scale.setScalar(1.6 + habs.length * .5); hs.position.y = 1.2; tile.add(hs);
    }
    const extra = [];
    if (estado === 'dormindo') { for (let k = 0; k < 4; k++) { const z = textoSprite('Z', '#55675B', 128); z.scale.setScalar(.5); g.add(z); extra.push(z); } }
    if (habs.length === 4) { for (let k = 0; k < 3; k++) { const z = textoSprite('✦', '#F0C35A'); z.scale.setScalar(.4); g.add(z); extra.push(z); } }
    S.scene.add(tile);
    const P = R.userData.parts;
    if (estado === 'aquecendo') P.band.visible = true;
    if (estado === 'dormindo') { const rg = R.userData.rig; rg.rotation.x = -Math.PI / 2; rg.position.set(0, .34, -.8); R.rotation.y = (Math.random() - .5) * 1.2; P.armL.rotation.z = -.5; P.armR.rotation.z = .5; P.eyes.forEach(e => e.scale.set(1.3, .18, .6)); R.traverse(o => { if (o.isMesh && o.material && o.material.color && !o.material.map) { o.material = o.material.clone(); o.material.color.lerp(new THREE.Color(0x9AA39D), .35); } }); }
    if (habs.length === 4) R.traverse(o => { if (o === P.body.parent) return; });
    const label = document.createElement('div'); label.className = 's3-nome' + (estado === 'dormindo' ? ' dorm' : '');
    label.innerHTML = '<b></b><span></span>'; const pt = s.nome.trim().split(/\s+/); const curto = pt[0]; label.querySelector('b').textContent = curto; label.dataset.curto = curto; label.dataset.full = s.nome;
    S.labels.append(label);
    S.bots.push({ g, R, P, tile, label, estado, habs, its, extra, nome: s.nome, base: new THREE.Vector3(), cur: new THREE.Vector2(), alvo: new THREE.Vector2(),
      fase: Math.random() * 6, idx: Math.floor(Math.random() * Math.max(1, habs.length)), t: Math.random() * 2, modo: 'acao', propAtual: null });
  });
  // robô da Mari, sempre na sala, no palco da frente
  {
    const R = roboMari(); const g = new THREE.Group(); const lift = new THREE.Group(); lift.position.y = .26; lift.add(R); g.add(lift); S.scene.add(g);
    const tile = palco(); S.scene.add(tile);
    const habsM = ['alimentacao', 'exercicio', 'agua', 'fruta'], itsM = {};
    habsM.forEach(h => { const it = item(h); it.position.set(POS_HAB[h][0], .26, POS_HAB[h][1]); tile.add(it); itsM[h] = it; });
    const extra = []; for (let k = 0; k < 4; k++) { const z = textoSprite('✦', k % 2 ? '#E2B65A' : '#D7B5AB', 96); z.scale.setScalar(.45); g.add(z); extra.push(z); }
    const label = document.createElement('div'); label.className = 's3-nome mari';
    label.innerHTML = '<b></b><span></span>'; label.querySelector('b').textContent = 'Mari Nutri 💚'; label.dataset.curto = 'Mari Nutri 💚'; label.dataset.full = 'Mari Nutri 💚';
    S.labels.append(label);
    S.bots.push({ g, R, P: R.userData.parts, tile, label, estado: 'ativo', mari: true, habs: habsM, its: itsM, extra, nome: 'Mari Nutri', base: new THREE.Vector3(), cur: new THREE.Vector2(), alvo: new THREE.Vector2(),
      fase: 0, idx: 0, t: 0, modo: 'acao', propAtual: null });
  }
  S.cols = colunas();
  posicionar();
}

function setProp(b, k) {
  if (b.propAtual === k) return;
  [b.P.holdR, b.P.holdL].forEach(h => { while (h.children.length) h.remove(h.children[0]); });
  Object.values(b.its).forEach(it => it.visible = true);
  b.propAtual = k;
  if (!k) return;
  if (k === 'exercicio') { const a = prop('exercicio'), c = prop('exercicio'); a.rotation.y = Math.PI / 2; c.rotation.y = Math.PI / 2; b.P.holdR.add(a); b.P.holdL.add(c); }
  else { const p = prop(k); b.P.holdR.add(p); if (k === 'agua') p.position.y = -.12; }
  if (b.its[k]) b.its[k].visible = false;
}

function loop() {
  if (!S.ok) return;
  const dt = Math.min(S.clock.getDelta(), .05); const t = S.clock.elapsedTime;
  S.luzes && S.luzes.forEach((m, i) => m.emissiveIntensity = .5 + .5 * Math.sin(t * 2 + i));
  const v = new THREE.Vector3();
  for (const b of S.bots) {
    const P = b.P, R = b.R; b.fase += dt;
    let y = 0, rx = 0;
    // reset suave
    const lerp = (o, k, val, s = 8) => { o[k] += (val - o[k]) * Math.min(1, dt * s); };
    if (P.estrela) P.estrela.rotation.y = b.fase * 1.8;
    if (b.mari && b.fase % 16 < 3.2) {
      // Mari cumprimenta a turma de tempos em tempos (e depois volta às atividades)
      if (b.propAtual) setProp(b, null);
      const ang = Math.atan2(S.cam.position.x - (b.base.x + b.cur.x), S.cam.position.z - (b.base.z + b.cur.y));
      R.rotation.y += (ang - R.rotation.y) * Math.min(1, dt * 4);
      lerp(P.armR.rotation, 'z', 2.5 + Math.sin(b.fase * 9) * .35, 10); lerp(P.armR.rotation, 'x', 0, 10);
      lerp(P.armL.rotation, 'z', -.35); lerp(P.armL.rotation, 'x', -.2);
      lerp(P.legL.rotation, 'x', 0); lerp(P.legR.rotation, 'x', 0);
      lerp(P.head.rotation, 'z', Math.sin(b.fase * 3) * .12, 4); lerp(P.head.rotation, 'x', 0);
      y = Math.abs(Math.sin(b.fase * 2.2)) * .06;
      if (b.modo === 'acao') b.t = Math.min(b.t, .01); // ao terminar o aceno, segue para a próxima atividade
      b.extra.forEach((z, k) => { const a = b.fase * .9 + k * Math.PI / 2; z.position.set(Math.cos(a) * 1.25, 1.5 + Math.sin(b.fase * 1.6 + k) * .45, Math.sin(a) * 1.25); z.material.rotation = b.fase; });
    } else if (b.estado === 'aquecendo') {
      const f = Math.sin(b.fase * 7);
      y = Math.abs(f) * .25;
      lerp(P.armL.rotation, 'z', -(.3 + 2.3 * (f * .5 + .5)), 20); lerp(P.armR.rotation, 'z', (.3 + 2.3 * (f * .5 + .5)), 20);
      lerp(P.legL.rotation, 'z', -.25 * (f * .5 + .5), 20); lerp(P.legR.rotation, 'z', .25 * (f * .5 + .5), 20);
      lerp(R.rotation, 'y', Math.sin(b.fase * .5) * .4);
    } else if (b.estado === 'dormindo') {
      P.body.scale.y = 1 + Math.sin(b.fase * 1.7) * .05; P.head.rotation.z = .3;
      R.position.y = 0;
      const hx = Math.sin(R.rotation.y) * .75, hz = Math.cos(R.rotation.y) * .75;
      b.extra.forEach((z, k) => { const p = ((b.fase * .4 + k / 4) % 1); z.position.set(hx + .15 + p * .7, .75 + p * 1.9, hz); z.material.opacity = Math.min(1, Math.sin(p * Math.PI) * 1.4); z.scale.setScalar(.35 + p * .55); });
    } else {
      // ativo: anda até a atividade e faz
      const habs = b.habs;
      b.t -= dt;
      if (b.t <= 0) {
        if (b.modo === 'acao' && habs.length > 1) { b.idx = (b.idx + 1) % habs.length; b.modo = 'anda'; setProp(b, null); const [x, z] = POS_HAB[habs[b.idx]]; b.alvo.set(x * .5, z * .5); b.t = 9; }
        else { b.modo = 'acao'; b.t = 3.2; setProp(b, habs[b.idx]); }
      }
      if (b.modo === 'anda') {
        const d = b.alvo.clone().sub(b.cur); const dist = d.length();
        if (dist < .03) { b.modo = 'acao'; b.t = 3.2; setProp(b, habs[b.idx]); }
        else {
          const step = Math.min(dist, dt * 1.3); b.cur.addScaledVector(d.normalize(), step);
          R.rotation.y = Math.atan2(d.x, d.y);
          const w = Math.sin(b.fase * 12);
          P.legL.rotation.x = w * .6; P.legR.rotation.x = -w * .6; P.armL.rotation.x = -w * .5; P.armR.rotation.x = w * .5; y = Math.abs(w) * .06;
          lerp(P.armL.rotation, 'z', 0); lerp(P.armR.rotation, 'z', 0);
        }
      } else {
        if (habs.length === 1 && b.propAtual !== habs[0]) { const [x, z] = POS_HAB[habs[0]]; b.cur.set(x * .5, z * .5); setProp(b, habs[0]); }
        const k = habs[b.idx];
        // vira para a câmera
        const ang = Math.atan2(S.cam.position.x - (b.base.x + b.cur.x), S.cam.position.z - (b.base.z + b.cur.y));
        R.rotation.y += (ang - R.rotation.y) * Math.min(1, dt * 4);
        lerp(P.legL.rotation, 'x', 0); lerp(P.legR.rotation, 'x', 0);
        if (k === 'exercicio') {
          const f = Math.sin(b.fase * 5) * .5 + .5;
          lerp(P.armL.rotation, 'x', -.3 - f * 2.6, 14); lerp(P.armR.rotation, 'x', -.3 - f * 2.6, 14); lerp(P.armL.rotation, 'z', 0); lerp(P.armR.rotation, 'z', 0);
          y = f * .12;
        } else {
          const f = Math.sin(b.fase * 4) * .5 + .5;
          lerp(P.armR.rotation, 'x', -1.9 - f * .5, 10); lerp(P.armR.rotation, 'z', .45, 10);
          lerp(P.armL.rotation, 'x', 0); lerp(P.armL.rotation, 'z', -.1);
          lerp(P.head.rotation, 'x', k === 'agua' ? -.25 : .05, 6);
          y = Math.sin(b.fase * 2) * .02;
        }
      }
      if (b.modo === 'anda') lerp(P.head.rotation, 'x', 0);
      P.ant.material.emissiveIntensity = .5 + .5 * Math.sin(b.fase * 4);
      b.extra.forEach((z, k) => { const a = b.fase * 1.4 + k * 2.1; z.position.set(Math.cos(a) * .85, 1.4 + Math.sin(b.fase * 2 + k) * .4, Math.sin(a) * .85); z.material.rotation = b.fase; });
    }
    if (b.estado !== 'dormindo') R.position.y = y;
    b.g.position.set(b.base.x + b.cur.x, 0, b.base.z + b.cur.y);
    // etiqueta
    v.set(b.g.position.x, b.estado === 'dormindo' ? 1.45 : b.mari ? 3.35 : 2.75, b.g.position.z).project(S.cam);
    const w = S.container.clientWidth, h = S.container.clientHeight;
    const vis = v.z < 1 && v.x > -1.1 && v.x < 1.1 && v.y > -1.1 && v.y < 1.1;
    b.label.style.display = vis ? '' : 'none';
    if (vis) {
      b.label.style.transform = `translate(${((v.x + 1) / 2 * w).toFixed(1)}px,${((1 - v.y) / 2 * h).toFixed(1)}px) translate(-50%,-100%)`;
      const sp = b.label.querySelector('span');
      const perto = S.cam.position.distanceTo(S.ctl.target) < (S.distHome || 30) * .45 || b.label.classList.contains('foco');
      sp.style.display = perto ? '' : 'none';
      const bt = b.label.firstChild, nn = b.label.classList.contains('foco') ? b.label.dataset.full : b.label.dataset.curto; if (bt.textContent !== nn) bt.textContent = nn;
      const txt = b.mari && b.fase % 16 < 3.2 ? '👋 oi, meninas!' : b.estado === 'aquecendo' ? '🔥 aquecendo' : b.estado === 'dormindo' ? '😴 dormindo' : (b.modo === 'anda' ? '🚶‍♀️ indo…' : ACAO_IC[b.habs[b.idx]] + ' ' + ACAO_VERBO[b.habs[b.idx]]);
      if (sp.textContent !== txt) sp.textContent = txt;
    }
  }
  if (S.anim) {
    const a = S.anim; a.p = Math.min(1, a.p + dt / .9); const e = a.p < .5 ? 2 * a.p * a.p : 1 - Math.pow(-2 * a.p + 2, 2) / 2;
    S.ctl.target.lerpVectors(a.t0, a.t1, e); S.cam.position.lerpVectors(a.c0, a.c1, e);
    if (a.p >= 1) S.anim = null;
  }
  S.ctl.update();
  S.r.render(S.scene, S.cam);
}

function irPara(target, camPos) { S.anim = { p: 0, t0: S.ctl.target.clone(), t1: target, c0: S.cam.position.clone(), c1: camPos }; }
function focar(nome) {
  if (!S.ok) return false;
  const q = (nome || '').trim().toLowerCase();
  S.bots.forEach(b => b.label.classList.remove('foco'));
  if (!q) { window.dispatchEvent(new CustomEvent('sala3d-foco', { detail: null })); if (S.home) irPara(S.home.target.clone(), S.home.pos.clone()); return true; }
  const b = S.bots.find(x => x.nome.toLowerCase().includes(q));
  if (!b) return false;
  b.label.classList.add('foco');
  window.dispatchEvent(new CustomEvent('sala3d-foco', { detail: { nome: b.nome, estado: b.estado, habs: b.habs.slice(), mari: !!b.mari } }));
  // a ficha abre embaixo (à esquerda no PC): o robô fica na parte de cima da tela, sem ficar atrás dela
  const larga = S.container.clientWidth > 700;
  const t = new THREE.Vector3(b.base.x - (larga ? 1.6 : 0), 1, b.base.z + (larga ? 2.2 : 3.2));
  irPara(t, t.clone().add(new THREE.Vector3(3, 7.5, 9)));
  return true;
}
function tocar(e) {
  const rect = S.r.domElement.getBoundingClientRect();
  const m = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
  const rc = new THREE.Raycaster(); rc.setFromCamera(m, S.cam);
  const hit = rc.intersectObjects(S.bots.map(b => b.g), true)[0];
  if (!hit) return;
  const b = S.bots.find(x => { let o = hit.object; while (o) { if (o === x.g) return true; o = o.parent; } return false; });
  if (b) { focar(b.nome); }
}

function suportaWebGL() { try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; } }

window.Sala3D = {
  pronto: suportaWebGL(),
  montar(container) { if (!this.pronto) return false; iniciar(container); return true; },
  atualizar, focar, inicio() { focar(''); }
};
window.dispatchEvent(new Event('sala3d-pronta'));
