/* ───────────────────────────────────────────────
   script.js – Portfolio interactions & i18n
─────────────────────────────────────────────── */

/* ── Language toggle ── */
let isAr = false;

function toggleLang() {
  isAr = !isAr;
  const html = document.documentElement;
  const body = document.body;
  const label = document.getElementById('langLabel');

  if (isAr) {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    body.classList.add('ar');
    label.textContent = 'EN';
  } else {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    body.classList.remove('ar');
    label.textContent = 'عربي';
  }

  // Update every element carrying data-en / data-ar
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = isAr ? el.dataset.ar : el.dataset.en;
  });

  // Restart typing animation
  startTyping();
}

/* ── Typing animation ── */
const titlesEn = [
  'Software Engineer',
  'AI & ML Enthusiast',
  'Computer Vision Developer',
  'Problem Solver'
];
const titlesAr = [
  'مهندس برمجيات',
  'متحمس للذكاء الاصطناعي',
  'مطور رؤية حاسوبية',
  'حلّال مشكلات'
];

let typingTimer = null;
let titleIndex = 0;
let charIndex = 0;
let deleting = false;

function startTyping() {
  clearTimeout(typingTimer);
  titleIndex = 0;
  charIndex = 0;
  deleting = false;
  const el = document.getElementById('typedTitle');
  if (el) el.textContent = '';
  typeLoop();
}

function typeLoop() {
  const titles = isAr ? titlesAr : titlesEn;
  const current = titles[titleIndex % titles.length];
  const el = document.getElementById('typedTitle');
  if (!el) return;

  if (!deleting) {
    el.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      typingTimer = setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    el.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      titleIndex++;
    }
  }
  typingTimer = setTimeout(typeLoop, deleting ? 50 : 85);
}

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Smooth scroll for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── Reveal on scroll ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Particle canvas ── */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const canvas  = document.createElement('canvas');
  const ctx     = canvas.getContext('2d');
  container.appendChild(canvas);

  let W, H, dots = [];

  function resize() {
    W = canvas.width  = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Dot {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + .5;
      this.vx = (Math.random() - .5) * .3;
      this.vy = (Math.random() - .5) * .3;
      this.a  = Math.random() * .5 + .2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,99,255,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) dots.push(new Dot());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => { d.update(); d.draw(); });
    // connect nearby dots
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108,99,255,${.08 * (1 - dist/100)})`;
          ctx.lineWidth = .6;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Init ── */
startTyping();
