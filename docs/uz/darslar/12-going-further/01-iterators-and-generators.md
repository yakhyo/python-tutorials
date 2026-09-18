---
title: Iteratorlar va generatorlar
description: "for sikli aslida qanday işlaşini tuşuniş: iterable va iteratorlar, iter() va next(), yield li generator funksiyalar, lazy evaluation (kerak bölganda hisoblaş), çeksiz ketma-ketliklar hamda katta fayllar uçun generator konveyerlari."
---

# Iteratorlar va generatorlar

![Rasm: Iteratorlar va generatorlar](/images/topics-webp-uzb/iterators-and-generators.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Iterable** va **iterator** orasidagi farq hamda `for` `iter()` va `next()` dan qanday foydalanişi
- Iterator klassini qanday yoziş va nega generator körinişidagi `__iter__` uni qayta işlatiladigan qiladi
- `yield` bilan generator funksiyalarni qanday yoziş
- Nega generatorlar **lazy** (qiymatlarni faqat söralganda hosil qiladi) va bu qanday qilib çeksiz ketma-ketliklarga imkon beradi
- Katta fayllar uçun generator **konveyerlari**ni qanday quriş
:::

## Nega bu muhim

Toşkentdagi gavjum onlayn dökonning log fayli 20 million qatordan iborat bölişi mumkin. Uni röyxatga yuklasangiz, dasturingizga xotira yetmay qolişi mumkin. Generator bilan esa qatorlarni **birma-bir** öqiysiz, tozalaysiz va saralaysiz, xotira sarfi esa juda kiçik bölib qoladi. Iteratorlarni tuşunsangiz, `for` sikli aslida nima qilişini ham tuşunasiz.

## Iterable va iteratorlar

Röyxatlar, satrlar, luğatlar va `range()` - **iterable** lar: ular böylab aylaniş mumkin. **Iterator** esa aylanişni amalda bajaradi: u qayerda turganini eslab qoladi va keyingi elementni beradi.

| | Iterable | Iterator |
|---|---|---|
| Misollar | list, str, dict, set, `range` | `iter()` qaytaradigan narsa, fayllar, generatorlar |
| Özining örnini eslab qoladimi? | <No /> | <Yes /> |
| `next()` bilan işlaydimi? | <No /> | <Yes /> |
| Köp marta aylanib çiqiş mumkinmi? | <Yes /> | <No />, u tugab qoladi |

Örnatilgan `iter()` iterable ni iteratorga aylantiradi, `next()` esa iteratordan bitta element söraydi. Heç narsa qolmaganda `next()` `StopIteration` çaqiradi yoki, agar berilgan bölsa, standart qiymatni qaytaradi:

```python
cities = ["Toşkent", "Samarqand"]

it = iter(cities)
print(type(it))
print(next(it))
print(next(it))
print(next(it, "boşqa şahar yöq"))
```

```text
<class 'list_iterator'>
Toşkent
Samarqand
boşqa şahar yöq
```

Röyxat özgarmadi; iterator u böylab xatçöp kabi harakatlandi.

## `for` sikli qanday işlaydi

`for` sikli - `iter()`, `next()` va `StopIteration` ning qulay sintaksisga öralgan körinişi. `for price in prices: print(price)` aynan quyidagini bajaradi:

```python
prices = [15000, 8000, 22000]

it = iter(prices)
while True:
    try:
        price = next(it)
    except StopIteration:
        break
    print(price)
```

```text
15000
8000
22000
```

Iterator faqat **oldinga** yuradi. Barça elementlarni berib bölgaç, u butunlay böşab qoladi:

```python
scores = [90, 85, 97]
it = iter(scores)

print(list(it))
print(list(it))     # iterator allaqaçon tugagan
print(sum(scores))  # röyxatning özi joyida
```

```text
[90, 85, 97]
[]
272
```

`map()`, `filter()`, `zip()`, fayllar va generatorlarning barçasi iterator qaytaradi, şuning uçun ular ham xuddi şunday tugab qoladi.

## Öz iterator klassingizni yoziş

*Operatorlar va konteynerlar* darsida `__iter__` ni körgansiz. Töliq iterator klassida ikkita metod bor: `__iter__` iteratorni qaytaradi (iterator uçun bu `self`), `__next__` esa keyingi qiymatni qaytaradi yoki `StopIteration` çaqiradi:

```python
class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

countdown = Countdown(3)
print(list(countdown))
print(list(countdown))
```

```text
[3, 2, 1]
[]
```

Ikkinçi aylaniş böş. `Countdown` özining iteratori **hisoblanadi**, şuning uçun joriy örin obyektning özida saqlanadi va bitta aylaniş uni tugatadi. Röyxat bunday işlamaydi: har bir sikl `iter()` dan yangi iterator oladi. Keyingi bölimdagi generatorlar buni tuzatişni osonlaştiradi.

## `yield` li generator funksiyalar

![Diagramma: `yield` li generator funksiyalar](/images/companions-webp-uzb/yield-timeline.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

**Generator funksiya** `return` örniga `yield` dan foydalanadi. Uni çaqiriş tanasini **işga tuşirmaydi**. U generator obyektini qaytaradi, bu esa iterator. `yield` qiymatni beradi va funksiyani **pauza** qiladi, keyingi `next()` çaqiruvi esa uni aynan `yield` dan keyingi joydan davom ettiradi:

```python
def make_tea():
    print("  [suv qaynatiladi]")
    yield "suv tayyor"
    print("  [çoy barglari solinadi]")
    yield "çoy tortildi"
    print("  [funksiya tugaydi]")

steps = make_tea()
print("Generator yaratildi, hali heç narsa işlamadi")
print(next(steps))
print(next(steps))
print(next(steps, "boşqa qadam yöq"))
```

```text
Generator yaratildi, hali heç narsa işlamadi
  [suv qaynatiladi]
suv tayyor
  [çoy barglari solinadi]
çoy tortildi
  [funksiya tugaydi]
boşqa qadam yöq
```

Uçinçi `next()` funksiyani oxirigaça bajardi, şuning uçun u `StopIteration` çaqirdi va `next` standart qiymatni qaytardi. Python lokal özgaruvçilar va örinni siz uçun saqlab turadi, şuning uçun teskari sanoq bir neçta qatorda yoziladi:

```python
def countdown(start):
    current = start
    while current > 0:
        yield current
        current -= 1

print(list(countdown(3)))
```

```text
[3, 2, 1]
```

### Qayta işlatiladigan iterable klass

Endi `Countdown` uçun tuzatiş: faqat **boşlanğiç** qiymatni saqlang va `__iter__` ni generator metod qilib yozing. Har bir sikl `__iter__` ni qaytadan çaqiradi va xuddi röyxatdagidek yangi generator oladi:

```python
class Countdown:
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        current = self.start
        while current > 0:
            yield current
            current -= 1

countdown = Countdown(3)
print(list(countdown))
print(list(countdown))
```

```text
[3, 2, 1]
[3, 2, 1]
```

Klassni sikl böylab aylanadigan qilişning odatiy usuli aynan şu.

## Generatorlar lazy

Röyxat **barça** elementlarini hozirning özida xotirada saqlaydi. Generator esa faqat joriy holatini saqlaydi va har bir elementni **söralganda** hosil qiladi. Ularning ölçamlarini `sys.getsizeof()` bilan soliştirib köring:

```python
import sys

numbers_list = [n * n for n in range(1_000_000)]
numbers_gen = (n * n for n in range(1_000_000))

print(f"röyxat:    {sys.getsizeof(numbers_list):>9,} bayt")
print(f"generator: {sys.getsizeof(numbers_gen):>9,} bayt")
print(sum(numbers_gen))
```

```text
röyxat:    8,448,728 bayt
generator:       208 bayt
333332833333500000
```

Bayt sonlari Python versiyalari va platformalarga qarab farq qiladi (bu saytdagi muharrir 32-bitli yiğmada işlaydi, şuning uçun undagi sonlar taxminan ikki barobar kiçik), lekin röyxat megabaytlarni, generator esa qança element hosil qilişidan qatʼi nazar, bir-ikki yuz baytni egallaydi. `(... for ...)` şakli *Comprehension ifodalari* darsidagi generator ifodasi.

Qiymatlar talab bölganda yaratilgani uçun generator hatto **çeksiz** işlaşi mumkin. `itertools.islice` faqat birinçi bir neçta elementni oladi:

```python
from itertools import islice

def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

print(list(islice(fibonacci(), 10)))
```

```text
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## Katta fayllar uçun generator konveyerlari

Generatorlarni zanjir qiliş mumkin: har bir qadam iterable oladi va qayta işlangan elementlarni yield qiladi, şuning uçun bitta qator keyingi qator hali öqilmasdan barça qadamlardan ötib boradi. Fayl obyekti allaqaçon qatorlar böyiça iterator, şuning uçun heç narsa birdaniga xotiraga yuklanmaydi:

```python
from pathlib import Path

Path("sales.txt").write_text(
    "Toşkent,çoy,15000\n"
    "\n"
    "Samarqand,somsa,8000\n"
    "Toşkent,qahva,45000\n"
    "buzuq qator\n",
    encoding="utf-8",
)

def read_lines(path):
    with open(path, encoding="utf-8") as file:
        for line in file:
            yield line.strip()

def skip_blank(lines):
    for line in lines:
        if line:
            yield line

def parse_sales(lines):
    for line in lines:
        parts = line.split(",")
        if len(parts) != 3:
            print(f"  taşlab ketildi: {line!r}")
            continue
        city, product, amount = parts
        yield {"city": city, "product": product, "amount": int(amount)}

sales = parse_sales(skip_blank(read_lines("sales.txt")))   # hali heç narsa öqilmadi
tashkent = (sale["amount"] for sale in sales if sale["city"] == "Toşkent")
print(f"Toşkent jami: {sum(tashkent):,} söm")
```

```text
  taşlab ketildi: 'buzuq qator'
Toşkent jami: 60,000 söm
```

`sum()` qiymatlarni oxiridan tortib oladi va butun konveyerni harakatga keltiradi. Har bir funksiya juda kiçik, uni röyxat ustida testlaş oson va u 10 gigabaytlik faylda ham işlaydi. `len()`, indekslaş kerak bölsa yoki natija böylab bir necha marta aylaniş kerak bölsa, uning örniga **röyxat** işlating.

## Özingiz sinab köring

Boşqa şaharni saralang yoki 10,000 sömdan katta summalarni qoldiradigan qadam qöşing.

<ClientOnly><PythonPlayground :code='"def read_lines(text):\n    for line in text.splitlines():\n        yield line.strip()\n\ndef skip_blank(lines):\n    for line in lines:\n        if line:\n            yield line\n\ndef parse(lines):\n    for line in lines:\n        city, product, amount = line.split(\",\")\n        yield {\"city\": city, \"product\": product, \"amount\": int(amount)}\n\ndata = \"\"\"\nToşkent,çoy,15000\nSamarqand,somsa,8000\n\nToşkent,qahva,45000\nBuxoro,çoy,12000\n\"\"\"\n\nsales = parse(skip_blank(read_lines(data)))\nchosen = (s for s in sales if s[\"city\"] == \"Toşkent\")\nfor sale in chosen:\n    print(sale[\"product\"], sale[\"amount\"])"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Tugagan iterator böylab ikki marta aylaniş

```python
evens = (n for n in range(10) if n % 2 == 0)

print(sum(evens))
print(max(evens, default="heç narsa qolmadi"))
```

```text
20
heç narsa qolmadi
```

`sum()` generatorni tugatib qöydi. **Tuzatiş:** qiymatlar ikki marta kerak bölsa, röyxat yarating.

### 2. Röyxatga `next()` ni çaqiriş

```py
cities = ["Toşkent", "Buxoro"]
print(next(cities))
```

```text
TypeError: 'list' object is not an iterator
```

Röyxat iterable, lekin iterator emas. **Tuzatiş:** `next(iter(cities))`.

### 3. `with` içidan generator qaytariş

```py
def read_lines(path):
    with open(path, encoding="utf-8") as file:
        return (line.strip() for line in file)

for line in read_lines("cities.txt"):
    print(line)
```

```text
ValueError: I/O operation on closed file.
```

`return` `with` blokidan çiqib ketadi va bu sikl bitta qatorni ham öqimasdan faylni yopadi. **Tuzatiş:** konveyerdagi `read_lines` kabi `with` bloki içida `yield` qiling, şunda qiymatlar tortib olinayotganda fayl oçiq turadi.

## Maşqlar

### 1. Qölda sikl <Difficulty level="1" />

`for` siklisiz, `while` sikli içida `iter()` va `next()` dan foydalanib, `"Samarqand"` ning har bir harfini `-` bilan ajratib çiqaring.

::: details Yeçim
```python
it = iter("Samarqand")
letters = []
while True:
    try:
        letters.append(next(it))
    except StopIteration:
        break
print("-".join(letters))
```

```text
S-a-m-a-r-q-a-n-d
```
:::

### 2. Juft sonlar generatori <Difficulty level="1" />

0 dan `limit` gaça (u ham kiradi) juft sonlarni yield qiladigan `evens(limit)` generator funksiyasini yozing. `list(evens(10))` ni çiqaring.

::: details Yeçim
```python
def evens(limit):
    n = 0
    while n <= limit:
        yield n
        n += 2

print(list(evens(10)))
```

```text
[0, 2, 4, 6, 8, 10]
```
:::

### 3. Bölaklar <Difficulty level="2" />

Bir martada `size` ta elementdan iborat röyxatlarni yield qiladigan `chunks(items, size)` generatorini yozing (oxirgi bölak qisqaroq bölişi mumkin). U bilan 7 ta talaba ismini 3 kişilik guruhlarga böling.

::: details Yeçim
```python
def chunks(items, size):
    chunk = []
    for item in items:
        chunk.append(item)
        if len(chunk) == size:
            yield chunk
            chunk = []
    if chunk:
        yield chunk

names = ["Aziza", "Bekzod", "Dilnoza", "Farrux", "Malika", "Jasur", "Nodira"]
for i, group in enumerate(chunks(names, 3), start=1):
    print(f"{i}-guruh: {group}")
```

```text
1-guruh: ['Aziza', 'Bekzod', 'Dilnoza']
2-guruh: ['Farrux', 'Malika', 'Jasur']
3-guruh: ['Nodira']
```

Oxirgi `if chunk:` qolgan elementlarni yield qiladi.
:::

### 4. Joriy balans <Difficulty level="2" />

Har bir tranzaksiyadan keyingi balansni yield qiladigan `running_balance(start, transactions)` generatorini yozing. `start=100000` va `[-25000, 40000, -60000, 15000]` tranzaksiyalari uçun har bir balansni çiqaring.

::: details Yeçim
```python
def running_balance(start, transactions):
    balance = start
    for amount in transactions:
        balance += amount
        yield balance

for balance in running_balance(100000, [-25000, 40000, -60000, 15000]):
    print(f"{balance:>8,} söm")
```

```text
  75,000 söm
 115,000 söm
  55,000 söm
  70,000 söm
```
:::

### 5. Log konveyeri <Difficulty level="3" />

Yeçimdagi `app.log` faylini yozing. Tozalangan qatorlarni öqiydigan, faqat `ERROR` qatorlarini qoldiradigan va faqat xabarning özini yield qiladigan generatorlar konveyerini quring. Har bir xabarni, xatolar sonini va `next()` bilan topilgan birinçi xatoni çiqaring.

::: details Yeçim
```python
from pathlib import Path

Path("app.log").write_text(
    "2026-09-01 INFO foydalanuvçi kirdi\n"
    "2026-09-01 ERROR tölov amalga oşmadi\n"
    "\n"
    "2026-09-02 ERROR karta rad etildi\n"
    "2026-09-03 WARNING sekin javob\n",
    encoding="utf-8",
)

def read_lines(path):
    with open(path, encoding="utf-8") as file:
        for line in file:
            yield line.strip()

def errors_only(lines):
    for line in lines:
        parts = line.split(" ", 2)
        if len(parts) == 3 and parts[1] == "ERROR":
            yield parts[2]

messages = list(errors_only(read_lines("app.log")))
for message in messages:
    print("-", message)
print("Xatolar:", len(messages))

first = next(errors_only(read_lines("app.log")), None)
print("Birinçi xato:", first)
```

```text
- tölov amalga oşmadi
- karta rad etildi
Xatolar: 2
Birinçi xato: tölov amalga oşmadi
```

`split(" ", 2)` köpi bilan ikki marta böladi, şuning uçun xabar öz böşliqlarini saqlab qoladi. `next()` faqat birinçi xato qatorigaça öqiydi.
:::

## Xulosa

- **Iterable** böylab aylaniş mumkin; **iterator** esa öz örnini eslab qoladi, `next()` bilan işlaydi va bir marta aylanişdan keyin **tugaydi**.
- `for` `iter()` ni bir marta, keyin `StopIteration` gaça `next()` ni çaqiradi.
- `yield` li funksiya har bir `yield` da pauza qiladi va keyingi sörovda davom etadi. Generator körinişidagi `__iter__` klassni köp marta aylanadigan qiladi.
- Generatorlar **lazy**: xotira sarfi juda kam, iş faqat kerak bölganda bajariladi, hatto çeksiz ketma-ketliklar ham mumkin (bir neçtasini `islice` bilan oling).
- Kiçik generatorlar zanjiri katta fayllar uçun konveyer hosil qiladi; `yield` ni `with` bloki içida saqlang.

## Qöşimça manbalar

- [Python qöllanmasi: Iteratorlar va generatorlar](https://docs.python.org/3/tutorial/classes.html#iterators)
- [Functional Programming HOWTO: Iteratorlar va generatorlar](https://docs.python.org/3/howto/functional.html#iterators)
- [`itertools`: iterator yaratadigan funksiyalar](https://docs.python.org/3/library/itertools.html)
