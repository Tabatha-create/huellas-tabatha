 // Variables globales
let voices = [];
let currentSpeech = null;

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
  container.style.margin = '10px 0';
  
  // Crear el elemento select
  const select = document.createElement('select');
  select.id = 'voiceSelect';
  select.style.padding = '5px';
  select.style.borderRadius = '5px';
  select.style.marginLeft = '10px';
  
  // Añadir las opciones de voces al selector
  availableVoices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    select.appendChild(option);
  });
  
  // Crear la etiqueta para el selector
  const label = document.createElement('label');
  label.htmlFor = 'voiceSelect';
  label.textContent = 'Voz del narrador: ';
  
  // Añadir los elementos al contenedor
  container.appendChild(label);
  container.appendChild(select);
  
  // Buscar el botón de reproducción
  const playButton = document.getElementById('playButton');
  if (playButton) {
    // Insertar el selector antes del botón
    playButton.parentNode.insertBefore(container, playButton);
  } else {
    // Si no hay botón, añadir el selector al final del cuerpo del documento
    document.body.appendChild(container);
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

// Función principal para reproducir o pausar el audio
function toggleAudio() {
  const button = document.getElementById('playButton');
  
  // Si hay una narración en curso, la detenemos
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    button.innerHTML = '▶';
    return;
  }
  
  // Obtener el texto a leer
  const textBox = document.querySelector('.text-box');
  if (!textBox) {
    console.error('No se encontró el elemento con clase "text-box"');
    return;
  }
  
  const textToRead = textBox.innerText;
  
  // Crear el objeto de síntesis de voz
  const speech = new SpeechSynthesisUtterance(textToRead);
  speech.lang = 'es-ES';
  speech.rate = 0.9; // Velocidad más lenta para niños
  speech.pitch = 1.1; // Tono ligeramente más alto para sonar más animado
  
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
  
  // Guardar referencia global a la narración actual
  currentSpeech = speech;
  
  // Iniciar la narración
  window.speechSynthesis.speak(speech);
  button.innerHTML = '⏸';
  
  // Cambiar el botón cuando termine la narración
  speech.onend = function() {
    button.innerHTML = '▶';
    currentSpeech = null;
  };
  
  // Manejar errores
  speech.onerror = function(event) {
    console.error('Error en la síntesis de voz:', event);
    button.innerHTML = '▶';
    currentSpeech = null;
  };
}

// Inicializar el selector de voces cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
  // Esperar un momento para que se carguen las voces
  setTimeout(createVoiceSelector, 1000);
  
  // Añadir el botón de reproducción si no existe
  if (!document.getElementById('playButton')) {
    const button = document.createElement('button');
    button.id = 'playButton';
    button.innerHTML = '▶';
    button.onclick = toggleAudio;
    button.style.padding = '10px 15px';
    button.style.borderRadius = '50%';
    button.style.background = 'var(--primary-color, #4a90e2)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.fontSize = '20px';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    button.style.margin = '10px 0';
    
    // Buscar donde insertar el botón (después del selector o al final del texto)
    const textBox = document.querySelector('.text-box');
    if (textBox) {
      textBox.parentNode.insertBefore(button, textBox.nextSibling);
    } else {
      document.body.appendChild(button);
    }
  }
});

// Detener la narración cuando se abandona la página
window.addEventListener('beforeunload', function() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
});