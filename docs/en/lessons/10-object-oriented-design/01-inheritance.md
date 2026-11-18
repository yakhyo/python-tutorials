---
title: Inheritance and super()
description: "Build new classes from existing ones: is-a relationships, overriding and extending methods with super(), isinstance and issubclass, multilevel inheritance, the object base class, and a gentle look at the MRO and mixins."
---

# Inheritance and super()

![Illustration: Inheritance and super()](/images/topics-webp/inheritance.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- When an **is-a** relationship calls for inheritance
- How a derived class inherits, **overrides**, and **extends** methods
- How to call the parent's code with `super()`
- How `isinstance()` and `issubclass()` work with class families
- The `object` base class, the method resolution order (MRO), and mixins
:::

## Why it matters

Real programs have **families** of similar classes: employees and managers, accounts and savings accounts. Without inheritance you copy shared code into every class and fix every copy when a rule changes. Inheritance puts the shared part **once** in a base class, and only the differences in each derived class.

## The is-a test

Say the relationship out loud. A manager **is an** employee <Yes />. A car **is an** engine <No /> (a car **has** an engine, see *Composition vs. Inheritance*). If "every X is a Y" sounds right, and everything a Y can do makes sense for an X, inheritance fits.

## Base and derived classes

Put the parent class in parentheses after the new class name. If the child defines a method with the **same name** as the parent, its version wins. This is **overriding**:

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def yearly_bonus(self):
        return self.salary * 0.5


class Manager(Employee):             # Manager inherits from Employee
    def yearly_bonus(self):          # overrides the parent version
        return self.salary * 1.5

    def approve_leave(self, employee, days):
        return f"{self.name} approved {days} days of leave for {employee.name}"


staff = [Employee("Aziza", 7_000_000), Manager("Dilnoza", 12_000_000)]
for person in staff:
    print(f"{person.name}: {person.yearly_bonus():,.0f} som")
print(staff[1].approve_leave(staff[0], 5))
```

```text
Aziza: 3,500,000 som
Dilnoza: 18,000,000 som
Dilnoza approved 5 days of leave for Aziza
```

`Employee` is the **base class** (parent) and `Manager` the **derived class** (child). `Manager` has no `__init__`, yet it has `name` and `salary`: Python looks in `Manager` first, then in `Employee`. The child can also add methods a plain employee lacks. The same call, `yearly_bonus()`, gives a different result for each class: that is **polymorphism**, the next lesson.

::: info Python has no method overloading
In Java or C# two methods can share a name with different parameters. In Python the second `def` **replaces** the first:

```python
class Rectangle:
    def area(self):
        return 0

    def area(self, scale=1):         # replaces the first area()
        return 6 * scale


print(Rectangle().area(), Rectangle().area(2))
```

```text
6 12
```

Use default parameter values instead.
:::

## Extending with `super()`

To **add** to the parent's behavior instead of replacing it, call the parent's version with `super()`:

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def describe(self):
        return f"{self.name} earns {self.salary:,} som"


class Manager(Employee):
    def __init__(self, name, salary, team_size):
        super().__init__(name, salary)        # let Employee set name and salary
        self.team_size = team_size

    def describe(self):
        return f"{super().describe()} and manages {self.team_size} people"


print(Employee("Aziza", 7_000_000).describe())
print(Manager("Dilnoza", 12_000_000, 8).describe())
```

```text
Aziza earns 7,000,000 som
Dilnoza earns 12,000,000 som and manages 8 people
```

`super().__init__(name, salary)` runs `Employee.__init__` on the **same object**, so there is no `self` in the call. **Override** when the child needs different behavior; **extend** with `super()` when it needs the parent's behavior plus something extra, so later changes to the parent flow into the child.

## Worked example: a savings account

A savings account is an account that also earns interest and allows only a few withdrawals a month:

```python
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError(f"{self.owner} has only {self.balance:,} som")
        self.balance -= amount


class SavingsAccount(Account):
    def __init__(self, owner, balance=0, rate=0.14, max_withdrawals=3):
        super().__init__(owner, balance)
        self.rate = rate
        self.max_withdrawals = max_withdrawals
        self.withdrawals_this_month = 0

    def withdraw(self, amount):
        if self.withdrawals_this_month >= self.max_withdrawals:
            raise ValueError("Monthly withdrawal limit reached")
        super().withdraw(amount)            # the normal balance check
        self.withdrawals_this_month += 1

    def add_monthly_interest(self):
        interest = round(self.balance * self.rate / 12)
        self.deposit(interest)              # inherited method
        return interest


savings = SavingsAccount("Farrukh", 2_000_000, max_withdrawals=2)
print("Interest:", savings.add_monthly_interest())
for amount in [100_000, 50_000, 30_000]:
    try:
        savings.withdraw(amount)
        print(f"Withdrew {amount:,}")
    except ValueError as error:
        print("Refused:", error)
print(f"Balance: {savings.balance:,} som")
```

```text
Interest: 23333
Withdrew 100,000
Withdrew 50,000
Refused: Monthly withdrawal limit reached
Balance: 1,873,333 som
```

`SavingsAccount.withdraw` checks the limit, then **delegates** the balance check to the parent.

## `isinstance()` and `issubclass()`

`isinstance(obj, Class)` is `True` for that class **or any of its parents**:

```python
class Employee:
    pass

class Manager(Employee):
    pass

boss = Manager()
print(isinstance(boss, Employee), isinstance(Employee(), Manager))
print(issubclass(Manager, Employee))
print(type(boss) == Employee)
```

```text
True False
True
False
```

`type()` gives the exact class. `isinstance` respects the is-a relationship, which is almost always what you want.

## `object` and the method resolution order

A class with no parent inherits from `object`, which supplies default `__str__`, `__repr__`, and `__eq__`. Python searches classes in a fixed order, the **method resolution order** (MRO):

![Diagram: method resolution order in a class hierarchy](/images/companions-webp/inheritance-mro.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

```python
class Shape:
    def describe(self):
        return "Shape.describe"

class Rectangle(Shape):
    pass

class Square(Rectangle):
    pass

print([cls.__name__ for cls in Square.__mro__])
print(Square().describe())
```

```text
['Square', 'Rectangle', 'Shape', 'object']
Shape.describe
```

`Square` inherits from `Rectangle`, which inherits from `Shape`: **multilevel inheritance**. `super()` follows this order too: it means "the next class in the MRO", which with one parent is simply the parent.

### Mixins

A class can have several parents: `class C(A, B):`. Use this mainly for a **mixin**, a small class that adds one ability:

```python
import json


class JsonMixin:
    def to_json(self):
        return json.dumps(self.__dict__, ensure_ascii=False)


class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price


class JsonProduct(JsonMixin, Product):
    pass


print(JsonProduct("Green tea", 25000).to_json())
```

```text
{"name": "Green tea", "price": 25000}
```

`self.__dict__` holds an object's attributes, so the mixin works with any class. Keep mixins small and hierarchies **shallow** (one or two levels).

## Try it

Add a `Contractor` class that inherits from `Employee`, overrides `monthly_cost()` to add a 10% agency fee, and extends `describe()` with `super()`.

<ClientOnly><PythonPlayground :code='"class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def monthly_cost(self):\n        return self.salary\n\n    def describe(self):\n        return f\"{self.name}: {self.monthly_cost():,.0f} som per month\"\n\n\nclass Manager(Employee):\n    def __init__(self, name, salary, team_size):\n        super().__init__(name, salary)\n        self.team_size = team_size\n\n    def describe(self):\n        return super().describe() + f\" (team of {self.team_size})\"\n\n\nstaff = [Employee(\"Aziza\", 7000000), Manager(\"Dilnoza\", 12000000, 6)]\nfor person in staff:\n    print(person.describe())\n\nprint(\"Total:\", sum(p.monthly_cost() for p in staff))"' /></ClientOnly>

## Common mistakes

### 1. Forgetting `super().__init__()`

```py
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

class Manager(Employee):
    def __init__(self, name, salary, team_size):
        self.team_size = team_size        # parent __init__ never runs

print(Manager("Dilnoza", 12_000_000, 5).name)
```

```text
AttributeError: 'Manager' object has no attribute 'name'
```

**Fix:** call `super().__init__(name, salary)` first.

### 2. Passing `self` to `super()` methods

```py
class Shape:
    def __init__(self, name):
        self.name = name

class Circle(Shape):
    def __init__(self, radius):
        super().__init__(self, "Circle")    # self passed twice
        self.radius = radius

Circle(2)
```

```text
TypeError: Shape.__init__() takes 2 positional arguments but 3 were given
```

`super()` already binds `self`. **Fix:** `super().__init__("Circle")`.

### 3. Calling the parent by class name

`Parent.__init__(self, ...)` works until the hierarchy changes. Here `Employee` was inserted between `Person` and `Manager` later:

```py
class Person:
    def __init__(self, name):
        self.name = name

class Employee(Person):
    def __init__(self, name, salary):
        super().__init__(name)
        self.salary = salary

class Manager(Employee):
    def __init__(self, name, salary):
        Person.__init__(self, name)       # skips Employee.__init__
        self.team = []

print(Manager("Dilnoza", 12_000_000).salary)
```

```text
AttributeError: 'Manager' object has no attribute 'salary'
```

**Fix:** `super().__init__(name, salary)`, which follows the real MRO even when parents change.

## Practice

### 1. Student and graduate <Difficulty level="1" />

Create a `Student` class with `name` and `grades` (a list), and a method `average()`. Create `GraduateStudent(Student)` that adds a `thesis` attribute using `super().__init__()`. Print Aziza's average (grades 92, 88, 95) and thesis.

::: details Solution
```python
class Student:
    def __init__(self, name, grades):
        self.name = name
        self.grades = grades

    def average(self):
        return sum(self.grades) / len(self.grades)


class GraduateStudent(Student):
    def __init__(self, name, grades, thesis):
        super().__init__(name, grades)
        self.thesis = thesis


g = GraduateStudent("Aziza", [92, 88, 95], "Water use in the Fergana Valley")
print(f"{g.name}: {g.average():.1f}")
print(g.thesis)
```

```text
Aziza: 91.7
Water use in the Fergana Valley
```
:::

### 2. Discounted product <Difficulty level="1" />

`Product` has `name`, `price`, and `final_price()`. Create `DiscountedProduct` with an extra `percent` whose `final_price()` applies the discount to `super().final_price()`. Print prices for a 60,000 som cap and a 200,000 som jacket with 15% off.

::: details Solution
```python
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def final_price(self):
        return self.price


class DiscountedProduct(Product):
    def __init__(self, name, price, percent):
        super().__init__(name, price)
        self.percent = percent

    def final_price(self):
        return round(super().final_price() * (1 - self.percent / 100))


for item in [Product("Cap", 60_000), DiscountedProduct("Jacket", 200_000, 15)]:
    print(f"{item.name}: {item.final_price():,} som")
```

```text
Cap: 60,000 som
Jacket: 170,000 som
```
:::

### 3. Vehicle rental <Difficulty level="2" />

Write `Vehicle` with `daily_rate` and `rental_cost(days)`. Add `Truck(Vehicle)`, whose `rental_cost` extends the parent's with `super()` and adds 50,000 som per day. Print the 3-day cost of a 300,000 som vehicle and a 450,000 som truck.

::: details Solution
```python
class Vehicle:
    def __init__(self, daily_rate):
        self.daily_rate = daily_rate

    def rental_cost(self, days):
        return self.daily_rate * days


class Truck(Vehicle):
    def rental_cost(self, days):
        return super().rental_cost(days) + 50_000 * days


for v in [Vehicle(300_000), Truck(450_000)]:
    print(f"{type(v).__name__}: {v.rental_cost(3):,} som")
```

```text
Vehicle: 900,000 som
Truck: 1,500,000 som
```
:::

### 4. Design from a description: museum tickets <Difficulty level="2" />

A museum in Samarkand sells tickets. Every ticket has a visitor name and a base price of 40,000 som, and can print a receipt line. A **student ticket** costs half. A **guided ticket** costs 30,000 som more, and its receipt also shows the guide's name. Print receipts for Farrukh (regular), Aziza (student), and Bekzod (guided by Malika).

::: details Solution
```python
class Ticket:
    base_price = 40_000

    def __init__(self, visitor):
        self.visitor = visitor

    def price(self):
        return self.base_price

    def receipt(self):
        return f"{type(self).__name__:<13} {self.visitor:<8} {self.price():>7,} som"


class StudentTicket(Ticket):
    def price(self):
        return super().price() // 2


class GuidedTicket(Ticket):
    def __init__(self, visitor, guide):
        super().__init__(visitor)
        self.guide = guide

    def price(self):
        return super().price() + 30_000

    def receipt(self):
        return super().receipt() + f" (guide: {self.guide})"


tickets = [Ticket("Farrukh"), StudentTicket("Aziza"), GuidedTicket("Bekzod", "Malika")]
for t in tickets:
    print(t.receipt())
```

```text
Ticket        Farrukh   40,000 som
StudentTicket Aziza     20,000 som
GuidedTicket  Bekzod    70,000 som (guide: Malika)
```

`receipt()` is written once but calls `self.price()`, so each ticket prints its own price.
:::

### 5. Logged account with a mixin <Difficulty level="3" />

Write a `HistoryMixin` with `log(event)`, which appends to `self.history` (create the list with `hasattr` if needed). Write `Account` (owner, balance, `deposit`, `withdraw`) and `TrackedAccount(HistoryMixin, Account)` that extends both methods to log each operation. Starting from 100,000, deposit 50,000 and withdraw 30,000, then print the MRO names and the numbered history.

::: details Solution
```python
class HistoryMixin:
    def log(self, event):
        if not hasattr(self, "history"):
            self.history = []
        self.history.append(event)


class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        self.balance -= amount


class TrackedAccount(HistoryMixin, Account):
    def deposit(self, amount):
        super().deposit(amount)
        self.log(f"deposit {amount:,} -> {self.balance:,}")

    def withdraw(self, amount):
        super().withdraw(amount)
        self.log(f"withdraw {amount:,} -> {self.balance:,}")


acc = TrackedAccount("Dilnoza", 100_000)
acc.deposit(50_000)
acc.withdraw(30_000)
print([c.__name__ for c in TrackedAccount.__mro__])
for number, event in enumerate(acc.history, start=1):
    print(f"{number}. {event}")
```

```text
['TrackedAccount', 'HistoryMixin', 'Account', 'object']
1. deposit 50,000 -> 150,000
2. withdraw 30,000 -> 120,000
```

`HistoryMixin` has no `deposit`, so `super().deposit()` continues along the MRO to `Account`.
:::

## Recap

- Use inheritance for **is-a** relationships: `class Manager(Employee):`.
- **Override** a method by defining it again (there is no overloading). **Extend** it with `super().method(...)`.
- A child `__init__` should call `super().__init__(...)`, unless you really mean to replace the parent's setup.
- `isinstance()` respects inheritance. `type(x) == C` does not.
- Every class inherits from `object`. `Class.__mro__` shows the lookup order, and `super()` follows it.
- Keep hierarchies shallow and mixins small. Use attributes for has-a.

## Further reading

- [Python Tutorial: Inheritance](https://docs.python.org/3/tutorial/classes.html#inheritance)
- [Built-in function `super()`](https://docs.python.org/3/library/functions.html#super)
- [Built-in functions `isinstance()` and `issubclass()`](https://docs.python.org/3/library/functions.html#isinstance)
- [The Python 2.3 Method Resolution Order](https://docs.python.org/3/howto/mro.html)
