document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const mainHeader = document.getElementById('main-header');

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

    function isTouchDevice() {
        return (('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (navigator.msMaxTouchPoints > 0));
    }

    if (!isTouchDevice()) {
        if (cursorDot && cursorOutline) {
            document.body.style.cursor = 'none';

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
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // --- Typed Text Effect ---
    const typedOutput = document.getElementById('typed-output');
    const typedCursor = document.querySelector('.typed-cursor');
    if (typedOutput && typedCursor) {
        const phrases = [
            "Software Developer",
            "Full-Stack Enthusiast",
            "Creative Problem Solver",
            "Tech Explorer"
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 120;
        const deleteSpeed = 60;
        const pauseBetweenPhrases = 1800;
        let typeTimeout;

        function type() {
            clearTimeout(typeTimeout);
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
                delay = typeSpeed;
            }
            typeTimeout = setTimeout(type, delay);
        }
        if (phrases.length > 0) {
           typeTimeout = setTimeout(type, 500);
        }
    }

    // --- Active Link Highlighting & Dot Navigation ---
    const mainNavLinksJS = document.querySelectorAll('#navbar .nav-link');
    const dotNavLinksJS = document.querySelectorAll('#dot-navigation .dot-link');
    const sectionsJS = document.querySelectorAll('.main-section');
    const headerHeightJS = mainHeader?.offsetHeight || 70;

    function updateActiveLink() {
        let currentSectionId = '';
        // Use a more generous offset for determining "current" section.
        // This helps when sections are short or scrolling is fast.
        const scrollPosition = window.scrollY + headerHeightJS + window.innerHeight / 2.5;


        sectionsJS.forEach(section => {
            if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Fallback: if no section is matched (e.g. at very top/bottom)
        // or if currentSectionId is still empty, try finding closest.
        if (!currentSectionId) {
            let minDistance = Infinity;
            sectionsJS.forEach(section => {
                const sectionTop = section.offsetTop - headerHeightJS; // Consider header for distance calculation
                const distance = Math.abs(window.scrollY - sectionTop);
                if (distance < minDistance) {
                    minDistance = distance;
                    currentSectionId = section.getAttribute('id');
                }
            });
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

    // --- Contact Form ---
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