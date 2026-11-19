// Variables globales
let isPlaying = false;
let currentAudio = null;

// Función para controlar el audio
function toggleAudio() {
    const button = document.querySelector('.play-button');
    const text = document.querySelector('.play-text');
    
    if (!currentAudio) {
        // Reemplaza 'ruta-a-tu-audio.mp3' con la ruta real de tu archivo de audio
        currentAudio = new Audio('audio/cuento.mp3'); // Ajusta la ruta según tu estructura
        
        currentAudio.addEventListener('ended', function() {
            // Resetear botón cuando el audio termine
            resetAudioButton();
        });
        
        currentAudio.addEventListener('error', function() {
            console.error('Error al cargar el audio');
            alert('No se pudo cargar el archivo de audio');
            resetAudioButton();
        });
    }
    
    if (!isPlaying) {
        currentAudio.play().then(() => {
            button.innerHTML = '⏸️';
            text.textContent = 'Pausar cuento';
            button.style.background = 'var(--secondary-color)';
            button.style.color = 'white';
            isPlaying = true;
        }).catch(error => {
            console.error('Error al reproducir audio:', error);
            alert('No se pudo reproducir el audio');
        });
    } else {
        currentAudio.pause();
        resetAudioButton();
    }
}

// Función para resetear el botón de audio
function resetAudioButton() {
    const button = document.querySelector('.play-button');
    const text = document.querySelector('.play-text');
    
    button.innerHTML = '▶';
    text.textContent = 'Escuchar cuento';
    button.style.background = 'white';
    button.style.color = 'var(--primary-color)';
    isPlaying = false;
}


// Respuestas de las pistas de cada página
const mysteryPages = {
    1: {
        message: `
            🌟 <strong>¡En un lugar secreto bajo la ciudad vivían muchos animalitos!</strong> 🌟<br>
            <em>¡Allí comenzaba una gran sorpresa!</em>
        `,
        sceneHint: '✨ ¡El secreto está bajo tierra! ✨'
    },

    2: {
        message: `
            ✨ <strong>¡Algo muy especial estaba por suceder!</strong> ✨<br>
            <em>Kira se preparaba para una noche inolvidable, pero todavía quedaba un secreto por descubrir...</em>
        `
    },

    3: {
        message: `
            ✨ <strong>¡Kira estaba a punto de vivir una noche mágica!</strong> ✨<br>
            <em>Todos esperaban con ilusión... pero aún nadie imaginaba lo que estaba por suceder. 💖</em>
        `
    },

    4: {
        message: `
            ✨ <strong>¡Toda gran amistad tiene una historia!</strong> ✨<br>
            <em>Y la de Kira y Periquito comenzó de una manera muy especial... ¡Descubramos cómo se conocieron! 🐭🦜</em>
        `
    }
};


// Función para revelar la pista correspondiente
function revealSecret() {

    const pageNumber = document.body.dataset.page;
    const pageData = mysteryPages[pageNumber];

    const mysteryElement = document.querySelector('.mystery-reveal');

    if (!pageData || !mysteryElement) return;

    mysteryElement.innerHTML = pageData.message;

    mysteryElement.style.background =
        'linear-gradient(135deg, rgba(255, 182, 193, 0.3), rgba(152, 216, 200, 0.3))';

    mysteryElement.style.transform = 'scale(1.05)';

    // Actualizar el mensaje de la imagen, si corresponde
    const mysteryHint = document.querySelector('.mystery-hint');

    if (pageData.sceneHint && mysteryHint) {
        mysteryHint.innerHTML = pageData.sceneHint;

        mysteryHint.style.background =
            'linear-gradient(135deg, rgba(152, 216, 200, 0.95), rgba(255, 182, 193, 0.95))';
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

    // Observar elementos que queremos animar
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

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funciones principales
    preloadImages();
    animateOnScroll();
    addHoverEffects();
    
    // Animar las notas musicales si existen
    const notes = document.querySelectorAll('.floating-note');
    notes.forEach((note, index) => {
        setTimeout(() => {
            note.style.animation = `float-music 3s ease-in-out infinite ${index * 0.5}s`;
        }, index * 500);
    });
    
    console.log('Página de cuentos cargada correctamente');
});

// Limpiar audio al cambiar de página
window.addEventListener('beforeunload', function() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
});