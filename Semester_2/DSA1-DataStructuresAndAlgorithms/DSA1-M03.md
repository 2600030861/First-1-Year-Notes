# DSA-1 – Module 3

## Arrays, Strings & the Core Patterns
*Friend-style notes: intuition first, then the formula, then a small example.*

## The big picture
Almost every program keeps a **collection** of things: marks of 60 students, letters of a word, prices in a cart. The cheapest container for a collection is the **array** — a row of slots sitting next to each other in memory. A **string** is an array of characters with sugar on top (`length()`, `charAt`).

Here is the real point: most "hard" array/string problems are not hard because of the array. They are hard because the obvious solution is `O(n²)` and the expected one is `O(n)`. The gap is almost always one of four patterns — **two pointers**, **sliding window**, **prefix sums**, **hashing**.

One analogy for the module: a long **train of coaches**. Two pointers = two guards walking in from the two ends. Sliding window = a spotlight of fixed or growing width gliding along the train. Prefix sum = an odometer on every coach reading "total distance so far". Hashing = a guard's notebook.

Where you will reuse this: linked lists reuse two pointers, sorting (M5) exists largely to *enable* binary search and two pointers, and DP (DSA-3) is often prefix sums grown up.

## Basics you must know first
- **Index** — slot number, starting at **0** in Java, so an array of length `n` has indices `0..n-1`.
- **Contiguous memory** — slots stored back-to-back with no gaps; this is why index arithmetic works.
- **Big-O** (Module 1) — describe growth with input size `n`; drop constants.
- **`char` is a number** — `'a'` is 97, so `c - 'a'` gives `0`; that is how a 26-slot counting array is indexed.
- **Java arrays** — `int[] a = new int[5];` gives five zeroes; `int[] b = {1,2,3};` gives a filled one; `a.length` (no brackets) is the size; `a[0]` reads a slot.
- **`String` is immutable** — `s = s + "x"` builds a whole new string. Use `StringBuilder` in loops.

## 3.1 Arrays and strings as the workhorse data
### Intuition
Picture a row of numbered **school lockers**: 0, 1, 2, ... in one straight line, all the same size. Ask "what is in locker 37?" and you walk straight there — the lockers are equally spaced, so you can compute the address instead of counting doors. That is **random access**, and it is why arrays are fast. The flip side: shove a new locker into the middle and every locker after it must shift.

### The idea, step by step
**1. Storage.** Elements sit back-to-back; the machine remembers only the address of slot 0, the **base address**. An `int` in Java is 4 bytes.

**2. Indexing is arithmetic, not search.**

```text
address(i) = base + i * size_of_one_element
```

Base 1000, `int` = 4 bytes → `a[5]` lives at `1000 + 5*4 = 1020`. One multiply, one add, whatever `n` is. Hence `O(1)`.

**3. Searching.** Unsorted → you must look at every slot, `O(n)`. Sorted → binary search, `O(log n)` (Module 4). Note: the *array* did not change, the *order of the data* did.

**4. Insert / delete cost shifting.** Deleting the element at index `i` pulls every later element one slot left; worst case (index 0) that is `n-1` moves → `O(n)`.

**5. Strings are arrays with rules.** `"hello".charAt(2)` is `'l'` in `O(1)`. But `substring(1,4)` copies, so `O(length)`; `s + t` copies both, so `O(|s| + |t|)`.

### Formula / rule / table
Costs for an array of `n` elements:

| Operation | Cost | One-line reason |
|---|---|---|
| Read / write `a[i]` | `O(1)` | address = base + i*size, pure arithmetic |
| Search, unsorted | `O(n)` | must inspect every slot in the worst case |
| Search, sorted | `O(log n)` | each comparison discards half the array |
| Insert / delete at front or middle | `O(n)` | every later element shifts |

Space is `O(n)` with `O(1)` overhead — no per-element pointer like a linked list.

```java
public class ArrayBasics {
    public static void main(String[] args) {
        int[] a = {5, 8, 12, 19, 25};          // indices 0..4
        System.out.println(a.length);          // 5
        System.out.println(a[2]);              // 12  -> one arithmetic step
        // insert 7 at index 2: everything from index 2 shifts right
        int[] b = new int[a.length + 1];
        for (int i = 0; i < 2; i++) b[i] = a[i];              // left part unchanged
        b[2] = 7;                                             // new value
        for (int i = 2; i < a.length; i++) b[i + 1] = a[i];   // shift right
        for (int x : b) System.out.print(x + " ");            // 5 8 7 12 19 25
    }
}
```

Prints `5`, then `12`, then `5 8 7 12 19 25`. Time `O(n)` (the shift touches up to `n` elements), space `O(n)` (the new array).

**Example question:** An `int` array `a = {5, 8, 12, 19, 25}` starts at base address 2000. (a) Where does `a[3]` live? (b) How many element moves does inserting `7` at index 2 cost, and what is the result? (c) Time complexity of that insert, with a reason?

**Solution:**

- **Step 1.** `int` = 4 bytes, so `address(3) = 2000 + 3*4 = 2012`. Reason: indexing formula.
- **Step 2.** Elements at indices 2, 3, 4 (`12, 19, 25`) each move one slot right → **3 moves**. Reason: everything from the insertion index onward shifts.
- **Step 3.** Result `{5, 8, 7, 12, 19, 25}` — left part untouched, `7` placed, right part shifted.
- **Step 4.** `O(n)` time, because the worst case (insert at index 0) moves all `n` elements; here 3 of 5 moved. Space `O(n)` for the bigger array.

**Final answer:** (a) 2012 (b) 3 moves, `{5, 8, 7, 12, 19, 25}` (c) `O(n)` time, `O(n)` space.

⚠️ **Common trap:** "Insert is `O(1)`, I only assign one slot." The assignment is `O(1)`; the *shifting* is `O(n)` and it is what you must count. Also `a.length` is the size, not the last index — `a[a.length]` throws `ArrayIndexOutOfBoundsException`.

## 3.2 Dynamic arrays
### Intuition
You booked a table for 4; eight friends arrive. You cannot stretch the table — you book a **bigger** one and carry every plate across. If each new table is **twice** as big, you rarely carry anything, so on average each new guest costs almost nothing. That is a **dynamic array** (`ArrayList` in Java).

Keep two words apart: **size** = how many elements are stored; **capacity** = how many slots the current block has.

### The idea, step by step
**1. Start small.** `new ArrayList<>()` has size 0.

**2. Append with room.** `add(x)` writes at position `size`, then `size++`. `O(1)`, no shifting.

**3. Append when full.** If `size == capacity`, allocate a block of **double** capacity, copy the old elements (`O(capacity)`), then write the new one.

**4. Why doubling and not +1.** Growing by one slot means *every* append copies everything: `1 + 2 + ... + n = n(n+1)/2` → `O(n²)` total, i.e. `O(n)` per append. Doubling makes copies rare.

**5. The doubling argument.** Start at capacity 1, append 16 elements:

| Append no. | Capacity after | Elements copied | Why |
|---|---|---|---|
| 1 | 1 | 0 | room available |
| 2 | 2 | 1 | full: grow 1→2 |
| 3 | 4 | 2 | full: grow 2→4 |
| 5 | 8 | 4 | full: grow 4→8 |
| 9 | 16 | 8 | full: grow 8→16 |

Total copies = `1+2+4+8 = 15 < 16`. In general copies sum to `1+2+4+...+n/2 < n`, so over `n` appends the total work is at most `2n` writes → **`O(1)` amortised** per append. "**Amortised**" = averaged over a long sequence, even though one individual operation may be expensive.

```java
import java.util.ArrayList;

public class GrowDemo {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();   // size 0
        for (int i = 1; i <= 8; i++) list.add(i);      // append, usually O(1)
        System.out.println(list);        // [1, 2, 3, 4, 5, 6, 7, 8]
        System.out.println(list.size()); // 8
        System.out.println(list.get(3)); // 4  (index 3 = 4th element)
        list.add(0, 99);                 // insert at front -> shifts all 8 elements
        System.out.println(list);        // [99, 1, 2, 3, 4, 5, 6, 7, 8]
        list.remove(0);                  // delete at front -> shifts again
        System.out.println(list);        // [1, 2, 3, 4, 5, 6, 7, 8]
    }
}
```

Prints the four lines above. `add(x)` at the end: `O(1)` amortised. `add(0,x)` and `remove(0)`: `O(n)` (shifting). `get(i)`: `O(1)`. Space: `O(n)`.

**Example question:** An empty dynamic array starts with capacity 1 and doubles when full. We append `n = 1024` elements. (a) Total element copies? (b) Average copies per append? (c) Amortised cost, with a one-line reason?

**Solution:**

- **Step 1.** Capacity goes `1,2,4,...,1024`; each growth copies the old contents, so copies = `1+2+4+...+512`.
- **Step 2.** `2^0 + 2^1 + ... + 2^9 = 2^10 - 1 = 1023` copies. Reason: geometric series.
- **Step 3.** Average `1023/1024 ≈ 0.999 < 1` copy per append. Reason: total copy work is below `n`.
- **Step 4.** Total work ≈ `1024` writes + `1023` copies ≈ `2n` = `O(n)`.
- **Step 5.** `O(n)` ÷ `n` appends = **`O(1)` amortised**, because the copy sizes form a geometric series dominated by its last term.

**Final answer:** (a) 1023 copies (b) just under 1 per append (c) `O(1)` amortised.

⚠️ **Common trap:** saying "append is `O(1)`" bare. Say "`O(1)` **amortised**, `O(n)` worst case for the append that triggers a resize". Also `ArrayList` does not expose its capacity — do not confuse `size()` with capacity, and `remove(0)` is `O(n)`, not free.

## 3.3 The brute-force baseline
### Intuition
Brute force is "check everything, miss nothing" — finding a matching pair of socks by comparing every sock with every other. Slow, but always correct, and it gives you the answer to test the fast version against. Writing it first earns method marks even if the optimisation stalls.

### The idea, step by step
**1. State the problem plainly.** "Find two elements that add up to the target."

**2. Write the obvious loops.** Every pair `(i, j)` with `i < j`:

```java
public class BrutePairSum {
    public static void main(String[] args) {
        int[] a = {2, 7, 11, 15};
        int target = 9;
        int checks = 0;
        for (int i = 0; i < a.length; i++) {
            for (int j = i + 1; j < a.length; j++) {   // only pairs, not (j,i) again
                checks++;
                if (a[i] + a[j] == target)
                    System.out.println("Pair: " + a[i] + " + " + a[j] + " after " + checks + " check");
            }
        }
    }
}
```

Prints `Pair: 2 + 7 after 1 check`.

**3. Count the work.** Inner loop runs `3+2+1 = 6` times for `n = 4`, which is `n(n-1)/2`. For `n = 1000` that is 499,500 checks.

**4. Read off the complexity.** Two nested loops each up to `n` → `O(n²)` time; two variables → `O(1)` space.

**5. Spot the waste.** For each `i` we rescan the rest for `target - a[i]`. Two wastes: ignoring that the array is sorted (fixed by two pointers, 3.4) and re-scanning seen data (fixed by a map, 3.8).

### Formula / rule / table
| Brute-force shape | Time | Why |
|---|---|---|
| One loop | `O(n)` | one visit per element |
| All pairs `i < j` | `O(n²)` | `n(n-1)/2` checks, constants dropped |
| All substrings + `O(n)` check each | `O(n³)` | `O(n²)` starts × `O(n)` scanning |

```text
subarrays of a length-n array = n(n + 1) / 2
```

**Meaning:** `n` = array length. **When to use:** to count how many windows exist and prove a brute force is `O(n²)`. **Tiny example:** `n = 7` → `7*8/2 = 28`.

**Example question:** For `s = "abcabcbb"` (length 7), brute force finds the longest substring with no repeating character by trying every substring. (a) How many substrings? (b) Cost of checking one? (c) Overall complexity, and which pattern does it in `O(n)`?

**Solution:**

- **Step 1.** `n(n+1)/2 = 7*8/2 = 28` substrings. Reason: a substring is fixed by its start and end.
- **Step 2.** Checking one costs up to its length, `O(n) = 7` here. Reason: touch each character once.
- **Step 3.** `28 × 7 = 196` inspections worst case → `O(n³)`. Reason: `O(n²)` substrings × `O(n)` check.
- **Step 4.** A **sliding window** with a "last seen position" table does it in `O(n)`, because each character enters and leaves the window once.

**Final answer:** (a) 28 (b) `O(n)` (c) `O(n³)` brute force; sliding window gives `O(n)`.

⚠️ **Common trap:** jumping to the clever solution and getting stuck. Also, `O(n²)` is fine when `n ≤ 10⁴` (≈10⁸ operations is the usual 1-second budget) — do not "optimise" a problem whose limits do not need it.

## 3.4 The two-pointer pattern
### Intuition
Two guards walk a corridor of doors. **Opposite ends:** they start at the two ends and walk towards each other, one step at a time, until they meet. **Same direction:** one walks fast, one slowly; the slow one is the "write" hand, the fast one the "read" hand. Because both pointers only move forward, the total number of steps is at most `2n` — that is how `O(n²)` becomes `O(n)`.

### The idea, step by step
**1. Opposite ends: pair-sum in a sorted array.** We need `a[i] + a[j] == target`. If the sum is **too small**, only a bigger left value helps, so `i++` (moving `j` left makes it smaller still). If it is **too big**, only a smaller right value helps, so `j--`. If it is equal, we found it. Each move permanently discards one candidate, so there are at most `n-1` iterations.

**2. Dry run.** `a = {1, 3, 4, 6, 8, 10}`, `target = 10`:

| Step | Variables | What changed |
|---|---|---|
| 1 | `i=0, j=5`, sum `1+10=11` | too big → `j--` |
| 2 | `i=0, j=4`, sum `1+8=9` | too small → `i++` |
| 3 | `i=1, j=4`, sum `3+8=11` | too big → `j--` |
| 4 | `i=1, j=3`, sum `3+6=9` | too small → `i++` |
| 5 | `i=2, j=3`, sum `4+6=10` | equal → answer |

Answer `4 + 6`, in 5 checks instead of the 15 pairs brute force would try.

**3. Code.**

```java
public class PairSumSorted {
    public static void main(String[] args) {
        int[] a = {1, 3, 4, 6, 8, 10};    // MUST be sorted for this pattern
        int target = 10;
        int i = 0, j = a.length - 1;       // one finger at each end
        while (i < j) {                    // they must never cross
            int sum = a[i] + a[j];
            if (sum == target) {
                System.out.println("Found: " + a[i] + " + " + a[j]);
                break;
            } else if (sum < target) {
                i++;                       // need a larger sum -> left finger right
            } else {
                j--;                       // need a smaller sum -> right finger left
            }
        }
    }
}
```

Prints `Found: 4 + 6`. Time `O(n)` — each iteration moves one pointer, so the gap `j-i` shrinks by one. Space `O(1)`.

**4. Same direction: compaction in place.** Push zeroes to the end while keeping the order of the rest:

```java
int[] a = {0, 1, 0, 3, 12};
int slow = 0;                                  // next slot for a non-zero
for (int fast = 0; fast < a.length; fast++)
    if (a[fast] != 0) a[slow++] = a[fast];     // copy non-zeroes to the left
while (slow < a.length) a[slow++] = 0;         // pad the tail
// a is now {1, 3, 12, 0, 0}
```

Time `O(n)` — one read pass plus one pad pass. Space `O(1)` — no new array.

**5. Two more uses of the same idea.** **Reverse:** swap `a[i]` with `a[j]`, then `i++, j--`; `n/2` swaps give `O(n)` time and `O(1)` space, so `{1,2,3,4,5}` becomes `{5,4,3,2,1}` (the palindrome check is the same walk, comparing characters). **Partition** (quicksort's core step, M5): same-direction pointers, swapping every `a[fast] <= pivot` to `slow`; on `{9,4,7,2,8,1}` with `pivot = 5` you get `{4,2,1,9,7,8}` — small ones first, order inside each part not preserved.

### Formula / rule / table
| Variant | Pointers move | Use when | Cost |
|---|---|---|---|
| Opposite ends | `i++` or `j--` | sorted data, pairs, reversal, palindrome | `O(n)` |
| Same direction | both forward | in-place compaction, dedup, partition | `O(n)` |
| Fast/slow on a list | different speeds | cycle detection, middle (M6) | `O(n)` |

Before/after: pair-sum in a sorted array goes from `O(n²)` (all pairs) to `O(n)` (one inward sweep), using `O(1)` extra space. If the array is **not** sorted you must sort first: `O(n log n)` + `O(n)` = `O(n log n)`, still far better than `O(n²)`.

**Example question:** `a = {1, 2, 3, 4, 6}` is sorted. Using two pointers, list every pair with sum exactly 6, showing the pointer positions after each move.

**Solution:**

- **Step 1.** `i=0` (`1`), `j=4` (`6`): sum `7 > 6` → `j--`. Reason: sum too big.
- **Step 2.** `i=0, j=3`: sum `1+4 = 5 < 6` → `i++`. Reason: sum too small.
- **Step 3.** `i=1, j=3`: sum `2+4 = 6` → **pair (2,4)**. Then move both. Reason: reusing either index would repeat the same value.
- **Step 4.** `i=2, j=2` → `i < j` false, stop. 3 iterations for `n = 5` → `O(n)`.
- **Step 5.** Brute-force cross-check: the pairs sum to `3,4,5,7,5,6,8,7,9,10`; only `(2,4)` is 6.

**Final answer:** one pair, `2 + 4 = 6`, found in 3 iterations; `O(n)` time, `O(1)` space.

⚠️ **Common trap:** two pointers on an **unsorted** array for pair-sum — the "move the smaller side" logic is only valid because sorted order tells you which direction increases the sum. Also use `while (i < j)`, not `i <= j`, or an element gets paired with itself.

## 3.5 The sliding-window pattern
### Intuition
A **spotlight** of fixed width slides along a line of boxes. Move it one box right: one box enters, one leaves. You never re-count the inside — add the newcomer, subtract the leaver. That single trick turns "recompute the window" (`O(n·k)`) into "one add, one subtract" (`O(n)`). Two flavours: **fixed window** (width `k` given) and **variable window** (width grows and shrinks, e.g. "longest substring with no repeats").

It works when the property is **monotone**: extending the window cannot repair a broken property, and shrinking eventually restores it. Sums of positives, distinct counts, character counts — all fine.

### The idea, step by step
**1. Fixed window: build the first one.** Sum `a[0..k-1]`, then for each new right edge do `window += a[end] - a[end-k]` — one add, one subtract, `O(1)` per step.

**2. Dry run.** `a = {2, 1, 5, 1, 3, 2}`, `k = 3`:

| Step | Variables | What changed |
|---|---|---|
| start | `window = 2+1+5 = 8`, `best = 8` | first window, indices 0..2 |
| end=3 | `window = 8+1-2 = 7` | added `a[3]=1`, dropped `a[0]=2` |
| end=4 | `window = 7+3-1 = 9`, `best = 9` | added `a[4]=3`, dropped `a[1]=1` |
| end=5 | `window = 9+2-5 = 6` | added `a[5]=2`, dropped `a[2]=5` |

Best = 9, the window `{5, 1, 3}` starting at index 2.

**3. Code, fixed window.**

```java
int[] a = {2, 1, 5, 1, 3, 2};
int k = 3;
int window = 0;
for (int i = 0; i < k; i++) window += a[i];   // first window
int best = window;
for (int end = k; end < a.length; end++) {
    window += a[end] - a[end - k];            // one enters, one leaves
    if (window > best) best = window;
}
System.out.println(best);                     // prints 9
```

Prints `9`. Time `O(n)` — `O(k)` to seed plus `n-k` steps of `O(1)`. Space `O(1)`. Brute force is `O(n·k)`: for `n = 100000, k = 1000` that is 10⁸ additions against 10⁵.

**4. Variable window: the shrink loop.**

```text
left = 0
for right = 0 .. n-1:
    add a[right] to the window
    while (window is invalid): remove a[left]; left++
    update the answer with this valid window
```

**5. Code, variable window** — longest substring without repeating characters:

```java
public class LongestUnique {
    public static void main(String[] args) {
        String s = "abcabcbb";
        int[] lastSeen = new int[128];   // lastSeen[c] = position AFTER c's last appearance
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastSeen[c] > left) left = lastSeen[c];  // jump past the earlier copy
            lastSeen[c] = right + 1;                     // +1 so that 0 means "never seen"
            best = Math.max(best, right - left + 1);
        }
        System.out.println(best);        // 3
    }
}
```

Prints `3` (the substring `"abc"`).

| right | char | Variables | What changed |
|---|---|---|---|
| 0 | a | `left=0, best=1` | window `"a"` |
| 1 | b | `left=0, best=2` | window `"ab"` |
| 2 | c | `left=0, best=3` | window `"abc"` |
| 3 | a | `left=1, best=3` | `a` repeated, dropped |
| 4 | b | `left=2, best=3` | window `"cab"` |
| 5 | c | `left=3, best=3` | window `"abc"` |

Time `O(n)` — `right` moves `n` times and `left` only moves forward, so at most `2n` steps. Space `O(1)`, because the alphabet is a fixed 128 characters.

### Formula / rule / table
| Window type | Loop shape | Answer updated | Typical question |
|---|---|---|---|
| Fixed `k` | one loop, no shrink | best sum/min/max per block | "best 3-day average" |
| Variable, longest | grow, shrink `while` invalid | `right - left + 1` | "longest with at most 2 distinct" |
| Variable, shortest | grow, shrink `while` valid | `right - left + 1` | "smallest subarray with sum ≥ target" |

Before/after: recomputing each window is `O(n·k)`; maintaining it incrementally is `O(n)`. For `n = 10⁵, k = 10³`: 10⁸ → 10⁵ operations, a 1000× saving.

**Example question:** For `a = {4, 2, 1, 7, 8, 1, 2, 8, 1, 0}` and `k = 3`, find the maximum sum of any 3 consecutive elements with a sliding window, and say which window achieves it.

**Solution:**

- **Step 1.** First window `4+2+1 = 7`, `best = 7`.
- **Step 2.** end=3: `7 + 7 - 4 = 10`, `best = 10` (indices 1..3). Reason: add entrant, subtract leaver.
- **Step 3.** end=4: `10 + 8 - 2 = 16`, `best = 16` (indices 2..4 = `1+7+8`).
- **Step 4.** end=5: `16 + 1 - 1 = 16` (indices 3..5 = `7+8+1`); leaver and entrant are equal, so the sum does not move.
- **Step 5.** end=6: `16+2-7 = 11`; end=7: `11+8-8 = 11`; end=8: `11+1-1 = 11`; end=9: `11+0-2 = 9`.
- **Step 6.** Cross-check all windows: `7, 10, 16, 16, 11, 11, 11, 9`. Max is 16. ✅
- **Step 7.** `O(n)` time (one add, one subtract per step), `O(1)` space.

**Final answer:** max sum = **16**, reached by indices 2..4 (`1+7+8`) and indices 3..5 (`7+8+1`).

⚠️ **Common trap:** using `if` instead of `while` in the shrink step — one new element can invalidate the window and need *several* removals. Also never re-sum the window inside the loop "for clarity": that quietly turns `O(n)` back into `O(n·k)`, which is exactly what examiners look for.

## 3.6 The prefix-sum pattern
### Intuition
Think of your **bank statement**: every row shows the balance *so far*. To know what you spent between the 10th and the 20th, you do not add ten rows — you subtract the 9th balance from the 20th. A **prefix sum array** is that running balance, computed once. After `O(n)` setup, every range sum is `O(1)`. That is the classic **space-for-time trade**: spend `O(n)` memory to kill `O(n)` work per query.

### The idea, step by step
**1. Define it.** `pre[0] = 0` and `pre[i] = a[0] + ... + a[i-1]`, so `pre[i]` is the sum of the first `i` elements and `pre` has length `n + 1`. That leading zero is what keeps the formula clean.

**2. Build in one pass.** `pre[i+1] = pre[i] + a[i]`, `O(n)`.

**3. Answer a query.** `sum(a[l..r]) = pre[r+1] - pre[l]`, `O(1)`. Why: `pre[r+1]` covers everything up to `r`, and subtracting `pre[l]` removes everything before `l`.

**4. Dry run.** `a = {3, 1, 4, 1, 5, 9, 2}`:

| i | a[i] | pre after | Meaning |
|---|---|---|---|
| — | — | `pre[0]=0` | sum of nothing |
| 0 | 3 | `pre[1]=3` | `a[0..0]` |
| 1 | 1 | `pre[2]=4` | `a[0..1]` |
| 2 | 4 | `pre[3]=8` | `a[0..2]` |
| 3 | 1 | `pre[4]=9` | `a[0..3]` |
| 4 | 5 | `pre[5]=14` | `a[0..4]` |
| 5 | 9 | `pre[6]=23` | `a[0..5]` |
| 6 | 2 | `pre[7]=25` | whole array |

Query `sum(2..5) = pre[6] - pre[2] = 23 - 4 = 19`. Check: `4+1+5+9 = 19`. ✅

**5. Code.**

```java
public class PrefixSum {
    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5, 9, 2};
        long[] pre = new long[a.length + 1];        // long, so big sums do not overflow
        for (int i = 0; i < a.length; i++) pre[i + 1] = pre[i] + a[i];   // running total
        System.out.println(rangeSum(pre, 2, 5));    // 19
        System.out.println(rangeSum(pre, 0, 3));    // 9
        System.out.println(rangeSum(pre, 6, 6));    // 2
    }
    // sum of a[l..r], both ends included, in O(1)
    static long rangeSum(long[] pre, int l, int r) {
        return pre[r + 1] - pre[l];
    }
}
```

Prints `19`, `9`, `2`. Build `O(n)` (one pass), each query `O(1)`, space `O(n)`.

**6. The difference array (the reverse trick).** "Add `v` to every element of `a[l..r]`", repeated `q` times, is `O(n·q)` done directly. Keep instead a **difference array** `d`: `d[l] += v` and `d[r+1] -= v`, then prefix-sum `d` at the end. Total `O(n + q)`.

```java
int n = 8;
int[] d = new int[n + 1];                 // one spare slot for r+1 == n
addRange(d, 1, 4, 2);                     // +2 on indices 1..4
addRange(d, 3, 6, 3);                     // +3 on indices 3..6
int run = 0;
for (int i = 0; i < n; i++) { run += d[i]; System.out.print(run + " "); }
// prints: 0 2 2 5 5 3 3 0

static void addRange(int[] d, int l, int r, int v) {
    d[l] += v;        // the bump starts at l
    d[r + 1] -= v;    // and is cancelled just after r
}
```

Index 3 got `+2` from the first range and `+3` from the second = 5. ✅

### Formula / rule / table
```text
pre[0] = 0
pre[i] = pre[i-1] + a[i-1]            for i = 1..n
sum(a[l..r]) = pre[r+1] - pre[l]      both ends inclusive
add v to a[l..r]:  d[l] += v;  d[r+1] -= v
```

**Meaning:** `pre` is the running-total array of length `n+1`; `l, r` are 0-based with `l <= r`. **When to use:** many range-sum queries on a static array, or "count subarrays with sum `k`" (with a map). **Tiny example:** `a = {3,1,4,1,5,9,2}`, `sum(2..5) = 23 - 4 = 19`.

| Approach | Build | Per query | `q` queries | Space |
|---|---|---|---|---|
| Brute force each query | none | `O(n)` | `O(n·q)` | `O(1)` |
| Prefix sums | `O(n)` | `O(1)` | `O(n + q)` | `O(n)` |
| Difference array | none | `O(1)` per update | `O(n + q)` | `O(n)` |

**Example question:** An array has `n = 100000` elements and we must answer `q = 100000` queries of the form "sum of `a[l..r]`". Compare brute force with prefix sums, and say when prefix sums are the wrong choice.

**Solution:**

- **Step 1.** Brute force per query scans up to `n = 10⁵` elements → `10⁵` work per query.
- **Step 2.** Total `10⁵ × 10⁵ = 10¹⁰` operations. At roughly `10⁸` simple operations per second that is about **100 seconds** — too slow.
- **Step 3.** Prefix setup: one pass, `10⁵` additions, `O(n)`.
- **Step 4.** Queries: `10⁵` queries × 1 subtraction = `10⁵` operations, `O(1)` each.
- **Step 5.** Total `2×10⁵` operations ≈ **0.002 seconds**; speed-up `10¹⁰ / 2×10⁵ = 50,000×`.
- **Step 6.** Wrong choice when the array **changes** between queries: a static prefix array goes stale and rebuilding is `O(n)` per update (use a Fenwick/segment tree later, or a difference array when the queries all come at the end).

**Final answer:** brute force `O(n·q) = 10¹⁰` operations (≈100 s) versus prefix sums `O(n + q) = 2×10⁵` (≈0.002 s) for `O(n)` extra memory; prefix sums lose when the data is updated between queries.

⚠️ **Common trap:** off-by-one — `pre` has `n+1` entries and the query is `pre[r+1] - pre[l]`, **not** `pre[r] - pre[l]` (which silently drops `a[l]`). Second trap: summing into an `int`; `10⁵` elements near `10⁹` overflow `int` (max ≈ `2.1×10⁹`), so use `long`.

## 3.7 Recognising which pattern a problem needs
### Intuition
Patterns are kitchen tools: you do not stare at the drawer, you look at the ingredient. In DSA the ingredient is a **signal word** in the question. Three signals decide almost everything — is the data **sorted**? must the answer be **contiguous**? are there **many range queries**?

### The idea, step by step
**1. Read for "sorted".** Sorted (or "you may sort") → **two pointers** or **binary search**. Sorted order is what makes "move the smaller side" legal.

**2. Read for "subarray / substring / consecutive / window of size k".** Contiguous → **sliding window** (or prefix sums if negatives are present).

**3. Read for "many queries / range sum / sum between i and j".** → **prefix sums**.

**4. Read for "pair / duplicate / count of / have I seen this".** → **hash map** (3.8).

**5. Read for "subsequence" or "any order".** Subsequence is **not** contiguous, so sliding window does **not** apply — think DP or sorting.

**6. Read the limits.** `n ≤ 10⁵` means "we want `O(n)` or `O(n log n)`"; `n ≤ 20` allows exponential; `n ≤ 10⁹` with a yes/no answer means binary search on the answer (M4).

### Formula / rule / table
| Signal in the question | Pattern | Cost |
|---|---|---|
| "sorted", "pair with sum", "palindrome" | two pointers (opposite ends) | `O(n)` |
| "in place", "remove duplicates", "move zeroes", "partition" | two pointers (same direction) | `O(n)` |
| "subarray of size k", "max average of k days" | fixed sliding window | `O(n)` |
| "longest / shortest subarray with property", all positive | variable sliding window | `O(n)` |
| "sum of a[l..r]", many queries, array never changes | prefix sums | `O(n)` build, `O(1)` query |
| "count subarrays with sum k", "seen before?" | prefix sums + hash map | `O(n)` |
| "find x in sorted data", "smallest value that works" | binary search (M4) | `O(log n)` |

**Which one when?** see *sorted* → two pointers / binary search; *contiguous* → sliding window; *range query* → prefix sums; *counting or lookup* → hash map; *subsequence* → none of these, think DP.

**Example question:** Name the pattern for each, with a one-line justification. (a) sorted array, do two numbers add to 20? (b) highest average over any 7 consecutive days of temperatures. (c) 200000 integers and 200000 queries `sum(l, r)`. (d) longest substring with at most 2 distinct characters. (e) count subarrays with sum exactly 5.

**Solution:**

- **(a) Two pointers, opposite ends.** Sorted → the "too small / too big" decision is meaningful, `O(n)`.
- **(b) Fixed sliding window of size 7.** "7 consecutive days" is a fixed-width contiguous block, `O(n)`.
- **(c) Prefix sums.** Static array, many range queries: pay `O(n)` once, answer each in `O(1)`.
- **(d) Variable sliding window.** Contiguous + "longest with a property" + the property is monotone, `O(n)`.
- **(e) Prefix sums + hash map.** "Count subarrays with a sum" and negatives are possible, so a window breaks; counting `pre[j] - pre[i] == 5` works, `O(n)`.

**Final answer:** (a) two pointers (b) fixed window (c) prefix sums (d) variable window (e) prefix sums + hash map.

⚠️ **Common trap:** confusing **subarray** (contiguous) with **subsequence** (not contiguous) — a sliding window on a subsequence question gives a wrong answer that looks plausible. Second trap: a variable window on an array with **negatives**; shrinking no longer reduces the sum monotonically, so "smallest subarray with sum ≥ target" silently breaks. Prefix sums survive negatives; windows do not.

## 3.8 Combining patterns
### Intuition
A **hash map** is a notebook with instant lookup: write "value → where I saw it", then ask "did I see this?" in `O(1)` instead of scanning. Inside the patterns above it deletes the inner loop. This is a trailer for hashing in DSA-2; here we only need put, get and count.

### The idea, step by step
**1. Two-sum on an unsorted array.** Brute force is `O(n²)`. Instead, for each element ask the map "have I seen `target - a[i]`?" — one pass, `O(n)`.

```java
import java.util.HashMap;
int[] a = {2, 7, 11, 15};
int target = 9;
HashMap<Integer, Integer> seen = new HashMap<>();   // value -> index
for (int i = 0; i < a.length; i++) {
    if (seen.containsKey(target - a[i])) {
        System.out.println(seen.get(target - a[i]) + " " + i);   // prints: 0 1
        break;
    }
    seen.put(a[i], i);                              // remember before moving on
}
```

**2. Counting inside a window.** For "longest substring with at most 2 distinct characters" the window keeps a map `char → count`; validity is `map.size() <= 2`, and shrinking decrements counts and removes a key at 0. Still `O(n)`: each character enters once and leaves at most once.

**3. Counting subarrays with a given sum.** We need `pre[j] - pre[i] == k`, i.e. `pre[i] == pre[j] - k`. So keep a map "prefix sum → how many times seen" and add the count of `run - k`.

```java
import java.util.HashMap;
int[] a = {1, 2, 3, -2, 2};
int k = 4;
HashMap<Integer, Integer> count = new HashMap<>();
count.put(0, 1);                 // the empty prefix occurs once
int run = 0, answer = 0;
for (int x : a) {
    run += x;                                               // prefix sum ending here
    answer += count.getOrDefault(run - k, 0);               // earlier prefixes leaving k
    count.put(run, count.getOrDefault(run, 0) + 1);
}
System.out.println(answer);      // prints: 1
```

The subarray `{1, 2, 3, -2}` sums to 4. Time `O(n)` average, space `O(n)`.

### Formula / rule / table
| Combination | What the map stores | Complexity |
|---|---|---|
| Two pointers + map | values already passed | `O(n)` time, `O(n)` space |
| Sliding window + map | element → count inside the window | `O(n)` time, `O(k)` space |
| Prefix sum + map | prefix sum → occurrence count | `O(n)` time, `O(n)` space |

**Example question:** `a = {1, 2, 3, -2, 2}`, `k = 4`. Using prefix sums plus a hash map, count the subarrays summing to exactly 4, showing the map after every step.

**Solution:**

- **Step 1.** `count = {0:1}` (the empty prefix), `run = 0`, `answer = 0`. Reason: a subarray starting at index 0 has an empty prefix before it.
- **Step 2.** x=1: `run = 1`, look for `-3` → 0 hits, store `1:1`.
- **Step 3.** x=2: `run = 3`, look for `-1` → 0, store `3:1`.
- **Step 4.** x=3: `run = 6`, look for `2` → 0, store `6:1`.
- **Step 5.** x=-2: `run = 4`, look for `0` → **1 hit**, `answer = 1`, store `4:1`. Reason: prefix 0 occurred once, so one subarray ends here with sum 4 — indices 0..3.
- **Step 6.** x=2: `run = 6`, look for `2` → 0, store `6:2`; `answer` stays 1.
- **Step 7.** Cross-check by hand: the 15 subarrays sum to `1,3,6,4,6,8,2,5,3,1,3,5,2,4,2`; only the fourth is 4. ✅
- **Step 8.** One pass with `O(1)` average map work → `O(n)` time, `O(n)` space.

**Final answer:** **1** subarray (indices 0..3), found in `O(n)` time.

⚠️ **Common trap:** forgetting `count.put(0, 1)` before the loop — then every subarray starting at index 0 is missed, a silent wrong answer. When counting, **increment** the stored count instead of overwriting, or duplicate prefix sums collapse into one.

## 3.9 String-specific problems
### Intuition
A string is an array of characters, so every pattern above applies. Three jobs come up again and again: **searching** (where is this pattern inside this text?), **matching** (does it occur, how many times?) and **transformation** (reverse the words, check anagrams). The only extra care is that Java strings are **immutable**, so building a string character by character is secretly `O(n²)`.

### The idea, step by step
**1. Naive matching.** Line the pattern up at every start position and compare character by character:

```java
public class NaiveMatch {
    public static void main(String[] args) {
        String text = "aaaa", pat = "aa";
        int count = 0;
        for (int i = 0; i + pat.length() <= text.length(); i++) {   // every start position
            int j = 0;
            while (j < pat.length() && text.charAt(i + j) == pat.charAt(j)) j++;
            if (j == pat.length()) count++;                        // whole pattern matched
        }
        System.out.println(count);    // 3
    }
}
```

Prints `3` — matches start at indices 0, 1 and 2.

**2. Why it is slow.** There are `n - m + 1` start positions and up to `m` comparisons each, so `O(n·m)`. Here `(4-2+1) × 2 = 6` comparisons. The worst case is text `"aaaaaaaaab"` with pattern `"aaab"`: every start position compares 4 characters before failing, so `O(n·m)` really happens. That is why real tools use KMP or Boyer–Moore, which pre-process the pattern for `O(n + m)` (DSA-2/3 material).

**3. Transformation: reverse the words.** `"the sky is blue"` → `"blue is sky the"`.

```java
String s = "the sky is blue";
String[] words = s.split(" ");                 // ["the","sky","is","blue"]
StringBuilder sb = new StringBuilder();
for (int i = words.length - 1; i >= 0; i--) {  // walk backwards
    sb.append(words[i]);
    if (i > 0) sb.append(" ");                 // no trailing space
}
System.out.println(sb.toString());             // blue is sky the
```

Time `O(n)` — each character is copied once (using `StringBuilder`, not `s += ...`). Space `O(n)`.

**4. Transformation: anagram check.** Two strings are **anagrams** if one is a rearrangement of the other (`"listen"` / `"silent"`). Count each letter with a 26-slot array and compare.

```java
public class Anagram {
    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent"));   // true
        System.out.println(isAnagram("hello", "world"));     // false
    }
    static boolean isAnagram(String a, String b) {
        if (a.length() != b.length()) return false;          // different sizes -> impossible
        int[] count = new int[26];
        for (int i = 0; i < a.length(); i++) {
            count[a.charAt(i) - 'a']++;                      // add letters of a
            count[b.charAt(i) - 'a']--;                      // remove letters of b
        }
        for (int c : count) if (c != 0) return false;        // any leftover -> not an anagram
        return true;
    }
}
```

Prints `true` then `false`. Time `O(n)` — two linear passes over fixed 26 slots. Space `O(1)` — 26 counters, independent of `n`.

### Formula / rule / table
| String task | Pattern used | Cost |
|---|---|---|
| Count occurrences of a pattern | naive matching | `O(n·m)` |
| Reverse words / reverse string | two pointers, `StringBuilder` | `O(n)` |
| Anagram check | counting array (26 slots) | `O(n)` time, `O(1)` space |
| Longest substring with property | sliding window | `O(n)` |

**Example question:** (a) How many comparisons does the naive matcher make for text `"aaaa"` and pattern `"aa"`, and how many matches does it find? (b) Why is `s = s + c` inside a loop over a string of length `n` an `O(n²)` mistake, and what should you use?

**Solution:**

- **Step 1.** Start positions `i = 0, 1, 2` because `i + m <= n` → `i <= 4-2 = 2`, so `n - m + 1 = 3` positions. Reason: the pattern must fit inside the text.
- **Step 2.** Each position compares up to `m = 2` characters → `3 × 2 = 6` comparisons worst case.
- **Step 3.** All three positions match (`"aa"` at 0, 1, 2), so the count is **3**.
- **Step 4.** `s = s + c` copies the whole current string each time: lengths `1 + 2 + ... + n = n(n+1)/2` → `O(n²)` character copies. Reason: Java strings are immutable, so `+` builds a new object.
- **Step 5.** Use `StringBuilder` and `sb.append(c)`, which grows like a dynamic array → `O(1)` amortised per append, `O(n)` total.

**Final answer:** (a) 6 comparisons, 3 matches (b) `+` copies the entire string each time, giving `O(n²)`; use `StringBuilder` for `O(n)`.

⚠️ **Common trap:** `s += c` (or `s = s + c`) inside a loop — a hidden `O(n²)` that passes small tests and times out on large ones. Also `==` compares string *references*, not contents; use `a.equals(b)`. And `charAt` is `O(1)` but `substring` copies, so calling it in a loop can quietly cost `O(n²)`.

## 3.10 Complexity of the patterns
### Intuition
The patterns are not magic — each one just refuses to look at the same data twice. Brute force asks "for every start, check everything"; a pattern asks "what can I remember or add/subtract so I never re-check?" That is the whole story, and it is why the same four ideas keep appearing.

### The idea, step by step
**1. Count the work in one line.** Brute force: `O(n²)` because of nested loops over starts and ends. Pattern: `O(n)` because each pointer or window edge moves forward only.

**2. Where the extra space goes.** Two pointers `O(1)`; sliding window `O(1)` or `O(k)` for a count map; prefix sums `O(n)`; prefix + map `O(n)`. That is the trade you are making.

**3. Sorting as a prerequisite.** Two pointers on unsorted data costs `O(n log n)` (the sort) + `O(n)` = `O(n log n)`, which still beats `O(n²)`.

**4. The exam sentence.** "Brute force is `O(n²)`; with a two-pointer sweep the inner loop disappears, so it is `O(n)` time and `O(1)` space."

### Formula / rule / table
| Problem | Brute force | Pattern | Pattern cost | What we gained |
|---|---|---|---|---|
| Pair with given sum (sorted) | `O(n²)` | two pointers | `O(n)`, `O(1)` space | no re-scanning |
| Max sum of size-`k` window | `O(n·k)` | sliding window | `O(n)`, `O(1)` space | incremental sum |
| Longest substring, no repeats | `O(n³)` | sliding window | `O(n)`, `O(1)` space | window never rewinds |
| Range sum, `q` queries | `O(n·q)` | prefix sums | `O(n+q)`, `O(n)` space | precomputed totals |
| `q` range-adds | `O(n·q)` | difference array | `O(n+q)`, `O(n)` space | two writes per update |
| Count subarrays with sum `k` | `O(n²)` | prefix + map | `O(n)`, `O(n)` space | both tricks together |

**Example question:** A problem says: "Given an array of `n ≤ 2·10⁵` integers (possibly negative) and a target `k`, count the subarrays whose sum is exactly `k`." (a) Give the brute force and its cost. (b) Give the best pattern and its cost. (c) Explain in one line why the sliding window cannot be used here.

**Solution:**

- **Step 1.** Brute force: for each start, extend the end and keep a running sum → `n(n+1)/2` subarrays, `O(n²)` time, `O(1)` space.
- **Step 2.** For `n = 2·10⁵`, that is about `2·10¹⁰` operations — far beyond the ≈`10⁸` per second budget, so it will time out.
- **Step 3.** Best pattern: prefix sums plus a hash map of "prefix sum → count", one pass → `O(n)` time, `O(n)` space.
- **Step 4.** The sliding window needs monotonicity: with negatives, extending the window can *decrease* the sum, so shrinking no longer restores the property and a valid window can be skipped.
- **Step 5.** Before/after: `O(n²)` ≈ `2·10¹⁰` → `O(n)` = `2·10⁵`, roughly a 100,000× saving, paid for with `O(n)` memory.

**Final answer:** (a) `O(n²)`, `O(1)` space (b) prefix sums + hash map, `O(n)` time and `O(n)` space (c) negatives break the monotonicity the window depends on.

⚠️ **Common trap:** quoting the pattern's complexity without saying which pattern or why. "It is `O(n)`" earns nothing; "one pass, each element enters and leaves the window once, so `O(n)`" earns the mark.

## Formula / rule summary table
| If the question says... | Reach for | Time | Space |
|---|---|---|---|
| "sorted", "two numbers that add to..." | two pointers, opposite ends | `O(n)` | `O(1)` |
| "in place", "move / remove / partition" | two pointers, same direction | `O(n)` | `O(1)` |
| "subarray / substring of size k" | fixed sliding window | `O(n)` | `O(1)` |
| "longest / shortest with a property", all positive | variable sliding window | `O(n)` | `O(1)` or `O(k)` |
| "sum of a[l..r]", many queries, static data | prefix sums | `O(n)` build, `O(1)` query | `O(n)` |
| "add v to [l..r]" many times | difference array | `O(n + q)` | `O(n)` |
| "count subarrays with sum k", negatives allowed | prefix sums + hash map | `O(n)` | `O(n)` |
| "seen before?", "duplicate?", "frequency" | hash map | `O(n)` average | `O(n)` |
| "find in sorted data", "smallest value that works" | binary search (M4) | `O(log n)` | `O(1)` |

**Which one when?** *sorted* → two pointers or binary search. *contiguous* → sliding window. *range query* → prefix sums. *lookup or counting* → hash map. *subsequence* → none of these.

## Solved examples
**Example 1 (easy–medium) — smallest subarray with sum ≥ target.** `a = {2, 3, 1, 2, 4, 3}`, `target = 7`; answer is 2 (the subarray `{4, 3}`).

- **Step 1.** Grow the window: `2` (sum 2), `2,3` (5), `2,3,1` (6), `2,3,1,2` (8 ≥ 7).
- **Step 2.** Shrink while valid: drop 2 → 6 (invalid). Length was 4, `best = 4`.
- **Step 3.** Extend: `3,1,2,4` → 10; shrink: drop 3 → 7 (valid, length 3, `best = 3`); drop 1 → 6.
- **Step 4.** Extend: `1,2,4,3` → 10; shrink: drop 1 → 9 (length 3); drop 2 → 7 (length 2, `best = 2`); drop 4 → 3.
- **Step 5.** No window shorter than 2 works, so the answer is 2. `O(n)` time (each index enters and leaves once), `O(1)` space.

**Example 2 (exam level) — product of array except self, without division.** `a = {1, 2, 3, 4}` → `{24, 12, 8, 6}`.

- **Step 1.** `out[i]` = (product of everything left of `i`) × (product of everything right of `i`). Reason: splitting avoids division, which breaks on zeroes.
- **Step 2.** Left pass: `out = {1, 1, 2, 6}` (`out[i] = out[i-1] * a[i-1]`).
- **Step 3.** Right pass with a running `right = 1`: `i=3` → `out[3] = 6*1 = 6`, `right = 4`; `i=2` → `out[2] = 2*4 = 8`, `right = 12`; `i=1` → `out[1] = 1*12 = 12`, `right = 24`; `i=0` → `out[0] = 1*24 = 24`.
- **Step 4.** Result `{24, 12, 8, 6}`. Check: `2·3·4=24`, `1·3·4=12`, `1·2·4=8`, `1·2·3=6`. ✅
- **Step 5.** Two passes → `O(n)` time; the output array is `O(n)` space and no division is used.

**Example 3 (exam level) — longest substring with at most 2 distinct characters.** `s = "eceba"` → 3 (`"ece"`).

- **Step 1.** Window `"e"`: map `{e:1}`, size 1, valid, `best = 1`.
- **Step 2.** `"ec"`: `{e:1,c:1}`, valid, `best = 2`.
- **Step 3.** `"ece"`: `{e:2,c:1}`, valid, `best = 3`.
- **Step 4.** `"eceb"`: `{e:2,c:1,b:1}` size 3 → invalid; drop `e` → `{e:1,c:1,b:1}` still 3; drop `c` → `{e:1,b:1}` valid, window `"eb"`, length 2.
- **Step 5.** `"eba"`: `{e:1,b:1,a:1}` size 3 → shrink to `"ba"`, length 2. `best` stays 3.
- **Step 6.** Answer 3. Time `O(n)` — each character enters once and leaves at most once; space `O(1)` for a fixed alphabet.

## Common traps and mistakes
- **Using two pointers on unsorted data for pair-sum.** The "move the smaller side" rule assumes sorted order; on unsorted input it skips the answer and costs the whole question.
- **`if` instead of `while` when shrinking a window.** One new element can break the property and need several removals; with `if` the window stays invalid and the answer is too small.
- **Recomputing the window sum inside the loop.** `O(n·k)` instead of `O(n)` — the optimisation is exactly what is being tested.
- **Off-by-one in prefix sums.** Query is `pre[r+1] - pre[l]`; writing `pre[r] - pre[l]` drops one element silently.
- **Overflow in sums.** `int` holds about `2.1×10⁹`; summing `10⁵` values near `10⁹` needs `long`.
- **Saying "append is `O(1)`" without "amortised".** One append that resizes is `O(n)`.
- **`s += c` inside a loop.** `O(n²)` hidden in a one-liner; use `StringBuilder`.
- **Confusing subarray with subsequence.** Only contiguous ranges admit a sliding window.
- **Forgetting the `put(0, 1)` seed** in prefix-sum-plus-map counting, which loses every subarray starting at index 0.

## Quick revision box
- ✅ Array indexing is `O(1)` because `address(i) = base + i * size`; insert/delete in the middle is `O(n)` because of shifting.
- ✅ Dynamic array append is `O(1)` **amortised** by the doubling argument: copies `1+2+4+...+n/2 < n`.
- ✅ Always write the `O(n²)` brute force first, state its cost, then remove the inner loop.
- ✅ Two pointers (sorted or in-place) and sliding windows (contiguous) each give `O(n)` because every pointer moves forward only.
- ✅ Prefix sums: build `O(n)`, query `O(1)`, `sum(l..r) = pre[r+1] - pre[l]`; difference arrays do `q` range-adds in `O(n + q)`.
- ✅ Signals: *sorted* → two pointers; *contiguous* → window; *range query* → prefix sums; *counting* → hash map; *subsequence* → DP.
- ✅ Variable windows need **monotone** properties: negatives break sum-based windows, so use prefix sums + map there.

## Practice questions
1. `a = {2, 4, 6, 8, 10}` is sorted. Find two elements summing to 14 using two pointers, listing the pointer moves.
2. An empty dynamic array starts at capacity 1 and doubles. After 33 appends, what is the capacity, and how many copies happened in total?
3. `a = {1, 2, 3, 4, 5}`: give `pre`, then `sum(1..3)` using it. Then apply `+5` to indices 0..2 with a difference array and state the resulting array.
4. `a = {1, 1, 2, 2, 3}` — remove duplicates in place with same-direction pointers, and state the resulting prefix and its length.
5. `s = "abcabcbb"` — state the longest substring without repeating characters and the number of iterations the sliding window takes.
6. `a = {5, 1, 2, 3, 4}` and `k = 6` — count the subarrays summing to 6 using prefix sums plus a hash map, showing the map state.

## Answers
1. `i=0 (2), j=4 (10)` → `12 < 14` → `i++`; `i=1 (4), j=4` → `14` → **pair `4 + 10`**, in 2 moves. `O(n)` time.
2. Capacity after 33 appends is **64** (it doubles at append 2, 3, 5, 9, 17, 33). Copies = `1+2+4+8+16+32 = 63`. Average `63/33 ≈ 1.9` per append overall, still `O(1)` amortised.
3. `pre = {0, 1, 3, 6, 10, 15}`; `sum(1..3) = pre[4] - pre[1] = 10 - 1 = 9` (check `2+3+4 = 9`). Difference array: `d[0] += 5`, `d[3] -= 5` → prefix-summed array `{6, 7, 8, 4, 5}`.
4. `slow=0`, then keep `1`, skip the second `1`, keep `2`, skip the second `2`, keep `3` → prefix `{1, 2, 3}` of length **3**; `O(n)` time, `O(1)` space.
5. Longest is `"abc"`, length **3**. The window takes 8 iterations (one per character); `left` moves 0→1→2→3→5→7, so at most `2n = 16` pointer moves.
6. Map starts `{0:1}`. `run=5`: look for `-1`, 0 hits, store `5:1`. `run=6`: look for `0` → **1 hit** (subarray `{5,1}`), store `6:1`. `run=8`: look for `2`, 0 hits, store `8:1`. `run=11`: look for `5` → **1 hit** (subarray `{1,2,3}`), store `11:1`. `run=15`: look for `9`, 0 hits, store `15:1`. Total **2** subarrays, in `O(n)` time.
