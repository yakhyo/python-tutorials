---
title: "Loyiha: Xarajatlar daftari"
description: "Tekşirilgan kiritiş, öz istisnolari, JSON ga saqlaş va yuklaş, CSV eksport, defaultdict va Counter bilan oylik hisobotlar, byudjet ogohlantirişlari va testlarga ega buyruqlar qatori xarajatlar hisobçisini yarating."
---

# Loyiha: Xarajatlar daftari

![Rasm: Loyiha: Xarajatlar daftari](/images/topics-webp-uzb/expense-tracker.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Kiçik funksiyalar va öz istisnongiz yordamida foydalanuvçi kiritişini qanday tekşiriş
- Maʼlumotlarni JSON ga qanday saqlaş, qayta yuklaş va yöq yoki buzilgan fayldan qanday omon çiqiş
- Xuddi şu maʼlumotlarni jadval dasturi uçun CSV ga qanday eksport qiliş
- `defaultdict` va `Counter` bilan pulni oylar va toifalar böyiça qanday jamlaş
- Menyuli dasturni kodning köp qismi sof va testlaş mumkin bölgan tarzda qanday tuziş
:::

## Nega bu muhim

"Bu oy pulim qayerga ketdi?" Bank ilovalari bu savolga grafiklar va toifalar bilan javob beradi, lekin içkarida ular oddiy işlarni bajaradi: yozuvlarni saqlaydi, tekşiradi, guruhlaydi va jamlarni çegaralar bilan taqqoslaydi. Bu loyihada şu yadroni özingiz qurasiz.

Bu, şuningdek, maʼlumotlarni işga tuşirişlar orasida **eslab qoladigan** birinçi dasturingiz. Bu yangi turdagi muammolarni olib keladi: yöq, çala yozilgan yoki qölda tahrirlangan fayllar. Odamlar işonadigan dastur bunday holatlarda işdan çiqib, hamma narsani yöqotiş örniga ularni xotirjam boşqarişi kerak.

## Maqsad va imkoniyatlar

Xarajatlarni sömda yozib boradigan va ular haqida hisobot beradigan menyuli dastur:

```text
1) Qöşiş  2) Röyxat  3) Oylik hisobot  4) CSV eksport  0) Çiqiş
Tanlang: 3
Oy (YYYY-MM, böş = şu oy): 2026-09
2026-09 hisoboti: 3 ta xarajat, 5,320,000 söm
  ijara         3,500,000 söm
  ovqat         1,700,000 söm
  transport       120,000 söm
BYUDJETDAN OŞDI: ijara 3,500,000 / 3,000,000 söm (117%)
Oz qoldi: ovqat 1,700,000 / 2,000,000 söm (85%)
```

Imkoniyatlar:

| Imkoniyat | Foydalaniladigan vositalar |
|---|---|
| Xarajat qöşiş: summa, toifa, sana, izoh | `input()`, tekşiriş funksiyalari |
| Notöğri kiritişni aniq xabar bilan rad etiş | öz `ExpenseError` istisnomiz, `raise`, `try` / `except` |
| Barça xarajatlarni saqlaş va yuklaş | `json`, `pathlib`, `with open(...)` |
| Yöq yoki buzilgan fayldan omon çiqiş | `FileNotFoundError`, `json.JSONDecodeError`, `UnicodeDecodeError` |
| Jadval dasturiga eksport qiliş | `csv.DictWriter` |
| Toifalar böyiça oylik jamlar, eng katta toifalar | `defaultdict`, `Counter.most_common()` |
| Byudjet ogohlantirişlari | çegaralar luğati |
| Çiqquningizça işlaydigan menyu | `while True`, `break` |

## Loyihalaş

Bitta xarajat oddiy luğatdir. Sanalar ISO satrlari (`"2026-09-03"`) sifatida saqlanadi, çunki JSON da sana turi yöq, ISO satrlari esa matn sifatida ham töğri saralanadi:

```text
{"amount": 45000, "category": "ovqat", "date": "2026-09-03", "note": "Palov"}
```

Funksiyalar uç qatlamni taşkil qiladi:

```text
+------------------ menyu (foydalanuvçi bilan gaplaşadi) ----------+
| main()  add_expense()  list_expenses()  show_month()             |
+------------------------------------------------------------------+
        |                        |                        |
        v                        v                        v
+---- tekşiriş (sof) ------+ +---- hisobotlar (sof) ----+ +---- fayllar -------------+
| parse_amount(text)       | | expenses_for_month(...)  | | load_expenses(path)      |
| parse_category(text)     | | totals_by_category(...)  | | save_expenses(path, ...) |
| parse_date(text, today)  | | top_categories(...)      | | export_csv(path, ...)    |
| make_expense(...)        | | budget_warnings(...)     | |                          |
|  -> raise ExpenseError   | | format_month_report(...) | |                          |
+--------------------------+ +--------------------------+ +--------------------------+
```

Faqat yuqori qatlam `input()` va `print()` dan foydalanadi. Tekşiriş va hisobot funksiyalari qiymat olib, qiymat qaytaradi, şuning uçun ularni `assert` bilan testlaş mumkin. Hatto "bugun" ham içkarida `date.today()` ni çaqiriş örniga parametr sifatida uzatiladi, şunda testlar haqiqiy sanaga boğliq bölmaydi.

## 1-qadam: Kiritişni öz istisnomiz bilan tekşiriş

Har bir tahlilçi funksiya bitta maydonni tekşiradi va yoki toza qiymat qaytaradi, yoki `ExpenseError` ni çaqiradi. `ValueError` dan voris oliş mos keladi, çunki muammo notöğri qiymatda.

```python
from datetime import date

CATEGORIES = {"ovqat", "transport", "ijara", "kommunal", "salomatlik", "hordiq", "boşqa"}


class ExpenseError(ValueError):
    """Foydalanuvçi kiritişidan yaroqli xarajat yasab bölmaganda çaqiriladi."""


def parse_amount(text):
    cleaned = text.replace(",", "").replace(" ", "").replace("_", "")
    if not cleaned.isdecimal():
        raise ExpenseError(f"summa butun söm bölişi kerak, kiritildi: '{text}'")
    amount = int(cleaned)
    if amount == 0:
        raise ExpenseError("summa 0 dan katta bölişi kerak")
    return amount


def parse_category(text):
    category = text.strip().lower()
    if category not in CATEGORIES:
        options = ", ".join(sorted(CATEGORIES))
        raise ExpenseError(f"nomaʼlum toifa '{text}'. Tanlang: {options}")
    return category


def parse_date(text, today):
    text = text.strip()
    if not text:
        return today
    try:
        day = date.fromisoformat(text)
    except ValueError:
        raise ExpenseError(f"sana 2026-09-15 körinişida bölişi kerak, kiritildi: '{text}'") from None
    if day > today:
        raise ExpenseError("sana kelajakda bölişi mumkin emas")
    return day


def make_expense(amount, category, day, note):
    return {"amount": amount, "category": category,
            "date": day.isoformat(), "note": note.strip()}


today = date(2026, 9, 15)
print(parse_amount("1,700,000"), parse_amount("45 000"))
print(parse_category(" Ovqat "), parse_date("", today))
print(make_expense(45000, "ovqat", date(2026, 9, 3), " Döstlar bilan palov "))

for amount, category, day in [("-5", "ovqat", ""), ("0", "ovqat", ""),
                              ("9000", "qahva", ""), ("9000", "hordiq", "15.09.2026"),
                              ("9000", "hordiq", "2026-10-01")]:
    try:
        parse_amount(amount)
        parse_category(category)
        parse_date(day, today)
    except ExpenseError as error:
        print("Xato:", error)
```

```text
1700000 45000
ovqat 2026-09-15
{'amount': 45000, 'category': 'ovqat', 'date': '2026-09-03', 'note': 'Döstlar bilan palov'}
Xato: summa butun söm bölişi kerak, kiritildi: '-5'
Xato: summa 0 dan katta bölişi kerak
Xato: nomaʼlum toifa 'qahva'. Tanlang: boşqa, hordiq, ijara, kommunal, ovqat, salomatlik, transport
Xato: sana 2026-09-15 körinişida bölişi kerak, kiritildi: '15.09.2026'
Xato: sana kelajakda bölişi mumkin emas
```

Eʼtibor beriş kerak bölgan jihatlar:

- `parse_amount` `1,700,000` va `45 000` ni qabul qiladi, çunki odamlar pulni aynan şunday yozadi. U avval ajratkiçlarni olib taşlaydi, keyin `isdecimal()` ni tekşiradi, bu esa `-5`, `12.5` va böş matnni rad etadi. `isdecimal()` aynan `int()` tuşunadigan raqamlarni qabul qiladi; `isdigit()` esa `²` kabi belgilarni ham qabul qilgan bölardi va keyin `int("²")` oddiy `ValueError` bilan yiqilardi.
- `parse_date` `date.fromisoformat()` dan keladigan quyi darajadagi `ValueError` ni tuşunarli `ExpenseError` ga aylantiradi. `from None` asl xatoni traceback (xato izi) dan yaşiradi, çunki yangi xabar hamma narsani aytib turibdi.
- Pastdagi sikl bitta istisno turi nega foydali ekanini körsatadi: bitta `except ExpenseError` barça tekşiriş muammolarini uşlaydi.

## 2-qadam: JSON ni xavfsiz saqlaş va yuklaş

Yuklaş uç holatni boşqarişi kerak: fayl hali mavjud emas (birinçi işga tuşiriş), fayl joyida va fayl buzilgan.

```python
import json
from pathlib import Path


def load_expenses(path):
    """Saqlangan xarajatlarni yoki fayl yöq yo buzilgan bölsa [] ni qaytaradi."""
    try:
        with open(path, encoding="utf-8") as file:
            data = json.load(file)
    except FileNotFoundError:
        return []
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        backup = path.with_name(path.name + ".bak")
        path.replace(backup)
        print(f"Ogohlantiriş: {path} buzilgan ({error}).")
        print(f"U {backup} ga köçirildi. Böş röyxat bilan boşlaymiz.")
        return []
    if not isinstance(data, list):
        print(f"Ogohlantiriş: {path} içida röyxat yöq. Böş holda boşlaymiz.")
        return []
    return data


def save_expenses(path, expenses):
    with open(path, "w", encoding="utf-8") as file:
        json.dump(expenses, file, indent=2, ensure_ascii=False)


path = Path("expenses.json")
print("Yöq fayl:", load_expenses(path))

expenses = [
    {"amount": 45000, "category": "ovqat", "date": "2026-09-03", "note": "Palov"},
    {"amount": 3000000, "category": "ijara", "date": "2026-09-01", "note": "Kvartira"},
]
save_expenses(path, expenses)
print("Saqlaş va yuklaş töğri:", load_expenses(path) == expenses)

path.write_text('[{"amount": 45000,\n  "category": "ovqat",\n  oops', encoding="utf-8")
print("Buzilgan fayl:", load_expenses(path))
print("Hozirgi fayllar:", sorted(p.name for p in Path(".").glob("expenses*")))
```

```text
Yöq fayl: []
Saqlaş va yuklaş töğri: True
Ogohlantiriş: expenses.json buzilgan (Expecting property name enclosed in double quotes: line 3 column 3 (char 44)).
U expenses.json.bak ga köçirildi. Böş röyxat bilan boşlaymiz.
Buzilgan fayl: []
Hozirgi fayllar: ['expenses.json.bak']
```

Buzilgan fayl ustidan yozilmaydi, balki `expenses.json.bak` ga **köçiriladi**. Agar foydalanuvçi faylni qölda tahrirlab, xato qilib qöygan bölsa, uning maʼlumotlari tuzatiş uçun hali ham joyida. `JSONDecodeError` xabarida qator va ustun bor, şuning uçun u qayerga qaraş kerakligini aytadi.

Xuddi şu tarmoq `UnicodeDecodeError` ni ham uşlaydi. U fayl UTF-8 matni bölmaganda, masalan eski Windows muharriri boşqa kodirovkada saqlagan faylda sodir böladi. Bu `JSONDecodeError` emas, `ValueError`, şuning uçun kortejda u bölmasa, dastur işga tuşişdayoq yiqilgan bölardi.

`ensure_ascii=False` faylda `Toşkent - Samarqand` kabi izohlar yoki kirill matnini öqişli saqlaydi. `indent=2` esa faylni körib çiqişni osonlaştiradi.

::: info Nega `isinstance(data, list)` ni tekşiramiz?
`{"amount": 5}` kabi yaroqli JSON saqlangan fayl xatosiz yuklanadi, lekin röyxat kutadigan dasturning qolgan qismini buzadi. Yuklangan maʼlumotlarning şaklini tekşiriş ham tekşirişning bir qismidir.
:::

## 3-qadam: CSV ga eksport qiliş

JSON dastur uçun juda yaxşi. Xarajatlarini jadval dasturida oçmoqçi bölgan odamlarga esa CSV kerak:

```python
import csv
from pathlib import Path


def export_csv(path, expenses):
    with open(path, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=["date", "category", "amount", "note"])
        writer.writeheader()
        writer.writerows(sorted(expenses, key=lambda e: e["date"]))
    return len(expenses)


expenses = [
    {"amount": 45000, "category": "ovqat", "date": "2026-09-03", "note": "Palov, salat"},
    {"amount": 3000000, "category": "ijara", "date": "2026-09-01", "note": "Kvartira"},
]
count = export_csv(Path("expenses.csv"), expenses)
print(f"{count} ta xarajat eksport qilindi")
print(Path("expenses.csv").read_text(encoding="utf-8"))
```

```text
2 ta xarajat eksport qilindi
date,category,amount,note
2026-09-01,ijara,3000000,Kvartira
2026-09-03,ovqat,45000,"Palov, salat"
```

`DictWriter` luğatlarni töğridan-töğri qabul qiladi, `fieldnames` esa ustunlar tartibini belgilaydi. `Palov, salat` izohida vergul bor, şuning uçun `csv` moduli uni avtomatik ravişda qoştirnoqqa oldi. CSV fayllarni doimo `newline=""` bilan oçing, aks holda Windowsda qatorlar orasida böş qatorlar paydo bölişi mumkin.

## 4-qadam: Toifalar böyiça oylik hisobot

Uçta kiçik funksiya: bitta oyni ajratib oliş, summalarni toifalar böyiça qöşiş va ularni tartiblaş.

```python
from collections import Counter, defaultdict

expenses = [
    {"amount": 3000000, "category": "ijara", "date": "2026-08-01", "note": "Kvartira"},
    {"amount": 250000, "category": "hordiq", "date": "2026-08-20", "note": "Kino"},
    {"amount": 3000000, "category": "ijara", "date": "2026-09-01", "note": "Kvartira"},
    {"amount": 45000, "category": "ovqat", "date": "2026-09-03", "note": "Palov"},
    {"amount": 60000, "category": "transport", "date": "2026-09-04", "note": "Taksi"},
    {"amount": 1200000, "category": "ovqat", "date": "2026-09-07", "note": "Bozor"},
    {"amount": 380000, "category": "transport", "date": "2026-09-10", "note": "Samarqandga poyezd"},
]


def expenses_for_month(expenses, year, month):
    prefix = f"{year}-{month:02d}-"
    return [e for e in expenses if e["date"].startswith(prefix)]


def totals_by_category(expenses):
    totals = defaultdict(int)
    for expense in expenses:
        totals[expense["category"]] += expense["amount"]
    return dict(totals)


def top_categories(totals, n=3):
    return Counter(totals).most_common(n)


september = expenses_for_month(expenses, 2026, 9)
print("Sentyabrda", len(september), "ta xarajat")

totals = totals_by_category(september)
print(totals)
print("Jami:", f"{sum(totals.values()):,} söm")
print("Eng katta 2 ta:", top_categories(totals, n=2))
```

```text
Sentyabrda 5 ta xarajat
{'ijara': 3000000, 'ovqat': 1245000, 'transport': 440000}
Jami: 4,685,000 söm
Eng katta 2 ta: [('ijara', 3000000), ('ovqat', 1245000)]
```

- `expenses_for_month` ISO sana formatidan foydalanadi: 2026-yil sentyabrining har bir sanasi `2026-09-` bilan boşlanadi. `:02d` formati `9` ni `09` ga aylantiradi.
- `defaultdict(int)` har bir yangi toifani `0` dan boşlaydi, şuning uçun `if category not in totals` tekşiruvi kerak emas. `dict(totals)` oddiy luğat qaytaradi, u tozaroq çiqadi va taqqoslanadi.
- `Counter(totals).most_common(n)` toifalarni summa böyiça, eng kattasidan boşlab saralaydi.

## 5-qadam: Byudjet ogohlantirişlari

Byudjetlar ham şunçaki boşqa bir luğat. Funksiya xabarlarni çiqarmaydi, balki qaytaradi:

```python
BUDGETS = {"ovqat": 2_000_000, "transport": 400_000, "ijara": 3_000_000, "hordiq": 500_000}


def budget_warnings(totals, budgets):
    warnings = []
    for category, limit in sorted(budgets.items()):
        spent = totals.get(category, 0)
        percent = spent / limit * 100
        if spent > limit:
            warnings.append(f"BYUDJETDAN OŞDI: {category} {spent:,} / {limit:,} söm ({percent:.0f}%)")
        elif percent >= 80:
            warnings.append(f"Oz qoldi: {category} {spent:,} / {limit:,} söm ({percent:.0f}%)")
    return warnings


totals = {"ijara": 3000000, "ovqat": 1245000, "transport": 440000, "salomatlik": 90000}
for line in budget_warnings(totals, BUDGETS):
    print(line)

print(budget_warnings({"ovqat": 100}, BUDGETS))
```

```text
Oz qoldi: ijara 3,000,000 / 3,000,000 söm (100%)
BYUDJETDAN OŞDI: transport 440,000 / 400,000 söm (110%)
[]
```

Aynan 100% dagi ijara "oşdi" emas, "oz qoldi" hisoblanadi: tekşiruv `spent > limit`. Byudjeti yöq toifalar (`salomatlik`) eʼtiborga olinmaydi, byudjeti bor, lekin xarajati yöq toifa esa `totals.get(category, 0)` tufayli `0` deb hisoblanadi.

## 6-qadam: Menyu

Menyu funksiyalari hamma narsani boğlaydi. `add_expense` uçala tahlilçini **bitta** `try` blokiga öraydi, şuning uçun birinçi notöğri maydon jarayonni aniq xabar bilan töxtatadi:

```py
def add_expense(expenses, today):
    try:
        amount = parse_amount(input("Summa (söm): "))
        category = parse_category(input("Toifa: "))
        day = parse_date(input("Sana (YYYY-MM-DD, böş = bugun): "), today)
    except ExpenseError as error:
        print(f"  Saqlanmadi: {error}")
        return
    note = input("Izoh: ")
    expenses.append(make_expense(amount, category, day, note))
    save_expenses(DATA_FILE, expenses)
    print(f"  Saqlandi: {amount:,} söm, {category}, {day}")
```

U har bir muvaffaqiyatli qöşişdan keyin darhol saqlaydi. Dastur kutilmaganda yopilib qolsa, tasdiqlangan heç narsa yöqolmaydi.

Asosiy sikl tanlovni öqiydi va har bir variant uçun bitta funksiyani çaqiradi:

```py
def main():
    today = date.today()
    expenses = load_expenses(DATA_FILE)
    while True:
        print("\n1) Qöşiş  2) Röyxat  3) Oylik hisobot  4) CSV eksport  0) Çiqiş")
        choice = input("Tanlang: ").strip().lower()
        if choice == "1":
            add_expense(expenses, today)
        ...
        elif choice in ("0", "quit", "q"):
            break
```

`date.today()` faqat bitta joyda, `main()` ning boşida çaqiriladi va pastga uzatiladi.

## Töliq dastur

Uni `expenses.py` sifatida saqlang. U işga tuşirilgan papkada `expenses.json` va `expenses.csv` fayllarini yaratadi.

::: info Bu sahifada işga tuşiriş
Menyu siz `0` ni tanlamaguningizça `input()` ni çaqirişda davom etadi, şuning uçun "input() uçun qiymatlar" maydonidagi qatorlar `0` bilan tugaşi kerak. Ular oldinroq tugab qolsa, `input()` `EOFError: EOF when reading a line` beradi. Masalan, bitta xarajat qöşiş, uni körsatiş va çiqiş uçun quyidagi qatorlarni (har birini alohida qatorga) kiriting: `1`, `45000`, `ovqat`, `2026-09-03`, `Palov`, `2`, `0`. Dastur yozgan fayllar sahifani qayta yuklaguningizça yoki Töxtatiş tugmasini bosguningizça şu yorliqda qoladi, şuning uçun ikkinçi işga tuşiriş `Xarajatlar hisobçisi - 1 ta xarajat yuklandi` bilan boşlanadi.
:::

```python
import csv
import json
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

DATA_FILE = Path("expenses.json")
CSV_FILE = Path("expenses.csv")
CATEGORIES = {"ovqat", "transport", "ijara", "kommunal", "salomatlik", "hordiq", "boşqa"}
BUDGETS = {"ovqat": 2_000_000, "transport": 400_000, "ijara": 3_000_000, "hordiq": 500_000}


# ---------- 1-qadam: tekşiriş ----------

class ExpenseError(ValueError):
    """Foydalanuvçi kiritişidan yaroqli xarajat yasab bölmaganda çaqiriladi."""


def parse_amount(text):
    cleaned = text.replace(",", "").replace(" ", "").replace("_", "")
    if not cleaned.isdecimal():
        raise ExpenseError(f"summa butun söm bölişi kerak, kiritildi: '{text}'")
    amount = int(cleaned)
    if amount == 0:
        raise ExpenseError("summa 0 dan katta bölişi kerak")
    return amount


def parse_category(text):
    category = text.strip().lower()
    if category not in CATEGORIES:
        options = ", ".join(sorted(CATEGORIES))
        raise ExpenseError(f"nomaʼlum toifa '{text}'. Tanlang: {options}")
    return category


def parse_date(text, today):
    text = text.strip()
    if not text:
        return today
    try:
        day = date.fromisoformat(text)
    except ValueError:
        raise ExpenseError(f"sana 2026-09-15 körinişida bölişi kerak, kiritildi: '{text}'") from None
    if day > today:
        raise ExpenseError("sana kelajakda bölişi mumkin emas")
    return day


def make_expense(amount, category, day, note):
    return {"amount": amount, "category": category,
            "date": day.isoformat(), "note": note.strip()}


# ---------- 2-qadam: saqlaş va yuklaş ----------

def load_expenses(path):
    """Saqlangan xarajatlarni yoki fayl yöq yo buzilgan bölsa [] ni qaytaradi."""
    try:
        with open(path, encoding="utf-8") as file:
            data = json.load(file)
    except FileNotFoundError:
        return []
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        backup = path.with_name(path.name + ".bak")
        path.replace(backup)
        print(f"Ogohlantiriş: {path} buzilgan ({error}).")
        print(f"U {backup} ga köçirildi. Böş röyxat bilan boşlaymiz.")
        return []
    if not isinstance(data, list):
        print(f"Ogohlantiriş: {path} içida röyxat yöq. Böş holda boşlaymiz.")
        return []
    return data


def save_expenses(path, expenses):
    with open(path, "w", encoding="utf-8") as file:
        json.dump(expenses, file, indent=2, ensure_ascii=False)


# ---------- 3-qadam: CSV eksport ----------

def export_csv(path, expenses):
    with open(path, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=["date", "category", "amount", "note"])
        writer.writeheader()
        writer.writerows(sorted(expenses, key=lambda e: e["date"]))
    return len(expenses)


# ---------- 4-qadam: hisobotlar ----------

def expenses_for_month(expenses, year, month):
    prefix = f"{year}-{month:02d}-"
    return [e for e in expenses if e["date"].startswith(prefix)]


def totals_by_category(expenses):
    totals = defaultdict(int)
    for expense in expenses:
        totals[expense["category"]] += expense["amount"]
    return dict(totals)


def top_categories(totals, n=3):
    return Counter(totals).most_common(n)


# ---------- 5-qadam: byudjet ogohlantirişlari ----------

def budget_warnings(totals, budgets):
    warnings = []
    for category, limit in sorted(budgets.items()):
        spent = totals.get(category, 0)
        percent = spent / limit * 100
        if spent > limit:
            warnings.append(f"BYUDJETDAN OŞDI: {category} {spent:,} / {limit:,} söm ({percent:.0f}%)")
        elif percent >= 80:
            warnings.append(f"Oz qoldi: {category} {spent:,} / {limit:,} söm ({percent:.0f}%)")
    return warnings


def format_month_report(expenses, year, month, budgets):
    items = expenses_for_month(expenses, year, month)
    if not items:
        return f"{year}-{month:02d} da xarajatlar yöq."
    totals = totals_by_category(items)
    lines = [f"{year}-{month:02d} hisoboti: {len(items)} ta xarajat, "
             f"{sum(totals.values()):,} söm"]
    for category, amount in top_categories(totals, n=len(totals)):
        lines.append(f"  {category:<10} {amount:>12,} söm")
    lines.extend(budget_warnings(totals, budgets))
    return "\n".join(lines)


# ---------- 6-qadam: menyu ----------

def add_expense(expenses, today):
    try:
        amount = parse_amount(input("Summa (söm): "))
        category = parse_category(input("Toifa: "))
        day = parse_date(input("Sana (YYYY-MM-DD, böş = bugun): "), today)
    except ExpenseError as error:
        print(f"  Saqlanmadi: {error}")
        return
    note = input("Izoh: ")
    expenses.append(make_expense(amount, category, day, note))
    save_expenses(DATA_FILE, expenses)
    print(f"  Saqlandi: {amount:,} söm, {category}, {day}")


def list_expenses(expenses):
    if not expenses:
        print("  Hozirça xarajatlar yöq.")
    for number, e in enumerate(sorted(expenses, key=lambda e: e["date"]), start=1):
        print(f"  {number:>2}. {e['date']}  {e['category']:<10} {e['amount']:>10,} söm  {e['note']}")


def show_month(expenses, today):
    text = input("Oy (YYYY-MM, böş = şu oy): ").strip()
    try:
        if text:
            year_text, month_text = text.split("-")
            year, month = int(year_text), int(month_text)
            if not 1 <= month <= 12:
                raise ValueError
        else:
            year, month = today.year, today.month
    except ValueError:
        print(f"  '{text}' 2026-09 kabi oy emas.")
        return
    print(format_month_report(expenses, year, month, BUDGETS))


def main():
    today = date.today()
    expenses = load_expenses(DATA_FILE)
    print(f"Xarajatlar hisobçisi - {len(expenses)} ta xarajat yuklandi")
    while True:
        print("\n1) Qöşiş  2) Röyxat  3) Oylik hisobot  4) CSV eksport  0) Çiqiş")
        choice = input("Tanlang: ").strip().lower()
        if choice == "1":
            add_expense(expenses, today)
        elif choice == "2":
            list_expenses(expenses)
        elif choice == "3":
            show_month(expenses, today)
        elif choice == "4":
            count = export_csv(CSV_FILE, expenses)
            print(f"  {count} ta xarajat {CSV_FILE} ga eksport qilindi")
        elif choice in ("0", "quit", "q"):
            print("Xayr!")
            break
        else:
            print("  Iltimos, 0-4 dan birini tanlang.")


if __name__ == "__main__":
    main()
```

Haqiqiy seans: uçta yaroqli xarajat, ikkita rad etilgan xarajat, röyxat, hisobot va eksport.

```text
Xarajatlar hisobçisi - 0 ta xarajat yuklandi

1) Qöşiş  2) Röyxat  3) Oylik hisobot  4) CSV eksport  0) Çiqiş
Tanlang: 1
Summa (söm): 3 500 000
Toifa: ijara
Sana (YYYY-MM-DD, böş = bugun): 2026-09-01
Izoh: Çilonzordagi kvartira
  Saqlandi: 3,500,000 söm, ijara, 2026-09-01

1) Qöşiş  2) Röyxat  3) Oylik hisobot  4) CSV eksport  0) Çiqiş
Tanlang: 1
Summa (söm): 1,700,000
Toifa: Ovqat
Sana (YYYY-MM-DD, böş = bugun): 2026-09-10
Izoh: Korzinka va bozor
  Saqlandi: 1,700,000 söm, ovqat, 2026-09-10

1) Qöşiş  2) Röyxat  3) Oylik hisobot  4) CSV eksport  0) Çiqiş
Tanlang: 1
Summa (söm): abc
  Saqlanmadi: summa butun söm bölişi kerak, kiritildi: 'abc'

1) Qöşiş  2) Röyxat  3) Oylik hisobot  4) CSV eksport  0) Çiqiş
Tanlang: 1
Summa (söm): 120000
Toifa: transport
Sana (YYYY-MM-DD, böş = bugun): 2026-09-12
Izoh: Metro va taksi
  Saqlandi: 120,000 söm, transport, 2026-09-12

1) Qöşiş  2) Röyxat  3) Oylik hisobot  4) CSV eksport  0) Çiqiş
Tanlang: 1
Summa (söm): 85000
Toifa: qahva
  Saqlanmadi: nomaʼlum toifa 'qahva'. Tanlang: boşqa, hordiq, ijara, kommunal, ovqat, salomatlik, transport

1) Qöşiş  2) Röyxat  3) Oylik hisobot  4) CSV eksport  0) Çiqiş
Tanlang: 2
   1. 2026-09-01  ijara       3,500,000 söm  Çilonzordagi kvartira
   2. 2026-09-10  ovqat       1,700,000 söm  Korzinka va bozor
   3. 2026-09-12  transport     120,000 söm  Metro va taksi

1) Qöşiş  2) Röyxat  3) Oylik hisobot  4) CSV eksport  0) Çiqiş
Tanlang: 3
Oy (YYYY-MM, böş = şu oy): 2026-09
2026-09 hisoboti: 3 ta xarajat, 5,320,000 söm
  ijara         3,500,000 söm
  ovqat         1,700,000 söm
  transport       120,000 söm
BYUDJETDAN OŞDI: ijara 3,500,000 / 3,000,000 söm (117%)
Oz qoldi: ovqat 1,700,000 / 2,000,000 söm (85%)

1) Qöşiş  2) Röyxat  3) Oylik hisobot  4) CSV eksport  0) Çiqiş
Tanlang: 4
  3 ta xarajat expenses.csv ga eksport qilindi

1) Qöşiş  2) Röyxat  3) Oylik hisobot  4) CSV eksport  0) Çiqiş
Tanlang: 0
Xayr!
```

Dasturni qayta işga tuşirsangiz, birinçi qatorda `Xarajatlar hisobçisi - 3 ta xarajat yuklandi` yoziladi, çunki har bir qöşiş `expenses.json` ga saqlangan.

Eʼtibor bering:

- `Ovqat` `ovqat` sifatida saqlandi: `parse_category` harflar registrini bir xil qiladi.
- `abc` summada, `qahva` esa toifada töxtadi. Izoh söralmadi va heç narsa saqlanmadi.
- `show_month` da `2026-13` kabi oy uçun `raise ValueError` muvaffaqiyatsiz `int()` yoki `split()` bilan bir xil `except` tarmoğini işlatadi, şuning uçun barça notöğri oy kiritişlari bitta xabar oladi.

## Sof funksiyalarni testlaş

Tekşiriş va hisobot funksiyalari heç qaçon fayllar yoki klaviaturaga tegmaydi, şuning uçun ularni testlaş oson. Yordamçi funksiya `ExpenseError` çaqirişini tekşiradi:

```python
from collections import Counter, defaultdict
from datetime import date

CATEGORIES = {"ovqat", "transport", "ijara", "kommunal", "salomatlik", "hordiq", "boşqa"}


class ExpenseError(ValueError):
    pass


def parse_amount(text):
    cleaned = text.replace(",", "").replace(" ", "").replace("_", "")
    if not cleaned.isdecimal():
        raise ExpenseError(f"summa butun söm bölişi kerak, kiritildi: '{text}'")
    amount = int(cleaned)
    if amount == 0:
        raise ExpenseError("summa 0 dan katta bölişi kerak")
    return amount


def parse_date(text, today):
    text = text.strip()
    if not text:
        return today
    try:
        day = date.fromisoformat(text)
    except ValueError:
        raise ExpenseError(f"sana 2026-09-15 körinişida bölişi kerak, kiritildi: '{text}'") from None
    if day > today:
        raise ExpenseError("sana kelajakda bölişi mumkin emas")
    return day


def expenses_for_month(expenses, year, month):
    prefix = f"{year}-{month:02d}-"
    return [e for e in expenses if e["date"].startswith(prefix)]


def totals_by_category(expenses):
    totals = defaultdict(int)
    for expense in expenses:
        totals[expense["category"]] += expense["amount"]
    return dict(totals)


def top_categories(totals, n=3):
    return Counter(totals).most_common(n)


def budget_warnings(totals, budgets):
    warnings = []
    for category, limit in sorted(budgets.items()):
        spent = totals.get(category, 0)
        percent = spent / limit * 100
        if spent > limit:
            warnings.append(f"BYUDJETDAN OŞDI: {category} {spent:,} / {limit:,} söm ({percent:.0f}%)")
        elif percent >= 80:
            warnings.append(f"Oz qoldi: {category} {spent:,} / {limit:,} söm ({percent:.0f}%)")
    return warnings


def raises_expense_error(func, *args):
    try:
        func(*args)
    except ExpenseError:
        return True
    return False


def test_parse_amount():
    assert parse_amount("45000") == 45000
    assert parse_amount("1,700,000") == 1700000
    assert parse_amount(" 3 500 000 ") == 3500000
    for bad in ["", "abc", "-5", "12.5", "0"]:
        assert raises_expense_error(parse_amount, bad), bad

def test_parse_date():
    today = date(2026, 9, 15)
    assert parse_date("", today) == today
    assert parse_date("2026-09-01", today) == date(2026, 9, 1)
    assert raises_expense_error(parse_date, "2026-02-30", today)
    assert raises_expense_error(parse_date, "2026-09-16", today)

def test_expenses_for_month():
    data = [{"date": "2026-09-30"}, {"date": "2026-10-01"}, {"date": "2025-09-05"}]
    assert expenses_for_month(data, 2026, 9) == [{"date": "2026-09-30"}]
    assert expenses_for_month([], 2026, 9) == []

def test_totals_and_top():
    data = [{"category": "ovqat", "amount": 100},
            {"category": "ijara", "amount": 500},
            {"category": "ovqat", "amount": 50}]
    totals = totals_by_category(data)
    assert totals == {"ovqat": 150, "ijara": 500}
    assert top_categories(totals, n=1) == [("ijara", 500)]

def test_budget_warnings():
    budgets = {"ovqat": 1000}
    assert budget_warnings({"ovqat": 799}, budgets) == []
    assert budget_warnings({"ovqat": 800}, budgets)[0].startswith("Oz qoldi")
    assert budget_warnings({"ovqat": 1001}, budgets)[0].startswith("BYUDJETDAN OŞDI")
    assert budget_warnings({}, budgets) == []


tests = [test_parse_amount, test_parse_date, test_expenses_for_month,
         test_totals_and_top, test_budget_warnings]
for test in tests:
    test()
    print("ötdi:", test.__name__)
```

```text
ötdi: test_parse_amount
ötdi: test_parse_date
ötdi: test_expenses_for_month
ötdi: test_totals_and_top
ötdi: test_budget_warnings
```

Testlar çegaralarni ataylab tekşiradi: 80% ogohlantiriş uçun `799` va `800`, oy filtri uçun `2026-09-30` va `2026-10-01` hamda mavjud bölmagan `2026-02-30` sanasi. `today` ni parametr sifatida uzatiş `test_parse_date` yilning istalgan kunida işlaşini taʼminlaydi.

## Özingiz sinab köring

Ixçam, xotirada işlaydigan versiya: **input() uçun qiymatlar** maydoniga har bir qatorga bittadan `45000 ovqat` kabi qatorlar yozing va `tayyor` bilan tugating. Keyin hisobotga "eng katta toifa" qatorini qöşing.

<ClientOnly><PythonPlayground :code='"from collections import defaultdict\n\nBUDGETS = {\"ovqat\": 2000000, \"transport\": 400000, \"hordiq\": 500000}\nexpenses = []\n\nprint(\"Xarajatlarni şunday kiriting: 45000 ovqat   (tugatiş uçun tayyor deb yozing)\")\nwhile True:\n    line = input(\"> \").strip().lower()\n    if line in (\"tayyor\", \"done\", \"quit\", \"\"):\n        break\n    parts = line.split()\n    if len(parts) != 2 or not parts[0].isdecimal():\n        print(\"  Iltimos, summa va toifani yozing, masalan: 45000 ovqat\")\n        continue\n    expenses.append({\"amount\": int(parts[0]), \"category\": parts[1]})\n\ntotals = defaultdict(int)\nfor e in expenses:\n    totals[e[\"category\"]] += e[\"amount\"]\n\nprint(f\"\\n{len(expenses)} ta xarajat, jami {sum(totals.values()):,} söm\")\nfor category, amount in sorted(totals.items(), key=lambda item: item[1], reverse=True):\n    print(f\"  {category:<10} {amount:>12,} söm\")\n    limit = BUDGETS.get(category)\n    if limit and amount > limit:\n        print(f\"  ^ {limit:,} söm byudjetdan oşdi!\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Böş yoki buzilgan JSON faylni `try` siz yuklaş

```py
import json
from pathlib import Path

Path("expenses.json").write_text("", encoding="utf-8")   # böş, buzilgan fayl
with open("expenses.json", encoding="utf-8") as file:
    expenses = json.load(file)
```

```text
json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
```

Xato xabari 1-qator, 1-ustunda qiymat kutilganini aytadi. Böş fayl yaroqli JSON emas. Bu siz öylagandan köproq uçraydi, masalan dastur yoziş paytida işdan çiqqanda. **Tuzatiş:** `json.JSONDecodeError` ni (va `FileNotFoundError` ni) uşlang, buzilgan faylning zaxira nusxasini saqlang va böş röyxat bilan boşlang.

### 2. JSON ga `date` obyektlarini joylaş

```py
import json
from datetime import date

expense_date = date(2026, 9, 3)
text = json.dumps(expense_date)
```

```text
TypeError: Object of type date is not JSON serializable
```

JSON faqat satrlar, sonlar, mantiqiy qiymatlar, `null`, röyxatlar va obyektlarni biladi. **Tuzatiş:** `day.isoformat()` ni saqlang va haqiqiy sana kerak bölganda `date.fromisoformat()` bilan qayta özgartiring.

### 3. CSV dan öqilgan sonlarni qöşiş

```py
import csv
from pathlib import Path

Path("expenses.csv").write_text("date,category,amount\n2026-09-03,ovqat,45000\n", encoding="utf-8")
total = 0
with open("expenses.csv", newline="", encoding="utf-8") as file:
    for row in csv.DictReader(file):
        total += row["amount"]
```

```text
TypeError: unsupported operand type(s) for +=: 'int' and 'str'
```

`csv.DictReader` dan kelgan har bir qiymat satr, hatto `45000` ham. **Tuzatiş:** `int(row["amount"])` bilan özgartiring va uni boşqa har qanday foydalanuvçi kiritişi kabi tekşiring, çunki CSV faylni qölda tahrirlaş mumkin.

### 4. Hamma narsani uşlaş

```py
try:
    amount = parse_amount(input("Summa: "))
except Exception:            # Yomon: öz xatolaringizni ham yaşiradi
    print("Notöğri summa")
```

```text
Notöğri summa
```

Agar `parse_amount` da `cleaned.isdecimall()` kabi yozuv xatosi bölsa, bu kod har qanday kiritiş uçun, hatto `45000` uçun ham "Notöğri summa" ni çiqaradi va siz haqiqiy `AttributeError` ni heç qaçon körmaysiz. **Tuzatiş:** özingiz kutgan aniq istisnoni, bu yerda `ExpenseError` ni uşlang.

## Qöşimça topşiriqlar

Maslahatlarni oçişdan oldin har birini özingiz sinab köring.

### 1. Xarajatni öçiriş <Difficulty level="2" />

`5) Öçiriş` menyu bandini qöşing: raqamlangan röyxatni körsating, raqam sörang, tasdiqlatib oling, şu xarajatni olib taşlang va saqlang.

::: details Maslahatlar
- **Saralangan** röyxatni `list_expenses` dagidek raqamlang va aynan şu luğatni `expenses.remove(item)` bilan olib taşlang.
- Raqamni `isdecimal()` va oraliq tekşiruvi bilan tekşiring.
:::

### 2. CSV dan import qiliş <Difficulty level="1" />

`expenses.csv` ni öqib, uning qatorlarini qöşadigan `6) CSV import` bandini qöşing. Yaroqsiz qatorlarni qator raqami körsatilgan xabar bilan ötkazib yuboring.

::: details Maslahatlar
- Har bir qator uçun `try` / `except ExpenseError` içida `parse_amount`, `parse_category` va `parse_date` ni qayta işlating.
- `enumerate(reader, start=2)` fayldagi raqamlarga mos qator raqamlarini beradi (1-qator sarlavha).
:::

### 3. Byudjetlar faylda <Difficulty level="2" />

`BUDGETS` ni `budgets.json` ga köçiring va toifa uçun byudjet belgilaydigan menyu bandini qöşing.

::: details Maslahatlar
- `load_expenses` dagi kabi yöq/buzilgan faylni boşqaradigan, lekin luğat kutadigan `load_budgets(path)` ni yozing.
- Yangi çegarani `parse_amount` bilan, toifani esa `parse_category` bilan tekşiring.
:::

### 4. Ikki oyni taqqoslaş <Difficulty level="2" />

Har bir toifa uçun şu oyni ötgan oy bilan yonma-yon, farqi bilan körsating, masalan `ovqat  1,245,000  980,000  +265,000`.

::: details Maslahatlar
- Ötgan oyni oddiy arifmetika bilan toping: agar `month == 1` bölsa, bu `year - 1` yilning dekabri.
- Toifa nomlarini töplamlar birlaşmasi bilan birlaştiring: `set(this_totals) | set(last_totals)`.
- Işorani `f"{diff:+,}"` bilan formatlang.
:::

### 5. Xavfsiz saqlaş <Difficulty level="3" />

Agar dastur `json.dump` örtasida işdan çiqsa, fayl çala yozilgan holda qoladi. Saqlaşni xavfsiz qiling: avval `expenses.json.tmp` ga yozing, keyin haqiqiy faylni bir qadamda almaştiring. Muvaffaqiyatsiz saqlaş eski faylni butun qoldirişini isbotlaydigan test qöşing.

::: details Maslahatlar
- `Path.replace(target)` faylni bitta amalda boşqa fayl ustiga qayta nomlaydi.
- Testda nosozlikni taqlid qiliş uçun JSON işlay olmaydigan maʼlumotni (masalan, `date`) saqlaşga urinib köring va `TypeError` ni uşlang.
- Muvaffaqiyatsiz saqlaşdan keyin asl faylni yuklang va unda eski xarajatlar hali ham borligini `assert` bilan tekşiring.
:::

## Xulosa

- Kiritişni qayta işlaşni toza qiymat qaytaradigan yoki bitta öz istisnongizni çaqiradigan kiçik tahlilçilarga böling, şunda bitta `except` barça tekşiriş muammolarini uşlaydi.
- Sanalarni JSON da ISO satrlari sifatida saqlang va `isoformat()` hamda `date.fromisoformat()` bilan özgartiring.
- Yuklaş yöq fayldan (`FileNotFoundError`) va buzilgan fayldan (`json.JSONDecodeError` yoki `UnicodeDecodeError`) omon çiqişi kerak. Maʼlumotlarni jimgina yöq qiliş örniga zaxira nusxa saqlang.
- `csv.DictWriter` luğatlarni töğridan-töğri eksport qiladi. CSV dan qayta öqilgan qiymatlar doimo satr böladi.
- `defaultdict(int)` toifalar böyiça jamlaydi, `Counter.most_common()` esa natijalarni tartiblaydi.
- Hisob-kitoblarni sof saqlang (`today` kabi narsalarni parametr qilib uzating), `input()`, `print()` va fayllarni yupqa taşqi qatlamda saqlang va çegaralarni testlang.

## Qöşimça manbalar

- [`json` - JSON encoder and decoder](https://docs.python.org/3/library/json.html)
- [`csv.DictWriter`](https://docs.python.org/3/library/csv.html#csv.DictWriter)
- [`collections.defaultdict` and `Counter`](https://docs.python.org/3/library/collections.html)
- [Python tutorial: user-defined exceptions](https://docs.python.org/3/tutorial/errors.html#user-defined-exceptions)
