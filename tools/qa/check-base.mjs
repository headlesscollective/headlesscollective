/**
 * Verifies that the built site is internally consistent and safe to deploy
 * under a sub-path.
 *
 * Checks
 *  1. dist/index.html and the built CSS — Vite rewrites root-relative URLs in
 *     these, so every one of them must already carry the base. A URL that
 *     escapes the base is a guaranteed 404 on GitHub Pages.
 *  2. The built JS — the inlined base must be present (proves
 *     `import.meta.env.BASE_URL` was replaced at build time rather than left
 *     as a runtime lookup), and every root-relative asset literal must be
 *     passed through the base-prefixing helper.
 *  3. src/** — no component may hardcode a root-relative asset path outside
 *     of `getAssetUrl(...)`. CSS is exempt: Vite rewrites public URLs in CSS
 *     with the base (verified by check 1).
 *  4. Case sensitivity — every referenced filename must match the on-disk
 *     name EXACTLY, and every `@/assets/...` import must resolve to a file
 *     that exists with the same casing. GitHub Pages runs Linux, where the
 *     filesystem is case-sensitive.
 *
 * Usage: node tools/qa/check-base.mjs [base] [distDir]
 *   base    deployment base, e.g. /headlesscollective/   (default '/')
 *   distDir built output directory                     (default 'dist')
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join, relative, resolve, dirname } from 'node:path'

const BASE = (process.argv[2] || '/').replace(/\/+$/, '')
const DIST = resolve(process.argv[3] || 'dist')
const SRC = resolve('src')

let failures = 0
const fail = (msg, detail) => {
  failures++
  console.log(`  FAIL  ${msg}`)
  if (detail) console.log(`        ${detail}`)
}
const pass = (msg) => console.log(`  ok    ${msg}`)

function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

/** Strip block and line comments so doc examples are not scanned. */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
}

/** Every '/'-prefixed URL-looking token in a text blob. */
const URL_RE = /["'`()]\s*(\/(?:[A-Za-z0-9._~%-]+\/)*[A-Za-z0-9._~%-]*\.[A-Za-z0-9]+)/g

function collectUrls(text) {
  const out = new Set()
  let m
  while ((m = URL_RE.exec(text)) !== null) out.add(m[1])
  return out
}

/** Walk a relative path segment by segment, requiring an EXACT name match. */
function resolveExactCase(root, relPath) {
  const parts = relPath.split('/').filter(Boolean)
  let current = root
  for (const part of parts) {
    let entries
    try {
      entries = readdirSync(current, { withFileTypes: true })
    } catch {
      return { ok: false, reason: 'missing-directory', at: relative(root, current) }
    }
    const match = entries.find((e) => e.name === part)
    if (!match) {
      const wrongCase = entries.find((e) => e.name.toLowerCase() === part.toLowerCase())
      return {
        ok: false,
        reason: wrongCase ? 'wrong-case' : 'missing',
        at: relative(root, current),
        wanted: part,
        found: wrongCase ? wrongCase.name : null,
        available: entries.map((e) => e.name),
      }
    }
    current = join(current, match.name)
  }
  return { ok: true, path: current }
}

if (!existsSync(DIST)) {
  console.log(`dist not found: ${DIST} — run "npm run build" first.`)
  process.exit(1)
}

const baseLabel = BASE || '/'
console.log(`\n=== base: "${baseLabel}"   dist: ${DIST} ===\n`)

// ------------------------------------------- 1: html + css (Vite-rewritten)
console.log('[1/4] dist/index.html + dist/**/*.css')
const processed = [
  ...walk(DIST).filter((f) => f.endsWith('.html')),
  ...walk(DIST).filter((f) => f.endsWith('.css')),
]
let escaping = 0
let resolvedUrls = 0
for (const file of processed) {
  const rel = relative(DIST, file)
  for (const url of collectUrls(readFileSync(file, 'utf8'))) {
    if (url.startsWith('//')) continue
    if (BASE && !url.startsWith(`${BASE}/`) && url !== BASE) {
      escaping++
      fail(`${rel}: URL escapes the base`, `${url}  (expected ${baseLabel}/…)`)
      continue
    }
    const assetRel = BASE ? url.slice(BASE.length + 1) : url.slice(1)
    if (!assetRel) continue
    resolvedUrls++
    const res = resolveExactCase(DIST, assetRel)
    if (!res.ok) {
      fail(
        `${rel}: ${res.reason}`,
        `${url} → ${assetRel}` +
          (res.found ? `  (on disk: "${res.found}")` : '') +
          (res.available?.length ? `\n        on disk: ${res.available.join(', ')}` : ''),
      )
    }
  }
}
if (escaping === 0) pass(`no base-escaping URLs`)
if (resolvedUrls) pass(`${resolvedUrls} URL(s) resolve with exact casing`)

// ------------------------------------------------------- 2: js bundle safety
console.log('\n[2/4] dist/**/*.js')
const jsFiles = walk(DIST).filter((f) => f.endsWith('.js'))
let inlinedBaseFound = false
let jsEscaping = 0
let jsUrlsChecked = 0
for (const file of jsFiles) {
  const rel = relative(DIST, file)
  const text = readFileSync(file, 'utf8')

  // The base must be inlined. If `import.meta.env.BASE_URL` survived to
  // runtime it would be undefined in the browser. Vite emits it with its
  // trailing slash, so accept both forms.
  if (BASE) {
    const forms = [`"${BASE}"`, `'${BASE}'`, `"${BASE}/"`, `'${BASE}/'`]
    if (forms.some((f) => text.includes(f))) inlinedBaseFound = true
  }

  // Root-relative literals in JS are only safe when they are passed through
  // the base-prefixing helper. Find the helper's call sites by locating the
  // literal inside a call expression.
  const HELPER_CALL = /(\w+)\(\s*["'`](\/(?:assets|fonts|images)\/[^"'`]+)["'`]/g
  const helperCalls = new Set()
  let m
  while ((m = HELPER_CALL.exec(text)) !== null) helperCalls.add(m[2])

  for (const url of collectUrls(text)) {
    if (!/^\/(assets|fonts|images)\//.test(url)) continue

    const routed = helperCalls.has(url)
    // Already carries the base (Vite resolved a bundled asset), or the build
    // is root-hosted so a root-relative literal is already final.
    const preResolved = !BASE || url.startsWith(`${BASE}/`)

    if (!routed && !preResolved) {
      jsEscaping++
      fail(`${rel}: root-relative literal not routed through the helper`, url)
      continue
    }

    // Whatever the final form, the file must exist with exact casing.
    const finalUrl = routed ? `${BASE}${url}` : url
    const assetRel = BASE ? finalUrl.slice(BASE.length + 1) : finalUrl.slice(1)
    if (!assetRel) continue
    jsUrlsChecked++
    const res = resolveExactCase(DIST, assetRel)
    if (!res.ok) {
      fail(
        `${rel}: ${res.reason}`,
        `${finalUrl} → ${assetRel}` +
          (res.found ? `  (on disk: "${res.found}")` : ''),
      )
    }
  }
}
if (BASE) {
  if (inlinedBaseFound) pass(`base "${BASE}" is inlined into the JS bundle`)
  else fail(`base "${BASE}" was not found inlined in the JS bundle`)
}
if (jsEscaping === 0) pass(`no unrouted root-relative literals`)
if (jsUrlsChecked) pass(`${jsUrlsChecked} JS asset URL(s) resolve with exact casing`)

// ------------------------------------------------------- 3: src source scan
console.log('\n[3/4] src/ hardcoded root-relative asset paths')
const srcCode = walk(SRC).filter((f) => /\.(tsx?|jsx?)$/.test(f))
let srcHits = 0
for (const file of srcCode) {
  const text = stripComments(readFileSync(file, 'utf8'))
  // A literal is acceptable only as a direct argument to getAssetUrl(...).
  const allowed = new Set()
  const ok = /getAssetUrl\(\s*["'`](\/[^"'`]+)["'`]/g
  let m
  while ((m = ok.exec(text)) !== null) allowed.add(m[1])
  const lit = /(["'`])(\/(?:assets|fonts|images)\/[^"'`]+)\1/g
  while ((m = lit.exec(text)) !== null) {
    if (allowed.has(m[2])) continue
    srcHits++
    fail(
      `${relative(SRC, file)}: hardcoded root-relative path`,
      `${m[2]}  — use getAssetUrl(...) or import from src/assets/`,
    )
  }
}
if (srcHits === 0) pass(`all component asset paths are resolved`)

// ---------------------------------------------------- 4: import path casing
console.log('\n[4/4] @/assets/… import casing')
let importCount = 0
let importIssues = 0
for (const file of walk(SRC).filter((f) => /\.(tsx?|jsx?)$/.test(f))) {
  const text = readFileSync(file, 'utf8')
  const imp = /from\s+["'](@\/[^"']+)["']/g
  let m
  while ((m = imp.exec(text)) !== null) {
    importCount++
    const rel = m[1].replace(/^@\//, '')
    const res = resolveExactCase(SRC, rel)
    if (!res.ok) {
      importIssues++
      fail(
        `${relative(SRC, file)}: ${res.reason}`,
        `${m[1]} → ${rel}` + (res.found ? `  (on disk: "${res.found}")` : ''),
      )
    }
  }
}
if (importCount) pass(`${importCount} alias import(s) resolve with exact casing`)
if (importIssues === 0 && importCount === 0) pass(`no alias imports to check`)

// ------------------------------------------------------------------ summary
console.log('\n=== summary ===')
if (failures === 0) {
  console.log('  PASS — no base-escaping URLs, no missing files, no casing mismatches.')
  process.exit(0)
}
console.log(`  ${failures} problem(s) found.`)
process.exit(1)
