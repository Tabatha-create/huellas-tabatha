// Modificar el archivo puzzle.js

const puzzleContainer = document.getElementById('puzzle');
const size = 4; // 4x4 puzzle
const pieceSize = 100;
let currentImage = 'img/Lazo_lunares.png'; // Imagen inicial
let dragged;

// Añadir esta constante para los nombres de puzzles
const puzzleNames = {
  'img/Lazo_lunares.png': 'La historia de Tanyi',
  'img/Caja2.png': 'Meli encuentra una caja',
  'img/gotero1.png': 'Meli alimenta a la cachorrita'
};

// Modificar la función selectImage para actualizar también el nombre
function selectImage(src) {
  currentImage = src;
  document.getElementById('selectedImage').src = src;
  
  // Actualizar el nombre del puzzle
  const puzzleNameElement = document.getElementById('puzzleName');
  if (puzzleNameElement) {
    puzzleNameElement.textContent = puzzleNames[src] || 'Puzzle';
  }
  
  initPuzzle(); // Regenerar el puzzle automáticamente
}

function initPuzzle() {
  puzzleContainer.innerHTML = "";
  let positions = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      positions.push({ x, y });
    }
  }

  const shuffled = positions.sort(() => Math.random() - 0.5);

  shuffled.forEach(pos => {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.draggable = true;
    piece.style.width = pieceSize + "px";
    piece.style.height = pieceSize + "px";
    piece.style.backgroundImage = `url('${currentImage}')`;
    piece.style.backgroundSize = `${size * pieceSize}px ${size * pieceSize}px`;
    piece.style.backgroundPosition = `-${pos.x * pieceSize}px -${pos.y * pieceSize}px`;
    piece.dataset.correct = `${pos.x}-${pos.y}`;
    puzzleContainer.appendChild(piece);
  });

  const pieces = document.querySelectorAll('.piece');
  pieces.forEach(piece => {
    piece.addEventListener('dragstart', dragStart);
    piece.addEventListener('dragover', dragOver);
    piece.addEventListener('drop', drop);
  });
}

function dragStart(e) {
  dragged = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  if (e.target.className === 'piece') {
    const temp = document.createElement('div');
    puzzleContainer.insertBefore(temp, dragged);
    puzzleContainer.insertBefore(dragged, e.target);
    puzzleContainer.insertBefore(e.target, temp);
    puzzleContainer.removeChild(temp);

    checkWin(); // Verificar si se ha ganado
  }
}

function checkWin() {
  const pieces = document.querySelectorAll('.piece');
  let won = true;

  pieces.forEach((piece, index) => {
    const x = index % size;
    const y = Math.floor(index / size);
    const correct = piece.dataset.correct;
    if (correct !== `${x}-${y}`) {
      won = false;
    }
  });

  if (won) {
    setTimeout(() => {
      alert("🎉 ¡Felicidades! Has completado el puzzle.");
    }, 200);
  }
}

// Actualizar el nombre del puzzle al cargar la página
window.onload = function() {
  const puzzleNameElement = document.getElementById('puzzleName');
  if (puzzleNameElement) {
    puzzleNameElement.textContent = puzzleNames[currentImage] || 'Puzzle';
  }
  initPuzzle();
};
