---
title: Obyektga yönaltirilgan dasturlaş nima uçun kerak?
description: "Maʼlumotlar va funksiyalar alohida yaşaganda paydo böladigan muammolarni köring, luğatga asoslangan bank hisobini klass sifatida qayta yozing va OOP ning asosiy atamalarini örganing."
---

# Obyektga yönaltirilgan dasturlaş nima uçun kerak?

![Rasm: Obyektga yönaltirilgan dasturlaş nima uçun kerak?](/images/topics-webp-uzb/why-oop.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Bir-biriga boğliq maʼlumotlarni alohida özgaruvçilar, parallel röyxatlar va boğlanmagan luğatlarda saqlaş muammolari
- Luğat va funksiyalar qanday qilib **klassga** aylanadi
- Obyektlar ğoyasi: **maʼlumotlar** (atributlar) va **xatti-harakatlar** (metodlar) bir joyda
- Asosiy atamalar (klass, obyekt, nusxa, atribut, metod) va nega Pythondagi har bir qiymat allaqaçon obyekt
- Qaçon klass foydali va qaçon oddiy funksiyalar yetarli
:::

## Nega bu muhim

Dasturlar ösgan sari önlab özgaruvçi va funksiyalar paydo böladi va qaysi maʼlumot qaysi funksiyaga tegişli ekanini eslab qoliş kerak böladi. **Obyektga yönaltirilgan dasturlaş (OOP)** dasturingizdagi har bir "narsani" (bank hisobi, öquvçi, öyin qahramoni) uning maʼlumotlari va amallari bilan bitta birlikka joylaş imkonini beradi. Köpçilik katta Python loyihalari aynan şunday qurilgan.

## Muammo: tarqalib ketadigan maʼlumotlar

### Alohida özgaruvçilar va parallel röyxatlar

Alohida özgaruvçilarda (`owner1`, `balance1`, `owner2`, ...) kodda qaysilari birga ekanini heç narsa aytmaydi. Odatdagi keyingi qadam - har bir maydon uçun bitta röyxat:

```python
owners = ["Aziza", "Bekzod", "Dilnoza"]
balances = [500000, 120000, 75000]

# Bekzod hisobini yopadi, lekin biz faqat uning ismini öçiramiz...
owners.remove("Bekzod")

for owner, balance in zip(owners, balances):
    print(owner, balance)
```

```text
Aziza 500000
Dilnoza 120000
```

Endi Dilnozada Bekzodning balansi körinadi. Röyxatlar har doim **birga** özgarişi kerak va bitta unutilgan qator aloqani heç qanday xatosiz, jimgina buzadi.

### Luğatlar va funksiyalar

Luğatlar yaxşiroq, çunki har bir hisob öz maydonlarini birga saqlaydi:

```python
def deposit(account, amount):
    if amount <= 0:
        raise ValueError("Depozit musbat bölişi kerak")
    account["balance"] += amount

aziza = {"owner": "Aziza", "balance": 500000}
deposit(aziza, 50000)
print(aziza)
```

```text
{'owner': 'Aziza', 'balance': 550000}
```

Bu haqiqiy yaxşilaniş. Baribir baʼzi muammolar qoladi:

- **Funksiyalar alohida yuradi.** `deposit()` faqat hisob luğatlari bilan işlaydi, lekin uni ular bilan heç narsa boğlamaydi. Çöçqa-kassa uçun yozilgan boşqa `deposit()` boşqa narsani anglatişi mumkin.
- **Şakl - faqat kelişuv.** Hisob yaratadigan har bir kod aniq kalitlarni eslab qolişi kerak, `aziza["balanse"] = 0` kabi xato yoziş esa jimgina notöğri kalit qöşadi.

## Xuddi şu hisob klass sifatida

**Klass** (class) - bu çizma: "har bir hisobning egasi va balansi bor, u pul qöya va yeça oladi". Keyingi dars, *Klasslar va obyektlar*, sintaksisni tuşuntiradi. Hozirça şakllarni soliştiring:

| Oldin (luğat + funksiya) | Keyin (klass + metod) |
|---|---|
| `{"owner": "Aziza", "balance": 500000}` | `BankAccount("Aziza", 500000)` |
| `def deposit(account, amount):` | klass içida `def deposit(self, amount):` |
| `account["balance"] += amount` | `self.balance += amount` |
| `deposit(aziza, 50000)` | `aziza.deposit(50000)` |

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Depozit musbat bölişi kerak")
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Pul yetarli emas")
        self.balance -= amount

accounts = [
    BankAccount("Aziza", 500000),
    BankAccount("Bekzod", 120000),
    BankAccount("Dilnoza", 75000),
]

accounts[1].withdraw(20000)
accounts[2].deposit(25000)

for account in accounts:
    print(f"{account.owner:<8} {account.balance:>9,} söm")

try:
    accounts[2].withdraw(1000000)
except ValueError as error:
    print("Rad etildi:", error)
```

```text
Aziza      500,000 söm
Bekzod     100,000 söm
Dilnoza    100,000 söm
Rad etildi: Pul yetarli emas
```

Parallel röyxatlardan farqli ravişda, Dilnozaning ismi uning balansidan ajralib keta olmaydi: ikkalasi ham, ularni özgartiriş qoidalari bilan birga, **bitta obyekt içida** yaşaydi.

Lekin oddiy klass hammasini hal qilmaydi. Klassdan taşqaridagi kod baribir `aziza.balance = -999999` deb yoza oladi, `aziza.balanse = 0` kabi xato yoziş esa heç qanday xatosiz yangi atribut qöşib qöyadi. Bunday atributlarni qanday himoya qiliş *Xossalar va inkapsulyatsiya* darsida körsatiladi.

## Obyektlar maʼlumot va xatti-harakatni birlaştiradi

![Diagramma: Obyektlar maʼlumot va xatti-harakatni birlaştiradi](/images/companions-webp-uzb/oop-blueprint.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Bu OOP ning markaziy ğoyasi. **Obyekt** (object) **atributlarni** (attribute) - u biladigan maʼlumotlarni (`owner`, `balance`) va **metodlarni** (method) - u bajara oladigan amallarni (`deposit()`, `withdraw()`) birlaştiradi.

```text
      class BankAccount          (çizma)
     +----------------------+
     | maʼlumot: owner      |
     |           balance    |
     | amallar:  deposit()  |
     |           withdraw() |
     +----------------------+
   +--------+ +--------+ +---------+
   | Aziza  | | Bekzod | | Dilnoza |   (obyektlar / nusxalar)
   | 500000 | | 100000 | | 100000  |
   +--------+ +--------+ +---------+
```

Pişiriq qolipini tasavvur qiling: klass - qolip, har bir obyekt esa bir xil şakldagi alohida pişiriq.

## Pythonda hamma narsa allaqaçon obyekt

Siz birinçi darsingizdan beri obyektlardan foydalanasiz. Pythondagi har bir qiymat - obyekt va `type()` uning klassini aytadi:

```python
print(type(42))
print(type("Samarqand"))
print("toşkent".upper())      # maʼlumot (matn) + xatti-harakat (.upper())
```

```text
<class 'int'>
<class 'str'>
TOŞKENT
```

Har bir natijadagi `class` söziga eʼtibor bering. `int` va `str` - klasslar, har bir qiymat ulardan birining nusxasi, satr metodlari esa amaldagi OOP.

## Atamalar

| Atama | Maʼnosi, bank misolida |
|---|---|
| **klass** (class) | obyektlar uçun çizma: `BankAccount` |
| **obyekt** / **nusxa** (object / instance) | klassdan yasalgan bitta aniq narsa: Azizaning hisobi, "`BankAccount` nusxasi" |
| **atribut** (attribute) | obyektda saqlanadigan va nuqta bilan öqiladigan qiymat: `aziza.balance` |
| **metod** (method) | klassda aniqlangan va obyekt ustida çaqiriladigan funksiya: `aziza.deposit(50000)` |

## Qaçon OOP foydali va qaçon funksiyalar yetarli

| Vaziyat | Yaxşiroq tanlov |
|---|---|
| Birga bölgan va qoidalar böyiça özgaradigan maʼlumot (manfiy bölmasligi kerak bölgan balans) | klass |
| Köp öxşaş narsalar (100 ta hisob, 30 ta öquvçi) | klass |
| Kiritiş kiradi, natija çiqadi (Selsiydan Farengeytga) | funksiya |
| Yuqoridan pastga bir marta işlaydigan qisqa skript | funksiyalar |

Tezkor tekşiruv: agar **bir xil luğatni** uni tekşiradigan yoki özgartiradigan bir guruh funksiyaga qayta-qayta uzatayotgan bölsangiz, bu yozilişini kutayotgan klass. Faqat `add(a, b)` metodi bor `class Adder` kabi maʼlumotsiz, bitta metodli klass esa niqoblangan funksiya.

## Özingiz sinab köring

Mana kiçik öyin qahramoni. `describe()` metodini qöşing, uçinçi qahramon yarating va ularni jang qildiring.

<ClientOnly><PythonPlayground :code='"class Character:\n    def __init__(self, name, health):\n        self.name = name\n        self.health = health\n\n    def take_damage(self, amount):\n        self.health = max(0, self.health - amount)\n\n    def is_alive(self):\n        return self.health > 0\n\nfarrukh = Character(\"Farrux\", 100)\naziza = Character(\"Aziza\", 80)\n\nfarrukh.take_damage(30)\naziza.take_damage(90)\n\nfor hero in [farrukh, aziza]:\n    status = \"tirik\" if hero.is_alive() else \"yengildi\"\n    print(f\"{hero.name}: {hero.health} HP, {status}\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Metodni çaqirişda qavslarni unutiş

```python
class Account:
    def __init__(self, balance):
        self.balance = balance

    def is_empty(self):
        return self.balance == 0

account = Account(500000)
if account.is_empty:              # () yöq: natija emas, metodning özi
    print("Hisob böş!")
```

```text
Hisob böş!
```

`()` siz metod - metod obyekti, obyektlar esa truthy, şuning uçun `if` har doim ötadi. **Tuzatiş:** `account.is_empty()`.

### 2. Obyektda luğat sintaksisini işlatiş

```py
class Account:
    def __init__(self, balance):
        self.balance = balance

aziza = Account(500000)
print(aziza["balance"])
```

```text
TypeError: 'Account' object is not subscriptable
```

Obyektlar atributlar uçun nuqtadan foydalanadi: `aziza.balance`.

## Maşqlar

### 1. Obyektlarni toping <Difficulty level="1" />

`3.5`, `"Buxoro"`, `[10, 20]` va `(1, 2)` qiymatlarining har biri uçun qiymatni va uning turini bitta qatorda, masalan `3.5 <class 'float'>` körinişida çop eting. Keyin `"Buxoro".lower()` ni çop eting.

::: details Yeçim
```python
values = [3.5, "Buxoro", [10, 20], (1, 2)]
for value in values:
    print(value, type(value))

print("Buxoro".lower())
```

```text
3.5 <class 'float'>
Buxoro <class 'str'>
[10, 20] <class 'list'>
(1, 2) <class 'tuple'>
buxoro
```

Har bir qiymat qandaydir klassning nusxasi, `.lower()` kabi metodlar esa öşa klasslarga tegişli.
:::

### 2. Luğatdan klassga <Difficulty level="1" />

Bu kodni `area()` metodli `Rectangle` klassi sifatida qayta yozing. Natija özgarmasligi kerak.

```python
def area(rect):
    return rect["width"] * rect["height"]

room = {"width": 4, "height": 5}
print(area(room))
```

::: details Yeçim
```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

room = Rectangle(4, 5)
print(room.area())
```

```text
20
```

`rect` `self` ga, `rect["width"]` `self.width` ga, `area(room)` esa `room.area()` ga aylandi.
:::

### 3. Parallel röyxatlarni tuzatiş <Difficulty level="2" />

Dökon `names = ["Çoy", "Somsa", "Şarbat"]` va `prices = [15000, 8000, 12000]` ni saqlaydi. `name` va `price` li `Product` klassini yozing, mahsulotlar röyxatini tuzing va ularni eng arzonidan boşlab, `f"{product.name:<6} {product.price:>6,} söm"` bilan çop eting.

::: details Yeçim
```python
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

names = ["Çoy", "Somsa", "Şarbat"]
prices = [15000, 8000, 12000]
products = [Product(name, price) for name, price in zip(names, prices)]

for product in sorted(products, key=lambda p: p.price):
    print(f"{product.name:<6} {product.price:>6,} söm")
```

```text
Somsa   8,000 söm
Şarbat 12,000 söm
Çoy    15,000 söm
```
:::

### 4. Klass loyihalang: öquvçi yozuvi <Difficulty level="2" />

Quyidagi tavsif asosida klass loyihalang:

> Maktab öquvçilarni hisobga oladi. Har bir öquvçining ismi va böş boşlanadigan baholar röyxati bor. `add_grade(grade)` baho qöşadi (u 0 va 100 orasida bölişi kerak, aks holda `Baho 0-100 bölişi kerak, berilgan: 120` xabari bilan `ValueError` çaqiradi). `average()` örtaça bahoni, hali baho bölmasa esa `None` ni qaytaradi.

Klassingiz quyidagi kod bilan işlaşi kerak:

```py
bekzod = Student("Bekzod")
print(bekzod.average())
for grade in [90, 76, 83]:
    bekzod.add_grade(grade)

try:
    bekzod.add_grade(120)
except ValueError as error:
    print("Xato:", error)

print(f"{bekzod.name}: {bekzod.average():.1f}")
```

Kutilgan natija:

```text
None
Xato: Baho 0-100 bölişi kerak, berilgan: 120
Bekzod: 83.0
```

::: details Yeçim
```python
class Student:
    def __init__(self, name):
        self.name = name
        self.grades = []

    def add_grade(self, grade):
        if not 0 <= grade <= 100:
            raise ValueError(f"Baho 0-100 bölişi kerak, berilgan: {grade}")
        self.grades.append(grade)

    def average(self):
        if not self.grades:
            return None
        return sum(self.grades) / len(self.grades)

bekzod = Student("Bekzod")
print(bekzod.average())
for grade in [90, 76, 83]:
    bekzod.add_grade(grade)

try:
    bekzod.add_grade(120)
except ValueError as error:
    print("Xato:", error)

print(f"{bekzod.name}: {bekzod.average():.1f}")
```

```text
None
Xato: Baho 0-100 bölişi kerak, berilgan: 120
Bekzod: 83.0
```

Tavsifdagi otlar atributlarga, feʼllar esa metodlarga aylandi.
:::

### 5. Öyinni qayta tuziş <Difficulty level="3" />

`name`, `health` va `power` li hamda `attack(other)` (`other.health` ni `self.power` ga kamaytiradi, lekin 0 dan pastga emas) va `is_alive()` metodli `Hero` klassini yozing. Aziza (sihat 50, kuç 18) va Bekzodni (sihat 60, kuç 12) yarating. Birinçi Aziza hujum qiladi; qahramonlar biri yengilgunça `while` siklida navbatma-navbat hujum qiladi. Har bir zarbani `Aziza -> Bekzod: Bekzodda 42 HP qoldi` körinişida çop eting va `Ğolib: Aziza` bilan tugating.

::: details Yeçim
```python
class Hero:
    def __init__(self, name, health, power):
        self.name = name
        self.health = health
        self.power = power

    def attack(self, other):
        other.health = max(0, other.health - self.power)
        print(f"{self.name} -> {other.name}: {other.name}da {other.health} HP qoldi")

    def is_alive(self):
        return self.health > 0

aziza = Hero("Aziza", 50, 18)
bekzod = Hero("Bekzod", 60, 12)

attacker, defender = aziza, bekzod
while attacker.is_alive() and defender.is_alive():
    attacker.attack(defender)
    attacker, defender = defender, attacker

winner = aziza if aziza.is_alive() else bekzod
print(f"Ğolib: {winner.name}")
```

```text
Aziza -> Bekzod: Bekzodda 42 HP qoldi
Bekzod -> Aziza: Azizada 38 HP qoldi
Aziza -> Bekzod: Bekzodda 24 HP qoldi
Bekzod -> Aziza: Azizada 26 HP qoldi
Aziza -> Bekzod: Bekzodda 6 HP qoldi
Bekzod -> Aziza: Azizada 14 HP qoldi
Aziza -> Bekzod: Bekzodda 0 HP qoldi
Ğolib: Aziza
```

Metod xuddi şu klassning **boşqa** obyektini özgartira oladi: `attack(self, other)` `other.health` ni özgartiradi.
:::

## Xulosa

- Alohida özgaruvçilar va parallel röyxatlar oson buziladi, çunki boğliq maʼlumotlarni heç narsa birlaştirmaydi.
- Luğat va funksiyalar yaxşiroq, lekin funksiyalarni maʼlumotlar bilan heç narsa boğlamaydi.
- **Klass** - çizma. **Obyekt** (nusxa) - undan yasalgan, öz **atributlari** (maʼlumotlar) va umumiy **metodlari** (xatti-harakatlar) bor bitta narsa.
- Pythondagi har bir qiymat allaqaçon obyekt: `type()` uning klassini körsatadi.
- Maʼlumot va uni özgartiriş qoidalari birga bölsa, klass işlating. Oddiy kiritişdan natijaga hisob-kitoblar uçun oddiy funksiyalardan foydalaning.

## Qöşimça manbalar

- [Python Tutorial - Classes](https://docs.python.org/3/tutorial/classes.html)
- [Python Tutorial - A First Look at Classes](https://docs.python.org/3/tutorial/classes.html#a-first-look-at-classes)
- [Data model - Objects, values and types](https://docs.python.org/3/reference/datamodel.html#objects-values-and-types)
