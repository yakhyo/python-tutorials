---
title: Parametrlar va argumentlar
description: "Funksiyalarga qiymatlarni moslaşuvçan uzating: pozitsion va kalit söz argumentlari, standart qiymatlar, özgaruvçan standart qiymat tuzoği, *args va **kwargs hamda faqat kalit söz bilan beriladigan parametrlar."
---

# Parametrlar va argumentlar

![Rasm: Parametrlar va argumentlar](/images/topics-webp-uzb/parameters-and-arguments.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Pozitsion** va **kalit söz** argumentlari orasidagi farq
- **Standart qiymatlar** yordamida parametrlarni qanday ixtiyoriy qiliş
- Nega röyxatni heç qaçon standart qiymat sifatida işlatmaslik kerak
- `*args` va `**kwargs` istalgan miqdordagi argumentlarni qanday qabul qiladi
- `*` va `/` argumentlarni kalit söz yoki pozitsiya böyiça berişga qanday majburlaydi
:::

## Nega bu muhim

`print()` qançalik moslaşuvçan ekaniga qarang: `print("a")`, `print("a", "b", "c")`, `print("a", end="")`, `print("a", "b", sep="-")`. U istalgan miqdordagi qiymatlarni va ixtiyoriy sozlamalarni qabul qiladi. Bu darsdagi usullar yordamida öz funksiyalaringizni ham xuddi şunday qulay qila olasiz.

## Pozitsion argumentlar

Odatda argumentlar parametrlarga **örni böyiça** moslanadi: birinçisi birinçisiga, ikkinçisi ikkinçisiga:

```python
def describe_pet(animal, name):
    print(f"{name} — {animal}.")

describe_pet("muşuk", "Momo")
describe_pet("Momo", "muşuk")    # tartib notöğri, natija ham notöğri
```

```text
Momo — muşuk.
muşuk — Momo.
```

Python tartib notöğri ekanini bila olmaydi. Ikkalasi ham satr.

## Kalit söz argumentlari

Çaqirişda parametr nomini yozişingiz mumkin. Unda **tartib ahamiyatga ega emas**:

```python
def describe_pet(animal, name):
    print(f"{name} — {animal}.")

describe_pet(name="Momo", animal="muşuk")
describe_pet(animal="it", name="Reks")
```

```text
Momo — muşuk.
Reks — it.
```

Kalit söz argumentlari (keyword arguments) çaqirişni özidan tuşunarli qiladi, ayniqsa sonlar va mantiqiy qiymatlar uçun:

```python
def create_account(username, balance, is_admin):
    print(f"{username}: balans {balance}, admin={is_admin}")

create_account("aziza", 0, False)                           # 0 va False nimani bildiradi?
create_account("aziza", balance=0, is_admin=False)          # tuşunarli
```

Ikkala uslubni aralaştirişingiz mumkin, lekin **pozitsion argumentlar birinçi kelişi şart**:

```py
create_account(username="aziza", 0, False)
```

```text
SyntaxError: positional argument follows keyword argument
```

## Standart qiymatlar

Taʼrifda `=` yordamida parametrga standart qiymat (default value) bering. Agar çaqiruvçi uni tuşirib qoldirsa, standart qiymat işlatiladi:

```python
def greet(name, greeting="Salom"):
    print(f"{greeting}, {name}!")

greet("Aziza")
greet("Bekzod", "Assalomu alaykum")
greet("Dilnoza", greeting="Xayrli tong")
```

```text
Salom, Aziza!
Assalomu alaykum, Bekzod!
Xayrli tong, Dilnoza!
```

Standart qiymatli parametrlar standart qiymatsiz parametrlardan **keyin** kelişi kerak:

```py
def greet(greeting="Salom", name):
    print(f"{greeting}, {name}!")
```

```text
SyntaxError: parameter without a default follows parameter with a default
```

Bir neça sozlamaga ega hayotiy misol:

```python
def format_price(amount, currency="söm", decimals=0, separator=","):
    text = f"{amount:,.{decimals}f}".replace(",", separator)
    return f"{text} {currency}"

print(format_price(1250000))
print(format_price(1250000, separator=" "))
print(format_price(19.5, currency="USD", decimals=2))
```

```text
1,250,000 söm
1 250 000 söm
19.50 USD
```

(`return` qiymatni çaqiruvçiga qaytarib yuboradi. Bu keyingi darsning mavzusi.)

Kalit söz argumentlari çaqiruvçiga keraksiz sozlamalarni ötkazib yuborişga imkon beradi: masalan, `currency` va `decimals` ni qayta yozmasdan faqat `separator=" "` ni beriş mumkin.

## Özgaruvçan standart qiymat tuzoği

Standart qiymatlar funksiya har safar çaqirilganda emas, balki funksiya **yaratilganda** **bir marta** hosil qilinadi. Sonlar va satrlar uçun buning ahamiyati yöq. Röyxat yoki luğat uçun esa bu maşhur xatoga olib keladi:

```python
def add_item(item, basket=[]):     # har bir çaqirişda bitta röyxat qayta işlatiladi!
    basket.append(item)
    return basket

print(add_item("olma"))
print(add_item("non"))             # kutilgan natija: ['non']
```

```text
['olma']
['olma', 'non']
```

Yeçim - standart qiymat sifatida `None` işlatiş va yangi röyxatni funksiya içida yaratiş:

```python
def add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket

print(add_item("olma"))
print(add_item("non"))
```

```text
['olma']
['non']
```

**Qoida:** özgaruvçan (mutable) qiymatni (`[]`, `{}`, `set()`) heç qaçon standart qiymat qilmang. `None` işlating va qiymatni funksiya içida yarating.

## `*args`: istalgan miqdordagi pozitsion argumentlar

Parametr nomi oldiga `*` qöysangiz, u **barça ortiqça pozitsion argumentlarni** bitta **kortej (tuple)** ga yiğadi:

```python
def total(*numbers):
    print(f"qabul qilindi: {numbers}")
    return sum(numbers)

print(total(5, 10))
print(total(1, 2, 3, 4, 5))
print(total())
```

```text
qabul qilindi: (5, 10)
15
qabul qilindi: (1, 2, 3, 4, 5)
15
qabul qilindi: ()
0
```

`args` nomi şunçaki kelişuv. Imkon bölsa, `*numbers` yoki `*names` kabi maʼnoli nom işlating.

Oddiy parametrlarni `*args` bilan birga işlatiş mumkin. Avval oddiy parametrlar töldiriladi:

```python
def log(level, *messages):
    print(f"[{level}]", " ".join(messages))

log("INFO", "Server", "işga", "tuşdi")
log("ERROR", "Disk", "töldi")
```

```text
[INFO] Server işga tuşdi
[ERROR] Disk töldi
```

### Röyxatni argumentlarga ajratiş

Teskari yönalişda ham `*` işlatiladi: **çaqirişda** `*` röyxatni alohida argumentlarga ajratadi:

```python
def describe(name, age, city):
    print(f"{name}, {age} yoşda, {city}dan")

record = ["Aziza", 20, "Toşkent"]
describe(*record)        # describe("Aziza", 20, "Toşkent") bilan bir xil

scores = [4, 8, 15]
print(*scores)           # print uçta argument oladi
print(*scores, sep=" | ")
```

```text
Aziza, 20 yoşda, Toşkentdan
4 8 15
4 | 8 | 15
```

## `**kwargs`: istalgan miqdordagi kalit söz argumentlari

Ikki yulduzça **ortiqça kalit söz argumentlarini** bitta **luğat (dictionary)** ga yiğadi:

```python
def create_profile(name, **details):
    print(f"{name} profili")
    for key, value in details.items():
        print(f"  {key}: {value}")

create_profile("Aziza", age=20, city="Toşkent", language="özbek")
```

```text
Aziza profili
  age: 20
  city: Toşkent
  language: özbek
```

Çaqirişda `**` luğatni kalit söz argumentlariga ajratadi:

```python
def greet(name, greeting="Salom"):
    print(f"{greeting}, {name}!")

options = {"name": "Bekzod", "greeting": "Assalomu alaykum"}
greet(**options)
```

```text
Assalomu alaykum, Bekzod!
```

## Faqat kalit söz bilan beriladigan parametrlar

Yakka `*` dan (yoki `*args` dan) **keyin** yozilgan parametrlarni **faqat** kalit söz bilan beriş mumkin. Bu çaqiruvçini oson adaştiriladigan sozlamalar uçun tuşunarli kod yozişga majbur qiladi:

```python
def transfer(amount, *, from_account, to_account):
    print(f"{amount:,} {from_account} hisobidan {to_account} hisobiga ötkazilmoqda")

transfer(500000, from_account="A-100", to_account="B-200")
```

```text
500,000 A-100 hisobidan B-200 hisobiga ötkazilmoqda
```

```py
def transfer(amount, *, from_account, to_account):
    print(f"{amount:,} {from_account} hisobidan {to_account} hisobiga ötkazilmoqda")

transfer(500000, "A-100", "B-200")
```

```text
TypeError: transfer() takes 1 positional argument but 3 were given
```

Ikki hisobni adaştiriş qimmatga tuşadigan xato bölardi, şuning uçun bu yerda nomlarni talab qiliş - yaxşi dizayn.

## Faqat pozitsiya böyiça beriladigan parametrlar

Buning teskarisi ham bor. `/` dan **oldingi** parametrlarni **faqat** pozitsiya böyiça beriş mumkin. Bunga birinçi marta örnatilgan funksiyalarning `help()` natijasida duç kelasiz:

```python
help(len)
```

```text
Help on built-in function len in module builtins:

len(obj, /)
    Return the number of items in a container.

```

`obj` dan keyingi `/` "buni faqat pozitsiya böyiça bering" degani, şuning uçun `len([1, 2])` işlaydi, lekin `len(obj=[1, 2])` `TypeError: len() takes no keyword arguments` beradi. Parametr nomlari çaqiruvçi uçun ahamiyatsiz bölsa va keyinçalik ularni erkin özgartirmoqçi bölsangiz, öz funksiyalaringizda `/` ni işlatişingiz mumkin:

```python
def discount(price, percent, /, *, rounding=0):
    return round(price * (100 - percent) / 100, rounding)

print(discount(48500, 15))
print(discount(48500, 15, rounding=-2))
```

```text
41225.0
41200.0
```

Bu yerda `price` va `percent` faqat pozitsiya böyiça, `rounding` esa faqat kalit söz bilan beriladi. `discount(price=48000, percent=15)` deb çaqiriş `TypeError: discount() got some positional-only arguments passed as keyword arguments: 'price, percent'` beradi. Hujjatlarda `/` yoki `*` ni körganingizda endi ular nimani anglatişini bilasiz; öz kodingizda `*` sizga `/` dan ança köproq kerak böladi.

## Töliq tartib

Hammasini birlaştirganda parametrlar quyidagi tartibda keladi:

```text
def f(positional_only, /, positional, with_default=1, *args, keyword_only, **kwargs):
```

```python
def example(a, b=2, *args, c, d=4, **kwargs):
    print(f"a={a} b={b} args={args} c={c} d={d} kwargs={kwargs}")

example(1, c=3)
example(1, 20, 30, 40, c=3, e=5)
```

```text
a=1 b=2 args=() c=3 d=4 kwargs={}
a=1 b=20 args=(30, 40) c=3 d=4 kwargs={'e': 5}
```

Amalda köpçilik funksiyalarga bir neça oddiy parametr va ehtimol baʼzi standart qiymatlar kifoya qiladi. `*args` va `**kwargs` ga haqiqatan moslaşuvçanlik kerak bölgandagina murojaat qiling.

## Özingiz sinab köring

`make_sandwich` ni turli usullarda çaqirib köring: faqat non bilan, qöşimça içliklar bilan, kalit söz sozlamalari bilan.

<ClientOnly><PythonPlayground :code='"def make_sandwich(bread, *fillings, toasted=False, **extras):\n    style = \"qizdirilgan \" if toasted else \"\"\n    print(f\"{style}sendviç: {bread} non\")\n    for filling in fillings:\n        print(f\"  + {filling}\")\n    for key, value in extras.items():\n        print(f\"  ({key}: {value})\")\n\nmake_sandwich(\"oq\")\nmake_sandwich(\"javdar\", \"pişloq\", \"pomidor\", toasted=True)\nmake_sandwich(\"lavaş\", \"tovuq\", sauce=\"sarimsoqli\", size=\"katta\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Majburiy argumentlar yetişmaydi

```py
def greet(name, greeting):
    print(f"{greeting}, {name}!")

greet("Aziza")
```

```text
TypeError: greet() missing 1 required positional argument: 'greeting'
```

**Tuzatiş:** argumentni uzating yoki parametrga standart qiymat bering.

### 2. Nomaʼlum kalit söz

```py
def greet(name):
    print(f"Salom, {name}!")

greet(nmae="Aziza")
```

```text
TypeError: greet() got an unexpected keyword argument 'nmae'
```

### 3. Bitta argument ikki marta

```py
def greet(name, greeting="Salom"):
    print(f"{greeting}, {name}!")

greet("Aziza", name="Bekzod")
```

```text
TypeError: greet() got multiple values for argument 'name'
```

`"Aziza"` allaqaçon örni böyiça `name` ni töldirgan.

### 4. Faqat kalit söz bilan beriladigan argumentlarning nomlarini unutiş

```py
def transfer(amount, *, from_account, to_account):
    print(f"{amount:,} {from_account} dan {to_account} ga ötkazilmoqda")

transfer(500000)
```

```text
TypeError: transfer() missing 2 required keyword-only arguments: 'from_account' and 'to_account'
```

Xato **keyword-only** deyapti, bu sizga tuzatişni aytib turibdi: `transfer(500000, from_account="A-100", to_account="B-200")` deb çaqiring. Ularni pozitsiya böyiça beriş ham işlamaydi, buni yuqoridagi faqat kalit söz bölimi körsatdi.

## Maşqlar

### 1. Standart qiymatli daraja <Difficulty level="1" />

`base ** exponent` ni qaytaradigan `power(base, exponent=2)` funksiyasini yozing. `power(5)`, `power(2, 10)` va `power(exponent=3, base=4)` ni sinab köring.

::: details Yeçim
```python
def power(base, exponent=2):
    return base ** exponent

print(power(5))
print(power(2, 10))
print(power(exponent=3, base=4))
```

```text
25
1024
64
```
:::

### 2. Moslaşuvçan örtaça qiymat <Difficulty level="1" />

Istalgan miqdordagi qiymatlarning örtaçasini, qiymat berilmasa esa `0` ni qaytaradigan `average(*numbers)` funksiyasini yozing.

::: details Yeçim
```python
def average(*numbers):
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)

print(average(4, 8, 15))
print(average())
```
:::

### 3. HTML teg yasovçi <Difficulty level="2" />

HTMLga öxşaş satr qaytaradigan `tag(name, text, **attributes)` funksiyasini yozing. Masalan, `tag("a", "Boş sahifa", href="/", target="_blank")` `<a href="/" target="_blank">Boş sahifa</a>` ni, `tag("p", "Salom")` esa `<p>Salom</p>` ni qaytaradi.

::: details Yeçim
```python
def tag(name, text, **attributes):
    attrs = "".join(f' {key}="{value}"' for key, value in attributes.items())
    return f"<{name}{attrs}>{text}</{name}>"

print(tag("a", "Boş sahifa", href="/", target="_blank"))
print(tag("p", "Salom"))
```
:::

### 4. Xarid röyxatini tuzating <Difficulty level="2" />

Bu funksiya röyxatsiz çaqirilganda har safar **yangi** röyxat boşlaşi kerak. Xatoni tuşuntiring, keyin uni tuzating.

```python
def add_to_list(item, shopping=[]):
    shopping.append(item)
    return shopping

monday = add_to_list("sut")
tuesday = add_to_list("tuxum")
print(monday, tuesday)
```

::: details Yeçim
U `['sut', 'tuxum'] ['sut', 'tuxum']` ni çop etadi. Standart röyxat funksiya yaratilganda bir marta hosil qilinadi, şuning uçun ikkala çaqiriş ham bitta röyxatga element qöşadi, `monday` va `tuesday` esa hatto bitta obyektning özi.

```python
def add_to_list(item, shopping=None):
    if shopping is None:
        shopping = []
    shopping.append(item)
    return shopping

monday = add_to_list("sut")
tuesday = add_to_list("tuxum")
print(monday, tuesday)
```

```text
['sut'] ['tuxum']
```
:::

### 5. Sozlanadigan jadval çop etuvçi <Difficulty level="3" />

`print_table(*rows, headers=None, width=10, align="left")` funksiyasini yozing, bu yerda har bir qator qiymatlardan iborat kortej:

- agar `headers` berilgan bölsa, avval ularni, keyin `-` belgilaridan iborat çiziqni çop eting,
- har bir katak `width` ta belgigaça töldirilsin,
- `align` - `"left"` yoki `"right"`.

`headers`, `width` va `align` ni **faqat kalit söz bilan beriladigan** qiling.

```py
print_table(("Çoy", 15000), ("Qahva", 45000), headers=("Mahsulot", "Narx"), align="right")
```

::: details Yeçim
```python
def print_table(*rows, headers=None, width=10, align="left"):
    marker = "<" if align == "left" else ">"

    if headers is not None:
        print("".join(f"{str(value):{marker}{width}}" for value in headers))
        print("-" * (width * len(headers)))
    for row in rows:
        print("".join(f"{str(value):{marker}{width}}" for value in row))

print_table(("Çoy", 15000), ("Qahva", 45000), headers=("Mahsulot", "Narx"), align="right")
```

```text
  Mahsulot      Narx
--------------------
       Çoy     15000
     Qahva     45000
```

`*rows` birinçi kelgani uçun undan keyingi hamma narsa avtomatik ravişda faqat kalit söz bilan beriladi. Format spetsifikatsiyasi özgaruvçilardan tuziladi: `f"{text:{marker}{width}}"` `{text:>10}` ga aylanadi. Xuddi şu `join` ifodasi sarlavhalarni ham, har bir qatorni ham formatlaydi.
:::

## Xulosa

- **Pozitsion** argumentlar tartib böyiça moslanadi. **Kalit söz** argumentlari (`name=value`) nom böyiça moslanadi va pozitsion argumentlardan keyin kelişi kerak.
- **Standart qiymatlar** (`param=value`) parametrlarni ixtiyoriy qiladi va majburiy parametrlardan keyin kelişi kerak.
- `[]` yoki `{}` ni heç qaçon standart qiymat qilmang. `None` işlating va qiymatni funksiya içida yarating.
- `*args` ortiqça pozitsion argumentlarni kortejga, `**kwargs` esa ortiqça kalit söz argumentlarini luğatga yiğadi.
- Çaqirişda `*list` va `**dict` qiymatlarni argumentlarga ajratadi.
- `*` yoki `*args` dan keyingi parametrlar **faqat kalit söz bilan**, `/` dan oldingi parametrlar esa **faqat pozitsiya böyiça** beriladi, masalan `len(obj, /)`.

## Qöşimça manbalar

- [Python Tutorial - More on defining functions](https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions)
- [Python FAQ - Why are default values shared between objects?](https://docs.python.org/3/faq/programming.html#why-are-default-values-shared-between-objects)
