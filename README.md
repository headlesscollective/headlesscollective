# Headless Collective

An independent, decentralized technology community — built from the supplied Sketch/Stitch
design package in `design-package/`.

The site is a single-page, bilingual (English / Arabic RTL) experience with seven content
sections, an interactive domain inspector, an operational-perspective switcher, and a live
scroll-progress meter.

---

## Quick start

```bash
npm install
npm run dev        # http://127.0.0.1:5173            (base: /)
npm run build      # type-check + production bundle into dist/  (base: /headlesscollective/)
npm run preview    # serve the built output at http://localhost:4173/headlesscollective/
npm run typecheck  # tsc only
npm run deploy     # build + publish dist/ to the gh-pages branch
```

---

## Deployment (GitHub Pages)

The site is served from a repository sub-path:

```
https://headlesscollective.github.io/headlesscollective/
```

`vite.config.ts` sets `base` from the build mode:

```ts
const GITHUB_PAGES_BASE = '/headlesscollective/'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? GITHUB_PAGES_BASE : '/',
  ...
}))
```

`npm run dev` runs in development mode and stays at `/`, so local development is
unaffected. `npm run build` and `npm run preview` run in production mode and use the
Pages sub-path — `npm run preview` therefore serves the built site at
`http://localhost:4173/headlesscollective/`, a faithful simulation of production.

| Script | Base | URL |
| --- | --- | --- |
| `npm run dev` | `/` | `http://127.0.0.1:5173/` |
| `npm run build` | `/headlesscollective/` | — |
| `npm run preview` | `/headlesscollective/` | `http://localhost:4173/headlesscollective/` |
| `npm run build:root` | `/` | root-hosted build (other hosts) |
| `npm run preview:root` | `/` | `http://localhost:4173/` |

To target a different repository name, change `GITHUB_PAGES_BASE`, or override per build
with `vite build --base=/other-path/`.

### Deploying

```bash
npm run deploy   # npm run build && gh-pages -d dist --nojekyll
```

`--nojekyll` writes a `.nojekyll` file so GitHub Pages serves the output as plain static
files. The `gh-pages` branch is created automatically if it does not exist.

> Enable **Settings → Pages → Source: `gh-pages` branch** in the repository once, before
> the first deploy.

### Why `base` alone was not enough

`base` only rewrites URLs that Vite can see at build time:

| Reference | Rewritten with `base`? |
| --- | --- |
| `<link>` / `<meta>` asset attributes in `index.html` | ✅ yes |
| CSS `url()` pointing into `public/` | ✅ yes |
| **String literals inside JS/TSX** | ❌ **no** |

A component that hardcoded `src="/assets/emblem-128.jpg"` kept that literal in the
bundle, so the browser requested `https://headlesscollective.github.io/assets/emblem-128.jpg`
— the domain root, not the repository path — and 404'd. That was the cause of the broken
images, and it is why every public asset referenced from a component now goes through
`getAssetUrl()`.

---

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Build | Vite 6 | Fast dev server, small production output |
| UI | React 19 + TypeScript | Component architecture, strict typing |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) | Matches the design source's utility vocabulary; tokens live in CSS variables |
| Fonts | Self-hosted woff2 | No third-party runtime dependency, no FOUT on the LCP element |
| State | React state + a small context | No external state library needed |

No runtime dependencies beyond React. No CDN scripts, no trackers, no analytics.

---

## Project layout

```
design-package/           Original design reference (source of truth)
  code.html                 The exported design: markup, tokens, scripts
  screen.png                Reference render
  assets/emblem.png         The design's original emblem (kept for reference)

brand/                   Master brand artwork supplied for this build
  emblem.jpg                New brand mark (1920x1920) — source for every derivative
  hero-backdrop.jpg         Constellation-over-Earth backdrop (1376x768)

src/
  App.tsx                   Section composition
  main.tsx                  Entry point
  i18n/
    LanguageContext.tsx     en/ar provider, dir+lang switching, useLanguage()
  utils/
    assetPath.ts            getAssetUrl() — resolves public/ paths against import.meta.env.BASE_URL
  data/
    content.ts              Every bilingual string (en + ar)
    site.ts                 Data-driven content: domains, perspectives
  assets/
    images/                 Component-only assets, bundled by Vite (hero backdrop)
  components/
    ScrollProgress.tsx      Fixed gradient scroll-progress bar
    SiteNav.tsx             Fixed glass nav, language switch, mobile sheet
    Hero.tsx                Wordmark, badge, question grid, CTAs
    Philosophy.tsx          Pillars, thesis, paradigm comparison
    Principles.tsx          Six principle cards
    Fields.tsx              Constellation node grid + spotlight inspector
    HowWeWork.tsx           Four-stage pipeline + coordination bar
    Projects.tsx            Cyber Diaries showcase + triad inspector
    Participate.tsx         Seven contribution tracks + CTA
    Vision.tsx              Emblem, manifesto, closing quote
    SiteFooter.tsx          Brand, navigation, repositories, copyright
    ui/
      Icon.tsx              Inline SVG icon set
      SectionHeader.tsx     Reusable numbered section header
  styles/
    fonts.css               Self-hosted @font-face declarations
    index.css               Tailwind import, design tokens, glass system

public/
  assets/                   Emblem (also used as favicon + og:image)
  fonts/                    Self-hosted woff2 files

tools/qa/                   Headless-Chrome visual + interaction + perf harness
  shoot.mjs                 Screenshots + layout audit at 5 viewports
  interact.mjs              Interaction assertions (i18n, inspector, toggles, menu)
  perf.mjs                  Cold-cache LCP / CLS / transfer-size measurement
  preview.mjs               Regenerates docs/preview/ captures and logo close-ups
  check-base.mjs            Verifies base-prefixed URLs, file existence and filename casing
  build-brand.py            Re-derives the emblem + backdrop derivatives from brand/
```

---

## Design system

Extracted verbatim from `design-package/code.html` and declared once in
`src/styles/index.css` via Tailwind v4's `@theme`.

**Palette** — `obsidian #02040A`, `void #050713`, `cosmic #101B35`, `stellar #356DDB`,
`starblue #8CB8FF`, `cream #F0EEE8`, `lavender #8B83C9`, `glass rgba(7,12,28,.65)`.

**Type** — Space Grotesk (display), JetBrains Mono (labels/metadata), IBM Plex Sans Arabic
(Arabic and RTL fallback), Sora (stack fallback, never matched at runtime).

**Surfaces** — `.glass-panel` (gradient + 16px backdrop blur + hairline blue border),
`.glass-nav` (82% black + 20px blur), `.btn-sweep` (rotating sheen on hover).

**Elevation** — `shadow-glow-stellar`, `shadow-glow-cyan`, `shadow-glass-edge`.

**Spacing** — `py-24` section rhythm, `max-w-6xl` content container, `max-w-5xl` hero,
`max-w-4xl` vision, `max-w-3xl` copy blocks.

## Responsive behaviour

| Breakpoint | Layout |
| --- | --- |
| ≥1024px | Full desktop grid: 6-up domain nodes, 3-up principles, 4-up pipeline, 4-up tracks, inline nav links |
| 768–1023px | 2-up pillars / domains / tracks, 2-up principles, 2-up paradigm comparison, hamburger nav |
| <768px | Single-column stacks, full-width CTAs, slide-down nav sheet, 2-up domain nodes, 2-up phase grid |

Every viewport was verified for zero horizontal overflow. The only elements that extend
past the viewport edge are the decorative blurred glows, which live inside `overflow-hidden`
parents and are clipped — the document never scrolls sideways.

## Interactions

| Control | Behaviour |
| --- | --- |
| Language toggle (`AR / EN`) | Swaps all bilingual strings, sets `dir=rtl` + `lang=ar`, re-fonts to IBM Plex Sans Arabic, mirrors the layout |
| Domain node grid | Selecting a node re-renders the inspector panel (code, title, description, three focus blocks, status) with a 120ms fade |
| Perspective tabs | Red Team / Blue SOC / Developer switch the role, objective, method, tag colour and the incident-lifecycle meter width |
| Pipeline stages | Selecting a stage highlights that card |
| Scroll progress | Fixed gradient bar tracking document scroll, updated on `requestAnimationFrame` |
| Mobile nav | Hamburger opens a glass sheet; closes on link click or `Escape` |

All controls are real `<button>` elements with `aria-pressed` / `aria-expanded` state.

## Motion

`prefers-reduced-motion: reduce` disables the constellation pulse, the badge pulse, the
sweep sheen and smooth scrolling. Motion is otherwise limited to what the design specifies.

---

## Assets

The emblem is the **brand mark supplied for this build**, master kept at `brand/emblem.jpg`
(1920×1920) and re-encoded to WebP + JPEG at 512px and 128px. It has the same composition as the
design's original emblem — a white monogram and wordmark on a square black field — so it renders
identically in the nav, the vision centerpiece and the footer without touching any markup,
class name or layout rule. The original design emblem is preserved untouched at
`design-package/assets/emblem.png` for reference.

Regenerate the derivatives with `python tools/qa/build-brand.py`.

The hero backdrop is the **constellation-over-Earth image supplied for this build**. The
design source referenced a `lh3.googleusercontent.com/aida/…` URL that is gated behind a
Google sign-in — it returns an HTML login page to `curl`, to the in-app browser, and to the
renderer's screenshot, which is why the reference `screen.png` shows a flat obsidian hero.
The supplied image replaces it at the design's own `opacity-75` and gradient overlay.

Images ship as WebP with JPEG fallbacks via `<picture>`, with `srcset`/`sizes` so mobile
downloads the 640px variant and desktop the 1376px original.

### Where each asset lives, and why

| Asset | Home | How it is referenced | Why |
| --- | --- | --- | --- |
| Emblem (`.jpg`, `.webp`) | `public/assets/` | `getAssetUrl('/assets/emblem-128.jpg')` | Also used as the favicon and `og:image` in `index.html`, which needs a stable, unhashed URL. Components resolve the base at runtime. |
| Hero backdrop | `src/assets/images/` | `import heroBg from '@/assets/images/hero-backdrop-1376.jpg'` | Used only by `Hero.tsx`, so Vite bundles it: hashed, optimised, and emitted under the deployment base automatically. No helper needed. |
| Fonts (12 woff2) | `public/fonts/` | CSS `url("/fonts/…")` in `src/styles/fonts.css` | Vite rewrites public URLs in CSS with the base. A stable unhashed path also keeps the `<link rel="preload">` in `index.html` and the `@font-face` URL in sync. |

Rule of thumb: an asset referenced from `index.html` stays in `public/`; an asset used
only by components moves to `src/assets/` and is imported. A `public/` asset referenced
from a component **must** go through `getAssetUrl()`.

## Fonts

Downloaded from Google Fonts and self-hosted. Variable families (Space Grotesk, JetBrains
Mono, Sora) ship one file per family; IBM Plex Sans Arabic ships one file per weight per
subset. Google's exact `unicode-range` values are preserved, so glyph coverage and
download-on-demand behaviour are unchanged — the Arabic faces are only fetched when Arabic
text is actually rendered.

## Performance

Measured on the production build (headless Chrome, cache disabled, 7 runs, localhost):

| Metric | Median |
| --- | --- |
| FCP / LCP | 460 ms |
| DOMContentLoaded | 121 ms |
| CLS | 0 |
| Total transfer | 260 KB |

The LCP element is the hero headline, which is why Space Grotesk is preloaded and the hero
backdrop is *not* — preloading the image measurably delayed the LCP font by ~330 ms.

---

## QA harness

`tools/qa/` contains a dependency-free headless-Chrome (CDP) harness:

```bash
node tools/qa/shoot.mjs http://localhost:4173/headlesscollective/ .tmp/shots   # full-page captures + layout audit
node tools/qa/interact.mjs http://localhost:4173/headlesscollective/           # 14 interaction assertions
node tools/qa/perf.mjs http://localhost:4173/headlesscollective/ 7             # FCP / LCP / CLS / transfer
node tools/qa/check-base.mjs /headlesscollective/ dist                         # base + filename-casing audit
```

`shoot.mjs` captures full-page screenshots at 1512, 1440, 1280, 768 and 390 px, audits for
horizontal overflow, broken images, console errors and unloaded fonts, and writes
`audit.json` plus per-section crops. It also records every network response, so a single
404 from a mis-resolved asset path fails the run. `interact.mjs` drives every interactive
control and asserts the resulting DOM state, including the Arabic/RTL pass.

`check-base.mjs` is the guard against the sub-path regression: it verifies that no URL in
the built `index.html`, CSS or JS escapes the configured base, that every referenced file
exists, and that every filename matches the on-disk name **exactly** — GitHub Pages runs
Linux, where the filesystem is case-sensitive and `emblem-512.JPG` would 404.
