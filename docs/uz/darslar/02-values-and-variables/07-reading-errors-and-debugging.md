---
title: Xato xabarlarini öqiş va tuzatiş
description: "Python xato xabarlarini tuşuning, eng köp uçraydigan xato turlarini taniş va xatolarni topib tuzatişning oddiy, işonçli jarayonidan foydalaning."
---

# Xato xabarlarini öqiş va tuzatiş

![Rasm: Xato xabarlarini öqiş va tuzatiş](/images/topics-webp-uzb/reading-errors-and-debugging.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Traceback** (xato izi) ni qanday öqiş va birinçi navbatda qaysi qatorga qaraş
- Sintaksis xatolari va bajariş vaqtidagi xatolar orasidagi farq
- Eng köp uçraydigan xato turlari va ularning odatiy sabablari
- **Mantiqiy xatolar**: xato xabari çiqmaydigan xatolar
- Har qanday muammoda qöllaş mumkin bölgan qadamma-qadam xatolarni tuzatiş jarayoni
:::

## Nega bu muhim

Har bir dasturçi, qaysi darajada bölmasin, har kuni xatoli kod yozadi. Yangi boşlovçini tajribali dasturçidan ajratib turadigan narsa kamroq xato qiliş emas, balki xatolarni **tezroq topiş**. Pythonning xato xabarlari batafsil va köpinça tuzatiş yölini ham taklif qiladi. Ularni öqişni örgansangiz, qörqinçli qizil matn devori foydali eslatmaga aylanadi.

## Xato xabarining tuzilişi

![Diagramma: Xato xabarining tuzilişi](/images/companions-webp-uzb/traceback-anatomy.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Buni `shop.py` nomi bilan saqlang va işga tuşiring:

```py
price = 25000
quantity = input("Neçta? ")
total = price * quantity + delivery
print(total)
```

`3` ni yozganingizdan keyin quyidagini olasiz:

```text
Traceback (most recent call last):
  File "shop.py", line 3, in <module>
    total = price * quantity + delivery
                               ^^^^^^^^
NameError: name 'delivery' is not defined
```

Uni **pastdan yuqoriga** öqing:

| Qism | U sizga nimani aytadi |
|---|---|
| `NameError` | Xatoning **turi** |
| `name 'delivery' is not defined` | **Xabar**: aynan nima notöğri ketgan ("`delivery` nomi aniqlanmagan") |
| `^^^^^^^^` | Muammo qatorning **qayerida** ekanligi |
| `total = price * quantity + delivery` | Bajarilmay qolgan kod qatori |
| `File "shop.py", line 3` | **Fayl va qator raqami**. Kompyuteringizda töliq yöl körinadi, masalan `File "/home/aziza/shop.py"` |
| `Traceback (most recent call last)` | Sarlavha. Keyinroq funksiyalar boşqa funksiyalarni çaqirganda, bu yerda har bir qadam körsatiladi |

**1-qoida: avval oxirgi qatorni öqing.** Odatda u nima notöğri ekanini aytadi.

Şu qatordan oldin `delivery = 5000` ni aniqlab, xatoni tuzating va yana işga tuşiring:

```text
TypeError: can only concatenate str (not "int") to str
```

Yangi xato - demak, oldinga siljidik! `quantity` satr, çunki `input()` matn qaytaradi. Qiziği şundaki, `price * quantity` xato bermadi: son satrga köpaytirilsa, satr **takrorlanadi**, şuning uçun `"333…"` hosil böldi. Aynan şu satrga `delivery` ni qöşiş xatoga olib keldi. Tuzatiş: `quantity = int(input("Neçta? "))`. Bitta xatoni tuzatiş köpinça keyingisini oçib beradi, şuning uçun davom eting.

## Xatolarning ikki turi

### Sintaksis xatolari: Python kodingizni öqiy olmaydi

Python **biror narsani bajarişdan oldin butun faylning** grammatikasini tekşiradi. Agar biror joy notöğri tuzilgan bölsa, umuman heç narsa bajarilmaydi:

```py
print("Boşlanişi")
print("Salom"
print("Oxiri")
```

```text
  File "demo.py", line 2
    print("Salom"
         ^
SyntaxError: '(' was never closed
```

Eʼtibor bering, `Boşlanişi` umuman çiqarilmadi. 3.10 dan boşlab Python yopilmagan qavsni u **oçilgan** qatorda, yopilmagan satrni esa öz qatorida körsatadi. Agar xabar şunçaki `invalid syntax` bölsa va körsatilgan qator tögri körinsa, undan yuqoridagi qatorni ham tekşiring.

`IndentationError` va `TabError` - sintaksis xatolarining maxsus turlari.

### Bajariş vaqtidagi xatolar (istisnolar): işlaş paytida nimadir notöğri ketdi

Grammatika joyida edi, lekin qaysidir qator bajarilayotganda xato berdi. Şu qatordan **oldingi** hamma narsa allaqaçon bajarilgan:

```py
print("Boşlanişi")
print(10 / 0)
print("Oxiri")
```

```text
Boşlanişi
Traceback (most recent call last):
  File "demo.py", line 2, in <module>
    print(10 / 0)
          ~~~^~~
ZeroDivisionError: division by zero
```

## Eng köp köradigan xatolar

| Xato | Odatiy sababi | Misol |
|---|---|---|
| `SyntaxError` | `)`, `"` yoki `:` yetişmaydi; kalit sözda xato | `print("salom"` |
| `IndentationError` | Notöğri yoki yetişmayotgan çekiniş | sababsiz çekiniş qilingan qator |
| `NameError` | Özgaruvçi hali aniqlanmagan yoki notöğri yozilgan | `print(totl)` |
| `TypeError` | Amal notöğri turga qöllanilgan | `"Yoş: " + 20` |
| `ValueError` | Tur töğri, lekin qiymat yaroqsiz | `int("abc")` |
| `ZeroDivisionError` | Nolga böliş | `5 / 0` |
| `IndexError` | Indeks oxiridan narida | `"non"[5]` |
| `AttributeError` | Bu tur uçun bunday metod yöq | `(42).upper()` |

Python xabarlarida köpinça maslahat ham böladi. Uni öqing:

```text
NameError: name 'pirnt' is not defined. Did you mean: 'print'?
```

```text
SyntaxError: invalid syntax. Perhaps you forgot a comma?
```

Birinçisi "`print` ni nazarda tutdingizmi?", ikkinçisi "vergulni unutmadingizmi?" deb söraydi.

## Mantiqiy xatolar: jimjit xatolar

Eng qiyin xatolar **umuman xato xabari çiqarmaydi**. Dastur işlaydi, lekin notöğri javob beradi:

```python
score1 = 80
score2 = 90
average = score1 + score2 / 2   # (score1 + score2) / 2 bölişi kerak edi
print(f"Örtaça: {average}")
```

```text
Örtaça: 125.0
```

Python aynan siz yozgan narsani bajardi. Mantiqiy xatolarni ilğaş uçun **töğri javob qanday bölişi kerakligini bilişingiz** va uni tekşirişingiz kerak. Şuning uçun bu darslikdagi maşqlar sizdan işga tuşirişdan oldin natijani taxmin qilişni qayta-qayta söraydi.

## Xatolarni tuzatiş jarayoni

Biror narsa notöğri bölsa, kodni tasodifiy özgartiriş örniga şu qadamlarga amal qiling.

### 1. Xato xabarini diqqat bilan öqing

Oxirgi qatordan boşlang: xato turi va xabar. Keyin qator raqamiga va `^` belgilariga qarang. Qator tögri körinsa-yu, xabar şunçaki `invalid syntax` bölsa, yuqoridagi qatorni ham tekşiring.

### 2. Xatoni işonçli takrorlang

Muammoni keltirib çiqaradigan aniq kiritişni toping. "`12.5` deb yozsam xato beradi" degan muammoni "baʼzan buziladi" degan muammodan köra tuzatiş ança oson.

### 3. Taxminlaringizni `print()` bilan tekşiring

Köp xatolar özgaruvçida siz öylagan qiymat bölmasligidan kelib çiqadi. Muhim joylarda qiymatlar va turlarni çiqaring:

```python
quantity = "3"          # tasavvur qiling, bu input() dan kelgan
price = 25000

print(f"{quantity=}, {type(quantity)=}")   # tekşiruv qatori
total = price * int(quantity)
print(f"{total=}")                          # tekşiruv qatori
```

```text
quantity='3', type(quantity)=<class 'str'>
total=75000
```

*F-satrlar* darsidagi `=` şakli bu yerda juda qöl keladi. Işingiz tugagaç, **tekşiruv print larini olib taşlang**.

::: tip Debugger bilan qadamma-qadam yuring
**Debugger** dasturingizni bir vaqtda bitta qatordan işga tuşiradi va har bir özgaruvçining qanday özgarişini körsatadi. Thonny da Run örniga **Debug** (qöngiz belgisi) ni bosing, keyin qadam taşlaş uçun **F7** ni bosing. VS Code da qator raqamining çap tomoniga bosib **töxtaş nuqtasi (breakpoint)** qöying, keyin **F5** ni bosing. Bu haqda *Xatolarni tuzatiş va logging* darsida köproq bilib olasiz.
:::

### 4. Bir vaqtda faqat bitta narsani özgartiring

Bitta özgariş kiriting, yana işga tuşiring va nima bölganini köring. Beşta narsani birdaniga özgartirsangiz, qaysi özgariş taʼsir qilganini bilmay qolasiz.

### 5. Muammoni kiçraytiring

Xato hali ham körinib turadigan **eng kiçik** dastur qolgunça kodni olib taşlang yoki izohga aylantiring. Köpinça sabab özidan özi ayon böladi. Yordam sörasangiz, odamlarga ham aynan şunday kiçik misol kerak böladi.

### 6. Tuşuntiring, qidiring yoki tanaffus qiling

Kodingizni kimgadir yoki rezina ördakçaga qatorma-qator tuşuntirib bering (**rezina ördak usuli**, rubber duck debugging). *"Bu yerda esa `total`… e, u satr ekan"* köp xatolarni topadi. Baribir turib qoldingizmi? Xatoning oxirgi qatorini qidiring yoki ön daqiqa tanaffus qiling.

## Özingiz sinab köring

Bu dasturda **uçta** xato bor: bitta sintaksis xatosi, bitta bajariş vaqtidagi xato va bitta mantiqiy xato. Ularni birma-bir tuzating va har bir tuzatişdan keyin işga tuşiring. Dastur `Yuza: 12.0` va `Perimetr: 14.0` ni çiqarişi kerak.

<ClientOnly><PythonPlayground :code='"width = \"4\"\nheight = 3.0\n\narea = width * height\nperimeter = 2 * width + height\n\nprint(f\"Yuza: {area}\"\nprint(f\"Perimetr: {perimeter}\")"' /></ClientOnly>

::: details Maslahatlar
1. `SyntaxError`: yopilmagan qavsni qidiring.
2. `TypeError`: `width` qaysi turda?
3. Perimetr notöğri: qaysi amal birinçi bajariladi?
:::

## Köp uçraydigan xatolar

### 1. Xatoni notögri narsani özgartirib "tuzatiş"

```py
age = "20"   # 20 edi, TypeError ni yöqotiş uçun özgartirildi
print("Yoş: " + age)
print("Kelasi yil:", age + 1)
```

```text
Yoş: 20
Traceback (most recent call last):
  File "age.py", line 3, in <module>
    print("Kelasi yil:", age + 1)
                         ~~~~^~~
TypeError: can only concatenate str (not "int") to str
```

Sonni satrga aylantiriş 2-qatorni tuzatdi, lekin xatoni 3-qatorga köçirdi. **Tuzatiş:** `age = 20` ni saqlab qoling va faqat matn kerak bölgan joyda özgartiring: `"Yoş: " + str(age)`. Davom etişdan oldin özgariş *nega* işlaganini tuşunib oling.

### 2. Faqat tögri körinadigan qiymatni çop etiş

```python
quantity = "3"
print(quantity)
print(f"{quantity=}")
```

```text
3
quantity='3'
```

Oddiy `print()` `"3"` satri uçun ham, `3` soni uçun ham `3` ni körsatadi. **Tuzatiş:** `=` (yoki `!r`) bilan tekşiring, ular satrlarni qöştirnoq içiga oladi.

## Maşqlar

### 1. Xatoni nomlang <Difficulty level="1" />

Işga tuşirmasdan, har bir qator qaysi **turdagi** xatoni berişini taxmin qiling. Har bir qatorni alohida dastur deb hisoblang:

```py
print("Salom)
print(undefined_name)
print(int("salom"))
print("5" + 5)
print(10 % 0)
print("abc"[3])
```

::: details Yeçim
1. `SyntaxError`: satr yopilmagan
2. `NameError`
3. `ValueError`
4. `TypeError`
5. `ZeroDivisionError`
6. `IndexError`
:::

### 2. Traceback ni öqing <Difficulty level="1" />

Bu traceback haqidagi savollarga javob bering: qaysi qator xato berdi? Xato turi qanday? Sababi nima?

```text
Traceback (most recent call last):
  File "grades.py", line 7, in <module>
    percent = points / max_points * 100
                       ^^^^^^^^^^
NameError: name 'max_points' is not defined. Did you mean: 'max_point'?
```

::: details Yeçim
- `grades.py` ning **7-qatori**.
- **`NameError`**.
- Özgaruvçi oldinroq qayerdadir `max_point` (birlikda) deb nomlangan, 7-qatorda esa `max_points` işlatilgan. Ikkala joyda ham bir xil nomdan foydalaning.
:::

### 3. Salomlaşişni tuzating <Difficulty level="2" />

Bu dastur `Salom, Aziza! Keyingi yil siz 21 yoşda bölasiz.` ni çiqarişi kerak. Barça xatolarni toping va tuzating. Uni şu yerda işga tuşira olişingiz uçun `input()` çaqiriği özgarmas qiymatlar bilan almaştirilgan.

```py
name = "aziza"
age = "20"
print(f"Salom, {name.title}! Keyingi yil siz {age + 1} yoşda bölasiz."
```

::: details Yeçim
```python
name = "aziza"
age = "20"
print(f"Salom, {name.title()}! Keyingi yil siz {int(age) + 1} yoşda bölasiz.")
```

1. Oxirida `)` yetişmaydi → `SyntaxError`.
2. `age` satr bölgani uçun `age + 1` → `TypeError`. `int(age)` bilan özgartiring.
3. `()` siz `name.title` `<built-in method title...>` ni çiqaradi. Bu xato xabari çiqmaydigan mantiqiy xato.
:::

### 4. Jimjit xato <Difficulty level="2" />

Bu kod 98.6 °F ni °C ga aylantirişi kerak (javob 37.0), lekin boşqa narsa çiqaryapti. Muammoni topiş uçun tekşiruv `print()` idan foydalaning, keyin uni tuzating.

```python
fahrenheit = 98.6
celsius = fahrenheit - 32 * 5 / 9
print(round(celsius, 1))
```

::: details Yeçim
U `80.8` ni çiqaradi. Qismlarni çiqarsangiz, masalan, `print(f"{32 * 5 / 9=}")`, Python avval `32 * 5 / 9` ni hisoblaganini körasiz, çunki `*` va `/` `-` dan oldin bajariladi.

```python
fahrenheit = 98.6
celsius = (fahrenheit - 32) * 5 / 9
print(round(celsius, 1))
```
:::

### 5. Çekdagi xatolarni tuzating <Difficulty level="3" />

Bu dasturda har xil turdagi **törtta** xato bor. Ularni dastur quyidagini çiqaradigan qilib tuzating:

```text
Mahsulotlar: 3
Oraliq jami: 45000
Çegirma: 4500.0
Tölovga: 40500.0
```

```py
item_count = "3"
unit_price = 15000
discount_rate = 10

subtotal = item_count * unit_price
discount = subtotal * discount_rate
to_pay = subtotal - discont

print("Mahsulotlar:", item_count)
print("Oraliq jami:", subtotal)
print("Çegirma:", discount)
print("Tölovga:" to_pay)
```

::: details Yeçim
```python
item_count = 3
unit_price = 15000
discount_rate = 10

subtotal = item_count * unit_price
discount = subtotal * discount_rate / 100
to_pay = subtotal - discount

print("Mahsulotlar:", item_count)
print("Oraliq jami:", subtotal)
print("Çegirma:", discount)
print("Tölovga:", to_pay)
```

1. Oxirgi `print` da vergul yetişmaydi → `SyntaxError` (heç narsa bajarilmasdan oldin birinçi bölib topiladi).
2. `discont` notöğri yozilgan → `NameError`.
3. `"3" * 15000` öz qatorida xato bermaydi. U 15 000 ta uçlikdan iborat satr yasaydi va dastur faqat keyinroq, ayiriş paytida xato beradi. Şuning uçun `item_count` `3` soni bölişi kerak.
4. `subtotal * 10` stavkani 10% emas, ×10 deb hisoblaydi. 100 ga böling.

3-xato taxminlaringizni tekşiriş nega muhimligini yaxşi körsatadi: notöğri kod heç qanday şikoyatsiz "işlab" turgan edi.
:::

## Xulosa

- Traceback larni **pastdan yuqoriga** öqing: avval xato turi va xabar, keyin fayl va qator.
- **Sintaksis xatolari** butun faylni işga tuşirilişidan oldin töxtatadi. **Bajariş vaqtidagi xatolar** qator bajarilayotganda, oldingi qatorlar allaqaçon bajarilganidan keyin yuz beradi.
- **Mantiqiy xatolar** heç qanday xabarsiz notöğri natija beradi, şuning uçun kutilgan javobni biling.
- Xatolarni tuzatiş jarayoni: xabarni öqing → xatoni takrorlang → qiymatlarni çiqaring (`f"{x=}"`) yoki debugger bilan qadamma-qadam yuring → bir vaqtda bitta narsani özgartiring → muammoni kiçraytiring → uni tuşuntiring.

## Qöşimça manbalar

- [Python Tutorial - Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html)
- [Built-in exceptions](https://docs.python.org/3/library/exceptions.html)
