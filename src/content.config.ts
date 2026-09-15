import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Reels verticales. Un .md por pieza.
 * `npm run reel` recomprime el video, saca el poster y crea el .md (ver README).
 */
const reels = defineCollection({
  loader: glob({ base: './src/content/reels', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** Tipo de pieza: "Talking head", "Promo comercial"... */
    formato: z.string(),
    video: z.string(),
    poster: z.string(),
    /** m:ss */
    duration: z.string(),
    /** Aparece en la selección del home (hasta 3). */
    featured: z.boolean().default(false),
    order: z.number().int().default(99),
  }),
});

/**
 * Testimonios: sin registrar porque todavía no hay ninguno real.
 * Para activarlos: agregar `testimonios` a `collections`, cargar los .md en
 * src/content/testimonios/ (el cuerpo es la cita) y armar la página con
 * src/components/TestimonialCard.astro.
 */
export const testimonios = defineCollection({
  loader: glob({ base: './src/content/testimonios', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    handle: z.string(),
    role: z.string(),
    video: z.string(),
    poster: z.string(),
    featured: z.boolean().default(false),
    order: z.number().int().default(99),
  }),
});

export const collections = { reels };
