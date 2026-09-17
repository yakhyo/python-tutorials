---
title: Pythonni örnatiş
description: "Python 3 ni Windows, macOS yoki Linux ga örnating, işlayotganini tekşiring va kod muharririni tanlang."
---

# Pythonni örnatiş

![Rasm: Pythonni örnatiş](/images/topics-webp-uzb/install-and-setup.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Hozirning özida biror narsa örnatiş kerakmi
- Pythonni **Windows**, **macOS** yoki **Linux** ga qanday örnatiş
- Qaysi versiya örnatilganini qanday tekşiriş
- Pythonning interaktiv taklif matnini (prompt) qanday oçiş va undan qanday çiqiş
- Qaysi kod muharririni tanlaş
:::

## Nega bu muhim

Bu sahifalardagi muharrir örganiş uçun juda qulay, lekin haqiqiy dasturlar kompyuteringizdagi fayllarda yaşaydi. Ular jadvallaringizni öqiydi, suratlaringizni qayta nomlaydi va brauzerni yopganingizdan keyin ham uzoq işlaydi. Buning uçun örnatilgan Python va kod yozadigan muharrir kerak.

### Pythonni hozirning özida örnatiş kerakmi?

**Hozirça yöq.** Dastlabki darslardagi har bir misol brauzeringizda, dars sahifasining özida yoki [Laboratoriya](/uz/laboratoriya) da işlaydi. Bu darsni hozirça ötkazib yuborib, keyinroq qaytişingiz mumkin.

Pythonni kompyuteringizga quyidagi hollarda örnating:

- kompyuteringizda fayl sifatida saqlanadigan dasturlar yozmoqçi bölsangiz,
- haqiqiy fayllar va papkalar bilan işlamoqçi bölsangiz,
- bir neçta soniyadan uzoq işlaydigan dasturlarni işga tuşirmoqçi bölsangiz,
- keyingi darslarni öz muharriringizda bajarmoqçi bölsangiz.

## Qaysi versiya?

[python.org](https://www.python.org/downloads/) saytidan **Python 3 ning eng songgi versiyasini** örnating. Bu darslik **Python 3.14** ga möljallangan. Deyarli barça misollar 3.10 va undan yangi versiyalarda ham işlaydi, şuning uçun kompyuteringizda allaqaçon bor bölgan biroz eskiroq Python bilan boşlasangiz ham böladi.

::: warning Python 2 emas
Bu darslik uçun heç qaçon Python 2 ni örnatmang. U 2020-yildan beri qöllab-quvvatlanmaydi.
:::

## Windows

Windows da endi **Python Install Manager** deb ataladigan rasmiy vosita bor. U Pythonni örnatadi va yangilab turadi.

1. **Python Install Manager** ni quyidagi ikki usuldan biri bilan örnating:
   - **Microsoft Store** ni oçing, **Python Install Manager** ni qidiring va **Install** tugmasini bosing yoki
   - uni [python.org/downloads](https://www.python.org/downloads/) dan yuklab oling va işga tuşiring.
2. Start menyusidan **Terminal** (yoki **PowerShell**) ni oçing.
3. Pythonning eng songgi versiyasini örnating:

   ```text
   py install 3.14
   ```

4. U papkani **PATH** ga (Windows buyruqlarni qidiradigan papkalar röyxatiga) qöşiş-qöşmaslikni söraşi mumkin. Bu ixtiyoriy. `python` va `py` buyruqlari Windows ning **app execution aliases** (buyruqlarning ilovaga boğlangan qisqa nomlari) orqali allaqaçon işlaydi. **Ha** desangiz, `%LocalAppData%\Python\bin` qöşiladi va `python3.14` kabi versiyali buyruqlar ham paydo böladi.
5. Işlaganini tekşiring:

   ```text
   python --version
   ```

   `Python 3.14.7` ga öxşaş natijani körişingiz kerak. Oxirgi raqam har bir tuzatiş relizi bilan özgarib turadi.

Foydali buyruqlar:

| Buyruq | Nima qiladi |
|---|---|
| `py list` | Örnatilgan Python versiyalarini körsatadi |
| `py install 3.14` | Versiyani örnatadi |
| `py` yoki `python` | Standart Pythonni işga tuşiradi |
| `py help` | Barça buyruqlarni körsatadi |

::: details Eskiroq ".exe" örnatuvçi
Klassik `python-3.x.x-amd64.exe` örnatuvçisidan foydalanadigan qöllanmalarni uçratişingiz mumkin. Unda **"Add python.exe to PATH"** belgisini qöyiş şart. U 3.14 uçun hali ham işlaydi, lekin eskirgan deb belgilangan va Python 3.16 dan boşlab çiqarilmaydi. Uning örniga Install Manager dan foydalaning.
:::

## macOS

macOS da siz foydalanişingiz kerak bölgan yangi Python oldindan örnatilmagan.

1. [python.org/downloads](https://www.python.org/downloads/) ga kiring va **macOS installer** ni (`.pkg` fayl) yuklab oling. U Apple Silicon va Intel Mac larda ham işlaydi.
2. Faylni oçing va qadamlarga amal qiling.
3. Örnatiş tugagaç, Finder oynasi oçiladi. **Install Certificates.command** ustiga ikki marta bosing. Bu Pythonga xavfsiz (HTTPS) ulaniş qiliş imkonini beradi.
4. **Terminal** ni oçing (⌘ + Space ni bosib, *Terminal* deb yozing) va tekşiring:

   ```text
   python3 --version
   ```

macOS da buyruq `python` emas, **`python3`**. Darsda `python` deyilganda, `python3` deb yozing.

::: details Homebrew dan foydalaniş
Agar [Homebrew](https://brew.sh) dan allaqaçon foydalansangiz, `brew install python` ham işlaydi. Homebrew nima ekanini bilmasangiz, python.org örnatuvçisidan foydalaning.
:::

## Linux

Aksariyat Linux tizimlarida Python 3 allaqaçon bor. Terminalni oçing va tekşiring:

```text
python3 --version
```

Agar u yöq bölsa, paketlar menejeri orqali örnating:

| Distributiv | Buyruq |
|---|---|
| Ubuntu, Debian, Mint | `sudo apt install python3` |
| Fedora | `sudo dnf install python3` |
| Arch | `sudo pacman -S python` |

Distributivingizdagi versiya 3.14 dan biroz eskiroq bölişi mumkin. Örganiş uçun bu muammo emas. Tizimdagi Pythonni öçirmang va almaştirmang, çunki operatsion tizimning ayrim qismlari unga boğliq.

## Işlayotganini tekşiring: interaktiv taklif matni

Heç narsa qöşmasdan `python` (Windows) yoki `python3` (macOS va Linux) deb yozing va Enter ni bosing:

```text
Python 3.14.7 (main, ...) on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

`>>>` - bu **interaktiv taklif matni**, uni **REPL** ham deyişadi. Bitta qator Python kodini yozasiz, Enter ni bosasiz va natijani darhol körasiz. Sinab köring:

```text
>>> 2 + 3
5
>>> print("Işlayapti!")
Işlayapti!
```

Çiqiş uçun `exit` deb yozib, Enter ni bosing (Python 3.12 va undan eski versiyalarda `exit()` deb yozing) yoki **Ctrl + D** (macOS va Linux) yoki **Ctrl + Z, keyin Enter** (Windows) ni bosing.

REPL dan foydalanişni va `.py` fayllarni işga tuşirişni keyingi darsda örganasiz.

## Kod muharririni tanlaş

Python kodini istalgan oddiy matn muharririda yoziş mumkin. Lekin kod muharriri kodingizni ranglarga böyaydi, xatolarni erta ilğaydi va dasturlarni bir marta bosiş bilan işga tuşiradi.

| Muharrir | Kimga mos | Izoh |
|---|---|---|
| **[Visual Studio Code](https://code.visualstudio.com/)** | Aksariyat örganuvçilarga | Bepul. Microsoft ning **Python** kengaytmasini örnating. Eng köp işlatiladigan tanlov. |
| **[Thonny](https://thonny.org/)** | Mutlaq yangi boşlovçilarga | Bepul va juda sodda, içida qadamma-qadam xatolarni tuzatiş vositasi bor. Python bilan birga kelişi mumkin. |
| **IDLE** | Qöşimça heç narsasiz tez boşlaş uçun | python.org dagi Python bilan birga keladi. Oddiy, lekin darhol işlaydi. |
| **[PyCharm](https://www.jetbrains.com/pycharm/)** | Keyinroq kattaroq loyihalar uçun | Kuçli, lekin örganadigan narsasi köproq. |

**Tavsiya:** ikkilansangiz, Python kengaytmasi bilan **VS Code** dan foydalaning. Agar u juda murakkab tuyulsa, **Thonny** dan boşlang.

::: tip VS Code: tögri Pythonni tanlang
Kompyuteringizda birdan ortiq Python bölsa, VS Code faylingizni notögri versiya bilan işga tuşirişi mumkin. Buyruqlar palitrasini oçing (**Ctrl + Shift + P**, macOS da **⌘ + Shift + P**), **Python: Select Interpreter** ni işga tuşiring va örnatgan versiyangizni tanlang. `.py` fayl oçiq bölganda tanlangan versiya pastki öng burçakdagi holat panelida körinadi. Uni yana özgartiriş uçun ustiga bosing.
:::

## Qaysi Python işlayapti?

Bu qisqa dastur özini işga tuşirayotgan Pythonning versiyasi va joylaşuvini çiqaradi. Uni sahifada sinab köring, keyin kompyuteringizga fayl qilib saqlang va u yerda ham işga tuşiring:

```python
import sys

print("Versiya:", sys.version.split()[0])
print("Joylaşuv:", sys.executable)
```

Sahifada brauzer içidagi Python (Pyodide) versiyasini körasiz. Kompyuteringizda esa örnatilgan versiyangizni va u diskda qayerda turganini körasiz.

## Köp uçraydigan xatolar

### 1. "python is not recognized" yoki Store oçiladi (Windows)

```text
'python' is not recognized as an internal or external command,
operable program or batch file.
```

Windows `python` buyruğini topa olmayapti. Baʼzi kompyuterlarda `python` deb yozganda Microsoft Store oçiladi, çunki Windows da vaqtinçalik yorliqlar bor. **Tuzatiş:**
- **Python Install Manager** ni örnatganingizga işonç hosil qiling (yuqoriga qarang).
- Start → **Manage app execution aliases** ni oçib, **Python (default)** alias lari yoqilganini tekşiring. Yoqilgan bölsa, yangilaş uçun ularni öçirib qayta yoqing. Store baribir oçilsa, *App Installer* ga tegişli **python.exe** va **python3.exe** yozuvlarini öçiring.
- Terminalni yopib, qayta oçing. Özgarişlar faqat yangi oynalarga taʼsir qiladi.
- Baribir işlamayaptimi? PATH da `%UserProfile%\AppData\Local\Microsoft\WindowsApps` borligini tekşiring. Windows uni sukut böyiça qöşadi, olib taşlansa alias lar işlamay qoladi.

### 2. `command not found: python` (macOS yoki Linux)

```text
% python --version
zsh: command not found: python
```

Linux da qobiq odatda `bash: python: command not found` deydi. **Tuzatiş:** **`python3`** dan foydalaning. Bu tizimlarda `python` köpinça umuman yöq yoki u eski Python 2 böladi.

### 3. Terminal buyruqlarini Python içida yoziş

```py
>>> python hello.py
```

```text
SyntaxError: invalid syntax
```

`>>>` taklif matnida siz Python **içidasiz**, `python hello.py` esa Python kodi emas. **Tuzatiş:** `exit` bilan çiqing, keyin buyruqni oddiy terminalda işga tuşiring. Taklif matni qayerda ekaningizni aytib turadi:

| Taklif matni | Siz qayerdasiz… | Nima yoziladi |
|---|---|---|
| `>>>` | Python (REPL) | Python kodi, masalan, `print("salom")` |
| `$`, `%` yoki `PS C:\>` | Terminal / shell | Buyruqlar, masalan, `python hello.py` |

## Maşqlar

### 1. Versiyangizni tekşiring <Difficulty level="1" />

Pythonni örnating (yoki bor bölganini toping) va versiya buyruğini işga tuşiring. Aniq versiya raqamini yozib oling.

::: details Yeçim
- **Windows:** `python --version` (yoki `py --version`)
- **macOS / Linux:** `python3 --version`

Natija `Python 3.14.7` ga öxşaydi. Birinçi ikki raqam (`3.14`) - muhim bölgan versiya.
:::

### 2. REPL kalkulyator <Difficulty level="1" />

Interaktiv taklif matnini oçing va u yordamida hisoblang:
1. `365 * 24` (bir yildagi soatlar)
2. `2 ** 10` (`**` "darajaga oşiriş" degani)

Keyin taklif matnidan çiqing.

::: details Yeçim
```text
>>> 365 * 24
8760
>>> 2 ** 10
1024
>>> exit
```

REPL da natijani köriş uçun `print()` kerak emas. U har bir ifodaning qiymatini avtomatik körsatadi. Bu faqat REPL da sodir böladi, `.py` fayllarda emas.
:::

### 3. Qayerdasiz? <Difficulty level="2" />

Har bir qatorni **terminal taklif matnida** yoki **Pythonning `>>>` taklif matnida** yoziş kerakligini aniqlang:

1. `python3 --version`
2. `print("hello")`
3. `py list`
4. `10 / 4`

::: details Yeçim
1. Terminal: u `python3` dasturini işga tuşiradi.
2. Python: bu Python kodi.
3. Terminal: bu Python Install Manager buyruği (Windows).
4. Python: bu Python ifodasi, natijasi `2.5`.
:::

### 4. Ikki xil Python <Difficulty level="2" />

Şu sahifadagi **Qaysi Python işlayapti?** dasturini işga tuşiring, keyin uni kompyuteringizga `which_python.py` nomi bilan saqlang va `python which_python.py` (yoki `python3 which_python.py`) bilan işga tuşiring. Ikki natijani soliştiring. Nega ular har xil?

::: details Yeçim
Brauzerdagi versiya **Pyodide** da işlaydi, şuning uçun uning joylaşuvi brauzer içidagi virtual yöl böladi. Kompyuteringizda esa siz örnatgan Python işlaydi, şuning uçun joylaşuv haqiqiy papka böladi, masalan, `C:\Users\you\AppData\Local\Python\...` yoki `/Library/Frameworks/Python.framework/...`. Versiya raqamlari ham farq qilişi mumkin. Bir neçta Python yonma-yon örnatilgan bölişi mumkin, `sys.executable` esa kodingizni aynan qaysi biri işga tuşirayotganini aytadi.
:::

### 5. Seansni tuzating <Difficulty level="2" />

Mac dagi bir örganuvçi quyidagi qatorlarni yozdi va ikkita xato oldi. Har bir xato uçun nima notögri bölganini va uning örniga nima yoziş kerakligini ayting.

```text
% python --version
zsh: command not found: python
% python3
>>> python3 hello.py
SyntaxError: invalid syntax
```

::: details Yeçim
1. macOS da buyruq `python3`, şuning uçun `python3 --version` deb yoziş kerak.
2. `python3` işladi va REPL ni oçdi. Keyin `python3 hello.py` `>>>` taklif matnida yozildi, u yerda esa faqat Python kodi işlaydi. `exit` bilan çiqing, keyin `python3 hello.py` ni `%` terminal taklif matnida yozing.

Qator boşidagi taklif matni (`%` yoki `>>>`) terminalda yoki Python içida ekaningizni aytib turadi.
:::

## Xulosa

- Dastlabki darslar brauzerda işlaydi, şuning uçun Pythonni öz kompyuteringizdagi fayllar bilan işlamoqçi bölganingizda örnating.
- **Windows:** Python Install Manager → `py install 3.14` → `python --version` bilan tekşiring.
- **macOS:** python.org örnatuvçisi → `python3 --version` bilan tekşiring.
- **Linux:** odatda allaqaçon örnatilgan → `python3 --version`. Tizimdagi Pythonni almaştirmang.
- `>>>` Python içida ekaningizni bildiradi. `exit` bilan çiqing.
- Muharrir tanlang: Python kengaytmasi bilan **VS Code** yoki yumşoqroq boşlaş uçun **Thonny**.

## Qöşimça manbalar

- [Python downloads](https://www.python.org/downloads/)
- [Using Python on Windows](https://docs.python.org/3/using/windows.html)
- [Using Python on macOS](https://docs.python.org/3/using/mac.html)
- [Using Python on Unix platforms](https://docs.python.org/3/using/unix.html)
- [Python in Visual Studio Code](https://code.visualstudio.com/docs/python/python-tutorial)
