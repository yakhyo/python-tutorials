---
title: Satrlar
description: "Pythonda matn bilan işlaş: satrlarni birlaştiriş va takrorlaş, uzunlik, alohida belgilarni indeks bilan oliş, özgarmaslik, in operatori hamda Unicode va baytlar bilan ilk tanişuv."
---

# Satrlar

![Rasm: Satrlar](/images/topics-webp-uzb/strings-basics.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Satrlarni `+` bilan birlaştiriş, `*` bilan takrorlaş va `len()` bilan belgilarni sanaş
- Python belgilarni Unicode sifatida qanday saqlaydi va `bytes` nima
- **Indekslaş** yordamida, jumladan manfiy indekslar bilan, bitta belgini oliş
- Nega satrlarni joyida özgartirib bölmaydi (özgarmaslik)
- Matn içida biror narsa bor-yöqligini `in` bilan tekşiriş
:::

## Nega bu muhim

Ismlar, xabarlar, elektron xatlar, fayl nomlari, parollar, veb-sahifalar: real hayotdagi maʼlumotlarning juda katta qismi matndan iborat. Pythonda matn **satr** (string, `str`) sifatida, yaʼni belgilar ketma-ketligi sifatida saqlanadi. Satrlarni qanday yozişni *Salom, dunyo!* darsidan bilasiz. Bu dars ularni qanday qismlarga ajratiş va qayta yiğişni körsatadi.

## Satrlarni birlaştiriş: `+`

`+` satrlarni bir-birining ketidan **ulaydi** (birlaştiradi):

```python
first_name = "Aziza"
last_name = "Karimova"

full_name = first_name + " " + last_name
print(full_name)
```

```text
Aziza Karimova
```

`+` özi **böş joy qöşmaydi**, şuning uçun uni yuqoridagi `" "` kabi özingiz qöşişingiz kerak.

## Satrlarni takrorlaş: `*`

Satrni butun songa köpaytirsangiz, u takrorlanadi:

```python
print("ha" * 3)
print("-" * 20)
```

```text
hahaha
--------------------
```

Bu matnli natijada çiziqlar va ramkalar çiziş uçun tez usul.

## Uzunlik: `len()`

Içki `len()` funksiyasi satrda neçta belgi borligini qaytaradi. Böş joylar va tiniş belgilari ham sanaladi:

```python
password = "çoy2go!"
print(len(password))
print(len("Salom, dunyo!"))
print(len(""))
```

```text
7
13
0
```

`""` - **böş satr**, yaʼni birorta ham belgisi yöq satr.

## Indekslaş: bitta belgini oliş

![Diagramma: Indekslaş: bitta belgini oliş](/images/companions-webp-uzb/string-indexing.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Satrdagi har bir belgining **indeks** (index) deb ataladigan örin raqami bor. Indekslar **0 dan boşlanadi**:

```text
 P   y   t   h   o   n
 0   1   2   3   4   5     ← boşidan hisoblangan indeks
-6  -5  -4  -3  -2  -1     ← oxiridan hisoblangan indeks
```

Belgini oliş uçun indeksni kvadrat qavs içiga yozing:

```python
word = "Python"

print(word[0])   # birinçi belgi
print(word[1])
print(word[5])   # oxirgi belgi
```

```text
P
y
n
```

### Manfiy indekslar oxiridan sanaydi

`-1` - oxirgi belgi, `-2` - oxiridan ikkinçi belgi va hokazo. Bu uzunlikni bilmaganingizda qulay:

```python
word = "Python"
print(word[-1])
print(word[-2])
```

```text
n
o
```

Oxirgi indeks doim `len(word) - 1` ga teng, çunki sanaş 0 dan boşlanadi:

```python
word = "Python"
print(word[len(word) - 1])   # word[-1] bilan bir xil
```

::: info Nega 0 dan boşlanadi?
Indeksni "boşidan neçta belgini ötkazib yuboriş kerak" deb tasavvur qiling. Birinçi belgini oliş uçun 0 ta belgini ötkazib yuborasiz. Aksariyat dasturlaş tillari şunday sanaydi va siz bunga tez könikib qolasiz.
:::

Keyingi darsda bir vaqtning özida bir neçta belgini oladigan **kesiş** (slicing) ni örganasiz (masalan, `word[0:3]` → `"Pyt"`).

## Satrlarni joyida özgartirib bölmaydi

Satrlar **özgarmas** (immutable): satr yaratilgandan keyin uning belgilarini özgartirib bölmaydi.

```py
word = "salom"
word[0] = "S"
```

```text
TypeError: 'str' object does not support item assignment
```

Xabar "satr obyekti elementga qiymat berişni qöllab-quvvatlamaydi" deydi. Uning örniga **yangi** satr yaratib, uni özgaruvçiga berasiz:

```python
word = "salom"
word = "S" + word[1:]   # "S" + "alom"
print(word)
```

```text
Salom
```

(`word[1:]` "1-indeksdan oxirigaça" degani. Kesiş keyingi darsda tuşuntiriladi.)

Özgarmaslik çeklovdek tuyuladi, lekin u satrlarni bemalol ulaşiş imkonini beradi: agar ikki özgaruvçi bitta satrni körsatsa, ularning heç biri uni boşqasi uçun özgartira olmaydi.

## Tarkibni tekşiriş: `in`

`in` bir satr boşqasining içida bor-yöqligini tekşiradi. Natija `True` yoki `False` böladi:

```python
email = "aziza@example.com"

print("@" in email)
print("gmail" in email)
print("gmail" not in email)
```

```text
True
False
True
```

Tekşiruv **katta-kiçik harfni farqlaydi**: `"Py" in "python"` `False` ga teng. `True`/`False` natijalardan **Şart operatorlari** bölimida `if` buyruqlari bilan foydalanasiz.

## Satrlar va sonlar özidan özi aralaşmaydi

`+` sonlar uçun *qöşiş*, satrlar uçun esa *birlaştiriş* degani. Ularni aralaştirsangiz, Python nima istaganingizni taxmin qilişdan boş tortadi:

```py
age = 20
print("Yoş: " + age)
```

```text
TypeError: can only concatenate str (not "int") to str
```

Xabar "str ga faqat str ni (int ni emas) ulaş mumkin" deydi. Sizda uçta yaxşi variant bor:

```python
age = 20

print("Yoş:", age)          # 1. print() ga alohida argumentlar
print("Yoş: " + str(age))   # 2. sonni str() bilan özgartiriş
print(f"Yoş: {age}")        # 3. f-satr (F-satrlar darsiga qarang)
```

Uçalasi ham `Yoş: 20` ni çiqaradi. Odatda f-satr eng tuşunarlisi va uni tez orada örganasiz.

## Matn, Unicode va baytlar

Kompyuter faqat sonlarni saqlaydi, şuning uçun har bir belgining ham soni bor. Python **Unicode** dan foydalanadi - bu deyarli barça yozuv tizimlaridagi (lotin, kirill, arab, emoji va boşqalar) har bir belgiga **kod nuqtasi (code point)** deb ataladigan son beradigan standart. `ord()` belgining kod nuqtasini beradi, `chr()` esa teskarisini qiladi:

```python
print(ord("A"), ord("ş"))
print(chr(65), chr(351))
```

```text
65 351
A ş
```

`len()` sizga harfdek körinadigan narsani emas, kod nuqtalarini sanaydi. Özbek lotin yozuvida `oʻ` `o` harfi va alohida **modifikator harf** `ʻ` bilan yoziladi, şuning uçun u ikkita belgi hisoblanadi:

```python
print(len("oʻ"))
print(len("Oʻzbekiston"))
print(ord("ʻ"), ord("'"))
```

```text
2
11
699 39
```

Oxirgi qator `ʻ` (kod nuqtasi 699) va klaviaturadagi apostrof `'` (39) öxşaş körinsa ham **boşqa-boşqa belgilar** ekanini körsatadi. Bu matnni qidiriş yoki taqqoslaşda muhim (*Köp uçraydigan xatolar* ga qarang).

### `str` va `bytes`

`str` belgilarni saqlaydi. Matn faylga saqlanganda yoki internet orqali yuborilganda u **baytlar (bytes)** ga - 0 dan 255 gaça bölgan oddiy sonlarga aylanişi kerak. Belgilarni baytlarga aylantiriş qoidalari **kodlaş (encoding)** deb ataladi va işlatiş kerak bölgani UTF-8. `.encode()` satrni `bytes` ga, `.decode()` esa qaytadan satrga aylantiradi:

```python
country = "Oʻzbekiston"
data = country.encode("utf-8")

print(data)
print(len(data))
print(data.decode("utf-8"))
```

```text
b'O\xca\xbbzbekiston'
12
Oʻzbekiston
```

`bytes` qiymati qöştirnoq oldida `b` bilan körsatiladi. Oddiy lotin harflari bittadan bayt oladi, `ʻ` esa ikkita (`\xca\xbb`), şuning uçun baytlar satrdan uzunroq. `.encode()` ni özingiz kamdan-kam çaqirasiz. U fayllarni öqiş va yozişda muhim - buni *Fayllar va pathlib* darsi, jumladan nega har doim `encoding="utf-8"` deyiş kerakligini tuşuntiradi.

## Özingiz sinab köring

Ism va familiyadan foydalanuvçi nomini yarating: ismning birinçi harfi, butun familiya va töliq ismning uzunligi.

<ClientOnly><PythonPlayground :code='"first = \"dilnoza\"\nlast = \"rahimova\"\n\nusername = first[0] + last + str(len(first + last))\nprint(username)\nprint(\"Uzunlik:\", len(username))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Indeks çegaradan taşqarida

```py
word = "non"
print(word[3])
```

```text
IndexError: string index out of range
```

Xabar "satr indeksi çegaradan taşqarida" deydi. `"non"` ning indekslari `0`, `1` va `2`. **Tuzatiş:** oxirgi indeks `len(word) - 1` ekanini eslang yoki `word[-1]` dan foydalaning.

### 2. Birlaştirişda böş joylarni unutiş

```python
city = "Toşkent"
print("Men yaşaydigan şahar:" + city)   # Men yaşaydigan şahar:Toşkent
```

**Tuzatiş:** `"Men yaşaydigan şahar: " + city` yoki `print("Men yaşaydigan şahar:", city)`.

### 3. Aslida satr bölgan sonlarni qöşiş

```python
apples = "5"
pears = "5"
print(apples + pears)
```

```text
55
```

Xato yöq, şunçaki notögri javob: ikkala qiymat ham satr, şuning uçun `+` ularni birlaştiradi. Bu köpinça `input()` dan kelgan qiymatlar bilan yuz beradi. **Tuzatiş:** avval ularni songa aylantiring, *Kiritiş va turlarni özgartiriş* darsida körsatilganidek: `int(apples) + int(pears)` `10` beradi.

### 4. Notögri apostrof bilan qidiriş

```python
country = "Oʻzbekiston"
print("O'zbekiston" == country)
print("'" in country)
```

```text
False
False
```

Matn özbekça `ʻ` harfi bilan yozilgan, qidiruv esa klaviaturadagi `'` apostrofni işlatyapti. Ular öxşaş körinadi, lekin boşqa belgilar. **Tuzatiş:** ikkala joyda ham bir xil belgidan foydalaning. Maʼlumotingizda ikkalasi ham bölişi mumkin bölsa, avval birini ikkinçisiga almaştiring. `.replace()` ni keyingi darsda örganasiz.

## Maşqlar

### 1. Salomlaşiş <Difficulty level="1" />

`name = "Bekzod"` berilgan. `+` yordamida `Salom, Bekzod!` ni çiqaring.

::: details Yeçim
```python
name = "Bekzod"
print("Salom, " + name + "!")
```
:::

### 2. Birinçi va oxirgi <Difficulty level="1" />

`word = "Samarqand"` uçun birinçi belgini, oxirgi belgini va uzunlikni çiqaring.

::: details Yeçim
```python
word = "Samarqand"
print(word[0])
print(word[-1])
print(len(word))
```

```text
S
d
9
```
:::

### 3. Boş harflar <Difficulty level="2" />

`first = "aziza"` va `last = "karimova"` berilgan. Indekslaş va `+` yordamida `a.k.` boş harflarini çiqaring.

::: details Yeçim
```python
first = "aziza"
last = "karimova"
print(first[0] + "." + last[0] + ".")
```

Keyingi darsda buni `A.K.` ga aylantiradigan `.upper()` ni örganasiz.
:::

### 4. Ramkadagi sarlavha <Difficulty level="2" />

`*` va `len()` yordamida sarlavhani ramka içida çiqaring. Ramka eni matnga **avtomatik mos kelsin**:

```text
+------------------+
| Python kundaligi |
+------------------+
```

Sarlavhani özgartirsangiz ham kodingiz işlayverişi kerak.

::: details Yeçim
```python
title = "Python kundaligi"
border = "+" + "-" * (len(title) + 2) + "+"

print(border)
print("| " + title + " |")
print(border)
```

`len(title) + 2` sarlavhaning ikki tomonidagi böş joylarni hisobga oladi.
:::

### 5. Örtadagi belgi <Difficulty level="3" />

Sözning örtasidagi belgini çiqaring. Uzunligi juft bölgan söz uçun örtadan **keyingi** belgini çiqaring. `"python"` (6 harf → `h`), `"olma"` (4 harf → `m`) va `"çoy"` (3 harf → `o`) ni uçta özgaruvçiga saqlang va har birining örtadagi belgisini alohida qatorda çop eting.

::: details Yeçim
```python
word1 = "python"
word2 = "olma"
word3 = "çoy"

print(word1[len(word1) // 2])
print(word2[len(word2) // 2])
print(word3[len(word3) // 2])
```

```text
h
m
o
```

- `"python"`: `6 // 2 = 3`, `word1[3]` esa `"h"`.
- `"olma"`: `4 // 2 = 2`, `word2[2]` esa `"m"`.
- `"çoy"`: `3 // 2 = 1`, `word3[1]` esa `"o"`.

Oldingi darsdagi butun böliş `//` har qanday uzunlik uçun butun sonli indeks beradi.
:::

## Xulosa

- `+` satrlarni birlaştiradi, `*` esa takrorlaydi. Böş joylarni özingiz qöşing.
- `len(text)` belgilarni, jumladan böş joylarni ham sanaydi.
- `text[i]` bitta belgini oladi. Indekslar `0` dan boşlanadi, `-1` esa oxirgi belgi.
- Satrlar **özgarmas**: satrni özgartiriş örniga yangisini yarating.
- `"x" in text` satr bölagi bor-yöqligini tekşiradi va katta-kiçik harfni farqlaydi. Satr va sonni `+` bilan qöşmang: `str()`, `print()` dagi vergullar yoki f-satrdan foydalaning.
- Har bir belgi - Unicode kod nuqtasi (`ord`/`chr`), `.encode("utf-8")` esa `str` ni `bytes` ga aylantiradi.

## Qöşimça manbalar

- [Python Tutorial - Text](https://docs.python.org/3/tutorial/introduction.html#text)
- [Text sequence type - `str`](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str)
- [Common sequence operations](https://docs.python.org/3/library/stdtypes.html#common-sequence-operations)
