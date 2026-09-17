# Python Tutorials

A free Python course in **English** and **Uzbek**, from your first `print()` to decorators and async. Examples run in the browser, exercises are checked on the page, and nothing needs to be installed.

**Live site:** [yakhyo.github.io/python-tutorials](https://yakhyo.github.io/python-tutorials/) · [Uzbek version](https://yakhyo.github.io/python-tutorials/uz/)

> Pythonni noldan örganmoqçimisiz? Kurs toʻliq özbek tilida ham bor: [özbekça versiya](https://yakhyo.github.io/python-tutorials/uz/).

## What's inside

82 lessons in 14 modules, written for Python 3.14. Every lesson has runnable examples, common mistakes with real error output, and five exercises with solutions. Every module ends with a quiz.

| Part | Modules |
| --- | --- |
| **Foundations** | [Getting Started](docs/lessons/01-getting-started) · [Values and Variables](docs/lessons/02-values-and-variables) · [Decisions](docs/lessons/03-making-decisions) · [Loops](docs/lessons/04-loops) · [Collections](docs/lessons/05-collections) · [Functions](docs/lessons/06-functions) |
| **Real Programs** | [Standard Library](docs/lessons/07-modules-and-the-standard-library) · [Errors and Files](docs/lessons/08-errors-and-files) · [Classes](docs/lessons/09-classes-and-objects) · [Object-Oriented Design](docs/lessons/10-object-oriented-design) · [Testing](docs/lessons/11-testing-and-debugging) · [Generators and Regex](docs/lessons/12-going-further) · [Data with pandas](docs/lessons/13-working-with-data) *(optional)* |
| **Advanced** *(optional)* | [Decorators, the data model, context managers, async, performance, design patterns and concurrency](docs/lessons/14-advanced-python) |

Seven guided projects along the way: a number guessing game, quiz game, expense tracker, library system, text analyzer, sales report and log pipeline.

The course is complete in both languages. Corrections from a full technical review are in progress.

## Run locally

Requires Node.js 22+ (and Python 3.10+ for the Python Lab).

```sh
npm ci
npm run dev       # http://127.0.0.1:5173
npm run build     # build the static site into dist/
```

Set `SKIP_LAB=1` to skip building the JupyterLite lab.

## Check changes

```sh
python3 scripts/examples.py --twice   # run every code example with Python 3.14
python3 scripts/lint.py              # check lessons against the template
```

## Contributing lessons

Add the lesson to `docs/.vitepress/course.json`, then run `python3 scripts/organize-lessons.py` to place the file. Use `docs/lessons/05-collections/04-dictionaries.md` as the reference lesson, and mirror every change in the Uzbek lesson under `docs/uz/darslar/`.

## Deployment

Work happens on `dev`. CI runs on pull requests into `dev`. Deploys and releases to GitHub Pages run manually from the Actions tab.

## License

[MIT](LICENSE) © 2026 Yakhyokhuja Valikhujaev
