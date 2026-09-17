---
title: Luğatlar
description: "Python luğatlarida maʼlumotni kalit böyiça saqlaş va topiş: yaratiş, öqiş, yangilaş, sikl hamda sanaş va guruhlaş kabi keng tarqalgan andozalar."
---

# Luğatlar

![Rasm: Luğatlar](/images/topics-webp-uzb/dictionaries.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Luğat yaratiş va qiymatlarni **kalit** böyiça öqiş
- Yozuvlarni xavfsiz qöşiş, özgartiriş va öçiriş
- `in` va `.get()` yordamida `KeyError` dan qoçiş
- Kalitlar, qiymatlar va kalit-qiymat juftliklari böyiça sikl yurgiziş
- Ikki kundalik andozadan foydalaniş: **sanaş** va **guruhlaş**
:::

## Nega bu muhim

Tartib muhim bölganda va elementlarni örni böyiça topganda röyxat qulay: *birinçi* yuguruvçi, *uçinçi* qöşiq. Lekin haqiqiy maʼlumotlarning odatda nomi böladi. Kontaktni "47-kontakt" deb emas, *ismi* böyiça qidirasiz. Mahsulot narxi *mahsulot* böyiça, sözning maʼnosi esa *sözning özi* böyiça topiladi.

**Luğat (dictionary)** (`dict`) maʼlumotni **kalit → qiymat** juftliklari sifatida saqlaydi. Siz kalitni berasiz, u esa qiymatni qaytaradi, luğat qançalik katta bölmasin, tez.

```python
prices = {"olma": 1.20, "non": 2.50, "sut": 0.99}
print(prices["non"])
```

```text
2.5
```

## Luğat yaratiş

Juftliklarni jingalak qavslar içiga yozing. Har bir kalit va uning qiymati orasiga ikki nuqta qöying, juftliklarni esa vergul bilan ajrating:

```python
student = {
    "name": "Aziza",
    "age": 20,
    "courses": ["Matematika", "Fizika"],
}
print(student)
```

Uzun luğatlarda har bir juftlikni alohida qatorga yozing va oxirida vergul qoldiring.

Böş luğat şunçaki `{}`. Köpinça böş luğatdan boşlab, dastur işlaşi davomida uni töldirib borasiz.

`dict()` konstruktori nomli argumentlardan yoki juftliklardan luğat yasaydi. `zip()` esa ikki röyxatdan öşa juftliklarni hosil qiladi:

```python
student = dict(name="Aziza", age=20)
print(student)

cities = ["Toşkent", "Samarqand", "Buxoro"]
people = [2956000, 551000, 280000]
print(dict(zip(cities, people)))
```

```text
{'name': 'Aziza', 'age': 20}
{'Toşkent': 2956000, 'Samarqand': 551000, 'Buxoro': 280000}
```

**Kalitlar va qiymatlar uçun qoidalar har xil:**

| | Qanday böla oladi | Misollar |
|---|---|---|
| **Kalit** | Takrorlanmas va özgarmas (hashable) tur | `"name"`, `42`, `(3, 4)` |
| **Qiymat** | Istalgan narsa | sonlar, satrlar, röyxatlar, boşqa luğatlar |

Kalitlar takrorlanmaydi. Bir xil kalitni ikki marta yozsangiz, oxirgi qiymat qoladi:

```python
colors = {"osmon": "kök", "maysa": "yaşil", "osmon": "kulrang"}
print(colors)
```

```text
{'osmon': 'kulrang', 'maysa': 'yaşil'}
```

## Qiymatlarni öqiş

### Kvadrat qavslar: `d[key]`

```python
student = {"name": "Aziza", "age": 20}
print(student["name"])
```

Agar kalit mavjud bölmasa, Python `KeyError` çaqiradi. Kalitning yöqligi haqiqatan xato bölganda bu foydali, çunki dastur aynan muammo bor joyda töxtaydi.

### Avval tekşiriş: `key in d`

`in` operatori **kalit** mavjudligini tekşiradi:

```python
student = {"name": "Aziza", "age": 20}

if "email" in student:
    print(student["email"])
else:
    print("Email kiritilmagan")
```

### Standart qiymat: `d.get(key, default)`

`.get()` kalit mavjud bölsa, uning qiymatini qaytaradi. Aks holda standart qiymatni (agar u berilmagan bölsa, `None` ni) olasiz. U heç qaçon `KeyError` çaqirmaydi:

```python
student = {"name": "Aziza", "age": 20}

print(student.get("age"))
print(student.get("email"))
print(student.get("email", "körsatilmagan"))
```

```text
20
None
körsatilmagan
```

**Qaysi birini işlatiş kerak?**
- Kalit albatta *bölişi şart* bölsa, `d[key]` ni işlating. Dastur yiqilsa, nimadir notöğri ekanini biliş mumkin.
- Kalitning yöqligi odatiy hol bölsa, masalan ixtiyoriy maydon uçun, `d.get(key, default)` ni işlating.

## Qöşiş, özgartiriş va öçiriş

Qiymat beriş kalit yangi bölsa uni qöşadi, mavjud bölsa qiymatini almaştiradi:

```python
stock = {"olma": 10}

stock["banan"] = 25   # qöşiş
stock["olma"] = 7     # özgartiriş
stock["olma"] += 3    # eski qiymat asosida yangilaş

print(stock)
```

```text
{'olma': 10, 'banan': 25}
```

Yozuvni öçirişning uçta keng tarqalgan usuli bor:

```python
stock = {"olma": 10, "banan": 25, "gilos": 40}

del stock["olma"]                 # öçiradi; kalit yöq bölsa KeyError
count = stock.pop("banan")        # öçiradi VA qiymatni qaytaradi
missing = stock.pop("kivi", 0)    # KeyError örniga standart qiymat

print(stock, count, missing)
```

```text
{'gilos': 40} 25 0
```

Ikki luğatni birlaştiriş uçun `|` ni işlating. U yangi luğat yasaydi, bir xil kalitlarda öng tomondagi qiymat ustun keladi:

```python
defaults = {"theme": "light", "font_size": 14}
user_choice = {"theme": "dark"}

config = defaults | user_choice
print(config)
```

```text
{'theme': 'dark', 'font_size': 14}
```

`defaults.update(user_choice)` xuddi şu işni qiladi, lekin `defaults` ning özini özgartiradi.

## Luğat böyiça sikl

Luğat kalitlar qanday tartibda qöşilganini eslab qoladi. Sizga nima kerakligiga qarab siklni tanlang:

```python
scores = {"Aziza": 92, "Bekzod": 78, "Dilnoza": 85}

for name in scores:                 # kalitlar (scores.keys() bilan bir xil)
    print(name)

for score in scores.values():       # faqat qiymatlar
    print(score)

for name, score in scores.items():  # ikkalasi, ajratilgan holda
    print(f"{name}: {score}")
```

`.items()` `(kalit, qiymat)` juftliklarini beradi, `for name, score in ...` esa har bir juftlikni ikkita özgaruvçiga ajratadi. Eng köp işlatadiganingiz aynan şu sikl.

Kalitlarni saralangan tartibda aylanib çiqiş yoki qiymat böyiça saralaş uçun:

```python
scores = {"Aziza": 92, "Bekzod": 78, "Dilnoza": 85}

for name in sorted(scores):
    print(name, scores[name])

best = max(scores, key=scores.get)
print("Eng yaxşi öquvçi:", best)
```

`max(scores, key=scores.get)` har bir kalitni köradi, lekin ularni qiymatlari böyiça taqqoslaydi.

### Körinişlar: jonli, lekin röyxat emas

`.keys()`, `.values()` va `.items()` röyxat qaytarmaydi. Ular **köriniş (view)** qaytaradi: luğatga qaraydigan va u özgarganda yangilanadigan darçalar. Körinişni indekslab bölmaydi, şuning uçun örin yoki oniy nusxa kerak bölganda uni `list()` ga örang:

```python
scores = {"Aziza": 92, "Bekzod": 78}
names = scores.keys()

scores["Dilnoza"] = 85
print(names)              # köriniş yangi kalitni kördi
print(list(names)[0])     # names[0] TypeError bergan bölardi
```

```text
dict_keys(['Aziza', 'Bekzod', 'Dilnoza'])
Aziza
```

`list(scores)` kalitlarni töğridan-töğri röyxat körinişida beradi.

## Özingiz sinab köring

Luğatni özgartiring, öquvçi qöşing yoki faqat imtihondan ötgan öquvçilarni (ball ≥ 80) çiqaring.

<ClientOnly><PythonPlayground :code='"scores = {\"Aziza\": 92, \"Bekzod\": 78, \"Dilnoza\": 85}\n\nscores[\"Farrux\"] = 64\n\nfor name, score in scores.items():\n    status = \"ötdi\" if score >= 80 else \"qayta topşiriş\"\n    print(f\"{name:<8} {score:>3}  {status}\")"' /></ClientOnly>

## 1-andoza: sanaş

"Har bir element neçta marta uçraydi?" degan savol doim uçrab turadi. Böş luğatdan boşlang va har bir element uçun 1 qöşing:

```python
text = "bu olma va bu nok va bu anor"

counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1

print(counts)
```

```text
{'bu': 3, 'olma': 1, 'va': 2, 'nok': 1, 'anor': 1}
```

Asosiy nayrang `counts.get(word, 0)` da. Söz birinçi marta uçraganda hali yozuv yöq, şuning uçun `.get` `0` qaytaradi va biz `1` ni saqlaymiz.

::: info Keyinroq
Standart kutubxonada `collections.Counter` bor, u buni bir qatorda bajaradi (*collections va itertools* darsiga qarang). Avval siklni özingiz yozing, şunda `Counter` siz uçun nima qilişini bilasiz.
:::

## 2-andoza: guruhlaş

Qiymat röyxat bölişi mumkin, şuning uçun luğat bitta kalit ostida bir neçta elementni yiğa oladi:

```python
words = ["olma", "olxöri", "banan", "behi", "gilos"]

by_letter = {}
for word in words:
    first = word[0]
    if first not in by_letter:
        by_letter[first] = []
    by_letter[first].append(word)

print(by_letter)
```

```text
{'o': ['olma', 'olxöri'], 'b': ['banan', 'behi'], 'g': ['gilos']}
```

`if ... not in` tekşiruvi har bir harf birinçi marta uçraganda böş röyxat yaratadi. `by_letter.setdefault(first, []).append(word)` xuddi şu işni bir qatorda qiladi (lekin 4-xatoga qarang).

## Luğatmi yoki röyxatmi?

| Savol | Nimani işlatiş kerak |
|---|---|
| Elementlarni **örni** böyiça topamanmi yoki ularni **ketma-ket** saqlaymanmi? | röyxat |
| Elementlarni **nomi yoki ID si** böyiça topamanmi? | luğat |
| Köp elementlar orasida "X bormi?" degan savolni tez tekşiriş kerakmi? | luğat (yoki töplam) |
| Har bir elementda **nomlangan maydonlar** (ism, yoş, email) bormi? | luğat |

Köpinça ikkalasini birga işlatasiz, masalan luğatlar röyxati (öquvçilar röyxati). Bu haqda *Içma-iç maʼlumotlar* darsida gapiriladi.

## Köp uçraydigan xatolar

### 1. Mavjud bölmagan kalitni öqiş

```py
user = {"name": "Aziza"}
print(user["email"])
```

```text
KeyError: 'email'
```

**Tuzatiş:** avval `"email" in user` bilan tekşiring yoki `user.get("email", default)` ni işlating.

### 2. `in` qiymatlar orasidan qidiradi deb öylaş

```python
capitals = {"Özbekiston": "Toşkent", "Yaponiya": "Tokio"}
print("Tokio" in capitals)            # KALITLARNI tekşiradi
print("Tokio" in capitals.values())
```

```text
False
True
```

### 3. Luğat böyiça sikl yurgizayotganda uning ölçamini özgartiriş

```py
stock = {"olma": 0, "banan": 5, "gilos": 0}
for item in stock:
    if stock[item] == 0:
        del stock[item]
```

```text
RuntimeError: dictionary changed size during iteration
```

Python sikl davomida luğat ölçami özgarganini aytyapti. **Tuzatiş:** kalitlarning oniy nusxasi, `list(stock)`, böyiça sikl yurgizing, şunda öçiriş siklga xalaqit bermaydi:

```python
stock = {"olma": 0, "banan": 5, "gilos": 0}
for item in list(stock):
    if stock[item] == 0:
        del stock[item]
print(stock)
```

```text
{'banan': 5}
```

*Comprehension ifodalari* darsida yana bir tuzatiş körsatiladi: faqat qoladigan elementlardan yangi luğat tuziş.

### 4. `.setdefault()` örniga `.get()` bilan guruhlaş

```python
words = ["olma", "anor", "banan"]
by_letter = {}
for word in words:
    by_letter.get(word[0], []).append(word)
print(by_letter)
```

```text
{}
```

Xato yöq, maʼlumot ham yöq. `.get()` luğatda saqlanmaydigan **yangi** böş röyxat qaytaradi, şuning uçun har bir `append` taşlab yuboriladigan röyxatga tuşadi. **Tuzatiş:** `by_letter.setdefault(word[0], []).append(word)` - u avval böş röyxatni saqlaydi, keyin aynan öşa saqlangan röyxatni qaytaradi.

## Maşqlar

### 1. Telefon kitobçasi <Difficulty level="1" />

Uçta ism va telefon raqamidan iborat luğat yarating. Bir kişining raqamini çiqaring, keyin törtinçi kişini qöşing va butun telefon kitobçasini çiqaring.

::: details Yeçim
```python
phone_book = {
    "Aziza": "+998 90 123 45 67",
    "Bekzod": "+998 91 765 43 21",
    "Dilnoza": "+998 93 111 22 33",
}
print(phone_book["Bekzod"])

phone_book["Farrux"] = "+998 94 555 66 77"
print(phone_book)
```
:::

### 2. Xavfsiz qidiriş <Difficulty level="1" />

`menu` luğati va `item` nomi berilgan. Taomning narxini, agar u mavjud bölmasa, `menyuda yöq` matnini çiqaring. `if` ni **işlatmang**. `"çoy"` va `"pitsa"` bilan sinab köring.

```py
menu = {"çoy": 1.5, "qahva": 2.0, "somsa": 1.0}
item = "pitsa"
```

::: details Yeçim
```python
menu = {"çoy": 1.5, "qahva": 2.0, "somsa": 1.0}
item = "pitsa"

print(menu.get(item, "menyuda yöq"))
```
:::

### 3. Harflarni sanaş <Difficulty level="2" />

`text = "Salom Dunyo"` dagi har bir harfni sanaydigan luğat tuzing. Böşliqlarni hisobga olmang, katta va kiçik harflarni bir xil deb hisoblang.

::: details Yeçim
```python
text = "Salom Dunyo"

counts = {}
for char in text.lower():
    if char == " ":
        continue
    counts[char] = counts.get(char, 0) + 1

print(counts)
```

```text
{'s': 1, 'a': 1, 'l': 1, 'o': 2, 'm': 1, 'd': 1, 'u': 1, 'n': 1, 'y': 1}
```
:::

### 4. Baholar hisoboti <Difficulty level="2" />

`scores` berilgan. Har bir öquvçini bali bilan birga **alifbo tartibida** çiqaring. Keyin sinfning örtaça balini (1 xona aniqlikda yumaloqlab) va eng past ball olgan öquvçining ismini çiqaring.

```py
scores = {"Dilnoza": 85, "Aziza": 92, "Bekzod": 78, "Farrux": 64}
```

::: details Yeçim
```python
scores = {"Dilnoza": 85, "Aziza": 92, "Bekzod": 78, "Farrux": 64}

for name in sorted(scores):
    print(f"{name}: {scores[name]}")

average = sum(scores.values()) / len(scores)
lowest = min(scores, key=scores.get)

print(f"Örtaça: {average:.1f}")
print(f"Eng past: {lowest}")
```
:::

### 5. Luğatni ağdariş <Difficulty level="3" />

`d = {"a": 1, "b": 2, "c": 1}` ning kalitlari va qiymatlarini almaştiring. Bir neçta kalit bir xil qiymatga ega bölişi mumkin, şuning uçun natijadagi har bir qiymat asl kalitlarning **röyxatiga** mos kelsin: `{1: ['a', 'c'], 2: ['b']}`.

::: details Yeçim
```python
d = {"a": 1, "b": 2, "c": 1}

inverted = {}
for key, value in d.items():
    if value not in inverted:
        inverted[value] = []
    inverted[value].append(key)

print(inverted)
```

```text
{1: ['a', 'c'], 2: ['b']}
```

Bu yana **guruhlaş** andozasi: bu safar kalitlarni qiymatlari böyiça guruhlayapmiz.
:::

## Xulosa

- Luğat takrorlanmas, özgarmas **kalitlarni** istalgan turdagi **qiymatlarga** böğlaydi: `{"key": value}`.
- `d[key]` qiymatni öqiydi va kalit yöq bölsa `KeyError` çaqiradi. `d.get(key, default)` heç qaçon xato çaqirmaydi.
- `key in d` qiymatlarni emas, **kalitlarni** tekşiradi.
- Qiymat beriş qöşadi yoki yangilaydi. `del` va `.pop()` öçiradi. `|` yangi luğatga birlaştiradi.
- Kalit va qiymatni birga oliş uçun `.items()` bilan sikl yurgizing. Körinişlar jonli, şuning uçun kalit qöşiş yoki öçirişda `list(d)` böyiça sikl yurgizing.

## Qöşimça manbalar

- [Python Tutorial - Dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)
- [Library reference - Mapping types (`dict`)](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict)
- [Glossary - hashable](https://docs.python.org/3/glossary.html#term-hashable)
