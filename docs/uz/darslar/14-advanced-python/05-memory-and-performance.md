---
title: Xotira va samaradorlik
description: "Optimallaştirişdan oldin ölçang: kodni timeit bilan vaqtlang, xotirani sys.getsizeof va tracemalloc bilan tekşiring, havolalar soni va gc ni tuşuning, cProfile bilan profillang va sinalgan tezlaştirişlarni qöllang."
---

# Xotira va samaradorlik

![Rasm: Xotira va samaradorlik](/images/topics-webp-uzb/memory-and-performance.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `timeit` va `time.perf_counter` bilan tezlikni qanday **ölçaş**
- `sys.getsizeof` nimani körsatadi va `tracemalloc` xotira **qayerga** ketayotganini qanday körsatadi
- **Havolalar soni** (reference count), `gc` va `weakref` obyektlar qaçon böşatilişini qanday hal qiladi
- **`cProfile`** va `pstats` bilan sekin funksiyalarni qanday topiş
- Qaysi tezlaştirişlar muhim (töplamlar, `join`, örnatilgan funksiyalar, `lru_cache`) va qaçon optimallaştirmaslik kerak
:::

## Nega bu muhim

Samarqanddagi dökonning savdo hisoboti 40 daqiqa tayyorlanadi yoki veb-ilova asta-sekin xotirani yeb boradi. Odatda bunga bitta sekin qidiruv yoki öşib borayotgan röyxat aybdor. Pythonning örnatilgan vositalari öşa joyni **topadi**, şunda siz muhim kodni tuzatasiz, qolgani esa öqişli bölib qoladi.

## Taxmin qilişdan oldin ölçang

**`timeit`** ifodani köp marta bajaradi va jami soniyalarni qaytaradi; `timeit.repeat` buni bir neça marta takrorlaydi, ular orasidagi **eng kiçigi** esa şovqini eng kam natija:

```python
import timeit

ids = list(range(10_000))
ids_set = set(ids)

list_best = min(timeit.repeat("9_999 in ids", globals=globals(), number=1_000, repeat=5))
set_best = min(timeit.repeat("9_999 in ids_set", globals=globals(), number=1_000, repeat=5))

print("töplam tezroq:", set_best < list_best)
```

```text
töplam tezroq: True
```

Bitta noutbukda röyxat `0.103` soniya, töplam esa `0.00004` soniya oldi. Sizdagi sonlar boşqaça böladi, şuning uçun misol faqat taqqoslaşni çop etadi. Butun funksiyalarni vaqtlaş uçun `time.perf_counter()` (yuqori aniqlikdagi soat) *Closure va dekoratorlar* darsidagi kabi dekoratorga mos tuşadi:

```python
import time

timings = {}

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        timings[func.__name__] = time.perf_counter() - start
        return result
    return wrapper

@timer
def loop_total(numbers):
    total = 0
    for n in numbers:
        total += n
    return total

@timer
def builtin_total(numbers):
    return sum(numbers)

numbers = list(range(1_000_000))
print(loop_total(numbers) == builtin_total(numbers))
print("eng tezi:", min(timings, key=timings.get))
```

```text
True
eng tezi: builtin_total
```

Öşa noutbukda `timings` taxminan `0.027` va `0.007` soniyani saqladi: `sum` kabi örnatilgan funksiyalar C tilida işlaydi.

## Obyekt qança joy egallaydi?

`sys.getsizeof(obj)` **faqat şu obyektning** baytlarini qaytaradi. Röyxat elementlariga havolalarni saqlaydi, şuning uçun uning ölçamiga elementlarning özi kirmaydi:

```python
import sys

short = [letter for letter in "abc"]
long = [letter * 10_000 for letter in "abc"]

print(sys.getsizeof(7), sys.getsizeof("Toşkent"))
print(sys.getsizeof(short), sys.getsizeof(long))
print(sys.getsizeof([n for n in range(1_000)]), sys.getsizeof(n for n in range(1_000)))
```

```text
28 72
88 88
8856 200
```

Bu sonlar 64-bitli CPython 3.14 uçun; bu saytdagi muharrir 32-bitli yiğmada işlaydi, şuning uçun undagi sonlar kiçikroq. Muhimi qonuniyat: biri 30,000 belgini saqlasa ham, ikkala röyxat 88 bayt, generator (*Iteratorlar va generatorlar*) esa röyxat össa ham kiçikligiça qoladi.

## Havolalar soni, `gc` va `weakref`

CPython har bir obyektga **havolalar**ni sanaydi: unga işora qiladigan har bir nom, röyxat katakçasi yoki atribut. Son nolga yetganda obyekt darhol böşatiladi. `sys.getrefcount` bu sonni (vaqtinçalik havolalar bilan birga) körsatadi, şuning uçun farqlarni soliştiring:

```python
import sys

prices = [15000, 8000]
before = sys.getrefcount(prices)

basket = prices
orders = {"tuşlik": prices}
print(sys.getrefcount(prices) - before)

del basket
print(sys.getrefcount(prices) - before)
```

```text
2
1
```

**Halqa** (cycle) bölganda sanaş yordam bermaydi: bir-biriga işora qiladigan obyektlar heç qaçon nolga yetmaydi. **Çiqindi yiğuvçi** (garbage collector, `gc`) bunday guruhlarni vaqti-vaqti bilan topadi; `gc.collect()` uni hozir işga tuşiradi. **Kuçsiz havola** (weak reference) obyektni tirik saqlamasdan kuzatadi:

```python
import gc
import weakref

class Customer:
    def __init__(self, name):
        self.name = name
        self.friend = None

gc.disable()                        # faqat biz söraganda yiğadi
aziza = Customer("Aziza")
bobur = Customer("Bobur")
aziza.friend = bobur
bobur.friend = aziza                # halqa
watch = weakref.ref(aziza)          # watch() obyektni yoki None ni beradi

del aziza, bobur
print("del dan keyin tirik:", watch() is not None)
print("gc çiqindi topdi:", gc.collect() > 0)
print("collect dan keyin tirik:", watch() is not None)
gc.enable()
```

```text
del dan keyin tirik: True
gc çiqindi topdi: True
collect dan keyin tirik: False
```

Kuçsiz havolalar xavfsiz keşlar ham yaratadi: `weakref.WeakValueDictionary` yozuvning qiymatidan boşqa joyda foydalanilmay qolişi bilanoq uni öçiradi.

## Xotira qayerga ketayotganini topiş: `tracemalloc`

**`tracemalloc`** har bir xotira ajratilişini va uni bajargan qatorni yozib boradi:

```python
import tracemalloc

def load_orders():
    return [{"id": n, "city": "Toşkent", "total": n * 1000} for n in range(50_000)]

def load_names():
    return [f"mijoz-{n}" for n in range(50_000)]

tracemalloc.start()
orders = load_orders()
names = load_names()
snapshot = tracemalloc.take_snapshot()
tracemalloc.stop()

for stat in snapshot.statistics("lineno")[:2]:
    frame = stat.traceback[0]
    print(f"{frame.lineno}-qator: {stat.size / 1_000_000:.1f} MB")
```

```text
4-qator: 12.8 MB
7-qator: 3.0 MB
```

Qarab çiqiş kerak bölgan joy - luğatlar yaratiladigan 4-qator. **Köplab kiçik obyektlar** uçun *Python maʼlumot modeli* darsidagi `__slots__` yordam beradi; `get_traced_memory()` joriy va eng yuqori bayt sonlarini qaytaradi:

```python
import tracemalloc

class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

class SlotPoint:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x, self.y = x, y

for cls in (Point, SlotPoint):
    tracemalloc.start()
    points = [cls(n, n) for n in range(100_000)]
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    print(f"{cls.__name__}: har bir nuqtaga {current // 100_000} bayt")
```

```text
Point: har bir nuqtaga 127 bayt
SlotPoint: har bir nuqtaga 87 bayt
```

(64-bitli CPython, röyxat va butun sonlar bilan birga.) Uçdan bir qism tejaş millionlab obyektlarda sezilarli bölib qoladi.

## Sekin kodni topiş: `cProfile`

**Profilçi** (profiler) har bir funksiya neça marta va qança vaqt işlaganini yozib boradi; `pstats` natijalarni öqiydi:

```python
import cProfile
import pstats

def parse(line):
    city, amount = line.split(",")
    return city, int(amount)

def total_by_city(lines):
    totals = {}
    for line in lines:
        city, amount = parse(line)
        totals[city] = totals.get(city, 0) + amount
    return totals

lines = ["Toşkent,15000", "Samarqand,8000", "Buxoro,12000"] * 20_000

with cProfile.Profile() as profiler:
    total_by_city(lines)

stats = pstats.Stats(profiler).strip_dirs()
calls = stats.get_stats_profile().func_profiles
print("parse", calls["parse"].ncalls, "marta işladi")
```

```text
parse 60000 marta işladi
```

Töliq jadval uçun `stats.sort_stats("cumulative").print_stats(2)` ni çaqiring. Bir işga tuşirişda u quyidagini çop etdi (sizdagi vaqtlar boşqaça böladi):

```text
   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.028    0.028    0.075    0.075 sales.py:8(total_by_city)
    60000    0.026    0.000    0.038    0.000 sales.py:4(parse)
```

`cumtime` çaqirilgan funksiyalarni ham öz içiga oladi, `tottime` esa yöq. Öz kodingizdagi eng katta `cumtime` dan boşlang.

## Keng tarqalgan tezlaştirişlar

Profil qizğin joyni (hot spot) topgaç, köp hollarda quyidagi tuzatişlar yetarli:

- **Töğri maʼlumot tuzilmasi:** töplamda `in` bir zumda işlaydi; röyxat esa har bir elementni tekşiradi.
- Siklda `text += part` örniga **`"".join(parts)`**.
- Qölda yozilgan sikllar örniga **örnatilgan funksiyalar va comprehensionlar**.
- Juda qizğin sikllarda **lokal nomlar**: `sqrt = math.sqrt` har qadamda bitta qidiruvni tejaydi (kiçik yutuq).
- Takroriy işni `functools.lru_cache` bilan **keşlaş**:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def route_count(rows, cols):
    if rows == 1 or cols == 1:
        return 1
    return route_count(rows - 1, cols) + route_count(rows, cols - 1)

print(route_count(16, 16))
print(route_count.cache_info())
```

```text
155117520
CacheInfo(hits=196, misses=255, maxsize=None, currsize=255)
```

Keşsiz bu taxminan 310 million çaqiruv qiladi; keş bilan esa 451 ta.

**Qaçon optimallaştirmaslik kerak:** bir marta işlaydigan, tez tugaydigan yoki profilning yuqorisiga yaqin bölmagan kodni. Tuşunarli kod heç kimga kerak bölmagan tez koddan yaxşiroq.

## Özingiz sinab köring

`n` ni 100,000 ga özgartiring va farq qanday öşişini kuzating.

<ClientOnly><PythonPlayground :code='"import timeit\n\nn = 1_000\nitems = list(range(n))\nitems_set = set(items)\n\nlist_time = timeit.timeit(lambda: (n - 1) in items, number=1_000)\nset_time = timeit.timeit(lambda: (n - 1) in items_set, number=1_000)\nprint(f\"röyxat: {list_time:.5f} s\")\nprint(f\"töplam: {set_time:.5f} s\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Har xil hajmdagi işni soliştiriş

```py
import timeit

loop = timeit.timeit("[n * 2 for n in range(1000)]", number=10_000)
builtin = timeit.timeit("list(map(lambda n: n * 2, range(1000)))", number=100)
print(loop, builtin)
```

```text
0.3371560389999786 0.0063662349999731305
```

Birinçisi 10,000 marta, ikkinçisi 100 marta işladi, şuning uçun `map` 50 barobar tezroq körinadi; bir xil `number` bilan esa u ikki barobar sekinroq. **Tuzatiş:** bir xil `number`, bir xil maʼlumot va `min(timeit.repeat(...))` dan foydalaning.

### 2. `time.time()` bilan bir marta vaqtlaş

```py
import time

start = time.time()
total = sum(range(10_000))
print(time.time() - start)
```

```text
0.00016045570373535156
```

Bitta kiçik işga tuşiriş asosan şovqin, `time.time()` esa tizim soati bilan birga sakraşi mumkin. **Tuzatiş:** kiçik kod bölaklari uçun `timeit`, uzunroq vazifalar uçun `time.perf_counter()` dan foydalaning.

### 3. Tasodifiy havola maʼlumotni tirik saqlaydi

```python
import weakref

class Report:
    def __init__(self, rows):
        self.rows = rows

def row_count(report, seen=[]):      # Yomon: bu röyxat funksiya qança yaşasa, şunça yaşaydi
    seen.append(report)
    return len(report.rows)

report = Report(list(range(1_000_000)))
alive = weakref.ref(report)
print(row_count(report))
del report
print("hali ham xotirada:", alive() is not None)
```

```text
1000000
hali ham xotirada: True
```

Standart qiymat sifatidagi röyxat unga uzatilgan har bir hisobotni saqlab qoladi; global özgaruvçilar va çeklanmagan keşlar ham şunday qilişi mumkin. **Tuzatiş:** kerak bölmagan narsani saqlamang.

### 4. Bir marta işlaydigan kodni optimallaştiriş

```python
cities = "Toşkent,Samarqand,Buxoro".split(",")
# Yomon: bir marta işlaydigan koddagi tuşunarsiz "tezlik hiylasi"
lookup = dict(map(reversed, enumerate(cities)))
# Yaxşi: ravşan; farq mikrosoniyalarda
clear = {city: i for i, city in enumerate(cities)}
print(lookup == clear, clear)
```

```text
True {'Toşkent': 0, 'Samarqand': 1, 'Buxoro': 2}
```

**Tuzatiş:** faqat profil sekin deb körsatgan joyni optimallaştiring.

## Maşqlar

### 1. Sayoz va çuqur ölçam <Difficulty level="1" />

`deep_size(items)` ni yozing: röyxatning `sys.getsizeof` i va uning elementlari ölçamlari yiğindisi. `words = [word * 1000 for word in ["palov", "somsa"]]` va `short = [word[0] for word in words]` uçun `deep_size(words) > sys.getsizeof(words)` ekanini, keyin `sys.getsizeof(words) == sys.getsizeof(short)` ekanini çop eting.

::: details Yeçim
```python
import sys

def deep_size(items):
    return sys.getsizeof(items) + sum(sys.getsizeof(item) for item in items)

words = [word * 1000 for word in ["palov", "somsa"]]
short = [word[0] for word in words]
print(deep_size(words) > sys.getsizeof(words))
print(sys.getsizeof(words) == sys.getsizeof(short))
```

```text
True
True
```
:::

### 2. Obyekt yöqolişini kuzatiş <Difficulty level="1" />

`Order` yarating, unga `weakref.finalize(order, print, "42-buyurtma böşatildi")` ni biriktiring, `öçirilmoqda...` ni çop eting, obyektni öçiring, keyin `tayyor` ni çop eting.

::: details Yeçim
```python
import weakref

class Order:
    pass

order = Order()
weakref.finalize(order, print, "42-buyurtma böşatildi")
print("öçirilmoqda...")
del order
print("tayyor")
```

```text
öçirilmoqda...
42-buyurtma böşatildi
tayyor
```
:::

### 3. Haqiqiy işni sanang <Difficulty level="2" />

`delivery_cost(city)` `{"Toşkent": 20000, "Buxoro": 35000, "Nukus": 50000}` dan narxni topadi va global `calls` hisoblagiçiga bir qöşadi (buni sekin maʼlumotlar bazasi sörovi deb tasavvur qiling). Uni `@lru_cache(maxsize=None)` bilan keşlang, keyin Toşkent, Buxoro, Toşkent, Nukus, Buxoro, Toşkentga buyurtmalar uçun jami narxni, `calls` ni va `delivery_cost.cache_info()` ni çop eting.

::: details Yeçim
```python
from functools import lru_cache

PRICES = {"Toşkent": 20000, "Buxoro": 35000, "Nukus": 50000}
calls = 0

@lru_cache(maxsize=None)
def delivery_cost(city):
    global calls
    calls += 1                  # sekin qism faqat keşda topilmaganda işlaydi
    return PRICES[city]

orders = ["Toşkent", "Buxoro", "Toşkent", "Nukus", "Buxoro", "Toşkent"]
print(sum(delivery_cost(city) for city in orders))
print(calls)
print(delivery_cost.cache_info())
```

```text
180000
3
CacheInfo(hits=3, misses=3, maxsize=None, currsize=3)
```

:::

### 4. Töğri tuzilmani tanlang <Difficulty level="2" />

Taqiqlangan `spam`, `arzon` va `oltin` sözlarini (ular töplamda saqlanadi) `***` bilan almaştiradigan `clean(message)` ni yozing. `"hoziroq arzon oltin oling"`, `"Toşkentdan salom"` va `"bu yerda arzon spam"` ni tozalab çop eting.

::: details Yeçim
```python
banned = {"spam", "arzon", "oltin"}

def clean(message):
    return " ".join("***" if word in banned else word for word in message.split())

for message in ["hoziroq arzon oltin oling", "Toşkentdan salom", "bu yerda arzon spam"]:
    print(clean(message))
```

```text
hoziroq *** *** oling
Toşkentdan salom
bu yerda *** ***
```
:::

### 5. Profillang, tuzating, yana profillang <Difficulty level="3" />

`is_prime_slow(n)` 2 dan `n - 1` gaça har bir `d` uçun `divides(d, n)` ni çaqiradi. `d * d > n` bölişi bilan töxtaydigan `is_prime_fast(n)` ni yozing. Har biri bilan 2 dan 2,999 gaça tub sonlarni sanaşni profillang va funksiya nomini, sonini hamda `divides` neça marta işlaganini çop eting.

::: details Yeçim
```python
import cProfile
import pstats

def divides(d, n):
    return n % d == 0

def is_prime_slow(n):
    for d in range(2, n):
        if divides(d, n):
            return False
    return True

def is_prime_fast(n):
    d = 2
    while d * d <= n:
        if divides(d, n):
            return False
        d += 1
    return True

for is_prime in (is_prime_slow, is_prime_fast):
    with cProfile.Profile() as profiler:
        count = sum(1 for n in range(2, 3_000) if is_prime(n))
    calls = pstats.Stats(profiler).get_stats_profile().func_profiles["divides"].ncalls
    print(is_prime.__name__, count, calls)
```

```text
is_prime_slow 430 601875
is_prime_fast 430 23091
```

Çaqiruvlar soni kompyuteringiz tezligiga boğliq emas.
:::

## Xulosa

- Avval ölçang: kod bölaklari uçun `min(timeit.repeat(...))`, funksiyalar uçun `@timer` içida `time.perf_counter()`.
- `sys.getsizeof` sayoz ölçaydi; `tracemalloc` qaysi qatorlar eng köp xotira ajratişini körsatadi.
- Havolalar soni nolga yetganda obyekt öladi; `gc` halqalarni yiğadi; `weakref` obyektni tirik saqlamaydi.
- `cumulative` böyiça saralangan `pstats` bilan `cProfile` vaqt qayerga ketayotganini körsatadi.
- Töplamlar, `join`, örnatilgan funksiyalar, `lru_cache` va `__slots__` köp qizğin joylarni tuzatadi; bir marta işlaydigan kodga tegmang.

## Qöşimça manbalar

- [`timeit`: measure execution time of small code snippets](https://docs.python.org/3/library/timeit.html)
- [The Python profilers (`cProfile`, `pstats`)](https://docs.python.org/3/library/profile.html)
- [`tracemalloc`: trace memory allocations](https://docs.python.org/3/library/tracemalloc.html)
- [`gc`](https://docs.python.org/3/library/gc.html) va [`weakref`](https://docs.python.org/3/library/weakref.html)
