# Module 1 — From Problem to Program: Computational Thinking & Java Foundations

> Beginner-friendly notes covering problem solving, algorithms, the Java environment, program structure, the Java programming model, operators, typecasting, expression evaluation, and console I/O.

---

## Table of Contents
1. [Introduction to Problem Solving](#1-introduction-to-problem-solving)
2. [Problem Solving Using Algorithm & Flowchart](#2-problem-solving-using-algorithm--flowchart)
3. [The Java Environment](#3-the-java-environment)
4. [Structure of a Java Program](#4-structure-of-a-java-program)
5. [Java Programming Model](#5-java-programming-model)
6. [Operators in Java](#6-operators-in-java)
7. [Typecasting](#7-typecasting)
8. [Expression Evaluation — Precedence & Associativity](#8-expression-evaluation--precedence--associativity)
9. [Console I/O — Formatted Printing](#9-console-io--formatted-printing)
10. [Reading Typed Input with Scanner](#10-reading-typed-input-with-scanner)

---

## 1. Introduction to Problem Solving

Programming is fundamentally about **solving problems** using a computer. Before writing a single line of code, a programmer must understand and break down the problem.

### The general problem-solving process
1. **Understand the problem** — What are the inputs? What is the expected output?
2. **Plan a solution** — Think of the logical steps needed (this is the *algorithm*).
3. **Design** — Represent the plan visually (flowchart) or in structured English (pseudocode).
4. **Implement** — Translate the design into actual code (Java, in our case).
5. **Test & Debug** — Run the program with sample inputs and fix errors.
6. **Maintain** — Update the program as requirements change.

### Why this matters
A beginner's biggest mistake is jumping straight to code. Structured thinking first (steps 1–3) saves huge amounts of debugging time later.

**Example problem:** *Find the largest of three numbers.*
- Input: three numbers (a, b, c)
- Output: the largest number
- Logic: compare a with b, then compare the winner with c

---

## 2. Problem Solving Using Algorithm & Flowchart

### 2.1 Algorithm
An **algorithm** is a finite, ordered set of well-defined, unambiguous steps to solve a problem.

**Characteristics of a good algorithm:**
- **Finiteness** — must terminate after a finite number of steps
- **Definiteness** — each step must be precisely defined (no ambiguity)
- **Input** — takes zero or more inputs
- **Output** — produces at least one output
- **Effectiveness** — each step must be simple enough to be carried out

**Example — Algorithm to find the largest of three numbers:**
```
Step 1: Start
Step 2: Read three numbers a, b, c
Step 3: If a > b then
            if a > c then max = a
            else max = c
        Else
            if b > c then max = b
            else max = c
Step 4: Print max
Step 5: Stop
```

### 2.2 Flowchart
A **flowchart** is the graphical/pictorial representation of an algorithm using standard symbols.

| Symbol | Shape | Meaning |
|---|---|---|
| Oval | Start/End (Terminal) | Marks beginning or end of program |
| Parallelogram | Input/Output | Reading input or printing output |
| Rectangle | Process | Any calculation or assignment |
| Diamond | Decision | A condition (yes/no, true/false) |
| Arrow | Flow line | Shows direction of execution |
| Circle | Connector | Joins parts of flowchart on same/different page |

**Flowchart for "largest of three numbers" (described):**
```
   [Start]
      |
[Read a, b, c]
      |
  <a > b?> --No--> <b > c?> --No--> [max = c] --> [Print max] --> [End]
      |Yes                 |Yes
      |                     +--> [max = b] --> [Print max] --> [End]
      v
  <a > c?> --No--> [max = c] --> [Print max] --> [End]
      |Yes
      v
  [max = a] --> [Print max] --> [End]
```

### 2.3 Algorithm vs Flowchart vs Program

| Aspect | Algorithm | Flowchart | Program |
|---|---|---|---|
| Form | Step-by-step text | Graphical diagram | Actual code |
| Audience | Humans | Humans (visual thinkers) | Compiler/machine |
| Language dependency | Independent | Independent | Language-specific (e.g., Java) |

---

## 3. The Java Environment

### 3.1 JDK, JRE, and JVM
These three terms confuse most beginners — here's the clear breakdown:

- **JVM (Java Virtual Machine)** — The runtime environment that executes Java bytecode. A JVM implementation is platform-specific, while Java bytecode is designed to be portable.
- **JRE (Java Runtime Environment)** — A traditional term for the JVM plus the libraries and other components needed to run Java applications. Modern Java distributions generally do not provide a separate standalone JRE.
- **JDK (Java Development Kit)** — The software development kit used to develop and run Java programs. It includes tools such as `javac`, `java`, `javadoc`, and `jdb`, along with the runtime components.

For traditional terminology:
```
JDK = JRE + Development Tools
JRE = JVM + Runtime Libraries/Components
JVM = Runtime engine that executes bytecode
```

**Modern Java note:** Since Java 9+, the old separate JRE distribution model is no longer the normal way Java is packaged. For development, install a JDK; it is sufficient for running Java programs too.

### 3.2 Why Java is "Platform Independent" (WORA)
Java follows the principle **"Write Once, Run Anywhere"**:
1. You write source code in a `.java` file.
2. The `javac` compiler converts it into **bytecode** (`.class` file) — NOT machine code.
3. This bytecode is the same regardless of your OS.
4. The **JVM** installed on any machine (Windows/Linux/Mac) reads and executes this bytecode.

```
MyProgram.java --(javac)--> MyProgram.class (bytecode) --(JVM)--> Output
```

### 3.3 Compilation & Execution Flow
```
Source Code (.java)
        |
   javac compiler
        |
   Bytecode (.class)
        |
   JVM (interprets/JIT-compiles bytecode)
        |
   Machine Code -> Output
```

### 3.4 Setting up & running a Java program (command line)
```bash
# Compile
javac HelloWorld.java

# Run
java HelloWorld
```
Note: You compile with the `.java` extension, but you run **without** the extension (you're invoking the class, not the file).

---

## 4. Structure of a Java Program

Here is a minimal, complete Java program:

```java
// HelloWorld.java

public class HelloWorld {                 // Class declaration
    public static void main(String[] args) { // Main method — entry point
        System.out.println("Hello, World!"); // Statement
    }
}
```

### 4.1 Breaking it down

| Part | Meaning |
|---|---|
| `public class HelloWorld` | Declares a class named `HelloWorld`. **The filename must match the public class name** (`HelloWorld.java`). |
| `public static void main(String[] args)` | A standard entry point for a Java application launched by the `java` launcher. Execution begins by invoking the selected class's `main` method. |
| `public` | Accessible from anywhere (JVM needs access to call it) |
| `static` | Belongs to the class itself, so JVM can call it without creating an object |
| `void` | Returns nothing |
| `main` | The special method name JVM looks for |
| `String[] args` | Command-line arguments passed as an array of strings |
| `System.out.println(...)` | Prints text to the console, followed by a new line |

### 4.2 General structure (in order)
```java
package com.example;          // 1. Package declaration (optional, must be first line if present)

import java.util.Scanner;     // 2. Import statements (optional)

public class MyProgram {      // 3. Class declaration
    // 4. Fields / variables (optional)
    static int counter = 0;

    // 5. Methods
    public static void main(String[] args) {
        // 6. Program logic / statements
        System.out.println("Program starts here");
    }
}
```

### 4.3 Key rules
- Java is **case-sensitive** (`Main` ≠ `main`).
- Every statement ends with a **semicolon** `;`.
- Code blocks are enclosed in **curly braces** `{ }`.
- A `.java` file can have only **one public class**, and the file name must match it exactly.
- Comments:
  ```java
  // single-line comment
  /* multi-line
     comment */
  /** documentation comment (used by javadoc) */
  ```

---

## 5. Java Programming Model

### 5.1 Primitive Data Types
Java has **8 primitive types**. Primitive types represent simple values and are not objects.

| Type | Java-specified size/range | Default value for fields | Example |
|---|---|---|---|
| `byte` | 8-bit signed, -128 to 127 | `0` | `byte b = 100;` |
| `short` | 16-bit signed, -32,768 to 32,767 | `0` | `short s = 3000;` |
| `int` | 32-bit signed, -2³¹ to 2³¹-1 | `0` | `int i = 42;` |
| `long` | 64-bit signed, -2⁶³ to 2⁶³-1 | `0L` | `long l = 123456789L;` |
| `float` | 32-bit IEEE 754 floating point; ~6-7 significant decimal digits | `0.0f` | `float f = 3.14f;` |
| `double` | 64-bit IEEE 754 floating point; ~15-16 significant decimal digits | `0.0d` | `double d = 3.14159;` |
| `char` | 16-bit unsigned UTF-16 code unit, `\u0000` to `\uFFFF` | `\u0000` | `char c = 'A';` |
| `boolean` | Represents exactly `true` or `false`; Java does not specify a fixed storage size | `false` | `boolean flag = true;` |

> **Important:** The “default value” column applies to **fields** (instance/static variables). Local variables do **not** receive default values and must be definitely assigned before use.

> **Literal suffixes:** An integer literal is normally an `int`; use `L` for a `long` literal when needed. A decimal floating-point literal is normally a `double`; use `f`/`F` for a `float` literal.

### 5.2 Variables
A **variable** is a named memory location used to store a value that *can change* during program execution.

```java
int age = 21;         // declaration + initialization
double salary;        // declaration only
salary = 50000.0;      // assignment later
```

**Rules for declaring variables:**
- Must be declared with a type before use.
- Can be declared and initialized in one line, or separately.
- Java is statically typed — once declared as `int`, a variable can only hold values assignable to `int` without an explicit conversion.
- **Local variables:** unlike fields, local variables have no automatic default value; they must be initialized before they are read.

### 5.3 Constants
A **final variable** cannot be assigned a new value after it has been initialized. For example, `final` is commonly used for constants, although Java does not have a separate `constant` keyword.

```java
final double PI = 3.14159;
final int MAX_USERS = 100;
```
Convention: constants are usually written in `UPPER_CASE_WITH_UNDERSCORES`.

### 5.4 Identifiers
**Identifiers** are the names given to variables, methods, classes, etc.

**Rules:**
- Can contain letters, digits, underscore `_`, and dollar sign `$`.
- Cannot start with a digit.
- Cannot be a Java **keyword** (like `class`, `int`, `public`).
- Case-sensitive (`total` ≠ `Total`).

**Valid:** `age`, `_count`, `$price`, `totalMarks2`
**Invalid:** `2ndValue`, `class`, `my-name`

**Naming conventions (best practice, not enforced by compiler):**
- Variables/methods: `camelCase` → `studentName`
- Classes: `PascalCase` → `StudentRecord`
- Constants: `UPPER_CASE` → `MAX_LIMIT`

### 5.5 Literals
A **literal** is a fixed value written directly in source code to represent a value.

```java
int x = 10;          // 10 is an integer literal
double y = 5.5;       // 5.5 is a floating-point literal
char c = 'A';         // 'A' is a character literal
boolean flag = true;  // true is a boolean literal
String s = "Hello";   // "Hello" is a String literal
```

**Types of literals:**
- **Integer literals:** decimal (`10`), octal (`010`), hexadecimal (`0x1A`), binary (`0b1010`)
- **Floating-point literals:** `3.14`, `2.5e3` (scientific notation)
- **Character literals:** `'A'`, `'\n'` (newline escape), `'\t'` (tab)
- **String literals:** `"Hello World"`
- **Boolean literals:** `true`, `false`
- **null literal:** represents the absence of a reference value; it can be assigned to reference types, not primitive types.

---

## 6. Operators in Java

Operators are symbols that perform operations on variables/values (called **operands**).

### 6.1 Arithmetic Operators
| Operator | Meaning | Example (a=10, b=3) | Result |
|---|---|---|---|
| `+` | Addition | `a + b` | 13 |
| `-` | Subtraction | `a - b` | 7 |
| `*` | Multiplication | `a * b` | 30 |
| `/` | Division | `a / b` | 3 (integer division!) |
| `%` | Remainder | `a % b` | 1 |

> **Beginner trap:** `10 / 3` in Java gives `3`, not `3.33`, because both operands are `int`. Use `10.0 / 3` or cast to get a decimal result.

### 6.2 Relational (Comparison) Operators
Used to compare two values; result is always `boolean`.

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `==` | Equal to | `5 == 5` | true |
| `!=` | Not equal to | `5 != 3` | true |
| `>` | Greater than | `5 > 3` | true |
| `<` | Less than | `5 < 3` | false |
| `>=` | Greater than or equal | `5 >= 5` | true |
| `<=` | Less than or equal | `4 <= 3` | false |

### 6.3 Logical Operators
Used to combine multiple boolean expressions.

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `&&` | Logical AND (short-circuit) | `(5>3) && (2<4)` | true |
| `\|\|` | Logical OR (short-circuit) | `(5>3) \|\| (2>4)` | true |
| `!` | Logical NOT | `!(5>3)` | false |

> **Short-circuit behavior:** In `a && b`, if `a` is false, `b` is never evaluated. In `a || b`, if `a` is true, `b` is never evaluated. This is used to avoid errors, e.g. `if (arr != null && arr.length > 0)`.

### 6.4 Assignment Operators
| Operator | Example | Equivalent to |
|---|---|---|
| `=` | `a = 5` | Assign 5 to a |
| `+=` | `a += 3` | `a = a + 3` |
| `-=` | `a -= 3` | `a = a - 3` |
| `*=` | `a *= 3` | `a = a * 3` |
| `/=` | `a /= 3` | `a = a / 3` |
| `%=` | `a %= 3` | `a = a % 3` |

### 6.5 Ternary (Conditional) Operator
A shorthand for simple if-else, using `?` and `:`.

```java
int a = 10, b = 20;
int max = (a > b) ? a : b;   // if a > b, max = a, else max = b
System.out.println(max);      // 20
```
Syntax: `condition ? valueIfTrue : valueIfFalse`

### 6.6 Unary Operators
Operate on a **single** operand.

| Operator | Meaning | Example |
|---|---|---|
| `+` | Unary plus (rarely used) | `+5` |
| `-` | Unary minus (negation) | `-5` |
| `++` | Increment by 1 | `a++` or `++a` |
| `--` | Decrement by 1 | `a--` or `--a` |
| `!` | Logical NOT | `!flag` |

**Pre vs Post increment/decrement:**
```java
int a = 5;
System.out.println(a++);  // prints 5, THEN a becomes 6 (post-increment)
System.out.println(++a);  // a becomes 7 FIRST, then prints 7 (pre-increment)
```

### 6.7 Special Operators
- **`instanceof`** — tests whether an expression's value is compatible with a specified reference type:
  ```java
  String s = "hello";
  boolean result = s instanceof String;  // true
  ```
- **Dot operator `.`** — accesses members (fields/methods) of a class/object:
  ```java
  System.out.println();   // '.' accesses 'out' and 'println'
  ```
- **Array subscript `[]`** — accesses array elements:
  ```java
  int[] arr = {1, 2, 3};
  int x = arr[0];   // x = 1
  ```

### 6.8 Bitwise Operators
Operate on the bits of integral types (`byte`, `short`, `int`, `long`, and `char`).

| Operator | Meaning | Example (a=5=0101, b=3=0011) | Result |
|---|---|---|---|
| `&` | Bitwise AND | `a & b` | 0001 = 1 |
| `\|` | Bitwise OR | `a \| b` | 0111 = 7 |
| `^` | Bitwise XOR | `a ^ b` | 0110 = 6 |
| `~` | Bitwise complement (NOT) | `~a` | -6 |
| `<<` | Left shift | `a << 1` | 1010 = 10 |
| `>>` | Right shift (sign-preserving) | `a >> 1` | 0010 = 2 |
| `>>>` | Unsigned right shift | `a >>> 1` | 0010 = 2 |

> Bitwise operators are commonly used in low-level programming, flags, and performance-critical code.

---

## 7. Typecasting

**Typecasting** means converting a value from one data type to another.

### 7.1 Implicit Casting (Widening) — Automatic
A **widening primitive conversion** can happen automatically when Java converts one primitive numeric type to another compatible type. Widening generally avoids overflow, but it does **not always preserve exact precision** (for example, `long` to `float` can lose precision).
```java
int i = 100;
long l = i;       // int -> long, automatic
double d = l;     // long -> double, automatic; may lose integer precision
```
Common widening order for integral-to-floating conversions:
`byte → short → int → long → float → double`
and `char → int → long → float → double`.

**Precision caveat:** “wider” does not mean “every value is represented exactly.” For example, some `long` values cannot be represented exactly by `float`.

### 7.2 Explicit Casting (Narrowing) — Manual
A **narrowing primitive conversion** may lose range or precision and generally requires an explicit cast using `(type)` syntax.
```java
double d = 9.78;
int i = (int) d;    // i = 9 (decimal part truncated, NOT rounded)

int big = 300;
byte b = (byte) big; // b = 44; narrowing conversion has a defined result
```

### 7.3 Practical example
```java
public class CastingDemo {
    public static void main(String[] args) {
        int marks1 = 85, marks2 = 90, marks3 = 78;
        int total = marks1 + marks2 + marks3;

        // Without casting -> integer division -> wrong average
        double wrongAvg = total / 3;          // 84.0 (loses precision internally)

        // With casting -> correct average
        double correctAvg = (double) total / 3; // 84.333...

        System.out.println("Wrong Average: " + wrongAvg);
        System.out.println("Correct Average: " + correctAvg);
    }
}
```

---

## 8. Expression Evaluation — Precedence & Associativity

When an expression has multiple operators, Java needs rules to decide **which operator executes first**.

### 8.1 Precedence
Precedence determines how an expression is **grouped** when different operators occur together. Higher-precedence operators generally bind more tightly than lower-precedence operators.

**Simplified precedence table (high to low):**
| Level | Operators | Category |
|---|---|---|
| 1 (highest) | `()` `[]` `.` | Primary/grouping/access |
| 2 | `++` `--` `!` `~` `(type)` | Unary |
| 3 | `*`  `/`  `%` | Multiplicative |
| 4 | `+`  `-` | Additive |
| 5 | `<<`  `>>`  `>>>` | Shift |
| 6 | `<`  `<=`  `>`  `>=`  `instanceof` | Relational |
| 7 | `==`  `!=` | Equality |
| 8 | `&` | Bitwise AND |
| 9 | `^` | Bitwise XOR |
| 10 | `\|` | Bitwise OR |
| 11 | `&&` | Logical AND |
| 12 | `\|\|` | Logical OR |
| 13 | `?:` | Ternary |
| 14 (lowest) | `=`  `+=`  `-=` etc. | Assignment |

**Example:**
```java
int result = 10 + 5 * 2;   // * has higher precedence than +
System.out.println(result); // 20, not 30
```

### 8.2 Associativity
When operators at the same precedence level are combined, associativity determines how they are grouped.

- Most binary arithmetic operators such as `+`, `-`, `*`, `/` → **left-to-right**
- Assignment operators → **right-to-left**
- Unary operators should not be oversimplified as merely “right-to-left”; Java's grammar specifies how prefix/postfix expressions are formed.

> **Important:** Evaluation order and associativity are not exactly the same concept. Java also specifies left-to-right evaluation of operands in expressions.

**Example (left-to-right):**
```java
int result = 20 - 5 - 3;
// Evaluated as (20 - 5) - 3 = 12, NOT 20 - (5 - 3) = 18
```

**Example (right-to-left, assignment):**
```java
int a, b, c;
a = b = c = 10;
// Evaluated as a = (b = (c = 10))  -> all become 10
```

### 8.3 Using parentheses
When in doubt, **use parentheses** `()` to make your intent explicit and readable:
```java
int result = (10 + 5) * 2;   // now clearly 30
```

---

## 9. Console I/O — Formatted Printing

Java provides several ways to print output to the console.

### 9.1 Basic printing
```java
System.out.print("Hello");     // no newline after
System.out.println("World");   // adds newline after
System.out.println();          // just prints a blank line
```

### 9.2 Concatenation with `+`
```java
String name = "Alex";
int age = 20;
System.out.println("Name: " + name + ", Age: " + age);
// Output: Name: Alex, Age: 20
```

### 9.3 Formatted printing with `printf` / `String.format`
For controlled, professional-looking output, use `System.out.printf()`.

```java
double price = 49.5;
int qty = 3;
System.out.printf("Item price: %.2f, Quantity: %d%n", price, qty);
// Output: Item price: 49.50, Quantity: 3
```

**Common format specifiers:**
| Specifier | Meaning | Example |
|---|---|---|
| `%d` | Integer | `%d` → `42` |
| `%f` | Floating-point | `%.2f` → `3.14` (2 decimal places) |
| `%s` | String | `%s` → `"Hello"` |
| `%c` | Character | `%c` → `'A'` |
| `%b` | Boolean | `%b` → `true` |
| `%n` | Platform-independent newline | (prefer over `\n`) |
| `%x` | Hexadecimal | `%x` → `1a` |

**Width and alignment:**
```java
System.out.printf("%10s|%n", "Hi");    // right-aligned in 10 spaces:  "        Hi|"
System.out.printf("%-10s|%n", "Hi");   // left-aligned in 10 spaces:  "Hi        |"
System.out.printf("%05d%n", 42);       // zero-padded: 00042
```

### 9.4 `String.format()` — same syntax, but returns a String instead of printing
```java
String message = String.format("Total: %.2f", 199.999);
System.out.println(message);   // Total: 200.00
```

---

## 10. Reading Typed Input with Scanner

To read user input from the keyboard, Java provides the `Scanner` class in the `java.util` package.

### 10.1 Setting up Scanner
```java
import java.util.Scanner;   // Step 1: import at the top of the file

public class InputDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);   // Step 2: create Scanner object

        System.out.print("Enter your name: ");
        String name = sc.nextLine();           // reads a full line of text

        System.out.print("Enter your age: ");
        int age = sc.nextInt();                // reads an integer

        System.out.println("Hello " + name + ", you are " + age + " years old.");

        sc.close();  // close when no longer needed (also closes System.in)
    }
}
```

### 10.2 Common Scanner methods
| Method | Reads | Example input |
|---|---|---|
| `nextInt()` | `int` value | `25` |
| `nextLong()` | `long` value | `123456789` |
| `nextDouble()` | `double` value | `3.14` |
| `nextFloat()` | `float` value | `2.5` |
| `next()` | a single word (String, stops at whitespace) | `Hello` |
| `nextLine()` | an entire line (String, including spaces) | `Hello World` |
| `nextBoolean()` | `true` / `false` | `true` |

### 10.3 The classic `nextInt()` + `nextLine()` pitfall
A common beginner pitfall is mixing token-based methods such as `nextInt()` with line-based `nextLine()`. A token method reads the integer token but does not consume the line separator, so the following `nextLine()` can read the remainder of that line as an empty string:
```java
Scanner sc = new Scanner(System.in);
System.out.print("Enter age: ");
int age = sc.nextInt();        // reads number, but leaves "\n" in the buffer

System.out.print("Enter name: ");
String name = sc.nextLine();   // BUG: reads the leftover "\n" as an empty line!
```
**Fix:** Add an extra `sc.nextLine();` right after `nextInt()` to consume the leftover newline:
```java
int age = sc.nextInt();
sc.nextLine();          // consume leftover newline
String name = sc.nextLine();   // now works correctly
```

### 10.4 Full practical example
```java
import java.util.Scanner;

public class StudentReport {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter student name: ");
        String name = sc.nextLine();

        System.out.print("Enter marks in 3 subjects: ");
        int m1 = sc.nextInt();
        int m2 = sc.nextInt();
        int m3 = sc.nextInt();

        int total = m1 + m2 + m3;
        double average = total / 3.0;   // casting via 3.0 to avoid integer division

        System.out.printf("%n--- Report Card ---%n");
        System.out.printf("Name: %s%n", name);
        System.out.printf("Total: %d%n", total);
        System.out.printf("Average: %.2f%n", average);

        sc.close();
    }
}
```

**Sample run:**
```
Enter student name: Priya
Enter marks in 3 subjects: 85 90 78

--- Report Card ---
Name: Priya
Total: 253
Average: 84.33
```

---

## Accuracy Notes for Exams

- **Java version note:** These notes use concepts common to modern Java. Exact available language features depend on the JDK version being used in your course.
- **Default values:** Only fields (instance/static variables) get Java's default values. Local variables must be initialized before use.
- **`boolean`:** Java guarantees only the two values `true` and `false`; it does not define a fixed number of bits for storage.
- **`char`:** `char` is a 16-bit UTF-16 code unit. A `char` is not necessarily a complete Unicode code point for every Unicode character.
- **Floating point:** `float` and `double` are approximate representations. Decimal fractions such as `0.1` may not be represented exactly.
- **Integer division:** If both operands are integral, `/` performs integer division and truncates toward zero.
- **Overflow:** Integer overflow for `byte`, `short`, `int`, and `long` arithmetic is defined modulo 2^N for the relevant type in the usual two's-complement representation; it is not “unpredictable.”
- **Casting:** A cast can change the value through truncation, rounding behavior, overflow/narrowing, or loss of precision depending on the conversion.
- **`==`:** For primitives it compares values; for reference types it compares whether the references refer to the same object (or both are `null`).
- **`String`:** `String` is a reference type/class, not one of Java's eight primitive types.
- **`Scanner`:** `next()` reads the next token; `nextLine()` reads the remainder of the current line.
- **Resource closing:** Closing a `Scanner` constructed with `System.in` also closes the underlying standard input stream.

---

## Quick Recap / Cheat Sheet

- **Problem solving** → understand → plan (algorithm/flowchart) → code → test
- **Algorithm** = text steps; **Flowchart** = visual diagram of the same steps
- **JDK** (write) ⊃ **JRE** (run) ⊃ **JVM** (execute bytecode)
- Every Java app starts at `public static void main(String[] args)`
- 8 primitive types: `byte, short, int, long, float, double, char, boolean`
- `variable` = changeable, `final` = constant
- Operators: arithmetic, relational, logical, assignment, ternary, unary, special (`instanceof`, `.`, `[]`), bitwise
- Widening cast = automatic; narrowing cast = needs `(type)` and may lose data
- Precedence decides *which* operator first; associativity decides *direction* when precedence ties
- `System.out.printf()` / `String.format()` → controlled output using `%d %f %s %c %n` etc.
- `Scanner` reads typed input; watch out for the `nextInt()` → `nextLine()` buffer trap

---

*End of Module 1 Notes*
