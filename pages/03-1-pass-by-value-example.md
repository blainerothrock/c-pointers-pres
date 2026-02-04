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
    printf("in swap:     a=%d, b=%d\n", a, b);
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

<div v-click>

**Swap doesn't swap!**
</div>

<br />

<div v-click>

**Why?**

C **is strictly** pass by value
* when a variable is *passed* to a function, it is **always** copied.
</div>

<br />
<br />

<!--
[Predict] "What will x and y be after calling swap(x, y)?"

Let students answer before running the code. Most will expect x=7, y=3.
Run it — surprise! x and y are unchanged. Why? Let's trace through the stack.
-->
