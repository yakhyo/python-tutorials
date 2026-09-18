---
title: JSON bilan işlaş
description: "Python maʼlumotlarini JSON ga va JSON dan özgartiriş: dumps va loads, fayllar bilan dump va load, indent va ensure_ascii, içma-iç maʼlumotlar, ilova sozlamalari, serializatsiya qilib bölmaydigan narsalar va yaroqsiz JSON."
---

# JSON bilan işlaş

![Rasm: JSON bilan işlaş](/images/topics-webp-uzb/json.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- JSON nima va uning turlari Python turlariga qanday mos keladi
- `json.dumps()` / `json.loads()` bilan özgartiriş hamda `json.dump()` / `json.load()` bilan fayllarni saqlaş va yuklaş
- `indent`, `sort_keys` va `ensure_ascii=False` JSON ni, jumladan özbekça matnni, qanday öqişli qiladi
- Içma-iç JSON böylab harakatlaniş va undan sozlamalarni saqlaş uçun foydalaniş
- Nimani JSON ga aylantirib bölmaydi va buzilgan JSON ni `JSONDecodeError` bilan qanday uşlaş
:::

## Nega bu muhim

CSV tekis jadvallar uçun mos, lekin köp maʼlumotlar **içma-iç**: buyurtmada mijoz, mahsulotlar röyxati va manzil bor. **JSON** (JavaScript Object Notation) bunday maʼlumotlarni matn sifatida saqlaydi. Veb-xizmatlar va ilovalar JSON da "gaplaşadi" va u dastur sozlamalarini saqlaşning eng oson usuli.

## JSON qanday körinadi

```text
{
  "name": "Aziza",
  "age": 20,
  "student": true,
  "phone": null,
  "courses": ["Python", "Ingliz tili"],
  "address": {"city": "Toşkent", "zip": "100000"}
}
```

U Python luğatiga öxşaydi, lekin `true`/`false`/`null` va **faqat** qöş qöştirnoqlar bilan.

| JSON | Python |
|---|---|
| obyekt `{...}` | `dict` |
| massiv `[...]` | `list` |
| satr `"..."` | `str` |
| son `42`, `3.5` | `int`, `float` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

Kortej ham massiv sifatida yoziladi, JSON obyekt kalitlari esa har doim satr (pastdagi Köp uçraydigan xatolarga qarang).

## `dumps` va `loads`: satrlar

`json.dumps()` ("dump string") Python maʼlumotlarini JSON satriga aylantiradi. `json.loads()` ("load string") JSON satrini yana Python maʼlumotlariga tahlil qiladi:

```python
import json

student = {"name": "Aziza", "age": 20, "student": True, "phone": None, "courses": ["Python", "English"]}

text = json.dumps(student)
print(text)

back = json.loads(text)
print(back == student, type(back))
```

```text
{"name": "Aziza", "age": 20, "student": true, "phone": null, "courses": ["Python", "English"]}
True <class 'dict'>
```

JSON satrida `true`, `null` va qöş qöştirnoqlar bor; `loads` dan keyin sizda yana oddiy luğat. Veb-xizmatdan matn sifatida kelgan JSON bilan aynan şunday işlaysiz.

## Çiroyli natija: `indent`, `sort_keys`, `ensure_ascii`

Standart holatda `dumps` hammasini bitta qatorga yozadi va har bir ASCII bölmagan harfni escape kod bilan almaştiradi: yaroqli, lekin öqib bölmaydi. `indent=2` natijani qatorlarga taqsimlaydi, `sort_keys=True` kalitlarni tartiblaydi, `ensure_ascii=False` esa `ö` va `ş` kabi harflarni saqlab qoladi:

```python
import json

city = {"country": "Özbekiston", "capital": "Toşkent"}

print(json.dumps(city))
print(json.dumps(city, ensure_ascii=False, sort_keys=True))
print(json.dumps(city, indent=2, ensure_ascii=False))
```

```text
{"country": "\u00d6zbekiston", "capital": "To\u015fkent"}
{"capital": "Toşkent", "country": "Özbekiston"}
{
  "country": "Özbekiston",
  "capital": "Toşkent"
}
```

Bunday JSON ni faylga saqlaganda uni `encoding="utf-8"` bilan oçing.

## `dump` va `load`: fayllar

`s` siz funksiyalar **fayllar** bilan işlaydi: `json.dump(data, file)` yozadi, `json.load(file)` esa öqiydi:

```python
import json

library = {
    "name": "Samarqand şahar kutubxonasi",
    "books": [{"title": "Ötkan kunlar", "year": 1926, "available": False}],
}

with open("library.json", "w", encoding="utf-8") as file:
    json.dump(library, file, indent=2, ensure_ascii=False)

with open("library.json", encoding="utf-8") as file:
    print(file.read())

with open("library.json", encoding="utf-8") as file:
    loaded = json.load(file)

print(loaded["books"][0]["title"])
```

```text
{
  "name": "Samarqand şahar kutubxonasi",
  "books": [
    {
      "title": "Ötkan kunlar",
      "year": 1926,
      "available": false
    }
  ]
}
Ötkan kunlar
```

| Funksiya | Nimadan | Nimaga |
|---|---|---|
| `json.dumps(data)` | Python maʼlumotlari | JSON satri |
| `json.loads(text)` | JSON satri | Python maʼlumotlari |
| `json.dump(data, file)` | Python maʼlumotlari | JSON fayl |
| `json.load(file)` | JSON fayl | Python maʼlumotlari |

`pathlib` bilan satr funksiyalari ham işlaydi: `json.loads(path.read_text(encoding="utf-8"))`.

## Içma-iç JSON böylab harakatlaniş

Haqiqiy JSON köpinça bir neçta daraja çuqur. Unda xuddi *Içma-iç maʼlumotlar* darsidagidek bir qadamdan harakatlaning:

```python
import json

response = """
{
  "data": {"base": "USD", "rates": {"UZS": 12650.5, "EUR": 0.92}},
  "branches": [
    {"city": "Toşkent", "hours": "09:00-18:00"},
    {"city": "Nukus", "hours": null}
  ]
}
"""

info = json.loads(response)

uzs = info["data"]["rates"]["UZS"]
print(f"100 {info['data']['base']} = {100 * uzs:,.0f} söm")

for branch in info["branches"]:
    print(f"{branch['city']}: {branch['hours'] or 'yopiq'}")

print(info["data"].get("fees", "komissiya haqida maʼlumot yöq"))
```

```text
100 USD = 1,265,050 söm
Toşkent: 09:00-18:00
Nukus: yopiq
komissiya haqida maʼlumot yöq
```

Standart qiymatli `.get()` xizmat qoldirib ketgan maydonlarni hal qiladi.

## Ilova sozlamalarini saqlaş va yuklaş

Sozlamalarni JSON faylda saqlang, fayl hali bölmasa standart qiymatlarga qayting va özgarişlarni saqlang:

```python
import json
from pathlib import Path

SETTINGS_FILE = Path("settings.json")
SETTINGS_FILE.unlink(missing_ok=True)       # bu namoyişni faylsiz boşlaymiz
DEFAULTS = {"language": "uz", "theme": "light", "font_size": 14}

def load_settings():
    try:
        with SETTINGS_FILE.open(encoding="utf-8") as file:
            saved = json.load(file)
    except FileNotFoundError:
        return dict(DEFAULTS)
    return DEFAULTS | saved

def save_settings(settings):
    with SETTINGS_FILE.open("w", encoding="utf-8") as file:
        json.dump(settings, file, indent=2, ensure_ascii=False)

settings = load_settings()
print("Birinçi işga tuşiriş:", settings)

settings["theme"] = "dark"
save_settings(settings)

print("Keyingi işga tuşiriş:", load_settings())
```

```text
Birinçi işga tuşiriş: {'language': 'uz', 'theme': 'light', 'font_size': 14}
Keyingi işga tuşiriş: {'language': 'uz', 'theme': 'dark', 'font_size': 14}
```

`DEFAULTS | saved` ikki luğatni birlaştiradi (*Luğatlar* darsiga qarang): `saved` dagi qiymatlar ustun keladi, şuning uçun yangi standart qiymatlar eski fayllar bilan ham işlaydi. `unlink()` qatori faqat şu namoyişni qayta boşlaydi; haqiqiy ilova faylni saqlab, har işga tuşganda uni yuklaydi.

## Nimani serializatsiya qilib bölmaydi

Maʼlumotlarni JSON ga aylantiriş **serializatsiya** deb ataladi. Yuqoridagi jadvaldagi turlardan foydalaning. Töplamlar, sanalar va öz obyektlaringiz `TypeError` beradi:

```py
import json

print(json.dumps({"çoy", "yaşil"}))
```

```text
TypeError: Object of type set is not JSON serializable
```

`date` `TypeError: Object of type date is not JSON serializable` beradi. Bitta qiymat xatosiz ötib ketadi: `json.dumps({"x": float("nan")})` `{"x": NaN}` ni yozadi, bu esa yaroqli JSON emas; uning örniga `ValueError` oliş uçun `allow_nan=False` bering.

Buni tuzatişning ikki usuli bor:

**1. Saqlaşdan oldin özgartiriş**, bu töliq nazorat beradi: `date(2027, 3, 21).isoformat()` `"2027-03-21"` satrini beradi, `sorted(tags)` töplamni röyxatga aylantiradi, yuklagandan keyin esa `date.fromisoformat()` va `set()` asl turlarni tiklaydi. 4-maşq buni maşq qildiradi.

**2. `default=` dan foydalaniş** - tezkor tuzatiş. Python bu funksiyani özi işlay olmaydigan har bir qiymat uçun çaqiradi; `default=str` bunday qiymatlarni satrga aylantiradi:

```python
import json
from datetime import datetime

log_entry = {"user": "Farrux", "time": datetime(2026, 9, 15, 14, 30)}
print(json.dumps(log_entry, default=str))
```

```text
{"user": "Farrux", "time": "2026-09-15 14:30:00"}
```

Qiymatlar **satr** bölib qaytadi: JSON da sana turi yöq.

## Yaroqsiz JSON ni qayta işlaş

Yaroqli JSON bölmagan matn uçun `json.loads` va `json.load` muammo qayerda ekanini aytadigan `json.JSONDecodeError` beradi:

```python
import json

broken_texts = [
    '{"name": "Aziza", "age": 20,}',
    "{'name': 'Aziza'}",
    '{"name": "Aziza" "age": 20}',
]

for text in broken_texts:
    try:
        json.loads(text)
    except json.JSONDecodeError as e:
        print(f"Yaroqsiz JSON: {e.msg} ({e.lineno}-qator, {e.colno}-ustun)")
```

```text
Yaroqsiz JSON: Illegal trailing comma before end of object (1-qator, 28-ustun)
Yaroqsiz JSON: Expecting property name enclosed in double quotes (1-qator, 2-ustun)
Yaroqsiz JSON: Expecting ',' delimiter (1-qator, 18-ustun)
```

Oxirgi vergullar va yakka qöştirnoqlar - qöl bilan tahrirlaşdagi eng köp uçraydigan xatolar, şuning uçun JSON ni heç qaçon f-satrlar bilan qöl bilan yasamang: `json.dumps()` ni işlating. `JSONDecodeError` - `ValueError` ning bolasi.

Işonçli yuklovçi `FileNotFoundError` ni ham, `json.JSONDecodeError` ni ham uşlaydi (5-maşqqa qarang).

## Özingiz sinab köring

Kitob qöşing, birini olingan deb belgilang va JSON qanday özgarişini kuzating.

<ClientOnly><PythonPlayground :code='"import json\n\nlibrary = {\n    \"name\": \"Buxoro kutubxonasi\",\n    \"books\": [\n        {\"title\": \"Python asoslari\", \"year\": 2021, \"borrowed_by\": None},\n        {\"title\": \"Ötkan kunlar\", \"year\": 1926, \"borrowed_by\": \"Dilnoza\"},\n    ],\n}\n\nlibrary[\"books\"].append({\"title\": \"Python bilan veb\", \"year\": 2023, \"borrowed_by\": None})\n\ntext = json.dumps(library, indent=2, ensure_ascii=False)\nprint(text)\n\nloaded = json.loads(text)\navailable = [book[\"title\"] for book in loaded[\"books\"] if book[\"borrowed_by\"] is None]\nprint(\"Mavjud:\", available)"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `load` va `loads` ni adaştiriş

```py
import json

with open("data.json", "w", encoding="utf-8") as f:
    f.write('{"a": 1}')

with open("data.json", encoding="utf-8") as f:
    data = json.loads(f)
```

```text
TypeError: the JSON object must be str, bytes or bytearray, not TextIOWrapper
```

`loads` **satr** kutadi; oçiq fayl uçun `json.load(f)` ni işlating. `dump` (fayl) va `dumps` (satr) ham xuddi şunday.

### 2. Son kalitlar va kortejlar qaytişini kutiş

```python
import json

medals = {1: "oltin", 2: "kumuş"}
point = (41.3, 69.2)

print(json.loads(json.dumps(medals)))
print(json.loads(json.dumps(point)))
```

```text
{'1': 'oltin', '2': 'kumuş'}
[41.3, 69.2]
```

JSON kalitlari har doim satr, massivlar esa röyxat bölib yuklanadi. Asl turlar kerak bölsa, yuklagandan keyin özgartiring.

## Maşqlar

### 1. Borib qaytiş <Difficulty level="1" />

Mahsulot luğatini yarating (nomi, narxi, omborda borligi, ranglar röyxati). Uni `indent=2` bilan JSON sifatida çop eting, qayta yuklang va narxini çop eting.

::: details Yeçim
```python
import json

product = {"name": "Ryukzak", "price": 180000, "in_stock": True, "colors": ["qora", "kök"]}

text = json.dumps(product, indent=2, ensure_ascii=False)
print(text)

loaded = json.loads(text)
print(loaded["price"])
```

```text
{
  "name": "Ryukzak",
  "price": 180000,
  "in_stock": true,
  "colors": [
    "qora",
    "kök"
  ]
}
180000
```
:::

### 2. Ob-havo javobini öqiş <Difficulty level="1" />

Bu JSON ni tahlil qiling, şaharni, keyin har bir kunni `Du: 34 C` körinişida çop eting:

```text
{"city": "Toşkent", "forecast": [{"day": "Du", "max": 34}, {"day": "Se", "max": 36}, {"day": "Ça", "max": 33}]}
```

::: details Yeçim
```python
import json

text = '{"city": "Toşkent", "forecast": [{"day": "Du", "max": 34}, {"day": "Se", "max": 36}, {"day": "Ça", "max": 33}]}'

data = json.loads(text)
print(data["city"])
for day in data["forecast"]:
    print(f"{day['day']}: {day['max']} C")
```

```text
Toşkent
Du: 34 C
Se: 36 C
Ça: 33 C
```
:::

### 3. Eng yaxşi natijalar fayli <Difficulty level="2" />

`scores.json` ni (ismdan eng yaxşi ballgaça; fayl bölmasa `{}`) yuklab, har bir öyinçining faqat **yuqoriroq** ballini saqlab qoladigan va faylni saqlaydigan `add_score(name, score)` funksiyasini yozing. Uni `Aziza 120`, `Bekzod 95`, `Aziza 80`, `Bekzod 140` uçun çaqiring, keyin faylni çop eting.

::: details Yeçim
```python
import json
from pathlib import Path

SCORES = Path("scores.json")

def add_score(name, score):
    try:
        scores = json.loads(SCORES.read_text(encoding="utf-8"))
    except FileNotFoundError:
        scores = {}
    if score > scores.get(name, 0):
        scores[name] = score
    SCORES.write_text(json.dumps(scores, indent=2), encoding="utf-8")

for name, score in [("Aziza", 120), ("Bekzod", 95), ("Aziza", 80), ("Bekzod", 140)]:
    add_score(name, score)

print(SCORES.read_text(encoding="utf-8"))
```

```text
{
  "Aziza": 120,
  "Bekzod": 140
}
```
:::

### 4. Tadbirni serializatsiya qiliş <Difficulty level="2" />

`trip = {"to": "Xiva", "start": date(2026, 10, 3), "people": {"Aziza", "Kamola"}}` uçun sanasi `isoformat()`, töplami esa saralangan röyxat bölgan JSON satrini çop eting. Uni qayta yuklang, asl turlarni tiklang va `trip == restored` ni çop eting.

::: details Yeçim
```python
import json
from datetime import date

trip = {"to": "Xiva", "start": date(2026, 10, 3), "people": {"Aziza", "Kamola"}}

text = json.dumps(
    {"to": trip["to"], "start": trip["start"].isoformat(), "people": sorted(trip["people"])},
    ensure_ascii=False,
)
print(text)

raw = json.loads(text)
restored = {
    "to": raw["to"],
    "start": date.fromisoformat(raw["start"]),
    "people": set(raw["people"]),
}
print(trip == restored)
```

```text
{"to": "Xiva", "start": "2026-10-03", "people": ["Aziza", "Kamola"]}
True
```
:::

### 5. Xavfsiz kontaktlar daftari <Difficulty level="3" />

`load_contacts(path)` va `save_contacts(path, contacts)` funksiyalarini yozing. Yuklaş yöq fayl uçun `[]` qaytaradi; buzilgan fayl uçun ogohlantiriş çop etadi, uni `Path.replace` bilan `.bak` nomiga köçiradi va `[]` qaytaradi. Namoyiş: ikkita kontaktni saqlang, faylga `{"oops"` yozing, yuklang, kontakt qöşing, saqlang va faylni çop eting.

::: details Yeçim
```python
import json
from pathlib import Path

def load_contacts(path):
    path = Path(path)
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return []
    except json.JSONDecodeError as e:
        backup = path.with_suffix(".bak")
        path.replace(backup)
        print(f"Ogohlantiriş: {path.name} buzilgan ({e.msg}). {backup.name} ga köçirildi.")
        return []

def save_contacts(path, contacts):
    text = json.dumps(contacts, indent=2, ensure_ascii=False)
    Path(path).write_text(text, encoding="utf-8")

path = "contacts.json"
save_contacts(path, [
    {"name": "Aziza", "phone": "+998901234567", "city": "Toşkent"},
    {"name": "Bekzod", "phone": "+998917654321", "city": "Samarqand"},
])
print(len(load_contacts(path)), "ta kontakt yuklandi")

Path(path).write_text('{"oops"', encoding="utf-8")
contacts = load_contacts(path)

contacts.append({"name": "Ğayrat", "phone": "+998931112233", "city": "Farğona"})
save_contacts(path, contacts)
print(Path(path).read_text(encoding="utf-8"))
print(Path("contacts.bak").exists())
```

```text
2 ta kontakt yuklandi
Ogohlantiriş: contacts.json buzilgan (Expecting ':' delimiter). contacts.bak ga köçirildi.
[
  {
    "name": "Ğayrat",
    "phone": "+998931112233",
    "city": "Farğona"
  }
]
True
```
:::

## Xulosa

- JSON içma-iç maʼlumotlarni matn sifatida saqlaydi: obyektlar `dict`, massivlar `list`, `true`/`false`/`null` esa `True`/`False`/`None` ga aylanadi.
- `dumps`/`loads` satrlar bilan, `dump`/`load` fayllar bilan işlaydi.
- `indent=2` natijani öqişli qiladi; `encoding="utf-8"` bilan birga `ensure_ascii=False` özbekça harflarni saqlaydi.
- Kalitlar satrga aylanadi, kortejlar röyxat bölib qaytadi; töplam va sanalarni avval özgartiriş yoki `default=str` kerak.
- Buzilgan JSON uçun `json.JSONDecodeError` (`ValueError`) ni, yöq fayllar uçun `FileNotFoundError` ni uşlang.

## Qöşimça manbalar

- [`json`: JSON encoder and decoder](https://docs.python.org/3/library/json.html)
- [Python Tutorial: Saving structured data with json](https://docs.python.org/3/tutorial/inputoutput.html#saving-structured-data-with-json)
- [The JSON data format (json.org)](https://www.json.org/json-en.html)
