---
title: Input and Type Conversion
description: "Make interactive programs with input(), clean the answers, and convert between strings, integers, and floats with int(), float(), and str()."
---

# Input and Type Conversion

![Illustration: Input and Type Conversion](/images/topics-webp/type-conversion-and-input.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- How to ask the user for information with `input()`
- Why `input()` always gives you a **string**
- How to convert values with `int()`, `float()`, and `str()`
- What happens when a conversion fails, including decimal commas like `12,5`
- How to clean text answers and build small interactive programs
:::

## Why it matters

So far, every value in your programs was written directly in the code. Real programs respond to their users: a calculator needs numbers, a quiz needs answers, a sign-up form needs a name. `input()` lets your program **ask**, and type conversion lets you turn the answers into data you can calculate with.

## Asking for input

`input()` shows a message (the **prompt**), waits for the user to type something and press Enter, and returns what they typed:

```python
name = input("What is your name? ")
print(f"Nice to meet you, {name}!")
```

```text
What is your name? Aziza
Nice to meet you, Aziza!
```

End the prompt with a space so the user's typing doesn't stick to your question.

::: info Running input() on this site
In the browser editors, there's no live keyboard input. Type your answers **in advance** in the **Values for input()** box, one per line. Each call to `input()` uses the next line.
:::

## `input()` always returns a string

Even if the user types a number, you get **text**:

```python
age = input("How old are you? ")
print(type(age))
```

```text
How old are you? 20
<class 'str'>
```

That's a problem as soon as you try to do math:

```py
age = input("How old are you? ")
print(age + 1)
```

```text
TypeError: can only concatenate str (not "int") to str
```

And sometimes it's worse, because there's no error, just a wrong answer:

```python
a = "5"
b = "3"
print(a + b)   # "53", not 8
```

The fix is to **convert** the string to a number.

## Cleaning text answers: `.strip()`

Users often type a stray space before or after their answer. You can't see it, but Python can, and the answer no longer matches:

```python
city = input("City: ")      # the user types "  Samarkand "
print(city == "Samarkand")

city = city.strip()
print(city == "Samarkand")
```

```text
City:   Samarkand 
False
True
```

For text answers, it's a good habit to call `.strip()` straight away, and to chain `.lower()` or `.title()` if capitals don't matter:

```python
city = input("City: ").strip().title()   # the user types "  samarkand "
print(f"Welcome to {city}!")
```

```text
City:   samarkand 
Welcome to Samarkand!
```

## Converting types

| Function | Converts to | Example | Result |
|---|---|---|---|
| `int()` | whole number | `int("42")` | `42` |
| `float()` | decimal number | `float("3.5")` | `3.5` |
| `str()` | string | `str(42)` | `"42"` |

```python
age_text = "20"
age = int(age_text)

print(age + 1)
print(type(age))
```

```text
21
<class 'int'>
```

Usually you convert **right away**, by wrapping `input()` inside `int()` or `float()`:

```python
age = int(input("How old are you? "))
print(f"Next year you will be {age + 1}.")
```

Python runs the inside first: `input()` returns a string, then `int()` converts it.

### `int()` vs `float()`

Use `int()` for things that are always whole (age, count, year) and `float()` for things that can have decimals (price, weight, temperature):

```python
weight = float(input("Weight in kg: "))
height = float(input("Height in meters: "))

bmi = weight / height ** 2
print(f"BMI: {bmi:.1f}")
```

### More conversions

```python
print(int(3.99))       # float → int cuts off the decimals (no rounding)
print(round(3.99))     # use round() if you want rounding
print(float(7))        # int → float
print(int("  42  "))   # surrounding spaces are OK
print(int("-15"))      # a minus sign is OK
print(str(3.5) + "kg") # number → string, to join with text
```

```text
3
4
7.0
42
-15
3.5kg
```

## When conversion fails

If the text doesn't look like a number of the right kind, Python raises a `ValueError`:

```py
int("twenty")
```

```text
ValueError: invalid literal for int() with base 10: 'twenty'
```

Some cases surprise beginners:

| Expression | Result |
|---|---|
| `int("3.5")` | `ValueError`: `int()` doesn't accept a decimal point in text |
| `int(float("3.5"))` | `3`: convert to float first, then int |
| `int("")` | `ValueError`: the user just pressed Enter |
| `int("1,000")` | `ValueError`: commas aren't allowed |
| `float("1e3")` | `1000.0`: scientific notation is accepted |
| `float("12,5")` | `ValueError`: the decimal point must be a dot |

The last row matters in Uzbekistan and much of Europe, where people often write decimals with a comma. The error message for `float()` is worded a little differently from the `int()` one:

```py
float("12,5")
```

```text
ValueError: could not convert string to float: '12,5'
```

If your users may type a comma, replace it before converting:

```python
weight_text = "12,5"
weight = float(weight_text.replace(",", "."))
print(weight)
```

```text
12.5
```

For now, assume users type valid numbers. In the *Errors and Files* module you'll learn to catch these errors and ask again.

## Putting it together

A small, complete interactive program:

```python
print("=== Tip calculator ===")

bill = float(input("Bill amount: "))
tip_percent = int(input("Tip percent: "))
people = int(input("Number of people: "))

tip = bill * tip_percent / 100
total = bill + tip
per_person = total / people

print(f"Tip:        {tip:,.2f}")
print(f"Total:      {total:,.2f}")
print(f"Per person: {per_person:,.2f}")
```

Run it with the values `150000`, `10`, and `4`:

```text
=== Tip calculator ===
Bill amount: 150000
Tip percent: 10
Number of people: 4
Tip:        15,000.00
Total:      165,000.00
Per person: 41,250.00
```

The shape of this program is very common: **input → convert → calculate → output**.

## Try it

Type two numbers into **Values for input()** (one per line), then run the program.

<ClientOnly><PythonPlayground :code='"first = float(input(\"First number: \"))\nsecond = float(input(\"Second number: \"))\n\nprint(f\"{first} + {second} = {first + second}\")\nprint(f\"{first} x {second} = {first * second}\")\nprint(f\"Average: {(first + second) / 2:.2f}\")"' /></ClientOnly>

## Common mistakes

### 1. Doing math on input without converting

```python
price = input("Price: ")   # the user types 50
print(price * 2)
```

```text
Price: 50
5050
```

No error, just a wrong answer: a string times `2` repeats the string. **Fix:** convert when you read the value: `price = float(input("Price: "))`.

### 2. Using `int()` for decimal input

```py
price = int(input("Price: "))   # user types 12.5
```

```text
ValueError: invalid literal for int() with base 10: '12.5'
```

**Fix:** use `float()` when the value can have decimals.

### 3. Typing a decimal comma

```py
weight = float(input("Weight in kg: "))   # user types 12,5
```

```text
ValueError: could not convert string to float: '12,5'
```

**Fix:** tell users to type a dot, or accept both with `float(input("Weight in kg: ").replace(",", "."))`.

### 4. Forgetting the space in the prompt

```python
name = input("Name:")   # the user types Aziza
```

```text
Name:Aziza
```

The typed text runs into the prompt. **Fix:** end the prompt with a space: `input("Name: ")`.

## Practice

### 1. Echo <Difficulty level="1" />

Ask for the user's favorite food and print `<food> is delicious!`, with the food in uppercase.

::: details Solution
```python
food = input("Favorite food? ")
print(f"{food.upper()} is delicious!")
```
:::

### 2. Birth year <Difficulty level="1" />

Ask for the user's age and print the year they were born, assuming the current year is `2026` and their birthday has already passed this year.

::: details Solution
```python
age = int(input("Your age: "))
print(f"You were born in {2026 - age}.")
```
:::

### 3. Unit converter <Difficulty level="2" />

Ask for a distance in kilometers (it can have decimals) and print it in miles with 2 decimals. 1 km = 0.621371 miles.

::: details Solution
```python
km = float(input("Kilometers: "))
miles = km * 0.621371
print(f"{km} km = {miles:.2f} miles")
```
:::

### 4. Predict the output <Difficulty level="2" />

Without running it, what does each line print? One of them raises an error: which one, and why?

```py
print(int("8") + 2)
print("8" + str(2))
print(int(9.9))
print(float("2") * 3)
print(int("9.9"))
```

::: details Solution
1. `10`
2. `82`: string joining
3. `9`: `int()` cuts off the decimals
4. `6.0`
5. `ValueError`: `int()` can't convert a string that contains a decimal point. Use `int(float("9.9"))` instead.
:::

### 5. Time until <Difficulty level="3" />

Ask for a number of minutes (a whole number) and print it as days, hours, and minutes, like `1 days, 2 hours, 5 minutes` for `1565`.

::: details Solution
```python
total = int(input("Minutes: "))

days = total // (24 * 60)
remaining = total % (24 * 60)
hours = remaining // 60
minutes = remaining % 60

print(f"{days} days, {hours} hours, {minutes} minutes")
```

This combines `input`, `int`, `//`, `%`, and f-strings. You'll learn to write "1 day" instead of "1 days" with `if` in the next module.
:::

## Recap

- `input("prompt ")` waits for the user and returns what they typed **as a string**.
- Convert with `int()`, `float()`, and `str()`. Convert right away: `int(input(...))`.
- `int(3.9)` cuts off decimals. Use `round()` to round.
- Invalid text like `int("3.5")`, `int("abc")` or `float("12,5")` raises a `ValueError`. Use `.replace(",", ".")` for decimal commas, and `.strip()` on text answers.
- A common program shape is **input → convert → calculate → output**.

## Further reading

- [Built-in functions - `input()`](https://docs.python.org/3/library/functions.html#input)
- [Built-in functions - `int()`](https://docs.python.org/3/library/functions.html#int) and [`float()`](https://docs.python.org/3/library/functions.html#float)
