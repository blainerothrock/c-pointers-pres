---
layout: section
---

# Pointer Arithmetic
Pointer manipulation, arrays, and strings

---
layout: two-cols-header
layoutClass: col-wide-left 
---

# Pointer Arithmetic: Basic

::left::

```c{monaco-run}
#include<stdio.h>
#include <stdlib.h>

int main() {
    double* heap_ptr = malloc(sizeof(double));
    printf("heap_ptr:      %p\n", heap_ptr);
    
    double* heap_ptr_next = heap_ptr + 1;
    printf("heap_ptr_next: %p\n\n", heap_ptr_next);
    
    int ptr_diff = heap_ptr_next - heap_ptr;
    printf("diff (elements): %d\n", ptr_diff);

    int byte_diff = (char*)heap_ptr_next - (char*)heap_ptr;
    printf("diff (bytes):    %d\n", byte_diff);

    void* v_ptr = malloc(16);
    // v_ptr++;         // compilation error (depending)
}
```

::right::

Pointer arithmetic is **scaled** by the size of the type
* incrementing adds `1x(sizeof([type]))`

This is key for **arrays** which index by pointers

---
layout: two-cols-header
layoutClass: col-wide-left 
---

# Pointer Arithmetic: Array Indexing
arrays *decay* to a pointer

::left::

```c{monaco-run}
#include<stdio.h>
#include <stdlib.h>

int main() {
    int arr[5] = { 5, 4, 3, 2, 1 };
    int* ptr = arr;

    printf("1. %d - %d\n", arr[0], ptr[0]);
    printf("2. %d - %d\n", *(arr + 1), *(ptr + 1));

    int arr_size = sizeof(arr);
    printf("size of arr: %d\n", arr_size);

    int ptr_size = sizeof(ptr);
    printf("size of ptr: %d\n", ptr_size);
}
```

::right::
Pointer arithmetic is at the core of the array implementation
* An array variable is basically a pointer

<!--
arrays are bascially pointers (but not exactly)

a pointer to array can be used the same as an array itself.

ARRAYS cannot be passed.

-->

---
layout: two-cols-header
layoutClass: col-wide-left 
---
# Pointer Arithmetic: Array Indexing
An array is a pointer when passed to a function

::left::

```c{monaco-run}
#include<stdio.h>

void square_arr(int arr[], int size) {
    printf("size of arr: %d  (inside function)\n", sizeof(arr));
    for (int i = 0; i < size; i++) {
        arr[i] = arr[i] * arr[i];
    }
}

int main() {
    int arr[5] = { 5, 4, 3, 2, 1 };
    printf("size of arr: %d (alongside declartion)\n", sizeof(arr));
    square_arr(arr, 5);

    for (int i = 0; i < sizeof(arr) / sizeof(int); i++) {
        printf("%d ", arr[i]);     
    }
}
```

::right::
Arrays are *always* passed as pointers, usually with the array size.
* There is no protection for accessing off the end or before the beginning of an array.
* An **Address Sanitizer** can help with this at compile time

<br>

Remember: `arr[i] == *(arr + i)`


---
layout: two-cols-header
layoutClass: col-wide-left 
---

# Pointer Arithmetic: ~~Array~~String Indexing
arrays *decay* to a pointer

::left::

```c{monaco-run}
#include<stdio.h>
#include <stdlib.h>

int main() {
    char str[] = "Now you know pointers!";
    char* ptr = str;

    printf("string: %s\n", str);
    printf("1. %c - %c\n", str[0], ptr[0]);
    printf("2. %c - %c\n", *(str + 1), *(ptr + 1));

    printf("size of str: %d\n", sizeof(str)); // + 1 string size
    printf("size of ptr: %d\n", sizeof(ptr));
}
```

::right::

Strings are null-terminated arrays of characters
* Null termination character: `\0`.

---
layout: two-cols-header
layoutClass: col-wide-left
---

# Pointer Arithmetic: String Traversal
implementing `strlen` with pointer arithmetic

::left::

```c{monaco-run}
#include<stdio.h>

int my_strlen(char* s) {
    char* p = s;
    while (*p)       // while not null terminator
        p++;
    return p - s;    // pointer subtraction = distance
}

int main() {
    char str[] = "Now you know pointers!";
    printf("length: %d\n", my_strlen(str));
}
```

::right::

Pointer subtraction gives the distance (in elements) between two pointers
* `p - s` counts how many `char`s were traversed

<br>

This is how `strlen` works under the hood
* Pointer increment (`p++`) walks through memory
* Null terminator (`\0`) signals the end