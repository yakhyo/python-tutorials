---
title: Reading Data Files
description: "Load CSV and JSON data into pandas DataFrames, explore them, select rows and columns, filter, handle missing values, convert types, and save the results."
---

# Reading Data Files

![Illustration: Reading Data Files](/images/topics-webp/reading-data.webp){.lesson-cover width=1536 height=1024}

::: tip What you'll learn
- Why a table-aware library helps once your data grows beyond a few rows
- The two core pandas objects: **Series** and **DataFrame**
- How to load data with `read_csv` and `read_json` and take a first look at it
- How to select columns and rows with `[]`, `.loc`, and `.iloc`, and filter with boolean masks
- How to find and fix missing values, convert types, and save your results
:::

## Why it matters

In *Working with CSV* and *Working with JSON*, you read data with the standard library. That works well, but every question needs a loop: "What was the total revenue in Samarkand?" means reading rows, converting the strings `DictReader` gives you to numbers, checking a condition, and adding things up.

Most real data is a **table**: sales records, weather readings, exam results, bank transactions. **pandas** is the most widely used Python library for tables. It reads a file in one line, understands numbers and dates, and answers questions like the one above in a single expression. Shops, banks, scientists, and journalists all use it every day.

## Installing pandas

pandas is a **third-party** package, so it does not come with Python. On your own computer, install it (together with matplotlib, which *Charts with matplotlib* uses) from a terminal:

```text
python -m pip install pandas matplotlib
```

In the editor on this site you do not need to install anything: pandas is loaded automatically when your code imports it.

By convention, everyone imports pandas with the short name `pd`:

```py
import pandas as pd
```

::: info pandas versions
The outputs in this lesson come from pandas 3. If you have pandas 2, almost everything looks the same. The main visible differences are that text columns show the type `object` instead of `str`, and dates show `datetime64[ns]` instead of `datetime64[us]`.
:::

## Series: one column of data

A **Series** is a single column of values with labels, called the **index**.

```python
import pandas as pd

temps = pd.Series([31, 34, 29], index=["Tashkent", "Bukhara", "Nukus"])
print(temps)
print()
print(temps["Bukhara"])
print(temps.mean())
```

```text
Tashkent    31
Bukhara     34
Nukus       29
dtype: int64

34
31.333333333333332
```

The left column is the index, and the right column holds the values. `dtype: int64` means every value is a 64-bit integer. Unlike a list, a Series does math on all its values at once: `temps * 9 / 5 + 32` converts every temperature to Fahrenheit.

## DataFrame: a whole table

A **DataFrame** is a table: several Series that share the same index, one per column. The easiest way to build one is from a dictionary of lists, where each key becomes a column name:

```python
import pandas as pd

df = pd.DataFrame({
    "city": ["Tashkent", "Samarkand", "Bukhara"],
    "population": [3040000, 580000, 290000],
    "region": ["Tashkent", "Samarkand", "Bukhara"],
})
print(df)
```

```text
        city  population     region
0   Tashkent     3040000   Tashkent
1  Samarkand      580000  Samarkand
2    Bukhara      290000    Bukhara
```

pandas adds a default index `0, 1, 2` on the left. You can also build a DataFrame from a **list of dictionaries**, the shape from *Nested Data* and the shape `json.load()` often gives you:

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

Dilnoza has no score, so pandas fills the gap with `NaN` ("not a number"), its marker for a **missing value**. Because `NaN` is a float, the whole `score` column became floats. You will fix this later in the lesson.

## Reading CSV and JSON files

`pd.read_csv()` reads a whole CSV file into a DataFrame. It detects the header row and converts numbers automatically:

```python
import pandas as pd

with open("sales.csv", "w", encoding="utf-8") as f:
    f.write("""date,city,product,quantity,price
2026-03-01,Tashkent,Tea,4,15000
2026-03-01,Samarkand,Samsa,10,8000
2026-03-02,Tashkent,Samsa,6,8000
2026-03-02,Bukhara,Tea,3,15000
2026-03-03,Samarkand,Juice,5,12000
2026-03-03,Tashkent,Juice,2,12000
""")

sales = pd.read_csv("sales.csv")
print(sales)
```

```text
         date       city product  quantity  price
0  2026-03-01   Tashkent     Tea         4  15000
1  2026-03-01  Samarkand   Samsa        10   8000
2  2026-03-02   Tashkent   Samsa         6   8000
3  2026-03-02    Bukhara     Tea         3  15000
4  2026-03-03  Samarkand   Juice         5  12000
5  2026-03-03   Tashkent   Juice         2  12000
```

`pd.read_json()` works the same way for JSON files that hold a list of records:

```python
import json
import pandas as pd

records = [
    {"city": "Tashkent", "temp": 31.5, "humidity": 22},
    {"city": "Nukus", "temp": 29.0, "humidity": 30},
]
with open("weather.json", "w", encoding="utf-8") as f:
    json.dump(records, f)

weather = pd.read_json("weather.json")
print(weather)
```

```text
       city  temp  humidity
0  Tashkent  31.5        22
1     Nukus  29.0        30
```

::: tip Reading from a string
To experiment without creating a file, wrap text in `io.StringIO`, which behaves like an open file: `pd.read_csv(io.StringIO(text))`. Many examples below use this trick.
:::

Real files are messier than these. The options you will reach for most: `sep=";"` for semicolon-separated files (common in Excel exports), `encoding="cp1251"` for old Windows files, `usecols=["date", "price"]` to load only some columns, `dtype={"id": str}` to stop pandas turning IDs into numbers, and `thousands=" "` for prices written like `35 000`.

::: info Your own files, in the browser
On your computer, `pd.read_csv()` also accepts a URL (`pd.read_csv("https://.../sales.csv")`). In the editor on this site, browsers block most cross-site downloads (the CORS rule), and there is no file picker, so create the file in code as the examples do, or paste your data into a string. To work with your own files, use the [Python Lab](/lab), which has a file browser and upload button.
:::

## Taking a first look

When you load a new file, check its size and contents before doing anything else. The next examples use this weather table:

```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Tashkent", "Samarkand", "Bukhara", "Nukus", "Fergana", "Termez"],
    "temp": [31.5, 29.0, 34.2, 28.1, 30.4, 36.8],
    "humidity": [22, 25, 18, 30, 35, 15],
    "rain_mm": [0.0, 1.2, 0.0, 0.0, 3.5, 0.0],
})

print(weather.head(3))     # first 3 rows (default is 5)
print()
print(weather.tail(2))     # last 2 rows
print()
print(weather.shape)       # (rows, columns)
print(list(weather.columns))
print()
print(weather.dtypes)
```

```text
        city  temp  humidity  rain_mm
0   Tashkent  31.5        22      0.0
1  Samarkand  29.0        25      1.2
2    Bukhara  34.2        18      0.0

      city  temp  humidity  rain_mm
4  Fergana  30.4        35      3.5
5   Termez  36.8        15      0.0

(6, 4)
['city', 'temp', 'humidity', 'rain_mm']

city            str
temp        float64
humidity      int64
rain_mm     float64
dtype: object
```

`shape` and `columns` are attributes, so they have no parentheses. `weather.info()` prints the same facts in one report, including how many non-missing values each column has, and `weather.describe()` gives count, mean, standard deviation, min, quartiles, and max for every numeric column (add `.round(2)` to keep it readable).

## Selecting columns

Use square brackets with a column name to get one column as a **Series**. Use a **list** of names to get a smaller **DataFrame**:

```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Tashkent", "Samarkand", "Bukhara", "Nukus"],
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
0   Tashkent  31.5
1  Samarkand  29.0
2    Bukhara  34.2
3      Nukus  28.1

34.2
```

Notice the double brackets in `weather[["city", "temp"]]`: the outer pair is the selection, and the inner pair is a Python list.

## Selecting rows: `.loc` and `.iloc`

There are two ways to pick rows:

| Accessor | Selects by | Example | Slice end |
|---|---|---|---|
| `.loc[]` | index **labels** and column names | `df.loc["Bukhara", "temp"]` | included |
| `.iloc[]` | integer **positions** (like list indexes) | `df.iloc[2, 1]` | excluded |

Labels are easier to see when the index is meaningful, so this example uses `set_index()` to make the city the index:

```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Tashkent", "Samarkand", "Bukhara", "Nukus"],
    "temp": [31.5, 29.0, 34.2, 28.1],
    "humidity": [22, 25, 18, 30],
}).set_index("city")

print(weather)
print()
print(weather.loc["Bukhara"])                  # one row, as a Series
print()
print(weather.loc["Bukhara", "temp"])          # one cell
print(weather.loc["Samarkand":"Nukus", "temp"].tolist())
print()
print(weather.iloc[0])                         # first row by position
```

```text
           temp  humidity
city                     
Tashkent   31.5        22
Samarkand  29.0        25
Bukhara    34.2        18
Nukus      28.1        30

temp        34.2
humidity    18.0
Name: Bukhara, dtype: float64

34.2
[29.0, 34.2, 28.1]

temp        31.5
humidity    22.0
Name: Tashkent, dtype: float64
```

The label slice `"Samarkand":"Nukus"` **includes** Nukus, while a position slice such as `weather.iloc[1:3]` stops before position 3, exactly like a list slice.

## Filtering with boolean masks

Comparing a column to a value gives a Series of `True`/`False` values, called a **boolean mask**. Put the mask inside `[]` to keep only the `True` rows:

```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Tashkent", "Samarkand", "Bukhara", "Nukus", "Fergana", "Termez"],
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
0  Tashkent  31.5        22
2   Bukhara  34.2        18
5    Termez  36.8        15
```

To combine conditions, use `&` (and), `|` (or), and `~` (not), and wrap **each condition in parentheses**. `.isin()` checks membership, like `in` for a list:

```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Tashkent", "Samarkand", "Bukhara", "Nukus", "Fergana", "Termez"],
    "temp": [31.5, 29.0, 34.2, 28.1, 30.4, 36.8],
    "humidity": [22, 25, 18, 30, 35, 15],
})

print(weather[(weather["temp"] > 30) & (weather["humidity"] < 20)])
print()
print(weather[weather["city"].isin(["Nukus", "Fergana"])]["city"].tolist())
print(weather.loc[weather["temp"] < 30, "city"].tolist())
```

```text
      city  temp  humidity
2  Bukhara  34.2        18
5   Termez  36.8        15

['Nukus', 'Fergana']
['Samarkand', 'Nukus']
```

The last line shows a useful pattern: `.loc[mask, column]` filters rows and picks a column in one step.

## Missing values

Real files have gaps: a sensor was offline, or a cashier skipped a field. pandas reads empty CSV cells as `NaN`. Use `.isna()` to find them:

```python
import io
import pandas as pd

text = """city,temp,humidity
Tashkent,31.5,22
Samarkand,,25
Bukhara,34.2,
Nukus,28.1,30
"""
weather = pd.read_csv(io.StringIO(text))
print(weather.isna().sum())      # missing values per column
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
0  Tashkent  31.5      22.0
2   Bukhara  34.2       NaN
3     Nukus  28.1      30.0

        city  temp  humidity
0   Tashkent  31.5      22.0
1  Samarkand  31.3      25.0
2    Bukhara  34.2       0.0
3      Nukus  28.1      30.0
```

`isna()` returns a table of `True`/`False`, and `.sum()` counts the `True` values. You then have two choices: **drop** the incomplete rows (`dropna()`, or `dropna(subset=[...])` to look only at the listed columns) or **fill** the gaps. `fillna()` with a dictionary lets each column get its own fill value. Neither method changes `weather` itself: each **returns a new DataFrame**, so assign the result to a name.

::: warning Filling is a decision
Filling a missing temperature with the average makes the data look complete, but it is a guess. For a report, it is often more honest to drop the row or keep the gap and mention it.
:::

## Converting types

Sometimes pandas guesses a type you do not want. `.astype()` converts a column, and `pd.to_datetime()` turns date strings into real dates:

```python
import io
import pandas as pd

text = """date,city,quantity,price
2026-03-01,Tashkent,4,15000
2026-03-02,Samarkand,10,8000
2026-03-15,Bukhara,3,15000
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

A text column cannot tell you how many days lie between two dates. After `to_datetime()`, subtraction gives a time difference, just like `datetime` objects in *Dates and Times*. Remember Dilnoza's missing score? Once the gap is filled, `df["score"].fillna(0).astype(int)` turns that column back into integers.


## Saving your results

`to_csv()` and `to_json()` write a DataFrame to a file. Pass `index=False` so the default `0, 1, 2` index is not written as an extra column:

```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Tashkent", "Bukhara", "Termez"],
    "temp": [31.5, 34.2, 36.8],
})
hot = weather[weather["temp"] > 32]

hot.to_csv("hot_cities.csv", index=False)
hot.to_json("hot_cities.json", orient="records")

with open("hot_cities.csv", encoding="utf-8") as f:
    print(f.read())
```

```text
city,temp
Bukhara,34.2
Termez,36.8

```

`orient="records"` writes a list of dictionaries, the same shape you would build by hand with `json.dump()`. Without `index=False`, the file gets an unnamed first column, which comes back as `Unnamed: 0` when you read it again.

## Try it

Change the filter, add a new row to the text, or leave a cell empty and see how the summary changes.

<ClientOnly><PythonPlayground :code='"import io\nimport pandas as pd\n\ntext = \"\"\"date,city,product,quantity,price\n2026-03-01,Tashkent,Tea,4,15000\n2026-03-01,Samarkand,Samsa,10,8000\n2026-03-02,Tashkent,Samsa,6,8000\n2026-03-02,Bukhara,Tea,3,15000\n2026-03-03,Samarkand,Juice,5,12000\n\"\"\"\nsales = pd.read_csv(io.StringIO(text))\nprint(sales.head())\nprint(sales.shape)\n\ntashkent = sales[sales[\"city\"] == \"Tashkent\"]\nrevenue = (tashkent[\"quantity\"] * tashkent[\"price\"]).sum()\nprint(\"Tashkent revenue:\", revenue, \"som\")"' /></ClientOnly>

## Common mistakes

### 1. Misspelling a column name

Column names are case-sensitive and must match exactly, including spaces.

```py
import pandas as pd

df = pd.DataFrame({"city": ["Tashkent"], "temp": [31.5]})
print(df["Temp"])
```

```text
KeyError: 'Temp'
```

When you get a `KeyError`, print `df.columns` to see the real names. CSV headers sometimes contain hidden spaces, such as `" temp"`.

### 2. Using `and`/`or` instead of `&`/`|`

Python's `and` wants a single `True` or `False`, but a comparison on a column gives a whole Series of them.

```py
import pandas as pd

df = pd.DataFrame({"temp": [31.5, 28.1], "humidity": [22, 30]})
print(df[df["temp"] > 30 and df["humidity"] < 25])
```

```text
ValueError: The truth value of a Series is ambiguous. Use a.empty, a.bool(), a.item(), a.any() or a.all().
```

Write `df[(df["temp"] > 30) & (df["humidity"] < 25)]`. The parentheses matter, because `&` binds more tightly than `>`.

### 3. Selecting several columns with single brackets

```py
import pandas as pd

df = pd.DataFrame({"city": ["Tashkent"], "temp": [31.5]})
print(df["city", "temp"])
```

```text
KeyError: ('city', 'temp')
```

`df["city", "temp"]` looks for one column named by the tuple `("city", "temp")`. Pass a list instead: `df[["city", "temp"]]`.

### 4. Expecting `dropna()` or `fillna()` to change the DataFrame

```py
weather.dropna()          # Bad: the result is thrown away
print(weather)            # still has the missing values

weather = weather.dropna()   # Good: keep the returned DataFrame
```

Most pandas methods return a new object and leave the original alone. Always assign the result.

## Practice

### 1. First look <Difficulty level="1" />

Build a DataFrame from this dictionary, then print its shape, its column names as a list, and the mean price.

```python
books = {
    "title": ["Kecha va kunduz", "O'tkan kunlar", "Sariq devni minib"],
    "pages": [310, 420, 250],
    "price": [65000, 80000, 45000],
}
```

::: details Solution
```python
import pandas as pd

books = {
    "title": ["Kecha va kunduz", "O'tkan kunlar", "Sariq devni minib"],
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

`shape` and `columns` are attributes, while `mean()` is a method that works on one column.
:::

### 2. Cheap and long <Difficulty level="1" />

Using the same books, print only the titles of books that cost less than 70,000 som **and** have more than 300 pages.

::: details Solution
```python
import pandas as pd

df = pd.DataFrame({
    "title": ["Kecha va kunduz", "O'tkan kunlar", "Sariq devni minib"],
    "pages": [310, 420, 250],
    "price": [65000, 80000, 45000],
})

mask = (df["price"] < 70000) & (df["pages"] > 300)
print(df.loc[mask, "title"].tolist())
```

```text
['Kecha va kunduz']
```
:::

### 3. Exam results with gaps <Difficulty level="2" />

Read this CSV text with `io.StringIO`. Count missing values per column, fill missing scores with 0, convert the `score` column to `int`, and print the result.

```text
student,group,score
Aziza,A,88
Bekzod,B,
Dilnoza,A,95
Farrukh,B,
```

::: details Solution
```python
import io
import pandas as pd

text = """student,group,score
Aziza,A,88
Bekzod,B,
Dilnoza,A,95
Farrukh,B,
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
3  Farrukh     B      0
```

Before filling, the column holds floats because `NaN` is a float. After `fillna(0)`, `astype(int)` is safe.
:::

### 4. Positions and labels <Difficulty level="2" />

Create a DataFrame of four cities and their temperatures with the city as the index. Print the temperature of the **last** row using `.iloc`, then the temperatures of `"Bukhara"` through `"Nukus"` using `.loc`.

::: details Solution
```python
import pandas as pd

weather = pd.DataFrame({
    "city": ["Tashkent", "Samarkand", "Bukhara", "Nukus"],
    "temp": [31.5, 29.0, 34.2, 28.1],
}).set_index("city")

print(weather.iloc[-1]["temp"])
print(weather.loc["Bukhara":"Nukus", "temp"])
```

```text
28.1
city
Bukhara    34.2
Nukus      28.1
Name: temp, dtype: float64
```

Negative positions work with `.iloc` just like with lists. The `.loc` slice includes both ends.
:::

### 5. Clean and save <Difficulty level="3" />

Read the JSON records below from a file you create first. Convert `date` to real dates, drop rows with a missing `amount`, keep only payments from March 2026 or later, and save the result to `payments_clean.csv` without the index. Print the saved file.

```python
payments = [
    {"date": "2026-02-27", "customer": "Aziza", "amount": 120000},
    {"date": "2026-03-02", "customer": "Bekzod", "amount": None},
    {"date": "2026-03-05", "customer": "Dilnoza", "amount": 45000},
    {"date": "2026-03-09", "customer": "Farrukh", "amount": 300000},
]
```

::: details Solution
```python
import json
import pandas as pd

payments = [
    {"date": "2026-02-27", "customer": "Aziza", "amount": 120000},
    {"date": "2026-03-02", "customer": "Bekzod", "amount": None},
    {"date": "2026-03-05", "customer": "Dilnoza", "amount": 45000},
    {"date": "2026-03-09", "customer": "Farrukh", "amount": 300000},
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
2026-03-09,Farrukh,300000
```

A datetime column can be compared directly with a date string such as `"2026-03-01"`. `None` in JSON becomes `NaN`, which `dropna()` removes.
:::

## Recap

- pandas (imported as `pd`) works with tables: a **Series** is one labeled column, a **DataFrame** is a table of Series sharing one index.
- `read_csv()` and `read_json()` load files (`sep`, `encoding`, `usecols`, `dtype` handle messy ones). Start with `head()`, `shape`, `dtypes`, and `describe()`.
- `df["col"]` gives a Series, `df[["a", "b"]]` gives a DataFrame, `.loc` selects by label, and `.iloc` selects by position.
- Filter with boolean masks, combining conditions with `&`, `|`, `~` and parentheses.
- Find gaps with `isna()`, then `dropna()` or `fillna()`; convert with `astype()` and `pd.to_datetime()`; save with `to_csv(..., index=False)`. Most methods return a new DataFrame, so assign the result.

## Further reading

- [10 minutes to pandas](https://pandas.pydata.org/docs/user_guide/10min.html)
- [pandas: IO tools (CSV, JSON, and more)](https://pandas.pydata.org/docs/user_guide/io.html)
- [pandas: Indexing and selecting data](https://pandas.pydata.org/docs/user_guide/indexing.html)
- [pandas: Working with missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html)
