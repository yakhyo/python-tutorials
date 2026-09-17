---
title: "Loyiha: Sonni topiş öyini"
description: "Tasodifiy sonlar, maslahatlar, kiritişni tekşiriş, çeklangan urinişlar, qiyinlik darajalari, qayta öynaş sikli va eng yaxşi natijaga ega töliq son topiş öyinini yarating."
---

# Loyiha: Sonni topiş öyini

![Rasm: Loyiha: Sonni topiş öyini](/images/topics-webp-uzb/number-guessing-game.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Kod yozişdan oldin kiçik dasturni qanday rejalaştiriş
- `while` sikllari, `if`/`elif`/`else`, `match`, `break` va `continue` ni bitta dasturda qanday birlaştiriş
- Bitta xato harf öyinni töxtatmasligi uçun öyinçi kiritgan qiymatni `isdecimal()` bilan tekşiriş
- Raundlar davomida holatni kuzatib boriş: urinişlar, ğalabalar va eng yaxşi natija
- Bayroq özgaruvçisi yordamida içma-iç sikllardan toza çiqiş
:::

## Nega bu muhim

Siz endi özgaruvçilar, satrlar, kiritiş, şartlar va sikllarni bilasiz. Har bir dars bittadan vositani körsatdi. Haqiqiy dastur esa ularning hammasini birga işlatadi va yangi qiyinçilik - **qaysi sikl qayerda turişi** va **qaysi özgaruvçilar raundlar orasida saqlanib qolişi kerakligini** hal qiliş.

Son topiş öyini - klassik birinçi loyiha, çunki u kiçik, lekin töliq: öyinçi bilan muloqot qiladi, xatolarga javob beradi, hisobni yuritadi va toza yakunlanadi. Keyinçalik yozadigan har bir interaktiv dasturingiz, bankomat menyusidan tortib çat-botgaça, xuddi şu şaklga ega böladi.

## Maqsad va imkoniyatlar

Kompyuter maxfiy son tanlaydi. Öyinçi taxmin qiladi, kompyuter esa öyinçi sonni topgunça yoki urinişlari tugagunça "juda katta" yoki "juda kiçik" deb javob beradi. Tugagan seans taxminan şunday körinadi:

```text
Taxmin 1/7: 50
  Juda katta!
Taxmin 2/7: 25
  Juda kiçik!
Taxmin 3/7: abc
  Bu butun son emas. Qaytadan urinib köring.
...
Taxmin 7/7: 42
Töğri! Son 42 edi. Sizga 7 ta uriniş kerak böldi.
Yangi rekord!
Yana öynaysizmi? (h/y):
```

Imkoniyatlar:

| Imkoniyat | Işlatiladigan vositalar |
|---|---|
| Tasodifiy maxfiy son | `random.randint()` |
| "Juda katta" / "Juda kiçik" maslahatlari | `if` / `elif` / `else` |
| Urinişlarni sanaş va çeklaş | `while`, hisoblagiç özgaruvçi |
| `abc` yoki `-5` kabi notöğri kiritişni rad etiş | `strip()`, `isdecimal()`, `continue` |
| Qiyinlik darajalari (oraliq va urinişlar) | "yoki" andozali `match` |
| Qayta öynaş, eng yaxşi natija va yakuniy xulosa | taşqi `while` sikli, `break` |
| Istalgan sörovda `quit` deb yoziş | bayroq özgaruvçisi |

## Loyihalaş

Kod yozişdan oldin jarayon çizmasini çizing. Öyinda **ikkita sikl** bor: raundlar uçun taşqi sikl va bitta raund içidagi taxminlar uçun içki sikl.

```text
boşlaniş: rounds_played = 0, wins = 0, best_score = None, playing = True
  |
  v
TAŞQI SIKL (bitta raund) - playing rost ekan takrorlanadi
  |
  +-- qiyinlikni söraş ------- notöğri javob? -> xabar, qayta söraş
  +-- max_number, max_attempts ni belgilaş
  +-- maxfiy son tanlaş, attempts = 0, won = False
  |
  +-- IÇKI SIKL (bitta taxmin) - attempts < max_attempts ekan takrorlanadi
  |     |
  |     +-- "quit"?                  -> playing = False, ikkala sikldan çiqiş
  |     +-- son emas / juda katta?   -> xabar, qayta söraş (uriniş sarflanmaydi)
  |     +-- attempts += 1
  |     +-- juda kiçik / juda katta? -> maslahat, keyingi taxmin
  |     +-- töğri?                   -> won = True, içki sikldan çiqiş
  |
  +-- natijani körsatiş, wins va best_score ni yangilaş
  +-- "Yana öynaysizmi?" ------- h emas? -> playing = False
  |
  v
xulosani çop etiş
```

Özgaruvçilar ikki guruhga bölinadi va ularni ajratib turiş - asosiy loyihaviy qaror:

| Butun seans davomida yaşaydi | Har bir raund boşida qayta tiklanadi |
|---|---|
| `rounds_played`, `wins`, `best_score`, `playing` | `secret`, `attempts`, `won`, `max_number`, `max_attempts` |

Seans özgaruvçilari taşqi sikldan **oldin** yaratiladi. Raund özgaruvçilari esa uning **içida** belgilanadi.

## 1-qadam: Maxfiy son tanlaş

Pythonda **standart kutubxona (standard library)** deb ataladigan tayyor vositalar töplami bor. `random` moduli tasodifiy sonlarni tanlay oladi. Modullar haqida *Modullar va import* darsida batafsil örganasiz. Hozirça fayl boşidagi bitta qator kifoya: `import random`.

```python
import random

random.seed(7)

secret = random.randint(1, 100)
print(f"Maxfiy son: {secret}")

dice = random.randint(1, 6)
print(f"Zar tuşdi: {dice}")
```

```text
Maxfiy son: 42
Zar tuşdi: 2
```

`random.randint(a, b)` `a` dan `b` gaça butun son qaytaradi va **ikkala çegara ham kiradi**, şuning uçun `randint(1, 100)` 1 yoki 100 ni ham qaytarişi mumkin.

Odatda har bir öyinda boşqa son kerak. Lekin dasturni yaratib, sinab köryotganingizda özgarib turadigan son noqulay: xatoni takrorlay olmaysiz. `random.seed(7)` "tasodifiy" sonlarni har bir işga tuşirişda bir xil qiladi. Bu darsda seed işlatilgan, şuning uçun bu yerda körgan natijalaringiz haqiqiy va takrorlanadigan. Rostakamiga öynamoqçi bölsangiz, `seed` qatorini öçirib taşlang.

## 2-qadam: Maslahat va tekşiruvli bitta taxmin

Öyinçi `abc` deb yozsa, `int(input())` xato bilan töxtaydi. Avval matnni `isdecimal()` bilan tekşiring: u faqat satr böş bölmasa va har bir belgisi önlik raqam (`int()` özgartira oladigan belgi) bölsa `True` qaytaradi:

```python
print("42".isdecimal())
print("abc".isdecimal())
print("-5".isdecimal())
print("4.5".isdecimal())
print("".isdecimal())
print(" 42".isdecimal(), " 42".strip().isdecimal())
```

```text
True
False
False
False
False
False True
```

`"-5"` va `"4.5"` rad etilganiga eʼtibor bering. Bu öyin uçun muammo emas, çunki maxfiy son heç qaçon manfiy yoki önlik bölmaydi. Tasodifiy böşliq töğri javobni buzmasligi uçun doim avval `strip()` qiling.

`isdigit()` metodini ham uçratişingiz mumkin. U öxşaş körinadi, lekin `²` kabi belgilarni ham qabul qiladi, `int("²")` esa `ValueError` beradi. `int()` dan oldingi xavfsiz tekşiruv - `isdecimal()`.

Endi bitta töliq taxmin:

```python
secret = 42

text = input("1 dan 100 gaça son öylang: ").strip()

if not text.isdecimal():
    print("Bu butun son emas.")
else:
    guess = int(text)
    if guess < 1 or guess > 100:
        print("Iltimos, 1 va 100 oralişida qoling.")
    elif guess < secret:
        print("Juda kiçik!")
    elif guess > secret:
        print("Juda katta!")
    else:
        print("Töğri!")
```

Ikki marta işga tuşiriş: avval `abc`, keyin `70` kiritildi:

```text
1 dan 100 gaça son öylang: abc
Bu butun son emas.
1 dan 100 gaça son öylang: 70
Juda katta!
```

Tekşiruvlar tartibi muhim. Avval "umuman sonmi?", keyin "oraliqdami?" va faqat şundan keyin maxfiy son bilan taqqoslaş. `else` içida `int(text)` xavfsiz, çunki `isdecimal()` allaqaçon "ha" degan.

## 3-qadam: Uriniş hisoblagiçi va çegarali sikl

Bitta taxmin - bu hali öyin emas. Uni urinişlarni sanaydigan va çegarada töxtaydigan `while` sikliga öraymiz:

```python
secret = 42
max_attempts = 5
attempts = 0

while attempts < max_attempts:
    text = input(f"Taxmin {attempts + 1}/{max_attempts}: ").strip()
    if not text.isdecimal():
        print("  Bu butun son emas. Qaytadan urinib köring.")
        continue

    guess = int(text)
    attempts += 1
    if guess < secret:
        print("  Juda kiçik!")
    elif guess > secret:
        print("  Juda katta!")
    else:
        print(f"Töğri! Sizga {attempts} ta uriniş kerak böldi.")
        break
else:
    print(f"Urinişlar tugadi. Son {secret} edi.")
```

Yutuq bilan tugagan öyin:

```text
Taxmin 1/5: 50
  Juda katta!
Taxmin 2/5: 30
  Juda kiçik!
Taxmin 3/5: salom
  Bu butun son emas. Qaytadan urinib köring.
Taxmin 3/5: 45
  Juda katta!
Taxmin 4/5: 42
Töğri! Sizga 4 ta uriniş kerak böldi.
```

Yutqaziş bilan tugagan öyin:

```text
Taxmin 1/5: 10
  Juda kiçik!
Taxmin 2/5: 20
  Juda kiçik!
Taxmin 3/5: 30
  Juda kiçik!
Taxmin 4/5: 40
  Juda kiçik!
Taxmin 5/5: 50
  Juda katta!
Urinişlar tugadi. Son 42 edi.
```

Uçta tafsilotga eʼtibor bering:

- `continue` sikl tanasining qolgan qismini ötkazib yuboradi, şuning uçun `salom` **urinişni sarflamaydi**. Hisoblagiç faqat kiritiş tekşiruvdan ötgandan keyin oşadi.
- `break` öyinçi yutişi bilanoq sikldan çiqadi.
- `while` siklining `else` bloki faqat sikl `break` **siz** tugaganda bajariladi, bu yerda bu "öyinçining urinişlari tugadi" degani. Bu bilan *break, continue va else* darsida tanişgansiz.

## 4-qadam: `match` bilan qiyinlik darajalari

Har bir qiyinlik ikki qiymatni belgilaydi: oraliq kattaligi va urinişlar soni. `match` buni ixçam hal qiladi, `|` esa öyinçiga raqam yoki söz yoziş imkonini beradi:

```python
while True:
    print("1) Oson   2) Örta   3) Qiyin")
    choice = input("Qiyinlikni tanlang: ").strip().lower()

    match choice:
        case "1" | "oson":
            max_number = 50
            max_attempts = 10
        case "2" | "örta":
            max_number = 100
            max_attempts = 7
        case "3" | "qiyin":
            max_number = 100
            max_attempts = 5
        case _:
            print("  Iltimos, 1, 2 yoki 3 ni yozing.")
            continue
    break

print(f"Oraliq 1-{max_number}, {max_attempts} ta uriniş")
```

```text
1) Oson   2) Örta   3) Qiyin
Qiyinlikni tanlang: 5
  Iltimos, 1, 2 yoki 3 ni yozing.
1) Oson   2) Örta   3) Qiyin
Qiyinlikni tanlang: qiyin
Oraliq 1-100, 5 ta uriniş
```

Sikl öyinçi yaroqli javob bergunça davom etadi. `case _:` tarmoği qolgan hamma narsani uşlaydi va qayta söraş uçun `continue` ni işlatadi. Yaroqli `case` dan keyin kod `break` ga yetib keladi.

1-100 oralişida 7 ta uriniş bölsa, aqlli öyinçi doim yutadi: örtani (50), keyin qolgan yarmining örtasini (25 yoki 75) taxmin qiladi va hokazo. Har bir taxmin oraliqni ikki barobar qisqartiradi, 100 esa 7 qadamda 1 gaça qisqaradi. Xuddi şu oraliqda faqat 5 ta uriniş bölsa, öyinçiga biroz omad kerak. "Qiyin" darajani aynan şu qiyin qiladi.

## 5-qadam: Eng yaxşi natija va qayta öynaş

Eng yaxşi natija - yutilgan raunddagi urinişlarning **eng kiçik** soni. "Hali ğalaba yöq" degan maʼnoda `None` dan boşlang (bu *Sikllarda köp işlatiladigan usullar* darsidagi "hali topilmadi" belgisi) va hali eng yaxşi natija bölmasa yoki yangi natija yaxşiroq bölsa, uni almaştiring. Mana şu mantiqning özi, töqima natijalar bilan:

```python
results = "7 4 9 3 5"   # beşta yutilgan raundda sarflangan urinişlar

best_score = None       # hali ğalaba yöq
for word in results.split():
    attempts = int(word)
    if best_score is None or attempts < best_score:
        best_score = attempts
        print(f"{attempts} ta urinişda yutdingiz. Yangi rekord!")
    else:
        print(f"{attempts} ta urinişda yutdingiz. Eng yaxşisi hamon {best_score}.")
```

```text
7 ta urinişda yutdingiz. Yangi rekord!
4 ta urinişda yutdingiz. Yangi rekord!
9 ta urinişda yutdingiz. Eng yaxşisi hamon 4.
3 ta urinişda yutdingiz. Yangi rekord!
5 ta urinişda yutdingiz. Eng yaxşisi hamon 3.
```

`best_score is None or attempts < best_score` çapdan öngga tekşiriladi. Birinçi ğalaba doim eng yaxşi natija böladi, çunki `best_score is None` `True` böladi. Bu yerda qisqa tutaşuv ham muhim: `best_score` `None` ekan, Python `attempts < best_score` ni umuman bajarmaydi, aks holda u `TypeError` bergan bölardi.

Qayta öynaş sikli butun raundni öraydi. `h` yoki `ha` ni qabul qiling, qolgan hamma narsani "yöq" deb hisoblang:

```python
rounds = 0

while True:
    rounds += 1
    print(f"--- {rounds}-raund ---")
    print("(bu yerda bitta töliq öyin boradi)")

    again = input("Yana öynaysizmi? (h/y): ").strip().lower()
    if again != "h" and again != "ha":
        break

print(f"{rounds} raund öynaganingiz uçun rahmat!")
```

```text
--- 1-raund ---
(bu yerda bitta töliq öyin boradi)
Yana öynaysizmi? (h/y): h
--- 2-raund ---
(bu yerda bitta töliq öyin boradi)
Yana öynaysizmi? (h/y): H
--- 3-raund ---
(bu yerda bitta töliq öyin boradi)
Yana öynaysizmi? (h/y): yöq
3 raund öynaganingiz uçun rahmat!
```

`.lower()` `H` ni `h` ga aylantiradi, şuning uçun ikkalasi ham işlaydi.

## 6-qadam: Istalgan joydan çiqiş

Öyinda sikl içida sikl bor. `break` faqat **eng içki** sikldan çiqadi, şuning uçun taxmin paytida `quit` deb yoziş faqat raundni tugatib, "Yana öynaysizmi?" deb söraydi. Hammasini töxtatiş uçun taşqi sikl tekşiradigan bayroqni belgilang:

```python
playing = True

while playing:
    print("Yangi raund")
    while True:
        text = input("Taxmin: ").strip().lower()
        if text == "quit":
            playing = False
            break
        print(f"  Siz {text} ni taxmin qildingiz")

print("Xayr!")
```

```text
Yangi raund
Taxmin: 50
  Siz 50 ni taxmin qildingiz
Taxmin: 20
  Siz 20 ni taxmin qildingiz
Taxmin: quit
Xayr!
```

Yolğiz `playing = False` içki siklni darhol töxtatmaydi, yolğiz `break` esa taşqi siklni töxtatmaydi. Ikkalasi birga dasturni darhol tugatadi. Töliq öyinda içki sikldan keyin darhol yana bitta `if not playing: break` natijani va "Yana öynaysizmi?" savolini ötkazib yuboradi.

## Töliq dastur

Mana hammasi bitta faylda. Izohlar har bir qism qaysi qadamdan kelganini körsatadi. Uni `guessing_game.py` ga nusxalang va işga tuşiring.

```python
import random

random.seed(7)  # sinov paytida har safar bir xil sonlar; rostakamiga öynaş uçun bu qatorni öçiring

print("=== Son topiş öyini ===")
print("Töxtatiş uçun istalgan sörovda quit deb yozing.")

rounds_played = 0
wins = 0
best_score = None   # hali ğalaba yöq
playing = True

while playing:
    # ---------- 4-qadam: qiyinlikni tanlaş ----------
    print()
    print("Qiyinlik:  1) Oson   1-50,  10 ta uriniş")
    print("           2) Örta   1-100,  7 ta uriniş")
    print("           3) Qiyin  1-100,  5 ta uriniş")
    choice = input("1, 2 yoki 3 ni tanlang: ").strip().lower()

    match choice:
        case "1" | "oson":
            max_number = 50
            max_attempts = 10
        case "2" | "örta":
            max_number = 100
            max_attempts = 7
        case "3" | "qiyin":
            max_number = 100
            max_attempts = 5
        case "quit" | "q":
            break
        case _:
            print("  Iltimos, 1, 2, 3 yoki quit deb yozing.")
            continue

    # ---------- 1-qadam: maxfiy son tanlaş ----------
    secret = random.randint(1, max_number)
    attempts = 0
    won = False
    print(f"Men 1 dan {max_number} gaça bir son öyladim.")
    print(f"Sizda {max_attempts} ta uriniş bor. Omad!")

    # ---------- 2-3-qadamlar: taxmin sikli ----------
    while attempts < max_attempts:
        text = input(f"Taxmin {attempts + 1}/{max_attempts}: ").strip().lower()

        if text == "quit" or text == "q":
            playing = False
            break
        if not text.isdecimal():
            print("  Bu butun son emas. Qaytadan urinib köring.")
            continue

        guess = int(text)
        if guess < 1 or guess > max_number:
            print(f"  Iltimos, 1 va {max_number} oralişida qoling.")
            continue

        attempts += 1
        if guess < secret:
            print("  Juda kiçik!")
        elif guess > secret:
            print("  Juda katta!")
        else:
            won = True
            break

    if not playing:
        break

    # ---------- 5-qadam: natijalar va eng yaxşi natija ----------
    rounds_played += 1
    if won:
        wins += 1
        print(f"Töğri! Son {secret} edi. Sizga {attempts} ta uriniş kerak böldi.")
        if best_score is None or attempts < best_score:
            best_score = attempts
            print("Yangi rekord!")
    else:
        print(f"Urinişlar tugadi. Son {secret} edi.")

    # ---------- 6-qadam: yana öynaysizmi? ----------
    again = input("Yana öynaysizmi? (h/y): ").strip().lower()
    if again != "h" and again != "ha":
        playing = False

print()
print("=== Öyin tugadi ===")
print(f"Öynalgan raundlar: {rounds_played}")
print(f"Yutilgan raundlar: {wins}")
if best_score is not None:
    print(f"Eng yaxşi natija:  {best_score} ta uriniş")
else:
    print("Eng yaxşi natija:  hali ğalaba yöq")
```

Haqiqiy seans. Öyinçi örta darajani tanlaydi, 7 ta urinişda yutadi, keyin qiyin raundni öynaydi va uni 5 ta urinişda yutadi:

```text
=== Son topiş öyini ===
Töxtatiş uçun istalgan sörovda quit deb yozing.

Qiyinlik:  1) Oson   1-50,  10 ta uriniş
           2) Örta   1-100,  7 ta uriniş
           3) Qiyin  1-100,  5 ta uriniş
1, 2 yoki 3 ni tanlang: 2
Men 1 dan 100 gaça bir son öyladim.
Sizda 7 ta uriniş bor. Omad!
Taxmin 1/7: 50
  Juda katta!
Taxmin 2/7: 25
  Juda kiçik!
Taxmin 3/7: abc
  Bu butun son emas. Qaytadan urinib köring.
Taxmin 3/7: 37
  Juda kiçik!
Taxmin 4/7: 43
  Juda katta!
Taxmin 5/7: 40
  Juda kiçik!
Taxmin 6/7: 41
  Juda kiçik!
Taxmin 7/7: 42
Töğri! Son 42 edi. Sizga 7 ta uriniş kerak böldi.
Yangi rekord!
Yana öynaysizmi? (h/y): h

Qiyinlik:  1) Oson   1-50,  10 ta uriniş
           2) Örta   1-100,  7 ta uriniş
           3) Qiyin  1-100,  5 ta uriniş
1, 2 yoki 3 ni tanlang: 4
  Iltimos, 1, 2, 3 yoki quit deb yozing.

Qiyinlik:  1) Oson   1-50,  10 ta uriniş
           2) Örta   1-100,  7 ta uriniş
           3) Qiyin  1-100,  5 ta uriniş
1, 2 yoki 3 ni tanlang: 3
Men 1 dan 100 gaça bir son öyladim.
Sizda 5 ta uriniş bor. Omad!
Taxmin 1/5: 150
  Iltimos, 1 va 100 oralişida qoling.
Taxmin 1/5: 50
  Juda katta!
Taxmin 2/5: 25
  Juda katta!
Taxmin 3/5: 12
  Juda kiçik!
Taxmin 4/5: 18
  Juda kiçik!
Taxmin 5/5: 20
Töğri! Son 20 edi. Sizga 5 ta uriniş kerak böldi.
Yangi rekord!
Yana öynaysizmi? (h/y): y

=== Öyin tugadi ===
Öynalgan raundlar: 2
Yutilgan raundlar: 2
Eng yaxşi natija:  5 ta uriniş
```

Natijani qoidalar bilan soliştiring:

- `abc` va `150` rad etildi va ular urinişni sarflamadi: hisoblagiç `3/7` va `1/5` da qoldi.
- Birinçi ğalaba eng yaxşi natijani 7 ga teng qildi. Ikkinçi ğalaba atigi 5 ta uriniş oldi, şuning uçun uning örnini egalladi.
- `4` qiyinlik darajasi emas, şuning uçun menyu yana paydo böldi.
- Xulosa taşqi sikldan **taşqarida** saqlangan raundlar va ğalabalarni sanaydi, şuning uçun ular har bir raunddan keyin ham saqlanib qoldi.

## Özingiz sinab köring

Örta qiyinlikdagi bitta raunddan iborat ixçam versiya, seed yöq, şuning uçun son har safar özgaradi. Taxminlaringizni **input() uçun qiymatlar** maydoniga har bir qatorga bittadan yozing (masalan `50`, `25`, `37`). Keyin qiyinlik menyusini qöşib köring.

<ClientOnly><PythonPlayground :code='"import random\n\nsecret = random.randint(1, 100)\nmax_attempts = 7\nattempts = 0\nprint(\"Men 1 dan 100 gaça bir son öyladim.\")\n\nwhile attempts < max_attempts:\n    text = input(f\"Taxmin {attempts + 1}/{max_attempts}: \").strip().lower()\n    if text == \"quit\":\n        print(\"Xayr!\")\n        break\n    if not text.isdecimal():\n        print(\"  Iltimos, butun son yozing.\")\n        continue\n    guess = int(text)\n    attempts += 1\n    if guess < secret:\n        print(\"  Juda kiçik!\")\n    elif guess > secret:\n        print(\"  Juda katta!\")\n    else:\n        print(f\"Töğri! Sizga {attempts} ta uriniş kerak böldi.\")\n        break\nelse:\n    print(f\"Urinişlar tugadi. Son {secret} edi.\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Kiritilgan qiymatni tekşirmasdan özgartiriş

```py
text = "abc"          # öyinçi yozgan narsa
guess = int(text)
```

```text
ValueError: invalid literal for int() with base 10: 'abc'
```

Bitta xato harf - va butun öyin xato bilan töxtaydi. **Tuzatiş:** matnni `strip()` qiling, `isdecimal()` ni tekşiring va tekşiruvdan ötmasa `continue` qiling. `int()` bilan faqat tekşiruvdan keyin özgartiring.

### 2. Matnni son bilan taqqoslaş

```py
secret = 42
guess = input("Taxmin: ")      # öyinçi 50 ni yozadi, lekin guess — "50" satri
if guess < secret:
    print("Juda kiçik!")
```

```text
TypeError: '<' not supported between instances of 'str' and 'int'
```

`input()` doim satr qaytaradi. `"42" == 42` xato bermaydi, lekin doim `False` böladi, şuning uçun öyinçi heç qaçon yuta olmasdi. **Tuzatiş:** taqqoslaşdan oldin (tekşiruvdan keyin) `int()` bilan özgartiring.

### 3. Maxfiy sonni taxmin sikli içida tanlaş

```python
import random

random.seed(7)
for text in "50 50 50".split():       # uç marta bir xil taxmin
    secret = random.randint(1, 100)   # Yomon: har bir taxmindan oldin yangi maxfiy son
    guess = int(text)
    if guess < secret:
        print(f"{guess}: Juda kiçik!")
    elif guess > secret:
        print(f"{guess}: Juda katta!")
    else:
        print(f"{guess}: Töğri!")
```

```text
50: Juda katta!
50: Juda katta!
50: Juda kiçik!
```

Bir xil taxmin har xil maslahat oladi, çunki har biri yangi maxfiy songa taalluqli. **Tuzatiş:** maxfiy sonni içki sikl boşlanişidan oldin, **har bir raundda bir marta** tanlang.

### 4. Raund özgaruvçilarini qayta tiklaşni unutiş

```python
max_attempts = 3
attempts = 0          # Yomon: raundlar siklidan taşqarida bir marta belgilangan

for round_number in range(1, 3):
    print(f"{round_number}-raund")
    while attempts < max_attempts:
        attempts += 1
        print(f"  Taxmin {attempts}/{max_attempts}")
```

```text
1-raund
  Taxmin 1/3
  Taxmin 2/3
  Taxmin 3/3
2-raund
```

Ikkinçi raundda `attempts` hamon 3 ga teng, şuning uçun içki sikl umuman bajarilmaydi va öyinçi birorta ham taxmin qilmasdan yutqazadi. **Tuzatiş:** `attempts = 0` va `won = False` ni **har bir** raund boşida, taşqi sikl içida belgilang.

## Qöşimça topşiriqlar

Maslahatlarni oçişdan oldin har birini özingiz bajarib köring. 1- va 2-topşiriqlarning namunaviy yeçimi ham bor. Natija takrorlanadigan bölişi (va Tekşiriş tugmasi sizning natijangizni u bilan soliştira olişi) uçun yeçimda maxfiy son qatʼiy belgilangan, taxminlar esa `input()` örniga satrdan olinadi. Öz versiyangizni ham avval şu tarzda sinab köring, keyin töliq öyinga qöşing.

### 1. Qolgan urinişlar <Difficulty level="1" />

Har bir notöğri taxmindan keyin neçta uriniş qolganini körsating, masalan `Juda kiçik! 4 ta uriniş qoldi.`, faqat bitta qolganda esa `Juda kiçik! Oxirgi uriniş qoldi.` deb yozing.

::: details Maslahatlar
- `max_attempts - attempts` qolgan urinişlar soni.
- Xabarni şartli ifoda bilan tanlang: `note = "Oxirgi uriniş qoldi." if left == 1 else f"{left} ta uriniş qoldi."`.
- Yutuqli taxmindan keyin xabarni çop etmang.
:::

`secret = 42`, `max_attempts = 5` va `"50 25 40 41 42"` taxminlari bilan sinab köring.

::: details Yeçim
```python
secret = 42
max_attempts = 5
attempts = 0

for text in "50 25 40 41 42".split():   # öyinçining taxminlari
    guess = int(text)
    attempts += 1
    if guess == secret:
        print(f"Töğri! Sizga {attempts} ta uriniş kerak böldi.")
        break

    left = max_attempts - attempts
    note = "Oxirgi uriniş qoldi." if left == 1 else f"{left} ta uriniş qoldi."
    if guess < secret:
        print(f"Juda kiçik! {note}")
    else:
        print(f"Juda katta! {note}")
else:
    print(f"Urinişlar tugadi. Son {secret} edi.")
```

```text
Juda katta! 4 ta uriniş qoldi.
Juda kiçik! 3 ta uriniş qoldi.
Juda kiçik! 2 ta uriniş qoldi.
Juda kiçik! Oxirgi uriniş qoldi.
Töğri! Sizga 5 ta uriniş kerak böldi.
```

Öyinda `for` qatorini `while attempts < max_attempts:` sikli va `input()` bilan almaştiring.
:::

### 2. Issiq va sovuq <Difficulty level="1" />

Masofaga asoslangan ikkinçi maslahatni qöşing: taxmin maxfiy sondan 3 tagaça farq qilsa `(juda issiq)`, 10 tagaça farq qilsa `(iliq)`, aks holda `(sovuq)`.

::: details Maslahatlar
- `abs(guess - secret)` işorani öylamasdan masofani beradi.
- Avval eng kiçik masofani tekşiring: `if distance <= 3`, keyin `elif distance <= 10`.
- Xabarni f-satr bilan yasang, masalan `f"  Juda kiçik! ({heat})"`.
:::

`secret = 42` va `"70 35 45 42"` taxminlari bilan sinab köring.

::: details Yeçim
```python
secret = 42

for text in "70 35 45 42".split():   # öyinçining taxminlari
    guess = int(text)
    if guess == secret:
        print("Töğri!")
        break

    distance = abs(guess - secret)
    if distance <= 3:
        heat = "juda issiq"
    elif distance <= 10:
        heat = "iliq"
    else:
        heat = "sovuq"

    if guess < secret:
        print(f"{guess}: Juda kiçik! ({heat})")
    else:
        print(f"{guess}: Juda katta! ({heat})")
```

```text
70: Juda katta! (sovuq)
35: Juda kiçik! (iliq)
45: Juda katta! (juda issiq)
Töğri!
```
:::

### 3. Qolgan oraliqni körsatiş <Difficulty level="2" />

Hali nima mumkinligini körsatib, öyinçiga yordam bering: `50 -> juda katta` va `25 -> juda kiçik` dan keyin `Son 26 va 49 oralişida.` deb çop eting.

::: details Maslahatlar
- Har bir raundda qayta tiklanadigan ikkita raund özgaruvçisini saqlang: `low = 1` va `high = max_number`.
- Juda kiçik: `low = guess + 1`. Juda katta: `high = guess - 1`. Quyidagi bonussiz oraliqdan taşqaridagi taxmin uni yana kengaytirib yuborişi mumkin, şuning uçun çegarani faqat içkariga suring: `low` ni faqat `guess + 1 > low` bölsa, `high` ni faqat `guess - 1 < high` bölsa özgartiring.
- Bonus: `low..high` dan taşqaridagi taxminlarni uriniş sarflamasdan rad eting, çunki ular töğri bölişi mumkin emas.
:::

### 4. Maxsus qiyinlik va statistika <Difficulty level="2" />

Törtinçi daraja - `4) Maxsus` ni qöşing: unda öyinçi eng katta son va urinişlar sonini kiritadi (ikkalasi ham tekşiriladi). Oxirida yutilgan raund uçun örtaça urinişlar sonini ham çop eting.

::: details Maslahatlar
- Har bir qiymat uçun kiçik `while True` siklida `isdecimal()` tekşiruvi andozasini qayta işlating.
- 2 dan kiçik maxsus oraliqni va 1 dan kiçik urinişlar sonini rad eting.
- `total_attempts` ni seans özgaruvçisi sifatida saqlang. Unga faqat raund yutilganda qöşing va faqat `wins > 0` bölsa `wins` ga böling.
:::

### 5. Kompyuter sizning soningizni topadi <Difficulty level="3" />

Öyinni teskari qiling: öyinçi 1 dan 100 gaça son öylaydi, kompyuter esa taxmin qiladi. Öyinçi `k` (juda katta), `p` (juda past) yoki `t` (töğri) deb javob beradi. Kompyuter doim 7 ta taxmin içida yutişi va aldovni aniqlaşi kerak (masalan, `low` ni `high` dan katta qilib qöyadigan javoblar).

::: details Maslahatlar
- `low = 1` va `high = 100` ni saqlang. Kompyuter `(low + high) // 2` ni taxmin qiladi.
- `k` da `high = guess - 1`, `p` da `low = guess + 1` qiling.
- Agar `low > high` bölsa, öyinçi bir-biriga zid javoblar bergan: xabar çop eting va töxtang.
- Javobni `match answer:` bilan tekşiring, `k`, `p` yoki `t` bölmagan hamma narsa uçun `case _:` dan foydalaning.
:::

## Xulosa

- Avval rejalaştiring: sikllarni çizing va qaysi özgaruvçilar butun seans davomida yaşaşi, qaysilari har bir raundda qayta tiklanişini hal qiling.
- `random.randint(a, b)` ikkala çegarani ham öz içiga oladi. `random.seed()` sinov paytida natijalarni takrorlanadigan qiladi.
- Özgartirişdan oldin tekşiring: `strip()`, keyin `isdecimal()`, keyin `int()`. Notöğri kiritiş urinişni sarflamasligi uçun `continue` dan foydalaning.
- Hisoblagiç va `while attempts < max_attempts` urinişlarni çeklaydi, `break` esa ğalabada siklni oldinroq tugatadi.
- `|` andozali `match` menyu tanlovini sozlamalarga aylantiradi, `case _:` esa qolgan hamma narsani uşlaydi.
- `break` faqat eng içki sikldan çiqadi, şuning uçun taşqi siklni `playing` kabi bayroq töxtatadi. Har bir yölni sinab köring: yutiş, yutqaziş, notöğri kiritiş va har bir sörovda çiqiş.

## Qöşimça manbalar

- [`random.randint` and `random.seed`](https://docs.python.org/3/library/random.html#random.randint)
- [`str.isdecimal`](https://docs.python.org/3/library/stdtypes.html#str.isdecimal)
- [Python tutorial: `break` and `continue` statements, and `else` clauses on loops](https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements-and-else-clauses-on-loops)
- [Python tutorial: `match` statements](https://docs.python.org/3/tutorial/controlflow.html#match-statements)
