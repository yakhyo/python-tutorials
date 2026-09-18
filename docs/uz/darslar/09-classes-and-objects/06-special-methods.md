---
title: Obyektlarni ifodalaş va taqqoslaş
description: "__str__ va __repr__ bilan obyektlaringizni öqişli çop eting, __eq__ va __hash__ bilan ularni qiymat böyiça taqqoslang hamda __lt__ va functools.total_ordering bilan saralang."
---

# Obyektlarni ifodalaş va taqqoslaş

![Rasm: Obyektlarni ifodalaş va taqqoslaş](/images/topics-webp-uzb/special-methods.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- **Maxsus metodlar** ("dunder metodlar") nima va Python ularni siz uçun qanday çaqiradi
- `__str__` va `__repr__` `print()`, f-satrlar va röyxatlar nimani körsatişini qanday boşqaradi
- `__eq__` tenglikni qanday aniqlaydi va nega töplam hamda luğatlar uçun unga mos `__hash__` kerak
- `__lt__` va `functools.total_ordering` obyektlarni qanday saralanadigan qiladi va qaçon key funksiya yaxşiroq
:::

## Nega bu muhim

Klasslaringiz hali örnatilgan turlar kabi özini tutmaydi: `print(book)` `<__main__.Book object at 0x...>` ni körsatadi, bir xil kitoblar esa `==` emas. **Maxsus metodlar** (special methods) obyektlaringizni Python sintaksisiga ulaydi, şunda kitoblar röyxati öqişli çop etiladi, töplamda takrorlar yöqoladi, `sorted()` esa tartibni biladi.

## Python maxsus metodlardan qanday foydalanadi

Maxsus metodlar yoki **dunder metodlar** ("double underscore") `__init__` kabi ikkala tomonida ikkitadan pastki çiziqqa ega. Python ularni maʼlum sintaksis uçun çaqiradi. `len(word)` `word.__len__()` ni, `a == b` esa `a.__eq__(b)` ni çaqiradi. Klassingizda birini aniqlasangiz, öşa sintaksis obyektlaringiz bilan işlaydi. **Qoida:** maxsus metodni aniqlang, lekin boşqa hamma joyda oddiy sintaksisni işlating: `playlist.__len__()` emas, `len(playlist)`.

## `__str__` va `__repr__`: odamlar va dasturçilar uçun matn

Pythonda obyektni matnga aylantirişning ikki usuli bor:

| Metod | Kim çaqiradi | Maqsad |
|---|---|---|
| `__str__` | `print(obj)`, `str(obj)`, `f"{obj}"` | foydalanuvçilar uçun öqişli matn |
| `__repr__` | `repr(obj)`, `f"{obj!r}"`, konsol, **konteynerlardagi elementlar** | dasturçilar uçun bir maʼnoli matn |

```python
class Book:
    def __init__(self, title, author, year):
        self.title = title
        self.author = author
        self.year = year

    def __str__(self):
        return f"{self.title}, muallif: {self.author} ({self.year})"

    def __repr__(self):
        return f"Book({self.title!r}, {self.author!r}, {self.year!r})"

book = Book("Ipak yöli hikoyalari", "Dilnoza Karimova", 2024)
print(book)                       # __str__ ni işlatadi
print([book])                     # röyxatlar __repr__ ni işlatadi (f"{book!r}" ham)
```

```text
Ipak yöli hikoyalari, muallif: Dilnoza Karimova (2024)
[Book('Ipak yöli hikoyalari', 'Dilnoza Karimova', 2024)]
```

`__repr__` matni - kitobni qayta yaratadigan kod (`!r` qöştirnoqlarni qöşadi). **Faqat bittasini yozsangiz, `__repr__` ni yozing:** `__str__` bölmasa, `print()` ham `__repr__` dan foydalanadi.

## `__eq__`: "teng" nimani anglatadi

Standart holatda obyektlaringizdagi `==` *Klasslar va obyektlar* darsida körganingizdek aynanlikni tekşiradi. `__eq__` tenglikni qiymat böyiça aniqlaş imkonini beradi:

```python
class Book:
    def __init__(self, isbn, title):
        self.isbn = isbn
        self.title = title

    def __eq__(self, other):
        if not isinstance(other, Book):
            return NotImplemented
        return self.isbn == other.isbn     # bir xil ISBN = bir xil kitob

a = Book("978-1", "Python asoslari")
b = Book("978-1", "Python asoslari (yumşoq muqova)")
c = Book("978-2", "Ipak yöli hikoyalari")

print(a == b, a == c, a != c)
print(a == "978-1")
```

```text
True False True
False
```

`!=` avtomatik işlaydi. Aloqasi yöq tur uçun maxsus **`NotImplemented`** qiymatini qaytaring (`False` emas va xato çaqirmang): şunda Python ikkinçi obyektning metodini sinab köradi, oxirida esa aynanlikka (`False`) qaytadi.

## `__hash__`: töplam va luğatlardagi teng obyektlar

Töplamlar va luğat kalitlariga **xeş** - obyektdan hisoblangan son kerak, teng obyektlarning xeşi esa teng bölişi şart. Şuning uçun `__eq__` ni aniqlaş standart xeşni olib taşlaydi va bunday `Book` ni töplamga qöyiş `TypeError: cannot use 'Book' as a set element (unhashable type: 'Book')` beradi. `__eq__` soliştiradigan **xuddi şu atributlarni** xeşlaydigan `__hash__` qöşing:

```python
class Book:
    def __init__(self, isbn, title):
        self.isbn = isbn
        self.title = title

    def __eq__(self, other):
        if not isinstance(other, Book):
            return NotImplemented
        return self.isbn == other.isbn

    def __hash__(self):
        return hash(self.isbn)

donations = [Book("978-1", "Python asoslari"), Book("978-2", "Ipak yöli hikoyalari"),
             Book("978-1", "Python asoslari")]
unique = set(donations)
print(len(unique), Book("978-2", "?") in unique)
```

```text
2 True
```

::: warning Faqat heç qaçon özgarmaydigan narsani xeşlang
Obyekt töplam yoki luğatda turganda uning xeşi özgarsa, Python uni boşqa topa olmaydi. Faqat ISBN kabi özgarmas atributlarni xeşlang.
:::

## Tartiblaş: `__lt__` va `total_ordering`

`<` `__lt__` ("less than", kiçik) ni çaqiradi va u bilan `sorted()`, `min()` va `max()` obyektlaringizda işlaydi. Oltita taqqoslaş metodining hammasini yoziş zerikarli, şuning uçun `functools.total_ordering` dekoratori siz `__eq__` va `__lt__` ni bersangiz, `<=`, `>` va `>=` ni özi töldiradi:

```python
from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        self.parts = tuple(int(p) for p in text.split("."))

    def __repr__(self):
        return f"Version({'.'.join(map(str, self.parts))!r})"

    def __eq__(self, other):
        if not isinstance(other, Version):
            return NotImplemented
        return self.parts == other.parts

    def __lt__(self, other):
        if not isinstance(other, Version):
            return NotImplemented
        return self.parts < other.parts      # kortejlar element-baelement taqqoslanadi

v1, v2 = Version("3.9.2"), Version("3.10.0")
print(v1 < v2, v2 >= v1, max(v1, v2))
print(sorted([Version("1.2"), Version("1.10"), Version("1.9")]))
```

```text
True True Version('3.10.0')
[Version('1.2'), Version('1.9'), Version('1.10')]
```

Satr sifatida `"3.10.0" < "3.9.2"` `True` bölgan bölardi; sonlar kortejlari esa töğri taqqoslanadi. `__lt__` `__eq__` bilan kelişişi kerak (Köp uçraydigan xatolarga qarang).

::: tip `__lt__` mi yoki key funksiya?
`__lt__` ni faqat versiyalar yoki sanalar kabi **bitta aniq tabiiy tartib** uçun aniqlang. Boşqa tartiblar uçun key funksiyani işlating: `sorted(group, key=lambda s: s.name)`.
:::

`__init__`, `__repr__` va `__eq__` ni qöl bilan yoziş takroriy iş; *Dataclasslar* darsida ularni siz uçun yaratadigan `@dataclass` ni körasiz.

## Özingiz sinab köring

`Money` ga `__str__` va `__hash__` qöşing va ularni sinab köring.

<ClientOnly><PythonPlayground :code='"class Money:\n    def __init__(self, amount, currency=\"söm\"):\n        self.amount = amount\n        self.currency = currency\n\n    def __repr__(self):\n        return f\"Money({self.amount!r}, {self.currency!r})\"\n\n    def __eq__(self, other):\n        if not isinstance(other, Money):\n            return NotImplemented\n        return (self.amount, self.currency) == (other.amount, other.currency)\n\nprint(Money(57000) == Money(57000))\nprint([Money(1000), Money(2000, \"usd\")])"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Satr qaytarmaydigan `__str__`

```py
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def __str__(self):
        print(f"{self.name}: {self.price} söm")    # qaytariş örniga çop etadi

print(Product("Çoy", 15000))
```

```text
Çoy: 15000 söm
TypeError: __str__ returned non-string (type NoneType)
```

Matn birinçi paydo böladi, şuning uçun `__str__` işlagandek körinadi, lekin u `None` qaytardi va taşqi `print()` xato berdi. **Tuzatiş:** matnni `return` qiling.

### 2. `__eq__` ga zid `__lt__`

```python
from functools import total_ordering

@total_ordering
class Result:
    def __init__(self, subject, score):
        self.subject = subject
        self.score = score

    def __eq__(self, other):
        return (self.subject, self.score) == (other.subject, other.score)

    def __lt__(self, other):
        return self.score < other.score          # Yomon: fanni eʼtiborsiz qoldiradi

a = Result("Matematika", 88)
b = Result("Fizika", 88)
print(a == b, a < b, b < a)
print(a > b, b > a)
```

```text
False False False
True True
```

`a` va `b` na teng, na tartiblangan, şuning uçun yaratilgan `>` **ikkalasini** ham aytadi: `a > b` va `b > a`. **Tuzatiş:** ikkalasida bir xil atributlarni, masalan `(self.score, self.subject)` ni soliştiring yoki ball böyiça key funksiya bilan saralang.

## Maşqlar

### 1. Öqişli kitoblar <Difficulty level="1" />

`LibraryBook(title, author, shelf)` klassiga `Python asoslari (Farrux Aliyev), B3 javon` qaytaradigan `__str__` va `LibraryBook('Python asoslari', 'Farrux Aliyev', 'B3')` qaytaradigan `__repr__` bering. Öşa kitobni, uning `repr()` ini hamda u va `LibraryBook("Navoiy şeʼrlari", "Alişer Navoiy", "A1")` dan iborat röyxatni çop eting.

::: details Yeçim
```python
class LibraryBook:
    def __init__(self, title, author, shelf):
        self.title = title
        self.author = author
        self.shelf = shelf

    def __str__(self):
        return f"{self.title} ({self.author}), {self.shelf} javon"

    def __repr__(self):
        return f"LibraryBook({self.title!r}, {self.author!r}, {self.shelf!r})"

book = LibraryBook("Python asoslari", "Farrux Aliyev", "B3")
print(book)
print(repr(book))
print([book, LibraryBook("Navoiy şeʼrlari", "Alişer Navoiy", "A1")])
```

```text
Python asoslari (Farrux Aliyev), B3 javon
LibraryBook('Python asoslari', 'Farrux Aliyev', 'B3')
[LibraryBook('Python asoslari', 'Farrux Aliyev', 'B3'), LibraryBook('Navoiy şeʼrlari', 'Alişer Navoiy', 'A1')]
```
:::

### 2. Xaritadagi takrorlanmas nuqtalar <Difficulty level="1" />

Koordinatalari teng joylar teng va xeşlanadigan bölgan `Place(name, lat, lon)` klassini yozing. `Place("Registon", 39.6547, 66.9758)`, `Place("Registon maydoni", 39.6547, 66.9758)` va `Place("Buxoro arki", 39.7778, 64.4103)` ni töplamga qöying; uning uzunligini, keyin ikkala Registon joyi `==` ekanini çop eting.

::: details Yeçim
```python
class Place:
    def __init__(self, name, lat, lon):
        self.name = name
        self.lat = lat
        self.lon = lon

    def __eq__(self, other):
        if not isinstance(other, Place):
            return NotImplemented
        return (self.lat, self.lon) == (other.lat, other.lon)

    def __hash__(self):
        return hash((self.lat, self.lon))

visited = {
    Place("Registon", 39.6547, 66.9758),
    Place("Registon maydoni", 39.6547, 66.9758),
    Place("Buxoro arki", 39.7778, 64.4103),
}
print(len(visited))
print(Place("Registon", 39.6547, 66.9758) == Place("Registon maydoni", 39.6547, 66.9758))
```

```text
2
True
```

`__hash__` `__eq__` soliştiradigan aynan şu atributlarni kortejga joylab işlatadi.
:::

### 3. Taqqoslanadigan davomiyliklar <Difficulty level="2" />

`__repr__` (`Duration(250)`), `__eq__` va `__lt__` li, `@total_ordering` bilan bezatilgan `Duration(minutes)` klassini yozing. `Duration(130)`, `Duration(95)` va `Duration(250)` sayohatlari uçun saralangan röyxatni va eng uzun sayohatni çop eting. Keyin `Duration(95) >= Duration(90)` va `Duration(60) != Duration(60)` ni bitta qatorda çop eting.

::: details Yeçim
```python
from functools import total_ordering

@total_ordering
class Duration:
    def __init__(self, minutes):
        self.minutes = minutes

    def __repr__(self):
        return f"Duration({self.minutes})"

    def __eq__(self, other):
        if not isinstance(other, Duration):
            return NotImplemented
        return self.minutes == other.minutes

    def __lt__(self, other):
        if not isinstance(other, Duration):
            return NotImplemented
        return self.minutes < other.minutes

trips = [Duration(130), Duration(95), Duration(250)]
print(sorted(trips))
print(max(trips))
print(Duration(95) >= Duration(90), Duration(60) != Duration(60))
```

```text
[Duration(95), Duration(130), Duration(250)]
Duration(250)
True False
```
:::

### 4. Klass loyihalang: takrorsiz röyxatdan ötiş <Difficulty level="2" />

Baʼzi öquvçilar törgaragiga ikki marta yoziladi. ID si bir xil öquvçilar teng böladigan, töplamga qöyiş mumkin bölgan va `Student(4, 'Bekzod', 10)` kabi çop etiladigan `Student(student_id, name, grade)` klassini loyihalang. Unga tabiiy tartib kerak emas. U quyidagi kod bilan işlaşi kerak:

```py
signups = [Student(17, "Dilnoza", 9), Student(4, "Bekzod", 10), Student(17, "Dilnoza", 9)]
unique = set(signups)
print(len(unique))
print(sorted(unique, key=lambda s: s.name))
print(Student(4, "Bekzod", 11) in unique, Student(4, "Bekzod", 10) == "Bekzod")
```

```text
2
[Student(4, 'Bekzod', 10), Student(17, 'Dilnoza', 9)]
True False
```

::: details Yeçim
```python
class Student:
    def __init__(self, student_id, name, grade):
        self.student_id = student_id
        self.name = name
        self.grade = grade

    def __repr__(self):
        return f"Student({self.student_id!r}, {self.name!r}, {self.grade!r})"

    def __eq__(self, other):
        if not isinstance(other, Student):
            return NotImplemented
        return self.student_id == other.student_id

    def __hash__(self):
        return hash(self.student_id)

signups = [Student(17, "Dilnoza", 9), Student(4, "Bekzod", 10), Student(17, "Dilnoza", 9)]
unique = set(signups)
print(len(unique))
print(sorted(unique, key=lambda s: s.name))
print(Student(4, "Bekzod", 11) in unique, Student(4, "Bekzod", 10) == "Bekzod")
```
:::

### 5. Ikki öqituvçidan imtihon natijalari <Difficulty level="3" />

`__eq__`, `__hash__` va `@total_ordering` li `__lt__` ning hammasi `(score, student, subject)` kortejidan foydalanadigan `Result(student, subject, score)` klassini yozing.

A öqituvçida matematika natijalari: Aziza 88, Bekzod 95, Dilnoza 88; B öqituvçida: Bekzod 95, Farrux 72. Ikkala röyxatni bitta töplamga qöying va uning uzunligini, keyin töplamning `max()` va `min()` ining `student` ini bitta qatorda çop eting. Nihoyat, key funksiya yordamida reytingni (eng yuqori ball birinçi, teng ballarda ismlar A dan Z gaça) `1. Bekzod   95` körinişida (ism 8 belgigaça töldirilgan) çop eting.

::: details Yeçim
```python
from functools import total_ordering

@total_ordering
class Result:
    def __init__(self, student, subject, score):
        self.student = student
        self.subject = subject
        self.score = score

    def _key(self):
        return (self.score, self.student, self.subject)

    def __eq__(self, other):
        if not isinstance(other, Result):
            return NotImplemented
        return self._key() == other._key()

    def __hash__(self):
        return hash(self._key())

    def __lt__(self, other):
        if not isinstance(other, Result):
            return NotImplemented
        return self._key() < other._key()

teacher_a = [Result("Aziza", "Matematika", 88), Result("Bekzod", "Matematika", 95), Result("Dilnoza", "Matematika", 88)]
teacher_b = [Result("Bekzod", "Matematika", 95), Result("Farrux", "Matematika", 72)]

combined = set(teacher_a + teacher_b)       # takror yöqoladi
print(len(combined))
print(max(combined).student, min(combined).student)
ranking = sorted(combined, key=lambda r: (-r.score, r.student))
for place, r in enumerate(ranking, start=1):
    print(f"{place}. {r.student:<8} {r.score}")
```

```text
4
Bekzod Farrux
1. Bekzod   95
2. Aziza    88
3. Dilnoza  88
4. Farrux   72
```

Bitta `_key()` uçala metodni ham taʼminlaydi, şuning uçun ular doim kelişadi. Reytingga boşqa tartib kerak, şuning uçun u key funksiyadan foydalanadi.
:::

## Xulosa

- Maxsus (dunder) metodlar obyektlaringizni Python sintaksisiga ulaydi: `a == b` `a.__eq__(b)` ni çaqiradi. Ularni aniqlang, lekin oddiy sintaksisni işlating.
- `__repr__` dasturçilar uçun kodga öxşaş matn beradi (`!r` va konteynerlar işlatadi); `__str__` `print()` uçun döstona matn beradi. Kamida `__repr__` ni yozing.
- `__eq__` tenglikni aniqlaydi (boşqa turlar uçun `NotImplemented` qaytaring). U xeşlaşni olib taşlaydi, şuning uçun xuddi şu özgarmas atributlar ustida `__hash__` qöşing.
- `@total_ordering` bilan `__lt__` va `__eq__`, agar ikkalasi bir xil atributlarni soliştirsa, barça taqqoslaşlarni beradi. Boşqa saralaş tartiblari uçun key funksiyani işlating.

## Qöşimça manbalar

- [Data model - Basic customization (`__repr__`, `__str__`, comparisons, `__hash__`)](https://docs.python.org/3/reference/datamodel.html#basic-customization)
- [functools.total_ordering](https://docs.python.org/3/library/functools.html#functools.total_ordering)
- [Built-in constants - NotImplemented](https://docs.python.org/3/library/constants.html#NotImplemented)
- [Sorting Techniques - key functions](https://docs.python.org/3/howto/sorting.html#key-functions)
