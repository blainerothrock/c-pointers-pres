---
layout: section
---

# What is a Pointer?
## (with examples)

---
layout: two-cols-header
transition: fade
---

# Values, Variables, and Data Types
review

::left::

### **Values** are information
* Appear directly in machine code
* Not stored until assigned

<br>

### **Variables** store values
* Assignment (`=`) stores a value in memory
* With a variable, values can be used

<br>

### Variables have **data types**
* Types dictate the size in memory
* **All data stored has a concrete size**
* Size is dependent on the system

::right::

```c {*}{lines:true}
#include <stdio.h>

struct __attribute__((packed)) my_struct {
    char a;
    double b;
};


int main() {
    25;                             // 0 bytes
    char a = 'A';                   // 1 byte
    int b = 34;                     // 4 bytes
    double c = 3.14;                // 8 bytes
    struct my_struct d = { a, c };  // 9 bytes   

    return 0;
}
```

<!--

Values are information or data
Variables store values
Variables have data types

-- 
don't worry too much about the syntax of the struct here.
-->

---
layout: two-cols-header
transition: fade
layoutClass: col-wide-left 
---

# Variable Storage
This is an empty program, nothing is stored in memory.

::left::
##
```c [main.c] {*}{lines:true}
int main() {

    return 0;
}
```

::right::

<div class="flex justify-end">
    <MemoryTable 
        title="stack"
        :baseAddress="0x1000"
        :variables="[
            { type: 'gap', value: 10},
        ]"
        :showTopEllipsis="false"
        showValues
    />
</div>

<!--
Here we have a empty main function, and a empty stack frame (local storage in RAM)
-->

---
layout: two-cols-header
transition: fade
layoutClass: col-wide-left 
---

# Variable Storage
Add a value, still nothing in memory (but valid).

::left::
##
```c [main.c] {*}{lines:true}
int main() {
    34;


    return 0;
}
```

::right::

<div class="flex justify-end">
    <MemoryTable 
        title="stack"
        :baseAddress="0x1000"
        :variables="[
            { type: 'gap', value: 10},
        ]"
        :showTopEllipsis="false"
        showValues
    />
</div>

<!--
We add a value, which serves no purpose, and store nothing in memory.
(this is valid in some compilers, and not others, you would never do it)
-->

---
layout: two-cols-header
transition: fade
layoutClass: col-wide-left 
---

# Variable Storage
Assign a variable

::left::
##
```c [main.c] {*}{lines:true}
int main() {
    char a = 97; // 'a' character is ASCII
    // char a = 'a'
    
    return 0;
}
```

<br />
The value is "pushed" to the lowest location in the stack

* `a`'s location in memory is represented by an **address**
* an address is a 64 or 32-bit integer (system dependent)

::right::

<div class="flex justify-end">
    <MemoryTable 
        title="stack"
        :baseAddress="0x1000"
        :variables="[
            { type: 'gap', value: 9 },
            { type: 'char', name: 'a', value: 97 }
        ]"
        highlight="a"
        :showTopEllipsis="false"
        showValues
    />
</div>

<!--
Now we add a variable a, and set it to 97 (or the lowercase letter a in ASCII)
* This value is now stored in memory, and pushed to the stack.
* chars are a single byte, therefore only a single slot in memory is reserved
* this slot in memory has an address, which is usually a 64-bit number (on modern systems), however we use 32-bit here to fit.

-->

---
layout: two-cols-header
transition: fade
layoutClass: col-wide-left 
---

# Variable Storage
Assign a variable

::left::
##
```c [main.c] {*}{lines:true}
int main() {
    char a = 97; // 'a' character is ASCII
    int b = 25234;
    
    return 0;
}
```
<div v-click>

* The value is "pushed" to the lowest location on the stack

* `b`'s location in memory spans 4 addresses (4 bytes)
    * this contiguous span is called an **object**
    * the first address is always the lowest address
</div>

::right::

<div v-after class="flex justify-end">
    <MemoryTable 
    title="stack"
        :baseAddress="0x1000"
        :variables="[
            { type: 'gap', value: 5 },
            { type: 'int', name: 'b', value: 25234 },
            { type: 'char', name: 'a', value: 97 }
        ]"
        highlight="b"
        :showTopEllipsis="false"
        showValues
    />
</div>

<!--
Now we add another variable, a interger

## question before click
* How many bytes does a integer take? (it depends is the correct answer, but 4)

[draw] a circle around the lowest address.
-->

---
layout: two-cols-header
transition: fade
layoutClass: col-wide-left
---

# What is a Pointer?
**A pointer** is a special variable which **stores a memory address**

::left::

* Pointers *point* to another location in memory
* Functionally, a pointer is an integer (a memory address)
  * addresses are usually 64-bit
* Pointers are *special* due to syntax and unique behavior
    * *special* operators and arithmetic

<br />

```c [main.c] {4}{lines:true}
int main() {
    char a = 97; // 'a' character is ASCII
    int b = 25234;
    int* a_ptr = &a;
    
    return 0;
}
```

::right::

<img src="/images/pointer-to-int.png" alt="pointer to int meme" class="w-48 mx-auto mt-4" />

<!--
draw on screen: point to address, explain first address
-->

---
layout: two-cols-header
transition: fade
layoutClass: col-wide-left
---

# What is a Pointer?
**Pointers have a type**

::left::

* Every data type can have a pointer
* The type determines the size of the data pointed to and how to read it
* Pointers are always the first address (lowest) of an object (regardless of endianness)

<br />

```c [main.c] {4}{lines:true}
int main() {
    char a = 97; // 'a' character is ASCII
    int b = 25234;
    int* a_ptr = &a;
    
    return 0;
}
```

::right::

<div class="flex justify-end">
    <MemoryTable
        title="stack"
        :baseAddress="0x1000"
        :variables="[
            { type: 'gap', value: 1 },
            { type: 'int*', name: 'a_ptr', value: 0x00001009 },
            { type: 'int', name: 'b', value: 25234 },
            { type: 'char', name: 'a', value: 97 }
        ]"
        :showTopEllipsis="false"
        showValues
        highlight="a_ptr"
    />
</div>


---
layout: two-cols-header
transition: fade
---

# What is a Pointer?
##

::left::

<v-click>
    <div class="flex justify-end">
        <MemoryTable 
            title="stack frame B" 
            :baseAddress="0x000a"
            :variables="[
                { type: 'gap', value: 4 },
                { type: 'char*', name: 'pa', value: 0x00001009 },
                { type: 'gap', value: 2 },
            ]"
            highlight="pa"
            showValues
        />
    </div>
</v-click>

::right::

<div class="flex justify-end">
    <MemoryTable 
        title="stack frame A" 
        :baseAddress="0x1000"
        :variables="[
            { type: 'gap', value: 5},
            { type: 'int', name: 'b', value: 25234 },
            { type: 'char', name: 'a', value: 97 }
        ]"
        highlight="a"
        showValues
    />
</div>


<v-click>
    <Arrow x1="500" y1="350" x2="620" y2="210" color="#ff5555" width="2" />
</v-click>

<!--
Here in a arbitraty memory space (stack from a) - we have our character a. 


* question: what size is a pointer to a char? 


[click] somewhere else in memory, we have a pointer

[click] this pointer allows us to access and manpulate a outside of it's memory context.
-->

---
layout: two-cols-header
transition: fade
---

# What is a Pointer?
##

::left::


<div class="flex justify-end">
    <MemoryTable 
        title="stack frame B" 
        :baseAddress="0x000a"
        :variables="[
            { type: 'gap', value: 0 },
            { type: 'int*', name: 'pb', value: 0x00001005 },
            { type: 'char*', name: 'pa', value: 0x00001009 },
            { type: 'gap', value: 2 },
        ]"
        highlight="pb"
        showValues
    />
</div>

::right::

<div class="flex justify-end">
    <MemoryTable 
        title="stack frame A" 
        :baseAddress="0x1000"
        :variables="[
            { type: 'gap', value: 5},
            { type: 'int', name: 'b', value: 25234 },
            { type: 'char', name: 'a', value: 97 }
        ]"
        highlight="b"
        showValues
    />
</div>


<v-click>
    <Arrow x1="500" y1="465" x2="620" y2="330" color="#ff5555" width="2" />
</v-click>

<!--

Same thing here, we have a new pointer which points a int.

[click] allowing us to access b from somewhere else. 
-->

---
layout: two-cols-header
layoutClass: col-wide-left
---

# Why do we need pointers?

::left::

### Direct Memory Access
* Pointers are a tool to manipulate memory
* Required for writing low-level systems code, embedded drivers, etc.

<br >

<div v-click>

### Reference
* C functions *pass by value*
* Without pointers, all data is copied
* Reference allows modification across scope
</div>

<br >

<div v-click>

### Complex Data Types
* Arrays and Strings require pointers (more later)
* Linked lists, trees, etc. all possible with pointers
</div>

::right::

<div class="flex justify-end">
    <MemoryLayout />
</div>

<!--
but why do we need this, you may ask?

pointers are required to do complex logic with memory, and it's required in thing like low-level system development.
* This makes C great for those that know how to use it, but very complex for simple tasks

[click] One core example is pass-by-value
* anytime a something is passed in c (like a function) it is copied, pointers help make this manageable (we see more later)

[click] Complex data type require reference and iteration
* like arrays and string (well see later)
* and type which reference or chain together (or self-reference), we'll see in another lecture.


[ANY QUESTIONS?]
-->