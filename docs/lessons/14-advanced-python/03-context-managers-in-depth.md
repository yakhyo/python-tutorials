---
title: Context Managers in Depth
description: "Write class-based context managers with __enter__ and __exit__, control which exceptions they swallow, manage any number of resources with ExitStack, and use closing, redirect_stdout and nullcontext."
---

# Context Managers in Depth

![Illustration: Context Managers in Depth](/images/topics-webp/context-managers-in-depth.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- The exact **context manager protocol**: what `__enter__` returns and what `__exit__(exc_type, exc, tb)` receives
- How the return value of `__exit__` decides whether an exception is **swallowed** or **propagated**
- How `contextlib.ExitStack` manages a variable number of resources and clean-up callbacks
- When to reach for `closing`, `redirect_stdout` and `nullcontext`
- Why a `@contextmanager` object is **single-use**, and how to design your own managers
:::

## Why it matters

In *The with Statement* you used `with open(...)` and a small `@contextmanager` function. Real programs need a transaction that commits on success and rolls back on error, a timer around a slow step, a setting that must be restored no matter what. Once you know the protocol precisely, any "do, then undo" pair fits in one reliable `with` line.

## The protocol, step by step

`with EXPR as name:` does four things:

1. Evaluates `EXPR` to get the manager.
2. Calls `__enter__()` and binds **its return value** to `name`.
3. Runs the block.
4. Calls `__exit__(exc_type, exc, tb)`: three `None`s after a normal finish, otherwise the exception class, object and traceback.

Here is a class-based `Timer`:

```python
import time

class Timer:
    def __init__(self, label):
        self.label = label
        self.elapsed = None

    def __enter__(self):
        self.start = time.perf_counter()
        return self                      # this becomes `t` below

    def __exit__(self, exc_type, exc, tb):
        self.elapsed = time.perf_counter() - self.start
        print(f"{self.label}: {self.elapsed:.1f} s, error: {exc_type}")

with Timer("load prices") as t:
    time.sleep(0.1)

print("Saved on the object:", round(t.elapsed, 1))
```

```text
load prices: 0.1 s, error: None
Saved on the object: 0.1
```

Returning `self` is the usual choice, but `__enter__` can return anything: `open()` returns the file itself.

## Swallow or propagate

If `__exit__` returns a **true** value, the exception is **swallowed**. `None` or `False` lets it **propagate**. Most managers return nothing, so errors continue upwards.

This `Transaction` works on a copy of the accounts, commits on success, rolls back on error, and swallows only `ValueError`:

![Diagram: Context Manager Lifecycle](/images/companions-webp/context-manager-lifecycle.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

```python
class Transaction:
    def __init__(self, accounts):
        self.accounts = accounts

    def __enter__(self):
        self.draft = dict(self.accounts)
        return self.draft

    def __exit__(self, exc_type, exc, tb):
        if exc_type is None:
            self.accounts.update(self.draft)
            print("commit")
            return False
        print(f"rollback: {exc}")
        return issubclass(exc_type, ValueError)   # True swallows it

accounts = {"Aziza": 500_000, "Bobur": 100_000}

with Transaction(accounts) as draft:
    draft["Aziza"] -= 200_000
    draft["Bobur"] += 200_000
print(accounts)

with Transaction(accounts) as draft:
    draft["Bobur"] -= 900_000
    if draft["Bobur"] < 0:
        raise ValueError("not enough money")
print(accounts)

try:
    with Transaction(accounts) as draft:
        draft["Dilnoza"] += 1
except KeyError as e:
    print("still raised:", repr(e))
```

```text
commit
{'Aziza': 300000, 'Bobur': 300000}
rollback: not enough money
{'Aziza': 300000, 'Bobur': 300000}
rollback: 'Dilnoza'
still raised: KeyError('Dilnoza')
```

The `ValueError` was swallowed; the `KeyError` reached the `try`.

### When `__enter__` raises

If `__enter__` raises, the block never runs and **`__exit__` is not called**. Any clean-up for a half-finished setup must happen inside `__enter__`:

```python
import os

class ChangeDirectory:
    def __init__(self, path):
        self.path = path

    def __enter__(self):
        self.old = os.getcwd()
        os.chdir(self.path)              # may raise
        return self.path

    def __exit__(self, exc_type, exc, tb):
        os.chdir(self.old)
        print("back in the old folder")

os.makedirs("reports", exist_ok=True)
with ChangeDirectory("reports"):
    print("inside:", os.path.basename(os.getcwd()))

try:
    with ChangeDirectory("no_such_folder"):
        print("never printed")
except FileNotFoundError:
    print("__enter__ failed, __exit__ skipped")
```

```text
inside: reports
back in the old folder
__enter__ failed, __exit__ skipped
```

## `ExitStack`: any number of resources

Commas in one `with` need a fixed count. When the list of files comes from data, use `contextlib.ExitStack`. `enter_context(cm)` enters a manager and remembers it; at the end everything is closed in reverse order, even if opening the third file fails. `callback(func, *args)` registers any function as clean-up:

```python
from contextlib import ExitStack

cities = ["tashkent", "samarkand", "bukhara"]

with ExitStack() as stack:
    files = [stack.enter_context(open(f"{c}.txt", "w", encoding="utf-8")) for c in cities]
    stack.callback(print, "all files closed")
    for city, f in zip(cities, files):
        f.write(f"report for {city.title()}\n")
    print("open files:", len(files))

print("closed:", all(f.closed for f in files))
```

```text
open files: 3
all files closed
closed: True
```

The callback ran first because it was registered last.

## Handy managers in `contextlib`

You already know `suppress`. Three more:

- `closing(obj)` calls `obj.close()` at the end, for objects with `close()` but no `with` support.
- `redirect_stdout(target)` sends `print` output elsewhere, such as an `io.StringIO`.
- `nullcontext(value)` does nothing: a stand-in when a manager is optional.

```python
import io
from contextlib import closing, nullcontext, redirect_stdout

class Connection:
    def close(self):
        print("connection closed")

with closing(Connection()):
    print("sending data")

buffer = io.StringIO()
with redirect_stdout(buffer):
    print("Samsa: 8,000 som")
print("captured:", buffer.getvalue().strip())

def report(lock=None):
    with lock if lock is not None else nullcontext():
        print("report written")

report()
```

```text
sending data
connection closed
captured: Samsa: 8,000 som
report written
```

## Single-use, reusable and reentrant

A **reusable** manager works in several `with` statements one after another; a **reentrant** one even works inside itself (`suppress`, `redirect_stdout`, `threading.RLock`). A `@contextmanager` object wraps one generator, which runs only once, so it is **single-use**. Call the function again for each `with`:

```py
from contextlib import contextmanager

@contextmanager
def tag(name):
    print(f"<{name}>")
    yield
    print(f"</{name}>")

bold = tag("b")
with bold:
    print("Plov")
with bold:          # second use of the same object
    print("Lagman")
```

```text
AttributeError: '_GeneratorContextManager' object has no attribute 'args'
```

A generator that finishes without reaching `yield`, for example when `yield` sits inside a false `if`, raises `RuntimeError: generator didn't yield`. Every path must `yield` exactly once.

## `async with`

Code that waits on the network uses **asynchronous** managers with `__aenter__` and `__aexit__`, entered with `async with`. `contextlib.asynccontextmanager` builds one from an `async def` generator, just like `@contextmanager`. You will meet them in *Async and await*.

## Context managers as a design tool

Any "change, then undo" pair fits a manager: a temporary setting, an indent level, a lock (`with lock:` on a `threading.Lock` acquires and always releases it):

```python
from contextlib import contextmanager

settings = {"currency": "som", "debug": False}

@contextmanager
def temporary_setting(key, value):
    old = settings[key]
    settings[key] = value
    try:
        yield
    finally:
        settings[key] = old

with temporary_setting("debug", True):
    print("inside:", settings["debug"])
print("after:", settings["debug"])
```

```text
inside: True
after: False
```

## Try it

Make the transaction swallow `KeyError` too, or raise an error before the commit and watch the balances.

<ClientOnly><PythonPlayground :code='"class Transaction:\n    def __init__(self, accounts):\n        self.accounts = accounts\n\n    def __enter__(self):\n        self.draft = dict(self.accounts)\n        return self.draft\n\n    def __exit__(self, exc_type, exc, tb):\n        if exc_type is None:\n            self.accounts.update(self.draft)\n            print(\"commit\")\n            return False\n        print(\"rollback:\", exc)\n        return issubclass(exc_type, ValueError)\n\naccounts = {\"Jasur\": 250000, \"Dilnoza\": 80000}\n\nwith Transaction(accounts) as draft:\n    draft[\"Jasur\"] -= 50000\n    draft[\"Dilnoza\"] += 50000\nprint(accounts)\n\nwith Transaction(accounts) as draft:\n    draft[\"Dilnoza\"] -= 500000\n    if draft[\"Dilnoza\"] < 0:\n        raise ValueError(\"not enough money\")\nprint(accounts)"' /></ClientOnly>

## Common mistakes

### 1. Forgetting to return `self` from `__enter__`

```py
class Timer:
    def __enter__(self):
        self.start = 0          # no return, so it returns None

    def __exit__(self, exc_type, exc, tb):
        pass

with Timer() as t:
    print(t.start)
```

```text
AttributeError: 'NoneType' object has no attribute 'start'
```

**Fix:** end `__enter__` with `return self` (or whatever object the block should use).

### 2. An `__exit__` that returns `True` by accident

```python
class Quiet:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        print("cleaning up")
        return True               # Bad: hides every error

with Quiet():
    total = 150_000 / 0
print("looks fine, but the total was never computed")
```

```text
cleaning up
looks fine, but the total was never computed
```

**Fix:** return nothing from `__exit__` unless you check `exc_type` and swallow one specific exception on purpose.

### 3. Clean-up code that raises

```py
class Upload:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        self.connection.close()   # there is no self.connection

with Upload():
    raise ValueError("file too big")
```

```text
Traceback (most recent call last):
ValueError: file too big

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
AttributeError: 'Upload' object has no attribute 'connection'
```

The clean-up error replaces the real one; the `ValueError` survives only as context. **Fix:** keep `__exit__` simple, and guard anything in it that may fail.

### 4. `@contextmanager` without `try`/`finally`

```python
from contextlib import contextmanager

settings = {"debug": False}

@contextmanager
def debug_on():
    settings["debug"] = True
    yield                         # Bad: no try/finally
    settings["debug"] = False

try:
    with debug_on():
        raise ValueError("bad input")
except ValueError:
    pass
print("debug:", settings["debug"])
```

```text
debug: True
```

The error is raised at the `yield`, so the line after it never runs. **Fix:** wrap `yield` in `try`/`finally`, as `temporary_setting` does.

## Practice

### 1. A `Timer` class <Difficulty level="1" />

Write a `Timer` class whose `__enter__` returns the timer and whose `__exit__` stores `elapsed`. Time `sum(range(100_000))`, print the total, and print whether `elapsed` is a non-negative float (the value itself changes every run).

::: details Solution
```python
import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc, tb):
        self.elapsed = time.perf_counter() - self.start

with Timer() as t:
    total = sum(range(100_000))

print(total)
print(isinstance(t.elapsed, float) and t.elapsed >= 0)
```

```text
4999950000
True
```
:::

### 2. Nested sections <Difficulty level="1" />

Write a class `Section` that, on enter, prints its title indented by a class-level `depth` and adds one to `depth`; on exit it subtracts one. Nest `Report`, `Tashkent` and `Sales`, and print an amount inside.

::: details Solution
```python
class Section:
    depth = 0

    def __init__(self, title):
        self.title = title

    def __enter__(self):
        print("  " * Section.depth + self.title)
        Section.depth += 1
        return self

    def __exit__(self, exc_type, exc, tb):
        Section.depth -= 1

with Section("Report"):
    with Section("Tashkent"):
        with Section("Sales"):
            print("  " * Section.depth + "1,200,000 som")
```

```text
Report
  Tashkent
    Sales
      1,200,000 som
```
:::

### 3. `temporary_attr` <Difficulty level="2" />

Write a `@contextmanager` function `temporary_attr(obj, name, value)` that sets an attribute and restores the old value on exit, even when the block raises. Test it on a `Shop` with `discount = 0`: inside, print the discount (15) and raise `ValueError`; then print the error and the discount.

::: details Solution
```python
from contextlib import contextmanager

@contextmanager
def temporary_attr(obj, name, value):
    old = getattr(obj, name)
    setattr(obj, name, value)
    try:
        yield obj
    finally:
        setattr(obj, name, old)

class Shop:
    discount = 0

shop = Shop()
try:
    with temporary_attr(shop, "discount", 15):
        print("during sale:", shop.discount)
        raise ValueError("register crashed")
except ValueError as e:
    print("error:", e)
print("after sale:", shop.discount)
```

```text
during sale: 15
error: register crashed
after sale: 0
```
:::

### 4. Write to many files <Difficulty level="2" />

Given `names = ["aziza.txt", "bobur.txt", "jasur.txt"]`, use `ExitStack` to open all of them for writing and write `Exam on Monday` to each. Register a callback that prints `closed N files`, then print the contents of each file.

::: details Solution
```python
from contextlib import ExitStack
from pathlib import Path

names = ["aziza.txt", "bobur.txt", "jasur.txt"]

with ExitStack() as stack:
    files = [stack.enter_context(open(n, "w", encoding="utf-8")) for n in names]
    stack.callback(print, f"closed {len(files)} files")
    for f in files:
        f.write("Exam on Monday\n")

for n in names:
    print(n, "->", Path(n).read_text(encoding="utf-8").strip())
```

```text
closed 3 files
aziza.txt -> Exam on Monday
bobur.txt -> Exam on Monday
jasur.txt -> Exam on Monday
```
:::

### 5. Suppress and log <Difficulty level="3" />

Write a class `ErrorLog` that takes exception types, swallows only those, and records each one as `"TypeName: message"` in a `records` list. Other exceptions must propagate. Reuse **one** `ErrorLog` object for three blocks: `int("abc")`, `{}["plov"]`, and `1 / 0` (not in the list). Print the error that escaped, then the records.

::: details Solution
```python
class ErrorLog:
    def __init__(self, *types):
        self.types = types
        self.records = []

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        if exc_type is not None and issubclass(exc_type, self.types):
            self.records.append(f"{exc_type.__name__}: {exc}")
            return True
        return False

log = ErrorLog(ValueError, KeyError)

with log:
    int("abc")
with log:
    {}["plov"]
try:
    with log:
        1 / 0
except ZeroDivisionError as e:
    print("escaped:", e)

for record in log.records:
    print(record)
```

```text
escaped: division by zero
ValueError: invalid literal for int() with base 10: 'abc'
KeyError: 'plov'
```

`issubclass` accepts a tuple of classes. This class keeps no per-block state, so it is reusable, unlike a `@contextmanager` object.
:::

## Recap

- `with` binds the **return value of `__enter__`**, then calls `__exit__(exc_type, exc, tb)` however the block ends.
- A true return from `__exit__` **swallows** the exception; `None`/`False` lets it **propagate**. If `__enter__` raises, `__exit__` never runs.
- `ExitStack` enters any number of managers and callbacks and closes them in reverse order.
- `closing`, `redirect_stdout` and `nullcontext` cover objects without `with` support, captured output and optional managers.
- A `@contextmanager` object is single-use; put its `yield` inside `try`/`finally`.
- Package any "change, then undo" pair, such as settings and locks, as a manager.

## Further reading

- [`contextlib`: utilities for with-statement contexts](https://docs.python.org/3/library/contextlib.html)
- [Data model: With statement context managers](https://docs.python.org/3/reference/datamodel.html#context-managers)
- [PEP 343: The "with" Statement](https://peps.python.org/pep-0343/)
