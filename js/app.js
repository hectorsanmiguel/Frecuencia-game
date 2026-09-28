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

// --- Funciones del juego ---

// 1. Seleccionar una carta aleatoria
function drawRandomCard() {
  const randomIndex = Math.floor(Math.random() * CARDS.length);
  currentCard = CARDS[randomIndex];

  // Actualizar la interfaz de la carta
  leftConcept.textContent = currentCard.left;
  rightConcept.textContent = currentCard.right;

  // Mostrar la tarjeta y el botón de comenzar turno
  cardContainer.classList.remove('hidden');
  btnStartTurn.classList.remove('hidden');
}

// 2. Iniciar el turno y cambiar a la pantalla del juego
function startTurn() {
  // Transferir los conceptos a la barra del juego
  gameLeftConcept.textContent = currentCard.left;
  gameRightConcept.textContent = currentCard.right;

  // Cambiar la visibilidad de las pantallas
  screenSetup.classList.add('hidden');
  screenGame.classList.remove('hidden');

  // Inicializar la ruleta para la nueva ronda
  initRound();
}

// --- Event Listeners (Escuchadores de eventos) ---
btnDrawCard.addEventListener('click', drawRandomCard);
btnStartTurn.addEventListener('click', startTurn);