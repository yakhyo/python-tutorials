---
title: Playground
description: "Run Python in your browser: an editor for quick experiments."
---

# Playground

Try out small ideas here. Press **Ctrl + Enter** (Mac: **⌘ + Enter**) to run your code. **Stop** restarts the Python session.

<ClientOnly><PythonPlayground /></ClientOnly>

## Good to know

- Each run starts with fresh variables.
- When your code calls `input()`, the program stops and shows the question in the output. Type your answer there and press Enter.
- Files you create exist only in the browser and disappear when the session restarts.
- The standard library is built in; very long runs are stopped after 15 seconds. There is no network access.
- For longer experiments with notebooks and files, use the [Python Lab](/en/lab).
- Popular data packages (numpy, pandas, matplotlib) load automatically the first time you import them, and `plt.show()` displays charts below the output.
