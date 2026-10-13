// ============================================================
// Ethaqa Publishing — Astro Configuration
// Document ID: ETH-PUB-001
// Version: 1.0.0
// ============================================================

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Canonical origin — used by Astro.site for absolute URLs
  site: 'https://www.ethaqa.com',

  // Base path — every route and asset respects this
  base: '/publishing',

  // Consistent URLs — avoids duplicate content
  trailingSlash: 'always',

  // Pure static output — no server runtime
  output: 'static',

  // Sitemap generation
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  // Image optimisation
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  // Build configuration
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },

  // Vite — aliases for shared design system and internal structure
  vite: {
    resolve: {
      alias: {
        // Shared design system — the single master tokens.css
        '@design-system': new URL('../assets/css', import.meta.url).pathname,
        // Internal aliases
        '@components': new URL('./src/components', import.meta.url).pathname,
        '@layouts': new URL('./src/layouts', import.meta.url).pathname,
        '@content': new URL('./src/content', import.meta.url).pathname,
        '@utils': new URL('./src/utils', import.meta.url).pathname,
        '@assets': new URL('./src/assets', import.meta.url).pathname,
      },
    },
  },

  // Development server
  server: {
    port: 4321,
    host: true,
  },
});