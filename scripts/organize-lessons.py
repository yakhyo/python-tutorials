"""Put lesson files into numbered module folders that follow course.json.

    docs/lessons/06-functions/01-defining-functions.md
    docs/uz/darslar/06-functions/01-defining-functions.md

URLs do not change: docs/.vitepress/config.mjs rewrites these paths to
/lessons/<slug> and /uz/darslar/<slug>. After adding, removing or reordering
lessons in course.json, run:  python3 scripts/organize-lessons.py
Uses `git mv` so file history is kept. Safe to re-run.
"""
import json, re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / 'docs'
course = json.loads((DOCS / '.vitepress/course.json').read_text())


def module_folder(group):
    number, _, name = group.partition(' · ')
    name = re.sub(r'\(.*?\)', '', name)
    return f"{number}-{re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')}"


def lesson_paths():
    """slug -> path relative to the lessons folder, e.g. '06-functions/01-defining-functions.md'."""
    paths, counters = {}, {}
    for lesson in course:
        folder = module_folder(lesson['group'])
        counters[folder] = counters.get(folder, 0) + 1
        paths[lesson['slug']] = f"{folder}/{counters[folder]:02d}-{lesson['slug']}.md"
    return paths


def find(base, slug):
    hits = [p for p in base.rglob('*.md') if re.fullmatch(rf'(\d\d-)?{re.escape(slug)}\.md', p.name)]
    return hits[0] if hits else None


if __name__ == '__main__':
    moved = 0
    for base in (DOCS / 'lessons', DOCS / 'uz/darslar'):
        for slug, rel in lesson_paths().items():
            src, dst = find(base, slug), base / rel
            if src is None:
                print('missing:', base.relative_to(ROOT), slug)
                continue
            if src != dst:
                dst.parent.mkdir(parents=True, exist_ok=True)
                subprocess.run(['git', 'mv', str(src), str(dst)], cwd=ROOT, check=True)
                moved += 1
        for d in sorted(base.iterdir(), reverse=True):
            if d.is_dir() and not any(d.iterdir()):
                d.rmdir()
    print(f'moved {moved} files')
