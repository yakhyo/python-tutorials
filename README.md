# Python Tutorials

A Python course in **English** and **Uzbek**, from your first `print()` to decorators and async. Examples run in the browser, exercises are checked on the page, and nothing needs to be installed.

**Live site:** [yakhyo.github.io/python-tutorials](https://yakhyo.github.io/python-tutorials/) (opens in Uzbek) · [English version](https://yakhyo.github.io/python-tutorials/en/)

> Pythonni noldan örganmoqçimisiz? Kurs töliq özbek tilida ham bor: [özbekça versiya](https://yakhyo.github.io/python-tutorials/uz/).

## What's inside

82 lessons in 14 modules, written for Python 3.14. Every lesson has runnable examples, common mistakes with real error output, and five practice tasks: exercises with solutions in the concept lessons, challenges with hints in the seven projects. Every module ends with a quiz.

| Part | Modules |
| --- | --- |
| **Foundations** | [Getting Started](docs/en/lessons/01-getting-started) · [Values and Variables](docs/en/lessons/02-values-and-variables) · [Decisions](docs/en/lessons/03-making-decisions) · [Loops](docs/en/lessons/04-loops) · [Collections](docs/en/lessons/05-collections) · [Functions](docs/en/lessons/06-functions) |
| **Real Programs** | [Standard Library](docs/en/lessons/07-modules-and-the-standard-library) · [Errors and Files](docs/en/lessons/08-errors-and-files) · [Classes](docs/en/lessons/09-classes-and-objects) · [Object-Oriented Design](docs/en/lessons/10-object-oriented-design) · [Testing](docs/en/lessons/11-testing-and-debugging) · [Generators and Regex](docs/en/lessons/12-going-further) · [Data with pandas](docs/en/lessons/13-working-with-data) *(optional)* |
| **Advanced** *(optional)* | [Decorators, the data model, context managers, async, performance, design patterns and concurrency](docs/en/lessons/14-advanced-python) |

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

Add the lesson to `docs/.vitepress/course.json`, and its Uzbek title and group to `docs/.vitepress/course-uz.json` with the same slug and at the same position, then run `python3 scripts/organize-lessons.py` to place the file. Use `docs/en/lessons/05-collections/04-dictionaries.md` as the reference lesson, and mirror every change in the Uzbek lesson under `docs/uz/lessons/`.

## Deployment

Work happens on `dev`. CI runs on every push to `dev` and on pull requests into `main`. Deploys and releases to GitHub Pages run manually from the Actions tab.

## License

[MIT](LICENSE) © 2026 Yakhyokhuja Valikhujaev
