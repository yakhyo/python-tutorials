---
title: "Project: Text Analyzer"
description: "Build a complete text analyzer that combines files, generators, regular expressions, Counter, dataclasses, and tests to produce JSON and text reports."
---

# Project: Text Analyzer

![Illustration: Project: Text Analyzer](/images/topics-webp/text-processing-project.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- How to plan a project as a set of small, testable functions
- How to combine files, generators, regex, and `collections.Counter` in one program
- How to collect results in a dataclass and save them as JSON and as a text report
- How to test the pure parts of a program with simple test functions
- How to handle real-world text problems: case, punctuation, encoding, and empty files
:::

## Why it matters

Word counters, readability checkers, SEO tools, spam filters, and search engines all start with the same basic job: read text, split it into words and sentences, count things, and find patterns. In this project you build your own **text analyzer** from scratch. It is small enough to finish in one sitting, but it uses almost everything from the last few modules, and it shows how separate skills fit together into a real program.

## Goal and features

Your program reads a text file and produces a report like this:

```text
Report for cafe.txt
===================
Characters:        591 (489 without spaces)
Words:             93
Sentences:         10
...
Top words:
  cafe         4
  tea          3
...
Emails:  aziza@silkroadcafe.uz, jobs@silkroadcafe.uz
```

Features:

| Feature | Tools you will use |
|---|---|
| Read a text file safely | `pathlib`, `encoding="utf-8"` |
| Count characters, words, sentences, paragraphs | regex, generators |
| Most common words, ignoring stop words | `Counter`, sets |
| Average word and sentence length | functions, guard clauses |
| Longest words | `sorted` with a key |
| Reading time estimate | simple math |
| Extract emails, URLs, and numbers | `re` patterns |
| Save a JSON report and a text report | `json`, `dataclasses.asdict` |
| Check the logic | test functions with `assert` |

## Design

Before writing code, list the functions and how data flows between them. Each function does one job, and most of them are **pure**: they take text or words and return a result, without printing or touching files. Pure functions are easy to test.

```text
cafe.txt
   |
   v
read_text(path) -----------------> text (str)
                                     |
          +--------------------------+---------------------------+
          |                          |                           |
          v                          v                           v
remove_links(text)          count_sentences(text)          extract(text)
          |                 count_paragraphs(text)          -> emails, urls, numbers
          v
iter_words(text)  (generator)
          |
          v
words (list) --> top_words(words)  longest_words(words)  reading_time(n)
          |
          v
analyze(text) --------------------> TextStats (dataclass)
                                     |
                     +---------------+----------------+
                     v                                v
            format_report(stats)            json.dumps(asdict(stats))
                     |                                |
                     v                                v
                report.txt                       report.json
```

Only `read_text`, `save_reports`, and `main` touch files or the screen. Everything else is pure.

## Step 1: Create a sample file and read it

A real user would pass their own file. To keep everything runnable, the program writes a sample text first. Always give `encoding="utf-8"` when reading and writing text.

```python
from pathlib import Path

SAMPLE_TEXT = """\
The Silk Road Cafe opened in Samarkand in 2019. It started with 12 tables,
a small kitchen, and a big idea: serve green tea the way grandmothers make it.
Today the cafe welcomes about 350 guests every day!

Aziza, the owner, answers every message herself. You can write to her at
aziza@silkroadcafe.uz or visit https://silkroadcafe.uz/menu to see the menu.
Is the tea really the best in Samarkand? Many guests think so.

Next year the cafe team plans a second cafe in Bukhara. The budget is 450000000 som,
and guests can expect the same tea. Questions about jobs go to jobs@silkroadcafe.uz.
"""
Path("cafe.txt").write_text(SAMPLE_TEXT, encoding="utf-8")

def read_text(path):
    return Path(path).read_text(encoding="utf-8")

text = read_text("cafe.txt")
print(text[:60])
print("Characters:", len(text))
print("Empty?", not text.strip())
```

```text
The Silk Road Cafe opened in Samarkand in 2019. It started w
Characters: 591
Empty? False
```

`not text.strip()` is `True` for a file that is empty **or** contains only spaces and newlines. You will use this check in `main()`.

## Step 2: Split text into words

The obvious approach, `text.split()`, is not good enough:

```python
text = "Tea, tea and TEA! Is the tea good? It's great."
print(text.split())
```

```text
['Tea,', 'tea', 'and', 'TEA!', 'Is', 'the', 'tea', 'good?', "It's", 'great.']
```

`"Tea,"`, `"tea"`, and `"TEA!"` would count as three different words. You need to **lowercase** the text and keep only letters. A regex does both jobs. The pattern `[a-z]+(?:'[a-z]+)?` means "ASCII letters `a`-`z`, optionally followed by an apostrophe and more letters", so `it's` stays one word. That is enough for the English sample in this project, but it is not a general word pattern: `"o‘zbek gʻalaba café"` becomes `['o', 'zbek', 'g', 'alaba', 'caf']`, because `‘`, `ʻ` and `é` are not in `a`-`z`. A generator yields words one at a time:

```python
import re

WORD_RE = re.compile(r"[a-z]+(?:'[a-z]+)?")

def iter_words(text):
    for match in WORD_RE.finditer(text.lower()):
        yield match.group()

text = "Tea, tea and TEA! Is the tea good? It's great."
print(list(iter_words(text)))
```

```text
['tea', 'tea', 'and', 'tea', 'is', 'the', 'tea', 'good', "it's", 'great']
```

There is one more trap. Emails and URLs contain letters too, so `aziza@silkroadcafe.uz` would become the "words" `aziza`, `silkroadcafe`, `uz`. Remove them before counting words:

```python
import re

WORD_RE = re.compile(r"[a-z]+(?:'[a-z]+)?")
EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}", re.IGNORECASE)
URL_RE = re.compile(r"https?://[^\s,]+[^\s,.]")

def remove_links(text):
    text = URL_RE.sub(" ", text)
    return EMAIL_RE.sub(" ", text)

def iter_words(text):
    for match in WORD_RE.finditer(text.lower()):
        yield match.group()

line = "Write to aziza@silkroadcafe.uz or visit https://silkroadcafe.uz/menu today."
print(list(iter_words(line)))
print(list(iter_words(remove_links(line))))
```

```text
['write', 'to', 'aziza', 'silkroadcafe', 'uz', 'or', 'visit', 'https', 'silkroadcafe', 'uz', 'menu', 'today']
['write', 'to', 'or', 'visit', 'today']
```

The URL pattern ends with `[^\s,.]` so a full stop right after a link is not included in it.

::: info Why a generator?
`iter_words` never builds a list itself. For this project we call `list()` on it because we need the words several times, but the same function could feed `Counter` directly while reading a huge file line by line.
:::

## Step 3: Characters, sentences, and paragraphs

A sentence ends with `.`, `!`, or `?` (maybe several, like `?!`) followed by whitespace or the end of the text. Paragraphs are separated by a blank line.

```python
import re

SENTENCE_END_RE = re.compile(r"[.!?]+(?:\s|$)")

def count_sentences(text):
    return len(SENTENCE_END_RE.findall(text.strip()))

def count_paragraphs(text):
    return len([p for p in re.split(r"\n\s*\n", text) if p.strip()])

text = """Hello from Bukhara! Is it hot today?! Yes.

Visit silkroadcafe.uz for 3.5 hours of tea.


The end."""

print("Characters:", len(text))
print("Without spaces:", len(re.sub(r"\s", "", text)))
print("Sentences:", count_sentences(text))
print("Paragraphs:", count_paragraphs(text))
```

```text
Characters: 98
Without spaces: 79
Sentences: 5
Paragraphs: 3
```

Requiring whitespace after the punctuation means `silkroadcafe.uz` and `3.5` do not end a sentence. Abbreviations like `Dr. Karimov` would still be counted wrongly. Perfect sentence detection is surprisingly hard, and "good enough" is fine for this project.

## Step 4: Most common and longest words

`Counter` counts the words, and a set of **stop words** removes the boring ones ("the", "and", "in") that would otherwise always win:

```python
from collections import Counter

STOP_WORDS = {"the", "and", "in", "a", "is", "to", "of"}

def top_words(words, n=5, stop_words=STOP_WORDS):
    counts = Counter(w for w in words if w not in stop_words)
    return counts.most_common(n)

def longest_words(words, n=3):
    unique = set(words)
    return sorted(unique, key=lambda w: (-len(w), w))[:n]

words = ["the", "tea", "in", "samarkand", "and", "the", "tea", "in", "bukhara",
         "is", "the", "best", "tea", "in", "uzbekistan"]

print(top_words(words))
print(top_words(words, n=2, stop_words=set()))
print(longest_words(words))
```

```text
[('tea', 3), ('samarkand', 1), ('bukhara', 1), ('best', 1), ('uzbekistan', 1)]
[('the', 3), ('tea', 3)]
['uzbekistan', 'samarkand', 'bukhara']
```

Two details matter here:

- `stop_words` is a **parameter** with a default, so tests and other users can pass their own set.
- The sort key `(-len(w), w)` sorts by length (longest first), then alphabetically. Without the second part, words of equal length could come out in a different order each run, because sets have no fixed order. Stable output makes testing possible.

## Step 5: Averages and reading time

Averages divide by a count, and a count can be zero. Guard against that, or an empty file will crash the program:

```python
WORDS_PER_MINUTE = 200

def average(total, count):
    return round(total / count, 2) if count else 0.0

def reading_time(word_count, wpm=WORDS_PER_MINUTE):
    return round(word_count / wpm, 1)

words = ["green", "tea", "in", "samarkand"]
print("Avg word length:", average(sum(map(len, words)), len(words)))
print("Avg sentence length:", average(len(words), 1))
print("Empty text:", average(0, 0))
print("Reading time for 1,500 words:", reading_time(1500), "min")
```

```text
Avg word length: 4.75
Avg sentence length: 4.0
Empty text: 0.0
Reading time for 1,500 words: 7.5 min
```

An adult reads roughly 200 to 250 words per minute. Keeping the number in a named constant makes it easy to change.

## Step 6: Extract emails, URLs, and numbers

These are the patterns from *Regular Expressions*, applied to the whole text:

```python
import re

EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}", re.IGNORECASE)
URL_RE = re.compile(r"https?://[^\s,]+[^\s,.]")
NUMBER_RE = re.compile(r"\b\d+(?:\.\d+)?\b")

def remove_links(text):
    text = URL_RE.sub(" ", text)
    return EMAIL_RE.sub(" ", text)

def extract(text):
    urls = URL_RE.findall(text)
    emails = EMAIL_RE.findall(text)
    numbers = NUMBER_RE.findall(remove_links(text))
    return emails, urls, numbers

text = "Call 2 friends, pay 45000 som or 3.5 USD. Mail info@tour2026.uz, see https://tour2026.uz/prices."
emails, urls, numbers = extract(text)
print(emails)
print(urls)
print(numbers)
```

```text
['info@tour2026.uz']
['https://tour2026.uz/prices']
['2', '45000', '3.5']
```

Numbers are searched in the text **without** links, otherwise the `2026` inside the domain name would be reported as a number.

## Step 7: Collect results in a dataclass

A function that returns 13 values needs a clear container. A dataclass (from *Dataclasses*) gives each value a name, a nice `repr`, and a free conversion to a dictionary with `asdict()`:

```python
from dataclasses import dataclass, asdict

@dataclass
class TextStats:
    words: int
    sentences: int
    top_words: list

stats = TextStats(words=93, sentences=10, top_words=[("cafe", 4), ("tea", 3)])
print(stats)
print(stats.words)
print(asdict(stats))
```

```text
TextStats(words=93, sentences=10, top_words=[('cafe', 4), ('tea', 3)])
93
{'words': 93, 'sentences': 10, 'top_words': [('cafe', 4), ('tea', 3)]}
```

The `analyze(text)` function then calls all the helpers and fills in one `TextStats`. You will see it in the full program below.

## Step 8: Write the reports

The text report is built by a **pure** function that returns a string. Saving is a separate, tiny function. This way you can test the formatting without creating files:

```python
import json
from dataclasses import dataclass, asdict
from pathlib import Path

@dataclass
class TextStats:
    words: int
    sentences: int
    top_words: list

def format_report(stats, title="Text report"):
    lines = [title, "=" * len(title), f"Words:     {stats.words}", f"Sentences: {stats.sentences}", "Top words:"]
    for word, count in stats.top_words:
        lines.append(f"  {word:<10} {count}")
    return "\n".join(lines)

stats = TextStats(words=93, sentences=10, top_words=[("cafe", 4), ("tea", 3)])

Path("report.txt").write_text(format_report(stats) + "\n", encoding="utf-8")
Path("report.json").write_text(json.dumps(asdict(stats), indent=2), encoding="utf-8")

print(Path("report.txt").read_text(encoding="utf-8"))
print(Path("report.json").read_text(encoding="utf-8"))
```

```text
Text report
===========
Words:     93
Sentences: 10
Top words:
  cafe       4
  tea        3

{
  "words": 93,
  "sentences": 10,
  "top_words": [
    [
      "cafe",
      4
    ],
    [
      "tea",
      3
    ]
  ]
}
```

JSON has no tuples, so `("cafe", 4)` is saved as a list `["cafe", 4]`. When you load the file back, you get lists.

## The full program

Here is everything together. Copy it into `text_analyzer.py` and run it. To analyze your own file, change the path in `main()` and delete the line that writes the sample.

```python
import json
import re
from collections import Counter
from dataclasses import dataclass, asdict
from pathlib import Path

SAMPLE_TEXT = """\
The Silk Road Cafe opened in Samarkand in 2019. It started with 12 tables,
a small kitchen, and a big idea: serve green tea the way grandmothers make it.
Today the cafe welcomes about 350 guests every day!

Aziza, the owner, answers every message herself. You can write to her at
aziza@silkroadcafe.uz or visit https://silkroadcafe.uz/menu to see the menu.
Is the tea really the best in Samarkand? Many guests think so.

Next year the cafe team plans a second cafe in Bukhara. The budget is 450000000 som,
and guests can expect the same tea. Questions about jobs go to jobs@silkroadcafe.uz.
"""

STOP_WORDS = {
    "a", "about", "and", "at", "be", "every", "for", "go", "her", "in", "is",
    "it", "many", "of", "or", "see", "so", "the", "to", "with", "you", "can",
    "think", "way", "make", "it's",
}

WORDS_PER_MINUTE = 200

WORD_RE = re.compile(r"[a-z]+(?:'[a-z]+)?")
SENTENCE_END_RE = re.compile(r"[.!?]+(?:\s|$)")
EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}", re.IGNORECASE)
URL_RE = re.compile(r"https?://[^\s,]+[^\s,.]")
NUMBER_RE = re.compile(r"\b\d+(?:\.\d+)?\b")


@dataclass
class TextStats:
    characters: int
    characters_no_spaces: int
    words: int
    sentences: int
    paragraphs: int
    average_word_length: float
    average_sentence_length: float
    reading_time_minutes: float
    top_words: list
    longest_words: list
    emails: list
    urls: list
    numbers: list


def read_text(path):
    return Path(path).read_text(encoding="utf-8")


def remove_links(text):
    text = URL_RE.sub(" ", text)
    return EMAIL_RE.sub(" ", text)


def iter_words(text):
    for match in WORD_RE.finditer(text.lower()):
        yield match.group()


def count_sentences(text):
    return len(SENTENCE_END_RE.findall(text.strip()))


def count_paragraphs(text):
    return len([p for p in re.split(r"\n\s*\n", text) if p.strip()])


def top_words(words, n=5, stop_words=STOP_WORDS):
    counts = Counter(w for w in words if w not in stop_words)
    return counts.most_common(n)


def longest_words(words, n=3):
    unique = set(words)
    return sorted(unique, key=lambda w: (-len(w), w))[:n]


def reading_time(word_count, wpm=WORDS_PER_MINUTE):
    return round(word_count / wpm, 1)


def extract(text):
    urls = URL_RE.findall(text)
    emails = EMAIL_RE.findall(text)
    numbers = NUMBER_RE.findall(remove_links(text))
    return emails, urls, numbers


def analyze(text):
    words = list(iter_words(remove_links(text)))
    sentences = count_sentences(text)
    emails, urls, numbers = extract(text)
    word_count = len(words)
    return TextStats(
        characters=len(text),
        characters_no_spaces=len(re.sub(r"\s", "", text)),
        words=word_count,
        sentences=sentences,
        paragraphs=count_paragraphs(text),
        average_word_length=round(sum(map(len, words)) / word_count, 2) if words else 0.0,
        average_sentence_length=round(word_count / sentences, 2) if sentences else 0.0,
        reading_time_minutes=reading_time(word_count),
        top_words=top_words(words),
        longest_words=longest_words(words),
        emails=emails,
        urls=urls,
        numbers=numbers,
    )


def format_report(stats, title="Text report"):
    lines = [
        title,
        "=" * len(title),
        f"Characters:        {stats.characters} ({stats.characters_no_spaces} without spaces)",
        f"Words:             {stats.words}",
        f"Sentences:         {stats.sentences}",
        f"Paragraphs:        {stats.paragraphs}",
        f"Avg word length:   {stats.average_word_length}",
        f"Avg sentence:      {stats.average_sentence_length} words",
        f"Reading time:      {stats.reading_time_minutes} min",
        "",
        "Top words:",
    ]
    for word, count in stats.top_words:
        lines.append(f"  {word:<12} {count}")
    lines.append("Longest words: " + ", ".join(stats.longest_words))
    lines.append("Emails:  " + (", ".join(stats.emails) or "-"))
    lines.append("URLs:    " + (", ".join(stats.urls) or "-"))
    lines.append("Numbers: " + (", ".join(stats.numbers) or "-"))
    return "\n".join(lines)


def save_reports(stats, json_path, text_path):
    Path(json_path).write_text(json.dumps(asdict(stats), indent=2), encoding="utf-8")
    Path(text_path).write_text(format_report(stats) + "\n", encoding="utf-8")


def main():
    Path("cafe.txt").write_text(SAMPLE_TEXT, encoding="utf-8")

    text = read_text("cafe.txt")
    if not text.strip():
        print("The file is empty, nothing to analyze.")
        return

    stats = analyze(text)
    print(format_report(stats, "Report for cafe.txt"))

    save_reports(stats, "report.json", "report.txt")
    loaded = json.loads(Path("report.json").read_text(encoding="utf-8"))
    print()
    print("Saved report.json with keys:", ", ".join(list(loaded)[:4]), "...")
    print("Saved report.txt:", Path("report.txt").stat().st_size, "bytes")


if __name__ == "__main__":
    main()
```

```text
Report for cafe.txt
===================
Characters:        591 (489 without spaces)
Words:             93
Sentences:         10
Paragraphs:        3
Avg word length:   4.15
Avg sentence:      9.3 words
Reading time:      0.5 min

Top words:
  cafe         4
  tea          3
  guests       3
  samarkand    2
  silk         1
Longest words: grandmothers, questions, samarkand
Emails:  aziza@silkroadcafe.uz, jobs@silkroadcafe.uz
URLs:    https://silkroadcafe.uz/menu
Numbers: 2019, 12, 350, 450000000

Saved report.json with keys: characters, characters_no_spaces, words, sentences ...
Saved report.txt: 485 bytes
```

Notice the structure: constants and compiled patterns at the top, small pure functions in the middle, and all input/output in `save_reports()` and `main()`. The `if __name__ == "__main__":` line (from *Modules and Imports*) lets you import these functions in a test file without running the program.

## Testing the pure functions

Because most functions are pure, they are easy to test. In a real project, put these in `test_text_analyzer.py`, write `from text_analyzer import ...` at the top, and run `pytest`. Here the functions are repeated and the tests are called by hand, so the block runs on its own:

```python
import re
from collections import Counter

WORD_RE = re.compile(r"[a-z]+(?:'[a-z]+)?")
SENTENCE_END_RE = re.compile(r"[.!?]+(?:\s|$)")
EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}", re.IGNORECASE)

def iter_words(text):
    for match in WORD_RE.finditer(text.lower()):
        yield match.group()

def count_sentences(text):
    return len(SENTENCE_END_RE.findall(text.strip()))

def top_words(words, n=5, stop_words=frozenset()):
    counts = Counter(w for w in words if w not in stop_words)
    return counts.most_common(n)

def longest_words(words, n=3):
    return sorted(set(words), key=lambda w: (-len(w), w))[:n]

def reading_time(word_count, wpm=200):
    return round(word_count / wpm, 1)


def test_iter_words_ignores_case_and_punctuation():
    assert list(iter_words("Tea, TEA! tea?")) == ["tea", "tea", "tea"]

def test_iter_words_keeps_apostrophes():
    assert list(iter_words("It's Aziza's cafe")) == ["it's", "aziza's", "cafe"]

def test_iter_words_empty_text():
    assert list(iter_words("")) == []
    assert list(iter_words("123 !!! 45")) == []

def test_count_sentences():
    assert count_sentences("One. Two! Three?") == 3
    assert count_sentences("Wait?! Really...") == 2
    assert count_sentences("Pi is 3.14 and the site is cafe.uz") == 0
    assert count_sentences("") == 0

def test_top_words_uses_stop_words():
    words = ["the", "tea", "the", "tea", "plov"]
    assert top_words(words, n=1, stop_words={"the"}) == [("tea", 2)]

def test_longest_words_ties_are_alphabetical():
    assert longest_words(["tea", "plov", "nan", "samsa", "lagman"], n=2) == ["lagman", "samsa"]

def test_reading_time():
    assert reading_time(0) == 0.0
    assert reading_time(1000) == 5.0
    assert reading_time(300, wpm=250) == 1.2

def test_email_pattern():
    text = "Mail aziza@cafe.uz or JOBS@Cafe.UZ, not @cafe or aziza@"
    assert EMAIL_RE.findall(text) == ["aziza@cafe.uz", "JOBS@Cafe.UZ"]


tests = [
    test_iter_words_ignores_case_and_punctuation,
    test_iter_words_keeps_apostrophes,
    test_iter_words_empty_text,
    test_count_sentences,
    test_top_words_uses_stop_words,
    test_longest_words_ties_are_alphabetical,
    test_reading_time,
    test_email_pattern,
]
for test in tests:
    test()
    print("passed:", test.__name__)
```

```text
passed: test_iter_words_ignores_case_and_punctuation
passed: test_iter_words_keeps_apostrophes
passed: test_iter_words_empty_text
passed: test_count_sentences
passed: test_top_words_uses_stop_words
passed: test_longest_words_ties_are_alphabetical
passed: test_reading_time
passed: test_email_pattern
```

Look at what the tests cover: normal input, **edge cases** (empty text, only numbers), and tricky cases found while building (apostrophes, `3.14`, ties). Each bug you fix is a good reason to add a test, as you learned in *Choosing Test Cases*.

## Try it

A compact version of the analyzer runs right here. Paste in your own text, or change the stop words.

<ClientOnly><PythonPlayground :code='"import re\nfrom collections import Counter\n\ntext = \"\"\"Aziza opened a small tea house in Samarkand in 2019.\nGuests love the green tea and the fresh bread! Is the tea better than in Bukhara?\nWrite to aziza@teahouse.uz with questions. The tea house has 12 tables.\"\"\"\n\nSTOP_WORDS = {\"a\", \"and\", \"in\", \"is\", \"the\", \"than\", \"to\", \"with\", \"has\"}\n\nemails = re.findall(r\"[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)*\\.[a-z]{2,}\", text)\nclean = re.sub(r\"[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)*\\.[a-z]{2,}\", \" \", text)\nwords = re.findall(r\"[a-z]+\", clean.lower())\nsentences = len(re.findall(r\"[.!?]+(?:\\s|$)\", text.strip()))\nnumbers = re.findall(r\"\\b\\d+\\b\", clean)\ncounts = Counter(w for w in words if w not in STOP_WORDS)\n\nprint(\"Words:\", len(words))\nprint(\"Sentences:\", sentences)\nif words and sentences:\n    print(\"Avg word length:\", round(sum(map(len, words)) / len(words), 2))\n    print(\"Avg sentence length:\", round(len(words) / sentences, 2))\nprint(\"Top words:\", counts.most_common(3))\nprint(\"Longest:\", sorted(set(words), key=lambda w: (-len(w), w))[:3])\nprint(\"Emails:\", emails)\nprint(\"Numbers:\", numbers)"' /></ClientOnly>

## Common mistakes

### 1. Reading a file without an encoding

Text files are not always saved as UTF-8. If a file was saved in an old Windows encoding, reading it as UTF-8 fails:

```py
from pathlib import Path

Path("old.txt").write_bytes("Ташкент, Самарканд".encode("cp1251"))
text = Path("old.txt").read_text(encoding="utf-8")
```

```text
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xd2 in position 0: invalid continuation byte
```

**Fix:** always pass `encoding="utf-8"` so your program behaves the same on every computer, and catch `UnicodeDecodeError` to show a friendly message (or try another encoding). Without an explicit encoding, Python may use a different default on Windows than on Linux or macOS.

### 2. Forgetting to lowercase

```python
from collections import Counter

words = "Tea is good. TEA is cheap. tea is hot.".replace(".", "").split()
print(Counter(words).most_common(2))
print(Counter(w.lower() for w in words).most_common(2))
```

```text
[('is', 3), ('Tea', 1)]
[('tea', 3), ('is', 3)]
```

**Fix:** normalize case **once**, in the function that produces words, so every other function gets clean data.

### 3. Leaving punctuation attached

```python
from collections import Counter

text = "Plov, plov and more plov!"
print(Counter(text.lower().split()))
```

```text
Counter({'plov,': 1, 'plov': 1, 'and': 1, 'more': 1, 'plov!': 1})
```

`"plov,"`, `"plov"`, and `"plov!"` are counted separately. **Fix:** extract words with a regex like `[a-z]+` instead of `split()`.

### 4. Crashing on an empty file

```py
text = ""
words = text.split()
average_length = sum(len(w) for w in words) / len(words)
```

```text
ZeroDivisionError: division by zero
```

**Fix:** check `if not text.strip():` early in `main()`, and guard every division: `total / count if count else 0.0`. Test with an empty string on purpose.

## Challenges

These extend the project. Try each one before opening the hints.

### 1. Ask for the file name <Difficulty level="1" />

Let the user choose the file: use `input("File to analyze: ")`, and print a friendly message if the file does not exist instead of a traceback.

::: details Hints
- `Path(name).exists()` tells you whether the file is there. Or wrap `read_text` in `try` / `except FileNotFoundError`.
- Keep the check in `main()`, not in the pure functions.
:::

### 2. Words per paragraph <Difficulty level="1" />

Add a field `words_per_paragraph` (a list of integers) to `TextStats`, and show it in the text report like `Words per paragraph: 31, 34, 28`.

::: details Hints
- Reuse `re.split(r"\n\s*\n", text)` from `count_paragraphs`, then count words in each part with `iter_words`.
- `sum(1 for _ in iter_words(paragraph))` counts without building a list.
- Remember to add a test for a text with one paragraph and a text with a blank line.
:::

### 3. Stop words from a file <Difficulty level="2" />

Load stop words from `stop_words.txt` (one word per line, lines starting with `#` are comments) instead of the hard-coded set.

::: details Hints
- Write a generator pipeline like in *Iterators and Generators*: read lines, strip, skip blanks and comments.
- Build the set with `{line.lower() for line in ...}`.
- Pass the set to `top_words(words, stop_words=...)`. That is why it was a parameter.
:::

### 4. Compare two texts <Difficulty level="2" />

Analyze two files and print a side-by-side comparison: words, sentences, average sentence length, and the words that appear in the top 10 of **both** texts.

::: details Hints
- Call `analyze()` twice. You get two `TextStats` objects.
- Build sets of words from each `top_words` list and use `&` for the intersection.
- Format columns with f-strings like `f"{label:<20}{a:>8}{b:>8}"`.
:::

### 5. Streaming analyzer for huge files <Difficulty level="3" />

Rewrite word counting so it works on a file of several gigabytes: never call `read_text()` or `list()` on all the words. Count words, most common words, and the longest word while reading line by line.

::: details Hints
- Open the file with `open(path, encoding="utf-8")` and loop over lines. Each line goes through `remove_links` and `iter_words`.
- `Counter.update(iterable)` adds counts from a generator.
- Keep a running word count and the current longest word in variables instead of a list.
- Sentences can span lines, so counting them exactly in streaming mode is harder. Decide whether an approximation (count per line) is acceptable, and write that decision in a comment.
:::

## Recap

- Plan a project as a list of small functions and a data flow **before** writing code.
- Normalize text early: lowercase it, extract words with a regex, and remove emails and URLs before counting.
- `Counter.most_common()` plus a stop-word set finds meaningful frequent words, and a two-part sort key makes results stable.
- Guard every division and check for empty input, so edge cases do not crash the program.
- A dataclass collects many results under clear names, and `asdict()` turns it into JSON.
- Keep calculations pure and file/screen work at the edges. Pure functions are easy to test with plain `assert` or `pytest`.

## Further reading

- [`collections.Counter`](https://docs.python.org/3/library/collections.html#collections.Counter)
- [`re`: Regular expression operations](https://docs.python.org/3/library/re.html)
- [`dataclasses.asdict`](https://docs.python.org/3/library/dataclasses.html#dataclasses.asdict)
- [pytest: Get started](https://docs.pytest.org/en/stable/getting-started.html)
