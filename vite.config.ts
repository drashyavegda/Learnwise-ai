import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Optional local backend proxy (server/index.mjs) for a real LLM call.
// The app works fully without it — demo mode is the default.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // Preview hosts (e.g. *.e2b.app) are proxied; allow them so the sandbox
    // preview and any tunnel can load the app.
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.LEARNWISE_API ?? 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
  build: { outDir: 'dist', sourcemap: false },
})
