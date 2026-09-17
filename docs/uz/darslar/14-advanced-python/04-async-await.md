---
title: Async va await
description: "async def va await bilan asinxron Python yoziş: gather, vazifalar va TaskGroup bilan korutinalarni bir vaqtda işga tuşiriş, timeout qöşiş, işni asyncio.Queue orqali uzatiş va async qaçon foyda berişini biliş."
---

# Async va await

::: tip Nimalarni örganasiz
- **Korutina** (coroutine) nima va dastur kutayotganda `await` nima qiladi
- `asyncio.gather`, `create_task` va `TaskGroup` bilan korutinalarni qanday qilib **bir vaqtda** (concurrently) işga tuşiriş
- Sekin işni `asyncio.timeout` bilan qanday töxtatiş
- Işlab çiqaruvçilar va isteʼmolçilar işni `asyncio.Queue` orqali qanday bölişadi
- Async qaçon yordam beradi (I/O ni kutiş) va qaçon yordam bermaydi (oğir hisob-kitoblar)
:::

## Nega bu muhim

Valyuta ilovasi Toşkentdagi önta ayirboşlaş şoxobçasidan bugungi dollar kursini söraydi. Har bir javob bir soniya oladi va şu soniya davomida kompyuter şunçaki **kutadi**. Şoxobçalarni birin-ketin söraş ön soniya oladi; `async` va `await` bilan esa dastur önta sörovni birdaniga yuboradi va taxminan bir soniyada tugatadi.

## Korutinalar va `await`

`async def` bilan aniqlangan funksiyani çaqiriş uning tanasini bajarmaydi; u xuddi generator funksiya (*Iteratorlar va generatorlar*) kabi **korutina** obyektini qaytaradi. Tana siz uni `await` qilganingizda bajariladi. `await` "şu yerda bu tugagunça pauza qil, bu orada boşqa işlar bajarilaversin" degan maʼnoni anglatadi.

`asyncio.sleep` sekin tarmoq sörovi örnida işlatiladi:

```python
import asyncio
import time

async def fetch_price(city, delay):
    await asyncio.sleep(delay)          # serverni kutayotgandek qilamiz
    return f"{city}: 12,650 söm"

async def main():
    start = time.perf_counter()
    for city, delay in [("Toşkent", 0.1), ("Samarqand", 0.2), ("Buxoro", 0.3)]:
        print(await fetch_price(city, delay))
    print(f"{time.perf_counter() - start:.1f} s ketdi")

await main()
```

```text
Toşkent: 12,650 söm
Samarqand: 12,650 söm
Buxoro: 12,650 söm
0.6 s ketdi
```

Birinçi korutinani nimadir işga tuşirişi kerak: bu **event loop** (hodisalar sikli), korutinalarni bajaradigan rejalaştiruvçi. Korutina `await` da pauza qilganda, u tayyor turgan boşqa korutinaga ötadi.

::: info Skriptlar va bu sahifa
Bu saytdagi muharrirda, xuddi Jupyter dagidek, event loop allaqaçon işlab turadi, şuning uçun misollar yuqori darajadagi `await main()` bilan tugaydi. Oddiy `.py` faylda loopni özingiz `asyncio.run()` bilan işga tuşirasiz:

```py
import asyncio

async def main():
    print("Salom!")

if __name__ == "__main__":
    asyncio.run(main())
```
:::

## `gather` bilan bir vaqtda işga tuşiriş

Yuqoridagi sikl bitta sörovni tugatib, keyin navbatdagisini boşlaydi. `asyncio.gather` hammasini birdaniga boşlaydi va har birini kutadi. Natijalar **siz bergan tartibda** qaytadi:

```python
import asyncio
import time

async def fetch_price(city, delay):
    await asyncio.sleep(delay)
    print(f"  {city} javob berdi")
    return f"{city}: 12,650 söm"

async def main():
    start = time.perf_counter()
    results = await asyncio.gather(
        fetch_price("Buxoro", 0.3),
        fetch_price("Toşkent", 0.1),
        fetch_price("Samarqand", 0.2),
    )
    print(results)
    print(f"{time.perf_counter() - start:.1f} s ketdi")

await main()
```

```text
  Toşkent javob berdi
  Samarqand javob berdi
  Buxoro javob berdi
['Buxoro: 12,650 söm', 'Toşkent: 12,650 söm', 'Samarqand: 12,650 söm']
0.3 s ketdi
```

Umumiy vaqt yiğindi (0.6 s) emas, balki **eng uzun** kutiş (0.3 s) va baribir faqat bitta oqim (thread) işlaydi.

## Vazifalar va event loop

`asyncio.create_task(coro)` korutinani **vazifaga** (task) öraydi; vazifa joriy korutina pauza qilişi bilanoq boşlanadi. Natijani oliş uçun vazifani keyinroq `await` qiling:

```python
import asyncio

async def cook(dish, minutes):
    print(f"{dish} boşlandi")
    await asyncio.sleep(minutes / 100)
    print(f"{dish} tayyor")
    return dish

async def main():
    plov = asyncio.create_task(cook("palov", 20))
    samsa = asyncio.create_task(cook("somsa", 10))
    print("vazifalar yaratildi")
    await asyncio.sleep(0)            # vazifalar boşlanişi uçun bir marta pauza
    print("dasturxon tuzalmoqda")
    print("tortildi:", await plov, await samsa)

await main()
```

```text
vazifalar yaratildi
palov boşlandi
somsa boşlandi
dasturxon tuzalmoqda
somsa tayyor
palov tayyor
tortildi: palov somsa
```

`main` pauza qilmagunça heç narsa bajarilmadi: korutinalar **faqat `await` da** almaşadi.

### `TaskGroup`

`asyncio.TaskGroup` (Python 3.11+) bir neça vazifani boşlaşning xavfsizroq usuli. Uning `async with` blokida yaratilgan har bir vazifa blok tugaganda kutiladi; bittasi xato bersa, qolganlari bekor qilinadi:

```python
import asyncio

async def fetch_rate(office, delay):
    await asyncio.sleep(delay)
    if office == "Çorsu":
        raise ConnectionError(f"{office} tarmoqda emas")
    return 12_650

async def main():
    async with asyncio.TaskGroup() as tg:
        a = tg.create_task(fetch_rate("Amir Temur", 0.1))
    print("kurs:", a.result())

    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(fetch_rate("Çorsu", 0.1))
            tg.create_task(fetch_rate("Yunusobod", 0.5))
    except* ConnectionError as group:
        print("xato:", group.exceptions[0])

await main()
```

```text
kurs: 12650
xato: Çorsu tarmoqda emas
```

Xatolar `ExceptionGroup` körinişida keladi va `except*` bilan uşlanadi. Sekin Yunusobod vazifasi bekor qilindi.

## Timeoutlar

Heç qaçon javob bermaydigan server dasturingizni qotirib qöymasligi kerak. `asyncio.timeout(seconds)` (3.11+) içidagi işni bekor qiladi va `TimeoutError` çaqiradi:

```python
import asyncio

async def fetch_price(city, delay):
    await asyncio.sleep(delay)
    return f"{city}: 12,650 söm"

async def main():
    for city, delay in [("Toşkent", 0.05), ("Nukus", 1.0)]:
        try:
            async with asyncio.timeout(0.2):
                print(await fetch_price(city, delay))
        except TimeoutError:
            print(f"{city}: vaqtida javob bermadi")

await main()
```

```text
Toşkent: 12,650 söm
Nukus: vaqtida javob bermadi
```

## Navbatlar: işlab çiqaruvçilar va isteʼmolçilar

`asyncio.Queue` elementlarni korutinalar orasida uzatadi. **Işlab çiqaruvçi** (producer) işni navbatga qöyadi; **isteʼmolçilar** (consumer) uni `await queue.get()` bilan oladi, navbat böş bölsa u pauza qiladi. `task_done()` va `await queue.join()` har bir element qayta işlangunça kutadi:

```python
import asyncio

async def producer(queue):
    for order in ["palov", "somsa", "lağmon", "manti"]:
        await queue.put(order)
        print(f"{order} buyurtma qilindi")

async def cook(name, seconds, queue):
    while True:
        order = await queue.get()
        await asyncio.sleep(seconds)
        print(f"{name} {order} tayyorladi")
        queue.task_done()

async def main():
    queue = asyncio.Queue()
    cooks = [asyncio.create_task(cook(n, s, queue)) for n, s in [("Aziza", 0.1), ("Bobur", 0.25)]]
    await producer(queue)
    await queue.join()
    for c in cooks:
        c.cancel()

await main()
```

```text
palov buyurtma qilindi
somsa buyurtma qilindi
lağmon buyurtma qilindi
manti buyurtma qilindi
Aziza palov tayyorladi
Aziza lağmon tayyorladi
Bobur somsa tayyorladi
Aziza manti tayyorladi
```

Tezroq işlaydigan Aziza uçta buyurtmani oladi. Oşpazlar çeksiz aylanadi, şuning uçun `main` ularni bekor qiladi.

## `async for` va `async with`

Içida `yield` bor `async def` funksiya - **async generator**; u böylab `async for message in chat.messages():` bilan aylanasiz va sikl elementlar orasida pauza qilişi mumkin. *Kontekst menejerlarini çuqurroq örganiş* darsidagi asinxron kontekst menejerlariga, masalan `TaskGroup` yoki maʼlumotlar bazasiga ulanişga, `async with` bilan kiriladi, çunki ulaniş ham, uziliş ham kutişni talab qilişi mumkin.

## Async qaçon yordam beradi

Async köp sonli tarmoq sörovlari, maʼlumotlar bazasi sörovlari va yuklab olişlarda hamda minglab ulanişlarni uşlab turadigan serverlarda yordam beradi <Yes />. Oğir hisob-kitoblarda yoki bloklaydigan kutubxonalarda (`time.sleep`, `requests`) yordam bermaydi <No />: ular heç qaçon `await` ga yetib bormaydi, şuning uçun boşqa heç narsa bajarilmaydi. Protsessorni kuçli yuklaydigan iş uçun *Oqimlar va jarayonlar* darsiga qarang. Haqiqiy dasturlar HTTP sörovlarini `aiohttp` yoki `httpx` kabi async kutubxonalar bilan yuboradi; bu sahifada tarmoq yöq, şuning uçun misollar `asyncio.sleep` dan foydalanadi.

## Özingiz sinab köring

Törtinçi şahar qöşing yoki timeoutni 0.5 ga özgartirib, endi qaysi şaharlar javob berişini köring.

<ClientOnly><PythonPlayground :code='"import asyncio\n\nasync def fetch_price(city, delay):\n    await asyncio.sleep(delay)\n    return f\"{city}: 12,650 söm\"\n\nasync def safe_fetch(city, delay):\n    try:\n        async with asyncio.timeout(0.3):\n            return await fetch_price(city, delay)\n    except TimeoutError:\n        return f\"{city}: vaqt tugadi\"\n\nasync def main():\n    results = await asyncio.gather(\n        safe_fetch(\"Toşkent\", 0.1),\n        safe_fetch(\"Samarqand\", 0.2),\n        safe_fetch(\"Nukus\", 0.8),\n    )\n    for line in results:\n        print(line)\n\nawait main()"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `await` ni unutiş

```py
import asyncio

async def fetch_price(city):
    await asyncio.sleep(0.1)
    print(f"{city} narxi yuklandi")

async def main():
    fetch_price("Toşkent")        # Yomon: await yöq
    print("tayyor")

asyncio.run(main())
```

```text
RuntimeWarning: coroutine 'fetch_price' was never awaited
tayyor
```

Çaqiriş faqat korutina obyektini yaratdi; tana heç qaçon bajarilmadi. **Tuzatiş:** `await fetch_price("Toşkent")`.

### 2. Korutina içida `time.sleep`

```python
import asyncio
import time

async def fetch_price(city):
    time.sleep(0.1)                # Yomon: butun event loopni bloklaydi
    return city

async def main():
    start = time.perf_counter()
    await asyncio.gather(fetch_price("Toşkent"), fetch_price("Samarqand"), fetch_price("Buxoro"))
    print(f"{time.perf_counter() - start:.1f} s ketdi")

await main()
```

```text
0.3 s ketdi
```

`time.sleep` boşqaruvni loopga heç qaçon qaytarmaydi, şuning uçun uçta çaqiriş birin-ketin bajarildi. **Tuzatiş:** `await asyncio.sleep(0.1)`, bunda hammasi jami 0.1 s oladi.

### 3. Işlab turgan loop içida `asyncio.run()` ni çaqiriş

```py
import asyncio

async def main():
    print("Salom")

asyncio.run(main())    # şu muharrirda yoki Jupyter da
```

```text
RuntimeError: asyncio.run() cannot be called from a running event loop
```

Bitta oqimda faqat bitta loop işlaşi mumkin. **Tuzatiş:** şu sahifada yoki notebookda `await main()` ni işlating; skriptda esa `asyncio.run()` ni bir marta, eng pastda çaqiring.

### 4. Vazifa yaratib, uni unutiş

```py
async def main():
    asyncio.create_task(send_receipt("Dilnoza"))   # Yomon: havola yöq, heç qaçon kutilmaydi
    print("buyurtma saqlandi")

asyncio.run(main())
```

```text
buyurtma saqlandi
```

Çek heç qaçon yuborilmadi: `main` qaytganda `asyncio.run()` tugamagan vazifalarni bekor qiladi, heç kim havola qilmagan vazifani esa çiqindi yiğuvçi (garbage collector) iş örtasida yiğib olişi ham mumkin. **Tuzatiş:** vazifani özgaruvçida saqlang va uni `await` qiling yoki `TaskGroup` içida yarating.

## Maşqlar

### 1. Bir vaqtdagi yuklab olişlar <Difficulty level="1" />

`size / 1000` soniya kutadigan, `NOMI yuklandi` deb çop etadigan va `size` ni qaytaradigan `download(name, size)` ni yozing. `lesson.mp4` (300), `notes.pdf` (50) va `photo.jpg` (120) yuklab olişlarini `gather` qiling, keyin jamini çop eting.

::: details Yeçim
```python
import asyncio

async def download(name, size):
    await asyncio.sleep(size / 1000)
    print(f"{name} yuklandi")
    return size

async def main():
    sizes = await asyncio.gather(
        download("lesson.mp4", 300),
        download("notes.pdf", 50),
        download("photo.jpg", 120),
    )
    print(f"jami: {sum(sizes)} MB")

await main()
```

```text
notes.pdf yuklandi
photo.jpg yuklandi
lesson.mp4 yuklandi
jami: 470 MB
```
:::

### 2. Timeout örami <Difficulty level="1" />

Korutina natijasini yoki `seconds` ötgaç `default` ni qaytaradigan `with_timeout(coro, seconds, default)` ni yozing. Uni `asyncio.sleep(0.05, result="kurs: 12650")` ga 0.2 s çegara bilan va xuddi şuni 1 s bilan sinang.

::: details Yeçim
```python
import asyncio

async def with_timeout(coro, seconds, default):
    try:
        async with asyncio.timeout(seconds):
            return await coro
    except TimeoutError:
        return default

async def main():
    print(await with_timeout(asyncio.sleep(0.05, result="kurs: 12650"), 0.2, "javob yöq"))
    print(await with_timeout(asyncio.sleep(1, result="kurs: 12650"), 0.2, "javob yöq"))

await main()
```

```text
kurs: 12650
javob yöq
```
:::

### 3. Imtihon varaqalari navbati <Difficulty level="2" />

Işlab çiqaruvçi `asyncio.Queue` ga `Aziza`, `Bobur`, `Dilnoza`, `Jasur` ni, keyin töxtaş signali sifatida `None` ni qöyadi. Isteʼmolçi `None` ni olgunça har bir varaq uçun `NOMI tekşirildi` deb çop etadi va sonini qaytaradi. Uni çop eting.

::: details Yeçim
```python
import asyncio

async def producer(queue):
    for name in ["Aziza", "Bobur", "Dilnoza", "Jasur"]:
        await queue.put(name)
    await queue.put(None)

async def checker(queue):
    count = 0
    while True:
        name = await queue.get()
        if name is None:
            return count
        await asyncio.sleep(0.01)
        print(f"{name} tekşirildi")
        count += 1

async def main():
    queue = asyncio.Queue()
    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer(queue))
        result = tg.create_task(checker(queue))
    print("tekşirilgan varaqalar:", result.result())

await main()
```

```text
Aziza tekşirildi
Bobur tekşirildi
Dilnoza tekşirildi
Jasur tekşirildi
tekşirilgan varaqalar: 4
```
:::

### 4. Bir vaqtda köpi bilan ikkitasi <Difficulty level="2" />

`[("palov", 0.4), ("somsa", 0.1), ("lağmon", 0.2), ("manti", 0.2)]` buyurtmalarini `gather` bilan bajaring, lekin `asyncio.Semaphore(2)` yordamida bir vaqtda köpi bilan ikkitasini. `NOMI boşlandi`, `NOMI tayyor` va qaytarilgan nomlarni çop eting.

::: details Yeçim
```python
import asyncio

async def prepare(name, seconds, limit):
    async with limit:
        print(f"{name} boşlandi")
        await asyncio.sleep(seconds)
        print(f"{name} tayyor")
        return name

async def main():
    limit = asyncio.Semaphore(2)
    orders = [("palov", 0.4), ("somsa", 0.1), ("lağmon", 0.2), ("manti", 0.2)]
    names = await asyncio.gather(*(prepare(n, s, limit) for n, s in orders))
    print(names)

await main()
```

```text
palov boşlandi
somsa boşlandi
somsa tayyor
lağmon boşlandi
lağmon tayyor
manti boşlandi
palov tayyor
manti tayyor
['palov', 'somsa', 'lağmon', 'manti']
```

Uçinçi buyurtma işlayotganlardan biri semaforni böşatgunça `async with limit` da kutadi.
:::

### 5. Oraliqni oşirib qayta uriniş <Difficulty level="3" />

Işonçsiz `fetch_rate()` ikki marta `ConnectionError` çaqiradi, keyin `12650` qaytaradi. `retry(func, attempts, delay)` ni yozing: `ConnectionError` da `N-uriniş muvaffaqiyatsiz, D s kutamiz` deb çop etsin, kutsin va `delay` ni ikki barobar oşirsin; oxirgi urinişdan keyin xatoni qayta çaqirsin. `delay=0.01` dan boşlab 4 va 2 urinişni sinang va `kurs: 12650` yoki `voz keçildi: XABAR` ni çop eting.

::: details Yeçim
```python
import asyncio

def make_flaky(failures):
    calls = 0
    async def fetch_rate():
        nonlocal calls
        calls += 1
        await asyncio.sleep(0.01)
        if calls <= failures:
            raise ConnectionError("server band")
        return 12650
    return fetch_rate

async def retry(func, attempts, delay):
    for attempt in range(1, attempts + 1):
        try:
            return await func()
        except ConnectionError:
            if attempt == attempts:
                raise
            print(f"{attempt}-uriniş muvaffaqiyatsiz, {delay} s kutamiz")
            await asyncio.sleep(delay)
            delay *= 2

async def main():
    print("kurs:", await retry(make_flaky(2), attempts=4, delay=0.01))
    try:
        await retry(make_flaky(2), attempts=2, delay=0.01)
    except ConnectionError as e:
        print("voz keçildi:", e)

await main()
```

```text
1-uriniş muvaffaqiyatsiz, 0.01 s kutamiz
2-uriniş muvaffaqiyatsiz, 0.02 s kutamiz
kurs: 12650
1-uriniş muvaffaqiyatsiz, 0.01 s kutamiz
voz keçildi: server band
```

`make_flaky` - closure (*Closure va dekoratorlar*), şuning uçun har bir işga tuşiriş öz hisoblagiçini oladi.
:::

## Xulosa

- `async def` **korutina** yaratadi; uni çaqiriş **await** qilinmagunça heç narsa qilmaydi.
- **Event loop** korutinalar orasida faqat `await` da almaşadi; uni heç qaçon `time.sleep` yoki uzoq hisob-kitoblar bilan bloklamang.
- `gather`, `create_task` va `TaskGroup` korutinalarni **bir vaqtda** bajaradi; umumiy vaqt yiğindi emas, eng uzun kutişga teng.
- `asyncio.timeout` `TimeoutError` çaqiradi; `asyncio.Queue` işlab çiqaruvçilar va isteʼmolçilarni boğlaydi.
- Skriptlar `asyncio.run(main())` ni çaqiradi; bu sahifa va notebooklar `await main()` ni işlatadi.
- Async kutişda (I/O) yordam beradi, protsessorni yuklaydigan işda emas.

## Qöşimça manbalar

- [`asyncio`: Coroutines and tasks](https://docs.python.org/3/library/asyncio-task.html)
- [`asyncio`: Queues](https://docs.python.org/3/library/asyncio-queue.html)
- [`asyncio` HOWTO: A conceptual overview](https://docs.python.org/3/howto/a-conceptual-overview-of-asyncio.html)
