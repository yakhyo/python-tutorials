---
title: Python kodini işga tuşiriş
description: "Pythonni işga tuşirişning uç yöli: interaktiv taklif matni (REPL), skript fayllar va muharriringiz, hamda qaysi birini qaçon işlatiş."
---

# Python kodini işga tuşiriş

![Rasm: Python kodini işga tuşiriş](/images/topics-webp-uzb/running-python.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Interaktiv taklif matni** va **skript fayl** orasidagi farq
- `.py` faylni qanday yaratiş va uni terminaldan işga tuşiriş
- Faylni kod muharriridan qanday işga tuşiriş
- Nega terminaldagi **joriy papka** muhim
- Qaysi iş uçun qaysi usuldan foydalaniş
:::

## Nega bu muhim

Örganiş davomida kodni yuzlab marta işga tuşirasiz. Kodingiz *qayerda* işlayotganini va har bir usul sizga nimani körsatişini bilsangiz, "dasturim heç narsa çiqarmadi" yoki "Python faylimni topa olmayapti" kabi çalkaş vaziyatlardan qutulasiz.

Pythonni işga tuşirişning uçta keng tarqalgan yöli bor:

| Usul | Bu nima | Nima uçun eng qulay |
|---|---|---|
| **Interaktiv taklif matni (REPL)** | Bitta qator yozasiz, natijani darhol körasiz | Tezkor tajribalar, ğoyani tekşiriş |
| **Skript fayl** | Kodni `.py` faylga saqlab, butun faylni işga tuşirasiz | Saqlab qolmoqçi bölgan haqiqiy dasturlar |
| **Brauzerda** | Dars sahifalaridagi muharrir | Darslarni bajariş, örnatişsiz |

Kod muharriringiz aslida ikkinçi usulning qulay körinişi: u faylni saqlaydi va siz uçun işga tuşiradi.

## 1. Interaktiv taklif matni (REPL)

REPL - **Read-Eval-Print Loop** degan söz: Python qatorni **öqiydi** (read), uni **hisoblaydi** (eval), natijani **çiqaradi** (print) va keyingi qatorni kutiş uçun yana **boşiga qaytadi** (loop).

Uni terminalda `python` (Windows) yoki `python3` (macOS va Linux) deb yozib işga tuşiring:

```text
>>> 7 * 6
42
>>> name = "Aziza"
>>> name
'Aziza'
>>> print("Salom,", name)
Salom, Aziza
```

Bir neçta narsaga eʼtibor bering:

- REPL da qiymatni yolğiz özini yozsangiz (`7 * 6`, `name`), u **avtomatik körsatiladi**. `print()` kerak emas.
- Özgaruvçilar siz çiqib ketgunça saqlanib turadi. `name` keyingi qatorda ham bor edi.
- `if` kabi bir neçta qatorli kod uçun taklif matni `...` ga özgaradi, şunda yozişda davom etasiz. Tugatiş uçun böş qatorda Enter ni bosing.

```text
>>> if 7 > 5:
...     print("yetti kattaroq")
...
yetti kattaroq
```

Yangi Python versiyalari (3.13 va undan yangilari) rangli taklif matniga ega va butun bloklarni strelka tugmalari bilan tahrirlaş imkonini beradi. Python 3.14 yozayotganingizda kodingizni ham ranglarga böyaydi. Oldingi qatorlarni qaytariş uçun **↑** ni bosing.

`exit` bilan (eski versiyalarda `exit()`) yoki **Ctrl + D** (macOS va Linux) yoki **Ctrl + Z, keyin Enter** (Windows) bilan **çiqing**. Çiqqaningizda yozgan hamma narsangiz yöqoladi. REPL - qoralama daftar, işni saqlaydigan joy emas.

::: info Çiqmasdan yordam oling
`help(print)` `print` haqidagi hujjatni körsatadi. Uni yopiş uçun `q` ni bosing. `dir("text")` satr bilan qiliş mumkin bölgan hamma narsaning röyxatini çiqaradi. Pastki çiziq bilan boşlanadigan nomlarni hozirça ötkazib yuboring.
:::

## 2. Skript fayllar

**Skript** - butun dasturni saqlaydigan, `.py` kengaytmali oddiy matnli fayl. Python uni **yuqoridan pastga, bir marta** bajaradi va keyin işini tugatadi.

### 1-qadam: papka va fayl yarating

Kurs işlaringiz uçun papka yarating, masalan, Documents içida `python-course`. Muharriringizda şu papka içida **`hello.py`** nomli yangi fayl yarating va unga quyidagini yozing:

```python
print("Fayldan salom!")
print("Bu qator ikkinçi bölib bajariladi.")
print("Bu esa eng oxirida bajariladi.")
```

Faylni saqlang.

Fayllarga `hello.py` yoki `dice_game.py` kabi qisqa va maʼnoli nomlar bering. Pythonning öz modullari nomlaridan, masalan `random.py` yoki `math.py` dan qoçing. Keyinroq `import random` deganingizda Python öz moduli örniga sizning faylingizni yuklab olardi.

### 2-qadam: şu papkada terminal oçing

Terminal har doim bitta papka *içida* işlaydi, uni **joriy papka** (yoki *working directory*) deyişadi. U yerga ötiş uçun `cd` ("change directory", papkani almaştiriş) dan foydalaning:

```text
cd Documents/python-course
```

Fayllar röyxatini çiqarib, töğri joydaligingizni tekşiring. Windows da `dir`, macOS va Linux da `ls` dan foydalaning. `hello.py` ni körişingiz kerak.

::: tip Qisqa yöl
VS Code da **Terminal → New Terminal** ni tanlang. U darhol loyiha papkangiz içida oçiladi.
:::

### 3-qadam: işga tuşiring

```text
python hello.py
```

(macOS va Linux da `python3 hello.py` dan foydalaning. Windows da `py hello.py` ham işlaydi.)

```text
Fayldan salom!
Bu qator ikkinçi bölib bajariladi.
Bu esa eng oxirida bajariladi.
```

Faylni özgartiring, saqlang va şu buyruqni yana işga tuşiring. Doim takrorlaydigan iş tartibingiz aynan şu: **tahrirlaş → saqlaş → işga tuşiriş**.

### Skriptlar qiymatlarni avtomatik körsatmaydi

REPL dan fayllarga ötganda eng köp hayron qoldiradigan narsa şu. Buni `values.py` nomi bilan saqlang va işga tuşiring:

```python
x = 5
x * 2
print(x * 2)
```

```text
10
```

Faqat **bitta** qator natija çiqadi. `x * 2` qatori hisoblanadi va keyin taşlab yuboriladi. Skriptda faqat `print()` qilgan narsangizni körasiz.

## 3. Muharrirdan işga tuşiriş

Muharrirlar joriy faylni siz uçun işga tuşira oladi:

- **VS Code** (Python kengaytmasi bilan): yuqori öng burçakdagi **▶ Run Python File** tugmasini bosing. Natija pastdagi terminal panelida çiqadi.
- **Thonny:** **F5** ni bosing yoki yaşil **Run** tugmasini bosing.
- **IDLE:** faylni oçing, keyin **F5** ni bosing (*Run → Run Module*).

Parda ortida muharrir siz uçun `python yourfile.py` ni işga tuşiradi. Agar biror narsa işlamasa, buyruqni terminalda özingiz işga tuşirsangiz, aynan nima bölayotganini körasiz.

## 4. Brauzerda

Bu sahifalardagi muharrirlar **Pyodide** da işlaydi. Bu brauzeringiz içida işlaşi uçun kompilyatsiya qilingan haqiqiy Python. Ular kiçik skript fayl kabi işlaydi:

- **▶ Run** ni bosganingizda butun oyna yuqoridan pastga bajariladi.
- Faqat `print()` qilgan narsangizni körasiz.
- Har bir işga tuşiriş yangidan boşlanadi, şuning uçun oldingi safargi özgaruvçilar yöqoladi.

<ClientOnly><PythonPlayground :code='"x = 5\nx * 2          # hisoblanadi, lekin körsatilmaydi\nprint(x * 2)   # körsatiladi"' /></ClientOnly>

## Qaysi birini işlatay?

| Men şuni qilmoqçiman… | Foydalaning |
|---|---|
| `10 / 3` nima berişini tekşiriş | REPL (yoki brauzer) |
| Hozirgina öqigan satr metodini sinab köriş | REPL |
| Ertaga yana işga tuşiradigan dastur yoziş | Skript fayl |
| Şu darslikdagi misollar va maşqlarni bajariş | Brauzer yoki skript fayl |
| Kodni kimgadir yuboriş | Skript fayl |

Köpçilikning odati - **ikkalasini** ham oçiq tutiş: muharrirda skript, terminalda esa kiçik qismlarni sinab köriş uçun REPL.

## Köp uçraydigan xatolar

### 1. "can't open file … No such file or directory"

```text
python3: can't open file '/Users/you/hello.py': [Errno 2] No such file or directory
```

Terminalning joriy papkasi faylingiz turgan papka emas. Xabardagi yölga qarang: u Python qayerdan qidirganini körsatadi. **Tuzatiş:** `cd` bilan töğri papkaga öting yoki faylning töliq yölini körsating.

### 2. `hello.py.txt` deb saqlaş

Notepad kabi ayrim matn muharrirlari `.txt` ni avtomatik qöşib qöyadi. Şunda papkada aslida `hello.py` bölmagan fayl turadi:

```text
% ls
hello.py.txt
% python3 hello.py
python3: can't open file '/Users/you/python-course/hello.py': [Errno 2] No such file or directory
```

**Tuzatiş:** kod muharriridan foydalaning yoki saqlaşda *All files* ni tanlang va haqiqiy nomni köriş uçun fayl menejeringizda fayl kengaytmalarini körsatişni yoqing.

### 3. Saqlaşdan oldin işga tuşiriş

Aksariyat muharrirlar ekraningizdagi kodni emas, diskda saqlangan faylni işga tuşiradi. Ikkinçi qatorni `"Xayr!"` çop etadigan qilib özgartirdingiz, Run ni bosdingiz va hali ham eski natijani köryapsiz:

```text
Fayldan salom!
Bu qator ikkinçi bölib bajariladi.
Bu esa eng oxirida bajariladi.
```

**Tuzatiş:** avval saqlang (**Ctrl + S**, macOS da **⌘ + S**). Saqlanmagan fayl yorliğida odatda nuqta yoki `●` belgisi körinadi. VS Code ning **File** menyusida *Auto Save* ni ham yoqib qöyişingiz mumkin.

## Maşqlar

### 1. REPL va fayl <Difficulty level="1" />

Bu uç qatorni REPL ga yozing, keyin aynan şu qatorlarni `compare.py` deb saqlab, işga tuşiring. Nima farq qiladi?

```python
3 + 4
len("salom")
print("tayyor")
```

::: details Yeçim
**REPL:**

```text
>>> 3 + 4
7
>>> len("salom")
5
>>> print("tayyor")
tayyor
```

**Skript:**

```text
tayyor
```

REPL har bir ifodaning qiymatini körsatadi. Skript esa faqat `print()` qilgan narsangizni körsatadi.
:::

### 2. Birinçi saqlangan dasturingiz <Difficulty level="1" />

Uç qator çiqaradigan `about_me.py` yarating: ismingiz, sevimli taomingiz va Python bilan yaratmoqçi bölgan bitta narsa. Uni terminaldan **va** muharriringizdan işga tuşiring.

::: details Yeçim
```python
print("Ism: Bekzod")
print("Sevimli taom: palov")
print("Maqsad: xarajatlarimni hisoblab boradigan dastur")
```

Uni saqlagan papkangizdan `python about_me.py` (yoki `python3 about_me.py`) bilan işga tuşiring.
:::

### 3. Skriptni tuzating <Difficulty level="2" />

Sinfdoşingizning skripti heç narsa çiqarmayapti. U umumiy narxni körsatadigan qilib tuzating.

```python
price = 12
quantity = 3
price * quantity
```

::: details Yeçim
```python
price = 12
quantity = 3
print(price * quantity)
```

Oxirgi qator `36` ni hisoblagan, lekin uni körsatmagan. Skriptlar faqat `print()` ga bergan narsangizni körsatadi.
:::

### 4. Faylni toping <Difficulty level="2" />

`hello.py` ni `Documents/python-course` ga saqladingiz, lekin `python hello.py` *No such file or directory* xatosini beryapti. Tuzatişning ikki xil yölini yozing.

::: details Yeçim
1. Avval papkaga öting: `cd Documents/python-course`, keyin `python hello.py` ni işga tuşiring.
2. Turgan joyingizda qolib, yölni körsating: `python Documents/python-course/hello.py`.

Uçinçi variant - papkani VS Code da oçib, uning içidagi terminaldan foydalaniş. U töğri joyda oçiladi.
:::

### 5. REPL esladi, skript esa yöq <Difficulty level="2" />

Ali REPL ga `city = "Samarqand"` deb yozdi. Keyin faqat bitta qatordan - `print(city)` dan iborat `greet.py` skriptini saqlab, terminalda işga tuşirdi:

```text
Traceback (most recent call last):
  File "/Users/ali/python-course/greet.py", line 1, in <module>
    print(city)
          ^^^^
NameError: name 'city' is not defined
```

REPL `city` ni bilgan bölsa, nega skript xato beradi? Skriptni `Samarqand` çop etadigan qilib tuzating.

::: details Yeçim
```python
city = "Samarqand"
print(city)
```

```text
Samarqand
```

REPL va skript - Pythonning alohida işga tuşirişlari. REPL da yaratilgan özgaruvçi faqat şu REPL dan çiqqungaça yaşaydi. Skript böş holatdan boşlaydi, şuning uçun u işlatadigan har bir özgaruvçini özi yaratişi kerak. Bu sahifalardagi har bir **▶ Run** uçun ham şunday.
:::

## Xulosa

- **REPL** (`>>>`) bir vaqtda bitta qatorni bajaradi va qiymatlarni avtomatik körsatadi. Tajribalar uçun juda qulay, lekin heç narsa saqlanmaydi.
- **Skript** - `python file.py` bilan yuqoridan pastga bajariladigan `.py` fayl. U faqat `print()` qilgan narsangizni körsatadi.
- Terminal **joriy papka** içida işlaydi. Python faylingizni aynan şu yerdan qidiradi.
- Muharrirlar faylingizni siz uçun işga tuşiradi, şuning uçun **avval saqlaşni** unutmang.
- Har bir işga tuşiriş böş holatdan boşlanadi: skript REPL dagi özgaruvçilarni körmaydi. Fayllaringizga `random.py` kabi standart modul nomlarini bermang.

## Qöşimça manbalar

- [Python Tutorial - Using the Python Interpreter](https://docs.python.org/3/tutorial/interpreter.html)
- [Command line and environment](https://docs.python.org/3/using/cmdline.html)
- [Getting started with Python in VS Code](https://code.visualstudio.com/docs/python/python-tutorial)
