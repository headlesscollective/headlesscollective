import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Scratch dirs and build output are not part of the source graph.
      ignored: ['**/.tmp/**', '**/dist/**', '**/design-package/**'],
    },
  },
  build: {
    target: 'es2020',
    cssMinify: 'lightningcss',
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
        },
      },
    },
  },
})
