# Module 3 — Decomposition with Methods, Recursion & Arrays

> Beginner-friendly notes covering modular programming, methods (definition, invocation, parameters, return values, overloading), the enhanced for-each loop, recursion, and arrays (1D and 2D/matrices) — with theory and practical Java examples.

---

## Table of Contents
1. [Modular Programming](#1-modular-programming)
2. [Methods in Java](#2-methods-in-java)
3. [Parameter Passing](#3-parameter-passing)
4. [Return Values](#4-return-values)
5. [Method Overloading](#5-method-overloading)
6. [Enhanced For-Each Loop](#6-enhanced-for-each-loop)
7. [Recursion](#7-recursion)
8. [1D Arrays](#8-1d-arrays)
9. [2D Arrays (Matrices)](#9-2d-arrays-matrices)
10. [Quick Recap / Cheat Sheet](#quick-recap--cheat-sheet)

---

## 1. Modular Programming

**Modular programming** is the practice of breaking a large program into smaller, independent, reusable pieces called **modules** (in Java, these are typically **methods** and **classes**).

### Why decompose a program?
- **Readability** — smaller pieces are easier to understand than one giant block of code.
- **Reusability** — write a piece of logic once, use it many times.
- **Maintainability** — fixing a bug in one module doesn't require touching unrelated code.
- **Testability** — each module can be tested independently.
- **Team collaboration** — different people can work on different modules simultaneously.

### Example — without decomposition (bad practice)
```java
public class Report {
    public static void main(String[] args) {
        int a = 10, b = 20, c = 30;
        int sum = a + b + c;
        double avg = sum / 3.0;
        System.out.println("Sum: " + sum);
        System.out.println("Average: " + avg);
        // ...imagine this logic repeated 5 more times for different numbers
    }
}
```

### Example — with decomposition (good practice)
```java
public class Report {
    // A reusable, self-contained module
    static void printStats(int a, int b, int c) {
        int sum = a + b + c;
        double avg = sum / 3.0;
        System.out.println("Sum: " + sum);
        System.out.println("Average: " + avg);
    }

    public static void main(String[] args) {
        printStats(10, 20, 30);   // reused as many times as needed
        printStats(5, 15, 25);
    }
}
```
This is the core idea behind **methods** — Java's building block for modular programming.

---

## 2. Methods in Java

A **method** is a named block of code that performs a specific task and can be **invoked (called)** whenever needed.

### 2.1 Method Definition (Syntax)
```java
accessModifier staticKeyword returnType methodName(parameterList) {
    // method body
    return value;   // only if returnType is not void
}
```

**Example:**
```java
public static int square(int number) {
    int result = number * number;
    return result;
}
```

**Breaking it down:**
| Part | In example | Meaning |
|---|---|---|
| Access modifier | `public` | Who can access this method |
| Static keyword | `static` | Belongs to the class, not an object instance |
| Return type | `int` | Type of value the method sends back |
| Method name | `square` | Identifier used to call the method |
| Parameter list | `(int number)` | Input(s) the method accepts |
| Method body | `{ ... }` | The actual logic |
| `return` | `return result;` | Sends the value back to the caller |

### 2.2 Method Invocation (Calling a method)
Once defined, a method must be **called/invoked** to actually run.

```java
public class MethodDemo {
    public static int square(int number) {
        return number * number;
    }

    public static void main(String[] args) {
        int result = square(5);        // invocation — method runs here
        System.out.println(result);     // 25

        System.out.println(square(9));  // can also be called directly inside another statement
    }
}
```

**What happens during invocation (call stack behavior):**
1. Program execution jumps from the calling line to the method's first line.
2. Arguments are copied into the method's parameters.
3. The method body executes.
4. On `return` (or end of a `void` method), control jumps back to right after the call.

### 2.3 Methods with no return value (`void`)
```java
public static void greet(String name) {
    System.out.println("Hello, " + name + "!");
    // no return statement needed
}

public static void main(String[] args) {
    greet("Priya");   // just performs an action, doesn't give back a value
}
```

---

## 3. Parameter Passing

**Parameters** are placeholders in the method definition; **arguments** are the actual values supplied when calling.

```java
static int add(int a, int b) {   // a, b = parameters
    return a + b;
}
...
add(5, 10);   // 5, 10 = arguments
```

### 3.1 How Java passes parameters: "Pass by Value"
Java is **always pass-by-value** — meaning a **copy** of the argument's value is passed into the method, not the original variable itself.

**For primitive types (int, double, char, etc.):**
```java
static void modify(int x) {
    x = x + 10;
    System.out.println("Inside method: " + x);
}

public static void main(String[] args) {
    int num = 5;
    modify(num);
    System.out.println("Outside method: " + num);
}
// Output:
// Inside method: 15
// Outside method: 5   <- original variable UNCHANGED
```
Since `x` is a **copy** of `num`, changes inside the method don't affect the original.

**For objects/arrays (reference types):**
The **reference (memory address)** is copied — so while you can't reassign the caller's variable, you **can modify the object/array's contents** through that reference.
```java
static void modifyArray(int[] arr) {
    arr[0] = 100;   // modifies the actual array content
}

public static void main(String[] args) {
    int[] numbers = {1, 2, 3};
    modifyArray(numbers);
    System.out.println(numbers[0]);   // 100 — the array WAS changed!
}
```
> **Key distinction:** You can change what an array/object *contains*, but you cannot make the caller's variable point to a completely different array/object.

### 3.2 Multiple parameters
```java
static double calculateBMI(double weightKg, double heightM) {
    return weightKg / (heightM * heightM);
}
...
double bmi = calculateBMI(70, 1.75);
```

---

## 4. Return Values

The `return` statement sends a value back to the caller and **immediately exits** the method.

### 4.1 Basic return
```java
static int max(int a, int b) {
    if (a > b) {
        return a;   // exits method here if true
    }
    return b;       // otherwise reaches here
}
```

### 4.2 Return type must match
```java
static int getAge() {
    return "twenty";   // COMPILE ERROR — String can't be returned as int
}
```

### 4.3 `void` methods can still use `return` (without a value) to exit early
```java
static void checkPositive(int num) {
    if (num < 0) {
        System.out.println("Negative number!");
        return;   // exits early, skips code below
    }
    System.out.println(num + " is non-negative");
}
```

### 4.4 Using return values
```java
static int cube(int n) {
    return n * n * n;
}

public static void main(String[] args) {
    int result = cube(3);              // store in a variable
    System.out.println(cube(4));        // use directly
    int total = cube(2) + cube(3);      // use in an expression
}
```

---

## 5. Method Overloading

**Method overloading** means defining **multiple methods with the same name** but **different parameter lists** (different number, type, or order of parameters) within the same class.

> This is one form of **compile-time (static) polymorphism** in Java.

### 5.1 Why overload?
It lets you use one intuitive method name for logically similar operations, instead of inventing names like `addInts`, `addDoubles`, `addThreeInts`.

### 5.2 Example — overloading `add()`
```java
public class Calculator {
    // Different number of parameters
    static int add(int a, int b) {
        return a + b;
    }

    static int add(int a, int b, int c) {
        return a + b + c;
    }

    // Different parameter types
    static double add(double a, double b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(add(2, 3));         // calls add(int, int)      -> 5
        System.out.println(add(2, 3, 4));       // calls add(int, int, int) -> 9
        System.out.println(add(2.5, 3.5));      // calls add(double, double) -> 6.0
    }
}
```

### 5.3 Rules for valid overloading
Methods can be overloaded by changing:
- **Number of parameters:** `add(int a, int b)` vs `add(int a, int b, int c)`
- **Type of parameters:** `add(int a, int b)` vs `add(double a, double b)`
- **Order of parameter types:** `display(String s, int n)` vs `display(int n, String s)`

**NOT valid** — overloading by return type alone (this causes a compile error, since Java can't tell them apart by return type):
```java
static int getValue() { return 5; }
static double getValue() { return 5.0; }   // ERROR: same signature except return type
```

### 5.4 How Java decides which overload to call
At **compile time**, Java matches the call to a method based on the **number and types of arguments** provided.
```java
System.out.println(add(5, 10));      // matches add(int, int)
System.out.println(add(5.0, 10.0));  // matches add(double, double)
```

---

## 6. Enhanced For-Each Loop

Java's **enhanced for loop** (a.k.a. "for-each") provides a simpler way to iterate over every element of an array or collection **without managing an index manually**.

### 6.1 Syntax
```java
for (dataType element : arrayOrCollection) {
    // use element
}
```

### 6.2 Example — comparing traditional `for` vs for-each
```java
int[] numbers = {10, 20, 30, 40};

// Traditional for loop
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

// Enhanced for-each loop (cleaner)
for (int num : numbers) {
    System.out.println(num);
}
```

### 6.3 When to use for-each vs traditional for

| Use for-each when... | Use traditional `for` when... |
|---|---|
| You just need to **read** each element in order | You need the **index** (e.g., `arr[i] = ...`) |
| You don't need to modify the array | You need to **modify** array elements |
| Code readability is a priority | You need to loop **backwards** or skip elements |

> **Important:** You **cannot** modify the original array using for-each — the loop variable is a **copy** of each element.
```java
int[] arr = {1, 2, 3};
for (int x : arr) {
    x = x * 10;   // only changes the copy 'x', NOT arr itself
}
System.out.println(arr[0]);  // still 1, unchanged
```

---

## 7. Recursion

**Recursion** is a technique where a method **calls itself** to solve a smaller instance of the same problem.

### 7.1 The two essential parts of every recursive method

1. **Base case** — the condition that stops the recursion (without this, it would call itself forever, causing a `StackOverflowError`).
2. **Recursive case** — the part where the method calls itself with a **smaller/simpler** version of the problem, moving it closer to the base case.

```java
static int factorial(int n) {
    if (n == 0) {          // BASE CASE — stops recursion
        return 1;
    }
    return n * factorial(n - 1);   // RECURSIVE CASE — calls itself with smaller n
}
```

### 7.2 Tracing recursion — `factorial(4)`
```
factorial(4)
  = 4 * factorial(3)
        = 3 * factorial(2)
              = 2 * factorial(1)
                    = 1 * factorial(0)
                          = 1                <- base case hit here
                    = 1 * 1 = 1
              = 2 * 1 = 2
        = 3 * 2 = 6
  = 4 * 6 = 24
```
Each call **waits** for the call below it to return before it can compute its own result — this "waiting" is managed using the **call stack**.

### 7.3 Example — Fibonacci sequence
```java
static int fibonacci(int n) {
    if (n == 0) return 0;       // base case 1
    if (n == 1) return 1;       // base case 2
    return fibonacci(n - 1) + fibonacci(n - 2);  // recursive case
}

public static void main(String[] args) {
    for (int i = 0; i < 8; i++) {
        System.out.print(fibonacci(i) + " ");
    }
}
// Output: 0 1 1 2 3 5 8 13
```

### 7.4 Example — sum of first N natural numbers
```java
static int sum(int n) {
    if (n == 0) {          // base case
        return 0;
    }
    return n + sum(n - 1); // recursive case
}
// sum(5) = 5 + sum(4) = 5 + 4 + sum(3) = ... = 15
```

### 7.5 Recursion vs Iteration

| Aspect | Recursion | Iteration (loops) |
|---|---|---|
| Approach | Method calls itself | Repeats a block using a loop |
| Memory | Uses call stack (more memory) | Uses less memory |
| Readability | Often cleaner for naturally recursive problems (trees, factorial) | Often more efficient for simple repetition |
| Risk | `StackOverflowError` if base case missing/wrong | Infinite loop if condition never false |

### 7.6 Common mistake — missing or unreachable base case
```java
static int badFactorial(int n) {
    return n * badFactorial(n - 1);   // NO base case — never stops!
}
// Calling badFactorial(5) causes StackOverflowError
```
**Always ensure:**
1. There IS a base case.
2. Every recursive call moves **towards** the base case (e.g., `n - 1`, not `n + 1`).

---

## 8. 1D Arrays

An **array** is a fixed-size, ordered collection of elements of the **same data type**, stored in contiguous memory and accessed via an **index** (starting at `0`).

### 8.1 Declaring and creating arrays
```java
int[] numbers;                     // declaration
numbers = new int[5];              // creation — array of 5 ints, default value 0

int[] scores = new int[3];         // declare + create in one line
int[] marks = {90, 85, 78, 92};    // declare + initialize with values directly
```

### 8.2 Accessing and modifying elements
```java
int[] marks = {90, 85, 78, 92};
System.out.println(marks[0]);   // 90 (first element, index 0)
System.out.println(marks[3]);   // 92 (last element, index length-1)

marks[1] = 100;                  // modify second element
System.out.println(marks.length); // 4 (array size — note: no parentheses, it's a field)
```
> **Beginner trap:** Valid indices range from `0` to `length - 1`. Accessing `marks[4]` on a 4-element array throws `ArrayIndexOutOfBoundsException`.

### 8.3 Traversal (visiting every element)
```java
int[] marks = {90, 85, 78, 92};

// Using traditional for loop
for (int i = 0; i < marks.length; i++) {
    System.out.println("Index " + i + ": " + marks[i]);
}

// Using enhanced for-each loop
for (int m : marks) {
    System.out.println(m);
}
```

### 8.4 Searching an element (Linear Search)
Checking each element one by one until found (or reaching the end).
```java
static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;   // found — return index
        }
    }
    return -1;   // not found
}

public static void main(String[] args) {
    int[] numbers = {5, 3, 8, 1, 9};
    int index = linearSearch(numbers, 8);
    System.out.println(index == -1 ? "Not found" : "Found at index " + index);
    // Output: Found at index 2
}
```

### 8.5 Summation of array elements
```java
static int sumArray(int[] arr) {
    int total = 0;
    for (int num : arr) {
        total += num;
    }
    return total;
}
// sumArray({1,2,3,4,5}) -> 15
```

### 8.6 Average of array elements
```java
static double average(int[] arr) {
    int total = sumArray(arr);
    return (double) total / arr.length;   // cast to avoid integer division
}
// average({90, 85, 78, 92}) -> 86.25
```

### 8.7 Counting techniques
Common pattern: loop through the array, and **increment a counter** when a condition is met.

**Example — count even numbers:**
```java
static int countEven(int[] arr) {
    int count = 0;
    for (int num : arr) {
        if (num % 2 == 0) {
            count++;
        }
    }
    return count;
}
// countEven({1,2,3,4,5,6}) -> 3
```

**Example — count occurrences of a specific value:**
```java
static int countOccurrences(int[] arr, int target) {
    int count = 0;
    for (int num : arr) {
        if (num == target) {
            count++;
        }
    }
    return count;
}
// countOccurrences({1,2,2,3,2,4}, 2) -> 3
```

**Example — find max/min using counting-style traversal:**
```java
static int findMax(int[] arr) {
    int max = arr[0];             // assume first element is max
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}
```

---

## 9. 2D Arrays (Matrices)

A **2D array** is essentially an "array of arrays" — used to represent tabular data like matrices, grids, or tables (rows and columns).

### 9.1 Declaring and creating 2D arrays
```java
int[][] matrix = new int[3][4];   // 3 rows, 4 columns, all initialized to 0

int[][] grid = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};   // 3x3 matrix with initial values
```

### 9.2 Accessing elements
Elements are accessed with **two indices**: `matrix[row][col]`.
```java
int[][] grid = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
System.out.println(grid[0][0]);   // 1 (row 0, col 0)
System.out.println(grid[1][2]);   // 6 (row 1, col 2)
grid[2][0] = 100;                 // modify row 2, col 0
```

### 9.3 Traversing a 2D array (nested loops)
```java
int[][] grid = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

for (int row = 0; row < grid.length; row++) {          // grid.length = number of rows
    for (int col = 0; col < grid[row].length; col++) {  // grid[row].length = columns in that row
        System.out.print(grid[row][col] + "\t");
    }
    System.out.println();  // move to next row
}
```
**Output:**
```
1    2    3
4    5    6
7    8    9
```

**Using enhanced for-each for 2D arrays:**
```java
for (int[] row : grid) {         // each 'row' is itself a 1D array
    for (int value : row) {
        System.out.print(value + "\t");
    }
    System.out.println();
}
```

### 9.4 Practical matrix operations

**Sum of all elements:**
```java
static int matrixSum(int[][] matrix) {
    int total = 0;
    for (int[] row : matrix) {
        for (int value : row) {
            total += value;
        }
    }
    return total;
}
```

**Matrix addition (two matrices of the same size):**
```java
static int[][] addMatrices(int[][] a, int[][] b) {
    int rows = a.length;
    int cols = a[0].length;
    int[][] result = new int[rows][cols];

    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            result[i][j] = a[i][j] + b[i][j];
        }
    }
    return result;
}
```

**Transpose of a matrix (rows become columns):**
```java
static int[][] transpose(int[][] matrix) {
    int rows = matrix.length;
    int cols = matrix[0].length;
    int[][] result = new int[cols][rows];   // dimensions flipped

    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    return result;
}
```

**Finding the diagonal sum (square matrix):**
```java
static int diagonalSum(int[][] matrix) {
    int sum = 0;
    for (int i = 0; i < matrix.length; i++) {
        sum += matrix[i][i];   // row index == column index -> main diagonal
    }
    return sum;
}
// {{1,2,3},{4,5,6},{7,8,9}} -> diagonal is 1,5,9 -> sum = 15
```

### 9.5 Full practical example — matrix printing and row-wise sum
```java
public class MatrixDemo {
    public static void main(String[] args) {
        int[][] matrix = {
            {2, 4, 6},
            {1, 3, 5},
            {7, 8, 9}
        };

        System.out.println("Matrix:");
        for (int[] row : matrix) {
            for (int val : row) {
                System.out.print(val + "\t");
            }
            System.out.println();
        }

        System.out.println("\nRow-wise sums:");
        for (int i = 0; i < matrix.length; i++) {
            int rowSum = 0;
            for (int j = 0; j < matrix[i].length; j++) {
                rowSum += matrix[i][j];
            }
            System.out.println("Row " + i + ": " + rowSum);
        }
    }
}
```
**Output:**
```
Matrix:
2    4    6
1    3    5
7    8    9

Row-wise sums:
Row 0: 12
Row 1: 9
Row 2: 24
```

---

## Quick Recap / Cheat Sheet

- **Modular programming** = breaking programs into small, reusable, testable pieces (methods)
- **Method** = access modifier + static? + return type + name + parameters + body
- **Invocation** = calling the method by name with arguments
- Java is always **pass-by-value**: primitives copy the value; arrays/objects copy the *reference* (so contents can change, but reassignment inside the method doesn't affect the caller's variable)
- **`return`** sends a value back and exits the method immediately; `void` methods can `return;` with no value to exit early
- **Method overloading** = same method name, different parameter list (number/type/order) — resolved at compile time; NOT valid by return type alone
- **Enhanced for-each**: `for (type var : array)` — simpler read-only traversal, can't modify original array elements
- **Recursion** needs a **base case** (stops it) and a **recursive case** (moves toward the base case); missing base case → `StackOverflowError`
- **1D array**: `type[] name = new type[size]` or `{...}` initializer; access via `arr[index]`, size via `arr.length`
- Common 1D array patterns: **traversal**, **linear search**, **summation**, **average**, **counting** (even numbers, occurrences, max/min)
- **2D array** = array of arrays, `matrix[row][col]`; traverse with **nested loops**; common ops: sum, addition, transpose, diagonal sum

---

*End of Module 3 Notes*