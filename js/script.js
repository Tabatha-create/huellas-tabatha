document.addEventListener('DOMContentLoaded', function() {
    // Detectar si es dispositivo móvil o tablet
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (isMobile) {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const navLink = dropdown.querySelector('.nav-link');
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            
            // Por defecto ocultar el menú desplegable
            dropdownContent.style.display = 'none';
            
            navLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (dropdownContent.style.display === 'none') {
                    dropdownContent.style.display = 'block';
                    navLink.classList.add('active');
                } else {
                    dropdownContent.style.display = 'none';
                    navLink.classList.remove('active');
                }
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad para desplegar/contraer el formulario
    const toggle = document.querySelector('.contact-toggle');
    const container = document.querySelector('.contact-form-container');
    
    toggle.addEventListener('click', function() {
      toggle.classList.toggle('active');
      container.classList.toggle('active');
    });
    
    // Validación del formulario
    document.getElementById('contactForm').addEventListener('submit', function(event) {
      event.preventDefault();
      
      const nombre = document.getElementById('nombre').value;
      const email = document.getElementById('email').value;
      const mensaje = document.getElementById('mensaje').value;
      
      if (nombre.trim() === '' || email.trim() === '' || mensaje.trim() === '') {
        alert('Por favor, completa todos los campos obligatorios.');
        return false;
      }
      
      // Aquí normalmente enviarías los datos a un servidor
      // Por ahora solo mostraremos un mensaje de confirmación
      alert('¡Gracias por tu mensaje! Te responderemos pronto.');
      this.reset();
      
      // Opcional: contraer el formulario después del envío exitoso
      toggle.classList.remove('active');
      container.classList.remove('active');
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Crear el modal
    const modalHTML = `
        <div id="imageModal" class="modal">
            <span class="close">&times;</span>
            <img class="modal-content" id="modalImg">
            <div id="modalCaption" class="modal-caption"></div>
        </div>
    `;
    
    // Añadir el modal al body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Obtener referencias
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.getElementsByClassName('close')[0];
    
    // Asignar eventos a todas las tarjetas de memoria
    const memoryCards = document.querySelectorAll('.memory-card');
    
    memoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Abrir el modal
            modal.style.display = 'block';
            
            // Obtener la imagen y los textos
            const img = this.querySelector('.memory-img');
            const title = this.querySelector('.memory-text h4').textContent;
            const description = this.querySelector('.memory-text p').textContent;
            
            // Mostrar en el modal
            modalImg.src = img.src;
            modalCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
        });
    });
    
    // Cerrar el modal al hacer clic en la X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Cerrar el modal al hacer clic fuera de la imagen
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Cerrar el modal con la tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
});
    // botón para desplazar hacia arriba la página
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
// Mostrar/ocultar el botón según la posición del scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Función para volver arriba al hacer clic
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})



