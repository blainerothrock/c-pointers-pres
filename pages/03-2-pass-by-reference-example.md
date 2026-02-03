---
layout: two-cols-header
layoutClass: col-wide-left 
transition: fade
---

# Pass by ~~Reference~~ Value with Pointers

::left::

```c{monaco-run}
#include<stdio.h>

void square(int* x) {
    *x = *x * *x;
    printf("x = %d  (in fn square)\n", *x);
}

int main() {
    int a = 5;
    printf("a = %d   (before fn square)\n", a);
    square(&a);
    printf("a = %d   (after fn square)\n", a);
}
```

::right::

Pointer as parameters emulate *pass by reference*
* Pointers are **still copied**
* Allows manipulation across scoped memory

---
layout: two-cols-header
layoutClass: col-wide-left 
transition: fade
---

# Pass by ~~Reference~~ Value with Pointers
`square` accepts *a pointer to an integer* as a parameter

::left::
```c{11}
#include<stdio.h>

void square(int* x) {
    *x = *x * *x;
    printf("x = %d  (in fn square)\n", *x);
}

int main() {
    int a = 5;
    printf("a = %d   (before fn square)\n", a);
    square(&a);
    printf("a = %d   (after fn square)\n", a);
}
```

::right::
<div class="flex justify-end">
    <MemoryTable 
        title="[main] stack frame" 
        :baseAddress="0xffff1000"
        :variables="[
            { type: 'gap', value: 4 },
            { type: 'int', name: 'a', value: 5 }
        ]"
        showValues
    />
</div>

---
layout: two-cols-header
layoutClass: col-wide-left 
transition: fade
---

# Pass by ~~Reference~~ Value with Pointers
The pointers gets copied on the new stack frame

::left::
```c{3}
#include<stdio.h>

void square(int* x) {
    *x = *x * *x;
    printf("x = %d  (in fn square)\n", *x);
}

int main() {
    int a = 5;
    printf("a = %d   (before fn square)\n", a);
    square(&a);
    printf("a = %d   (after fn square)\n", a);
}
```

::right::
<div class="flex justify-end">
    <MemoryTable 
        title="[square] stack frame" 
        :baseAddress="0xffff0ff8"
        :variables="[
            { type: 'gap', value: 4 },
            { type: 'int*', name: 'x', value: 0x00001004 }
        ]"
        showValues
    />
</div>

---
layout: two-cols-header
layoutClass: col-wide-left 
transition: fade
---

# Pass by ~~Reference~~ Value with Pointers
The original value is altered using dereferencing

::left::
```c{4}
#include<stdio.h>

void square(int* x) {
    *x = *x * *x;
    printf("x = %d  (in fn square)\n", *x);
}

int main() {
    int a = 5;
    printf("a = %d   (before fn square)\n", a);
    square(&a);
    printf("a = %d   (after fn square)\n", a);
}
```

::right::
<div class="flex justify-end">
    <MemoryTable 
        title="[main] stack frame" 
        :baseAddress="0xffff1000"
        :variables="[
            { type: 'gap', value: 4 },
            { type: 'int', name: 'a', value: 25 }
        ]"
        showValues
    />
</div>

---
layout: two-cols-header
layoutClass: gap-4
transition: fade
---

# Compare
Pass by value with and without pointers

::left::
```c{monaco-run}
#include<stdio.h>

void square(int x) {
    x = x * x;
    printf("x = %d  (in fn square)\n", x);
}

int main() {        // program entry point
    int a = 5;
    printf("a = %d   (before fn square)\n", a);
    square(a);
    printf("a = %d   (after fn square)\n", a);
}
```

::right::
```c{monaco-run}
#include<stdio.h>

void square(int* x) {
    *x = *x * *x;
    printf("x = %d  (in fn square)\n", *x);
}

int main() {
    int a = 5;
    printf("a = %d   (before fn square)\n", a);
    square(&a);
    printf("a = %d   (after fn square)\n", a);
}
```

<!--
    Now let's look at couple more syntax examples
-->