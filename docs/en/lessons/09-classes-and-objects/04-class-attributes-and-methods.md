---
title: Class Attributes, Class Methods, and Static Methods
description: "Share data across all instances with class attributes, avoid the shadowing and shared-list traps, build alternative constructors with @classmethod, and group helpers with @staticmethod."
---

# Class Attributes, Class Methods, and Static Methods

![Illustration: Class Attributes, Class Methods, and Static Methods](/images/topics-webp/class-attributes-and-methods.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- The difference between **instance attributes** (one per object) and **class attributes** (shared by all)
- How Python looks up an attribute, and the **shadowing** trap that follows from it
- How `@classmethod` creates **alternative constructors** such as `from_string()`
- How `@staticmethod` groups helper functions with their class, and how to choose between the three kinds of methods
:::

## Why it matters

Some information belongs to **each** object, like an account's balance. Other information belongs to the **whole class**, like a bank's interest rate. Classes also often need several ways to create objects, from separate values or from a line of text. Real libraries use these tools constantly.

## Class attributes

A variable in the class body, outside any method, is a **class attribute**. All instances can read it, and assigning through the **class** name changes it for everyone:

```python
class BankAccount:
    interest_rate = 0.14              # class attribute: shared by all accounts

    def __init__(self, owner, balance):
        self.owner = owner            # instance attributes: one per account
        self.balance = balance

    def yearly_interest(self):
        return self.balance * self.interest_rate

aziza = BankAccount("Aziza", 1000000)
bekzod = BankAccount("Bekzod", 250000)
print(BankAccount.interest_rate, aziza.interest_rate)
print(aziza.yearly_interest(), bekzod.yearly_interest())

BankAccount.interest_rate = 0.16      # the central bank changed the rate
print(aziza.yearly_interest(), bekzod.yearly_interest())
```

```text
0.14 0.14
140000.0 35000.0
160000.0 40000.0
```

The value lives in **one** place, so accounts can't disagree about it. Class attributes are also the natural home for constants such as `MAX_TOPPINGS = 5`, named in `UPPER_CASE`.

## How Python finds an attribute, and the shadowing trap

For `aziza.interest_rate`, Python looks on the object first, then on its class, and raises `AttributeError` only if neither has it. So reading a class attribute through an instance is fine. **Assigning** through an instance is different: it never changes the class attribute. It creates a new instance attribute with the same name, which hides (**shadows**) the class value for that one object:

![Diagram: attribute lookup from instance to class](/images/companions-webp/attribute-lookup.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

```python
class BankAccount:
    interest_rate = 0.14

    def __init__(self, owner):
        self.owner = owner

aziza = BankAccount("Aziza")
bekzod = BankAccount("Bekzod")

aziza.interest_rate = 0.20            # creates an instance attribute on aziza only
print(aziza.interest_rate, bekzod.interest_rate, BankAccount.interest_rate)
print(vars(aziza), vars(bekzod))
```

```text
0.2 0.14 0.14
{'owner': 'Aziza', 'interest_rate': 0.2} {'owner': 'Bekzod'}
```

Now `aziza` ignores later changes to `BankAccount.interest_rate`. Occasionally that's intended (a VIP rate), but usually it's an accident. **Rule:** change a class attribute through the class name, or through `cls` in a class method.

## Class methods: `@classmethod`

A **class method** receives the **class** as its first argument, named `cls`, instead of the instance. You create one with the `@classmethod` decorator, a line starting with `@` just above `def`. Its most common use is an **alternative constructor** that creates objects from a different kind of input. `cls(...)` calls the class, exactly like `Student(...)`, and runs `__init__`:

```python
class Student:
    def __init__(self, name, grade_level, city):
        self.name = name
        self.grade_level = grade_level
        self.city = city

    @classmethod
    def from_string(cls, text):
        """Create a student from text like 'Aziza,9,Tashkent'."""
        name, grade, city = text.split(",")
        return cls(name.strip(), int(grade), city.strip())

    def describe(self):
        return f"{self.name} (grade {self.grade_level}, {self.city})"

print(Student("Farrukh", 10, "Bukhara").describe())
print(Student.from_string("Aziza, 9, Samarkand").describe())
```

```text
Farrukh (grade 10, Bukhara)
Aziza (grade 9, Samarkand)
```

The regular constructor stays simple, while `from_string()` parses one input format (`date.fromisoformat()` works the same way). Using `cls` rather than the class name means a subclass gets a working `from_string()` (see *Inheritance and super()*). Class methods are also the place for validated **class-wide settings**: `cls.interest_rate = rate` assigns on the class, so shadowing can't happen.

## Static methods: `@staticmethod`

A **static method** receives neither the instance nor the class. It's an ordinary function that lives inside the class because it's closely related to it:

```python
class TemperatureSensor:
    def __init__(self):
        self.readings = []

    @staticmethod
    def is_valid(celsius):
        return -60 <= celsius <= 60

    def record(self, celsius):
        if not self.is_valid(celsius):
            raise ValueError(f"Sensor error: {celsius} C")
        self.readings.append(celsius)

print(TemperatureSensor.is_valid(150))     # usable without any sensor
sensor = TemperatureSensor()
sensor.record(31.5)
print(sensor.readings)
```

```text
False
[31.5]
```

Static methods are only a matter of organization: `is_valid()` could just as well be a module-level function. Put a helper in the class when mainly the class uses it.

## Choosing the right kind of method

| Kind | Decorator | First parameter | Typical uses |
|---|---|---|---|
| instance method | none | `self` (the object) | almost everything: `deposit()`, `describe()` |
| class method | `@classmethod` | `cls` (the class) | alternative constructors, class-wide settings |
| static method | `@staticmethod` | none | validation and conversion helpers |

Outside the class, call class and static methods through the class name (`TemperatureSensor.is_valid(150)`). Inside its methods, `self.is_valid(celsius)` is just as normal, and lets a subclass replace the helper.

## Try it

Create more students with `from_string()`, then add a `from_dict()` class method and print the counter.

<ClientOnly><PythonPlayground :code='"class Student:\n    count = 0\n\n    def __init__(self, name, city):\n        self.name = name\n        self.city = city\n        Student.count += 1\n\n    @classmethod\n    def from_string(cls, text):\n        name, city = text.split(\",\")\n        return cls(name.strip(), city.strip())\n\nstudents = [Student.from_string(\"Aziza, Samarkand\"), Student.from_string(\"Bekzod, Tashkent\")]\nfor s in students:\n    print(s.name, s.city)\nprint(\"Created:\", Student.count)"' /></ClientOnly>

## Common mistakes

### 1. Updating a class counter through `self`

```python
class Student:
    count = 0

    def __init__(self, name):
        self.name = name
        self.count += 1               # Bad: creates self.count, the class value stays 0

a = Student("Aziza")
b = Student("Bekzod")
print(Student.count, a.count, b.count)
```

```text
0 1 1
```

`self.count += 1` reads the class value, then writes an **instance** attribute. **Fix:** `Student.count += 1`.

### 2. A list as a class attribute

```python
class ShoppingCart:
    items = []                        # Bad: one list for every cart

    def add(self, item):
        self.items.append(item)       # no assignment, so the shared list changes

aziza_cart = ShoppingCart()
bekzod_cart = ShoppingCart()
aziza_cart.add("tea")
bekzod_cart.add("bread")
print(aziza_cart.items)
```

```text
['tea', 'bread']
```

`append()` changed the one shared list. **Fix:** `self.items = []` in `__init__`.

### 3. Forgetting the `@classmethod` decorator

```py
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    def from_string(cls, text):          # missing @classmethod
        name, grade = text.split(",")
        return cls(name, int(grade))

s = Student.from_string("Aziza,9")
```

```text
TypeError: Student.from_string() missing 1 required positional argument: 'text'
```

Without the decorator, Python passed `"Aziza,9"` as `cls` and found nothing for `text`. **Fix:** add `@classmethod` above `def`.

### 4. Using `self` inside a static method

```py
class TemperatureSensor:
    def __init__(self, location):
        self.location = location

    @staticmethod
    def label(celsius):
        return f"{self.location}: {celsius} C"

sensor = TemperatureSensor("Tashkent")
print(sensor.label(30))
```

```text
NameError: name 'self' is not defined
```

A static method doesn't receive the object. If it needs instance data, make it a regular method.

## Practice

### 1. Shared tax rate <Difficulty level="1" />

Write a `Product` class with a class attribute `TAX_RATE = 0.12`, instance attributes `name` and `price`, and a method `price_with_tax()` that returns a rounded whole number. For a `Notebook` costing 15,000, print `Notebook 16800`, change the rate to `0.15` through the class, and print again.

::: details Solution
```python
class Product:
    TAX_RATE = 0.12

    def __init__(self, name, price):
        self.name = name
        self.price = price

    def price_with_tax(self):
        return round(self.price * (1 + self.TAX_RATE))

notebook = Product("Notebook", 15000)
print(notebook.name, notebook.price_with_tax())
Product.TAX_RATE = 0.15
print(notebook.name, notebook.price_with_tax())
```

```text
Notebook 16800
Notebook 17250
```
:::

### 2. Taxi IDs <Difficulty level="1" />

Write a `Taxi` class that gives each new taxi an ID like `"TX-1"`, `"TX-2"`, ... and counts how many taxis exist. Create taxis for Farrukh, Aziza, and Bekzod, print each ID and driver (`TX-1 Farrukh`), and finally `Taxis: 3`.

::: details Solution
```python
class Taxi:
    total = 0

    def __init__(self, driver):
        Taxi.total += 1
        self.taxi_id = f"TX-{Taxi.total}"
        self.driver = driver

fleet = [Taxi("Farrukh"), Taxi("Aziza"), Taxi("Bekzod")]
for taxi in fleet:
    print(taxi.taxi_id, taxi.driver)
print("Taxis:", Taxi.total)
```

```text
TX-1 Farrukh
TX-2 Aziza
TX-3 Bekzod
Taxis: 3
```
:::

### 3. Time from a string <Difficulty level="2" />

Write a `ClockTime` class (`hours`, `minutes`) with a static `is_valid(hours, minutes)`, an `__init__` that raises `ValueError(f"Invalid time: {hours}:{minutes}")`, a class method `from_string("14:30")`, and `minutes_until(other)`. For a train from `"07:28"` to `"09:38"`, print `The trip takes 2 h 10 min`. Then try `ClockTime.from_string("25:10")` and print `Error:` with the message.

::: details Solution
```python
class ClockTime:
    def __init__(self, hours, minutes):
        if not self.is_valid(hours, minutes):
            raise ValueError(f"Invalid time: {hours}:{minutes}")
        self.hours = hours
        self.minutes = minutes

    @staticmethod
    def is_valid(hours, minutes):
        return 0 <= hours < 24 and 0 <= minutes < 60

    @classmethod
    def from_string(cls, text):
        hours, minutes = text.split(":")
        return cls(int(hours), int(minutes))

    def minutes_until(self, other):
        return (other.hours - self.hours) * 60 + other.minutes - self.minutes

departure = ClockTime.from_string("07:28")
arrival = ClockTime.from_string("09:38")
trip = departure.minutes_until(arrival)
print(f"The trip takes {trip // 60} h {trip % 60} min")

try:
    ClockTime.from_string("25:10")
except ValueError as error:
    print("Error:", error)
```

```text
The trip takes 2 h 10 min
Error: Invalid time: 25:10
```
:::

### 4. Design a class: employees <Difficulty level="2" />

Design an `Employee` class, deciding which kind of attribute or method each part should be:

> Employees have a name, a position, and a monthly salary. Everyone gets the same yearly raise percentage (currently 8%), which can be changed only to 0-30. Employees are created from CSV lines, and `apply_raise()` raises one salary.

It must work with this driver code and print exactly this output:

```py
dilnoza = Employee.from_csv_line("Dilnoza Rahimova,Designer,9500000")
Employee.set_raise_percent(10)
dilnoza.apply_raise()
print(dilnoza.name, dilnoza.position, dilnoza.salary)
try:
    Employee.set_raise_percent(50)
except ValueError as error:
    print("Error:", error)
```

```text
Dilnoza Rahimova Designer 10450000
Error: Raise must be between 0 and 30 percent
```

::: details Solution
```python
class Employee:
    raise_percent = 8

    def __init__(self, name, position, salary):
        self.name = name
        self.position = position
        self.salary = salary

    @staticmethod
    def is_valid_percent(percent):
        return 0 <= percent <= 30

    @classmethod
    def set_raise_percent(cls, percent):
        if not cls.is_valid_percent(percent):
            raise ValueError("Raise must be between 0 and 30 percent")
        cls.raise_percent = percent

    @classmethod
    def from_csv_line(cls, line):
        name, position, salary = line.split(",")
        return cls(name, position, int(salary))

    def apply_raise(self):
        self.salary = round(self.salary * (100 + self.raise_percent) / 100)

dilnoza = Employee.from_csv_line("Dilnoza Rahimova,Designer,9500000")
Employee.set_raise_percent(10)
dilnoza.apply_raise()
print(dilnoza.name, dilnoza.position, dilnoza.salary)
try:
    Employee.set_raise_percent(50)
except ValueError as error:
    print("Error:", error)
```
:::

### 5. Currency exchange desk <Difficulty level="3" />

Write a `Money` class (`amount`, `currency`) with a class attribute `RATES = {"som": 1, "usd": 12600, "eur": 13700}` (rates to som), an `__init__` that raises `ValueError(f"Unknown currency: {currency}")`, a class method `from_string("250 usd")`, `to(currency)` returning a **new** `Money` rounded to 2 decimals, and `describe()` returning `250.00 USD`. Print `250.00 USD = 229.93 EUR`, then try `"10 gbp"` and print `Error:` with the message.

::: details Solution
```python
class Money:
    RATES = {"som": 1, "usd": 12600, "eur": 13700}

    def __init__(self, amount, currency):
        currency = currency.lower()
        if currency not in self.RATES:
            raise ValueError(f"Unknown currency: {currency}")
        self.amount = amount
        self.currency = currency

    @classmethod
    def from_string(cls, text):
        amount, currency = text.split()
        return cls(float(amount), currency)

    def to(self, currency):
        in_som = self.amount * self.RATES[self.currency]
        return type(self)(round(in_som / self.RATES[currency.lower()], 2), currency)

    def describe(self):
        return f"{self.amount:,.2f} {self.currency.upper()}"

cash = Money.from_string("250 usd")
print(cash.describe(), "=", cash.to("eur").describe())

try:
    Money.from_string("10 gbp")
except ValueError as error:
    print("Error:", error)
```

```text
250.00 USD = 229.93 EUR
Error: Unknown currency: gbp
```

An instance method has no `cls`, so `to()` uses `type(self)`, the object's own class, rather than hard-coding `Money`.
:::

## Recap

- **Class attributes** live in the class body and are shared by all instances; **instance attributes** belong to one object.
- Python looks up an attribute on the object first, then on the class. Assigning through an instance **shadows** the class attribute, so change it through the class name or `cls`.
- A mutable class attribute is shared by everyone. Create per-object lists in `__init__`.
- Most methods are regular instance methods; use the other two only when needed.
- `@classmethod` methods receive `cls`: use them for **alternative constructors** and class-wide settings. `@staticmethod` methods receive nothing automatically.

## Further reading

- [Python Tutorial - Class and Instance Variables](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables)
- [Built-in functions - classmethod()](https://docs.python.org/3/library/functions.html#classmethod)
- [Built-in functions - staticmethod()](https://docs.python.org/3/library/functions.html#staticmethod)
