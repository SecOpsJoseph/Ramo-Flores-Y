/* ==========================================
   FLORES AMARILLAS - script.js
   ==========================================
   - Árbol con flores amarillas en forma de corazón (Canvas)
   - Efecto typewriter para el texto de amor
   - Flores cayendo animadas
   - Contador de tiempo desde fecha especial
   ========================================== */

// ============================================================
// 1. CONFIGURACIÓN — CAMBIA ESTOS DATOS 🌻
// ============================================================

// ► Fecha desde que comenzó tu amor (año, mes-1, día, hora, minuto, segundo)
const FECHA_INICIO = new Date(2024, 5, 6, 0, 0, 0); // 6 de Junio 2024

// ► Texto que aparece letra a letra (usa \n para nueva línea)
const TEXTO_AMOR =
  "Flores Amarillas para el amor de mi vida:\n\n" +
  "Si pudiera elegir un lugar\nseguro, sería a tu lado.\n\n" +
  "Cuanto más tiempo estoy\ncontigo más te amo.\n\n" +
  "— I Love You! ";

// ► Velocidad del typewriter en ms por carácter
const VELOCIDAD_TYPER = 55;

// ============================================================
// 2. ÁRBOL EN CANVAS
// ============================================================

const canvas = document.getElementById("arbolCanvas");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  const cont = canvas.parentElement;
  canvas.width  = cont.offsetWidth  * 2; // x2 para retina
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

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.lineWidth   = grosor;
  ctx.strokeStyle = profundidad > 2 ? "#8B5E3C" : "#A0724A";
  ctx.lineCap = "round";
  ctx.stroke();

  if (profundidad <= 2) {
    // Dibujar girasoles en las puntas
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
  const petalos = 10;
  // Pétalos amarillos
  for (let i = 0; i < petalos; i++) {
    const ang = (i / petalos) * Math.PI * 2;
    const px  = x + Math.cos(ang) * radio * 1.5;
    const py  = y + Math.sin(ang) * radio * 1.5;
    ctx.beginPath();
    ctx.ellipse(px, py, radio * 0.75, radio * 0.38, ang, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.3 ? "#FFD700" : "#FFC107";
    ctx.fill();
  }
  // Centro oscuro
  ctx.beginPath();
  ctx.arc(x, y, radio * 0.65, 0, Math.PI * 2);
  ctx.fillStyle = "#3B1A0A";
  ctx.fill();
  // Punto brillante
  ctx.beginPath();
  ctx.arc(x - radio * 0.2, y - radio * 0.2, radio * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,220,50,0.5)";
  ctx.fill();
}

function dibujarArbol() {
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;

  ctx.clearRect(0, 0, w, h);

  const baseX = w * 0.48;
  const baseY = h * 0.98;

  // Tronco principal
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(baseX, baseY - h * 0.28);
  ctx.lineWidth   = 11;
  ctx.strokeStyle = "#8B5E3C";
  ctx.lineCap     = "round";
  ctx.stroke();

  // Ramas principales en forma de corazón
  const alturaTronco = baseY - h * 0.28;
  const largoRama    = h * 0.19;

  // Grupo izquierdo
  for (let i = 0; i < 3; i++) {
    const ang = (Math.PI / 2) + 0.4 + i * 0.22;
    dibujarRama(baseX, alturaTronco, ang, largoRama * (0.85 + i * 0.06), 4, 5.5);
  }
  // Grupo derecho
  for (let i = 0; i < 3; i++) {
    const ang = (Math.PI / 2) - 0.4 - i * 0.22;
    dibujarRama(baseX, alturaTronco, ang, largoRama * (0.85 + i * 0.06), 4, 5.5);
  }
  // Rama central arriba
  dibujarRama(baseX, alturaTronco, Math.PI / 2, largoRama * 0.9, 4, 5);

  // Flores sueltas cayendo del árbol
  for (let i = 0; i < 6; i++) {
    const fx = baseX - 30 + Math.random() * 80;
    const fy = alturaTronco + 40 + Math.random() * 120;
    dibujarGirasol(fx, fy, 5 + Math.random() * 3);
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ============================================================
// 3. FLORES CAYENDO (DOM animado)
// ============================================================

const contenedorFlores = document.getElementById("flores-volando");
const EMOJIS_FLOR = ["🌻", "💛", "🌼"];

function crearFlorVolando() {
  const flor = document.createElement("span");
  flor.classList.add("Flores_Amarillas");
  flor.textContent = EMOJIS_FLOR[Math.floor(Math.random() * EMOJIS_FLOR.length)];

  const posX    = 20 + Math.random() * 70; // % dentro de la tarjeta
  const duracion = 3 + Math.random() * 4;  // segundos
  const delay    = Math.random() * 2;
  const top      = 5 + Math.random() * 50; // % de altura inicial
  const size     = 0.8 + Math.random() * 0.8; // tamaño variado

  flor.style.cssText = `
    left: ${posX}%;
    top: ${top}%;
    font-size: ${size}rem;
    animation-duration: ${duracion}s;
    animation-delay: ${delay}s;
  `;

  contenedorFlores.appendChild(flor);

  // Eliminar tras la animación
  setTimeout(() => flor.remove(), (duracion + delay + 1) * 1000);
}

// Lanzar flores periódicamente
setInterval(crearFlorVolando, 700);
// Flores iniciales
for (let i = 0; i < 5; i++) {
  setTimeout(crearFlorVolando, i * 300);
}

// ============================================================
// 4. EFECTO TYPEWRITER
// ============================================================

const elementoCarta = document.getElementById("carta");
let charIndex = 0;
let typerActivo = false;

function typewriterPaso() {
  if (charIndex < TEXTO_AMOR.length) {
    elementoCarta.textContent += TEXTO_AMOR[charIndex];
    charIndex++;
    setTimeout(typewriterPaso, VELOCIDAD_TYPER);
  } else {
    typerActivo = false;
    // Quitar cursor parpadeante al terminar (opcional)
    elementoCarta.style.setProperty("--cursor", "none");
  }
}

// Iniciar typewriter con pequeña demora
setTimeout(() => {
  typerActivo = true;
  typewriterPaso();
}, 800);

// ============================================================
// 5. CONTADOR DE TIEMPO
// ============================================================

function actualizarContador() {
  const ahora    = new Date();
  const diff     = ahora - FECHA_INICIO; // ms

  if (diff < 0) {
    document.getElementById("dias").textContent     = "0";
    document.getElementById("horas").textContent    = "0";
    document.getElementById("minutos").textContent  = "0";
    document.getElementById("segundos").textContent = "0";
    return;
  }

  const segundosTotales = Math.floor(diff / 1000);
  const dias     = Math.floor(segundosTotales / 86400);
  const horas    = Math.floor((segundosTotales % 86400) / 3600);
  const minutos  = Math.floor((segundosTotales % 3600)  / 60);
  const segundos = segundosTotales % 60;

  document.getElementById("dias").textContent     = dias;
  document.getElementById("horas").textContent    = String(horas).padStart(2, "0");
  document.getElementById("minutos").textContent  = String(minutos).padStart(2, "0");
  document.getElementById("segundos").textContent = String(segundos).padStart(2, "0");
}

actualizarContador();
setInterval(actualizarContador, 1000);