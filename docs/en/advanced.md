---
title: Advanced Python
description: "A short track for people who already write Python: decorators, the data model, context managers, async, threads and processes, performance, design patterns, and deeper testing."
---

# Advanced Python

<div class="course-intro">You have used <code>@property</code>, <code>with</code>, and <code>@pytest.mark.parametrize</code>. This track shows how they work and how to write your own.</div>

This track is for people who finished the [main course](/en/) or already write Python regularly. It has eight lessons and one project. The format is the same as the main course: runnable examples, common mistakes with real error output, exercises with solutions, and a checkpoint quiz at the end.

**[Start with Closures and Decorators →](/en/lessons/closures-and-decorators)** · [Back to the main course](/en/)

## What you should already know

The lessons build on these topics from the main course. If one is unfamiliar, read that lesson first.

- Passing functions as values: *Lambdas and Higher-Order Functions*
- Writing classes: *Properties and Encapsulation*, *Representing and Comparing Objects*, *Operators and Containers*
- *Dataclasses*
- *The with Statement*
- *Iterators and Generators*
- *Testing with pytest*

## Lessons

| Lesson | You'll be able to |
| --- | --- |
| *Closures and Decorators* | Write decorators with `functools.wraps`, give them arguments, and stack them |
| *The Python Data Model* | Explain how attribute lookup, `__slots__`, and the descriptors behind `property` work |
| *Context Managers in Depth* | Write class-based context managers and manage several resources with `ExitStack` |
| *Async and await* | Run coroutines concurrently with `gather` and `TaskGroup`, and tell when async helps |
| *Memory and Performance* | Measure time and memory with `timeit`, `tracemalloc`, and `cProfile` before you optimize |
| *Pythonic Design Patterns* | Use strategies, factories, registries, and observers the way Python code usually writes them |
| *Threads and Processes* | Choose between threads, processes, and asyncio for I/O-bound and CPU-bound work |
| *Testing in Depth* | Organize a test suite with fixtures, `monkeypatch`, and `unittest.mock` |
| *Project: Log Pipeline* | Combine generators, decorators, context managers, and async in one program with tests |

Go in order if you can. The project comes last because it uses something from almost every lesson before it.

## What you need

Most examples run in the browser, like the rest of the site. A few do not: the site's editor cannot start threads or processes, so *Threads and Processes* asks you to run its examples on your own computer, and some examples in the performance and testing lessons do the same. Those lessons say so where it applies. *Installing Python* covers the setup.
