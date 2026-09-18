"""Check lessons against the course lesson template.

Template: What you'll learn (3-5 objectives), Why it matters, concept sections with
runnable examples, Common mistakes (2-4, each with code or error output), Practice
(5 exercises with a Difficulty tag and a solution), Recap (<= 6 bullets), Further
reading. Concept lessons run 1,200-2,000 words. Reference lesson:
docs/lessons/05-collections/04-dictionaries.md.

Usage: python3 scripts/lint.py [paths...]   (default: docs/lessons and docs/uz/darslar)

Reports, per lesson: missing sections, objective/mistake/recap counts outside the
template ranges, common mistakes without a code or output block, exercises without a
Difficulty tag or a details block, word count outside 1,200-2,000 (concept lessons only),
and empty solutions. Exit code 1 if any hard violation is found.
"""
from pathlib import Path
import re, sys

root = Path(__file__).resolve().parents[1]
targets = [Path(a).resolve() for a in sys.argv[1:]] or [root / 'docs/lessons', root / 'docs/uz/darslar']
files = sorted({f for t in targets for f in ([t] if t.is_file() else t.rglob('*.md'))})
PROJECT = re.compile(r'-(game|tracker|project)$')

# Heading names in English and Uzbek.
NAMES = {
    'learn': ("What you'll learn", 'Nimalarni örganasiz'),
    'why': ('## Why it matters', '## Nega bu muhim'),
    'mistakes': ('## Common mistakes', '## Köp uçraydigan xatolar'),
    'practice': ('## Practice', '## Challenges', '## Maşqlar', '## Topşiriqlar', '## Qöşimça topşiriqlar'),
    'recap': ('## Recap', '## Xulosa'),
    'further': ('## Further reading', '## Qöşimça manbalar'),
}


def section(text, start_names, end_pattern=r'\n## '):
    for name in start_names:
        m = re.search(re.escape(name) + r'[^\n]*\n', text)
        if m:
            rest = text[m.end():]
            e = re.search(end_pattern, rest)
            return rest[:e.start()] if e else rest
    return None


hard = 0
for p in files:
    text = p.read_text()
    problems = []
    is_project = bool(PROJECT.search(p.stem))
    for key in ('learn', 'why', 'mistakes', 'practice', 'recap', 'further'):
        if not any(n in text for n in NAMES[key]):
            problems.append(f'missing section: {NAMES[key][0]}')
    learn = section(text, NAMES['learn'], r'\n:::')
    if learn is not None:
        n = len(re.findall(r'^- ', learn, re.M))
        if not 3 <= n <= 5:
            problems.append(f'objectives: {n} bullets (template 3-5)')
    mistakes = section(text, NAMES['mistakes'])
    if mistakes is not None:
        items = re.split(r'\n### ', '\n' + mistakes)[1:]
        if not 2 <= len(items) <= 4:
            problems.append(f'common mistakes: {len(items)} entries (template 2-4)')
        for it in items:
            if '```' not in it:
                problems.append(f'mistake without code/output block: {it.splitlines()[0][:50]!r}')
    recap = section(text, NAMES['recap'])
    if recap is not None:
        n = len(re.findall(r'^- ', recap, re.M))
        if n > 6:
            problems.append(f'recap: {n} bullets (template ~5, max 6)')
    practice = section(text, NAMES['practice'], r'\n## ')
    if practice is not None:
        exercises = re.split(r'\n### ', '\n' + practice)[1:]
        if len(exercises) != 5:
            problems.append(f'exercises: {len(exercises)} (expected 5)')
        for ex in exercises:
            head = ex.splitlines()[0]
            if '<Difficulty' not in head:
                problems.append(f'exercise without Difficulty tag: {head[:50]!r}')
            if not is_project and '::: details' not in ex:
                problems.append(f'exercise without details block: {head[:50]!r}')
    words = len(text.split())
    if not is_project and not (1100 <= words <= 2100):
        problems.append(f'length: {words} words (target 1,200-2,000)')
    if problems:
        hard += sum(1 for x in problems if not x.startswith('length'))
        print(f'{p.relative_to(root)}')
        for x in problems:
            print(f'  - {x}')
print(f'{len(files)} lessons checked, {hard} hard violations')
sys.exit(1 if hard else 0)
