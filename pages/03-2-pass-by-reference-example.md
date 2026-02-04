---
layout: two-cols-header
layoutClass: col-wide-left
transition: fade
---

# Pass by ~~Reference~~ Value with Pointers
The swap, solved!

::left::

```c{monaco-run}
#include<stdio.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 3;
    int y = 7;
    printf("before swap: x=%d, y=%d\n", x, y);
    swap(&x, &y);
    printf("after swap:  x=%d, y=%d\n", x, y);
}
```

::right::

Pointer parameters emulate *pass by reference*
* Pointers are **still copied**
* But they point to the **original** variables
* Allows manipulation across scoped memory

<!--
Now that we know pointer syntax, let's revisit swap.
This time we pass pointers to x and y instead of copies.
-->

---
layout: two-cols
layoutClass: col-wide-left
transition: fade
---

# Pass by ~~Reference~~ Value with Pointers
`swap` accepts *pointers to integers* as parameters

::left::
```c {12}{lines:true}
#include<stdio.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 3;
    int y = 7;
    printf("before swap: x=%d, y=%d\n", x, y);
    swap(&x, &y);
    printf("after swap:  x=%d, y=%d\n", x, y);
}
```

::right::
<div class="flex justify-end">
    <MemoryTable
        title="[main] stack frame"
        :baseAddress="0x1004"
        :variables="[
            { type: 'int', name: 'y', value: 7 },
            { type: 'int', name: 'x', value: 3 }
        ]"
        showValues
        :showTopEllipsis="false"
    />
</div>

---
layout: two-cols
layoutClass: col-wide-left
transition: fade
---

# Pass by ~~Reference~~ Value with Pointers
Pointers `a` and `b` are copied — they point to `x` and `y`

::left::
```c {3-4}{lines:true}
#include<stdio.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 3;
    int y = 7;
    printf("before swap: x=%d, y=%d\n", x, y);
    swap(&x, &y);
    printf("after swap:  x=%d, y=%d\n", x, y);
}
```

::right::
<div class="flex justify-end">
    <MemoryTable
        title="[swap] stack frame"
        :baseAddress="0x0ff8"
        :variables="[
            { type: 'int', name: 'temp', value:  3},
            { type: 'int*', name: 'b', value: 0x00001004 },
            { type: 'int*', name: 'a', value: 0x00001000 }
        ]"
        showValues
    />
</div>

---
layout: two-cols
layoutClass: col-wide-left
transition: fade
---

# Pass by ~~Reference~~ Value with Pointers
Dereference and swap via pointers — changes `x` and `y` in main's frame!

::left::
```c {5-6}{lines:true}
#include<stdio.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 3, y = 7;
    printf("before swap: x=%d, y=%d\n", x, y);
    swap(&x, &y);
    printf("after swap:  x=%d, y=%d\n", x, y);
}
```

::right::
<div class="flex justify-end">
    <MemoryTable
        title="[main] stack frame"
        :baseAddress="0x1004"
        :variables="[
            { type: 'int', name: 'y', value: 3 },
            { type: 'int', name: 'x', value: 7 }
        ]"
        showValues
        :showTopEllipsis="false"
    />
</div>

---
layout: two-cols-header
layoutClass: gap-4
transition: fade
---

# Compare
Swap without pointers vs swap with pointers

::left::
```c{monaco-run}
#include<stdio.h>

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 3, y = 7;
    printf("before: x=%d, y=%d\n", x, y);
    swap(x, y);
    printf("after:  x=%d, y=%d\n", x, y);
}
```

::right::
```c{monaco-run}
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

<!--
[Check] "Why did the swap work this time but not before?"

The pointer version doesn't copy x and y — it copies their ADDRESSES.
When we dereference, we modify the originals directly.
-->
