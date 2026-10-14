# Module 2 — Control Flow: Selection & Iteration

> Beginner-friendly notes covering conditional statements, switch statements, and loops in Java — with theory, syntax, flowcharts (described), and practical examples.

---

## Table of Contents
1. [What is Control Flow?](#1-what-is-control-flow)
2. [Conditional Statements](#2-conditional-statements)
3. [The Switch Statement](#3-the-switch-statement)
4. [Loops (Iteration)](#4-loops-iteration)
5. [Loop Control: continue, infinite loops, nested loops](#5-loop-control-continue-infinite-loops-nested-loops)
6. [Quick Recap / Cheat Sheet](#quick-recap--cheat-sheet)

---

## 1. What is Control Flow?

By default, a Java program executes statements **sequentially** — top to bottom, one after another. **Control flow statements** let you change this default order based on conditions or repetition.

There are two broad categories covered in this module:
- **Selection statements** (decision-making): `if`, `if-else`, `switch` — choose *which* code runs.
- **Iteration statements** (looping): `while`, `do-while`, `for` — choose *how many times* code runs.

```
Sequential flow:      Selection flow:         Iteration flow:
  stmt 1                 condition?              condition?
  stmt 2                /    \                   /      \
  stmt 3              true  false             true      false
                        |      |                |          |
                     stmt A  stmt B          run body    exit loop
                                                  |
                                            back to condition
```

---

## 2. Conditional Statements

### 2.1 `if` statement
Executes a block of code **only if** a condition is `true`.

**Syntax:**
```java
if (condition) {
    // executed only if condition is true
}
```

**Example:**
```java
int age = 20;
if (age >= 18) {
    System.out.println("You are eligible to vote.");
}
```

**Flowchart (described):**
```
[Start] -> <condition?> --true--> [statement block] -> [End]
                |
              false
                |
             [End]
```

### 2.2 `if-else` statement
Executes one block if the condition is `true`, and a **different** block if it's `false`.

**Syntax:**
```java
if (condition) {
    // runs if true
} else {
    // runs if false
}
```

**Example:**
```java
int num = 7;
if (num % 2 == 0) {
    System.out.println(num + " is even");
} else {
    System.out.println(num + " is odd");
}
```

### 2.3 Nested `if`
An `if` (or `if-else`) statement placed **inside** another `if` (or `else`) block. Used when a decision depends on more than one condition, evaluated in stages.

**Syntax:**
```java
if (condition1) {
    if (condition2) {
        // runs only if BOTH condition1 and condition2 are true
    }
}
```

**Example — check if a number is positive and even:**
```java
int num = 8;
if (num > 0) {
    if (num % 2 == 0) {
        System.out.println(num + " is positive and even");
    } else {
        System.out.println(num + " is positive and odd");
    }
} else {
    System.out.println(num + " is not positive");
}
```

> **Tip:** Nested `if` is powerful but can get hard to read if overused. Beyond 2–3 levels, consider using `&&` (logical AND) to combine conditions instead.
```java
if (num > 0 && num % 2 == 0) {
    System.out.println("Positive and even");
}
```

### 2.4 `if-else-if` ladder
Used when you have **multiple conditions to check in sequence**, and want to execute only the block for the first condition that is `true`.

**Syntax:**
```java
if (condition1) {
    // block 1
} else if (condition2) {
    // block 2
} else if (condition3) {
    // block 3
} else {
    // default block (none of the above matched)
}
```

**Example — grading system:**
```java
int marks = 76;

if (marks >= 90) {
    System.out.println("Grade: A");
} else if (marks >= 75) {
    System.out.println("Grade: B");
} else if (marks >= 60) {
    System.out.println("Grade: C");
} else if (marks >= 40) {
    System.out.println("Grade: D");
} else {
    System.out.println("Grade: F");
}
// Output: Grade: B
```

**How it works:** Java checks each condition **top to bottom**. As soon as one is `true`, that block runs and the **rest are skipped entirely** — even if they would also be true.

### 2.5 Common beginner mistakes
```java
// Mistake 1: using = instead of == (assignment vs comparison)
if (age = 18) { ... }   // COMPILE ERROR in Java (good — Java protects you here)
if (age == 18) { ... }  // correct

// Mistake 2: unnecessary else after unrelated if
if (x > 0) {
    System.out.println("positive");
}
if (x == 0) {              // should be "else if" if mutually exclusive with above
    System.out.println("zero");
}

// Mistake 3: missing braces on multi-statement blocks
if (x > 0)
    System.out.println("A");
    System.out.println("B");  // this ALWAYS runs, NOT part of the if!
// Always use { } even for single statements, to avoid this trap.
```

---

## 3. The Switch Statement

`switch` is an alternative to a long `if-else-if` ladder, useful when you're comparing **one variable against many exact values**.

### 3.1 Basic syntax
```java
switch (expression) {
    case value1:
        // code
        break;
    case value2:
        // code
        break;
    default:
        // code if no case matches
}
```

**Example — day of week:**
```java
int day = 3;
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    default:
        System.out.println("Invalid day");
}
// Output: Wednesday
```

### 3.2 The role of `break`
`break` exits the `switch` block immediately. **Without `break`, execution "falls through"** into the next case(s), running their code too — even if the values don't match!

**Example WITHOUT break (fall-through):**
```java
int day = 2;
switch (day) {
    case 1:
        System.out.println("Monday");
    case 2:
        System.out.println("Tuesday");
    case 3:
        System.out.println("Wednesday");
    default:
        System.out.println("Invalid day");
}
// Output:
// Tuesday
// Wednesday
// Invalid day
// (all three print because there's no break to stop it!)
```

> **This "fall-through" behavior is sometimes used intentionally** — e.g., grouping multiple cases that should do the same thing:
```java
int month = 4;
switch (month) {
    case 12: case 1: case 2:
        System.out.println("Winter");
        break;
    case 3: case 4: case 5:
        System.out.println("Spring");
        break;
    default:
        System.out.println("Other season");
}
// Output: Spring
```

### 3.3 The `default` case
- Acts like the `else` in an `if-else` chain — runs when **no case matches**.
- `default` doesn't have to be last (though that's the convention); wherever placed, it only runs if nothing else matched.
- `default` is optional, but good practice to always include it.

### 3.4 What types can `switch` work with?
`switch` works with: `byte`, `short`, `int`, `char`, `String` (Java 7+), `enum`, and their wrapper classes (`Byte`, `Short`, `Integer`, `Character`).

**Example with `String`:**
```java
String fruit = "apple";
switch (fruit) {
    case "apple":
        System.out.println("Cost: $1");
        break;
    case "banana":
        System.out.println("Cost: $0.5");
        break;
    default:
        System.out.println("Unknown fruit");
}
```

### 3.5 Compound statements
A **compound statement** (also called a *block*) is simply a group of statements enclosed in `{ }`, treated as a single unit. You've already been using them:
```java
if (condition) {
    statement1;   // compound statement:
    statement2;   // multiple statements grouped as one block
    statement3;
}
```
Both `switch` blocks and `if`/loop bodies are examples of compound statements — Java treats everything between `{` and `}` as one logical group that executes together.

### 3.6 `if-else-if` vs `switch` — when to use which

| Use `if-else-if` when... | Use `switch` when... |
|---|---|
| Conditions involve ranges (`marks >= 90`) | Comparing one variable to exact discrete values |
| Conditions involve multiple variables | Comparing a single variable/expression |
| Conditions use `&&`, `\|\|`, complex logic | Simple equality checks (`==`) |

---

## 4. Loops (Iteration)

Loops let you **repeat a block of code** multiple times without rewriting it. Java has three main loop types.

### 4.1 `while` loop
Checks the condition **before** each iteration (entry-controlled). If the condition is false initially, the body **never executes**.

**Syntax:**
```java
while (condition) {
    // body — repeats as long as condition is true
}
```

**Example — print 1 to 5:**
```java
int i = 1;
while (i <= 5) {
    System.out.println(i);
    i++;   // IMPORTANT: update the variable, or the loop never ends
}
```

### 4.2 `do-while` loop
Checks the condition **after** each iteration (exit-controlled). The body **always executes at least once**, even if the condition is false from the start.

**Syntax:**
```java
do {
    // body — runs first, condition checked after
} while (condition);
```
> Note the semicolon `;` at the end — a common syntax mistake beginners make is forgetting it.

**Example — simple menu that must show at least once:**
```java
int choice;
Scanner sc = new Scanner(System.in);
do {
    System.out.println("1. Start\n2. Exit");
    System.out.print("Enter choice: ");
    choice = sc.nextInt();
} while (choice != 2);
```

**`while` vs `do-while` — key difference:**
```java
int x = 10;
while (x < 5) {
    System.out.println("while: " + x);   // never prints — condition false from start
}

int y = 10;
do {
    System.out.println("do-while: " + y); // prints once! body runs before check
} while (y < 5);
```

### 4.3 `for` loop
Best used when you know **in advance** how many times you want to loop. It combines initialization, condition, and update into a single line.

**Syntax:**
```java
for (initialization; condition; update) {
    // body
}
```

**Example — print 1 to 5:**
```java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```

**How it executes (step by step):**
```
1. initialization (int i = 1)     -> runs ONCE, at the very start
2. condition check (i <= 5)       -> if false, loop ends immediately
3. body executes                  -> println(i)
4. update (i++)                   -> runs after each iteration
5. repeat from step 2
```

**Example — sum of first N natural numbers:**
```java
int n = 10, sum = 0;
for (int i = 1; i <= n; i++) {
    sum += i;
}
System.out.println("Sum: " + sum);   // Sum: 55
```

**Variations of `for`:**
```java
// Multiple variables
for (int i = 0, j = 10; i < j; i++, j--) {
    System.out.println(i + " " + j);
}

// Counting down
for (int i = 10; i >= 1; i--) {
    System.out.println(i);
}

// Enhanced for-loop (for-each) — used for arrays/collections
int[] numbers = {10, 20, 30};
for (int num : numbers) {
    System.out.println(num);
}
```

### 4.4 Choosing the right loop

| Loop | Use when... |
|---|---|
| `for` | You know the exact number of iterations in advance |
| `while` | You loop based on a condition, and might not loop at all |
| `do-while` | You need the body to run **at least once** (e.g., menus, input validation) |

---

## 5. Loop Control: continue, infinite loops, nested loops

### 5.1 `break` in loops
(Already seen in `switch`.) In loops, `break` immediately **exits the loop entirely**, skipping any remaining iterations.

```java
for (int i = 1; i <= 10; i++) {
    if (i == 5) {
        break;   // loop stops completely when i == 5
    }
    System.out.println(i);
}
// Output: 1 2 3 4  (stops before printing 5)
```

### 5.2 `continue`
Skips the **rest of the current iteration** and jumps to the next one — the loop does NOT stop, it just skips ahead.

```java
for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue;   // skip printing 3, but continue looping
    }
    System.out.println(i);
}
// Output: 1 2 4 5   (3 is skipped, loop continues)
```

**`break` vs `continue` — visual difference:**
```
break:     1  2  3  [STOP]              -> exits the loop entirely
continue:  1  2  [skip 3]  4  5         -> skips just that iteration
```

**Practical example — print only even numbers from 1–10:**
```java
for (int i = 1; i <= 10; i++) {
    if (i % 2 != 0) {
        continue;   // skip odd numbers
    }
    System.out.println(i);
}
```

### 5.3 Infinite loops
A loop that **never terminates** because its condition is always `true` (or never becomes false). Sometimes intentional (e.g., servers, event listeners with an internal `break`), but often a bug.

**Examples of infinite loops:**
```java
// Intentional infinite loop (common pattern, exited via break)
while (true) {
    System.out.println("Running...");
    // some condition to break out
    if (someCondition) {
        break;
    }
}

// for-loop version
for (;;) {
    // runs forever unless broken out of
}

// ACCIDENTAL infinite loop (bug!) — forgot to update i
int i = 1;
while (i <= 5) {
    System.out.println(i);
    // i++ missing here -> i stays 1 forever -> infinite loop!
}
```

> **Beginner tip:** If your program seems "frozen" or keeps printing forever, check whether your loop's update statement (`i++`, etc.) is missing or the condition never becomes false.

### 5.4 Nested loops
A loop **inside** another loop. The **inner loop completes all its iterations for each single iteration** of the outer loop.

**Syntax:**
```java
for (outer initialization; outer condition; outer update) {
    for (inner initialization; inner condition; inner update) {
        // inner body
    }
}
```

**Example — multiplication table (1 to 3):**
```java
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        System.out.print(i * j + "\t");
    }
    System.out.println();  // move to next line after each row
}
```
**Output:**
```
1    2    3
2    4    6
3    6    9
```

**Example — pattern printing (very common beginner exercise):**
```java
// Print a right-angled triangle of stars
int rows = 5;
for (int i = 1; i <= rows; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("*");
    }
    System.out.println();
}
```
**Output:**
```
*
**
***
****
*****
```

**How nested loops execute (trace for i,j both 1 to 2):**
```
i = 1:
    j = 1 -> inner body runs
    j = 2 -> inner body runs
i = 2:
    j = 1 -> inner body runs
    j = 2 -> inner body runs
Total inner executions = 2 (outer) x 2 (inner) = 4
```

### 5.5 `break`/`continue` in nested loops
By default, `break` and `continue` only affect the **innermost** loop they're written in.

```java
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (j == 2) {
            break;   // breaks ONLY the inner loop, outer loop continues
        }
        System.out.println("i=" + i + " j=" + j);
    }
}
// Output: i=1 j=1 / i=2 j=1 / i=3 j=1
```

**Using labeled break to exit an outer loop (advanced but useful):**
```java
outer:
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (i == 2 && j == 2) {
            break outer;   // exits BOTH loops
        }
        System.out.println("i=" + i + " j=" + j);
    }
}
```

---

## Quick Recap / Cheat Sheet

- **Control flow** = selection (decisions) + iteration (repetition)
- `if` → runs block if true; `if-else` → picks one of two blocks
- **Nested if** → conditions inside conditions; **if-else-if ladder** → sequential mutually-exclusive checks, stops at first match
- Always use `{ }` even for single-statement blocks to avoid bugs
- `switch` → compares one value to many exact cases; **`break` prevents fall-through**; `default` is the fallback
- Compound statement = any group of statements in `{ }`
- `while` → checks condition **before** running (may run 0 times)
- `do-while` → checks condition **after** running (**always runs ≥ 1 time**)
- `for` → best when iteration count is known; combines init/condition/update in one line
- `continue` → skips current iteration only; `break` → exits the loop entirely
- **Infinite loop** → condition never becomes false (intentional with internal `break`, or a bug if the update is missing)
- **Nested loops** → inner loop fully completes for every outer iteration; `break`/`continue` affect only the innermost loop unless labeled

---

*End of Module 2 Notes*