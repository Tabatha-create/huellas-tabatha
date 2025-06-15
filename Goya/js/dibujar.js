// Variables globales para el canvas de dibujo
let canvas, ctx;
let isDrawing = false;
let currentColor = '#000000';
let currentTool = 'brush';
let brushSize = 5;
let lastX = 0;
let lastY = 0;

// Datos de consejos para diferentes animales
const animalTips = {
  chick: {
    title: "🐥 Consejos para dibujar un pollito",
    tips: [
      "• Empieza con un círculo grande para el cuerpo y uno más pequeño para la cabeza",
      "• El pico es pequeño y puntiagudo, de color naranja o amarillo",
      "• Las patitas son delgadas como palitos con pequeños deditos",
      "• Todo su cuerpo está cubierto de plumitas suaves y esponjosas",
      "• Puedes dibujar pequeñas alas redondeadas a los lados"
    ]
  },
  fish: {
    title: "🐠 Consejos para dibujar un pececito",
    tips: [
      "• El cuerpo es como un óvalo alargado con punta en un extremo",
      "• La cola es triangular o en forma de abanico",
      "• Las aletas son pequeñas y pueden ser onduladas",
      "• Los ojos son grandes y redondos para que se vea simpático",
      "• Puedes agregar escamas con pequeños círculos o líneas curvas"
    ]
  },
  turtle: {
    title: "🐢 Consejos para dibujar una tortuguita",
    tips: [
      "• El caparazón es como un óvalo grande con patrones hexagonales",
      "• La cabeza es pequeña y puede salir del caparazón",
      "• Las patitas son cortas y redonditas",
      "• Los ojos pequeños y dulces la hacen ver tierna",
      "• Puedes dibujar líneas en el caparazón para mostrar los segmentos"
    ]
  },
  monkey: {
    title: "🐵 Consejos para dibujar un monito",
    tips: [
      "• La cara es redonda con una zona más clara alrededor de la boca",
      "• Los brazos son largos y delgados para columpiarse",
      "• La cola larga y curvada es muy importante",
      "• Las orejas son redondas y sobresalen de la cabeza",
      "• Puedes agregar plátanos cerca para completar el dibujo"
    ]
  },
};

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  initializeCanvas();
  setupEventListeners();
});

// Inicializar el canvas
function initializeCanvas() {
  canvas = document.getElementById('drawingCanvas');
  ctx = canvas.getContext('2d');
  
  // Configuración inicial del canvas
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = brushSize;
  ctx.strokeStyle = currentColor;
  
  // Rellenar el canvas con fondo blanco
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Configurar event listeners
function setupEventListeners() {
  // Eventos del mouse para desktop
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
  
  // Eventos táctiles para móviles
  canvas.addEventListener('touchstart', handleTouch);
  canvas.addEventListener('touchmove', handleTouch);
  canvas.addEventListener('touchend', stopDrawing);
  
  // Prevenir el scroll en móviles cuando se toca el canvas
  document.body.addEventListener('touchstart', function(e) {
    if (e.target === canvas) {
      e.preventDefault();
    }
  }, { passive: false });
  
  document.body.addEventListener('touchend', function(e) {
    if (e.target === canvas) {
      e.preventDefault();
    }
  }, { passive: false });
  
  document.body.addEventListener('touchmove', function(e) {
    if (e.target === canvas) {
      e.preventDefault();
    }
  }, { passive: false });
}

// Obtener coordenadas del mouse/touch
function getCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  if (e.touches) {
    return {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY
    };
  } else {
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }
}

// Iniciar el dibujo
function startDrawing(e) {
  isDrawing = true;
  const coords = getCoordinates(e);
  lastX = coords.x;
  lastY = coords.y;
}

// Dibujar
function draw(e) {
  if (!isDrawing) return;
  
  const coords = getCoordinates(e);
  
  ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = brushSize;
  
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(coords.x, coords.y);
  ctx.stroke();
  
  lastX = coords.x;
  lastY = coords.y;
}

// Detener el dibujo
function stopDrawing() {
  isDrawing = false;
}

// Manejar eventos táctiles
function handleTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                   e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}

// Seleccionar color
function selectColor(color) {
  currentColor = color;
  
  // Actualizar botones de color
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  event.target.classList.add('active');
  
  // Si estaba en modo borrador y selecciona un color, cambiar a pincel
  if (currentTool === 'eraser') {
    selectTool('brush');
  }
}

// Seleccionar herramienta
function selectTool(tool) {
  currentTool = tool;
  
  // Actualizar botones de herramientas
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
  
  // Cambiar cursor según la herramienta
  canvas.style.cursor = tool === 'eraser' ? 'grab' : 'crosshair';
}

// Cambiar tamaño del pincel
function changeBrushSize(size) {
  brushSize = parseInt(size);
  document.getElementById('sizeValue').textContent = size;
}

// Limpiar canvas
function clearCanvas() {
  if (confirm('¿Estás seguro de que quieres borrar todo tu dibujo?')) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    showNotification('¡Canvas limpiado! 🧹');
  }
}

// Guardar dibujo
function saveDrawing() {
  try {
    // Crear un nombre para el archivo basado en el nombre de la mascota
    const petName = document.getElementById('petName').value || 'mi_mascota';
    const fileName = `${petName.replace(/\s+/g, '_')}_dibujo.png`;
    
    // Crear enlace de descarga
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL();
    
    // Simular click para descargar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('¡Dibujo guardado exitosamente! 💾');
  } catch (error) {
    showNotification('Error al guardar el dibujo 😞', 'error');
  }
}

// Compartir dibujo
function shareDrawing() {
  if (navigator.share && navigator.canShare) {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'mi_mascota.png', { type: 'image/png' });
      
      try {
        await navigator.share({
          title: 'Mi mascota dibujada en Goya, una maravilla',
          text: '¡Mira el dibujo de mi mascota ideal!',
          files: [file]
        });
        showNotification('¡Dibujo compartido! 📤');
      } catch (error) {
        fallbackShare();
      }
    });
  } else {
    fallbackShare();
  }
}

// Método alternativo para compartir
function fallbackShare() {
  try {
    const dataURL = canvas.toDataURL();
    const newWindow = window.open();
    newWindow.document.write(`
      <html>
        <head><title>Mi Mascota Ideal</title></head>
        <body style="margin:0; padding:20px; text-align:center; font-family: Comic Sans MS, cursive;">
          <h2>¡Mi Mascota Ideal!</h2>
          <img src="${dataURL}" style="max-width:100%; border:3px solid #e76f51; border-radius:15px;">
          <p>Dibujado en Goya, una maravilla</p>
          <button onclick="window.print()" style="padding:10px 20px; background:#e76f51; color:white; border:none; border-radius:10px; cursor:pointer;">Imprimir</button>
        </body>
      </html>
    `);
    showNotification('¡Dibujo abierto en nueva ventana! 🖼️');
  } catch (error) {
    showNotification('Error al compartir el dibujo 😞', 'error');
  }
}

// Mostrar consejos de animales
function showAnimalTips(animalType) {
  const tips = animalTips[animalType];
  if (!tips) return;
  
  const modal = document.getElementById('animalTipsModal');
  const title = document.getElementById('animalTitle');
  const tipsContainer = document.getElementById('animalTips');
  
  title.textContent = tips.title;
  tipsContainer.innerHTML = tips.tips.map(tip => `<p style="margin: 0.8rem 0; padding: 0.5rem; background: #f8f9ff; border-radius: 8px; border-left: 3px solid #e76f51;">${tip}</p>`).join('');
  
  modal.style.display = 'block';
}

// Cerrar modal
function closeModal() {
  document.getElementById('animalTipsModal').style.display = 'none';
}

// Mostrar notificación
function showNotification(message, type = 'success') {
  const notification = document.getElementById('saveNotification');
  const textElement = notification.querySelector('.notification-text');
  const iconElement = notification.querySelector('.notification-icon');
  
  textElement.textContent = message;
  
  if (type === 'error') {
    iconElement.textContent = '❌';
    notification.querySelector('.notification-content').style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
  } else {
    iconElement.textContent = '✅';
    notification.querySelector('.notification-content').style.background = 'linear-gradient(135deg, #28a745, #20c997)';
  }
  
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Cerrar modal al hacer click fuera de él
window.onclick = function(event) {
  const modal = document.getElementById('animalTipsModal');
  if (event.target === modal) {
    closeModal();
  }
}

// Funciones adicionales para mejorar la experiencia
document.addEventListener('keydown', function(e) {
  // Atajos de teclado
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'z':
        e.preventDefault();
        // Implementar deshacer (requeriría historial de estados)
        showNotification('Función de deshacer próximamente 🔄');
        break;
      case 's':
        e.preventDefault();
        saveDrawing();
        break;
    }
  }
  
  // Cambiar herramientas con teclas
  switch(e.key) {
    case 'b':
      selectTool('brush');
      break;
    case 'e':
      selectTool('eraser');
      break;
  }
});

// Redimensionar canvas si es necesario
window.addEventListener('resize', function() {
  // Guardar el contenido actual
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Redimensionar manteniendo la proporción
  const container = canvas.parentElement;
  const maxWidth = Math.min(400, container.clientWidth - 40);
  const maxHeight = Math.min(300, maxWidth * 0.75);
  
  canvas.style.width = maxWidth + 'px';
  canvas.style.height = maxHeight + 'px';
  
  // Restaurar el contenido
  ctx.putImageData(imageData, 0, 0);
});