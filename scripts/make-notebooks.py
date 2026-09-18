"""Generate one practice notebook per module for the Python Lab (JupyterLite).

Each notebook is bilingual: every task appears in English and, under a divider, in
Uzbek. Reads docs/.vitepress/course.json and course-uz.json plus the Practice /
Challenges (Maşqlar / Topşiriqlar) sections of each lesson, and writes Jupyter
notebooks (nbformat 4) with the exercise text and an empty code cell.

Usage: python scripts/make-notebooks.py OUTPUT_DIR
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
LEVELS = {"1": "easy", "2": "medium", "3": "hard"}
LEVELS_UZ = {"1": "oson", "2": "örtaça", "3": "qiyin"}
PRACTICE = r"^## (Practice|Challenges|Maşqlar|Topşiriqlar|Qöşimça topşiriqlar)\s*$(.*?)(?=^## |\Z)"


def markdown_cell(text):
    return {"cell_type": "markdown", "metadata": {}, "source": text.strip() + "\n"}


def code_cell(text):
    return {"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": text}


def clean(text):
    """Turn site-specific Markdown into plain notebook Markdown."""
    text = re.sub(r'\s*<Difficulty level="\d"\s*/>', "", text)
    text = text.replace("<Yes />", "yes").replace("<No />", "no")
    text = re.sub(r"<ClientOnly>.*?</ClientOnly>", "", text, flags=re.S)
    text = re.sub(r"```(py|python)\n", "```python\n", text)
    return text


def exercises(lesson_path):
    """Return (heading, level, task) triples from a lesson's practice sections."""
    if not lesson_path or not lesson_path.exists():
        return []
    text = lesson_path.read_text(encoding="utf-8")
    found = []
    for match in re.finditer(PRACTICE, text, flags=re.M | re.S):
        for part in re.split(r"^### ", match.group(2), flags=re.M)[1:]:
            heading, _, body = part.partition("\n")
            level = re.search(r'<Difficulty level="(\d)"', heading)
            task = body.split("::: details")[0].strip()
            found.append((clean(heading).strip(), level.group(1) if level else None, clean(task)))
    return found


def lesson_file(directory, slug):
    return next(directory.rglob(f"[0-9][0-9]-{slug}.md"), None)


def main(output_dir):
    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)
    course = json.loads((DOCS / ".vitepress" / "course.json").read_text(encoding="utf-8"))
    course_uz = json.loads((DOCS / ".vitepress" / "course-uz.json").read_text(encoding="utf-8"))
    titles_uz = {lesson["slug"]: lesson["title"] for lesson in course_uz}
    groups_uz = {}
    for lesson in course_uz:
        groups_uz.setdefault(lesson["slug"], lesson["group"])

    for group in dict.fromkeys(lesson["group"] for lesson in course):
        lessons = [lesson for lesson in course if lesson["group"] == group]
        number, _, name = group.partition(" · ")
        optional = "(Optional)" in name
        name = name.replace(" (Optional)", "")
        name_uz = groups_uz.get(lessons[0]["slug"], group).partition(" · ")[2].replace(" (ixtiyoriy)", "")

        cells = [markdown_cell(
            f"# Module {number}: {name}\n\n"
            f"## {number}-modul: {name_uz}\n\n"
            + ("This module is optional. / Bu modul ixtiyoriy.\n\n" if optional else "")
            + "Practice exercises from every lesson in this module. "
            "Write your answer in the empty code cell under each task and press **Shift + Enter** to run it. "
            "Solutions are in the lessons on the course website. "
            "Notebooks are saved in this browser only: use **File → Download** to keep a copy.\n\n"
            "Bu moduldagi har bir darsning maşqlari. Javobingizni har bir topşiriq ostidagi böş kod "
            "katakçasiga yozing va işga tuşiriş uçun **Shift + Enter** ni bosing. Yeçimlar sayttagi "
            "darslarda. Daftarlar faqat şu brauzerda saqlanadi: nusxa saqlaş uçun **File → Download**."
        )]

        for lesson in lessons:
            en = exercises(lesson_file(DOCS / "lessons", lesson["slug"]))
            uz = exercises(lesson_file(DOCS / "uz" / "darslar", lesson["slug"]))
            if not en:
                continue
            title_uz = titles_uz.get(lesson["slug"])
            cells.append(markdown_cell(f"## {lesson['title']}" + (f" · {title_uz}" if title_uz else "")))
            for index, (heading, level, task) in enumerate(en):
                block = f"### {heading}\n\n"
                if level:
                    block += f"Difficulty: {LEVELS[level]}\n\n"
                block += task
                if index < len(uz):
                    heading_uz, level_uz, task_uz = uz[index]
                    block += f"\n\n---\n\n**{heading_uz}**"
                    if level_uz:
                        block += f" — qiyinligi: {LEVELS_UZ[level_uz]}"
                    block += f"\n\n{task_uz}"
                cells.append(markdown_cell(block))
                cells.append(code_cell("# Your code here / Kodingizni şu yerga yozing\n"))

        notebook = {
            "cells": cells,
            "metadata": {
                "kernelspec": {"display_name": "Python (Pyodide)", "language": "python", "name": "python"},
                "language_info": {"name": "python"},
            },
            "nbformat": 4,
            "nbformat_minor": 5,
        }
        slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
        target = out / f"{number}-{slug}.ipynb"
        target.write_text(json.dumps(notebook, indent=1, ensure_ascii=False), encoding="utf-8")
        print(f"wrote {target.name} ({len(cells)} cells)")

    welcome = [markdown_cell(
        "# Welcome to the Python Lab\n\n"
        "## Python laboratoriyasiga xuş kelibsiz\n\n"
        "This is a full notebook environment that runs Python in your browser "
        "(JupyterLite with Pyodide). Open a numbered module notebook from the file browser on the "
        "left to practice, create your own with **File → New → Notebook**, and run a cell with "
        "**Shift + Enter**. Your work is stored in this browser, so download anything you want to keep.\n\n"
        "Bu brauzerda Pythonni işga tuşiradigan töliq daftar muhiti (JupyterLite va Pyodide). "
        "Maşq qiliş uçun çapdagi fayl brauzeridan raqamlangan modul daftarini oçing, öz daftaringizni "
        "**File → New → Notebook** bilan yarating, katakçani **Shift + Enter** bilan işga tuşiring. "
        "İşingiz şu brauzerda saqlanadi, şuning uçun kerakli daftarlarni yuklab oling."
    ), code_cell('print("Hello from the Python Lab!")\n')]
    (out / "00-start-here.ipynb").write_text(json.dumps({
        "cells": welcome,
        "metadata": {"kernelspec": {"display_name": "Python (Pyodide)", "language": "python", "name": "python"}, "language_info": {"name": "python"}},
        "nbformat": 4, "nbformat_minor": 5}, indent=1, ensure_ascii=False), encoding="utf-8")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "build/notebooks")
