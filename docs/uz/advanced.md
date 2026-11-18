---
title: Advanced Python
description: "Python yoza oladiganlar uçun qisqa yönaliş: dekoratorlar, maʼlumot modeli, kontekst menejerlari, async, oqimlar va jarayonlar, samaradorlik, dizayn patternlar va testlaşni çuqurroq örganiş."
---

# Advanced Python

<div class="course-intro">Siz <code>@property</code>, <code>with</code> va <code>@pytest.mark.parametrize</code> dan foydalangansiz. Bu yönaliş ular qanday işlaşini va özingiz şunday vositalarni qanday yozişni körsatadi.</div>

Bu yönaliş [asosiy darslikni](/uz/) tugatganlar yoki Pythonda muntazam kod yozadiganlar uçun. Unda sakkizta dars va bitta loyiha bor. Format asosiy darslikdagi bilan bir xil: işga tuşiriladigan misollar, haqiqiy xato xabarlari bilan köp uçraydigan xatolar, yeçimli maşqlar va oxirida nazorat testi.

**[«Closure va dekoratorlar» darsidan boşlaş →](/uz/lessons/closures-and-decorators)** · [Asosiy darslikka qaytiş](/uz/)

## Nimalarni biliş kerak

Darslar asosiy darslikdagi quyidagi mavzularga tayanadi. Birortasi notaniş bölsa, avval öşa darsni öqing.

- Funksiyalarni qiymat sifatida uzatiş: *Lambda va yuqori tartibli funksiyalar*
- Klasslar yoziş: *Xossalar va inkapsulyatsiya*, *Obyektlarni ifodalaş va taqqoslaş*, *Operatorlar va konteynerlar*
- *Dataclasslar*
- *with operatori*
- *Iteratorlar va generatorlar*
- *pytest bilan testlaş*

## Darslar

| Dars | Nimalarni qila olasiz |
| --- | --- |
| *Closure va dekoratorlar* | `functools.wraps` bilan dekoratorlar yoziş, ularga argument beriş va ustma-ust qöyiş |
| *Python maʼlumot modeli* | Atribut qidiruvi, `__slots__` va `property` ortidagi deskriptorlar qanday işlaşini tuşuntiriş |
| *Kontekst menejerlarini çuqurroq örganiş* | Klass körinişidagi kontekst menejerlarini yoziş va bir neça resursni `ExitStack` bilan boşqariş |
| *Async va await* | Korutinalarni `gather` va `TaskGroup` bilan bir vaqtda işga tuşiriş hamda async qaçon foyda berişini aniqlaş |
| *Xotira va samaradorlik* | Optimallaştirişdan oldin vaqt va xotirani `timeit`, `tracemalloc` va `cProfile` bilan ölçaş |
| *Pythonça dizayn patternlar* | Strategy, Factory, Registry va Observer patternlarini Python kodida odatda yoziladigan usulda qöllaş |
| *Oqimlar va jarayonlar* | I/O-bound va CPU-bound işlar uçun oqim, jarayon yoki asyncio ni tanlaş |
| *Testlaşni çuqurroq örganiş* | Test töplamini fixturelar, `monkeypatch` va `unittest.mock` bilan tartiblaş |
| *Loyiha: Log konveyeri* | Generatorlar, dekoratorlar, kontekst menejerlari va async ni testlari bor bitta dasturda birlaştiriş |

Iloji bölsa, tartib bilan boring. Loyiha oxirida turadi, çunki u oldingi deyarli har bir darsdan nimadir işlatadi.

## Nima kerak

Misollarning köpi saytning boşqa qismlaridagi kabi brauzerda işlaydi. Ayrimlari işlamaydi: saytdagi muharrir oqim yoki jarayonlarni işga tuşira olmaydi, şuning uçun *Oqimlar va jarayonlar* darsidagi misollarni öz kompyuteringizda işga tuşirişingiz kerak. Samaradorlik va testlaş darslaridagi baʼzi misollar ham şunday. Bu haqda öşa darslarning özida aytiladi. Örnatiş tartibi *Pythonni örnatiş* darsida berilgan.
