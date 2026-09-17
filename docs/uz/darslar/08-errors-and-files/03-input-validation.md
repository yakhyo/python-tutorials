---
title: Kiritilgan maʼlumotni tekşiriş
description: "Dasturlarni notöğri kiritişga çidamli qiliş: matnni normallaştiriş, qayta işlatiladigan ask_int va ask_choice yordamçilari, satrlarni himoya şartlari bilan tekşiriş va urinişlar sonini çeklaş."
---

# Kiritilgan maʼlumotni tekşiriş

![Rasm: Kiritilgan maʼlumotni tekşiriş](/images/topics-webp-uzb/input-validation.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Nega kiritişga **heç qaçon işonmaslik** kerak va uni `strip()` hamda `lower()` bilan qanday normallaştiriş
- `ask_int` va `ask_choice` kabi qayta işlatiladigan yordamçilarni qanday yaratiş
- Maxsus kutubxonalarsiz foydalanuvçi nomlari va telefon raqamlarini qanday tekşiriş
- Muammolar haqida xabar berişning ikki usuli: `(ok, message)` qaytariş yoki istisno çaqiriş
- Urinişlar sonini qanday çeklaş
:::

## Nega bu muhim

Foydalanuvçilar xato yozadi, böşliq qöşadi, `yes` örniga `Yes` yozadi va `-5` ta çipta söraydi. Kiritişga işonadigan dastur yiqiladi yoki, yanada yomoni, notöğri maʼlumot bilan işlaşda davom etadi. **Tekşiriş** maʼlumotni eşikda tekşiradi, şunda kodingizning qolgan qismi unga tayana oladi.

## Kiritişga heç qaçon işonmang

Siz `7` kutasiz, `seven`, `7.5` yoki `""` olasiz; yoş kutasiz, `-4` olasiz. Tekşiriş uç qadamdan iborat: **normallaştiriş** (böşliqlar, harf registri), **özgartiriş** (`int` yoki `float` ga) va **qoidalarni tekşiriş** (oraliq, tanlovlar, uzunlik, format).

`strip()` ikki çetdagi böşliqlarni olib taşlaydi, `lower()` esa harf registrini eʼtiborsiz qoldiradi:

```python
for raw in ["yes", " Yes", "YES  ", "no"]:
    answer = raw.strip().lower()
    print(f"{raw!r:>9} -> {answer!r:>6} -> qabul qilindi: {answer in {'yes', 'y'}}")
```

```text
    'yes' ->  'yes' -> qabul qilindi: True
   ' Yes' ->  'yes' -> qabul qilindi: True
  'YES  ' ->  'yes' -> qabul qilindi: True
     'no' ->   'no' -> qabul qilindi: False
```

Tekşirişdan **oldin** normallaştiring va normallaştirilgan qiymatni saqlang, aks holda `"Toşkent "` va `"toşkent"` ikkita şahar bölib qoladi.

## Qayta işlatiladigan `ask_int` yordamçisi

Özgartiriş muvaffaqiyatsiz bölişi mumkin, şuning uçun `try`/`except` işlating; u muvaffaqiyatli bölgandan keyin oraliqni tekşiring. Siklni faqat yaroqli `int` qaytaradigan funksiyaga joylang:

```python
def ask_int(prompt, min_value=None, max_value=None):
    while True:
        text = input(prompt).strip()
        try:
            value = int(text)
        except ValueError:
            print(f"  {text!r} butun son emas.")
            continue
        if min_value is not None and value < min_value:
            print(f"  Ruxsat etilgan eng kiçik qiymat: {min_value}.")
            continue
        if max_value is not None and value > max_value:
            print(f"  Ruxsat etilgan eng katta qiymat: {max_value}.")
            continue
        return value

nights = ask_int("Samarqandda neça keça (1-14): ", 1, 14)
print(f"{nights} keçaga bron qilindi")
```

```text
Samarqandda neça keça (1-14): 3.5
  '3.5' butun son emas.
Samarqandda neça keça (1-14): 20
  Ruxsat etilgan eng katta qiymat: 14.
Samarqandda neça keça (1-14): 7
7 keçaga bron qilindi
```

Har bir muvaffaqiyatsiz tekşiruv **aniq** xabar çop etib, `continue` qiladi; `return value` siklni ham, funksiyani ham tugatadi. Çegaralar ixtiyoriy, tekşiruv esa `is not None`, çunki `0` yaroqli, lekin falsy çegara.

## Variantlar töplamidan tanlaş: `ask_choice`

Menyular va ha/yöq savollari uçun normallaştirilgan javobni ruxsat etilgan qiymatlar töplami bilan soliştiring:

```python
def ask_choice(prompt, choices):
    allowed = {choice.lower() for choice in choices}
    options = ", ".join(sorted(allowed))
    while True:
        answer = input(prompt).strip().lower()
        if answer in allowed:
            return answer
        print(f"  Iltimos, birini tanlang: {options}")

print("1) Balans  2) Ötkazma  3) Tarix  0) Çiqiş")
action = ask_choice("Tanlang: ", {"1", "2", "3", "0"})
print(f"Siz {action} ni tanladingiz")
```

```text
1) Balans  2) Ötkazma  3) Tarix  0) Çiqiş
Tanlang: 5
  Iltimos, birini tanlang: 0, 1, 2, 3
Tanlang: 3
Siz 3 ni tanladingiz
```

## Satrlarni tekşiriş

Matn uçun kiçik tekşiruvlar yozing. Işning köp qismini satr metodlari bajaradi:

| Metod | Qaçon True | Misol |
|---|---|---|
| `isdecimal()` | barça belgilar önlik raqam (va kamida bittasi bor) | `"2026".isdecimal()` |
| `isdigit()` | xuddi şu, lekin `²` kabi raqamsimon belgilarni ham qabul qiladi | `"2²".isdigit()` |
| `isalpha()` | barça belgilar harf | `"Aziza".isalpha()` |
| `isalnum()` | faqat harflar yoki raqamlar | `"bekzod99".isalnum()` |

::: warning `isdecimal()` va `isdigit()` son tekşiruvi emas
`"-5".isdecimal()` va `"4.5".isdecimal()` `False`, vaholanki ikkalasi ham yaroqli son: sonni tekşiriş uçun `try` içida özgartiring. `isdecimal()` ni PIN kabi faqat raqamlardan iborat kodlar uçun işlating va uni `isdigit()` dan afzal köring: `"²".isdigit()` `True`, lekin `int("²")` `ValueError` beradi.
:::

### Foydalanuvçi nomi

```python
def check_username(name):
    if not name:
        return False, "foydalanuvçi nomi böş bölişi mumkin emas"
    if not 3 <= len(name) <= 16:
        return False, f"foydalanuvçi nomi 3-16 belgidan iborat bölişi kerak, berilgan: {len(name)}"
    if not name[0].isalpha():
        return False, "foydalanuvçi nomi harf bilan boşlanişi kerak"
    if not name.replace("_", "").isalnum():
        return False, "faqat harflar, raqamlar va _ dan foydalaning"
    return True, "ok"

for name in ["aziza_07", "ab", "7bekzod", "dilnoza!", ""]:
    ok, message = check_username(name)
    print(f"{name!r:12} {str(ok):5} {message}")
```

```text
'aziza_07'   True  ok
'ab'         False foydalanuvçi nomi 3-16 belgidan iborat bölişi kerak, berilgan: 2
'7bekzod'    False foydalanuvçi nomi harf bilan boşlanişi kerak
'dilnoza!'   False faqat harflar, raqamlar va _ dan foydalaning
''           False foydalanuvçi nomi böş bölişi mumkin emas
```

Har bir `if` - qoida buzilişi bilanoq çiqib ketadigan **himoya şarti**. Böşlik tekşiruvi birinçi keladi, şuning uçun `name[0]` `IndexError` bera olmaydi.

### Özbekiston telefon raqami

Avval böşliq, çiziqça va qavslarni olib taşlab normallaştiring, keyin formatni tekşiring:

```python
def normalize_phone(raw):
    phone = raw.strip()
    for symbol in " -()":
        phone = phone.replace(symbol, "")
    if not phone.startswith("+998"):
        return None
    digits = phone[1:]
    if len(digits) != 12 or not digits.isdecimal():
        return None
    return phone

for raw in ["+998 90 123-45-67", "+998(91)7654321", "90 123 45 67"]:
    print(f"{raw!r:22} -> {normalize_phone(raw)}")
```

```text
'+998 90 123-45-67'    -> +998901234567
'+998(91)7654321'      -> +998917654321
'90 123 45 67'         -> None
```

U saqlaşga tayyor tozalangan raqamni yoki `None` ni qaytaradi.

## `(ok, message)` qaytarişmi yoki istisno çaqirişmi?

`check_username` `(False, message)` ni **qaytaradi**. Muqobil variant - *Istisno çaqiriş va maxsus istisnolar* darsidagidek **çaqiriş**.

| | `(ok, message)` qaytariş | Istisno çaqiriş |
|---|---|---|
| Nimaga mos | formalar, u yerda notöğri kiritiş odatiy hol | asosiy funksiyalar, u yerda notöğri maʼlumot kutilmagan |
| Çaqiruvçi tekşirişni unutsa | notöğri qiymat ötib ketadi <No /> | dastur baland ovozda töxtaydi <Yes /> |
| Barça muammolarni bir yöla yiğiş | oson | qiyinroq |

Keng tarqalgan kombinatsiya: **çetda tekşiriş** (foydalanuvçi yozadigan joyda) döstona sikllar bilan va xavfsizlik töri sifatida asosiy funksiyalar **içida çaqiriş**.

## Urinişlarni çeklaş

PIN çeksiz taxminlarga yöl qöymasligi kerak. `while True` örniga `for` va `range` dan foydalaning:

```python
def ask_pin(correct_pin, max_attempts=3):
    for attempt in range(1, max_attempts + 1):
        pin = input(f"PIN ({attempt}-uriniş, jami {max_attempts}): ").strip()
        if len(pin) != 4 or not pin.isdecimal():
            print("  PIN aynan 4 ta raqamdan iborat.")
        elif pin == correct_pin:
            return True
        else:
            print("  PIN notöğri.")
    return False

if ask_pin("2580"):
    print("Kirişga ruxsat berildi")
else:
    print("Karta bloklandi. Iltimos, bankingizga murojaat qiling.")
```

```text
PIN (1-uriniş, jami 3): 7
  PIN aynan 4 ta raqamdan iborat.
PIN (2-uriniş, jami 3): 2580
Kirişga ruxsat berildi
```

Umumiy yordamçi oxirgi urinişdan keyin istisno çaqirişi ham mumkin.

## Özingiz sinab köring

"input() uçun qiymatlar" maydoniga har birini alohida qatorga `abc`, `25`, `3` kabi qiymatlar yozing. Keyin taom uçun ikkinçi savol qöşing.

<ClientOnly><PythonPlayground :code='"while True:\n    text = input(\"Miqdor (1-20): \").strip()\n    try:\n        quantity = int(text)\n    except ValueError:\n        print(f\"  {text!r} butun son emas.\")\n        continue\n    if 1 <= quantity <= 20:\n        break\n    print(\"  1 dan 20 gaça son kiriting.\")\n\nprint(f\"{quantity} x palov = {quantity * 45000:,} söm\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Xatolarni tekşirişdan oldin özgartiriş

```py
text = "yigirma"         # input("Yoş: ") qaytargan qiymat
age = int(text)
if age < 0:
    print("Yoş notöğri")
```

```text
ValueError: invalid literal for int() with base 10: 'yigirma'
```

`int()` oraliq tekşiruvi işlaşidan oldin yiqiladi. `try` içida özgartiring va oraliqni u muvaffaqiyatli bölgandan keyin tekşiring.

### 2. Tekşirib, keyin asl qiymatdan foydalaniş

```python
city = " toşkent "
cities = []
if city.strip().title() in {"Toşkent", "Samarqand", "Buxoro"}:
    cities.append(city)      # Yomon: xom matnni saqlaydi
print(cities)
```

```text
[' toşkent ']
```

Normallaştirilgan qiymatni özgaruvçida saqlang (`city = city.strip().title()`) va hamma joyda öşandan foydalaning.

## Maşqlar

### 1. Javoblarni tozalang <Difficulty level="1" />

`raw = ["  Toşkent", "samarqand ", "BUXORO", "Toşkent"]` berilgan. Har bir şaharni `strip()` va `title()` bilan normallaştiring va takrorlanmas şaharlar töplamini çop eting.

::: details Yeçim
```python
raw = ["  Toşkent", "samarqand ", "BUXORO", "Toşkent"]

cities = {city.strip().title() for city in raw}
print(sorted(cities))
```

```text
['Buxoro', 'Samarqand', 'Toşkent']
```
:::

### 2. Poçta indeksi <Difficulty level="1" />

Özbekiston poçta indeksi aynan 6 raqamdan iborat, masalan `100000`. Atrofdagi böşliqlarni eʼtiborsiz qoldiradigan `is_postal_code(text)` funksiyasini yozing. `"100000"`, `" 140100 "`, `"10000"` va `"1OOOOO"` (O harfi) ni sinab köring.

::: details Yeçim
```python
def is_postal_code(text):
    code = text.strip()
    return len(code) == 6 and code.isdecimal()

for text in ["100000", " 140100 ", "10000", "1OOOOO"]:
    print(f"{text!r:10} {is_postal_code(text)}")
```

```text
'100000'   True
' 140100 ' True
'10000'    False
'1OOOOO'   False
```
:::

### 3. Parol qoidalari <Difficulty level="2" />

`(ok, problems)` qaytaradigan `check_password(password)` funksiyasini yozing, bunda `problems` buzilgan **har bir** qoidani sanaydi: kamida 8 belgi, raqam, harf, böşliqsiz. `"secret"`, `"my pass 1"` va `"samarqand2026"` ni sinab köring.

::: details Yeçim
```python
def check_password(password):
    problems = []
    if len(password) < 8:
        problems.append("kamida 8 belgi")
    if not any(ch.isdigit() for ch in password):
        problems.append("kamida bitta raqam")
    if not any(ch.isalpha() for ch in password):
        problems.append("kamida bitta harf")
    if " " in password:
        problems.append("böşliqsiz")
    return len(problems) == 0, problems

for password in ["secret", "my pass 1", "samarqand2026"]:
    ok, problems = check_password(password)
    print(password, "->", "OK" if ok else "; ".join(problems))
```

```text
secret -> kamida 8 belgi; kamida bitta raqam
my pass 1 -> böşliqsiz
samarqand2026 -> OK
```
:::

### 4. Urinişli `ask_float` <Difficulty level="2" />

Yaroqli `float` qaytaradigan (`7,5` ni ham qabul qiling) yoki `ValueError("juda köp notöğri uriniş")` çaqiradigan `ask_float(prompt, min_value, max_value, attempts=3)` funksiyasini yozing. 0.1 dan 30 kg gaça bölgan jönatma vaznini sörang.

::: details Yeçim
```python
def ask_float(prompt, min_value, max_value, attempts=3):
    for _ in range(attempts):
        text = input(prompt).strip().replace(",", ".")
        try:
            value = float(text)
        except ValueError:
            print("  Son emas.")
            continue
        if min_value <= value <= max_value:
            return value
        print(f"  {min_value} va {max_value} orasida bölişi kerak.")
    raise ValueError("juda köp notöğri uriniş")

try:
    weight = ask_float("Jönatma vazni, kg: ", 0.1, 30)
    print(f"Vazn: {weight} kg")
except ValueError as e:
    print(f"Buyurtma bekor qilindi: {e}")
```

```text
Jönatma vazni, kg: oğir
  Son emas.
Jönatma vazni, kg: 7,5
Vazn: 7.5 kg
```
:::

### 5. Butun yozuvni tekşiriş <Difficulty level="3" />

`{"name": "Aziza", "age": "20"}` kabi forma luğatlari (qiymatlar satr, maydonlar yetişmasligi mumkin) uçun `validate_student(record)` funksiyasini yozing. Ism 2-30 ta harfdan, yoş 7 dan 99 gaça `int` dan iborat bölişi kerak. `(cleaned, errors)` qaytaring: normallaştirilgan qiymatlar (boş harfi katta ism, `int` yoş) va har bir maydon uçun xabarlar luğati. `{"name": " bekzod ", "age": "15"}`, `{"name": "D1lnoza", "age": "150"}` va `{"age": "x"}` ni sinab köring.

::: details Yeçim
```python
def validate_student(record):
    cleaned = {}
    errors = {}

    name = record.get("name", "").strip()
    if name.isalpha() and 2 <= len(name) <= 30:
        cleaned["name"] = name.title()
    else:
        errors["name"] = "faqat harflar, 2-30 belgi"

    try:
        age = int(record.get("age", ""))
    except ValueError:
        errors["age"] = "butun son bölişi kerak"
    else:
        if 7 <= age <= 99:
            cleaned["age"] = age
        else:
            errors["age"] = f"7-99 oraliğida bölişi kerak, berilgan: {age}"

    return cleaned, errors

for record in [{"name": " bekzod ", "age": "15"}, {"name": "D1lnoza", "age": "150"}, {"age": "x"}]:
    print(validate_student(record))
```

```text
({'name': 'Bekzod', 'age': 15}, {})
({}, {'name': 'faqat harflar, 2-30 belgi', 'age': '7-99 oraliğida bölişi kerak, berilgan: 150'})
({}, {'name': 'faqat harflar, 2-30 belgi', 'age': 'butun son bölişi kerak'})
```

`record.get(..., "")` yöq maydonni `KeyError` örniga oddiy xatoga aylantiradi. Eʼtibor bering: `isalpha()` `O'tkir` (oddiy apostrof) ni rad etadi, lekin `Gʻayrat` ni qabul qiladi; haqiqiy forma avval `'` va `ʻ` ni olib taşlagan bölardi.
:::

## Xulosa

- Kiritişga heç qaçon işonmang: normallaştiring (`strip()`, `lower()`), `try` içida özgartiring, keyin oraliq va ruxsat etilgan tanlovlarni tekşiring.
- Siklni `ask_int(prompt, min_value, max_value)` va `ask_choice(prompt, choices)` kabi yordamçilarga örang.
- Satrlarni himoya şartlari va `isdecimal()`, `isalpha()` kabi metodlar bilan tekşiring.
- Döstona formalar uçun `(ok, message)` qaytaring; asosiy kodda kutilmagan notöğri maʼlumot uçun istisno çaqiring.
- Urinişlarni `for ... in range(max_attempts)` bilan çeklang va **normallaştirilgan** qiymatni saqlang.

## Qöşimça manbalar

- [Built-in function `input()`](https://docs.python.org/3/library/functions.html#input)
- [String methods such as `isdigit()` and `strip()`](https://docs.python.org/3/library/stdtypes.html#string-methods)
- [Python Tutorial: Handling Exceptions](https://docs.python.org/3/tutorial/errors.html#handling-exceptions)
