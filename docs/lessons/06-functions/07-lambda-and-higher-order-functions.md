---
title: Lambdas and Higher-Order Functions
description: "Treat functions as values: pass them to other functions, write short lambda functions, sort with custom keys, use map() and filter(), and return functions from functions."
---

# Lambdas and Higher-Order Functions

![Illustration: Lambdas and Higher-Order Functions](/images/topics-webp/lambda-and-higher-order-functions.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- That functions are **values**, and what a **higher-order function** is
- How to write small anonymous functions with `lambda`
- How to sort, find `min`/`max`, and group with custom `key` functions
- How `map()` and `filter()` compare with comprehensions
- How to create functions that build other functions
:::

## Why it matters

You've already written `sorted(names, key=str.lower)`: you handed a **function** to another function, and it used it for you. Instead of writing a new sorting loop for every situation, you write one small function that says *what* to compare, and reuse Python's fast, tested sorting. The same idea powers event handlers and data pipelines.

## Functions are values

A function name refers to a function object, just like a variable name refers to a number or string. You can assign it to another name, put it in a list, or pass it around:

```python
def shout(text):
    return text.upper() + "!"

def whisper(text):
    return text.lower() + "..."

speak = shout              # no parentheses: the function itself
print(speak("hello"))

for style in [shout, whisper]:
    print(style("Good morning"))
```

```text
HELLO!
GOOD MORNING!
good morning...
```

Functions can even be values in a dictionary, which is a neat replacement for a long `if`/`elif` chain:

```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

operations = {"+": add, "-": subtract}

print(operations["+"](10, 4))
print(operations["-"](10, 4))
```

```text
14
6
```

## Higher-order functions

A **higher-order function** is a function that takes another function as an argument, or returns a function. Here's one you can write yourself:

```python
def apply_to_all(func, items):
    """Return a new list with func applied to every item."""
    return [func(item) for item in items]

def double(n):
    return n * 2

print(apply_to_all(double, [1, 2, 3]))
print(apply_to_all(str.upper, ["a", "b"]))
```

```text
[2, 4, 6]
['A', 'B']
```

`apply_to_all` doesn't care what `func` does; it just calls it.

## `lambda`: tiny anonymous functions

Defining a whole function just to pass `double` somewhere feels heavy. A **lambda** creates a small function in a single expression:

```text
lambda parameters: expression
```

```python
double = lambda n: n * 2       # the same as def double(n): return n * 2
print(double(21))

add = lambda a, b: a + b
print(add(3, 4))
```

```text
42
7
```

Rules of a lambda:

- It can contain only **one expression**, whose value is returned automatically. No `return` keyword, and no statements like `if` blocks, loops, or assignments.
- It has no name of its own, which is why it's called **anonymous**.

Assigning a lambda to a name, as above, is legal but discouraged by PEP 8; the examples above do it only to compare with `def`. If it deserves a name, use `def`. Lambdas are meant to be written **directly where they're used**, as arguments:

```py
print(apply_to_all(lambda n: n ** 2, [1, 2, 3]))
```

```text
[1, 4, 9]
```

A conditional expression works inside a lambda, written right where it's used:

```python
print(list(map(lambda score: "pass" if score >= 60 else "fail", [75, 40])))
```

```text
['pass', 'fail']
```

## Sorting with `key`

This is where you'll use lambdas the most. The `key` function receives **one item** and returns the value to sort by:

```python
students = [
    {"name": "Aziza", "age": 20, "score": 92},
    {"name": "Bekzod", "age": 22, "score": 85},
    {"name": "Dilnoza", "age": 19, "score": 97},
]

by_age = sorted(students, key=lambda s: s["age"])
by_score = sorted(students, key=lambda s: s["score"], reverse=True)

print([s["name"] for s in by_age])
print([s["name"] for s in by_score])
```

```text
['Dilnoza', 'Aziza', 'Bekzod']
['Dilnoza', 'Aziza', 'Bekzod']
```

More key examples:

```python
products = [("Tea", 15000), ("Coffee", 45000), ("Juice", 12000)]
words = ["banana", "Apple", "cherry", "fig"]

print(sorted(products, key=lambda p: p[1]))              # by price
print(sorted(words, key=lambda w: w.lower()))            # ignoring case
print(sorted(words, key=lambda w: (len(w), w.lower())))  # by length, then alphabetically
```

```text
[('Juice', 12000), ('Tea', 15000), ('Coffee', 45000)]
['Apple', 'banana', 'cherry', 'fig']
['fig', 'Apple', 'banana', 'cherry']
```

Returning a **tuple** from the key sorts by several criteria: first by the first value, and ties by the second. To reverse one numeric criterion, negate it: `key=lambda s: (-s["score"], s["name"])`.

`min()` and `max()` accept the same `key`:

```python
students = [
    {"name": "Aziza", "score": 92},
    {"name": "Bekzod", "score": 85},
]

best = max(students, key=lambda s: s["score"])
print(best["name"])
```

```text
Aziza
```

## `map()` and `filter()`

Two classic higher-order functions:

- `map(func, items)` applies `func` to every item.
- `filter(func, items)` keeps the items for which `func` returns a truthy value.

Both return lazy iterators: printing one shows only `<map object at 0x...>`, so wrap them in `list()` to see the results:

```python
numbers = [1, 2, 3, 4, 5, 6]

squares = list(map(lambda n: n * n, numbers))
evens = list(filter(lambda n: n % 2 == 0, numbers))

print(squares)
print(evens)
```

```text
[1, 4, 9, 16, 25, 36]
[2, 4, 6]
```

The equivalent comprehensions are `[n * n for n in numbers]` and `[n for n in numbers if n % 2 == 0]`. In Python, **comprehensions are usually preferred**, because they read more naturally. `map` is neat when you already have a named function:

```python
raw = ["12", " 7", "30 "]
print(list(map(int, raw)))          # int() ignores surrounding spaces
print(list(map(str.strip, raw)))
```

```text
[12, 7, 30]
['12', '7', '30']
```

## Functions that return functions

A function can build and return a **new** function. The inner function remembers the values from the outer one (a *closure*, introduced in *Variable Scope*):

This is a "function factory": configure once, use many times.

```python
def make_price_formatter(currency, decimals=0):
    def formatter(amount):
        return f"{amount:,.{decimals}f} {currency}"
    return formatter

som = make_price_formatter("som")
usd = make_price_formatter("USD", decimals=2)

print(som(1250000))
print(usd(99.5))
```

```text
1,250,000 som
99.50 USD
```

::: details Advanced: lambdas created in a loop
```python
functions = [lambda: i for i in range(3)]
print([f() for f in functions])

functions = [lambda i=i: i for i in range(3)]
print([f() for f in functions])
```

```text
[2, 2, 2]
[0, 1, 2]
```

Each lambda in the first list looks up `i` **when it's called**, and by then the loop has finished with `i = 2`. Binding the current value as a default argument, `lambda i=i: i`, fixes it.
:::

## A glimpse of `functools`

The standard library's `functools` module has more tools for working with functions. Two you may meet (the `from ... import ...` line loads them, and *Modules and Imports* explains how imports work):

```python
from functools import reduce, partial

numbers = [1, 2, 3, 4]
product = reduce(lambda acc, n: acc * n, numbers)   # combine items into one value
print(product)

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)                  # pre-fill an argument
print(square(9))
```

```text
24
81
```

For most everyday tasks, a loop, a comprehension, or `sum()` is clearer than `reduce()`.

## When to use a lambda

| Use a lambda when… | Use `def` when… |
|---|---|
| it's a short expression passed straight into `sorted`, `max`, `map`, … | it needs a name to be reused |
| it fits comfortably on one line | it needs several statements, loops, or error handling |
| its meaning is obvious from context | it deserves a docstring or tests |

## Try it

Sort and filter the product list in different ways. Try sorting by name length, or keeping only products under 20,000.

<ClientOnly><PythonPlayground :code='"products = [\n    {\"name\": \"Tea\", \"price\": 15000, \"rating\": 4.6},\n    {\"name\": \"Coffee\", \"price\": 45000, \"rating\": 4.8},\n    {\"name\": \"Juice\", \"price\": 12000, \"rating\": 4.1},\n    {\"name\": \"Lemonade\", \"price\": 18000, \"rating\": 4.6},\n]\n\ncheapest = min(products, key=lambda p: p[\"price\"])\nprint(\"Cheapest:\", cheapest[\"name\"])\n\nranked = sorted(products, key=lambda p: (-p[\"rating\"], p[\"price\"]))\nfor p in ranked:\n    print(p[\"name\"], p[\"rating\"], p[\"price\"])\n\nprint(list(map(lambda p: p[\"name\"].upper(), products)))"' /></ClientOnly>

## Common mistakes

### 1. Calling the function instead of passing it

```py
sorted(["b", "A"], key=str.lower())
```

```text
TypeError: unbound method str.lower() needs an argument
```

**Fix:** `key=str.lower`, without parentheses.

### 2. Statements inside a lambda

```py
f = lambda x: return x * 2
```

```text
SyntaxError: invalid syntax
```

A lambda body is a single expression, with no `return`, assignments, or loops. **Fix:** `lambda x: x * 2`, or use `def`.

### 3. Looping over a map object twice

```python
result = map(str.upper, ["a", "b"])
print(list(result))
print(list(result))
```

```text
['A', 'B']
[]
```

A `map` or `filter` object hands out its items only **once**; after that it's empty, with no error. **Fix:** convert it once, `upper = list(map(...))`, and reuse the list.

## Practice

### 1. Sort by last letter <Difficulty level="1" />

Sort `words = ["python", "java", "rust", "go", "kotlin"]` by their **last** letter.

::: details Solution
```python
words = ["python", "java", "rust", "go", "kotlin"]
print(sorted(words, key=lambda w: w[-1]))
```

```text
['java', 'python', 'kotlin', 'go', 'rust']
```

`"python"` and `"kotlin"` both end with `n`, so they keep their original order (stable sort).
:::

### 2. Longest and shortest <Difficulty level="1" />

For `cities = ["Tashkent", "Nukus", "Samarkand", "Jizzakh", "Urgench"]`, print the longest and shortest names using `max` and `min` with `key`.

::: details Solution
```python
cities = ["Tashkent", "Nukus", "Samarkand", "Jizzakh", "Urgench"]
print(max(cities, key=len))
print(min(cities, key=len))
```

```text
Samarkand
Nukus
```
:::

### 3. Leaderboard, the short way <Difficulty level="2" />

Redo the leaderboard from *Working with Lists and Sorting* with a **single** `sorted()` call: sort by points (highest first), then by name alphabetically ignoring case.

```python
players = [("ali", 120), ("Vali", 95), ("gani", 120), ("Sami", 150), ("Doni", 95)]
```

::: details Solution
```python
players = [("ali", 120), ("Vali", 95), ("gani", 120), ("Sami", 150), ("Doni", 95)]

ranked = sorted(players, key=lambda p: (-p[1], p[0].lower()))

for rank, (name, points) in enumerate(ranked, start=1):
    print(f"{rank}. {name:<5}{points:>4}")
```

```text
1. Sami  150
2. ali   120
3. gani  120
4. Doni   95
5. Vali   95
```

Negating the points sorts them in descending order, while the names stay ascending.
:::

### 4. Your own filter <Difficulty level="2" />

Write `keep_if(predicate, items)` that returns a list of the items for which `predicate(item)` is `True`, without using `filter()`. Use it with a lambda to keep the words that start with a capital letter.

::: details Solution
```python
def keep_if(predicate, items):
    return [item for item in items if predicate(item)]

words = ["Tashkent", "river", "Aziza", "book", "Python"]
print(keep_if(lambda w: w[0].isupper(), words))
```

```text
['Tashkent', 'Aziza', 'Python']
```
:::

### 5. Discount rules <Difficulty level="3" />

Write `make_discount(percent, minimum=0)` that returns a function. The returned function takes a price and returns the discounted price, but only if the price is **at least** `minimum`. Otherwise it returns the price unchanged. Then apply several rules to a list of prices, and print the best (lowest) price for each.

```py
rules = [make_discount(10), make_discount(20, minimum=100000), make_discount(30, minimum=500000)]
prices = [50000, 150000, 600000]
```

::: details Solution
```python
def make_discount(percent, minimum=0):
    def apply(price):
        if price >= minimum:
            return price * (1 - percent / 100)
        return price
    return apply

rules = [make_discount(10), make_discount(20, minimum=100000), make_discount(30, minimum=500000)]
prices = [50000, 150000, 600000]

for price in prices:
    best = min(rule(price) for rule in rules)
    print(f"{price:>8,} → {best:>10,.0f}")
```

```text
  50,000 →     45,000
 150,000 →    120,000
 600,000 →    420,000
```

Adding a new discount rule means adding one line to `rules`, without touching the loop.
:::

## Recap

- Functions are **values**, and a **higher-order function** takes or returns them: `sorted`, `max`, `map`, and your own.
- `lambda params: expression` creates a small anonymous function. Use it inline, and use `def` for anything bigger.
- `key=lambda item: …` controls sorting, `min`, and `max`. Return a tuple to sort by several criteria.
- `map` and `filter` return lazy iterators, and comprehensions are usually more readable.
- Functions can build functions that remember their configuration (closures).

## Further reading

- [Python Tutorial - Lambda expressions](https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions)
- [Functional programming HOWTO](https://docs.python.org/3/howto/functional.html)
- [Sorting techniques - key functions](https://docs.python.org/3/howto/sorting.html#key-functions)
- [`functools` module](https://docs.python.org/3/library/functools.html)
