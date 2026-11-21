---
title: Polymorphism, Duck Typing, and Abstract Classes
description: "Write code that works with many kinds of objects: polymorphism through shared method names, duck typing, hasattr versus EAFP, and abstract base classes with abc.ABC and @abstractmethod."
---

# Polymorphism, Duck Typing, and Abstract Classes

![Illustration: Polymorphism, Duck Typing, and Abstract Classes](/images/topics-webp/polymorphism-and-abcs.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- What **polymorphism** is: one method name, many behaviors, one loop for all
- **Duck typing**: why Python cares what an object can do, not what it is
- How to check abilities with `hasattr()` or with EAFP (`try`/`except`)
- How **abstract base classes** (`abc.ABC`, `@abstractmethod`) force subclasses to fill in required methods
:::

## Why it matters

An online shop in Tashkent accepts cards, cash, and a mobile wallet. Its checkout should not be an `if kind == "card": ... elif ...` chain that grows with every payment method. Polymorphism lets the checkout say `method.pay(amount)` and each object decide **how**. A new payment method is one new class, and abstract classes make sure it has the required methods.

## One name, many behaviors

**Polymorphism** means "many forms": different classes provide a method with the same name, each in its own way:

```python
class Cat:
    def speak(self):
        return "Meow"

class Dog:
    def speak(self):
        return "Woof"

for animal in [Cat(), Dog()]:
    print(animal.speak())

print(2 + 3, "non" + "voy", [1] + [2])
```

```text
Meow
Woof
5 nonvoy [1, 2]
```

The loop only calls `speak()`; the classes do not even share a parent. `+` is polymorphic too: each type defines its own `__add__` (see *Operators and Containers*).

## Duck typing

"If it walks like a duck and quacks like a duck, it is a duck." Python does not check an object's class before calling a method: any object with the right method works. Built-ins do the same: `len()` accepts anything with `__len__`:

```python
class Field:
    """A farm field: not a shape, but it has an area."""
    def __init__(self, hectares):
        self.hectares = hectares

    def area(self):
        return self.hectares * 10_000   # square meters


class Playlist:
    def __init__(self, songs):
        self.songs = songs

    def __len__(self):
        return len(self.songs)


print(Field(0.5).area())
for thing in ["hello", [1, 2, 3], Playlist(["Yalla", "Sevara"])]:
    print(type(thing).__name__, len(thing))
```

```text
5000.0
str 5
list 3
Playlist 2
```

Any code that calls `.area()` accepts a `Field`, with no shared base class. `len()` has no list of "allowed" types either.

## Checking abilities: `hasattr` vs. EAFP

When an object may lack a method, you can **look before you leap**: `if hasattr(doc, "export"):`. Or use **EAFP** ("easier to ask forgiveness than permission"): try, and handle the error:

```python
class PdfReport:
    def export(self):
        return "report.pdf"

class Draft:
    pass

for doc in [PdfReport(), Draft()]:
    try:
        result = doc.export()
    except AttributeError:
        print(f"{type(doc).__name__} cannot be exported")
    else:
        print("Exported", result)
```

```text
Exported report.pdf
Draft cannot be exported
```

EAFP is the more common Python style. Keep the `try` around the one call that might be missing, or an unrelated `AttributeError` bug would be reported as "cannot be exported".

## The problem duck typing does not solve

Duck typing fails **late**: a missing method is found only when it is called:

```py
class TelegramSender:
    def send(self, user, text):
        return f"Telegram to {user}: {text}"

class EmailSender:
    def sned(self, user, text):          # typo, nobody noticed
        return f"Email to {user}: {text}"

for sender in [TelegramSender(), EmailSender()]:
    print(sender.send("Aziza", "Your order has shipped"))
```

```text
Telegram to Aziza: Your order has shipped
AttributeError: 'EmailSender' object has no attribute 'send'
```

The first message went out before the crash. Abstract base classes catch this when the object is **created**.

## Abstract base classes

An **abstract base class** (ABC) lists the methods every subclass must have. Only subclasses that fill in every abstract method can create objects:

```python
from abc import ABC, abstractmethod


class NotificationSender(ABC):
    @abstractmethod
    def send(self, user, text):
        """Deliver text to user and return a status string."""

    def send_many(self, users, text):          # a normal, shared method
        return [self.send(user, text) for user in users]


class SmsSender(NotificationSender):
    def send(self, user, text):
        return f"SMS to {user}: {text[:20]}"


class EmailSender(NotificationSender):
    def sned(self, user, text):                # typo
        return f"Email to {user}: {text}"


print(SmsSender().send_many(["Aziza", "Bekzod"], "Order shipped"))

for cls in [NotificationSender, EmailSender]:
    try:
        cls()
    except TypeError as error:
        print(error)
```

```text
['SMS to Aziza: Order shipped', 'SMS to Bekzod: Order shipped']
Can't instantiate abstract class NotificationSender without an implementation for abstract method 'send'
Can't instantiate abstract class EmailSender without an implementation for abstract method 'send'
```

Inheriting from `ABC` makes the class abstract-capable, and `@abstractmethod` marks `send` as **required** (its body is just a docstring or `...`). `send_many` is an ordinary shared method that can rely on `send` existing. The `EmailSender` typo is now caught at creation, and the message names the missing method.

## Worked example: payment methods with an ABC

Here is the shop's checkout without an if-chain. The abstract class requires `pay()` and provides a shared `receipt()`:

```python
from abc import ABC, abstractmethod


class PaymentError(Exception):
    pass


class PaymentMethod(ABC):
    name = "payment"

    @abstractmethod
    def pay(self, amount):
        """Take amount som or raise PaymentError."""

    def receipt(self, amount):
        self.pay(amount)
        return f"{amount:>9,} som paid by {self.name}"


class Card(PaymentMethod):
    name = "card"

    def pay(self, amount):
        if amount > 5_000_000:
            raise PaymentError("Card limit is 5,000,000 som")


class Wallet(PaymentMethod):
    name = "wallet"

    def __init__(self, balance):
        self.balance = balance

    def pay(self, amount):
        if amount > self.balance:
            raise PaymentError(f"Wallet has only {self.balance:,} som")
        self.balance -= amount


orders = [(Card(), 350_000), (Wallet(200_000), 150_000), (Wallet(10_000), 90_000), (Card(), 7_000_000)]
for method, amount in orders:
    try:
        print(method.receipt(amount))
    except PaymentError as error:
        print(f"{amount:>9,} som FAILED: {error}")
```

```text
  350,000 som paid by card
  150,000 som paid by wallet
   90,000 som FAILED: Wallet has only 10,000 som
7,000,000 som FAILED: Card limit is 5,000,000 som
```

The loop has no `if` on the payment kind, and `receipt()` is written once for every payment method, including future ones.

## Try it

Add a `TelegramSender` class with a `send()` method, then try creating a subclass that forgets `send()` to see the `TypeError`.

<ClientOnly><PythonPlayground :code='"from abc import ABC, abstractmethod\n\n\nclass Sender(ABC):\n    @abstractmethod\n    def send(self, user, text):\n        pass\n\n    def broadcast(self, users, text):\n        for user in users:\n            print(self.send(user, text))\n\n\nclass EmailSender(Sender):\n    def send(self, user, text):\n        return f\"Email to {user}: {text}\"\n\n\nclass SmsSender(Sender):\n    def send(self, user, text):\n        return f\"SMS to {user}: {text[:20]}\"\n\n\nfor sender in [EmailSender(), SmsSender()]:\n    sender.broadcast([\"Aziza\", \"Bekzod\"], \"The library closes at 18:00 today\")"' /></ClientOnly>

## Common mistakes

### 1. Forgetting to inherit from `ABC`

```python
from abc import abstractmethod

class Exporter:                 # no ABC
    @abstractmethod
    def convert(self, rows):
        pass

e = Exporter()                  # no error at all
print(e.convert([]))
```

```text
None
```

Without `ABC` as a parent, `@abstractmethod` is silently ignored. **Fix:** `class Exporter(ABC):`.

### 2. Different method signatures in the family

```py
class Card:
    def pay(self, amount):
        return f"card {amount}"

class Wallet:
    def pay(self, amount, phone):          # needs an extra argument
        return f"wallet {amount} {phone}"

for method in [Card(), Wallet()]:
    print(method.pay(100_000))
```

```text
card 100000
TypeError: Wallet.pay() missing 1 required positional argument: 'phone'
```

Every class must accept the **same arguments**. **Fix:** put per-object data like `phone` in `__init__`.

### 3. Checking types instead of using polymorphism

```python
class Circle:
    pass

class Square:
    pass

class Triangle:
    pass

def describe(shape):                       # Bad: the if-chain is back
    if isinstance(shape, Circle):
        return "round"
    elif isinstance(shape, Square):
        return "four corners"

for shape in [Circle(), Square(), Triangle()]:
    print(describe(shape))
```

```text
round
four corners
None
```

The new `Triangle` silently gets `None`. **Fix:** give each class a `describe()` method and call it. Use `isinstance` for validation, not to decide what to do.

## Practice

### 1. Talking devices <Difficulty level="1" />

Create classes `Phone`, `Radio`, and `Doorbell`, each with a `sound()` method returning a different string. Put one of each in a list and print every sound in a loop.

::: details Solution
```python
class Phone:
    def sound(self):
        return "Ring ring"

class Radio:
    def sound(self):
        return "Now playing the news from Tashkent"

class Doorbell:
    def sound(self):
        return "Ding dong"

for device in [Phone(), Radio(), Doorbell()]:
    print(f"{type(device).__name__}: {device.sound()}")
```

```text
Phone: Ring ring
Radio: Now playing the news from Tashkent
Doorbell: Ding dong
```
:::

### 2. Shape family with an ABC <Difficulty level="1" />

Write an abstract `Shape` with an abstract `area()` and a normal `summary()` method. Implement `Rectangle` and `Circle`. Print the summary for a 3 x 4 rectangle and a circle with radius 1.

::: details Solution
```python
import math
from abc import ABC, abstractmethod


class Shape(ABC):
    @abstractmethod
    def area(self):
        ...

    def summary(self):
        return f"{type(self).__name__}: area {self.area():.2f}"


class Rectangle(Shape):
    def __init__(self, w, h):
        self.w, self.h = w, h

    def area(self):
        return self.w * self.h


class Circle(Shape):
    def __init__(self, r):
        self.r = r

    def area(self):
        return math.pi * self.r ** 2


for shape in [Rectangle(3, 4), Circle(1)]:
    print(shape.summary())
```

```text
Rectangle: area 12.00
Circle: area 3.14
```
:::

### 3. Anything with a length <Difficulty level="2" />

Write `longest(items)` that returns the item with the largest `len()`, without checking types. Test it with `"Samarkand"`, `[1, 2, 3]`, and your own `Queue` class with `__len__` and `__repr__` holding 12 people.

::: details Solution
```python
class Queue:
    def __init__(self, people):
        self.people = people

    def __len__(self):
        return len(self.people)

    def __repr__(self):
        return f"Queue({len(self)} people)"


def longest(items):
    return max(items, key=len)


print(longest(["Samarkand", [1, 2, 3], Queue(["Aziza"] * 12)]))
print(longest(["Samarkand", [1, 2, 3]]))
```

```text
Queue(12 people)
Samarkand
```
:::

### 4. Design from a description: delivery pricing <Difficulty level="2" />

A delivery company offers **Standard** (15,000 som plus 2,000 som per kg), **Express** (twice Standard), and **Pickup point** (flat 10,000 som). Design an ABC that requires `cost(weight_kg)` and shares a `quote(weight_kg)` method. Print quotes for a 3 kg parcel, then show that a `Drone` service without `cost()` raises `TypeError`.

::: details Solution
```python
from abc import ABC, abstractmethod


class DeliveryService(ABC):
    @abstractmethod
    def cost(self, weight_kg):
        ...

    def quote(self, weight_kg):
        return f"{type(self).__name__:<12} {weight_kg} kg: {self.cost(weight_kg):>7,} som"


class Standard(DeliveryService):
    def cost(self, weight_kg):
        return 15_000 + 2_000 * weight_kg


class Express(Standard):
    def cost(self, weight_kg):
        return super().cost(weight_kg) * 2


class PickupPoint(DeliveryService):
    def cost(self, weight_kg):
        return 10_000


for service in [Standard(), Express(), PickupPoint()]:
    print(service.quote(3))


class Drone(DeliveryService):
    pass

try:
    Drone()
except TypeError:
    print("Drone is missing cost()")
```

```text
Standard     3 kg:  21,000 som
Express      3 kg:  42,000 som
PickupPoint  3 kg:  10,000 som
Drone is missing cost()
```

`Express` inherits from `Standard` because its price is built on the standard one.
:::

### 5. Plugin-style text filters <Difficulty level="3" />

Create an abstract `TextFilter` with abstract `apply(text)`, and subclasses `StripSpaces` (collapse repeated spaces), `Censor` (replace banned words with `***`, ignoring case), and `Capitalize` (uppercase the first letter). Write `run_pipeline(text, filters)` that applies them in order, printing each step. Test on `"  the  bad weather in  tashkent  "` with `Censor(["BAD"])`.

::: details Solution
```python
from abc import ABC, abstractmethod


class TextFilter(ABC):
    @abstractmethod
    def apply(self, text):
        ...


class StripSpaces(TextFilter):
    def apply(self, text):
        return " ".join(text.split())


class Censor(TextFilter):
    def __init__(self, banned):
        self.banned = {w.lower() for w in banned}

    def apply(self, text):
        return " ".join("***" if w.lower() in self.banned else w for w in text.split(" "))


class Capitalize(TextFilter):
    def apply(self, text):
        return text[:1].upper() + text[1:]


def run_pipeline(text, filters):
    for f in filters:
        text = f.apply(text)
        print(f"{type(f).__name__:<12} -> {text!r}")
    return text


run_pipeline("  the  bad weather in  tashkent  ", [StripSpaces(), Censor(["BAD"]), Capitalize()])
```

```text
StripSpaces  -> 'the bad weather in tashkent'
Censor       -> 'the *** weather in tashkent'
Capitalize   -> 'The *** weather in tashkent'
```

Spaces are cleaned first, so `Censor` can split on single spaces.
:::

## Recap

- **Polymorphism**: classes share a method name, so one loop or function works with all of them.
- Objects with a shared method replace `if kind == ...` chains, so adding a new kind is one new class.
- **Duck typing**: Python cares whether an object has the method, not its class. `len()` and `+` work this way.
- Check with `hasattr()`, or use EAFP with a small `try` block.
- `abc.ABC` plus `@abstractmethod` defines required methods. A missing one raises `TypeError` when the object is created.

## Further reading

- [`abc` module: Abstract Base Classes](https://docs.python.org/3/library/abc.html)
- [`collections.abc` module](https://docs.python.org/3/library/collections.abc.html)
- [Glossary: duck typing and EAFP](https://docs.python.org/3/glossary.html#term-duck-typing)
