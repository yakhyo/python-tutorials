---
title: Type Hints
description: "Document what your functions and classes expect and return: annotating variables, parameters, and returns, list[int] and dict[str, float], optional values with X | None, Callable, hints in classes, Protocol, type aliases, and why hints are not checked at runtime."
---

# Type Hints

![Illustration: Type Hints](/images/topics-webp/type-hints.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- What type hints are and why to write them
- How to annotate variables, parameters, return values, and collections (`list[int]`, `dict[str, float]`)
- How to write optional values (`str | None`), function parameters (`Callable`), and classes that refer to themselves
- How `Protocol` and `type` aliases describe larger ideas
- Why hints are **not** enforced when the program runs
:::

## Why it matters

In `def calculate(items, rate, rounding):`, is `items` a list or a dictionary? Is `rate` `12` or `0.12`? With **type hints** the signature answers without making you read the body:

```py
def calculate(items: list[float], rate: float, rounding: int = 0) -> float:
    ...
```

Hints are **documentation** inside the code. **Editors** use them to autocomplete and underline mistakes, and **type checkers** such as mypy or pyright report wrong calls before you run anything.

## Variables and functions

Write `name: type` for variables and parameters, and `-> type` for the return value:

```python
scores: dict[str, list[int]] = {}           # an empty dict filled later


def average(numbers: list[float]) -> float:
    return sum(numbers) / len(numbers)


def greet(name: str, times: int = 1) -> str:
    return " ".join([f"Salom, {name}!"] * times)


scores.setdefault("Aziza", []).append(91)
print(scores, average([4.5, 5.0, 3.5]))
print(greet("Bekzod", times=2))
```

```text
{'Aziza': [91]} 4.333333333333333
Salom, Bekzod! Salom, Bekzod!
```

Simple variables rarely need hints, but an empty collection deserves one. With a default, the hint comes first: `times: int = 1`. A function that returns nothing gets `-> None`.

## Collections and optional values

Put item types in square brackets; tuples describe each **position**. Use `|` ("or") for a value that may be missing or have several types:

| Hint | Meaning | Example value |
|---|---|---|
| `list[int]` / `set[str]` | a list of ints / a set of strings | `[90, 85]` / `{"tea"}` |
| `dict[str, float]` | string keys, float values | `{"USD": 12650.0}` |
| `tuple[str, int]` / `tuple[int, ...]` | a string then an int / any number of ints | `("Aziza", 20)` / `(1, 2, 3)` |
| `str \| None` | a string or `None` | `None` |

```python
def find_phone(contacts: dict[str, str], name: str) -> str | None:
    return contacts.get(name)


contacts = {"Aziza": "+998901234567"}
for name in ["Aziza", "Dilnoza"]:
    phone = find_phone(contacts, name)
    if phone is None:
        print(f"{name}: no phone saved")
    else:
        print(f"{name}: {phone[-4:]}")
```

```text
Aziza: 4567
Dilnoza: no phone saved
```

`str | None` warns the caller to check for `None` first.

## Functions as arguments: `Callable`

For a function parameter, use `Callable` from `collections.abc`: a list of parameter types, then the return type:

```python
from collections.abc import Callable


def apply_discount(prices: list[int], rule: Callable[[int], int]) -> list[int]:
    return [rule(p) for p in prices]


print(apply_discount([50_000, 8_000], lambda p: round(p * 0.9)))
```

```text
[45000, 7200]
```

`Callable[[int], int]` is "a function taking an `int` and returning an `int`". For data you cannot describe, `typing.Any` switches checking off; use it sparingly.

## Hints are not enforced at runtime

Python stores hints but **does not check them** when the code runs:

```python
def line_total(price: int, qty: int) -> int:
    return price * qty


print(line_total(25_000, 3))
print(line_total("100", 3))         # wrong type, no error
```

```text
75000
100100100
```

`"100" * 3` repeats the string. A type checker would flag this call **before** running, but bad **data** from users and files still needs `if` checks and `raise`. You need both.

::: info What Python 3.14 changed (PEP 649)
Python 3.14 evaluates annotations **lazily**, only when something reads them. So a hint may name a class defined later, and `annotationlib` can read hints as strings:

```python
import annotationlib


def ship(order: Order) -> Receipt:     # neither class exists yet
    ...


print(annotationlib.get_annotations(ship, format=annotationlib.Format.STRING))
```

```text
{'order': 'Order', 'return': 'Receipt'}
```
:::

## Hints in classes

Annotate methods like functions (`self` needs no hint). Your own classes are types too, and thanks to lazy annotations a class can name **itself**:

```python
from typing import Self


class Money:
    def __init__(self, amount: int, currency: str = "UZS") -> None:
        self.amount = amount
        self.currency = currency

    def add(self, other: Money) -> Money:
        return Money(self.amount + other.amount, self.currency)

    def __repr__(self) -> str:
        return f"Money({self.amount:,} {self.currency})"


class Counter:
    def __init__(self) -> None:
        self.count = 0

    def tick(self) -> Self:
        self.count += 1
        return self


class LoudCounter(Counter):
    pass


print(Money(150_000).add(Money(35_000)))
c = LoudCounter().tick().tick()
print(type(c).__name__, c.count)
```

```text
Money(185,000 UZS)
LoudCounter 2
```

`typing.Self` means "the class this method was called on", so `LoudCounter().tick()` is known to be a `LoudCounter`.

## `Protocol`: hints for duck typing

With duck typing, any object with the right method works. `Protocol` says that in a hint, without inheritance:

```python
from typing import Protocol


class Notifier(Protocol):
    def send(self, to: str, text: str) -> bool: ...


class SmsNotifier:                      # does NOT inherit from Notifier
    def send(self, to: str, text: str) -> bool:
        print(f"SMS to {to}: {text}")
        return True


def remind(notifier: Notifier, person: str) -> bool:
    return notifier.send(person, "Meeting at 10:00")


print(remind(SmsNotifier(), "Aziza"))
```

```text
SMS to Aziza: Meeting at 10:00
True
```

A type checker accepts `SmsNotifier` because its `send` has the right signature.

## Type aliases

Give a long hint a name with the `type` statement:

```python
type Grades = dict[str, list[int]]


def best_student(grades: Grades) -> str:
    return max(grades, key=lambda name: sum(grades[name]) / len(grades[name]))


print(best_student({"Aziza": [90, 95], "Bekzod": [70, 81]}))
print(type(Grades).__name__)
```

```text
Aziza
TypeAliasType
```

The alias is a `TypeAliasType`, not a dict, so use it only in hints: `Grades()` raises `TypeError`.

::: info In older code
Existing projects use older spellings:

- `Optional[str]`, `Union[int, float]`, `List[int]`, `Dict[str, float]` (from `typing`).
- `Grades = dict[str, list[int]]` instead of the `type` statement.
- Quoted class names (`-> "Money"`) or `from __future__ import annotations`, needed before 3.14 for a class naming itself. The future import turns every hint into a string, and PEP 749 schedules it for deprecation (no sooner than the first release after 3.13 reaches end of life) and later removal, so do not add it to new code.
:::

## Try it

Pass wrong types at the bottom (like a string for `qty`) and see that the hints do not stop the call.

<ClientOnly><PythonPlayground :code='"from dataclasses import dataclass\n\n\n@dataclass\nclass LineItem:\n    name: str\n    price: int\n    qty: int = 1\n\n\ndef subtotal(item: LineItem) -> int:\n    return item.price * item.qty\n\n\ndef order_total(items: list[LineItem], discount: float | None = None) -> int:\n    total = sum(subtotal(i) for i in items)\n    if discount is not None:\n        total = round(total * (1 - discount))\n    return total\n\n\ncart = [LineItem(\"Samsa\", 8000, 3), LineItem(\"Tea\", 5000)]\nprint(order_total(cart))\nprint(order_total(cart, discount=0.1))\nprint(order_total.__annotations__)"' /></ClientOnly>

## Common mistakes

### 1. Asking for a `list` when any collection would do

```python
def average(scores: list[int]) -> float:
    return sum(scores) / len(scores)

print(average((80, 90)))                    # a tuple: runs fine
print(average({"a": 1, "b": 3}.values()))   # dict values: runs fine
```

```text
85.0
2.0
```

Both run, but a type checker rejects them: neither is a `list`. **Fix:** hint what the function **needs**, from `collections.abc`: `Sequence[int]` (lists, tuples), `Collection[int]` (anything with `len()`, dict values too), or `Iterable[int]` (anything you can loop over).

### 2. Promising a value that might be `None`

```py
def find_email(users: dict[str, str], name: str) -> str:      # hint lies
    return users.get(name)

email = find_email({"aziza": "aziza@mail.uz"}, "bekzod")
print(email.upper())
```

```text
AttributeError: 'NoneType' object has no attribute 'upper'
```

`dict.get()` can return `None`, so the honest hint is `-> str | None`, which tells the caller to check first.

### 3. Writing the wrong syntax for collection hints

```py
def total(prices: [int]) -> int: ...             # Bad: a list containing int
def pair() -> (int, int): ...                    # Bad: a tuple of types
def count(prices: list(int)) -> int: ...         # Bad: not a type (fails when tools read the hints)

count.__annotations__
```

```text
TypeError: 'type' object is not iterable
```

The lines run, but tools cannot use them. **Fix:** `list[int]`, `tuple[int, int]`.

## Practice

### 1. Annotate the functions <Difficulty level="1" />

Add type hints to these functions, then call each one:

```py
def is_adult(age):
    return age >= 18

def word_lengths(words):
    return {w: len(w) for w in words}
```

::: details Solution
```python
def is_adult(age: int) -> bool:
    return age >= 18


def word_lengths(words: list[str]) -> dict[str, int]:
    return {w: len(w) for w in words}


print(is_adult(17))
print(word_lengths(["tea", "samsa", "plov"]))
```

```text
False
{'tea': 3, 'samsa': 5, 'plov': 4}
```
:::

### 2. Optional search <Difficulty level="1" />

Write `first_long_word(words: list[str], min_length: int) -> str | None` (the first word that long, or `None`). For `["sun", "river", "mountain"]` and limits 5 and 10, print the word in uppercase, or `No word with 10+ letters`.

::: details Solution
```python
def first_long_word(words: list[str], min_length: int) -> str | None:
    for word in words:
        if len(word) >= min_length:
            return word
    return None


words = ["sun", "river", "mountain"]
for limit in [5, 10]:
    found = first_long_word(words, limit)
    if found is None:
        print(f"No word with {limit}+ letters")
    else:
        print(found.upper())
```

```text
RIVER
No word with 10+ letters
```
:::

### 3. Typed statistics <Difficulty level="2" />

Write `summarize(values: list[float]) -> tuple[float, float]` returning the min and max, and `apply_to_all(values: list[float], func: Callable[[float], float]) -> list[float]`. Convert `[31.0, 38.0, 29.5]` from Celsius to Fahrenheit and summarize both lists.

::: details Solution
```python
from collections.abc import Callable


def summarize(values: list[float]) -> tuple[float, float]:
    return min(values), max(values)


def apply_to_all(values: list[float], func: Callable[[float], float]) -> list[float]:
    return [func(v) for v in values]


celsius = [31.0, 38.0, 29.5]
fahrenheit = apply_to_all(celsius, lambda c: c * 9 / 5 + 32)
print(summarize(celsius), summarize(fahrenheit))
```

```text
(29.5, 38.0) (85.1, 100.4)
```
:::

### 4. Design from a description: parking garage <Difficulty level="2" />

A Tashkent garage has numbered spots, and cars are identified by plate strings. Design a fully annotated `Garage` storing occupied spots in a `dict[int, str]`, with `park(plate)` (returning the spot, or `None` when full) and `free_spots()`. With 2 spots, park three cars, then print the free spots.

::: details Solution
```python
class Garage:
    def __init__(self, capacity: int) -> None:
        self.capacity = capacity
        self.spots: dict[int, str] = {}

    def park(self, plate: str) -> int | None:
        for spot in self.free_spots():
            self.spots[spot] = plate
            return spot
        return None

    def free_spots(self) -> list[int]:
        return [s for s in range(1, self.capacity + 1) if s not in self.spots]


g = Garage(2)
for plate in ["01A777AA", "10B123CD", "30C555EF"]:
    print(plate, "->", g.park(plate))
print("Free:", g.free_spots())
```

```text
01A777AA -> 1
10B123CD -> 2
30C555EF -> None
Free: []
```
:::

### 5. Protocol-based report <Difficulty level="3" />

Define a `Protocol` called `Priced` with a method `price() -> int`. Create two unrelated dataclasses that satisfy it, `Hotel` (nights, per_night) and `Flight` (cost), and write `trip_total(things: list[Priced]) -> int`. Print each item's class name and price, then the total.

::: details Solution
```python
from dataclasses import dataclass
from typing import Protocol


class Priced(Protocol):
    def price(self) -> int: ...


@dataclass
class Hotel:
    nights: int
    per_night: int

    def price(self) -> int:
        return self.nights * self.per_night


@dataclass
class Flight:
    cost: int

    def price(self) -> int:
        return self.cost


def trip_total(things: list[Priced]) -> int:
    for thing in things:
        print(f"{type(thing).__name__:<7} {thing.price():>9,}")
    return sum(t.price() for t in things)


print(f"Total   {trip_total([Flight(780_000), Hotel(2, 450_000)]):>9,}")
```

```text
Flight    780,000
Hotel     900,000
Total   1,680,000
```

Neither class inherits from `Priced`.
:::

## Recap

- Hints describe what a function takes and returns: `def f(x: list[int]) -> str:`.
- Use `X | None` for values that may be missing, and `Callable[[args], return]` for functions.
- Your own classes are types, and on 3.14 a class can name itself in hints.
- `Protocol` describes duck-typed interfaces, and `type Name = ...` names a long hint.
- Hints are **not** enforced at runtime. Type checkers check them; `if`/`raise` still validates data.

## Further reading

- [`typing` module documentation](https://docs.python.org/3/library/typing.html)
- [`annotationlib` module](https://docs.python.org/3/library/annotationlib.html)
- [Type hints cheat sheet (mypy docs)](https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html)
- [PEP 649: Deferred evaluation of annotations](https://peps.python.org/pep-0649/)
