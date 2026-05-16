import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import { photoIndexPlugin } from './vite-plugins/photoIndexPlugin.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    fs: {
      // Allow imports from the parent repo's src/ (brand tokens + shared components)
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      // Cross-repo aliases — styleguide imports the site's brand layer + shared components
      // via these aliases instead of brittle relative paths. Single source of truth.
      '@brand':      resolve(__dirname, '../src/brand'),
      '@components': resolve(__dirname, '../src/components'),
    },
  },
  plugins: [
    react(),
    svgr(),
    tailwindcss(),
    photoIndexPlugin({ photosDir: 'public/brand' }),
  ],
})
