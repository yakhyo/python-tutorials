---
title: F-satrlar
description: "F-satrlar yordamida öqiş oson matn yarating: özgaruvçi va ifodalarni qöyiş, önlik sonlarni formatlaş, minglik ajratgiçlar, foizlar, tekislaş va = yordamida xatolarni tuzatiş."
---

# F-satrlar

![Rasm: F-satrlar](/images/topics-webp-uzb/f-strings.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Qiymatlarni matn içiga `f"...{value}..."` bilan qanday qöyiş
- `{}` içida ifodalar va metod çaqiriqlaridan qanday foydalaniş
- Sonlarni qanday formatlaş: verguldan keyingi xonalar, minglik ajratgiçlar, foizlar va töldiriş
- Matnni ustunlarda qanday tekislaş
- Xatolarni tuzatiş uçun `{value=}` va `!r` qisqa yozuvlari
:::

## Nega bu muhim

Dasturlar doimo maʼlumotlardan matn yasaydi: `"Salom, Aziza!"`, `"Jami: 125,000.00 söm"`, `"Jarayon: 75%"`. Bölaklarni `+` va `str()` bilan birlaştiriş tezda çalkaş böladi. **F-satrlar** (formatlangan satr literallari) buni qilişning zamonaviy va öqiş oson usuli. Hozirgi deyarli barça Python kodlarida aynan ularni körasiz.

## Asoslar

Oçuvçi qöştirnoqdan oldin `f` harfini qöying, keyin istalgan qiymatni **figurali qavslar** `{}` içiga yozing:

```python
name = "Aziza"
age = 20

print(f"Mening ismim {name}, men {age} yoşdaman.")
```

```text
Mening ismim Aziza, men 20 yoşdaman.
```

Boşqa usullar bilan soliştiring:

```python
name = "Aziza"
age = 20

print("Mening ismim " + name + ", men " + str(age) + " yoşdaman.")  # birlaştiriş
print("Mening ismim", name + ", men", age, "yoşdaman.")              # print argumentlari
print(f"Mening ismim {name}, men {age} yoşdaman.")                   # f-satr
```

F-satr xuddi tayyor gapning özidek öqiladi. `str()` ham, böş joylar haqida qayğuriş ham kerak emas.

::: warning `f` ni unutmang
`f` bölmasa, qavslar oddiy belgilar böladi: `"Salom, {name}"` `Salom, {name}` ni çiqaradi.
:::

## Qavslar içidagi ifodalar

Qavslar içida faqat özgaruvçi nomi emas, istalgan **ifoda** (expression), yaʼni qiymat hosil qiladigan har qanday narsa bölişi mumkin:

```python
price = 12500
quantity = 3
name = "dilnoza"

print(f"Jami: {price * quantity}")
print(f"Salom, {name.title()}!")
print(f"Ismingizda {len(name)} ta harf bor.")
```

```text
Jami: 37500
Salom, Dilnoza!
Ismingizda 7 ta harf bor.
```

Ifodalarni qisqa tuting. Agar hisob-kitob murakkab bölsa, avval uni özgaruvçiga saqlang va f-satrga şu özgaruvçini qöying.

### Qavslar içidagi qöştirnoqlar

F-satr içida satr argumentli metodni çaqirsangiz, içkarida **boşqa turdagi qöştirnoqdan** foydalaning:

```python
city = "Samarqand"
print(f"{city.replace('a', 'A')}")
```

```text
SAmArqAnd
```

Python 3.12 va undan yangi versiyalar içkarida xuddi şu qöştirnoqni ham işlatişga ruxsat beradi, lekin boşqa turdagisi har qanday versiyada işlaydi va öqiş ham osonroq.

## Sonlarni formatlaş

Qiymatdan keyin ikki nuqta `:` va u qanday körsatilişini boşqaradigan **format spetsifikatsiyasini** qöşing:

```text
{value:format_spec}
```

### Verguldan keyingi xonalar: `.2f`

```python
pi = 3.14159265
price = 7.5

print(f"{pi:.2f}")
print(f"{pi:.4f}")
print(f"{price:.2f}")
```

```text
3.14
3.1416
7.50
```

`.2f` "nuqtadan keyin 2 ta raqamli float" degani. U özgaruvçini özgartirmasdan, faqat körsatiş uçun **yuvaloqlaydi**. Bu önlik sonlardagi mayda noaniqliklarni ham yaşiradi:

```python
total = 0.1 + 0.2
print(f"{total:.2f}")
```

```text
0.30
```

### Minglik ajratgiçlar: `,` yoki `_`

```python
population = 37543000
salary = 8250000.5

print(f"{population:,}")
print(f"{salary:,.2f}")
print(f"{population:_}")
```

```text
37,543,000
8,250,000.50
37_543_000
```

Agar Özbekistonda va Yevropaning köp qismida odatiy bölgan böş joyli ajratgiç kerak bölsa, `,` bilan formatlab, keyin almaştiring: `f"{population:,}".replace(",", " ")` `37 543 000` ni beradi.

### Foizlar: `%`

`%` sonni 100 ga köpaytiradi va foiz belgisini qöşadi. `f` kabi u ham aniqlik berilmasa verguldan keyin 6 xona körsatadi, şuning uçun `{0.756:%}` `75.600000%` beradi. `.1%` yoki `.0%` kabi aniqlik qöşing:

```python
done = 0.756
print(f"Jarayon: {done:.1%}")
print(f"Jarayon: {done:.0%}")
```

```text
Jarayon: 75.6%
Jarayon: 76%
```

### Boşidagi nollar: `05d` yoki `02d`

```python
order = 42
hour, minute = 9, 5

print(f"Buyurtma #{order:05d}")
print(f"Vaqt: {hour:02d}:{minute:02d}")
```

```text
Buyurtma #00042
Vaqt: 09:05
```

`d` butun son (*decimal integer*) degani, `05` esa "kamida 5 ta belgi kenglikda, nollar bilan töldirilgan" degani.

## Tekislaş va kenglik

Joy ajratiş uçun **kenglik**, uning içida tekislaş uçun esa yönalişni bering:

| Spetsifikatsiya | Maʼnosi |
|---|---|
| `<10` | 10 ta belgi içida çapga tekislaş |
| `>10` | 10 ta belgi içida öngga tekislaş |
| `^10` | 10 ta belgi içida örtaga joylaş |
| `*^10` | örtaga joylaş, böş joyni `*` bilan töldiriş |

```python
print(f"|{'çoy':<10}|")
print(f"|{'çoy':>10}|")
print(f"|{'çoy':^10}|")
print(f"|{'çoy':*^10}|")
```

```text
|çoy       |
|       çoy|
|   çoy    |
|***çoy****|
```

Kenglik va son formatlari birga işlatiladi. Avval kenglik, keyin aniqlik yoziladi:

```python
item1, price1 = "Kök çoy", 3500
item2, price2 = "Somsa", 12000
item3, price3 = "Limonad", 9500.5

print(f"{'Mahsulot':<12}{'Narx':>12}")
print("-" * 24)
print(f"{item1:<12}{price1:>12,.2f}")
print(f"{item2:<12}{price2:>12,.2f}")
print(f"{item3:<12}{price3:>12,.2f}")
```

```text
Mahsulot            Narx
------------------------
Kök çoy         3,500.00
Somsa          12,000.00
Limonad         9,500.50
```

Standart holatda sonlar öngga, matn esa çapga tekislanadi, lekin buni aniq yozsangiz, jadvallar oldindan aytib bölinadigan körinişda böladi.

## `=` bilan xatolarni tuzatiş

Ifodadan keyin `=` qöşsangiz, ifodaning özi **ham**, qiymati **ham** çiqariladi. Bu kodingizda nima bölayotganini tekşiriş uçun juda qulay:

```python
width = 4
height = 2.5

print(f"{width=}")
print(f"{width * height=}")
print(f"{height = :.2f}")
```

```text
width=4
width * height=10.0
height = 2.50
```

### Yaşirin böş joylarni köriş: `!r`

Qiymatni Python uni kodda yozganidek - satrlarni qöştirnoq içida - körsatiş uçun `!r` qöşing. Ortiqça böş joylarni payqaş osonlaşadi. `=` şakli buni satrlar uçun avtomatik qiladi:

```python
raw = "  Aziza "

print(f"Ism: {raw}.")
print(f"Ism: {raw!r}")
print(f"{raw=}")
```

```text
Ism:   Aziza .
Ism: '  Aziza '
raw='  Aziza '
```

::: info Uçratadigan eski usullar
Qöllanmalar, Stack Overflow javoblari va eski kodda köpinça formatlaşning ikkita oldingi usuli uçraydi. **Ularni öqing, lekin f-satr yozing.**

```python
name = "Aziza"
price = 12.5

print("Salom, {}! Jami: {:.2f}".format(name, price))   # str.format()
print("Salom, %s! Jami: %.2f" % (name, price))          # % formatlaş
```

```text
Salom, Aziza! Jami: 12.50
Salom, Aziza! Jami: 12.50
```

`.format()` dagi `{:.2f}` yuqorida örgangan format spetsifikatsiyalarining özini işlatadi. `%` formatlaşda `%s` satrni, `%.2f` esa 2 xonali float ni bildiradi.
:::

## Oddiy qavs belgilari

Haqiqiy `{` yoki `}` belgisini körsatiş uçun uni ikki marta yozing:

```python
name = "töplam"
print(f"{name} şunday körinadi: {{1, 2, 3}}")
```

```text
töplam şunday körinadi: {1, 2, 3}
```

## Özingiz sinab köring

Qiymatlarni va format spetsifikatsiyalarini özgartiring. `:.0f`, `:>15,` yoki `:.1%` ni sinab köring.

<ClientOnly><PythonPlayground :code='"product = \"Noutbuk\"\nprice = 8499000\ndiscount = 0.12\n\nfinal = price * (1 - discount)\n\nprint(f\"{product:<10} {price:>12,} söm\")\nprint(f\"Çegirma    {discount:>12.0%}\")\nprint(f\"Yakuniy    {final:>12,.0f} söm\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `f` yetişmasligi

```python
name = "Bekzod"
print("Salom, {name}!")
```

```text
Salom, {name}!
```

**Tuzatiş:** `f"Salom, {name}!"`.

### 2. Notöğri turga format spetsifikatsiyasi

```py
code = "42"
print(f"{code:.2f}")
```

```text
ValueError: Unknown format code 'f' for object of type 'str'
```

Xabar "str turidagi obyekt uçun nomaʼlum format kodi f" deydi. `.2f` faqat sonlar bilan işlaydi, `"42"` esa satr. **Tuzatiş:** avval `float(code)` bilan özgartiring. Buni keyingi darsda örganasiz.

### 3. Ikki nuqtadan oldin böş joy

```python
price = 5
print(f"{price :.2f}")   # işlaydi, lekin öqiş qiyin
```

U işlaydi, lekin kelişuvga köra böş joylarsiz `{price:.2f}` deb yoziladi. Yagona istisno - `=` bilan xatolarni tuzatiş şakli, unda böş joylar ataylab natijada saqlanadi.

### 4. Juda erta formatlaş

```python
price = 12.5
total = f"{price:.2f}"
print(total * 2)
```

```text
12.5012.50
```

`f"{price:.2f}"` **matn** hosil qiladi, şuning uçun `* 2` sonni ikkilantiriş örniga satrni takrorlaydi. **Tuzatiş:** hisob-kitoblar uçun sonlarni son holida saqlang (`total = price * 2`) va faqat çiqarayotganda formatlang: `print(f"{total:.2f}")`.

## Maşqlar

### 1. Tanişuv <Difficulty level="1" />

`name = "Kamola"`, `city = "Namangan"` va `year = 2003` bilan bitta f-satr yordamida `Namanganlik Kamola 2003-yilda tuğilgan.` ni çiqaring.

::: details Yeçim
```python
name = "Kamola"
city = "Namangan"
year = 2003
print(f"{city}lik {name} {year}-yilda tuğilgan.")
```
:::

### 2. Ikki xona <Difficulty level="1" />

`87`, `92` va `78` ning örtaça qiymatini aynan ikki xonali qilib çiqaring: `Örtaça: 85.67`.

::: details Yeçim
```python
average = (87 + 92 + 78) / 3
print(f"Örtaça: {average:.2f}")
```
:::

### 3. Katta sonlar <Difficulty level="2" />

Kompaniya `1234567890.456` söm daromad qildi. Uni uç xil usulda çiqaring:

1. vergulli ajratgiçlar va 2 xona bilan,
2. böş joyli ajratgiçlar bilan va önlik qismsiz,
3. millionlarda, 1 xona bilan, masalan, `1234.6 mln`.

::: details Yeçim
```python
revenue = 1234567890.456

print(f"{revenue:,.2f}")
print(f"{revenue:,.0f}".replace(",", " "))
print(f"{revenue / 1_000_000:.1f} mln")
```

```text
1,234,567,890.46
1 234 567 890
1234.6 mln
```
:::

### 4. Jarayon çiziği <Difficulty level="2" />

`done = 7` va `total = 20` berilgan. Eni 20 ta belgi bölgan jarayon çiziğini çiqaring: bajarilgan qism `#`, qolgan qism `.` bilan, keyin esa foiz:

```text
[#######.............] 35%
```

::: details Yeçim
```python
done = 7
total = 20

bar = "#" * done + "." * (total - done)
print(f"[{bar}] {done / total:.0%}")
```
:::

### 5. Çek <Difficulty level="3" />

Bu çekni f-satrlar yordamida har bir narx öng tomonda tekis turadigan qilib çiqaring. Oraliq jamini, 12% QQS ni va umumiy summani mahsulotlar narxidan hisoblang.

```text
==============================
Palov x2             90,000.00
Kök çoy x3           10,500.00
Non x4               16,000.00
------------------------------
Oraliq jami         116,500.00
QQS 12%              13,980.00
JAMI                130,480.00
==============================
```

::: details Yeçim
```python
plov = 2 * 45000
tea = 3 * 3500
non = 4 * 4000

subtotal = plov + tea + non
vat = subtotal * 0.12
total = subtotal + vat

width = 30
print("=" * width)
print(f"{'Palov x2':<16}{plov:>14,.2f}")
print(f"{'Kök çoy x3':<16}{tea:>14,.2f}")
print(f"{'Non x4':<16}{non:>14,.2f}")
print("-" * width)
print(f"{'Oraliq jami':<16}{subtotal:>14,.2f}")
print(f"{'QQS 12%':<16}{vat:>14,.2f}")
print(f"{'JAMI':<16}{total:>14,.2f}")
print("=" * width)
```

Nomlar ustuni 16 ta belgi, narx ustuni esa 14 ta belgi, şuning uçun har bir qator aynan 30 ta belgidan iborat va ramkaga mos keladi.
:::

## Xulosa

- Qiymatlarni matnga qöyiş uçun `f"...{expression}..."` deb yozing. `f` ni unutmang.
- `{}` içiga qiymat hosil qiladigan har qanday narsa yoziladi: özgaruvçilar, matematik amallar yoki metod çaqiriqlari.
- `{x:.2f}` verguldan keyingi xonalarni belgilaydi, `{x:,}` minglik ajratgiçlarni qöşadi, `{x:.1%}` esa foizni körsatadi.
- `{x:05d}` nollar bilan töldiradi. Kenglik bilan birga `<`, `>` va `^` matnni ustunlarda tekislaydi.
- `{x=}` ifodani va uning qiymatini çiqaradi, `{x!r}` qöştirnoq va yaşirin böş joylarni körsatadi, <code v-pre>{{ }}</code> esa oddiy qavs belgilarini çiqaradi.
- **Körsatiş** uçun formatlang, hisob-kitoblar uçun esa sonlarni son holida saqlang.

## Qöşimça manbalar

- [Python Tutorial - Formatted string literals](https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals)
- [Format specification mini-language](https://docs.python.org/3/library/string.html#format-specification-mini-language)
- [Lexical analysis - f-strings](https://docs.python.org/3/reference/lexical_analysis.html#f-strings)
