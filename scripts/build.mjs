import { cpSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const source = resolve(root, 'src')
const output = resolve(root, 'dist')

const started = performance.now()

if (!existsSync(resolve(source, 'index.html'))) {
  throw new Error(`Missing source entrypoint: ${resolve(source, 'index.html')}`)
}

rmSync(output, { recursive: true, force: true })
mkdirSync(output, { recursive: true })
cpSync(source, output, { recursive: true })

const entry = resolve(output, 'index.html')
if (!statSync(entry).size) throw new Error('Built index.html is empty.')

console.log(`[build] ${entry}`)
console.log(`[build] completed in ${Math.round(performance.now() - started)}ms`)
