const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
let img = new Image();
let color = '#FF0000';

// 🎨 Paletas por imagen
const paletasPorImagen = {
  'cestaColorear.png': ['#2a1d0a', '#89752f', '#ba681b', '#fbc86b', '#f8daa9', '#723a13', '#d4801f', '#beae4b', '#b28f43', '#e09d44'],
  'dormidaColorear.png': ['#502b0d', '#f3cc89', '#d3720f', '#b2550e', '#ebc374', '#a7875e', '#f9e0b1', '#74654c', '#847451', '#b49c68'],
  'pelotaColorear.png': ['#dcbb59', '#372209', '#873f13', '#c4711e', '#eed592', '#999240', '#80763f', '#5c5437', '#f4d47c', '#dc5424'],
  'tanyiColorear.png': ['#472711', '#fbc874', '#b85118', '#d37720', '#f9e6c0', '#c38a51', '#7c7461', '#f9d28e', '#e0a758', '#aca489']
};

// 🖌️ Elegir color actual
function seleccionarColor(c) {
  color = c;
}

// 🖼️ Cargar imagen y su paleta
function cargarImagen(nombreArchivo) {
  img.src = nombreArchivo;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  document.getElementById('referencia').src = nombreArchivo.replace('.png', '-color.png');

  const nombreBase = nombreArchivo.split('/').pop();
  generarPaleta(nombreBase);
}

// 🎨 Mostrar paleta de la imagen activa
function generarPaleta(nombreBase) {
  const contenedor = document.getElementById('paletas');
  contenedor.innerHTML = '';
  const colores = paletasPorImagen[nombreBase];
  if (!colores) return;

  const divPaleta = document.createElement('div');
  divPaleta.classList.add('paleta');

  colores.forEach(hex => {
    const btn = document.createElement('button');
    btn.style.background = hex;
    btn.onclick = () => seleccionarColor(hex);
    divPaleta.appendChild(btn);
  });

  contenedor.appendChild(divPaleta);
}

// 🖱️ Detectar clic en canvas y rellenar
canvas.addEventListener('click', function (e) {
  const x = e.offsetX;
  const y = e.offsetY;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const targetColor = getPixel(imageData, x, y);
  const fillColor = hexToRgb(color);

  // Evitar colorear si el color ya está aplicado
  if (!targetColor || colorsMatch(targetColor, fillColor)) return;

  floodFill(imageData, x, y, targetColor, fillColor);
  ctx.putImageData(imageData, 0, 0);
});

// 🎯 Obtener color de un píxel
function getPixel(imgData, x, y) {
  const index = (y * imgData.width + x) * 4;
  return imgData.data.slice(index, index + 4);
}

// 🎯 Comparar colores con tolerancia
function colorsMatch(a, b, tolerance = 8) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tolerance);
}

// 🪄 Algoritmo de relleno
function floodFill(imgData, x, y, target, fill) {
  if (!target || !fill || colorsMatch(target, fill)) return;

  const stack = [[x, y]];
  const visited = new Set();

  while (stack.length > 0) {
    const [cx, cy] = stack.pop();
    const index = (cy * imgData.width + cx) * 4;
    const key = `${cx},${cy}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const current = imgData.data.slice(index, index + 4);
    if (!colorsMatch(current, target)) continue;

    imgData.data.set([...fill, 255], index);

    if (cx > 0) stack.push([cx - 1, cy]);
    if (cx < imgData.width - 1) stack.push([cx + 1, cy]);
    if (cy > 0) stack.push([cx, cy - 1]);
    if (cy < imgData.height - 1) stack.push([cx, cy + 1]);
  }
}

// 🔄 Convertir HEX a RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// ✨ Pintar automático con imagen original coloreada
function colorearAutomatico() {
  const imgColor = new Image();
  const archivoColor = img.src.replace('.png', '-color.png');
  imgColor.src = archivoColor;
  imgColor.onload = () => ctx.drawImage(imgColor, 0, 0, canvas.width, canvas.height);
}

// 💾 Descargar imagen coloreada
function guardar() {
  const link = document.createElement('a');
  link.download = 'cuento-coloreado.png';
  link.href = canvas.toDataURL();
  link.click();
}

// 🧼 Limpiar canvas
function limpiar() {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// 🖼️ Imagen inicial
cargarImagen('img/colorear/cestaColorear.png');
