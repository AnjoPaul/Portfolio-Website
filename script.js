document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const mainHeader = document.getElementById('main-header'); // For hide/show on scroll

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // --- Header Hide/Show on Scroll ---
    let lastScrollTop = 0;
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > mainHeader.offsetHeight) {
                mainHeader.classList.add('header-hidden');
            } else {
                mainHeader.classList.remove('header-hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, false);
    }

    // --- Custom Cursor (Desktop/Laptop Screens Only) ---
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');

    // Function to check if it's likely a touch device
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (navigator.msMaxTouchPoints > 0));
    }

    if (!isTouchDevice()) { // Only initialize if NOT a touch device
        if (cursorDot && cursorOutline) {
            // Make custom cursor elements visible (CSS hides them by default)
            // body:hover rule in CSS will handle opacity once this is not display:none
            // We need to override the initial opacity: 0 in CSS for the body:hover to take effect
            // cursorDot.style.opacity = '1'; // Or handle via a class
            // cursorOutline.style.opacity = '1';

            // Let CSS handle initial opacity via body:hover
            // The JS will just attach event listeners

            document.body.style.cursor = 'none'; // Hide default system cursor

            window.addEventListener('mousemove', e => {
                const posX = e.clientX;
                const posY = e.clientY;

                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;

                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 300, fill: 'forwards' });
            });
        }
    } else {
        // On touch devices, ensure default cursor is used and custom ones are definitely hidden
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto'; // Ensure default cursor
    }


    // --- Typed Text Effect ---
    const typedOutput = document.getElementById('typed-output');
    const typedCursor = document.querySelector('.typed-cursor');
    if (typedOutput && typedCursor) {
        const phrases = [ // Customize these!
            "Software Developer",
            "Full-Stack Enthusiast",
            "Creative Problem Solver",
            "Tech Explorer"
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 120; // milliseconds
        const deleteSpeed = 60;
        const pauseBetweenPhrases = 1800;
        let typeTimeout; // To clear timeout if needed

        function type() {
            clearTimeout(typeTimeout); // Clear previous timeout
            typedCursor.style.display = 'inline';
            const currentPhrase = phrases[phraseIndex];
            let textToDisplay = '';

            if (isDeleting) {
                textToDisplay = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textToDisplay = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            typedOutput.textContent = textToDisplay;

            let delay = isDeleting ? deleteSpeed : typeSpeed;

            if (!isDeleting && charIndex === currentPhrase.length) {
                delay = pauseBetweenPhrases;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = typeSpeed; // Start typing next word quickly
            }
            typeTimeout = setTimeout(type, delay);
        }
        if (phrases.length > 0) { // Only start if there are phrases
           typeTimeout = setTimeout(type, 500); // Initial delay before typing starts
        }
    }


    // --- Active Link Highlighting & Dot Navigation ---
    const mainNavLinksJS = document.querySelectorAll('#navbar .nav-link');
    const dotNavLinksJS = document.querySelectorAll('#dot-navigation .dot-link');
    const sectionsJS = document.querySelectorAll('.main-section');
    const headerHeightJS = mainHeader?.offsetHeight || 70;

    function updateActiveLink() {
        let currentSectionId = '';
        let minDistance = Infinity;

        sectionsJS.forEach(section => {
            const sectionTop = section.offsetTop - headerHeightJS;
            // const distanceToTop = Math.abs(window.scrollY - sectionTop); // Not used currently

            // Adjusted condition for better accuracy: check if scrollY is within the section bounds
            // considering a bit of buffer for the header and user perception
            if (window.scrollY >= sectionTop - 50 && window.scrollY < sectionTop + section.offsetHeight - headerHeightJS - 50) {
                currentSectionId = section.getAttribute('id');
                return; // Exit early if a good match is found
            }
        });
        
        // If no section is actively matched by the above, check the closest (fallback)
        // This is helpful for very short sections or unusual scroll positions
        if (!currentSectionId) {
            sectionsJS.forEach(section => {
                const sectionTop = section.offsetTop - headerHeightJS;
                const distanceToTop = Math.abs(window.scrollY - sectionTop);
                 if (distanceToTop < minDistance) {
                    minDistance = distanceToTop;
                    currentSectionId = section.getAttribute('id');
                }
            });
        }
        
        // If at the very top, ensure 'hero-section' is active
        if (window.scrollY < sectionsJS[0].offsetTop + sectionsJS[0].offsetHeight / 2 - headerHeightJS) {
            currentSectionId = sectionsJS[0].getAttribute('id');
        }


        mainNavLinksJS.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
        dotNavLinksJS.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === currentSectionId) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink);


    // --- On-Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, {
            threshold: 0.15
        });
        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Contact Form (Basic: logs to console) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (name && email && message) {
                console.log('Form Submitted:', { name, email, message });
                alert('Thank you for your message! (Details logged to console)');
                contactForm.reset();
                document.querySelectorAll('#contact-form input, #contact-form textarea').forEach(input => {
                    input.blur();
                });
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    // --- Footer Current Year ---
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded