---
title: The Python Data Model
description: "Look under the hood of Python objects: types and __dict__, attribute hooks like __getattr__ and __setattr__, callable objects, __slots__, descriptors behind property, and __init_subclass__."
---

# The Python Data Model

![Illustration: The Python Data Model](/images/topics-webp/python-data-model.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- Why **everything is an object**: `type()`, `__class__`, and `__dict__`
- How `__getattr__`, `__getattribute__`, `__setattr__`, and `__delattr__` hook into attribute access
- How `__call__` makes **callable objects** and `__slots__` removes the per-object dictionary
- How **descriptors** (`__get__`/`__set__`) power `property`
- How `__init_subclass__` registers subclasses, plus `__class_getitem__` and metaclasses in brief
:::

## Why it matters

*Representing and Comparing Objects* and *Operators and Containers* taught your classes to print, compare, add, and loop. The **data model** goes deeper: the rules for how Python reads and writes attributes, calls objects, and creates classes. Frameworks use these hooks to validate fields or register plugins the moment you define a class; once you know them, that "magic" is ordinary code.

## Everything is an object

Numbers, functions, and classes are all objects with a type; a class's type is **`type`**. An instance keeps its attributes in a dictionary, **`__dict__`**:

```python
class City:
    country = "Uzbekistan"

    def __init__(self, name, population):
        self.name = name
        self.population = population

tashkent = City("Tashkent", 3_000_000)

print(type(tashkent), tashkent.__class__ is City)
print(type(42), type(len), type(City))
print(tashkent.__dict__)
print("country" in tashkent.__dict__, tashkent.country)
```

```text
<class '__main__.City'> True
<class 'int'> <class 'builtin_function_or_method'> <class 'type'>
{'name': 'Tashkent', 'population': 3000000}
False Uzbekistan
```

`country` is not in the instance dictionary, so Python looked in the class next (then in parent classes). The hooks below change steps of that lookup.

## Hooking attribute access

**`__getattr__`** is a **fallback**: Python calls it only when normal lookup fails. **`__getattribute__`** runs on **every** attribute access, even for methods:

```python
class Settings:
    def __init__(self):
        self.language = "uz"

    def __getattr__(self, name):              # only for missing attributes
        print(f"  __getattr__({name!r})")
        return f"<default {name}>"

class Logged:
    def __init__(self, city):
        self.city = city

    def __getattribute__(self, name):         # every attribute read
        print(f"  reading {name!r}")
        return super().__getattribute__(name)

settings = Settings()
print(settings.language)
print(settings.theme)
print(Logged("Bukhara").city)
```

```text
uz
  __getattr__('theme')
<default theme>
  reading 'city'
Bukhara
```

Inside `__getattribute__`, delegate to `super().__getattribute__(name)`; reading `self.something` there recurses forever. You rarely need it; `__getattr__` covers most wrappers.

**`__setattr__`** runs on every assignment, including those in `__init__`. Its partner **`__delattr__`** runs on every `del obj.attr` (you'll use it in Practice):

```python
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price                    # goes through __setattr__ too

    def __setattr__(self, name, value):
        if name == "price" and value < 0:
            raise ValueError(f"price cannot be negative: {value}")
        super().__setattr__(name, value)      # the real assignment

tea = Product("Tea", 15000)
tea.price = 18000
print(tea.__dict__)

try:
    tea.price = -5
except ValueError as error:
    print("ValueError:", error)
```

```text
{'name': 'Tea', 'price': 18000}
ValueError: price cannot be negative: -5
```

For one attribute, `@property` from *Properties and Encapsulation* is clearer. `__setattr__` shines when one rule covers **all** attributes, such as a read-only object.

## `__call__`: objects you can call

Define **`__call__`** and `obj(...)` works. A callable object is a function that **remembers state**, and you can pass it anywhere a function is expected:

```python
class MinLength:
    def __init__(self, minimum):
        self.minimum = minimum
        self.rejected = 0

    def __call__(self, text):
        ok = len(text) >= self.minimum
        if not ok:
            self.rejected += 1
        return ok

valid_name = MinLength(3)
names = ["Aziza", "Bo", "Jasur", "", "Dilnoza"]

print(list(filter(valid_name, names)))
print(valid_name("Li"), valid_name.rejected, callable(valid_name))
```

```text
['Aziza', 'Jasur', 'Dilnoza']
False 3 True
```

A closure from *Closures and Decorators* can do the same; a class reads better with more state or methods.

## `__slots__`: no per-object dictionary

Normally every instance has its own `__dict__`. **`__slots__`** lists the only allowed attributes, stored in fixed places without a dictionary, which saves memory across many small objects (*Memory and Performance* measures it):

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class SlotPoint:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y

print(hasattr(Point(1, 2), "__dict__"), hasattr(SlotPoint(1, 2), "__dict__"))
try:
    SlotPoint(1, 2).z = 3
except AttributeError as error:
    print("AttributeError:", error)
```

```text
True False
AttributeError: 'SlotPoint' object has no attribute 'z' and no __dict__ for setting new attributes
```

A typo like `point.zz = 3` now fails loudly.

## How `property` works: descriptors

A **descriptor** is an object stored as a **class attribute** that has `__get__` and/or `__set__`. Reading or assigning that attribute on an instance calls those methods. `property` is a built-in descriptor; here is a reusable one:

```python
class Positive:
    def __set_name__(self, owner, name):      # gets "quantity" or "price"
        self.name = "_" + name

    def __get__(self, obj, objtype=None):
        if obj is None:                       # accessed on the class itself
            return self
        return getattr(obj, self.name)

    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError(f"{self.name[1:]} must be positive, got {value}")
        setattr(obj, self.name, value)

class Order:
    quantity = Positive()
    price = Positive()

    def __init__(self, item, quantity, price):
        self.item = item
        self.quantity = quantity              # calls Positive.__set__
        self.price = price

order = Order("samsa", 4, 8000)
print(order.quantity * order.price, order.__dict__)

try:
    order.price = 0
except ValueError as error:
    print("ValueError:", error)

print(hasattr(property, "__get__"), hasattr(property, "__set__"))
```

```text
32000 {'item': 'samsa', '_quantity': 4, '_price': 8000}
ValueError: price must be positive, got 0
True True
```

One `Positive` class replaces two copy-pasted properties. Functions are descriptors too, which is how methods receive `self`.

## Class-level hooks

A parent's **`__init_subclass__`** runs whenever a **subclass is defined**, with the new class as `cls`, to register or check it. Keywords in the `class` line are passed to it:

```python
class Exporter:
    registry = {}

    def __init_subclass__(cls, fmt, **kwargs):
        super().__init_subclass__(**kwargs)
        if not hasattr(cls, "export"):
            raise TypeError(f"{cls.__name__} must define export()")
        Exporter.registry[fmt] = cls

class CsvExporter(Exporter, fmt="csv"):
    def export(self, cities):
        return ",".join(cities)

print(Exporter.registry["csv"]().export(["Tashkent", "Bukhara"]))

try:
    class XmlExporter(Exporter, fmt="xml"):
        pass
except TypeError as error:
    print("TypeError:", error)
```

```text
Tashkent,Bukhara
TypeError: XmlExporter must define export()
```

**`__class_getitem__`** is why `list[int]` from *Type Hints* works: `list[int]` calls `list.__class_getitem__(int)`, which returns a `types.GenericAlias` for type checkers. You rarely write it yourself; `class Box[T]:` provides it.

A **metaclass** is the class of a class: `type` is the default, and a custom one changes how classes are built. `__init_subclass__` and class decorators cover almost every need more simply; read the [metaclasses section](https://docs.python.org/3/reference/datamodel.html#metaclasses) when you meet one.

## Try it

Make `MinLength` also reject names longer than 8 letters, and count those too.

<ClientOnly><PythonPlayground :code='"class MinLength:\n    def __init__(self, minimum):\n        self.minimum = minimum\n        self.rejected = 0\n\n    def __call__(self, text):\n        ok = len(text) >= self.minimum\n        if not ok:\n            self.rejected += 1\n        return ok\n\ncheck = MinLength(3)\nnames = [\"Aziza\", \"Bo\", \"Muhammadali\", \"Jasur\"]\nprint(list(filter(check, names)), check.rejected)"' /></ClientOnly>

## Common mistakes

### 1. Infinite recursion in `__setattr__`

```py
class Account:
    def __setattr__(self, name, value):
        if name == "owner":
            value = value.title()
        setattr(self, name, value)    # Bad: calls __setattr__ again

Account().owner = "aziza"
```

```text
RecursionError: maximum recursion depth exceeded
```

`setattr(self, ...)` or `self.x = ...` inside `__setattr__` calls the same hook again. **Fix:** use `super().__setattr__(name, value)` or `super().__getattribute__(name)`.

### 2. `__getattr__` that silently hides typos

```python
class User:
    def __init__(self, email):
        self.email = email

    def __getattr__(self, name):
        return None                   # Bad: every missing name "exists"

user = User("bobur@example.uz")
print(user.emial)
```

```text
None
```

The typo gives `None`, not an error. **Fix:** handle only the names you expect and `raise AttributeError(name)` for the rest.

### 3. A subclass without `__slots__`

```python
class Point:
    __slots__ = ("x", "y")

class ColorPoint(Point):
    pass                              # no __slots__ here

p = ColorPoint()
p.colour = "red"                      # typo accepted
print(hasattr(p, "__dict__"), p.colour)
```

```text
True red
```

The subclass gets a `__dict__` again. **Fix:** give each subclass its own `__slots__` with only its new names, e.g. `__slots__ = ("color",)`.

### 4. `__eq__` without `__hash__`

```py
class Coordinate:
    def __init__(self, lat, lon):
        self.lat, self.lon = lat, lon

    def __eq__(self, other):
        return (self.lat, self.lon) == (other.lat, other.lon)

visits = {Coordinate(41.31, 69.28): "Tashkent"}
```

```text
TypeError: cannot use 'Coordinate' as a dict key (unhashable type: 'Coordinate')
```

`__eq__` removes the default `__hash__`. **Fix:** add `__hash__` returning `hash((self.lat, self.lon))`, as in *Representing and Comparing Objects*.

## Practice

### 1. A multiplier <Difficulty level="1" />

Write a class `Multiplier(factor)` whose instances, called with a number, return it multiplied by `factor`. Print `double(21)` and `triple(5)`, then `list(map(double, [1, 2, 3]))`.

::: details Solution
```python
class Multiplier:
    def __init__(self, factor):
        self.factor = factor

    def __call__(self, number):
        return number * self.factor

double = Multiplier(2)
triple = Multiplier(3)
print(double(21), triple(5))
print(list(map(double, [1, 2, 3])))
```

```text
42 15
[2, 4, 6]
```
:::

### 2. Config with dot access <Difficulty level="1" />

Write a `Config(data)` class where `config.city` returns `data["city"]`, using `__getattr__`. A missing key raises `AttributeError` with the message `no setting 'port'`. For `{"city": "Samarkand", "debug": False}`, print `city` and `debug`, then try `config.port`.

::: details Solution
```python
class Config:
    def __init__(self, data):
        self._data = dict(data)

    def __getattr__(self, name):
        try:
            return self._data[name]
        except KeyError:
            raise AttributeError(f"no setting {name!r}") from None

config = Config({"city": "Samarkand", "debug": False})
print(config.city, config.debug)
try:
    config.port
except AttributeError as error:
    print("AttributeError:", error)
```

```text
Samarkand False
AttributeError: no setting 'port'
```
:::

### 3. A read-only point <Difficulty level="2" />

Write `FrozenPoint(x, y)` whose `__setattr__` and `__delattr__` raise `AttributeError("FrozenPoint is read-only")`. Print `p.x, p.y`, try `p.x = 10` and `del p.y` (print each error), then print `p.x, p.y` again.

::: details Solution
```python
class FrozenPoint:
    def __init__(self, x, y):
        object.__setattr__(self, "x", x)      # bypass our own __setattr__
        object.__setattr__(self, "y", y)

    def __setattr__(self, name, value):
        raise AttributeError("FrozenPoint is read-only")

    def __delattr__(self, name):
        raise AttributeError("FrozenPoint is read-only")

p = FrozenPoint(3, 4)
print(p.x, p.y)
try:
    p.x = 10
except AttributeError as error:
    print("set:", error)
try:
    del p.y
except AttributeError as error:
    print("delete:", error)
print(p.x, p.y)
```

```text
3 4
set: FrozenPoint is read-only
delete: FrozenPoint is read-only
3 4
```

:::

### 4. A range descriptor <Difficulty level="2" />

Write a descriptor `InRange(low, high)` that raises `ValueError` like `grade must be between 1 and 11, got 12`. Use it for `grade` (1-11) and `score` (0-100) in `Student(grade, score)`. Print a student's grade and score (9, 87), then try a grade of 12 and a score of 101.

::: details Solution
```python
class InRange:
    def __init__(self, low, high):
        self.low, self.high = low, high

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__[self.name]

    def __set__(self, obj, value):
        if not self.low <= value <= self.high:
            raise ValueError(f"{self.name} must be between {self.low} and {self.high}, got {value}")
        obj.__dict__[self.name] = value

class Student:
    grade = InRange(1, 11)
    score = InRange(0, 100)

    def __init__(self, grade, score):
        self.grade = grade
        self.score = score

dilnoza = Student(9, 87)
print(dilnoza.grade, dilnoza.score)
for field, value in [("grade", 12), ("score", 101)]:
    try:
        setattr(dilnoza, field, value)
    except ValueError as error:
        print("ValueError:", error)
```

```text
9 87
ValueError: grade must be between 1 and 11, got 12
ValueError: score must be between 0 and 100, got 101
```
:::

### 5. A command plugin registry <Difficulty level="3" />

Write a base class `Command` whose `__init_subclass__` registers each subclass in `Command.commands` by lower-case name minus `command` (`HelloCommand` is `hello`). Add `HelloCommand` and `AddCommand` with `run(args)`. Print the sorted names, then run `"hello Jasur"`, `"add 2 3 10"`, and `"sing Lazgi"` (print `unknown command: sing`).

::: details Solution
```python
class Command:
    commands = {}

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        name = cls.__name__.lower().removesuffix("command")
        Command.commands[name] = cls

class HelloCommand(Command):
    def run(self, args):
        return f"Salom, {args[0]}!"

class AddCommand(Command):
    def run(self, args):
        return sum(int(n) for n in args)

print(sorted(Command.commands))
for line in ["hello Jasur", "add 2 3 10", "sing Lazgi"]:
    name, *args = line.split()
    if name in Command.commands:
        print(Command.commands[name]().run(args))
    else:
        print(f"unknown command: {name}")
```

```text
['add', 'hello']
Salom, Jasur!
15
unknown command: sing
```

:::

## Recap

- Everything is an object; classes are instances of `type`, and instance attributes live in `__dict__`.
- `__getattr__` is a fallback; `__getattribute__` and `__setattr__` run on every access and must delegate to `super()`.
- `__call__` makes stateful callables; `__slots__` drops `__dict__`.
- A **descriptor** (`__get__`/`__set__`) controls a class attribute; `property` is one.
- `__init_subclass__` registers or checks subclasses; `__class_getitem__` powers `list[int]`; metaclasses are rarely needed.

## Further reading

- [Data model: customizing attribute access](https://docs.python.org/3/reference/datamodel.html#customizing-attribute-access)
- [Descriptor HowTo Guide](https://docs.python.org/3/howto/descriptor.html)
- [Data model: customizing class creation](https://docs.python.org/3/reference/datamodel.html#customizing-class-creation)
