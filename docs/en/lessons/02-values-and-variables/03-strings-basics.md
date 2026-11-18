---
title: Strings
description: "Work with text in Python: joining and repeating strings, length, indexing individual characters, immutability, the in operator, and a first look at Unicode and bytes."
---

# Strings

![Illustration: Strings](/images/topics-webp/strings-basics.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- How to join strings with `+`, repeat them with `*`, and count characters with `len()`
- How to get single characters with **indexing**, including negative indexes
- Why strings can't be changed in place (immutability)
- How to check whether text contains something with `in`
- How Python stores characters as Unicode, and what `bytes` are
:::

## Why it matters

Names, messages, emails, file names, passwords, web pages: a huge amount of real-world data is text. In Python, text is stored as a **string** (`str`), a sequence of characters. You already know how to write strings from *Hello, World!* This lesson shows how to take them apart and put them together.

## Joining strings: `+`

`+` **concatenates** (joins) strings end to end:

```python
first_name = "Aziza"
last_name = "Karimova"

full_name = first_name + " " + last_name
print(full_name)
```

```text
Aziza Karimova
```

`+` adds **no space** by itself, so you have to include one, as with `" "` above.

## Repeating strings: `*`

Multiplying a string by a whole number repeats it:

```python
print("ha" * 3)
print("-" * 20)
```

```text
hahaha
--------------------
```

That's a quick way to draw lines and borders in text output.

## Length: `len()`

The built-in `len()` function returns how many characters a string has. Spaces and punctuation count too:

```python
password = "tea2go!"
print(len(password))
print(len("Hello, world!"))
print(len(""))
```

```text
7
13
0
```

`""` is the **empty string**: a string with no characters.

## Indexing: getting one character

![Diagram: positive and negative string indexes](/images/companions-webp/string-indexing.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Every character in a string has a position number called an **index**. Indexes **start at 0**:

```text
 P   y   t   h   o   n
 0   1   2   3   4   5     ← index from the start
-6  -5  -4  -3  -2  -1     ← index from the end
```

Put the index in square brackets to get that character:

```python
word = "Python"

print(word[0])   # first character
print(word[1])
print(word[5])   # last character
```

```text
P
y
n
```

### Negative indexes count from the end

`-1` is the last character, `-2` is the second-to-last, and so on. This is handy when you don't know the length:

```python
word = "Python"
print(word[-1])
print(word[-2])
```

```text
n
o
```

The last index is always `len(word) - 1`, because counting starts at 0:

```python
word = "Python"
print(word[len(word) - 1])   # same as word[-1]
```

::: info Why start at 0?
Think of the index as "how many characters to skip from the start". To get the first character you skip 0. Most programming languages count this way, and you'll get used to it quickly.
:::

In the next lesson you'll learn **slicing**, which gets several characters at once (like `word[0:3]` → `"Pyt"`).

## Strings can't be changed in place

Strings are **immutable**: once a string is created, its characters can't be changed.

```py
word = "hello"
word[0] = "H"
```

```text
TypeError: 'str' object does not support item assignment
```

Instead, you build a **new** string and assign it to the variable:

```python
word = "hello"
word = "H" + word[1:]   # "H" + "ello"
print(word)
```

```text
Hello
```

(`word[1:]` means "from index 1 to the end". Slicing is explained in the next lesson.)

Immutability sounds limiting, but it makes strings safe to share: if two variables refer to the same string, neither can change it for the other.

## Checking contents: `in`

`in` checks whether one string appears inside another. The result is `True` or `False`:

```python
email = "aziza@example.com"

print("@" in email)
print("gmail" in email)
print("gmail" not in email)
```

```text
True
False
True
```

The check is **case-sensitive**: `"Py" in "python"` is `False`. You'll use `True`/`False` results with `if` statements in the *Making Decisions* module.

## Strings and numbers don't mix automatically

`+` means *add* for numbers and *join* for strings. Python refuses to guess what you want when you mix them:

```py
age = 20
print("Age: " + age)
```

```text
TypeError: can only concatenate str (not "int") to str
```

You have three good options:

```python
age = 20

print("Age:", age)          # 1. separate arguments to print()
print("Age: " + str(age))   # 2. convert the number with str()
print(f"Age: {age}")        # 3. an f-string (see the F-Strings lesson)
```

All three print `Age: 20`. The f-string is usually the clearest, and you'll learn it soon.

## Text, Unicode and bytes

A computer only stores numbers, so every character has a number too. Python uses **Unicode**, a standard that gives a number called a **code point** to every character in almost every writing system: Latin, Cyrillic, Arabic, emoji and more. `ord()` gives a character's code point, and `chr()` goes back:

```python
print(ord("A"), ord("ş"))
print(chr(65), chr(351))
```

```text
65 351
A ş
```

`len()` counts code points, not what looks like a letter to you. In Uzbek Latin, `oʻ` is written with the letter `o` plus a separate **modifier letter** `ʻ`, so it counts as two characters:

```python
print(len("oʻ"))
print(len("Oʻzbekiston"))
print(ord("ʻ"), ord("'"))
```

```text
2
11
699 39
```

The last line shows that `ʻ` (code point 699) and the keyboard apostrophe `'` (39) are **different characters**, even though they look alike. That matters when you search or compare text (see *Common mistakes*).

### `str` and `bytes`

A `str` holds characters. When text is saved to a file or sent over the internet, it has to become **bytes**: plain numbers from 0 to 255. The rules for turning characters into bytes are called an **encoding**, and UTF-8 is the one to use. `.encode()` turns a string into `bytes`, and `.decode()` turns it back:

```python
country = "Oʻzbekiston"
data = country.encode("utf-8")

print(data)
print(len(data))
print(data.decode("utf-8"))
```

```text
b'O\xca\xbbzbekiston'
12
Oʻzbekiston
```

A `bytes` value is shown with a `b` before the quotes. Plain English letters take one byte each, but `ʻ` takes two (`\xca\xbb`), so the bytes are longer than the string. You'll rarely call `.encode()` yourself. It matters when you read and write files, which *Files and pathlib* covers, including why you should always say `encoding="utf-8"`.

## Try it

Build a username from a first and last name: the first letter of the first name, plus the whole last name, plus the length of the full name.

<ClientOnly><PythonPlayground :code='"first = \"dilnoza\"\nlast = \"rahimova\"\n\nusername = first[0] + last + str(len(first + last))\nprint(username)\nprint(\"Length:\", len(username))"' /></ClientOnly>

## Common mistakes

### 1. Index out of range

```py
word = "cat"
print(word[3])
```

```text
IndexError: string index out of range
```

`"cat"` has indexes `0`, `1`, and `2`. **Fix:** remember the last index is `len(word) - 1`, or use `word[-1]`.

### 2. Forgetting spaces when joining

```python
city = "Tashkent"
print("I live in" + city)   # I live inTashkent
```

**Fix:** `"I live in " + city`, or `print("I live in", city)`.

### 3. Adding numbers that are really strings

```python
apples = "5"
pears = "5"
print(apples + pears)
```

```text
55
```

No error, just a wrong answer: both values are strings, so `+` joins them. This often happens with values from `input()`. **Fix:** convert them to numbers first, as shown in *Input and Type Conversion*: `int(apples) + int(pears)` gives `10`.

### 4. Searching with the wrong apostrophe

```python
country = "Oʻzbekiston"
print("O'zbekiston" == country)
print("'" in country)
```

```text
False
False
```

The text was typed with the Uzbek letter `ʻ`, but the search uses the keyboard apostrophe `'`. They look alike but are different characters. **Fix:** use the same character in both places. If your data may contain both, replace one with the other first. You'll learn `.replace()` in the next lesson.

## Practice

### 1. Greeting <Difficulty level="1" />

Given `name = "Bekzod"`, use `+` to print `Hello, Bekzod!`

::: details Solution
```python
name = "Bekzod"
print("Hello, " + name + "!")
```
:::

### 2. First and last <Difficulty level="1" />

For `word = "Samarkand"`, print the first character, the last character, and the length.

::: details Solution
```python
word = "Samarkand"
print(word[0])
print(word[-1])
print(len(word))
```

```text
S
d
9
```
:::

### 3. Initials <Difficulty level="2" />

Given `first = "aziza"` and `last = "karimova"`, print the initials `a.k.` using indexing and `+`.

::: details Solution
```python
first = "aziza"
last = "karimova"
print(first[0] + "." + last[0] + ".")
```

In the next lesson you'll learn `.upper()`, which turns this into `A.K.`.
:::

### 4. A framed title <Difficulty level="2" />

Print a title inside a frame whose width **automatically matches** the text, using `*` and `len()`:

```text
+----------------+
| Python Journal |
+----------------+
```

Your code should still work if you change the title.

::: details Solution
```python
title = "Python Journal"
border = "+" + "-" * (len(title) + 2) + "+"

print(border)
print("| " + title + " |")
print(border)
```

`len(title) + 2` accounts for the space on each side of the title.
:::

### 5. The middle character <Difficulty level="3" />

Print the middle character of a word. For an even-length word, print the character just **after** the middle. Store `"python"` (6 letters → `h`), `"plov"` (4 letters → `o`) and `"tea"` (3 letters → `e`) in three variables and print the middle character of each, one per line.

::: details Solution
```python
word1 = "python"
word2 = "plov"
word3 = "tea"

print(word1[len(word1) // 2])
print(word2[len(word2) // 2])
print(word3[len(word3) // 2])
```

```text
h
o
e
```

- `"python"`: `6 // 2 = 3`, and `word1[3]` is `"h"`.
- `"plov"`: `4 // 2 = 2`, and `word2[2]` is `"o"`.
- `"tea"`: `3 // 2 = 1`, and `word3[1]` is `"e"`.

Floor division `//` from the previous lesson gives a whole-number index for any length.
:::

## Recap

- `+` joins strings and `*` repeats them. Add spaces yourself.
- `len(text)` counts characters, including spaces.
- `text[i]` gets one character. Indexes start at `0`, and `-1` is the last character.
- Strings are **immutable**: build a new string instead of changing one.
- `"x" in text` checks for a substring and is case-sensitive. Don't `+` a string and a number: use `str()`, commas in `print()`, or an f-string.
- Every character is a Unicode code point (`ord`/`chr`), and `.encode("utf-8")` turns a `str` into `bytes`.

## Further reading

- [Python Tutorial - Text](https://docs.python.org/3/tutorial/introduction.html#text)
- [Text sequence type - `str`](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str)
- [Common sequence operations](https://docs.python.org/3/library/stdtypes.html#common-sequence-operations)
