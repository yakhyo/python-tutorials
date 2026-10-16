---
title: Pythonic Design Patterns
description: "Use classic design patterns the Python way: strategies as functions, factories with classmethods and dicts, decorator registries, observers, generator pipelines, template methods, and modules instead of singletons."
---

# Pythonic Design Patterns

![Illustration: Pythonic Design Patterns](/images/topics-webp/design-patterns.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- Why **design patterns** are shared vocabulary, not code to copy
- How to write **strategy**, **factory**, and **registry** with functions, classmethods, dicts, and decorators
- How to build an **observer** (event emitter) and see generator pipelines as a pattern
- Where the **template method** idea and abstract classes still fit
- Why a **singleton** in Python is usually just a module
:::

## Why it matters

A design pattern is a named solution to a recurring problem. The names, made famous by the 1994 "Gang of Four" (GoF) book, let a team say "use a strategy here" instead of explaining a design. That book targeted C++ and Smalltalk, and many patterns work around features those languages lacked. In Python, functions are values and decorators exist, so a pattern often shrinks to a few lines. Knowing both keeps you from building a class hierarchy where a dict would do.

## Strategy: pass a function

The **strategy** pattern swaps an algorithm, such as a discount rule. The classic version has a `DiscountStrategy` base class and a subclass per rule. In Python a strategy is just a function you pass in (*Lambdas and Higher-Order Functions*):

```python
from functools import partial

def no_discount(total):
    return total

def percent_off(percent, total):
    return total * (100 - percent) / 100

def holiday(total):
    return max(total - 20000, 0)

def checkout(prices, discount=no_discount):
    return round(discount(sum(prices)))

cart = [45000, 15000, 30000]
print(checkout(cart))
print(checkout(cart, holiday))
print(checkout(cart, partial(percent_off, 15)))
```

```text
90000
70000
76500
```

`checkout` only needs something callable. `partial` turns a rule with a setting into a one-argument strategy. Use a class when a strategy needs several methods or state.

## Factory: classmethods and dicts

A **factory** creates objects so the caller doesn't need the details. The usual Python factory is a `@classmethod` constructor from *Class Attributes, Class Methods, and Static Methods*:

```python
class Payment:
    def __init__(self, method, amount):
        self.method = method
        self.amount = amount

    @classmethod
    def from_string(cls, text):
        method, amount = text.split(":")
        return cls(method.strip(), int(amount))

payment = Payment.from_string("card: 150000")
print(payment.method, payment.amount)
```

```text
card 150000
```

To choose **which class** to create, use a dict instead of an `if`/`elif` chain:

```python
class Courier:
    days = 1

class Post:
    days = 5

DELIVERY_TYPES = {"courier": Courier, "post": Post}

def make_delivery(kind):
    try:
        return DELIVERY_TYPES[kind]()
    except KeyError:
        raise ValueError(f"unknown delivery type: {kind!r}") from None

print(type(make_delivery("post")).__name__)
try:
    make_delivery("drone")
except ValueError as error:
    print(error)
```

```text
Post
unknown delivery type: 'drone'
```

## Registry: fill the dict with a decorator

A **registry** fills such a dict automatically: each function or class adds itself with a decorator from *Closures and Decorators*:

```python
EXPORTERS = {}

def exporter(name):
    def decorator(func):
        EXPORTERS[name] = func
        return func
    return decorator

@exporter("csv")
def to_csv(rows):
    return "\n".join(f"{name},{score}" for name, score in rows)

@exporter("text")
def to_text(rows):
    return "\n".join(f"{name:<6}{score:>3}" for name, score in rows)

rows = [("Aziza", 92), ("Bobur", 85)]
print(sorted(EXPORTERS))
print(EXPORTERS["text"](rows))
```

```text
['csv', 'text']
Aziza  92
Bobur  85
```

A new format is one decorated function. Flask's `@app.route` works the same way.

## Observer: callbacks

The **observer** pattern lets an object announce events without knowing who listens. In Python the observers are just callbacks in a list:

```python
from collections import defaultdict

class EventEmitter:
    def __init__(self):
        self._listeners = defaultdict(list)

    def subscribe(self, event, callback):
        self._listeners[event].append(callback)

    def notify(self, event, data):
        for callback in self._listeners[event]:
            callback(data)

def send_sms(order):
    print(f"SMS to {order['customer']}: order #{order['id']} is paid")

def update_stock(order):
    print(f"Stock: remove {', '.join(order['items'])}")

events = EventEmitter()
events.subscribe("paid", send_sms)
events.subscribe("paid", update_stock)
events.notify("paid", {"id": 17, "customer": "Dilnoza", "items": ["tea", "samsa"]})
```

```text
SMS to Dilnoza: order #17 is paid
Stock: remove tea, samsa
```

The order code never imports the SMS or stock code.

## Iterator and pipeline: generators

The GoF **iterator** pattern needed a class with `has_next()` and `next()`. In Python every `for` loop already uses iterators, and generators from *Iterators and Generators* make pipelines natural:

```python
def strip(lines):
    return (line.strip() for line in lines)

def non_empty(lines):
    return (line for line in lines if line)

def titled(lines):
    return (line.title() for line in lines)

def pipeline(source, *steps):
    for step in steps:
        source = step(source)
    return source

raw = ["  tashkent ", "", "samarkand", "   ", "bukhara"]
print(list(pipeline(raw, strip, non_empty, titled)))
```

```text
['Tashkent', 'Samarkand', 'Bukhara']
```

Each step is small, and the steps themselves are data you can reorder.

## Template method and abstract classes

The **template method** pattern fixes an algorithm's steps in a base class and lets subclasses fill some in. Here the abstract classes from *Polymorphism, Duck Typing, and Abstract Classes* still fit:

```python
from abc import ABC, abstractmethod

class Report(ABC):
    def render(self):                       # the template: fixed order
        return "\n".join([self.header(), *self.lines(), "-- end --"])

    def header(self):
        return "Report"

    @abstractmethod
    def lines(self): ...

class SalesReport(Report):
    def header(self):
        return "Sales: Tashkent"

    def lines(self):
        return ["tea    15,000", "samsa   8,000"]

print(SalesReport().render())
```

```text
Sales: Tashkent
tea    15,000
samsa   8,000
-- end --
```

If only one step varies, passing it as a function is simpler.

## Singleton: use a module

A **singleton** is a class with exactly one instance, such as app settings. In Python a **module** runs once, on first import, and later imports share it. So create one instance at module level:

```py
# settings.py
class Settings:
    def __init__(self):
        self.city = "Tashkent"
        self.currency = "som"

settings = Settings()

# any other file
from settings import settings
```

Imports share one module object:

```python
import json
import json as again

print(json is again)
```

```text
True
```

## GoF pattern vs. what Python usually does

| GoF pattern | What Python usually does instead |
|---|---|
| Strategy | first-class functions, `partial` |
| Factory | `@classmethod` constructors, a dict of classes |
| Iterator | `for`, generators |
| Decorator pattern | decorators, composition |
| Command | functions, `partial` |
| Singleton | a module with a module-level instance |
| Builder | keyword arguments, dataclasses |

## Try it

Add a discount rule and see which one wins for different carts.

<ClientOnly><PythonPlayground :code='"def standard(total):\n    return total\n\ndef student(total):\n    return total * 0.9\n\ndef big_order(total):\n    return total - 30000 if total >= 300000 else total\n\ndef checkout(prices, discount):\n    return round(discount(sum(prices)))\n\ncart = [120000, 95000, 110000]\nfor rule in [standard, student, big_order]:\n    print(f\"{rule.__name__:<10} {checkout(cart, rule):>8,} som\")\n\nbest = min([standard, student, big_order], key=lambda rule: checkout(cart, rule))\nprint(\"Best for this cart:\", best.__name__)"' /></ClientOnly>

## Common mistakes

### 1. A class hierarchy for what a dict does

```python
# Bad: a class per region that only holds a number
class TashkentRate:
    def rate(self):
        return 15000

class SamarkandRate:
    def rate(self):
        return 25000

print(SamarkandRate().rate())

# Good: data belongs in a dict
DELIVERY_RATES = {"Tashkent": 15000, "Samarkand": 25000}
print(DELIVERY_RATES["Samarkand"])
```

```text
25000
25000
```

**Fix:** start with dicts and functions; add classes for behavior or state.

### 2. A mutable registry shared by accident

```python
class EventEmitter:
    listeners = []          # Bad: one list for every emitter

    def subscribe(self, callback):
        self.listeners.append(callback)

    def notify(self, message):
        for callback in self.listeners:
            callback(message)

shop = EventEmitter()
bank = EventEmitter()
shop.subscribe(lambda message: print("shop got:", message))
bank.notify("salary paid")
```

```text
shop got: salary paid
```

The class attribute is shared by all instances. **Fix:** create the list in `__init__` with `self.listeners = []`.

### 3. A `__new__` singleton still runs `__init__`

```python
class Settings:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        print("__init__ runs")
        self.city = "Tashkent"

first = Settings()
first.city = "Samarkand"
second = Settings()
print(first is second, first.city)
```

```text
__init__ runs
__init__ runs
True Tashkent
```

`__new__` returns the old object, but Python calls `__init__` on it again. **Fix:** use a module-level instance.

### 4. Changing the listener list while notifying

```python
listeners = []

def welcome_once(name):
    print("Welcome,", name)
    listeners.remove(welcome_once)

def log_signup(name):
    print("log: signup", name)

listeners.extend([welcome_once, log_signup])
for callback in listeners:
    callback("Jasur")
```

```text
Welcome, Jasur
```

Removing an item mid-loop shifted `log_signup` into a slot the loop had passed. **Fix:** loop over a copy, `for callback in list(listeners):`.

## Practice

### 1. Shipping cost strategies <Difficulty level="1" />

Write strategies taking a weight in kg: `standard` (10,000 som + 2,000 per kg), `express` (double standard), and `pickup` (free). Write `shipping_cost(weight, strategy)` and print each cost for 3 kg.

::: details Solution
```python
def standard(weight):
    return 10000 + 2000 * weight

def express(weight):
    return 2 * standard(weight)

def pickup(weight):
    return 0

def shipping_cost(weight, strategy):
    return strategy(weight)

for strategy in [standard, express, pickup]:
    print(f"{strategy.__name__}: {shipping_cost(3, strategy):,} som")
```

```text
standard: 16,000 som
express: 32,000 som
pickup: 0 som
```
:::

### 2. Plugin registry <Difficulty level="1" />

Write `@plugin`, which appends a text function to `PLUGINS` and returns it. Register `strip` and `no_commas`, then run them in order on `"  Tashkent, Chilonzor  "` and print the `repr` of the result.

::: details Solution
```python
PLUGINS = []

def plugin(func):
    PLUGINS.append(func)
    return func

@plugin
def strip(text):
    return text.strip()

@plugin
def no_commas(text):
    return text.replace(",", "")

text = "  Tashkent, Chilonzor  "
for func in PLUGINS:
    text = func(text)
print(repr(text))
```

```text
'Tashkent Chilonzor'
```
:::

### 3. Event emitter with unsubscribe <Difficulty level="2" />

Write an `EventEmitter` whose `subscribe(event, callback)` **returns a function** that unsubscribes that callback. Subscribe two listeners to `"sale"`, notify, unsubscribe one, and notify again.

::: details Solution
```python
from collections import defaultdict

class EventEmitter:
    def __init__(self):
        self._listeners = defaultdict(list)

    def subscribe(self, event, callback):
        self._listeners[event].append(callback)

        def unsubscribe():
            self._listeners[event].remove(callback)
        return unsubscribe

    def notify(self, event, data):
        for callback in list(self._listeners[event]):
            callback(data)

emitter = EventEmitter()
stop_email = emitter.subscribe("sale", lambda amount: print(f"email: {amount:,} som"))
emitter.subscribe("sale", lambda amount: print(f"report: {amount:,} som"))

emitter.notify("sale", 150000)
stop_email()
emitter.notify("sale", 80000)
```

```text
email: 150,000 som
report: 150,000 som
report: 80,000 som
```

`unsubscribe` is a closure over `event` and `callback`.
:::

### 4. Order state machine <Difficulty level="2" />

An order goes `created → paid → shipped`; `cancel` works only before shipping. Store the rules in a table `{(state, action): new_state}` and write `Order.apply(action)`, raising `ValueError` for forbidden actions. Run `pay`, `ship`, `cancel`, printing `ACTION: now STATE` or `Error: MESSAGE`.

::: details Solution
```python
TRANSITIONS = {
    ("created", "pay"): "paid",
    ("created", "cancel"): "cancelled",
    ("paid", "ship"): "shipped",
    ("paid", "cancel"): "cancelled",
}

class Order:
    def __init__(self):
        self.state = "created"

    def apply(self, action):
        key = (self.state, action)
        if key not in TRANSITIONS:
            raise ValueError(f"cannot {action} an order that is {self.state}")
        self.state = TRANSITIONS[key]

order = Order()
for action in ["pay", "ship", "cancel"]:
    try:
        order.apply(action)
        print(f"{action}: now {order.state}")
    except ValueError as error:
        print("Error:", error)
```

```text
pay: now paid
ship: now shipped
Error: cannot cancel an order that is shipped
```

A new step is one table line, not a new `if`.
:::

### 5. Pricing plugins <Difficulty level="3" />

Combine registry and strategy: `@pricing("vip")` registers a price function for a customer type. Add a factory `Order.from_string("vip:120000,80000")` and `order.total()`, which uses the strategy for its type, or `"regular"` for unknown types. Print the type and total for `vip:120000,80000`, `student:50000` and `tourist:30000,20000`.

::: details Solution
```python
PRICING = {}

def pricing(customer_type):
    def decorator(func):
        PRICING[customer_type] = func
        return func
    return decorator

@pricing("regular")
def regular(total):
    return total

@pricing("student")
def student(total):
    return total * 0.9

@pricing("vip")
def vip(total):
    return total * 0.8

class Order:
    def __init__(self, customer_type, prices):
        self.customer_type = customer_type
        self.prices = prices

    @classmethod
    def from_string(cls, text):
        customer_type, prices = text.split(":")
        return cls(customer_type, [int(p) for p in prices.split(",")])

    def total(self):
        strategy = PRICING.get(self.customer_type, PRICING["regular"])
        return round(strategy(sum(self.prices)))

for text in ["vip:120000,80000", "student:50000", "tourist:30000,20000"]:
    order = Order.from_string(text)
    print(order.customer_type, order.total())
```

```text
vip 160000
student 45000
tourist 50000
```

A new customer type never changes `Order`.
:::

## Recap

- Patterns are **vocabulary**; in Python many shrink to a language feature.
- **Strategy** is a function you pass in; a **factory** is a `@classmethod` or a dict of classes; a **registry** is that dict filled by a decorator.
- An **observer** keeps a list of callbacks; notify from a copy of it.
- **Iterators** are generators, chained into pipelines. **Template methods** suit abstract base classes.
- A **singleton** is a module-level instance; `__new__` tricks still re-run `__init__`.

## Further reading

- [Python Tutorial: Classes](https://docs.python.org/3/tutorial/classes.html)
- [`functools`: higher-order functions](https://docs.python.org/3/library/functools.html)
- [`abc`: abstract base classes](https://docs.python.org/3/library/abc.html)
- [Python Design Patterns guide by Brandon Rhodes](https://python-patterns.guide/)
