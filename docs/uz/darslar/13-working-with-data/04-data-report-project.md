---
title: "Loyiha: Savdo hisoboti"
description: "pandas va matplotlib bilan töliq savdo hisobotini tuziş: realistik tartibsiz maʼlumot yaratiş, uni tozalaş, tuşum, trendlar, eng yaxşi mahsulot va şaharlarni hisoblaş, yiğma jadval, uç panelli dashboard hamda CSV, PNG va matnli hisobot fayllarini saqlaş."
---

# Loyiha: Savdo hisoboti

![Rasm: Loyiha: Savdo hisoboti](/images/topics-webp-uzb/data-report-project.webp){.lesson-cover width=1536 height=1024}

::: tip Nimalarni örganasiz
- Haqiqiy maʼlumotlar tahlili qanday keçişini: yaratiş yoki yiğiş, yuklaş, körib çiqiş, tozalaş, tahlil qiliş, vizuallaştiriş, hisobot
- Tartibsiz maʼlumotlarni topiş va tuzatişni: bir xil bölmagan matn, dublikatlar, yöq qiymatlar va notöğri turlar
- `groupby`, `agg` va `pivot_table` bilan biznes savollariga javob berişni
- Uç grafikni bitta dashboard rasmiga birlaştiriş va uni PNG sifatida saqlaşni
- F-satrlar bilan qisqa matnli xulosa yoziş va barça natijalarni fayllarga saqlaşni
:::

## Nega bu muhim

Dökon egasiga DataFrame kerak emas. Unga javoblar kerak: "Biz ösyapmizmi?", "Qaysi mahsulot eng köp daromad keltiradi?", "Samarqandda ikkinçi dökon oçişga arziydimi?" Maʼlumotlar hisoboti minglab qatorlarni bir neça songa, bitta rasmga va har kim öqiy oladigan bir xatboşiga aylantiradi.

Bu loyihada siz butun işni xom CSV fayldan tayyor hisobotgaça bajarasiz. Işning asosiy qismi grafiklar emas. Bu **tozalaş**: haqiqiy maʼlumotlarda doim imlo xatolari, böşliqlar va dublikatlar böladi, iflos maʼlumotga qurilgan hisobot esa işonç bilan notöğri xulosa beradi.

::: info Kodni işga tuşiriş
Bu loyihaga pandas va matplotlib kerak: `python -m pip install pandas matplotlib`. Körsatilgan natijalar pandas 3 dan olingan. pandas 2 da matnli ustunlar `str` örniga `object` turini, sanalar `datetime64[ns]` ni körsatadi va baʼzi jadvallarda oraliqlar biroz farq qilişi mumkin. Sonlar bir xil.
:::

## Maqsad va imkoniyatlar

*Ipak Yöli Market* degan kiçik kompaniya beş şaharda olti xil mahsulot sotadi. Sizga olti oylik buyurtmalar maʼlumoti beriladi va quyidagilarni tayyorlaşingiz kerak:

| Natija | Nimani öz içiga oladi | Vositalar |
|---|---|---|
| Toza maʼlumot | tuzatilgan şahar nomlari, dublikatlarsiz, buzuq qatorlarsiz, töğri turlar | `.str`, `drop_duplicates`, `fillna`, `dropna`, `astype` |
| Oylik trend | har oydagi tuşum va % dagi ösiş | `.dt.strftime`, `groupby`, `pct_change` |
| Eng yaxşi mahsulotlar | dona, tuşum, tuşumdagi uluş | `agg`, `sort_values` |
| Şaharlarni taqqoslaş | buyurtmalar, tuşum, ortaça buyurtma | nomlangan agregatsiya |
| Yiğma jadval | şahar va oy böyiça tuşum, jami qiymatlar bilan | `pivot_table(margins=True)` |
| Dashboard | bitta rasmda uç grafik, PNG sifatida saqlangan | `plt.subplots`, `savefig` |
| Hisobot fayllari | `city_report.csv`, `city_month_revenue.csv`, `sales_summary.txt` | `to_csv`, f-satrlar, `pathlib` |

## Loyiha tuzilişi

```text
make_raw_csv()          sales_raw.csv  (651 ta tartibsiz qator)
      |
      v
load_clean()            read_csv -> matnni tuzatiş -> dublikatlarni olib taşlaş -> sanalar
      |                 -> yöq narxlarni töldiriş -> miqdori yöq qatorlarni olib taşlaş
      |                 -> int turlari -> revenue va month ustunlari
      v
sales (toza DataFrame, 625 ta buyurtma)
      |
      v
build_tables()  ---> monthly    (Series: oy -> tuşum)
      |         ---> products   (DataFrame: units, revenue, share_%)
      |         ---> cities     (DataFrame: orders, revenue, avg_order)
      |         ---> pivot      (DataFrame: şahar x oy)
      |
      +--> draw_dashboard()  -> sales_dashboard.png
      +--> to_csv()          -> city_report.csv, city_month_revenue.csv
      +--> make_summary()    -> sales_summary.txt
```

2-9-qadamlar bitta skriptni bölakma-bölak quradi: har bir kod parçasi oldingisining davomi va uning özgaruvçilaridan foydalanadi, şuning uçun ular alohida "Işga tuşiriş" tugmalari bilan emas, öqiş uçun körsatilgan. 1-qadam va *Töliq dastur* bu sahifada işga tuşiriladi; kompyuteringizda esa öqiş davomida qadamlarni birin-ketin faylga (yoki [Laboratoriya](/uz/laboratoriya) dagi notebook ga) joylab boring.

## 1-qadam: Realistik xom maʼlumot yaratiş

Haqiqiy loyihalar maʼlumotlar bazasidan yoki eksport qilingan fayldan boşlanadi. Bu loyiha mustaqil bölişi uçun maʼlumotni standart kutubxona bilan yaratasiz. Skript haqiqiy maʼlumotlarda uçraydigan muammolarni ataylab qöşadi: kiçik harflar va ortiqça böşliqlar bilan yozilgan şahar nomlari, yöq miqdor va narxlar hamda ikki marta eksport qilingan bir neça qator.

```python
import csv
import random
from datetime import date, timedelta

random.seed(42)

CITIES = {"Toşkent": 5, "Samarqand": 3, "Buxoro": 2, "Namangan": 2, "Farğona": 2}
PRODUCTS = {"Kök çoy": 18000, "Somsa": 7000, "Non": 5000,
            "Örik qoqi": 45000, "Asal": 60000, "Şarbat": 14000}

rows = []
start = date(2026, 1, 1)
for day_number in range(181):                      # 1-yanvardan 30-iyungaça
    day = start + timedelta(days=day_number)
    for _ in range(random.randint(2, 5)):           # kuniga 2-5 ta buyurtma
        city = random.choices(list(CITIES), weights=list(CITIES.values()))[0]
        product = random.choice(list(PRODUCTS))
        quantity = random.randint(1, 12) + day_number // 30   # savdo har oy biroz ösadi
        price = PRODUCTS[product]

        # maʼlumotni realistik tarzda tartibsiz qilamiz
        if random.random() < 0.05:
            city = "  " + city.lower()
        if random.random() < 0.03:
            quantity = ""
        if random.random() < 0.02:
            price = ""
        rows.append({"order_id": f"A{len(rows) + 1:04d}", "date": day.isoformat(), "city": city, "product": product,
                     "quantity": quantity, "price": price})

rows.extend(random.sample(rows, 8))                  # bir neça takrorlangan qator

with open("sales_raw.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=["order_id", "date", "city", "product", "quantity", "price"])
    writer.writeheader()
    writer.writerows(rows)

print(f"{len(rows)} ta qator yozildi")
with open("sales_raw.csv", encoding="utf-8") as file:
    for line in list(file)[:6]:
        print(line.rstrip())
```

```text
651 ta qator yozildi
order_id,date,city,product,quantity,price
A0001,2026-01-01,Toşkent,Non,4,5000
A0002,2026-01-01,Farğona,Kök çoy,,18000
A0003,2026-01-02,Samarqand,Şarbat,11,14000
A0004,2026-01-02,Toşkent,Kök çoy,3,18000
A0005,2026-01-03,Toşkent,Örik qoqi,2,45000
```

`random.seed(42)` maʼlumotni har safar bir xil qiladi, şuning uçun sizning sonlaringiz bu darsdagilar bilan mos tuşadi. `weights` bilan `random.choices` Toşkentni vazni 1 bölgan şaharga nisbatan beş barobar ehtimolliroq qiladi, `day_number // 30` esa miqdorlarni oylar davomida sekin östiradi, şunday qilib aniqlanadigan trend paydo böladi.

Har bir buyurtmaning `order_id` si bor. Bu keyinroq muhim: ikki mijoz bir kunda bir şaharda bir xil mahsulotni qonuniy ravişda sotib oliş mumkin, lekin **bir xil buyurtma ID** siga ega ikki qator haqiqiy dublikat hisoblanadi.

## 2-qadam: Yuklaş va körib çiqiş

Özingiz körmagan maʼlumotni heç qaçon tahlil qilmang. Tört tezkor tekşiruv nimalar notöğri bölişi mumkinligining köp qismini körsatadi:

```py
import pandas as pd

raw = pd.read_csv("sales_raw.csv")
print(raw.shape)
print(raw.head())
print()
print(raw.dtypes)
print()
print(raw.isna().sum())
print()
print(raw["city"].value_counts())
```

```text
(651, 6)
  order_id        date       city    product  quantity    price
0    A0001  2026-01-01    Toşkent        Non       4.0   5000.0
1    A0002  2026-01-01    Farğona    Kök çoy       NaN  18000.0
2    A0003  2026-01-02  Samarqand     Şarbat      11.0  14000.0
3    A0004  2026-01-02    Toşkent    Kök çoy       3.0  18000.0
4    A0005  2026-01-03    Toşkent  Örik qoqi       2.0  45000.0

order_id        str
date            str
city            str
product         str
quantity    float64
price       float64
dtype: object

order_id     0
date         0
city         0
product      0
quantity    18
price        9
dtype: int64

city
Toşkent        220
Samarqand      135
Buxoro          98
Namangan        87
Farğona         84
  toşkent        7
  farğona        6
  buxoro         5
  samarqand      5
  namangan       4
Name: count, dtype: int64
```

Tekşiruv nimalarni aniqladi:

- `quantity` va `price` butun son emas, `float64`. Birorta yöq qiymati (`NaN`) bor ustun oddiy butun sonli ustun bölolmaydi, şuning uçun pandas önlik sonlardan foydalanadi.
- `date` turi `str`: siz sörmaguningizça pandas sanalarni taxmin qilmaydi.
- 18 ta miqdor va 9 ta narx yöq.
- `value_counts()` şahar muammosini yaqqol körsatadi: `  toşkent` `Toşkent` dan alohida sanalgan. Hozir guruhlasak, har bir şahar ikkiga bölinib ketadi.

## 3-qadam: Tozalaş

Har bir muammoni bitta aniq amal bilan, maʼnoli tartibda tuzating:

```py

sales = raw.copy()
sales["city"] = sales["city"].str.strip().str.title()
sales = sales.drop_duplicates()
print("Olib taşlangan dublikatlar:", len(raw) - len(sales))

sales["date"] = pd.to_datetime(sales["date"])

typical_price = sales.groupby("product")["price"].transform("median")
sales["price"] = sales["price"].fillna(typical_price)

missing_quantity = sales["quantity"].isna().sum()
sales = sales.dropna(subset=["quantity"])
print("Miqdori yöq, olib taşlangan qatorlar:", missing_quantity)

sales["quantity"] = sales["quantity"].astype(int)
sales["price"] = sales["price"].astype(int)
sales = sales.reset_index(drop=True)

print(sales.shape)
print(sales.dtypes)
print(sales["city"].unique())
```

```text
Olib taşlangan dublikatlar: 8
Miqdori yöq, olib taşlangan qatorlar: 18
(625, 6)
order_id               str
date        datetime64[us]
city                   str
product                str
quantity             int64
price                int64
dtype: object
<StringArray>
['Toşkent', 'Samarqand', 'Buxoro', 'Namangan', 'Farğona']
Length: 5, dtype: str
```

Har bir qator ortidagi qarorlar:

1. **Avval matn.** `.str.strip().str.title()` `"  toşkent"` ni `"Toşkent"` ga aylantiradi. Buni dublikatlarni olib taşlaşdan oldin bajariş dublikat boşqaça yozuv ortiga yaşirinib qolmasligini taʼminlaydi.
2. **Dublikatlar.** `drop_duplicates()` barça ustunlarda, jumladan `order_id` da ham bir xil bölgan qatorlarni olib taşlaydi. Aynan 8 ta nusxalangan qator yöqoldi.
3. **Sanalar.** `pd.to_datetime` oylar uçun `.dt` accessorʼdan foydalaniş imkonini beradi.
4. **Yöq narxlarni tiklaş mumkin.** Har bir mahsulotning narxi qatʼiy, şuning uçun xuddi şu mahsulotning median narxi xavfsiz almaştiriş böladi. `transform("median")` asl indeks bilan tekislangan holda **har bir qator** uçun qiymat qaytaradi - `fillna` ga aynan şu kerak.
5. **Yöq miqdorlarni tiklab bölmaydi.** Kimdir neça banka asal sotib olganini taxmin qiliş tuşumni öylab topiş bilan barobar, şuning uçun bu 18 ta buyurtma olib taşlanadi. `subset=["quantity"]` muhim: oddiy `dropna()` yagona muammosi siz hozirgina tuzatgan narx bölgan qatorlarni ham olib taşlaydi.
6. **Turlar.** Yöq qiymatlar qolmagaç, `astype(int)` işlaydi, `reset_index(drop=True)` esa qatorlarni qayta raqamlaydi.

::: warning Tozalaş qarorlaringizni yozib qöying
643 ta buyurtmadan 18 tasini (taxminan 3%) olib taşlaş trend hisoboti uçun maqbul. Agar bu 30% bölganida, hisobotga ogohlantiriş kerak bölardi. Yaxşi hisobot doim qança maʼlumot va nima uçun olib taşlanganini aytadi, şuning uçun 9-qadamdagi xulosa bu sonni öz içiga oladi.
:::

## 4-qadam: Tuşum va oylik trend

```py

sales["revenue"] = sales["quantity"] * sales["price"]
sales["month"] = sales["date"].dt.strftime("%Y-%m")

monthly = sales.groupby("month")["revenue"].sum()
growth = monthly.pct_change() * 100

print(monthly)
print()
print(growth.round(1))
```

```text
month
2026-01    19180000
2026-02    16917000
2026-03    21921000
2026-04    24243000
2026-05    23707000
2026-06    32792000
Name: revenue, dtype: int64

month
2026-01     NaN
2026-02   -11.8
2026-03    29.6
2026-04    10.6
2026-05    -2.2
2026-06    38.3
Name: revenue, dtype: float64
```

`strftime("%Y-%m")` matn sifatida ham töğri tartibda saralanadigan `2026-03` kabi yorliqlar yaratadi. `pct_change()` har bir oyni undan oldingisi bilan taqqoslaydi, şuning uçun yanvarda qiymat yöq (`NaN`).

Trend asosan yuqoriga qarab, ikkita pasayiş bilan. Fevraldagi pasayişni qisman kalendar tuşuntiradi: unda atigi 28 kun bor, demak buyurtmalar ham kamroq. Kunlik tuşum adolatliroq taqqoslaş bölardi - bu quyidagi qöşimça topşiriqlardan biri.

## 5-qadam: Eng yaxşi mahsulotlar

Nomlangan agregatsiya (`new_name=("column", "function")`) bitta çaqiriş bilan aniq jadval tuzadi:

```py

products = (
    sales.groupby("product")
    .agg(units=("quantity", "sum"), revenue=("revenue", "sum"))
    .sort_values("revenue", ascending=False)
)
products["share_%"] = (products["revenue"] / products["revenue"].sum() * 100).round(1)
print(products)
```

```text
           units   revenue  share_%
product                            
Asal         960  57600000     41.5
Örik qoqi    897  40365000     29.1
Kök çoy      907  16326000     11.8
Şarbat       995  13930000     10.0
Somsa        787   5509000      4.0
Non         1006   5030000      3.6
```

`units` va `revenue` ni soliştiring. Non **eng köp dona** (1 006) sotilgan, lekin arzon bölgani uçun **eng kam pul** keltirgan. Asal şarbatdan kamroq dona sotilgan, lekin barça tuşumning 41,5% ini bergan. "Eng köp sotilgan" qaysi ustun böyiça saralaşingizga boğliq, şuning uçun doim qaysi birini nazarda tutayotganingizni ayting.

## 6-qadam: Şaharlarni taqqoslaş

```py

cities = (
    sales.groupby("city")
    .agg(orders=("revenue", "size"), revenue=("revenue", "sum"), avg_order=("revenue", "mean"))
    .sort_values("revenue", ascending=False)
)
cities["avg_order"] = cities["avg_order"].round(-2).astype(int)
print(cities)
```

```text
           orders   revenue  avg_order
city                                  
Toşkent       222  48105000     216700
Samarqand     136  32905000     241900
Buxoro         98  20494000     209100
Namangan       84  20350000     242300
Farğona        85  16906000     198900
```

`"size"` har bir guruhdagi qatorlarni sanaydi. Toşkentda buyurtmalar va tuşum eng köp, lekin Samarqand va Namanganda **ortaça buyurtma** kattaroq. `round(-2)` eng yaqin yuz sömgaça yumaloqlaydi, bu hisobot uçun yetarlica aniq.

## 7-qadam: Yiğma jadval: şahar va oy

Yiğma jadval bir ölçovni qatorlarga, boşqasini ustunlarga joylaştiradi:

```py

pivot = sales.pivot_table(
    index="city", columns="month", values="revenue",
    aggfunc="sum", fill_value=0, margins=True, margins_name="Jami",
)
print((pivot / 1_000_000).round(1))
```

```text
month      2026-01  2026-02  2026-03  2026-04  2026-05  2026-06   Jami
city                                                                  
Buxoro         3.2      2.5      4.4      4.2      3.8      2.5   20.5
Farğona        2.2      2.6      3.8      1.4      3.8      3.1   16.9
Namangan       2.8      2.8      3.6      4.4      2.1      4.7   20.4
Samarqand      4.5      3.0      3.0      6.0      5.0     11.4   32.9
Toşkent        6.6      6.1      7.1      8.3      9.0     11.1   48.1
Jami          19.2     16.9     21.9     24.2     23.7     32.8  138.8
```

`margins=True` `Jami` qatori va ustunini qöşadi. Faqat körsatiş uçun 1 000 000 ga böliş `pivot` dagi haqiqiy sonlarni özgarişsiz saqlaydi.

Yiğma jadval alohida jadvallar körsata olmagan narsani oçib beradi: Samarqandning tuşumi iyunda ikki barobardan ham köproq oşgan (11,4 million) va şu oyda Toşkentdan ham ötib ketgan, Buxoroniki esa 3,8 dan 2,5 milliongaça tuşgan. Aynan şu savollarni rahbar keyingi navbatda örganişi kerak.

## 8-qadam: Uç panelli dashboard

Bitta rasm, uçta Axes, har biri bitta savolga javob beradi:

```py

import matplotlib.pyplot as plt

fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(16, 5))
fig.suptitle("Savdo dashboardi, 2026-yil yanvar–iyun", fontsize=15)

ax1.plot(monthly.index, monthly.values / 1_000_000, marker="o")
ax1.set_title("Oylik tuşum")
ax1.set_xlabel("Oy")
ax1.set_ylabel("Tuşum (million söm)")
ax1.grid(True, alpha=0.3)

top = products["revenue"].sort_values() / 1_000_000
ax2.barh(top.index, top.values, color="tab:green")
ax2.set_title("Mahsulotlar böyiça tuşum")
ax2.set_xlabel("Tuşum (million söm)")

ax3.bar(cities.index, cities["revenue"] / 1_000_000, color="tab:orange")
ax3.set_title("Şaharlar böyiça tuşum")
ax3.set_ylabel("Tuşum (million söm)")
ax3.tick_params(axis="x", rotation=30)

fig.tight_layout()
fig.savefig("sales_dashboard.png", dpi=150)
print("sales_dashboard.png saqlandi")
plt.show()
```

```text
sales_dashboard.png saqlandi
```

Rasm keng bölib, "Savdo dashboardi, 2026-yil yanvar-iyun" sarlavhasi ostida yonma-yon uçta grafik joylaşgan:

- **Çapda:** nuqtali kök çiziq yanvardagi taxminan 19 million sömdan fevralda taxminan 17 milliongaça pasayadi, aprelda taxminan 24 milliongaça kötariladi, mayda biroz pasayadi va iyunda deyarli 33 milliongaça sakraydi.
- **Örtada:** eng kattasi tepada bölgan tartibda saralangan yaşil gorizontal ustunlar: Asal (taxminan 58 million), Örik qoqi (taxminan 40 million), keyin ança qisqa ustunlar - Kök çoy, Şarbat, Somsa va Non.
- **Öngda:** şaharlar uçun töq sariq vertikal ustunlar, Toşkentdan (taxminan 48 million) Farğonagaça (taxminan 17 million), şahar nomlari ustma-ust tuşmasligi uçun qiya yozilgan.

Muhim tafsilotlar:

- `barh` dan oldin mahsulotlar seriyasi **ösiş** tartibida saralanadi, çunki gorizontal ustunli diagrammalar birinçi elementni pastga çizadi. Natijada eng katta ustun tepada böladi.
- `fig.savefig()` `plt.show()` dan **oldin** keladi. Oyna yopilgandan keyin rasm böş bölişi mumkin.
- `tight_layout()` sarlavha va yozuvlar ustma-ust tuşişining oldini oladi.

## 9-qadam: Hisobotlarni saqlaş va xulosa yoziş

```py

from pathlib import Path

cities.to_csv("city_report.csv")
pivot.to_csv("city_month_revenue.csv")

best_month = monthly.idxmax()
worst_month = monthly.idxmin()
top_product = products.index[0]
top_city = cities.index[0]
first, last = monthly.iloc[0], monthly.iloc[-1]

summary = f"""SAVDO HISOBOTI: {sales["date"].min():%d.%m.%Y} - {sales["date"].max():%d.%m.%Y}
=======================================
Buyurtmalar:         {len(sales):,} (tozalaşda {len(raw) - len(sales)} ta xom qator olib taşlandi)
Jami tuşum:          {sales["revenue"].sum():,} söm
Ortaça buyurtma:     {sales["revenue"].mean():,.0f} söm

Eng yaxşi oy:        {best_month} ({monthly.max():,} söm)
Eng zaif oy:         {worst_month} ({monthly.min():,} söm)
Yanvardan iyungaça:  {(last - first) / first * 100:+.1f}%

Eng yaxşi mahsulot:  {top_product} (tuşumning {products.loc[top_product, "share_%"]}%)
Eng yaxşi şahar:     {top_city} ({cities.loc[top_city, "revenue"]:,} söm, {cities.loc[top_city, "orders"]} ta buyurtma)
"""
Path("sales_summary.txt").write_text(summary, encoding="utf-8")
print(summary)
print("Fayllar:", sorted(p.name for p in Path(".").iterdir() if p.suffix in {".csv", ".png", ".txt"}))
```

```text
SAVDO HISOBOTI: 01.01.2026 - 30.06.2026
=======================================
Buyurtmalar:         625 (tozalaşda 26 ta xom qator olib taşlandi)
Jami tuşum:          138,760,000 söm
Ortaça buyurtma:     222,016 söm

Eng yaxşi oy:        2026-06 (32,792,000 söm)
Eng zaif oy:         2026-02 (16,917,000 söm)
Yanvardan iyungaça:  +71.0%

Eng yaxşi mahsulot:  Asal (tuşumning 41.5%)
Eng yaxşi şahar:     Toşkent (48,105,000 söm, 222 ta buyurtma)

Fayllar: ['city_month_revenue.csv', 'city_report.csv', 'sales_dashboard.png', 'sales_raw.csv', 'sales_summary.txt']
```

Taqdimot işini format spetsifikatsiyalari bajaradi: `:,` minglik ajratkiçlarni qöşadi, `:,.0f` ortaça qiymatni yumaloqlaydi, `:+.1f` doim işorani körsatadi, sanadan keyingi `:%d.%m.%Y` esa uni `strftime` kabi formatlaydi. `idxmax()` eng katta qiymatning **yorliğini** (oyni) qaytaradi, `max()` esa qiymatning özini.

CSV fayllar maʼlumotni elektron jadvalda çuqurroq örganmoqçi bölganlar uçun. `to_csv` indeksni (`city`) birinçi ustun sifatida saqlaydi, bu yerda aynan şu kerak.

## Töliq dastur

Loyiha tuzilişiga mos ravişda funksiyalarga ajratilgan xuddi şu tahlil. Uni `sales_report.py` sifatida saqlang va işga tuşiring. U barça fayllarni joriy papkaga yozadi va oxirida dashboard oynasini oçadi.

```python
import csv
import random
from datetime import date, timedelta
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

RAW_FILE = "sales_raw.csv"
CITIES = {"Toşkent": 5, "Samarqand": 3, "Buxoro": 2, "Namangan": 2, "Farğona": 2}
PRODUCTS = {"Kök çoy": 18000, "Somsa": 7000, "Non": 5000,
            "Örik qoqi": 45000, "Asal": 60000, "Şarbat": 14000}


# ---------- 1-qadam: xom maʼlumot yaratiş ----------

def make_raw_csv(path, seed=42):
    random.seed(seed)
    rows = []
    start = date(2026, 1, 1)
    for day_number in range(181):
        day = start + timedelta(days=day_number)
        for _ in range(random.randint(2, 5)):
            city = random.choices(list(CITIES), weights=list(CITIES.values()))[0]
            product = random.choice(list(PRODUCTS))
            quantity = random.randint(1, 12) + day_number // 30
            price = PRODUCTS[product]
            if random.random() < 0.05:
                city = "  " + city.lower()
            if random.random() < 0.03:
                quantity = ""
            if random.random() < 0.02:
                price = ""
            rows.append({"order_id": f"A{len(rows) + 1:04d}", "date": day.isoformat(),
                         "city": city, "product": product,
                         "quantity": quantity, "price": price})
    rows.extend(random.sample(rows, 8))
    with open(path, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


# ---------- 2-3-qadamlar: yuklaş va tozalaş ----------

def load_clean(path):
    raw = pd.read_csv(path)
    sales = raw.copy()
    sales["city"] = sales["city"].str.strip().str.title()
    sales = sales.drop_duplicates()
    sales["date"] = pd.to_datetime(sales["date"])
    typical_price = sales.groupby("product")["price"].transform("median")
    sales["price"] = sales["price"].fillna(typical_price)
    sales = sales.dropna(subset=["quantity"])
    sales["quantity"] = sales["quantity"].astype(int)
    sales["price"] = sales["price"].astype(int)
    sales["revenue"] = sales["quantity"] * sales["price"]
    sales["month"] = sales["date"].dt.strftime("%Y-%m")
    print(f"{len(raw)} ta xom qator yuklandi, {len(sales)} ta toza buyurtma qoldi")
    return raw, sales.reset_index(drop=True)


# ---------- 4-7-qadamlar: jadvallar ----------

def build_tables(sales):
    monthly = sales.groupby("month")["revenue"].sum()
    products = (
        sales.groupby("product")
        .agg(units=("quantity", "sum"), revenue=("revenue", "sum"))
        .sort_values("revenue", ascending=False)
    )
    products["share_%"] = (products["revenue"] / products["revenue"].sum() * 100).round(1)
    cities = (
        sales.groupby("city")
        .agg(orders=("revenue", "size"), revenue=("revenue", "sum"), avg_order=("revenue", "mean"))
        .sort_values("revenue", ascending=False)
    )
    cities["avg_order"] = cities["avg_order"].round(-2).astype(int)
    pivot = sales.pivot_table(index="city", columns="month", values="revenue",
                              aggfunc="sum", fill_value=0, margins=True, margins_name="Jami")
    return monthly, products, cities, pivot


# ---------- 8-qadam: dashboard ----------

def draw_dashboard(monthly, products, cities, path):
    fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(16, 5))
    fig.suptitle("Savdo dashboardi, 2026-yil yanvar–iyun", fontsize=15)

    ax1.plot(monthly.index, monthly.values / 1_000_000, marker="o")
    ax1.set_title("Oylik tuşum")
    ax1.set_xlabel("Oy")
    ax1.set_ylabel("Tuşum (million söm)")
    ax1.grid(True, alpha=0.3)

    top = products["revenue"].sort_values() / 1_000_000
    ax2.barh(top.index, top.values, color="tab:green")
    ax2.set_title("Mahsulotlar böyiça tuşum")
    ax2.set_xlabel("Tuşum (million söm)")

    ax3.bar(cities.index, cities["revenue"] / 1_000_000, color="tab:orange")
    ax3.set_title("Şaharlar böyiça tuşum")
    ax3.set_ylabel("Tuşum (million söm)")
    ax3.tick_params(axis="x", rotation=30)

    fig.tight_layout()
    fig.savefig(path, dpi=150)
    return fig


# ---------- 9-qadam: matnli xulosa ----------

def make_summary(raw, sales, monthly, products, cities):
    first, last = monthly.iloc[0], monthly.iloc[-1]
    top_product = products.index[0]
    top_city = cities.index[0]
    return f"""SAVDO HISOBOTI: {sales["date"].min():%d.%m.%Y} - {sales["date"].max():%d.%m.%Y}
=======================================
Buyurtmalar:         {len(sales):,} (tozalaşda {len(raw) - len(sales)} ta xom qator olib taşlandi)
Jami tuşum:          {sales["revenue"].sum():,} söm
Ortaça buyurtma:     {sales["revenue"].mean():,.0f} söm

Eng yaxşi oy:        {monthly.idxmax()} ({monthly.max():,} söm)
Eng zaif oy:         {monthly.idxmin()} ({monthly.min():,} söm)
Yanvardan iyungaça:  {(last - first) / first * 100:+.1f}%

Eng yaxşi mahsulot:  {top_product} (tuşumning {products.loc[top_product, "share_%"]}%)
Eng yaxşi şahar:     {top_city} ({cities.loc[top_city, "revenue"]:,} söm, {cities.loc[top_city, "orders"]} ta buyurtma)
"""


def main():
    make_raw_csv(RAW_FILE)
    raw, sales = load_clean(RAW_FILE)
    monthly, products, cities, pivot = build_tables(sales)

    print("\nŞahar va oylar böyiça tuşum (million söm):")
    print((pivot / 1_000_000).round(1))

    cities.to_csv("city_report.csv")
    pivot.to_csv("city_month_revenue.csv")
    draw_dashboard(monthly, products, cities, "sales_dashboard.png")

    summary = make_summary(raw, sales, monthly, products, cities)
    Path("sales_summary.txt").write_text(summary, encoding="utf-8")
    print()
    print(summary)
    print("Saqlandi: city_report.csv, city_month_revenue.csv, sales_dashboard.png, sales_summary.txt")
    plt.show()


if __name__ == "__main__":
    main()
```

Natija:

```text
651 ta xom qator yuklandi, 625 ta toza buyurtma qoldi

Şahar va oylar böyiça tuşum (million söm):
month      2026-01  2026-02  2026-03  2026-04  2026-05  2026-06   Jami
city                                                                  
Buxoro         3.2      2.5      4.4      4.2      3.8      2.5   20.5
Farğona        2.2      2.6      3.8      1.4      3.8      3.1   16.9
Namangan       2.8      2.8      3.6      4.4      2.1      4.7   20.4
Samarqand      4.5      3.0      3.0      6.0      5.0     11.4   32.9
Toşkent        6.6      6.1      7.1      8.3      9.0     11.1   48.1
Jami          19.2     16.9     21.9     24.2     23.7     32.8  138.8

SAVDO HISOBOTI: 01.01.2026 - 30.06.2026
=======================================
Buyurtmalar:         625 (tozalaşda 26 ta xom qator olib taşlandi)
Jami tuşum:          138,760,000 söm
Ortaça buyurtma:     222,016 söm

Eng yaxşi oy:        2026-06 (32,792,000 söm)
Eng zaif oy:         2026-02 (16,917,000 söm)
Yanvardan iyungaça:  +71.0%

Eng yaxşi mahsulot:  Asal (tuşumning 41.5%)
Eng yaxşi şahar:     Toşkent (48,105,000 söm, 222 ta buyurtma)

Saqlandi: city_report.csv, city_month_revenue.csv, sales_dashboard.png, sales_summary.txt
```

Grafik oynasida 8-qadamda tasvirlangan xuddi şu uç panelli dashboard körinadi, `sales_dashboard.png` da ham aynan şu rasm bor. `make_raw_csv` dagi `seed=42` ni özgartirsangiz, boşqa olti oylik maʼlumot olasiz: har bir jadval, grafik va xulosa matni avtomatik yangilanadi, çunki hisobotdagi heç narsa qölda yozilmagan.

## Özingiz sinab köring

Bitta tartibsiz şahar nomi va bitta yöq miqdorni öz içiga olgan ön buyurtmali kiçik versiya. U maʼlumotni tozalaydi, yiğma jadvalni çop etadi va ikki grafik çizadi. Namangan uçun qator qöşing yoki narxni özgartirib, qayta işga tuşiring.

<ClientOnly><PythonPlayground :code='"import io\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\ntext = \"\"\"date,city,product,quantity,price\n2026-01-05,Toşkent,Asal,2,60000\n2026-01-12, samarqand,Kök çoy,5,18000\n2026-01-20,Toşkent,Somsa,12,7000\n2026-02-03,Buxoro,Asal,1,60000\n2026-02-14,Toşkent,Kök çoy,,18000\n2026-02-21,Samarqand,Somsa,20,7000\n2026-03-02,Buxoro,Örik qoqi,3,45000\n2026-03-10,toşkent ,Asal,4,60000\n2026-03-18,Samarqand,Örik qoqi,2,45000\n2026-03-25,Buxoro,Kök çoy,6,18000\n\"\"\"\nsales = pd.read_csv(io.StringIO(text), parse_dates=[\"date\"])\nsales[\"city\"] = sales[\"city\"].str.strip().str.title()\nsales = sales.dropna(subset=[\"quantity\"])\nsales[\"quantity\"] = sales[\"quantity\"].astype(int)\nsales[\"revenue\"] = sales[\"quantity\"] * sales[\"price\"]\nsales[\"month\"] = sales[\"date\"].dt.strftime(\"%Y-%m\")\n\nmonthly = sales.groupby(\"month\")[\"revenue\"].sum()\nby_city = sales.groupby(\"city\")[\"revenue\"].sum().sort_values(ascending=False)\nprint(sales.pivot_table(index=\"city\", columns=\"month\", values=\"revenue\", aggfunc=\"sum\", fill_value=0))\ntotal = sales[\"revenue\"].sum()\nprint(f\"\\nJami tuşum: {total:,} söm\")\nprint(f\"Eng yaxşi şahar: {by_city.index[0]}\")\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))\nax1.plot(monthly.index, monthly.values, marker=\"o\")\nax1.set_title(\"Oylik tuşum\")\nax2.bar(by_city.index, by_city.values, color=\"tab:orange\")\nax2.set_title(\"Şaharlar böyiça tuşum\")\nfig.tight_layout()\nplt.show()"' /></ClientOnly>

## Köp uçraydigan xatolar

### 1. Matnni tozalaşdan oldin guruhlaş

```python
import io
import pandas as pd

text = """city,revenue
Toşkent,120000
  toşkent,45000
Samarqand,80000
TOŞKENT ,30000
"""
sales = pd.read_csv(io.StringIO(text))
print(sales.groupby("city")["revenue"].sum())
print()
sales["city"] = sales["city"].str.strip().str.title()
print(sales.groupby("city")["revenue"].sum())
```

```text
city
  toşkent     45000
Samarqand     80000
TOŞKENT       30000
Toşkent      120000
Name: revenue, dtype: int64

city
Samarqand     80000
Toşkent      195000
Name: revenue, dtype: int64
```

Tozalaşdan oldin Toşkent uç guruhga bölinib ketgan va saralangan "eng yaxşi şaharlar" röyxati notöğri bölardi. **Tuzatiş:** har bir matnli ustunda `value_counts()` ni tekşiring, keyin guruhlaşdan oldin `.str.strip()` va `.str.title()` (yoki `.str.lower()`) bilan bir xil körinişga keltiring.

### 2. Hali yöq qiymatlari bor ustunni aylantiriş

```py
import io
import pandas as pd

text = """product,quantity
Asal,3
Somsa,
Şarbat,5
"""
sales = pd.read_csv(io.StringIO(text))
sales["quantity"] = sales["quantity"].astype(int)
```

```text
pandas.errors.IntCastingNaNError: Cannot convert non-finite values (NA or inf) to integer.Replace or remove non-finite values or cast to an integer typethat supports these values (e.g. 'Int64')
```

**Tuzatiş:** avval yöq qiymat nimani anglatişini hal qiling: uni töldiring (`fillna`) yoki qatorni olib taşlang (`dropna`), keyin aylantiring. Agar böşliqlarni saqlaş şart bölsa, pandasʼda null qiymatni qöllaydigan butun son turi bor: katta I harfi bilan `astype("Int64")`.

### 3. Alifbo tartibida saralanadigan oy nomlari

```python
import io
import pandas as pd

text = """date,revenue
2026-01-15,100
2026-02-15,200
2026-03-15,300
2026-04-15,400
"""
sales = pd.read_csv(io.StringIO(text), parse_dates=["date"])

sales["month"] = sales["date"].dt.strftime("%b")         # Yomon: Jan, Feb, ...
print(sales.groupby("month")["revenue"].sum())
print()
sales["month"] = sales["date"].dt.strftime("%Y-%m")      # Yaxşi: 2026-01, ...
print(sales.groupby("month")["revenue"].sum())
```

```text
month
Apr    400
Feb    200
Jan    100
Mar    300
Name: revenue, dtype: int64

month
2026-01    100
2026-02    200
2026-03    300
2026-04    400
Name: revenue, dtype: int64
```

Alifboda `Apr` `Jan` dan oldin keladi, şuning uçun "trend" aralaşib ketadi va çiziqli grafik zigzag bölib qoladi. **Tuzatiş:** `%Y-%m` kabi saralanadigan yorliq (yoki `dt.to_period("M")`) böyiça guruhlang, oy nomlarini esa faqat yakuniy körsatiş uçun formatlang.

### 4. `dropna()` bilan juda köp narsani olib taşlaş

```py
import pandas as pd

raw = pd.read_csv("sales_raw.csv")
print("Barça qatorlar:            ", len(raw))
print("dropna() dan keyin:        ", len(raw.dropna()))
print("dropna(subset=[...]) keyin:", len(raw.dropna(subset=["quantity"])))
```

```text
Barça qatorlar:             651
dropna() dan keyin:         624
dropna(subset=[...]) keyin: 633
```

Oddiy `dropna()` **birorta** ustunda qiymat yöq bölsa, qatorni olib taşlaydi, jumladan töldiriş mumkin bölgan narxlar tufayli ham. **Tuzatiş:** avval tiklaş mumkin bölgan narsani töldiring va faqat yöq qiymati ularni haqiqatan yaroqsiz qiladigan qatorlarni olib taşlaş uçun `subset=` dan foydalaning. Har bir qadam neça qatorni olib taşlaganini doim çop eting.

## Qöşimça topşiriqlar

Maslahatlarni oçişdan oldin har birini özingiz bajarib köring.

### 1. Kunlik tuşum <Difficulty level="1" />

Oylar uzunligi har xil. Oylik jadvalga **kunlik** tuşum ustunini qöşing va fevral hali ham zaif körinayotganini tekşiring.

::: details Maslahatlar
- `sales.groupby("month")["date"].nunique()` har oydagi buyurtma bölgan kunlarni sanaydi.
- Oylik tuşum Seriesʼini şu Seriesʼga böling. pandas ularni oylar böyiça avtomatik tekislaydi.
:::

### 2. Şaharlar böyiça mahsulotlar <Difficulty level="1" />

Har bir şaharda (tuşum böyiça) eng köp sotilgan mahsulotni toping.

::: details Maslahatlar
- Ikki ustun böyiça guruhlang: `sales.groupby(["city", "product"])["revenue"].sum()`.
- Keyin `.groupby(level="city").idxmax()` dan foydalaning yoki saralab, `reset_index()` dan keyin `.groupby("city").head(1)` ni qöllang.
:::

### 3. Hafta kunlari böyiça qonuniyat <Difficulty level="2" />

Odamlar dam oliş kunlari köproq xarid qiladimi? Dashboardga hafta kunlari böyiça ortaça tuşumni duşanbadan yakşanbagaça tartibda körsatadigan törtinçi panel qöşing.

::: details Maslahatlar
- `sales["date"].dt.dayofweek` duşanba uçun 0 dan yakşanba uçun 6 gaça qiymat beradi va töğri saralanadi. `dt.day_name()` ni faqat yozuvlar uçun işlating.
- Hafta kuni böyiça ortaça degani: avval har bir sana uçun jami tuşum, keyin hafta kuni böyiça ortaça. Aks holda buyurtmalari köp hafta kunlari kattaroq körinadi.
- `plt.subplots(1, 3)` ni `plt.subplots(2, 2)` ga özgartiring va Axesʼlarni `axes.flat` orqali oling.
:::

### 4. Oyma-oy ogohlantirişlar <Difficulty level="2" />

Matnli xulosaga tuşumi oldingi oyga nisbatan 25% dan köp kamaygan har bir şaharni `Buxoro: 2026-06 da 2026-05 ga nisbatan 34% kamaydi` körinişida sanab ötadigan bölim qöşing.

::: details Maslahatlar
- Avval yiğma jadvaldan `Jami` qatori va ustunini olib taşlang (`pivot.drop(index="Jami", columns="Jami")`).
- `pct_change(axis=1)` har bir oyni oldingi ustun bilan taqqoslaydi.
- Natija böylab `.stack()` yoki `.items()` bilan sikl yuriting va qatorlarni f-satrlar bilan tuzing.
:::

### 5. Qayta işlatiladigan hisobot buyruği <Difficulty level="3" />

Skriptni xuddi şu ustunlarga ega **har qanday** savdo fayli bilan işlaydigan vositaga aylantiring: u fayl nomini söraydi, ustunlarni tekşiradi, maʼlumot yaratişni ötkazib yuboradi va barça natijalarni fayl nomi bilan atalgan papkaga saqlaydi (masalan, `reports/sales_raw/`).

::: details Maslahatlar
- `set(required_columns) <= set(raw.columns)` ni tekşiring va ustunlar yetişmasa, tuşunarli xabarli öz istisnongizni çaqiring.
- `read_csv` atrofida `FileNotFoundError` va `pd.errors.EmptyDataError` ni uşlang.
- `Path("reports") / Path(name).stem` va `mkdir(parents=True, exist_ok=True)` dan foydalaning, keyin papkani har bir saqlaş funksiyasiga uzating.
- `load_clean` ni `io.StringIO` dan yaratilgan kiçik DataFrame bilan test qiling, şunda test uçun haqiqiy fayl kerak bölmaydi.
:::

## Xulosa

- Hisobot quvur (pipeline) böyiça boradi: yuklaş, körib çiqiş, tozalaş, tahlil, vizuallaştiriş va saqlaş. Har bir bosqiçni alohida funksiyada saqlang.
- Tozalaşdan oldin körib çiqing: `head()`, `dtypes`, `isna().sum()` va matnli ustunlardagi `value_counts()` muammolarning köpini oçib beradi.
- Guruhlaş yoki dublikatlarni olib taşlaşdan oldin matnni tozalang, tiklaş mumkin bölgan qiymatlarni töldiring va faqat tiklab bölmaydigan qatorlarni olib taşlang. Neça qator olib taşlanganini qayd eting.
- Nomlangan agregatsiyali `groupby` "har bir mahsulot böyiça" va "har bir şahar böyiça" savollariga javob beradi, `pivot_table(margins=True)` esa ikki ölçovni jami qiymatlar bilan körsatadi.
- `2026-03` kabi saralanadigan oy yorliqlaridan foydalaning va "eng yaxşi" dona böyiçami yoki tuşum böyiçami ekanini hal qiling.
- Bir neça Axesʼli bitta rasm dashboard böladi. `savefig` ni `plt.show()` dan oldin çaqiring, aks holda yopilgan oyna böş PNG qoldirişi mumkin; xulosa matnini f-satrlar yordamida hisoblangan qiymatlardan tuzing, şunda maʼlumot özgarganda butun hisobot yangilanadi.

## Qöşimça manbalar

- [pandas: Working with missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html)
- [pandas: Group by: split-apply-combine](https://pandas.pydata.org/docs/user_guide/groupby.html)
- [pandas: `DataFrame.pivot_table`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot_table.html)
- [matplotlib: Arranging multiple Axes in a Figure](https://matplotlib.org/stable/users/explain/axes/arranging_axes.html)
