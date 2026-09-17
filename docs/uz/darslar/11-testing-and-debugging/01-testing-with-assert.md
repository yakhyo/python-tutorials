---
title: assert bilan testlaş
description: "Kodingizni assert bilan avtomatik tekşiring: test funksiyalari, arrange-act-assert, qaytariladigan qiymatlar va istisnolarni testlaş, float sonlarni taqqoslaş, kiçik test yurguzuvçi, klasslarni testlaş va assert ning çegaralari."
---

# assert bilan testlaş

![Rasm: assert bilan testlaş](/images/topics-webp-uzb/testing-with-assert.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `assert` xabar bilan va xabarsiz qanday işlaydi
- Arrange-act-assert andozasi asosida **test funksiyalari**ni qanday yoziş
- Qaytariladigan qiymatlar, istisnolar va float natijalarni qanday testlaş
- Köp testlarni kiçik sikl bilan işga tuşiriş va obyektlarni xavfsiz testlaş
- `assert` ni **heç qaçon** nima uçun işlatmaslik kerak
:::

## Nega bu muhim

Hozirgaça dasturlarni asosan işga tuşirib, natijasini öqib tekşirdingiz. Ellikta funksiyali dökon tizimida bu usul işlamaydi: bitta funksiyani özgartiriş sezdirmasdan yana uçtasini buzib qöyişi mumkin.

**Test** - kodingizni işga tuşirib, natijani siz uçun tekşiradigan kiçik kod bölagi; u buni ming marta bepul bajaradi. Testlar xatoni u paydo bölgandan bir neçta daqiqa keyin uşlaydi, bir neçta hafta ötib Samarqanddagi mijoz notöğri hisob olganida emas. Ular kodni qörqmasdan qayta yozişga ham imkon beradi: barça testlar hamon ötsa, heç narsani buzmagansiz.

## `assert` operatori

`assert` bilan *Qaytariladigan qiymatlar* darsida tezkor tekşiruv sifatida tanişgansiz. Endi u vositaga aylanadi. `assert` şart qabul qiladi. Şart rost bölsa, heç narsa bölmaydi. Yolğon bölsa, Python `AssertionError` bilan töxtaydi.

```python
def delivery_fee(order_total):
    if order_total >= 200000:
        return 0
    return 15000

assert delivery_fee(250000) == 0
assert delivery_fee(50000) == 15000
print("Barça tekşiruvlar ötdi")
```

```text
Barça tekşiruvlar ötdi
```

Jimlik muvaffaqiyat degani: kutilgan javoblar kodning özida saqlanadi, şuning uçun ularni eslab yuriş şart emas. Endi kimdir `>=` ni `>` ga özgartirdi deylik. Xato paytida haqiqiy natija körinişi uçun vergul qöyib, **xabar** qöşing:

```py
def delivery_fee(order_total):
    if order_total > 200000:     # >= ni > ga özgartirildi
        return 0
    return 15000

result = delivery_fee(200000)
assert result == 0, f"0 kutilgandi, {result} çiqdi"
```

```text
Traceback (most recent call last):
  File "shop.py", line 7, in <module>
    assert result == 0, f"0 kutilgandi, {result} çiqdi"
           ^^^^^^^^^^^
AssertionError: 0 kutilgandi, 15000 çiqdi
```

Traceback aynan qaysi tekşiruv ekanini körsatadi, xabar esa nima notöğri ketganini aytadi: roppa-rosa 200,000 sömlik buyurtma yetkazib beriş bepul bölişi kerak edi, lekin unday emas.

## Test funksiyalarini yoziş

Tarqoq `assert` qatorlarini tartibga solib bölmaydi. Odatda tekşiruvlar **test funksiyalari**ga joylanadi. Kelişuvga köra ularning nomi `test_` bilan boşlanadi va bitta xatti-harakatni tasvirlaydi. Köpçilik testlar uç qadamdan iborat:

1. **Arrange** (tayyorlaş): kiriş maʼlumotlarini tayyorlang.
2. **Act** (bajariş): testlanayotgan kodni çaqiring.
3. **Assert** (tekşiriş): natijani tekşiring.

```python
def average_grade(grades):
    return sum(grades) / len(grades)

def test_average_of_three_grades():
    grades = [80, 90, 100]            # tayyorlaş
    result = average_grade(grades)    # bajariş
    assert result == 90               # tekşiriş

test_average_of_three_grades()
print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```

Test funksiyasi argument qabul qilmaydi. U yo jimgina tugaydi (ötdi), yo xato çaqiradi (yiqildi). Yaxşi nom nima buzilganini aytib beradi.

Siz faqat funksiya **qaytaradigan** narsani testlay olasiz. Natijani çop etadigan funksiya testga soliştirişga heç narsa qoldirmaydi. Bu *Qaytariladigan qiymatlar* darsidagi odatning yana bir sababi: funksiyalar hisoblab qaytaradi, taşqi kod esa çop etadi.

## Xato çaqirilganini testlaş

Baʼzan töğri xatti-harakatning özi istisno böladi. `-3` yoş `ValueError` çaqirişi kerak. Buni testlaş uçun funksiyani `try` içida çaqiring va xato çiqmasa, testni yiqiting:

```python
def parse_age(text):
    age = int(text)
    if age < 0 or age > 150:
        raise ValueError(f"haqiqatga yaqin bölmagan yoş: {age}")
    return age

def test_parse_age_valid():
    assert parse_age("25") == 25

def test_parse_age_negative_raises():
    try:
        parse_age("-3")
    except ValueError as error:
        assert "haqiqatga yaqin bölmagan" in str(error)
    else:
        assert False, "manfiy yoş uçun ValueError kutilgandi"

test_parse_age_valid()
test_parse_age_negative_raises()
print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```

`else` bloki faqat istisno bölmaganda işlaydi, yaʼni funksiya noroziligini bildirişni unutgan böladi, şuning uçun `assert False, "..."` ataylab yiqiladi. *pytest bilan testlaş* darsida buni bir qatorda qiliş usuli körsatiladi.

## Float sonlarni `math.isclose` bilan taqqoslaş

Float sonlar ikkilik tizimda saqlanadi, şuning uçun `0.1 + 0.2` natijasi `0.30000000000000004` böladi va heç narsa notöğri bölmasa ham `assert 0.1 + 0.2 == 0.3` yiqiladi. Uning örniga `assert math.isclose(0.1 + 0.2, 0.3)` yozing: `math.isclose()` juda kiçik farqqa ruxsat beradi. Pul uçun köp dasturlar bu muammodan float örniga butun sonlarni (söm yoki tiyin) saqlab qoçadi.

## Kiçik test yurguzuvçi

Har bir testni qölda çaqiriş zerikarli, birinçi yiqiliş esa hamma narsani töxtatadi. Funksiyalar ham obyekt, şuning uçun ularni röyxatga joylab, sikl bilan aylanib çiqiş mumkin. Har bir funksiyada uning nomini saqlaydigan `__name__` atributi bor.

```python
def word_count(text):
    return len(text.split())

def test_simple_sentence():
    assert word_count("Toşkent katta şahar") == 3

def test_empty_text():
    assert word_count("") == 0

def test_hyphenated_word():
    result = word_count("bir-ikki")
    assert result == 2, f"2 kutilgandi, {result} çiqdi"

tests = [test_simple_sentence, test_empty_text, test_hyphenated_word]
passed = 0

for test in tests:
    try:
        test()
    except AssertionError as error:
        print(f"FAIL  {test.__name__}: {error}")
    else:
        print(f"PASS  {test.__name__}")
        passed += 1

print(f"{len(tests)} ta testdan {passed} tasi ötdi")
```

```text
PASS  test_simple_sentence
PASS  test_empty_text
FAIL  test_hyphenated_word: 2 kutilgandi, 1 çiqdi
3 ta testdan 2 tasi ötdi
```

Yurguzuvçi har bir yiqilişni xabar qilib, davom etadi, şuning uçun bitta işga tuşiriş töliq manzarani beradi. (`"bir-ikki"` bitta sözmi yoki ikkitami? Test sizni qaror qilişga majbur qiladi.)

Haqiqiy testlaş vositalari şu siklning ulğaygan versiyalaridir. Standart kutubxonada ulardan ikkitasi bor: `unittest` va `doctest`. Bu darslikda esa siz bu yerda yozayotgan oddiy `assert` testlarini aynan şundayligiça işga tuşiradigan mashhur taşqi vosita pytest işlatiladi.

## `assert` ning çegaralari

`assert` ning bitta muhim kamçiligi bor: Python uni **öçirib qöyişi** mumkin. `-O` (optimallaştiriş) bayroği bilan barça `assert` operatorlari taşlab ketiladi. Bu ikki qatorni `check.py` sifatida saqlang:

```py
assert 2 + 2 == 5, "matematika buzilgan"
print("tugadi")
```

```text
$ python check.py
Traceback (most recent call last):
  File "check.py", line 1, in <module>
    assert 2 + 2 == 5, "matematika buzilgan"
           ^^^^^^^^^^
AssertionError: matematika buzilgan

$ python -O check.py
tugadi
```

Şuning uçun `assert` ni testlarda işlating, lekin **heç qaçon foydalanuvçi kiritgan yoki taşqi maʼlumotni tekşiriş uçun işlatmang**. Ular uçun har doim işlaydigan `if` va `raise ValueError(...)` yozing.

## Özingiz sinab köring

Barça testlar ötişi uçun `is_valid_phone` funksiyasini tuzating, keyin öz testingizni qöşing.

<ClientOnly><PythonPlayground :code='"def is_valid_phone(phone):\n    # \"+998901234567\" kabi raqamlarni qabul qilişi kerak (plyus belgisi va 12 ta raqam)\n    return phone.startswith(\"+\") and len(phone) == 12\n\ndef test_valid_phone():\n    assert is_valid_phone(\"+998901234567\"), \"töğri raqam rad etildi\"\n\ndef test_missing_plus():\n    assert not is_valid_phone(\"998901234567\"), \"+ siz raqam qabul qilindi\"\n\ndef test_too_short():\n    assert not is_valid_phone(\"+99890123\"), \"qisqa raqam qabul qilindi\"\n\ntests = [test_valid_phone, test_missing_plus, test_too_short]\nfor test in tests:\n    try:\n        test()\n    except AssertionError as error:\n        print(f\"FAIL  {test.__name__}: {error}\")\n    else:\n        print(f\"PASS  {test.__name__}\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. assert ni qavsga olib yoziş

```py
price = 15000
assert(price == 20000, "notöğri narx")
print("ötdimi?")
```

```text
prices.py:2: SyntaxWarning: assertion is always true, perhaps remove parentheses?
  assert(price == 20000, "notöğri narx")
ötdimi?
```

Böş bölmagan kortej har doim rost, şuning uçun tekşiruv heç qaçon yiqilmaydi. **Tuzatiş:** `assert price == 20000, "notöğri narx"`.

### 2. Qaytariladigan qiymat örniga çop etilgan natijani testlaş

```py
def greet(name):
    print(f"Salom, {name}!")

assert greet("Dilnoza") == "Salom, Dilnoza!"
```

```text
Salom, Dilnoza!
AssertionError
```

Salomlaşuv çiqadi, şuning uçun funksiya töğridek körinadi, lekin `greet` satrni emas, `None` ni qaytaradi. **Tuzatiş:** funksiya matnni `return` qilsin, çop etiş esa taşqarida bajarilsin.

### 3. Bitta obyektni bölişadigan testlar

```py
class Wallet:
    def __init__(self):
        self.balance = 0

    def deposit(self, amount):
        self.balance += amount

wallet = Wallet()   # barça testlar bölişadigan bitta obyekt

def test_deposit():
    wallet.deposit(5000)
    assert wallet.balance == 5000, f"{wallet.balance} çiqdi"

test_deposit()
test_deposit()      # test yurguzuvçi qilganidek, yana işga tuşiramiz
```

```text
AssertionError: 10000 çiqdi
```

Birinçi işga tuşiriş umumiy balansni özgartirdi, şuning uçun aynan şu test endi yiqiladi: umumiy obyektlar natijalarni testlar **tartibi**ga boğliq qilib qöyadi. **Tuzatiş:** har bir test içida yangi obyekt yarating (tayyorlaş), keyin bajaring va tekşiring.

## Maşqlar

### 1. Harorat özgartiruvçini testlaş <Difficulty level="1" />

`celsius * 9 / 5 + 32` ni qaytaradigan `to_fahrenheit(celsius)` funksiyasini yozing. `0` dan `32`, `100` dan `212` va `-40` dan `-40` çiqişini tekşiradigan test funksiyasini yozing. Uni çaqiring va `"Barça testlar ötdi"` ni çiqaring.

::: details Yeçim
```python
def to_fahrenheit(celsius):
    return celsius * 9 / 5 + 32

def test_to_fahrenheit():
    assert to_fahrenheit(0) == 32
    assert to_fahrenheit(100) == 212
    assert to_fahrenheit(-40) == -40

test_to_fahrenheit()
print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```
:::

### 2. Foydali xabarli assert <Difficulty level="1" />

Quyidagi funksiyada xato bor. Assert **xabari** haqiqiy natijani körsatadigan test yozing, xabar yordamida xatoni toping va tuzating.

```py
def initials(full_name):
    parts = full_name.split()
    return parts[0][0] + parts[1][1]
```

::: details Yeçim
```python
def initials(full_name):
    parts = full_name.split()
    return parts[0][0] + parts[1][0]

def test_initials():
    result = initials("Farrux Nazarov")
    assert result == "FN", f"'FN' kutilgandi, {result!r} çiqdi"

test_initials()
print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```

Xato bilan xabar `'FN' kutilgandi, 'Fa' çiqdi` deydi va bu töğridan-töğri notöğri `parts[1][1]` indeksiga işora qiladi.
:::

### 3. Istisnoni testlaş <Difficulty level="2" />

Har bir kişining ulişini qaytaradigan va `people` 1 dan kiçik bölsa `ValueError` çaqiradigan `split_bill(total, people)` funksiyasini yozing. Ikkita test yozing: biri oddiy bölişuv uçun (`90000` ni `3` kişiga bölsak, `30000`), ikkinçisi `people=0` `ValueError` çaqirişini tekşiradi.

::: details Yeçim
```python
def split_bill(total, people):
    if people < 1:
        raise ValueError("kişilar soni kamida 1 bölişi kerak")
    return total / people

def test_split_bill_normal():
    assert split_bill(90000, 3) == 30000

def test_split_bill_zero_people_raises():
    try:
        split_bill(90000, 0)
    except ValueError:
        pass
    else:
        assert False, "ValueError kutilgandi"

test_split_bill_normal()
test_split_bill_zero_people_raises()
print("Barça testlar ötdi")
```

```text
Barça testlar ötdi
```

Tekşiruv bölmasa, `people=0` kamroq foydali `ZeroDivisionError` ni çaqirgan bölardi.
:::

### 4. Xarid savati klassini testlaş <Difficulty level="2" />

`add(name, price)` va `total()` metodlariga ega `Cart` klassini yozing. Ikkita test yozing: yangi savatning jami summasi `0` va bir xil mahsulotni ikki marta qöşsangiz, u ikki marta hisoblanadi. Ularni sikl bilan işga tuşiring.

::: details Yeçim
```python
class Cart:
    def __init__(self):
        self.items = []

    def add(self, name, price):
        self.items.append((name, price))

    def total(self):
        return sum(price for name, price in self.items)

def test_new_cart_is_empty():
    assert Cart().total() == 0

def test_same_item_twice():
    cart = Cart()
    cart.add("non", 5000)
    cart.add("non", 5000)
    assert cart.total() == 10000

tests = [test_new_cart_is_empty, test_same_item_twice]
for test in tests:
    test()
    print(f"PASS  {test.__name__}")
```

```text
PASS  test_new_cart_is_empty
PASS  test_same_item_twice
```
:::

### 5. Yaxşiroq test yurguzuvçi <Difficulty level="3" />

Kiçik test yurguzuvçini **boşqa** istisnolarni ham uşlab, ularni istisno turi nomi bilan `ERROR` deb xabar qiladigan qilib kengaytiring. Uni uçta testda sinang (biri ötadi, biri assert da yiqiladi, biri `ZeroDivisionError` bilan qulaydi) va `1 passed, 1 failed, 1 errors` kabi xulosani çiqaring.

::: details Yeçim
```python
def test_passes():
    assert len("Buxoro") == 6

def test_fails():
    assert "Samarqand".startswith("T"), "şahar T bilan boşlanişi kerak"

def test_crashes():
    prices = []
    average = sum(prices) / len(prices)
    assert average == 0

tests = [test_passes, test_fails, test_crashes]
passed = failed = errors = 0

for test in tests:
    try:
        test()
    except AssertionError as error:
        print(f"FAIL   {test.__name__}: {error}")
        failed += 1
    except Exception as error:
        print(f"ERROR  {test.__name__}: {type(error).__name__}: {error}")
        errors += 1
    else:
        print(f"PASS   {test.__name__}")
        passed += 1

print(f"{passed} passed, {failed} failed, {errors} errors")
```

```text
PASS   test_passes
FAIL   test_fails: şahar T bilan boşlanişi kerak
ERROR  test_crashes: ZeroDivisionError: division by zero
1 passed, 1 failed, 1 errors
```

`AssertionError` ham `Exception` hisoblanadi, şuning uçun uning `except` bloki birinçi turişi kerak.
:::

## Xulosa

- `assert şart, xabar` şart rost bölsa heç narsa qilmaydi, yolğon bölsa `AssertionError` çaqiradi.
- Tekşiruvlarni **tayyorlaş, bajariş, tekşiriş** tartibiga amal qiladigan `test_...` funksiyalariga joylang: har bir testda bitta xatti-harakat, va **qaytarilgan** qiymatlarni testlang.
- Istisnolarni `try` / `except` / `else` bilan testlang, float sonlarni `math.isclose` bilan taqqoslang.
- Test funksiyalari böylab sikl ularning hammasini işga tuşirib, har bir yiqilişni xabar qiladi. Har bir testga öz yangi obyektini bering.
- `python -O` `assert` ni olib taşlaydi, şuning uçun uni heç qaçon foydalanuvçi kiritgan maʼlumotni tekşiriş uçun işlatmang.

## Qöşimça manbalar

- [`assert` operatori](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)
- [`math.isclose()`](https://docs.python.org/3/library/math.html#math.isclose)
- [`-O` buyruq qatori parametri](https://docs.python.org/3/using/cmdline.html#cmdoption-O)
