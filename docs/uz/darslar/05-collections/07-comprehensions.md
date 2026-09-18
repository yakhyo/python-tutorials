---
title: Comprehension ifodalari
description: "Comprehension ifodalari yordamida röyxat, luğat va töplamlarni bitta öqişli qatorda yaratiş: özgartiriş, filtrlaş, şartli qiymatlar, içma-iç sikllar, generator ifodalari va qaçon oddiy sikl yaxşiroq ekani."
---

# Comprehension ifodalari

![Rasm: Comprehension ifodalari](/images/topics-webp-uzb/comprehensions.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- "Sikl içida röyxat yiğiş" kodini bir qatorli **röyxat comprehension ifodasiga** aylantiriş
- `if` bilan **filtrlaş** va `if … else` bilan qiymat tanlaş
- **Luğat** va **töplam** comprehension ifodalari hamda ikkita `for` qismli comprehension ifodalari
- `sum()`, `any()` va `all()` bilan **generator ifodalari** va ular nega faqat bir marta işlaydi
- Qaçon oddiy sikl yaxşiroq tanlov va röyxat, kortej, luğat, töplam qanday taqqoslanadi
:::

## Nega bu muhim

Kundalik kodning katta qismi bir xil tuzilişga ega: *kolleksiyani oliş, har bir elementni özgartiriş yoki filtrlaş, natijalarni yiğiş.* Comprehension ifodalari (comprehension) aynan şu tuzilişni sikldan kamroq kod bilan töğridan-töğri ifodalaydi va ular haqiqiy Python kodida hamma joyda uçraydi.

## Sikldan comprehension ifodasiga

Mana taniş andoza:

```python
numbers = [1, 2, 3, 4, 5]

squares = []
for n in numbers:
    squares.append(n * n)

print(squares)
```

Xuddi şu narsa **röyxat comprehension ifodasi** körinişida:

```python
numbers = [1, 2, 3, 4, 5]

squares = [n * n for n in numbers]

print(squares)
```

```text
[1, 4, 9, 16, 25]
```

Uni şunday öqing: **"`numbers` dagi har bir `n` uçun `n * n`"**. Umumiy şakli `[ifoda for element in kolleksiya]`: avval nima yiğilişi, keyin elementlar qayerdan olinişi.

Ifoda istalgan narsa bölişi mumkin:

```python
names = ["aziza", "bekzod", "dilnoza"]
prices = [12000, 4500, 30000]

print([name.title() for name in names])
print([len(name) for name in names])
print([f"{p:,} söm" for p in prices])
```

```text
['Aziza', 'Bekzod', 'Dilnoza']
[5, 6, 7]
['12,000 söm', '4,500 söm', '30,000 söm']
```

### Sikl özgaruvçisi içkarida qoladi

Comprehension ifodasining sikl özgaruvçisi taşqariga çiqmaydi va şu nomdagi özgaruvçini qayta yozmaydi. `for` siklniki esa yozadi:

```python
x = "taşqi"
squares = [x * x for x in range(3)]
print(x)

for x in range(3):
    pass
print(x)
```

```text
taşqi
2
```

## `if` bilan filtrlaş

Faqat baʼzi elementlarni qoldiriş uçun **oxiriga** `if şart` qöşing. Bu *Röyxatlar* darsidagi "filtr" siklining örnini bosadi: böş röyxat, `for`, `if` va `.append()`.

```python
scores = [72, 95, 58, 88, 64, 91]

high = [s for s in scores if s >= 85]
curved = [s + 5 for s in scores if s < 60]     # özgartiriş va filtrlaş

print(high)
print(curved)
```

```text
[95, 88, 91]
[63]
```

## `if … else` bilan qiymat tanlaş

**Har bir elementga** şartga boğliq qiymat beriş uçun şartli ifodani (*if, elif va else* darsidan) **boşiga** qöying:

```python
scores = [72, 95, 58, 88]

results = ["ötdi" if s >= 60 else "yiqildi" for s in scores]
print(results)
```

```text
['ötdi', 'ötdi', 'yiqildi', 'ötdi']
```

::: warning `if` qayerga yoziladi?
- `[x for x in items if condition]`: **oxiridagi** `if` **filtrlaydi**, şuning uçun natija qisqaroq bölişi mumkin.
- `[a if condition else b for x in items]`: **boşidagi** `if … else` **qiymat tanlaydi**, şuning uçun natija uzunligi bir xil böladi.

Oxiridagi `if` da `else` bölişi mumkin emas.
:::

## Luğat comprehension ifodalari

Jingalak qavslarni `key: value` bilan işlating. Ular mavjud luğatni `.items()` orqali özgartiriş yoki filtrlaş uçun juda qulay:

```python
prices = {"çoy": 15000, "qahva": 45000, "şarbat": 12000}

with_vat = {item: round(price * 1.12) for item, price in prices.items()}
cheap = {item: price for item, price in prices.items() if price < 20000}

print(with_vat)
print(cheap)
```

```text
{'çoy': 16800, 'qahva': 50400, 'şarbat': 13440}
{'çoy': 15000, 'şarbat': 12000}
```

Qiymatlarni özgartirmasdan ikki röyxatni juftlaş uçun *Luğatlar* darsidagi `dict(zip(keys, values))` comprehension ifodasidan soddaroq.

## Töplam comprehension ifodalari

Ikki nuqtasiz jingalak qavslar töplam yasaydi, şuning uçun takrorlar olib taşlanadi:

```python
emails = ["ali@mail.uz", "vali@gmail.com", "gani@mail.uz", "sami@yahoo.com"]

domains = {email.split("@")[1] for email in emails}
print(sorted(domains))
```

```text
['gmail.com', 'mail.uz', 'yahoo.com']
```

## Ikkita `for` qismi

Comprehension ifodasida bir neçta `for` qismi bölişi mumkin. Ular yozilgan içma-iç sikllar bilan **bir xil tartibda** bajariladi:

```python
pairs = [(x, y) for x in range(1, 3) for y in "ab"]
print(pairs)
```

```text
[(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
```

Bu içiga `for y in "ab":` joylaşgan `for x in range(1, 3):` bilan bir xil.

Keng tarqalgan qöllaniş: röyxatlar röyxatini **tekislaş**:

```python
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

flat = [value for row in matrix for value in row]
print(flat)
```

```text
[1, 2, 3, 4, 5, 6, 7, 8, 9]
```

Comprehension ifodasi içma-iç röyxatlarni ham yasay oladi, bu jadval yaratişning xavfsiz usuli: `[[0] * 4 for _ in range(3)]` (*Içma-iç maʼlumotlar* darsiga qarang).

## Generator ifodalari

Kvadrat qavslar örniga **oddiy qavslarni** işlatsangiz, *generator ifodasi* hosil böladi. U elementlarni **röyxat yasamasdan**, bittadan beradi. Qiymatlar töğridan-töğri `sum()`, `max()`, `any()`, `all()` yoki `"".join()` kabi funksiyaga ketganda bu ideal:

```python
prices = [12000, 4500, 30000, 8000]

total_with_vat = sum(p * 1.12 for p in prices)
has_expensive = any(p > 25000 for p in prices)
all_affordable = all(p < 50000 for p in prices)

print(round(total_with_vat))
print(has_expensive, all_affordable)
print(", ".join(str(p) for p in prices))
```

```text
61040
True True
12000, 4500, 30000, 8000
```

`any()` bu *Sikllarda köp işlatiladigan usullar* darsidagi bayroq va `break` bilan qidirişning bir qatorli varianti.

Generator yagona argument bölsa, qöşimça qavslar kerak emas. Kortej comprehension ifodasi esa yöq: `(x for x in items)` generator, şuning uçun kortej uçun `tuple(x for x in items)` deb yozing.

## Qaçon comprehension ifodasini işlatmaslik kerak

Comprehension ifodalari **kolleksiya yasaş** uçun. Quyidagi hollarda oddiy siklni afzal köring:

1. **Öqiş qiyinlaşsa.**

```python
data = [[1, -2], [3, 4], [-5, 6]]

# Yomon: haddan taşqari ayyorona
result = [x * 2 if x > 0 else 0 for row in data for x in row if x != 4]

# Yaxşi: tuşunarliroq
result = []
for row in data:
    for x in row:
        if x == 4:
            continue
        result.append(x * 2 if x > 0 else 0)
print(result)
```

2. **Sizga faqat qöşimça taʼsir kerak bölsa.** `[print(x) for x in items]` `None` lardan iborat keraksiz röyxat yasaydi.
3. **Sikl içida `break`, bir neçta buyruq yoki xatolarni uşlaş kerak bölsa.**

Agar comprehension ifodasi bir-ikki qatorga siğmasa, sikl işlating.

## Kolleksiya tanlaş

Törtta örnatilgan kolleksiya yonma-yon:

| | röyxat | kortej | luğat | töplam |
|---|---|---|---|---|
| Yozilişi | `[1, 2]` | `(1, 2)` | `{"a": 1}` | `{1, 2}` |
| Tartibni saqlaydimi? | ha | ha | ha (qöşiliş tartibi) | yöq |
| Özgartiriş mumkinmi? | ha | yöq | ha | ha |
| Takrorlar? | mumkin | mumkin | kalitlar takrorlanmas | yöq |
| Element qanday topiladi | örin böyiça | örin böyiça | kalit böyiça | faqat `in` |

Törttasidan faqat özgarmas qiymatlardan iborat kortej luğat kaliti yoki töplam elementi böla oladi.

## Özingiz sinab köring

Boşqa narx böyiça filtrlab köring yoki boşqaça luğat tuzing.

<ClientOnly><PythonPlayground :code='"products = [\n    (\"Daftar\", 15000),\n    (\"Ruçka\", 3000),\n    (\"Ryukzak\", 180000),\n    (\"Çizğiç\", 5000),\n]\n\nnames = [name for name, price in products]\ncheap = [name for name, price in products if price < 10000]\nlabels = [f\"{name}: {price:,}\" for name, price in products]\nprice_of = {name: price for name, price in products}\n\nprint(names)\nprint(cheap)\nprint(labels)\nprint(price_of[\"Çizğiç\"])\nprint(\"Jami:\", sum(price for _, price in products))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Filtrda `else`

```py
evens = [n for n in range(10) if n % 2 == 0 else 0]
```

```text
SyntaxError: invalid syntax
```

Python sintaksis notöğri ekanini aytyapti. Har bir element uçun qiymat kerak bölsa, şartni boşiga ötkazing: `[n if n % 2 == 0 else 0 for n in range(10)]`.

### 2. Içma-iç `for` qismlarining notöğri tartibi

```py
matrix = [[1, 2], [3, 4]]
flat = [value for value in row for row in matrix]
```

```text
NameError: name 'row' is not defined. Did you mean: 'pow'?
```

`row` uni aniqlaydigan qismdan oldin işlatilgan. **Tuzatiş:** `for` qismlarini içma-iç sikllar bilan bir xil tartibda, avval taşqisini yozing: `[value for row in matrix for value in row]`.

### 3. Generator ifodasini ikki marta işlatiş

```python
prices = [12000, 4500, 30000, 8000]
cheap = (p for p in prices if p < 10000)
print(sum(cheap))
print(sum(cheap))
```

```text
12500
0
```

Generator elementlarini **bir marta** beradi. Birinçi `sum()` ularning hammasini sarflab böldi, şuning uçun ikkinçisi heç narsa körmaydi va sizni ogohlantiradigan xato ham yöq. **Tuzatiş:** qiymatlar bir neçta marta kerak bölsa, röyxat (`[...]`) işlating.

## Maşqlar

### 1. Selsiydan Farengeytga <Difficulty level="1" />

`celsius = [0, 12.5, 25, 37, 100]` ni bitta comprehension ifodasi bilan Farengeyt qiymatlari röyxatiga (`c * 9 / 5 + 32`) özgartiring.

::: details Yeçim
```python
celsius = [0, 12.5, 25, 37, 100]
fahrenheit = [c * 9 / 5 + 32 for c in celsius]
print(fahrenheit)
```

```text
[32.0, 54.5, 77.0, 98.6, 212.0]
```
:::

### 2. Faqat unli harflarning örni <Difficulty level="1" />

`word = "öquvçilar"` uçun comprehension ifodasi içida `enumerate()` ni işlatib, barça unli harflarning **örinlari** röyxatini tuzing.

::: details Yeçim
```python
word = "öquvçilar"
positions = [i for i, letter in enumerate(word) if letter in "aeiouö"]
print(positions)
```

```text
[0, 2, 5, 7]
```
:::

### 3. Söz uzunliklari luğati <Difficulty level="2" />

`sentence = "comprehension ifodalari python kodini qisqa va tuşunarli qiladi"` uçun har bir sözni uning uzunligiga böğlaydigan luğat tuzing, lekin **faqat 4 harfdan uzun sözlar uçun**.

::: details Yeçim
```python
sentence = "comprehension ifodalari python kodini qisqa va tuşunarli qiladi"
lengths = {word: len(word) for word in sentence.split() if len(word) > 4}
print(lengths)
```

```text
{'comprehension': 13, 'ifodalari': 9, 'python': 6, 'kodini': 6, 'qisqa': 5, 'tuşunarli': 9, 'qiladi': 6}
```
:::

### 4. Siklni qayta yoziş <Difficulty level="2" />

Bu kodni bitta comprehension ifodasi qilib qayta yozing:

```python
result = []
for n in range(1, 21):
    if n % 3 == 0:
        result.append(n * n)
    else:
        result.append(-n)
```

Keyin **faqat** 3 ga karrali sonlarning kvadratlarini qoldiradigan ikkinçi comprehension ifodasini yozing.

::: details Yeçim
```python
result = [n * n if n % 3 == 0 else -n for n in range(1, 21)]
squares_of_threes = [n * n for n in range(1, 21) if n % 3 == 0]

print(result)
print(squares_of_threes)
```

Qiymat tanlaş: şart boşida. Filtrlaş: oxirida.
:::

### 5. Matritsani transponirlaş <Difficulty level="3" />

Matritsani **transponirlaş** qatorlarni ustunlarga aylantiradi. `matrix = [[1, 2, 3], [4, 5, 6]]` ni içma-iç röyxat comprehension ifodasi yordamida `[[1, 4], [2, 5], [3, 6]]` ga transponirlang. Keyin xuddi şuni `zip()` bilan bajaring.

::: details Yeçim
```python
matrix = [[1, 2, 3], [4, 5, 6]]

rows = len(matrix)
cols = len(matrix[0])

transposed = [[matrix[r][c] for r in range(rows)] for c in range(cols)]
print(transposed)

with_zip = [list(column) for column in zip(*matrix)]
print(with_zip)
```

```text
[[1, 4], [2, 5], [3, 6]]
[[1, 4], [2, 5], [3, 6]]
```

`zip(*matrix)` qatorlarni alohida argumentlar sifatida uzatadi, şuning uçun u har bir örindagi elementlarni juftlaydi: bu ustunlar.
:::

## Xulosa

- `[expr for item in items]` röyxat, `{k: v for …}` luğat, `{expr for …}` esa töplam yasaydi.
- **Oxiridagi** `if` filtrlaydi. **Boşidagi** `if … else` har bir element uçun qiymat tanlaydi.
- Bir neçta `for` qismi içma-iç sikllar kabi, avval taşqisi bajariladi: `[x for row in grid for x in row]`.
- Generator ifodalari `(expr for …)` röyxat yasamasdan `sum`, `any`, `all` va `join` ga qiymat uzatadi, lekin faqat bir marta işlaydi.
- Comprehension ifodasini öqiş qiyinlaşsa yoki sizga qöşimça taʼsir, `break` yoki bir neçta buyruq kerak bölsa, oddiy siklni işlating.

## Qöşimça manbalar

- [Python Tutorial - List comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)
- [Python Tutorial - Nested list comprehensions](https://docs.python.org/3/tutorial/datastructures.html#nested-list-comprehensions)
- [Generator expressions](https://docs.python.org/3/reference/expressions.html#generator-expressions)
