#!/usr/bin/env node
/**
 * verify-versions — guards against dep-version drift between root and
 * styleguide/ package.json. Sibling Vite projects share React/Tailwind/Vite
 * runtimes; mismatched versions silently produce two parallel React trees,
 * Tailwind plugin mismatches, etc.
 *
 * Run as part of CI (or pre-commit). Fails with non-zero exit on drift.
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const SHARED = [
  'react',
  'react-dom',
  'react-router-dom',
  'tailwindcss',
  '@tailwindcss/vite',
  'vite',
  '@vitejs/plugin-react',
  'vite-plugin-svgr',
  '@floating-ui/react',
  'embla-carousel-react',
]

const TARGETS = [
  { name: 'website',    path: resolve(repoRoot, 'apps/website/package.json') },
  { name: 'styleguide', path: resolve(repoRoot, 'apps/styleguide/package.json') },
]

function loadDeps(target) {
  const pkg = JSON.parse(readFileSync(target.path, 'utf8'))
  return { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
}

const trees = TARGETS.map(t => ({ ...t, deps: loadDeps(t) }))
const drift = []

for (const dep of SHARED) {
  const versions = trees.map(t => ({ name: t.name, version: t.deps[dep] }))
  const present = versions.filter(v => v.version)
  if (present.length < 2) continue
  const unique = new Set(present.map(v => v.version))
  if (unique.size > 1) {
    drift.push({ dep, versions: present })
  }
}

if (drift.length === 0) {
  console.log(`OK — ${SHARED.length} shared deps verified across ${TARGETS.length} package.json files`)
  process.exit(0)
}

console.error('Version drift detected:')
for (const d of drift) {
  console.error(`  ${d.dep}`)
  for (const v of d.versions) {
    console.error(`    ${v.name.padEnd(12)} ${v.version}`)
  }
}
console.error('\nPin shared dep versions identically across all package.json files.')
process.exit(1)
