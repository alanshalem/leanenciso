# Plan de implementación — Portfolio Leandro Enciso

Spec: `docs/superpowers/specs/2026-08-29-portfolio-leandro-enciso-design.md`

## Fase 1 — Cimientos

1. `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `README.md`.
2. `npm install`.
3. Descargar `.woff2` variables de Clash Display y Satoshi desde el CDN de
   Fontshare a `public/fonts/`. JetBrains Mono vía `@fontsource-variable`.
4. `src/styles/global.css`: `@font-face`, `@theme` con los tokens, reset,
   estilos base, utilidades de grilla, keyframes de view-transition.

Verificación: `npm run build` pasa con una página vacía.

## Fase 2 — Datos y contenido

5. `src/content.config.ts` — colecciones `reels`, `proyectos`, `testimonios`
   con schemas Zod.
6. `src/data/site.ts`, `herramientas.ts`, `clientes.ts`.
7. Archivos `.md` placeholder: 10 reels, 6 proyectos, 7 testimonios.
8. `scripts/gen-placeholders.mjs` — genera con ffmpeg los `.mp4` 9:16 y los
   posters `.jpg`; genera avatares SVG de clientes. Marcados como placeholder.

Verificación: el build falla si un `.md` viola el schema; los `.mp4` existen y
reproducen.

## Fase 3 — Chasis

9. `src/scripts/motion.ts` — Lenis + GSAP, gate de `prefers-reduced-motion`,
   ciclo de vida en `astro:page-load` / `astro:before-swap`.
10. `src/scripts/scrubber.ts` — progreso, timecode `HH:MM:SS:FF`, marcadores,
    eje de peso variable según velocidad de scroll.
11. `src/scripts/video.ts` — IntersectionObserver play/pause, gestor de audio
    exclusivo.
12. `src/scripts/cursor.ts`, `src/scripts/nav.ts`.
13. `Base.astro`, `Nav.astro`, `Footer.astro`, `Grain.astro`, `Cursor.astro`,
    `Scrubber.astro`, `LocalTime.astro`.

Verificación: navegar entre 4 rutas vacías con corte seco; scrubber avanza.

## Fase 4 — Componentes

14. `IphoneFrame.astro` (incluye estado `SIN CLIP`).
15. `SectionHeader.astro`, `Reveal.astro`, `Marquee.astro`, `Counter.astro`.
16. `ReelCard.astro`, `ProjectCard.astro` (facade YouTube), `TestimonialCard.astro`,
    `ClientWall.astro`, `ToolGrid.astro`, `Lightbox.astro`.
17. `src/icons/capcut.svg` dibujado a mano.

Verificación: cada componente renderiza aislado sin errores de consola.

## Fase 5 — Páginas

18. `/` — hero con nombre partido en spans, intro, herramientas, reels
    destacados, números, testimonio, CTA.
19. `/quien-soy`.
20. `/testimonios`.
21. `/ejemplos` con filtro por categoría y lightbox.

## Fase 6 — Cierre

22. Meta OG, sitemap, favicon, `robots.txt`.
23. `npm run build` limpio; revisar consola en dev.
24. Revisión visual en las 4 páginas, desktop y mobile.
25. README con: cómo agregar un reel, cómo reemplazar los placeholders,
    cómo deployar.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| GSAP/Lenis duplicados tras View Transition | Cleanup explícito en `astro:before-swap`; `ScrollTrigger.killAll()`. |
| Autoplay bloqueado en iOS | `muted` + `playsinline` obligatorios; `.play()` con `.catch()` silencioso. |
| Grano fijo con blend cuesta paint | Opacidad baja, animación por pasos, apagado en reduced-motion. |
| CapCut sin icono | SVG local propio. |
| El cliente reemplaza videos y rompe rutas | Los `.md` referencian rutas; el schema exige que existan campos, y el README fija la convención de nombres. |
