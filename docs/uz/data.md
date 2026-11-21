---
title: Maʼlumotlar bilan işlaş
description: "Pythonda maʼlumotlar tahlili boyiça qisqa yönaliş: CSV va JSON ni pandasʼga yuklaş, jadvallarni tozalaş va umumlaştiriş, matplotlib bilan grafik çiziş va savdo hisobotini tuziş."
---

# Maʼlumotlar bilan işlaş

<div class="course-intro">Jadvalni yuklang, tozalang, u haqidagi savollarga javob toping va grafigini çizing. pandas va matplotlib boyiça uçta dars va bitta loyiha.</div>

Bu yönaliş [asosiy darslikni](/uz/) tugatgan va qölida maʼlumoti borlar uçun: savdo yozuvlari, imtihon natijalari, sörovnoma javoblari, ölçovlar. Asosiy darslikda siz CSV va JSON fayllarini standart kutubxona bilan öqigansiz, u yerda har bir savol uçun sikl kerak edi. Bu yerda öşa savollarga pandasʼning bir qatori bilan javob beriladi.

**[«Maʼlumot fayllarini öqiş» darsidan boşlaş →](/uz/lessons/reading-data)** · [Asosiy darslikka qaytiş](/uz/)

## Nimalarni biliş kerak

- Fayllarni standart kutubxona bilan öqiş: *CSV bilan işlaş* va *JSON bilan işlaş*
- Luğatlar röyxati: *Içma-iç maʼlumotlar*
- *Sana va vaqt*

## Darslar

| Dars | Nimalarni qila olasiz |
| --- | --- |
| *Maʼlumot fayllarini öqiş* | CSV va JSON ni DataFrameʼga yuklaş, qatorlarni tanlaş va filtrlaş, yöq qiymatlarni tuzatiş |
| *pandas asoslari* | Jadvallarni saralaş, guruhlaş, agregatsiya qiliş, yiğma jadval tuziş va birlaştiriş |
| *matplotlib bilan grafiklar* | Çiziqli, ustunli, gistogramma va nuqtali diagrammalar çiziş hamda ularni rasm sifatida saqlaş |
| *Loyiha: Savdo hisoboti* | Tartibsiz savdo maʼlumotlarini tozalaş hamda jadvallar va uç panelli grafigi bor hisobot tayyorlaş |

## Nima kerak

Darslarni öqiş uçun heç narsa örnatiş şart emas. Saytdagi muharrir kodingiz pandas va matplotlibʼni import qilganda ularni özi yuklaydi, şuning uçun misolning birinçi işga tuşişi odatdagidan sekinroq böladi. Öz fayllaringiz bilan işlaş uçun [Python laboratoriyasi](/uz/lab)dan foydalaning: unda fayl brauzeri va yuklaş tugmasi bor.

Öz kompyuteringizda avval ikkala paketni örnating:

```text
python -m pip install pandas matplotlib
```
