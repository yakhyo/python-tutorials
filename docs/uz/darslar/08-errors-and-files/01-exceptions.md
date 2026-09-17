---
title: Istisnolarni qayta işlaş
description: "try va except yordamida xatolarni uşlaş va qayta işlaş: aniq istisnolar, else va finally, istisnolar ierarxiyasi, xatolar funksiya çaqirişlari orqali qanday harakatlanişi va foydalanuvçi kiritişi uçun qayta söraş sikllari."
---

# Istisnolarni qayta işlaş

![Rasm: Istisnolarni qayta işlaş](/images/topics-webp-uzb/exceptions.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `try` va `except` xatoning dasturingizni töxtatişiga qanday yöl qöymaydi
- **Aniq** istisnolarni uşlaş va xabarni `as e` bilan öqiş
- `else` va `finally` nima qöşadi va nega yalanğoç `except:` yomon fikr
- Istisnolar **ierarxiyasi** qanday işlaydi va xatolar çaqirişlar böylab yuqoriga qanday köçadi
- EAFP va LBYL hamda foydalanuvçi kiritişi uçun qayta söraş sikli
:::

## Nega bu muhim

Haqiqiy dasturlar notöğri maʼlumotlarga doim duç keladi: foydalanuvçi son kutilgan joyga `abc` yozadi, fayl öçirilgan, mahsulot kodi luğatda yöq. Hozirgaça bularning har biri dasturingizni **töxtatib qöyardi**. Istisnolarni qayta işlaş şunday deyiş imkonini beradi: "buni sinab kör, agar aynan şu narsa notöğri ketsa, uning örniga buni bajar".

## `try` va `except`

Python biror qator söragan işni bajara olmasa, u **istisno çaqiradi** (raise an exception): muammoni tavsiflaydigan obyekt, masalan `ValueError: invalid literal for int() with base 10: '15 000'`. Agar uni heç narsa uşlamasa, dastur traceback bilan töxtaydi (*Xato xabarlarini öqiş va tuzatiş* darsiga qarang). Xavfli kodni `try` içiga qöying, şunda Python töxtaş örniga mos `except` blokiga ötadi:

```python
text = "15 000"

try:
    price = int(text)
    print(f"Narx: {price} söm")
except ValueError:
    print(f"'{text}' butun son emas")

print("Dastur davom etmoqda")
```

```text
'15 000' butun son emas
Dastur davom etmoqda
```

`int(text)` `ValueError` çaqiradi, şuning uçun `try` ning qolgan qismi **ötkazib yuboriladi**, `except` bloki bajariladi va dastur davom etadi. Istisno bölmasa, `except` ötkazib yuboriladi.

## Aniq istisnolarni uşlaş

Har doim kutayotgan istisnoning nomini yozing. Törttasi doim uçraydi: `ValueError` (turi töğri, qiymati notöğri, masalan `int("abc")`), `ZeroDivisionError` (`100 / 0`), `KeyError` (luğatda yöq kalit) va `FileNotFoundError` (mavjud bölmagan faylni oçiş). Aniq `except` boşqa xatolarni yaşir**maydi**, şuning uçun kodingizdagi xato yoziş baribir körinadi.

Bitta `try` da bir neçta `except` bloki bölişi mumkin. Python ularni yuqoridan pastga tekşiradi va mos kelgan **birinçisini** bajaradi. `except ValueError as e` deb yozsangiz, istisno obyekti `e` da saqlanadi, `e` ni çop etsangiz, uning xabari çiqadi:

```python
def split_bill(total_text, people_text):
    try:
        total = int(total_text)
        people = int(people_text)
        share = total / people
    except ValueError as e:
        return f"Butun son emas: {e}"
    except ZeroDivisionError:
        return "Kamida bitta kişi bölişi kerak"
    return f"Har bir kişi {share:,.0f} söm tölaydi"

print(split_bill("240000", "4"))
print(split_bill("240k", "4"))
print(split_bill("240000", "0"))
```

```text
Har bir kişi 60,000 söm tölaydi
Butun son emas: invalid literal for int() with base 10: '240k'
Kamida bitta kişi bölişi kerak
```

Ikki istisno **bir xil** qayta işlanişi kerak bölsa, ularni kortejda sanang: `except (TypeError, ZeroDivisionError):`. `except Exception as e` deyarli har qanday xatoni uşlaydi. Uni dasturning **yuqori darajasida**, har qanday muammo haqida xabar berib, davom etadigan joyda işlating; oddiy funksiyalar içida bu körişni istagan xatolaringizni ham uşlab qoladigan keng tör.

## `else` va `finally`

`try` operatorining yana ikki ixtiyoriy qismi bor: `else` faqat `try` bloki istisno çaqir**magan** bölsa bajariladi, `finally` esa **har doim** bajariladi.

```python
def read_amount(text):
    try:
        amount = int(text)
    except ValueError:
        print(f"  '{text}' rad etildi")
    else:
        print(f"  {amount:,} söm qabul qilindi")
    finally:
        print("  tekşiruv tugadi")

read_amount("50000")
read_amount("ellik")
```

```text
  50,000 söm qabul qilindi
  tekşiruv tugadi
  'ellik' rad etildi
  tekşiruv tugadi
```

Nega `try` ga köproq qator qöşiş örniga `else`? U `try` ni kiçik saqlaydi, şunda faqat xato berişini kutgan qatordagi xatolarni uşlaysiz.

`finally` tozalaş uçun, masalan ulanişni yopiş uçun. U `return` dan yoki heç kim uşlamagan xatodan keyin ham bajariladi. Tartib har doim `try`, `except`, `else`, `finally`.

## Nega yalanğoç `except:` yomon

Tursiz `except:` **hamma narsani**, jumladan öz xatolaringiz keltirib çiqargan xatolarni ham uşlaydi:

```py
# Yomon:
prices = {"çoy": 15000}
try:
    total = prices["çoy"] * quantty     # xato yozilgan!
except:
    print("Mahsulot topilmadi")
```

Bu `Mahsulot topilmadi` ni çop etadi, bu esa yolğon: haqiqiy muammo - notöğri yozilgan `quantity` tufayli çiqqan `NameError`. Yalanğoç `except:` hatto `KeyboardInterrupt` ni ham uşlaydi, şuning uçun Ctrl+C osilib qolgan siklni töxtata olmaydi. Uning örniga `except KeyError:` deb yozing.

## Istisnolar ierarxiyasi

![Diagramma: Istisnolar ierarxiyasi](/images/companions-webp-uzb/exception-hierarchy.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Istisno turlari oila daraxtini hosil qiladi. Ota-onani uşlaş uning bolalarini ham uşlaydi:

```text
BaseException
 +-- KeyboardInterrupt
 +-- SystemExit
 +-- Exception
      +-- ArithmeticError
      |    +-- ZeroDivisionError
      +-- LookupError
      |    +-- IndexError
      |    +-- KeyError
      +-- OSError
      |    +-- FileNotFoundError
      +-- ValueError
      +-- TypeError
```

`Exception` ni uşlaş oddiy dastur çaqiradigan deyarli hamma narsani uşlaydi. `BaseException` esa `KeyboardInterrupt` va `SystemExit` ni ham uşlaydi, bu deyarli heç qaçon siz xohlagan narsa emas.

```python
data = {"cities": ["Toşkent", "Samarqand"]}

for key, index in [("cities", 1), ("cities", 5), ("towns", 0)]:
    try:
        print(data[key][index])
    except LookupError as e:
        print(f"Topilmadi: {type(e).__name__}")
```

```text
Samarqand
Topilmadi: IndexError
Topilmadi: KeyError
```

Bitta `except LookupError` yöq kalitni ham, notöğri indeksni ham uşladi, `type(e).__name__` esa qaysi biri ekanini körsatadi. Ota-ona va bolalarni birga işlatganda tartib muhim: **aniqroq** `except` ni birinçi qöying, aks holda u heç qaçon bajarilmaydi.

## Istisnolar yuqoriga qanday köçadi

![Diagramma: Istisnolar yuqoriga qanday köçadi](/images/companions-webp-uzb/exception-propagation.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Agar funksiya istisnoni uşlamasa, u **çaqiruvçiga**, keyin çaqiruvçining çaqiruvçisiga va hokazo ötadi. Traceback şu yölni körsatadi; uni **pastdan**, xato sodir bölgan joydan öqing. Şuning uçun istisnoni nima qiliş kerakligini biladigan istalgan darajada uşlaşingiz mumkin. Bu yerda `print_receipt` hal qiladi:

```python
def unit_price(total, quantity):
    return total / quantity

def order_line(product, total, quantity):
    price = unit_price(total, quantity)
    return f"{product}: donasi {price:,.0f} söm"

def print_receipt(lines):
    for product, total, quantity in lines:
        try:
            print(order_line(product, total, quantity))
        except ZeroDivisionError:
            print(f"{product}: miqdori nol, qator ötkazib yuborildi")

print_receipt([("Çoy", 45000, 3), ("Somsa", 16000, 0), ("Şarbat", 24000, 2)])
```

```text
Çoy: donasi 15,000 söm
Somsa: miqdori nol, qator ötkazib yuborildi
Şarbat: donasi 12,000 söm
```

## EAFP va LBYL

**LBYL** ("Look Before You Leap", sakraşdan oldin qara) avval tekşiradi, masalan `if product in stock:`. **EAFP** ("Easier to Ask Forgiveness than Permission", ruxsat söragandan köra keçirim söraş osonroq) şunçaki sinab köradi va istisnoni uşlaydi. Tekşiruvni yoziş qiyin bölganda Python kodida köpinça EAFP afzal köriladi: "bu satr yaroqli önlik sonmi?" degan savol murakkab (`"-3.5"`, `"1e3"`, `" 7 "`), `try: float(text)` esa unga ajoyib javob beradi.

## Kiritiş töğri bölgunça qayta söraş

`while True`, `try` va `break` ni birlaştirsangiz, foydalanuvçi yaroqli narsa yozmagunça söraşda davom etadigan sikl hosil böladi:

```python
while True:
    try:
        people = int(input("Neça kişi? "))
        break                       # faqat int() muvaffaqiyatli bölsa, bu yerga yetib keladi
    except ValueError:
        print("Iltimos, 4 kabi butun son yozing")

print(f"{people} kişilik stol")
```

```text
Neça kişi? tört
Iltimos, 4 kabi butun son yozing
Neça kişi? 7
7 kişilik stol
```

Agar `int()` xato bersa, `break` ötkazib yuboriladi va sikl qaytadan söraydi. Bu saytda `input()` siz "input() uçun qiymatlar" maydoniga yozgan qatorlarni öqiydi; sikl siz bergandan köp qator sörasa, `input()` `EOFError: EOF when reading a line` çaqiradi, şuning uçun röyxatni yaroqli qiymat (bu yerda `7`) bilan tugating. *Kiritilgan maʼlumotni tekşiriş* darsi bu ğoyani qayta işlatiladigan yordamçi funksiyalarga aylantiradi.

## Özingiz sinab köring

"input() uçun qiymatlar" maydoniga mahsulot va miqdorni har birini alohida qatorga kiriting. `tort`, `abc` yoki `0` kabi notöğrilarini ham sinab köring.

<ClientOnly><PythonPlayground :code='"stock = {\"çoy\": 12, \"somsa\": 30, \"şarbat\": 0}\n\nproduct = input(\"Mahsulot: \").strip().lower()\ntry:\n    quantity = int(input(\"Miqdor: \"))\n    available = stock[product]\n    batches = available // quantity\nexcept ValueError:\n    print(\"Miqdor butun son bölişi kerak\")\nexcept KeyError:\n    print(f\"Bizda {product} sotilmaydi\")\nexcept ZeroDivisionError:\n    print(\"Miqdor nol bölişi mumkin emas\")\nelse:\n    print(f\"Har biri {quantity} ta {product} dan iborat {batches} ta buyurtmani bajara olamiz\")\nfinally:\n    print(\"Taşrifingiz uçun rahmat\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Notöğri istisno turini uşlaş

```py
try:
    age = int("yigirma")
except TypeError:
    print("Yoş notöğri")
```

```text
ValueError: invalid literal for int() with base 10: 'yigirma'
```

`int("yigirma")` `TypeError` emas, `ValueError` çaqiradi, şuning uçun `except` mos kelmaydi. Xavfli kodni bir marta `try` siz işga tuşirib, u aslida qaysi istisnoni çaqirişini köring.

### 2. `try` içiga juda köp kod joylaş

```python
# Yomon:
text = "50000"
try:
    amount = int(text)
    sessions = int("ikki")     # boşqa bir xato
except ValueError:
    print("Summa notöğri")
```

```text
Summa notöğri
```

Summa töğri edi; `ValueError` boşqa qatordan keldi. `try` da faqat xato berişini kutgan qatoringizni qoldiring, qolganini `else` ga köçiring.

### 3. Xatolarni jimgina yutib yuboriş

```py
# Yomon:
try:
    balance = int("1 000 000")
except ValueError:
    pass
print(f"Qoldiq: {balance}")
```

```text
NameError: name 'balance' is not defined
```

Haqiqiy xato yöqoldi va dastur keyinroq çalkaş xabar bilan yiqiladi. Istisnoni uşlaganingizda xabar körsating yoki standart qiymat işlating.

## Maşqlar

### 1. Xavfsiz böliş <Difficulty level="1" />

`a / b` ni, `b` `0` bölganda esa `"aniqlanmagan"` satrini qaytaradigan `safe_divide(a, b)` funksiyasini yozing. Uni `(10, 4)` va `(5, 0)` bilan tekşiring.

::: details Yeçim
```python
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "aniqlanmagan"

print(safe_divide(10, 4))
print(safe_divide(5, 0))
```

```text
2.5
aniqlanmagan
```

:::

### 2. Narxlarni öqiş <Difficulty level="1" />

`raw = ["15000", "8,000", "22000", "bepul", "5000"]` berilgan. `int` ga aylanadigan har bir elementni jamiga qöşing. Har bir yaroqsiz element uçun xabar, keyin jamini çop eting.

::: details Yeçim
```python
raw = ["15000", "8,000", "22000", "bepul", "5000"]

total = 0
for item in raw:
    try:
        total += int(item)
    except ValueError:
        print(f"Yaroqsiz narx: {item}")

print(f"Jami: {total:,} söm")
```

```text
Yaroqsiz narx: 8,000
Yaroqsiz narx: bepul
Jami: 42,000 söm
```
:::

### 3. Bahoni topiş <Difficulty level="2" />

`grades = {"Aziza": [90, 85], "Bekzod": []}` bilan örtaça bahoni satr sifatida qaytaradigan `average_for(name)` funksiyasini yozing. Yöq öquvçi (`KeyError`) va bahosi yöq öquvçi (`ZeroDivisionError`) uçun **turli** xabarlar qaytaring. `"Aziza"`, `"Bekzod"` va `"Farrux"` bilan tekşiring.

::: details Yeçim
```python
grades = {"Aziza": [90, 85], "Bekzod": []}

def average_for(name):
    try:
        scores = grades[name]
        avg = sum(scores) / len(scores)
    except KeyError:
        return f"{name}: bunday öquvçi yöq"
    except ZeroDivisionError:
        return f"{name}: hali baholar yöq"
    return f"{name}: {avg:.1f}"

for name in ["Aziza", "Bekzod", "Farrux"]:
    print(average_for(name))
```

```text
Aziza: 87.5
Bekzod: hali baholar yöq
Farrux: bunday öquvçi yöq
```
:::

### 4. Qayerda xato berdi? <Difficulty level="2" />

`["12", "x", "7"]` böyiça sikl yurgizing va har bir qiymatni `try` içida `int()` bilan özgartiring. `ValueError` da `notöğri qiymat: ...` ni çop eting, faqat muvaffaqiyatda `özgartirildi ...` ni çop etiş uçun `else` dan, har bir qiymat uçun `... bilan tugadi` ni çop etiş uçun `finally` dan foydalaning.

::: details Yeçim
```python
for value in ["12", "x", "7"]:
    try:
        number = int(value)
    except ValueError:
        print(f"notöğri qiymat: {value}")
    else:
        print(f"özgartirildi {number}")
    finally:
        print(f"{value} bilan tugadi")
```

```text
özgartirildi 12
12 bilan tugadi
notöğri qiymat: x
x bilan tugadi
özgartirildi 7
7 bilan tugadi
```
:::

### 5. Işonçli kalkulyator <Difficulty level="3" />

Foydalanuvçi `quit` yozgunça `input()` bilan sonlarni öqing. Son bölmagan har qanday narsani qisqa xabar bilan ötkazib yuboring. Oxirida jami va örtaça qiymatni, sonlar bölmasa esa `Heç qanday son kiritilmadi` ni çop eting.

::: details Yeçim
```python
numbers = []

while True:
    text = input("Son (yoki quit): ").strip()
    if text == "quit":
        break
    try:
        numbers.append(float(text))
    except ValueError:
        print(f"'{text}' son emas")

try:
    average = sum(numbers) / len(numbers)
except ZeroDivisionError:
    print("Heç qanday son kiritilmadi")
else:
    print(f"Jami: {sum(numbers)}, örtaça: {average:.2f}")
```

```text
Son (yoki quit): 7
Son (yoki quit): 5
Son (yoki quit): beş
'beş' son emas
Son (yoki quit): 3
Son (yoki quit): quit
Jami: 15.0, örtaça: 5.00
```
:::

## Xulosa

- `try` xato berişi mumkin bölgan kodni saqlaydi; `except SomeError as e` aynan şu xatoni, kortej esa bir neçtasini qayta işlaydi.
- `else` faqat muvaffaqiyatda bajariladi. `finally` har safar bajariladi va tozalaş uçun.
- Yalanğoç `except:` va jim `pass` dan saqlaning: ular haqiqiy xatolarni yaşiradi.
- Istisnolar ierarxiya hosil qiladi va çaqiruvçilar böylab yuqoriga köçadi: ularni (avval aniqroğini) nima qiliş kerakligini biladigan darajada uşlang.
- `while True` + `try` + `break` töğri bölgunça qayta söraydigan kiritiş siklini beradi.

## Qöşimça manbalar

- [Python Tutorial: Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html)
- [Built-in Exceptions and the exception hierarchy](https://docs.python.org/3/library/exceptions.html)
- [The `try` statement (language reference)](https://docs.python.org/3/reference/compound_stmts.html#the-try-statement)
