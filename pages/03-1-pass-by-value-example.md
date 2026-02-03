---
layout: two-cols-header
layoutClass: col-wide-left 
---

# Pass by Value

::left::
```c{monaco-run}
#include<stdio.h>

void square(int x) {
    x = x * x;
    printf("x = %d  (in fn square)\n", x);
}

int main() {
    int a = 5;
    printf("a = %d   (before fn square)\n", a);
    square(a);
    printf("a = %d   (after fn square)\n", a);
}
```

::right::

C **is strictly** pass by value
* when a variable is *passed* from a caller, it is **always** copied.

<!--

[Question] what is the output here?
 -- what is A before and after calling SQUARE()?

 it doesn't change. hm .... let's explore
-->

---
layout: two-cols-header
transition: fade
---

# Pass by Value
Main stack frame initialized

::left::
```c{8}
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
<div class="flex justify-end">
    <MemoryTable 
        title="[main] stack frame" 
        :baseAddress="0x1000"
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
`a` is pushed to the stack frame

::left::
```c{9}
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
<div class="flex justify-end">
    <MemoryTable 
        title="[main] stack frame" 
        :baseAddress="0x1000"
        :variables="[
            { type: 'gap', value: 4 },
            { type: 'int', name: 'a', value: 5 }
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
`square` accepts an integer value as a parameter. 

::left::
```c{11}
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
<div class="flex justify-end">
    <MemoryTable 
        title="[main] stack frame" 
        :baseAddress="0xffff1000"
        :variables="[
            { type: 'gap', value: 4 },
            { type: 'int', name: 'a', value: 5 }
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
`square` get its own stack frame

::left::
```c{3}
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

**Note**: The `main` stack frame still exists

::right::
<div class="flex justify-end">
    <MemoryTable 
        title="[square] stack frame" 
        :baseAddress="0xffff0ff8"
        :variables="[
            { type: 'gap', value: 8 },
        ]"
        showValues
    />
</div>

---
layout: two-cols-header
transition: fade
---

# Pass by Value
The value of `a` is copied to `x` in the new frame.

::left::
```c{3}
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
<div class="flex justify-end">
    <MemoryTable 
        title="[square] stack frame" 
        :baseAddress="0xffff0ff8"
        :variables="[
            { type: 'gap', value: 4 },
            { type: 'int', name: 'x', value: 5 }
        ]"
        showValues
    />
</div>

---
layout: two-cols-header
transition: fade
---

# Pass by Value
`x` is directly manipulated

::left::
```c{4}
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
<div class="flex justify-end">
    <MemoryTable 
        title="[square] stack frame" 
        :baseAddress="0xffff0ff8"
        :variables="[
            { type: 'gap', value: 4 },
            { type: 'int', name: 'x', value: 25 }
        ]"
        showValues
    />
</div>

---
layout: two-cols-header
transition: fade
---

# Pass by Value
`a` remains unaltered in the `main` stack frame.

::left::
```c{12}
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

The `square` stack frame is "popped" off the stack, effectively freed.

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