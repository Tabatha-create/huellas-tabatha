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

function activarCelebracion() {
  // Estrellitas doradas
  for (let i = 0; i < 30; i++) {
    const estrella = document.createElement("div");
    estrella.classList.add("estrella");
    estrella.style.left = Math.random() * 100 + "vw";
    estrella.style.animationDuration = (3 + Math.random() * 2) + "s";
    document.body.appendChild(estrella);
    setTimeout(() => estrella.remove(), 6000);
  }

  // Serpentinas 🎀
  for (let i = 0; i < 20; i++) {
    const serpentina = document.createElement("div");
    serpentina.classList.add("serpentina");
    serpentina.style.left = Math.random() * 100 + "vw";
    serpentina.style.backgroundColor = getColorCuento();
    document.body.appendChild(serpentina);
    setTimeout(() => serpentina.remove(), 5000);
  }

  // Globos 🎈
  for (let i = 0; i < 10; i++) {
    const globo = document.createElement("div");
    globo.classList.add("globo");
    globo.style.left = Math.random() * 100 + "vw";
    globo.style.backgroundColor = getColorCuento();
    document.body.appendChild(globo);
    setTimeout(() => globo.remove(), 7000);
  }
}

// Generador de color suave
function getColorCuento() {
  const colores = ['#ffd27d', '#f6c8de', '#78c3dc', '#ff9fbb'];
  return colores[Math.floor(Math.random() * colores.length)];
}