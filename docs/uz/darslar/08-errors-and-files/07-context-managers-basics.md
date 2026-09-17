---
title: with operatori
description: "with nima qilişi va nega muhimligini tuşuniş: xato yuz berganda ham avtomatik tozalaş, bir vaqtda bir neçta kontekst menejeri hamda TemporaryDirectory va suppress kabi foydali tayyor menejerlar."
---

# with operatori

![Rasm: with operatori](/images/topics-webp-uzb/context-managers-basics.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Nega faylni yopiş kabi tozalaş kodi biror narsa notöğri ketganda ham bajarilişi kerak
- `with` siz nima sodir böladi va `try`/`finally` xuddi şu işni qanday bajaradi
- Bitta `with` operatorida bir neçta kontekst menejerini qanday işlatiş
- Ikkita foydali tayyor kontekst menejeri: `tempfile.TemporaryDirectory` va `contextlib.suppress`
:::

## Nega bu muhim

Köp vazifalar juft bölib keladi: faylni **oçiş** va **yopiş**, vaqtinçalik papkani **yaratiş** va **öçiriş**, sozlamani **özgartiriş** va **qaytariş**. Ikkinçi yarmini unutiş oson, xato kodingizning örtasidan otilib çiqsa, u umuman ötkazib yuboriladi. Yopilmagan fayl diskka heç qaçon yozilmagan maʼlumotlarni yöqotişi mumkin. `with` operatori ikkinçi yarmi har doim bajarilişini kafolatlaydi. Siz undan *Fayllar va pathlib* darsidan beri foydalanasiz; endi u aslida nima qilişini körasiz.

## `with` siz hayot

Mana faylni qöl bilan boşqariş, örtada xato bilan:

```python
file = open("orders.txt", "w", encoding="utf-8")
try:
    file.write("1-buyurtma: çoy\n")
    quantity = int("uç")             # örtada xato
    file.close()                     # bu yerga yetib kelinmaydi
except ValueError:
    print("Nimadir notöğri ketdi")

print("Yopildimi?", file.closed)
```

```text
Nimadir notöğri ketdi
Yopildimi? False
```

Fayl hali ham oçiq. Yozgan matningiz köpinça xotiradagi **buferda** saqlanadi va faqat fayl yopilganda diskka yoziladi, şuning uçun bu yerdagi yiqiliş böş yoki çala faylni qoldirişi mumkin.

Töğri qöl variant *Istisnolarni qayta işlaş* darsida tanişgan `finally` dan foydalanadi:

```python
file = open("orders.txt", "w", encoding="utf-8")
try:
    file.write("1-buyurtma: çoy\n")
    file.write("2-buyurtma: somsa\n")
finally:
    file.close()                     # nima bölsa ham bajariladi

print("Yopildimi?", file.closed)
```

```text
Yopildimi? True
```

Bu töğri, lekin har safar qöşimça qatorlar talab qiladi va xato qiliş oson.

## `with` nima qiladi

`with` yuqoridagi `try`/`finally` bilan aynan bir xil işni bajaradi. `with` dan keyingi obyekt - **kontekst menejeri** (context manager): biror narsani qanday tayyorlaş va qanday tozalaşni biladigan obyekt.

```text
with open(...) as file:        1. tayyorlaş: faylni oçib, uni "file" deb nomlaş
    ...blok...                 2. sizning kodingiz bajariladi
                               3. tozalaş: faylni yopiş
                                  (blok xato bersa, return qilsa
                                   yoki sikldan break bilan çiqsa ham)
```

Tozalaş blok içida **istisno çaqirilsa ham** bajariladi. Istisno keyin davom etadi, şuning uçun uni uşlaşingiz mumkin:

```python
try:
    with open("report.txt", "w", encoding="utf-8") as file:
        file.write("Savdo hisoboti\n")
        total = 125000 / 0
except ZeroDivisionError:
    print("Hisoblaş muvaffaqiyatsiz")

print("Yopildimi?", file.closed)

with open("report.txt", encoding="utf-8") as file:
    print("Saqlangan matn:", file.read().strip())
```

```text
Hisoblaş muvaffaqiyatsiz
Yopildimi? True
Saqlangan matn: Savdo hisoboti
```

Fayl töğri yopildi va xatodan oldin yozilgan qator saqlandi. `file` özgaruvçisi blokdan keyin ham mavjud; endi u şunçaki yopiq fayl.

::: info Içkarida qanday işlaydi
Kontekst menejerida ikkita maxsus metod bor: `__enter__` blok boşida, `__exit__` esa oxirida bajariladi. Klasslar (*Klasslar va obyektlar*) va ikki pastki çiziqli metodlarni (*Obyektlarni ifodalaş va taqqoslaş*) örgangaç, bunday klassni özingiz yoza olasiz.
:::

## Bir vaqtda bir neçta kontekst menejeri

Bitta `with` vergul bilan ajratilgan bir neçta kontekst menejerini boşqara oladi. Ular çapdan önga tayyorlanadi va teskari tartibda tozalanadi. Qator uzun bölsa, ularni qavsga oling:

```python
with open("names.txt", "w", encoding="utf-8") as file:
    file.write("aziza\nbekzod\n")

with (
    open("names.txt", encoding="utf-8") as source,
    open("greetings.txt", "w", encoding="utf-8") as target,
):
    for line in source:
        print(f"Salom, {line.strip().title()}!", file=target)

with open("greetings.txt", encoding="utf-8") as file:
    print(file.read(), end="")
```

```text
Salom, Aziza!
Salom, Bekzod!
```

## Boşqa kontekst menejerlari

`with` faqat `open()` uçun emas. *Fayllar va pathlib* darsidagi `Path.open()` ham xuddi şunday işlaydi, standart kutubxonada esa yana köplari bor. Ikkitasi ayniqsa qulay.

### `tempfile.TemporaryDirectory`

Vaqtinçalik papka yaratadi va blok tugaganda uni **içidagi hamma narsa bilan öçiradi**. Qoralama işlar va testlar uçun ideal:

```python
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as folder:
    work = Path(folder)
    (work / "draft.txt").write_text("vaqtinçalik matn", encoding="utf-8")
    print("Içida:", [p.name for p in work.iterdir()])
    print("Blok davomida mavjud:", work.exists())

print("Blokdan keyin mavjud:", work.exists())
```

```text
Içida: ['draft.txt']
Blok davomida mavjud: True
Blokdan keyin mavjud: False
```

Papka nomini tizim tanlaydi va u har işga tuşirişda farq qiladi, şuning uçun bu misol faqat fayl nomlarini çop etadi.

### `contextlib.suppress`

`suppress(SomeError)` blok içida bitta aniq istisnoni eʼtiborsiz qoldiradi. Bu `try`/`except SomeError: pass` ning qisqa şakli:

```python
from contextlib import suppress
from pathlib import Path

Path("cache.txt").write_text("eski maʼlumot", encoding="utf-8")

with suppress(FileNotFoundError):
    Path("cache.txt").unlink()        # faylni öçiramiz

with suppress(FileNotFoundError):
    Path("cache.txt").unlink()        # allaqaçon yöq: xato eʼtiborsiz qoldiriladi

print("Keş tozalandi:", not Path("cache.txt").exists())
```

```text
Keş tozalandi: True
```

`Path.unlink()` faylni öçiradi. `suppress` ni faqat xatoni eʼtiborsiz qoldiriş haqiqatan töğri bölganda işlating, masalan bu yerdagidek, "fayl allaqaçon yöq" aynan siz xohlagan natija bölganda. *Istisnolarni qayta işlaş* darsida ogohlantirilganidek, xatolarni jimgina yaşiriş odatda yomon fikr.

::: details Çuqurroq: `@contextmanager` bilan özingiznikini yoziş
`contextlib` dagi `@contextmanager` **dekoratori** bilan funksiyani kontekst menejeriga aylantiriş mumkin (dekorator - funksiya ustidagi `@` qatori; u funksiyaga qöşimça imkoniyatlar beradi):

```python
from contextlib import contextmanager

@contextmanager
def section(title):
    print(f"--- {title} ---")      # tayyorlaş
    try:
        yield                       # with bloki şu yerda bajariladi
    finally:
        print(f"--- {title} tugadi ---")   # tozalaş

try:
    with section("Oylik hisobot"):
        print("Tuşum: 1,250,000 söm")
        raise ValueError("xarajatlar fayli yöq")
except ValueError as e:
    print("Xato:", e)
```

```text
--- Oylik hisobot ---
Tuşum: 1,250,000 söm
--- Oylik hisobot tugadi ---
Xato: xarajatlar fayli yöq
```

`yield` dan oldingi kod - tayyorlaş, `with` bloki `yield` da bajariladi, undan keyingi kod esa - tozalaş. `try`/`finally` blok muvaffaqiyatsiz bölganda ham tozalaş bajarilişini taʼminlaydi. `yield` *Iteratorlar va generatorlar* darsida töliq tuşuntiriladi.
:::

## Özingiz sinab köring

Fayl nomini yoki matnini özgartiring va mavjud faylni öçirib köring.

<ClientOnly><PythonPlayground :code='"import tempfile\nfrom contextlib import suppress\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as name:\n    folder = Path(name)\n    (folder / \"draft.txt\").write_text(\"Samarqand sayohati rejasi\", encoding=\"utf-8\")\n    with open(folder / \"draft.txt\", encoding=\"utf-8\") as file:\n        print(\"Öqildi:\", file.read())\n    print(\"Yopildi:\", file.closed)\n\nprint(\"Papka hali ham bormi:\", folder.exists())\n\nwith suppress(FileNotFoundError):\n    Path(\"no_such_file.txt\").unlink()\nprint(\"Öçiradigan narsa yöq, dastur esa yiqilmadi\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Faylni blokdan keyin işlatiş

```py
with open("notes.txt", "w", encoding="utf-8") as file:
    file.write("birinçi qator\n")

file.write("ikkinçi qator\n")
```

```text
ValueError: I/O operation on closed file.
```

Blok tugaşi bilan fayl yopiladi. Fayl bilan barça işni blok **içida** bajaring yoki uni qayta oçing.

### 2. `with` içidan fayl obyektini qaytariş

```py
def open_log():
    with open("app.log", "a", encoding="utf-8") as log:
        return log                 # funksiya qaytişi bilanoq yopiladi

log = open_log()
log.write("boşlandi\n")
```

```text
ValueError: I/O operation on closed file.
```

`return` blokni tugatadi, şuning uçun fayl yopiladi. Yozişni funksiya içida bajaring yoki fayl örniga maʼlumotni qaytaring.

### 3. `suppress` ni juda keng işlatiş

```python
from contextlib import suppress

# Yomon:
with suppress(Exception):
    total = 125000 / 0        # haqiqiy xato
    print("Tölov yuborildi")

print("Tayyor")
```

```text
Tayyor
```

Haqiqiy xato yaşirildi: tölov muvaffaqiyatsiz bölgani haqida heç narsa aytilmaydi. Faqat kutgan va xavfsiz eʼtiborsiz qoldiriş mumkin bölgan aniq istisnoni yaşiring.

## Maşqlar

### 1. `with` bilan qayta yozing <Difficulty level="1" />

Bu kodni `with` yordamida qayta yozing va keyin fayl yopilganini çop eting:

```python
f = open("cities.txt", "w", encoding="utf-8")
f.write("Toşkent\nSamarqand\n")
f.close()
```

::: details Yeçim
```python
with open("cities.txt", "w", encoding="utf-8") as f:
    f.write("Toşkent\nSamarqand\n")

print(f.closed)
```

```text
True
```
:::

### 2. Filtr bilan nusxalaş <Difficulty level="1" />

`ovqat 85000`, `taksi 25000`, `ovqat 40000`, `kitob 120000` qatorlari bilan `expenses.txt` yarating. Ikki faylli **bitta** `with` operatori yordamida faqat `ovqat` qatorlarini `food.txt` ga nusxalang. `food.txt` ni çop eting.

::: details Yeçim
```python
with open("expenses.txt", "w", encoding="utf-8") as f:
    f.write("ovqat 85000\ntaksi 25000\novqat 40000\nkitob 120000\n")

with open("expenses.txt", encoding="utf-8") as source, open("food.txt", "w", encoding="utf-8") as target:
    for line in source:
        if line.startswith("ovqat"):
            target.write(line)

with open("food.txt", encoding="utf-8") as f:
    print(f.read(), end="")
```

```text
ovqat 85000
ovqat 40000
```
:::

### 3. Keşni tozalaş <Difficulty level="2" />

`names` dagi har bir faylni `Path.unlink()` bilan öçiradigan, mavjud bölmagan fayllarni `suppress` bilan eʼtiborsiz qoldiradigan va haqiqatan neçta fayl öçirilganini qaytaradigan `clear_cache(names)` funksiyasini yozing. `page1.cache` va `page2.cache` ni yarating, keyin uni `["page1.cache", "page9.cache", "page2.cache"]` bilan, yana bir marta ikkita haqiqiy nom bilan çaqiring.

::: details Yeçim
```python
from contextlib import suppress
from pathlib import Path

def clear_cache(names):
    removed = 0
    for name in names:
        with suppress(FileNotFoundError):
            Path(name).unlink()
            removed += 1
    return removed

Path("page1.cache").write_text("eski", encoding="utf-8")
Path("page2.cache").write_text("eski", encoding="utf-8")

print(clear_cache(["page1.cache", "page9.cache", "page2.cache"]))
print(clear_cache(["page1.cache", "page2.cache"]))
```

```text
2
0
```

`unlink()` `suppress` bloki içida xato berganda blokning qolgan qismi (`removed += 1`) ötkazib yuboriladi, şuning uçun faqat haqiqiy öçirişlar sanaladi.
:::

### 4. Vaqtinçalik papkada işlaş <Difficulty level="2" />

`tempfile.TemporaryDirectory()` içida `120000`, `95000`, `143000` sonlarini saqlaydigan `day1.txt`, `day2.txt`, `day3.txt` nomli uçta fayl yarating. Ularni `glob` bilan qayta öqing, jamini çop eting va blokdan keyin papka hali ham bormi, çop eting.

::: details Yeçim
```python
import tempfile
from pathlib import Path

amounts = [120000, 95000, 143000]

with tempfile.TemporaryDirectory() as name:
    folder = Path(name)
    for day, amount in enumerate(amounts, start=1):
        (folder / f"day{day}.txt").write_text(str(amount), encoding="utf-8")

    total = sum(int(p.read_text(encoding="utf-8")) for p in folder.glob("day*.txt"))
    print(f"Jami: {total:,} söm")

print("Papka hali ham bormi:", folder.exists())
```

```text
Jami: 358,000 söm
Papka hali ham bormi: False
```
:::

### 5. Narx röyxatlarini birlaştiriş <Difficulty level="3" />

`toşkent.txt` (`çoy 15000`, `palov 45000`) va `buxoro.txt` (`somsa 8000`) ni yarating. `["toşkent", "samarqand", "buxoro"]` şaharlari uçun `<şahar>.txt` ning har bir qatorini `all_prices.txt` ga `Toşkent: çoy 15000` körinişida nusxalang. `samarqand.txt` yöq: uni `try`/`except` **siz**, `suppress(FileNotFoundError)` va `open()` ni bitta `with` ga qöyib, ötkazib yuboring. `all_prices.txt` ni çop eting.

::: details Yeçim
```python
from contextlib import suppress
from pathlib import Path

Path("toşkent.txt").write_text("çoy 15000\npalov 45000\n", encoding="utf-8")
Path("buxoro.txt").write_text("somsa 8000\n", encoding="utf-8")

cities = ["toşkent", "samarqand", "buxoro"]
with open("all_prices.txt", "w", encoding="utf-8") as target:
    for city in cities:
        with suppress(FileNotFoundError), open(f"{city}.txt", encoding="utf-8") as source:
            for line in source:
                target.write(f"{city.title()}: {line}")

print(Path("all_prices.txt").read_text(encoding="utf-8"), end="")
```

```text
Toşkent: çoy 15000
Toşkent: palov 45000
Buxoro: somsa 8000
```

`suppress` birinçi bölib kiritiladi, şuning uçun `samarqand.txt` uçun `open()` muvaffaqiyatsiz bölganda `FileNotFoundError` uning içida çaqiriladi va eʼtiborsiz qoldiriladi, sikl esa keyingi şaharga ötadi.
:::

## Xulosa

- `with` blok boşida tayyorlaşni, oxirida esa tozalaşni bajaradi, **xato yuz berganda ham**.
- `with` siz xavfsiz bölişi uçun `try`/`finally` kerak, u uzunroq va unutiş oson.
- Bir neçta kontekst menejerini vergul bilan yoki uzun qatorlar uçun qavs içida birlaştiring; ular teskari tartibda tozalanadi.
- `tempfile.TemporaryDirectory()` keyin öçiriladigan qoralama papka beradi.
- `contextlib.suppress(SomeError)` bitta aniq, kutilgan istisnoni eʼtiborsiz qoldiradi.

## Qöşimça manbalar

- [The `with` statement (language reference)](https://docs.python.org/3/reference/compound_stmts.html#the-with-statement)
- [`contextlib`: utilities for with-statement contexts](https://docs.python.org/3/library/contextlib.html)
- [`tempfile`: temporary files and directories](https://docs.python.org/3/library/tempfile.html)
- [PEP 343: The "with" Statement](https://peps.python.org/pep-0343/)
