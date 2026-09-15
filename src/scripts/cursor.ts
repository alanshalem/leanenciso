/**
 * Cursor propio. Solo en punteros finos: en touch no existe hover
 * y un cursor falso solo estorba.
 */

let rafId = 0;
let teardown: (() => void) | null = null;

export function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (!document.documentElement.classList.contains('js-motion')) return;

  const dot = document.querySelector<HTMLElement>('[data-cursor]');
  if (!dot) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;
  let visible = false;

  const onMove = (event: PointerEvent) => {
    tx = event.clientX;
    ty = event.clientY;
    if (!visible) {
      visible = true;
      dot.dataset.on = '';
    }

    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor-label]');
    if (target) {
      dot.dataset.mode = 'label';
      dot.textContent = target.dataset.cursorLabel || 'VER';
    } else {
      delete dot.dataset.mode;
      dot.textContent = '';
    }
  };

  const onLeave = () => {
    visible = false;
    delete dot.dataset.on;
  };

  const loop = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    dot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(loop);
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  rafId = requestAnimationFrame(loop);

  teardown = () => {
    cancelAnimationFrame(rafId);
    rafId = 0;
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
  };
}

export function destroyCursor() {
  teardown?.();
  teardown = null;
}
