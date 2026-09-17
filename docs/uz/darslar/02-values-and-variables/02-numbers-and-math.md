---
title: Sonlar va matematika
description: "Butun va önlik sonlar bilan işlaş: arifmetik operatorlar, butun böliş va qoldiq, amallar tartibi, yuvaloqlaş va nega 0.1 + 0.2 aniq 0.3 emas."
---

# Sonlar va matematika

![Rasm: Sonlar va matematika](/images/topics-webp-uzb/numbers-and-math.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Ikki asosiy son turi: `int` va `float`
- Barça arifmetik operatorlar, jumladan `//`, `%` va `**`
- Python qanday tartibda hisoblaydi (amallar ustuvorligi)
- Yuvaloqlaş va bir neçta foydali içki funksiya
- Nega önlik sonlar baʼzan biroz noaniq çiqadi va bunda nima qiliş kerak
:::

## Nega bu muhim

Narxlar, masofalar, oçkolar, vaqt, foizlar: aksariyat dasturlar nimanidir hisoblaydi. Python juda yaxşi kalkulyator, lekin töğri natija oliş uçun bilişingiz kerak bölgan bir neçta qoidasi (va kutilmagan jihatlari) bor.

## Sonlarning ikki turi

```python
students = 32        # int: butun son
height = 1.75        # float: önlik nuqtali son

print(type(students))
print(type(height))
```

```text
<class 'int'>
<class 'float'>
```

- **`int`** (butun son, integer): `0`, `42`, `-7` kabi sonlar. Pythonda ularning ölçamiga çegara yöq, şuning uçun `2 ** 100` bemalol işlaydi.
- **`float`** (önlik son, float): `3.14`, `-0.5` yoki `2.0` kabi önlik nuqtali sonlar. Eʼtibor bering: `2.0` butun qiymat bölsa ham, float hisoblanadi.

Öqiş oson bölişi uçun uzun sonlar içiga pastki çiziq qöyişingiz mumkin. Python ularni eʼtiborsiz qoldiradi:

```python
population = 37_000_000
print(population)
```

```text
37000000
```

Juda katta yoki juda kiçik önlik sonlarni **ilmiy körinişda** yoziş mumkin: `e` "10 ning darajasiga köpaytiriş" degani. Python juda kiçik önlik sonlarni özi ham şunday çop etadi:

```python
speed_of_light = 3e8     # sekundiga 3 × 10⁸ metr
grain = 2.5e-3           # 0,0025 gramm
print(speed_of_light, grain)
print(0.00001)
```

```text
300000000.0 0.0025
1e-05
```

`e` bilan yozilgan son har doim float, hatto `3e8` ham.

## Arifmetik operatorlar

| Operator | Maʼnosi | Misol | Natija |
|---|---|---|---|
| `+` | Qöşiş | `7 + 2` | `9` |
| `-` | Ayiriş | `7 - 2` | `5` |
| `*` | Köpaytiriş | `7 * 2` | `14` |
| `/` | Böliş | `7 / 2` | `3.5` |
| `//` | Butun böliş | `7 // 2` | `3` |
| `%` | Qoldiq (modul) | `7 % 2` | `1` |
| `**` | Darajaga oşiriş | `7 ** 2` | `49` |

```python
print(7 + 2, 7 - 2, 7 * 2)
print(7 / 2, 7 // 2, 7 % 2)
print(2 ** 10)
```

```text
9 5 14
3.5 3 1
1024
```

### `/` doim float qaytaradi

Oddiy böliş natija butun bölsa ham doim float qaytaradi:

```python
print(10 / 2)
```

```text
5.0
```

### `//` va `%`: butun qism va qoldiq

`//` bir son boşqasining içiga **neça marta butunlay** siğişini beradi. `%` esa **nima ortib qolişini** beradi. Bu juda foydali juftlik:

```python
total_minutes = 135

hours = total_minutes // 60     # 2 ta töliq soat
minutes = total_minutes % 60    # 15 daqiqa ortib qoladi

print(hours, "soat", minutes, "daqiqa")
```

```text
2 soat 15 daqiqa
```

Float bilan `//` baribir pastga yuvaloqlaydi, lekin natija float böladi: `7.5 // 2` bu `3.0`, `7.5 % 2` esa `1.5`.

Ikkala javob ham kerak bölganda `divmod()` ularni bir qadamda beradi. U ikkita qiymat qaytaradi, ularni birdaniga ikkita özgaruvçiga saqlaş mumkin:

```python
hours, minutes = divmod(135, 60)
print(hours, "soat", minutes, "daqiqa")
```

```text
2 soat 15 daqiqa
```

`%` ning keng tarqalgan qöllanilişi:

- **Juft yoki toq:** juft sonlar uçun `n % 2` `0` ga, toq sonlar uçun `1` ga teng.
- **Oxirgi raqam:** `n % 10` musbat butun sonning oxirgi raqamini beradi.
- **Aylanib qaytiş:** `(hour + 5) % 24` soatni 0 va 23 oraliğida saqlaydi.

```python
print(14 % 2)      # 0 → juft
print(15 % 2)      # 1 → toq
print(2026 % 10)   # 6 → oxirgi raqam
print((22 + 5) % 24)  # 3 → 22:00 dan 5 soat keyin 03:00 böladi
```

::: details `//` va `%` manfiy sonlar bilan
`//` nolga qarab emas, **pastga** (manfiy çeksizlikka qarab) yuvaloqlaydi: `-7 // 2` `-3` emas, `-4` ga teng. Keyin `-7 % 2` `1` ga teng, çunki `-4 * 2 + 1 == -7`. Bu sizga kamdan-kam kerak böladi, lekin kutilmagan natijalarni tuşuntiradi.
:::

## int va float ni aralaştiriş

Agar amalda `int` va `float` aralaş kelsa, natija `float` böladi:

```python
print(3 + 0.5)
print(2 * 1.5)
```

```text
3.5
3.0
```

## Amallar tartibi

Python odatiy matematika qoidalariga amal qiladi. Eng yuqori ustuvorlikdan eng pastigaça:

1. `( )` qavslar
2. `**` darajaga oşiriş
3. `-x` manfiy işora
4. `*`, `/`, `//`, `%` (çapdan öngga)
5. `+`, `-` (çapdan öngga)

```python
print(2 + 3 * 4)      # avval köpaytiriş
print((2 + 3) * 4)    # avval qavslar
print(-2 ** 2)        # daraja manfiy işoradan oldin
print((-2) ** 2)
```

```text
14
20
-4
4
```

**Ikkilansangiz, qavs qöying.** Qavslar niyatingizni ham Pythonga, ham odamlarga aniq körsatadi:

```python
price = 80000
discount_percent = 15
final_price = price - (price * discount_percent / 100)
print(final_price)
```

```text
68000.0
```

## Sonlarni yangilaş

*Özgaruvçilar* darsidagi qisqa yozuvli operatorlar barça arifmetik operatorlar bilan işlaydi:

```python
balance = 1000
balance += 250    # 1250
balance -= 100    # 1150
balance *= 2      # 2300
balance //= 3     # 766
print(balance)
```

## Foydali içki funksiyalar

```python
print(abs(-12))            # mutlaq qiymat
print(round(3.14159, 2))   # verguldan keyin 2 xonagaça yuvaloqlaş
print(round(7.6))          # eng yaqin butun songa yuvaloqlaş → int
print(max(4, 9, 2))        # eng kattasi
print(min(4, 9, 2))        # eng kiçigi
print(pow(2, 5))           # 2 ** 5 bilan bir xil
```

```text
12
3.14
8
9
2
32
```

::: info `round()` yarimlarni qanday yuvaloqlaydi
`round(2.5)` `2` ni, `round(3.5)` esa `4` ni beradi. Python aniq yarimlarni eng yaqin **juft** songa yuvaloqlaydi ("bankirlar usuli"). Bu köp qiymatlarni yuvaloqlaganda bir tomonga oğib ketişning oldini oladi. Bu köpçilikni hayron qoldiradi, şuning uçun natija bittaga farq qilganday tuyulsa, buni eslang.

Float lar yana bir kutilmagan holat qöşadi: `round(2.675, 2)` `2.68` emas, `2.67` beradi. Bu bankirlar usuli emas. `2.675` ikkilik son sifatida 2.675 dan biroz **kiçik** qilib saqlanadi (bu haqda quyidagi *Önlik sonlar mutlaqo aniq emas* bölimida). Pul va ölçovlarni körsatiş uçun odatiy vosita - tez orada örganadigan f-satr formatlaşi.
:::

### `math` moduli

Köproq matematika uçun Pythonda `math` moduli bor. Modullarni keyinroq örganasiz. Hozirça faqat şuni biling: `import math` quyidagilardan foydalaniş imkonini beradi:

```python
import math

print(math.sqrt(49))    # kvadrat ildiz
print(math.pi)          # π
print(math.floor(4.7))  # pastga yuvaloqlaş
print(math.ceil(4.2))   # yuqoriga yuvaloqlaş
```

```text
7.0
3.141592653589793
4
5
```

## Önlik sonlar mutlaqo aniq emas

Buni sinab köring:

```python
print(0.1 + 0.2)
```

```text
0.30000000000000004
```

Bu Pythondagi xato emas. Kompyuterlar önlik sonlarni **ikkilik** (2 lik) sanoq tizimida saqlaydi. `0.1` kabi baʼzi oddiy önlik sonlarni ikkilik tizimda aniq saqlab bölmaydi, xuddi `1/3` ni önlik ravişda aniq yozib bölmagani kabi (`0.3333…`). Deyarli barça dasturlaş tillari şunday işlaydi.

Bunda nima qiliş kerak:

- Natijalarni **körsatiş** uçun ularni yuvaloqlang: `round(0.1 + 0.2, 2)` `0.3` ni beradi. Sonlarni f-satrlar bilan formatlaşni ham örganasiz.
- Önlik sonlarni **soliştirişda** aniq tenglikni tekşirmang. `math.isclose()` dan foydalaning (*Mantiqiy qiymatlar va taqqoslaş* darsida körib çiqiladi).
- **Pul** bilan işlaganda, iloji bölsa, butun birliklarda işlang, masalan, tiyin yoki sentlarni `int` sifatida saqlang. Pythonda aniq önlik hisob-kitoblar uçun `decimal` moduli ham bor.

## Özingiz sinab köring

Soniyalar sonini soat, daqiqa va soniyaga aylantiring. `3725` ni, keyin `86399` ni sinab köring.

<ClientOnly><PythonPlayground :code='"total_seconds = 3725\n\nhours = total_seconds // 3600\nremaining = total_seconds % 3600\nminutes = remaining // 60\nseconds = remaining % 60\n\nprint(hours, \"soat\", minutes, \"daqiqa\", seconds, \"soniya\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Nolga böliş

```py
print(10 / 0)
```

```text
ZeroDivisionError: division by zero
```

Xabar "nolga böliş" deydi. `//` va `%` ham xuddi şu xatoni beradi. Buni keyingi bölimda `if` bilan tekşirişni örganasiz.

### 2. Darajaga oşiriş uçun `^` ni işlatiş

```python
print(2 ^ 3)    # 8 emas, 1!
print(2 ** 3)   # 8
```

Pythonda `^` "darajaga oşiriş" emas, *bitli* operator. `**` dan foydalaning.

### 3. `*` ni tuşirib qoldiriş

```py
width = 4
area = 2width
```

```text
SyntaxError: invalid decimal literal
```

Matematikada `2x` deb yoziş mumkin, lekin Pythonga operator kerak: `2 * width`.

### 4. Amallar ustuvorligini unutiş

```python
average = 80 + 90 / 2
print(average)   # 85.0 emas, 125.0
```

Böliş qöşişdan oldin bajariladi. **Tuzatiş:** `(80 + 90) / 2`.

## Maşqlar

### 1. Törtburçak <Difficulty level="1" />

Xonaning eni 4.5 m, uzunligi 6 m. Uning **yuzasini** (en × uzunlik) va **perimetrini** (2 × (en + uzunlik)) çiqaring.

::: details Yeçim
```python
width = 4.5
length = 6

area = width * length
perimeter = 2 * (width + length)

print("Yuza:", area)
print("Perimetr:", perimeter)
```

```text
Yuza: 27.0
Perimetr: 21.0
```
:::

### 2. Harorat <Difficulty level="1" />

`F = C × 9 / 5 + 32` formulasi yordamida `36.6` °C ni Farengeytga aylantiring va natijani verguldan keyin bir xonagaça yuvaloqlab çiqaring.

::: details Yeçim
```python
celsius = 36.6
fahrenheit = celsius * 9 / 5 + 32
print(round(fahrenheit, 1))
```

```text
97.9
```
:::

### 3. Somsalarni böliş <Difficulty level="2" />

50 ta somsa va 7 ta döst bor. Har bir döst bir xil butun sondagi somsa oladi. Har bir döst neçtadan olişini va neçta ortib qolişini çiqaring.

::: details Yeçim
```python
samsas = 50
friends = 7

each = samsas // friends
left_over = samsas % friends

print("Har bir döst oladi:", each)
print("Ortib qoldi:", left_over)
```

```text
Har bir döst oladi: 7
Ortib qoldi: 1
```
:::

### 4. Raqamlar yiğindisi <Difficulty level="2" />

`number = 472` kabi uç xonali son uçun har bir raqamni olişda `//` va `%` dan foydalaning (satrlarsiz) va raqamlar yiğindisini çiqaring (`4 + 7 + 2 = 13`).

::: details Yeçim
```python
number = 472

hundreds = number // 100          # 4
tens = (number // 10) % 10        # 7
ones = number % 10                # 2

print(hundreds + tens + ones)
```

`number // 10` oxirgi raqamni olib taşlaydi (`47`), keyin `% 10` yangi oxirgi raqamni oladi (`7`).
:::

### 5. Kredit tölovi <Difficulty level="3" />

Siz `P = 12_000_000` söm qarzni oylik `r = 0.02` foiz stavkasi bilan `n = 12` oyga oldingiz. Qatʼiy oylik tölov quyidagiça hisoblanadi:

```text
payment = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)
```

Tölovni hisoblang va uni eng yaqin sömgaça yuvaloqlab çiqaring. Keyin bir yil davomida jami qança qaytarişingizni çiqaring.

::: details Yeçim
```python
principal = 12_000_000
rate = 0.02
months = 12

growth = (1 + rate) ** months
payment = principal * rate * growth / (growth - 1)

print("Oylik tölov:", round(payment))
print("Jami tölangan:", round(payment * months))
```

```text
Oylik tölov: 1134715
Jami tölangan: 13616582
```

`(1 + rate) ** months` ni alohida özgaruvçida saqlaş uni ikki marta hisoblaşdan qutqaradi va formulani öqişni osonlaştiradi.
:::

## Xulosa

- `int` butun sonlar, `float` esa önlik sonlar uçun. Ularni aralaştirsangiz, float hosil böladi.
- Operatorlar: `+ - * /`, hamda `//` (butun böliş), `%` (qoldiq) va `**` (daraja). `/` doim float qaytaradi.
- Ustuvorlik: qavslar → `**` → unar `-` → `* / // %` → `+ -`. Aniqlik uçun qavslardan foydalaning.
- Foydali funksiyalar: `abs`, `round`, `min`, `max`, hamda `math.sqrt`, `math.floor`, `math.ceil`.
- Önlik sonlar taxminiy (`0.1 + 0.2`), şuning uçun körsatişda natijalarni yuvaloqlang va önlik sonlarni aniq tenglikka soliştirmang.

## Qöşimça manbalar

- [Python Tutorial - Using Python as a Calculator](https://docs.python.org/3/tutorial/introduction.html#numbers)
- [Numeric types - int, float, complex](https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex)
- [Floating-point arithmetic: issues and limitations](https://docs.python.org/3/tutorial/floatingpoint.html)
- [`math` module](https://docs.python.org/3/library/math.html)
