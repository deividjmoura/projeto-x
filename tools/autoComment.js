#!/usr/bin/env node
/**
 * tools/autoComment.js
 * - Varre o projeto procurando arquivos de código e insere um cabeçalho
 *   de comentário explicativo quando não houver um.
 * - Projetado para ser seguro: evita duplicar cabeçalhos existentes
 *   e respeita diretivas como `"use client"` ou `"use strict"` no topo.
 *
 * Uso: `node tools/autoComment.js` ou `npm run autocomment`
 */
import fs from 'fs/promises'
import path from 'path'

const ROOT = process.cwd()
const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html'])

function isCodeFile(file) {
  return EXTENSIONS.has(path.extname(file).toLowerCase())
}

function generateHeader(relPath, ext) {
  const fileLabel = `File: ${relPath}`
  if (ext === '.html') {
    return `<!--\n  ${fileLabel}\n  - Cabeçalho automático: descreve o propósito do arquivo\n-->\n\n`
  }
  // For JS/TS/CSS family use block comment
  return `/*\n  ${fileLabel}\n  - Cabeçalho automático: descreve o propósito do arquivo\n*/\n\n`
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const res = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue
      files.push(...(await walk(res)))
    } else if (e.isFile() && isCodeFile(res)) {
      files.push(res)
    }
  }
  return files
}

function hasHeader(content) {
  // Look at the first few non-empty lines for a comment or shebang
  const lines = content.split(/\r?\n/).slice(0, 8).map(l => l.trim())
  for (const l of lines) {
    if (!l) continue
    if (l.startsWith('<!--') || l.startsWith('/*') || l.startsWith('//') || l.startsWith('#!')) return true
    // keep directives like "use client"/"use strict" as not-a-header
    return false
  }
  return false
}

async function processFile(file) {
  const rel = path.relative(ROOT, file)
  const ext = path.extname(file).toLowerCase()
  try {
    const raw = await fs.readFile(file, 'utf8')
    if (hasHeader(raw)) return { file: rel, changed: false }

    // Respect top directives like "use client" or shebang
    const lines = raw.split(/\r?\n/)
    let insertAt = 0
    // shebang: keep it at top and insert after
    if (lines[0] && lines[0].startsWith('#!')) insertAt = 1
    // directive ("use client" / "use strict")
    const firstNonEmpty = lines.find(l => l.trim() !== '') || ''
    if (/^("|')use (client|strict)("|')/.test(firstNonEmpty.trim())) {
      // find index of that line
      const idx = lines.findIndex(l => l.trim() !== '')
      insertAt = Math.max(insertAt, idx + 1)
    }

    const header = generateHeader(rel, ext)

    // For HTML: prefer after DOCTYPE if present
    if (ext === '.html') {
      if (lines[0] && lines[0].toLowerCase().startsWith('<!doctype')) {
        insertAt = Math.max(insertAt, 1)
      }
    }

    lines.splice(insertAt, 0, header)
    const out = lines.join('\n')
    await fs.writeFile(file, out, 'utf8')
    return { file: rel, changed: true }
  } catch (err) {
    return { file: rel, changed: false, error: String(err) }
  }
}

async function main() {
  const files = await walk(ROOT)
  const results = []
  for (const f of files) {
    results.push(await processFile(f))
  }
  const changed = results.filter(r => r.changed)
  console.log(`Scanned ${results.length} files, updated ${changed.length} files.`)
  for (const c of changed) console.log(' +', c.file)
  const errors = results.filter(r => r.error)
  if (errors.length) {
    console.error('Errors:')
    for (const e of errors) console.error('-', e.file, e.error)
    process.exit(2)
  }
}

if (process.argv.includes('--dry')) {
  console.log('Dry run mode: no files will be modified')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
