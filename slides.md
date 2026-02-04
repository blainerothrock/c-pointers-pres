---
theme: seriph
background: https://cover.sli.dev
title: "Pointers in C"
class: text-center
transition: slide-left
mdc: true
lineNumbers: true
---

# Pointers
###  The C Programming Language

<br />
<br />

<div class="flex justify-around mt-8">
<div class="text-center">
<img src="/images/slide-app-qr.png" alt="Slides QR" class="mx-auto w-36" />
<p class="text-sm mt-2">Slides</p>
<a href="https://c-pointers-pres-caeed.ondigitalocean.app/" class="text-xs">c-pointers-pres-caeed.ondigitalocean.app</a>
</div>
<div class="text-center">
<img src="/images/source-code-qr.png" alt="GitHub QR" class="mx-auto w-36" />
<p class="text-sm mt-2">Source Code</p>
<a href="https://github.com/blainerothrock/c-pointers-pres" class="text-xs">github.com/blainerothrock/c-pointers-pres</a>
</div>
</div>

<!--
Welcome!

The slides and presentation source code can be found with these two links
-->

---
layout: two-cols-header
---

# Why C? Why Pointers?

::left::

C remains one of the most-used languages in 2026
- Operating systems, embedded systems, databases
- Direct hardware access, unmatched performance
- Foundation for understanding how computers work

<br>

**Pointers** are C's most powerful (and infamous) tool
- Direct memory manipulation
- Required for arrays, strings, and dynamic data
- **Today**: build the mental model, learn the syntax

::right::

<div class="flex justify-end">
    <MemoryLayout />
</div>

<!--
- C is used in a ton of low level coding from OSes to databases.
- It compiles directly to machine code with no runtime, and minimal safety,
- This give it unprecendented speed. 
- To write the fastest-code, write assembly, second fastest C.
-->

---
layout: two-cols-header
---

# Lecture Overview

::left::

1. The Problem: You Can't Swap Without Pointers
2. What is a Pointer?
3. Pointer Syntax
4. Pointers, Arrays, and Strings

<br />

## Goals
* A grasp of what pointers are and why we need them
* An introduction and reference to pointer syntax
  * The ability to use pointers effectively will take practice

::right::
<img src="/images/pointers-xkcd.png" alt="xkcd pointers" class="w-64 mx-auto" />


---
src: pages/03-1-pass-by-value-example.md
---

---
layout: two-cols-header
layoutClass: col-wide-left
---

# Can we fix this?
Spoiler: yes, with pointers

::left::

```c {monaco-run}
#include<stdio.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 3, y = 7;
    printf("before: x=%d, y=%d\n", x, y);
    swap(&x, &y);
    printf("after:  x=%d, y=%d\n", x, y);
}
```

::right::

It works! But what is `*`, `&`, `int*`?

Let's find out ...

<!--
Don't explain the syntax yet. Just show it works and that we need to learn what these symbols mean.
"Let's now build the mental model for what's happening here"
-->

---
src: pages/02-pointers-intro.md
---

---
src: pages/03-pointer-syntax.md
---

---
src: pages/04-pointer-arithmetic.md
---

---
layout: two-cols-header
layoutClass: gap-4
---
# Final Question
Discuss in a small group

::left::

```c {*}{lines:true} {monaco-run}
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 8KB
    int* buf = malloc(2048 * sizeof(int));

    buf[0] = 10;
    buf[1] = 20;
    buf[2] = 30;
    buf[3] = 40;
    buf[4] = 50;

    // . . . do things.

    free(buf);
}
```

::right::

1. In program memory, where is the `2048 * sizeof(int)` object stored?
2. In program memory, where is `int* arr` variable stored?
3. Why would you implement this pattern?

---
layout: two-cols-header
layoutClass: gap-4
---
# Final Question
Answer

::left::

```c {*}{lines:true} {monaco-run}
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 8KB
    int* buf = malloc(2048 * sizeof(int));

    buf[0] = 10;
    buf[1] = 20;
    buf[2] = 30;
    buf[3] = 40;
    buf[4] = 50;

    // . . . do things.

    free(buf);
}
```

---
layout: default
---

# End