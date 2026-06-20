import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://montacargastitanic.netlify.app',
  integrations: [
    tailwind({
      // En estas versiones, applyBaseStyles es opcional
      applyBaseStyles: false,
    }),
    sitemap({
      // Configuración básica que funciona
      filter: (page) => {
        // Filtra páginas inválidas
        return page && page.length > 0;
      },
      serialize: (item) => {
        return {
          ...item,
          changefreq: 'weekly',
          priority: item.url === 'https://montacargastitanic.netlify.app/' ? 1.0 : 0.8,
          lastmod: new Date().toISOString().split('T')[0],
        };
      },
    }),
  ],
  compressHTML: true,
  output: 'static',
  // Configuración de rutas
  build: {
    format: 'directory',
  },
});