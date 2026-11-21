---
title: Common Loop Patterns
description: "The loop patterns programmers use every day: counting, summing, finding the largest value, searching, building strings, running totals, enumerate(), and zip()."
---

# Common Loop Patterns

![Illustration: Common Loop Patterns](/images/topics-webp/loop-patterns.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- The **counter** and **accumulator** patterns: counting, summing, and averaging
- The **best-so-far** pattern: finding the largest or smallest item
- The **search** pattern: is there a match, and where is it?
- **Building** strings and **running totals** step by step
- Looping with positions using `enumerate()`, and over two sequences at once with `zip()`
:::

## Why it matters

Once you've written a few loops, you'll notice the same shapes coming up again and again. Experienced programmers don't invent each loop from scratch. They recognize the **pattern** a problem needs and fill in the details. Learn these patterns and most loop problems become quick to solve.

Most examples loop over a list of test scores, written in square brackets as in *for Loops and range()*. Everything else lists can do comes in *Lists*.

```python
scores = [72, 95, 58, 88, 64, 91]
```

## 1. Counter: how many?

Start at `0`, add `1` when an item matches:

```python
scores = [72, 95, 58, 88, 64, 91]

passed = 0
for score in scores:
    if score >= 60:
        passed += 1

print(f"{passed} of {len(scores)} passed")
```

```text
5 of 6 passed
```

## 2. Accumulator: total, product, average

Start with a neutral value, and combine each item into it:

```python
scores = [72, 95, 58, 88, 64, 91]

total = 0
for score in scores:
    total += score

average = total / len(scores)
print(f"Total: {total}, average: {average:.1f}")
```

```text
Total: 468, average: 78.0
```

| Goal | Start with | Update |
|---|---|---|
| Sum | `0` | `total += x` |
| Product | `1` | `product *= x` |
| Build a string | `""` | `text += x` |
| Count | `0` | `count += 1` |

For simple sums, Python has a built-in: `sum(scores)`. It's still worth knowing the loop, because the pattern works for anything you can combine.

## 3. Best so far: maximum and minimum

Remember the best item seen so far, and replace it when you find a better one:

```python
scores = [72, 95, 58, 88, 64, 91]

highest = scores[0]          # start with the first item
for score in scores:
    if score > highest:
        highest = score

print(f"Highest: {highest}")
```

```text
Highest: 95
```

`scores[0]` is the first item, just as `text[0]` is the first character of a string. Start with the **first item**, not `0`: if all values were negative, starting at `0` would give a wrong answer.

The built-ins `max(scores)` and `min(scores)` do this for you. The loop version is needed when you want **more than the value**, for example the name of the best student. You'll write that with `zip()` below.

## 4. Search: is there one?

Loop until you find a match, then stop with `break`:

```python
scores = [72, 95, 58, 88, 64, 91]

first_fail = None
for score in scores:
    if score < 60:
        first_fail = score
        break

if first_fail is None:
    print("Nobody failed")
else:
    print(f"First failing score: {first_fail}")
```

```text
First failing score: 58
```

`None` is Python's special "no value" marker. It's a good starting value when nothing has been found yet. Check for it with `is None`, as you saw in *Booleans and Comparisons*.

If you only need yes or no, a flag works just as well: start with `found = False`, and set it to `True` before the `break`.

## 5. Build a string

Start with `""` and add a piece on each iteration. Adding a character only when it passes a test **filters** the text:

```python
phone = "+998 (90) 123-45-67"

digits = ""
for char in phone:
    if char.isdecimal():
        digits += char

print(digits)
```

```text
998901234567
```

The same pattern can change characters as it goes:

```python
word = "banana"

result = ""
for letter in word:
    if letter == "a":
        result += "*"
    else:
        result += letter

print(result)
```

```text
b*n*n*
```

## 6. Running total

Keep an accumulator **and** show it at every step:

```python
daily_sales = [120, 80, 150, 60]

running = 0
for day_sales in daily_sales:
    running += day_sales
    print(f"+{day_sales:>4}  → {running:>4}")
```

```text
+ 120  →  120
+  80  →  200
+ 150  →  350
+  60  →  410
```

## Positions with `enumerate()`

Often you need both the **item** and its **position**. Instead of managing a counter, use `enumerate()`:

```python
tasks = ["write report", "call client", "review code"]

for number, task in enumerate(tasks, start=1):
    print(f"{number}. {task}")
```

```text
1. write report
2. call client
3. review code
```

`enumerate()` gives pairs of `(position, item)`, and `number, task` unpacks each pair into two variables. Without `start=1`, counting starts at `0`.

Prefer `enumerate()` over `for i in range(len(tasks)):` whenever you need the item itself.

### Search: where is it?

Combine `enumerate()` with the search pattern, and use the loop `else` from *break, continue, and else* for "not found":

```python
scores = [72, 95, 58, 88, 64, 91]

for position, score in enumerate(scores):
    if score < 60:
        print(f"First failing score {score} is at position {position}")
        break
else:
    print("Nobody failed")
```

```text
First failing score 58 is at position 2
```

Positions start at `0`, so `58` is at position `2`: the third item.

## Two sequences at once with `zip()`

`zip()` walks through several sequences **side by side**:

```python
names = ["Aziza", "Bekzod", "Dilnoza"]
marks = [81, 94, 88]

for name, mark in zip(names, marks):
    print(f"{name:<8} {mark}")
```

```text
Aziza    81
Bekzod   94
Dilnoza  88
```

With `zip()`, the best-so-far pattern can remember the name as well as the mark:

```python
names = ["Aziza", "Bekzod", "Dilnoza"]
marks = [81, 94, 88]

best_name = names[0]
best_mark = marks[0]
for name, mark in zip(names, marks):
    if mark > best_mark:
        best_name = name
        best_mark = mark

print(f"Top student: {best_name} ({best_mark})")
```

```text
Top student: Bekzod (94)
```

## Looping backwards with `reversed()`

```python
for n in reversed(range(1, 4)):
    print(n)
print("Go!")
```

```text
3
2
1
Go!
```

## Choosing a pattern

| The question asks… | Pattern |
|---|---|
| "How many…?" | Counter |
| "What's the total / average…?" | Accumulator |
| "Which is the largest / cheapest / longest…?" | Best so far |
| "Is there any… / find the first…" | Search with `break` |
| "Where is the first…?" | Search with `enumerate()` |
| "Keep only some characters" / "Change each letter" | Build a string |
| "Show the progress at each step" | Running total |

## Try it

Analyze temperatures for a week: count hot days, find the coldest day's name, and compute the average.

<ClientOnly><PythonPlayground :code='"days = [\"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\", \"Sun\"]\ntemps = [31, 35, 28, 37, 33, 26, 30]\n\nhot_days = 0\ncoldest_day, coldest = days[0], temps[0]\ntotal = 0\n\nfor day, temp in zip(days, temps):\n    total += temp\n    if temp >= 33:\n        hot_days += 1\n    if temp < coldest:\n        coldest_day, coldest = day, temp\n\nprint(f\"Hot days: {hot_days}\")\nprint(f\"Coldest: {coldest_day} ({coldest}°C)\")\nprint(f\"Average: {total / len(temps):.1f}°C\")"' /></ClientOnly>

## Common mistakes

### 1. Starting max/min at 0

```python
values = [-5, -2, -9]

highest = 0
for value in values:
    if value > highest:
        highest = value

print(f"Highest: {highest}")
```

```text
Highest: 0
```

`0` isn't even in the list. **Fix:** start with the first item, `highest = values[0]`.

### 2. Averaging an empty sequence

```py
values = []
print(sum(values) / len(values))
```

```text
ZeroDivisionError: division by zero
```

Check that there's data first: `if values:`. The same goes for the best-so-far pattern: `values[0]` on an empty list raises `IndexError: list index out of range`.

### 3. Forgetting `break` in a search

```python
scores = [72, 95, 58, 88, 54, 91]

first_fail = None
for score in scores:
    if score < 60:
        first_fail = score      # no break

print(f"First failing score: {first_fail}")
```

```text
First failing score: 54
```

Without `break`, the loop keeps going and later matches overwrite earlier ones, so "find the **first**" becomes "find the **last**". **Fix:** add `break` after the assignment.

### 4. Using `zip()` on sequences of different lengths

```python
names = ["Aziza", "Bekzod", "Dilnoza"]
marks = [81, 94]                # one mark is missing

for name, mark in zip(names, marks):
    print(f"{name:<8} {mark}")
```

```text
Aziza    81
Bekzod   94
```

No error: `zip()` silently stops at the shortest sequence, and Dilnoza disappears. If the lengths should match, compare `len(names)` and `len(marks)` before the loop.

## Practice

### 1. Count long words <Difficulty level="1" />

Count how many words in `"Python makes repetitive tasks simple and fun"` have more than 4 letters.

::: details Solution
```python
sentence = "Python makes repetitive tasks simple and fun"

count = 0
for word in sentence.split():
    if len(word) > 4:
        count += 1

print(count)
```

```text
5
```
:::

### 2. Longest word <Difficulty level="1" />

Find the longest word in the same sentence using the best-so-far pattern.

::: details Solution
```python
sentence = "Python makes repetitive tasks simple and fun"
words = sentence.split()

longest = words[0]
for word in words:
    if len(word) > len(longest):
        longest = word

print(longest)
```

```text
repetitive
```
:::

### 3. Numbered shopping list <Difficulty level="2" />

Given `items = ["bread", "milk", "eggs"]` and `prices = [6000, 12000, 18000]`, print a numbered list with prices, then the total. Use `zip()`, a counter, and an accumulator:

```text
1. bread    6,000
2. milk    12,000
3. eggs    18,000
Total: 36,000
```

::: details Solution
```python
items = ["bread", "milk", "eggs"]
prices = [6000, 12000, 18000]

number = 0
total = 0
for item, price in zip(items, prices):
    number += 1
    total += price
    print(f"{number}. {item:<6} {price:>7,}")

print(f"Total: {total:,}")
```
:::

### 4. Capitalize every other letter <Difficulty level="2" />

Turn `"python loops"` into `"PyThOn lOoPs"`: uppercase the characters at even positions and lowercase the others (count spaces as positions too).

::: details Solution
```python
text = "python loops"

result = ""
for i, char in enumerate(text):
    if i % 2 == 0:
        result += char.upper()
    else:
        result += char.lower()

print(result)
```
:::

### 5. Stock analysis <Difficulty level="3" />

Given daily closing prices `prices = [100, 104, 101, 110, 108, 115, 112]`, print:

1. the biggest one-day **increase** and which day it happened (day numbers start at 1),
2. how many days the price went **down** compared with the day before,
3. whether the price ever dropped **below the first day's price**.

::: details Solution
```python
prices = [100, 104, 101, 110, 108, 115, 112]

biggest_rise = 0
rise_day = None
down_days = 0

for day in range(1, len(prices)):
    change = prices[day] - prices[day - 1]
    if change > biggest_rise:
        biggest_rise = change
        rise_day = day + 1        # human day numbers start at 1
    if change < 0:
        down_days += 1

dropped_below_start = False
for price in prices:
    if price < prices[0]:
        dropped_below_start = True
        break

print(f"Biggest rise: +{biggest_rise} on day {rise_day}")
print(f"Down days: {down_days}")
print(f"Dropped below start: {dropped_below_start}")
```

```text
Biggest rise: +9 on day 4
Down days: 3
Dropped below start: False
```

Here, `range(1, len(prices))` is the right tool, because each step compares an item with the **previous** one. The second loop is a search with a flag.
:::

## Recap

- **Counter:** start at `0`, add `1` on a match. **Accumulator:** start neutral (`0`, `1`, `""`) and combine.
- **Best so far:** start with the first item and replace it when you find something better. `max()`/`min()` cover simple cases.
- **Search:** loop and `break` on the first match. Use `None` or a flag for "not found yet", or a loop `else`.
- **Build strings** with `+=`, adding only the characters you want. A **running total** prints the accumulator at each step.
- `enumerate()` gives positions, `zip()` pairs up sequences (and stops at the shortest), and `reversed()` goes backwards.

## Further reading

- [Built-in functions: `enumerate()`, `zip()`, `reversed()`, `sum()`, `max()`](https://docs.python.org/3/library/functions.html)
- [Python Tutorial - Looping techniques](https://docs.python.org/3/tutorial/datastructures.html#looping-techniques)
