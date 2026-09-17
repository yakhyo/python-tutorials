---
title: The match Statement
description: "Use match and case to compare a value against patterns: literal values, several options with |, the _ wildcard, capturing values, guards, and matching split commands."
---

# The match Statement

![Illustration: The match Statement](/images/topics-webp/match-statement.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- How `match` and `case` choose between options, and when a plain `if`/`elif` is better
- How to match several values in one case with `|`
- How to handle "anything else" with `_`
- How to capture parts of a value into variables
- How to add extra conditions with **guards**
:::

## Why it matters

Many programs check one value against a list of possibilities: a menu choice, a command, a day of the week, an HTTP status code. You can do this with a long `if`/`elif` chain, but Python 3.10 added `match`, which is often clearer. It can also look **inside** values, which `if` statements can't do as neatly.

::: info Version note
`match` requires **Python 3.10 or newer**. On older versions, it's a `SyntaxError`.
:::

## A first example

```python
command = "stop"

match command:
    case "start":
        print("Starting the engine...")
    case "stop":
        print("Stopping.")
    case "pause":
        print("Paused.")
    case _:
        print(f"Unknown command: {command}")
```

```text
Stopping.
```

How it works:

1. Python evaluates the value after `match` (here `command`).
2. It tries each `case` **from top to bottom**.
3. It runs the block of the **first** pattern that matches, and skips the rest.
4. `case _:` matches **anything**, so it's the "otherwise" branch, like `else`.

The same logic with `if`/`elif`:

```python
command = "stop"

if command == "start":
    print("Starting the engine...")
elif command == "stop":
    print("Stopping.")
elif command == "pause":
    print("Paused.")
else:
    print(f"Unknown command: {command}")
```

For simple value checks, the two are equally good. `match` avoids repeating `command ==` on every line.

::: warning No `_`, no fallback
If no case matches and there's no `case _:`, **nothing happens**: no error, no output. Add `case _:` whenever an unexpected value is possible.
:::

## Several values in one case: `|`

`|` means "or" inside a pattern:

```python
day = "Sunday"

match day:
    case "Saturday" | "Sunday":
        print("Weekend!")
    case "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday":
        print("Workday.")
    case _:
        print("That's not a day.")
```

```text
Weekend!
```

Numbers work too:

```python
status = 404

match status:
    case 200 | 201:
        print("Success")
    case 301 | 302:
        print("Redirect")
    case 404:
        print("Not found")
    case 500:
        print("Server error")
    case _:
        print(f"Other status: {status}")
```

```text
Not found
```

## Capturing a value

A plain **name** in a pattern doesn't compare against a variable. It **captures** the value into that name. This is useful in the final case:

```python
choice = "7"

match choice:
    case "1":
        print("New game")
    case "2":
        print("Load game")
    case other:
        print(f"'{other}' is not a menu option")
```

```text
'7' is not a menu option
```

`case other:` matches anything, like `_`, but also stores the value in `other`. Use `_` when you don't need the value.

## Guards: extra conditions with `if`

Add `if condition` after a pattern. The case matches only if the pattern matches **and** the condition is true:

```python
temperature = -4

match temperature:
    case 0:
        print("Exactly freezing")
    case t if t < 0:
        print(f"{t}°C: below freezing, watch for ice")
    case t if t > 35:
        print(f"{t}°C: extreme heat")
    case t:
        print(f"{t}°C: normal")
```

```text
-4°C: below freezing, watch for ice
```

Range checks like this are often just as clear with `if`/`elif`. Guards shine when combined with the patterns below.

## Matching commands with several words

`match` can look **inside** a sequence of values. A common use is a text command split into words with `.split()` (which you met in *String Methods and Slicing*):

```python
line = "go north"

match line.split():
    case ["go", direction]:
        print(f"You walk {direction}.")
    case ["take", item]:
        print(f"You pick up the {item}.")
    case ["look"]:
        print("You see a dark forest.")
    case ["quit" | "exit"]:
        print("Goodbye!")
    case _:
        print("I don't understand.")
```

```text
You walk north.
```

- `["go", direction]` matches a list of **exactly two** words where the first is `"go"`, and captures the second word in `direction`.
- `["look"]` matches exactly one word, `"look"`.
- `["quit" | "exit"]` matches one word that's either `"quit"` or `"exit"`.

Try changing `line` to `"take lamp"`, `"look"`, `"go"`, or `"dance wildly"`. `"go"` alone doesn't match `["go", direction]`, because two words are required.

With plain `if` statements, this example would need several checks of length and content. `match` has more patterns than this lesson shows. You'll meet the square brackets properly in *Lists*, and you'll match dictionaries, objects, and names like `Color.RED` in *Dictionaries*, *Dataclasses*, and *Enums*.

## `match` or `if`?

| Situation | Better choice |
|---|---|
| One value compared against several fixed options (menu, command, code) | `match` |
| Structured values, like split commands | `match` |
| Ranges and comparisons (`score >= 90`) | `if`/`elif` |
| Conditions involving different variables | `if`/`elif` |
| Only one or two options | `if`/`else` |

`match` doesn't replace `if`. It's another tool that makes certain choices easier to read.

## Try it

Type a command into **Values for input()**, like `go east`, `take key`, `look`, or `jump`, and run it. Then add a new command, such as `drop <item>`. The `case []:` pattern matches an empty line: `"".split()` has no words at all.

<ClientOnly><PythonPlayground :code='"line = input(\"> \").strip().lower()\n\nmatch line.split():\n    case [\"go\", direction]:\n        print(f\"You walk {direction}.\")\n    case [\"take\", item]:\n        print(f\"You pick up the {item}.\")\n    case [\"look\"]:\n        print(\"You see a door and a small key.\")\n    case []:\n        print(\"Say something!\")\n    case _:\n        print(\"I do not understand that.\")"' /></ClientOnly>

## Common mistakes

### 1. Expecting a name to compare against a variable

```py
expected = "yes"
answer = "no"

match answer:
    case expected:            # captures! doesn't compare with the variable
        print("Matched")
    case _:
        print("Not matched")
```

```text
SyntaxError: name capture 'expected' makes remaining patterns unreachable
```

A bare name **captures** any value. Here Python notices that the next case can never run and refuses to run the code.

If the bare name is the **last** case, there is no error at all, which is worse:

```python
expected = "yes"
answer = "no"

match answer:
    case "maybe":
        print("Not sure")
    case expected:            # matches anything and overwrites expected
        print("Matched", expected)

print(expected)
```

```text
Matched no
no
```

The case matched `"no"`, and `expected` now holds `"no"` instead of `"yes"`. **Fix:** compare against the value directly (`case "yes":`), or use `if answer == expected:`. A dotted name such as `case Color.RED:` is different: it is compared as a value, not captured. You'll use that in *Enums*.

### 2. Putting `_` first

```py
answer = "y"

match answer:
    case _:
        print("Anything")
    case "y":
        print("Yes")
```

```text
SyntaxError: wildcard makes remaining patterns unreachable
```

`case _:` matches everything, so any case after it could never run. Keep `_` **last**.

### 3. Using `or` instead of `|`

```py
answer = "y"

match answer:
    case "y" or "yes":
        print("Yes")
```

```text
    case "y" or "yes":
             ^^
SyntaxError: invalid syntax
```

`or` isn't allowed inside a pattern. **Fix:** `case "y" | "yes":`.

## Practice

### 1. Day type <Difficulty level="1" />

Given a day number `day` (1 = Monday … 7 = Sunday), print `Workday`, `Weekend`, or `Invalid day` using `match`.

::: details Solution
```python
day = 6

match day:
    case 1 | 2 | 3 | 4 | 5:
        print("Workday")
    case 6 | 7:
        print("Weekend")
    case _:
        print("Invalid day")
```
:::

### 2. Traffic light <Difficulty level="1" />

Given `light` (`"red"`, `"yellow"`, or `"green"`, in any capitalization), print `Stop`, `Get ready`, or `Go`. For anything else, print `Broken light: <value>`, with the value exactly as given.

::: details Solution
```python
light = "Green"

match light.lower():
    case "red":
        print("Stop")
    case "yellow":
        print("Get ready")
    case "green":
        print("Go")
    case _:
        print(f"Broken light: {light}")
```
:::

### 3. Calculator with match <Difficulty level="2" />

Rewrite the calculator from *if, elif, and else* using `match` on the operator. Use a **guard** to handle division by zero.

::: details Solution
```python
a = 12.0
operator = "/"
b = 0.0

match operator:
    case "+":
        print(a + b)
    case "-":
        print(a - b)
    case "*" | "x":
        print(a * b)
    case "/" if b == 0:
        print("Error: can't divide by zero.")
    case "/":
        print(a / b)
    case _:
        print(f"Unknown operator: {operator}")
```

The guarded case must come **before** the plain `"/"` case, or it would never be reached.
:::

### 4. Rock, paper, scissors <Difficulty level="2" />

Given `player` and `computer` choices, print `Draw`, `You win`, or `You lose`. Use `match` on the player's choice, with guards or nested `if`s.

::: details Solution
```python
player = "rock"
computer = "scissors"

valid = ("rock", "paper", "scissors")

if player not in valid or computer not in valid:
    print("Invalid choice")
elif player == computer:
    print("Draw")
else:
    match player:
        case "rock":
            print("You win" if computer == "scissors" else "You lose")
        case "paper":
            print("You win" if computer == "rock" else "You lose")
        case "scissors":
            print("You win" if computer == "paper" else "You lose")
```

Checking both choices and the draw first keeps each case simple: by the time `match` runs, `computer` is a valid choice different from `player`.
:::

### 5. Mini command shell <Difficulty level="3" />

Process a command line with `match` on `line.split()`:

- `add A B`: print the sum of two numbers
- `greet NAME`: print `Hello, NAME!`
- `repeat WORD N`: print the word N times, separated by spaces
- `help`: print the list of commands
- anything else: `Unknown command. Type help.`

Test with `"add 4 5"`, `"greet Aziza"`, `"repeat hi 3"`, `"help"`, and `"add 4"`.

::: details Solution
```python
line = "repeat hi 3"

match line.split():
    case ["add", a, b]:
        print(float(a) + float(b))
    case ["greet", name]:
        print(f"Hello, {name}!")
    case ["repeat", word, times]:
        print(((word + " ") * int(times)).strip())
    case ["help"]:
        print("Commands: add A B, greet NAME, repeat WORD N, help")
    case _:
        print("Unknown command. Type help.")
```

`"add 4"` has only two words, so it doesn't match `["add", a, b]` and falls through to `_`. `(word + " ") * int(times)` repeats the word with a space after each copy, and `.strip()` removes the extra space at the end.
:::

## Recap

- `match value:` tries each `case` from top to bottom and runs only the first match.
- `case "a" | "b":` matches several options, and `case _:` matches anything, so put it last.
- A bare name like `case other:` **captures** the value. It doesn't compare with a variable of that name.
- Guards (`case x if x > 0:`) add a condition to a pattern.
- Sequence patterns like `case ["go", direction]:` match the structure of split commands.
- Use `match` for one value against fixed options or structures, and `if`/`elif` for ranges and mixed conditions. Requires Python 3.10+.

## Further reading

- [Python Tutorial - `match` statements](https://docs.python.org/3/tutorial/controlflow.html#match-statements)
- [PEP 636 - Structural pattern matching: tutorial](https://peps.python.org/pep-0636/)
- [The `match` statement (reference)](https://docs.python.org/3/reference/compound_stmts.html#the-match-statement)
