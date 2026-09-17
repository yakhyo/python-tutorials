---
title: Qaytariladigan qiymatlar
description: "return yordamida funksiyadan natija qaytaring: return va print farqi, None, funksiyadan erta çiqiş, bir neça qiymat qaytariş, mantiqiy yordamçi funksiyalar va dasturni kiçik funksiyalardan quriş."
---

# Qaytariladigan qiymatlar

![Rasm: Qaytariladigan qiymatlar](/images/topics-webp-uzb/return-values.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `return` qiymatni çaqiruvçiga qanday qaytaradi
- **Qaytariş** va **çop etiş** orasidagi farq
- `None` nima va funksiya uni qaçon qaytaradi
- `return` funksiyani qanday erta tugatadi va bu nega foydali
- Bir yöla bir neça qiymatni qanday qaytariş
:::

## Nega bu muhim

`len()`, `max()` va `input()` kabi içki funksiyalar natijani çop etmaydi. Ular natijani **qaytaradi**, şuning uçun uni saqlaş, u bilan hisob-kitob qiliş va boşqa joyga uzatiş mumkin: `total = len(items) * price`. Qiymat qaytaradigan funksiyalar quriliş bloklariga öxşaydi. Faqat çop etadigan funksiyalar esa boşi berk köçaga öxşaydi. Bu dars funksiyalaringizni haqiqiy quriliş bloklariga aylantiradi.

## `return` qiymatni qaytaradi

```python
def square(n):
    return n * n

result = square(7)
print(result)
print(square(3) + square(4))
```

```text
49
25
```

Python `return` ga yetib kelganda:

1. `return` dan keyingi ifodani hisoblaydi,
2. **funksiyadan darhol çiqadi**,
3. qiymatni funksiya çaqirilgan joyga qöyadi.

Şunday qilib, `square(3) + square(4)` `9 + 16` ga aylanadi.

## Qaytariş va çop etiş

Bu darsdagi eng muhim farq:

```python
def add_print(a, b):
    print(a + b)       # natijani körsatadi, heç narsa qaytarmaydi

def add_return(a, b):
    return a + b       # natijani qaytaradi, heç narsa körsatmaydi

x = add_print(2, 3)
y = add_return(2, 3)

print(f"x = {x}")
print(f"y = {y}")
```

```text
5
x = None
y = 5
```

`add_print` ekranga `5` ni çiqardi, lekin dastur bu qiymatdan **foydalana olmaydi**: `x` - `None`. `add_return` özi heç narsa çop etmadi, lekin `y` da işlatişga tayyor `5` turibdi.

::: warning Interaktiv qobiq return ni print ga öxşatib körsatadi
Xuddi şu çaqirişlarni interaktiv `>>>` qobiğiga yozsangiz, ikkalasi ham 5 ni "körsatgandek" böladi:

```text
>>> add_print(2, 3)
5
>>> add_return(2, 3)
5
```

Qobiq siz yozgan har bir ifodaning qiymatini aks ettiradi. Skript va bu saytdagi muharrir esa bunday qilmaydi: u yerda alohida qatordagi `add_return(2, 3)` heç narsa körsatmaydi.
:::

| Funksiya içidagi `print()` | `return` |
|---|---|
| **foydalanuvçiga** nimanidir körsatadi | **dasturga** qiymat beradi |
| qiymat körsatilgandan keyin yöqoladi | qiymatni saqlaş, birlaştiriş va tekşiriş mumkin |

Yaxşi odat: funksiyalar **hisoblaydi va qaytaradi**. Çop etiş-etmaslikni ularni çaqiradigan kod hal qiladi.

```python
def calculate_total(prices, tax_rate):
    subtotal = sum(prices)
    return subtotal * (1 + tax_rate)

total = calculate_total([15000, 45000, 8000], 0.12)
print(f"Jami: {total:,.0f} söm")               # qanday körsatişni çaqiruvçi hal qiladi
if total > 50000:
    print("Sizga bepul yetkazib beriş mumkin!")  # ...va u asosida qaror qabul qila oladi
```

```text
Jami: 76,160 söm
Sizga bepul yetkazib beriş mumkin!
```

## `None`: "qiymat yöq" qiymati

`return` siz yoki yakka `return` bilan tugaydigan funksiya `None` qaytaradi:

```python
def say_hi():
    print("Salom")

result = say_hi()
print(result)
print(type(result))
```

```text
Salom
None
<class 'NoneType'>
```

`None` - Pythonning "bu yerda heç narsa yöq" deyiş usuli. U yolğon (falsy) hisoblanadi va uni tekşirişning tavsiya etilgan usuli - `is None`:

```python
def find_first_negative(numbers):
    for n in numbers:
        if n < 0:
            return n
    return None          # heç narsa topilmadi (buni yoziş niyatni aniq körsatadi)

result = find_first_negative([4, 7, 1])
if result is None:
    print("Manfiy sonlar yöq")
else:
    print(f"Topildi: {result}")
```

```text
Manfiy sonlar yöq
```

`if not result:` örniga `is None` işlating, çunki `0` ham yolğon hisoblanadi, lekin u butunlay töğri natija bölişi mumkin.

## Erta qaytariş

`return` funksiyadan **darhol** çiqadi, hatto sikl içidan ham. Bu qidiruvni soddalaştiradi, `break` yoki bayroq özgaruvçisi kerak bölmaydi:

```python
def contains_digit(text):
    for char in text:
        if char.isdigit():
            return True      # topildi: şu yerda toxtaymiz
    return False             # sikl heç narsa topmasdan tugadi

print(contains_digit("abc2def"))
print(contains_digit("abcdef"))
```

```text
True
False
```

Bu boşida maxsus holatlarni uşlaş uçun ham juda qulay. Bunday tekşiruvlar **himoya şartlari (guard clauses)** deb ataladi:

```python
def divide(a, b):
    if b == 0:
        return None          # himoya: avval muammoli holatni hal qilamiz
    return a / b

print(divide(10, 4))
print(divide(10, 0))
```

```text
2.5
None
```

Himoya şartlari asosiy mantiqni çekinişsiz va öqişga oson qoldiradi.

Muammo uçun `None` qaytariş kiçik dasturlarda mayli, lekin çaqiruvçi tekşirişni unutib, keyin `None` bilan hisob-kitob qilişga urinişi mumkin. Haqiqiy xatolar uçun **istisno çaqirasiz**, u dasturni aniq xabar bilan töxtatadi; buni *Istisnolarni qayta işlaş* darsi körsatadi.

## Bir neça qiymat qaytariş

Qiymatlarni vergul bilan ajratsangiz, **kortej** qaytariladi. Çaqirişda uni ajratib oling (*Kortejlar va qiymatlarni ajratiş* darsiga qarang):

```python
def min_max_average(numbers):
    return min(numbers), max(numbers), sum(numbers) / len(numbers)

low, high, avg = min_max_average([72, 95, 58, 88])
print(f"eng past {low}, eng yuqori {high}, örtaça {avg:.1f}")
```

```text
eng past 58, eng yuqori 95, örtaça 78.2
```

Uç-törttadan köp qiymat uçun luğat qaytariş köpinça tuşunarliroq, çunki çaqiruvçi örinlar örniga nomlardan foydalanadi:

```python
def analyze(text):
    words = text.split()
    return {
        "characters": len(text),
        "words": len(words),
        "longest": max(words, key=len),
    }

stats = analyze("Python funksiyalari foydali qiymatlar qaytaradi")
print(stats["words"], stats["longest"])
```

```text
5 funksiyalari
```

## Mantiqiy funksiyalar

Ha/yöq savoliga javob beradigan funksiyalar `True` yoki `False` qaytarişi kerak. Kod tabiiy öqilişi uçun ularni savol kabi nomlang: `is_…`, `has_…`, `can_…`:

```python
def is_leap_year(year):
    return (year % 4 == 0 and year % 100 != 0) or year % 400 == 0

def can_vote(age):
    return age >= 18

for year in [2024, 2026]:
    if is_leap_year(year):
        print(f"{year} — kabisa yili")

print(can_vote(17))
```

```text
2024 — kabisa yili
False
```

`return age >= 18` ga eʼtibor bering: taqqoslaşning özi allaqaçon mantiqiy qiymat. `if age >= 18: return True else: return False` yozişga hojat yöq.

## Funksiyalarni birlaştiriş

Qaytarilgan qiymatlarni töğridan-töğri boşqa funksiyalarga uzatiş mumkin bölgani uçun kiçik funksiyalar kattaroq funksiyalarga birlaşadi:

```python
def celsius_to_fahrenheit(c):
    return c * 9 / 5 + 32

def describe_temperature(c):
    if c < 0:
        return "ayoz"
    if c < 20:
        return "salqin"
    if c < 30:
        return "iliq"
    return "issiq"

def weather_report(city, c):
    f = celsius_to_fahrenheit(c)
    return f"{city}: {c}°C / {f:.0f}°F, {describe_temperature(c)}"

print(weather_report("Toşkent", 34))
print(weather_report("Moskva", -5))
```

```text
Toşkent: 34°C / 93°F, issiq
Moskva: -5°C / 23°F, ayoz
```

Har bir funksiya kiçik, alohida tekşirilişi mumkin va bitta aniq vazifaga ega. Funksiya hatto **özini** çaqirişi ham mumkin, bu *Özgaruvçilarning köriniş sohasi* darsidan keyingi *Rekursiya* darsining asosiy ğoyasi. *Funksiyalarni töğri loyihalaş* darsi aynan şu yönalişni rivojlantiradi.

::: tip assert bilan tezkor tekşiruv
Şart yolğon bölsa, `assert` dasturni xato bilan toxtatadi. Bu funksiya kutilgan qiymatni qaytarayotganini tekşirişning oddiy usuli:

```python
def square(n):
    return n * n

assert square(3) == 9
assert square(-2) == 4
print("Barça tekşiruvlar ötdi")
```
:::

## Özingiz sinab köring

Baholaş funksiyalarini tugating va ularni turli ballar bilan sinab köring.

<ClientOnly><PythonPlayground :code='"def letter_grade(score):\n    if score >= 90:\n        return \"A\"\n    if score >= 80:\n        return \"B\"\n    if score >= 70:\n        return \"C\"\n    return \"F\"\n\ndef average(scores):\n    if not scores:\n        return None\n    return sum(scores) / len(scores)\n\nscores = [88, 92, 79]\navg = average(scores)\nprint(f\"Örtaça: {avg:.1f} → {letter_grade(avg)}\")\nprint(average([]))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Qaytariş örniga çop etiş

```py
def double(n):
    print(n * 2)

result = double(5) + 1
```

```text
10
TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'
```

`double(5)` `10` ni çop etdi, lekin `None` qaytardi. **Tuzatiş:** `return n * 2`.

### 2. Bir tarmoqda `return` ni unutiş

```python
def sign(n):
    if n > 0:
        return "musbat"
    elif n < 0:
        return "manfiy"
    # nol holati unutildi

print(sign(0))   # None
```

Funksiya orqali ötadigan **har bir yöl** qiymat qaytarişiga işonç hosil qiling.

### 3. Sikl içida juda erta qaytariş

```python
def all_positive(numbers):
    for n in numbers:
        if n > 0:
            return True      # faqat birinçi elementga qarab qaror qiladi!
        return False

print(all_positive([5, -1, -2]))   # True (notöğri)
```

**Tuzatiş:** musbat bölmagan sonni topişingiz bilan `False` qaytaring, `True` ni esa faqat sikldan **keyin** qaytaring:

```python
def all_positive(numbers):
    for n in numbers:
        if n <= 0:
            return False
    return True

print(all_positive([5, -1, -2]))   # False
```

### 4. Qaytarilgan qiymatni eʼtiborsiz qoldiriş

```python
name = "aziza"
name.upper()          # natija taşlab yuboriladi
print(name)
```

```text
aziza
```

`upper()` yangi satr **qaytaradi**; u `name` ni özgartirmaydi. `sorted(items)` va öz funksiyalaringiz ham şunday. **Tuzatiş:** natijani saqlang yoki işlating: `name = name.upper()`.

## Maşqlar

### 1. Doira yuzi <Difficulty level="1" />

`math.pi` yordamida `π × r²` ni qaytaradigan `circle_area(radius)` funksiyasini yozing. Radiusi `3` bölgan doira yuzini 2 ta önlik xonagaça yuvarlab çop eting.

::: details Yeçim
```python
import math

def circle_area(radius):
    return math.pi * radius ** 2

print(round(circle_area(3), 2))
```

```text
28.27
```

`import math` sizga `math.pi` saqlanadigan `math` moduliga kiriş imkonini beradi. Importlar *Modullar va import* darsida batafsil tuşuntiriladi.
:::

### 2. Juftmi? <Difficulty level="1" />

`if` buyruğisiz `True` yoki `False` qaytaradigan `is_even(n)` funksiyasini yozing. U yordamida 1 dan 10 gaça bölgan juft sonlar röyxatini tuzing.

::: details Yeçim
```python
def is_even(n):
    return n % 2 == 0

evens = [n for n in range(1, 11) if is_even(n)]
print(evens)
```
:::

### 3. Töliq ism <Difficulty level="2" />

Boş harflari töğri yozilgan ismni qaytaradigan `full_name(first, last, middle="")` funksiyasini yozing. Otasining ismi faqat berilgan bölsagina qöşilsin. `full_name("aziza", "karimova")` → `"Aziza Karimova"`, `full_name("bekzod", "tursunov", "aliyeviç")` → `"Bekzod Aliyeviç Tursunov"`.

::: details Yeçim
```python
def full_name(first, last, middle=""):
    if middle:
        return f"{first.title()} {middle.title()} {last.title()}"
    return f"{first.title()} {last.title()}"

assert full_name("aziza", "karimova") == "Aziza Karimova"
assert full_name("bekzod", "tursunov", "aliyeviç") == "Bekzod Aliyeviç Tursunov"
print("OK")
```
:::

### 4. Indeksni topiş <Difficulty level="2" />

`target` birinçi uçragan örinni, u yöq bölsa `-1` ni qaytaradigan `index_of(items, target)` funksiyasini yozing. `.index()` dan foydalanmang.

::: details Yeçim
```python
def index_of(items, target):
    for i, item in enumerate(items):
        if item == target:
            return i
    return -1

assert index_of(["a", "b", "c"], "c") == 2
assert index_of(["a", "b", "c"], "z") == -1
assert index_of([], "a") == -1
print("OK")
```
:::

### 5. Parol mustahkamligi <Difficulty level="3" />

`(is_strong, problems)` **kortejini** qaytaradigan `check_password(password)` funksiyasini yozing. Bu yerda `problems` - buzilgan har bir qoida uçun xabarlar röyxati:

- kamida 8 ta belgi
- kamida bitta raqam
- kamida bitta boş harf
- kamida bitta kiçik harf

Keyin uni `"abc"`, `"password1"` va `"Tea4Two!"` uçun çaqiradigan va natijalarni çiroyli çop etadigan kod yozing.

::: details Yeçim
```python
def check_password(password):
    problems = []
    if len(password) < 8:
        problems.append("kamida 8 ta belgi işlating")
    if not any(ch.isdigit() for ch in password):
        problems.append("raqam qöşing")
    if not any(ch.isupper() for ch in password):
        problems.append("boş harf qöşing")
    if not any(ch.islower() for ch in password):
        problems.append("kiçik harf qöşing")
    return len(problems) == 0, problems

for pw in ["abc", "password1", "Tea4Two!"]:
    is_strong, problems = check_password(pw)
    if is_strong:
        print(f"{pw}: mustahkam")
    else:
        print(f"{pw}: zaif ({'; '.join(problems)})")
```

```text
abc: zaif (kamida 8 ta belgi işlating; raqam qöşing; boş harf qöşing)
password1: zaif (boş harf qöşing)
Tea4Two!: mustahkam
```

Funksiya heç narsa çop etmaydi. Natijani qanday körsatişni çaqiruvçi kod hal qiladi, şuning uçun aynan şu funksiya veb-sayt formasida ham işlatilişi mumkin.
:::

## Xulosa

- `return value` funksiyani tugatadi va qiymatni çaqiruvçiga beradi, u yerda qiymatni saqlaş va işlatiş mumkin.
- Dastur foydalanadigan qiymatlarni **qaytaring**, foydalanuvçiga yakuniy natijani körsatiş uçungina **çop eting**.
- `return` siz funksiya `None` qaytaradi. Uni `is None` bilan tekşiring.
- `return` darhol çiqadi, bu qidiruvlar va **himoya şartlari** uçun foydali.
- `return a, b` kortej qaytaradi, uni `x, y = f()` bilan ajratib oling. Nomli natijalar köp bölsa, luğat işlating.
- Mantiqiy funksiyalarni savol kabi nomlang va şartni töğridan-töğri qaytaring: `return age >= 18`.

## Qöşimça manbalar

- [Python Tutorial - Defining functions (return)](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)
- [The `return` statement](https://docs.python.org/3/reference/simple_stmts.html#the-return-statement)
- [The `assert` statement](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)
