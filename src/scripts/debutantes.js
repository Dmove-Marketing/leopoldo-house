/* reveal no scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* header scroll */
const header = document.querySelector('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* carrossel */
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const wrap    = carousel.querySelector('.about-track-wrap');
  const track   = carousel.querySelector('.about-track');
  const slides  = Array.from(carousel.querySelectorAll('.about-slide'));
  const dotsEl  = carousel.querySelector('[data-dots]');
  const GAP     = parseInt(getComputedStyle(track).gap) || 18;
  const total   = slides.length;
  let visible   = window.innerWidth <= 760 ? 1 : 3;
  let maxIdx    = total - visible;
  let current   = 0;
  let timer;

  function slideWidth() {
    return (wrap.offsetWidth - GAP * (visible - 1)) / visible;
  }

  function resize() {
    visible = window.innerWidth <= 760 ? 1 : 3;
    maxIdx  = total - visible;
    if (current > maxIdx) current = maxIdx;
    const w = slideWidth();
    slides.forEach(s => (s.style.width = w + 'px'));
    render(false);
  }

  function render(animate = true) {
    track.style.transition = animate ? 'transform .55s var(--ease)' : 'none';
    track.style.transform  = `translateX(-${current * (slideWidth() + GAP)}px)`;
    slides.forEach((s, i) => s.classList.toggle('is-middle', i === current + 1));
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) =>
      d.classList.toggle('is-active', i === current)
    );
  }

  function goTo(n) {
    current = Math.max(0, Math.min(n, maxIdx));
    render();
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); startTimer(); });
      dotsEl.appendChild(dot);
    }
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current < maxIdx ? current + 1 : 0), 4500);
  }

  carousel.querySelector('.carousel-prev')?.addEventListener('click', () => {
    goTo(current > 0 ? current - 1 : maxIdx); startTimer();
  });
  carousel.querySelector('.carousel-next')?.addEventListener('click', () => {
    goTo(current < maxIdx ? current + 1 : 0); startTimer();
  });

  window.addEventListener('resize', () => { resize(); buildDots(); });

  resize();
  buildDots();
  startTimer();
});
