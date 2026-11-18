# DSA-1 – Module 4
## Searching & Binary Search
*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture
Searching means "find this thing in that collection". The dumb way is to look at every item until you find it — **linear search**, `O(n)`. The clever way only works if the data is **sorted**: open the middle, throw away the half that cannot contain the answer, repeat — **binary search**, `O(log n)`.

That gap is enormous. For one million items linear search needs up to 1,000,000 looks; binary search needs about 20. The catch is that the data must be ordered, which is why sorting (M5) and searching are a pair.

The best analogy is the **number-guessing game**: "I am thinking of a number between 1 and 100, and I will say higher or lower." You say 50, then 25 or 75, and you always win within 7 guesses, because each guess halves the possibilities. Binary search is exactly that game played on an array.

The module has two halves. The first half is the *mechanics*: how binary search works, why it is so easy to write a broken one, and its standard variants (first/last occurrence, lower/upper bound, rotated arrays). The second half is the *idea that surprises people*: if a **yes/no question about a number** flips from "no" to "yes" exactly once as the number grows, you can binary search the **answer itself** — no sorted array needed. That trick solves "minimum ship capacity", "minimum eating speed", "split array largest sum" and dozens more interview classics.

## Basics you must know first
- **Sorted order** — `a[0] <= a[1] <= ... <= a[n-1]`. Binary search is *only* correct on sorted data.
- **`O(log n)`** — each step throws away a constant fraction of the work. `log2(1024) = 10`, because `2^10 = 1024`.
- **Loop invariant** — a statement that is true before and after every loop iteration; it is how you *prove* binary search right instead of hoping.
- **Half-open interval `[lo, hi)`** — includes `lo`, excludes `hi`. Writing `[lo, hi]` (closed) versus `[lo, hi)` changes every comparison in the code, and mixing them is the number one source of bugs.
- **Monotonic** — "never goes back". A predicate `can(x)` is monotonic if, once it becomes true, it stays true for all larger `x` (or once false, stays false).
- **Integer division in Java** — `7 / 2` is `3` (it truncates toward zero); `-7 / 2` is `-3`. Keep indices non-negative and this never bites.

## 4.1 The searching problem

### Intuition
You are looking for "Rohan" in an **attendance register with no alphabetical order**. You have no choice: first page, second page, ... until you find him. That is linear search. Its only virtue is that it works on *any* arrangement of data, sorted or not.

### The idea, step by step
**1. Walk and compare.** Start at index 0; if `a[i] == target`, return `i`; otherwise move to `i+1`. If you reach the end, the target is not there — return `-1` (a value that can never be a valid index).

```java
public class LinearSearch {
    public static void main(String[] args) {
        int[] a = {7, 3, 9, 1, 5, 11, 4, 8};   // not sorted, does not matter
        int target = 5;
        int found = -1, checks = 0;
        for (int i = 0; i < a.length; i++) {
            checks++;
            if (a[i] == target) { found = i; break; }   // stop at the first match
        }
        System.out.println("index = " + found + ", checks = " + checks);
    }
}
```

**2. Dry run.** `a = {7, 3, 9, 1, 5, 11, 4, 8}`, `target = 5`:

| Step | Variables | What changed |
|---|---|---|
| 1 | `i=0`, `a[0]=7` | not 5, `i++` |
| 2 | `i=1`, `a[1]=3` | not 5, `i++` |
| 3 | `i=2`, `a[2]=9` | not 5, `i++` |
| 4 | `i=3`, `a[3]=1` | not 5, `i++` |
| 5 | `i=4`, `a[4]=5` | match → `found=4`, break |

Prints `index = 4, checks = 5`.

**3. Read off the cost.** Best case: the target is at index 0 → 1 comparison, `O(1)`. Worst case: last index or absent → `n` comparisons, `O(n)`. Average over a random hit: `(n+1)/2` comparisons, still `O(n)`. Space is `O(1)` — you only keep an index.

**4. When it is actually the right tool.** Unsorted data searched once; tiny arrays (`n < 50`, where the sort would cost more than the scan); a linked list, where you cannot jump to the middle at all.

### Formula / rule / table
```text
best case    = 1 comparison
worst case   = n comparisons        -> O(n) time
average case = (n + 1) / 2          -> O(n) time
space        = O(1)
```
**Meaning:** `n` = number of elements. **When to use:** unsorted data, or a single search where sorting is not worth it. **Tiny example:** `n = 8`, target at index 4 → 5 comparisons.

**Example question:** An array of `n = 10` elements contains the target. How many comparisons does linear search make if the target sits at index 7 (0-based)? How many if it is absent? Give the worst case and the average case in Big-O, with a reason each.

**Solution:**
- **Step 1.** Indices 0..7 are examined, so `7 + 1 = 8` comparisons. Reason: one comparison per index up to and including the match.
- **Step 2.** If absent, every index is examined → `10` comparisons. Reason: the loop must reach the end to prove absence.
- **Step 3.** Worst case `O(n)`: with `n` elements the loop runs at most `n` times. Reason: one comparison per element.
- **Step 4.** Average `(n+1)/2 = 5.5` comparisons → `O(n)`. Reason: `n/2` is still proportional to `n`; constants are dropped.
- **Step 5.** Space `O(1)`: only the index `i` and the answer are stored.

**Final answer:** 8 comparisons when the target is at index 7, 10 when absent; worst case `O(n)`, average `O(n)`, space `O(1)`.

⚠️ **Common trap:** returning `0` for "not found" — index 0 is a *valid* index. Always return `-1` (or use a boolean flag), otherwise the caller cannot tell "found at the start" from "not there". Second trap: `break`-ing out of the loop and then printing the loop variable `i`, which is `n` when nothing matched.

## 4.2 Binary search on a sorted array

### Intuition
The **guessing game**: "think of a number 1–100". You say 50; if the answer is higher, the whole range 1–50 is dead. One guess, half the world gone. Twenty guesses handle a million numbers, because `2^20` is about a million. Binary search is that game, where each guess is "look at the middle element".

### The idea, step by step
**1. The rule.** Look at the middle element. If it is the target, done. If it is **smaller** than the target, the target must be to the right, so move `lo` up. If it is **bigger**, the target must be to the left, so move `hi` down.

**2. Why sorted order is the whole trick.** In an unsorted array, `a[mid] < target` tells you *nothing* about the left or right half — the target could be anywhere. Sortedness is what turns one comparison into "half the array is eliminated".

**3. Dry run on a 16-element array.** `a = {0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30}` (so `a[i] = 2i`), `target = 26`:

| Step | `lo` | `hi` | `mid` | `a[mid]` | Action | Search space left |
|---|---|---|---|---|---|---|
| 1 | 0 | 15 | 7 | 14 | `14 < 26` → `lo = 8` | 8 |
| 2 | 8 | 15 | 11 | 22 | `22 < 26` → `lo = 12` | 4 |
| 3 | 12 | 15 | 13 | 26 | equal → found at index 13 | 4 → done |

Found in 3 steps. The halving of the search space looks like this in the worst case:

| Comparison | Search space | Why |
|---|---|---|
| 1 | 16 | start |
| 2 | 8 | one half discarded |
| 3 | 4 | one half discarded |
| 4 | 2 | one half discarded |
| 5 | 1 | one half discarded |
| — | 0 | space empty → stop |

So at most **5** comparisons for 16 elements, and `log2(16) = 4`, which is why we write `O(log n)`.

**4. Code (template 1 — closed interval `[lo, hi]`).**

```java
public class BinarySearch {
    public static void main(String[] args) {
        int[] a = {0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30};
        System.out.println(search(a, 26));   // 13
        System.out.println(search(a, 7));    // -1  (absent)
        System.out.println(search(a, 0));    // 0   (first element)
        System.out.println(search(a, 30));   // 15  (last element)
    }

    static int search(int[] a, int target) {
        int lo = 0, hi = a.length - 1;            // closed range [lo, hi]
        while (lo <= hi) {                        // while the range is non-empty
            int mid = lo + (hi - lo) / 2;         // middle, overflow-safe
            if (a[mid] == target) return mid;
            else if (a[mid] < target) lo = mid + 1;  // answer is strictly right
            else hi = mid - 1;                    // answer is strictly left
        }
        return -1;                                // range became empty
    }
}
```

Prints `13`, `-1`, `0`, `15`.

**5. Cost.** Each iteration halves the range: `n → n/2 → n/4 → ... → 1`, which takes `log2(n)` steps, so time is `O(log n)` — one comparison per halving. Space is `O(1)` (iterative; a recursive version would use `O(log n)` stack).

**6. How much better is it?** `n = 10^9`: linear search ≈ `10^9` comparisons; binary search ≈ `30` (`2^30 ≈ 1.07×10^9`). That is the difference between "a second" and "instantly".

### Formula / rule / table
```text
steps to shrink n to 1   = log2(n)
worst-case comparisons   = floor(log2(n)) + 1
```
**Meaning:** `n` = array length; `floor(log2 n)` counts halvings to reach 1, plus one for the final check. **When to use:** sorted array, random access (arrays, not linked lists). **Tiny example:** `n = 16` → `floor(4) + 1 = 5` comparisons.

| `n` | linear worst case | binary worst case |
|---|---|---|
| 16 | 16 | 5 |
| 1,024 | 1,024 | 11 |
| 1,000,000 | 1,000,000 | 20 |
| 1,000,000,000 | 1,000,000,000 | 30 |

**Example question:** A sorted array has 1024 elements. (a) What is the maximum number of comparisons binary search needs? (b) What is the maximum number of iterations? (c) State the complexity with a reason.

**Solution:**
- **Step 1.** `log2(1024) = 10` because `2^10 = 1024`. Reason: each step halves the search space.
- **Step 2.** Worst case comparisons = `floor(log2 1024) + 1 = 10 + 1 = 11`. Reason: 10 halvings to get down to 1 element, plus the final comparison.
- **Step 3.** Iterations = 11 (each iteration makes exactly one comparison). Reason: the loop body compares once and then shrinks the range.
- **Step 4.** Time `O(log n)`: the range sizes are `1024, 512, 256, ..., 1`, i.e. a geometric decrease, so the number of steps grows like `log2 n`.

**Final answer:** (a) 11 comparisons (b) 11 iterations (c) `O(log n)` because the search space halves every iteration; space `O(1)`.

⚠️ **Common trap:** running binary search on **unsorted** data. It does not error — it just returns a wrong answer, which is worse. Also do not forget the array must allow **random access**: binary search on a linked list is pointless (`O(n)` just to reach the middle), so linear search is the honest choice there.

## 4.3 Getting binary search right

### Intuition
Binary search is famous for being "easy to understand, hard to write correctly" — the first published version (1946) had a bug that survived for years. The reason is that it has **three moving parts** that must agree: the interval type (closed or half-open), the loop condition, and how `mid` is updated. Mix any two and you get an infinite loop or a missed element. The fix is to stop guessing and write down the **loop invariant**: "if the target exists, it is inside `[lo, hi]`".

### The idea, step by step
**1. Write the invariant first.** For the closed version: *before every iteration, the target (if present) lies in `a[lo..hi]`, and everything outside is known not to be the target.*

**2. Derive the updates from the invariant.**
- If `a[mid] < target`, then `a[lo..mid]` cannot contain the target, so `lo = mid + 1`. This keeps the invariant true.
- If `a[mid] > target`, then `a[mid..hi]` cannot contain it, so `hi = mid - 1`.
- If `lo <= hi` becomes false, the range is empty, so the target is absent.

**3. Why `mid = (lo + hi) / 2` can be wrong.** `lo` and `hi` are `int`s. If both are near `2^31 - 1`, their sum overflows and becomes negative, so `mid` comes out negative and `a[mid]` throws `ArrayIndexOutOfBoundsException`. Fix: `mid = lo + (hi - lo) / 2`, which never exceeds `hi`.

```java
int lo = 2_000_000_000, hi = 2_100_000_000;
int bad  = (lo + hi) / 2;              // 4.1e9 overflows int -> negative garbage
int good = lo + (hi - lo) / 2;         // 2_050_000_000, correct
```

**4. `lo <= hi` versus `lo < hi`.** They belong to *different* interval conventions, and mixing them is the classic bug:

| Convention | Initial `hi` | Loop | Update on `a[mid] > target` | Meaning of `lo` at the end |
|---|---|---|---|---|
| Closed `[lo, hi]` | `n - 1` | `lo <= hi` | `hi = mid - 1` | not meaningful |
| Half-open `[lo, hi)` | `n` | `lo < hi` | `hi = mid` | first index that satisfies the test |

**5. The infinite-loop trap.** In the half-open version, writing `lo = mid` (instead of `mid + 1`) leaves `lo` unchanged whenever `hi = lo + 1`, and the loop spins forever. Rule: **one of the two updates must strictly shrink the range.**

**6. Test with the nasty cases.** Empty array (`n = 0`), one element that matches, one element that does not, target smaller than everything, target larger than everything, all duplicates. If your code survives those six, it is probably right.

### Formula / rule / table
```text
closed:     hi = n - 1, while (lo <= hi), lo = mid + 1, hi = mid - 1
half-open:  hi = n,     while (lo < hi), lo = mid + 1, hi = mid
mid = lo + (hi - lo) / 2          // always, to avoid overflow
```
**Meaning:** `lo`, `hi` bound the live range; `mid` is the probed index. **When to use:** pick one convention per function and never mix. **Tiny example:** `n = 1`, target present: closed → `lo=hi=0`, one iteration, found.

**Example question:** An `int` array has indices up to `2^31 - 1`. A student writes `int mid = (lo + hi) / 2;` with `lo = 2_000_000_000` and `hi = 2_100_000_000`. (a) What goes wrong, numerically? (b) What is the correct `mid`? (c) Why does `lo + (hi - lo) / 2` never overflow?

**Solution:**
- **Step 1.** `lo + hi = 4_100_000_000`, but `int` holds at most `2_147_483_647`. Reason: 32-bit signed range.
- **Step 2.** The sum wraps around to `4_100_000_000 - 2^32 = -194_967_296`. Reason: two's-complement overflow.
- **Step 3.** Dividing gives `mid ≈ -97_483_648`, a negative index → `ArrayIndexOutOfBoundsException`. Reason: Java indices must be `>= 0`.
- **Step 4.** Correct value: `lo + (hi - lo)/2 = 2_000_000_000 + 100_000_000/2 = 2_050_000_000`. Reason: the true midpoint.
- **Step 5.** `hi - lo` is at most `n - 1`, which fits in `int` for any real array, and `lo + (hi-lo)/2 <= hi`, so no overflow. Reason: the intermediate stays inside `[lo, hi]`.

**Final answer:** (a) `lo + hi` overflows `int` and `mid` becomes negative (b) `2_050_000_000` (c) because it only adds half of a difference that is already `<= hi`.

⚠️ **Common trap:** mixing conventions — `hi = a.length - 1` with `while (lo < hi)` misses the last element, while `hi = a.length` with `lo <= hi` reads `a[n]` and crashes. Pick a template, memorise it, and write the invariant as a comment above the loop; that single habit prevents most binary-search bugs.

## 4.4 Variants

### Intuition
Plain binary search answers "is it here, and where?". Real questions are fussier: "**first** place it appears", "**last** place", "how many times", "where would I insert it", "the array was sorted but then rotated". All of them are the same halving idea with one changed comparison — and the trick is to keep a *half-open* interval so the answer index is simply `lo` when the loop ends.

### The idea, step by step
**1. Lower bound = first index with `a[i] >= target`.** Shrink towards the left even when you find an equal value, because an earlier copy may exist.

```java
static int lowerBound(int[] a, int target) {
    int lo = 0, hi = a.length;                  // half-open [lo, hi)
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < target) lo = mid + 1;      // mid too small: answer is to the right
        else hi = mid;                          // mid may be the answer: keep it in range
    }
    return lo;                                  // first index with a[index] >= target
}
```

**2. Upper bound = first index with `a[i] > target`.** Identical except `<=`:

```java
static int upperBound(int[] a, int target) {
    int lo = 0, hi = a.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] <= target) lo = mid + 1;     // equal is still "too small" here
        else hi = mid;
    }
    return lo;                                  // first index with a[index] > target
}
```

**3. Dry run.** `a = {1, 2, 2, 2, 5, 7}`, `target = 2`:

| Call | `lo` walk | Result | Meaning |
|---|---|---|---|
| `lowerBound(a, 2)` | 0→1 | 1 | first `2` is at index 1 |
| `upperBound(a, 2)` | 0→4 | 4 | first element `> 2` is `5` at index 4 |
| `upperBound - lowerBound` | — | `4 - 1 = 3` | the value `2` occurs 3 times |

For a value that is absent, e.g. `4`: `lowerBound = 4` and `upperBound = 4`, so the count is `0` — the difference trick needs no special case.

**4. First and last occurrence, built from the bounds.** First occurrence = `lowerBound(a, x)` (and check `a[that] == x`). Last occurrence = `upperBound(a, x) - 1`. On `{5, 7, 7, 8, 8, 10}` with `x = 8`: `lowerBound = 3`, `upperBound = 5`, so first = 3, last = 4. For `x = 6` both are 1, and `a[1] = 7 != 6`, so `6` is absent.

**5. Search in a rotated sorted array.** `{4, 5, 6, 7, 0, 1, 2}` is a sorted array rotated. It is not sorted, but **one of the two halves is always sorted**. Check which half `mid` belongs to, and whether the target lies inside that sorted half.

```java
public class RotatedSearch {
    public static void main(String[] args) {
        int[] a = {4, 5, 6, 7, 0, 1, 2};
        System.out.println(search(a, 0));   // 4
        System.out.println(search(a, 3));   // -1
    }

    static int search(int[] a, int target) {
        int lo = 0, hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == target) return mid;
            if (a[lo] <= a[mid]) {                       // left half is sorted
                if (a[lo] <= target && target < a[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {                                     // right half is sorted
                if (a[mid] < target && target <= a[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
}
```

Prints `4` then `-1`. Trace for `target = 0`: `lo=0, hi=6, mid=3` (`7`), left half `4..7` is sorted and `0` is not in `[4, 7)`, so `lo=4`; `lo=4, hi=6, mid=5` (`1`), left half `0..1` is sorted and `0` is in `[0, 1)`, so `hi=4`; `lo=4, hi=4, mid=4` → `a[4] = 0`, found.

### Formula / rule / table
| Variant | Test inside the loop | Returns | Cost |
|---|---|---|---|
| Exact match (template 1) | `==` / `<` / `>` | index or `-1` | `O(log n)` |
| Lower bound | `a[mid] < target` | first index `>= target` | `O(log n)` |
| Upper bound | `a[mid] <= target` | first index `> target` | `O(log n)` |
| Count of a value | both bounds | `upper - lower` | `O(log n)` |
| First / last occurrence | bounds | `lower`, `upper - 1` | `O(log n)` |
| Rotated sorted array | which half is sorted | index or `-1` | `O(log n)` |
| Insert position | lower bound | `lo` | `O(log n)` |

**Example question:** `a = {1, 2, 2, 2, 5, 7}`. (a) Give `lowerBound(a, 2)` and `upperBound(a, 2)` and the number of occurrences of 2. (b) Give `lowerBound(a, 4)`. (c) Using `{5, 7, 7, 8, 8, 10}`, give the first and last index of 8. (d) Where would 6 be inserted into `{1, 3, 5, 7}`?

**Solution:**
- **Step 1.** `lowerBound(a, 2) = 1`: index 0 holds `1 < 2`, so the first `2` is at 1. Reason: the loop keeps `hi = mid` on equality.
- **Step 2.** `upperBound(a, 2) = 4`: indices 1..3 hold `2`, and index 4 holds `5 > 2`. Reason: equality counts as "too small" for the upper bound.
- **Step 3.** Occurrences `= 4 - 1 = 3`. Reason: all copies of `2` sit in `[1, 4)`.
- **Step 4.** `lowerBound(a, 4) = 4` — the first element `>= 4` is `5` at index 4; `upperBound(a, 4)` is also 4, so `4` is absent. Reason: the two bounds coincide for absent values.
- **Step 5.** For `{5,7,7,8,8,10}` and 8: `lowerBound = 3`, `upperBound = 5` → first index **3**, last index **4**.
- **Step 6.** For `{1,3,5,7}` and 6: `lowerBound = 3` (first element `>= 6` is `7`), so 6 is inserted at index **3**, giving `{1,3,5,6,7}`. Reason: insert position is exactly the lower bound.
- **Step 7.** Each call is `O(log n)` — the range halves every iteration; space `O(1)`.

**Final answer:** (a) 1 and 4, so 3 occurrences (b) 4, absent (c) first 3, last 4 (d) index 3.

⚠️ **Common trap:** using plain binary search for "first occurrence" and returning whichever copy you land on — with duplicates the middle hit is usually *not* the first. Second trap: reading `a[lowerBound(a, x)]` without checking the index is `< n` and that `a[index] == x`; for an absent value the lower bound can equal `n`, which crashes.

## 4.5 Binary-search-on-the-answer

### Intuition
Here is the leap. So far we binary-searched a **sorted array**. But suppose you must find the **smallest ship capacity** that can carry all parcels in 5 days. There is no array to search — yet the *answers* behave exactly like a sorted list. Capacity 10 needs 7 days (fails), 12 needs 6 (fails), 15 needs 5 (works), 20 needs 4 (works), 55 needs 1 (works). Once a capacity works, every bigger capacity also works. So "does capacity `c` work?" is a **yes/no question that flips once**, and you can binary search the *number line* of capacities instead of an array.

The recipe: (1) the answer is an integer in a known range `[lo, hi]`; (2) a helper `can(x)` says whether `x` is good enough; (3) `can` is **monotonic** — false, false, ..., false, true, true, ... ; (4) binary search for the first `true`.

### The idea, step by step
**1. Bound the answer.** `lo` must be a value that *might* fail (or the smallest legal value), `hi` a value that definitely works. For the ship problem: `lo = max(weights)` (a ship smaller than the heaviest parcel can never work) and `hi = sum(weights)` (one trip carries everything).

**2. Write `can(x)` as a simple greedy check.** Fill the ship until the next parcel would overflow, then start a new day. `O(n)` per check.

**3. Binary search the smallest `x` with `can(x) == true`.** This is the lower-bound template, applied to values rather than indices.

```java
public class ShipCapacity {
    public static void main(String[] args) {
        int[] w = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        System.out.println(minCapacity(w, 5));   // 15
    }

    // Can we ship everything within `days` using a ship of this capacity?
    static boolean canShip(int[] w, int capacity, int days) {
        int daysUsed = 1, load = 0;
        for (int x : w) {
            if (load + x > capacity) {   // this parcel does not fit: sail today
                daysUsed++;
                load = x;                // start the next day with this parcel
            } else {
                load += x;
            }
        }
        return daysUsed <= days;
    }

    static int minCapacity(int[] w, int days) {
        int lo = 0, hi = 0;
        for (int x : w) { lo = Math.max(lo, x); hi += x; }   // answer lies in [max, sum]
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (canShip(w, mid, days)) hi = mid;   // works: try smaller
            else lo = mid + 1;                     // fails: must go bigger
        }
        return lo;                                 // smallest capacity that works
    }
}
```

Prints `15`.

**4. Dry run of the feasibility table** (`w = {1..10}`, `days = 5`):

| Capacity | Days needed | Fits in 5 days? |
|---|---|---|
| 10 | 7 | no |
| 12 | 6 | no |
| 14 | 6 | no |
| 15 | 5 | **yes** ← answer |
| 16 | 5 | yes |
| 20 | 4 | yes |
| 25 | 3 | yes |
| 55 | 1 | yes |

The column of yes/no flips exactly once, from `no` to `yes`, between 14 and 15. That single flip is what makes binary search legal.

**5. The same skeleton solves three classic problems.** Only `can(x)` changes:

| Problem | `lo` | `hi` | `can(x)` means |
|---|---|---|---|
| Minimum ship capacity in `d` days | `max(w)` | `sum(w)` | days needed with capacity `x` is `<= d` |
| Minimum eating speed in `h` hours | `1` | `max(piles)` | total hours at speed `x` is `<= h` |
| Split array into `k` parts, minimise largest sum | `max(a)` | `sum(a)` | parts needed with limit `x` is `<= k` |
| Integer square root of `n` | `0` | `n` | `x*x <= n` |
| First bad version | `1` | `n` | version `x` is bad |

**6. Cost.** `can(x)` is `O(n)` and the search runs `O(log(sum))` times, so total `O(n log(sum))` — versus `O(n · sum)` for trying every capacity. For `n = 10^5` and `sum = 10^9`: about `10^5 × 30 = 3×10^6` operations instead of `10^14`.

**7. Eating speed, worked.** `piles = {3, 6, 7, 11}`, `h = 8` hours. Hours at speed `x` = `sum of ceil(pile / x)`. At `x = 4`: `ceil(3/4)=1`, `ceil(6/4)=2`, `ceil(7/4)=2`, `ceil(11/4)=3` → `1+2+2+3 = 8 <= 8` ✓. At `x = 3`: `1+2+3+4 = 10 > 8` ✗. So the answer is **4**. (In Java, `ceil(a/b)` for positive ints is `(a + b - 1) / b`.)

### Formula / rule / table
```text
answer = smallest x in [lo, hi] with can(x) == true
can monotonic:  can(x) true  ->  can(x+1) true
cost = O(n) per check * O(log(hi - lo)) checks = O(n log(range))
```
**Meaning:** `lo`, `hi` bound the possible answer; `can(x)` is a `O(n)` greedy feasibility test. **When to use:** "minimum / maximum value such that a condition holds", with a monotone condition. **Tiny example:** ship capacities 14 (fails) and 15 (works) → answer 15.

**Example question:** `piles = {30, 11, 23, 4, 20}` and `h = 6` hours. Find the minimum eating speed `k` (piles per hour, integer, one pile per hour at most) using binary search on the answer. Show the feasibility checks.

**Solution:**
- **Step 1.** Range: `lo = 1`, `hi = max(piles) = 30`. Reason: speed 1 is the slowest possible and 30 finishes each pile in one hour.
- **Step 2.** `mid = 15`: hours = `2 + 1 + 2 + 1 + 2 = 8 > 6` → fails, so `lo = 16`. Reason: too slow, need faster.
- **Step 3.** `mid = 23`: hours = `2 + 1 + 1 + 1 + 1 = 6 <= 6` → works, so `hi = 23`. Reason: feasible, try smaller.
- **Step 4.** `mid = 19`: hours = `2 + 1 + 2 + 1 + 2 = 8 > 6` → fails, `lo = 20`.
- **Step 5.** `mid = 21`: hours = `2 + 1 + 2 + 1 + 1 = 7 > 6` → fails, `lo = 22`.
- **Step 6.** `mid = 22`: hours = `2 + 1 + 2 + 1 + 1 = 7 > 6` → fails, `lo = 23`. Now `lo == hi = 23`.
- **Step 7.** Check 23 by hand: `ceil(30/23)=2`, `ceil(11/23)=1`, `ceil(23/23)=1`, `ceil(4/23)=1`, `ceil(20/23)=1` → 6 hours, exactly the limit. ✅
- **Step 8.** Cost: about `log2(30) ≈ 5` checks, each `O(n) = O(5)` → `O(n log max)`.

**Final answer:** minimum speed **23** piles/hour. (With `h = 5` the same method gives 30, because 23 would need 6 hours.)

⚠️ **Common trap:** a wrong `lo`. For the ship problem `lo` must be `max(weights)` — starting at 0 or 1 is not *wrong* but wastes checks and can even return an infeasible answer if the check never validates it. Worse: using `lo = 0` in a "minimum speed" search where speed 0 would divide by zero. Second trap: forgetting that `can` must be **monotonic**; if it is not, binary search returns nonsense confidently.

## 4.6 Recognising binary-search-on-the-answer problems

### Intuition
You do not need a sorted array — you need a **monotone yes/no question**. Think of a light dimmer marked 1 to 100: "is it bright enough to read?" is false for small settings and true from some point onwards. Finding that point is binary search, and the "settings" can be capacities, speeds, sizes, days, distances or prices.

### The idea, step by step
**1. Spot the words.** "Minimum capacity / speed / size / time such that ...", "maximum value that still satisfies ...", "minimise the largest ...", "maximise the smallest ...". These are all "find the boundary" questions.

**2. Ask the two magic questions.** (a) *Is the answer an integer in a bounded range?* (b) *If `x` works, does every larger `x` also work (or every smaller)?* Two yeses → binary search the answer.

**3. Run the `can(x)` monotonic test.** Write `can(x)` for a few values and look at the pattern: `false, false, false, true, true`. If you ever see `true, false, true`, the predicate is not monotone and the pattern does not apply.

**4. Bound the range honestly.** `lo` = smallest value that could possibly be legal, `hi` = a value you *know* works (often `sum`, `max`, or `n`). Getting `hi` wrong is the usual source of "off by one" answers.

**5. Distinguish from plain binary search.** Plain: the array is sorted, you search *indices*, and the answer is an element. On the answer: nothing is sorted, you search *values*, and the answer is a number you computed.

### Formula / rule / table
| Signal | On-the-answer? | Why |
|---|---|---|
| "smallest capacity that can ship in `d` days" | yes | feasibility is monotone in capacity |
| "minimum speed to finish in `h` hours" | yes | faster never needs more hours |
| "split into `k` parts, minimise the largest sum" | yes | a bigger allowed sum never needs more parts |
| "find target in a sorted array" | no | that is plain binary search on indices |
| "find the maximum element" | no | not monotone; a single scan is `O(n)` |
| "count elements greater than x" | no (unless sorted) | needs data structure work, not a boundary |

**Example question:** For each, say whether binary-search-on-the-answer applies and why. (a) "Smallest ship capacity to ship all parcels within 5 days." (b) "Minimum number of days to ship all parcels with a fixed capacity." (c) "Largest element in an unsorted array." (d) "Split `{7,2,5,10,8}` into 2 parts minimising the largest part sum."

**Solution:**
- **(a) Yes.** Reason: if capacity `c` works, any `c' > c` also works — the predicate is monotone.
- **(b) No, not in this form.** Reason: with a *fixed* capacity the days are already determined; there is nothing to search — just simulate once, `O(n)`.
- **(c) No.** Reason: no monotone yes/no question here; one pass finds the max in `O(n)`, which is already optimal.
- **(d) Yes.** Reason: with allowed sum `x`, the number of parts needed never increases as `x` grows, so "parts needed `<= 2`" is monotone; the answer is 18.

**Final answer:** (a) yes (b) no, direct simulation (c) no, `O(n)` scan (d) yes, answer 18.

⚠️ **Common trap:** applying the pattern when the predicate is not monotone (e.g. "find a subset with sum exactly `k`" — subsets jump around, no boundary exists). Also, "minimise the maximum" and "maximise the minimum" *sound* similar but need opposite directions of the check: for one you search the smallest feasible limit, for the other the largest feasible limit. Write down which direction flips before coding.

## 4.7 Searching in 2-D / structured data

### Intuition
A **row-and-column sorted matrix** — every row is sorted left to right, every column sorted top to bottom — is like a city grid where prices only rise as you go right or down. Start at the **top-right corner**: it is the largest value in its row and the smallest in its column, so each comparison tells you to walk **left** (too big) or **down** (too small). One path, `O(m + n)` steps, no backtracking.

### The idea, step by step
**1. The matrix.** `M[0][0]` is the smallest, `M[m-1][n-1]` the largest, rows ascending, columns ascending.

**2. The staircase walk.** `r = 0`, `c = n - 1` (top-right). While inside the grid: if `M[r][c] == target`, found; if `M[r][c] > target`, then the whole column `c` from row `r` downwards is too big, so `c--`; if `M[r][c] < target`, then the whole row `r` to the left is too small, so `r++`.

**3. Dry run.** `M = {{1,4,7,11,15},{2,5,8,12,19},{3,6,9,16,22},{10,13,14,17,24},{18,21,23,26,30}}`, `target = 5`:

| Step | `r` | `c` | `M[r][c]` | Action |
|---|---|---|---|---|
| 1 | 0 | 4 | 15 | `15 > 5` → `c--` |
| 2 | 0 | 3 | 11 | `11 > 5` → `c--` |
| 3 | 0 | 2 | 7 | `7 > 5` → `c--` |
| 4 | 0 | 1 | 4 | `4 < 5` → `r++` |
| 5 | 1 | 1 | 5 | equal → found at (1,1) |

`target = 20` ends with `r = 5`, i.e. off the bottom → not present. So does `target = 31`.

**4. Code.**

```java
public class MatrixSearch {
    public static void main(String[] args) {
        int[][] m = {{1, 4, 7, 11, 15}, {2, 5, 8, 12, 19}, {3, 6, 9, 16, 22},
                     {10, 13, 14, 17, 24}, {18, 21, 23, 26, 30}};
        System.out.println(find(m, 5));    // true
        System.out.println(find(m, 20));   // false
    }

    static boolean find(int[][] m, int target) {
        int r = 0, c = m[0].length - 1;                 // start at the top-right corner
        while (r < m.length && c >= 0) {
            if (m[r][c] == target) return true;
            else if (m[r][c] > target) c--;             // this column is too big
            else r++;                                   // this row is too small
        }
        return false;
    }
}
```

Prints `true` then `false`.

**5. Cost.** Each step moves `r` down or `c` left, and there are at most `m + n` such moves, so `O(m + n)` time and `O(1)` space. Compare with checking every cell: `O(m·n)` — for a 1000×1000 matrix that is 1,000,000 versus 2,000 steps.

**6. Other 2-D shapes.** If **every row is sorted but columns are not**, binary search each row: `O(m log n)`. If the matrix is **fully sorted in row-major order** (each row starts where the previous ended), treat it as one flat array of `m·n` elements and binary search using `mid / n` and `mid % n` — `O(log(m·n))`.

### Formula / rule / table
| Matrix shape | Method | Cost |
|---|---|---|
| Rows sorted, columns sorted | staircase from top-right | `O(m + n)` |
| Each row sorted, columns not | binary search per row | `O(m log n)` |
| Fully sorted row-major | binary search on `m·n` cells | `O(log(m·n))` |
| Nothing sorted | scan everything | `O(m·n)` |

**Example question:** In the 5×5 matrix above, trace the staircase search for `target = 30` and state how many steps it takes. Then say why starting at the top-**left** corner does not work.

**Solution:**
- **Step 1.** Start `(0,4) = 15 < 30` → `r++`. Reason: the whole row 0 is smaller than 30.
- **Step 2.** `(1,4) = 19 < 30` → `r++`; `(2,4) = 22 < 30` → `r++`; `(3,4) = 24 < 30` → `r++`.
- **Step 3.** `(4,4) = 30` → found. Reason: equality.
- **Step 4.** Total steps = 5 (four `r++` moves then the match). Bound is `m + n - 1 = 9`, so we are inside it.
- **Step 5.** From the top-left, `M[0][0] = 1 < 30` tells you nothing: the target could be right or down, so you would have to branch — that is `O(m·n)`, not a staircase.

**Final answer:** found at `(4,4)` in 5 steps; the top-left corner gives no single direction to move, so the elimination argument fails.

⚠️ **Common trap:** using the staircase method when only *one* of the two sortedness conditions holds. If rows are sorted but columns are not, "the column below is too big" is false and the search can walk past the answer. Always check both properties first.

## 4.8 Comparing search strategies

### Intuition
There is no "best search" — there is only the best search **for this data and this query pattern**. The three questions that decide it: is the data sorted? how many queries will I run? can I afford extra memory or an index?

### The idea, step by step
**1. One search, unsorted, small.** Linear search. Sorting would cost more than scanning.

**2. Many searches, unsorted.** Sort once, then binary search. Break-even is around `log2 n` queries (worked out in 4.9).

**3. Many searches, values keep changing.** A hash map (average `O(1)` lookup) or a balanced tree / Fenwick tree for range queries — hashing arrives in DSA-2.

**4. Sorted but on a linked list.** Linear search, because jumping to the middle costs `O(n)`.

**5. Structured data.** Row-and-column sorted matrix → staircase. Monotone feasibility question → binary search the answer.

### Formula / rule / table
| Situation | Best choice | Cost per search | Why |
|---|---|---|---|
| Unsorted, searched once | linear search | `O(n)` | sorting would cost more |
| Unsorted, `q >> log n` searches | sort once + binary search | `O(log n)` after `O(n log n)` | the sort is paid back quickly |
| Already sorted array | binary search | `O(log n)` | halving works |
| Duplicates, need first/last | lower / upper bound | `O(log n)` | boundary, not any hit |
| Rotated sorted array | modified binary search | `O(log n)` | one half is always sorted |
| Sorted linked list | linear search | `O(n)` | no random access |
| Key → value lookups, no order needed | hash map | `O(1)` average | direct addressing |
| Row- and column-sorted matrix | staircase | `O(m + n)` | one direction per comparison |
| "Smallest x that works" | binary search the answer | `O(n log range)` | monotone feasibility |
| Insert / delete heavy | balanced BST (later) | `O(log n)` | keeps order under change |

**Example question:** Choose a strategy with a one-line reason. (a) A 50-element unsorted list searched once. (b) A 1,000,000-element unsorted array searched 100,000 times. (c) A sorted array where you must report the first and last index of `42`. (d) A sorted singly linked list of 10,000 nodes searched once. (e) 500 sorted queries into a row-and-column sorted 1000×1000 matrix.

**Solution:**
- **(a) Linear search.** Reason: `n = 50` is at most 50 comparisons; sorting costs far more.
- **(b) Sort once, then binary search.** Reason: `100,000` queries at `O(n) = 10^6` each is `10^11`, while `O(n log n)` sort ≈ `2×10^7` plus `100,000 × 20 = 2×10^6` lookups.
- **(c) Lower and upper bound.** Reason: two `O(log n)` boundary searches give both indices, even with duplicates.
- **(d) Linear search.** Reason: reaching the middle of a linked list is `O(n)`, so binary search gains nothing.
- **(e) Staircase from the top-right.** Reason: `O(m + n) = 2000` steps per query versus `O(m·n) = 10^6`; for 500 queries that is `10^6` versus `5×10^8`.

**Final answer:** (a) linear (b) sort + binary (c) lower/upper bound (d) linear (e) staircase, `O(m+n)` per query.

⚠️ **Common trap:** "binary search is always faster". On an unsorted array it is *wrong*, not merely slow, and on a linked list it is `O(n log n)` — worse than a plain scan. Always state the precondition (sorted, random access) with the recommendation.

## 4.9 Complexity of searching

### Intuition
Sorting is an investment. You pay `O(n log n)` once, then every search costs `O(log n)` instead of `O(n)`. With one query the investment loses; with a thousand queries it wins massively. This is exactly the **time-space trade-off** from Module 1, and the arithmetic below is the exam-ready version of it.

### The idea, step by step
**1. Total cost of the two plans.** No sort: `q × n` comparisons. Sort first: `n log n` (the sort) `+ q × log n` (the searches).

**2. Compare them.** Sorting wins when `q·n > n log n + q log n`, which rearranges to roughly `q > log2 n`. So for `n = 1,000,000`, `log2 n ≈ 20`: more than about 20 queries and pre-sorting pays.

**3. Numbers for `n = 10^6`.**

| Queries `q` | Scan every time `q·n` | Sort once + binary `n log n + q log n` | Winner |
|---|---|---|---|
| 10 | `10^7` | `1.99×10^7` | scan |
| 100 | `10^8` | `1.99×10^7` | sort |
| 1,000 | `10^9` | `2.0×10^7` | sort |
| 100,000 | `10^11` | `2.2×10^7` | sort |

(using `log2(10^6) ≈ 19.93`)

**4. The catch — updates.** If elements are inserted between queries, a sorted array must be re-sorted or shifted (`O(n)` per insert). That is when a balanced BST or a hash map earns its keep, and it is why "sort + binary search" is for **static** data.

**5. Link to M5.** Sorting is the enabler: it converts an `O(n)` search into `O(log n)` and, with two pointers (M3), turns many `O(n^2)` problems into `O(n log n)`.

### Formula / rule / table
```text
no sorting:        total = q * n
pre-sort once:     total = n log n + q log n
pre-sorting wins when q > log2(n)      (roughly)
```
**Meaning:** `n` = data size, `q` = number of searches. **When to use:** deciding whether to sort before a batch of queries. **Tiny example:** `n = 10^6`, `q = 1000` → `10^9` versus `2×10^7`, so pre-sort.

**Example question:** An array of `n = 1,000,000` integers must answer `q = 100` membership queries. (a) Give the cost of scanning for each query. (b) Give the cost of sorting once then binary searching. (c) At roughly what `q` do the two plans break even? (d) What changes if new elements are inserted between queries?

**Solution:**
- **Step 1.** Scanning: `q × n = 100 × 10^6 = 10^8` comparisons. Reason: each query may examine every element.
- **Step 2.** Sorting: `n log2 n ≈ 10^6 × 19.93 ≈ 1.99×10^7`. Reason: `O(n log n)` comparison sort.
- **Step 3.** Searches: `100 × 19.93 ≈ 2×10^3`, so the total is about `1.99×10^7`. Reason: `O(log n)` per query.
- **Step 4.** `1.99×10^7 < 10^8`, so pre-sorting wins by about 5×. Reason: the sort is paid back after roughly `log2 n ≈ 20` queries.
- **Step 5.** Break-even: solve `q·n = n log n + q log n` → `q(n - log n) = n log n` → `q ≈ n log n / (n - log n) ≈ log2 n ≈ 20`. Reason: for large `n`, `n - log n ≈ n`.
- **Step 6.** With insertions, the sorted array must shift `O(n)` per insert or be replaced by a balanced BST (`O(log n)` insert and search) or a hash map (`O(1)` average search). Reason: static sorted arrays cannot absorb changes cheaply.

**Final answer:** (a) `10^8` comparisons (b) ≈`1.99×10^7` (c) about `q = 20`, i.e. `log2 n` (d) the sorted-array plan breaks down; use a balanced BST or hash map.

⚠️ **Common trap:** comparing only the per-query cost (`log n` versus `n`) and forgetting the `O(n log n)` sort. For a single query, "sort then binary search" is `O(n log n)`, which is *slower* than one `O(n)` scan. Also state the assumption: the break-even `q ≈ log2 n` holds for static data.

## 4.10 Search patterns as interview staples

### Intuition
Interviewers love binary search because it tests **careful thinking**, not memorised code. The question is rarely "write binary search"; it is "here is a weird constraint — can you see that the answer is a boundary?" The thought process below is what to say out loud.

### The idea, step by step
**1. Clarify the data.** Sorted? Static or changing? Duplicates? What is `n`? What is the time limit? ("Sorted, static, `n` up to 10^5" already points at `O(log n)` or `O(n log n)`.)

**2. Say the brute force first.** "Scanning everything is `O(n)` per query / `O(n^2)` overall." Interviewers want to hear the baseline.

**3. Name the optimisation out loud.** "Since it is sorted, one comparison eliminates half the range, so `O(log n)`." Then state what the answer space is.

**4. Write the invariant as a comment, then the loop.** `// invariant: if target exists it is in a[lo..hi]`. This signals control of the classic bug source.

**5. Test six cases aloud.** Empty array; single matching element; single non-matching element; target below all; target above all; duplicates. Then state complexity and edge cases.

**6. For "minimum X that works" questions**, say the three-part structure: "the answer is monotone, `can(x)` is `O(n)`, so I binary search the answer in `O(n log range)`."

### Formula / rule / table
| Interview phrase | What they want |
|---|---|
| "sorted array, find target" | plain binary search, `O(log n)` |
| "first / last position of target" | lower / upper bound |
| "how many times does x appear" | `upper - lower` |
| "search in a rotated array" | binary search with a sorted-half check |
| "minimum capacity / speed / size" | binary search on the answer |
| "k-th smallest in a sorted matrix" | binary search on the value range |
| "find peak element" | binary search on the slope (`a[mid] < a[mid+1]` → go right) |

**Example question:** You are asked: "A conveyor belt has packages with weights `{1,2,3,4,5,6,7,8,9,10}` that must ship within 5 days. What is the smallest ship capacity?" Write the reasoning you would say out loud, then the answer.

**Solution:**
- **Step 1 (clarify).** Weights are positive, order is fixed, capacity is an integer, one trip per day, all packages must ship. Reason: these decide whether a greedy check is valid.
- **Step 2 (brute force).** "I could try every capacity from 10 to 55 and simulate the days: `O(n · sum)` — too slow if `n` and weights grow."
- **Step 3 (spot monotonicity).** "If capacity `c` works, any bigger capacity also works, because each day's load only grows. So the answer is the first `true` in a monotone sequence."
- **Step 4 (bounds).** `lo = max(weights) = 10` (a smaller ship can never carry the 10 kg parcel), `hi = sum = 55` (one trip carries everything).
- **Step 5 (check).** `canShip(c)` fills greedily, `O(n)`.
- **Step 6 (binary search).** `lo=10, hi=55`, `mid=32`: capacity 32 takes 2 days (`1..7 = 28`, then `8,9,10 = 27`) → `2 <= 5` → `hi=32`. `mid=21`: 3 days (`1..6 = 21`, then `7,8 = 15`, then `9,10 = 19`) → `hi=21`. `mid=15`: 5 days → `hi=15`. `mid=12`: 6 days → `lo=13`. `mid=14`: 6 days → `lo=15`. Now `lo = hi = 15`.
- **Step 7 (verify + state).** Capacity 15 → days: `1..5` (15), `6,7` (13), `8` , `9`, `10` = 5 days ✅; capacity 14 needs 6 ✗. Time `O(n log(sum))`, space `O(1)`.

**Final answer:** minimum capacity **15**, found with about 6 feasibility checks instead of 46.

⚠️ **Common trap:** answering immediately with code. Without saying "the feasibility is monotone, so I can binary search the answer", the interviewer cannot tell whether you understood the pattern or guessed it. Also do not forget to state the bounds (`lo`, `hi`) — an unstated `hi` is where wrong answers hide.

## Formula / rule summary table
| Question type | Technique | Time | Space |
|---|---|---|---|
| Unsorted, one search | linear search | `O(n)` | `O(1)` |
| Sorted, exact match | binary search, closed interval | `O(log n)` | `O(1)` |
| Sorted, first/last occurrence | lower / upper bound | `O(log n)` | `O(1)` |
| Sorted, count occurrences | `upper - lower` | `O(log n)` | `O(1)` |
| Sorted, insert position | lower bound | `O(log n)` | `O(1)` |
| Rotated sorted array | binary search + sorted-half check | `O(log n)` | `O(1)` |
| "Smallest x that works", monotone | binary search on the answer | `O(n log range)` | `O(1)` |
| Row- and column-sorted matrix | staircase from top-right | `O(m + n)` | `O(1)` |
| Many queries on static unsorted data | sort once, then binary search | `O(n log n + q log n)` | `O(1)` extra |
| Peak element | binary search on the slope | `O(log n)` | `O(1)` |

**Which one when?** *unsorted* → linear. *sorted* → binary. *boundary words* (first, last, insert) → lower/upper bound. *"minimum/maximum value such that"* → binary search the answer. *grid sorted in both directions* → staircase.

## Solved examples
**Example 1 (easy) — count occurrences of a value in a sorted array.** `a = {1, 2, 2, 2, 5, 7}`, `target = 2` → 3 occurrences.

- **Step 1.** `lowerBound(a, 2) = 1`. Reason: first index whose value is `>= 2`.
- **Step 2.** `upperBound(a, 2) = 4`. Reason: first index whose value is `> 2`.
- **Step 3.** Count `= 4 - 1 = 3`. Reason: everything in `[1, 4)` equals 2.
- **Step 4.** Cost `O(log n)` twice → `O(log n)`; space `O(1)`.

**Example 2 (medium) — integer square root by binary search on the answer.** `x = 10` → 3, because `3*3 = 9 <= 10` and `4*4 = 16 > 10`.

```java
static int mySqrt(int x) {
    if (x < 2) return x;                 // 0 -> 0, 1 -> 1
    int lo = 1, hi = x / 2;              // sqrt(x) never exceeds x/2 for x >= 4
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (mid * mid == x) return mid;  // exact square
        else if (mid * mid < x) lo = mid + 1;
        else hi = mid - 1;
    }
    return hi;                           // hi is the largest value whose square <= x
}
```

- **Step 1.** `lo=1, hi=5`; `mid=3`, `9 <= 10` → `lo=4`. Reason: 3 is feasible, try bigger.
- **Step 2.** `mid=4`, `16 > 10` → `hi=3`. Reason: 4 is too big.
- **Step 3.** `lo=4 > hi=3` → loop ends, return `hi = 3`. ✅
- **Step 4.** `O(log x)` steps (the range halves), `O(1)` space. `mySqrt(8) = 2`, `mySqrt(16) = 4`.

**Example 3 (exam level) — split array largest sum.** `a = {7, 2, 5, 10, 8}`, `k = 2` → 18.

- **Step 1.** Answer range: `lo = max(a) = 10`, `hi = sum(a) = 32`. Reason: no part can be smaller than the biggest element, and one part could hold everything.
- **Step 2.** `can(limit)` = "greedily fill parts up to `limit`; is the part count `<= k`?" — monotone, because a bigger limit never needs more parts.
- **Step 3.** `mid = 21`: `{7,2,5}` (14), `{10,8}` (18) → 2 parts `<= 2` → feasible → `hi = 21`.
- **Step 4.** `mid = 15`: `{7,2,5}` (14), `{10}` , `{8}` → 3 parts `> 2` → infeasible → `lo = 16`.
- **Step 5.** `mid = 18`: `{7,2,5}` (14), `{10,8}` (18) → 2 parts → feasible → `hi = 18`.
- **Step 6.** `mid = 17`: `{7,2,5}` (14), `{10}` , `{8}` → 3 parts → infeasible → `lo = 18`. Now `lo = hi = 18`.
- **Step 7.** Verify: `{7,2,5,10}` = 24 is worse, so 18 is the minimum possible largest part. ✅
- **Step 8.** Cost `O(n log(sum))` = `O(5 × 5)`, versus `O(n^k)` for trying every split.

**Example 4 (exam level) — find a peak element in `O(log n)`.** `a = {1, 2, 1, 3, 5, 6, 4}` → peak at index 5 (value 6).

- **Step 1.** A **peak** is an element greater than its neighbours (ends have one neighbour). Reason: with `a[i] != a[i+1]` a peak always exists.
- **Step 2.** Idea: if `a[mid] < a[mid+1]` the sequence is going up, so a peak must be to the right; else it is at `mid` or to the left.
- **Step 3.** `lo=0, hi=6`, `mid=3` (`3 < 5`) → `lo=4`. `mid=5` (`6 > 4`) → `hi=5`. `lo=hi=5` → index 5.
- **Step 4.** Check: `a[5] = 6 > a[4] = 5` and `> a[6] = 4`. ✅
- **Step 5.** `O(log n)` time (range halves), `O(1)` space.

## Common traps and mistakes
- **Binary search on unsorted data.** No error, just a wrong answer — check sortedness before you code.
- **Mixing `[lo, hi]` and `[lo, hi)`.** `hi = n-1` with `lo < hi` misses the last element; `hi = n` with `lo <= hi` reads out of bounds.
- **`mid = (lo + hi) / 2` with huge indices.** `int` overflow gives a negative index; use `lo + (hi - lo)/2`.
- **`lo = mid` instead of `lo = mid + 1`.** When `hi = lo + 1` the range never shrinks and the loop hangs — always shrink by at least one.
- **Returning a middle hit for "first occurrence".** With duplicates, plain binary search lands anywhere; use the lower bound.
- **Forgetting the bound check after a lower bound.** `a[lowerBound(a, x)]` may be `a[n]` for an absent value.
- **Binary search on a linked list.** Reaching the middle is `O(n)`, so it is slower than scanning.
- **Non-monotone `can(x)` in binary-search-on-the-answer.** If the predicate flips more than once, the answer is meaningless.
- **Wrong `hi` bound in answer search.** Too small a `hi` silently returns an infeasible answer; `sum`, `max` or `n` are the safe choices.
- **Comparing `Integer` objects with `==`** in a sorted `Integer[]` — use `compareTo`/`intValue`, or work with `int[]`.

## Quick revision box
- ✅ Linear search: `O(n)` time, `O(1)` space, works on any data — the honest baseline.
- ✅ Binary search needs **sorted + random access**; it halves the range each step → `O(log n)`, about `floor(log2 n) + 1` comparisons.
- ✅ `mid = lo + (hi - lo)/2` always; pick one interval convention and write the invariant as a comment.
- ✅ Lower bound = first `>= target`, upper bound = first `> target`, count = `upper - lower`, last occurrence = `upper - 1`.
- ✅ Rotated array: one half is always sorted; check which, then test whether the target lies inside it.
- ✅ Binary search on the answer: monotone `can(x)`, bounded range, `O(n log range)` — solves ship capacity (15), eating speed (4 for `{3,6,7,11}`, `h=8`), split array (18).
- ✅ Row- and column-sorted matrix: staircase from the top-right, `O(m + n)`.
- ✅ Pre-sorting pays off when `q > log2 n`; for changing data use a BST or hash map instead.

## Practice questions
1. `a = {3, 8, 12, 17, 25, 31}` (sorted). How many comparisons does binary search need for `target = 25`, and how many for `target = 4`? Show `lo`, `hi`, `mid` at each step.
2. Why does `int mid = (lo + hi) / 2` fail for `lo = 1_500_000_000`, `hi = 1_600_000_000`? Give the correct `mid`.
3. `a = {1, 2, 2, 2, 4, 4, 7}`. Give `lowerBound(a, 4)`, `upperBound(a, 4)`, the count of 4s, and the insert position of 5.
4. `a = {6, 7, 8, 1, 2, 3, 4}` (rotated). Trace the search for `target = 3`, listing `lo`, `hi`, `mid` and which half is sorted.
5. Parcels `{3, 2, 2, 4, 1, 4}` must ship in 3 days. Using binary search on the answer, find the minimum capacity and show two feasibility checks.
6. An array of `n = 10^6` unsorted values will be searched `q = 5` times. Should you sort first? Justify with numbers.

## Answers
1. `target = 25`: `lo=0, hi=5, mid=2` (12) → `lo=3`; `mid=4` (25) → found at index **4** in 2 comparisons. `target = 4`: `mid=2` (12) → `hi=1`; `mid=0` (3) → `lo=1`; `mid=1` (8) → `hi=0`; range empty → **absent**, 3 comparisons, return `-1`.
2. `lo + hi = 3_100_000_000 > 2_147_483_647`, so it overflows and `mid` becomes negative; correct `mid = 1_500_000_000 + 50_000_000 = 1_550_000_000`.
3. `lowerBound(a, 4) = 4`, `upperBound(a, 4) = 6`, count `= 2`; insert position of 5 is `6` (first element `>= 5` is `7` at index 6), giving `{1,2,2,2,4,4,5,7}`.
4. `lo=0, hi=6, mid=3` (`1`); left half `6..1` is not sorted, right half `1..4` is sorted and `3` lies in it → `lo=4`; `lo=4, hi=6, mid=5` (`3`) → found at index **5**.
5. `lo = max = 4`, `hi = sum = 16`. `mid = 10`: `{3,2,2}` (7), `{4,1,4}` (9) → 2 days `<= 3` → feasible, `hi = 10`. `mid = 7`: `{3,2,2}` (7), `{4,1}` (5), `{4}` → 3 days → feasible, `hi = 7`. `mid = 5`: `{3,2}` (5), `{2}`, `{4,1}` (5), `{4}` → 4 days → infeasible, `lo = 6`. `mid = 6`: `{3,2}` (5), `{2,4}` (6), `{1,4}` (5) → 3 days → feasible, `hi = 6`. Minimum capacity = **6**.
6. Do **not** sort. Scanning 5 times costs `5 × 10^6 = 5×10^6` comparisons, while sorting costs about `10^6 × 19.93 ≈ 2×10^7` plus lookups — roughly 4× worse, since break-even needs `q > log2 n ≈ 20`.
