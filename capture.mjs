import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const url = process.env.CAPTURE_URL
const output = process.env.CAPTURE_DIR
if (!url || !output) {
  console.error('Set CAPTURE_URL and CAPTURE_DIR.')
  process.exit(1)
}

const runtime = process.env.PLAYWRIGHT_RUNTIME || join(homedir(), '.local/share/omgithub-playwright')
const configPath = join(runtime, process.platform === 'darwin' ? 'metal.json' : 'linux.json')
if (process.platform === 'linux') {
  const displayFile = join(runtime, 'display')
  if (!process.env.DISPLAY && existsSync(displayFile)) {
    process.env.DISPLAY = ':' + readFileSync(displayFile, 'utf8').trim()
  }
}

const require = createRequire(join(runtime, 'package.json'))
const { chromium } = require('playwright')
const config = JSON.parse(readFileSync(configPath, 'utf8'))

const timing = (label, startedAt) => {
  console.log(`[timing] ${label}: ${Date.now() - startedAt}ms`)
}

async function step(label, fn) {
  const startedAt = Date.now()
  try {
    return await fn()
  } finally {
    timing(label, startedAt)
  }
}

const TRANSIENT = /net::ERR_|ERR_NAME_NOT_RESOLVED|ERR_CONNECTION|ERR_INTERNET_DISCONNECTED|ERR_TIMED_OUT|ERR_EMPTY_RESPONSE|Timeout [0-9]+ms exceeded|Target (?:page|browser).*closed|browser has been closed/i

function transient(error) {
  error.exitCode = 75
  return error
}

mkdirSync(output, { recursive: true })

const views = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

let browser
let exitCode = 0
const defects = []
const startedAll = Date.now()

try {
  await step('launch chromium', async () => {
    try {
      browser = await chromium.launch({ ...config.browser?.launchOptions, timeout: 30000 })
    } catch (error) {
      throw transient(error)
    }
  })

  for (const view of views) {
    const page = await step(`open ${view.name} page`, async () => {
      const created = await browser.newPage({
        viewport: { width: view.width, height: view.height },
        deviceScaleFactor: 1,
      })
      created.setDefaultTimeout(30000)
      created.on('pageerror', (error) => {
        console.error(`[pageerror:${view.name}] ${error.message}`)
        defects.push(`pageerror: ${error.message}`)
      })
      created.on('response', (response) => {
        if (response.status() >= 400 && response.url().startsWith(new URL(url).origin)) {
          defects.push(`HTTP ${response.status()}: ${response.url()}`)
        }
      })
      return created
    })

    const response = await step(`navigate ${view.name}`, async () => {
      try {
        return await page.goto(url, { waitUntil: 'load', timeout: 45000 })
      } catch (error) {
        throw transient(error)
      }
    })

    if (!response || !response.ok()) {
      const status = response?.status() ?? 0
      const error = new Error(`HTTP ${status} loading ${url}`)
      if (!response || [408, 429, 500, 502, 503, 504].includes(status)) transient(error)
      throw error
    }

    await step(`wait for render ${view.name}`, async () => {
      try {
        await page.waitForSelector('#app[data-ready="true"]', { state: 'attached', timeout: 20000 })
      } catch (error) {
        throw new Error(`App did not signal ready: ${error.message}`)
      }
      await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 15000 })
      await page.waitForTimeout(400)
    })

    await step(`auto start ${view.name}`, async () => {
      const start = page.locator('[data-auto-start]')
      if (await start.count() && await start.first().isVisible()) {
        await start.first().click({ timeout: 3000 }).catch(() => {})
        console.log(`[capture] ${view.name}: clicked start`)
      } else {
        console.log(`[capture] ${view.name}: already in app`)
      }
      await page.waitForTimeout(1200)
    })

    await step(`screenshot ${view.name}`, async () => {
      try {
        await page.screenshot({
          path: join(output, `final-${view.name}.png`),
          timeout: 30000,
          animations: 'disabled',
        })
      } catch (error) {
        if (error.name === 'TimeoutError' || !browser.isConnected()) transient(error)
        throw error
      }
    })

    await page.close().catch(() => {})
  }

  if (defects.length) {
    throw new Error(`Rendering defects detected:\n${defects.join('\n')}`)
  }
} catch (error) {
  console.error(error?.stack || error)
  if (!error?.exitCode) {
    error.exitCode = TRANSIENT.test(String(error?.message || error)) ? 75 : 1
  }
  exitCode = error.exitCode
} finally {
  await browser?.close().catch((error) => {
    console.error(error)
    if (!exitCode) exitCode = 75
  })
  timing('total', startedAll)
  for (const view of views) {
    const file = join(output, `final-${view.name}.png`)
    if (existsSync(file)) console.log(`[capture] ${view.name}: ${file}`)
  }
}

process.exit(exitCode)
