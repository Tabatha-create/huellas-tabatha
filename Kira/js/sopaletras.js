 // Variables globales
let wordsFound = 0;
let selectedCells = [];
let currentWords = [];
let currentTheme = '';
const gridSize = 10;
let wordGrid = [];

// Múltiples conjuntos de palabras por tema
const wordSets = {
    mascotas: {
        name: "🐾 Cuidado de Mascotas",
        words: ['COMIDA', 'AGUA', 'CARIÑO', 'PASEO', 'VETERINARIO', 'JUGUETES', 'CASA', 'BAÑO'],
        color: '#e76f51'
    },
    animales: {
        name: "🦁 Animales Salvajes",
        words: ['LEON', 'TIGRE', 'ELEFANTE', 'JIRAFA', 'MONO', 'CEBRA', 'RINOCERONTE', 'HIPOPOTAMO'],
        color: '#f4a261'
    },
    colores: {
        name: "🌈 Colores",
        words: ['ROJO', 'AZUL', 'VERDE', 'AMARILLO', 'NARANJA', 'VIOLETA', 'ROSA', 'NEGRO'],
        color: '#e9c46a'
    },
    deportes: {
        name: "⚽ Deportes",
        words: ['FUTBOL', 'BASQUET', 'TENIS', 'NATACION', 'ATLETISMO', 'VOLEIBOL', 'CICLISMO', 'GOLF'],
        color: '#2a9d8f'
    },
    frutas: {
        name: "🍎 Frutas",
        words: ['MANZANA', 'BANANA', 'NARANJA', 'UVA', 'FRESA', 'PIÑA', 'MANGO', 'KIWI'],
        color: '#264653'
    },
    escuela: {
        name: "📚 Escuela",
        words: ['LIBRO', 'LAPIZ', 'CUADERNO', 'PIZARRA', 'MAESTRO', 'ESTUDIANTE', 'MOCHILA', 'REGLA'],
        color: '#7209b7'
    },
    familia: {
        name: "👨‍👩‍👧‍👦 Familia",
        words: ['MAMA', 'PAPA', 'HERMANO', 'HERMANA', 'ABUELO', 'ABUELA', 'PRIMO', 'TIO'],
        color: '#f72585'
    },
    casa: {
        name: "🏠 Casa",
        words: ['COCINA', 'SALA', 'CUARTO', 'BAÑO', 'JARDIN', 'PUERTA', 'VENTANA', 'TECHO'],
        color: '#4361ee'
    }
};

// Función para obtener un tema aleatorio
function getRandomTheme() {
    const themes = Object.keys(wordSets);
    const randomIndex = Math.floor(Math.random() * themes.length);
    return themes[randomIndex];
}

// Función principal para inicializar la sopa de letras
function initWordSearch() {
    console.log('Iniciando nueva sopa de letras...');
    
    // Seleccionar tema aleatorio
    const selectedTheme = getRandomTheme();
    currentTheme = selectedTheme;
    currentWords = [...wordSets[selectedTheme].words];
    
    // Reset variables
    wordsFound = 0;
    selectedCells = [];
    wordGrid = [];
    
    // Actualizar título del tema
    updateThemeDisplay();
    
    // Crear y mostrar la nueva sopa con reintentos si es necesario
    let attempts = 0;
    let success = false;
    
    while (!success && attempts < 3) {
        wordGrid = [];
        createGrid();
        placeWords();
        
        // Verificar que todas las palabras se hayan colocado
        let allWordsPlaced = true;
        currentWords.forEach(word => {
            if (!isWordInGrid(word)) {
                allWordsPlaced = false;
                console.log(`Palabra "${word}" no encontrada en la grilla`);
            }
        });
        
        if (allWordsPlaced) {
            success = true;
        } else {
            console.log(`Intento ${attempts + 1} fallido, reintentando...`);
        }
        attempts++;
    }
    
    fillEmptySpaces();
    displayGrid();
    displayWordsList();
    updateWordScore();
    
    showNotification(`¡Nueva sopa de letras: ${wordSets[selectedTheme].name}!`);
}

// Nueva función para verificar si una palabra está en la grilla
function isWordInGrid(word) {
    // Buscar la palabra en todas las direcciones posibles
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            // Probar las 8 direcciones
            for (let dir = 0; dir < 8; dir++) {
                if (checkWordAtPosition(word, row, col, dir)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function checkWordAtPosition(word, row, col, direction) {
    const directions = [
        [0, 1],   // horizontal derecha
        [0, -1],  // horizontal izquierda
        [1, 0],   // vertical abajo
        [-1, 0],  // vertical arriba
        [1, 1],   // diagonal abajo-derecha
        [1, -1],  // diagonal abajo-izquierda
        [-1, 1],  // diagonal arriba-derecha
        [-1, -1]  // diagonal arriba-izquierda
    ];
    
    const [dRow, dCol] = directions[direction];
    
    for (let i = 0; i < word.length; i++) {
        const newRow = row + i * dRow;
        const newCol = col + i * dCol;
        
        if (newRow >= gridSize || newCol >= gridSize || newRow < 0 || newCol < 0) {
            return false;
        }
        
        if (wordGrid[newRow][newCol] !== word[i]) {
            return false;
        }
    }
    
    return true;
}

// Función para actualizar la visualización del tema
function updateThemeDisplay() {
    const themeElement = document.getElementById('currentTheme');
    if (themeElement) {
        themeElement.textContent = wordSets[currentTheme].name;
        themeElement.style.color = wordSets[currentTheme].color;
    } else {
        // Si no existe el elemento, lo creamos
        const wordsContainer = document.querySelector('.words-container h3');
        if (wordsContainer) {
            wordsContainer.innerHTML = `
                <span id="currentTheme" style="color: ${wordSets[currentTheme].color}">
                    ${wordSets[currentTheme].name}
                </span>
                <br>Palabras a encontrar:
            `;
        }
    }
}

function createGrid() {
    wordGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
}

function placeWords() {
    // Mezclar las palabras para mejor distribución
    const shuffledWords = [...currentWords].sort(() => Math.random() - 0.5);
    
    shuffledWords.forEach(word => {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 200) { // Más intentos
            const direction = Math.floor(Math.random() * 8);
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            
            if (canPlaceWord(word, row, col, direction)) {
                placeWord(word, row, col, direction);
                placed = true;
                console.log(`Palabra "${word}" colocada en fila ${row}, columna ${col}, dirección ${direction}`);
            }
            attempts++;
        }
        
        if (!placed) {
            console.warn(`No se pudo colocar la palabra: ${word}`);
            // Intentar forzar colocación en horizontal
            placed = forceWordPlacement(word);
        }
    });
}

// Nueva función para forzar colocación de palabras problemáticas
function forceWordPlacement(word) {
    // Intentar colocación horizontal simple
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col <= gridSize - word.length; col++) {
            let canPlace = true;
            
            // Verificar si el espacio está disponible
            for (let i = 0; i < word.length; i++) {
                if (wordGrid[row][col + i] !== '' && wordGrid[row][col + i] !== word[i]) {
                    canPlace = false;
                    break;
                }
            }
            
            if (canPlace) {
                // Colocar la palabra
                for (let i = 0; i < word.length; i++) {
                    wordGrid[row][col + i] = word[i];
                }
                console.log(`Palabra "${word}" colocada forzadamente en fila ${row}, columna ${col}`);
                return true;
            }
        }
    }
    return false;
}

function canPlaceWord(word, row, col, direction) {
    // 8 direcciones: horizontal, vertical, diagonal en todas las direcciones
    const directions = [
        [0, 1],   // horizontal derecha
        [0, -1],  // horizontal izquierda
        [1, 0],   // vertical abajo
        [-1, 0],  // vertical arriba
        [1, 1],   // diagonal abajo-derecha
        [1, -1],  // diagonal abajo-izquierda
        [-1, 1],  // diagonal arriba-derecha
        [-1, -1]  // diagonal arriba-izquierda
    ];
    
    const [dRow, dCol] = directions[direction];
    
    for (let i = 0; i < word.length; i++) {
        const newRow = row + i * dRow;
        const newCol = col + i * dCol;
        
        if (newRow >= gridSize || newCol >= gridSize || newRow < 0 || newCol < 0) {
            return false;
        }
        
        if (wordGrid[newRow][newCol] !== '' && wordGrid[newRow][newCol] !== word[i]) {
            return false;
        }
    }
    
    return true;
}

function placeWord(word, row, col, direction) {
    const directions = [
        [0, 1],   // horizontal derecha
        [0, -1],  // horizontal izquierda
        [1, 0],   // vertical abajo
        [-1, 0],  // vertical arriba
        [1, 1],   // diagonal abajo-derecha
        [1, -1],  // diagonal abajo-izquierda
        [-1, 1],  // diagonal arriba-derecha
        [-1, -1]  // diagonal arriba-izquierda
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
    
    currentWords.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word-item';
        wordElement.textContent = word;
        wordElement.dataset.word = word;
        wordsListElement.appendChild(wordElement);
    });
}

function selectCell(cell) {
    if (cell.classList.contains('found')) return;
    
    // Si la celda ya está seleccionada, deseleccionarla
    if (cell.classList.contains('selected')) {
        cell.classList.remove('selected');
        selectedCells = selectedCells.filter(c => c !== cell);
    } else {
        // Seleccionar la celda
        cell.classList.add('selected');
        selectedCells.push(cell);
    }
    
    checkForWords();
}

function checkForWords() {
    currentWords.forEach(word => {
        if (isWordInSelection(word)) {
            console.log(`¡Palabra encontrada: ${word}!`);
            markWordAsFound(word);
        }
    });
}

function isWordInSelection(word) {
    if (selectedCells.length !== word.length) return false;
    
    // Verificar si las celdas seleccionadas forman una línea
    if (!areCellsInLine()) return false;
    
    // CORRECCIÓN PRINCIPAL: Mantener el orden de selección del usuario
    const selectedText = selectedCells.map(cell => cell.textContent).join('');
    const reversedText = selectedText.split('').reverse().join('');
    
    return selectedText === word || reversedText === word;
}

function areCellsInLine() {
    if (selectedCells.length < 2) return true;
    
    // Verificar si las celdas forman una línea recta
    const first = selectedCells[0];
    const last = selectedCells[selectedCells.length - 1];
    
    const deltaRow = parseInt(last.dataset.row) - parseInt(first.dataset.row);
    const deltaCol = parseInt(last.dataset.col) - parseInt(first.dataset.col);
    
    // Calcular la dirección esperada
    const length = selectedCells.length - 1;
    const expectedDeltaRow = length > 0 ? deltaRow / length : 0;
    const expectedDeltaCol = length > 0 ? deltaCol / length : 0;
    
    // Verificar que todas las celdas estén en la línea esperada
    for (let i = 1; i < selectedCells.length - 1; i++) {
        const current = selectedCells[i];
        const expectedRow = parseInt(first.dataset.row) + Math.round(expectedDeltaRow * i);
        const expectedCol = parseInt(first.dataset.col) + Math.round(expectedDeltaCol * i);
        
        if (parseInt(current.dataset.row) !== expectedRow || parseInt(current.dataset.col) !== expectedCol) {
            return false;
        }
    }
    
    return true;
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
        showNotification(`¡Encontraste "${word}"! 🎉`);
    }
    
    selectedCells = [];
}

function updateWordScore() {
    document.getElementById('wordScore').textContent = `Palabras encontradas: ${wordsFound}/${currentWords.length}`;
    
    if (wordsFound === currentWords.length) {
        setTimeout(() => showCelebration(), 500);
    }
}

function showCelebration() {
    const celebration = document.getElementById('celebration');
    const celebrationText = celebration.querySelector('h2');
    const themeInfo = wordSets[currentTheme];
    
    celebrationText.innerHTML = `
        ¡Felicitaciones! 🎉<br>
        <span style="font-size: 1.2rem; color: ${themeInfo.color};">
            Completaste: ${themeInfo.name}
        </span>
    `;
    
    celebration.classList.add('show');
}

function closeCelebration() {
    document.getElementById('celebration').classList.remove('show');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #e76f51, #f4a261);
        color: white;
        padding: 1rem 2rem;
        border-radius: 15px;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        font-weight: bold;
        font-family: 'Comic Sans MS', cursive;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Función para obtener estadísticas del juego
function getGameStats() {
    const themes = Object.keys(wordSets);
    return {
        totalThemes: themes.length,
        currentTheme: wordSets[currentTheme].name,
        wordsInCurrentTheme: currentWords.length,
        wordsFound: wordsFound
    };
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada, inicializando sopa de letras...');
    console.log(`Temas disponibles: ${Object.keys(wordSets).length}`);
    initWordSearch();
});