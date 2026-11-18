# DSA-1 – Module 2
## Recursion & Recursive Thinking
*Friend-style notes: intuition first, then the formula, then a small example.*

**Maps to CO2.** Module 1 gave you the measuring tape. This module gives you the *thinking tool* that divide & conquer, backtracking and dynamic programming are all built on.

## The big picture

Recursion is a function that solves a problem by calling **itself** on a smaller version of the same problem. That sounds circular and useless — until you see that "smaller" is what makes it work: the smaller version eventually becomes so small that the answer is obvious, and then all the answers combine on the way back out.

The analogy: two mirrors facing each other. Each reflection contains a smaller reflection of the same scene, until the images get too small to see. The "too small to see" moment is the **base case** — and without it, the mirrors go on forever, which in Java means a crash.

Why it matters right now:
- **Mergesort and quicksort** (Module 5) are recursion applied to sorting.
- **Subsets, permutations, N-Queens** are recursion + undoing choices (**backtracking**).
- **Fibonacci with memoisation** (this module's last section) is the doorway to **dynamic programming** in DSA-3.
- Trees and graphs (DSA-2) are *defined* recursively, so you cannot traverse them without this.

Where you will use it: any problem that says "all possible ...", "split in half", "the answer for `n` built from the answer for `n-1`", or any structure that contains smaller copies of itself (folders inside folders, a family tree, an expression inside brackets).

## Basics you must know first

- **Function** — a named block of code with parameters and a return value. A function may call *other* functions; recursion is just the case where it calls itself.
- **Stack** — the region of memory holding one **frame** per running function call: its parameters, its local variables, and where to return to. Frames are pushed on call and popped on return.
- **Method in Java** — Java's word for function; `static` methods need no object. **`return`** hands a value back to the caller and destroys that frame.

## 2.1 Why recursion early

### Intuition

You could learn sorting, subset generation and DP as three unrelated tricks. Or you could learn recursion once and see all three as the *same* move applied to different problems. Recursion early is that choice. The move is always: **"the answer for the big case is built out of the answer for smaller cases"**. Once you can see that sentence in a problem, the code almost writes itself.

### The idea, step by step

- **Step 1 — Divide & conquer is recursion on halves.** Mergesort: sort the left half, sort the right half, merge. Each "sort the half" is the *same problem*, smaller. That is Module 5, and it is nothing but recursion.
- **Step 2 — Backtracking is recursion with undo.** "Try including this element, recurse, then try excluding it." You will write exactly this in 2.7 for subsets. N-Queens, Sudoku and maze solving are the same shape.
- **Step 3 — Dynamic programming is recursion plus memory.** Naive Fibonacci recomputes the same values over and over (2.9). Store them once and the exponential algorithm becomes linear — that is DP in one sentence, and DSA-3 does it properly.
- **Step 4 — Structures are recursive.** A folder contains folders. A tree node contains subtrees. A sorted array's left part is a sorted array. Traversal code is naturally recursive, which is why Module 6 (linked lists) and DSA-2 (trees) assume this module.

```text
recursion  ->  divide & conquer   (split into halves)      ->  Module 5
recursion  ->  backtracking       (choose, undo)           ->  Module 2.7, DSA-3
recursion  ->  recursion + memory (memoisation / DP)       ->  Module 2.9, DSA-3
```

**Example question:** In one line each, say which recursive idea each of these depends on: (a) mergesort, (b) generating all subsets of a set, (c) Fibonacci with a memo table.

**Solution:**
- **Step 1 — (a) mergesort.** Divide & conquer: sort each half recursively, then merge two sorted halves in linear time. *(the same problem on half the data)*
- **Step 2 — (b) subsets.** Backtracking: for each element, recurse once having *included* it and once having *excluded* it, undoing the choice in between. *(two branches per element → `2^n` leaves)*
- **Step 3 — (c) memo Fibonacci.** Recursion + memory: the recursive definition stays, but each answer is stored so it is computed once. *(recomputation removed → exponential becomes linear)*
**Final answer:** **(a) divide & conquer, (b) backtracking, (c) memoisation (DP).** All three are the same move — a big problem answered from smaller copies of itself.

⚠️ **Common trap:** Thinking these are three separate subjects to memorise later. They are one idea; if you learn the shape here, Module 5 and DSA-3 become revisions instead of new material.

## 2.2 What recursion is

### Intuition

A recursive **method** is a method defined in terms of itself, like a dictionary entry that uses the word it defines — except ours must also contain the escape: "if the word is *chai*, it is a drink". That escape is the **base case**. Two parts, always:
- **Base case** — the smallest input, answered directly, no recursion. Without it, infinite calls.
- **Recursive case** — the same problem on a smaller input, plus a way to combine.

### The idea, step by step

- **Step 1 — The base case stops the chain.** `if (n == 0) return ...;` — reachable from every legal input, and it returns without calling itself. The recursive case must then **shrink** (`countdown(n - 1)`), or you get infinite recursion → `StackOverflowError`.
- **Step 2 — The three questions to ask before writing any recursive method.**
  1. **What is the smallest case I can answer without recursion?** → that is the base case.
  2. **How do I make the problem strictly smaller so it moves toward that case?** → that is the argument of the recursive call.
  3. **How do I combine the smaller answer into the full answer?** → that is the work around the call.
- **Step 3 — See all three in code.**

```java
public class Countdown {
    static void countdown(int n) {
        if (n == 0) {                      // Q1: smallest case -> base case
            System.out.println("Liftoff!");
            return;
        }
        System.out.println(n);             // Q3: the work for this level
        countdown(n - 1);                  // Q2: strictly smaller sub-problem
    }
    public static void main(String[] args) {
        countdown(3);
    }
}
```

**What it prints:** `3`, `2`, `1`, `Liftoff!` — one per line.

Call chain: `countdown(3)` → `countdown(2)` → `countdown(1)` → `countdown(0)`, which prints `Liftoff!` and returns; then each earlier call finishes and pops.

**Example question:** Here is a recursive method:

```java
static void printDown(int n) {
    if (n == 0) return;
    System.out.print(n + " ");
    printDown(n - 1);
}
```

Name the base case and the recursive case, give the output of `printDown(4)`, and say what single change makes it print `1 2 3 4` instead.

**Solution:**
- **Step 1 — Base case.** `if (n == 0) return;` — the smallest input (`0`) is answered without recursion. *(Q1: no further call needed)*
- **Step 2 — Recursive case.** `printDown(n - 1)` — the same problem with `n` reduced by 1, which moves toward `0`. *(Q2: strictly smaller)*
- **Step 3 — Trace `printDown(4)`.** Print `4`, call `printDown(3)` → print `3` … → print `1`, call `printDown(0)` → return. *(the print happens before the call, so values come out descending)*
- **Step 4 — Output.** `4 3 2 1 ` (all on one line). *(each level prints before recursing)*
- **Step 5 — The change.** Move the `System.out.print` **after** the recursive call: then the deepest call prints first, so values come out ascending. *(work before the call runs top-down; work after the call runs bottom-up)*
**Final answer:** base case `n == 0`, recursive case `printDown(n - 1)`; `printDown(4)` prints **`4 3 2 1`**; moving the print after the recursive call gives **`1 2 3 4`**.

⚠️ **Common trap:** A recursive case that does not shrink — `f(n) = f(n)` or `f(n) = f(n + 1)` — or a base case that can never be reached (`if (n == 0)` when `n` only ever grows). Both give `StackOverflowError`, not a wrong answer. Second trap: the *position* of the work (before vs after the call) decides the order of output — this is the single most common recursion exam question.

## 2.3 The call stack

### Intuition

When `factorial(4)` runs, it cannot finish until `factorial(3)` returns, and `factorial(3)` cannot finish until `factorial(2)` does. So each unfinished call must be *remembered* — its `n`, its half-done multiplication, and where to go back to. Java keeps them in a stack of **frames**, one per live call. Last in, first out. Analogy: a stack of plates. You can only take the top plate, so the last call put on is the first one finished. That is exactly why the base case returns first and answers flow back upward.

### The idea, step by step

- **Step 1 — What a frame holds.** The parameter `n`, any local variable, and the return address. For `factorial(4)` the pending work is "multiply my `n` by whatever comes back".

```java
public class FactorialTrace {
    static int factorial(int n) {
        System.out.println("enter factorial(" + n + ")");
        if (n == 1) {                                  // base case
            System.out.println("return 1 from factorial(1)");
            return 1;
        }
        int result = n * factorial(n - 1);             // frame waits here
        System.out.println("return " + result + " from factorial(" + n + ")");
        return result;
    }
    public static void main(String[] args) {
        System.out.println("answer = " + factorial(4));
    }
}
```

**What it prints:** `enter factorial(4)`, `enter factorial(3)`, `enter factorial(2)`, `enter factorial(1)`, `return 1 from factorial(1)`, `return 2 from factorial(2)`, `return 6 from factorial(3)`, `return 24 from factorial(4)`, `answer = 24` — one per line. Notice the order: entries descending, returns ascending.

- **Step 2 — The stack picture, growing then shrinking.** `[` and `]` are the stack, the rightmost frame is the top:

```text
call factorial(4)   [ f(4) ]
call factorial(3)   [ f(4) | f(3) ]
call factorial(2)   [ f(4) | f(3) | f(2) ]
call factorial(1)   [ f(4) | f(3) | f(2) | f(1) ]   <- base case, deepest point
f(1) returns 1      [ f(4) | f(3) | f(2) ]
f(2) returns 2      [ f(4) | f(3) ]
f(3) returns 6      [ f(4) ]
f(4) returns 24     [ ]                              <- empty again
```

Peak depth = 4 frames for `n = 4`, so the cost in stack space is `O(n)`.

- **Step 3 — Dry run as a table.**

| Step | Call entered | Stack (top last) | Value returned | What changed |
|---|---|---|---|---|
| 1 | `f(4)` | `[f(4)]` | — | frame pushed, waits on `f(3)` |
| 2 | `f(3)` | `[f(4), f(3)]` | — | frame pushed, waits on `f(2)` |
| 3 | `f(2)` | `[f(4), f(3), f(2)]` | — | frame pushed, waits on `f(1)` |
| 4 | `f(1)` | `[f(4), f(3), f(2), f(1)]` | 1 | base case hit, no further call |
| 5 | back in `f(2)` | `[f(4), f(3), f(2)]` | 2 × 1 = 2 | top frame popped, multiply done |
| 6 | back in `f(3)` | `[f(4), f(3)]` | 3 × 2 = 6 | top frame popped |
| 7 | back in `f(4)` | `[f(4)]` | 4 × 6 = 24 | top frame popped |
| 8 | `main` | `[ ]` | 24 | printed as `answer = 24` |

- **Step 4 — The cost in stack space.** Depth `d` recursion uses `O(d)` frames, each holding parameters and locals, so `factorial(n)` → `O(n)` space *even though it allocates no array*; time is `O(n)` too (`n` calls, constant work each). **When it goes too deep:** each JVM thread has a fixed stack size (set with `-Xss`; the default is typically a few hundred kilobytes to 1 MB, so the exact depth limit varies — check yours rather than trusting a number). At roughly tens of thousands of frames, Java throws `StackOverflowError`. Java does **not** promise to optimise tail calls into loops, so "it's recursive but tail-recursive" does not save you here.

**Example question:** How much stack space does `factorial(n)` use, and what happens for very large `n`? Suggest one fix that does not change the answer.

**Solution:**
- **Step 1 — Count the frames.** One frame per live call, and `factorial(n)` has `n` calls pending at its deepest point. *(the chain `f(n) → f(n-1) → ... → f(1)` never pops until the base case)*
- **Step 2 — Space.** `O(n)` frames → `O(n)` auxiliary space. *(a constant number of variables per frame, `n` frames)*
- **Step 3 — Time.** `O(n)` — `n` calls, one multiplication each. *(one call per value)*
- **Step 4 — At large `n`.** The stack runs out and Java throws `StackOverflowError` before the answer is printed. This is a *runtime error*, not a slow answer. *(frames exceed the thread's fixed stack size)*
- **Step 5 — The fix.** Use a loop: `long r = 1; for (int i = 2; i <= n; i++) r *= i;` → `O(n)` time, `O(1)` space, no frames. *(iteration keeps only one set of variables)*
**Final answer:** **`O(n)` stack frames (`O(n)` space), `O(n)` time; large `n` throws `StackOverflowError`; rewriting it as a loop gives `O(1)` space and the same answer.**

⚠️ **Common trap:** Saying "recursion is `O(1)` space because no array is created". Every pending frame is memory. Second trap: assuming Java turns tail recursion into a loop — it does not.

## 2.4 Designing a recursive solution

### Intuition

You do not design recursion by tracing what every call does — that way madness lies. You design it with three moves, and then you *trust* the recursion. The **recursive leap of faith**: assume the smaller call already returns the correct answer, and just ask "given that, how do I build mine?". It feels like cheating the first time; it is the correct way to think. Analogy: you are climbing a ladder in the dark. You do not need to see every rung. You need to know (a) the ground is rung 0, and (b) each rung is exactly one step above the one below.

### The idea, step by step

- **Step 1 — Find the smaller sub-problem.** Not "some smaller thing" — the *same* problem with less data. For an array of `n` elements, the natural smaller problem is the first `n - 1` elements.
- **Step 2 — Assume it works.** Write `int rest = max(a, n - 1);` and *believe* it is the maximum of the first `n - 1` elements. Do not trace it.
- **Step 3 — Combine.** Use the assumed answer plus the one new piece: `Math.max(a[n - 1], rest)`.
- **Step 4 — Check the base case.** `n == 1` → the single element is the maximum. Done, no recursion.
- **Step 5 — See the three moves in code.**

```java
public class RecursiveMax {
    // Returns the largest value among the first n elements of a (n >= 1)
    static int max(int[] a, int n) {
        if (n == 1) return a[0];                    // base case: one element
        int rest = max(a, n - 1);                   // leap of faith: max of first n-1
        return Math.max(a[n - 1], rest);            // combine with the last element
    }
    public static void main(String[] args) {
        int[] a = {3, 9, 4, 7};
        System.out.println(max(a, 4));              // 9
    }
}
```

**What it prints:** `9`.

Why it works, in one line: the maximum of `n` elements is either the maximum of the first `n - 1` or the `n`-th element — there is no third possibility.

Unwinding for `{3, 9, 4, 7}`: `max(a,1) = 3` → `max(a,2) = max(9,3) = 9` → `max(a,3) = max(4,9) = 9` → `max(a,4) = max(7,9) = 9`.

**Example question:** Write a recursive method that returns the sum of the first `n` elements of an array, using the three moves. State the base case, the sub-problem, the combine step, and the time and space complexity.

**Solution:**
- **Step 1 — Base case (Q1).** `n == 0` → sum of nothing is `0`. *(the smallest input, answered directly)*
- **Step 2 — Smaller sub-problem (Q2).** `sum(a, n - 1)` — the first `n - 1` elements. *(same problem, one fewer element)*
- **Step 3 — Combine (Q3).** `a[n - 1] + sum(a, n - 1)`. *(the total is the last element plus the total of the rest)*
- **Step 4 — Code.**

```java
static int sum(int[] a, int n) {
    if (n == 0) return 0;                    // base case
    return a[n - 1] + sum(a, n - 1);         // combine: last element + rest
}
```

- **Step 5 — Trace on `{3, 9, 4, 7}`, `n = 4`.** `7 + sum(3)` → `7 + (4 + sum(2))` → `7 + 4 + (9 + sum(1))` → `7 + 4 + 9 + (3 + sum(0))` = `7 + 4 + 9 + 3 + 0 = 23`. *(each level adds one element and defers the rest)*
- **Step 6 — Complexity.** `n + 1` calls, constant work each → `O(n)` time; `n + 1` frames → `O(n)` space. *(one call per element)*
- **Step 7 — Edge case.** `n = 0` returns `0` immediately, so an empty array is handled without a special case in the caller. *(the base case covers it)*
**Final answer:** base `n == 0` → `0`; sub-problem `sum(a, n-1)`; combine `a[n-1] + rest`; **`O(n)` time, `O(n)` stack space, and `{3,9,4,7}` gives 23.**

⚠️ **Common trap:** Trying to trace all the calls while *designing* — you lose track and start "fixing" code that is already right. Design with the leap of faith, then test with a trace. Second trap: choosing a sub-problem that is not the same problem (e.g. "sum of the even elements") — then the recursion no longer matches and the base case stops making sense.

## 2.5 Classic recursion

### Intuition

Four classic examples teach almost every pattern you need: **factorial** (linear chain), **Fibonacci** (branching chain), **power** (halving the exponent — the fast one), and **sum / printing** (the simplest chain). Learn the *shape* of each call tree and the complexity follows.

### The idea, step by step

- **Step 1 — Factorial: one call per level.**

```java
static long factorial(int n) {
    if (n <= 1) return 1;                 // base case: 0! = 1! = 1
    return n * factorial(n - 1);          // n! = n * (n-1)!
}
```

Call tree is a single chain of depth `n`: `O(n)` time, `O(n)` space. `factorial(4) = 24`.

- **Step 2 — Fibonacci: two calls per level (and that is the problem).**

```java
static int fib(int n) {
    if (n < 2) return n;                  // base cases: fib(0)=0, fib(1)=1
    return fib(n - 1) + fib(n - 2);       // two smaller calls
}
```

`T(n) = T(n-1) + T(n-2) + O(1)` → the call tree branches, so `O(2^n)` time (more precisely it grows like `1.618^n`). Space is only `O(n)` — the *depth*, not the number of calls, because frames are popped as they finish. `fib(6) = 8`.

- **Step 3 — Power: slow, then fast.** The slow version `power(b, e) = b * power(b, e - 1)` costs `e` multiplications (`O(n)` in the exponent; `2^10` takes 9). **Fast exponentiation** uses `b^e = (b^(e/2))^2`, with one extra `b` when `e` is odd:

```java
public class FastPower {
    static long power(long base, int exp) {
        if (exp == 0) return 1;                       // base case: b^0 = 1
        long half = power(base, exp / 2);             // half-size sub-problem
        if (exp % 2 == 0) return half * half;         // even: (b^(e/2))^2
        return half * half * base;                    // odd: one extra base
    }
    public static void main(String[] args) {
        System.out.println(power(2, 10));             // 1024
        System.out.println(power(3, 5));              // 243
    }
}
```

**What it prints:** `1024` then `243`.

The exponent halves each call, so the depth is `log2 e` → `O(log n)` time (in the exponent) and `O(log n)` stack.

| Step | Call | `half` received | Returns | What changed |
|---|---|---|---|---|
| 1 | `power(2,0)` | — | 1 | base case, deepest call |
| 2 | `power(2,1)` | 1 | 1 × 1 × 2 = 2 | exponent odd → extra base |
| 3 | `power(2,2)` | 2 | 2 × 2 = 4 | exponent even |
| 4 | `power(2,5)` | 4 | 4 × 4 × 2 = 32 | exponent odd → extra base |
| 5 | `power(2,10)` | 32 | 32 × 32 = 1024 | exponent even |

Multiplications used: 6, against 9 for the naive loop on `2^10`. At `e = 10^6` it is about 20 squarings versus a million multiplications.

- **Step 4 — Sum and printing: the plain chain.**

```java
static int sumTo(int n) {
    if (n == 0) return 0;                 // base case
    return n + sumTo(n - 1);              // combine
}
```

`sumTo(5) = 15`; `O(n)` time, `O(n)` space. `printDown` from 2.2 is the same chain with a `println` instead of an addition.

| Recursion | Recurrence | Time | Space | Value check |
|---|---|---|---|---|
| factorial | `T(n) = T(n-1) + O(1)` | `O(n)` | `O(n)` | `4! = 24` |
| Fibonacci (naive) | `T(n) = T(n-1) + T(n-2) + O(1)` | `O(2^n)` | `O(n)` depth | `fib(6) = 8` |
| power (naive) | `T(e) = T(e-1) + O(1)` | `O(e)` | `O(e)` | `2^10` = 9 multiplications |
| power (fast) | `T(e) = T(e/2) + O(1)` | `O(log e)` | `O(log e)` | `2^10` = 6 multiplications |
| sum / print | `T(n) = T(n-1) + O(1)` | `O(n)` | `O(n)` | `sumTo(5) = 15` |

**Example question:** For the naive recursive Fibonacci, how many calls does `fib(6)` make in total, and what does it return? Derive the call count rather than guessing.

**Solution:**
- **Step 1 — Define the count.** `C(n)` = number of calls made by `fib(n)`, counting the call itself. *(we need a recurrence for the count, not just the value)*
- **Step 2 — Write its recurrence.** `C(n) = C(n-1) + C(n-2) + 1`, with `C(0) = C(1) = 1`. *(the `+1` is the current call; the two terms are its children)*
- **Step 3 — Compute upwards.** `C(2) = 1 + 1 + 1 = 3`; `C(3) = 3 + 1 + 1 = 5`; `C(4) = 5 + 3 + 1 = 9`; `C(5) = 9 + 5 + 1 = 15`; `C(6) = 15 + 9 + 1 = 25`. *(each value needs the two previous ones)*
- **Step 4 — The value.** `fib(6) = fib(5) + fib(4) = 5 + 3 = 8`. *(standard Fibonacci sequence `0,1,1,2,3,5,8`)*
- **Step 5 — Sanity check.** `C(n) = 2·fib(n+1) - 1`; with `fib(7) = 13`, that gives `2 × 13 - 1 = 25`. *(a closed form that matches the table)*
**Final answer:** **`fib(6)` makes 25 calls and returns 8**; the count grows like `O(2^n)`, which is why naive Fibonacci is a trap.

⚠️ **Common trap:** Confusing *number of calls* with *space*. `fib(n)` makes an exponential number of calls but uses only `O(n)` stack, because frames are popped as each call returns. Second trap: forgetting `fib(0) = 0` — with a base case of only `n == 1` you recurse into negative numbers forever.

## 2.6 Recursion on structures

### Intuition

An array or string is recursive in disguise: "the first element, then an array of the rest". So recursion is a natural way to *traverse* — you handle one end and hand the remaining slice to the same method.

Two useful shapes: **shrink from both ends** (two indices moving inward — reverse, palindrome) and **shrink from one end** (sum, max, searching).

### The idea, step by step

- **Step 1 — Reverse an array by swapping the ends.** Swap `a[left]` with `a[right]`, then recurse on the inner part.

```java
public class ReverseArray {
    static void reverse(char[] a, int left, int right) {
        if (left >= right) return;                     // base: 0 or 1 element left
        char t = a[left]; a[left] = a[right]; a[right] = t;   // swap the ends
        reverse(a, left + 1, right - 1);               // shrink from both sides
    }
    public static void main(String[] args) {
        char[] a = "abcd".toCharArray();
        reverse(a, 0, a.length - 1);
        System.out.println(new String(a));             // dcba
    }
}
```

**What it prints:** `dcba`.

| Step | Call | `left`, `right` | Array state | What changed |
|---|---|---|---|---|
| 1 | `reverse(0,3)` | 0, 3 | `d b c a` | `a` and `d` swapped |
| 2 | `reverse(1,2)` | 1, 2 | `d c b a` | `b` and `c` swapped |
| 3 | `reverse(2,1)` | 2, 1 | `d c b a` | base case: `left >= right`, return |

Cost: `n/2` swaps, `n/2` frames → `O(n)` time, `O(n)` space. (Half the frames, but still `O(n)`.)

- **Step 2 — Palindrome: compare the ends, then recurse inside.**

```java
public class Palindrome {
    static boolean isPalindrome(String s, int left, int right) {
        if (left >= right) return true;                       // 0 or 1 char left: palindrome
        if (s.charAt(left) != s.charAt(right)) return false;  // mismatch: not a palindrome
        return isPalindrome(s, left + 1, right - 1);          // check the inside
    }
    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar", 0, 6));   // true
        System.out.println(isPalindrome("abca", 0, 3));      // false
    }
}
```

**What it prints:** `true` then `false`.

- **Step 3 — Why the index version matters.** `s.substring(1, s.length() - 1)` *copies* the string, so that version costs `O(n^2)` time and memory; passing `left` and `right` costs `O(n)` time and `O(n)` stack. Same idea, different constant — Module 1's lesson applied.

**Example question:** Trace the palindrome check on `"madam"` and on `"madama"`, giving the comparisons at each level, and state the complexity.

**Solution:**
- **Step 1 — `"madam"`, indices 0..4.** Compare `s[0]='m'` with `s[4]='m'` → equal, recurse on `(1,3)`. *(ends match, check the inside)*
- **Step 2 — `(1,3)`.** Compare `s[1]='a'` with `s[3]='a'` → equal, recurse on `(2,2)`. *(ends match again)*
- **Step 3 — `(2,2)`.** `left >= right` → return `true`. *(one character left is a palindrome)*
- **Step 4 — Result.** All comparisons matched, so `"madam"` is a palindrome. *(no mismatch ever occurred)*
- **Step 5 — `"madama"`, indices 0..5.** `s[0]='m'` vs `s[5]='a'` → mismatch → return `false` immediately, with no recursion at all. *(the first comparison already fails)*
- **Step 6 — Complexity.** At most `n/2` comparisons and `n/2` frames → `O(n)` time, `O(n)` space *(one comparison per level, halving the range)*.
**Final answer:** **`"madam"` → true after 3 levels (`m`/`m`, `a`/`a`, then one char left); `"madama"` → false at the very first comparison (`m` vs `a`); `O(n)` time and `O(n)` stack.**

⚠️ **Common trap:** Using `substring` or building a new array each call. It looks clean but turns `O(n)` into `O(n^2)`. Second trap: a base case of `left == right` only — it fails on even-length strings where the range shrinks to `left > right`. Use `left >= right`.

## 2.7 Generating possibilities (a first taste of backtracking)

### Intuition

Some problems have no single answer — they want *all* answers: all subsets, all permutations, all valid paths. Recursion handles this beautifully with **backtracking**: at each step you make one choice, recurse, then **undo** the choice and make the next one. Analogy: walking a maze. At each junction you take one corridor, walk it fully, then come back to the junction and take the next corridor. "Coming back" is the undo. Without it, you would only ever explore one branch. The key structural fact: the recursion tree *is* the answer space. Count its leaves and you have the complexity.

### The idea, step by step

- **Step 1 — Subsets: each element is either in or out.** For `{1,2,3}` there are `2^3 = 8` subsets. The recursion tree has two branches at every element:

```text
                    {}                       <- nothing decided yet
       include 1 /     \ exclude 1
              {1}        {}
       inc2 /  \ exc2   inc2 /  \ exc2
         {1,2}  {1}      {2}     {}
   inc3/ \exc3  (each of those four splits again on 3)
 {1,2,3} {1,2} {1,3} {1} {2,3} {2} {3} {}    <- 8 leaves = the 8 subsets
```

- **Step 2 — Subsets in code, with an explicit undo.**

```java
import java.util.ArrayList;
import java.util.List;

public class Subsets {
    static void generate(int[] a, int i, List<Integer> current) {
        if (i == a.length) {                          // no elements left: one subset ready
            System.out.println(current);
            return;
        }
        current.add(a[i]);                            // choice 1: include a[i]
        generate(a, i + 1, current);
        current.remove(current.size() - 1);           // undo, so the next branch is clean
        generate(a, i + 1, current);                  // choice 2: exclude a[i]
    }
    public static void main(String[] args) {
        generate(new int[]{1, 2, 3}, 0, new ArrayList<>());
    }
}
```

**What it prints** (8 lines, in the tree's left-to-right order): `[1, 2, 3]`, `[1, 2]`, `[1, 3]`, `[1]`, `[2, 3]`, `[2]`, `[3]`, `[]`.

- **Step 3 — Why the `remove` matters.** After the include-branch returns, `current` still contains `a[i]`. Without `current.remove(...)`, the exclude-branch would also include it and you would print wrong subsets. The undo is what makes the two branches independent.
- **Step 4 — Permutations: choose a position, then permute the rest.** For `"ABC"` there are `3! = 6` permutations. At position `i`, try every remaining character, then swap back.

```java
public class Permutations {
    static void permute(char[] a, int i) {
        if (i == a.length) {                          // every position fixed
            System.out.println(new String(a));
            return;
        }
        for (int j = i; j < a.length; j++) {
            swap(a, i, j);                            // choose a[j] for position i
            permute(a, i + 1);
            swap(a, i, j);                            // undo, ready for the next choice
        }
    }
    static void swap(char[] a, int i, int j) {
        char t = a[i]; a[i] = a[j]; a[j] = t;
    }
    public static void main(String[] args) {
        permute("ABC".toCharArray(), 0);
    }
}
```

**What it prints:** `ABC`, `ACB`, `BAC`, `BCA`, `CBA`, `CAB` — six lines.

- **Step 5 — Counting the work.** Subsets: `2^n` leaves × up to `n` items → `O(n · 2^n)`; permutations: `n!` leaves × `n` characters → `O(n · n!)`; both `O(n)` depth. They die beyond `n ≈ 20` (subsets) or `n ≈ 10` (permutations), exactly as Module 1's feasibility table predicted.

| Generation | Leaves | Time | Stack |
|---|---|---|---|
| all subsets of `n` items | `2^n` | `O(n · 2^n)` | `O(n)` |
| all permutations of `n` items | `n!` | `O(n · n!)` | `O(n)` |

**Example question:** A set has 10 elements. How many subsets does it have? How many permutations does a 5-letter word with all distinct letters have? Give the complexity of printing each, and say which one is still feasible in 1 second at `10^8` operations per second.

**Solution:**
- **Step 1 — Subsets.** `2^10 = 1024`. *(each element is in or out: two choices, ten times)*
- **Step 2 — Subsets cost.** Printing each of 1024 subsets costs up to 10 items → about `10 × 1024 ≈ 10^4` operations → `O(n · 2^n)`. *(leaves × work per leaf)*
- **Step 3 — Permutations.** `5! = 120`. *(5 choices for the first position, 4 for the second, and so on)*
- **Step 4 — Permutations cost.** `120 × 5 = 600` characters printed → `O(n · n!)`. *(leaves × work per leaf)*
- **Step 5 — Feasibility.** Both are far below the `10^8` budget: `10^4` and `600` operations are microseconds. *(compare with the 1-second budget)*
- **Step 6 — Where it breaks.** Subsets at `n = 25` are `2^25 ≈ 3.4 × 10^7` leaves (about 0.3 s of leaf work but much more with copying); permutations at `n = 12` are `12! ≈ 4.79 × 10^8` — already over budget. *(factorial overtakes exponential quickly)*
**Final answer:** **1024 subsets (`O(n·2^n)`) and 120 permutations (`O(n·n!)`); both are instant at these sizes, but permutations die around `n = 12` and subsets around `n = 25`.**

⚠️ **Common trap:** Forgetting the undo after the recursive call. The first branch then contaminates the second, and you get duplicates or missing answers — with no error message. Second trap: "subsets" vs "subarrays". Subsets are any selection (`2^n`), subarrays are contiguous ranges (`n(n+1)/2`). Reading the question wrongly costs the whole answer.

## 2.8 Recursion vs iteration

### Intuition

Anything recursion can do, a loop can do — they are equally powerful. The choice is about *clarity* versus *cost*. Recursion is clearer when the problem is naturally nested or branching (trees, divide & conquer, backtracking); iteration is cheaper and safer for a straight line (sum, max, counting, "do this `n` times"). Analogy: recursion is a set of nested Russian dolls; iteration is a single doll you open repeatedly. Same contents, different furniture.

### The idea, step by step

- **Step 1 — The honest cost comparison.**

| | Recursion | Iteration |
|---|---|---|
| time | same order usually, plus call overhead | lower constant (no frame setup) |
| space | `O(depth)` frames | usually `O(1)` |
| risk | `StackOverflowError` at large depth | none |
| clarity | high for trees, divide & conquer, backtracking | high for linear scans |
| debugging | stack traces are long, tracing is hard | step-by-step, easy |

- **Step 2 — Converting recursion → loop: find the state that changes.** For `factorial`, the state is the running product and the current `i`. For `sumTo`, the state is the running sum.

```java
public class FactorialIterative {
    static long factorial(int n) {
        long result = 1;
        for (int i = 2; i <= n; i++) result *= i;   // one pass, no frames
        return result;
    }
    public static void main(String[] args) {
        System.out.println(factorial(4));           // 24
    }
}
```

**What it prints:** `24`. `O(n)` time, `O(1)` space — the same answer with none of the stack cost.

- **Step 3 — Converting loop → recursion: ask "what is the last step?"** A loop that accumulates has a recursive twin: `total(n) = a[n-1] + total(n-1)`. The loop's running variable becomes the parameter.
- **Step 4 — Where each one genuinely wins.** Deep linear recursion (`n = 10^6`) overflows the stack while the loop is fine; branching recursion (subsets) has no sane loop version, so recursion wins there. **Tail recursion, honestly:** a call is **tail recursive** when it is the *last* thing the method does (`return f(n-1);`, no work after). Some languages turn that into a loop; Java does not guarantee it. So "tail recursion is as cheap as a loop" is false in Java — write the loop instead.

**Example question:** Convert this recursive method to iteration, and compare time and space:

```java
static int sumTo(int n) {
    if (n == 0) return 0;
    return n + sumTo(n - 1);
}
```

**Solution:**
- **Step 1 — Identify the state that changes.** The current value of `n` and the running total. *(that is exactly what the frames were storing)*
- **Step 2 — Make the state a variable.** `int total = 0;` plus a loop counter `i` from `1` to `n`. *(one variable replaces `n` frames)*
- **Step 3 — The loop version.**

```java
static int sumTo(int n) {
    int total = 0;
    for (int i = 1; i <= n; i++) total += i;
    return total;
}
```

- **Step 4 — Check the same answer.** `sumTo(5)`: `1+2+3+4+5 = 15`, matching the recursive version. *(same values added, different order)*
- **Step 5 — Time.** Both are `O(n)` — `n` additions either way. *(the loop adds once per value, exactly as the calls did)*
- **Step 6 — Space.** Recursive `O(n)` frames; iterative `O(1)`. *(two variables, no stack growth)*
- **Step 7 — Bonus.** `n(n+1)/2` makes it `O(1)` time as well — the Module 1 lesson again. *(a closed form removes the loop entirely)*
**Final answer:** loop with a running total, **`O(n)` time and `O(1)` space** (versus `O(n)` space for the recursive version); the closed form `n(n+1)/2` gives `O(1)` time.

⚠️ **Common trap:** Believing recursion is always slower. For branching problems the recursive version is often *faster* to write and no slower to run — the overhead is per call, and the call count is the same either way. The real difference is stack space and overflow risk, not speed.

## 2.9 The danger of naive recursion

### Intuition

Naive Fibonacci is the classic warning: it computes the same thing again and again, like a student who re-derives the same formula every time instead of writing it down once. `fib(5)` calls `fib(3)` twice and `fib(2)` three times — those subtrees are *identical*, and each repeats the entire work below it. That is **recomputation**, and it is what turns a linear problem into an exponential one. The fix is one line of thinking: **remember what you already computed.** That idea, done properly, is **dynamic programming**.

### The idea, step by step

- **Step 1 — See the overlap.** For `fib(5)` the calls per value are: `fib(5)` once, `fib(4)` once, `fib(3)` twice, `fib(2)` three times, `fib(1)` five times, `fib(0)` three times — 15 calls in total. Only 6 distinct values needed.
- **Step 2 — Watch the growth.** Calls: `fib(20)` → 21,891; `fib(30)` → 2,692,537; `fib(40)` → 331,160,281. The value `fib(40)` is only 102,334,155 — we are doing hundreds of millions of calls to compute 40 numbers.
- **Step 3 — Add a memo (a cache).**

```java
public class FibMemo {
    static long[] memo;
    static int calls = 0;
    static long fib(int n) {
        calls++;
        if (n < 2) return n;                      // base cases 0 and 1
        if (memo[n] != 0) return memo[n];         // already computed: reuse it
        memo[n] = fib(n - 1) + fib(n - 2);        // compute once, store
        return memo[n];
    }
    public static void main(String[] args) {
        int n = 20;
        memo = new long[n + 1];
        System.out.println("fib(" + n + ") = " + fib(n));
        System.out.println("calls = " + calls);
    }
}
```

**What it prints:** `fib(20) = 6765` then `calls = 39`.

39 calls instead of 21,891. (`memo[n] != 0` is safe because `fib(n) > 0` for every `n >= 2`.)

- **Step 4 — Why it works, and its name.** Each value is computed once → `O(n)` time, at a cost of `O(n)` extra space for the table (the time-space trade from Module 1). "Recursive definition + store each answer so it is never recomputed" = **memoisation** (top-down DP); filling the table with a loop instead is **tabulation**. Both appear in DSA-3; the recognition skill is what you need now: *if the same sub-problem appears twice in your recursion tree, you need memory.*

| Approach | Time | Space | Calls for `fib(20)` |
|---|---|---|---|
| naive recursion | `O(2^n)` | `O(n)` depth | 21,891 |
| recursion + memo | `O(n)` | `O(n)` table + `O(n)` depth | 39 |
| iterative (two variables) | `O(n)` | `O(1)` | — |

**Example question:** A recursive method for a problem calls itself twice on inputs of size `n - 1`, and the recursion tree shows the same sub-problem appearing many times. For `n = 40` the naive version makes about `3.3 × 10^8` calls. Explain why, and describe the fix with its new complexity.

**Solution:**
- **Step 1 — Why so many calls.** `T(n) = 2T(n-1) + O(1)` doubles the calls per level, so the tree has about `2^n` nodes. *(branching by 2 at every level)*
- **Step 2 — The real work.** Only `n` distinct sub-problems exist (`n = 0` up to `n = 39`), but each is recomputed many times. *(the tree is huge, the set of distinct inputs is tiny)*
- **Step 3 — The fix.** Store each answer the first time it is computed, and check the store before recursing. *(one array of size `n + 1`)*
- **Step 4 — New cost.** Each sub-problem is solved once → `O(n)` time, `O(n)` extra space. *(one computation per distinct input)*
- **Step 5 — Sanity check.** `3.3 × 10^8` calls versus about `40` computations — a speedup of roughly 8 million times, for a table of 41 `long`s. *(compare call counts)*
**Final answer:** **the naive tree repeats `n` distinct sub-problems exponentially many times; add a memo table → `O(n)` time and `O(n)` space, turning ~`3.3 × 10^8` calls into about 40 computations.**

⚠️ **Common trap:** Adding memoisation to a recursion that has *no* repeated sub-problems — it only costs memory. Memoisation pays exactly when the recursion tree has duplicate subtrees. Second trap: memoising with a value that can legitimately be `0` and using `0` as the "not computed" marker; then it recomputes forever. Use a separate `boolean[] seen` or a sentinel like `-1` when `0` is a valid answer.

## 2.10 Recursive thinking as a habit

### Intuition

Recursion is not a technique you apply once; it is a lens. Once it is a habit, hard problems stop looking hard: you ask "what is the smaller version of this?" and the structure reveals itself.

The habit, in one line: **never solve the whole problem — solve the smallest case, and describe the rest in terms of itself.**

### The idea, step by step

- **Step 1 — The five-question checklist.** Before writing any recursive method, answer these:
  1. What is the smallest input, and what is its answer?
  2. What is the *same* problem with less data?
  3. If the smaller call returned the right answer, how would I build mine?
  4. Does every recursive call move strictly toward the base case?
  5. How deep can it go, and is that depth safe for the stack?
- **Step 2 — Apply it to something new.** `countDigits(n)` = number of decimal digits.
  1. Smallest: `n < 10` → 1 digit.
  2. Smaller problem: `n / 10` (drop the last digit).
  3. Combine: `1 + countDigits(n / 10)`.
  4. Progress: integer division by 10 always shrinks a positive number.
  5. Depth: number of digits, so about 19 for a `long` — perfectly safe.

```java
public class CountDigits {
    static int countDigits(int n) {
        if (n < 10) return 1;                  // base: a single digit
        return 1 + countDigits(n / 10);        // drop the last digit, count it
    }
    public static void main(String[] args) {
        System.out.println(countDigits(4729)); // 4
        System.out.println(countDigits(7));    // 1
    }
}
```

**What it prints:** `4` then `1`. Trace: `4729 → 472 → 47 → 4` (base) → `1 + 1 + 1 + 1 = 4`.

- **Step 3 — Practise the move, not the code.** Each day, take one problem and write only the three sentences: base case, smaller sub-problem, combine — no Java. That is the skill being examined. Then recognise the signals in a statement: "All possible", "every combination", "split into halves", "the answer for `n` depends on `n-1`", "a node contains smaller copies of itself" — each one is an invitation to recurse.
- **Step 4 — Where this leads.** Divide & conquer (Module 5) is step 2 on halves. Backtracking (2.7) is step 2 with undo. DP (DSA-3) is step 2 with memory. All three are this checklist.

**Example question:** Using the five-question checklist, write a recursive method that returns the sum of the digits of a positive integer, and give its complexity.

**Solution:**
- **Step 1 — Smallest input (Q1).** `n < 10` → the answer is `n` itself. *(a single digit is its own digit sum)*
- **Step 2 — Smaller sub-problem (Q2).** `n / 10` — the number without its last digit. *(same problem, fewer digits)*
- **Step 3 — Combine (Q3).** `n % 10 + digitSum(n / 10)` — the last digit plus the sum of the rest. *(nothing is lost and nothing is counted twice)*
- **Step 4 — Progress (Q4).** `n / 10 < n` for every `n >= 10`, so the base case is always reached. *(integer division strictly reduces a positive number)*
- **Step 5 — Depth (Q5).** One frame per digit; a 32-bit `int` has at most 10 digits → at most 10 frames. *(safe, no overflow risk)*
- **Step 6 — Code and check.** `digitSum(4729) = 9 + digitSum(472) = 9 + 2 + 7 + 4 = 22`. *(add the last digit at each level)* **Complexity:** `d` calls where `d` = number of digits → `O(log10 n)` time and `O(log10 n)` stack. *(each call removes one digit)*
**Final answer:** base `n < 10` → `n`; combine `n % 10 + digitSum(n / 10)`; **`O(log n)` time and stack, `digitSum(4729) = 22`.**

⚠️ **Common trap:** Writing the checklist only in your head. The three sentences (base / smaller / combine) written down *before* coding is what stops the "I'll just trace it and see" spiral. Second trap: forgetting Q4 — a recursive call that does not shrink produces `StackOverflowError` even though the logic "looks right".

## Formula / rule summary table

| # | Rule | Statement | Example |
|---|---|---|---|
| 1 | definition | method defined in terms of a smaller version of itself | `n! = n × (n-1)!` |
| 2 | base case | smallest input, answered with no recursive call | `if (n <= 1) return 1;` |
| 3 | recursive case | same problem on strictly smaller input + combine | `return n * factorial(n-1);` |
| 4 | three questions | smallest case / how to shrink / how to combine | used in 2.2 and 2.10 |
| 5 | leap of faith | assume the smaller call is correct, then combine | `int rest = max(a, n-1);` |
| 6 | stack depth | one frame per live call → space `O(depth)` | `factorial(n)` → `O(n)` |
| 7 | linear recurrence | `T(n) = T(n-1) + O(1)` → `O(n)` | factorial, sum, print |
| 8 | halving recurrence | `T(n) = T(n/2) + O(1)` → `O(log n)` | fast power |
| 9 | divide recurrence | `T(n) = 2T(n/2) + O(n)` → `O(n log n)` | mergesort (Module 5) |
| 10 | branching recurrence | `T(n) = T(n-1) + T(n-2) + O(1)` → `O(2^n)` | naive Fibonacci |
| 11 | call count for fib | `C(n) = C(n-1) + C(n-2) + 1`, `C(0)=C(1)=1` | `C(6) = 25` |
| 12 | subsets | `2^n` results, `O(n · 2^n)` time, `O(n)` stack | `n = 3` → 8 subsets |
| 13 | permutations | `n!` results, `O(n · n!)` time, `O(n)` stack | `n = 3` → 6 permutations |
| 14 | backtracking | choose → recurse → **undo** | `current.remove(...)` |
| 15 | memoisation | store each answer → exponential becomes `O(n)` | `fib(20)`: 21,891 → 39 calls |
| 16 | base case for ranges | use `left >= right`, not `left == right` | palindrome, reverse |

**Which rule when?**
- "Find the base case / what does it print" → rules 2, 3, 4.
- "How much stack / why StackOverflowError" → rule 6.
- "Find the complexity of this recursion" → rules 7, 8, 9, 10.
- "How many calls / results" → rules 11, 12, 13.
- "Generate all ..." → rules 12, 13, 14.
- "It is too slow and repeats work" → rule 15.

## Solved examples

**Solved example 1 (easy) — trace and cost.** What does this print, and what are its time and space complexity?

```java
static int f(int n) {
    if (n == 0) return 0;
    return f(n - 1) + n * n;
}
// called as: System.out.println(f(3));
```

- **Step 1 — Base case.** `n == 0` → `0`. *(deepest call)*
- **Step 2 — Unwind.** `f(1) = f(0) + 1 = 1`; `f(2) = 1 + 4 = 5`; `f(3) = 5 + 9 = 14`. *(add `n^2` at each level on the way back up)*
- **Step 3 — Check the meaning.** `1 + 4 + 9 = 14`, the sum of squares up to 3. *(the recurrence sums `n^2` for `n = 1..3`)*
- **Step 4 — Time.** `n + 1` calls, constant work each → `O(n)`. *(one call per value)*
- **Step 5 — Space.** `n + 1` frames → `O(n)`. *(nothing else is allocated)*
**Final answer:** prints **14**; `O(n)` time, `O(n)` space.

**Solved example 2 (medium) — recursion on a string.** Write a recursive method that counts how many times the character `'a'` appears in a string, and give its complexity.

- **Step 1 — Base case.** Empty string → `0`. *(nothing to count)*
- **Step 2 — Smaller sub-problem.** The string without its first character. *(same problem, one character less)*
- **Step 3 — Combine.** `(first character is 'a' ? 1 : 0) + count(rest)`. *(count this one, then the rest)*
- **Step 4 — Code.** Use indices, not `substring`, to avoid copying:

```java
static int countA(String s, int i) {
    if (i == s.length()) return 0;                        // base: past the end
    int here = (s.charAt(i) == 'a') ? 1 : 0;              // 1 if this char is 'a'
    return here + countA(s, i + 1);                       // plus the rest
}
// countA("banana", 0) -> 3
```

- **Step 5 — Trace `"banana"`.** `b`→0, `a`→1, `n`→0, `a`→1, `n`→0, `a`→1, end→0; total `0+1+0+1+0+1 = 3`. *(one addition per character)*
- **Step 6 — Complexity.** `n + 1` calls → `O(n)` time, `O(n)` stack. Using `substring` instead would be `O(n^2)` time and memory. *(copying the tail at each level is the difference)*
**Final answer:** `O(n)` time and `O(n)` stack; `countA("banana", 0)` returns **3**.

**Solved example 3 (exam level) — solve the recurrence.** A recursive method splits its input in half, recurses on both halves, and does `n` units of work to combine. With `T(1) = 1`, find the exact cost and the complexity class for `n = 8`.

- **Step 1 — Write the recurrence.** `T(n) = 2T(n/2) + n`, `T(1) = 1`. *(two half-size calls plus a linear combine)*
- **Step 2 — Expand one level.** `T(n) = 2(2T(n/4) + n/2) + n = 4T(n/4) + 2n`. *(each level contributes `n`)*
- **Step 3 — Expand `k` levels.** `T(n) = 2^k T(n/2^k) + k·n`. *(the `n` term appears once per level)*
- **Step 4 — Stop when `n/2^k = 1`.** That is `k = log2 n`. *(the base case is reached after halving `log2 n` times)*
- **Step 5 — Substitute.** `T(n) = n·T(1) + n·log2 n = n + n log2 n`. *(since `2^k = n`)*
- **Step 6 — Numbers for `n = 8`.** `T(8) = 8 + 8 × 3 = 32`. Check by hand: `T(1)=1`, `T(2)=2·1+2=4`, `T(4)=2·4+4=12`, `T(8)=2·12+8=32`. *(the closed form and the step-by-step agree)*
- **Step 7 — Class.** `n log2 n + n` → `Θ(n log n)`, dropping the lower-order `n`. *(the `n log n` term dominates)*
**Final answer:** `T(n) = n log2 n + n`, so **`Θ(n log n)`**, with `T(8) = 32`.

## Common traps and mistakes

- **No base case, or one that cannot be reached.** Infinite recursion → `StackOverflowError`. A recursive call that does not shrink (`f(n)` calling `f(n)` or `f(n+1)`) does the same, however right the logic looks.
- **Calling recursion `O(1)` space.** Depth `d` → `O(d)` frames. `fib(n)` uses `O(n)` space even though it makes `O(2^n)` calls.
- **Mixing up time and space for branching recursion.** Naive Fibonacci: time `O(2^n)`, space `O(n)`. They are not the same number.
- **Work before vs after the call.** Printing before recursing gives descending output; after gives ascending. This decides many exam answers.
- **Using `substring` / copying arrays inside the recursion.** `O(n)` becomes `O(n^2)` — pass indices instead. And for ranges the base case is `left >= right`, not `left == right`, which fails on even lengths.
- **Forgetting the undo in backtracking.** Branches contaminate each other — duplicates or missing answers, with no error.
- **`fib(0) = 0` forgotten.** With base case `n == 1` only, the recursion walks into negative numbers forever. Related: Java does **not** optimise tail calls, so deep tail recursion still overflows — write the loop.
- **Memoising with `0` as the "not computed" marker when `0` is a valid answer.** Use `-1` or a `boolean[] seen`.

## Quick revision box

- ✅ Recursion = **base case** (smallest input, no call) + **recursive case** (same problem, strictly smaller) + **combine**.
- ✅ Three questions: smallest case? how to shrink? how to combine? Ask them *before* writing code, and use the **leap of faith** — assume the smaller call is correct.
- ✅ Each live call holds a **frame**; depth `d` → `O(d)` stack space. `factorial(4)` peaks at 4 frames and returns `24`.
- ✅ Recurrences: `T(n-1) + O(1)` → `O(n)`; `T(n/2) + O(1)` → `O(log n)`; `2T(n/2) + O(n)` → `O(n log n)`; `T(n-1) + T(n-2) + O(1)` → `O(2^n)`.
- ✅ Classic values: `4! = 24`, `fib(6) = 8`, `2^10 = 1024`, `sumTo(5) = 15`, `countDigits(4729) = 4`, digit sum of 4729 = 22.
- ✅ Structures: reverse and palindrome shrink from **both ends** with `left >= right` as the base case; `O(n)` time, `O(n)` stack.
- ✅ Generation: subsets `2^n` (`O(n·2^n)`), permutations `n!` (`O(n·n!)`), both with **choose → recurse → undo**.
- ✅ Naive Fibonacci: `fib(20)` = 21,891 calls, `fib(30)` = 2,692,537, `fib(40)` = 331,160,281 — add a memo table and `fib(20)` needs **39** calls, `O(n)` time.

## Practice questions

1. For `static int g(int n) { if (n == 0) return 1; return 2 * g(n - 1); }`, state the base case, the value of `g(4)`, and the complexity.
2. How many calls does the naive recursive `fib(7)` make, and what does it return? Derive the count with a recurrence.
3. Write a recursive method that returns the sum of an array's elements using two indices (a range), and state its time and space complexity.
4. How many subsets does a 5-element set have, and how many permutations does a 4-letter word with distinct letters have? Give the printing cost of each.
5. Convert `static int f(int n) { if (n == 0) return 0; return n + f(n - 1); }` to iteration, and state what changes in time and space.
6. A recursive method for `n = 40` makes about `3.3 × 10^8` calls but only 41 distinct sub-problems exist. Name the problem, the fix, and the new time complexity.

## Answers

**1.** Base case `n == 0` → `1`; `g(4) = 2^4 = 16`; `O(n)` time and `O(n)` stack (one call per value). *(Key step: `g(n) = 2^n` by unwinding `2 × 2 × ... × 1`.)*

**2.** `C(n) = C(n-1) + C(n-2) + 1` with `C(0) = C(1) = 1`, giving `C(7) = C(6) + C(5) + 1 = 25 + 15 + 1 = 41` calls; `fib(7) = 13`. *(Key step: build `C` upward from `C(2) = 3`.)*

**3.** `static int sum(int[] a, int l, int r) { if (l > r) return 0; return a[l] + sum(a, l + 1, r); }` — `O(n)` time, `O(n)` stack; the empty range `l > r` is the base case. *(Key step: each call consumes one element and the range strictly shrinks.)*

**4.** `2^5 = 32` subsets, printing cost `O(n · 2^n)` ≈ 160 items; `4! = 24` permutations, printing cost `O(n · n!)` ≈ 96 characters. *(Key step: leaves × work per leaf.)*

**5.** `static int f(int n) { int s = 0; for (int i = 1; i <= n; i++) s += i; return s; }` — time stays `O(n)`, space drops from `O(n)` frames to `O(1)`. *(Key step: the running total replaces the frames; `n(n+1)/2` would make it `O(1)` time too.)*

**6.** Recomputation (overlapping sub-problems); fix = memoisation, storing each computed value in an array of size `n + 1`; new time `O(n)` with `O(n)` extra space. *(Key step: only `n` distinct sub-problems exist, so each should be computed once.)*
