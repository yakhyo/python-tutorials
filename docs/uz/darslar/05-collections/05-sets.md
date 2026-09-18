---
title: Töplamlar
description: "Takrorlanmas qiymatlarni töplamlarda saqlaş: töplam yaratiş, element qöşiş va öçiriş, tez tekşiriş, takrorlarni olib taşlaş hamda birlaşma, kesişma va ayirma kabi amallar."
---

# Töplamlar

![Rasm: Töplamlar](/images/topics-webp-uzb/sets.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Töplam** nima: **takrorlanmas** qiymatlarning tartibsiz kolleksiyasi
- Töplam yaratiş, jumladan böş töplam
- Elementlarni xavfsiz qöşiş va öçiriş
- Nega `x in some_set` tekşiruvi bunçalik tez
- Töplam amallari: birlaşma `|`, kesişma `&`, ayirma `-` va simmetrik ayirma `^`
:::

## Nega bu muhim

Köp savollar **takrorlanmaslik** va **umumiylik** haqida böladi: *Bugun neçta turli taşrifçi keldi? Qaysi öquvçilar ham matematika, ham fizikaga qatnaşadi? Qaysi mahsulotlar omborda bor, lekin çegirmada emas?* Röyxatlar bilan bular uçun sikl kerak. **Töplamlar (set)** bilan esa bir qator yetarli va katta maʼlumotlarda ança tezroq.

## Töplam yaratiş

Jingalak qavslarni yoki boşqa kolleksiyani özgartiriş uçun `set()` ni işlating:

```python
scores = {90, 85, 100, 90}
print(scores)
print(len(scores))

letters = set("banan")
print(letters)
```

```text
{90, 100, 85}
3
{'a', 'n', 'b'}    # sizda tartib boşqaça bölişi mumkin
```

Ikki narsaga eʼtibor bering:

1. **Takrorlar yöqoladi.** `90` ikki marta yozilgan, lekin bir marta saqlanadi, `"banan"` da esa beşta harf bor, lekin faqat uçtasi takrorlanmas.
2. **Tartib yöq.** Sonlar saralangan holda ham, siz yozgan tartibda ham çiqmadi. Satrlarda bu yanada oldindan aytib bölmas: `letters` tartibi har işga tuşirişda özgarişi mumkin, şuning uçun sizdagi natija yuqoridagi qatorga mos kelmasligi mumkin.

::: warning Böş töplam
`{}` töplam emas, böş **luğat** yaratadi. Böş töplam uçun `set()` ni işlating:

```python
empty_set = set()
empty_dict = {}
print(type(empty_set), type(empty_dict))
```
:::

## Takrorlarni olib taşlaş

Takrorlanmas qiymatlarni olişning eng tez usuli töplamga özgartiriş:

```python
visitors = ["aziza", "bekzod", "aziza", "dilnoza", "bekzod", "aziza"]

unique_visitors = set(visitors)
print(len(visitors), "ta taşrif")
print(len(unique_visitors), "ta takrorlanmas taşrifçi")
```

```text
6 ta taşrif
3 ta takrorlanmas taşrifçi
```

Yana röyxat, ayniqsa saralangan röyxat kerak bölsa: `sorted(set(visitors))`.

Agar **asl tartibni** saqlaş kerak bölsa, `dict.fromkeys()` ni işlating, çunki luğatlar qöşiliş tartibini eslab qoladi:

```python
visitors = ["aziza", "bekzod", "aziza", "dilnoza", "bekzod", "aziza"]
print(list(dict.fromkeys(visitors)))
```

```text
['aziza', 'bekzod', 'dilnoza']
```

## Qöşiş va öçiriş

```python
tags = {"python", "boşlovçi"}

tags.add("sikllar")
tags.add("python")          # allaqaçon bor: heç narsa bölmaydi
print(tags)

tags.remove("boşlovçi")     # yöq bölsa KeyError
tags.discard("ilğor")       # yöq bölsa ham xato bermaydi
print(tags)
```

| Metod | Nima qiladi |
|---|---|
| `s.add(x)` | bitta element qöşadi (allaqaçon bölsa, heç narsa özgarmaydi) |
| `s.update(items)` | köp element qöşadi |
| `s.remove(x)` | `x` ni öçiradi, yöq bölsa `KeyError` çaqiradi |
| `s.discard(x)` | `x` bölsa öçiradi, aks holda heç narsa qilmaydi |
| `s.pop()` | ixtiyoriy elementni öçiradi va qaytaradi |
| `s.clear()` | hammasini öçiradi |

## Indeks yöq

Töplamlarda örinlar yöq, şuning uçun `s[0]` ham yöq:

```py
colors = {"qizil", "yaşil"}
print(colors[0])
```

```text
TypeError: 'set' object is not subscriptable
```

Python töplamdan indeks böyiça element olib bölmasligini aytyapti. Lekin töplam böyiça sikl yurgiziş, `len()` va `in` ni işlatiş mumkin. Elementlarni oldindan maʼlum tartibda qayta işlaş uçun `sorted(the_set)` böyiça sikl yurgizing.

## Tez tekşiriş

`x in some_set` tekşiruvi töplam qançalik katta bölmasin, **juda tez** işlaydi. Röyxatda Python elementlarni birma-bir körib çiqişi kerak. Töplamda esa *xeşlaş (hashing)* degan usul yordamida deyarli töğridan-töğri javobga ötadi.

```python
banned_words = {"spam", "firibgarlik", "soxta"}

message = "bu firibgarlik taklifi emas"
for word in message.split():
    if word in banned_words:
        print(f"Taqiqlangan söz topildi: {word}")
```

```text
Taqiqlangan söz topildi: firibgarlik
```

### Qançalik tez?

Özingiz ölçab köring. Bu kod röyxatda va töplamda (har birida 100 000 ta element) yöq ID ni 100 marta tekşiradi:

```python
import time

ids_list = list(range(100_000))
ids_set = set(ids_list)

start = time.perf_counter()
for _ in range(100):
    -1 in ids_list
list_time = time.perf_counter() - start

start = time.perf_counter()
for _ in range(100):
    -1 in ids_set
set_time = time.perf_counter() - start

print(f"röyxat: {list_time:.4f} s")
print(f"töplam: {set_time:.6f} s")
```

```text
röyxat: 0.1050 s
töplam: 0.000009 s
```

Sizdagi vaqtlar boşqaça böladi (brauzer lokal Pythondan sekinroq), lekin farq doim juda katta. Röyxat har safar `-1` ni barça 100 000 element bilan soliştirişi kerak. Töplam esa 10 ta element saqlasa ham, 10 million saqlasa ham taxminan bir xil oz miqdordagi iş qiladi.

Bu farq eng köp **sikl içida** seziladi. 10 000 ta yangi buyurtmaning har birini 10 000 ta maʼlum ID *röyxati* bilan tekşiriş 10 000 × 10 000 = 100 million taqqoslaşgaça boradi, yaʼni bu sikl içidagi sikl. *Töplam* bilan esa bu taxminan 10 000 ta tez qidiruv. Kod sekin tuyulsa, `for` sikli içidagi röyxat ustida `in` ni qidiring.

### Töplamga nimalar kiriši mumkin?

Elementlar **xeşlanadigan (hashable)**, yaʼni taxminan **özgarmas** bölişi kerak: sonlar, satrlar, mantiqiy qiymatlar va ulardan iborat kortejlar. Röyxatlar, luğatlar va boşqa töplamlar töplam elementi böla olmaydi:

```py
pairs = {[1, 2], [3, 4]}
```

```text
TypeError: cannot use 'list' as a set element (unhashable type: 'list')
```

Uning örniga kortejlarni işlating: `{(1, 2), (3, 4)}`.

## Töplam amallari

Töplamlarning haqiqiy kuçi aynan şu yerda. Ikki sinfni tasavvur qiling:

```python
math = {"Aziza", "Bekzod", "Dilnoza", "Farrux"}
physics = {"Bekzod", "Farrux", "Gulnora"}
```

Bekzod va Farrux ikkala sinfda ham bor. Aziza va Dilnoza faqat matematikaga, Gulnora esa faqat fizikaga qatnaşadi.

| Amal | Operator | Metod | Maʼnosi |
|---|---|---|---|
| Birlaşma | `a \| b` | `a.union(b)` | **istalgan** töplamda bor |
| Kesişma | `a & b` | `a.intersection(b)` | **ikkala** töplamda bor |
| Ayirma | `a - b` | `a.difference(b)` | `a` da bor, lekin `b` da **yöq** |
| Simmetrik ayirma | `a ^ b` | `a.symmetric_difference(b)` | **faqat bittasida** bor |

```python
math = {"Aziza", "Bekzod", "Dilnoza", "Farrux"}
physics = {"Bekzod", "Farrux", "Gulnora"}

print("Istalgan sinf:    ", sorted(math | physics))
print("Ikkalasida:       ", sorted(math & physics))
print("Faqat matematika: ", sorted(math - physics))
print("Faqat bittasida:  ", sorted(math ^ physics))
```

```text
Istalgan sinf:     ['Aziza', 'Bekzod', 'Dilnoza', 'Farrux', 'Gulnora']
Ikkalasida:        ['Bekzod', 'Farrux']
Faqat matematika:  ['Aziza', 'Dilnoza']
Faqat bittasida:   ['Aziza', 'Dilnoza', 'Gulnora']
```

(`sorted()` faqat natija tartibini oldindan maʼlum qiliş uçun.)

### Qism töplamlar va umumiy elementlar

```python
required = {"python", "git"}
skills = {"python", "git", "sql", "docker"}

print(required <= skills)            # qism töplam: barça talab qilingan könikmalar bor
print(required.issubset(skills))     # xuddi şu narsa
print(skills >= required)            # ustki töplam
print(required.isdisjoint({"java"})) # umumiy elementlar yöq
```

```text
True
True
True
True
```

### Töplamlarni taqqoslaş

Ikki töplam tartibidan qatʼi nazar bir xil elementlarga ega bölsa, ular teng:

```python
print({1, 2, 3} == {3, 2, 1})
```

```text
True
```

## frozenset

`frozenset` bu özgarmas töplam. Uni luğat kaliti yoki boşqa töplamning elementi sifatida işlatiş mumkin. U sizga köp kerak bölmaydi:

```python
weekend = frozenset({"Şa", "Ya"})
print("Ya" in weekend)
```

## Özingiz sinab köring

Özingizdagi masaliqlarni ikki retsept bilan soliştiring. Masaliq qöşib yoki öçirib, nima özgarişini köring.

<ClientOnly><PythonPlayground :code='"have = {\"guruç\", \"sabzi\", \"piyoz\", \"yoğ\", \"tuz\", \"tuxum\"}\nplov = {\"guruç\", \"sabzi\", \"piyoz\", \"yoğ\", \"göşt\", \"tuz\", \"zira\"}\nomelette = {\"tuxum\", \"yoğ\", \"tuz\", \"sut\"}\n\nprint(\"Palov uçun yetişmaydi:\", sorted(plov - have))\nprint(\"Omlet uçun yetişmaydi:\", sorted(omelette - have))\nprint(\"Ikkala retseptda bor:\", sorted(plov & omelette))\nprint(\"Omlet qila olamanmi:\", omelette <= have)"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Böş töplam uçun `{}`

```py
items = {}
items.add("x")
```

```text
AttributeError: 'dict' object has no attribute 'add'
```

`{}` bu böş luğat. **Tuzatiş:** `items = set()`.

### 2. `set("word")` va `{"word"}`

```python
print(len(set("salom")))   # harflar: s, a, l, o, m
print({"salom"})           # bitta element
```

```text
5
{'salom'}
```

`set()` takrorlanuvçi obyektni oladi va uning **har bir elementini** qöşadi. Satrning elementlari bu uning belgilari.

### 3. Operatorni röyxat bilan işlatiş

```py
math = {"Aziza", "Bekzod"}
print(math | ["Hasan"])
```

```text
TypeError: unsupported operand type(s) for |: 'set' and 'list'
```

Operatorlar ikkala tomonda ham töplam bölişini talab qiladi. **Tuzatiş:** `math | set(["Hasan"])`, yoki istalgan takrorlanuvçi obyektni qabul qiladigan metodni işlating: `math.union(["Hasan"])`.

### 4. Yöq elementga `remove`

```py
s = {"a"}
s.remove("b")
```

```text
KeyError: 'b'
```

**Tuzatiş:** element bölmasligi mumkin bölsa, `discard` ni işlating.

## Maşqlar

### 1. Takrorlanmas harflar <Difficulty level="1" />

`"mississippi"` da neçta **turli** harf bor? Sonini va harflarni alifbo tartibida çiqaring.

::: details Yeçim
```python
word = "mississippi"
unique = set(word)
print(len(unique), sorted(unique))
```

```text
4 ['i', 'm', 'p', 's']
```
:::

### 2. Umumiy döstlar <Difficulty level="1" />

Azizaning döstlari `{"Bobur", "Çaros", "Dilşod", "Eldor"}`, Bekzodniki esa `{"Çaros", "Eldor", "Farida"}`. Ularning umumiy döstlarini va **umumiy bölmagan** barça döstlarni çiqaring.

::: details Yeçim
```python
aziza = {"Bobur", "Çaros", "Dilşod", "Eldor"}
bekzod = {"Çaros", "Eldor", "Farida"}

print("Umumiy:", sorted(aziza & bekzod))
print("Umumiy emas:", sorted(aziza ^ bekzod))
```
:::

### 3. Bu pangrammi? <Difficulty level="2" />

**Pangram** ingliz alifbosining har bir harfini kamida bir marta işlatadigan gap. `"The quick brown fox jumps over the lazy dog"` pangram ekanini tekşiring va `"Hello world"` uçun yetişmayotgan harflarni çiqaring.

::: details Yeçim
```python
import string

alphabet = set(string.ascii_lowercase)

for sentence in ["The quick brown fox jumps over the lazy dog", "Hello world"]:
    missing = alphabet - set(sentence.lower())
    if not missing:
        print("Pangram!")
    else:
        print("Yetişmaydi:", "".join(sorted(missing)))
```

`string.ascii_lowercase` bu `"abcdefghijklmnopqrstuvwxyz"` matni. Gapdagi böşliqlar va tiniş belgilari ahamiyatsiz, çunki biz faqat alifbodan nima yetişmayotganiga qaraymiz.
:::

### 4. Yangi va yöqotilgan mijozlar <Difficulty level="2" />

Ikki oylik mijoz ID lari berilgan:

```python
august = [101, 102, 103, 104, 105, 102, 101]
september = [102, 104, 106, 107, 104]
```

Har oyda neçta takrorlanmas mijoz bölganini, sentabrda kim **yangi** ekanini, kim **qaytmaganini** va kim **ikkala** oyda ham xarid qilganini çiqaring.

::: details Yeçim
```python
august = [101, 102, 103, 104, 105, 102, 101]
september = [102, 104, 106, 107, 104]

aug = set(august)
sep = set(september)

print(f"Avgust: {len(aug)} ta mijoz, sentabr: {len(sep)} ta mijoz")
print("Yangi:", sorted(sep - aug))
print("Qaytmagan:", sorted(aug - sep))
print("Doimiy:", sorted(aug & sep))
```

```text
Avgust: 5 ta mijoz, sentabr: 4 ta mijoz
Yangi: [106, 107]
Qaytmagan: [101, 103, 105]
Doimiy: [102, 104]
```
:::

### 5. Takrorlarni topuvçi <Difficulty level="3" />

`codes = ["A12", "B07", "A12", "C33", "B07", "D90", "A12"]` berilgan. **Bir martadan köp** uçraydigan kodlarni ular **birinçi marta takrorlangan** tartibda çiqaring. Buning uçun `.count()` ni emas, töplamlarni işlating.

::: details Yeçim
```python
codes = ["A12", "B07", "A12", "C33", "B07", "D90", "A12"]

seen = set()
duplicates = []

for code in codes:
    if code in seen and code not in duplicates:
        duplicates.append(code)
    seen.add(code)

print(duplicates)
```

```text
['A12', 'B07']
```

`seen` "buni avval uçratganmanmi?" degan savolga bir zumda javob beradi. Sikl içida `.count()` işlatilsa, har bir element uçun butun röyxat qaytadan körib çiqiladi, bu katta maʼlumotlarda sekin.
:::

## Xulosa

- **Töplam** takrorlanmas, xeşlanadigan elementlarni tartibsiz va indekssiz saqlaydi: `{"a", "b"}`. Böş töplam uçun `set()` ni işlating.
- `set(items)` takrorlarni olib taşlaydi. `list(dict.fromkeys(items))` ularni olib taşlab, tartibni saqlaydi.
- `add`, `update`, `remove` (yöq bölsa xato), `discard` (xatosiz) va `clear` töplamni özgartiradi.
- `x in s` juda tez, `x in a_list` esa har bir elementni tekşiradi. Sikl içida katta röyxat ustida `in` işlatişdan saqlaning.
- Amallar: `|` birlaşma, `&` kesişma, `-` ayirma, `^` simmetrik ayirma va `<=` qism töplam.

## Qöşimça manbalar

- [Python Tutorial - Sets](https://docs.python.org/3/tutorial/datastructures.html#sets)
- [Set types - `set`, `frozenset`](https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset)
