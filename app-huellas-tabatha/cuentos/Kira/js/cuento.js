 // Variables globales
let voices = [];
let currentSpeech = null;
let textChunks = []; // Para almacenar el texto dividido en fragmentos
let currentChunkIndex = 0;

// Función para obtener todas las voces disponibles
function getVoices() {
  // Obtener todas las voces disponibles
  voices = window.speechSynthesis.getVoices();
  
  // Filtrar voces en español
  const spanishVoices = voices.filter(voice => voice.lang.includes('es'));
  
  return spanishVoices.length > 0 ? spanishVoices : voices;
}

// Inicializar las voces cuando estén disponibles
if (window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = getVoices;
}

// Llamar una vez para intentar obtener las voces inmediatamente
getVoices();

// Función para crear el selector de voces
function createVoiceSelector() {
  const availableVoices = getVoices();
  
  // Si no hay voces disponibles todavía, intentar de nuevo en un momento
  if (availableVoices.length === 0) {
    setTimeout(createVoiceSelector, 500);
    return;
  }
  
  // Crear el contenedor para el selector
  const container = document.createElement('div');
  container.className = 'voice-selector';
  
  // Crear el elemento select
  const select = document.createElement('select');
  select.id = 'voiceSelect';
  
  // Añadir las opciones de voces al selector
  availableVoices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    // Simplificar el nombre de la voz para mostrar solo lo esencial
    const simpleName = voice.name.split(' ')[0]; // Obtener solo el primer nombre
    option.textContent = simpleName;
    select.appendChild(option);
  });
  
  // Crear la etiqueta para el selector
  const label = document.createElement('label');
  label.htmlFor = 'voiceSelect';
  label.textContent = 'Elige la voz del narrador:';
  
  // Añadir los elementos al contenedor
  container.appendChild(label);
  container.appendChild(select);
  
  // Buscar el contenedor de audio-control o crearlo si no existe
  let audioControl = document.querySelector('.audio-control');
  
  if (!audioControl) {
    audioControl = document.createElement('div');
    audioControl.className = 'audio-control';
    
    // Buscar dónde insertar este contenedor
    const textBox = document.querySelector('.text-box');
    if (textBox) {
      textBox.parentNode.insertBefore(audioControl, textBox.nextSibling);
    } else {
      document.body.appendChild(audioControl);
    }
  }
  
  // Insertar el selector de voces al principio del contenedor
  const firstChild = audioControl.firstChild;
  if (firstChild) {
    audioControl.insertBefore(container, firstChild);
  } else {
    audioControl.appendChild(container);
  }
  
  // Guardar la selección del usuario
  select.addEventListener('change', function() {
    localStorage.setItem('selectedVoiceIndex', this.value);
  });
  
  // Cargar preferencia guardada
  const savedVoiceIndex = localStorage.getItem('selectedVoiceIndex');
  if (savedVoiceIndex !== null && savedVoiceIndex < availableVoices.length) {
    select.value = savedVoiceIndex;
  }
}

// Función para dividir el texto en párrafos o frases
function splitTextIntoChunks(text) {
  // Primero dividimos por párrafos
  let paragraphs = text.split(/\n\s*\n/);
  
  let chunks = [];
  // Para cada párrafo largo, podemos dividirlo en frases
  paragraphs.forEach(paragraph => {
    // Si el párrafo es muy largo, lo dividimos en frases
    if (paragraph.length > 200) {
      // Dividir por puntos, pero mantener el punto en el chunk
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
      chunks = chunks.concat(sentences);
    } else {
      chunks.push(paragraph);
    }
  });
  
  return chunks.filter(chunk => chunk.trim().length > 0);
}

// Función para hablar un fragmento específico
function speakChunk(chunkIndex) {
  if (chunkIndex >= textChunks.length) {
    // Se han completado todos los fragmentos
    const button = document.getElementById('playButton');
    button.innerHTML = '▶';
    button.classList.remove('playing');
    currentChunkIndex = 0;
    return;
  }
  
  const chunk = textChunks[chunkIndex];
  const speech = new SpeechSynthesisUtterance(chunk);
  speech.lang = 'es-ES';
  speech.rate = 0.85; // Velocidad más lenta para cuentos infantiles
  speech.pitch = 1.2; // Tono más alto para sonar más animado
  
  // Seleccionar la voz
  const voiceSelect = document.getElementById('voiceSelect');
  const availableVoices = getVoices();
  
  if (voiceSelect && availableVoices.length > 0) {
    // Usar la voz seleccionada por el usuario
    const selectedVoice = availableVoices[voiceSelect.value];
    if (selectedVoice) {
      speech.voice = selectedVoice;
    }
  } else if (availableVoices.length > 0) {
    // Intentar encontrar una voz adecuada automáticamente
    const preferredVoice = availableVoices.find(voice => 
      (voice.name.includes('female') || voice.name.includes('mujer') || 
       voice.name.toLowerCase().includes('elena') || voice.name.toLowerCase().includes('monica') ||
       voice.name.toLowerCase().includes('paulina') || voice.name.toLowerCase().includes('española'))
    );
    
    if (preferredVoice) {
      speech.voice = preferredVoice;
    }
  }
  
  speech.onend = function() {
    // Prevenir un bug común de Chrome que llama onend múltiples veces
    if (chunkIndex === currentChunkIndex) {
      currentChunkIndex++;
      setTimeout(() => {
        // Pequeña pausa entre fragmentos para una mejor experiencia
        speakChunk(currentChunkIndex);
      }, 300);
    }
  };
  
  speech.onerror = function(event) {
    console.error('Error en la síntesis de voz:', event);
    currentChunkIndex = 0;
    const button = document.getElementById('playButton');
    button.innerHTML = '▶';
    button.classList.remove('playing');
  };
  
  // Reiniciar el sintetizador antes de cada fragmento para evitar problemas
  window.speechSynthesis.cancel();
  
  // Hablar el fragmento actual
  window.speechSynthesis.speak(speech);
}

// Función principal para reproducir o pausar el audio
function toggleAudio() {
  const button = document.getElementById('playButton');
  
  // Si hay una narración en curso, la detenemos
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    button.innerHTML = '▶';
    button.classList.remove('playing');
    currentChunkIndex = 0;
    return;
  }
  
  // Obtener el texto a leer
  const textBox = document.querySelector('.text-box');
  if (!textBox) {
    console.error('No se encontró el elemento con clase "text-box"');
    return;
  }
  
  const textToRead = textBox.innerText;
  
  // Dividir el texto en fragmentos manejables
  textChunks = splitTextIntoChunks(textToRead);
  currentChunkIndex = 0;
  
  // Cambiar el estado del botón
  button.innerHTML = '⏸';
  button.classList.add('playing');
  
  // Comenzar a hablar
  speakChunk(currentChunkIndex);
}

// Preventivo contra el bug del tiempo de ejecución en Chrome
function checkAndResumeIfNeeded() {
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    // Pausar y reanudar para solucionar el problema de límite de tiempo
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
  }
}

// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
  // Esperar un momento para que se carguen las voces
  setTimeout(createVoiceSelector, 1000);
  
  // Buscar o crear el contenedor de audio-control
  let audioControl = document.querySelector('.audio-control');
  if (!audioControl) {
    audioControl = document.createElement('div');
    audioControl.className = 'audio-control';
    
    const textBox = document.querySelector('.text-box');
    if (textBox) {
      textBox.parentNode.insertBefore(audioControl, textBox.nextSibling);
    } else {
      document.body.appendChild(audioControl);
    }
  }
  
  // Añadir el botón de reproducción si no existe
  if (!document.getElementById('playButton')) {
    // Crear contenedor para el botón y texto
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.alignItems = 'center';
    
    // Crear el botón
    const button = document.createElement('button');
    button.id = 'playButton';
    button.className = 'play-button';
    button.innerHTML = '▶';
    button.onclick = toggleAudio;
    
    // Crear el texto
    const playText = document.createElement('span');
    playText.className = 'play-text';
    playText.textContent = 'Escuchar cuento';
    
    // Añadir elementos al contenedor
    buttonContainer.appendChild(button);
    buttonContainer.appendChild(playText);
    
    // Añadir al contenedor principal
    audioControl.appendChild(buttonContainer);
  }
  
  // Configurar el intervalo para evitar el límite de tiempo de Chrome
  setInterval(checkAndResumeIfNeeded, 10000);
});

// Detener la narración cuando se abandona la página
window.addEventListener('beforeunload', function() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
});