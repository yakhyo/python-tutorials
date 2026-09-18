---
title: Vorislik va super()
description: "Mavjud klasslardan yangi klasslar quring: is-a munosabatlari, super() bilan metodlarni qayta aniqlaş va kengaytiriş, isinstance va issubclass, köp darajali vorislik, object asosiy klassi hamda MRO va mixinlar bilan yengil tanişuv."
---

# Vorislik va super()

![Rasm: Vorislik va super()](/images/topics-webp-uzb/inheritance.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Qaçon **is-a** ("bu - bu") munosabati vorislikni talab qiladi
- Hosila klass metodlarni qanday meros oladi, **qayta aniqlaydi** (override) va **kengaytiradi**
- Ota klass kodini `super()` bilan qanday çaqiriş
- `isinstance()` va `issubclass()` klasslar oilasi bilan qanday işlaydi
- `object` asosiy klassi, metodlarni qidiriş tartibi (MRO) va mixinlar
:::

## Nega bu muhim

Haqiqiy dasturlarda öxşaş klasslarning **oilalari** bor: xodimlar va menejerlar, hisoblar va jamğarma hisoblari. Vorisliksiz umumiy kodni har bir klassga köçirasiz va qoida özgarganda har bir nusxani tuzatasiz. Vorislik (inheritance) umumiy qismni asosiy klassga **bir marta**, har bir hosila klassga esa faqat farqlarni joylaydi.

## is-a tekşiruvi

Munosabatni ovoz çiqarib ayting. Menejer - xodim <Yes />. Maşina - dvigatel <No /> (maşinada dvigatel **bor**, *Kompozitsiya yoki vorislik?* darsiga qarang). Agar "har bir X - bu Y" töğri eşitilsa va Y qila oladigan hamma narsa X uçun ham maʼnoli bölsa, vorislik mos keladi.

## Asosiy va hosila klasslar

Ota klassni yangi klass nomidan keyin qavsga yozing. Agar bola klass ota klassdagi bilan **bir xil nomli** metodni aniqlasa, uning versiyasi ğolib çiqadi. Bu **qayta aniqlaş** (overriding):

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def yearly_bonus(self):
        return self.salary * 0.5


class Manager(Employee):             # Manager Employee dan meros oladi
    def yearly_bonus(self):          # ota versiyasini qayta aniqlaydi
        return self.salary * 1.5

    def approve_leave(self, employee, days):
        return f"{self.name} {employee.name} uçun {days} kunlik taʼtilni tasdiqladi"


staff = [Employee("Aziza", 7_000_000), Manager("Dilnoza", 12_000_000)]
for person in staff:
    print(f"{person.name}: {person.yearly_bonus():,.0f} söm")
print(staff[1].approve_leave(staff[0], 5))
```

```text
Aziza: 3,500,000 söm
Dilnoza: 18,000,000 söm
Dilnoza Aziza uçun 5 kunlik taʼtilni tasdiqladi
```

`Employee` - **asosiy klass** (base class, ota), `Manager` esa **hosila klass** (derived class, bola). `Manager` da `__init__` yöq, lekin unda `name` va `salary` bor: Python avval `Manager` da, keyin `Employee` da qidiradi. Bola oddiy xodimda yöq metodlarni ham qöşa oladi. Bir xil çaqiriş - `yearly_bonus()` - har bir klass uçun boşqa natija beradi: bu **polimorfizm**, keyingi dars mavzusi.

::: info Pythonda metodlarni ortiqça yuklaş (overloading) yöq
Java yoki C# da ikki metod turli parametrlar bilan bir xil nomga ega bölişi mumkin. Pythonda ikkinçi `def` birinçisini **almaştiradi**:

```python
class Rectangle:
    def area(self):
        return 0

    def area(self, scale=1):         # birinçi area() ni almaştiradi
        return 6 * scale


print(Rectangle().area(), Rectangle().area(2))
```

```text
6 12
```

Uning örniga parametrlarning standart qiymatlaridan foydalaning.
:::

## `super()` bilan kengaytiriş

Ota klass xatti-harakatini almaştiriş örniga unga **qöşiş** uçun ota versiyasini `super()` bilan çaqiring:

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def describe(self):
        return f"{self.name} {self.salary:,} söm oladi"


class Manager(Employee):
    def __init__(self, name, salary, team_size):
        super().__init__(name, salary)        # name va salary ni Employee örnatsin
        self.team_size = team_size

    def describe(self):
        return f"{super().describe()} va {self.team_size} kişini boşqaradi"


print(Employee("Aziza", 7_000_000).describe())
print(Manager("Dilnoza", 12_000_000, 8).describe())
```

```text
Aziza 7,000,000 söm oladi
Dilnoza 12,000,000 söm oladi va 8 kişini boşqaradi
```

`super().__init__(name, salary)` `Employee.__init__` ni **xuddi şu obyekt** ustida işga tuşiradi, şuning uçun çaqirişda `self` yöq. Bolaga boşqaça xatti-harakat kerak bölsa, **qayta aniqlang**; ota xatti-harakati va qöşimça narsa kerak bölsa, `super()` bilan **kengaytiring**, şunda ota klassdagi keyingi özgarişlar bolaga ham ötadi.

## Batafsil misol: jamğarma hisobi

Jamğarma hisobi - foiz ham keltiradigan va oyiga faqat bir neçta marta pul yeçişga ruxsat beradigan hisob:

```python
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError(f"{self.owner} da faqat {self.balance:,} söm bor")
        self.balance -= amount


class SavingsAccount(Account):
    def __init__(self, owner, balance=0, rate=0.14, max_withdrawals=3):
        super().__init__(owner, balance)
        self.rate = rate
        self.max_withdrawals = max_withdrawals
        self.withdrawals_this_month = 0

    def withdraw(self, amount):
        if self.withdrawals_this_month >= self.max_withdrawals:
            raise ValueError("Oylik yeçiş limitiga yetildi")
        super().withdraw(amount)            # odatiy balans tekşiruvi
        self.withdrawals_this_month += 1

    def add_monthly_interest(self):
        interest = round(self.balance * self.rate / 12)
        self.deposit(interest)              # meros olingan metod
        return interest


savings = SavingsAccount("Farrux", 2_000_000, max_withdrawals=2)
print("Foiz:", savings.add_monthly_interest())
for amount in [100_000, 50_000, 30_000]:
    try:
        savings.withdraw(amount)
        print(f"{amount:,} yeçildi")
    except ValueError as error:
        print("Rad etildi:", error)
print(f"Balans: {savings.balance:,} söm")
```

```text
Foiz: 23333
100,000 yeçildi
50,000 yeçildi
Rad etildi: Oylik yeçiş limitiga yetildi
Balans: 1,873,333 söm
```

`SavingsAccount.withdraw` limitni tekşiradi, keyin balans tekşiruvini ota klassga **topşiradi**.

## `isinstance()` va `issubclass()`

`isinstance(obj, Class)` öşa klass **yoki uning istalgan ota klassi** uçun `True`:

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

`type()` aniq klassni beradi. `isinstance` esa is-a munosabatini hisobga oladi, odatda aynan şu kerak.

## `object` va metodlarni qidiriş tartibi

![Diagramma: `object` va metodlarni qidiriş tartibi](/images/companions-webp-uzb/inheritance-mro.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Otasi yöq klass standart `__str__`, `__repr__` va `__eq__` ni taʼminlaydigan `object` dan meros oladi. Python klasslarni qatʼiy tartibda - **metodlarni qidiriş tartibida** (method resolution order, MRO) - qidiradi:

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

`Square` `Rectangle` dan, u esa `Shape` dan meros oladi: bu **köp darajali vorislik**. `super()` ham şu tartibga amal qiladi: u "MRO dagi keyingi klass" degani, bitta ota bölganda esa şunçaki öşa ota.

### Mixinlar

Klassning bir neçta otasi bölişi mumkin: `class C(A, B):`. Buni asosan **mixin** - bitta imkoniyat qöşadigan kiçik klass uçun işlating:

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


print(JsonProduct("Kök çoy", 25000).to_json())
```

```text
{"name": "Kök çoy", "price": 25000}
```

`self.__dict__` obyekt atributlarini saqlaydi, şuning uçun mixin istalgan klass bilan işlaydi. Mixinlarni kiçik, ierarxiyalarni esa **sayoz** (bir yoki ikki daraja) saqlang.

## Özingiz sinab köring

`Employee` dan meros oladigan, `monthly_cost()` ni 10% agentlik haqini qöşib qayta aniqlaydigan va `describe()` ni `super()` bilan kengaytiradigan `Contractor` klassini qöşing.

<ClientOnly><PythonPlayground :code='"class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def monthly_cost(self):\n        return self.salary\n\n    def describe(self):\n        return f\"{self.name}: oyiga {self.monthly_cost():,.0f} söm\"\n\n\nclass Manager(Employee):\n    def __init__(self, name, salary, team_size):\n        super().__init__(name, salary)\n        self.team_size = team_size\n\n    def describe(self):\n        return super().describe() + f\" ({self.team_size} kişilik jamoa)\"\n\n\nstaff = [Employee(\"Aziza\", 7000000), Manager(\"Dilnoza\", 12000000, 6)]\nfor person in staff:\n    print(person.describe())\n\nprint(\"Jami:\", sum(p.monthly_cost() for p in staff))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `super().__init__()` ni unutiş

```py
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

class Manager(Employee):
    def __init__(self, name, salary, team_size):
        self.team_size = team_size        # ota __init__ heç qaçon işlamaydi

print(Manager("Dilnoza", 12_000_000, 5).name)
```

```text
AttributeError: 'Manager' object has no attribute 'name'
```

**Tuzatiş:** avval `super().__init__(name, salary)` ni çaqiring.

### 2. `super()` metodlariga `self` ni uzatiş

```py
class Shape:
    def __init__(self, name):
        self.name = name

class Circle(Shape):
    def __init__(self, radius):
        super().__init__(self, "Aylana")    # self ikki marta uzatildi
        self.radius = radius

Circle(2)
```

```text
TypeError: Shape.__init__() takes 2 positional arguments but 3 were given
```

`super()` `self` ni allaqaçon boğlaydi. **Tuzatiş:** `super().__init__("Aylana")`.

### 3. Ota klassni nomi bilan çaqiriş

`Parent.__init__(self, ...)` ierarxiya özgarmagunça işlaydi. Bu yerda `Employee` keyinroq `Person` va `Manager` orasiga qöşilgan:

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
        Person.__init__(self, name)       # Employee.__init__ ni ötkazib yuboradi
        self.team = []

print(Manager("Dilnoza", 12_000_000).salary)
```

```text
AttributeError: 'Manager' object has no attribute 'salary'
```

**Tuzatiş:** ota klasslar özgarganda ham haqiqiy MRO ga amal qiladigan `super().__init__(name, salary)`.

## Maşqlar

### 1. Talaba va magistrant <Difficulty level="1" />

`name` va `grades` (röyxat) li hamda `average()` metodli `Student` klassini yarating. `super().__init__()` yordamida `thesis` atributini qöşadigan `GraduateStudent(Student)` ni yarating. Azizaning örtaça bahosini (baholari 92, 88, 95) va dissertatsiyasini çop eting.

::: details Yeçim
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


g = GraduateStudent("Aziza", [92, 88, 95], "Farğona vodiysida suvdan foydalaniş")
print(f"{g.name}: {g.average():.1f}")
print(g.thesis)
```

```text
Aziza: 91.7
Farğona vodiysida suvdan foydalaniş
```
:::

### 2. Çegirmali mahsulot <Difficulty level="1" />

`Product` da `name`, `price` va `final_price()` bor. Qöşimça `percent` li va `final_price()` i çegirmani `super().final_price()` ga qöllaydigan `DiscountedProduct` ni yarating. 60,000 sömlik kepka va 15% çegirmali 200,000 sömlik kurtka narxlarini çop eting.

::: details Yeçim
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


for item in [Product("Kepka", 60_000), DiscountedProduct("Kurtka", 200_000, 15)]:
    print(f"{item.name}: {item.final_price():,} söm")
```

```text
Kepka: 60,000 söm
Kurtka: 170,000 söm
```
:::

### 3. Transport ijarasi <Difficulty level="2" />

`daily_rate` va `rental_cost(days)` li `Vehicle` ni yozing. `rental_cost` i ota versiyasini `super()` bilan kengaytirib, har kun uçun 50,000 söm qöşadigan `Truck(Vehicle)` ni qöşing. 300,000 sömlik transport va 450,000 sömlik yuk maşinasining 3 kunlik narxini çop eting.

::: details Yeçim
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
    print(f"{type(v).__name__}: {v.rental_cost(3):,} söm")
```

```text
Vehicle: 900,000 söm
Truck: 1,500,000 söm
```
:::

### 4. Tavsifdan loyihalaş: muzey çiptalari <Difficulty level="2" />

Samarqanddagi muzey çipta sotadi. Har bir çiptada tomoşabin ismi va 40,000 sömlik asosiy narx bor, u çek qatorini çop eta oladi. **Talaba çiptasi** yarim narxda. **Ekskursiya çiptasi** 30,000 söm qimmatroq va uning çekida ekskursovodning ismi ham körsatiladi. Farrux (oddiy), Aziza (talaba) va Bekzod (ekskursovod - Malika) uçun çeklarni çop eting.

::: details Yeçim
```python
class Ticket:
    base_price = 40_000

    def __init__(self, visitor):
        self.visitor = visitor

    def price(self):
        return self.base_price

    def receipt(self):
        return f"{type(self).__name__:<13} {self.visitor:<8} {self.price():>7,} söm"


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
        return super().receipt() + f" (ekskursovod: {self.guide})"


tickets = [Ticket("Farrux"), StudentTicket("Aziza"), GuidedTicket("Bekzod", "Malika")]
for t in tickets:
    print(t.receipt())
```

```text
Ticket        Farrux    40,000 söm
StudentTicket Aziza     20,000 söm
GuidedTicket  Bekzod    70,000 söm (ekskursovod: Malika)
```

`receipt()` bir marta yozilgan, lekin u `self.price()` ni çaqiradi, şuning uçun har bir çipta öz narxini çop etadi.
:::

### 5. Mixinli jurnal yuritadigan hisob <Difficulty level="3" />

`self.history` ga qöşadigan (kerak bölsa röyxatni `hasattr` bilan yaratadigan) `log(event)` li `HistoryMixin` ni yozing. `Account` ni (owner, balance, `deposit`, `withdraw`) va har bir amalni jurnalga yoziş uçun ikkala metodni kengaytiradigan `TrackedAccount(HistoryMixin, Account)` ni yozing. 100,000 dan boşlab 50,000 qöying va 30,000 yeçing, keyin MRO nomlarini va raqamlangan tarixni çop eting.

::: details Yeçim
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
        self.log(f"qöyildi {amount:,} -> {self.balance:,}")

    def withdraw(self, amount):
        super().withdraw(amount)
        self.log(f"yeçildi {amount:,} -> {self.balance:,}")


acc = TrackedAccount("Dilnoza", 100_000)
acc.deposit(50_000)
acc.withdraw(30_000)
print([c.__name__ for c in TrackedAccount.__mro__])
for number, event in enumerate(acc.history, start=1):
    print(f"{number}. {event}")
```

```text
['TrackedAccount', 'HistoryMixin', 'Account', 'object']
1. qöyildi 50,000 -> 150,000
2. yeçildi 30,000 -> 120,000
```

`HistoryMixin` da `deposit` yöq, şuning uçun `super().deposit()` MRO böylab `Account` gaça davom etadi.
:::

## Xulosa

- Vorislikni **is-a** munosabatlari uçun işlating: `class Manager(Employee):`.
- Metodni yana bir marta yozib, uni **qayta aniqlang** (ortiqça yuklaş yöq). Uni `super().method(...)` bilan **kengaytiring**.
- Bola `__init__` i, ota klass tayyorlovini haqiqatan almaştirmoqçi bölmasangiz, `super().__init__(...)` ni çaqirişi kerak.
- `isinstance()` vorislikni hisobga oladi. `type(x) == C` esa yöq.
- Har bir klass `object` dan meros oladi. `Class.__mro__` qidiriş tartibini körsatadi, `super()` esa unga amal qiladi.
- Ierarxiyalarni sayoz, mixinlarni kiçik saqlang. has-a ("bor") uçun atributlardan foydalaning.

## Qöşimça manbalar

- [Python Tutorial: Inheritance](https://docs.python.org/3/tutorial/classes.html#inheritance)
- [Built-in function `super()`](https://docs.python.org/3/library/functions.html#super)
- [Built-in functions `isinstance()` and `issubclass()`](https://docs.python.org/3/library/functions.html#isinstance)
- [The Python 2.3 Method Resolution Order](https://docs.python.org/3/howto/mro.html)
