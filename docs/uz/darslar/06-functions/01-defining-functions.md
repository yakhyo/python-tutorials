---
title: Funksiya yaratiş
description: "def yordamida öz funksiyalaringizni yarating: ularga nom beriş, çaqiriş, parametrlar orqali qiymat uzatiş, docstring bilan hujjatlaş va Python ularni qanday bajarişini tuşuniş."
---

# Funksiya yaratiş

![Rasm: Funksiya yaratiş](/images/topics-webp-uzb/defining-functions.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Nega funksiyalar dasturni qisqaroq, tuşunarliroq va tuzatişga osonroq qiladi
- `def` yordamida funksiyani qanday yaratiş va çaqiriş
- Funksiyaga **parametrlar** orqali qanday qiymat beriş
- Funksiyani **docstring** bilan qanday hujjatlaş
- Funksiya çaqirilganda Python kodingiz böylab qanday harakatlanadi
:::

## Nega bu muhim

Siz birinçi darsdan beri funksiyalardan **foydalanib** kelyapsiz: `print()`, `len()`, `input()`, `sorted()`. Ularning har biri bir bölak işni oddiy nom ortiga yaşiradi. Endi öz funksiyalaringizni yozasiz.

Funksiyalarsiz dasturlar bir xil kodni takrorlaydi. Agar bir xil ön qator beş joyda uçrasa va unda xato bölsa, uni beş marta topib tuzatişingiz kerak. Funksiya bilan esa kodni **bir marta** yozasiz, unga nom berasiz va kerakli joyda işlatasiz.

## Birinçi funksiyangiz

```python
def greet():
    print("Salom!")
    print("Kursga xuş kelibsiz.")

greet()
greet()
```

```text
Salom!
Kursga xuş kelibsiz.
Salom!
Kursga xuş kelibsiz.
```

Bu yerda ikki alohida qadam bor:

1. `def` bilan **yaratiş** Pythonga yangi buyruqni örgatadi. Hozirça heç nima çop etilmaydi.
2. `greet()` bilan **çaqiriş** içidagi kodni işga tuşiradi. Uni xohlagança marta çaqirişingiz mumkin.

Tuzilişi:

```text
def function_name():
    tana (çekiniş bilan)
```

- `def` - inglizça *define* (aniqlaş) sözining qisqartmasi.
- Nom özgaruvçi nomlari bilan bir xil qoidalarga böysunadi. `snake_case` işlating va odatda **feʼl** tanlang, çunki funksiyalar biror iş *bajaradi*: `greet`, `print_receipt`, `calculate_total`.
- Qavslar `()` va ikki nuqta `:` şart.
- Tana (body) xuddi `if` yoki sikldagi kabi çekiniş bilan yoziladi.

## Parametrlar: funksiyaga qiymat beriş

Funksiya turli qiymatlar bilan işlay olsa, ança foydali böladi. **Parametrlar (parameters)** - qavs içida sanab ötilgan özgaruvçilar. Ular çaqiriş paytida uzatilgan qiymatlarni qabul qiladi:

```python
def greet(name):
    print(f"Salom, {name}!")

greet("Aziza")
greet("Bekzod")
```

```text
Salom, Aziza!
Salom, Bekzod!
```

`greet("Aziza")` çaqirilganda Python `name = "Aziza"` qilib beradi va keyin tanani bajaradi.

- **Parametr** - funksiya taʼrifidagi nom: `name`.
- **Argument (argument)** - çaqirişdagi qiymat: `"Aziza"`.

Funksiya vergul bilan ajratilgan bir neça parametr qabul qilişi mumkin. Argumentlar **tartib böyiça** moslanadi:

```python
def print_receipt_line(item, quantity, price):
    total = quantity * price
    print(f"{item:<10} {quantity} x {price:>6,} = {total:>8,}")

print_receipt_line("Çoy", 2, 15000)
print_receipt_line("Somsa", 4, 8000)
```

```text
Çoy        2 x 15,000 =   30,000
Somsa      4 x  8,000 =   32,000
```

Keyingi dars - *Parametrlar va argumentlar* - standart qiymatlar, kalit söz argumentlari va boşqa mavzularni öz içiga oladi.

## Docstring bilan hujjatlaş

**Docstring** - funksiya tanasining birinçi qatorida yozilgan satr. U funksiya nima qilişini tavsiflaydi:

```python
def print_banner(title):
    """Sarlavhani = belgilaridan iborat çiziqlar orasida çop etadi."""
    line = "=" * (len(title) + 4)
    print(line)
    print(f"  {title}")
    print(line)

print_banner("Oylik hisobot")
help(print_banner)
```

```text
=================
  Oylik hisobot
=================
Help on function print_banner in module __main__:

print_banner(title)
    Sarlavhani = belgilaridan iborat çiziqlar orasida çop etadi.
```

Python docstringni saqlab qöyadi, şuning uçun `help()` va kod muharrirlari uni körsata oladi. Docstringni qisqa va aniq yozing ("Çop etadi…", "Qaytaradi…"). Katta funksiyalar uçun keyingi qatorlarda batafsil maʼlumot qöşing.

## Python funksiya çaqirişini qanday bajaradi

Python funksiya çaqirişiga yetib kelganda funksiya içiga **ötadi**, tanani bajaradi va keyin toxtagan joyiga **qaytadi**:

```python
def show_step(number):
    print(f"  funksiya içida: {number}-qadam")

print("1. oldin")
show_step(2)
print("3. keyin")
```

```text
1. oldin
  funksiya içida: 2-qadam
3. keyin
```

### Avval yarating, keyin çaqiring

Python faylingizni yuqoridan pastga qarab öqiydi. Funksiya uni çaqiradigan qator bajarilişidan **oldin yaratilgan** bölişi kerak:

```py
say_hi()

def say_hi():
    print("Salom")
```

```text
NameError: name 'say_hi' is not defined
```

Odatiy tartib: yuqorida importlar, keyin funksiya taʼriflari, eng pastda esa ulardan foydalanadigan kod.

Biroq funksiya tanasida keyinroq yaratilgan boşqa funksiyani tilga oliş **mumkin**, faqat çaqiriş haqiqatan bajarilganda u funksiya mavjud bölsa bas:

```python
def main():
    print_header()      # muammo yöq: faqat main() işlaganda çaqiriladi
    print("Asosiy matn")

def print_header():
    print("== Sarlavha ==")

main()
```

```text
== Sarlavha ==
Asosiy matn
```

## Funksiyalarni çaqiradigan funksiyalar

Katta vazifalarni har biri bitta iş bajaradigan kiçik funksiyalarga bölsangiz, ular bilan işlaş osonlaşadi:

```python
def print_line():
    print("-" * 30)

def print_title(text):
    print_line()
    print(text.center(30))
    print_line()

def print_menu():
    print_title("KAFE MENYUSI")
    print("Çoy ................ 15,000")
    print("Qahva .............. 45,000")
    print_line()

print_menu()
```

```text
------------------------------
         KAFE MENYUSI         
------------------------------
Çoy ................ 15,000
Qahva .............. 45,000
------------------------------
```

Endi çiziq uslubini özgartiriş uçun faqat **bitta** funksiyani tahrirlaş kifoya.

## Böş funksiya tanasi

Xuddi `if` kabi, funksiya tanasi ham böş bölişi mumkin emas. Hali rejalaştirayotgan bölsangiz, `pass` işlating:

```python
def send_report():
    pass   # TODO: buni keyinroq yozamiz

send_report()   # işlaydi, heç nima qilmaydi
```

## Funksiyalar ham qiymat

Özgaruvçi nomi sonni körsatgani kabi, funksiya nomi ham **funksiya obyektini** körsatadi. Qavslarsiz siz funksiyaning **özi haqida** gapirasiz. Qavslar bilan esa uni **çaqirasiz**:

```python
def greet():
    print("Salom!")

print(greet)     # funksiyaning özi
greet()          # uni çaqiriş
```

```text
<function greet at 0x...>
Salom!
```

Siz bu ğoyadan `sorted()` ga `key=str.lower` uzatganingizda foydalangansiz. *Lambda va yuqori tartibli funksiyalar* darsida bu mavzu davom ettiriladi.

Bu darsdagi funksiyalar natijani **çop etadi**. Köpinça esa funksiya boşqa kod foydalana oladigan qiymatni **qaytarişi** kerak, xuddi `len()` kabi. Buni `return` bajaradi - *Qaytariladigan qiymatlar* darsida.

## Özingiz sinab köring

Istalgan matn atrofida ramka çizadigan funksiya yozing. Uni turli sözlar bilan çaqirib köring, keyin ramka belgisi uçun parametr qöşing.

<ClientOnly><PythonPlayground :code='"def print_box(text):\n    \"\"\"Matnni + - | belgilaridan iborat ramka içida çop etadi.\"\"\"\n    width = len(text) + 2\n    print(\"+\" + \"-\" * width + \"+\")\n    print(\"| \" + text + \" |\")\n    print(\"+\" + \"-\" * width + \"+\")\n\nprint_box(\"Salom\")\nprint_box(\"Funksiyalar ajoyib\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Çaqirişda qavslarni unutiş

```python
def greet():
    print("Salom!")

greet        # heç nima qilmaydi: faqat funksiyaga işora qiladi
```

Dastur heç narsa çop etmaydi va xato ham bermaydi, şuning uçun bu xatoni payqaş qiyin. **Tuzatiş:** `greet()`.

### 2. Argumentlar soni notöğri

```py
def greet(name):
    print(f"Salom, {name}!")

greet()
```

```text
TypeError: greet() missing 1 required positional argument: 'name'
```

```py
def greet(name):
    print(f"Salom, {name}!")

greet("Aziza", "Bekzod")
```

```text
TypeError: greet() takes 1 positional argument but 2 were given
```

Har bir parametr uçun aynan bitta argument uzating. (Keyingi darsdagi standart qiymatlar ulardan baʼzilarini ixtiyoriy qiladi.)

### 3. Ikki nuqta yoki çekiniş tuşib qoldi

```py
def greet(name)
    print(f"Salom, {name}!")
```

```text
SyntaxError: expected ':'
```

```py
def greet(name):
print(f"Salom, {name}!")
```

```text
IndentationError: expected an indented block after function definition on line 1
```

**Tuzatiş:** `def` qatorini `:` bilan tugating va tanani 4 ta böşliq bilan çekintiring, xuddi `if` va sikllardagi kabi.

## Maşqlar

### 1. Tuğilgan kun qöşiği <Difficulty level="1" />

Ism bilan qisqa tuğilgan kun qöşiğini çop etadigan `sing_birthday(name)` funksiyasini yozing va uni ikki kişi uçun çaqiring.

::: details Yeçim
```python
def sing_birthday(name):
    print("Tuğilgan kuningiz bilan,")
    print("Tuğilgan kuningiz bilan,")
    print(f"Tuğilgan kuningiz bilan, aziz {name},")
    print("Tuğilgan kuningiz bilan!")
    print()

sing_birthday("Aziza")
sing_birthday("Bekzod")
```
:::

### 2. Yulduzçalardan kvadrat <Difficulty level="1" />

`*` belgilaridan iborat, eni `size` ta yulduzça va böyi `size` qator bölgan tölğazilgan kvadrat çop etadigan `draw_square(size)` funksiyasini yozing. Uni `3` va `5` bilan çaqiring.

::: details Yeçim
```python
def draw_square(size):
    for _ in range(size):
        print("* " * size)

draw_square(3)
print()
draw_square(5)
```
:::

### 3. Ölçov birliklarini özgartiriş jadvali <Difficulty level="2" />

`5 km = 3.11 mil` kabi qator çop etadigan `print_conversion(km)` funksiyasini yozing. Keyin sikl yordamida uni 1, 5, 10, 21.1 va 42.2 km uçun çaqiring.

::: details Yeçim
```python
def print_conversion(km):
    """Masofani kilometr va milda çop etadi."""
    miles = km * 0.621371
    print(f"{km:>5} km = {miles:6.2f} mil")

for distance in [1, 5, 10, 21.1, 42.2]:
    print_conversion(distance)
```
:::

### 4. Çaqirişlar tartibi <Difficulty level="2" />

Kodni işga tuşirmasdan, aniq natijani yozib çiqing. Keyin işga tuşirib tekşiring.

```python
def a():
    print("A boşlandi")
    b()
    print("A tugadi")

def b():
    print("B")

print("main boşlandi")
a()
b()
print("main tugadi")
```

::: details Yeçim
```text
main boşlandi
A boşlandi
B
A tugadi
B
main tugadi
```

`a()` içida `b()` çaqirilganda Python `b` ni töliq bajaradi, keyin `a` içidagi keyingi qatorga qaytadi.
:::

### 5. Baholar varaqasi <Difficulty level="3" />

Uçta funksiya yozing:

- `print_header(school)` maktab nomini ikki `=` çiziği orasida çop etadi.
- `print_student(name, scores)` ismni, vergul bilan ajratilgan baholarni va 1 ta önlik xonali örtaça bahoni çop etadi.
- `print_report(school, students)` qolgan ikkitasidan foydalanib, `ism → baholar röyxati` körinişidagi **luğat** uçun töliq hisobot çop etadi.

`print_report("7-maktab", {"Aziza": [5, 4, 5], "Bekzod": [3, 4, 4], "Dilnoza": [5, 5, 4]})` ni çaqiring.

::: details Yeçim
```python
def print_header(school):
    line = "=" * 32
    print(line)
    print(school.center(32))
    print(line)

def print_student(name, scores):
    scores_text = ", ".join(str(s) for s in scores)
    average = sum(scores) / len(scores)
    print(f"{name:<10} {scores_text:<12} ört. {average:.1f}")

def print_report(school, students):
    print_header(school)
    for name, scores in students.items():
        print_student(name, scores)

print_report("7-maktab", {"Aziza": [5, 4, 5], "Bekzod": [3, 4, 4], "Dilnoza": [5, 5, 4]})
```

```text
================================
            7-maktab            
================================
Aziza      5, 4, 5      ört. 4.7
Bekzod     3, 4, 4      ört. 3.7
Dilnoza    5, 5, 4      ört. 4.7
```
:::

## Xulosa

- `def name(parameters):` funksiya yaratadi. `name(arguments)` uni çaqiradi.
- Parametrlar - taʼrifdagi nomlar, argumentlar - siz uzatadigan qiymatlar. Ular tartib böyiça moslanadi.
- Tananing birinçi qatoridagi docstring (`"""…"""`) funksiyani hujjatlaydi, `help()` esa uni körsatadi.
- Funksiya uni çaqiradigan qator **bajarilişidan** oldin yaratilgan bölişi kerak.
- Katta vazifalarni bir-birini çaqiradigan kiçik funksiyalarga böling.
- `name` funksiyaning özini bildiradi, `name()` esa uni çaqiradi.

## Qöşimça manbalar

- [Python Tutorial - Defining functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)
- [PEP 257 - Docstring conventions](https://peps.python.org/pep-0257/)
