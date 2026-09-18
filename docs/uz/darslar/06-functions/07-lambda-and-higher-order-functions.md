---
title: Lambda va yuqori tartibli funksiyalar
description: "Funksiyalar bilan qiymat sifatida işlang: ularni boşqa funksiyalarga uzating, qisqa lambda funksiyalar yozing, öz kalitingiz böyiça saralang, map() va filter() dan foydalaning hamda funksiyadan funksiya qaytaring."
---

# Lambda va yuqori tartibli funksiyalar

![Rasm: Lambda va yuqori tartibli funksiyalar](/images/topics-webp-uzb/lambda-and-higher-order-functions.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Funksiyalar **qiymat** ekani va **yuqori tartibli funksiya** nima
- `lambda` yordamida kiçik nomsiz funksiyalarni qanday yoziş
- Öz `key` funksiyalaringiz bilan qanday saralaş, `min`/`max` ni topiş va guruhlaş
- `map()` va `filter()` comprehension ifodalari bilan qanday taqqoslanadi
- Boşqa funksiyalarni yasaydigan funksiyalarni qanday yaratiş
:::

## Nega bu muhim

Siz allaqaçon `sorted(names, key=str.lower)` deb yozgansiz: siz boşqa funksiyaga **funksiya** uzatdingiz va u sizning örningizga undan foydalandi. Har bir holat uçun yangi saralaş siklini yozişning örniga, *nimani* taqqoslaş kerakligini aytadigan bitta kiçik funksiya yozasiz va Pythonning tez, sinovdan ötgan saralaşidan qayta foydalanasiz. Aynan şu ğoya hodisa işlovçilari va maʼlumotlarni qayta işlaş zanjirlari asosida yotadi.

## Funksiyalar ham qiymat

Özgaruvçi nomi son yoki satrni körsatgani kabi, funksiya nomi ham funksiya obyektini körsatadi. Uni boşqa nomga berişingiz, röyxatga qöyişingiz yoki uzatişingiz mumkin:

```python
def shout(text):
    return text.upper() + "!"

def whisper(text):
    return text.lower() + "..."

speak = shout              # qavslarsiz: funksiyaning özi
print(speak("salom"))

for style in [shout, whisper]:
    print(style("Xayrli tong"))
```

```text
SALOM!
XAYRLI TONG!
xayrli tong...
```

Funksiyalar hatto luğatdagi qiymat ham bölişi mumkin - bu uzun `if`/`elif` zanjirining çiroyli örinbosari:

```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

operations = {"+": add, "-": subtract}

print(operations["+"](10, 4))
print(operations["-"](10, 4))
```

```text
14
6
```

## Yuqori tartibli funksiyalar

**Yuqori tartibli funksiya (higher-order function)** - argument sifatida boşqa funksiyani qabul qiladigan yoki funksiya qaytaradigan funksiya. Mana özingiz yoza oladigan bittasi:

```python
def apply_to_all(func, items):
    """Har bir elementga func qöllangan yangi röyxat qaytaradi."""
    return [func(item) for item in items]

def double(n):
    return n * 2

print(apply_to_all(double, [1, 2, 3]))
print(apply_to_all(str.upper, ["a", "b"]))
```

```text
[2, 4, 6]
['A', 'B']
```

`apply_to_all` ni `func` nima qilişi qiziqtirmaydi; u şunçaki uni çaqiradi.

## `lambda`: kiçkina nomsiz funksiyalar

`double` ni biror joyga uzatiş uçungina butun boşli funksiya yaratiş ortiqça tuyuladi. **Lambda** bitta ifodada kiçik funksiya yaratadi:

```text
lambda parametrlar: ifoda
```

```python
double = lambda n: n * 2       # def double(n): return n * 2 bilan bir xil
print(double(21))

add = lambda a, b: a + b
print(add(3, 4))
```

```text
42
7
```

Lambda qoidalari:

- U faqat **bitta ifodadan** iborat bölişi mumkin, uning qiymati avtomatik qaytariladi. `return` kalit sözi ham, `if` bloklari, sikllar yoki qiymat beriş kabi buyruqlar ham yöq.
- Uning öz nomi yöq, şuning uçun u **nomsiz (anonymous)** deb ataladi.

Yuqoridagi kabi lambdani nomga beriş qonuniy, lekin PEP 8 buni tavsiya etmaydi; yuqoridagi misollar buni faqat `def` bilan soliştiriş uçun qiladi. Agar u nomga loyiq bölsa, `def` işlating. Lambdalar argument sifatida **töğridan-töğri işlatiladigan joyda** yozilişi uçun möljallangan:

```py
print(apply_to_all(lambda n: n ** 2, [1, 2, 3]))
```

```text
[1, 4, 9]
```

Lambda içida şartli ifoda ham işlaydi, aynan işlatiladigan joyida yozilgan holda:

```python
print(list(map(lambda score: "ötdi" if score >= 60 else "ötmadi", [75, 40])))
```

```text
['ötdi', 'ötmadi']
```

## `key` bilan saralaş

Lambdalarni eng köp aynan şu yerda işlatasiz. `key` funksiyasi **bitta elementni** oladi va saralaş uçun işlatiladigan qiymatni qaytaradi:

```python
students = [
    {"name": "Aziza", "age": 20, "score": 92},
    {"name": "Bekzod", "age": 22, "score": 85},
    {"name": "Dilnoza", "age": 19, "score": 97},
]

by_age = sorted(students, key=lambda s: s["age"])
by_score = sorted(students, key=lambda s: s["score"], reverse=True)

print([s["name"] for s in by_age])
print([s["name"] for s in by_score])
```

```text
['Dilnoza', 'Aziza', 'Bekzod']
['Dilnoza', 'Aziza', 'Bekzod']
```

Kalitga yana misollar:

```python
products = [("Çoy", 15000), ("Qahva", 45000), ("Şarbat", 12000)]
words = ["banan", "Olma", "gilos", "anjir"]

print(sorted(products, key=lambda p: p[1]))              # narx böyiça
print(sorted(words, key=lambda w: w.lower()))            # harf kattaligini hisobga olmasdan
print(sorted(words, key=lambda w: (len(w), w.lower())))  # uzunlik, keyin alifbo böyiça
```

```text
[('Şarbat', 12000), ('Çoy', 15000), ('Qahva', 45000)]
['anjir', 'banan', 'gilos', 'Olma']
['Olma', 'anjir', 'banan', 'gilos']
```

Kalitdan **kortej** qaytariş bir neça mezon böyiça saralaydi: avval birinçi qiymat böyiça, teng bölganlarini esa ikkinçisi böyiça. Sonli bitta mezonni teskari tartibda saralaş uçun uni manfiy qiling: `key=lambda s: (-s["score"], s["name"])`.

`min()` va `max()` ham xuddi şunday `key` qabul qiladi:

```python
students = [
    {"name": "Aziza", "score": 92},
    {"name": "Bekzod", "score": 85},
]

best = max(students, key=lambda s: s["score"])
print(best["name"])
```

```text
Aziza
```

## `map()` va `filter()`

Ikki klassik yuqori tartibli funksiya:

- `map(func, items)` `func` ni har bir elementga qöllaydi.
- `filter(func, items)` `func` rost (truthy) qiymat qaytargan elementlarni qoldiradi.

Ikkalasi ham lazy (qiymatni faqat söralganda hosil qiladigan) iteratorlar qaytaradi: birini çop etsangiz, faqat `<map object at 0x...>` körasiz, şuning uçun natijani köriş uçun ularni `list()` ga örang:

```python
numbers = [1, 2, 3, 4, 5, 6]

squares = list(map(lambda n: n * n, numbers))
evens = list(filter(lambda n: n % 2 == 0, numbers))

print(squares)
print(evens)
```

```text
[1, 4, 9, 16, 25, 36]
[2, 4, 6]
```

Ularga teng comprehension ifodalari: `[n * n for n in numbers]` va `[n for n in numbers if n % 2 == 0]`. Pythonda **odatda comprehension ifodalari afzal köriladi**, çunki ular tabiiyroq öqiladi. Agar sizda allaqaçon nomli funksiya bölsa, `map` qulay:

```python
raw = ["12", " 7", "30 "]
print(list(map(int, raw)))          # int() atrofdagi böşliqlarni eʼtiborsiz qoldiradi
print(list(map(str.strip, raw)))
```

```text
[12, 7, 30]
['12', '7', '30']
```

## Funksiya qaytaradigan funksiyalar

Funksiya **yangi** funksiya yasab, uni qaytarişi mumkin. Içki funksiya taşqi funksiyadagi qiymatlarni eslab qoladi (bu *Özgaruvçilarning köriniş sohasi* darsida tanişgan *closure*). Bu "funksiya fabrikasi": bir marta sozlang, köp marta işlating.


```python
def make_price_formatter(currency, decimals=0):
    def formatter(amount):
        return f"{amount:,.{decimals}f} {currency}"
    return formatter

som = make_price_formatter("söm")
usd = make_price_formatter("USD", decimals=2)

print(som(1250000))
print(usd(99.5))
```

```text
1,250,000 söm
99.50 USD
```

::: details Qöşimça: sikl içida yaratilgan lambdalar
```python
functions = [lambda: i for i in range(3)]
print([f() for f in functions])

functions = [lambda i=i: i for i in range(3)]
print([f() for f in functions])
```

```text
[2, 2, 2]
[0, 1, 2]
```

Birinçi röyxatdagi har bir lambda `i` ni **çaqirilgan paytda** qidiradi, bu paytga kelib esa sikl `i = 2` bilan tugagan böladi. Joriy qiymatni standart argument sifatida boğlaş, `lambda i=i: i`, buni tuzatadi.
:::

## `functools` bilan qisqa tanişuv

Standart kutubxonadagi `functools` modulida funksiyalar bilan işlaş uçun yana köp vositalar bor. Siz uçratişingiz mumkin bölgan ikkitasi (`from ... import ...` qatori ularni yuklaydi, importlar qanday işlaşi esa *Modullar va import* darsida tuşuntiriladi):

```python
from functools import reduce, partial

numbers = [1, 2, 3, 4]
product = reduce(lambda acc, n: acc * n, numbers)   # elementlarni bitta qiymatga birlaştiradi
print(product)

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)                  # argumentni oldindan töldiradi
print(square(9))
```

```text
24
81
```

Kundalik vazifalarning köpçiligida sikl, comprehension ifodasi yoki `sum()` `reduce()` dan tuşunarliroq.

## Lambdani qaçon işlatiş kerak

| Lambda işlating, agar… | `def` işlating, agar… |
|---|---|
| bu `sorted`, `max`, `map`, … ga töğridan-töğri uzatiladigan qisqa ifoda bölsa | qayta işlatiş uçun nom kerak bölsa |
| bemalol bir qatorga siğsa | bir neça buyruq, sikl yoki xatolarni uşlaş kerak bölsa |
| maʼnosi kontekstdan aniq bölsa | docstring yoki testlarga loyiq bölsa |

## Özingiz sinab köring

Mahsulotlar röyxatini turli usullarda saralang va filtrlang. Nom uzunligi böyiça saralab yoki faqat 20 000 dan arzon mahsulotlarni qoldirib köring.

<ClientOnly><PythonPlayground :code='"products = [\n    {\"name\": \"Çoy\", \"price\": 15000, \"rating\": 4.6},\n    {\"name\": \"Qahva\", \"price\": 45000, \"rating\": 4.8},\n    {\"name\": \"Şarbat\", \"price\": 12000, \"rating\": 4.1},\n    {\"name\": \"Limonad\", \"price\": 18000, \"rating\": 4.6},\n]\n\ncheapest = min(products, key=lambda p: p[\"price\"])\nprint(\"Eng arzon:\", cheapest[\"name\"])\n\nranked = sorted(products, key=lambda p: (-p[\"rating\"], p[\"price\"]))\nfor p in ranked:\n    print(p[\"name\"], p[\"rating\"], p[\"price\"])\n\nprint(list(map(lambda p: p[\"name\"].upper(), products)))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Funksiyani uzatiş örniga çaqiriş

```py
sorted(["b", "A"], key=str.lower())
```

```text
TypeError: unbound method str.lower() needs an argument
```

**Tuzatiş:** qavslarsiz `key=str.lower`.

### 2. Lambda içida buyruqlar

```py
f = lambda x: return x * 2
```

```text
SyntaxError: invalid syntax
```

Lambda tanasi - `return`, qiymat beriş yoki sikllarsiz bitta ifoda. **Tuzatiş:** `lambda x: x * 2` yoki `def` işlating.

### 3. map obyektini ikki marta aylanib çiqiş

```python
result = map(str.upper, ["a", "b"])
print(list(result))
print(list(result))
```

```text
['A', 'B']
[]
```

`map` yoki `filter` obyekti elementlarini faqat **bir marta** beradi; undan keyin u böş böladi va heç qanday xato çiqmaydi. **Tuzatiş:** uni bir marta özgartiring, `upper = list(map(...))`, va röyxatdan qayta foydalaning.

## Maşqlar

### 1. Oxirgi harf böyiça saralaş <Difficulty level="1" />

`words = ["python", "java", "rust", "go", "kotlin"]` ni **oxirgi** harfi böyiça saralang.

::: details Yeçim
```python
words = ["python", "java", "rust", "go", "kotlin"]
print(sorted(words, key=lambda w: w[-1]))
```

```text
['java', 'python', 'kotlin', 'go', 'rust']
```

`"python"` ham, `"kotlin"` ham `n` bilan tugaydi, şuning uçun ular asl tartibini saqlaydi (barqaror saralaş).
:::

### 2. Eng uzun va eng qisqa <Difficulty level="1" />

`cities = ["Toşkent", "Nukus", "Samarqand", "Jizzax", "Urganç"]` uçun `key` bilan `max` va `min` yordamida eng uzun va eng qisqa nomlarni çop eting.

::: details Yeçim
```python
cities = ["Toşkent", "Nukus", "Samarqand", "Jizzax", "Urganç"]
print(max(cities, key=len))
print(min(cities, key=len))
```

```text
Samarqand
Nukus
```
:::

### 3. Reyting jadvali, qisqa usulda <Difficulty level="2" />

*Röyxatlar bilan işlaş va saralaş* darsidagi reyting jadvalini **bitta** `sorted()` çaqirişi bilan qayta yozing: ballar böyiça (eng yuqorisi birinçi), keyin nom böyiça alifbo tartibida, harf kattaligini hisobga olmasdan saralang.

```python
players = [("ali", 120), ("Vali", 95), ("gani", 120), ("Sami", 150), ("Doni", 95)]
```

::: details Yeçim
```python
players = [("ali", 120), ("Vali", 95), ("gani", 120), ("Sami", 150), ("Doni", 95)]

ranked = sorted(players, key=lambda p: (-p[1], p[0].lower()))

for rank, (name, points) in enumerate(ranked, start=1):
    print(f"{rank}. {name:<5}{points:>4}")
```

```text
1. Sami  150
2. ali   120
3. gani  120
4. Doni   95
5. Vali   95
```

Ballarni manfiy qiliş ularni kamayiş tartibida saralaydi, nomlar esa ösiş tartibida qoladi.
:::

### 4. Öz filtringiz <Difficulty level="2" />

`filter()` dan foydalanmasdan, `predicate(item)` `True` bölgan elementlar röyxatini qaytaradigan `keep_if(predicate, items)` funksiyasini yozing. Undan lambda bilan birga foydalanib, boş harf bilan boşlanadigan sözlarni qoldiring.

::: details Yeçim
```python
def keep_if(predicate, items):
    return [item for item in items if predicate(item)]

words = ["Toşkent", "daryo", "Aziza", "kitob", "Python"]
print(keep_if(lambda w: w[0].isupper(), words))
```

```text
['Toşkent', 'Aziza', 'Python']
```
:::

### 5. Çegirma qoidalari <Difficulty level="3" />

Funksiya qaytaradigan `make_discount(percent, minimum=0)` funksiyasini yozing. Qaytarilgan funksiya narxni oladi va çegirmali narxni qaytaradi, lekin faqat narx **kamida** `minimum` bölsa. Aks holda narxni özgarişsiz qaytaradi. Keyin narxlar röyxatiga bir neça qoidani qöllang va har biri uçun eng yaxşi (eng past) narxni çop eting.

```py
rules = [make_discount(10), make_discount(20, minimum=100000), make_discount(30, minimum=500000)]
prices = [50000, 150000, 600000]
```

::: details Yeçim
```python
def make_discount(percent, minimum=0):
    def apply(price):
        if price >= minimum:
            return price * (1 - percent / 100)
        return price
    return apply

rules = [make_discount(10), make_discount(20, minimum=100000), make_discount(30, minimum=500000)]
prices = [50000, 150000, 600000]

for price in prices:
    best = min(rule(price) for rule in rules)
    print(f"{price:>8,} → {best:>10,.0f}")
```

```text
  50,000 →     45,000
 150,000 →    120,000
 600,000 →    420,000
```

Yangi çegirma qoidasini qöşiş uçun siklga tegmasdan `rules` ga bitta qator qöşiş kifoya.
:::

## Xulosa

- Funksiyalar - **qiymatlar**, **yuqori tartibli funksiya** esa ularni qabul qiladi yoki qaytaradi: `sorted`, `max`, `map` va öz funksiyalaringiz.
- `lambda params: expression` kiçik nomsiz funksiya yaratadi. Uni joyida işlating, kattaroq narsalar uçun esa `def` dan foydalaning.
- `key=lambda item: …` saralaş, `min` va `max` ni boşqaradi. Bir neça mezon böyiça saralaş uçun kortej qaytaring.
- `map` va `filter` lazy iteratorlar qaytaradi, comprehension ifodalari esa odatda öqişga osonroq.
- Funksiyalar öz sozlamalarini eslab qoladigan funksiyalarni (closure) yasay oladi.

## Qöşimça manbalar

- [Python Tutorial - Lambda expressions](https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions)
- [Functional programming HOWTO](https://docs.python.org/3/howto/functional.html)
- [Sorting techniques - key functions](https://docs.python.org/3/howto/sorting.html#key-functions)
- [`functools` module](https://docs.python.org/3/library/functools.html)
