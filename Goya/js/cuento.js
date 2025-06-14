// Variables globales
let isPlaying = false;
let voices = [];
let currentSpeech = null;
let textChunks = [];
let currentChunkIndex = 0;

// ====== FUNCIONES DE SÍNTESIS DE VOZ ======

// Función para obtener todas las voces disponibles
function getVoices() {
    voices = window.speechSynthesis.getVoices();
    const spanishVoices = voices.filter(voice => voice.lang.includes('es'));
    return spanishVoices.length > 0 ? spanishVoices : voices;
}

// Inicializar las voces cuando estén disponibles
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = getVoices;
}

// Función para crear el selector de voces
function createVoiceSelector() {
    const availableVoices = getVoices();
    
    if (availableVoices.length === 0) {
        setTimeout(createVoiceSelector, 500);
        return;
    }
    
    // Verificar si ya existe el selector
    if (document.getElementById('voiceSelect')) {
        return;
    }
    
    const container = document.createElement('div');
    container.className = 'voice-selector';
    container.style.cssText = `
        margin: 10px 0;
        text-align: center;
    `;
    
    const select = document.createElement('select');
    select.id = 'voiceSelect';
    select.style.cssText = `
        margin-left: 10px;
        padding: 5px;
        border-radius: 5px;
        border: 2px solid var(--primary-color, #4CAF50);
    `;
    
    availableVoices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        const simpleName = voice.name.split(' ')[0];
        option.textContent = simpleName;
        select.appendChild(option);
    });
    
    const label = document.createElement('label');
    label.htmlFor = 'voiceSelect';
    label.textContent = '🎭 Elige la voz del narrador: ';
    label.style.cssText = `
        font-weight: bold;
        color: var(--primary-color, #4CAF50);
    `;
    
    container.appendChild(label);
    container.appendChild(select);
    
    // Insertar el selector antes del botón de play
    const audioControl = document.querySelector('.audio-control');
    if (audioControl) {
        const firstChild = audioControl.firstChild;
        if (firstChild) {
            audioControl.insertBefore(container, firstChild);
        } else {
            audioControl.appendChild(container);
        }
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

// Función para dividir el texto en fragmentos manejables
function splitTextIntoChunks(text) {
    let paragraphs = text.split(/\n\s*\n/);
    let chunks = [];
    
    paragraphs.forEach(paragraph => {
        if (paragraph.length > 200) {
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
        resetAudioButton();
        return;
    }
    
    const chunk = textChunks[chunkIndex];
    const speech = new SpeechSynthesisUtterance(chunk);
    speech.lang = 'es-ES';
    speech.rate = 0.85;
    speech.pitch = 1.2;
    
    // Seleccionar la voz
    const voiceSelect = document.getElementById('voiceSelect');
    const availableVoices = getVoices();
    
    if (voiceSelect && availableVoices.length > 0) {
        const selectedVoice = availableVoices[voiceSelect.value];
        if (selectedVoice) {
            speech.voice = selectedVoice;
        }
    } else if (availableVoices.length > 0) {
        const preferredVoice = availableVoices.find(voice => 
            (voice.name.includes('female') || voice.name.includes('mujer') || 
             voice.name.toLowerCase().includes('elena') || voice.name.toLowerCase().includes('monica'))
        );
        
        if (preferredVoice) {
            speech.voice = preferredVoice;
        }
    }
    
    speech.onend = function() {
        if (chunkIndex === currentChunkIndex) {
            currentChunkIndex++;
            setTimeout(() => {
                speakChunk(currentChunkIndex);
            }, 300);
        }
    };
    
    speech.onerror = function(event) {
        console.error('Error en la síntesis de voz:', event);
        resetAudioButton();
    };
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
    currentSpeech = speech;
}

// Función principal para controlar el audio
function toggleAudio() {
    const button = document.querySelector('.play-button');
    const text = document.querySelector('.play-text');
    
    if (!button || !text) {
        console.error('No se encontraron los elementos del botón de audio');
        return;
    }
    
    // Si hay una narración en curso, la detenemos
    if (window.speechSynthesis.speaking || isPlaying) {
        window.speechSynthesis.cancel();
        resetAudioButton();
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
    button.innerHTML = '⏸️';
    text.textContent = 'Pausar cuento';
    button.style.background = 'var(--secondary-color)';
    button.style.color = 'white';
    isPlaying = true;
    
    // Comenzar a hablar
    speakChunk(currentChunkIndex);
}

// Función para resetear el botón de audio
function resetAudioButton() {
    const button = document.querySelector('.play-button');
    const text = document.querySelector('.play-text');
    
    if (button && text) {
        button.innerHTML = '▶';
        text.textContent = 'Escuchar cuento';
        button.style.background = 'white';
        button.style.color = 'var(--primary-color)';
    }
    
    isPlaying = false;
    currentChunkIndex = 0;
    currentSpeech = null;
}

// Preventivo contra el bug del tiempo de ejecución en Chrome
function checkAndResumeIfNeeded() {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
    }
}

// ====== FUNCIONES DE EFECTOS VISUALES ======

// Función para revelar el secreto (específica de página 1)
function revealSecret() {
    const mysteryElement = document.querySelector('.mystery-reveal');
    if (!mysteryElement) return;
    
    mysteryElement.innerHTML = `
        🌟 <strong>¡En un lugar secreto bajo la ciudad vivían muchos animalitos!</strong> 🌟<br>
        <em>¡Allí comenzaba una gran sorpresa!</em>
    `;
    mysteryElement.style.background = 'linear-gradient(135deg, rgba(255, 182, 193, 0.3), rgba(152, 216, 200, 0.3))';
    mysteryElement.style.transform = 'scale(1.05)';
    
    const mysteryHint = document.querySelector('.mystery-hint');
    if (mysteryHint) {
        mysteryHint.innerHTML = '✨ ¡El secreto está bajo tierra! ✨';
        mysteryHint.style.background = 'linear-gradient(135deg, rgba(152, 216, 200, 0.95), rgba(255, 182, 193, 0.95))';
    }
    
    const mainImage = document.querySelector('.main-story-image');
    if (mainImage) {
        mainImage.style.filter = 'brightness(1.1) saturate(1.2)';
        mainImage.style.transform = 'scale(1.03)';
    }
}

// Función para animar elementos al hacer scroll
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.story-text, .chapter-title, .nav-button');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Función para añadir efectos hover a los botones
function addHoverEffects() {
    const buttons = document.querySelectorAll('.nav-button, .play-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Función para precargar imágenes
function preloadImages() {
    const images = document.querySelectorAll('img');
    const imagePromises = [];
    
    images.forEach(img => {
        if (img.src) {
            const imagePromise = new Promise((resolve, reject) => {
                const newImg = new Image();
                newImg.onload = resolve;
                newImg.onerror = reject;
                newImg.src = img.src;
            });
            imagePromises.push(imagePromise);
        }
    });
    
    Promise.all(imagePromises).then(() => {
        console.log('Todas las imágenes se han precargado');
    }).catch(error => {
        console.warn('Error al precargar algunas imágenes:', error);
    });
}

// Navegación suave
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ====== INICIALIZACIÓN ======

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funciones principales
    preloadImages();
    animateOnScroll();
    addHoverEffects();
    
    // Inicializar voces después de un momento
    setTimeout(() => {
        getVoices();
        createVoiceSelector();
    }, 1000);
    
    // Animar las notas musicales si existen
    const notes = document.querySelectorAll('.floating-note');
    notes.forEach((note, index) => {
        setTimeout(() => {
            note.style.animation = `float-music 3s ease-in-out infinite ${index * 0.5}s`;
        }, index * 500);
    });
    
    // Configurar el intervalo para evitar el límite de tiempo de Chrome
    setInterval(checkAndResumeIfNeeded, 10000);
    
    console.log('Página de cuentos cargada correctamente con síntesis de voz');
});

// Detener la narración cuando se abandona la página
window.addEventListener('beforeunload', function() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
});