document.addEventListener('DOMContentLoaded', () => {
    (function certificateViewer() {
        const viewer = document.getElementById('certificate-viewer');
        const image = document.getElementById('full-certificate');

        if (!viewer || !image) {
            return;
        }

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

    (function mobileNav() {
        const menuIcon = document.getElementById('menu-icon');
        const navbar = document.querySelector('.navbar');

        if (!menuIcon || !navbar) {
            return;
        }

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

});