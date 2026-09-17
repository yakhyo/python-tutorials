---
title: Kiritiş va turlarni özgartiriş
description: "input() yordamida interaktiv dasturlar yarating, javoblarni tozalang va int(), float(), str() bilan satrlar, butun sonlar va önlik sonlar orasida özgartiring."
---

# Kiritiş va turlarni özgartiriş

![Rasm: Kiritiş va turlarni özgartiriş](/images/topics-webp-uzb/type-conversion-and-input.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `input()` yordamida foydalanuvçidan qanday maʼlumot söraş
- Nega `input()` doim **satr** qaytaradi
- `int()`, `float()` va `str()` bilan qiymatlarni qanday özgartiriş
- Özgartiriş muvaffaqiyatsiz bölsa nima böladi, jumladan `12,5` kabi önlik vergul bilan
- Matnli javoblarni qanday tozalaş va kiçik interaktiv dasturlarni qanday yaratiş
:::

## Nega bu muhim

Hozirgaça dasturlaringizdagi har bir qiymat töğridan-töğri kodga yozilgan edi. Haqiqiy dasturlar esa foydalanuvçilarga javob beradi: kalkulyatorga sonlar, viktorinaga javoblar, röyxatdan ötiş formasiga ism kerak. `input()` dasturingizga **söraş** imkonini beradi, turlarni özgartiriş esa javoblarni hisob-kitob qiliş mumkin bölgan maʼlumotga aylantiradi.

## Kiritişni söraş

`input()` xabarni (**taklif matni**, prompt) körsatadi, foydalanuvçi nimadir yozib, Enter ni bosişini kutadi va yozilgan narsani qaytaradi:

```python
name = input("Ismingiz nima? ")
print(f"Tanişganimdan xursandman, {name}!")
```

```text
Ismingiz nima? Aziza
Tanişganimdan xursandman, Aziza!
```

Taklif matnini böş joy bilan tugating, şunda foydalanuvçi yozgan matn savolingizga yopişib qolmaydi.

::: info Bu saytda input() ni işga tuşiriş
Brauzerdagi muharrirlarda klaviaturadan jonli kiritiş yöq. Javoblaringizni **oldindan** **input() uçun qiymatlar** oynasiga, har birini alohida qatorga yozing. Har bir `input()` çaqiriği navbatdagi qatordan foydalanadi.
:::

## `input()` doim satr qaytaradi

Foydalanuvçi son yozsa ham, siz **matn** olasiz:

```python
age = input("Neça yoşdasiz? ")
print(type(age))
```

```text
Neça yoşdasiz? 20
<class 'str'>
```

Matematik amal bajarmoqçi bölganingizda bu darhol muammoga aylanadi:

```py
age = input("Neça yoşdasiz? ")
print(age + 1)
```

```text
TypeError: can only concatenate str (not "int") to str
```

Baʼzan esa bundan ham yomoni böladi: xato çiqmaydi, faqat javob notöğri böladi:

```python
a = "5"
b = "3"
print(a + b)   # 8 emas, "53"
```

Yeçim - satrni songa **özgartiriş**.

## Turlarni özgartiriş

| Funksiya | Nimaga özgartiradi | Misol | Natija |
|---|---|---|---|
| `int()` | butun son | `int("42")` | `42` |
| `float()` | önlik son | `float("3.5")` | `3.5` |
| `str()` | satr | `str(42)` | `"42"` |

```python
age_text = "20"
age = int(age_text)

print(age + 1)
print(type(age))
```

```text
21
<class 'int'>
```

Odatda qiymat **darhol** özgartiriladi, buning uçun `input()` ni `int()` yoki `float()` içiga olasiz:

```python
age = int(input("Neça yoşdasiz? "))
print(f"Keyingi yil {age + 1} yoşga tölasiz.")
```

Python avval içkaridagi qismni bajaradi: `input()` satr qaytaradi, keyin `int()` uni özgartiradi.

### `int()` va `float()`

Doim butun bölgan narsalar (yoş, soni, yil) uçun `int()` dan, önlik qismi bölişi mumkin bölgan narsalar (narx, vazn, harorat) uçun esa `float()` dan foydalaning:

```python
weight = float(input("Vazn, kg: "))
height = float(input("Böy, metr: "))

bmi = weight / height ** 2
print(f"TVI: {bmi:.1f}")
```

### Boşqa özgartirişlar

```python
print(int(3.99))       # float → int önlik qismni qirqib taşlaydi (yuvaloqlamaydi)
print(round(3.99))     # yuvaloqlaş kerak bölsa, round() dan foydalaning
print(float(7))        # int → float
print(int("  42  "))   # atrofdagi böş joylar muammo emas
print(int("-15"))      # minus belgisi muammo emas
print(str(3.5) + "kg") # son → satr, matn bilan birlaştiriş uçun
```

```text
3
4
7.0
42
-15
3.5kg
```

## Özgartiriş muvaffaqiyatsiz bölganda

Agar matn kerakli turdagi songa öxşamasa, Python `ValueError` beradi:

```py
int("yigirma")
```

```text
ValueError: invalid literal for int() with base 10: 'yigirma'
```

Xabar "int() uçun 10 lik asosda notöğri literal" deydi. Baʼzi holatlar yangi boşlovçilarni hayron qoldiradi:

| Ifoda | Natija |
|---|---|
| `int("3.5")` | `ValueError`: `int()` matndagi önlik nuqtani qabul qilmaydi |
| `int(float("3.5"))` | `3`: avval float ga, keyin int ga özgartiring |
| `int("")` | `ValueError`: foydalanuvçi şunçaki Enter ni bosgan |
| `int("1,000")` | `ValueError`: vergullarga ruxsat yöq |
| `float("1e3")` | `1000.0`: ilmiy yozuv qabul qilinadi |
| `float("12,5")` | `ValueError`: önlik ajratgiç nuqta bölişi kerak |

Oxirgi qator Özbekiston va Yevropaning köp qismida muhim: u yerda odamlar önlik sonlarni köpinça vergul bilan yozadi. `float()` ning xato xabari `int()` nikidan biroz boşqaça:

```py
float("12,5")
```

```text
ValueError: could not convert string to float: '12,5'
```

Foydalanuvçilaringiz vergul yozişi mumkin bölsa, özgartirişdan oldin uni almaştiring:

```python
weight_text = "12,5"
weight = float(weight_text.replace(",", "."))
print(weight)
```

```text
12.5
```

Hozirça foydalanuvçilar töğri son yozadi deb hisoblang. **Xatolar va fayllar** bölimida bu xatolarni uşlaşni va qayta söraşni örganasiz.

## Matnli javoblarni tozalaş: `.strip()`

Foydalanuvçilar javobning oldiga yoki oxiriga köpinça ortiqça böş joy qöyib yuboradi. Siz uni körmaysiz, Python esa köradi va javob endi mos kelmaydi:

```python
city = input("Şahar: ")      # foydalanuvçi "  Samarqand " deb yozadi
print(city == "Samarqand")

city = city.strip()
print(city == "Samarqand")
```

```text
Şahar:   Samarqand 
False
True
```

Matnli javoblar uçun darhol `.strip()` ni çaqiriş, katta-kiçik harf muhim bölmasa esa `.lower()` yoki `.title()` ni ham ulab qöyiş yaxşi odat:

```python
city = input("Şahar: ").strip().title()   # foydalanuvçi "  samarqand " deb yozadi
print(f"{city} ga xuş kelibsiz!")
```

```text
Şahar:   samarqand 
Samarqand ga xuş kelibsiz!
```

## Hammasini birlaştiramiz

Kiçik, töliq interaktiv dastur:

```python
print("=== Çoy puli kalkulyatori ===")

bill = float(input("Hisob summasi: "))
tip_percent = int(input("Çoy puli foizi: "))
people = int(input("Odamlar soni: "))

tip = bill * tip_percent / 100
total = bill + tip
per_person = total / people

print(f"Çoy puli:   {tip:,.2f}")
print(f"Jami:       {total:,.2f}")
print(f"Bir kişiga: {per_person:,.2f}")
```

Uni `150000`, `10` va `4` qiymatlari bilan işga tuşiring:

```text
=== Çoy puli kalkulyatori ===
Hisob summasi: 150000
Çoy puli foizi: 10
Odamlar soni: 4
Çoy puli:   15,000.00
Jami:       165,000.00
Bir kişiga: 41,250.00
```

Bu dasturning tuzilişi juda keng tarqalgan: **kiritiş → özgartiriş → hisoblaş → natija**.

## Özingiz sinab köring

**input() uçun qiymatlar** oynasiga ikkita son yozing (har birini alohida qatorga), keyin dasturni işga tuşiring.

<ClientOnly><PythonPlayground :code='"first = float(input(\"Birinçi son: \"))\nsecond = float(input(\"Ikkinçi son: \"))\n\nprint(f\"{first} + {second} = {first + second}\")\nprint(f\"{first} x {second} = {first * second}\")\nprint(f\"Örtaça: {(first + second) / 2:.2f}\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Kiritilgan qiymatni özgartirmasdan hisoblaş

```python
price = input("Narx: ")   # foydalanuvçi 50 deb yozadi
print(price * 2)
```

```text
Narx: 50
5050
```

Xato yöq, şunçaki notögri javob: satrni `2` ga köpaytiriş satrni takrorlaydi. **Tuzatiş:** qiymatni öqiyotganda özgartiring: `price = float(input("Narx: "))`.

### 2. Önlik kiritiş uçun `int()` dan foydalaniş

```py
price = int(input("Narx: "))   # foydalanuvçi 12.5 deb yozadi
```

```text
ValueError: invalid literal for int() with base 10: '12.5'
```

**Tuzatiş:** qiymatning önlik qismi bölişi mumkin bölsa, `float()` dan foydalaning.

### 3. Önlik vergul yoziş

```py
weight = float(input("Vazn (kg): "))   # foydalanuvçi 12,5 deb yozadi
```

```text
ValueError: could not convert string to float: '12,5'
```

**Tuzatiş:** foydalanuvçilarga nuqta yozişni ayting yoki ikkalasini ham qabul qiling: `float(input("Vazn (kg): ").replace(",", "."))`.

### 4. Taklif matnida böş joyni unutiş

```python
name = input("Ism:")   # foydalanuvçi Aziza deb yozadi
```

```text
Ism:Aziza
```

Yozilgan matn taklif matniga yopişib qoladi. **Tuzatiş:** taklif matnini böş joy bilan tugating: `input("Ism: ")`.

## Maşqlar

### 1. Aks-sado <Difficulty level="1" />

Foydalanuvçidan sevimli taomini söring va `<taom> juda mazali!` ni çiqaring, taom nomi katta harflarda bölsin.

::: details Yeçim
```python
food = input("Sevimli taomingiz? ")
print(f"{food.upper()} juda mazali!")
```
:::

### 2. Tuğilgan yil <Difficulty level="1" />

Foydalanuvçidan yoşini söring va u tuğilgan yilni çiqaring. Joriy yil `2026` va uning bu yilgi tuğilgan kuni allaqaçon ötgan deb hisoblang.

::: details Yeçim
```python
age = int(input("Yoşingiz: "))
print(f"Siz {2026 - age}-yilda tuğilgansiz.")
```
:::

### 3. Birlik özgartirgiç <Difficulty level="2" />

Kilometrdagi masofani söring (unda önlik qism bölişi mumkin) va uni 2 xonali qilib milda çiqaring. 1 km = 0.621371 mil.

::: details Yeçim
```python
km = float(input("Kilometr: "))
miles = km * 0.621371
print(f"{km} km = {miles:.2f} mil")
```
:::

### 4. Natijani taxmin qiling <Difficulty level="2" />

Işga tuşirmasdan ayting: har bir qator nima çiqaradi? Ulardan biri xato beradi: qaysi biri va nega?

```py
print(int("8") + 2)
print("8" + str(2))
print(int(9.9))
print(float("2") * 3)
print(int("9.9"))
```

::: details Yeçim
1. `10`
2. `82`: satrlar birlaştiriladi
3. `9`: `int()` önlik qismni qirqib taşlaydi
4. `6.0`
5. `ValueError`: `int()` önlik nuqtali satrni özgartira olmaydi. Uning örniga `int(float("9.9"))` dan foydalaning.
:::

### 5. Qança vaqt qoldi <Difficulty level="3" />

Daqiqalar sonini (butun son) söring va uni kun, soat va daqiqa qilib çiqaring, masalan, `1565` uçun `1 kun, 2 soat, 5 daqiqa`.

::: details Yeçim
```python
total = int(input("Daqiqalar: "))

days = total // (24 * 60)
remaining = total % (24 * 60)
hours = remaining // 60
minutes = remaining % 60

print(f"{days} kun, {hours} soat, {minutes} daqiqa")
```

Bu yerda `input`, `int`, `//`, `%` va f-satrlar birga işlatilgan. Keyingi bölimda `if` yordamida "0 kun" kabi keraksiz qismlarni yaşirişni örganasiz.
:::

## Xulosa

- `input("prompt ")` foydalanuvçini kutadi va u yozgan narsani **satr sifatida** qaytaradi.
- `int()`, `float()` va `str()` bilan özgartiring. Darhol özgartiring: `int(input(...))`.
- `int(3.9)` önlik qismni qirqib taşlaydi. Yuvaloqlaş uçun `round()` dan foydalaning.
- `int("3.5")`, `int("abc")` yoki `float("12,5")` kabi notöğri matn `ValueError` beradi. Önlik vergul uçun `.replace(",", ".")`, matnli javoblar uçun esa `.strip()` dan foydalaning.
- Keng tarqalgan dastur tuzilişi: **kiritiş → özgartiriş → hisoblaş → natija**.

## Qöşimça manbalar

- [Built-in functions - `input()`](https://docs.python.org/3/library/functions.html#input)
- [Built-in functions - `int()`](https://docs.python.org/3/library/functions.html#int) and [`float()`](https://docs.python.org/3/library/functions.html#float)
