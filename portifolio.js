document.addEventListener('DOMContentLoaded', () => {
    
    // Certificate Viewer
    (function certificateViewer() {
        const viewer = document.getElementById('certificate-viewer');
        const image = document.getElementById('full-certificate');

        if (!viewer || !image) return;

        window.openCertificate = function (src) {
            image.src = src;
            viewer.style.display = 'flex';
        };

        window.closeCertificate = function () {
            viewer.style.display = 'none';
            image.src = '';
        };

        viewer.addEventListener('click', (e) => {
            if (e.target.id === 'certificate-viewer') {
                closeCertificate();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeCertificate();
            }
        });
    })();

    // Mobile Navigation Toggle
    (function mobileNav() {
        const menuIcon = document.getElementById('menu-icon');
        const navbar = document.querySelector('.navbar');

        if (!menuIcon || !navbar) return;

        function toggleMenu() {
            const isOpen = navbar.classList.toggle('active');
            menuIcon.classList.toggle('fa-bars', !isOpen);
            menuIcon.classList.toggle('fa-xmark', isOpen);
            menuIcon.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }

        function closeMenu() {
            navbar.classList.remove('active');
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.setAttribute('aria-expanded', 'false');
        }

        menuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        menuIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', (e) => {
            if (navbar.classList.contains('active') &&
                !navbar.contains(e.target) &&
                !menuIcon.contains(e.target)) {
                closeMenu();
            }
        });
    })();

    // Typewriter Effect
    (function typewriter() {
        const target = document.querySelector('.typing-text');
        if (!target) return;

        const roles = ['BIT Student', 'Software Developer', 'Graphic Designer', 'Tech Enthusiast'];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                target.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                target.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    })();

    // Active Section Highlight on Scroll (ScrollSpy)
    (function scrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar li a[href^="#"]');

        function highlightNav() {
            let scrollY = window.pageYOffset;

            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 150;
                const sectionId = current.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active-link');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active-link');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', highlightNav);
    })();

    // Back to Top Floating Button
    (function backToTop() {
        const topBtn = document.getElementById('back-to-top');
        if (!topBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                topBtn.classList.add('show');
            } else {
                topBtn.classList.remove('show');
            }
        });

        topBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    })();

});

// Contact Form Validation & Processing
    (function contactForm() {
        const form = document.querySelector('.contact-form');
        const submitBtn = form?.querySelector('.send-btn');
        if (!form || !submitBtn) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Basic field validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('input-error');
                } else {
                    input.classList.remove('input-error');
                }
            });

            if (!isValid) return;

            // Show loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin"></i>`;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    submitBtn.style.background = '#28a745';
                    submitBtn.innerHTML = `Sent Successfully! <i class="fa-solid fa-check"></i>`;
                    form.reset();
                } else {
                    throw new Error('Failed to send');
                }
            } catch (err) {
                submitBtn.style.background = '#dc3545';
                submitBtn.innerHTML = `Error! Try Again <i class="fa-solid fa-xmark"></i>`;
            } finally {
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    submitBtn.innerHTML = originalBtnText;
                }, 4000);
            }
        });
    })();