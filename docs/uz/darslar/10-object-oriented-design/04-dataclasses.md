---
title: Dataclasslar
description: "Maʼlumot saqlaydigan klasslarni ança kam kod bilan yozing: @dataclass, standart qiymatlar va default_factory, __post_init__ bilan tekşiriş, frozen va order dataclasslar, faqat kalit söz bilan beriladigan maydonlar, JSON uçun asdict hamda dataclass, klass va luğat orasida tanlaş."
---

# Dataclasslar

![Rasm: Dataclasslar](/images/topics-webp-uzb/dataclasses.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `@dataclass` siz uçun `__init__`, `__repr__` va `__eq__` ni qanday yozadi
- Maydonlarga standart qiymatlarni qanday beriş va nega röyxatlarga `field(default_factory=list)` kerak
- `__post_init__` da qiymatlarni qanday tekşiriş va hisoblaş
- `frozen=True`, `order=True` va `kw_only=True` dataclassni qanday özgartiradi
- Dataclasslarni `asdict()` bilan luğat va JSON ga qanday aylantiriş
:::

## Nega bu muhim

Köp klasslar asosan **maʼlumot saqlaydi**: mahsulot, GPS nuqtasi, imtihon natijasi. Ularning har biri uçun bir xil andoza kodni yozgansiz: `__init__`, `__repr__` va `__eq__`, maydon qöşilgan sayin hammasi yangilanadi. `dataclasses` moduli bu kodni siz uçun yozadi va zamonaviy Python undan hamma joyda foydalanadi.

## Oldin va keyin

9-modulda mahsulot klassi bir neçta önlab qatorni egallagan edi. Dataclass versiyasi:

```python
from dataclasses import dataclass


@dataclass
class Product:
    name: str
    price: int
    quantity: int = 0


a = Product("Daftar", 15000, 40)
print(a)
print(a == Product("Daftar", 15000, 40))
print(Product("Ruçka", 3000))
```

```text
Product(name='Daftar', price=15000, quantity=40)
True
Product(name='Ruçka', price=3000, quantity=0)
```

`@dataclass` **maydonlarni** öqiydi va `__init__`, `__repr__` hamda `__eq__` ni yaratadi. Har bir maydon **type hint** (turni körsatuvçi izoh) bilan `name: type` körinişida yoziladi (*Type hintlar* darsiga qarang). Type hint **majburiy**, çunki u maydonni belgilaydi, lekin Python turni **tekşirmaydi**: `Product("Ruçka", "arzon")` işlayveradi. Standart qiymatli maydonlar standart qiymatsiz maydonlardan keyin keladi. Dataclass baribir klass, şuning uçun unga metodlar va xossalar qöşiş mumkin.

## Özgaruvçan standart qiymatlar va `default_factory`

Har bir öquvçiga baholarning böş röyxatini oddiy usulda beriş xato beradi:

```py
from dataclasses import dataclass

@dataclass
class Student:
    name: str
    grades: list = []
```

```text
ValueError: mutable default <class 'list'> for field grades is not allowed: use default_factory
```

Bitta röyxat barça obyektlar orasida bölişilgan bölardi (`def f(items=[])` tuzoği). **Tuzatiş:** `field(default_factory=...)` har bir obyekt uçun **yangi** qiymat yasaydigan funksiyani çaqiradi:

```python
from dataclasses import dataclass, field


@dataclass
class Student:
    name: str
    grades: list = field(default_factory=list)


aziza = Student("Aziza")
bekzod = Student("Bekzod")
aziza.grades.append(95)
print(aziza)
print(bekzod)
```

```text
Student(name='Aziza', grades=[95])
Student(name='Bekzod', grades=[])
```

Argumentsiz istalgan funksiya işlaydi: `list`, `dict`, `set` yoki özingizniki.

## `__post_init__` bilan tekşiriş

Yaratilgan `__init__` qiymatlarni şunçaki saqlaydi. Undan keyin darhol biror narsani tekşiriş yoki hisoblaş uçun `__post_init__` ni aniqlang. U `__init__` oxirida avtomatik işga tuşadi:

```python
from dataclasses import dataclass, field


@dataclass
class BankTransfer:
    sender: str
    receiver: str
    amount: int
    fee: int = field(init=False)      # hisoblanadi, uzatilmaydi

    def __post_init__(self):
        if self.amount <= 0:
            raise ValueError(f"Summa musbat bölişi kerak, berilgan: {self.amount}")
        self.fee = max(1_000, round(self.amount * 0.005))


print(BankTransfer("Aziza", "Bekzod", 2_500_000))
try:
    BankTransfer("Farrux", "Aziza", -50)
except ValueError as error:
    print("Rad etildi:", error)
```

```text
BankTransfer(sender='Aziza', receiver='Bekzod', amount=2500000, fee=12500)
Rad etildi: Summa musbat bölişi kerak, berilgan: -50
```

`__post_init__` qiymatlarni tekşira, tozalay va hisoblay oladi. `field(init=False)` "maydon, lekin `__init__` parametri emas" degani.

## Muzlatilgan dataclasslar

GPS koordinatasi kabi baʼzi qiymatlar heç qaçon özgarmasligi kerak. `frozen=True` maydonlarni faqat öqiladigan qiladi (`point.lat = 0` `FrozenInstanceError` beradi), muzlatilgan obyektlar esa **luğat kalitlari** va **töplam** elementlari böla oladi:

```python
from dataclasses import dataclass, replace


@dataclass(frozen=True)
class Point:
    lat: float
    lon: float


cities = {Point(41.31, 69.28): "Toşkent", Point(39.65, 66.96): "Samarqand"}
print(cities[Point(39.65, 66.96)])
print(len({Point(41.31, 69.28), Point(41.31, 69.28)}))

moved = replace(Point(41.31, 69.28), lon=69.30)   # özgartirilgan NUSXA
print(moved)
```

```text
Samarqand
1
Point(lat=41.31, lon=69.3)
```

Muzlatilgan obyektni "özgartiriş" uçun `replace()` yangisini yasaydi. `__post_init__` da tekşirib, keyin muzlatiş tasodifan heç qaçon yaroqsiz bölib qolmaydigan obyektlarni beradi.

## `order=True` bilan saralaş

`order=True` `<` va boşqa taqqoslaşlarni qöşadi, maydonlarni xuddi kortejlar kabi **tartib bilan** soliştiradi:

```python
from dataclasses import dataclass, field


@dataclass(order=True)
class Task:
    priority: int
    title: str = field(compare=False)


tasks = [Task(3, "Gullarni suğoriş"), Task(1, "Hisoblarni tölaş"), Task(2, "Non oliş")]
for task in sorted(tasks):
    print(task.priority, task.title)

print(Task(1, "a") == Task(1, "b"))
```

```text
1 Hisoblarni tölaş
2 Non oliş
3 Gullarni suğoriş
True
```

`compare=False` `title` ni saralaşdan çiqarib qöyadi, lekin oxirgi qatorga qarang: u uni `==` va xeşlaşdan ham çiqaradi, şuning uçun ikki turli vazifa teng böladi. Maydonni faqat u obyektlarni farqli qilmasligi kerak bölganda yaşiring. Aks holda 4-maşqdagidek `key=` bilan saralang.

## Luğat va JSON ga özgartiriş

`asdict()` dataclassni, içma-iç dataclasslarni ham, `json` uçun oddiy luğatlarga aylantiradi:

```python
import json
from dataclasses import dataclass, field, asdict


@dataclass
class Item:
    name: str
    price: int


@dataclass
class Order:
    customer: str
    items: list = field(default_factory=list)


order = Order("Dilnoza", [Item("Qahva", 25_000), Item("Asal", 90_000)])
text = json.dumps(asdict(order))
print(text)

loaded = json.loads(text)
restored = Order(loaded["customer"], [Item(**item) for item in loaded["items"]])
print(restored == order)
```

```text
{"customer": "Dilnoza", "items": [{"name": "Qahva", "price": 25000}, {"name": "Asal", "price": 90000}]}
True
```

Orqaga qaytiş qöl bilan bajariladi: `Item(**item)` har bir luğatni nomli argumentlarga ajratadi.

## Vorislik va faqat kalit söz bilan beriladigan maydonlar

Bola dataclassning maydonlari ota klassnikidan keyin keladi, bu esa ota maydonida standart qiymat bölganda "standart qiymatlar oxirida" qoidasini buzadi (4-xato). `kw_only=True` bilan har bir maydon nomi bilan uzatiladi, şuning uçun tartib endi muhim emas:

```python
from dataclasses import dataclass


@dataclass(kw_only=True)
class Employee:
    name: str
    salary: int
    city: str = "Toşkent"


@dataclass(kw_only=True)
class Contractor(Employee):
    agency: str


print(Contractor(name="Bekzod", salary=9_000_000, agency="IT Park Staffing"))
```

```text
Contractor(name='Bekzod', salary=9000000, city='Toşkent', agency='IT Park Staffing')
```

`field(kw_only=True)` bitta maydon uçun xuddi şu işni bajaradi.

## Yana imkoniyatlar va qaçon dataclass işlatiş

Yana ikki imkoniyatni biliş foydali. `@dataclass(slots=True)` kamroq xotira işlatadi va xato yozilgan atributga qiymat beriş (`s.dark_mdoe = True`) uni jimgina yaratiş örniga `AttributeError` beradi. `field(repr=False)` parol xeşi kabi maydonni `repr` dan yaşiradi.

JSON dan kelgan maʼlumot qisqa vaqt `dict` bölib qolişi mumkin, lekin u dasturingiz böylab yura boşlaşi bilan uni dataclassga aylantiring. `__init__` haqiqiy iş bajarsa yoki obyekt asosan xatti-harakatdan iborat bölsa, oddiy klassdan foydalaning.

## Özingiz sinab köring

Standart qiymati `0` bölgan `discount_percent` maydonini qöşing, `__post_init__` da uning 0 va 90 orasida ekanini tekşiring va uni `total` xossasida işlating.

<ClientOnly><PythonPlayground :code='"from dataclasses import dataclass, field, asdict\n\n\n@dataclass\nclass LineItem:\n    name: str\n    price: int\n    qty: int = 1\n\n    def __post_init__(self):\n        if self.price < 0 or self.qty < 1:\n            raise ValueError(f\"Notöğri qator: {self}\")\n\n\n@dataclass\nclass Cart:\n    owner: str\n    items: list = field(default_factory=list)\n\n    @property\n    def total(self):\n        return sum(i.price * i.qty for i in self.items)\n\n\ncart = Cart(\"Aziza\")\ncart.items.append(LineItem(\"Somsa\", 8000, 3))\ncart.items.append(LineItem(\"Çoy\", 5000))\nprint(cart)\nprint(\"Jami:\", cart.total)\nprint(asdict(cart))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Izohni unutiş

```python
from dataclasses import dataclass

@dataclass
class Book:
    title: str
    pages = 100            # izoh yöq: bu maydon EMAS

print(Book("Ötkan kunlar"))
```

```text
Book(title='Ötkan kunlar')
```

`: int` siz `pages` şunçaki klass atributi. **Tuzatiş:** `pages: int = 100`.

### 2. `__init__` ni özingiz yoziş

```py
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

    def __init__(self, x, y):       # yaratilganini almaştiradi
        self.x = x                  # y unutildi

print(Point(1, 2))
```

```text
AttributeError: 'Point' object has no attribute 'y'
```

**Tuzatiş:** öz `__init__` ingizni olib taşlang va qöşimça mantiqni `__post_init__` ga qöying.

### 3. `__post_init__` da muzlatilgan maydonga qiymat beriş

```py
from dataclasses import dataclass

@dataclass(frozen=True)
class Money:
    amount: float

    def __post_init__(self):
        self.amount = round(self.amount, 2)

Money(10.456)
```

```text
dataclasses.FrozenInstanceError: cannot assign to field 'amount'
```

Muzlatilgan - demak muzlatilgan, hatto `__post_init__` da ham. **Tuzatiş:** tekşiriş uçun uning örniga xato çaqiring. Maydonni normallaştiriş uçun hujjatlarda körsatilgan usul yaratiş paytida muzlatişni bir marta aylanib ötadi: `object.__setattr__(self, "amount", round(self.amount, 2))` `Money(amount=10.46)` ni beradi.

### 4. Ota klassdagi standart qiymatdan keyin bola maydoni

```py
from dataclasses import dataclass

@dataclass
class Employee:
    name: str
    city: str = "Toşkent"

@dataclass
class Contractor(Employee):
    agency: str
```

```text
TypeError: non-default argument 'agency' follows default argument 'city'
```

**Tuzatiş:** `agency` ga standart qiymat bering yoki yuqorida körsatilgandek `kw_only=True` dan foydalaning.

## Maşqlar

### 1. Kitob yozuvi <Difficulty level="1" />

`title`, `author`, `year` va `available` (standart `True`) maydonli `Book` dataclassini yarating. Bitta kitobni çop eting va bir xil qiymatli ikki kitob teng ekanini tekşiring.

::: details Yeçim
```python
from dataclasses import dataclass


@dataclass
class Book:
    title: str
    author: str
    year: int
    available: bool = True


a = Book("Ötkan kunlar", "Abdulla Qodiriy", 1926)
b = Book("Ötkan kunlar", "Abdulla Qodiriy", 1926)
print(a)
print(a == b)
```

```text
Book(title='Ötkan kunlar', author='Abdulla Qodiriy', year=1926, available=True)
True
```
:::

### 2. Standart röyxatli pleylist <Difficulty level="1" />

`name` va `songs` (standart: yangi böş röyxat) maydonli hamda `add(song)` metodli `Playlist` dataclassini yarating. "Ertalab" pleylistiga ikkita qöşiq qöşing va "Keçqurun" pleylisti hali ham böşligini körsating.

::: details Yeçim
```python
from dataclasses import dataclass, field


@dataclass
class Playlist:
    name: str
    songs: list = field(default_factory=list)

    def add(self, song):
        self.songs.append(song)


morning = Playlist("Ertalab")
evening = Playlist("Keçqurun")
morning.add("A qöşiq")
morning.add("B qöşiq")
print(morning)
print(evening)
```

```text
Playlist(name='Ertalab', songs=['A qöşiq', 'B qöşiq'])
Playlist(name='Keçqurun', songs=[])
```
:::

### 3. Harorat oraliği <Difficulty level="2" />

`low` va `high` maydonli muzlatilgan `TempRange` dataclassini yarating. `__post_init__` da `low > high` bölsa `ValueError` çaqiring. `span` xossasini qöşing. `TempRange(22, 41)` ning oraliğini, `(22, 41)`, `(-5, 10)` va yana `(22, 41)` ni saqlaydigan töplam uzunligini hamda `TempRange(30, 10)` uçun xatoni çop eting.

::: details Yeçim
```python
from dataclasses import dataclass


@dataclass(frozen=True)
class TempRange:
    low: float
    high: float

    def __post_init__(self):
        if self.low > self.high:
            raise ValueError(f"low {self.low} high {self.high} dan yuqori")

    @property
    def span(self):
        return self.high - self.low


print(TempRange(22, 41).span)
print(len({TempRange(22, 41), TempRange(-5, 10), TempRange(22, 41)}))

try:
    TempRange(30, 10)
except ValueError as error:
    print("Xato:", error)
```

```text
19
2
Xato: low 30 high 10 dan yuqori
```
:::

### 4. Tavsifdan loyihalaş: imtihon reytingi <Difficulty level="2" />

Buxorodagi maktab imtihon natijalarini saqlaydi: ism, 0 dan 100 gaça ball (boşqa har qanday qiymatni rad eting) va sarflangan daqiqalar. Reyting **eng yuqori ball**, keyin **kamroq daqiqa** böyiça saralanadi. Dataclassni loyihalang va `key=` li `sorted()` yordamida Aziza (92, 55), Bekzod (97, 80) va Dilnoza (92, 41) uçun reytingni çop eting (maslahat: kalit kortej qaytarişi mumkin, `-score` esa eng yuqorisini birinçi qöyadi).

::: details Yeçim
```python
from dataclasses import dataclass


@dataclass
class Result:
    name: str
    score: int
    minutes: int

    def __post_init__(self):
        if not 0 <= self.score <= 100:
            raise ValueError(f"{self.name} uçun ball oraliqdan taşqarida: {self.score}")


results = [Result("Aziza", 92, 55), Result("Bekzod", 97, 80), Result("Dilnoza", 92, 41)]
for rank, r in enumerate(sorted(results, key=lambda r: (-r.score, r.minutes)), start=1):
    print(f"{rank}. {r.name:<8} {r.score:>3}  {r.minutes} daqiqa")
```

```text
1. Bekzod    97  80 daqiqa
2. Dilnoza   92  41 daqiqa
3. Aziza     92  55 daqiqa
```

Kortejlar element-baelement taqqoslanadi: avval `-score`, keyin `minutes`.
:::

### 5. Kontaktlar daftarini saqlaş va yuklaş <Difficulty level="3" />

`Contact` dataclassini (name, phone, standart böş `tags` röyxati) va `asdict` yordamida JSON yozadigan `save(path)` hamda obyektlarni qayta tiklaydigan `@classmethod` `load(path)` li `ContactBook` dataclassini (kontaktlar röyxati) yarating. Ikki kontaktli daftarni saqlang, uni yuklang va ikkinçi kontaktni hamda ikkala daftar teng ekanini çop eting.

::: details Yeçim
```python
import json
from dataclasses import dataclass, field, asdict


@dataclass
class Contact:
    name: str
    phone: str
    tags: list = field(default_factory=list)


@dataclass
class ContactBook:
    contacts: list = field(default_factory=list)

    def save(self, path):
        with open(path, "w", encoding="utf-8") as f:
            json.dump(asdict(self), f, indent=2, ensure_ascii=False)

    @classmethod
    def load(cls, path):
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return cls([Contact(**c) for c in data["contacts"]])


book = ContactBook([Contact("Aziza", "+998901234567", ["oila"]), Contact("Bekzod", "+998935551122")])
book.save("contacts.json")

copy = ContactBook.load("contacts.json")
print(copy.contacts[1])
print("Yuklangandan keyin teng:", copy == book)
```

```text
Contact(name='Bekzod', phone='+998935551122', tags=[])
Yuklangandan keyin teng: True
```

Yaratilgan `__eq__` dataclasslarning içma-iç röyxatlarini ham soliştiradi.
:::

## Xulosa

- `@dataclass` izohli maydonlardan `__init__`, `__repr__` va `__eq__` ni yaratadi. Standart qiymatlar oxirida keladi.
- Özgaruvçan standart qiymatlar uçun `field(default_factory=list)` ni işlating. Oddiy `[]` `ValueError` beradi.
- `__post_init__` `__init__` dan keyin işlaydi: maydonlarni şu yerda tekşiring, tozalang va hisoblang.
- `frozen=True` obyektlarni faqat öqiladigan va xeşlanadigan qiladi. `order=True` ularni saralanadigan qiladi; `compare=False` maydonni `==` dan ham yaşiradi.
- `kw_only=True` maydonlarni faqat kalit söz bilan beriladigan qiladi, bu vorislikdagi standart qiymatlar tartibini tuzatadi.
- `asdict()` JSON uçun luğatga aylantiradi. Obyektlarni `Class(**data)` bilan qayta tiklang.

## Qöşimça manbalar

- [`dataclasses` module documentation](https://docs.python.org/3/library/dataclasses.html)
- [PEP 557: Data Classes](https://peps.python.org/pep-0557/)
- [`collections.namedtuple`](https://docs.python.org/3/library/collections.html#collections.namedtuple)
