---
title: Modullar va import
description: "import yordamida boşqa fayllardagi koddan foydalaniş: import usullari, modullarni örganiş, öz modul va paketlaringizni yoziş hamda __name__ == \"__main__\" tekşiruvi."
---

# Modullar va import

![Rasm: Modullar va import](/images/topics-webp-uzb/modules-and-imports.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Modul** (module) nima va Python kodi nega modullarga bölinadi
- Uç xil import usuli: `import x`, `from x import y` va `import x as y`
- Modulni `dir()` va `help()` bilan qanday örganiş
- Öz modul va paketlaringizni qanday yoziş va dasturni fayllarga qanday böliş
- `if __name__ == "__main__":` nimani anglatadi va qaçon işlatiladi
:::

## Nega bu muhim

Haqiqiy dasturlar fayllarga bölinadi: dökon ilovasida mahsulotlar uçun bitta, tölovlar uçun boşqa fayl bölişi mumkin. Heç kim kvadrat ildizni özi yozmaydi: Python bilan birga yuzlab sinovdan ötgan modullar, yaʼni **standart kutubxona** (standard library) keladi. Import qiliş - ulardan foydalaniş usuli.

## Modul nima

**Modul** - bu şunçaki Python fayli. Uning nomi `.py` siz fayl nomi: `math` sizga matematik funksiyalarni beradi, siz yozgan `prices.py` fayli esa `prices` nomli modul.

```python
import math

print(math.sqrt(81))
print(math.pi)
```

```text
9.0
3.141592653589793
```

`import math` sizga modul içidagi hamma narsani saqlaydigan `math` nomini beradi. Tarkibiga nuqta orqali murojaat qilasiz: `math.sqrt`. PEP 8 tavsiyasiga köra, importlar faylning **boşida** turadi.

## Import qilişning uç usuli

### `import module`

```python
import random

random.seed(1)
print(random.randint(1, 6))
```

```text
2
```

Oldindagi modul nomi har bir nom qayerdan kelganini körsatadi. Bu odatiy usul.

### `from module import name`

```python
from math import sqrt, pi

print(sqrt(16))
print(round(pi, 2))
```

```text
4.0
3.14
```

Endi `sqrt` va `pi` töğridan-töğri mavjud, lekin `math` nomining özi aniqlan**magan**.

### `import module as alias`

```python
import statistics as st

scores = [78, 92, 85, 64]
print(st.mean(scores))
```

```text
79.75
```

`as` modulga qisqaroq nom beradi, masalan `import pandas as pd`.

### `from module import *` dan saqlaning

`*` **barça** oçiq nomlarni import qiladi va bu sizning özgaruvçilaringizni indamay almaştirib yuborişi mumkin:

```python
e = "Elbek"            # öquvçi ismini saqlaydigan özgaruvçi
from math import *     # math da e nomli konstanta bor...

print(e)
```

```text
2.718281828459045
```

Sizning `e` özgaruvçingiz `math.e` bilan qayta yozildi. `import math` bilan bunday bölişi mumkin emas.

## Modulni örganiş

`dir()` modul içidagi nomlarni röyxatlaydi. Töliq röyxat uzun, şuning uçun uni filtrlang:

```python
import math

names = [name for name in dir(math) if name.startswith("is")]
print(names)
```

```text
['isclose', 'isfinite', 'isinf', 'isnan', 'isqrt']
```

`help(math.isclose)` funksiyaning hujjatini körsatadi (interaktiv qobiqda undan çiqiş uçun `q` ni bosing).

## Öz modulingizni yoziş

::: info Köp faylli misollar kompyuteringizda işlaydi
Bu sahifadagi muharrir bir vaqtda bitta faylni işga tuşiradi, şuning uçun bir neçta `.py` faylli misol va maşqlarda "Işga tuşiriş" tugmasi yöq. Ularni kompyuteringizda (fayllarni bitta papkaga qöyib) yoki fayl brauzeri bir neçta fayl yaratiş imkonini beradigan [Laboratoriyada](/uz/laboratoriya) sinab köring.
:::

Har qanday `.py` faylni **şu papkadagi** boşqa fayl import qila oladi:

```py
# greetings.py
DEFAULT_CITY = "Toşkent"

def hello(name):
    return f"Salom, {name}!"

def welcome(name, city=DEFAULT_CITY):
    return f"{city} şahriga xuş kelibsiz, {name}."
```

```py
# main.py
import greetings

print(greetings.hello("Aziza"))
print(greetings.welcome("Bekzod", "Samarqand"))
print(greetings.DEFAULT_CITY)
```

`main.py` ni şu papkadan işga tuşiring:

```text
python main.py
```

```text
Salom, Aziza!
Samarqand şahriga xuş kelibsiz, Bekzod.
Toşkent
```

`greetings.py` ning yuqori darajasida aniqlangan hamma narsa `greetings` modulining atributiga aylanadi. `import greetings.py` emas, `import greetings` deb yozasiz. Modul bitta dastur davomida faqat **bir marta** işga tuşadi; uni yana import qilsangiz, öşa modul obyektidan qayta foydalaniladi.

### Python modullarni qanday topadi

Python avval siz işga tuşirgan skriptning papkasini, keyin standart kutubxonani, keyin örnatilgan paketlarni qidiradi (bu röyxat - `sys.path`). Modul heç birida bölmasa:

```py
import greetingz
```

```text
ModuleNotFoundError: No module named 'greetingz'
```

Odatda bu xato yoziş yoki fayl boşqa papkada bölgani.

## `if __name__ == "__main__":`

Har bir modulda `__name__` nomli örnatilgan özgaruvçi bor. Faylni töğridan-töğri **işga tuşirganingizda** u `"__main__"` böladi. Fayl **import qilinganda** esa u modul nomi böladi, masalan `"greetings"`:

```python
print(__name__)
```

```text
__main__
```

Bu nega muhim? Agar `greetings.py` `print(hello("Test"))` kabi sinov qatori bilan tugasa, har bir `import greetings` `Salom, Test!` ni ham çop etadi. Tuzatiş - dasturning işini `main()` funksiyasiga joylab, uni tekşiruv ortidan çaqiriş:

```python
def total_price(prices):
    return sum(prices)

def main():
    basket = [15000, 8000, 3000]
    print(f"Jami: {total_price(basket):,} söm")

if __name__ == "__main__":
    main()
```

```text
Jami: 26,000 söm
```

Uni "agar bu fayl işga tuşirilayotgan dastur bölsa, şuni bajar" deb öqing. Boşqa fayldan import qilinganda `__name__` modul nomi böladi, şuning uçun siz `total_price` ni çop etişsiz olasiz.

## Dasturni fayllarga böliş

Mana ikki fayldan iborat kiçik dökon dasturi, ikkalasi bitta papkada:

```py
# pricing.py
def apply_discount(amount, percent):
    return amount * (100 - percent) / 100

def format_som(amount):
    return f"{amount:,.0f} söm"
```

```py
# shop.py
from pricing import apply_discount, format_som

PRODUCTS = {"çoy": 15000, "somsa": 8000, "şarbat": 12000}

def main():
    order = ["çoy", "somsa", "somsa"]
    total = sum(PRODUCTS[item] for item in order)
    print("Çegirmadan oldin:", format_som(total))
    print("10% çegirma bilan:", format_som(apply_discount(total, 10)))

if __name__ == "__main__":
    main()
```

```text
python shop.py
```

```text
Çegirmadan oldin: 31,000 söm
10% çegirma bilan: 27,900 söm
```

Çegirma qoidalari özgarganda qaysi faylni oçiş kerakligini aniq bilasiz.

### Paketlar: papkadagi modullar

Loyihada modullar köp bölganda ularni **paket** (package) deb ataladigan papkaga guruhlaysiz:

```text
my_project/
├── main.py
└── shop/
    ├── __init__.py
    ├── pricing.py
    └── products.py
```

`main.py` da keyin `from shop import pricing` (va `pricing.format_som(...)` ni çaqirasiz) yoki `from shop.products import PRODUCTS` deb yozasiz. Nuqta "içidagi" degani: `shop.products` - `shop` paketi içidagi `products` moduli. `__init__.py` fayli papkani oddiy paket sifatida belgilaydi; u böş bölişi mumkin va paket birinçi marta import qilinganda işga tuşadi. Kutubxonalar ham xuddi şu şaklni işlatadi: `import matplotlib.pyplot as plt`.

::: details Standart kutubxona böylab qisqa sayohat
| Modul | Nima qiladi |
|---|---|
| `math`, `random`, `statistics` | hisob-kitob, tasodifiy sonlar, örtaça qiymatlar (*math, random va statistics*) |
| `datetime`, `time` | sana, vaqt, davomiylik (*Sana va vaqt*) |
| `collections`, `itertools` | `Counter`, `defaultdict`, sikl vositalari (*collections va itertools*) |
| `pathlib`, `csv`, `json`, `re` | fayllar, maʼlumot formatlari, matn andozalari (keyingi darslar) |
:::

::: info Taşqi paketlar
Boşqa odamlar yozgan minglab paketlarni **pip** degan vosita yordamida örnatiş mumkin. Paketlarni pip bilan örnatiş keyingi, ixtiyoriy lokal sozlaş darsida körib çiqiladi.
:::

## Özingiz sinab köring

Turli import usullarini sinab köring va `math` hamda `random` içida nimalar borligini örganing.

<ClientOnly><PythonPlayground :code='"import math\nimport random as rnd\nfrom statistics import mean\n\nprint(math.sqrt(144))\nprint(math.ceil(4.1), math.floor(4.9))\n\nrnd.seed(42)\nprint(rnd.choice([\"Toşkent\", \"Samarqand\", \"Buxoro\"]))\n\nprint(mean([5, 4, 5, 3]))\nprint(__name__)\n\nprint([name for name in dir(math) if name.startswith(\"f\")])"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Faylni standart modul nomi bilan nomlaş

Bekzod zar öyinini `random.py` deb saqlaydi:

```py
# random.py
import random

print(random.randint(1, 6))
```

```text
python random.py
```

```text
AttributeError: module 'random' has no attribute 'randint' (consider renaming '/home/bekzod/dice/random.py' since it has the same name as the standard library module named 'random' and prevents importing that standard library module)
```

Python **avval** skriptning öz papkasini qidiradi, şuning uçun `import random` haqiqiy modul örniga Bekzodning faylini import qiladi. **Tuzatiş:** faylni `dice_game.py` kabi nom bilan qayta nomlang va öz fayllaringizga `math.py`, `string.py`, `json.py` kabi nomlar bermang.

### 2. Ikki import usulini aralaştiriş

```py
from math import sqrt

print(math.sqrt(25))
```

```text
NameError: name 'math' is not defined. Did you forget to import 'math'?
```

`from math import sqrt` faqat `sqrt` ni aniqlaydi. Teskari xato, `import math` dan keyin `sqrt(25)`, `NameError: name 'sqrt' is not defined` beradi. **Tuzatiş:** `import math` bilan `math.sqrt(25)`, `from math import sqrt` bilan esa `sqrt(25)` deb yozing.

### 3. Importga `.py` qöşiş

```py
import math.py
```

```text
ModuleNotFoundError: No module named 'math.py'; 'math' is not a package
```

Python nuqtani "paket içidagi modul" deb öqiydi. Faqat modul nomi bilan import qiling: `import math`, yoki öz `greetings.py` faylingiz uçun `import greetings`.

## Maşqlar

### 1. Aylana kalkulyatori <Difficulty level="1" />

`math` dan faqat `pi` va `sqrt` ni import qiling. Radiusi `5` bölgan aylananing yuzini (2 ta önlik xona), keyin yuzi `100` bölgan aylananing radiusini (2 ta önlik xona) çop eting.

::: details Yeçim
```python
from math import pi, sqrt

area = pi * 5 ** 2
print(f"{area:.2f}")

radius = sqrt(100 / pi)
print(f"{radius:.2f}")
```

```text
78.54
5.64
```
:::

### 2. Modulni örganing <Difficulty level="1" />

`dir()` va comprehension ifodasidan foydalanib, `string` modulida pastki çiziq bilan boşlan**maydigan** nomlar neçta ekanini, keyin öşa nomlarni çop eting.

::: details Yeçim
```python
import string

public = [name for name in dir(string) if not name.startswith("_")]
print(len(public))
print(public)
```

```text
12
['Formatter', 'Template', 'ascii_letters', 'ascii_lowercase', 'ascii_uppercase', 'capwords', 'digits', 'hexdigits', 'octdigits', 'printable', 'punctuation', 'whitespace']
```

`_` bilan boşlanadigan nomlar içki. Oçiq nomlar orasida `digits` va `punctuation` kabi tayyor satrlar bor.
:::

### 3. Konvertor moduli <Difficulty level="2" />

`som_to_usd(som, rate=12600)` funksiyali va **faqat** fayl töğridan-töğri işga tuşirilganda işlaydigan qisqa öz-özini tekşiruvli `converters.py` modulini yarating. Keyin modulni import qilib, `1,000,000 söm` ni dollarda çop etadigan `app.py` ni yozing.

::: details Yeçim
```py
# converters.py
def som_to_usd(som, rate=12600):
    return som / rate

if __name__ == "__main__":
    assert som_to_usd(12600) == 1
    print("converters.py: barça tekşiruvlar ötdi")
```

```py
# app.py
import converters

print(f"{converters.som_to_usd(1_000_000):.2f} USD")
```

```text
python app.py
```

```text
79.37 USD
```

`python converters.py` ni işga tuşirsangiz, uning örniga tekşiruv xabari çiqadi.
:::

### 4. Qaysi nom ğolib? <Difficulty level="2" />

Natijani oldindan ayting, keyin tekşiriş uçun kodni işga tuşiring.

```python
from math import floor

def floor(x):
    return "mening floor funksiyam"

print(floor(3.7))

import math
print(math.floor(3.7))
```

::: details Yeçim
```text
mening floor funksiyam
3
```

`def floor` qatori importdan **keyin** kelgan, şuning uçun u import qilingan `floor` ni almaştirdi. `math.floor` esa haliyam haqiqiy funksiya, çunki u `math` moduli içida yaşaydi. Bu `import math` odatiy holatda xavfsizroq ekanining yana bir sababi.
:::

### 5. Baho dasturini böling <Difficulty level="3" />

Bu bir faylli dastur maʼlumotlar, hisob-kitob va çop etişni aralaştirib yuborgan:

```python
scores = {"Aziza": [90, 85, 97], "Bekzod": [72, 64, 80], "Dilnoza": [88, 91, 79]}

for name, marks in scores.items():
    average = sum(marks) / len(marks)
    grade = "A" if average >= 85 else "B" if average >= 70 else "C"
    print(f"{name:<8} {average:5.1f}  {grade}")
```

Uni natijasi bir xil bölgan ikki faylga böling: `grading.py` (`average(marks)` va `letter(avg)` funksiyalari) va `report.py` (maʼlumotlar va `__name__` tekşiruvi bilan himoyalangan `main()` funksiyasi).

::: details Yeçim
```py
# grading.py
def average(marks):
    return sum(marks) / len(marks)

def letter(avg):
    if avg >= 85:
        return "A"
    if avg >= 70:
        return "B"
    return "C"
```

```py
# report.py
from grading import average, letter

SCORES = {"Aziza": [90, 85, 97], "Bekzod": [72, 64, 80], "Dilnoza": [88, 91, 79]}

def main():
    for name, marks in SCORES.items():
        avg = average(marks)
        print(f"{name:<8} {avg:5.1f}  {letter(avg)}")

if __name__ == "__main__":
    main()
```

```text
python report.py
```

```text
Aziza     90.7  A
Bekzod    72.0  B
Dilnoza   86.0  A
```

`grading.py` da çop etiş yöq, şuning uçun boşqa dastur uni import qilib, qayta işlata oladi.
:::

## Xulosa

- **Modul** - bu `.py` fayl. `import` uni bir marta işga tuşiradi va nomlariga kiriş imkonini beradi.
- `import math` → `math.sqrt()`; `from math import sqrt` → `sqrt()`; `import statistics as st` → `st.mean()`.
- `from module import *` dan saqlaning. Modullarni `dir()` va `help()` bilan örganing.
- Bitta papkadagi öz fayllaringiz ham modullar, modullar papkasi esa **paket**.
- Fayl töğridan-töğri işga tuşirilganda `__name__` `"__main__"` böladi. Dasturning işini `if __name__ == "__main__":` ostiga qöying.
- Fayllaringizga heç qaçon `random.py` yoki `math.py` kabi standart modul nomlarini bermang.

## Qöşimça manbalar

- [Python Tutorial - Modules](https://docs.python.org/3/tutorial/modules.html)
- [The Python Standard Library](https://docs.python.org/3/library/index.html)
- [`__main__` - top-level code environment](https://docs.python.org/3/library/__main__.html)
