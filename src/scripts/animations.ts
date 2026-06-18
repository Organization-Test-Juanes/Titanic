import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ----------------------------------------------------------------------
 * HERO — entrada inicial: título palabra por palabra, subtítulo, botones
 * escalonados y parallax suave de la imagen del montacargas.
 * ------------------------------------------------------------------- */
function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const words = hero.querySelectorAll<HTMLElement>('.hero-word');
  const subtitle = hero.querySelector<HTMLElement>('[data-hero-subtitle]');
  const trust = hero.querySelectorAll<HTMLElement>('[data-hero-trust] > *');
  const buttons = hero.querySelectorAll<HTMLElement>('[data-hero-buttons] > *');
  const image = hero.querySelector<HTMLElement>('[data-hero-image]');

  if (reduced()) {
    gsap.set([words, subtitle, trust, buttons, image], { opacity: 1, y: 0, scale: 1 });
    return;
  }

  gsap.set(words, { opacity: 0, y: 28 });
  gsap.set(subtitle, { opacity: 0, y: 18 });
  gsap.set(trust, { opacity: 0, y: 14 });
  gsap.set(buttons, { opacity: 0, y: 14 });
  gsap.set(image, { opacity: 0, scale: 1.06 });

  const tl = gsap.timeline({ delay: 0.15 });
  tl.to(words, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' })
    .to(image, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, 0.1)
    .to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.55')
    .to(trust, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.3')
    .to(buttons, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.3');

  // Parallax suave de la imagen al hacer scroll
  if (image) {
    gsap.to(image, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

/* ----------------------------------------------------------------------
 * NAVBAR — transparente al inicio, fondo sólido al hacer scroll.
 * ------------------------------------------------------------------- */
function initNavbar() {
  const nav = document.querySelector<HTMLElement>('[data-navbar]');
  if (!nav) return;

  gsap.set(nav, { y: -100 });
  gsap.to(nav, { y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 });

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      nav.classList.toggle('bg-white/95', self.scroll() > 40);
      nav.classList.toggle('shadow-card', self.scroll() > 40);
      nav.classList.toggle('backdrop-blur', self.scroll() > 40);
    },
  });
}

/* ----------------------------------------------------------------------
 * MENÚ MÓVIL — apertura/cierre del panel de navegación en pantallas
 * pequeñas, con una transición simple de altura/opacidad.
 * ------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.querySelector<HTMLElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  if (!toggle || !panel) return;

  gsap.set(panel, { height: 0, opacity: 0, overflow: 'hidden' });
  let open = false;

  toggle.addEventListener('click', () => {
    open = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      gsap.set(panel, { height: 'auto' });
      gsap.from(panel, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.out' });
      gsap.to(panel, { opacity: 1, duration: 0.3 });
    } else {
      gsap.to(panel, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in' });
    }
  });

  panel.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      open = false;
      toggle.setAttribute('aria-expanded', 'false');
      gsap.to(panel, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in' });
    })
  );
}

/* ----------------------------------------------------------------------
 * SCROLL REVEALS — fade-in genérico para cualquier sección marcada con
 * data-animate="up | left | right", se activa una sola vez.
 * ------------------------------------------------------------------- */
function initScrollReveals() {
  const els = document.querySelectorAll<HTMLElement>('[data-animate]');

  els.forEach((el) => {
    const direction = el.dataset.animate;
    const stagger = el.dataset.animateStagger ? Number(el.dataset.animateStagger) : 0;
    const targets = stagger ? Array.from(el.children) : [el];

    if (reduced()) {
      gsap.set(targets, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const from: gsap.TweenVars = { opacity: 0 };
    if (direction === 'left') from.x = -50;
    else if (direction === 'right') from.x = 50;
    else from.y = 40;

    gsap.set(targets, from);
    gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: stagger || 0,
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        once: true,
      },
    });
  });
}

/* ----------------------------------------------------------------------
 * CONTADORES — cifras de [data-counter] animadas desde 0 al entrar
 * en pantalla.
 * ------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');

  counters.forEach((el) => {
    const target = Number(el.dataset.counter ?? '0');
    const suffix = el.dataset.counterSuffix ?? '';
    const obj = { value: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (reduced()) {
          el.textContent = `${target}${suffix}`;
          return;
        }
        gsap.to(obj, {
          value: target,
          duration: 1.6,
          ease: 'power1.out',
          onUpdate: () => {
            el.textContent = `${Math.round(obj.value)}${suffix}`;
          },
        });
      },
    });
  });
}

/* ----------------------------------------------------------------------
 * MEDIDOR DE CARGA — aguja SVG que gira hasta el porcentaje de
 * satisfacción del cliente. Elemento de firma de la sección Stats.
 * ------------------------------------------------------------------- */
function initGauge() {
  const gauge = document.querySelector<HTMLElement>('[data-gauge]');
  const needle = document.querySelector<SVGElement>('[data-gauge-needle]');
  if (!gauge || !needle) return;

  const pct = Number(gauge.dataset.gauge ?? '0') / 100;
  const endAngle = -90 + pct * 180; // recorrido de semicírculo: -90deg a +90deg

  gsap.set(needle, { rotation: -90, transformOrigin: '50% 100%' });

  ScrollTrigger.create({
    trigger: gauge,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(needle, {
        rotation: reduced() ? endAngle : endAngle,
        duration: reduced() ? 0 : 1.4,
        ease: 'power3.out',
      });
    },
  });
}

/* ----------------------------------------------------------------------
 * TARJETAS — elevación, sombra y desplazamiento del icono en hover.
 * ------------------------------------------------------------------- */
function initCardHovers() {
  const cards = document.querySelectorAll<HTMLElement>('[data-card]');

  cards.forEach((card) => {
    const icon = card.querySelector<HTMLElement>('[data-card-icon]');
    const tl = gsap.timeline({ paused: true });
    tl.to(card, { y: -8, scale: 1.015, duration: 0.3, ease: 'power2.out' });
    if (icon) tl.to(icon, { y: -4, scale: 1.1, duration: 0.3, ease: 'power2.out' }, 0);

    card.addEventListener('mouseenter', () => {
      card.classList.add('shadow-card-hover');
      tl.play();
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('shadow-card-hover');
      tl.reverse();
    });
  });
}

/* ----------------------------------------------------------------------
 * LÍNEA DE TIEMPO DEL PROCESO — la línea conectora se "dibuja" a medida
 * que el usuario avanza por los cuatro pasos.
 * ------------------------------------------------------------------- */
function initProcessTimeline() {
  const wrap = document.querySelector<HTMLElement>('[data-process]');
  const line = document.querySelector<HTMLElement>('[data-process-line]');
  const steps = document.querySelectorAll<HTMLElement>('[data-process-step]');
  if (!wrap || !line) return;

  gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
  gsap.set(steps, { opacity: 0, y: 24 });

  ScrollTrigger.create({
    trigger: wrap,
    start: 'top 75%',
    end: 'bottom 60%',
    onEnter: () => {
      gsap.to(line, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' });
      gsap.to(steps, { opacity: 1, y: 0, duration: 0.6, stagger: 0.18, ease: 'power2.out' });
    },
    once: true,
  });
}

/* ----------------------------------------------------------------------
 * BOTONES — microinteracción de escala + brillo, con ripple opcional.
 * ------------------------------------------------------------------- */
function initButtonMicrointeractions() {
  const buttons = document.querySelectorAll<HTMLElement>('[data-btn]');

  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.04, duration: 0.25, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power2.out' });
    });
    btn.addEventListener('pointerdown', (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      ripple.style.width = '8px';
      ripple.style.height = '8px';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255,255,255,0.6)';
      ripple.style.transform = 'translate(-50%,-50%)';
      ripple.style.pointerEvents = 'none';
      btn.style.position = btn.style.position || 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      gsap.to(ripple, {
        width: 140,
        height: 140,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
      });
    });
  });
}

/* ----------------------------------------------------------------------
 * TESTIMONIOS — carrusel con cruce de opacidad controlado por GSAP.
 * ------------------------------------------------------------------- */
function initTestimonialCarousel() {
  const root = document.querySelector<HTMLElement>('[data-testimonials]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-testimonial-slide]'));
  const prevBtn = root.querySelector<HTMLElement>('[data-testimonial-prev]');
  const nextBtn = root.querySelector<HTMLElement>('[data-testimonial-next]');
  const dots = Array.from(root.querySelectorAll<HTMLElement>('[data-testimonial-dot]'));
  if (slides.length === 0) return;

  let index = 0;
  gsap.set(slides, { opacity: 0, position: 'absolute', inset: 0 });
  gsap.set(slides[0], { opacity: 1, position: 'relative' });
  dots[0]?.classList.add('opacity-100');

  const show = (next: number) => {
    const dir = next > index ? 20 : -20;
    const current = slides[index];
    const incoming = slides[(next + slides.length) % slides.length];
    index = (next + slides.length) % slides.length;

    dots.forEach((d, i) => d.classList.toggle('opacity-100', i === index));
    dots.forEach((d, i) => d.classList.toggle('opacity-30', i !== index));

    if (reduced()) {
      gsap.set(current, { opacity: 0, position: 'absolute' });
      gsap.set(incoming, { opacity: 1, position: 'relative', x: 0 });
      return;
    }

    const tl = gsap.timeline();
    console.log({dir, current: current.style.position, incoming: incoming.style.position});
    tl.fromTo(current, { opacity: 1, x: 0, position: 'absolute' } , { opacity: 0, x: -dir, duration: 0.4, ease: 'power2.in'}, 0)
    .fromTo(
      incoming,
      { opacity: 0, x: dir, position: 'absolute' },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
      0
    );
  };

  nextBtn?.addEventListener('click', () => show(index + 1));
  prevBtn?.addEventListener('click', () => show(index - 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));

  if (!reduced()) {
    let timer = setInterval(() => show(index + 1), 6000);
    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', () => {
      timer = setInterval(() => show(index + 1), 6000);
    });
  }
}

/* ----------------------------------------------------------------------
 * Punto de entrada único: inicializa todas las animaciones del sitio.
 * ------------------------------------------------------------------- */
export function initAll() {
  initHero();
  initNavbar();
  initMobileMenu();
  initScrollReveals();
  initCounters();
  initGauge();
  initCardHovers();
  initProcessTimeline();
  initButtonMicrointeractions();
  initTestimonialCarousel();

  // Las secciones recalculan su posición una vez cargan las imágenes.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
