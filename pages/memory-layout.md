---
layout: section
---

# Program Memory
## (Review)

---
layout: two-cols-header
---

# Program Memory
##

::left::

**Programs are loaded into memory before execution**

* code and static variables are loaded (static memory)
* space is allocated for runtime (dynamic memory)

<!-- When we say *memory* we are referring to random access memory (RAM)

* Programs also have access to registers (fast) and disk (slow) -->

**Memory is organized as a contiguous array of addresses**

* Each address represents 1-byte (8-bits) of space

::right::
<div class="flex justify-end">
    <MemoryLayout />
</div>


---
layout: two-cols-header
transition: fade
---

# Program Memory
##

::left::

All programs operate with this layout, but C gives you direct access.
* **OS**: Each program is given virtual memory space
  - Isolated, cannot access other processes
  - Memory addresses are scrambled (security)
* **Bare metal**: Work with the entire memory space

::right::

<div class="flex justify-end">
    <MemoryLayout />
</div>

---
layout: two-cols-header
transition: fade
---

# Static Memory

::left::

A program lives on disk until it is needed (e.g., `my_program.exe`)

When executed, Static Memory is populated before any instructions run
* Fixed in size
* Predictable

::right::

<div class="flex justify-end">
    <MemoryLayout highlight="static" />
</div>

---
layout: two-cols-header
transition: fade
hide: true
---

# Static Memory: Text

::left::

Where the program's instructions are stored
* Read-only memory (enforced by modern OSes)
* *Usually* not accessed by the program

::code-group
```c [c]
int add(int *a, int *b)
{
    int c = *a + *b;
    return c;
}
```

```asm [asm]
addi    sp,sp,-16 ; <-- 0xff010113
sw      ra,12(sp) ; <-- 0x00112623
sw      s0,8(sp)  ; <-- 0x00812423
addi    s0,sp,16  ; <-- 0x01010413
lw      a0,0(a0)  ; <-- 0x00052503
lw      a5,0(a1)  ; <-- 0x0005a783
add     a0,a0,a5  ; <-- 0x00f50533
lw      ra,12(sp) ; <-- 0x00c12083
lw      s0,8(sp)  ; <-- 0x00812403
addi    sp,sp,16  ; <-- 0x01010113
jr      ra
```
::

::right::

<div class="flex justify-end">
    <MemoryLayout highlight="text" />
</div>

---
layout: two-cols-header
transition: fade
hide: true
---

# Static Memory: Data

::left::

Stores **initialized** global variables.
* Data is stored on disk in the executable, then loaded
* Can be used and modified at runtime, but not persistent across processes

```c [main.c]
int x = 42;
const float weights[1000] = { 12.8532, 0.932781, ... };

int main() {
  const static int main_color = 0xffffff;
  static int state = 0;

  return 0;
}
// ...
```

::right::

<div class="flex justify-end">
    <MemoryLayout highlight="data" />
</div>

---
layout: two-cols-header
transition: fade
hide: true
---

# Static Memory: Block Started by Symbol (BSS)

::left::

Stores **uninitialized** global variable values.
* Loaded as zeros on program load
* Only sizes are stored in the executable, not values
* Can be used and modified at runtime, but not persistent across processes

```c [main.c]
// ...
int x;
my_struct q;

// 1Kb not included in executable
char queue_buf[1024];

int main() { return 0; }
// ...
```

::right::

<div class="flex justify-end">
    <MemoryLayout highlight="bss" />
</div>

---
layout: two-cols-header
transition: fade
---

# Dynamic Memory

::left::

During runtime, the program manages dynamic memory space. 
* C gives the programmer complete control (to utilize and mess up)

**The Heap** is manually managed to store data.
* Grows upwards from a minimum address
* Can be very large

**The Stack** automatically stores local variables.
* Grows downwards from a maximum address
* Capped at a fixed size (stack overflow)
* Much smaller (e.g., 1-8MB);


::right::

<div class="flex justify-end">
    <MemoryLayout highlight="dynamic" />
</div>


---
layout: two-cols-header
transition: fade
hide: true
---

# The Heap

::left::

Managed at runtime using `malloc()` and released using `free()`.

Grows upwards with the program's needs
  * **OS**: Virtually mapped (usually not capped)
  * **Bare metal**: heap grows up filling free memory in dynamic block

  Ideal for storing long-lived, persistent, data.

::right::

<div class="flex justify-end">
    <MemoryLayout highlight="heap" />
</div>

---
layout: two-cols-header
transition: fade
hide: true
---

# The Heap

::left::

```c [main.c]
int main() {
    int *p = malloc(100 * sizeof(int)); // space reserved
    
    // populate and do work with p
    
    free(p); // space released
}
```

::right::

<div class="flex justify-end">
    <MemoryLayout highlight="heap" />
</div>

---
layout: two-cols-header
transition: fade
hide: true
---

# The Stack

::left:: 

Stores function call information and local variables.

Handles program scope using *stack frames*
* Often overwritten as frames go out of scope (push and pop)

Grows downward with the program with a hard limit (e.g., stack overflow)

::right::

<div class="flex justify-end">
    <MemoryLayout highlight="stack" />
</div>

---
layout: two-cols-header
transition: fade
hide: true
---

# The Stack

::left::

```c [main.c]
int add(int *a, int *b);

int main() { // <-- entry point
    // <-- stack frame (1) initialized
    int x = 42;
    int y = 100;
    
    int z = add(&x, &y);
    
    return 0; // <-- stack frame (1) destroyed
} // <-- process terminated

int add(int *a, int *b) {
    // <-- stack frame (2) initialized
    
    // a and b accessed from stack frame (1)
    int c = *a + *b; 
    
    return c; // <-- stack frame (2) destroyed
}
```

::right::

<div class="flex justify-end">
    <MemoryLayout highlight="stack" />
</div>

---
layout: two-cols-header
transition: fade
---

# Pointers

::left::

**Pointers** are fundamental to memory management
* Without them, many abstractions would not be possible (e.g., arrays)

<br />

**Pointers are a notorious concept in C**

<br />

To tackle them we will:
1. Build a mental model
2. Introduce the Syntax
3. Practice, practice, practice

::right::

<div class="flex justify-end">
    <MemoryLayout />
</div>
