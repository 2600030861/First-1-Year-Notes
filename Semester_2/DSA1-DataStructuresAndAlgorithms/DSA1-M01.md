# DSA-1 – Module 1
## Complexity & Algorithmic Thinking
*Friend-style notes: intuition first, then the formula, then a small example.*

**Maps to CO1.** This module is the measuring tape for the whole course — every later module ends with "and its cost is ...", and that sentence comes from here.

## The big picture

Two students solve the same problem. One finishes in 0.01 seconds, the other in 3 hours. Both are *correct*. This module teaches you to see that difference, measure it, and remove it.

Think of it as installing two dials on your **problem-solving engine**: a **cost dial** (look at any code and say how its work grows with input size) and a **pattern playbook** (most problems are the same few shapes in different clothes).

Analogy: a recipe. Two cooks, same dish, one uses a pressure cooker, one boils on a candle. Complexity compares the *cooking method*, not the cook's speed on a particular day.

Where you use it: "find the time complexity" is a guaranteed exam question; in a contest you must *guess* the needed complexity from the input limit before writing code; in real work, the code that survives 1,000 records and dies on 10 million.

## Basics you must know first

- **Input size `n`** — the thing that grows: array length, number of digits, number of rows. Complexity is always a function of `n`.
- **Basic operation** — one step we agree to count as 1: a comparison, an addition, an assignment, one array access. We count these instead of seconds.
- **Loop** — `for (int i = 0; i < n; i++)` runs its body `n` times.
- **Java arrays** — `a[i]` is one step (`O(1)`). That is why arrays are fast.
- **`log n`** — unless stated, `log` means `log2`: how many times you can halve `n` before reaching 1.

## 1.1 What an algorithm is

### Intuition

An **algorithm** is a recipe that always finishes: a finite list of *unambiguous* steps that takes input and gives the required output. The key word is unambiguous — "add salt to taste" is not a step a computer can follow; "add 2 g of salt" is.

Chai: input water, milk, leaves, sugar → boil water, add leaves, add milk, add sugar, boil 2 minutes, strain → output chai. It terminates, every step is clear. That is an algorithm. A **program** is that algorithm written in Java.

### The idea, step by step

- **Step 1 — The five properties.** Input (zero or more values), output (at least one result), definiteness (no ambiguity), finiteness (it stops), effectiveness (each step is simple enough to do). Something that may run forever is a *procedure*, not an algorithm.
- **Step 2 — Quality one: correctness.** Correct means: for **every** valid input it stops and returns what the problem asked for. "Every" is the whole sentence — a sort that works on `{3,1,2}` but crashes on an empty array is *not correct*. Correctness is yes/no, not a matter of degree, which is why we always test empty input, one element, all duplicates.
- **Step 3 — Quality two: efficiency.** Two correct algorithms can differ by a factor of a billion in running time. Efficiency = time and memory used as `n` grows.
- **Step 4 — See both in one problem.** Sum `1 + 2 + ... + n`:

```java
public class SumTwoWays {
    static long sumLoop(int n) {              // n additions -> O(n)
        long total = 0;
        for (int i = 1; i <= n; i++) total = total + i;
        return total;
    }
    static long sumFormula(int n) {           // 3 operations -> O(1)
        return (long) n * (n + 1) / 2;        // cast first: int overflows at n = 65536
    }
    public static void main(String[] args) {
        System.out.println(sumLoop(1000));     // 500500
        System.out.println(sumFormula(1000));  // 500500
    }
}
```

**What it prints:** `500500` then `500500`. Same answer, one uses ~1000 additions, the other 3. For `n = 10^9` the first takes seconds, the second is instant.

The `(long)` cast is a real correctness fix: `100000 * 100001 = 10,000,100,000` overflows a 32-bit `int` (max 2,147,483,647).

| Property | Question | How we test |
|---|---|---|
| Correctness | Right answer for *all* valid inputs? | empty, one element, duplicates, negatives, largest allowed value |
| Efficiency | How does cost grow with `n`? | count operations, find the growth class |

**Example question:** "Find the largest element of an array" is written two ways. Version A sorts the array and returns the last element; Version B scans once keeping a `max`. For `n = 1000`, estimate the comparisons each does, say which is better, and say whether Version A is *incorrect*.

**Solution:**
- **Step 1 — Version A.** A good sort does about `n log2 n` comparisons; `log2 1000 ≈ 10`, so about `1000 × 10 = 10,000`. *(one comparison per element per level, about `log2 n` levels)*
- **Step 2 — Version B.** One pass, one comparison per element after the first: `n - 1 = 999`. *(a single loop over `n` items → `O(n)`)*
- **Step 3 — Compare growth.** A is `O(n log n)`, B is `O(n)`. At `n = 10^6`: about `2 × 10^7` vs `10^6`. *(the extra `log n` factor is what makes A slower)*
- **Step 4 — Is A incorrect?** No — sorting then taking the last element is correct for any non-empty array. It is correct but wasteful; it would only be *incorrect* if it silently failed on an empty array. *(correctness and efficiency are separate questions)*
**Final answer:** **A ≈ 10,000 comparisons, B ≈ 999; B is better (`O(n)` vs `O(n log n)`); A is correct, just inefficient.**

⚠️ **Common trap:** Writing "Version A is wrong because it is slower". Slower ≠ wrong. Marks go for confusing the two — and the harder error is a "fast" solution that overflows an `int` or crashes on `n = 0`; that one *is* incorrect.

## 1.2 Measuring running time

### Intuition

Your instinct is to run it with a stopwatch. The same code takes 0.4 s on your laptop, 1.2 s on the lab PC, 5 s with 40 Chrome tabs open. A stopwatch measures *the machine*. So we count steps instead — like counting how many times you stir the pot, not timing the cook.

### The idea, step by step

- **Step 1 — Choose one basic operation to count.** Comparisons for a search, additions for a sum, comparisons + swaps for a sort. The choice changes the constant, never the growth.
- **Step 2 — Write `T(n)`, the exact step count.**

```java
long total = 0;                       // 1 step
for (int i = 0; i < n; i++) {         // n+1 checks, n increments
    total = total + a[i];             // n array reads + n additions + n assignments
}
```

`T(n) = 1 + (n + 1) + n + 3n = 5n + 2`. The `+1` and `+2` are noise for large `n`; the shape is "proportional to `n`". One loop over `n` items → `O(n)`.

- **Step 3 — Growth beats the constant.**

| `n` | `5n + 2` | `n^2` | Winner |
|---|---|---|---|
| 10 | 52 | 100 | linear |
| 100 | 502 | 10,000 | linear |
| 1,000 | 5,002 | 1,000,000 | linear |
| 1,000,000 | 5,000,002 | 10^12 | linear, by 200,000× |

At `n = 10` the two are close (52 vs 100) — small inputs hide bad algorithms, which is why we test big `n`.

- **Step 4 — Count a real search.**

```java
public class CountComparisons {
    static int linearSearch(int[] a, int target) {
        int comparisons = 0;
        for (int i = 0; i < a.length; i++) {
            comparisons++;                       // count before testing
            if (a[i] == target) {
                System.out.println("comparisons = " + comparisons);
                return i;
            }
        }
        System.out.println("comparisons = " + comparisons);
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {4, 8, 15, 16, 23, 42};
        System.out.println("index = " + linearSearch(a, 16));
        System.out.println("index = " + linearSearch(a, 99));
    }
}
```

**What it prints:** `comparisons = 4`, `index = 3`, `comparisons = 6`, `index = -1`.

Why 4? The counter increments *before* the test, and `16` sits at index 3: i=0→1, i=1→2, i=2→3, i=3→4. So comparisons = the **1-based position** when found, and `n` when absent.

**Example question:** `T1(n) = 3n^2 + 5n + 7` and `T2(n) = 100n + 50` solve the same problem. Despite the big constant, `T2` eventually wins. From which `n`?

**Solution:**
- **Step 1 — Set them equal to find the crossover.** `3n^2 + 5n + 7 = 100n + 50`. *(equal costs at the crossing point)*
- **Step 2 — Move everything left.** `3n^2 - 95n - 43 = 0`. *(subtract the same terms from both sides)*
- **Step 3 — Quadratic formula** with `a = 3, b = -95, c = -43`: `n = (95 + sqrt(95^2 + 4·3·43)) / 6 = (95 + sqrt(9541)) / 6 ≈ (95 + 97.68)/6 ≈ 32.1`. *(discriminant `9025 + 516 = 9541`; take the positive root)*
- **Step 4 — Check both sides.** `n = 32`: `T1 = 3072 + 160 + 7 = 3239`, `T2 = 3250` → `T1` still wins. `n = 33`: `T1 = 3267 + 165 + 7 = 3439`, `T2 = 3350` → `T2` wins. *(substituting numbers confirms the crossing)*
- **Step 5 — Lesson.** Below the crossing the small constant wins; above it the `n^2` term dominates forever. *(complexity decides the eventual winner, constants decide today's)*
**Final answer:** **`T2` is faster from `n = 33` onwards** (crossover at `n ≈ 32.1`).

⚠️ **Common trap:** Forgetting the loop condition runs `n + 1` times. It matters in "count the exact operations" questions and vanishes in Big-O — so don't spend time on it there.

## 1.3 Asymptotic notation

### Intuition

"Asymptotic" means "as `n` gets big". Three friends run 100 m: one sprints then stops, one jogs steadily, one walks then speeds up. For 2 metres you can't tell; after 10 km the pattern is permanent. Asymptotic notation describes that permanent pattern. Think of three fences: **Big-O** a fence *above* the curve ("never worse than this"), **Big-Omega** a fence *below* ("never better than this"), **Big-Theta** both fences ("exactly this growth").

### The idea, step by step

- **Step 1 — Big-O, the upper bound.**

```text
f(n) = O(g(n))  if there exist c > 0, n0 > 0 such that f(n) <= c . g(n) for all n >= n0
```

**Meaning:** `f` is the real step count, `g` the simple function we compare against, `c` absorbs machine speed, `n0` is where the promise starts. **When to use:** every time you state the complexity of code. **Tiny example:** `5n + 3 = O(n)` with `c = 6, n0 = 3`, since `5n + 3 <= 6n` exactly when `3 <= n`.

The "for all `n >= n0`" clause is the escape hatch: Big-O may be wrong for small inputs. `1000n` beats `n^2` until `n = 1000`; Big-O simply starts watching after that.

- **Step 2 — Big-Omega, the mirror.**

```text
f(n) = Ω(g(n))  if there exist c > 0, n0 > 0 such that f(n) >= c . g(n) for all n >= n0
```

**Meaning:** a lower bound — the algorithm cannot beat this growth.
**When to use:** to say "nothing in this family can do better" (comparison sorting is `Ω(n log n)`).
**Tiny example:** `3n^2 + 2n = Ω(n^2)` with `c = 3, n0 = 1`.

- **Step 3 — Big-Theta, the tight one.** `f(n) = Θ(g(n))` when `f = O(g)` **and** `f = Ω(g)`:

```text
c1 . g(n) <= f(n) <= c2 . g(n)  for all n >= n0
```

**Meaning:** `g` is the correct growth rate, no slack either way.
**When to use:** whenever you can — it is the most informative statement.
**Tiny example:** `2n + 5 = Θ(n)`.

- **Step 4 — Drop constants and lower-order terms.**

| Rule | Example | Why it is allowed |
|---|---|---|
| drop constant factors | `7n^2` → `n^2` | a constant is machine speed, not growth |
| drop lower-order terms | `n^2 + 500n + 9000` → `n^2` | `n^2` swamps the rest for large `n` |
| keep the fastest-growing term | `n log n + n` → `n log n` | `n log n` grows faster |
| fixed number of steps | 500 steps → `O(1)` | it does not grow with `n` |

- **Step 5 — The ladder, slowest to fastest** (memorise):

```text
O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(n^3) < O(2^n) < O(n!)
```

Anything on the left is eventually smaller than anything on the right, whatever constants you attach.

| Notation | Reads as | Inequality | Think |
|---|---|---|---|
| `O(g(n))` | big-Oh | `f(n) <= c . g(n)` | upper bound |
| `Ω(g(n))` | big-Omega | `f(n) >= c . g(n)` | lower bound |
| `Θ(g(n))` | big-Theta | `c1 g(n) <= f(n) <= c2 g(n)` | tight bound |

**Example question:** Prove `f(n) = 3n^2 + 2n + 1` is `O(n^2)` by finding valid `c` and `n0`. Is it also `Θ(n^2)`?

**Solution:**
- **Step 1 — Write the target inequality.** Need `3n^2 + 2n + 1 <= c·n^2` for all `n >= n0`. *(that is the definition)*
- **Step 2 — Bound each term by a multiple of `n^2`.** `3n^2 <= 3n^2` always; `2n <= 2n^2` for `n >= 1`; `1 <= n^2` for `n >= 1`. *(every term is at most a constant times `n^2` once `n >= 1`)*
- **Step 3 — Add them.** `3n^2 + 2n + 1 <= 6n^2`, so `c = 6, n0 = 1`. *(adding inequalities valid for the same `n` is valid)*
- **Step 4 — Check a number.** `f(10) = 300 + 20 + 1 = 321 <= 6 × 100 = 600`. *(guards against backwards constants)*
- **Step 5 — The other direction.** `3n^2 + 2n + 1 >= 3n^2` since `2n + 1 > 0`, so `f = Ω(n^2)` with `c1 = 3, n0 = 1`. *(Θ needs both directions and we now have both)*
**Final answer:** **`c = 6, n0 = 1` proves `O(n^2)`** (also valid: `c = 4, n0 = 3`); **yes, `Θ(n^2)`**, since it is also `Ω(n^2)`.

⚠️ **Common trap:** Reading `f(n) = O(g(n))` as equality. It is a relation — `n = O(n^2)` is true but useless. Give the *tightest* correct bound, and never write `O(1)` for something that loops.

## 1.4 The common complexity classes

### Intuition

Six classes cover almost everything. Learn them as feelings:
`O(1)` — "I already know it" (first note in your wallet). `O(log n)` — "I halve the problem" (guess 1–100 in 7 questions). `O(n)` — "I look at everything once" (reading the attendance register). `O(n log n)` — "everything, `log n` times" (sorting a deck by split-and-merge). `O(n^2)` — "everyone meets everyone" (30 people, 435 handshakes). `O(2^n)` — "I try every choice" (every subset, every on/off combination).

### The idea, step by step

- **Step 1 — `O(1)`.** Work independent of `n`: `a[5]`, `a.length`, `x + y`. The goal, and rare.
- **Step 2 — `O(log n)`.** Each step throws away a constant fraction (usually half). `log2 1000 ≈ 10` halvings for 1000 items; `log2 10^6 ≈ 20`. Doubling `n` adds **one** step — that is why binary search handles a billion items in about 30 comparisons.
- **Step 3 — `O(n)`.** One pass: sum, max, count, linear search. Double the input, double the time. Usually the best possible when you must *look* at every element.
- **Step 4 — `O(n log n)`.** "`log n` passes, each costing `n`." Mergesort and quicksort live here; it is the practical ceiling for comparison sorting and the class you hope for when `n <= 10^5`.
- **Step 5 — `O(n^2)`.** Two nested loops: for each of `n` items, look at `n` items. All-pairs problems, the elementary sorts. Fine to about `n = 10^4`.
- **Step 6 — `O(2^n)`.** Work doubles per added element: "try all subsets", naive recursive Fibonacci. Usable to about `n = 20`–`25`.
- **Step 7 — The operations table** (counts, not times):

| Class | `n = 10` | `n = 100` | `n = 1000` | `n = 10^6` |
|---|---|---|---|---|
| `O(1)` | 1 | 1 | 1 | 1 |
| `O(log n)` | 3 | 7 | 10 | 20 |
| `O(n)` | 10 | 100 | 1,000 | 10^6 |
| `O(n log n)` | 33 | 664 | 9,966 | ≈ `2 × 10^7` |
| `O(n^2)` | 100 | 10,000 | 10^6 | 10^12 |
| `O(2^n)` | 1,024 | ≈ `1.27 × 10^30` | ≈ `1.07 × 10^301` | uncountable |

- **Step 8 — The same table as time**, at about `10^8` operations per second (one operation ≈ 10 ns):

| Class | `n = 10` | `n = 100` | `n = 1000` | `n = 10^6` |
|---|---|---|---|---|
| `O(1)` | instant | instant | instant | instant |
| `O(log n)` | instant | instant | instant | ≈ 0.2 µs |
| `O(n)` | instant | instant | ≈ 10 µs | 0.01 s |
| `O(n log n)` | instant | instant | ≈ 0.1 ms | 0.2 s |
| `O(n^2)` | ≈ 1 µs | 0.1 ms | 0.01 s | 10,000 s ≈ **2.8 h** |
| `O(2^n)` | ≈ 10 µs | ≈ `4 × 10^14` years | hopeless | hopeless |

The `n = 100` exponential entry: `1.27 × 10^30 ÷ 10^8 = 1.27 × 10^22` s, and a year is `3.15 × 10^7` s, so ≈ `4 × 10^14` years — the universe is only about `1.4 × 10^10` years old.

- **Step 9 — See it in code.**

```java
public class GrowthDemo {
    public static void main(String[] args) {
        int n = 1_000_000;
        int linearSteps = 0;                     // O(n): one pass
        for (int i = 0; i < n; i++) linearSteps++;
        int halvings = 0;                        // O(log n): halve until done
        int size = n;
        while (size > 1) { size = size / 2; halvings++; }
        System.out.println("linear steps  = " + linearSteps);
        System.out.println("halving steps = " + halvings);
    }
}
```

**What it prints:** `linear steps  = 1000000` then `halving steps = 19`.

One million versus nineteen — that is the entire reason binary search exists (Module 4).

| Class | Code shape | Doubling `n` multiplies work by |
|---|---|---|
| `O(1)` | no loop | 1 |
| `O(log n)` | `i = i * 2`, `size = size / 2` | adds 1 step |
| `O(n)` | one loop | 2 |
| `O(n log n)` | sort, or loop × halving | slightly more than 2 |
| `O(n^2)` | two nested loops | 4 |
| `O(2^n)` | all subsets / naive recursion | squares it |

**Example question:** An algorithm does `n log2 n` operations. For `n = 10^6`, estimate the operations and the running time at `10^8` ops/s, and compare with an `n^2` algorithm on the same input.

**Solution:**
- **Step 1 — Find `log2(10^6)`.** `2^10 = 1024 ≈ 10^3`, so `10^6 ≈ 2^20` and `log2(10^6) ≈ 20`. *(every factor of 1000 is about 10 doublings)*
- **Step 2 — Multiply.** `10^6 × 20 = 2 × 10^7` operations. *(substitute into `n log2 n`)*
- **Step 3 — Convert to time.** `2 × 10^7 ÷ 10^8 = 0.2` s. *(time = operations ÷ rate)*
- **Step 4 — The `n^2` version.** `(10^6)^2 = 10^12` operations → `10^12 ÷ 10^8 = 10^4` s = `10,000 ÷ 3600 ≈ 2.78` hours. *(squaring `n` squares the count)*
- **Step 5 — Ratio.** `10^12 ÷ (2 × 10^7) = 5 × 10^4`. *(ratio of counts = ratio of times)*
**Final answer:** **≈ `2 × 10^7` operations ≈ 0.2 s** for `n log n` vs **`10^12` operations ≈ 2.8 hours** for `n^2` — about **50,000× slower**.

⚠️ **Common trap:** `log` without a base. `log10(10^6) = 6` but `log2(10^6) ≈ 20` — a 3.3× error in a numeric answer. The class `O(log n)` is unaffected, but the *estimate* is. And never write `2^n` when you mean `n^2`.

## 1.5 Space complexity and the time-space tradeoff

### Intuition

Memory is money too. **Space complexity** = extra memory used as `n` grows. **Auxiliary space** = what the algorithm itself allocates (new arrays, maps, recursion frames); **total space** = input + auxiliary. When a question just says "space complexity", it means auxiliary. Analogy: copying a 500-page book. Page by page (small desk, slow) or photocopy the whole book (big desk, fast). Same result, different desk size — that is the tradeoff.

### The idea, step by step

- **Step 1 — Count the extra memory.**

```java
static int sum(int[] a) {          // input a is given, not counted
    int total = 0;                 // 1 extra int
    for (int i = 0; i < a.length; i++) total += a[i];
    return total;
}
```

Extra space `O(1)`: two variables, and their number does not grow with `n`.

- **Step 2 — A version that spends `O(n)`.** An `int[] prefix = new int[n + 1]` grows with `n` → `O(n)` auxiliary.
- **Step 3 — The trade, concretely.** Range sum "sum of `a[l..r]`":
  - brute force: `O(n)` per query, `O(1)` space;
  - prefix sums: `O(n)` build once, then `O(1)` per query, `O(n)` space, because `sum(l..r) = prefix[r+1] - prefix[l]`.

```java
public class PrefixTradeoff {
    static int[] prefix;
    static void build(int[] a) {                 // O(n) time, O(n) space
        prefix = new int[a.length + 1];
        for (int i = 0; i < a.length; i++) prefix[i + 1] = prefix[i] + a[i];
    }
    static int rangeSum(int l, int r) {          // O(1) per query
        return prefix[r + 1] - prefix[l];
    }
    static int rangeSumBrute(int[] a, int l, int r) {   // O(r-l+1) per query
        int s = 0;
        for (int i = l; i <= r; i++) s += a[i];
        return s;
    }
    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5};
        build(a);
        System.out.println(rangeSum(1, 3));          // 6
        System.out.println(rangeSumBrute(a, 1, 3));  // 6
        System.out.println(rangeSum(0, 4));          // 14
        System.out.println(rangeSumBrute(a, 0, 4));  // 14
    }
}
```

**What it prints:** `6`, `6`, `14`, `14`. Check: `prefix = [0, 3, 4, 8, 9, 14]`; `(1,3)` → `9 - 3 = 6` and `1+4+1 = 6`.

- **Step 4 — Recursion costs space too.** Every pending call holds a **stack frame**. `factorial(n)` has `n` frames → `O(n)` auxiliary space even though it allocates no array (Module 2).

| Situation | Extra space |
|---|---|
| few variables, no arrays | `O(1)` |
| one new array of size `n` | `O(n)` |
| 2-D table `n × n` | `O(n^2)` |
| recursion of depth `d` | `O(d)` frames |
| bubble / insertion sort in place | `O(1)` |
| mergesort | `O(n)` merge buffer |

**Example question:** An array of `10^6` ints, `10^5` range-sum queries. Compare brute force and prefix sums in time and space (4 bytes per `int`, `10^8` ops/s). Is the memory worth it?

**Solution:**
- **Step 1 — Brute, per query.** Up to `10^6` operations. *(one loop over the range → `O(n)`)*
- **Step 2 — Brute, total.** `10^5 × 10^6 = 10^11` operations. *(per-query cost × number of queries)*
- **Step 3 — Brute, time.** `10^11 ÷ 10^8 = 1000` s ≈ 16.7 min; space `O(1)`. *(operations ÷ rate)*
- **Step 4 — Prefix build.** `10^6` operations and `10^6 + 1` ints. *(one int per position plus a leading zero)*
- **Step 5 — Prefix queries.** `10^5 × 1` subtraction = `10^5` operations. *(each query is `O(1)`)*
- **Step 6 — Prefix total.** `1.1 × 10^6 ÷ 10^8 = 0.011` s. *(build + queries)*
- **Step 7 — Memory.** `10^6 × 4 bytes = 4 MB`. *(4 bytes per int)*
- **Step 8 — Compare.** `1000 ÷ 0.011 ≈ 90,000×` faster. *(ratio of times)*
**Final answer:** **1000 s and `O(1)` space vs 0.011 s and 4 MB — the 4 MB buys a ~90,000× speedup, clearly worth it.**

⚠️ **Common trap:** Calling a recursive solution "in-place / `O(1)` space". Depth-`n` recursion is `O(n)` space. Also forgetting `prefix[0] = 0`, which forces an `if` for `l = 0` and usually an off-by-one bug.

## 1.6 Best, average and worst case

### Intuition

You look up a word in a dictionary: it is the first word (one glance), somewhere in the middle (a while), or the last word / not there at all (you read everything). Same algorithm, different *input* — best, average and worst are three questions about the same code, and the answers depend only on which input shows up.

### The idea, step by step

- **Step 1 — Best case.** Cheapest input of size `n`. Linear search with the target at index 0 → 1 comparison. Tells you about luck, not about the algorithm.
- **Step 2 — Worst case.** Most expensive input of size `n`. Target last or absent → `n` comparisons.
- **Step 3 — Average case.** Expected cost over all inputs, which needs an **assumption about the distribution**. If the target is present once and every position is equally likely: `(1 + 2 + ... + n) / n = n(n+1)/2 ÷ n = (n+1)/2`.
- **Step 4 — Why the worst case wins.**
  - **It is a guarantee.** "It finishes in time" is only true of the worst case; the average fails on the one bad test the judge includes.
  - **Inputs are not random.** Sorted, reverse-sorted and all-equal data are common and often the worst case (exactly quicksort's weakness).
  - **Average needs an assumption you may not be able to defend.** "Equally likely" is a guess.
  - **Convention:** exam and interview "complexity" means worst case unless stated.

- **Step 5 — See it in code.** Insertion sort shifts each element left while it is smaller than its left neighbour: nothing to shift when sorted, everything when reversed.

```java
public class CaseDemo {
    static int insertionSortComparisons(int[] input) {
        int[] a = input.clone();
        int count = 0;
        for (int i = 1; i < a.length; i++) {
            int key = a[i], j = i - 1;
            while (j >= 0 && a[j] > key) {     // one comparison per test
                count++;
                a[j + 1] = a[j];               // shift right
                j--;
            }
            if (j >= 0) count++;               // the test that stopped the loop
            a[j + 1] = key;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println("sorted   -> " + insertionSortComparisons(new int[]{1, 2, 3, 4, 5}));
        System.out.println("reversed -> " + insertionSortComparisons(new int[]{5, 4, 3, 2, 1}));
    }
}
```

**What it prints:** `sorted   -> 4` then `reversed -> 10`.

| Step (i) | `key` | Comparisons in the while loop | Total | What changed |
|---|---|---|---|---|
| 1 | 4 | `5 > 4` → 1 | 1 | 5 shifts right, 4 placed at index 0 |
| 2 | 3 | `5 > 3`, `4 > 3` → 2 | 3 | 5 and 4 shift right |
| 3 | 2 | 3 comparisons | 6 | three shifts |
| 4 | 1 | 4 comparisons | 10 | four shifts |

Best `n - 1 = 4` → `O(n)`; worst `n(n-1)/2 = 10` → `O(n^2)`.

| Case | Definition | Linear search | Insertion sort |
|---|---|---|---|
| best | cheapest input of size `n` | 1 comparison | `n - 1`, `O(n)` |
| average | expected over a stated distribution | `(n+1)/2` | `n(n-1)/4`, `O(n^2)` |
| worst | costliest input of size `n` | `n`, `O(n)` | `n(n-1)/2`, `O(n^2)` |

**Example question:** Linear search over `n = 1000` distinct ints, target present exactly once, equally likely at any position. Give best, average and worst comparisons, and say which you would quote in an exam.

**Solution:**
- **Step 1 — Best.** Target at index 0 → **1**. *(loop exits on the first iteration)*
- **Step 2 — Average.** Positions cost `1, 2, ..., 1000`; sum `= 1000 × 1001/2 = 500,500`; average `= 500.5`. *(sum `n(n+1)/2`, divide by `n` equally likely cases)*
- **Step 3 — Worst.** Target last → **1000**. *(every iteration runs)*
- **Step 4 — Sanity check.** `1 < 500.5 < 1000`, almost exactly centred, as symmetry predicts.
- **Step 5 — Which to quote.** The worst case `O(n)`: it is the only figure guaranteed for every input of that size and the one that decides whether you pass the time limit. *(it needs no distribution assumption)*
**Final answer:** **best 1, average 500.5 ≈ 500–501, worst 1000 comparisons; quote the worst case, `O(n)`.**

⚠️ **Common trap:** Writing "average case is `O(n/2)`". Big-O never keeps `1/2` — `O(n/2) = O(n)`. The average *count* is `(n+1)/2`; the average *class* is `O(n)`, same as the worst case. And quoting an average without stating the distribution loses marks.

## 1.7 The cost mindset — brute force, analyse, optimise

### Intuition

Beginners try to be clever on the first attempt, then get stuck for 40 minutes on a problem they could have solved in 5. The professional order is always three beats: **brute force** (dumb but correct), **analyse** (what does it cost, where is the waste), **optimise** (remove exactly that waste).

Like packing a suitcase: throw everything in first, then look at what is taking space, then fold only those things. You never start by folding. Why brute force first? Because it gives a **working reference answer** to test the clever version against, and it shows you *which* work is repeated. Almost every optimisation is "I noticed I was recomputing the same thing".

### The idea, step by step

- **Step 1 — Brute force, and be sure it is correct.** "Does this array contain a duplicate?"

```java
public class DuplicateBrute {
    static boolean hasDuplicate(int[] a) {        // O(n^2) time, O(1) space
        for (int i = 0; i < a.length; i++)
            for (int j = i + 1; j < a.length; j++)   // only look forward
                if (a[i] == a[j]) return true;
        return false;
    }

    public static void main(String[] args) {
        System.out.println(hasDuplicate(new int[]{4, 2, 7, 2, 9}));  // true
        System.out.println(hasDuplicate(new int[]{4, 2, 7, 1, 9}));  // false
    }
}
```

**What it prints:** `true` then `false`. `j = i + 1` compares each pair once: for `n = 5`, `5 × 4 / 2 = 10` comparisons.

- **Step 2 — Analyse.** Nested loops over the same data → about `n^2/2` → `O(n^2)`. At `n = 10^5`: `5 × 10^9` comparisons → 50 s. Too slow.
- **Step 3 — Find the waste.** For each `i` we rescan the whole tail. If the data were **sorted**, equal values would be neighbours and one pass would do.
- **Step 4 — Optimise (sort first).**

```java
import java.util.Arrays;

public class DuplicateSorted {
    static boolean hasDuplicate(int[] a) {        // O(n log n) time
        int[] b = a.clone();                     // copy: don't disturb the caller
        Arrays.sort(b);                          // O(n log n)
        for (int i = 1; i < b.length; i++)
            if (b[i] == b[i - 1]) return true;   // equal neighbours -> duplicate
        return false;
    }

    public static void main(String[] args) {
        System.out.println(hasDuplicate(new int[]{4, 2, 7, 2, 9}));  // true
        System.out.println(hasDuplicate(new int[]{4, 2, 7, 1, 9}));  // false
    }
}
```

**What it prints:** `true` then `false`. Cost `O(n log n)` + `O(n)` scan → `O(n log n)`; at `n = 10^5` about `1.7 × 10^6` operations → 0.017 s. From 50 s to 0.017 s.

- **Step 5 — Optimise again if the pattern allows.** A hash set gives `O(1)` average lookup: one pass → `O(n)` time, `O(n)` space. A different trade (memory for time), formalised in DSA-2. Note the fastest version is not always the best version.
- **Step 6 — The habit, written down.**

```text
1. BRUTE FORCE  -> correct, obvious, slow
2. ANALYSE      -> complexity + "where is the repeated work?"
3. OPTIMISE     -> attack that specific waste (sort / remember / restructure)
```

| Beat | Question | Output |
|---|---|---|
| brute force | "dumbest correct way?" | working code + baseline cost |
| analyse | "what is `T(n)`, what repeats?" | a complexity + the waste |
| optimise | "what structure kills that waste?" | better complexity, checked against the baseline |

**Example question:** Given `a = {2, 7, 11, 15}` and target `9`, decide whether two *different* elements sum to `9`. Give brute force, its cost, and one optimisation with its cost.

**Solution:**
- **Step 1 — Brute force.** Test every pair `(i, j)`, `i < j`, for `a[i] + a[j] == target`. *(if a pair exists this cannot miss it, so it is correct)*
- **Step 2 — Trace.** Pairs: `(2,7) = 9` on the very first pair. *(pairs checked in order)*
- **Step 3 — Cost.** `n(n-1)/2` pairs → `O(n^2)` time, `O(1)` space. *(two nested loops multiply)*
- **Step 4 — The waste.** For each `i` we search for `target - a[i]`; the array is unsorted, so each search is `O(n)`.
- **Step 5 — Optimisation A (sort + two pointers).** Sort `O(n log n)`, then one pointer at each end: too small → move left pointer right, too big → move right pointer left. Total **`O(n log n)`**. *(sorting dominates; the scan is one pass)*
- **Step 6 — Optimisation B (hash set).** One pass: check whether `target - a[i]` was seen, then insert. **`O(n)` time, `O(n)` space**. *(one pass with `O(1)` average lookups)*
- **Step 7 — Check A on the sample.** Sorted `{2,7,11,15}`: `2+15=17>9` move right; `2+11=13>9` move right; `2+7=9`. *(same answer as brute force)*
**Final answer:** **brute `O(n^2)`; sort + two pointers `O(n log n)`; hash set `O(n)` time with `O(n)` space. On the sample: yes, `2 + 7 = 9`.**

⚠️ **Common trap:** Optimising before you have a correct brute force — you then cannot tell whether a wrong answer is the clever idea or a typo. Second trap: "two *different* elements". With `{5, 1}` and target `10`, code that reuses the same index wrongly answers `true`.

## 1.8 Estimating feasibility

### Intuition

A contest gives you a **time limit** (usually 1 second) and an **input limit** (`n <= 10^5`). Those two numbers tell you the complexity you are allowed to use *before* you write anything. It is a luggage allowance: if the airline says 7 kg, you don't pack 20 kg and hope.

The bridge: at roughly `10^8` simple operations per second, 1 second ≈ `10^8` operations. So the question becomes "does my solution stay under `10^8` operations at the largest `n`?"

### The idea, step by step

- **Step 1 — Turn the limit into a budget.** `1 s ≈ 10^8` operations. Java with objects is usually slower, so the honest range is `10^7`–`10^8`.
- **Step 2 — Test each candidate at the maximum `n`.** If `n <= 10^5`: `O(n)` → `10^5` ops; `O(n log n)` → `1.7 × 10^6`; `O(n^2)` → `10^10` → 100 s (too slow); `O(n^3)` → hopeless.
- **Step 3 — The direction you actually use.** See `n <= 10^5` → you need `O(n log n)` or better. See `n <= 20` → `O(2^n)` is expected (the problem wants subsets). See `n <= 10^18` → `O(log n)` maths, because you cannot even read the input.
- **Step 4 — The feasibility table** (the most useful table here):

| Input limit | Budget ≈ | Usable complexities | Typical signal |
|---|---|---|---|
| `n <= 10` | `10^8` | `O(n!)`, `O(2^n)`, `O(n^3)` | "all permutations" |
| `n <= 20` | `10^8` | `O(2^n)`, `O(n^2)` | "all subsets" |
| `n <= 500` | `10^8` | `O(n^3)` | three nested loops |
| `n <= 10^4` | `10^8` | `O(n^2)` | all-pairs |
| `n <= 10^5` | `10^8` | `O(n log n)`, `O(n)` | sort, two pointers, prefix sums |
| `n <= 10^6` | `10^8` | `O(n)`, `O(n log n)` tight | one or two passes |
| `n <= 10^8` | `10^8` | `O(n)` with a tiny constant | a single scan |
| `n` up to `10^18` | — | `O(log n)`, `O(1)` | maths / binary search on the answer |

- **Step 5 — Check the table's arithmetic so you trust it.** `n = 10^4` → `n^2 = 10^8` (exactly at budget). `n = 10^5` → `n log2 n ≈ 10^5 × 17 = 1.7 × 10^6`; `n^2 = 10^10` → 100 s (too slow). `n = 20` → `2^20 = 1,048,576`. `n = 25` → `2^25 = 33,554,432`. `n = 30` → `2^30 = 1,073,741,824` → about 10 s (too slow).

```text
budget = (time limit in seconds) × 10^8 operations
feasible  <=>  T(n_max) <= budget
```

**Meaning:** `T(n_max)` is your step count at the largest allowed input. **When to use:** before coding, whenever the statement gives `n`. **Tiny example:** 1 s limit, `n <= 1000`, `O(n^2)` → `10^6` ops ≪ `10^8`.

**Example question:** `n <= 10^5`, 1-second limit (`10^8` ops). Candidates: `O(n^2)`, `O(n log2 n)`, `O(n^3)`. Which are acceptable? Show the arithmetic.

**Solution:**
- **Step 1 — Budget.** `1 × 10^8 = 10^8` operations. *(time × rate)*
- **Step 2 — `O(n^2)`.** `(10^5)^2 = 10^10`; `10^10 ÷ 10^8 = 100` s → **not acceptable**. *(100× over budget)*
- **Step 3 — `O(n log2 n)`.** `log2(10^5) ≈ 16.6 → 17`; `10^5 × 17 = 1.7 × 10^6`; `÷ 10^8 = 0.017` s → **acceptable**. *(one log factor costs only ~17× here)*
- **Step 4 — `O(n^3)`.** `(10^5)^3 = 10^15` → `10^7` s ≈ 115 days → **hopeless**. *(each nested loop multiplies by another `10^5`)*
- **Step 5 — Cross-check the borderline.** With `n <= 10^4`, `n^2 = 10^8` exactly at budget — "just fits", which is risky in practice. That is why the table puts `O(n^2)` at `n <= 10^4`, not `10^5`. *(no room left for constants, I/O, JVM overhead)*
**Final answer:** **only `O(n log n)` is acceptable (0.017 s)**; `O(n^2)` needs 100 s and `O(n^3)` is hopeless, so both are rejected on paper before coding.

⚠️ **Common trap:** Assuming `O(n log n)` is always safe — at `n = 10^7` it is about `2.3 × 10^8` operations, already over budget, and a heavy constant can sink an `O(n)` solution too. Treat `10^8` as optimistic and aim for `10^7`.

## 1.9 Analysing simple code

### Intuition

You don't re-derive complexity each time. There are about six code shapes and each has a fixed answer — like reading a chord chart instead of every note: sequence, one loop, two loops in sequence, two loops nested, a loop that doubles/halves its counter, and recursion.

### The idea, step by step

- **Step 1 — Sequence adds, nesting multiplies.** `O(n) + O(n^2)` → `O(n^2)` *(the bigger one wins)*; `n` iterations containing `n` iterations → `n^2` *(the inner loop runs fully for each outer iteration)*.
- **Step 2 — A counter that doubles or halves → `log n`.** `for (i = 1; i < n; i = i * 2)` visits `1, 2, 4, 8, ...` → about `log2 n` iterations *(each step shrinks the work by a constant factor)*.
- **Step 3 — Unequal nested loops: sum them.** `for (i...) for (j = i; j < n; j++)` runs `n + (n-1) + ... + 1 = n(n+1)/2` → still `O(n^2)`, with half the constant *(arithmetic series; the `n^2` term dominates)*.
- **Step 4 — Count it in Java.**

```java
public class Analyse {
    public static void main(String[] args) {
        int n = 100;
        int c1 = 0;
        for (int i = 0; i < n; i++) c1++;                  // one loop
        int c2 = 0;
        for (int i = 0; i < n; i++)                        // full nested
            for (int j = 0; j < n; j++) c2++;
        int c3 = 0;
        for (int i = 0; i < n; i++)                        // triangular nested
            for (int j = i; j < n; j++) c3++;
        int c4 = 0;
        for (int i = 1; i < n; i = i * 2) c4++;            // counter doubles
        System.out.println("one loop      = " + c1);        // 100
        System.out.println("nested        = " + c2);        // 10000
        System.out.println("triangular    = " + c3);        // 5050
        System.out.println("doubling loop = " + c4);        // 7
    }
}
```

**What it prints:** `100`, `10000`, `5050`, `7`. Check the last: `i = 1, 2, 4, 8, 16, 32, 64` → 7 iterations, then `128 >= 100` stops. And `5050 = 100 × 101 / 2`.

- **Step 5 — Recursion, the bridge to Module 2.** Loops cannot count a recursive call; write a **recurrence** instead:
`T(n) = T(n-1) + O(1)` → `O(n)` (one call per size); `T(n) = 2T(n/2) + O(n)` → `O(n log n)` (mergesort); `T(n) = T(n-1) + T(n-2) + O(1)` → `O(2^n)` (naive Fibonacci).

```java
public class RecursionCost {
    static int sumTo(int n) {              // T(n) = T(n-1) + 1 -> O(n)
        if (n == 0) return 0;              // base case: constant work
        return n + sumTo(n - 1);           // one smaller call
    }

    public static void main(String[] args) {
        System.out.println(sumTo(5));      // 15
    }
}
```

**What it prints:** `15` (`5+4+3+2+1`). Cost: `n + 1` calls, constant work each → `O(n)` time; `n + 1` frames → `O(n)` space. *(one call per value from `n` down to 0)*

| Code shape | Complexity | One-line reason |
|---|---|---|
| `a[i] = x;` | `O(1)` | no growth with `n` |
| one `for` over `n` | `O(n)` | one pass over `n` items |
| two `for` loops in sequence | `O(n)` | add, keep the dominant term |
| `for` inside `for`, both over `n` | `O(n^2)` | nested loops multiply |
| `for (j = i; ...)` inside `for (i...)` | `O(n^2)` | `n(n+1)/2` iterations |
| `i = i * 2` / `size = size / 2` | `O(log n)` | halving gives logarithmic steps |
| `n` × `log n` | `O(n log n)` | multiply the two factors |
| `T(n) = T(n-1) + O(1)` | `O(n)` | one call per size |
| `T(n) = 2T(n/2) + O(n)` | `O(n log n)` | `log n` levels, linear work each |
| `T(n) = T(n-1) + T(n-2) + O(1)` | `O(2^n)` | the call tree branches in two per level |

**Example question:** Analyse this code and give the exact iteration count for `n = 100`:

```java
int count = 0;
for (int i = 0; i < n; i++)
    for (int j = i; j < n; j++)
        count++;
```

**Solution:**
- **Step 1 — Inner loop for a fixed `i`.** `j` runs from `i` to `n - 1` → `n - i` iterations. *(the count of integers in `[i, n-1]`)*
- **Step 2 — Sum over `i = 0 .. n-1`.** `n + (n-1) + ... + 1`. *(substitute each `i` and add)*
- **Step 3 — Arithmetic series.** `= n(n+1)/2`. *(standard sum of the first `n` integers)*
- **Step 4 — Expand.** `= n^2/2 + n/2`. *(multiply out)*
- **Step 5 — Keep the dominant term.** `O(n^2)`, with half the constant of two full loops — that half matters in tight limits. *(drop `n/2` and the factor `1/2`)*
- **Step 6 — Exact count for `n = 100`.** `100 × 101 / 2 = 5,050`. *(substitute into `n(n+1)/2`)*
**Final answer:** **`O(n^2)` time, `O(1)` space, exactly 5,050 iterations for `n = 100`.**

⚠️ **Common trap:** Seeing `j = i` and guessing `O(n log n)`. Only doubling/halving counters give a log; a triangular loop is quadratic. And `count` plus two loop variables is all the space — that part is `O(1)`.

## Formula / rule summary table

| # | Rule | Statement | Example |
|---|---|---|---|
| 1 | Big-O | `f(n) <= c . g(n)` for `n >= n0` | `5n + 3 = O(n)`, `c = 6, n0 = 3` |
| 2 | Big-Omega | `f(n) >= c . g(n)` for `n >= n0` | `3n^2 + 2n = Ω(n^2)`, `c = 3` |
| 3 | Big-Theta | `c1 g(n) <= f(n) <= c2 g(n)` | `2n + 5 = Θ(n)` |
| 4 | drop constants | `k . f(n)` → `f(n)` | `7n^2` → `n^2` |
| 5 | drop lower-order terms | keep the fastest-growing term | `n^2 + 500n` → `n^2` |
| 6 | growth ladder | `O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(n^3) < O(2^n) < O(n!)` | `n^2` beats `2^n` eventually |
| 7 | sequence | add, keep the max | `O(n) + O(n^2) = O(n^2)` |
| 8 | nesting | multiply | `n × n = n^2` |
| 9 | halving/doubling loop | `log2 n` steps | `size = size / 2` |
| 10 | arithmetic series | `1 + 2 + ... + n = n(n+1)/2` | `n = 100` → 5,050 |
| 11 | geometric series | `1 + 2 + 4 + ... + 2^k = 2^(k+1) - 1` | `1+2+4+8 = 15` |
| 12 | feasibility budget | `T(n_max) <= 10^8` for 1 s | `n = 10^5` → need `O(n log n)` |
| 13 | linear search | best 1, average `(n+1)/2`, worst `n` | `n = 1000` → 1 / 500.5 / 1000 |
| 14 | binary search | `O(log n)` | `n = 10^6` → about 20 |
| 15 | recursion cost | write `T(n)` via smaller `T` | `T(n) = T(n-1) + 1` → `O(n)` |

**Which rule when?**
- Code with loops in the question → rules 7, 8, 9, 10.
- The word "prove" → rules 1, 2, 3 (produce `c` and `n0`).
- A given `n` and a time limit → rule 12.
- A function calling itself → rule 15, then Module 2.
- "How many comparisons" → rules 13, 14.

## Solved examples

**Solved example 1 (easy) — a single loop with several statements.** Find the complexity:

```java
static int mystery(int[] a) {
    int s = 0;
    for (int i = 0; i < a.length; i++) s = s + a[i] * a[i];
    return s;
}
```

- **Step 1 — Loop.** One loop over `n = a.length`. *(body runs once per element)*
- **Step 2 — Body cost.** One read, one multiplication, one addition, one assignment → constant. *(none depend on `n`)*
- **Step 3 — Multiply.** `n × O(1) = O(n)`. *(a loop repeats its body `n` times)*
- **Step 4 — Space.** `s` and `i` → `O(1)`. *(two variables, independent of `n`)*
**Final answer:** `O(n)` time, `O(1)` extra space.

**Solved example 2 (exam level) — halving loop inside a loop, plus feasibility.**

```java
static int halvingWork(int n) {
    int total = 0;
    for (int i = 1; i <= n; i++) {          // outer: n times
        int size = n;
        while (size > 1) {                  // inner: about log2 n times
            size = size / 2;
            total++;
        }
    }
    return total;
}
```

- **Step 1 — Outer loop.** `n` iterations. *(`i` increases by 1)*
- **Step 2 — Inner loop.** `size` halves from `n` to 1 → about `log2 n` iterations. *(halving gives a logarithmic count)*
- **Step 3 — Multiply.** `n log2 n` → `O(n log n)`. *(nesting multiplies)*
- **Step 4 — Feasibility at `n = 10^6`.** `log2(10^6) ≈ 20`, so `10^6 × 20 = 2 × 10^7` operations < `10^8` budget. *(compare count with budget)*
- **Step 5 — Time.** `2 × 10^7 ÷ 10^8 = 0.2` s. *(operations ÷ rate)*
- **Step 6 — Honest caveat.** 0.2 s is comfortably inside 1 s for integer arithmetic; with objects or string building inside the inner loop the constant could triple. *(constants decide near the limit)*
**Final answer:** `O(n log n)` time, `O(1)` space; about **`2 × 10^7` operations ≈ 0.2 s at `n = 10^6` → safe**.

**Solved example 3 (exam level) — three solutions, constants matter.** A is `O(n^2)` with 2 operations per pair, B is `O(n log2 n)` with 40 operations per element, C is `O(n)` with 100 operations per element. When does C beat A?

- **Step 1 — Cost functions.** `T_A = 2n^2`, `T_B = 40 n log2 n`, `T_C = 100n`. *("operations per unit" is the constant)*
- **Step 2 — Compare C with A.** `100n < 2n^2` ⟺ `100 < 2n` ⟺ `n > 50`. *(divide both sides by `n > 0`, then by 2)*
- **Step 3 — Check the boundary.** `n = 50`: `T_A = 5000`, `T_C = 5000` — a tie. `n = 51`: `T_A = 5202`, `T_C = 5100` → C wins. *(substituting numbers confirms it)*
- **Step 4 — Where does B fit?** `40 n log2 n < 100 n` ⟺ `log2 n < 2.5` ⟺ `n < 2^2.5 ≈ 5.7`, so B beats C only for `n <= 5`. *(divide by `n`, solve the log inequality)*
- **Step 5 — Lesson.** For `n <= 50` the quadratic with the tiny constant is fastest; from `n = 51` the linear one wins forever; B is never best here despite sitting "in between". *(constants rule small `n`, classes rule large `n`)*
**Final answer:** **C beats A from `n = 51`** (tie at exactly `n = 50`).

## Common traps and mistakes

- **Confusing correctness with efficiency.** "Right but slow" is correct-but-inefficient; "fast" says nothing about correctness. Separate marks.
- **Writing `O(n/2)` or `O(2n)`.** Big-O drops constants → `O(n)`.
- **Giving a loose bound.** `n^2 = O(n^3)` is true and useless — give the tightest class. And `j = i` loops are `O(n^2)`, not `O(n log n)`.
- **Calling recursion `O(1)` space.** Depth `d` → `O(d)` frames.
- **Using `int` for sums and counts.** `n(n+1)/2` overflows a 32-bit `int` near `n = 65,000`; use `long`.
- **Estimating with `log10`.** `log10(10^6) = 6` vs `log2(10^6) ≈ 20` — a 3.3× error. **Ignoring I/O** also hurts: Reading `10^6` numbers with `Scanner` can cost a second on its own; `BufferedReader` fixes it. Algorithm complexity is not the whole running time.

## Quick revision box

- ✅ Algorithm = finite, unambiguous steps, input → output, always terminates. Two qualities: **correct** (right for *all* valid inputs) and **efficient** (cheap as `n` grows).
- ✅ Count **basic operations**, not seconds: one loop over `n` gives `T(n) = 5n + 2`. Machine speed is in the constant; growth is in the shape.
- ✅ `O` = upper bound, `Ω` = lower bound, `Θ` = both. Drop constants, drop lower-order terms, keep the dominant term.
- ✅ Ladder: `O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(n^3) < O(2^n) < O(n!)`.
- ✅ At `10^8` ops/s with `n = 10^6`: `O(n)` → 0.01 s, `O(n log n)` → 0.2 s, `O(n^2)` → 2.8 hours; `O(2^n)` dies around `n = 30`.
- ✅ Space = **auxiliary** space: one array `O(n)`, a 2-D table `O(n^2)`, recursion depth `d` → `O(d)` frames.
- ✅ Best/average/worst are about the *input*, not the code. Quote the **worst case** — it is the only guarantee and needs no distribution assumption.
- ✅ The habit: **brute force → analyse → optimise the specific waste**. Read `n` from the statement and pick the complexity before coding.

## Practice questions

1. For `T(n) = 6n^3 + 20n^2 + 300`, give the `Θ(...)` class and say which terms you dropped and why.
2. Find the time complexity:
   ```java
   for (int i = 0; i < n; i++)
       for (int j = 0; j < 1000; j++)
           work();
   ```
3. An `O(n^2)` algorithm runs on `n = 2000` at `10^8` operations per second. Does it finish inside 1 second? Show the arithmetic.
4. Prove `2n^2 + 7n = O(n^2)` by giving `c` and `n0`. Is it also `Θ(n^2)`?
5. Give best, average and worst comparison counts for linear search over `n = 500` distinct elements (target present once, uniform position).
6. `10^6` range-sum queries on an array of `10^5` ints: compare brute force and prefix sums in operations, time at `10^8` ops/s, and extra memory in MB.

## Answers

**1.** `Θ(n^3)`. Keep `6n^3`; `20n^2` and `300` grow slower and are swamped for large `n`, and the constant 6 is dropped. *(Key step: `20n^2 <= 2n^3` for `n >= 10` and `300 <= n^3` for `n >= 7`, so `6n^3 + ... <= 9n^3` for `n >= 10`, while the expression is `>= 6n^3`; hence `c1 = 6, c2 = 9, n0 = 10`.)*

**2.** `O(n)`. The inner loop is a fixed 1000 iterations whatever `n` is, so it is `O(1)` with a large constant: `n × 1000` → `O(n)`. *(Key step: a constant-bounded inner loop does not change the class.)*

**3.** `2000^2 = 4 × 10^6` operations; `4 × 10^6 ÷ 10^8 = 0.04` s. **Yes**, well inside 1 s. *(Key step: compare `4 × 10^6` with the `10^8` budget.)*

**4.** `7n <= 7n^2` for `n >= 1`, so `2n^2 + 7n <= 9n^2` → **`c = 9, n0 = 1`** (also `c = 3, n0 = 7`). It **is** `Θ(n^2)` because `2n^2 + 7n >= 2n^2` gives `Ω(n^2)` with `c1 = 2`. *(Key step: bound each term by a multiple of `n^2`, then add.)*

**5.** Best **1**, average `(500+1)/2 = 250.5`, worst **500**. *(Key step: average = `n(n+1)/2 ÷ n = (n+1)/2`.)*

**6.** Brute: `10^6 × 10^5 = 10^11` operations → `10^11 ÷ 10^8 = 1000` s, space `O(1)`. Prefix: build `10^5` + queries `10^6` = `1.1 × 10^6` operations → 0.011 s, space `10^5 × 4 bytes = 400,000 bytes ≈ 0.4 MB`. Prefix sums win by ~90,000× for 0.4 MB. *(Key step: `O(1)` per query after one `O(n)` build.)*
