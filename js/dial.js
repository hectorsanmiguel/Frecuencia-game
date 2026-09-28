// --- Lógica del Dial / Ruleta ---
let targetAngle = 0; // Ángulo donde estará la zona diana (en grados)

function initRound() {
  const targetZone = document.getElementById('target-zone');
  const pointer = document.getElementById('pointer');

  // Generar un ángulo aleatorio entre -70 y 70 grados para el objetivo
  targetAngle = Math.floor(Math.random() * 140) - 70;

  // Colocar la zona objetivo en la posición generada
  targetZone.style.transform = `translateX(-50%) rotate(${targetAngle}deg)`;
  targetZone.classList.remove('hidden');

  // Resetear la aguja al centro (0 grados)
  pointer.style.transform = `translateX(-50%) rotate(0deg)`;
}