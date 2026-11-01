/**
 * Regenerates the documentation preview images under docs/preview/ and writes
 * close-up captures of every logo placement so the brand mark can be verified
 * at a glance.
 *
 * Usage: node tools/qa/preview.mjs [url]
 */
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync, rmSync, openSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 9334
const URL_ = process.argv[2] || 'http://127.0.0.1:4173/'
const OUT = 'docs/preview'
const TMP = '.tmp'
// Keep the profile outside the project so the Vite watcher never sees
// Chrome's locked profile files.
const PROFILE = resolve(tmpdir(), 'hc-preview-chrome-profile')

mkdirSync(OUT, { recursive: true })
mkdirSync(TMP, { recursive: true })
rmSync(PROFILE, { recursive: true, force: true })

const chromeLog = openSync(`${TMP}/chrome-preview-stderr.log`, 'w')
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

/** Waits for load, webfonts and every image to finish decoding. */
async function settle(cdp) {
  const deadline = Date.now() + 30000
  while (Date.now() < deadline) {
    await sleep(200)
    if (cdp.events.some((e) => e.method === 'Page.loadEventFired')) break
  }
  await cdp.send('Runtime.evaluate', {
    expression: `(async () => {
      await document.fonts.ready
      await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r })))
      return true
    })()`,
    awaitPromise: true,
  })
  await sleep(600)
}

async function setViewport(cdp, width, height, dsf) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: dsf,
    mobile: width < 768,
  })
}

async function navigate(cdp, url) {
  cdp.events.length = 0
  await cdp.send('Page.navigate', { url })
  await settle(cdp)
}

/** Plain viewport screenshot (no clip) — the reliable CDP capture path. */
async function shotViewport(cdp, file) {
  const shot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
    optimizeForSpeed: false,
  })
  writeFileSync(file, Buffer.from(shot.data, 'base64'))
  return file
}

/**
 * Clip capture in *page* coordinates. Requires captureBeyondViewport:true —
 * with it false the clip comes back fully black.
 */
async function shotClip(cdp, file, box, dsf = 1) {
  const shot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: {
      x: Math.round(box.x),
      y: Math.round(box.y),
      width: Math.round(box.width),
      height: Math.round(box.height),
      scale: dsf,
    },
  })
  writeFileSync(file, Buffer.from(shot.data, 'base64'))
  return file
}

async function rectOf(cdp, selector, pad = 0) {
  const res = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height };
    })()`,
    returnByValue: true,
  })
  const v = res.result?.value
  if (!v) return null
  return {
    x: v.x - pad,
    y: v.y - pad,
    width: v.w + pad * 2,
    height: v.h + pad * 2,
  }
}

const report = { generated: [], logos: [] }

await waitForDevtools()

const targetRes = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })
const target = await targetRes.json()
const cdp = await connect(target.webSocketDebuggerUrl)

await cdp.send('Page.enable')
await cdp.send('Runtime.enable')
await cdp.send('Log.enable')

// ---------------------------------------------------------------- desktop hero
await setViewport(cdp, 1512, 982, 1)
await navigate(cdp, URL_)
report.generated.push(await shotViewport(cdp, `${OUT}/hero-desktop.png`))

// ----------------------------------------------------------------- mobile hero
await setViewport(cdp, 390, 844, 2)
await navigate(cdp, URL_)
report.generated.push(await shotViewport(cdp, `${OUT}/hero-mobile.png`))

// ------------------------------------------------------------- full page (raw)
await setViewport(cdp, 1280, 900, 1)
await navigate(cdp, URL_)
const fullShot = await cdp.send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: true,
  optimizeForSpeed: false,
})
writeFileSync(`${TMP}/page-full-raw.png`, Buffer.from(fullShot.data, 'base64'))

// ------------------------------------------------------- logo placement crops
await setViewport(cdp, 1512, 982, 1)
await navigate(cdp, URL_)

const placements = [
  ['logo-nav', 'nav img[alt*="Emblem"]', 14],
  ['logo-vision', 'img[alt*="official logo"]', 18],
  ['logo-footer', 'footer img[alt*="logo"]', 14],
]

for (const [label, selector, pad] of placements) {
  const box = await rectOf(cdp, selector, pad)
  if (!box) {
    report.logos.push({ label, found: false })
    continue
  }
  const file = `${OUT}/${label}.png`
  await shotClip(cdp, file, box, 3)
  report.logos.push({ label, found: true, box, file })
}

writeFileSync(`${TMP}/preview-report.json`, JSON.stringify(report, null, 2))

for (const f of report.generated) console.log('wrote', f)
for (const l of report.logos) {
  console.log(
    l.found
      ? `wrote ${l.file}  (${Math.round(l.box.width)}x${Math.round(l.box.height)} @3x)`
      : `MISSING logo placement: ${l.label}`,
  )
}

await fetch(`http://127.0.0.1:${PORT}/json/close/${target.id}`)
cdp.ws.close()
chrome.kill()
process.exit(0)
