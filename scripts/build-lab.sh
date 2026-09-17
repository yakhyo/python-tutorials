#!/usr/bin/env bash
# Build the Python Lab (JupyterLite + Pyodide kernel) into docs/public/lab,
# so both `npm run dev` and `npm run build` serve it at /lab/.
# Requires Python 3.10+. Installs the JupyterLite tools into a local virtual
# environment (build/lab-venv), so your system Python is not changed.
set -euo pipefail
cd "$(dirname "$0")/.."

PYTHON="${PYTHON:-python3}"
VENV="build/lab-venv"
if [ ! -x "$VENV/bin/jupyter" ]; then
  echo "Setting up JupyterLite tools in $VENV ..."
  "$PYTHON" -m venv "$VENV"
  "$VENV/bin/python" -m pip install --quiet --upgrade pip
  "$VENV/bin/python" -m pip install --quiet "jupyterlite-core==0.8.*" "jupyterlite-pyodide-kernel==0.8.*" jupyter-server
fi

rm -rf build/notebooks docs/public/lab
"$VENV/bin/python" scripts/make-notebooks.py build/notebooks
(cd build && "../$VENV/bin/jupyter" lite build --contents "$PWD/notebooks" --output-dir "$PWD/../docs/public/lab" --lite-dir "$PWD/lite")
echo "Python Lab built in docs/public/lab"
