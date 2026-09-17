---
title: Xossalar va inkapsulyatsiya
description: "Obyekt maʼlumotlarini _internal kelişuvi bilan himoya qiling va mavjud kodni buzmasdan tekşiriladigan, faqat öqiladigan va hisoblanadigan atributlar uçun @property dan foydalaning."
---

# Xossalar va inkapsulyatsiya

![Rasm: Xossalar va inkapsulyatsiya](/images/topics-webp-uzb/properties-and-encapsulation.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Inkapsulyatsiya** nimani anglatadi hamda `name`, `_name` va `__name` orasidagi farq
- `@property` öqilganda kod bajaradigan atributlarni qanday yaratadi
- Setterlar yangi qiymatlarni qanday **tekşiradi** va **faqat öqiladigan** hamda **hisoblanadigan** atributlarni qanday yaratiş
- Çaqiradigan kodni özgartirmasdan oddiy atributni xossaga qanday aylantiriş
- Qaçon xossa notöğri vosita
:::

## Nega bu muhim

Metodlar har bir özgarişni tekşira oladi, lekin kodning töğridan-töğri `account.balance = -5000000` deb yozişini heç narsa töxtatmaydi. **Inkapsulyatsiya** (encapsulation) obyekt öz maʼlumotlariga kirişni özi boşqarişini anglatadi, şunda maʼlumotlar yaroqli qoladi. Python oddiy nomlaş kelişuvlaridan va tekşiriş kodingizni bajarib, baribir `account.balance` kabi körinadigan **xossalardan** (properties) foydalanadi.

## Oçiq, `_internal` va `__mangled` nomlar

Bankomat kabi klassda ham **oçiq interfeys** (tugmalar) va **içki holat** (pul qutisi) bor. Pythonda `private` kalit sözi yöq; u nomlaş kelişuvlaridan foydalanadi:

- `balance` - **oçiq** (public).
- `_balance` - **içki**: boşidagi bitta pastki çiziq "iltimos, buni klassdan taşqarida işlatmang" degani. Python buni majburlamaydi, lekin dasturçilar hurmat qiladi.
- `__balance` **nom özgartirişni** (name mangling) işga tuşiradi: boşida ikkita (oxirida esa köpi bilan bitta) pastki çiziq bölsa, Python uni `_ClassName__balance` ga qayta nomlaydi.

```py
class SafeBox:
    def __init__(self, pin):
        self.__pin = pin              # klass içida nom odatdagidek işlaydi

box = SafeBox("4321")
print(box.__pin)
```

```text
AttributeError: 'SafeBox' object has no attribute '__pin'
```

Qiymatga baribir `box._SafeBox__pin` orqali yetiş mumkin: nom özgartiriş sirlarni saqlaş uçun emas, vorislikdagi **nomlar toqnaşuvining** oldini oliş uçun mavjud (*Vorislik va super()* darsiga qarang). Kundalik kod uçun bitta pastki çiziq - Python usuli. (**Ikkala** tomonida pastki çiziq bor `__len__` - maxsus metod, yaşirin emas.)

## `@property`: kod bajaradigan atributlar

`_balance` bilan çaqiruvçilar oddiy `account.balance` sintaksisini yöqotadi. **Xossa** uni qaytaradi: atribut kabi öqiladigan metod. Faqat getter bölsa, u **faqat öqiladigan** (read-only) böladi:

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        self._balance += amount

account = BankAccount("Bekzod", 200000)
account.deposit(50000)
print(account.balance)          # qavslarsiz: atributga öxşaydi

try:
    account.balance = 999999999
except AttributeError as error:
    print("Rad etildi:", error)
```

```text
250000
Rad etildi: property 'balance' of 'BankAccount' object has no setter
```

`@property` `balance` ni kimdir `account.balance` ni öqiganda işlaydigan **getterga** aylantiradi. Qiymat `_balance` da yaşaydi va uni faqat `deposit()` özgartiradi.

## Setterlar: qiymat berişda tekşiriş

Qiymat yaroqli bölsa, töğridan-töğri qiymat beriş maʼqul bölganda `@name.setter` bilan **setter** qöşing:

```python
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price              # pastdagi setterdan ötadi

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):
        if not isinstance(value, (int, float)):
            raise TypeError(f"Narx son bölişi kerak, berilgan: {value!r}")
        if value <= 0:
            raise ValueError(f"Narx musbat bölişi kerak, berilgan: {value}")
        self._price = value

tea = Product("Kök çoy", 15000)
tea.price = 17000                        # oddiy qiymat berişga öxşaydi...
print(tea.price)

for bad in [-500, "arzon"]:
    try:
        tea.price = bad                  # ...lekin tekşiruvni bajaradi
    except (TypeError, ValueError) as error:
        print("Rad etildi:", error)

print(tea.price)
```

```text
17000
Rad etildi: Narx musbat bölişi kerak, berilgan: -500
Rad etildi: Narx son bölişi kerak, berilgan: 'arzon'
17000
```

Getter va setter **bir xil nomga** ega, qiymat **boşqa** nom (`_price`) ostida saqlanadi, `__init__` esa `self.price` ga qiymat beradi, şuning uçun boşlanğiç narx ham tekşiriladi.

Bitta böşliq bor: `bool` - `int` ning bolasi, şuning uçun `tea.price = True` `1` sifatida qabul qilinadi. Bu muhim bölsa, `isinstance(value, bool)` ni ham rad eting. Kamdan-kam kerak böladigan `@price.deleter` ham bor, u `del tea.price` da işlaydi.

## Hisoblanadigan xossalar

Xossa natijasini har safar öqilganda boşqa atributlardan **hisoblaşi** ham mumkin, şuning uçun u heç qaçon eskirmaydi:

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height

room = Rectangle(4, 5)
print(room.area)
room.width = 6                  # maʼlumotni özgartiramiz...
print(room.area)                # ...hisoblangan qiymat ham unga ergaşadi
```

```text
20
30
```

`__init__` da berilgan oddiy atribut hali ham `20` ni körsatgan bölardi. (Hisoblanadigan xossada ham setter bölişi mumkin, masalan ismni bölib saqlaydigan `full_name` setteri.)

## Atributni xossaga aylantiriş

Xossalarning eng katta amaliy afzalligi: **oddiy atributlardan boşlang** va faqat kerak bölganda xossaga ötkazing. Faraz qiling, kod hamma joyda oddiy atributga `sensor.celsius = 26.5` deb yozadi, keyin nosoz qurilma `-999` yuboradi. `self.celsius` ni xuddi yuqoridagi `price` kabi `celsius` xossasi va setteri bilan almaştiring. Mavjud har bir `sensor.celsius = ...` qatori özgarişsiz işlayveradi, `-999` esa endi rad etiladi. Şuning uçun baʼzi tillardan farqli ravişda, sizga "har ehtimolga qarşi" `get_celsius()`/`set_celsius()` metodlari heç qaçon kerak emas.

## Qaçon xossalarni işlatmaslik kerak

- **Heç narsa qilmaydigan getter va setterlarni yozmang.** Oddiy `self.name` xuddi şu işni bajaradi va xossani keyinroq qöşişingiz mumkin.
- **Sekin yoki kutilmagan işni xossada yaşirmang.** `report.total` özgaruvçi kabi arzon körinadi. Agar u fayl yuklab olsa yoki boşqa holatni özgartirsa, uni metod qiling: `report.calculate_total()`.

## Özingiz sinab köring

Bu setter xato çaqiriş örniga salomatlikni 0-100 oraliğiga **qisib qöyadi**. Boşqa qiymatlarni sinab köring.

<ClientOnly><PythonPlayground :code='"class Character:\n    def __init__(self, name):\n        self.name = name\n        self.health = 100\n\n    @property\n    def health(self):\n        return self._health\n\n    @health.setter\n    def health(self, value):\n        self._health = max(0, min(value, 100))\n\nhero = Character(\"Aziza\")\nhero.health -= 45\nprint(\"Salomatlik:\", hero.health)\nhero.health += 999\nprint(\"Salomatlik:\", hero.health)"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Qiymatni xossaning öz nomi ostida saqlaş

```py
class Product:
    def __init__(self, price):
        self.price = price

    @property
    def price(self):
        return self.price

    @price.setter
    def price(self, value):
        self.price = value         # bu setterni yana, çeksiz işga tuşiradi

item = Product(15000)
```

```text
RecursionError: maximum recursion depth exceeded
```

Xossa içida `self.price` - xossaning özi, şuning uçun u özini çeksiz çaqiradi. **Tuzatiş:** maʼlumotni `self._price` da saqlang.

### 2. Xossani qavslar bilan çaqiriş

```py
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height

print(Rectangle(4, 5).area())
```

```text
TypeError: 'int' object is not callable
```

`Rectangle(4, 5).area` allaqaçon `20` soni, sonni esa çaqirib bölmaydi. **Tuzatiş:** qavslarni olib taşlang.

### 3. Setter funksiyasini boşqaça nomlaş

```py
class Product:
    def __init__(self, price):
        self._price = price

    @property
    def price(self):
        return self._price

    @price.setter
    def set_price(self, value):     # boşqa nom
        self._price = value

item = Product(15000)
item.price = 17000
```

```text
AttributeError: property 'price' of 'Product' object has no setter
```

`@price.setter` yangi xossani funksiya nomi - `set_price` ostida saqlaydi, şuning uçun `price` faqat öqiladigan bölib qoladi. **Tuzatiş:** ikkala funksiyani ham `price` deb nomlang.

## Maşqlar

### 1. Aylana <Difficulty level="1" />

`radius` atributli va faqat öqiladigan, hisoblanadigan `diameter` hamda `area` xossalari bor `Circle` klassini yozing (`math.pi` dan foydalaning). 3 radius uçun ikkalasini bitta qatorda çop eting (yuzani 2 xonagaça yuvarlang). Radiusni 5 ga özgartiring va yuvarlangan `area` ni yana çop eting.

::: details Yeçim
```python
import math

class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def diameter(self):
        return self.radius * 2

    @property
    def area(self):
        return math.pi * self.radius ** 2

c = Circle(3)
print(c.diameter, round(c.area, 2))
c.radius = 5
print(round(c.area, 2))
```

```text
6 28.27
78.54
```
:::

### 2. Tekşiriladigan yoş <Difficulty level="1" />

`name` va setteri yoş 5 dan 120 gaça butun son bölmasa `ValueError(f"Notöğri yoş: {value!r}")` çaqiradigan `age` xossasi bor `Member` klassini yozing. Bekzodni (15) yarating, uning yoşini 16 qiling, `Bekzod 16` ni çop eting, keyin `3` va `"20"` yoşlarini sinab köring, `Rad etildi:` va har bir xatoni çop eting.

::: details Yeçim
```python
class Member:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if not isinstance(value, int) or not 5 <= value <= 120:
            raise ValueError(f"Notöğri yoş: {value!r}")
        self._age = value

bekzod = Member("Bekzod", 15)
bekzod.age = 16
print(bekzod.name, bekzod.age)

for bad in [3, "20"]:
    try:
        bekzod.age = bad
    except ValueError as error:
        print("Rad etildi:", error)
```

```text
Bekzod 16
Rad etildi: Notöğri yoş: 3
Rad etildi: Notöğri yoş: '20'
```
:::

### 3. Ikki harorat şkalasi <Difficulty level="2" />

**Faqat** `_celsius` ni saqlaydigan, öqiş **va** qiymat beriş mumkin bölgan `celsius` va `fahrenheit` xossalari bor `Temperature` klassini yozing. -273.15 C dan past qiymatda `ValueError(f"Mutlaq noldan past: {value} C")` çaqiring. Kunni 104 F ga qöying va `40.0 C = 104.0 F` ni çop eting. Keyin `celsius = -300` ni qöying va `Rad etildi:` ni xato bilan çop eting.

::: details Yeçim
```python
class Temperature:
    def __init__(self, celsius=0.0):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError(f"Mutlaq noldan past: {value} C")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5 / 9      # Selsiy tekşiruvidan qayta foydalanamiz


day = Temperature()
day.fahrenheit = 104
print(f"{day.celsius:.1f} C = {day.fahrenheit:.1f} F")

try:
    day.celsius = -300
except ValueError as error:
    print("Rad etildi:", error)
```

```text
40.0 C = 104.0 F
Rad etildi: Mutlaq noldan past: -300 C
```

`fahrenheit` setteri `celsius` setterining tekşiruvidan qayta foydalanadi.
:::

### 4. Klass loyihalang: mehmonxona xonasi <Difficulty level="2" />

Qaysi atributlar oddiy, tekşiriladigan yoki faqat öqiladigan bölişini hal qilib, `HotelRoom(number, price)` klassini loyihalang:

> Xona raqamini yaratilgandan keyin özgartirib bölmaydi. Menejer bir keçalik narxni özgartirişi mumkin, lekin u musbat qolişi kerak (`ValueError("Narx musbat bölişi kerak")`).

U quyidagi kod bilan işlab, aynan şu natijani çop etişi kerak:

```py
room = HotelRoom(204, 650000)
room.price = 700000
print(room.number, room.price)
try:
    room.price = 0
except ValueError as error:
    print("Rad etildi:", error)
try:
    room.number = 305
except AttributeError as error:
    print("Rad etildi:", error)
```

```text
204 700000
Rad etildi: Narx musbat bölişi kerak
Rad etildi: property 'number' of 'HotelRoom' object has no setter
```

::: details Yeçim
```python
class HotelRoom:
    def __init__(self, number, price):
        self._number = number
        self.price = price

    @property
    def number(self):                 # faqat öqiladigan
        return self._number

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):           # tekşiriladigan
        if value <= 0:
            raise ValueError("Narx musbat bölişi kerak")
        self._price = value

room = HotelRoom(204, 650000)
room.price = 700000
print(room.number, room.price)
try:
    room.price = 0
except ValueError as error:
    print("Rad etildi:", error)
try:
    room.number = 305
except AttributeError as error:
    print("Rad etildi:", error)
```
:::

### 5. Inkapsulyatsiyaga qayta tuziş <Difficulty level="3" />

Oddiy `self.books = {}` (sarlavhadan nusxalar soniga) li `Library` istalgan odamga `library.books["Python asoslari"] = -4` deb yoziş imkonini beradi. Uni inkapsulyatsiya qiling: kitoblar faqat `add_copies(title, count)` orqali özgaradi (`ValueError("Soni musbat bölişi kerak")` çaqiradi), `books` xossasi nusxa qaytaradi, `total_copies` esa hisoblanadi. Sinab köring: Python asoslari dan 2 nusxa qöşing, `library.books["Python asoslari"] = -4` ni qöying, `library.books` va `library.total_copies` ni çop eting, keyin `add_copies("Navoiy şeʼrlari", -1)` va `library.books = {}` ni sinab köring, `Rad etildi:` va har bir xatoni çop eting.

::: details Yeçim
```python
class Library:
    def __init__(self):
        self._books = {}

    @property
    def books(self):
        return dict(self._books)              # nusxa: taşqi özgarişlar heç narsa qilmaydi

    @property
    def total_copies(self):
        return sum(self._books.values())

    def add_copies(self, title, count=1):
        if count <= 0:
            raise ValueError("Soni musbat bölişi kerak")
        self._books[title] = self._books.get(title, 0) + count

library = Library()
library.add_copies("Python asoslari", 2)
library.books["Python asoslari"] = -4          # faqat nusxani özgartiradi
print(library.books, library.total_copies)

try:
    library.add_copies("Navoiy şeʼrlari", -1)
except ValueError as error:
    print("Rad etildi:", error)
try:
    library.books = {}
except AttributeError as error:
    print("Rad etildi:", error)
```

```text
{'Python asoslari': 2} 2
Rad etildi: Soni musbat bölişi kerak
Rad etildi: property 'books' of 'Library' object has no setter
```
:::

## Xulosa

- `_name` kelişuv böyiça biror narsani içki deb belgilaydi; `__name` `_ClassName__name` ga qayta nomlanadi, bu toqnaşuvlarning oldini oladi, lekin xavfsizlik emas.
- `@property` metodni atribut kabi öqiladigan getterga aylantiradi. Settersiz xossa **faqat öqiladigan** böladi.
- `@name.setter` qiymat berişda tekşiradi; qiymatni `_name` kabi boşqa nom ostida saqlang. **Hisoblanadigan** xossa heç qaçon eskirmaydi.
- Oddiy atributlardan boşlang va kerak bölganda xossaga ötkazing; çaqiruvçilar özgarmaydi.

## Qöşimça manbalar

- [Built-in functions - property()](https://docs.python.org/3/library/functions.html#property)
- [Python Tutorial - Private Variables](https://docs.python.org/3/tutorial/classes.html#private-variables)
- [PEP 8 - Designing for Inheritance (public and non-public names)](https://peps.python.org/pep-0008/#designing-for-inheritance)
- [Descriptor Guide - Properties](https://docs.python.org/3/howto/descriptor.html#properties)
