---
title: Klass atributlari, klass metodlari va statik metodlar
description: "Klass atributlari bilan maʼlumotni barça nusxalar orasida bölişing, yaşiriş va umumiy röyxat tuzoqlaridan saqlaning, @classmethod bilan muqobil konstruktorlar yarating va @staticmethod bilan yordamçilarni guruhlang."
---

# Klass atributlari, klass metodlari va statik metodlar

![Rasm: Klass atributlari, klass metodlari va statik metodlar](/images/topics-webp-uzb/class-attributes-and-methods.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Nusxa atributlari** (har bir obyektda bittadan) va **klass atributlari** (hamma uçun umumiy) orasidagi farq
- Python atributni qanday qidiradi va undan kelib çiqadigan **yaşiriş** (shadowing) tuzoği
- `@classmethod` `from_string()` kabi **muqobil konstruktorlarni** qanday yaratadi
- `@staticmethod` yordamçi funksiyalarni klassi bilan qanday guruhlaydi va metodlarning uç turidan qaysi birini tanlaş
:::

## Nega bu muhim

Baʼzi maʼlumotlar **har bir** obyektga tegişli, masalan hisob balansi. Boşqa maʼlumotlar **butun klassga** tegişli, masalan bankning foiz stavkasi. Klasslarga köpinça obyekt yaratişning bir neçta usuli ham kerak: alohida qiymatlardan yoki matn qatoridan. Haqiqiy kutubxonalar bu vositalardan doimo foydalanadi.

## Klass atributlari

Klass tanasida, istalgan metoddan taşqarida turgan özgaruvçi - **klass atributi** (class attribute). Uni barça nusxalar öqiy oladi, **klass** nomi orqali qiymat beriş esa uni hamma uçun özgartiradi:

```python
class BankAccount:
    interest_rate = 0.14              # klass atributi: barça hisoblar uçun umumiy

    def __init__(self, owner, balance):
        self.owner = owner            # nusxa atributlari: har bir hisobda bittadan
        self.balance = balance

    def yearly_interest(self):
        return self.balance * self.interest_rate

aziza = BankAccount("Aziza", 1000000)
bekzod = BankAccount("Bekzod", 250000)
print(BankAccount.interest_rate, aziza.interest_rate)
print(aziza.yearly_interest(), bekzod.yearly_interest())

BankAccount.interest_rate = 0.16      # markaziy bank stavkani özgartirdi
print(aziza.yearly_interest(), bekzod.yearly_interest())
```

```text
0.14 0.14
140000.0 35000.0
160000.0 40000.0
```

Qiymat **bitta** joyda yaşaydi, şuning uçun hisoblar u haqida kelişmay qola olmaydi. Klass atributlari `UPPER_CASE` da nomlangan `MAX_TOPPINGS = 5` kabi konstantalar uçun ham tabiiy joy.

## Python atributni qanday topadi va yaşiriş tuzoği

![Diagramma: Python atributni qanday topadi va yaşiriş tuzoği](/images/companions-webp-uzb/attribute-lookup.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

`aziza.interest_rate` uçun Python avval obyektga, keyin uning klassiga qaraydi va ikkalasida ham bölmasagina `AttributeError` beradi. Şuning uçun klass atributini nusxa orqali öqiş normal. Nusxa orqali **qiymat beriş** esa boşqa narsa: u heç qaçon klass atributini özgartirmaydi. U xuddi şu nomdagi yangi nusxa atributini yaratadi va u şu bitta obyekt uçun klass qiymatini yaşiradi (**shadow** qiladi):

```python
class BankAccount:
    interest_rate = 0.14

    def __init__(self, owner):
        self.owner = owner

aziza = BankAccount("Aziza")
bekzod = BankAccount("Bekzod")

aziza.interest_rate = 0.20            # faqat aziza da nusxa atributini yaratadi
print(aziza.interest_rate, bekzod.interest_rate, BankAccount.interest_rate)
print(vars(aziza), vars(bekzod))
```

```text
0.2 0.14 0.14
{'owner': 'Aziza', 'interest_rate': 0.2} {'owner': 'Bekzod'}
```

Endi `aziza` `BankAccount.interest_rate` ning keyingi özgarişlarini eʼtiborsiz qoldiradi. Baʼzan bu ataylab qilinadi (VIP stavka), lekin odatda bu tasodif. **Qoida:** klass atributini klass nomi orqali yoki klass metodida `cls` orqali özgartiring.

## Klass metodlari: `@classmethod`

**Klass metodi** (class method) birinçi argument sifatida nusxani emas, `cls` deb nomlangan **klassni** oladi. Uni `@classmethod` dekoratori, yaʼni `def` ning ustidagi `@` bilan boşlanadigan qator bilan yaratasiz. Uning eng keng tarqalgan qöllanişi - obyektlarni boşqa turdagi kiritişdan yaratadigan **muqobil konstruktor**. `cls(...)` klassni xuddi `Student(...)` kabi çaqiradi va `__init__` ni işga tuşiradi:

```python
class Student:
    def __init__(self, name, grade_level, city):
        self.name = name
        self.grade_level = grade_level
        self.city = city

    @classmethod
    def from_string(cls, text):
        """'Aziza,9,Toşkent' kabi matndan öquvçi yaratadi."""
        name, grade, city = text.split(",")
        return cls(name.strip(), int(grade), city.strip())

    def describe(self):
        return f"{self.name} ({self.grade_level}-sinf, {self.city})"

print(Student("Farrux", 10, "Buxoro").describe())
print(Student.from_string("Aziza, 9, Samarqand").describe())
```

```text
Farrux (10-sinf, Buxoro)
Aziza (9-sinf, Samarqand)
```

Oddiy konstruktor sodda qoladi, `from_string()` esa bitta kiritiş formatini tahlil qiladi (`date.fromisoformat()` ham xuddi şunday işlaydi). Klass nomi örniga `cls` dan foydalaniş bola klassga ham işlaydigan `from_string()` beradi (*Vorislik va super()* darsiga qarang). Klass metodlari tekşiriladigan **klass böyiça sozlamalar** uçun ham joy: `cls.interest_rate = rate` qiymatni klassda beradi, şuning uçun yaşiriş sodir bölmaydi.

## Statik metodlar: `@staticmethod`

**Statik metod** (static method) na nusxani, na klassni oladi. Bu klassga yaqin aloqador bölgani uçun uning içida yaşaydigan oddiy funksiya:

```python
class TemperatureSensor:
    def __init__(self):
        self.readings = []

    @staticmethod
    def is_valid(celsius):
        return -60 <= celsius <= 60

    def record(self, celsius):
        if not self.is_valid(celsius):
            raise ValueError(f"Datçik xatosi: {celsius} C")
        self.readings.append(celsius)

print(TemperatureSensor.is_valid(150))     # heç qanday datçiksiz işlatiş mumkin
sensor = TemperatureSensor()
sensor.record(31.5)
print(sensor.readings)
```

```text
False
[31.5]
```

Statik metodlar faqat tartiblaş masalasi: `is_valid()` modul darajasidagi funksiya ham bölişi mumkin edi. Yordamçini uni asosan klass işlatsa, klass içiga qöying.

## Metodning töğri turini tanlaş

| Turi | Dekorator | Birinçi parametr | Odatiy qöllaniş |
|---|---|---|---|
| nusxa metodi | yöq | `self` (obyekt) | deyarli hamma narsa: `deposit()`, `describe()` |
| klass metodi | `@classmethod` | `cls` (klass) | muqobil konstruktorlar, klass böyiça sozlamalar |
| statik metod | `@staticmethod` | yöq | tekşiriş va özgartiriş yordamçilari |

Klassdan taşqarida klass va statik metodlarni klass nomi orqali çaqiring (`TemperatureSensor.is_valid(150)`). Uning metodlari içida `self.is_valid(celsius)` ham xuddi şunday normal va bola klassga yordamçini almaştiriş imkonini beradi.

## Özingiz sinab köring

`from_string()` bilan köproq öquvçi yarating, keyin `from_dict()` klass metodini qöşing va hisoblagiçni çop eting.

<ClientOnly><PythonPlayground :code='"class Student:\n    count = 0\n\n    def __init__(self, name, city):\n        self.name = name\n        self.city = city\n        Student.count += 1\n\n    @classmethod\n    def from_string(cls, text):\n        name, city = text.split(\",\")\n        return cls(name.strip(), city.strip())\n\nstudents = [Student.from_string(\"Aziza, Samarqand\"), Student.from_string(\"Bekzod, Toşkent\")]\nfor s in students:\n    print(s.name, s.city)\nprint(\"Yaratildi:\", Student.count)"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Klass hisoblagiçini `self` orqali yangilaş

```python
class Student:
    count = 0

    def __init__(self, name):
        self.name = name
        self.count += 1               # Yomon: self.count ni yaratadi, klass qiymati 0 bölib qoladi

a = Student("Aziza")
b = Student("Bekzod")
print(Student.count, a.count, b.count)
```

```text
0 1 1
```

`self.count += 1` klass qiymatini öqiydi, keyin **nusxa** atributiga yozadi. **Tuzatiş:** `Student.count += 1`.

### 2. Röyxat klass atributi sifatida

```python
class ShoppingCart:
    items = []                        # Yomon: har bir savat uçun bitta röyxat

    def add(self, item):
        self.items.append(item)       # qiymat beriş yöq, şuning uçun umumiy röyxat özgaradi

aziza_cart = ShoppingCart()
bekzod_cart = ShoppingCart()
aziza_cart.add("çoy")
bekzod_cart.add("non")
print(aziza_cart.items)
```

```text
['çoy', 'non']
```

`append()` bitta umumiy röyxatni özgartirdi. **Tuzatiş:** `__init__` da `self.items = []`.

### 3. `@classmethod` dekoratorini unutiş

```py
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    def from_string(cls, text):          # @classmethod yöq
        name, grade = text.split(",")
        return cls(name, int(grade))

s = Student.from_string("Aziza,9")
```

```text
TypeError: Student.from_string() missing 1 required positional argument: 'text'
```

Dekoratorsiz Python `"Aziza,9"` ni `cls` sifatida uzatdi va `text` uçun heç narsa topmadi. **Tuzatiş:** `def` ustiga `@classmethod` qöşing.

### 4. Statik metod içida `self` ni işlatiş

```py
class TemperatureSensor:
    def __init__(self, location):
        self.location = location

    @staticmethod
    def label(celsius):
        return f"{self.location}: {celsius} C"

sensor = TemperatureSensor("Toşkent")
print(sensor.label(30))
```

```text
NameError: name 'self' is not defined
```

Statik metod obyektni olmaydi. Agar unga nusxa maʼlumotlari kerak bölsa, uni oddiy metodga aylantiring.

## Maşqlar

### 1. Umumiy soliq stavkasi <Difficulty level="1" />

`TAX_RATE = 0.12` klass atributi, `name` va `price` nusxa atributlari hamda yuvarlangan butun son qaytaradigan `price_with_tax()` metodi bor `Product` klassini yozing. 15,000 turadigan `Daftar` uçun `Daftar 16800` ni çop eting, stavkani klass orqali `0.15` ga özgartiring va yana çop eting.

::: details Yeçim
```python
class Product:
    TAX_RATE = 0.12

    def __init__(self, name, price):
        self.name = name
        self.price = price

    def price_with_tax(self):
        return round(self.price * (1 + self.TAX_RATE))

notebook = Product("Daftar", 15000)
print(notebook.name, notebook.price_with_tax())
Product.TAX_RATE = 0.15
print(notebook.name, notebook.price_with_tax())
```

```text
Daftar 16800
Daftar 17250
```
:::

### 2. Taksi ID lari <Difficulty level="1" />

Har bir yangi taksiga `"TX-1"`, `"TX-2"`, ... kabi ID beradigan va neçta taksi borligini sanaydigan `Taxi` klassini yozing. Farrux, Aziza va Bekzod uçun taksilar yarating, har bir ID va haydovçini (`TX-1 Farrux`), oxirida esa `Taksilar: 3` ni çop eting.

::: details Yeçim
```python
class Taxi:
    total = 0

    def __init__(self, driver):
        Taxi.total += 1
        self.taxi_id = f"TX-{Taxi.total}"
        self.driver = driver

fleet = [Taxi("Farrux"), Taxi("Aziza"), Taxi("Bekzod")]
for taxi in fleet:
    print(taxi.taxi_id, taxi.driver)
print("Taksilar:", Taxi.total)
```

```text
TX-1 Farrux
TX-2 Aziza
TX-3 Bekzod
Taksilar: 3
```
:::

### 3. Satrdan vaqt <Difficulty level="2" />

Statik `is_valid(hours, minutes)`, `ValueError(f"Notöğri vaqt: {hours}:{minutes}")` çaqiradigan `__init__`, `from_string("14:30")` klass metodi va `minutes_until(other)` li `ClockTime` klassini (`hours`, `minutes`) yozing. `"07:28"` dan `"09:38"` gaça poyezd uçun `Yöl 2 soat 10 daqiqa davom etadi` ni çop eting. Keyin `ClockTime.from_string("25:10")` ni sinab köring va `Xato:` ni xabar bilan çop eting.

::: details Yeçim
```python
class ClockTime:
    def __init__(self, hours, minutes):
        if not self.is_valid(hours, minutes):
            raise ValueError(f"Notöğri vaqt: {hours}:{minutes}")
        self.hours = hours
        self.minutes = minutes

    @staticmethod
    def is_valid(hours, minutes):
        return 0 <= hours < 24 and 0 <= minutes < 60

    @classmethod
    def from_string(cls, text):
        hours, minutes = text.split(":")
        return cls(int(hours), int(minutes))

    def minutes_until(self, other):
        return (other.hours - self.hours) * 60 + other.minutes - self.minutes

departure = ClockTime.from_string("07:28")
arrival = ClockTime.from_string("09:38")
trip = departure.minutes_until(arrival)
print(f"Yöl {trip // 60} soat {trip % 60} daqiqa davom etadi")

try:
    ClockTime.from_string("25:10")
except ValueError as error:
    print("Xato:", error)
```

```text
Yöl 2 soat 10 daqiqa davom etadi
Xato: Notöğri vaqt: 25:10
```
:::

### 4. Klass loyihalang: xodimlar <Difficulty level="2" />

Har bir qism qaysi turdagi atribut yoki metod bölişini hal qilib, `Employee` klassini loyihalang:

> Xodimlarning ismi, lavozimi va oylik maoşi bor. Hamma bir xil yillik oşiriş foizini oladi (hozir 8%), uni faqat 0-30 oraliğida özgartiriş mumkin. Xodimlar CSV qatorlaridan yaratiladi, `apply_raise()` esa bitta maoşni oşiradi.

U quyidagi kod bilan işlab, aynan şu natijani çop etişi kerak:

```py
dilnoza = Employee.from_csv_line("Dilnoza Rahimova,Dizayner,9500000")
Employee.set_raise_percent(10)
dilnoza.apply_raise()
print(dilnoza.name, dilnoza.position, dilnoza.salary)
try:
    Employee.set_raise_percent(50)
except ValueError as error:
    print("Xato:", error)
```

```text
Dilnoza Rahimova Dizayner 10450000
Xato: Oşiriş 0 va 30 foiz orasida bölişi kerak
```

::: details Yeçim
```python
class Employee:
    raise_percent = 8

    def __init__(self, name, position, salary):
        self.name = name
        self.position = position
        self.salary = salary

    @staticmethod
    def is_valid_percent(percent):
        return 0 <= percent <= 30

    @classmethod
    def set_raise_percent(cls, percent):
        if not cls.is_valid_percent(percent):
            raise ValueError("Oşiriş 0 va 30 foiz orasida bölişi kerak")
        cls.raise_percent = percent

    @classmethod
    def from_csv_line(cls, line):
        name, position, salary = line.split(",")
        return cls(name, position, int(salary))

    def apply_raise(self):
        self.salary = round(self.salary * (100 + self.raise_percent) / 100)

dilnoza = Employee.from_csv_line("Dilnoza Rahimova,Dizayner,9500000")
Employee.set_raise_percent(10)
dilnoza.apply_raise()
print(dilnoza.name, dilnoza.position, dilnoza.salary)
try:
    Employee.set_raise_percent(50)
except ValueError as error:
    print("Xato:", error)
```
:::

### 5. Valyuta ayirboşlaş punkti <Difficulty level="3" />

`RATES = {"söm": 1, "usd": 12600, "eur": 13700}` (sömga nisbatan kurslar) klass atributli, `ValueError(f"Nomaʼlum valyuta: {currency}")` çaqiradigan `__init__`, `from_string("250 usd")` klass metodi, 2 xonagaça yuvarlangan **yangi** `Money` qaytaradigan `to(currency)` va `250.00 USD` qaytaradigan `describe()` li `Money` klassini (`amount`, `currency`) yozing. `250.00 USD = 229.93 EUR` ni çop eting, keyin `"10 gbp"` ni sinab köring va `Xato:` ni xabar bilan çop eting.

::: details Yeçim
```python
class Money:
    RATES = {"söm": 1, "usd": 12600, "eur": 13700}

    def __init__(self, amount, currency):
        currency = currency.lower()
        if currency not in self.RATES:
            raise ValueError(f"Nomaʼlum valyuta: {currency}")
        self.amount = amount
        self.currency = currency

    @classmethod
    def from_string(cls, text):
        amount, currency = text.split()
        return cls(float(amount), currency)

    def to(self, currency):
        in_som = self.amount * self.RATES[self.currency]
        return type(self)(round(in_som / self.RATES[currency.lower()], 2), currency)

    def describe(self):
        return f"{self.amount:,.2f} {self.currency.upper()}"

cash = Money.from_string("250 usd")
print(cash.describe(), "=", cash.to("eur").describe())

try:
    Money.from_string("10 gbp")
except ValueError as error:
    print("Xato:", error)
```

```text
250.00 USD = 229.93 EUR
Xato: Nomaʼlum valyuta: gbp
```

Nusxa metodida `cls` yöq, şuning uçun `to()` `Money` ni qatʼiy yozib qöyiş örniga obyektning öz klassi bölgan `type(self)` dan foydalanadi.
:::

## Xulosa

- **Klass atributlari** klass tanasida yaşaydi va barça nusxalar uçun umumiy; **nusxa atributlari** bitta obyektga tegişli.
- Python atributni avval obyektda, keyin klassda qidiradi. Nusxa orqali qiymat beriş klass atributini **yaşiradi**, şuning uçun uni klass nomi yoki `cls` orqali özgartiring.
- Özgaruvçan klass atributi hamma uçun umumiy. Har bir obyektning röyxatlarini `__init__` da yarating.
- Köp metodlar oddiy nusxa metodlari; qolgan ikkitasini faqat kerak bölganda işlating.
- `@classmethod` metodlari `cls` ni oladi: ularni **muqobil konstruktorlar** va klass böyiça sozlamalar uçun işlating. `@staticmethod` metodlari avtomatik ravişda heç narsa olmaydi.

## Qöşimça manbalar

- [Python Tutorial - Class and Instance Variables](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables)
- [Built-in functions - classmethod()](https://docs.python.org/3/library/functions.html#classmethod)
- [Built-in functions - staticmethod()](https://docs.python.org/3/library/functions.html#staticmethod)
