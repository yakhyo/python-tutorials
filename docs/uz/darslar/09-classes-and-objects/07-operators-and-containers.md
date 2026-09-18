---
title: Operatorlar va konteynerlar
description: "Obyektlarga __add__ va __rmul__ orqali arifmetika bering, qöllab-quvvatlanmaydigan turlar uçun NotImplemented qaytaring va __len__, __getitem__, __contains__, __iter__ hamda __bool__ bilan kolleksiyalar yarating."
---

# Operatorlar va konteynerlar

![Rasm: Operatorlar va konteynerlar](/images/topics-webp-uzb/operators-and-containers.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `__add__` va `__mul__` obyektlarga arifmetikani qanday beradi va ular nega **yangi** obyekt qaytaradi
- Nega qöllab-quvvatlanmaydigan turlar `NotImplemented` oladi va `__rmul__` `3 * price` ni qanday işlatadi
- `__len__`, `__getitem__`, `__contains__` va `__iter__` obyektni qanday qilib kolleksiya kabi tutadi
- `__bool__` (yoki `__len__`) obyektning rostligini qanday hal qiladi
- Qaçon operator yordam beradi va qaçon nomli metod tuşunarliroq
:::

## Nega bu muhim

*Obyektlarni ifodalaş va taqqoslaş* darsida klasslaringiz çop etiş va taqqoslaşni örgandi. Ayni ğoya davom etadi: `+` `__add__` ni, `len()` `__len__` ni, `for` esa `__iter__` ni çaqiradi. Şunday qilib `Money` obyektlarini `+` bilan qöşiş mumkin, `Playlist` esa xuddi röyxat kabi `len()`, `in`, indekslaş va `for` bilan işlaydi.

## Arifmetika: `__add__`, `__mul__` va `__rmul__`

`+` `__add__` ni, `-` `__sub__` ni, `*` esa `__mul__` ni çaqiradi. Ular **yangi obyekt qaytarişi** va ikkala operandni özgarişsiz qoldirişi kerak - xuddi `3 + 4` `3` ni özgartirmagani kabi.

```python
class Money:
    def __init__(self, amount, currency="som"):
        self.amount = amount
        self.currency = currency

    def __repr__(self):
        return f"Money({self.amount!r}, {self.currency!r})"

    def __add__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        if other.currency != self.currency:
            raise ValueError(f"{self.currency} va {other.currency} ni qöşib bölmaydi")
        return Money(self.amount + other.amount, self.currency)

    def __mul__(self, factor):
        if not isinstance(factor, int):
            return NotImplemented
        return Money(self.amount * factor, self.currency)

    def __rmul__(self, factor):
        return self.__mul__(factor)        # price * 3 dan taşqari 3 * price ni ham işlatadi

tea = Money(15000)
samsa = Money(8000)

print(tea * 2 + 3 * samsa)
print(tea)                                  # özgarmagan
print(sum([tea, samsa], Money(0)))

for bad in [Money(10, "usd"), 500]:
    try:
        tea + bad
    except (ValueError, TypeError) as error:
        print(type(error).__name__, error)
```

```text
Money(54000, 'som')
Money(15000, 'som')
Money(23000, 'som')
ValueError som va usd ni qöşib bölmaydi
TypeError unsupported operand type(s) for +: 'Money' and 'int'
```

- `3 * samsa` avval `int.__mul__(3, samsa)` ni sinab köradi, u `NotImplemented` qaytaradi, şunda Python **aks (reflected)** metod `samsa.__rmul__(3)` ni sinaydi. (`__radd__` va boşqalari ham şunday işlaydi.)
- `500` kabi qöllab-quvvatlanmaydigan tur uçun `__add__` **`NotImplemented`** qaytaradi. Python ikkinçi operandga imkon beradi, keyin aniq `TypeError` çaqiradi. Valyutalarni aralaştiriş - tögri tur, lekin notögri qiymat, şuning uçun `__add__` özi `ValueError` çaqiradi.
- `sum()` `0` dan boşlaydi, `0 + tea` esa aniqlanmagan, şuning uçun boşlanğiç qiymat sifatida `Money(0)` uzating.

## Konteynerlar: `__len__`, `__getitem__`, `__contains__`, `__iter__`

Kolleksiya saqlaydigan klass röyxat kabi işlaşi mumkin:

| Sintaksis | Metod |
|---|---|
| `len(obj)` | `__len__(self)` |
| `obj[i]` | `__getitem__(self, i)` |
| `x in obj` | `__contains__(self, x)` |
| `for x in obj` | `__iter__(self)` |

```python
class Playlist:
    def __init__(self, songs=None):
        self._songs = [] if songs is None else list(songs)

    def add(self, song):
        self._songs.append(song)

    def __len__(self):
        return len(self._songs)

    def __getitem__(self, index):
        return self._songs[index]         # manfiy indeks va kesimlarni röyxat özi hal qiladi

    def __contains__(self, song):
        return song in self._songs

    def __iter__(self):
        return iter(self._songs)          # röyxatning öz iteratorini beramiz

mix = Playlist(["Samarqand tunlari", "Çöl şamoli", "Ipak yöli"])
mix.add("Toşkent yomğiri")

print(len(mix), mix[0], "|", mix[-1], mix[1:3])
print("Ipak yöli" in mix, "Nomaʼlum qöşiq" in mix)
for number, song in enumerate(mix, start=1):
    print(f"{number}. {song}")
```

```text
4 Samarqand tunlari | Toşkent yomğiri ['Çöl şamoli', 'Ipak yöli']
True False
1. Samarqand tunlari
2. Çöl şamoli
3. Ipak yöli
4. Toşkent yomğiri
```

`__iter__` **iterator** qaytarişi şart - `for` undan elementlarni bittalab oladi; `iter(self._songs)` röyxatning öz iteratorini "qarzga" oladi. Şundan keyin sikl bilan işlaydigan hamma narsa işlaydi: `for`, `enumerate()`, `sorted()`, `list()` (*Iteratorlar va generatorlar* darsi çuqurroq tuşuntiradi). `__contains__` bölmasa ham `in` sikl orqali işlayveradi; uni tezroq yoki boşqaça tekşira olsangiz yozing.

## `__bool__`: rostlik

`if obj:` `__bool__` ni, u bölmasa `__len__` ni çaqiradi (nol - yolğon). Ikkalasi ham bölmasa, har qanday obyekt rost. Şuning uçun yuqoridagi böş `Playlist` allaqaçon yolğon. `__bool__` rostlikni tögridan-tögri belgilaydi:

```python
class BankAccount:
    def __init__(self, balance):
        self.balance = balance

    def __bool__(self):
        return self.balance > 0

print(bool(BankAccount(0)), bool(BankAccount(125000)))
```

```text
False True
```

`__bool__` ni faqat "rost" ning bitta ravşan maʼnosi bölgandagina işlating; köpinça `if account.balance > 0:` tuşunarliroq.

## Maxsus metodlarni haddan taşqari işlatmang

Operatorni faqat maʼnosi ravşan bölgandagina işlating:

| Mos keladi | Mos kelmaydi |
|---|---|
| `money1 + money2`: summalarni qöşiş | talabani kursga yoziş uçun `student + course`: `student.enroll(course)` işlating |
| `vector * 2`: masştablaş | `cart * 2`: nusxalaşmi? kupon qöllaşmi? Noaniq |

`cart.apply_coupon("NAVRUZ10")` kabi nomli metod hiç kim taxmin qila olmaydigan "ayyor" operatordan yaxşi. Asosan `__init__`, `__repr__` va `__eq__` kerak bölganda esa *Dataclasslar* darsi `@dataclass` ularni siz uçun qanday yozişini körsatadi.

## Özingiz sinab köring

`Money` ga `__sub__` metodini qöşing va sinab köring.

<ClientOnly><PythonPlayground :code='"class Money:\n    def __init__(self, amount, currency=\"som\"):\n        self.amount = amount\n        self.currency = currency\n\n    def __repr__(self):\n        return f\"Money({self.amount!r}, {self.currency!r})\"\n\n    def __add__(self, other):\n        if not isinstance(other, Money):\n            return NotImplemented\n        return Money(self.amount + other.amount, self.currency)\n\nlunch = Money(45000) + Money(12000)\nprint(lunch)\nprint(sum([Money(1000), Money(2000)], Money(0)))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `NotImplemented` örniga `False` qaytariş

```python
class Money:
    def __init__(self, amount):
        self.amount = amount

    def __add__(self, other):
        if not isinstance(other, Money):
            return False          # Yomon: qöşiş natija bergandek körsatadi
        return Money(self.amount + other.amount)

print(Money(100) + 50)
```

```text
False
```

Xato yaşirinadi: `Money(100) + 50` "işlaydi". **Tuzatiş:** `return NotImplemented`, şunda Python `TypeError: unsupported operand type(s) for +: 'Money' and 'int'` çaqiradi.

### 2. Arifmetik metodda `self` ni özgartiriş

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        self.x += other.x         # Yomon: çap operandni özgartiradi
        self.y += other.y
        return self

start = Point(0, 0)
end = start + Point(1, 1)
print(start.x, start.y, end is start)   # start hali ham (0, 0) bölişi kerak edi
```

```text
1 1 True
```

`a + b` hiç qaçon `a` ni özgartirmasligi kerak. **Tuzatiş:** `return Point(self.x + other.x, self.y + other.y)`.

### 3. Röyxat qaytaradigan `__iter__`

```py
class Playlist:
    def __init__(self, songs):
        self._songs = list(songs)

    def __iter__(self):
        return self._songs        # röyxat, iterator emas

for song in Playlist(["Lazgi"]):
    print(song)
```

```text
TypeError: iter() returned non-iterator of type 'list'
```

Röyxat iteratsiya qilinadigan obyekt, lekin iterator emas. **Tuzatiş:** `return iter(self._songs)`.

## Maşqlar

### 1. Ballarni qöşiş <Difficulty level="1" />

`__repr__` (`Points(15)`) va yangi `Points` qaytaradigan yoki boşqa turlar uçun `NotImplemented` beradigan `__add__` ga ega `Points(value)` klassini yozing. `Points(10) + Points(5)` ni va özgarmagan `Points(10)` ni bir qatorda çop eting, keyin `Points(10) + 5` ni sinab köring va xabar bilan `Xato:` deb çop eting.

::: details Yeçim
```python
class Points:
    def __init__(self, value):
        self.value = value

    def __repr__(self):
        return f"Points({self.value})"

    def __add__(self, other):
        if not isinstance(other, Points):
            return NotImplemented
        return Points(self.value + other.value)

day1 = Points(10)
total = day1 + Points(5)
print(total, day1)
try:
    day1 + 5
except TypeError as error:
    print("Xato:", error)
```

```text
Points(15) Points(10)
Xato: unsupported operand type(s) for +: 'Points' and 'int'
```
:::

### 2. Kitob javoni <Difficulty level="1" />

`__len__`, `__getitem__` va katta-kiçik harfni farqlamaydigan `__contains__` ga ega `Bookshelf(titles)` klassini yozing. `["Ötkan kunlar", "Python asoslari", "Navoiy ğazallari"]` uçun uzunlikni hamda birinçi va oxirgi nomni, keyin `"python asoslari" in shelf` va `"Dunyo atlasi" in shelf` ni, sönra javonning va `Bookshelf([])` ning `bool()` ini çop eting.

::: details Yeçim
```python
class Bookshelf:
    def __init__(self, titles):
        self._titles = list(titles)

    def __len__(self):
        return len(self._titles)

    def __getitem__(self, index):
        return self._titles[index]

    def __contains__(self, title):
        return title.lower() in [t.lower() for t in self._titles]

shelf = Bookshelf(["Ötkan kunlar", "Python asoslari", "Navoiy ğazallari"])
print(len(shelf), shelf[0], shelf[-1])
print("python asoslari" in shelf, "Dunyo atlasi" in shelf)
print(bool(shelf), bool(Bookshelf([])))
```

```text
3 Ötkan kunlar Navoiy ğazallari
True False
True False
```

`__bool__` yöq, şuning uçun `bool()` `__len__` dan foydalanadi.
:::

### 3. Qöşiladigan masofalar <Difficulty level="2" />

`__repr__` (`Distance(578)`), `d1 + d2`, `d * 2` va `2 * d`, hamda `0 + d` ni `d` deb qabul qiladigan `__radd__` ga ega `Distance(km)` klassini yozing - şunda `sum()` ga boşlanğiç qiymat kerak bölmaydi. 308, 270 va 450 km lik bölaklar uçun yiğindini `Jami:` bilan, `2 * total` ni esa `Boriş-keliş:` bilan çop eting.

::: details Yeçim
```python
class Distance:
    def __init__(self, km):
        self.km = km

    def __repr__(self):
        return f"Distance({self.km!r})"

    def __add__(self, other):
        if not isinstance(other, Distance):
            return NotImplemented
        return Distance(self.km + other.km)

    def __radd__(self, other):
        if other == 0:                   # sum() 0 dan boşlaydi
            return self
        return NotImplemented

    def __mul__(self, factor):
        if not isinstance(factor, (int, float)):
            return NotImplemented
        return Distance(self.km * factor)

    __rmul__ = __mul__                   # ayni funksiya 2 * d uçun ham işlaydi

legs = [Distance(308), Distance(270), Distance(450)]
total = sum(legs)
print("Jami:", total)
print("Boriş-keliş:", 2 * total)
```

```text
Jami: Distance(1028)
Boriş-keliş: Distance(2056)
```

`__rmul__ = __mul__` ayni funksiyani ikkinçi nom bilan qayta işlatadi.
:::

### 4. Klass loyihalang: xarid savati <Difficulty level="2" />

Quyidagi taʼrif böyiça `Cart` klassini loyihalang:

> `add(name, price, quantity=1)` mahsulot qöşadi (ayni nom yana kelsa, miqdori oşadi). `len(cart)` - jami dona, `cart["Tea"]` - mahsulot miqdori (yöq bölsa 0), `in` mahsulot borligini tekşiradi, sikl nomlarni qöşilgan tartibda beradi, böş savat yolğon, `total()` esa narxni qaytaradi.

U quyidagi kod bilan işlaşi va aynan şu natijani çop etişi kerak:

```py
cart = Cart()
print(bool(cart))
cart.add("Tea", 15000, 2)
cart.add("Samsa", 8000, 3)
cart.add("Tea", 15000)
print(len(cart), cart["Tea"], cart["Juice"])
print("Samsa" in cart, "Juice" in cart)
print(list(cart), cart.total())
```

```text
False
6 3 0
True False
['Tea', 'Samsa'] 69000
```

::: details Yeçim
```python
class Cart:
    def __init__(self):
        self._lines = {}                # nom -> [narx, miqdor]

    def add(self, name, price, quantity=1):
        if name in self._lines:
            self._lines[name][1] += quantity
        else:
            self._lines[name] = [price, quantity]

    def total(self):
        return sum(price * qty for price, qty in self._lines.values())

    def __len__(self):
        return sum(qty for _, qty in self._lines.values())

    def __getitem__(self, name):
        if name in self._lines:
            return self._lines[name][1]
        return 0

    def __contains__(self, name):
        return name in self._lines

    def __iter__(self):
        return iter(self._lines)

cart = Cart()
print(bool(cart))
cart.add("Tea", 15000, 2)
cart.add("Samsa", 8000, 3)
cart.add("Tea", 15000)
print(len(cart), cart["Tea"], cart["Juice"])
print("Samsa" in cart, "Juice" in cart)
print(list(cart), cart.total())
```

`__bool__` bölmagani uçun böş savatni `__len__` yolğon qiladi.
:::

### 5. Ombor zaxirasini birlaştiriş <Difficulty level="3" />

Mahsulot sonlari luğatini örab oladigan `Inventory(counts=None)` klassini yozing: `__repr__` (`Inventory({'tea': 50})`), ikkala sonni qöşib **yangi** ombor qaytaradigan `+` (asl obyektlar özgarmaydi), `inv["tea"]` (nomaʼlum mahsulot uçun 0), jami dona sifatida `len()` va mahsulot nomlari böyiça alifbo tartibida iteratsiya.

Toşkent (`{"tea": 40, "samsa": 25}`) va Samarqand (`{"tea": 10, "bread": 30}`) ni birlaştirib natijani çop eting. Keyin uning uzunligini `"tea"` va `"juice"` sonlari bilan, sönra uning `list()` ini Toşkentning `"bread"` soni bilan va nihoyat `Inventory()` uçun `"Zaxira bor"` yoki `"Böş"` ni çop eting.

::: details Yeçim
```python
class Inventory:
    def __init__(self, counts=None):
        self._counts = dict(counts or {})

    def __repr__(self):
        return f"Inventory({self._counts!r})"

    def __add__(self, other):
        if not isinstance(other, Inventory):
            return NotImplemented
        merged = dict(self._counts)
        for item, count in other._counts.items():
            merged[item] = merged.get(item, 0) + count
        return Inventory(merged)

    def __getitem__(self, item):
        return self._counts.get(item, 0)

    def __len__(self):
        return sum(self._counts.values())

    def __iter__(self):
        return iter(sorted(self._counts))

tashkent = Inventory({"tea": 40, "samsa": 25})
samarkand = Inventory({"tea": 10, "bread": 30})
total = tashkent + samarkand

print(total)
print(len(total), total["tea"], total["juice"])
print(list(total), tashkent["bread"])
print("Zaxira bor" if Inventory() else "Böş")
```

```text
Inventory({'tea': 50, 'samsa': 25, 'bread': 30})
105 50 0
['bread', 'samsa', 'tea'] 0
Böş
```

`__add__` birlaştirişdan oldin `self._counts` ni nusxalaydi, şuning uçun `tashkent` da non paydo bölmaydi, `if Inventory():` esa `__len__` ga tayanadi.
:::

## Xulosa

- `+`, `-` va `*` `__add__`, `__sub__` va `__mul__` ni çaqiradi, ular esa **yangi** obyekt qaytaradi.
- Qöllab-quvvatlanmaydigan turlar uçun `NotImplemented` qaytaring; Python keyin `__rmul__` kabi aks metodlarni sinaydi yoki `TypeError` çaqiradi.
- `__len__`, `__getitem__`, `__contains__` va `__iter__` (odatda `return iter(self._items)`) klassni konteyner kabi tutadi.
- `if obj:` `__bool__` dan, u bölmasa `__len__` dan foydalanadi.
- Operatorlarni faqat maʼnosi ravşan bölgandagina işlating. Aks holda yaxşi nomlangan metod tuşunarliroq.

## Qöşimça manbalar

- [Data model - Emulating numeric types](https://docs.python.org/3/reference/datamodel.html#emulating-numeric-types)
- [Data model - Emulating container types](https://docs.python.org/3/reference/datamodel.html#emulating-container-types)
- [Built-in constants - NotImplemented](https://docs.python.org/3/library/constants.html#NotImplemented)
- [Built-in functions - iter()](https://docs.python.org/3/library/functions.html#iter)
