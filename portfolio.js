document.addEventListener('DOMContentLoaded', () => {

    // Certificate Viewer
    (function certificateViewer() {
        const viewer = document.getElementById('certificate-viewer');
        const image = document.getElementById('full-certificate');
        if (!viewer || !image) return;

        window.openCertificate = function (src) {
            image.src = src;
            viewer.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        window.closeCertificate = function () {
            viewer.style.display = 'none';
            image.src = '';
            document.body.style.overflow = '';
        };

        // Handle certificate image clicks via JS (no inline onclick)
        document.querySelectorAll('.certificate-card img').forEach(function (img) {
            img.addEventListener('click', function () { openCertificate(img.src); });
        });

        // Close button
        var closeBtn = document.querySelector('.close-certificate');
        if (closeBtn) closeBtn.addEventListener('click', closeCertificate);

        viewer.addEventListener('click', function (e) {
            if (e.target.id === 'certificate-viewer') closeCertificate();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeCertificate();
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

        menuIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMenu();
        });

        menuIcon.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        navbar.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', function (e) {
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
        let ticking = false;

        function highlightNav() {
            let scrollY = window.pageYOffset;

            sections.forEach(function (current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 150;
                const sectionId = current.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(function (link) {
                        link.classList.remove('active-link');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active-link');
                        }
                    });
                }
            });
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(highlightNav);
                ticking = true;
            }
        }, { passive: true });
    })();

    // Back to Top Floating Button
    (function backToTop() {
        const topBtn = document.getElementById('back-to-top');
        if (!topBtn) return;

        window.addEventListener('scroll', function () {
            topBtn.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });

        topBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    })();

    // Scroll Reveal Animations (Intersection Observer)
    (function scrollReveal() {
        const revealElements = document.querySelectorAll(
            '.grid-card, .project-card, .certificate-card, .contact-card, .about p, .section-title, .skills-info, .contact-container'
        );

        if (!revealElements.length) return;

        // Add reveal class first
        revealElements.forEach(function (el) {
            el.classList.add('reveal');
        });

        // Stagger animation delay for cards within the same parent
        var gridContainers = document.querySelectorAll('.grid, .project-grid, .certificate-grid, .contact-cards');
        gridContainers.forEach(function (container) {
            var cards = container.querySelectorAll('.reveal');
            cards.forEach(function (el, i) {
                el.style.transitionDelay = (i * 0.1) + 's';
            });
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    })();

    // Contact Form Validation & Processing
    (function contactForm() {
        const form = document.querySelector('.contact-form');
        const submitBtn = form ? form.querySelector('.send-btn') : null;
        if (!form || !submitBtn) return;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            var inputs = form.querySelectorAll('input[required], textarea[required]');
            var isValid = true;

            inputs.forEach(function (input) {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('input-error');
                } else {
                    input.classList.remove('input-error');
                }
            });

            if (!isValid) return;

            var originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

            try {
                var response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    submitBtn.style.background = '#28a745';
                    submitBtn.innerHTML = 'Sent Successfully! <i class="fa-solid fa-check"></i>';
                    form.reset();
                } else {
                    throw new Error('Failed to send');
                }
            } catch (err) {
                submitBtn.style.background = '#dc3545';
                submitBtn.innerHTML = 'Error! Try Again <i class="fa-solid fa-xmark"></i>';
            } finally {
                setTimeout(function () {
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    submitBtn.innerHTML = originalBtnText;
                }, 4000);
            }
        });
    })();

});
