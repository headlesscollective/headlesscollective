/**
 * Dependency-free CDP harness for visual QA.
 *
 * Launches headless Chrome, captures full-page screenshots at several
 * viewports, and runs in-page assertions (horizontal overflow, console errors,
 * broken images, key element geometry).
 *
 * Usage: node .tmp/shoot.mjs [url] [outDir]
 */
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync, rmSync, openSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 9333
const URL_ = process.argv[2] || 'http://127.0.0.1:5173/'
const OUT = process.argv[3] || '.tmp/shots'
// Keep the profile outside the project so Vite's watcher never sees Chrome's
// locked profile files.
const PROFILE = resolve(tmpdir(), 'hc-qa-chrome-profile')

const VIEWPORTS = [
  { name: 'desktop-1512', width: 1512, height: 982, dsf: 1 },
  { name: 'desktop-1440', width: 1440, height: 900, dsf: 1 },
  { name: 'laptop-1280', width: 1280, height: 800, dsf: 1 },
  { name: 'tablet-768', width: 768, height: 1024, dsf: 1 },
  { name: 'mobile-390', width: 390, height: 844, dsf: 2 },
]

mkdirSync(OUT, { recursive: true })
mkdirSync('.tmp', { recursive: true })
rmSync(PROFILE, { recursive: true, force: true })

const chromeLog = openSync('.tmp/chrome-stderr.log', 'w')
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-color-profile=srgb',
    '--font-render-hinting=none',
    '--allow-running-insecure-content',
    '--remote-allow-origins=*',
  ],
  { stdio: ['ignore', 'ignore', chromeLog] },
)

process.on('exit', () => chrome.kill())

async function waitForDevtools() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      if (res.ok) return
    } catch {
      /* not up yet */
    }
    await sleep(250)
  }
  throw new Error('Chrome DevTools endpoint never came up')
}

/** Minimal CDP client over the page target's websocket. */
class Cdp {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pending = new Map()
    this.events = []
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data)
      if (msg.id !== undefined) {
        const entry = this.pending.get(msg.id)
        if (entry) {
          this.pending.delete(msg.id)
          msg.error ? entry.reject(new Error(JSON.stringify(msg.error))) : entry.resolve(msg.result)
        }
      } else {
        this.events.push(msg)
      }
    })
  }

  send(method, params = {}) {
    const id = ++this.id
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.ws.send(JSON.stringify({ id, method, params }))
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id)
          reject(new Error(`CDP timeout: ${method}`))
        }
      }, 45000)
    })
  }
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url)
    ws.addEventListener('open', () => resolve(new Cdp(ws)))
    ws.addEventListener('error', reject)
  })
}

const AUDIT = `(() => {
  const doc = document.documentElement
  const body = document.body
  const overflow = body.scrollWidth - doc.clientWidth
  const images = [...document.images].map((img) => ({
    src: img.currentSrc || img.src,
    complete: img.complete,
    w: img.naturalWidth,
    h: img.naturalHeight,
    displayW: Math.round(img.getBoundingClientRect().width),
  }))
  const broken = images.filter((i) => !i.complete || i.w === 0)
  const overflowing = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0) continue
    if (r.right > doc.clientWidth + 1 || r.left < -1) {
      overflowing.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : String(el.className || '')).slice(0, 90),
        left: Math.round(r.left),
        right: Math.round(r.right),
      })
    }
  }
  const fonts = [...document.fonts].map((f) => f.family + ' ' + f.weight + ' ' + f.status)
  const rect = (sel) => {
    const el = document.querySelector(sel)
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
  }
  return {
    scrollWidth: body.scrollWidth,
    clientWidth: doc.clientWidth,
    scrollHeight: doc.scrollHeight,
    horizontalOverflow: overflow,
    brokenImages: broken,
    imageCount: images.length,
    imageSrcs: images.map((i) => i.src),
    overflowing: overflowing.slice(0, 12),
    overflowCount: overflowing.length,
    fontsLoaded: document.fonts.status,
    fontFaces: fonts,
    nav: rect('nav[aria-label="Main Navigation"]'),
    hero: rect('#home'),
    h1: rect('#home h1'),
    philosophy: rect('#philosophy'),
    principles: rect('#principles'),
    fields: rect('#fields'),
    howWeWork: rect('#how-we-work'),
    projects: rect('#projects'),
    participate: rect('#participate'),
    vision: rect('main section:last-of-type'),
    footer: rect('footer'),
    fieldPanelTitle: (document.querySelector('#fieldTitle') || {}).textContent,
    perspRole: (document.querySelector('#perspRole') || {}).textContent,
    meterWidth: (document.querySelector('#perspProgressMeter') || {}).style?.width,
    lang: doc.getAttribute('lang'),
    dir: doc.getAttribute('dir'),
  }
})()`

const results = []

await waitForDevtools()

for (const vp of VIEWPORTS) {
  const targetRes = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })
  const target = await targetRes.json()
  const cdp = await connect(target.webSocketDebuggerUrl)

  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  await cdp.send('Log.enable')
  await cdp.send('Network.enable')
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: vp.dsf,
    mobile: vp.width < 768,
  })

  await cdp.send('Page.navigate', { url: URL_ })

  // Wait for load + font/image settle
  const deadline = Date.now() + 30000
  let loaded = false
  while (Date.now() < deadline) {
    await sleep(200)
    if (cdp.events.some((e) => e.method === 'Page.loadEventFired')) {
      loaded = true
      break
    }
  }
  await cdp.send('Runtime.evaluate', {
    expression: `(async () => {
      await document.fonts.ready
      await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r })))
      return true
    })()`,
    awaitPromise: true,
  })
  await sleep(700)

  const audit = await cdp.send('Runtime.evaluate', { expression: AUDIT, returnByValue: true })
  const metrics = await cdp.send('Page.getLayoutMetrics')

  const shot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    optimizeForSpeed: false,
  })
  writeFileSync(`${OUT}/${vp.name}.png`, Buffer.from(shot.data, 'base64'))

  // Section-level captures (viewport-sized) for detailed comparison
  const contentHeight = Math.ceil(metrics.cssContentSize?.height || metrics.contentSize.height)
  const sectionShots = [
    ['philosophy', '#philosophy'],
    ['principles', '#principles'],
    ['fields', '#fields'],
    ['howwework', '#how-we-work'],
    ['projects', '#projects'],
    ['participate', '#participate'],
  ]
  for (const [label, selector] of sectionShots) {
    const box = await cdp.send('Runtime.evaluate', {
      expression: `(() => { const el = document.querySelector('${selector}'); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height }; })()`,
      returnByValue: true,
    })
    const value = box.result?.value
    if (!value) continue
    const clipped = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      clip: {
        x: 0,
        y: Math.round(value.y),
        width: Math.round(value.w),
        height: Math.min(Math.round(value.h), 4000),
        scale: 1,
      },
    })
    writeFileSync(`${OUT}/${vp.name}-${label}.png`, Buffer.from(clipped.data, 'base64'))
  }

  const consoleErrors = cdp.events
    .filter((e) => e.method === 'Log.entryAdded' && e.params?.entry?.level === 'error')
    .map((e) => e.params.entry.text)
  const consoleApiErrors = cdp.events
    .filter((e) => e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error')
    .map((e) => (e.params.args || []).map((a) => a.value ?? a.description).join(' '))
  const exceptions = cdp.events
    .filter((e) => e.method === 'Runtime.exceptionThrown')
    .map((e) => e.params?.exceptionDetails?.text)

  // Any HTTP >= 400 (the 404s a wrong deployment base causes) and any
  // request that failed outright.
  const httpErrors = cdp.events
    .filter((e) => e.method === 'Network.responseReceived' && e.params?.response?.status >= 400)
    .map((e) => `${e.params.response.status} ${e.params.response.url}`)
  const networkFailures = cdp.events
    .filter((e) => e.method === 'Network.loadingFailed')
    .map((e) => `${e.params?.errorText} ${e.params?.type ?? ''}`.trim())
  const requestedUrls = cdp.events
    .filter((e) => e.method === 'Network.requestWillBeSent')
    .map((e) => e.params?.request?.url)
    .filter(Boolean)

  results.push({
    viewport: vp.name,
    size: `${vp.width}x${vp.height}@${vp.dsf}x`,
    loaded,
    pageHeight: contentHeight,
    audit: audit.result?.value,
    consoleErrors,
    consoleApiErrors,
    exceptions,
    httpErrors,
    networkFailures,
    requestedUrls,
  })

  await fetch(`http://127.0.0.1:${PORT}/json/close/${target.id}`)
  cdp.ws.close()
}

writeFileSync(`${OUT}/audit.json`, JSON.stringify(results, null, 2))

for (const r of results) {
  const a = r.audit || {}
  console.log(`\n=== ${r.viewport} (${r.size}) loaded=${r.loaded} pageHeight=${r.pageHeight} ===`)
  console.log(`  horizontalOverflow: ${a.horizontalOverflow}px  scrollW=${a.scrollWidth} clientW=${a.clientWidth}`)
  console.log(`  overflowElements: ${a.overflowCount}  brokenImages: ${(a.brokenImages || []).length}  fonts: ${a.fontsLoaded}`)
  if (a.overflowCount) console.log('  ', JSON.stringify(a.overflowing, null, 1))
  if ((a.brokenImages || []).length) console.log('  broken:', JSON.stringify(a.brokenImages))
  const httpErrs = r.httpErrors || []
  const netErrs = r.networkFailures || []
  console.log(`  http errors: ${httpErrs.length ? JSON.stringify(httpErrs.slice(0, 8)) : 'none'}`)
  console.log(`  network failures: ${netErrs.length ? JSON.stringify(netErrs.slice(0, 8)) : 'none'}`)
  const errs = [...(r.consoleErrors || []), ...(r.consoleApiErrors || []), ...(r.exceptions || [])]
  console.log(`  console errors: ${errs.length ? JSON.stringify(errs.slice(0, 5)) : 'none'}`)
  console.log(`  sections:`, JSON.stringify({
    nav: a.nav, hero: a.hero, h1: a.h1, philosophy: a.philosophy, principles: a.principles,
    fields: a.fields, howWeWork: a.howWeWork, projects: a.projects, participate: a.participate,
    footer: a.footer,
  }))
}

chrome.kill()
process.exit(0)
