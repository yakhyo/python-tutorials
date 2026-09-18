---
title: Numbers and Math
description: "Work with integers and floats: arithmetic operators, integer division and remainder, operator precedence, rounding, and why 0.1 + 0.2 isn't exactly 0.3."
---

# Numbers and Math

![Illustration: Numbers and Math](/images/topics-webp/numbers-and-math.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- The two main number types: `int` and `float`
- All the arithmetic operators, including `//`, `%`, and `**`
- The order Python calculates in (operator precedence)
- Rounding and a few useful built-in functions
- Why decimal numbers are sometimes slightly off, and what to do about it
:::

## Why it matters

Prices, distances, scores, times, percentages: most programs calculate something. Python is a very good calculator, but it has a few rules (and surprises) you need to know to get correct results.

## Two kinds of numbers

```python
students = 32        # int: a whole number
height = 1.75        # float: a number with a decimal point

print(type(students))
print(type(height))
```

```text
<class 'int'>
<class 'float'>
```

- **`int`** (integer): whole numbers like `0`, `42`, `-7`. There's no size limit in Python, so `2 ** 100` works fine.
- **`float`** (floating-point): numbers with a decimal point, like `3.14`, `-0.5`, or `2.0`. Note that `2.0` is a float even though it's a whole number.

For readability, you can put underscores inside long numbers. Python ignores them:

```python
population = 37_000_000
print(population)
```

```text
37000000
```

Very large or very small floats can be written in **scientific notation**: `e` means "times 10 to the power of". Python also prints tiny floats this way:

```python
speed_of_light = 3e8     # 3 × 10⁸ metres per second
grain = 2.5e-3           # 0.0025 grams
print(speed_of_light, grain)
print(0.00001)
```

```text
300000000.0 0.0025
1e-05
```

A number written with `e` is always a float, even `3e8`.

## Arithmetic operators

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `+` | Addition | `7 + 2` | `9` |
| `-` | Subtraction | `7 - 2` | `5` |
| `*` | Multiplication | `7 * 2` | `14` |
| `/` | Division | `7 / 2` | `3.5` |
| `//` | Floor division | `7 // 2` | `3` |
| `%` | Remainder (modulo) | `7 % 2` | `1` |
| `**` | Power | `7 ** 2` | `49` |

```python
print(7 + 2, 7 - 2, 7 * 2)
print(7 / 2, 7 // 2, 7 % 2)
print(2 ** 10)
```

```text
9 5 14
3.5 3 1
1024
```

### `/` always gives a float

Regular division always returns a float, even when the result is whole:

```python
print(10 / 2)
```

```text
5.0
```

### `//` and `%`: whole parts and leftovers

`//` gives how many **whole times** one number fits into another. `%` gives **what's left over**. They're a very useful pair:

```python
total_minutes = 135

hours = total_minutes // 60     # 2 whole hours
minutes = total_minutes % 60    # 15 minutes left over

print(hours, "h", minutes, "min")
```

```text
2 h 15 min
```

With a float, `//` still rounds down, but the result is a float: `7.5 // 2` is `3.0`, and `7.5 % 2` is `1.5`.

When you need both answers, `divmod()` gives them in one step. It returns two values, which you can store in two variables at once:

```python
hours, minutes = divmod(135, 60)
print(hours, "h", minutes, "min")
```

```text
2 h 15 min
```

Common uses of `%`:

- **Even or odd:** `n % 2` is `0` for even numbers and `1` for odd numbers.
- **Last digit:** `n % 10` gives the last digit of a positive whole number.
- **Wrapping around:** `(hour + 5) % 24` keeps a clock hour between 0 and 23.

```python
print(14 % 2)      # 0 → even
print(15 % 2)      # 1 → odd
print(2026 % 10)   # 6 → last digit
print((22 + 5) % 24)  # 3 → 22:00 plus 5 hours is 03:00
```

::: details Negative numbers with `//` and `%`
`//` rounds **down** (toward negative infinity), not toward zero: `-7 // 2` is `-4`, not `-3`. Then `-7 % 2` is `1`, because `-4 * 2 + 1 == -7`. You'll rarely need this, but it explains surprising results.
:::

## Mixing ints and floats

If an operation mixes an `int` and a `float`, the result is a `float`:

```python
print(3 + 0.5)
print(2 * 1.5)
```

```text
3.5
3.0
```

## Order of operations

Python follows the usual math rules. From highest priority to lowest:

1. `( )` parentheses
2. `**` power
3. `-x` negative sign
4. `*`, `/`, `//`, `%` (left to right)
5. `+`, `-` (left to right)

```python
print(2 + 3 * 4)      # multiplication first
print((2 + 3) * 4)    # parentheses first
print(-2 ** 2)        # power before the negative sign
print((-2) ** 2)
```

```text
14
20
-4
4
```

**When in doubt, add parentheses.** They make your intent clear to both Python and people:

```python
price = 80000
discount_percent = 15
final_price = price - (price * discount_percent / 100)
print(final_price)
```

```text
68000.0
```

## Updating numbers

The shortcut operators from the *Variables* lesson work with every arithmetic operator:

```python
balance = 1000
balance += 250    # 1250
balance -= 100    # 1150
balance *= 2      # 2300
balance //= 3     # 766
print(balance)
```

## Useful built-in functions

```python
print(abs(-12))            # absolute value
print(round(3.14159, 2))   # round to 2 decimal places
print(round(7.6))          # round to nearest whole number → int
print(max(4, 9, 2))        # largest
print(min(4, 9, 2))        # smallest
print(pow(2, 5))           # same as 2 ** 5
```

```text
12
3.14
8
9
2
32
```

::: info How `round()` handles halves
`round(2.5)` gives `2` and `round(3.5)` gives `4`. Python rounds exact halves to the nearest **even** number ("banker's rounding"), which avoids bias when rounding many values. This surprises many people, so remember it when a result looks one-off.

Floats add one more surprise: `round(2.675, 2)` gives `2.67`, not `2.68`. That isn't banker's rounding. `2.675` is stored as a binary number slightly **below** 2.675 (more on this in *Floats aren't perfectly exact* below). For displaying money and measurements, the f-string formatting you'll learn soon is the usual tool.
:::

### The `math` module

For more math, Python has a `math` module. You'll learn about modules later. For now, just know that `import math` makes these available:

```python
import math

print(math.sqrt(49))    # square root
print(math.pi)          # π
print(math.floor(4.7))  # round down
print(math.ceil(4.2))   # round up
```

```text
7.0
3.141592653589793
4
5
```

## Floats aren't perfectly exact

Try this:

```python
print(0.1 + 0.2)
```

```text
0.30000000000000004
```

This isn't a Python bug. Computers store floats in **binary** (base 2), and some simple decimal numbers like `0.1` can't be stored exactly in binary, just as `1/3` can't be written exactly in decimal (`0.3333…`). Almost every programming language behaves this way.

What to do about it:

- For **displaying** results, round them: `round(0.1 + 0.2, 2)` gives `0.3`. You'll also learn to format numbers with f-strings.
- For **comparing** floats, don't check for exact equality. Use `math.isclose()` (covered in *Booleans and Comparisons*).
- For **money**, work in whole units where you can, for example tiyin or cents stored as `int`. Python also has a `decimal` module for exact decimal math.

## Try it

Convert a number of seconds into hours, minutes, and seconds. Try `3725`, then `86399`.

<ClientOnly><PythonPlayground :code='"total_seconds = 3725\n\nhours = total_seconds // 3600\nremaining = total_seconds % 3600\nminutes = remaining // 60\nseconds = remaining % 60\n\nprint(hours, \"h\", minutes, \"min\", seconds, \"s\")"' /></ClientOnly>

## Common mistakes

### 1. Dividing by zero

```py
print(10 / 0)
```

```text
ZeroDivisionError: division by zero
```

`//` and `%` raise the same error. You'll learn to check for this with `if` in the next module.

### 2. Using `^` for power

```python
print(2 ^ 3)    # 1, not 8!
print(2 ** 3)   # 8
```

In Python, `^` is a *bitwise* operator, not "to the power of". Use `**`.

### 3. Leaving out `*`

```py
width = 4
area = 2width
```

```text
SyntaxError: invalid decimal literal
```

Math notation lets you write `2x`, but Python needs the operator: `2 * width`.

### 4. Forgetting precedence

```python
average = 80 + 90 / 2
print(average)   # 125.0, not 85.0
```

Division happens before addition. **Fix:** `(80 + 90) / 2`.

## Practice

### 1. Rectangle <Difficulty level="1" />

A room is 4.5 m wide and 6 m long. Print its **area** (width × length) and **perimeter** (2 × (width + length)).

::: details Solution
```python
width = 4.5
length = 6

area = width * length
perimeter = 2 * (width + length)

print("Area:", area)
print("Perimeter:", perimeter)
```

```text
Area: 27.0
Perimeter: 21.0
```
:::

### 2. Temperature <Difficulty level="1" />

Convert `36.6` °C to Fahrenheit using `F = C × 9 / 5 + 32`, and print the result rounded to one decimal place.

::: details Solution
```python
celsius = 36.6
fahrenheit = celsius * 9 / 5 + 32
print(round(fahrenheit, 1))
```

```text
97.9
```
:::

### 3. Sharing snacks <Difficulty level="2" />

There are 50 samsas and 7 friends. Each friend gets the same whole number of samsas. Print how many each friend gets and how many are left over.

::: details Solution
```python
samsas = 50
friends = 7

each = samsas // friends
left_over = samsas % friends

print("Each friend gets:", each)
print("Left over:", left_over)
```

```text
Each friend gets: 7
Left over: 1
```
:::

### 4. Digit sum <Difficulty level="2" />

For a three-digit number such as `number = 472`, use `//` and `%` (no strings) to get each digit, and print the sum of the digits (`4 + 7 + 2 = 13`).

::: details Solution
```python
number = 472

hundreds = number // 100          # 4
tens = (number // 10) % 10        # 7
ones = number % 10                # 2

print(hundreds + tens + ones)
```

`number // 10` removes the last digit (`47`), and `% 10` then takes the new last digit (`7`).
:::

### 5. Loan payment <Difficulty level="3" />

You borrow `P = 12_000_000` som at a monthly interest rate `r = 0.02` for `n = 12` months. The fixed monthly payment is:

```text
payment = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)
```

Calculate the payment and print it rounded to the nearest som. Then print the total you pay back over the year.

::: details Solution
```python
principal = 12_000_000
rate = 0.02
months = 12

growth = (1 + rate) ** months
payment = principal * rate * growth / (growth - 1)

print("Monthly payment:", round(payment))
print("Total paid:", round(payment * months))
```

```text
Monthly payment: 1134715
Total paid: 13616582
```

Storing `(1 + rate) ** months` in its own variable avoids calculating it twice and makes the formula easier to read.
:::

## Recap

- `int` is for whole numbers and `float` is for decimals. Mixing them gives a float.
- Operators: `+ - * /` plus `//` (floor division), `%` (remainder), and `**` (power). `/` always returns a float.
- Precedence: parentheses → `**` → unary `-` → `* / // %` → `+ -`. Use parentheses to be clear.
- Useful functions: `abs`, `round`, `min`, `max`, and `math.sqrt`, `math.floor`, `math.ceil`.
- Floats are approximate (`0.1 + 0.2`), so round results for display and don't compare floats for exact equality.

## Further reading

- [Python Tutorial - Using Python as a Calculator](https://docs.python.org/3/tutorial/introduction.html#numbers)
- [Numeric types - int, float, complex](https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex)
- [Floating-point arithmetic: issues and limitations](https://docs.python.org/3/tutorial/floatingpoint.html)
- [`math` module](https://docs.python.org/3/library/math.html)
