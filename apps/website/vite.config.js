import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
// redeploy trigger 2026-05-18
export default defineConfig({
  // .env.local lives at repo root so Node scripts (sync-printful, migrate-sanity)
  // and Vite share the same secrets file.
  envDir: '../../',
  plugins: [react(), svgr(), tailwindcss()],
})
