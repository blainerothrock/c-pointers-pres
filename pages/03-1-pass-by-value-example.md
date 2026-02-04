---
layout: two-cols-header
layoutClass: col-wide-left
---

# The Problem: Swap

::left::
```c{monaco-run}
#include<stdio.h>

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    printf("in swap: a=%d, b=%d\n", a, b);
}

int main() {
    int x = 3, y = 7;
    printf("before swap: x=%d, y=%d\n", x, y);
    swap(x, y);
    printf("after swap:  x=%d, y=%d\n", x, y);
}
```

::right::

C **is strictly** pass by value
* when a variable is *passed* to a function, it is **always** copied.

<br />
<br />

<!--
[Predict] "What will x and y be after calling swap(x, y)?"

Let students answer before running the code. Most will expect x=7, y=3.
Run it — surprise! x and y are unchanged. Why? Let's trace through the stack.
-->

---
layout: two-cols-header
transition: fade
---

# Pass by Value
Main stack frame initialized

::left::
```c {10}{lines:true}
#include<stdio.h>

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    printf("in swap: a=%d, b=%d\n", a, b);
}

int main() {
    int x = 3;
    int y = 7;
    printf("before swap: x=%d, y=%d\n", x, y);
    swap(x, y);
    printf("after swap:  x=%d, y=%d\n", x, y);
}
```


::right::
<div class="flex justify-end">
    <MemoryTable
        title="[main] stack frame"
        :baseAddress="0x1004"
        :variables="[
            { type: 'gap', value: 8 }
        ]"
        showValues
        :showTopEllipsis="false"
    />
</div>


---
layout: two-cols-header
transition: fade
---

# Pass by Value
`x` and `y` are pushed to the stack frame

::left::
```c {11-12}{lines:true}
#include<stdio.h>

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    printf("in swap: a=%d, b=%d\n", a, b);
}

int main() {
    int x = 3;
    int y = 7;
    printf("before swap: x=%d, y=%d\n", x, y);
    swap(x, y);
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
transition: fade
---

# Pass by Value
`swap(x, y)` called — new stack frame created

::left::
```c {3}{lines:true}
#include<stdio.h>

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    printf("in swap: a=%d, b=%d\n", a, b);
}

int main() {
    int x = 3; 
    int y = 7;
    printf("before swap: x=%d, y=%d\n", x, y);
    swap(x, y);
    printf("after swap:  x=%d, y=%d\n", x, y);
}
```

**Note**: The `main` stack frame still exists

::right::
<div class="flex justify-end">
    <MemoryTable
        title="[swap] stack frame"
        :baseAddress="0x0ff8"
        :variables="[
            { type: 'gap', value: 4 },
            { type: 'int', name: 'b', value: 7 },
            { type: 'int', name: 'a', value: 3 }
        ]"
        showValues
    />
</div>

---
layout: two-cols
transition: fade
---

# Pass by Value
`temp` is created to persist `a` during the swap

::left::
```c {4}{lines:true}
#include<stdio.h>

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    printf("in swap: a=%d, b=%d\n", a, b);
}

int main() {
    int x = 3; 
    int y = 7;
    printf("before swap: x=%d, y=%d\n", x, y);
    swap(x, y);
    printf("after swap:  x=%d, y=%d\n", x, y);
}
```

**Note**: The `main` stack frame still exists

::right::
<div class="flex justify-end">
    <MemoryTable
        title="[swap] stack frame"
        :baseAddress="0x0ff8"
        :variables="[
            { type: 'int', name: 'temp', value: 3 },
            { type: 'int', name: 'b', value: 7 },
            { type: 'int', name: 'a', value: 3 }
        ]"
        showValues
    />
</div>

---
layout: two-cols
transition: fade
---

# Pass by Value
`a` and `b` are swapped using `temp`
 
::left::
```c {5-6}{lines:true}
#include<stdio.h>

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    printf("in swap: a=%d, b=%d\n", a, b);
}

int main() {
    int x = 3;
    int y = 7;
    printf("before swap: x=%d, y=%d\n", x, y);
    swap(x, y);
    printf("after swap:  x=%d, y=%d\n", x, y);
}
```

The swap worked... but only on the **copies**.

::right::
<div class="flex justify-end">
    <MemoryTable
        title="[swap] stack frame"
        :baseAddress="0x0ff8"
        :variables="[
            { type: 'int', name: 'temp', value: 3 },
            { type: 'int', name: 'b', value: 3 },
            { type: 'int', name: 'a', value: 7 }
        ]"
        showValues
    />
</div>


---
layout: two-cols-header
transition: fade
---

# Pass by Value
Return to main: `x` and `y` are **unchanged**

::left::
```c {14}{lines:true}
#include<stdio.h>

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    printf("in swap: a=%d, b=%d\n", a, b);
}

int main() {
    int x = 3, y = 7;
    printf("before swap: x=%d, y=%d\n", x, y);
    swap(x, y);
    printf("after swap:  x=%d, y=%d\n", x, y);
}
```

The `swap` stack frame is "popped" off the stack, effectively freed.

::right::
<div class="flex justify-end">
    <MemoryTable
        title="[main] stack frame"
        :baseAddress="0x1000"
        :variables="[
            { type: 'int', name: 'y', value: 7 },
            { type: 'int', name: 'x', value: 3 }
        ]"
        :showTopEllipsis="false"
        showValues
    />
</div>
