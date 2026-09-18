// Runs learner code with Pyodide in a Web Worker.
// Standard library comes from the local /pyodide/ copy. Extra packages that Pyodide
// ships (numpy, pandas, matplotlib, ...) are downloaded on demand from the matching CDN build.
const PACKAGE_CDN = 'https://cdn.jsdelivr.net/pyodide/v314.0.0/full/';

// Replaces plt.show() so figures are captured as PNG images instead of opening a window.
const MATPLOTLIB_SETUP = `
import io, base64, os
os.environ["MPLBACKEND"] = "AGG"
import matplotlib
matplotlib.use("AGG")
import matplotlib.pyplot as _plt
__python_uz_images__ = []
def _python_uz_show(*args, **kwargs):
    for number in _plt.get_fignums():
        figure = _plt.figure(number)
        buffer = io.BytesIO()
        figure.savefig(buffer, format="png", bbox_inches="tight", dpi=100)
        __python_uz_images__.append(base64.b64encode(buffer.getvalue()).decode("ascii"))
    _plt.close("all")
_plt.show = _python_uz_show
`;

// State that survives between runs because the interpreter is reused: logging configuration
// (so a second logging.basicConfig() call would otherwise do nothing), warning filters and
// "already shown" warning registries, and the current directory.
const RESET_STATE = `
import logging, warnings, sys, os
def _python_uz_reset():
    for handler in list(logging.root.handlers):
        logging.root.removeHandler(handler)
    logging.root.setLevel(logging.WARNING)
    logging.disable(logging.NOTSET)
    for logger in list(logging.Logger.manager.loggerDict.values()):
        if isinstance(logger, logging.Logger):
            logger.handlers.clear(); logger.setLevel(logging.NOTSET); logger.propagate = True
    warnings.resetwarnings()
    for module in list(sys.modules.values()):
        registry = getattr(module, "__warningregistry__", None)
        if isinstance(registry, dict):
            registry.clear()
    os.chdir(os.environ.setdefault("PYTHON_UZ_HOME", os.getcwd()))
_python_uz_reset()
del _python_uz_reset
`;

// Keep only the learner's part of a Python traceback (drop Pyodide-internal frames).
function cleanTraceback(message) {
 const lines = String(message).replace(/^PythonError:\s*/, '').split('\n');
 const start = lines.findIndex(line => line.includes('File "main.py"') || line.includes('File "<exec>"'));
 if (start === -1) return lines.filter(line => !line.includes('/lib/python') && !line.includes('_pyodide')).join('\n').trim();
 return ['Traceback (most recent call last):', ...lines.slice(start).map(line => line.replace('"<exec>"', '"main.py"'))].join('\n').trim();
}

let runtime;
self.onmessage = async ({ data }) => {
 let namespace, chunks = [];
 try {
  if (!runtime) {
   const { loadPyodide } = await import('./pyodide/pyodide.mjs');
   runtime = await loadPyodide({ indexURL: new URL('./pyodide/', self.location.href).href, packageBaseUrl: PACKAGE_CDN });
  }
  const usesPackages = /^\s*(import|from)\s+(numpy|pandas|matplotlib|pytest)\b/m.test(data.code);
  if (usesPackages) {
   self.postMessage({ type: 'packages' });
   await runtime.loadPackagesFromImports(data.code);
  }
  self.postMessage({ type: 'ready', heavy: usesPackages });
  let length = 0, index = 0;
  const emit = line => { length += line.length; if (length > 20000) throw new Error('Output too large (20,000 characters).'); chunks.push(line) };
  runtime.setStdout({ batched: emit }); runtime.setStderr({ batched: emit });
  runtime.setStdin({ stdin: () => data.inputs[index++] ?? undefined });
  // Each run gets fresh globals, but the interpreter (and sys.modules) lives on. Undo the
  // process-wide state a previous run may have left behind so examples behave like a fresh script.
  await runtime.runPythonAsync(RESET_STATE);
  namespace = runtime.toPy({ __name__: '__main__' });
  const usesMatplotlib = /^\s*(import|from)\s+matplotlib\b/m.test(data.code);
  if (usesMatplotlib) await runtime.runPythonAsync(MATPLOTLIB_SETUP, { globals: namespace });
  await runtime.runPythonAsync(data.code, { globals: namespace, filename: 'main.py' });
  let images = [];
  if (usesMatplotlib) {
   await runtime.runPythonAsync('_python_uz_show()', { globals: namespace });
   const list = namespace.get('__python_uz_images__');
   images = list.toJs(); list.destroy();
  }
  self.postMessage({ type: 'done', id: data.id, text: chunks.join('\n'), images });
 } catch (error) {
  const before = chunks.join('\n');
  self.postMessage({ type: 'error', id: data.id, text: (before ? before + '\n' : '') + cleanTraceback(error) });
 }
 finally { namespace?.destroy(); }
};
