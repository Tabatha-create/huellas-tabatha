// Variables globales
let isPlaying = false;

// Función para controlar el audio
function toggleAudio() {
    const button = document.querySelector('.play-button');
    const text = document.querySelector('.play-text');
    
    if (!isPlaying) {
        button.innerHTML = '⏸️';
        text.textContent = 'Pausar cuento';
        button.style.background = 'var(--secondary-color)';
        button.style.color = 'white';
        isPlaying = true;
        
        // Aquí irían las instrucciones de audio real
        console.log('Reproduciendo audio...');
    } else {
        button.innerHTML = '▶';
        text.textContent = 'Escuchar cuento';
        button.style.background = 'white';
        button.style.color = 'var(--primary-color)';
        isPlaying = false;
        
        console.log('Audio pausado...');
    }
}

// Función para revelar el secreto (específica de página 1)
function revealSecret() {
    const mysteryElement = document.querySelector('.mystery-reveal');
    mysteryElement.innerHTML = `
        🌟 <strong>¡En un lugar secreto bajo la ciudad vivían muchos animalitos!</strong> 🌟<br>
        <em>¡Allí comenzaba una gran sorpresa!</em>
    `;
    mysteryElement.style.background = 'linear-gradient(135deg, rgba(255, 182, 193, 0.3), rgba(152, 216, 200, 0.3))';
    mysteryElement.style.transform = 'scale(1.05)';
    
    // Añadir efecto visual a la escena
    const mysteryHint = document.querySelector('.mystery-hint');
    if (mysteryHint) {
        mysteryHint.innerHTML = '✨ ¡El secreto está bajo tierra! ✨';
        mysteryHint.style.background = 'linear-gradient(135deg, rgba(152, 216, 200, 0.95), rgba(255, 182, 193, 0.95))';
    }
    
    // Efecto en la imagen
    const mainImage = document.querySelector('.main-story-image');
    if (mainImage) {
        mainImage.style.filter = 'brightness(1.1) saturate(1.2)';
        mainImage.style.transform = 'scale(1.03)';
    }
}

// Funciones de utilidad que pueden ser reutilizadas en otras páginas

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

// Función para añadir efectos hover dinámicos
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

// Función para manejar el responsive del header
function handleResponsiveHeader() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
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

// Función para añadir efectos de partículas (opcional)
function addParticleEffects() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    document.body.appendChild(particleContainer);
    
    // Crear partículas ocasionales
    setInterval(() => {
        if (Math.random() > 0.7) {
            createParticle(particleContainer);
        }
    }, 3000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.innerHTML = ['✨', '🌟', '💫', '⭐'][Math.floor(Math.random() * 4)];
    particle.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 20 + 10}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 0.7;
        animation: particle-float 4s ease-out forwards;
    `;
    
    container.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 4000);
}

// Añadir animación CSS para partículas
function addParticleCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particle-float {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0.7;
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Funciones que se ejecutan en todas las páginas
    preloadImages();
    animateOnScroll();
    addHoverEffects();
    handleResponsiveHeader();
    addParticleCSS();
    
    // Efectos opcionales (puedes comentar si no los quieres)
    // addParticleEffects();
    
    // Animar las notas musicales (específico para páginas con música)
    const notes = document.querySelectorAll('.floating-note');
    notes.forEach((note, index) => {
        setTimeout(() => {
            note.style.animation = `float-music 3s ease-in-out infinite ${index * 0.5}s`;
        }, index * 500);
    });
    
    console.log('Página cargada y efectos inicializados');
});

// Función para cambiar tema (día/noche) - funcionalidad extra
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    
    if (currentTheme === 'light') {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
}

// Cargar tema guardado
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Funciones de navegación suave
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Función para mostrar/ocultar elementos con fade
function fadeToggle(element, duration = 300) {
    if (element.style.opacity === '0' || !element.style.opacity) {
        fadeIn(element, duration);
    } else {
        fadeOut(element, duration);
    }
}

function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.min(progress / duration, 1);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    let start = null;
    const initialOpacity = parseFloat(element.style.opacity) || 1;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.max(initialOpacity - (progress / duration), 0);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}