---
title: Istisno çaqiriş va maxsus istisnolar
description: "raise yordamida öz funksiyalaringizdan muammolar haqida xabar beriş: mos örnatilgan istisnoni tanlaş, qayta çaqiriş, raise from, oddiy maxsus istisno klasslari, assert va raise farqi hamda foydali xato xabarlarini yoziş."
---

# Istisno çaqiriş va maxsus istisnolar

![Rasm: Istisno çaqiriş va maxsus istisnolar](/images/topics-webp-uzb/raising-and-custom-exceptions.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Funksiya notöğri argument olganda istisnoni qanday **çaqiriş** va qaysi örnatilgan tur mos kelişi
- `raise` bilan qayta çaqiriş hamda `from e` va `from None` bilan sababni boğlaş yoki yaşiriş
- Öz istisno turlaringizni, ularning kiçik ierarxiyasini va maʼlumot saqlaydigan istisnoni yaratiş
- Qaçon `raise` örniga `assert` işlatiş va yordam beradigan xato xabarlarini qanday yoziş
:::

## Nega bu muhim

Öz funksiyalaringiz Python aniqlay olmaydigan muammolarga duç keladi: `withdraw(balance, -50000)` arifmetik jihatdan töğri, lekin bank uçun bemaʼni. `None` yoki `-1` qaytarişni eʼtiborsiz qoldiriş oson va xato öz sababidan uzoqda paydo böladi. Istisno çaqiriş notöğri harakatni aniq xabar bilan **darhol** töxtatadi va nima qilişni çaqiruvçiga qoldiradi.

## Istisnoni `raise` bilan çaqiriş

`raise` istisnoni ataylab yaratadi. Istisno turini yozing va xabar bering. Funksiya şu qatorda töxtaydi, istisno esa uni odatdagidek uşlay oladigan çaqiruvçiga yuqoriga köçadi:

```python
def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError(f"summa musbat bölişi kerak, berilgan qiymat: {amount}")
    if amount > balance:
        raise ValueError(f"{amount:,} söm yeçib bölmaydi, balans {balance:,} söm")
    return balance - amount

balance = 250000
for amount in [50000, -1000, 900000]:
    try:
        balance = withdraw(balance, amount)
        print(f"{amount:,} yeçildi. Yangi balans: {balance:,}")
    except ValueError as e:
        print(f"Rad etildi: {e}")
```

```text
50,000 yeçildi. Yangi balans: 200,000
Rad etildi: summa musbat bölişi kerak, berilgan qiymat: -1000
Rad etildi: 900,000 söm yeçib bölmaydi, balans 200,000 söm
```

Funksiya muammoni faqat **aniqlaydi**; nima qilişni çaqiruvçi hal qiladi. Bunday tekşiruvlarni *Qaytariladigan qiymatlar* darsidagi himoya şartlari kabi funksiyaning boşiga qöying.

## Mos örnatilgan istisnoni tanlaş

Çaqiruvçilar köpinça tur böyiça uşlaydi, şuning uçun maʼnosi muammoga mos keladigan istisnoni tanlang:

| Istisno | Qaçon çaqiriş kerak |
|---|---|
| `ValueError` | turi töğri, lekin qiymatga ruxsat yöq |
| `TypeError` | argument turi notöğri |
| `KeyError` | kalit yoki ID luğatda topilmadi |
| `LookupError` | biror narsa topilmadi va buni gap yaxşiroq tuşuntiradi |
| `NotImplementedError` | imkoniyat rejalaştirilgan, lekin hali yozilmagan |

Odatiy tur tekşiruvi: `if not isinstance(percent, (int, float)): raise TypeError(...)`. Ikki tafsilot: `bool` `int` ning bolasi, şuning uçun `isinstance(True, int)` `True`; `KeyError` esa xabarini doim qöştirnoqda körsatadi (`raise KeyError("P999")` `'P999'` ni çiqaradi), şuning uçun uni bitta kalit uçun, gap uçun esa `LookupError` yoki `ValueError` ni işlating.

## Qayta çaqiriş va zanjirlaş

Xatoga **javob berib** (masalan, uni logga yozib), baribir uni çaqiruvçiga yetkaziş uçun `except` içida yalanğoç `raise` ni işlating:

```py
except KeyError:
    print(f"[log] {product!r} uçun narx qidiruvi muvaffaqiyatsiz")
    raise
```

Past darajadagi `KeyError: 'Nukus'` dastur **nima** qilayotgani haqida heç narsa demaydi. Aniqroq istisno çaqiring, aslini `as e` bilan nomlab, `from e` bilan boğlang:

```python
rates = {"Toşkent": 20000, "Samarqand": 35000}

def delivery_cost(city):
    try:
        return rates[city]
    except KeyError as e:
        raise ValueError(f"{city} şahriga yetkazib bermaymiz") from e

try:
    delivery_cost("Nukus")
except ValueError as e:
    print(e)
    print("sababi:", repr(e.__cause__))
```

```text
Nukus şahriga yetkazib bermaymiz
sababi: KeyError('Nukus')
```

Uni heç kim uşlamasa, traceback **ikkala** xatoni "The above exception was the direct cause of the following exception" bilan boğlab körsatadi. `from` siz u "During handling of the above exception, another exception occurred" deydi, bu esa ikkinçi xatoga öxşaydi.

Asl xato heç narsa qöşmasa, uni `from None` bilan yaşiring. Şunda traceback faqat sizning istisnongizni körsatadi:

```py
    except KeyError:
        raise ValueError(f"{city} şahriga yetkazib bermaymiz") from None
```

Sabab xatoni tuzatişga yordam bersa (masalan, muvaffaqiyatsiz fayl öqiş) `from e` ni, xabaringiz hammasini aytib bölgan bölsa, `from None` ni işlating.

## Öz istisno turlaringiz

![Diagramma: Öz istisno turlaringiz](/images/companions-webp-uzb/app-error-hierarchy.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

`OutOfStockError` kabi ilovangiz muammolari nomi bilan atalgan istisnolar çaqiruvçilarga aynan şu vaziyatni uşlaş imkonini beradi. Bitta **asosiy** istisno va uning ostida aniqlarini yarating:

```python
class ShopError(Exception):
    pass

class OutOfStockError(ShopError):
    pass

class UnknownProductError(ShopError):
    pass

stock = {"çoy": 5, "somsa": 0}

def buy(product, quantity):
    if product not in stock:
        raise UnknownProductError(f"{product!r} nomli mahsulot yöq")
    if stock[product] < quantity:
        raise OutOfStockError(f"faqat {stock[product]} ta {product} qoldi, {quantity} ta söraldi")
    stock[product] -= quantity

for product, quantity in [("çoy", 2), ("somsa", 3), ("tort", 1)]:
    try:
        buy(product, quantity)
        print(f"{quantity} ta {product} sotib olindi")
    except OutOfStockError as e:
        print(f"Keçirasiz: {e}")
    except ShopError as e:
        print(f"Buyurtma bajarilmadi ({type(e).__name__}): {e}")
```

```text
2 ta çoy sotib olindi
Keçirasiz: faqat 0 ta somsa qoldi, 3 ta söraldi
Buyurtma bajarilmadi (UnknownProductError): 'tort' nomli mahsulot yöq
```

Klasslar *Klasslar va obyektlar* darsida töliq örganiladi; hozirça `class ShopError(Exception): pass` ni "`Exception` ostidagi, qöşimça heç narsasi yöq **yangi istisno turi**" deb öqing. `OutOfStockError(ShopError)` uning bolasi, şuning uçun `except ShopError` dökonning har qanday muammosini uşlaydi, `NameError` kabi xatolar esa yaşirilmaydi. Örnatilgan turdan ham meros oliş mumkin: `class InvalidPhoneError(ValueError)` ni `except ValueError` ham uşlaydi. Nomlarni örnatilganlar kabi `Error` bilan tugating.

::: info Maʼlumot saqlaydigan istisno
Hozirça `pass` li klass yetarli. Klasslarni örgangandan keyin istisno qiymatlarni ham saqlay oladi, şunda çaqiruvçi xabarni tahlil qilişi şart emas:

```python
class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        super().__init__(f"{amount:,} söm kerak, balans {balance:,} söm")
        self.balance = balance
        self.amount = amount

try:
    raise InsufficientFundsError(120000, 300000)
except InsufficientFundsError as e:
    print(f"Tölov rad etildi: {e}")
    print(f"Yetişmaydi: {e.amount - e.balance:,} söm")
```

```text
Tölov rad etildi: 300,000 söm kerak, balans 120,000 söm
Yetişmaydi: 180,000 söm
```

`__init__` va `super()` *Klasslar va obyektlar* hamda *Vorislik va super()* darslarida tuşuntiriladi.
:::

## `assert` va `raise`

`assert şart, xabar` (*Funksiyalarni töğri loyihalaş* darsidan) şart yolğon bölganda `AssertionError` çaqiradi. Uning vazifasi boşqaça:

| | `assert` | `raise SomeError(xabar)` |
|---|---|---|
| Maqsad | **dasturçi xatolarini** uşlaş ("bu heç qaçon bölmasligi kerak") | **kutilgan muammolar** haqida xabar beriş (notöğri kiritiş, yöq maʼlumot) |
| Öçiriş mumkinmi | <Yes /> (`python -O` barça assertlarni ötkazib yuboradi) | <No /> |

Assertlarni öçirib qöyiş mumkin bölgani uçun ularni foydalanuvçi kiritişi yoki pul summalarini tekşiriş uçun heç qaçon işlatmang.

## Yaxşi xato xabarlarini yoziş

Yaxşi xabar **nima** notöğri ekanini, **qanday qiymat** kelganini va iloji bölsa **nimaga ruxsat borligini** aytadi: `"invalid input"` örniga `"quantity must be a whole number, got '2.5'"`, `"bad date"` örniga `"month must be 1-12, got 13"`. Böş matn körinişi uçun `!r` işlating (`got ''`), Pythonning öz xabarlari kabi kiçik harf bilan boşlang va heç qaçon parollarni qöşmang.

## Özingiz sinab köring

`transfer` ga öz maxsus istisnosi bilan kunlik limit qöşing va uni uşlang.

<ClientOnly><PythonPlayground :code='"class BankError(Exception):\n    pass\n\nclass InsufficientFundsError(BankError):\n    pass\n\ndef transfer(balance, amount):\n    if amount <= 0:\n        raise ValueError(f\"summa musbat bölişi kerak, berilgan qiymat: {amount}\")\n    if amount > balance:\n        raise InsufficientFundsError(f\"balans {balance:,} söm, {amount:,} yuborib bölmaydi\")\n    return balance - amount\n\nbalance = 300000\nfor amount in [100000, -5000, 450000, 150000]:\n    try:\n        balance = transfer(balance, amount)\n        print(f\"{amount:,} söm yuborildi. Balans: {balance:,} söm\")\n    except BankError as e:\n        print(f\"Bank rad etdi: {e}\")\n    except ValueError as e:\n        print(f\"Notöğri summa: {e}\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Klass nomini satr sifatida çaqiriş

```py
raise "ValueError: summa manfiy"
```

```text
TypeError: exceptions must derive from BaseException
```

Istisno obyektini çaqiring: `raise ValueError("summa manfiy")`.

### 2. Xatoni çaqiriş örniga qaytariş

```py
# Yomon:
def withdraw(balance, amount):
    if amount > balance:
        return "xato: pul yetarli emas"
    return balance - amount

balance = withdraw(1000, 5000)
print(balance - 100)
```

```text
TypeError: unsupported operand type(s) for -: 'str' and 'int'
```

Xato satri `balance` da saqlandi va dastur keyinroq, boşqa joyda yiqildi. Uning örniga manbada çaqiring.

### 3. Maxsus klassda `Exception` ni unutiş

```py
class OutOfStockError:
    pass

raise OutOfStockError("çoy qolmadi")
```

```text
TypeError: OutOfStockError() takes no arguments
```

`(Exception)` siz bu oddiy klass, istisno emas. `class OutOfStockError(Exception):` deb yozing.

## Maşqlar

### 1. Ballni tekşiriş <Difficulty level="1" />

Ballni qaytaradigan yoki u 0-100 oraliğida bölmasa `ValueError` çaqiradigan `check_score(score)` funksiyasini yozing. `85` va `120` ni sinab köring.

::: details Yeçim
```python
def check_score(score):
    if not 0 <= score <= 100:
        raise ValueError(f"ball 0 va 100 orasida bölişi kerak, berilgan qiymat: {score}")
    return score

for score in [85, 120]:
    try:
        print(check_score(score))
    except ValueError as e:
        print(f"Xato: {e}")
```

```text
85
Xato: ball 0 va 100 orasida bölişi kerak, berilgan qiymat: 120
```
:::

### 2. Tur va qiymat tekşiruvlari <Difficulty level="1" />

Toşkent-Samarqand poyezdi uçun `make_ticket(passengers)` funksiyasini yozing: `passengers` `int` bölmasa `TypeError`, 1-6 oraliğida bölmasa `ValueError` çaqiring, aks holda `f"{passengers} kişilik çipta"` qaytaring. `2`, `"2"` va `9` ni sinab köring.

::: details Yeçim
```python
def make_ticket(passengers):
    if not isinstance(passengers, int):
        raise TypeError(f"passengers int bölişi kerak, berilgan tur: {type(passengers).__name__}")
    if not 1 <= passengers <= 6:
        raise ValueError(f"passengers 1-6 oraliğida bölişi kerak, berilgan qiymat: {passengers}")
    return f"{passengers} kişilik çipta"

for value in [2, "2", 9]:
    try:
        print(make_ticket(value))
    except (TypeError, ValueError) as e:
        print(f"{type(e).__name__}: {e}")
```

```text
2 kişilik çipta
TypeError: passengers int bölişi kerak, berilgan tur: str
ValueError: passengers 1-6 oraliğida bölişi kerak, berilgan qiymat: 9
```
:::

### 3. Kutubxona istisnolari <Difficulty level="2" />

Ikki bolali `LibraryError` yarating: `BookNotFoundError` va `BookAlreadyBorrowedError`. `borrow(library, title)` funksiyasini yozing, bunda `library` sarlavhalarni `True` (mavjud) yoki `False` (olingan) ga böğlaydi: mos istisnoni çaqiring yoki kitobni olingan deb belgilang. `"Python asoslari"` ni ikki marta, `"Dune"` ni bir marta oling, `LibraryError` ni uşlang.

::: details Yeçim
```python
class LibraryError(Exception):
    pass

class BookNotFoundError(LibraryError):
    pass

class BookAlreadyBorrowedError(LibraryError):
    pass

def borrow(library, title):
    if title not in library:
        raise BookNotFoundError(f"{title!r} nomli kitob yöq")
    if not library[title]:
        raise BookAlreadyBorrowedError(f"{title!r} allaqaçon olingan")
    library[title] = False

library = {"Python asoslari": True, "Samarqand yöriqnomasi": True}

for title in ["Python asoslari", "Python asoslari", "Dune"]:
    try:
        borrow(library, title)
        print(f"{title} olindi")
    except LibraryError as e:
        print(f"{type(e).__name__}: {e}")
```

```text
Python asoslari olindi
BookAlreadyBorrowedError: 'Python asoslari' allaqaçon olingan
BookNotFoundError: 'Dune' nomli kitob yöq
```
:::

### 4. Xatoni tarjima qiliş <Difficulty level="2" />

`exchange_rates = {"USD": 12600, "EUR": 13700}` bilan `to_som(amount, currency)` funksiyasini yozing. Nomaʼlum valyuta uçun asl `KeyError` **dan** `ValueError("unsupported currency: ...")` çaqiring. `to_som(10, "GBP")` uçun `e` va `e.__cause__` ni çop eting.

::: details Yeçim
```python
exchange_rates = {"USD": 12600, "EUR": 13700}

def to_som(amount, currency):
    try:
        rate = exchange_rates[currency]
    except KeyError as e:
        raise ValueError(f"unsupported currency: {currency}") from e
    return amount * rate

print(to_som(10, "USD"))
try:
    to_som(10, "GBP")
except ValueError as e:
    print(e)
    print(repr(e.__cause__))
```

```text
126000
unsupported currency: GBP
KeyError('GBP')
```
:::

### 5. Toza miqdor xatosi <Difficulty level="3" />

`QuantityError(ValueError)` yarating. `text` ni `int()` bilan özgartiradigan `parse_quantity(text)` ni yozing: bu muvaffaqiyatsiz bölsa, `QuantityError` ni `from None` bilan çaqiring; 1 dan kiçik miqdor uçun ham uni çaqiring. `"3"`, `"uç"` va `"0"` uçun natijani yoki xatoni va uning `__cause__` ini çop eting.

::: details Yeçim
```python
class QuantityError(ValueError):
    pass

def parse_quantity(text):
    try:
        quantity = int(text)
    except ValueError:
        raise QuantityError(f"quantity must be a whole number, got {text!r}") from None
    if quantity < 1:
        raise QuantityError(f"quantity must be at least 1, got {quantity}")
    return quantity

for text in ["3", "uç", "0"]:
    try:
        print(parse_quantity(text))
    except QuantityError as e:
        print(f"Xato: {e} (sababi: {e.__cause__})")
```

```text
3
Xato: quantity must be a whole number, got 'uç' (sababi: None)
Xato: quantity must be at least 1, got 0 (sababi: None)
```
:::

## Xulosa

- `raise ValueError("xabar")` funksiyani töxtatib, xatoni çaqiruvçiga uzatadi. Muammoga mos turni tanlang.
- Yalanğoç `raise` qayta çaqiradi; `from e` sababni saqlaydi, `from None` uni yaşiradi.
- `class MyError(Exception): pass` maxsus istisno yaratadi; bolalari bor asosiy klass çaqiruvçilarga keng yoki aniq uşlaş imkonini beradi.
- `assert` dasturçi tekşiruvlari uçun; `raise` kiritiş va maʼlumotlar uçun.
- Yaxşi xabarlar nima notöğri ekanini, nima kelganini va nimaga ruxsat borligini aytadi.

## Qöşimça manbalar

- [Python Tutorial: Raising Exceptions and User-defined Exceptions](https://docs.python.org/3/tutorial/errors.html#raising-exceptions)
- [The `raise` statement (language reference)](https://docs.python.org/3/reference/simple_stmts.html#the-raise-statement)
- [The `assert` statement (language reference)](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)
- [PEP 3134: Exception Chaining](https://peps.python.org/pep-3134/)
