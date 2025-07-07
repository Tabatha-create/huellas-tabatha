const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');

let img = new Image();
let color = '#FF0000';

function seleccionarColor(c) {
  color = c;
}

function cargarImagen(nombreArchivo) {
  img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Cargar imagen de referencia
    const ref = document.getElementById('referencia');
    ref.src = nombreArchivo.replace('.png', '-color.png');

    // Mostrar la paleta correspondiente
    mostrarPaleta(nombreArchivo);
  };
  img.src = nombreArchivo;
}

canvas.addEventListener('click', function (e) {
  const x = e.offsetX;
  const y = e.offsetY;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const targetColor = getPixel(imageData, x, y);
  const fillColor = hexToRgb(color);
  floodFill(imageData, x, y, targetColor, fillColor);
  ctx.putImageData(imageData, 0, 0);
});

function getPixel(imgData, x, y) {
  const index = (y * imgData.width + x) * 4;
  return imgData.data.slice(index, index + 4);
}

function colorsMatch(a, b) {
  return a.every((v, i) => v === b[i]);
}

function floodFill(imgData, x, y, target, fill) {
  const stack = [[x, y]];
  while (stack.length > 0) {
    const [cx, cy] = stack.pop();
    const index = (cy * imgData.width + cx) * 4;
    const current = imgData.data.slice(index, index + 4);
    if (!colorsMatch(current, target)) continue;
    imgData.data.set([...fill, 255], index);

    if (cx > 0) stack.push([cx - 1, cy]);
    if (cx < imgData.width - 1) stack.push([cx + 1, cy]);
    if (cy > 0) stack.push([cx, cy - 1]);
    if (cy < imgData.height - 1) stack.push([cx, cy + 1]);
  }
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function colorearAutomatico() {
  const imgColor = new Image();
  const archivoColor = img.src.replace('.png', '-color.png');
  imgColor.onload = () => ctx.drawImage(imgColor, 0, 0, canvas.width, canvas.height);
  imgColor.src = archivoColor;
}

function guardar() {
  const link = document.createElement('a');
  link.download = 'cuento-coloreado.png';
  link.href = canvas.toDataURL();
  link.click();
}

function limpiar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function mostrarPaleta(nombreArchivo) {
  const paletas = ['cesta', 'dormida', 'pelota', 'tanyi'];
  const match = nombreArchivo.match(/\/(\w+?)Colorear\.png$/i);
  const cuento = match ? match[1] : '';

  paletas.forEach(pal => {
    const div = document.getElementById(`paleta-${pal}`);
    if (div) {
      div.style.display = (pal === cuento) ? 'flex' : 'none';
    }
  });
}

// Imagen inicial
cargarImagen('img/colorear/cestaColorear.png');