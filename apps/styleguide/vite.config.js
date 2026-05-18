import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import { photoIndexPlugin } from './vite-plugins/photoIndexPlugin.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// redeploy trigger 2026-05-18
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
      // Acyr.jsx uses the website's shop-data for live product counts. Cross-app data
      // import; will go away when shop-data is either moved into brand-data OR the
      // styleguide acquires its own Sanity-backed data fetcher.
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
