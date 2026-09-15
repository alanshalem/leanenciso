# Portfolio — Leandro Enciso

Portfolio de 3 páginas para un editor de video: **Portfolio**, **Quién soy** y
**Ejemplos**. Astro 7 estático, sin backend.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # sale a dist/
npm run preview   # sirve dist/ localmente
```

---

## Antes de publicar

**Faltan los datos de contacto.** Están vacíos en `src/data/site.ts` →
`contacto`. Mientras estén vacíos, el sitio no muestra botones de contacto, ni
el bloque "Trabajemos", ni el enlace de la nav: nada inventado queda a la vista.
Alcanza con completar uno (email, WhatsApp, Instagram, TikTok o YouTube) para
que aparezcan.

También:

- `site` en `astro.config.mjs`, `url` en `src/data/site.ts` y la línea
  `Sitemap:` de `public/robots.txt` → el dominio real.

---

## Cómo agregar un reel

```bash
npm run reel -- "C:/ruta/al/video.mp4" mi-reel "Título del reel" "Talking head"
```

El script:

1. recomprime el video a 720×1280 (un original de 30–60 MB queda en ~10 MB),
2. saca el poster,
3. crea `src/content/reels/mi-reel.md` con la duración real.

No pisa nada: si el slug ya existe, corta. Necesita `ffmpeg` y `ffprobe`
instalados.

Después, en el `.md`:

```yaml
---
title: "Título del reel"
formato: "Talking head"
video: /videos/reels/mi-reel.mp4
poster: /posters/reels/mi-reel.jpg
duration: "1:09"
hero: false       # true = va en el celular del hero (uno solo)
featured: false   # true = aparece en la selección del home (hasta 3)
order: 7          # orden en Ejemplos
---
```

Los schemas están en `src/content.config.ts` y se validan con Zod: si falta un
campo, **el build falla antes de publicar**.

---

## Los reels dentro del celular

`src/components/IphoneFrame.astro` + `src/scripts/video.ts`.

- El reel se ve **entero, sin recortar**: un video 9:16 dentro de una pantalla
  9:19.5 deja franjas negras arriba y abajo, como en un celular real. Arriba va
  la barra de estado y la Dynamic Island; abajo, la barra de progreso, el botón
  de sonido y el indicador de inicio.
- Arranca solo, en mudo, cuando entra en pantalla, y se pausa al salir. Los
  navegadores no dejan reproducir con sonido sin que la persona toque algo.
- **Tocar la pantalla activa el sonido** y reinicia el reel desde el principio.
  Tocar de nuevo silencia.
- Un solo reel suena a la vez: activar uno silencia el anterior.
- Con `prefers-reduced-motion` no hay autoplay: el reel arranca al tocarlo.

---

## Material original

Los videos que llegaron en el zip están en `_originales/` (fuera de `public/`,
así no se publican, e ignorado por git). Uno venía duplicado con dos nombres;
se usó una sola copia.

---

## Qué más se edita sin tocar componentes

| Archivo | Qué controla |
|---|---|
| `src/data/site.ts` | Contacto, edad, tagline, pasos del proceso |
| `src/data/herramientas.ts` | Las 6 herramientas |
| `src/content/reels/*.md` | Los reels |

### Testimonios

La página se quitó porque no hay testimonios reales. El componente
(`src/components/TestimonialCard.astro`) y el schema (`testimonios` en
`src/content.config.ts`) quedan listos: para activarla hay que registrar la
colección, cargar los `.md` y volver a crear `src/pages/testimonios.astro`
(y sumarla a `nav` en `src/data/site.ts`).

---

## Cómo está hecho

- **Astro 7** estático. Cero JavaScript de framework: todo el presupuesto de JS
  va a la animación y los reels.
- **Tailwind v4** con `@theme` en `src/styles/global.css`.
- **GSAP + ScrollTrigger + Lenis** para los reveals y el scroll suave.
- **Fuentes self-hosted** en `public/fonts/`: Clash Display y Satoshi
  (Fontshare, licencia ITF-FFL), JetBrains Mono vía Fontsource. `npm run fonts`
  las vuelve a bajar si faltan.
- **Iconos** con astro-icon: `simple-icons` y `lucide`, más
  `src/icons/capcut.svg` propio. Sin emojis.

### El concepto

El sitio se comporta como una línea de tiempo de edición: la barra fija de
abajo es el playhead, el timecode es `HH:MM:SS:FF` a 24 fps, los rombos son
marcadores de sección y la transición entre páginas es un corte seco. El nombre
del hero usa el eje variable de Clash Display: cuanto más rápido scrolleás, más
finas se ponen las letras (`src/scripts/scrubber.ts`).

---

## Deploy

Salida estática en `dist/`. Vercel, Netlify o Cloudflare Pages: build
`npm run build`, output `dist`.

---

## Documentos

- `docs/superpowers/specs/2026-08-29-portfolio-leandro-enciso-design.md`
- `docs/superpowers/plans/2026-08-29-portfolio-leandro-enciso-plan.md`
