---
title: Rekursiya
description: "Özini özi çaqiradigan funksiyalar yozing: bazaviy va rekursiv holat, çaqiruvlar steki qanday yeçiladi, RecursionError va rekursiya qaçon sikldan qulay (papkalar va röyxatlar içidagi röyxatlar kabi içma-iç maʼlumotlar)."
---

# Rekursiya

::: tip Nimalarni örganasiz
- Funksiya **özini özi çaqirişi** nimani anglatadi va nega bu çeksiz sikl emas
- Har bir rekursiv funksiyaga kerak bölgan ikki qism: **bazaviy holat** va **rekursiv holat**
- Python çaqiruvlarni **çaqiruvlar steki**da qanday kuzatadi va `RecursionError` nimani anglatadi
- Qaçon sikl soddaroq va qaçon rekursiya tabiiy vosita: **içma-iç** maʼlumotlar
:::

## Nega bu muhim

Papkada fayllar va boşqa papkalar bor, ularning içida yana fayllar va papkalar. Röyxat içida röyxatlar, ularning içida yana röyxatlar bölişi mumkin. Şajara, kiçik menyulari bor menyu, kompaniyaning tuzilma jadvali: maʼlumot har bir darajada özining kiçik nusxasiga öxşaydi. `for` sikli bitta darajani qamrab oladi. *Istalgan* çuqurlikni qamrab oliş uçun katta masalani özining kiçikroq nusxasini yeçiş orqali yeçadigan va buning uçun **özini özi** çaqiradigan funksiya yoziladi. Bu ğoya **rekursiya (recursion)** deb ataladi va u har bir fayl menejeri, JSON tahlilçisi va qidiruv tizimida uçraydi.

## Özini özi çaqiradigan funksiya

Funksiya öz içida özini çaqirişiga hiç narsa xalaqit bermaydi. Mana siklsiz yozilgan teskari sanoq:

```python
def countdown(n):
    if n == 0:
        print("Uçdik!")
        return
    print(n)
    countdown(n - 1)

countdown(3)
```

```text
3
2
1
Uçdik!
```

`countdown(3)` `3` ni çop etib `countdown(2)` ni çaqiradi, u `2` ni çop etib `countdown(1)` ni çaqiradi, u esa `1` ni çop etib `countdown(0)` ni çaqiradi. Bu çaqiruv `Uçdik!` ni çop etadi va hiç narsani çaqirmasdan qaytadi, şunda zanjir töxtaydi. Har bir çaqiruv masalaning **kiçikroq** nusxasi ustida işlaydi, eng kiçik nusxa esa tögridan-tögri yeçiladi.

## Bazaviy holat va rekursiv holat

Har bir rekursiv funksiya ikki qismdan iborat:

- **Bazaviy holat (base case)** - eng kiçik kiruvçi qiymat, uni funksiya özini **çaqirmasdan** yeçadi. `countdown` da bu `n == 0`.
- **Rekursiv holat (recursive case)** ozgina iş qiladi, keyin funksiyani **kiçikroq** qiymat bilan çaqirib, bazaviy holat tomon yuradi.

Klassik misol - faktorial. `5!` bu `5 × 4 × 3 × 2 × 1`, va uni özi orqali taʼriflaş mumkin: `5!` bu `5 × 4!`.

```python
def factorial(n):
    if n <= 1:                      # bazaviy holat
        return 1
    return n * factorial(n - 1)     # rekursiv holat

print(factorial(5))
print(factorial(20))
```

```text
120
2432902008176640000
```

Rekursiv holatni **işonç** sifatida öqing: "`factorial(n - 1)` allaqaçon tögri işlaydi deb faraz qilaman, mening vazifam faqat `n` ga köpaytiriş." Barça çaqiruvlarni xayolda kuzatib çiqiş şart emas. Bazaviy holat tögri ekanini va har bir qadam unga yaqinlaşişini tekşirsangiz yetarli.

## Çaqiruvlar stekida nima böladi

Funksiya özini çaqirganda birinçi çaqiruv **tugamaydi**. U öz lokal özgaruvçilari bilan içki çaqiruv qaytgunça kutib turadi. Python kutayotgan çaqiruvlarni **çaqiruvlar steki (call stack)**da saqlaydi - bu *Xato xabarlarini öqiş va tuzatiş* darsidagi traceback da körgan tuzilmaning özi. Çekinişli `print` lar stekni körsatib beradi:

```python
def factorial(n, depth=0):
    indent = "  " * depth
    print(f"{indent}factorial({n}) boşlandi")
    if n <= 1:
        print(f"{indent}factorial({n}) 1 qaytardi")
        return 1
    result = n * factorial(n - 1, depth + 1)
    print(f"{indent}factorial({n}) {result} qaytardi")
    return result

factorial(4)
```

```text
factorial(4) boşlandi
  factorial(3) boşlandi
    factorial(2) boşlandi
      factorial(1) boşlandi
      factorial(1) 1 qaytardi
    factorial(2) 2 qaytardi
  factorial(3) 6 qaytardi
factorial(4) 24 qaytardi
```

Çaqiruvlar bazaviy holatga qarab **pastga** tuşadi, natijalar esa **yuqoriga** qaytadi: `1`, keyin `2 × 1`, keyin `3 × 2`, keyin `4 × 6`. Har bir darajaning öz `n` i bor - *Özgaruvçilarning köriniş sohasi* darsida vaʼda qilinganidek, lokal özgaruvçilar bitta çaqiruvga tegişli.

## Bazaviy holat bölmasa

Agar funksiya hiç qaçon bazaviy holatga yetmasa, stek Python uni töxtatgunça ösaveradi:

```py
def countdown(n):
    print(n)
    countdown(n - 1)   # bazaviy holat yöq: n kamayaveradi

countdown(3)
```

```text
3
2
1
0
-1
...
  File "main.py", line 3, in countdown
    countdown(n - 1)   # bazaviy holat yöq: n kamayaveradi
    ~~~~~~~~~^^^^^^^
  [Previous line repeated 996 more times]
RecursionError: maximum recursion depth exceeded
```

Çegara taxminan 1000 ta içma-iç çaqiruv (`sys.getrecursionlimit()`), va Python da uni aylanib ötadigan hiyla yöq: millionggaça sanaydigan rekursiv funksiya sikl işlaydigan joyda yiqiladi. Bu - kelişuv. Rekursiyani **çuqurlik** kiçik bölganda işlating, masalan papkalar daraxtining çuqurligi uçun, röyxat uzunligi uçun emas.

## Rekursiyami yoki sikl?

`countdown` va `factorial` qiladigan hamma işni `for` sikli soddaroq bajaradi, şuning uçun siklni yozing. Rekursiya maʼlumot **nomaʼlum çuqurlikkaça içma-iç** bölganda öz örnini topadi. Faraz qiling, buyurtmada mahsulotlar *yoki töplamlar* bölişi mumkin, töplam içida esa yana töplamlar:

```python
def total(item):
    if isinstance(item, list):                     # töplam: qismlarini qöşamiz
        return sum(total(part) for part in item)
    return item                                    # bitta narx

order = [15000, [8000, 8000], [12000, [5000, 5000]]]
print(total(order))
```

```text
53000
```

Içida `if isinstance(...)` bölgan sikl ikki darajani, keyin uçtasini qamrab oladi va törttasi uçun baribir notögri işlaydi. Rekursiv variant uç qatorda istalgan çuqurlikni qamrab oladi, çunki töplam - şunçaki kiçikroq buyurtma. Xuddi şu şakl *Içma-iç maʼlumotlar* darsidagi içma-iç luğatlar, masalan papkalar daraxti uçun ham işlaydi:

```python
folder = {
    "docs": {"plan.md": 4, "notes.txt": 2},
    "photos": {"trip": {"bukhara.jpg": 3200, "khiva.jpg": 2900}, "cat.jpg": 800},
    "readme.md": 1,
}

def total_size(item):
    if isinstance(item, dict):                 # papka: içidagilarni qöşamiz
        return sum(total_size(child) for child in item.values())
    return item                                # fayl: hajmi KB da

def show(item, name="/", depth=0):
    print("  " * depth + name)
    if isinstance(item, dict):
        for child_name, child in item.items():
            show(child, child_name, depth + 1)

show(folder)
print(total_size(folder), "KB")
```

```text
/
  docs
    plan.md
    notes.txt
  photos
    trip
      bukhara.jpg
      khiva.jpg
    cat.jpg
  readme.md
6907 KB
```

`show` pastga `depth + 1` ni uzatadi, şunda har bir daraja bir qadam köproq çekinadi: qöşimça parametr maʼlumotni çaqiruvlar böylab **pastga** olib boradi, `total_size` ning qaytariladigan qiymati esa maʼlumotni **yuqoriga** qaytaradi.

## Özingiz sinab köring

Buyurtma tuzilmasini özgartiring, çuqurroq töplam qöşing yoki `show` fayl nomlari yoniga hajmini ham çop etadigan qiling.

<ClientOnly><PythonPlayground :code='"def total(item):\n    if isinstance(item, list):\n        return sum(total(part) for part in item)\n    return item\n\ndef depth(item):\n    if not isinstance(item, list):\n        return 0\n    return 1 + max(depth(part) for part in item)\n\norder = [15000, [8000, 8000], [12000, [5000, 5000]]]\nprint(\"Jami:\", total(order))\nprint(\"Eng çuqur töplam:\", depth(order))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Funksiyani töxtatmaydigan bazaviy holat

```py
def countdown(n):
    if n == 0:
        print("Uçdik!")
    print(n)          # Yomon: bu qator n == 0 bölganda ham işlaydi
    countdown(n - 1)  # ... va bu ham

countdown(2)
```

```text
2
1
Uçdik!
0
-1
...
RecursionError: maximum recursion depth exceeded
```

Bazaviy holat xabarini çop etdi, lekin `return` qilmadi, şuning uçun rekursiv çaqiruv baribir bajarildi. **Tuzatiş:** bazaviy holatni `return` bilan tugating (yoki rekursiv holatni `else` içiga qöying).

### 2. Rekursiv natijani `return` qilişni unutiş

```py
def factorial(n):
    if n <= 1:
        return 1
    n * factorial(n - 1)      # Yomon: natija hisoblanadi-yu, taşlab yuboriladi

print(factorial(5))
```

```text
TypeError: unsupported operand type(s) for *: 'int' and 'NoneType'
```

`return` bölmasa rekursiv holat `None` qaytaradi va yuqoridagi daraja unga köpaytirişga urinadi. **Tuzatiş:** `return n * factorial(n - 1)`. Bu *Qaytariladigan qiymatlar* darsidagi "print yoki return" tuzoğining özi, faqat bir daraja çuqurroq.

### 3. Bazaviy holat tomon yurmaslik

```py
def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n)     # Yomon: har safar ayni şu n

print(digit_sum(2026))
```

```text
RecursionError: maximum recursion depth exceeded
```

Har bir rekursiv çaqiruv **kiçikroq** masala olişi şart: bu yerda `n // 10`, `countdown` da `n - 1`, satr uçun `text[1:]`, daraxt uçun içki papka. Argument özgarmasa, bazaviy holatga hiç qaçon yetib bölmaydi.

## Maşqlar

### 1. Raqamlar yiğindisi <Difficulty level="1" />

Manfiy bölmagan butun sonning raqamlari yiğindisini rekursiya bilan qaytaradigan `digit_sum(n)` funksiyasini yozing va `2026`, `7` hamda `999999` uçun natijalarni çop eting. Maslahat: `n % 10` - oxirgi raqam, `n // 10` - qolgani.

::: details Yeçim
```python
def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n // 10)

print(digit_sum(2026), digit_sum(7), digit_sum(999999))
```

```text
10 7 54
```

Bazaviy holat - bir xonali son. Har bir çaqiruv oxirgi raqamni ajratib oladi va qolganini kiçikroq çaqiruvga topşiradi.
:::

### 2. Daraja <Difficulty level="1" />

Manfiy bölmagan `exponent` uçun `**` va siklsiz `base ** exponent` ni hisoblaydigan `power(base, exponent)` funksiyasini yozing. `power(2, 10)`, `power(5, 3)` va `power(7, 0)` ni çop eting.

::: details Yeçim
```python
def power(base, exponent):
    if exponent == 0:
        return 1
    return base * power(base, exponent - 1)

print(power(2, 10), power(5, 3), power(7, 0))
```

```text
1024 125 1
```

Har qanday sonning `0` darajasi `1` ga teng: bu bazaviy holat, va u `power(7, 0)` ni ham tögri işlatadi.
:::

### 3. Satrni teskari yozing <Difficulty level="2" />

`[::-1]` kesimi örniga rekursiya bilan satrni teskari qaytaradigan `reverse(text)` funksiyasini yozing. `"Samarkand"`, `"non"`, `"a"` va `""` uçun `repr(reverse(word))` ni çop eting.

::: details Yeçim
```python
def reverse(text):
    if len(text) <= 1:
        return text
    return reverse(text[1:]) + text[0]

for word in ["Samarkand", "non", "a", ""]:
    print(repr(reverse(word)))
```

```text
'dnakramaS'
'non'
'a'
''
```

Uzunligi 0 yoki 1 bölgan satr allaqaçon teskari. Aks holda birinçi belgidan keyingi hammasini teskari qiling, sönra birinçi belgini oxiriga qöying.
:::

### 4. Içma-iç röyxatni tekislang <Difficulty level="2" />

`[1, [2, 3], [4, [5, [6]]], 7]` ni çuqurligidan qatʼi nazar `[1, 2, 3, 4, 5, 6, 7]` ga aylantiradigan `flatten(items)` funksiyasini yozing. Natijani çop eting.

::: details Yeçim
```python
def flatten(items):
    flat = []
    for item in items:
        if isinstance(item, list):
            flat.extend(flatten(item))
        else:
            flat.append(item)
    return flat

print(flatten([1, [2, 3], [4, [5, [6]]], 7]))
```

```text
[1, 2, 3, 4, 5, 6, 7]
```

Sikl bitta darajani, rekursiv çaqiruv esa içki röyxat içidagi hamma narsani qamrab oladi. `extend` röyxatning özini emas, tekislangan içki röyxat elementlarini bittalab qöşadi.
:::

### 5. Papkalar daraxtida qidiriş <Difficulty level="3" />

Darsdagi `folder` luğatidan foydalanib, istalgan çuqurlikdagi fayllar sonini qaytaradigan `count_files(folder)` va şu nomli birinçi fayl yoki papkaga yölni (masalan `/photos/trip/khiva.jpg`) yoki topilmasa `None` qaytaradigan `find(folder, name)` funksiyalarini yozing. `count_files(folder)`, `find(folder, "khiva.jpg")` va `find(folder, "missing.txt")` ni çop eting.

::: details Yeçim
```python
def count_files(folder):
    count = 0
    for child in folder.values():
        if isinstance(child, dict):
            count += count_files(child)
        else:
            count += 1
    return count

def find(folder, name, path=""):
    for child_name, child in folder.items():
        current = f"{path}/{child_name}"
        if child_name == name:
            return current
        if isinstance(child, dict):
            found = find(child, name, current)
            if found:
                return found
    return None

folder = {
    "docs": {"plan.md": 4, "notes.txt": 2},
    "photos": {"trip": {"bukhara.jpg": 3200, "khiva.jpg": 2900}, "cat.jpg": 800},
    "readme.md": 1,
}
print(count_files(folder))
print(find(folder, "khiva.jpg"))
print(find(folder, "missing.txt"))
```

```text
6
/photos/trip/khiva.jpg
None
```

`find` şu paytgaça yiğilgan yölni har bir rekursiv çaqiruvga **pastga** uzatadi va birorta çaqiruv topişi bilan javobni **yuqoriga** qaytaradi. Oxirgi `return None` şu darajada hiç narsa mos kelmagan holatni qamrab oladi.
:::

## Xulosa

- **Rekursiv** funksiya masalaning kiçikroq nusxasi uçun özini özi çaqiradi.
- Unga rekursiyasiz qaytadigan **bazaviy holat** va unga qarab yuradigan **rekursiv holat** kerak.
- Har bir çaqiruv öz lokal özgaruvçilari bilan **çaqiruvlar steki**da kutadi; natijalar daraja-badaraja yuqoriga qaytadi.
- Bazaviy holat bölmasa yoki unga yetib bölmasa, taxminan 1000 çaqiruvdan keyin `RecursionError` çiqadi, şuning uçun rekursiya uzun ketma-ketliklarga emas, **sayoz** çuqurlikka mos.
- Oddiy takrorlaş uçun sikl, nomaʼlum çuqurlikkaça **içma-iç** maʼlumotlar (röyxat içidagi röyxatlar, papkalar daraxti, içma-iç luğatlar) uçun rekursiya işlating.

## Qöşimça manbalar

- [Python Tutorial - Defining functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)
- [`sys.getrecursionlimit()`](https://docs.python.org/3/library/sys.html#sys.getrecursionlimit)
- [Python glossary - recursion](https://docs.python.org/3/glossary.html)
