import { initMotion, destroyMotion } from './motion';
import { initScrubber, destroyScrubber } from './scrubber';
import { initVideo, destroyVideo } from './video';
import { initCursor, destroyCursor } from './cursor';
import { initNav, destroyNav } from './nav';

function boot() {
  initMotion();
  initScrubber();
  initVideo();
  initCursor();
  initNav();
}

function teardown() {
  destroyNav();
  destroyCursor();
  destroyVideo();
  destroyScrubber();
  destroyMotion();
}

// View Transitions reemplaza el <body> sin recargar: hay que desmontar antes
// del swap y volver a montar despues, o quedan listeners y ScrollTriggers vivos.
document.addEventListener('astro:page-load', boot);
document.addEventListener('astro:before-swap', teardown);
