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
npm run dev        # http://127.0.0.1:5173
npm run build      # type-check + production bundle into dist/
npm run preview    # serve the built output
npm run typecheck  # tsc only
```

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
  data/
    content.ts              Every bilingual string (en + ar)
    site.ts                 Data-driven content: domains, perspectives
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
  assets/                   Optimised emblem + hero backdrop
  fonts/                    Self-hosted woff2 files

tools/qa/                   Headless-Chrome visual + interaction + perf harness
  shoot.mjs                 Screenshots + layout audit at 5 viewports
  interact.mjs              Interaction assertions (i18n, inspector, toggles, menu)
  perf.mjs                  Cold-cache LCP / CLS / transfer-size measurement
  preview.mjs               Regenerates docs/preview/ captures and logo close-ups
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
| FCP / LCP | 392–416 ms |
| DOMContentLoaded | 73–113 ms |
| CLS | 0 |
| Total transfer | 271 KB |

The LCP element is the hero headline, which is why Space Grotesk is preloaded and the hero
backdrop is *not* — preloading the 47 KB image measurably delayed the LCP font by ~330 ms.

---

## QA harness

`tools/qa/` contains a dependency-free headless-Chrome (CDP) harness:

```bash
node tools/qa/shoot.mjs http://127.0.0.1:4173/ .tmp/shots   # full-page captures + layout audit
node tools/qa/interact.mjs http://127.0.0.1:4173/           # 14 interaction assertions
node tools/qa/perf.mjs http://127.0.0.1:4173/ 7             # FCP / LCP / CLS / transfer
```

`shoot.mjs` captures full-page screenshots at 1512, 1440, 1280, 768 and 390 px, audits for
horizontal overflow, broken images, console errors and unloaded fonts, and writes
`audit.json` plus per-section crops. `interact.mjs` drives every interactive control and
asserts the resulting DOM state, including the Arabic/RTL pass.
