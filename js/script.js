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

  const carouselTrack = document.getElementById('carouselTrack');
        const indicators = document.getElementById('indicators');
        const modal = document.getElementById('photoModal');
        
        let currentIndex = 0;
        const cardsPerView = window.innerWidth > 768 ? 4 : 1;
        const totalCards = document.querySelectorAll('.memory-card').length;
        const maxIndex = Math.max(0, totalCards - cardsPerView);

        // Datos de las fotos para el modal (usa las mismas rutas que tus imágenes)
        const photoData = [
            {
                title: "Sus primeras fotos",
                description: "Esta es una de las primeras fotos cuando nació que aún estaba junto a todos sus hermanitos.",
                img: "img/Tabatha/bebe.jpg"
            },
            {
                title: "Primera mirada",
                description: "Tenía carita de asustada, era el primer día que se separaba de sus hermanitos y todo era diferente, venía de un largo viaje y estaba lejos de los suyos.",
                img: "img/Tabatha/1erdia.jpg"
            },
            {
                title: "Llegando a casa",
                description: "El primer día en casa, todavía seguía un poco asustada porque no conocía nada y era la primera noche separada de sus hermanitos.",
                img: "img/Tabatha/encasa.jpg"
            },
            {
                title: "Como una muñeca",
                description: "En mi primer viaje, me tomaron como un juguete y me paseaban en el coche de las muñecas.",
                img: "img/Tabatha/FB_IMG_1607551178153.jpg"
            },
            {
                title: "Todo lo muerde",
                description: "Siempre encontraba algo que morder. No importaba lo que fuera, ella todo lo que había en el piso lo agarraba para practicar con sus dientes nuevos.",
                img: "img/Tabatha/cepillo.jpg"
            },
            {
                title: "Ladrando a la comida",
                description: "Cuando la comida estaba caliente, le ladraba para no quemarse. Hasta la comida era una razón para jugar.",
                img: "img/Tabatha/comida1.jpg"
            },
            {
                title: "Peleando con el limón",
                description: "Como todo era juguete agarró un limón y como no le gustaba, se puso a ladrarle.",
                img: "img/Tabatha/limon1.jpg"
            },
            {
                title: "Otro juguete",
                description: "Tenía muchos juguetes, pero le encantaba morder todo lo que había en el suelo y agarró las zapatillas como su juguete.",
                img: "img/Tabatha/zanahoria.jpg"
            },
             {
                title: "Comiendo zanahoria",
                description: "De pequeñita le gustaba mucho la zanahoria, y la apoyaba en la zapatilla para que no se le escapara.",
                img: "img/Tabatha/zanahoria.jpg"
            }
        ];

        // Crear indicadores
        function createIndicators() {
            indicators.innerHTML = '';
            for (let i = 0; i <= maxIndex; i++) {
                const indicator = document.createElement('div');
                indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
                indicator.onclick = () => goToSlide(i);
                indicators.appendChild(indicator);
            }
        }

        // Mover carrusel
        function moveCarousel(direction) {
            currentIndex += direction;
            
            if (currentIndex < 0) {
                currentIndex = maxIndex;
            } else if (currentIndex > maxIndex) {
                currentIndex = 0;
            }
            
            updateCarousel();
        }

        // Ir a slide específico
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        // Actualizar carrusel
        function updateCarousel() {
            const cardWidth = 320; // 300px + 20px margin
            const offset = currentIndex * cardWidth;
            carouselTrack.style.transform = `translateX(-${offset}px)`;
            
            // Actualizar indicadores
            document.querySelectorAll('.indicator').forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }

        // Abrir modal
        function openModal(index) {
            const data = photoData[index];
            document.getElementById('modalImg').src = data.img;
            document.getElementById('modalTitle').textContent = data.title;
            document.getElementById('modalDescription').textContent = data.description;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        // Cerrar modal
        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (modal.style.display === 'block') {
                if (e.key === 'Escape') closeModal();
                return;
            }
            
            if (e.key === 'ArrowLeft') moveCarousel(-1);
            if (e.key === 'ArrowRight') moveCarousel(1);
        });

        // Inicializar
        createIndicators();

        // Responsive
        window.addEventListener('resize', () => {
            location.reload();
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

// ===== FUNCIONES PARA TARJETAS EXPANDIBLES =====

function toggleContent(contentId, button) {
    const content = document.getElementById(contentId);
    const icon = button.querySelector('.toggle-icon');
    const isExpanded = content.classList.contains('expanded');
    
    if (isExpanded) {
        // Colapsar
        content.classList.remove('expanded');
        icon.classList.remove('rotated');
        
        // Restaurar texto original del botón
        if (contentId === 'cuentos-content') {
            button.innerHTML = 'Ver cuentos <i class="fas fa-chevron-down toggle-icon"></i>';
        } else if (contentId === 'actividades-content') {
            button.innerHTML = 'Explorar actividades <i class="fas fa-chevron-down toggle-icon"></i>';
        } else if (contentId === 'recursos-content') {
            button.innerHTML = 'Ver recursos <i class="fas fa-chevron-down toggle-icon"></i>';
        }
    } else {
        // Expandir
        content.classList.add('expanded');
        icon.classList.add('rotated');
        
        // Cambiar texto del botón según el contenido
        if (contentId === 'cuentos-content') {
            button.innerHTML = 'Ocultar cuentos <i class="fas fa-chevron-down toggle-icon rotated"></i>';
        } else if (contentId === 'actividades-content') {
            button.innerHTML = 'Cerrar actividades <i class="fas fa-chevron-down toggle-icon rotated"></i>';
        } else if (contentId === 'recursos-content') {
            button.innerHTML = 'Ver menos recursos <i class="fas fa-chevron-down toggle-icon rotated"></i>';
        }
    }
}

// Cerrar contenido expandible al hacer clic fuera
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            if (!card.contains(event.target)) {
                const expandableContent = card.querySelector('.expandable-content');
                const button = card.querySelector('.btn[onclick*="toggleContent"]');
                
                if (expandableContent && expandableContent.classList.contains('expanded') && button) {
                    const icon = button.querySelector('.toggle-icon');
                    expandableContent.classList.remove('expanded');
                    if (icon) icon.classList.remove('rotated');
                    
                    // Restaurar texto original del botón
                    if (expandableContent.id === 'cuentos-content') {
                        button.innerHTML = 'Ver cuentos <i class="fas fa-chevron-down toggle-icon"></i>';
                    } else if (expandableContent.id === 'actividades-content') {
                        button.innerHTML = 'Explorar actividades <i class="fas fa-chevron-down toggle-icon"></i>';
                    } else if (expandableContent.id === 'recursos-content') {
                        button.innerHTML = 'Ver recursos <i class="fas fa-chevron-down toggle-icon"></i>';
                    }
                }
            }
        });
    });

    // Prevenir que el clic dentro de la tarjeta cierre el contenido
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
});

