---
title: if, elif va else
description: "if, elif va else yordamida dasturga nima qiliş kerakligini tanlatiş: bloklar va çekiniş, köp variantlardan birini tanlaş, içma-iç şartlar va bir qatorli şartli ifodalar."
---

# if, elif va else

![Rasm: if, elif va else](/images/topics-webp-uzb/if-elif-else.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `if` yordamida kodni faqat şart rost bölganda bajariş
- `else` yordamida qarama-qarşi holatni boşqariş
- `elif` yordamida köp variantlardan birini tanlaş
- Nega şartlarning **tartibi** muhim
- Qarorlarni içma-iç joylaş va qisqa şartli ifoda yoziş
:::

## Nega bu muhim

Hozirgaça dasturlaringiz har safar barça qatorlarni yuqoridan pastga qarab bajarardi. Haqiqiy dasturlar esa **vaziyatga qarab iş tutadi**: parol notöğri bölsa xato körsatadi, aʼzolarga çegirma beradi, savat böş bölsa "0 ta mahsulot" örniga "Savat böş" deb yozadi. `if` buyruği dasturga nima qilişni tanlaş imkonini beradi.

## `if`: kodni faqat şart rost bölganda bajariş

```python
temperature = 34

if temperature > 30:
    print("Bugun issiq.")
    print("Suv içişni unutmang.")

print("Kuningiz yaxşi ötsin!")
```

```text
Bugun issiq.
Suv içişni unutmang.
Kuningiz yaxşi ötsin!
```

`temperature` ni `20` ga özgartirsangiz, çekiniş bilan yozilgan ikki qator **ötkazib yuboriladi**:

```text
Kuningiz yaxşi ötsin!
```

Tuzilişi:

```text
if şart:
    faqat şart True bölganda bajariladigan kod
```

- Qator `if` bilan boşlanadi, keyin şart, keyin **ikki nuqta** `:` keladi.
- `if` ga tegişli kod **çekiniş (indentation)** bilan (4 ta böşliq) yoziladi. Çekiniş bilan yozilgan bunday qatorlar guruhi **blok** deyiladi.
- Çekiniş tugagan joyda blok ham tugaydi. `print("Kuningiz yaxşi ötsin!")` çekinişsiz yozilgan, şuning uçun u doim bajariladi.

Şart rost yoki yolğon hisoblanadigan har qanday narsa bölişi mumkin (*Mantiqiy qiymatlar va taqqoslaş* darsiga qarang): taqqoslaş, mantiqiy özgaruvçi yoki istalgan qiymat.

## `else`: aks holda…

`else` şart **yolğon** bölganda bajariladigan kodni beradi. Ikki blokdan aynan bittasi bajariladi:

```python
age = 15

if age >= 18:
    print("Siz ovoz bera olasiz.")
else:
    years_left = 18 - age
    print(f"Siz {years_left} yildan keyin ovoz bera olasiz.")
```

```text
Siz 3 yildan keyin ovoz bera olasiz.
```

`else` da şart yöq. U `if` ilib olmagan hamma narsani uşlaydi.

## `elif`: köp variantlardan birini tanlaş

`elif` - "else if" (aks holda, agar) ning qisqartmasi. U bir neça şartni navbat bilan tekşirişga imkon beradi:

```python
score = 76

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Ball {score} → baho {grade}")
```

```text
Ball 76 → baho C
```

Python buni qanday bajaradi:

1. Har bir şartni **yuqoridan pastga** tekşiradi.
2. Rost bölgan **birinçi** şartning blokini bajaradi.
3. Keyingi şartlar ham rost bölsa ham, **qolganlarining hammasini ötkazib yuboradi**.
4. Heç biri rost bölmasa, `else` ni bajaradi (agar u bölsa).

`score = 76` uçun: `76 >= 90` False, `76 >= 80` False, `76 >= 70` True, demak baho `"C"` va Python tekşirişni töxtatadi.

`elif` bloklari istalgança bölişi mumkin, `else` esa majburiy emas.

### Tartib muhim

Faqat **birinçi** mos kelgan blok bajarilgani uçun eng aniq şartlarni birinçi qöying. Bu variantda xato bor:

```python
score = 95

if score >= 60:
    grade = "D"
elif score >= 90:
    grade = "A"      # hiç qaçon bajarilmaydi: >= 90 bölgan har bir ball >= 60 ham
else:
    grade = "F"

print(grade)
```

```text
D
```

`95 >= 60` rost, şuning uçun birinçi blok bajariladi va boşqa heç narsa tekşirilmaydi.

### `elif` va alohida `if` buyruqlari

Alohida `if` buyruqlari **hammasi** bir-biridan mustaqil tekşiriladi. `elif` zanjiri esa **faqat bitta** tarmoqni tanlaydi:

```python
points = 95

# alohida if lar: bir neçtasi bajarilişi mumkin
if points > 50:
    print("50 dan köp")
if points > 90:
    print("90 dan köp")

# bitta zanjir: faqat birinçi mos kelgani bajariladi
if points > 90:
    print("Aʼlo")
elif points > 50:
    print("Yaxşi")
```

```text
50 dan köp
90 dan köp
Aʼlo
```

Variantlar **bir-birini istisno qilganda** (bitta baho, bitta çipta narxi) `if`/`elif`/`else` zanjiridan foydalaning. **Mustaqil** tekşiruvlar uçun alohida `if` buyruqlarini yozing.

## Içma-iç qarorlar

Blok içida boşqa `if` bölişi mumkin. Har bir daraja yana 4 ta böşliq çekiniş qöşadi:

```python
has_ticket = True
age = 12

if has_ticket:
    if age < 14:
        print("Xuş kelibsiz! Iltimos, kattalar bilan birga öltiring.")
    else:
        print("Xuş kelibsiz! Tomoşadan zavqlaning.")
else:
    print("Iltimos, avval çipta sotib oling.")
```

```text
Xuş kelibsiz! Iltimos, kattalar bilan birga öltiring.
```

Baʼzan içma-iç yoziş eng tuşunarli yöl, lekin çuqur içma-içlikni öqiş qiyinlaşadi. Köpinça uni `elif` yoki keyingi darsdagi `and`/`or` yordamida tekislaş mumkin.

## Böş kiritişni tekşiriş

Böş satrlar yolğon hisoblangani uçun foydalanuvçi biror narsa yozgan-yozmaganini tekşiriş mumkin:

```python
name = ""   # tasavvur qiling: name = input("Ism: ").strip()

if name:
    print(f"Salom, {name}!")
else:
    print("Siz ism kiritmadingiz.")
```

```text
Siz ism kiritmadingiz.
```

`if name:` "agar ism böş bölmasa" deb öqiladi.

## Heç narsa qilmaslik: `pass`

Blok böş bölişi mumkin emas. Vaqtinçalik joy egallovçi kerak bölsa, heç narsa qilmaydigan `pass` ni yozing:

```python
stock = 10

if stock > 0:
    pass   # TODO: omborda bor mahsulotlarni keyinroq boşqaramiz
else:
    print("Omborda qolmagan")
```

## Şartli ifodalar (bir qatorli if)

Faqat **ikki qiymatdan birini** tanlaş kerak bölsa, ixçam şakl bor:

```text
rost_bölsa_qiymat if şart else yolğon_bölsa_qiymat
```

```python
count = 0
status = "Savat böş" if count == 0 else f"{count} ta mahsulot"
print(status)

temperature = -3
state = "muz" if temperature <= 0 else "suv"
print(state)
```

```text
Savat böş
muz
```

Buni faqat qisqa va oddiy tanlovlar uçun işlating. Uzunroq narsalar uçun oddiy `if`/`else` ni öqiş osonroq.

## Özingiz sinab köring

**input() uçun qiymatlar** maydoniga son kiriting, keyin dasturni işga tuşiring. `0`, `-5`, `7` va `12` ni sinab köring.

<ClientOnly><PythonPlayground :code='"number = int(input(\"Butun son kiriting: \"))\n\nif number > 0:\n    sign = \"musbat\"\nelif number < 0:\n    sign = \"manfiy\"\nelse:\n    sign = \"nol\"\n\nparity = \"juft\" if number % 2 == 0 else \"toq\"\n\nprint(f\"{number}: {sign} va {parity}.\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Ikki nuqta tuşib qolgan

```py
if age >= 18
    print("Voyaga yetgan")
```

```text
SyntaxError: expected ':'
```

### 2. Şartda `=` işlatiş

```py
if age = 18:
    print("Hozirgina 18 yoşga töldi")
```

```text
SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?
```

**Tuzatiş:** `if age == 18:`. Maslahatdagi `:=` - ifoda içida qiymat beradigan "morj" (walrus) operatori. Bu hozirça sizga kerak bölmagan ilğor vosita.

### 3. Notöğri çekiniş

```py
if age >= 18:
print("Voyaga yetgan")
```

```text
IndentationError: expected an indented block after 'if' statement on line 1
```

Teskari xatoga ham eʼtibor bering: blokka tegişli qatorni çekiniş bilan yoziş esdan çiqadi va u doim bajariladi.

```python
balance = 100
price = 500

if balance < price:
    print("Pul yetarli emas.")
print("Xarid amalga oşirildi!")   # else içida bölişi kerak edi, lekin har doim bajariladi
```

```text
Pul yetarli emas.
Xarid amalga oşirildi!
```

### 4. Kiritilgan qiymatni özgartirmasdan taqqoslaş

```python
guess = "7"   # input() dan kelgan
if guess == 7:
    print("Töğri!")
print("Tayyor")
```

```text
Tayyor
```

`"Töğri!"` hiç qaçon çop etilmaydi, çunki satr hiç qaçon songa teng bölmaydi. **Tuzatiş:** `int(guess) == 7`.

## Maşqlar

### 1. Juft yoki toq <Difficulty level="1" />

`number = 17` berilgan. `if`/`else` yordamida `17 toq` yoki `17 juft` deb çop eting.

::: details Yeçim
```python
number = 17

if number % 2 == 0:
    print(f"{number} juft")
else:
    print(f"{number} toq")
```
:::

### 2. Kattaroq son <Difficulty level="1" />

Ikki son `a` va `b` berilgan. Kattaroğini, agar ular teng bölsa `Ular teng` deb çop eting. (`max()` dan foydalanmang.)

::: details Yeçim
```python
a = 12
b = 30

if a > b:
    print(a)
elif b > a:
    print(b)
else:
    print("Ular teng")
```
:::

### 3. Çipta narxi <Difficulty level="2" />

Kinoteatr narxlari:

- 5 yoşgaça: bepul
- 5 dan 17 yoşgaça: 25,000 söm
- 18 dan 64 yoşgaça: 40,000 söm
- 65 va undan katta: 20,000 söm

`age` berilgan, narxni çop eting. 3, 5, 17, 18, 64 va 65 bilan sinab köring.

::: details Yeçim
```python
age = 17

if age < 5:
    price = 0
elif age < 18:
    price = 25000
elif age < 65:
    price = 40000
else:
    price = 20000

if price == 0:
    print("Bepul")
else:
    print(f"{price:,} söm")
```

Şartlar tartib bilan bajarilgani uçun `elif age < 18` ga yetib kelganda `age >= 5` ekani allaqaçon maʼlum, şuning uçun ikkala çegarani tekşiriş şart emas.
:::

### 4. Qolgan vaqt <Difficulty level="2" />

`minutes` berilgan. **Şartli ifoda** yordamida `minutes` 0 bölsa `Vaqt tugadi`, aks holda `25 daqiqa qoldi` kabi xabarni çop eting.

::: details Yeçim
```python
minutes = 25
message = "Vaqt tugadi" if minutes == 0 else f"{minutes} daqiqa qoldi"
print(message)
```
:::

### 5. Oddiy kalkulyator <Difficulty level="3" />

`input()` bilan ikki son va operatorni (`+`, `-`, `*` yoki `/`) öqing. Natijani çop eting. Ikki muammoni tuşunarli xabarlar bilan boşqaring: nolga böliş va notaniş operator.

::: details Yeçim
```python
a = float(input("Birinçi son: "))
operator = input("Operator (+ - * /): ").strip()
b = float(input("Ikkinçi son: "))

if operator == "+":
    print(f"{a} + {b} = {a + b}")
elif operator == "-":
    print(f"{a} - {b} = {a - b}")
elif operator == "*":
    print(f"{a} * {b} = {a * b}")
elif operator == "/":
    if b == 0:
        print("Xato: nolga bölib bölmaydi.")
    else:
        print(f"{a} / {b} = {a / b}")
else:
    print(f"Notaniş operator: {operator}")
```

Nolga böliş tekşiruvi `/` tarmoği içida **içma-iç** joylaşgan. *match operatori* darsida bunday menyuni yozişning boşqa usulini körasiz.
:::

## Xulosa

- `if şart:` çekiniş bilan yozilgan **blokini** faqat şart rost bölganda bajaradi.
- `else:` oldingi şartlarning heç biri mos kelmaganda bajariladi.
- `elif şart:` yana variantlar qöşadi. Python **faqat birinçi** rost tarmoqni bajaradi, şuning uçun tartib muhim.
- Bir-birini istisno qiladigan tanlovlar uçun bitta `if`/`elif`/`else` zanjirini, mustaqil tekşiruvlar uçun alohida `if` larni işlating.
- `if text:` matn böş emasligini tekşiradi. `pass` - böş joy egallovçi.
- `a if şart else b` bitta ifodada ikki qiymatdan birini tanlaydi.

## Qöşimça manbalar

- [Python Tutorial - `if` statements](https://docs.python.org/3/tutorial/controlflow.html#if-statements)
- [The `if` statement](https://docs.python.org/3/reference/compound_stmts.html#the-if-statement)
- [Conditional expressions](https://docs.python.org/3/reference/expressions.html#conditional-expressions)
