---
title: Klasslar va obyektlar
description: "Öz klasslaringizni yarating, __init__ va self ni çuqur tuşuning, öz atributlariga ega mustaqil nusxalar yarating va yangi boşlovçilarning eng köp uçraydigan xatolaridan saqlaning."
---

# Klasslar va obyektlar

![Rasm: Klasslar va obyektlar](/images/topics-webp-uzb/classes-and-objects.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Klassni qanday yoziş, nomlaş va undan obyektlar yaratiş
- `__init__` nima qiladi va Python uni qaçon işga tuşiradi
- `self` aslida nima va `obj.method()` uni siz uçun qanday uzatadi
- Har bir obyektga öz atributlarini qanday beriş va ularni `vars()`, `dir()` va `getattr()` bilan örganiş
- `isinstance()`, aliasing (bitta obyektga bir neçta nom) hamda `is` va `==` öz obyektlaringiz bilan qanday işlaydi
:::

## Nega bu muhim

Klasslar bilan boğliq yangi boşlovçilarning köp çalkaşliklari ikki narsaga borib taqaladi: `__init__` va `self`. Ularni tuşunganingizdan keyin OOP ning qolgan qismi ular ustiga quriladi. Haqiqiy xatolarga sabab böladigan bir faktni ham körasiz: ikki özgaruvçi **aynan bitta** obyektga işora qilişi mumkin.

## Eng oddiy klass

Klass `class`, nom va ikki nuqta bilan boşlanadi, undan keyin çekinişli tana keladi:

```python
class Book:
    """Kutubxonadagi kitob."""

first = Book()        # obyekt yaratiş uçun klassni çaqiramiz
second = Book()

print(type(first))
print(first is second)
```

```text
<class '__main__.Book'>
False
```

`class Book:` ostidagi satr - **docstring**: klass nimani ifodalaşini aytadigan bitta qator. Har bir `Book()` çaqirişi yangi, alohida **nusxa** (instance) yaratadi. Klass nomlari `snake_case` dagi funksiya va özgaruvçilardan farqli ravişda **CapWords** uslubida yoziladi (`Book`, `BankAccount`). `str` kabi örnatilgan turlar faqat tarixiy sabablarga köra kiçik harfda.

## `__init__`: yangi obyektni tayyorlaş

Har bir kitobga paydo bölgan paytidanoq sarlavha va muallif beriş uçun `__init__` ni yozing ("dunder init", **d**ouble **under**score - ikki pastki çiziq):

```python
class Book:
    def __init__(self, title, author):
        print(f"Yangi kitob tayyorlanmoqda: {title}")
        self.title = title
        self.author = author

book = Book("Ipak yöli hikoyalari", "Dilnoza Karimova")
print(book.title)
print(book.author)
```

```text
Yangi kitob tayyorlanmoqda: Ipak yöli hikoyalari
Ipak yöli hikoyalari
Dilnoza Karimova
```

`__init__` ni heç qaçon özingiz çaqirmaysiz. `Book("Ipak yöli hikoyalari", "Dilnoza Karimova")` Pythonni yangi, böş `Book` yaratişga, `__init__` ni şu obyekt `self` sifatida, argumentlaringiz esa `title` va `author` sifatida uzatilgan holda çaqirişga va tayyor obyektni qaytarişga majbur qiladi. `__init__` qiymat qaytarmasligi kerak: u faqat obyektni töldiradi. U köpinça **konstruktor** (constructor) deb ataladi.

## `self` nima?

![Diagramma: `self` nima?](/images/companions-webp-uzb/method-self.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

`self` - **metod ustida işlayotgan obyekt**: `__init__` da tayyorlanayotgan yangi obyekt, boşqa har qanday metodda esa metodni çaqirgan obyekt. Python bu obyektni argumentlar röyxatining boşiga siz uçun köçiradi, şuning uçun bu ikki qator bir xil işni bajaradi:

```python
import math

class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    def reading_days(self, pages_per_day):
        return math.ceil(self.pages / pages_per_day)

book = Book("Python asoslari", 320)
print(book.reading_days(30))         # odatiy usul
print(Book.reading_days(book, 30))   # Python parda ortida qiladigan iş
```

```text
11
11
```

Aynan şuning uçun har bir metodning birinçi parametri `self`, garçi uni heç qaçon özingiz uzatmasangiz ham. (Bu nom - kelişuv, lekin juda qatʼiy kelişuv.) Metod içida yaratilgan özgaruvçilar **lokal** va metod tugaşi bilan yöqoladi; `self.pages = pages` esa qiymatni **obyektda** saqlaydi, şuning uçun `reading_days()` undan keyinroq foydalana oladi.

## Har bir obyektning öz atributlari bor

`self.name = ...` bilan saqlangan qiymatlar - **nusxa atributlari** (instance attributes): har bir nusxada ular özining. `__init__` ularni hisoblab çiqarişi yoki qatʼiy qiymatdan boşlaşi ham mumkin, standart qiymatlar esa har qanday funksiyadagidek işlaydi:

```python
class Product:
    """Dökondagi mahsulot."""

    def __init__(self, name, price, discount_percent=0):
        self.name = name
        self.price = price
        self.final_price = price * (100 - discount_percent) // 100   # hisoblangan
        self.sold = 0                                                  # qatʼiy boşlanğiç

tea = Product("Kök çoy", 24000, 25)
bread = Product("Non", 5000)
tea.sold += 3                       # faqat tea ni özgartiradi
print(tea.final_price, tea.sold, bread.final_price, bread.sold)
```

```text
18000 3 5000 0
```

*Parametrlar va argumentlar* darsidagi özgaruvçan standart qiymat tuzoği bu yerda ham amal qiladi: `def __init__(self, items=[])` bitta röyxatni barça obyektlar orasida bölişadi. `items=None` işlating va röyxatni `__init__` içida yarating.

::: tip Obyektlarni örganiş
Bir neçta örnatilgan funksiya istalgan obyekt içiga qaraş imkonini beradi, bu xatolarni tuzatişda qulay:

```python
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

tea = Product("Kök çoy", 24000)
print(vars(tea))                              # nusxa atributlari luğat sifatida
print(hasattr(tea, "price"), hasattr(tea, "color"))
print(getattr(tea, "color", "rangi yöq"))     # nom böyiça öqiş, standart qiymat bilan
```

```text
{'name': 'Kök çoy', 'price': 24000}
True False
rangi yöq
```

`dir(tea)` barça atribut va metod nomlarini, jumladan Pythonning örnatilgan `__...__` nomlarini röyxatlaydi, `help(Product)` esa klassni docstringi bilan körsatadi.
:::

## Obyektni çop etiş

Standart holatda `print(book)` faqat `<__main__.Book object at 0x7f3a9c2b1e50>` kabi narsani körsatadi. Hozirça öqişli satr qaytaradigan `describe()` kabi metod yozing; `print()` ning özini tuzatadigan `__str__` va `__repr__` *Obyektlarni ifodalaş va taqqoslaş* darsida körsatiladi.

## Aynanlik, aliasing va `isinstance()`

![Diagramma: Aynanlik, aliasing va `isinstance()`](/images/companions-webp-uzb/object-aliasing.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Qiymat beriş heç qaçon obyektni nusxalamaydi: `b = a` xuddi röyxatlardagidek **aynan bitta** obyekt uçun ikkinçi **nom** yaratadi (funksiya ham obyektning özini oladi).

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

family = BankAccount("Karimovlar oilasi", 1000000)
shared = family                   # nusxa emas: aynan şu hisob
shared.balance -= 250000          # bitta nom orqali sarflaymiz...
print(family.balance)             # ...özgariş ikkinçisida ham körinadi

twin = BankAccount("Karimovlar oilasi", 750000)
print(shared is family, twin is family)
print(twin == family)             # maʼlumot bir xil, lekin == standart holatda aynanlikni soliştiradi
print(isinstance(twin, BankAccount), isinstance("twin", BankAccount))
```

```text
750000
True False
False
True False
```

`a is b` "**aynan bitta obyektmi**?" deb söraydi, `a == b` esa "**qiymatlari tengmi**?" deb. Python klassingiz uçun "teng" nimani anglatişini bilmaydi, şuning uçun standart holatda `==` `is` kabi işlaydi; `__eq__` ni qanday aniqlaş *Obyektlarni ifodalaş va taqqoslaş* darsida körsatiladi. `isinstance(obj, SomeClass)` "bu şu klassning nusxasimi?" deb söraydi. Uni `type(x) == SomeClass` dan afzal köring: u klasslar kortejini qabul qiladi va vorislik bilan işlaydi (*Vorislik va super()* darsiga qarang).

## Özingiz sinab köring

Köproq qahramon yarating va ularga buyumlar bering.

<ClientOnly><PythonPlayground :code='"class Character:\n    def __init__(self, name, level=1):\n        self.name = name\n        self.level = level\n        self.inventory = []\n\n    def pick_up(self, item):\n        self.inventory.append(item)\n        return f\"{self.name} {item} oldi\"\n\nhero = Character(\"Dilnoza\", level=4)\nprint(hero.pick_up(\"damlama\"))\nprint(vars(hero))\n\ntwin = hero\ntwin.level = 5\nprint(\"hero darajasi:\", hero.level, \"| bitta obyekt:\", twin is hero)"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Metod taʼrifida `self` ni unutiş

```py
class Book:
    def describe():
        return "Kitob"

Book().describe()
```

```text
TypeError: Book.describe() takes 0 positional arguments but 1 was given
```

Python har doim obyektni birinçi argument sifatida uzatadi, lekin `describe()` heç qanday argument qabul qilmaydi. **Tuzatiş:** `def describe(self):`.

### 2. Atributni saqlaşda `self.` ni unutiş

```py
class Book:
    def __init__(self, title):
        title = title          # şunçaki lokal özgaruvçi

book = Book("Python asoslari")
print(book.title)
```

```text
AttributeError: 'Book' object has no attribute 'title'
```

`self.` siz qiymat `__init__` tugaşi bilan yöqoladi. **Tuzatiş:** `self.title = title`. Xato yozilgan nom ham maslahat bilan `AttributeError` beradi: `book.tittle` `AttributeError: 'Book' object has no attribute 'tittle'. Did you mean: 'title'?` ni çiqaradi.

### 3. `__init__` ni xato yoziş

```py
class Book:
    def _init_(self, title):      # har tomonda bittadan pastki çiziq
        self.title = title

book = Book("Python asoslari")
```

```text
TypeError: Book() takes no arguments
```

Python faqat har ikki tomonida **ikkitadan** pastki çiziq bölgan aynan `__init__` nomli metodni işga tuşiradi. `_init_` - heç qaçon işlamaydigan oddiy metod.

## Maşqlar

### 1. Şaharlar <Difficulty level="1" />

`name`, `population` va `country` (standart qiymati `"Özbekiston"`) li `City` klassini yozing. Toşkent (3,000,000), Samarqand (570,000) va Olmaotani (2,200,000, Qozoğiston) yarating va har birini `f"{city.name:<10} {city.country:<11} {city.population:>10,}"` bilan çop eting.

::: details Yeçim
```python
class City:
    def __init__(self, name, population, country="Özbekiston"):
        self.name = name
        self.population = population
        self.country = country

cities = [
    City("Toşkent", 3000000),
    City("Samarqand", 570000),
    City("Olmaota", 2200000, "Qozoğiston"),
]
for city in cities:
    print(f"{city.name:<10} {city.country:<11} {city.population:>10,}")
```

```text
Toşkent    Özbekiston   3,000,000
Samarqand  Özbekiston     570,000
Olmaota    Qozoğiston   2,200,000
```
:::

### 2. Klassni tuzating <Difficulty level="1" />

Bu kodda uçta xato bor. Ularni topib, `Çoy 15000 söm turadi` ni çop etadigan qilib tuzating.

```py
class product:
    def __init__(name, price):
        name = name
        self.price = price

    def label():
        return f"{self.name} {self.price} söm turadi"

tea = product("Çoy", 15000)
print(tea.label())
```

::: details Yeçim
```python
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def label(self):
        return f"{self.name} {self.price} söm turadi"

tea = Product("Çoy", 15000)
print(tea.label())
```

```text
Çoy 15000 söm turadi
```

`__init__` va `label` da `self` yetişmayotgan edi, `name = name` esa obyektda heç narsa saqlamadi. `Product` endi CapWords uslubiga ham mos.
:::

### 3. Natijani oldindan ayting <Difficulty level="2" />

Işga tuşirmasdan, bu kod nimani çop etişini yozing. Keyin tekşiring.

```python
class Counter:
    def __init__(self, start=0):
        self.value = start

a = Counter()
b = Counter(10)
c = a
c.value += 5
a.value += 1
b = Counter(b.value + a.value)

print(a.value, b.value, c.value)
print(a is c, a == b)
```

::: details Yeçim
```text
6 16 6
True False
```

`c` - `a` ning boşqa nomi, şuning uçun ikkala özgariş ham bitta obyektga tegadi: `0 + 5 + 1 = 6`. Yangi `b` `10 + 6 = 16` dan boşlanadi. Standart holatda `==` aynanlikni soliştiradi, şuning uçun `a == b` `False`.
:::

### 4. Klass loyihalang: kino çiptasi <Difficulty level="2" />

Quyidagi tavsif asosida `Ticket` klassini loyihalang:

> Samarqanddagi kinoteatr çipta sotadi. Har bir çiptada film nomi, `"F7"` kabi örin va standart qiymati 45,000 söm bölgan narx bor. Har bir çipta işlatilmagan holda boşlanadi va aynan bir marta işlatiliş mumkin: `use()` ni ikkinçi marta çaqiriş `ValueError("B2 çiptasi allaqaçon işlatilgan")` çaqiradi. `summary()` `Ipak yöli, F7 örin, 45,000 söm, yaroqli` kabi qator qaytaradi.

Klassingiz quyidagi kod bilan işlab, pastdagi natijani çop etişi kerak:

```py
normal = Ticket("Ipak yöli", "F7")
special = Ticket("Koinot sayohati", "B2", 60000)

special.use()
try:
    special.use()
except ValueError as error:
    print("Xato:", error)

print(normal.summary())
print(special.summary())
```

```text
Xato: B2 çiptasi allaqaçon işlatilgan
Ipak yöli, F7 örin, 45,000 söm, yaroqli
Koinot sayohati, B2 örin, 60,000 söm, işlatilgan
```

::: details Yeçim
```python
class Ticket:
    def __init__(self, movie, seat, price=45000):
        self.movie = movie
        self.seat = seat
        self.price = price
        self.used = False

    def use(self):
        if self.used:
            raise ValueError(f"{self.seat} çiptasi allaqaçon işlatilgan")
        self.used = True

    def summary(self):
        status = "işlatilgan" if self.used else "yaroqli"
        return f"{self.movie}, {self.seat} örin, {self.price:,} söm, {status}"

normal = Ticket("Ipak yöli", "F7")
special = Ticket("Koinot sayohati", "B2", 60000)

special.use()
try:
    special.use()
except ValueError as error:
    print("Xato:", error)

print(normal.summary())
print(special.summary())
```

U maşqda körsatilgan kutilgan natijani çop etadi.
:::

### 5. Kontaktlar daftari <Difficulty level="3" />

`Contact` klassini (`name` hamda standart qiymati `"Toşkent"` bölgan `city`) va kontaktlar röyxatini saqlaydigan `ContactBook` klassini yozing. `ContactBook` ga `add(contact)` va mos kontaktni yoki `None` ni qaytaradigan `find(name)` kerak (katta-kiçik harfni eʼtiborsiz qoldiring). Aziza va Farruxni (Buxoro) `work` daftariga, Dilnozani (Samarqand) `family` daftariga qöşing. `work.find("farrux")` ning ismi va şahrini, keyin `work.find("Dilnoza")` ni, keyin har bir daftardagi kontaktlar sonini çop eting.

::: details Yeçim
```python
class Contact:
    def __init__(self, name, city="Toşkent"):
        self.name = name
        self.city = city

class ContactBook:
    def __init__(self):
        self.contacts = []

    def add(self, contact):
        self.contacts.append(contact)

    def find(self, name):
        for contact in self.contacts:
            if contact.name.lower() == name.lower():
                return contact
        return None

work = ContactBook()
family = ContactBook()

work.add(Contact("Aziza"))
work.add(Contact("Farrux", "Buxoro"))
family.add(Contact("Dilnoza", "Samarqand"))

found = work.find("farrux")
print(found.name, found.city)
print(work.find("Dilnoza"))
print(len(work.contacts), len(family.contacts))
```

```text
Farrux Buxoro
None
2 1
```

`self.contacts = []` `__init__` da bajariladi, şuning uçun har bir daftar öz röyxatini oladi.
:::

## Xulosa

- `class Name:` (CapWords, docstring bilan) klass aniqlaydi; uni çaqiriş nusxa yaratadi.
- `__init__` avtomatik işga tuşadi va yangi obyektning atributlarini töldiradi.
- `self` - metod ustida işlayotgan obyekt: `obj.method(x)` `ClassName.method(obj, x)` degani. Maʼlumotni `self.attr = value` bilan saqlang.
- `vars()`, `dir()`, `hasattr()` va `getattr()` obyekt içiga qaraş imkonini beradi.
- `isinstance()` klassni tekşiradi. Qiymat beriş bitta obyektni bölişadi; standart holatda `==` `is` kabi aynanlikni soliştiradi.

## Qöşimça manbalar

- [Python Tutorial - Class Objects and Instance Objects](https://docs.python.org/3/tutorial/classes.html#class-objects)
- [Python Tutorial - Random Remarks (about self)](https://docs.python.org/3/tutorial/classes.html#random-remarks)
- [PEP 8 - Class Names](https://peps.python.org/pep-0008/#class-names)
- [Built-in functions - isinstance()](https://docs.python.org/3/library/functions.html#isinstance)
