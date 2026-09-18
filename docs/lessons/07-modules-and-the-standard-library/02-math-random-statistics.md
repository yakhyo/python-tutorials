---
title: math, random, and statistics
description: "Use three everyday standard library modules: math for precise calculations, random for simulations and games, secrets for passwords, and statistics for averages and spread."
---

# math, random, and statistics

![Illustration: math, random, and statistics](/images/topics-webp/math-random-statistics.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- The most useful functions in `math`: roots, rounding, logarithms, combinations, distances
- How to compare floats safely with `math.isclose()`
- How to pick random numbers, items, and samples with `random`, and repeat them with `seed()`
- Why passwords and tokens need `secrets`, not `random`
- How to describe data with `statistics`: mean, median, mode, spread, quantiles
:::

## Why it matters

A delivery app calculates distances, a game rolls dice, a teacher finds the class average. The standard library already has these calculations, tested and fast, in three modules: `math`, `random`, and `statistics`.

## The `math` module

### Roots, powers, and constants

```python
import math

print(math.sqrt(144))
print(math.pow(2, 10))
print(2 ** 10)
print(math.pi)
print(math.e)
```

```text
12.0
1024.0
1024
3.141592653589793
2.718281828459045
```

`math.pow()` always returns a float, while `**` keeps integers as integers. `math.isqrt(150)` returns the whole-number root, `12`.

### Rounding down and up

```python
import math

print(math.floor(7.9), math.ceil(7.1))
print(math.floor(-2.5), math.ceil(-2.5))
print(math.trunc(-2.5))
print(f"Book {math.ceil(47 / 12)} buses")   # 47 students, 12 seats per bus
```

```text
7 8
-3 -2
-2
Book 4 buses
```

`floor` always goes **down** and `ceil` always goes **up**, even for negative numbers, and `trunc` cuts off the decimal part. `ceil` is perfect for "how many do I need?" questions.

### Comparing floats with `isclose`

Floats are stored in binary, so tiny rounding errors appear:

```python
import math

total = 0.1 + 0.2
print(total)
print(total == 0.3)
print(math.isclose(total, 0.3))
```

```text
0.30000000000000004
False
True
```

Never compare calculated floats with `==`. Use `math.isclose(a, b)`, which returns `True` when the numbers are nearly equal.

There is one catch: `isclose` measures closeness *relative* to the size of the numbers, so a comparison with `0` needs an absolute tolerance, `abs_tol`:

```python
import math

left = 0.1 + 0.2 - 0.3
print(left)
print(math.isclose(left, 0))
print(math.isclose(left, 0, abs_tol=1e-9))
```

```text
5.551115123125783e-17
False
True
```

For very accurate sums of many floats, there is `math.fsum()`:

```python
import math

prices = [0.1] * 10
print(sum(prices))
print(math.fsum(prices))
```

```text
1.0
1.0
```

Since Python 3.12, the built-in `sum()` also reduces these rounding errors (older versions print `0.9999999999999999`), and `math.fsum()` is accurate on every version.

### Logarithms

```python
import math

print(math.log10(1000))
print(math.log2(1024))
print(math.log(math.e))
print(math.log(81, 3))
```

```text
3.0
10.0
1.0
4.0
```

`math.log(x)` without a second argument uses base `e`.

### Counting: factorial, combinations, permutations

```python
import math

print(math.factorial(5))   # 5 * 4 * 3 * 2 * 1
print(math.comb(10, 3))    # teams of 3 from a class of 10 (order does not matter)
print(math.perm(10, 3))    # gold, silver, bronze among 10 runners (order matters)
```

```text
120
120
720
```

## The `random` module

`random` produces **pseudo-random** numbers from a formula that starts from a **seed**. The same seed gives the same sequence, so every example below calls `random.seed()` first and your output matches the page.

### Random numbers

```python
import random

random.seed(10)
print(random.random())          # a float from 0.0 up to (not including) 1.0
print(random.randint(1, 6))     # an int from 1 to 6, both ends included
print(random.uniform(20, 35))   # a float between 20 and 35
print(random.randrange(0, 100, 5))   # like range(): 0, 5, 10, ... 95
```

```text
0.5714025946899135
4
27.23842511826284
0
```

Notice `randint(1, 6)` includes `6`, unlike `range(1, 6)`.

### Random items from a list

```python
import random

random.seed(3)
cities = ["Tashkent", "Samarkand", "Bukhara", "Khiva", "Namangan"]

print(random.choice(cities))        # one item
print(random.sample(cities, 3))     # 3 different items
print(random.choices(cities, k=4))  # 4 items, repeats allowed
```

```text
Samarkand
['Namangan', 'Samarkand', 'Khiva']
['Namangan', 'Bukhara', 'Bukhara', 'Khiva']
```

### Weighted choices

`choices` can make some options more likely than others with `weights`:

```python
import random

random.seed(4)
prizes = ["discount 5%", "discount 20%", "free tea"]
weights = [70, 10, 20]           # 70% / 10% / 20% chance

spins = random.choices(prizes, weights=weights, k=10)
print(spins)
print(spins.count("discount 5%"), spins.count("discount 20%"), spins.count("free tea"))
```

```text
['discount 5%', 'discount 5%', 'discount 5%', 'discount 5%', 'discount 5%', 'discount 5%', 'free tea', 'free tea', 'discount 20%', 'discount 5%']
7 1 2
```

The counts (7, 1, 2) match the weights here by luck; only with thousands of spins do they reliably get close.

### Shuffling

`shuffle` changes the list **in place** and returns `None`:

```python
import random

random.seed(5)
queue = ["Aziza", "Bekzod", "Dilnoza", "Farrukh"]
random.shuffle(queue)
print(queue)
```

```text
['Aziza', 'Bekzod', 'Farrukh', 'Dilnoza']
```

### Seeds make results reproducible

```python
import random

random.seed(2026)
first = [random.randint(1, 100) for _ in range(5)]

random.seed(2026)
second = [random.randint(1, 100) for _ in range(5)]

print(first)
print(first == second)
```

```text
[16, 41, 65, 66, 83]
True
```

Seeds are useful for testing and repeatable simulations. A real game normally does not set one.

### `secrets`: for passwords and tokens

`random` is fine for games and simulations, but it is **predictable**: someone who sees enough outputs can work out the next ones. For passwords, reset codes, and security tokens, use the `secrets` module:

```py
import secrets
import string

alphabet = string.ascii_letters + string.digits
password = "".join(secrets.choice(alphabet) for _ in range(12))
print(password)

print(secrets.randbelow(1_000_000))   # e.g. a 6-digit SMS code
print(secrets.token_hex(8))           # a random token for a link
```

```text
q7RkX2mLp9Bs
482913
3fa91c07d25e6b84
```

Your output differs every time, and there is no seed. That is the point.

## The `statistics` module

### Averages: mean, median, mode

```python
import statistics

scores = [72, 85, 90, 85, 64, 98, 85, 70]

print(statistics.mean(scores))
print(statistics.median(scores))
print(statistics.mode(scores))
```

```text
81.125
85.0
85
```

- **mean**: the usual average (sum divided by count).
- **median**: the middle value after sorting. With an even count, it is the average of the two middle values.
- **mode**: the most common value.

The median is useful when a few extreme values would distort the mean:

```python
import statistics

salaries = [4_000_000, 4_500_000, 5_000_000, 5_200_000, 60_000_000]
print(f"mean:   {statistics.mean(salaries):,.0f} som")
print(f"median: {statistics.median(salaries):,.0f} som")
```

```text
mean:   15,740,000 som
median: 5,000,000 som
```

One director's salary pulled the mean far up; the median describes a typical salary better.

If several values tie for most common, `statistics.multimode()` returns all of them as a list.

### Spread: standard deviation

The **standard deviation** measures how far values usually are from the mean:

```python
import statistics

class_a = [70, 72, 74, 76, 78]
class_b = [50, 60, 74, 88, 98]

for name, marks in [("A", class_a), ("B", class_b)]:
    avg = statistics.mean(marks)
    spread = statistics.stdev(marks)
    print(f"Class {name}: mean {avg}, stdev {spread:.1f}")
```

```text
Class A: mean 74, stdev 3.2
Class B: mean 74, stdev 19.6
```

Both classes average `74`, but class B's results are spread much wider.

`stdev` treats the data as a **sample** of a bigger group; `pstdev` treats it as the **whole population** and gives a slightly smaller value (`2.828` instead of `3.162` for class A).

`statistics.quantiles(data)` returns the three quartile cut points, with the median in the middle.

## Try it

Roll dice, pick random winners, and describe the results with statistics. Change the seed and see what changes.

<ClientOnly><PythonPlayground :code='"import math\nimport random\nimport statistics\n\nrandom.seed(42)\nrolls = [random.randint(1, 6) for _ in range(20)]\nprint(\"Rolls:\", rolls)\nprint(\"Mean:\", statistics.mean(rolls))\nprint(\"Median:\", statistics.median(rolls))\nprint(\"Most common:\", statistics.multimode(rolls))\n\nstudents = [\"Aziza\", \"Bekzod\", \"Dilnoza\", \"Farrukh\", \"Malika\"]\nprint(\"Winners:\", random.sample(students, 2))\nprint(\"Possible pairs:\", math.comb(len(students), 2))"' /></ClientOnly>

## Common mistakes

### 1. Using the result of `shuffle`

```python
import random

names = ["Aziza", "Bekzod", "Dilnoza"]
shuffled = random.shuffle(names)
print(shuffled)
```

```text
None
```

`shuffle` changes the list in place and returns `None`. **Fix:** call `random.shuffle(names)` and then use `names`. To get a new shuffled list and keep the original, use `random.sample(names, len(names))`.

### 2. Asking for a bigger sample than the list

```py
import random

random.sample(["Aziza", "Bekzod"], 3)
```

```text
ValueError: Sample larger than population or is negative
```

`sample` never repeats items, so it cannot pick 3 from 2. Use `choices` if repeats are fine.

### 3. Statistics on empty data

```py
import statistics

statistics.mean([])
```

```text
statistics.StatisticsError: mean requires at least one data point
```

Check `if data:` before calculating, just like you would before dividing by `len(data)`.

## Practice

### 1. Paint calculator <Difficulty level="1" />

A wall is 14.5 m² and one can of paint covers 4 m². Print how many cans to buy (whole cans only). Then check with `math.isclose` whether `0.1 * 3` equals `0.3`.

::: details Solution
```python
import math

wall = 14.5
per_can = 4
print(math.ceil(wall / per_can))
print(math.isclose(0.1 * 3, 0.3))
```

```text
4
True
```

`14.5 / 4` is `3.625`, and you cannot buy part of a can, so round **up**.
:::

### 2. Grade statistics <Difficulty level="1" />

For the grades `[88, 92, 79, 65, 92, 100, 71, 84]`, print the mean (1 decimal), median, mode, and standard deviation (1 decimal).

::: details Solution
```python
import statistics

grades = [88, 92, 79, 65, 92, 100, 71, 84]

print(f"Mean:   {statistics.mean(grades):.1f}")
print(f"Median: {statistics.median(grades)}")
print(f"Mode:   {statistics.mode(grades)}")
print(f"Stdev:  {statistics.stdev(grades):.1f}")
```

```text
Mean:   83.9
Median: 86.0
Mode:   92
Stdev:  11.7
```
:::

### 3. Lottery draw <Difficulty level="2" />

A lottery draws 6 different numbers from 1 to 49. Use `random.seed(99)` and print the draw sorted. Then use `math.comb` to print how many different tickets are possible and the chance of winning as "1 in ...".

::: details Solution
```python
import math
import random

random.seed(99)
draw = sorted(random.sample(range(1, 50), 6))
print("Winning numbers:", draw)

tickets = math.comb(49, 6)
print(f"Possible tickets: {tickets:,}")
print(f"Chance of winning: 1 in {tickets:,}")
```

```text
Winning numbers: [12, 13, 15, 25, 26, 39]
Possible tickets: 13,983,816
Chance of winning: 1 in 13,983,816
```

The order of numbers on a ticket does not matter, so `comb` is the right counting tool.
:::

### 4. Random password generator <Difficulty level="2" />

Write `make_password(length=12)` using `secrets` and `string` that returns a password with letters, digits, and the symbols `!@#$%`. Make sure the password contains **at least one digit** by generating again until it does. Print its length and whether it has a digit (the password itself varies).

::: details Solution
```python
import secrets
import string

def make_password(length=12):
    alphabet = string.ascii_letters + string.digits + "!@#$%"
    while True:
        password = "".join(secrets.choice(alphabet) for _ in range(length))
        if any(ch.isdigit() for ch in password):
            return password

pw = make_password()
print(len(pw))
print(any(ch.isdigit() for ch in pw))
```

```text
12
True
```

Printing `pw` itself would show a different value on every run.
:::

### 5. Dice game simulation <Difficulty level="3" />

Bekzod and Aziza each roll two dice; the higher total wins the round, and equal totals are a draw. Simulate 1,000 rounds with `random.seed(12)`. Print the wins for each player, the draws, and Bekzod's win percentage (1 decimal). Then print the mean and median of all Bekzod's totals.

::: details Solution
```python
import random
import statistics

def roll_two():
    return random.randint(1, 6) + random.randint(1, 6)

random.seed(12)
results = {"Bekzod": 0, "Aziza": 0, "draw": 0}
bekzod_totals = []

for _ in range(1000):
    bekzod = roll_two()
    aziza = roll_two()
    bekzod_totals.append(bekzod)
    if bekzod > aziza:
        results["Bekzod"] += 1
    elif aziza > bekzod:
        results["Aziza"] += 1
    else:
        results["draw"] += 1

print(results)
print(f"Bekzod won {results['Bekzod'] / 1000:.1%}")
print("Mean total:", statistics.mean(bekzod_totals))
print("Median total:", statistics.median(bekzod_totals))
```

```text
{'Bekzod': 447, 'Aziza': 454, 'draw': 99}
Bekzod won 44.7%
Mean total: 6.976
Median total: 7.0
```

The players have equal chances, and the mean total is near `7`, the theoretical average for two dice.
:::

## Recap

- `math` has `sqrt`, `floor`/`ceil`, `log`, `factorial`, `comb`/`perm`, and the constants `pi` and `e`.
- Compare calculated floats with `math.isclose()`, not `==`, and use `math.fsum()` for accurate float sums.
- `random` gives `random()`, `randint(a, b)` (both ends included), `uniform`, `choice`, `choices` (with `weights`), `sample`, and `shuffle` (in place, returns `None`); `seed(n)` makes the sequence repeatable.
- Use `secrets`, never `random`, for passwords, codes, and tokens.
- `statistics` describes data: `mean`, `median`, `mode`, `stdev`, and `quantiles`.

## Further reading

- [`math` - Mathematical functions](https://docs.python.org/3/library/math.html)
- [`random` - Generate pseudo-random numbers](https://docs.python.org/3/library/random.html)
- [`statistics` - Mathematical statistics functions](https://docs.python.org/3/library/statistics.html)
- [`secrets` - Generate secure random numbers](https://docs.python.org/3/library/secrets.html)
