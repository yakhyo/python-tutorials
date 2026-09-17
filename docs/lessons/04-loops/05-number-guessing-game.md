---
title: "Project: Number Guessing Game"
description: "Build a complete number guessing game with random numbers, hints, input validation, limited attempts, difficulty levels, a play-again loop, and a best score."
---

# Project: Number Guessing Game

![Illustration: Project: Number Guessing Game](/images/topics-webp/number-guessing-game.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- How to plan a small program before you write any code
- How to combine `while` loops, `if`/`elif`/`else`, `match`, `break`, and `continue` in one program
- How to validate player input with `isdecimal()` so a typo doesn't crash the game
- How to track state across rounds: attempts, wins, and a best score
- How to leave nested loops cleanly with a flag variable
:::

## Why it matters

You now know variables, strings, input, conditions, and loops. Each lesson showed one tool at a time. A real program uses all of them together, and the new challenge is deciding **which loop goes where** and **which variables must survive between rounds**.

A guessing game is a classic first project because it is small but complete: it talks to the player, reacts to mistakes, keeps score, and ends cleanly. Every interactive program you write later, from an ATM menu to a chat bot, follows the same shape.

## Goal and features

The computer picks a secret number. The player guesses, and the computer answers "too high" or "too low" until the player finds it or runs out of attempts. A finished session looks like this:

```text
Guess 1/7: 50
  Too high!
Guess 2/7: 25
  Too low!
Guess 3/7: abc
  That is not a whole number. Try again.
...
Correct! The number was 42. You needed 7 attempts.
New best score!
Play again? (y/n):
```

Features:

| Feature | Tools you will use |
|---|---|
| A random secret number | `random.randint()` |
| "Too high" / "Too low" hints | `if` / `elif` / `else` |
| Count attempts and limit them | `while`, a counter variable |
| Reject bad input like `abc` or `-5` | `strip()`, `isdecimal()`, `continue` |
| Difficulty levels (range and attempts) | `match` with or-patterns |
| Play again, best score, and a summary | an outer `while` loop, `break` |
| Type `quit` at any prompt | a flag variable |

## Design

Before writing code, draw the flow. The game has **two loops**: an outer loop for rounds and an inner loop for guesses inside one round.

```text
start: rounds_played = 0, wins = 0, best_score = None, playing = True
  |
  v
OUTER LOOP (one round) - repeats while playing
  |
  +-- ask difficulty ------- bad answer? -> message, ask again
  +-- set max_number, max_attempts
  +-- pick secret, attempts = 0, won = False
  |
  +-- INNER LOOP (one guess) - repeats while attempts < max_attempts
  |     |
  |     +-- "quit"?                  -> playing = False, leave both loops
  |     +-- not a number / too big?  -> message, ask again (no attempt used)
  |     +-- attempts += 1
  |     +-- too low / too high?      -> hint, next guess
  |     +-- correct?                 -> won = True, leave inner loop
  |
  +-- show result, update wins and best_score
  +-- "Play again?" ------- not y? -> playing = False
  |
  v
print summary
```

The variables fall into two groups, and keeping them apart is the key design decision:

| Lives for the whole session | Reset at the start of every round |
|---|---|
| `rounds_played`, `wins`, `best_score`, `playing` | `secret`, `attempts`, `won`, `max_number`, `max_attempts` |

Session variables are created **before** the outer loop. Round variables are set **inside** it.

## Step 1: Pick a secret number

Python has a built-in collection of ready-made tools called the **standard library**. The `random` module can pick random numbers. You will learn about modules properly in *Modules and Imports*. For now, one line at the top of the file is enough: `import random`.

```python
import random

random.seed(7)

secret = random.randint(1, 100)
print(f"Secret number: {secret}")

dice = random.randint(1, 6)
print(f"Dice roll: {dice}")
```

```text
Secret number: 42
Dice roll: 2
```

`random.randint(a, b)` returns a whole number from `a` to `b`, and **both ends are included**, so `randint(1, 100)` can return 1 or 100.

Normally you want a different number every game. While you are building and testing, though, a changing number is annoying: you cannot repeat a bug. `random.seed(7)` makes the "random" numbers the same on every run. This lesson uses a seed so the outputs you see here are real and repeatable. Delete the `seed` line when you want to play for real.

## Step 2: One guess with hints and validation

`int(input())` crashes if the player types `abc`. Check the text first with `isdecimal()`, which is `True` only when a string is non-empty and every character is a decimal digit (a character `int()` can convert):

```python
print("42".isdecimal())
print("abc".isdecimal())
print("-5".isdecimal())
print("4.5".isdecimal())
print("".isdecimal())
print(" 42".isdecimal(), " 42".strip().isdecimal())
```

```text
True
False
False
False
False
False True
```

Notice that `"-5"` and `"4.5"` are rejected. That is fine for this game, because the secret is never negative or a decimal. Always `strip()` first, so a stray space does not make a good answer fail.

You may also meet `isdigit()`. It looks similar, but it also accepts characters like `²`, and `int("²")` raises `ValueError`. `isdecimal()` is the safe test before `int()`.

Now one complete guess:

```python
secret = 42

text = input("Guess a number from 1 to 100: ").strip()

if not text.isdecimal():
    print("That is not a whole number.")
else:
    guess = int(text)
    if guess < 1 or guess > 100:
        print("Please stay between 1 and 100.")
    elif guess < secret:
        print("Too low!")
    elif guess > secret:
        print("Too high!")
    else:
        print("Correct!")
```

Two runs, typing `abc` and then `70`:

```text
Guess a number from 1 to 100: abc
That is not a whole number.
Guess a number from 1 to 100: 70
Too high!
```

The order of the checks matters. First "is it a number at all?", then "is it in range?", and only then compare it with the secret. `int(text)` is safe inside the `else`, because `isdecimal()` already said yes.

## Step 3: A loop with an attempt counter and a limit

One guess is not a game. Wrap it in a `while` loop that counts attempts and stops at the limit:

```python
secret = 42
max_attempts = 5
attempts = 0

while attempts < max_attempts:
    text = input(f"Guess {attempts + 1}/{max_attempts}: ").strip()
    if not text.isdecimal():
        print("  That is not a whole number. Try again.")
        continue

    guess = int(text)
    attempts += 1
    if guess < secret:
        print("  Too low!")
    elif guess > secret:
        print("  Too high!")
    else:
        print(f"Correct! You needed {attempts} attempts.")
        break
else:
    print(f"Out of attempts. The number was {secret}.")
```

A winning run:

```text
Guess 1/5: 50
  Too high!
Guess 2/5: 30
  Too low!
Guess 3/5: hello
  That is not a whole number. Try again.
Guess 3/5: 45
  Too high!
Guess 4/5: 42
Correct! You needed 4 attempts.
```

And a losing run:

```text
Guess 1/5: 10
  Too low!
Guess 2/5: 20
  Too low!
Guess 3/5: 30
  Too low!
Guess 4/5: 40
  Too low!
Guess 5/5: 50
  Too high!
Out of attempts. The number was 42.
```

Three details to notice:

- `continue` skips the rest of the loop body, so `hello` **does not use up an attempt**. The counter only grows after the input passed validation.
- `break` leaves the loop as soon as the player wins.
- The `else` block of the `while` loop runs only when the loop ended **without** `break`, which here means "the player ran out of attempts". You met this in *break, continue, and else*.

## Step 4: Difficulty levels with `match`

Each difficulty sets two values: the size of the range and the number of attempts. `match` handles this neatly, and `|` lets the player type either the number or the word:

```python
while True:
    print("1) Easy   2) Medium   3) Hard")
    choice = input("Choose a difficulty: ").strip().lower()

    match choice:
        case "1" | "easy":
            max_number = 50
            max_attempts = 10
        case "2" | "medium":
            max_number = 100
            max_attempts = 7
        case "3" | "hard":
            max_number = 100
            max_attempts = 5
        case _:
            print("  Please type 1, 2, or 3.")
            continue
    break

print(f"Range 1-{max_number}, {max_attempts} attempts")
```

```text
1) Easy   2) Medium   3) Hard
Choose a difficulty: 5
  Please type 1, 2, or 3.
1) Easy   2) Medium   3) Hard
Choose a difficulty: hard
Range 1-100, 5 attempts
```

The loop runs until the player gives a valid answer. The `case _:` branch catches everything else and uses `continue` to ask again. After a valid `case`, the code reaches `break`.

With 7 attempts on 1-100, a smart player always wins: guess the middle (50), then the middle of the half that is left (25 or 75), and so on. Each guess cuts the range in half, and 100 halves to 1 in 7 steps. With only 5 attempts on the same range, the player needs some luck. That is what makes "hard" hard.

## Step 5: Best score and playing again

The best score is the **smallest** number of attempts in a won round. Start with `None` to mean "no wins yet", the "nothing found yet" marker from *Common Loop Patterns*, and replace it when there is no best score yet or the new result is better. Here is the logic on its own, with made-up results:

```python
results = "7 4 9 3 5"   # attempts used in five won rounds

best_score = None       # no wins yet
for word in results.split():
    attempts = int(word)
    if best_score is None or attempts < best_score:
        best_score = attempts
        print(f"Won in {attempts} attempts. New best score!")
    else:
        print(f"Won in {attempts} attempts. Best is still {best_score}.")
```

```text
Won in 7 attempts. New best score!
Won in 4 attempts. New best score!
Won in 9 attempts. Best is still 4.
Won in 3 attempts. New best score!
Won in 5 attempts. Best is still 3.
```

`best_score is None or attempts < best_score` is checked left to right. The first win always becomes the best score, because `best_score is None` is `True`. Short-circuiting also matters here: while `best_score` is `None`, Python never runs `attempts < best_score`, which would raise a `TypeError`.

The play-again loop wraps a whole round. Accept `y` or `yes`, and treat anything else as "no":

```python
rounds = 0

while True:
    rounds += 1
    print(f"--- Round {rounds} ---")
    print("(one full game runs here)")

    again = input("Play again? (y/n): ").strip().lower()
    if again != "y" and again != "yes":
        break

print(f"Thanks for playing {rounds} rounds!")
```

```text
--- Round 1 ---
(one full game runs here)
Play again? (y/n): y
--- Round 2 ---
(one full game runs here)
Play again? (y/n): Y
--- Round 3 ---
(one full game runs here)
Play again? (y/n): no
Thanks for playing 3 rounds!
```

`.lower()` turns `Y` into `y`, so both work.

## Step 6: Quit from anywhere

The game has a loop inside a loop. `break` leaves only the **innermost** loop, so typing `quit` during a guess would just end the round and ask "Play again?". To stop everything, set a flag that the outer loop checks:

```python
playing = True

while playing:
    print("New round")
    while True:
        text = input("Guess: ").strip().lower()
        if text == "quit":
            playing = False
            break
        print(f"  You guessed {text}")

print("Bye!")
```

```text
New round
Guess: 50
  You guessed 50
Guess: 20
  You guessed 20
Guess: quit
Bye!
```

`playing = False` alone does not stop the inner loop right away, and `break` alone does not stop the outer loop. Together they end the program at once. In the full game, one more `if not playing: break` right after the inner loop skips the result and the "Play again?" question.

## The full program

Here is everything in one file. The comments show which step each part came from. Copy it into `guessing_game.py` and run it.

```python
import random

random.seed(7)  # same numbers every run while testing; delete this line to play for real

print("=== Number Guessing Game ===")
print("Type quit at any prompt to stop.")

rounds_played = 0
wins = 0
best_score = None   # no wins yet
playing = True

while playing:
    # ---------- Step 4: choose a difficulty ----------
    print()
    print("Difficulty:  1) Easy   1-50,  10 attempts")
    print("             2) Medium 1-100,  7 attempts")
    print("             3) Hard   1-100,  5 attempts")
    choice = input("Choose 1, 2, or 3: ").strip().lower()

    match choice:
        case "1" | "easy":
            max_number = 50
            max_attempts = 10
        case "2" | "medium":
            max_number = 100
            max_attempts = 7
        case "3" | "hard":
            max_number = 100
            max_attempts = 5
        case "quit" | "q":
            break
        case _:
            print("  Please type 1, 2, 3, or quit.")
            continue

    # ---------- Step 1: pick a secret number ----------
    secret = random.randint(1, max_number)
    attempts = 0
    won = False
    print(f"I am thinking of a number from 1 to {max_number}.")
    print(f"You have {max_attempts} attempts. Good luck!")

    # ---------- Steps 2-3: the guessing loop ----------
    while attempts < max_attempts:
        text = input(f"Guess {attempts + 1}/{max_attempts}: ").strip().lower()

        if text == "quit" or text == "q":
            playing = False
            break
        if not text.isdecimal():
            print("  That is not a whole number. Try again.")
            continue

        guess = int(text)
        if guess < 1 or guess > max_number:
            print(f"  Please stay between 1 and {max_number}.")
            continue

        attempts += 1
        if guess < secret:
            print("  Too low!")
        elif guess > secret:
            print("  Too high!")
        else:
            won = True
            break

    if not playing:
        break

    # ---------- Step 5: results and best score ----------
    rounds_played += 1
    if won:
        wins += 1
        print(f"Correct! The number was {secret}. You needed {attempts} attempts.")
        if best_score is None or attempts < best_score:
            best_score = attempts
            print("New best score!")
    else:
        print(f"Out of attempts. The number was {secret}.")

    # ---------- Step 6: play again? ----------
    again = input("Play again? (y/n): ").strip().lower()
    if again != "y" and again != "yes":
        playing = False

print()
print("=== Game over ===")
print(f"Rounds played: {rounds_played}")
print(f"Rounds won:    {wins}")
if best_score is not None:
    print(f"Best score:    {best_score} attempts")
else:
    print("Best score:    no wins yet")
```

A real session. The player chooses medium, wins in 7 attempts, plays a hard round, and wins it in 5:

```text
=== Number Guessing Game ===
Type quit at any prompt to stop.

Difficulty:  1) Easy   1-50,  10 attempts
             2) Medium 1-100,  7 attempts
             3) Hard   1-100,  5 attempts
Choose 1, 2, or 3: 2
I am thinking of a number from 1 to 100.
You have 7 attempts. Good luck!
Guess 1/7: 50
  Too high!
Guess 2/7: 25
  Too low!
Guess 3/7: abc
  That is not a whole number. Try again.
Guess 3/7: 37
  Too low!
Guess 4/7: 43
  Too high!
Guess 5/7: 40
  Too low!
Guess 6/7: 41
  Too low!
Guess 7/7: 42
Correct! The number was 42. You needed 7 attempts.
New best score!
Play again? (y/n): y

Difficulty:  1) Easy   1-50,  10 attempts
             2) Medium 1-100,  7 attempts
             3) Hard   1-100,  5 attempts
Choose 1, 2, or 3: 4
  Please type 1, 2, 3, or quit.

Difficulty:  1) Easy   1-50,  10 attempts
             2) Medium 1-100,  7 attempts
             3) Hard   1-100,  5 attempts
Choose 1, 2, or 3: 3
I am thinking of a number from 1 to 100.
You have 5 attempts. Good luck!
Guess 1/5: 150
  Please stay between 1 and 100.
Guess 1/5: 50
  Too high!
Guess 2/5: 25
  Too high!
Guess 3/5: 12
  Too low!
Guess 4/5: 18
  Too low!
Guess 5/5: 20
Correct! The number was 20. You needed 5 attempts.
New best score!
Play again? (y/n): n

=== Game over ===
Rounds played: 2
Rounds won:    2
Best score:    5 attempts
```

Match the output to the rules:

- `abc` and `150` were rejected, and they did not use an attempt: the counter stayed at `3/7` and `1/5`.
- The first win set the best score to 7. The second win took only 5 attempts, so it replaced it.
- `4` is not a difficulty, so the menu appeared again.
- The summary counts rounds and wins that were stored **outside** the outer loop, so they survived every round.

## Try it

A compact version with one round on medium difficulty and no seed, so the number changes every run. Type your guesses in **Values for input()**, one per line (for example `50`, `25`, `37`). Then try adding a difficulty menu.

<ClientOnly><PythonPlayground :code='"import random\n\nsecret = random.randint(1, 100)\nmax_attempts = 7\nattempts = 0\nprint(\"I am thinking of a number from 1 to 100.\")\n\nwhile attempts < max_attempts:\n    text = input(f\"Guess {attempts + 1}/{max_attempts}: \").strip().lower()\n    if text == \"quit\":\n        print(\"Bye!\")\n        break\n    if not text.isdecimal():\n        print(\"  Please type a whole number.\")\n        continue\n    guess = int(text)\n    attempts += 1\n    if guess < secret:\n        print(\"  Too low!\")\n    elif guess > secret:\n        print(\"  Too high!\")\n    else:\n        print(f\"Correct! You needed {attempts} attempts.\")\n        break\nelse:\n    print(f\"Out of attempts. The number was {secret}.\")"' /></ClientOnly>

## Common mistakes

### 1. Converting input without checking it

```py
text = "abc"          # what the player typed
guess = int(text)
```

```text
ValueError: invalid literal for int() with base 10: 'abc'
```

One typo and the whole game crashes. **Fix:** `strip()` the text, check `isdecimal()`, and `continue` when it fails. Convert with `int()` only after the check.

### 2. Comparing text with a number

```py
secret = 42
guess = input("Guess: ")      # the player types 50, but guess is the string "50"
if guess < secret:
    print("Too low!")
```

```text
TypeError: '<' not supported between instances of 'str' and 'int'
```

`input()` always returns a string. `"42" == 42` does not crash, but it is always `False`, so the player could never win. **Fix:** convert with `int()` (after validation) before comparing.

### 3. Picking the secret inside the guessing loop

```python
import random

random.seed(7)
for text in "50 50 50".split():       # the same guess three times
    secret = random.randint(1, 100)   # Bad: a new secret before every guess
    guess = int(text)
    if guess < secret:
        print(f"{guess}: Too low!")
    elif guess > secret:
        print(f"{guess}: Too high!")
    else:
        print(f"{guess}: Correct!")
```

```text
50: Too high!
50: Too high!
50: Too low!
```

The same guess gets different hints, because each one refers to a new secret. **Fix:** pick the secret **once per round**, before the inner loop starts.

### 4. Forgetting to reset round variables

```python
max_attempts = 3
attempts = 0          # Bad: set once, outside the rounds loop

for round_number in range(1, 3):
    print(f"Round {round_number}")
    while attempts < max_attempts:
        attempts += 1
        print(f"  Guess {attempts}/{max_attempts}")
```

```text
Round 1
  Guess 1/3
  Guess 2/3
  Guess 3/3
Round 2
```

In the second round `attempts` is still 3, so the inner loop does not run at all and the player loses without a single guess. **Fix:** set `attempts = 0` and `won = False` at the start of **every** round, inside the outer loop.

## Challenges

Try each one before opening the hints. Challenges 1 and 2 also have a reference solution. To make its output repeatable (and let the Check button compare yours with it), the solution uses a fixed secret and takes the guesses from a string instead of `input()`. Test your version the same way before adding it to the full game.

### 1. Attempts left <Difficulty level="1" />

After each wrong guess, show how many attempts remain, for example `Too low! 4 attempts left.`, and use the word "attempt" (not "attempts") when only one is left.

::: details Hints
- `max_attempts - attempts` is the number left.
- Pick the word with a conditional expression: `word = "attempt" if left == 1 else "attempts"`.
- Do not print the message after the winning guess.
:::

Test it with `secret = 42`, `max_attempts = 5`, and the guesses `"50 25 40 41 42"`.

::: details Solution
```python
secret = 42
max_attempts = 5
attempts = 0

for text in "50 25 40 41 42".split():   # the player's guesses
    guess = int(text)
    attempts += 1
    if guess == secret:
        print(f"Correct! You needed {attempts} attempts.")
        break

    left = max_attempts - attempts
    word = "attempt" if left == 1 else "attempts"
    if guess < secret:
        print(f"Too low! {left} {word} left.")
    else:
        print(f"Too high! {left} {word} left.")
else:
    print(f"Out of attempts. The number was {secret}.")
```

```text
Too high! 4 attempts left.
Too low! 3 attempts left.
Too low! 2 attempts left.
Too low! 1 attempt left.
Correct! You needed 5 attempts.
```

In the game, replace the `for` line with the `while attempts < max_attempts:` loop and `input()`.
:::

### 2. Hot and cold <Difficulty level="1" />

Add a second hint based on distance: `(very hot)` when the guess is within 3 of the secret, `(warm)` within 10, and `(cold)` otherwise.

::: details Hints
- `abs(guess - secret)` gives the distance without worrying about the sign.
- Check the smallest distance first: `if distance <= 3` then `elif distance <= 10`.
- Build the message with an f-string, for example `f"  Too low! ({heat})"`.
:::

Test it with `secret = 42` and the guesses `"70 35 45 42"`.

::: details Solution
```python
secret = 42

for text in "70 35 45 42".split():   # the player's guesses
    guess = int(text)
    if guess == secret:
        print("Correct!")
        break

    distance = abs(guess - secret)
    if distance <= 3:
        heat = "very hot"
    elif distance <= 10:
        heat = "warm"
    else:
        heat = "cold"

    if guess < secret:
        print(f"{guess}: Too low! ({heat})")
    else:
        print(f"{guess}: Too high! ({heat})")
```

```text
70: Too high! (cold)
35: Too low! (warm)
45: Too high! (very hot)
Correct!
```
:::

### 3. Show the remaining range <Difficulty level="2" />

Help the player by showing what is still possible: after `50 -> too high` and `25 -> too low`, print `The number is between 26 and 49.`

::: details Hints
- Keep two round variables, `low = 1` and `high = max_number`, reset every round.
- Too low: `low = guess + 1`. Too high: `high = guess - 1`. Without the bonus below, a guess outside the range could widen it again, so only move a bound inward: change `low` only if `guess + 1 > low`, and `high` only if `guess - 1 < high`.
- Bonus: reject guesses outside `low..high` without using an attempt, because they cannot be right.
:::

### 4. Custom difficulty and statistics <Difficulty level="2" />

Add a fourth level, `4) Custom`, where the player enters the largest number and the number of attempts (both validated). At the end, also print the average attempts per won round.

::: details Hints
- Reuse the `isdecimal()` validation pattern in a small `while True` loop for each value.
- Reject a custom range smaller than 2 and attempts smaller than 1.
- Keep `total_attempts` as a session variable. Add to it only when a round is won, and divide by `wins` only if `wins > 0`.
:::

### 5. The computer guesses your number <Difficulty level="3" />

Reverse the game: the player thinks of a number from 1 to 100, and the computer guesses. The player answers `h` (too high), `l` (too low), or `c` (correct). The computer should always win within 7 guesses and should detect cheating (for example, answers that make `low` bigger than `high`).

::: details Hints
- Keep `low = 1` and `high = 100`. The computer guesses `(low + high) // 2`.
- On `h`, set `high = guess - 1`. On `l`, set `low = guess + 1`.
- If `low > high`, the player gave inconsistent answers: print a message and stop.
- Validate the answer with `match answer:` and `case _:` for anything that is not `h`, `l`, or `c`.
:::

## Recap

- Plan first: draw the loops and decide which variables live for the whole session and which reset every round.
- `random.randint(a, b)` includes both ends. `random.seed()` makes results repeatable while testing.
- Validate before converting: `strip()`, then `isdecimal()`, then `int()`. Use `continue` so bad input does not cost an attempt.
- A counter plus `while attempts < max_attempts` limits the attempts, and `break` ends the loop early on a win.
- `match` with `|` patterns turns a menu choice into settings, and `case _:` catches everything else.
- `break` leaves only the innermost loop, so a flag like `playing` stops the outer loop. Test every path: win, lose, invalid input, and quitting at each prompt.

## Further reading

- [`random.randint` and `random.seed`](https://docs.python.org/3/library/random.html#random.randint)
- [`str.isdecimal`](https://docs.python.org/3/library/stdtypes.html#str.isdecimal)
- [Python tutorial: `break` and `continue` statements, and `else` clauses on loops](https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements-and-else-clauses-on-loops)
- [Python tutorial: `match` statements](https://docs.python.org/3/tutorial/controlflow.html#match-statements)
