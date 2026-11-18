---
title: Izohlar va kod uslubi
description: "Foydali izohlar yozing va Python uslub qöllanmasiga (PEP 8) amal qiling: nomlaş, çekiniş, oraliqlar va qator uzunligi."
---

# Izohlar va kod uslubi

![Rasm: Izohlar va kod uslubi](/images/topics-webp-uzb/comments-and-style.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `#` bilan izohlarni qanday yoziş va Python ular bilan nima qiladi
- Izohni nima **foydali** qiladi va nima uni ortiqça şovqinga aylantiradi
- Sinab köriş paytida kodni qanday "izohga aylantiriş"
- Pythonning rasmiy uslub qöllanmasi - **PEP 8** asoslari
- Nega çekiniş Python grammatikasining bir qismi, şunçaki bezak emas
:::

## Nega bu muhim

Kod yozilganidan köra ança köp öqiladi: jamoadoşlaringiz, internetda savollaringizga javob beradigan odamlar va *uç haftadan keyingi özingiz* tomonidan. Python dizaynida öqiliş osonligi birinçi örinda turadi (Zen of Python dagi *"Readability counts."* ni eslang). Izohlar va bir xil uslub - öz kodingizni öqiş oson holda saqlaş usuli.

## Izoh yoziş

**Izoh** (comment) `#` bilan boşlanadi. Python `#` dan qator oxirigaça bölgan hamma narsani eʼtiborsiz qoldiradi:

```python
# 10% çegirmadan keyingi narxni hisoblaymiz
price = 50
discounted = price * 0.9
print(discounted)  # 45.0
```

- **Töliq qatorli izoh** alohida qatorda, u tuşuntiradigan kodning ustida turadi.
- **Qator içidagi izoh** kod qatorining oxirida turadi. `#` dan oldin **ikkita böş joy**, undan keyin bitta böş joy qöying.

Satr içidagi `#` izoh emas, şunçaki belgi:

```python
print("Izohlar uçun # dan foydalaning")  # izoh mana şu qism
```

Pythonda bir neçta qatorli izoh uçun maxsus sintaksis yöq. Bir neçta qator uçun har birini `#` bilan boşlang:

```python
# Bu dastur çek çiqaradi.
# Hozirça narxlar özgarmas; keyingi darslarda
# ular fayldan öqiladi.
print("Çek")
```

## Yaxşi izohlar *nega* ekanini tuşuntiradi

Yangi boşlovçilar köpinça kodni takrorlaydigan izohlar yozadi. Ular foyda bermaydi, çunki kodning özi *nima* bölayotganini aytib turibdi.

```python
# Yomon: kodni takrorlaydigan şovqin
count = 0  # count ni 0 ga teng qilamiz
count = count + 1  # count ga 1 qöşamiz
```

Foydali izohlar kod **nega** aynan şunday ekanini tuşuntiradi yoki kod körsata olmaydigan **kontekst** beradi:

```python
# Yaxşi: nega ekanini tuşuntiradi
seconds = 90
timeout = seconds + 5  # serverlar bir neçta soniya keçikişi mumkin; zaxira qoldiramiz

# Yaxşi: kod körsata olmaydigan kontekst beradi
tax_rate = 0.12  # Özbekiston QQS, 12% (har yili tekşiring)
```

Bir neçta amaliy qoida:

1. **Avval tuşunarli kod.** Agar çalkaş nomni tuşuntiriş uçun izoh kerak bölsa, uning örniga nomni özgartiring: izohli `d = 7` dan `days_until_deadline = 7` yaxşiroq.
2. **Qarorlar, ogohlantirişlar va ölçov birliklarini tuşuntiring.** Masalan: *"santimetrda"*, *"saqlaşdan oldin bajarilişi kerak"*, *"bu röyxat saralangan"*.
3. **Izohlarni dolzarb holda saqlang.** Notöğri izoh izohsizlikdan ham yomonroq.
4. Töliq qatorli izohlar uçun boş harf bilan boşlanadigan **töliq gaplar yozing**.

## Kodni izohga aylantiriş

Qator oldiga `#` qöysangiz, u öçirilmasdan **işdan çiqariladi**. Bu sinab köriş uçun qulay:

```python
print("1-qadam")
# print("2-qadam — vaqtinça öçirilgan")
print("3-qadam")
```

```text
1-qadam
3-qadam
```

Aksariyat muharrirlarda **Ctrl + /** (macOS: **⌘ + /**) tanlangan qatorlarni izohga aylantiradi yoki izohdan çiqaradi.

Tayyor dasturlarda izohga aylantirilgan katta kod bloklarini qoldirmang. Ular faylni çigallaştiradi va ular hali kerakmi-yöqmi, tuşunarsiz böladi.

## Docstring larga qisqaça nazar

Baʼzan fayl boşida yoki funksiya içida uçtalik qöştirnoqdagi matnni körasiz:

```python
"""Çek çiqaruvçi: oddiy dökon çekini çiqaradi."""

print("Çek")
```

Bu **docstring** - modul, funksiya yoki klassni hujjatlaştiradigan satr. `#` izohlardan farqli ravişda, Python docstring larni saqlab qoladi, şuning uçun vositalar (va `help()`) ularni körsata oladi. Ularni **Funksiyalar** bölimida töğri yozişni örganasiz.

## PEP 8: Python uslub qöllanmasi

**PEP 8** - Python kodi uçun rasmiy uslub qöllanmasi. (*PEP* - Python Enhancement Proposal, yaʼni Python uçun dizayn hujjati.) Deyarli barça Python loyihalari unga amal qiladi, şuning uçun unga amal qilsangiz, kodingiz har qanday Python dasturçisiga taniş körinadi.

Uni töliq yodlaş şart emas. Hozir eng muhim bölgan qoidalar mana bular.

### Çekiniş: 4 ta böş joy

Python kodni bloklarga guruhlaş uçun **çekiniş** (indentation) dan, yaʼni qator boşidagi böş joylardan foydalanadi. **Har bir daraja uçun 4 ta böş joy** işlating, heç qaçon tabulyatsiya emas:

```python
temperature = 31

if temperature > 30:
    print("Havo issiq.")
    print("Suv içing.")

print("Kuningiz yaxşi ötsin.")
```

Çekinişli ikki qator `if` ga tegişli. Oxirgi qator esa unga tegişli emas. `if` ni **Şart operatorlari** bölimida töliq örganasiz. Hozirça şunga eʼtibor bering: Pythonda çekiniş şunçaki uslub emas, **u kodning maʼnosini özgartiradi**. Notöğri çekiniş xatolarga olib keladi (pastdagi *Köp uçraydigan xatolar* ga qarang).

Kod muharrirlari `.py` faylda **Tab** ni bosganingizda 4 ta böş joy qöyadi.

### Nomlar: `snake_case`

| Nom turi | Uslub | Misollar |
|---|---|---|
| Özgaruvçilar va funksiyalar | `lower_case_with_underscores` | `total_price`, `user_name`, `print_receipt` |
| Konstantalar (heç özgarmaydigan qiymatlar) | `UPPER_CASE` | `MAX_USERS`, `TAX_RATE` |
| Klasslar (darslikning keyingi qismida) | `CapitalizedWords` | `ShoppingCart`, `Student` |

Qiymat nimani **anglatişini** aytadigan nomlarni tanlang:

```python
# Yomon: öqiş qiyin
x = 3
y = 12.5
z = x * y

# Yaxşi: izohsiz ham tuşunarli
quantity = 3
unit_price = 12.5
total = quantity * unit_price
print(total)
```

### Böş joylar

- `=` va aksariyat operatorlar atrofiga bittadan böş joy qöying: `total = price * 2`.
- Verguldan keyin böş joy qöying, undan oldin qöymang: `print("a", "b")`.
- Qavslarning içki tomoniga böş joy qöymang: `print("salom")`, `print( "salom" )` emas.
- Kalit söz argumentlarida `=` atrofiga böş joy qöymang: `print("a", "b", sep="-")`.

```py
# Yomon: siqilgan va bir xil emas
total=price*2+tax
print( "Jami:" ,total )

# Yaxşi: PEP 8 ga mos
total = price * 2 + tax
print("Jami:", total)
```

### Qator uzunligi va böş qatorlar

- Qatorlarni taxminan **79 ta belgi** atrofida saqlang. Köp jamoalar 88 yoki 99 tagaça ruxsat beradi. Uzun qatorlarni yonma-yon öqiş qiyin.
- Dasturning mantiqiy qismlarini **böş qatorlar** bilan ajrating, xuddi matndagi xatboşilar kabi.

```python
# Kiritiş maʼlumotlari
width = 4
height = 3

# Hisoblaş
area = width * height

# Natija
print("Yuza:", area)
```

::: info Buni vositalar siz uçun bajaradi
Keyinroq böş joylarni avtomatik tuzatadigan **formatter** va uslub muammolarini körsatadigan **linter** örnatişingiz mumkin. Hozirça esa bu bir neçta qoidaga qölda amal qiliş yaxşi odatlarni şakllantiradi.
:::

## Özingiz sinab köring

Bu dastur işlaydi, lekin uni öqiş qiyin. Özgaruvçilar nomini özgartiring, böş joylarni tuzating va **bitta** foydali izoh qöşing. Dastur avvalgidek natija çiqarayotganiga işonç hosil qiling.

<ClientOnly><PythonPlayground :code='"a=250000\nb=0.15   #b\nc=a-a*b\nprint( \"Çegirmadan keyingi narx:\" ,c )"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Kutilmagan çekiniş

```py
print("boşlanişi")
    print("sababsiz çekiniş qilingan")
```

```text
IndentationError: unexpected indent
```

Faqat blokka tegişli kodni, masalan, `if` tanasini çekiniş bilan yozing. **Tuzatiş:** ortiqça böş joylarni olib taşlang.

### 2. Çekiniş yetişmasligi

```py
if 5 > 3:
print("beş kattaroq")
```

```text
IndentationError: expected an indented block after 'if' statement on line 1
```

**Tuzatiş:** `if` tanasini 4 ta böş joy bilan çekiniş qilib yozing.

### 3. Tabulyatsiya va böş joylarni aralaştiriş

```text
TabError: inconsistent use of tabs and spaces in indentation
```

Qatorlar tekis *körinadi*, lekin baʼzilarida tabulyatsiya belgisi, baʼzilarida böş joylar işlatilgan. **Tuzatiş:** muharriringizni böş joy qöyadigan qilib sozlang (VS Code Python uçun buni standart holatda qiladi). VS Code da Command Palette dan **Convert Indentation to Spaces** ni işga tuşiring.

### 4. Yolğon gapiradigan izohlar

```python
discount = 0.2  # 10% çegirma
```

Kod 20% deydi, izoh esa 10% deydi. Qaysi biri töğri? **Tuzatiş:** kodni özgartirganda izohlarni ham yangilang yoki kod özi aniq körsatib turgan izohlarni olib taşlang.

## Maşqlar

### 1. Tartibga keltiring <Difficulty level="1" />

Bu kodni PEP 8 dagi böş joy qoidalariga moslab qayta yozing. Çiqaradigan natijasini özgartirmang.

```python
name="Aziza"
age=20
print( "Ism:",name ,"Yoş:" ,age )
```

::: details Yeçim
```python
name = "Aziza"
age = 20
print("Ism:", name, "Yoş:", age)
```
:::

### 2. Yaxşiroq nomlar <Difficulty level="1" />

Bu özgaruvçilarga maʼnoli `snake_case` nomlar bering:

```python
n = "Toşkent"
p = 3100000
FlightPriceSom = 1250000
```

::: details Yeçim
```python
city = "Toşkent"
population = 3100000
flight_price_som = 1250000
```

`FlightPriceSom` klass uslubida (`CapitalizedWords`) yozilgan. Özgaruvçilar esa `snake_case` da yoziladi.
:::

### 3. Foydalimi yoki şovqinmi? <Difficulty level="2" />

Har bir izoh **foydali** yoki **şovqin** ekanini aniqlang va nega ekanini tuşuntiring.

```python
speed = 120  # tezlik
distance = 300  # kilometr
hours = distance / speed  # masofani tezlikka bölamiz
hours = hours + 0.5  # 30 daqiqalik dam oliş töxtaşini qöşamiz
```

::: details Yeçim
1. `# tezlik`: **şovqin**. Nomning özi buni aytib turibdi. Foydali variant ölçov birligini berardi: `# km/soat`.
2. `# kilometr`: **foydali**. U kod körsata olmaydigan ölçov birligini beradi.
3. `# masofani tezlikka bölamiz`: **şovqin**. U kodni takrorlaydi.
4. `# 30 daqiqalik dam oliş töxtaşini qöşamiz`: **foydali**. U 0.5 *nega* qöşilayotganini tuşuntiradi.
:::

### 4. Xatoni izohlar yordamida toping <Difficulty level="2" />

Bu dastur notöğri jami çiqaryapti. Muammoga qaysi qator sabab bölayotganini topiş uçun qatorlarni birma-bir izohga aylantiring, keyin uni tuzating.

```python
apples = 4
pears = 3
apples = 40
total_fruit = apples + pears
print("Jami mevalar:", total_fruit)
```

Kutilgan natija: `Jami mevalar: 7`.

::: details Yeçim
`apples = 40` ni izohga aylantirsangiz, dastur `Jami mevalar: 7` ni çiqaradi. Bu qator töğri qiymatning ustidan yozib yuborgan, şuning uçun uni öçiring:

```python
apples = 4
pears = 3
total_fruit = apples + pears
print("Jami mevalar:", total_fruit)
```

Qatorlarni şunday vaqtinça öçirib turiş - oddiy, lekin samarali xatolarni tuzatiş usuli.
:::

### 5. Uslubni tekşiriş <Difficulty level="3" />

Bu dasturni şu darsdagi hamma narsaga moslab qayta yozing: maʼnoli nomlar, PEP 8 böş joylari, bölimlar orasida böş qatorlar va **nega** ekanini tuşuntiradigan bir-ikkita izoh. U avvalgidek natija çiqarişi kerak.

```python
W=5.5
H=3
r=W*H
pc=r*85000 #
print ("Xona narxi:",pc)
```

::: details Yeçim
```python
# Xona ölçamlari metrda
width = 5.5
height = 3

area = width * height

# Pol qoplamasining bir kvadrat metr narxi, sömda (yetkazib beruvçi taklifi)
PRICE_PER_SQUARE_METER = 85000
cost = area * PRICE_PER_SQUARE_METER

print("Xona narxi:", cost)
```

- Nomlar har bir qiymat nimani anglatişini aytadi, özgarmas narx esa `UPPER_CASE` dagi konstanta.
- Izohlar kod körsata olmaydigan ölçov birliklarini va narx qayerdan olinganini aytadi.
- Böş `#` izohi olib taşlandi, `=`, `*` atrofidagi va verguldan keyingi böş joylar tuzatildi.
:::

## Xulosa

- `#` izohni boşlaydi va Python qatorning qolgan qismini eʼtiborsiz qoldiradi.
- Yaxşi izohlar **nega** ekanini tuşuntiradi, ölçov birliklarini yoki kontekstni beradi. Kodni qayta aytmang.
- Qatorlarni izohga aylantiriş - sinab köriş va xatolarni tuzatişning tez usuli. Keyin tozalab qöying.
- **PEP 8** - Python uslub qöllanmasi: 4 ta böş joylik çekiniş, `snake_case` nomlar, `=` va operatorlar atrofida böş joylar, taxminan 79 belgilik qatorlar.
- Çekiniş **Python grammatikasining bir qismi**. Notöğri çekiniş `IndentationError` yoki `TabError` ga olib keladi.

## Qöşimça manbalar

- [PEP 8 - Style Guide for Python Code](https://peps.python.org/pep-0008/)
- [Python Tutorial - Coding style](https://docs.python.org/3/tutorial/controlflow.html#intermezzo-coding-style)
- [PEP 257 - Docstring conventions](https://peps.python.org/pep-0257/)
