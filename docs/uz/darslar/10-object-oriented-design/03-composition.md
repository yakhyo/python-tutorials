---
title: Kompozitsiya yoki vorislik?
description: "Obyektlarni kiçikroq qismlardan quring: has-a munosabatlari, vakolat beriş, möʼrt vorislikni kompozitsiyaga qayta tuziş, oddiy boğliqlikni kiritiş va kompozitsiya hamda vorislik orasida tanlaş böyiça amaliy qöllanma."
---

# Kompozitsiya yoki vorislik?

![Rasm: Kompozitsiya yoki vorislik?](/images/topics-webp-uzb/composition.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **has-a** ("unda bor", kompozitsiya) va **is-a** ("bu - bu", vorislik) orasidagi farq
- Obyektlarni boşqa obyektlardan qanday quriş va çaqirişlarni ularga **topşiriş** (delegation)
- Nega "vorislikdan köra kompozitsiyani afzal köring" keng tarqalgan maslahat
- Klassni moslaşuvçan va test qiliş oson qiliş uçun unga qismlarni qanday uzatiş (**boğliqlikni kiritiş**, dependency injection)
:::

## Nega bu muhim

Maşina dvigatel emas, lekin unda dvigatel **bor**. Haqiqiy dasturlardagi köp obyektlar, xuddi haqiqiy narsalar qismlardan yasalgani kabi, boşqa obyektlardan quriladi. Vorislik - klasslar orasidagi eng qattiq boğlanish: bola ota klassning **har bir** metodini abadiy oladi. Kompozitsiya (composition) erkinroq va moslaşuvçanroq, ular orasida tanlaş esa asosiy loyihalaş könikmasi.

## has-a va is-a

"Menejer - xodim" vorislikni talab qiladi: `class Manager(Employee):`. "Maşinada dvigatel bor" esa **kompozitsiyani** talab qiladi: maşina dvigatelni atributda saqlaydi, `self.engine = engine`, va işini bajariş uçun undan foydalanadi.

## Batafsil misol: almaştiriladigan dvigatelli maşina

```python
class Engine:
    def __init__(self, horsepower, fuel="benzin"):
        self.horsepower = horsepower
        self.fuel = fuel

    def describe(self):
        return f"{self.horsepower} ot kuçi, {self.fuel}"


class ElectricMotor:
    def __init__(self, kw):
        self.kw = kw

    def describe(self):
        return f"{self.kw} kVt, elektr"


class Car:
    def __init__(self, model, engine):
        self.model = model
        self.engine = engine          # maşinada dvigatel BOR

    def spec(self):
        return f"{self.model}: {self.engine.describe()}"


cars = [Car("Cobalt", Engine(106, "metan")), Car("Spark EV", ElectricMotor(105))]
for car in cars:
    print(car.spec())
```

```text
Cobalt: 106 ot kuçi, metan
Spark EV: 105 kVt, elektr
```

Har bir klassning bitta vazifasi bor. Vorislik bilan `PetrolCar`, `MethaneCar`, `ElectricCar`... kerak bölardi. Kompozitsiya bilan esa **bitta** `Car` `describe()` i bor istalgan qism bilan işlaydi: kompozitsiya içidagi duck typing.

## Batafsil misol: qatorlardan iborat buyurtma

Buyurtma qatorlardan iborat, har bir qator esa mahsulot va miqdordan:

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
order.add(Product("Somsa", 8_000), 6)
order.add(Product("Lağmon", 38_000), 2)
print(f"{order.customer} uçun jami: {order.total:,} söm")
```

```text
Bekzod uçun jami: 124,000 söm
```

`Order.total` narxlarni özi köpaytiriş örniga har bir qatordan uning `subtotal` ini **söraydi**, bu har bir klassni sodda saqlaydi. Kitoblar va aʼzolari **bor** kutubxona ham xuddi şunday işlaydi; uni *Loyiha: Kutubxona boşqaruv tizimi* darsida quriysiz.

## Oldin va keyin: list dan meros olgan stek

**Stek** - likopçalar ustuni: siz tepaga qöşasiz (`push`) va tepadan olasiz (`pop`). Mana jozibali qisqa yöl:

```python
class Stack(list):                    # "stek — bu röyxat"mi?
    def push(self, item):
        self.append(item)


plates = Stack()
plates.push("1-likopça")
plates.push("2-likopça")
plates.insert(0, "ayyor likopça")     # barça röyxat metodlari ham birga keldi
print(plates)
```

```text
['ayyor likopça', '1-likopça', '2-likopça']
```

Klass 40 dan ortiq röyxat metodini meros oldi va ularning istalgani stek qoidasini buza oladi: röyxat bilan qila oladigan hamma narsa stek uçun maʼnoli emas. Qayta tuzişdan keyin stek yaşirin röyxatga **topşiradi** va faqat özi xohlagan amallarni uzatadi:

```python
class Stack:
    def __init__(self):
        self._items = []                  # qism

    def push(self, item):
        self._items.append(item)          # röyxatga topşiramiz

    def pop(self):
        return self._items.pop()

    def __len__(self):
        return len(self._items)           # topşiramiz


plates = Stack()
for n in range(1, 4):
    plates.push(f"{n}-likopça")
print(plates.pop(), len(plates), hasattr(plates, "insert"))
```

```text
3-likopça 2 False
```

Endi interfeysni **siz** boşqarasiz va keyinroq röyxatni heç bir çaqiruvçini özgartirmasdan almaştira olasiz. `_items` dagi pastki çiziq içki tafsilotni belgilaydi.

## Boğliqlikni kiritiş: qismlarni uzatiş

`Car` öz dvigatelini **taşqaridan** oldi. Bu **boğliqlikni kiritiş** (dependency injection): klass qismlarini özi yaratiş örniga ularni oladi:

```python
class SmsNotifier:
    def notify(self, customer, text):
        print(f"[{customer} ga SMS] {text}")


class FakeNotifier:
    """Testlaş uçun: xabarlarni yuboriş örniga eslab qoladi."""
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
        self.notifier.notify(customer, f"{len(self.orders)}-buyurtma qabul qilindi: {total:,} söm")


Shop().place_order("Aziza", 145_000)

fake = FakeNotifier()
test_shop = Shop(fake)
test_shop.place_order("Dilnoza", 10_000)
test_shop.place_order("Dilnoza", 20_000)
assert fake.sent[1] == ("Dilnoza", "2-buyurtma qabul qilindi: 20,000 söm")
print("Test ötdi:", len(fake.sent), "ta xabar yozib olindi, birortasi ham yuborilmadi")
```

```text
[Aziza ga SMS] 1-buyurtma qabul qilindi: 145,000 söm
Test ötdi: 2 ta xabar yozib olindi, birortasi ham yuborilmadi
```

Bitta `Shop` SMS, email yoki testlarda umuman heç narsa yubormasligi mumkin (11-modul). Standart qiymat oddiy qöllanişni sodda saqlaydi. Uni `notifier or SmsNotifier()` bilan emas, `is not None` bilan yozing: `or` tasodifan falsy bölib qolgan, masalan `__len__` i 0 qaytaradigan, kiritilgan soxta obyektni jimgina almaştirib yuboradi.

## Nega "vorislikdan köra kompozitsiyani afzal köring"

![Diagramma: Nega "vorislikdan köra kompozitsiyani afzal köring"](/images/companions-webp-uzb/composition-guide.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Vorislik - qattiq boğlanish: bola ota klassning har bir metodini oladi va ota klassdagi özgariş uni buzişi mumkin. Kompozitsiya - erkin boğlanish: nimani oçiq qilişni özingiz tanlaysiz, qismlarni esa almaştiriş yoki birlaştiriş, hatto dastur işlayotganda ham, mumkin. "Afzal köring" "heç qaçon meros olmang" degani emas. Faqat "har bir X - bu Y" töğri eşitilsa, Y ning **har bir** metodi X uçun maʼnoli bölsa va xatti-harakatlarni almaştiriş kerak bölmasa, meros oling. Aks holda kompozitsiyadan foydalaning.

## Özingiz sinab köring

`Robot` klassiga boşqa `Battery` bering yoki `say()` metodli `Speaker` qismini qöşing va robotdan unga topşiring.

<ClientOnly><PythonPlayground :code='"class Battery:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.charge = capacity\n\n    def use(self, amount):\n        if amount > self.charge:\n            return False\n        self.charge -= amount\n        return True\n\n\nclass Wheels:\n    def roll(self, meters):\n        return f\"{meters} m yurdi\"\n\n\nclass Robot:\n    def __init__(self, name, battery, wheels):\n        self.name = name\n        self.battery = battery\n        self.wheels = wheels\n\n    def move(self, meters):\n        if not self.battery.use(meters // 10):\n            return f\"{self.name}: batareya juda past\"\n        return f\"{self.name} {self.wheels.roll(meters)}, zaryad {self.battery.charge}\"\n\n\nbot = Robot(\"Robo-1\", Battery(50), Wheels())\nfor distance in [200, 150, 300]:\n    print(bot.move(distance))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Imkoniyat oliş uçun meros oliş

```python
class Logger:
    def clear_log_file(self):
        print("log fayli öçirildi")

class Order(Logger):             # Yomon: buyurtma logger emas
    pass

order = Order()
print(isinstance(order, Logger))
order.clear_log_file()
```

```text
True
log fayli öçirildi
```

Endi buyurtma "logger hisoblanadi" va log faylini öçira oladi. **Tuzatiş:** unga qism bering: `self.logger = Logger()`.

### 2. Qismlarning çuqur içiga kiriş

```py
class LineItem:
    def __init__(self, product, quantity):
        self.product_name = product.name     # oldin self.product edi
        self.unit_price = product.price
        self.quantity = quantity

# Yomon: çaqiruvçi eski içki tuzilişga tayangan
print(order.items[0].product.price * order.items[0].quantity)
```

```text
AttributeError: 'LineItem' object has no attribute 'product'
```

Içkariga kirgan har bir çaqiruvçi buziladi. **Tuzatiş:** obyektning özidan sörang: `order.items[0].subtotal`.

### 3. Qism hali mavjud emasligini unutiş

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

**Tuzatiş:** qismni `__init__` da majburiy qiling yoki topşirişdan oldin `None` ni tekşiring.

## Maşqlar

### 1. Kompyuter qismlari <Difficulty level="1" />

`Cpu` (cores) va `Memory` (gb) klasslarini hamda ularning har biridan bittasi **bor** `Computer` klassini yarating. `Computer` ga `"Ofis kompyuteri: 4 yadro, 8 GB RAM"` kabi satr qaytaradigan `spec()` metodini qöşing.

::: details Yeçim
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
        return f"{self.name}: {self.cpu.cores} yadro, {self.memory.gb} GB RAM"


print(Computer("Ofis kompyuteri", Cpu(4), Memory(8)).spec())
```

```text
Ofis kompyuteri: 4 yadro, 8 GB RAM
```
:::

### 2. Savatçada topşiriş <Difficulty level="1" />

Mahsulotlarni yaşirin `_items` luğatida (nom -> miqdor) saqlaydigan `Cart` klassini yozing. Luğatga topşiradigan `add(name, qty=1)`, `__len__` (turli mahsulotlar soni) va `__contains__` ni yarating. Somsa (3), çoy va yana somsa qöşing, keyin uzunlikni hamda somsa va palov savatçada bor-yöqligini çop eting.

::: details Yeçim
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
cart.add("somsa", 3)
cart.add("çoy")
cart.add("somsa")
print(len(cart), "somsa" in cart, "palov" in cart)
```

```text
2 True False
```
:::

### 3. Navbatni qayta tuziş <Difficulty level="2" />

Bankdagi navbat `class Queue(list)` sifatida yozilgan. Uni faqat `join(person)`, `next()` va `__len__` mavjud böladigan qilib, `collections.deque` qismi yordamida kompozitsiya bilan qayta yozing. `next()` odamlarga ular qöşilgan tartibda xizmat körsatadi va navbat böş bölganda `IndexError("heç kim kutmayapti")` çaqiradi. Aziza, Bekzod va Dilnoza bilan sinab köring.

::: details Yeçim
```python
from collections import deque


class Queue:
    def __init__(self):
        self._people = deque()

    def join(self, person):
        self._people.append(person)

    def next(self):
        if not self._people:
            raise IndexError("heç kim kutmayapti")
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
    print("Xato:", error)
```

```text
Aziza Bekzod 1
Xato: heç kim kutmayapti
```
:::

### 4. Tavsifdan loyihalaş: meteostansiya <Difficulty level="2" />

Samarqanddagi meteostansiyada termometr (`read()` bilan) va displey (`show(text)` bilan) **bor**. Uning `report()` metodi `"Samarqand: 31.5 C"` kabi matnni körsatadi. Stansiyani boğliqlikni kiritiş bilan loyihalang, keyin uni qatʼiy qiymatlar (31.5, keyin 29.0) qaytaradigan `FakeThermometer` va qatorlarni röyxatda saqlaydigan `RecordingDisplay` bilan sinab köring. Ikki hisobotni `assert` bilan tekşiring va `Testlar ötdi` ni çop eting.

::: details Yeçim
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
station = WeatherStation("Samarqand", FakeThermometer([31.5, 29.0]), display)
station.report()
station.report()
assert display.lines == ["Samarqand: 31.5 C", "Samarqand: 29.0 C"]
print("Testlar ötdi")
```

```text
Testlar ötdi
```

Stansiya öz qismlarini heç qaçon özi yaratmaydi, şuning uçun soxta qismlar örniga haqiqiy qurilmalarni qöyiş mumkin.
:::

### 5. Qöşimçali pitsa <Difficulty level="3" />

Pitsaning ölçami (`"S"`, `"M"`, `"L"`: 45,000 / 60,000 / 75,000 söm) va nomi hamda narxi bor istalgan miqdordagi qöşimçalari bor. `CheeseMushroomPizza` kabi bola klasslar soni haddan taşqari köpayib ketgan bölardi, şuning uçun kompozitsiyadan foydalaning: `Pizza` da ölçam va `Topping` obyektlari röyxati, `self` qaytaradigan `add_topping()`, `price` xossasi va `__str__` bor. Notöğri ölçam `ValueError` çaqiradi. Pişloq (12,000) va qöziqorinli (9,000) katta pitsani, oddiy örta pitsani va `"XL"` uçun xatoni çop eting.

::: details Yeçim
```python
class Topping:
    def __init__(self, name, price):
        self.name = name
        self.price = price


class Pizza:
    BASE_PRICES = {"S": 45_000, "M": 60_000, "L": 75_000}

    def __init__(self, size):
        if size not in self.BASE_PRICES:
            raise ValueError(f"Nomaʼlum ölçam {size!r}, S, M yoki L ni tanlang")
        self.size = size
        self.toppings = []

    def add_topping(self, topping):
        self.toppings.append(topping)
        return self

    @property
    def price(self):
        return self.BASE_PRICES[self.size] + sum(t.price for t in self.toppings)

    def __str__(self):
        names = ", ".join(t.name for t in self.toppings) or "oddiy"
        return f"{self.size} pitsa ({names}): {self.price:,} söm"


print(Pizza("L").add_topping(Topping("pişloq", 12_000)).add_topping(Topping("qöziqorin", 9_000)))
print(Pizza("M"))
try:
    Pizza("XL")
except ValueError as error:
    print("Xato:", error)
```

```text
L pitsa (pişloq, qöziqorin): 96,000 söm
M pitsa (oddiy): 60,000 söm
Xato: Nomaʼlum ölçam 'XL', S, M yoki L ni tanlang
```
:::

## Xulosa

- **Kompozitsiya**: obyekt boşqa obyektlarni atribut sifatida saqlaydi. Maşinada dvigatel **bor**.
- Faqat ota klassning har bir metodi bola uçun maʼnoli bölgan haqiqiy **is-a** munosabatlarida meros oling.
- **Topşiriş**: işni qismga uzating va faqat özingiz tanlagan narsani oçiq qiling. `list` ni öring, undan meros olmang.
- **Boğliqlikni kiritiş**: qismlarni `__init__` ga uzating, şunda ularni almaştiriş va testlarda soxta obyektlardan foydalaniş mumkin.
- Obyektlarning tuzilişiga kiriş örniga ulardan javob söring (`item.subtotal`).

## Qöşimça manbalar

- [Python Tutorial: Classes](https://docs.python.org/3/tutorial/classes.html)
- [`collections.deque`](https://docs.python.org/3/library/collections.html#collections.deque)
- [`collections.abc`: abstract base classes for containers](https://docs.python.org/3/library/collections.abc.html)
