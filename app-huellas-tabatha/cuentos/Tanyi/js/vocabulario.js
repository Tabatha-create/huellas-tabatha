     // Script para el control de audio
    let audio = new Audio('audio/vocabulario.mp3');
    let isPlaying = false;
    
    function toggleAudio() {
      if (isPlaying) {
        audio.pause();
        document.getElementById('playButton').innerHTML = '▶';
        document.getElementById('playButton').classList.remove('playing');
        isPlaying = false;
      } else {
        audio.play();
        document.getElementById('playButton').innerHTML = '⏸';
        document.getElementById('playButton').classList.add('playing');
        isPlaying = true;
      }
    }
    
    audio.onended = function() {
      document.getElementById('playButton').innerHTML = '▶';
      document.getElementById('playButton').classList.remove('playing');
      isPlaying = false;
    };
    
    // Cargar voces disponibles para el selector
    function loadVoices() {
      let voiceSelect = document.getElementById('voiceSelect');
      let voices = window.speechSynthesis.getVoices();
      
      voices.forEach((voice, index) => {
        if (voice.lang.includes('es')) {
          let option = document.createElement('option');
          option.value = index;
          option.innerHTML = voice.name + ' (' + voice.lang + ')';
          voiceSelect.appendChild(option);
        }
      });
    }
    
    // Cargar voces cuando estén disponibles
    if (window.speechSynthesis) {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    
    // Animación de carga
    window.addEventListener('load', function() {
      document.querySelector('.loading-bar').style.animation = 'loadingAnimation 2s ease forwards';
    });