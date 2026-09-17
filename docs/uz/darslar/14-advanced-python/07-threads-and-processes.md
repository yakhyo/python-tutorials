---
title: Oqimlar va jarayonlar
description: "Işni oqimlar va jarayonlar yordamida parallel bajariş: I/O-bound va CPU-bound iş, GIL, qulflar, navbatlar, oqim va jarayon poollari hamda qaçon oqim, jarayon yoki asyncio ni tanlaş."
---

# Oqimlar va jarayonlar

::: tip Nimalarni örganasiz
- **I/O-bound** va **CPU-bound** iş farqi hamda **GIL** ularning har biri uçun nimani anglatişi
- **Oqimni** (thread) qanday işga tuşiriş va `join` qiliş, nega umumiy maʼlumotlarga **`Lock`** kerak
- **`queue.Queue`** bilan işçilar pooli (worker pool) qanday quriladi
- **`ThreadPoolExecutor`** va **`ProcessPoolExecutor`** köp vazifalarni qanday bajaradi
- Oqimlar, jarayonlar va asyncio orasida qanday tanlaş
:::

## Nega bu muhim

Toşkentdagi dökon boti 50 ta saytdan narxlarni tekşiradi. Har bir sörov tarmoqni bir soniya kutadi: birma-bir qilinsa, deyarli bir daqiqa, oqimlar bilan esa bir neça soniya. Minglab rasmlarning ölçamini özgartiriş uçun esa jarayonlar kerak, notöğri vosita heç qanday tezlaşiş bermaydi.

::: info Bularni kompyuteringizda işga tuşiring
Bu saytdagi muharrir oqim yoki jarayonlarni işga tuşira olmaydi (`RuntimeError: can't start new thread`). Run tugmasi yöq misollarni faylga saqlang va kompyuteringizda işga tuşiring. Ularning natijasi haqiqiy işga tuşirişdan olingan; sizdagi vaqtlar va qatorlar tartibi farq qilişi mumkin.
:::

## I/O-bound, CPU-bound va GIL

Dastur asosan kutsa (tarmoq, disk, maʼlumotlar bazasi), iş **I/O-bound**, hisoblaş bilan band bölsa (tub sonlarni sanaş, fayllarni siqiş), **CPU-bound** böladi.

CPython da **Global Interpreter Lock (GIL)** bor: bir vaqtda faqat bitta oqim Python kodini bajaradi. I/O ni kutayotgan (yoki `time.sleep` ni çaqirgan) oqim GIL ni böşatadi, şuning uçun boşqa oqimlar işlay oladi.

- I/O-bound iş uçun oqimlar yordam beradi: kutişlar ustma-ust tuşadi.
- CPU-bound iş uçun oqimlar tezlaşiş bermaydi. **Jarayonlardan** (process) foydalaning: har birida alohida interpretator va alohida GIL bor, şuning uçun ular bir neçta protsessor yadrosini işlatadi.

Python 3.14 da GIL siz ixtiyoriy **free-threaded build** (`python3.14t`) ham bor. Oddiy `python3.14` da GIL hamon bor va bu dars şuni nazarda tutadi.

## Oqimlarni işga tuşiriş

`threading.Thread(target=..., args=...)` oqim yaratadi. `start()` uni işga tuşiradi; `join()` u tugaşini kutadi.

```py
import threading
import time


def download(city):
    time.sleep(1)  # tarmoqni kutişni taqlid qilamiz
    print(f"{city} tayyor")


start = time.perf_counter()
threads = [
    threading.Thread(target=download, args=(city,))
    for city in ["Toşkent", "Samarqand", "Buxoro"]
]
for thread in threads:
    thread.start()
for thread in threads:
    thread.join()
print(f"{time.perf_counter() - start:.1f} soniya ketdi")
```

```text
Toşkent tayyor
Samarqand tayyor
Buxoro tayyor
1.0 soniya ketdi
```

Uçta bir soniyalik yuklab oliş bir soniya oldi. `args` - **kortej**, şuning uçun oxirida vergul bor. `tayyor` qatorlari boşqa tartibda çiqişi mumkin.

## Poyga holatlari va `Lock`

Oqimlar özgaruvçilarni bölişadi. Ikki oqim bir xil qiymatni **öqisa, özgartirsa va yozsa**, biri boşqasining yangilanişini ustidan yozib yuborişi mumkin: bu **poyga holati** (race condition). Törtta oqim balansga 1,000 tadan qöşadi; `time.sleep(0)` öqiş va yoziş orasidagi sekin iş örnida turadi:

```py
import threading
import time

balance = 0


def deposit_many():
    global balance
    for _ in range(1_000):
        current = balance      # öqiş
        time.sleep(0)          # bu yerda boşqa oqim işlab olsin
        balance = current + 1  # yoziş


threads = [threading.Thread(target=deposit_many) for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"4000 kutilgandi, {balance} çiqdi")
```

```text
4000 kutilgandi, 1005 çiqdi
```

Son har safar özgaradi; `sleep(0)` siz bu xato işlab turgan tizimda haftada bir marta çiqişi mumkin. **Qulf** (lock), yaʼni **`Lock`**, blokka bir vaqtda faqat bitta oqimni kiritadi:

```py
lock = threading.Lock()


def deposit_many():
    global balance
    for _ in range(1_000):
        with lock:
            current = balance
            time.sleep(0)
            balance = current + 1
```

```text
4000 kutilgandi, 4000 çiqdi
```

## `queue.Queue` bilan işçilar pooli

`queue.Queue` - **oqimlar uçun xavfsiz** (thread-safe) FIFO navbat: köp oqimlar qulfsiz `put` va `get` qila oladi. Klassik tuzilma - bitta navbatdan vazifalarni oladigan bir neçta işçi:

```py
import queue
import threading
import time

tasks = queue.Queue()
results = queue.Queue()


def worker():
    while True:
        order = tasks.get()
        if order is None:          # töxtaş signali
            break
        time.sleep(0.1)            # qadoqlaş vaqt oladi
        results.put(f"{order}-buyurtma qadoqlandi")


workers = [threading.Thread(target=worker) for _ in range(3)]
for w in workers:
    w.start()

for order in range(1, 7):
    tasks.put(order)
for _ in workers:
    tasks.put(None)                # har bir işçiga bitta töxtaş signali

for w in workers:
    w.join()

packed = sorted(results.get() for _ in range(results.qsize()))
print("\n".join(packed))
```

```text
1-buyurtma qadoqlandi
2-buyurtma qadoqlandi
3-buyurtma qadoqlandi
4-buyurtma qadoqlandi
5-buyurtma qadoqlandi
6-buyurtma qadoqlandi
```

Oltita 0.1 soniyalik buyurtma taxminan 0.2 soniya oldi.

## `ThreadPoolExecutor`

`concurrent.futures` oqim va navbatlarni yaşiradi. `pool.map` natijalarni **kiriş tartibida** qaytaradi; `submit` **`Future`** qaytaradi, `as_completed` esa futurelarni **tugaşi böyiça** beradi:

```py
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

PAGES = {"tashkent.uz": 0.3, "samarkand.uz": 0.1, "bukhara.uz": 0.2}


def download(site):
    time.sleep(PAGES[site])        # tarmoqni kutişni taqlid qilamiz
    return f"{site}: {len(site) * 1000} bayt"


with ThreadPoolExecutor(max_workers=3) as pool:
    print(list(pool.map(download, PAGES)))

    futures = [pool.submit(download, site) for site in PAGES]
    for future in as_completed(futures):
        print("tugadi:", future.result())
```

```text
['tashkent.uz: 11000 bayt', 'samarkand.uz: 12000 bayt', 'bukhara.uz: 10000 bayt']
tugadi: samarkand.uz: 12000 bayt
tugadi: bukhara.uz: 10000 bayt
tugadi: tashkent.uz: 11000 bayt
```

`with` bloki çiqişda barça oqimlarni `join` qiladi. `future.result()` qiymatni qaytaradi yoki oqimdagi istisnoni **qayta çaqiradi**.

## CPU iş uçun `ProcessPoolExecutor`

`ProcessPoolExecutor` ning interfeysi xuddi şunday, lekin har bir işçi alohida Python jarayoni:

```py
import time
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor


def count_primes(limit):
    count = 0
    for n in range(2, limit):
        if all(n % d for d in range(2, int(n**0.5) + 1)):
            count += 1
    return count


if __name__ == "__main__":
    for executor_class in [ThreadPoolExecutor, ProcessPoolExecutor]:
        start = time.perf_counter()
        with executor_class(max_workers=2) as pool:
            results = list(pool.map(count_primes, [600_000, 600_000]))
        seconds = time.perf_counter() - start
        print(f"{executor_class.__name__}: {results}, {seconds:.1f} soniya")

    start = time.perf_counter()
    results = [count_primes(600_000), count_primes(600_000)]
    print(f"oddiy sikl: {results}, {time.perf_counter() - start:.1f} soniya")
```

```text
ThreadPoolExecutor: [49098, 49098], 3.9 soniya
ProcessPoolExecutor: [49098, 49098], 2.1 soniya
oddiy sikl: [49098, 49098], 3.6 soniya
```

Oqimlar oddiy sikldan tez bölmadi; jarayonlar ikki yadroni işlatdi. (Jarayonlarni işga tuşiriş vaqt oladi, şuning uçun juda kiçik vazifalar sekinlaşişi mumkin.)

Nega `if __name__ == "__main__":`? Windows, macOS va 3.14 dan boşlab Linux da har bir yangi jarayon `count_primes` ni topiş uçun **skriptingizni import qiladi**. Himoyasiz bu import yana bir poolni işga tuşiradi va Python xato bilan töxtaydi (Köp uçraydigan xatolarga qarang). Xuddi şu sababga köra funksiya modulning yuqori darajasida bölişi kerak.

## Oqimlar, jarayonlar yoki asyncio?

| Iş | Eng yaxşi vosita | Nega |
|---|---|---|
| Tarmoq yoki fayllarni kutiş, bloklaydigan kod | Oqimlar | Kutiş paytida GIL böşatiladi |
| Minglab ulanişlar, async kutubxonalar | asyncio (*Async va await*) | Juda arzon vazifalar |
| Sof Pythonda oğir hisoblaşlar | Jarayonlar | Bir neçta yadro |
| Bir marta, bir neça soniyalik iş | Oddiy sikl | Eng sodda kod |

**Daemon oqim** (`Thread(..., daemon=True)`) dastur tugaganda keskin töxtatiladi, bu fon yordamçilari uçun mos. `thread.join(timeout=1)` köpi bilan bir soniya kutadi (keyin `thread.is_alive()` ni tekşiring), `future.result(timeout=2)` esa natija keçiksa `TimeoutError` çaqiradi.

## Özingiz sinab köring

Bu işçi haqiqiy navbat va qulf bilan asosiy oqimda işlaydi. Ikkita buyurtma qöşing, keyin işçini uçta buyurtmadan keyin töxtaydigan qiling.

<ClientOnly><PythonPlayground :code='"import queue\nimport threading\n\norders = queue.Queue()\nfor item, price in [(\"palov\", 35000), (\"somsa\", 8000), (\"lağmon\", 30000)]:\n    orders.put((item, price))\n\ntotal = 0\nlock = threading.Lock()\n\ndef worker():\n    global total\n    while not orders.empty():\n        item, price = orders.get()\n        with lock:\n            total += price\n        print(f\"{threading.current_thread().name}: {item} qadoqlandi\")\n\nworker()\nprint(f\"Jami: {total} söm\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Funksiyani uzatiş örniga çaqiriş

```py
import threading


def work():
    print("işlayapti:", threading.current_thread().name)


thread = threading.Thread(target=work())  # Yomon: work() ni hoziroq çaqiradi
thread.start()
thread.join()
```

```text
işlayapti: MainThread
```

`work()` asosiy oqimda işladi va `None` qaytardi, şuning uçun oqimga target berilmadi. **Tuzatiş:** funksiyaning özini uzating: `Thread(target=work)`.

### 2. `join` ni unutiş

```py
import threading
import time

totals = []

def add_order(amount):
    time.sleep(0.1)
    totals.append(amount)

for amount in [15000, 32000, 8000]:
    threading.Thread(target=add_order, args=(amount,)).start()

# Yomon: join yöq, oqimlar hali uxlab turibdi
print(f"Jami: {sum(totals)} söm")
```

```text
Jami: 0 söm
```

**Tuzatiş:** natijalarni öqişdan oldin har bir oqimni `join()` qiling yoki `with` blokida `ThreadPoolExecutor` dan foydalaning.

### 3. CPU-bound iş uçun oqimlar

```py
with ThreadPoolExecutor(max_workers=2) as pool:  # Yomon: CPU iş
    results = list(pool.map(count_primes, [600_000, 600_000]))
```

```text
ThreadPoolExecutor: [49098, 49098], 3.9 soniya
oddiy sikl: [49098, 49098], 3.6 soniya
```

Bir vaqtda faqat bitta oqim Python kodini bajaradi. **Tuzatiş:** CPU-bound iş uçun `ProcessPoolExecutor` dan foydalaning.

### 4. `__main__` himoyasiz `ProcessPoolExecutor`

```py
from concurrent.futures import ProcessPoolExecutor


def square(n):
    return n * n


with ProcessPoolExecutor() as pool:
    print(list(pool.map(square, [1, 2, 3])))
```

```text
RuntimeError:
        An attempt has been made to start a new process before the
        current process has finished its bootstrapping phase.
concurrent.futures.process.BrokenProcessPool: A process in the process pool was terminated abruptly while the future was running or pending.
```

**Tuzatiş:** pool kodini `if __name__ == "__main__":` ostiga qöying va `square` ni yuqori darajada qoldiring.

## Maşqlar

### 1. Şaharlar navbati <Difficulty level="1" />

`"Toşkent"`, `"Samarqand"` va `"Xiva"` ni `queue.Queue` ga joylang. Uning hajmini çop eting, keyin şaharlarni birma-bir olib, har birini çop eting va oxirida navbat böş yoki yöqligini çop eting.

::: details Yeçim
```python
import queue

cities = queue.Queue()
for city in ["Toşkent", "Samarqand", "Xiva"]:
    cities.put(city)

print("hajmi:", cities.qsize())
while not cities.empty():
    print(cities.get())
print("böşmi:", cities.empty())
```

```text
hajmi: 3
Toşkent
Samarqand
Xiva
böşmi: True
```
:::

### 2. Uçta salomlaşuvçi oqim <Difficulty level="1" />

Kompyuteringizda işga tuşiring: `["Dilnoza", "Aziza", "Jasur"]` dagi har bir ism uçun 0.1 soniya uxlaydigan va umumiy luğatga `"Salom, <ism>!"` ni yozadigan oqim işga tuşiring. `join` dan keyin salomlarni ism böyiça saralab çop eting.

::: details Yeçim
```py
import threading
import time

greetings = {}


def greet(name):
    time.sleep(0.1)
    greetings[name] = f"Salom, {name}!"


threads = [threading.Thread(target=greet, args=(name,))
           for name in ["Dilnoza", "Aziza", "Jasur"]]
for thread in threads:
    thread.start()
for thread in threads:
    thread.join()

for name in sorted(greetings):
    print(greetings[name])
```

```text
Salom, Aziza!
Salom, Dilnoza!
Salom, Jasur!
```
:::

### 3. Oqimlar uçun xavfsiz hisoblagiç klassi <Difficulty level="2" />

`value`, `Lock` va qiymatni `with self.lock` içida özgartiradigan `increment(amount=1)` ga ega `SafeCounter` klassini yozing. `increment(2000)` ni beş marta çaqiring, keyin qiymatni va qulf böş yoki yöqligini çop eting.

::: details Yeçim
```python
import threading

class SafeCounter:
    def __init__(self):
        self.value = 0
        self.lock = threading.Lock()

    def increment(self, amount=1):
        with self.lock:
            self.value += amount

counter = SafeCounter()
for _ in range(5):
    counter.increment(2000)

print("qiymat:", counter.value)
print("qulf böşmi:", not counter.lock.locked())
```

```text
qiymat: 10000
qulf böşmi: True
```
:::

### 4. Parallel yuklab oliş <Difficulty level="2" />

Kompyuteringizda işga tuşiring: quyidagi `FILES` fayl nomlarini yuklab oliş soniyalariga moslaydi. `ThreadPoolExecutor` bilan har bir faylni "yuklab oling" (uxlang, `"<nom>: <soniya * 5000> KB"` ni qaytaring) va natijalarni tugaşi böyiça çop eting.

::: details Yeçim
```py
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

FILES = {"report.pdf": 0.3, "photo.jpg": 0.1, "notes.txt": 0.2}


def download(name):
    time.sleep(FILES[name])
    return f"{name}: {int(FILES[name] * 5000)} KB"


with ThreadPoolExecutor(max_workers=3) as pool:
    futures = [pool.submit(download, name) for name in FILES]
    for future in as_completed(futures):
        print(future.result())
```

```text
photo.jpg: 500 KB
notes.txt: 1000 KB
report.pdf: 1500 KB
```
:::

### 5. Futurelarni qölda yaratiş <Difficulty level="3" />

`concurrent.futures.Future` qaytaradigan `fake_download(site)` ni yozing: `.uz` bilan tugaydigan saytlar uçun natija sifatida `f"{site}: OK"` ni, boşqalari uçun istisno sifatida `ValueError(f"nomaʼlum sayt {site}")` ni örnating. Keyin `["kun.uz", "example.com", "gazeta.uz"]` böylab aylanib, har birining natijasini yoki xatosini çop eting.

::: details Yeçim
```python
from concurrent.futures import Future

def fake_download(site):
    future = Future()
    if site.endswith(".uz"):
        future.set_result(f"{site}: OK")
    else:
        future.set_exception(ValueError(f"nomaʼlum sayt {site}"))
    return future

for site in ["kun.uz", "example.com", "gazeta.uz"]:
    future = fake_download(site)
    try:
        print(future.result())
    except ValueError as error:
        print("xato:", error)
```

```text
kun.uz: OK
xato: nomaʼlum sayt example.com
gazeta.uz: OK
```

Executor bu çaqiruvlarni siz uçun bajaradi.
:::

## Xulosa

- Oqimlar **I/O-bound** işni tezlaştiradi; **GIL** esa ularga **CPU-bound** işni tezlaştirişga yöl qöymaydi.
- `Thread(target=func, args=(...))`, keyin `start()` va `join()`.
- Bir neçta oqim özgartiradigan umumiy maʼlumotga `Lock` kerak; `queue.Queue` esa allaqaçon oqimlar uçun xavfsiz.
- `pool.map` kiriş tartibini saqlaydi; `as_completed` futurelarni tugaşi böyiça beradi.
- `ProcessPoolExecutor` bir neçta yadroni işlatadi va `if __name__ == "__main__":` ni talab qiladi.
- Köp ulanişlar uçun asyncio, bloklaydigan I/O uçun oqimlar, hisoblaş uçun jarayonlar.

## Qöşimça manbalar

- [threading: Oqimlarga asoslangan parallellik](https://docs.python.org/3/library/threading.html)
- [concurrent.futures: Parallel vazifalarni işga tuşiriş](https://docs.python.org/3/library/concurrent.futures.html)
- [queue: Sinxronlangan navbat klassi](https://docs.python.org/3/library/queue.html)
- [Pythonda free threading qöllab-quvvatlaşi](https://docs.python.org/3/howto/free-threading-python.html)
