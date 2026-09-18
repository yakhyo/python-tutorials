---
title: Enum turlari
description: "Mört sehrli satr va sonlarni enumlar bilan almaştiring: Enum aʼzolari, name va value, qiymat va nom böyiça qidiriş, auto(), IntEnum va StrEnum, alias lar va @unique, metodli enumlar, match operatorida enumlar hamda enumlarni JSON ga saqlaş."
---

# Enum turlari

![Rasm: Enum turlari](/images/topics-webp-uzb/enums.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Nega `"pending"` kabi "sehrli satrlar" sezdirmasdan xatolarga olib keladi
- `Enum` ni qanday aniqlaş, `name` va `value` dan foydalaniş, u böylab aylaniş va aʼzolarni qidiriş
- `auto()`, `IntEnum` va `StrEnum` dan qanday foydalaniş
- Enumlarga metod qöşiş, ularni `match` da işlatiş va JSON da saqlaş
:::

## Nega bu muhim

Onlayn dökon har bir buyurtma holatini `"shipped"` kabi satr sifatida saqlaydi. Keyin kimdir `"Shipped"` deb yozadi, `if status == "shipped"` sezdirmasdan `False` bölib qoladi va mijozga SMS heç qaçon bormaydi. **Enum** (sanab ötiladigan tur) - nomlangan qiymatlarning belgilangan töplami: siz `Status.SHIPPED` deb yozasiz, `Status.SHIPED` kabi imlo xatosi darhol xato beradi, ruxsat etilgan qiymatlar esa bir joyda röyxatlangan böladi.

## Sehrli satrlardan enumga

```python
from enum import Enum


class Status(Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"


order = {"id": 102, "status": "Shipped"}        # katta S harfli sehrli satr
print(order["status"] == "shipped")             # sezdirmasdan False

status = Status.SHIPPED
print(repr(status), status.name, status.value)
print(status is Status.SHIPPED, status == "shipped")

try:
    Status.SHIPED
except AttributeError as error:
    print("Darhol uşlandi:", error)
```

```text
False
<Status.SHIPPED: 'shipped'> SHIPPED shipped
True False
Darhol uşlandi: type object 'Status' has no attribute 'SHIPED'
```

`Enum` ning har bir klass atributi `.name` va `.value` ga ega **aʼzo**ga aylanadi. Har bir aʼzo faqat bitta nusxada mavjud, şuning uçun ularni `is` yoki `==` bilan taqqoslang. Aʼzo öz qiymatiga **teng emas**, şuning uçun oddiy satrlar va aʼzolar tasodifan aralaşib ketmaydi. Dastur içida aʼzolardan, fayl va formalar uçun esa faqat `.value` dan foydalaning. Oddiy aʼzolarda tartib yöq: `Status.PAID < Status.SHIPPED` `TypeError` beradi.

## Aylaniş, sanaş va alias lar

Enum böylab aniqlangan tartibda aylaniş mumkin, `len()` esa aʼzolarni sanaydi. Allaqaçon işlatilgan qiymatga ega aʼzo yangi aʼzo emas, **alias** (şu aʼzoning boşqa nomi) böladi:

```python
from enum import Enum, unique


class Size(Enum):
    SMALL = "S"
    MEDIUM = "M"
    MIDDLE = "M"        # bir xil qiymat: yangi aʼzo emas, alias
    LARGE = "L"


print(len(Size), [s.name for s in Size])
print(Size.MIDDLE, Size.MIDDLE is Size.MEDIUM)

try:
    @unique
    class Grade(Enum):
        GOOD = 4
        OK = 3
        FINE = 4
except ValueError as error:
    print("Xato:", error)
```

```text
3 ['SMALL', 'MEDIUM', 'LARGE']
Size.MEDIUM True
Xato: duplicate values found in <enum 'Grade'>: FINE -> GOOD
```

`MIDDLE` siklda sezdirmasdan yöqolib qoldi. Takroriy qiymatlar xato bölsa, `@unique` Python ga ularni rad etişni buyuradi.

## Aʼzolarni qidiriş

Kiritilgan maʼlumot oddiy satr bölib keladi. `Status("paid")` **qiymat** böyiça qidiradi (notöğri qiymat `ValueError` beradi), `Status["PAID"]` esa **nom** böyiça (`KeyError`). Odatiy tahlilçi avval kiritilgan matnni tozalaydi:

```python
from enum import Enum


class Status(Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"


def parse_status(text):
    try:
        return Status(text.strip().lower())
    except ValueError:
        allowed = ", ".join(s.value for s in Status)
        raise ValueError(f"Nomaʼlum holat {text!r}. Ruxsat etilganlar: {allowed}") from None


print(Status["PAID"])
for raw in ["  Shipped ", "shiped"]:
    try:
        print(repr(raw), "->", parse_status(raw))
    except ValueError as error:
        print(error)
```

```text
Status.PAID
'  Shipped ' -> Status.SHIPPED
Nomaʼlum holat 'shiped'. Ruxsat etilganlar: pending, paid, shipped
```

Qoida: **satrlarni dasturingiz çegarasida aʼzolarga aylantiring**, `.value` ga esa faqat natija çiqarişda qayting.

## Işlangan misol: buyurtma qoidalari uçun enum metodlari

Enum klass bölgani uçun aʼzolarda metod va xossalar bölişi mumkin, bu esa har bir tanlov haqidagi bilimni uning **yonida** saqlaydi. Jönatilgan buyurtmani bekor qilib bölmaydi, yetkazilganini esa özgartirib bölmaydi:

```python
from enum import Enum


class OrderStatus(Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

    def allowed_next(self):
        rules = {
            OrderStatus.PENDING: {OrderStatus.PAID, OrderStatus.CANCELLED},
            OrderStatus.PAID: {OrderStatus.SHIPPED, OrderStatus.CANCELLED},
            OrderStatus.SHIPPED: {OrderStatus.DELIVERED},
        }
        return rules.get(self, set())


status = OrderStatus.PENDING
for step in [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.CANCELLED, OrderStatus.DELIVERED]:
    if step in status.allowed_next():
        status = step
        print("Hozir:", status.value)
    else:
        print(f"Rad etildi: {status.value} -> {step.value}")
```

```text
Hozir: paid
Hozir: shipped
Rad etildi: shipped -> cancelled
Hozir: delivered
```

Holatga oid barça qoidalar bir joyda turadi.

## `match` operatorida enumlar

Enumlar va `match` (*match operatori* darsidan) bir-biriga tabiiy mos keladi. Har bir `case` da nuqtali nomdan foydalaning:

```python
from enum import Enum


class TrafficLight(Enum):
    RED = "qizil"
    GREEN = "yaşil"


def action(light):
    match light:
        case TrafficLight.RED:
            return "Töxtang"
        case TrafficLight.GREEN:
            return "Yuring"


for light in TrafficLight:
    print(light.value, "->", action(light))
```

```text
qizil -> Töxtang
yaşil -> Yuring
```

## `auto()`, `IntEnum` va `StrEnum`

`auto()` qiymatlarni siz uçun tanlaydi; aʼzolar saqlanadigan bölsa, aniq qiymatlar yozing, şunda tartibni özgartiriş saqlangan maʼlumotni buzmaydi. `IntEnum` aʼzolari butun son **hisoblanadi**, `StrEnum` aʼzolari esa satr **hisoblanadi** (`auto()` kiçik harfli nomni beradi):

```python
from enum import IntEnum, StrEnum, auto


class Priority(IntEnum):
    LOW = auto()
    NORMAL = auto()
    HIGH = auto()


class Color(StrEnum):
    RED = auto()
    GREEN = auto()


print(Priority.HIGH > Priority.LOW, Priority.HIGH == 3, Priority.NORMAL + 10)
print(max([Priority.LOW, Priority.HIGH, Priority.NORMAL]).name)
print(Color.RED == "red", f"css: {Color.GREEN}", Color.RED.upper())
```

```text
True True 12
HIGH
True css: green RED
```

Bu biroz erkinlikni qaytaradi (`Priority.HIGH == 3`), şuning uçun ulardan faqat aʼzolar son yoki satr kabi işlaşi kerak bölganda foydalaning. (`StrEnum` 3.11 da paydo bölgan. Eski kodda `class Color(str, Enum):` yoziladi va uning f-satrdagi körinişi `Color.GREEN` böladi.)

::: details Çuqurroq: kortej qiymatlar va `Flag`
Aʼzo qiymati kortej bölişi mumkin. Uni atributlarga ajratiş uçun `__init__` aniqlang:

```python
from enum import Enum, Flag, auto


class Coin(Enum):
    SOM_1000 = (1000, "bronza")
    SOM_5000 = (5000, "kumuş")

    def __init__(self, amount, color):
        self.amount = amount
        self.color = color


class Permission(Flag):
    READ = auto()
    WRITE = auto()
    DELETE = auto()


print(Coin.SOM_5000.amount, Coin.SOM_5000.color)
editor = Permission.READ | Permission.WRITE
print(Permission.WRITE in editor, Permission.DELETE in editor)
```

```text
5000 kumuş
True False
```

`Flag` aʼzolari bir vaqtda yoqilişi mumkin bölgan sozlamalar uçun `|` bilan birlaşadi.
:::

## Özingiz sinab köring

Köpaytuvçisi 0.4 bölgan `SENIOR` aʼzosini (qiymati `"senior"`) qöşing, `sold` ga bir neçta `"senior"` çiptani qöşing va jami summa qanday özgarişini tekşiring.

<ClientOnly><PythonPlayground :code='"from enum import Enum\n\n\nclass TicketType(Enum):\n    ADULT = \"adult\"\n    STUDENT = \"student\"\n    CHILD = \"child\"\n\n    @property\n    def multiplier(self):\n        match self:\n            case TicketType.ADULT:\n                return 1.0\n            case TicketType.STUDENT:\n                return 0.5\n            case TicketType.CHILD:\n                return 0.3\n\n\nBASE = 40000\nsold = [\"adult\", \"student\", \"child\", \"adult\", \"Student\"]\ntotal = 0\nfor raw in sold:\n    try:\n        kind = TicketType(raw.lower())\n    except ValueError:\n        print(\"Nomaʼlum çipta:\", raw)\n        continue\n    price = round(BASE * kind.multiplier)\n    total += price\n    print(f\"{kind.name:<8} {price:>6}\")\nprint(\"Jami:\", total)"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Aʼzoni oddiy qiymat bilan taqqoslaş

```python
from enum import Enum

class Status(Enum):
    PAID = "paid"

status = Status.PAID
if status == "paid":
    print("Çek yuborilsin")
else:
    print("Çek yuborilmadi")       # aynan şu işlaydi
```

```text
Çek yuborilmadi
```

**Tuzatiş:** aʼzolarni taqqoslang (`status is Status.PAID`) yoki avval satrlarni `Status(text)` bilan aʼzoga aylantiring.

### 2. `match` da nuqtani unutiş

```py
from enum import Enum

class TrafficLight(Enum):
    RED = "qizil"
    GREEN = "yaşil"

def action(light):
    match light:
        case RED:              # Yomon: istalgan qiymatni RED nomli özgaruvçiga uşlab oladi
            return "Töxtang"
        case TrafficLight.GREEN:
            return "Yuring"
```

```text
SyntaxError: name capture 'RED' makes remaining patterns unreachable
```

**Tuzatiş:** `case TrafficLight.RED:`. Oddiy nom istalgan qiymatga mos keladigan uşlaş (capture) andozasidir.

### 3. Aʼzolarni töğridan-töğri JSON ga saqlaş

```py
import json
from enum import Enum

class Status(Enum):
    PAID = "paid"

json.dumps(Status.PAID)
```

```text
TypeError: Object of type Status is not JSON serializable
```

**Tuzatiş:** `.value` ni saqlang (`{**order, "status": order["status"].value}`) va yuklaşda aʼzoni `Status(value)` bilan qayta tiklang. Aʼzo nomini özgartirganda qiymatini saqlab qolsangiz, eski fayllar baribir yuklanadi.

## Maşqlar

### 1. Qahva stakan ölçamlari <Difficulty level="1" />

`SMALL = 250`, `MEDIUM = 350` va `LARGE = 450` (millilitr) aʼzolariga ega `CupSize` enumini yarating. U böylab aylanib, `SMALL: 250 ml` kabi qatorlarni çiqaring. Keyin qiymati `350` bölgan aʼzoni topib, nomini çiqaring.

::: details Yeçim
```python
from enum import Enum


class CupSize(Enum):
    SMALL = 250
    MEDIUM = 350
    LARGE = 450


for size in CupSize:
    print(f"{size.name}: {size.value} ml")

print(CupSize(350).name)
```

```text
SMALL: 250 ml
MEDIUM: 350 ml
LARGE: 450 ml
MEDIUM
```
:::

### 2. Xavfsiz tahlil <Difficulty level="1" />

`"uz"`, `"ru"` va `"en"` qiymatlariga ega `Language` enumini yarating. Aʼzoni, notöğri matn uçun esa `Language.EN` ni qaytaradigan `parse_language(text)` funksiyasini yozing. `"UZ"`, `"ru "` va `"fr"` ni sinab köring.

::: details Yeçim
```python
from enum import Enum


class Language(Enum):
    UZ = "uz"
    RU = "ru"
    EN = "en"


def parse_language(text):
    try:
        return Language(text.strip().lower())
    except ValueError:
        return Language.EN


for raw in ["UZ", "ru ", "fr"]:
    print(repr(raw), "->", parse_language(raw).name)
```

```text
'UZ' -> UZ
'ru ' -> RU
'fr' -> EN
```
:::

### 3. Baho harflari <Difficulty level="2" />

`A`, `B`, `C`, `D`, `F` aʼzolariga ega `Grade` enumini yarating, har birining qiymati uning minimal balli böladi (90, 80, 70, 60, 0). `@classmethod` `from_score(score)` va `passed` xossasini (faqat `F` uçun `False`) qöşing. `95`, `72` va `41` uçun baho va öta olgan-olmaganini çiqaring.

::: details Yeçim
```python
from enum import Enum


class Grade(Enum):
    A = 90
    B = 80
    C = 70
    D = 60
    F = 0

    @classmethod
    def from_score(cls, score):
        for grade in cls:                 # aniqlangan tartib: eng yuqorisi birinçi
            if score >= grade.value:
                return grade
        raise ValueError(f"Notöğri ball: {score}")

    @property
    def passed(self):
        return self is not Grade.F


for score in [95, 72, 41]:
    g = Grade.from_score(score)
    print(score, g.name, "ötdi" if g.passed else "ötmadi")
```

```text
95 A ötdi
72 C ötdi
41 F ötmadi
```

Aʼzolar aniqlangan tartibda aylanadi, şuning uçun ularni eng yuqorisidan boşlab yoziş qidiruvni soddalaştiradi.
:::

### 4. Tavsifdan loyihalaş: taksi narxlari <Difficulty level="2" />

Toşkentdagi taksi ilovasida **Ekonom** (7,000 söm va har km uçun 2,500), **Komfort** (10,000 va 3,500) hamda **Biznes** (20,000 va 6,000) klassdagi maşinalar bor. Tungi narxlar (23:00 dan 06:00 gaça) 20% qimmatroq. Kortej qiymatli va `__init__` li enum (qarang: "Çuqurroq") hamda yumaloqlangan narxni qaytaradigan `fare(km, hour)` metodini loyihalang. 12 km lik safar uçun soat 14:00 va 23:00 dagi narxlarni çiqaring.

::: details Yeçim
```python
from enum import Enum


class CarClass(Enum):
    ECONOMY = (7_000, 2_500)
    COMFORT = (10_000, 3_500)
    BUSINESS = (20_000, 6_000)

    def __init__(self, start_price, per_km):
        self.start_price = start_price
        self.per_km = per_km

    def fare(self, km, hour):
        price = self.start_price + self.per_km * km
        if hour >= 23 or hour < 6:
            price *= 1.2
        return round(price)


print(f"{'Klass':<9} {'14:00':>8} {'23:00':>8}")
for car in CarClass:
    print(f"{car.name.title():<9} {car.fare(12, 14):>8,} {car.fare(12, 23):>8,}")
```

```text
Klass        14:00    23:00
Economy     37,000   44,400
Comfort     52,000   62,400
Business    92,000  110,400
```
:::

### 5. JSON bilan vazifalar taxtasi <Difficulty level="3" />

`TaskState` ni yarating (`TODO`, `IN_PROGRESS`, `DONE`, qiymatlari satr). Vazifalar `title` va `state` ga ega luğatlar. Vazifalar röyxatini JSON matnga aylantiring (qiymatlarni saqlab), qayta yuklang (aʼzolarni tiklab) va nomlarni holat böyiça enum tartibida, böş holatlarni ham qöşib, guruhlab çiqaring.

::: details Yeçim
```python
import json
from enum import Enum


class TaskState(Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


tasks = [
    {"title": "Buxorodan mehmonxona band qiliş", "state": TaskState.TODO},
    {"title": "Pul almaştiriş", "state": TaskState.TODO},
    {"title": "Xivaga poyezd çiptalarini oliş", "state": TaskState.DONE},
]
text = json.dumps([{**t, "state": t["state"].value} for t in tasks])
loaded = [{**t, "state": TaskState(t["state"])} for t in json.loads(text)]

board = {state: [] for state in TaskState}
for task in loaded:
    board[task["state"]].append(task["title"])

for state, titles in board.items():
    print(f"{state.name} ({len(titles)}): {', '.join(titles) or '-'}")
```

```text
TODO (2): Buxorodan mehmonxona band qiliş, Pul almaştiriş
IN_PROGRESS (0): -
DONE (1): Xivaga poyezd çiptalarini oliş
```

`{state: [] for state in TaskState}` har bir ustun mavjud bölişini kafolatlaydi.
:::

## Xulosa

- Sehrli satrlar imlo xatolarida sezdirmasdan buziladi. Enum aʼzolari esa baland ovozda xato beradi: `Status.SHIPED` `AttributeError` çaqiradi.
- Aʼzolarning `.name` va `.value` si bor va ular oddiy qiymatlarga teng emas. Bir xil qiymatli aʼzolar, `@unique` taqiqlamasa, alias ga aylanadi.
- Qiymat böyiça `Status("paid")`, nom böyiça `Status["PAID"]` bilan qidiring. Aylantirişni dastur çegaralarida bajaring.
- `auto()` qiymatlarni tanlaydi. `IntEnum` aʼzolari butun sonlar, `StrEnum` aʼzolari esa satrlar kabi işlaydi.
- Enumlarda metodlar bölişi mumkin, ular `match` da nuqtali nomlar bilan işlaydi va JSON ga `.value` sifatida yoziladi.

## Qöşimça manbalar

- [`enum` moduli hujjatlari](https://docs.python.org/3/library/enum.html)
- [Enum HOWTO qöllanmasi](https://docs.python.org/3/howto/enum.html)
