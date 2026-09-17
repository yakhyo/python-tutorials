---
title: Comments and Code Style
description: "Write comments that help, and follow Python's style guide (PEP 8): naming, indentation, spacing, and line length."
---

# Comments and Code Style

![Illustration: Comments and Code Style](/images/topics-webp/comments-and-style.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- How to write comments with `#`, and what Python does with them
- What makes a comment **useful** and what makes it noise
- How to "comment out" code while testing
- The basics of **PEP 8**, Python's official style guide
- Why indentation is part of Python's grammar, not just decoration
:::

## Why it matters

Code is read far more often than it's written: by teammates, by people answering your questions online, and by *you, three weeks from now*. Python's design puts readability first (remember *"Readability counts."* from the Zen of Python). Comments and consistent style are how you keep your own code readable.

## Writing comments

A **comment** starts with `#`. Python ignores everything from the `#` to the end of the line:

```python
# Calculate the price after a 10% discount
price = 50
discounted = price * 0.9
print(discounted)  # 45.0
```

- A **full-line comment** sits on its own line, above the code it describes.
- An **inline comment** sits at the end of a line of code. Put **two spaces** before the `#` and one space after it.

A `#` inside a string is just a character, not a comment:

```python
print("Use # for comments")  # this part is the comment
```

Python has no special block-comment syntax. For several lines, start each one with `#`:

```python
# This program prints a receipt.
# It uses fixed prices for now; later lessons
# will read them from a file.
print("Receipt")
```

## Good comments explain *why*

Beginners often write comments that repeat the code. Those don't help, because the code already says *what* happens.

```python
# Bad: noise that repeats the code
count = 0  # set count to 0
count = count + 1  # add 1 to count
```

Useful comments explain **why** the code is the way it is, or give **context** the code can't show:

```python
# Good: explains why
seconds = 90
timeout = seconds + 5  # servers can be a few seconds slow; allow a margin

# Good: gives context the code can't
tax_rate = 0.12  # Uzbekistan VAT, 12% (check yearly)
```

A few rules of thumb:

1. **Clear code first.** If you need a comment to explain a confusing name, rename it instead: `d = 7` with a comment is worse than `days_until_deadline = 7`.
2. **Explain decisions, warnings, and units.** Examples: *"in centimeters"*, *"must run before saving"*, *"this list is sorted"*.
3. **Keep comments up to date.** A wrong comment is worse than no comment.
4. **Write full sentences** for full-line comments, starting with a capital letter.

## Commenting out code

Putting `#` in front of a line **disables** it without deleting it. This is useful for testing:

```python
print("Step 1")
# print("Step 2 — temporarily turned off")
print("Step 3")
```

```text
Step 1
Step 3
```

In most editors, **Ctrl + /** (macOS: **⌘ + /**) comments or uncomments the selected lines.

Don't leave large blocks of commented-out code in finished programs. They clutter the file, and it's unclear whether they still matter.

## A quick look at docstrings

You'll sometimes see text in triple quotes right at the top of a file or just inside a function:

```python
"""Receipt printer: prints a simple shop receipt."""

print("Receipt")
```

That's a **docstring**, a string that documents a module, function, or class. Unlike `#` comments, Python keeps docstrings so tools (and `help()`) can show them. You'll write them properly in the **Functions** module.

## PEP 8: Python's style guide

**PEP 8** is the official style guide for Python code. (A *PEP* is a Python Enhancement Proposal, a design document for Python.) Almost all Python projects follow it, so following it makes your code look familiar to every Python programmer.

You don't need to memorize all of it. These are the rules that matter most right now.

### Indentation: 4 spaces

Python uses **indentation** (spaces at the start of a line) to group code into blocks. Use **4 spaces per level**, never tabs:

```python
temperature = 31

if temperature > 30:
    print("It's hot.")
    print("Drink water.")

print("Have a nice day.")
```

The two indented lines belong to the `if`. The last line doesn't. You'll learn `if` properly in the **Making Decisions** module. For now, notice that indentation isn't just style in Python: **it changes what the code means**. Wrong indentation causes errors (see *Common mistakes* below).

Code editors insert 4 spaces when you press **Tab** in a `.py` file.

### Names: `snake_case`

| Kind of name | Style | Examples |
|---|---|---|
| Variables and functions | `lower_case_with_underscores` | `total_price`, `user_name`, `print_receipt` |
| Constants (values that never change) | `UPPER_CASE` | `MAX_USERS`, `TAX_RATE` |
| Classes (later in the course) | `CapitalizedWords` | `ShoppingCart`, `Student` |

Choose names that say what the value **means**:

```python
# Bad: hard to read
x = 3
y = 12.5
z = x * y

# Good: readable without comments
quantity = 3
unit_price = 12.5
total = quantity * unit_price
print(total)
```

### Spaces

- Put one space around `=` and around most operators: `total = price * 2`.
- Put a space after a comma, but not before it: `print("a", "b")`.
- Don't put spaces just inside parentheses: `print("hi")`, not `print( "hi" )`.
- For keyword arguments, don't put spaces around `=`: `print("a", "b", sep="-")`.

```py
# Bad: cramped and inconsistent
total=price*2+tax
print( "Total:" ,total )

# Good: follows PEP 8
total = price * 2 + tax
print("Total:", total)
```

### Line length and blank lines

- Keep lines to about **79 characters**. Many teams allow up to 88 or 99. Long lines are hard to read side by side.
- Use **blank lines** to separate logical sections of a program, like paragraphs in writing.

```python
# Inputs
width = 4
height = 3

# Calculation
area = width * height

# Output
print("Area:", area)
```

::: info Tools do this for you
Later, you can install a **formatter** that fixes spacing automatically and a **linter** that points out style problems. For now, following these few rules by hand builds good habits.
:::

## Try it

This program works, but it's hard to read. Rename the variables, fix the spacing, and add **one** useful comment. Make sure it still prints the same result.

<ClientOnly><PythonPlayground :code='"a=250000\nb=0.15   #b\nc=a-a*b\nprint( \"Price after discount:\" ,c )"' /></ClientOnly>

## Common mistakes

### 1. Unexpected indentation

```py
print("start")
    print("indented for no reason")
```

```text
IndentationError: unexpected indent
```

Only indent code that belongs to a block, such as the body of an `if`. **Fix:** remove the extra spaces.

### 2. Missing indentation

```py
if 5 > 3:
print("five is bigger")
```

```text
IndentationError: expected an indented block after 'if' statement on line 1
```

**Fix:** indent the body of the `if` with 4 spaces.

### 3. Mixing tabs and spaces

```text
TabError: inconsistent use of tabs and spaces in indentation
```

The lines *look* aligned, but some use a tab character and some use spaces. **Fix:** set your editor to insert spaces (VS Code does this by default for Python). In VS Code, run **Convert Indentation to Spaces** from the Command Palette.

### 4. Comments that lie

```python
discount = 0.2  # 10% discount
```

The code says 20%, but the comment says 10%. Which one is right? **Fix:** update comments whenever you change the code, or remove comments the code already makes clear.

## Practice

### 1. Clean it up <Difficulty level="1" />

Rewrite this code following PEP 8 spacing. Don't change what it prints.

```python
name="Aziza"
age=20
print( "Name:",name ,"Age:" ,age )
```

::: details Solution
```python
name = "Aziza"
age = 20
print("Name:", name, "Age:", age)
```
:::

### 2. Better names <Difficulty level="1" />

Give these variables meaningful `snake_case` names:

```python
n = "Tashkent"
p = 3100000
FlightPriceSom = 1250000
```

::: details Solution
```python
city = "Tashkent"
population = 3100000
flight_price_som = 1250000
```

`FlightPriceSom` uses the class style (`CapitalizedWords`). Variables use `snake_case`.
:::

### 3. Useful or noise? <Difficulty level="2" />

For each comment, decide whether it's **useful** or **noise**, and explain why.

```python
speed = 120  # speed
distance = 300  # kilometers
hours = distance / speed  # divide distance by speed
hours = hours + 0.5  # add a 30-minute rest stop
```

::: details Solution
1. `# speed`: **noise**. The name already says it. A useful version would give the unit: `# km/h`.
2. `# kilometers`: **useful**. It gives the unit, which the code can't show.
3. `# divide distance by speed`: **noise**. It repeats the code.
4. `# add a 30-minute rest stop`: **useful**. It explains *why* 0.5 is added.
:::

### 4. Find the bug with comments <Difficulty level="2" />

This program prints the wrong total. Comment out lines one at a time to find which line causes the problem, then fix it.

```python
apples = 4
pears = 3
apples = 40
total_fruit = apples + pears
print("Total fruit:", total_fruit)
```

The expected output is `Total fruit: 7`.

::: details Solution
Commenting out `apples = 40` makes the program print `Total fruit: 7`. That line overwrote the correct value, so delete it:

```python
apples = 4
pears = 3
total_fruit = apples + pears
print("Total fruit:", total_fruit)
```

Temporarily disabling lines like this is a simple but effective debugging technique.
:::

### 5. Style review <Difficulty level="3" />

Rewrite this program so it follows everything in this lesson: meaningful names, PEP 8 spacing, blank lines between sections, and one or two comments that explain **why**. It should print the same result.

```python
W=5.5
H=3
r=W*H
pc=r*85000 #
print ("Room cost:",pc)
```

::: details Solution
```python
# Room size in meters
width = 5.5
height = 3

area = width * height

# Flooring price in som per square meter (supplier quote)
PRICE_PER_SQUARE_METER = 85000
cost = area * PRICE_PER_SQUARE_METER

print("Room cost:", cost)
```

- Names say what each value means, and the fixed price is a constant in `UPPER_CASE`.
- Comments give units and where the price comes from, which the code can't show.
- The empty `#` comment was removed, and the spacing around `=`, `*`, and after commas was fixed.
:::

## Recap

- `#` starts a comment, and Python ignores the rest of the line.
- Good comments explain **why**, give units, or give context. Don't restate the code.
- Commenting out lines is a quick way to test and debug. Clean up afterwards.
- **PEP 8** is Python's style guide: 4-space indentation, `snake_case` names, spaces around `=` and operators, lines of about 79 characters.
- Indentation is **part of Python's grammar**. Wrong indentation causes `IndentationError` or `TabError`.

## Further reading

- [PEP 8 - Style Guide for Python Code](https://peps.python.org/pep-0008/)
- [Python Tutorial - Coding style](https://docs.python.org/3/tutorial/controlflow.html#intermezzo-coding-style)
- [PEP 257 - Docstring conventions](https://peps.python.org/pep-0257/)
