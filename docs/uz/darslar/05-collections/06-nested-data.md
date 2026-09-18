---
title: Içma-iç maʼlumotlar
description: "Röyxat, luğat va kortejlarni real maʼlumotlarga birlaştiriş: luğatlar röyxati, röyxatlar luğati, jadvallar, içma-iç qiymatlarni öqiş va yangilaş hamda ulaşilgan nusxa xatolaridan qoçiş."
---

# Içma-iç maʼlumotlar

![Rasm: Içma-iç maʼlumotlar](/images/topics-webp-uzb/nested-data.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Kolleksiyalarni kolleksiyalar içiga joylaş
- Eng keng tarqalgan şakllar: **luğatlar röyxati**, **röyxatlar luğati**, **luğatlar luğati** va **röyxatlar röyxati**
- Bir neçta daraja çuqurlikdagi qiymatlarni öqiş va yangilaş
- Içma-iç maʼlumotlar böyiça sikl yurgiziş va ularni umumlaştiriş
- Sayoz nusxa va `[[0] * 3] * 3` tuzoqlari
:::

## Nega bu muhim

Real maʼlumotlar kamdan-kam hollarda sonlarning oddiy röyxati böladi. Dökonda mahsulotlar bor, har birining nomi, narxi va teglari bor. Maktabda bir neçtadan bahoga ega öquvçilardan iborat sinflar bor. Veb-saytlar va API lardan keladigan maʼlumotlar (odatda JSON) aynan şunday içma-iç tuzilgan, şuning uçun içma-iç tuzilmalarda erkin harakatlana olsangiz, dastur oladigan deyarli har qanday maʼlumot bilan işlay olasiz.

## 1-şakl: luğatlar röyxati

**Maydonlari bir xil bölgan köp yozuvlar.** Bu eng keng tarqalgan şakl: uni jadval qatorlari deb tasavvur qiling.

```python
students = [
    {"name": "Aziza", "age": 20, "city": "Toşkent"},
    {"name": "Bekzod", "age": 22, "city": "Samarqand"},
    {"name": "Dilnoza", "age": 19, "city": "Toşkent"},
]

print(students[1])             # bitta butun yozuv
print(students[1]["name"])     # bitta yozuvning bitta maydoni

for student in students:       # har safar bitta luğat
    print(f"{student['name']:<8} {student['city']}")
```

```text
{'name': 'Bekzod', 'age': 22, 'city': 'Samarqand'}
Bekzod
Aziza    Toşkent
Bekzod   Samarqand
Dilnoza  Toşkent
```

`students[1]["name"]` ni **çapdan önga** öqing: `students` ni oling, `1`-elementini (luğatni) oling, keyin uning `"name"` qiymatini oling.

Luğatlar röyxatini saralaş uçun maydonni tanlaydigan kalit kerak:

```python
students = [
    {"name": "Aziza", "age": 20},
    {"name": "Bekzod", "age": 22},
    {"name": "Dilnoza", "age": 19},
]

for s in sorted(students, key=lambda s: s["age"]):
    print(s["name"], s["age"])
```

```text
Dilnoza 19
Aziza 20
Bekzod 22
```

`lambda s: s["age"]` bu joyida yozilgan kiçkina funksiya: "`s` öquvçi berilsa, `s["age"]` ni qaytar". `sorted()` uni har bir luğat uçun çaqiradi va qaytgan yoşlar böyiça saralaydi. `lambda` *Lambda va yuqori tartibli funksiyalar* darsida töliq tuşuntiriladi.

## 2-şakl: röyxatlar luğati

**Har bir kalit ostida guruhlangan bir neçta element.**

```python
grades = {
    "Aziza": [90, 85, 97],
    "Bekzod": [72, 64, 80],
}

grades["Aziza"].append(88)          # Aziza uçun baho qöşamiz
grades["Dilnoza"] = [79]            # yangi öquvçi qöşamiz

for name, scores in grades.items():
    average = sum(scores) / len(scores)
    print(f"{name}: {scores} → {average:.1f}")
```

```text
Aziza: [90, 85, 97, 88] → 90.0
Bekzod: [72, 64, 80] → 72.0
Dilnoza: [79] → 79.0
```

Bu şaklni tekis maʼlumotlardan quriş uçun *Luğatlar* darsidagi guruhlaş andozasini işlating:

```python
orders = [("Aziza", "çoy"), ("Bekzod", "qahva"), ("Aziza", "somsa")]

by_customer = {}
for customer, item in orders:
    by_customer.setdefault(customer, []).append(item)

print(by_customer)
```

```text
{'Aziza': ['çoy', 'somsa'], 'Bekzod': ['qahva']}
```

## 3-şakl: luğatlar luğati

**Takrorlanmas ID böyiça topiladigan yozuvlar.**

```python
products = {
    "P001": {"name": "Daftar", "price": 15000, "stock": 40},
    "P002": {"name": "Ruçka", "price": 3000, "stock": 0},
    "P003": {"name": "Ryukzak", "price": 180000, "stock": 5},
}

print(products["P003"]["price"])

products["P002"]["stock"] += 25          # bitta maydonni yangilaymiz
products["P004"] = {"name": "Çizğiç", "price": 5000, "stock": 12}

for code, info in products.items():
    status = "bor" if info["stock"] > 0 else "TUGAGAN"
    print(f"{code}  {info['name']:<9} {info['price']:>8,}  {status}")
```

```text
180000
P001  Daftar      15,000  bor
P002  Ruçka        3,000  bor
P003  Ryukzak    180,000  bor
P004  Çizğiç       5,000  bor
```

Luğatlar röyxatidan farqli ravişda, yozuvni ID böyiça topiş uçun sikl kerak emas.

## 4-şakl: röyxatlar röyxati (jadval)

![Diagramma: 4-şakl: röyxatlar röyxati (jadval)](/images/companions-webp-uzb/nested-grid.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

**Qatorlar va ustunlar**: öyin taxtasi, örindiqlar sxemasi yoki sonlar jadvali.

```python
board = [
    ["X", "O", "X"],
    [" ", "X", "O"],
    ["O", " ", "X"],
]

print(board[0][2])     # 0-qator, 2-ustun

board[1][0] = "O"      # belgi qöyamiz

for row in board:
    print(" | ".join(row))
```

```text
X
X | O | X
O | X | O
O |   | X
```

`board[row][col]`: birinçi indeks qatorni, ikkinçisi esa şu qatordagi elementni tanlaydi.

Içma-iç sikllar har bir katakni aylanib çiqadi:

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
]

total = 0
for row in matrix:
    for value in row:
        total += value

print(total)
```

```text
21
```

## Yanada çuqurroq

Tuzilmalar kerakliça çuqur joylaşişi mumkin. Quyidagi misol veb API dan keladigan odatiy maʼlumotlarga öxşaydi:

```python
order = {
    "id": 5012,
    "customer": {"name": "Aziza", "phone": "+998901234567"},
    "items": [
        {"product": "Çoy", "qty": 2, "price": 15000},
        {"product": "Somsa", "qty": 4, "price": 8000},
    ],
    "delivery": {"address": {"city": "Toşkent", "street": "Amir Temur 1"}},
}

print(order["customer"]["name"])
print(order["items"][1]["product"])
print(order["delivery"]["address"]["city"])

total = 0
for item in order["items"]:
    total += item["qty"] * item["price"]
print(f"Buyurtma summasi: {total:,} söm")
```

```text
Aziza
Somsa
Toşkent
Buyurtma summasi: 62,000 söm
```

::: tip Yölni qadamma-qadam aniqlang
Har bir darajada turini tekşiring: `order` luğat → `order["items"]` röyxat → `order["items"][1]` luğat → `["product"]` satr.
:::

### Çuqurdagi yöq kalitlar

Ketma-ket `.get()` çaqiruvlari baʼzi qismlar yöq bölganda `KeyError` dan saqlaydi. Har bir daraja uçun standart qiymat sifatida böş luğat bering:

```python
order = {"id": 5013, "customer": {"name": "Bekzod"}}

city = order.get("delivery", {}).get("address", {}).get("city", "nomaʼlum")
print(city)
```

```text
nomaʼlum
```

## Içma-iç maʼlumotlarni çiroyli çiqariş

`print()` hamma narsani bitta qatorga çiqaradi. `pprint` moduli ("pretty print", yaʼni çiroyli çiqariş) uni qatorlarga taqsimlaydi:

```python
from pprint import pprint

data = {"name": "Aziza", "scores": [90, 85, 97], "address": {"city": "Toşkent", "zip": "100000"}}
pprint(data, width=40)
```

```text
{'address': {'city': 'Toşkent',
             'zip': '100000'},
 'name': 'Aziza',
 'scores': [90, 85, 97]}
```

## Nusxalaş tuzoği

`.copy()` **sayoz** nusxa oladi: taşqi konteyner yangi, lekin içki röyxatlar va luğatlar hali ham **ulaşilgan** böladi:

```python
original = {"name": "Aziza", "scores": [90, 85]}
shallow = original.copy()

shallow["name"] = "Özgartirildi"    # qiymatni almaştiriş: faqat nusxa özgaradi
shallow["scores"].append(100)       # ulaşilgan içki röyxatni özgartiriş: ikkalasi ham köradi

print(original)
print(shallow)
```

```text
{'name': 'Aziza', 'scores': [90, 85, 100]}
{'name': 'Özgartirildi', 'scores': [90, 85, 100]}
```

Töliq mustaqil nusxa uçun `import copy` qiling va `copy.deepcopy(original)` ni işlating. U içki röyxat va luğatlarni ham, har bir darajada, nusxalaydi.

## Özingiz sinab köring

Içma-iç buyurtma maʼlumotlarini örganing: element qöşing, miqdorni özgartiring yoki eng qimmat qatorni çiqaring.

<ClientOnly><PythonPlayground :code='"order = {\n    \"customer\": {\"name\": \"Aziza\", \"city\": \"Toşkent\"},\n    \"items\": [\n        {\"product\": \"Çoy\", \"qty\": 2, \"price\": 15000},\n        {\"product\": \"Somsa\", \"qty\": 4, \"price\": 8000},\n    ],\n}\n\norder[\"items\"].append({\"product\": \"Şarbat\", \"qty\": 1, \"price\": 12000})\n\nprint(\"Mijoz:\", order[\"customer\"][\"name\"])\ntotal = 0\nfor item in order[\"items\"]:\n    product, qty, price = item[\"product\"], item[\"qty\"], item[\"price\"]\n    line = qty * price\n    total += line\n    print(f\"  {product:<6} x{qty}  {line:>7,}\")\nprint(f\"Jami: {total:,} söm\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Qaysidir darajada tur notöğri

```py
students = [{"name": "Aziza"}, {"name": "Bekzod"}]
print(students["name"])
```

```text
TypeError: list indices must be integers or slices, not str
```

Python röyxat indeksi satr emas, butun son yoki kesim bölişi kerakligini aytyapti. `students` bu **röyxat**, şuning uçun avval son kerak: `students[0]["name"]`. Yöl qayerda buzilganini topiş uçun `type()` ni har bir darajada bittadan çiqarib köring.

### 2. Jadvalni `*` bilan yasaş

```python
grid = [[0] * 3] * 3      # 3 ta alohida qatorga öxşaydi...
grid[0][0] = 1
print(grid)
```

```text
[[1, 0, 0], [1, 0, 0], [1, 0, 0]]
```

`* 3` **aynan bitta** içki röyxatni uç marta takrorladi. **Tuzatiş:** har safar yangi qator yarating:

```python
grid = [[0] * 3 for _ in range(3)]
grid[0][0] = 1
print(grid)
```

```text
[[1, 0, 0], [0, 0, 0], [0, 0, 0]]
```

### 3. Jadvalni `.copy()` bilan nusxalaş

```python
grid = [[0, 0], [0, 0]]
backup = grid.copy()
grid[0][0] = 9
print(backup)
```

```text
[[9, 0], [0, 0]]
```

"Zaxira nusxa" ham özgardi. `.copy()` taşqi röyxatni nusxaladi, lekin ikkala röyxat ham **aynan bir xil** qator röyxatlarini saqlaydi. **Tuzatiş:** `copy.deepcopy(grid)` yoki har bir qatorni nusxalang: `[row.copy() for row in grid]`.

## Maşqlar

### 1. Kitob javoni <Difficulty level="1" />

Berilgan

```python
books = [
    {"title": "Python asoslari", "year": 2021, "pages": 320},
    {"title": "Maʼlumotlar ilmiga kiriş", "year": 2019, "pages": 450},
    {"title": "Python bilan veb", "year": 2023, "pages": 280},
]
```

röyxatdagi ikkinçi kitobning nomini, keyin barça kitoblar sahifalarining umumiy sonini çiqaring.

::: details Yeçim
```python
books = [
    {"title": "Python asoslari", "year": 2021, "pages": 320},
    {"title": "Maʼlumotlar ilmiga kiriş", "year": 2019, "pages": 450},
    {"title": "Python bilan veb", "year": 2023, "pages": 280},
]

print(books[1]["title"])

total_pages = 0
for book in books:
    total_pages += book["pages"]
print(total_pages)
```
:::

### 2. Sinflarning örtaça bahosi <Difficulty level="1" />

`classes = {"9A": [4, 5, 3, 5], "9B": [5, 5, 4], "9C": [3, 4, 4, 2, 5]}` uçun har bir sinfni örtaça bahosi bilan (2 xona aniqlikda) çiqaring.

::: details Yeçim
```python
classes = {"9A": [4, 5, 3, 5], "9B": [5, 5, 4], "9C": [3, 4, 4, 2, 5]}

for name, marks in classes.items():
    print(f"{name}: {sum(marks) / len(marks):.2f}")
```
:::

### 3. Krestik-nolik ğolibi <Difficulty level="2" />

Uşbu `board` ning har bir **qatori** va **ustunini** tekşiring. Birortasida `" "` bölmagan uçta bir xil belgi bölsa, ğolib belgini çiqaring, aks holda `Hozirça ğolib yöq` ni çiqaring.

```python
board = [
    ["X", "O", "O"],
    ["X", "O", " "],
    ["X", " ", "O"],
]
```

::: details Yeçim
```python
board = [
    ["X", "O", "O"],
    ["X", "O", " "],
    ["X", " ", "O"],
]

winner = None

for i in range(3):
    row = board[i]
    column = [board[r][i] for r in range(3)]
    for line in (row, column):
        if line[0] != " " and line[0] == line[1] == line[2]:
            winner = line[0]

print(f"Ğolib: {winner}" if winner else "Hozirça ğolib yöq")
```

```text
Ğolib: X
```
:::

### 4. Ombor hisoboti <Difficulty level="2" />

Quyidagi luğatlar luğatidan foydalanib, töldiriş kerak bölgan mahsulotlarni (qoldiği `min_stock` dan kam) va barça qoldiqning umumiy qiymatini (narx × qoldiq) çiqaring.

```python
inventory = {
    "çoy": {"price": 15000, "stock": 12, "min_stock": 20},
    "şakar": {"price": 9000, "stock": 50, "min_stock": 30},
    "qahva": {"price": 45000, "stock": 4, "min_stock": 10},
}
```

::: details Yeçim
```python
inventory = {
    "çoy": {"price": 15000, "stock": 12, "min_stock": 20},
    "şakar": {"price": 9000, "stock": 50, "min_stock": 30},
    "qahva": {"price": 45000, "stock": 4, "min_stock": 10},
}

total_value = 0
for product, info in inventory.items():
    total_value += info["price"] * info["stock"]
    if info["stock"] < info["min_stock"]:
        need = info["min_stock"] - info["stock"]
        print(f"Töldiriş kerak: {product}, kamida {need} ta buyurtma qiling")

print(f"Qoldiqning umumiy qiymati: {total_value:,} söm")
```

```text
Töldiriş kerak: çoy, kamida 8 ta buyurtma qiling
Töldiriş kerak: qahva, kamida 6 ta buyurtma qiling
Qoldiqning umumiy qiymati: 810,000 söm
```
:::

### 5. Guruhlaş va umumlaştiriş <Difficulty level="3" />

Uşbu savdolarni har bir **şaharni** uning **savdolar soni** va **umumiy summasi** saqlanadigan luğatga böğlaydigan luğatga aylantiring. Şaharlarni umumiy summa böyiça, eng kattasidan boşlab çiqaring.

```python
sales = [
    {"city": "Toşkent", "amount": 120000},
    {"city": "Samarqand", "amount": 80000},
    {"city": "Toşkent", "amount": 45000},
    {"city": "Buxoro", "amount": 150000},
    {"city": "Samarqand", "amount": 30000},
]
```

Kutilgan natija:

```text
Toşkent: 2 ta savdo, 165,000 söm
Buxoro: 1 ta savdo, 150,000 söm
Samarqand: 2 ta savdo, 110,000 söm
```

::: details Yeçim
```python
sales = [
    {"city": "Toşkent", "amount": 120000},
    {"city": "Samarqand", "amount": 80000},
    {"city": "Toşkent", "amount": 45000},
    {"city": "Buxoro", "amount": 150000},
    {"city": "Samarqand", "amount": 30000},
]

summary = {}
for sale in sales:
    city = sale["city"]
    if city not in summary:
        summary[city] = {"count": 0, "total": 0}
    summary[city]["count"] += 1
    summary[city]["total"] += sale["amount"]

ranked = sorted(summary.items(), key=lambda pair: pair[1]["total"], reverse=True)

for city, stats in ranked:
    print(f"{city}: {stats['count']} ta savdo, {stats['total']:,} söm")
```

`summary.items()` `(city, stats)` juftliklarini beradi, şuning uçun `lambda` kalit `pair[1]["total"]` orqali içki luğatga murojaat qiladi.
:::

## Xulosa

- Kolleksiyalar boşqa kolleksiyalarni öz içiga ola oladi. Murojaat yölini **çapdan önga** öqing: `data["items"][0]["price"]`.
- Maydonlari bir xil yozuvlar uçun **luğatlar röyxati**, guruhlar uçun **röyxatlar luğati**, ID böyiça yozuvlar uçun **luğatlar luğati**, jadvallar uçun esa **röyxatlar röyxati**.
- Har safar bitta daraja böyiça sikl yurgizing, jadvallar uçun içma-iç sikllardan foydalaning. Ketma-ket `.get(key, {})` ixtiyoriy qismlarni hal qiladi, `pprint` esa çuqur maʼlumotlarni körsatadi.
- Jadvallarni `[[0] * cols] * rows` bilan emas, `[[0] * cols for _ in range(rows)]` bilan yasang.
- `.copy()` luğatlarda ham, jadvallarda ham sayoz nusxa oladi. Töliq mustaqil içma-iç nusxalar uçun `copy.deepcopy()` ni işlating.

## Qöşimça manbalar

- [Python Tutorial - Data structures](https://docs.python.org/3/tutorial/datastructures.html)
- [`pprint` - data pretty printer](https://docs.python.org/3/library/pprint.html)
- [`copy` - shallow and deep copy](https://docs.python.org/3/library/copy.html)
