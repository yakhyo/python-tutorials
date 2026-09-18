---
title: matplotlib bilan grafiklar
description: "matplotlib bilan maʼlumotlarni grafikka aylantiriş: çiziqli, ustunli, gistogramma, nuqtali va doiraviy diagrammalar, sarlavha va legendalar, Axes API bilan bir neça grafik, rasmlarni saqlaş va töğridan-töğri pandasʼdan çiziş."
---

# matplotlib bilan grafiklar

![Rasm: matplotlib bilan grafiklar](/images/topics-webp-uzb/charts-with-matplotlib.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Çiziqli, ustunli, gistogramma, nuqtali va doiraviy diagrammalarni çizişni
- Sarlavha, öq yozuvlari, legenda, tör, rang va markerlarni qöşişni
- `plt.subplots()` va Axes API yordamida bitta rasmga bir neça grafik joylaşni
- Grafikni rasm fayli sifatida saqlaşni
- Töğridan-töğri pandas DataFrameʼdan grafik çizişni va töğri grafik turini tanlaşni
:::

## Nega bu muhim

365 kunlik harorat jadvali bir qaraşda juda kam narsa aytadi. Xuddi şu sonlarning çiziqli grafigi esa issiq yozni, sovuq qişni va apreldagi bitta ğalati haftani darhol körsatadi. Grafiklar maʼlumotni örganayotganda qonuniyatlarni **topişga** va natijalarni boşqa odamlarga - rahbarga, öqituvçiga yoki hisobot öquvçilariga **tuşuntirişga** yordam beradi.

**matplotlib** - Python uçun klassik grafik çiziş kutubxonasi. pandas undan içkarida foydalanadi va köplab boşqa vositalar uning ustiga qurilgan, şuning uçun bu darsdagi ğoyalar köp joyda asqotadi.

## Tayyorgarlik va birinçi grafik

matplotlib uçinçi tomon (third-party) paketi. Öz kompyuteringizda uni quyidagiça örnating:

```text
python -m pip install pandas matplotlib
```

Bu saytdagi muharrirda u avtomatik yuklanadi va kod `plt.show()` ni çaqirganda grafik kod ostida paydo böladi.

matplotlibʼning eng köp işlatiladigan qismi `pyplot` bölib, odatda `plt` nomi bilan import qilinadi:

```python
import matplotlib.pyplot as plt

months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun"]
temps = [2, 5, 12, 19, 25, 30]

plt.plot(months, temps)
plt.title("Toşkentdagi ortaça harorat")
plt.xlabel("Oy")
plt.ylabel("Harorat (°C)")
plt.show()
```

Bu kod yanvardagi 2 °C dan iyundagi 30 °C gaça kötariladigan bitta kök çiziq çizadi, oylar pastki öq böylab joylaşadi.

`plt.plot(x, y)` avval gorizontal qiymatlarni, keyin vertikal qiymatlarni qabul qiladi. `plt.show()` tayyor grafikni körsatadi. Usiz terminaldan işga tuşirilgan skript heç narsa körsatmaydi.

## matplotlibʼdan foydalanişning ikki usuli

![Diagramma: matplotlibʼdan foydalanişning ikki usuli](/images/companions-webp-uzb/matplotlib-anatomy.webp){.lesson-diagram width=1536 height=1024 loading=lazy}

matplotlibʼda ikki uslub bor:

| Uslub | Körinişi | Nima uçun qulay |
|---|---|---|
| **pyplot** uslubi | `plt.plot(...)`, `plt.title(...)` | tez çiziladigan yakka grafiklar |
| **obyektga yönaltirilgan** (Axes) uslub | `fig, ax = plt.subplots()`, `ax.plot(...)`, `ax.set_title(...)` | bir neça grafik, funksiyalar yoki qayta işlatiladigan kod |

Obyektga yönaltirilgan uslubda **Figure** butun rasm, **Axes** esa uning içidagi öz öqlari, sarlavhasi va maʼlumotlariga ega bitta grafik:

```text
+------------------ Figure -------------------+
|  +------ Axes ------+  +------ Axes ------+ |
|  |  sarlavha        |  |  sarlavha        | |
|  |  y   ...data...  |  |  y   ...data...  | |
|  |      x           |  |      x           | |
|  +------------------+  +------------------+ |
+---------------------------------------------+
```

Rasmiy hujjatlar Axes uslubini tavsiya qiladi, çunki unda har bir buyruq qaysi grafikni özgartirayotgani doim aniq. Mana xuddi şu grafik şu uslubda:

```python
import matplotlib.pyplot as plt

months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun"]
temps = [2, 5, 12, 19, 25, 30]

fig, ax = plt.subplots()
ax.plot(months, temps)
ax.set_title("Toşkentdagi ortaça harorat")
ax.set_xlabel("Oy")
ax.set_ylabel("Harorat (°C)")
plt.show()
```

Grafik aynan bir xil. Nomlar özgarganiga eʼtibor bering: `plt.title()` `ax.set_title()` ga, `plt.xlabel()` esa `ax.set_xlabel()` ga aylanadi. Darsning qolgan qismida Axes uslubi işlatiladi.

## Çiziqli grafiklar: bir neça çiziq, ranglar, markerlar, legendalar

Çiziqli grafiklar biror narsaning **vaqt davomida qanday özgarişini** körsatadi. Har bir çiziq uçun `ax.plot()` ni bir marta çaqiring, har biriga `label` bering va yorliqlarni körsatiş uçun `ax.legend()` ni çaqiring:

```python
import matplotlib.pyplot as plt

months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun"]
tashkent = [2, 5, 12, 19, 25, 30]
nukus = [-3, 0, 8, 17, 24, 29]
termez = [5, 8, 15, 22, 28, 33]

fig, ax = plt.subplots()
ax.plot(months, tashkent, marker="o", label="Toşkent")
ax.plot(months, nukus, marker="s", linestyle="--", label="Nukus")
ax.plot(months, termez, marker="^", color="red", label="Termiz")

ax.set_title("Oylik ortaça harorat, yilning birinçi yarmi")
ax.set_xlabel("Oy")
ax.set_ylabel("Harorat (°C)")
ax.legend()
ax.grid(True, alpha=0.3)
plt.show()
```

Grafikda uçta kötariluvçi çiziq bor: Termiz (qizil, uçburçaklar) har oyda eng issiq, Nukus (uzuq çiziq, kvadratlar) noldan past haroratdan boşlanadi, iyunga kelib esa uçala çiziq bir-biriga yaqinlaşadi. Xira tör qiymatlarni öqişni osonlaştiradi.

Foydali bezak argumentlari:

| Argument | Misollar | Taʼsiri |
|---|---|---|
| `color` | `"red"`, `"tab:green"`, `"#1f77b4"` | çiziq yoki ustun rangi |
| `marker` | `"o"`, `"s"`, `"^"`, `"x"` | har bir nuqtadagi belgi şakli |
| `linestyle` | `"-"`, `"--"`, `":"` | yaxlit, uzuq, nuqtali |
| `linewidth` | `1`, `2.5` | çiziq qalinligi |
| `alpha` | `0.3` | 0 dan 1 gaça şaffoflik |

## Ustunli diagrammalar

Ustunli diagrammalar **toifalar örtasidagi miqdorlarni taqqoslaydi**:

```python
import matplotlib.pyplot as plt

cities = ["Toşkent", "Samarqand", "Buxoro", "Farğona"]
revenue = [297, 182, 187, 145]   # ming söm

fig, ax = plt.subplots()
bars = ax.bar(cities, revenue, color="tab:blue")
ax.bar_label(bars)                 # har bir ustun ustiga qiymatini yozadi
ax.set_title("Şaharlar böyiça tuşum, 2026-yil mart")
ax.set_xlabel("Şahar")
ax.set_ylabel("Tuşum (ming söm)")
plt.show()
```

Grafikda tört vertikal ustun bor: Toşkent 297 bilan aniq eng baland, Farğona esa eng past. `ax.bar_label(bars)` har bir qiymatni öz ustuni ustiga yozadi va öquvçini balandliklarni taxmin qilişdan xalos qiladi.

Toifa nomlari uzun yoki köp bölsa, `barh()` bilan çiziladigan **gorizontal ustunli diagramma** yozuvlarni öqişli saqlaydi. Qiymatlarni oldindan saralaş reytingni yaqqol körsatadi:

```python
import matplotlib.pyplot as plt

products = {
    "Kök çoy": 270,
    "Göştli somsa": 240,
    "Olma şarbati": 156,
    "Holva": 92,
    "Non": 310,
}
ranked = sorted(products.items(), key=lambda pair: pair[1])
names = [name for name, value in ranked]
values = [value for name, value in ranked]

fig, ax = plt.subplots()
ax.barh(names, values, color="tab:orange")
ax.set_title("Mahsulotlar savdosi, birinçi çorak")
ax.set_xlabel("Tuşum (ming söm)")
fig.tight_layout()
plt.show()
```

Ustunlar çapdan öngga çöziladi va şunday saralanganki, eng köp sotilgan mahsulot - non - tepada, holva esa pastda turadi. `barh()` birinçi elementni pastga çizadi, şuning uçun röyxat kiçikdan kattaga qarab saralangan. `fig.tight_layout()` çapdagi uzun mahsulot nomlariga joy ajratadi.

## Gistogrammalar

Gistogramma **qiymatlar qanday taqsimlanganini** körsatadi: u oraliqni bölaklarga (bins) böladi va har bir bölakka neça qiymat tuşganini sanaydi.

```python
import random
import matplotlib.pyplot as plt

random.seed(42)
scores = [min(100, max(0, round(random.gauss(72, 12)))) for _ in range(200)]

fig, ax = plt.subplots()
ax.hist(scores, bins=10, color="tab:green", edgecolor="black")
ax.set_title("200 nafar talabaning imtihon ballari")
ax.set_xlabel("Ball")
ax.set_ylabel("Talabalar soni")
plt.show()
```

Grafik tepaligi 70 va 80 orasida bölgan ustunlardan iborat tepalikka öxşaydi, juda past va juda yuqori ballar olgan talabalar kamroq. `edgecolor` qöşni ustunlar bir-biriga qöşilib ketmasligi uçun çegara çiziqlarini çizadi.

Gistogrammani ustunli diagramma bilan adaştirmang. Ustunli diagramma alohida **toifalarni** (şaharlarni) taqqoslaydi, gistogramma esa **uzluksiz sonni** (ballarni) oraliqlarga guruhlaydi.

## Nuqtali diagrammalar

Nuqtali diagramma (scatter plot) har bir element uçun bitta nuqta çizadi va **ikki son orasidagi boğliqlikni** körsatadi:

```python
import matplotlib.pyplot as plt

area = [35, 48, 52, 60, 67, 75, 80, 92, 105, 120]            # kvadrat metr
price = [420, 560, 590, 700, 760, 880, 910, 1050, 1180, 1400]  # million söm

fig, ax = plt.subplots()
ax.scatter(area, price, color="tab:purple", s=60, alpha=0.7)
ax.set_title("Toşkentdagi kvartira narxlari")
ax.set_xlabel("Maydon (m²)")
ax.set_ylabel("Narx (million söm)")
ax.grid(True, alpha=0.3)
plt.show()
```

Nuqtalar pastki çap burçakdan yuqori öng burçakka qarab kötariladi: kattaroq kvartiralar deyarli töğri çiziq böylab qimmatroq. `s` nuqta ölçamini belgilaydi.

## Doiraviy diagrammalar va bitta ogohlantiriş

Doiraviy diagramma (pie chart) **butunning qismlarini** körsatadi:

```python
import matplotlib.pyplot as plt

labels = ["Naqd pul", "Karta", "Click", "Payme"]
shares = [35, 30, 20, 15]

fig, ax = plt.subplots()
ax.pie(shares, labels=labels, autopct="%1.0f%%", startangle=90)
ax.set_title("Mijozlar qanday tölaydi")
plt.show()
```

Grafik foizlar yozilgan tört bölakka bölingan doira: eng katta bölak - 35% bilan naqd pul. `autopct` foiz matnini formatlaydi, `startangle=90` esa birinçi bölakni tepadan boşlaydi.

::: warning Doiraviy diagrammalarni kam işlating
Odamlar burçaklarni yomon taqqoslaydi. 35% 30% dan körinarli darajada kattami? Ustunli diagrammada farq yaqqol körinadi. Doiraviy diagrammani faqat maʼnoli butunni taşkil etadigan **oz sonli** (taxminan 2-5 ta) bölak uçun işlating. Aks holda ustunli diagrammani tanlang.
:::

## Bitta rasmda bir neça grafik: subplots

`plt.subplots(nrows, ncols)` Axesʼlardan iborat tör yaratadi. Bir qator va ikki ustun bilan ikki Axesʼdan iborat massiv olasiz, uni ajratib oliş mumkin:

```python
import matplotlib.pyplot as plt

months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun"]
temps = [2, 5, 12, 19, 25, 30]
rain = [55, 47, 70, 64, 29, 8]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))

ax1.plot(months, temps, marker="o", color="tab:red")
ax1.set_title("Harorat")
ax1.set_ylabel("°C")

ax2.bar(months, rain, color="tab:blue")
ax2.set_title("Yoğingarçilik")
ax2.set_ylabel("mm")

fig.suptitle("Toşkent ob-havosi, yanvar–iyun")
fig.tight_layout()
plt.show()
```

Rasmda yonma-yon ikki grafik bor: çapda kötarilayotgan haroratning qizil çiziği, öngda esa martda eng yuqori nuqtaga yetib, iyunga kelib deyarli yöqolib ketadigan yoğingarçilikning kök ustunlari.

- `figsize=(10, 4)` rasm ölçamini dyuymlarda belgilaydi (eni, böyi).
- `fig.suptitle()` barça grafiklar ustiga bitta umumiy sarlavha qöşadi.
- `fig.tight_layout()` sarlavha va yozuvlar ustma-ust tuşmasligi uçun oraliqlarni moslaydi.

2 qator va 2 ustunli tör uçun `fig, axes = plt.subplots(2, 2)` dan foydalaning va har bir grafikka `axes[row, col]` orqali murojaat qiling - xuddi *Içma-iç maʼlumotlar* darsidagi törlar kabi.

## Rasmlarni saqlaş

`fig.savefig()` grafikni rasm fayliga yozadi. Fayl turi kengaytmadan aniqlanadi: `.png`, `.jpg`, `.svg` yoki `.pdf`.

```python
from pathlib import Path
import matplotlib.pyplot as plt

cities = ["Toşkent", "Samarqand", "Buxoro"]
visitors = [820, 1240, 960]   # yiliga ming kişi

fig, ax = plt.subplots()
ax.bar(cities, visitors)
ax.set_title("Yiliga turistlar taşrifi")
ax.set_ylabel("Taşrif buyuruvçilar (ming)")

fig.savefig("visitors.png", dpi=150, bbox_inches="tight")
print(Path("visitors.png").exists())
```

```text
True
```

- `dpi=150` aniqlikni belgilaydi. Ekran uçun 100 yetarli, bosma uçun 300 yaxşi.
- `bbox_inches="tight"` ortiqça oq joyni kesadi va uzun yozuvlar kesilib qolmasligini taʼminlaydi.
- `savefig()` ni `plt.show()` dan **oldin** çaqiring. Skriptda grafik oynasi yopilgandan keyin böş rasm saqlanib qolişi mumkin.
- Sikl köp rasm yaratsa (masalan, har bir şahar uçun bitta grafik), har birini saqlagandan keyin `plt.close(fig)` ni çaqiring, aks holda matplotlib ularning hammasini xotirada saqlab turadi va ogohlantiriş beradi.

::: info `plt.show()` qayerda kerak
`.py` faylda va bu saytdagi muharrirda grafikni aynan `plt.show()` körsatadi (bu yerda u natija ostida paydo böladi). Jupyter va [Laboratoriya](/uz/laboratoriya) da rasm katak oxirida avtomatik körsatiladi, şuning uçun `plt.show()` ni yozmasangiz ham böladi.
:::

## Töğridan-töğri pandasʼdan çiziş

DataFrame yoki Seriesʼda siz uçun matplotlibʼni çaqiradigan `.plot()` metodi bor. U x öqi uçun indeksdan, legenda uçun esa ustun nomlaridan foydalanadi:

```python
import io
import pandas as pd
import matplotlib.pyplot as plt

text = """city,product,quantity,price
Toşkent,Çoy,4,15000
Samarqand,Somsa,10,8000
Toşkent,Şarbat,3,12000
Buxoro,Çoy,5,15000
Toşkent,Somsa,12,8000
Samarqand,Şarbat,6,12000
Buxoro,Somsa,8,8000
Toşkent,Çoy,7,15000
Samarqand,Çoy,2,15000
Buxoro,Şarbat,4,12000
"""
sales = pd.read_csv(io.StringIO(text))
sales["revenue"] = sales["quantity"] * sales["price"]

table = sales.pivot_table(index="city", columns="product",
                          values="revenue", aggfunc="sum")

ax = table.plot(kind="bar", rot=0)
ax.set_title("Şahar va mahsulot böyiça tuşum")
ax.set_xlabel("Şahar")
ax.set_ylabel("Tuşum (söm)")
plt.show()
```

Grafik har bir şahar uçun uçtadan ustunni (Somsa, Çoy, Şarbat) guruhlaydi va mahsulotlar uçun legenda körsatadi. Toşkentdagi çoy - eng baland ustun.

`kind` `"line"`, `"bar"`, `"barh"`, `"hist"`, `"scatter"` yoki `"pie"` bölişi mumkin. `rot=0` şahar nomlarini gorizontal holda saqlaydi. `.plot()` Axes qaytargani uçun uni xuddi şu `ax.set_...` metodlari bilan sozlaysiz. Özingiz yaratgan subplot içida pandas grafigini çiziş uçun `ax=` ni ham berişingiz mumkin.

## Töğri grafikni tanlaş

| Nimani körsatmoqçisiz | Nima işlatiladi | Misol |
|---|---|---|
| vaqt davomidagi özgariş | çiziqli grafik | oylik harorat |
| toifalar örtasidagi taqqoslaş | ustunli diagramma | şahar böyiça tuşum |
| uzun nomli reyting | gorizontal ustunli diagramma | eng yaxşi mahsulotlar |
| qiymatlar taqsimoti | gistogramma | imtihon ballari |
| ikki son orasidagi boğliqlik | nuqtali diagramma | maydon va narx |
| butunning qismlari (oz sonli) | doiraviy yoki ustunli diagramma | tölov usullari |

Ikkilanganingizda ustunli diagramma yoki çiziqli grafikdan boşlang. Ularni öqiş eng oson.

## Özingiz sinab köring

Maʼlumotlarni, ranglarni özgartiring yoki `kind="bar"` ni `kind="barh"` ga almaştirib, qayta işga tuşiring.

<ClientOnly><PythonPlayground :code='"import pandas as pd\nimport matplotlib.pyplot as plt\n\ndata = pd.DataFrame({\n    \"month\": [\"Yan\", \"Fev\", \"Mar\", \"Apr\", \"May\", \"Iyun\"],\n    \"Toşkent\": [2, 5, 12, 19, 25, 30],\n    \"Nukus\": [-3, 0, 8, 17, 24, 29],\n}).set_index(\"month\")\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))\ndata.plot(ax=ax1, marker=\"o\")\nax1.set_title(\"Oylar böyiça harorat\")\nax1.set_ylabel(\"Harorat (C)\")\n\ndata.mean().plot(kind=\"bar\", ax=ax2, color=\"tab:orange\", rot=0)\nax2.set_title(\"Ortaça harorat\")\nax2.set_ylabel(\"Harorat (C)\")\n\nfig.tight_layout()\nplt.show()"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. `plt.show()` ni unutiş

```py
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [4, 1, 5])
# Yomon: skript tugaydi va oyna heç qaçon oçilmaydi
```

Skriptda `plt.show()` işga tuşmagunça heç narsa körinmaydi. Jupyter notebookʼlari grafiklarni avtomatik körsatadi, şuning uçun bu xato köpinça kod notebookʼdan `.py` fayliga köçirilganda paydo böladi.

### 2. Ustma-ust tuşgan yozuvlar

x öqidagi uzun toifa nomlari bir-biriga urilib ketadi:

```py
ax.bar(["Toşkent viloyati", "Samarqand viloyati", "Qaşqadaryo viloyati"], [30, 25, 18])
```

Buni yozuvlarni burib, matplotlibʼga oraliqlarni tuzatişga ruxsat berib yoki `barh()` ga ötib tuzating:

```py
ax.tick_params(axis="x", labelrotation=45)   # Yaxşi: qiya yozuvlar
fig.tight_layout()                           # Yaxşi: kesilmagan yozuvlar
```

### 3. Yozuvlar va ölçov birliklarisiz sonlar

```py
fig, ax = plt.subplots()
ax.plot(months, revenue)      # Yomon: sarlavha ham, öq yozuvlari ham yöq
plt.show()
```

Öquvçi taxmin qilişga majbur: gradusmi yoki millimetrmi? Sömmi yoki dollarmi? Doim sarlavha qöying va ikkala öqqa ham ölçov birligi bilan yozuv qöşing: `ax.set_ylabel("Tuşum (ming söm)")`. Önlab ingiçka bölakli doiraviy diagrammalarga ham xuddi şu taalluqli: eng katta bir neça toifani qoldiring, qolganlarini "Boşqa" ga birlaştiring yoki saralangan `barh()` dan foydalaning.

### 4. `plt.` va `ax.` nomlarini aralaştiriş

```py
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.title("Sotuvlar")    # Yomon: Axes'da set_title işlatiladi
```

```text
TypeError: 'Text' object is not callable
```

Axesʼda `set_` variantlaridan foydalaning: `ax.set_title()`, `ax.set_xlabel()`, `ax.set_ylabel()`. `plt.title()` da `set_` yöq, çunki u joriy grafik ustida işlaydi.

## Maşqlar

### 1. Haftalik qadamlar <Difficulty level="1" />

Aziza bir hafta davomida qadamlarini sanadi. Markerli, `Azizaning bu haftadagi qadamlari` sarlavhali va öqlariga yozuv qöyilgan çiziqli grafik çizing. Grafikni tekşiriş uçun uning sarlavhasini `ax.get_title()` bilan, keyin `ax.lines[0].get_ydata()` dan öqilgan çiziqdagi nuqtalar soni va eng katta qiymatni çiqaring.

```python
days = ["Du", "Se", "Ça", "Pa", "Ju", "Şa", "Ya"]
steps = [6200, 8400, 7100, 9800, 5600, 12300, 10100]
```

::: details Yeçim
```python
import matplotlib.pyplot as plt

days = ["Du", "Se", "Ça", "Pa", "Ju", "Şa", "Ya"]
steps = [6200, 8400, 7100, 9800, 5600, 12300, 10100]

fig, ax = plt.subplots()
ax.plot(days, steps, marker="o")
ax.set_title("Azizaning bu haftadagi qadamlari")
ax.set_xlabel("Kun")
ax.set_ylabel("Qadamlar")
ax.grid(True, alpha=0.3)

line_values = ax.lines[0].get_ydata()
print(ax.get_title())
print(len(line_values), "ta nuqta, eng yuqorisi", max(line_values))
plt.show()
```

```text
Azizaning bu haftadagi qadamlari
7 ta nuqta, eng yuqorisi 12300
```

Çiziq jumada pasayadi va şanbada 12 300 qadam bilan eng yuqori nuqtaga çiqadi.
:::

### 2. Kutubxonadan olingan kitoblar <Difficulty level="1" />

Janrlar böyiça olingan kitoblar sonini gorizontal ustunli diagrammada çizing: eng maşhur janr tepada bölsin. Grafikni tekşiriş uçun janr yozuvlarini pastdan tepaga qarab (`ax.get_yticklabels()`, har bir yozuvning `get_text()` i) va ustunlar uzunliklarini (`ax.patches`, har bir ustunning `get_width()` i) çiqaring.

```python
loans = {"Şeʼriyat": 45, "Tarix": 80, "Fan": 62, "Romanlar": 130, "Bolalar": 95}
```

::: details Yeçim
```python
import matplotlib.pyplot as plt

loans = {"Şeʼriyat": 45, "Tarix": 80, "Fan": 62, "Romanlar": 130, "Bolalar": 95}
ranked = sorted(loans.items(), key=lambda pair: pair[1])

fig, ax = plt.subplots()
ax.barh([genre for genre, n in ranked], [n for genre, n in ranked])
ax.set_title("Janrlar böyiça olingan kitoblar")
ax.set_xlabel("Olingan kitoblar soni")

print([label.get_text() for label in ax.get_yticklabels()])
print([int(bar.get_width()) for bar in ax.patches])
plt.show()
```

```text
['Şeʼriyat', 'Fan', 'Tarix', 'Bolalar', 'Romanlar']
[45, 62, 80, 95, 130]
```

Romanlar 130 ta bilan tepada turadi. Kiçikdan kattaga saralaş işlaydi, çunki `barh()` birinçi ustunni pastga çizadi.
:::

### 3. Böy gistogrammasi va nuqtali diagramma <Difficulty level="2" />

Quyidagi maʼlumotlardan foydalanib, yonma-yon ikki grafikli rasm yarating: 8 bölakli böy gistogrammasi va böy (x) hamda vazn (y) nuqtali diagrammasi. Har bir grafikka sarlavha va öq yozuvlarini bering hamda `100 nafar katta yoşli odam sörovi` umumiy sarlavhasini qöşing. Rasmni tekşiriş uçun umumiy sarlavhani `fig.get_suptitle()` bilan, keyin gistogramma ustunlari (`ax1.patches`) va nuqtalar (`ax2.collections[0].get_offsets()`) sonini çiqaring.

```python
import random

random.seed(7)
heights = [round(random.gauss(170, 8), 1) for _ in range(100)]
weights = [round(h * 0.9 - 88 + random.gauss(0, 6), 1) for h in heights]
```

::: details Yeçim
```python
import random
import matplotlib.pyplot as plt

random.seed(7)
heights = [round(random.gauss(170, 8), 1) for _ in range(100)]
weights = [round(h * 0.9 - 88 + random.gauss(0, 6), 1) for h in heights]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))

ax1.hist(heights, bins=8, edgecolor="black")
ax1.set_title("Böy taqsimoti")
ax1.set_xlabel("Böy (sm)")
ax1.set_ylabel("Odamlar")

ax2.scatter(heights, weights, alpha=0.6)
ax2.set_title("Böy va vazn")
ax2.set_xlabel("Böy (sm)")
ax2.set_ylabel("Vazn (kg)")

fig.suptitle("100 nafar katta yoşli odam sörovi")
fig.tight_layout()

print(fig.get_suptitle())
print(len(ax1.patches), "ta ustun,", len(ax2.collections[0].get_offsets()), "ta nuqta")
plt.show()
```

```text
100 nafar katta yoşli odam sörovi
8 ta ustun, 100 ta nuqta
```

Gistogramma böylarning köpçiligi 160 va 180 sm orasida ekanini körsatadi, nuqtali diagramma esa yuqoriga qarab kötariladi: böyi balandroq odamlar odatda köproq vaznga ega.
:::

### 4. Grafikni saqlaş <Difficulty level="2" />

Har bir guruhdagi talabalar soni böyiça ustunli diagramma çizing, uni `dpi=200` va tight bounding box bilan `groups.png` sifatida saqlang, keyin saqlangan fayl 0 baytdan kattami yöqmi, çop eting.

```python
groups = ["A", "B", "C", "D"]
students = [24, 28, 19, 26]
```

::: details Yeçim
```python
from pathlib import Path
import matplotlib.pyplot as plt

groups = ["A", "B", "C", "D"]
students = [24, 28, 19, 26]

fig, ax = plt.subplots()
ax.bar(groups, students, color="tab:cyan")
ax.set_title("Guruhlardagi talabalar soni")
ax.set_xlabel("Guruh")
ax.set_ylabel("Talabalar")

fig.savefig("groups.png", dpi=200, bbox_inches="tight")
print(Path("groups.png").stat().st_size > 0)
```

```text
True
```
:::

### 5. Kiçik savdo dashboardi <Difficulty level="3" />

Quyidagi savdo maʼlumotlari va pandas yordamida yonma-yon **ikki subplot**li rasm yarating:

1. şaharlar böyiça jami tuşumning kattadan kiçikka saralangan ustunli diagrammasi
2. oylar böyiça jami tuşumning markerli çiziqli grafigi

Har bir grafikka sarlavha va öq yozuvlarini bering, umumiy sarlavha qöşing va `tight_layout()` dan foydalaning.

```text
date,city,quantity,price
2026-01-05,Toşkent,4,15000
2026-01-12,Samarqand,10,8000
2026-01-20,Buxoro,3,12000
2026-02-03,Buxoro,5,15000
2026-02-14,Toşkent,12,8000
2026-02-21,Samarqand,6,12000
2026-03-02,Buxoro,8,8000
2026-03-10,Toşkent,7,15000
2026-03-18,Samarqand,2,15000
2026-04-06,Toşkent,9,12000
2026-04-15,Samarqand,11,8000
2026-04-25,Buxoro,6,15000
```

::: details Yeçim
```python
import io
import pandas as pd
import matplotlib.pyplot as plt

text = """date,city,quantity,price
2026-01-05,Toşkent,4,15000
2026-01-12,Samarqand,10,8000
2026-01-20,Buxoro,3,12000
2026-02-03,Buxoro,5,15000
2026-02-14,Toşkent,12,8000
2026-02-21,Samarqand,6,12000
2026-03-02,Buxoro,8,8000
2026-03-10,Toşkent,7,15000
2026-03-18,Samarqand,2,15000
2026-04-06,Toşkent,9,12000
2026-04-15,Samarqand,11,8000
2026-04-25,Buxoro,6,15000
"""
sales = pd.read_csv(io.StringIO(text), parse_dates=["date"])
sales["revenue"] = sales["quantity"] * sales["price"] / 1000   # ming söm

by_city = sales.groupby("city")["revenue"].sum().sort_values(ascending=False)
by_month = sales.groupby(sales["date"].dt.month)["revenue"].sum()
print(by_city)
print(by_month)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))

ax1.bar(by_city.index, by_city.values, color="tab:blue")
ax1.set_title("Şaharlar böyiça tuşum")
ax1.set_xlabel("Şahar")
ax1.set_ylabel("Tuşum (ming söm)")

ax2.plot(by_month.index, by_month.values, marker="o", color="tab:green")
ax2.set_title("Oylar böyiça tuşum")
ax2.set_xlabel("Oy")
ax2.set_ylabel("Tuşum (ming söm)")
ax2.set_xticks(by_month.index)
ax2.grid(True, alpha=0.3)

fig.suptitle("Savdo dashboardi, 2026-yil yanvar–aprel")
fig.tight_layout()
plt.show()
```

```text
city
Toşkent      369.0
Samarqand    270.0
Buxoro       265.0
Name: revenue, dtype: float64
date
1    176.0
2    243.0
3    199.0
4    286.0
Name: revenue, dtype: float64
```

Çap grafik şaharlarni reyting böyiça joylaştiradi, Toşkent birinçi. Öng grafik oylik tuşum fevralda ösganini, martda pasayganini va aprelda eng yuqori nuqtaga yetganini körsatadi. `set_xticks()` oy öqida faqat butun oy raqamlarini körsatadi. `groupby` natijalari Series bölgani uçun `.index` yozuvlarni, `.values` esa çiziladigan sonlarni beradi.
:::

## Xulosa

- `import matplotlib.pyplot as plt` bilan import qiling, çizing va `plt.show()` bilan yakunlang.
- Axes uslubini afzal köring: `fig, ax = plt.subplots()`, keyin `ax.plot()`, `ax.bar()`, `ax.barh()`, `ax.hist()`, `ax.scatter()` yoki `ax.pie()`.
- Doim sarlavha va ölçov birligi körsatilgan öq yozuvlarini qöşing. Bir neça qator maʼlumot uçun `label=` va `ax.legend()` dan foydalaning.
- `plt.subplots(rows, cols, figsize=...)` grafiklar törini yaratadi, `fig.tight_layout()` esa ustma-ust tuşişni tuzatadi.
- Körsatişdan oldin `fig.savefig("chart.png", dpi=150, bbox_inches="tight")` bilan saqlang, sikllarda esa `plt.close(fig)` ni çaqiring; pandas obyektlari `.plot(kind=...)` bilan töğridan-töğri çiziladi.
- Grafikni savolga moslang: vaqt uçun çiziqli, toifalar uçun ustunli, taqsimot uçun gistogramma, boğliqlik uçun nuqtali, butunning oz sonli qismlari uçungina doiraviy diagramma.

## Qöşimça manbalar

- [matplotlib: Quick start guide](https://matplotlib.org/stable/users/explain/quick_start.html)
- [matplotlib: Plot types gallery](https://matplotlib.org/stable/plot_types/index.html)
- [pandas: Chart visualization](https://pandas.pydata.org/docs/user_guide/visualization.html)
