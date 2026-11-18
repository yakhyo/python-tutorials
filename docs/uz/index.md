---
layout: page
sidebar: false
title: Pythonni örganing
description: "Boşlovçilar uçun Python darsligi: tuşunarli izohlar, brauzerda işlaydigan kod va yeçimli maşqlar."
home:
  title: Pythonni noldan örganing
  lead: Boşlovçilar uçun brauzerda işlaydigan töliq darslik. Qisqa darsni öqing, kodni şu sahifaning özida işga tuşiring va maşqlaringizni özingiz tekşiring.
  start: Birinçi darsni boşlaş
  resume: Davom etiş
  browse: Barça darslarni köriş
  demoLabel: Hozir sinab köring. Kodni özgartiring va işga tuşiring.
  code: |
    darslar = ["özgaruvçilar", "sikllar", "funksiyalar"]

    for raqam, mavzu in enumerate(darslar, start=1):
        print(f"{raqam}-dars: {mavzu}")

    print("Endi röyxatni özgartirib köring.")
  stats:
    lessons: dars
    modules: modul
    projects: loyiha
    projectCount: 5
  path:
    title: Nimalarni örganasiz
    lead: Darslik ikki qismdan iborat va sizni birinçi kod qatoridan testlangan, obyektga yönaltirilgan dasturlargaça olib boradi. Undan keyin ikkita qisqaroq yönaliş bor.
    progress: "{total} darsdan {done} tasi oçilgan"
    opened: oçilgan
    levels:
      - name: Asoslar
        text: Qaror qabul qiladigan, işni takrorlaydigan va maʼlumotlarni tartiblaydigan kiçik dasturlar yozasiz. Avval heç dasturlamagan bölsangiz, şu yerdan boşlang.
        modules: ["01", "02", "03", "04", "05", "06"]
      - name: Haqiqiy dasturlar
        text: Fayllarni öqiş va yoziş, xatolarni qayta işlaş, klasslarni loyihalaş va kodni testlaş.
        modules: ["07", "08", "09", "10", "11", "12"]
      - name: Maʼlumotlar bilan işlaş
        track: true
        text: Darslikdan keyingi alohida yönaliş. Jadvallarni pandasʼga yuklaysiz, tozalaysiz, umumlaştirasiz va matplotlib bilan grafik çizasiz.
        modules: ["13"]
        link: /data
        linkText: Yönaliş haqida
      - name: Advanced Python
        track: true
        text: Python yoza oladiganlar uçun alohida yönaliş. Dekoratorlar, maʼlumot modeli, async, oqimlar va jarayonlar, samaradorlik va testlaşni çuqurroq örganiş.
        modules: ["14"]
        link: /advanced
        linkText: Yönaliş haqida
  projects:
    title: Nimalar qurasiz
    lead: Beşta loyiha 4, 6, 8, 10 va 12-modullarning oxirida keladi. Har birini qadamma-qadam qurasiz, oxirida töliq dastur beriladi.
    moduleLabel: "{n}-modul"
    items:
      number-guessing-game: Tasodifiy sonlar, maslahatlar, çeklangan urinişlar, qiyinlik darajalari va eng yaxşi natija.
      quiz-game: Tasodifiy tartibdagi variantli savollar, mavzular böyiça ball va xato javoblarni körib çiqiş.
      expense-tracker: Xarajatlarni JSON ga saqlaydi, CSV ga eksport qiladi, oylar böyiça jamlaydi va byudjetdan oşganda ogohlantiradi.
      oop-project: Kitoblar, aʼzolar, qaytariş muddatlari va jarimalar klasslar bilan modellaştiriladi va JSON ga saqlanadi.
      text-processing-project: Matn faylini öqiydi va eng köp uçraydigan sözlarni JSON va matn körinişida hisobot qiladi.
  note: "Darslik yangi özbek lotin alifbosida yozilgan: ş, ç, ö, ğ harflari oldingi sh, ch, oʻ, gʻ örnida işlatiladi."
  closing:
    title: Birinçi darsdan boşlang
    text: Unda Python nima ekani tuşuntiriladi va siz birinçi kod qatoringizni şu sahifaning özida işga tuşirasiz.
    playground: Sinov maydonçasini oçiş
---

<CourseHome />
