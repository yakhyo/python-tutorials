---
title: "Loyiha: Kutubxona boşqaruv tizimi"
description: "Dataclass, enum, type hintlar, abstrakt bazaviy klass, maxsus istisnolar, kompozitsiya, vorislik, qaytariş muddatlari va jarimalar, JSON ga saqlaş hamda matnli hisobot yordamida töliq kutubxona tizimini qadamma-qadam quring."
---

# Loyiha: Kutubxona boşqaruv tizimi

![Rasm: Loyiha: Kutubxona boşqaruv tizimi](/images/topics-webp-uzb/oop-project.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Imkoniyatlar röyxatini aniq vazifali klasslar töplamiga qanday aylantiriş
- Dataclass, enum, type hintlar va maxsus metodlar bitta dasturda **birgalikda** qanday işlaşi
- Vorislik (aʼzo turlari), abstrakt klass (xabarnoma yuboruvçilar) va kompozitsiyani (kutubxona) qanday birlaştiriş
- `datetime.date` va `timedelta` bilan qaytariş muddatlari va jarimalarni qanday hisoblaş
- Butun obyektlar tizimini JSON ga saqlab, qayta yuklaş
:::

## Nega bu muhim

Bu moduldagi har bir dars bitta vositani örgatdi. Haqiqiy dasturlarga esa ularning hammasi birdaniga kerak böladi va endi qiyin qism sintaksis emas, **dizayn**: qaysi klass qaysi maʼlumotga egalik qiladi, qaysi obyekt nimani özgartira oladi va har bir qoida qayerda turadi. Kiçik kutubxona tizimi buning uçun ajoyib maşq maydoni. U tanış, unda haqiqiy qoidalar bor (limitlar, qaytariş muddatlari, jarimalar) va u maʼlumotlarini işga tuşirişlar orasida eslab qolişi kerak.

Oxirida sizda taxminan 350 qatorlik işlaydigan dastur va unga olib boradigan fikrlaş jarayoni böladi.

## Maqsad va imkoniyatlar

Samarqand şahar kutubxonasi qoğoz daftarini almaştiradigan oddiy dastur istaydi. Dastur quyidagilarni qila olişi kerak:

1. **Kitoblar**ni ISBN, nomi, muallifi va yili bilan saqlaş hamda har bir kitob holatini körsatiş: mavjud, berilgan yoki yöqolgan.
2. **Aʼzolar**ni saqlaş. Oddiy aʼzolar 21 kunga 5 tagaça kitob olişi mumkin. **Talabalar** esa 14 kunga faqat 2 ta kitob oladi va dastur ularning maktabini yozib qöyadi.
3. Aʼzoga kitob **beriş**; kitob mavjud bölmasa, aʼzo limitga yetgan bölsa yoki kitob yoki aʼzo mavjud bölmasa, rad etiş.
4. Aʼzodan kitobni **qaytarib oliş** va har bir keçikkan kun uçun 2,000 söm **jarima** hisoblaş.
5. Kitobni javonda turganida ham, berilganida ham **yöqolgan** deb belgilaş. Berilgan kitob yöqolsa, ijara yopiladi va keçikiş jarimasi ustiga 50,000 söm almaştiriş tölovi olinadi.
6. Muddati **ötgan** ijaralarni röyxatlaş, kitoblarni **qidiriş**, **matnli hisobot** çiqariş va muddati ötgan kitoblar uçun **eslatma** yuboriş.
7. Hamma narsani JSON faylga **saqlaş** va qayta **yuklaş**.

## Dizayn

Imkoniyatlar röyxatidagi otlarning tagiga çiziş: kitob, holat, aʼzo, talaba, ijara, jarima, eslatma, kutubxona, hisobot. Öz maʼlumotiga ega otlar klassga aylanadi. Belgilangan tanlovlar töplami bölgan otlar enum böladi. Harakatlar (beriş, qaytariş, qidiriş) esa özlari özgartiradigan maʼlumotga egalik qiluvçi klassning metodlariga aylanadi.

| Tuşunça | Turi | Nega |
|---|---|---|
| `BookStatus` | `Enum` | uçta holatdan iborat belgilangan töplam, "sehrli satrlar" yöq |
| `Book` | `@dataclass` | asosan maʼlumot, tenglik va öqiş oson `repr` kerak |
| `Member` | oddiy klass | klass darajasidagi qoidalari bor (`max_books`, `loan_days`) |
| `StudentMember` | `Member` ning voris klassi | talaba boşqa limitlarga ega aʼzo **hisoblanadi** |
| `Loan` | `@dataclass` | kitob, aʼzo va sanalarni boğlaydigan yozuv |
| `Notifier` | abstrakt bazaviy klass | eslatma yuborişning har bir usulida `notify()` bölişi şart |
| `Library` | oddiy klass | kitoblar, aʼzolar, ijaralar va xabarnoma yuboruvçiga **ega** va ularni muvofiqlaştiradi |
| `LibraryError` va uning voris klasslari | istisnolar | çaqiruvçi bitta turni yoki har bir aniq holatni uşlay oladi |

Mana klass diagrammasi. `<>` bilan boşlanadigan strelka "ega / tarkibida bor" degani, `inherits` esa voris klassdan ota klassga qarab yönaltirilgan:

```text
+-------------------+           +------------------+
|   Library         |<>-------->|   Book           |
|-------------------|  books    |------------------|
| name, notifier    |           | isbn, title      |
| books: {isbn: B}  |           | author, year     |
| members: {id: M}  |           | lost             |
| loans: [Loan]     |           +------------------+
|-------------------|
| borrow()          |           +------------------+
| return_book()     |<>-------->|   Member         |
| mark_lost()       |  members  | max_books = 5    |
| status_of()       |           | loan_days = 21   |
| overdue_loans()   |           +------------------+
| search()          |                    ^ inherits
| report()          |           +------------------+
| send_reminders()  |           |  StudentMember   |
| save() / load()   |           |  max_books = 2   |
+-------------------+           +------------------+
    <>          <>
    | loans     | notifier      +------------------+
    v           +-------------->| Notifier (ABC)   |
+-------------------+           |  notify()        |
|   Loan            |           +------------------+
| isbn, member_id   |                    ^ inherits
| borrowed_on       |           +------------------+
| due_on            |           | ConsoleNotifier  |
| returned_on       |           +------------------+
+-------------------+
```

Uçta dizayn qarorini hozirdanoq taʼkidlab öting:

- **Har bir faktni bir marta saqlang.** "Bu kitob berilganmi?" degan savolga ijaralar röyxati allaqaçon javob beradi, şuning uçun `Book` holatni saqlamaydi. U faqat heç bir ijara ayta olmaydigan `lost` ni saqlaydi, `Library.status_of(isbn)` esa holatni ikkalasidan **hisoblaydi**.
- `Loan` `Book` va `Member` obyektlarini emas, **ISBN va aʼzo ID** sini saqlaydi. ID larni JSON ga saqlaş oson, haqiqiy obyektlarni esa faqat kutubxona luğatlari saqlaydi.
- Ijaralarni faqat `Library` yaratadi va yopadi hamda kitoblarni yöqolgan deb belgilaydi. Qoidalarni bitta obyekt nazorat qilsa, ularni topiş va tekşiriş oson.

## 1-qadam: holatlar va xatolar

Qolgan hamma narsa foydalanadigan eng kiçik qismlardan boşlang:

```python
from enum import Enum


class BookStatus(Enum):
    AVAILABLE = "mavjud"
    BORROWED = "berilgan"
    LOST = "yöqolgan"


class LibraryError(Exception):
    """Barça kutubxona muammolari uçun bazaviy klass."""


class NotFoundError(LibraryError):
    pass


class BookNotAvailableError(LibraryError):
    pass


class LimitReachedError(LibraryError):
    pass


print([s.value for s in BookStatus])
print(issubclass(LimitReachedError, LibraryError))

try:
    raise BookNotAvailableError("«Ötgan kunlar» berilgan")
except LibraryError as error:
    print(type(error).__name__, "-", error)
```

```text
['mavjud', 'berilgan', 'yöqolgan']
True
BookNotAvailableError - «Ötgan kunlar» berilgan
```

**Istisnolar ierarxiyasi** vorislikning kiçik, lekin kuçli qöllanilişi. Menyu sikli istalgan muammoni körsatiş uçun `LibraryError` ni uşlay oladi, dasturning boşqa qismi esa avval kitob qaytarişni taklif qiliş uçun faqat `LimitReachedError` ni uşlaydi.

## 2-qadam: `Book` dataclassi

Kitob asosan maʼlumot, şuning uçun dataclass mos keladi. Unga tekşiruv, qulay `__str__` hamda JSON uçun luğatga va luğatdan özgartiriş qöşiladi. Har bir metodda type hintlar bor, `from_dict` esa `Self` qaytaradi:

```python
from dataclasses import dataclass, asdict
from typing import Self


@dataclass
class Book:
    isbn: str
    title: str
    author: str
    year: int
    lost: bool = False

    def __post_init__(self) -> None:
        if not self.title.strip():
            raise ValueError("Kitobning nomi bölişi kerak")

    def __str__(self) -> str:
        return f"{self.title}, muallif: {self.author} ({self.year})"

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> Self:
        return cls(**data)


book = Book("978-01", "Ötgan kunlar", "Abdulla Qodiriy", 1926)
print(book)
data = book.to_dict()
print(data)
print(Book.from_dict(data) == book)
```

```text
Ötgan kunlar, muallif: Abdulla Qodiriy (1926)
{'isbn': '978-01', 'title': 'Ötgan kunlar', 'author': 'Abdulla Qodiriy', 'year': 1926, 'lost': False}
True
```

`from_dict` `@classmethod` bölgani uçun yangi `Book` yarata oladi (*Klass atributlari, klass metodlari va statik metodlar* darsiga qarang). Öz maydonlarini biladigan har bir klass özini özi özgartiradi, bu esa keyinroq saqlaşni soddalaştiradi.

## 3-qadam: aʼzolar va talaba aʼzolar

Oddiy aʼzolar va talabalarda deyarli hamma narsa umumiy. Faqat limitlar farq qiladi, talabalarda esa maktab ham bor. Bu haqiqiy "hisoblanadi" (is-a) munosabati, şuning uçun vorislik mos keladi. Limitlar **klass atributlari**, yaʼni bir turdagi barça aʼzolar uçun bir xil:

```python
class Member:
    kind = "regular"
    max_books = 5
    loan_days = 21

    def __init__(self, member_id: str, name: str) -> None:
        self.member_id = member_id
        self.name = name

    def __repr__(self) -> str:
        return f"{type(self).__name__}({self.member_id!r}, {self.name!r})"

    def to_dict(self) -> dict[str, str]:
        return {"member_id": self.member_id, "name": self.name, "kind": self.kind}


class StudentMember(Member):
    kind = "student"
    max_books = 2
    loan_days = 14

    def __init__(self, member_id: str, name: str, school: str) -> None:
        super().__init__(member_id, name)
        self.school = school

    def to_dict(self) -> dict[str, str]:
        data = super().to_dict()
        data["school"] = self.school
        return data


def member_from_dict(data: dict[str, str]) -> Member:
    if data["kind"] == "student":
        return StudentMember(data["member_id"], data["name"], data["school"])
    return Member(data["member_id"], data["name"])


people = [Member("M-001", "Aziza"), StudentMember("S-101", "Bekzod", "21-maktab")]
for person in people:
    print(person, person.max_books, person.loan_days)

saved = [p.to_dict() for p in people]
print(saved[1])
print([member_from_dict(d) for d in saved])
```

```text
Member('M-001', 'Aziza') 5 21
StudentMember('S-101', 'Bekzod') 2 14
{'member_id': 'S-101', 'name': 'Bekzod', 'kind': 'student', 'school': '21-maktab'}
[Member('M-001', 'Aziza'), StudentMember('S-101', 'Bekzod')]
```

Kutubxona şunçaki `member.max_books` va `member.loan_days` ni öqiydi. Polimorfizm har bir aʼzo turiga bitta ham `isinstance` tekşiruvisiz öz qoidalarini beradi. `kind` klass atributi yuklaşda `member_from_dict` ga **qaysi klassni** yaratişni aytadi. Bunday kiçik funksiya **fabrika** deb ataladi.

## 4-qadam: ijaralar va qaytariş muddatlari

Ijara kitob va aʼzoni vaqt davomida boğlaydi. Ikki sanani ayirsangiz (*Sana va vaqt* darsiga qarang) `timedelta` hosil böladi, uning `.days` qiymati kitob qança keçikkanini aytadi:

```python
from dataclasses import dataclass
from datetime import date, timedelta

FINE_PER_DAY = 2_000


@dataclass
class Loan:
    isbn: str
    member_id: str
    borrowed_on: date
    due_on: date
    returned_on: date | None = None

    @property
    def is_active(self) -> bool:
        return self.returned_on is None

    def days_overdue(self, today: date) -> int:
        end = self.returned_on or today
        return max(0, (end - self.due_on).days)

    def fine(self, today: date) -> int:
        return self.days_overdue(today) * FINE_PER_DAY


start = date(2026, 9, 1)
loan = Loan("978-01", "S-101", start, start + timedelta(days=14))
print(loan.due_on, loan.is_active)

for today in [date(2026, 9, 15), date(2026, 9, 20)]:
    print(today, loan.days_overdue(today), f"{loan.fine(today):,} söm")

loan.returned_on = date(2026, 9, 17)
print("Qaytarildi:", loan.is_active, loan.fine(date(2026, 12, 31)))
```

```text
2026-09-15 True
2026-09-15 0 0 söm
2026-09-20 5 10,000 söm
Qaytarildi: False 4000
```

Ikki tafsilot bu klassni işonçli qiladi:

- "Hozir" ga boğliq har bir metod içida `date.today()` ni çaqirmasdan, `today` ni **parametr** sifatida oladi. Haqiqiy dastur haqiqiy sanani, misollar va testlar esa belgilangan sanalarni beradi, şuning uçun natijalar kundan-kunga özgarmaydi. Bu *Kompozitsiya yoki vorislik?* darsidagi boğliqliklarni taşqaridan beriş (dependency injection) usulining vaqtga qöllanilişi.
- Kitob qaytarilgandan keyin `days_overdue` `today` örniga `returned_on` dan foydalanadi, şuning uçun jarima öşişdan töxtaydi.

Töliq dasturda `Loan` ga `to_dict` va `from_dict` ham qöşiladi: ular sanalarni `.isoformat()` bilan `"2026-09-01"` kabi ISO satrlarga va `date.fromisoformat()` bilan qayta sanaga aylantiradi.

## 5-qadam: `Library` klassi, qöşiş va kitob beriş

Kompozitsiya aynan `Library` da amalga oşadi. U kitoblar va aʼzolar luğatlarini hamda ijaralar röyxatini saqlaydi, hammasida type hintlar bor. Biror narsani qidiriş muvaffaqiyatsiz bölişi mumkin, şuning uçun `get_book` `KeyError` ni kutubxonaga xos istisnoga öraydi (`from None` foydasiz asl xatoni yaşiradi). Keyin asosiy dizayn qismlari keladi: `status_of` holatni **hisoblaydi**, `borrow` esa biror narsani özgartirişdan oldin hamma narsani tekşiradi.

Bu nazorat nuqtasini işga tuşiriş mumkin. Unda 1-4-qadamlardagi klasslarning qisqartirilgan versiyalari işlatilgan:

```python
from dataclasses import dataclass
from datetime import date, timedelta
from enum import Enum


class BookStatus(Enum):
    AVAILABLE = "mavjud"
    BORROWED = "berilgan"
    LOST = "yöqolgan"


class LibraryError(Exception):
    pass

class NotFoundError(LibraryError):
    pass

class BookNotAvailableError(LibraryError):
    pass

class LimitReachedError(LibraryError):
    pass


@dataclass
class Book:
    isbn: str
    title: str
    author: str
    year: int
    lost: bool = False


class Member:
    max_books = 5
    loan_days = 21

    def __init__(self, member_id: str, name: str) -> None:
        self.member_id = member_id
        self.name = name


class StudentMember(Member):
    max_books = 2
    loan_days = 14


@dataclass
class Loan:
    isbn: str
    member_id: str
    borrowed_on: date
    due_on: date
    returned_on: date | None = None

    @property
    def is_active(self) -> bool:
        return self.returned_on is None


class Library:
    def __init__(self, name: str) -> None:
        self.name = name
        self.books: dict[str, Book] = {}
        self.members: dict[str, Member] = {}
        self.loans: list[Loan] = []

    def add_book(self, book: Book) -> None:
        self.books[book.isbn] = book

    def add_member(self, member: Member) -> None:
        self.members[member.member_id] = member

    def get_book(self, isbn: str) -> Book:
        try:
            return self.books[isbn]
        except KeyError:
            raise NotFoundError(f"ISBN {isbn} bölgan kitob yöq") from None

    def get_member(self, member_id: str) -> Member:
        try:
            return self.members[member_id]
        except KeyError:
            raise NotFoundError(f"ID {member_id} bölgan aʼzo yöq") from None

    def active_loans(self, member_id: str | None = None) -> list[Loan]:
        return [
            loan for loan in self.loans
            if loan.is_active and (member_id is None or loan.member_id == member_id)
        ]

    def active_loan_for(self, isbn: str) -> Loan | None:
        for loan in self.active_loans():
            if loan.isbn == isbn:
                return loan
        return None

    def status_of(self, isbn: str) -> BookStatus:
        if self.get_book(isbn).lost:
            return BookStatus.LOST
        if self.active_loan_for(isbn) is not None:
            return BookStatus.BORROWED
        return BookStatus.AVAILABLE

    def borrow(self, isbn: str, member_id: str, today: date) -> Loan:
        book = self.get_book(isbn)
        member = self.get_member(member_id)
        status = self.status_of(isbn)
        if status is not BookStatus.AVAILABLE:
            raise BookNotAvailableError(f"«{book.title}» holati: {status.value}")
        if len(self.active_loans(member_id)) >= member.max_books:
            raise LimitReachedError(f"{member.name} allaqaçon {member.max_books} ta kitob olgan")
        loan = Loan(isbn, member_id, today, today + timedelta(days=member.loan_days))
        self.loans.append(loan)
        return loan


lib = Library("Nazorat nuqtasi")
for n in range(1, 4):
    lib.add_book(Book(f"978-0{n}", f"{n}-kitob", "Muallif", 2020))
lib.add_member(StudentMember("S-101", "Bekzod"))
lib.add_member(Member("M-001", "Aziza"))

day = date(2026, 9, 1)
for isbn, member_id in [("978-01", "S-101"), ("978-01", "M-001"), ("978-02", "S-101"), ("978-03", "S-101")]:
    try:
        loan = lib.borrow(isbn, member_id, day)
        print("OK  ", isbn, member_id, "muddat", loan.due_on)
    except LibraryError as error:
        print("XATO", type(error).__name__, error)
print(lib.status_of("978-01"), lib.status_of("978-03"))
```

```text
OK   978-01 S-101 muddat 2026-09-15
XATO BookNotAvailableError «1-kitob» holati: berilgan
OK   978-02 S-101 muddat 2026-09-15
XATO LimitReachedError Bekzod allaqaçon 2 ta kitob olgan
BookStatus.BORROWED BookStatus.AVAILABLE
```

`borrow` dagi barça tekşiruvlar biror narsa özgarişidan **oldin** bajariladi, şuning uçun muvaffaqiyatsiz urinişdan keyin kutubxona aynan avvalgi holatida qoladi. Eʼtibor bering, `borrow` holatga umuman tegmaydi: ijarani röyxatga qöşişning özi butun özgariş, `status_of` esa uni darhol köradi. `member.max_books` va `member.loan_days` 3-qadamdagi polimorfizmning samarasi.

## 6-qadam: qaytariş, yöqotiş, qidiriş va hisobot

Qaytariş faol ijarani yopadi va jarimani qaytaradi. Holat hisoblanganligi uçun kitob avtomatik ravişda yana mavjud böladi. Kitobni yöqotiş ham, agar ijarasi bölsa, uni yopadi va keçikiş jarimasi ustiga almaştiriş tölovini hisoblaydi:

```py
    def return_book(self, isbn: str, today: date) -> int:
        loan = self.active_loan_for(isbn)
        if loan is None:
            raise LibraryError(f"{isbn} kitobi ijarada emas")
        loan.returned_on = today
        return loan.fine(today)

    def mark_lost(self, isbn: str, today: date) -> int:
        book = self.get_book(isbn)
        if book.lost:
            raise BookNotAvailableError(f"«{book.title}» allaqaçon yöqolgan")
        charge = 0
        loan = self.active_loan_for(isbn)
        if loan is not None:                 # berilgan paytda yöqolgan
            loan.returned_on = today
            charge = loan.fine(today) + REPLACEMENT_FEE
        book.lost = True
        return charge
```

Sörovlar faqat maʼlumotni öqiydi. Hisobot çop etiş örniga **satr qaytaradi**, xuddi *Qaytariladigan qiymatlar* darsida tavsiya qilinganidek, şuning uçun çaqiruvçi uni çiqarişi, saqlaşi yoki ikki hisobotni soliştirişi mumkin:

```py
    def overdue_loans(self, today: date) -> list[Loan]:
        return [loan for loan in self.active_loans() if loan.days_overdue(today) > 0]

    def report(self, today: date) -> str:
        counts = {status: 0 for status in BookStatus}
        for isbn in self.books:
            counts[self.status_of(isbn)] += 1
        lines = [
            f"=== {self.name} | {today.isoformat()} ===",
            f"Kitoblar: {len(self)} (" + ", ".join(f"{s.value} {n}" for s, n in counts.items()) + ")",
            f"Aʼzolar: {len(self.members)}, faol ijaralar: {len(self.active_loans())}",
        ]
        ...
```

`{status: 0 for status in BookStatus}` har bir holat hisobotda, hatto kitoblar soni nol bölsa ham, çiqişini kafolatlaydi. `len(self)` `__len__` metodidan foydalanadi: töliq dasturda `Library` ga u `__contains__` bilan birga qöşiladi.

## 7-qadam: abstrakt `Notifier` orqali eslatmalar

Bugun kutubxona eslatmalarni ekranga çiqaradi. Ertaga SMS yoki Telegram xabarlari yuborişi mumkin. Şuning uçun `Library` eslatma **qanday** yetkazilişini bilmasligi, faqat nimadir aʼzoga `notify()` qila olişini bilişi kerak. Abstrakt bazaviy klass bu kelişuvni belgilaydi, kutubxona esa xabarnoma yuboruvçini taşqaridan oladi (dependency injection):

```py
class Notifier(ABC):
    @abstractmethod
    def notify(self, member: Member, message: str) -> None:
        """Aʼzoga xabar yetkazadi."""


class ConsoleNotifier(Notifier):
    def notify(self, member: Member, message: str) -> None:
        print(f"  [{member.name} ga] {message}")


class Library:
    def __init__(self, name: str, notifier: Notifier | None = None) -> None:
        self.name = name
        self.notifier = notifier if notifier is not None else ConsoleNotifier()
        ...

    def send_reminders(self, today: date) -> int:
        overdue = self.overdue_loans(today)
        for loan in overdue:
            title = self.books[loan.isbn].title
            self.notifier.notify(
                self.members[loan.member_id],
                f"«{title}» {loan.days_overdue(today)} kun keçikdi, hozirgaça jarima {loan.fine(today):,} söm",
            )
        return len(overdue)
```

`notify()` ni unutgan kelajakdagi `SmsNotifier` eslatma yuboriş örtasida emas, yaratilgan zahoti `TypeError` bilan xato beradi. Testlarda esa xabarlarni çiqariş örniga yozib qoladigan soxta yuboruvçini berişingiz mumkin.

## 8-qadam: saqlaş va yuklaş

Har bir klass özini luğatga aylantira olgani uçun kutubxonani saqlaş şu luğatlarni yiğişdan iborat:

```py
    def save(self, path: str) -> None:
        data = {
            "name": self.name,
            "books": [b.to_dict() for b in self.books.values()],
            "members": [m.to_dict() for m in self.members.values()],
            "loans": [loan.to_dict() for loan in self.loans],
        }
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    @classmethod
    def load(cls, path: str, notifier: Notifier | None = None) -> Self:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        library = cls(data["name"], notifier)
        for item in data["books"]:
            library.add_book(Book.from_dict(item))
        for item in data["members"]:
            library.add_member(member_from_dict(item))
        library.loans = [Loan.from_dict(item) for item in data["loans"]]
        return library
```

Saqlangan fayl taxminan şunday körinadi (qisqartirilgan):

```text
{
  "name": "Samarqand şahar kutubxonasi",
  "books": [
    {"isbn": "978-01", "title": "Ötgan kunlar", ..., "lost": false},
    ...
  ],
  "members": [
    {"member_id": "S-101", "name": "Bekzod", "kind": "student", "school": "21-maktab"},
    ...
  ],
  "loans": [
    {"isbn": "978-01", "member_id": "S-101", "borrowed_on": "2026-09-01",
     "due_on": "2026-09-15", "returned_on": null},
    ...
  ]
}
```

Sanalar ISO satrlarga, `None` esa `null` ga aylandi. Holat umuman saqlanmaydi: yuklangandan keyin u `lost` va ijaralardan qayta hisoblanadi. Xabarnoma yuboruvçi ham saqlanmaydi, çunki u maʼlumot emas, xatti-harakat.

## Töliq dastur

Mana hammasi bitta faylda va undan keyin barça imkoniyatlarni işlatib köradigan namunaviy işga tuşiriş. Uni `library.py` ga nusxalang va işga tuşiring.

```python
import json
from abc import ABC, abstractmethod
from dataclasses import dataclass, asdict
from datetime import date, timedelta
from enum import Enum
from typing import Self


# ---------- 1-qadam: holatlar va xatolar ----------

class BookStatus(Enum):
    AVAILABLE = "mavjud"
    BORROWED = "berilgan"
    LOST = "yöqolgan"


class LibraryError(Exception):
    """Barça kutubxona muammolari uçun bazaviy klass."""


class NotFoundError(LibraryError):
    pass


class BookNotAvailableError(LibraryError):
    pass


class LimitReachedError(LibraryError):
    pass


# ---------- 2-qadam: kitoblar ----------

@dataclass
class Book:
    isbn: str
    title: str
    author: str
    year: int
    lost: bool = False

    def __post_init__(self) -> None:
        if not self.title.strip():
            raise ValueError("Kitobning nomi bölişi kerak")

    def __str__(self) -> str:
        return f"{self.title}, muallif: {self.author} ({self.year})"

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> Self:
        return cls(**data)


# ---------- 3-qadam: aʼzolar ----------

class Member:
    kind = "regular"
    max_books = 5
    loan_days = 21

    def __init__(self, member_id: str, name: str) -> None:
        self.member_id = member_id
        self.name = name

    def __repr__(self) -> str:
        return f"{type(self).__name__}({self.member_id!r}, {self.name!r})"

    def to_dict(self) -> dict[str, str]:
        return {"member_id": self.member_id, "name": self.name, "kind": self.kind}


class StudentMember(Member):
    kind = "student"
    max_books = 2
    loan_days = 14

    def __init__(self, member_id: str, name: str, school: str) -> None:
        super().__init__(member_id, name)
        self.school = school

    def to_dict(self) -> dict[str, str]:
        data = super().to_dict()
        data["school"] = self.school
        return data


def member_from_dict(data: dict[str, str]) -> Member:
    if data["kind"] == "student":
        return StudentMember(data["member_id"], data["name"], data["school"])
    return Member(data["member_id"], data["name"])


# ---------- 4-qadam: ijaralar ----------

FINE_PER_DAY = 2_000
REPLACEMENT_FEE = 50_000


@dataclass
class Loan:
    isbn: str
    member_id: str
    borrowed_on: date
    due_on: date
    returned_on: date | None = None

    @property
    def is_active(self) -> bool:
        return self.returned_on is None

    def days_overdue(self, today: date) -> int:
        end = self.returned_on or today
        return max(0, (end - self.due_on).days)

    def fine(self, today: date) -> int:
        return self.days_overdue(today) * FINE_PER_DAY

    def to_dict(self) -> dict[str, str | None]:
        return {
            "isbn": self.isbn,
            "member_id": self.member_id,
            "borrowed_on": self.borrowed_on.isoformat(),
            "due_on": self.due_on.isoformat(),
            "returned_on": self.returned_on.isoformat() if self.returned_on else None,
        }

    @classmethod
    def from_dict(cls, data: dict) -> Self:
        returned = data["returned_on"]
        return cls(
            data["isbn"],
            data["member_id"],
            date.fromisoformat(data["borrowed_on"]),
            date.fromisoformat(data["due_on"]),
            date.fromisoformat(returned) if returned else None,
        )


# ---------- 7-qadam: xabarnoma yuboruvçilar ----------

class Notifier(ABC):
    @abstractmethod
    def notify(self, member: Member, message: str) -> None:
        """Aʼzoga xabar yetkazadi."""


class ConsoleNotifier(Notifier):
    def notify(self, member: Member, message: str) -> None:
        print(f"  [{member.name} ga] {message}")


# ---------- 5–8-qadamlar: kutubxona ----------

class Library:
    def __init__(self, name: str, notifier: Notifier | None = None) -> None:
        self.name = name
        self.notifier = notifier if notifier is not None else ConsoleNotifier()
        self.books: dict[str, Book] = {}
        self.members: dict[str, Member] = {}
        self.loans: list[Loan] = []      # barça ijaralar, faol va tugaganlari

    def __len__(self) -> int:
        return len(self.books)

    def __contains__(self, isbn: str) -> bool:
        return isbn in self.books

    def add_book(self, book: Book) -> None:
        self.books[book.isbn] = book

    def add_member(self, member: Member) -> None:
        self.members[member.member_id] = member

    def get_book(self, isbn: str) -> Book:
        try:
            return self.books[isbn]
        except KeyError:
            raise NotFoundError(f"ISBN {isbn} bölgan kitob yöq") from None

    def get_member(self, member_id: str) -> Member:
        try:
            return self.members[member_id]
        except KeyError:
            raise NotFoundError(f"ID {member_id} bölgan aʼzo yöq") from None

    def active_loans(self, member_id: str | None = None) -> list[Loan]:
        return [
            loan for loan in self.loans
            if loan.is_active and (member_id is None or loan.member_id == member_id)
        ]

    def active_loan_for(self, isbn: str) -> Loan | None:
        for loan in self.active_loans():
            if loan.isbn == isbn:
                return loan
        return None

    def status_of(self, isbn: str) -> BookStatus:
        if self.get_book(isbn).lost:
            return BookStatus.LOST
        if self.active_loan_for(isbn) is not None:
            return BookStatus.BORROWED
        return BookStatus.AVAILABLE

    def borrow(self, isbn: str, member_id: str, today: date) -> Loan:
        book = self.get_book(isbn)
        member = self.get_member(member_id)
        status = self.status_of(isbn)
        if status is not BookStatus.AVAILABLE:
            raise BookNotAvailableError(f"«{book.title}» holati: {status.value}")
        if len(self.active_loans(member_id)) >= member.max_books:
            raise LimitReachedError(f"{member.name} allaqaçon {member.max_books} ta kitob olgan")
        loan = Loan(isbn, member_id, today, today + timedelta(days=member.loan_days))
        self.loans.append(loan)
        return loan

    def return_book(self, isbn: str, today: date) -> int:
        loan = self.active_loan_for(isbn)
        if loan is None:
            raise LibraryError(f"{isbn} kitobi ijarada emas")
        loan.returned_on = today
        return loan.fine(today)

    def mark_lost(self, isbn: str, today: date) -> int:
        book = self.get_book(isbn)
        if book.lost:
            raise BookNotAvailableError(f"«{book.title}» allaqaçon yöqolgan")
        charge = 0
        loan = self.active_loan_for(isbn)
        if loan is not None:                 # berilgan paytda yöqolgan
            loan.returned_on = today
            charge = loan.fine(today) + REPLACEMENT_FEE
        book.lost = True
        return charge

    def overdue_loans(self, today: date) -> list[Loan]:
        return [loan for loan in self.active_loans() if loan.days_overdue(today) > 0]

    def search(self, text: str) -> list[Book]:
        text = text.lower()
        return [
            b for b in self.books.values()
            if text in b.title.lower() or text in b.author.lower()
        ]

    def report(self, today: date) -> str:
        counts = {status: 0 for status in BookStatus}
        for isbn in self.books:
            counts[self.status_of(isbn)] += 1
        lines = [
            f"=== {self.name} | {today.isoformat()} ===",
            f"Kitoblar: {len(self)} (" + ", ".join(f"{s.value} {n}" for s, n in counts.items()) + ")",
            f"Aʼzolar: {len(self.members)}, faol ijaralar: {len(self.active_loans())}",
        ]
        overdue = self.overdue_loans(today)
        if overdue:
            lines.append("Muddati ötganlar:")
            for loan in overdue:
                book = self.books[loan.isbn]
                member = self.members[loan.member_id]
                lines.append(
                    f"  - {book.title} | {member.name} | "
                    f"{loan.days_overdue(today)} kun | jarima {loan.fine(today):,} söm"
                )
        else:
            lines.append("Muddati ötgan kitoblar yöq.")
        return "\n".join(lines)

    def send_reminders(self, today: date) -> int:
        overdue = self.overdue_loans(today)
        for loan in overdue:
            title = self.books[loan.isbn].title
            self.notifier.notify(
                self.members[loan.member_id],
                f"«{title}» {loan.days_overdue(today)} kun keçikdi, hozirgaça jarima {loan.fine(today):,} söm",
            )
        return len(overdue)

    def save(self, path: str) -> None:
        data = {
            "name": self.name,
            "books": [b.to_dict() for b in self.books.values()],
            "members": [m.to_dict() for m in self.members.values()],
            "loans": [loan.to_dict() for loan in self.loans],
        }
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    @classmethod
    def load(cls, path: str, notifier: Notifier | None = None) -> Self:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        library = cls(data["name"], notifier)
        for item in data["books"]:
            library.add_book(Book.from_dict(item))
        for item in data["members"]:
            library.add_member(member_from_dict(item))
        library.loans = [Loan.from_dict(item) for item in data["loans"]]
        return library


# ---------- Namunaviy işga tuşiriş ----------

def main() -> None:
    lib = Library("Samarqand şahar kutubxonasi")
    lib.add_book(Book("978-01", "Ötgan kunlar", "Abdulla Qodiriy", 1926))
    lib.add_book(Book("978-02", "Keça va kunduz", "Çölpon", 1936))
    lib.add_book(Book("978-03", "Boşlovçilar uçun Python", "Dilnoza Karimova", 2024))
    lib.add_book(Book("978-04", "Uluğbek yulduzlari", "Farrux Aliyev", 2019))
    lib.add_member(Member("M-001", "Aziza"))
    lib.add_member(StudentMember("S-101", "Bekzod", "21-maktab"))

    start = date(2026, 9, 1)
    print("Kitob beriş:")
    attempts = [
        ("978-01", "S-101"),
        ("978-03", "S-101"),
        ("978-04", "S-101"),     # talaba limiti 2 ta
        ("978-01", "M-001"),     # allaqaçon berilgan
        ("978-02", "M-001"),
        ("978-99", "M-001"),     # mavjud emas
    ]
    for isbn, member_id in attempts:
        try:
            loan = lib.borrow(isbn, member_id, start)
            print(f"  OK   {lib.books[isbn].title} -> {lib.members[member_id].name}, muddat {loan.due_on}")
        except LibraryError as error:
            print(f"  XATO {type(error).__name__}: {error}")

    fine = lib.return_book("978-03", date(2026, 9, 20))
    print(f"\nBekzod 2026-09-20 kuni kitob qaytardi, jarima: {fine:,} söm")
    charge = lib.mark_lost("978-02", date(2026, 9, 25))
    print(f"Aziza «Keça va kunduz» ni yöqotdi, tölov: {charge:,} söm")

    today = date(2026, 9, 25)
    print()
    print(lib.report(today))
    print("Eslatmalar:")
    sent = lib.send_reminders(today)
    print(f"  {sent} ta yuborildi")

    lib.save("library.json")
    copy = Library.load("library.json")
    print("\nQayta yuklandi:", len(copy), "ta kitob,", len(copy.active_loans()), "ta faol ijara")
    print("«python» qidiruvi:", [str(b) for b in copy.search("python")])
    print("Yuklagandan keyin hisobot bir xil:", copy.report(today) == lib.report(today))


main()
```

Namunaviy işga tuşiriş natijasi:

```text
Kitob beriş:
  OK   Ötgan kunlar -> Bekzod, muddat 2026-09-15
  OK   Boşlovçilar uçun Python -> Bekzod, muddat 2026-09-15
  XATO LimitReachedError: Bekzod allaqaçon 2 ta kitob olgan
  XATO BookNotAvailableError: «Ötgan kunlar» holati: berilgan
  OK   Keça va kunduz -> Aziza, muddat 2026-09-22
  XATO NotFoundError: ISBN 978-99 bölgan kitob yöq

Bekzod 2026-09-20 kuni kitob qaytardi, jarima: 10,000 söm
Aziza «Keça va kunduz» ni yöqotdi, tölov: 56,000 söm

=== Samarqand şahar kutubxonasi | 2026-09-25 ===
Kitoblar: 4 (mavjud 2, berilgan 1, yöqolgan 1)
Aʼzolar: 2, faol ijaralar: 1
Muddati ötganlar:
  - Ötgan kunlar | Bekzod | 10 kun | jarima 20,000 söm
Eslatmalar:
  [Bekzod ga] «Ötgan kunlar» 10 kun keçikdi, hozirgaça jarima 20,000 söm
  1 ta yuborildi

Qayta yuklandi: 4 ta kitob, 1 ta faol ijara
«python» qidiruvi: ['Boşlovçilar uçun Python, muallif: Dilnoza Karimova (2024)']
Yuklagandan keyin hisobot bir xil: True
```

Natijani körib çiqing va har bir qatorni qoida bilan soliştiring:

- Bekzod talaba, şuning uçun uning ijaralari muddati 14 kundan keyin tugaydi va uçinçi kitobi rad etiladi.
- "Ötgan kunlar" allaqaçon berilgan, şuning uçun Aziza uni ola olmaydi. Uning öz ijarasi muddati 21 kundan keyin tugaydi.
- Bekzod "Boşlovçilar uçun Python" ni 5 kun keçiktirib qaytardi: 5 x 2,000 = 10,000 söm.
- Aziza "Keça va kunduz" ni muddati tugaganidan 3 kun keyin yöqotdi: 6,000 söm jarima va 50,000 söm almaştiriş tölovi. Uning ijarasi yopildi, kitob esa endi yöqolgan hisoblanadi.
- 25-sentabrda bitta ijara hali oçiq va muddati ötgan, şuning uçun bitta eslatma yuboriladi.
- Saqlaş va yuklaşdan keyin hisobot aynan bir xil, bu JSON orqali saqlaş-yuklaşda heç narsa yöqolmaganini isbotlaydi.

## Özingiz sinab köring

Bu ixçam versiyada kitoblar, limitli aʼzolar va kitob beriş bor. `return_book` metodini yoki limiti 1 bölgan `StudentMember` ni qöşing.

<ClientOnly><PythonPlayground :code='"from dataclasses import dataclass\nfrom enum import Enum\n\n\nclass BookStatus(Enum):\n    AVAILABLE = \"mavjud\"\n    BORROWED = \"berilgan\"\n\n\nclass BookNotAvailableError(Exception):\n    pass\n\n\n@dataclass\nclass Book:\n    isbn: str\n    title: str\n    status: BookStatus = BookStatus.AVAILABLE\n\n\nclass Member:\n    max_books = 3\n\n    def __init__(self, name):\n        self.name = name\n        self.books = []\n\n\nclass Library:\n    def __init__(self):\n        self.books = {}\n\n    def add(self, book):\n        self.books[book.isbn] = book\n\n    def borrow(self, isbn, member):\n        book = self.books[isbn]\n        if book.status is not BookStatus.AVAILABLE:\n            raise BookNotAvailableError(book.title + \" allaqaçon berilgan\")\n        if len(member.books) >= member.max_books:\n            raise BookNotAvailableError(member.name + \" limitga yetdi\")\n        book.status = BookStatus.BORROWED\n        member.books.append(book)\n\n\nlib = Library()\nlib.add(Book(\"1\", \"Ötgan kunlar\"))\nlib.add(Book(\"2\", \"Keça va kunduz\"))\naziza = Member(\"Aziza\")\nbekzod = Member(\"Bekzod\")\n\nfor isbn, member in [(\"1\", aziza), (\"1\", bekzod), (\"2\", bekzod)]:\n    try:\n        lib.borrow(isbn, member)\n        print(member.name, \"oldi:\", lib.books[isbn].title)\n    except BookNotAvailableError as error:\n        print(\"Rad etildi:\", error)"' /></ClientOnly>

## Köp uçraydigan xatolar

Bular **dizayn** xatolari: kod işlaydi, lekin dasturni özgartiriş qiyinlaşadi yoki u sezdirmasdan notöğri işlaydi.

### 1. Bitta faktni ikki joyda saqlaş

```python
from dataclasses import dataclass
from enum import Enum


class BookStatus(Enum):
    AVAILABLE = "mavjud"
    BORROWED = "berilgan"


@dataclass
class Book:
    title: str
    status: BookStatus = BookStatus.AVAILABLE    # Yomon: "ijaradami?" faktining ikkinçi nusxasi


@dataclass
class Loan:
    book: Book
    returned: bool = False


book = Book("Ötgan kunlar")
loan = Loan(book)
book.status = BookStatus.BORROWED
loan.returned = True                             # qaytarildi, lekin holat unutildi
print(book.status.value, loan.returned)
```

```text
berilgan True
```

Ijara kitob qaytganini aytadi, kitob esa hali taşqarida ekanini aytadi va uni heç kim ola olmaydi. **Tuzatiş:** faktni hisoblaş mumkin bölsa, uni hisoblang. Loyiha ijaralar va `lost` belgisini saqlaydi, qolganini esa `status_of()` hisoblab çiqaradi.

### 2. Xatolarni juda keng uşlaş

```python
class Library:
    def borrow(self, isbn):
        return self.boks[isbn]       # imlo xatosi: haqiqiy bag


try:
    Library().borrow("978-01")
except Exception:
    print("Kitob berib bölmadi")
```

```text
Kitob berib bölmadi
```

Imlo xatosidan kelgan `AttributeError` oddiy rad etişdan farq qilmaydi, şuning uçun bag yaşirinib qoladi. **Tuzatiş:** barça kutilgan muammolarni qamrab oladigan `LibraryError` ni uşlang, kutilmagan xatolar esa öz traceback ini körsatsin.

### 3. JSON işlay olmaydigan obyektlarni saqlaş

```py
import json
from datetime import date

json.dumps(date(2026, 9, 15))
```

```text
TypeError: Object of type date is not JSON serializable
```

**Tuzatiş:** `to_dict` da sanalarni `.isoformat()` bilan (enumlarni esa `.value` bilan) özgartiring va `from_dict` da teskarisini bajaring.

## Qöşimça topşiriqlar

Har bir topşiriq töliq dasturni kengaytiradi. Ularni tartib bilan bajaring, çunki keyingilari oldingilariga tayanadi.

### 1. Ijarani uzaytiriş <Difficulty level="1" />

Faol ijaraning qaytariş muddatini aʼzoning `loan_days` qiymatiga uzaytiradigan `Library.renew(isbn: str, today: date) -> Loan` metodini qöşing, lekin faqat ijara muddati ötmagan bölsa. Aks holda `LibraryError` çaqiring.

::: details Maslahat
Ijarani `self.active_loan_for(isbn)` bilan toping. `loan.days_overdue(today) == 0` ni tekşiring, keyin `self.members[loan.member_id]` dagi aʼzo bilan `loan.due_on += timedelta(days=member.loan_days)` ni bajaring.
:::

### 2. Aʼzo tarixi <Difficulty level="1" />

Har bir ijara (ötgan va faol) uçun bitta satr qaytaradigan `Library.history(member_id: str) -> list[str]` metodini qöşing, masalan `"Ötgan kunlar: 2026-09-01 -> 2026-09-20 da qaytarildi"` yoki `"... -> hali qaytarilmagan"`.

::: details Maslahat
`self.loans` böylab aylaning, `member_id` böyiça saralang va nomni `self.books[loan.isbn].title` bilan toping. Oxirini tanlaş uçun `loan.is_active` dan foydalaning.
:::

### 3. Öqituvçi aʼzolar <Difficulty level="2" />

60 kunga 10 tagaça kitob oladigan va heç qaçon keçikiş jarimasi tölamaydigan `TeacherMember` ni qöşing. Saqlaş va yuklaş baribir işlaşi kerak.

::: details Maslahat
Yangi klass atributlari va `kind = "teacher"` bilan `Member` dan voris klass yarating hamda `member_from_dict` ga yangi tarmoq qöşing. "Jarimasiz" qoida uçun `Member` ga `days_late * FINE_PER_DAY` qaytaradigan `fine_for(days_late: int) -> int` kabi metod bering, uni `TeacherMember` da `0` qaytaradigan qilib qayta aniqlang va kutubxonada `loan.fine()` örniga undan foydalaning. Kutubxonada `isinstance` tekşiruvlaridan qoçing.
:::

### 4. Yozib qoladigan xabarnoma yuboruvçi <Difficulty level="2" />

Xabarlarni çiqariş örniga `(member_id, message)` juftliklarini röyxatda saqlaydigan `RecordingNotifier(Notifier)` yozing. Uni `Library(..., notifier=...)` bilan işlatib, namunaviy işga tuşirişda `send_reminders` Bekzodga aynan bitta xabar yuborganini `assert` bilan tekşiring. Keyin `notify()` siz `Notifier` voris klassini yaratib bölmasligini körsating.

::: details Maslahat
`__init__` da `self.sent = []` bering va `notify` da röyxatga qöşing. Kutubxonani `main()` dagidek quring, lekin öz yuboruvçingizni bering. Töliq bölmagan voris klassni `try`/`except TypeError` içida yaratiş ABC işlayotganini isbotlaydi.
:::

### 5. Buyruqlar qatori menyusi <Difficulty level="3" />

`library.json` mavjud bölsa uni yuklaydigan (aks holda böş boşlaydigan), menyu körsatadigan (kitob qöşiş, aʼzo qöşiş, beriş, qaytariş, yöqolgan, qidiriş, hisobot, eslatmalar, çiqiş) va çiqişda saqlaydigan `main()` siklini yozing. Har bir `LibraryError` va notöğri kiritiş dasturni töxtatmasdan tuşunarli xabar çiqarişi kerak.

::: details Maslahat
`Library.load` va yangi `Library` orasida tanlaş uçun `pathlib.Path("library.json").exists()` dan foydalaning. Menyu uçun `match choice:` işlating. Har bir amalni `try`/`except (LibraryError, ValueError) as error:` ga örang. `date.today()` ni **faqat** şu yerda, `main()` da çaqiring va uni kutubxona metodlariga uzating.
:::

## Xulosa

- Imkoniyatlar röyxatidan boşlang: maʼlumotli otlar klassga, belgilangan tanlovlar enumga, harakatlar esa maʼlumotga egalik qiluvçi klass metodlariga aylanadi.
- Yozuvlar uçun dataclass (`Book`, `Loan`), haqiqiy "hisoblanadi" farqlari uçun vorislik (`StudentMember`), majburiy interfeys uçun ABC (`Notifier`) işlating.
- Kompozitsiya va type hintlar bitta muvofiqlaştiruvçiga (`Library`) obyektlarga egalik qiliş, har bir qoidani nazorat qiliş va har bir imzoda nima olib nima qaytarişini körsatiş imkonini beradi.
- Har bir faktni bir marta saqlang, qolganini hisoblang (`status_of`). Holatni özgartirişdan oldin hamma narsani tekşiring.
- `today` va xabarnoma yuboruvçini taşqaridan bering, şunda natijalar oldindan maʼlum va tekşiriladigan böladi.
- Har bir klassga `to_dict`/`from_dict` juftligini bering, şunda butun dasturni saqlaş şunçaki luğatlarni yiğişdan iborat böladi.

## Qöşimça manbalar

- [`dataclasses` moduli](https://docs.python.org/3/library/dataclasses.html)
- [`abc` moduli: abstrakt bazaviy klasslar](https://docs.python.org/3/library/abc.html)
- [`datetime` moduli: date va timedelta](https://docs.python.org/3/library/datetime.html)
- [`json` moduli](https://docs.python.org/3/library/json.html)
