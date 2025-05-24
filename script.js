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
            // Prevent body scroll when mobile menu is open
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
                // Scroll Down
                mainHeader.classList.add('header-hidden');
            } else {
                // Scroll Up or at top
                mainHeader.classList.remove('header-hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        }, false);
    }


    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');

    if (cursorDot && cursorOutline) {
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

        function type() {
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
            setTimeout(type, delay);
        }
        if (phrases.length > 0) { // Only start if there are phrases
           setTimeout(type, 500); // Initial delay before typing starts
        }
    }


    // --- Active Link Highlighting & Dot Navigation ---
    const mainNavLinksJS = document.querySelectorAll('#navbar .nav-link'); // Renamed to avoid conflict
    const dotNavLinksJS = document.querySelectorAll('#dot-navigation .dot-link');
    const sectionsJS = document.querySelectorAll('.main-section'); // Renamed
    const headerHeightJS = mainHeader?.offsetHeight || 70; // Renamed

    function updateActiveLink() {
        let currentSectionId = '';
        let minDistance = Infinity;

        sectionsJS.forEach(section => {
            const sectionTop = section.offsetTop - headerHeightJS;
            const distanceToTop = Math.abs(window.scrollY - sectionTop);

            if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + section.offsetHeight -100) {
                 // Prioritize sections fully in view or just entered
                currentSectionId = section.getAttribute('id');
                return; // Exit early if a good match is found
            }
            
            // Fallback for finding the closest section if none are "perfectly" in view
            if (distanceToTop < minDistance) {
                minDistance = distanceToTop;
                if (!currentSectionId) currentSectionId = section.getAttribute('id'); // Only set if not already set by better logic
            }
        });
        
        // If at the very top, ensure 'hero-section' is active
        if (window.scrollY < sectionsJS[0].offsetTop + sectionsJS[0].offsetHeight / 3) {
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
                    // Optional: Remove class to re-animate on scroll up/out
                    // entry.target.classList.remove('is-visible');
                }
            });
        }, {
            threshold: 0.15 // Trigger when 15% of the element is visible
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
                // Manually trigger blur on inputs to reset floating labels if CSS relies on :valid
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

    // --- Adjust main content padding top based on header height ---
    // This is a robust way to prevent header overlap, especially if header height changes dynamically
    const mainContent = document.getElementById('main-content');
    if (mainContent && mainHeader) {
        const setMainContentPadding = () => {
            // The hero section is full height, so it doesn't need this padding.
            // Other sections will get their padding from .content-section CSS.
            // This logic primarily ensures that if a link jumps to a section,
            // it accounts for the header.
            // However, the hero section (#hero-section) is special.
            // It should start at the very top.
            // Other sections are handled by the .content-section padding-top
            // if (document.getElementById('hero-section')) {
            //    document.getElementById('hero-section').style.paddingTop = '0';
            // }
        };
        setMainContentPadding();
        window.addEventListener('resize', setMainContentPadding); // Recalculate on resize
    }


}); // End DOMContentLoaded