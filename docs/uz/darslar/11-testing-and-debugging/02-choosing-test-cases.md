---
title: Test holatlarini tanlaş
description: "Nimani testlaşni hal qiliş: oddiy holatlar, çegaraviy va çekka holatlar, notöğri kirişlar, ekvivalentlik sinflari, har bir tarmoq, holatlar jadvali, regressiya testlari va testlar yetarli ekanini biliş."
---

# Test holatlarini tanlaş

![Rasm: Test holatlarini tanlaş](/images/topics-webp-uzb/choosing-test-cases.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Holatlarning uç turi: **oddiy**, **çegaraviy** va **notöğri**
- Ekvivalentlik sinflari va tarmoqlar qaysi kirişlarni tanlaşni qanday aytib beradi
- Köp holatlarni **jadval** qilib yoziş va ularni sikl bilan tekşiriş
- Tasodifiylik, bugungi sana yoki `input()` işlatadigan kodni qanday testlaş
- Regressiya testini qanday yoziş va testlar qaçon yetarli böladi
:::

## Nega bu muhim

`assert` yoziş oson. Haqiqiy mahorat - **nimani** tekşirişni biliş: agar önta testning hammasi bir xil oson holatni tekşirsa, funksiya ularning barçasidan ötib ham notöğri bölişi mumkin. Şuning uçun testçi "Bu qanday buzilişi mumkin?" deb söraydi. Köp xatolar `0` yoki "roppa-rosa 18" kabi çegaralarda, böş röyxatlarda va heç kim kutmagan kirişlarda yaşirinadi.

## Test holatlarining uç turi

![Diagramma: Test holatlarining uç turi](/images/companions-webp-uzb/equivalence-boundaries.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Buxorodagi muzey 7 yoşgaça bepul, 18 yoşgaça 20,000 söm, kattalar uçun esa 40,000 söm oladi; manfiy yoş xato hisoblanadi. Deyarli har bir funksiya uçun holatlarni uç guruhdan tanlaş kerak:

| Turi | Savol | `ticket_price` uçun misollar |
|---|---|---|
| **Oddiy** | Odatiy holat işlaydimi? | `30`, `12`, `3` |
| **Çegaraviy** (çekka) | Çegaralarda işlaydimi? | `0`, `6`, `7`, `17`, `18` |
| **Notöğri** | Yomon kirişni töğri rad etadimi? | `-1` |

Notöğri holatlar funksiya **siz vada qilgan tarzda** xato berişini isbotlaydi.

### Ekvivalentlik sinflari va tarmoqlar

Har bir yoşni testlay olmaysiz va bunga ehtiyoj ham yöq: `25`, `40` va `63` bir xil koddan ötadi. Kirişlarni **ekvivalentlik sinflari**ga, yaʼni funksiya bir xil munosabatda böladigan qiymatlar guruhlariga ajrating va har biridan bitta odatiy qiymatni, hamda guruhlar orasidagi **çegaralar**dagi qiymatlarni tanlang:

```text
   notöğri    | bepul   |  talaba    |       katta
  ... -2 -1   | 0 ... 6 | 7 ... 17   | 18 ... 120 ...
                ^     ^   ^     ^      ^
             çegaralar: 0, 6, 7, 17, 18 (va taşqaridagi -1)
```

Ikkinçi usul - kodni öqiş: har bir `if`, `elif` va `else` **tarmoq** hisoblanadi va har biriga kamida bitta test kerak. Sinflar (tavsifdan) kod unutgan holatlarni topadi; tarmoqlar (koddan) tavsifda heç qaçon tilga olinmagan yöllarni topadi.

## Holatlar jadvali

Har bir holat uçun alohida `assert` yoziş örniga holatlarni `(kiriş, kutilgan)` kortejlari röyxatiga joylang va ular böylab aylaning:

```python
def ticket_price(age):
    if age < 0:
        raise ValueError("yoş manfiy bölişi mumkin emas")
    if age < 7:
        return 0          # kiçik bolalar bepul
    if age < 18:
        return 20000      # talabalar
    return 40000          # kattalar

def test_ticket_price():
    cases = [
        (30, 40000),   # oddiy: katta
        (12, 20000),   # oddiy: talaba
        (0, 0),        # çegara: eng kiçik yoş
        (6, 0),        # çegara: oxirgi bepul yoş
        (7, 20000),    # çegara: birinçi talaba yoşi
        (18, 40000),   # çegara: birinçi katta yoş
    ]
    for age, expected in cases:
        result = ticket_price(age)
        assert result == expected, f"yoş {age}: {expected} kutilgandi, {result} çiqdi"

test_ticket_price()
print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```

Yangi holat qöşiş bitta qator, izohlar har bir qator **nega** borligini aytadi, xabar esa yiqilgan holatni nomlaydi. Notöğri `-1` yoşi uçun esa *assert bilan testlaş* darsidagidek alohida `try` / `except` / `else` testi yoziladi, çunki uning vadasi istisno.

## Haqiqiy xatolarni topadigan çegaraviy holatlar

Toşkentdagi dökon 100,000 sömdan boşlab buyurtmalarga 5%, 500,000 sömdan boşlab esa 10% çegirma beradi. Bu versiya `200000` bilan tezkor tekşiruvdan ötadi:

```python
def discount_percent(total):
    if total >= 100000:
        return 5
    elif total >= 500000:
        return 10
    return 0

cases = [(50000, 0), (200000, 5), (800000, 10),   # har sinfdan bitta qiymat
         (99999, 0), (100000, 5), (500000, 10)]   # çegaralar

for total, expected in cases:
    result = discount_percent(total)
    if result != expected:
        print(f"{total}: {expected}% kutilgandi, {result}% çiqdi")
```

```text
800000: 10% kutilgandi, 5% çiqdi
500000: 10% kutilgandi, 5% çiqdi
```

Şartlar notöğri tartibda: 500,000 va undan katta har bir summa `>= 100000` dan ham ötadi, şuning uçun 10% tarmoği **heç qaçon** işlamaydi. **Har bir** sinfdan bitta qiymat ölik kodni topdi.

## Çegaraviy holatlar röyxati

Nimani testlaşni aniq bilmasangiz, şu röyxatni körib çiqing:

| Kiriş turi | Sinab köriladigan çegaraviy holatlar |
|---|---|
| Sonlar | `0`, `-1`, juda katta, har bir çegaradan bitta past / aynan / bitta yuqori |
| Satrlar | `""`, faqat böşliqlar, katta va kiçik harflar, boşidagi/oxiridagi böşliqlar |
| Röyxatlar / luğatlar | böş, bitta element, takrorlar, teskari saralangan |
| Fayllar / JSON | mavjud bölmagan fayl, böş fayl, yetişmayotgan kalit |

Birga adaşiş (off-by-one) xatolari (`<` va `<=`, `range(n)` va `range(n + 1)`) eng köp uçraydigan xatolardan, şuning uçun `18` çegarasi `17`, `18` va `19` ni testlaş degani.

## Tasodifiylik, sanalar va `input()`

Test har safar bir xil javob berişi kerak, lekin `random`, `date.today()` yoki `input()` ni çaqiradigan kod unday emas. **Özgaruvçan narsani** haqiqiy manbani standart qiymat qilib, **parametr sifatida bering**:

```python
import random
from datetime import date

def is_weekend(today=None):
    if today is None:
        today = date.today()
    return today.weekday() >= 5

def pick_winner(names, rng=random):
    return rng.choice(names)

def test_is_weekend():
    assert is_weekend(date(2026, 9, 19))        # şanba
    assert not is_weekend(date(2026, 9, 16))    # çorşanba

def test_pick_winner():
    names = ["Aziza", "Bekzod", "Dilnoza", "Farrux"]
    first = pick_winner(names, random.Random(42))
    second = pick_winner(names, random.Random(42))
    assert first == second, "bir xil seed bir xil ğolibni berişi kerak"

test_is_weekend()
test_pick_winner()
print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```

Dastur bugungi kunni oladi; test esa kunni özi tanlaydi. `random.Random(42)` belgilangan **seed** (boşlanğiç qiymat) li generator, şuning uçun u har safar bir xil tanlov qiladi. `input()` uçun çaqiruvni taşqi kodda qoldiring va yozilgan matnni qabul qiladigan funksiyani testlang.

## Xatoni tuzatişdan oldin test yozing

Dilnoza `average([])` hisobot sahifasini `ZeroDivisionError` bilan qulatayotganini aytganda, avval testga `assert average([]) == 0.0` ni yozing va uning **yiqilişini** köring: bu test xatoni haqiqatan uşlaşini isbotlaydi. Keyin test ötgunça funksiyani tuzating. Bu **regressiya testi** doimiy qoladi, şuning uçun xato sezdirmasdan qaytib kela olmaydi. Avval tuzatib, keyin test yozsangiz, testning yiqilişini heç qaçon körmaysiz.

Har bir sinf, çegara, tarmoq, vada qilingan xato va tuzatilgan xatoning öz testi bölsa, testlar **yetarli**. Yaxşi tanlangan önta test tasodifiy yuzta testdan yaxşiroq.

## Özingiz sinab köring

Çegaraviy holatlar oşkor qilgan xatoni toping va tuzating.

<ClientOnly><PythonPlayground :code='"def password_strength(password):\n    # \"zaif\": 8 ta belgidan kam\n    # \"örta\": 8 dan 11 tagaça belgi\n    # \"kuçli\": 12 va undan köp belgi\n    if len(password) < 8:\n        return \"zaif\"\n    if len(password) < 11:\n        return \"örta\"\n    return \"kuçli\"\n\ncases = [\n    (\"abc\", \"zaif\"),\n    (\"kungaboqar\", \"örta\"),\n    (\"samarqand-buxoro\", \"kuçli\"),\n    (\"1234567\", \"zaif\"),\n    (\"12345678\", \"örta\"),\n    (\"12345678901\", \"örta\"),\n    (\"123456789012\", \"kuçli\"),\n]\n\nfor password, expected in cases:\n    result = password_strength(password)\n    if result == expected:\n        print(f\"PASS  {password!r}\")\n    else:\n        print(f\"FAIL  {password!r}: {expected} kutilgandi, {result} çiqdi\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Kutilgan qiymatni aynan şu mantiq bilan hisoblaş

```py
def tax(price):
    return price * 12 // 10      # xato: // 100 bölişi kerak

price = 15000
assert tax(price) == price * 12 // 10   # Yomon: kodni xatosi bilan birga nusxalaydi
assert tax(price) == 1800               # Yaxşi: özingiz hisoblab çiqqan javob
```

```text
AssertionError
```

Birinçi assert ötdi, çunki u xatoni takrorlaydi; uni faqat ikkinçisi uşlaydi. **Tuzatiş:** kutilgan qiymatlarni özingiz hisoblab çiqqan oddiy sonlar sifatida yozing.

### 2. Qaysi holat yiqilganini yaşiradigan sikl

```py
def double(n):
    return n + n if n > 0 else 0

cases = [(2, 4), (5, 10), (-3, -6)]
for n, expected in cases:
    assert double(n) == expected
```

```text
AssertionError
```

Qaysi holat yiqildi? **Tuzatiş:** xabar qöşing: `assert double(n) == expected, f"n={n}: {expected} kutilgandi, {double(n)} çiqdi"`.

## Maşqlar

### 1. Holatlarni tanlang <Difficulty level="1" />

`can_rent_car(age)` 21 dan 75 gaça (ikkalasi ham kiradi) yoşlar uçun `True` qaytaradi. Oddiy qiymatlar va barça çegaralarni qamrab oladigan kamida 7 ta `(age, expected)` holatdan iborat jadval yozing.

::: details Yeçim
```python
def can_rent_car(age):
    return 21 <= age <= 75

cases = [(40, True), (10, False), (90, False),              # oddiy
         (20, False), (21, True), (75, True), (76, False)]  # çegaralar
for age, expected in cases:
    result = can_rent_car(age)
    assert result == expected, f"yoş {age}: {expected} kutilgandi, {result} çiqdi"
print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```
:::

### 2. Birga adaşiş xatosini toping <Difficulty level="1" />

`count_up_to(n)` `[1, 2, ..., n]` ni qaytarişi kerak. Uni `n=1` va `n=0` bilan ham testlang, keyin xatoni toping va tuzating:

```py
def count_up_to(n):
    return list(range(1, n))
```

::: details Yeçim
```python
def count_up_to(n):
    return list(range(1, n + 1))

cases = [(3, [1, 2, 3]), (1, [1]), (0, [])]
for n, expected in cases:
    result = count_up_to(n)
    assert result == expected, f"n={n}: {expected} kutilgandi, {result} çiqdi"
print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```
:::

### 3. Yetkazib beriş uçun ekvivalentlik sinflari <Difficulty level="2" />

Yetkazib beriş 1 kg gaça bepul, 5 kg gaça 20,000 söm, undan oğirroği uçun 50,000 söm. 0 yoki undan kam oğirlik `ValueError` çaqiradi. `shipping_cost(kg)` ni yozing va har bir sinfdan bitta qiymatni, çegaralarni va notöğri kirişlarni testlang.

::: details Yeçim
```python
def shipping_cost(kg):
    if kg <= 0:
        raise ValueError("oğirlik musbat bölişi kerak")
    if kg <= 1:
        return 0
    if kg <= 5:
        return 20000
    return 50000

cases = [(0.5, 0), (3, 20000), (12, 50000),     # har sinfdan bitta
         (1, 0), (1.01, 20000), (5, 20000), (5.01, 50000)]   # çegaralar
for kg, expected in cases:
    result = shipping_cost(kg)
    assert result == expected, f"{kg} kg: {expected} kutilgandi, {result} çiqdi"

for bad in [0, -2]:
    try:
        shipping_cost(bad)
    except ValueError:
        pass
    else:
        assert False, f"{bad} ValueError çaqirişi kerak"

print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```
:::

### 4. Avval regressiya testi <Difficulty level="2" />

`title_case("aziza  karimova")` (ikkita böşliq) natijada ikkala böşliqni ham saqlab qoladi. Regressiya testini yozing, u quyidagi versiyada yiqilişiga işonç hosil qiling, keyin funksiyani tuzating.

```py
def title_case(name):
    return " ".join(part.capitalize() for part in name.split(" "))
```

::: details Yeçim
```python
def title_case(name):
    return " ".join(part.capitalize() for part in name.split())

def test_title_case_extra_spaces():
    # Regressiya: ilgari ikki böşliq natijada saqlanib qolardi
    result = title_case("aziza  karimova")
    assert result == "Aziza Karimova", f"{result!r} çiqdi"

test_title_case_extra_spaces()
print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```

`split(" ")` ikki böşliq orasida böş satr qoldiradi. `split()` esa uni taşlab yuboradi.
:::

### 5. Röyxat funksiyasini puxta testlaş <Difficulty level="3" />

`second_largest(numbers)` ni yozing: ikkinçi eng katta **takrorlanmas** qiymat, u bölmasa `ValueError`. Saralanmagan röyxatni, takrorlangan eng katta qiymatni, roppa-rosa ikkita elementni va notöğri röyxatlarni (böş, bitta element, hammasi teng) testlang.

::: details Yeçim
```python
def second_largest(numbers):
    distinct = sorted(set(numbers))
    if len(distinct) < 2:
        raise ValueError("kamida ikkita har xil son kerak")
    return distinct[-2]

cases = [([30, 10, 20], 20), ([50, 50, 40], 40), ([7, 3], 3)]
for numbers, expected in cases:
    result = second_largest(numbers)
    assert result == expected, f"{numbers}: {expected} kutilgandi, {result} çiqdi"

for bad in [[], [4], [8, 8, 8]]:
    try:
        second_largest(bad)
    except ValueError:
        pass
    else:
        assert False, f"{bad} ValueError çaqirişi kerak"

print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```

Takrorlar holati - tuzoq: `[50, 50, 40]` uçun `sorted(numbers)[-2]` `50` ni beradi.
:::

## Xulosa

- Holatlarning uç turini testlang: **oddiy**, **çegaraviy** va **notöğri**.
- Har bir **ekvivalentlik sinfi**dan bitta qiymat tanlang, har bir çegara atrofini testlang va har bir tarmoqni işga tuşiring.
- Holatlarni `(kiriş, kutilgan)` kortejlari jadvaliga joylab, sikl bilan tekşiring va xabarda yiqilgan holatni nomlang.
- Testlar har safar bir xil javob berişi uçun tasodifiylik, sanalar va yozilgan matnni parametr sifatida **taşqaridan** bering.
- Xatoni tuzatişdan oldin yiqiladigan **regressiya testi**ni yozing, keyin uni ötadigan qiling.

## Qöşimça manbalar

- [`unittest`: testlaşning asosiy tuşunçalari](https://docs.python.org/3/library/unittest.html)
- [pytest: testlarni parametrlaş (holatlar jadvali)](https://docs.pytest.org/en/stable/how-to/parametrize.html)
- [`str.split()`](https://docs.python.org/3/library/stdtypes.html#str.split)
