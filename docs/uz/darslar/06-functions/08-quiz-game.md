---
title: "Loyiha: Viktorina öyini"
description: "Luğatlar röyxati, kiçik funksiyalar, aralaştiriş, mavzular böyiça ball hisoblaş, baholar, xato javoblarni körib çiqiş va assert testlari yordamida bir neça variantli viktorina öyinini bosqiçma-bosqiç yarating."
---

# Loyiha: Viktorina öyini

![Rasm: Loyiha: Viktorina öyini](/images/topics-webp-uzb/quiz-game.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Dastur maʼlumotlarini `if` buyruqlariga qattiq yozib qöyiş örniga luğatlar röyxatida qanday saqlaş
- Dasturni har biri bitta aniq vazifaga ega kiçik funksiyalarga qanday böliş
- **Sof** funksiyalarni (test qiliş oson) `input()` va `print()` işlatadigan funksiyalardan qanday ajratiş
- Asl maʼlumotlarni özgartirmasdan qanday aralaştiriş va natijalarni mavzular böyiça qanday baholaş
- Mantiqni oddiy `assert` testlari bilan qanday tekşiriş
:::

## Nega bu muhim

Har bir savol uçun bittadan, ön ta `if` buyruği bilan viktorina yozayotganingizni tasavvur qiling. Savol qöşiş kodni nusxalaşni, ball hisoblaşni özgartiriş esa ön joyni tahrirlaşni anglatadi. Haqiqiy dasturlar buning aksini qiladi: **maʼlumotlar** (savollar) bitta tuzilmada saqlanadi, bir neça **funksiya** esa bu maʼlumotlarning istalgan miqdori bilan işlaydi.

Bu loyiha oxirgi ikki modulning hammasidan foydalanadi: röyxatlar, luğatlar, töplamlar, comprehension ifodalari hamda parametrli va qiymat qaytaradigan funksiyalar. Bu haydovçilik nazariyasi testi, maktab imtihoni ilovasi yoki til örganiş ilovasi bilan bir xil dizayn: savollar kiradi, natijalar çiqadi.

## Maqsad va imkoniyatlar

Dastur bir neça variantli savollarni tasodifiy tartibda beradi, javoblarni tekşiradi va quyidagiga öxşaş hisobot çiqaradi:

```text
=== Natijalar ===
Ball: 6/9 (66.7%)  Baho: C

Mavzular böyiça:
  Geografiya 3/3  100.0%
  Matematika 1/3   33.3%
  Python     2/3   66.7%

Xatolaringizni körib çiqing:
  - 2 ** 10 nimaga teng?
    Siz tanladingiz: 512. Töğri javob: 1024.
```

Imkoniyatlar:

| Imkoniyat | Foydalanadigan vositalaringiz |
|---|---|
| Variantlar, javob va mavzuga ega savollar | luğatlar röyxati |
| Savolni A-D variantlari bilan körsatiş | `zip()`, `str.join()` |
| `b`, ` B ` yoki `E` kabi javoblarni tekşiriş | satr metodlari, `while` sikli |
| Savollar va variantlarning tasodifiy tartibi | `random.sample()` |
| Mavzular böyiça ball | luğatlardan iborat luğat, `setdefault()` |
| Foiz va baho | kiçik sof funksiyalar |
| Xato javoblarni körib çiqiş | röyxat comprehension ifodasi |
| Mantiqni tekşiriş | `assert` testlari |

## Dizayn

Har bir funksiyaning bitta vazifasi bor. Ularning köpçiligi **sof**: heç narsa söramasdan yoki çop etmasdan maʼlumot oladi va natija qaytaradi. Faqat uçta funksiya öyinçi bilan muloqot qiladi.

```text
QUESTIONS (luğatlar röyxati)
     |
     v
run_quiz(questions)                      öyinçi bilan muloqot qiladi
     |
     +-- shuffled(items)                  -> tasodifiy tartibdagi yangi röyxat
     |
     +-- har bir savol uçun:
     |     ask_question(...)              öyinçi bilan muloqot qiladi
     |       +-- format_question(...)     -> str         (sof)
     |       +-- letter_to_option(...)    -> variant/None (sof)
     |     check_answer(question, chosen) -> bool        (sof)
     |     results.append({...})
     |
     v
show_results(results)                    hisobotni çop etadi
     +-- score_by_topic(results)          -> dict        (sof)
     +-- percentage(correct, total)       -> float       (sof)
     +-- grade(percent)                   -> str         (sof)
```

`results` röyxati savol beriş va hisobot çiqariş orasidagi köprik. Uning har bir elementi savolni, mavzuni, öyinçi nimani tanlaganini, töğri javobni va javob töğri bölgan-bölmaganini eslab qoladigan luğat.

## 1-qadam: Savollarni maʼlumot sifatida saqlaş

Har bir savolda bir xil tört kalit bor. Aynan şu bir xil şakl bitta funksiyaga ularning hammasi bilan işlaş imkonini beradi:

```python
QUESTIONS = [
    {"question": "Özbekistonning poytaxti qaysi şahar?",
     "options": ["Samarqand", "Toşkent", "Buxoro", "Xiva"],
     "answer": "Toşkent", "topic": "Geografiya"},
    {"question": "Qaysi tur özgarmas?",
     "options": ["list", "dict", "set", "tuple"],
     "answer": "tuple", "topic": "Python"},
    {"question": "2 ** 10 nimaga teng?",
     "options": ["20", "100", "512", "1024"],
     "answer": "1024", "topic": "Matematika"},
]

print("Savollar:", len(QUESTIONS))
print("Mavzular:", sorted({q["topic"] for q in QUESTIONS}))
print("Birinçi savol:", QUESTIONS[0]["question"])
print("Uning variantlari:", QUESTIONS[0]["options"])

# har bir javob öz variantlaridan biri bölişi şart
print("Barça javoblar töğri:", all(q["answer"] in q["options"] for q in QUESTIONS))
```

```text
Savollar: 3
Mavzular: ['Geografiya', 'Matematika', 'Python']
Birinçi savol: Özbekistonning poytaxti qaysi şahar?
Uning variantlari: ['Samarqand', 'Toşkent', 'Buxoro', 'Xiva']
Barça javoblar töğri: True
```

`{q["topic"] for q in QUESTIONS}` töplam comprehension ifodasi har bir mavzuni bir martadan yiğadi. Oxirgi qator - tezkor **maʼlumot tekşiruvi**: `"answer": "Toşknet"` kabi imlo xatosi savolga töğri javob beriş imkonsiz qilib qöyadi, `all()` esa buni viktorina boşlanişidan oldin aniqlaydi.

## 2-qadam: Savolni körsatiş

`format_question` satrni çop etiş örniga uni **qaytaradi**. Bu uni test qiliş va qayta işlatişni osonlaştiradi (masalan, keyinçalik viktorinani faylga saqlaş uçun).

```python
LETTERS = "ABCD"

def format_question(number, total, question, options):
    """Savol va uning harflangan variantlarini bitta satr qilib qaytaradi."""
    lines = [f"{number}/{total}-savol [{question['topic']}]",
             question["question"]]
    for letter, option in zip(LETTERS, options):
        lines.append(f"  {letter}) {option}")
    return "\n".join(lines)

question = {"question": "Özbekistonning poytaxti qaysi şahar?",
            "options": ["Samarqand", "Toşkent", "Buxoro", "Xiva"],
            "answer": "Toşkent", "topic": "Geografiya"}

text = format_question(1, 9, question, question["options"])
print(text)
```

```text
1/9-savol [Geografiya]
Özbekistonning poytaxti qaysi şahar?
  A) Samarqand
  B) Toşkent
  C) Buxoro
  D) Xiva
```

`zip(LETTERS, options)` `"A"` ni birinçi variant bilan, `"B"` ni ikkinçisi bilan va hokazo juftlaydi. Variantlar luğatdan öqilmaydi, balki **alohida parametr** sifatida uzatiladi, çunki 5-qadamda ularni aralaştirilgan tartibda körsatasiz.

## 3-qadam: Harfni javobga aylantiriş va tekşiriş

Öyinçi harf kiritadi, lekin javob matn sifatida saqlanadi. Bitta funksiya tarjima qiladi, boşqasi taqqoslaydi:

```python
LETTERS = "ABCD"

def letter_to_option(letter, options):
    """'b' yoki 'B' ni mos variantga, notöğri bölsa None ga aylantiradi."""
    letter = letter.strip().upper()
    if len(letter) != 1 or letter not in LETTERS[:len(options)]:
        return None
    return options[LETTERS.index(letter)]

def check_answer(question, chosen):
    return chosen == question["answer"]

question = {"question": "Özbekistonning poytaxti qaysi şahar?",
            "options": ["Samarqand", "Toşkent", "Buxoro", "Xiva"],
            "answer": "Toşkent", "topic": "Geografiya"}
options = question["options"]

for reply in ["B", " b ", "A", "E", "AB", ""]:
    label = '"' + reply + '"'
    chosen = letter_to_option(reply, options)
    if chosen is None:
        print(f"{label:6} -> notöğri")
    else:
        print(f"{label:6} -> {chosen:<10} töğri: {check_answer(question, chosen)}")
```

```text
"B"    -> Toşkent    töğri: True
" b "  -> Toşkent    töğri: True
"A"    -> Samarqand  töğri: False
"E"    -> notöğri
"AB"   -> notöğri
""     -> notöğri
```

Nega `len(letter) != 1` ni tekşiramiz? Çunki `"" in "ABCD"` `True` qaytaradi: böş satr har qanday satrning içida bor. Bu tekşiruvsiz Enter tugmasini bosiş jimgina A variantini tanlab qöyardi. `LETTERS[:len(options)]` esa funksiyani faqat ikki yoki uç variantli savollar uçun ham işlaydigan qiladi.

`letter_to_option` notöğri har qanday qiymat uçun `None` qaytaradi. Maxsus "natija yöq" qiymatini qaytariş - *Qaytariladigan qiymatlar* darsida tanişgan keng tarqalgan andoza.

## 4-qadam: Öyinçidan söraş

Endi `input()` işlatadigan birinçi funksiya. U savolni körsatadi va töğri harf yoki `quit` olmaguniça söraşda davom etadi:

```python
LETTERS = "ABCD"

def format_question(number, total, question, options):
    lines = [f"{number}/{total}-savol [{question['topic']}]",
             question["question"]]
    for letter, option in zip(LETTERS, options):
        lines.append(f"  {letter}) {option}")
    return "\n".join(lines)

def letter_to_option(letter, options):
    letter = letter.strip().upper()
    if len(letter) != 1 or letter not in LETTERS[:len(options)]:
        return None
    return options[LETTERS.index(letter)]

def ask_question(number, total, question, options):
    """Öyinçi töğri harf kiritgunça söraydi. Variantni yoki çiqiş uçun None ni qaytaradi."""
    print(format_question(number, total, question, options))
    while True:
        reply = input("Javobingiz (A-D yoki quit): ").strip()
        if reply.lower() == "quit":
            return None
        chosen = letter_to_option(reply, options)
        if chosen is not None:
            return chosen
        print("  Iltimos, A, B, C yoki D ni kiriting.")

question = {"question": "Qaysi tur özgarmas?",
            "options": ["list", "dict", "set", "tuple"],
            "answer": "tuple", "topic": "Python"}

chosen = ask_question(1, 1, question, question["options"])
print("Qaytarildi:", chosen)
```

```text
1/1-savol [Python]
Qaysi tur özgarmas?
  A) list
  B) dict
  C) set
  D) tuple
Javobingiz (A-D yoki quit): x
  Iltimos, A, B, C yoki D ni kiriting.
Javobingiz (A-D yoki quit): D
Qaytarildi: tuple
```

Sikl içidagi `return` ham siklni, ham funksiyani tugatadi. Bu funksiyada mantiq qançalik kamligiga eʼtibor bering: formatlaş va tekşiriş 2- va 3-qadamlardagi sof funksiyalarga topşirilgan.

## 5-qadam: Maʼlumotni özgartirmasdan aralaştiriş

`random.shuffle(items)` röyxatni **joyida** aralaştiradi va `None` qaytaradi. Bu global `QUESTIONS` röyxatining tartibini özgartirib yuborardi - bu siz xohlamaydigan qöşimça taʼsir. `random.sample(items, len(items))` esa aralaştirilgan **yangi** röyxat qaytaradi. (`random` modulini *math, random va statistics* darsida batafsil örganasiz.)

```python
import random

random.seed(3)

def shuffled(items):
    """Tasodifiy tartibdagi yangi röyxat qaytaradi. Asl röyxat özgarmaydi."""
    return random.sample(items, len(items))

options = ["Samarqand", "Toşkent", "Buxoro", "Xiva"]
print(shuffled(options))
print(shuffled(options))
print("Asl röyxat:", options)
```

```text
['Toşkent', 'Buxoro', 'Samarqand', 'Xiva']
['Xiva', 'Buxoro', 'Samarqand', 'Toşkent']
Asl röyxat: ['Samarqand', 'Toşkent', 'Buxoro', 'Xiva']
```

`random.seed(3)` tartibni takrorlanadigan qiladi, şuning uçun bu darsdagi natijalar haqiqiy. Öz viktorinangizda uni öçirib taşlang, şunda har bir öyin boşqaça böladi.

## 6-qadam: Mavzular böyiça ball, foiz va baho

Viktorinadan keyin `results` har bir javob uçun bitta luğatni saqlaydi. `score_by_topic` ularni guruhlaydi:

```python
def score_by_topic(results):
    """{topic: {"correct": n, "total": n}} qaytaradi."""
    scores = {}
    for result in results:
        topic_score = scores.setdefault(result["topic"], {"correct": 0, "total": 0})
        topic_score["total"] += 1
        if result["correct"]:
            topic_score["correct"] += 1
    return scores

def percentage(correct, total):
    if total == 0:
        return 0.0
    return round(correct / total * 100, 1)

def grade(percent):
    if percent >= 90:
        return "A"
    if percent >= 75:
        return "B"
    if percent >= 60:
        return "C"
    if percent >= 40:
        return "D"
    return "F"

results = [
    {"topic": "Geografiya", "correct": True},
    {"topic": "Python", "correct": True},
    {"topic": "Matematika", "correct": False},
    {"topic": "Python", "correct": False},
    {"topic": "Geografiya", "correct": True},
]

print(score_by_topic(results))

correct = sum(1 for r in results if r["correct"])
percent = percentage(correct, len(results))
print(f"{correct}/{len(results)} = {percent}% -> baho {grade(percent)}")
print(percentage(0, 0), grade(100), grade(59.9))
```

```text
{'Geografiya': {'correct': 2, 'total': 2}, 'Python': {'correct': 1, 'total': 2}, 'Matematika': {'correct': 0, 'total': 1}}
3/5 = 60.0% -> baho C
0.0 A D
```

`scores.setdefault(topic, {"correct": 0, "total": 0})` mavjud içki luğatni qaytaradi yoki mavzu birinçi marta uçraganda uni yaratadi. Luğatlar özgaruvçan bölgani uçun `topic_score["total"] += 1` `scores` içida saqlangan luğatni yangilaydi.

`percentage` nolga bölişdan himoya qiladi, bu öyinçi heç bir savolga javob bermasdan çiqib ketsa sodir böladi. `grade` avval eng yuqori çegarani tekşiradi va har bir `return` funksiyani tugatadi, şuning uçun `elif` kerak emas.

## 7-qadam: Xato javoblarni körib çiqiş

Röyxat comprehension ifodasi xatolarni tanlab oladi, sikl esa ularni çop etadi:

```python
results = [
    {"question": "2 ** 10 nimaga teng?", "topic": "Matematika",
     "chosen": "512", "answer": "1024", "correct": False},
    {"question": "Qaysi tur özgarmas?", "topic": "Python",
     "chosen": "tuple", "answer": "tuple", "correct": True},
    {"question": "17 // 5 nimaga teng?", "topic": "Matematika",
     "chosen": "3.4", "answer": "3", "correct": False},
]

wrong = [r for r in results if not r["correct"]]
print(f"Xatolaringizni körib çiqing ({len(wrong)}):")
for r in wrong:
    print(f"  - {r['question']}")
    print(f"    Siz tanladingiz: {r['chosen']}. Töğri javob: {r['answer']}.")
```

```text
Xatolaringizni körib çiqing (2):
  - 2 ** 10 nimaga teng?
    Siz tanladingiz: 512. Töğri javob: 1024.
  - 17 // 5 nimaga teng?
    Siz tanladingiz: 3.4. Töğri javob: 3.
```

Bunday körib çiqişni har bir natijada `chosen` va `answer` ni saqlaş imkonli qiladi. Natijalar tuzilmasini loyihalayotganda hisobotga nima kerak bölişini öylang.

## Töliq dastur

Mana hammasi bitta faylda. Uni `quiz.py` ga nusxalang va işga tuşiring.

```python
import random

random.seed(3)  # test paytida har safar bir xil tartib; haqiqiy viktorinada bu qatorni öçiring

# ---------- 1-qadam: savollar ----------

QUESTIONS = [
    {"question": "Özbekistonning poytaxti qaysi şahar?",
     "options": ["Samarqand", "Toşkent", "Buxoro", "Xiva"],
     "answer": "Toşkent", "topic": "Geografiya"},
    {"question": "Qaysi şahar Registon maydoni bilan maşhur?",
     "options": ["Samarqand", "Namangan", "Nukus", "Termiz"],
     "answer": "Samarqand", "topic": "Geografiya"},
    {"question": "Özbekiston va Qozoğiston qaysi dengizni bölişadi?",
     "options": ["Qora dengiz", "Kaspiy dengizi", "Orol dengizi", "Qizil dengiz"],
     "answer": "Orol dengizi", "topic": "Geografiya"},
    {"question": "len([3, 1, 2]) nimani qaytaradi?",
     "options": ["2", "3", "6", "[1, 2, 3]"],
     "answer": "3", "topic": "Python"},
    {"question": "Qaysi tur özgarmas?",
     "options": ["list", "dict", "set", "tuple"],
     "answer": "tuple", "topic": "Python"},
    {"question": "return buyruği bölmagan funksiya nimani qaytaradi?",
     "options": ["0", "None", "False", "böş satr"],
     "answer": "None", "topic": "Python"},
    {"question": "80,000 sömning 15% i qança?",
     "options": ["8,000 söm", "12,000 söm", "15,000 söm", "1,200 söm"],
     "answer": "12,000 söm", "topic": "Matematika"},
    {"question": "2 ** 10 nimaga teng?",
     "options": ["20", "100", "512", "1024"],
     "answer": "1024", "topic": "Matematika"},
    {"question": "17 // 5 nimaga teng?",
     "options": ["3", "3.4", "2", "4"],
     "answer": "3", "topic": "Matematika"},
]

LETTERS = "ABCD"


# ---------- 2-qadam: savolni körsatiş ----------

def format_question(number, total, question, options):
    """Savol va uning harflangan variantlarini bitta satr qilib qaytaradi."""
    lines = [f"{number}/{total}-savol [{question['topic']}]",
             question["question"]]
    for letter, option in zip(LETTERS, options):
        lines.append(f"  {letter}) {option}")
    return "\n".join(lines)


# ---------- 3-qadam: javobni tekşiriş ----------

def letter_to_option(letter, options):
    """'b' yoki 'B' ni mos variantga, notöğri bölsa None ga aylantiradi."""
    letter = letter.strip().upper()
    if len(letter) != 1 or letter not in LETTERS[:len(options)]:
        return None
    return options[LETTERS.index(letter)]


def check_answer(question, chosen):
    return chosen == question["answer"]


# ---------- 4-qadam: öyinçidan söraş ----------

def ask_question(number, total, question, options):
    """Öyinçi töğri harf kiritgunça söraydi. Variantni yoki çiqiş uçun None ni qaytaradi."""
    print(format_question(number, total, question, options))
    while True:
        reply = input("Javobingiz (A-D yoki quit): ").strip()
        if reply.lower() == "quit":
            return None
        chosen = letter_to_option(reply, options)
        if chosen is not None:
            return chosen
        print("  Iltimos, A, B, C yoki D ni kiriting.")


# ---------- 5-qadam: aralaştiriş ----------

def shuffled(items):
    """Tasodifiy tartibdagi yangi röyxat qaytaradi. Asl röyxat özgarmaydi."""
    return random.sample(items, len(items))


# ---------- 6-qadam: ball hisoblaş ----------

def score_by_topic(results):
    """{topic: {"correct": n, "total": n}} qaytaradi."""
    scores = {}
    for result in results:
        topic_score = scores.setdefault(result["topic"], {"correct": 0, "total": 0})
        topic_score["total"] += 1
        if result["correct"]:
            topic_score["correct"] += 1
    return scores


def percentage(correct, total):
    if total == 0:
        return 0.0
    return round(correct / total * 100, 1)


def grade(percent):
    if percent >= 90:
        return "A"
    if percent >= 75:
        return "B"
    if percent >= 60:
        return "C"
    if percent >= 40:
        return "D"
    return "F"


# ---------- 7-qadam: natijalar va xatolarni körib çiqiş ----------

def show_results(results):
    if not results:
        print("\nHec bir savolga javob berilmadi.")
        return
    correct = sum(1 for r in results if r["correct"])
    total = len(results)
    percent = percentage(correct, total)
    print("\n=== Natijalar ===")
    print(f"Ball: {correct}/{total} ({percent}%)  Baho: {grade(percent)}")

    print("\nMavzular böyiça:")
    for topic, s in sorted(score_by_topic(results).items()):
        topic_percent = percentage(s["correct"], s["total"])
        print(f"  {topic:<10} {s['correct']}/{s['total']}  {topic_percent:>5}%")

    wrong = [r for r in results if not r["correct"]]
    if wrong:
        print("\nXatolaringizni körib çiqing:")
        for r in wrong:
            print(f"  - {r['question']}")
            print(f"    Siz tanladingiz: {r['chosen']}. Töğri javob: {r['answer']}.")
    else:
        print("\nMukammal natija. Barakalla!")


def run_quiz(questions):
    results = []
    order = shuffled(questions)
    for number, question in enumerate(order, start=1):
        options = shuffled(question["options"])
        print()
        chosen = ask_question(number, len(order), question, options)
        if chosen is None:
            print("Viktorina muddatidan oldin toxtatildi.")
            break
        is_correct = check_answer(question, chosen)
        print("  Töğri!" if is_correct else f"  Notöğri. Töğri javob: {question['answer']}.")
        results.append({
            "question": question["question"],
            "topic": question["topic"],
            "chosen": chosen,
            "answer": question["answer"],
            "correct": is_correct,
        })
    show_results(results)


print("=== Özbekiston va Python viktorinasi ===")
run_quiz(QUESTIONS)
```

Haqiqiy seans. Öyinçi bir marta notöğri harf kiritadi va uçta xato qiladi:

```text
=== Özbekiston va Python viktorinasi ===

1/9-savol [Python]
len([3, 1, 2]) nimani qaytaradi?
  A) 6
  B) [1, 2, 3]
  C) 2
  D) 3
Javobingiz (A-D yoki quit): D
  Töğri!

2/9-savol [Geografiya]
Özbekiston va Qozoğiston qaysi dengizni bölişadi?
  A) Qizil dengiz
  B) Orol dengizi
  C) Kaspiy dengizi
  D) Qora dengiz
Javobingiz (A-D yoki quit): e
  Iltimos, A, B, C yoki D ni kiriting.
Javobingiz (A-D yoki quit): B
  Töğri!

3/9-savol [Matematika]
2 ** 10 nimaga teng?
  A) 100
  B) 20
  C) 512
  D) 1024
Javobingiz (A-D yoki quit): C
  Notöğri. Töğri javob: 1024.

4/9-savol [Python]
Qaysi tur özgarmas?
  A) list
  B) set
  C) tuple
  D) dict
Javobingiz (A-D yoki quit): C
  Töğri!

5/9-savol [Matematika]
17 // 5 nimaga teng?
  A) 3
  B) 3.4
  C) 4
  D) 2
Javobingiz (A-D yoki quit): B
  Notöğri. Töğri javob: 3.

6/9-savol [Geografiya]
Özbekistonning poytaxti qaysi şahar?
  A) Xiva
  B) Buxoro
  C) Toşkent
  D) Samarqand
Javobingiz (A-D yoki quit): C
  Töğri!

7/9-savol [Matematika]
80,000 sömning 15% i qança?
  A) 1,200 söm
  B) 15,000 söm
  C) 12,000 söm
  D) 8,000 söm
Javobingiz (A-D yoki quit): C
  Töğri!

8/9-savol [Python]
return buyruği bölmagan funksiya nimani qaytaradi?
  A) False
  B) 0
  C) böş satr
  D) None
Javobingiz (A-D yoki quit): B
  Notöğri. Töğri javob: None.

9/9-savol [Geografiya]
Qaysi şahar Registon maydoni bilan maşhur?
  A) Termiz
  B) Samarqand
  C) Namangan
  D) Nukus
Javobingiz (A-D yoki quit): B
  Töğri!

=== Natijalar ===
Ball: 6/9 (66.7%)  Baho: C

Mavzular böyiça:
  Geografiya 3/3  100.0%
  Matematika 1/3   33.3%
  Python     2/3   66.7%

Xatolaringizni körib çiqing:
  - 2 ** 10 nimaga teng?
    Siz tanladingiz: 512. Töğri javob: 1024.
  - 17 // 5 nimaga teng?
    Siz tanladingiz: 3.4. Töğri javob: 3.
  - return buyruği bölmagan funksiya nimani qaytaradi?
    Siz tanladingiz: 0. Töğri javob: None.
```

Natijani tahlil qilamiz:

- `e` rad etildi va 2-savol heç narsa hisoblanmasdan qayta berildi.
- 9 tadan 6 ta töğri javob - 66.7%, bu kamida 60, şuning uçun baho C.
- Hisobotda har bir mavzu nomi böyiça saralangan holda çiqadi, çunki `.items()` ga qöllangan `sorted()` kalit böyiça saralaydi.
- Körib çiqiş röyxatida `correct` qiymati `False` bölgan aynan uçta `results` elementi bor.

## Sof funksiyalarni test qiliş

Sof funksiyalarni test qiliş oson: ularni maʼlum kiritiş bilan çaqiring va natijani `assert` bilan tekşiring. Haqiqiy loyihada bu testlarni alohida faylda saqlaysiz. Bu yerda blok mustaqil işlaşi uçun funksiyalar takrorlangan:

```python
LETTERS = "ABCD"

def letter_to_option(letter, options):
    letter = letter.strip().upper()
    if len(letter) != 1 or letter not in LETTERS[:len(options)]:
        return None
    return options[LETTERS.index(letter)]

def check_answer(question, chosen):
    return chosen == question["answer"]

def score_by_topic(results):
    scores = {}
    for result in results:
        topic_score = scores.setdefault(result["topic"], {"correct": 0, "total": 0})
        topic_score["total"] += 1
        if result["correct"]:
            topic_score["correct"] += 1
    return scores

def percentage(correct, total):
    if total == 0:
        return 0.0
    return round(correct / total * 100, 1)

def grade(percent):
    if percent >= 90:
        return "A"
    if percent >= 75:
        return "B"
    if percent >= 60:
        return "C"
    if percent >= 40:
        return "D"
    return "F"


def test_letter_to_option():
    options = ["list", "dict", "set", "tuple"]
    assert letter_to_option("A", options) == "list"
    assert letter_to_option(" d ", options) == "tuple"
    assert letter_to_option("E", options) is None
    assert letter_to_option("", options) is None
    assert letter_to_option("AB", options) is None
    assert letter_to_option("C", ["ha", "yöq"]) is None   # faqat A va B mavjud

def test_check_answer():
    question = {"answer": "tuple"}
    assert check_answer(question, "tuple")
    assert not check_answer(question, "list")

def test_score_by_topic():
    results = [
        {"topic": "Matematika", "correct": True},
        {"topic": "Matematika", "correct": False},
        {"topic": "Python", "correct": True},
    ]
    assert score_by_topic(results) == {
        "Matematika": {"correct": 1, "total": 2},
        "Python": {"correct": 1, "total": 1},
    }
    assert score_by_topic([]) == {}

def test_percentage():
    assert percentage(3, 4) == 75.0
    assert percentage(2, 3) == 66.7
    assert percentage(0, 0) == 0.0

def test_grade_boundaries():
    assert grade(100) == "A"
    assert grade(90) == "A"
    assert grade(89.9) == "B"
    assert grade(60) == "C"
    assert grade(40) == "D"
    assert grade(0) == "F"


tests = [test_letter_to_option, test_check_answer, test_score_by_topic,
         test_percentage, test_grade_boundaries]
for test in tests:
    test()
    print("ötdi:", test.__name__)
```

```text
ötdi: test_letter_to_option
ötdi: test_check_answer
ötdi: test_score_by_topic
ötdi: test_percentage
ötdi: test_grade_boundaries
```

Funksiyalar qiymat bölgani uçun sikl röyxatdagi har bir testni çaqira oladi. Har bir funksiya öz nomini ham biladi: `test.__name__` bu siz `def` dan keyin yozgan matn, şuning uçun har bir qator qaysi test ötganini körsatadi.

Yaxşi testlar oddiy holatlarni, **çegaraviy holatlarni (edge cases)** (böş kiritiş, `0 / 0`) va **çegaralarni** qamrab oladi: `grade(90)` va `grade(89.9)` A aynan qayerda B ga aylanişini tekşiradi. Agar keyinroq çegarani adaşib özgartirib qöysangiz, test darhol muvaffaqiyatsiz böladi.

## Özingiz sinab köring

Uç savoldan iborat va har işga tuşganda tartibi tasodifiy bölgan ixçam viktorina. Javoblaringizni (A, B, C yoki D) **Values for input()** maydoniga har birini alohida qatorga yozing. Keyin röyxatga öz savolingizni qöşing.

<ClientOnly><PythonPlayground :code='"import random\n\nQUESTIONS = [\n    {\"question\": \"Özbekistonning poytaxti qaysi şahar?\",\n     \"options\": [\"Samarqand\", \"Toşkent\", \"Buxoro\", \"Xiva\"], \"answer\": \"Toşkent\"},\n    {\"question\": \"Qaysi tur özgarmas?\",\n     \"options\": [\"list\", \"dict\", \"set\", \"tuple\"], \"answer\": \"tuple\"},\n    {\"question\": \"17 // 5 nimaga teng?\",\n     \"options\": [\"3\", \"3.4\", \"2\", \"4\"], \"answer\": \"3\"},\n]\nLETTERS = \"ABCD\"\n\n\ndef letter_to_option(letter, options):\n    letter = letter.strip().upper()\n    if len(letter) != 1 or letter not in LETTERS:\n        return None\n    return options[LETTERS.index(letter)]\n\n\ndef ask(question, options):\n    print(question[\"question\"])\n    for letter, option in zip(LETTERS, options):\n        print(f\"  {letter}) {option}\")\n    while True:\n        chosen = letter_to_option(input(\"Javob: \"), options)\n        if chosen is not None:\n            return chosen\n        print(\"  Iltimos, A, B, C yoki D ni kiriting.\")\n\n\nscore = 0\nfor q in random.sample(QUESTIONS, len(QUESTIONS)):\n    chosen = ask(q, random.sample(q[\"options\"], len(q[\"options\"])))\n    if chosen == q[\"answer\"]:\n        score += 1\n        print(\"  Töğri!\")\n    else:\n        print(\"  Notöğri. Töğri javob:\", q[\"answer\"])\n\nprint(f\"Ball: {score}/{len(QUESTIONS)}\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `random.shuffle()` natijasidan foydalaniş

```py
import random
questions = ["q1", "q2", "q3"]
order = random.shuffle(questions)
for question in order:
    print(question)
```

```text
TypeError: 'NoneType' object is not iterable
```

`shuffle()` röyxatni joyida özgartiradi va `None` qaytaradi, `None` ni esa sikl bilan aylanib çiqib bölmaydi. **Tuzatiş:** `order = random.sample(questions, len(questions))` dan foydalaning - u yangi röyxat qaytaradi va aslini özgartirmaydi.

### 2. Harfni javob bilan taqqoslaş

```python
question = {"options": ["Samarqand", "Toşkent"], "answer": "Toşkent"}
reply = "B"

print(reply == question["answer"])                     # Yomon: "B" va "Toşkent"
print(question["options"][1] == question["answer"])    # Yaxşi: variant matnini taqqoslaymiz
```

```text
False
True
```

Öyinçi heç qaçon ball ololmaydi. **Tuzatiş:** avval harfni variantga aylantiring (`letter_to_option`), keyin matnni matn bilan taqqoslang.

### 3. Böş javobni qabul qiliş

```python
LETTERS = "ABCD"
reply = ""                   # öyinçi şunçaki Enter ni bosdi

print(reply in LETTERS)      # Yomon: töğriga öxşaydi
print(LETTERS.index(reply))  # va jimgina A variantini bildiradi
```

```text
True
0
```

**Tuzatiş:** `letter in LETTERS` bilan birga `len(letter) == 1` ni ham tekşiring va `""` uçun test qöşing.

### 4. Heç kim javob bermaganda nolga böliş

```py
results = []                 # öyinçi birinçi savoldayoq quit deb yozdi
correct = sum(1 for r in results if r["correct"])
percent = correct / len(results) * 100
```

```text
ZeroDivisionError: division by zero
```

**Tuzatiş:** bölişni himoya qiling (`if total == 0: return 0.0`) va hisobotni çop etişdan oldin böş `results` röyxatini alohida hal qiling.

## Qöşimça topşiriqlar

Maslahatlarni oçişdan oldin har birini özingiz bajarib köring.

### 1. Köproq savol va yangi mavzu <Difficulty level="1" />

*Tarix* haqida uçta savol qöşing (masalan, Amir Temur yoki Buyuk Ipak yöli haqida). Hisobot boşqa heç qanday kod özgarişisiz yangi mavzuni körsatişi kerak.

::: details Maslahatlar
- Faqat `QUESTIONS` özgarişi kerak. Agar funksiyani tahrirlaşga töğri kelgan bölsa, dizayn maʼlumotlarga yetarliça asoslanmagan.
- Savollarni qöşgandan keyin 1-qadamdagi `all(q["answer"] in q["options"] ...)` tekşiruvini işga tuşiring.
:::

### 2. Savollar sonini tanlaş <Difficulty level="1" />

Öyinçidan neça savol xohlayotganini (1 dan mavjud savollar sonigaça) sörang va faqat şunça savol bering.

::: details Maslahatlar
- `random.sample(questions, k)` `k` ta tasodifiy element qaytaradi, şuning uçun `shuffled` `count` parametrini qabul qilişi mumkin.
- Sonni özgartirişdan oldin uni `isdigit()` va oraliq tekşiruvi bilan tekşiring.
:::

### 3. Mavzuni tanlaş <Difficulty level="2" />

Viktorina boşlanişidan oldin mavjud mavzularni körsating va öyinçiga ulardan birini yoki `all` ni tanlaş imkonini bering.

::: details Maslahatlar
- Menyuni `sorted({q["topic"] for q in QUESTIONS})` dan tuzing, şunda yangi mavzular avtomatik paydo böladi.
- Comprehension ifodasi yordamida yangi röyxat qaytaradigan sof `filter_by_topic(questions, topic)` funksiyasini yozing va uni `assert` bilan test qiling.
:::

### 4. Har bir savol uçun ball <Difficulty level="2" />

Har bir savolga `"points"` kalitini bering (qiyinligiga qarab 1 dan 3 gaça). Natijani mumkin bölgan ballardan töplangan ballar sifatida, mavzular böyiça ham körsating.

::: details Maslahatlar
- `points` ni har bir natija luğatida saqlang.
- `score_by_topic` ni `1` örniga `points` qöşadigan qilib özgartiring. Avval uning testini, keyin funksiyaning özini yangilang.
- Bu kalitga ega bölmagan eski savollar ham işlayverişi uçun `q.get("points", 1)` dan foydalaning.
:::

### 5. Xatolarni qayta işlaş <Difficulty level="3" />

Hisobotdan keyin faqat öyinçi xato javob bergan savollarni takrorlaşni taklif qiling va hammasi töğri bölgunça yoki öyinçi `quit` deb yozgunça davom eting. Oxirida bu neça raund davom etganini körsating.

::: details Maslahatlar
- `run_quiz` hisobotni çop etiş bilan birga `results` röyxatini ham **qaytarsin**.
- Keyingi raundni comprehension ifodasi bilan tuzing: natijasi xato bölgan asl savol luğatlari. Buni osonlaştiriş uçun har bir natijada butun savolni saqlang.
- `while wrong_questions:` sikli bilan aylaning va raundlarni sanang.
:::

## Xulosa

- Maʼlumotlarni (savollarni) mantiqdan (funksiyalardan) alohida saqlang. Bir xil kalitlarga ega luğatlardan iborat bitta röyxat butun dasturni boşqara oladi.
- Har bir funksiyaga bitta vazifa bering. `format_question`, `letter_to_option`, `check_answer`, `score_by_topic`, `percentage` va `grade` - sof funksiyalar.
- `input()` va `print()` ni bir neça taşqi funksiyada saqlang, şunda qolganini `assert` bilan test qiliş mumkin böladi.
- `random.sample(items, len(items))` aralaştirilgan nusxani qaytaradi. `random.shuffle()` esa röyxatni özgartiradi va `None` qaytaradi.
- `setdefault()` mavzular böyiça töğri va jami javoblar kabi içma-iç hisoblagiçlarni quradi.
- Çegaraviy holatlardan (böş javob, böş natijalar röyxati) himoyalaning va çegaralarni, masalan bir baho boşqasiga aylanadigan aniq foizni, test qiling.

## Qöşimça manbalar

- [`random.sample` and `random.shuffle`](https://docs.python.org/3/library/random.html#random.sample)
- [Dictionaries and `setdefault()`](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict)
- [Python tutorial: defining functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)
- [The `assert` statement](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)
