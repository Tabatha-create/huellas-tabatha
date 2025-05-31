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
            // Obtener elementos del modal
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            const modalTitle = document.getElementById('modalTitle');
            const modalDescription = document.getElementById('modalDescription');
            const closeBtn = document.getElementsByClassName('close')[0];
            
            // Obtener todas las tarjetas de memoria
            const memoryCards = document.querySelectorAll('.memory-card');
            
            // Agregar event listener a cada tarjeta
            memoryCards.forEach(card => {
                card.addEventListener('click', function() {
                    // Obtener datos de la imagen y texto
                    const img = this.querySelector('.memory-img');
                    const title = this.querySelector('.memory-text h4');
                    const description = this.querySelector('.memory-text p');
                    
                    // Mostrar el modal
                    modal.style.display = 'block';
                    
                    // Establecer la imagen
                    modalImg.src = img.src;
                    modalImg.alt = img.alt;
                    
                    // Establecer el texto
                    if (title) {
                        modalTitle.textContent = title.textContent;
                        modalTitle.style.display = 'block';
                    } else {
                        modalTitle.style.display = 'none';
                    }
                    
                    if (description) {
                        modalDescription.textContent = description.textContent;
                        modalDescription.style.display = 'block';
                    } else {
                        modalDescription.style.display = 'none';
                    }
                    
                    // Prevenir scroll del body
                    document.body.style.overflow = 'hidden';
                });
            });
            
            // Cerrar modal al hacer clic en X
            closeBtn.addEventListener('click', function() {
                closeModal();
            });
            
            // Cerrar modal al hacer clic fuera de la imagen
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Cerrar modal con tecla Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.style.display === 'block') {
                    closeModal();
                }
            });
            
            // Función para cerrar el modal
            function closeModal() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
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


