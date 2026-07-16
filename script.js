/* ============================================
   BHULOKAM NANDINI — Portfolio JS
   ============================================ */

// ---- Loader ----
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader')?.classList.add('hide'), 700);
});

// ---- Year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Navbar Scroll + Active Section ----
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const scrollProgress = document.getElementById('scrollProgress');
const scrollTopBtn = document.getElementById('scrollTop');

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 30);
  scrollTopBtn.classList.toggle('show', y > 500);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (y / docHeight) * 100 + '%';

  let current = '';
  sections.forEach(s => {
    if (y >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });

// ---- Mobile Menu ----
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});
navLinks.forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinksContainer.classList.remove('open');
}));

// ---- Scroll to Top ----
scrollTopBtn.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

// ---- Typing Animation ----
const typingEl = document.getElementById('typingText');
const phrases = [
  'Software Engineer',
  'Python Developer',
  'Data Science Student',
  'Future Full Stack Developer'
];
let pIdx = 0, cIdx = 0, deleting = false;
function type() {
  const phrase = phrases[pIdx];
  typingEl.textContent = phrase.slice(0, cIdx);
  if (!deleting && cIdx < phrase.length) {
    cIdx++; setTimeout(type, 80);
  } else if (deleting && cIdx > 0) {
    cIdx--; setTimeout(type, 40);
  } else {
    deleting = !deleting;
    if (!deleting) pIdx = (pIdx + 1) % phrases.length;
    setTimeout(type, deleting ? 1500 : 400);
  }
}
type();

// ---- Reveal on Scroll ----
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- Skill Bars + Counters (when in view) ----
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      barIO.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.bar').forEach(b => barIO.observe(b));

const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      counterIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(c => counterIO.observe(c));

function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    if (decimals === 2) {
      el.textContent = (val / 100).toFixed(2);
    } else {
      el.textContent = Math.floor(val) + (target >= 5 && p === 1 ? '+' : '');
    }
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ---- Cursor Glow ----
const cursor = document.getElementById('cursorGlow');
window.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ---- Particles ----
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function initParticles() {
  const count = Math.min(80, Math.floor(window.innerWidth / 18));
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.4,
      c: Math.random() > 0.5 ? '0, 229, 255' : '177, 77, 255'
    });
  }
}
initParticles();
window.addEventListener('resize', initParticles);

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.c}, 0.8)`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(${p.c}, 0.8)`;
    ctx.fill();
  });
  // connect close particles
  ctx.shadowBlur = 0;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(120, 180, 255, ${0.12 * (1 - d / 130)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ---- Contact Form Validation ----
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

function setError(id, msg) {
  const input = document.getElementById(id);
  input.parentElement.querySelector('.error').textContent = msg;
  return !msg;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  status.textContent = '';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  let ok = true;
  ok &= setError('name', name.length < 2 ? 'Please enter your name' : (name.length > 100 ? 'Max 100 characters' : ''));
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  ok &= setError('email', !emailRe.test(email) ? 'Enter a valid email' : (email.length > 255 ? 'Max 255 characters' : ''));
  ok &= setError('subject', subject.length < 2 ? 'Please enter a subject' : (subject.length > 150 ? 'Max 150 characters' : ''));
  ok &= setError('message', message.length < 5 ? 'Message is too short' : (message.length > 1000 ? 'Max 1000 characters' : ''));

  if (!ok) return;

  status.style.color = 'var(--cyan)';
  status.textContent = '✓ Message ready! Opening your email client...';
  const mailto = `mailto:nandhinireddy186@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Nandini,\n\n${message}\n\n— ${name}\n${email}`)}`;
  setTimeout(() => { window.location.href = mailto; }, 600);
  form.reset();
});
