---
title: collections va itertools
description: "Qöl bilan yozilgan sikllarni collections dagi Counter, defaultdict, namedtuple va deque hamda itertools dagi sikl yordamçilari bilan almaştiring."
---

# collections va itertools

![Rasm: collections va itertools](/images/topics-webp-uzb/collections-and-itertools.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `Counter` siz qöl bilan yozgan sanaş andozasini qanday almaştiradi
- `defaultdict` maʼlumotlarni guruhlaşni qanday qisqartiradi
- `namedtuple` kortej maydonlariga qanday öqişli nomlar beradi
- `deque` tez navbat va "oxirgi N ta element" buferi sifatida qanday işlaydi
- `itertools` ning eng foydali vositalari: `chain`, `islice`, `combinations`, `groupby`, `batched` va boşqalar
:::

## Nega bu muhim

Siz bir xil sikllarni qayta-qayta yozasiz: sözlarni sanaş, buyurtmalarni mijoz böyiça guruhlaş, yiğilib boradigan jamini hisoblaş. Pythonda bu andozalar uçun tayyor vositalar bor, şuning uçun kodingiz qisqaroq va tuşunarliroq böladi.

## `Counter`: sanaş osonlaşdi

*Luğatlar* darsidagi `counts.get(name, 0) + 1` sikli örniga elementlarni `Counter` ga bering:

```python
from collections import Counter

votes = ["Aziza", "Bekzod", "Aziza", "Dilnoza", "Aziza", "Bekzod"]
counts = Counter(votes)

print(counts)
print(counts["Aziza"])
print(counts["Farrux"])       # yöq nomlar 0 deb sanaladi, KeyError yöq
```

```text
Counter({'Aziza': 3, 'Bekzod': 2, 'Dilnoza': 1})
3
0
```

`Counter` - istalgan takrorlanuvçi obyektdan tuzilgan sanoqlar luğati.

### `most_common`

```python
from collections import Counter

text = "toşkentda çoy issiq va non yangi va çoy şirin"
print(Counter(text.split()).most_common(2))
print(Counter("samarqand").most_common(1))
```

```text
[('çoy', 2), ('va', 2)]
[('a', 3)]
```

U `(element, sanoq)` juftliklarini eng kattasidan boşlab qaytaradi.

### Counter larni yangilaş va birlaştiriş

```python
from collections import Counter

stock = Counter({"çoy": 10, "şakar": 4})
sold = Counter({"çoy": 12, "şakar": 1})

stock.update({"çoy": 5, "qahva": 8})   # yetkazib berilgan tovar qöşildi
print(stock)
print(stock - sold)          # nol va manfiy sanoqlar yöqoladi
print(stock.total())
```

```text
Counter({'çoy': 15, 'qahva': 8, 'şakar': 4})
Counter({'qahva': 8, 'çoy': 3, 'şakar': 3})
27
```

`+` va `-` counter larni birlaştiradi, `total()` esa barça sanoqlarni qöşadi.

## `defaultdict`: avtomatik standart qiymatlar

Buyurtmalarni mijoz böyiça guruhlaş, *Içma-iç maʼlumotlar* darsidagidek, har bir `append` dan oldin `if customer not in by_customer:` tekşiruvini talab qiladi. `defaultdict` yöq qiymatni siz bergan funksiya, masalan `list` yoki `int`, yordamida avtomatik yaratadi:

```python
from collections import defaultdict

orders = [("Aziza", "çoy"), ("Bekzod", "qahva"), ("Aziza", "somsa"), ("Bekzod", "şarbat")]

by_customer = defaultdict(list)
for customer, item in orders:
    by_customer[customer].append(item)     # kerak bölganda yangi [] paydo böladi

print(dict(by_customer))
```

```text
{'Aziza': ['çoy', 'somsa'], 'Bekzod': ['qahva', 'şarbat']}
```

`defaultdict(list)` har bir yangi kalit uçun böş röyxat yasaş uçun `list()` ni çaqiradi; `dict()` esa şunçaki çop etişni tozaroq qiladi.

`int` bilan yöq qiymatlar `0` dan boşlanadi, şuning uçun `totals[city] += amount` birinçi marta uçragan şahar uçun ham işlaydi.

::: tip Counter yoki defaultdict(int)?
**Neça marta** uçraganini `Counter` bilan sanang; har bir kalit böyiça **summalarni** `defaultdict(int)` bilan jamlang.
:::

## `namedtuple`: maydonlari nomlangan kortejlar

`("Aziza", 20, "Toşkent")` da `student[2]` uçinçi element nima ekanini aytmaydi. `namedtuple` maydonlari nomlangan kortej turini yaratadi:

```python
from collections import namedtuple

Student = namedtuple("Student", ["name", "age", "city"])

aziza = Student("Aziza", 20, "Toşkent")
print(aziza)
print(aziza.name, aziza.city)
print(aziza[1])                    # oddiy kortej kabi ham işlaydi
print(aziza._replace(age=21))      # özgarmas: _replace özgartirilgan nusxa yasaydi
```

```text
Student(name='Aziza', age=20, city='Toşkent')
Aziza Toşkent
20
Student(name='Aziza', age=21, city='Toşkent')
```

Keyinroq *Dataclasslar* darsi yozuv turlarini yaratişning moslaşuvçanroq usulini körsatadi.

## `deque`: tez ikki tomonlama navbat

Röyxatning **boşidan** element öçiriş sekin. `deque` ("dek") **ikkala** uçda ham tez qöşadi va öçiradi, `maxlen` bilan esa faqat eng yangi elementlarni saqlaydi:

```python
from collections import deque

queue = deque(["Aziza", "Bekzod"])
queue.append("Dilnoza")        # oxiriga qöşiladi
queue.appendleft("Farrux")     # boşiga ötadi
print(queue.popleft())         # birinçi xizmat oladi
print(queue)

recent = deque(maxlen=3)
for page in ["bosh", "menyu", "çoy", "savat"]:
    recent.append(page)
print(list(recent))
```

```text
Farrux
deque(['Aziza', 'Bekzod', 'Dilnoza'])
['menyu', 'çoy', 'savat']
```

`maxlen` li deque töla bölganda element qöşiş eng eskisini taşlab yuboradi, bu "oxirgi 5 ta xabar" uçun ideal.

## `itertools`: sikllar uçun vositalar

`itertools` funksiyalari qiymatlarni bittadan beradigan va faqat **bir marta** işlatiladigan **iteratorlar** qaytaradi; ularni köriş yoki saqlaş uçun `list()` ga örang.

### `count`, `cycle`, `islice` va `chain`

`count(start)` çeksiz sanaydi, `cycle(items)` esa elementlarni çeksiz takrorlaydi, şuning uçun ularni `zip`, `break` yoki istalgan iteratorning birinçi elementlarini oladigan `islice` bilan birga işlating. `chain` bir neçta röyxatni bittadek aylanib çiqadi:

```python
from itertools import chain, count, cycle, islice

for number, name in zip(count(1), ["Aziza", "Bekzod"]):
    print(number, name)

shifts = cycle(["ertalab", "keçqurun"])
print(list(islice(shifts, 3)))

print(list(chain(["çoy", "somsa"], ["palov"])))
```

```text
1 Aziza
2 Bekzod
['ertalab', 'keçqurun', 'ertalab']
['çoy', 'somsa', 'palov']
```

### `product`, `permutations`, `combinations`

Bular barça mumkin bölgan kombinatsiyalarni yasab, içma-iç sikllarning örnini bosadi:

```python
from itertools import product, combinations

sizes = ["S", "M"]
colors = ["qizil", "kök"]
print(list(product(sizes, colors)))          # har bir ölçam har bir rang bilan

players = ["Aziza", "Bekzod", "Dilnoza"]
print(list(combinations(players, 2)))         # juftliklar, tartib muhim emas
```

```text
[('S', 'qizil'), ('S', 'kök'), ('M', 'qizil'), ('M', 'kök')]
[('Aziza', 'Bekzod'), ('Aziza', 'Dilnoza'), ('Bekzod', 'Dilnoza')]
```

`product` içma-iç siklning örnini bosadi, `combinations` esa har bir juftlikni bir marta beradi, xuddi turnirdagi öyinlar kabi. `permutations` turli tartiblarni ham hisoblaydi.

### `accumulate`: yiğilib boradigan jami

```python
from itertools import accumulate

deposits = [100000, 250000, -50000, 300000]
print(list(accumulate(deposits)))
```

```text
[100000, 350000, 300000, 600000]
```

Har bir qiymat - öşa amaldan keyingi hisob qoldiği.

### `zip_longest`, `pairwise` va `batched`

`zip_longest` eng qisqa kiritma tugagandan keyin ham davom etib, böşliqlarni töldiradi, `pairwise` har bir elementni keyingisi bilan beradi, `batched` (Python 3.12+) esa maʼlumotlarni `n` talik guruhlarga böladi:

```python
from itertools import batched, pairwise, zip_longest

names = ["Aziza", "Bekzod", "Dilnoza"]
scores = [95, 88]
print(list(zip_longest(names, scores, fillvalue="yöq")))

temperatures = [18, 22, 21, 27]
print([after - before for before, after in pairwise(temperatures)])

seats = ["A1", "A2", "A3", "A4", "A5"]
print(list(batched(seats, 2)))
```

```text
[('Aziza', 95), ('Bekzod', 88), ('Dilnoza', 'yöq')]
[4, -1, 6]
[('A1', 'A2'), ('A3', 'A4'), ('A5',)]
```

### `groupby`: ketma-ket elementlarni guruhlaş

`groupby(items, key)` kaliti bir xil bölgan **ketma-ket** elementlarni guruhlarga yiğadi:

```python
from itertools import groupby

students = [
    ("Aziza", "Toşkent"),
    ("Dilnoza", "Toşkent"),
    ("Bekzod", "Samarqand"),
    ("Farrux", "Buxoro"),
]

for city, group in groupby(students, key=lambda s: s[1]):
    names = [name for name, _ in group]
    print(city, names)
```

```text
Toşkent ['Aziza', 'Dilnoza']
Samarqand ['Bekzod']
Buxoro ['Farrux']
```

Asosiy söz - **ketma-ket**: kalit özgargan har bir joyda yangi guruh boşlanadi, şuning uçun bu faqat maʼlumotlar şahar böyiça tartiblangani uçun işlaydi. Saralanmagan maʼlumotlar uçun `defaultdict(list)` köpinça soddaroq.

## Özingiz sinab köring

Sözlarni sanang, elementlarni guruhlang va `itertools` bilan tajriba qiling. Matnni yoki öyinçilarni özgartirib köring.

<ClientOnly><PythonPlayground :code='"from collections import Counter, defaultdict, deque\nfrom itertools import combinations, accumulate\n\ntext = \"çoy va non va yana çoy va yana çoy\"\nprint(Counter(text.split()).most_common(2))\n\nby_letter = defaultdict(list)\nfor word in [\"anor\", \"anjir\", \"banan\", \"gilos\", \"behi\"]:\n    by_letter[word[0]].append(word)\nprint(dict(by_letter))\n\nlast_three = deque(maxlen=3)\nfor n in range(1, 8):\n    last_three.append(n)\nprint(last_three)\n\nplayers = [\"Aziza\", \"Bekzod\", \"Dilnoza\", \"Farrux\"]\nfor a, b in combinations(players, 2):\n    print(a, \"va\", b)\n\nprint(list(accumulate([5, 10, 15, 20])))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `groupby` ni saralanmagan maʼlumotlarda işlatiş

```python
from itertools import groupby

fruits = ["anor", "banan", "anjir", "behi", "olma"]

for letter, group in groupby(fruits, key=lambda w: w[0]):
    print(letter, list(group))
```

```text
a ['anor']
b ['banan']
a ['anjir']
b ['behi']
o ['olma']
```

`a` harfi ikkita alohida guruhda çiqdi, çunki `a` bilan boşlanadigan sözlar yonma-yon emas. **Tuzatiş:** avval xuddi şu kalit bilan saralang, şunda teng kalitlar qöşni böladi: `groupby(sorted(fruits, key=lambda w: w[0]), key=lambda w: w[0])` `a ['anor', 'anjir']`, `b ['banan', 'behi']` va `o ['olma']` beradi.

### 2. Standart fabrikani çaqiriş

```py
from collections import defaultdict

groups = defaultdict(list())
```

```text
TypeError: first argument must be callable or None
```

`defaultdict` ga tayyor röyxat `list()` emas, `list` **funksiyasi** kerak; u har bir yangi kalit uçun funksiyani çaqiradi.

### 3. Yöq kalitni öqiş uni `defaultdict` ga qöşadi

```python
from collections import defaultdict

totals = defaultdict(int)
totals["Toşkent"] += 165000

if totals["Nukus"] > 0:          # faqat öqiş...
    print("Nukusda savdo bor")

print(dict(totals))
print(len(totals))
```

```text
{'Toşkent': 165000, 'Nukus': 0}
2
```

`totals["Nukus"]` ni şunçaki **öqiş** kalitni yaratdi, şuning uçun `len()` va sikllar endi savdosi yöq şaharni ham öz içiga oladi. **Tuzatiş:** `"Nukus" in totals` bilan tekşiring yoki heç qaçon qöşmaydigan `totals.get("Nukus", 0)` bilan öqing.

## Maşqlar

### 1. Harflar çastotasi <Difficulty level="1" />

`Counter` yordamida `"mississippi river"` dagi eng köp uçraydigan uçta harfni toping, böşliqni hisobga olmang.

::: details Yeçim
```python
from collections import Counter

text = "mississippi river"
letters = Counter(ch for ch in text if ch != " ")
print(letters.most_common(3))
```

```text
[('i', 5), ('s', 4), ('p', 2)]
```
:::

### 2. Janrlar böyiça kitoblar <Difficulty level="1" />

Bu kitoblarni `defaultdict(list)` bilan janr böyiça guruhlang va har bir janrni sarlavhalari bilan çop eting.

```python
books = [("Python asoslari", "texnika"), ("Ipak yöli", "tarix"), ("Data Science", "texnika"), ("Temur", "tarix"), ("Şeʼrlar", "şeʼriyat")]
```

::: details Yeçim
```python
from collections import defaultdict

books = [("Python asoslari", "texnika"), ("Ipak yöli", "tarix"), ("Data Science", "texnika"), ("Temur", "tarix"), ("Şeʼrlar", "şeʼriyat")]

by_genre = defaultdict(list)
for title, genre in books:
    by_genre[genre].append(title)

for genre, titles in by_genre.items():
    print(f"{genre}: {', '.join(titles)}")
```

```text
texnika: Python asoslari, Data Science
tarix: Ipak yöli, Temur
şeʼriyat: Şeʼrlar
```
:::

### 3. Turnir jadvali <Difficulty level="2" />

Törtta jamoa (Paxtakor, Navbahor, Bunyodkor, Nasaf) har biri boşqa har bir jamoa bilan bir martadan öynaydi. `combinations` yordamida raqamlangan öyinlarni, masalan `1. Paxtakor va Navbahor`, va jami sonini çop eting.

::: details Yeçim
```python
from itertools import combinations

teams = ["Paxtakor", "Navbahor", "Bunyodkor", "Nasaf"]
matches = list(combinations(teams, 2))

for number, (home, away) in enumerate(matches, start=1):
    print(f"{number}. {home} va {away}")

print(f"Jami: {len(matches)} ta öyin")
```

```text
1. Paxtakor va Navbahor
2. Paxtakor va Bunyodkor
3. Paxtakor va Nasaf
4. Navbahor va Bunyodkor
5. Navbahor va Nasaf
6. Bunyodkor va Nasaf
Jami: 6 ta öyin
```

Natija ikki marta işlatilgani uçun röyxatda saqlanadi.
:::

### 4. Harakatlanuvçi örtaça <Difficulty level="2" />

`deque(maxlen=3)` yordamida 3-kundan boşlab **oxirgi 3 kunning** örtaçasini (1 xona aniqlikda) çop eting.

```python
temps = [21, 24, 19, 26, 30, 28]
```

::: details Yeçim
```python
from collections import deque

temps = [21, 24, 19, 26, 30, 28]
window = deque(maxlen=3)

for day, t in enumerate(temps, start=1):
    window.append(t)
    if len(window) == 3:
        print(f"{day}-kun: {sum(window) / 3:.1f}")
```

```text
3-kun: 21.3
4-kun: 23.0
5-kun: 25.0
6-kun: 28.0
```
:::

### 5. Savdo hisoboti <Difficulty level="3" />

Quyidagi savdolar röyxatidan foydalanib:

1. `namedtuple` yordamida har bir kortejni `day`, `city`, `amount` maydonli `Sale` ga aylantiring.
2. `defaultdict(int)` yordamida har bir şahar böyiça jami summani toping.
3. `groupby` (kun böyiça saralagandan keyin) va `accumulate` yordamida har bir kunning jamisini va yiğilib boradigan jamini çop eting.

```python
data = [
    ("Mon", "Toşkent", 120000), ("Mon", "Buxoro", 80000),
    ("Tue", "Toşkent", 50000), ("Mon", "Toşkent", 30000),
    ("Wed", "Samarqand", 200000), ("Tue", "Toşkent", 70000),
]
```

::: details Yeçim
```python
from collections import defaultdict, namedtuple
from itertools import accumulate, groupby

data = [
    ("Mon", "Toşkent", 120000), ("Mon", "Buxoro", 80000),
    ("Tue", "Toşkent", 50000), ("Mon", "Toşkent", 30000),
    ("Wed", "Samarqand", 200000), ("Tue", "Toşkent", 70000),
]

Sale = namedtuple("Sale", ["day", "city", "amount"])
sales = [Sale(*row) for row in data]

totals = defaultdict(int)
for s in sales:
    totals[s.city] += s.amount
print(dict(totals))

day_order = {"Mon": 0, "Tue": 1, "Wed": 2}
by_day = sorted(sales, key=lambda s: day_order[s.day])

days = []
day_totals = []
for day, group in groupby(by_day, key=lambda s: s.day):
    days.append(day)
    day_totals.append(sum(s.amount for s in group))

for day, total, running in zip(days, day_totals, accumulate(day_totals)):
    print(f"{day}: {total:>7,}  jami {running:>7,}")
```

```text
{'Toşkent': 270000, 'Buxoro': 80000, 'Samarqand': 200000}
Mon: 230,000  jami 230,000
Tue: 120,000  jami 350,000
Wed: 200,000  jami 550,000
```

Alifbo böyiça saralaş `Wed` ni `Tue` dan oldin qöygan bölardi, şuning uçun `day_order` haqiqiy tartibni beradi.
:::

## Xulosa

- `Counter(items)` bir qatorda sanaydi, eng köp uçraydiganlar uçun `most_common(n)` bor.
- `defaultdict(list)` guruhlaydi, `defaultdict(int)` jamlaydi, lekin yöq kalitni şunçaki öqiş ham uni qöşadi.
- `namedtuple` kortej elementlariga nom beradi (`student.city`), `deque(maxlen=n)` esa faqat oxirgi `n` ta elementni saqlaydi.
- `itertools` natijalari faqat bir marta işlaydi; saqlaş uçun ularni `list()` ga örang.
- `groupby` faqat **ketma-ket** elementlarni guruhlaydi: avval xuddi şu kalit bilan saralang.

## Qöşimça manbalar

- [`collections` - Container datatypes](https://docs.python.org/3/library/collections.html)
- [`itertools` - Functions creating iterators for efficient looping](https://docs.python.org/3/library/itertools.html)
- [Python Tutorial - Brief tour of the standard library](https://docs.python.org/3/tutorial/stdlib.html)
