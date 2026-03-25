// =========================================
// CUSTOM CURSOR LOGIC
// =========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot moves instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with a slight delay
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Cursor expansion on hover
const interactables = document.querySelectorAll('a, button, .skill-card, .project-card, .repo-card, .certificate-link');
interactables.forEach(link => {
    link.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
    link.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
});

// =========================================
// NAVBAR SCROLL & ACTIVE LINK
// =========================================
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links li a');

window.addEventListener('scroll', () => {
    // Navbar glass effect on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// =========================================
// MOBILE MENU TOGGLE
// =========================================
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinksContainer.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// =========================================
// THEME TOGGLE
// =========================================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check local storage for theme
const savedTheme = localStorage.getItem('portfolioTheme');
if (savedTheme === 'light') {
    body.classList.replace('dark-theme', 'light-theme');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
        body.classList.replace('dark-theme', 'light-theme');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('portfolioTheme', 'light');
    } else {
        body.classList.replace('light-theme', 'dark-theme');
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('portfolioTheme', 'dark');
    }
});

// =========================================
// TYPING ANIMATION
// =========================================
const typingText = document.querySelector('.typing-text');
const roles = ['Full Stack Developer', 'Backend Developer', 'Software Engineer', 'Web Developer', 'REST API Developer', 'Computer Science Student'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        typingDelay = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingDelay = 500; // Pause before new word
    }

    setTimeout(type, typingDelay);
}

// Start animations on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
});

// =========================================
// SCROLL REVEAL ANIMATIONS
// =========================================
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // observer.unobserve(entry.target); // Uncomment to animate only once
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Trigger initial reveal for elements in viewport on load
setTimeout(() => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
            el.classList.add('active');
        }
    });
}, 300);

// =========================================
// 3D TILT EFFECT
// =========================================
function initTilt(element) {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
}

// Apply tilt to static project cards
document.querySelectorAll('.project-card, .certificate-card').forEach(card => initTilt(card));

// =========================================
// CANVAS PARTICLES BACKGROUND
// =========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let mouse = { x: null, y: null, radius: 100 };

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor(x, y, size, color, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.baseX = this.x;
        this.baseY = this.y;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Move particles
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) this.velocityX = -this.velocityX;
        if (this.y > canvas.height || this.y < 0) this.velocityY = -this.velocityY;

        // Mouse interaction (repel)
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = forceDirectionX * force * 5;
                const directionY = forceDirectionY * force * 5;

                this.x -= directionX;
                this.y -= directionY;
            }
        }

        this.draw();
    }
}

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesArray = [];

    // Adjust particle count based on screen size
    let numberOfParticles = (canvas.width * canvas.height) / 10000;

    // Check theme for colors
    const isDark = document.body.classList.contains('dark-theme');

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.5;
        let x = Math.random() * innerWidth;
        let y = Math.random() * innerHeight;
        let velocityX = (Math.random() * 1) - 0.5;
        let velocityY = (Math.random() * 1) - 0.5;

        // Use theme matching colors
        const colors = [
            isDark ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 150, 255, 0.4)',  // Blue
            isDark ? 'rgba(138, 43, 226, 0.4)' : 'rgba(100, 30, 200, 0.4)', // Purple
            'rgba(255, 255, 255, 0.2)'
        ];
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, size, color, velocityX, velocityY));
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connecting lines
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        for (let j = i; j < particlesArray.length; j++) {
            let dx = particlesArray[i].x - particlesArray[j].x;
            let dy = particlesArray[i].y - particlesArray[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const isDark = document.body.classList.contains('dark-theme');
                ctx.beginPath();
                ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${0.12 - distance / 1500})` : `rgba(0, 0, 0, ${0.06 - distance / 3000})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

// Re-init canvas on resize and theme toggle
window.addEventListener('resize', () => {
    initCanvas();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    // Slight delay to allow theme class update
    setTimeout(initCanvas, 100);
});

initCanvas();
animateParticles();

// Contact form submission with Formspree (AJAX)
document.getElementById('contactForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button');
    const btnText = btn.querySelector('span');
    const btnIcon = btn.querySelector('i');

    // UI Elements for feedback
    const successPopup = document.getElementById('form-success');
    const errorPopup = document.getElementById('form-error');

    // Button loading state
    const originalText = btnText.textContent;
    const originalIconClass = btnIcon.className;

    btn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.className = 'fa-solid fa-spinner fa-spin';

    try {
        const formData = new FormData(form);
        const response = await fetch("https://formspree.io/f/xeerzdoa", {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success
            successPopup.classList.add('active');
            form.reset();
            setTimeout(() => {
                successPopup.classList.remove('active');
            }, 3000);
        } else {
            // Server error
            errorPopup.classList.add('active');
            setTimeout(() => {
                errorPopup.classList.remove('active');
            }, 3000);
        }
    } catch (error) {
        // Network error
        errorPopup.classList.add('active');
        setTimeout(() => {
            errorPopup.classList.remove('active');
        }, 3000);
    } finally {
        // Re-enable button
        btn.disabled = false;
        btnText.textContent = originalText;
        btnIcon.className = originalIconClass;
    }
});

// =========================================
// RESUME MODAL LOGIC
// =========================================
const resumeBtn = document.getElementById('resume-btn');
const resumeModal = document.getElementById('resume-modal');
const closeModal = document.querySelector('.close-modal');

if (resumeBtn && resumeModal) {
    resumeBtn.addEventListener('click', () => {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    const closeFunc = () => {
        resumeModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeModal.addEventListener('click', closeFunc);

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === resumeModal) {
            closeFunc();
        }
    });
}
