---
title: break, continue va else
description: "Sikllarni aniq boşqaring: break bilan oldinroq töxtating, continue bilan takrorlanişni ötkazib yuboring, sikl break siz tugaganda kod bajaring va içma-iç sikllarni boşqaring."
---

# break, continue va else

![Rasm: break, continue va else](/images/topics-webp-uzb/break-continue-else.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `break` bilan siklni oldinroq töxtatiş
- `continue` bilan joriy takrorlanişning qolgan qismini ötkazib yuboriş
- Siklning `else` bloki nima qiladi va qaçon bajariladi
- Içma-iç sikllarda `break` özini qanday tutadi
- `break`, bayroq özgaruvçisi va sikl şarti orasida qanday tanlaş
:::

## Nega bu muhim

Sikllar har doim ham oxirigaça aylanişi şart emas. Nimanidir qidirayotganda, uni topişingiz bilanoq töxtaş mumkin. Baʼzi elementlar yaroqsiz bölsa, ularni ötkazib yuboriş mumkin. Bu kiçik vositalar sikllarni tezroq, qisqaroq va öqiş uçun osonroq qiladi.

## `break`: siklni hozir töxtatiş

`break` siklni darhol tugatadi. Python sikldan **keyingi** birinçi qatordan davom etadi:

```python
for n in range(1, 100):
    if n * n > 50:
        print(f"Kvadrati 50 dan katta birinçi son: {n}")
        break
    print(f"{n} ning kvadrati {n * n}")

print("Sikl tugadi")
```

```text
1 ning kvadrati 1
2 ning kvadrati 4
3 ning kvadrati 9
4 ning kvadrati 16
5 ning kvadrati 25
6 ning kvadrati 36
7 ning kvadrati 49
Kvadrati 50 dan katta birinçi son: 8
Sikl tugadi
```

`break` bölmaganda sikl bekorga 99 gaça davom etardi.

`break` `while` sikllarida ham xuddi şunday işlaydi. *while sikli* darsidagi `while True` andozasini aynan u mumkin qiladi:

```python
attempts = 0

while True:
    attempts += 1
    pin = input("PIN: ")
    if pin == "7":
        print("Qulf oçildi")
        break
    if attempts == 3:
        print("Urinişlar juda köp")
        break
```

## `continue`: keyingi takrorlanişga ötiş

`continue` **joriy takrorlanişning qolgan qismini** ötkazib yuboradi va keyingi element uçun sikl boşiga qaytadi:

```python
for n in range(1, 11):
    if n % 3 == 0:
        continue          # 3 ga karralilarni ötkazib yuboramiz
    print(n, end=" ")
print()
```

```text
1 2 4 5 7 8 10 
```

`continue` yaroqsiz yoki keraksiz elementlarni erta ötkazib yuboriş uçun qulay, şunda asosiy kodga qöşimça çekiniş kerak bölmaydi:

```python
entries = ["42", "", "17", "abc", "8"]
total = 0

for entry in entries:
    if not entry.isdigit():
        print(f"Yaroqsiz yozuv ötkazib yuborildi: {entry!r}")
        continue
    total += int(entry)

print(f"Jami: {total}")
```

```text
Yaroqsiz yozuv ötkazib yuborildi: ''
Yaroqsiz yozuv ötkazib yuborildi: 'abc'
Jami: 67
```

(`{entry!r}` qiymatni qöştirnoqlari bilan körsatadi, şuning uçun böş satr `''` körinişida körinadi.)

::: warning while siklidagi continue
`while` siklida **yangilaş `continue` dan oldin bajarilişiga** işonç hosil qiling, aks holda uni ötkazib yuborasiz va sikl abadiy aylanadi:

```py
n = 0
while n < 10:
    if n % 2 == 0:
        continue      # n heç qaçon özgarmaydi → çeksiz sikl
    print(n)
    n += 1
```
:::

## `break` va `continue`

| Buyruq | Taʼsiri |
|---|---|
| `break` | Sikldan butunlay çiqadi |
| `continue` | **Şu** takrorlanişning qolgan qismini ötkazib yuborib, keyingisiga ötadi |
| `pass` | Heç narsa qilmaydi; şunçaki joy egallovçi (sikl odatdagidek davom etadi) |

## Siklning `else` bloki

Sikllarda `else` bloki bölişi mumkin. U sikl **odatdagidek tugaganda**, yaʼni `break` bilan töxtatilmaganda bajariladi:

```python
secret_word = "kivi"
guesses = ["olma", "nok", "kivi", "olxöri"]

for guess in guesses:
    if guess == secret_word:
        print(f"Topildi: {guess}")
        break
else:
    print("Maxfiy söz röyxatda yöq edi.")
```

```text
Topildi: kivi
```

`secret_word` ni `"mango"` ga özgartirsangiz, sikl break siz barça taxminlarni aylanib çiqadi va `else` bajariladi:

```text
Maxfiy söz röyxatda yöq edi.
```

`for … else` ni eng yaxşisi **"for … agar break bölmasa"** deb öqiş. U qidiruv uçun möljallangan: narsani topsangiz `break`, "topilmadi" holatini esa `else` boşqaradi.

Klassik misol - son tub ekanini tekşiriş:

```python
number = 29

for divisor in range(2, number):
    if number % divisor == 0:
        print(f"{number} tub emas ({divisor} ga bölinadi)")
        break
else:
    print(f"{number} tub son")
```

```text
29 tub son
```

Bu tekşiruv faqat 2 va undan katta sonlar uçun tögri. `number = 1` uçun `range(2, 1)` böş, sikl hiç qaçon `break` qilmaydi va `else` `1 tub son` deb çop etadi. Haqiqiy dasturda `number < 2` ni sikldan oldin `if` bilan hal qiling.

`while` sikllarida ham xuddi şu qoida bilan `else` bölişi mumkin: u `break` dan keyin emas, şart yolğonga aylanganda bajariladi. Mana *while sikli* darsidagi PIN tekşiruvi, bu safar bayroqsiz:

```python
correct_pin = "1234"
attempts = 0

while attempts < 3:
    pin = input("PIN: ")
    attempts += 1
    if pin == correct_pin:
        print("Kirişga ruxsat berildi")
        break
    print("Notöğri PIN")
else:
    print("Karta bloklandi")
```

`1111`, `2222`, `3333` kiritilganda:

```text
PIN: 1111
Notöğri PIN
PIN: 2222
Notöğri PIN
PIN: 3333
Notöğri PIN
Karta bloklandi
```

Istalgan paytda `1234` kiritsangiz, `break` `else` ni ötkazib yuboradi, şuning uçun karta bloklanmaydi.

### Bayroq bilan muqobil yöl

Köp dasturçilar uçun sikldagi `else` kutilmagan tuyuladi. **Bayroq özgaruvçisi** xuddi şu vazifani bajaradi va uni hamma oson öqiy oladi:

```python
number = 29
is_prime = True

for divisor in range(2, number):
    if number % divisor == 0:
        is_prime = False
        break

if is_prime:
    print(f"{number} tub son")
else:
    print(f"{number} tub emas")
```

Ikkalasi ham yaxşi. Qaysi biri kodingizni tuşunarliroq qilsa, öşani işlating.

## Içma-iç sikllar: `break` faqat bitta sikldan çiqaradi

`break` va `continue` faqat özlari joylaşgan **eng içki** siklga taʼsir qiladi:

```python
for row in range(1, 4):
    for col in range(1, 4):
        if col == 2:
            break            # faqat içki sikldan çiqadi
        print(f"({row}, {col})")
    print(f"{row}-qator tugadi")
```

```text
(1, 1)
1-qator tugadi
(2, 1)
2-qator tugadi
(3, 1)
3-qator tugadi
```

**Ikkala** siklni töxtatiş uçun taşqi sikl tekşiradigan bayroqdan foydalaning:

```python
target = 6
found = False

for row in range(1, 4):
    for col in range(1, 4):
        if row * col == target:
            print(f"{row} x {col} = {target}")
            found = True
            break
    if found:
        break
```

```text
2 x 3 = 6
```

*Qaytariladigan qiymatlar* darsida tozaroq usulni örganasiz: sikllarni funksiyaga joylab, undan `return` bilan çiqiş.

## Özingiz sinab köring

Bu menyu sikli notöğri tanlovlar uçun `continue` ni, çiqiş uçun esa `break` ni işlatadi. **input() uçun qiymatlar** maydoniga `1`, `9`, `2`, `q` kabi tanlovlarni yozing.

<ClientOnly><PythonPlayground :code='"balance = 100000\n\nwhile True:\n    choice = input(\"1) balans  2) 20000 yeçiş  q) çiqiş: \").strip()\n    print(choice)\n    if choice == \"q\":\n        print(\"Xayr!\")\n        break\n    if choice not in (\"1\", \"2\"):\n        print(\"Notaniş tanlov\")\n        continue\n    if choice == \"2\":\n        if balance < 20000:\n            print(\"Pul yetarli emas\")\n            continue\n        balance -= 20000\n    print(f\"Balans: {balance:,} söm\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Sikldan taşqarida `break`

```py
if True:
    break
```

```text
SyntaxError: 'break' outside loop
```

`break` va `continue` faqat `for` va `while` içida işlaydi.

### 2. Sikldagi `else` ni notöğri tuşuniş

```python
for letter in "abc":
    print(letter)
else:
    print("Sikl bajarilmadi")   # else nima ekanini notöğri tuşuniş
```

```text
a
b
c
Sikl bajarilmadi
```

`else` bloki "agar sikl bajarilmagan bölsa" degani emas. U "agar sikl **break bilan uzilmagan bölsa**" degani, şuning uçun u har bir oddiy tugaşdan keyin, sikl bironta ham takrorlanmagan holda ham bajariladi.

### 3. `continue` bilan yangilaşni ötkazib yuboriş

```py
n = 0
while n < 5:
    if n == 2:
        continue      # tekşiruvga qaytadi, n 2 ligiça qoladi
    print(n)
    n += 1
```

```text
0
1
(keyin hiç narsa: Töxtatiş bosilgunça sikl abadiy aylanadi)
```

**Tuzatiş:** `while` sikllarida hisoblagiçni har qanday `continue` dan **oldin** yangilang.

### 4. Şart tuşunarliroq bölgan joyda `break` işlatiş

```python
# Yomon: sikl şarti tana içiga yaşiringan
n = 1
while True:
    if n > 5:
        break
    print(n)
    n += 1

# Yaxşi: şart siklning qaçon tugaşini aytib turadi
n = 1
while n <= 5:
    print(n)
    n += 1
```

```text
1
2
3
4
5
1
2
3
4
5
```

Ikkalasi ham bir xil sonlarni çop etadi, lekin ikkinçisi birinçi qatoridayoq sikl qaçon töxtaşini aytadi. `break` ni çiqiş nuqtasi tabiiy ravişda örtada bölganda, masalan kiritişni öqigandan keyin darhol, işlating.

## Maşqlar

### 1. Birinçi manfiy son <Difficulty level="1" />

`numbers = [4, 8, 15, -3, 16, -42]` böyiça aylaning va **birinçi** manfiy sonni çop etib, töxtang.

::: details Yeçim
```python
numbers = [4, 8, 15, -3, 16, -42]

for n in numbers:
    if n < 0:
        print(f"Birinçi manfiy son: {n}")
        break
```
:::

### 2. Unlilarsiz <Difficulty level="1" />

`continue` yordamida `"dasturlaş"` sözining harflarini unlilarsiz, bitta qatorda çop eting.

::: details Yeçim
```python
for letter in "dasturlaş":
    if letter in "aeiouö":
        continue
    print(letter, end="")
print()
```

```text
dstrlş
```
:::

### 3. Nolgaça yiğindi <Difficulty level="2" />

`while True` siklida `input()` bilan sonlarni öqing va ularni qöşing. Foydalanuvçi `0` kiritganda töxtang. Manfiy sonlarni xabar bilan ötkazib yuboring (ularni qöşmang).

::: details Yeçim
```python
total = 0

while True:
    number = int(input("Son (töxtatiş uçun 0): "))
    if number == 0:
        break
    if number < 0:
        print("Manfiy sonlar hisobga olinmaydi.")
        continue
    total += number

print(f"Jami: {total}")
```
:::

### 4. else bilan qidiruv <Difficulty level="2" />

`email_list = ["ali@mail.uz", "vali@mail.uz", "gani@mail.uz"]` va `wanted = "bek@mail.uz"` berilgan. Email röyxatda bölsa `Röyxatdan ötgan`, aks holda `Röyxatdan ötmagan` deb çop eting. `in` operatori emas, `else` li `for` siklidan foydalaning.

::: details Yeçim
```python
email_list = ["ali@mail.uz", "vali@mail.uz", "gani@mail.uz"]
wanted = "bek@mail.uz"

for email in email_list:
    if email == wanted:
        print("Röyxatdan ötgan")
        break
else:
    print("Röyxatdan ötmagan")
```

Haqiqiy kodda `if wanted in email_list:` soddaroq. Sikl varianti qidiruv içkarida qanday işlaşini körsatadi.
:::

### 5. 50 gaça tub sonlar <Difficulty level="3" />

2 dan 50 gaça barça tub sonlarni bitta qatorda çop eting. `break` va `else` li içma-iç sikldan foydalaning. Tezlaştiriş uçun içki sikl böluvçilarni faqat sonning kvadrat ildizigaça tekşirişi kifoya (`divisor * divisor <= n`).

::: details Yeçim
```python
for n in range(2, 51):
    divisor = 2
    while divisor * divisor <= n:
        if n % divisor == 0:
            break
        divisor += 1
    else:
        print(n, end=" ")
print()
```

```text
2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 
```

Agar `n` ning böluvçisi bölsa, uning kvadrat ildizidan katta bölmagan böluvçisi ham albatta bor, şuning uçun undan nariga tekşiriş şart emas.
:::

## Xulosa

- `break` sikldan darhol çiqadi. `continue` keyingi takrorlanişga ötadi.
- Sikldagi `else` faqat sikl **`break` bilan töxtatilmaganda** bajariladi. Uni "agar break bölmasa" deb öqing - bu qidiruvlarga mos.
- Bayroq özgaruvçisi sikldagi `else` ning öqiş oson muqobili.
- `break` va `continue` faqat eng içki siklga taʼsir qiladi.
- `while` sikllarida özgaruvçilarni `continue` dan oldin yangilang.

## Qöşimça manbalar

- [Python Tutorial - `break` and `continue`, and `else` on loops](https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements)
