---
title: Özgaruvçilarning köriniş sohasi
description: "Özgaruvçilar qayerda yaşaşini tuşuning: lokal va global köriniş sohasi, LEGB qidiruv qoidasi, UnboundLocalError, global va nonlocal kalit sözlari hamda funksiya içida röyxatni özgartiriş nega çaqiruvçiga taʼsir qilişi."
---

# Özgaruvçilarning köriniş sohasi

![Rasm: Özgaruvçilarning köriniş sohasi](/images/topics-webp-uzb/scope.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Lokal** va **global** özgaruvçilar orasidagi farq
- Python nomni qanday topadi: **LEGB** qoidasi
- Nega funksiya içida qiymat beriş lokal özgaruvçi yaratadi va `UnboundLocalError` nimani anglatadi
- `global` va `nonlocal` qaçon kerak va nega ulardan qoçiş kerak
- Nega funksiya siz uzatgan röyxatni **özgartira** oladi, lekin uni **almaştira** olmaydi
:::

## Nega bu muhim

Dastur kattalaşgan sari bir xil özgaruvçi nomlari qayta işlatiladi: `total`, `count`, `name`, `result`. Agar har bir özgaruvçi hamma joyda körinsa, funksiya boşqa joydagi qiymatni tasodifan özgartirib yuborişi mumkin edi va xatolarni topiş juda qiyin bölardi. **Köriniş sohasi (scope)** - har bir özgaruvçini qayerda köriş va özgartiriş mumkinligini belgilaydigan qoidalar töplami. U funksiyalarni bir-biridan mustaqil saqlaydi.

## Lokal özgaruvçilar

Funksiya içida yaratilgan özgaruvçilar, jumladan uning parametrlari, **lokal** hisoblanadi: ular faqat funksiya işlayotgan paytda va faqat uning içida mavjud böladi.

```python
def calculate_area(width, height):
    area = width * height        # lokal özgaruvçi
    return area

print(calculate_area(4, 5))
```

```py
def calculate_area(width, height):
    area = width * height
    return area

calculate_area(4, 5)
print(area)
```

```text
NameError: name 'area' is not defined
```

Funksiya qiymat qaytargandan keyin `area`, `width` va `height` yöq böladi. Har bir çaqiriş yangi lokal özgaruvçilar töplamini oladi.

Bu - **afzallik**: ikki funksiya bir-biriga xalal bermasdan `total` nomli özgaruvçidan foydalana oladi.

## Global özgaruvçilar

Faylning yuqori darajasida, barça funksiyalardan taşqarida yaratilgan özgaruvçilar **global** hisoblanadi. Funksiyalar ularni **öqiy** oladi:

```python
TAX_RATE = 0.12        # global

def price_with_tax(price):
    return price * (1 + TAX_RATE)   # globalni öqiş: muammo yöq

print(round(price_with_tax(10000)))
```

```text
11200
```

Global **konstantalarni** bunday öqiş odatiy va töğri amaliyot.

### Bloklar köriniş sohasi yaratmaydi

Faqat funksiyalar (hamda modullar va klasslar) yangi köriniş sohasini yaratadi. `if`, `for` yoki `while` bloki **yaratmaydi**, şuning uçun ular içida qiymat berilgan nomlar keyin ham turadi:

```python
for i in range(3):
    square = i * i

if square > 0:
    message = "musbat"

print(i, square, message)
```

```text
2 4 musbat
```

Sikldan keyin `i` öz oxirgi qiymatini saqlaydi, `message` esa mavjud, çunki `if` bajarildi. Har bir `{ }` bloki öz özgaruvçilariga ega bölgan tillarda işlagan bölsangiz, bu kutilmagan hol. Pythonda köriniş sohasi haqida öylaganda **funksiyalar** haqida öylang.

## Funksiya içida qiymat beriş lokal özgaruvçi yaratadi

Köpçilik aynan şu yerda hayron qoladi. Agar funksiya biror nomga **qiymat bersa**, bu nom, hatto şu nomli global özgaruvçi bölsa ham, butun funksiya uçun **lokal** böladi:

```python
count = 10

def reset():
    count = 0            # YANGI lokal 'count' yaratadi
    print(f"içkarida: {count}")

reset()
print(f"taşqarida: {count}")
```

```text
içkarida: 0
taşqarida: 10
```

Global `count` ga umuman tegilmadi. Funksiyaning özining alohida `count` özgaruvçisi bor edi.

### UnboundLocalError

Aynan şu qoida quyidagi xatoga sabab böladi:

```py
count = 10

def increment():
    count = count + 1     # bu yerda 'count' lokal, çunki unga qiymat berilyapti
    return count

increment()
```

```text
UnboundLocalError: cannot access local variable 'count' where it is not associated with a value
```

Python funksiyani **işga tuşirişdan oldin** `count` lokal ekanini hal qiladi, çunki funksiyaning qayeridadir unga qiymat berilgan. Şuning uçun `count + 1` bajarilganda lokal `count` hali qiymatga ega emas. Xato xabari aynan şuni aytadi: lokal `count` özgaruvçisiga u qiymatga ega bölmagan joyda murojaat qilib bölmaydi.

Eng yaxşi yeçim - **qiymatni parametr sifatida uzatiş va yangi qiymatni qaytariş**:

```python
count = 10

def increment(value):
    return value + 1

count = increment(count)
print(count)
```

```text
11
```

## `global` kalit sözi (kam işlating)

`global` Pythonga funksiya içidagi nom global özgaruvçini bildirişini aytadi:

```python
visits = 0

def record_visit():
    global visits
    visits += 1

record_visit()
record_visit()
print(visits)
```

```text
2
```

Bu işlaydi, lekin köp hollarda **undan qoçing**:

- Qiymatni istalgan funksiya özgartirişi mumkin, şuning uçun xatolarni kuzatiş qiyin.
- Funksiya yaşirin holatga boğliq böladi, bu esa uni qayta işlatiş va test qilişni qiyinlaştiradi.

Parametrlar va qaytariladigan qiymatlarni afzal köring. Keyinroq *Klasslar va obyektlar* darsi holatni uni özgartiradigan funksiyalar bilan birga saqlaşning toza usulini körsatadi.

## Python nomni qanday topadi: LEGB

Kodingiz biror nomdan foydalanganda, Python quyidagi sohalarni **tartib bilan** qidiradi va birinçi topilgan moslikni işlatadi:

| | Soha | U yerda nima bor |
|---|---|---|
| **L** | Local (lokal) | joriy funksiyada qiymat berilgan nomlar |
| **E** | Enclosing (örab turuvçi) | taşqi funksiyalardagi nomlar (funksiya boşqa funksiya içida yaratilganda) |
| **G** | Global | faylning yuqori darajasidagi nomlar |
| **B** | Built-in (içki) | Pythonning içki nomlari: `print`, `len`, `sum`, … |

```python
x = "global"

def outer():
    x = "örab turuvçi"

    def inner():
        x = "lokal"
        print(x)

    inner()
    print(x)

outer()
print(x)
```

```text
lokal
örab turuvçi
global
```

**B** darajasi `list` yoki `sum` nomli global özgaruvçi nega örnatilgan funksiyani yaşirişini tuşuntiradi (4-xato).

## `nonlocal`: örab turuvçi özgaruvçini özgartiriş

Içma-iç funksiyalar uçun `nonlocal` - `global` ning muqobili. U içki funksiyaga **örab turuvçi** funksiyaning özgaruvçisiga qiymat beriş imkonini beradi:

```python
def make_counter():
    count = 0

    def increase():
        nonlocal count
        count += 1
        return count

    return increase

counter = make_counter()
print(counter())
print(counter())
print(counter())
```

```text
1
2
3
```

`make_counter` içki funksiyani qaytaradi va bu funksiya `make_counter` işini tugatgandan keyin ham `count` ni **eslab qoladi**. Bu **closure (yopiq funksiya)** deb ataladi. Boşlovçi sifatida u sizga köp kerak bölmaydi, lekin *Lambda va yuqori tartibli funksiyalar* darsida u bilan yana uçraşasiz.

## Argumentni özgartiriş va qayta qiymat beriş

Funksiyaga röyxat yoki luğat uzatganingizda parametr xuddi *Röyxatlar* darsidagi `b = a` kabi **aynan şu obyektni** körsatadi. Bu ikki butunlay boşqa holatga olib keladi:

```python
def add_bonus(scores):
    scores.append(100)      # aynan şu röyxatni ÖZGARTIRADI: çaqiruvçi buni köradi

def replace_scores(scores):
    scores = [0, 0, 0]      # faqat lokal nomni QAYTA BOĞLAYDI: çaqiruvçi buni körmaydi

my_scores = [80, 90]

add_bonus(my_scores)
print(my_scores)

replace_scores(my_scores)
print(my_scores)
```

```text
[80, 90, 100]
[80, 90, 100]
```

- Obyektni `append`, `remove` yoki `sort` kabi metod bilan yoki `d[key] = …` kabi elementga qiymat beriş bilan **özgartiriş** çaqiruvçining obyektiga taʼsir qiladi.
- Parametr nomiga yangi qiymat **beriş** faqat lokal nomni özgartiradi.

Sonlar va satrlar özgarmas (immutable), şuning uçun funksiya çaqiruvçining sonini yoki satrini hec qaçon özgartira olmaydi. U faqat yangisini qaytarişi mumkin.

::: tip Çaqiruvçini hayron qoldirmang
Siz bergan röyxatni jimgina özgartiradigan funksiya çalkaş xatolarga sabab bölişi mumkin. Buni yo aniq körsating (`add_bonus_in_place` deb nomlang va hec narsa qaytarmang), yoki nusxa bilan işlang va **yangi röyxat qaytaring**:

```python
def with_bonus(scores):
    return scores + [100]      # yangi röyxat; asl röyxat özgarmaydi

original = [80, 90]
updated = with_bonus(original)
print(original, updated)
```
:::

## Özingiz sinab köring

Işga tuşirişdan oldin natijani taxmin qiling. Keyin `global total` ni öçirib, qanday xato çiqişini köring.

<ClientOnly><PythonPlayground :code='"total = 0\n\ndef add(amount):\n    global total\n    total += amount\n\ndef add_pure(current, amount):\n    return current + amount\n\nadd(50)\nadd(25)\nprint(\"global bilan:\", total)\n\nrunning = 0\nrunning = add_pure(running, 50)\nrunning = add_pure(running, 25)\nprint(\"global siz:\", running)"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Funksiya içida globalga `+=` qöllaş

```py
visits = 0

def record_visit():
    visits += 1

record_visit()
```

```text
UnboundLocalError: cannot access local variable 'visits' where it is not associated with a value
```

`visits += 1` bu qiymat beriş, şuning uçun `visits` butun funksiya uçun lokal va `+=` uni öqiganda unda hali qiymat yöq. **Tuzatiş:** qiymatni uzating va yangisini qaytaring (`visits = record_visit(visits)`). `global` ni faqat haqiqatan zarur bölganda işlating.

### 2. Qayta qiymat beriş çaqiruvçining özgaruvçisini özgartiradi deb kutiş

```python
def clear(items):
    items = []

data = [1, 2, 3]
clear(data)
print(data)
```

```text
[1, 2, 3]
```

`items = []` faqat lokal nomni yangi röyxatga yönaltiradi. **Tuzatiş:** `items.clear()` röyxatni joyida özgartiradi. Yoki yangi röyxat qaytaring va çaqiruvçida unga qayta qiymat bering.

### 3. Çaqiruvçining röyxatini tasodifan özgartiriş

```python
def top_three(scores):
    scores.sort(reverse=True)
    return scores[:3]

results = [72, 95, 58, 88]
print(top_three(results))
print(results)
```

```text
[95, 88, 72]
[95, 88, 72, 58]
```

Funksiya töğri javob berdi, lekin çaqiruvçining `results` röyxatini ham qayta tartibladi. **Tuzatiş:** agar çaqiruvçiga taʼsir qilmasligi kerak bölsa, nusxa ustida işlang: `sorted(scores, reverse=True)[:3]`.

### 4. Içki nomlarni yaşiriş

```py
def average(list):
    return sum(list) / len(list)

print(average([1, 2, 3]))
print(list("abc"))     # bu yerda işlaydi, çunki parametr lokal edi

list = [1, 2]          # lekin yuqori darajada...
print(list("abc"))
```

```text
2.0
['a', 'b', 'c']
TypeError: 'list' object is not callable
```

Xato `list` endi funksiya emas, röyxat obyekti ekanini va uni çaqirib bölmasligini aytyapti. **Tuzatiş:** `list`, `str`, `sum` yoki `max` örniga `values` yoki `numbers` kabi nomlardan foydalaning.

## Maşqlar

### 1. Natijani taxmin qiling <Difficulty level="1" />

```python
name = "Global"

def show():
    name = "Lokal"
    print(name)

show()
print(name)
```

::: details Yeçim
```text
Lokal
Global
```

`show` içida `name` ga qiymat beriş alohida lokal özgaruvçi yaratdi.
:::

### 2. global siz tuzating <Difficulty level="1" />

Bu kod `UnboundLocalError` beradi. Uni `global` dan foydalanmasdan tuzating.

```py
score = 0

def add_points(points):
    score = score + points

add_points(10)
add_points(5)
print(score)
```

::: details Yeçim
```python
score = 0

def add_points(current, points):
    return current + points

score = add_points(score, 10)
score = add_points(score, 5)
print(score)
```

```text
15
```
:::

### 3. Qaysilari özgaradi? <Difficulty level="2" />

Natijani taxmin qiling, keyin işga tuşiring.

```python
def modify(numbers, text, count):
    numbers.append(4)
    text = text.upper()
    count += 1

nums = [1, 2, 3]
word = "salom"
n = 10

modify(nums, word, n)
print(nums, word, n)
```

::: details Yeçim
```text
[1, 2, 3, 4] salom 10
```

Faqat röyxat özgardi, çunki `append` umumiy obyektni özgartiradi. `text.upper()` yangi satr yaratadi va u lokal `text` ga beriladi, `count += 1` esa lokal `count` ni qayta boğlaydi. Satrlar va sonlar özgarmas.
:::

### 4. Asl röyxatni özgartirmaydigan versiya <Difficulty level="2" />

Manfiy sonlarsiz **yangi** röyxat qaytaradigan va asl röyxatni özgartirmaydigan `remove_negatives(numbers)` funksiyasini yozing. Buni `assert` bilan isbotlang.

::: details Yeçim
```python
def remove_negatives(numbers):
    return [n for n in numbers if n >= 0]

original = [3, -1, 4, -1, 5]
cleaned = remove_negatives(original)

assert cleaned == [3, 4, 5]
assert original == [3, -1, 4, -1, 5]
print("OK")
```
:::

### 5. Bank hisobi closure <Difficulty level="3" />

**Ikkita** funksiya - `deposit(amount)` va `withdraw(amount)` ni qaytaradigan `make_account(balance)` funksiyasini yozing. Ular `nonlocal` yordamida bitta balansdan birgalikda foydalansin. Ikkalasi ham yangi balansni qaytaradi, pul yetarli bölmasa esa `withdraw` rad etadi (balansni özgartirmasdan qaytaradi va xabar çop etadi).

```py
deposit, withdraw = make_account(100000)
print(deposit(50000))     # 150000
print(withdraw(30000))    # 120000
print(withdraw(500000))   # ogohlantiriş çop etadi, 120000 qaytaradi
```

::: details Yeçim
```python
def make_account(balance):
    def deposit(amount):
        nonlocal balance
        balance += amount
        return balance

    def withdraw(amount):
        nonlocal balance
        if amount > balance:
            print("Mablağ yetarli emas")
            return balance
        balance -= amount
        return balance

    return deposit, withdraw

deposit, withdraw = make_account(100000)
print(deposit(50000))
print(withdraw(30000))
print(withdraw(500000))
```

```text
150000
120000
Mablağ yetarli emas
120000
```

`balance` parametri `make_account` ga tegişli va ikkala içki funksiya undan `nonlocal` orqali birgalikda foydalanadi. Taşqaridagi hec narsa balansni töğridan-töğri özgartira olmaydi. *Klasslar va obyektlar* darsida xuddi şu narsani klass yordamida quraysiz.
:::

## Xulosa

- Funksiya içida qiymat berilgan özgaruvçilar (parametrlar ham) **lokal**: ular har bir çaqirişda yaratiladi va keyin yöqoladi.
- Yuqori darajadagi özgaruvçilar **global**. Funksiyalar ularni öqiy oladi, global konstantalarni öqiş esa odatiy hol.
- Funksiyaning istalgan joyida nomga **qiymat beriş** uni butun funksiya uçun lokal qiladi, qiymat berişdan oldin undan foydalaniş esa `UnboundLocalError` beradi.
- Python nomlarni **L**ocal → **E**nclosing → **G**lobal → **B**uilt-in tartibida qidiradi.
- `global` va `nonlocal` taşqi özgaruvçilarga qiymat beriş imkonini beradi. Ularning örniga parametrlar va qaytariladigan qiymatlarni afzal köring.
- Röyxatni uzatiş obyektni bölişadi: uni **özgartiriş** çaqiruvçiga taʼsir qiladi, parametrga **qayta qiymat beriş** esa taʼsir qilmaydi.

## Qöşimça manbalar

- [Python Tutorial - Scopes and namespaces](https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces)
- [Python FAQ - What are the rules for local and global variables?](https://docs.python.org/3/faq/programming.html#what-are-the-rules-for-local-and-global-variables-in-python)
- [Python FAQ - Why am I getting an UnboundLocalError?](https://docs.python.org/3/faq/programming.html#why-am-i-getting-an-unboundlocalerror-when-the-variable-has-a-value)
