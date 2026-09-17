---
title: Fayllar va pathlib
description: "open() va with yordamida matnli fayllarni xavfsiz öqiş va yoziş, fayl rejimlari, yangi qatorlar va kodirovkalarni tuşuniş hamda pathlib.Path bilan yöllar, papkalar va fayl nomlari ustida işlaş."
---

# Fayllar va pathlib

![Rasm: Fayllar va pathlib](/images/topics-webp-uzb/files-and-pathlib.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Matnli fayllarni `open()` bilan, har doim `with` içida va `encoding="utf-8"` bilan yoziş va öqiş
- `"r"`, `"w"`, `"a"`, `"x"` va `"b"` fayl rejimlari hamda yangi qatorlar bilan nima sodir bölişi
- `pathlib.Path` bilan yöllar yasaş, papkalar yaratiş va fayllar röyxatini oliş
- Fayllarni qayta nomlaş, öçiriş va nusxalaş
- Matn qanday baytlarga aylanadi va nega notöğri kodirovka `UnicodeDecodeError` beradi
:::

## Nega bu muhim

Dasturlaringiz hozirgaça yaratgan hamma narsa dastur tugaşi bilan yöqoladi: vazifalar röyxati, eng yuqori ball, kunlik savdo. **Fayllar** maʼlumotlarning dasturdan keyin ham yaşaşiga imkon beradi va dasturlar hisobotlar, loglar va bank köçirmalarini aynan ular orqali almaşadi.

::: info Bu saytdagi fayllar
Bu saytdagi kod brauzer yorliğingiz içidagi vaqtinçalik fayl tizimida işlaydi. Siz yaratgan fayllar sahifani qayta yuklaguningizça yoki Töxtatiş tugmasini bosguningizça işga tuşirişlar orasida saqlanib qoladi. Öz kompyuteringizda esa fayllar diskka saqlanadi.
:::

## Matnli faylga yoziş

```python
with open("shopping.txt", "w", encoding="utf-8") as file:
    file.write("çoy\n")
    file.write("şakar\n")
    file.write("non\n")

print("Saqlandi")
```

```text
Saqlandi
```

Qisma-qism:

- `"w"` faylni **yoziş** uçun oçadi: yöq fayl yaratiladi, mavjud fayl esa **öçirib yuboriladi**.
- `encoding="utf-8"` belgilar baytlarga qanday aylanişini aytadi. Uni har doim bering (nega ekanini pastdagi kodirovkalar bölimi körsatadi).
- `with ... as file:` blok tugaganda, hatto xatodan keyin ham, **faylni avtomatik yopadi** (qanday qilib - *with operatori* darsida).
- `write()` yangi qator **qöşmaydi**, şuning uçun `"\n"` ni özingiz qöşing yoki uni siz uçun qöşadigan `print(..., file=file)` ni işlating.
- Matn rejimida sizga faqat `"\n"` kerak. Windows da Python uni diskka `\r\n` sifatida yozadi va öqişda yana `"\n"` ga aylantiradi, şuning uçun kodingiz hamma joyda bir xil işlaydi.

## Matnli faylni öqiş

`read()` butun faylni bitta satr sifatida qaytaradi. Fayl obyekti `for` siklida ham işlaydi va har safar bitta qatorni `\n` bilan **birga** beradi:

```python
with open("scores.txt", "w", encoding="utf-8") as file:
    file.write("Aziza,92\nBekzod,78\n\nDilnoza,85\n")

with open("scores.txt", encoding="utf-8") as file:
    print(repr(file.read()))

total = 0
with open("scores.txt", encoding="utf-8") as file:
    for line in file:
        line = line.strip()
        if not line:              # böş qatorlarni ötkazib yuboramiz
            continue
        name, score = line.split(",")
        total += int(score)

print(f"Jami: {total}")
```

```text
'Aziza,92\nBekzod,78\n\nDilnoza,85\n'
Jami: 255
```

Rejim berilmasa, `open()` öqiydi. `strip()` yangi qatorni olib taşlaydi; sikl katta faylni bir yöla xotiraga yuklamaydi. Kiçik fayl uçun `file.read().splitlines()` `\n` siz qatorlar röyxatini beradi.

## Fayl rejimlari

| Rejim | Maʼnosi | Fayl mavjud bölsa | Fayl mavjud bölmasa |
|---|---|---|---|
| `"r"` | öqiş (standart) | öqiydi | `FileNotFoundError` |
| `"w"` | yoziş | avval uni **öçiradi** | yaratadi |
| `"a"` | qöşiş | oxiriga qöşadi | yaratadi |
| `"x"` | faqat yaratiş | `FileExistsError` | yaratadi |
| `"b"` | ikkilik, boşqa rejimga qöşiladi: `"rb"`, `"wb"` | | |

`"a"` loglar uçun mos. `"x"` faylni qayta yozilişdan himoya qiladi:

```python
with open("visits.log", "w", encoding="utf-8") as log:
    log.write("Aziza tizimga kirdi\n")
with open("visits.log", "a", encoding="utf-8") as log:
    log.write("Bekzod tizimga kirdi\n")

try:
    with open("visits.log", "x", encoding="utf-8") as log:
        log.write("Yangi log\n")
except FileExistsError:
    print("visits.log allaqaçon bor, uni qayta yozmaymiz")

with open("visits.log", encoding="utf-8") as log:
    print(log.read(), end="")
```

```text
visits.log allaqaçon bor, uni qayta yozmaymiz
Aziza tizimga kirdi
Bekzod tizimga kirdi
```

Rasmlar, PDF va zip fayllar matn emas. Ularni `encoding` siz **ikkilik** rejimda (`"rb"`, `"wb"`) oçing: siz `bytes` öqiysiz va yozasiz, yangi qatorlar esa özgartirilmaydi.

## Yöq fayllar

Mavjud bölmagan faylni öqiş `FileNotFoundError` beradi. Uni uşlang va nima maʼqul ekanini hal qiling, masalan maʼlumotsiz boşlaş:

```python
def load_notes(filename):
    try:
        with open(filename, encoding="utf-8") as file:
            return file.read().splitlines()
    except FileNotFoundError:
        print(f"{filename} topilmadi, qaydlarsiz boşlaymiz")
        return []

print(load_notes("no_such_notes.txt"))
```

```text
no_such_notes.txt topilmadi, qaydlarsiz boşlaymiz
[]
```

## `pathlib` bilan yöllar

**Yöl** (path) fayl qayerda ekanini aytadi. Satrlar bilan macOS va Linux dagi `/` va Windows dagi `\` haqida qayğuriş kerak bölardi; `pathlib.Path` obyektlari buni özi hal qiladi. Qismlarni `/` bilan ulang:

```python
from pathlib import Path

report = Path("data") / "reports" / "sales_2026.txt"

print(report)
print(report.name, report.stem, report.suffix)
print(report.parent)
print(report.with_suffix(".csv"))
```

```text
data/reports/sales_2026.txt
sales_2026.txt sales_2026 .txt
data/reports
data/reports/sales_2026.csv
```

Windows da `print(report)` teskari çiziqlarni körsatadi; kodingiz esa özgarmaydi.

### Tekşiriş, yaratiş va röyxatini oliş

```python
from pathlib import Path

folder = Path("homework") / "9A"
print(folder.exists())
folder.mkdir(parents=True, exist_ok=True)

for name in ["aziza.txt", "bekzod.txt", "notes.md"]:
    (folder / name).write_text("...", encoding="utf-8")

print(folder.is_dir(), sorted(p.name for p in folder.iterdir()))
print(sorted(p.name for p in folder.glob("*.txt")))
```

```text
False
True ['aziza.txt', 'bekzod.txt', 'notes.md']
['aziza.txt', 'bekzod.txt']
```

- `parents=True` yöq ota papka `homework` ni ham yaratadi; `exist_ok=True` esa "allaqaçon bölsa, xato bermasin" degani. Ikkinçi işga tuşirişda birinçi qator `True` ni çiqaradi va `mkdir` baribir muvaffaqiyatli bajariladi.
- `write_text()` va `read_text()` bitta qadamda oçadi, yozadi yoki öqiydi va yopadi; `Path.open()` esa `open()` kabi işlaydi.
- `iterdir()` papkadagi hamma narsani röyxatlaydi; `glob("*.txt")` faqat mos nomlarni beradi (`rglob` içki papkalarni ham qidiradi). Ularning tartibi tizimga boğliq, şuning uçun ularni `sorted()` ga örang.

::: info Eski koddagi `os.path`
`pathlib` dan oldin Python kodi `os.path` modulidan foydalangan va uni hali ham uçratasiz: `os.path.join("data", "a.txt")` - bu `Path("data") / "a.txt"`, `os.path.exists(p)` - `Path(p).exists()`, `os.path.basename(p)` esa `Path(p).name`.
:::

### Qayta nomlaş, öçiriş va nusxalaş

```python
import shutil
from pathlib import Path

draft = Path("draft.txt")
draft.write_text("Savdo hisoboti\n", encoding="utf-8")

shutil.copy(draft, "backup.txt")            # nusxa: ikkala fayl ham bor
final = draft.replace("report.txt")         # qayta nomlaş: draft.txt yöq böldi
print(final, draft.exists(), Path("backup.txt").exists())

Path("backup.txt").unlink()                 # öçiriş
Path("backup.txt").unlink(missing_ok=True)  # allaqaçon yöq: xato yöq
print(Path("backup.txt").exists())
```

```text
report.txt False True
False
```

`replace()` faylni qayta nomlaydi yoki köçiradi va nişon fayl mavjud bölsa, uni qayta yozadi. (`rename()` Linux va macOS da xuddi şunday işlaydi, lekin Windows da `FileExistsError` beradi.) `unlink()` faylni öçiradi: savat yöq, fayl butunlay yöqoladi. `shutil.copy()` fayl mazmunini nusxalaydi.

## Kodirovkalar: `str` va `bytes`

*Satrlar* darsida matn kodirovka orqali **baytlarga** aylanişini körgansiz. Fayllar baytlarni saqlaydi, şuning uçun har bir matnli fayl qandaydir kodirovkada yozilgan. `read_bytes()` xom baytlarni körsatadi, `.decode()` esa baytlarni yana matnga aylantiradi:

```python
from pathlib import Path

data = "Oʻzbekiston".encode("utf-8")
print(len("Oʻzbekiston"), len(data), data.decode("utf-8"))

old = Path("old_export.txt")
old.write_bytes("Тошкент".encode("cp1251"))    # eski Windows dasturi kabi
print(old.read_bytes())

try:
    old.read_text(encoding="utf-8")
except UnicodeDecodeError as e:
    print("UnicodeDecodeError:", e)
print(old.read_text(encoding="cp1251"))
```

```text
11 12 Oʻzbekiston
b'\xd2\xee\xf8\xea\xe5\xed\xf2'
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xd2 in position 0: invalid continuation byte
Тошкент
```

Notöğri kodirovka bilan dekodlaş `UnicodeDecodeError` beradi yoki `OÊ»zbekiston` kabi buzilgan matnni körsatadi. `encoding=` berilmasa, Python kompyuterning standart kodirovkasini işlatadi, u esa tizimdan tizimga farq qiladi, şuning uçun noutbukingizda işlagan kod Windows kompyuterida xato berişi mumkin. Hamma joyda `encoding="utf-8"` bundan saqlaydi.

## Nisbiy va mutlaq yöllar

`Path("notes.txt")` kabi **nisbiy** yöl **joriy işçi papkadan**, yaʼni dastur işga tuşirilgan papkadan qidiriladi. **Mutlaq** yöl diskning ildizidan boşlanadi, masalan `C:\Users\Aziza\notes.txt`. `Path.cwd()` işçi papkani körsatadi, `path.resolve()` esa mutlaq yölni beradi. Aynan şuning uçun skript öz papkasidan `data.txt` ni öqiy oladi, lekin boşqa joydan işga tuşirilganda `FileNotFoundError` beradi.

::: tip Skript yonidagi fayllarni topiş
Skript faylida `Path(__file__).parent / "data.txt"` dastur qayerdan işga tuşirilganidan qatʼi nazar, skript yonidagi `data.txt` ni topadi.
:::

## Özingiz sinab köring

Kundalikka öz yozuvlaringizni qöşing, keyin kodni faqat maʼlum söz bor qatorlarni çiqaradigan qilib özgartiring.

<ClientOnly><PythonPlayground :code='"from pathlib import Path\n\ndiary = Path(\"diary.txt\")\ndiary.write_text(\"2026-09-01: Samarqanddagi Registonga bordim\\n\", encoding=\"utf-8\")\n\nnew_entries = [\n    \"2026-09-02: Buxoroga poyezdda bordim\",\n    \"2026-09-03: Bekzod bilan palov yedim\",\n]\nwith diary.open(\"a\", encoding=\"utf-8\") as file:\n    for entry in new_entries:\n        print(entry, file=file)\n\nwith diary.open(encoding=\"utf-8\") as file:\n    for number, line in enumerate(file, start=1):\n        print(number, line.strip())\n\nprint(\"Hajmi:\", diary.stat().st_size, \"bayt\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `"a"` örniga `"w"` bilan oçiş

```python
with open("log.txt", "w", encoding="utf-8") as f:
    f.write("birinçi yozuv\n")
with open("log.txt", "w", encoding="utf-8") as f:
    f.write("ikkinçi yozuv\n")

with open("log.txt", encoding="utf-8") as f:
    print(f.read(), end="")
```

```text
ikkinçi yozuv
```

`"w"` birinçi yozuvni öçirib yubordi. Faylga qöşiş uçun `"a"` ni işlating.

### 2. Yangi qatorni unutiş

```python
with open("names.txt", "w", encoding="utf-8") as f:
    for name in ["Aziza", "Bekzod", "Dilnoza"]:
        f.write(name)

with open("names.txt", encoding="utf-8") as f:
    print(f.read())
```

```text
AzizaBekzodDilnoza
```

`write()` aynan siz bergan narsani yozadi. `f.write(name + "\n")` yoki `print(name, file=f)` ni işlating.

### 3. Satr bölmagan narsani yoziş

```py
with open("total.txt", "w", encoding="utf-8") as f:
    f.write(125000)
```

```text
TypeError: write() argument must be str, not int
```

Avval özgartiring: `f.write(f"{total}\n")`.

## Maşqlar

### 1. Yozing va sanang <Difficulty level="1" />

Beşta iş kunini `days.txt` ga har birini alohida qatorga yozing, keyin faylni qayta öqib, qatorlar sonini çop eting.

::: details Yeçim
```python
days = ["Duşanba", "Seşanba", "Çorşanba", "Payşanba", "Juma"]

with open("days.txt", "w", encoding="utf-8") as file:
    for day in days:
        file.write(day + "\n")

with open("days.txt", encoding="utf-8") as file:
    lines = file.read().splitlines()

print(len(lines))
```

```text
5
```
:::

### 2. Harorat jurnali <Difficulty level="1" />

`31`, `34`, `29`, `36`, `33` qatorlari bilan `temps.txt` yarating (iyuldagi Toşkent). Uni qatorma-qator öqing va örtaça hamda eng yuqori haroratni çop eting.

::: details Yeçim
```python
with open("temps.txt", "w", encoding="utf-8") as file:
    file.write("31\n34\n29\n36\n33\n")

temps = []
with open("temps.txt", encoding="utf-8") as file:
    for line in file:
        temps.append(int(line))

print(f"Örtaça: {sum(temps) / len(temps):.1f}")
print(f"Eng yuqori: {max(temps)}")
```

```text
Örtaça: 32.6
Eng yuqori: 36
```
:::

### 3. Kengaytma böyiça tartiblaş <Difficulty level="2" />

`cv.pdf`, `photo1.jpg`, `photo2.jpg`, `notes.txt` va `budget.pdf` fayllari bilan `downloads` papkasini yarating (mazmuni muhim emas). Keyin har bir kengaytmani fayl nomlarining saralangan röyxatiga böğlaydigan luğat tuzib, çop eting: `{'.jpg': [...], '.pdf': [...], '.txt': [...]}`.

::: details Yeçim
```python
from pathlib import Path

downloads = Path("downloads")
downloads.mkdir(exist_ok=True)
for name in ["cv.pdf", "photo1.jpg", "photo2.jpg", "notes.txt", "budget.pdf"]:
    (downloads / name).write_text("", encoding="utf-8")

by_extension = {}
for path in sorted(downloads.iterdir()):
    if path.is_file():
        by_extension.setdefault(path.suffix, []).append(path.name)

print(dict(sorted(by_extension.items())))
```

```text
{'.jpg': ['photo1.jpg', 'photo2.jpg'], '.pdf': ['budget.pdf', 'cv.pdf'], '.txt': ['notes.txt']}
```
:::

### 4. Xavfsiz qator sanağiç <Difficulty level="2" />

Matnli fayldagi böş bölmagan qatorlar sonini qaytaradigan yoki fayl mavjud bölmasa `None` qaytaradigan `count_lines(path)` funksiyasini yozing. Uni özingiz yaratgan faylda va `"missing.txt"` da sinab köring.

::: details Yeçim
```python
from pathlib import Path

def count_lines(path):
    try:
        text = Path(path).read_text(encoding="utf-8")
    except FileNotFoundError:
        return None
    return sum(1 for line in text.splitlines() if line.strip())

Path("poem.txt").write_text("Birinçi qator\n\nIkkinçi qator\nUçinçi qator\n", encoding="utf-8")
print(count_lines("poem.txt"))
print(count_lines("missing.txt"))
```

```text
3
None
```
:::

### 5. Öquvçilar hisobot fayllari <Difficulty level="3" />

`grades = {"Aziza": [90, 85, 97], "Bekzod": [72, 64, 80]}` uçun `reports/9A` papkasini yarating va har bir öquvçi uçun `aziza.txt` kabi, oxirgi qatori `Örtaça: 90.67` bölgan bitta fayl yozing. Keyin **faqat fayllardan** foydalanib, örtaçasi eng yuqori bölgan fayl nomini çop eting.

::: details Yeçim
```python
from pathlib import Path

grades = {"Aziza": [90, 85, 97], "Bekzod": [72, 64, 80]}

folder = Path("reports") / "9A"
folder.mkdir(parents=True, exist_ok=True)

for name, scores in grades.items():
    with (folder / f"{name.lower()}.txt").open("w", encoding="utf-8") as file:
        print(f"Öquvçi: {name}", file=file)
        print(f"Örtaça: {sum(scores) / len(scores):.2f}", file=file)

best_file, best_average = None, -1.0
for path in sorted(folder.glob("*.txt")):
    last_line = path.read_text(encoding="utf-8").splitlines()[-1]
    average = float(last_line.split(":")[1])
    if average > best_average:
        best_file, best_average = path.name, average

print(best_file, best_average)
```

```text
aziza.txt 90.67
```
:::

## Xulosa

- Matnli fayllarni `with open(path, mode, encoding="utf-8") as f:` bilan oçing, şunda ular har doim yopiladi va hamma joyda bir xil öqiladi.
- Rejimlar: `"r"` öqiş, `"w"` qayta yoziş, `"a"` qöşiş, `"x"` faqat yaratiş; ikkilik fayllar uçun `"b"` qöşing.
- `for line in f` qatorlarni `\n` bilan beradi; `write()` yangi qator qöşmaydi, `print(..., file=f)` esa qöşadi.
- `Path` `/` bilan ulanadi va `.name`, `.suffix`, `exists()`, `mkdir()`, `read_text()`, `glob()`, `replace()` hamda `unlink()` ga ega.
- Matn baytlar sifatida saqlanadi: notöğri kodirovka `UnicodeDecodeError` beradi. Nisbiy yöllar işçi papkadan boşlanadi.

## Qöşimça manbalar

- [Python Tutorial: Reading and Writing Files](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)
- [`pathlib`: object-oriented filesystem paths](https://docs.python.org/3/library/pathlib.html)
- [Built-in function `open()`](https://docs.python.org/3/library/functions.html#open)
