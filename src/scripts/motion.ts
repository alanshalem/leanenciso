import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let rafId = 0;

export function prefersReduced(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getLenis(): Lenis | null {
  return lenis;
}

function startLenis() {
  lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });

  // ScrollTrigger tiene que leer la posicion que escribe Lenis, no la nativa.
  lenis.on('scroll', ScrollTrigger.update);

  const loop = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
}

/** Hijos directos de [data-reveal] entran escalonados. */
function buildReveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((group) => {
    const items = Array.from(group.children) as HTMLElement[];
    if (!items.length) return;
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: Number(group.dataset.stagger ?? 0.06),
      scrollTrigger: { trigger: group, start: 'top 88%', once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal-self]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

/** Revelado por clip-path: la imagen se "corta" hacia arriba. */
function buildMasks() {
  gsap.utils.toArray<HTMLElement>('[data-mask]').forEach((group) => {
    const items = Array.from(group.children) as HTMLElement[];
    if (!items.length) return;
    gsap.to(items, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    });
  });
}

function buildParallax() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax || 60);
    gsap.fromTo(
      el,
      { y: amount * 0.5 },
      {
        y: -amount * 0.5,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      },
    );
  });
}

function buildCounters() {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count || 0);
    const box = { v: 0 };
    // El markup ya trae el numero final. Se pone en cero recien cuando el
    // tween arranca: si el trigger nunca dispara, se ve el valor real y no un 0.
    gsap.to(box, {
      v: target,
      duration: 1.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onStart: () => {
        el.textContent = '0';
      },
      onUpdate: () => {
        el.textContent = Math.round(box.v).toString();
      },
    });
  });
}

export function initMotion() {
  // Sin la clase js-motion (reduced-motion o JS off) no hay estado oculto que animar.
  if (!document.documentElement.classList.contains('js-motion')) return;

  // Desarma la red de seguridad del layout: llegamos a tiempo.
  document.documentElement.dataset.motionReady = '1';

  startLenis();
  buildReveals();
  buildMasks();
  buildParallax();
  buildCounters();

  // Las fuentes cambian la altura del documento; recalcular cuando terminen.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export function destroyMotion() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.globalTimeline.clear();
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  lenis?.destroy();
  lenis = null;
}
