---
title: for sikli va range()
description: "for yordamida satrlar, röyxatlar va sonlar oralişi böyiça aylaniş: start, stop va step bilan range(), natijani yiğiş, içma-iç sikllar hamda for va while orasida tanlaş."
---

# for sikli va range()

![Rasm: for sikli va range()](/images/topics-webp-uzb/for-loops-and-range.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `for` sikli ketma-ketlikning har bir elementini qanday aylanib çiqadi
- Satr belgilari va röyxat elementlari böyiça aylaniş
- `range(stop)`, `range(start, stop)` va `range(start, stop, step)` bilan sonlar hosil qiliş
- Sikl içida natijani bosqiçma-bosqiç yiğiş
- Içma-iç sikllar qanday işlaydi va qaçon `while` örniga `for` ni tanlaş kerak
:::

## Nega bu muhim

Dasturlardagi takrorlaşlarning aksariyati "**har bir** narsa uçun nimadir qil" körinişida böladi: har bir talaba uçun bahoni hisoblaş, fayldagi har bir qatorni xatoga tekşiriş, oyning har bir kuni uçun savdoni qöşiş. `for` sikli aynan şu uçun yaratilgan. Pythonda eng köp işlatadigan siklingiz şu böladi.

## Ketma-ketlik böyiça aylaniş

```python
for letter in "Python":
    print(letter)
```

```text
P
y
t
h
o
n
```

Tuzilişi:

```text
for özgaruvçi in ketma-ketlik:
    tana
```

Har bir takrorlanişda Python ketma-ketlikdan **navbatdagi elementni** oladi, uni sikl özgaruvçisiga (`letter`) joylaydi va tanani bajaradi. Elementlar tugagaç, sikl ham tugaydi. Yangilaş kerak bölgan hisoblagiç ham, notöğri yozib qöyiş mumkin bölgan şart ham yöq.

U röyxat (list) bilan ham xuddi şunday işlaydi, masalan `.split()` qaytaradigan röyxatlar bilan:

```python
fruits = ["olma", "banan", "gilos"]

for fruit in fruits:
    print(f"Meva: {fruit}")
```

```text
Meva: olma
Meva: banan
Meva: gilos
```

(Röyxatlarga alohida dars - *Röyxatlar* - ajratilgan. Hozirça röyxat - kvadrat qavslar içidagi qiymatlar ketma-ketligi.)

Sikl özgaruvçisiga **bitta elementni** tasvirlaydigan nom tanlang: `for fruit in fruits`, `for word in words`, `for student in students`.

## `range()`: sonlar böyiça aylaniş

Nimanidir maʼlum marta takrorlaş yoki sonlar böyiça aylaniş uçun `range()` dan foydalaning.

### `range(stop)`

`range(5)` `0, 1, 2, 3, 4` ni beradi: 0 dan boşlanib, 5 dan **oldin töxtaydigan** beşta son.

```python
for i in range(5):
    print(i)
```

```text
0
1
2
3
4
```

Agar şunçaki nimanidir takrorlaş kerak bölsa, sikl özgaruvçisini eʼtiborsiz qoldiriş mumkin. Kelişuvga köra, bu holda u `_` deb nomlanadi:

```python
for _ in range(3):
    print("Hip-hip, ura!")
```

### `range(start, stop)`

```python
for day in range(1, 8):
    print(f"{day}-kun")
```

Bu `1-kun` dan `7-kun` gaça çop etadi. Kesişdagi kabi, **start kiradi, stop esa kirmaydi**.

### `range(start, stop, step)`

```python
for n in range(0, 21, 5):
    print(n, end=" ")
print()

for n in range(10, 0, -2):
    print(n, end=" ")
print()
```

```text
0 5 10 15 20 
10 8 6 4 2 
```

Manfiy qadam teskari sanaydi. Stop baribir kirmaydi, şuning uçun `range(10, 0, -2)` heç qaçon `0` ga yetmaydi.

| Çaqiriş | Sonlar |
|---|---|
| `range(4)` | `0 1 2 3` |
| `range(2, 6)` | `2 3 4 5` |
| `range(1, 10, 3)` | `1 4 7` |
| `range(5, 0, -1)` | `5 4 3 2 1` |
| `range(3, 3)` | *(heç narsa)* |

::: info range lazy (qiymatlarni kerak bölganda hosil qiladi)
`range(1_000_000)` xotirada million son yaratmaydi. U har bir sonni sikl söraganda hosil qiladi. Sonlarni *köriş* uçun uni özgartiring: `list(range(5))` `[0, 1, 2, 3, 4]` ni beradi.
:::

## Siklda natija yiğiş

Juda keng tarqalgan andoza - sikldan **oldin** özgaruvçi yaratiş va uni sikl **içida** yangilaş:

```python
total = 0

for n in range(1, 101):
    total += n

print(f"1 + 2 + ... + 100 = {total}")
```

```text
1 + 2 + ... + 100 = 5050
```

Xuddi şu ğoya sanaş va satr yasaş uçun ham işlaydi:

```python
sentence = "tez qöngir tulki dangasa it ustidan sakradi"
vowel_count = 0
consonants = ""

for char in sentence:
    if char in "aeiouö":
        vowel_count += 1
    elif char != " ":
        consonants += char

print(f"Unlilar: {vowel_count}")
print(f"Faqat undoşlar: {consonants}")
```

```text
Unlilar: 15
Faqat undoşlar: tzqngrtlkdngststdnskrd
```

Bunday andozalarni *Sikllarda köp işlatiladigan usullar* darsida köproq körasiz.

## Sikl içidami yoki taşqarisidami?

Qator **har bir takrorlanişda** yoki **bir marta** bajarilişini çekiniş belgilaydi:

```python
for n in range(1, 4):
    print(f"{n} qayta işlanmoqda")   # içida: 3 marta bajariladi
print("Hammasi tayyor")              # taşqarida: sikldan keyin bir marta bajariladi
```

```text
1 qayta işlanmoqda
2 qayta işlanmoqda
3 qayta işlanmoqda
Hammasi tayyor
```

## Içma-iç sikllar

Sikl içidagi sikl taşqi siklning har bir takrorlanişida **butun içki siklni** bajaradi:

```python
for row in range(1, 4):
    for col in range(1, 4):
        print(f"{row * col:3}", end="")
    print()   # har bir qatordan keyin yangi qator
```

```text
  1  2  3
  2  4  6
  3  6  9
```

Taşqi sikl 3 marta aylanadi va har safar içki sikl 3 marta aylanadi, demak içki siklning tanasi 3 × 3 = 9 marta bajariladi.

Içma-iç sikllar bilan şakllar ham çiziladi. Taşqi sikl qatorni tanlaydi, içki sikl esa şu qatorga şunça yulduzça çop etadi:

```python
height = 4
for row in range(1, height + 1):
    for star in range(row):
        print("*", end="")
    print()
```

```text
*
**
***
****
```

`end=""` yulduzçalarni bitta qatorda saqlaydi, böş `print()` esa qatorni tugatadi. Bir xil belgilardan iborat qator uçun `print("*" * row)` içki siklning işini bitta ifodada bajaradi.

## `for` mi yoki `while` mi?

| `for` ni tanlang, agar… | `while` ni tanlang, agar… |
|---|---|
| ketma-ketlik elementlari böyiça aylansangiz | neça marta takrorlaş kerakligini bilmasangiz |
| neça marta takrorlaşni bilsangiz | nimadir sodir bölgunça takrorlasangiz (yaroqli kiritiş, maqsadga erişiş) |
| misollar: har bir belgi, 1 dan 100 gaça har bir son | misollar: öyin sikli, parolni qayta söraş |

Agar `for` ni işlata olsangiz, uni afzal köring. U qisqaroq, `range` böyiça `for` esa doim tugaydi, şuning uçun sanovçini yangilaşni unutib bölmaydi.

## Özingiz sinab köring

Kattaroq köpaytiriş jadvalini çiziş uçun `size` ni yoki format kengligi `4` ni özgartiring.

<ClientOnly><PythonPlayground :code='"size = 5\n\nprint(\"    \", end=\"\")\nfor col in range(1, size + 1):\n    print(f\"{col:4}\", end=\"\")\nprint()\n\nfor row in range(1, size + 1):\n    print(f\"{row:4}\", end=\"\")\n    for col in range(1, size + 1):\n        print(f\"{row * col:4}\", end=\"\")\n    print()"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `stop` kirmasligini unutiş

```python
for n in range(1, 10):     # 1 dan 10 gaça közda tutilgan edi
    print(n, end=" ")
```

```text
1 2 3 4 5 6 7 8 9
```

`range(1, 10)` 10 dan **oldin** töxtaydi. 10 ni ham qöşiş uçun `range(1, 11)` deb yozing. `n` özgaruvçisi bilan: `range(1, n + 1)`.

### 2. Son böyiça aylaniş

```py
for i in 5:
    print(i)
```

```text
TypeError: 'int' object is not iterable
```

**Tuzatiş:** `for i in range(5):`.

### 3. Natijani sikl içida qayta nolga tuşiriş

```python
for n in range(1, 4):
    total = 0          # har bir takrorlanişda qayta nolga tuşadi!
    total += n
print(total)           # 1 + 2 + 3 közda tutilgan edi
```

```text
3
```

**Tuzatiş:** `total = 0` ni sikldan **oldin** yarating.

### 4. Manfiy qadamsiz teskari sanaş

```python
for n in range(10, 0):
    print(n)
print("Uçdik!")
```

```text
Uçdik!
```

Xato ham yöq, teskari sanaş ham yöq: sukut böyiça qadam `+1`, qöşiş bilan esa 10 dan 0 ga yetib bölmaydi. **Tuzatiş:** `range(10, 0, -1)`. Nol qadam esa xato beradi:

```py
for n in range(10, 0, 0):
    print(n)
```

```text
ValueError: range() arg 3 must not be zero
```

## Maşqlar

### 1. Juft sonlar <Difficulty level="1" />

2 dan 20 gaça barça juft sonlarni bitta qatorda, böşliq bilan ajratib çop eting. `if` emas, `range` ning `step` parametridan foydalaning.

::: details Yeçim
```python
for n in range(2, 21, 2):
    print(n, end=" ")
print()
```
:::

### 2. Harfma-harf <Difficulty level="1" />

`word = "sikl"` uçun har bir harfni katta harf bilan va örni bilan birga `1: S` kabi çop eting.

::: details Yeçim
```python
word = "sikl"
position = 1

for letter in word:
    print(f"{position}: {letter.upper()}")
    position += 1
```

*Sikllarda köp işlatiladigan usullar* darsida örnini avtomatik beradigan `enumerate()` ni örganasiz.
:::

### 3. Faktorial <Difficulty level="2" />

`n` ning faktoriali (`n!` deb yoziladi) - `1 × 2 × 3 × … × n`. `10!` ni sikl bilan hisoblang. Javob: `3628800`.

::: details Yeçim
```python
n = 10
result = 1

for i in range(1, n + 1):
    result *= i

print(f"{n}! = {result}")
```

Köpaytma uçun `0` dan emas, `1` dan boşlang, aks holda hamma narsa nolga aylanadi.
:::

### 4. Piramida <Difficulty level="2" />

Balandligi 4 bölgan markazlaşgan piramidani çop eting:

```text
   *
  ***
 *****
*******
```

::: details Yeçim
```python
height = 4

for row in range(1, height + 1):
    spaces = " " * (height - row)
    stars = "*" * (2 * row - 1)
    print(spaces + stars)
```

Avval qonuniyatni aniqlang: 1-qatorda 3 ta böşliq va 1 ta yulduzça, 2-qatorda 2 ta böşliq va 3 ta yulduzça va hokazo.
:::

### 5. FizzBuzz <Difficulty level="3" />

1 dan 30 gaça sonlar uçun: 3 ga karralilar uçun `Fizz`, 5 ga karralilar uçun `Buzz`, ikkalasiga ham karralilar uçun `FizzBuzz`, qolgan hollarda sonning özini çop eting.

::: details Yeçim
```python
for n in range(1, 31):
    if n % 15 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)
```

`% 15` tekşiruvi **birinçi** kelişi kerak. Aks holda 15 `% 3` ga mos kelib, faqat `Fizz` ni çop etardi. Bu yana `elif` dagi "tartib muhim" qoidasi va u maşhur suhbat savoli.
:::

## Xulosa

- `for item in sequence:` tanani har bir element uçun bir marta bajaradi: satr belgilari, röyxat elementlari yoki `range` dagi sonlar.
- `range(stop)` 0 dan boşlanadi. `range(start, stop, step)` startni öz içiga oladi, stopni olmaydi, manfiy qadam esa teskari sanaydi.
- Natija özgaruvçilarini sikldan **oldin** yarating va ularni sikl içida yangilang.
- Nima takrorlanişini çekiniş belgilaydi. Sikldan keyingi kod bir marta bajariladi.
- Içma-iç sikllar taşqi siklning har bir takrorlanişida butun içki siklni bajaradi.
- Elementlar yoki maʼlum son böyiça aylanişda `for` ni, nimadir sodir bölgunça takrorlaşda `while` ni afzal köring.

## Qöşimça manbalar

- [Python Tutorial - `for` statements](https://docs.python.org/3/tutorial/controlflow.html#for-statements)
- [Python Tutorial - The `range()` function](https://docs.python.org/3/tutorial/controlflow.html#the-range-function)
