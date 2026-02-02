---
theme: seriph
background: https://cover.sli.dev
title: "Pointers in C"
class: text-center
transition: slide-left
mdc: true
---

# The C Programming Language
### Pointers

<br />

[c-pointers.exe.xyz](https://c-pointer.exe.xyz)

---
layout: default
---

# Lecture Overview

1. Quick Review of Program Memory
2. Conceptualize Pointers
3. Pointer Syntax
4. How Pointers relate to Arrays and Strings in C
5. Short group exercise

<br />

### Lecture Goals (What you should take away)
* A grasp of what pointers are and why we need them
* An introduction and reference to pointer syntax
  * The ability to use pointers effectively will take practice


---
src: pages/memory-layout.md
---

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

```c{monaco-run}
#include <stdio.h>
#include <stdlib.h>

int main() {
    int* arr = malloc(5 * sizeof(int));

    arr[0] = 10;
    arr[1] = 20;
    arr[2] = 30;
    arr[3] = 40;
    arr[4] = 50;

    // . . . do things.

    free(arr);
}
```

::right::

1. Where is the `5 * sizeof(int)` object stored?
2. Where is `int* arr` variable stored?
3. Why might you implement this pattern? 