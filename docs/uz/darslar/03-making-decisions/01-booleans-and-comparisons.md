---
title: Mantiqiy qiymatlar va taqqoslaş
description: "True va False nimaligini tuşuning, qiymatlarni ==, !=, <, >, <= va >= bilan taqqoslang, taqqoslaşlarni zanjir qiling va Python qaysi qiymatlarni rost yoki yolğon deb hisoblaşini örganing."
---

# Mantiqiy qiymatlar va taqqoslaş

![Rasm: Mantiqiy qiymatlar va taqqoslaş](/images/topics-webp-uzb/booleans-and-comparisons.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- `bool` turi va uning ikki qiymati: `True` va `False`
- Oltita taqqoslaş operatori va `0 <= score <= 100` kabi zanjirlar
- Satrlar qanday taqqoslanadi va nega `"Z" < "a"`
- Qaysi qiymatlar "rost" (truthy), qaysilari "yolğon" (falsy) hisoblanadi
- Önlik sonlarni xavfsiz taqqoslaş va nega `is` bu `==` emas
:::

## Nega bu muhim

Dasturlar qaror qabul qiladi: *Parol töğrimi? Savat böşmi? Foydalanuvçi 18 yoşdan kattami?* Har bir qaror javobi **ha yoki yöq** bölgan savoldan boşlanadi. Pythonda bu javoblar **mantiqiy qiymatlar (boolean)** deyiladi. Bu dars keyingi darsdagi `if` buyruqlari uçun poydevor böladi.

## True va False

Pythonda aynan ikkita qiymatga ega tur bor:

```python
is_raining = True
has_ticket = False

print(is_raining)
print(type(has_ticket))
```

```text
True
<class 'bool'>
```

- `True` va `False` **boş harf bilan** yozilişi şart. `true` esa şunçaki aniqlanmagan nom.
- Ular satr emas: `True` qöştirnoqsiz yoziladi, `"True"` esa satr.
- Mantiqiy özgaruvçiga ha/yöq savoliga öxşaydigan nom bering: `is_valid`, `has_discount`, `can_vote`.

## Taqqoslaş operatorlari

**Taqqoslaş** ikki qiymat haqida savol beradi va mantiqiy qiymat qaytaradi:

| Operator | Savol | Misol | Natija |
|---|---|---|---|
| `==` | teng? | `5 == 5` | `True` |
| `!=` | teng emas? | `5 != 3` | `True` |
| `<` | kiçikmi? | `3 < 5` | `True` |
| `>` | kattami? | `3 > 5` | `False` |
| `<=` | kiçik yoki tengmi? | `5 <= 5` | `True` |
| `>=` | katta yoki tengmi? | `4 >= 5` | `False` |

```python
age = 17
print(age >= 18)
print(age == 17)
print(age != 17)
```

```text
False
True
False
```

Natijani boşqa istalgan qiymat kabi saqlaş mumkin:

```python
balance = 50000
price = 32000

can_afford = balance >= price
print(f"Pul yetadimi: {can_afford}")
```

```text
Pul yetadimi: True
```

::: warning `=` va `==`
**`=` qiymat beradi** (`x = 5`). **`==` ikki qiymatni taqqoslaydi** (`x == 5`). Ularni adaştiriş yangi boşlovçilarning eng köp uçraydigan xatolaridan biri.
:::

## Har xil turlarni taqqoslaş

Sonlar qiymati böyiça taqqoslanadi, hatto `int` va `float` örtasida ham:

```python
print(3 == 3.0)
print(2 < 2.5)
```

```text
True
True
```

Lekin son va satr **heç qaçon teng bölmaydi**, ularni tartiblab ham bölmaydi:

```python
print(5 == "5")
```

```text
False
```

```py
print(5 < "10")
```

```text
TypeError: '<' not supported between instances of 'int' and 'str'
```

Bu `input()` bilan işlaganda muhim, çunki u satr qaytaradi. `input() == 5` **doim** `False` böladi. Avval özgartiring: `int(input()) == 5`.

## Satrlarni taqqoslaş

`==` ikki satr aynan bir xilligini tekşiradi, **harflarning katta-kiçikligi va böşliqlar ham hisobga olinadi**:

```python
print("çoy" == "çoy")
print("çoy" == "Çoy")
print("çoy" == "çoy ")
```

```text
True
False
False
```

Harf registri va ortiqça böşliqlarga qaramasdan taqqoslaş uçun avval ikkala tomonni tozalang:

```python
answer = "  HA "
print(answer.strip().lower() == "ha")
```

```text
True
```

### Satrlarni tartiblaş

`<` va `>` satrlarni **belgima-belgi**, har bir belgining kod raqami böyiça taqqoslaydi. Oddiy kiçik harfli sözlar uçun bu alifbo tartibiga töğri keladi:

```python
print("anor" < "banan")
print("toş" < "top")     # 'ş' harfi 'p' dan keyin keladi
print("ana" < "anor")     # qisqa boşlanğiç qism oldin keladi
```

```text
True
False
True
```

Ikki kutilmagan holat:

```python
print("Z" < "a")     # barça katta harflar kiçik harflardan oldin keladi
print("10" < "9")    # sonlarni emas, "1" bilan "9" ni taqqoslaydi
```

```text
True
True
```

Matnni registrdan qatʼi nazar alifbo böyiça taqqoslaş uçun ikkala tomonni kiçik harfga öting. Sonlarni taqqoslaş uçun esa avval ularni songa aylantiring.

## Taqqoslaşlarni zanjir qiliş

Python taqqoslaşlarni matematikadagi kabi zanjir qilib yozişga imkon beradi:

```python
score = 85
print(0 <= score <= 100)    # ball 0 va 100 orasidami?
print(80 <= score < 90)     # ball 80 dan 89 gaçami?
```

```text
True
True
```

`0 <= score <= 100` degani `0 <= score` **va** `score <= 100`. Köp boşqa tillarda bunday qilib bölmaydi.

Zanjir oraliq bölişi şart emas. Har bir bögin qöşnilar orasidagi alohida taqqoslaş, butun zanjir esa faqat har bir bögin rost bölgandagina `True`:

```python
a = 5
b = 5.0
c = 5
print(a == b == c)     # a == b va b == c
print(1 < 3 > 2)       # 1 < 3 va 3 > 2
```

```text
True
True
```

`1 < 3 > 2` - qonuniy, lekin öqiş qiyin. U `1` bilan `2` qanday taqqoslanişi haqida hiç narsa demaydi. Zanjirlarni oraliqlar va "hammasi teng" tekşiruvlari uçun saqlang.

## Rost va yolğon hisoblanadigan qiymatlar

Pythonda har qanday qiymatni mantiqiy qiymat sifatida işlatiş mumkin. Buni içki `bool()` funksiyasi körsatadi:

```python
print(bool(0), bool(0.0), bool(""))      # "böş" yoki nol qiymatlar
print(bool(42), bool(-1), bool("salom"), bool(" "))
```

```text
False False False
True True True True
```

- **Yolğon (falsy)** qiymatlar `False` kabi işlaydi: `0`, `0.0`, `""` (böş satr), `None` va `[]` kabi böş kolleksiyalar.
- **Qolgan hamma narsa** **rost (truthy)** hisoblanadi va `True` kabi işlaydi, jumladan `" "` (böşliq) va `"False"` (böş bölmagan satr!).

Keyingi darsda buni "agar foydalanuvçi *nimadir* yozgan bölsa" kabi tekşiruvlarda işlatasiz.

## Mantiqiy qiymatlar ham son

Arifmetikada `True` xuddi `1`, `False` esa `0` kabi işlaydi. Bu baʼzan sanaş uçun qulay:

```python
passed_math = True
passed_physics = False
passed_english = True

print(passed_math + passed_physics + passed_english)   # neçtasidan ötdi
```

```text
2
```

## Önlik sonlarni xavfsiz taqqoslaş

*Sonlar va matematika* darsidan bilasizki, önlik sonlar biroz noaniq bölişi mumkin:

```python
print(0.1 + 0.2 == 0.3)
```

```text
False
```

Arifmetikadan çiqqan önlik sonlarga `==` işlatmang. (Özingiz yozgan aniq qiymat bilan, masalan `x == 0.0`, taqqoslaş bemalol.) Kiçkina farqqa ruxsat beradigan `math.isclose()` dan foydalaning:

```python
import math

print(math.isclose(0.1 + 0.2, 0.3))
```

```text
True
```

`<` va `>` bilan taqqoslaş odatda muammosiz. Muammo `==` va `!=` da.

## `is` bu `==` emas

Kodda `x is None` ni uçratişingiz mumkin. `is` qiymatlar tengligini emas, ikki nom **ayni bir obyektga** işora qilişini tekşiradi. Ikki satr bir xil matnni saqlab turib, baribir boşqa-boşqa obyekt bölişi mumkin:

```python
first = "Al"
name = first + "i"
other = "Ali"

print(name == other)   # matni bir xilmi?
print(name is other)   # ayni obyektmi?

result = None
print(result is None)
```

```text
True
False
True
```

`first + "i"` yangi satr yaratdi, şuning uçun `name` va `other` teng, lekin ayni obyekt emas. Ikki teng satr yoki son bitta obyektni bölişadimi-yöqmi - bu Pythonning ixtiyorida, şuning uçun ularda `is` baʼzan işlagandek, baʼzan işlamagandek körinadi.

`None` - Pythonning "bu yerda qiymat yöq" qiymati va `None` obyekti hamişa bitta. Şuning uçun `is None` yangi boşlovçilar `is` ni işlatişi kerak bölgan yagona joy. Qolgan hamma narsa uçun `==` dan foydalaning. Teskari şakllari - `is not` va `!=`.

## Özingiz sinab köring

Qiymatlarni özgartiring va işga tuşirişdan oldin har bir natijani taxmin qiling.

<ClientOnly><PythonPlayground :code='"age = 16\npassword = \"Maxfiy123\"\nguess = \"maxfiy123\"\ntemperature = 23.5\n\nprint(\"Voyaga yetgan:\", age >= 18)\nprint(\"Parol mos keladi:\", guess == password)\nprint(\"Registrsiz mos keladi:\", guess.lower() == password.lower())\nprint(\"Harorat qulay:\", 18 <= temperature <= 26)"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `==` örniga `=` yoziş

```py
print(age = 18)
```

```text
TypeError: print() got an unexpected keyword argument 'age'
```

`print()` içida `age = 18` xuddi `sep=` kabi kalit sözli argumentga öxşab qoladi. **Tuzatiş:** `print(age == 18)`.

### 2. Kiritilgan qiymatni son bilan taqqoslaş

```python
answer = "7"            # input() qaytaradigan qiymat
print(answer == 7)      # satr hiç qaçon songa teng bölmaydi
print(int(answer) == 7)
```

```text
False
True
```

### 3. Kiçik harfli `true`

```py
is_open = true
```

```text
NameError: name 'true' is not defined. Did you mean: 'True'?
```

### 4. Qiymat bilan taqqoslaş uçun `is` işlatiş

```py
name = input("Ism: ")      # foydalanuvçi Ali deb yozadi
if name is "Ali":
    print("Salom, Ali!")
```

```text
SyntaxWarning: "is" with 'str' literal. Did you mean "=="?
Ism: Ali
```

Python dastur boşlanişidan oldinoq ogohlantiradi, keyin esa hiç narsa çop etilmaydi: siz yozgan matn yangi satr obyekti, koddagi `"Ali"` emas. **Tuzatiş:** `if name == "Ali":`.

## Maşqlar

### 1. Taxmin qiling <Difficulty level="1" />

Har bir natijani taxmin qiling, keyin işga tuşirib tekşiring.

```python
print(10 == 10.0)
print("10" == 10)
print(7 != 8)
print("abc" < "abd")
print(3 <= 3 < 4)
```

::: details Yeçim
```text
True
False
True
True
True
```

`"abc" < "abd"` uçinçi belgilarni taqqoslaydi, `c` esa `d` dan oldin keladi.
:::

### 2. Saylov yoşi <Difficulty level="1" />

`age = 19` berilgan. Yoş 18 yoki undan katta bölsa `True` böladigan `can_vote` özgaruvçisini yarating va uni çop eting.

::: details Yeçim
```python
age = 19
can_vote = age >= 18
print(can_vote)
```
:::

### 3. Bir xil sözmi? <Difficulty level="2" />

Agar `word1 = "  Toşkent"` va `word2 = "TOŞKENT "` harf registri va çetdagi böşliqlarni hisobga olmaganda bir xil söz bölsa, `True` çop eting.

::: details Yeçim
```python
word1 = "  Toşkent"
word2 = "TOŞKENT "
print(word1.strip().lower() == word2.strip().lower())
```
:::

### 4. Rostmi yoki yolğonmi? <Difficulty level="2" />

Har bir qiymat uçun `bool()` `True` yoki `False` berişini aniqlang: `0`, `"0"`, `""`, `" "`, `0.0`, `-0.5`, `"False"`.

::: details Yeçim
| Qiymat | `bool()` |
|---|---|
| `0` | `False` |
| `"0"` | `True`: böş bölmagan satr |
| `""` | `False` |
| `" "` | `True`: böşliq ham belgi |
| `0.0` | `False` |
| `-0.5` | `True`: noldan farqli |
| `"False"` | `True`: böş bölmagan satr |

Tekşirib köring:

```python
print(bool(0), bool("0"), bool(""), bool(" "))
print(bool(0.0), bool(-0.5), bool("False"))
```

```text
False True False True
False True True
```
:::

### 5. Töğri vaqt <Difficulty level="3" />

Vaqt matn körinişida berilgan: `time_text = "23:59"`. Uni soat va daqiqaga ajrating, songa aylantiring va agar bu töğri 24 soatlik vaqt bölsa (soat 0-23, daqiqa 0-59), `True` çop eting. `"23:59"` (True), `"24:00"` (False) va `"07:60"` (False) bilan sinab köring.

::: details Yeçim
```python
time_text = "23:59"

parts = time_text.split(":")
hours = int(parts[0])
minutes = int(parts[1])

hours_ok = 0 <= hours <= 23
minutes_ok = 0 <= minutes <= 59

print(hours_ok and minutes_ok)
```

`and` ikki mantiqiy qiymatni bittaga birlaştiradi. Bu *Mantiqiy operatorlar* darsining mavzusi. Usiz `hours_ok` va `minutes_ok` ni alohida çop etib, ikkalasi ham `True` ekanini tekşirişingiz mumkin edi.
:::

## Xulosa

- `bool` ikki qiymatga ega: `True` va `False`, boş harf bilan va qöştirnoqsiz yoziladi.
- `== != < > <= >=` taqqoslaşlari mantiqiy qiymat beradi. `=` qiymat beradi, `==` taqqoslaydi.
- Satrlarni taqqoslaş aniq va harf registriga sezgir, şuning uçun `"Z" < "a"`. Son hiç qaçon satrga teng bölmaydi: avval `input()` natijasini özgartiring.
- `0 <= x <= 100` kabi zanjirlar har bir qöşni juftni tekşiradi.
- Yolğon qiymatlar: `0`, `0.0`, `""`, `None` va böş kolleksiyalar. Qolgan hamma narsa rost.
- Arifmetikadan çiqqan önlik sonlarni `math.isclose()` bilan taqqoslang. `is` ni faqat `None` uçun işlating.

## Qöşimça manbalar

- [Comparisons](https://docs.python.org/3/library/stdtypes.html#comparisons)
- [Truth value testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing)
- [`math.isclose()`](https://docs.python.org/3/library/math.html#math.isclose)
- [Identity comparisons (`is`)](https://docs.python.org/3/reference/expressions.html#identity-comparisons)
