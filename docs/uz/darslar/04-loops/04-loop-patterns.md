---
title: Sikllarda köp işlatiladigan usullar
description: "Dasturçilar har kuni işlatadigan sikl andozalari: sanaş, qöşiş, eng katta qiymatni topiş, qidiriş, satr yasaş, jamlanma yiğindi, enumerate() va zip()."
---

# Sikllarda köp işlatiladigan usullar

![Rasm: Sikllarda köp işlatiladigan usullar](/images/topics-webp-uzb/loop-patterns.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Sanovçi** va **jamlovçi** andozalari: sanaş, qöşiş va örtaçani topiş
- **Hozirgaça eng yaxşisi** andozasi: eng katta yoki eng kiçik elementni topiş
- **Qidiriş** andozasi: mos keladigani bormi va u qayerda?
- Satrlarni va **jamlanma yiğindini** qadamma-qadam **yasaş**
- `enumerate()` bilan pozitsiyalar böyiça va `zip()` bilan ikki ketma-ketlik böyiça birdaniga aylaniş
:::

## Nega bu muhim

Bir neçta sikl yozganingizdan keyin bir xil şakllar qayta-qayta uçrayotganini payqaysiz. Tajribali dasturçilar har bir siklni noldan öylab topmaydi. Ular masalaga kerak bölgan **andozani** taniydi va tafsilotlarni töldiradi. Şu andozalarni örgansangiz, aksariyat sikl masalalari tez yeçiladigan böladi.

Köpçilik misollar *for sikli va range()* darsidagidek kvadrat qavslar içida yozilgan test ballari röyxati böyiça aylanadi. Röyxatlar qila oladigan qolgan hamma narsa *Röyxatlar* darsida keladi.

```python
scores = [72, 95, 58, 88, 64, 91]
```

## 1. Sanovçi: neçta?

`0` dan boşlang va element mos kelganda `1` qöşing:

```python
scores = [72, 95, 58, 88, 64, 91]

passed = 0
for score in scores:
    if score >= 60:
        passed += 1

print(f"{len(scores)} tadan {passed} tasi ötdi")
```

```text
6 tadan 5 tasi ötdi
```

## 2. Jamlovçi: yiğindi, köpaytma, örtaça

Neytral qiymatdan boşlang va har bir elementni unga qöşib boring:

```python
scores = [72, 95, 58, 88, 64, 91]

total = 0
for score in scores:
    total += score

average = total / len(scores)
print(f"Jami: {total}, örtaça: {average:.1f}")
```

```text
Jami: 468, örtaça: 78.0
```

| Maqsad | Boşlanğiç qiymat | Yangilaş |
|---|---|---|
| Yiğindi | `0` | `total += x` |
| Köpaytma | `1` | `product *= x` |
| Satr yasaş | `""` | `text += x` |
| Sanaş | `0` | `count += 1` |

Oddiy yiğindilar uçun Pythonda içki funksiya bor: `sum(scores)`. Siklni bilib qöyiş baribir foydali, çunki andoza birlaştiriş mumkin bölgan har qanday narsa uçun işlaydi.

## 3. Hozirgaça eng yaxşisi: maksimum va minimum

Hozirgaça körilgan eng yaxşi elementni eslab qoling va yaxşiroğini topganda almaştiring:

```python
scores = [72, 95, 58, 88, 64, 91]

highest = scores[0]          # birinçi elementdan boşlaymiz
for score in scores:
    if score > highest:
        highest = score

print(f"Eng yuqori: {highest}")
```

```text
Eng yuqori: 95
```

`scores[0]` - birinçi element, xuddi `text[0]` satrning birinçi belgisi bölgani kabi. `0` dan emas, **birinçi elementdan** boşlang: hamma qiymatlar manfiy bölsa, `0` dan boşlaş notöğri javob beradi.

Içki `max(scores)` va `min(scores)` funksiyalari buni siz uçun bajaradi. Sikl varianti **qiymatdan köproq narsa** kerak bölganda, masalan eng yaxşi talabaning ismi kerak bölganda zarur. Buni quyida `zip()` bilan yozasiz.

## 4. Qidiriş: bormi?

Mos keladigani topilgunça aylaning, keyin `break` bilan töxtang:

```python
scores = [72, 95, 58, 88, 64, 91]

first_fail = None
for score in scores:
    if score < 60:
        first_fail = score
        break

if first_fail is None:
    print("Hiç kim yiqilmadi")
else:
    print(f"Birinçi yiqilgan ball: {first_fail}")
```

```text
Birinçi yiqilgan ball: 58
```

`None` - Pythonning maxsus "qiymat yöq" belgisi. Hali hiç narsa topilmagan paytda u yaxşi boşlanğiç qiymat. Uni *Mantiqiy qiymatlar va taqqoslaş* darsida körganingizdek `is None` bilan tekşiring.

Faqat ha yoki yöq kerak bölsa, bayroq ham işlaydi: `found = False` dan boşlang va `break` dan oldin uni `True` ga özgartiring.

## 5. Satr yasaş

`""` dan boşlang va har bir takrorlanişda bölak qöşing. Belgini faqat tekşiruvdan ötganda qöşiş matnni **filtrlaydi**:

```python
phone = "+998 (90) 123-45-67"

digits = ""
for char in phone:
    if char.isdecimal():
        digits += char

print(digits)
```

```text
998901234567
```

Ayni andoza yöl-yölakay belgilarni özgartirişi ham mumkin:

```python
word = "banana"

result = ""
for letter in word:
    if letter == "a":
        result += "*"
    else:
        result += letter

print(result)
```

```text
b*n*n*
```

## 6. Jamlanma yiğindi

Jamlovçini saqlang **va** uni har qadamda körsating:

```python
daily_sales = [120, 80, 150, 60]

running = 0
for day_sales in daily_sales:
    running += day_sales
    print(f"+{day_sales:>4}  → {running:>4}")
```

```text
+ 120  →  120
+  80  →  200
+ 150  →  350
+  60  →  410
```

## `enumerate()` bilan pozitsiyalar

Köpinça ham **element**, ham uning **pozitsiyasi** kerak böladi. Sanovçini özingiz boşqariş örniga `enumerate()` dan foydalaning:

```python
tasks = ["hisobot yoziş", "mijozga qöngiroq", "kodni tekşiriş"]

for number, task in enumerate(tasks, start=1):
    print(f"{number}. {task}")
```

```text
1. hisobot yoziş
2. mijozga qöngiroq
3. kodni tekşiriş
```

`enumerate()` `(pozitsiya, element)` juftliklarini beradi, `number, task` esa har bir juftlikni ikki özgaruvçiga oçadi. `start=1` bölmasa sanaş `0` dan boşlanadi.

Elementning özi kerak bölganda `for i in range(len(tasks)):` örniga `enumerate()` ni afzal köring.

### Qidiriş: qayerda?

`enumerate()` ni qidiriş andozasi bilan birlaştiring va "topilmadi" uçun *break, continue va else* darsidagi sikl `else` idan foydalaning:

```python
scores = [72, 95, 58, 88, 64, 91]

for position, score in enumerate(scores):
    if score < 60:
        print(f"Birinçi yiqilgan ball {score} {position}-pozitsiyada")
        break
else:
    print("Hiç kim yiqilmadi")
```

```text
Birinçi yiqilgan ball 58 2-pozitsiyada
```

Pozitsiyalar `0` dan boşlanadi, şuning uçun `58` `2`-pozitsiyada: uçinçi element.

## `zip()` bilan ikki ketma-ketlik birdaniga

`zip()` bir neça ketma-ketlik böylab **yonma-yon** yuradi:

```python
names = ["Aziza", "Bekzod", "Dilnoza"]
marks = [81, 94, 88]

for name, mark in zip(names, marks):
    print(f"{name:<8} {mark}")
```

```text
Aziza    81
Bekzod   94
Dilnoza  88
```

`zip()` bilan "hozirgaça eng yaxşisi" andozasi ball bilan birga ismni ham eslab qola oladi:

```python
names = ["Aziza", "Bekzod", "Dilnoza"]
marks = [81, 94, 88]

best_name = names[0]
best_mark = marks[0]
for name, mark in zip(names, marks):
    if mark > best_mark:
        best_name = name
        best_mark = mark

print(f"Eng yaxşi talaba: {best_name} ({best_mark})")
```

```text
Eng yaxşi talaba: Bekzod (94)
```

## `reversed()` bilan teskari aylaniş

```python
for n in reversed(range(1, 4)):
    print(n)
print("Ketdik!")
```

```text
3
2
1
Ketdik!
```

## Andozani tanlaş

| Savol… | Andoza |
|---|---|
| "Neçta…?" | Sanovçi |
| "Jami / örtaça qança…?" | Jamlovçi |
| "Qaysi biri eng katta / eng arzon / eng uzun…?" | Hozirgaça eng yaxşisi |
| "Birortasi bormi… / birinçisini toping…" | `break` li qidiriş |
| "Birinçisi qayerda…?" | `enumerate()` li qidiriş |
| "Faqat baʼzi belgilarni saqlang" / "Har bir harfni özgartiring" | Satr yasaş |
| "Har qadamda jarayonni körsating" | Jamlanma yiğindi |

## Özingiz sinab köring

Bir haftalik haroratni tahlil qiling: issiq kunlarni sanang, eng sovuq kunning nomini toping va örtaçani hisoblang.

<ClientOnly><PythonPlayground :code='"days = [\"Du\", \"Se\", \"Ço\", \"Pa\", \"Ju\", \"Şa\", \"Ya\"]\ntemps = [31, 35, 28, 37, 33, 26, 30]\n\nhot_days = 0\ncoldest_day, coldest = days[0], temps[0]\ntotal = 0\n\nfor day, temp in zip(days, temps):\n    total += temp\n    if temp >= 33:\n        hot_days += 1\n    if temp < coldest:\n        coldest_day, coldest = day, temp\n\nprint(f\"Issiq kunlar: {hot_days}\")\nprint(f\"Eng sovuq: {coldest_day} ({coldest}°C)\")\nprint(f\"Örtaça: {total / len(temps):.1f}°C\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Maksimum/minimumni 0 dan boşlaş

```python
values = [-5, -2, -9]

highest = 0
for value in values:
    if value > highest:
        highest = value

print(f"Eng yuqori: {highest}")
```

```text
Eng yuqori: 0
```

`0` röyxatda umuman yöq. **Tuzatiş:** birinçi elementdan boşlang: `highest = values[0]`.

### 2. Böş ketma-ketlikning örtaçasini hisoblaş

```py
values = []
print(sum(values) / len(values))
```

```text
ZeroDivisionError: division by zero
```

Avval maʼlumot borligini tekşiring: `if values:`. "Hozirgaça eng yaxşisi" andozasida ham şunday: böş röyxatda `values[0]` `IndexError: list index out of range` beradi.

### 3. Qidirişda `break` ni unutiş

```python
scores = [72, 95, 58, 88, 54, 91]

first_fail = None
for score in scores:
    if score < 60:
        first_fail = score      # break yöq

print(f"Birinçi yiqilgan ball: {first_fail}")
```

```text
Birinçi yiqilgan ball: 54
```

`break` bölmasa sikl davom etaveradi va keyingi mosliklar oldingilarini qayta yozadi, şunda "**birinçisini** top" "**oxirgisini** top" ga aylanadi. **Tuzatiş:** qiymat berişdan keyin `break` qöşing.

### 4. Uzunligi har xil ketma-ketliklarga `zip()` işlatiş

```python
names = ["Aziza", "Bekzod", "Dilnoza"]
marks = [81, 94]                # bitta ball yetişmaydi

for name, mark in zip(names, marks):
    print(f"{name:<8} {mark}")
```

```text
Aziza    81
Bekzod   94
```

Xato yöq: `zip()` eng qisqa ketma-ketlikda jimgina töxtaydi va Dilnoza yöqoladi. Uzunliklar mos kelişi kerak bölsa, sikldan oldin `len(names)` va `len(marks)` ni soliştiring.

## Maşqlar

### 1. Uzun sözlarni sanang <Difficulty level="1" />

`"Python takroriy işlarni sodda va qiziqarli qiladi"` gapida neçta söz 4 harfdan uzun ekanini sanang.

::: details Yeçim
```python
sentence = "Python takroriy işlarni sodda va qiziqarli qiladi"

count = 0
for word in sentence.split():
    if len(word) > 4:
        count += 1

print(count)
```

```text
6
```
:::

### 2. Eng uzun söz <Difficulty level="1" />

Ayni gapdagi eng uzun sözni "hozirgaça eng yaxşisi" andozasi bilan toping.

::: details Yeçim
```python
sentence = "Python takroriy işlarni sodda va qiziqarli qiladi"
words = sentence.split()

longest = words[0]
for word in words:
    if len(word) > len(longest):
        longest = word

print(longest)
```

```text
qiziqarli
```
:::

### 3. Raqamlangan xarid röyxati <Difficulty level="2" />

`items = ["non", "sut", "tuxum"]` va `prices = [6000, 12000, 18000]` berilgan. Narxlari bilan raqamlangan röyxatni, keyin jamini çop eting. `zip()`, sanovçi va jamlovçidan foydalaning:

```text
1. non      6,000
2. sut     12,000
3. tuxum   18,000
Jami: 36,000
```

::: details Yeçim
```python
items = ["non", "sut", "tuxum"]
prices = [6000, 12000, 18000]

number = 0
total = 0
for item, price in zip(items, prices):
    number += 1
    total += price
    print(f"{number}. {item:<6} {price:>7,}")

print(f"Jami: {total:,}")
```
:::

### 4. Har ikkinçi harfni katta qiling <Difficulty level="2" />

`"python sikllari"` ni `"PyThOn sIkLlArI"` ga aylantiring: juft pozitsiyadagi belgilarni katta, qolganlarini kiçik harf qiling (böşliqlarni ham pozitsiya deb hisoblang).

::: details Yeçim
```python
text = "python sikllari"

result = ""
for i, char in enumerate(text):
    if i % 2 == 0:
        result += char.upper()
    else:
        result += char.lower()

print(result)
```
:::

### 5. Aksiya tahlili <Difficulty level="3" />

Kunlik yopiliş narxlari `prices = [100, 104, 101, 110, 108, 115, 112]` berilgan. Quyidagilarni çop eting:

1. bir kunlik eng katta **ösiş** va u qaysi kuni bölgani (kun raqamlari 1 dan boşlanadi),
2. narx oldingi kunga nisbatan neça kun **tuşgani**,
3. narx biror paytda **birinçi kun narxidan pastga** tuşgan-tuşmagani.

::: details Yeçim
```python
prices = [100, 104, 101, 110, 108, 115, 112]

biggest_rise = 0
rise_day = None
down_days = 0

for day in range(1, len(prices)):
    change = prices[day] - prices[day - 1]
    if change > biggest_rise:
        biggest_rise = change
        rise_day = day + 1        # odamlar uçun kun raqamlari 1 dan boşlanadi
    if change < 0:
        down_days += 1

dropped_below_start = False
for price in prices:
    if price < prices[0]:
        dropped_below_start = True
        break

print(f"Eng katta ösiş: +{biggest_rise}, {rise_day}-kuni")
print(f"Tuşgan kunlar: {down_days}")
print(f"Boşlanğiçdan pastga tuşdi: {dropped_below_start}")
```

```text
Eng katta ösiş: +9, 4-kuni
Tuşgan kunlar: 3
Boşlanğiçdan pastga tuşdi: False
```

Bu yerda `range(1, len(prices))` tögri vosita, çunki har bir qadam elementni **oldingisi** bilan soliştiradi. Ikkinçi sikl - bayroqli qidiriş.
:::

## Xulosa

- **Sanovçi:** `0` dan boşlang, moslikda `1` qöşing. **Jamlovçi:** neytral qiymatdan (`0`, `1`, `""`) boşlang va birlaştiring.
- **Hozirgaça eng yaxşisi:** birinçi elementdan boşlang va yaxşiroğini topganda almaştiring. Oddiy holatlarni `max()`/`min()` qamrab oladi.
- **Qidiriş:** aylaning va birinçi moslikda `break` qiling. "Hali topilmadi" uçun `None` yoki bayroq, yoki sikl `else` idan foydalaning.
- **Satrlarni** `+=` bilan yasang, faqat kerakli belgilarni qöşib. **Jamlanma yiğindi** jamlovçini har qadamda çop etadi.
- `enumerate()` pozitsiyalarni beradi, `zip()` ketma-ketliklarni juftlaydi (va eng qisqasida töxtaydi), `reversed()` esa teskari yuradi.

## Qöşimça manbalar

- [Built-in functions: `enumerate()`, `zip()`, `reversed()`, `sum()`, `max()`](https://docs.python.org/3/library/functions.html)
- [Python Tutorial - Looping techniques](https://docs.python.org/3/tutorial/datastructures.html#looping-techniques)
