---
title: Choosing Test Cases
description: "Decide what to test: normal cases, boundaries and edge cases, invalid inputs, equivalence classes, every branch, tables of cases, regression tests, and knowing when you have enough."
---

# Choosing Test Cases

![Illustration: Choosing Test Cases](/images/topics-webp/choosing-test-cases.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- The three kinds of cases: **normal**, **edge**, and **invalid**
- How equivalence classes and branches tell you which inputs to pick
- How to write many cases as a **table** and check them in a loop
- How to test code that uses randomness, today's date, or `input()`
- How to write a regression test, and when you have enough tests
:::

## Why it matters

Writing `assert` is easy. Knowing **what** to assert is the real skill: a function can pass ten tests and still be wrong if all ten check the same easy case. So a tester asks "How could this break?" Most bugs hide at limits like `0` or "exactly 18", in empty lists, and in inputs nobody expected.

## Three kinds of test cases

A museum in Bukhara charges nothing under 7, 20,000 som under 18, and 40,000 som for adults; a negative age is an error. For almost every function, you want cases from three groups:

| Kind | Question | Examples for `ticket_price` |
|---|---|---|
| **Normal** | Does the usual case work? | `30`, `12`, `3` |
| **Edge** (boundary) | Does it work at the limits? | `0`, `6`, `7`, `17`, `18` |
| **Invalid** | Does it reject bad input correctly? | `-1` |

![Diagram: equivalence classes and boundary values](/images/companions-webp/equivalence-boundaries.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Invalid cases prove the function fails **in the way you promised**.

### Equivalence classes and branches

You cannot test every age, and you do not need to: `25`, `40`, and `63` go through the same code. Split the inputs into **equivalence classes**, groups of values the function treats the same way, and pick one typical value from each, plus the values at the **edges** between groups:

```text
    invalid   |  free   |  student   |       adult
  ... -2 -1   | 0 ... 6 | 7 ... 17   | 18 ... 120 ...
                ^     ^   ^     ^      ^
              edges: 0, 6, 7, 17, 18 (and -1 just outside)
```

A second way is to read the code: every `if`, `elif`, and `else` is a **branch**, and each needs at least one test. Classes (from the description) find cases the code forgot; branches (from the code) find paths the description never mentioned.

## A table of cases

Instead of one `assert` per case, put the cases in a list of `(input, expected)` tuples and loop over them:

```python
def ticket_price(age):
    if age < 0:
        raise ValueError("age cannot be negative")
    if age < 7:
        return 0          # small children are free
    if age < 18:
        return 20000      # students
    return 40000          # adults

def test_ticket_price():
    cases = [
        (30, 40000),   # normal adult
        (12, 20000),   # normal student
        (0, 0),        # edge: youngest possible
        (6, 0),        # edge: last free age
        (7, 20000),    # edge: first student age
        (18, 40000),   # edge: first adult age
    ]
    for age, expected in cases:
        result = ticket_price(age)
        assert result == expected, f"age {age}: expected {expected}, got {result}"

test_ticket_price()
print("All tests passed")
```

```text
All tests passed
```

Adding a case is one line, the comments say **why** each row is there, and the message names the failing case. The invalid age `-1` gets its own `try` / `except` / `else` test, as in *Testing with assert*, because its promise is an exception.

## Edge cases that find real bugs

A shop in Tashkent gives 5% off orders from 100,000 som and 10% off orders from 500,000 som. This version passes a quick check with `200000`:

```python
def discount_percent(total):
    if total >= 100000:
        return 5
    elif total >= 500000:
        return 10
    return 0

cases = [(50000, 0), (200000, 5), (800000, 10),   # one value per class
         (99999, 0), (100000, 5), (500000, 10)]   # edges

for total, expected in cases:
    result = discount_percent(total)
    if result != expected:
        print(f"{total}: expected {expected}%, got {result}%")
```

```text
800000: expected 10%, got 5%
500000: expected 10%, got 5%
```

The conditions are in the wrong order: every total of 500,000 or more also passes `>= 100000`, so the 10% branch can **never** run. One value from **each** class found the dead code.

## A checklist of edge cases

When you are not sure what to test, walk through this list:

| Input type | Edge cases to try |
|---|---|
| Numbers | `0`, `-1`, very large, one below / at / one above each limit |
| Strings | `""`, only spaces, upper vs lower case, leading/trailing spaces |
| Lists / dicts | empty, one item, duplicates, reverse sorted |
| Files / JSON | missing file, empty file, missing key |

Off-by-one errors (`<` versus `<=`, `range(n)` versus `range(n + 1)`) are among the most common bugs, so a limit of `18` means testing `17`, `18`, and `19`.

## Randomness, dates, and `input()`

A test must give the same answer every run, but code that calls `random`, `date.today()`, or `input()` does not. **Pass the changing thing in** as a parameter, with the real source as the default:

```python
import random
from datetime import date

def is_weekend(today=None):
    if today is None:
        today = date.today()
    return today.weekday() >= 5

def pick_winner(names, rng=random):
    return rng.choice(names)

def test_is_weekend():
    assert is_weekend(date(2026, 9, 19))        # a Saturday
    assert not is_weekend(date(2026, 9, 16))    # a Wednesday

def test_pick_winner():
    names = ["Aziza", "Bekzod", "Dilnoza", "Farrukh"]
    first = pick_winner(names, random.Random(42))
    second = pick_winner(names, random.Random(42))
    assert first == second, "the same seed should give the same winner"

test_is_weekend()
test_pick_winner()
print("All tests passed")
```

```text
All tests passed
```

The program gets today; the test picks the day. `random.Random(42)` is a generator with a fixed **seed**, so it makes the same choices every run. For `input()`, keep the call in the outer code and test a function that receives the typed text.

## Write the test before fixing the bug

When Dilnoza reports that `average([])` crashes the report page with `ZeroDivisionError`, first write `assert average([]) == 0.0` in a test and watch it **fail**: that proves the test really catches the bug. Then fix the function until the test passes. This **regression test** stays forever, so the bug cannot quietly come back. If you fix first and test later, you never see the test fail.

You have **enough tests** when every class, boundary, branch, promised error, and fixed bug has one. Ten well-chosen tests beat a hundred random ones.

## Try it

Find the bug the edge cases reveal, and fix it.

<ClientOnly><PythonPlayground :code='"def password_strength(password):\n    # \"weak\": fewer than 8 characters\n    # \"medium\": 8 to 11 characters\n    # \"strong\": 12 or more characters\n    if len(password) < 8:\n        return \"weak\"\n    if len(password) < 11:\n        return \"medium\"\n    return \"strong\"\n\ncases = [\n    (\"abc\", \"weak\"),\n    (\"sunflower\", \"medium\"),\n    (\"samarkand-bukhara\", \"strong\"),\n    (\"1234567\", \"weak\"),\n    (\"12345678\", \"medium\"),\n    (\"12345678901\", \"medium\"),\n    (\"123456789012\", \"strong\"),\n]\n\nfor password, expected in cases:\n    result = password_strength(password)\n    if result == expected:\n        print(f\"PASS  {password!r}\")\n    else:\n        print(f\"FAIL  {password!r}: expected {expected}, got {result}\")"' /></ClientOnly>

## Common mistakes

### 1. Calculating the expected value with the same logic

```py
def tax(price):
    return price * 12 // 10      # bug: should be // 100

price = 15000
assert tax(price) == price * 12 // 10   # Bad: copies the code, bug and all
assert tax(price) == 1800               # Good: an answer you worked out yourself
```

```text
AssertionError
```

The first assert passed, because it repeats the bug; only the second catches it. **Fix:** write expected values as plain numbers you worked out yourself.

### 2. A loop that hides which case failed

```py
def double(n):
    return n + n if n > 0 else 0

cases = [(2, 4), (5, 10), (-3, -6)]
for n, expected in cases:
    assert double(n) == expected
```

```text
AssertionError
```

Which case failed? **Fix:** add a message: `assert double(n) == expected, f"n={n}: expected {expected}, got {double(n)}"`.

## Practice

### 1. Pick the cases <Difficulty level="1" />

`can_rent_car(age)` returns `True` for ages 21 to 75 (both included). Write a table of at least 7 `(age, expected)` cases covering normal values and all edges.

::: details Solution
```python
def can_rent_car(age):
    return 21 <= age <= 75

cases = [(40, True), (10, False), (90, False),              # normal
         (20, False), (21, True), (75, True), (76, False)]  # edges
for age, expected in cases:
    result = can_rent_car(age)
    assert result == expected, f"age {age}: expected {expected}, got {result}"
print("All tests passed")
```

```text
All tests passed
```
:::

### 2. Find the off-by-one bug <Difficulty level="1" />

`count_up_to(n)` should return `[1, 2, ..., n]`. Test it with `n=1` and `n=0` too, then find and fix the bug:

```py
def count_up_to(n):
    return list(range(1, n))
```

::: details Solution
```python
def count_up_to(n):
    return list(range(1, n + 1))

cases = [(3, [1, 2, 3]), (1, [1]), (0, [])]
for n, expected in cases:
    result = count_up_to(n)
    assert result == expected, f"n={n}: expected {expected}, got {result}"
print("All tests passed")
```

```text
All tests passed
```
:::

### 3. Equivalence classes for shipping <Difficulty level="2" />

Shipping is free up to 1 kg, 20,000 som up to 5 kg, and 50,000 som above that. Weights of 0 or less raise `ValueError`. Write `shipping_cost(kg)` and test one value per class, the edges, and the invalid inputs.

::: details Solution
```python
def shipping_cost(kg):
    if kg <= 0:
        raise ValueError("weight must be positive")
    if kg <= 1:
        return 0
    if kg <= 5:
        return 20000
    return 50000

cases = [(0.5, 0), (3, 20000), (12, 50000),     # one per class
         (1, 0), (1.01, 20000), (5, 20000), (5.01, 50000)]   # edges
for kg, expected in cases:
    result = shipping_cost(kg)
    assert result == expected, f"{kg} kg: expected {expected}, got {result}"

for bad in [0, -2]:
    try:
        shipping_cost(bad)
    except ValueError:
        pass
    else:
        assert False, f"{bad} should raise ValueError"

print("All tests passed")
```

```text
All tests passed
```
:::

### 4. Regression test first <Difficulty level="2" />

`title_case("aziza  karimova")` (two spaces) keeps both spaces in the result. Write a regression test, confirm it fails with the version below, then fix the function.

```py
def title_case(name):
    return " ".join(part.capitalize() for part in name.split(" "))
```

::: details Solution
```python
def title_case(name):
    return " ".join(part.capitalize() for part in name.split())

def test_title_case_extra_spaces():
    # Regression: double spaces used to be kept in the result
    result = title_case("aziza  karimova")
    assert result == "Aziza Karimova", f"got {result!r}"

test_title_case_extra_spaces()
print("All tests passed")
```

```text
All tests passed
```

`split(" ")` keeps an empty string between the two spaces. `split()` drops it.
:::

### 5. Test a list function thoroughly <Difficulty level="3" />

Write `second_largest(numbers)`: the second largest **distinct** value, or `ValueError` if there is none. Test an unsorted list, a repeated largest value, exactly two items, and invalid lists (empty, one item, all equal).

::: details Solution
```python
def second_largest(numbers):
    distinct = sorted(set(numbers))
    if len(distinct) < 2:
        raise ValueError("need at least two different numbers")
    return distinct[-2]

cases = [([30, 10, 20], 20), ([50, 50, 40], 40), ([7, 3], 3)]
for numbers, expected in cases:
    result = second_largest(numbers)
    assert result == expected, f"{numbers}: expected {expected}, got {result}"

for bad in [[], [4], [8, 8, 8]]:
    try:
        second_largest(bad)
    except ValueError:
        pass
    else:
        assert False, f"{bad} should raise ValueError"

print("All tests passed")
```

```text
All tests passed
```

The duplicates case is the trap: `sorted(numbers)[-2]` gives `50` for `[50, 50, 40]`.
:::

## Recap

- Test three kinds of cases: **normal**, **edge**, and **invalid**.
- Pick one value per **equivalence class**, test around every limit, and run every branch.
- Put cases in a table of `(input, expected)` tuples and loop, with a message that names the failing case.
- Pass randomness, dates, and typed text **in** as parameters so tests give the same answer every run.
- Before fixing a bug, write a **regression test** that fails, then make it pass.

## Further reading

- [`unittest`: basic testing concepts](https://docs.python.org/3/library/unittest.html)
- [pytest: parametrizing tests (tables of cases)](https://docs.pytest.org/en/stable/how-to/parametrize.html)
- [`str.split()`](https://docs.python.org/3/library/stdtypes.html#str.split)
