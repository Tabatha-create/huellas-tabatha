// ==========================================
// HUELLAS DE TABATHA - CUENTO DE TANYI
// Audio y navegación por las escenas
// ==========================================

let voices = [];
let currentSpeech = null;
let paginaActual = 0;

// Nombre del archivo de la página final especial.
// Comprueba que coincida con el nombre real de tu archivo.
const paginaFinal = "final.html";


// ==========================================
// 1. CARGAR LAS VOCES DISPONIBLES
// ==========================================

function getVoices() {
    voices = window.speechSynthesis.getVoices();

    const vocesEspanol = voices.filter(voice =>
        voice.lang.toLowerCase().startsWith("es")
    );

    return vocesEspanol;
}


// ==========================================
// 2. CREAR EL SELECTOR DE VOCES
// ==========================================

function createVoiceSelector() {

    if (document.querySelector(".voice-selector")) {
        return;
    }

    const selectorContainer = document.createElement("div");
    selectorContainer.className = "voice-selector";

    const label = document.createElement("label");
    label.textContent = "Elige una voz:";

    const select = document.createElement("select");
    select.id = "voiceSelect";

    const vocesEspanol = getVoices();

    vocesEspanol.forEach(voice => {
        const option = document.createElement("option");

        option.value = voice.name;
        option.textContent = voice.name;

        select.appendChild(option);
    });

    const vozGuardada = localStorage.getItem("vozTanyi");

    if (vozGuardada) {
        select.value = vozGuardada;
    }

    select.addEventListener("change", function () {
        localStorage.setItem("vozTanyi", select.value);
    });

    selectorContainer.appendChild(label);
    selectorContainer.appendChild(select);

    document.body.appendChild(selectorContainer);
}


// ==========================================
// 3. CREAR EL BOTÓN DE AUDIO
// ==========================================

function createPlayButton() {

    if (document.getElementById("playButton")) {
        return;
    }

    const button = document.createElement("button");

    button.id = "playButton";
    button.className = "play-button";
    button.textContent = "▶";

    button.type = "button";
    button.addEventListener("click", toggleAudio);

    const text = document.createElement("div");

    text.id = "playText";
    text.className = "play-text";
    text.textContent = "Escuchar cuento";

    const audioContainer = document.createElement("div");
    audioContainer.className = "audio-control";
    audioContainer.id = "audioControl";

    audioContainer.appendChild(button);
    audioContainer.appendChild(text);

    document.body.appendChild(audioContainer);
}


// ==========================================
// 4. COLOCAR LOS CONTROLES EN LA ESCENA ACTIVA
// ==========================================

function colocarControlesAudio() {

    const paginaActiva = document.querySelector(".pagina.activa");

    if (!paginaActiva) return;

    const textBox = paginaActiva.querySelector(".text-box");

    const selector = document.querySelector(".voice-selector");
    const audioContainer = document.getElementById("audioControl");

    if (!textBox) return;

    if (selector) {
        textBox.parentNode.insertBefore(
            selector,
            textBox.nextSibling
        );
    }

    if (audioContainer) {
        const referencia = selector
            ? selector.nextSibling
            : textBox.nextSibling;

        textBox.parentNode.insertBefore(
            audioContainer,
            referencia
        );
    }
}


// ==========================================
// 5. REPRODUCIR O DETENER LA LECTURA
// ==========================================

function toggleAudio() {

    const textBox = document.querySelector(
        ".pagina.activa .text-box"
    );

    const button = document.getElementById("playButton");
    const playText = document.getElementById("playText");
    const voiceSelect = document.getElementById("voiceSelect");

    if (!textBox || !button) return;

    // Si está leyendo, detener
    if (window.speechSynthesis.speaking) {

        window.speechSynthesis.cancel();

        button.textContent = "▶";
        button.classList.remove("playing");

        if (playText) {
            playText.textContent = "Escuchar cuento";
        }

        return;
    }

    // Preparar el texto de la escena activa
    const texto = textBox.innerText;

    currentSpeech = new SpeechSynthesisUtterance(texto);

    currentSpeech.lang = "es-ES";
    currentSpeech.rate = 0.9;
    currentSpeech.pitch = 1.1;

    // Seleccionar la voz elegida
    const vozElegida = voiceSelect
        ? voiceSelect.value
        : localStorage.getItem("vozTanyi");

    const voz = voices.find(v => v.name === vozElegida);

    if (voz) {
        currentSpeech.voice = voz;
    }

    // Al terminar la lectura
    currentSpeech.onend = function () {

        button.textContent = "▶";
        button.classList.remove("playing");

        if (playText) {
            playText.textContent = "Escuchar cuento";
        }
    };

    // Si ocurre un error
    currentSpeech.onerror = function () {

        button.textContent = "▶";
        button.classList.remove("playing");

        if (playText) {
            playText.textContent = "Escuchar cuento";
        }
    };

    window.speechSynthesis.speak(currentSpeech);

    button.textContent = "Ⅱ";
    button.classList.add("playing");

    if (playText) {
        playText.textContent = "Detener lectura";
    }
}


// ==========================================
// 6. NAVEGACIÓN ENTRE LAS SIETE ESCENAS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const paginas = document.querySelectorAll(".pagina");

    const btnAnterior = document.getElementById("btnAnterior");
    const btnSiguiente = document.getElementById("btnSiguiente");

    const contador = document.getElementById("contador");
    const barra = document.getElementById("barra");

    const totalPaginas = paginas.length;

    if (totalPaginas === 0) {
        console.error("No se han encontrado escenas del cuento.");
        return;
    }

    // Crear los controles de audio
    createVoiceSelector();
    createPlayButton();

    // Buscar la escena que ya tiene la clase activa
    paginas.forEach((pagina, indice) => {
        if (pagina.classList.contains("activa")) {
            paginaActual = indice;
        }
    });


    // --------------------------------------
    // MOSTRAR UNA ESCENA
    // --------------------------------------

    function mostrarPagina(indice) {

        if (indice < 0 || indice >= totalPaginas) {
            return;
        }

        // Detener la lectura anterior
        window.speechSynthesis.cancel();

        const button = document.getElementById("playButton");
        const playText = document.getElementById("playText");

        if (button) {
            button.textContent = "▶";
            button.classList.remove("playing");
        }

        if (playText) {
            playText.textContent = "Escuchar cuento";
        }

        // Ocultar todas las escenas
        paginas.forEach(pagina => {
            pagina.classList.remove("activa");
        });

        // Activar la escena elegida
        paginaActual = indice;
        paginas[paginaActual].classList.add("activa");

        // Actualizar controles de audio
        colocarControlesAudio();

        // Actualizar contador
        if (contador) {
            contador.textContent =
                "🐾 Huella " + (paginaActual + 1) +
                " de " + totalPaginas;
        }

        // Actualizar barra de progreso
        if (barra) {
            const progreso =
                ((paginaActual + 1) / totalPaginas) * 100;

            barra.style.width = progreso + "%";
        }

        // Activar o desactivar botones
        if (btnAnterior) {
            btnAnterior.disabled = paginaActual === 0;
        }

        if (btnSiguiente) {
            btnSiguiente.disabled = false;
        }

        // Volver al principio de la escena
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    // --------------------------------------
    // BOTÓN ANTERIOR
    // --------------------------------------

    if (btnAnterior) {

        btnAnterior.addEventListener("click", function () {

            if (paginaActual > 0) {
                mostrarPagina(paginaActual - 1);
            }

        });
    }


    // --------------------------------------
    // BOTÓN SIGUIENTE
    // --------------------------------------

    if (btnSiguiente) {

        btnSiguiente.addEventListener("click", function () {

            if (paginaActual < totalPaginas - 1) {

                mostrarPagina(paginaActual + 1);

            } else {

                // Al terminar la séptima escena,
                // ir a la página final especial de Tanyi.

                window.speechSynthesis.cancel();

                window.location.href = paginaFinal;
            }

        });
    }


    // Mostrar la primera escena correctamente
    mostrarPagina(paginaActual);

});


// ==========================================
// 7. DETENER EL AUDIO AL SALIR DE LA PÁGINA
// ==========================================

window.addEventListener("beforeunload", function () {
    window.speechSynthesis.cancel();
});


// Cargar las voces cuando el navegador las tenga disponibles
window.speechSynthesis.onvoiceschanged = function () {
    voices = window.speechSynthesis.getVoices();

    const select = document.getElementById("voiceSelect");

    if (select && select.options.length === 0) {
        createVoiceSelector();
    }
};