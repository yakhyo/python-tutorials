---
layout: page
sidebar: false
title: Learn Python
description: "A Python course for beginners: clear explanations, code you can run in the browser, and exercises with solutions."
home:
  title: Learn Python from zero
  lead: A complete beginner course that runs in your browser. Read a short lesson, run the code on the page, and check your own exercises.
  start: Start the first lesson
  resume: Continue
  browse: See all lessons
  demoLabel: Try it now. Change the code and press Run.
  code: |
    lessons = ["variables", "loops", "functions"]

    for number, topic in enumerate(lessons, start=1):
        print(f"Lesson {number}: {topic}")

    print("Now change the list and run it again.")
  stats:
    lessons: lessons
    modules: modules
    projects: guided projects
    projectCount: 5
  path:
    title: What you will learn
    lead: The course has two parts and takes you from your first line of code to tested, object-oriented programs. A shorter track on working with data continues from there, and the Advanced Python course comes after.
    progress: "{done} of {total} lessons opened"
    opened: opened
    levels:
      - name: Foundations
        text: Write small programs that make decisions, repeat work, and organize data. Start here if you have never programmed before.
        modules: ["01", "02", "03", "04", "05", "06"]
      - name: Real programs
        text: Read and write files, handle errors, design classes, and test your code.
        modules: ["07", "08", "09", "10", "11", "12"]
      - name: Working with data
        track: true
        text: A separate track for after the course. Load tables into pandas, clean and summarize them, and draw charts with matplotlib.
        modules: ["13"]
        link: /data
        linkText: Track overview
  projects:
    title: What you will build
    lead: Five guided projects come at the end of modules 4, 6, 8, 10 and 12. You build each one step by step, with the full program at the end.
    moduleLabel: "Module {n}"
    items:
      number-guessing-game: Random numbers, hints, limited attempts, difficulty levels and a best score.
      quiz-game: Multiple-choice questions in random order, a score per topic and a review of wrong answers.
      expense-tracker: Saves expenses to JSON, exports CSV, sums them by month and warns when you pass a budget.
      oop-project: Books, members, due dates and fines, modeled with classes and saved to JSON.
      text-processing-project: Reads a text file and reports its most common words as JSON and plain text.
  closing:
    title: The first lesson is the place to start
    text: It explains what Python is and has you run your first line of code on the page.
    playground: Open the playground
---

<CourseHome />
