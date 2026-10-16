---
title: "Loyiha: Log konveyeri"
description: "Generatorlar, muzlatilgan dataclasslar, dekorator bilan töldiriladigan Registry, Strategy funksiyalari, kontekst menejerlari, async boyitiş, taymer va testlarni bitta işlaydigan dasturga birlaştiruvçi log konveyerini yarating."
---

# Loyiha: Log konveyeri

![Rasm: Loyiha: Log konveyeri](/images/topics-webp-uzb/advanced-project.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Logni qatorma-qator tahlil qiladigan generatorlardan **dangasa konveyer** (lazy pipeline) qanday quriş
- Konveyer bosqiçlarini **dekorator** bilan qanday röyxatdan ötkaziş va ularni nomi böyiça tanlaş
- Xatti-harakatni **Strategy** (strategiya) funksiyalari bilan qanday almaştiriş va hisobotlarni **kontekst menejerlari** hamda `ExitStack` orqali qanday yoziş
- Oddiy dasturga `asyncio.gather` va semafor yordamida **async bosqiç** qanday qöşiş
- Konveyerning sof qismlarini oddiy `assert` va `pytest` bilan qanday testlaş
:::

## Nega bu muhim

Har bir veb-server **kirişlar jurnali**ni (access log) yozadi: har bir sörov uçun bitta qator, unda vaqt, sahifa, holat kodi va davomiylik bor. Toşkentdagi internet-dökon birdan sekinlaşib qolsa, kimdir şu logni oçadi va söraydi: qaysi sahifalar xato beryapti, qaysilari sekin va yomon sörovlar qayerdan kelyapti? Bu loyihada siz şu savollarga javob beradigan kiçik `logpipe` dasturini yaratasiz va bunda şu moduldagi barça vositalardan birgalikda foydalanasiz.

## Maqsad va imkoniyatlar

Dasturingiz kirişlar jurnalini öqiydi, buzilgan qatorlarni ötkazib yuboradi, sörovlarni filtrlaydi va guruhlaydi, ular qayerdan kelganini aniqlaydi va hisobotlar yozadi:

| Imkoniyat | Foydalaniladigan vositalar | Dars |
|---|---|---|
| Istalgan hajmdagi logni dangasa öqiş | generatorlar | *Iteratorlar va generatorlar* |
| Özgarmas, ixçam yozuvlar | `@dataclass(frozen=True, slots=True)` | *Python maʼlumot modeli* |
| Nomi böyiça tanlanadigan filtrlar | dekorator töldiradigan Registry | *Closure va dekoratorlar* |
| Yöl, holat yoki soat böyiça guruhlaş | Strategy funksiyalari | *Pythonça dizayn patternlar* |
| Doim yopiladigan hisobotlar | `@contextmanager`, `ExitStack` | *Kontekst menejerlarini çuqurroq örganiş* |
| Har bir IP uçun şaharni aniqlaş | `asyncio.gather`, `Semaphore` | *Async va await* |
| Har bir bosqiç vaqtini ölçaş | `@timer` dekoratori | *Xotira va samaradorlik* |
| Mantiqni tekşiriş | assertlar, `tmp_path` bilan `pytest` | *Testlaşni çuqurroq örganiş* |

## Loyihalaş

Log qatori mana bunday körinadi: `2026-09-16T10:03:21 GET /products/12 200 0.128 192.168.1.20`. Maydonlar: vaqt, metod, yöl, holat kodi, soniyalardagi davomiylik va mijoz IP manzili. Maʼlumotlar kiçik bosqiçlar orqali oqib ötadi:

![Diagramma: Log konveyeri tuzilmasi](/images/companions-webp-uzb/log-pipeline-architecture.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

```text
access.log
    |
    v
read_lines(path)            generator: böş bölmagan qatorlarni beradi
    |
    v
parse_entries(lines, bad)   generator: LogEntry beradi, buzilgan qatorlarni yiğadi
    |
    v
apply_filters(entries, ["no_static", "errors_only"])   nomlar -> FILTERS registri
    |
    +-----------------------------+
    v                             v
group_entries(entries, key)   await enrich(entries)     async: IP -> şahar
key = by_path | by_status | by_hour
    |
    v
report_file(path, title)    kontekst menejeri, har hisobotga bittadan (ExitStack)
```

Bosqiçlar **generatorlar**, şuning uçun bir xil kod kiçik namunani ham, 3 GB lik logni ham qayta işlaydi. Tahlil qiliş, filtrlaş va guruhlaş **sof** (pure) amallar (qiymat kiradi, qiymat çiqadi), şuning uçun ularni testlaş oson. Kiritiş va çiqariş esa **çekkalarda** turadi: faylni öqiş, geo-xizmat va hisobotlar.

## 1-qadam: Namuna log yaratiş va uni dangasa öqiş

Haqiqiy foydalanuvçi dasturga serverning log faylini beradi. Kod işga tuşa olişi uçun dastur avval namuna log yozadi, unda ataylab bitta buzilgan va bitta böş qator bor.

```python
from pathlib import Path

SAMPLE_LOG = """\
2026-09-16T09:58:10 GET /products 200 0.084 10.0.0.5
2026-09-16T09:59:41 GET /static/app.css 200 0.012 10.0.0.5
2026-09-16T10:01:02 GET /products/12 200 0.128 192.168.1.20
2026-09-16T10:15:02 GET /cart

2026-09-16T10:18:40 POST /login 401 0.310 203.0.113.7
"""
Path("access.log").write_text(SAMPLE_LOG, encoding="utf-8")

def read_lines(path):
    with open(path, encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if line:
                yield line

lines = read_lines("access.log")
print(type(lines).__name__)
print(next(lines))
print(sum(1 for _ in lines), "ta qator qoldi")
```

```text
generator
2026-09-16T09:58:10 GET /products 200 0.084 10.0.0.5
4 ta qator qoldi
```

`read_lines` **generator funksiyasini** çaqiriş hali heç narsani bajarmaydi. Fayl birinçi `next()` da oçiladi va sikl tugaganda yopiladi, çunki `with` generatorning içida joylaşgan. Böş qator ötkazib yuboriladi, şuning uçun `next()` dan keyin 4 ta qator qoladi.

## 2-qadam: Qatorlarni muzlatilgan dataclasslarga aylantiriş

Har bir qator `LogEntry` ga aylanadi. U **muzlatilgan** (frozen), şuning uçun filtr yozuvni tasodifan özgartira olmaydi (qiymat beriş `FrozenInstanceError` ni çaqiradi). U **`slots=True`** dan ham foydalanadi: minglab yozuvlar maydonlarni har biri uçun alohida `__dict__` örniga qatʼiy slotlarda saqlaydi va bu xotirani tejaydi (*Python maʼlumot modeli*).

```python
from dataclasses import dataclass
from datetime import datetime

@dataclass(frozen=True, slots=True)
class LogEntry:
    time: datetime
    method: str
    path: str
    status: int
    duration: float
    ip: str

    @property
    def hour(self):
        return self.time.strftime("%H:00")

def parse_line(line):
    parts = line.split()
    if len(parts) != 6:
        raise ValueError(f"6 ta maydon kutilgan, {len(parts)} ta keldi: {line!r}")
    stamp, method, path, status, duration, ip = parts
    return LogEntry(datetime.fromisoformat(stamp), method, path,
                    int(status), float(duration), ip)

entry = parse_line("2026-09-16T10:03:21 GET /products/12 200 0.128 192.168.1.20")
print(entry)
print(entry.hour, entry.status + 1)
print(hasattr(entry, "__dict__"))
```

```text
LogEntry(time=datetime.datetime(2026, 9, 16, 10, 3, 21), method='GET', path='/products/12', status=200, duration=0.128, ip='192.168.1.20')
10:00 201
False
```

`parse_line` turlarni darhol özgartiradi, şuning uçun keyingi bosqiçlar satrlarni emas, sonlarni taqqoslaydi. U maydonlar sonini qiymatlarni ajratişdan **oldin** tekşiradi va buzilgan qatorni öz içiga olgan `ValueError` ni çaqiradi.

Bitta yomon qator butun konveyerni töxtatmasligi kerak. Ikkinçi generator xatoni uşlaydi, qatorni eslab qoladi va davom etadi (blok qisqa bölişi uçun bu yerda yozuvda faqat ikkita maydon bor):

```python
from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class LogEntry:
    path: str
    status: int

def parse_line(line):
    parts = line.split()
    if len(parts) != 2:
        raise ValueError(f"2 ta maydon kutilgan, {len(parts)} ta keldi: {line!r}")
    return LogEntry(parts[0], int(parts[1]))

def parse_entries(lines, bad_lines):
    for number, line in enumerate(lines, start=1):
        try:
            yield parse_line(line)
        except ValueError as error:
            bad_lines.append((number, str(error)))

bad_lines = []
print(list(parse_entries(["/products 200", "/cart", "/checkout 5OO"], bad_lines)))
print(bad_lines)
```

```text
[LogEntry(path='/products', status=200)]
[(2, "2 ta maydon kutilgan, 1 ta keldi: '/cart'"), (3, "invalid literal for int() with base 10: '5OO'")]
```

`int("5OO")` (O harfi bilan) ham `ValueError` ni çaqiradi, şuning uçun bitta `except` buzilgan qatorning ikkala turini ham uşlaydi.

## 3-qadam: Dekorator bilan qurilgan filtrlar Registry si

Filtrlarni nomi böyiça tanlamoqçisiz, masalan, `--filter errors_only` buyruq qatori parametridan. Nomlardan funksiyalarga olib boradigan luğat şu işni qiladi, uni esa **dekorator fabrikasi** (decorator factory) töldiradi. Natijada yangi filtr qöşiş bitta dekoratorli funksiya yozişdan iborat böladi:

```python
from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class LogEntry:
    path: str
    status: int
    duration: float

FILTERS = {}

def filter_step(name):
    def register(func):
        if name in FILTERS:
            raise ValueError(f"{name!r} filtri allaqaçon röyxatdan ötgan")
        FILTERS[name] = func
        return func
    return register

@filter_step("no_static")
def no_static(entry):
    return not entry.path.startswith("/static/")

@filter_step("errors_only")
def errors_only(entry):
    return entry.status >= 400

@filter_step("slow")
def slow(entry):
    return entry.duration >= 0.5

def apply_filters(entries, names):
    steps = [FILTERS[name] for name in names]
    for entry in entries:
        if all(step(entry) for step in steps):
            yield entry

entries = [
    LogEntry("/static/app.css", 200, 0.012),
    LogEntry("/checkout", 500, 1.912),
    LogEntry("/products/99", 404, 0.020),
]
print(sorted(FILTERS))
print([e.path for e in apply_filters(entries, ["errors_only"])])
print([e.path for e in apply_filters(entries, ["errors_only", "slow"])])
```

```text
['errors_only', 'no_static', 'slow']
['/checkout', '/products/99']
['/checkout']
```

`filter_step("slow")` `register` ni qaytaradi: bu `name` ni eslab qoladigan closure. U `func` ni özgartirmasdan qaytaradi, şuning uçun `errors_only` töğridan-töğri testlaş mumkin bölgan oddiy funksiya bölib qoladi. `apply_filters` nomlarni sikldan **oldin** qidiradi, şuning uçun imlo xatosi ulkan faylning örtasida emas, darhol `KeyError` bilan yuzaga çiqadi. `"slow"` nomli ikkinçi filtrni röyxatdan ötkaziş `ValueError` ni çaqiradi (nega ekanini Köp uçraydigan xatolar bölimida körasiz).

## 4-qadam: Guruhlaş uçun Strategy funksiyalari

`if mode == "path": ... elif ...` zanjiri örniga guruhlaşning har bir usuli kalit qaytaradigan kiçik **Strategy** funksiyasi böladi, `group_entries` esa siz bergan istalgan Strategy ni qabul qiladi. *Pythonça dizayn patternlar* darsidagidek, klasslar kerak emas.

```python
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime

@dataclass(frozen=True, slots=True)
class LogEntry:
    time: datetime
    path: str
    status: int
    duration: float

def by_path(entry):
    return entry.path

def by_status(entry):
    return str(entry.status)

def by_hour(entry):
    return entry.time.strftime("%H:00")

GROUPINGS = {"path": by_path, "status": by_status, "hour": by_hour}

def group_entries(entries, key):
    counts = Counter()
    total_time = defaultdict(float)
    for entry in entries:
        group = key(entry)
        counts[group] += 1
        total_time[group] += entry.duration
    return [(group, count, round(total_time[group] / count, 3))
            for group, count in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))]

t = datetime.fromisoformat
entries = [
    LogEntry(t("2026-09-16T10:01:02"), "/products/12", 200, 0.128),
    LogEntry(t("2026-09-16T10:07:44"), "/checkout", 500, 1.912),
    LogEntry(t("2026-09-16T11:33:20"), "/checkout", 200, 0.910),
]
for name, strategy in GROUPINGS.items():
    print(name, group_entries(entries, strategy))
print("lambda", group_entries(entries, lambda e: e.status >= 400))
```

```text
path [('/checkout', 2, 1.411), ('/products/12', 1, 0.128)]
status [('200', 2, 0.519), ('500', 1, 1.912)]
hour [('10:00', 2, 1.02), ('11:00', 1, 0.91)]
lambda [(False, 2, 0.519), (True, 1, 1.912)]
```

Har bir qator `(guruh, soni, örtaça davomiylik)` körinişida. `(-soni, guruh)` saralaş kaliti eng katta guruhlarni birinçi qöyadi, teng bölganlarini esa alifbo böyiça tartiblaydi, şuning uçun natija barqaror. Oxirgi qator foydani körsatadi: yangi guruhlaş usuli, hatto bir martalik `lambda` ham, `group_entries` ni özgartirişni talab qilmaydi.

## 5-qadam: Kontekst menejeri orqali hisobotlar

Hisobot faylida sarlavha, qatorlar va yakuniy qator bor. Yarim yölda nimadir buzilsa ham fayl yopilişi, öquvçi esa hisobot çala qolganini körişi kerak. Generatorga asoslangan **kontekst menejeri** (context manager) bularning hammasini bitta joyda hal qiladi, `ExitStack` esa bir neçta hisobotni birdaniga boşqaradi:

```python
from contextlib import contextmanager, ExitStack
from pathlib import Path

@contextmanager
def report_file(path, title):
    file = open(path, "w", encoding="utf-8")
    try:
        file.write(f"== {title} ==\n")
        yield file
    except Exception:
        file.write("!! hisobot çala qoldi\n")
        raise
    else:
        file.write("== oxiri ==\n")
    finally:
        file.close()

try:
    with report_file("broken.txt", "soatlar böyiça sörovlar") as out:
        out.write("10:00  12\n")
        raise KeyError("hour")
except KeyError:
    print(Path("broken.txt").read_text(encoding="utf-8"), end="")
    print("yopildi:", out.closed)

groupings = {"status": ["200  14", "404   4"], "hour": ["10:00  13", "11:00  12"]}
with ExitStack() as stack:
    outputs = {name: stack.enter_context(report_file(f"by_{name}.txt", f"{name} böyiça sörovlar"))
               for name in groupings}
    for name, rows in groupings.items():
        outputs[name].write("\n".join(rows) + "\n")
    print("blok içida:", [out.closed for out in outputs.values()])

print("blokdan keyin:", [out.closed for out in outputs.values()])
print(Path("by_hour.txt").read_text(encoding="utf-8"), end="")
```

```text
== soatlar böyiça sörovlar ==
10:00  12
!! hisobot çala qoldi
yopildi: True
blok içida: [False, False]
blokdan keyin: [True, True]
== hour böyiça sörovlar ==
10:00  13
11:00  12
== oxiri ==
```

`except` bloki ogohlantiriş yozadi va xatoni **qayta çaqiradi**, şuning uçun xato yaşirilmaydi; `finally` esa faylni har qanday holatda yopadi. Hisobotlar soni faqat dastur işlayotganda maʼlum böladi, şuning uçun içma-iç `with` operatorlari bu yerda yaramaydi. **`ExitStack`** istalgan miqdordagi kontekst menejerlariga kiradi va bloki tugaganda, hatto bitta hisobot buzilsa ham, ularning hammasidan teskari tartibda çiqadi.

## 6-qadam: Async boyitiş bosqiçi

Jamoa yomon sörovlar qaysi şahardan kelayotganini bilmoqçi, bu esa har bir IP manzil uçun geo-IP veb-xizmatini çaqirişni anglatadi. Tarmoq çaqiruvlari asosan kutiş bilan ötadi, `async` esa aynan şunga mos: köp qidiruvlarni boşlang va ularni birgalikda kuting. Xizmatni sörovlarga kömib taşlamaslik uçun **semafor** (semaphore) bir vaqtda köpi bilan uçta qidiruvga ruxsat beradi.

Bu yerda veb-xizmat örnida luğat va `asyncio.sleep` işlaydi. *Async va await* darsidagidek, bu sahifadagi kod **yuqori darajadagi `await`** (top-level await) bilan işlaydi, çunki brauzerda event loop allaqaçon işlab turibdi:

```python
import asyncio

GEO_DB = {"10.0.0.5": "Toşkent", "192.168.1.20": "Samarqand",
          "172.16.0.8": "Buxoro", "203.0.113.7": "Namangan"}

async def lookup_city(ip, limit, stats):
    async with limit:
        stats["active"] += 1
        stats["peak"] = max(stats["peak"], stats["active"])
        await asyncio.sleep(0.05)
        stats["active"] -= 1
        return GEO_DB.get(ip, "Nomaʼlum")

async def enrich(ips, max_parallel=3):
    ips = sorted(set(ips))
    limit = asyncio.Semaphore(max_parallel)
    stats = {"active": 0, "peak": 0}
    cities = await asyncio.gather(*(lookup_city(ip, limit, stats) for ip in ips))
    return dict(zip(ips, cities)), stats["peak"]

requests_from = ["192.168.1.20", "172.16.0.8", "203.0.113.7", "45.33.10.2",
                 "10.0.0.5", "172.16.0.8", "192.168.1.20"]
cities, peak = await enrich(requests_from)
print(cities)
print("bir vaqtdagi eng köp qidiruvlar:", peak)
```

```text
{'10.0.0.5': 'Toşkent', '172.16.0.8': 'Buxoro', '192.168.1.20': 'Samarqand', '203.0.113.7': 'Namangan', '45.33.10.2': 'Nomaʼlum'}
bir vaqtdagi eng köp qidiruvlar: 3
```

`enrich` har bir **takrorlanmas** IP ni bir marta qidiradi: yetti sörov, beşta qidiruv. `asyncio.gather` natijalarni tugaş tartibida emas, **argumentlar tartibida** qaytaradi, şuning uçun `zip(ips, cities)` ularni töğri juftlaydi. Eng yuqori qiymat hisoblagiçi semafor işlayotganini isbotlaydi.

Oddiy skriptda işlab turgan event loop yöq va yuqori darajadagi `await` `SyntaxError` böladi. Işni `async def main()` ga joylang va uni `asyncio.run()` bilan işga tuşiring:

```py
async def main():
    cities, peak = await enrich(requests_from)
    print(cities)

if __name__ == "__main__":
    asyncio.run(main())
```

## 7-qadam: Har bir bosqiç vaqtini dekorator bilan ölçaş

Qaysi bosqiç sekin? `@timer` dekoratori har bir çaqiruv qança vaqt olganini yozib boradi. Korutina funksiyasi atrofidagi oddiy örovçi funksiya (wrapper) faqat korutinani **yaratiş** vaqtini (deyarli nol) ölçagan bölardi, şuning uçun dekorator korutinalar uçun `async` örovçini qaytaradi:

```python
import asyncio
import time
from functools import wraps
from inspect import iscoroutinefunction

TIMINGS = {}

def timer(func):
    if iscoroutinefunction(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            start = time.perf_counter()
            try:
                return await func(*args, **kwargs)
            finally:
                TIMINGS[func.__name__] = time.perf_counter() - start
        return async_wrapper

    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            TIMINGS[func.__name__] = time.perf_counter() - start
    return wrapper

@timer
def parse(n):
    return [str(i) for i in range(n)]

@timer
async def enrich(n):
    await asyncio.sleep(0.2)
    return n

parse(10_000)
await enrich(3)
for name, seconds in TIMINGS.items():
    print(f"{name:<8} {round(seconds, 1)} s")
```

```text
parse    0.0 s
enrich   0.2 s
```

Sizdagi sonlar biroz farq qilişi mumkin. `finally` bosqiç xato çaqirganda ham vaqtni yozib qöyadi. Xom soniyalar har işga tuşirişda özgaradi, şuning uçun töliq dastur har bir bosqiçni 2 soniyalik **vaqt limiti** bilan taqqoslaydi va `ok` yoki `SEKIN` deb çop etadi.

## Töliq dastur

Mana hammasi birgalikda, uzunroq namuna log bilan. Uni skript sifatida işlatiş uçun `logpipe.py` nomi bilan saqlang, oxirgi qatorni `asyncio.run(main())` bilan almaştiring va namunani yozadigan qatorni öçiring.

```python
import asyncio
import time
from collections import Counter, defaultdict
from contextlib import ExitStack, contextmanager
from dataclasses import dataclass
from datetime import datetime
from functools import wraps
from inspect import iscoroutinefunction
from pathlib import Path

SAMPLE_LOG = """\
2026-09-16T09:58:10 GET /products 200 0.084 10.0.0.5
2026-09-16T09:59:41 GET /static/app.css 200 0.012 10.0.0.5
2026-09-16T10:01:02 GET /products/12 200 0.128 192.168.1.20
2026-09-16T10:03:21 GET /products/12 200 0.131 192.168.1.20
2026-09-16T10:04:05 POST /cart 201 0.240 192.168.1.20
2026-09-16T10:05:17 GET /products/99 404 0.020 172.16.0.8
2026-09-16T10:07:44 POST /checkout 500 1.912 192.168.1.20
2026-09-16T10:09:30 GET /static/logo.png 200 0.009 172.16.0.8
2026-09-16T10:12:55 GET /products 200 0.091 203.0.113.7
2026-09-16T10:15:02 GET /cart
2026-09-16T10:18:40 POST /login 401 0.310 203.0.113.7
2026-09-16T10:25:11 GET /products/12 200 0.140 198.51.100.4
2026-09-16T10:31:26 POST /checkout 200 0.870 198.51.100.4
2026-09-16T10:44:09 GET /admin 403 0.015 45.33.10.2
2026-09-16T11:02:14 GET /products 200 0.088 172.16.0.8
2026-09-16T11:05:50 POST /cart 201 0.230 172.16.0.8
2026-09-16T11:06:31 POST /checkout 502 2.405 172.16.0.8
2026-09-16T11:14:48 GET /products/12 200 0.133 45.33.10.2
2026-09-16T11:20:05 GET /wp-login.php 404 0.018 45.33.10.2
2026-09-16T11:20:06 GET /.env 404 0.017 45.33.10.2
2026-09-16T11:33:20 POST /checkout 200 0.910 10.0.0.5
2026-09-16T11:48:33 POST /cart 201 0.225 203.0.113.7
2026-09-16T11:52:08 GET /products/99 404 0.021 203.0.113.7
2026-09-16T11:58:46 POST /checkout 500 1.650 203.0.113.7
"""

GEO_DB = {
    "10.0.0.5": "Toşkent",
    "192.168.1.20": "Samarqand",
    "172.16.0.8": "Buxoro",
    "203.0.113.7": "Namangan",
    "198.51.100.4": "Toşkent",
}

TIMINGS = {}


def timer(func):
    if iscoroutinefunction(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            start = time.perf_counter()
            try:
                return await func(*args, **kwargs)
            finally:
                TIMINGS[func.__name__] = time.perf_counter() - start
        return async_wrapper

    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            TIMINGS[func.__name__] = time.perf_counter() - start
    return wrapper


@dataclass(frozen=True, slots=True)
class LogEntry:
    time: datetime
    method: str
    path: str
    status: int
    duration: float
    ip: str

    @property
    def hour(self):
        return self.time.strftime("%H:00")


def read_lines(path):
    with open(path, encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if line:
                yield line


def parse_line(line):
    parts = line.split()
    if len(parts) != 6:
        raise ValueError(f"6 ta maydon kutilgan, {len(parts)} ta keldi: {line!r}")
    stamp, method, path, status, duration, ip = parts
    return LogEntry(datetime.fromisoformat(stamp), method, path,
                    int(status), float(duration), ip)


def parse_entries(lines, bad_lines):
    for number, line in enumerate(lines, start=1):
        try:
            yield parse_line(line)
        except ValueError as error:
            bad_lines.append((number, str(error)))


FILTERS = {}


def filter_step(name):
    def register(func):
        if name in FILTERS:
            raise ValueError(f"{name!r} filtri allaqaçon röyxatdan ötgan")
        FILTERS[name] = func
        return func
    return register


@filter_step("no_static")
def no_static(entry):
    return not entry.path.startswith("/static/")


@filter_step("errors_only")
def errors_only(entry):
    return entry.status >= 400


@filter_step("slow")
def slow(entry):
    return entry.duration >= 0.5


def apply_filters(entries, names):
    steps = [FILTERS[name] for name in names]
    for entry in entries:
        if all(step(entry) for step in steps):
            yield entry


def by_path(entry):
    return entry.path


def by_status(entry):
    return str(entry.status)


def by_hour(entry):
    return entry.hour


GROUPINGS = {"path": by_path, "status": by_status, "hour": by_hour}


def group_entries(entries, key):
    counts = Counter()
    total_time = defaultdict(float)
    for entry in entries:
        group = key(entry)
        counts[group] += 1
        total_time[group] += entry.duration
    return [(group, count, round(total_time[group] / count, 3))
            for group, count in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))]


async def lookup_city(ip, limit, stats):
    async with limit:
        stats["active"] += 1
        stats["peak"] = max(stats["peak"], stats["active"])
        await asyncio.sleep(0.05)
        stats["active"] -= 1
        return GEO_DB.get(ip, "Nomaʼlum")


@timer
async def enrich(entries, max_parallel=3):
    ips = sorted({entry.ip for entry in entries})
    limit = asyncio.Semaphore(max_parallel)
    stats = {"active": 0, "peak": 0}
    cities = await asyncio.gather(*(lookup_city(ip, limit, stats) for ip in ips))
    return dict(zip(ips, cities)), stats["peak"]


@contextmanager
def report_file(path, title):
    file = open(path, "w", encoding="utf-8")
    try:
        file.write(f"== {title} ==\n")
        yield file
    except Exception:
        file.write("!! hisobot çala qoldi\n")
        raise
    else:
        file.write("== oxiri ==\n")
    finally:
        file.close()


@timer
def load(path, bad_lines):
    return list(parse_entries(read_lines(path), bad_lines))


@timer
def write_reports(entries, names):
    paths = []
    with ExitStack() as stack:
        for name in names:
            path = f"by_{name}.txt"
            out = stack.enter_context(report_file(path, f"{name} böyiça sörovlar"))
            for group, count, avg in group_entries(entries, GROUPINGS[name]):
                out.write(f"{group:<16}{count:>3}{avg:>8.3f}s\n")
            paths.append(path)
    return paths


async def main():
    Path("access.log").write_text(SAMPLE_LOG, encoding="utf-8")

    bad_lines = []
    entries = load("access.log", bad_lines)
    print(f"{len(entries)} ta yozuv öqildi, {len(bad_lines)} ta ötkazib yuborildi")
    for number, message in bad_lines:
        print(f"  {number}-qator: {message}")

    visible = list(apply_filters(entries, ["no_static"]))
    problems = list(apply_filters(visible, ["errors_only"]))
    print(f"Statik fayllarsiz: {len(visible)}, xatolar: {len(problems)}")

    cities, peak = await enrich(visible)
    print(f"{len(cities)} ta IP qidirildi, bir vaqtda köpi bilan {peak} ta")

    print("Şaharlar böyiça xatolar:", Counter(cities[e.ip] for e in problems).most_common())

    print("\nSekin sörovlar:")
    for entry in apply_filters(visible, ["slow"]):
        print(f"  {entry.hour}  {entry.method:<5}{entry.path:<12}{entry.duration:.3f}s  {cities[entry.ip]}")

    paths = write_reports(visible, ["status", "hour", "path"])
    print()
    print(Path(paths[0]).read_text(encoding="utf-8"), end="")
    print("Saqlandi:", ", ".join(paths))

    print("\nVaqtlar:")
    for name, seconds in TIMINGS.items():
        print(f"  {name:<14}{'ok' if seconds < 2 else 'SEKIN'}")


await main()
```

```text
23 ta yozuv öqildi, 1 ta ötkazib yuborildi
  10-qator: 6 ta maydon kutilgan, 3 ta keldi: '2026-09-16T10:15:02 GET /cart'
Statik fayllarsiz: 21, xatolar: 9
6 ta IP qidirildi, bir vaqtda köpi bilan 3 ta
Şaharlar böyiça xatolar: [('Namangan', 3), ('Nomaʼlum', 3), ('Buxoro', 2), ('Samarqand', 1)]

Sekin sörovlar:
  10:00  POST /checkout   1.912s  Samarqand
  10:00  POST /checkout   0.870s  Toşkent
  11:00  POST /checkout   2.405s  Buxoro
  11:00  POST /checkout   0.910s  Toşkent
  11:00  POST /checkout   1.650s  Namangan

== status böyiça sörovlar ==
200               9   0.286s
404               4   0.019s
201               3   0.232s
500               2   1.781s
401               1   0.310s
403               1   0.015s
502               1   2.405s
== oxiri ==
Saqlandi: by_status.txt, by_hour.txt, by_path.txt

Vaqtlar:
  load          ok
  enrich        ok
  write_reports ok
```

Butun konveyerni köriş uçun `main()` ni yuqoridan pastga öqing. `load()` generatorlarga `list()` ni qöllaydigan yagona joy, çunki yozuvlar keyin bir neçta marta işlatiladi.

## Sof funksiyalarni testlaş

Sof funksiyalarni testlaş uçun na fayllar, na event loop kerak. Haqiqiy loyihada testlar `from logpipe import ...` bilan boşlanadigan `test_logpipe.py` fayliga joylanadi; bu yerda blok mustaqil işlaşi uçun funksiyalar takrorlangan:

```python
from collections import Counter
from dataclasses import dataclass
from datetime import datetime

@dataclass(frozen=True, slots=True)
class LogEntry:
    time: datetime
    method: str
    path: str
    status: int
    duration: float
    ip: str

def parse_line(line):
    parts = line.split()
    if len(parts) != 6:
        raise ValueError(f"6 ta maydon kutilgan, {len(parts)} ta keldi: {line!r}")
    stamp, method, path, status, duration, ip = parts
    return LogEntry(datetime.fromisoformat(stamp), method, path,
                    int(status), float(duration), ip)

def errors_only(entry):
    return entry.status >= 400

def slow(entry):
    return entry.duration >= 0.5

def group_counts(entries, key):
    counts = Counter(key(entry) for entry in entries)
    return sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))

LINE = "2026-09-16T10:07:44 POST /checkout 500 1.912 192.168.1.20"

def test_parse_line_converts_types():
    entry = parse_line(LINE)
    assert (entry.status, entry.duration, entry.time.hour) == (500, 1.912, 10)

def test_parse_line_rejects_missing_fields():
    try:
        parse_line("2026-09-16T10:15:02 GET /cart")
    except ValueError as error:
        assert "3 ta keldi" in str(error)
    else:
        assert False, "ValueError kutilgan edi"

def test_filters_boundaries():
    assert errors_only(parse_line(LINE.replace(" 500 ", " 400 ")))
    assert not errors_only(parse_line(LINE.replace(" 500 ", " 399 ")))
    assert slow(parse_line(LINE.replace("1.912", "0.500")))

def test_grouping_sorts_by_count_then_name():
    entries = [parse_line(LINE.replace(" 500 ", f" {s} ")) for s in (404, 200, 404, 500)]
    assert group_counts(entries, lambda e: e.status) == [(404, 2), (200, 1), (500, 1)]
    assert group_counts([], lambda e: e.status) == []

for test in [test_parse_line_converts_types, test_parse_line_rejects_missing_fields,
             test_filters_boundaries, test_grouping_sorts_by_count_then_name]:
    test()
    print("ötdi:", test.__name__)
```

```text
ötdi: test_parse_line_converts_types
ötdi: test_parse_line_rejects_missing_fields
ötdi: test_filters_boundaries
ötdi: test_grouping_sorts_by_count_then_name
```

Testlar **çegaraviy qiymatlarni** (399 va 400, aynan 0.5) tekşiradi, çunki birga adaşiş xatolari aynan şu yerda yaşaydi. Fayl öqiş va hisobotlar uçun haqiqiy papka kerak: öz kompyuteringizda *Testlaşni çuqurroq örganiş* darsidagi `pytest` ning `tmp_path` fixturesi har bir testga yangi papka beradi:

```py
# test_logpipe.py
import pytest
from logpipe import read_lines, report_file


def test_read_lines_skips_blank_lines(tmp_path):
    log = tmp_path / "access.log"
    log.write_text("a\n\n  \nb\n", encoding="utf-8")
    assert list(read_lines(log)) == ["a", "b"]


def test_report_file_marks_aborted_report(tmp_path):
    path = tmp_path / "report.txt"
    with pytest.raises(KeyError):
        with report_file(path, "t") as out:
            raise KeyError("hour")
    assert out.closed
    assert path.read_text(encoding="utf-8").endswith("!! hisobot çala qoldi\n")
```

```text
$ pytest -q test_logpipe.py
..                                                                       [100%]
2 passed in 0.01s
```

## Özingiz sinab köring

Konveyerning kiçik versiyasi şu yerda işlaydi. `ACTIVE` ni `["slow"]` yoki `["errors_only", "slow"]` ga, `GROUP_BY` ni esa `lambda entry: entry.method` ga özgartiring.

<ClientOnly><PythonPlayground :code='"from collections import Counter\nfrom dataclasses import dataclass\n\nLOG = \"\"\"\\\n2026-09-16T10:03:21 GET /products/12 200 0.128 192.168.1.20\n2026-09-16T10:05:17 GET /products/99 404 0.020 172.16.0.8\n2026-09-16T10:07:44 POST /checkout 500 1.912 192.168.1.20\n2026-09-16T11:06:31 POST /checkout 502 2.405 172.16.0.8\n2026-09-16T11:33:20 POST /checkout 200 0.910 10.0.0.5\"\"\"\n\n@dataclass(frozen=True, slots=True)\nclass LogEntry:\n    stamp: str\n    method: str\n    path: str\n    status: int\n    duration: float\n    ip: str\n\ndef parse_line(line):\n    stamp, method, path, status, duration, ip = line.split()\n    return LogEntry(stamp, method, path, int(status), float(duration), ip)\n\nFILTERS = {}\n\ndef filter_step(name):\n    def register(func):\n        FILTERS[name] = func\n        return func\n    return register\n\n@filter_step(\"errors_only\")\ndef errors_only(entry):\n    return entry.status >= 400\n\n@filter_step(\"slow\")\ndef slow(entry):\n    return entry.duration >= 0.5\n\n# Filtrlarni va guruhlaş kalitini özgartiring:\nACTIVE = [\"errors_only\"]\nGROUP_BY = lambda entry: entry.path\n\nentries = (parse_line(line) for line in LOG.splitlines())\nkept = [e for e in entries if all(FILTERS[name](e) for name in ACTIVE)]\nprint(\"Qolgan yozuvlar:\", len(kept))\nfor group, count in Counter(GROUP_BY(e) for e in kept).most_common():\n    print(f\"  {group:<16}{count}\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Maydoni yetişmaydigan qatorni ajratiş

```py
line = "2026-09-16T10:15:02 GET /cart"
stamp, method, path, status, duration, ip = line.split()
```

```text
ValueError: not enough values to unpack (expected 6, got 3)
```

Bitta çala qator butun konveyerni töxtatadi. **Tuzatiş:** `len(parts)` ni tekşiring, tuşunarli `ValueError` çaqiring va qatorni yozib qöyib ötkazib yuboriş uçun uni `parse_entries` da uşlang.

### 2. Takroriy filtr nomi birinçisini jimgina ustidan yozadi

```python
FILTERS = {}

def filter_step(name):
    def register(func):
        FILTERS[name] = func
        return func
    return register

@filter_step("slow")
def slow(duration):
    return duration >= 0.5

@filter_step("slow")          # nusxalangan, "very_slow" bölişi kerak edi
def very_slow(duration):
    return duration >= 2.0

print(FILTERS["slow"].__name__, FILTERS["slow"](0.9))
```

```text
very_slow False
```

Xato yöq, lekin endi `slow` 0.5 dan 2 soniyagaça bölgan sörovlarni jimgina taşlab yuboradi. **Tuzatiş:** 3-qadamdagidek, dekoratorda `name in FILTERS` bölsa `ValueError` çaqiring.

### 3. Generatordan ikki marta foydalaniş

```python
def parse_entries(lines):
    for line in lines:
        yield line.split()

entries = parse_entries(["/products 200", "/checkout 500", "/cart 404"])
errors = [e for e in entries if int(e[1]) >= 400]
paths = [e[0] for e in entries]
print(len(errors), "ta xato")
print(paths)
```

```text
2 ta xato
[]
```

Birinçi comprehension generatorni tugatib qöydi, şuning uçun ikkinçisi heç narsa olmaydi va xato ham çiqmaydi. **Tuzatiş:** natijalar bir martadan köp kerak bölsa, `load()` dagidek bir marta röyxat yarating (`entries = list(...)`).

### 4. Boyitiş korutinasini await qilişni unutiş

```py
async def main():
    cities = enrich(problems)          # Yomon: await yöq
    print(cities.get("10.0.0.5"))
```

```text
AttributeError: 'coroutine' object has no attribute 'get'
RuntimeWarning: coroutine 'enrich' was never awaited
```

`async def` funksiyasini çaqiriş faqat **korutina** (coroutine) yaratadi, uning kodi esa umuman bajarilmaydi. **Tuzatiş:** `cities, peak = await enrich(problems)` deb yozing (`enrich` kortej qaytaradi).

## Qöşimça topşiriqlar

Bular loyihani kengaytiradi. Maslahatlarni oçişdan oldin har birini özingiz sinab köring.

### 1. Buyruq qatori interfeysi <Difficulty level="1" />

Konveyerni `python logpipe.py access.log --filter errors_only --group-by path` körinişida işga tuşiring. Buning uçun terminal kerak, şuning uçun uni öz kompyuteringizda bajaring.

::: details Maslahatlar
- `argparse` va `add_argument("--filter", action="append", default=[], choices=sorted(FILTERS))` dan foydalaning; `choices` nomaʼlum nomlarni özi rad etadi.
- Argumentlarni `main()` da tahlil qiling va sof funksiyalarga oddiy qiymatlarni uzating.
:::

### 2. JSON hisobot <Difficulty level="1" />

Qöşimça ravişda `report.json` ni saqlang: unda har bir guruhlaş `{"group": "/checkout", "count": 5, "avg_duration": 1.549}` kabi obyektlar röyxati bölsin.

::: details Maslahatlar
- `group_entries` qatorlaridan comprehension bilan luğatlar quring, keyin `json.dumps(data, indent=2)` ni çaqiring.
- `report_file` JSON ni buzadigan sarlavha va yakuniy qator qöşadi, şuning uçun `Path.write_text` dan foydalaning.
:::

### 3. Top-N va vaqt oynalari <Difficulty level="2" />

Eng sekin beşta sörovni va har bir 15 daqiqalik oynadagi xatolar sonini çop eting.

::: details Maslahatlar
- `heapq.nlargest(5, entries, key=lambda e: e.duration)` hammasini saralamasdan faqat beşta elementni saqlaydi.
- Oyna kaliti bu şunçaki yana bir Strategy: `entry.time.replace(minute=entry.time.minute // 15 * 15, second=0)`.
:::

### 4. Plagin modulidan filtrlar <Difficulty level="2" />

`suspicious` filtrini (`/.env` kabi yöllar uçun) `security_filters.py` ga joylang, uni `@filter_step` bilan röyxatdan ötkazing va `--plugin security_filters` bilan yuklang.

::: details Maslahatlar
- `FILTERS` va `filter_step` ni `registry.py` ga köçiring, şunda dastur va plagin bitta luğatdan foydalanadi.
- `importlib.import_module(name)` plaginni işga tuşiradi, uning dekoratorlari esa filtrlarni röyxatdan ötkazadi.
:::

### 5. Ulkan fayllar uçun stream rejimi <Difficulty level="3" />

`--stream` parametrini qöşing: yozuvlarga heç qaçon `list()` ni çaqirmang, barça guruhlaşlarni bitta ötişda hisoblang va 200,000 qatorli yaratilgan logda xotiradan eng köp foydalanişni `tracemalloc` bilan taqqoslang.

::: details Maslahatlar
- Har bir yozuv uçun har bir guruhlaşning bittadan `Counter` ini yangilang. `itertools.tee` jozibali körinadi, lekin u elementlarni röyxat kabi buferda saqlaydi.
- `tracemalloc.start()`, konveyerni işga tuşiring, keyin `tracemalloc.get_traced_memory()[1]` eng yuqori qiymatni beradi, *Xotira va samaradorlik* darsidagidek.
- Async bosqiç uçun takrorlanmas IP larni ötiş davomida töplamga yiğing; u kiçikligiça qoladi.
:::

## Xulosa

- **Generatorlarni** zanjir qilib ulang: har bir bosqiç bir vaqtda bitta elementni qayta işlaydi va dastur ulkan fayllarga ham bardoş beradi.
- Qatorlarni erta **muzlatilgan, slotli dataclass** ga aylantiring: turlangan, özgarmas va xotirani tejaydigan yozuvlar.
- **Dekorator töldiradigan Registry** bosqiçlarni nomi böyiça qöşadi; uni takroriy nomlardan himoyalang.
- **Strategy funksiyalari** `if`/`elif` zanjirlarining örnini egallaydi, `ExitStack` bilan **kontekst menejerlari** esa istalgan miqdordagi çiqişlarni toza yopadi.
- `gather` va `Semaphore` bilan **async bosqiç** kiritiş-çiqariş kutişlarini tezlaştiradi, faqat har bir korutina await qilinişi kerak.
- Mantiqni sof, kiritiş-çiqarişni çekkalarda saqlang; sof qismlarni oddiy assertlar bilan, qolganini `pytest` va `tmp_path` bilan testlang.

## Qöşimça manbalar

- [`contextlib.ExitStack`](https://docs.python.org/3/library/contextlib.html#contextlib.ExitStack)
- [`asyncio` synchronization primitives: `Semaphore`](https://docs.python.org/3/library/asyncio-sync.html#asyncio.Semaphore)
- [`dataclasses`: frozen and slots](https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass)
- [Generator Tricks for Systems Programmers (David Beazley)](https://www.dabeaz.com/generators/)
