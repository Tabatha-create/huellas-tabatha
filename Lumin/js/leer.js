     function leerEscena() {
      const texto = document.getElementById("texto-escena").innerText;
      const speech = new SpeechSynthesisUtterance(texto);
      speech.lang = "es-ES";
      speech.rate = 1;
      speech.pitch = 1;
      speech.volume = 1;
      speechSynthesis.cancel(); // Detiene si ya hay algo sonando
      speechSynthesis.speak(speech);
    }