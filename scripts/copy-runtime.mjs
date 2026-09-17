import { mkdir, copyFile } from 'node:fs/promises'
const files = ['pyodide.js', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json', 'pyodide.mjs']
await mkdir('docs/public/pyodide', { recursive: true })
for (const file of files) await copyFile(`node_modules/pyodide/${file}`, `docs/public/pyodide/${file}`)
