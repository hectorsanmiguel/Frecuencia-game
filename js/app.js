// --- Estado del juego ---
let currentCard = null;
let currentScore = 0;

// --- Selección de elementos del DOM ---
const screenSetup = document.getElementById('screen-setup');
const screenGame = document.getElementById('screen-game');

const btnDrawCard = document.getElementById('btn-draw-card');
const cardContainer = document.getElementById('card-container');
const leftConcept = document.getElementById('left-concept');
const rightConcept = document.getElementById('right-concept');
const btnStartTurn = document.getElementById('btn-start-turn');

const gameLeftConcept = document.getElementById('game-left-concept');
const gameRightConcept = document.getElementById('game-right-concept');

const btnHideTarget = document.getElementById('btn-hide-target');
const btnSubmitGuess = document.getElementById('btn-submit-guess');
const btnReveal = document.getElementById('btn-reveal');
const instructionText = document.getElementById('instruction-text');
const targetZone = document.getElementById('target-zone');
const dialContainer = document.getElementById('dial-container');
const scoreElement = document.getElementById('score');

// --- Funciones del juego ---

// 1. Seleccionar una carta aleatoria
function drawRandomCard() {
  if (typeof CARDS === 'undefined' || CARDS.length === 0) {
    console.error("No se encontraron las cartas en cards.js");
    return;
  }

  const randomIndex = Math.floor(Math.random() * CARDS.length);
  currentCard = CARDS[randomIndex];

  // Actualizar textos
  leftConcept.textContent = currentCard.left;
  rightConcept.textContent = currentCard.right;

  // Mostrar la tarjeta y el botón de iniciar turno
  cardContainer.classList.remove('hidden');
  btnStartTurn.classList.remove('hidden');
}

// 2. Iniciar el turno del Psíquico
function startTurn() {
  gameLeftConcept.textContent = currentCard.left;
  gameRightConcept.textContent = currentCard.right;

  screenSetup.classList.add('hidden');
  screenGame.classList.remove('hidden');

  // Inicializar la ruleta
  initRound();
}

// --- Escuchadores de Eventos ---

btnDrawCard.addEventListener('click', drawRandomCard);
btnStartTurn.addEventListener('click', startTurn);

// El psíquico oculta la diana
btnHideTarget.addEventListener('click', () => {
  targetZone.classList.add('hidden');
  dialContainer.classList.add('interactive');
  dialContainer.style.cursor = 'pointer';

  btnHideTarget.classList.add('hidden');
  btnSubmitGuess.classList.remove('hidden');
  instructionText.textContent = 'Pasa el móvil al adivinador. Mueve la aguja hacia el concepto adecuado.';
});

// El adivinador confirma su apuesta
btnSubmitGuess.addEventListener('click', () => {
  dialContainer.classList.remove('interactive');
  dialContainer.style.cursor = 'default';

  btnSubmitGuess.classList.add('hidden');
  btnReveal.classList.remove('hidden');
  instructionText.textContent = 'Posición fijada. Pulsa "Revelar Resultado".';
});

// Revelar resultado y sumar puntos
btnReveal.addEventListener('click', () => {
  targetZone.classList.remove('hidden');

  const result = calculateScore();
  currentScore += result.points;
  scoreElement.textContent = currentScore;

  instructionText.textContent = `${result.text}`;
  btnReveal.classList.add('hidden');

  // Volver a la pantalla de inicio tras 3.5 segundos
  setTimeout(() => {
    btnDrawCard.textContent = "Sacar Otra Carta";
    cardContainer.classList.add('hidden');
    btnStartTurn.classList.add('hidden');
    screenGame.classList.add('hidden');
    screenSetup.classList.remove('hidden');
  }, 3500);
});