---
title: Polimorfizm, duck typing va abstrakt klasslar
description: "Köp turdagi obyektlar bilan işlaydigan kod yozing: umumiy metod nomlari orqali polimorfizm, duck typing, hasattr va EAFP hamda abc.ABC va @abstractmethod bilan abstrakt asosiy klasslar."
---

# Polimorfizm, duck typing va abstrakt klasslar

![Rasm: Polimorfizm, duck typing va abstrakt klasslar](/images/topics-webp-uzb/polymorphism-and-abcs.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Polimorfizm** nima: bitta metod nomi, köp xatti-harakat, hammasi uçun bitta sikl
- **Duck typing**: nega Pythonni obyekt nima ekani emas, nima qila olişi qiziqtiradi
- Imkoniyatlarni `hasattr()` yoki EAFP (`try`/`except`) bilan qanday tekşiriş
- **Abstrakt asosiy klasslar** (`abc.ABC`, `@abstractmethod`) bola klasslarni zarur metodlarni yozişga qanday majburlaydi
:::

## Nega bu muhim

Toşkentdagi internet-dökon karta, naqd pul va mobil hamyonni qabul qiladi. Uning tölov qismi har bir yangi tölov usuli bilan ösib boradigan `if kind == "card": ... elif ...` zanjiri bölmasligi kerak. Polimorfizm tölov qismiga `method.pay(amount)` deyiş, har bir obyektga esa **qanday** tölaşni özi hal qiliş imkonini beradi. Yangi tölov usuli - bitta yangi klass, abstrakt klasslar esa unda zarur metodlar borligini kafolatlaydi.

## Bitta nom, köp xatti-harakat

**Polimorfizm** (polymorphism) "köp şakl" degani: turli klasslar bir xil nomli metodni har biri öz usulida taʼminlaydi:

```python
class Cat:
    def speak(self):
        return "Miyov"

class Dog:
    def speak(self):
        return "Vov"

for animal in [Cat(), Dog()]:
    print(animal.speak())

print(2 + 3, "non" + "voy", [1] + [2])
```

```text
Miyov
Vov
5 nonvoy [1, 2]
```

Sikl faqat `speak()` ni çaqiradi; klasslarning hatto umumiy otasi ham yöq. `+` ham polimorf: har bir tur öz `__add__` ini aniqlaydi (*Operatorlar va konteynerlar* darsiga qarang).

## Duck typing

"Agar u ördakdek yursa va ördakdek ğaqillasa, demak u ördak." Python metodni çaqirişdan oldin obyektning klassini tekşirmaydi: kerakli metodi bor har qanday obyekt işlaydi. Örnatilgan funksiyalar ham şunday: `len()` `__len__` i bor istalgan narsani qabul qiladi:

```python
class Field:
    """Dala: şakl emas, lekin uning yuzasi bor."""
    def __init__(self, hectares):
        self.hectares = hectares

    def area(self):
        return self.hectares * 10_000   # kvadrat metr


class Playlist:
    def __init__(self, songs):
        self.songs = songs

    def __len__(self):
        return len(self.songs)


print(Field(0.5).area())
for thing in ["salom", [1, 2, 3], Playlist(["Yalla", "Sevara"])]:
    print(type(thing).__name__, len(thing))
```

```text
5000.0
str 5
list 3
Playlist 2
```

`.area()` ni çaqiradigan har qanday kod umumiy asosiy klassiz `Field` ni qabul qiladi. `len()` da ham "ruxsat etilgan" turlar röyxati yöq.

## Imkoniyatlarni tekşiriş: `hasattr` va EAFP

Obyektda metod bölmasligi mumkin bölganda **sakraşdan oldin qaraşingiz** mumkin: `if hasattr(doc, "export"):`. Yoki **EAFP** ("ruxsat söragandan köra keçirim söraş osonroq") dan foydalaning: sinab köring va xatoni qayta işlang:

```python
class PdfReport:
    def export(self):
        return "report.pdf"

class Draft:
    pass

for doc in [PdfReport(), Draft()]:
    try:
        result = doc.export()
    except AttributeError:
        print(f"{type(doc).__name__} ni eksport qilib bölmaydi")
    else:
        print("Eksport qilindi", result)
```

```text
Eksport qilindi report.pdf
Draft ni eksport qilib bölmaydi
```

EAFP - keng tarqalganroq Python uslubi. `try` ni faqat yöq bölişi mumkin bölgan bitta çaqiriş atrofida saqlang, aks holda boşqa `AttributeError` xatosi "eksport qilib bölmaydi" deb xabar qilinadi.

## Duck typing hal qilmaydigan muammo

Duck typing **keç** xato beradi: yöq metod faqat u çaqirilganda topiladi:

```py
class TelegramSender:
    def send(self, user, text):
        return f"{user} ga Telegram: {text}"

class EmailSender:
    def sned(self, user, text):          # xato yozilgan, heç kim payqamadi
        return f"{user} ga Email: {text}"

for sender in [TelegramSender(), EmailSender()]:
    print(sender.send("Aziza", "Buyurtmangiz jönatildi"))
```

```text
Aziza ga Telegram: Buyurtmangiz jönatildi
AttributeError: 'EmailSender' object has no attribute 'send'
```

Birinçi xabar yiqilişdan oldin yuborib bölindi. Abstrakt asosiy klasslar buni obyekt **yaratilganda** uşlaydi.

## Abstrakt asosiy klasslar

**Abstrakt asosiy klass** (abstract base class, ABC) har bir bola klassda bölişi kerak bölgan metodlarni sanaydi. Faqat har bir abstrakt metodni yozgan bola klasslargina obyekt yarata oladi:

```python
from abc import ABC, abstractmethod


class NotificationSender(ABC):
    @abstractmethod
    def send(self, user, text):
        """Matnni foydalanuvçiga yetkazadi va holat satrini qaytaradi."""

    def send_many(self, users, text):          # oddiy, umumiy metod
        return [self.send(user, text) for user in users]


class SmsSender(NotificationSender):
    def send(self, user, text):
        return f"{user} ga SMS: {text[:20]}"


class EmailSender(NotificationSender):
    def sned(self, user, text):                # xato yozilgan
        return f"{user} ga Email: {text}"


print(SmsSender().send_many(["Aziza", "Bekzod"], "Buyurtma jönatildi"))

for cls in [NotificationSender, EmailSender]:
    try:
        cls()
    except TypeError as error:
        print(error)
```

```text
['Aziza ga SMS: Buyurtma jönatildi', 'Bekzod ga SMS: Buyurtma jönatildi']
Can't instantiate abstract class NotificationSender without an implementation for abstract method 'send'
Can't instantiate abstract class EmailSender without an implementation for abstract method 'send'
```

`ABC` dan meros oliş klassni abstrakt qiliş imkonini beradi, `@abstractmethod` esa `send` ni **zarur** deb belgilaydi (uning tanasi şunçaki docstring yoki `...`). `send_many` - `send` mavjudligiga tayana oladigan oddiy umumiy metod. `EmailSender` dagi xato endi yaratiş paytida uşlanadi va xabar yöq metodni nomlaydi.

## Batafsil misol: ABC bilan tölov usullari

Mana dökonning if-zanjirisiz tölov qismi. Abstrakt klass `pay()` ni talab qiladi va umumiy `receipt()` ni taʼminlaydi:

```python
from abc import ABC, abstractmethod


class PaymentError(Exception):
    pass


class PaymentMethod(ABC):
    name = "tölov"

    @abstractmethod
    def pay(self, amount):
        """amount söm oladi yoki PaymentError çaqiradi."""

    def receipt(self, amount):
        self.pay(amount)
        return f"{amount:>9,} söm {self.name} orqali tölandi"


class Card(PaymentMethod):
    name = "karta"

    def pay(self, amount):
        if amount > 5_000_000:
            raise PaymentError("Karta limiti 5,000,000 söm")


class Wallet(PaymentMethod):
    name = "hamyon"

    def __init__(self, balance):
        self.balance = balance

    def pay(self, amount):
        if amount > self.balance:
            raise PaymentError(f"Hamyonda faqat {self.balance:,} söm bor")
        self.balance -= amount


orders = [(Card(), 350_000), (Wallet(200_000), 150_000), (Wallet(10_000), 90_000), (Card(), 7_000_000)]
for method, amount in orders:
    try:
        print(method.receipt(amount))
    except PaymentError as error:
        print(f"{amount:>9,} söm BAJARILMADI: {error}")
```

```text
  350,000 söm karta orqali tölandi
  150,000 söm hamyon orqali tölandi
   90,000 söm BAJARILMADI: Hamyonda faqat 10,000 söm bor
7,000,000 söm BAJARILMADI: Karta limiti 5,000,000 söm
```

Siklda tölov turi böyiça `if` yöq, `receipt()` esa barça tölov usullari, jumladan keyingilari uçun ham bir marta yozilgan.

## Özingiz sinab köring

`send()` metodli `TelegramSender` klassini qöşing, keyin `TypeError` ni köriş uçun `send()` ni unutgan bola klass yaratib köring.

<ClientOnly><PythonPlayground :code='"from abc import ABC, abstractmethod\n\n\nclass Sender(ABC):\n    @abstractmethod\n    def send(self, user, text):\n        pass\n\n    def broadcast(self, users, text):\n        for user in users:\n            print(self.send(user, text))\n\n\nclass EmailSender(Sender):\n    def send(self, user, text):\n        return f\"{user} ga Email: {text}\"\n\n\nclass SmsSender(Sender):\n    def send(self, user, text):\n        return f\"{user} ga SMS: {text[:20]}\"\n\n\nfor sender in [EmailSender(), SmsSender()]:\n    sender.broadcast([\"Aziza\", \"Bekzod\"], \"Kutubxona bugun 18:00 da yopiladi\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `ABC` dan meros olişni unutiş

```python
from abc import abstractmethod

class Exporter:                 # ABC yöq
    @abstractmethod
    def convert(self, rows):
        pass

e = Exporter()                  # heç qanday xato yöq
print(e.convert([]))
```

```text
None
```

Ota klass sifatida `ABC` bölmasa, `@abstractmethod` jimgina eʼtiborsiz qoldiriladi. **Tuzatiş:** `class Exporter(ABC):`.

### 2. Oila içida turli metod signaturalari

```py
class Card:
    def pay(self, amount):
        return f"karta {amount}"

class Wallet:
    def pay(self, amount, phone):          # qöşimça argument talab qiladi
        return f"hamyon {amount} {phone}"

for method in [Card(), Wallet()]:
    print(method.pay(100_000))
```

```text
karta 100000
TypeError: Wallet.pay() missing 1 required positional argument: 'phone'
```

Har bir klass **bir xil argumentlarni** qabul qilişi kerak. **Tuzatiş:** `phone` kabi obyektga xos maʼlumotni `__init__` ga qöying.

### 3. Polimorfizm örniga turlarni tekşiriş

```python
class Circle:
    pass

class Square:
    pass

class Triangle:
    pass

def describe(shape):                       # Yomon: if-zanjir qaytdi
    if isinstance(shape, Circle):
        return "dumaloq"
    elif isinstance(shape, Square):
        return "tört burçak"

for shape in [Circle(), Square(), Triangle()]:
    print(describe(shape))
```

```text
dumaloq
tört burçak
None
```

Yangi `Triangle` jimgina `None` oladi. **Tuzatiş:** har bir klassga `describe()` metodini bering va uni çaqiring. `isinstance` ni nima qilişni hal qiliş uçun emas, tekşiriş uçun işlating.

## Maşqlar

### 1. Gapiradigan qurilmalar <Difficulty level="1" />

Har biri turli satr qaytaradigan `sound()` metodli `Phone`, `Radio` va `Doorbell` klasslarini yarating. Har biridan bittadan röyxatga qöying va siklda har bir tovuşni çop eting.

::: details Yeçim
```python
class Phone:
    def sound(self):
        return "Jiring-jiring"

class Radio:
    def sound(self):
        return "Toşkentdan yangiliklar efirda"

class Doorbell:
    def sound(self):
        return "Ding-dong"

for device in [Phone(), Radio(), Doorbell()]:
    print(f"{type(device).__name__}: {device.sound()}")
```

```text
Phone: Jiring-jiring
Radio: Toşkentdan yangiliklar efirda
Doorbell: Ding-dong
```
:::

### 2. ABC bilan şakllar oilasi <Difficulty level="1" />

Abstrakt `area()` va oddiy `summary()` metodli abstrakt `Shape` ni yozing. `Rectangle` va `Circle` ni yarating. 3 x 4 töğri törtburçak va radiusi 1 bölgan aylana uçun xulosani çop eting.

::: details Yeçim
```python
import math
from abc import ABC, abstractmethod


class Shape(ABC):
    @abstractmethod
    def area(self):
        ...

    def summary(self):
        return f"{type(self).__name__}: yuzasi {self.area():.2f}"


class Rectangle(Shape):
    def __init__(self, w, h):
        self.w, self.h = w, h

    def area(self):
        return self.w * self.h


class Circle(Shape):
    def __init__(self, r):
        self.r = r

    def area(self):
        return math.pi * self.r ** 2


for shape in [Rectangle(3, 4), Circle(1)]:
    print(shape.summary())
```

```text
Rectangle: yuzasi 12.00
Circle: yuzasi 3.14
```
:::

### 3. Uzunligi bor har qanday narsa <Difficulty level="2" />

Turlarni tekşirmasdan, `len()` i eng katta elementni qaytaradigan `longest(items)` ni yozing. Uni `"Samarqand"`, `[1, 2, 3]` va 12 kişini saqlaydigan, `__len__` hamda `__repr__` li öz `Queue` klassingiz bilan sinab köring.

::: details Yeçim
```python
class Queue:
    def __init__(self, people):
        self.people = people

    def __len__(self):
        return len(self.people)

    def __repr__(self):
        return f"Queue({len(self)} kişi)"


def longest(items):
    return max(items, key=len)


print(longest(["Samarqand", [1, 2, 3], Queue(["Aziza"] * 12)]))
print(longest(["Samarqand", [1, 2, 3]]))
```

```text
Queue(12 kişi)
Samarqand
```
:::

### 4. Tavsifdan loyihalaş: yetkaziş narxi <Difficulty level="2" />

Yetkaziş kompaniyasi **Standard** (15,000 söm va har kg uçun 2,000 söm), **Express** (Standard dan ikki barobar) va **Pickup point** (qatʼiy 10,000 söm) xizmatlarini taklif qiladi. `cost(weight_kg)` ni talab qiladigan va umumiy `quote(weight_kg)` metodini bölişadigan ABC loyihalang. 3 kg lik jönatma uçun narxlarni çop eting, keyin `cost()` siz `Drone` xizmati `TypeError` çaqirişini körsating.

::: details Yeçim
```python
from abc import ABC, abstractmethod


class DeliveryService(ABC):
    @abstractmethod
    def cost(self, weight_kg):
        ...

    def quote(self, weight_kg):
        return f"{type(self).__name__:<12} {weight_kg} kg: {self.cost(weight_kg):>7,} söm"


class Standard(DeliveryService):
    def cost(self, weight_kg):
        return 15_000 + 2_000 * weight_kg


class Express(Standard):
    def cost(self, weight_kg):
        return super().cost(weight_kg) * 2


class PickupPoint(DeliveryService):
    def cost(self, weight_kg):
        return 10_000


for service in [Standard(), Express(), PickupPoint()]:
    print(service.quote(3))


class Drone(DeliveryService):
    pass

try:
    Drone()
except TypeError:
    print("Drone da cost() yöq")
```

```text
Standard     3 kg:  21,000 söm
Express      3 kg:  42,000 söm
PickupPoint  3 kg:  10,000 söm
Drone da cost() yöq
```

`Express` `Standard` dan meros oladi, çunki uning narxi standart narx ustiga quriladi.
:::

### 5. Plagin uslubidagi matn filtrlari <Difficulty level="3" />

Abstrakt `apply(text)` li abstrakt `TextFilter` ni hamda `StripSpaces` (takroriy böşliqlarni bittaga qisqartiradi), `Censor` (taqiqlangan sözlarni harf registrini eʼtiborsiz qoldirib `***` ga almaştiradi) va `Capitalize` (birinçi harfni katta qiladi) bola klasslarini yarating. Ularni tartib bilan qöllab, har bir qadamni çop etadigan `run_pipeline(text, filters)` ni yozing. `"  bu  yomon ob-havo  toşkentda  "` da `Censor(["YOMON"])` bilan sinab köring.

::: details Yeçim
```python
from abc import ABC, abstractmethod


class TextFilter(ABC):
    @abstractmethod
    def apply(self, text):
        ...


class StripSpaces(TextFilter):
    def apply(self, text):
        return " ".join(text.split())


class Censor(TextFilter):
    def __init__(self, banned):
        self.banned = {w.lower() for w in banned}

    def apply(self, text):
        return " ".join("***" if w.lower() in self.banned else w for w in text.split(" "))


class Capitalize(TextFilter):
    def apply(self, text):
        return text[:1].upper() + text[1:]


def run_pipeline(text, filters):
    for f in filters:
        text = f.apply(text)
        print(f"{type(f).__name__:<12} -> {text!r}")
    return text


run_pipeline("  bu  yomon ob-havo  toşkentda  ", [StripSpaces(), Censor(["YOMON"]), Capitalize()])
```

```text
StripSpaces  -> 'bu yomon ob-havo toşkentda'
Censor       -> 'bu *** ob-havo toşkentda'
Capitalize   -> 'Bu *** ob-havo toşkentda'
```

Avval böşliqlar tozalanadi, şuning uçun `Censor` bitta böşliq böyiça böla oladi.
:::

## Xulosa

- **Polimorfizm**: klasslar bitta metod nomini bölişadi, şuning uçun bitta sikl yoki funksiya ularning hammasi bilan işlaydi.
- Umumiy metodli obyektlar `if kind == ...` zanjirlarining örnini bosadi, şuning uçun yangi tur qöşiş - bitta yangi klass.
- **Duck typing**: Pythonni obyektning klassi emas, unda metod bor-yöqligi qiziqtiradi. `len()` va `+` şunday işlaydi.
- `hasattr()` bilan tekşiring yoki kiçik `try` bloki bilan EAFP dan foydalaning.
- `abc.ABC` va `@abstractmethod` zarur metodlarni aniqlaydi. Yöq metod obyekt yaratilganda `TypeError` beradi.

## Qöşimça manbalar

- [`abc` module: Abstract Base Classes](https://docs.python.org/3/library/abc.html)
- [`collections.abc` module](https://docs.python.org/3/library/collections.abc.html)
- [Glossary: duck typing and EAFP](https://docs.python.org/3/glossary.html#term-duck-typing)
