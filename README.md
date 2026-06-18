# TorqueLift — Landing page de montacargas (Astro + GSAP)

Landing page corporativa para una empresa de venta, alquiler y mantenimiento de
montacargas, construida con **Astro**, **TypeScript**, **Tailwind CSS** y
**GSAP** (con `ScrollTrigger`).

## Cómo correr el proyecto

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera el sitio estático en /dist
npm run preview  # sirve la build de producción localmente
```

## Dirección de diseño

El sistema visual está inspirado en señalética industrial real (franjas de
peligro, gris acero, amarillo de seguridad) en lugar de un look genérico de
landing SaaS:

- **Color**: `ink #14181C` (grafito), `steel #4A5568`, `mist #E4E7EB`,
  `blue #1652A6` (marca), `yellow #FFC600` (acento de seguridad/CTA), blanco.
- **Tipografía**: `Big Shoulders Display` para titulares (un tipo condensado
  inspirado en la rotulación de vigas de acero), `IBM Plex Sans` para cuerpo
  de texto, `IBM Plex Mono` para cifras y especificaciones técnicas.
- **Elemento de firma**: el "fork-divider" (dos barras que evocan las puntas
  de un montacargas) se usa como subrayado de títulos de sección, y el
  medidor de carga (`Stats.astro`) reutiliza la misma lógica de aguja que un
  indicador de capacidad real.

Todos los tokens de color y tipografía están centralizados en
`tailwind.config.mjs`.

## Estructura

```text
src/
├── components/      # Una sección por archivo .astro
├── layouts/Layout.astro   # <head>, SEO, JSON-LD, Navbar + Footer
├── pages/index.astro      # Ensambla las secciones
├── scripts/animations.ts  # TODA la lógica de GSAP, centralizada
└── styles/global.css      # Tailwind + tokens visuales + utilidades propias
```

## Animaciones

`src/scripts/animations.ts` es el único lugar donde se define lógica de
GSAP. Cada sección se comunica con ese archivo mediante atributos `data-*`
(p. ej. `data-animate="up"`, `data-counter="1200"`, `data-gauge="98"`), así
que agregar una sección nueva con animación de scroll no requiere tocar el
script: solo añadir el atributo correspondiente en el markup.

Se respeta `prefers-reduced-motion`: si el usuario lo tiene activado, los
elementos aparecen en su estado final sin animación.

## Antes de publicar

- Reemplaza la ilustración SVG del montacargas en `Hero.astro` y los iconos
  de `Products.astro` por fotografías reales de los equipos.
- Actualiza el número de WhatsApp (`Hero.astro`, `CTA.astro`), el correo y la
  dirección (`Footer.astro`, `Layout.astro` JSON-LD).
- Cambia el dominio de ejemplo en `astro.config.mjs` (`site`) y en
  `public/robots.txt` por el dominio real: es necesario para que el sitemap
  y las etiquetas OG/canónicas generen URLs correctas.
- Revisa los textos de servicios, catálogo y testimonios con contenido real
  del negocio.
