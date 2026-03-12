const animatedHeadings = [
    { el: document.querySelector('#hero h1'), mode: 'hero' },
    { el: document.querySelector('#services-section h2'), mode: 'section' },
    { el: document.querySelector('#pricing h1'), mode: 'section' },
    { el: document.querySelector('#about h2'), mode: 'section' },
    { el: document.querySelector('#contact h2'), mode: 'section' }
].filter(item => item.el);

// Track initial top positions to detect headings already at top on load
animatedHeadings.forEach(item => {
    item.initialTop = item.el.getBoundingClientRect().top + window.scrollY;
});

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function getHeadingScrollProgress(el, mode, scrollPosition, windowHeight, initialTop) {
    if (mode === 'hero') {
        return clamp(scrollPosition / (windowHeight * 0.1), 0, 1);
    }
    // If heading starts near the top of the page (within viewport), use scroll-based animation
    if (initialTop < windowHeight) {
        const scrollNeeded = windowHeight * 0.25;
        return clamp(scrollPosition / scrollNeeded, 0, 1);
    }
    const rect = el.getBoundingClientRect();
    const startPoint = windowHeight * 0.8;
    const endPoint = windowHeight * 0.55;
    return clamp((startPoint - rect.top) / (startPoint - endPoint), 0, 1);
}

function updateHeadingVisuals(scrollPosition, windowHeight) {
    animatedHeadings.forEach(({ el, mode, initialTop }) => {
        const progress = getHeadingScrollProgress(el, mode, scrollPosition, windowHeight, initialTop);
        el.style.setProperty('--underline-width', `${progress * 100}%`);
        el.style.fontWeight = `${300 + (progress * 400)}`;
    });
}

// Scroll-based animations
window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    const servicesSection = document.getElementById('services-section');
    const aboutSection = document.getElementById('about');
    const pricingSection = document.getElementById('pricing');
    const pricingTable = document.querySelector('.pricing-table');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    updateHeadingVisuals(scrollPosition, windowHeight);
    
    // Darken hero section when scrolled past
    if (hero) {
        const heroRect = hero.getBoundingClientRect();
        if (heroRect.bottom < windowHeight * 0.5) {
            hero.classList.add('fade-out');
        } else {
            hero.classList.remove('fade-out');
        }
    }

    if (servicesSection) {
        const servicesRect = servicesSection.getBoundingClientRect();
        if (servicesRect.bottom < windowHeight * 0.45) {
            servicesSection.classList.add('fade-out');
        } else {
            servicesSection.classList.remove('fade-out');
        }
    }

    if (aboutSection) {
        const aboutRect = aboutSection.getBoundingClientRect();
        if (aboutRect.bottom < windowHeight * 0.45) {
            aboutSection.classList.add('fade-out');
        } else {
            aboutSection.classList.remove('fade-out');
        }
    }

    if (pricingSection && pricingTable) {
        const tableRect = pricingTable.getBoundingClientRect();
        const fadeProgress = clamp((-tableRect.top) / (tableRect.height * 0.35), 0, 1);
        const tableOpacity = 1 - (0.72 * fadeProgress);
        pricingSection.style.opacity = `${tableOpacity}`;
    }
    
    // Change images based on service items in view
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceImages = document.querySelectorAll('.service-image');
    
    serviceItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemMiddle = rect.top + rect.height / 2;
        
        // Check if service item is in the middle of viewport
        if (itemMiddle > 0 && itemMiddle < windowHeight * 0.6) {
            const serviceNum = item.getAttribute('data-service');
            
            // Remove active class from all images
            serviceImages.forEach(img => img.classList.remove('active'));
            
            // Add active class to corresponding image
            const activeImage = document.querySelector(`.service-image[data-service="${serviceNum}"]`);
            if (activeImage) {
                activeImage.classList.add('active');
            }
        }
    });
});

updateHeadingVisuals(window.scrollY, window.innerHeight);

const serviceImages = document.querySelectorAll('.service-image');
const initialServiceImage = document.querySelector('.service-image[data-service="1"]');
if (serviceImages.length && initialServiceImage) {
    serviceImages.forEach(img => img.classList.remove('active'));
    initialServiceImage.classList.add('active');
}

// ── Floating Background Shapes ─────────────────────────
(function createFloatingShapes() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const shapes = ['🚀', '✦', '◆', '⬡', '✧', '△', '⭑', '⚡', '✶', '◇', '⬢', '★'];
    const count = window.innerWidth < 600 ? 14 : 25;

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'floaty';
        el.textContent = shapes[Math.floor(Math.random() * shapes.length)];

        const size = 10 + Math.random() * 18;
        const opacity = 0.08 + Math.random() * 0.16;
        const duration = 8 + Math.random() * 14;
        const delay = -(Math.random() * duration);

        // Random direction — fly from one side/edge to another
        const angle = Math.random() * Math.PI * 2;
        const distance = 600 + Math.random() * 800;
        const startX = -Math.cos(angle) * distance * 0.5;
        const startY = -Math.sin(angle) * distance * 0.5;
        const endX   =  Math.cos(angle) * distance * 0.5;
        const endY   =  Math.sin(angle) * distance * 0.5;
        const rotStart = Math.random() * 360;
        const rotEnd   = rotStart + (Math.random() - 0.5) * 360;

        // Place origin randomly on screen
        const ox = Math.random() * 100;
        const oy = Math.random() * 100;

        el.style.cssText = `
            left:${ox}%;top:${oy}%;
            --f-size:${size}px;
            --f-opacity:${opacity};
            --f-dur:${duration}s;
            --f-delay:${delay}s;
            --f-startX:${startX}px;--f-startY:${startY}px;
            --f-endX:${endX}px;--f-endY:${endY}px;
            --f-rot-start:${rotStart}deg;--f-rot-end:${rotEnd}deg;
        `;
        container.appendChild(el);
    }
})();

// ── Testimonial Carousel ───────────────────────────────
(function initTestimonialCarousel() {
    const track  = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots   = document.querySelectorAll('.testimonial-dot');
    if (!slides.length || !track) return;

    // Measure the tallest slide and lock the track height
    function setTrackHeight() {
        let maxH = 0;
        slides.forEach(s => {
            s.style.position = 'relative';
            s.style.visibility = 'hidden';
            s.style.opacity = '0';
            s.style.display = 'block';
            maxH = Math.max(maxH, s.offsetHeight);
            s.style.position = '';
            s.style.visibility = '';
            s.style.opacity = '';
            s.style.display = '';
        });
        track.style.height = maxH + 'px';
    }
    setTrackHeight();
    window.addEventListener('resize', setTrackHeight);

    let current  = 0;
    let interval;

    function goToSlide(index) {
        const outgoing = current;
        slides[outgoing].classList.remove('active');
        slides[outgoing].classList.add('exit');
        dots[outgoing].classList.remove('active');

        current = index;
        slides[current].classList.add('active');
        dots[current].classList.add('active');

        setTimeout(() => {
            slides[outgoing].classList.remove('exit');
        }, 500);
    }

    function startAutoplay() {
        interval = setInterval(() => {
            goToSlide((current + 1) % slides.length);
        }, 5000);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.slide);
            if (idx !== current) {
                goToSlide(idx);
                clearInterval(interval);
                startAutoplay();
            }
        });
    });

    startAutoplay();
})();

// ── Hamburger mobile menu (compact dropdown) ──────
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close dropdown when a link is tapped
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}
