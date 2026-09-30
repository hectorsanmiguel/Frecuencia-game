// --- Variables de estado de la ruleta ---
let targetAngle = 0;       // Ángulo aleatorio de la zona objetivo (-68 a 68)
let currentPointerAngle = 0; // Ángulo actual de la aguja
let isDragging = false;

const targetSegments = [
  { start: 75, end: 81, color: '#f59e0b' },
  { start: 81, end: 87, color: '#f97316' },
  { start: 87, end: 93, color: '#38bdf8' },
  { start: 93, end: 99, color: '#f97316' },
  { start: 99, end: 105, color: '#f59e0b' }
];

function renderTargetZone() {
  const targetZone = document.getElementById('target-zone');
  if (!targetZone || targetZone.querySelector('svg')) return;

  const svgNamespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNamespace, 'svg');
  svg.setAttribute('viewBox', '0 0 1000 500');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const defs = document.createElementNS(svgNamespace, 'defs');
  const clipPath = document.createElementNS(svgNamespace, 'clipPath');
  clipPath.setAttribute('id', 'target-fan-clip');
  clipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');

  const clipShape = document.createElementNS(svgNamespace, 'path');
  clipShape.setAttribute('d', 'M 0 500 A 500 500 0 0 1 1000 500 Z');
  clipPath.appendChild(clipShape);
  defs.appendChild(clipPath);
  svg.appendChild(defs);

  const sectors = document.createElementNS(svgNamespace, 'g');
  sectors.setAttribute('clip-path', 'url(#target-fan-clip)');

  const pointAt = (angle, radius) => {
    const radians = (270 + angle) * Math.PI / 180;
    const x = 500 + Math.sin(radians) * radius;
    const y = 500 - Math.cos(radians) * radius;
    return `${x.toFixed(3)} ${y.toFixed(3)}`;
  };

  for (const segment of targetSegments) {
    const overlapEnd = Math.min(segment.end + 0.25, 105);
    const sector = document.createElementNS(svgNamespace, 'path');
    sector.setAttribute(
      'd',
      `M 500 500 L ${pointAt(segment.start, 2000)} A 2000 2000 0 0 1 ${pointAt(overlapEnd, 2000)} Z`
    );
    sector.setAttribute('fill', segment.color);
    sectors.appendChild(sector);
  }

  svg.appendChild(sectors);
  targetZone.replaceChildren(svg);
}

// --- Crear la escala tipo regla (0 a 10 con pasos de 0.5) ---
function renderDialScale() {
  const scaleContainer = document.getElementById('dial-scale');
  if (!scaleContainer) return;
  
  scaleContainer.innerHTML = ''; // Limpiar previo

  // De 0 a 10 con incrementos de 0.5 son 21 marcas
  for (let i = 0; i <= 20; i++) {
    const value = i / 2; // Valores: 0, 0.5, 1, 1.5 ... 10
    // Mapear el valor de 0..10 a un ángulo de -72° a +72°
    const angle = -72 + (i * 7.2);

    const tick = document.createElement('div');
    tick.className = 'scale-tick';
    
    // Si es un número entero (0, 1, 2... 10)
    if (i % 2 === 0) {
      tick.classList.add('major');
      
      const label = document.createElement('span');
      label.className = 'scale-label';
      label.textContent = value;
      
      // Contrarrotar el texto del número para que siempre se lea verticalmente
      label.style.transform = `translateX(-50%) rotate(${-angle}deg)`;
      
      tick.appendChild(label);
    }

    tick.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    scaleContainer.appendChild(tick);
  }
}

// Inicializar la escala al cargar el script
document.addEventListener('DOMContentLoaded', renderDialScale);
document.addEventListener('DOMContentLoaded', renderTargetZone);
// Por si ya se cargó el DOM
renderDialScale();
renderTargetZone();

// --- Inicializar nueva ronda ---
function initRound() {
  const targetZone = document.getElementById('target-zone');
  const pointer = document.getElementById('pointer');

  // La escala visible va de -72° a 72° y la franja perfecta ocupa ±3°.
  const maxTargetAngle = Math.min(68, 72 - 3 - 1);
  const randomOffset = Math.random() * 2 - 1;
  const edgeBiasExponent = 0.65;
  const weightedOffset = Math.sign(randomOffset)
    * Math.pow(Math.abs(randomOffset), edgeBiasExponent);
  targetAngle = weightedOffset * maxTargetAngle;

  // Posicionar la zona objetivo
  targetZone.style.transform = `translateX(-50%) rotate(${targetAngle}deg)`;
  targetZone.classList.remove('hidden');

  // Resetear la aguja al centro (0 grados)
  currentPointerAngle = 0;
  updatePointerPosition(0);

  // Restaurar botones e instrucciones
  document.getElementById('btn-hide-target').classList.remove('hidden');
  document.getElementById('btn-submit-guess').classList.add('hidden');
  document.getElementById('btn-reveal').classList.add('hidden');
  document.getElementById('instruction-text').textContent = 'El Psíquico ve la zona objetivo y da una pista.';
}

// --- Actualizar posición visual de la aguja ---
function updatePointerPosition(angle) {
  const pointer = document.getElementById('pointer');
  currentPointerAngle = Math.max(-75, Math.min(75, angle));
  if (pointer) {
    pointer.style.transform = `translateX(-50%) rotate(${currentPointerAngle}deg) translateZ(0)`;
  }
}

// --- Cálculo del ángulo según la posición del cursor/dedo ---
function calculateAngleFromEvent(e) {
  const dialContainer = document.getElementById('dial-container');
  if (!dialContainer) return;

  const rect = dialContainer.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.bottom;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const deltaX = clientX - centerX;
  const deltaY = clientY - centerY;

  let rad = Math.atan2(deltaX, -deltaY);
  let deg = rad * (180 / Math.PI);

  updatePointerPosition(deg);
}

// --- Escuchadores de eventos para Arrastrar (Mouse y Touch) ---
window.addEventListener('mousedown', (e) => {
  const dialContainer = document.getElementById('dial-container');
  if (dialContainer && dialContainer.classList.contains('interactive') && dialContainer.contains(e.target)) {
    isDragging = true;
    calculateAngleFromEvent(e);
  }
});

window.addEventListener('mousemove', (e) => {
  if (isDragging) calculateAngleFromEvent(e);
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// Soporte para pantallas táctiles (Móviles)
window.addEventListener('touchstart', (e) => {
  const dialContainer = document.getElementById('dial-container');
  if (dialContainer && dialContainer.classList.contains('interactive') && dialContainer.contains(e.target)) {
    isDragging = true;
    calculateAngleFromEvent(e);
  }
});

window.addEventListener('touchmove', (e) => {
  if (isDragging) calculateAngleFromEvent(e);
});

window.addEventListener('touchend', () => {
  isDragging = false;
});

// --- Función para calcular la puntuación ---
function calculateScore() {
  const difference = Math.abs(currentPointerAngle - targetAngle);

  if (difference <= 3) return { points: 4, text: "¡DIANA PERFECTA! 🎯 +4 Puntos" };
  if (difference <= 9) return { points: 3, text: "¡Casi perfecto! 🟡 +3 Puntos" };
  if (difference <= 15) return { points: 2, text: "¡Buen intento! 🟠 +2 Puntos" };
  
  return { points: 0, text: "Fallaste. ⚪ 0 Puntos" };
}