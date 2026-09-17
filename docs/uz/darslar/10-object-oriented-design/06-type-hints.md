---
title: Type hintlar
description: "Funksiya va klasslaringiz nima kutişi va nima qaytarişini hujjatlaş: özgaruvçilar, parametrlar va qaytariladigan qiymatlarga type hintlar, list[int] va dict[str, float], X | None bilan ixtiyoriy qiymatlar, Callable, klasslarda type hintlar, Protocol, type alias lar hamda nega type hintlar işlaş vaqtida tekşirilmaydi."
---

# Type hintlar

![Rasm: Type hintlar](/images/topics-webp-uzb/type-hints.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Type hintlar (turlarni körsatuvçi izohlar) nima va nega ularni yoziş kerak
- Özgaruvçilar, parametrlar, qaytariladigan qiymatlar va töplamlarga (`list[int]`, `dict[str, float]`) type hint qanday yoziladi
- Ixtiyoriy qiymatlar (`str | None`), funksiya parametrlari (`Callable`) va özini nomlaydigan klasslar qanday yoziladi
- `Protocol` va `type` alias lar (uzun type hint ga berilgan nom) kattaroq göyalarni qanday tasvirlaydi
- Nega type hintlar dastur işlayotganda **tekşirilmaydi**
:::

## Nega bu muhim

`def calculate(items, rate, rounding):` da `items` röyxatmi yoki luğatmi? `rate` `12` mi yoki `0.12` mi? **Type hintlar** (parametr va natija turlarini körsatuvçi izohlar) bilan funksiya imzosi tanasini öqimasdan turib javob beradi:

```py
def calculate(items: list[float], rate: float, rounding: int = 0) -> float:
    ...
```

Type hintlar kod içidagi **hujjat**dir. **Muharrirlar** ulardan avtomatik töldiriş va xatolarni belgilaş uçun foydalanadi, mypy yoki pyright kabi **tur tekşiruvçilari** esa notöğri çaqiruvlarni hali heç narsa işga tuşirilmasdan xabar qiladi.

## Özgaruvçilar va funksiyalar

Özgaruvçi va parametrlar uçun `nom: tur`, qaytariladigan qiymat uçun `-> tur` yoziladi:

```python
scores: dict[str, list[int]] = {}           # keyinroq töldiriladigan böş luğat


def average(numbers: list[float]) -> float:
    return sum(numbers) / len(numbers)


def greet(name: str, times: int = 1) -> str:
    return " ".join([f"Salom, {name}!"] * times)


scores.setdefault("Aziza", []).append(91)
print(scores, average([4.5, 5.0, 3.5]))
print(greet("Bekzod", times=2))
```

```text
{'Aziza': [91]} 4.333333333333333
Salom, Bekzod! Salom, Bekzod!
```

Oddiy özgaruvçilarga type hint kamdan-kam kerak böladi, lekin böş töplamga type hint yoziş foydali. Standart qiymat bölsa, avval type hint keladi: `times: int = 1`. Heç narsa qaytarmaydigan funksiyaga `-> None` yoziladi.

## Töplamlar va ixtiyoriy qiymatlar

Element turlari kvadrat qavsga yoziladi; kortejlar har bir **pozitsiya**ni tasvirlaydi. Bölmasligi yoki bir neçta turda bölişi mumkin bölgan qiymat uçun `|` ("yoki") işlatiladi:

| Type hint | Maʼnosi | Misol qiymat |
|---|---|---|
| `list[int]` / `set[str]` | butun sonlar röyxati / satrlar töplami | `[90, 85]` / `{"çoy"}` |
| `dict[str, float]` | satr kalitlar, float qiymatlar | `{"USD": 12650.0}` |
| `tuple[str, int]` / `tuple[int, ...]` | avval satr, keyin butun son / istalgança butun son | `("Aziza", 20)` / `(1, 2, 3)` |
| `str \| None` | satr yoki `None` | `None` |

```python
def find_phone(contacts: dict[str, str], name: str) -> str | None:
    return contacts.get(name)


contacts = {"Aziza": "+998901234567"}
for name in ["Aziza", "Dilnoza"]:
    phone = find_phone(contacts, name)
    if phone is None:
        print(f"{name}: telefon saqlanmagan")
    else:
        print(f"{name}: {phone[-4:]}")
```

```text
Aziza: 4567
Dilnoza: telefon saqlanmagan
```

`str | None` çaqiruvçini avval `None` ni tekşirişga ogohlantiradi.

## Argument sifatidagi funksiyalar: `Callable`

Funksiya parametri uçun `collections.abc` dan `Callable` işlatiladi: avval parametr turlari röyxati, keyin qaytariladigan tur:

```python
from collections.abc import Callable


def apply_discount(prices: list[int], rule: Callable[[int], int]) -> list[int]:
    return [rule(p) for p in prices]


print(apply_discount([50_000, 8_000], lambda p: round(p * 0.9)))
```

```text
[45000, 7200]
```

`Callable[[int], int]` "`int` qabul qilib, `int` qaytaradigan funksiya" degani. Tasvirlab bölmaydigan maʼlumotlar uçun `typing.Any` tekşiruvni öçiradi; uni kam işlating.

## Type hintlar işlaş vaqtida tekşirilmaydi

Python type hintlarni saqlaydi, lekin kod işlayotganda **ularni tekşirmaydi**:

```python
def line_total(price: int, qty: int) -> int:
    return price * qty


print(line_total(25_000, 3))
print(line_total("100", 3))         # notöğri tur, lekin xato yöq
```

```text
75000
100100100
```

`"100" * 3` satrni takrorlaydi. Tur tekşiruvçisi bu çaqiruvni işga tuşirişdan **oldin** belgilagan bölardi, lekin foydalanuvçi va fayllardan keladigan yomon **maʼlumot**ni baribir `if` va `raise` bilan tekşiriş kerak. Ikkalasi ham zarur.

::: info Python 3.14 da nima özgardi (PEP 649)
Python 3.14 type hintlarni **keçiktirib**, faqat nimadir ularni öqiganda hisoblaydi. Şuning uçun type hint keyinroq aniqlanadigan klassni nomlaşi mumkin, `annotationlib` esa type hintlarni satr sifatida öqiy oladi:

```python
import annotationlib


def ship(order: Order) -> Receipt:     # ikkala klass hali mavjud emas
    ...


print(annotationlib.get_annotations(ship, format=annotationlib.Format.STRING))
```

```text
{'order': 'Order', 'return': 'Receipt'}
```
:::

## Klasslardagi type hintlar

Metodlarga funksiyalar kabi type hint yoziladi (`self` ga type hint kerak emas). Öz klasslaringiz ham tur hisoblanadi va keçiktirilgan type hintlar tufayli klass **özini** nomlay oladi:

```python
from typing import Self


class Money:
    def __init__(self, amount: int, currency: str = "UZS") -> None:
        self.amount = amount
        self.currency = currency

    def add(self, other: Money) -> Money:
        return Money(self.amount + other.amount, self.currency)

    def __repr__(self) -> str:
        return f"Money({self.amount:,} {self.currency})"


class Counter:
    def __init__(self) -> None:
        self.count = 0

    def tick(self) -> Self:
        self.count += 1
        return self


class LoudCounter(Counter):
    pass


print(Money(150_000).add(Money(35_000)))
c = LoudCounter().tick().tick()
print(type(c).__name__, c.count)
```

```text
Money(185,000 UZS)
LoudCounter 2
```

`typing.Self` "bu metod çaqirilgan klass" degani, şuning uçun `LoudCounter().tick()` natijasi `LoudCounter` ekani maʼlum.

## `Protocol`: duck typing uçun type hintlar

Duck typing da kerakli metodga ega har qanday obyekt işlaydi. `Protocol` buni vorisliksiz, type hint da aytib beradi:

```python
from typing import Protocol


class Notifier(Protocol):
    def send(self, to: str, text: str) -> bool: ...


class SmsNotifier:                      # Notifier dan voris OLMAYDI
    def send(self, to: str, text: str) -> bool:
        print(f"{to} ga SMS: {text}")
        return True


def remind(notifier: Notifier, person: str) -> bool:
    return notifier.send(person, "Uçraşuv soat 10:00 da")


print(remind(SmsNotifier(), "Aziza"))
```

```text
Aziza ga SMS: Uçraşuv soat 10:00 da
True
```

Tur tekşiruvçisi `SmsNotifier` ni qabul qiladi, çunki uning `send` metodi imzosi mos keladi.

## Type alias lar

Uzun type hint ga `type` operatori bilan nom beriladi, bu **type alias** (turning qisqa nomi) deyiladi:

```python
type Grades = dict[str, list[int]]


def best_student(grades: Grades) -> str:
    return max(grades, key=lambda name: sum(grades[name]) / len(grades[name]))


print(best_student({"Aziza": [90, 95], "Bekzod": [70, 81]}))
print(type(Grades).__name__)
```

```text
Aziza
TypeAliasType
```

Alias luğat emas, `TypeAliasType` obyekti, şuning uçun uni faqat type hintlarda işlating: `Grades()` `TypeError` beradi.

::: info Eski kodda
Mavjud loyihalarda eskiroq yozuvlar uçraydi:

- `Optional[str]`, `Union[int, float]`, `List[int]`, `Dict[str, float]` (`typing` dan).
- `type` operatori örniga `Grades = dict[str, list[int]]`.
- Qoştirnoqdagi klass nomlari (`-> "Money"`) yoki `from __future__ import annotations`: 3.14 dan oldin klass özini nomlaşi uçun kerak edi. Bu import barça type hintlarni satrga aylantiradi, PEP 749 esa uni eskirgan deb belgilaşni (3.13 qöllab-quvvatlaşi tugaganidan keyingi birinçi relizdan erta emas) va keyinroq olib taşlaşni rejalaştirgan, şuning uçun yangi kodga qöşmang.
:::

## Özingiz sinab köring

Pastdagi çaqiruvlarga notöğri turlarni bering (masalan, `qty` uçun satr) va type hintlar çaqiruvni töxtatmasligini köring.

<ClientOnly><PythonPlayground :code='"from dataclasses import dataclass\n\n\n@dataclass\nclass LineItem:\n    name: str\n    price: int\n    qty: int = 1\n\n\ndef subtotal(item: LineItem) -> int:\n    return item.price * item.qty\n\n\ndef order_total(items: list[LineItem], discount: float | None = None) -> int:\n    total = sum(subtotal(i) for i in items)\n    if discount is not None:\n        total = round(total * (1 - discount))\n    return total\n\n\ncart = [LineItem(\"Somsa\", 8000, 3), LineItem(\"Çoy\", 5000)]\nprint(order_total(cart))\nprint(order_total(cart, discount=0.1))\nprint(order_total.__annotations__)"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Istalgan töplam yetarli bölganda `list` talab qiliş

```python
def average(scores: list[int]) -> float:
    return sum(scores) / len(scores)

print(average((80, 90)))                    # kortej: bemalol işlaydi
print(average({"a": 1, "b": 3}.values()))   # luğat qiymatlari: bemalol işlaydi
```

```text
85.0
2.0
```

Ikkalasi ham işlaydi, lekin tur tekşiruvçisi ularni rad etadi: heç biri `list` emas. **Tuzatiş:** funksiyaga nima **kerak** bölsa, şuni `collections.abc` dan yozing: `Sequence[int]` (röyxatlar, kortejlar), `Collection[int]` (`len()` ga ega har narsa, luğat qiymatlari ham) yoki `Iterable[int]` (aylanib çiqiş mumkin bölgan har narsa).

### 2. `None` bölişi mumkin qiymatni vada qiliş

```py
def find_email(users: dict[str, str], name: str) -> str:      # type hint yolğon
    return users.get(name)

email = find_email({"aziza": "aziza@mail.uz"}, "bekzod")
print(email.upper())
```

```text
AttributeError: 'NoneType' object has no attribute 'upper'
```

**Tuzatiş:** `dict.get()` `None` qaytarişi mumkin, şuning uçun halol type hint `-> str | None` böladi va u çaqiruvçiga avval tekşirişni aytadi.

### 3. Töplam type hintlarini notöğri sintaksis bilan yoziş

```py
def total(prices: [int]) -> int: ...             # Yomon: int saqlovçi röyxat
def pair() -> (int, int): ...                    # Yomon: turlar korteji
def count(prices: list(int)) -> int: ...         # Yomon: tur emas (vositalar type hint ni öqiganda xato beradi)

count.__annotations__
```

```text
TypeError: 'type' object is not iterable
```

Qatorlar işlaydi, lekin vositalar ulardan foydalana olmaydi. **Tuzatiş:** `list[int]`, `tuple[int, int]`.

## Maşqlar

### 1. Funksiyalarga type hint yozing <Difficulty level="1" />

Bu funksiyalarga type hintlarni qöşing, keyin har birini çaqiring:

```py
def is_adult(age):
    return age >= 18

def word_lengths(words):
    return {w: len(w) for w in words}
```

::: details Yeçim
```python
def is_adult(age: int) -> bool:
    return age >= 18


def word_lengths(words: list[str]) -> dict[str, int]:
    return {w: len(w) for w in words}


print(is_adult(17))
print(word_lengths(["çoy", "somsa", "palov"]))
```

```text
False
{'çoy': 3, 'somsa': 5, 'palov': 5}
```
:::

### 2. Ixtiyoriy qidiruv <Difficulty level="1" />

`first_long_word(words: list[str], min_length: int) -> str | None` funksiyasini yozing (şunça uzun birinçi söz yoki `None`). `["quyoş", "daryo", "toğtizmasi"]` va 5 hamda 11 çegaralari uçun sözni katta harflarda yoki `11+ harfli söz yöq` deb çiqaring.

::: details Yeçim
```python
def first_long_word(words: list[str], min_length: int) -> str | None:
    for word in words:
        if len(word) >= min_length:
            return word
    return None


words = ["quyoş", "daryo", "toğtizmasi"]
for limit in [5, 11]:
    found = first_long_word(words, limit)
    if found is None:
        print(f"{limit}+ harfli söz yöq")
    else:
        print(found.upper())
```

```text
QUYOŞ
11+ harfli söz yöq
```
:::

### 3. Turlangan statistika <Difficulty level="2" />

Minimum va maksimumni qaytaradigan `summarize(values: list[float]) -> tuple[float, float]` va `apply_to_all(values: list[float], func: Callable[[float], float]) -> list[float]` funksiyalarini yozing. `[31.0, 38.0, 29.5]` ni Selsiydan Farengeytga özgartiring va ikkala röyxatni umumlaştiring.

::: details Yeçim
```python
from collections.abc import Callable


def summarize(values: list[float]) -> tuple[float, float]:
    return min(values), max(values)


def apply_to_all(values: list[float], func: Callable[[float], float]) -> list[float]:
    return [func(v) for v in values]


celsius = [31.0, 38.0, 29.5]
fahrenheit = apply_to_all(celsius, lambda c: c * 9 / 5 + 32)
print(summarize(celsius), summarize(fahrenheit))
```

```text
(29.5, 38.0) (85.1, 100.4)
```
:::

### 4. Tavsifdan loyihalaş: avtoturargoh <Difficulty level="2" />

Toşkentdagi avtoturargohda raqamlangan joylar bor, maşinalar esa davlat raqami satri bilan aniqlanadi. Band joylarni `dict[int, str]` da saqlaydigan, töliq type hintlar bilan yozilgan `Garage` klassini loyihalang: `park(plate)` (joy raqamini yoki töla bölsa `None` qaytaradi) va `free_spots()`. 2 ta joy bilan uçta maşinani qöying, keyin böş joylarni çiqaring.

::: details Yeçim
```python
class Garage:
    def __init__(self, capacity: int) -> None:
        self.capacity = capacity
        self.spots: dict[int, str] = {}

    def park(self, plate: str) -> int | None:
        for spot in self.free_spots():
            self.spots[spot] = plate
            return spot
        return None

    def free_spots(self) -> list[int]:
        return [s for s in range(1, self.capacity + 1) if s not in self.spots]


g = Garage(2)
for plate in ["01A777AA", "10B123CD", "30C555EF"]:
    print(plate, "->", g.park(plate))
print("Böş:", g.free_spots())
```

```text
01A777AA -> 1
10B123CD -> 2
30C555EF -> None
Böş: []
```
:::

### 5. Protocol asosidagi hisobot <Difficulty level="3" />

`price() -> int` metodiga ega `Priced` nomli `Protocol` aniqlang. Unga mos keladigan ikkita özaro boğliq bölmagan dataclass yarating: `Hotel` (nights, per_night) va `Flight` (cost), hamda `trip_total(things: list[Priced]) -> int` funksiyasini yozing. Har bir elementning klass nomi va narxini, keyin jami summani çiqaring.

::: details Yeçim
```python
from dataclasses import dataclass
from typing import Protocol


class Priced(Protocol):
    def price(self) -> int: ...


@dataclass
class Hotel:
    nights: int
    per_night: int

    def price(self) -> int:
        return self.nights * self.per_night


@dataclass
class Flight:
    cost: int

    def price(self) -> int:
        return self.cost


def trip_total(things: list[Priced]) -> int:
    for thing in things:
        print(f"{type(thing).__name__:<7} {thing.price():>9,}")
    return sum(t.price() for t in things)


print(f"Jami    {trip_total([Flight(780_000), Hotel(2, 450_000)]):>9,}")
```

```text
Flight    780,000
Hotel     900,000
Jami    1,680,000
```

Heç bir klass `Priced` dan voris olmaydi.
:::

## Xulosa

- Type hintlar funksiya nima qabul qilişi va nima qaytarişini tasvirlaydi: `def f(x: list[int]) -> str:`.
- Bölmasligi mumkin bölgan qiymatlar uçun `X | None`, funksiyalar uçun `Callable[[argumentlar], natija]` işlating.
- Öz klasslaringiz ham tur, 3.14 da esa klass type hintlarda özini nomlay oladi.
- `Protocol` duck typing interfeyslarini tasvirlaydi, `type Nom = ...` esa uzun type hint ga nom beradi (type alias).
- Type hintlar işlaş vaqtida **tekşirilmaydi**. Ularni tur tekşiruvçilari tekşiradi; maʼlumotni esa baribir `if`/`raise` tekşiradi.

## Qöşimça manbalar

- [`typing` moduli hujjatlari](https://docs.python.org/3/library/typing.html)
- [`annotationlib` moduli](https://docs.python.org/3/library/annotationlib.html)
- [Type hintlar böyiça qöllanma (mypy hujjatlari)](https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html)
- [PEP 649: Annotation larni keçiktirib hisoblaş](https://peps.python.org/pep-0649/)
