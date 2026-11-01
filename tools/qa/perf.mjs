/** Measure Core Web Vitals on the built site over repeated cold loads. */
import { spawn } from 'node:child_process'
import { openSync, writeFileSync, mkdirSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 9336
const PROFILE = resolve(tmpdir(), 'hc-perf-profile')
const TARGET = process.argv[2] || 'http://127.0.0.1:4173/'
const RUNS = Number(process.argv[3] || 5)
mkdirSync('.tmp/perf', { recursive: true })
mkdirSync('.tmp', { recursive: true })

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
    '--remote-allow-origins=*',
  ],
  { stdio: ['ignore', 'ignore', openSync('.tmp/perf-chrome.log', 'w')] },
)
process.on('exit', () => chrome.kill())

for (let i = 0; i < 60; i++) {
  try {
    const r = await fetch(`http://127.0.0.1:${PORT}/json/version`)
    if (r.ok) break
  } catch {}
  await sleep(250)
}

const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json()
const ws = new WebSocket(target.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) {
    const p = pending.get(m.id)
    pending.delete(m.id)
    m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result)
  }
})
await new Promise((r) => ws.addEventListener('open', r))
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const i = ++id
    pending.set(i, { resolve, reject })
    ws.send(JSON.stringify({ id: i, method, params }))
    setTimeout(() => pending.has(i) && reject(new Error('timeout ' + method)), 30000)
  })

await send('Page.enable')
await send('Runtime.enable')
await send('Network.enable')
await send('Network.setCacheDisabled', { cacheDisabled: true })
// Record LCP from document start, buffered, so the value survives navigation.
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `
    window.__lcp = null; window.__lcpEl = null;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      window.__lcp = last.startTime;
      window.__lcpEl = last.element ? (last.element.tagName + (last.element.className ? '.' + String(last.element.className).split(' ')[0] : '')) : 'unknown';
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  `,
})
await send('Emulation.setDeviceMetricsOverride', {
  width: 1512,
  height: 982,
  deviceScaleFactor: 1,
  mobile: false,
})

const runs = []
for (let run = 0; run < RUNS; run++) {
  await send('Page.navigate', { url: 'about:blank' })
  await sleep(400)
  await send('Page.navigate', { url: TARGET })
  await sleep(4500)

  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      const nav = performance.getEntriesByType('navigation')[0]
      const paints = Object.fromEntries(performance.getEntriesByType('paint').map(p => [p.name, Math.round(p.startTime)]))
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
      const lcp = window.__lcp ?? (lcpEntries.length ? Math.round(lcpEntries[lcpEntries.length-1].startTime) : null)
      const lcpEl = window.__lcpEl || null
      let cls = 0
      for (const e of performance.getEntriesByType('layout-shift') || []) {
        if (!e.hadRecentInput) cls += e.value
      }
      const resources = performance.getEntriesByType('resource')
      const byType = {}
      for (const r of resources) {
        const kind = r.initiatorType || 'other'
        byType[kind] = (byType[kind] || 0) + (r.transferSize || 0)
      }
      const totalBytes = resources.reduce((a, r) => a + (r.transferSize || 0), 0) + (nav?.transferSize || 0)
      return {
        domContentLoaded: Math.round(nav?.domContentLoadedEventEnd || 0),
        load: Math.round(nav?.loadEventEnd || 0),
        fcp: paints['first-contentful-paint'] ?? null,
        lcp,
        lcpEl,
        cls: Math.round(cls * 10000) / 10000,
        transferKB: Math.round(totalBytes / 1024),
        resourceCount: resources.length,
        byType: Object.fromEntries(Object.entries(byType).map(([k,v]) => [k, Math.round(v/1024)])),
        longest: resources.map(r => ({ n: r.name.split('/').pop(), ms: Math.round(r.duration), kb: Math.round((r.transferSize||0)/1024) })).sort((a,b)=>b.ms-a.ms).slice(0,5),
      }
    })()`,
    returnByValue: true,
  })
  runs.push(result.result.value)
}

const median = (key) => {
  const v = runs.map((r) => r[key]).filter((x) => x !== null && x !== undefined).sort((a, b) => a - b)
  return v.length ? v[Math.floor(v.length / 2)] : null
}

console.log(`target: ${TARGET}  runs: ${RUNS}\n`)
runs.forEach((r, i) => {
  console.log(
    `run ${i + 1}: FCP=${r.fcp}ms  LCP=${r.lcp}ms(${r.lcpEl})  DCL=${r.domContentLoaded}ms  load=${r.load}ms  CLS=${r.cls}  transfer=${r.transferKB}KB  reqs=${r.resourceCount}`,
  )
})
console.log('\n--- medians ---')
console.log(`  FCP        ${median('fcp')} ms`)
console.log(`  LCP        ${median('lcp')} ms`)
console.log(`  DCL        ${median('domContentLoaded')} ms`)
console.log(`  load       ${median('load')} ms`)
console.log(`  CLS        ${median('cls')}`)
console.log(`  transfer   ${median('transferKB')} KB`)
console.log('\n  transfer by initiator type (last run, KB):', JSON.stringify(runs.at(-1).byType))
console.log('  slowest resources:', JSON.stringify(runs.at(-1).longest))

writeFileSync('.tmp/perf/results.json', JSON.stringify(runs, null, 2))
chrome.kill()
process.exit(0)
