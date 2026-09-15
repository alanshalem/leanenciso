/**
 * Reels dentro del celular.
 *
 * - Autoplay en mudo al entrar al viewport y pausa al salir. Con
 *   prefers-reduced-motion no hay autoplay: el reel arranca al tocarlo.
 * - Tocar la pantalla activa el sonido y reinicia el reel: el gancho está en
 *   los primeros segundos. Tocar de nuevo silencia.
 * - Un solo reel con sonido a la vez.
 * - La barra de progreso se mueve por rAF, solo mientras hay reels sonando.
 */

let observer: IntersectionObserver | null = null;
let controller: AbortController | null = null;
let audioOwner: HTMLVideoElement | null = null;
let rafId = 0;

const playing = new Set<HTMLVideoElement>();
const fills = new WeakMap<HTMLVideoElement, HTMLElement>();

function autoplayAllowed(): boolean {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function frameOf(video: HTMLVideoElement): HTMLElement | null {
  return video.closest<HTMLElement>('[data-clip]');
}

function setAudioState(video: HTMLVideoElement, on: boolean) {
  video.muted = !on;
  const frame = frameOf(video);
  frame?.toggleAttribute('data-audio', on);
  frame?.querySelector('[data-audio-toggle]')?.setAttribute('aria-pressed', String(on));
}

export function muteAll() {
  if (!audioOwner) return;
  const video = audioOwner;
  audioOwner = null;
  setAudioState(video, false);
  if (!autoplayAllowed()) video.pause();
}

function toggleAudio(video: HTMLVideoElement) {
  if (audioOwner === video) {
    muteAll();
    return;
  }

  muteAll();
  setAudioState(video, true);
  audioOwner = video;
  video.currentTime = 0;

  video.play().catch(() => {
    // Si el navegador igual lo bloquea, volver a un estado coherente.
    if (audioOwner === video) audioOwner = null;
    setAudioState(video, false);
  });
}

function tick() {
  for (const video of playing) {
    const fill = fills.get(video);
    if (fill && video.duration) {
      fill.style.transform = `scaleX(${video.currentTime / video.duration})`;
    }
  }
  rafId = playing.size ? requestAnimationFrame(tick) : 0;
}

function track(video: HTMLVideoElement, isPlaying: boolean) {
  if (isPlaying) playing.add(video);
  else playing.delete(video);
  if (playing.size && !rafId) rafId = requestAnimationFrame(tick);
}

export function initVideo() {
  controller = new AbortController();
  const { signal } = controller;
  const autoplay = autoplayAllowed();

  // Umbral bajo a propósito: un celular 9:19.5 puede medir más que el
  // viewport de una notebook, y exigir la mitad del área lo dejaría quieto.
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        if (visible) {
          // Puede rechazarse por política de autoplay; no es un error que importe.
          if (autoplay) video.play().catch(() => {});
        } else {
          video.pause();
          if (audioOwner === video) muteAll();
        }
      }
    },
    { threshold: [0, 0.25, 0.6], rootMargin: '10% 0px' },
  );

  document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]').forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    observer?.observe(video);

    const frame = frameOf(video);
    const fill = frame?.querySelector<HTMLElement>('[data-progress]');
    if (fill) fills.set(video, fill);

    video.addEventListener('play', () => track(video, true), { signal });
    video.addEventListener('pause', () => track(video, false), { signal });

    frame?.querySelector('[data-audio-toggle]')?.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        toggleAudio(video);
      },
      { signal },
    );
  });
}

export function destroyVideo() {
  controller?.abort();
  controller = null;
  observer?.disconnect();
  observer = null;
  cancelAnimationFrame(rafId);
  rafId = 0;
  playing.clear();
  audioOwner = null;
}
