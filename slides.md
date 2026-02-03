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
layout: default
---

# Lecture Overview

1. Quick Review of Program Memory
2. Conceptualize Pointers
3. Pointer Syntax
4. How Pointers relate to Arrays and Strings in C
5. Short group exercise

<br />

### Lecture Goals
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


---
background: https://cover.sli.dev
class: text-center
---

# End.