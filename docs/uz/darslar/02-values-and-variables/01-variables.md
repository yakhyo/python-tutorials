---
title: Özgaruvçilar
description: "Qiymatlarni özgaruvçilarda saqlang: qiymat beriş, qayta qiymat beriş, nomlaş qoidalari, bir neçta qiymat beriş va Pythonda nomlar aslida qanday işlaşi."
---

# Özgaruvçilar

![Rasm: Özgaruvçilar](/images/topics-webp-uzb/variables.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `=` bilan özgaruvçi yaratiş va undan keyinroq foydalaniş
- Özgaruvçiga **qayta qiymat berganingizda** nima böladi
- Özgaruvçilarni nomlaş qoidalari va kelişuvlari
- Bir neçta özgaruvçiga birdaniga qiymat beriş va ikki qiymat örnini almaştiriş
- `type()` bilan qiymat turini tekşiriş
:::

## Nega bu muhim

Dasturlar maʼlumot bilan işlaydi: foydalanuvçi ismi, narx, oçko, bugungi harorat. **Özgaruvçi** (variable) qiymatga nom beradi, şunda undan foydalaniş, uni özgartiriş va boşqa qiymatlar bilan birlaştiriş mumkin böladi. Bundan keyin yozadigan deyarli har bir kod qatoringizda özgaruvçilar böladi.

## Özgaruvçi yaratiş

Nom, teng belgisi va qiymat yozing:

```python
city = "Samarqand"
population = 580000

print(city)
print(population)
```

```text
Samarqand
580000
```

`=` - **qiymat beriş operatori**. U matematikadagi "teng" degan maʼnoni bildirmaydi. Uni **"bu nom şu qiymatni körsatsin"** deb öqing:

> `city = "Samarqand"` → *"`city` `Samarqand` degan matnni körsatsin"*

Python avval **öng** tomondagi qiymatni hisoblaydi, keyin **çap** tomondagi nomni unga biriktiradi:

```python
price = 12000
quantity = 3
total = price * quantity   # avval öng tomon hisoblanadi: 36000

print("Jami:", total)
```

## Qayta qiymat beriş: özgaruvçilar özgarişi mumkin

Özgaruvçini istalgan vaqtda yangi qiymatga yönaltiriş mumkin. Eski qiymat unutiladi:

```python
score = 10
print(score)

score = 25
print(score)
```

```text
10
25
```

Juda köp uçraydigan usul - özgaruvçini **uning joriy qiymatidan foydalanib** yangilaş:

```python
steps = 1000
steps = steps + 500    # joriy qiymatni olamiz, 500 qöşamiz va qayta saqlaymiz
print(steps)
```

```text
1500
```

Bu şunçalik köp uçraydiki, Pythonda buning uçun qisqa yozuv bor: `+=`. Boşqa operatorlar uçun ham mos qisqa yozuvlar mavjud:

```python
steps = 1000
steps += 500    # xuddi şu: steps = steps + 500
steps -= 200    # xuddi şu: steps = steps - 200
steps *= 2      # xuddi şu: steps = steps * 2
print(steps)
```

```text
2600
```

## Nomlar quti emas, yorliq

![Diagramma: Nomlar quti emas, yorliq](/images/companions-webp-uzb/variable-labels.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Özgaruvçilarni köpinça "qiymat saqlaydigan qutilar" deb taʼriflaşadi. Python uçun esa **qiymatga yopiştirilgan nom yorliği** töğriroq tasavvur. Ikki nom bitta qiymatga yopiştirilgan bölişi mumkin:

```python
a = "salom"
b = a        # endi b ham a körsatayotgan qiymatni körsatadi
a = "xayr"   # a yorliğini yangi qiymatga köçiramiz; b özgarmaydi

print(a)
print(b)
```

```text
xayr
salom
```

`b = a` *nomlar* orasida boğlaniş yaratmaydi. U `b` ni **aynan şu paytda** `a` körsatib turgan qiymatga yönaltiradi. Keyinroq `a` ni köçirsangiz, `b` köçmaydi.

Bu tasavvur joyida özgartiriladigan röyxatlarni örganganingizda muhim böladi.

## Nomlaş qoidalari

Python bu qoidalarga amal qilişni **talab qiladi**:

1. Nomlarda **harflar, raqamlar va pastki çiziq** (`_`) böliş mumkin.
2. Nom **raqam bilan boşlanişi mumkin emas**.
3. Böş joy yoki `-`, `!`, `@` kabi belgilar bölmasligi kerak.
4. Nomlar **katta-kiçik harfni farqlaydi**: `age`, `Age` va `AGE` - uçta har xil özgaruvçi.
5. Pythonning **kalit sözlarini**, yaʼni `if`, `for`, `class`, `True` va `None` kabi maxsus maʼnoli sözlarni işlatib bölmaydi.

| Nom | Töğrimi? | Nega |
|---|---|---|
| `user_name` | <Yes /> | |
| `total2` | <Yes /> | Birinçi belgidan keyin raqamlar böliş mumkin |
| `_hidden` | <Yes /> | Boşida pastki çiziq bölişi mumkin |
| `2nd_place` | <No /> | Raqam bilan boşlanadi |
| `user-name` | <No /> | `-` ayiriş belgisi |
| `first name` | <No /> | Böş joy bor |
| `class` | <No /> | Kalit söz |

Barça kalit sözlarni köriş uçun `import keyword` va `print(keyword.kwlist)` ni işga tuşiring.

## Nomlaş kelişuvlari

Python bularni majburlamaydi, lekin har bir Python dasturçisi ularga amal qiladi (*Izohlar va kod uslubi* ga qarang):

- **`snake_case`** dan foydalaning: pastki çiziq bilan birlaştirilgan kiçik harfli sözlar, masalan, `monthly_salary`.
- **Tuşunarli** nomlar tanlang: `temperature_c` nomi `t` dan yaxşiroq. `i` yoki `x` kabi qisqa nomlar juda kiçik va aniq holatlar uçun maqul.
- Konstantalar, yaʼni özgartirmoqçi bölmagan qiymatlaringiz uçun **`UPPER_CASE`** dan foydalaning: `MAX_ATTEMPTS = 3`.
- `print`, `input`, `list`, `str`, `sum` yoki `type` kabi içki funksiyalar nomlarini özgaruvçi nomi sifatida işlatmang (*Köp uçraydigan xatolar* ga qarang).

```python
MAX_ATTEMPTS = 3
attempts_left = MAX_ATTEMPTS
attempts_left -= 1
print("Qolgan urinişlar:", attempts_left)
```

## Bir neçta özgaruvçi birdaniga

Bitta qatorda bir neçta nomga qiymat beriş mumkin, qiymatlar çapdan öngga mos keladi:

```python
name, age, city = "Dilnoza", 22, "Buxoro"
print(name, age, city)
```

Bu ikki qiymat örnini **almaştirişning** qulay usulini beradi, vaqtinçalik özgaruvçi kerak emas:

```python
left = "çoy"
right = "qahva"

left, right = right, left

print(left, right)
```

```text
qahva çoy
```

Python biror narsaga qiymat berişdan **oldin** butun öng tomonni hisoblaydi (`right, left` → `"qahva", "çoy"`). Şuning uçun almaştiriş işlaydi.

Bir neçta nomga bir xil qiymat berişingiz ham mumkin:

```python
x = y = 0
print(x, y)
```

## Har bir qiymatning turi bor

Qiymatlar har xil **turlarda** böladi: butun sonlar, önlik sonlar, matn va boşqalar. Içki `type()` funksiyasi qaysi tur ekanini aytadi:

```python
print(type(42))
print(type(3.14))
print(type("salom"))
print(type(True))
```

```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
```

| Tur | Nomi | Misol |
|---|---|---|
| `int` | butun son (integer) | `42`, `-7`, `0` |
| `float` | önlik son (float) | `3.14`, `-0.5`, `2.0` |
| `str` | satr (string), yaʼni matn | `"salom"`, `'42'` |
| `bool` | mantiqiy qiymat (boolean): rost/yolğon | `True`, `False` |
| `NoneType` | "qiymat yöq" | `None` (bu turning yagona qiymati) |

`None` "hali hiç narsa yöq" degani. Özgaruvçi qiymati maʼlum bölişidan oldin mavjud bölişi kerak bölganda undan foydalaning:

```python
best_score = None
print(best_score)
print(type(best_score))
```

```text
None
<class 'NoneType'>
```

`None` - `0` ham, böş satr ham emas. U "nomaʼlum" yoki "hali berilmagan" degan alohida qiymat. Uni funksiyalar va `if` operatorlarida yana uçratasiz.

Pythonda **özgaruvçining** qatʼiy turi yöq. Tur **qiymatga** tegişli. Bitta nom hozir sonni, keyinroq esa satrni körsatişi mumkin:

```python
thing = 5
print(type(thing))
thing = "beş"
print(type(thing))
```

Bu moslanuvçanlik qulay, lekin bitta nomni har xil maʼlumotlar uçun qayta işlatiş kodni çalkaş qiladi. Har bir özgaruvçiga bitta maʼno bering.

Keyingi darslarda sonlar, satrlar va mantiqiy qiymatlar batafsil körib çiqiladi.

## Özingiz sinab köring

Qiymatlarni özgartiring, `discount` özgaruvçisini qöşing va yakuniy narxni çiqaring.

<ClientOnly><PythonPlayground :code='"item = \"Daftar\"\nprice = 15000\nquantity = 4\n\ntotal = price * quantity\nprint(item, \"x\", quantity, \"=\", total, \"söm\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Özgaruvçini yaratişdan oldin işlatiş (yoki notöğri yoziş)

```py
total_price = 500
print(total_prise)
```

```text
NameError: name 'total_prise' is not defined. Did you mean: 'total_price'?
```

Python yuqoridan pastga öqiydi, şuning uçun özgaruvçiga u işlatilişidan **oldin** qiymat berilişi va u aynan bir xil yozilişi kerak.

### 2. Notöğri nomlar

```py
2nd_place = "Bekzod"
```

```text
SyntaxError: invalid decimal literal
```

Xabar tuşunarsiz ("notöğri önlik son"), lekin sababi - nomning raqam bilan boşlanişi. **Tuzatiş:** `second_place`.

### 3. Tomonlarni adaştiriş

```py
5 = x
```

```text
SyntaxError: cannot assign to literal here. Maybe you meant '==' instead of '='?
```

**Nom çap tomonda**, qiymat öng tomonda turadi: `x = 5`.

### 4. Içki funksiyani yaşirib qöyiş

```py
print = "Salom"
print("Salom")
```

```text
TypeError: 'str' object is not callable
```

`print = "Salom"` dan keyin `print` nomi funksiya örniga satrni körsatadi. Xabar ham "satr obyektini çaqirib bölmaydi" deydi. **Tuzatiş:** boşqa nom tanlang, masalan, `message`. REPL da `print` ni qaytariş uçun Pythonni qayta işga tuşiring.

## Maşqlar

### 1. Qiymatlarni kuzating <Difficulty level="1" />

Işga tuşirmasdan, bu kod nima çiqarişini yozib qöying. Keyin işga tuşirib, tekşiring.

```python
a = 4
b = a * 2
a = 10
b += a
print(a, b)
```

::: details Yeçim
```text
10 18
```

`b` `8` ga teng böladi (4 × 2). Keyin `a` `10` ga özgaradi, bu `b` ga taʼsir qilmaydi. Keyin `b += a` `b` ni `8 + 10 = 18` ga teng qiladi.
:::

### 2. Şaxsiy maʼlumotlar <Difficulty level="1" />

Ismingiz, tuğilgan yilingiz va şahringiz uçun özgaruvçilar yarating. Uçalasini işlatib, bitta gap çiqaring, masalan, `Aziza 2004 yilda tuğilgan va Toşkent şahrida yaşaydi`.

::: details Yeçim
```python
first_name = "Aziza"
birth_year = 2004
city = "Toşkent"

print(first_name, birth_year, "yilda tuğilgan va", city, "şahrida yaşaydi")
```
:::

### 3. Almaştiriş <Difficulty level="2" />

`morning` va `evening` qiymatlarini almaştiring, şunda dastur alohida qatorlarda `evening: qahva` va `morning: çoy` ni çiqarsin. Satrlarni qaytadan yozmang.

```python
morning = "qahva"
evening = "çoy"
# kodingiz şu yerda
```

::: details Yeçim
```python
morning = "qahva"
evening = "çoy"

morning, evening = evening, morning

print("evening:", evening)
print("morning:", morning)
```
:::

### 4. Nomlarni tuzating <Difficulty level="2" />

Bu kod işlamaydi. Har bir nomni u işlaydigan va kelişuvlarga mos keladigan qilib tuzating. Çiqaradigan natijasini özgartirmang.

```py
1st-item = "ruçka"
Item Price = 3000
class = 2
print(1st-item, Item Price * class)
```

::: details Yeçim
```python
first_item = "ruçka"
item_price = 3000
quantity = 2
print(first_item, item_price * quantity)
```

- `1st-item` raqam bilan boşlanadi va unda `-` bor.
- `Item Price` da böş joy va katta harflar bor.
- `class` - kalit söz.
:::

### 5. Jamğarma hisobi <Difficulty level="3" />

`savings = 0` dan boşlang. Alohida qatorlarda faqat `+=` va `-=` dan foydalanib, quyidagi hodisalarni qayd eting va har biridan keyin `savings` ni çiqaring:

1. Siz 200 000 söm olasiz.
2. Siz 45 000 söm sarflaysiz.
3. Siz 150 000 söm olasiz.
4. Siz 80 000 söm sarflaysiz.

Yakuniy qoldiq `225000` bölişi kerak.

::: details Yeçim
```python
savings = 0

savings += 200000
print("Daromaddan keyin:", savings)

savings -= 45000
print("Xarajatdan keyin:", savings)

savings += 150000
print("Daromaddan keyin:", savings)

savings -= 80000
print("Xarajatdan keyin:", savings)
```

Har bir qadamdan keyin natijani çiqariş - xatolarni osongina köriş imkonini beradigan oddiy odat.
:::

## Xulosa

- `name = value` özgaruvçi yaratadi yoki uni yangilaydi. Avval öng tomon hisoblanadi.
- Qayta qiymat beriş eski qiymatni almaştiradi. `+=`, `-=` va `*=` özgaruvçini uning joriy qiymatidan foydalanib yangilaydi.
- Nomlar - qiymatlarning **yorliqlari**. `b = a` doimiy boğlaniş emas, şu paytdagi havolani nusxalaydi.
- Nomlarda harflar, raqamlar va `_` böladi, ular raqam bilan boşlanmaydi, katta-kiçik harfni farqlaydi va kalit söz bölolmaydi. `snake_case` dan foydalaning.
- `a, b = b, a` ikki qiymat örnini almaştiradi. `type(value)` qiymat turini körsatadi.

## Qöşimça manbalar

- [Python Tutorial - Numbers and variables](https://docs.python.org/3/tutorial/introduction.html#numbers)
- [Assignment statements](https://docs.python.org/3/reference/simple_stmts.html#assignment-statements)
- [Keywords](https://docs.python.org/3/reference/lexical_analysis.html#keywords)
