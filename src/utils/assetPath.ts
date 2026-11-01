/**
 * Resolve a path inside `public/` against the deployment base.
 *
 * Why this exists
 * ---------------
 * Vite rewrites root-relative URLs it can see in `index.html` and in CSS, so
 * `/fonts/x.woff2` and `/assets/y.jpg` in those files are correctly prefixed
 * with `base`. It cannot rewrite string literals inside JS/TSX — those are
 * emitted verbatim, which makes a component that hardcodes `/assets/y.jpg`
 * request `https://<domain>/assets/y.jpg` and 404 when the site is deployed
 * under a sub-path (e.g. GitHub Pages at `/headlesscollective/`).
 *
 * Assets that only ever live in `public/` and are referenced from a component
 * must therefore go through this helper. Assets used only by components are
 * better off in `src/assets/` and imported as ES modules — Vite then resolves,
 * hashes and optimises them at build time and no helper is needed.
 *
 * Works unchanged for `base: '/'` (dev) and `base: '/headlesscollective/'`
 * (production), because `import.meta.env.BASE_URL` is inlined per build.
 */
const BASE_URL = import.meta.env.BASE_URL

/** True for `https://…`, `//cdn…`, `data:…`, `blob:…` — leave these alone. */
const ABSOLUTE_URL = /^([a-z][a-z0-9+.-]*:)?\/\//i
const INLINE_DATA = /^(data|blob):/i

export function getAssetUrl(path: string): string {
  if (!path) return path
  if (ABSOLUTE_URL.test(path) || INLINE_DATA.test(path) || path.startsWith('#')) {
    return path
  }

  // Normalise: strip the trailing slash off the base and the leading slashes
  // off the asset path, then join exactly once.
  const base = BASE_URL.replace(/\/+$/, '')
  const relative = path.replace(/^\/+/, '')

  if (!relative) return base || '/'
  return `${base}/${relative}`
}

export default getAssetUrl
