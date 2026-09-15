export const site = {
  name: 'Leandro Enciso',
  role: 'Editor de video',
  age: 26,
  country: 'Argentina',
  /** Argentina usa una sola zona horaria; esta es la canónica de IANA. */
  timezone: 'America/Argentina/Buenos_Aires',
  /** Dominio a confirmar: sale en el canonical, el sitemap y Open Graph. */
  url: 'https://leandroenciso.com',

  tagline: 'Convierto material crudo en algo que nadie saltea.',
  description: 'Leandro Enciso, editor de video argentino. Reels y contenido vertical para redes.',
};

/**
 * Contacto. Un campo vacío no se muestra en ningún lado.
 * Completar antes de publicar: sin al menos un canal, el sitio no tiene cómo
 * recibir clientes y los bloques de contacto quedan ocultos.
 */
export const contacto = {
  email: '',
  /** Formato internacional sin "+" ni espacios, ej: 5491112345678 */
  whatsapp: '',
  /** Usuario sin "@" */
  instagram: '',
  /** Usuario sin "@" */
  tiktok: '',
  /** Handle con "@", ej: @leandroenciso */
  youtube: '',
};

export type Canal = {
  key: 'email' | 'whatsapp' | 'instagram' | 'tiktok' | 'youtube';
  label: string;
  display: string;
  href: string;
  external: boolean;
};

/** Canales cargados, en orden de preferencia. El primero es el principal. */
export const canales: Canal[] = [
  contacto.email && {
    key: 'email' as const,
    label: 'Email',
    display: contacto.email,
    href: `mailto:${contacto.email}`,
    external: false,
  },
  contacto.whatsapp && {
    key: 'whatsapp' as const,
    label: 'WhatsApp',
    display: `+${contacto.whatsapp}`,
    href: `https://wa.me/${contacto.whatsapp}`,
    external: true,
  },
  contacto.instagram && {
    key: 'instagram' as const,
    label: 'Instagram',
    display: `@${contacto.instagram}`,
    href: `https://instagram.com/${contacto.instagram}`,
    external: true,
  },
  contacto.tiktok && {
    key: 'tiktok' as const,
    label: 'TikTok',
    display: `@${contacto.tiktok}`,
    href: `https://tiktok.com/@${contacto.tiktok}`,
    external: true,
  },
  contacto.youtube && {
    key: 'youtube' as const,
    label: 'YouTube',
    display: contacto.youtube,
    href: `https://youtube.com/${contacto.youtube}`,
    external: true,
  },
].filter((canal): canal is Canal => Boolean(canal));

export const nav = [
  { href: '/', label: 'Portfolio', sec: '01' },
  { href: '/quien-soy', label: 'Quién soy', sec: '02' },
  { href: '/ejemplos', label: 'Ejemplos', sec: '03' },
] as const;

/** Cómo es un trabajo, sin plazos ni cantidades comprometidas. */
export const proceso = [
  {
    n: '01',
    title: 'Brief',
    body: 'Qué querés lograr, para quién y con qué material contás.',
  },
  {
    n: '02',
    title: 'Estructura',
    body: 'Antes de tocar la timeline: el gancho, el desarrollo y el cierre.',
  },
  {
    n: '03',
    title: 'Edición',
    body: 'Corte, ritmo, subtítulos, sonido y color.',
  },
  {
    n: '04',
    title: 'Revisión',
    body: 'Ajustes sobre una primera versión completa.',
  },
  {
    n: '05',
    title: 'Entrega',
    body: 'El archivo final en el formato de cada red.',
  },
] as const;
