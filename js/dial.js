// --- Variables de estado de la ruleta ---
let targetAngle = 0;       // Ángulo aleatorio de la zona objetivo (-68 a 68)
let currentPointerAngle = 0; // Ángulo actual de la aguja
let isDragging = false;

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
// Por si ya se cargó el DOM
renderDialScale();

// --- Inicializar nueva ronda ---
function initRound() {
  const targetZone = document.getElementById('target-zone');
  const pointer = document.getElementById('pointer');

  // La escala visible va de -72° a 72° y la franja perfecta ocupa ±3°.
  const maxTargetAngle = Math.min(68, 72 - 3 - 1);
  targetAngle = (Math.random() * 2 - 1) * maxTargetAngle;

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
    pointer.style.transform = `translateX(-50%) rotate(${currentPointerAngle}deg)`;
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