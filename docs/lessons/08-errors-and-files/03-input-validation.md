---
title: Input Validation
description: "Make programs robust against bad input: normalizing text, reusable ask_int and ask_choice helpers, validating strings with guard clauses, and limited attempts."
---

# Input Validation

![Illustration: Input Validation](/images/topics-webp/input-validation.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- Why you should **never trust input**, and how to normalize it with `strip()` and `lower()`
- How to build reusable helpers like `ask_int` and `ask_choice`
- How to validate usernames and phone numbers without special libraries
- Two ways to report problems: returning `(ok, message)` or raising an exception
- How to limit the number of attempts
:::

## Why it matters

Users mistype, add spaces, write `Yes` instead of `yes`, and ask for `-5` tickets. A program that trusts input crashes, or worse, runs on with wrong data. **Validation** checks data at the door, so the rest of your code can rely on it.

## Never trust input

You expect `7` and get `seven`, `7.5` or `""`; you expect an age and get `-4`. Validation has three steps: **normalize** (spaces, letter case), **convert** (to `int` or `float`), and **check rules** (range, choices, length, format).

`strip()` removes spaces at both ends, and `lower()` ignores case:

```python
for raw in ["yes", " Yes", "YES  ", "no"]:
    answer = raw.strip().lower()
    print(f"{raw!r:>9} -> {answer!r:>6} -> accepted: {answer in {'yes', 'y'}}")
```

```text
    'yes' ->  'yes' -> accepted: True
   ' Yes' ->  'yes' -> accepted: True
  'YES  ' ->  'yes' -> accepted: True
     'no' ->   'no' -> accepted: False
```

Normalize **before** checking, and store the normalized value, or `"Tashkent "` and `"tashkent"` become two cities.

## A reusable `ask_int` helper

Converting can fail, so use `try`/`except`; after it succeeds, check the range. Put the loop into a function that returns only a valid `int`:

```python
def ask_int(prompt, min_value=None, max_value=None):
    while True:
        text = input(prompt).strip()
        try:
            value = int(text)
        except ValueError:
            print(f"  {text!r} is not a whole number.")
            continue
        if min_value is not None and value < min_value:
            print(f"  The smallest allowed value is {min_value}.")
            continue
        if max_value is not None and value > max_value:
            print(f"  The largest allowed value is {max_value}.")
            continue
        return value

nights = ask_int("Nights in Samarkand (1-14): ", 1, 14)
print(f"Booked {nights} nights")
```

```text
Nights in Samarkand (1-14): 3.5
  '3.5' is not a whole number.
Nights in Samarkand (1-14): 20
  The largest allowed value is 14.
Nights in Samarkand (1-14): 7
Booked 7 nights
```

Each failed check prints a **specific** message and `continue`s; `return value` ends the loop and the function. The limits are optional, and the test is `is not None` because `0` is a valid but falsy limit.

## Choosing from a set of options: `ask_choice`

For menus and yes/no questions, compare the normalized answer with a set of allowed values:

```python
def ask_choice(prompt, choices):
    allowed = {choice.lower() for choice in choices}
    options = ", ".join(sorted(allowed))
    while True:
        answer = input(prompt).strip().lower()
        if answer in allowed:
            return answer
        print(f"  Please choose one of: {options}")

print("1) Balance  2) Transfer  3) History  0) Exit")
action = ask_choice("Choose: ", {"1", "2", "3", "0"})
print(f"You chose {action}")
```

```text
1) Balance  2) Transfer  3) History  0) Exit
Choose: 5
  Please choose one of: 0, 1, 2, 3
Choose: 3
You chose 3
```

## Validating strings

For text, write small checks. String methods do most of the work:

| Method | True when | Example |
|---|---|---|
| `isdecimal()` | all characters are decimal digits (and there is at least one) | `"2026".isdecimal()` |
| `isdigit()` | the same, but also accepts digit-like symbols such as `²` | `"2²".isdigit()` |
| `isalpha()` | all characters are letters | `"Aziza".isalpha()` |
| `isalnum()` | letters or digits only | `"bekzod99".isalnum()` |

::: warning `isdecimal()` and `isdigit()` are not number checks
`"-5".isdecimal()` and `"4.5".isdecimal()` are `False`, yet both are valid numbers: to check a number, convert inside `try`. Use `isdecimal()` for digit-only codes like a PIN, and prefer it over `isdigit()`: `"²".isdigit()` is `True`, but `int("²")` raises `ValueError`.
:::

### A username

```python
def check_username(name):
    if not name:
        return False, "username cannot be empty"
    if not 3 <= len(name) <= 16:
        return False, f"username must be 3-16 characters, got {len(name)}"
    if not name[0].isalpha():
        return False, "username must start with a letter"
    if not name.replace("_", "").isalnum():
        return False, "use only letters, digits and _"
    return True, "ok"

for name in ["aziza_07", "ab", "7bekzod", "dilnoza!", ""]:
    ok, message = check_username(name)
    print(f"{name!r:12} {str(ok):5} {message}")
```

```text
'aziza_07'   True  ok
'ab'         False username must be 3-16 characters, got 2
'7bekzod'    False username must start with a letter
'dilnoza!'   False use only letters, digits and _
''           False username cannot be empty
```

Each `if` is a **guard clause** that leaves as soon as a rule is broken. The empty check comes first, so `name[0]` cannot raise `IndexError`.

### An Uzbek phone number

Normalize first by removing spaces, dashes and brackets, then check the format:

```python
def normalize_phone(raw):
    phone = raw.strip()
    for symbol in " -()":
        phone = phone.replace(symbol, "")
    if not phone.startswith("+998"):
        return None
    digits = phone[1:]
    if len(digits) != 12 or not digits.isdecimal():
        return None
    return phone

for raw in ["+998 90 123-45-67", "+998(91)7654321", "90 123 45 67"]:
    print(f"{raw!r:22} -> {normalize_phone(raw)}")
```

```text
'+998 90 123-45-67'    -> +998901234567
'+998(91)7654321'      -> +998917654321
'90 123 45 67'         -> None
```

It returns the cleaned number, ready to store, or `None`.

## Returning `(ok, message)` or raising?

`check_username` **returns** `(False, message)`. The alternative is to **raise**, as in *Raising and Custom Exceptions*.

| | Return `(ok, message)` | Raise an exception |
|---|---|---|
| Good for | forms, where invalid input is normal | core functions, where bad data is unexpected |
| If the caller forgets to check | the bad value slips through <No /> | the program stops loudly <Yes /> |
| Collecting all problems at once | easy | harder |

A common combination: **validate at the edge** (where the user types) with friendly loops, and **raise inside** core functions as a safety net.

## Limiting attempts

A PIN should not allow endless guesses. Use `for` with `range` instead of `while True`:

```python
def ask_pin(correct_pin, max_attempts=3):
    for attempt in range(1, max_attempts + 1):
        pin = input(f"PIN (attempt {attempt} of {max_attempts}): ").strip()
        if len(pin) != 4 or not pin.isdecimal():
            print("  A PIN is exactly 4 digits.")
        elif pin == correct_pin:
            return True
        else:
            print("  Wrong PIN.")
    return False

if ask_pin("2580"):
    print("Access granted")
else:
    print("Card blocked. Please visit your bank.")
```

```text
PIN (attempt 1 of 3): 7
  A PIN is exactly 4 digits.
PIN (attempt 2 of 3): 2580
Access granted
```

A general helper could raise after the last attempt instead.

## Try it

Type values in "Values for input()", one per line, such as `abc`, `25`, `3`. Then add a second question for the dish.

<ClientOnly><PythonPlayground :code='"while True:\n    text = input(\"Quantity (1-20): \").strip()\n    try:\n        quantity = int(text)\n    except ValueError:\n        print(f\"  {text!r} is not a whole number.\")\n        continue\n    if 1 <= quantity <= 20:\n        break\n    print(\"  Enter a number from 1 to 20.\")\n\nprint(f\"{quantity} x plov = {quantity * 45000:,} som\")"' /></ClientOnly>

## Common mistakes

### 1. Converting before checking for errors

```py
text = "twenty"          # what input("Age: ") returned
age = int(text)
if age < 0:
    print("Invalid age")
```

```text
ValueError: invalid literal for int() with base 10: 'twenty'
```

`int()` crashes before the range check runs. Convert inside `try`, and check the range after it succeeds.

### 2. Validating, then using the original value

```python
city = " tashkent "
cities = []
if city.strip().title() in {"Tashkent", "Samarkand", "Bukhara"}:
    cities.append(city)      # Bad: stores the raw text
print(cities)
```

```text
[' tashkent ']
```

Save the normalized value in a variable (`city = city.strip().title()`) and use that one everywhere.

## Practice

### 1. Clean the answers <Difficulty level="1" />

Given `raw = ["  Tashkent", "samarkand ", "BUKHARA", "Tashkent"]`, normalize each city with `strip()` and `title()` and print the set of unique cities.

::: details Solution
```python
raw = ["  Tashkent", "samarkand ", "BUKHARA", "Tashkent"]

cities = {city.strip().title() for city in raw}
print(sorted(cities))
```

```text
['Bukhara', 'Samarkand', 'Tashkent']
```
:::

### 2. Postal code <Difficulty level="1" />

An Uzbek postal code has exactly 6 digits, like `100000`. Write `is_postal_code(text)` that ignores surrounding spaces. Test `"100000"`, `" 140100 "`, `"10000"` and `"1OOOOO"` (letter O).

::: details Solution
```python
def is_postal_code(text):
    code = text.strip()
    return len(code) == 6 and code.isdecimal()

for text in ["100000", " 140100 ", "10000", "1OOOOO"]:
    print(f"{text!r:10} {is_postal_code(text)}")
```

```text
'100000'   True
' 140100 ' True
'10000'    False
'1OOOOO'   False
```
:::

### 3. Password rules <Difficulty level="2" />

Write `check_password(password)` that returns `(ok, problems)`, where `problems` lists **every** broken rule: at least 8 characters, a digit, a letter, no spaces. Test `"secret"`, `"my pass 1"` and `"samarkand2026"`.

::: details Solution
```python
def check_password(password):
    problems = []
    if len(password) < 8:
        problems.append("at least 8 characters")
    if not any(ch.isdigit() for ch in password):
        problems.append("at least one digit")
    if not any(ch.isalpha() for ch in password):
        problems.append("at least one letter")
    if " " in password:
        problems.append("no spaces")
    return len(problems) == 0, problems

for password in ["secret", "my pass 1", "samarkand2026"]:
    ok, problems = check_password(password)
    print(password, "->", "OK" if ok else "; ".join(problems))
```

```text
secret -> at least 8 characters; at least one digit
my pass 1 -> no spaces
samarkand2026 -> OK
```
:::

### 4. `ask_float` with attempts <Difficulty level="2" />

Write `ask_float(prompt, min_value, max_value, attempts=3)` that returns a valid `float` (accept `7,5` too), or raises `ValueError("too many invalid attempts")`. Ask for a parcel weight from 0.1 to 30 kg.

::: details Solution
```python
def ask_float(prompt, min_value, max_value, attempts=3):
    for _ in range(attempts):
        text = input(prompt).strip().replace(",", ".")
        try:
            value = float(text)
        except ValueError:
            print("  Not a number.")
            continue
        if min_value <= value <= max_value:
            return value
        print(f"  Must be between {min_value} and {max_value}.")
    raise ValueError("too many invalid attempts")

try:
    weight = ask_float("Parcel weight in kg: ", 0.1, 30)
    print(f"Weight: {weight} kg")
except ValueError as e:
    print(f"Order cancelled: {e}")
```

```text
Parcel weight in kg: heavy
  Not a number.
Parcel weight in kg: 7,5
Weight: 7.5 kg
```
:::

### 5. Validate a whole record <Difficulty level="3" />

Write `validate_student(record)` for form dictionaries like `{"name": "Aziza", "age": "20"}` (string values, fields may be missing). The name must be 2-30 letters; the age an `int` from 7 to 99. Return `(cleaned, errors)`: normalized values (title-case name, `int` age) and a dictionary of messages per field. Test `{"name": " bekzod ", "age": "15"}`, `{"name": "D1lnoza", "age": "150"}` and `{"age": "x"}`.

::: details Solution
```python
def validate_student(record):
    cleaned = {}
    errors = {}

    name = record.get("name", "").strip()
    if name.isalpha() and 2 <= len(name) <= 30:
        cleaned["name"] = name.title()
    else:
        errors["name"] = "letters only, 2-30 characters"

    try:
        age = int(record.get("age", ""))
    except ValueError:
        errors["age"] = "must be a whole number"
    else:
        if 7 <= age <= 99:
            cleaned["age"] = age
        else:
            errors["age"] = f"must be 7-99, got {age}"

    return cleaned, errors

for record in [{"name": " bekzod ", "age": "15"}, {"name": "D1lnoza", "age": "150"}, {"age": "x"}]:
    print(validate_student(record))
```

```text
({'name': 'Bekzod', 'age': 15}, {})
({}, {'name': 'letters only, 2-30 characters', 'age': 'must be 7-99, got 150'})
({}, {'name': 'letters only, 2-30 characters', 'age': 'must be a whole number'})
```

`record.get(..., "")` turns a missing field into a normal error instead of a `KeyError`. Note that `isalpha()` rejects `O'tkir` (plain apostrophe) but accepts `Gʻayrat`; a real form would remove `'` and `ʻ` first.
:::

## Recap

- Never trust input: normalize (`strip()`, `lower()`), convert inside `try`, then check ranges and allowed choices.
- Wrap the loop in helpers such as `ask_int(prompt, min_value, max_value)` and `ask_choice(prompt, choices)`.
- Validate strings with guard clauses and methods like `isdecimal()` and `isalpha()`.
- Return `(ok, message)` for friendly forms; raise exceptions for unexpected bad data in core code.
- Limit attempts with `for ... in range(max_attempts)`, and store the **normalized** value.

## Further reading

- [Built-in function `input()`](https://docs.python.org/3/library/functions.html#input)
- [String methods such as `isdigit()` and `strip()`](https://docs.python.org/3/library/stdtypes.html#string-methods)
- [Python Tutorial: Handling Exceptions](https://docs.python.org/3/tutorial/errors.html#handling-exceptions)
