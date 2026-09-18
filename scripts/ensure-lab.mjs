// Runs before `npm run dev` and `npm run build`.
// Builds the Python Lab once if docs/public/lab is missing. If that is not possible
// (for example Python is not installed), prints a hint and lets the site start anyway.
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

if (process.env.SKIP_LAB === '1' || existsSync('docs/public/lab/index.html')) process.exit(0)

console.log('\nPython Lab not found in docs/public/lab. Building it now (first time only, about a minute)...\n')
const result = spawnSync('bash', ['scripts/build-lab.sh'], { stdio: 'inherit' })
if (result.status !== 0) {
 console.warn('\n[python-lab] Could not build the Python Lab. The site will still work, but /lab/ will not open.')
 console.warn('[python-lab] Install Python 3.10+ and run: npm run build:lab\n')
}
