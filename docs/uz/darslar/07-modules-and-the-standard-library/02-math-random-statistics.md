---
title: math, random va statistics
description: "Standart kutubxonaning har kuni kerak böladigan uç moduli: aniq hisob-kitoblar uçun math, simulyatsiya va öyinlar uçun random, parollar uçun secrets hamda örtaça qiymat va tarqoqlik uçun statistics."
---

# math, random va statistics

![Rasm: math, random va statistics](/images/topics-webp-uzb/math-random-statistics.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `math` dagi eng foydali funksiyalar: ildizlar, yuvarlaş, logarifmlar, kombinatsiyalar
- Önlik sonlarni `math.isclose()` bilan xavfsiz taqqoslaş
- `random` bilan tasodifiy sonlar, elementlar va tanlanmalarni oliş hamda ularni `seed()` bilan takrorlaş
- Nega parollar va tokenlar uçun `random` emas, `secrets` kerak
- Maʼlumotlarni `statistics` bilan tavsiflaş: örtaça, mediana, moda, tarqoqlik, kvantillar
:::

## Nega bu muhim

Yetkaziş ilovasi masofani hisoblaydi, öyin zar taşlaydi, öqituvçi sinfning örtaça bahosini topadi. Standart kutubxonada bu hisob-kitoblar allaqaçon bor: sinovdan ötgan va tez, uçta modulda - `math`, `random` va `statistics`.

## `math` moduli

### Ildizlar, darajalar va konstantalar

```python
import math

print(math.sqrt(144))
print(math.pow(2, 10))
print(2 ** 10)
print(math.pi)
print(math.e)
```

```text
12.0
1024.0
1024
3.141592653589793
2.718281828459045
```

`math.pow()` har doim önlik son (float) qaytaradi, `**` esa butun sonlarni butun son holida qoldiradi. `math.isqrt(150)` butun ildizni, `12` ni, qaytaradi.

### Pastga va yuqoriga yuvarlaş

```python
import math

print(math.floor(7.9), math.ceil(7.1))
print(math.floor(-2.5), math.ceil(-2.5))
print(math.trunc(-2.5))
print(f"{math.ceil(47 / 12)} ta avtobus buyurtma qiling")   # 47 öquvçi, har avtobusda 12 örin
```

```text
7 8
-3 -2
-2
4 ta avtobus buyurtma qiling
```

`floor` har doim **pastga**, `ceil` esa har doim **yuqoriga** yuvarlaydi, hatto manfiy sonlar uçun ham, `trunc` esa önlik qismni kesib taşlaydi. `ceil` "neçta kerak?" degan savollar uçun juda mos.

### Önlik sonlarni `isclose` bilan taqqoslaş

Önlik sonlar ikkilik sanoq tizimida saqlanadi, şuning uçun kiçik yuvarlaş xatolari paydo böladi:

```python
import math

total = 0.1 + 0.2
print(total)
print(total == 0.3)
print(math.isclose(total, 0.3))
```

```text
0.30000000000000004
False
True
```

Hisoblangan önlik sonlarni heç qaçon `==` bilan taqqoslamang. Sonlar deyarli teng bölganda `True` qaytaradigan `math.isclose(a, b)` dan foydalaning.

Bitta nozik jihat bor: `isclose` yaqinlikni sonlarning kattaligiga *nisbatan* ölçaydi, şuning uçun `0` bilan taqqoslaşda mutlaq çegara, `abs_tol`, kerak:

```python
import math

left = 0.1 + 0.2 - 0.3
print(left)
print(math.isclose(left, 0))
print(math.isclose(left, 0, abs_tol=1e-9))
```

```text
5.551115123125783e-17
False
True
```

Köp önlik sonlarni juda aniq qöşiş uçun `math.fsum()` bor:

```python
import math

prices = [0.1] * 10
print(sum(prices))
print(math.fsum(prices))
```

```text
1.0
1.0
```

Python 3.12 dan boşlab örnatilgan `sum()` ham bunday yuvarlaş xatolarini kamaytiradi (eski versiyalar `0.9999999999999999` ni çiqaradi), `math.fsum()` esa har qanday versiyada aniq.

### Logarifmlar

```python
import math

print(math.log10(1000))
print(math.log2(1024))
print(math.log(math.e))
print(math.log(81, 3))
```

```text
3.0
10.0
1.0
4.0
```

Ikkinçi argumentsiz `math.log(x)` `e` asosidan foydalanadi.

### Sanaş: faktorial, kombinatsiyalar, örin almaştirişlar

```python
import math

print(math.factorial(5))   # 5 * 4 * 3 * 2 * 1
print(math.comb(10, 3))    # 10 kişilik sinfdan 3 kişilik jamoalar (tartib muhim emas)
print(math.perm(10, 3))    # 10 ta yuguruvçi orasida oltin, kumuş, bronza (tartib muhim)
```

```text
120
120
720
```

## `random` moduli

`random` **psevdotasodifiy** sonlarni **seed** (boşlanğiç qiymat) dan boşlanadigan formula orqali hosil qiladi. Bir xil seed bir xil ketma-ketlik beradi, şuning uçun quyidagi har bir misol avval `random.seed()` ni çaqiradi va natijangiz sahifadagi bilan bir xil böladi.

### Tasodifiy sonlar

```python
import random

random.seed(10)
print(random.random())          # 0.0 dan 1.0 gaça (1.0 kirmaydi) önlik son
print(random.randint(1, 6))     # 1 dan 6 gaça butun son, ikkala çegara ham kiradi
print(random.uniform(20, 35))   # 20 va 35 orasidagi önlik son
print(random.randrange(0, 100, 5))   # range() kabi: 0, 5, 10, ... 95
```

```text
0.5714025946899135
4
27.23842511826284
0
```

Eʼtibor bering: `range(1, 6)` dan farqli ravişda `randint(1, 6)` `6` ni ham öz içiga oladi.

### Röyxatdan tasodifiy elementlar

```python
import random

random.seed(3)
cities = ["Toşkent", "Samarqand", "Buxoro", "Xiva", "Namangan"]

print(random.choice(cities))        # bitta element
print(random.sample(cities, 3))     # 3 ta turli element
print(random.choices(cities, k=4))  # 4 ta element, takrorlaniş mumkin
```

```text
Samarqand
['Namangan', 'Samarqand', 'Xiva']
['Namangan', 'Buxoro', 'Buxoro', 'Xiva']
```

### Vaznli tanlov

`choices` `weights` yordamida baʼzi variantlarni boşqalaridan ehtimolliroq qila oladi:

```python
import random

random.seed(4)
prizes = ["5% çegirma", "20% çegirma", "bepul çoy"]
weights = [70, 10, 20]           # 70% / 10% / 20% ehtimol

spins = random.choices(prizes, weights=weights, k=10)
print(spins)
print(spins.count("5% çegirma"), spins.count("20% çegirma"), spins.count("bepul çoy"))
```

```text
['5% çegirma', '5% çegirma', '5% çegirma', '5% çegirma', '5% çegirma', '5% çegirma', 'bepul çoy', 'bepul çoy', '20% çegirma', '5% çegirma']
7 1 2
```

Bu yerda sanoqlar (7, 1, 2) vaznlarga omad tufayli mos keldi; faqat minglab aylantirişda ular işonçli ravişda vaznlarga yaqinlaşadi.

### Aralaştiriş

`shuffle` röyxatni **joyida** özgartiradi va `None` qaytaradi:

```python
import random

random.seed(5)
queue = ["Aziza", "Bekzod", "Dilnoza", "Farrux"]
random.shuffle(queue)
print(queue)
```

```text
['Aziza', 'Bekzod', 'Farrux', 'Dilnoza']
```

### Seed natijalarni takrorlanadigan qiladi

```python
import random

random.seed(2026)
first = [random.randint(1, 100) for _ in range(5)]

random.seed(2026)
second = [random.randint(1, 100) for _ in range(5)]

print(first)
print(first == second)
```

```text
[16, 41, 65, 66, 83]
True
```

Seedlar testlaş va takrorlanadigan simulyatsiyalar uçun foydali. Haqiqiy öyinda odatda seed örnatilmaydi.

### `secrets`: parollar va tokenlar uçun

`random` öyinlar va simulyatsiyalar uçun yaxşi, lekin u **oldindan aytib böladigan**: yetarliça natijalarni körgan odam keyingilarini hisoblab topa oladi. Parollar, tiklaş kodlari va xavfsizlik tokenlari uçun `secrets` modulidan foydalaning:

```py
import secrets
import string

alphabet = string.ascii_letters + string.digits
password = "".join(secrets.choice(alphabet) for _ in range(12))
print(password)

print(secrets.randbelow(1_000_000))   # masalan, 6 xonali SMS kod
print(secrets.token_hex(8))           # havola uçun tasodifiy token
```

```text
q7RkX2mLp9Bs
482913
3fa91c07d25e6b84
```

Natijangiz har safar boşqaça böladi va seed yöq. Aynan maqsad ham şu.

## `statistics` moduli

### Örtaça qiymatlar: mean, median, mode

```python
import statistics

scores = [72, 85, 90, 85, 64, 98, 85, 70]

print(statistics.mean(scores))
print(statistics.median(scores))
print(statistics.mode(scores))
```

```text
81.125
85.0
85
```

- **mean** (örtaça arifmetik): odatiy örtaça qiymat (yiğindi bölingan soniga).
- **median** (mediana): saralangandan keyingi örtadagi qiymat. Qiymatlar soni juft bölsa, örtadagi ikki qiymatning örtaçasi olinadi.
- **mode** (moda): eng köp uçraydigan qiymat.

Bir neçta keskin qiymat örtaça arifmetikni buzib yuboradigan holatlarda mediana foydali:

```python
import statistics

salaries = [4_000_000, 4_500_000, 5_000_000, 5_200_000, 60_000_000]
print(f"örtaça:  {statistics.mean(salaries):,.0f} söm")
print(f"mediana: {statistics.median(salaries):,.0f} söm")
```

```text
örtaça:  15,740,000 söm
mediana: 5,000,000 söm
```

Bitta direktorning maoşi örtaça qiymatni ança yuqoriga tortib ketdi; mediana odatiy maoşni yaxşiroq tavsiflaydi.

Agar bir neçta qiymat bir xil marta eng köp uçrasa, `statistics.multimode()` ularning hammasini röyxat körinişida qaytaradi.

### Tarqoqlik: standart çetlaniş

**Standart çetlaniş** qiymatlar örtaça qiymatdan odatda qança uzoqda ekanini ölçaydi:

```python
import statistics

class_a = [70, 72, 74, 76, 78]
class_b = [50, 60, 74, 88, 98]

for name, marks in [("A", class_a), ("B", class_b)]:
    avg = statistics.mean(marks)
    spread = statistics.stdev(marks)
    print(f"{name} sinf: örtaça {avg}, stdev {spread:.1f}")
```

```text
A sinf: örtaça 74, stdev 3.2
B sinf: örtaça 74, stdev 19.6
```

Ikkala sinfning örtaça bahosi `74`, lekin B sinf natijalari ança kengroq tarqalgan.

`stdev` maʼlumotlarni kattaroq guruhdan olingan **tanlanma** deb hisoblaydi; `pstdev` esa ularni **butun boş töplam** deb qaraydi va biroz kiçikroq qiymat beradi (A sinf uçun `3.162` örniga `2.828`).

`statistics.quantiles(data)` uçta kvartil çegarasini qaytaradi, örtadagisi - mediana.

## Özingiz sinab köring

Zar taşlang, tasodifiy ğoliblarni tanlang va natijalarni statistika bilan tavsiflang. Seedni özgartirib, nima özgarişini köring.

<ClientOnly><PythonPlayground :code='"import math\nimport random\nimport statistics\n\nrandom.seed(42)\nrolls = [random.randint(1, 6) for _ in range(20)]\nprint(\"Taşlaşlar:\", rolls)\nprint(\"Örtaça:\", statistics.mean(rolls))\nprint(\"Mediana:\", statistics.median(rolls))\nprint(\"Eng köp uçragan:\", statistics.multimode(rolls))\n\nstudents = [\"Aziza\", \"Bekzod\", \"Dilnoza\", \"Farrux\", \"Malika\"]\nprint(\"Ğoliblar:\", random.sample(students, 2))\nprint(\"Mumkin bölgan juftliklar:\", math.comb(len(students), 2))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `shuffle` natijasidan foydalaniş

```python
import random

names = ["Aziza", "Bekzod", "Dilnoza"]
shuffled = random.shuffle(names)
print(shuffled)
```

```text
None
```

`shuffle` röyxatni joyida özgartiradi va `None` qaytaradi. **Tuzatiş:** `random.shuffle(names)` ni çaqiring, keyin `names` dan foydalaning. Aslini saqlab, yangi aralaştirilgan röyxat oliş uçun `random.sample(names, len(names))` dan foydalaning.

### 2. Röyxatdan kattaroq tanlanma söraş

```py
import random

random.sample(["Aziza", "Bekzod"], 3)
```

```text
ValueError: Sample larger than population or is negative
```

`sample` elementlarni heç qaçon takrorlamaydi, şuning uçun 2 tadan 3 tasini tanlay olmaydi. Takrorlaniş muammo bölmasa, `choices` dan foydalaning.

### 3. Böş maʼlumotlar ustida statistika

```py
import statistics

statistics.mean([])
```

```text
statistics.StatisticsError: mean requires at least one data point
```

`len(data)` ga bölişdan oldin qanday tekşirsangiz, hisoblaşdan oldin ham xuddi şunday `if data:` bilan tekşiring.

## Maşqlar

### 1. Böyoq kalkulyatori <Difficulty level="1" />

Devor yuzasi 14.5 m², bir banka böyoq esa 4 m² ni qoplaydi. Neçta banka sotib oliş kerakligini çiqaring (faqat butun bankalar). Keyin `math.isclose` bilan `0.1 * 3` `0.3` ga tengligini tekşiring.

::: details Yeçim
```python
import math

wall = 14.5
per_can = 4
print(math.ceil(wall / per_can))
print(math.isclose(0.1 * 3, 0.3))
```

```text
4
True
```

`14.5 / 4` natijasi `3.625`, bankaning bir qismini sotib olib bölmaydi, şuning uçun **yuqoriga** yuvarlang.
:::

### 2. Baholar statistikasi <Difficulty level="1" />

`[88, 92, 79, 65, 92, 100, 71, 84]` baholari uçun örtaça qiymat (1 xona aniqlikda), mediana, moda va standart çetlanişni (1 xona aniqlikda) çiqaring.

::: details Yeçim
```python
import statistics

grades = [88, 92, 79, 65, 92, 100, 71, 84]

print(f"Örtaça:  {statistics.mean(grades):.1f}")
print(f"Mediana: {statistics.median(grades)}")
print(f"Moda:    {statistics.mode(grades)}")
print(f"Stdev:   {statistics.stdev(grades):.1f}")
```

```text
Örtaça:  83.9
Mediana: 86.0
Moda:    92
Stdev:   11.7
```
:::

### 3. Lotereya tiraji <Difficulty level="2" />

Lotereyada 1 dan 49 gaça bölgan sonlardan 6 ta turli son tanlanadi. `random.seed(99)` dan foydalaning va tirajni saralangan holda çiqaring. Keyin `math.comb` yordamida neçta turli çipta bölişi mumkinligini va yutiş ehtimolini "... dan 1" körinişida çiqaring.

::: details Yeçim
```python
import math
import random

random.seed(99)
draw = sorted(random.sample(range(1, 50), 6))
print("Yutuqli sonlar:", draw)

tickets = math.comb(49, 6)
print(f"Mumkin bölgan çiptalar: {tickets:,}")
print(f"Yutiş ehtimoli: {tickets:,} dan 1")
```

```text
Yutuqli sonlar: [12, 13, 15, 25, 26, 39]
Mumkin bölgan çiptalar: 13,983,816
Yutiş ehtimoli: 13,983,816 dan 1
```

Çiptadagi sonlar tartibi muhim emas, şuning uçun sanaş uçun `comb` töğri vosita.
:::

### 4. Tasodifiy parol generatori <Difficulty level="2" />

`secrets` va `string` yordamida harflar, raqamlar va `!@#$%` belgilaridan iborat parol qaytaradigan `make_password(length=12)` funksiyasini yozing. Parolda **kamida bitta raqam** bölişini taʼminlang: raqam çiqmagunça qayta yarating. Parol uzunligini va unda raqam bor-yöqligini çiqaring (parolning özi har safar boşqaça).

::: details Yeçim
```python
import secrets
import string

def make_password(length=12):
    alphabet = string.ascii_letters + string.digits + "!@#$%"
    while True:
        password = "".join(secrets.choice(alphabet) for _ in range(length))
        if any(ch.isdigit() for ch in password):
            return password

pw = make_password()
print(len(pw))
print(any(ch.isdigit() for ch in pw))
```

```text
12
True
```

`pw` ning özini çiqarsangiz, har bir işga tuşirişda boşqa qiymat körinadi.
:::

### 5. Zar öyini simulyatsiyasi <Difficulty level="3" />

Bekzod va Aziza har biri ikkitadan zar taşlaydi; yiğindisi katta bölgan kişi raundda yutadi, yiğindilar teng bölsa, durang. `random.seed(12)` bilan 1 000 raundni simulyatsiya qiling. Har bir öyinçining ğalabalarini, duranglar sonini va Bekzodning ğalaba foizini (1 xona aniqlikda) çiqaring. Keyin Bekzodning barça yiğindilari uçun örtaça qiymat va medianani çiqaring.

::: details Yeçim
```python
import random
import statistics

def roll_two():
    return random.randint(1, 6) + random.randint(1, 6)

random.seed(12)
results = {"Bekzod": 0, "Aziza": 0, "draw": 0}
bekzod_totals = []

for _ in range(1000):
    bekzod = roll_two()
    aziza = roll_two()
    bekzod_totals.append(bekzod)
    if bekzod > aziza:
        results["Bekzod"] += 1
    elif aziza > bekzod:
        results["Aziza"] += 1
    else:
        results["draw"] += 1

print(results)
print(f"Bekzod ğalabalari: {results['Bekzod'] / 1000:.1%}")
print("Örtaça yiğindi:", statistics.mean(bekzod_totals))
print("Mediana yiğindi:", statistics.median(bekzod_totals))
```

```text
{'Bekzod': 447, 'Aziza': 454, 'draw': 99}
Bekzod ğalabalari: 44.7%
Örtaça yiğindi: 6.976
Mediana yiğindi: 7.0
```

Ikki öyinçining imkoniyatlari teng, örtaça yiğindi esa ikki zar uçun nazariy örtaça bölgan `7` ga yaqin.
:::

## Xulosa

- `math` da `sqrt`, `floor`/`ceil`, `log`, `factorial`, `comb`/`perm` hamda `pi` va `e` konstantalari bor.
- Hisoblangan önlik sonlarni `==` bilan emas, `math.isclose()` bilan taqqoslang, aniq yiğindi uçun esa `math.fsum()` dan foydalaning.
- `random` `random()`, `randint(a, b)` (ikkala çegara kiradi), `uniform`, `choice`, `choices` (`weights` bilan), `sample` va `shuffle` (joyida özgartiradi, `None` qaytaradi) funksiyalarini beradi; `seed(n)` ketma-ketlikni takrorlanadigan qiladi.
- Parollar, kodlar va tokenlar uçun heç qaçon `random` emas, `secrets` dan foydalaning.
- `statistics` maʼlumotlarni tavsiflaydi: `mean`, `median`, `mode`, `stdev` va `quantiles`.

## Qöşimça manbalar

- [`math` - Mathematical functions](https://docs.python.org/3/library/math.html)
- [`random` - Generate pseudo-random numbers](https://docs.python.org/3/library/random.html)
- [`statistics` - Mathematical statistics functions](https://docs.python.org/3/library/statistics.html)
- [`secrets` - Generate secure random numbers](https://docs.python.org/3/library/secrets.html)
