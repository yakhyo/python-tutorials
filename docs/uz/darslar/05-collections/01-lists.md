---
title: Röyxatlar
description: "Tartiblangan kolleksiyalarni röyxatlarda saqlaş: yaratiş, indeks va kesim, elementlarni özgartiriş, qöşiş va öçiriş, sikl, hamda röyxatni ulaşiş va nusxalaş örtasidagi farq."
---

# Röyxatlar

![Rasm: Röyxatlar](/images/topics-webp-uzb/lists.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Röyxat yaratiş va elementlarni indeks hamda kesim orqali öqiş
- Röyxatlar satrlardan nimasi bilan farq qiladi: ularni **özgartiriş mumkin**
- Element qöşiş (`append`, `insert`, `extend`, kesimlar) va öçiriş (`remove`, `pop`, `del`)
- Element borligini tekşiriş va röyxat böyiça sikl yurgiziş
- Nega `b = a` röyxatni **ulaşadi** va qanday qilib haqiqiy nusxa olinadi
:::

## Nega bu muhim

Dasturlar kamdan-kam hollarda bitta qiymat bilan işlaydi. Sinfda köp öquvçi, dökonda köp mahsulot, pleylistda köp qöşiq bor. **Röyxat (list)** köp qiymatni bitta özgaruvçida saqlaydi, ularni **tartib bilan** tutadi va qöşiş, öçiriş hamda özgartirişga imkon beradi. Bu Pythondagi eng köp işlatiladigan kolleksiya.

## Röyxat yaratiş

Elementlarni kvadrat qavs içiga vergul bilan ajratib yozing:

```python
cities = ["Toşkent", "Samarqand", "Buxoro"]
scores = [88, 92, 79]
empty = []

print(cities)
print(len(scores))
print(len(empty))
```

```text
['Toşkent', 'Samarqand', 'Buxoro']
3
0
```

Röyxat istalgan turdagi qiymatni, hatto `["Aziza", 20, True]` kabi aralaş turlarni ham saqlay oladi, lekin odatda röyxatda bir xil turdagi elementlar böladi.

`list()` yordamida boşqa ketma-ketliklardan ham röyxat yasaş mumkin:

```python
print(list("abc"))
print(list(range(1, 6)))
print("qizil yaşil kök".split())
```

```text
['a', 'b', 'c']
[1, 2, 3, 4, 5]
['qizil', 'yaşil', 'kök']
```

## Indeks va kesim

Röyxatlarda indeks (index) va kesim (slice) xuddi satrlardagidek işlaydi (*Satrlar* va *Satr metodlari va kesimlar* darslariga qarang):

```python
planets = ["Merkuriy", "Venera", "Yer", "Mars", "Yupiter"]

print(planets[0])      # birinçisi
print(planets[-1])     # oxirgisi
print(planets[1:3])    # kesim yangi röyxat böladi
print(planets[::-1])   # teskari tartibdagi nusxa
```

```text
Merkuriy
Yupiter
['Venera', 'Yer']
['Yupiter', 'Mars', 'Yer', 'Venera', 'Merkuriy']
```

## Röyxatni özgartiriş mumkin

![Diagramma: Röyxatni özgartiriş mumkin](/images/companions-webp-uzb/list-operations.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

Satrlardan farqli ravişda, röyxatlar **özgaruvçan (mutable)**. Elementni uning indeksiga yangi qiymat berib almaştiriş mumkin:

```python
colors = ["qizil", "yaşil", "kök"]
colors[1] = "sariq"
print(colors)
```

```text
['qizil', 'sariq', 'kök']
```

**Kesimga** ham qiymat berişingiz mumkin. Bu bir vaqtning özida bir neçta elementni almaştiradi va yangi qism bir xil uzunlikda bölişi şart emas. Böş röyxat berilsa yoki kesim bilan `del` işlatilsa, elementlar öçiriladi:

```python
nums = [10, 20, 30, 40, 50, 60]
nums[1:3] = [21, 31]      # ikkita elementni almaştiriş
print(nums)
nums[1:3] = []            # ikkita elementni öçiriş
print(nums)
del nums[::2]             # har ikkinçi elementni öçiriş
print(nums)
```

```text
[10, 21, 31, 40, 50, 60]
[10, 40, 50, 60]
[40, 60]
```

## Element qöşiş

| Metod | Nima qiladi |
|---|---|
| `lst.append(x)` | `x` ni **oxiriga** qöşadi |
| `lst.insert(i, x)` | `x` ni `i` **örniga** qöyadi (keyingi elementlar önga suriladi) |
| `lst.extend(other)` | Boşqa ketma-ketlikning **har bir elementini** oxiriga qöşadi |

```python
queue = ["Aziza", "Bekzod"]

queue.append("Dilnoza")
queue.insert(0, "Farrux")
queue.extend(["Gulnora", "Hasan"])

print(queue)
```

```text
['Farrux', 'Aziza', 'Bekzod', 'Dilnoza', 'Gulnora', 'Hasan']
```

Eng köp `append` ni işlatasiz. Keng tarqalgan usul - *Sikllarda köp işlatiladigan usullar* darsidagi **filtr**: böş röyxatdan boşlab, faqat kerakli elementlarni qöşib boriş:

```python
scores = [72, 95, 58, 88, 64, 91]

high_scores = []
for score in scores:
    if score >= 85:
        high_scores.append(score)
print(high_scores)
```

```text
[95, 88, 91]
```

::: warning append va extend
`queue.append(["x", "y"])` **bitta** element, yaʼni butun röyxatni qöşadi va röyxat içida röyxat hosil böladi. `queue.extend(["x", "y"])` esa **ikkita** element qöşadi.
:::

## Elementlarni öçiriş

| Usul | Nima qiladi |
|---|---|
| `lst.remove(x)` | `x` ga **teng birinçi elementni** öçiradi |
| `lst.pop()` | **Oxirgi** elementni öçiradi va uni qaytaradi |
| `lst.pop(i)` | `i` **indeksdagi** elementni öçiradi va uni qaytaradi |
| `del lst[i]` | `i` indeksdagi elementni öçiradi (kesimlar bilan ham işlaydi) |
| `lst.clear()` | **Hammasini** öçiradi |

```python
tasks = ["pöçta", "yiğiliş", "tuşlik", "hisobot", "qönğiroq"]

tasks.remove("tuşlik")     # qiymat böyiça
last = tasks.pop()         # oxirgi elementni öçirib, saqlab qolamiz
first = tasks.pop(0)       # birinçi elementni öçirib, saqlab qolamiz
del tasks[0]               # indeks böyiça öçiramiz

print(tasks)
print(f"Olindi: {first}, {last}")
```

```text
['hisobot']
Olindi: pöçta, qönğiroq
```

**Qiymatni** bilsangiz `remove` ni, **örnini** bilsangiz `pop` yoki `del` ni işlating. Öçirilgan element sizga kerak bölsa, `pop` ni tanlang.

### Stek va navbat

`append` va `pop()` bilan röyxat **stek (stack)** böladi: oxirgi kirgan birinçi çiqadi, xuddi brauzerning "Orqaga" tugmasidek. `pop(0)` bilan esa **navbat (queue)**: kim birinçi kelgan bölsa, öşa birinçi xizmat oladi.

```python
history = ["bosh", "yangiliklar"]
history.append("ob-havo")
print(history.pop(), history)     # stek: eng yangisini oliş

line = ["Aziza", "Bekzod"]
line.append("Dilnoza")
print(line.pop(0), line)          # navbat: eng eskisini oliş
```

```text
ob-havo ['bosh', 'yangiliklar']
Aziza ['Bekzod', 'Dilnoza']
```

`pop(0)` qolgan har bir elementni çapga suradi, bu uzun röyxatlar uçun sekin. Katta navbatlar uçun `collections.deque` va uning tez `popleft()` metodini işlating.

## Tekşiriş va qidiriş

```python
fruits = ["olma", "banan", "gilos", "banan"]

print("banan" in fruits)
print("mango" not in fruits)
print(fruits.index("banan"))   # birinçi mos elementning örni
print(fruits.count("banan"))
```

```text
True
True
1
2
```

Agar element röyxatda bölmasa, `.index()` `ValueError` çaqiradi. Şuning uçun işonçingiz komil bölmasa, avval `in` bilan tekşiring.

## Röyxat böyiça sikl

```python
prices = [12000, 4500, 30000]

for price in prices:
    print(f"{price:,} söm")
```

Örinlar ham kerak bölsa, `enumerate()` ni işlating (*Sikllarda köp işlatiladigan usullar* darsidan):

```python
guests = ["Aziza", "Bekzod", "Dilnoza"]

for seat, guest in enumerate(guests, start=1):
    print(f"{seat}-örin: {guest}")
```

```text
1-örin: Aziza
2-örin: Bekzod
3-örin: Dilnoza
```

## Röyxatlarni birlaştiriş

```python
a = [1, 2]
b = [3, 4]

print(a + b)      # yangi röyxat
print(a * 3)      # takrorlangan
```

```text
[1, 2, 3, 4]
[1, 2, 1, 2, 1, 2]
```

`+` **yangi** röyxat yaratadi, `a` va `b` esa özgarmay qoladi. `extend` esa röyxatning özini özgartiradi.

## Ulaşiş va nusxalaş

Bu darsdagi eng muhim ğoya. *Özgaruvçilar* darsidan eslang: nomlar bu **yorliqlar**. Röyxatlarda bu juda muhim, çunki röyxat özgarişi mumkin:

```python
original = ["çoy", "qahva"]
same_list = original          # AYNAN ŞU röyxat uçun ikkinçi yorliq

same_list.append("şarbat")

print(original)
print(same_list)
```

```text
['çoy', 'qahva', 'şarbat']
['çoy', 'qahva', 'şarbat']
```

`same_list = original` heç narsani nusxalamadi. Ikkala nom ham **bitta** röyxatga işora qiladi, şuning uçun uni istalgan nom orqali özgartirsangiz, ikkalasi ham özgarişni köradi.

Mustaqil röyxat oliş uçun **nusxa** yarating:

```python
original = ["çoy", "qahva"]
copy_1 = original.copy()
copy_2 = original[:]          # töliq kesim ham nusxa oladi
copy_3 = list(original)

copy_1.append("şarbat")

print(original)
print(copy_1)
```

```text
['çoy', 'qahva']
['çoy', 'qahva', 'şarbat']
```

`copy_1 is original` natijasi `False`: `is` "aynan şu röyxatmi?" deb söraydi, `==` esa faqat tarkibni soliştiradi.

::: info Sayoz nusxalar
Bu nusxalar **sayoz (shallow)**: agar röyxat içida boşqa röyxatlar bölsa, içki röyxatlar baribir ulaşilgan böladi. Bu haqda *Içma-iç maʼlumotlar* darsida batafsil gapiriladi.
:::

## Özingiz sinab köring

Vazifalar röyxatini boşqaruvçi dastur. Vazifa qöşib, öçirib va bajarilgan deb belgilab köring.

<ClientOnly><PythonPlayground :code='"todo = [\"non sotib oliş\", \"Python örganiş\", \"onamga qönğiroq qiliş\"]\ndone = []\n\ntodo.append(\"xonani yiğiştiriş\")\ntodo.insert(0, \"suv içiş\")\n\nfinished = todo.pop(2)\ndone.append(finished)\n\nprint(\"Qilinadigan işlar:\")\nfor number, task in enumerate(todo, start=1):\n    print(f\"  {number}. {task}\")\nprint(\"Bajarildi:\", \", \".join(done))"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Indeks çegaradan taşqarida

```py
items = ["a", "b", "c"]
print(items[3])
```

```text
IndexError: list index out of range
```

Oxirgi indeks `len(items) - 1` ga teng.

### 2. Röyxatda yöq elementni öçiriş

```py
items = ["a", "b"]
items.remove("z")
```

```text
ValueError: list.remove(x): x not in list
```

**Tuzatiş:** `if "z" in items: items.remove("z")`.

### 3. `append` natijasini özgaruvçiga yoziş

```python
numbers = [1, 2]
numbers = numbers.append(3)
print(numbers)
```

```text
None
```

`append`, `insert`, `extend`, `remove` va `sort` kabi röyxat metodlari röyxatning **özini** özgartiradi va `None` qaytaradi. **Tuzatiş:** şunçaki `numbers.append(3)` ni çaqiring.

### 4. Röyxat böyiça sikl yurgizib, uning özidan element öçiriş

```python
numbers = [1, 2, 2, 3]
for n in numbers:
    if n == 2:
        numbers.remove(n)
print(numbers)
```

```text
[1, 2, 3]
```

Bitta `2` qolib ketdi. Öçiriş qolgan elementlarni çapga suradi, şuning uçun sikl öçirilgan element örniga kelgan elementni ötkazib yuboradi. **Tuzatiş:** nusxa böyiça sikl yurgizing (`for n in numbers[:]:`) yoki faqat kerakli elementlardan yangi röyxat tuzing.

## Maşqlar

### 1. Sevimli taomlar <Difficulty level="1" />

Uçta sevimli taomingizdan röyxat tuzing. Birinçi va oxirgisini çiqaring, keyin oxiriga yana bittasini qöşing hamda butun röyxatni va uning uzunligini çiqaring.

::: details Yeçim
```python
foods = ["palov", "manti", "şaşlik"]
print(foods[0], foods[-1])

foods.append("lağmon")
print(foods, len(foods))
```
:::

### 2. Almaştiriş va öçiriş <Difficulty level="1" />

`week = ["Du", "Se", "Çorşanba", "Pa", "Ju", "Şa", "Ya"]` dan boşlang. `"Çorşanba"` ni `"Ço"` ga almaştiring, keyin dam oliş kunlarini öçiring, faqat iş kunlari qolsin.

::: details Yeçim
```python
week = ["Du", "Se", "Çorşanba", "Pa", "Ju", "Şa", "Ya"]

week[2] = "Ço"
del week[5:]          # 5-indeksdan oxirigaça öçiramiz

print(week)
```

```text
['Du', 'Se', 'Ço', 'Pa', 'Ju']
```
:::

### 3. Manfiylarni öçiriş <Difficulty level="2" />

`numbers = [3, -1, -2, 4, -5]` röyxatidan har bir manfiy sonni öçiring, bunda röyxatning özi özgarsin. Avval quyidagi sodda siklni işga tuşiring va u nega `[3, -2, 4]` ni çop etişini tuşuntiring. Keyin uni `[3, 4]` çiqaradigan qilib tuzating.

```py
numbers = [3, -1, -2, 4, -5]
for n in numbers:
    if n < 0:
        numbers.remove(n)
print(numbers)
```

::: details Yeçim
`-1` öçirilganda `-2` uning örniga suriladi, sikl esa keyingi örinni oladi, şuning uçun `-2` ni heç qaçon körmaydi. Uning örniga **nusxa** böyiça sikl yurgizing, şunda `numbers` dan element öçiriş sikl körib çiqayotgan narsani surmaydi:

```python
numbers = [3, -1, -2, 4, -5]
for n in numbers[:]:
    if n < 0:
        numbers.remove(n)
print(numbers)
```

```text
[3, 4]
```
:::

### 4. Ulaşişni oldindan ayting <Difficulty level="2" />

Bu kod nima çiqarişini oldindan ayting, keyin uni işga tuşiring.

```python
a = [1, 2, 3]
b = a
c = a[:]
b.append(4)
c.append(5)
a[0] = 99
print(a)
print(b)
print(c)
```

::: details Yeçim
```text
[99, 2, 3, 4]
[99, 2, 3, 4]
[1, 2, 3, 5]
```

`a` va `b` bitta röyxat, şuning uçun ikkalasi ham `4` va `99` ni köradi. `c` heç qanday özgarişdan oldin nusxalangan va faqat `5` ni oldi.
:::

### 5. Röyxatni aylantiriş <Difficulty level="3" />

`numbers = [1, 2, 3, 4, 5]` ni önga `k = 2` pozitsiyaga aylantiring, natija `[4, 5, 1, 2, 3]` bölsin. Masalani ikki usulda yeçing: bir marta kesiş bilan, bir marta `pop()` va `insert()` işlatilgan sikl bilan. `k` röyxat uzunligidan katta bölganda ham (masalan, `k = 7`) işlaşiga işonç hosil qiling.

::: details Yeçim
```python
numbers = [1, 2, 3, 4, 5]
k = 7

# 1. Kesiş
shift = k % len(numbers)          # 7 % 5 = 2
rotated = numbers[-shift:] + numbers[:-shift]
print(rotated)

# 2. pop va insert (röyxatning özini özgartiradi)
for _ in range(shift):
    last = numbers.pop()
    numbers.insert(0, last)
print(numbers)
```

```text
[4, 5, 1, 2, 3]
[4, 5, 1, 2, 3]
```

`k % len(numbers)` katta `k` ni ham töğri hisoblaydi, çunki röyxatni 5 marta aylantirsangiz, u boşlanğiç holatiga qaytadi. `shift` `0` bölganda ham işlaydi: `numbers[-0:]` butun röyxat, `numbers[:-0]` esa böş, şuning uçun heç narsa surilmaydi. Haqiqiy çegaraviy holat - böş röyxat: unda `k % len(numbers)` `ZeroDivisionError` beradi.
:::

## Xulosa

- Röyxat bu **tartiblangan, özgaruvçan** ketma-ketlik: `items = [a, b, c]`.
- Indeks va kesim satrlardagidek işlaydi, `items[i] = x` esa elementni almaştiradi.
- `append`, `insert`, `extend` yoki kesimga qiymat beriş bilan qöşing. `remove` (qiymat böyiça), `pop` va `del` (örin böyiça) hamda `clear` bilan öçiring. Bular röyxatning **özini** özgartiradi va `None` qaytaradi.
- `append` + `pop()` stek, `pop(0)` esa navbat yasaydi. Röyxat böyiça sikl yurgizayotganda undan element öçirmang.
- `in`, `index` va `count` qidiradi, `len` ölçamni beradi, `for` esa elementlar böyiça aylanadi.
- `b = a` bitta röyxatni ulaşadi. Mustaqil nusxa uçun `a.copy()` yoki `a[:]` ni işlating.

## Qöşimça manbalar

- [Python Tutorial - Lists](https://docs.python.org/3/tutorial/introduction.html#lists)
- [More on lists (methods)](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists)
- [Sequence types - `list`](https://docs.python.org/3/library/stdtypes.html#lists)
