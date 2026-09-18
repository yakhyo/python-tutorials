---
title: Closure va dekoratorlar
description: "Closurelar qiymatlarni qanday eslab qolişini örganing, functools.wraps bilan öz dekoratorlaringizni yozing, dekoratorlarga argument qöşing, ularni ustma-ust qöying hamda haqiqiy kodda keşlaş, partial va klass dekoratorlaridan foydalaning."
---

# Closure va dekoratorlar

![Rasm: Closure va dekoratorlar](/images/topics-webp-uzb/closures-and-decorators.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Closure** nima va içki funksiyaga qaçon `nonlocal` kerak
- `*args`, `**kwargs` va `functools.wraps` bilan **dekoratorni** (decorator) qadamma-qadam qanday yoziş
- **Argumentli dekoratorlar** qanday işlaydi va ustma-ust qöyilgan dekoratorlar qaysi tartibda bajariladi
- `functools.lru_cache` va `functools.partial` dan qanday foydalaniş
- Registry (registr) kabi **klass dekoratorlari** (va `@dataclass`) qanday işlaydi
:::

## Nega bu muhim

Siz dekoratorlardan ança vaqtdan beri foydalanib kelyapsiz: *Xossalar va inkapsulyatsiya* darsida `@property`, *Klass atributlari, klass metodlari va statik metodlar* darsida `@classmethod` va `@staticmethod`, *with operatori* darsida `@contextmanager`, *pytest bilan testlaş* darsida esa `@pytest.mark.parametrize`. Har safar `@` qatori biroz sehrdek tuyulgan. Aslida unday emas. Dekorator - oddiy funksiya, uni yoza olsangiz, köp funksiyalarga ularning kodiga tegmasdan logging, keşlaş, qayta urinişlar yoki tekşiruvlar qöşa olasiz.

## Closurelar va `nonlocal`

*Lambda va yuqori tartibli funksiyalar* darsida funksiyalar **qiymat** ekanini kördingiz: ularni uzatiş va qaytariş mumkin. Içki funksiya özini yaratgan funksiyaning özgaruvçisidan foydalansa, taşqi funksiya işini tugatgandan keyin ham u özgaruvçini tirik saqlaydi. Aynan şu **closure** (özini örab turgan muhitni eslab qoluvçi funksiya) deb ataladi:

```python
def make_ticket_counter(prefix):
    number = 0

    def next_ticket():
        nonlocal number     # taşqi özgaruvçiga qiymat beriş
        number += 1
        return f"{prefix}{number}"

    return next_ticket

bank = make_ticket_counter("A")
print(bank(), bank(), bank())

pharmacy = make_ticket_counter("B")   # yangi, alohida number
print(pharmacy())
```

```text
A1 A2 A3
B1
```

`prefix` kabi taşqi özgaruvçini öqiş uçun heç narsa kerak emas, lekin unga **qiymat beriş** uçun *Özgaruvçilarning köriniş sohasi* darsida tuşuntirilganidek `nonlocal` kerak. `make_ticket_counter()` ning har bir çaqiruvi öz `number` ini yaratadi, şuning uçun `bank` va `pharmacy` bir-biriga xalaqit bermaydi.

## Dekoratorni qadamma-qadam yoziş

**Dekorator** (decorator) - funksiyani qabul qilib, yangi funksiya qaytaradigan funksiya. Odatda bu asl çaqiruv atrofida qöşimça iş bajaradigan içki `wrapper`, yaʼni **örovçi funksiya** (wrapper) böladi. Istalgan funksiya bilan işlaşi uçun örovçi funksiya `*args, **kwargs` ni qabul qiladi, ularni uzatadi va **natijani qaytaradi**:

```python
def announce(func):
    def wrapper(*args, **kwargs):
        print(f"{func.__name__} çaqirilmoqda: {args} {kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} qaytardi: {result!r}")
        return result
    return wrapper

def add(a, b):
    return a + b

add = announce(add)          # qölda dekoratsiya qiliş
add(2, 3)

@announce                    # @ bilan xuddi şu narsa
def total_price(price, quantity=1):
    return price * quantity

total = total_price(15000, quantity=3)
print(total)
```

```text
add çaqirilmoqda: (2, 3) {}
add qaytardi: 5
total_price çaqirilmoqda: (15000,) {'quantity': 3}
total_price qaytardi: 45000
45000
```

`def` ustidagi `@announce` aynan `total_price = announce(total_price)` degani. Endi nom `wrapper` ni körsatadi, `wrapper` esa asl funksiyaga `func` closure özgaruvçisi orqali yetib boradi.

## `functools.wraps`

Nom `wrapper` ni körsatgani uçun funksiya öz `__name__` va docstringini yöqotadi, holbuki logging, `help()` va pytest ularni öqiydi. `functools.wraps` ularni asl funksiyadan örovçi funksiyaga köçiradi:

```python
from functools import wraps

def plain(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

def careful(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@plain
def greet(name):
    """Salomlaşiş matnini qaytaradi."""
    return f"Salom, {name}!"

@careful
def farewell(name):
    """Xayrlaşiş matnini qaytaradi."""
    return f"Xayr, {name}!"

print(greet.__name__, greet.__doc__)
print(farewell.__name__, farewell.__doc__)
```

```text
wrapper None
farewell Xayrlaşiş matnini qaytaradi.
```

`@wraps(func)` ning özi ham argumentli dekorator. Undan doim foydalaning.

## Argumentli dekoratorlar

`@retry(times=3)` da qavslar bor, şuning uçun avval `retry(times=3)` bajariladi va u **dekorator qaytarişi** kerak. Bu yana bir daraja içma-iç joylaşuv degani: örovçi funksiya qaytaradigan dekoratorni qaytaradigan **fabrika** (factory):

```python
from functools import wraps

def retry(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except ConnectionError as error:
                    print(f"  {attempt}-uriniş muvaffaqiyatsiz: {error}")
            raise ConnectionError(f"{times} ta urinişdan keyin taslim bölindi")
        return wrapper
    return decorator

answers = iter(["timeout", "timeout", "1 USD = 12,650 söm"])

@retry(times=3)
def fetch_rate():
    answer = next(answers)
    if answer == "timeout":
        raise ConnectionError(answer)
    return answer

print(fetch_rate())
```

```text
  1-uriniş muvaffaqiyatsiz: timeout
  2-uriniş muvaffaqiyatsiz: timeout
1 USD = 12,650 söm
```

Qölda yozilsa, bu `fetch_rate = retry(times=3)(fetch_rate)`. `times` closureda yaşaydi, şuning uçun har bir dekoratsiya qilingan funksiyaning öz sozlamasi bor.

## Dekoratorlarni ustma-ust qöyiş

Bitta funksiyaga bir neça dekorator qöyiş mumkin. Ular **pastdan yuqoriga qöllanadi** (`def` ga eng yaqini birinçi öraydi), şuning uçun çaqiruv paytida **eng yuqoridagisi eng taşqarida** işlaydi:

![Diagramma: Ustma-ust dekoratorlar](/images/companions-webp-uzb/decorator-stack.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

```python
from functools import wraps

def bold(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return "<b>" + func(*args, **kwargs) + "</b>"
    return wrapper

def italic(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return "<i>" + func(*args, **kwargs) + "</i>"
    return wrapper

@bold
@italic
def city(name):
    return name

print(city("Samarqand"))     # bold(italic(city))
```

```text
<b><i>Samarqand</i></b>
```

Haqiqiy kodda ham tartib muhim: `@retry` ni `@announce` dan taşqariga qöysangiz, har bir uriniş log qilinadi; ularning örnini almaştirsangiz, faqat qayta urinilgan butun çaqiruv log qilinadi.

## `lru_cache` va `partial`

`functools` da şu ğoyalar asosida qurilgan tayyor vositalar bor. `lru_cache` oldingi natijalarni eslab qoladi, şuning uçun sekin rekursiv Fibonaççi tezlaşadi. Çaqiruvlarni sanang:

```python
from functools import lru_cache

calls = 0

def fib(n):
    global calls
    calls += 1
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(25), "çaqiruvlar:", calls)

calls = 0

@lru_cache(maxsize=None)
def fast_fib(n):
    global calls
    calls += 1
    return n if n < 2 else fast_fib(n - 1) + fast_fib(n - 2)

print(fast_fib(25), "çaqiruvlar:", calls)
print(fast_fib.cache_info())
```

```text
75025 çaqiruvlar: 242785
75025 çaqiruvlar: 26
CacheInfo(hits=23, misses=26, maxsize=None, currsize=26)
```

`@functools.cache` - `lru_cache(maxsize=None)` ning qisqa şakli. Argumentlar hashable bölişi kerak; faqat natijasi argumentlaridan boşqa heç narsaga boğliq bölmagan funksiyalarni keşlang.

`partial` baʼzi argumentlarni oldindan töldiradi va sizga yangi funksiya beradi - bu siz yozişingiz şart bölmagan closure:

```python
from functools import partial

def price_with_tax(price, rate):
    return round(price * (1 + rate))

with_vat = partial(price_with_tax, rate=0.12)
print(with_vat(100000))
```

```text
112000
```

## Klass dekoratorlari

Dekorator **klassni** ham qabul qilişi, u bilan biror iş qilişi va uni qaytarişi mumkin. Keng tarqalgan qöllaniş - klasslarni nomi böyiça yiğadigan **registr** (registry):

```python
PAYMENT_METHODS = {}

def register(cls):
    PAYMENT_METHODS[cls.__name__.lower()] = cls
    return cls                  # klassni özgarişsiz qaytarib beriş

@register
class Cash:
    fee = 0

@register
class Card:
    fee = 0.01

print(list(PAYMENT_METHODS))
method = PAYMENT_METHODS["card"]()
print(type(method).__name__, method.fee)
```

```text
['cash', 'card']
Card 0.01
```

Endi yangi tölov usulini qöşiş - ustida `@register` turgan klass yoziş, xolos. *Dataclasslar* darsidagi `@dataclass` ham klass dekoratori: u annotatsiyalarni öqiydi va klassni qaytarişdan oldin unga `__init__`, `__repr__` va `__eq__` ni qöşadi.

## Özingiz sinab köring

`@count_calls` bilan boşqa funksiyani dekoratsiya qiling yoki örovçi funksiya argumentlarni ham çop etadigan qiling.

<ClientOnly><PythonPlayground :code='"from functools import wraps\n\ndef count_calls(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        print(f\"[{func.__name__}: {wrapper.calls}-çaqiruv]\")\n        return func(*args, **kwargs)\n    wrapper.calls = 0\n    return wrapper\n\n@count_calls\ndef order_total(price, quantity=1):\n    return price * quantity\n\nprint(order_total(15000))\nprint(order_total(8000, quantity=3))\nprint(\"Jami çaqiruvlar:\", order_total.calls)"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Örovçi funksiyani qaytarişni unutiş

```py
def announce(func):
    def wrapper(*args, **kwargs):
        print("Çaqirilmoqda:", func.__name__)
        return func(*args, **kwargs)
    # Yomon: return wrapper yöq

@announce
def greet(name):
    return f"Salom, {name}!"

print(greet("Aziza"))
```

```text
TypeError: 'NoneType' object is not callable
```

Dekorator `None` qaytardi, şuning uçun `greet` `None` ga teng. `return wrapper()` ham xuddi şunday notöğri: u funksiyani dekoratsiya paytidayoq çaqiradi. **Tuzatiş:** dekoratorni qavslarsiz `return wrapper` bilan tugating.

### 2. `@wraps` ni unutiş

```python
def logged(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@logged
def home():
    return "Boş sahifa"

@logged
def about():
    return "Biz haqimizda"

pages = {page.__name__: page for page in [home, about]}
print(list(pages))
print(pages["wrapper"]())
```

```text
['wrapper']
Biz haqimizda
```

Ikkala funksiyaning ham nomi `wrapper`, şuning uçun ikkinçisi birinçisining ustidan yozildi. **Tuzatiş:** `def wrapper` ustiga `@wraps(func)` qöying.

### 3. Qaytariladigan qiymatni yutib yuboriş

```python
def announce(func):
    def wrapper(*args, **kwargs):
        print("Çaqirilmoqda:", func.__name__)
        func(*args, **kwargs)       # Yomon: natija taşlab yuboriladi
    return wrapper

@announce
def total(prices):
    return sum(prices)

print("Jami:", total([15000, 8000]))
```

```text
Çaqirilmoqda: total
Jami: None
```

**Tuzatiş:** `return func(*args, **kwargs)` yozing yoki natijani `result` ga saqlab, oxirida qaytaring.

### 4. Taşqi özgaruvçini `nonlocal` siz özgartiriş

```py
def make_counter():
    count = 0
    def counter():
        count += 1          # Yomon: qiymat beriş count ni lokal qiladi
        return count
    return counter

tick = make_counter()
tick()
```

```text
UnboundLocalError: cannot access local variable 'count' where it is not associated with a value
```

**Tuzatiş:** `counter` ning birinçi qatori sifatida `nonlocal count` qöşing.

## Maşqlar

### 1. Har bir çaqiruvni log qiliş <Difficulty level="1" />

Har bir çaqiruvdan oldin `log: NOM(ARGUMENTLAR)` ni çop etadigan va natijani qaytaradigan `@log_calls` dekoratorini yozing. `add(a, b)` ni dekoratsiya qiling va `add(2, 3)` ni çop eting.

::: details Yeçim
```python
from functools import wraps

def log_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"log: {func.__name__}{args}")
        return func(*args, **kwargs)
    return wrapper

@log_calls
def add(a, b):
    return a + b

print(add(2, 3))
```

```text
log: add(2, 3)
5
```
:::

### 2. Joriy qoldiq <Difficulty level="1" />

`spend(amount)` funksiyasini qaytaradigan `make_wallet(balance)` ni yozing. Har bir çaqiruv summani ayiradi va yangi qoldiqni qaytaradi. 100,000 sömdan boşlang, avval 25,000, keyin 40,000 sarflang va har bir yangi qoldiqni çop eting.

::: details Yeçim
```python
def make_wallet(balance):
    def spend(amount):
        nonlocal balance
        balance -= amount
        return balance
    return spend

spend = make_wallet(100000)
print(spend(25000))
print(spend(40000))
```

```text
75000
35000
```
:::

### 3. Qölda memoizatsiya <Difficulty level="2" />

`functools` siz natijalarni closure içidagi luğatda saqlaydigan `@memoize` ni yozing. Rekursiv `fib` ni dekoratsiya qiling, uning tanasi neça marta bajarilişini sanang va `fib(30)` hamda sanoqni çop eting.

::: details Yeçim
```python
from functools import wraps

def memoize(func):
    cache = {}

    @wraps(func)
    def wrapper(n):
        if n not in cache:
            cache[n] = func(n)
        return cache[n]
    return wrapper

runs = 0

@memoize
def fib(n):
    global runs
    runs += 1
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(30))
print("tana", runs, "marta bajarildi")
```

```text
832040
tana 31 marta bajarildi
```

Rekursiv çaqiruvlar dekoratsiya qilingan `fib` nomi orqali ötadi, şuning uçun ular ham keşdan foydalanadi.
:::

### 4. Argumentli takrorlaş <Difficulty level="2" />

Funksiyani `n` marta çaqirib, barça natijalar röyxatini qaytaradigan `@repeat(n)` ni yozing. `iter([3, 6, 2])` dan keyingi sonni qaytaradigan `roll()` ni `@repeat(3)` bilan dekoratsiya qiling va natijani çop eting.

::: details Yeçim
```python
from functools import wraps

def repeat(n):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            return [func(*args, **kwargs) for _ in range(n)]
        return wrapper
    return decorator

dice = iter([3, 6, 2])

@repeat(3)
def roll():
    return next(dice)

print(roll())
print(roll.__name__)
```

```text
[3, 6, 2]
roll
```
:::

### 5. Tur tekşiruvlari <Difficulty level="3" />

`@validate_types(**types)` ni yozing, masalan `@validate_types(city=str, price=int)`. Har bir çaqiruvdan oldin har bir nomlangan argumentni (pozitsiya yoki kalit söz orqali uzatilganini) tekşiring va tur notöğri bölsa, tuşunarli xabar bilan `TypeError` çaqiring. Maslahat: `inspect.signature(func).bind(*args, **kwargs).arguments` nomlardan qiymatlarga luğat beradi. `delivery("Buxoro", 30000)` ni çop eting, keyin uni `("Nukus", "30000")` va `(42, 30000)` bilan çaqiring va har biri uçun `Xato: XABAR` ni çop eting.

::: details Yeçim
```python
import inspect
from functools import wraps

def validate_types(**types):
    def decorator(func):
        signature = inspect.signature(func)

        @wraps(func)
        def wrapper(*args, **kwargs):
            arguments = signature.bind(*args, **kwargs).arguments
            for name, expected in types.items():
                if name in arguments and not isinstance(arguments[name], expected):
                    actual = type(arguments[name]).__name__
                    raise TypeError(f"{name} {expected.__name__} bölişi kerak, {actual} berildi")
            return func(*args, **kwargs)
        return wrapper
    return decorator

@validate_types(city=str, price=int)
def delivery(city, price):
    return f"Yetkaziş ({city}): {price:,} söm"

print(delivery("Buxoro", 30000))
for args in [("Nukus", "30000"), (42, 30000)]:
    try:
        delivery(*args)
    except TypeError as error:
        print("Xato:", error)
```

```text
Yetkaziş (Buxoro): 30,000 söm
Xato: price int bölişi kerak, str berildi
Xato: city str bölişi kerak, int berildi
```

`bind` argumentlarni parametrlarga xuddi Python kabi moslaydi, şuning uçun kalit söz bilan çaqiruvlar ham tekşiriladi.
:::

## Xulosa

- **Closure** - özini örab turgan funksiyaning özgaruvçilarini eslab qoladigan içki funksiya; ularga qiymat beriş uçun `nonlocal` işlating.
- **Dekorator** funksiyani qabul qiladi va örovçi funksiya qaytaradi; `@deco` - bu `func = deco(func)`.
- Örovçi funksiyalar `*args, **kwargs` ni qabul qiladi, natijani qaytaradi va nom hamda docstringni saqlaş uçun `@wraps(func)` dan foydalanadi.
- Argumentli dekorator - fabrika: `@retry(times=3)` bu `func = retry(times=3)(func)`. Ustma-ust dekoratorlar pastdan yuqoriga qöllanadi.
- `lru_cache` natijalarni keşlaydi, `partial` argumentlarni oldindan töldiradi, Registry yoki `@dataclass` kabi klass dekoratorlari esa klassni qabul qilib, qaytaradi.

## Qöşimça manbalar

- [Glossary: decorator](https://docs.python.org/3/glossary.html#term-decorator)
- [`functools`: yuqori tartibli funksiyalar va çaqiriladigan obyektlar ustida amallar](https://docs.python.org/3/library/functools.html)
- [Reference: funksiya taʼriflari va dekoratorlar](https://docs.python.org/3/reference/compound_stmts.html#function-definitions)
- [PEP 318: funksiya va metodlar uçun dekoratorlar](https://peps.python.org/pep-0318/)
