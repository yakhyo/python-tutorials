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

// input(): the page cannot block while the learner types, so a run that reaches a question with
// no answer left stops there (_PythonUzNeedInput) and reports the question. The editor then runs
// the program again from the start with every answer given so far. To make that second run follow
// the same path, each run of one session gets the same random seed and starts from the same files:
// the working directory is saved on the first run and put back before every replay.
const INPUT_SETUP = `
import builtins, os, random, shutil, sys
class _PythonUzNeedInput(BaseException):
    pass
_python_uz_input = {"prompt": None}
_python_uz_saved = {"dirs": [], "files": {}}
def _python_uz_save(home):
    dirs, files = [], {}
    for folder, _, names in os.walk(home):
        dirs.append(folder)
        for name in names:
            path = os.path.join(folder, name)
            try:
                with open(path, "rb") as file:
                    files[path] = file.read()
            except OSError:
                pass
    _python_uz_saved.update(dirs=dirs, files=files)
def _python_uz_restore(home):
    for name in os.listdir(home):
        path = os.path.join(home, name)
        if os.path.isdir(path) and not os.path.islink(path):
            shutil.rmtree(path, ignore_errors=True)
        else:
            os.remove(path)
    for folder in _python_uz_saved["dirs"]:
        os.makedirs(folder, exist_ok=True)
    for path, data in _python_uz_saved["files"].items():
        with open(path, "wb") as file:
            file.write(data)
def _python_uz_begin(answers, seed, replay):
    answers = [str(answer) for answer in answers]
    position = 0
    _python_uz_input["prompt"] = None
    def input(prompt=""):
        nonlocal position
        prompt = str(prompt)
        if position < len(answers):
            answer = answers[position]
            position += 1
            sys.stdout.write(f"{prompt}{answer}\\n")
            return answer
        sys.stdout.flush()
        _python_uz_input["prompt"] = prompt
        raise _PythonUzNeedInput(prompt)
    builtins.input = input
    random.seed(seed)
    home = os.getcwd()
    if replay:
        _python_uz_restore(home)
    else:
        _python_uz_save(home)
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
  let length = 0;
  const emit = line => { length += line.length; if (length > 20000) throw new Error('Output too large (20,000 characters).'); chunks.push(line) };
  runtime.setStdout({ batched: emit }); runtime.setStderr({ batched: emit });
  runtime.setStdin({ stdin: () => undefined });
  // Each run gets fresh globals, but the interpreter (and sys.modules) lives on. Undo the
  // process-wide state a previous run may have left behind so examples behave like a fresh script.
  await runtime.runPythonAsync(RESET_STATE);
  if (!runtime.globals.has('_python_uz_begin')) await runtime.runPythonAsync(INPUT_SETUP);
  const begin = runtime.globals.get('_python_uz_begin');
  try { begin(data.inputs || [], data.seed ?? 0, Boolean(data.replay)) } finally { begin.destroy() }
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
  // Stopped at input(): hand the question to the page instead of reporting an error.
  let prompt;
  try { prompt = runtime?.runPython('_python_uz_input["prompt"]') } catch { /* the runtime did not start */ }
  if (typeof prompt === 'string') { self.postMessage({ type: 'input', id: data.id, text: before, prompt }); return }
  self.postMessage({ type: 'error', id: data.id, text: (before ? before + '\n' : '') + cleanTraceback(error) });
 }
 finally { namespace?.destroy(); }
};
