---
title: Handling Exceptions
description: "Catch and handle errors with try and except: specific exceptions, else and finally, the exception hierarchy, how errors travel through function calls, and retry loops for user input."
---

# Handling Exceptions

![Illustration: Handling Exceptions](/images/topics-webp/exceptions.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- How `try` and `except` stop an error from crashing your program
- How to catch **specific** exceptions and read the message with `as e`
- What `else` and `finally` add, and why a bare `except:` is a bad idea
- How the exception **hierarchy** works and how errors travel up through calls
- EAFP versus LBYL, and a retry loop for user input
:::

## Why it matters

Real programs meet bad data all the time: a user types `abc` where you expected a number, a file was deleted, a product code is not in the dictionary. So far, each of these has **crashed** your program. Exception handling lets you say: "try this, and if this particular thing goes wrong, do that instead."

## `try` and `except`

When Python cannot do what a line asks, it **raises an exception**: an object that describes the problem, such as `ValueError: invalid literal for int() with base 10: '15 000'`. If nothing handles it, the program stops with a traceback (see *Reading Errors and Debugging*). Put the risky code inside `try`, and Python jumps to the matching `except` block instead of crashing:

```python
text = "15 000"

try:
    price = int(text)
    print(f"Price: {price} som")
except ValueError:
    print(f"'{text}' is not a whole number")

print("The program keeps going")
```

```text
'15 000' is not a whole number
The program keeps going
```

`int(text)` raises `ValueError`, so the rest of `try` is **skipped**, the `except` block runs, and the program continues. Without an exception, `except` is skipped.

## Catching specific exceptions

Always name the exception you expect. Four appear constantly: `ValueError` (right type, wrong value, like `int("abc")`), `ZeroDivisionError` (`100 / 0`), `KeyError` (a missing dictionary key) and `FileNotFoundError` (opening a file that does not exist). A specific `except` does **not** hide other errors, so a typo in your code still shows up.

One `try` can have several `except` blocks. Python checks them from top to bottom and runs the **first** one that matches. Writing `except ValueError as e` stores the exception object in `e`, and printing `e` shows its message:

```python
def split_bill(total_text, people_text):
    try:
        total = int(total_text)
        people = int(people_text)
        share = total / people
    except ValueError as e:
        return f"Not a whole number: {e}"
    except ZeroDivisionError:
        return "There must be at least one person"
    return f"Each person pays {share:,.0f} som"

print(split_bill("240000", "4"))
print(split_bill("240k", "4"))
print(split_bill("240000", "0"))
```

```text
Each person pays 60,000 som
Not a whole number: invalid literal for int() with base 10: '240k'
There must be at least one person
```

When two exceptions need the **same** handling, list them in a tuple: `except (TypeError, ZeroDivisionError):`. `except Exception as e` catches almost any error. Use it at the **top level** of a program, where you report any problem and keep going; inside normal functions it is a wide net that can catch bugs you would rather see.

## `else` and `finally`

A `try` statement has two more optional parts: `else` runs only if the `try` block raised **no** exception, and `finally` runs **always**.

```python
def read_amount(text):
    try:
        amount = int(text)
    except ValueError:
        print(f"  '{text}' rejected")
    else:
        print(f"  {amount:,} som accepted")
    finally:
        print("  check finished")

read_amount("50000")
read_amount("fifty")
```

```text
  50,000 som accepted
  check finished
  'fifty' rejected
  check finished
```

Why `else` instead of more lines in `try`? It keeps `try` small, so you only catch errors from the line you expect to fail.

`finally` is for clean-up, such as closing a connection. It runs even after a `return` or an error nobody catches. The order is always `try`, `except`, `else`, `finally`.

## Why a bare `except:` is bad

`except:` with no type catches **everything**, including errors caused by your own bugs:

```py
# Bad:
prices = {"tea": 15000}
try:
    total = prices["tea"] * quantty     # typo!
except:
    print("Product not found")
```

This prints `Product not found`, which is a lie: the real problem is a `NameError` from the misspelled `quantity`. A bare `except:` even catches `KeyboardInterrupt`, so Ctrl+C cannot stop a stuck loop. Write `except KeyError:` instead.

## The exception hierarchy

![Diagram: the built-in exception hierarchy](/images/companions-webp/exception-hierarchy.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Exception types form a family tree. Catching a parent also catches its children:

```text
BaseException
 +-- KeyboardInterrupt
 +-- SystemExit
 +-- Exception
      +-- ArithmeticError
      |    +-- ZeroDivisionError
      +-- LookupError
      |    +-- IndexError
      |    +-- KeyError
      +-- OSError
      |    +-- FileNotFoundError
      +-- ValueError
      +-- TypeError
```

Catching `Exception` catches nearly everything a normal program raises. `BaseException` also catches `KeyboardInterrupt` and `SystemExit`, which is almost never what you want.

```python
data = {"cities": ["Tashkent", "Samarkand"]}

for key, index in [("cities", 1), ("cities", 5), ("towns", 0)]:
    try:
        print(data[key][index])
    except LookupError as e:
        print(f"Not found: {type(e).__name__}")
```

```text
Samarkand
Not found: IndexError
Not found: KeyError
```

One `except LookupError` handled both a missing key and a bad index, and `type(e).__name__` shows which one it was. Order matters when you combine parents and children: put the **more specific** `except` first, or it will never run.

## How exceptions travel up

![Diagram: an exception travelling up the call stack](/images/companions-webp/exception-propagation.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

If a function does not catch an exception, it moves to the **caller**, then to the caller's caller, and so on. A traceback shows this path; read it from the **bottom**, where the error happened. So you can catch the exception at whichever level knows what to do about it. Here `print_receipt` decides:

```python
def unit_price(total, quantity):
    return total / quantity

def order_line(product, total, quantity):
    price = unit_price(total, quantity)
    return f"{product}: {price:,.0f} som each"

def print_receipt(lines):
    for product, total, quantity in lines:
        try:
            print(order_line(product, total, quantity))
        except ZeroDivisionError:
            print(f"{product}: quantity is zero, line skipped")

print_receipt([("Tea", 45000, 3), ("Samsa", 16000, 0), ("Juice", 24000, 2)])
```

```text
Tea: 15,000 som each
Samsa: quantity is zero, line skipped
Juice: 12,000 som each
```

## EAFP and LBYL

**LBYL** ("Look Before You Leap") checks first, as in `if product in stock:`. **EAFP** ("Easier to Ask Forgiveness than Permission") just tries and catches the exception. Python code often prefers EAFP when a check is hard to write: "is this string a valid float?" is tricky (`"-3.5"`, `"1e3"`, `" 7 "`), but `try: float(text)` answers it perfectly.

## Retry until the input is valid

Combining `while True`, `try`, and `break` gives a loop that keeps asking until the user types something usable:

```python
while True:
    try:
        people = int(input("How many people? "))
        break                       # only reached if int() succeeded
    except ValueError:
        print("Please type a whole number, like 4")

print(f"Table for {people}")
```

```text
How many people? four
Please type a whole number, like 4
How many people? 7
Table for 7
```

If `int()` fails, `break` is skipped and the loop asks again. On this site, `input()` reads the lines you typed in "Values for input()"; if the loop asks for more lines than you gave, `input()` raises `EOFError: EOF when reading a line`, so end the list with a valid value (here, `7`). The *Input Validation* lesson builds this idea into reusable helper functions.

## Try it

Enter a product and a quantity in "Values for input()", one per line. Try bad ones like `cake`, `abc` or `0`.

<ClientOnly><PythonPlayground :code='"stock = {\"tea\": 12, \"samsa\": 30, \"juice\": 0}\n\nproduct = input(\"Product: \").strip().lower()\ntry:\n    quantity = int(input(\"Quantity: \"))\n    available = stock[product]\n    batches = available // quantity\nexcept ValueError:\n    print(\"Quantity must be a whole number\")\nexcept KeyError:\n    print(f\"We do not sell {product}\")\nexcept ZeroDivisionError:\n    print(\"Quantity cannot be zero\")\nelse:\n    print(f\"We can fill {batches} orders of {quantity} {product}\")\nfinally:\n    print(\"Thank you for visiting\")"' /></ClientOnly>

## Common mistakes

### 1. Catching the wrong exception type

```py
try:
    age = int("twenty")
except TypeError:
    print("Invalid age")
```

```text
ValueError: invalid literal for int() with base 10: 'twenty'
```

`int("twenty")` raises `ValueError`, not `TypeError`, so the `except` does not match. Run the risky code once without `try` to see which exception it really raises.

### 2. Putting too much code inside `try`

```python
# Bad:
text = "50000"
try:
    amount = int(text)
    sessions = int("two")      # a different bug
except ValueError:
    print("Invalid amount")
```

```text
Invalid amount
```

The amount was fine; the `ValueError` came from another line. Keep only the line you expect to fail in `try`, and move the rest to `else`.

### 3. Silently swallowing errors

```py
# Bad:
try:
    balance = int("1 000 000")
except ValueError:
    pass
print(f"Balance: {balance}")
```

```text
NameError: name 'balance' is not defined
```

The real error is gone, and the program fails later with a confusing message. When you catch an exception, show a message or use a default.

## Practice

### 1. Safe division <Difficulty level="1" />

Write `safe_divide(a, b)` that returns `a / b`, or the string `"undefined"` when `b` is `0`. Test it with `(10, 4)` and `(5, 0)`.

::: details Solution
```python
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "undefined"

print(safe_divide(10, 4))
print(safe_divide(5, 0))
```

```text
2.5
undefined
```

:::

### 2. Parse prices <Difficulty level="1" />

Given `raw = ["15000", "8,000", "22000", "free", "5000"]`, add up every item that converts to `int`. Print a message for each invalid item, then the total.

::: details Solution
```python
raw = ["15000", "8,000", "22000", "free", "5000"]

total = 0
for item in raw:
    try:
        total += int(item)
    except ValueError:
        print(f"Invalid price: {item}")

print(f"Total: {total:,} som")
```

```text
Invalid price: 8,000
Invalid price: free
Total: 42,000 som
```
:::

### 3. Grade lookup <Difficulty level="2" />

With `grades = {"Aziza": [90, 85], "Bekzod": []}`, write `average_for(name)` that returns the average as a string. Return **different** messages for a missing student (`KeyError`) and a student with no grades (`ZeroDivisionError`). Test `"Aziza"`, `"Bekzod"` and `"Farrukh"`.

::: details Solution
```python
grades = {"Aziza": [90, 85], "Bekzod": []}

def average_for(name):
    try:
        scores = grades[name]
        avg = sum(scores) / len(scores)
    except KeyError:
        return f"{name}: no such student"
    except ZeroDivisionError:
        return f"{name}: no grades yet"
    return f"{name}: {avg:.1f}"

for name in ["Aziza", "Bekzod", "Farrukh"]:
    print(average_for(name))
```

```text
Aziza: 87.5
Bekzod: no grades yet
Farrukh: no such student
```
:::

### 4. Where did it fail? <Difficulty level="2" />

Loop over `["12", "x", "7"]` and convert each value with `int()` inside `try`. Print `bad value: ...` on a `ValueError`, use `else` to print `converted ...` only on success, and use `finally` to print `done with ...` for every value.

::: details Solution
```python
for value in ["12", "x", "7"]:
    try:
        number = int(value)
    except ValueError:
        print(f"bad value: {value}")
    else:
        print(f"converted {number}")
    finally:
        print(f"done with {value}")
```

```text
converted 12
done with 12
bad value: x
done with x
converted 7
done with 7
```
:::

### 5. Robust calculator <Difficulty level="3" />

Read numbers with `input()` until the user types `quit`. Skip anything that is not a number with a short message. At the end, print the total and the average, or `No numbers entered` if there were none.

::: details Solution
```python
numbers = []

while True:
    text = input("Number (or quit): ").strip()
    if text == "quit":
        break
    try:
        numbers.append(float(text))
    except ValueError:
        print(f"'{text}' is not a number")

try:
    average = sum(numbers) / len(numbers)
except ZeroDivisionError:
    print("No numbers entered")
else:
    print(f"Total: {sum(numbers)}, average: {average:.2f}")
```

```text
Number (or quit): 7
Number (or quit): 5
Number (or quit): five
'five' is not a number
Number (or quit): 3
Number (or quit): quit
Total: 15.0, average: 5.00
```
:::

## Recap

- `try` holds code that might fail; `except SomeError as e` handles that specific error, and a tuple handles several.
- `else` runs only on success. `finally` runs every time and is for clean-up.
- Avoid bare `except:` and silent `pass`: they hide real bugs.
- Exceptions form a hierarchy and travel up through callers: catch them (specific first) at the level that knows what to do.
- `while True` + `try` + `break` makes a retry-until-valid input loop.

## Further reading

- [Python Tutorial: Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html)
- [Built-in Exceptions and the exception hierarchy](https://docs.python.org/3/library/exceptions.html)
- [The `try` statement (language reference)](https://docs.python.org/3/reference/compound_stmts.html#the-try-statement)
