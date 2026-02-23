const animatedHeadings = [
    { el: document.querySelector('#hero h3'), mode: 'hero' },
    { el: document.querySelector('#services-section h3'), mode: 'section' },
    { el: document.querySelector('#pricing h3'), mode: 'section' },
    { el: document.querySelector('#contact h3'), mode: 'section' }
].filter(item => item.el);

const hoveredHeadings = new WeakMap();

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function getHeadingScrollProgress(el, mode, scrollPosition, windowHeight) {
    if (mode === 'hero') {
        return clamp(scrollPosition / (windowHeight * 0.3), 0, 1);
    }

    const rect = el.getBoundingClientRect();
    const startPoint = windowHeight * 0.9;
    const endPoint = windowHeight * 0.3;
    return clamp((startPoint - rect.top) / (startPoint - endPoint), 0, 1);
}

function updateHeadingVisuals(scrollPosition, windowHeight) {
    animatedHeadings.forEach(({ el, mode }) => {
        const scrollProgress = getHeadingScrollProgress(el, mode, scrollPosition, windowHeight);
        const scrollUnderlineWidth = scrollProgress * 100;
        const scrollFontWeight = 300 + (scrollProgress * 400);

        const isHovered = hoveredHeadings.get(el) === true;
        const hoverUnderlineWidth = isHovered ? 100 : 0;
        const hoverFontWeight = isHovered ? 700 : 300;

        const finalUnderlineWidth = Math.max(scrollUnderlineWidth, hoverUnderlineWidth);
        const finalFontWeight = Math.max(scrollFontWeight, hoverFontWeight);

        el.style.setProperty('--underline-width', `${finalUnderlineWidth}%`);
        el.style.fontWeight = `${finalFontWeight}`;
    });
}

animatedHeadings.forEach(({ el }) => {
    hoveredHeadings.set(el, false);

    el.addEventListener('mouseenter', () => {
        hoveredHeadings.set(el, true);
        updateHeadingVisuals(window.scrollY, window.innerHeight);
    });

    el.addEventListener('mouseleave', () => {
        hoveredHeadings.set(el, false);
        updateHeadingVisuals(window.scrollY, window.innerHeight);
    });
});

// Scroll-based animations
window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    const servicesSection = document.getElementById('services-section');
    const pricingSection = document.getElementById('pricing');
    const pricingTable = document.querySelector('.pricing-table');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    updateHeadingVisuals(scrollPosition, windowHeight);
    
    // Fade out hero section
    if (scrollPosition > windowHeight * 0.3) {
        hero.classList.add('fade-out');
        servicesSection.classList.add('visible');
    } else {
        hero.classList.remove('fade-out');
        servicesSection.classList.remove('visible');
    }

    const servicesRect = servicesSection.getBoundingClientRect();
    if (servicesRect.bottom < windowHeight * 0.45) {
        servicesSection.classList.add('fade-out');
    } else {
        servicesSection.classList.remove('fade-out');
    }

    if (pricingSection && pricingTable) {
        const tableRect = pricingTable.getBoundingClientRect();

        // Start fading only after the table itself starts scrolling past the top
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
