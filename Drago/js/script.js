 let paginaActual = 0;
const paginas = document.querySelectorAll('.pagina');
const sonidoRisa = document.getElementById('risaAudio');

function cambiarPagina(direccion) {
  paginas[paginaActual].classList.remove('activa');
  paginaActual += direccion;
  if (paginaActual < 0) paginaActual = 0;
  if (paginaActual >= paginas.length) paginaActual = paginas.length - 1;
  paginas[paginaActual].classList.add('activa');

  // reproducir sonido solo en escena del dragón bebé (2)
  if (paginaActual === 1 && sonidoRisa) {
    sonidoRisa.volume = 0.3;
    sonidoRisa.play().catch(() => {});
  }
}

// estrellitas flotantes mágicas
function crearEstrella() {
  const estrella = document.createElement("div");
  estrella.classList.add("estrella");
  estrella.style.left = Math.random() * 100 + "vw";
  estrella.style.animationDuration = (3 + Math.random() * 2) + "s";
  document.body.appendChild(estrella);
  setTimeout(() => estrella.remove(), 5000);
}
setInterval(crearEstrella, 800);