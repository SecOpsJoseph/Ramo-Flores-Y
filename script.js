/* ==========================================
   FLORES AMARILLAS - script.js  ✨ Glow Up
   ==========================================
   - Estrellas de fondo generadas dinámicamente
   - Árbol con flores amarillas en canvas (mejorado)
   - Efecto typewriter elegante
   - Flores cayendo con drift lateral
   - Contador en cajas individuales
   ========================================== */

// ============================================================
// 1. CONFIGURACIÓN — 🌻
// ============================================================

// ► Fecha desde que comenzó tu amor (año, mes-1, día, hora, minuto, segundo)
const FECHA_INICIO = new Date(2026, 3, 25, 20, 3, 0);

// ► Texto que aparece letra a letra (usa \n para nueva línea)
const TEXTO_AMOR =
  "Flores Amarillas para mi vida:\n\n" +
  "Si pudiera elegir un lugar\nseguro, sería a tu lado.\n\n" +
  "Cuanto más tiempo estoy\ncontigo más te amo.\n\n" +
  "— I Love You! ";

// ► Velocidad del typewriter en ms por carácter
const VELOCIDAD_TYPER = 55;

// ============================================================
// 0. ESTRELLAS DE FONDO
// ============================================================

(function generarEstrellas() {
  const cont = document.getElementById("estrellas");
  const total = 90;
  for (let i = 0; i < total; i++) {
    const s = document.createElement("span");
    const size = 1 + Math.random() * 2.2;
    s.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      top:    ${Math.random() * 100}%;
      left:   ${Math.random() * 100}%;
      --dur:  ${2 + Math.random() * 4}s;
      --del:  ${Math.random() * 5}s;
      --opmin: ${0.05 + Math.random() * 0.15};
      --opmax: ${0.5  + Math.random() * 0.5};
    `;
    cont.appendChild(s);
  }
})();

// ============================================================
// 2. RAMO EN CANVAS
// ============================================================

const canvas = document.getElementById("arbolCanvas");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  const cont = canvas.parentElement;
  canvas.width  = cont.offsetWidth  * 2;
  canvas.height = cont.offsetHeight * 2;
  canvas.style.width  = cont.offsetWidth  + "px";
  canvas.style.height = cont.offsetHeight + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(2, 2);
  dibujarRamo();
}

function dibujarTallo(x, y, largo, angulo) {
  const x2 = x + Math.cos(angulo) * largo;
  const y2 = y - Math.sin(angulo) * largo;

  const grad = ctx.createLinearGradient(x, y, x2, y2);
  grad.addColorStop(0, "#3E612A");
  grad.addColorStop(1, "#1D4418");

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 3.7;
  ctx.strokeStyle = grad;
  ctx.lineCap = "round";
  ctx.stroke();
  // Por defecto dibuja hojas aleatorias; puede desactivarse pasando
  // el argumento `mostrarHojas = false` al llamar a esta función.
  if (typeof arguments[4] === 'undefined' || arguments[4]) {
    if (Math.random() > 0.6) {
      dibujarHoja((x + x2) / 2, (y + y2) / 2, angulo - Math.PI / 2, 0.95);
    }
    if (Math.random() > 0.7) {
      dibujarHoja((x + x2) / 2 + Math.cos(angulo) * 10, (y + y2) / 2 - Math.sin(angulo) * 10, angulo + Math.PI / 2, 0.85);
    }
  }
}

function dibujarHoja(cx, cy, angulo, escala) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angulo);
  ctx.scale(escala, escala);

  const gradHoja = ctx.createLinearGradient(0, -2, 16, 10);
  gradHoja.addColorStop(0, "#4C7740");
  gradHoja.addColorStop(1, "#7AB768");

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(18, -8, 26, 2);
  ctx.quadraticCurveTo(16, 10, 0, 0);
  ctx.fillStyle = gradHoja;
  ctx.fill();

  ctx.restore();
}

function dibujarFlorBouquet(cx, cy, radio) {
  const petalos = 12;
  ctx.shadowColor = "rgba(255,220,110,0.28)";
  ctx.shadowBlur = 10;

  for (let i = 0; i < petalos; i++) {
    const ang = (i / petalos) * Math.PI * 2;
    const px = cx + Math.cos(ang) * radio * 1.45;
    const py = cy + Math.sin(ang) * radio * 1.35;
    ctx.beginPath();
    ctx.ellipse(px, py, radio * 0.78, radio * 0.34, ang, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? "#FFD64A" : "#FFCB33";
    ctx.fill();
  }

  ctx.shadowBlur = 0;

  const centro = ctx.createRadialGradient(cx, cy, radio * 0.2, cx, cy, radio * 0.7);
  centro.addColorStop(0, "#FFF6B0");
  centro.addColorStop(1, "#C16E18");
  ctx.beginPath();
  ctx.arc(cx, cy, radio * 0.72, 0, Math.PI * 2);
  ctx.fillStyle = centro;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx - radio * 0.18, cy - radio * 0.16, radio * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fill();
}

function dibujarRamo() {
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  ctx.clearRect(0, 0, w * 2, h * 2);
  // Base del grupo de tallos (sin envoltura ni cintas)
  const baseX = w * 0.5;
  const baseY = h * 0.72;
  const alturaRamo = h * 0.46;

  const cantidad = 9;
  const tallos = [];
  for (let i = 0; i < cantidad; i++) {
    tallos.push({
      x: baseX + (i - (cantidad - 1) / 2) * 18,
      y: baseY,
      ang: Math.PI / 2 + (Math.random() - 0.5) * 0.22,
      lon: alturaRamo * (0.88 + Math.random() * 0.14),
    });
  }

  // Dibujar tallos y varias florecitas pequeñas alrededor de la punta
  tallos.forEach((tallo) => {
    dibujarTallo(tallo.x, tallo.y, tallo.lon, tallo.ang, false); // sin hojas
    const tipX = tallo.x + Math.cos(tallo.ang) * tallo.lon;
    const tipY = tallo.y - Math.sin(tallo.ang) * tallo.lon;
    // Flor principal en la punta
    dibujarFlorBouquet(tipX, tipY, 12 + Math.random() * 6);

    // Añadir 1-3 florecitas pequeñas alrededor de la punta para simular un ramo
    const extras = 1 + Math.floor(Math.random() * 3);
    for (let k = 0; k < extras; k++) {
      const angOff = (Math.random() - 0.5) * Math.PI * 0.9;
      const dist = 8 + Math.random() * 18;
      const fx = tipX + Math.cos(tallo.ang + angOff) * dist + (Math.random() - 0.5) * 6;
      const fy = tipY - Math.sin(tallo.ang + angOff) * dist + (Math.random() - 0.5) * 6;
      dibujarFlorBouquet(fx, fy, 6 + Math.random() * 6);
    }
  });
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", () => {
  setTimeout(resizeCanvas, 100);
});
resizeCanvas();

// ============================================================
// 3. FLORES CAYENDO (DOM animado) — solo en zona derecha (ramo)
// ============================================================

const contenedorFlores = document.getElementById("flores-volando");
const EMOJIS_FLOR = ["🌻", "💛", "🌼", "✨"];

function crearFlorVolando() {
  const flor = document.createElement("span");
  flor.classList.add("Flores_Amarillas");
  flor.textContent = EMOJIS_FLOR[Math.floor(Math.random() * EMOJIS_FLOR.length)];

  // Flores distribuidas por toda la pantalla (0% a 100%)
  const posX     = Math.random() * 100;
  const duracion = 3.5 + Math.random() * 3.5;
  const delay    = Math.random() * 1.2;
  const top      = -10 + Math.random() * 16;
  const size     = 0.9 + Math.random() * 1.1;

  flor.style.cssText = `
    left: ${posX}%;
    top: ${top}%;
    font-size: ${size}rem;
    animation-duration: ${duracion}s;
    animation-delay: ${delay}s;
    animation-timing-function: ease-in;
  `;

  contenedorFlores.appendChild(flor);
  setTimeout(() => flor.remove(), (duracion + delay + 1.2) * 1000);
}

setInterval(crearFlorVolando, 750);
for (let i = 0; i < 5; i++) {
  setTimeout(crearFlorVolando, i * 280);
}

// ============================================================
// 4. EFECTO TYPEWRITER
// ============================================================

const elementoCarta = document.getElementById("carta");
let charIndex = 0;

function typewriterPaso() {
  if (charIndex < TEXTO_AMOR.length) {
    elementoCarta.textContent += TEXTO_AMOR[charIndex];
    charIndex++;
    setTimeout(typewriterPaso, VELOCIDAD_TYPER);
  }
}

setTimeout(() => typewriterPaso(), 900);

// ============================================================
// 5. CONTADOR DE TIEMPO
// ============================================================

function actualizarContador() {
  const ahora = new Date();
  const diff  = ahora - FECHA_INICIO;

  if (diff < 0) {
    ["dias","horas","minutos","segundos"].forEach(id => {
      document.getElementById(id).textContent = "00";
    });
    return;
  }

  const seg  = Math.floor(diff / 1000);
  const dias = Math.floor(seg / 86400);
  const hrs  = Math.floor((seg % 86400) / 3600);
  const min  = Math.floor((seg % 3600) / 60);
  const s    = seg % 60;

  document.getElementById("dias").textContent     = dias;
  document.getElementById("horas").textContent    = String(hrs).padStart(2, "0");
  document.getElementById("minutos").textContent  = String(min).padStart(2, "0");
  document.getElementById("segundos").textContent = String(s).padStart(2, "0");
}

actualizarContador();
setInterval(actualizarContador, 1000);
