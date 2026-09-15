/**
 * Scrub bar de la timeline.
 *
 * El scroll es el playhead. Deriva tres cosas del progreso:
 *   1. el ancho de la barra
 *   2. el timecode HH:MM:SS:FF a 24 fps
 *   3. --w-name, el eje de peso variable del nombre: mientras mas rapido
 *      scrolleas, mas finas se ponen las letras (motion blur tipografico)
 *
 * No depende de Lenis: escucha el scroll nativo, que Lenis tambien dispara.
 */

const FPS = 24;
/** Cuantos pixeles de scroll equivalen a un segundo de "clip". */
const PX_PER_SECOND = 180;

const WEIGHT_REST = 700;
const WEIGHT_MIN = 260;
/** Velocidad (px/frame) a la que el nombre llega a su peso mas fino. */
const WEIGHT_MAX_VELOCITY = 55;

let rafId = 0;
let teardown: (() => void) | null = null;

function pad(n: number, size = 2): string {
  return Math.floor(n).toString().padStart(size, '0');
}

function timecode(seconds: number): string {
  const total = Math.max(0, seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const f = Math.floor((total % 1) * FPS);
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

export function initScrubber() {
  const bar = document.querySelector<HTMLElement>('[data-scrub-fill]');
  const readout = document.querySelector<HTMLElement>('[data-scrub-time]');
  const total = document.querySelector<HTMLElement>('[data-scrub-total]');
  const track = document.querySelector<HTMLElement>('[data-scrub-track]');
  const markerHost = document.querySelector<HTMLElement>('[data-scrub-markers]');

  const root = document.documentElement;
  const animateWeight = root.classList.contains('js-motion');

  let lastY = window.scrollY;
  let velocity = 0;
  let weight = WEIGHT_REST;

  const maxScroll = () => Math.max(1, document.body.scrollHeight - window.innerHeight);
  const duration = () => maxScroll() / PX_PER_SECOND;

  // Marcadores de seccion: un rombo de keyframe por cada [data-sec].
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-sec]'));

  function placeMarkers() {
    if (!markerHost) return;
    const limit = maxScroll();
    markerHost.textContent = '';
    for (const section of sections) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const pct = Math.min(100, Math.max(0, (top / limit) * 100));
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'scrub-marker';
      dot.style.left = `${pct}%`;
      dot.setAttribute('aria-label', `Ir a ${section.dataset.sec}`);
      dot.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      markerHost.appendChild(dot);
    }
  }

  function onTrackClick(event: MouseEvent) {
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    window.scrollTo({ top: ratio * maxScroll(), behavior: 'smooth' });
  }

  function frame() {
    const y = window.scrollY;
    const raw = y - lastY;
    lastY = y;

    // Suavizado de velocidad, si no el peso tiembla.
    velocity += (Math.abs(raw) - velocity) * 0.18;

    const progress = Math.min(1, Math.max(0, y / maxScroll()));

    if (bar) bar.style.transform = `scaleX(${progress})`;
    if (readout) readout.textContent = timecode(progress * duration());

    if (animateWeight) {
      const drop = Math.min(1, velocity / WEIGHT_MAX_VELOCITY);
      const targetWeight = WEIGHT_REST - drop * (WEIGHT_REST - WEIGHT_MIN);
      weight += (targetWeight - weight) * 0.14;
      root.style.setProperty('--w-name', weight.toFixed(0));
    }

    rafId = requestAnimationFrame(frame);
  }

  if (total) total.textContent = timecode(duration());
  placeMarkers();
  track?.addEventListener('click', onTrackClick);

  const onResize = () => {
    placeMarkers();
    if (total) total.textContent = timecode(duration());
  };
  window.addEventListener('resize', onResize, { passive: true });

  rafId = requestAnimationFrame(frame);

  teardown = () => {
    cancelAnimationFrame(rafId);
    rafId = 0;
    track?.removeEventListener('click', onTrackClick);
    window.removeEventListener('resize', onResize);
    root.style.removeProperty('--w-name');
  };
}

export function destroyScrubber() {
  teardown?.();
  teardown = null;
}
