export type Herramienta = {
  /** Nombre de icono para astro-icon. `capcut` es local (src/icons/capcut.svg). */
  icon: string;
  name: string;
  kind: 'Edición' | 'Diseño' | 'IA';
  /** Para qué se usa. */
  what: string;
};

export const herramientas: Herramienta[] = [
  {
    icon: 'simple-icons:adobepremierepro',
    name: 'Premiere Pro',
    kind: 'Edición',
    what: 'Edición y montaje: corte, audio, color y exportación.',
  },
  {
    icon: 'capcut',
    name: 'CapCut',
    kind: 'Edición',
    what: 'Edición de verticales y subtítulos.',
  },
  {
    icon: 'simple-icons:adobephotoshop',
    name: 'Photoshop',
    kind: 'Diseño',
    what: 'Miniaturas, retoque y composición de imágenes.',
  },
  {
    icon: 'simple-icons:canva',
    name: 'Canva',
    kind: 'Diseño',
    what: 'Piezas gráficas para redes: placas y carruseles.',
  },
  {
    icon: 'simple-icons:claude',
    name: 'Claude',
    kind: 'IA',
    what: 'Apoyo para guiones, estructura e ideas.',
  },
  {
    icon: 'simple-icons:openai',
    name: 'ChatGPT',
    kind: 'IA',
    what: 'Apoyo para textos, títulos y variantes.',
  },
];
