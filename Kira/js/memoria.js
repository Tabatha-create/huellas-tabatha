 const juegos = {
  kira: [
    "img/memoria/tanyi1.png", "img/memoria/tanyi1.png",
    "img/memoria/tanyi2.png", "img/memoria/tanyi2.png",
    "img/memoria/tanyi3.png", "img/memoria/tanyi3.png",
    "img/memoria/tanyi4.png", "img/memoria/tanyi4.png",
    "img/memoria/tanyi5.png", "img/memoria/tanyi5.png",
    "img/memoria/tanyi6.png", "img/memoria/tanyi6.png"
  ],
  ratitas: [
    "img/memoria/mem1.jpg", "img/memoria/mem1.jpg",
    "img/memoria/mem2.jpg", "img/memoria/mem2.jpg",
    "img/memoria/mem3.jpg", "img/memoria/mem3.jpg",
    "img/memoria/mem4.jpg", "img/memoria/mem4.jpg",
    "img/memoria/mem5.jpg", "img/memoria/mem5.jpg",
    "img/memoria/mem6.jpg", "img/memoria/mem6.jpg",
  ],
  loritos: [
    "img/memoria/peri1.jpg", "img/memoria/peri1.jpg",
    "img/memoria/peri2.jpg", "img/memoria/peri2.jpg",
    "img/memoria/peri3.jpg", "img/memoria/peri3.jpg",
    "img/memoria/peri4.jpg", "img/memoria/peri4.jpg",
    "img/memoria/peri5.jpg", "img/memoria/peri5.jpg",
    "img/memoria/peri6.jpg", "img/memoria/peri6.jpg",
  ],
  emociones: [
    "img/emociones/alegria.png", "img/emociones/alegria.png",
    "img/emociones/tristeza.png", "img/emociones/tristeza.png",
    "img/emociones/enojo.png", "img/emociones/enojo.png",
    "img/emociones/sorpresa.png", "img/emociones/sorpresa.png",
    "img/emociones/miedo.png", "img/emociones/miedo.png",
    "img/emociones/calma.png", "img/emociones/calma.png"
  ]
};

// Juego por defecto
let cardsArray = juegos.kira;

const gameBoard = document.getElementById('memory-game');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function shuffle(array) {
  array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  shuffle(cardsArray);
  gameBoard.innerHTML = '';
  cardsArray.forEach(src => {
    const card = document.createElement('div');
    card.classList.add('memory-card');

    card.innerHTML = `
      <img class="front-face" src="${src}" alt="Imagen" />
      <img class="back-face" src="img/memoria/reversoCarta.png" alt="Reverso" />
    `;

    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add('flip');
  this.style.zIndex = 10;

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  const isMatch =
    firstCard.querySelector('.front-face').src ===
    secondCard.querySelector('.front-face').src;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  firstCard.style.zIndex = '';
  secondCard.style.zIndex = '';
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    firstCard.style.zIndex = '';
    secondCard.style.zIndex = '';
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function restartGame() {
  createBoard();
}

// Cambiar set de imágenes y reiniciar
function cambiarJuego(nombreJuego) {
  if (juegos[nombreJuego]) {
    cardsArray = juegos[nombreJuego];
    createBoard();
    document.querySelector("h1").textContent = `Juego de Memoria: ${capitalizar(nombreJuego)}`;
  } else {
    console.error("Juego no encontrado:", nombreJuego);
  }
}

function capitalizar(palabra) {
  return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}

// Inicial
createBoard();
