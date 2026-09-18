---
title: Salom, dunyo!
description: "print() yordamida birinçi haqiqiy Python dasturlaringizni yozing: matn, qöştirnoqlar, bir neçta qiymat, maxsus belgilar, ajratgiçlar va qator oxirini boşqariş."
---

# Salom, dunyo!

![Rasm: Salom, dunyo!](/images/topics-webp-uzb/hello-world.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `print()` qanday işlaydi: funksiyani **argumentlar** bilan çaqiriş
- Matnni (satrlarni) bittalik, qöş va uçtalik qöştirnoqlar bilan qanday yoziş
- Bir neçta qiymatni birdaniga qanday çiqariş
- `\n`, `\t` va boşqa maxsus belgilardan qanday foydalaniş
- `sep` va `end` bilan oraliqlar va qator oxirini qanday boşqariş
:::

## Nega bu muhim

Çiqariş - dasturingizning siz bilan gaplaşiş usuli. Boşqa narsalarni örganişdan oldin kodingiz nima qilayotganini **köriş** uçun işonçli yöl kerak. Dasturçilar butun faoliyati davomida `print()` dan foydalanadi: ham natijalarni körsatiş, ham xatolarni topiş uçun.

Anʼanaga köra, yangi tildagi birinçi dastur *Salom, dunyo!* deb çiqaradi.

```python
print("Salom, dunyo!")
```

```text
Salom, dunyo!
```

## Funksiya çaqirişining tuzilişi

```text
print("Salom, dunyo!")
|    |       |       |
|    |       |       +-- yopuvçi qavs
|    |       +---------- argument: satr (matn) qiymati
|    +------------------ oçuvçi qavs: "şu funksiyani çaqir"
+----------------------- funksiyaning nomi
```

- **Funksiya** (function) - maʼlum bir işni bajaradigan, nomi bor kod bölagi. `print` **içki** funksiya: u doim mavjud.
- Funksiyani **çaqiriş** - uni işga tuşiriş degani. Funksiyani çaqiriş uçun uning nomini yozib, keyin qavslar qöyasiz.
- Qavslar içidagi qiymat **argument** (argument) deyiladi: bu funksiyaga beradigan kiritişingiz.

Har bir funksiya çaqiriği şunday körinişda böladi: `name(arguments)`. Siz yuzlab funksiyalardan foydalanasiz va ularning hammasi şunday körinadi.

## Satrlar: matn yoziş

Pythonda matn bölagi **satr** (string) deyiladi. Uni yaratiş uçun matnni qöştirnoq içiga olasiz. Bittalik va qöş qöştirnoqlar bir xil işlaydi:

```python
print("Qöş qöştirnoq işlaydi.")
print('Bittalik qöştirnoq ham işlaydi.')
```

Bitta uslubni tanlang va uni doim işlating. Bu darslikda qöş qöştirnoq işlatiladi. Matningiz içida qöştirnoq belgisi bölsa, boşqa turdagi qöştirnoq qöl keladi:

```python
print("Kitob nomi: 'Ötkan kunlar'.")
print('U "salom" dedi va ketdi.')
```

Yoki qöştirnoq oldiga **teskari çiziq** (backslash) qöyişingiz mumkin. Şunda Python uni satr oxiri emas, oddiy belgi deb qabul qiladi:

```python
print("U \"salom\" dedi va ketdi.")
print('Kitob nomi: \'Ötkan kunlar\'.')
```

### Bir neçta qatorli matn

Uçtalik qöştirnoqlar (`"""` yoki `'''`) satrni xuddi siz yozgandek bir neçta qatorga çözadi:

```python
print("""Xarid röyxati:
- non
- sut
- olma""")
```

```text
Xarid röyxati:
- non
- sut
- olma
```

## Maxsus belgilar: escape ketma-ketliklari

Teskari çiziq va undan keyingi harf maxsus belgi hosil qiladi. Ular **escape ketma-ketliklari** deyiladi:

| Ketma-ketlik | Maʼnosi |
|---|---|
| `\n` | Yangi qator |
| `\t` | Tabulyatsiya (keng böş joy, ustunlarni tekislaş uçun qulay) |
| `\\` | Haqiqiy teskari çiziq |
| `\"` va `\'` | Qöştirnoq belgisi |

```python
print("Birinçi qator\nIkkinçi qator")
print("Ism:\tAziza")
print("Yoş:\t20")
print("Papka: C:\\Users\\aziza")
```

```text
Birinçi qator
Ikkinçi qator
Ism:	Aziza
Yoş:	20
Papka: C:\Users\aziza
```

::: warning Windows yöllari va yakka teskari çiziq
Yölni yakka teskari çiziqlar bilan yozsangiz, Python baribir har bir teskari çiziqni maxsus ketma-ketlik boşi deb öqiydi. `"C:\new\data"` da `\n` jimgina yangi qatorga aylanadi. `\d` maʼlum ketma-ketlik emas, şuning uçun Python 3.12 va undan yangilari ogohlantiriş ham çiqaradi:

```py
print("Papka: C:\new\data")
```

```text
SyntaxWarning: "\d" is an invalid escape sequence. Such sequences will not work in the future. Did you mean "\\d"? A raw string is also an option.
Papka: C:
ew\data
```

Yo har bir teskari çiziqni ikkilantiring, yo qöştirnoq oldiga `r` qöyib **xom satr (raw string)** yasang. Xom satrda teskari çiziq şunçaki teskari çiziq:

```python
print(r"Papka: C:\new\data")
```

```text
Papka: C:\new\data
```
:::

## Bir neçta qiymatni çiqariş

`print()` ga vergul bilan ajratilgan bir neçta argument bering. U ularni tartib bilan, **har birining orasiga bitta böş joy qöyib** çiqaradi:

```python
print("Python", "juda", "qiziq")
print("Yil:", 2026)
print("2 + 3 =", 2 + 3)
```

```text
Python juda qiziq
Yil: 2026
2 + 3 = 5
```

Eʼtibor bering: `2026` va `2 + 3` **qöştirnoqsiz** yozilgan. Ular matn emas, sonlar. Python avval `2 + 3` ni hisoblaydi, keyin natijani çiqaradi. Sonlar haqida tez orada köproq örganasiz.

### Böş qatorlar

Içi böş `print()` böş qator çiqaradi. Bu natijani oraliqlar bilan ajratiş uçun qulay:

```python
print("Hisobot")
print()
print("Barça tizimlar joyida")
```

## Natijani boşqariş: `sep` va `end`

`print()` ning ikkita ixtiyoriy sozlamasi bor. Ular `name=value` körinişidagi **kalit söz argumentlari** sifatida beriladi:

- **`sep`**: qiymatlar *orasiga* nima qöyiladi (standart holatda böş joy `" "`)
- **`end`**: oxirgi qiymatdan *keyin* nima qöyiladi (standart holatda yangi qator `"\n"`)

```python
print("2026", "09", "15", sep="-")
print("a", "b", "c", sep="")
print("Yuklanmoqda", end="")
print("...", end="")
print(" tayyor!")
```

```text
2026-09-15
abc
Yuklanmoqda... tayyor!
```

`end=""` avtomatik yangi qatorni olib taşlagani uçun keyingi `print()` şu qatorning özida davom etadi.

## Dasturlar yuqoridan pastga bajariladi

Python qatorlarni birin-ketin, tartib bilan bajaradi. Har bir `print()` çaqiriği keyingisi boşlanişidan oldin tugaydi:

```python
print("1. Uyğoniş")
print("2. Çoy damlaş")
print("3. Python örganiş")
```

Qatorlar örnini almaştirsangiz, natija ham özgaradi. Bu tuşunarli tuyuladi, lekin "qaysi qator birinçi bajariladi?" degan savol köp xatolarning ildizida turadi.

## Özingiz sinab köring

Özingiz uçun kiçik "vizitka" yarating. Qiymatlarni tekislaş uçun `\t` ni sinab köring.

<ClientOnly><PythonPlayground :code='"print(\"=\" * 30)\nprint(\"Ism:\\tAziza Karimova\")\nprint(\"Şahar:\\tToşkent\")\nprint(\"Maqsad:\\tPython örganiş\")\nprint(\"=\" * 30)"' /></ClientOnly>

`"=" * 30` satrni 30 marta takrorlaydi. Sonni özgartirib köring.

## Köp uçraydigan xatolar

### 1. Qöştirnoqlar mos kelmasligi

```py
print("Salom')
```

```text
SyntaxError: unterminated string literal (detected at line 1)
```

Satr **bir xil** turdagi qöştirnoq bilan boşlanib, şunday qöştirnoq bilan tugaşi kerak.

### 2. Satr içidagi qöştirnoq

```py
print('Kitob nomi: 'Ötkan kunlar'.')
```

```text
SyntaxError: invalid syntax. Is this intended to be part of the string?
```

Python satr `Ötkan` oldidagi qöştirnoqda tugadi deb öylaydi. Xabarda ham "bu satrning bir qismi bölişi kerakmidi?" deb söralmoqda. **Tuzatiş:** `print("Kitob nomi: 'Ötkan kunlar'.")` yoki `print('Kitob nomi: \'Ötkan kunlar\'.')`.

### 3. Qiymatlar orasidagi vergulni unutiş

```py
print("Jami:" 42)
```

```text
SyntaxError: invalid syntax. Perhaps you forgot a comma?
```

Python hatto tuzatişni ham taklif qiladi ("vergulni unutmadingizmi?"). Argumentlar vergul bilan ajratilişi kerak: `print("Jami:", 42)`.

### 4. Hisoblaşni qöştirnoq içiga oliş

```python
print("7 * 6")   # 7 * 6 degan matnni çiqaradi
print(7 * 6)     # 42 ni çiqaradi
```

Qöştirnoqlar matn hosil qiladi. Python biror narsani hisoblaşini istasangiz, qöştirnoqlarni qöymang.

## Maşqlar

### 1. Uç qator, bitta çaqiriq <Difficulty level="1" />

Buni **bitta** `print()` çaqiriği bilan çiqaring:

```text
Atirgul qizil
Binafşa köm-kök
Python juda qiziq
```

::: details Yeçim
```python
print("Atirgul qizil\nBinafşa köm-kök\nPython juda qiziq")
```

Uçtalik qöştirnoqli satr ham işlaydi.
:::

### 2. Matndagi qöştirnoqlar <Difficulty level="1" />

Aynan şu qatorni çiqaring:

```text
Östoz dedi: "Ikki nuqta ':' belgisini unutmang!"
```

::: details Yeçim
```python
print('Östoz dedi: "Ikki nuqta \':\' belgisini unutmang!"')
```

yoki

```python
print("Östoz dedi: \"Ikki nuqta ':' belgisini unutmang!\"")
```
:::

### 3. Sana va vaqt <Difficulty level="2" />

`15/09/2026` sanasini va `08:30` vaqtini çiqaring. Kun, oy va yilni (hamda soat va daqiqani) **alohida qiymatlar** sifatida bering. `/` va `:` belgilarini özingiz yoziş örniga `sep` dan foydalaning.

::: details Yeçim
```python
print(15, "09", 2026, sep="/")
print("08", "30", sep=":")
```

`"09"` va `"08"` satr qilib yozilgan, çunki Python butun sonlarda `09` kabi boşlanğiç nollarga ruxsat bermaydi (`print(09)` - `SyntaxError`).
:::

### 4. Tartibli jadval <Difficulty level="2" />

Ustunlar tekis turişi uçun bu jadvalni `\t` bilan çiqaring:

```text
Nomi	Soni	Narxi
Çoy	2	3.00
Somsa	4	4.00
```

::: details Yeçim
```python
print("Nomi\tSoni\tNarxi")
print("Çoy\t2\t3.00")
print("Somsa\t4\t4.00")
```

Yoki `sep` bilan:

```python
print("Nomi", "Soni", "Narxi", sep="\t")
print("Çoy", 2, "3.00", sep="\t")
print("Somsa", 4, "4.00", sep="\t")
```
:::

### 5. Jarayon çiziği <Difficulty level="3" />

`end` bilan bir neçta `print()` çaqirişidan foydalanib, şu **yagona** qatorni hosil qiling:

```text
[#####] 100%
```

Avval `[` ni, keyin har bir `#` ni alohida `print()` çaqiriği bilan, oxirida esa yopuvçi qismni çiqaring.

::: details Yeçim
```python
print("[", end="")
print("#", end="")
print("#", end="")
print("#", end="")
print("#", end="")
print("#", end="")
print("] 100%")
```

Bir xil qatorni beş marta yoziş zerikarli. **Sikllar** bölimida buni `for` sikli yordamida ikki qatorda qilasiz.
:::

## Xulosa

- `print()` - içki **funksiya**. Uni `name(arguments)` körinişida çaqiring.
- Matnli qiymatlar **satrlar** deyiladi va `"qöş"`, `'bittalik'` yoki `"""uçtalik"""` qöştirnoqlarda yoziladi.
- Escape ketma-ketliklari: yangi qator uçun `\n`, tabulyatsiya uçun `\t`, qöştirnoq yoki teskari çiziq uçun `\"` yoki `\\`.
- `print(a, b, c)` qiymatlarni böş joy bilan ajratib çiqaradi. Yolğiz `print()` böş qator çiqaradi.
- `sep=` ajratgiçni, `end=` esa oxirida çiqariladigan narsani özgartiradi.
- Kod **yuqoridan pastga** bajariladi.

## Qöşimça manbalar

- [Built-in functions - `print()`](https://docs.python.org/3/library/functions.html#print)
- [Python Tutorial - Using Python as a Calculator (Text)](https://docs.python.org/3/tutorial/introduction.html#text)
- [String and bytes literals (escape sequences)](https://docs.python.org/3/reference/lexical_analysis.html#string-and-bytes-literals)
