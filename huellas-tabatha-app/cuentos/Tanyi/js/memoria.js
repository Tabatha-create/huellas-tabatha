 const juegos = {
  tanyi: [
    "img/memoria/tanyi1.png", "img/memoria/tanyi1.png",
    "img/memoria/tanyi2.png", "img/memoria/tanyi2.png",
    "img/memoria/tanyi3.png", "img/memoria/tanyi3.png",
    "img/memoria/tanyi4.png", "img/memoria/tanyi4.png",
    "img/memoria/tanyi5.png", "img/memoria/tanyi5.png",
    "img/memoria/tanyi6.png", "img/memoria/tanyi6.png"
  ],
  perros: [
    "img/memoria/Beagle_1.png", "img/memoria/Beagle_1.png",
    "img/memoria/Bulldog_1.png", "img/memoria/Bulldog_1.png",
    "img/memoria/Caniche_1.png", "img/memoria/Caniche_1.png",
    "img/memoria/Chihuahua_1.png", "img/memoria/Chihuahua_1.png",
    "img/memoria/Dalmata_1.png", "img/memoria/Dalmata_1.png",
    "img/memoria/Husky_1.png", "img/memoria/Husky_1.png",
  ],
  emociones: [
    "img/memoria/alegria.png", "img/memoria/alegria.png",
    "img/memoria/tristeza.png", "img/memoria/tristeza.png",
    "img/memoria/enojo.png", "img/memoria/enojo.png",
    "img/memoria/sorpresa.png", "img/memoria/sorpresa.png",
    "img/memoria/miedo.png", "img/memoria/miedo.png",
    "img/memoria/calma.png", "img/memoria/calma.png"
  ]
};

// Juego por defecto
let cardsArray = juegos.tanyi;

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
      <img class="back-face" src="img/lazo.png" alt="Reverso" />
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
