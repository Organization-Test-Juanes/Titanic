import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Reemplaza "site" por el dominio real antes de desplegar:
// es obligatorio para que el sitemap y las etiquetas canónicas/OG funcionen.
export default defineConfig({
  site: 'https://www.tuempresa-montacargas.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  compressHTML: true,
});
