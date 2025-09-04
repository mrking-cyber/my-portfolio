// script.js (clean roaming cat version)

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - (document.querySelector('.navbar').offsetHeight),
                behavior: 'smooth'
            });
        }
    });
});

// Responsive navigation toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            const icon = navToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
});

// --- Cat Animation Logic ---
const catCharacter = document.getElementById('cat-character');
let currentAnimation = 'idle_main';
let currentX = 50;
let currentY = 0;
let facingDirection = 1;
const frameWidth = 32;
const frameHeight = 32;
let isCatBusy = false;
let frameTimer = null;
let frameIndex = 0;
let idleTimer;
let hasWokenUp = false;

// Sprite map
const SPRITE_MAP = {
    idle_main:   { row: 0, frames: 4, fps: 4 },
    idle_look:   { row: 1, frames: 4, fps: 4 },
    idle_groom1: { row: 2, frames: 4, fps: 4 },
    idle_groom2: { row: 3, frames: 4, fps: 4 },
    walk:        { row: 5, frames: 6, fps: 8 },
    // Corrected rows based on the sprite sheet image
    sleep:       { row: 6, frames: 4, fps: 8 }, // The sleep row is index 6
    stretch:     { row: 9, frames: 8, fps: 8 },
};

function setCatAnimation(animationName) {
    if (currentAnimation !== animationName) {
        currentAnimation = animationName;
        playSpriteAnimation(animationName);
    }
}

function playSpriteAnimation(animationName) {
    const sprite = SPRITE_MAP[animationName];
    if (!sprite) return;

    cancelAnimationFrame(frameTimer);
    frameIndex = 0;

    const frameDuration = 1000 / sprite.fps;
    let lastFrameTime = performance.now();

    function step(currentTime) {
        if (currentTime - lastFrameTime >= frameDuration) {
            frameIndex = (frameIndex + 1) % sprite.frames;
            const x = -frameIndex * frameWidth;
            const y = -sprite.row * frameHeight;
            catCharacter.style.backgroundPosition = `${x}px ${y}px`;
            lastFrameTime = currentTime;
        }
        frameTimer = requestAnimationFrame(step);
    }

    frameTimer = requestAnimationFrame(step);
}

function updateCatPosition() {
    catCharacter.style.left = `${currentX}px`;
    catCharacter.style.bottom = `${currentY}px`;
}

function setFacingDirection(direction) {
    facingDirection = direction;
    catCharacter.style.transform = `scaleX(${facingDirection})`;
}

function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        const idleAnimations = ['idle_main', 'idle_look', 'idle_groom1', 'idle_groom2'];
        const choice = idleAnimations[Math.floor(Math.random() * idleAnimations.length)];
        setCatAnimation(choice);
    }, 5000);
}

function animateWalk(targetX, duration) {
    if (isCatBusy) return;
    isCatBusy = true;
    setCatAnimation('walk');
    const startX = currentX;
    const distanceX = targetX - startX;
    const startTime = performance.now();
    setFacingDirection(distanceX > 0 ? 1 : -1);

    function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        currentX = startX + distanceX * progress;
        updateCatPosition();
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            isCatBusy = false;
            resetIdleTimer();
        }
    }
    requestAnimationFrame(step);
}

// Initial wake-up and groom sequence
function wakeUpAndGroom() {
    if (isCatBusy || hasWokenUp) return;
    isCatBusy = true;
    clearTimeout(idleTimer);

    // 1. Wake up/stretch
    setCatAnimation('stretch');
    setTimeout(() => {
        // 2. Groom
        setCatAnimation('idle_groom1');
        setTimeout(() => {
            // 3. Resume roaming
            isCatBusy = false;
            hasWokenUp = true;
            resetIdleTimer();
        }, 3000);
    }, 2000);
}

// Handle clicks for wake-up sequence and movement
document.addEventListener('click', (event) => {
    if (!hasWokenUp) {
        wakeUpAndGroom();
    } else {
        const targetX = Math.max(0, Math.min(event.clientX - frameWidth / 2, window.innerWidth - frameWidth));
        const distance = Math.abs(targetX - currentX);
        if (distance > 5) {
            animateWalk(targetX, distance * 10);
        }
    }
});

// Init cat
document.addEventListener('DOMContentLoaded', () => {
    currentX = 50;
    currentY = 0;
    catCharacter.style.position = 'fixed';
    updateCatPosition();
    setCatAnimation('sleep');
});

// Contact form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', () => {
            setTimeout(() => {
                alert('Thank you for your message! I will get back to you soon.');
            }, 500);
        });
    }
});