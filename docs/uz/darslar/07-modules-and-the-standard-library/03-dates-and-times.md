---
title: Sana va vaqt
description: "datetime yordamida sana va vaqt bilan işlaş: formatlaş va matndan öqiş, timedelta bilan sana arifmetikasi, sanalarni taqqoslaş va vaqt zonalari."
---

# Sana va vaqt

![Rasm: Sana va vaqt](/images/topics-webp-uzb/dates-and-times.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `datetime` dagi asosiy turlar: `date`, `datetime`, `time` va `timedelta`
- Sanalarni `strftime` va f-satrlar bilan formatlaş hamda `strptime` bilan öqiş
- Sana arifmetikasi: yoş, muddatlar, tadbirgaça qolgan kunlar
- Sanalarni taqqoslaş va hafta kunini aniqlaş
- Vaqt zonalari asoslari va naive hamda aware sanalar farqi
:::

## Nega bu muhim

Kutubxona kitoblarning qaytariş muddatini kuzatadi, bron qiliş sayti esa Toşkent va Istanbuldagi uçiş vaqtlarini körsatadi. Sanalar tuzoqlarga töla: oylarning uzunligi har xil, kabisa yillari bor, odamlar esa bitta kunni `05.09.2026` va `09/05/2026` deb yozadi. `datetime` moduli bularni siz uçun hal qiladi.

## `datetime` moduli

`datetime` modulida törtta asosiy tur bor: `date` (yil, oy, kun), `time` (soat, daqiqa, soniya), `datetime` (sana **va** vaqt) va `timedelta` (davomiylik).

::: warning Modul va tur bir xil nomga ega
`datetime` moduli içida xuddi şunday `datetime` nomli tur bor, şuning uçun `from datetime import datetime` ni köp uçratasiz.
:::

### Sana va vaqt yaratiş

```python
from datetime import date, time, datetime

independence_day = date(2026, 9, 1)
lesson_start = time(9, 30)
flight = datetime(2026, 10, 5, 7, 45)

print(independence_day)
print(lesson_start)
print(flight)
print(flight.year, flight.month, flight.day, flight.hour, flight.minute)
```

```text
2026-09-01
09:30:00
2026-10-05 07:45:00
2026 10 5 7 45
```

Tartib har doim **yil, oy, kun**, keyin soat, daqiqa, soniya. Notöğri sanalar rad etiladi: `date(2026, 2, 30)` `ValueError: day 30 must be in range 1..28 for month 2 in year 2026` beradi.

### Bugun va hozir

```py
from datetime import date, datetime

print(date.today())       # masalan, 2026-09-15
print(datetime.now())     # masalan, 2026-09-15 14:03:27.518204
```

Natija har işga tuşirişda özgaradi, şuning uçun darsning qolgan qismida **qatʼiy sanalar** işlatiladi.

## Sanalarni formatlaş

Sanani çop etsangiz, ISO formati `YYYY-MM-DD` çiqadi. Uni boşqaça körsatiş uçun **format kodlari** bilan `strftime` ("string format time") dan foydalaning:

```python
from datetime import datetime

meeting = datetime(2026, 3, 21, 16, 5)

print(meeting.strftime("%d.%m.%Y"))
print(meeting.strftime("%d/%m/%Y %H:%M"))
print(meeting.strftime("%A, %d %B %Y"))
print(f"Uçraşuv {meeting:%d.%m.%Y} kuni")    # f-satrda ham xuddi şu kodlar
```

```text
21.03.2026
21/03/2026 16:05
Saturday, 21 March 2026
Uçraşuv 21.03.2026 kuni
```

| Kod | Maʼnosi | Misol |
|---|---|---|
| `%Y` | yil, 4 raqam | 2026 |
| `%m` | oy, 2 raqam | 03 |
| `%d` | kun, 2 raqam | 21 |
| `%H` / `%M` | soat (24 soatlik) / daqiqa | 16 / 05 |
| `%A` / `%a` | hafta kuni nomi / qisqasi | Saturday / Sat |
| `%B` / `%b` | oy nomi / qisqasi | March / Mar |

Eʼtibor bering: `%m` - **oy**, `%M` - **daqiqa**: `date(2026, 9, 15).strftime("%d.%M.%Y")` `15.00.2026` beradi, bu klassik xato. Hafta kuni va oy nomlarini Python inglizça çiqaradi.

## Matndan sanani öqiş

Kiritiş va fayllar sanalarni **satr** körinişida beradi. `datetime.strptime` ("string parse time") xuddi şu format kodlari yordamida satrni `datetime` ga aylantiradi:

```python
from datetime import datetime

text = "25.12.2026 18:30"
party = datetime.strptime(text, "%d.%m.%Y %H:%M")

print(party)
print(party.date())
```

```text
2026-12-25 18:30:00
2026-12-25
```

Format matnga **aynan** mos kelişi kerak. `.date()` faqat sana qismini qoldiradi.

### ISO formati

ISO formati `YYYY-MM-DD` fayllar va maʼlumotlar bazalari uçun standart va uning öz tezkor metodlari bor:

```python
from datetime import date, datetime

d = date.fromisoformat("2026-04-18")
print(d.strftime("%d %B"))
print(d.isoformat())

dt = datetime.fromisoformat("2026-04-18T09:15:00")
print(dt.isoformat())
```

```text
18 April
2026-04-18
2026-04-18T09:15:00
```

## `timedelta` bilan sana arifmetikasi

`timedelta` - bu davomiylik. Uni sanaga qöşsangiz, oldinga, ayirsangiz, orqaga siljiysiz:

```python
from datetime import date, timedelta

borrowed = date(2026, 1, 25)
due = borrowed + timedelta(days=14)
reminder = due - timedelta(days=2)

print(f"Muddat:  {due}")
print(f"Eslatma: {reminder}")
print(borrowed + timedelta(weeks=6))
```

```text
Muddat:  2026-02-08
Eslatma: 2026-02-06
2026-03-08
```

Python oy oxirlari va kabisa yillarini özi hisobga oladi. `timedelta` `days`, `weeks`, `hours`, `minutes` va `seconds` ni qabul qiladi, lekin `months` yoki `years` ni emas, çunki ularning uzunligi har xil.

### Ikki sanani ayiriş

Bir sanadan boşqasini ayirsangiz, `timedelta` çiqadi. Uning `.days` atributi - kunlar soni, `total_seconds()` esa butun davomiylikni, soat va daqiqalar bilan birga, soniyalarga aylantiradi:

```python
from datetime import date, datetime

left = date(2027, 1, 1) - date(2026, 9, 15)
print(f"Yangi yilgaça {left.days} kun qoldi")

flight_time = datetime(2026, 10, 5, 11, 20) - datetime(2026, 10, 5, 7, 45)
print(flight_time)
print(flight_time.total_seconds() / 60, "daqiqa")
```

```text
Yangi yilgaça 108 kun qoldi
3:35:00
215.0 daqiqa
```

## Sanalarni taqqoslaş

Sanalar `<`, `>`, `==` bilan taqqoslanadi: oldingi sanalar "kiçikroq", şuning uçun `min`, `max` va `sorted` ham ular bilan işlaydi. `weekday()` hafta kunini son körinişida beradi: duşanba `0`, yakşanba `6`:

```python
from datetime import date

today = date(2026, 9, 19)
books = {"Python asoslari": date(2026, 9, 10), "Samarqand yöriqnomasi": date(2026, 9, 30)}

for title, due in books.items():
    if due < today:
        print(f"{title}: {(today - due).days} kun keçikkan")
    else:
        print(f"{title}: joyida")

print("Eng erta:", min(books.values()))
print(today.weekday(), today.strftime("%A"))
```

```text
Python asoslari: 9 kun keçikkan
Samarqand yöriqnomasi: joyida
Eng erta: 2026-09-10
5 Saturday
```

::: details Yana ikki modul: `calendar` va `time`
`calendar` butun oylar va yillar haqidagi savollarga javob beradi, masalan `calendar.isleap(2028)` `True` beradi.

`time.perf_counter()` kod qança vaqt işlaşini ölçaydi: uni oldin va keyin çaqirib, ayiring. `time.sleep(0.5)` yarim soniya töxtab turadi.
:::

## Vaqt zonalari

Hozirgaça körgan sanalaringiz **naive** (sodda): `datetime(2026, 10, 5, 7, 45)` bu Toşkentdagi 7:45 mi yoki Londondagimi, aytmaydi. Vaqt zonasi bor datetime **aware** (zonani biladigan) deb ataladi. Eng oddiylari qatʼiy siljişli `timezone` dan foydalanadi:

```python
from datetime import datetime, timedelta, timezone, UTC

tashkent_tz = timezone(timedelta(hours=5))
call = datetime(2026, 9, 15, 15, 0, tzinfo=tashkent_tz)

print(call)
print(call.astimezone(UTC))
```

```text
2026-09-15 15:00:00+05:00
2026-09-15 10:00:00+00:00
```

`astimezone` xuddi şu paytni boşqa vaqt zonasiga öğiradi: Toşkentdagi (UTC+5) 15:00 UTC böyiça 10:00. `UTC` (Python 3.11+) - `timezone.utc` ning qisqasi, UTC böyiça joriy vaqt esa `datetime.now(UTC)`. Haqiqiy joylar uçun `zoneinfo` nomlarni va yozgi vaqt qoidalarini biladi:

```py
from datetime import datetime
from zoneinfo import ZoneInfo

meeting = datetime(2026, 7, 1, 18, 0, tzinfo=ZoneInfo("Asia/Tashkent"))
print(meeting.astimezone(ZoneInfo("Europe/Berlin")))
```

```text
2026-07-01 15:00:00+02:00
```

Baʼzi tizimlarda (ayniqsa Windows da) `zoneinfo` zona nomlarini biliş uçun qöşimça `tzdata` paketini talab qiladi.

### UTC va eski `utcnow()`

Köp darsliklarda `datetime.utcnow()` işlatiladi. Uni köçirmang: u **naive** datetime qaytaradi va Python 3.12 dan boşlab eskirgan:

```py
from datetime import datetime

stamp = datetime.utcnow()
print(stamp.tzinfo)
```

```text
DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).
None
```

## Özingiz sinab köring

Sanalar va formatlarni özgartiring: tuğilgan kuningizgaça neça kun qolganini toping yoki sanani özingiz yozadigan körinişda formatlang.

<ClientOnly><PythonPlayground :code='"from datetime import date, datetime, timedelta\n\ntoday = date(2026, 9, 15)\nbirthday = date(2027, 3, 21)\n\nprint(f\"Bugun: {today:%d.%m.%Y} ({today:%A})\")\nprint(f\"Tuğilgan kungaça: {(birthday - today).days} kun\")\n\ndue = today + timedelta(weeks=2)\nprint(f\"Kitob qaytariş muddati: {due:%d %B %Y}\")\n\nentered = datetime.strptime(\"05.10.2026 07:45\", \"%d.%m.%Y %H:%M\")\nprint(\"Parvoz:\", entered.strftime(\"%A, soat %H:%M\"))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Format matnga mos kelmaydi

```py
from datetime import datetime

datetime.strptime("15/09/2026", "%Y-%m-%d")
```

```text
ValueError: time data '15/09/2026' does not match format '%Y-%m-%d'
```

Matnda `DD/MM/YYYY`, formatda esa `YYYY-MM-DD`. **Tuzatiş:** `"%d/%m/%Y"`. Format matnni belgima-belgi tavsiflaşi kerak.

### 2. Oy va kun notöğri tartibda

```python
from datetime import datetime

d = datetime.strptime("05.09.2026", "%m.%d.%Y")   # möljal: 5-sentabr
print(d.strftime("%d %B %Y"))
```

```text
09 May 2026
```

Xato yöq, şunçaki 5-sentabr örniga 9-may. Maʼlumotlaringizda avval kun yoki oy kelişini tekşiring va sanalarni ISO formatida (`2026-09-05`) saqlang.

### 3. Naive va aware datetime larni aralaştiriş

```py
from datetime import datetime, timezone

naive = datetime(2026, 9, 15, 10, 0)
aware = datetime(2026, 9, 15, 10, 0, tzinfo=timezone.utc)
print(naive == aware)
print(naive < aware)
```

```text
False
TypeError: can't compare offset-naive and offset-aware datetimes
```

Tartiblaş (`<`, `>`) xato beradi, lekin `==` xavfliroq: soat körsatkiçlari bir xil bölsa ham u indamay `False` qaytaradi, şuning uçun `if deadline == now:` heç qaçon mos kelmaydi. Har bir dastur uçun bitta uslubni tanlang: hammasi naive (oddiy lokal dasturlar) yoki hammasi aware (turli joylardagi foydalanuvçilar).

## Maşqlar

### 1. Çiroyli sanalar <Difficulty level="1" />

2027-yil 21-mart (Navröz) sanasini yarating. Uni `21.03.2027` körinişida, keyin f-satr formati yordamida `Sunday, 21 March 2027` körinişida çiqaring.

::: details Yeçim
```python
from datetime import date

navruz = date(2027, 3, 21)
print(navruz.strftime("%d.%m.%Y"))
print(f"{navruz:%A, %d %B %Y}")
```

```text
21.03.2027
Sunday, 21 March 2027
```
:::

### 2. Kutubxona muddati <Difficulty level="1" />

Kitob `"28.02.2028"` da 3 haftaga olingan. Matnni öqing va qaytariş sanasini `DD.MM.YYYY` körinişida hafta kuni bilan çiqaring.

::: details Yeçim
```python
from datetime import datetime, timedelta

borrowed = datetime.strptime("28.02.2028", "%d.%m.%Y").date()
due = borrowed + timedelta(weeks=3)
print(f"{due:%d.%m.%Y} ({due:%A})")
```

```text
20.03.2028 (Monday)
```

2028 kabisa yili va `timedelta` 29-fevralni avtomatik hisobga oladi.
:::

### 3. Teskari sanoq <Difficulty level="2" />

`today` dan tadbir oyi va kunining **navbatdagi** takrorlanişigaça bölgan kunlar sonini qaytaradigan `days_until(event, today)` funksiyasini yozing (tadbir allaqaçon ötgan bölsa, keyingi yilgaça). `today = date(2026, 9, 15)` bilan 3-noyabrdagi va 1-martdagi tuğilgan kunlarni tekşiring.

::: details Yeçim
```python
from datetime import date

def days_until(event, today):
    next_time = date(today.year, event.month, event.day)
    if next_time < today:
        next_time = date(today.year + 1, event.month, event.day)
    return (next_time - today).days

today = date(2026, 9, 15)
print(days_until(date(2008, 11, 3), today))
print(days_until(date(2005, 3, 1), today))
```

```text
49
167
```
:::

### 4. Iş soatlari <Difficulty level="2" />

Farruxning vaqt jurnali `("HH:MM", "HH:MM")` boşlaniş va tugaş juftliklaridan iborat röyxat. Ularni `strptime` bilan öqing, davomiyliklarni qöşing va jami vaqtni `7 soat 35 daqiqa` körinişida çiqaring.

```python
log = [("09:00", "12:30"), ("13:15", "17:00"), ("19:40", "20:00")]
```

::: details Yeçim
```python
from datetime import datetime, timedelta

log = [("09:00", "12:30"), ("13:15", "17:00"), ("19:40", "20:00")]

total = timedelta()
for start_text, end_text in log:
    start = datetime.strptime(start_text, "%H:%M")
    end = datetime.strptime(end_text, "%H:%M")
    total += end - start

minutes = int(total.total_seconds() // 60)
hours, minutes = divmod(minutes, 60)
print(f"{hours} soat {minutes} daqiqa")
```

```text
7 soat 35 daqiqa
```

`timedelta()` - nol davomiylik, yiğilib boradigan jami uçun yaxşi boşlanğiç qiymat.
:::

### 5. Ijara hisob-fakturasi <Difficulty level="3" />

Avtomobil ijarasi boşlangan har bir kun uçun 350,000 söm turadi (1 kun 2 soat 2 kun hisoblanadi), dam oliş kunlari esa 20% qimmatroq. Olib ketiş `"2026-09-18 10:00"` va qaytariş `"2026-09-21 12:00"` uçun hisoblangan har bir kunni hafta kuni va narxi bilan, keyin jami summani çiqaring.

::: details Yeçim
```python
import math
from datetime import datetime, timedelta

PRICE = 350_000

pickup = datetime.fromisoformat("2026-09-18 10:00")
returned = datetime.fromisoformat("2026-09-21 12:00")

hours = (returned - pickup).total_seconds() / 3600
days = math.ceil(hours / 24)

total = 0
for i in range(days):
    day = (pickup + timedelta(days=i)).date()
    price = PRICE * 1.2 if day.weekday() >= 5 else PRICE
    total += price
    print(f"{day:%d.%m %a}  {price:>9,.0f} söm")

print(f"Jami: {days} kun uçun {total:,.0f} söm")
```

```text
18.09 Fri    350,000 söm
19.09 Sat    420,000 söm
20.09 Sun    420,000 söm
21.09 Mon    350,000 söm
Jami: 4 kun uçun 1,540,000 söm
```

Ijara 74 soat davom etadi, şuning uçun 4 ta boşlangan kun hisoblanadi.
:::

## Xulosa

- `date`, `time`, `datetime` va `timedelta` argumentlarni yil, oy, kun, soat, daqiqa tartibida oladi.
- `strftime` va f-satrlar (`f"{d:%d.%m.%Y}"`) sanani matnga, `strptime` esa matnni sanaga aylantiradi. Format aynan mos kelişi kerak.
- Sanani siljitiş uçun `timedelta` qöşing yoki ayiring, ikki sanani ayirsangiz, `.days` li `timedelta` çiqadi.
- Sanalar `<` va `==` bilan taqqoslanadi; `weekday()` duşanba uçun 0.
- Naive datetime larda vaqt zonasi yöq, aware larda bor. Ularni aralaştirmang; `utcnow()` emas, `datetime.now(UTC)` işlating.

## Qöşimça manbalar

- [`datetime` - Basic date and time types](https://docs.python.org/3/library/datetime.html)
- [strftime() and strptime() format codes](https://docs.python.org/3/library/datetime.html#format-codes)
- [`zoneinfo` - IANA time zone support](https://docs.python.org/3/library/zoneinfo.html)
- [`time` - Time access and conversions](https://docs.python.org/3/library/time.html)
