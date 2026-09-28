// --- Variables de estado de la ruleta ---
let targetAngle = 0;       // Ángulo aleatorio de la zona objetivo (-65 a 65)
let currentPointerAngle = 0; // Ángulo actual de la aguja
let isDragging = false;

// --- Inicializar nueva ronda ---
function initRound() {
  const targetZone = document.getElementById('target-zone');
  const pointer = document.getElementById('pointer');

  // Generar ángulo aleatorio para el objetivo (-65 a 65 grados)
  targetAngle = Math.floor(Math.random() * 130) - 65;

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

// Soporte para pantallas táctiles
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

  if (difference <= 4) return { points: 4, text: "¡DIANA PERFECTA! +4 Puntos" };
  if (difference <= 10) return { points: 3, text: "¡Casi perfecto! +3 Puntos" };
  if (difference <= 18) return { points: 2, text: "¡Buen intento! +2 Puntos" };
  
  return { points: 0, text: "Fallaste. 0 Puntos" };
}