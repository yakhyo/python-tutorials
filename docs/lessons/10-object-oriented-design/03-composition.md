---
title: Composition vs. Inheritance
description: "Build objects from smaller parts: has-a relationships, delegation, refactoring a fragile inheritance into composition, simple dependency injection, and a practical guide for choosing between composition and inheritance."
---

# Composition vs. Inheritance

![Illustration: Composition vs. Inheritance](/images/topics-webp/composition.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- The difference between **has-a** (composition) and **is-a** (inheritance)
- How to build objects out of other objects, and **delegate** calls to them
- Why "favor composition over inheritance" is common advice
- How to pass parts into a class (**dependency injection**) to make it flexible and testable
:::

## Why it matters

A car is not an engine, but it **has** one. Most objects in real programs are built from other objects, like real things from parts. Inheritance is the tightest possible link between classes: the child gets **every** parent method, forever. Composition is looser and more flexible, and choosing between them is a core design skill.

## Has-a vs. is-a

"A manager **is an** employee" calls for inheritance: `class Manager(Employee):`. "A car **has an** engine" calls for **composition**: the car stores the engine in an attribute, `self.engine = engine`, and uses it to do its work.

## Worked example: a car with a swappable engine

```python
class Engine:
    def __init__(self, horsepower, fuel="petrol"):
        self.horsepower = horsepower
        self.fuel = fuel

    def describe(self):
        return f"{self.horsepower} hp, {self.fuel}"


class ElectricMotor:
    def __init__(self, kw):
        self.kw = kw

    def describe(self):
        return f"{self.kw} kW, electric"


class Car:
    def __init__(self, model, engine):
        self.model = model
        self.engine = engine          # the car HAS an engine

    def spec(self):
        return f"{self.model}: {self.engine.describe()}"


cars = [Car("Cobalt", Engine(106, "methane")), Car("Spark EV", ElectricMotor(105))]
for car in cars:
    print(car.spec())
```

```text
Cobalt: 106 hp, methane
Spark EV: 105 kW, electric
```

Each class has one job. Inheritance would need `PetrolCar`, `MethaneCar`, `ElectricCar`... With composition, the **same** `Car` works with any part that has `describe()`: duck typing inside composition.

## Worked example: an order with line items

An order is made of line items, and each line item is a product and a quantity:

```python
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price


class LineItem:
    def __init__(self, product, quantity):
        self.product = product
        self.quantity = quantity

    @property
    def subtotal(self):
        return self.product.price * self.quantity


class Order:
    def __init__(self, customer):
        self.customer = customer
        self.items = []

    def add(self, product, quantity=1):
        self.items.append(LineItem(product, quantity))

    @property
    def total(self):
        return sum(item.subtotal for item in self.items)


order = Order("Bekzod")
order.add(Product("Samsa", 8_000), 6)
order.add(Product("Lagman", 38_000), 2)
print(f"Total for {order.customer}: {order.total:,} som")
```

```text
Total for Bekzod: 124,000 som
```

`Order.total` **asks** each item for its `subtotal` instead of multiplying prices itself, which keeps each class simple. A library that **has** books and members works the same way; you will build one in *Project: Library Management System*.

## Before and after: a stack that inherits from list

A **stack** is a pile of plates: you add to the top (`push`) and take from the top (`pop`). Here is a tempting shortcut:

```python
class Stack(list):                    # "a stack is a list"?
    def push(self, item):
        self.append(item)


plates = Stack()
plates.push("plate 1")
plates.push("plate 2")
plates.insert(0, "sneaky plate")      # every list method came along
print(plates)
```

```text
['sneaky plate', 'plate 1', 'plate 2']
```

The class inherited more than 40 list methods, and any of them can break the stack rule: not everything you can do with a list makes sense for a stack. After refactoring, the stack **delegates** to a hidden list, forwarding only the operations it wants:

```python
class Stack:
    def __init__(self):
        self._items = []                  # the part

    def push(self, item):
        self._items.append(item)          # delegate to the list

    def pop(self):
        return self._items.pop()

    def __len__(self):
        return len(self._items)           # delegate


plates = Stack()
for n in range(1, 4):
    plates.push(f"plate {n}")
print(plates.pop(), len(plates), hasattr(plates, "insert"))
```

```text
plate 3 2 False
```

Now **you** control the interface, and could replace the list later without changing any caller. The underscore in `_items` marks an internal detail.

## Dependency injection: passing parts in

The `Car` received its engine from **outside**. That is **dependency injection**: a class receives its parts instead of creating them:

```python
class SmsNotifier:
    def notify(self, customer, text):
        print(f"[SMS to {customer}] {text}")


class FakeNotifier:
    """For testing: remembers messages instead of sending them."""
    def __init__(self):
        self.sent = []

    def notify(self, customer, text):
        self.sent.append((customer, text))


class Shop:
    def __init__(self, notifier=None):
        self.notifier = notifier if notifier is not None else SmsNotifier()
        self.orders = []

    def place_order(self, customer, total):
        self.orders.append((customer, total))
        self.notifier.notify(customer, f"Order #{len(self.orders)} received: {total:,} som")


Shop().place_order("Aziza", 145_000)

fake = FakeNotifier()
test_shop = Shop(fake)
test_shop.place_order("Dilnoza", 10_000)
test_shop.place_order("Dilnoza", 20_000)
assert fake.sent[1] == ("Dilnoza", "Order #2 received: 20,000 som")
print("Test passed:", len(fake.sent), "messages recorded, none sent")
```

```text
[SMS to Aziza] Order #1 received: 145,000 som
Test passed: 2 messages recorded, none sent
```

The same `Shop` can send SMS, email, or nothing at all in tests (Module 11). The default keeps simple uses simple. Write it with `is not None`, not `notifier or SmsNotifier()`: `or` would silently replace an injected fake that happens to be falsy, for example one whose `__len__` returns 0.

## Why "favor composition over inheritance"

Inheritance is a tight link: the child gets every parent method, and a change in the parent can break it. Composition is loose: you choose what to expose, and you can swap or combine parts, even at runtime. "Favor" does not mean "never inherit". Inherit only when "every X is a Y" sounds right, **every** method of Y makes sense for X, and you will not need to swap behaviors. Otherwise, compose.

![Diagram: choosing between composition and inheritance](/images/companions-webp/composition-guide.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

## Try it

Give the `Robot` class a different `Battery` or add a `Speaker` part with a `say()` method, and delegate to it from the robot.

<ClientOnly><PythonPlayground :code='"class Battery:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.charge = capacity\n\n    def use(self, amount):\n        if amount > self.charge:\n            return False\n        self.charge -= amount\n        return True\n\n\nclass Wheels:\n    def roll(self, meters):\n        return f\"rolled {meters} m\"\n\n\nclass Robot:\n    def __init__(self, name, battery, wheels):\n        self.name = name\n        self.battery = battery\n        self.wheels = wheels\n\n    def move(self, meters):\n        if not self.battery.use(meters // 10):\n            return f\"{self.name}: battery too low\"\n        return f\"{self.name} {self.wheels.roll(meters)}, charge {self.battery.charge}\"\n\n\nbot = Robot(\"Robo-1\", Battery(50), Wheels())\nfor distance in [200, 150, 300]:\n    print(bot.move(distance))"' /></ClientOnly>

## Common mistakes

### 1. Inheriting to get a feature

```python
class Logger:
    def clear_log_file(self):
        print("log file deleted")

class Order(Logger):             # Bad: an order is not a logger
    pass

order = Order()
print(isinstance(order, Logger))
order.clear_log_file()
```

```text
True
log file deleted
```

An order now "is a" logger and can delete the log file. **Fix:** give it a part: `self.logger = Logger()`.

### 2. Reaching deep into parts

```py
class LineItem:
    def __init__(self, product, quantity):
        self.product_name = product.name     # was self.product
        self.unit_price = product.price
        self.quantity = quantity

# Bad: the caller relied on the old internal structure
print(order.items[0].product.price * order.items[0].quantity)
```

```text
AttributeError: 'LineItem' object has no attribute 'product'
```

Every caller that reached inside breaks. **Fix:** ask the object: `order.items[0].subtotal`.

### 3. Forgetting the part does not exist yet

```py
class Car:
    def __init__(self, model, engine=None):
        self.model = model
        self.engine = engine

    def start(self):
        return self.engine.start()

Car("Nexia").start()
```

```text
AttributeError: 'NoneType' object has no attribute 'start'
```

**Fix:** require the part in `__init__`, or check for `None` before delegating.

## Practice

### 1. Computer parts <Difficulty level="1" />

Create `Cpu` (cores) and `Memory` (gb) classes, and a `Computer` class that **has** one of each. Add a `spec()` method to `Computer` that returns a string like `"Office PC: 4 cores, 8 GB RAM"`.

::: details Solution
```python
class Cpu:
    def __init__(self, cores):
        self.cores = cores


class Memory:
    def __init__(self, gb):
        self.gb = gb


class Computer:
    def __init__(self, name, cpu, memory):
        self.name = name
        self.cpu = cpu
        self.memory = memory

    def spec(self):
        return f"{self.name}: {self.cpu.cores} cores, {self.memory.gb} GB RAM"


print(Computer("Office PC", Cpu(4), Memory(8)).spec())
```

```text
Office PC: 4 cores, 8 GB RAM
```
:::

### 2. Shopping cart delegation <Difficulty level="1" />

Write a `Cart` class that stores products in a private dictionary `_items` (name -> quantity). Provide `add(name, qty=1)`, `__len__` (number of different products), and `__contains__`, delegating to the dictionary. Add samsa (3), tea, and samsa again, then print the length and whether samsa and plov are in the cart.

::: details Solution
```python
class Cart:
    def __init__(self):
        self._items = {}

    def add(self, name, qty=1):
        self._items[name] = self._items.get(name, 0) + qty

    def __len__(self):
        return len(self._items)

    def __contains__(self, name):
        return name in self._items


cart = Cart()
cart.add("samsa", 3)
cart.add("tea")
cart.add("samsa")
print(len(cart), "samsa" in cart, "plov" in cart)
```

```text
2 True False
```
:::

### 3. Queue refactor <Difficulty level="2" />

A bank queue was written as `class Queue(list)`. Rewrite it with composition, using a `collections.deque` part, so that only `join(person)`, `next()`, and `__len__` exist. `next()` serves people in the order they joined and raises `IndexError("nobody is waiting")` when the queue is empty. Test with Aziza, Bekzod, and Dilnoza.

::: details Solution
```python
from collections import deque


class Queue:
    def __init__(self):
        self._people = deque()

    def join(self, person):
        self._people.append(person)

    def next(self):
        if not self._people:
            raise IndexError("nobody is waiting")
        return self._people.popleft()

    def __len__(self):
        return len(self._people)


q = Queue()
for name in ["Aziza", "Bekzod", "Dilnoza"]:
    q.join(name)
print(q.next(), q.next(), len(q))
q.next()
try:
    q.next()
except IndexError as error:
    print("Error:", error)
```

```text
Aziza Bekzod 1
Error: nobody is waiting
```
:::

### 4. Design from a description: weather station <Difficulty level="2" />

A weather station in Samarkand **has** a thermometer (with `read()`) and a display (with `show(text)`). Its `report()` method shows text like `"Samarkand: 31.5 C"`. Design the station with dependency injection, then test it with a `FakeThermometer` that returns fixed values (31.5, then 29.0) and a `RecordingDisplay` that stores lines in a list. Check two reports with `assert` and print `Tests passed`.

::: details Solution
```python
class FakeThermometer:
    def __init__(self, values):
        self.values = list(values)

    def read(self):
        return self.values.pop(0)


class RecordingDisplay:
    def __init__(self):
        self.lines = []

    def show(self, text):
        self.lines.append(text)


class WeatherStation:
    def __init__(self, city, thermometer, display):
        self.city = city
        self.thermometer = thermometer
        self.display = display

    def report(self):
        self.display.show(f"{self.city}: {self.thermometer.read()} C")


display = RecordingDisplay()
station = WeatherStation("Samarkand", FakeThermometer([31.5, 29.0]), display)
station.report()
station.report()
assert display.lines == ["Samarkand: 31.5 C", "Samarkand: 29.0 C"]
print("Tests passed")
```

```text
Tests passed
```

The station never creates its own parts, so real hardware can replace the fakes.
:::

### 5. Pizza with toppings <Difficulty level="3" />

A pizza has a size (`"S"`, `"M"`, `"L"`: 45,000 / 60,000 / 75,000 som) and any number of toppings with a name and price. Subclasses like `CheeseMushroomPizza` would explode in number, so compose: `Pizza` has a size and a list of `Topping` objects, `add_topping()` (returning `self`), a `price` property, and `__str__`. An invalid size raises `ValueError`. Print a large pizza with cheese (12,000) and mushroom (9,000), a plain medium, and the error for `"XL"`.

::: details Solution
```python
class Topping:
    def __init__(self, name, price):
        self.name = name
        self.price = price


class Pizza:
    BASE_PRICES = {"S": 45_000, "M": 60_000, "L": 75_000}

    def __init__(self, size):
        if size not in self.BASE_PRICES:
            raise ValueError(f"Unknown size {size!r}, choose S, M or L")
        self.size = size
        self.toppings = []

    def add_topping(self, topping):
        self.toppings.append(topping)
        return self

    @property
    def price(self):
        return self.BASE_PRICES[self.size] + sum(t.price for t in self.toppings)

    def __str__(self):
        names = ", ".join(t.name for t in self.toppings) or "plain"
        return f"{self.size} pizza ({names}): {self.price:,} som"


print(Pizza("L").add_topping(Topping("cheese", 12_000)).add_topping(Topping("mushroom", 9_000)))
print(Pizza("M"))
try:
    Pizza("XL")
except ValueError as error:
    print("Error:", error)
```

```text
L pizza (cheese, mushroom): 96,000 som
M pizza (plain): 60,000 som
Error: Unknown size 'XL', choose S, M or L
```
:::

## Recap

- **Composition**: an object holds other objects as attributes. A car **has** an engine.
- Inherit only for true **is-a** relationships where every parent method makes sense for the child.
- **Delegation**: forward work to a part and expose only what you choose. Wrap a `list`; do not inherit from it.
- **Dependency injection**: pass parts into `__init__` so you can swap them and use fakes in tests.
- Ask objects for answers (`item.subtotal`) instead of reaching into their structure.

## Further reading

- [Python Tutorial: Classes](https://docs.python.org/3/tutorial/classes.html)
- [`collections.deque`](https://docs.python.org/3/library/collections.html#collections.deque)
- [`collections.abc`: abstract base classes for containers](https://docs.python.org/3/library/collections.abc.html)
