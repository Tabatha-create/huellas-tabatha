 // Variables globales para el juego de colorear
let canvas, ctx;
let selectedColor = '#FF6B6B';
let isDrawing = false;
let currentImage = null;
let brushSize = 20;

// Paleta de colores amigable para niños
const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#FAD7A0', '#D7BDE2',
  '#A3E4D7', '#FFA07A', '#D5DBDB', '#8B4513', '#000000'
];

// Imágenes base para colorear (contornos simples)
const tanyiTemplates = {
  'img/tanyi_colorear.png': drawTanyiBasket,
  'img/Tanyi_pelota.png': drawTanyiBall,
  'img/tanyi_parque.png': drawTanyiPark,
  'img/tanyi_jugando.png': drawTanyiPlaying
};

// Inicializar cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
  initColoringGame();
});

function initColoringGame() {
  canvas = document.getElementById('canvas');
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  
  // Ajustar canvas al contenedor
  resizeCanvas();
  
  // Crear paleta de colores
  createColorPalette();
  
  // Configurar eventos
  setupCanvasEvents();
  setupImageSelector();
  
  // Cargar imagen inicial
  loadTemplate('img/tanyi_colorear.png');
}

function resizeCanvas() {
  const container = canvas.parentElement;
  const rect = container.getBoundingClientRect();
  canvas.style.width = '100%';
  canvas.style.height = 'auto';
}

function createColorPalette() {
  const palette = document.getElementById('palette');
  if (!palette) return;
  
  palette.innerHTML = ''; // Limpiar paleta existente
  
  colors.forEach((color, index) => {
    const colorDiv = document.createElement('div');
    colorDiv.className = 'color-swatch';
    colorDiv.style.cssText = `
      width: 50px;
      height: 50px;
      background-color: ${color};
      border-radius: 50%;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.3s ease;
      display: inline-block;
      margin: 5px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    
    colorDiv.addEventListener('click', () => selectColor(color, colorDiv));
    colorDiv.addEventListener('mouseenter', () => {
      colorDiv.style.transform = 'scale(1.1)';
      colorDiv.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    });
    colorDiv.addEventListener('mouseleave', () => {
      if (!colorDiv.classList.contains('selected')) {
        colorDiv.style.transform = 'scale(1)';
        colorDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      }
    });
    
    palette.appendChild(colorDiv);
    
    // Seleccionar primer color por defecto
    if (index === 0) {
      selectColor(color, colorDiv);
    }
  });
}

function selectColor(color, element) {
  selectedColor = color;
  
  // Remover selección anterior
  document.querySelectorAll('.color-swatch').forEach(el => {
    el.classList.remove('selected');
    el.style.borderColor = 'transparent';
    el.style.transform = 'scale(1)';
  });
  
  // Seleccionar nuevo color
  element.classList.add('selected');
  element.style.borderColor = '#333';
  element.style.transform = 'scale(1.2)';
  element.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
}

function setupCanvasEvents() {
  // Eventos de mouse
  canvas.addEventListener('mousedown', startPainting);
  canvas.addEventListener('mousemove', paint);
  canvas.addEventListener('mouseup', stopPainting);
  canvas.addEventListener('mouseleave', stopPainting);
  
  // Eventos táctiles para dispositivos móviles
  canvas.addEventListener('touchstart', handleTouch);
  canvas.addEventListener('touchmove', handleTouch);
  canvas.addEventListener('touchend', stopPainting);
}

function setupImageSelector() {
  const selector = document.getElementById('imageSelector');
  if (selector) {
    selector.addEventListener('change', function() {
      loadTemplate(this.value);
    });
  }
}

function getCanvasPosition(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

function startPainting(e) {
  isDrawing = true;
  const pos = getCanvasPosition(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function paint(e) {
  if (!isDrawing) return;
  
  const pos = getCanvasPosition(e);
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = selectedColor;
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function stopPainting() {
  isDrawing = false;
  ctx.beginPath();
}

function handleTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                   e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  
  if (e.type === 'touchstart') startPainting(mouseEvent);
  else if (e.type === 'touchmove') paint(mouseEvent);
}

function loadTemplate(imagePath) {
  currentImage = imagePath;
  
  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar el template correspondiente
  if (tanyiTemplates[imagePath]) {
    tanyiTemplates[imagePath]();
  } else {
    // Template por defecto si no existe la imagen
    drawTanyiBasket();
  }
}

// Templates de dibujo para colorear
function drawTanyiBasket() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Configurar estilo de líneas
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.fillStyle = 'white';
  
  // Cesta
  ctx.beginPath();
  ctx.rect(200, 350, 300, 100);
  ctx.fill();
  ctx.stroke();
  
  // Líneas decorativas de la cesta
  for (let i = 220; i < 480; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, 350);
    ctx.lineTo(i, 450);
    ctx.stroke();
  }
  
  // Cuerpo de Tanyi
  ctx.beginPath();
  ctx.ellipse(350, 320, 80, 60, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Cabeza
  ctx.beginPath();
  ctx.ellipse(350, 220, 60, 55, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Orejas
  ctx.beginPath();
  ctx.ellipse(320, 190, 20, 35, -0.3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(380, 190, 20, 35, 0.3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Ojos
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(335, 210, 8, 10, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(365, 210, 8, 10, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Nariz
  ctx.beginPath();
  ctx.ellipse(350, 235, 6, 4, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Boca
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(350, 245, 12, 0.2, 2.9);
  ctx.stroke();
  
  // Patas visibles
  ctx.fillStyle = 'white';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  
  ctx.beginPath();
  ctx.ellipse(320, 380, 15, 25, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(380, 380, 15, 25, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawTanyiBall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.fillStyle = 'white';
  
  // Pelota
  ctx.beginPath();
  ctx.ellipse(500, 200, 50, 50, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Líneas de la pelota
  ctx.beginPath();
  ctx.moveTo(450, 200);
  ctx.lineTo(550, 200);
  ctx.moveTo(500, 150);
  ctx.lineTo(500, 250);
  ctx.stroke();
  
  // Cuerpo de Tanyi (en posición de juego)
  ctx.beginPath();
  ctx.ellipse(280, 300, 70, 50, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Cabeza
  ctx.beginPath();
  ctx.ellipse(280, 200, 55, 50, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Orejas
  ctx.beginPath();
  ctx.ellipse(250, 170, 18, 30, -0.4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(310, 170, 18, 30, 0.4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Ojos
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(265, 190, 7, 9, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(295, 190, 7, 9, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Nariz
  ctx.beginPath();
  ctx.ellipse(280, 210, 5, 3, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Boca (emocionada)
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(280, 220, 15, 0.1, 3.0);
  ctx.stroke();
  
  // Patas
  ctx.fillStyle = 'white';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  
  // Patas traseras
  ctx.beginPath();
  ctx.ellipse(250, 340, 12, 20, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(310, 340, 12, 20, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Pata delantera (hacia la pelota)
  ctx.beginPath();
  ctx.ellipse(350, 280, 12, 20, 0.8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Cola
  ctx.beginPath();
  ctx.ellipse(220, 290, 8, 25, -0.6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawTanyiPark() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Cielo
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, canvas.width, 250);
  
  // Suelo
  ctx.fillStyle = '#90EE90';
  ctx.fillRect(0, 250, canvas.width, canvas.height - 250);
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  
  // Árbol
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.rect(80, 150, 25, 100);
  ctx.fill();
  ctx.stroke();
  
  // Copa del árbol
  ctx.fillStyle = '#228B22';
  ctx.beginPath();
  ctx.ellipse(92, 140, 40, 35, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Tanyi en el parque
  ctx.fillStyle = 'white';
  
  // Cuerpo
  ctx.beginPath();
  ctx.ellipse(350, 320, 75, 55, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Cabeza
  ctx.beginPath();
  ctx.ellipse(350, 230, 60, 55, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Orejas
  ctx.beginPath();
  ctx.ellipse(320, 200, 20, 35, -0.3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(380, 200, 20, 35, 0.3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Ojos
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(335, 220, 8, 10, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(365, 220, 8, 10, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Nariz
  ctx.beginPath();
  ctx.ellipse(350, 245, 6, 4, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Boca
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(350, 255, 12, 0.2, 2.9);
  ctx.stroke();
  
  // Patas
  ctx.fillStyle = 'white';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  
  ctx.beginPath();
  ctx.ellipse(320, 365, 15, 25, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(350, 365, 15, 25, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(380, 365, 15, 25, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Cola
  ctx.beginPath();
  ctx.ellipse(420, 310, 10, 30, 0.5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawTanyiPlaying() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Fondo colorido
  ctx.fillStyle = '#FFE4B5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  
  // Juguetes
  // Pelota pequeña
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(150, 380, 25, 25, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Hueso
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.rect(500, 370, 60, 12);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(500, 376, 8, 8, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(560, 376, 8, 8, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Tanyi jugando (posición divertida)
  ctx.fillStyle = 'white';
  
  // Cuerpo
  ctx.beginPath();
  ctx.ellipse(350, 280, 80, 60, 0.2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Cabeza
  ctx.beginPath();
  ctx.ellipse(280, 200, 55, 50, -0.2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Orejas (movimiento)
  ctx.beginPath();
  ctx.ellipse(250, 170, 18, 30, -0.6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(310, 160, 18, 30, 0.2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Ojos
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(265, 190, 7, 9, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(295, 190, 7, 9, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Nariz
  ctx.beginPath();
  ctx.ellipse(280, 210, 5, 3, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Lengua (jugando)
  ctx.fillStyle = '#FF69B4';
  ctx.beginPath();
  ctx.ellipse(280, 225, 8, 12, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Patas en movimiento
  ctx.fillStyle = 'white';
  
  ctx.beginPath();
  ctx.ellipse(320, 350, 12, 20, 0.3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(380, 340, 12, 20, -0.2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(250, 280, 12, 20, -0.8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Cola moviéndose
  ctx.beginPath();
  ctx.ellipse(420, 260, 10, 30, 0.8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

// Función para limpiar el canvas
function clearCanvas() {
  if (currentImage && tanyiTemplates[currentImage]) {
    tanyiTemplates[currentImage]();
  } else {
    drawTanyiBasket();
  }
}

// Función para cambiar el tamaño del pincel
function setBrushSize(size) {
  brushSize = size;
}