const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu-button');
const navLinks = document.querySelectorAll('.nav nav a');
const glowCursor = document.querySelector('.glow-cursor');

window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 16), { passive: true });
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navLinks.forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));

const processItems = document.querySelectorAll('.process-list li');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { processItems.forEach(item => item.classList.remove('active')); entry.target.classList.add('active'); } });
}, { threshold: .65 });
processItems.forEach(item => observer.observe(item));

document.querySelectorAll('.section-heading, .project, .service, .offer-grid, .process-list, .about > *, .why-card').forEach(element => {
  element.classList.add('js-reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); } });
  }, { threshold: .12 });
  revealObserver.observe(element);
});

document.querySelectorAll('main h2, main section:not(.why) h3, main section:not(.why) p:not(.hero-kicker), .project-info span, .contact-details a').forEach((element, index) => {
  element.classList.add('text-reveal');
  element.style.setProperty('--text-index', String(index % 5));
  const textObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); textObserver.unobserve(entry.target); } });
  }, { threshold: .14 });
  textObserver.observe(element);
});

document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('pointermove', event => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = button.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * .12;
    const y = (event.clientY - bounds.top - bounds.height / 2) * .12;
    button.style.transform = `translate(${x}px, ${y}px)`;
    if (button.classList.contains('specular-button')) {
      button.style.setProperty('--specular-x', `${event.clientX - bounds.left}px`);
      button.style.setProperty('--specular-y', `${event.clientY - bounds.top}px`);
    }
  });
  button.addEventListener('pointerleave', () => { button.style.transform = ''; });
});

document.querySelectorAll('.project').forEach(card => {
  const art = card.querySelector('.project-art');
  if (!art) return;
  card.addEventListener('pointermove', event => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    art.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px) scale(1.015)`;
  });
  card.addEventListener('pointerleave', () => {
    art.style.transform = '';
  });
});

document.body.classList.add('ready');

if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', event => { glowCursor.style.left = `${event.clientX}px`; glowCursor.style.top = `${event.clientY}px`; glowCursor.classList.add('active'); }, { passive: true });
  document.addEventListener('mouseleave', () => glowCursor.classList.remove('active'));
}

const floatingText = document.querySelectorAll('.scroll-float');
if (floatingText.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    floatingText.forEach(element => {
      const rect = element.getBoundingClientRect();
      const offset = Math.max(-18, Math.min(18, (window.innerHeight / 2 - rect.top) * .045));
      element.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
}

const depthText = document.querySelector('.depth-text');
if (depthText && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  depthText.addEventListener('pointermove', event => {
    const bounds = depthText.getBoundingClientRect();
    const rotateY = ((event.clientX - bounds.left) / bounds.width - .5) * 15;
    const rotateX = ((event.clientY - bounds.top) / bounds.height - .5) * -15;
    depthText.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  depthText.addEventListener('pointerleave', () => { depthText.style.transform = ''; });
}

// --- 3D Beam Circle Carousel Interaction ---
const beamStage = document.querySelector('.beam-circle-stage');
const beamTrack = document.querySelector('.beam-carousel-track');
const beamCards = document.querySelectorAll('.beam-card');

if (beamStage && beamTrack) {
  let isDragging = false;
  let startX = 0;
  let currentRotation = 0;

  beamCards.forEach(card => {
    card.addEventListener('pointermove', event => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  beamStage.addEventListener('mousedown', (e) => {
    if (e.target.closest('a, button')) return;
    isDragging = true;
    startX = e.clientX;
    beamTrack.style.animationPlayState = 'paused';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    startX = e.clientX;
    currentRotation += dx * 0.4;
    beamTrack.style.transform = `translate(-50%, -50%) rotateX(-6deg) rotateY(${currentRotation}deg)`;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      if (!beamStage.matches(':hover')) {
        beamTrack.style.animationPlayState = 'running';
      }
    }
  });
}

document.getElementById('year').textContent = new Date().getFullYear();


