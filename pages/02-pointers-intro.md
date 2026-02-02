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
* Size is dependent on the system
* **Everything stored has an explicit size**

::right::

```c
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

---
layout: two-cols-header
transition: fade
layoutClass: col-wide-left 
---

# Variable Storage
This is an empty program, nothing is stored in memory.

::left::
##
```c [main.c]
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

---
layout: two-cols-header
transition: fade
layoutClass: col-wide-left 
---

# Variable Storage
Add a value, still nothing in memory (but valid).

::left::
##
```c [main.c]
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

---
layout: two-cols-header
transition: fade
layoutClass: col-wide-left 
---

# Variable Storage
Assign a variable

::left::
##
```c [main.c]
int main() {
    char a = 97; // 'a' character is ASCII
    // char a = 'a'
    
    return 0;
}
```

* The value is "pushed" to the lowest location in the stack

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

---
layout: two-cols-header
transition: fade
layoutClass: col-wide-left 
---

# Variable Storage
Assign a variable

::left::
##
```c [main.c]
int main() {
    char a = 97; // 'a' character is ASCII
    int b = 25234
    
    return 0;
}
```

* The value is "pushed" to the lowest location on the stack

* `b`'s location in memory spans 4 addresses (4 bytes)
    * this contiguous span is called an **object**
    * the first address is always the lowest address

::right::

<div class="flex justify-end">
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
 
**Pointers can have a type**
* Every data type can have a pointer
* The type determines the size of the data pointed to and how to read it
* Pointers always store the lowest address to the object it points to

::right::

<div class="flex justify-end">
    <MemoryTable 
        title="stack" 
        :baseAddress="0x1000"
        :variables="[
            { type: 'gap', value: 1 },
            { type: 'int*', name: 'a_ptr', value: 0x00001005 },
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
                { type: 'char*', name: 'pa', value: 0x0000100 },
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

### Reference
* C functions *pass by value*
* Without pointers, all data is copied
* Reference allows modification across scope

<br >

### Complex Data Types
* Arrays and Strings require pointers (more later)
* Linked lists, trees, etc. all possible with pointers

::right::

<div class="flex justify-end">
    <MemoryLayout />
</div>
