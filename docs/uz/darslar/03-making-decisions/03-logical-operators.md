---
title: Mantiqiy operatorlar
description: "Şartlarni and, or va not bilan birlaştiring: rostlik jadvallari, bajariliş tartibi, qisqa tutaşuvli hisoblaş, keng tarqalgan tuzoqlar va murakkab şartlarni soddalaştiriş."
---

# Mantiqiy operatorlar

![Rasm: Mantiqiy operatorlar](/images/topics-webp-uzb/logical-operators.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Şartlarni `and` va `or` bilan birlaştiriş
- Şartni `not` bilan teskarisiga aylantiriş
- `not`, `and` va `or` qaysi tartibda hisoblanadi
- **Qisqa tutaşuvli** (short-circuit) hisoblaş va u qanday qilib xatolarning oldini oladi
- `in` va `not in` "bu şulardan birimi?" ni qanday tekşiradi va ular maşhur `x == "a" or "b"` tuzoğidan qanday qutqaradi
:::

## Nega bu muhim

Haqiqiy qarorlar kamdan-kam hollarda faqat bitta narsaga boğliq böladi. *Agar 21 yoşdan katta bölsangiz **va** haydovçilik guvohnomangiz bölsa, maşina ijaraga olişingiz mumkin. Dökon şanba **yoki** yakşanba kuni yopiq. Agar foydalanuvçi tizimga kirmagan bölsa (**not**), kiriş formasini körsating.* Mantiqiy operatorlar `if` içiga `if` joylamasdan, bunday şartlarni töğridan-töğri ifodalaş imkonini beradi.

## `and`: ikkalasi ham rost bölişi kerak

```python
age = 25
has_license = True

if age >= 21 and has_license:
    print("Siz maşina ijaraga olişingiz mumkin.")
else:
    print("Keçirasiz, maşina ijaraga ololmaysiz.")
```

```text
Siz maşina ijaraga olişingiz mumkin.
```

`a and b` faqat `a` ham, `b` ham **ikkalasi** rost bölganda `True` böladi:

| `a` | `b` | `a and b` |
|---|---|---|
| `True` | `True` | `True` |
| `True` | `False` | `False` |
| `False` | `True` | `False` |
| `False` | `False` | `False` |

## `or`: kamida bittasi rost bölişi kerak

```python
day = "yakşanba"

if day == "şanba" or day == "yakşanba":
    print("Dam oliş kuni!")
```

```text
Dam oliş kuni!
```

`a or b` ulardan **kamida bittasi** rost bölganda `True` böladi:

| `a` | `b` | `a or b` |
|---|---|---|
| `True` | `True` | `True` |
| `True` | `False` | `True` |
| `False` | `True` | `True` |
| `False` | `False` | `False` |

## `not`: teskarisiga aylantiriş

`not` `True` ni `False` ga, `False` ni esa `True` ga aylantiradi:

```python
is_logged_in = False

if not is_logged_in:
    print("Iltimos, tizimga kiring.")
```

```text
Iltimos, tizimga kiring.
```

`not` rost va yolğon hisoblanadigan qiymatlar bilan yaxşi öqiladi: `if not email:` "agar email böş bölsa" degani. Taqqoslaşlarda töğridan-töğri operatorni afzal köring: `not x == 5` örniga `x != 5`, `not "a" in text` örniga `"a" not in text` deb yozing.

## Bir neça operatorni birlaştiriş

### Ustuvorlik: avval `not`, keyin `and`, keyin `or`

Matematikada `*` `+` dan oldin bajarilgani kabi, Python avval `not` ni, keyin `and` ni, keyin `or` ni hisoblaydi. Barça taqqoslaşlar (`==`, `<`, …) ulardan oldin bajariladi.

```python
is_member = False
total = 120000
has_coupon = True

# and birinçi bajariladi: is_member or (total > 100000 and has_coupon)
if is_member or total > 100000 and has_coupon:
    print("Çegirma qöllanildi")
```

```text
Çegirma qöllanildi
```

Bu yerda natija töğri, lekin uni notöğri tuşunib qoliş oson. `a or b and c` doim `a or (b and c)` degani. `(a or b) and c` ni nazarda tutgan bölsangiz, qavslarni yozişingiz şart. `and` va `or` ni aralaştirganda, hatto talab qilinmasa ham, **qavslardan foydalaning**: `is_member or (total > 100000 and has_coupon)`.

### Oraliqlar: zanjir va `and`

`hour >= 9 and hour < 18` - *Mantiqiy qiymatlar va taqqoslaş* darsidagi zanjirli `9 <= hour < 18` bilan bir xil. "Oraliqdan taşqarida" degan şart uçun `or` ni işlating:

```python
hour = 22
if hour < 9 or hour >= 18:
    print("Ofis yopiq.")
```

## `in` va `not in`: bu şulardan birimi?

`in` ni satrlar bilan matn bölagini qidiriş uçun işlatgansiz. U qiymat qavs içida yozilgan guruhdagi qiymatlardan biri ekanini ham tekşiradi:

```python
print("kent" in "Toşkent")
print("K" in "Toşkent")          # harf registri muhim

city = "Samarqand"
print(city in ("Toşkent", "Samarqand", "Buxoro"))
print(city not in ("Toşkent", "Buxoro"))
```

```text
True
False
True
True
```

`city in ("Toşkent", "Samarqand")` `city == "Toşkent" or city == "Samarqand"` bilan bir maʼnoda, `not in` esa uning teskarisi. `("Toşkent", "Samarqand", "Buxoro")` - bu *kortej (tuple)*, özgarmas qiymatlar guruhi. U haqida *Kortejlar va qiymatlarni ajratiş* darsida örganasiz. Hozirça `x in (a, b, c)` "x bulardan biri" deyişning qulay usuli.

## `or` tuzoği

Bu töğriga öxşaydi, lekin notöğri:

```python
color = "yaşil"

if color == "qizil" or "kök":
    print("Asosiy rang!")   # ISTALGAN rang uçun çop etiladi
```

```text
Asosiy rang!
```

Python buni `(color == "qizil") or ("kök")` deb öqiydi. Ikkinçi qism şunçaki `"kök"` satri, u esa **rost** hisoblanadi, şuning uçun butun şart doim rost böladi.

**Tuzatiş:** taqqoslaşni ikkala tomonda takrorlang yoki, yaxşisi, `in` dan foydalaning:

```python
color = "yaşil"

if color == "qizil" or color == "kök":
    print("Asosiy rang!")

if color in ("qizil", "kök"):        # tozaroq
    print("Asosiy rang!")
```

`"yaşil"` uçun heç biri çop etmaydi.

## Qisqa tutaşuvli hisoblaş

Python javobni bilişi bilanoq hisoblaşni töxtatadi:

- `a and b`: agar `a` yolğon bölsa, natija `a` ning özi va **`b` hisoblanmaydi**.
- `a or b`: agar `a` rost bölsa, natija `a` ning özi va **`b` hisoblanmaydi**.

Bu xavfsizlik tekşiruvini **birinçi** qöyib, xatolardan himoyalaniş imkonini beradi:

```python
count = 0
total = 50

if count != 0 and total / count > 10:
    print("Örtaça yuqori")
else:
    print("Maʼlumot yöq yoki örtaça past")
```

```text
Maʼlumot yöq yoki örtaça past
```

`count != 0` `False` bölgani uçun Python `total / count` ni umuman bajarmaydi, şuning uçun `ZeroDivisionError` yuz bermaydi. Ikki tomonni almaştirsangiz, dastur xato bilan töxtaydi.

## `and` va `or` faqat mantiqiy qiymat emas, qiymat qaytaradi

Aniqroq aytganda, `and` va `or` **öz operandlaridan birini** qaytaradi:

- `a or b` agar `a` rost bölsa `a` ni, aks holda `b` ni qaytaradi.
- `a and b` agar `a` yolğon bölsa `a` ni, aks holda `b` ni qaytaradi.

Bu **standart qiymatlar** uçun qulay usul beradi:

```python
name = ""   # tasavvur qiling: input("Ism (ixtiyoriy): ").strip()

display_name = name or "Mehmon"
print(f"Xuş kelibsiz, {display_name}!")
```

```text
Xuş kelibsiz, Mehmon!
```

Agar `name` böş satr bölsa (yolğon), `"Mehmon"` olinadi. Lekin sonlar bilan ehtiyot böling: `0 or 10` natijasi `10`, hatto `0` ham yaroqli qiymat bölgan taqdirda ham.

## Şartlarni soddalaştiriş

Baʼzi özgartirişlar şartlarni öqişni osonlaştiradi. Quyidagi ikki juftlik doim teng kuçli (**De Morgan qonunlari**):

| Bu | quyidagiga teng |
|---|---|
| `not (a and b)` | `not a or not b` |
| `not (a or b)` | `not a and not b` |

```python
is_weekend = False
is_holiday = False

# Yomon: öqiş qiyin
if not (is_weekend or is_holiday):
    print("Iş kuni")

# Yaxşi: mantiq xuddi şu, lekin tabiiy öqiladi
if not is_weekend and not is_holiday:
    print("Iş kuni")
```

Yana, mantiqiy qiymatlarni `True` bilan taqqoslamang. `if is_valid == True:` örniga `if is_valid:`, `if is_valid == False:` örniga `if not is_valid:` deb yozing.

Uzun şart qismlariga nom beriş ham yordam beradi:

```python
age = 30
income = 9_000_000
has_debt = False

is_adult = age >= 18
earns_enough = income >= 5_000_000

if is_adult and earns_enough and not has_debt:
    print("Kredit oldindan maʼqullandi")
```

## Özingiz sinab köring

Turli qiymatlarni sinab köring va kirişga ruxsat beriliş-berilmasligini taxmin qiling.

<ClientOnly><PythonPlayground :code='"username = \"admin\"\npassword = \"python2026\"\nis_blocked = False\n\ncorrect = username == \"admin\" and password == \"python2026\"\n\nif is_blocked:\n    print(\"Hisob bloklangan.\")\nelif correct:\n    print(\"Kirişga ruxsat berildi.\")\nelse:\n    print(\"Login yoki parol notöğri.\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `x == a or b`

```python
answer = "yöq"

if answer == "ha" or "h":
    print("Siz rozi böldingiz!")
```

```text
Siz rozi böldingiz!
```

Yakka `"h"` rost hisoblanadi, şuning uçun şart doim rost. **Tuzatiş:** `if answer in ("ha", "h"):`.

### 2. `or` kerak bölganda `and` yoziş

```python
day = "şanba"
if day == "şanba" and day == "yakşanba":   # ikkalasi bir vaqtda bölişi mumkin emas!
    print("Dam oliş kuni")
else:
    print("Iş kuni")
```

```text
Iş kuni
```

Özgaruvçi bir vaqtning özida ikki xil qiymatga teng böla olmaydi. **Tuzatiş:** `or`.

### 3. Himoya tekşiruvi notöğri tomonda

```py
count = 0
total = 50

if total / count > 10 and count != 0:
    print("Örtaça yuqori")
```

```text
ZeroDivisionError: division by zero
```

Böliş tekşiruv uni töxtatişga ulgurmasidan oldin bajariladi. **Tuzatiş:** `if count != 0 and total / count > 10:`.

### 4. `&&`, `||` yoki `!` işlatiş

```py
age = 20
has_ticket = True

if age >= 18 && has_ticket:
    print("Xuş kelibsiz")
```

```text
    if age >= 18 && has_ticket:
                  ^
SyntaxError: invalid syntax
```

Boşqa tillarda şu belgilar işlatiladi. Pythonda esa ular söz bilan yoziladi: `and`, `or`, `not`. (`!` alohida mavjud emas, lekin `!=` bor.)

## Maşqlar

### 1. Rostlik jadvalini tekşiring <Difficulty level="1" />

Har bir natijani taxmin qiling:

```python
print(True and not False)
print(False or not True)
print(not (3 > 2 and 2 > 1))
print(5 > 3 or 1 / 0 > 0)
```

::: details Yeçim
```text
True
False
False
True
```

Oxirgi qator xato bermaydi: `5 > 3` `True`, şuning uçun `or` `1 / 0` ni heç qaçon hisoblamaydi.
:::

### 2. Muzeyga bepul kiriş <Difficulty level="1" />

Muzeyga 7 yoşgaça bolalar va 65 yoş va undan kattalar bepul kiradi. Talabalar ham bepul kiradi, lekin dam oliş kunlari emas. `age`, `is_student` va `is_weekend` berilgan; `Bepul kiriş` yoki `Iltimos, çipta oling` deb çop eting. 20 yoşli talaba iş kunida (bepul) va dam oliş kunida (çipta), hamda 70 yoşli kişi dam oliş kunida (bepul) bilan sinab köring.

::: details Yeçim
```python
age = 20
is_student = True
is_weekend = False

is_free = age < 7 or age >= 65 or (is_student and not is_weekend)

if is_free:
    print("Bepul kiriş")
else:
    print("Iltimos, çipta oling")
```

```text
Bepul kiriş
```

Qavslar şart emas (`and` `or` dan oldin bajariladi), lekin ular qaysi qismlar birga ekanini körsatib turadi.
:::

### 3. Kabisa yili <Difficulty level="2" />

Yil 4 ga bölinsa, u **kabisa yili** hisoblanadi, **bundan mustasno** 100 ga bölinadigan yillar: ular faqat 400 ga ham bölinsa kabisa yili böladi. `year` berilgan, u kabisa yili yoki yöqligini çop eting. 2024 (ha), 1900 (yöq), 2000 (ha) va 2026 (yöq) bilan sinab köring.

::: details Yeçim
```python
year = 1900

is_leap = (year % 4 == 0 and year % 100 != 0) or year % 400 == 0

if is_leap:
    print(f"{year} kabisa yili")
else:
    print(f"{year} kabisa yili emas")
```
:::

### 4. Xatoni tuzating <Difficulty level="2" />

Bu dastur `Yaroqli javob` ni faqat `"h"`, `"ha"`, `"y"` yoki `"yöq"` uçun (istalgan harf registrida) çop etişi kerak. Hozir esa u hamma narsa uçun `Yaroqli javob` deb çop etadi. Uni tuzating.

```python
answer = "balki"

if answer.lower() == "h" or "ha" or "y" or "yöq":
    print("Yaroqli javob")
else:
    print("Iltimos, ha yoki yöq deb javob bering")
```

::: details Yeçim
```python
answer = "balki"

if answer.lower() in ("h", "ha", "y", "yöq"):
    print("Yaroqli javob")
else:
    print("Iltimos, ha yoki yöq deb javob bering")
```
:::

### 5. Parol qoidalari <Difficulty level="3" />

Parol quyidagilarning **hammasi** bajarilganda yaroqli hisoblanadi:

- uzunligi kamida 8 ta belgi,
- faqat harflardan iborat emas (kamida bitta harf bölmagan belgi bor),
- faqat raqamlardan iborat emas,
- istalgan harf registrida `"parol"` sözini öz içiga olmaydi.

`password` berilgan. `Kuçli` yoki u buzgan **birinçi** qoidani tuşuntiradigan xabarni çop eting. `"abc"`, `"abcdefgh"`, `"12345678"`, `"meningParolim1"` va `"çoy4ikki!"` bilan sinab köring.

::: details Yeçim
```python
password = "çoy4ikki!"

if len(password) < 8:
    print("Juda qisqa: kamida 8 ta belgi işlating.")
elif password.isalpha():
    print("Kamida bitta raqam yoki belgi qöşing.")
elif password.isdigit():
    print("Faqat raqamlardan foydalanmang.")
elif "parol" in password.lower():
    print("'parol' sözini işlatmang.")
else:
    print("Kuçli")
```

`elif` zanjiri birinçi buzilgan qoidada töxtaydi, şuning uçun har bir xabar birinçi muammoga mos keladi.
:::

## Xulosa

- `and` uçun ikkala tomon ham rost bölişi, `or` uçun kamida bittasi rost bölişi kerak, `not` esa qiymatni teskarisiga aylantiradi.
- Ustuvorlik: `not` → `and` → `or`. Ularni aralaştirganda qavslardan foydalaning.
- `x in ("a", "b")` "bu şulardan birimi?" deb söraydi. `x == "a" or "b"` doim rost.
- **Qisqa tutaşuv:** `and` birinçi yolğon qiymatda, `or` esa birinçi rost qiymatda töxtaydi, şuning uçun xavfsizlik tekşiruvlarini birinçi qöying.
- `value or default` böş qiymatlar uçun zaxira qiymat beradi.
- Şartlarni nomlangan mantiqiy özgaruvçilar, De Morgan qonunlari va `if flag == True:` örniga `if flag:` yordamida soddalaştiring.

## Qöşimça manbalar

- [Boolean operations](https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not)
- [Operator precedence](https://docs.python.org/3/reference/expressions.html#operator-precedence)
- [Membership tests (`in`, `not in`)](https://docs.python.org/3/reference/expressions.html#membership-test-operations)
