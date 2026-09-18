---
title: Maʼlumot fayllarini öqiş
description: "CSV va JSON maʼlumotlarini pandas DataFrameʼlariga yuklaş, ularni körib çiqiş, qator va ustunlarni tanlaş, filtrlaş, yöq qiymatlarni tuzatiş, turlarni özgartiriş va natijani saqlaş."
---

# Maʼlumot fayllarini öqiş

![Rasm: Maʼlumot fayllarini öqiş](/images/topics-webp-uzb/reading-data.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Maʼlumotlar bir neça qatordan köpayganda jadvallar bilan işlaydigan kutubxona nega foydali ekanini
- pandasʼning ikki asosiy obyekti: **Series** va **DataFrame**
- `read_csv` va `read_json` bilan maʼlumot yuklaş va unga ilk bor nazar taşlaşni
- `[]`, `.loc` va `.iloc` bilan ustun va qatorlarni tanlaş, mantiqiy niqoblar bilan filtrlaşni
- Yöq qiymatlarni topiş va tuzatiş, turlarni özgartiriş va natijalarni saqlaşni
:::

## Nega bu muhim

*CSV bilan işlaş* va *JSON bilan işlaş* darslarida siz maʼlumotlarni standart kutubxona (standard library) yordamida öqigansiz. Bu yaxşi işlaydi, lekin har bir savol uçun sikl kerak böladi: "Samarqanddagi umumiy tuşum qança?" degan savol qatorlarni öqiş, `DictReader` bergan satrlarni songa aylantiriş, şartni tekşiriş va qiymatlarni qöşib çiqişni talab qiladi.

Haqiqiy maʼlumotlarning aksariyati **jadval** körinişida böladi: savdo yozuvlari, ob-havo ölçovlari, imtihon natijalari, bank tranzaksiyalari. **pandas** jadvallar uçun eng keng qöllaniladigan Python kutubxonasidir. U faylni bir qatorda öqiydi, sonlar va sanalarni tuşunadi hamda yuqoridagi kabi savollarga bitta ifoda bilan javob beradi. Dökonlar, banklar, olimlar va jurnalistlar undan har kuni foydalanadi.

## pandasʼni örnatiş

pandas **uçinçi tomon** (third-party) paketi, yaʼni u Python bilan birga kelmaydi. Öz kompyuteringizda uni (*matplotlib bilan grafiklar* darsida kerak böladigan matplotlib bilan birga) terminaldan örnating:

```text
python -m pip install pandas matplotlib
```

Bu saytdagi muharrirda heç nima örnatiş şart emas: kodingiz pandasʼni import qilganda u avtomatik yuklanadi.

Odatda hamma pandasʼni qisqa `pd` nomi bilan import qiladi:

```py
import pandas as pd
```

::: info pandas versiyalari
Bu darsdagi natijalar pandas 3 dan olingan. Agar sizda pandas 2 bölsa, deyarli hammasi bir xil körinadi. Asosiy körinadigan farqlar: matnli ustunlar `str` örniga `object` turini, sanalar esa `datetime64[us]` örniga `datetime64[ns]` ni körsatadi.
:::

## Series: bitta ustun maʼlumot

**Series** - bu yorliqlarga ega qiymatlardan iborat bitta ustun. Yorliqlar **indeks** (index) deyiladi.

```python
import pandas as pd

temps = pd.Series([31, 34, 29], index=["Toşkent", "Buxoro", "Nukus"])
print(temps)
print()
print(temps["Buxoro"])
print(temps.mean())
```

```text
Toşkent    31
Buxoro     34
Nukus      29
dtype: int64

34
31.333333333333332
```

Çap ustun indeks, ong ustun esa qiymatlar. `dtype: int64` har bir qiymat 64 bitli butun son ekanini bildiradi. Röyxatdan farqli ravişda, Series barça qiymatlari ustida bir yöla hisob-kitob qiladi: `temps * 9 / 5 + 32` har bir haroratni Farengeytga aylantiradi.

## DataFrame: butun jadval

**DataFrame** - bu jadval: bir xil indeksga ega bir neça Series, har bir ustun uçun bittadan. Uni yaratişning eng oson yöli - röyxatlardan iborat luğat (dictionary). Unda har bir kalit ustun nomiga aylanadi:

```python
import pandas as pd

df = pd.DataFrame({
    "city": ["Toşkent", "Samarqand", "Buxoro"],
    "population": [3040000, 580000, 290000],
    "region": ["Toşkent", "Samarqand", "Buxoro"],
})
print(df)
```

```text
        city  population     region
0    Toşkent     3040000    Toşkent
1  Samarqand      580000  Samarqand
2     Buxoro      290000     Buxoro
```

pandas çap tomonga standart `0, 1, 2` indeksini qöşadi. DataFrameʼni **luğatlar röyxatidan** ham yaratiş mumkin. Bu *Içma-iç maʼlumotlar* darsidagi şakl va `json.load()` köpinça qaytaradigan şakl:

```python
import pandas as pd

students = [
    {"name": "Aziza", "age": 20, "score": 91},
    {"name": "Bekzod", "age": 22, "score": 78},
    {"name": "Dilnoza", "age": 19},
]
df = pd.DataFrame(students)
print(df)
```

```text
      name  age  score
0    Aziza   20   91.0
1   Bekzod   22   78.0
2  Dilnoza   19    NaN
```

Dilnozaning bahosi yöq, şuning uçun pandas böşliqni `NaN` ("not a number", yaʼni "son emas") bilan töldiradi. Bu uning **yöq qiymat** (missing value) belgisi. `NaN` önlik son (float) bölgani uçun butun `score` ustuni önlik sonlarga aylandi. Buni darsning keyingi qismida tuzatasiz.

## CSV va JSON fayllarini öqiş

`pd.read_csv()` butun CSV faylni DataFrameʼga öqiydi. U sarlavha qatorini aniqlaydi va sonlarni avtomatik aylantiradi:

```python
import pandas as pd

with open("sales.csv", "w", encoding="utf-8") as f:
    f.write("""date,city,product,quantity,price
2026-03-01,Toşkent,Çoy,4,15000
2026-03-01,Samarqand,Somsa,10,8000
2026-03-02,Toşkent,Somsa,6,8000
2026-03-02,Buxoro,Çoy,3,15000
2026-03-03,Samarqand,Şarbat,5,12000
2026-03-03,Toşkent,Şarbat,2,12000
""")

sales = pd.read_csv("sales.csv")
print(sales)
```

```text
         date       city product  quantity  price
0  2026-03-01    Toşkent     Çoy         4  15000
1  2026-03-01  Samarqand   Somsa        10   8000
2  2026-03-02    Toşkent   Somsa         6   8000
3  2026-03-02     Buxoro     Çoy         3  15000
4  2026-03-03  Samarqand  Şarbat         5  12000
5  2026-03-03    Toşkent  Şarbat         2  12000
```

`pd.read_json()` yozuvlar röyxatini saqlaydigan JSON fayllar uçun xuddi şunday işlaydi:

```python
import json
import pandas as pd

records = [
    {"city": "Toşkent", "temp": 31.5, "humidity": 22},
    {"city": "Nukus", "temp": 29.0, "humidity": 30},
]
with open("weather.json", "w", encoding="utf-8") as f:
    json.dump(records, f)

weather = pd.read_json("weather.json")
print(weather)
```

```text
      city  temp  humidity
0  Toşkent  31.5        22
1    Nukus  29.0        30
```

::: tip Satrdan öqiş
Fayl yaratmasdan tajriba qiliş uçun matnni `io.StringIO` ga örang - u oçiq fayl kabi işlaydi: `pd.read_csv(io.StringIO(text))`. Quyidagi köp misollar şu usuldan foydalanadi.
:::

Haqiqiy fayllar bulardan ancha tartibsizroq böladi. Eng köp kerak böladigan parametrlar: nuqtali vergul bilan ajratilgan fayllar uçun `sep=";"` (Excel eksportlarida köp uçraydi), eski Windows fayllari uçun `encoding="cp1251"`, faqat baʼzi ustunlarni yuklaş uçun `usecols=["date", "price"]`, pandas ID larni songa aylantirmasligi uçun `dtype={"id": str}` va `35 000` kabi yozilgan narxlar uçun `thousands=" "`.

::: info Öz fayllaringiz brauzerda
Kompyuteringizda `pd.read_csv()` URL ni ham qabul qiladi (`pd.read_csv("https://.../sales.csv")`). Bu saytdagi muharrirda esa brauzerlar boşqa saytlardan yuklab olişning köpini bloklaydi (CORS qoidasi) va fayl tanlaş oynasi yöq, şuning uçun faylni misollardagidek kodda yarating yoki maʼlumotlaringizni satrga joylang. Öz fayllaringiz bilan işlaş uçun fayl brauzeri va yuklaş tugmasi bor [Laboratoriya](/uz/laboratoriya) dan foydalaning.
:::

## Ilk nazar

Yangi faylni yuklaganingizda, boşqa işlarga kirişişdan oldin uning ölçami va mazmunini tekşiring. Keyingi misollar şu ob-havo jadvalidan foydalanadi:

```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Toşkent", "Samarqand", "Buxoro", "Nukus", "Farğona", "Termiz"],
    "temp": [31.5, 29.0, 34.2, 28.1, 30.4, 36.8],
    "humidity": [22, 25, 18, 30, 35, 15],
    "rain_mm": [0.0, 1.2, 0.0, 0.0, 3.5, 0.0],
})

print(weather.head(3))     # dastlabki 3 qator (standart qiymat 5)
print()
print(weather.tail(2))     # oxirgi 2 qator
print()
print(weather.shape)       # (qatorlar, ustunlar)
print(list(weather.columns))
print()
print(weather.dtypes)
```

```text
        city  temp  humidity  rain_mm
0    Toşkent  31.5        22      0.0
1  Samarqand  29.0        25      1.2
2     Buxoro  34.2        18      0.0

      city  temp  humidity  rain_mm
4  Farğona  30.4        35      3.5
5   Termiz  36.8        15      0.0

(6, 4)
['city', 'temp', 'humidity', 'rain_mm']

city            str
temp        float64
humidity      int64
rain_mm     float64
dtype: object
```

`shape` va `columns` atributlar, şuning uçun ularda qavs yöq. `weather.info()` xuddi şu maʼlumotlarni, jumladan har bir ustunda neça yöq bölmagan qiymat borligini, bitta hisobotda çiqaradi, `weather.describe()` esa har bir sonli ustun uçun soni, örtaçasi, standart çetlanişi, minimumi, kvartillari va maksimumini beradi (öqişga qulay bölişi uçun `.round(2)` qöşing).

## Ustunlarni tanlaş

Bitta ustunni **Series** sifatida oliş uçun kvadrat qavs içiga ustun nomini yozing. Kiçikroq **DataFrame** oliş uçun nomlar **röyxatini** bering:

```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Toşkent", "Samarqand", "Buxoro", "Nukus"],
    "temp": [31.5, 29.0, 34.2, 28.1],
    "humidity": [22, 25, 18, 30],
})

print(weather["temp"])
print()
print(weather[["city", "temp"]])
print()
print(weather["temp"].max())
```

```text
0    31.5
1    29.0
2    34.2
3    28.1
Name: temp, dtype: float64

        city  temp
0    Toşkent  31.5
1  Samarqand  29.0
2     Buxoro  34.2
3      Nukus  28.1

34.2
```

`weather[["city", "temp"]]` dagi qöş qavsga eʼtibor bering: taşqi juftlik tanlaş, içki juftlik esa Python röyxati.

## Qatorlarni tanlaş: `.loc` va `.iloc`

Qatorlarni tanlaşning ikki yöli bor:

| Usul | Nima böyiça tanlaydi | Misol | Kesim oxiri |
|---|---|---|---|
| `.loc[]` | indeks **yorliqlari** va ustun nomlari | `df.loc["Buxoro", "temp"]` | kiradi |
| `.iloc[]` | butun sonli **pozitsiyalar** (röyxat indekslari kabi) | `df.iloc[2, 1]` | kirmaydi |

Indeks maʼnoli bölganda yorliqlarni köriş osonroq, şuning uçun bu misolda `set_index()` yordamida şahar indeksga aylantirilgan:

```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Toşkent", "Samarqand", "Buxoro", "Nukus"],
    "temp": [31.5, 29.0, 34.2, 28.1],
    "humidity": [22, 25, 18, 30],
}).set_index("city")

print(weather)
print()
print(weather.loc["Buxoro"])                   # bitta qator, Series sifatida
print()
print(weather.loc["Buxoro", "temp"])           # bitta katak
print(weather.loc["Samarqand":"Nukus", "temp"].tolist())
print()
print(weather.iloc[0])                         # pozitsiya böyiça birinçi qator
```

```text
           temp  humidity
city                     
Toşkent    31.5        22
Samarqand  29.0        25
Buxoro     34.2        18
Nukus      28.1        30

temp        34.2
humidity    18.0
Name: Buxoro, dtype: float64

34.2
[29.0, 34.2, 28.1]

temp        31.5
humidity    22.0
Name: Toşkent, dtype: float64
```

`"Samarqand":"Nukus"` yorliq kesimiga Nukus **kiradi**, `weather.iloc[1:3]` kabi pozitsiya kesimi esa xuddi röyxat kesimi kabi 3-pozitsiyadan oldin töxtaydi.

## Mantiqiy niqoblar bilan filtrlaş

Ustunni qiymat bilan taqqoslaş `True`/`False` qiymatlardan iborat Series beradi. U **mantiqiy niqob** (boolean mask) deyiladi. Faqat `True` qatorlarni qoldiriş uçun niqobni `[]` içiga qöying:

```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Toşkent", "Samarqand", "Buxoro", "Nukus", "Farğona", "Termiz"],
    "temp": [31.5, 29.0, 34.2, 28.1, 30.4, 36.8],
    "humidity": [22, 25, 18, 30, 35, 15],
})

hot = weather["temp"] > 31
print(hot)
print()
print(weather[hot])
```

```text
0     True
1    False
2     True
3    False
4    False
5     True
Name: temp, dtype: bool

      city  temp  humidity
0  Toşkent  31.5        22
2   Buxoro  34.2        18
5   Termiz  36.8        15
```

Şartlarni birlaştiriş uçun `&` (va), `|` (yoki) va `~` (emas) dan foydalaning hamda **har bir şartni qavsga oling**. `.isin()` röyxatdagi `in` kabi aʼzolikni tekşiradi:

```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Toşkent", "Samarqand", "Buxoro", "Nukus", "Farğona", "Termiz"],
    "temp": [31.5, 29.0, 34.2, 28.1, 30.4, 36.8],
    "humidity": [22, 25, 18, 30, 35, 15],
})

print(weather[(weather["temp"] > 30) & (weather["humidity"] < 20)])
print()
print(weather[weather["city"].isin(["Nukus", "Farğona"])]["city"].tolist())
print(weather.loc[weather["temp"] < 30, "city"].tolist())
```

```text
     city  temp  humidity
2  Buxoro  34.2        18
5  Termiz  36.8        15

['Nukus', 'Farğona']
['Samarqand', 'Nukus']
```

Oxirgi qator foydali andozani körsatadi: `.loc[mask, column]` bir qadamda qatorlarni filtrlaydi va ustunni tanlaydi.

## Yöq qiymatlar

Haqiqiy fayllarda böşliqlar böladi: sensor öçib qolgan yoki kassir maydonni töldirmagan. pandas CSVʼdagi böş kataklarni `NaN` sifatida öqiydi. Ularni topiş uçun `.isna()` dan foydalaning:

```python
import io
import pandas as pd

text = """city,temp,humidity
Toşkent,31.5,22
Samarqand,,25
Buxoro,34.2,
Nukus,28.1,30
"""
weather = pd.read_csv(io.StringIO(text))
print(weather.isna().sum())      # har bir ustundagi yöq qiymatlar
print()
print(weather.dropna(subset=["temp"]))
print()
filled = weather.fillna({"temp": round(weather["temp"].mean(), 1), "humidity": 0})
print(filled)
```

```text
city        0
temp        1
humidity    1
dtype: int64

      city  temp  humidity
0  Toşkent  31.5      22.0
2   Buxoro  34.2       NaN
3    Nukus  28.1      30.0

        city  temp  humidity
0    Toşkent  31.5      22.0
1  Samarqand  31.3      25.0
2     Buxoro  34.2       0.0
3      Nukus  28.1      30.0
```

`isna()` `True`/`False` jadvalini qaytaradi, `.sum()` esa `True` qiymatlarni sanaydi. Keyin ikki yöl bor: töliq bölmagan qatorlarni **olib taşlaş** (`dropna()` yoki faqat körsatilgan ustunlarga qaraydigan `dropna(subset=[...])`) yoki böşliqlarni **töldiriş**. Luğat berilgan `fillna()` har bir ustunga öz töldiriş qiymatini beradi. Ikkala metod ham `weather` ning özini özgartirmaydi: har biri **yangi DataFrame qaytaradi**, şuning uçun natijani özgaruvçiga saqlang.

::: warning Töldiriş - bu qaror
Yöq haroratni ortaça qiymat bilan töldiriş maʼlumotni töliq körsatadi, lekin bu taxmin. Hisobot uçun köpinça qatorni olib taşlaş yoki böşliqni qoldirib, bu haqda aytib ötiş halolroq.
:::

## Turlarni özgartiriş

Baʼzan pandas siz istamagan turni tanlaydi. `.astype()` ustun turini özgartiradi, `pd.to_datetime()` esa sana satrlarini haqiqiy sanalarga aylantiradi:

```python
import io
import pandas as pd

text = """date,city,quantity,price
2026-03-01,Toşkent,4,15000
2026-03-02,Samarqand,10,8000
2026-03-15,Buxoro,3,15000
"""
sales = pd.read_csv(io.StringIO(text))
print(sales.dtypes)
print()

sales["date"] = pd.to_datetime(sales["date"])
sales["price"] = sales["price"].astype(float)
print(sales.dtypes)
print()
print(sales["date"].max() - sales["date"].min())
```

```text
date          str
city          str
quantity    int64
price       int64
dtype: object

date        datetime64[us]
city                   str
quantity             int64
price              float64
dtype: object

14 days 00:00:00
```

Matnli ustun ikki sana orasida neça kun borligini ayta olmaydi. `to_datetime()` dan keyin ayiriş vaqt farqini beradi, xuddi *Sana va vaqt* darsidagi `datetime` obyektlari kabi. Dilnozaning yöq bahosi esingizdami? Böşliq töldirilgaç, `df["score"].fillna(0).astype(int)` bu ustunni yana butun sonlarga aylantiradi.

## Natijalarni saqlaş

`to_csv()` va `to_json()` DataFrameʼni faylga yozadi. Standart `0, 1, 2` indeksi qöşimça ustun sifatida yozilmasligi uçun `index=False` ni bering:

```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Toşkent", "Buxoro", "Termiz"],
    "temp": [31.5, 34.2, 36.8],
})
hot = weather[weather["temp"] > 32]

hot.to_csv("hot_cities.csv", index=False)
hot.to_json("hot_cities.json", orient="records", force_ascii=False)

with open("hot_cities.csv", encoding="utf-8") as f:
    print(f.read())
```

```text
city,temp
Buxoro,34.2
Termiz,36.8

```

`orient="records"` luğatlar röyxatini yozadi - `json.dump()` bilan qölda yaratadigan şaklning xuddi özi. `force_ascii=False` esa ö, ş kabi harflarni `\u00f6` körinişiga aylantirmasdan yozadi. `index=False` bölmasa, faylda nomsiz birinçi ustun paydo böladi va faylni qayta öqiganingizda u `Unnamed: 0` bölib qaytadi.

## Özingiz sinab köring

Filtrni özgartiring, matnga yangi qator qöşing yoki biror katakni böş qoldirib, natija qanday özgarişini köring.

<ClientOnly><PythonPlayground :code='"import io\nimport pandas as pd\n\ntext = \"\"\"date,city,product,quantity,price\n2026-03-01,Toşkent,Çoy,4,15000\n2026-03-01,Samarqand,Somsa,10,8000\n2026-03-02,Toşkent,Somsa,6,8000\n2026-03-02,Buxoro,Çoy,3,15000\n2026-03-03,Samarqand,Şarbat,5,12000\n\"\"\"\nsales = pd.read_csv(io.StringIO(text))\nprint(sales.head())\nprint(sales.shape)\n\ntashkent = sales[sales[\"city\"] == \"Toşkent\"]\nrevenue = (tashkent[\"quantity\"] * tashkent[\"price\"]).sum()\nprint(\"Toşkent tuşumi:\", revenue, \"söm\")"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Ustun nomini xato yoziş

Ustun nomlari katta-kiçik harfni farqlaydi va aniq mos kelişi kerak, böşliqlar ham.

```py
import pandas as pd

df = pd.DataFrame({"city": ["Toşkent"], "temp": [31.5]})
print(df["Temp"])
```

```text
KeyError: 'Temp'
```

`KeyError` olsangiz, haqiqiy nomlarni köriş uçun `df.columns` ni çop eting. CSV sarlavhalarida baʼzan `" temp"` kabi yaşirin böşliqlar böladi.

### 2. `&`/`|` örniga `and`/`or` işlatiş

Pythonʼning `and` operatori bitta `True` yoki `False` kutadi, ustunni taqqoslaş esa ulardan iborat butun Series beradi.

```py
import pandas as pd

df = pd.DataFrame({"temp": [31.5, 28.1], "humidity": [22, 30]})
print(df[df["temp"] > 30 and df["humidity"] < 25])
```

```text
ValueError: The truth value of a Series is ambiguous. Use a.empty, a.bool(), a.item(), a.any() or a.all().
```

`df[(df["temp"] > 30) & (df["humidity"] < 25)]` deb yozing. Qavslar muhim, çunki `&` operatori `>` dan kuçliroq boğlanadi.

### 3. Bir neça ustunni bitta qavs bilan tanlaş

```py
import pandas as pd

df = pd.DataFrame({"city": ["Toşkent"], "temp": [31.5]})
print(df["city", "temp"])
```

```text
KeyError: ('city', 'temp')
```

`df["city", "temp"]` nomi `("city", "temp")` kortejidan iborat bitta ustunni qidiradi. Uning örniga röyxat bering: `df[["city", "temp"]]`.

### 4. `dropna()` yoki `fillna()` DataFrameʼni özgartiradi deb kutiş

```py
weather.dropna()          # Yomon: natija taşlab yuboriladi
print(weather)            # yöq qiymatlar hali ham bor

weather = weather.dropna()   # Yaxşi: qaytarilgan DataFrame'ni saqlang
```

pandas metodlarining köpçiligi yangi obyekt qaytaradi va aslini özgartirmaydi. Natijani doim özgaruvçiga saqlang.

## Maşqlar

### 1. Ilk nazar <Difficulty level="1" />

Şu luğatdan DataFrame yarating, keyin uning ölçamini, ustun nomlarini röyxat sifatida va ortaça narxni çop eting.

```python
books = {
    "title": ["Keça va kunduz", "Ötkan kunlar", "Sariq devni minib"],
    "pages": [310, 420, 250],
    "price": [65000, 80000, 45000],
}
```

::: details Yeçim
```python
import pandas as pd

books = {
    "title": ["Keça va kunduz", "Ötkan kunlar", "Sariq devni minib"],
    "pages": [310, 420, 250],
    "price": [65000, 80000, 45000],
}
df = pd.DataFrame(books)

print(df.shape)
print(list(df.columns))
print(df["price"].mean())
```

```text
(3, 3)
['title', 'pages', 'price']
63333.333333333336
```

`shape` va `columns` atributlar, `mean()` esa bitta ustun ustida işlaydigan metod.
:::

### 2. Arzon va qalin <Difficulty level="1" />

Şu kitoblardan foydalanib, faqat narxi 70 000 sömdan past **va** 300 betdan köp bölgan kitoblarning nomlarini çop eting.

::: details Yeçim
```python
import pandas as pd

df = pd.DataFrame({
    "title": ["Keça va kunduz", "Ötkan kunlar", "Sariq devni minib"],
    "pages": [310, 420, 250],
    "price": [65000, 80000, 45000],
})

mask = (df["price"] < 70000) & (df["pages"] > 300)
print(df.loc[mask, "title"].tolist())
```

```text
['Keça va kunduz']
```
:::

### 3. Böşliqlari bor imtihon natijalari <Difficulty level="2" />

Şu CSV matnini `io.StringIO` bilan öqing. Har bir ustundagi yöq qiymatlarni sanang, yöq baholarni 0 bilan töldiring, `score` ustunini `int` ga aylantiring va natijani çop eting.

```text
student,group,score
Aziza,A,88
Bekzod,B,
Dilnoza,A,95
Farrux,B,
```

::: details Yeçim
```python
import io
import pandas as pd

text = """student,group,score
Aziza,A,88
Bekzod,B,
Dilnoza,A,95
Farrux,B,
"""
df = pd.read_csv(io.StringIO(text))
print(df.isna().sum())
print()

df["score"] = df["score"].fillna(0).astype(int)
print(df)
```

```text
student    0
group      0
score      2
dtype: int64

   student group  score
0    Aziza     A     88
1   Bekzod     B      0
2  Dilnoza     A     95
3   Farrux     B      0
```

Töldirişdan oldin ustunda önlik sonlar böladi, çunki `NaN` önlik son. `fillna(0)` dan keyin `astype(int)` xavfsiz işlaydi.
:::

### 4. Pozitsiyalar va yorliqlar <Difficulty level="2" />

Tört şahar va ularning haroratidan iborat, şahar indeks bölgan DataFrame yarating. `.iloc` yordamida **oxirgi** qatorning haroratini, keyin `.loc` yordamida `"Buxoro"` dan `"Nukus"` gaça bölgan haroratlarni çop eting.

::: details Yeçim
```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Toşkent", "Samarqand", "Buxoro", "Nukus"],
    "temp": [31.5, 29.0, 34.2, 28.1],
}).set_index("city")

print(weather.iloc[-1]["temp"])
print(weather.loc["Buxoro":"Nukus", "temp"])
```

```text
28.1
city
Buxoro    34.2
Nukus     28.1
Name: temp, dtype: float64
```

Manfiy pozitsiyalar `.iloc` bilan xuddi röyxatlardagi kabi işlaydi. `.loc` kesimiga ikkala uç ham kiradi.
:::

### 5. Tozalaş va saqlaş <Difficulty level="3" />

Avval fayl yaratib, quyidagi JSON yozuvlarini undan öqing. `date` ni haqiqiy sanalarga aylantiring, `amount` yöq qatorlarni olib taşlang, faqat 2026-yil martidan boşlab bölgan tölovlarni qoldiring va natijani indekssiz `payments_clean.csv` fayliga saqlang. Saqlangan faylni çop eting.

```python
payments = [
    {"date": "2026-02-27", "customer": "Aziza", "amount": 120000},
    {"date": "2026-03-02", "customer": "Bekzod", "amount": None},
    {"date": "2026-03-05", "customer": "Dilnoza", "amount": 45000},
    {"date": "2026-03-09", "customer": "Farrux", "amount": 300000},
]
```

::: details Yeçim
```python
import json
import pandas as pd

payments = [
    {"date": "2026-02-27", "customer": "Aziza", "amount": 120000},
    {"date": "2026-03-02", "customer": "Bekzod", "amount": None},
    {"date": "2026-03-05", "customer": "Dilnoza", "amount": 45000},
    {"date": "2026-03-09", "customer": "Farrux", "amount": 300000},
]
with open("payments.json", "w", encoding="utf-8") as f:
    json.dump(payments, f)

df = pd.read_json("payments.json")
df["date"] = pd.to_datetime(df["date"])
df = df.dropna(subset=["amount"])
df["amount"] = df["amount"].astype(int)
df = df[df["date"] >= "2026-03-01"]

df.to_csv("payments_clean.csv", index=False)
with open("payments_clean.csv", encoding="utf-8") as f:
    print(f.read())
```

```text
date,customer,amount
2026-03-05,Dilnoza,45000
2026-03-09,Farrux,300000
```

Sana ustunini `"2026-03-01"` kabi sana satri bilan töğridan-töğri taqqoslaş mumkin. JSONʼdagi `None` `NaN` ga aylanadi va `dropna()` uni olib taşlaydi.
:::

## Xulosa

- pandas (`pd` nomi bilan import qilinadi) jadvallar bilan işlaydi: **Series** - yorliqli bitta ustun, **DataFrame** esa bitta indeksni bölişadigan Seriesʼlardan iborat jadval.
- `read_csv()` va `read_json()` fayllarni yuklaydi (`sep`, `encoding`, `usecols`, `dtype` tartibsiz fayllarni hal qiladi). Işni `head()`, `shape`, `dtypes` va `describe()` dan boşlang.
- `df["col"]` Series beradi, `df[["a", "b"]]` DataFrame beradi, `.loc` yorliq böyiça, `.iloc` esa pozitsiya böyiça tanlaydi.
- Mantiqiy niqoblar bilan filtrlang, şartlarni `&`, `|`, `~` va qavslar bilan birlaştiring.
- Böşliqlarni `isna()` bilan toping, keyin `dropna()` yoki `fillna()` ni qöllang; turlarni `astype()` va `pd.to_datetime()` bilan özgartiring; `to_csv(..., index=False)` bilan saqlang. Metodlarning köpçiligi yangi DataFrame qaytaradi, şuning uçun natijani özgaruvçiga saqlang.

## Qöşimça manbalar

- [10 minutes to pandas](https://pandas.pydata.org/docs/user_guide/10min.html)
- [pandas: IO tools (CSV, JSON, and more)](https://pandas.pydata.org/docs/user_guide/io.html)
- [pandas: Indexing and selecting data](https://pandas.pydata.org/docs/user_guide/indexing.html)
- [pandas: Working with missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html)
