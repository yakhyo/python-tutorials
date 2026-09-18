---
title: Raising and Custom Exceptions
description: "Signal problems from your own functions with raise: choosing the right built-in exception, re-raising, raise from, simple custom exception classes, assert vs raise, and writing helpful error messages."
---

# Raising and Custom Exceptions

![Illustration: Raising and Custom Exceptions](/images/topics-webp/raising-and-custom-exceptions.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- How to **raise** an exception when a function gets invalid arguments, and which built-in type fits
- How to re-raise with `raise`, and chain or hide the cause with `from e` and `from None`
- How to create your own exception types, a small hierarchy of them, and one that carries data
- When to use `assert` instead of `raise`, and how to write error messages that help
:::

## Why it matters

Your own functions meet problems Python cannot detect: `withdraw(balance, -50000)` is valid arithmetic, but nonsense for a bank. Returning `None` or `-1` is easy to ignore, and the bug appears far from its cause. Raising an exception stops the wrong action **immediately**, with a clear message, and lets the caller decide what to do.

## `raise` an exception

`raise` creates an exception on purpose. Write the exception type and pass a message. The function stops at that line, and the exception travels up to the caller, which can catch it as usual:

```python
def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError(f"amount must be positive, got {amount}")
    if amount > balance:
        raise ValueError(f"cannot withdraw {amount:,} som, balance is {balance:,} som")
    return balance - amount

balance = 250000
for amount in [50000, -1000, 900000]:
    try:
        balance = withdraw(balance, amount)
        print(f"Withdrew {amount:,}. New balance: {balance:,}")
    except ValueError as e:
        print(f"Refused: {e}")
```

```text
Withdrew 50,000. New balance: 200,000
Refused: amount must be positive, got -1000
Refused: cannot withdraw 900,000 som, balance is 200,000 som
```

The function only **detects** the problem; the caller decides what to do. Put such checks at the top, like the guard clauses from *Return Values*.

## Choosing the right built-in exception

Callers often catch by type, so pick the exception whose meaning matches the problem:

| Exception | Raise it when |
|---|---|
| `ValueError` | the type is right but the value is not allowed |
| `TypeError` | the argument has the wrong type |
| `KeyError` | a key or ID is not found in a mapping |
| `LookupError` | something is not found, and a sentence explains it better |
| `NotImplementedError` | a feature is planned but not written yet |

A typical type check is `if not isinstance(percent, (int, float)): raise TypeError(...)`. Two details: `bool` is a subclass of `int`, so `isinstance(True, int)` is `True`; and a `KeyError` always shows its message in quotes (`raise KeyError("P999")` prints `'P999'`), so use it for a single key and `LookupError` or `ValueError` for a sentence.

## Re-raising and chaining

To **react** to an error (say, log it) and still let it reach the caller, use a bare `raise` inside `except`:

```py
except KeyError:
    print(f"[log] price lookup failed for {product!r}")
    raise
```

A low-level `KeyError: 'Nukus'` says nothing about **what** the program was doing. Raise a clearer exception, naming the original with `as e` and linking it with `from e`:

```python
rates = {"Tashkent": 20000, "Samarkand": 35000}

def delivery_cost(city):
    try:
        return rates[city]
    except KeyError as e:
        raise ValueError(f"we do not deliver to {city}") from e

try:
    delivery_cost("Nukus")
except ValueError as e:
    print(e)
    print("caused by:", repr(e.__cause__))
```

```text
we do not deliver to Nukus
caused by: KeyError('Nukus')
```

If nobody catches it, the traceback shows **both** errors, joined by "The above exception was the direct cause of the following exception". Without `from`, it says "During handling of the above exception, another exception occurred", which looks like a second bug.

When the original error adds nothing, hide it with `from None`. The traceback then shows only your exception:

```py
    except KeyError:
        raise ValueError(f"we do not deliver to {city}") from None
```

Use `from e` when the cause helps debugging (a failed file read, say), and `from None` when your message already says everything.

## Your own exception types

Exceptions named after your app's problems, like `OutOfStockError`, let callers catch exactly that situation. Create one **base** exception and specific ones under it:

![Diagram: an application error hierarchy](/images/companions-webp/app-error-hierarchy.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

```python
class ShopError(Exception):
    pass

class OutOfStockError(ShopError):
    pass

class UnknownProductError(ShopError):
    pass

stock = {"tea": 5, "samsa": 0}

def buy(product, quantity):
    if product not in stock:
        raise UnknownProductError(f"no product called {product!r}")
    if stock[product] < quantity:
        raise OutOfStockError(f"only {stock[product]} {product} left, wanted {quantity}")
    stock[product] -= quantity

for product, quantity in [("tea", 2), ("samsa", 3), ("cake", 1)]:
    try:
        buy(product, quantity)
        print(f"Bought {quantity} {product}")
    except OutOfStockError as e:
        print(f"Sorry: {e}")
    except ShopError as e:
        print(f"Order failed ({type(e).__name__}): {e}")
```

```text
Bought 2 tea
Sorry: only 0 samsa left, wanted 3
Order failed (UnknownProductError): no product called 'cake'
```

Classes come properly in *Classes and Objects*; for now, read `class ShopError(Exception): pass` as "a **new exception type** under `Exception`, with nothing extra". `OutOfStockError(ShopError)` is its child, so `except ShopError` catches every shop problem, while bugs such as `NameError` are not hidden. You can also inherit from a built-in: `class InvalidPhoneError(ValueError)` is caught by `except ValueError` too. End the names with `Error`, like the built-in ones.

::: info An exception that carries data
A `pass` class is enough for now. Once you know classes, an exception can also store values, so the caller does not have to parse the message:

```python
class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        super().__init__(f"need {amount:,} som, balance is {balance:,} som")
        self.balance = balance
        self.amount = amount

try:
    raise InsufficientFundsError(120000, 300000)
except InsufficientFundsError as e:
    print(f"Payment declined: {e}")
    print(f"Missing: {e.amount - e.balance:,} som")
```

```text
Payment declined: need 300,000 som, balance is 120,000 som
Missing: 180,000 som
```

`__init__` and `super()` are explained in *Classes and Objects* and *Inheritance and super()*.
:::

## `assert` vs `raise`

`assert condition, message` (from *Designing Good Functions*) raises `AssertionError` when the condition is false. Its job is different:

| | `assert` | `raise SomeError(message)` |
|---|---|---|
| Purpose | catch **programmer mistakes** ("this should never happen") | report **expected problems** (bad input, missing data) |
| Can be switched off | <Yes /> (`python -O` skips all asserts) | <No /> |

Because asserts can be disabled, never use them to check user input or money amounts.

## Writing good error messages

A good message says **what** was wrong, **what value** was received, and ideally **what is allowed**: `"quantity must be a whole number, got '2.5'"` instead of `"invalid input"`, `"month must be 1-12, got 13"` instead of `"bad date"`. Use `!r` so empty text is visible (`got ''`), start in lowercase like Python's own messages, and never include passwords.

## Try it

Add a daily limit to `transfer` with its own custom exception, and catch it.

<ClientOnly><PythonPlayground :code='"class BankError(Exception):\n    pass\n\nclass InsufficientFundsError(BankError):\n    pass\n\ndef transfer(balance, amount):\n    if amount <= 0:\n        raise ValueError(f\"amount must be positive, got {amount}\")\n    if amount > balance:\n        raise InsufficientFundsError(f\"balance is {balance:,} som, cannot send {amount:,}\")\n    return balance - amount\n\nbalance = 300000\nfor amount in [100000, -5000, 450000, 150000]:\n    try:\n        balance = transfer(balance, amount)\n        print(f\"Sent {amount:,} som. Balance: {balance:,} som\")\n    except BankError as e:\n        print(f\"Bank said no: {e}\")\n    except ValueError as e:\n        print(f\"Invalid amount: {e}\")"' /></ClientOnly>

## Common mistakes

### 1. Raising the class name as a string

```py
raise "ValueError: amount is negative"
```

```text
TypeError: exceptions must derive from BaseException
```

Raise an exception object: `raise ValueError("amount is negative")`.

### 2. Returning an error instead of raising it

```py
# Bad:
def withdraw(balance, amount):
    if amount > balance:
        return "error: not enough money"
    return balance - amount

balance = withdraw(1000, 5000)
print(balance - 100)
```

```text
TypeError: unsupported operand type(s) for -: 'str' and 'int'
```

The error string was stored in `balance`, and the program crashed later, somewhere else. Raise at the source instead.

### 3. Forgetting `Exception` in a custom class

```py
class OutOfStockError:
    pass

raise OutOfStockError("no tea left")
```

```text
TypeError: OutOfStockError() takes no arguments
```

Without `(Exception)` it is an ordinary class, not an exception. Write `class OutOfStockError(Exception):`.

## Practice

### 1. Validate a score <Difficulty level="1" />

Write `check_score(score)` that returns the score, or raises `ValueError` if it is not 0-100. Test `85` and `120`.

::: details Solution
```python
def check_score(score):
    if not 0 <= score <= 100:
        raise ValueError(f"score must be between 0 and 100, got {score}")
    return score

for score in [85, 120]:
    try:
        print(check_score(score))
    except ValueError as e:
        print(f"Error: {e}")
```

```text
85
Error: score must be between 0 and 100, got 120
```
:::

### 2. Type and value checks <Difficulty level="1" />

Write `make_ticket(passengers)` for a Tashkent-Samarkand train: raise `TypeError` if `passengers` is not an `int` and `ValueError` if it is not 1-6, else return `f"Ticket for {passengers}"`. Test `2`, `"2"` and `9`.

::: details Solution
```python
def make_ticket(passengers):
    if not isinstance(passengers, int):
        raise TypeError(f"passengers must be an int, got {type(passengers).__name__}")
    if not 1 <= passengers <= 6:
        raise ValueError(f"passengers must be 1-6, got {passengers}")
    return f"Ticket for {passengers}"

for value in [2, "2", 9]:
    try:
        print(make_ticket(value))
    except (TypeError, ValueError) as e:
        print(f"{type(e).__name__}: {e}")
```

```text
Ticket for 2
TypeError: passengers must be an int, got str
ValueError: passengers must be 1-6, got 9
```
:::

### 3. Library exceptions <Difficulty level="2" />

Create `LibraryError` with two children, `BookNotFoundError` and `BookAlreadyBorrowedError`. Write `borrow(library, title)`, where `library` maps titles to `True` (available) or `False` (borrowed): raise the right exception, or mark the book borrowed. Borrow `"Python Basics"` twice and `"Dune"` once, catching `LibraryError`.

::: details Solution
```python
class LibraryError(Exception):
    pass

class BookNotFoundError(LibraryError):
    pass

class BookAlreadyBorrowedError(LibraryError):
    pass

def borrow(library, title):
    if title not in library:
        raise BookNotFoundError(f"no book titled {title!r}")
    if not library[title]:
        raise BookAlreadyBorrowedError(f"{title!r} is already borrowed")
    library[title] = False

library = {"Python Basics": True, "Samarkand Travel Guide": True}

for title in ["Python Basics", "Python Basics", "Dune"]:
    try:
        borrow(library, title)
        print(f"Borrowed {title}")
    except LibraryError as e:
        print(f"{type(e).__name__}: {e}")
```

```text
Borrowed Python Basics
BookAlreadyBorrowedError: 'Python Basics' is already borrowed
BookNotFoundError: no book titled 'Dune'
```
:::

### 4. Translate the error <Difficulty level="2" />

With `exchange_rates = {"USD": 12600, "EUR": 13700}`, write `to_som(amount, currency)`. For an unknown currency, raise `ValueError("unsupported currency: ...")` **from** the original `KeyError`. Print `e` and `e.__cause__` for `to_som(10, "GBP")`.

::: details Solution
```python
exchange_rates = {"USD": 12600, "EUR": 13700}

def to_som(amount, currency):
    try:
        rate = exchange_rates[currency]
    except KeyError as e:
        raise ValueError(f"unsupported currency: {currency}") from e
    return amount * rate

print(to_som(10, "USD"))
try:
    to_som(10, "GBP")
except ValueError as e:
    print(e)
    print(repr(e.__cause__))
```

```text
126000
unsupported currency: GBP
KeyError('GBP')
```
:::

### 5. A clean quantity error <Difficulty level="3" />

Create `QuantityError(ValueError)`. Write `parse_quantity(text)` that converts `text` with `int()`: if that fails, raise `QuantityError` `from None`; also raise it for a quantity below 1. For `"3"`, `"three"` and `"0"`, print the result, or the error and its `__cause__`.

::: details Solution
```python
class QuantityError(ValueError):
    pass

def parse_quantity(text):
    try:
        quantity = int(text)
    except ValueError:
        raise QuantityError(f"quantity must be a whole number, got {text!r}") from None
    if quantity < 1:
        raise QuantityError(f"quantity must be at least 1, got {quantity}")
    return quantity

for text in ["3", "three", "0"]:
    try:
        print(parse_quantity(text))
    except QuantityError as e:
        print(f"Error: {e} (cause: {e.__cause__})")
```

```text
3
Error: quantity must be a whole number, got 'three' (cause: None)
Error: quantity must be at least 1, got 0 (cause: None)
```
:::

## Recap

- `raise ValueError("message")` stops a function and hands the error to the caller. Pick the type that matches the problem.
- A bare `raise` re-raises; `from e` keeps the cause, `from None` hides it.
- `class MyError(Exception): pass` creates a custom exception; a base class with children lets callers catch broadly or precisely.
- `assert` is for programmer checks; `raise` is for input and data.
- Good messages say what was wrong, what was received, and what is allowed.

## Further reading

- [Python Tutorial: Raising Exceptions and User-defined Exceptions](https://docs.python.org/3/tutorial/errors.html#raising-exceptions)
- [The `raise` statement (language reference)](https://docs.python.org/3/reference/simple_stmts.html#the-raise-statement)
- [The `assert` statement (language reference)](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)
- [PEP 3134: Exception Chaining](https://peps.python.org/pep-3134/)
