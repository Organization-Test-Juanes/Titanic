/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#14181C',      // graphite — texto y secciones oscuras
        steel: '#4A5568',    // gris acero — texto secundario, bordes
        mist: '#E4E7EB',     // gris claro — fondos alternos
        blue: {
          DEFAULT: '#1652A6',
          deep: '#0D3B7A',
        },
        yellow: {
          DEFAULT: '#FFC600', // amarillo de seguridad — acento y CTA
          deep: '#E0AC00',
        },
        offwhite: '#F7F8FA',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightish: '-0.01em',
        wideish: '0.08em',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,24,28,0.06), 0 8px 24px -8px rgba(20,24,28,0.12)',
        'card-hover': '0 4px 8px rgba(20,24,28,0.08), 0 20px 40px -12px rgba(22,82,166,0.25)',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
};
