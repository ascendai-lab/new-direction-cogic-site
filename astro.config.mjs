// @ts-check
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import sanity from '@sanity/astro'
import react from '@astrojs/react'
import netlify from '@astrojs/netlify'

const env = loadEnv('', process.cwd(), '')

export default defineConfig({
  site: env.SITE_URL ?? 'http://localhost:4321',
  output: 'server',
  adapter: process.env.NETLIFY ? netlify() : undefined,

  integrations: [
    sanity({
      projectId: env.PUBLIC_SANITY_PROJECT_ID,
      dataset: env.PUBLIC_SANITY_DATASET ?? 'production',
      useCdn: false,  // always false — we need live data for SSR + visual editing
      studioBasePath: '/studio',
      stega: {
        // Points back to the client's hosted Sanity Studio
        studioUrl: env.SANITY_STUDIO_URL,
      },
    }),
    react(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
