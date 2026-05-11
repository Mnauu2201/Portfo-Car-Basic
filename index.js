import * as THREE from 'three';

// ============================================================
// 3D PORTFOLIO WORLD — Car-Navigated Interactive Experience
// ============================================================

// --- SCENE SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a1a, 0.012);

// --- GALAXY SKYBOX ---
// Exposed star/nebula materials for Day/Night opacity control
let _starMat1, _starMat2, _nebulaMat, _brightMat;

function createGalaxySky() {
  // Deep space background color (no solid color — stars will fill it)
  scene.background = new THREE.Color(0x000005);

  // --- Star field layer 1: distant tiny stars ---
  const starCount1 = 8000;
  const starGeo1 = new THREE.BufferGeometry();
  const starPos1 = new Float32Array(starCount1 * 3);
  const starColors1 = new Float32Array(starCount1 * 3);
  for (let i = 0; i < starCount1; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 350 + Math.random() * 50;
    starPos1[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    starPos1[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos1[i * 3 + 2] = r * Math.cos(phi);
    const t = Math.random();
    if (t < 0.6) { starColors1[i*3]=0.85; starColors1[i*3+1]=0.9; starColors1[i*3+2]=1.0; }
    else if (t < 0.85) { starColors1[i*3]=1.0; starColors1[i*3+1]=1.0; starColors1[i*3+2]=1.0; }
    else if (t < 0.95) { starColors1[i*3]=1.0; starColors1[i*3+1]=0.85; starColors1[i*3+2]=0.6; }
    else { starColors1[i*3]=0.9; starColors1[i*3+1]=0.7; starColors1[i*3+2]=1.0; }
  }
  starGeo1.setAttribute('position', new THREE.BufferAttribute(starPos1, 3));
  starGeo1.setAttribute('color', new THREE.BufferAttribute(starColors1, 3));
  _starMat1 = new THREE.PointsMaterial({ size: 0.55, vertexColors: true, transparent: true, opacity: 0.85, sizeAttenuation: true, depthWrite: false });
  scene.add(new THREE.Points(starGeo1, _starMat1));

  // --- Star field layer 2: brighter closer stars ---
  const starCount2 = 2000;
  const starGeo2 = new THREE.BufferGeometry();
  const starPos2 = new Float32Array(starCount2 * 3);
  const starColors2 = new Float32Array(starCount2 * 3);
  for (let i = 0; i < starCount2; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 300 + Math.random() * 80;
    starPos2[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    starPos2[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos2[i * 3 + 2] = r * Math.cos(phi);
    const t = Math.random();
    if (t < 0.5) { starColors2[i*3]=0.8; starColors2[i*3+1]=0.85; starColors2[i*3+2]=1.0; }
    else if (t < 0.8) { starColors2[i*3]=1.0; starColors2[i*3+1]=1.0; starColors2[i*3+2]=0.95; }
    else { starColors2[i*3]=1.0; starColors2[i*3+1]=0.75; starColors2[i*3+2]=0.5; }
  }
  starGeo2.setAttribute('position', new THREE.BufferAttribute(starPos2, 3));
  starGeo2.setAttribute('color', new THREE.BufferAttribute(starColors2, 3));
  _starMat2 = new THREE.PointsMaterial({ size: 1.1, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true, depthWrite: false });
  scene.add(new THREE.Points(starGeo2, _starMat2));

  // --- Galaxy nebula band (Milky Way effect) ---
  const nebulaCount = 3000;
  const nebulaGeo = new THREE.BufferGeometry();
  const nebulaPos = new Float32Array(nebulaCount * 3);
  const nebulaColors = new Float32Array(nebulaCount * 3);
  for (let i = 0; i < nebulaCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const bandWidth = 0.35;
    const phi = Math.PI / 2 + (Math.random() - 0.5) * bandWidth * (1 + Math.abs(Math.sin(theta * 2)) * 0.5);
    const r = 340 + Math.random() * 40;
    nebulaPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    nebulaPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    nebulaPos[i * 3 + 2] = r * Math.cos(phi);
    const t = Math.random();
    if (t < 0.35) { nebulaColors[i*3]=0.4; nebulaColors[i*3+1]=0.2; nebulaColors[i*3+2]=0.7; }
    else if (t < 0.65) { nebulaColors[i*3]=0.2; nebulaColors[i*3+1]=0.3; nebulaColors[i*3+2]=0.8; }
    else if (t < 0.85) { nebulaColors[i*3]=0.7; nebulaColors[i*3+1]=0.2; nebulaColors[i*3+2]=0.5; }
    else { nebulaColors[i*3]=0.5; nebulaColors[i*3+1]=0.7; nebulaColors[i*3+2]=1.0; }
  }
  nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
  nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
  _nebulaMat = new THREE.PointsMaterial({ size: 2.5, vertexColors: true, transparent: true, opacity: 0.18, sizeAttenuation: true, depthWrite: false });
  scene.add(new THREE.Points(nebulaGeo, _nebulaMat));

  // --- A few extra-bright star clusters ---
  const brightCount = 150;
  const brightGeo = new THREE.BufferGeometry();
  const brightPos = new Float32Array(brightCount * 3);
  const brightColors = new Float32Array(brightCount * 3);
  for (let i = 0; i < brightCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 320;
    brightPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    brightPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    brightPos[i * 3 + 2] = r * Math.cos(phi);
    brightColors[i*3]=1.0; brightColors[i*3+1]=1.0; brightColors[i*3+2]=1.0;
  }
  brightGeo.setAttribute('position', new THREE.BufferAttribute(brightPos, 3));
  brightGeo.setAttribute('color', new THREE.BufferAttribute(brightColors, 3));
  _brightMat = new THREE.PointsMaterial({ size: 2.2, vertexColors: true, transparent: true, opacity: 1.0, sizeAttenuation: true, depthWrite: false });
  scene.add(new THREE.Points(brightGeo, _brightMat));
}
createGalaxySky();

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
const root = document.getElementById('root') ?? document.body;
root.appendChild(renderer.domElement);

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0x6688aa, 1.1);
ambientLight.name = 'ambientLight';
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffeedd, 2.2);
mainLight.name = 'mainDirectionalLight';
mainLight.position.set(30, 50, 20);
mainLight.intensity = 2.2;
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(512, 512);
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 150;
mainLight.shadow.camera.left = -60;
mainLight.shadow.camera.right = 60;
mainLight.shadow.camera.top = 60;
mainLight.shadow.camera.bottom = -60;
mainLight.shadow.bias = -0.001;
mainLight.shadow.normalBias = 0.02;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x88aadd, 0.8);
fillLight.name = 'fillLight';
fillLight.position.set(-20, 30, -10);
scene.add(fillLight);

const hemisphereLight = new THREE.HemisphereLight(0x88bbff, 0x336633, 0.6);
hemisphereLight.name = 'hemisphereLight';
scene.add(hemisphereLight);

// ============================================================
// --- DAY / NIGHT CYCLE — Vietnam Time (UTC+7) ---
// ============================================================

// Sun mesh
const sunGeo = new THREE.SphereGeometry(4, 16, 16);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffde7, fog: false });
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
sunMesh.name = 'sun';
scene.add(sunMesh);

// Sun glow (sprite halo)
const sunGlowGeo = new THREE.SphereGeometry(7, 16, 16);
const sunGlowMat = new THREE.MeshBasicMaterial({ color: 0xffcc44, transparent: true, opacity: 0.18, fog: false, side: THREE.BackSide });
const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
sunMesh.add(sunGlow);

// Moon mesh
const moonGeo = new THREE.SphereGeometry(2.5, 16, 16);
const moonMat = new THREE.MeshBasicMaterial({ color: 0xdde8f0, fog: false });
const moonMesh = new THREE.Mesh(moonGeo, moonMat);
moonMesh.name = 'moon';
scene.add(moonMesh);

// Moon glow
const moonGlowGeo = new THREE.SphereGeometry(4, 16, 16);
const moonGlowMat = new THREE.MeshBasicMaterial({ color: 0x99bbdd, transparent: true, opacity: 0.12, fog: false, side: THREE.BackSide });
const moonGlow = new THREE.Mesh(moonGlowGeo, moonGlowMat);
moonMesh.add(moonGlow);

// VN Clock UI
const clockEl = document.createElement('div');
clockEl.id = 'vn-clock';
clockEl.style.cssText = `
  position: fixed; top: 16px; left: 20px; z-index: 1000;
  background: rgba(0,0,0,0.45); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 12px;
  padding: 8px 14px; color: #fff; font-family: 'Segoe UI', system-ui, sans-serif;
  display: flex; flex-direction: row; align-items: center; gap: 6px;
  pointer-events: none; user-select: none;
`;
clockEl.innerHTML = `
  <div id="clock-icon" style="font-size:1.2rem;">🌙</div>
  <div id="clock-time" style="font-size:0.95rem;font-weight:700;letter-spacing:0.05em;">00:00</div>
  <div style="font-size:0.6rem;opacity:0.55;letter-spacing:0.1em;">VIETNAM</div>
`;
document.body.appendChild(clockEl);
const clockIcon = document.getElementById('clock-icon');
const clockTime = document.getElementById('clock-time');

// Sky color keyframes by hour (Vietnam local time)
// Each entry: [hour, skyHex, fogHex, ambientHex, ambientIntensity, sunIntensity, sunColor, shadowIntensity]
const SKY_KEYS = [
  // hour  sky          fog          ambient      ambI  sunI  sunColor    fillI
  [  0,  0x0a0e2a,  0x080c1e,  0x3355aa,  0.75, 0.0,  0xffffff, 0.5 ],  // midnight
  [  4,  0x0d1235,  0x0a0e28,  0x4466bb,  0.80, 0.0,  0xffffff, 0.5 ],  // pre-dawn dark
  [  5,  0x1a1040,  0x1a1030,  0x4455aa,  0.70, 0.05, 0xffbb66, 0.4 ],  // early dawn
  [  6,  0xff6030,  0xff5520,  0xff8844,  0.85, 0.8,  0xff8833, 0.7 ],  // sunrise
  [  7,  0xff9966,  0xff8844,  0xffaa66,  1.0,  1.4,  0xffcc88, 1.0 ],  // golden hour
  [  8,  0x87ceeb,  0x6ab4d8,  0x88aadd,  1.1,  2.0,  0xffeedd, 1.6 ],  // morning
  [ 10,  0x6ab0e8,  0x5ba0d0,  0x7799cc,  1.2,  2.2,  0xfff5e0, 2.0 ],  // late morning
  [ 12,  0x4a90d9,  0x4080c0,  0x6688aa,  1.2,  2.3,  0xfff8f0, 2.2 ],  // noon
  [ 14,  0x4a90d9,  0x4080c0,  0x6688aa,  1.2,  2.2,  0xfff8f0, 2.0 ],  // afternoon
  [ 16,  0x6aabe0,  0x5a9acc,  0x88aacc,  1.1,  1.8,  0xffeedd, 1.6 ],  // late afternoon
  [ 17,  0xff9944,  0xee7722,  0xffaa55,  1.0,  1.2,  0xff9933, 1.0 ],  // golden hour eve
  [ 18,  0xff5522,  0xee4411,  0xff7744,  0.9,  0.5,  0xff6622, 0.6 ],  // sunset
  [ 19,  0x1a0a3a,  0x150828,  0x5544aa,  0.80, 0.0,  0xff4422, 0.5 ],  // dusk
  [ 20,  0x0a0e2a,  0x080c1e,  0x3355aa,  0.75, 0.0,  0xffffff, 0.5 ],  // night
  [ 24,  0x0a0e2a,  0x080c1e,  0x3355aa,  0.75, 0.0,  0xffffff, 0.5 ],  // midnight wrap
];

function lerpColor(hexA, hexB, t) {
  const a = new THREE.Color(hexA), b = new THREE.Color(hexB);
  return a.lerp(b, t);
}

function getSkyParams(hourFrac) {
  // Find surrounding keyframes
  let lo = SKY_KEYS[0], hi = SKY_KEYS[SKY_KEYS.length - 1];
  for (let i = 0; i < SKY_KEYS.length - 1; i++) {
    if (hourFrac >= SKY_KEYS[i][0] && hourFrac <= SKY_KEYS[i+1][0]) {
      lo = SKY_KEYS[i]; hi = SKY_KEYS[i+1]; break;
    }
  }
  const span = hi[0] - lo[0];
  const t = span === 0 ? 0 : (hourFrac - lo[0]) / span;
  const smooth = t * t * (3 - 2 * t); // smoothstep
  return {
    sky:     lerpColor(lo[1], hi[1], smooth),
    fog:     lerpColor(lo[2], hi[2], smooth),
    ambient: lerpColor(lo[3], hi[3], smooth),
    ambI:    lo[4] + (hi[4] - lo[4]) * smooth,
    sunI:    lo[5] + (hi[5] - lo[5]) * smooth,
    sunColor: lerpColor(lo[6], hi[6], smooth),
    fillI:   lo[7] + (hi[7] - lo[7]) * smooth,
  };
}

function updateDayNight() {
  // Get Vietnam time (UTC+7)
  const now = new Date();
  const vnHour   = (now.getUTCHours() + 7) % 24;
  const vnMin    = now.getUTCMinutes();
  const vnSec    = now.getUTCSeconds();
  const hourFrac = vnHour + vnMin / 60 + vnSec / 3600;

  const p = getSkyParams(hourFrac);

  // Night factor (stars + city lights)
  const nightFactor = Math.max(0, Math.min(1,
    hourFrac < 6  ? 1 - (hourFrac - 4.5) / 1.5  :
    hourFrac > 18 ? (hourFrac - 18) / 1.5          :
    Math.max(0, 1 - (hourFrac - 6) / 1.5)
  ));

  // Night/day flag
  const isDay = hourFrac >= 6 && hourFrac <= 19;

  // Background & fog
  scene.background = p.sky;
  if (scene.fog) {
    scene.fog.color.copy(p.fog);
    // Fog less dense at night so city lights visible further
    scene.fog.density = isDay ? 0.012 : 0.007;
  }

  // Lights
  ambientLight.color.copy(p.ambient);
  ambientLight.intensity = p.ambI;
  mainLight.color.copy(p.sunColor);
  mainLight.intensity = p.sunI;
  fillLight.intensity = p.fillI * 0.38;

  // Hemisphere sky/ground shift
  hemisphereLight.color.set(isDay ? 0x88bbff : 0x4466cc);
  hemisphereLight.groundColor.set(isDay ? 0x336633 : 0x223355);
  hemisphereLight.intensity = isDay ? p.ambI * 0.55 : 0.65;

  // Night city ambient fill — warm orange glow from below (street lights)
  if (!updateDayNight._cityFill) {
    updateDayNight._cityFill = new THREE.HemisphereLight(0x334488, 0xff9933, 0);
    updateDayNight._cityFill.name = 'cityNightFill';
    scene.add(updateDayNight._cityFill);
  }
  updateDayNight._cityFill.intensity = isDay ? 0 : nightFactor * 0.6;

  // Lamp post brightness boost at night — use cached list instead of scene.traverse
  if (!updateDayNight._lampLights) {
    updateDayNight._lampLights = [];
    updateDayNight._lampBulbs  = [];
    scene.traverse(obj => {
      if (obj.name === 'lampLight_inner' && obj.isLight)  updateDayNight._lampLights.push(obj);
      if (obj.name === 'lampBulb_inner'  && obj.isMesh)   updateDayNight._lampBulbs.push(obj);
    });
  }
  const lampI = isDay ? 0.5 : 2.2;
  const lampD = isDay ? 8   : 14;
  const bulbE = isDay ? 1.0 : 3.0;
  updateDayNight._lampLights.forEach(l => { l.intensity = lampI; l.distance = lampD; });
  updateDayNight._lampBulbs.forEach(b  => { b.material.emissiveIntensity = bulbE; });

  // Sun position — arc from E (hour 6) to W (hour 18)
  const sunAngle = ((hourFrac - 12) / 12) * Math.PI; // -PI/2 at 6am, 0 at noon, PI/2 at 6pm → offset
  const sunElevation = Math.max(-0.3, Math.sin(((hourFrac - 6) / 12) * Math.PI)); // 0 at 6am/6pm, peak at noon
  const sunDist = 280;
  sunMesh.position.set(
    Math.cos(sunAngle) * sunDist,
    sunElevation * 150 + 10,
    Math.sin(sunAngle) * -60
  );
  // Sync directional light to sun
  mainLight.position.copy(sunMesh.position).normalize().multiplyScalar(80);

  // Sun visibility & color temperature
  const sunVisible = hourFrac >= 5.2 && hourFrac <= 18.8;
  sunMesh.visible = sunVisible;
  if (sunVisible) {
    const elevation01 = Math.max(0, sunElevation);
    const warmth = 1 - elevation01;          // warm at horizon, white at zenith
    sunMat.color.setRGB(1.0, 0.85 + elevation01 * 0.15, 0.4 + elevation01 * 0.6);
    sunGlowMat.opacity = 0.08 + warmth * 0.22;
  }

  // Moon — opposite side of sky
  const moonAngle = sunAngle + Math.PI;
  const moonElevation = Math.max(-0.3, Math.sin(((hourFrac + 6) / 12) * Math.PI));
  moonMesh.position.set(
    Math.cos(moonAngle) * sunDist,
    moonElevation * 120 + 10,
    Math.sin(moonAngle) * -60
  );
  const moonVisible = !sunVisible || hourFrac < 6.5 || hourFrac > 18.5;
  moonMesh.visible = moonVisible;

  if (_starMat1)  _starMat1.opacity  = 0.85 * nightFactor;
  if (_starMat2)  _starMat2.opacity  = 0.90 * nightFactor;
  if (_nebulaMat) _nebulaMat.opacity = 0.18 * nightFactor;
  if (_brightMat) _brightMat.opacity = nightFactor;

  // Clock UI
  const hh = String(vnHour).padStart(2,'0');
  const mm = String(vnMin).padStart(2,'0');
  clockTime.textContent = `${hh}:${mm}`;
  if (hourFrac >= 6 && hourFrac < 12)       clockIcon.textContent = '🌅';
  else if (hourFrac >= 12 && hourFrac < 17) clockIcon.textContent = '☀️';
  else if (hourFrac >= 17 && hourFrac < 19) clockIcon.textContent = '🌇';
  else                                      clockIcon.textContent = '🌙';

  // Tone mapping — brighter at night to reveal scene, natural during day
  renderer.toneMappingExposure = isDay ? (0.9 + p.ambI * 0.4) : 1.8;
}

// ── UPDATE HEADLIGHTS — called every frame in animate() ──
function updateHeadlights(nightFactor) {
  if (!_headlightUnits || !carState) return;

  const on = nightFactor;
  const flicker = 1.0 - Math.sin(performance.now() * 0.00031) * 0.022;

  // Car forward direction in world space
  const heading = carState.heading;
  const fwdX = Math.sin(heading);
  const fwdZ = Math.cos(heading);
  // Car right vector
  const rgtX = Math.cos(heading);
  const rgtZ = -Math.sin(heading);

  _headlightUnits.forEach(({ primary, primaryTarget, fill, fillTarget, coneMat, xOffset }) => {
    // World-space position of the headlight lens
    const lensWX = carState.position.x + rgtX * xOffset;
    const lensWZ = carState.position.z + rgtZ * xOffset;
    const lensWY = 0.60;

    // Primary target: 30 units ahead + slightly down (hits road surface)
    primaryTarget.position.set(
      lensWX + fwdX * 30 + rgtX * xOffset * 0.3,
      -0.5,
      lensWZ + fwdZ * 30 + rgtZ * xOffset * 0.3
    );

    // Fill target: 8 units ahead, angled down more steeply for near-road coverage
    fillTarget.position.set(
      lensWX + fwdX * 8,
      -0.3,
      lensWZ + fwdZ * 8
    );

    primary.intensity = on * 8.0 * flicker;
    fill.intensity    = on * 2.8 * flicker;

    // Cone opacity — subtle, just a glow near the lens
    coneMat.opacity = on * 0.038 * flicker;
  });

  // LED lens emissive synced to night
  if (ledMat) ledMat.emissiveIntensity = 1.5 + on * 3.5;
}

// --- PORTFOLIO DATA ---
// 7 projects spread evenly in a circle (360/7 ≈ 51.4° apart), radius 35
const _R = 35;
const _N = 7;
function _circlePos(i) {
  const angle = (i / _N) * Math.PI * 2 - Math.PI / 2; // start at top (-Z)
  return new THREE.Vector3(Math.cos(angle) * _R, 0, Math.sin(angle) * _R);
}
function _circleRot(i) {
  const angle = (i / _N) * Math.PI * 2 - Math.PI / 2;
  return -angle; // building faces center
}

const portfolioProjects = [
  {
    id: 'project0',
    title: 'QA Chart',
    category: 'Data Visualization',
    description: 'Lấy dữ liệu coin trực tiếp từ Binance theo thời gian thực. Bổ sung các công cụ phân tích nâng cao từ TradingView mà Binance không có — giúp trader có nhiều tính năng hơn trong một nền tảng duy nhất.',
    tech: ['React', 'Recharts', 'TypeScript', 'Vercel', 'TailwindCSS'],
    link: 'https://qachart.vercel.app/',
    demoUrl: 'https://qachart.vercel.app/',
    screenshot: './screenshots/qachart.png',
    color: 0x00ff88,
    accentColor: '#00ff88',
    position: _circlePos(0),
    rotation: _circleRot(0)
  },
  {
    id: 'project1',
    title: 'E-Commerce Platform',
    category: 'Full-Stack Development',
    description: 'A modern e-commerce platform built with React, Node.js, and PostgreSQL. Features real-time inventory, Stripe payments, and an admin dashboard.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
    link: '#',
    color: 0x00e5ff,
    accentColor: '#00e5ff',
    position: _circlePos(1),
    rotation: _circleRot(1)
  },
  {
    id: 'project2',
    title: 'AI Chat Assistant',
    category: 'Machine Learning',
    description: 'An intelligent conversational AI powered by transformer models with context-aware responses, sentiment analysis, and multi-language support.',
    tech: ['Python', 'PyTorch', 'FastAPI', 'WebSocket', 'Docker'],
    link: '#',
    color: 0xff6b9d,
    accentColor: '#ff6b9d',
    position: _circlePos(2),
    rotation: _circleRot(2)
  },
  {
    id: 'project3',
    title: 'Data Visualization Dashboard',
    category: 'Frontend & Data',
    description: 'Interactive real-time dashboard with D3.js charts, WebSocket live data feeds, and customizable widgets for business intelligence.',
    tech: ['D3.js', 'TypeScript', 'WebSocket', 'AWS', 'GraphQL'],
    link: '#',
    color: 0xffd93d,
    accentColor: '#ffd93d',
    position: _circlePos(3),
    rotation: _circleRot(3)
  },
  {
    id: 'project4',
    title: 'Mobile Fitness App',
    category: 'Mobile Development',
    description: 'Cross-platform fitness tracking app with GPS route mapping, social challenges, workout analytics, and wearable device integration.',
    tech: ['React Native', 'Firebase', 'MapKit', 'HealthKit', 'Redux'],
    link: '#',
    color: 0x7c4dff,
    accentColor: '#7c4dff',
    position: _circlePos(4),
    rotation: _circleRot(4)
  },
  {
    id: 'project5',
    title: 'Cloud DevOps Pipeline',
    category: 'Infrastructure & DevOps',
    description: 'Automated CI/CD pipeline with Kubernetes orchestration, infrastructure as code, monitoring dashboards, and zero-downtime deployments.',
    tech: ['Kubernetes', 'Terraform', 'Jenkins', 'Prometheus', 'Go'],
    link: '#',
    color: 0x69f0ae,
    accentColor: '#69f0ae',
    position: _circlePos(5),
    rotation: _circleRot(5)
  },
  {
    id: 'project6',
    title: '3D Game Engine',
    category: 'Systems Programming',
    description: 'Custom 3D game engine with ECS architecture, PBR rendering, physics simulation, asset pipeline, and a visual scene editor.',
    tech: ['C++', 'Vulkan', 'GLSL', 'Lua', 'ImGui'],
    link: '#',
    color: 0xff8a65,
    accentColor: '#ff8a65',
    position: _circlePos(6),
    rotation: _circleRot(6)
  }
];

// --- GROUND ---
const groundGeo = new THREE.CircleGeometry(100, 64);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x111122,
  roughness: 0.85,
  metalness: 0.1
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.name = 'ground';
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Road grid
function createRoad(start, end, width = 3) {
  const dir = new THREE.Vector3().subVectors(end, start);
  const length = dir.length();
  const roadGeo = new THREE.PlaneGeometry(width, length);
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.7, metalness: 0.05 });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.name = 'road_' + Math.random().toString(36).substr(2, 5);
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  road.position.set(mid.x, 0.01, mid.z);
  road.rotation.x = -Math.PI / 2;
  const angle = Math.atan2(dir.x, dir.z);
  road.rotation.z = -angle;
  road.receiveShadow = true;
  scene.add(road);

  // Lane markings
  const dashCount = Math.floor(length / 3);
  for (let i = 0; i < dashCount; i++) {
    const t = (i + 0.5) / dashCount;
    const pos = new THREE.Vector3().lerpVectors(start, end, t);
    const dashGeo = new THREE.PlaneGeometry(0.12, 1.2);
    const dashMat = new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.5 });
    const dash = new THREE.Mesh(dashGeo, dashMat);
    dash.name = 'roadDash_' + i + '_' + Math.random().toString(36).substr(2, 3);
    dash.position.set(pos.x, 0.02, pos.z);
    dash.rotation.x = -Math.PI / 2;
    dash.rotation.z = -angle;
    scene.add(dash);
  }
}

// Roads from center to each project
const center = new THREE.Vector3(0, 0, 0);
portfolioProjects.forEach(p => {
  createRoad(center, p.position, 3.5);
});
// Ring road connecting projects
for (let i = 0; i < portfolioProjects.length; i++) {
  const next = (i + 1) % portfolioProjects.length;
  createRoad(portfolioProjects[i].position, portfolioProjects[next].position, 2.5);
}

// --- CENTRAL HUB ---
const hubGroup = new THREE.Group();
hubGroup.name = 'centralHub';

// Hub platform
const hubPlatGeo = new THREE.CylinderGeometry(6, 6.5, 0.5, 6);
const hubPlatMat = new THREE.MeshStandardMaterial({ color: 0x1a1a3e, roughness: 0.4, metalness: 0.3 });
const hubPlatform = new THREE.Mesh(hubPlatGeo, hubPlatMat);
hubPlatform.name = 'hubPlatform';
hubPlatform.position.y = 0.25;
hubPlatform.receiveShadow = true;
hubPlatform.castShadow = true;
hubGroup.add(hubPlatform);

// Thin pedestal thay cột cũ
const pedestalGeo = new THREE.CylinderGeometry(0.18, 0.35, 2.5, 8);
const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x1a1a3e, roughness: 0.3, metalness: 0.7, emissive: 0x0011aa, emissiveIntensity: 0.15 });
const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
pedestal.name = 'hubPedestal';
pedestal.position.y = 1.25;
pedestal.castShadow = true;
hubGroup.add(pedestal);

// Billboard avatar — PlaneGeometry xoay nhìn về phía xe
const avatarTex = new THREE.TextureLoader().load('./Me.png');
avatarTex.colorSpace = THREE.SRGBColorSpace;
const avatarGeo = new THREE.PlaneGeometry(3.2, 4.0);
const avatarMat = new THREE.MeshBasicMaterial({ map: avatarTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
const avatarBillboard = new THREE.Mesh(avatarGeo, avatarMat);
avatarBillboard.name = 'avatarBillboard';
avatarBillboard.position.y = 4.5;
hubGroup.add(avatarBillboard);

// Glow ring phía dưới avatar
const glowRingGeo = new THREE.TorusGeometry(1.8, 0.06, 8, 48);
const glowRingMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.55 });
const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
glowRing.name = 'hubGlowRing';
glowRing.rotation.x = Math.PI / 2;
glowRing.position.y = 2.6;
hubGroup.add(glowRing);

// Hub light — ánh sáng xanh chiếu avatar
const hubPointLight = new THREE.PointLight(0x00e5ff, 2.5, 22);
hubPointLight.name = 'hubPointLight';
hubPointLight.position.y = 6;
hubGroup.add(hubPointLight);

// Warm spotlight chiếu từ dưới lên avatar
const avatarSpot = new THREE.PointLight(0xffd4a0, 1.8, 12);
avatarSpot.name = 'avatarSpot';
avatarSpot.position.set(0, 2.8, 1.5);
hubGroup.add(avatarSpot);

// hubCube vẫn cần khai báo để không lỗi ở animate loop — dùng dummy invisible
const hubCube = new THREE.Object3D();
hubCube.name = 'hubCubeDummy';
hubGroup.add(hubCube);

scene.add(hubGroup);

// --- BUILD PROJECT ZONES ---
const projectGroups = [];
const projectLights = [];

portfolioProjects.forEach((proj, index) => {
  const group = new THREE.Group();
  group.name = 'projectZone_' + proj.id;
  group.position.copy(proj.position);
  group.rotation.y = proj.rotation;

  const c = new THREE.Color(proj.color);

  // Main building
  const buildH = 6 + Math.random() * 3;
  const buildGeo = new THREE.BoxGeometry(4, buildH, 4);
  const buildMat = new THREE.MeshStandardMaterial({ color: 0x181830, roughness: 0.3, metalness: 0.5 });
  const building = new THREE.Mesh(buildGeo, buildMat);
  building.name = 'building_' + proj.id;
  building.position.y = buildH / 2;
  building.castShadow = true;
  building.receiveShadow = true;
  group.add(building);

  // Glowing accent strips
  for (let s = 0; s < 4; s++) {
    const stripGeo = new THREE.BoxGeometry(4.1, 0.15, 0.05);
    const stripMat = new THREE.MeshStandardMaterial({ color: proj.color, emissive: proj.color, emissiveIntensity: 0.8, roughness: 0.2, metalness: 0.3 });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.name = 'strip_' + proj.id + '_' + s;
    strip.position.set(0, 1.5 + s * 1.5, 2.03);
    group.add(strip);
    const strip2 = strip.clone();
    strip2.name = 'strip2_' + proj.id + '_' + s;
    strip2.position.z = -2.03;
    group.add(strip2);
  }

  // Side towers
  const towerGeo = new THREE.CylinderGeometry(0.5, 0.7, buildH + 2, 6);
  const towerMat = new THREE.MeshStandardMaterial({ color: c.clone().multiplyScalar(0.3), roughness: 0.3, metalness: 0.6 });
  [-1, 1].forEach((side, si) => {
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.name = 'tower_' + proj.id + '_' + si;
    tower.position.set(side * 3, (buildH + 2) / 2, 0);
    tower.castShadow = true;
    group.add(tower);

    // Tower top glow
    const glowGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const glowMat = new THREE.MeshStandardMaterial({ color: proj.color, emissive: proj.color, emissiveIntensity: 1 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.name = 'towerGlow_' + proj.id + '_' + si;
    glow.position.set(side * 3, buildH + 2.5, 0);
    group.add(glow);
  });

  // Ground platform
  const platGeo = new THREE.CylinderGeometry(6, 6.5, 0.3, 8);
  const platMat = new THREE.MeshStandardMaterial({ color: c.clone().multiplyScalar(0.15), roughness: 0.5, metalness: 0.3 });
  const plat = new THREE.Mesh(platGeo, platMat);
  plat.name = 'platform_' + proj.id;
  plat.position.y = 0.15;
  plat.receiveShadow = true;
  group.add(plat);

  // Project zone light
  const pLight = new THREE.PointLight(proj.color, 1.5, 18);
  pLight.name = 'projectLight_' + proj.id;
  pLight.position.set(0, buildH + 1, 3);
  group.add(pLight);
  projectLights.push(pLight);

  // Floating info marker
  const markerGeo = new THREE.OctahedronGeometry(0.5, 0);
  const markerMat = new THREE.MeshStandardMaterial({ color: proj.color, emissive: proj.color, emissiveIntensity: 0.6, transparent: true, opacity: 0.9 });
  const marker = new THREE.Mesh(markerGeo, markerMat);
  marker.name = 'marker_' + proj.id;
  marker.position.set(0, buildH + 3, 0);
  group.add(marker);

  // Demo screen on building front wall (for projects with demoUrl)
  let demoScreen = null;
  if (proj.demoUrl) {
    const screenW = 3.6, screenH = 2.4;
    // Screen frame (dark bezel)
    const frameGeo = new THREE.BoxGeometry(screenW + 0.18, screenH + 0.18, 0.08);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x0a0a1a, roughness: 0.2, metalness: 0.8 });
    const screenFrame = new THREE.Mesh(frameGeo, frameMat);
    screenFrame.name = 'demoFrame_' + proj.id;
    screenFrame.position.set(0, buildH * 0.6, 2.08);
    group.add(screenFrame);

    // Screen glow plane (emissive, represents the "on" screen)
    const screenGeo = new THREE.PlaneGeometry(screenW, screenH);
    const c = new THREE.Color(proj.color);
    const screenMat = new THREE.MeshStandardMaterial({
      color: c.clone().multiplyScalar(0.15),
      emissive: c.clone().multiplyScalar(0.4),
      emissiveIntensity: 1.2,
      roughness: 0.05,
      metalness: 0.1,
    });
    demoScreen = new THREE.Mesh(screenGeo, screenMat);
    demoScreen.name = 'demoScreen_' + proj.id;
    demoScreen.position.set(0, buildH * 0.6, 2.12);
    group.add(demoScreen);

    // Scanline overlay strips for CRT effect
    for (let sl = 0; sl < 6; sl++) {
      const slGeo = new THREE.PlaneGeometry(screenW, 0.04);
      const slMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false });
      const slMesh = new THREE.Mesh(slGeo, slMat);
      slMesh.position.set(0, buildH * 0.6 - screenH / 2 + (sl + 0.5) * (screenH / 6), 2.13);
      group.add(slMesh);
    }

    // Corner indicator lights
    [[- screenW/2 - 0.15, buildH * 0.6 + screenH/2 + 0.15],
     [  screenW/2 + 0.15, buildH * 0.6 + screenH/2 + 0.15],
     [- screenW/2 - 0.15, buildH * 0.6 - screenH/2 - 0.15],
     [  screenW/2 + 0.15, buildH * 0.6 - screenH/2 - 0.15]].forEach(([cx2, cy2]) => {
      const dotGeo = new THREE.SphereGeometry(0.07, 6, 6);
      const dotMat = new THREE.MeshStandardMaterial({ color: proj.color, emissive: proj.color, emissiveIntensity: 2 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(cx2, cy2, 2.1);
      group.add(dot);
    });
  }

  scene.add(group);
  projectGroups.push({ group, project: proj, buildingHeight: buildH, marker, demoScreen });
});

// --- DECORATIVE ELEMENTS ---
// Collision registry (must be before createLampPost calls)
const colliders = [];

// Lamp posts along roads
function createLampPost(x, z) {
  const group = new THREE.Group();
  group.name = 'lampGroup_' + Math.random().toString(36).substr(2, 5);
  group.position.set(x, 0, z);

  const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 3, 6);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.4, metalness: 0.6 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.name = 'lampPole_inner';
  pole.position.y = 1.5;
  pole.castShadow = true;
  group.add(pole);

  const lightGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xffeedd, emissive: 0xffeedd, emissiveIntensity: 1 });
  const lightBulb = new THREE.Mesh(lightGeo, lightMat);
  lightBulb.name = 'lampBulb_inner';
  lightBulb.position.y = 3.1;
  group.add(lightBulb);

  const pl = new THREE.PointLight(0xffeedd, 0.5, 8);
  pl.name = 'lampLight_inner';
  pl.position.y = 3.1;
  group.add(pl);

  scene.add(group);

  // Register as collider
  colliders.push({
    x, z,
    radius: 0.25,
    group,
    type: 'lamp',
    hitTimer: 0,
    hitDir: 0,
    origRotX: 0,
    origRotZ: 0,
    knocked: false,     // permanently tilted after hard hit
  });
}

portfolioProjects.forEach(p => {
  const dir = p.position.clone().normalize();
  const perp = new THREE.Vector3(-dir.z, 0, dir.x);
  for (let i = 0; i < 3; i++) {
    const t = 0.3 + i * 0.25;
    const pos = p.position.clone().multiplyScalar(t);
    createLampPost(pos.x + perp.x * 2.5, pos.z + perp.z * 2.5);
  }
});

// ============================================================
// --- CHIBI CITY ---
// ============================================================

// Pastel color palette for chibi buildings
const chibiPalette = [
  0xff9eb5, 0xffb347, 0xfff176, 0xaed6f1, 0xa9dfbf,
  0xd7bde2, 0xf9e79f, 0xf1948a, 0x82e0aa, 0x85c1e9,
  0xf8c8d4, 0xffd6a5, 0xb5ead7, 0xc7ceea, 0xffb3ba
];

function randPastel() {
  return chibiPalette[Math.floor(Math.random() * chibiPalette.length)];
}

// --- Chibi building generator ---
function createChibiBuilding(x, z, opts = {}) {
  const group = new THREE.Group();
  group.name = 'chibiBuilding_' + Math.random().toString(36).substr(2,5);

  const w = opts.w || (1.5 + Math.random() * 1.5);
  const h = opts.h || (2.5 + Math.random() * 4);
  const d = opts.d || (1.5 + Math.random() * 1.5);
  const wallColor = opts.color || randPastel();
  const roofColor = opts.roofColor || randPastel();
  const type = opts.type || Math.floor(Math.random() * 4); // 0=box, 1=pyramid roof, 2=dome, 3=tower

  // Body
  const bodyGeo = new THREE.BoxGeometry(w, h, d);
  const bodyMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.7, metalness: 0.05 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = h / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Roof type
  if (type === 0) {
    // Flat roof with tiny edge trim
    const trimGeo = new THREE.BoxGeometry(w + 0.15, 0.18, d + 0.15);
    const trimMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.5 });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.y = h + 0.09;
    trim.castShadow = true;
    group.add(trim);
  } else if (type === 1) {
    // Cute pyramid/pointy roof
    const roofGeo = new THREE.ConeGeometry(w * 0.75, h * 0.55, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.6 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = h + (h * 0.55) / 2;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);
  } else if (type === 2) {
    // Dome roof
    const roofGeo = new THREE.SphereGeometry(w * 0.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.5 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = h;
    roof.castShadow = true;
    group.add(roof);
  } else {
    // Double-step tower top
    const step1Geo = new THREE.BoxGeometry(w * 0.8, h * 0.25, d * 0.8);
    const step1Mat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.6 });
    const step1 = new THREE.Mesh(step1Geo, step1Mat);
    step1.position.y = h + h * 0.125;
    step1.castShadow = true;
    group.add(step1);
    const step2Geo = new THREE.BoxGeometry(w * 0.45, h * 0.2, d * 0.45);
    const step2 = new THREE.Mesh(step2Geo, step1Mat);
    step2.position.y = h + h * 0.25 + h * 0.1;
    step2.castShadow = true;
    group.add(step2);
  }

  // Cute windows (2x2 grid)
  const winColors = [0xadd8e6, 0xfffacd, 0xffd700, 0xe0f0ff];
  const winColor = winColors[Math.floor(Math.random() * winColors.length)];
  const winMat = new THREE.MeshStandardMaterial({ color: winColor, emissive: winColor, emissiveIntensity: 0.4, roughness: 0.2 });
  const rows = Math.max(1, Math.floor(h / 1.5));
  const cols = w > 2.5 ? 2 : 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const winGeo = new THREE.BoxGeometry(0.28, 0.32, 0.06);
      const win = new THREE.Mesh(winGeo, winMat);
      const xOff = cols === 2 ? (c === 0 ? -w*0.22 : w*0.22) : 0;
      win.position.set(xOff, 0.8 + r * 1.2, d / 2 + 0.03);
      group.add(win);
    }
  }

  // Door
  const doorGeo = new THREE.BoxGeometry(0.4, 0.65, 0.06);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.8 });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, 0.32, d / 2 + 0.03);
  group.add(door);

  // Tiny flower pot / bush at base
  if (Math.random() > 0.4) {
    const bushGeo = new THREE.SphereGeometry(0.22, 7, 7);
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.9 });
    const bush = new THREE.Mesh(bushGeo, bushMat);
    bush.position.set(w / 2 + 0.15, 0.22, d / 2 - 0.15);
    bush.scale.y = 0.75;
    group.add(bush);
  }

  // Chimney
  if (type === 1 && Math.random() > 0.5) {
    const chimGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 6);
    const chimMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 });
    const chim = new THREE.Mesh(chimGeo, chimMat);
    chim.position.set(w * 0.25, h + 0.3, d * 0.25);
    group.add(chim);
  }

  group.position.set(x, 0, z);
  group.rotation.y = Math.random() * Math.PI * 2;
  scene.add(group);

  // Register as collider — dùng nửa đường chéo của footprint làm radius
  const colRadius = Math.max(w, d) * 0.55;
  colliders.push({
    x, z,
    radius: colRadius,
    group,
    type: 'building',
    hitTimer: 0,
    hitDir: 0,
  });

  return group;
}

// --- Chibi tree ---
function createChibiTree(x, z, scale = 1) {
  const group = new THREE.Group();
  group.name = 'chibiTree_' + Math.random().toString(36).substr(2,5);

  const trunkGeo = new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, 0.9 * scale, 7);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.9 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 0.45 * scale;
  trunk.castShadow = true;
  group.add(trunk);

  // Fluffy layered canopy
  const leafColors = [0x66bb6a, 0x81c784, 0x4caf50, 0xa5d6a7, 0x388e3c];
  const lColor = leafColors[Math.floor(Math.random() * leafColors.length)];
  const leafMat = new THREE.MeshStandardMaterial({ color: lColor, roughness: 0.8 });
  [0, 1, 2].forEach((layer) => {
    const r = (1.0 - layer * 0.18) * scale;
    const y = (0.9 + layer * 0.6) * scale;
    const leafGeo = new THREE.SphereGeometry(r, 8, 6);
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.y = y;
    leaf.scale.y = 0.75;
    leaf.castShadow = true;
    group.add(leaf);
  });

  // Occasional fruit / flower
  if (Math.random() > 0.6) {
    const fruitColors = [0xff5722, 0xff9800, 0xe91e63, 0xffeb3b];
    const fruitMat = new THREE.MeshStandardMaterial({ color: fruitColors[Math.floor(Math.random()*4)], roughness: 0.6 });
    for (let f = 0; f < 3; f++) {
      const fruitGeo = new THREE.SphereGeometry(0.1 * scale, 6, 6);
      const fruit = new THREE.Mesh(fruitGeo, fruitMat);
      const a = (f / 3) * Math.PI * 2;
      fruit.position.set(Math.cos(a) * 0.7 * scale, (0.9 + 0.4) * scale, Math.sin(a) * 0.7 * scale);
      group.add(fruit);
    }
  }

  group.position.set(x, 0, z);
  scene.add(group);

  // Register as collider
  colliders.push({
    x, z,
    radius: 0.35 * scale,
    group,
    type: 'tree',
    // Hit animation state
    hitTimer: 0,
    hitDir: 0,
    origRotY: group.rotation.y,
  });

  return group;
}
// ============================================================
// INSTANCED CAT NPC SYSTEM — 7 draw calls cho tất cả mèo
// ============================================================
const CAT_COUNT = 8; // giảm từ 30 xuống 8, nhưng render nhanh hơn nhiều

// Shared geometries & materials (tái sử dụng cho tất cả instance)
const _catBodyGeo  = new THREE.SphereGeometry(0.22, 7, 5);
const _catHeadGeo  = new THREE.SphereGeometry(0.22, 7, 6);
const _catEarGeo   = new THREE.ConeGeometry(0.07, 0.13, 4);
const _catPawGeo   = new THREE.SphereGeometry(0.08, 5, 4);
const _catTailGeo  = new THREE.CylinderGeometry(0.03, 0.015, 0.4, 5);
const _catEyeGeo   = new THREE.SphereGeometry(0.032, 5, 5);
const _catNoseGeo  = new THREE.SphereGeometry(0.020, 4, 4);

const CAT_COLORS = [0xf5deb3, 0x999999, 0x333333, 0xff9966, 0xffffff, 0xc8a96e, 0x111111, 0xffccaa];

// Tạo 1 InstancedMesh per part — mỗi mesh = 1 draw call, tất cả instances cùng lúc
function makeInstanced(geo, mat, count) {
  const m = new THREE.InstancedMesh(geo, mat, count);
  m.castShadow = false; // tắt shadow cho NPC để giảm render cost
  m.frustumCulled = false;
  scene.add(m);
  return m;
}

// Mỗi màu mèo cần material riêng — dùng shared array
const _catMats = CAT_COLORS.map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 }));
const _eyeMat  = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });
const _noseMat = new THREE.MeshStandardMaterial({ color: 0xff9999, roughness: 0.5 });
const _earMat  = new THREE.MeshStandardMaterial({ color: 0xffcccc, roughness: 0.9 });

// Instanced meshes — 7 draw calls tổng
const iBody  = makeInstanced(_catBodyGeo, _catMats[0], CAT_COUNT); // sẽ setMatrixAt per cat
const iHead  = makeInstanced(_catHeadGeo, _catMats[0], CAT_COUNT);
const iEarL  = makeInstanced(_catEarGeo,  _catMats[0], CAT_COUNT);
const iEarR  = makeInstanced(_catEarGeo,  _catMats[0], CAT_COUNT);
const iPawL  = makeInstanced(_catPawGeo,  _catMats[0], CAT_COUNT);
const iPawR  = makeInstanced(_catPawGeo,  _catMats[0], CAT_COUNT);
const iTail  = makeInstanced(_catTailGeo, _catMats[0], CAT_COUNT);
// Eyes & nose share across all cats
const iEyeL  = makeInstanced(_catEyeGeo,  _eyeMat, CAT_COUNT);
const iEyeR  = makeInstanced(_catEyeGeo,  _eyeMat, CAT_COUNT);
const iNose  = makeInstanced(_catNoseGeo, _noseMat, CAT_COUNT);

// Per-instance color — set via instanceColor
iBody.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(CAT_COUNT * 3), 3);
iHead.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(CAT_COUNT * 3), 3);
iEarL.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(CAT_COUNT * 3), 3);
iEarR.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(CAT_COUNT * 3), 3);
iPawL.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(CAT_COUNT * 3), 3);
iPawR.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(CAT_COUNT * 3), 3);
iTail.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(CAT_COUNT * 3), 3);

const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

// Cat state array
const chibiPeople = [];

// Spawn cats
for (let i = 0; i < CAT_COUNT; i++) {
  let px, pz, tries = 0;
  do {
    const angle = Math.random() * Math.PI * 2;
    const r = 14 + Math.random() * 48;
    px = Math.cos(angle) * r;
    pz = Math.sin(angle) * r;
    tries++;
  } while (
    portfolioProjects.some(p => Math.hypot(px - p.position.x, pz - p.position.z) < 8)
    || Math.hypot(px, pz) < 8
    && tries < 20
  );

  const colorIdx = Math.floor(Math.random() * CAT_COLORS.length);
  _color.setHex(CAT_COLORS[colorIdx]);

  // Set instance color for all body parts
  [iBody, iHead, iEarL, iEarR, iPawL, iPawR, iTail].forEach(mesh => {
    mesh.setColorAt(i, _color);
  });

  chibiPeople.push({
    idx: i,
    x: px, z: pz,
    walkAngle: Math.random() * Math.PI * 2,
    walkRadius: 5 + Math.random() * 12,
    walkSpeed: 0.28 + Math.random() * 0.35,
    walkCenterX: px,
    walkCenterZ: pz,
    phase: Math.random() * Math.PI * 2,
    ry: Math.random() * Math.PI * 2, // heading
    fleeing: false,
    fleeVx: 0, fleeVz: 0,
    fleeTimer: 0,
    scaredTimer: 0,
    baseWalkSpeed: 0.28 + Math.random() * 0.35,
  });
}

// Flush instance colors
[iBody, iHead, iEarL, iEarR, iPawL, iPawR, iTail].forEach(m => {
  if (m.instanceColor) m.instanceColor.needsUpdate = true;
});

// Helper: set matrix for a cat part with local offset
function _setCatPart(mesh, idx, catX, catY, catZ, catRY, lx, ly, lz, sx=1, sy=1, sz=1, rx=0, rz=0) {
  _dummy.position.set(
    catX + Math.cos(catRY) * lx - Math.sin(catRY) * lz,
    catY + ly,
    catZ + Math.sin(catRY) * lx + Math.cos(catRY) * lz
  );
  _dummy.rotation.set(rx, catRY, rz);
  _dummy.scale.set(sx, sy, sz);
  _dummy.updateMatrix();
  mesh.setMatrixAt(idx, _dummy.matrix);
}
const cityRingPositions = [];
const cityRingCount = 28;
for (let i = 0; i < cityRingCount; i++) {
  const angle = (i / cityRingCount) * Math.PI * 2;
  const r = 78 + (Math.random() - 0.5) * 10;
  cityRingPositions.push({ x: Math.cos(angle) * r, z: Math.sin(angle) * r });
}
cityRingPositions.forEach(pos => {
  createChibiBuilding(pos.x, pos.z);
});

// Mid-ring city cluster (between project zones, radius ~52-60)
const midAngles = [Math.PI/6, Math.PI/2, 5*Math.PI/6, 7*Math.PI/6, 3*Math.PI/2, 11*Math.PI/6];
midAngles.forEach(angle => {
  const r = 54 + (Math.random() - 0.5) * 5;
  const cx = Math.cos(angle) * r;
  const cz = Math.sin(angle) * r;
  // Small cluster of 3-4 buildings
  for (let k = 0; k < 4; k++) {
    const ox = (Math.random() - 0.5) * 8;
    const oz = (Math.random() - 0.5) * 8;
    createChibiBuilding(cx + ox, cz + oz, {
      h: 1.8 + Math.random() * 2.5,
      w: 1.2 + Math.random() * 1.2,
      d: 1.2 + Math.random() * 1.2,
    });
  }
});

// Trees scattered around city
const treePositions = [];
for (let i = 0; i < 40; i++) {
  const angle = Math.random() * Math.PI * 2;
  const r = 10 + Math.random() * 60;
  // Avoid center hub and project zones
  const tx = Math.cos(angle) * r;
  const tz = Math.sin(angle) * r;
  let tooClose = false;
  portfolioProjects.forEach(p => {
    if (new THREE.Vector2(tx - p.position.x, tz - p.position.z).length() < 9) tooClose = true;
  });
  if (new THREE.Vector2(tx, tz).length() < 8) tooClose = true;
  if (!tooClose) createChibiTree(tx, tz, 0.7 + Math.random() * 0.6);
}
// Dense tree clusters near city ring
for (let i = 0; i < 25; i++) {
  const angle = Math.random() * Math.PI * 2;
  const r = 70 + Math.random() * 15;
  createChibiTree(Math.cos(angle) * r, Math.sin(angle) * r, 0.8 + Math.random() * 0.5);
}


// ============================================================
// Ambient particles (floating light specks)
const particleCount = 300;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleSizes = new Float32Array(particleCount);
for (let i = 0; i < particleCount; i++) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 120;
  particlePositions[i * 3 + 1] = 1 + Math.random() * 15;
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 120;
  particleSizes[i] = 0.5 + Math.random() * 1.5;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeo.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
const particleMat = new THREE.PointsMaterial({ color: 0x4488cc, size: 0.3, transparent: true, opacity: 0.4, sizeAttenuation: true });
const particles = new THREE.Points(particleGeo, particleMat);
particles.name = 'ambientParticles';
scene.add(particles);

// Boundary wall (subtle glow ring)
const boundaryGeo = new THREE.TorusGeometry(70, 0.3, 8, 64);
const boundaryMat = new THREE.MeshStandardMaterial({ color: 0x223355, emissive: 0x112244, emissiveIntensity: 0.5, transparent: true, opacity: 0.3 });
const boundary = new THREE.Mesh(boundaryGeo, boundaryMat);
boundary.name = 'boundaryRing';
boundary.rotation.x = Math.PI / 2;
boundary.position.y = 0.5;
scene.add(boundary);

// ============================================================
// --- PORSCHE 911 (detailed procedural model) ---
// ============================================================
const carGroup = new THREE.Group();
carGroup.name = 'carGroup';

// --- Materials ---
const paintMat = new THREE.MeshStandardMaterial({
  color: 0xcc0000,          // GT3 Guards Red
  roughness: 0.08,
  metalness: 0.92,
  envMapIntensity: 1.2,
});
const darkMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4, metalness: 0.5 });
const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.05, metalness: 1.0 });
const glassMat = new THREE.MeshStandardMaterial({ color: 0x99bbdd, roughness: 0.0, metalness: 0.1, transparent: true, opacity: 0.32 });
const rubberMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.95, metalness: 0.0 });
const rimMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.12, metalness: 0.95 });
const brakeDiscMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.6, metalness: 0.5 });
const brakeCalMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.4, metalness: 0.3, emissive: 0x220800 });
const interiorMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.1 });
const seatMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85 });
const ledMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.5, roughness: 0 });
const tailMat = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff1100, emissiveIntensity: 1.8, roughness: 0.1 });
const ambLightMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff3300, emissiveIntensity: 0.8, roughness: 0.3 });

// ── CHASSIS FLOOR ──
const floorGeo = new THREE.BoxGeometry(1.72, 0.08, 3.9);
const floor = new THREE.Mesh(floorGeo, darkMat);
floor.position.set(0, 0.19, -0.05);
floor.castShadow = true; floor.receiveShadow = true;
carGroup.add(floor);

// ── MAIN BODY — layered slabs to simulate curves ──
// Lower body sill (widest)
const sillGeo = new THREE.BoxGeometry(1.82, 0.22, 3.85);
const sill = new THREE.Mesh(sillGeo, paintMat);
sill.position.set(0, 0.30, -0.05);
sill.castShadow = true;
carGroup.add(sill);

// Mid body
const midGeo = new THREE.BoxGeometry(1.74, 0.28, 3.78);
const mid = new THREE.Mesh(midGeo, paintMat);
mid.position.set(0, 0.52, -0.05);
mid.castShadow = true;
carGroup.add(mid);

// Upper body waist
const waistGeo = new THREE.BoxGeometry(1.66, 0.18, 3.70);
const waist = new THREE.Mesh(waistGeo, paintMat);
waist.position.set(0, 0.68, -0.05);
waist.castShadow = true;
carGroup.add(waist);

// Front hood — sloped (flat then tapers)
const hoodGeo = new THREE.BoxGeometry(1.60, 0.10, 1.18);
const hood = new THREE.Mesh(hoodGeo, paintMat);
hood.position.set(0, 0.74, 1.32);
hood.rotation.x = 0.09;
hood.castShadow = true;
carGroup.add(hood);

// Front bumper lower
const fBumperGeo = new THREE.BoxGeometry(1.72, 0.28, 0.22);
const fBumper = new THREE.Mesh(fBumperGeo, paintMat);
fBumper.position.set(0, 0.38, 1.90);
fBumper.castShadow = true;
carGroup.add(fBumper);

// Front bumper splitter (carbon look)
const splitterGeo = new THREE.BoxGeometry(1.50, 0.04, 0.28);
const splitter = new THREE.Mesh(splitterGeo, darkMat);
splitter.position.set(0, 0.18, 1.95);
carGroup.add(splitter);

// Front air intakes (two)
[-0.48, 0.48].forEach(x => {
  const intakeGeo = new THREE.BoxGeometry(0.36, 0.13, 0.06);
  const intake = new THREE.Mesh(intakeGeo, darkMat);
  intake.position.set(x, 0.36, 1.96);
  carGroup.add(intake);
  // Intake grille lines
  for (let g = 0; g < 3; g++) {
    const grillGeo = new THREE.BoxGeometry(0.34, 0.014, 0.06);
    const grille = new THREE.Mesh(grillGeo, chromeMat);
    grille.position.set(x, 0.31 + g * 0.04, 1.97);
    carGroup.add(grille);
  }
});

// Center front lip vent
const lipGeo = new THREE.BoxGeometry(0.55, 0.10, 0.06);
const lip = new THREE.Mesh(lipGeo, darkMat);
lip.position.set(0, 0.33, 1.97);
carGroup.add(lip);

// Rear bumper
const rBumperGeo = new THREE.BoxGeometry(1.72, 0.30, 0.24);
const rBumper = new THREE.Mesh(rBumperGeo, paintMat);
rBumper.position.set(0, 0.38, -1.98);
rBumper.castShadow = true;
carGroup.add(rBumper);

// Rear diffuser (carbon)
const diffGeo = new THREE.BoxGeometry(1.50, 0.13, 0.35);
const diff = new THREE.Mesh(diffGeo, darkMat);
diff.position.set(0, 0.17, -1.88);
diff.rotation.x = -0.22;
carGroup.add(diff);
// Diffuser fins
for (let f = -2; f <= 2; f++) {
  const finGeo = new THREE.BoxGeometry(0.025, 0.12, 0.33);
  const fin = new THREE.Mesh(finGeo, darkMat);
  fin.position.set(f * 0.27, 0.17, -1.88);
  carGroup.add(fin);
}

// ── ROOF / CABIN ──
// Rear deck / engine lid
const deckGeo = new THREE.BoxGeometry(1.62, 0.10, 1.05);
const deck = new THREE.Mesh(deckGeo, paintMat);
deck.position.set(0, 0.76, -1.26);
deck.rotation.x = -0.06;
deck.castShadow = true;
carGroup.add(deck);

// Cabin shell (fastback silhouette)
// A-pillar base
const aPillarGeo = new THREE.BoxGeometry(1.60, 0.12, 0.68);
const aPillar = new THREE.Mesh(aPillarGeo, paintMat);
aPillar.position.set(0, 0.80, 0.72);
aPillar.rotation.x = -0.52;
aPillar.castShadow = true;
carGroup.add(aPillar);

// Roof panel
const roofGeo = new THREE.BoxGeometry(1.52, 0.10, 1.12);
const roof = new THREE.Mesh(roofGeo, paintMat);
roof.position.set(0, 1.16, 0.04);
roof.castShadow = true;
carGroup.add(roof);

// C-pillar / rear fastback slope
const cPillarGeo = new THREE.BoxGeometry(1.56, 0.10, 0.90);
const cPillar = new THREE.Mesh(cPillarGeo, paintMat);
cPillar.position.set(0, 0.95, -0.72);
cPillar.rotation.x = 0.48;
cPillar.castShadow = true;
carGroup.add(cPillar);

// Side A-pillars (left / right)
[-0.76, 0.76].forEach(x => {
  const apGeo = new THREE.BoxGeometry(0.06, 0.52, 0.10);
  const ap = new THREE.Mesh(apGeo, paintMat);
  ap.position.set(x, 0.95, 0.66);
  ap.rotation.x = -0.52;
  ap.castShadow = true;
  carGroup.add(ap);

  const bpGeo = new THREE.BoxGeometry(0.06, 0.48, 0.06);
  const bp = new THREE.Mesh(bpGeo, paintMat);
  bp.position.set(x, 1.16, 0.04);
  bp.castShadow = true;
  carGroup.add(bp);

  const cpGeo = new THREE.BoxGeometry(0.06, 0.42, 0.10);
  const cp = new THREE.Mesh(cpGeo, paintMat);
  cp.position.set(x, 0.97, -0.72);
  cp.rotation.x = 0.48;
  cp.castShadow = true;
  carGroup.add(cp);
});

// Windshield
const windGeo = new THREE.BoxGeometry(1.38, 0.54, 0.06);
const wind = new THREE.Mesh(windGeo, glassMat);
wind.position.set(0, 0.97, 0.67);
wind.rotation.x = -0.52;
carGroup.add(wind);

// Rear window
const rWinGeo = new THREE.BoxGeometry(1.32, 0.50, 0.06);
const rWin = new THREE.Mesh(rWinGeo, glassMat);
rWin.position.set(0, 0.97, -0.70);
rWin.rotation.x = 0.48;
carGroup.add(rWin);

// Side windows
[-0.792, 0.792].forEach((x, i) => {
  const sWinGeo = new THREE.BoxGeometry(0.04, 0.30, 0.75);
  const sWin = new THREE.Mesh(sWinGeo, glassMat);
  sWin.position.set(x, 1.04, 0.08);
  carGroup.add(sWin);

  // Quarter window rear
  const qWinGeo = new THREE.BoxGeometry(0.04, 0.22, 0.32);
  const qWin = new THREE.Mesh(qWinGeo, glassMat);
  qWin.position.set(x, 0.97, -0.46);
  qWin.rotation.x = 0.15;
  carGroup.add(qWin);
});

// ── WING / SPOILER (911 GT3 style duck-tail) ──
const wingBaseL = new THREE.BoxGeometry(0.06, 0.22, 0.22);
[-0.55, 0.55].forEach(x => {
  const wBase = new THREE.Mesh(wingBaseL, paintMat);
  wBase.position.set(x, 0.88, -1.70);
  wBase.castShadow = true;
  carGroup.add(wBase);
});
const wingPlaneGeo = new THREE.BoxGeometry(1.28, 0.06, 0.42);
const wingPlane = new THREE.Mesh(wingPlaneGeo, paintMat);
wingPlane.position.set(0, 1.00, -1.72);
wingPlane.rotation.x = 0.18;
wingPlane.castShadow = true;
carGroup.add(wingPlane);
// Wing underside gurney flap
const gurneyGeo = new THREE.BoxGeometry(1.28, 0.10, 0.025);
const gurney = new THREE.Mesh(gurneyGeo, darkMat);
gurney.position.set(0, 0.95, -1.93);
carGroup.add(gurney);

// ── DOOR HANDLES ──
[-0.88, 0.88].forEach(x => {
  const handleGeo = new THREE.BoxGeometry(0.04, 0.04, 0.22);
  const handle = new THREE.Mesh(handleGeo, chromeMat);
  handle.position.set(x, 0.82, 0.10);
  carGroup.add(handle);
});

// ── SIDE MIRRORS ──
[-0.87, 0.87].forEach((x, i) => {
  const mirrorArmGeo = new THREE.BoxGeometry(0.05, 0.05, 0.20);
  const mirrorArm = new THREE.Mesh(mirrorArmGeo, paintMat);
  mirrorArm.position.set(x * 1.02, 1.00, 0.52);
  mirrorArm.rotation.z = (i === 0 ? 0.3 : -0.3);
  carGroup.add(mirrorArm);

  const mirrorHeadGeo = new THREE.BoxGeometry(0.06, 0.12, 0.22);
  const mirrorHead = new THREE.Mesh(mirrorHeadGeo, paintMat);
  mirrorHead.position.set(x * 1.06, 1.04, 0.60);
  mirrorHead.castShadow = true;
  carGroup.add(mirrorHead);

  const mirrorGlassGeo = new THREE.BoxGeometry(0.015, 0.10, 0.18);
  const mirrorGlass = new THREE.Mesh(mirrorGlassGeo, glassMat);
  mirrorGlass.position.set(x * 1.065, 1.04, 0.60);
  carGroup.add(mirrorGlass);
});

// ── INTERIOR (visible through glass) ──
const dashGeo = new THREE.BoxGeometry(1.30, 0.15, 0.38);
const dash = new THREE.Mesh(dashGeo, interiorMat);
dash.position.set(0, 0.80, 0.50);
carGroup.add(dash);

// Steering wheel
const steerRimGeo = new THREE.TorusGeometry(0.155, 0.022, 8, 24);
const steer = new THREE.Mesh(steerRimGeo, darkMat);
steer.position.set(-0.22, 0.87, 0.44);
steer.rotation.x = -0.55;
carGroup.add(steer);
// Steering spokes
for (let s = 0; s < 3; s++) {
  const spokeGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.28, 6);
  const spoke = new THREE.Mesh(spokeGeo, chromeMat);
  spoke.rotation.z = (s / 3) * Math.PI * 2;
  spoke.position.set(-0.22, 0.87, 0.44);
  spoke.rotation.x = -0.55;
  steer.add(spoke);
}

// Seats (two buckets)
[-0.32, 0.32].forEach(x => {
  const seatBaseGeo = new THREE.BoxGeometry(0.42, 0.10, 0.48);
  const seatBase = new THREE.Mesh(seatBaseGeo, seatMat);
  seatBase.position.set(x, 0.70, -0.05);
  carGroup.add(seatBase);

  const seatBackGeo = new THREE.BoxGeometry(0.40, 0.50, 0.08);
  const seatBack = new THREE.Mesh(seatBackGeo, seatMat);
  seatBack.position.set(x, 0.95, -0.28);
  seatBack.rotation.x = 0.10;
  carGroup.add(seatBack);
});

// Center console
const consoleGeo = new THREE.BoxGeometry(0.20, 0.14, 0.60);
const console3D = new THREE.Mesh(consoleGeo, interiorMat);
console3D.position.set(0, 0.72, -0.05);
carGroup.add(console3D);

// ── HEADLIGHTS (round Porsche style + DRL strip) ──
[-0.58, 0.58].forEach((x, i) => {
  // Outer housing
  const hHouseGeo = new THREE.CylinderGeometry(0.175, 0.175, 0.10, 20);
  const hHouse = new THREE.Mesh(hHouseGeo, darkMat);
  hHouse.rotation.x = Math.PI / 2;
  hHouse.position.set(x, 0.60, 1.90);
  carGroup.add(hHouse);

  // Main lens
  const hLensGeo = new THREE.CylinderGeometry(0.155, 0.155, 0.04, 20);
  const hLens = new THREE.Mesh(hLensGeo, glassMat);
  hLens.rotation.x = Math.PI / 2;
  hLens.position.set(x, 0.60, 1.94);
  carGroup.add(hLens);

  // Inner projector bowl
  const projGeo = new THREE.SphereGeometry(0.10, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6);
  const projMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.15, metalness: 0.9 });
  const proj = new THREE.Mesh(projGeo, projMat);
  proj.position.set(x, 0.60, 1.92);
  proj.rotation.x = Math.PI / 2;
  carGroup.add(proj);

  // LED projector dot
  const dotGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const dot = new THREE.Mesh(dotGeo, ledMat);
  dot.position.set(x, 0.60, 1.95);
  dot.name = 'headlightDot_' + i;
  carGroup.add(dot);

  // DRL ring (4-point LED strip)
  const drlGeo = new THREE.TorusGeometry(0.135, 0.014, 6, 20);
  const drl = new THREE.Mesh(drlGeo, ledMat);
  drl.rotation.x = Math.PI / 2;
  drl.position.set(x, 0.60, 1.95);
  carGroup.add(drl);
});

// DRL connecting strip across front
const drlBarGeo = new THREE.BoxGeometry(0.38, 0.018, 0.025);
const drlBar = new THREE.Mesh(drlBarGeo, ledMat);
drlBar.position.set(0, 0.62, 1.96);
carGroup.add(drlBar);

// ── TAILLIGHTS (full-width LED bar — 911 signature) ──
const tailBarGeo = new THREE.BoxGeometry(1.50, 0.045, 0.025);
const tailBar = new THREE.Mesh(tailBarGeo, tailMat);
tailBar.position.set(0, 0.68, -1.985);
tailBar.name = 'tailBar';
carGroup.add(tailBar);

// Tail light clusters
[-0.58, 0.58].forEach((x, i) => {
  const tlGeo = new THREE.BoxGeometry(0.32, 0.12, 0.04);
  const tl = new THREE.Mesh(tlGeo, tailMat);
  tl.name = 'taillight_' + i;
  tl.position.set(x, 0.62, -1.985);
  carGroup.add(tl);

  // Reverse light
  const rvGeo = new THREE.BoxGeometry(0.10, 0.07, 0.03);
  const rvMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });
  const rv = new THREE.Mesh(rvGeo, rvMat);
  rv.position.set(x * 0.6, 0.55, -1.986);
  carGroup.add(rv);
});

// Porsche badge (rear)
const badgeGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.015, 16);
const badgeMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.1, metalness: 0.9 });
const badge = new THREE.Mesh(badgeGeo, badgeMat);
badge.rotation.x = Math.PI / 2;
badge.position.set(0, 0.72, -1.99);
carGroup.add(badge);

// Exhaust pipes (twin round — GT3 style)
[-0.38, 0.38].forEach((x, i) => {
  const exhGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.12, 12);
  const exhMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.2, metalness: 0.95 });
  const exh = new THREE.Mesh(exhGeo, exhMat);
  exh.rotation.x = Math.PI / 2;
  exh.position.set(x, 0.28, -2.01);
  exh.castShadow = true;
  carGroup.add(exh);

  // Inner exhaust dark
  const innerGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.10, 12);
  const inner = new THREE.Mesh(innerGeo, darkMat);
  inner.rotation.x = Math.PI / 2;
  inner.position.set(x, 0.28, -2.02);
  carGroup.add(inner);
});

// ── WHEELS (Porsche 5-spoke split design) ──
function createPorscheWheel(posX, posY, posZ, idx) {
  // wGroup: positioned + oriented at wheel location (no rotation baked)
  const wGroup = new THREE.Group();
  wGroup.name = 'wheel_' + idx;
  wGroup.position.set(posX, posY, posZ);

  const orientGroup = new THREE.Group();
  orientGroup.rotation.z = Math.PI / 2;
  wGroup.add(orientGroup);
  const spinGroup = new THREE.Group();
  spinGroup.name = 'wheelSpin_' + idx;
  orientGroup.add(spinGroup);

  // Tyre
  const tyreGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 28);
  const tyre = new THREE.Mesh(tyreGeo, rubberMat);
  tyre.castShadow = true;
  spinGroup.add(tyre);

  // Tyre sidewall rings
  [0.095, -0.095].forEach(y => {
    const sidewallGeo = new THREE.TorusGeometry(0.30, 0.018, 6, 28);
    const sidewall = new THREE.Mesh(sidewallGeo, rubberMat);
    sidewall.rotation.x = Math.PI / 2;
    sidewall.position.y = y;
    spinGroup.add(sidewall);
  });

  // Brake disc (spins with wheel)
  const discGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 24);
  const disc = new THREE.Mesh(discGeo, brakeDiscMat);
  spinGroup.add(disc);
  for (let v = 0; v < 8; v++) {
    const slotGeo = new THREE.BoxGeometry(0.030, 0.045, 0.16);
    const slot = new THREE.Mesh(slotGeo, darkMat);
    const a = (v / 8) * Math.PI * 2;
    slot.rotation.y = a;
    slot.position.set(Math.cos(a) * 0.14, 0, Math.sin(a) * 0.14);
    disc.add(slot);
  }

  // Rim face
  const rimFaceGeo = new THREE.CylinderGeometry(0.205, 0.205, 0.025, 20);
  const rimFace = new THREE.Mesh(rimFaceGeo, rimMat);
  rimFace.position.y = 0.095;
  spinGroup.add(rimFace);

  // 5 split-spokes
  for (let s = 0; s < 5; s++) {
    const angle = (s / 5) * Math.PI * 2;
    [-0.018, 0.018].forEach(offset => {
      const spokeGeo = new THREE.BoxGeometry(0.045, 0.075, 0.175);
      const spoke = new THREE.Mesh(spokeGeo, rimMat);
      const sr = 0.10;
      spoke.position.set(Math.cos(angle + offset) * sr, 0.095, Math.sin(angle + offset) * sr);
      spoke.rotation.y = -angle;
      spoke.castShadow = true;
      spinGroup.add(spoke);
    });
  }

  // Rim outer barrel
  const barrelGeo = new THREE.CylinderGeometry(0.215, 0.215, 0.205, 24, 1, true);
  const barrel = new THREE.Mesh(barrelGeo, rimMat);
  spinGroup.add(barrel);

  // Centre cap
  const capGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.030, 12);
  const capMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.1, metalness: 0.8 });
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.position.y = 0.105;
  spinGroup.add(cap);

  // staticGroup: brake caliper — does NOT spin
  const staticGroup = new THREE.Group();
  staticGroup.rotation.z = Math.PI / 2;  // match orientation
  wGroup.add(staticGroup);

  const calGeo = new THREE.BoxGeometry(0.12, 0.13, 0.10);
  const cal = new THREE.Mesh(calGeo, brakeCalMat);
  cal.position.set(0.20, 0.04, 0);
  staticGroup.add(cal);
  [0.035, -0.035].forEach(cz => {
    const boltGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.11, 6);
    const bolt = new THREE.Mesh(boltGeo, chromeMat);
    bolt.rotation.z = Math.PI / 2;
    bolt.position.set(0.20, 0.04, cz);
    staticGroup.add(bolt);
  });

  carGroup.add(wGroup);
  return wGroup;
}

// FL, FR, RL, RR
createPorscheWheel(-0.92, 0.32, 1.12, 0);
createPorscheWheel( 0.92, 0.32, 1.12, 1);
createPorscheWheel(-0.92, 0.32,-1.08, 2);
createPorscheWheel( 0.92, 0.32,-1.08, 3);

// ══════════════════════════════════════════════════════════════
// ── HEADLIGHT SYSTEM — Cinematic Night Lighting ──
// ══════════════════════════════════════════════════════════════

// Helper: create one full headlight unit (spot + cone + ground pool)
function makeHeadlightUnit(xOffset) {
  const side = xOffset < 0 ? 'L' : 'R';

  // ── 1. PRIMARY SPOT — narrow long-throw beam ──
  const primary = new THREE.SpotLight(0xe8f0ff, 0, 50, Math.PI / 13, 0.15, 1.5);
  primary.name = 'hlPrimary_' + side;
  primary.position.set(xOffset, 0.60, 1.90);  // local to carGroup
  primary.castShadow = true;
  primary.shadow.mapSize.set(256, 256);
  primary.shadow.camera.near = 0.3;
  primary.shadow.camera.far  = 50;
  primary.shadow.bias = -0.002;
  // Target lives in SCENE (not carGroup) — updated every frame in updateHeadlights
  const primaryTarget = new THREE.Object3D();
  primaryTarget.name = 'hlPrimaryTarget_' + side;
  scene.add(primaryTarget);
  primary.target = primaryTarget;
  carGroup.add(primary);

  // ── 2. WIDE FILL — soft near-road spill ──
  const fill = new THREE.SpotLight(0xd0dfff, 0, 12, Math.PI / 5, 0.6, 2.0);
  fill.name = 'hlFill_' + side;
  fill.position.set(xOffset, 0.55, 1.85);
  const fillTarget = new THREE.Object3D();
  fillTarget.name = 'hlFillTarget_' + side;
  scene.add(fillTarget);
  fill.target = fillTarget;
  carGroup.add(fill);

  // ── 3. VOLUMETRIC CONE — small subtle glow at lens, not a giant beam ──
  const coneH = 5;
  const coneR = 0.55;
  const coneGeo = new THREE.ConeGeometry(coneR, coneH, 12, 1, true);
  const coneMat = new THREE.MeshBasicMaterial({
    color: 0xddeeff,
    transparent: true,
    opacity: 0,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.name = 'hlCone_' + side;
  cone.rotation.x = -Math.PI / 2 + 0.10;
  cone.position.set(xOffset, 0.58, 1.90 + coneH / 2);
  carGroup.add(cone);

  return { primary, primaryTarget, fill, fillTarget, coneMat, xOffset };
}

const _HL_L = makeHeadlightUnit(-0.58);
const _HL_R = makeHeadlightUnit( 0.58);

// Convenience array for bulk updates
const _headlightUnits = [_HL_L, _HL_R];

carGroup.position.set(0, 0, 10);
scene.add(carGroup);

// ══════════════════════════════════════════════════════════════
// ── TIRE SKID MARKS ──
// ══════════════════════════════════════════════════════════════
const SKID_MAX_SEGMENTS = 1200;   // total mark segments in pool
const SKID_SEGMENT_LEN  = 0.28;   // length per segment (world units)
const SKID_WIDTH        = 0.18;   // tire width

// Four tire world offsets relative to car (FL, FR, RL, RR)
// Only rear wheels skid (realistic); all 4 during emergency brake
const TIRE_OFFSETS = [
  { x: -0.68, z:  1.05, rear: false },  // FL
  { x:  0.68, z:  1.05, rear: false },  // FR
  { x: -0.68, z: -1.08, rear: true  },  // RL
  { x:  0.68, z: -1.08, rear: true  },  // RR
];

// Each mark segment = a thin quad (two triangles) on the ground
// We use a single BufferGeometry with dynamic updates for performance
const _skidPositions = new Float32Array(SKID_MAX_SEGMENTS * 4 * 3); // 4 verts per seg
const _skidUVs       = new Float32Array(SKID_MAX_SEGMENTS * 4 * 2);
const _skidAlphas    = new Float32Array(SKID_MAX_SEGMENTS * 4);     // per-vertex alpha
const _skidIndex     = new Uint32Array(SKID_MAX_SEGMENTS * 6);      // 2 tris per seg

// Pre-fill index buffer (never changes)
for (let i = 0; i < SKID_MAX_SEGMENTS; i++) {
  const v = i * 4;
  const ii = i * 6;
  _skidIndex[ii]   = v;     _skidIndex[ii+1] = v+1; _skidIndex[ii+2] = v+2;
  _skidIndex[ii+3] = v+2;   _skidIndex[ii+4] = v+1; _skidIndex[ii+5] = v+3;
}

const _skidGeo = new THREE.BufferGeometry();
_skidGeo.setAttribute('position', new THREE.BufferAttribute(_skidPositions, 3));
_skidGeo.setAttribute('uv',       new THREE.BufferAttribute(_skidUVs,       2));
_skidGeo.setAttribute('alpha',    new THREE.BufferAttribute(_skidAlphas,    1));
_skidGeo.setIndex(new THREE.BufferAttribute(_skidIndex, 1));

const _skidMat = new THREE.ShaderMaterial({
  uniforms: {},
  vertexShader: `
    attribute float alpha;
    varying float vAlpha;
    void main() {
      vAlpha = alpha;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    void main() {
      gl_FragColor = vec4(0.04, 0.03, 0.03, vAlpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
});

const _skidMesh = new THREE.Mesh(_skidGeo, _skidMat);
_skidMesh.name = 'skidMarks';
_skidMesh.renderOrder = 1;
_skidMesh.receiveShadow = false;
_skidMesh.frustumCulled = false; // always render — avoids computeBoundingSphere cost
scene.add(_skidMesh);

// Ring-buffer cursor
let _skidCursor = 0;

// Per-tire state — tracks previous position for continuity
const _tireState = TIRE_OFFSETS.map(() => ({
  prevX: null, prevZ: null,
  skidding: false,
}));

// Drift state
const driftState = {
  active: false,
  angle: 0,       // extra yaw offset during drift
  slideVX: 0,     // lateral slide velocity
  slideVZ: 0,
};

function _writeTireSegment(x0, z0, x1, z1, alpha, perpX, perpZ) {
  // Writes one quad segment between (x0,z0) and (x1,z1) with given half-width perp
  const hw = SKID_WIDTH * 0.5;
  const v  = _skidCursor * 4;
  const y  = 0.012; // just above ground

  _skidPositions[v*3+0] = x0 - perpX*hw; _skidPositions[v*3+1] = y; _skidPositions[v*3+2] = z0 - perpZ*hw;
  _skidPositions[v*3+3] = x0 + perpX*hw; _skidPositions[v*3+4] = y; _skidPositions[v*3+5] = z0 + perpZ*hw;
  _skidPositions[v*3+6] = x1 - perpX*hw; _skidPositions[v*3+7] = y; _skidPositions[v*3+8] = z1 - perpZ*hw;
  _skidPositions[v*3+9] = x1 + perpX*hw; _skidPositions[v*3+10]= y; _skidPositions[v*3+11]= z1 + perpZ*hw;

  _skidAlphas[v]   = 0;     // leading edge fades in
  _skidAlphas[v+1] = 0;
  _skidAlphas[v+2] = alpha;
  _skidAlphas[v+3] = alpha;

  // Clear old segment at cursor+1 (fade out oldest)
  const nextV = ((_skidCursor + 1) % SKID_MAX_SEGMENTS) * 4;
  _skidAlphas[nextV]=0; _skidAlphas[nextV+1]=0; _skidAlphas[nextV+2]=0; _skidAlphas[nextV+3]=0;

  _skidCursor = (_skidCursor + 1) % SKID_MAX_SEGMENTS;
}

function updateSkidMarks(dt) {
  const speed     = carState.speed;
  const absSpeed  = Math.abs(speed);
  const heading   = carState.heading;
  const brake     = keys.space;
  const turning   = Math.abs(carState.turnSpeed);
  const drifting  = driftState.active;

  // Skid conditions — raised threshold so casual turns don't trigger buffer updates
  const hardBrake  = brake && absSpeed > 0.06;
  const sharpTurn  = turning > 0.032 && absSpeed > 0.18; // was 0.022 / 0.12 — tighter threshold
  const isDrifting = drifting && absSpeed > 0.04;
  const shouldSkid = hardBrake || sharpTurn || isDrifting;
  // 🔊 Drift sound — chỉ play khi bắt đầu skid, không lặp liên tục
  if (shouldSkid && !updateSkidMarks._wasSkidding) playSound('drift');
  updateSkidMarks._wasSkidding = shouldSkid;

  // Heading vectors
  const fwdX = Math.sin(heading), fwdZ = Math.cos(heading);
  const rgtX = Math.cos(heading), rgtZ = -Math.sin(heading);

  // Intensity: 0..1
  let intensity = 0;
  if (hardBrake)  intensity = Math.max(intensity, Math.min(1, absSpeed / carState.maxSpeed * 1.5));
  if (sharpTurn)  intensity = Math.max(intensity, Math.min(1, (turning - 0.022) / 0.013));
  if (isDrifting) intensity = Math.max(intensity, 0.85);

  let anyDirty = false;

  TIRE_OFFSETS.forEach((tire, ti) => {
    const ts = _tireState[ti];

    // Rear-only for turn skid; all 4 for brake; all 4 for drift
    const activeForThis = isDrifting
      ? true
      : hardBrake ? true : (sharpTurn && tire.rear);

    if (!shouldSkid || !activeForThis) {
      ts.prevX = null; ts.prevZ = null;
      ts.skidding = false;
      return;
    }

    // World position of this tire
    const wx = carState.position.x + rgtX * tire.x + fwdX * tire.z;
    const wz = carState.position.z + rgtZ * tire.x + fwdZ * tire.z;

    if (ts.prevX !== null) {
      const segDx = wx - ts.prevX;
      const segDz = wz - ts.prevZ;
      const segLen = Math.sqrt(segDx*segDx + segDz*segDz);

      if (segLen > 0.05) {
        // Perpendicular to travel direction = tire width axis
        const nx = -segDz / segLen;
        const nz =  segDx / segLen;
        _writeTireSegment(ts.prevX, ts.prevZ, wx, wz, intensity * 0.82, nx, nz);
        anyDirty = true;
        ts.prevX = wx;
        ts.prevZ = wz;
      }
    } else {
      ts.prevX = wx;
      ts.prevZ = wz;
    }
    ts.skidding = true;
  });

  if (anyDirty) {
    _skidGeo.attributes.position.needsUpdate = true;
    _skidGeo.attributes.alpha.needsUpdate    = true;
    // No computeBoundingSphere — frustumCulled=false handles visibility
  }
}

// ── DRIFT PHYSICS ──
function updateDrift(dt) {
  const brake    = keys.space;
  const left     = keys.a || keys.left;
  const right    = keys.d || keys.right;
  const absSpeed = Math.abs(carState.speed);
  const turning  = carState.turnSpeed;

  // Enter drift: space + turning + speed
  if (brake && Math.abs(turning) > 0.008 && absSpeed > 0.10) {
    driftState.active = true;
  }
  // Exit drift: release space or stopped
  if (!brake || absSpeed < 0.03) {
    driftState.active = false;
    // Decay slide
    driftState.slideVX *= 0.88;
    driftState.slideVZ *= 0.88;
  }

  if (driftState.active) {
    const heading = carState.heading;
    // Lateral velocity (perpendicular to heading)
    const rgtX = Math.cos(heading);
    const rgtZ = -Math.sin(heading);
    const slideForce = turning * absSpeed * 1.8;

    driftState.slideVX += rgtX * slideForce;
    driftState.slideVZ += rgtZ * slideForce;
    // Cap slide speed
    const slideMag = Math.sqrt(driftState.slideVX**2 + driftState.slideVZ**2);
    if (slideMag > 0.18) {
      driftState.slideVX = driftState.slideVX / slideMag * 0.18;
      driftState.slideVZ = driftState.slideVZ / slideMag * 0.18;
    }
    // Decay
    driftState.slideVX *= 0.82;
    driftState.slideVZ *= 0.82;

    // Apply lateral slide to position
    carState.position.x += driftState.slideVX;
    carState.position.z += driftState.slideVZ;

    // Amplify turn during drift (oversteering feel)
    carState.heading += turning * 0.55 * dt * 60;

    // Reduce forward speed slightly (energy goes to slide)
    carState.speed *= 0.975;

    // Tyre smoke: reuse skid system — mark already written in updateSkidMarks
  } else {
    driftState.slideVX *= 0.75;
    driftState.slideVZ *= 0.75;
    if (Math.abs(driftState.slideVX) > 0.002 || Math.abs(driftState.slideVZ) > 0.002) {
      carState.position.x += driftState.slideVX;
      carState.position.z += driftState.slideVZ;
    }
  }

  // Visual: extra body lean during drift
  if (driftState.active) {
    const targetLean = -Math.sign(carState.turnSpeed) * 0.12;
    carGroup.rotation.z = THREE.MathUtils.lerp(carGroup.rotation.z, targetLean, 0.18);
  }
}

// --- CAR PHYSICS ---
const carState = {
  speed: 0,
  maxSpeed: 0.45,        // faster top speed
  acceleration: 0.016,   // 2x faster acceleration
  brakeForce: 0.028,     // 2x faster braking
  friction: 0.006,       // quicker stop when no key held
  turnSpeed: 0,
  maxTurnSpeed: 0.045,   // snappier turning
  turnAcceleration: 0.006, // faster turn response
  turnFriction: 0.004,   // quicker turn settle
  heading: 0,
  position: new THREE.Vector3(0, 0, 10),
  wheelRotation: 0
};

// Car hit feedback state
const carHitState = {
  shakeTimer: 0,
  shakeMag: 0,
};

// --- COLLISION HELPERS ---
function resolveCollider(collider, dt) {
  const cdx = carState.position.x - collider.x;
  const cdz = carState.position.z - collider.z;
  const dist = Math.sqrt(cdx * cdx + cdz * cdz);
  const minDist = collider.radius + 1.1; // 1.1 = half car width approx

  if (dist < minDist && dist > 0.001) {
    // Push car out
    const nx = cdx / dist;
    const nz = cdz / dist;
    carState.position.x = collider.x + nx * minDist;
    carState.position.z = collider.z + nz * minDist;

    // Impact force proportional to speed
    const impact = Math.abs(carState.speed);
    carState.speed *= -0.25;

    // Car shake feedback
    carHitState.shakeTimer = 0.35;
    carHitState.shakeMag = Math.min(impact * 8, 0.18);

    // Trigger object hit animation
    collider.hitTimer = 0.6;
    collider.hitDir = Math.atan2(-cdz, -cdx);
    playSound('hit'); // 🔊 âm thanh va chạm

    // Hard hit knocks lamp post permanently
    if (collider.type === 'lamp' && impact > 0.15) {
      collider.knocked = true;
    }
  }
}

function animateColliders(dt, elapsed) {
  const doIdleSway = (animate._fCnt % 3 === 0); // idle sway only 3rd frame
  colliders.forEach(col => {
    if (col.hitTimer > 0) {
      col.hitTimer -= dt;
      const t = Math.max(0, col.hitTimer / 0.6);
      const wobble = Math.sin(elapsed * 20) * t;

      if (col.type === 'tree') {
        col.group.rotation.x = Math.sin(col.hitDir) * wobble * 0.18;
        col.group.rotation.z = Math.cos(col.hitDir) * wobble * 0.18;
        if (col.hitTimer <= 0) { col.group.rotation.x = 0; col.group.rotation.z = 0; }
      } else if (col.type === 'building') {
        col.group.position.x = col.x + Math.sin(col.hitDir) * wobble * 0.06;
        col.group.position.z = col.z + Math.cos(col.hitDir) * wobble * 0.06;
        if (col.hitTimer <= 0) { col.group.position.x = col.x; col.group.position.z = col.z; }
      } else if (col.type === 'lamp') {
        if (col.knocked) {
          col.group.rotation.x = THREE.MathUtils.lerp(col.group.rotation.x, Math.cos(col.hitDir + Math.PI/2) * 0.45, 0.1);
          col.group.rotation.z = THREE.MathUtils.lerp(col.group.rotation.z, Math.sin(col.hitDir + Math.PI/2) * 0.45, 0.1);
          if (!col._lampLight) col._lampLight = col.group.children.find(c => c.isLight);
          if (col._lampLight) col._lampLight.intensity = Math.random() > 0.3 ? 0.5 : 0;
        } else {
          col.group.rotation.x = Math.cos(col.hitDir + Math.PI/2) * wobble * 0.25;
          col.group.rotation.z = Math.sin(col.hitDir + Math.PI/2) * wobble * 0.25;
          if (col.hitTimer <= 0) {
            col.group.rotation.x = THREE.MathUtils.lerp(col.group.rotation.x, 0, 0.2);
            col.group.rotation.z = THREE.MathUtils.lerp(col.group.rotation.z, 0, 0.2);
          }
        }
      }
    } else if (col.type === 'tree' && doIdleSway) {
      // Gentle idle sway — throttled, precomputed per-tree offset baked into col.x/z
      col.group.rotation.x = Math.sin(elapsed * 0.7 + col.x) * 0.015;
      col.group.rotation.z = Math.cos(elapsed * 0.5 + col.z) * 0.012;
    }
  });
}
const keys = {
  w: false, a: false, s: false, d: false,
  up: false, down: false, left: false, right: false,
  space: false
};

window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'w' || key === 'arrowup') { keys.w = true; e.preventDefault(); }
  if (key === 's' || key === 'arrowdown') { keys.s = true; e.preventDefault(); }
  if (key === 'a' || key === 'arrowleft') { keys.a = true; e.preventDefault(); }
  if (key === 'd' || key === 'arrowright') { keys.d = true; e.preventDefault(); }
  if (key === ' ') { keys.space = true; e.preventDefault(); }
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'w' || key === 'arrowup') keys.w = false;
  if (key === 's' || key === 'arrowdown') keys.s = false;
  if (key === 'a' || key === 'arrowleft') keys.a = false;
  if (key === 'd' || key === 'arrowright') keys.d = false;
  if (key === ' ') keys.space = false;
});

// Mouse orbit — left drag to orbit, scroll to zoom, right-click drag for height
let cameraAngleOffset = 0;
let cameraHeightOffset = 0;
let isMouseDown = false;
let isRightDown  = false;
renderer.domElement.addEventListener('mousedown', (e) => {
  if (e.button === 0) isMouseDown = true;
  if (e.button === 2) isRightDown  = true;
});
renderer.domElement.addEventListener('mouseup', (e) => {
  if (e.button === 0) isMouseDown = false;
  if (e.button === 2) isRightDown  = false;
});
renderer.domElement.addEventListener('mousemove', (e) => {
  if (isMouseDown || isRightDown) {
    cameraAngleOffset -= e.movementX * 0.005;
    cameraHeightOffset = Math.max(-2, Math.min(5, cameraHeightOffset + e.movementY * 0.02));
  }
});
// Touch orbit
let _touchPrev = null;
renderer.domElement.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) _touchPrev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });
renderer.domElement.addEventListener('touchmove', (e) => {
  if (e.touches.length === 1 && _touchPrev) {
    const dx = e.touches[0].clientX - _touchPrev.x;
    const dy = e.touches[0].clientY - _touchPrev.y;
    cameraAngleOffset -= dx * 0.007;
    cameraHeightOffset = Math.max(-2, Math.min(5, cameraHeightOffset + dy * 0.025));
    _touchPrev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
}, { passive: true });
renderer.domElement.addEventListener('touchend', () => { _touchPrev = null; }, { passive: true });
renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

// --- UI ---
const uiContainer = document.createElement('div');
uiContainer.id = 'portfolio-ui';
uiContainer.innerHTML = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    #portfolio-ui * {
      box-sizing: border-box;
      font-family: 'Inter', sans-serif;
    }

    #hud-top {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 20px;
      background: rgba(10, 10, 26, 0.85);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      backdrop-filter: blur(12px);
      z-index: 100;
    }

    #hud-top .name {
      font-size: 13px;
      font-weight: 600;
      color: #e0e0e0;
      letter-spacing: 0.5px;
    }

    #hud-top .divider {
      width: 1px;
      height: 16px;
      background: rgba(255,255,255,0.12);
    }

    #hud-top .subtitle {
      font-size: 11px;
      font-weight: 400;
      color: rgba(255,255,255,0.45);
    }

    #speed-hud {
      position: fixed;
      bottom: 20px;
      left: 20px;
      padding: 12px 18px;
      background: rgba(10, 10, 26, 0.85);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      backdrop-filter: blur(12px);
      z-index: 100;
    }

    #speed-hud .speed-val {
      font-size: 28px;
      font-weight: 700;
      color: #e0e0e0;
      line-height: 1;
    }

    #speed-hud .speed-unit {
      font-size: 10px;
      font-weight: 400;
      color: rgba(255,255,255,0.4);
      margin-left: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    #speed-bar {
      margin-top: 8px;
      width: 120px;
      height: 3px;
      background: rgba(255,255,255,0.08);
      border-radius: 2px;
      overflow: hidden;
    }

    #speed-bar-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #00e5ff, #ff6b9d);
      border-radius: 2px;
      transition: width 0.1s;
    }

    #controls-hint {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 16px;
      background: rgba(10, 10, 26, 0.85);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      backdrop-filter: blur(12px);
      z-index: 100;
      font-size: 10px;
      color: rgba(255,255,255,0.4);
      line-height: 1.8;
    }

    .key-badge {
      display: inline-block;
      padding: 1px 6px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 4px;
      font-size: 10px;
      font-weight: 500;
      color: rgba(255,255,255,0.6);
      margin: 0 2px;
    }

    #project-panel {
      position: fixed;
      top: 50%;
      right: 24px;
      transform: translateY(-50%) translateX(20px);
      width: 340px;
      max-height: 80vh;
      padding: 28px;
      background: rgba(10, 10, 26, 0.92);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      backdrop-filter: blur(16px);
      z-index: 200;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease, transform 0.4s ease;
      overflow-y: auto;
    }

    #project-panel.active {
      opacity: 1;
      pointer-events: all;
      transform: translateY(-50%) translateX(0);
    }

    #project-panel .proj-category {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #00e5ff;
      margin-bottom: 8px;
    }

    #project-panel .proj-title {
      font-size: 22px;
      font-weight: 700;
      color: #e8e8e8;
      margin-bottom: 14px;
      line-height: 1.2;
    }

    #project-panel .proj-desc {
      font-size: 13px;
      font-weight: 300;
      color: rgba(255,255,255,0.55);
      line-height: 1.65;
      margin-bottom: 20px;
    }

    #project-panel .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 20px;
    }

    #project-panel .tech-tag {
      padding: 4px 10px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      font-size: 11px;
      font-weight: 400;
      color: rgba(255,255,255,0.6);
    }

    #project-panel .proj-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      color: #e0e0e0;
      font-size: 12px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }

    #project-panel .proj-link:hover {
      background: rgba(255,255,255,0.06);
      border-color: rgba(255,255,255,0.25);
    }

    #minimap {
      position: fixed;
      top: 70px;
      right: 20px;
      width: 140px;
      height: 140px;
      background: rgba(10, 10, 26, 0.85);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      backdrop-filter: blur(12px);
      z-index: 100;
      overflow: hidden;
    }

    #minimap canvas {
      width: 100%;
      height: 100%;
    }

    #proximity-indicator {
      position: fixed;
      bottom: 90px;
      left: 50%;
      transform: translateX(-50%);
      padding: 6px 16px;
      background: rgba(10, 10, 26, 0.85);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      backdrop-filter: blur(12px);
      font-size: 11px;
      font-weight: 400;
      color: rgba(255,255,255,0.5);
      z-index: 100;
      opacity: 0;
      transition: opacity 0.3s;
      white-space: nowrap;
    }

    #proximity-indicator.visible {
      opacity: 1;
    }

    /* ── DEMO SCREEN OVERLAY ── */
    #demo-screen-overlay {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.88);
      width: min(700px, 90vw);
      background: #000;
      border: 2px solid rgba(0,255,136,0.5);
      border-radius: 10px;
      box-shadow: 0 0 40px rgba(0,255,136,0.25), 0 0 80px rgba(0,255,136,0.1);
      z-index: 300;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease, transform 0.5s ease;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    #demo-screen-overlay.active {
      opacity: 1;
      pointer-events: all;
      transform: translate(-50%, -50%) scale(1);
    }
    #demo-screen-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 14px;
      background: rgba(0,10,5,0.95);
      border-bottom: 1px solid rgba(0,255,136,0.25);
      flex-shrink: 0;
    }
    #demo-screen-header .demo-title {
      font-size: 11px;
      font-weight: 600;
      color: rgba(0,255,136,0.9);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    #demo-screen-header .demo-url {
      font-size: 10px;
      color: rgba(255,255,255,0.35);
      font-family: monospace;
    }
    #demo-screen-actions {
      display: flex; gap: 6px; align-items: center;
    }
    #demo-screen-header .demo-open-btn {
      background: rgba(0,255,136,0.12);
      border: 1px solid rgba(0,255,136,0.35);
      color: rgba(0,255,136,0.9);
      font-size: 10px;
      padding: 2px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      text-decoration: none;
    }
    #demo-screen-header .demo-open-btn:hover {
      background: rgba(0,255,136,0.22);
    }
    #demo-screen-header .demo-close {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.45);
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    #demo-screen-header .demo-close:hover {
      background: rgba(255,60,60,0.2);
      color: #fff;
    }
    /* Screenshot container */
    #demo-img-wrap {
      position: relative;
      width: 100%;
      background: #050f0a;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    #demo-screenshot {
      width: 100%;
      height: auto;
      object-fit: contain;
      display: block;
    }
    #demo-loading {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: rgba(0,255,136,0.6);
      font-size: 12px;
      letter-spacing: 0.08em;
      background: #050f0a;
      transition: opacity 0.4s;
    }
    #demo-loading .spinner {
      width: 28px; height: 28px;
      border: 2px solid rgba(0,255,136,0.15);
      border-top-color: rgba(0,255,136,0.8);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    /* Scanlines */
    #demo-screen-overlay::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg, transparent, transparent 3px,
        rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px
      );
      pointer-events: none;
      z-index: 1;
    }
    /* Projection hint */
    #demo-hint {
      position: fixed;
      bottom: 130px;
      left: 50%;
      transform: translateX(-50%);
      padding: 5px 14px;
      background: rgba(0,255,136,0.1);
      border: 1px solid rgba(0,255,136,0.25);
      border-radius: 8px;
      font-size: 11px;
      color: rgba(0,255,136,0.85);
      z-index: 100;
      opacity: 0;
      transition: opacity 0.3s;
      white-space: nowrap;
      pointer-events: none;
    }
    #demo-hint.visible { opacity: 1; }

    /* ── CONTACT CARD ── */
    #contact-card {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.92);
      width: min(420px, 88vw);
      background: rgba(6, 6, 20, 0.96);
      border: 1px solid rgba(0,229,255,0.25);
      border-radius: 20px;
      box-shadow: 0 0 60px rgba(0,229,255,0.12), 0 0 120px rgba(0,229,255,0.05);
      z-index: 400;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.45s ease, transform 0.45s ease;
      overflow: hidden;
    }
    #contact-card.active {
      opacity: 1;
      pointer-events: all;
      transform: translate(-50%, -50%) scale(1);
    }
    #contact-card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 24px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    #contact-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(0,229,255,0.4);
      flex-shrink: 0;
    }
    #contact-card-header .contact-name {
      font-size: 18px;
      font-weight: 700;
      color: #e8e8e8;
      margin-bottom: 3px;
    }
    #contact-card-header .contact-role {
      font-size: 11px;
      color: rgba(0,229,255,0.75);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    #contact-close-btn {
      margin-left: auto;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.45);
      font-size: 13px;
      width: 28px; height: 28px;
      border-radius: 6px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    #contact-close-btn:hover { background: rgba(255,60,60,0.2); color: #fff; }
    #contact-links {
      padding: 18px 24px 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .contact-link-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      color: #d0d0d0;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Inter', sans-serif;
    }
    .contact-link-btn:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.18);
      color: #fff;
      transform: translateX(3px);
    }
    .contact-link-btn .btn-icon {
      width: 32px; height: 32px;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
    .contact-link-btn .btn-label { flex: 1; }
    .contact-link-btn .btn-arrow { opacity: 0.35; font-size: 11px; }
    #contact-card-hint {
      position: fixed;
      bottom: 130px;
      left: 50%;
      transform: translateX(-50%);
      padding: 5px 14px;
      background: rgba(0,229,255,0.1);
      border: 1px solid rgba(0,229,255,0.25);
      border-radius: 8px;
      font-size: 11px;
      color: rgba(0,229,255,0.85);
      z-index: 100;
      opacity: 0;
      transition: opacity 0.3s;
      white-space: nowrap;
      pointer-events: none;
    }
    #contact-card-hint.visible { opacity: 1; }
  </style>

  <div id="hud-top">
    <span class="name">Nguyễn Quang Anh</span>
    <span class="divider"></span>
    <span class="subtitle">Full-Stack Developer &middot; Interactive Portfolio</span>
  </div>

  <div id="speed-hud">
    <span class="speed-val" id="speed-value">0</span><span class="speed-unit">km/h</span>
    <div id="speed-bar"><div id="speed-bar-fill"></div></div>
  </div>

  <div id="controls-hint">
    <span class="key-badge">W</span><span class="key-badge">A</span><span class="key-badge">S</span><span class="key-badge">D</span> Lái xe &nbsp;
    <span class="key-badge">Space</span> Drift / Phanh<br>
    <span class="key-badge">Click + Drag</span> Xoay camera
  </div>

  <div id="project-panel">
    <div class="proj-category" id="panel-category"></div>
    <div class="proj-title" id="panel-title"></div>
    <div class="proj-desc" id="panel-desc"></div>
    <div class="tech-tags" id="panel-tags"></div>
    <a class="proj-link" id="panel-link" href="#">View Project →</a>
  </div>

  <div id="minimap"><canvas id="minimap-canvas" width="140" height="140"></canvas></div>

  <div id="proximity-indicator" id="proximity-text">Lái xe lại gần để khám phá dự án</div>

  <!-- Demo Screen Overlay (projected on building wall) -->
  <div id="demo-screen-overlay">
    <div id="demo-screen-header">
      <span class="demo-title" id="demo-screen-title">📡 LIVE PREVIEW</span>
      <span class="demo-url" id="demo-screen-url"></span>
      <div id="demo-screen-actions">
        <a class="demo-open-btn" id="demo-open-link" href="#" target="_blank" rel="noopener">↗ Open Live</a>
        <button class="demo-close" id="demo-close-btn">✕</button>
      </div>
    </div>
    <div id="demo-img-wrap">
      <div id="demo-loading">
        <div class="spinner"></div>
        <span>LOADING PREVIEW...</span>
      </div>
      <img id="demo-screenshot" src="" alt="Project preview" style="opacity:0;display:none;" />
      <iframe id="demo-screen-iframe"
        style="width:100%;height:100%;border:none;display:none;background:#fff;"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        title="Project Demo"></iframe>
    </div>
  </div>

  <div id="demo-hint">📺 Lái gần hơn để xem demo — nhấn E để mở</div>

  <!-- Contact Card -->
  <div id="contact-card">
    <div id="contact-card-header">
      <img id="contact-avatar" src="./Me.png" alt="Nguyễn Quang Anh" />
      <div>
        <div class="contact-name">Nguyễn Quang Anh</div>
        <div class="contact-role">Full-Stack Developer</div>
      </div>
      <button id="contact-close-btn">✕</button>
    </div>
    <div id="contact-links">
      <a class="contact-link-btn" href="https://github.com/Mnauu2201" target="_blank" rel="noopener">
        <span class="btn-icon" style="background:rgba(255,255,255,0.08);">🐙</span>
        <span class="btn-label">GitHub</span>
        <span class="btn-arrow">↗</span>
      </a>
      <a class="contact-link-btn" href="https://www.facebook.com/wwangh.ahn/" target="_blank" rel="noopener">
        <span class="btn-icon" style="background:rgba(24,119,242,0.18);">📘</span>
        <span class="btn-label">Facebook</span>
        <span class="btn-arrow">↗</span>
      </a>
      <a class="contact-link-btn" href="./cv.pdf" target="_blank" rel="noopener">
        <span class="btn-icon" style="background:rgba(255,100,50,0.18);">📄</span>
        <span class="btn-label">Download CV</span>
        <span class="btn-arrow">↓</span>
      </a>
      <a class="contact-link-btn" href="mailto:quangt2234@gmail.com">
        <span class="btn-icon" style="background:rgba(0,229,255,0.18);">✉️</span>
        <span class="btn-label">Work With Me</span>
        <span class="btn-arrow">→</span>
      </a>
    </div>
  </div>
  <div id="contact-card-hint">👤 Lái lại gần để gặp developer</div>
`;
root.appendChild(uiContainer);

const speedValueEl = document.getElementById('speed-value');
const speedBarFill = document.getElementById('speed-bar-fill');
const projectPanel = document.getElementById('project-panel');
const panelCategory = document.getElementById('panel-category');
const panelTitle = document.getElementById('panel-title');
const panelDesc = document.getElementById('panel-desc');
const panelTags = document.getElementById('panel-tags');
const panelLink = document.getElementById('panel-link');
const proximityIndicator = document.getElementById('proximity-indicator');
const minimapCanvas = document.getElementById('minimap-canvas');
const minimapCtx = minimapCanvas.getContext('2d');

// --- DEMO SCREEN ELEMENTS ---
const demoOverlay   = document.getElementById('demo-screen-overlay');
const demoHint      = document.getElementById('demo-hint');
const demoTitle     = document.getElementById('demo-screen-title');
const demoUrlEl     = document.getElementById('demo-screen-url');
const demoCloseBtn  = document.getElementById('demo-close-btn');
const demoOpenLink  = document.getElementById('demo-open-link');
const demoScreenImg = document.getElementById('demo-screenshot');
const demoScreenIframe = document.getElementById('demo-screen-iframe');
const demoLoading   = document.getElementById('demo-loading');

// --- CONTACT CARD ELEMENTS ---
const contactCard     = document.getElementById('contact-card');
const contactCardHint = document.getElementById('contact-card-hint');
const contactCloseBtn = document.getElementById('contact-close-btn');
let contactCardOpen   = false;

contactCloseBtn.addEventListener('click', () => {
  contactCard.classList.remove('active');
  contactCardOpen = false;
});

// E key cũng đóng contact card
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactCardOpen) {
    contactCard.classList.remove('active');
    contactCardOpen = false;
  }
});

let demoOpen = false;
let demoTargetProject = null;
let _demoAnimFrame = null;

// Draw an animated "live preview" on canvas that mimics the site's look
function drawCanvasPreview(canvas, proj) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let t = 0;

  function frame() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, W, H);

    // Animated grid
    ctx.strokeStyle = 'rgba(0,255,136,0.07)';
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    for (let x = 0; x < W; x += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Simulated top bar
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, W, 36);
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('● ' + proj.title.toUpperCase(), 14, 23);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '11px monospace';
    ctx.fillText(proj.demoUrl, W / 2 - ctx.measureText(proj.demoUrl).width / 2, 23);

    // Animated chart lines (simulating qachart)
    const chartX = 30, chartY = 55, chartW = W - 60, chartH = H - 120;

    // Chart background
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(chartX, chartY, chartW, chartH);

    // Y-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px monospace';
    for (let i = 0; i <= 4; i++) {
      const y = chartY + (chartH / 4) * i;
      ctx.fillText((100 - i * 25) + '%', chartX + 4, y + 12);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath(); ctx.moveTo(chartX + 30, y); ctx.lineTo(chartX + chartW, y); ctx.stroke();
    }

    // Animated data lines
    const colors = ['#00ff88', '#00e5ff', '#ff6b9d', '#ffd93d'];
    const datasets = 4;
    for (let d = 0; d < datasets; d++) {
      ctx.strokeStyle = colors[d];
      ctx.lineWidth = 2;
      ctx.shadowColor = colors[d];
      ctx.shadowBlur = 6;
      ctx.beginPath();
      const points = 32;
      for (let i = 0; i <= points; i++) {
        const px = chartX + 30 + (i / points) * (chartW - 30);
        const wave = Math.sin(i * 0.4 + t * (1 + d * 0.3) + d * 1.5) * 0.3
                   + Math.sin(i * 0.15 + t * 0.7 + d) * 0.15
                   + Math.cos(i * 0.25 + t * 0.5 + d * 0.8) * 0.1;
        const py = chartY + chartH / 2 - wave * chartH * 0.38 - d * 12;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Candlestick-style bars at bottom
    const barCount = 20;
    const barW = (chartW - 30) / barCount - 3;
    for (let b = 0; b < barCount; b++) {
      const bx = chartX + 30 + b * ((chartW - 30) / barCount);
      const bh = 15 + Math.abs(Math.sin(b * 0.7 + t * 0.4)) * 35;
      const up = Math.sin(b * 1.3 + t * 0.3) > 0;
      ctx.fillStyle = up ? 'rgba(0,255,136,0.55)' : 'rgba(255,107,157,0.55)';
      ctx.fillRect(bx, chartY + chartH - bh - 8, barW, bh);
    }

    // Legend
    colors.forEach((c, i) => {
      const lx = chartX + 30 + i * 100;
      ctx.fillStyle = c;
      ctx.fillRect(lx, chartY + chartH + 8, 20, 3);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px monospace';
      ctx.fillText(['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'Volume'][i], lx + 24, chartY + chartH + 14);
    });

    // Blinking cursor dot
    if (Math.floor(t * 2) % 2 === 0) {
      ctx.fillStyle = '#00ff88';
      ctx.beginPath();
      ctx.arc(chartX + chartW - 10, chartY + 20, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    _demoAnimFrame = requestAnimationFrame(frame);
  }
  _demoAnimFrame = requestAnimationFrame(frame);
}

function openDemoScreen(proj) {
  if (demoOpen && demoTargetProject === proj) return;
  demoTargetProject = proj;
  demoOpen = true;
  demoTitle.textContent = '📡 ' + proj.title;
  demoUrlEl.textContent = proj.demoUrl;
  demoOpenLink.href = proj.demoUrl;
  demoOverlay.classList.add('active');

  // Dừng canvas animation cũ nếu có
  if (_demoAnimFrame) { cancelAnimationFrame(_demoAnimFrame); _demoAnimFrame = null; }
  const oldCvs = document.getElementById('demo-canvas-preview');
  if (oldCvs) oldCvs.style.display = 'none';

  // Ẩn iframe
  demoScreenIframe.style.display = 'none';
  demoScreenIframe.src = '';

  // Reset về trạng thái loading
  demoScreenImg.style.display = 'none';
  demoScreenImg.style.opacity = '0';
  demoLoading.style.display = 'flex';
  demoLoading.style.opacity = '1';
  demoLoading.innerHTML = '<div class="spinner"></div><span>LOADING PREVIEW...</span>';

  if (proj.screenshot) {
    demoScreenImg.style.display = 'block';
    demoScreenImg.src = proj.screenshot;

    demoScreenImg.onload = () => {
      demoLoading.style.opacity = '0';
      setTimeout(() => { demoLoading.style.display = 'none'; }, 400);
      demoScreenImg.style.transition = 'opacity 0.4s';
      demoScreenImg.style.opacity = '1';
    };

    demoScreenImg.onerror = () => showFallback(proj);
  } else {
    showFallback(proj);
  }

  // Làm sáng màn hình 3D trên tòa nhà
  const pg = projectGroups.find(g => g.project.id === proj.id);
  if (pg && pg.demoScreen) {
    pg.demoScreen.material.emissiveIntensity = 3.5;
  }
}

function showFallback(proj, loadingEl) {
  (loadingEl || demoLoading).style.display = 'flex';
  (loadingEl || demoLoading).style.opacity = '1';
  (loadingEl || demoLoading).innerHTML = `
    <div style="text-align:center;padding:28px 20px;color:rgba(0,255,136,0.7);">
      <div style="font-size:2.5em;margin-bottom:10px;">🌐</div>
      <div style="font-size:14px;font-weight:600;margin-bottom:6px;color:#fff;">${proj.title}</div>
      <div style="font-size:11px;margin-bottom:18px;opacity:0.5;">${proj.demoUrl}</div>
      <a href="${proj.demoUrl}" target="_blank" rel="noopener"
         style="color:#00ff88;font-size:12px;border:1px solid rgba(0,255,136,0.45);
                padding:8px 20px;border-radius:6px;text-decoration:none;letter-spacing:0.08em;">
        ↗ Open Live Demo
      </a>
    </div>`;
}

function closeDemoScreen() {
  demoOpen = false;
  demoOverlay.classList.remove('active');
  if (_demoAnimFrame) { cancelAnimationFrame(_demoAnimFrame); _demoAnimFrame = null; }
  const cvs = document.getElementById('demo-canvas-preview');
  if (cvs) cvs.style.display = 'none';
  demoScreenIframe.srcdoc = '';
  demoScreenIframe.style.display = 'none';
  demoLoading.style.display = 'flex';
  demoLoading.style.opacity = '1';
  demoLoading.innerHTML = `<div class="spinner"></div><span>LOADING PREVIEW...</span>`;
  const pg = demoTargetProject ? projectGroups.find(g => g.project.id === demoTargetProject.id) : null;
  if (pg && pg.demoScreen) {
    pg.demoScreen.material.emissiveIntensity = 1.2;
  }
  demoTargetProject = null;
}

demoCloseBtn.addEventListener('click', closeDemoScreen);

// E key to open demo, Escape to close
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'e' && demoTargetProject && !demoOpen) {
    openDemoScreen(demoTargetProject);
  }
  if (e.key === 'Escape' && demoOpen) {
    closeDemoScreen();
  }
});

// --- MINIMAP ---
function drawMinimap() {
  const w = 140, h = 140;
  minimapCtx.clearRect(0, 0, w, h);
  minimapCtx.fillStyle = 'rgba(10, 10, 26, 0.5)';
  minimapCtx.fillRect(0, 0, w, h);

  const scale = 1.2;
  const cx = w / 2, cy = h / 2;
  const carX = carState.position.x, carZ = carState.position.z;

  // Roads
  minimapCtx.strokeStyle = 'rgba(255,255,255,0.08)';
  minimapCtx.lineWidth = 1;
  portfolioProjects.forEach(p => {
    minimapCtx.beginPath();
    minimapCtx.moveTo(cx + (0 - carX) * scale, cy + (0 - carZ) * scale);
    minimapCtx.lineTo(cx + (p.position.x - carX) * scale, cy + (p.position.z - carZ) * scale);
    minimapCtx.stroke();
  });

  // Projects
  portfolioProjects.forEach(p => {
    const px = cx + (p.position.x - carX) * scale;
    const py = cy + (p.position.z - carZ) * scale;
    if (px > -10 && px < w + 10 && py > -10 && py < h + 10) {
      minimapCtx.fillStyle = '#' + new THREE.Color(p.color).getHexString();
      minimapCtx.beginPath();
      minimapCtx.arc(px, py, 3, 0, Math.PI * 2);
      minimapCtx.fill();
    }
  });

  // Center hub
  const hubPx = cx + (0 - carX) * scale;
  const hubPy = cy + (0 - carZ) * scale;
  minimapCtx.fillStyle = '#00e5ff';
  minimapCtx.beginPath();
  minimapCtx.arc(hubPx, hubPy, 2, 0, Math.PI * 2);
  minimapCtx.fill();

  // Car (center arrow) — đỉnh nhọn = hướng đầu xe
  minimapCtx.save();
  minimapCtx.translate(cx, cy);
  minimapCtx.rotate(carState.heading);   // bỏ dấu âm: Three.js heading khớp Canvas 2D khi không đảo
  minimapCtx.fillStyle = '#ffffff';
  minimapCtx.beginPath();
  minimapCtx.moveTo(0, -6);   // đỉnh nhọn = phía trước xe
  minimapCtx.lineTo(-3.5, 5);
  minimapCtx.lineTo(3.5, 5);
  minimapCtx.closePath();
  minimapCtx.fill();
  // Chấm đỏ nhỏ ở đỉnh để dễ nhận hướng
  minimapCtx.fillStyle = '#ff4444';
  minimapCtx.beginPath();
  minimapCtx.arc(0, -6, 1.5, 0, Math.PI * 2);
  minimapCtx.fill();
  minimapCtx.restore();
}

// --- CAMERA ---
const cameraTarget = new THREE.Vector3();
const cameraPos = new THREE.Vector3();
const cameraLookTarget = new THREE.Vector3();

// --- ANIMATION LOOP ---
let activeProject = null;
let panelFadeTimer = 0;
// Clock replacement (THREE.Clock deprecated in v0.183)
const clock = {
  _prev: 0, _start: performance.now()/1000,
  getDelta()        { const now = performance.now()/1000; const d = this._prev ? Math.min(now - this._prev, 0.05) : 0.016; this._prev = now; return d; },
  getElapsedTime()  { return performance.now()/1000 - this._start; }
};

// ============================================================
// 🌧️ WEATHER SYSTEM
// ============================================================
const WEATHERS = ['clear', 'rain', 'fog', 'storm'];
let currentWeather = 'clear';
let weatherTimer = 30 + Math.random() * 60; // đổi thời tiết sau 30-90s

// Rain particles
const RAIN_COUNT = 600;
const rainGeo = new THREE.BufferGeometry();
const rainPos = new Float32Array(RAIN_COUNT * 3);
for (let i = 0; i < RAIN_COUNT; i++) {
  rainPos[i*3]   = (Math.random()-0.5)*80;
  rainPos[i*3+1] = Math.random()*30;
  rainPos[i*3+2] = (Math.random()-0.5)*80;
}
rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
const rainMat = new THREE.PointsMaterial({ color: 0xaaccff, size: 0.18, transparent: true, opacity: 0.55, sizeAttenuation: true });
const rainMesh = new THREE.Points(rainGeo, rainMat);
rainMesh.visible = false;
rainMesh.frustumCulled = false;
scene.add(rainMesh);

// Fog
scene.fog = null;

// Lightning flash overlay
const lightningOverlay = document.createElement('div');
lightningOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(200,220,255,0);pointer-events:none;z-index:999;transition:background 0.05s;';
document.body.appendChild(lightningOverlay);
let lightningTimer = 0;

function setWeather(type) {
  currentWeather = type;
  rainMesh.visible = (type === 'rain' || type === 'storm');
  rainMat.opacity  = type === 'storm' ? 0.75 : 0.55;

  if (type === 'fog') {
    scene.fog = new THREE.FogExp2(0x8899aa, 0.018);
  } else if (type === 'storm') {
    scene.fog = new THREE.FogExp2(0x445566, 0.012);
  } else {
    scene.fog = null;
  }

  // Toast notification
  const toast = document.createElement('div');
  const labels = { clear:'☀️ Trời quang', rain:'🌧️ Bắt đầu mưa', fog:'🌫️ Sương mù dày đặc', storm:'⛈️ Giông bão!' };
  toast.textContent = labels[type] || type;
  toast.style.cssText = 'position:fixed;top:60px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:#fff;padding:6px 18px;border-radius:20px;font-size:13px;z-index:500;pointer-events:none;transition:opacity 0.5s;';
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; setTimeout(()=>toast.remove(),500); }, 2500);
}

function updateWeather(dt) {
  weatherTimer -= dt;
  if (weatherTimer <= 0) {
    const next = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
    setWeather(next);
    weatherTimer = 30 + Math.random() * 90;
  }

  if (currentWeather === 'rain' || currentWeather === 'storm') {
    const rp = rainGeo.attributes.position.array;
    const fallSpeed = currentWeather === 'storm' ? 18 : 10;
    for (let i = 0; i < RAIN_COUNT; i++) {
      rp[i*3+1] -= fallSpeed * dt;
      if (rp[i*3+1] < 0) {
        rp[i*3]   = (Math.random()-0.5)*80;
        rp[i*3+1] = 28 + Math.random()*4;
        rp[i*3+2] = (Math.random()-0.5)*80;
      }
    }
    rainGeo.attributes.position.needsUpdate = true;

    // Lightning during storm
    if (currentWeather === 'storm') {
      lightningTimer -= dt;
      if (lightningTimer <= 0) {
        lightningOverlay.style.background = 'rgba(200,220,255,0.35)';
        setTimeout(() => lightningOverlay.style.background = 'rgba(200,220,255,0)', 80);
        lightningTimer = 3 + Math.random() * 7;
      }
    }
  }
}

// ============================================================
// 🎵 AUDIO SYSTEM (Web Audio API — không cần file)
// ============================================================
let audioCtx = null;
let engineOscL = null, engineOscR = null, engineGain = null;
let _audioStarted = false;

function initAudio() {
  if (_audioStarted) return;
  _audioStarted = true;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.resume(); // Chrome requires explicit resume after user gesture

    engineGain = audioCtx.createGain();
    engineGain.gain.value = 0;
    const lp = audioCtx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 400;
    engineOscL = audioCtx.createOscillator();
    engineOscR = audioCtx.createOscillator();
    engineOscL.type = engineOscR.type = 'sawtooth';
    engineOscL.frequency.value = 55;
    engineOscR.frequency.value = 57;
    engineOscL.connect(lp); engineOscR.connect(lp);
    lp.connect(engineGain);
    engineGain.connect(audioCtx.destination);
    engineOscL.start(); engineOscR.start();
  } catch(e) { console.warn('Audio init failed', e); }
}

// One-shot sound effects
function playSound(type) {
  if (!audioCtx) return;
  try {
    const g = audioCtx.createGain();
    g.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'drift') {
      // Tyre squeal — white noise bandpass
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.4, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random()*2-1;
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      const bp = audioCtx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.8;
      src.connect(bp); bp.connect(g);
      g.gain.setValueAtTime(0.18, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      src.start(now);
    } else if (type === 'hit') {
      // Thud — low sine burst
      const o = audioCtx.createOscillator();
      o.type = 'sine'; o.frequency.setValueAtTime(120, now);
      o.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      o.connect(g);
      g.gain.setValueAtTime(0.3, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      o.start(now); o.stop(now + 0.18);
    } else if (type === 'rain') {
      // Rain ambience tick
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * (1 - i/d.length);
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      src.connect(g);
      g.gain.setValueAtTime(0.04, now);
      src.start(now);
    }
  } catch(e) {}
}

function updateAudio(dt) {
  if (!audioCtx || !engineGain) return;
  const absSpeed = Math.abs(carState.speed);
  const targetFreq = 50 + absSpeed * 280;
  const targetGain = absSpeed > 0.01 ? 0.06 + absSpeed * 0.18 : 0;
  engineOscL.frequency.setTargetAtTime(targetFreq,     audioCtx.currentTime, 0.08);
  engineOscR.frequency.setTargetAtTime(targetFreq+2,   audioCtx.currentTime, 0.08);
  engineGain.gain.setTargetAtTime(targetGain,          audioCtx.currentTime, 0.08);

  // Rain ambience ticks
  if ((currentWeather === 'rain' || currentWeather === 'storm') && Math.random() < dt * 12) {
    playSound('rain');
  }
}

// Start audio on first user interaction
document.addEventListener('keydown', initAudio, { once: true });
document.addEventListener('mousedown', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

function updateCar(dt) {
  const forward = keys.w || keys.up;
  const backward = keys.s || keys.down;
  const left = keys.a || keys.left;
  const right = keys.d || keys.right;
  const brake = keys.space;

  // Acceleration
  if (forward) {
    carState.speed = Math.min(carState.speed + carState.acceleration, carState.maxSpeed);
  } else if (backward) {
    carState.speed = Math.max(carState.speed - carState.acceleration, -carState.maxSpeed * 0.5);
  }

  // Brake / Drift trigger (Space)
  // During drift: reduces speed slowly (not a hard stop) — slide does the rest
  if (brake) {
    if (driftState.active) {
      // Drift mode: gentle speed decay, lateral physics in updateDrift
      if (carState.speed > 0) carState.speed = Math.max(0, carState.speed - carState.brakeForce * 0.4);
      else if (carState.speed < 0) carState.speed = Math.min(0, carState.speed + carState.brakeForce * 0.4);
    } else {
      // Normal brake (not yet drifting)
      if (carState.speed > 0) carState.speed = Math.max(0, carState.speed - carState.brakeForce);
      else if (carState.speed < 0) carState.speed = Math.min(0, carState.speed + carState.brakeForce);
    }
  }

  // Friction
  if (!forward && !backward && !brake) {
    if (carState.speed > 0) carState.speed = Math.max(0, carState.speed - carState.friction);
    else if (carState.speed < 0) carState.speed = Math.min(0, carState.speed + carState.friction);
  }

  // Turning (only when moving)
  const speedFactor = Math.abs(carState.speed) / carState.maxSpeed;
  if (left && Math.abs(carState.speed) > 0.005) {
    carState.turnSpeed = Math.min(carState.turnSpeed + carState.turnAcceleration, carState.maxTurnSpeed);
  } else if (right && Math.abs(carState.speed) > 0.005) {
    carState.turnSpeed = Math.max(carState.turnSpeed - carState.turnAcceleration, -carState.maxTurnSpeed);
  } else {
    if (carState.turnSpeed > 0) carState.turnSpeed = Math.max(0, carState.turnSpeed - carState.turnFriction);
    else carState.turnSpeed = Math.min(0, carState.turnSpeed + carState.turnFriction);
  }

  // Drift physics (lateral slide + oversteer) — runs before heading update
  updateDrift(dt);

  // Apply turn (reverse turn direction when going backward)
  // Skip heading update inside drift (updateDrift handles extra yaw)
  if (!driftState.active) {
    const turnDir = carState.speed >= 0 ? 1 : -1;
    carState.heading += carState.turnSpeed * speedFactor * turnDir;
  }

  // Update position
  const dx = Math.sin(carState.heading) * carState.speed;
  const dz = Math.cos(carState.heading) * carState.speed;
  carState.position.x += dx;
  carState.position.z += dz;

  // Boundary collision
  const dist = Math.sqrt(carState.position.x ** 2 + carState.position.z ** 2);
  if (dist > 65) {
    const norm = carState.position.clone().normalize();
    carState.position.x = norm.x * 65;
    carState.position.z = norm.z * 65;
    carState.speed *= -0.3;
    driftState.active = false;
  }

  // Simple building collision
  portfolioProjects.forEach(p => {
    const dx = carState.position.x - p.position.x;
    const dz = carState.position.z - p.position.z;
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d < 4) {
      const pushDir = new THREE.Vector2(dx, dz).normalize();
      carState.position.x = p.position.x + pushDir.x * 4;
      carState.position.z = p.position.z + pushDir.y * 4;
      carState.speed *= -0.2;
      driftState.active = false;
    }
  });

  // Hub collision
  const hubDist = Math.sqrt(carState.position.x ** 2 + carState.position.z ** 2);
  if (hubDist < 5) {
    const pushDir = new THREE.Vector2(carState.position.x, carState.position.z).normalize();
    carState.position.x = pushDir.x * 5;
    carState.position.z = pushDir.y * 5;
    carState.speed *= -0.2;
    driftState.active = false;
  }

  // Tree & lamp post collisions — skip colliders far from car (early cull)
  const _carX = carState.position.x, _carZ = carState.position.z;
  colliders.forEach(col => {
    const _quickDx = _carX - col.x, _quickDz = _carZ - col.z;
    if (_quickDx * _quickDx + _quickDz * _quickDz > 25) return; // > 5 units away, skip
    resolveCollider(col, dt);
  });

  // Car shake
  if (carHitState.shakeTimer > 0) {
    carHitState.shakeTimer -= dt;
    const s = carHitState.shakeMag * (carHitState.shakeTimer / 0.35);
    carGroup.position.x += (Math.random() - 0.5) * s;
    carGroup.position.z += (Math.random() - 0.5) * s;
  }

  // Update mesh
  carGroup.position.set(carState.position.x, 0, carState.position.z);
  carGroup.rotation.y = carState.heading;

  // Cache wheel spin groups once
  if (!carGroup._wheelSpins) {
    carGroup._wheelSpins = [];
    carGroup.traverse(c => { if (c.name && c.name.startsWith('wheelSpin_')) carGroup._wheelSpins.push(c); });
  }
  carState.wheelRotation += carState.speed * 3;
  carGroup._wheelSpins.forEach(w => { w.rotation.y = carState.wheelRotation; });

  // Tilt on turn (drift overrides this in updateDrift)
  if (!driftState.active) {
    const tilt = -carState.turnSpeed * speedFactor * 3;
    carGroup.rotation.z = THREE.MathUtils.lerp(carGroup.rotation.z, tilt, 0.1);
  }

  // Skid marks
  updateSkidMarks(dt);
}

// Reusable vectors for camera — avoid GC pressure
const _camDesired = new THREE.Vector3();
const _camLook    = new THREE.Vector3();

function updateCamera() {
  // Camera always sits behind the car + user's horizontal orbit offset
  const camAngle = carState.heading + Math.PI + cameraAngleOffset;
  const baseDist   = 8;
  const baseHeight = 4 + cameraHeightOffset;

  const targetX = carState.position.x + Math.sin(camAngle) * baseDist;
  const targetZ = carState.position.z + Math.cos(camAngle) * baseDist;

  _camDesired.set(targetX, baseHeight, targetZ);

  // Collision: push camera out of buildings
  let pushed = false;
  for (let i = 0; i < colliders.length; i++) {
    const col = colliders[i];
    if (col.type !== 'building' && col.type !== 'lamp') continue;
    const cdx = _camDesired.x - col.x;
    const cdz = _camDesired.z - col.z;
    const dist2 = cdx * cdx + cdz * cdz;
    const minR = (col.radius || 0.5) + 1.2;
    if (dist2 < minR * minR) {
      const d = Math.sqrt(dist2) || 0.001;
      _camDesired.x = col.x + (cdx / d) * minR;
      _camDesired.z = col.z + (cdz / d) * minR;
      pushed = true;
    }
  }
  // Clamp within world boundary
  const camDist2D = Math.sqrt(_camDesired.x * _camDesired.x + _camDesired.z * _camDesired.z);
  if (camDist2D > 90) {
    const sc = 90 / camDist2D;
    _camDesired.x *= sc;
    _camDesired.z *= sc;
  }

  const lerpSpeed = pushed ? 0.18 : 0.07;
  cameraPos.lerp(_camDesired, lerpSpeed);

  _camLook.set(carState.position.x, 0.6, carState.position.z);
  cameraLookTarget.lerp(_camLook, 0.12);

  camera.position.copy(cameraPos);
  camera.lookAt(cameraLookTarget);
}

function checkProximity() {
  // ── Hub / contact card proximity ──
  const hubDist = carState.position.length(); // hub ở tọa độ (0,0,0)
  if (hubDist < 14) {
    contactCardHint.classList.add('visible');
    if (hubDist < 8 && !contactCardOpen) {
      contactCard.classList.add('active');
      contactCardOpen = true;
    }
  } else {
    contactCardHint.classList.remove('visible');
    if (contactCardOpen && hubDist > 16) {
      contactCard.classList.remove('active');
      contactCardOpen = false;
    }
  }

  let closest = null;
  let closestDist = Infinity;

  portfolioProjects.forEach(p => {
    const d = carState.position.distanceTo(p.position);
    if (d < closestDist) {
      closestDist = d;
      closest = p;
    }
  });

  if (closest && closestDist < 12) {
    if (closestDist < 8) {
      // Show full panel
      if (activeProject !== closest.id) {
        activeProject = closest.id;
        panelCategory.textContent = closest.category;
        panelCategory.style.color = closest.accentColor;
        panelTitle.textContent = closest.title;
        panelDesc.textContent = closest.description;
        panelTags.innerHTML = closest.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
        panelLink.href = closest.link;
        projectPanel.classList.add('active');
        proximityIndicator.classList.remove('visible');
      }

      // Demo screen logic — show hint or auto-project at ultra-close range
      if (closest.demoUrl) {
        demoTargetProject = closest;
        if (closestDist < 5) {
          // Auto-open the live preview on building wall
          if (!demoOpen) openDemoScreen(closest);
          demoHint.classList.remove('visible');
        } else {
          // Show hint
          if (!demoOpen) {
            demoHint.textContent = `📺 Lái gần hơn để xem demo — nhấn E để mở`;
            demoHint.classList.add('visible');
          }
        }

        // Animate 3D screen brightness by distance
        const pg = projectGroups.find(g => g.project.id === closest.id);
        if (pg && pg.demoScreen && !demoOpen) {
          const bright = THREE.MathUtils.mapLinear(closestDist, 8, 4, 1.2, 3.0);
          pg.demoScreen.material.emissiveIntensity = THREE.MathUtils.clamp(bright, 1.2, 3.0);
        }
      } else {
        demoHint.classList.remove('visible');
        if (!demoOpen) demoTargetProject = null;
      }

    } else {
      // Show proximity hint
      projectPanel.classList.remove('active');
      activeProject = null;
      proximityIndicator.textContent = `↗ ${closest.title} — lái xe lại gần để xem`;
      proximityIndicator.classList.add('visible');
      demoHint.classList.remove('visible');
      if (!demoOpen) demoTargetProject = null;
    }
  } else {
    projectPanel.classList.remove('active');
    proximityIndicator.classList.remove('visible');
    demoHint.classList.remove('visible');
    activeProject = null;
    if (!demoOpen) demoTargetProject = null;
    // Auto-close demo if drove away
    if (demoOpen) closeDemoScreen();
  }
}

function animate() {
  const dt = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  updateCar(dt);
  updateCamera();
  checkProximity();

  // Day/Night cycle — update every second (throttled)
  if (!animate._dnTimer) { animate._dnTimer = 0; animate._nightFactor = 1; }
  animate._dnTimer += dt;
  if (animate._dnTimer >= 1.0) {
    animate._dnTimer = 0;
    updateDayNight();
    // Cache nightFactor for headlights (based on VN hour)
    const _vnH = (new Date().getUTCHours() + 7) % 24 + new Date().getUTCMinutes() / 60;
    animate._nightFactor = Math.max(0, Math.min(1,
      _vnH < 6  ? 1 - (_vnH - 4.5) / 1.5 :
      _vnH > 18 ? (_vnH - 18) / 1.5        :
      Math.max(0, 1 - (_vnH - 6) / 1.5)
    ));
  }

  // Headlights — every frame for smooth flicker & speed response
  updateHeadlights(animate._nightFactor ?? 1);

  // Animate hub — billboard xoay nhìn về phía xe
  const _avatarBB = hubGroup.getObjectByName('avatarBillboard');
  if (_avatarBB) {
    const _dx = carState.position.x - hubGroup.position.x;
    const _dz = carState.position.z - hubGroup.position.z;
    _avatarBB.rotation.y = Math.atan2(_dx, _dz);
  }
  // Glow ring pulse
  const _ring = hubGroup.getObjectByName('hubGlowRing');
  if (_ring) {
    _ring.material.opacity = 0.35 + Math.sin(elapsed * 2.2) * 0.2;
    _ring.scale.setScalar(1 + Math.sin(elapsed * 1.8) * 0.04);
  }
  // Hub light flicker nhẹ
  hubPointLight.intensity = 2.5 + Math.sin(elapsed * 3.1) * 0.3;

  // Throttle marker + light + screen animations to every 2nd frame
  if (!animate._fCnt) animate._fCnt = 0;
  animate._fCnt++;
  if (animate._fCnt % 2 === 0) {
    // Animate markers
    projectGroups.forEach((pg, i) => {
      pg.marker.rotation.y = elapsed * 1.2 + i;
      pg.marker.position.y = pg.buildingHeight + 3 + Math.sin(elapsed * 2 + i * 1.5) * 0.4;
    });

    // Animate project lights
    projectLights.forEach((light, i) => {
      light.intensity = 1.5 + Math.sin(elapsed * 2 + i * 1.2) * 0.5;
    });

    // Animate demo screens — idle glow pulse
    projectGroups.forEach((pg) => {
      if (pg.demoScreen && pg.project.id !== (demoTargetProject && demoTargetProject.id)) {
        pg.demoScreen.material.emissiveIntensity = 1.2 + Math.sin(elapsed * 1.8 + pg.project.position.x) * 0.35;
      }
    });
  }

  // Animate tree sway & lamp/tree hit effects (every frame for hit, throttled for idle)
  animateColliders(dt, elapsed);

  // NPC updates — throttle to every 4th frame
  if (animate._fCnt % 4 === 0) {
  const CAR_SCARE_RADIUS = 7.5;
  const CAR_FLEE_SPEED   = 4.5;
  const npcDt = dt * 4;
  let npcDirty = false;

  chibiPeople.forEach((p) => {
    const cdx = p.x - carState.position.x;
    const cdz = p.z - carState.position.z;
    const carDist = Math.sqrt(cdx*cdx + cdz*cdz);

    if (carDist < CAR_SCARE_RADIUS && Math.abs(carState.speed) > 0.04) {
      const mag = carDist || 1;
      p.fleeVx = cdx/mag + (Math.random()-0.5)*0.6;
      p.fleeVz = cdz/mag + (Math.random()-0.5)*0.6;
      p.fleeing = true;
      p.fleeTimer = 2.0;
      p.walkSpeed = p.baseWalkSpeed * 2.8;
    }

    if (p.fleeing) {
      p.fleeTimer -= npcDt;
      if (p.fleeTimer <= 0) { p.fleeing = false; p.walkSpeed = p.baseWalkSpeed; }
      p.x += p.fleeVx * CAR_FLEE_SPEED * npcDt;
      p.z += p.fleeVz * CAR_FLEE_SPEED * npcDt;
      p.ry = -Math.atan2(p.fleeVx, p.fleeVz);
    } else {
      p.walkAngle += p.walkSpeed * npcDt;
      p.x = p.walkCenterX + Math.cos(p.walkAngle) * p.walkRadius;
      p.z = p.walkCenterZ + Math.sin(p.walkAngle) * p.walkRadius;
      p.ry = -p.walkAngle - Math.PI / 2;
    }

    // Paw swing
    const freq = p.fleeing ? 9 : 4;
    const amp  = p.fleeing ? 0.5 : 0.3;
    const swing = Math.sin(elapsed * freq + p.phase) * amp;
    const bob   = Math.abs(swing) * 0.04;
    const i = p.idx, ry = p.ry, cx = p.x, cz = p.z;

    // Body
    _setCatPart(iBody,  i, cx, bob+0.28, cz, ry, 0, 0, 0,  1, 0.9, 1);
    // Head
    _setCatPart(iHead,  i, cx, bob+0.68, cz, ry, 0, 0, 0);
    // Ears
    _setCatPart(iEarL,  i, cx, bob+0.87, cz, ry, -0.12, 0, 0, 1, 1, 1, 0, -0.25);
    _setCatPart(iEarR,  i, cx, bob+0.87, cz, ry,  0.12, 0, 0, 1, 1, 1, 0,  0.25);
    // Paws (bob with swing)
    _setCatPart(iPawL,  i, cx, bob+0.06+swing*0.06, cz, ry, -0.12, 0,  0.12, 1, 0.6, 1.2);
    _setCatPart(iPawR,  i, cx, bob+0.06-swing*0.06, cz, ry,  0.12, 0,  0.12, 1, 0.6, 1.2);
    // Tail wag
    _setCatPart(iTail,  i, cx, bob+0.22, cz, ry,  0.18, 0, -0.22, 1, 1, 1, -0.8+swing*0.3, 0.5);
    // Eyes
    _setCatPart(iEyeL,  i, cx, bob+0.70, cz, ry, -0.09, 0, 0.20);
    _setCatPart(iEyeR,  i, cx, bob+0.70, cz, ry,  0.09, 0, 0.20);
    // Nose
    _setCatPart(iNose,  i, cx, bob+0.65, cz, ry, 0, 0, 0.215);

    npcDirty = true;
  });

  if (npcDirty) {
    [iBody,iHead,iEarL,iEarR,iPawL,iPawR,iTail,iEyeL,iEyeR,iNose].forEach(m => {
      m.instanceMatrix.needsUpdate = true;
    });
  }
  } // end NPC throttle

  // Particles drift — throttle to every 3rd frame
  if (animate._fCnt % 3 === 0) {
  const posArr = particles.geometry.attributes.position.array;
  const driftAmt = Math.sin(elapsed * 0.5) * 0.009;
  for (let i = 0; i < particleCount; i++) {
    posArr[i * 3 + 1] += driftAmt;
    if (posArr[i * 3 + 1] > 16) posArr[i * 3 + 1] = 1;
  }
  particles.geometry.attributes.position.needsUpdate = true;
  }

  // Speed UI
  const displaySpeed = Math.round(Math.abs(carState.speed) / carState.maxSpeed * 180);
  speedValueEl.textContent = displaySpeed;
  speedBarFill.style.width = (Math.abs(carState.speed) / carState.maxSpeed * 100) + '%';

  // Minimap
  drawMinimap();

  // Weather + Audio
  updateWeather(dt);
  updateAudio(dt);

  renderer.render(scene, camera);
}

// ── CINEMATIC INTRO ──────────────────────────────────────────
const _CIN = {
  dur: 2.6, t: 0, done: false,
  cvs: null, ctx: null, stars: [], staticStars: [],
};
(function initCinematic() {
  const cvs = document.createElement('canvas');
  cvs.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:9999;pointer-events:none;';
  cvs.width = window.innerWidth; cvs.height = window.innerHeight;
  document.body.appendChild(cvs);
  _CIN.cvs = cvs; _CIN.ctx = cvs.getContext('2d');

  const skip = document.createElement('button');
  skip.textContent = 'SKIP  ›';
  skip.style.cssText = 'position:fixed;bottom:24px;right:28px;z-index:10000;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.18);color:rgba(255,255,255,0.5);font-size:0.75rem;letter-spacing:0.12em;padding:6px 16px;border-radius:20px;cursor:pointer;font-family:Segoe UI,system-ui,sans-serif;pointer-events:all;';
  skip.onmouseenter = () => { skip.style.background='rgba(0,229,255,0.15)'; skip.style.color='#fff'; };
  skip.onmouseleave = () => { skip.style.background='rgba(255,255,255,0.07)'; skip.style.color='rgba(255,255,255,0.5)'; };
  skip.onclick = () => { _CIN.t = _CIN.dur; };
  document.body.appendChild(skip);
  _CIN.skipEl = skip;

  const W = cvs.width, H = cvs.height;
  _CIN.stars = Array.from({length: 12}, (_, i) => ({
    delay: 0.05 + Math.random() * 1.6,
    x: Math.random()*W*0.8, y: Math.random()*H*0.55,
    len: 110 + Math.random()*200, speed: 0.38 + Math.random()*0.38,
    angle: Math.PI/6 + (Math.random()-0.5)*0.55,
    w: 1.0 + Math.random()*1.8,
    color: ['#ffffff','#00e5ff','#b39dff','#ffe0b2'][i%4],
  }));
  _CIN.staticStars = Array.from({length: 220}, () => ({
    x: Math.random()*W, y: Math.random()*H,
    r: 0.4+Math.random()*1.2, a: 0.2+Math.random()*0.7,
  }));
})();

function _drawCinematic(dt) {
  _CIN.t += dt;
  const t = _CIN.t;
  if (t >= _CIN.dur) {
    _CIN.done = true;
    if (_CIN.skipEl) _CIN.skipEl.remove();
    if (_CIN.cvs) {
      _CIN.cvs.style.transition = 'opacity 0.4s';
      _CIN.cvs.style.opacity = '0';
      setTimeout(() => _CIN.cvs && _CIN.cvs.remove(), 450);
      _CIN.cvs = null;
    }
    return;
  }
  const cvs = _CIN.cvs, ctx = _CIN.ctx;
  const W = cvs.width, H = cvs.height;
  const bgA = t < _CIN.dur-0.6 ? 1 : Math.max(0,1-(t-(_CIN.dur-0.6))/0.6);
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = `rgba(0,0,5,${bgA})`; ctx.fillRect(0,0,W,H);

  _CIN.staticStars.forEach(s => {
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${s.a*bgA})`; ctx.fill();
  });

  _CIN.stars.forEach(s => {
    const st = t - s.delay; if (st <= 0) return;
    const prog = Math.min(1, st/s.speed);
    const fadeOut = st > s.speed ? Math.max(0,1-(st-s.speed)/0.28) : 1;
    const alpha = Math.min(1,prog*4)*fadeOut*bgA; if (alpha<=0) return;
    const dx=Math.cos(s.angle)*s.len, dy=Math.sin(s.angle)*s.len;
    const tx=s.x+dx*prog, ty=s.y+dy*prog;
    const tailX=tx-dx*0.4, tailY=ty-dy*0.4;
    const grad=ctx.createLinearGradient(tailX,tailY,tx,ty);
    grad.addColorStop(0,'rgba(255,255,255,0)');
    grad.addColorStop(0.5,s.color+'44');
    grad.addColorStop(1,s.color+Math.round(alpha*255).toString(16).padStart(2,'0'));
    ctx.beginPath(); ctx.moveTo(tailX,tailY); ctx.lineTo(tx,ty);
    ctx.strokeStyle=grad; ctx.lineWidth=s.w; ctx.lineCap='round'; ctx.stroke();
    const g2=ctx.createRadialGradient(tx,ty,0,tx,ty,s.w*5);
    g2.addColorStop(0,`rgba(255,255,255,${alpha})`);
    g2.addColorStop(1,'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.arc(tx,ty,s.w*5,0,Math.PI*2); ctx.fillStyle=g2; ctx.fill();
  });

  const textIn=Math.min(1,t/0.5);
  const textOut=t>_CIN.dur-0.55?Math.max(0,1-(t-(_CIN.dur-0.55))/0.55):1;
  const ta=textIn*textOut;
  if (ta>0.01) {
    const fs=Math.round(W*0.044);
    ctx.save(); ctx.globalAlpha=ta*0.22; ctx.shadowColor='#00e5ff'; ctx.shadowBlur=32;
    ctx.fillStyle='#00e5ff'; ctx.font=`700 ${fs}px 'Segoe UI',system-ui,sans-serif`;
    ctx.textAlign='center'; ctx.fillText('Nguyễn Quang Anh',W/2,H/2); ctx.restore();
    ctx.save(); ctx.globalAlpha=ta; ctx.fillStyle='#ffffff';
    ctx.font=`700 ${fs}px 'Segoe UI',system-ui,sans-serif`; ctx.textAlign='center';
    ctx.fillText('Nguyễn Quang Anh',W/2,H/2);
    ctx.globalAlpha=ta*0.65; ctx.fillStyle='#00e5ff';
    ctx.font=`${Math.round(fs*0.3)}px 'Segoe UI',system-ui,sans-serif`;
    ctx.letterSpacing='0.3em'; ctx.fillText('PORTFOLIO',W/2,H/2-fs*0.9);
    ctx.globalAlpha=ta*0.4; ctx.strokeStyle='#00e5ff'; ctx.lineWidth=1;
    const lw=W*0.1;
    ctx.beginPath(); ctx.moveTo(W/2-lw,H/2+fs*0.75); ctx.lineTo(W/2+lw,H/2+fs*0.75); ctx.stroke();
    ctx.restore();
  }
}

renderer.setAnimationLoop(function _loop() {
  const now = performance.now()/1000;
  if (!_loop._last) _loop._last = now;
  const dt = Math.min(0.05, now - _loop._last);
  _loop._last = now;
  if (!_CIN.done) { _drawCinematic(dt); renderer.render(scene,camera); return; }
  animate();
});

// Camera initial position
cameraPos.set(0, 6, 18);
cameraLookTarget.set(0, 1, 10);
camera.position.copy(cameraPos);
camera.lookAt(cameraLookTarget);

// Apply day/night immediately on load
updateDayNight();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});