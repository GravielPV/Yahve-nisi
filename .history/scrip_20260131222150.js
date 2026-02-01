
    // Variables globales
    let currentSlide = 0;
    let totalSlides = 0;
        
        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            initializeCarousel();
            initializeAnimations();
            initializeNavbar();
            initializeForm();
            startAutoCarousel();
        });

        // Navbar scroll effect
        function initializeNavbar() {
            const navbar = document.getElementById('navbar');
            const mobileMenuBtn = document.querySelector('.mobile-menu');
            const navMenu = document.querySelector('.nav-menu');

            // Mobile menu toggle
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', function() {
                    this.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });
            }

            // Close menu when clicking a link
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    if(mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                    if(navMenu) navMenu.classList.remove('active');
                });
            });
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }

        // Carousel functionality
        function initializeCarousel() {
            const dotsContainer = document.getElementById('carousel-dots');
            const carousel = document.getElementById('carousel');
            const items = carousel.querySelectorAll('.carousel-item');
            totalSlides = items.length;
            dotsContainer.innerHTML = '';
            // Create dots
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
            updateCarousel();
        }

        function moveCarousel(direction) {
            currentSlide += direction;
            if (currentSlide >= totalSlides) {
                currentSlide = 0;
            } else if (currentSlide < 0) {
                currentSlide = totalSlides - 1;
            }
            updateCarousel();
        }

        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateCarousel();
        }

        function updateCarousel() {
            const carousel = document.getElementById('carousel');
            const dots = document.querySelectorAll('.dot');
            // Update carousel position
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
            // Update dots
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Auto carousel
        function startAutoCarousel() {
            let autoTimeout;
            function scheduleNext() {
                clearTimeout(autoTimeout);
                const carousel = document.getElementById('carousel');
                const items = carousel.querySelectorAll('.carousel-item');
                const current = items[currentSlide];
                const video = current.querySelector('video');
                if (video) {
                    // Espera a que termine el video
                    if (!video.ended) {
                        video.currentTime = 0;
                        video.play();
                        video.onended = () => {
                            moveCarousel(1);
                            scheduleNext();
                        };
                        // Si el usuario navega manualmente, limpiar evento
                        video.onpause = () => { video.onended = null; };
                    } else {
                        moveCarousel(1);
                        scheduleNext();
                    }
                } else {
                    autoTimeout = setTimeout(() => {
                        moveCarousel(1);
                        scheduleNext();
                    }, 5000);
                }
            }
            scheduleNext();
        }

        // Scroll animations
        function initializeAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            // Observe all elements with fade-in class
            document.querySelectorAll('.fade-in').forEach(el => {
                observer.observe(el);
            });
        }

        // Form handling
        function initializeForm() {
            const form = document.getElementById('contact-form');
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Get form values
                const name = data.name || '';
                const email = data.email || '';
                const phone = data.phone || '';
                const service = data.service || '';
                const message = data.message || '';
                
                // Map service values to readable names
                const serviceNames = {
                    'digital': 'Impresión Digital',
                    'cards': 'Tarjetas de Presentación',
                    'banners': 'Banners & Señalética',
                    'editorial': 'Material Editorial',
                    'textiles': 'Textiles Personalizados',
                    'promotional': 'Productos Promocionales'
                };
                
                const selectedService = serviceNames[service] || service || 'No especificado';
                
                // Create email content
                const subject = encodeURIComponent(`Consulta Web - ${name} - ${selectedService}`);
                const body = encodeURIComponent(
                    `Nueva consulta desde el sitio web:\n\n` +
                    `Nombre: ${name}\n` +
                    `Email: ${email}\n` +
                    `Teléfono: ${phone || 'No proporcionado'}\n` +
                    `Servicio: ${selectedService}\n\n` +
                    `Mensaje:\n${message}\n\n` +
                    `Fecha: ${new Date().toLocaleDateString('es-DO')}\n` +
                    `Hora: ${new Date().toLocaleTimeString('es-DO')}`
                );
                
                // Email address where the message should be sent
                const recipientEmail = 'info@printproagency.com';
                
                // Create mailto link
                const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
                
                // Simulate form submission with visual feedback
                const submitBtn = form.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                
                // Loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i>Abriendo email...';
                submitBtn.disabled = true;
                
                // Try to open email client
                try {
                    // Method 1: Direct window.location
                    window.location.href = mailtoLink;
                    
                    // Fallback method: Create and click a link
                    const link = document.createElement('a');
                    link.href = mailtoLink;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Success feedback
                    setTimeout(() => {
                        submitBtn.innerHTML = '<i class="fas fa-check" style="margin-right: 0.5rem;"></i>¡Email Abierto!';
                        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                        
                        // Show success message
                        showNotification('Se ha abierto tu cliente de email. Por favor, envía el mensaje.', 'success');
                        
                        // Reset form
                        form.reset();
                        
                        // Reset button after 4 seconds
                        setTimeout(() => {
                            submitBtn.innerHTML = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
                        }, 4000);
                    }, 500);
                    
                } catch (error) {
                    console.error('Error abriendo cliente de email:', error);
                    
                    // Error feedback
                    submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem;"></i>Error';
                    submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                    
                    // Show error message with copy info
                    showNotification(`Error al abrir email. Copia esta información: ${recipientEmail}`, 'error');
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
                    }, 3000);
                }
            });
        }

        // Notification system
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            
            // Define colors based on type
            let backgroundColor, icon;
            switch(type) {
                case 'success':
                    backgroundColor = 'linear-gradient(135deg, #10b981, #059669)';
                    icon = 'check-circle';
                    break;
                case 'error':
                    backgroundColor = 'linear-gradient(135deg, #ef4444, #dc2626)';
                    icon = 'exclamation-triangle';
                    break;
                default:
                    backgroundColor = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
                    icon = 'info-circle';
            }
            
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${backgroundColor};
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                transform: translateX(400px);
                transition: all 0.3s ease;
                max-width: 350px;
                font-weight: 500;
                word-wrap: break-word;
            `;
            
            notification.innerHTML = `
                <i class="fas fa-${icon}" style="margin-right: 0.5rem;"></i>
                ${message}
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Animate out and remove
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 4000);
        }

        // Keyboard navigation for carousel
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                moveCarousel(-1);
            } else if (e.key === 'ArrowRight') {
                moveCarousel(1);
            }
        });

        // Touch/swipe support for carousel
        let touchStartX = 0;
        let touchEndX = 0;

        const carouselContainer = document.querySelector('.carousel-container');

        carouselContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    moveCarousel(1); // Swipe left, move to next
                } else {
                    moveCarousel(-1); // Swipe right, move to previous
                }
            }
        }

        // Parallax effect for hero section
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            const rate = scrolled * -0.5;
            
            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });

        // Add loading animation
        window.addEventListener('load', function() {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });

        // Performance optimization: Throttle scroll events
        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }

        // Apply throttling to scroll events
        window.addEventListener('scroll', throttle(function() {
            // Scroll-based animations can go here
        }, 16)); // ~60fps

        // Add hover effects to service cards
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // WhatsApp Button Functionality
        const whatsappBtn = document.getElementById('whatsappBtn');
        const whatsappNumber = '18098766373'; // Número dominicano con código de país +1 809
        
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', function() {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Create WhatsApp URL with predefined message
                const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus servicios de impresión. ¿Podrían proporcionarme más información?');
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
                
                // Open WhatsApp in new tab
                window.open(whatsappURL, '_blank');
                
                // Optional: Show notification
                showNotification('Redirigiendo a WhatsApp...', 'success');
            });
            
            // Add hover sound effect (optional)
            whatsappBtn.addEventListener('mouseenter', function() {
                // You can add sound effects here if needed
                this.style.transform = 'scale(1.05)';
            });
            
            whatsappBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            // Show/hide based on scroll position
            let isVisible = false;
            
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > 300 && !isVisible) {
                    whatsappBtn.style.display = 'block';
                    isVisible = true;
                } else if (scrollTop <= 300 && isVisible) {
                    whatsappBtn.style.display = 'none';
                    isVisible = false;
                }
            });
        }    