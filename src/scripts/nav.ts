let teardown: (() => void) | null = null;

export function initNav() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-nav-panel]');
  if (!toggle || !panel) return;

  const close = () => {
    panel.dataset.open = 'false';
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.removeProperty('overflow');
  };

  const open = () => {
    panel.dataset.open = 'true';
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const onToggle = () => (panel.dataset.open === 'true' ? close() : open());
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };

  toggle.addEventListener('click', onToggle);
  document.addEventListener('keydown', onKey);
  panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));

  teardown = () => {
    toggle.removeEventListener('click', onToggle);
    document.removeEventListener('keydown', onKey);
    document.body.style.removeProperty('overflow');
  };
}

export function destroyNav() {
  teardown?.();
  teardown = null;
}
