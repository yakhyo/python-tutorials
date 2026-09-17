---
title: Satr metodlari va kesimlar
description: "Satrlarni kesiş bilan qirqing va metodlar bilan özgartiring: harflar kattaligini özgartiriş, böş joylarni olib taşlaş, almaştiriş, bölaklarga ajratiş, birlaştiriş, qidiriş va tarkibni tekşiriş."
---

# Satr metodlari va kesimlar

![Rasm: Satr metodlari va kesimlar](/images/topics-webp-uzb/string-methods-and-slicing.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Kesiş** yordamida satr qismlarini qanday oliş: `text[start:stop:step]`
- **Metod** nima va uni qanday çaqiriş
- Eng foydali satr metodlari: harflar kattaligi, böş joylarni olib taşlaş, almaştiriş, qidiriş, bölaklarga ajratiş va birlaştiriş
- Nega metodlar eski satrni özgartirmay, **yangi** satr qaytaradi
- Bir neçta metodni ketma-ket qanday ulaş
:::

## Nega bu muhim

Real hayotdagi matn tartibsiz böladi. Foydalanuvçilar ortiqça böş joylar va ğalati katta harflar bilan `"  aziza@EXAMPLE.com "` deb yozadi, fayl nomlaridan kengaytmani ajratib oliş kerak böladi, sanalar esa `"15/09/2026"` körinişida keladi. Kesiş va satr metodlari - matnni tozalaş va kerakli qismlarni ajratib oliş uçun kundalik vositalar.

## Kesiş: satrning bir qismini oliş

![Diagramma: Kesiş: satrning bir qismini oliş](/images/companions-webp-uzb/string-slicing.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Oldingi darsda `text[i]` **bitta** belgini olgan edi. **Kesim** (slice) esa belgilar oraliğini oladi:

```text
text[start:stop]
```

U `start` **dan** boşlanadi va `stop` **gaça**, lekin `stop` ning özini **qöşmasdan** davom etadi.

```text
  | P | y | t | h | o | n |
  0   1   2   3   4   5   6
  |___________|
   word[0:3] → "Pyt"
```

Indekslarni belgilar **orasida** turgan deb tasavvur qiliş foydali. Şunda `word[0:3]` - 0 va 3 örinlar orasidagi hamma narsa.

```python
word = "Python"

print(word[0:3])   # 0, 1, 2 belgilar
print(word[2:5])   # 2, 3, 4 belgilar
```

```text
Pyt
tho
```

### start yoki stop ni tuşirib qoldiriş

- `start` ni yozmasangiz, kesim boşidan boşlanadi.
- `stop` ni yozmasangiz, kesim oxirigaça boradi.

```python
word = "Python"

print(word[:2])    # birinçi 2 ta belgi
print(word[2:])    # 2-indeksdan boşlab hamma narsa
print(word[-3:])   # oxirgi 3 ta belgi
print(word[:])     # butun satr
```

```text
Py
thon
hon
Python
```

Qulay andoza: `text[:n]` - birinçi `n` ta belgi, `text[-n:]` esa oxirgi `n` ta belgi.

### Qadam

Ixtiyoriy uçinçi son - **qadam** (step), yaʼni har safar qança siljiş kerakligi:

```python
digits = "0123456789"

print(digits[::2])    # har 2-belgi
print(digits[1::2])   # 1-indeksdan boşlab har 2-belgi
print(digits[::-1])   # -1 qadam orqaga yuradi: teskari tartib!
```

```text
02468
13579
9876543210
```

`text[::-1]` - Pythonda satrni **teskari aylantirişning** standart usuli.

### Kesimlar heç qaçon IndexError bermaydi

Oxiridan narigi indeks xato beradi, kesiş esa şunçaki oxirida töxtaydi:

```python
word = "non"
print(word[1:100])
print(word[5:10])
```

```text
on

```

(Ikkinçi qator böş satr çiqaradi.)

## Metod nima?

**Metod** (method) - qiymatga tegişli funksiya. Uni qiymatdan keyin **nuqta** qöyib çaqirasiz:

```text
value.method_name(arguments)
```

```python
name = "aziza"
print(name.upper())
print(name.capitalize())
```

```text
AZIZA
Aziza
```

Allaqaçon biladigan funksiyalaringiz bilan soliştiring: `len(name)` - satrni argument sifatida oladigan oddiy funksiya, `name.upper()` esa satrning **özida** çaqiriladigan metod.

## Metodlar yangi satr qaytaradi

Satrlar özgarmas (*Satrlar* darsiga qarang), şuning uçun satr metodlari aslini **heç qaçon özgartirmaydi**. Ular yangi satr qaytaradi:

```python
name = "aziza"
name.upper()           # "AZIZA" ni yaratadi... va taşlab yuboradi
print(name)            # hali ham "aziza"

name = name.upper()    # natijani saqlaş uçun uni özgaruvçiga bering
print(name)
```

```text
aziza
AZIZA
```

Bu yangi boşlovçilarning eng köp uçraydigan xatolaridan biri, şuning uçun eslab qoling: **natijani saqlab qolmoqçi bölsangiz, uni özgaruvçiga bering.**

## Harflar kattaligini özgartiriş

| Metod | `"salom DUNYO"` uçun natija |
|---|---|
| `.upper()` | `"SALOM DUNYO"` |
| `.lower()` | `"salom dunyo"` |
| `.title()` | `"Salom Dunyo"` |
| `.capitalize()` | `"Salom dunyo"` |
| `.swapcase()` | `"SALOM dunyo"` |

`.lower()` ayniqsa matnni katta-kiçik harflarga qaramasdan **soliştiriş** uçun foydali:

```python
answer = "HA"
print(answer.lower() == "ha")
```

```text
True
```

(`==` ikki qiymat tengligini tekşiradi. Uni keyingi bölimda töliq örganasiz.)

::: warning `.title()` sözlarni "tuşunmaydi"
`.title()` harf bölmagan har qanday belgidan, jumladan apostrof yoki özbekça `ʻ` dan keyingi har bir harfni katta qiladi:

```python
print("don't stop".title())
print("oʻzbekiston".title())
```

```text
Don'T Stop
OʻZbekiston
```

Bitta ism yoki gap uçun köpinça `.capitalize()` xavfsizroq.
:::

## Ortiqça böş joylarni olib taşlaş: strip

Foydalanuvçi kiritgan matn atrofida köpinça böş joylar yoki yangi qator belgilari böladi. `.strip()` böş joy belgilarini **ikkala uçidan** olib taşlaydi, lekin örtasidagilarini qoldiradi:

```python
raw = "   Toşkent  \n"

print("[" + raw.strip() + "]")
print("[" + raw.lstrip() + "]")   # faqat çap tomondan
print("[" + raw.rstrip() + "]")   # faqat öng tomondan
```

```text
[Toşkent]
[Toşkent  
]
[   Toşkent]
```

Maʼlum belgilarni ham olib taşlaş mumkin: `"***çegirma***".strip("*")` `"çegirma"` ni beradi.

### Boşlanğiç yoki oxirgi bölakni olib taşlaş

`.strip(".txt")` `".txt"` matnini olib taşla**maydi**. U ikkala uçdan `.`, `t` va `x` belgilaridan istalganini olib taşlaydi, şuning uçun `"test.txt".strip(".txt")` `"es"` beradi. Boşidan yoki oxiridan aniq bir bölakni olib taşlaş uçun `.removeprefix()` yoki `.removesuffix()` dan foydalaning. Bölak bölmasa, ular satrni özgartirmaydi:

```python
photo = "IMG_2026.jpg"

print(photo.removeprefix("IMG_"))
print(photo.removesuffix(".jpg"))
print(photo.removesuffix(".png"))
```

```text
2026.jpg
IMG_2026
IMG_2026.jpg
```

## Matnni almaştiriş

`.replace(old, new)` **har bir** uçraşni almaştiradi:

```python
date = "15/09/2026"
print(date.replace("/", "-"))

sentence = "Men çoyni yaxşi köraman. Çoy juda zör."
print(sentence.replace("çoy", "qahva"))   # katta-kiçik harfni farqlaydi!
```

```text
15-09-2026
Men qahvani yaxşi köraman. Çoy juda zör.
```

## Qidiriş

```python
text = "olma pirog va olma şarbati"

print(text.count("olma"))          # neça marta uçraydi
print(text.find("pirog"))          # birinçi mos kelişning indeksi
print(text.find("nok"))            # -1 topilmadi degani
print(text.startswith("olma"))
print(text.endswith("şarbati"))
```

```text
2
5
-1
True
True
```

- Matn topilmasa, `.find()` `-1` qaytaradi.
- `.index()` ham xuddi şu işni bajaradi, lekin matn topilmasa `ValueError` beradi.
- Agar faqat ha yoki yöq javobi kerak bölsa, `"pirog" in text` soddaroq.

## Bölaklarga ajratiş va birlaştiriş

`.split()` satrni bölaklardan iborat **röyxatga** (list) ajratadi. Argumentsiz çaqirilsa, istalgan böş joy belgilari böyiça ajratadi:

```python
sentence = "Python haqiqatan  juda qiziq"
words = sentence.split()
print(words)
print(len(words))
```

```text
['Python', 'haqiqatan', 'juda', 'qiziq']
4
```

Boşqa belgi böyiça ajratiş uçun unga ajratgiç bering:

```python
date = "15/09/2026"
parts = date.split("/")
print(parts)
print(parts[2])   # yil
```

```text
['15', '09', '2026']
2026
```

Kvadrat qavsli natija - **röyxat**. Röyxatlarni **Kolleksiyalar** bölimida örganasiz. Hozirça undan elementlarni xuddi satrdagi belgilar kabi indeks bilan oliş mumkinligini biling.

`.join()` buning teskarisini bajaradi: u bölaklarni bir-biriga yopiştiradi va ular **orasiga** özi çaqirilgan satrni qöyadi:

```python
parts = ["15", "09", "2026"]
print("-".join(parts))
print(" | ".join(["çoy", "qahva", "şarbat"]))
```

```text
15-09-2026
çoy | qahva | şarbat
```

Şunça bölişdan keyin töxtaş uçun ikkinçi argument `maxsplit` ni qöşing. Qolgani bitta bölak bölib qoladi:

```python
line = "Toşkent: poytaxt: 3 million"
print(line.split(":", 1))
```

```text
['Toşkent', ' poytaxt: 3 million']
```

Avval ajratib, keyin birlaştiriş - **böş joylarni tartibga keltirişning** qulay usuli:

```python
messy = "juda    köp     böş joy"
print(" ".join(messy.split()))
```

```text
juda köp böş joy
```

## Içida nima borligini tekşiriş

Bu metodlar `True` yoki `False` qaytaradi:

| Metod | Qaçon True… | `"2026"` | `"abc"` | `"abc1"` |
|---|---|---|---|---|
| `.isdigit()` | barça belgilar raqam bölsa | `True` | `False` | `False` |
| `.isalpha()` | barça belgilar harf bölsa | `False` | `True` | `False` |
| `.isalnum()` | barça belgilar harf yoki raqam bölsa | `True` | `True` | `True` |
| `.isupper()` / `.islower()` | barça harflar katta/kiçik bölsa | `False` | `False` / `True` | `False` / `True` |
| `.isspace()` | barça belgilar böş joy bölsa | `False` | `False` | `False` |

Ularning hammasi böş satr `""` uçun `False` qaytaradi.

`.isdigit()` töliq "bu sonmi?" tekşiruvi emas. U `"-5"` va `"3.5"` uçun `False`, çunki `-` va `.` raqam emas. Şu bilan birga u `int()` rad etadigan baʼzi belgilar, masalan `"²"` uçun `True`.

## Metodlarni ketma-ket ulaş

Har bir metod satr qaytargani uçun natijaning özida yana boşqa metodni çaqiriş mumkin, birin-ketin:

```python
raw_email = "   Aziza.Karimova@EXAMPLE.com  "

email = raw_email.strip().lower()
print(email)

username = email.split("@")[0]
print(username.replace(".", " ").title())
```

```text
aziza.karimova@example.com
Aziza Karimova
```

Zanjirlarni çapdan öngga öqing: böş joylarni olib taşlaş → kiçik harflarga ötkaziş → `@` böyiça ajratiş → birinçi qismni oliş.

## Özingiz sinab köring

Tartibsiz kiritişni tozalang va çiroyli salomlaşiş çiqaring. Keyin `raw_name` ni yanada tartibsizroq qilib köring.

<ClientOnly><PythonPlayground :code='"raw_name = \"   bEKZOD   tursunov \"\n\nclean = \" \".join(raw_name.split()).title()\ninitials = clean[0] + clean[clean.find(\" \") + 1]\n\nprint(\"Salom,\", clean)\nprint(\"Boş harflar:\", initials)"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Natijani saqlamaslik

```python
city = "toşkent"
city.capitalize()
print(city)   # hali ham "toşkent"
```

**Tuzatiş:** `city = city.capitalize()`.

### 2. Qavslarni unutiş

```python
name = "aziza"
print(name.upper)
```

```text
<built-in method upper of str object at 0x...>
```

`()` siz metodning natijasini emas, metodning özini olasiz. **Tuzatiş:** `name.upper()`.

### 3. Kesişda bittaga adaşiş

```python
code = "UZ-2026"
print(code[0:1])   # "UZ" emas, "U"
```

stop indeksi **qöşilmaydi**. **Tuzatiş:** `code[0:2]` yoki şunçaki `code[:2]`.

### 4. Mavjud bölmagan matnga `.index()`

```py
print("salom".index("z"))
```

```text
ValueError: substring not found
```

Xabar "satr bölagi topilmadi" deydi. **Tuzatiş:** `-1` qaytaradigan `.find()` dan foydalaning yoki avval `in` bilan tekşiring.

## Maşqlar

### 1. Fayl kengaytmasi <Difficulty level="1" />

`filename = "hisobot_yakuniy.pdf"` uçun `.split()` yordamida `pdf` kengaytmasini çiqaring.

::: details Yeçim
```python
filename = "hisobot_yakuniy.pdf"
print(filename.split(".")[-1])
```

`[-1]` oxirgi bölakni oladi, şuning uçun `"archive.tar.gz"` kabi nomlar uçun ham işlaydi (`gz` ni beradi). `"README"` kabi nuqtasiz nomda faqat bitta bölak bor, şuning uçun butun nomning özi qaytadi.
:::

### 2. Tartibli ism <Difficulty level="1" />

`"   dILNOZA   "` ni `"Dilnoza"` ga aylantiring.

::: details Yeçim
```python
raw = "   dILNOZA   "
print(raw.strip().capitalize())
```
:::

### 3. Telefon raqami formati <Difficulty level="2" />

`phone = "998901234567"` berilgan. Kesiş yordamida `+998 (90) 123-45-67` ni çiqaring.

::: details Yeçim
```python
phone = "998901234567"

formatted = ("+" + phone[:3] + " (" + phone[3:5] + ") "
             + phone[5:8] + "-" + phone[8:10] + "-" + phone[10:])
print(formatted)
```

Ifodani qavs içiga olsangiz, uni keyingi qatorda davom ettiriş mumkin böladi.
:::

### 4. Söz statistikasi <Difficulty level="2" />

`text = "bu kitob va bu daftar juda yaxşi"` uçun quyidagilarni çiqaring:

1. sözlar soni,
2. `"bu"` matn sifatida neça marta uçraşi,
3. har bir sözi katta harf bilan boşlangan gap,
4. teskari aylantirilgan gap.

::: details Yeçim
```python
text = "bu kitob va bu daftar juda yaxşi"

print(len(text.split()))
print(text.count("bu"))
print(text.title())
print(text[::-1])
```

```text
7
2
Bu Kitob Va Bu Daftar Juda Yaxşi
işxay aduj ratfad ub av botik ub
```
:::

### 5. Elektron manzilni yaşiriş <Difficulty level="3" />

Elektron manzildagi foydalanuvçi nomining köp qismini yaşiring: foydalanuvçi nomining birinçi **2** ta belgisini qoldiring, qolganini `*` bilan almaştiring (uzunlik bir xil qolsin) va domenni saqlang. `"aziza.karimova@example.com"` uçun `az************@example.com` ni çiqaring.

::: details Yeçim
```python
email = "aziza.karimova@example.com"

at = email.find("@")
username = email[:at]
domain = email[at:]          # "@" ham qöşilgan

masked = username[:2] + "*" * (len(username) - 2) + domain
print(masked)
```

Ikki qismni ajratiş uçun `email.split("@")` ham işlaydi.
:::

## Xulosa

- `text[start:stop:step]` satrni kesadi. `stop` qöşilmaydi, yozilmagan qiymatlar "boşidan" yoki "oxirigaça" degani, `[::-1]` esa teskari aylantiradi.
- Kesimlar heç qaçon `IndexError` bermaydi.
- Metodlar nuqta bilan çaqiriladi: `text.method()`. Satr metodlari **yangi** satr qaytaradi, şuning uçun natijani saqlaş uçun uni özgaruvçiga bering.
- Harflar kattaligi: `upper`, `lower`, `title`, `capitalize`. Tozalaş: `strip`, `replace`, `removeprefix`, `removesuffix`.
- Qidiriş: `count`, `find` (topilmasa −1), `index` (topilmasa xato), `startswith`, `endswith`.
- `split(sep, maxsplit)` satrni bölaklar röyxatiga aylantiradi, `"sep".join(pieces)` esa ularni qayta yopiştiradi.

## Qöşimça manbalar

- [String methods](https://docs.python.org/3/library/stdtypes.html#string-methods)
- [Python Tutorial - Text (indexing and slicing)](https://docs.python.org/3/tutorial/introduction.html#text)
