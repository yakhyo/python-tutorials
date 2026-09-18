---
title: Röyxatlar bilan işlaş va saralaş
description: "Röyxatlarni sort() va sorted() bilan saralaş, tartibni reverse va key orqali boşqariş, min, max va sum dan foydalaniş hamda takrorlarni olib taşlaş va birlaştiriş kabi odatiy vazifalar."
---

# Röyxatlar bilan işlaş va saralaş

![Rasm: Röyxatlar bilan işlaş va saralaş](/images/topics-webp-uzb/list-operations-and-sorting.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `list.sort()` va `sorted()` örtasidagi farq
- Teskari tartibda va **key** funksiyasi bilan saralaş
- Matnni katta-kiçik harflardan qatʼi nazar alifbo böyiça saralaş
- Röyxatlar uçun örnatilgan funksiyalar: `min`, `max`, `sum`, `len`, `reversed`
- Kundalik vazifalar: takrorlarni olib taşlaş, örinni topiş va matnga birlaştiriş
:::

## Nega bu muhim

Maʼlumot röyxatga tuşgaç, odatda uni **tartibga solgingiz** keladi: ballarni eng yuqorisidan eng pastigaça joylaş, ismlarni alifbo böyiça çiqariş, eng arzon mahsulotlarni birinçi körsatiş. Pythonda saralaş tez, moslaşuvçan va bir qatorda bajariladi. Faqat unga *nima* böyiça saralaşni aytişni bilsangiz böldi.

## `sort()` va `sorted()`

Saralaşning ikki usuli bor va ularning farqi muhim:

```python
scores = [72, 95, 58, 88]

ranked = sorted(scores)     # YANGI saralangan röyxat qaytaradi
print(ranked)
print(scores)               # asl röyxat özgarmagan

scores.sort()               # röyxatning ÖZINI saralaydi, None qaytaradi
print(scores)
```

```text
[58, 72, 88, 95]
[72, 95, 58, 88]
[58, 72, 88, 95]
```

| | `sorted(items)` | `items.sort()` |
|---|---|---|
| Asl röyxatni özgartiradimi? | Yöq | **Ha** |
| Qaytaradi | yangi röyxat | `None` |
| Nimalar bilan işlaydi | istalgan iteratsiyalanuvçi: röyxat, satr, kortej, töplam, luğat… | faqat röyxatlar |

Asl tartib ham kerak bölsa, `sorted()` ni işlating. U endi kerak bölmasa, `.sort()` ni işlating.

`sorted()` istalgan takrorlanuvçi obyekt bilan işlaydi va har doim röyxat qaytaradi:

```python
print(sorted("python"))
print(sorted((3, 1, 2)))
```

```text
['h', 'n', 'o', 'p', 't', 'y']
[1, 2, 3]
```

## Teskari tartib

Ikkalasi ham `reverse=True` ni qabul qiladi:

```python
scores = [72, 95, 58, 88]

print(sorted(scores, reverse=True))

scores.sort(reverse=True)
print(scores)
```

```text
[95, 88, 72, 58]
[95, 88, 72, 58]
```

Buni `.reverse()` bilan adaştirmang: u **saralamasdan**, joriy tartibni şunçaki teskari aylantiradi:

```python
letters = ["b", "c", "a"]
letters.reverse()
print(letters)
```

```text
['a', 'c', 'b']
```

## Matnni saralaş

Satrlar belgi kodlari böyiça saralanadi (*Mantiqiy qiymatlar va taqqoslaş* darsiga qarang), şuning uçun **barça katta harflar kiçik harflardan oldin keladi**:

```python
names = ["bekzod", "Aziza", "dilnoza", "Gulnora"]
print(sorted(names))
```

```text
['Aziza', 'Gulnora', 'bekzod', 'dilnoza']
```

Odatda odamlar buni kutmaydi. Yeçim **key** dan foydalaniş.

## key bilan saralaş

`key=` Pythonga har bir element uçun **nimani taqqoslaş kerakligini** aytadi. Siz funksiya berasiz, Python uni har bir elementga qöllaydi va natijalar böyiça saralaydi. Elementlarning özi özgarmaydi.

```python
names = ["bekzod", "Aziza", "dilnoza", "Gulnora"]

print(sorted(names, key=str.lower))   # kiçik harfli variantlarni taqqoslaymiz
```

```text
['Aziza', 'bekzod', 'dilnoza', 'Gulnora']
```

`str.lower` dan keyin **qavslar yöqligiga** eʼtibor bering. Siz funksiyani özingiz çaqirmayapsiz, balki uni `sorted` çaqirişi uçun topşiryapsiz.

Boşqa foydali kalitlar:

```python
words = ["ananas", "nok", "olxöri", "kivi"]
print(sorted(words, key=len))                 # uzunlik böyiça

temperatures = [-12, 5, -3, 8, 0]
print(sorted(temperatures, key=abs))          # noldan uzoqlik böyiça
```

```text
['nok', 'kivi', 'ananas', 'olxöri']
[0, -3, 5, 8, -12]
```

Ikki elementning **kaliti bir xil** bölsa, masalan `"ananas"` va `"olxöri"` (ikkalasi ham 6 harf), ular öz dastlabki nisbiy tartibini saqlaydi. Pythonda saralaş **barqaror (stable)**.

`key` va `reverse` ni birga işlatiş mumkin:

```python
words = ["ananas", "nok", "olxöri", "kivi"]
print(sorted(words, key=len, reverse=True))
```

```text
['ananas', 'olxöri', 'kivi', 'nok']
```

::: info Öz kalitlaringiz
Tez orada öz key funksiyalaringizni, jumladan `lambda` deb ataladigan qisqa bir qatorli funksiyalarni yozasiz (*Lambda va yuqori tartibli funksiyalar* darsiga qarang). Masalan, `key=lambda p: p["price"]` mahsulotlarni narxi böyiça saralaydi. **Bir neçta** mezon böyiça saralaş uçun kalit juftlik qaytarişi mumkin: `key=lambda p: (p["category"], p["price"])` avval toifa, keyin har bir toifa içida narx böyiça saralaydi.
:::

## min, max, sum va boşqalar

```python
prices = [12000, 4500, 30000, 8000]

print(min(prices))
print(max(prices))
print(sum(prices))
print(sum(prices) / len(prices))
```

```text
4500
30000
54500
13625.0
```

`min` va `max` ham `key` ni qabul qiladi:

```python
words = ["ananas", "nok", "olxöri", "kivi"]
print(max(words, key=len))
print(min(words, key=len))
```

```text
ananas
nok
```

Bir neçta element teng bölsa, **birinçisi** tanlanadi.

## Yana röyxat metodlari

| Metod | Nima qiladi |
|---|---|
| `lst.index(x)` | birinçi `x` ning örni (yöq bölsa `ValueError`) |
| `lst.count(x)` | `x` neçta marta uçraşi |
| `lst.reverse()` | röyxatning özini teskari aylantiradi |
| `lst.copy()` | sayoz nusxa |

Va bir neçta foydali örnatilgan funksiyalar:

| Funksiya | Nima qiladi |
|---|---|
| `len(lst)` | elementlar soni |
| `reversed(lst)` | sikl uçun elementlarni teskari tartibda beradi |
| `sorted(lst)` | yangi saralangan röyxat |
| `any(...)`, `all(...)` | ha/yöq tekşiruvlari (*Comprehension ifodalari* darsiga qarang) |

## Odatiy röyxat vazifalari

### Röyxat böşmi?

Böş röyxat yolğon (falsy) hisoblanadi:

```python
cart = []

if not cart:
    print("Savatingiz böş")
```

### Eng yaxşi N ta element

Saralang, keyin kesib oling:

```python
scores = [72, 95, 58, 88, 64, 91]

top_three = sorted(scores, reverse=True)[:3]
print(top_three)
```

```text
[95, 91, 88]
```

### Tartibni saqlagan holda takrorlarni olib taşlaş

```python
visits = ["asosiy", "haqida", "asosiy", "dökon", "haqida", "asosiy"]

unique = []
for page in visits:
    if page not in unique:
        unique.append(page)

print(unique)
```

```text
['asosiy', 'haqida', 'dökon']
```

Katta röyxatlar uçun tezroq usullar *Töplamlar* darsida körsatilgan.

### Röyxatni matnga birlaştiriş

`.join()` faqat satrlar bilan işlaydi. Keng tarqalgan usul: bölaklarni satr körinişida röyxatga yiğib, oxirida bir marta birlaştiriş:

```python
numbers = [3, 1, 4, 1, 5]

parts = []
for n in numbers:
    parts.append(str(n))
print(", ".join(parts))
```

```text
3, 1, 4, 1, 5
```

*Comprehension ifodalari* darsida buning bir qatorli varianti körsatiladi: `", ".join(str(n) for n in numbers)`.

### Parallel röyxatlarni birga saralaş

Ismlar va ballar ikki alohida röyxatda bölsa, ular birga qolişi uçun **juftliklarni** saralang:

```python
names = ["Aziza", "Bekzod", "Dilnoza"]
marks = [81, 94, 88]

for mark, name in sorted(zip(marks, names), reverse=True):
    print(f"{name}: {mark}")
```

```text
Bekzod: 94
Dilnoza: 88
Aziza: 81
```

`zip(marks, names)` `(81, "Aziza")` kabi juftliklar hosil qiladi. Juftliklar birinçi elementi, yaʼni ball böyiça saralanadi va ikkinçi elementga faqat ballar teng bölgandagina qaraladi. Bu juftliklar (*kortejlar*) haqida keyingi darsda köproq bilib olasiz.

## Özingiz sinab köring

Mahsulot nomlarini turli usullarda saralang. `key=len`, `reverse=True` yoki narx böyiça saralaşni sinab köring.

<ClientOnly><PythonPlayground :code='"products = [\"Çoy\", \"olma şarbati\", \"Non\", \"sut\", \"Yogurt\"]\nprices = [15000, 12000, 6000, 11000, 9000]\n\nprint(\"Odatiy:          \", sorted(products))\nprint(\"Harf katta-kiçik:\", sorted(products, key=str.lower))\nprint(\"Uzunlik böyiça:  \", sorted(products, key=len))\n\nprint(\"Avval eng arzoni:\")\nfor price, name in sorted(zip(prices, products)):\n    print(f\"  {name:<13}{price:>7,}\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `.sort()` natijasini saqlaş

```python
scores = [3, 1, 2]
scores = scores.sort()
print(scores)
```

```text
None
```

**Tuzatiş:** yoki alohida qatorda `scores.sort()`, yoki `scores = sorted(scores)`.

### 2. Aralaş turlarni saralaş

```py
values = [10, "5", 3]
values.sort()
```

```text
TypeError: '<' not supported between instances of 'str' and 'int'
```

Python satr va sonni qanday tartiblaşni taxmin qilmaydi. **Tuzatiş:** avval hammasini bir turga özgartiring.

### 3. Key funksiyasini çaqiriş

```py
names = ["b", "A"]
sorted(names, key=str.lower())
```

```text
TypeError: unbound method str.lower() needs an argument
```

Funksiyaning özini qavslarsiz bering: `key=str.lower`.

### 4. Böş röyxatning `min()` yoki `max()` qiymati

```py
max([])
```

```text
ValueError: max() iterable argument is empty
```

Röyxat böş emasligini tekşiring yoki standart qiymat bering: `max(values, default=0)`.

## Maşqlar

### 1. Mehmonlar alifbo böyiça <Difficulty level="1" />

`guests = ["zafar", "Aziza", "madina", "Bobur"]` ni katta-kiçik harflarga qaramasdan alifbo böyiça çiqaring, har bir ism katta harf bilan boşlansin.

::: details Yeçim
```python
guests = ["zafar", "Aziza", "madina", "Bobur"]

for guest in sorted(guests, key=str.lower):
    print(guest.capitalize())
```
:::

### 2. Statistika <Difficulty level="1" />

`temps = [31, 35, 28, 37, 33, 26, 30]` uçun eng past, eng yuqori, örtaça (1 xona aniqlikda) haroratni va eng issiqdan eng sovuqqa qarab saralangan haroratlarni çiqaring.

::: details Yeçim
```python
temps = [31, 35, 28, 37, 33, 26, 30]

print(f"Eng past: {min(temps)}")
print(f"Eng yuqori: {max(temps)}")
print(f"Örtaça: {sum(temps) / len(temps):.1f}")
print(f"Avval eng issiği: {sorted(temps, reverse=True)}")
```
:::

### 3. Mediana <Difficulty level="2" />

**Mediana** saralangan röyxatning örtadagi qiymati. Elementlar soni juft bölsa, u örtadagi ikki qiymatning örtaçasiga teng. `[7, 1, 5, 3]` (javob `4.0`) va `[9, 2, 6]` (javob `6`) medianasini hisoblang.

::: details Yeçim
```python
for values in [[7, 1, 5, 3], [9, 2, 6]]:
    ordered = sorted(values)
    middle = len(ordered) // 2

    if len(ordered) % 2 == 1:
        median = ordered[middle]
    else:
        median = (ordered[middle - 1] + ordered[middle]) / 2

    print(median)
```
:::

### 4. Söz uçraşi reytingi <Difficulty level="2" />

`text = "bu muşuk va bu it va bu quş"` uçun har bir **takrorlanmas** sözni uning neçta marta uçraşi bilan, eng köp uçraganidan boşlab çiqaring. `.count()` va takrorlanmas sözlar röyxatidan foydalaning.

::: details Yeçim
```python
text = "bu muşuk va bu it va bu quş"
words = text.split()

unique = []
for word in words:
    if word not in unique:
        unique.append(word)

for count, word in sorted(zip([words.count(w) for w in unique], unique), reverse=True):
    print(f"{word}: {count}")
```

```text
bu: 3
va: 2
quş: 1
muşuk: 1
it: 1
```

Soni bir xil sözlar sözning özi böyiça teskari tartibda saralanadi, çunki birinçi elementlar teng bölsa, juftliklar ikkinçi elementni taqqoslaydi. `[words.count(w) for w in unique]` bu röyxat comprehension ifodasi, u *Comprehension ifodalari* darsida tuşuntirilgan. *Luğatlar* darsida sanaşning samaraliroq usuli körsatilgan.
:::

### 5. Reyting jadvali <Difficulty level="3" />

Berilgan:

```python
players = ["ali", "Vali", "gani", "Sami", "Doni"]
points = [120, 95, 120, 150, 95]
```

**Ballar böyiça, eng yuqorisidan boşlab** saralangan reyting jadvalini çiqaring. Ballar teng bölsa, katta-kiçik harfga qaramasdan **ism böyiça alifbo tartibida** saralang. Örinlarni 1 dan boşlab körsating:

```text
1. Sami  150
2. ali   120
3. gani  120
4. Doni   95
5. Vali   95
```

::: details Yeçim
```python
players = ["ali", "Vali", "gani", "Sami", "Doni"]
points = [120, 95, 120, 150, 95]

pairs = sorted(zip(players, points), key=lambda pair: (-pair[1], pair[0].lower()))

for rank, (name, score) in enumerate(pairs, start=1):
    print(f"{rank}. {name:<5}{score:>4}")
```

`lambda pair: ...` bu kiçkina içki funksiya (*Lambda va yuqori tartibli funksiyalar* darsiga qarang). Kalit juftlik qaytaradi: minus ball, şunda katta ballar oldin keladi, keyin kiçik harfli ism, u tengliklarni hal qiladi. Odatda aynan şunday yoziladi. Boşqa usul barqarorlikdan foydalanadi: avval ism böyiça saralang, keyin ball böyiça `sort(key=..., reverse=True)` qiling, şunda har bir ball guruhi içida ismlar alifbo tartibida qoladi.
:::

## Xulosa

- `sorted(items)` yangi röyxat qaytaradi. `items.sort()` röyxatning özini saralaydi va `None` qaytaradi.
- `reverse=True` kamayiş tartibida saralaydi. `.reverse()` esa tartibni şunçaki teskari aylantiradi.
- `key=function` hisoblangan qiymat böyiça saralaydi: `key=str.lower`, `key=len`, `key=abs`. Funksiyani `()` siz bering. Saralaş **barqaror**, şuning uçun kalitlari teng elementlar öz tartibini saqlaydi.
- `min`, `max`, `sum` va `len` röyxatni umumlaştiradi, `min`/`max` esa `key` va `default` ni qabul qiladi.
- Eng yaxşi N ta: `sorted(items, reverse=True)[:n]`. Boğliq röyxatlarni `zip()` juftliklarini saralab birga saqlang.

## Qöşimça manbalar

- [Sorting techniques (HOWTO)](https://docs.python.org/3/howto/sorting.html)
- [Built-in functions - `sorted()`](https://docs.python.org/3/library/functions.html#sorted)
- [`list.sort()`](https://docs.python.org/3/library/stdtypes.html#list.sort)
