---
title: Funksiyalarni töğri loyihalaş
description: "Öqiş, test qiliş va qayta işlatiş oson bölgan funksiyalar yozing: har biriga bitta vazifa, tuşunarli nomlar, mantiqni kiritiş va natijadan ajratiş hamda xavfsiz qayta tuziş."
---

# Funksiyalarni töğri loyihalaş

![Rasm: Funksiyalarni töğri loyihalaş](/images/topics-webp-uzb/designing-functions.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Funksiyani nima **yaxşi** qiladi: bitta vazifa, tuşunarli nom va aniq interfeys
- Nega **hisob-kitoblarni** **kiritiş va natijadan** ajratiş kerak
- **Sof funksiyalar** nima va nega ularni test qiliş oson
- Uzun funksiyalar, sehrli sonlar va bayroq argumentlari kabi muammolarni qanday aniqlaş
- Tartibsiz skriptni bosqiçma-bosqiç toza funksiyalarga qanday **qayta tuziş (refactoring)**
:::

## Nega bu muhim

Siz funksiyalarni **qanday** yozişni bilasiz; endi ularni **yaxşi** yozing. Ikki dastur bir xil natija çop etişi mumkin, lekin kod funksiyalarga qanday bölinganiga qarab birini özgartiriş oson, ikkinçisi esa - azob.

## 1. Bitta funksiya - bitta vazifa

Funksiya **bitta** iş bajarişi, uning nomi esa bu iş nima ekanini aytişi kerak. Agar uni tavsiflaş uçun "va" sözi kerak bölsa, ehtimol u juda köp iş qilyapti.

```python
# Yomon: öqiydi, tekşiradi, hisoblaydi va çop etadi — hammasi bitta joyda
def process():
    price = float(input("Narx: "))
    if price < 0:
        print("Notöğri qiymat")
        return
    total = price * 1.12
    print(f"Jami: {total:,.2f}")
```

```python
# Yaxşi: har bir funksiyaning bitta vazifasi bor
def add_vat(price, rate=0.12):
    return price * (1 + rate)

def format_money(amount):
    return f"{amount:,.2f} söm"

print(format_money(add_vat(250000)))
```

```text
280,000.00 söm
```

Kiçik funksiyalarga nom beriş, ularni test qiliş va qayta işlatiş osonroq. **Interfeysni** ham kiçik saqlang: bir neçta parametr, `True`/`False` "rejim" bayroqlarisiz (`format_name(name, True)` heç narsa demaydi) va bir turdagi qaytariladigan qiymat.

## 2. Özini tuşuntiradigan nomlar

`calc(x, y)` ni `calculate_discount(price, percent)` bilan soliştiring:

- Funksiyalar iş **bajaradi**, şuning uçun nomni feʼldan boşlang: `get_`, `calculate_`, `print_`.
- Ha/yöq savoliga javob beradigan funksiyalar `is_`, `has_` yoki `can_` bilan boşlanadi va mantiqiy qiymat qaytaradi.
- Parametrlarni turi böyiça emas, **maʼnosi** böyiça nomlang: `number` emas, `price`.

## 3. Mantiqni kiritiş va natijadan ajrating

Eng foydali dizayn odati: **hisob-kitoblarni** `input()` va `print()` dan alohida saqlang.

```python
# Mantiq: sof hisob-kitoblar, input ham, print ham yöq
def bmi(weight_kg, height_m):
    return weight_kg / height_m ** 2

def bmi_category(value):
    if value < 18.5:
        return "vazn yetişmaydi"
    if value < 25:
        return "normal"
    return "ortiqça vazn"

# Kiritiş va natija: foydalanuvçi bilan muloqot qiladi va mantiqdan foydalanadi
def main():
    weight = float(input("Vazn (kg): "))
    height = float(input("Böy (m): "))
    value = bmi(weight, height)
    print(f"TVI {value:.1f}: {bmi_category(value)}")

# Mantiqni heç narsa kiritmasdan tekşiriş mumkin
assert round(bmi(70, 1.75), 1) == 22.9
assert bmi_category(18.5) == "normal"          # çegara
assert bmi_category(25) == "ortiqça vazn"      # çegara
print("Barça tekşiruvlar ötdi")
```

```text
Barça tekşiruvlar ötdi
```

Dastur sifatida işga tuşiriş uçun faylning oxirida `main()` ni çaqiring. *Modullar va import* darsi buning standart usulini körsatadi: `if __name__ == "__main__": main()`.

Mantiqni heç narsa kiritmasdan **test qiliş** va `input()` siz **qayta işlatiş** mumkin, `main()` esa dasturning qisqaça mazmuni kabi öqiladi.

## 4. Sof funksiyalarni afzal köring

**Sof funksiya (pure function)**:

1. natijasi **faqat** argumentlariga boğliq bölgan qiymat qaytaradi va
2. **qöşimça taʼsirlarga (side effects)** ega emas: çop etmaydi, kiritiş öqimaydi, global özgaruvçilarni va argumentlarini özgartirmaydi.

```python
# Sof: bir xil kiritiş → bir xil natija, boşqa heç narsa sodir bölmaydi
def apply_discount(prices, percent):
    return [p * (1 - percent / 100) for p in prices]

# Sof emas: çaqiruvçining röyxatini özgartiradi va çop etadi
def apply_discount_in_place(prices, percent):
    prices[:] = apply_discount(prices, percent)
    print("Çegirma qöllandi")
```

Dasturlarga qöşimça taʼsirlar (çop etiş, fayllarni saqlaş) baribir kerak; ularni `main()` kabi bir neçta joyda saqlang, qolganini esa sof qoldiring.

## 5. Sehrli sonlarsiz

**Sehrli son (magic number)** - kod örtasida tuşuntirişsiz turgan qiymat. `return subtotal * 1.12 + 20000` da `1.12` va `20000` nima? Nomlangan konstantalar bunga javob beradi:

```python
VAT_RATE = 0.12
FREE_DELIVERY_FROM = 150_000
DELIVERY_FEE = 20_000

def delivery_total(subtotal):
    total = subtotal * (1 + VAT_RATE)
    if subtotal < FREE_DELIVERY_FROM:
        total += DELIVERY_FEE
    return total

print(round(delivery_total(100_000)))
print(round(delivery_total(200_000)))
```

```text
132000
224000
```

Endi kod özini özi tuşuntiradi, yetkazib beriş narxi özgarganda esa uni **bitta** joyda özgartirasiz.

## 6. Kelişuvni hujjatlaştiring

Oddiy funksiyalardan boşqa har qanday funksiyada docstring funksiya **nima** qilişini, nimani kutişini va nima qaytarişini aytişi kerak:

```python
def split_bill(total, people, tip_percent=10):
    """Har bir kişi çoy pulini qöşgan holda qança tölaşini qaytaradi.

    total: çoy pulisiz hisob summasi
    people: hisobni neçta kişi bölişadi (kamida 1)
    """
    with_tip = total * (1 + tip_percent / 100)
    return with_tip / people

print(round(split_bill(300000, 4), 2))
```

```text
82500.0
```

::: details Oldindan köriş: type hintlar
*Type hintlar* darsida turlarni signaturada yozişni örganasiz: `def split_bill(total: float, people: int, tip_percent: float = 10) -> float:`. Ular sizga hozirça kerak emas.
:::

## Qayta tuziş: batafsil misol

**Qayta tuziş (refactoring)** - kod nima qilişini özgartirmasdan uning tuzilişini yaxşilaş. Mana odatiy birinçi skript:

```python
scores_text = "Aziza:92,Bekzod:67,Dilnoza:85,Farrux:48"
entries = scores_text.split(",")
total = 0
count = 0
print("HISOBOT")
print("-------")
for e in entries:
    parts = e.split(":")
    n = parts[0]
    s = int(parts[1])
    total = total + s
    count = count + 1
    if s >= 60:
        print(n, s, "ÖTDI")
    else:
        print(n, s, "ÖTMADI")
print("-------")
print("Örtaça:", total / count)
```

Tahlil qiliş, baholaş va çop etiş bir-biriga çirmaşib ketgan. Mana u uçta kiçik qadamdan keyin:

```python
PASS_MARK = 60

# 1-qadam: tahlil qilişni alohida ajratamiz
def parse_scores(text):
    result = []
    for entry in text.split(","):
        name, score = entry.split(":")
        result.append((name, int(score)))
    return result

# 2-qadam: qoidalarni ajratamiz va sehrli songa nom beramiz
def grade(score):
    return "ÖTDI" if score >= PASS_MARK else "ÖTMADI"

def average(numbers):
    return sum(numbers) / len(numbers)

# 3-qadam: hisobotni öz qatorlarini qaytaradigan bitta funksiyada yasaymiz
def report_lines(records):
    lines = ["HISOBOT", "-------"]
    for name, score in records:
        lines.append(f"{name} {score} {grade(score)}")
    lines.append("-------")
    lines.append(f"Örtaça: {average([s for _, s in records])}")
    return lines

records = parse_scores("Aziza:92,Bekzod:67,Dilnoza:85,Farrux:48")
for line in report_lines(records):
    print(line)

# Eski skript aynan şu qatorlarni çop etgan edi
before = [
    "HISOBOT",
    "-------",
    "Aziza 92 ÖTDI",
    "Bekzod 67 ÖTDI",
    "Dilnoza 85 ÖTDI",
    "Farrux 48 ÖTMADI",
    "-------",
    "Örtaça: 73.0",
]
assert report_lines(records) == before
```

```text
HISOBOT
-------
Aziza 92 ÖTDI
Bekzod 67 ÖTDI
Dilnoza 85 ÖTDI
Farrux 48 ÖTMADI
-------
Örtaça: 73.0
```

Natija aynan bir xil va `assert` buni isbotlaydi: `before` da eski skript çop etgan qatorlar turibdi, şuning uçun bitta belgi özgarsa ham dastur `AssertionError` bilan töxtaydi. Qatorlarni çop etiş örniga qaytariş şu tekşiruvni mumkin qiladi, ballarni fayldan öqiş esa faqat `parse_scores` ni özgartirgan bölardi.

**Alohida qadam: formatlaşni yaxşilaş.** Dastur nimani çop etişini faqat qayta tuziş tekşirilgandan keyin özgartirasiz va `before` ni ataylab yangilaysiz. Masalan, `report_lines` içidagi `f"{name:<9}{score:>4}  {grade(score)}"` qatorlarni `Aziza      92  ÖTDI` kabi tekislangan ustunlarga aylantiradi.

::: tip Xavfsiz qayta tuziş
**Bir vaqtda bitta narsani** özgartiring va har bir qadamdan keyin tekşiruvlaringizni qayta işga tuşiring. Avval tuzilişni özgartiring; natijani keyin özgartiring.
:::

## Özingiz sinab köring

Quyidagi funksiya juda köp iş qiladi. Uni kamida uçta kiçik funksiyaga böling: biri tahlil qiliş, biri hisoblaş va biri formatlaş uçun.

<ClientOnly><PythonPlayground :code='"def do_everything(order_text):\n    total = 0\n    lines = []\n    for part in order_text.split(\";\"):\n        name, qty, price = part.split(\",\")\n        line_total = int(qty) * int(price)\n        total += line_total\n        lines.append(f\"{name:<8}{qty:>3} x {int(price):>7,} = {line_total:>9,}\")\n    for line in lines:\n        print(line)\n    print(f\"JAMI: {total * 1.12:,.0f} söm (12% QQS bilan)\")\n\ndo_everything(\"Çoy,2,15000;Somsa,4,8000;Şarbat,1,12000\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Qaytariş örniga çop etadigan funksiyalar

```python
# Yomon: çop etadi, şuning uçun natijadan foydalanib bölmaydi
def average(scores):
    print(sum(scores) / len(scores))

result = average([80, 90])
print(result)
```

```text
85.0
None
```

`average` sonni körsatadi, lekin `None` qaytaradi, şuning uçun dastur uni soliştira, saqlay va test qila olmaydi. **Tuzatiş:** `return sum(scores) / len(scores)`, çop etişni esa bitta joyda qiling.

### 2. Global özgaruvçilarga yaşirin boğliqlik

```python
discount = 10

# Yomon: natija boşqa kod özgartirişi mumkin bölgan globalga boğliq
def final_price(price):
    return price * (1 - discount / 100)

print(final_price(50000))
discount = 50                  # dasturning boşqa bir joyida...
print(final_price(50000))      # bir xil çaqiriş, boşqa javob
```

```text
45000.0
25000.0
```

**Tuzatiş:** funksiyaga kerakli narsani argument sifatida uzating: `def final_price(price, discount):`.

### 3. Haddan taşqari bölib yuboriş

```py
# Yomon: har biri bir marta işlatiladigan mitti funksiyalar
def get_name(entry):
    return entry.split(":")[0]

def get_score(entry):
    return int(entry.split(":")[1])
```

Mitti funksiyalar öquvçini u yoqdan bu yoqqa sakratadi; `(name, score)` qaytaradigan bitta `parse_entry(entry)` tuşunarliroq. Qism aniq nom va maqsadga ega bölsa yoki bir neçta joyda işlatilsa, uni ajrating.

## Maşqlar

### 1. Yaxşiroq nom bering <Difficulty level="1" />

Kod özini özi tuşuntirişi uçun funksiya va parametrlarning nomini özgartiring.

```python
def f(a, b):
    return a * b / 100

print(f(250000, 15))
```

::: details Yeçim
```python
def percent_of(amount, percent):
    return amount * percent / 100

print(percent_of(250000, 15))
```
:::

### 2. Sehrli sonlarni olib taşlang <Difficulty level="1" />

```python
def shipping_cost(weight):
    if weight <= 2:
        return 25000
    return 25000 + (weight - 2) * 8000
```

::: details Yeçim
```python
BASE_WEIGHT_KG = 2
BASE_COST = 25_000
COST_PER_EXTRA_KG = 8_000

def shipping_cost(weight_kg):
    if weight_kg <= BASE_WEIGHT_KG:
        return BASE_COST
    extra_kg = weight_kg - BASE_WEIGHT_KG
    return BASE_COST + extra_kg * COST_PER_EXTRA_KG

assert shipping_cost(1) == 25000
assert shipping_cost(5) == 49000
print("OK")
```
:::

### 3. Mantiqni kiritiş-çiqarişdan ajrating <Difficulty level="2" />

Buni `(hours, minutes, seconds)` qaytaradigan **sof** `convert_seconds(total)` funksiyasiga va kiritiş hamda natija bilan işlaydigan alohida qismga böling. `3725` → `(1, 2, 5)` va `59` → `(0, 0, 59)` uçun `assert` tekşiruvlarini qöşing.

```python
def show_time():
    total = int(input("Soniyalar: "))
    print(total // 3600, "soat", total % 3600 // 60, "daqiqa", total % 60, "soniya")
```

::: details Yeçim
```python
def convert_seconds(total):
    hours, rest = divmod(total, 3600)
    minutes, seconds = divmod(rest, 60)
    return hours, minutes, seconds

def show_time():
    total = int(input("Soniyalar: "))
    h, m, s = convert_seconds(total)
    print(f"{h} soat {m} daqiqa {s} soniya")

assert convert_seconds(3725) == (1, 2, 5)
assert convert_seconds(59) == (0, 0, 59)
print("OK")
```
:::

### 4. Bayroqni almaştiring <Difficulty level="2" />

`format_name("aziza", "karimova", True)` `"Karimova, Aziza"` ni, `False` esa `"Aziza Karimova"` ni qaytaradi. Uni taʼrifiga qaramasdan ham çaqirişlar tuşunarli böladigan qilib qayta loyihalang.

```python
def format_name(first, last, flag):
    if flag:
        return f"{last.title()}, {first.title()}"
    return f"{first.title()} {last.title()}"
```

::: details Yeçim
Aniq nomlangan ikki funksiya (`last_name_first=True` kabi faqat kalit söz bilan beriladigan argument ham işlaydi):

```python
def display_name(first, last):
    return f"{first.title()} {last.title()}"

def sortable_name(first, last):
    return f"{last.title()}, {first.title()}"

print(display_name("aziza", "karimova"))
print(sortable_name("aziza", "karimova"))
```

:::

### 5. Qayta tuzişni qayta tuzing <Difficulty level="3" />

Yuqoridagi **Özingiz sinab köring** bölimidagi dasturni kiçik funksiyalarga qayta tuzing:

- `parse_order(text)` sonlari `int` bölgan `(name, qty, price)` kortejlari röyxatini qaytaradi,
- `order_total(items, vat_rate=0.12)` QQS bilan jami summani qaytaradi,
- `print_order(text)` ulardan foydalanib, avvalgi bilan bir xil natijani çop etadi.

Ikkita sof funksiya uçun `assert` tekşiruvlarini qöşing.

::: details Yeçim
```python
VAT_RATE = 0.12

def parse_order(text):
    items = []
    for part in text.split(";"):
        name, qty, price = part.split(",")
        items.append((name, int(qty), int(price)))
    return items

def order_total(items, vat_rate=VAT_RATE):
    return sum(qty * price for _, qty, price in items) * (1 + vat_rate)

def print_order(text):
    items = parse_order(text)
    for name, qty, price in items:
        print(f"{name:<8}{qty:>3} x {price:>7,} = {qty * price:>9,}")
    print(f"JAMI: {order_total(items):,.0f} söm ({VAT_RATE:.0%} QQS bilan)")

assert parse_order("Çoy,2,15000") == [("Çoy", 2, 15000)]
assert round(order_total([("A", 1, 100)])) == 112

print_order("Çoy,2,15000;Somsa,4,8000;Şarbat,1,12000")
```

```text
Çoy       2 x  15,000 =    30,000
Somsa     4 x   8,000 =    32,000
Şarbat    1 x  12,000 =    12,000
JAMI: 82,880 söm (12% QQS bilan)
```
:::

## Xulosa

- Har bir funksiyaga **bitta vazifa** va u nima qilişini aytadigan **nom** bering.
- **Hisob-kitoblarni** sof funksiyalarda, **kiritiş va natijani** esa `main()` kabi bir neçta joyda saqlang.
- **Sof funksiyalar** qöşimça taʼsirlarga ega emas, şuning uçun ularni `assert` bilan test qiliş oson.
- **Sehrli sonlarni** nomlangan konstantalar bilan almaştiring, rejim bayroqlaridan qoçing va funksiyalarni docstring bilan hujjatlaştiring.
- Kodni kiçik qadamlar bilan **qayta tuzing** va natija özgarmaganini tekşiring.

## Qöşimça manbalar

- [PEP 8 - Style guide (naming conventions)](https://peps.python.org/pep-0008/#naming-conventions)
- [PEP 257 - Docstring conventions](https://peps.python.org/pep-0257/)
- [PEP 20 - The Zen of Python](https://peps.python.org/pep-0020/)
