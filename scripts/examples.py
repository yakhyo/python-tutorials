"""Run every ```python block in the lessons and report failures.

Usage: python3 scripts/examples.py [--twice] [paths...]
  paths   Markdown files or directories to check (default: docs/).
  --twice Run every block a second time in the same directory, to catch examples
          whose shown output is only true on a fresh file system (the browser
          runner keeps virtual files between runs).

Environment:
  PYTHON  Interpreter used for the examples (default: python3.14 if present, else python3).
          The course targets Python 3.14, so run the checker with 3.14.
"""
from pathlib import Path
import re, subprocess, tempfile, json, sys, os, shutil, concurrent.futures
from collections import Counter

root = Path(__file__).resolve().parents[1]
PYTHON = os.environ.get('PYTHON') or (shutil.which('python3.14') or 'python3')
# Modules that need a network, a real OS, or a local setup: parsed but not executed.
local_modules = {'socket', 'multiprocessing', 'threading', 'concurrent', 'asyncio', 'aiohttp', 'requests',
                 'pymysql', 'flask', 'fastapi', 'main', 'mymodule', 'calculator', 'my_module', 'httpx', 'pydantic'}
# Packages Pyodide ships: executed when installed in the checking interpreter, otherwise skipped.
optional_modules = {'numpy', 'pandas', 'matplotlib', 'pytest'}


def available(module):
    return subprocess.run([PYTHON, '-c', f'import {module}'], capture_output=True).returncode == 0


installed = {m for m in optional_modules if available(m)}
twice = '--twice' in sys.argv
targets = [Path(a).resolve() for a in sys.argv[1:] if not a.startswith('--')] or [root / 'docs']
files = sorted({f for t in targets for f in ([t] if t.is_file() else t.rglob('*.md'))})


PARSER = (
    "import ast, sys, json\n"
    "try:\n"
    "    tree = ast.parse(sys.stdin.read())\n"
    "except SyntaxError as e:\n"
    "    print(json.dumps({'error': str(e)}))\n"
    "else:\n"
    "    names = {a.name.split('.')[0] for n in ast.walk(tree) if isinstance(n, ast.Import) for a in n.names}\n"
    "    names |= {(n.module or '').split('.')[0] for n in ast.walk(tree) if isinstance(n, ast.ImportFrom)}\n"
    "    print(json.dumps({'imports': sorted(names)}))\n"
)


def parse_with_target(code):
    """Parse with the target interpreter (syntax such as the `type` statement needs 3.12+)."""
    proc = subprocess.run([PYTHON, '-c', PARSER], input=code, text=True, capture_output=True)
    data = json.loads(proc.stdout or '{}')
    if 'error' in data:
        return False, data['error']
    return True, data.get('imports', [])


def check(p):
    result = []; context = []
    with tempfile.TemporaryDirectory() as d:
        env = dict(os.environ, MPLBACKEND='Agg', PYTHONHASHSEED='0')
        for i, code in enumerate(re.findall(r'```python\n(.*?)\n```', p.read_text(), re.S), 1):
            item = {'file': str(p.relative_to(root / 'docs')), 'block': i}
            ok, detail = parse_with_target(code)
            if not ok:
                item.update(status='syntax-error', detail=detail); result.append(item); continue
            imports = set(detail)
            skip = imports & local_modules | (imports & optional_modules - installed)
            if '# non-runnable' in code or skip:
                item.update(status='local-setup', detail=', '.join(sorted(skip)) or 'source-declared setup'); result.append(item); continue
            inputs = 'Aziza\n20\n' if p.stem == 'input' and i == 1 else '7\n5\n3\n2\n1\n0\nquit\n'

            def run(c):
                try:
                    proc = subprocess.run([PYTHON, '-c', c], input=inputs, text=True, capture_output=True, cwd=d, timeout=20, env=env)
                    return proc.returncode, proc.stderr[-1200:], proc.stdout[-1000:]
                except subprocess.TimeoutExpired:
                    return 124, 'timeout', ''

            rc, err, out = run(code)
            if rc and ('NameError' in err or 'UnboundLocalError' in err):
                rc, err, out = run('\n\n'.join(context[-8:] + [code])); mode = 'context'
            else:
                mode = 'standalone'
            if rc == 0 and twice:
                rc2, err2, out2 = run(code if mode == 'standalone' else '\n\n'.join(context[-8:] + [code]))
                if rc2:
                    rc, err = rc2, 'second run failed: ' + err2
                elif out2 != out:
                    item['rerun'] = 'output differs on second run'
            item.update(status=mode if rc == 0 else 'failed', detail=err if rc else '', output=out)
            if rc == 0:
                context.append(code)
            result.append(item)
    return result


with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = [x for group in pool.map(check, files) for x in group]

print('interpreter:', PYTHON, '| optional packages available:', ', '.join(sorted(installed)) or 'none')
print(Counter(x['status'] for x in results))
for x in results:
    if x['status'] in ['failed', 'syntax-error']:
        print(x['file'], x['block'], x['detail'][-500:])
    if x.get('rerun'):
        print(x['file'], x['block'], 'NOTE:', x['rerun'])

if any(x['status'] in ['failed', 'syntax-error'] for x in results):
    raise SystemExit(1)
