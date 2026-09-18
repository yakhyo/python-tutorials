---
title: while sikli
description: "Şart rost ekan kodni takrorlang: hisoblagiçlar, töğri javob kiritilgunça kutadigan sikllar, çeksiz sikllardan saqlaniş va while True andozasi."
---

# while sikli

![Rasm: while sikli](/images/topics-webp-uzb/while-loops.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `while` sikli şart rost ekan kodni qanday takrorlaydi
- Sikl yordamida sanaş va qiymat yiğiş
- Foydalanuvçi yaroqli javob bergunça söraş
- **Çeksiz sikl** nima va uni qanday töxtatiş mumkin
- `while True` + `break` andozasi
:::

## Nega bu muhim

Kompyuterlar bir işni zerikmasdan va xato qilmasdan köp marta bajarişni juda yaxşi uddalaydi. Öyin öyinçi çiqib ketgunça davom etadi. Bankomat PIN-kod töğri kiritilgunça yoki urinişlar tugagunça söraydi. Yuklab oliş tugagunça kutib turadi. **Sikllar (loop)** dasturingizga işni takrorlaş imkonini beradi. `while` sikli şart rost bölib turgan ekan takrorlanadi.

## Birinçi while siklingiz

```python
count = 1

while count <= 5:
    print(f"Hisob: {count}")
    count += 1

print("Tayyor!")
```

```text
Hisob: 1
Hisob: 2
Hisob: 3
Hisob: 4
Hisob: 5
Tayyor!
```

Tuzilişi `if` ga öxşaydi:

```text
while şart:
    tana (şart True ekan qayta-qayta bajariladi)
```

Python uni qanday bajaradi:

1. Şartni tekşiradi. Agar u `False` bölsa, tanani ötkazib yuboradi va sikldan keyingi kodga ötadi.
2. Agar `True` bölsa, butun tanani bajaradi.
3. 1-qadamga qaytadi.

Tananing har bir bajarilişi **takrorlaniş (iteration)** deyiladi. Bu yerda şart 6 marta tekşiriladi: 5 marta u `True`, 6-tekşiruvda esa (`count` `6` ga teng) `False` böladi va sikl tugaydi.

::: tip Sanovçi siklning uç qismi
1. **Boşlaniş:** `count = 1`, sikldan oldin
2. **Şart:** `count <= 5`, har bir takrorlanişdan oldin tekşiriladi
3. **Yangilaş:** `count += 1`, tana içida, oxirga qarab yaqinlaştiradi
:::

## Siklni kuzatiş

Sikl sizni çalğitsa, uni jadval bilan kuzating: har bir takrorlaniş uçun bitta qator.

```python
total = 0
number = 1

while number <= 4:
    total += number
    number += 1

print(total)
```

| Tekşiruv | `number` | `number <= 4` | Tanadan keyin `total` |
|---|---|---|---|
| 1 | 1 | `True` | 1 |
| 2 | 2 | `True` | 3 |
| 3 | 3 | `True` | 6 |
| 4 | 4 | `True` | 10 |
| 5 | 5 | `False` | (sikl tugaydi) |

```text
10
```

Şart faqat boşida, har bir takrorlanişda bir marta tekşiriladi. Agar u tananing örtasida yolğonga aylansa, tananing qolgan qismi baribir bajariladi.

## Sanamaydigan sikllar

`while` sikli neça marta takrorlaş kerakligini **oldindan bilmaganingizda** eng foydali. Siz faqat qaçon töxtaş kerakligini bilasiz:

```python
savings = 100_000
goal = 1_000_000
months = 0

while savings < goal:
    savings = savings * 1.05 + 100_000   # 5% ösiş va har oylik qöşimça
    months += 1

print(f"Maqsadga {months} oyda erişildi: {savings:,.0f} söm")
```

```text
Maqsadga 8 oyda erişildi: 1,102,656 söm
```

Heç kim siklga "8 marta bajaril" demadi. U buni özi aniqladi.

## Kiritilgan qiymat yaroqli bölgunça takrorlaş

Klassik qöllaniş: foydalanuvçi maqbul narsa yozgunça söray beriş.

```python
age = int(input("Yoşingizni kiriting (1-120): "))

while age < 1 or age > 120:
    print("Bu töğriga öxşamaydi. Qaytadan urinib köring.")
    age = int(input("Yoşingizni kiriting (1-120): "))

print(f"Rahmat! Siz {age} yoşdasiz.")
```

`input()` ikki marta yozilganiga eʼtibor bering: bir marta sikldan oldin, bir marta esa yangi javob oliş uçun sikl içida. Bu takrorlaniş quyidagi `while True` andozasi bilan tuzatiladi.

### Maxsus qiymat bilan töxtaş

Yana bir andoza - **sentinel**: "töxta" degan maʼnoni bildiruvçi maxsus qiymat.

```python
total = 0
number = int(input("Son kiriting (tugatiş uçun 0): "))

while number != 0:
    total += number
    number = int(input("Son kiriting (tugatiş uçun 0): "))

print(f"Yiğindi: {total}")
```

`7`, `5`, `3`, `2`, `1`, `0` kiritilganda:

```text
Yiğindi: 18
```

## Çeksiz sikllar

Agar şart heç qaçon yolğon bölmasa, sikl **abadiy** davom etadi:

```py
count = 1
while count <= 5:
    print(count)
    # count += 1 unutilgan, şuning uçun count doim 1
```

Bu çeksiz `1` çop etadi. Agar bu sizda sodir bölsa:

- **Terminalda** dasturni töxtatiş uçun **Ctrl + C** ni bosing.
- **Şu saytdagi muharrirda** **Töxtatiş** tugmasini bosing yoki vaqt çegarasini kuting.

Siklni işga tuşirişdan oldin özingizdan söring: **şartni nima yolğonga aylantiradi?**

## `while True` va `break`

Baʼzan "abadiy" aylanib, **örtadan** `break` bilan çiqib ketiş eng tuşunarli yöl böladi:

```python
while True:
    answer = input("Çiqiş uçun 'quit' deb yozing: ").strip().lower()
    if answer == "quit":
        break
    print(f"Siz yozdingiz: {answer}")

print("Xayr!")
```

`7`, `5`, `3`, `2`, `1`, `0`, `quit` kiritilganda u har bir qiymatni qaytarib çop etadi, keyin `Xayr!` deb yozadi.

`break` şart nima deyişidan qatʼi nazar siklni darhol tugatadi. Bu tekşiriş misolidagi takroriy `input()` dan xalos qiladi va yana bir muammoni tuzatiş imkonini beradi: foydalanuvçi `yigirma` deb yozsa `int(input())` yiqiladi. Avval matnni `.isdecimal()` bilan tekşiring. U faqat satr böş bölmaganda va har bir belgi `int()` özgartira oladigan raqam bölgandagina `True`:

```python
while True:
    text = input("Yoşingizni kiriting (1-120): ").strip()
    if text.isdecimal() and 1 <= int(text) <= 120:
        break
    print("Iltimos, 1 dan 120 gaça butun son yozing.")

age = int(text)
print(f"Rahmat! Siz {age} yoşdasiz.")
```

`yigirma`, keyin `150`, keyin `25` kiritilganda:

```text
Yoşingizni kiriting (1-120): yigirma
Iltimos, 1 dan 120 gaça butun son yozing.
Yoşingizni kiriting (1-120): 150
Iltimos, 1 dan 120 gaça butun son yozing.
Yoşingizni kiriting (1-120): 25
Rahmat! Siz 25 yoşdasiz.
```

*Mantiqiy operatorlar* darsidagi qisqa tutaşuv buni xavfsiz qiladi: `text.isdecimal()` `False` bölsa, Python `int(text)` ni umuman bajarmaydi.

`break` (va uning hamkori `continue`) haqida *break, continue va else* darsida köproq örganasiz.

## Özingiz sinab köring

Maxfiy son oldindan belgilangan son topiş öyini. **input() uçun qiymatlar** maydoniga har bir qatorga bittadan bir neça taxmin yozing va işga tuşiring.

<ClientOnly><PythonPlayground :code='"secret = 42\nattempts = 0\nguess = 0\n\nwhile guess != secret:\n    guess = int(input(\"Taxminingiz: \"))\n    attempts += 1\n    if guess < secret:\n        print(\"Juda kiçik\")\n    elif guess > secret:\n        print(\"Juda katta\")\n\nprint(f\"Töğri! Sizga {attempts} ta uriniş kerak böldi.\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Bittaga adaşiş

```python
count = 1
while count < 5:     # 5 gaça sanaş közda tutilgan edi
    print(count)
    count += 1
```

```text
1
2
3
4
```

Oxirgi qiymat kirişi kerakmi, yöqmi - hal qiling: `< 5` 4 da, `<= 5` esa 5 da töxtaydi. Oxirgi takrorlanişni kuzatiş bu xatoni aniqlaydi.

### 2. Notöğri joyda yangilaş

```python
count = 1
while count <= 3:
    count += 1
    print(count)     # 1, 2, 3 ni çop etiş közda tutilgan edi
```

```text
2
3
4
```

Tana içidagi qatorlar tartibi muhim. Odatda yangilaş **oxirida** keladi.

### 3. Notöğri qatorlarni çekiniş bilan yoziş

```py
count = 1
while count <= 3:
    print(count)
count += 1           # çekiniş yöq, demak sikldan taşqarida
```

```text
1
1
1
... (Töxtatiş yoki Ctrl + C bosilgunça abadiy)
```

`count += 1` hiç qaçon bajarilmaydi, şuning uçun şart hiç qaçon özgarmaydi. Takrorlanişi kerak bölgan hamma narsa `while` ostida çekiniş bilan yozilişi kerak. Dasturingiz qotib qolganday tuyulsa, avval yangilaşni tekşiring.

### 4. Kiritilgan qiymatni tekşirmasdan özgartiriş

```py
age = int(input("Yoşingizni kiriting: "))   # foydalanuvçi yozadi: yigirma
```

```text
ValueError: invalid literal for int() with base 10: 'yigirma'
```

**Tuzatiş:** `while True` bilan sikl qiling, `text.isdecimal()` ni tekşiring va faqat şundan keyin `int()` ni çaqiring - yuqoridagi tekşiriş misolidagidek.

## Maşqlar

### 1. Teskari sanaş <Difficulty level="1" />

10 dan 1 gaça teskari sanab çop eting, keyin `Uçdik!` deb yozing.

::: details Yeçim
```python
n = 10
while n >= 1:
    print(n)
    n -= 1
print("Uçdik!")
```
:::

### 2. Ikki barobarlaş <Difficulty level="1" />

`1` dan boşlang va qiymat 1000 dan kiçik ekan uni ikki barobar oşiring. Har bir qiymatni çop eting.

::: details Yeçim
```python
value = 1
while value < 1000:
    print(value)
    value *= 2
```

Oxirgi çop etilgan qiymat - `512`. Keyingi ikki barobar qiymat `1024` şartdan ötmaydi.
:::

### 3. Raqamlarni sanang <Difficulty level="2" />

Satrga aylantirmasdan musbat butun sonda neçta raqam borligini sanang. Siklda `// 10` dan foydalaning. `number = 2026` uçun `4` ni çop eting.

::: details Yeçim
```python
number = 2026
digits = 0

while number > 0:
    number //= 10     # oxirgi raqamni olib taşlaymiz
    digits += 1

print(digits)
```

Ehtiyot böling: `number = 0` uçun bu `0` ni çop etadi. Bu holatni `if` bilan alohida boşqariş mumkin.
:::

### 4. Urinişlar soni çeklangan PIN-kod <Difficulty level="2" />

Töğri PIN-kod - `"1234"`. PIN-kodni **3 martagaça** söring. Töğri kiritilsa `Kirişga ruxsat berildi`, 3 ta notöğri urinişdan keyin esa `Karta bloklandi` deb çop eting.

::: details Yeçim
```python
correct_pin = "1234"
attempts = 0
granted = False

while attempts < 3 and not granted:
    pin = input("PIN: ")
    attempts += 1
    if pin == correct_pin:
        granted = True
    else:
        print("PIN notöğri")

if granted:
    print("Kirişga ruxsat berildi")
else:
    print("Karta bloklandi")
```

`granted` mantiqiy özgaruvçisi **bayroq (flag)** deyiladi. U sikl içida nimadir sodir bölganini qayd etadi.
:::

### 5. Kollats ketma-ketligi <Difficulty level="3" />

Musbat butun son `n` dan boşlang. `n` `1` ga teng bölmagunça: agar u juft bölsa, 2 ga böling, aks holda uni `3 * n + 1` ga teng qiling. Har bir qiymatni, keyin esa neça qadam ketganini çop eting. `n = 6` uçun ketma-ketlik: `6 3 10 5 16 8 4 2 1` (8 qadam).

::: details Yeçim
```python
n = 6
steps = 0

print(n, end=" ")
while n != 1:
    if n % 2 == 0:
        n //= 2
    else:
        n = 3 * n + 1
    steps += 1
    print(n, end=" ")

print()
print(f"Qadamlar: {steps}")
```

Matematiklar bu har qanday boşlanğiç son uçun doim 1 ga yetib keladi deb hisoblaşadi, lekin buni hali heç kim isbotlamagan!
:::

## Xulosa

- `while şart:` şart rost ekan tanasini takrorlaydi. Şart har bir takrorlanişdan oldin tekşiriladi.
- Sanovçi siklga **boşlaniş**, **şart** va **yangilaş** kerak.
- Neça marta takrorlaş kerakligini oldindan bilmasangiz, `while` dan foydalaning: yaroqli kiritişni kutiş, maqsadga erişiş yoki sentinel qiymat.
- Şart heç qaçon yolğon bölmasa, **çeksiz sikl** hosil böladi. Uni Ctrl + C bilan töxtating.
- `break` bilan `while True:` sikldan örtada çiqiş imkonini beradi. Kiritilgan qiymat yaroqli son bölgunça söraş uçun uni `.isdecimal()` bilan birlaştiring.

## Qöşimça manbalar

- [The `while` statement](https://docs.python.org/3/reference/compound_stmts.html#the-while-statement)
- [Python Tutorial - First steps towards programming](https://docs.python.org/3/tutorial/introduction.html#first-steps-towards-programming)
