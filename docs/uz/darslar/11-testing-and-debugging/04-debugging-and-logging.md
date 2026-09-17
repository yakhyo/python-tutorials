---
title: Xatolarni tuzatiş va logging
description: "Xatolarni tizimli topiş va tuşuniş: xato tuzatiş tartibi, f-satrlar bilan print orqali tuzatiş, köp freymli traceback lar, pdb debuggeri va breakpoint(), minimal misollar hamda logging moduli."
---

# Xatolarni tuzatiş va logging

![Rasm: Xatolarni tuzatiş va logging](/images/topics-webp-uzb/debugging-and-logging.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Taxmin qiliş örniga xatolarni qadamma-qadam topiş tartibi
- `f"{x=}"` bilan tezkor print orqali tuzatiş va bir neçta freymli traceback larni öqiş
- Dasturni `breakpoint()` bilan töxtatib, `pdb` bilan körib çiqiş
- `print` örniga `logging` dan foydalaniş: darajalar, `basicConfig`, formatlar va nomlangan logger lar
- Istisnolarni traceback lari bilan birga logga yoziş
:::

## Nega bu muhim

Testlar nimadir buzilganini **aytadi**. Xato tuzatiş (debugging) esa **nega** buzilganini aniqlaydi. Tajribali dasturçilar kamroq xato yozmaydi; ular tasodifiy özgartirişlar örniga usul bilan ularni tezroq topadi.

Dastur Namangandagi serverda işlayotganida uni kuzatib turolmaysiz. **Log** nima bölganini yozib boradi, şuning uçun keyinroq buyurtma nega tungi soat 3 da muvaffaqiyatsiz bölganini bilib olasiz.

## Xato tuzatiş tartibi

1. **Takrorlang.** Xatoni har safar keltirib çiqaradigan kirişlarni toping, iloji bölsa yiqiladigan test sifatida.
2. **Ajrating.** Funksiya, qator va qiymatni toraytiring. Dasturni **minimal misol**gaça qisqartiring yoki uni qatorma-qator ovoz çiqarib tuşuntiring.
3. **Faraz qiling.** Aniq taxmin qiling: "`total` sikl içida qayta yozilyapti."
4. **Farazni tekşiring.** Qiymatni çiqaring yoki debuggerdan foydalaning. Taxmin notöğrimi? 2-qadamga qayting.
5. **Tuzating va tasdiqlang.** Sababni tuzating, keyin **barça** testlarni işga tuşiring.

Xato yöqolgunça kodni tasodifiy özgartiriş 2-4-qadamlarni taşlab ketadi va köpinça xatoni tuzatiş örniga yaşirib qöyadi.

## `f"{x=}"` bilan print orqali tuzatiş

Eng tezkor vosita hamon `print`. f-satr içidagi ifodadan keyin `=` qöysangiz, Python ifodani ham, uning qiymatini ham çiqaradi:

```python
def average_price(prices):
    total = 0
    for price in prices:
        total = price
        print(f"{price=} {total=}")
    return total / len(prices)

print(average_price([12000, 8000, 25000]))
```

```text
price=12000 total=12000
price=8000 total=8000
price=25000 total=25000
8333.333333333334
```

Xato darhol körinadi: `total` öşiş örniga **almaştirilyapti**. Tuzatiş - `total += price`. `=` istalgan ifoda bilan işlaydi, masalan `f"{len(cart)=}"`.

## Köp freymli traceback larni öqiş

![Diagramma: Köp freymli traceback larni öqiş](/images/companions-webp-uzb/multi-frame-traceback.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Traceback xatoga olib kelgan har bir çaqiruvni röyxatlaydi. Har bir `File ... line ... in ...` yozuvi bitta **freym** (frame). Buni `report.py` sifatida saqlang va işga tuşiring:

```py
def average(grades):
    return sum(grades) / len(grades)


def print_report(students):
    for name, grades in students.items():
        print(f"{name}: {average(grades):.1f}")


print_report({"Aziza": [90, 85, 97], "Bekzod": []})
```

```text
Aziza: 90.7
Traceback (most recent call last):
  File "report.py", line 10, in <module>
    print_report({"Aziza": [90, 85, 97], "Bekzod": []})
    ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "report.py", line 7, in print_report
    print(f"{name}: {average(grades):.1f}")
                     ~~~~~~~^^^^^^^^
  File "report.py", line 2, in average
    return sum(grades) / len(grades)
           ~~~~~~~~~~~~^~~~~~~~~~~~~
ZeroDivisionError: division by zero
```

"Most recent call last" (eng oxirgi çaqiruv oxirida): freymlar taşqaridan içkariga qarab boradi. **Oxirgi qator** nima notöğri ketganini, **oxirgi freym** qayerda qulaganini (2-qator, `average` içida), **yuqoridagi freymlar** esa dastur u yerga qanday yetib kelganini aytadi (`<module>`, yaʼni yuqori daraja, `print_report` ni çaqirdi, u esa `average` ni çaqirdi).

Qulaş `average` içida, lekin **xato** yuqoriroqda bölişi mumkin: bahosi yöq talaba uçun hisobot nima körsatişi kerak?

## Debugger: `breakpoint()`

**Debugger** dasturingizni töxtatib turadi, şunda özgaruvçilarni körib çiqib, qatorlarni birma-bir bajarişingiz mumkin. Pythonning örnatilgan debuggeri - **pdb**. `breakpoint()` qayerda töxtaşni belgilaydi, `prices.py` da:

```py
def average_price(prices):
    total = 0
    for price in prices:
        total = price
    breakpoint()
    return total / len(prices)


print(average_price([12000, 8000, 25000]))
```

::: info pdb ga terminal kerak
Debugger yozilgan buyruqlarni kutadi, şuning uçun u bu saytdagi muharrirda işlamaydi. Faylni terminalda (`python prices.py`) yoki kod muharriringizda işga tuşiring.
:::

`breakpoint()` ga yetganda Python buyruqlar uçun `(Pdb)` taklifini körsatadi:

```text
> /home/aziza/prices.py(5)average_price()
-> breakpoint()
(Pdb) p total
25000
(Pdb) n
> /home/aziza/prices.py(6)average_price()
-> return total / len(prices)
(Pdb) c
8333.333333333334
```

`->` **keyingi** bajariladigan qatorni körsatadi (Python 3.13 dan boşlab, `breakpoint()` qatorining özini). `p total` faqat oxirgi narxni çiqardi va bu farazni tasdiqladi.

Asosiy buyruqlar: `n` (keyingi qator), `s` (çaqirilgan funksiya **içiga** kiriş), `c` (davom etiş), `p ifoda` (çiqariş), `l` (kodni körsatiş) va `q` (çiqiş). VS Code kabi muharrirlarda xuddi şu göyalarga asoslangan grafik debuggerlar bor. Iş tugagaç, barça `breakpoint()` larni olib taşlang, aks holda dastur buyruq kutib qotib qoladi.

## Logging: katta dasturlar uçun `print`

Tuzatiş uçun yozilgan print larni kodni tahrirlamasdan öçirib bölmaydi. `logging` moduli bu muammoni hal qiladi. Har bir xabarning **darajasi** bor: `DEBUG` (xato qidiriş uçun tafsilotlar), `INFO` (oddiy hodisalar), `WARNING` (dastur yengib ötadigan kutilmagan holat), `ERROR` (amal muvaffaqiyatsiz tugadi) va `CRITICAL` (dastur davom eta olmaydi). Uni sozlaş uçun boşida bir marta `logging.basicConfig` ni çaqiring:

```python
import logging
import sys

logging.basicConfig(
    level=logging.WARNING,
    stream=sys.stdout,
    format="%(levelname)-8s %(message)s",
)

logging.info("1043-buyurtma yaratildi")          # WARNING dan past: yaşirin
logging.warning("kupon kodi muddati tugagan")
logging.error("Samarqandga yetkazib beriş muvaffaqiyatsiz")
```

```text
WARNING  kupon kodi muddati tugagan
ERROR    Samarqandga yetkazib beriş muvaffaqiyatsiz
```

- `level` - **filtr**: pastroq xabarlar eʼtiborga olinmaydi, şuning uçun `debug` qatorlari kodda qolaverişi va bitta sozlama bilan yoqilişi mumkin.
- `stream=sys.stdout` qatorlarni xatolar oqimi örniga oddiy çiqişga yuboradi; `filename="shop.log"` esa faylga yozadi.
- `format` örin tutuvçilarni töldiradi: `%(levelname)s` (`-8` uni böşliq bilan töldiradi), `%(message)s`, `%(name)s`, `%(asctime)s` (sana va vaqt) va `%(funcName)s`. Standart format `WARNING:root:kupon kodi muddati tugagan` kabi körinadi.

### Nomlangan logger lar

Har bir modulga **öz** logger ini bering, şunda har bir xabar qayerdan kelgani körinadi:

```python
import logging
import sys

logging.basicConfig(level=logging.INFO, stream=sys.stdout,
                    format="%(levelname)s [%(name)s] %(message)s")

logger = logging.getLogger(__name__)
payments = logging.getLogger("shop.payments")

logger.info("dastur işga tuşdi")
payments.error("karta rad etildi")
```

```text
INFO [__main__] dastur işga tuşdi
ERROR [shop.payments] karta rad etildi
```

`__name__` - modul nomi (işga tuşirilayotgan fayl uçun `"__main__"`), şuning uçun har bir modul boşida `logger = logging.getLogger(__name__)` yoziş standart andoza hisoblanadi.

### Istisnolarni logga yoziş

`except` içida `logger.exception()` dasturni qulatmasdan `ERROR` **va** töliq traceback ni logga yozadi:

```python
import logging
import sys

logging.basicConfig(level=logging.INFO, stream=sys.stdout,
                    format="%(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("payments")

def charge(amount_text):
    try:
        amount = int(amount_text)
    except ValueError:
        logger.exception(f"summani tahlil qilib bölmadi: {amount_text!r}")
        return None
    logger.info(f"{amount} söm yeçildi")
    return amount

charge("50000")
charge("ellik")
print("dastur işlaşda davom etyapti")
```

```text
INFO payments: 50000 söm yeçildi
ERROR payments: summani tahlil qilib bölmadi: 'ellik'
Traceback (most recent call last):
  File "payments.py", line 10, in charge
    amount = int(amount_text)
ValueError: invalid literal for int() with base 10: 'ellik'
dastur işlaşda davom etyapti
```

Log aniq xato va qatorni saqlab qoladi, dastur esa davom etadi. `logger.exception(msg)` - `logger.error(msg, exc_info=True)` ning qisqa şakli; `exc_info=True` istalgan daraja bilan işlaydi, masalan `except` blokida `logger.warning("qayta urinilmoqda", exc_info=True)`.

## Özingiz sinab köring

Debug xabarlaridan foydalanib, `order_total` dagi xatoni toping va tuzating.

<ClientOnly><PythonPlayground :code='"import logging\nimport sys\n\nlogging.basicConfig(level=logging.DEBUG, stream=sys.stdout, format=\"%(levelname)s %(message)s\")\nlogger = logging.getLogger(__name__)\n\ndef order_total(items, delivery_fee):\n    total = 0\n    for name, price, quantity in items:\n        line_total = price + quantity\n        logger.debug(f\"{name}: {price} x {quantity} = {line_total}\")\n        total += line_total\n    total += delivery_fee\n    logger.debug(f\"yetkazib beriş bilan: {total}\")\n    return total\n\nitems = [(\"çoy\", 12000, 2), (\"somsa\", 8000, 3)]\ntotal = order_total(items, 15000)\nlogger.info(f\"buyurtma jami: {total} söm (kutilgan 63000)\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Sozlangan darajadan past xabar yoziş

```py
import logging

logging.info("buyurtma yaratildi")
logging.warning("omborda kam qoldi")
```

```text
WARNING:root:omborda kam qoldi
```

`basicConfig` bölmasa, daraja `WARNING` böladi, şuning uçun `info` jimgina taşlab yuboriladi. **Tuzatiş:** boşida bir marta `logging.basicConfig(level=logging.INFO)` ni çaqiring.

### 2. `basicConfig` ni juda keç çaqiriş

```py
import logging
import sys

logging.warning("boşlanmoqda")
logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)
logging.debug("bu eʼtiborga olinmaydi")
```

```text
WARNING:root:boşlanmoqda
```

Birinçi `logging.warning` jimgina standart handler örnatdi, root logger da handler lar bölsa esa `basicConfig` heç narsa qilmaydi, şuning uçun `debug` qatori taşlab yuborildi. **Tuzatiş:** avval sozlang, keyin logga yozing. Mavjud sozlamani almaştiriş uçun eski handler larni avval olib taşlaydigan `force=True` ni bering.

### 3. `logger.exception` ni `except` dan taşqarida işlatiş

```py
import logging

logging.exception("nimadir notöğri ketdi")
```

```text
ERROR:root:nimadir notöğri ketdi
NoneType: None
```

Faol istisno bölmasa, traceback örniga `NoneType: None` çiqadi. **Tuzatiş:** `except` bloklaridan taşqarida `logger.error(...)` dan foydalaning.

## Maşqlar

### 1. `=` bilan xatoni toping <Difficulty level="1" />

Bu funksiya sözdagi unli harflarni sanaşi kerak, lekin `count_vowels("Andijon")` `3` örniga `2` qaytaradi. Xatoni topiş uçun `f"{...=}"` print laridan foydalaning, uni tuzating va `"Andijon"` uçun natijani çiqaring.

```py
def count_vowels(word):
    count = 0
    for letter in word:
        if letter in "aeiou":
            count += 1
    return count
```

::: details Yeçim
```python
def count_vowels(word):
    count = 0
    for letter in word.lower():
        if letter in "aeiou":
            count += 1
    return count

print(count_vowels("Andijon"))
```

```text
3
```

Debug print i `letter='A' count=0` ni körsatadi: `"A"` `"aeiou"` içida yöq.
:::

### 2. Traceback ni öqing <Difficulty level="1" />

Qaysi funksiya qulaydi va uni qaysi çaqiruv boşlab berdi? Mavjud bölmagan mahsulot omborda `0` ta deb hisoblanadigan qilib tuzating.

```py
def stock_of(inventory, product):
    return inventory[product]

def restock_list(inventory, products):
    return [p for p in products if stock_of(inventory, p) < 5]

print(restock_list({"çoy": 3, "şakar": 20}, ["çoy", "şakar", "guruç"]))
```

::: details Yeçim
```python
def stock_of(inventory, product):
    return inventory.get(product, 0)

def restock_list(inventory, products):
    return [p for p in products if stock_of(inventory, p) < 5]

print(restock_list({"çoy": 3, "şakar": 20}, ["çoy", "şakar", "guruç"]))
```

```text
['çoy', 'guruç']
```

Oxirgi freym - `stock_of` (`KeyError: 'guruç'`), uni `restock_list` çaqirgan, uni esa `print` qatori çaqirgan.
:::

### 3. Print larni logging bilan almaştiring <Difficulty level="2" />

`withdraw` ni `"bank"` nomli logger bilan qayta yozing: pul yeçiş uçun `INFO`, kam balans uçun `WARNING`, `sys.stdout` da `%(levelname)s %(name)s: %(message)s` formati. `withdraw(50000, 20000)` va `withdraw(30000, 25000)` ni çaqiring.

```py
def withdraw(balance, amount):
    print(f"{amount} söm yeçilmoqda")
    balance -= amount
    if balance < 10000:
        print(f"balans kam: {balance} söm")
    return balance
```

::: details Yeçim
```python
import logging
import sys

logging.basicConfig(level=logging.INFO, stream=sys.stdout,
                    format="%(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("bank")

def withdraw(balance, amount):
    logger.info(f"{amount} söm yeçilmoqda")
    balance -= amount
    if balance < 10000:
        logger.warning(f"balans kam: {balance} söm")
    return balance

withdraw(50000, 20000)
withdraw(30000, 25000)
```

```text
INFO bank: 20000 söm yeçilmoqda
INFO bank: 25000 söm yeçilmoqda
WARNING bank: balans kam: 5000 söm
```
:::

### 4. Yomon maʼlumotni logga yoziş <Difficulty level="2" />

`["85", "90", "abc", "", "77"]` ballarini `int` ga aylantiring. Har bir notöğrisini `logger.warning` bilan (format `%(levelname)s %(message)s`) logga yozing, keyin töğrilarining örtaçasini `INFO` darajasida yozing.

::: details Yeçim
```python
import logging
import sys

logging.basicConfig(level=logging.INFO, stream=sys.stdout,
                    format="%(levelname)s %(message)s")
logger = logging.getLogger("grades")

scores = []
for text in ["85", "90", "abc", "", "77"]:
    try:
        scores.append(int(text))
    except ValueError:
        logger.warning(f"{text!r} taşlab ketildi: son emas")

logger.info(f"{len(scores)} ta ball örtaçasi: {sum(scores) / len(scores):.1f}")
```

```text
WARNING 'abc' taşlab ketildi: son emas
WARNING '' taşlab ketildi: son emas
INFO 3 ta ball örtaçasi: 84.0
```

Yomon qiymatlar **kutilgan** holat, şuning uçun har bir qatorga traceback emas, ogohlantiriş mosroq.
:::

### 5. Debug kalit <Difficulty level="3" />

`DEBUG = True` özgaruvçisi `DEBUG` darajasini, aks holda `INFO` ni tanlaydi. Har bir mahsulotni `DEBUG` darajasida logga yozib, eng arzonining nomini qaytaradigan `find_cheapest(products)` (nomlardan narxlarga luğat) funksiyasini yozing; natijani `INFO` da logga yozing. `%(levelname)-5s %(funcName)s: %(message)s` formati va `{"çoy": 12000, "non": 5000, "palov": 35000}` dan foydalaning.

::: details Yeçim
```python
import logging
import sys

DEBUG = True

logging.basicConfig(
    level=logging.DEBUG if DEBUG else logging.INFO,
    stream=sys.stdout,
    format="%(levelname)-5s %(funcName)s: %(message)s",
)
logger = logging.getLogger(__name__)

def find_cheapest(products):
    cheapest = None
    for name, price in products.items():
        logger.debug(f"{name} tekşirilmoqda: {price} söm")
        if cheapest is None or price < products[cheapest]:
            cheapest = name
    return cheapest

products = {"çoy": 12000, "non": 5000, "palov": 35000}
logger.info(f"eng arzon mahsulot: {find_cheapest(products)}")
```

```text
DEBUG find_cheapest: çoy tekşirilmoqda: 12000 söm
DEBUG find_cheapest: non tekşirilmoqda: 5000 söm
DEBUG find_cheapest: palov tekşirilmoqda: 35000 söm
INFO  <module>: eng arzon mahsulot: non
```

`DEBUG = False` bölsa, faqat oxirgi qator çiqadi.
:::

## Xulosa

- Xatoni usul bilan tuzating: takrorlang, ajrating, faraz qiling, tekşiring, keyin tuzatib, tasdiqlang.
- `print(f"{x=}")` ifoda va uning qiymatini körsatadi. Traceback da oxirgi qator nima bölganini, oxirgi freym qayerdaligini aytadi.
- `breakpoint()` terminalda pdb ni oçadi: `n` keyingi qator, `s` içiga kiriş, `c` davom etiş, `p` çiqariş.
- `logging` darajalari `DEBUG` dan `CRITICAL` gaça boradi; `basicConfig` daraja, format va manzilni bir marta belgilaydi.
- Har bir modulda `logging.getLogger(__name__)`, `except` içida esa `logger.exception` (yoki `exc_info=True`) dan foydalaning.

## Qöşimça manbalar

- [`pdb`: Python debuggeri](https://docs.python.org/3/library/pdb.html)
- [Logging HOWTO qöllanmasi](https://docs.python.org/3/howto/logging.html)
- [`logging` moduli böyiça maʼlumotnoma](https://docs.python.org/3/library/logging.html)
