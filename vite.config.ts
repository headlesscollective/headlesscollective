import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Deployment base path.
 *
 * GitHub Pages serves this project from
 *   https://headlesscollective.github.io/headlesscollective/
 * so the production build must use that base. `vite dev` runs in development
 * mode and stays at '/'.
 *
 * Override per build without editing this file:
 *   vite build --base=/some-other-path/
 */
const GITHUB_PAGES_BASE = '/headlesscollective/'

export default defineConfig(({ mode }) => ({
  /**
   * `base` alone is NOT enough: Vite rewrites root-relative URLs it finds in
   * index.html and in CSS, but string literals inside JS/TSX are emitted
   * verbatim. A component that hardcodes `/assets/y.jpg` would request
   * https://<domain>/assets/y.jpg and 404 under the Pages sub-path. Public
   * assets referenced from components therefore go through `getAssetUrl()` —
   * see src/utils/assetPath.ts. Component-only assets live in src/assets/
   * and are imported as ES modules so Vite resolves and hashes them.
   */
  base: mode === 'production' ? GITHUB_PAGES_BASE : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // A leading '/' resolves against the project root, so '@' -> <root>/src.
      '@': '/src',
    },
  },
  server: {
    watch: {
      // Scratch dirs and build output are not part of the source graph.
      // 'dist-*' also covers alternative outDirs such as dist-root.
      ignored: ['**/.tmp/**', '**/dist/**', '**/dist-*/**', '**/design-package/**'],
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
}))
