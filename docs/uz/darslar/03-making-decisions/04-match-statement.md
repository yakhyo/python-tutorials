---
title: match operatori
description: "Qiymatni andozalar bilan soliştiriş uçun match va case dan foydalaning: aniq qiymatlar, | bilan bir neça variant, _ belgisi, qiymatlarni uşlab oliş, qöşimça şartlar (guard) va bölingan buyruqlarni moslaş."
---

# match operatori

![Rasm: match operatori](/images/topics-webp-uzb/match-statement.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `match` va `case` variantlar orasidan qanday tanlaydi va qaçon oddiy `if`/`elif` yaxşiroq
- `|` yordamida bitta case da bir neça qiymatni moslaş
- `_` bilan "qolgan hamma narsa" ni boşqariş
- Qiymat qismlarini özgaruvçilarga uşlab oliş
- **Guard** (qöşimça şart) lar bilan qöşimça şartlar qöşiş
:::

## Nega bu muhim

Köp dasturlar bitta qiymatni imkoniyatlar röyxati bilan soliştiradi: menyu tanlovi, buyruq, hafta kuni, HTTP holat kodi. Buni uzun `if`/`elif` zanjiri bilan qiliş mumkin, lekin Python 3.10 da qöşilgan `match` köpinça tuşunarliroq. U qiymatlarning **içiga** ham qaray oladi, `if` buyruqlari esa buni bunçalik qulay qila olmaydi.

::: info Versiya haqida eslatma
`match` uçun **Python 3.10 yoki yangiroq** kerak. Eskiroq versiyalarda bu `SyntaxError` beradi.
:::

## Birinçi misol

```python
command = "stop"

match command:
    case "start":
        print("Dvigatel işga tuşirilmoqda...")
    case "stop":
        print("Töxtatildi.")
    case "pause":
        print("Pauza.")
    case _:
        print(f"Notaniş buyruq: {command}")
```

```text
Töxtatildi.
```

Qanday işlaydi:

1. Python `match` dan keyingi qiymatni hisoblaydi (bu yerda `command`).
2. Har bir `case` ni **yuqoridan pastga** sinab köradi.
3. Mos kelgan **birinçi** andozaning blokini bajaradi va qolganlarini ötkazib yuboradi.
4. `case _:` **istalgan narsaga** mos keladi, şuning uçun u `else` kabi "aks holda" tarmoği.

Xuddi şu mantiq `if`/`elif` bilan:

```python
command = "stop"

if command == "start":
    print("Dvigatel işga tuşirilmoqda...")
elif command == "stop":
    print("Töxtatildi.")
elif command == "pause":
    print("Pauza.")
else:
    print(f"Notaniş buyruq: {command}")
```

Oddiy qiymat tekşiruvlari uçun ikkalasi ham birdek yaxşi. `match` har bir qatorda `command ==` ni takrorlamaslik imkonini beradi.

::: warning `_` yöq - zaxira tarmoq ham yöq
Heç qaysi case mos kelmasa va `case _:` bölmasa, **heç narsa sodir bölmaydi**: xato ham, natija ham yöq. Kutilmagan qiymat kelişi mumkin bölsa, doim `case _:` qöşing.
:::

## Bitta case da bir neça qiymat: `|`

Andoza içida `|` "yoki" degan maʼnoni bildiradi:

```python
day = "yakşanba"

match day:
    case "şanba" | "yakşanba":
        print("Dam oliş kuni!")
    case "duşanba" | "seşanba" | "çorşanba" | "payşanba" | "juma":
        print("Iş kuni.")
    case _:
        print("Bunday kun yöq.")
```

```text
Dam oliş kuni!
```

Sonlar bilan ham işlaydi:

```python
status = 404

match status:
    case 200 | 201:
        print("Muvaffaqiyatli")
    case 301 | 302:
        print("Qayta yönaltiriş")
    case 404:
        print("Topilmadi")
    case 500:
        print("Server xatosi")
    case _:
        print(f"Boşqa holat: {status}")
```

```text
Topilmadi
```

## Qiymatni uşlab oliş

Andozadagi oddiy **nom** özgaruvçi bilan soliştirmaydi. U qiymatni şu nomga **uşlab oladi**. Bu oxirgi case da foydali:

```python
choice = "7"

match choice:
    case "1":
        print("Yangi öyin")
    case "2":
        print("Öyinni yuklaş")
    case other:
        print(f"'{other}' menyuda yöq")
```

```text
'7' menyuda yöq
```

`case other:` xuddi `_` kabi istalgan narsaga mos keladi, lekin qiymatni `other` ga ham saqlaydi. Qiymat kerak bölmasa, `_` ni işlating.

## Guard: `if` bilan qöşimça şartlar

Andozadan keyin `if şart` qöşing. Case faqat andoza mos kelsa **va** şart rost bölsa mos keladi:

```python
temperature = -4

match temperature:
    case 0:
        print("Aynan muzlaş nuqtasi")
    case t if t < 0:
        print(f"{t}°C: noldan past, muzdan ehtiyot böling")
    case t if t > 35:
        print(f"{t}°C: juda issiq")
    case t:
        print(f"{t}°C: odatiy")
```

```text
-4°C: noldan past, muzdan ehtiyot böling
```

Bunday oraliq tekşiruvlari köpinça `if`/`elif` bilan ham xuddi şunday tuşunarli. Guard lar quyidagi andozalar bilan birga işlatilganda özini körsatadi.

## Bir neça sözli buyruqlarni moslaş

`match` qiymatlar ketma-ketligining **içiga** qaray oladi. Keng tarqalgan qöllaniş - `.split()` yordamida sözlarga bölingan matnli buyruq (buni *Satr metodlari va kesimlar* darsida körgansiz):

```python
line = "bor şimolga"

match line.split():
    case ["bor", direction]:
        print(f"Siz {direction} yurdingiz.")
    case ["ol", item]:
        print(f"Siz oldingiz: {item}.")
    case ["qara"]:
        print("Siz qoronği örmonni köryapsiz.")
    case ["çiqiş" | "quit"]:
        print("Xayr!")
    case _:
        print("Tuşunmadim.")
```

```text
Siz şimolga yurdingiz.
```

- `["bor", direction]` birinçisi `"bor"` bölgan **aynan ikki** sözli röyxatga mos keladi va ikkinçi sözni `direction` ga uşlab oladi.
- `["qara"]` aynan bitta söz - `"qara"` ga mos keladi.
- `["çiqiş" | "quit"]` `"çiqiş"` yoki `"quit"` bölgan bitta sözga mos keladi.

`line` ni `"ol çiroq"`, `"qara"`, `"bor"` yoki `"raqs tuş"` ga özgartirib köring. Yolğiz `"bor"` `["bor", direction]` ga mos kelmaydi, çunki ikki söz talab qilinadi.

Oddiy `if` buyruqlari bilan bu misol uçun uzunlik va mazmunni bir neça marta tekşiriş kerak bölardi. `match` da bu darsda körsatilganidan köra köproq andozalar bor. Kvadrat qavslar bilan *Röyxatlar* darsida tögri tanişasiz, luğatlar, obyektlar va `Color.RED` kabi nomlarni esa *Luğatlar*, *Dataclasslar* va *Enum turlari* darslarida moslaysiz.

## `match` mi yoki `if` mi?

| Vaziyat | Yaxşiroq tanlov |
|---|---|
| Bitta qiymat bir neça qatʼiy variant bilan soliştiriladi (menyu, buyruq, kod) | `match` |
| Tuzilmali qiymatlar, masalan bölingan buyruqlar | `match` |
| Oraliqlar va taqqoslaşlar (`score >= 90`) | `if`/`elif` |
| Turli özgaruvçilar qatnaşgan şartlar | `if`/`elif` |
| Faqat bir yoki ikki variant | `if`/`else` |

`match` `if` ning örnini bosmaydi. Bu baʼzi tanlovlarni öqişni osonlaştiradigan yana bir vosita.

## Özingiz sinab köring

**input() uçun qiymatlar** maydoniga `bor şarqqa`, `ol kalit`, `qara` yoki `sakra` kabi buyruq yozing va işga tuşiring. Keyin `taşla <narsa>` kabi yangi buyruq qöşing. `case []:` andozasi böş qatorga mos keladi: `"".split()` da umuman söz yöq.

<ClientOnly><PythonPlayground :code='"line = input(\"> \").strip().lower()\n\nmatch line.split():\n    case [\"bor\", direction]:\n        print(f\"Siz {direction} yurdingiz.\")\n    case [\"ol\", item]:\n        print(f\"Siz oldingiz: {item}.\")\n    case [\"qara\"]:\n        print(\"Siz eşik va kiçkina kalitni köryapsiz.\")\n    case []:\n        print(\"Biror narsa deng!\")\n    case _:\n        print(\"Buni tuşunmadim.\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Nom özgaruvçi bilan soliştiriladi deb kutiş

```py
expected = "ha"
answer = "yöq"

match answer:
    case expected:            # uşlab oladi! özgaruvçi bilan soliştirmaydi
        print("Mos keldi")
    case _:
        print("Mos kelmadi")
```

```text
SyntaxError: name capture 'expected' makes remaining patterns unreachable
```

Yolğiz nom istalgan qiymatni **uşlab oladi**. Bu yerda Python keyingi case heç qaçon bajarilmasligini sezadi va kodni işga tuşirişdan boş tortadi.

Yolğiz nom **oxirgi** case bölsa, umuman xato bölmaydi - bu esa yanada yomon:

```python
expected = "ha"
answer = "yöq"

match answer:
    case "balki":
        print("Aniq emas")
    case expected:            # hamma narsaga mos keladi va expected ni qayta yozadi
        print("Mos keldi", expected)

print(expected)
```

```text
Mos keldi yöq
yöq
```

Case `"yöq"` ga mos keldi va `expected` endi `"ha"` örniga `"yöq"` ni saqlaydi. **Tuzatiş:** töğridan-töğri qiymat bilan soliştiring (`case "ha":`) yoki `if answer == expected:` dan foydalaning. `case Color.RED:` kabi nuqtali nom boşqaça: u uşlab olinmaydi, qiymat sifatida soliştiriladi. Buni *Enum turlari* darsida işlatasiz.

### 2. `_` ni birinçi qöyiş

```py
answer = "h"

match answer:
    case _:
        print("Istalgan narsa")
    case "h":
        print("Ha")
```

```text
SyntaxError: wildcard makes remaining patterns unreachable
```

`case _:` hamma narsaga mos keladi, şuning uçun undan keyingi har qanday case heç qaçon bajarila olmaydi. `_` ni **oxirida** saqlang.

### 3. `|` örniga `or` işlatiş

```py
answer = "h"

match answer:
    case "h" or "ha":
        print("Ha")
```

```text
    case "h" or "ha":
             ^^
SyntaxError: invalid syntax
```

Andoza içida `or` ga ruxsat yöq. **Tuzatiş:** `case "h" | "ha":`.

## Maşqlar

### 1. Kun turi <Difficulty level="1" />

Kun raqami `day` berilgan (1 = duşanba … 7 = yakşanba). `match` yordamida `Iş kuni`, `Dam oliş kuni` yoki `Notöğri kun` deb çop eting.

::: details Yeçim
```python
day = 6

match day:
    case 1 | 2 | 3 | 4 | 5:
        print("Iş kuni")
    case 6 | 7:
        print("Dam oliş kuni")
    case _:
        print("Notöğri kun")
```
:::

### 2. Svetofor <Difficulty level="1" />

`light` berilgan (`"qizil"`, `"sariq"` yoki `"yaşil"`, istalgan harf registrida). `Töxtang`, `Tayyorlaning` yoki `Yuring` deb çop eting. Boşqa har qanday qiymat uçun `Nosoz svetofor: <qiymat>` deb çop eting - qiymat aynan berilganidek bölsin.

::: details Yeçim
```python
light = "Yaşil"

match light.lower():
    case "qizil":
        print("Töxtang")
    case "sariq":
        print("Tayyorlaning")
    case "yaşil":
        print("Yuring")
    case _:
        print(f"Nosoz svetofor: {light}")
```
:::

### 3. match bilan kalkulyator <Difficulty level="2" />

*if, elif va else* darsidagi kalkulyatorni operator böyiça `match` yordamida qayta yozing. Nolga bölişni boşqariş uçun **guard** dan foydalaning.

::: details Yeçim
```python
a = 12.0
operator = "/"
b = 0.0

match operator:
    case "+":
        print(a + b)
    case "-":
        print(a - b)
    case "*" | "x":
        print(a * b)
    case "/" if b == 0:
        print("Xato: nolga bölib bölmaydi.")
    case "/":
        print(a / b)
    case _:
        print(f"Notaniş operator: {operator}")
```

Guard li case oddiy `"/"` case dan **oldin** kelişi kerak, aks holda unga heç qaçon yetib kelinmaydi.
:::

### 4. Toş, qoğoz, qayçi <Difficulty level="2" />

`player` va `computer` tanlovlari berilgan. `Durang`, `Siz yutdingiz` yoki `Siz yutqazdingiz` deb çop eting. Öyinçi tanlovi böyiça `match` dan, guard lar yoki içma-iç `if` lar bilan foydalaning.

::: details Yeçim
```python
player = "toş"
computer = "qayçi"

valid = ("toş", "qoğoz", "qayçi")

if player not in valid or computer not in valid:
    print("Notöğri tanlov")
elif player == computer:
    print("Durang")
else:
    match player:
        case "toş":
            print("Siz yutdingiz" if computer == "qayçi" else "Siz yutqazdingiz")
        case "qoğoz":
            print("Siz yutdingiz" if computer == "toş" else "Siz yutqazdingiz")
        case "qayçi":
            print("Siz yutdingiz" if computer == "qoğoz" else "Siz yutqazdingiz")
```

Ikkala tanlovni va durangni birinçi tekşiriş har bir case ni sodda saqlaydi: `match` işlaydigan paytda `computer` `player` dan farqli yaroqli tanlov böladi.
:::

### 5. Kiçik buyruqlar qobiği <Difficulty level="3" />

Buyruq qatorini `line.split()` böyiça `match` yordamida qayta işlang:

- `qöş A B`: ikki sonning yiğindisini çop eting
- `salom ISM`: `Salom, ISM!` deb çop eting
- `takrorla SÖZ N`: sözni böşliq bilan ajratib N marta çop eting
- `yordam`: buyruqlar röyxatini çop eting
- boşqa har qanday narsa: `Notaniş buyruq. yordam deb yozing.`

`"qöş 4 5"`, `"salom Aziza"`, `"takrorla hey 3"`, `"yordam"` va `"qöş 4"` bilan sinab köring.

::: details Yeçim
```python
line = "takrorla hey 3"

match line.split():
    case ["qöş", a, b]:
        print(float(a) + float(b))
    case ["salom", name]:
        print(f"Salom, {name}!")
    case ["takrorla", word, times]:
        print(((word + " ") * int(times)).strip())
    case ["yordam"]:
        print("Buyruqlar: qöş A B, salom ISM, takrorla SÖZ N, yordam")
    case _:
        print("Notaniş buyruq. yordam deb yozing.")
```

`"qöş 4"` da faqat ikki söz bor, şuning uçun u `["qöş", a, b]` ga mos kelmaydi va `_` ga tuşadi. `(word + " ") * int(times)` har bir nusxadan keyin böşliq qöyib sözni takrorlaydi, `.strip()` esa oxiridagi ortiqça böşliqni olib taşlaydi.
:::

## Xulosa

- `match value:` har bir `case` ni yuqoridan pastga sinaydi va faqat birinçi mos kelganini bajaradi.
- `case "a" | "b":` bir neça variantga mos keladi, `case _:` esa hamma narsaga mos keladi, şuning uçun uni oxirida qöying.
- `case other:` kabi yolğiz nom qiymatni **uşlab oladi**. U şu nomdagi özgaruvçi bilan soliştirmaydi.
- Guard lar (`case x if x > 0:`) andozaga şart qöşadi.
- `case ["bor", direction]:` kabi ketma-ketlik andozalari bölingan buyruqlar tuzilişiga mos keladi.
- Bitta qiymatni qatʼiy variantlar yoki tuzilmalar bilan soliştiriş uçun `match` ni, oraliqlar va aralaş şartlar uçun `if`/`elif` ni işlating. Python 3.10+ talab qilinadi.

## Qöşimça manbalar

- [Python Tutorial - `match` statements](https://docs.python.org/3/tutorial/controlflow.html#match-statements)
- [PEP 636 - Structural pattern matching: tutorial](https://peps.python.org/pep-0636/)
- [The `match` statement (reference)](https://docs.python.org/3/reference/compound_stmts.html#the-match-statement)
