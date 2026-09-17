---
title: Python nima?
description: "Python nima, u bilan nimalar yaratiladi, u kodingizni qanday işga tuşiradi va nega u birinçi dasturlaş tili sifatida juda qulay."
---

# Python nima?

![Rasm: Python nima?](/images/topics-webp-uzb/what-is-python.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Dasturlaş tili nima va Python ularning orasida qanday örin tutadi
- Odamlar Python bilan nimalar yaratadi
- Python kodingizni qanday işga tuşiradi
- Nega Python birinçi til sifatida yaxşi va u nimalarga kamroq mos keladi
- Pythondagi eng birinçi qatoringizni şu sahifaning özida qanday işga tuşiriş
:::

## Nega bu muhim

Kompyuter aynan aytilgan işni bajaradi, undan ortiq emas. **Dasturlaş tili** şu buyruqlarni ham odamlar, ham kompyuterlar tuşunadigan qilib yoziş usulidir. Python dunyodagi eng keng tarqalgan dasturlaş tillaridan biri. U veb-saytlar, ilmiy tadqiqotlar va sunʼiy intellekt vositalarida işlatiladi. Odamlar undan har hafta bir neçta soatlik zerikarli işni tejaydigan kiçik skriptlar uçun ham foydalanadi.

Pythonni birinçi bölib örgansangiz, bu darslikdan keyin ham uzoq vaqt işlataveradigan tilga ega bölasiz.

## Bitta misolda dasturlaş tili

Mana töliq Python dasturi:

```python
print("Salom! Men Python örganyapman.")
```

Natija:

```text
Salom! Men Python örganyapman.
```

`print` - bu Pythonga oldindan maʼlum bölgan, nomi bor harakat, yaʼni içki **funksiya** (function). Qöştirnoq içidagi matn esa unga beradigan qiymatingiz. Bu qanday işlaşini keyingi bir neçta darsda aniq örganasiz. Hozirça şunga eʼtibor bering: kod juda qisqa. Heç qanday tayyorlov kodi ham, yodlab oliş kerak bölgan belgilar ham yöq.

Biroz kattaroq dastur ham deyarli oddiy gapdek öqiladi:

```python
prices = [1.20, 2.50, 0.99]
total = sum(prices)

if total > 4:
    print("Bu 4 dollardan köp.")
else:
    print("4 dollardan kam.")
```

Pythonni bilmasangiz ham, bu kod nima qilişini taxmin qila olsangiz kerak. Mana şu öqiliş osonligi Pythonning eng katta kuçi. (Kvadrat qavsli röyxat va `if`/`else` keyinroq öz darslariga ega böladi, şuning uçun hozirça tafsilotlar haqida qayğurmang.)

## Qisqaça tarix

- **Guido van Rossum** Python ustida 1980-yillarning oxirida işlay boşlagan va uni **1991-yilda** çiqargan.
- Nomi ilondan emas, *Monty Python's Flying Circus* nomli Britaniya komediya körsatuvidan olingan.
- **Python 3** 2008-yilda çiqdi va uzoq yillik dizayn muammolarini tuzatdi. U Python 2 bilan töliq mos emas edi.
- **Python 2** 2020-yil 1-yanvarda qöllab-quvvatlanişi töxtatildi. Bu yerda örganadigan hamma narsangiz Python 3.
- Python bepul va oçiq kodli. Uni asosiy dasturçilar va hissa qöşuvçilardan iborat oçiq hamjamiyat rivojlantiradi, **Python Software Foundation** esa unga ğamxörlik qiladi.
- Yangi versiya **har yili oktyabrda** çiqadi: 2024-yilda 3.13, 2025-yilda 3.14 va hokazo. Har bir versiya taxminan beş yil davomida tuzatişlar va xavfsizlik yangilanişlarini oladi.

::: warning Eski qöllanmalar
Agar `print "hello"` kabi (qavslarsiz) kodni körsangiz, bu Python 2. U Python 3 da işlamaydi. Pastdagi **Köp uçraydigan xatolar** bölimiga qarang.
:::

## Odamlar Python bilan nimalar yaratadi

| Soha | Misollar | Maşhur vositalar |
|---|---|---|
| **Avtomatlaştiriş va skriptlar** | 1000 ta fayl nomini özgartiriş, jadvallarni töldiriş, hisobotlar yuboriş | Standart kutubxona |
| **Maʼlumotlar tahlili** | Maʼlumotlarni tozalaş, statistika, grafiklar | pandas, NumPy, Matplotlib |
| **Maşinali örganiş va sunʼiy intellekt** | Tasvirlarni aniqlaş, til modellari, tavsiyalar | PyTorch, scikit-learn |
| **Veb-dasturlaş** | Veb-saytlar va API lar | Django, Flask, FastAPI |
| **Fan va taʼlim** | Simulyatsiyalar, tadqiqot kodi, dasturlaşni örgatiş | Jupyter notebooks, SciPy |
| **Testlaş va DevOps** | Testlar töplamlari, joylaştiriş skriptlari, server vositalari | pytest, Ansible |

Hozirça bu vositalarning heç biri sizga kerak emas. Bu darslik tilning özini va **standart kutubxona** (standard library)ni örgatadi. Standart kutubxona - har bir Python örnatmasi bilan birga keladigan katta modullar töplami. Jadvaldagi har bir vosita aynan şuning ustiga qurilgan.

## Python kodingizni qanday işga tuşiradi

Python kodini oddiy matn sifatida yozasiz, odatda nomi `.py` bilan tugaydigan faylga. **Python interpretatori** deb ataladigan dastur şu matnni öqiydi va buyruqlarni bajaradi:

1. Manba kodingizni **öqiydi**, masalan, `hello.py` ni.
2. Uni **tekşiradi va** *bytecode* deb ataladigan soddaroq içki körinişga **tarjima qiladi**. Agar sintaksis xatosi bölsa, Python şu yerda töxtaydi va xato qayerdaligini aytadi.
3. Bytecode ni bittadan buyruq qilib **bajaradi**. Bajariş paytida biror narsa notöğri ketsa, Python *traceback* deb ataladigan xato xabarini körsatadi.

Dasturni işga tuşirganingizda bularning hammasi soniyaning bir qismida sodir böladi. Bundan ikki narsa kelib çiqadi:

- **Javobni tez olasiz.** Özgartiring, işga tuşiring, natijani köring, yana takrorlang. Heç narsani alohida yiğiş yoki kompilyatsiya qiliş şart emas.
- **Xatolar qator bajarilganda çiqadi.** Python avval butun faylning grammatikasini tekşiradi, lekin 50-qatordagi notöğri yozilgan nom faqat 50-qator haqiqatan bajarilganda aniqlanadi.

Standart interpretator **CPython** deb ataladi (u C tilida yozilgan). Keyingi darsda aynan şuni örnatasiz. Bu saytdagi kod işga tuşirgiç esa **Pyodide** dan foydalanadi. Bu veb-brauzeringiz içida işlaydigan CPython versiyasi.

## Nega Python yaxşi birinçi til

- **Öqiş oson.** Kod bloklari figurali qavslar bilan emas, çekiniş (indentation) bilan belgilanadi, şuning uçun dasturlar toza va bir-biriga öxşaş körinadi.
- **Tez boşlaş mumkin.** Bitta qator - töliq dastur.
- **"Batareyalar ham içida."** Fayllar, sanalar, matematika, tasodifiy sonlar, JSON va yana köp narsa tayyor holda bor.
- **Katta hamjamiyat.** Deyarli har qanday savolingizga allaqaçon javob berilgan va deyarli har narsa uçun kutubxonalar mavjud.
- **U siz bilan birga ösadi.** Aynan bir xil tildan yangi boşlovçilar ham, yirik kompaniyalar ham foydalanadi.

Pythonning kamçiliklari ham bor:

- **Tezlik.** Sof Python C, Rust yoki Go kabi tillardan sekinroq. Amalda esa NumPy kabi kutubxonalardagi oğir hisob-kitoblarni tez kompilyatsiya qilingan kod bajaradi, şuning uçun örganiş paytida bu deyarli ahamiyatga ega emas.
- **Mobil ilovalar va brauzerdagi interfeyslar** odatda boşqa tillarda yoziladi (Swift, Kotlin, JavaScript).
- **Turlar bajariş vaqtida tekşiriladi.** Siz sonni matnli qiymat bilan adaştirib yuborsangiz, Python buni faqat şu qator bajarilganda aniqlaydi. Darslikning keyingi qismlarida keladigan testlar va type hintlar (turlarni körsatuvçi izohlar) bunda yordam beradi.

## Özingiz sinab köring

Bu muharrir brauzeringizda haqiqiy Python kodini işga tuşiradi. **▶ Run** tugmasini bosing va natijani köring. Keyin matnni özgartiring, ikkinçi `print` qatorini qöşing va yana işga tuşiring.

<ClientOnly><PythonPlayground :code='"print(\"Salom! Men Python örganyapman.\")\nprint(\"2 + 3 =\", 2 + 3)"' /></ClientOnly>

Pythonda yaxşi kod dizayni haqida kiçik yaşirin şeʼr bor. Buni işga tuşiring:

```python
import this
```

*The Zen of Python* ni körasiz. Bu Python kodi qanday bölişi kerakligini tasvirlaydigan 19 ta qisqa qator. "Readability counts." (Öqiliş muhim) ular orasida bor.

## Köp uçraydigan xatolar

### 1. Python 2 qöllanmasiga ergaşiş

```py
print "hello"
```

```text
SyntaxError: Missing parentheses in call to 'print'. Did you mean print(...)?
```

**Tuzatiş:** Python 3 da `print` funksiya va unga har doim qavslar kerak: `print("hello")`. Agar qöllanmada eski uslub işlatilgan bölsa, yangiroğini toping.

### 2. Harflar kattaligini özgartiriş

```py
Print("salom")
```

```text
NameError: name 'Print' is not defined. Did you mean: 'print'?
```

Python **katta va kiçik harflarni farqlaydi**: `print`, `Print` va `PRINT` - uçta har xil nom. Ulardan faqat `print` mavjud.

### 3. Yopuvçi qöştirnoqni unutiş

```py
print("Salom)
```

```text
SyntaxError: unterminated string literal (detected at line 1)
```

Matnli qiymatlarning **ikkala** uçida ham qöştirnoq böliş kerak: `"Salom"`.

::: info Xato xabarlari - sizning döstlaringiz
Yuqoridagi har bir xato *nima* notöğri ketganini aytadi va köpinça tuzatiş yölini ham taklif qiladi. Xato xabarining avval **oxirgi qatorini** öqing. Töliq xabarni öqişni *Xato xabarlarini öqiş va tuzatiş* darsida örganasiz.
:::

## Maşqlar

### 1. Birinçi xabaringiz <Difficulty level="1" />

Yuqoridagi muharrirda Python ismingizni va yaşaydigan şahringizni ikki alohida qatorda çiqarsin.

::: details Yeçim
```python
print("Mening ismim Aziza.")
print("Men Toşkentda yaşayman.")
```

Har bir `print` çaqiriği öz natijasini yangi qatorga çiqaradi.
:::

### 2. Taxmin qiling, keyin işga tuşiring <Difficulty level="1" />

Işga tuşirişdan oldin bu kod nima çiqarişini yozib qöying. Keyin işga tuşirib, soliştiring.

```python
print("5 + 5")
print(5 + 5)
```

::: details Yeçim
```text
5 + 5
10
```

Qöştirnoq bilan `"5 + 5"` şunçaki **matn**, u qanday bölsa şunday çiqariladi. Qöştirnoqsiz `5 + 5` esa **hisoblaş**, şuning uçun Python natijani çiqaradi. Matn va sonlar orasidagi bu farq doim uçrab turadi.
:::

### 3. Dasturni tuzating <Difficulty level="2" />

Bu dasturda uçta xato bor. U işlab, ikki qator çiqaradigan qilib tuzating.

```py
Print("Python 1991-yilda çiqarilgan)
print "U Monty Python nomi bilan atalgan."
```

::: details Yeçim
```python
print("Python 1991-yilda çiqarilgan")
print("U Monty Python nomi bilan atalgan.")
```

1. `Print` → `print` (harflar kattaligi)
2. `1991-yilda çiqarilgan` dan keyin yopuvçi `"` yetişmayotgan edi
3. `print` ga qavslar kerak (Python 2 uslubi işlamaydi)
:::

### 4. Zen bilan tanişing <Difficulty level="2" />

`import this` ni işga tuşiring. Biror işni qilişning neçta yöli böliş kerakligi haqidagi qatorni va xatolar haqidagi qatorni toping. Ikkalasini ham yozib oling, keyin ulardan birini öz sözlaringiz bilan tuşuntiring.

::: details Yeçim
- *"There should be one-- and preferably only one --obvious way to do it."* (Buni qilişning bitta, afzali faqat bitta, aniq yöli böliş kerak.)
- *"Errors should never pass silently."* (Xatolar heç qaçon jimgina ötib ketmasligi kerak.)

Masalan, ikkinçisi dastur muammolarni jimgina eʼtiborsiz qoldirmasligi kerakligini anglatadi. Notöğri maʼlumot bilan davom etgandan köra, aniq xato bilan töxtagan yaxşiroq.
:::

### 5. Hisobni Pythonga topşiring <Difficulty level="2" />

Bir haftada neça daqiqa bor? Özingiz hisoblamang. Yorliq körsatadigan va sonni 7 kun, 24 soat va 60 daqiqadan Python özi hisoblaydigan qatorni çop eting. **Özingiz sinab köring** muharriridagi ikkinçi qatorni namuna qilib oling.

::: details Yeçim
```python
print("Bir haftadagi daqiqalar:", 7 * 24 * 60)
```

```text
Bir haftadagi daqiqalar: 10080
```

Yorliq qöştirnoq içidagi matn, şuning uçun u bor holiça çop etiladi. Hisobda qöştirnoq yöq, şuning uçun Python avval uni hisoblaydi. `*` köpaytirişni bildiradi.
:::

## Xulosa

- Dasturlaş tili - kompyuterga aniq buyruqlar beriş usuli. Python öqiş osonligi bilan maşhur.
- Pythonni Guido van Rossum yaratgan va u 1991-yilda çiqarilgan. Doim **Python 3** dan foydalaning.
- Odamlar Pythonni avtomatlaştiriş, maʼlumotlar, sunʼiy intellekt, veb, fan va taʼlim uçun işlatadi.
- **Interpretator** `.py` faylingizni öqiydi, tarjima qiladi va bajaradi, şuning uçun tez özgartirib, işga tuşirib, takrorlay olasiz.
- Python katta-kiçik harflarni farqlaydi, xato xabarlari esa odatda tuzatiş yölini körsatadi.

## Qöşimça manbalar

- [The Python Tutorial - Whetting Your Appetite](https://docs.python.org/3/tutorial/appetite.html)
- [Python FAQ - General](https://docs.python.org/3/faq/general.html)
- [Python release status and support dates](https://devguide.python.org/versions/)
