// Variables globales
let quizScore = 0;
let wordsFound = 0;
let tipsLearned = 0;
let currentColor = '#000000';
let isDrawing = false;

// Sistema de Quiz (tu código actual + nueva funcionalidad)
const additionalQuestionSets = [
  // Set 2
  [
    {question: "¿Cómo era Goya según su inteligencia?", answer: "listo"},
    {question: "¿Cómo lo trataba su familia?", answer: "favorito"},
    {question: "¿Qué día especial fue al colegio?", answer: "mascota"},
    {question: "¿Qué hicieron en el colegio?", answer: "bailaron"},
    {question: "¿Cómo estaba la salud de Goya?", answer: "bien"}
  ],
  // Set 3
  [
    {question: "¿Qué sintió la familia por Goya siendo diferente?", answer: "amor"},
    {question: "¿Qué hizo Clea cuando vio a Goya en peligro?", answer: "salvarlo"},
    {question: "¿Cómo se portó la mamá de Clea?", answer: "generosa"},
    {question: "¿Qué necesitaba Goya para estar feliz?", answer: "cuidado"},
    {question: "¿Qué mensaje nos enseña este cuento?", answer: "amor"}
  ]
];

let currentSetIndex = -1; // -1 para el set inicial (HTML)
let completedQuestions = 0;
const totalQuestionsPerSet = 5;

// Tu función modificada (conserva toda tu lógica + agrega la nueva)
function checkAnswer(button, correctAnswer) {
  const question = button.closest('.question');
  const input = question.querySelector('.answer-input');
  const userAnswer = input.value.toLowerCase().trim();
  
  if (userAnswer === correctAnswer.toLowerCase() || 
      userAnswer.includes(correctAnswer.toLowerCase())) {
    question.classList.add('correct');
    question.classList.remove('incorrect');
    
    // Tu lógica original del score
    if (!question.dataset.answered) {
      quizScore++;
      question.dataset.answered = 'true';
      completedQuestions++; // Nueva línea para contar preguntas completadas
    }
    
    showNotification('¡Correcto! 🎉');
    
    // Nueva funcionalidad: verificar si completó todas las preguntas
    if (completedQuestions === totalQuestionsPerSet) {
      setTimeout(() => {
        showNextSet();
      }, 2000); // Esperar un poco más para que vea la celebración
    }
    
  } else {
    question.classList.add('incorrect');
    question.classList.remove('correct');
    showNotification('Inténtalo de nuevo 🤔');
  }
  
  updateQuizScore();
}

// Tu función original se mantiene igual
function updateQuizScore() {
  document.getElementById('quizScore').textContent = `Puntuación: ${quizScore}/5`;
  if (quizScore === 5) {
    setTimeout(() => showCelebration(), 500);
  }
}

// Nuevas funciones para los sets adicionales
function showNextSet() {
  currentSetIndex++;
  
  if (currentSetIndex >= additionalQuestionSets.length) {
    currentSetIndex = 0;
  }
  
  // Resetear variables para el nuevo set
  quizScore = 0;
  completedQuestions = 0;
  
  loadNewQuestions();
  
  const setNumber = currentSetIndex + 2;
  showNotification(`¡Nuevo desafío! Set ${setNumber} 🌟`);
}

function loadNewQuestions() {
  const container = document.querySelector('.quiz-container');
  const currentSet = additionalQuestionSets[currentSetIndex];
  
  container.innerHTML = '';
  
  currentSet.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `
      <p><strong>${index + 1}.</strong> ${q.question}</p>
      <input type="text" class="answer-input" placeholder="Escribe tu respuesta...">
      <button class="check-btn" onclick="checkAnswer(this, '${q.answer}')">Verificar</button>
    `;
    container.appendChild(questionDiv);
  });
  
  // Actualizar el marcador para el nuevo set
  updateQuizScore();
}

// Sistema de Consejos
function toggleTip(tip) {
  if (!tip.classList.contains('learned')) {
    tip.classList.add('learned');
    tip.style.background = '#c6f6d5';
    tip.style.borderLeftColor = '#48bb78';
    tip.innerHTML += ' ✅';
    tipsLearned++;
    updateTipsScore();
  }
}

function updateTipsScore() {
  document.getElementById('tipsScore').textContent = `Consejos aprendidos: ${tipsLearned}/7`;
}

// Sopa de Letras
const words = ['COMIDA', 'AGUA', 'CARIÑO', 'PASEO', 'VETERINARIO', 'JUGUETES', 'CASA', 'BAÑO'];
const gridSize = 10;
let wordGrid = [];
let selectedCells = [];

function initWordSearch() {
  createGrid();
  placeWords();
  fillEmptySpaces();
  displayGrid();
  displayWordsList();
}

function createGrid() {
  wordGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
}

function placeWords() {
  words.forEach(word => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 50) {
      const direction = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      
      if (canPlaceWord(word, row, col, direction)) {
        placeWord(word, row, col, direction);
        placed = true;
      }
      attempts++;
    }
  });
}

function canPlaceWord(word, row, col, direction) {
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1]  // diagonal
  ];
  
  const [dRow, dCol] = directions[direction];
  
  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * dRow;
    const newCol = col + i * dCol;
    
    if (newRow >= gridSize || newCol >= gridSize) return false;
    if (wordGrid[newRow][newCol] !== '' && wordGrid[newRow][newCol] !== word[i]) return false;
  }
  
  return true;
}

function placeWord(word, row, col, direction) {
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1]  // diagonal
  ];
  
  const [dRow, dCol] = directions[direction];
  
  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * dRow;
    const newCol = col + i * dCol;
    wordGrid[newRow][newCol] = word[i];
  }
}

function fillEmptySpaces() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (wordGrid[i][j] === '') {
        wordGrid[i][j] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

function displayGrid() {
  const gridElement = document.getElementById('wordGrid');
  gridElement.innerHTML = '';
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement('div');
      cell.className = 'word-cell';
      cell.textContent = wordGrid[i][j];
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', () => selectCell(cell));
      gridElement.appendChild(cell);
    }
  }
}

function displayWordsList() {
  const wordsListElement = document.getElementById('wordsList');
  wordsListElement.innerHTML = '';
  
  words.forEach(word => {
    const wordElement = document.createElement('div');
    wordElement.className = 'word-item';
    wordElement.textContent = word;
    wordElement.dataset.word = word;
    wordsListElement.appendChild(wordElement);
  });
}

function selectCell(cell) {
  if (cell.classList.contains('found')) return;
  
  cell.classList.toggle('selected');
  
  if (cell.classList.contains('selected')) {
    selectedCells.push(cell);
  } else {
    selectedCells = selectedCells.filter(c => c !== cell);
  }
  
  checkForWords();
}

function checkForWords() {
  words.forEach(word => {
    if (isWordSelected(word)) {
      markWordAsFound(word);
    }
  });
}

function isWordSelected(word) {
  if (selectedCells.length < word.length) return false;
  
  // Verificar si las celdas seleccionadas forman la palabra
  const selectedText = selectedCells.map(cell => cell.textContent).join('');
  return selectedText.includes(word) || selectedText.split('').reverse().join('').includes(word);
}

function markWordAsFound(word) {
  selectedCells.forEach(cell => {
    cell.classList.remove('selected');
    cell.classList.add('found');
  });
  
  const wordElement = document.querySelector(`[data-word="${word}"]`);
  if (wordElement && !wordElement.classList.contains('found')) {
    wordElement.classList.add('found');
    wordsFound++;
    updateWordScore();
  }
  
  selectedCells = [];
}

function updateWordScore() {
  document.getElementById('wordScore').textContent = `Palabras encontradas: ${wordsFound}/8`;
  if (wordsFound === 8) {
    setTimeout(() => showCelebration(), 500);
  }
}

// Sistema de Celebración
function showCelebration() {
  document.getElementById('celebration').classList.add('show');
}

function closeCelebration() {
  document.getElementById('celebration').classList.remove('show');
}

// Sistema de Notificaciones
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #667eea;
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    z-index: 3000;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-weight: bold;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);

// Sistema de Pestañas
function showTab(tabId) {
  // Ocultar todas las pestañas
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Desactivar todos los botones
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  
  // Mostrar la pestaña seleccionada
  document.getElementById(tabId).classList.add('active');
  
  // Activar el botón correspondiente
  event.target.classList.add('active');
  
  // Inicializar la sopa de letras cuando se abre esa pestaña
  if (tabId === 'wordSearch') {
    initWordSearch();
  }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  // Mostrar la primera pestaña por defecto
  document.getElementById('quiz').classList.add('active');
  document.querySelector('.tab-button').classList.add('active');
  
  // Inicializar el canvas de dibujo
  if (canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  
  // Agregar event listeners para los consejos
  document.querySelectorAll('.tip').forEach(tip => {
    tip.addEventListener('click', () => toggleTip(tip));
  });
  
  // Inicializar scores
  updateQuizScore();
  updateTipsScore();
  updateWordScore();
});

// Función para resetear todas las actividades
function resetAllActivities() {
  // Reset Quiz
  quizScore = 0;
  document.querySelectorAll('.question').forEach(question => {
    question.classList.remove('correct', 'incorrect');
    question.dataset.answered = 'false';
    const input = question.querySelector('.answer-input');
    if (input) input.value = '';
  });
  updateQuizScore();
  
  // Reset Tips
  tipsLearned = 0;
  document.querySelectorAll('.tip').forEach(tip => {
    tip.classList.remove('learned');
    tip.style.background = '';
    tip.style.borderLeftColor = '';
    tip.innerHTML = tip.innerHTML.replace(' ✅', '');
  });
  updateTipsScore();
  
  // Reset Word Search
  wordsFound = 0;
  selectedCells = [];
  updateWordScore();
  initWordSearch();
  
  // Reset Canvas
  if (ctx) {
    clearCanvas();
  }
  
  showNotification('¡Todas las actividades han sido reiniciadas!');
}

// Función para mostrar progreso general
function showOverallProgress() {
  const totalQuiz = 5;
  const totalTips = 7;
  const totalWords = 8;
  
  const quizProgress = Math.round((quizScore / totalQuiz) * 100);
  const tipsProgress = Math.round((tipsLearned / totalTips) * 100);
  const wordsProgress = Math.round((wordsFound / totalWords) * 100);
  const overallProgress = Math.round((quizProgress + tipsProgress + wordsProgress) / 3);
  
  const progressMessage = `
    📊 Progreso General: ${overallProgress}%
    🧠 Quiz: ${quizProgress}%
    💡 Consejos: ${tipsProgress}%
    🔍 Sopa de Letras: ${wordsProgress}%
  `;
  
  alert(progressMessage);
}