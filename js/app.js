// --- Estado Global del Juego ---
const gameState = {
  teams: [
    { name: "Equipo 1", score: 0 },
    { name: "Equipo 2", score: 0 }
  ],
  currentTeamIndex: 0,
  currentCard: null
};

// Copia temporal en memoria para la partida actual
let sessionCards = [...CARDS];

// --- Selección de Elementos del DOM ---
const screenTeams = document.getElementById('screen-setup-teams');
const screenSetup = document.getElementById('screen-setup');
const screenGame = document.getElementById('screen-game');

const inputTeam1 = document.getElementById('input-team1');
const inputTeam2 = document.getElementById('input-team2');
const btnStartGame = document.getElementById('btn-start-game');

const nameDisplay1 = document.getElementById('name-display-1');
const nameDisplay2 = document.getElementById('name-display-2');
const scoreVal1 = document.getElementById('score-val-1');
const scoreVal2 = document.getElementById('score-val-2');
const scoreTeam1Box = document.getElementById('score-team1');
const scoreTeam2Box = document.getElementById('score-team2');

const turnAnnouncement = document.getElementById('turn-announcement');
const btnDrawCard = document.getElementById('btn-draw-card');
const btnCustomToggle = document.getElementById('btn-custom-card-toggle');
const customForm = document.getElementById('custom-card-form');
const customLeft = document.getElementById('custom-left');
const customRight = document.getElementById('custom-right');
const btnSaveCustomCard = document.getElementById('btn-save-custom-card');

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

// --- Funciones de Marcador y Turnos ---

function updateScoreboardUI() {
  nameDisplay1.textContent = gameState.teams[0].name;
  nameDisplay2.textContent = gameState.teams[1].name;
  scoreVal1.textContent = `${gameState.teams[0].score} pts`;
  scoreVal2.textContent = `${gameState.teams[1].score} pts`;

  if (gameState.currentTeamIndex === 0) {
    scoreTeam1Box.classList.add('active');
    scoreTeam2Box.classList.remove('active');
  } else {
    scoreTeam2Box.classList.add('active');
    scoreTeam1Box.classList.remove('active');
  }
}

function getCurrentTeam() {
  return gameState.teams[gameState.currentTeamIndex];
}

function switchTurn() {
  gameState.currentTeamIndex = gameState.currentTeamIndex === 0 ? 1 : 0;
  updateScoreboardUI();
}

// --- Flujo de Pantallas ---

btnStartGame.addEventListener('click', () => {
  const name1 = inputTeam1.value.trim() || "Equipo 1";
  const name2 = inputTeam2.value.trim() || "Equipo 2";

  gameState.teams[0].name = name1;
  gameState.teams[1].name = name2;

  updateScoreboardUI();

  screenTeams.classList.add('hidden');
  screenSetup.classList.remove('hidden');

  turnAnnouncement.textContent = `Turno de: ${getCurrentTeam().name}`;
});

// 1. Sacar Carta Aleatoria de la Lista
btnDrawCard.addEventListener('click', () => {
  customForm.classList.add('hidden'); // Ocultar formulario si estaba abierto

  const randomIndex = Math.floor(Math.random() * sessionCards.length);
  gameState.currentCard = sessionCards[randomIndex];

  leftConcept.textContent = gameState.currentCard.left;
  rightConcept.textContent = gameState.currentCard.right;

  cardContainer.classList.remove('hidden');
  btnStartTurn.classList.remove('hidden');
  btnStartTurn.textContent = `Soy el Psíquico de ${getCurrentTeam().name}`;
});

// 2. Desplegar Formulario para Carta Personalizada
btnCustomToggle.addEventListener('click', () => {
  customForm.classList.toggle('hidden');
  cardContainer.classList.add('hidden');
  btnStartTurn.classList.add('hidden');
});

// 3. Guardar Carta Personalizada para esta partida
btnSaveCustomCard.addEventListener('click', () => {
  const leftVal = customLeft.value.trim();
  const rightVal = customRight.value.trim();

  if (!leftVal || !rightVal) {
    alert("Por favor, introduce ambos extremos para la carta.");
    return;
  }

  const customCard = { left: leftVal, right: rightVal };
  
  // Se añade solo a la lista de la sesión actual
  sessionCards.push(customCard);
  gameState.currentCard = customCard;

  // Mostrar en pantalla
  leftConcept.textContent = customCard.left;
  rightConcept.textContent = customCard.right;

  // Limpiar campos y ocultar formulario
  customLeft.value = '';
  customRight.value = '';
  customForm.classList.add('hidden');

  cardContainer.classList.remove('hidden');
  btnStartTurn.classList.remove('hidden');
  btnStartTurn.textContent = `Soy el Psíquico de ${getCurrentTeam().name}`;
});

// 4. Comenzar Turno
btnStartTurn.addEventListener('click', () => {
  gameLeftConcept.textContent = gameState.currentCard.left;
  gameRightConcept.textContent = gameState.currentCard.right;

  screenSetup.classList.add('hidden');
  screenGame.classList.remove('hidden');

  initRound();
  instructionText.textContent = `El Psíquico de ${getCurrentTeam().name} ve la zona objetivo y da una pista.`;
});

// 5. El Psíquico Oculta la Diana
btnHideTarget.addEventListener('click', () => {
  targetZone.classList.add('hidden');
  dialContainer.classList.add('interactive');
  dialContainer.style.cursor = 'pointer';

  btnHideTarget.classList.add('hidden');
  btnSubmitGuess.classList.remove('hidden');
  instructionText.textContent = `Pasa el móvil al adivinador de ${getCurrentTeam().name}. Mueve la aguja al punto correcto.`;
});

// 6. Confirmar Posición
btnSubmitGuess.addEventListener('click', () => {
  dialContainer.classList.remove('interactive');
  dialContainer.style.cursor = 'default';

  btnSubmitGuess.classList.add('hidden');
  btnReveal.classList.remove('hidden');
  instructionText.textContent = 'Posición fijada. Pulsa "Revelar Resultado".';
});

// 7. Revelar Resultado
btnReveal.addEventListener('click', () => {
  targetZone.classList.remove('hidden');

  const result = calculateScore();
  const currentTeam = getCurrentTeam();
  currentTeam.score += result.points;

  updateScoreboardUI();

  instructionText.textContent = `${result.text} para ${currentTeam.name}!`;
  btnReveal.classList.add('hidden');

  setTimeout(() => {
    switchTurn();

    btnDrawCard.textContent = "Carta Aleatoria";
    cardContainer.classList.add('hidden');
    btnStartTurn.classList.add('hidden');
    screenGame.classList.add('hidden');
    screenSetup.classList.remove('hidden');

    turnAnnouncement.textContent = `Turno de: ${getCurrentTeam().name}`;
  }, 4000);
});