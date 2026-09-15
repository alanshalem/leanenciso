# Portfolio Leandro Enciso — Diseño

Fecha: 2026-08-29
Estado: aprobado

> **Revisión 2026-09-15.** Llegó el material real: 6 reels verticales con audio.
> Se quitó todo el contenido inventado (testimonios, clientes, números, recorrido,
> videos largos, retrato). El sitio pasa a 3 páginas: Portfolio, Quién soy,
> Ejemplos. El celular muestra el reel sin recortar, con barra de estado,
> progreso y un botón de sonido; tocar la pantalla activa el audio.
> El contacto se muestra solo cuando hay datos reales en `src/data/site.ts`.

## 1. Qué es

Portfolio web de 4 páginas para Leandro Enciso, editor de video argentino de 26
años. Objetivo comercial: convertir visitantes en clientes. El sitio tiene que
verse mejor que el trabajo promedio del rubro, cargar rápido y dejar que Leandro
agregue trabajos sin tocar código.

Referencia de contenido: `sanjiaoana.my.canva.site/portafolio` — reels verticales
en marcos de iPhone, muro de clientes, testimonios en video, grilla de videos
largos. Se toma la estructura de contenido; se descarta la estética Canva.

## 2. Stack

| Pieza | Elección | Motivo |
|---|---|---|
| Framework | Astro 5 (static) | 0 JS por defecto; el presupuesto de JS va a animación. SEO nativo. View Transitions integradas. |
| Estilos | Tailwind v4 vía `@tailwindcss/vite` + `@theme` | Los tokens de `@theme` se emiten como CSS vars, así que utilidades y `<style>` de Astro comparten fuente de verdad. |
| Contenido | Content Collections + Zod | Agregar un reel = un `.md`. Schema inválido rompe el build antes de publicar. |
| Motion | GSAP + ScrollTrigger + Lenis | Reveals scroll-driven y scroll suave. |
| Iconos | astro-icon + `@iconify-json/simple-icons` + `@iconify-json/lucide` | SVG inline, sin emojis. CapCut no existe en simple-icons → SVG local en `src/icons/capcut.svg`. |
| Deploy | Vercel / Netlify / Cloudflare Pages | Salida estática, gratis. |

Descartados: Next.js (no hay backend, auth ni CMS — se paga peso por nada);
Vite+React SPA (sin SSG, mal SEO y primer paint lento).

## 3. Concepto rector: el sitio es una timeline

El sitio se comporta como una línea de tiempo de edición.

- **Scrub bar** fija abajo, 2px. El scroll es el playhead.
- **Timecode en vivo** mono a la derecha, formato `HH:MM:SS:FF` a 24 fps,
  derivado del progreso de scroll.
- **Marcadores de sección** como rombos de keyframe sobre la barra. Click = salto.
- **Transición entre páginas = corte seco.** Sin fade. `steps()` en las
  keyframes de view-transition para dar sensación de frames, no de disolvencia.
- **Títulos de sección** con etiqueta mono: `SEC 02 — 00:00:41:08`.

Es ambiente, no disfraz. La barra es finita y gris, el timecode es chico.

### Firma tipográfica

`LEANDRO ENCISO` en Clash Display **variable**, y el eje de peso responde a la
velocidad de scroll: scroll rápido adelgaza hacia 200 (motion blur tipográfico),
en reposo vuelve a 700. Una CSS var alimentada por la velocidad de Lenis.
Identificable, y significa algo: movimiento.

Descartado: estética "render / export progress". Cliché.

## 4. Sistema visual

### Color

```
--ink      #0A0A0B   fondo
--surface  #131316   superficie elevada
--paper    #F2F0EB   texto (blanco cálido; el blanco puro vibra sobre negro)
--muted    rgb(242 240 235 / .55)
--line     rgb(242 240 235 / .12)
--acid     #D9FF3D   acento único
--rec      #FF3B30   SOLO punto REC / indicadores en vivo
```

Un acento. Contraste `paper`/`ink` ≈ 17:1, `acid`/`ink` ≈ 15:1.
**Regla dura: `--acid` nunca como texto sobre fondo claro** (daría ≈1.1:1).

### Tipografía

Self-hosted `.woff2` en `public/fonts/`. Sin CDN de terceros: menos handshakes,
sin dependencia externa en runtime.

| Rol | Familia | Pesos |
|---|---|---|
| Display | Clash Display Variable (Fontshare) | 200–700, eje animable |
| Texto | Satoshi Variable (Fontshare) | 300–900 |
| Técnica | JetBrains Mono Variable (Fontsource) | 400–700 |

Licencia Fontshare ITF-FFL: libre para uso personal y comercial.

Escala fluida:

| Rol | Tamaño |
|---|---|
| Nombre hero | `clamp(3.5rem, 17vw, 17rem)` / lh .82 / ls -.045em |
| Título sección | `clamp(2.5rem, 7vw, 7rem)` / lh .9 / ls -.03em |
| Lead | `clamp(1.25rem, 2.2vw, 2rem)` |
| Cuerpo | `1.0625rem` / lh 1.65 |
| Mono label | `.6875rem` / ls .16em / uppercase |

### Grilla

12 columnas, gutter 24px, ancho máximo 1440px, margen lateral fluido
`clamp(1.25rem, 4vw, 4rem)`. Guías de columna visibles al 4% en secciones
seleccionadas.

## 5. Páginas

| Ruta | Nombre | Secciones |
|---|---|---|
| `/` | Portfolio | Hero · Intro · Herramientas · Reels destacados · Números · Testimonio · CTA |
| `/quien-soy` | Quién Soy | Statement · Bio 2 col · Retrato · Recorrido · Herramientas en detalle · Cómo trabajo |
| `/testimonios` | Testimonios | Video-testimonios en iPhones · Citas · Muro de clientes · CTA |
| `/ejemplos` | Ejemplos | Filtro por categoría · Reels · Videos largos 16:9 · Motion graphics · Lightbox |

`Portfolio` es el home. `Ejemplos` es el archivo completo. Se separan así porque
sus nombres se pisan semánticamente.

Nav fija: monograma `[LE]`, 4 links, timecode. Mobile: overlay full-screen.
Footer: nombre gigante, contacto, hora local de Buenos Aires en vivo.

## 6. Componentes

### `IphoneFrame.astro`

Sin imágenes de bisel. CSS/SVG puro.

- Bisel `#1C1C1E` con highlight de borde en gradiente; radio 11.5% del ancho.
- Pantalla 9:19.5, Dynamic Island, botones laterales como divs absolutos.
- Con `video`: `<video muted loop playsinline preload="metadata" poster>`.
  Sin `video`: placeholder con etiqueta mono `SIN CLIP`. Nunca se ve roto.
- IntersectionObserver: play al 50% visible, pause al salir.
- Muted por defecto (requisito de autoplay de los navegadores). Click activa
  audio y muestra `AUDIO ON`. **Solo un clip con audio a la vez**: activar uno
  mutea el resto.
- Bloom `--acid` difuso detrás.

Props: `src?`, `poster`, `title`, `client`, `duration`, `category`, `href?`, `eager?`.

### Otros

`Nav` · `Footer` · `Scrubber` (barra + timecode + marcadores) · `Grain` ·
`Cursor` · `Reveal` (wrapper de scroll reveal) · `SectionHeader` · `Marquee` ·
`ToolGrid` · `TestimonialCard` · `ClientWall` · `ProjectCard` (facade de
YouTube, sin iframe hasta el click) · `Lightbox` · `Counter` · `LocalTime`.

## 7. Contenido

```
src/content/reels/*.md        title, client, category, video?, poster,
                              duration, year, featured, order, link?
src/content/proyectos/*.md    title, client, thumb, youtubeId?, views?, year, tags[]
src/content/testimonios/*.md  name, handle, role, avatar?, video?, poster?,
                              featured, order   (body = la cita)
src/data/clientes.ts          name, avatar, url
src/data/herramientas.ts      6 items: icono + para qué la usa
src/data/site.ts              contacto, redes, stats
```

Categorías de reel: `marca` · `show` · `publicidad` · `ugc` · `motion`.

Herramientas (fijas, pedido del cliente): Adobe Premiere Pro, CapCut,
Adobe Photoshop, Canva, Claude, ChatGPT.

Todo el contenido inicial es **placeholder marcado**. Los clips `.mp4` se
generan con ffmpeg para que el comportamiento de autoplay sea demostrable, y se
reemplazan dejando el mismo nombre de archivo.

## 8. Motion

- Lenis, lerp .09. GSAP ScrollTrigger para reveals: máscara + translate Y,
  stagger .06. Parallax en el track de iPhones. Clip-path en videos.
- Grano: SVG `feTurbulence` grayscale, `opacity .035`, `mix-blend-mode overlay`,
  fijo, `pointer-events:none`, animado por pasos a ~8fps.
- Cursor custom que se vuelve píldora `PLAY` sobre reels. Solo `pointer: fine`.
- View Transitions con `steps()` = corte seco de ~120ms.
- GSAP/Lenis se reinicializan en `astro:page-load` y se limpian en
  `astro:before-swap`.

## 9. Accesibilidad y performance

- `prefers-reduced-motion`: mata Lenis, mata los ScrollTrigger animados,
  congela el grano, muestra el estado final. No es opcional.
- El nombre partido en `<span>` por letra lleva `aria-label` en el contenedor y
  `aria-hidden` en los spans.
- Foco visible: outline `--acid` 2px, offset 3px, en todo elemento interactivo.
- Videos: `preload="metadata"`, poster obligatorio, lazy fuera del viewport.
- Solo se precarga la variable de Clash Display.
- Objetivo Lighthouse ≥95 en las cuatro métricas.
- `lang="es-AR"`, meta OG y sitemap.

## 10. Fuera de alcance

Blog, CMS, formulario de contacto con backend, i18n, analytics, modo claro.
El contacto es `mailto:` + WhatsApp + Instagram.
