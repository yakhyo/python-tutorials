---
title: Python Lab
description: "A full Jupyter notebook environment in your browser, with practice notebooks for every module."
---

# Python Lab

The Python Lab is a complete **notebook environment** that runs entirely in your browser. It uses [JupyterLite](https://jupyterlite.readthedocs.io/) with a Python kernel powered by Pyodide, so there is nothing to install.

<div class="lab-actions">

[Open the Python Lab](/lab/lab/index.html?path=00-start-here.ipynb){.lab-button target="_blank" rel="noopener"}

</div>

## What's inside

- **00-start-here.ipynb**: a short introduction to notebooks.
- **One practice notebook per module**: every exercise from the lessons, in English and Uzbek, each with an empty code cell for your answer. Solutions stay in the lessons, so try first and check afterwards.
- A file browser, so you can create your own notebooks, text files, and CSV files.

## Playground or Lab?

| | Playground and lesson editors | Python Lab |
|---|---|---|
| Best for | Running one example or checking an exercise | Longer practice sessions and experiments |
| Code runs | The whole editor, top to bottom | Cell by cell, keeping variables between cells |
| Files | Temporary | Saved in your browser, can be downloaded |
| Opens | Right on the page | In a new tab |

## Using notebooks

1. Open a notebook from the file browser on the left.
2. Click a code cell, write your code, and press **Shift + Enter** to run it.
3. Variables stay available in later cells, so run cells **in order** from the top.
4. If things get confusing, use **Kernel → Restart Kernel and Clear Outputs** and run again from the top.

::: warning Keep your work
Notebooks are stored in **this browser only**. Clearing site data or switching browsers removes them. Use **File → Download** to save important notebooks to your computer.
:::

## Limits

- The first start downloads Python, which can take a little while.
- Packages that Pyodide supports (like numpy, pandas, and matplotlib) work. Many others don't.
- Network access from Python code is limited by browser security rules.
- For big projects, install Python on your computer (see *Installing Python*).
