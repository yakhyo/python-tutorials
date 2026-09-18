---
title: "Project: Library Management System"
description: "Build a complete library system step by step with dataclasses, enums, type hints, an abstract base class, custom exceptions, composition, inheritance, due dates and fines, JSON saving, and a text report."
---

# Project: Library Management System

![Illustration: Project: Library Management System](/images/topics-webp/oop-project.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- How to turn a list of features into a set of classes with clear jobs
- How dataclasses, enums, type hints, and special methods work **together** in one program
- How to combine inheritance (member types), an abstract class (notifiers), and composition (the library)
- How to handle due dates and fines with `datetime.date` and `timedelta`
- How to save a whole object graph to JSON and load it back
:::

## Why it matters

Each lesson in this module taught one tool. Real programs need all of them at once, and the hard part is no longer syntax but **design**: which class owns which data, which object may change what, and where each rule lives. A small library system is a perfect practice ground. It is familiar, it has real rules (limits, due dates, fines), and it must remember its data between runs.

By the end you will have a working program of about 350 lines, and you will have seen the thinking that leads to it.

## Goal and features

The Samarkand City Library wants a simple program to replace its paper notebook. It must:

1. Store **books** with ISBN, title, author, and year, and show each book's status: available, borrowed, or lost.
2. Store **members**. Regular members may borrow up to 5 books for 21 days. **Students** may borrow only 2 books for 14 days, and the program records their school.
3. Let a member **borrow** a book, refusing when the book is not available, the member is at their limit, or the book or member does not exist.
4. Let a member **return** a book and calculate a **fine** of 2,000 som per day late.
5. Mark a book **lost**, on the shelf or while borrowed. A borrowed book that is lost closes its loan and costs the late fine plus a 50,000 som replacement fee.
6. List **overdue** loans, **search** books, print a **text report**, and send **reminders** for overdue books.
7. **Save** everything to a JSON file and **load** it back.

## Design

Underline the nouns in the feature list: book, status, member, student, loan, fine, reminder, library, report. Nouns with their own data become classes. Nouns that are a fixed set of choices become enums. Actions (borrow, return, search) become methods on the class that owns the data they change.

| Concept | Kind | Why |
|---|---|---|
| `BookStatus` | `Enum` | a fixed set of three states, no magic strings |
| `Book` | `@dataclass` | mostly data, needs equality and a readable `repr` |
| `Member` | normal class | has class-level rules (`max_books`, `loan_days`) |
| `StudentMember` | subclass of `Member` | a student **is a** member with different limits |
| `Loan` | `@dataclass` | a record connecting a book, a member, and dates |
| `Notifier` | abstract base class | every way of sending reminders must have `notify()` |
| `Library` | normal class | **has** books, members, loans, and a notifier, and coordinates them |
| `LibraryError` and subclasses | exceptions | callers can catch one type or each specific case |

Here is the class diagram. An arrow starting with `<>` means "has / is made of", and `inherits` points from a child class to its parent:

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

Three design decisions are worth pointing out now:

- **Store each fact once.** "Is this book borrowed?" is already answered by the list of loans, so `Book` does not store a status. It stores only `lost`, which no loan can tell you, and `Library.status_of(isbn)` **calculates** the status from both.
- A `Loan` stores the **ISBN and member ID**, not the `Book` and `Member` objects. IDs are easy to save to JSON, and only the library's dictionaries hold the real objects.
- Only `Library` creates and closes loans and marks books lost. One object enforcing the rules makes them easy to find and test.

## Step 1: statuses and errors

Start with the smallest pieces, which everything else will use:

```python
from enum import Enum


class BookStatus(Enum):
    AVAILABLE = "available"
    BORROWED = "borrowed"
    LOST = "lost"


class LibraryError(Exception):
    """Base class for all library problems."""


class NotFoundError(LibraryError):
    pass


class BookNotAvailableError(LibraryError):
    pass


class LimitReachedError(LibraryError):
    pass


print([s.value for s in BookStatus])
print(issubclass(LimitReachedError, LibraryError))

try:
    raise BookNotAvailableError("'Days Gone By' is borrowed")
except LibraryError as error:
    print(type(error).__name__, "-", error)
```

```text
['available', 'borrowed', 'lost']
True
BookNotAvailableError - 'Days Gone By' is borrowed
```

The **exception hierarchy** is a small but powerful use of inheritance. A menu loop can catch `LibraryError` to show any problem, while another part of the program catches only `LimitReachedError` to suggest returning a book first.

## Step 2: the `Book` dataclass

A book is mostly data, so a dataclass fits. It gets a validation check, a friendly `__str__`, and conversion to and from a dictionary for JSON. Every method has type hints, and `from_dict` returns `Self`:

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
            raise ValueError("A book needs a title")

    def __str__(self) -> str:
        return f"{self.title} by {self.author} ({self.year})"

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> Self:
        return cls(**data)


book = Book("978-01", "Days Gone By", "Abdulla Qodiriy", 1926)
print(book)
data = book.to_dict()
print(data)
print(Book.from_dict(data) == book)
```

```text
Days Gone By by Abdulla Qodiriy (1926)
{'isbn': '978-01', 'title': 'Days Gone By', 'author': 'Abdulla Qodiriy', 'year': 1926, 'lost': False}
True
```

`from_dict` is a `@classmethod`, so it can create a new `Book` (see *Class Attributes, Class Methods, and Static Methods*). Each class that knows its own fields converts itself, which keeps saving simple later.

## Step 3: members and student members

Regular members and students share almost everything. Only the limits differ, plus a school for students. That is a real is-a relationship, so inheritance fits. The limits are **class attributes**, the same for every member of a type:

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


people = [Member("M-001", "Aziza"), StudentMember("S-101", "Bekzod", "School No. 21")]
for person in people:
    print(person, person.max_books, person.loan_days)

saved = [p.to_dict() for p in people]
print(saved[1])
print([member_from_dict(d) for d in saved])
```

```text
Member('M-001', 'Aziza') 5 21
StudentMember('S-101', 'Bekzod') 2 14
{'member_id': 'S-101', 'name': 'Bekzod', 'kind': 'student', 'school': 'School No. 21'}
[Member('M-001', 'Aziza'), StudentMember('S-101', 'Bekzod')]
```

The library will simply read `member.max_books` and `member.loan_days`. Polymorphism gives each member type its own rules without a single `isinstance` check. The `kind` class attribute tells `member_from_dict` **which class** to create when loading. A small function like that is called a **factory**.

## Step 4: loans and due dates

A loan connects a book and a member over time. Subtracting two dates (see *Dates and Times*) gives a `timedelta`, whose `.days` tells you how late a book is:

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
    print(today, loan.days_overdue(today), f"{loan.fine(today):,} som")

loan.returned_on = date(2026, 9, 17)
print("Returned:", loan.is_active, loan.fine(date(2026, 12, 31)))
```

```text
2026-09-15 True
2026-09-15 0 0 som
2026-09-20 5 10,000 som
Returned: False 4000
```

Two details make this class reliable:

- Every method that depends on "now" takes `today` as a **parameter** instead of calling `date.today()` inside. The real program passes the real date, and examples and tests pass fixed dates, so results never change from day to day. This is dependency injection from *Composition vs. Inheritance*, applied to time.
- After a book is returned, `days_overdue` uses `returned_on` instead of `today`, so the fine stops growing.

In the complete program, `Loan` also gets `to_dict` and `from_dict`, which turn dates into ISO strings like `"2026-09-01"` with `.isoformat()` and back with `date.fromisoformat()`.

## Step 5: the `Library` class, adding and borrowing

`Library` is where composition happens. It holds dictionaries of books and members and a list of loans, all with type hints. Looking things up can fail, so `get_book` wraps the `KeyError` in a library-specific exception (`from None` hides the unhelpful original). Then come the key design pieces: `status_of` **calculates** a status, and `borrow` checks everything before changing anything.

This checkpoint is runnable. It uses trimmed versions of the classes from Steps 1 to 4:

```python
from dataclasses import dataclass
from datetime import date, timedelta
from enum import Enum


class BookStatus(Enum):
    AVAILABLE = "available"
    BORROWED = "borrowed"
    LOST = "lost"


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
            raise NotFoundError(f"No book with ISBN {isbn}") from None

    def get_member(self, member_id: str) -> Member:
        try:
            return self.members[member_id]
        except KeyError:
            raise NotFoundError(f"No member with ID {member_id}") from None

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
            raise BookNotAvailableError(f"'{book.title}' is {status.value}")
        if len(self.active_loans(member_id)) >= member.max_books:
            raise LimitReachedError(f"{member.name} already has {member.max_books} books")
        loan = Loan(isbn, member_id, today, today + timedelta(days=member.loan_days))
        self.loans.append(loan)
        return loan


lib = Library("Checkpoint")
for n in range(1, 4):
    lib.add_book(Book(f"978-0{n}", f"Book {n}", "Author", 2020))
lib.add_member(StudentMember("S-101", "Bekzod"))
lib.add_member(Member("M-001", "Aziza"))

day = date(2026, 9, 1)
for isbn, member_id in [("978-01", "S-101"), ("978-01", "M-001"), ("978-02", "S-101"), ("978-03", "S-101")]:
    try:
        loan = lib.borrow(isbn, member_id, day)
        print("OK  ", isbn, member_id, "due", loan.due_on)
    except LibraryError as error:
        print("FAIL", type(error).__name__, error)
print(lib.status_of("978-01"), lib.status_of("978-03"))
```

```text
OK   978-01 S-101 due 2026-09-15
FAIL BookNotAvailableError 'Book 1' is borrowed
OK   978-02 S-101 due 2026-09-15
FAIL LimitReachedError Bekzod already has 2 books
BookStatus.BORROWED BookStatus.AVAILABLE
```

All checks in `borrow` happen **before** anything changes, so a failed borrow leaves the library exactly as it was. Notice that `borrow` never touches a status: appending the loan is the whole change, and `status_of` sees it immediately. `member.max_books` and `member.loan_days` are the polymorphism payoff from Step 3.

## Step 6: returning, losing, searching, and reporting

Returning closes the active loan and gives back the fine. Because the status is calculated, the book is available again automatically. Losing a book closes its loan too, if it had one, and charges the late fine plus the replacement fee:

```py
    def return_book(self, isbn: str, today: date) -> int:
        loan = self.active_loan_for(isbn)
        if loan is None:
            raise LibraryError(f"Book {isbn} is not on loan")
        loan.returned_on = today
        return loan.fine(today)

    def mark_lost(self, isbn: str, today: date) -> int:
        book = self.get_book(isbn)
        if book.lost:
            raise BookNotAvailableError(f"'{book.title}' is already lost")
        charge = 0
        loan = self.active_loan_for(isbn)
        if loan is not None:                 # lost while borrowed
            loan.returned_on = today
            charge = loan.fine(today) + REPLACEMENT_FEE
        book.lost = True
        return charge
```

The queries only read data. The report **returns a string** instead of printing, as *Return Values* recommended, so the caller can print it, save it, or compare two reports:

```py
    def overdue_loans(self, today: date) -> list[Loan]:
        return [loan for loan in self.active_loans() if loan.days_overdue(today) > 0]

    def report(self, today: date) -> str:
        counts = {status: 0 for status in BookStatus}
        for isbn in self.books:
            counts[self.status_of(isbn)] += 1
        lines = [
            f"=== {self.name} | {today.isoformat()} ===",
            f"Books: {len(self)} (" + ", ".join(f"{s.value} {n}" for s, n in counts.items()) + ")",
            f"Members: {len(self.members)}, active loans: {len(self.active_loans())}",
        ]
        ...
```

`{status: 0 for status in BookStatus}` guarantees every status appears in the report, even with zero books. `len(self)` uses a `__len__` method, which the complete program gives `Library` along with `__contains__`.

## Step 7: reminders through an abstract `Notifier`

Today the library prints reminders. Tomorrow it may send SMS or Telegram messages. So `Library` should not know **how** a reminder travels, only that something can `notify()` a member. An abstract base class states that contract, and the library receives the notifier from outside (dependency injection):

```py
class Notifier(ABC):
    @abstractmethod
    def notify(self, member: Member, message: str) -> None:
        """Deliver a message to a member."""


class ConsoleNotifier(Notifier):
    def notify(self, member: Member, message: str) -> None:
        print(f"  [to {member.name}] {message}")


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
                f"'{title}' is {loan.days_overdue(today)} days late, fine so far {loan.fine(today):,} som",
            )
        return len(overdue)
```

A future `SmsNotifier` that forgets `notify()` fails with `TypeError` the moment it is created, not in the middle of sending reminders. In tests you can pass a fake notifier that records messages instead of printing them.

## Step 8: saving and loading

Because each class converts itself to a dictionary, saving the library is just collecting those dictionaries:

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

The saved file looks like this (shortened):

```text
{
  "name": "Samarkand City Library",
  "books": [
    {"isbn": "978-01", "title": "Days Gone By", ..., "lost": false},
    ...
  ],
  "members": [
    {"member_id": "S-101", "name": "Bekzod", "kind": "student", "school": "School No. 21"},
    ...
  ],
  "loans": [
    {"isbn": "978-01", "member_id": "S-101", "borrowed_on": "2026-09-01",
     "due_on": "2026-09-15", "returned_on": null},
    ...
  ]
}
```

Dates became ISO strings and `None` became `null`. No status is saved at all: it is recalculated from `lost` and the loans after loading. The notifier is not saved either, because it is behavior, not data.

## The complete program

Here is everything in one file, followed by a sample run that exercises every feature. Copy it into `library.py` and run it.

```python
import json
from abc import ABC, abstractmethod
from dataclasses import dataclass, asdict
from datetime import date, timedelta
from enum import Enum
from typing import Self


# ---------- Step 1: statuses and errors ----------

class BookStatus(Enum):
    AVAILABLE = "available"
    BORROWED = "borrowed"
    LOST = "lost"


class LibraryError(Exception):
    """Base class for all library problems."""


class NotFoundError(LibraryError):
    pass


class BookNotAvailableError(LibraryError):
    pass


class LimitReachedError(LibraryError):
    pass


# ---------- Step 2: books ----------

@dataclass
class Book:
    isbn: str
    title: str
    author: str
    year: int
    lost: bool = False

    def __post_init__(self) -> None:
        if not self.title.strip():
            raise ValueError("A book needs a title")

    def __str__(self) -> str:
        return f"{self.title} by {self.author} ({self.year})"

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> Self:
        return cls(**data)


# ---------- Step 3: members ----------

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


# ---------- Step 4: loans ----------

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


# ---------- Step 7: notifiers ----------

class Notifier(ABC):
    @abstractmethod
    def notify(self, member: Member, message: str) -> None:
        """Deliver a message to a member."""


class ConsoleNotifier(Notifier):
    def notify(self, member: Member, message: str) -> None:
        print(f"  [to {member.name}] {message}")


# ---------- Steps 5-8: the library ----------

class Library:
    def __init__(self, name: str, notifier: Notifier | None = None) -> None:
        self.name = name
        self.notifier = notifier if notifier is not None else ConsoleNotifier()
        self.books: dict[str, Book] = {}
        self.members: dict[str, Member] = {}
        self.loans: list[Loan] = []      # every Loan, active and finished

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
            raise NotFoundError(f"No book with ISBN {isbn}") from None

    def get_member(self, member_id: str) -> Member:
        try:
            return self.members[member_id]
        except KeyError:
            raise NotFoundError(f"No member with ID {member_id}") from None

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
            raise BookNotAvailableError(f"'{book.title}' is {status.value}")
        if len(self.active_loans(member_id)) >= member.max_books:
            raise LimitReachedError(f"{member.name} already has {member.max_books} books")
        loan = Loan(isbn, member_id, today, today + timedelta(days=member.loan_days))
        self.loans.append(loan)
        return loan

    def return_book(self, isbn: str, today: date) -> int:
        loan = self.active_loan_for(isbn)
        if loan is None:
            raise LibraryError(f"Book {isbn} is not on loan")
        loan.returned_on = today
        return loan.fine(today)

    def mark_lost(self, isbn: str, today: date) -> int:
        book = self.get_book(isbn)
        if book.lost:
            raise BookNotAvailableError(f"'{book.title}' is already lost")
        charge = 0
        loan = self.active_loan_for(isbn)
        if loan is not None:                 # lost while borrowed
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
            f"Books: {len(self)} (" + ", ".join(f"{s.value} {n}" for s, n in counts.items()) + ")",
            f"Members: {len(self.members)}, active loans: {len(self.active_loans())}",
        ]
        overdue = self.overdue_loans(today)
        if overdue:
            lines.append("Overdue:")
            for loan in overdue:
                book = self.books[loan.isbn]
                member = self.members[loan.member_id]
                lines.append(
                    f"  - {book.title} | {member.name} | "
                    f"{loan.days_overdue(today)} days | fine {loan.fine(today):,} som"
                )
        else:
            lines.append("No overdue books.")
        return "\n".join(lines)

    def send_reminders(self, today: date) -> int:
        overdue = self.overdue_loans(today)
        for loan in overdue:
            title = self.books[loan.isbn].title
            self.notifier.notify(
                self.members[loan.member_id],
                f"'{title}' is {loan.days_overdue(today)} days late, fine so far {loan.fine(today):,} som",
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


# ---------- Sample run ----------

def main() -> None:
    lib = Library("Samarkand City Library")
    lib.add_book(Book("978-01", "Days Gone By", "Abdulla Qodiriy", 1926))
    lib.add_book(Book("978-02", "Night and Day", "Cholpon", 1936))
    lib.add_book(Book("978-03", "Python for Beginners", "Dilnoza Karimova", 2024))
    lib.add_book(Book("978-04", "The Stars of Ulugh Beg", "Farrukh Aliyev", 2019))
    lib.add_member(Member("M-001", "Aziza"))
    lib.add_member(StudentMember("S-101", "Bekzod", "School No. 21"))

    start = date(2026, 9, 1)
    print("Borrowing:")
    attempts = [
        ("978-01", "S-101"),
        ("978-03", "S-101"),
        ("978-04", "S-101"),     # student limit is 2
        ("978-01", "M-001"),     # already borrowed
        ("978-02", "M-001"),
        ("978-99", "M-001"),     # does not exist
    ]
    for isbn, member_id in attempts:
        try:
            loan = lib.borrow(isbn, member_id, start)
            print(f"  OK   {lib.books[isbn].title} -> {lib.members[member_id].name}, due {loan.due_on}")
        except LibraryError as error:
            print(f"  FAIL {type(error).__name__}: {error}")

    fine = lib.return_book("978-03", date(2026, 9, 20))
    print(f"\nBekzod returned a book on 2026-09-20, fine: {fine:,} som")
    charge = lib.mark_lost("978-02", date(2026, 9, 25))
    print(f"Aziza lost 'Night and Day', charge: {charge:,} som")

    today = date(2026, 9, 25)
    print()
    print(lib.report(today))
    print("Reminders:")
    sent = lib.send_reminders(today)
    print(f"  {sent} sent")

    lib.save("library.json")
    copy = Library.load("library.json")
    print("\nReloaded:", len(copy), "books,", len(copy.active_loans()), "active loans")
    print("Search 'python':", [str(b) for b in copy.search("python")])
    print("Same report after loading:", copy.report(today) == lib.report(today))


main()
```

Sample run:

```text
Borrowing:
  OK   Days Gone By -> Bekzod, due 2026-09-15
  OK   Python for Beginners -> Bekzod, due 2026-09-15
  FAIL LimitReachedError: Bekzod already has 2 books
  FAIL BookNotAvailableError: 'Days Gone By' is borrowed
  OK   Night and Day -> Aziza, due 2026-09-22
  FAIL NotFoundError: No book with ISBN 978-99

Bekzod returned a book on 2026-09-20, fine: 10,000 som
Aziza lost 'Night and Day', charge: 56,000 som

=== Samarkand City Library | 2026-09-25 ===
Books: 4 (available 2, borrowed 1, lost 1)
Members: 2, active loans: 1
Overdue:
  - Days Gone By | Bekzod | 10 days | fine 20,000 som
Reminders:
  [to Bekzod] 'Days Gone By' is 10 days late, fine so far 20,000 som
  1 sent

Reloaded: 4 books, 1 active loans
Search 'python': ['Python for Beginners by Dilnoza Karimova (2024)']
Same report after loading: True
```

Walk through the output and match each line to a rule:

- Bekzod is a student, so his loans are due after 14 days, and his third book is refused.
- "Days Gone By" is already borrowed, so Aziza cannot take it. Her own loan is due after 21 days.
- Bekzod returned "Python for Beginners" 5 days late: 5 x 2,000 = 10,000 som.
- Aziza lost "Night and Day" 3 days after its due date: 6,000 som in fines plus the 50,000 som replacement fee. Her loan is closed, and the book now counts as lost.
- On September 25, one loan is still open and late, so one reminder goes out.
- After saving and loading, the report is identical, which proves the JSON round trip lost nothing.

## Try it

This compact version has books, members with limits, and borrowing. Add a `return_book` method, or a `StudentMember` with a limit of 1.

<ClientOnly><PythonPlayground :code='"from dataclasses import dataclass\nfrom enum import Enum\n\n\nclass BookStatus(Enum):\n    AVAILABLE = \"available\"\n    BORROWED = \"borrowed\"\n\n\nclass BookNotAvailableError(Exception):\n    pass\n\n\n@dataclass\nclass Book:\n    isbn: str\n    title: str\n    status: BookStatus = BookStatus.AVAILABLE\n\n\nclass Member:\n    max_books = 3\n\n    def __init__(self, name):\n        self.name = name\n        self.books = []\n\n\nclass Library:\n    def __init__(self):\n        self.books = {}\n\n    def add(self, book):\n        self.books[book.isbn] = book\n\n    def borrow(self, isbn, member):\n        book = self.books[isbn]\n        if book.status is not BookStatus.AVAILABLE:\n            raise BookNotAvailableError(book.title + \" is borrowed\")\n        if len(member.books) >= member.max_books:\n            raise BookNotAvailableError(member.name + \" reached the limit\")\n        book.status = BookStatus.BORROWED\n        member.books.append(book)\n\n\nlib = Library()\nlib.add(Book(\"1\", \"Days Gone By\"))\nlib.add(Book(\"2\", \"Night and Day\"))\naziza = Member(\"Aziza\")\nbekzod = Member(\"Bekzod\")\n\nfor isbn, member in [(\"1\", aziza), (\"1\", bekzod), (\"2\", bekzod)]:\n    try:\n        lib.borrow(isbn, member)\n        print(member.name, \"borrowed\", lib.books[isbn].title)\n    except BookNotAvailableError as error:\n        print(\"Refused:\", error)"' /></ClientOnly>

## Common mistakes

These are **design** mistakes: the code runs, but the program becomes hard to change or quietly wrong.

### 1. Storing the same fact in two places

```python
from dataclasses import dataclass
from enum import Enum


class BookStatus(Enum):
    AVAILABLE = "available"
    BORROWED = "borrowed"


@dataclass
class Book:
    title: str
    status: BookStatus = BookStatus.AVAILABLE    # Bad: a second copy of "is it on loan?"


@dataclass
class Loan:
    book: Book
    returned: bool = False


book = Book("Days Gone By")
loan = Loan(book)
book.status = BookStatus.BORROWED
loan.returned = True                             # returned, but the status was forgotten
print(book.status.value, loan.returned)
```

```text
borrowed True
```

The loan says the book is back, the book says it is out, and nobody can borrow it. When a fact can be calculated, calculate it. The project stores loans and a `lost` flag, and `status_of()` derives the rest.

### 2. Catching errors too broadly

```python
class Library:
    def borrow(self, isbn):
        return self.boks[isbn]       # a typo: a real bug


try:
    Library().borrow("978-01")
except Exception:
    print("Could not borrow")
```

```text
Could not borrow
```

The `AttributeError` from the typo looks exactly like a normal refusal, so the bug hides. **Fix:** catch `LibraryError`, which covers every expected problem, and let unexpected errors show their traceback.

### 3. Saving objects that JSON cannot handle

```py
import json
from datetime import date

json.dumps(date(2026, 9, 15))
```

```text
TypeError: Object of type date is not JSON serializable
```

Convert dates with `.isoformat()` (and enums with `.value`) in `to_dict`, and reverse them in `from_dict`.

## Challenges

Each challenge extends the complete program. Try them in order, since later ones build on earlier ones.

### 1. Renew a loan <Difficulty level="1" />

Add `Library.renew(isbn: str, today: date) -> Loan` that extends the due date of an active loan by the member's `loan_days`, but only if the loan is not overdue. Raise `LibraryError` otherwise.

::: details Hint
Find the loan with `self.active_loan_for(isbn)`. Check `loan.days_overdue(today) == 0`, then use `loan.due_on += timedelta(days=member.loan_days)`, with the member from `self.members[loan.member_id]`.
:::

### 2. A member's history <Difficulty level="1" />

Add `Library.history(member_id: str) -> list[str]` that returns one string per loan (past and active), like `"Days Gone By: 2026-09-01 -> returned 2026-09-20"` or `"... -> still out"`.

::: details Hint
Loop over `self.loans`, filter by `member_id`, and look up the title with `self.books[loan.isbn].title`. Use `loan.is_active` to choose the ending.
:::

### 3. Teacher members <Difficulty level="2" />

Add a `TeacherMember` who may borrow 10 books for 60 days and never pays late fines. Saving and loading must still work.

::: details Hint
Subclass `Member` with new class attributes and `kind = "teacher"`, and add a branch to `member_from_dict`. For "no fines", give `Member` a method like `fine_for(days_late: int) -> int` that returns `days_late * FINE_PER_DAY`, override it in `TeacherMember` to return `0`, and have the library use it instead of `loan.fine()`. Avoid `isinstance` checks in the library.
:::

### 4. A recording notifier <Difficulty level="2" />

Write a `RecordingNotifier(Notifier)` that stores `(member_id, message)` pairs in a list instead of printing. Use it with `Library(..., notifier=...)` to check with `assert` that `send_reminders` sends exactly one message to Bekzod in the sample run. Then show that a subclass of `Notifier` without `notify()` cannot be created.

::: details Hint
Give it `self.sent = []` in `__init__` and append in `notify`. Build the library as in `main()`, but pass your notifier. Creating the incomplete subclass inside `try`/`except TypeError` proves the ABC works.
:::

### 5. A command-line menu <Difficulty level="3" />

Write a `main()` loop that loads `library.json` if it exists (otherwise starts empty), shows a menu (add book, add member, borrow, return, lost, search, report, reminders, quit), and saves on quit. Every `LibraryError` and invalid input must print a friendly message without crashing.

::: details Hint
Use `pathlib.Path("library.json").exists()` to choose between `Library.load` and a new `Library`. Use `match choice:` for the menu. Wrap each action in `try`/`except (LibraryError, ValueError) as error:`. Call `date.today()` **only** here in `main()`, and pass it into the library methods.
:::

## Recap

- Start from the feature list: nouns with data become classes, fixed choices become enums, and actions become methods on the class that owns the data.
- Use dataclasses for records (`Book`, `Loan`), inheritance for true is-a variations (`StudentMember`), and an ABC for a required interface (`Notifier`).
- Composition and type hints let one coordinator (`Library`) own the objects, enforce every rule, and show in each signature what it takes and returns.
- Store each fact once and calculate the rest (`status_of`). Check everything before changing state.
- Pass `today` and the notifier in, so results are predictable and testable.
- Give each class a `to_dict`/`from_dict` pair, so saving a whole program is just collecting dictionaries.

## Further reading

- [`dataclasses` module](https://docs.python.org/3/library/dataclasses.html)
- [`abc` module: Abstract Base Classes](https://docs.python.org/3/library/abc.html)
- [`datetime` module: date and timedelta](https://docs.python.org/3/library/datetime.html)
- [`json` module](https://docs.python.org/3/library/json.html)
