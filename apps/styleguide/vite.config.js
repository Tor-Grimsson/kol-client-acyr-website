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
    // Pin styleguide to 5174 so the live site reliably owns 5173 — keeps
    // the dev `Live site` link (Landing + sidebar) pointing somewhere real.
    port: 5174,
    strictPort: false,
    fs: {
      // Allow Vite to serve files from the sibling website app + workspace packages.
      allow: ['..', '../..'],
    },
  },
  resolve: {
    alias: {
      // JSX component extraction is deferred (decision Q2 in repo-restructure target-state).
      // Until those move into @ac/ds/components/jsx, the styleguide reaches into the
      // website's component kit via this temporary alias.
      '@components': resolve(__dirname, '../website/src/components'),
      // Pre-Sanity blog/collections + commerce shop data still referenced by Acyr.jsx.
      // Temporary; Phase 4 deletes the dead refs along with blog-data + collections-data.
      '@website-data': resolve(__dirname, '../website/src/data'),
    },
  },
  plugins: [
    react(),
    svgr(),
    tailwindcss(),
    photoIndexPlugin({ photosDir: 'public/brand' }),
  ],
})
