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
// 1. CONFIGURACIÓN — CAMBIA ESTOS DATOS 🌻
// ============================================================

// ► Fecha desde que comenzó tu amor (año, mes-1, día, hora, minuto, segundo)
const FECHA_INICIO = new Date(2026, 4, 5, 7, 58, 0);

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
// 2. ÁRBOL EN CANVAS
// ============================================================

const canvas = document.getElementById("arbolCanvas");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  const cont = canvas.parentElement;
  canvas.width  = cont.offsetWidth  * 2;
  canvas.height = cont.offsetHeight * 2;
  canvas.style.width  = cont.offsetWidth  + "px";
  canvas.style.height = cont.offsetHeight + "px";
  ctx.scale(2, 2);
  dibujarArbol();
}

// Ramas recursivas
function dibujarRama(x, y, angulo, largo, profundidad, grosor) {
  if (profundidad === 0 || largo < 4) return;

  const x2 = x + Math.cos(angulo) * largo;
  const y2 = y - Math.sin(angulo) * largo;

  // Gradiente en las ramas más finas
  const grad = ctx.createLinearGradient(x, y, x2, y2);
  if (profundidad > 2) {
    grad.addColorStop(0, "#7A4F2E");
    grad.addColorStop(1, "#9E6B42");
  } else {
    grad.addColorStop(0, "#9E6B42");
    grad.addColorStop(1, "#B8885A");
  }

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.lineWidth   = grosor;
  ctx.strokeStyle = grad;
  ctx.lineCap     = "round";
  ctx.stroke();

  if (profundidad <= 2) {
    dibujarGirasol(x2, y2, 7 + Math.random() * 5);
  } else {
    const spread = 0.35 + Math.random() * 0.15;
    dibujarRama(x2, y2, angulo + spread, largo * 0.68, profundidad - 1, grosor * 0.62);
    dibujarRama(x2, y2, angulo - spread, largo * 0.68, profundidad - 1, grosor * 0.62);
    if (Math.random() > 0.45) {
      dibujarRama(x2, y2, angulo + (Math.random() - 0.5) * 0.5, largo * 0.55, profundidad - 1, grosor * 0.5);
    }
  }
}

function dibujarGirasol(x, y, radio) {
  const petalos = 12;

  // Sombra suave del girasol
  ctx.shadowColor   = "rgba(255,200,0,0.35)";
  ctx.shadowBlur    = 8;

  // Pétalos
  for (let i = 0; i < petalos; i++) {
    const ang = (i / petalos) * Math.PI * 2;
    const px  = x + Math.cos(ang) * radio * 1.55;
    const py  = y + Math.sin(ang) * radio * 1.55;
    ctx.beginPath();
    ctx.ellipse(px, py, radio * 0.72, radio * 0.34, ang, 0, Math.PI * 2);
    const colorPetalo = Math.random() > 0.3 ? "#FFD700" : "#FFC107";
    ctx.fillStyle = colorPetalo;
    ctx.fill();
  }

  ctx.shadowBlur = 0;

  // Centro oscuro con gradiente
  const gCentro = ctx.createRadialGradient(x - radio*0.15, y - radio*0.15, 0, x, y, radio * 0.7);
  gCentro.addColorStop(0, "#5A2800");
  gCentro.addColorStop(1, "#2B0F00");
  ctx.beginPath();
  ctx.arc(x, y, radio * 0.65, 0, Math.PI * 2);
  ctx.fillStyle = gCentro;
  ctx.fill();

  // Brillo
  ctx.beginPath();
  ctx.arc(x - radio * 0.22, y - radio * 0.22, radio * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,230,80,0.55)";
  ctx.fill();
}

function dibujarArbol() {
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;

  ctx.clearRect(0, 0, w * 2, h * 2);

  const baseX = w * 0.48;
  const baseY = h * 0.99;

  // Tronco con gradiente
  const gTronco = ctx.createLinearGradient(baseX - 6, baseY, baseX + 6, baseY - h * 0.28);
  gTronco.addColorStop(0, "#6B3F1F");
  gTronco.addColorStop(1, "#9E6B42");

  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(baseX, baseY - h * 0.28);
  ctx.lineWidth   = 12;
  ctx.strokeStyle = gTronco;
  ctx.lineCap     = "round";
  ctx.stroke();

  const alturaTronco = baseY - h * 0.28;
  const largoRama    = h * 0.20;

  // Grupo izquierdo
  for (let i = 0; i < 3; i++) {
    const ang = (Math.PI / 2) + 0.42 + i * 0.22;
    dibujarRama(baseX, alturaTronco, ang, largoRama * (0.85 + i * 0.06), 4, 5.5);
  }
  // Grupo derecho
  for (let i = 0; i < 3; i++) {
    const ang = (Math.PI / 2) - 0.42 - i * 0.22;
    dibujarRama(baseX, alturaTronco, ang, largoRama * (0.85 + i * 0.06), 4, 5.5);
  }
  // Rama central
  dibujarRama(baseX, alturaTronco, Math.PI / 2, largoRama * 0.88, 4, 5);

  // Girasoles sueltos cayendo
  for (let i = 0; i < 6; i++) {
    const fx = baseX - 28 + Math.random() * 75;
    const fy = alturaTronco + 35 + Math.random() * 110;
    dibujarGirasol(fx, fy, 4.5 + Math.random() * 3.5);
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ============================================================
// 3. FLORES CAYENDO (DOM animado)
// ============================================================

const contenedorFlores = document.getElementById("flores-volando");
const EMOJIS_FLOR = ["🌻", "💛", "🌼", "✨"];

function crearFlorVolando() {
  const flor = document.createElement("span");
  flor.classList.add("Flores_Amarillas");
  flor.textContent = EMOJIS_FLOR[Math.floor(Math.random() * EMOJIS_FLOR.length)];

  const posX     = 10 + Math.random() * 75;
  const duracion = 3.5 + Math.random() * 4;
  const delay    = Math.random() * 1.5;
  const top      = 3 + Math.random() * 45;
  const size     = 0.85 + Math.random() * 0.9;

  flor.style.cssText = `
    left: ${posX}%;
    top: ${top}%;
    font-size: ${size}rem;
    animation-duration: ${duracion}s;
    animation-delay: ${delay}s;
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
