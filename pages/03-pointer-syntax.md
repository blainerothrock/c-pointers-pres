---
layout: section
---

# Pointer Syntax
## How to ... Pointer

<!--
You know have a understanding of what Pointer ARE, 
but the syntax is where things can get confusing. 

Here we will walk though examples of pointer syntax, but I don't expect everyhting to hit or be remembered yet. 
Keep an open mind about what is possible, we will practice the syntax plenty
-->

---
layout: two-cols-header
layoutClass: col-wide-left
---

# Declare a Pointer
The pointer declarator: `*`


::left::
```c{monaco-run}
#include<stdio.h>

int main() {
    int a = 65;
    int* a_ptr;

    printf("a_ptr = %p\n", a_ptr);
    printf("size of a_ptr is %d bytes\n", sizeof(a_ptr));

    return 0; // implicit in C99, omitted moving forward
}
```

::right::

A pointer is declared by placing `*` after the type:

* `int* a_ptr;` declares a pointer to an `int`
* Uninitialized pointers point to `NULL` (address `0x0`)
* Pointer size is always the same regardless of type (8 bytes on 64-bit)

<!--
Before we begin, note you can update code and run it here. You can also open in Compiler Explorer to run your code in a browser.

Here we declare a simple uninitialized pointer. Without assignment, it points to the NULL address (0), more on that later.
-->

---
layout: two-cols-header
layoutClass: col-wide-left
---

# Declare a Pointer
Style: `int*` vs `int *`

::left::
```c{monaco-run}
#include<stdio.h>

int main() {
    double* ptr;       // style A (recommended)
    double *other_ptr; // style B (equivalent)

    // gotchas
    int* a, b;     // a is a pointer, b is an int (!)
    int *c, *d;    // both c and d are pointers

    printf("ptr = %p\n", ptr);
    printf("size of ptr is %d bytes\n", sizeof(ptr));
}
```

::right::

Both `int* p` and `int *p` are valid — C doesn't care about the space.

<br>

Suggestions (see [C style guide](https://nu-cs211.github.io/cs211-files/cstyle.html)):
* Use declarator without a space: `int*`
* Never declare multiple variables on the same line

<!--
The asterisk binds to the variable name, not the type — so `int* a, b` only makes `a` a pointer.
This is a common gotcha. The style guide recommendation avoids this entirely.
-->


---
layout: two-cols-header
layoutClass: col-wide-left 
---

# Assign a Pointer
Address-of operator: `&`

::left::

```c {monaco-run}
#include<stdio.h>
#include <time.h>

int main() {
    int a = 65;
    int* a_ptr = &a;

    printf("a is located at %p in memory\n", a_ptr);

    time_t t;
    time(&t);  // populates `t` with the current time by passing a address (pointer)

    printf("the unix epoch time is %ld\n", t);
}
```

::right::

`&` returns the address of the first byte of the object storing the value

<!--
Here we demonostrate assigning a pointer.
It's the same as other vartiables, but we need a tool to GET THE ADDRESS of a vairable
This is the address-of operator (ampersand)


Pointers are displayed as Hexidecimals (base-16)
* this is a convience
* 16 is a power of 2 and cleanly maps bytes in 4 characters (also a power of 2)
* the `%p` string does this autimatically `%x` is also hex. 
-->


---
layout: two-cols-header
layoutClass: col-wide-left 
transition: fade
hide: true
---

# Dereference a Pointer
The indirection operator: `*`

::left::

```c{monaco-run}
#include<stdio.h>

int main() {
    int a = 65;
    int* a_ptr = &a;
    int c = *a_ptr;

    printf("a_ptr = %p, a = %d\n", a_ptr, *a_ptr); 
    printf("1. c == a?: %s\n", c==a ? "true" : "false"); // 1

    // 2 -- `c` is incremented, but not `a`
    c++;                
    printf("2. c == a?: %s\n", c==a ? "true" : "false");
    
    // 3 -- increment `a` using a dereferenced pointer
    (*a_ptr)++;         
    printf("3. c == a?: %s\n", c==a ? "true" : "false");
}
```

::right::

Returns the value at the address stored in the pointer.
* Not to be confused with the pointer declarator, or multiplication operator.

<br />

The pointer type allows correct dereferencing


<!--
[Predict] "If a_ptr holds the address of a, how do we get the value of a through the pointer?"

Now I said earlier that we can use a pointer to get at the value it points to .... this is what DEREFERENCING does.
It returns the VALUE of what is stored at the address

here we have an example of assigning a pointer `a_ptr`, then creating a new variable c with the value to which a_ptr points to.
-->

---
layout: two-cols-header
layoutClass: col-wide-left 
hide: true
---

# Dereference a Pointer
The dereference operator: `*`

::left::

```c{4-5}
#include<stdio.h>

int main() {
    int a = 65;
    int* a_ptr = &a;
    int c = *a_ptr;

    printf("pa = %p, a = %d\n", a_ptr, *a_ptr); 
    printf("c == a?: %s\n", c==a ? "true" : "false");

    c++;                // `c` is incremented, but not `a`
    printf("c == a?: %s\n", c==a ? "true" : "false");
    (*a_ptr)++;         // increment `a` using a pointer
    printf("c == a?: %s\n", c==a ? "true" : "false");
}
```

::right::

<div class="flex justify-end">
    <MemoryTable 
        title="[main] stack frame" 
        :baseAddress="0xFFFFA478"
        :variables="[
            { type: 'gap', value: 1 },
            { type: 'int*', name: 'a_ptr', value: 0xFFFFA47D },
            { type: 'int', name: 'a', value: 65 },
        ]"
        :showTopEllipsis="false"
        showValues
    />
</div>
    

---
layout: two-cols-header
layoutClass: col-wide-left 
---

# Dereference a Pointer
The indirection operator: `*`

::left::

```c {*}{lines:true} {monaco-run}
#include<stdio.h>

int main() {
    int a = 65;
    int* a_ptr = &a;

    printf("a = %d\n", a);
    *a_ptr = 101;
    printf("a = %d\n", a);
}
```

::right::

The dereference operator functions the same as the variable itself
* **Note**: dereferencing is *a little* slower, requiring multiple memory lookups

<!--
Anything you can do with the variable you can now do with the pointer

This is less important with small object like this, but more important when you have structure or arrays which are too big for the stack

Out next example demonstrates that
-->


---
layout: two-cols-header
layoutClass: col-wide-left 
---

# Dereference a Pointer
The member access for pointers operator: `->`

::left::

```c{monaco-run} { runnerOptions: { maxWidth: '480px', maxHeight: '300px' } }
#include<stdio.h>

typedef struct {
    char title[50];
    char author[50];
    float price;
} Book;

int main() {
    Book hyperion = { 
        .title="Hyperion", 
        .author="Dan Simmons", 
        .price=2.99
    };
    Book* hyperion_ptr = &hyperion;

    (*hyperion_ptr).price = 3.99;   // the full dereference and access
    hyperion_ptr->price = 4.99;   // shorthand

    printf("%s cost %f\n", hyperion_ptr->title, hyperion.price);
}
```

::right::

`->` is *syntactic sugar* for the member access operator (`.`)

<!--

For example here we see a struct for a Book.

The book is populated, a pointer is set, and then we update the price using a pointer. 
There is a shorthand to doing this with arrow operator.

This all may seem redundant, but when a struct is passed to a function, the arrow operator is required.
-->

---
layout: default
---

# Quick Reference: `*` and `&`

* **`&` (address-of):** given a variable, returns its memory address
  * `int* a_ptr = &a;` — get the address of `a`
* **`*` (dereference):** given a pointer, returns the value at that address
  * `int val = *a_ptr;` — get the value `a_ptr` points to


**They are inverses:**
* `*(&a) == a` — dereference the address of `a` gives back `a`
* `&(*a_ptr) == a_ptr` — address of the dereferenced pointer gives back the pointer


**The `*` symbol is overloaded:**
* In a **declaration**: `int* p` — declares `p` as a pointer to `int`
* In an **expression**: `*p` — dereferences `p` to get the value
* As an **operator**: `a * b` — multiplication

<!--
[Check] "What's the difference between * in a declaration vs * in an expression?"

This is a reference slide students can come back to. The key insight is that & and * are inverses.
-->

---
src: "03-2-pass-by-reference-example.md"
---


---
layout: two-cols-header
layoutClass: col-wide-left
---

# NULL Pointers

::left::


```c{monaco-run}
#include<stdio.h>

int main() {
    int* a;         // uninitialized
    int* b = NULL;  // Same as above
    printf("a: %p, b: %p\n", a, b);

    // *a = 100;       // Segmentation Fault!
}
```
<br />

### Danger!
* Tony Hoare calls NULL references his [*Billion Dollar Mistake*](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/)
* [DARPA is funding](https://www.darpa.mil/research/programs/translating-all-c-to-rust) automated translation of C code to *safer* languages.

::right::

Address `0x0` does not exist in memory

* The `NULL` reference, a pointer to nothing
* The compiler provides no protection to writing to non-existing memory (**memory safety**)

<img src="/images/point-to-void.png" alt="void pointer meme" class="w-48 mx-auto mt-4" />

<!--
[Check] "What happens if you dereference NULL?"

we talked earlier about the NULL pointer
it's represented by 0, which is not a memory address
this is DANGEROUS.
-->

---
layout: two-cols-header
layoutClass: col-wide-left 
---

# Pointers to Pointers

::left::

```c {monaco-run}
#include<stdio.h>

int main() {
    int a = 65;
    int* a_ptr = &a;
    
    // reads: a pointer to a pointer of type int
    int** a_ptr_ptr = &a_ptr; 

    printf("the value of `a` is %d\n", **a_ptr_ptr);
}
```

Pointers can point to pointers
* Pointers can point to pointers that point to pointers
    * and so on (to *at least* 12)

::right::

<img src="/images/pointer-to-pointer.png" alt="pointer to pointer meme" class="w-48 mx-auto mt-4" />

<!--
Pointers are not limited to just one point, they can point to a bunch.
in fact, at least 12 must be supported, but far more in modern compilers.
-->

---
layout: two-cols-header
layoutClass: col-wide-left 
---

# Generic Pointers
`void*`

::left::

```c{monaco-run}
#include<stdio.h>
#include <stdlib.h>

int main() {
    void* ptr = malloc(512);    // generic pointer

    float pi = 3.14;

    void* pi_ptr = &pi;         // valid
    // *pi_ptr = 3.14159;       // invalid! (compilation error)
    *(float*)pi_ptr = 3.14159;  // valid! (casting)

    printf("pi: %f\n", *(float*)pi_ptr);
}
```

::right::

Generic pointers (`void*`) are an address where the value is undefined. 
* Cannot be dereferenced without casting

<!--
I said that pointers have types ... well not all of them.

Generic pointers are pointer wihtout a type and a simple a pointer to a single memory address.

you CANNOT dereference theses with out a cast, but are useful when allocating memory blocks
-->
