---
title: pytest bilan testlaş
description: "Pythonning eng mashhur testlaş vositasi pytest dan foydalaniş: test fayllari va nomlari, pytest ni işga tuşiriş, yiqiliş hisobotlarini öqiş, pytest.raises, pytest.approx, parametrize, oddiy fixture lar va fayl testlari uçun tmp_path."
---

# pytest bilan testlaş

![Rasm: pytest bilan testlaş](/images/topics-webp-uzb/pytest-basics.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- pytest ularni topişi uçun test fayllari va funksiyalarini qanday nomlaş va ularni qanday işga tuşiriş
- pytest ning yiqiliş hisobotlarini qanday öqiş
- Istisnolarni `pytest.raises`, float sonlarni `pytest.approx` bilan qanday testlaş
- Holatlar jadvalini `@pytest.mark.parametrize` bilan testlarga qanday aylantiriş
- Fixture lar va `tmp_path` har bir testga qanday qilib yangi obyekt va fayllar beradi
:::

## Nega bu muhim

*assert bilan testlaş* darsidagi kiçik yurguzuvçi har bir testni qölda röyxatga yozişni talab qilardi. Pythonning eng mashhur testlaş vositasi **pytest** testlaringizni özi topadi, işga tuşiradi va har bir yiqilişni batafsil tuşuntiradi. Uning testlarini yozişni esa allaqaçon bilasiz: `assert` li oddiy `test_` funksiyalari.

## pytest ni örnatiş

pytest standart kutubxonaga kirmaydi. Uni terminalda bir marta örnating, keyin versiyasini tekşiring:

```text
python -m pip install pytest
python -m pytest --version
pytest 9.1.1
```

::: info pytest ni kompyuteringizda işga tuşiring
Bu saytdagi muharrirda `import pytest` işlaydi, lekin test fayllarini töplab işga tuşiriş uçun terminal kerak, şuning uçun bu sahifadagi pytest fayllarini kompyuteringizda işga tuşiring. Har bir faylni kod bloki ustida körsatilgan nom bilan saqlang (nom faylning bir qismi emas). Işga tuşiriladigan misollar pytest dan foydalanmaydi.
:::

## Birinçi test faylingiz

Testlar koddan **alohida faylda** saqlanadi. `shop_project` papkasini yarating va unda ikkita fayl oçing.

`shop.py`:

```py
def apply_discount(price, percent):
    if not 0 <= percent <= 100:
        raise ValueError(f"foiz 0 dan 100 gaça bölişi kerak, berilgan qiymat: {percent}")
    return price * (100 - percent) / 100


def cart_total(prices):
    return sum(prices)
```

`test_shop.py`:

```py
from shop import apply_discount, cart_total


def test_discount_ten_percent():
    assert apply_discount(50000, 10) == 45000


def test_no_discount():
    assert apply_discount(50000, 0) == 50000


def test_cart_total():
    assert cart_total([15000, 3000, 8000]) == 26000


def test_empty_cart():
    assert cart_total([]) == 0
```

Bu yerda testlarni çaqiriş ham, yurguzuvçi sikl ham yöq. pytest testlarni nomi böyiça topadi: `test_*.py` nomli fayllar va `test` bilan boşlanadigan funksiyalar. Qolgan hamma narsa jimgina taşlab ketiladi.

## pytest ni işga tuşiriş

Terminalda, **loyiha papkasida turib**, `pytest` (yoki `python -m pytest`) ni işga tuşiring:

```text
============================= test session starts ==============================
platform linux -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/aziza/shop_project
collected 4 items

test_shop.py ....                                                        [100%]

============================== 4 passed in 0.01s ===============================
```

Har bir nuqta - ötgan test. Foydali parametrlar:

| Buyruq | Nima qiladi |
|---|---|
| `pytest -v` | har bir test uçun `PASSED` yoki `FAILED` li bitta qator |
| `pytest test_shop.py` | bitta faylni işga tuşiradi (`test_shop.py::test_cart_total`: bitta testni) |
| `pytest -k discount` | faqat nomida `discount` bor testlar |
| `pytest -x` | birinçi yiqilişda töxtaydi |

## Yiqilişni öqiş

Endi kimdir `apply_discount` ni `return price * percent / 100` ga özgartirdi: u yangi narx örniga çegirma miqdorini qaytaradi. `pytest` ni yana işga tuşiring:

```text
test_shop.py FF..                                                        [100%]

=================================== FAILURES ===================================
__________________________ test_discount_ten_percent ___________________________

    def test_discount_ten_percent():
>       assert apply_discount(50000, 10) == 45000
E       assert 5000.0 == 45000
E        +  where 5000.0 = apply_discount(50000, 10)

test_shop.py:5: AssertionError
```

(Faqat birinçi yiqiliş körsatilgan; hisobot `2 failed, 2 passed` kabi xulosa bilan tugaydi.) `FF..` ikkita yiqiliş va ikkita ötişni körsatadi, `>` yiqilgan qatorni belgilaydi, `test_shop.py:5` esa fayl va qatorni beradi.

Siz **xabarsiz** oddiy `assert` yozdingiz, lekin `E` qatorlari haqiqiy qiymatni va uni hosil qilgan çaqiruvni körsatadi. Bu **assert introspeksiyasi** deyiladi. Ikki luğat uçun pytest faqat farq qiladigan elementlarni körsatadi:

```text
E       AssertionError: assert {'name': 'Bek...passed': True} == {'name': 'Bek...assed': False}
E         
E         Omitting 2 identical items, use -vv to show
E         Differing items:
E         {'passed': True} != {'passed': False}
```

## Istisnolarni `pytest.raises` bilan testlaş

pytest `try` / `except` / `else` andozasini `with` bloki bilan almaştiradi. `test_errors.py`:

```py
import pytest

from shop import apply_discount, cart_total


def test_error_message():
    with pytest.raises(ValueError, match="0 dan 100 gaça"):
        apply_discount(50000, 150)


def test_error_details():
    with pytest.raises(ValueError) as excinfo:
        apply_discount(50000, -5)
    assert "qiymat: -5" in str(excinfo.value)


def test_float_total():
    assert cart_total([0.1, 0.2]) == pytest.approx(0.3)
```

- Blok `ValueError` çaqirsa, test **ötadi**, çaqirmasa `DID NOT RAISE ValueError` bilan yiqiladi.
- `match=` xabarni ham tekşiradi (bu regulyar ifoda, şuning uçun oddiy sözlar xavfsiz).
- `as excinfo` istisnoni saqlab qoladi: `excinfo.value` - istisno obyekti.
- `pytest.approx()` float sonlarni `math.isclose()` kabi juda kiçik farq bilan taqqoslaydi.

## `parametrize` bilan holatlar jadvali

*Test holatlarini tanlaş* darsidagi jadvalli sikl **bitta** test: birinçi yiqilgan qator uni töxtatadi. `@pytest.mark.parametrize` esa har bir qatorni **alohida** testga aylantiradi. `test_params.py`:

```py
import pytest

from shop import apply_discount


@pytest.mark.parametrize(
    "price, percent, expected",
    [
        (50000, 10, 45000),
        (50000, 100, 0),
        (12000, 25, 9500),
    ],
)
def test_apply_discount(price, percent, expected):
    assert apply_discount(price, percent) == expected
```

Dekorator (`@` li qator) **parametr nomlari** va **qatorlar röyxati**ni oladi; test har bir qator uçun bir marta işlaydi. Oxirgi qator ataylab notöğri (12,000 dan 25% çegirma 9,000 böladi). `pytest -v` quyidagini körsatadi:

```text
test_params.py::test_apply_discount[50000-10-45000] PASSED               [ 33%]
test_params.py::test_apply_discount[50000-100-0] PASSED                  [ 66%]
test_params.py::test_apply_discount[12000-25-9500] FAILED                [100%]
```

Keyin yiqiliş hisobotida aynan şu qatorning qiymatlari keltiriladi.

## Fixture lar: har bir test uçun yangi obyektlar

Bir neçta testga bir xil boşlanğiç obyekt kerak bölsa, uni **fixture** tayyorlaydi: bu `@pytest.fixture` bilan belgilangan funksiya. `test_bank.py`:

```py
import pytest


class BankAccount:
    def __init__(self, balance):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount


@pytest.fixture
def account():
    return BankAccount(100000)


def test_deposit(account):
    account.deposit(50000)
    assert account.balance == 150000


def test_starts_fresh(account):
    assert account.balance == 100000
```

Sir **parametr nomida**: `account` nomli parametr uçun pytest `account` nomli fixture ni çaqiradi va natijani uzatadi. Har bir test **mutlaqo yangi** hisob oladi, şuning uçun birinçi testdagi pul qöyiş ikkinçisiga taʼsir qila olmaydi. (Haqiqiy loyihada klass öz modulida turgan bölardi.)

### Fayllarni `tmp_path` bilan testlaş

**Örnatilgan fixture** `tmp_path` har bir testga `pathlib.Path` körinişidagi öz böş vaqtinçalik papkasini beradi, şuning uçun fayl testlari haqiqiy maʼlumotlarga heç qaçon tegmaydi:

```py
import json


def test_save_and_load(tmp_path):
    path = tmp_path / "contacts.json"
    contacts = {"Aziza": "+998 90 123 45 67"}

    path.write_text(json.dumps(contacts), encoding="utf-8")

    assert json.loads(path.read_text(encoding="utf-8")) == contacts
```

Har qanday fixture kabi, uni şunçaki nomi bilan söraysiz.

## Özingiz sinab köring

Haqiqiy test faylini işga tuşiriş uçun terminal kerak, şuning uçun bu yerda `parametrize` ortidagi göyani maşq qiling: har bir qator alohida xabar qilinadi. Yiqilgan qator oşkor qilgan xatoni tuzating.

<ClientOnly><PythonPlayground :code='"def shipping_cost(kg):\n    if kg <= 1:\n        return 0\n    if kg < 5:\n        return 20000\n    return 50000\n\ncases = [\n    (0.5, 0),\n    (1, 0),\n    (3, 20000),\n    (5, 20000),\n    (12, 50000),\n]\n\npassed = 0\nfor kg, expected in cases:\n    result = shipping_cost(kg)\n    name = f\"test_shipping_cost[{kg}-{expected}]\"\n    if result == expected:\n        print(f\"{name} PASSED\")\n        passed += 1\n    else:\n        print(f\"{name} FAILED: {expected} kutilgandi, {result} çiqdi\")\n\nprint(f\"{passed} passed, {len(cases) - passed} failed\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Notöğri fayl yoki funksiya nomlari

```py
def check_total():  # totals.py da: heç bir nom test bilan boşlanmaydi
    assert 1 + 1 == 2
```

```text
collected 0 items

============================ no tests ran in 0.00s =============================
```

**Tuzatiş:** fayllarni `test_*.py`, funksiyalarni `test_*` deb nomlang va `python test_shop.py` ni emas (u faqat funksiyalarni aniqlaydi), `pytest` ni işga tuşiring.

### 2. `pytest.raises` içidagi ortiqça kod

```py
def test_bad_percent():
    with pytest.raises(ValueError):
        apply_discount(50000, 150)
        assert False   # heç qaçon işlamaydi!
```

```text
test_errors.py::test_bad_percent PASSED                                  [100%]
```

Istisno `with` blokidan çiqib ketadi, şuning uçun `assert False` taşlab ketiladi. **Tuzatiş:** assert ni `with` blokidan **keyin**, `with` bilan bir xil çekinişda yozing.

### 3. Fixture ga mos kelmaydigan parametr nomi

```py
def test_deposit(acc):   # fixture ning nomi account
    acc.deposit(50000)
```

```text
E       fixture 'acc' not found
>       available fixtures: account, capfd, capfdbinary, caplog, ...
```

pytest fixture larni **parametr nomi böyiça** moslaydi. **Tuzatiş:** `def test_deposit(account):`.

## Maşqlar

### 1. Birinçi pytest faylingiz <Difficulty level="1" />

`is_even(n)` ni `number_tools.py` ga joylang va uçta testli `test_number_tools.py` yozing: juft son, toq son va nol.

::: details Yeçim
`test_number_tools.py` (`number_tools.py` dagi `is_even` işga tuşiriladigan versiyadagi bilan bir xil):

```py
from number_tools import is_even


def test_even_number():
    assert is_even(4)


def test_odd_number():
    assert not is_even(7)


def test_zero_is_even():
    assert is_even(0)
```

```python
def is_even(n):
    return n % 2 == 0

assert is_even(4)
assert not is_even(7)
assert is_even(0)
print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```

Modulingizni `numbers.py` deb nomlamang: standart kutubxonada bunday modul allaqaçon bor.
:::

### 2. Istisnoni testlaş <Difficulty level="1" />

`bank_tools.py` da `withdraw(balance, amount)` ni yozing: u yangi balansni qaytaradi, `amount > balance` bölganda esa `ValueError("pul yetarli emas")` çaqiradi. Xatoni **va** uning xabarini pytest bilan testlang.

::: details Yeçim
`bank_tools.py` - işga tuşiriladigan versiyadagi funksiya. `test_bank_tools.py`:

```py
import pytest

from bank_tools import withdraw


def test_withdraw_too_much():
    with pytest.raises(ValueError, match="pul yetarli emas"):
        withdraw(10000, 50000)
```

```python
def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("pul yetarli emas")
    return balance - amount

try:
    withdraw(10000, 50000)
except ValueError as error:
    assert str(error) == "pul yetarli emas", f"notöğri xabar: {error}"
else:
    raise AssertionError("DID NOT RAISE ValueError")
print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```
:::

### 3. Baho funksiyasini parametrlaş <Difficulty level="2" />

`grades.py` dagi `letter_grade(score)` uçun (90+: `"A"`, 80+: `"B"`, 70+: `"C"`, aks holda `"F"`) barça çegaralarni öz içiga olgan kamida olti qatorli parametrlangan test yozing.

::: details Yeçim
```py
import pytest

from grades import letter_grade


@pytest.mark.parametrize(
    "score, expected",
    [(90, "A"), (89, "B"), (80, "B"), (79, "C"), (70, "C"), (69, "F")],
)
def test_letter_grade(score, expected):
    assert letter_grade(score) == expected
```

```python
def letter_grade(score):
    for limit, letter in [(90, "A"), (80, "B"), (70, "C")]:
        if score >= limit:
            return letter
    return "F"

cases = [(90, "A"), (89, "B"), (80, "B"), (79, "C"), (70, "C"), (69, "F")]
for score, expected in cases:
    assert letter_grade(score) == expected, f"ball {score}"
print(f"{len(cases)} ta holat ötdi")
```

```text
6 ta holat ötdi
```
:::

### 4. Kutubxona uçun fixture <Difficulty level="2" />

`library.py` da `available` röyxati, `add_book(title)` va nomni olib taşlaydigan yoki `ValueError` çaqiradigan `borrow(title)` ga ega `Library` klassini yozing. Ikkita kitobli kutubxonani qaytaradigan fixture va undan foydalanadigan ikkita test yozing.

::: details Yeçim
`library.py` - işga tuşiriladigan versiyadagi klass. `test_library.py`:

```py
import pytest

from library import Library


@pytest.fixture
def library():
    lib = Library()
    lib.add_book("Mehrobdan çayon")
    lib.add_book("Python asoslari")
    return lib


def test_borrow_removes_book(library):
    library.borrow("Python asoslari")
    assert library.available == ["Mehrobdan çayon"]


def test_borrow_missing_raises(library):
    with pytest.raises(ValueError):
        library.borrow("Nomaʼlum kitob")
```

```python
class Library:
    def __init__(self):
        self.available = []

    def add_book(self, title):
        self.available.append(title)

    def borrow(self, title):
        if title not in self.available:
            raise ValueError(f"{title!r} mavjud emas")
        self.available.remove(title)

def make_library():          # fixture vazifasini bajaradi
    lib = Library()
    lib.add_book("Mehrobdan çayon")
    lib.add_book("Python asoslari")
    return lib

library = make_library()
library.borrow("Python asoslari")
assert library.available == ["Mehrobdan çayon"]

try:
    make_library().borrow("Nomaʼlum kitob")
except ValueError:
    print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```
:::

### 5. Fayl funksiyasini `tmp_path` bilan testlaş <Difficulty level="3" />

`lines.py` da matnli fayldagi böş bölmagan qatorlar sonini qaytaradigan `count_lines(path)` ni yozing. Uni böş qatorlari bor fayl ustida `tmp_path` bilan testlang.

::: details Yeçim
```py
from lines import count_lines


def test_blank_lines_ignored(tmp_path):
    path = tmp_path / "cities.txt"
    path.write_text("Toşkent\n\nBuxoro\n\n", encoding="utf-8")
    assert count_lines(path) == 2
```

`tempfile.TemporaryDirectory()` papka yaratadi va `with` blokidan keyin uni öçiradi, taxminan `tmp_path` kabi:

```python
import tempfile
from pathlib import Path

def count_lines(path):
    with open(path, encoding="utf-8") as file:
        return sum(1 for line in file if line.strip())

with tempfile.TemporaryDirectory() as folder:
    path = Path(folder) / "cities.txt"
    path.write_text("Toşkent\n\nBuxoro\n\n", encoding="utf-8")
    assert count_lines(path) == 2

print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```
:::

## Xulosa

- pytest `test_*.py` fayllaridagi `test_*` funksiyalarini işga tuşiradi; `-v`, `-k` va `-x` nima işlaşi va körsatilişini boşqaradi.
- Yiqiliş hisobotida `>` yiqilgan qatorni belgilaydi, `E` qatorlari esa haqiqiy qiymatlarni körsatadi.
- `pytest.raises(ValueError, match=...)` istisnolarni testlaydi (ularni körib çiqiş uçun `as excinfo`), `pytest.approx` esa float sonlarni taqqoslaydi.
- `@pytest.mark.parametrize` holatlar jadvalini alohida testlarga aylantiradi.
- Fixture lar parametr nomi orqali har bir testga yangi tayyorgarlik beradi; `tmp_path` vaqtinçalik papka beradi.

## Qöşimça manbalar

- [pytest: Boşlaş](https://docs.pytest.org/en/stable/getting-started.html)
- [pytest: Testlarni parametrlaş](https://docs.pytest.org/en/stable/how-to/parametrize.html)
- [pytest: Fixture lar haqida](https://docs.pytest.org/en/stable/explanation/fixtures.html)
