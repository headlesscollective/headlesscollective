/** Exercise every interactive element and verify the resulting DOM state. */
import { spawn } from 'node:child_process'
import { openSync, writeFileSync, mkdirSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 9335
const PROFILE = resolve(tmpdir(), 'hc-interact-profile')
const OUT = process.argv[3] || '.tmp/interact'
const TARGET = process.argv[2] || 'http://127.0.0.1:5173/'
mkdirSync(OUT, { recursive: true })
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
  { stdio: ['ignore', 'ignore', openSync('.tmp/interact-chrome.log', 'w')] },
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
const logs = []
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) {
    const p = pending.get(m.id)
    pending.delete(m.id)
    m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result)
  } else if (m.method === 'Runtime.consoleAPICalled' || m.method === 'Runtime.exceptionThrown') {
    logs.push(m)
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

const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails))
  return r.result?.value
}

const shot = async (name) => {
  const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(s.data, 'base64'))
}

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1512, height: 982, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: TARGET })
await sleep(3000)

const results = []
const check = (name, pass, detail) => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  -> ' + detail : ''}`)
}

// ---- 1. Field constellation inspector ----
await evaluate(`document.querySelector('#field-tab-3').click()`)
await sleep(500)
const field = await evaluate(`({
  code: document.querySelector('#fieldCode').textContent,
  title: document.querySelector('#fieldTitle').textContent,
  status: document.querySelector('#fieldStatus').textContent,
  focus: [...document.querySelectorAll('#fieldDetailsPanel .grid > div span:last-child')].map(e => e.textContent),
  activePressed: document.querySelector('#field-tab-3').getAttribute('aria-pressed'),
  othersPressed: [...document.querySelectorAll('.field-btn')].map(b => b.getAttribute('aria-pressed')).join(','),
})`)
check('field inspector updates panel', field.code.includes('NODE 04') && field.title === 'AI & Emerging Technology', JSON.stringify(field))
check('field node toggles aria-pressed', field.activePressed === 'true' && field.othersPressed === 'false,false,false,true,false,false', field.othersPressed)

// ---- 2. Cyber Diaries perspective switch ----
await evaluate(`document.querySelector('#btn-persp-dev').click()`)
await sleep(400)
const persp = await evaluate(`({
  tag: document.querySelector('#perspTag').textContent,
  role: document.querySelector('#perspRole').textContent,
  method: document.querySelector('#perspMethod').textContent,
  meter: document.querySelector('#perspProgressMeter').style.width,
  pressed: [...document.querySelectorAll('[id^="btn-persp-"]')].map(b => b.getAttribute('aria-pressed')).join(','),
})`)
check('perspective switch updates content', persp.role === 'The Software Engineer' && persp.tag === 'SECURE CODE & REMEDIATION', JSON.stringify(persp))
check('perspective meter width updates', persp.meter === '100%', persp.meter)

// ---- 3. Pipeline stage selection ----
await evaluate(`document.querySelectorAll('#how-we-work button.glass-panel')[2].click()`)
await sleep(300)
const stage = await evaluate(`(() => {
  const cards = [...document.querySelectorAll('#how-we-work button.glass-panel')]
  return { pressed: cards.map(c => c.getAttribute('aria-pressed')).join(','), cls: cards[2].className }
})()`)
check('pipeline stage selects', stage.pressed === 'false,false,true,false' && stage.cls.includes('border-starblue'), stage.pressed)

// ---- 4. Scroll progress bar ----
await evaluate(`window.scrollTo(0, document.documentElement.scrollHeight * 0.5)`)
await sleep(600)
const progress = await evaluate(`document.querySelector('#scrollProgressBar')?.style.width || document.querySelector('div[style*="width"]')?.style.width`)
const barWidth = await evaluate(`(() => { const el = document.querySelector('#scrollProgressBar'); return el ? el.style.width : null })()`)
check('scroll progress advances', parseFloat(barWidth) > 30 && parseFloat(barWidth) < 70, barWidth)
await evaluate(`window.scrollTo(0,0)`)
await sleep(400)

// ---- 5. Language switch -> RTL Arabic ----
await evaluate(`document.querySelector('#langToggleBtn, button[aria-label="Switch language"]').click()`)
await sleep(700)
const ar = await evaluate(`({
  dir: document.documentElement.getAttribute('dir'),
  lang: document.documentElement.getAttribute('lang'),
  h2: document.querySelector('#philosophy h2').textContent.trim(),
  nav: document.querySelector('nav[aria-label="Main Navigation"] a[href="#principles"] span:last-child').textContent,
  indicator: document.querySelector('button[aria-label="Switch language"] span').textContent,
  secondary: document.querySelector('button[aria-label="Switch language"] span:last-child').textContent,
  bodyFont: getComputedStyle(document.body).fontFamily,
})`)
check('language toggle switches to Arabic RTL', ar.dir === 'rtl' && ar.lang === 'ar', JSON.stringify(ar))
check('Arabic content renders', ar.h2.includes('مساحة حرة'), ar.h2)
check('Arabic applies IBM Plex Sans Arabic', ar.bodyFont.includes('IBM Plex Sans Arabic'), ar.bodyFont)
check('lang toggle indicator updates', ar.indicator === 'EN' && ar.secondary === '/ AR', `${ar.indicator} ${ar.secondary}`)

// full page in Arabic
await send('Page.getLayoutMetrics')
const metrics = await send('Page.getLayoutMetrics')
const arShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
writeFileSync(`${OUT}/arabic-full.png`, Buffer.from(arShot.data, 'base64'))
await shot('arabic-hero')

// switch back
await evaluate(`document.querySelector('button[aria-label="Switch language"]').click()`)
await sleep(600)
const back = await evaluate(`document.documentElement.getAttribute('dir')`)
check('language toggles back to LTR', back === 'ltr', back)

// ---- 6. Mobile menu ----
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true })
await sleep(900)
const menuBefore = await evaluate(`getComputedStyle(document.querySelector('#mobileNavMenu')).display`)
await evaluate(`document.querySelector('button[aria-label="Toggle menu"]').click()`)
await sleep(600)
const menuAfter = await evaluate(`({
  display: getComputedStyle(document.querySelector('#mobileNavMenu')).display,
  expanded: document.querySelector('button[aria-label="Toggle menu"]').getAttribute('aria-expanded'),
  links: [...document.querySelectorAll('#mobileNavMenu a')].map(a => a.textContent.trim()),
})`)
check('mobile menu opens', menuBefore === 'none' && menuAfter.display === 'flex' && menuAfter.expanded === 'true', `${menuBefore} -> ${menuAfter.display}`)
check('mobile menu lists all 6 sections + GitHub', menuAfter.links.length === 7, JSON.stringify(menuAfter.links))
await shot('mobile-menu-open')

await evaluate(`document.querySelector('#mobileNavMenu a[href="#fields"]').click()`)
await sleep(700)
const closed = await evaluate(`getComputedStyle(document.querySelector('#mobileNavMenu')).display`)
check('mobile menu closes on link click', closed === 'none', closed)

console.log('\nconsole/exceptions captured during interaction:', logs.length)
for (const l of logs.slice(0, 6)) console.log('  ', JSON.stringify(l.params).slice(0, 220))

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} interaction checks passed`)
writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 2))

chrome.kill()
process.exit(failed.length ? 1 : 0)
