// script.js

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
            const navLinks = document.querySelector('.nav-links');
            if (navLinks.classList.contains('nav-open')) {
                navLinks.classList.remove('nav-open');
                document.querySelector('.nav-toggle i').classList.remove('fa-times');
                document.querySelector('.nav-toggle i').classList.add('fa-bars');
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('nav-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !navToggle.contains(event.target) && navLinks.classList.contains('nav-open')) {
                navLinks.classList.remove('nav-open');
                navToggle.querySelector('i').classList.remove('fa-times');
                navToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    }
});


const catCharacter = document.getElementById('cat-character');
let currentAnimation = 'idle';
let currentX = 50;
let currentY = 0;
let facingDirection = 1;
const frameWidth = 32;
const frameHeight = 32;
const movementSpeed = 0.15;
let isCatBusy = false;
let idleTimer;
const idleActionDelayMin = 5000;
const idleActionDelayMax = 10000;

function setCatAnimation(animationName) {
    if (currentAnimation !== animationName) {
        catCharacter.classList.remove(currentAnimation);
        catCharacter.classList.add(animationName);
        currentAnimation = animationName;
    }
}

function updateCatPosition() {
    catCharacter.style.left = `${currentX}px`;
    catCharacter.style.bottom = `${currentY}px`;
}

function setFacingDirection(direction) {
    if (facingDirection !== direction) {
        facingDirection = direction;
        catCharacter.style.transform = `scaleX(${facingDirection})`;
    }
}

function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(performRandomIdleAction, Math.random() * (idleActionDelayMax - idleActionDelayMin) + idleActionDelayMin);
}

function performRandomIdleAction() {
    if (isCatBusy) return;

    setCatAnimation('idle');
    resetIdleTimer();
}


function animateWalk(targetX, duration) {
    if (isCatBusy) return;
    isCatBusy = true;
    setCatAnimation('walk');

    const startX = currentX;
    const distanceX = targetX - startX;
    const startTime = performance.now();

    setFacingDirection(distanceX > 0 ? 1 : -1);

    function animateWalkFrame(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        currentX = startX + (distanceX * progress);

        updateCatPosition();

        if (progress < 1) {
            requestAnimationFrame(animateWalkFrame);
        } else {
            setCatAnimation('idle');
            isCatBusy = false;
            resetIdleTimer();
        }
    }
    requestAnimationFrame(animateWalkFrame);
}

function initCat() {
    currentX = 50;
    currentY = 0;
    updateCatPosition();
    
    setCatAnimation('idle');
    
    resetIdleTimer();
}

document.addEventListener('DOMContentLoaded', initCat);

document.addEventListener('click', (event) => {
    if (event.target === catCharacter) {
        return;
    }

    const clickX = event.clientX;
    
    const targetX = Math.max(0, Math.min(clickX - frameWidth / 2, window.innerWidth - frameWidth));

    const distance = Math.abs(targetX - currentX);
    if (distance > 5) {
        const duration = distance / movementSpeed;
        animateWalk(targetX, duration);
    } else {
        setCatAnimation('idle');
        resetIdleTimer();
    }
});

window.addEventListener('resize', () => {
    if (catCharacter.style.bottom === '0px') {
        currentX = Math.max(0, Math.min(currentX, window.innerWidth - frameWidth));
        updateCatPosition();
    }
    resetIdleTimer();
});

document.addEventListener('keydown', resetIdleTimer);
document.addEventListener('mousemove', resetIdleTimer);