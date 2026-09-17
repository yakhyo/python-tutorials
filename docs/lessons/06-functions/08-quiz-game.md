---
title: "Project: Quiz Game"
description: "Build a multiple-choice quiz game step by step with a list of dictionaries, small functions, shuffling, scoring per topic, grades, a review of wrong answers, and assert tests."
---

# Project: Quiz Game

![Illustration: Project: Quiz Game](/images/topics-webp/quiz-game.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- How to store program data as a list of dictionaries instead of hard-coding it in `if` statements
- How to split a program into small functions, each with one clear job
- How to separate **pure** functions (easy to test) from functions that use `input()` and `print()`
- How to shuffle without changing the original data, and how to score results per topic
- How to check your logic with simple `assert` tests
:::

## Why it matters

Imagine writing a quiz with ten `if` statements, one per question. Adding a question means copying code, and changing the scoring means editing ten places. Real programs do it the other way around: the **data** (questions) lives in one structure, and a few **functions** work on any amount of that data.

This project uses everything from the last two modules: lists, dictionaries, sets, comprehensions, and functions with parameters and return values. It is the same design as a driving-theory test, a school exam app, or a language-learning app: questions in, results out.

## Goal and features

The program asks multiple-choice questions in random order, checks the answers, and prints a report like this:

```text
=== Results ===
Score: 6/9 (66.7%)  Grade: C

By topic:
  Geography  3/3  100.0%
  Math       1/3   33.3%
  Python     2/3   66.7%

Review your mistakes:
  - What is 2 ** 10?
    You chose: 512. Correct: 1024.
```

Features:

| Feature | Tools you will use |
|---|---|
| Questions with options, answer, and topic | a list of dictionaries |
| Display a question with A-D options | `zip()`, `str.join()` |
| Validate answers like `b`, ` B `, or `E` | string methods, a `while` loop |
| Random order of questions and options | `random.sample()` |
| Score per topic | a dictionary of dictionaries, `setdefault()` |
| Percentage and grade | small pure functions |
| Review wrong answers | a list comprehension |
| Check the logic | `assert` tests |

## Design

Each function has one job. Most of them are **pure**: they receive data and return a result, without asking or printing anything. Only three functions talk to the player.

```text
QUESTIONS (list of dicts)
     |
     v
run_quiz(questions)                      talks to the player
     |
     +-- shuffled(items)                  -> new list in random order
     |
     +-- for each question:
     |     ask_question(...)              talks to the player
     |       +-- format_question(...)     -> str        (pure)
     |       +-- letter_to_option(...)    -> option/None (pure)
     |     check_answer(question, chosen) -> bool       (pure)
     |     results.append({...})
     |
     v
show_results(results)                    prints the report
     +-- score_by_topic(results)          -> dict       (pure)
     +-- percentage(correct, total)       -> float      (pure)
     +-- grade(percent)                   -> str        (pure)
```

The `results` list is the bridge between asking and reporting. Each item is a dictionary that remembers the question, the topic, what the player chose, the correct answer, and whether it was correct.

## Step 1: Store the questions as data

Every question has the same four keys. That uniform shape is what lets one function handle all of them:

```python
QUESTIONS = [
    {"question": "What is the capital of Uzbekistan?",
     "options": ["Samarkand", "Tashkent", "Bukhara", "Khiva"],
     "answer": "Tashkent", "topic": "Geography"},
    {"question": "Which type is immutable?",
     "options": ["list", "dict", "set", "tuple"],
     "answer": "tuple", "topic": "Python"},
    {"question": "What is 2 ** 10?",
     "options": ["20", "100", "512", "1024"],
     "answer": "1024", "topic": "Math"},
]

print("Questions:", len(QUESTIONS))
print("Topics:", sorted({q["topic"] for q in QUESTIONS}))
print("First question:", QUESTIONS[0]["question"])
print("Its options:", QUESTIONS[0]["options"])

# every answer must be one of its own options
print("All answers valid:", all(q["answer"] in q["options"] for q in QUESTIONS))
```

```text
Questions: 3
Topics: ['Geography', 'Math', 'Python']
First question: What is the capital of Uzbekistan?
Its options: ['Samarkand', 'Tashkent', 'Bukhara', 'Khiva']
All answers valid: True
```

The set comprehension `{q["topic"] for q in QUESTIONS}` collects each topic once. The last line is a quick **data check**: a typo such as `"answer": "Tashknet"` would make a question impossible to answer correctly, and `all()` catches it before the quiz starts.

## Step 2: Show a question

`format_question` **returns** a string instead of printing it. That makes it easy to test and reuse (for example, to save a quiz to a file later).

```python
LETTERS = "ABCD"

def format_question(number, total, question, options):
    """Return the question and its lettered options as one string."""
    lines = [f"Question {number}/{total} [{question['topic']}]",
             question["question"]]
    for letter, option in zip(LETTERS, options):
        lines.append(f"  {letter}) {option}")
    return "\n".join(lines)

question = {"question": "What is the capital of Uzbekistan?",
            "options": ["Samarkand", "Tashkent", "Bukhara", "Khiva"],
            "answer": "Tashkent", "topic": "Geography"}

text = format_question(1, 9, question, question["options"])
print(text)
```

```text
Question 1/9 [Geography]
What is the capital of Uzbekistan?
  A) Samarkand
  B) Tashkent
  C) Bukhara
  D) Khiva
```

`zip(LETTERS, options)` pairs `"A"` with the first option, `"B"` with the second, and so on. The options are passed as a **separate parameter**, not read from the dictionary, because in Step 5 you will show them in shuffled order.

## Step 3: Turn a letter into an answer and check it

The player types a letter, but the answer is stored as text. One function translates, another compares:

```python
LETTERS = "ABCD"

def letter_to_option(letter, options):
    """Turn 'b' or 'B' into the matching option, or None if invalid."""
    letter = letter.strip().upper()
    if len(letter) != 1 or letter not in LETTERS[:len(options)]:
        return None
    return options[LETTERS.index(letter)]

def check_answer(question, chosen):
    return chosen == question["answer"]

question = {"question": "What is the capital of Uzbekistan?",
            "options": ["Samarkand", "Tashkent", "Bukhara", "Khiva"],
            "answer": "Tashkent", "topic": "Geography"}
options = question["options"]

for reply in ["B", " b ", "A", "E", "AB", ""]:
    label = '"' + reply + '"'
    chosen = letter_to_option(reply, options)
    if chosen is None:
        print(f"{label:6} -> invalid")
    else:
        print(f"{label:6} -> {chosen:<10} correct: {check_answer(question, chosen)}")
```

```text
"B"    -> Tashkent   correct: True
" b "  -> Tashkent   correct: True
"A"    -> Samarkand  correct: False
"E"    -> invalid
"AB"   -> invalid
""     -> invalid
```

Why check `len(letter) != 1`? Because `"" in "ABCD"` is `True`: the empty string is inside every string. Without that check, pressing Enter would silently choose option A. `LETTERS[:len(options)]` also makes the function work for questions with only two or three options.

`letter_to_option` returns `None` for anything invalid. Returning a special "no result" value is a common pattern you met in *Return Values*.

## Step 4: Ask the player

Now the first function that uses `input()`. It shows the question and keeps asking until it gets a valid letter or `quit`:

```python
LETTERS = "ABCD"

def format_question(number, total, question, options):
    lines = [f"Question {number}/{total} [{question['topic']}]",
             question["question"]]
    for letter, option in zip(LETTERS, options):
        lines.append(f"  {letter}) {option}")
    return "\n".join(lines)

def letter_to_option(letter, options):
    letter = letter.strip().upper()
    if len(letter) != 1 or letter not in LETTERS[:len(options)]:
        return None
    return options[LETTERS.index(letter)]

def ask_question(number, total, question, options):
    """Ask until the player types a valid letter. Return the option or None to quit."""
    print(format_question(number, total, question, options))
    while True:
        reply = input("Your answer (A-D, or quit): ").strip()
        if reply.lower() == "quit":
            return None
        chosen = letter_to_option(reply, options)
        if chosen is not None:
            return chosen
        print("  Please type A, B, C, or D.")

question = {"question": "Which type is immutable?",
            "options": ["list", "dict", "set", "tuple"],
            "answer": "tuple", "topic": "Python"}

chosen = ask_question(1, 1, question, question["options"])
print("Returned:", chosen)
```

```text
Question 1/1 [Python]
Which type is immutable?
  A) list
  B) dict
  C) set
  D) tuple
Your answer (A-D, or quit): x
  Please type A, B, C, or D.
Your answer (A-D, or quit): D
Returned: tuple
```

The `return` inside the loop ends both the loop and the function. Notice how little logic this function has: formatting and validation are delegated to the pure functions from Steps 2 and 3.

## Step 5: Shuffle without changing the data

`random.shuffle(items)` shuffles a list **in place** and returns `None`. That would reorder the global `QUESTIONS` list, which is a side effect you do not want. `random.sample(items, len(items))` returns a **new** shuffled list instead. (You will study the `random` module properly in *math, random, and statistics*.)

```python
import random

random.seed(3)

def shuffled(items):
    """Return a new list in random order. The original list is not changed."""
    return random.sample(items, len(items))

options = ["Samarkand", "Tashkent", "Bukhara", "Khiva"]
print(shuffled(options))
print(shuffled(options))
print("Original:", options)
```

```text
['Tashkent', 'Bukhara', 'Samarkand', 'Khiva']
['Khiva', 'Bukhara', 'Samarkand', 'Tashkent']
Original: ['Samarkand', 'Tashkent', 'Bukhara', 'Khiva']
```

`random.seed(3)` makes the order repeatable, so the outputs in this lesson are real. Delete it in your own quiz so every game is different.

## Step 6: Score by topic, percentage, and grade

After the quiz, `results` holds one dictionary per answer. `score_by_topic` groups them:

```python
def score_by_topic(results):
    """Return {topic: {"correct": n, "total": n}}."""
    scores = {}
    for result in results:
        topic_score = scores.setdefault(result["topic"], {"correct": 0, "total": 0})
        topic_score["total"] += 1
        if result["correct"]:
            topic_score["correct"] += 1
    return scores

def percentage(correct, total):
    if total == 0:
        return 0.0
    return round(correct / total * 100, 1)

def grade(percent):
    if percent >= 90:
        return "A"
    if percent >= 75:
        return "B"
    if percent >= 60:
        return "C"
    if percent >= 40:
        return "D"
    return "F"

results = [
    {"topic": "Geography", "correct": True},
    {"topic": "Python", "correct": True},
    {"topic": "Math", "correct": False},
    {"topic": "Python", "correct": False},
    {"topic": "Geography", "correct": True},
]

print(score_by_topic(results))

correct = sum(1 for r in results if r["correct"])
percent = percentage(correct, len(results))
print(f"{correct}/{len(results)} = {percent}% -> grade {grade(percent)}")
print(percentage(0, 0), grade(100), grade(59.9))
```

```text
{'Geography': {'correct': 2, 'total': 2}, 'Python': {'correct': 1, 'total': 2}, 'Math': {'correct': 0, 'total': 1}}
3/5 = 60.0% -> grade C
0.0 A D
```

`scores.setdefault(topic, {"correct": 0, "total": 0})` returns the existing inner dictionary, or creates it the first time a topic appears. Because dictionaries are mutable, `topic_score["total"] += 1` updates the dictionary stored inside `scores`.

`percentage` guards against dividing by zero, which happens if the player quits before answering anything. `grade` checks the highest threshold first, and each `return` ends the function, so no `elif` is needed.

## Step 7: Review the wrong answers

A list comprehension picks the mistakes, and a loop prints them:

```python
results = [
    {"question": "What is 2 ** 10?", "topic": "Math",
     "chosen": "512", "answer": "1024", "correct": False},
    {"question": "Which type is immutable?", "topic": "Python",
     "chosen": "tuple", "answer": "tuple", "correct": True},
    {"question": "What is 17 // 5?", "topic": "Math",
     "chosen": "3.4", "answer": "3", "correct": False},
]

wrong = [r for r in results if not r["correct"]]
print(f"Review your mistakes ({len(wrong)}):")
for r in wrong:
    print(f"  - {r['question']}")
    print(f"    You chose: {r['chosen']}. Correct: {r['answer']}.")
```

```text
Review your mistakes (2):
  - What is 2 ** 10?
    You chose: 512. Correct: 1024.
  - What is 17 // 5?
    You chose: 3.4. Correct: 3.
```

Storing `chosen` and `answer` in each result is what makes this review possible. When you design the results, think about what the report will need.

## The full program

Here is everything in one file. Copy it into `quiz.py` and run it.

```python
import random

random.seed(3)  # same order every run while testing; delete this line for real quizzes

# ---------- Step 1: the questions ----------

QUESTIONS = [
    {"question": "What is the capital of Uzbekistan?",
     "options": ["Samarkand", "Tashkent", "Bukhara", "Khiva"],
     "answer": "Tashkent", "topic": "Geography"},
    {"question": "Which city is famous for the Registan square?",
     "options": ["Samarkand", "Namangan", "Nukus", "Termez"],
     "answer": "Samarkand", "topic": "Geography"},
    {"question": "Which sea is shared by Uzbekistan and Kazakhstan?",
     "options": ["Black Sea", "Caspian Sea", "Aral Sea", "Red Sea"],
     "answer": "Aral Sea", "topic": "Geography"},
    {"question": "What does len([3, 1, 2]) return?",
     "options": ["2", "3", "6", "[1, 2, 3]"],
     "answer": "3", "topic": "Python"},
    {"question": "Which type is immutable?",
     "options": ["list", "dict", "set", "tuple"],
     "answer": "tuple", "topic": "Python"},
    {"question": "What does a function return without a return statement?",
     "options": ["0", "None", "False", "an empty string"],
     "answer": "None", "topic": "Python"},
    {"question": "What is 15% of 80,000 som?",
     "options": ["8,000 som", "12,000 som", "15,000 som", "1,200 som"],
     "answer": "12,000 som", "topic": "Math"},
    {"question": "What is 2 ** 10?",
     "options": ["20", "100", "512", "1024"],
     "answer": "1024", "topic": "Math"},
    {"question": "What is 17 // 5?",
     "options": ["3", "3.4", "2", "4"],
     "answer": "3", "topic": "Math"},
]

LETTERS = "ABCD"


# ---------- Step 2: show a question ----------

def format_question(number, total, question, options):
    """Return the question and its lettered options as one string."""
    lines = [f"Question {number}/{total} [{question['topic']}]",
             question["question"]]
    for letter, option in zip(LETTERS, options):
        lines.append(f"  {letter}) {option}")
    return "\n".join(lines)


# ---------- Step 3: check an answer ----------

def letter_to_option(letter, options):
    """Turn 'b' or 'B' into the matching option, or None if invalid."""
    letter = letter.strip().upper()
    if len(letter) != 1 or letter not in LETTERS[:len(options)]:
        return None
    return options[LETTERS.index(letter)]


def check_answer(question, chosen):
    return chosen == question["answer"]


# ---------- Step 4: ask the player ----------

def ask_question(number, total, question, options):
    """Ask until the player types a valid letter. Return the option or None to quit."""
    print(format_question(number, total, question, options))
    while True:
        reply = input("Your answer (A-D, or quit): ").strip()
        if reply.lower() == "quit":
            return None
        chosen = letter_to_option(reply, options)
        if chosen is not None:
            return chosen
        print("  Please type A, B, C, or D.")


# ---------- Step 5: shuffling ----------

def shuffled(items):
    """Return a new list in random order. The original list is not changed."""
    return random.sample(items, len(items))


# ---------- Step 6: scoring ----------

def score_by_topic(results):
    """Return {topic: {"correct": n, "total": n}}."""
    scores = {}
    for result in results:
        topic_score = scores.setdefault(result["topic"], {"correct": 0, "total": 0})
        topic_score["total"] += 1
        if result["correct"]:
            topic_score["correct"] += 1
    return scores


def percentage(correct, total):
    if total == 0:
        return 0.0
    return round(correct / total * 100, 1)


def grade(percent):
    if percent >= 90:
        return "A"
    if percent >= 75:
        return "B"
    if percent >= 60:
        return "C"
    if percent >= 40:
        return "D"
    return "F"


# ---------- Step 7: results and review ----------

def show_results(results):
    if not results:
        print("\nNo questions answered.")
        return
    correct = sum(1 for r in results if r["correct"])
    total = len(results)
    percent = percentage(correct, total)
    print("\n=== Results ===")
    print(f"Score: {correct}/{total} ({percent}%)  Grade: {grade(percent)}")

    print("\nBy topic:")
    for topic, s in sorted(score_by_topic(results).items()):
        topic_percent = percentage(s["correct"], s["total"])
        print(f"  {topic:<10} {s['correct']}/{s['total']}  {topic_percent:>5}%")

    wrong = [r for r in results if not r["correct"]]
    if wrong:
        print("\nReview your mistakes:")
        for r in wrong:
            print(f"  - {r['question']}")
            print(f"    You chose: {r['chosen']}. Correct: {r['answer']}.")
    else:
        print("\nPerfect score. Well done!")


def run_quiz(questions):
    results = []
    order = shuffled(questions)
    for number, question in enumerate(order, start=1):
        options = shuffled(question["options"])
        print()
        chosen = ask_question(number, len(order), question, options)
        if chosen is None:
            print("Quiz stopped early.")
            break
        is_correct = check_answer(question, chosen)
        print("  Correct!" if is_correct else f"  Wrong. The answer is {question['answer']}.")
        results.append({
            "question": question["question"],
            "topic": question["topic"],
            "chosen": chosen,
            "answer": question["answer"],
            "correct": is_correct,
        })
    show_results(results)


print("=== Uzbekistan and Python Quiz ===")
run_quiz(QUESTIONS)
```

A real session. The player types an invalid letter once and makes three mistakes:

```text
=== Uzbekistan and Python Quiz ===

Question 1/9 [Python]
What does len([3, 1, 2]) return?
  A) 6
  B) [1, 2, 3]
  C) 2
  D) 3
Your answer (A-D, or quit): D
  Correct!

Question 2/9 [Geography]
Which sea is shared by Uzbekistan and Kazakhstan?
  A) Red Sea
  B) Aral Sea
  C) Caspian Sea
  D) Black Sea
Your answer (A-D, or quit): e
  Please type A, B, C, or D.
Your answer (A-D, or quit): B
  Correct!

Question 3/9 [Math]
What is 2 ** 10?
  A) 100
  B) 20
  C) 512
  D) 1024
Your answer (A-D, or quit): C
  Wrong. The answer is 1024.

Question 4/9 [Python]
Which type is immutable?
  A) list
  B) set
  C) tuple
  D) dict
Your answer (A-D, or quit): C
  Correct!

Question 5/9 [Math]
What is 17 // 5?
  A) 3
  B) 3.4
  C) 4
  D) 2
Your answer (A-D, or quit): B
  Wrong. The answer is 3.

Question 6/9 [Geography]
What is the capital of Uzbekistan?
  A) Khiva
  B) Bukhara
  C) Tashkent
  D) Samarkand
Your answer (A-D, or quit): C
  Correct!

Question 7/9 [Math]
What is 15% of 80,000 som?
  A) 1,200 som
  B) 15,000 som
  C) 12,000 som
  D) 8,000 som
Your answer (A-D, or quit): C
  Correct!

Question 8/9 [Python]
What does a function return without a return statement?
  A) False
  B) 0
  C) an empty string
  D) None
Your answer (A-D, or quit): B
  Wrong. The answer is None.

Question 9/9 [Geography]
Which city is famous for the Registan square?
  A) Termez
  B) Samarkand
  C) Namangan
  D) Nukus
Your answer (A-D, or quit): B
  Correct!

=== Results ===
Score: 6/9 (66.7%)  Grade: C

By topic:
  Geography  3/3  100.0%
  Math       1/3   33.3%
  Python     2/3   66.7%

Review your mistakes:
  - What is 2 ** 10?
    You chose: 512. Correct: 1024.
  - What is 17 // 5?
    You chose: 3.4. Correct: 3.
  - What does a function return without a return statement?
    You chose: 0. Correct: None.
```

Walk through the output:

- `e` was rejected, and question 2 was asked again without counting anything.
- 6 correct out of 9 is 66.7%, which is at least 60, so the grade is C.
- Every topic appears in the report, sorted by name, because `sorted()` on `.items()` sorts by key.
- The review lists exactly the three `results` where `correct` is `False`.

## Testing the pure functions

Pure functions are easy to test: call them with known input and `assert` the result. In a real project you would keep these tests in a separate file. Here the functions are repeated so the block runs on its own:

```python
LETTERS = "ABCD"

def letter_to_option(letter, options):
    letter = letter.strip().upper()
    if len(letter) != 1 or letter not in LETTERS[:len(options)]:
        return None
    return options[LETTERS.index(letter)]

def check_answer(question, chosen):
    return chosen == question["answer"]

def score_by_topic(results):
    scores = {}
    for result in results:
        topic_score = scores.setdefault(result["topic"], {"correct": 0, "total": 0})
        topic_score["total"] += 1
        if result["correct"]:
            topic_score["correct"] += 1
    return scores

def percentage(correct, total):
    if total == 0:
        return 0.0
    return round(correct / total * 100, 1)

def grade(percent):
    if percent >= 90:
        return "A"
    if percent >= 75:
        return "B"
    if percent >= 60:
        return "C"
    if percent >= 40:
        return "D"
    return "F"


def test_letter_to_option():
    options = ["list", "dict", "set", "tuple"]
    assert letter_to_option("A", options) == "list"
    assert letter_to_option(" d ", options) == "tuple"
    assert letter_to_option("E", options) is None
    assert letter_to_option("", options) is None
    assert letter_to_option("AB", options) is None
    assert letter_to_option("C", ["yes", "no"]) is None   # only A and B exist

def test_check_answer():
    question = {"answer": "tuple"}
    assert check_answer(question, "tuple")
    assert not check_answer(question, "list")

def test_score_by_topic():
    results = [
        {"topic": "Math", "correct": True},
        {"topic": "Math", "correct": False},
        {"topic": "Python", "correct": True},
    ]
    assert score_by_topic(results) == {
        "Math": {"correct": 1, "total": 2},
        "Python": {"correct": 1, "total": 1},
    }
    assert score_by_topic([]) == {}

def test_percentage():
    assert percentage(3, 4) == 75.0
    assert percentage(2, 3) == 66.7
    assert percentage(0, 0) == 0.0

def test_grade_boundaries():
    assert grade(100) == "A"
    assert grade(90) == "A"
    assert grade(89.9) == "B"
    assert grade(60) == "C"
    assert grade(40) == "D"
    assert grade(0) == "F"


tests = [test_letter_to_option, test_check_answer, test_score_by_topic,
         test_percentage, test_grade_boundaries]
for test in tests:
    test()
    print("passed:", test.__name__)
```

```text
passed: test_letter_to_option
passed: test_check_answer
passed: test_score_by_topic
passed: test_percentage
passed: test_grade_boundaries
```

Functions are values, so the loop can call each test from the list. Every function also knows its own name: `test.__name__` is the text you wrote after `def`, which is why each line shows which test passed.

Good tests cover normal cases, **edge cases** (empty input, `0 / 0`), and **boundaries**: `grade(90)` and `grade(89.9)` check exactly where A turns into B. If you later change a threshold by mistake, a test fails immediately.

## Try it

A compact quiz with three questions and a random order on every run. Type your answers (A, B, C, or D) in **Values for input()**, one per line. Then add your own question to the list.

<ClientOnly><PythonPlayground :code='"import random\n\nQUESTIONS = [\n    {\"question\": \"What is the capital of Uzbekistan?\",\n     \"options\": [\"Samarkand\", \"Tashkent\", \"Bukhara\", \"Khiva\"], \"answer\": \"Tashkent\"},\n    {\"question\": \"Which type is immutable?\",\n     \"options\": [\"list\", \"dict\", \"set\", \"tuple\"], \"answer\": \"tuple\"},\n    {\"question\": \"What is 17 // 5?\",\n     \"options\": [\"3\", \"3.4\", \"2\", \"4\"], \"answer\": \"3\"},\n]\nLETTERS = \"ABCD\"\n\n\ndef letter_to_option(letter, options):\n    letter = letter.strip().upper()\n    if len(letter) != 1 or letter not in LETTERS:\n        return None\n    return options[LETTERS.index(letter)]\n\n\ndef ask(question, options):\n    print(question[\"question\"])\n    for letter, option in zip(LETTERS, options):\n        print(f\"  {letter}) {option}\")\n    while True:\n        chosen = letter_to_option(input(\"Answer: \"), options)\n        if chosen is not None:\n            return chosen\n        print(\"  Please type A, B, C, or D.\")\n\n\nscore = 0\nfor q in random.sample(QUESTIONS, len(QUESTIONS)):\n    chosen = ask(q, random.sample(q[\"options\"], len(q[\"options\"])))\n    if chosen == q[\"answer\"]:\n        score += 1\n        print(\"  Correct!\")\n    else:\n        print(\"  Wrong. The answer is\", q[\"answer\"])\n\nprint(f\"Score: {score}/{len(QUESTIONS)}\")"' /></ClientOnly>

## Common mistakes

### 1. Using the result of `random.shuffle()`

```py
import random
questions = ["q1", "q2", "q3"]
order = random.shuffle(questions)
for question in order:
    print(question)
```

```text
TypeError: 'NoneType' object is not iterable
```

`shuffle()` changes the list in place and returns `None`. **Fix:** use `order = random.sample(questions, len(questions))`, which returns a new list and leaves the original alone.

### 2. Comparing the letter with the answer

```python
question = {"options": ["Samarkand", "Tashkent"], "answer": "Tashkent"}
reply = "B"

print(reply == question["answer"])                     # Bad: "B" vs "Tashkent"
print(question["options"][1] == question["answer"])    # Good: compare option text
```

```text
False
True
```

The player can never score. **Fix:** convert the letter into the option first (`letter_to_option`), then compare text with text.

### 3. Accepting an empty answer

```python
LETTERS = "ABCD"
reply = ""                   # the player just pressed Enter

print(reply in LETTERS)      # Bad: looks valid
print(LETTERS.index(reply))  # and silently means option A
```

```text
True
0
```

**Fix:** check `len(letter) == 1` as well as `letter in LETTERS`, and add a test for `""`.

### 4. Dividing by zero when nobody answered

```py
results = []                 # the player typed quit at the first question
correct = sum(1 for r in results if r["correct"])
percent = correct / len(results) * 100
```

```text
ZeroDivisionError: division by zero
```

**Fix:** guard the division (`if total == 0: return 0.0`) and handle an empty `results` list before printing the report.

## Challenges

Try each one before opening the hints.

### 1. More questions and a new topic <Difficulty level="1" />

Add three questions about *History* (for example, Amir Temur or the Silk Road). The report should show the new topic without any other code changes.

::: details Hints
- Only `QUESTIONS` needs to change. If you had to edit a function, the design is not data-driven enough.
- Run the `all(q["answer"] in q["options"] ...)` check from Step 1 after adding them.
:::

### 2. Choose the number of questions <Difficulty level="1" />

Ask the player how many questions they want (from 1 to the number available), and ask only that many.

::: details Hints
- `random.sample(questions, k)` returns `k` random items, so `shuffled` can take a `count` parameter.
- Validate the number with `isdigit()` and a range check before converting.
:::

### 3. Pick a topic <Difficulty level="2" />

Before the quiz starts, show the available topics and let the player choose one, or `all`.

::: details Hints
- Build the menu from `sorted({q["topic"] for q in QUESTIONS})`, so new topics appear automatically.
- Write a pure function `filter_by_topic(questions, topic)` that returns a new list with a comprehension, and test it with `assert`.
:::

### 4. Points per question <Difficulty level="2" />

Give each question a `"points"` key (1 to 3, depending on difficulty). Show the score as points earned out of points possible, and per topic too.

::: details Hints
- Store `points` in each result dictionary.
- Change `score_by_topic` to add `points` instead of `1`. Update its test first, then the function.
- Use `q.get("points", 1)` so old questions without the key still work.
:::

### 5. Retry the mistakes <Difficulty level="3" />

After the report, offer to repeat only the questions the player got wrong, and keep going until everything is correct or the player types `quit`. At the end, show how many rounds it took.

::: details Hints
- Let `run_quiz` **return** the `results` list as well as printing the report.
- Build the next round with a comprehension: the original question dictionaries whose result was wrong. Store the whole question in each result to make this easy.
- Loop `while wrong_questions:` and count the rounds.
:::

## Recap

- Keep data (questions) separate from logic (functions). One list of dictionaries with the same keys can drive the whole program.
- Give every function one job. `format_question`, `letter_to_option`, `check_answer`, `score_by_topic`, `percentage`, and `grade` are pure.
- Keep `input()` and `print()` in a few outer functions, so the rest can be tested with `assert`.
- `random.sample(items, len(items))` returns a shuffled copy. `random.shuffle()` changes the list and returns `None`.
- `setdefault()` builds nested counters, such as correct and total answers per topic.
- Guard edge cases (an empty answer, an empty results list) and test boundaries, like the exact percentage where one grade turns into another.

## Further reading

- [`random.sample` and `random.shuffle`](https://docs.python.org/3/library/random.html#random.sample)
- [Dictionaries and `setdefault()`](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict)
- [Python tutorial: defining functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)
- [The `assert` statement](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)
