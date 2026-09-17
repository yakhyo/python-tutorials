---
title: Kortejlar va qiymatlarni ajratiş
description: "Özgarmas qiymatlarni kortejlarda guruhlaş, ketma-ketliklarni özgaruvçilarga ajratiş, ortiqça qiymatlarni * bilan yiğiş va qaçon röyxat örniga kortej tanlaşni örganiş."
---

# Kortejlar va qiymatlarni ajratiş

![Rasm: Kortejlar va qiymatlarni ajratiş](/images/topics-webp-uzb/tuples-and-unpacking.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Kortej** yaratiş, jumladan bitta elementli kortej
- Nega kortejni özgartirib bölmaydi va kortejlar qanday taqqoslanadi
- Ketma-ketlikni alohida özgaruvçilarga **ajratiş**
- `*rest` qanday qilib "qolgan hamma narsani" yiğadi
- Qaçon röyxat örniga kortej işlatiş kerak
:::

## Nega bu muhim

Baʼzi qiymatlar guruhi birga keladi va özgarmasligi kerak: nuqtaning `(x, y)` koordinatalari, RGB rang `(255, 128, 0)`, sana `(2026, 9, 15)`. **Kortej (tuple)** ana şunday özgarmas guruhni saqlaydi. **Qiymatlarni ajratiş (unpacking)** bilan birga kortejlar kodni qisqaroq va tuşunarliroq qiladi. Siz ularni sezmagan holda allaqaçon işlatgansiz: `a, b = b, a`, `enumerate()` va `zip()` da.

## Kortej yaratiş

Qiymatlarni qavs içiga vergul bilan ajratib yozing:

```python
point = (3, 4)
color = (255, 128, 0)
birthday = (2004, 3, 21)

print(point)
print(type(color))
print(len(birthday))
```

```text
(3, 4)
<class 'tuple'>
3
```

Aslida kortejni qavslar emas, **vergul** yaratadi. Qavslar odatda öqiş qulay bölişi uçun qöyiladi:

```python
size = 1920, 1080
print(size)
```

```text
(1920, 1080)
```

### Böş va bitta elementli kortejlar

```python
empty = ()
single = ("çoy",)      # oxiridagi vergul şart
not_a_tuple = ("çoy")  # qavs içidagi oddiy satr

print(type(single))
print(type(not_a_tuple))
```

```text
<class 'tuple'>
<class 'str'>
```

## Kortejlarni öqiş

Kortejlar ularni özgartirmaydigan hamma amallarni qöllab-quvvatlaydi: indeks, kesim, `len`, `in`, `count`, `index` va sikllar.

```python
weekdays = ("Du", "Se", "Ço", "Pa", "Ju")

print(weekdays[0])
print(weekdays[-2:])
print("Şa" in weekdays)

for day in weekdays:
    print(day, end=" ")
print()
```

```text
Du
('Pa', 'Ju')
False
Du Se Ço Pa Ju 
```

### Kortejlarni taqqoslaş

Kortejlar luğatdagi sözlar kabi **element-baelement** taqqoslanadi: birinçi elementlar hal qiladi, ular teng bölgandagina Python ikkinçi elementga qaraydi va hokazo.

```python
print((1, "b") < (1, "c"))
print((2026, 3, 21) < (2026, 12, 1))
print(sorted([("Bekzod", 85), ("Aziza", 92), ("Aziza", 78)]))
```

```text
True
True
[('Aziza', 78), ('Aziza', 92), ('Bekzod', 85)]
```

Şuning uçun *Röyxatlar bilan işlaş va saralaş* darsidagi `sorted(zip(marks, names))` avval ball böyiça saraladi va `(year, month, day)` körinişida saqlangan sanalar töğri tartiblanadi.

## Kortejlar özgarmas

```py
point = (3, 4)
point[0] = 10
```

```text
TypeError: 'tuple' object does not support item assignment
```

`append`, `remove` yoki `sort` ham yöq. Kortejni "özgartiriş" uçun yangisini yarating:

```python
point = (3, 4)
point = (10, point[1])
print(point)
```

```text
(10, 4)
```

Bu nega foydali?

- **Xavfsizlik:** kortej elementlarini tasodifan almaştirib yoki öçirib bölmaydi.
- **Maʼno:** kortej "bu bitta özgarmas yozuv" deydi, röyxat esa "bu kengayişi mumkin bölgan kolleksiya" deydi.
- **Luğat kalitlari:** özgarmas qiymatlardan (sonlar, satrlar, şunday kortejlar) iborat kortejlarni luğatlarda kalit va töplamlarda element sifatida işlatiş mumkin. Röyxatlarni esa yöq. (*Luğatlar* va *Töplamlar* darslariga qarang.)

```python
distances = {("Toşkent", "Samarqand"): 300, ("Toşkent", "Buxoro"): 570}
print(distances[("Toşkent", "Buxoro")])
```

```text
570
```

### Özgarmas, lekin faqat bir daraja çuqurlikda

Kortej *qaysi* obyektlarni saqlaşini qatʼiy belgilaydi, ularning içida nima bölişini emas. Agar elementlardan biri röyxat bölsa, u röyxat baribir özgarişi mumkin va kortej endi luğat kaliti böla olmaydi:

```python
team = ("Aziza", ["Bekzod"])
team[1].append("Dilnoza")
print(team)

try:
    groups = {team: "A guruh"}
except TypeError as error:
    print("TypeError:", error)
```

```text
('Aziza', ['Bekzod', 'Dilnoza'])
TypeError: cannot use 'tuple' as a dict key (unhashable type: 'list')
```

## Qiymatlarni ajratiş

**Ajratiş** ketma-ketlik elementlarini bir vaqtning özida bir neçta özgaruvçiga beradi:

```python
point = (3, 4)
x, y = point

print(f"x = {x}, y = {y}")
```

```text
x = 3, y = 4
```

Bu istalgan iteratsiyalanuvçi bilan işlaydi: kortejlar, röyxatlar, satrlar va `.split()` natijalari:

```python
first, last = "Aziza Karimova".split()
day, month, year = "15/09/2026".split("/")
a, b, c = "xyz"

print(last, year, c)
```

```text
Karimova 2026 z
```

Özgaruvçilar soni elementlar soniga teng bölişi kerak:

```py
x, y = (1, 2, 3)
```

```text
ValueError: too many values to unpack (expected 2, got 3)
```

### Sikllarda ajratiş

Ajratişning haqiqiy kuçi aynan şu yerda körinadi. Siz buni kortejlar hosil qiluvçi `enumerate()` va `zip()` bilan körgansiz:

```python
students = [("Aziza", 92), ("Bekzod", 85), ("Dilnoza", 78)]

for name, score in students:
    print(f"{name}: {score}")
```

```text
Aziza: 92
Bekzod: 85
Dilnoza: 78
```

Buni `student[0]` va `student[1]` bilan soliştiring: nomlar kodni özi tuşuntirib beradi.

### Qiymatlarni almaştiriş

Endi *Özgaruvçilar* darsidagi almaştiriş qanday işlaşini köriş mumkin:

```python
a, b = 1, 2
a, b = b, a      # öng tomon (2, 1) kortejini yasaydi, keyin u ajratiladi
print(a, b)
```

```text
2 1
```

### `_` bilan qiymatlarni eʼtiborsiz qoldiriş

Kerak bölmagan qiymatlar uçun `_` ni işlating:

```python
record = ("Aziza", "Karimova", 20, "Toşkent")
first_name, _, age, _ = record
print(first_name, age)
```

```text
Aziza 20
```

## Qolganini `*` bilan yiğiş

Yulduzçali özgaruvçi **qolgan barça elementlarni** röyxatga yiğadi:

```python
scores = [95, 88, 72, 64, 58]

best, *others = scores
print(best)
print(others)

*earlier, last = scores
print(last)

first, *middle, final = scores
print(middle)
```

```text
95
[88, 72, 64, 58]
58
[88, 72, 64]
```

Bitta ajratişda faqat bitta yulduzçali özgaruvçi bölişi mumkin. U nol elementni ham yiğişi mumkin, bu holda u böş röyxat böladi.

Qulay qöllaniş: buyruqni uning argumentlaridan ajratiş:

```python
command, *arguments = "copy hisobot.txt zaxira.txt".split()
print(command)
print(arguments)
```

```text
copy
['hisobot.txt', 'zaxira.txt']
```

## Içma-iç ajratiş

Agar elementlar içida kortejlar bölsa, tuzilmani bir yöla ajratiş mumkin:

```python
route = ("51-avtobus", (41.31, 69.28), (41.35, 69.22))
name, (start_lat, start_lon), (end_lat, end_lon) = route
print(name, start_lat, end_lon)
```

```text
51-avtobus 41.31 69.22
```

Xuddi şu narsa siklda ham işlaydi. `enumerate(zip(items, prices))` `(1, ("çoy", 15000))` kabi juftliklar beradi, şuning uçun sikl özgaruvçilari ham şu şaklni takrorlaydi:

```python
items = ["çoy", "somsa", "şarbat"]
prices = [15000, 8000, 12000]

for number, (item, price) in enumerate(zip(items, prices), start=1):
    print(f"{number}. {item}: {price:,} söm")
```

```text
1. çoy: 15,000 söm
2. somsa: 8,000 söm
3. şarbat: 12,000 söm
```

## Bir neçta qiymat qaytariş

Funksiyalar (Funksiyalar modulida) bittadan ortiq qiymat qaytariş uçun köpinça kortej qaytaradi, çaqiruvçi esa uni ajratib oladi. Örnatilgan misol: `divmod()`, u `//` va `%` natijalarini birga qaytaradi:

```python
hours, minutes = divmod(135, 60)
print(f"{hours} soat {minutes} daqiqa")
```

```text
2 soat 15 daqiqa
```

## Kortejmi yoki röyxatmi?

| **Kortej** işlating, agar… | **Röyxat** işlating, agar… |
|---|---|
| elementlar soni özgarmas bölsa | elementlar qöşilsa yoki öçirilsa |
| har bir örinning öz maʼnosi bölsa: (x, y), (ism, yoş) | barça elementlar bir xil turdagi narsa bölsa |
| maʼlumot özgarmasligi kerak bölsa | uni saralaysiz yoki özgartirasiz |
| luğat kaliti yoki töplam elementi kerak bölsa | |

Yaxşi amaliy qoida: kortej jadvalning **bitta qatoriga**, röyxat esa **butun ustuniga** öxşaydi.

## Özingiz sinab köring

Har bir yozuvni ajrating va formatlangan jadval çiqaring. Keyin yangi yozuv qöşing.

<ClientOnly><PythonPlayground :code='"cities = [\n    (\"Toşkent\", 2_956_000, 334.8),\n    (\"Samarqand\", 551_000, 120.0),\n    (\"Namangan\", 668_000, 145.0),\n]\n\nprint(\"Şahar             Aholi     km²  1 km² ga\")\nfor name, population, area in cities:\n    density = population / area\n    print(f\"{name:<10}{population:>12,}{area:>8.1f}{density:>10,.0f}\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Bitta elementli kortejda vergulni unutiş

```python
colors = ("qizil")
print(type(colors))
```

```text
<class 'str'>
```

Qavslarning özi heç narsa qilmaydi. **Tuzatiş:** `colors = ("qizil",)`.

### 2. `zip()` elementlarni indamay taşlab yuborişi

```python
names = ["Aziza", "Bekzod", "Dilnoza"]
marks = [92, 85]
for name, mark in zip(names, marks):
    print(name, mark)
```

```text
Aziza 92
Bekzod 85
```

Dilnoza heç qanday xatosiz ğoyib böldi: `zip()` eng qisqa kiritmada töxtaydi. **Tuzatiş:** `strict=True` bering, şunda qisqa röyxat tugagaç uzunliklar mos kelmasligi xato beradi:

```text
ValueError: zip() argument 2 is shorter than argument 1
```

### 3. Özgaruvçilar soni notöğri

```py
name, age = ("Aziza", 20, "Toşkent")
```

```text
ValueError: too many values to unpack (expected 2, got 3)
```

Qiymatlar juda kam bölsa, xabar `not enough values to unpack` (ajratiş uçun qiymatlar yetarli emas) böladi. **Tuzatiş:** sonini moslang yoki `*rest` yoki `_` ni işlating.

### 4. Satrni tasodifan ajratiş

```python
first, second = "ab"      # işlaydi: 'a' va 'b'
print(first)
```

```py
first, second = "abc"
```

```text
ValueError: too many values to unpack (expected 2)
```

Satrlar belgilar ketma-ketligi, şuning uçun ular belgima-belgi ajratiladi. Balki avval `.split()` qilmoqçi edingiz?

## Maşqlar

### 1. Koordinatalar <Difficulty level="1" />

`location = (41.2995, 69.2401)` kortejini yarating va uni `latitude` va `longitude` ga ajrating. Ularni 2 xona aniqlikda çiqaring.

::: details Yeçim
```python
location = (41.2995, 69.2401)
latitude, longitude = location
print(f"Kenglik: {latitude:.2f}, uzunlik: {longitude:.2f}")
```
:::

### 2. Yozuvni tahlil qiliş <Difficulty level="1" />

`"Bekzod,Tursunov,22,Andijon"` ni (vergul böyiça bölib) törtta özgaruvçiga ajrating va `Bekzod Tursunov (22), Andijon` ni çiqaring.

::: details Yeçim
```python
first, last, age, city = "Bekzod,Tursunov,22,Andijon".split(",")
print(f"{first} {last} ({age}), {city}")
```
:::

### 3. Nuqtalar orasidagi masofa <Difficulty level="2" />

`a = (1, 2)` va `b = (4, 6)` berilgan. Ikkalasini ajrating va töğri çiziqli masofani `√((x2 − x1)² + (y2 − y1)²)` formulasi bilan hisoblang. Javob `5.0`.

::: details Yeçim
```python
import math

a = (1, 2)
b = (4, 6)

x1, y1 = a
x2, y2 = b

distance = math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
print(distance)
```

`math.dist(a, b)` xuddi şu hisobni töğridan-töğri bajaradi.
:::

### 4. Birinçilar va qolganlar <Difficulty level="2" />

`race = ["Dilnoza", "Aziza", "Bekzod", "Farrux", "Gulnora"]` (marraga yetib kelgan tartibda) berilgan. Yulduzçali ajratiş bilan ğolibni, ikkinçi örinni va qolgan hammani bitta qatorda çiqaring.

::: details Yeçim
```python
race = ["Dilnoza", "Aziza", "Bekzod", "Farrux", "Gulnora"]

winner, runner_up, *rest = race
print(f"Ğolib: {winner}")
print(f"Ikkinçi örin: {runner_up}")
print(f"Marraga yetganlar: {', '.join(rest)}")
```
:::

### 5. Kortejlardan baholar hisoboti <Difficulty level="3" />

`(ism, [ballar])` kortejlari röyxati berilgan:

```python
records = [
    ("Aziza", [90, 85, 97]),
    ("Bekzod", [72, 64, 80]),
    ("Dilnoza", [88, 91, 79]),
]
```

Har bir öquvçi uçun ismi, örtaça bali (1 xona aniqlikda), eng yuqori va eng past balini çiqaring. Oxirida örtaça bali eng yuqori bölgan öquvçining ismini çiqaring.

::: details Yeçim
```python
records = [
    ("Aziza", [90, 85, 97]),
    ("Bekzod", [72, 64, 80]),
    ("Dilnoza", [88, 91, 79]),
]

best_name, best_average = None, 0

for name, scores in records:
    average = sum(scores) / len(scores)
    print(f"{name:<8} örtaça {average:5.1f}  eng yuqori {max(scores)}  eng past {min(scores)}")
    if average > best_average:
        best_name, best_average = name, average

print(f"Eng yaxşi öquvçi: {best_name}")
```

```text
Aziza    örtaça  90.7  eng yuqori 97  eng past 85
Bekzod   örtaça  72.0  eng yuqori 80  eng past 64
Dilnoza  örtaça  86.0  eng yuqori 91  eng past 79
Eng yaxşi öquvçi: Aziza
```
:::

## Xulosa

- **Kortej** bu tartiblangan, **özgarmas (immutable)** ketma-ketlik: `(a, b, c)`. Uni vergul yaratadi, şuning uçun bitta element uçun `("x",)` deb yozing.
- Kortejlar indeks, kesim, `len`, `in` va sikllarni qöllab-quvvatlaydi, lekin özgartirişni emas. Özgarmas qiymatlardan iborat kortejlar luğat kaliti va töplam elementi böla oladi.
- Kortejlar element-baelement taqqoslanadi, şuning uçun juftliklarni saralaş avval birinçi, keyin ikkinçi element böyiça saralaydi.
- **Ajratiş** elementlarni özgaruvçilarga beradi: `x, y = point`, jumladan sikllarda ham. Sonlar mos kelişi kerak, `*rest` qolganini röyxatga yiğadi, `_` esa qiymatni eʼtiborsiz qoldiradi.
- Özgarmas yozuvlar uçun kortejlarni, özgaradigan kolleksiyalar uçun röyxatlarni işlating.

## Qöşimça manbalar

- [Python Tutorial - Tuples and sequences](https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences)
- [PEP 3132 - Extended iterable unpacking](https://peps.python.org/pep-3132/)
