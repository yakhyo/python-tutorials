---
title: Metodlar va obyekt holati
description: "Obyekt holatini öqiydigan va özgartiradigan metodlar yozing, özgarişlarni tekşiring, maʼlumotlarni izçil saqlang va obyekt içida röyxatlar hamda boşqa obyektlarni saqlang."
---

# Metodlar va obyekt holati

![Rasm: Metodlar va obyekt holati](/images/topics-webp-uzb/methods-and-attributes.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Metodlar obyektning **holatini** (atributlarining joriy qiymatlarini) qanday öqiydi va özgartiradi
- Qaçon metod qiymat **qaytarişi**, qaçon esa obyektni **özgartirişi** kerak
- Metodlar `self` orqali boşqa metodlarni qanday çaqiradi
- Özgarişlarni qanday tekşiriş va obyektni izçil saqlaş
- Nega barça atributlar, jumladan röyxatlar va boşqa obyektlar ham, `__init__` ga tegişli
:::

## Nega bu muhim

Obyekt atributlarining istalgan paytdagi qiymatlari - uning **holati** (state), masalan 38 ta böş örni bor avtobus. Dasturlar asosan holatni töğri özgartiriş haqida, yaxşi loyihalangan metodlar esa har bir özgarişni tekşiradigan, obyektga kiradigan "rasmiy eşiklar".

## Holat: obyekt hozir nimani biladi

Har bir obyekt `__init__` da qandaydir holatdan boşlanadi, metodlar esa uni yangi holatlarga ötkazadi:

```python
class PhoneBattery:
    def __init__(self):
        self.percent = 100

    def use(self, minutes):
        self.percent = max(0, self.percent - minutes // 6)   # har 6 daqiqada 1%

    def charge(self, minutes):
        self.percent = min(100, self.percent + minutes // 2) # har 2 daqiqada 1%

battery = PhoneBattery()
battery.use(300)          # beş soat video
battery.charge(40)
print(battery.percent)
battery.use(600)
print(battery.percent)
```

```text
70
0
```

`max(0, ...)` va `min(100, ...)` foizni 0 va 100 orasida saqlaydi. Qoida **bitta joyda**, metodlar içida yaşaydi.

## Metodlarning ikki turi: sörovlar va buyruqlar

| Turi | Nima qiladi | Misollar |
|---|---|---|
| **sörov** (query) | holatni öqiydi va javob qaytaradi | `is_empty()`, `total()` |
| **buyruq** (command) | holatni özgartiradi, odatda `None` qaytaradi | `deposit()`, `reset()` |

Pythonning köp örnatilgan vositalari şu qoidaga amal qiladi (`pop()` - ataylab qilingan istisno: u elementni olib taşlaydi *va* qaytaradi). `sorted(items)` - yangi röyxat qaytaradigan sörov, `items.sort()` esa röyxatni özgartirib, `None` qaytaradigan buyruq. Ularni alohida saqlaş kodni oldindan aytib böladigan qiladi: sörovni ikki marta çaqiriş bir xil javob beradi va heç qanday qöşimça taʼsirga ega emas.

## Özgarişlarni tekşiriş va holatni izçil saqlaş

Metod - notöğri kiritişni `raise ValueError(...)` bilan rad etiş joyi. Biror narsani özgartirişdan **oldin** tekşiring, şunda muvaffaqiyatsiz çaqiriş obyektga tegmaydi.

**Invariant** - obyekt uçun har doim töğri bölişi kerak bölgan qoida, masalan "yöloviçilar örinlardan köp bölmaydi". `__init__` uni boşida töğri qiladi, har bir metod esa uni töğri saqlaşi kerak. Eng oson yöl - **bir faktni ikki marta saqlamaslik**. Agar avtobus ham `passengers` röyxatini, ham `free` hisoblagiçini saqlasa, bitta unutilgan `self.free -= 1` ularni bir-biriga zid qilib qöyadi. Yöloviçilarni bir marta saqlang, qolganini hisoblang:

```python
class Bus:
    def __init__(self, seats):
        self.seats = seats
        self.passengers = []

    def free_seats(self):
        return self.seats - len(self.passengers)

    def book(self, passenger):
        if passenger in self.passengers:
            raise ValueError(f"{passenger} allaqaçon örin olgan")
        if self.free_seats() == 0:
            raise ValueError("Avtobus töla")
        self.passengers.append(passenger)

bus = Bus(2)
for name in ["Aziza", "Farrux", "Aziza", "Bekzod"]:
    try:
        bus.book(name)
        print(f"{name} bron qilindi, böş örinlar: {bus.free_seats()}")
    except ValueError as error:
        print("Rad etildi:", error)
print(bus.passengers)
```

```text
Aziza bron qilindi, böş örinlar: 1
Farrux bron qilindi, böş örinlar: 0
Rad etildi: Aziza allaqaçon örin olgan
Rad etildi: Avtobus töla
['Aziza', 'Farrux']
```

`free_seats()` yöloviçilar röyxatiga zid bölişi mumkin emas, çunki u öşandan hisoblanadi. Eʼtibor bering, `book()` uni `self.free_seats()` deb çaqiradi: metod içida xuddi şu obyektning boşqa metodlariga `self` orqali murojaat qilasiz, şunda mantiq bir marta yoziladi va qayta işlatiladi. Ikkala qoida ham yöloviçi qöşadigan yagona metodda tekşiriladi va rad etilgan çaqirişlar heç narsani özgartirmaydi.

::: warning Töğridan-töğri özgarişlar baribir qoidalarni aylanib ötadi
`bus.passengers.append("Ortiqça")` ni heç narsa töxtatmaydi. Metodlar obyektni faqat hamma ulardan foydalansagina himoya qiladi; bunday özgarişlarni qanday himoya qiliş *Xossalar va inkapsulyatsiya* darsida körsatiladi.
:::

## Barça atributlarni `__init__` da yarating

Python istalgan metoddan atribut qöşişga ruxsat beradi, bu esa xatolarga olib keladi:

```py
class Order:
    def __init__(self, customer):
        self.customer = customer

    def ship(self, tracking_code):
        self.tracking_code = tracking_code    # faqat ship() işlaganda yaratiladi

order = Order("Dilnoza")
print(order.tracking_code)                    # hali jönatilmagan
```

```text
AttributeError: 'Order' object has no attribute 'tracking_code'
```

Atribut mavjudligi oldin qaysi metodlar işlaganiga boğliq böladi. **Tuzatiş:** har bir atributni `__init__` da yarating, haqiqiy qiymat hali bölmasa `None`, `0` yoki böş röyxatdan foydalaning: `self.tracking_code = None`. Şunda `status()` şunçaki `if self.tracking_code is None: return "kutilmoqda"` ni tekşira oladi.

## Röyxatlar va boşqa obyektlarni saqlaydigan obyektlar

Atribut obyekt işlatilgan sari ösadigan röyxat yoki öz klassingizning **boşqa obyekti** bölişi mumkin. Buyurtmada qatorlar bor, har bir qatorda esa mahsulot:

```python
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

class OrderLine:
    def __init__(self, product, quantity):
        self.product = product        # Product obyektini saqlaydigan atribut
        self.quantity = quantity

    def subtotal(self):
        return self.product.price * self.quantity

lines = [OrderLine(Product("Kök çoy", 15000), 2),      # obyektlar röyxati
         OrderLine(Product("Somsa", 8000), 5)]
for line in lines:
    print(f"{line.product.name:<10} x{line.quantity}  {line.subtotal():>6,}")
```

```text
Kök çoy    x2  30,000
Somsa      x5  40,000
```

`line.product.name` ni çapdan önga öqing: `OrderLine`, uning `Product` i va öşa mahsulotning nomi. Bu dizayn keyinroq *Kompozitsiya yoki vorislik?* darsida örganiladi.

## Özingiz sinab köring

Mana yuqoridagi avtobus. `cancel(passenger)` metodini qöşing va `free_seats()` töğri qolişini tekşiring.

<ClientOnly><PythonPlayground :code='"class Bus:\n    def __init__(self, seats):\n        self.seats = seats\n        self.passengers = []\n\n    def free_seats(self):\n        return self.seats - len(self.passengers)\n\n    def book(self, passenger):\n        if self.free_seats() == 0:\n            raise ValueError(\"Avtobus töla\")\n        self.passengers.append(passenger)\n\nbus = Bus(3)\nbus.book(\"Aziza\")\nbus.book(\"Bekzod\")\nprint(bus.passengers, bus.free_seats())"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Boşqa metodni çaqirişda `self.` ni unutiş

```py
class GradeBook:
    def __init__(self):
        self.scores = [90, 80]

    def average(self):
        return sum(self.scores) / len(self.scores)

    def report(self):
        return f"Örtaça: {average()}"

print(GradeBook().report())
```

```text
NameError: name 'average' is not defined. Did you mean: 'self.average'?
```

Metodlar global funksiyalar emas. Klass içida ularga obyekt orqali murojaat qiling: `self.average()`.

### 2. Buyruq metodining natijasidan foydalaniş

```py
class TodoList:
    def __init__(self):
        self.tasks = []

    def add(self, task):
        self.tasks.append(task)

todo = TodoList().add("non oliş")
print(todo.tasks)
```

```text
AttributeError: 'NoneType' object has no attribute 'tasks'
```

`add()` `None` qaytaradi, şuning uçun `todo` - `None`. **Tuzatiş:** `todo = TodoList()`, keyin alohida qatorda `todo.add("non oliş")`.

### 3. Metod va atributga bir xil nom beriş

```py
class Account:
    def __init__(self, balance):
        self.balance = balance

    def balance(self):
        return self.balance

acc = Account(5000)
print(acc.balance())
```

```text
TypeError: 'int' object is not callable
```

`self.balance` atributi metodni yaşiradi, şuning uçun `acc.balance` - `5000` soni. **Tuzatiş:** turli nomlar işlating.

## Maşqlar

### 1. Sanoq hisoblagiçi <Difficulty level="1" />

Buxorodagi muzey tomoşabinlarini sanaş uçun `count` atributli hamda `click()` (bitta qöşadi) va `undo()` (bitta ayiradi, noldan pastga tuşmaydi) metodli `TallyCounter` klassini yozing. 5 marta bosing, ikki marta bekor qiling va sanoqni çop eting.

::: details Yeçim
```python
class TallyCounter:
    def __init__(self):
        self.count = 0

    def click(self):
        self.count += 1

    def undo(self):
        if self.count > 0:
            self.count -= 1

counter = TallyCounter()
for _ in range(5):
    counter.click()
counter.undo()
counter.undo()
print(counter.count)
```

```text
3
```
:::

### 2. Harorat jurnali <Difficulty level="1" />

`TemperatureLog` klassini yozing. `add(celsius)` ölçovni saqlaydi va -60 dan 60 gaça oraliqdan taşqarida `ValueError(f"Real bölmagan harorat: {celsius}")` çaqiradi. `average()` ölçovlar bölmasa `None` qaytaradi. 12.5, 18.0, 9.5 va 99 ni qöşing (99 uçun `Ötkazib yuborildi:` va xatoni çop eting), keyin 1 xonagaça yuvarlangan örtaçani çop eting.

::: details Yeçim
```python
class TemperatureLog:
    def __init__(self):
        self.readings = []

    def add(self, celsius):
        if not -60 <= celsius <= 60:
            raise ValueError(f"Real bölmagan harorat: {celsius}")
        self.readings.append(celsius)

    def average(self):
        if not self.readings:
            return None
        return sum(self.readings) / len(self.readings)

log = TemperatureLog()
for value in [12.5, 18.0, 9.5, 99]:
    try:
        log.add(value)
    except ValueError as error:
        print("Ötkazib yuborildi:", error)

print(round(log.average(), 1))
```

```text
Ötkazib yuborildi: Real bölmagan harorat: 99
13.3
```
:::

### 3. Avtoturargoh <Difficulty level="2" />

`park(plate)`, `leave(plate)` va hisoblanadigan `free_spaces()` li `ParkingLot(spaces)` klassini yozing, şunda quyidagi kod pastdagi natijani çop etadi:

```py
lot = ParkingLot(2)
for plate in ["01A123BC", "10B777AA", "30C555DD"]:
    try:
        lot.park(plate)
        print(f"{plate} turargohga qöyildi, böş: {lot.free_spaces()}")
    except ValueError as error:
        print("Rad etildi:", error)

lot.leave("01A123BC")
try:
    lot.leave("01A123BC")
except ValueError as error:
    print("Rad etildi:", error)
```

```text
01A123BC turargohga qöyildi, böş: 1
10B777AA turargohga qöyildi, böş: 0
Rad etildi: Turargoh töla
Rad etildi: 01A123BC turargohda yöq
```

::: details Yeçim
```python
class ParkingLot:
    def __init__(self, spaces):
        self.spaces = spaces
        self.cars = []

    def free_spaces(self):
        return self.spaces - len(self.cars)

    def park(self, plate):
        if self.free_spaces() == 0:
            raise ValueError("Turargoh töla")
        self.cars.append(plate)

    def leave(self, plate):
        if plate not in self.cars:
            raise ValueError(f"{plate} turargohda yöq")
        self.cars.remove(plate)

lot = ParkingLot(2)
for plate in ["01A123BC", "10B777AA", "30C555DD"]:
    try:
        lot.park(plate)
        print(f"{plate} turargohga qöyildi, böş: {lot.free_spaces()}")
    except ValueError as error:
        print("Rad etildi:", error)

lot.leave("01A123BC")
try:
    lot.leave("01A123BC")
except ValueError as error:
    print("Rad etildi:", error)
```
:::

### 4. Klass loyihalang: sport zali abonementi <Difficulty level="2" />

Quyidagi tavsif asosida `Membership` klassini loyihalang:

> Sport zali abonementi bitta aʼzoga tegişli va unda taşriflar soni bor (standart 12). `check_in()` bitta taşrifni işlatadi va taşrif qolmaganda `ValueError` çaqiradi (`"Farrux: taşriflar qolmadi"`). `buy_visits(pack)` taşrif qöşadi, lekin faqat 4, 8 yoki 12 talik paketlarda (aks holda `ValueError("Paketlar 4, 8 yoki 12 taşrifdan iborat")`). `status()` `Farrux: 4 ta qoldi, 1 ta işlatildi` kabi qator qaytaradi.

U quyidagi kod bilan işlaşi kerak:

```py
card = Membership("Farrux", visits=1)
card.check_in()
try:
    card.check_in()
except ValueError as error:
    print("Rad etildi:", error)
try:
    card.buy_visits(5)
except ValueError as error:
    print("Rad etildi:", error)
card.buy_visits(4)
print(card.status())
```

```text
Rad etildi: Farrux: taşriflar qolmadi
Rad etildi: Paketlar 4, 8 yoki 12 taşrifdan iborat
Farrux: 4 ta qoldi, 1 ta işlatildi
```

::: details Yeçim
```python
class Membership:
    def __init__(self, member, visits=12):
        self.member = member
        self.visits_left = visits
        self.check_ins = 0

    def check_in(self):
        if self.visits_left == 0:
            raise ValueError(f"{self.member}: taşriflar qolmadi")
        self.visits_left -= 1
        self.check_ins += 1

    def buy_visits(self, pack):
        if pack not in (4, 8, 12):
            raise ValueError("Paketlar 4, 8 yoki 12 taşrifdan iborat")
        self.visits_left += pack

    def status(self):
        return f"{self.member}: {self.visits_left} ta qoldi, {self.check_ins} ta işlatildi"

card = Membership("Farrux", visits=1)
card.check_in()
try:
    card.check_in()
except ValueError as error:
    print("Rad etildi:", error)
try:
    card.buy_visits(5)
except ValueError as error:
    print("Rad etildi:", error)
card.buy_visits(4)
print(card.status())
```
:::

### 5. Qöşiqlar röyxati <Difficulty level="3" />

`Song` klassini (`title`, `seconds`) va böş boşlanadigan `Song` obyektlari röyxatini saqlaydigan `Playlist` klassini yozing. `Playlist` ga `seconds <= 0` bölganda `ValueError(f"{song.title} uzunligi notöğri")` çaqiradigan `add(song)`; barça qöşiqlarning butun daqiqalarini qaytaradigan `total_minutes()`; eng uzun qöşiq nomini yoki böş röyxat uçun `None` qaytaradigan `longest()` kerak. Lazgi (245 s), Andijon polkasi (190 s), Ipak yöli (312 s) va Glitch (0 s) ni qöşing, notöğrisi uçun `Ötkazib yuborildi:` va xatoni çop eting. Qöşiqlar soni, jami daqiqalar va eng uzun nomni bitta qatorda, keyin böş röyxatning `longest()` ini çop eting.

::: details Yeçim
```python
class Song:
    def __init__(self, title, seconds):
        self.title = title
        self.seconds = seconds

class Playlist:
    def __init__(self):
        self.songs = []

    def add(self, song):
        if song.seconds <= 0:
            raise ValueError(f"{song.title} uzunligi notöğri")
        self.songs.append(song)

    def total_minutes(self):
        return sum(song.seconds for song in self.songs) // 60

    def longest(self):
        if not self.songs:
            return None
        return max(self.songs, key=lambda song: song.seconds).title

trip = Playlist()
for title, seconds in [("Lazgi", 245), ("Andijon polkasi", 190), ("Ipak yöli", 312), ("Glitch", 0)]:
    try:
        trip.add(Song(title, seconds))
    except ValueError as error:
        print("Ötkazib yuborildi:", error)
print(len(trip.songs), trip.total_minutes(), trip.longest())
print(Playlist().longest())
```

```text
Ötkazib yuborildi: Glitch uzunligi notöğri
3 12 Ipak yöli
None
```
:::

## Xulosa

- Obyektning **holati** - uning atributlarining joriy qiymatlari. Metodlar uni bir yaroqli holatdan boşqasiga ötkazadi.
- **Sörov** metodlari maʼlumot qaytaradi va heç narsani özgartirmaydi. **Buyruq** metodlari holatni özgartiradi va odatda `None` qaytaradi.
- Biror narsani özgartirişdan **oldin** tekşiring. Har bir faktni bir marta saqlab, qolganini `self` orqali çaqiriladigan metodlar bilan hisoblab, **invariantlarni** töğri saqlang.
- Har bir atributni `__init__` da yarating. Atributlar röyxatlar va boşqa obyektlarni saqlay oladi.

## Qöşimça manbalar

- [Python Tutorial - Method Objects](https://docs.python.org/3/tutorial/classes.html#method-objects)
- [Python Tutorial - Random Remarks on classes](https://docs.python.org/3/tutorial/classes.html#random-remarks)
- [Built-in exceptions - ValueError](https://docs.python.org/3/library/exceptions.html#ValueError)
